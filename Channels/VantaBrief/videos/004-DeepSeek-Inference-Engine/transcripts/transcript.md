# Transcript: audio.mp3

- **Language:** en (probability: 0.986)
- **Duration:** 341.23s
- **Model:** faster-whisper base (cuda/float16)

## Scene & Segment Timestamps

**[00:00:00.000 -> 00:00:05.040]** Silicon Valley spent billions of dollars locking down AI behind expensive monthly subscriptions.

**[00:00:05.380 -> 00:00:08.800]** For the past year, the biggest mystery wasn't just how Chinese labs trained their models.

**[00:00:09.020 -> 00:00:12.820]** It was how they managed to sell access to them for pennies while Western companies burned through

**[00:00:12.820 -> 00:00:16.800]** billions in cloud bills. Most people in the industry assumed it had to be a financial bluff

**[00:00:16.800 -> 00:00:20.720]** that labs like DeepSeek were taking massive losses just to undercut the competition.

**[00:00:21.040 -> 00:00:25.120]** Well, a few weeks ago, DeepSeek quietly dropped an update that changed everything. They released

**[00:00:25.120 -> 00:00:30.820]** DeepSeek V4.1 Flash 2017 and alongside it, they opened source their core production

**[00:00:30.820 -> 00:00:35.060]** inference engine, DeepEnphere, and the numbers coming out of their data centers are genuinely

**[00:00:35.060 -> 00:00:40.660]** staggering. In a single cluster, this system processes 155 trillion tokens every single day.

**[00:00:40.760 -> 00:00:44.800]** That comes out to roughly 1.8 billion words generated every second around the clock.

**[00:00:45.080 -> 00:00:49.660]** Even during discounted off peak hours, a single GPU running their setup generates about $38

**[00:00:49.660 -> 00:00:54.600]** of revenue per hour. When an enterprise AI chip typically costs $5 to $10 an hour to run,

**[00:00:54.600 -> 00:00:59.480]** DeepSeek isn't losing money at all. They are operating at an estimated 80% gross profit margin,

**[00:00:59.660 -> 00:01:03.180]** and instead of keeping those optimization secrets locked away like every other major tech

**[00:01:03.180 -> 00:01:08.460]** company, they put the entire engine on GitHub for free. So, can this new open source monster actually

**[00:01:08.460 -> 00:01:12.480]** match the closed frontier models? Or is it just another project that looks impressive on a benchmark

**[00:01:12.480 -> 00:01:16.320]** sheet until you try it? Let's look at what it can actually do, how they pulled off this engineering

**[00:01:16.320 -> 00:01:19.960]** magic trick and whether you should switch. To find out what this model is capable of, I didn't

**[00:01:19.960 -> 00:01:23.640]** just read boring static benchmark. I dug straight into the official test runs, case studies,

**[00:01:23.640 -> 00:01:28.220]** and technical evaluations to see how it handles heavy-duty tasks. Now, you could use DeepSeek

**[00:01:28.220 -> 00:01:32.240]** on their standard webchat interface, but this model is built for agentic workflows and long

**[00:01:32.240 -> 00:01:36.640]** horizon tasks. A much better way to use it is with an agentic coding harness, like their very

**[00:01:36.640 -> 00:01:41.180]** own open source harness. When you put it through complex generation tests, like asking it to build

**[00:01:41.180 -> 00:01:45.760]** a complete interactive 3D mechanical watch diagram from scratch, it doesn't just write basic

**[00:01:45.760 -> 00:01:50.120]** code. It figures out the spatial geometry, the lighting, the shadows, and the interactive elements,

**[00:01:50.120 -> 00:01:54.340]** so you can hover over a gear and see what it does. And look at what it comes up with. Look how clean

**[00:01:54.340 -> 00:01:58.780]** this is. All of the pieces fit together. You can see the lighting and the shadows moving as you

**[00:01:58.780 -> 00:02:02.820]** rotate the watch face. If you hover over the hairspring, it gives you a precise definition.

**[00:02:03.240 -> 00:02:07.640]** You can click Explod, and it breaks apart every single layer of the watch into a 3D space.

**[00:02:07.860 -> 00:02:11.940]** For an open source model, that level of spatial reasoning and 3D generation is completely unreal.

**[00:02:12.240 -> 00:02:16.360]** Next, when tested on heavy multimodal reasoning, like uploading a high resolution image of a bakery

**[00:02:17.000 -> 00:02:20.640]** packed with pastries and asking it to count and identify every single item individually,

**[00:02:20.900 -> 00:02:24.780]** it takes a few minutes of deep thinking, cropping, and analyzing layers. But it successfully

**[00:02:24.780 -> 00:02:30.560]** categorizes and counts over 130 individual pastries, factoring in the ones hidden behind the

**[00:02:30.560 -> 00:02:34.920]** stacks. Even more impressive is the speed. When you turn off reasoning and just look at text output,

**[00:02:35.060 -> 00:02:41.040]** it flies at over 125 to 150 tokens per second. With optimized cloud providers pushing past 800

**[00:02:41.040 -> 00:02:45.540]** tokens per second, it's fast, it's cheap, and the intelligence is dangerously close to top tier

