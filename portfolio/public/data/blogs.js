export const blogs = [
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
