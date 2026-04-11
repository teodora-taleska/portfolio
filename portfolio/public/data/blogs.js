export const blogs = [
  {
  id: "react-native-vs-react-web",
  title: "React Native vs React Web: A Web Dev Who Went Mobile",
  image: "/blog-covers/react-native-vs-react-web.jpg",
  body: `I started with React on the web. Components, JSX, props, state, I learned the pattern there, as most people do. So when I moved to React Native for a real production project, I expected a rough transition. It was not. What surprised me is that going mobile actually felt more natural, not less. And by the end of it, I preferred it.

This post is for web developers curious about mobile. I want to be honest about what is harder, what is different, and why I think the extra complexity is worth it.

What stays exactly the same.

This is the part that makes React Native approachable. Functional components, hooks, props, state – all identical. useState, useEffect, useContext, useRef, and useMemo all work exactly as you know them. Most libraries like Axios, React Query, Zustand, and Redux work – sometimes with small adjustments. If you know React, you already know the core of React Native. You are not learning a new framework. You are learning a new rendering target.

What changes – the building blocks.

The first thing that trips web developers up is the tags. In React Native, HTML does not exist. There is no div, no p, no span. Instead, you have View, Text, TextInput, ScrollView, TouchableOpacity, FlatList, and Image. At first, it feels like unnecessary renaming, but it actually reflects the platform better. A View is not a div; it is a layout container built for a screen, not a document. Everything uses flexbox by default (with column layout), which is cleaner than what you are used to on the web.

One thing that will crash your app immediately: if you put raw text outside of a Text component, React Native throws an error. The web lets you get away with sloppy structure. Mobile does not.

Touchable elements are another adjustment. On the web, almost anything can have an onClick. In React Native, you need to wrap things in Pressable or TouchableOpacity to get proper touch behavior with visual feedback. A plain View with an onPress does not behave the way users expect.

Images work differently, too. On the web, you write img src. In React Native, you write Image source with either a require for local files or a URI object for remote ones. Small difference, but enough to slow you down the first time.

Styling is the biggest mental shift.

Forget CSS files. Forget class names, cascading, inheritance, and global stylesheets. In React Native, you write styles as plain JavaScript objects using StyleSheet.create, and you apply them directly to your component. Everything is scoped. Nothing leaks.

There are no units either, no px, no rem, no em. Just plain numbers that map to density-independent pixels. And since flex is the default for everything, once you internalize that, layout actually becomes more predictable than CSS.

The hardest part is unlearning. If you keep trying to think in CSS, you will fight it constantly. If you treat it as its own system from day one, you adapt within a couple of days.

A few things web developers never think about.

Scrolling is not automatic in React Native. If your content overflows the screen and you did not wrap it in a ScrollView or FlatList, it won’t scroll unless you explicitly wrap it. On the web, the browser handles this for you.

The keyboard is a problem you have to solve. On mobile, the software keyboard pushes the screen up and can cover your inputs. You handle this with KeyboardAvoidingView. It is one of those things that does not exist as a concept in web development, but becomes a real issue the moment you have a form near the bottom of the screen.

iOS and Android are not the same. Shadow styles work differently between platforms. Fonts render differently. Some APIs are platform-specific. You end up writing Platform.OS checks for edge cases. The web has browser inconsistencies, but this is a different kind of fragmentation.

Tooling exists, but it’s not as seamless as browser DevTools. No element inspector, no computed styles panel. React Native Debugger exists, but it is not on the same comfort level. Expo helps, but this is a genuine step down in tooling.

So why do I prefer it?

With all of that, the extra complexity, the different mental model, the keyboard handling and platform quirks, I still prefer building mobile, and I think the reason is the feedback loop.

With Expo, you install the app on your phone, scan a QR code, and you are live. Every save reflects on the device immediately. I was testing real-time WebSocket features across multiple physical devices at the same time, watching state sync between them in real time. That experience does not have a web equivalent. Holding something you built, using it the way real users would, changes how you think about what you are making.

Web React always felt slightly static to me by comparison. You are building pages. In React Native, you are building something that lives on someone’s device, in their pocket, that they open and interact with physically. That difference in tangibility matters more than I expected.

Is it harder at the beginning? Yes, genuinely. The tag names, the styling system, the navigation setup, and the platform differences are real overhead. But none of it is deep. It is all surface-level adjustment, not fundamental rethinking. A week in, it stops feeling foreign.

If you are a web developer thinking about mobile, React Native is the lowest friction path there is. The knowledge you have carries over almost entirely. The things that are different are learnable quickly.

And there’s a good chance you’ll end up preferring it too.`,
  date: "2026-04-11",
  keywords: ["React Native", "React", "Mobile", "Web"],
  link: "/blogs/react-native-vs-react-web",
},
  {
    id: "ai-coding-tools",
    title: "What AI Coding Tools Are Actually Good At (And Where They Fail)",
    image: "/blog-covers/ai-coding-tools.jpg",
    body: `I have a lot of ideas after using AI coding tools like ChatGPT, GitHub Copilot, and Claude Code for some time. Not the version with all the hype. The actual one, from someone who has been burnt by these tools and utilizes them on a daily basis.

Let me start with what truly works.

The moment that sold me was when I gave Claude Code a prompt describing a new site I required, and it returned with a perfectly functional implementation that fit my current design system, reused my component patterns, and adhered to rules I had never explicitly documented. It gathered them up from the surrounding code. That level of context awareness is quite astounding, because it saves hours, not minutes. Writing boilerplate, creating README files, documenting what is in a codebase, bootstrapping a new component based on an existing one, all of these are areas where AI tools excel. Every developer dreads the tedious, repetitive, and time-consuming work.

Now for where it goes wrong.

Hallucination is the big one. Ask ChatGPT (especially the free version) something specific about a library or API, and it will confidently respond with an answer that sounds right but is not. It will cite functions that do not exist, reference versions that were never released, and if you are not experienced enough to catch it, you will spend an hour debugging something that was never going to work. I have been there. It's frustrating since the results appear so compelling.

Context loss is the other failure mode. If you are in a long conversation and the tool starts to lose track of your design decisions, your stack, or the constraints you mentioned three messages ago, the output drifts. You start getting suggestions that technically compile but feel like they were written for a different project. This is much worse on free tiers where context windows are smaller.

So, where does this leave us?

People keep questioning if AI will replace developers. I believe this is the incorrect question, because it indicates a misunderstanding of what these technologies actually perform. Think about photography. When Photoshop was released, photographers were concerned that anyone might suddenly fake a decent photo. The opposite happened: it raised the bar. The tool takes care of the technical tedium, but the eye, composition, and creative vision remain essential. A lousy photographer using Photoshop still produces awful images.

AI coding tools are doing the same thing. The manual work — the boilerplate, documentation, scaffolding, and repetitive CRUD — is absorbed. What remains is the creative and architectural thinking: selecting what to construct, why, how it should feel, and how its components should link. That element is still completely human.

If you are a developer skeptical of these tools, I get it. The early demos were oversold and the failures are real. But ignoring them entirely means spending time on work that does not need your full attention anymore. The developers who will stand out are the ones who know how to direct these tools well, catch their mistakes, and focus their own energy on the things AI genuinely cannot do.

My honest opinion after daily use: Claude Code comes out on top by a wide margin, owing to how well it reads and respects current context. Copilot excels at short inline completions but struggles with larger jobs. ChatGPT is useful for explanation and exploration but I would not trust it to generate production code without careful review.

Use the tools. Just know what they are.`,
    date: "2026-04-10",
    keywords: ["AI", "Developer Tools", "Opinion"],
    link: "/blogs/ai-coding-tools",
  }
];
