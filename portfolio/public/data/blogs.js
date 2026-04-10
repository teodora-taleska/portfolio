export const blogs = [
  {
    id: "ai-coding-tools",
    title: "What AI Coding Tools Are Actually Good At (And Where They Fail)",
    image: "/blog-covers/ai-coding-tools.jpg",
    body: `I have been using AI coding tools for a while now — Claude Code, GitHub Copilot, and ChatGPT — and I have a lot of thoughts. Not the hype version. The real one, from someone who uses these tools daily and has been burned by them too.

Let me start with what actually works.

The moment that sold me was when I gave Claude Code a prompt describing a new page I needed, and it came back with a fully working implementation that matched my existing design system, reused my component patterns, and followed conventions I had never explicitly written down. It had picked them up from the surrounding code. That kind of context-awareness is genuinely impressive and saves hours — not minutes, hours. Writing boilerplate, generating README files, documenting what is in a codebase, scaffolding a new component based on an existing one — all of this is where AI tools shine. The boring, repetitive, time-consuming work that every developer dreads.

Now for where it goes wrong.

Hallucination is the big one. Ask ChatGPT (especially the free version) something specific about a library or API, and it will confidently give you an answer that sounds right but is not. It will cite functions that do not exist, reference versions that never shipped, and if you are not experienced enough to catch it, you will spend an hour debugging something that was never going to work. I have been there. It is frustrating precisely because the output looks so convincing.

Context loss is the other failure mode. If you are in a long conversation and the tool starts to lose track of your design decisions, your stack, or the constraints you mentioned three messages ago, the output drifts. You start getting suggestions that technically compile but feel like they were written for a different project. This is much worse on free tiers where context windows are smaller.

So where does this leave us?

People keep asking whether AI will replace developers. I think this is the wrong question entirely, and honestly it reflects a misunderstanding of what these tools actually do. Think about photography. When Photoshop came out, photographers panicked that anyone could now fake a good photo. The opposite happened — it raised the bar. The tool handles the technical tedium, but you still need the eye, the composition, the creative vision. A bad photographer with Photoshop still takes bad photos.

AI coding tools are doing the same thing. The manual work — the boilerplate, the documentation, the scaffolding, the repetitive CRUD — gets absorbed. What remains is the creative and architectural thinking: deciding what to build, why, how it should feel, how pieces should connect. That part is still entirely human.

If you are a developer skeptical of these tools, I get it. The early demos were oversold and the failures are real. But ignoring them entirely means spending time on work that does not need your full attention anymore. The developers who will stand out are the ones who know how to direct these tools well, catch their mistakes, and focus their own energy on the things AI genuinely cannot do.

My honest ranking after daily use: Claude Code first, by a clear margin, mainly because of how well it reads and respects existing context. Copilot is solid for quick inline completions but weaker for bigger tasks. ChatGPT is useful for explanation and exploration but I would not trust it to generate production code without careful review.

Use the tools. Just know what they are.`,
    date: "2026-04-10",
    keywords: ["AI", "Developer Tools", "Opinion"],
    link: "/blogs/ai-coding-tools",
  }
];