**[00:02:45.540 -> 00:02:49.800]** closed models. But how did they make an open source model run this fast without melting the

**[00:02:49.800 -> 00:02:54.020]** hardware? The secret isn't just raw computing power. It's a masterclass in systems engineering.

**[00:02:54.300 -> 00:02:57.460]** Normally, when you send a massive prompt to an AI like an entire software code base,

**[00:02:57.660 -> 00:03:01.720]** the model has to process every single word through every single layer of its network before it

**[00:03:01.720 -> 00:03:05.300]** can write the very first letter. That reading phase eats up an enormous amount of compute.

**[00:03:05.740 -> 00:03:10.220]** Deepseek solved this at the architectural level by splitting their layers in half using a causal

**[00:03:10.220 -> 00:03:14.920]** encoder decoder design. The bottom layers act as a dedicated reader while the top layers act

**[00:03:14.920 -> 00:03:18.540]** as a writer. When your prompt comes in, it only runs through half the layers,

**[00:03:18.820 -> 00:03:22.600]** cutting the heavy reading work in half before the server even breaks a sweat. On top of that,

**[00:03:22.680 -> 00:03:26.700]** they use wide expert parallelism. Instead of forcing one GPU to carry all the weight,

**[00:03:26.900 -> 00:03:33.860]** they distribute the AI's experts across clusters of 64 to 128 graphics cards. Memory traffic drops

**[00:03:33.860 -> 00:03:39.120]** by nearly 88%, allowing a single GPU to pump out massive amounts of data without choking.

**[00:03:39.420 -> 00:03:43.080]** And then there's the caching. Have you ever wondered why coding agents can run for hours without

**[00:03:43.080 -> 00:03:47.680]** lagging out? It's because of input caching. Deepseek built an insane storage infrastructure using

**[00:03:47.680 -> 00:03:52.940]** a custom distributed file system with 100 petabytes of SSD storage dedicated purely to caching

**[00:03:52.940 -> 00:03:58.060]** context. When you combine that with their system, their cache hit rate reaches an incredible 96%.

**[00:03:58.060 -> 00:04:02.440]** Most of the compute it serves has already been calculated, meaning it reuses earlier calculations

**[00:04:02.440 -> 00:04:06.320]** instead of starting from scratch. That is why their profit margins are sitting at 80%

**[00:04:06.320 -> 00:04:10.480]** while their API prices remain dirt cheap. Now, as exciting as all of this sounds,

**[00:04:10.480 -> 00:04:14.640]** there is a catch you need to know about. Deepseek's documentation is very upfront about what

**[00:04:14.640 -> 00:04:18.260]** they didn't hand over. Deepinfer gives you the engine, but they didn't hand over the entire

**[00:04:18.260 -> 00:04:22.600]** industrial bakery. They kept their massive storage clusters, specialized network routing systems,

**[00:04:22.760 -> 00:04:26.540]** and global load balancers behind closed doors. To actually run this at scale, you still need

**[00:04:26.540 -> 00:04:31.900]** serious enterprise infrastructure, typically clusters of 128 high-end GPUs. But here is the

**[00:04:31.900 -> 00:04:36.280]** most fascinating part of the release. Deepinfer explicitly supports two hardware platforms,

**[00:04:36.280 -> 00:04:41.180]** Nvidia's brand new blackwell architecture and Huawei's domestic ascend 950 chips. Notice

**[00:04:41.180 -> 00:04:46.160]** who's completely missing? Nvidia's older hopper chips, like the H100. Deepseek bypassed the

**[00:04:46.160 -> 00:04:50.480]** previous generation entirely. Amid tightening U.S. trade restrictions, they built this software

**[00:04:50.480 -> 00:04:54.380]** to run natively on domestic Chinese Silicon with first-class performance. It proves that

**[00:04:54.380 -> 00:04:58.940]** frontier-scale AI operations can run completely independent of Western Silicon if necessary.

**[00:04:59.140 -> 00:05:02.720]** For the last two years, the narrative in tech has been simple. Whoever spends the most money

**[00:05:02.720 -> 00:05:07.460]** buying the most GPUs wins. But Deepseek keeps showing us that smart systems engineering beats

**[00:05:07.460 -> 00:05:11.820]** brute force spending every single time. By open sourcing Deepinfer, they've put massive pressure

**[00:05:11.820 -> 00:05:16.080]** on cloud providers that charge high markups just to host open source models. The competition

**[00:05:16.080 -> 00:05:20.020]** isn't just about who can build the smartest model anymore. It's about who can deliver that

**[00:05:20.020 -> 00:05:24.080]** intelligence at the lowest possible cost. And right now, Deepseek is writing the playbook.

**[00:05:24.320 -> 00:05:28.880]** So what do you think? Will Western AI companies finally be forced to lower their prices after this?

**[00:05:28.880 -> 00:05:32.320]** Or will closed source labs find a way to fight back? Let me know in the comments.

**[00:05:32.660 -> 00:05:36.400]** And if you enjoyed breaking this down with me today, a like and subscribe always means a lot

**[00:05:36.400 -> 00:05:39.860]** and keeps the channel rolling. Thanks for watching all the way to the end, stay safe,

**[00:05:39.920 -> 00:05:41.060]** and I'll catch you on the next one.
