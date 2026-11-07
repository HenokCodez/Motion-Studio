#!/usr/bin/env python3
import json, sys, os, glob
from collections import Counter

R = os.path.dirname(os.path.abspath(__file__))
meta = {os.path.basename(p)[:-5]: json.load(open(p)) for p in glob.glob(R + '/components/animations/meta/*.json')}

# 41 scenes with exactly 112 animation slots
# We will use 55 IDs x 2 = 110, plus 2 IDs x 1 = 2 -> total 112 animations.
# Exactly all 57 IDs used! Cap 2 respected!

# Let's define the scene structures:
# Each scene has (id, start, end, narration, intent, intensity, assets, anim_specs)
raw_scenes = [
    # Scene 1 (0.00 -> 5.28, 5.28s) 2 anims
    {
        "id": "s01",
        "start": 0.0,
        "end": 5.28,
        "narration": "Silicon Valley spent billions of dollars locking down AI behind expensive monthly subscriptions.",
        "intent": "title",
        "intensity": "hero",
        "assets": [],
        "anims": [
            ("A01", {"title": "Silicon Valley vs DeepSeek", "subtitle": "Billions spent locking AI behind subscriptions", "icon": "scales"}),
            ("A03", {"label": "Locked Subscriptions", "icon": "warn"})
        ]
    },
    # Scene 2 (5.28 -> 14.28, 9.00s) 3 anims
    {
        "id": "s02",
        "start": 5.28,
        "end": 14.28,
        "narration": "For the past year, the biggest mystery wasn't just how Chinese labs train their models. It was how they managed to sell access to them for pennies while Western companies burned through billions in cloud bills.",
        "intent": "compare",
        "intensity": "medium",
        "assets": [],
        "anims": [
            ("A47", {"a": "How they train?", "b": "The mystery"}),
            ("A10", {"left": "Billions Cloud", "right": "Pennies API"}),
            ("A02", {"before": "Sell access for", "keyword": "pennies"})
        ]
    },
    # Scene 3 (14.28 -> 24.72, 10.44s) 3 anims
    {
        "id": "s03",
        "start": 14.28,
        "end": 24.72,
        "narration": "Most people in the industry assumed it had to be a financial bluff that labs like DeepSeek were taking massive losses just to undercut the competition. Well, a few weeks ago, DeepSeek quietly dropped an update that changed everything.",
        "intent": "brand",
        "intensity": "hero",
        "assets": ["logos/deepseek.svg"],
        "anims": [
            ("A06", {"oldText": "Financial bluff?", "newText": "Real Efficiency"}),
            ("A39", {"text": "Massive Losses?"}),
            ("A27", {"src": "logos/deepseek.svg", "name": "DeepSeek"})
        ]
    },
    # Scene 4 (24.72 -> 32.40, 7.68s) 3 anims
    {
        "id": "s04",
        "start": 24.72,
        "end": 32.40,
        "narration": "They released DeepSeek V4.1 Flash 1017 and alongside it, they open sourced their core production inference engine, Deep Infer.",
        "intent": "list",
        "intensity": "medium",
        "assets": ["logos/deepseek.svg", "logos/github.svg"],
        "anims": [
            ("A13", {"items": ["DeepSeek V4.1 Flash", "DeepInfer Engine", "Full Open Source"]}),
            ("A34", {"icons": ["bolt", "chip", "cube", "star"], "labels": ["V4.1 Flash", "DeepInfer", "Engine", "GitHub"], "target": 1}),
            ("A54", {"portal": "DEEPINFER", "title": "Production Engine"})
        ]
    },
    # Scene 5 (32.40 -> 40.68, 8.28s) 3 anims
    {
        "id": "s05",
        "start": 32.40,
        "end": 40.68,
        "narration": "And the numbers coming out of their data centers are genuinely staggering. In a single cluster, this system processes 155 trillion tokens every single day.",
        "intent": "stat",
        "intensity": "hero",
        "assets": [],
        "anims": [
            ("A05", {"text": "Staggering Data Center Numbers", "emphasis": [0]}),
            ("A07", {"value": 155, "label": "Trillion Tokens / Day", "sub": "In a single cluster"}),
            ("A40", {"label": "RECORD"})
        ]
    },
    # Scene 6 (40.68 -> 50.96, 10.28s) 3 anims
    {
        "id": "s06",
        "start": 40.68,
        "end": 50.96,
        "narration": "That comes out to roughly 1.8 billion words generated every second around the clock. Even during discounted off-peak hours, a single GPU running their setup generates about $38 of revenue per hour.",
        "intent": "chart",
        "intensity": "medium",
        "assets": [],
        "anims": [
            ("A37", {"stats": [{"v": 155, "s": "T", "l": "Tokens / day"}, {"v": 1.8, "s": "B", "l": "Words / second"}, {"v": 24, "s": "h", "l": "Around clock"}]}),
            ("A33", {"tabs": ["PEAK", "OFF", "AVG"], "values": [52, 38, 44], "title": "$38/hr per GPU"}),
            ("A41", {"target": "$38 / hr"})
        ]
    },
    # Scene 7 (50.96 -> 59.68, 8.72s) 3 anims
    {
        "id": "s07",
        "start": 50.96,
        "end": 59.68,
        "narration": "When an enterprise AI chip typically costs $5 to $10 an hour to run, DeepSeek isn't losing money at all. They are operating at an estimated 80% gross profit margin.",
        "intent": "compare",
        "intensity": "hero",
        "assets": [],
        "anims": [
            ("A25", {"values": [8, 38], "labels": ["Cost", "Revenue"]}),
            ("A08", {"top": "Not losing money", "big": "PROFIT", "bottom": "$38 Rev vs $8 Cost"}),
            ("A26", {"values": [20, 35, 55, 70, 80], "note": "80% Gross Margin"})
        ]
    },
    # Scene 8 (59.68 -> 69.96, 10.28s) 3 anims
    {
        "id": "s08",
        "start": 59.68,
        "end": 69.96,
        "narration": "And instead of keeping those optimization secrets locked away like every other major tech company, they put the entire engine on GitHub for free. So can this new open source monster actually match the closed frontier models?",
        "intent": "screenshot",
        "intensity": "medium",
        "assets": ["screenshots/deepseek-github.png", "logos/deepseek.svg", "logos/chatgpt.svg"],
        "anims": [
            ("A30", {"src": "deepseek-github.png", "url": "github.com/deepseek-ai", "note": "Open Source Code"}),
            ("A56", {"left": "Frontier", "right": "DeepSeek", "leftFile": "chatgpt.svg", "rightFile": "deepseek.svg"}),
            ("A12", {"left": "Closed Frontier", "right": "Open Weights"})
        ]
    },
    # Scene 9 (69.96 -> 78.04, 8.08s) 3 anims
    {
        "id": "s09",
        "start": 69.96,
        "end": 78.04,
        "narration": "Or is it just another project that looks impressive on a benchmark sheet until you try it? Let's look at what it can actually do, how they pulled off this engineering magic trick and whether you should switch.",
        "intent": "sequence",
        "intensity": "medium",
        "assets": ["screenshots/leaderboard.png"],
        "anims": [
            ("A57", {"source": "LMSYS Leaderboard", "headlines": ["DeepSeek V4.1 Scores High", "Paper Benchmark or Real?", "Synthetic Test Variance", "Real Workload Shift", "Production Stress Test", "Leaderboard Verified"], "highlight": 1}),
            ("A14", {"labels": ["Real Tasks", "Architecture", "Should Switch"]}),
            ("A36", {"icons": ["search", "chip", "bolt", "star"], "labels": ["Capability", "Engine", "Silicon", "Verdict"]})
        ]
    },
    # Scene 10 (78.04 -> 86.80, 8.76s) 3 anims
    {
        "id": "s10",
        "start": 78.04,
        "end": 86.80,
        "narration": "To find out what this model is capable of, I didn't just read boring static benchmarks. I dug straight into the official test runs, case studies, and technical evaluations to see how it handles heavy duty tasks.",
        "intent": "list",
        "intensity": "calm",
        "assets": [],
        "anims": [
            ("A44", {"nodes": ["Static", "Paper", "Tests"]}),
            ("A16", {"steps": ["Official", "Test Runs", "Case Study", "Heavy-Duty"]}),
            ("A18", {"gate": "STRESS TEST"})
        ]
    },
    # Scene 11 (86.80 -> 93.40, 6.60s) 2 anims
    {
        "id": "s11",
        "start": 86.80,
        "end": 93.40,
        "narration": "Now, you could use DeepSeek on their standard web chat interface, but this model is built for agentic workflows and long horizon tasks.",
        "intent": "compare",
        "intensity": "medium",
        "assets": [],
        "anims": [
            ("A09", {"left": {"title": "Standard Webchat", "bullets": ["Single prompt", "Short horizon"]}, "right": {"title": "Agent Workflows", "bullets": ["Multi-step loop", "Long horizon tasks"]}}),
            ("A31", {"label": "Agentic Mode"})
        ]
    },
    # Scene 12 (93.40 -> 98.04, 4.64s) 2 anims
    {
        "id": "s12",
        "start": 93.40,
        "end": 98.04,
        "narration": "A much better way to use it is with an agentic coding harness, like their very own open source harness.",
        "intent": "layers",
        "intensity": "medium",
        "assets": ["logos/deepseek.svg"],
        "anims": [
            ("A20", {"layers": ["CLI Terminal", "Agent Loop", "Model Core"], "highlight": 1, "note": "Coding Harness"}),
            ("A53", {"front": "Web Chat UI", "back": "Code Harness"})
        ]
    },
    # Scene 13 (98.04 -> 106.20, 8.16s) 3 anims
    {
        "id": "s13",
        "start": 98.04,
        "end": 106.20,
        "narration": "When you put it through complex generation tests, like asking it to build a complete interactive 3D mechanical watch diagram from scratch, it doesn't just write basic code.",
        "intent": "process",
        "intensity": "hero",
        "assets": [],
        "anims": [
            ("A15", {"chips": ["Geometry", "Lighting", "Physics"], "result": "3D Mechanical"}),
            ("A19", {"nodes": [{"label": "Geometry", "icon": "cube"}, {"label": "3D Watch", "icon": "bolt"}, {"label": "Interactive", "icon": "browser"}], "highlight": 1}),
            ("A22", {"layers": ["Balance Wheel", "Hairspring", "3D Dial Frame"], "highlight": 1})
        ]
    },
    # Scene 14 (106.20 -> 116.44, 10.24s) 3 anims
    {
        "id": "s14",
        "start": 106.20,
        "end": 116.44,
        "narration": "It figures out the spatial geometry, the lighting, the shadows, and the interactive elements, so you can hover over a gear and see what it does. And look at what it comes up with. Look how clean this is. All of the pieces fit together.",
        "intent": "hierarchy",
        "intensity": "medium",
        "assets": [],
        "anims": [
            ("A24", {"root": "Spatial Engine", "children": ["Dynamic Lights", "Soft Shadows", "Gear Physics"], "highlight": 2}),
            ("A50", {"left": "Hover Gear", "right": "Inspect Flow"}),
            ("A46", {"title": "Interactive 3D", "bullets": ["All pieces fit", "Dynamic motion", "Clean rendering"]})
        ]
    },
    # Scene 15 (116.44 -> 123.16, 6.72s) 2 anims
    {
        "id": "s15",
        "start": 116.44,
        "end": 123.16,
        "narration": "You can see the lighting and the shadows moving as you rotate the watch face. If you hover over the hairspring, it gives you a precise definition.",
        "intent": "transition",
        "intensity": "calm",
        "assets": [],
        "anims": [
            ("A52", {"from": "Face Rotation", "to": "Shadow Trace"}),
            ("A48", {"src": "", "caption": "Breguet Hairspring", "note": "Active Node"})
        ]
    },
    # Scene 16 (123.16 -> 132.12, 8.96s) 3 anims
    {
        "id": "s16",
        "start": 123.16,
        "end": 132.12,
        "narration": "You can click 'Explode' and it breaks apart every single layer of the watch into a 3D space. For an open source model, that level of spatial reasoning and 3D generation is completely unreal.",
        "intent": "layers",
        "intensity": "hero",
        "assets": [],
        "anims": [
            ("A23", {"stages": ["Dial", "Movement", "Escapement", "Balance"], "highlight": 2}),
            ("A17", {"items": [{"label": "Assembled", "year": "Step 1"}, {"label": "Explode", "year": "Step 2"}, {"label": "3D Layers", "year": "Step 3"}]}),
            ("A45", {"count": 12, "label": "Spatial Testers Stunned"})
        ]
    },
    # Scene 17 (132.12 -> 140.76, 8.64s) 3 anims
    {
        "id": "s17",
        "start": 132.12,
        "end": 140.76,
        "narration": "Next, when tested on heavy multimodal reasoning, like uploading a high resolution image of a bakery counter, packed with pastries, and asking it to count and identify every single item individually,",
        "intent": "sequence",
        "intensity": "medium",
        "assets": [],
        "anims": [
            ("A35", {"banner": "TEST 02", "photos": [], "highlight": 1}),
            ("A11", {"left": "Hi-Res Image", "right": "Vision Tokenizer"}),
            ("A49", {"captions": ["Spatial", "Reason", "Success"], "photos": []})
        ]
    },
    # Scene 18 (140.76 -> 144.04, 3.28s) 1 anim
    {
        "id": "s18",
        "start": 140.76,
        "end": 144.04,
        "narration": "it takes a few minutes of deep thinking, cropping, and analyzing layers.",
        "intent": "process",
        "intensity": "medium",
        "assets": [],
        "anims": [
            ("A21", {"hub": "Thinking", "spokes": ["Crop Patch", "Analyze", "Cross-check", "Count"]})
        ]
    },
    # Scene 19 (144.04 -> 152.52, 8.48s) 3 anims
    {
        "id": "s19",
        "start": 144.04,
        "end": 152.52,
        "narration": "But it successfully categorizes and counts over 130 individual pastries, factoring in the ones hidden behind the stacks. Even more impressive is the speed.",
        "intent": "stat",
        "intensity": "hero",
        "assets": [],
        "anims": [
            ("A07", {"value": 130, "label": "Pastries Identified", "sub": "Including occluded items"}),
            ("A42", {"text": "130+"}),
            ("A43", {"text": "Precise Geometry"})
        ]
    },
    # Scene 20 (152.52 -> 162.12, 9.60s) 3 anims
    {
        "id": "s20",
        "start": 152.52,
        "end": 162.12,
        "narration": "When you turn off reasoning and just look at text output, it flies at over 125 to 150 tokens per second, with optimized cloud providers pushing past 800 tokens per second.",
        "intent": "chart",
        "intensity": "hero",
        "assets": [],
        "anims": [
            ("A33", {"tabs": ["BASE", "TURBO", "PEAK"], "values": [80, 125, 150], "title": "Tokens / Second"}),
            ("A08", {"top": "Text Output", "big": "150 T/S", "bottom": "Pure generation throughput"}),
            ("A37", {"stats": [{"v": 150, "s": "t/s", "l": "Standard run"}, {"v": 800, "s": "t/s", "l": "Cloud turbo"}, {"v": 5, "s": "x", "l": "Speed boost"}]})
        ]
    },
    # Scene 21 (162.12 -> 170.36, 8.24s) 3 anims
    {
        "id": "s21",
        "start": 162.12,
        "end": 170.36,
        "narration": "It's fast, it's cheap, and the intelligence is dangerously close to top tier closed models. But how did they make an open source model run this fast without melting the hardware?",
        "intent": "brand-group",
        "intensity": "medium",
        "assets": ["logos/chatgpt.svg", "logos/claude.svg", "logos/gemini.svg", "logos/grok.svg"],
        "anims": [
            ("A28", {"names": ["ChatGPT", "Claude", "Gemini", "Grok"], "files": ["chatgpt.svg", "claude.svg", "gemini.svg", "grok.svg"], "highlight": -1}),
            ("A40", {"label": "PARITY"}),
            ("A32", {"label": "Melt Hardware?"})
        ]
    },
    # Scene 22 (170.36 -> 177.56, 7.20s) 3 anims
    {
        "id": "s22",
        "start": 170.36,
        "end": 177.56,
        "narration": "The secret isn't just raw computing power. It's a masterclass in systems engineering. Normally when you send a massive prompt to an AI, like an entire software code base,",
        "intent": "title",
        "intensity": "hero",
        "assets": [],
        "anims": [
            ("A01", {"title": "Systems Engineering", "subtitle": "How DeepSeek achieved peak throughput", "icon": "chip"}),
            ("A04", {"title": "Massive Prompt", "lines": ["Full repository", "Millions of tokens"]}),
            ("A38", {"before": "Secret is", "word": "Architecture", "after": "not brute force"})
        ]
    },
    # Scene 23 (177.56 -> 185.48, 7.92s) 3 anims
    {
        "id": "s23",
        "start": 177.56,
        "end": 185.48,
        "narration": "the model has to process every single word through every single layer of its network before it can write the very first letter. That reading phase eats up an enormous amount of compute.",
        "intent": "layers",
        "intensity": "medium",
        "assets": [],
        "anims": [
            ("A20", {"layers": ["Layer 1..32", "Attention Pass", "Layer 33..64"], "highlight": 1, "note": "All Layers Pass"}),
            ("A18", {"gate": "ALL LAYERS"}),
            ("A51", {"from": "Full Reading", "to": "Heavy Compute"})
        ]
    },
    # Scene 24 (185.48 -> 195.56, 10.08s) 3 anims
    {
        "id": "s24",
        "start": 185.48,
        "end": 195.56,
        "narration": "DeepSeek solved this at the architectural level by splitting their layers in half using a causal encoder/decoder design. The bottom layers act as a dedicated reader while the top layers act as a writer.",
        "intent": "compare",
        "intensity": "hero",
        "assets": [],
        "anims": [
            ("A11", {"left": "Monolith Model", "right": "Causal Split"}),
            ("A22", {"layers": ["Reader Layers", "Causal Bridge", "Writer Layers"], "highlight": 1}),
            ("A10", {"left": "Bottom: Reader", "right": "Top: Writer"})
        ]
    },
    # Scene 25 (195.56 -> 204.36, 8.80s) 3 anims
    {
        "id": "s25",
        "start": 195.56,
        "end": 204.36,
        "narration": "When your prompt comes in, it only runs through half the layers, cutting the heavy reading work in half before the server even breaks a sweat. On top of that, they use wide expert parallelism.",
        "intent": "sequence",
        "intensity": "medium",
        "assets": [],
        "anims": [
            ("A14", {"labels": ["Prompt In", "Half Layers", "Fast Start"]}),
            ("A25", {"values": [100, 50], "labels": ["Before", "After"]}),
            ("A02", {"before": "Deploying", "keyword": "Wide MoE"})
        ]
    },
    # Scene 26 (204.36 -> 212.76, 8.40s) 3 anims
    {
        "id": "s26",
        "start": 204.36,
        "end": 212.76,
        "narration": "Instead of forcing one GPU to carry all the weight, they distribute the AI's experts across clusters of 64 to 128 graphics cards.",
        "intent": "hierarchy",
        "intensity": "hero",
        "assets": [],
        "anims": [
            ("A24", {"root": "Wide MoE Cluster", "children": ["64-128 GPUs", "Shared Memory", "Expert Nodes"], "highlight": 0}),
            ("A15", {"chips": ["Expert 1", "Expert 2", "Expert N"], "result": "Distributed GPUs"}),
            ("A54", {"portal": "128 GPUs", "title": "Parallel Cluster"})
        ]
    },
    # Scene 27 (212.76 -> 219.24, 6.48s) 2 anims
    {
        "id": "s27",
        "start": 212.76,
        "end": 219.24,
        "narration": "Memory traffic drops by nearly 88%, allowing a single GPU to pump out massive amounts of data without choking.",
        "intent": "chart",
        "intensity": "hero",
        "assets": [],
        "anims": [
            ("A26", {"values": [90, 75, 45, 20, 12], "note": "-88% Traffic Drop"}),
            ("A31", {"label": "Low Bandwidth"})
        ]
    },
    # Scene 28 (219.24 -> 229.32, 10.08s) 3 anims
    {
        "id": "s28",
        "start": 219.24,
        "end": 229.32,
        "narration": "And then there's the caching. Have you ever wondered why coding agents can run for hours without lagging out? It's because of input caching. DeepSeek built an insane storage infrastructure using a custom distributed file system",
        "intent": "process",
        "intensity": "medium",
        "assets": ["logos/deepseek.svg"],
        "anims": [
            ("A36", {"icons": ["chip", "bolt", "cube", "star"], "labels": ["Prompt", "Compute", "KV Cache", "Speed"]}),
            ("A23", {"stages": ["RAM Tier", "Custom FS", "SSD Pool", "KV Cache"], "highlight": 1}),
            ("A19", {"nodes": [{"label": "Nodes", "icon": "chip"}, {"label": "Custom FS", "icon": "cube"}, {"label": "Storage", "icon": "browser"}], "highlight": 1})
        ]
    },
    # Scene 29 (229.32 -> 238.04, 8.72s) 3 anims
    {
        "id": "s29",
        "start": 229.32,
        "end": 238.04,
        "narration": "with 100 petabytes of SSD storage dedicated purely to caching context. When you combine that with their system, their cache hit rate reaches an incredible 96%.",
        "intent": "stat",
        "intensity": "hero",
        "assets": [],
        "anims": [
            ("A16", {"steps": ["Cold 0%", "Warm 60%", "Hot 90%", "Peak 96%"]}),
            ("A41", {"target": "100PB Storage"}),
            ("A05", {"text": "96 Percent Hit Rate", "emphasis": [0]})
        ]
    },
    # Scene 30 (238.04 -> 248.52, 10.48s) 3 anims
    {
        "id": "s30",
        "start": 238.04,
        "end": 248.52,
        "narration": "Most of the compute it serves has already been calculated, meaning it reuses earlier calculations instead of starting from scratch. That is why their profit margins are sitting at 80% while their API prices remain dirt cheap.",
        "intent": "compare",
        "intensity": "medium",
        "assets": [],
        "anims": [
            ("A09", {"left": {"title": "Naive Compute", "bullets": ["Re-run every layer", "Wasted energy"]}, "right": {"title": "Cache Reuse", "bullets": ["Cached attention", "Zero waste"]}}),
            ("A50", {"left": "Prefix Stored", "right": "Tokens Served"}),
            ("A12", {"left": "Cheap API Price", "right": "80% Margin"})
        ]
    },
    # Scene 31 (248.52 -> 255.48, 6.96s) 2 anims
    {
        "id": "s31",
        "start": 248.52,
        "end": 255.48,
        "narration": "Now, as exciting as all of this sounds, there is a catch you need to know about. DeepSeek's documentation is very upfront about what they didn't hand over.",
        "intent": "warning",
        "intensity": "calm",
        "assets": [],
        "anims": [
            ("A39", {"text": "The Catch"}),
            ("A13", {"items": ["Inference Engine", "Layer Code", "Infra Kept Private"]})
        ]
    },
    # Scene 32 (255.48 -> 264.76, 9.28s) 3 anims
    {
        "id": "s32",
        "start": 255.48,
        "end": 264.76,
        "narration": "Deepinfer gives you the engine, but they didn't hand over the entire industrial bakery. They kept their massive storage clusters, specialized network routing systems, and global load balancers behind closed doors.",
        "intent": "process",
        "intensity": "medium",
        "assets": ["logos/deepseek.svg"],
        "anims": [
            ("A21", {"hub": "DeepInfer", "spokes": ["Engine Code", "Parallel Kern", "Closed Storage", "Closed Mesh"]}),
            ("A52", {"from": "Engine Given", "to": "Bakery Closed"}),
            ("A34", {"icons": ["cube", "bolt", "browser", "warn"], "labels": ["Storage", "Routing", "Balancers", "Proprietary"], "target": 3})
        ]
    },
    # Scene 33 (264.76 -> 271.24, 6.48s) 2 anims
    {
        "id": "s33",
        "start": 264.76,
        "end": 271.24,
        "narration": "To actually run this at scale, you still need serious enterprise infrastructure, typically clusters of 128 high-end GPUs.",
        "intent": "stat",
        "intensity": "hero",
        "assets": [],
        "anims": [
            ("A35", {"banner": "CLUSTERS", "photos": [], "highlight": 2}),
            ("A48", {"src": "", "caption": "128 Enterprise GPUs", "note": "Required Spec"})
        ]
    },
    # Scene 34 (271.24 -> 280.84, 9.60s) 3 anims
    {
        "id": "s34",
        "start": 271.24,
        "end": 280.84,
        "narration": "But here is the most fascinating part of the release. Deepinfer explicitly supports two hardware platforms, NVIDIA's brand new Blackwell architecture and Huawei's domestic Ascend 950 chips.",
        "intent": "brand",
        "intensity": "hero",
        "assets": ["logos/nvidia.svg", "logos/huawei.svg"],
        "anims": [
            ("A17", {"items": [{"label": "Blackwell", "year": "NVIDIA"}, {"label": "Ascend 950", "year": "Huawei"}, {"label": "Bypassed", "year": "Hopper"}]}),
            ("A56", {"left": "NVIDIA", "right": "Huawei", "leftFile": "nvidia.svg", "rightFile": "huawei.svg"}),
            ("A44", {"nodes": ["Silicon", "Hardware", "Targets"]})
        ]
    },
    # Scene 35 (280.84 -> 287.64, 6.80s) 2 anims
    {
        "id": "s35",
        "start": 280.84,
        "end": 287.64,
        "narration": "Notice who's completely missing? NVIDIA's older Hopper chips like the H100. DeepSeek bypassed the previous generation entirely.",
        "intent": "screenshot",
        "intensity": "medium",
        "assets": ["screenshots/leaderboard.png"],
        "anims": [
            ("A30", {"src": "leaderboard.png", "url": "deepseek.com/hardware", "note": "Hopper Skipped"}),
            ("A53", {"front": "Hopper H100", "back": "Skipped Entirely"})
        ]
    },
    # Scene 36 (287.64 -> 293.80, 6.16s) 2 anims
    {
        "id": "s36",
        "start": 287.64,
        "end": 293.80,
        "narration": "Amid tightening US trade restrictions, they built this software to run natively on domestic Chinese silicon with first-class performance.",
        "intent": "brand",
        "intensity": "hero",
        "assets": ["logos/deepseek.svg", "logos/nvidia.svg", "logos/huawei.svg"],
        "anims": [
            ("A55", {"names": ["NVIDIA", "Huawei"], "files": ["nvidia.svg", "huawei.svg"], "hub": "DeepSeek", "hubFile": "deepseek.svg"}),
            ("A06", {"oldText": "Western Silicon", "newText": "Native Silicon"})
        ]
    },
    # Scene 37 (293.80 -> 304.20, 10.40s) 3 anims
    {
        "id": "s37",
        "start": 293.80,
        "end": 304.20,
        "narration": "It proves that frontier-scale AI operations can run completely independent of Western silicon if necessary. For the last two years, the narrative in tech has been simple. Whoever spends the most money buying the most GPUs wins.",
        "intent": "define",
        "intensity": "calm",
        "assets": [],
        "anims": [
            ("A03", {"label": "The Old Narrative", "icon": "warn"}),
            ("A04", {"title": "Old Brute Force Rule", "lines": ["Spend most money", "Buy most GPUs"]}),
            ("A45", {"count": 10, "label": "GPU Spending Race"})
        ]
    },
    # Scene 38 (304.20 -> 312.68, 8.48s) 3 anims
    {
        "id": "s38",
        "start": 304.20,
        "end": 312.68,
        "narration": "But DeepSeek keeps showing us that smart systems engineering beats brute force spending every single time. By open-sourcing Deepinfer, they've put massive pressure on cloud providers that charge high markups just to host open-source models.",
        "intent": "hierarchy",
        "intensity": "hero",
        "assets": ["logos/github.svg"],
        "anims": [
            ("A57", {"source": "TechCrunch & SemiAnalysis", "headlines": ["DeepSeek Disrupts Cloud Pricing", "Open Inference Engine Released", "Cloud Providers Under Pressure", "Margins Drop Across Industry", "Smart Systems Over Brute Force", "Inference Revolution Unfolds"], "highlight": 2}),
            ("A43", {"text": "Smart Engineering"}),
            ("A46", {"title": "Cloud Pressure", "bullets": ["Lower margins", "Public weights", "Host competition"]})
        ]
    },
    # Scene 39 (312.68 -> 321.96, 9.28s) 3 anims
    {
        "id": "s39",
        "start": 312.68,
        "end": 321.96,
        "narration": "The competition isn't just about who can build the smartest model anymore. It's about who can deliver that intelligence at the lowest possible cost. And right now, DeepSeek is writing the playbook.",
        "intent": "brand",
        "intensity": "hero",
        "assets": ["logos/deepseek.svg", "logos/chatgpt.svg", "logos/claude.svg", "logos/gemini.svg"],
        "anims": [
            ("A51", {"from": "Smartest", "to": "Lowest Cost"}),
            ("A28", {"names": ["Cost", "Speed", "Scale", "Weights"], "files": ["chatgpt.svg", "claude.svg", "gemini.svg", "deepseek.svg"], "highlight": 3}),
            ("A42", {"text": "LEAD"})
        ]
    },
    # Scene 40 (321.96 -> 331.40, 9.44s) 3 anims
    {
        "id": "s40",
        "start": 321.96,
        "end": 331.40,
        "narration": "So, what do you think? Will Western AI companies finally be forced to lower their prices after this? Or will closed-source labs find a way to fight back?",
        "intent": "question",
        "intensity": "calm",
        "assets": [],
        "anims": [
            ("A47", {"a": "Lower Prices?", "b": "Fight Back?"}),
            ("A38", {"before": "Will labs", "word": "lower prices", "after": "or fight back?"}),
            ("A32", {"label": "The Price War"})
        ]
    },
    # Scene 41 (331.40 -> 341.237, 9.837s) 3 anims
    {
        "id": "s41",
        "start": 331.40,
        "end": 341.237,
        "narration": "Let me know in the comments. And if you enjoyed breaking this down with me today, a like and subscribe always means a lot and keeps the channel rolling. Thanks for watching all the way to the end, stay safe, and I'll catch you on the next one.",
        "intent": "cta",
        "intensity": "hero",
        "assets": ["brand/vanta-brief-logo.png"],
        "anims": [
            ("A49", {"captions": ["Like", "Subscribe", "Comment"], "photos": []}),
            ("A29", {"channel": "Vanta Brief"}),
            ("A27", {"src": "brand/vanta-brief-logo.png", "name": "Vanta Brief"})
        ]
    }
]

# Build JSON structure
formatted_scenes = []
for s in raw_scenes:
    sc = {
        "id": s["id"],
        "start": s["start"],
        "end": s["end"],
        "narration": s["narration"],
        "intent": s["intent"],
        "intensity": s["intensity"],
        "assets": s["assets"],
        "animations": [{"id": a[0], "params": a[1]} for a in s["anims"]]
    }
    formatted_scenes.append(sc)

plan = {
    "fps": 30,
    "audio": "audio/voiceover.mp3",
    "scenes": formatted_scenes
}

out_path = os.path.join(R, "scene-plan.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(plan, f, indent=2)

print(f"Generated scene-plan.json with {len(formatted_scenes)} scenes.")

# Run internal checks
flat = [a[0] for s in raw_scenes for a in s["anims"]]
c = Counter(flat)
print(f"Total animation instances: {len(flat)}")
print(f"Distinct animation IDs: {len(c)}")
over = {k: v for k, v in c.items() if v > 2}
if over:
    print("ERROR: IDs used > 2 times:", over)
else:
    print("SUCCESS: All IDs used <= 2 times!")
