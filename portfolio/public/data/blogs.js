export const blogs = [
  {
    id: "abcde-heartbert-ecg-encoding",
    title: "ABCDE Is Not a Spelling Error. It's Your Heart.",
    image: "/blog-covers/abcde-heartbert.jpg",
    excerpt: "I fed an ECG signal to a language model. Not as numbers. As a sentence made of letters. Here is the trick that made it work.",
    body: `Here is a string of text produced by my code when I hand it a 10-second ECG recording:
 
\`\`\`
B C D E H K M N N M K H E D C B A
A B C E H L O P P O L H E C B A
A B C F J M P R R P M J F C B A
A B C E H K M N N M K H D B A
\`\`\`
 
That is not a typo. It is not corrupted output. It is a patient's heartbeat, encoded as a sentence, ready to be fed into a language model that was pretrained on text.
 
This is the core trick behind HeartBERT, a model I adapted for ECG classification as part of my BioSignal-XAI project. And once you understand how it works, it is one of those ideas that sounds almost too simple to be real.
 
## Why encode a waveform as text at all
 
The ECG signal is a time series. It is 1000 floating-point numbers sampled at 100 Hz, ten seconds of electrical activity from the heart, per lead. The natural thing to do with it is feed it into a convolutional network or a transformer that accepts raw tensors.
 
But HeartBERT is a RoBERTa model. It was pretrained on electrocardiogram descriptions written in natural language. Its weights know how to process tokens. Not floats. Tokens.
 
So the question becomes: how do you turn 1000 floats into something a tokenizer can digest without losing the shape of the signal?
 
The answer is quantisation into letters.
 
## The five lines that do everything
 
\`\`\`python
def _ecg_to_text(signal: np.ndarray, n_bins: int = 32) -> str:
    bins    = np.linspace(signal.min(), signal.max(), n_bins)
    indices = np.digitize(signal, bins).clip(0, n_bins - 1)
    letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    return " ".join(letters[i] for i in indices)
\`\`\`
 
That is the entire encoding. Five lines. Here is what each one does.
 
**\`np.linspace(signal.min(), signal.max(), n_bins)\`** divides the amplitude range of the signal into 32 equally spaced breakpoints. If the signal goes from −0.4 mV to +1.6 mV, the bins cover that 2.0 mV range in steps of about 0.063 mV each.
 
**\`np.digitize(signal, bins)\`** assigns each of the 1000 time samples to the bin it falls into. A sample near the bottom of the amplitude range gets index 0 or 1. A sample at a peak, an R-wave spike, gets index 28, 29, 30.
 
**\`.clip(0, n_bins - 1)\`** handles the edge case where a sample lands exactly on the boundary and digitize returns an out-of-range index.
 
**The letters string** maps each bin index to a character. Index 0 → 'A'. Index 25 → 'Z'. Index 26 → 'a'. Index 31 → 'f'. The heart at rest, near baseline, produces letters in the A–E range. An R-peak, the sharp spike that marks each heartbeat, jumps to letters like N, P, R.
 
**\`" ".join(...)\`** produces the final string with spaces between every letter, so the RoBERTa tokenizer treats each one as a separate token.
 
## What the signal actually looks like as text
 
Take a single Lead II recording, the most diagnostic single-lead view of the heart, from a healthy patient. The baseline hovers around zero. The P-wave, a small pre-beat bump, nudges the letter up to D or E. Then the R-peak, the tall sharp spike, fires the letter up to N or O. The S-wave immediately after drops it back to B. The T-wave, a gentler recovery hump, brings it up to G or H before settling back to baseline.
 
So a single heartbeat looks something like:
 
\`\`\`
A B C D E D C B A B D H N O N H D B A B D G H G D B A
\`\`\`
 
And an entire 10-second recording, with 8–10 heartbeats in it, produces roughly 1000 letters, one per 10 ms sample.
 
The shape of the signal is preserved. Not as exact floating-point values, but as the relative rhythm of letters rising and falling. A language model that has seen thousands of such strings during pretraining learns that the pattern \`A B D H N O N H D B\` is a heartbeat. That \`A A A A A\` for a long stretch might be a flat section or noise. That unusual patterns in the letters, high letters where there should be low ones, or erratic jumps, correspond to pathology.
 
## Into the tokenizer
 
Once the signal is text, it goes through the standard RoBERTa tokenizer:
 
\`\`\`python
def _encode(self, X: np.ndarray) -> dict:
    texts = [_ecg_to_text(x) for x in X]
    return self.tokenizer(
        texts,
        padding        = True,
        truncation     = True,
        max_length     = 512,
        return_tensors = "pt",
    )
\`\`\`
 
The tokenizer adds a \`[CLS]\` token at the start and a \`[SEP]\` token at the end. That leaves 510 slots for the ECG letters. Since we have 1000 samples but only 510 available token positions, about the last 490 samples of the 10-second signal get truncated. In practice this covers roughly the first 5 seconds of the recording, enough to capture 4–6 complete heartbeats, which is sufficient for classification.
 
## Fine-tuning with LoRA
 
HeartBERT has about 125 million parameters. Fine-tuning all of them for ECG classification would be expensive and prone to catastrophic forgetting of the ECG pretraining. Instead I used LoRA (Low-Rank Adaptation) which adds a small pair of low-rank matrices to the attention layers and freezes everything else.
 
\`\`\`python
cfg = LoraConfig(
    task_type      = TaskType.SEQ_CLS,
    r              = 16,
    lora_alpha     = 32,
    lora_dropout   = 0.1,
    target_modules = ["query", "value"],
    bias           = "none",
)
\`\`\`
 
With rank \`r=16\`, the adapters add roughly 1.2 million trainable parameters out of 125 million total. That is less than 1% of the model. The original HeartBERT weights stay frozen. Only the low-rank deltas learn the PTB-XL classification task.
 
The intuition for why this works: the pretrained model already understands the structure of ECG-as-text. The LoRA adapters teach it to apply that understanding to a specific five-class label space (NORM, MI, STTC, CD, HYP) rather than whatever task it was originally trained for.
 
## What the model actually attends to
 
After training, you can ask the model what part of the ECG sentence it looked at most when making its prediction. RoBERTa's attention mechanism produces a weight for each token in the sequence. The \`[CLS]\` token, which aggregates the full sequence for the classification head, attends to the tokens that mattered most.
 
\`\`\`python
def get_attention_weights(self, x: np.ndarray) -> tuple:
    enc = {k: v.to(self.device) for k, v in self._encode(x[np.newaxis]).items()}
    out = self.model(**enc, output_attentions=True)
    last_layer = out.attentions[-1]        # (1, num_heads, seq_len, seq_len)
    avg_heads  = last_layer[0].mean(dim=0) # (seq_len, seq_len)
    cls_attn   = avg_heads[0].cpu().numpy()  # CLS row → (seq_len,)
    ecg_attn   = cls_attn[1:-1]             # drop CLS and SEP tokens
    ecg_attn   = ecg_attn / (ecg_attn.max() + 1e-8)
    return np.arange(len(ecg_attn)), ecg_attn
\`\`\`
 
The last transformer layer, averaged across all attention heads, gives you a vector of weights over the 510 ECG letter tokens. Plotting those weights over the original waveform shows you which part of the signal the model was reading most carefully.
 
![HeartBERT CLS attention weights overlaid on Lead II signal for a correctly predicted MI record](/blog-images/heartbert-attention-mi.png)
 
*HeartBERT CLS attention weights overlaid on Lead II for a correctly predicted MI record. Higher opacity indicates higher attention. The model concentrated on the ST-segment region between the S-wave and T-wave; the exact region where ST elevation appears in myocardial infarction. True label: MI. Predicted: MI. Confidence: 0.81.*
 
For MI records, the model consistently attends to the ST segment, the region between the end of the QRS complex and the start of the T-wave where ST elevation is the primary diagnostic feature. For CD (conduction disorders), it tends to attend to the QRS complex itself, which widens in bundle branch block. This is not guaranteed clinical correctness, it is an observation about what a 125M-parameter model learned from text-encoded ECG data. But the fact that the attended regions are clinically plausible is reassuring.
 
## The honest trade-offs
 
Encoding ECG as text is a creative constraint, not a free lunch.
 
The 510-token limit covers only the first 5 seconds of a 10-second recording. For an arrhythmia that occurs at second 7, the model never sees it. ECGPTClassifier and HuBERTECGClassifier, which take raw tensors as input, work with the full 10-second signal.
 
The quantisation into 32 bins also loses information. Two samples that are 0.01 mV apart but happen to straddle a bin boundary get different letters. Two samples that are 0.06 mV apart but fall in the same bin get the same letter. The exact amplitude values that matter clinically, the precise height of an ST segment elevation, measured in millivolts, are rounded to the nearest bin.
 
And the tokenizer introduces another layer of indirection. A space-separated string of letters is not the natural format for ECG data. The model is doing more work than a network that receives a float tensor directly.
 
What it gains in return: HeartBERT pretraining, which gave the model weights that already understand ECG patterns expressed as language. Whether that pretraining advantage outweighs the information losses is an empirical question, and exactly the kind of thing the model comparison notebook in this project is designed to answer.
 
## Try it yourself
 
If you want to see the encoding and attention overlay on a real PTB-XL record, the interactive demo is live at [biosignalxai.streamlit.app](https://biosignalxai.streamlit.app). Open the Interactive Demo tab, pick a record from the curated test set, and you can see the attention weights overlaid on the signal alongside the classification result.
 
<iframe src="https://biosignalxai.streamlit.app/?embed=true" width="100%" height="600" frameborder="0" style="border-radius:8px;border:1px solid #e0e0e0;"></iframe>
 
Model selection is not available in the demo yet, for now, all records run through the default model. That part is coming. What you can already see is the attention weight overlay on the signal, which shows which regions of the ECG the model focused on when making its decision.
`,
    date: "2026-07-15",
    keywords: ["AI", "Deep Learning", "ECG", "NLP", "HeartBERT"],
    link: "/blogs/abcde-heartbert-ecg-encoding",
  },
  {
    id: "the-sound-of-a-diagnosis",
    title: "The Sound of a Diagnosis",
    image: "/blog-covers/sound-of-diagnosis.jpg",
    excerpt: "There is no audio file in this project. No .mp3, no .wav. Just two sine waves, an exponential decay, and a BPM that changes when something is wrong.",
    body: `The BioSignal-XAI project has a live demo at [biosignalxai.streamlit.app](https://biosignalxai.streamlit.app). Open the Interactive Demo tab, pick a record from the curated test set, run the model, and there is a Play heartbeat button. Most people click it expecting a recording. What they get instead is a sound that the browser generates on the spot, and that changes depending on what the model found in the signal.

There is no audio file anywhere in this project. No .mp3, no .wav, no recorded heartbeat sound. The heartbeat you hear when you click Play in the live demo is synthesized entirely in the browser, in real time, from math.

Here is how it works, and why it sounds the way it does.
 
## The Web Audio API and why it is the right tool
 
The Web Audio API is built into every modern browser. It gives you a graph of audio nodes (sources, effects, outputs) that you can wire together and schedule with sample-accurate timing. No libraries. No server calls. Just the browser and JavaScript.
 
The relevant node types here are two: the \`OscillatorNode\`, which generates a pure tone at a given frequency, and the \`GainNode\`, which controls the volume of whatever passes through it. A heartbeat sound is, at its core, two thumps in quick succession, the lub and the dub. Each thump is a brief burst of low-frequency sound that decays quickly. Which means each one is an oscillator running through a gain node whose volume drops fast.
 
\`\`\`javascript
function beat(ctx, startTime, freq, dur, vol) {
  var osc  = ctx.createOscillator();
  var gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(vol, startTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + dur + 0.05);
}
\`\`\`
 
This \`beat()\` function is the entire synthesis engine. Everything else is parameters and timing.
 
## Why exponential decay and not linear
 
The line that matters most is this one:
 
\`\`\`javascript
gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);
\`\`\`
 
The gain starts at the volume you set (say, 0.25) and ramps down to 0.0001 (essentially silence) over the duration \`dur\`. The ramp is exponential, not linear.
 
Linear decay would sound wrong. Human perception of loudness is logarithmic: a sound at half the amplitude does not sound half as loud, it sounds roughly 6 dB quieter, which our ears experience as a smaller change. A linear volume ramp sounds like the sound cuts off abruptly at the end rather than fading naturally. An exponential ramp follows the curve of how we actually hear. The sound falls off the way a real physical impact does, fast at first, then tapering.
 
The mathematical model is:
 
$$G(t) = G_0 \\cdot e^{-\\lambda t}$$
 
where $G_0$ is the starting gain, $t$ is time in seconds, and $\\lambda$ is the decay rate. A higher $\\lambda$ means a sharper, shorter thump. A lower $\\lambda$ means a rounder, longer tone.
 
The Web Audio API does not expose $\\lambda$ directly. You specify the target value and the time to reach it, and the browser computes the curve. Setting the target to 0.0001 (rather than 0) is intentional, \`exponentialRampToValueAtTime\` requires a non-zero target, because a true exponential never actually reaches zero.
 
## The lub and the dub
 
A normal heartbeat is not one sound. It is two: the "lub" (S1) and the "dub" (S2). S1 is the sound of the mitral and tricuspid valves closing at the start of ventricular contraction. S2 is the aortic and pulmonic valves closing at the end. They happen in quick succession, separated by a short gap, with a longer pause before the next cycle.
 
In the synthesis, S1 and S2 are two separate \`beat()\` calls scheduled slightly apart:
 
\`\`\`javascript
var now = ctx.currentTime;
beat(ctx, now,              freq1, dur1, volume);  // lub (S1)
beat(ctx, now + gap,        freq2, dur2, volume);  // dub (S2)
\`\`\`
 
For a normal sinus rhythm:
 
\`\`\`javascript
freq1: 80,   // Hz — S1 frequency
freq2: 100,  // Hz — S2 frequency (slightly higher)
dur1:  0.08, // seconds — S1 duration
dur2:  0.06, // seconds — S2 shorter, sharper
gap:   0.12, // seconds — time between S1 and S2
bpm:   62    // beats per minute
\`\`\`
 
S1 is slightly lower pitched than S2, and slightly longer. This matches the acoustics of real heart sounds as recorded with a stethoscope. The difference is subtle, 80 Hz vs 100 Hz, but it is enough to give the sound the characteristic double-beat quality rather than two identical thumps.
 
## How the anomaly changes the sound
 
When the model detects an anomaly: MI, STTC, CD, or HYP the parameters shift:
 
\`\`\`javascript
freq1: 140,  // Hz — higher, sharper
freq2: 170,  // Hz
dur1:  0.06, // shorter
dur2:  0.05,
gap:   0.08, // tighter gap between lub and dub
bpm:   78    // faster
\`\`\`
 
The frequency goes up from 80/100 Hz to 140/170 Hz. The individual beat durations shorten. The gap between S1 and S2 tightens. And the BPM increases from 62 to 78.
 
The result is a sound that is perceptibly more urgent. Not because the code is trying to be dramatic, but because these parameter changes reflect real physiological patterns. Pathological heart sounds tend to be higher pitched, shorter, and more rapid than normal sinus rhythm. The synthesis is a rough approximation of that relationship.
 
This is not a diagnostic audio tool. A clinician cannot use this to identify MI from the sound. What it does is give a non-expert user a fast, immediate, visceral sense that the classification result has changed, that this record is different from the last one.
 
## Connecting the BPM to the ECG
 
The BPM in the audio component is hardcoded at 62 for normal and 78 for anomaly. But the actual BPM of the ECG record you are listening to can be computed directly from the signal.
 
R-peaks, the tall spikes that mark each heartbeat, can be detected by finding local maxima in Lead II above a threshold:
 
\`\`\`python
from scipy.signal import find_peaks
 
lead_ii = signal[:, 1]                    # Lead II, 1000 samples at 100 Hz
peaks, _ = find_peaks(
    lead_ii,
    height    = lead_ii.mean() + 0.5 * lead_ii.std(),
    distance  = 50,                       # at least 0.5 s between peaks
)
rr_intervals = np.diff(peaks) / 100.0    # convert samples to seconds
bpm = 60.0 / rr_intervals.mean()         # average BPM
\`\`\`
 
In the PTB-XL dataset, normal records average around 62–72 BPM. Tachycardic records (fast heart rate) sit above 100. Bradycardic records fall below 60. The synthesized audio uses 62 and 78 as representative values for the two states, not the exact BPM of each individual record.
 
A more precise version would compute the actual RR intervals from the signal, extract the true BPM, and pass that into the audio synthesis. That is a straightforward extension, and one that would make the playback genuinely patient-specific rather than class-representative.
 
## Why this matters more than it seems
 
The heartbeat sound is one of the least technically complex things in this project. It is about 30 lines of JavaScript. The XAI pipeline, the PEFT training, the uncertainty estimation, all of those are harder.
 
But in user testing, it was the feature people noticed most. They would run the demo on a normal record, hear the steady low beat, then run it on an MI record, hear the higher faster rhythm, and something clicked that did not click from reading confidence scores. The number \`0.86\` for MI is information. The shift in sound is experience.
 
Explainability tools in clinical AI spend a lot of time trying to make model outputs legible to non-experts. Saliency maps, attention weights, probability bars, these are all designed for people who know how to read them. Audio is different. It bypasses the visual interpretation layer entirely. You hear that something is different before you process why.
 
That is worth something, even if the science behind the two-oscillator synthesis is rudimentary. The goal is not acoustic accuracy. It is perceptual immediacy.
 
## Try it yourself
 
The demo is live at [biosignalxai.streamlit.app](https://biosignalxai.streamlit.app). Open any record in the Interactive Demo tab, run the analysis, and click Play heartbeat. Then pick a different record from a different class and do the same. The change in sound is immediate.
 
<iframe src="https://biosignalxai.streamlit.app/?embed=true" width="100%" height="600" frameborder="0" style="border-radius:8px;border:1px solid #e0e0e0;"></iframe>
 
No audio files. No recordings. Two sine waves, a gap, and an exponential ramp. That is all a heartbeat needs to be.`,
    date: "2026-06-27",
    keywords: ["AI", "ECG", "Web Audio API", "JavaScript", "Clinical AI"],
    link: "/blogs/the-sound-of-a-diagnosis",
  },

    {
    id: "explainable-ai-practice",
    title: "What Explainable AI Actually Looks Like in Practice",
    image: "/blog-covers/explainable-ai-practice.jpg",
    excerpt: "Everyone talks about explainable AI like it is a solved problem. I built an end-to-end ECG classification system with a real XAI layer. Here is what I actually found.",
    body: `Everyone talks about explainable AI like it is a solved problem. Read the papers and you get clean saliency maps highlighting exactly the right region, confidence scores that mean something, and models that can articulate their reasoning. Build it yourself and you get something messier, more honest, and more interesting.

I spent the last few months building an end-to-end ECG classification system. The model part was straightforward enough. The explainability layer is what taught me the most.

Here is what I actually implemented and what I learned from each piece.

## Gradient saliency

Gradient saliency is the simplest XAI method and also the most direct.

The idea: given a trained model and an input signal, which parts of the input had the largest influence on the prediction? You enable gradient computation on the input, run a forward pass, call backward on the target class output, and take the absolute value of the gradient. The result is a map the same shape as your input. In my case that is \`(12, 1000)\`, one value per lead per time sample, where high values mean that region moved the prediction the most.

\`\`\`python
x_t = torch.tensor(x).unsqueeze(0).requires_grad_(True)
output = model(x_t)
output[0, target_class_idx].backward()
saliency = x_t.grad[0].abs()   # (12, 1000)
\`\`\`

You then average each lead's saliency over time to rank them, and overlay the result on the waveform as a colour gradient. The red fill shows where the model was paying attention.

![FCN-Wang gradient saliency for a correctly predicted MI record](/blog-images/explainable-ai-saliency.png)

*FCN-Wang gradient saliency for a correctly predicted MI record. Top-3 salient leads shown with red saliency fill. Brighter regions indicate higher gradient magnitude. True label: MI. Predicted: MI. Confidence: 0.86.*

## What it produces in practice

I ran this across 200 curated test records, 40 per diagnostic class, and for each record computed the 3 most salient leads. I then counted how often each lead appeared in those top-3 rankings across all records of the same class. Each class contributes 120 total appearances (40 records times 3 leads each). The table below shows the 5 most frequent leads per class.

\`\`\`
NORM: II (41),  V1 (40),  aVF (20), V6 (12),  III (11)
MI:   V1 (51),  II (36),  III (36), V2 (33),  aVF (33)
STTC: II (60),  V1 (59),  V6 (45),  aVR (22), III (20)
CD:   V1 (69),  II (58),  aVF (29), V2 (20),  III (13)
HYP:  V1 (57),  II (45),  V6 (27),  III (27), aVR (5)
\`\`\`

![Heatmap of salient lead frequency per diagnostic class across 200 curated records](/blog-images/explainable-ai-heatmap.png)

*Heatmap of salient lead frequency per diagnostic class across 200 curated records. Each cell shows how many times that lead appeared in the per-record top-3 most salient leads. FCN-Wang gradient saliency, 40 records per class, 120 total appearances per class.*

Two things stand out immediately. First, V1 and Lead II dominate across every single class including normal. They are not class-specific. They are the most informationally dense leads in a 12-lead ECG in general, and the model learned to rely on them broadly. Second, there are real class differences underneath that pattern. CD has the strongest single-lead concentration: V1 accounted for 58% of all top-3 appearances across CD records, 69 out of 120 slots. That aligns directly with clinical knowledge, since bundle branch block morphology is most visible in V1. MI emphasises inferior leads like III and aVF alongside V1 and V2, which reflects the mix of inferior and anterior infarction patterns in the PTB-XL dataset.

The honest finding is not that the model highlights the clinically correct leads. It is that the model relies heavily on the two most diagnostic leads universally, with class-specific signals visible underneath. That is still meaningful. It is just not as clean as the papers make it look.

## The honest limitation of gradient saliency

Vanilla gradient saliency measures local sensitivity. It tells you what would change the output if you nudged the input slightly at this exact point. It does not tell you what the model learned globally. Neural networks saturate: once a feature is strongly present, the gradient flattens because pushing it further barely changes the output. A model that is already very certain about MI may show low gradients at exactly the ST elevation that caused the certainty, because it is already so sure.

Integrated Gradients fixes this by accumulating gradients along a path from a zero baseline to the real input, capturing the full contribution rather than just the local slope. I used vanilla gradients because they work well on convolutional models and the maps were readable. For a production clinical tool, IG is the standard you would be expected to use.

## Uncertainty estimation

The uncertainty estimation was the piece I underestimated most.

I did not want to retrain the model with a Bayesian objective or add Monte Carlo dropout, because the whole point was a model-agnostic approach, something that works on any frozen network without architectural changes. So I implemented test-time augmentation: run 20 forward passes on the same signal, the first clean, the next 19 with small Gaussian noise added at about 2.5% of the signal amplitude range. Then compute the standard deviation of the output probabilities across those 20 runs.

The non-technical version: show the model the same ECG 20 times, but 19 times with a tiny amount of random static added. If the answer is the same every time, the model is stable. If the probabilities jump around, the model is sitting on a decision boundary and a small change in the signal would change the diagnosis. That is high uncertainty.

What surprised me is how often high confidence and high uncertainty appear together. The model can output 0.9 for a class on the clean pass and still show meaningful variance under perturbation. Point estimate confidence and stability under noise are different things. Conflating them is a real mistake I see in deployed systems.

## The LLM narrative layer

The LLM narrative was the most misunderstood piece when I showed it to people.

Qwen2-0.5B-Instruct never sees the ECG waveform. It sees a structured text block built from the model's outputs: predicted class, probabilities per class with TTA uncertainty, top three salient leads, ground truth if known. Then it generates a clinical interpretation. Here is what the prompt actually looks like before it reaches the model:

\`\`\`
ECG ANALYSIS RESULT
True diagnosis (if known): MI
Predicted class:           MI
Confidence score:          0.86
Class probabilities:       NORM:0.16+/-0.014  MI:0.86+/-0.019  STTC:0.12+/-0.010 
                           CD:0.10+/-0.010  HYP:0.29+/-0.020
Signal uncertainty:        0.0146 (low - prediction stable under signal perturbations)
Top salient leads:         II, III, aVF

Please provide a 3-5 sentence clinical interpretation of these results.
\`\`\`

And here is what Qwen2 produced for that record:

> "The ECG analysis result indicates a patient with a suspected myocardial infarction (MI). The predicted class is MI, which corresponds to the presence of an acute coronary syndrome in this case. The confidence score is high at 0.86, indicating a strong likelihood of the diagnosis being correct. The top salient leads are identified as II, III, and aVF, which could indicate a more complex or advanced cardiac event requiring further evaluation by a cardiologist. In summary, the ECG analysis provides evidence for a probable MI diagnosis, but additional diagnostic tests and monitoring may be necessary to confirm the diagnosis and guide treatment decisions."

People assume the model is doing medical reasoning. It is doing language generation from structured facts. The clinical plausibility comes from the pretraining data, not from any understanding of the signal. The output reads like a clinical note and uses the right vocabulary. But it will generate equally coherent-sounding text for a wrong prediction. The model does not know it is wrong. It just rephrases whatever numbers you feed it.

If you want to see the full pipeline running on a real patient, the interactive demo is live at [biosignalxai.streamlit.app](https://biosignalxai.streamlit.app). Select any record from the curated test set, run the XAI analysis, and you can see the saliency overlay on all 12 leads, the per-class uncertainty bars, and the Qwen2 narrative generated from the model's output. It is worth trying on a few different classes to see how the salient leads shift.

For a research demo this is genuinely useful. It makes the output legible to a non-technical audience and shows what the XAI pipeline found. For anything clinical, you would want a larger medically fine-tuned model with explicit safety constraints and red-teaming. Qwen2-0.5B here is a proof of concept for the integration pattern, not a clinical tool.

## So is any of this ready for real use

Gradient saliency on a well-trained convolutional model produces interpretable results that partially align with clinical knowledge. The lead patterns are real, even if V1 and II dominate universally. TTA uncertainty adds information the confidence score alone does not give you. A 90% confidence prediction with high TTA variance is a different clinical situation from a 90% confidence prediction that is stable under noise. Both of these I would stand behind for a research prototype.

The LLM narrative is the piece I am most cautious about. Not because the output is bad, it is often surprisingly good, but because it is easy to over-trust. It sounds authoritative. It uses the right vocabulary. A non-expert reading it could reasonably think the AI understood the ECG, when it understood the numbers you extracted from the ECG.

That gap between what XAI looks like and what it actually is, that is the thing worth understanding before you build it, or before you trust it.`,
    date: "2026-06-02",
    keywords: ["AI", "XAI", "Deep Learning", "ECG"],
    link: "/blogs/explainable-ai-practice",
  },
  {
    id: "react-native-vs-react-web",
    title: "React Native vs React Web: A Web Dev Who Went Mobile",
    image: "/blog-covers/react-native-vs-react-web.jpg",
    excerpt: "Going mobile as a web dev felt more natural than expected. Here's the honest breakdown of what changes and why I ended up preferring it.",
    body: `I started with React on the web. Components, JSX, props, state, I learned the pattern there, as most people do. So when I moved to React Native for a real production project, I expected a rough transition. It was not. What surprised me is that going mobile actually felt more natural, not less. And by the end of it, I preferred it.

This post is for web developers curious about mobile. I want to be honest about what is harder, what is different, and why I think the extra complexity is worth it.

## What stays exactly the same

This is the part that makes React Native approachable. Functional components, hooks, props, state – all identical. \`useState\`, \`useEffect\`, \`useContext\`, \`useRef\`, and \`useMemo\` all work exactly as you know them. Most libraries like Axios, React Query, Zustand, and Redux work – sometimes with small adjustments. If you know React, you already know the core of React Native. You are not learning a new framework. You are learning a new rendering target.

## What changes – the building blocks

The first thing that trips web developers up is the tags. In React Native, HTML does not exist. There is no \`div\`, no \`p\`, no \`span\`. Instead, you have \`View\`, \`Text\`, \`TextInput\`, \`ScrollView\`, \`TouchableOpacity\`, \`FlatList\`, and \`Image\`.

At first, it feels like unnecessary renaming, but it actually reflects the platform better. A \`View\` is not a \`div\`; it is a layout container built for a screen, not a document. Everything uses flexbox by default (with column layout), which is cleaner than what you are used to on the web.

\`\`\`jsx
// Web React
<div className="container">
  <p>Hello world</p>
</div>

// React Native equivalent
<View style={styles.container}>
  <Text>Hello world</Text>
</View>
\`\`\`

One thing that will crash your app immediately: if you put raw text outside of a \`Text\` component, React Native throws an error. The web lets you get away with sloppy structure. Mobile does not.

Touchable elements are another adjustment. On the web, almost anything can have an \`onClick\`. In React Native, you need to wrap things in \`Pressable\` or \`TouchableOpacity\` to get proper touch behavior with visual feedback. A plain \`View\` with an \`onPress\` does not behave the way users expect.

Images work differently too. On the web you write \`<img src="..." />\`. In React Native:

\`\`\`jsx
// local file
<Image source={require('./assets/photo.png')} />

// remote URL
<Image source={{ uri: 'https://example.com/photo.png' }} />
\`\`\`

## Styling is the biggest mental shift

Forget CSS files. Forget class names, cascading, inheritance, and global stylesheets. In React Native, you write styles as plain JavaScript objects using \`StyleSheet.create\`, and you apply them directly to your component. Everything is scoped. Nothing leaks.

\`\`\`jsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0B132B',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
});
\`\`\`

There are no units either: no \`px\`, no \`rem\`, no \`em\`. Just plain numbers that map to density-independent pixels. And since flex is the default for everything, once you internalize that, layout actually becomes more predictable than CSS.

The hardest part is unlearning. If you keep trying to think in CSS, you will fight it constantly. If you treat it as its own system from day one, you adapt within a couple of days.

## A few things web developers never think about

**Scrolling is not automatic.** If your content overflows the screen and you did not wrap it in a \`ScrollView\` or \`FlatList\`, it simply won't scroll. On the web, the browser handles this for you.

**The keyboard is a problem you have to solve.** On mobile, the software keyboard pushes the screen up and can cover your inputs. You handle this with \`KeyboardAvoidingView\`. It is one of those things that does not exist as a concept in web development, but becomes a real issue the moment you have a form near the bottom of the screen.

**iOS and Android are not the same.** Shadow styles work differently between platforms. Fonts render differently. Some APIs are platform-specific. You end up writing \`Platform.OS\` checks for edge cases.

\`\`\`jsx
import { Platform } from 'react-native';

const shadowStyle = Platform.select({
  ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2 },
  android: { elevation: 4 },
});
\`\`\`

## So why do I prefer it?

With all of that (the extra complexity, the different mental model, the keyboard handling and platform quirks), I still prefer building mobile, and I think the reason is the feedback loop.

With Expo, you install the app on your phone, scan a QR code, and you are live. Every save reflects on the device immediately. I was testing real-time WebSocket features across multiple physical devices at the same time, watching state sync between them in real time. That experience does not have a web equivalent. Holding something you built, using it the way real users would, changes how you think about what you are making.

Web React always felt slightly static to me by comparison. You are building pages. In React Native, you are building something that lives on someone's device, in their pocket, that they open and interact with physically. That difference in tangibility matters more than I expected.

Is it harder at the beginning? Yes, genuinely. The tag names, the styling system, the navigation setup, and the platform differences are real overhead. But none of it is deep. It is all surface-level adjustment, not fundamental rethinking. A week in, it stops feeling foreign.

If you are a web developer thinking about mobile, React Native is the lowest friction path there is. The knowledge you have carries over almost entirely. The things that are different are learnable quickly.

And there's a good chance you'll end up preferring it too.`,
    date: "2026-04-11",
    keywords: ["React Native", "React", "Mobile", "Web"],
    link: "/blogs/react-native-vs-react-web",
  },
  {
    id: "ai-coding-tools",
    title: "What AI Coding Tools Are Actually Good At (And Where They Fail)",
    image: "/blog-covers/ai-coding-tools.jpg",
    excerpt: "After daily use of ChatGPT, Copilot, and Claude Code, here's my honest take on where these tools genuinely save hours and where they'll quietly waste them.",
    body: `I have a lot of opinions after using AI coding tools like ChatGPT, GitHub Copilot, and Claude Code for some time. Not the version with all the hype. The actual one, from someone who has been burnt by these tools and utilizes them on a daily basis.

## What truly works

The moment that sold me was when I gave Claude Code a prompt describing a new site I required, and it returned with a perfectly functional implementation that fit my current design system, reused my component patterns, and adhered to rules I had never explicitly documented. It gathered them up from the surrounding code.

That level of context awareness is quite astounding, because it saves hours, not minutes. Writing boilerplate, creating README files, documenting what is in a codebase, bootstrapping a new component based on an existing one. All of these are areas where AI tools excel. Every developer dreads the tedious, repetitive, and time-consuming work.

A concrete example: scaffolding a new React component that matches your existing patterns. Before AI tools, you'd copy-paste and manually clean up. Now:

\`\`\`
Prompt: "Create a FilterBar component that matches the style of SearchBar.jsx,
same border/focus ring pattern, uses th-card/60 background, accepts an options
array and an onChange callback."
\`\`\`

Claude Code will read \`SearchBar.jsx\`, infer the conventions, and produce something that fits without you writing a single line of the boilerplate.

## Where it goes wrong

**Hallucination** is the big one. Ask ChatGPT (especially the free version) something specific about a library or API, and it will confidently respond with an answer that sounds right but is not. It will cite functions that do not exist, reference versions that were never released, and if you are not experienced enough to catch it, you will spend an hour debugging something that was never going to work.

\`\`\`js
// ChatGPT confidently suggested this - it does not exist
import { useFormContext } from 'react-hook-form/context';
\`\`\`

It's frustrating since the results appear so compelling.

**Context loss** is the other failure mode. If you are in a long conversation and the tool starts to lose track of your design decisions, your stack, or the constraints you mentioned three messages ago, the output drifts. You start getting suggestions that technically compile but feel like they were written for a different project. This is much worse on free tiers where context windows are smaller.

## Where does this leave us?

People keep questioning if AI will replace developers. I believe this is the incorrect question, because it indicates a misunderstanding of what these technologies actually perform. Think about photography. When Photoshop was released, photographers were concerned that anyone might suddenly fake a decent photo. The opposite happened: it raised the bar. The tool takes care of the technical tedium, but the eye, composition, and creative vision remain essential. A lousy photographer using Photoshop still produces awful images.

AI coding tools are doing the same thing. The manual work (the boilerplate, documentation, scaffolding, and repetitive CRUD) is absorbed. What remains is the creative and architectural thinking: selecting what to construct, why, how it should feel, and how its components should link. That element is still completely human.

## My honest rankings after daily use

| Tool | Best at | Weakness |
|---|---|---|
| Claude Code | Large context, respecting existing patterns | Slower on trivial completions |
| GitHub Copilot | Short inline completions | Struggles with multi-file tasks |
| ChatGPT | Explanation and exploration | Hallucination on specific APIs |

If you are a developer skeptical of these tools, I get it. The early demos were oversold and the failures are real. But ignoring them entirely means spending time on work that does not need your full attention anymore. The developers who will stand out are the ones who know how to direct these tools well, catch their mistakes, and focus their own energy on the things AI genuinely cannot do.

Use the tools. Just know what they are.`,
    date: "2026-04-10",
    keywords: ["AI", "Developer Tools", "Opinion"],
    link: "/blogs/ai-coding-tools",
  },
];
