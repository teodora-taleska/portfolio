export const blogs = [
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

Two things stand out immediately. First, V1 and Lead II dominate across every single class including normal. They are not class-specific. They are the most informationally dense leads in a 12-lead ECG in general, and the model learned to rely on them broadly. Second, there are real class differences underneath that pattern. CD has the strongest single-lead concentration: V1 accounted for 58 percent of all top-3 appearances across CD records, 69 out of 120 slots. That aligns directly with clinical knowledge, since bundle branch block morphology is most visible in V1. MI emphasises inferior leads like III and aVF alongside V1 and V2, which reflects the mix of inferior and anterior infarction patterns in the PTB-XL dataset.

The honest finding is not that the model highlights the clinically correct leads. It is that the model relies heavily on the two most diagnostic leads universally, with class-specific signals visible underneath. That is still meaningful. It is just not as clean as the papers make it look.

## The honest limitation of gradient saliency

Vanilla gradient saliency measures local sensitivity. It tells you what would change the output if you nudged the input slightly at this exact point. It does not tell you what the model learned globally. Neural networks saturate: once a feature is strongly present, the gradient flattens because pushing it further barely changes the output. A model that is already very certain about MI may show low gradients at exactly the ST elevation that caused the certainty, because it is already so sure.

Integrated Gradients fixes this by accumulating gradients along a path from a zero baseline to the real input, capturing the full contribution rather than just the local slope. I used vanilla gradients because they work well on convolutional models and the maps were readable. For a production clinical tool, IG is the standard you would be expected to use.

## Uncertainty estimation

The uncertainty estimation was the piece I underestimated most.

I did not want to retrain the model with a Bayesian objective or add Monte Carlo dropout, because the whole point was a model-agnostic approach, something that works on any frozen network without architectural changes. So I implemented test-time augmentation: run 20 forward passes on the same signal, the first clean, the next 19 with small Gaussian noise added at about 2.5 percent of the signal amplitude range. Then compute the standard deviation of the output probabilities across those 20 runs.

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

Gradient saliency on a well-trained convolutional model produces interpretable results that partially align with clinical knowledge. The lead patterns are real, even if V1 and II dominate universally. TTA uncertainty adds information the confidence score alone does not give you. A 90 percent confidence prediction with high TTA variance is a different clinical situation from a 90 percent confidence prediction that is stable under noise. Both of these I would stand behind for a research prototype.

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
