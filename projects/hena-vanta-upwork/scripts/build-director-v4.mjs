#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const proj = fs.existsSync("timeline.raw.json")
  ? path.resolve(".")
  : path.resolve("projects/hena-vanta-upwork");
const raw = JSON.parse(fs.readFileSync(path.join(proj, "timeline.raw.json"), "utf8"));
const journey = JSON.parse(fs.readFileSync(path.join(proj, "journey.json"), "utf8"));
const sfxManifest = JSON.parse(fs.readFileSync(path.join(proj, "public/sfx/sfx-manifest.json"), "utf8"));

const fps = 30;
const dur = +(raw.voDuration + 0.5).toFixed(3);
const rawWords = raw.words;

function findWordIndex(time) {
  let idx = rawWords.findIndex(w => w.start >= time);
  return idx >= 0 ? idx : rawWords.length - 1;
}

function findCue(sceneWords, cue) {
  const norm = (w) => w.toLowerCase().replace(/[^a-z0-9']/g, "");
  const toks = cue.toLowerCase().split(/\s+/).map(norm).filter(Boolean);
  for (let i = 0; i < sceneWords.length; i++) {
    if (toks.every((tk, k) => sceneWords[i + k] && norm(sceneWords[i + k].w) === tk)) {
      return sceneWords[i];
    }
  }
  return null;
}

// Scene plan definitions
// We will partition the 2833 words into ~52 distinct scenes
const plans = [
  // 0 - 31s: Intro
  {
    targetStart: 0,
    layout: "STACK",
    beat: "takeaway",
    why: "crystallizes the counter-intuitive lesson before debunking false ease",
    label: "SCREEN RECORDING: Upwork homepage navigation and search bar",
    statement: { text: "getting hired wasn't the **hardest** part", cue: "hardest" },
    note: { text: "*initial clients don't guarantee smooth sailing", cue: "smooth" }
  },
  {
    targetStart: 15.24,
    layout: "JOURNEY",
    beat: "journey",
    why: "opens the story on the master timeline at month one",
    focus: "start",
    cue: "march",
    revealSec: 0.5
  },
  {
    targetStart: 35.16,
    layout: "STACK",
    beat: "screenshot",
    why: "shows the software engineering platform discussed in the script",
    image: {
      src: "shots/github.png",
      label: "GitHub homepage for software engineering",
      source: "https://github.com, verified 2026-11-01",
      cue: "software"
    },
    statement: { text: "studying **software** engineering at university", cue: "software" }
  },
  {
    targetStart: 48.28,
    layout: "STACK",
    beat: "screenshot",
    why: "shows global currency transfer platform representing dollar earnings",
    image: {
      src: "shots/wise.png",
      label: "Wise global money transfer platform",
      source: "https://wise.com, verified 2026-11-01",
      cue: "dollars"
    },
    statement: { text: "earning in **dollars** from home", cue: "dollars" },
    note: { text: "*avoiding the traditional nine to five route", cue: "traditional" }
  },
  {
    targetStart: 60.18,
    layout: "STACK",
    beat: "annotate",
    why: "contrasts expectation of quick results with actual reality",
    label: "FACECAM A-ROLL: Creator explaining freelancing mindset to camera",
    items: [
      { text: "~~expecting quick results in 3 months~~", cue: "three" },
      { text: "facing early **mistakes** instead", cue: "mistakes" }
    ]
  },
  {
    targetStart: 77.6,
    layout: "JOURNEY",
    beat: "journey",
    why: "advances story to the over-optimization phase",
    focus: "optimize",
    from: "start",
    cue: "optimization",
    revealSec: 0.5
  },
  {
    targetStart: 95.0,
    layout: "STACK",
    beat: "stat",
    why: "specific number of portfolio projects needed",
    label: "SCREEN RECORDING: Profile description editor and portfolio gallery",
    stat: {
      template: "**${n}** sample projects",
      from: 0,
      to: 6,
      label: "needed instead of endless tweaking",
      cue: "six"
    }
  },
  {
    targetStart: 110.3,
    layout: "STACK",
    beat: "takeaway",
    why: "explains the risk of weak sample work hurting reputation",
    label: "SCREEN RECORDING: Freelance proposal submission editor and rate input",
    statement: { text: "weak samples hurt **portfolio** trust", cue: "portfolio" },
    note: { text: "*quality projects speak louder than profile edits", cue: "quality" }
  },
  {
    targetStart: 130.0,
    layout: "STACK",
    beat: "screenshot",
    why: "shows real open source video editing software learned",
    image: {
      src: "shots/blender.png",
      label: "Blender creative tool suite",
      source: "https://www.blender.org, verified 2026-11-01",
      cue: "learning"
    },
    statement: { text: "learning **video** editing from scratch", cue: "video" }
  },
  {
    targetStart: 148.0,
    layout: "STACK",
    beat: "keyterm",
    why: "defines Upwork platform currency mechanism",
    label: "SCREEN RECORDING: Upwork connects purchase modal and balances",
    statement: { text: "Upwork **connects** system", cue: "money" },
    note: { text: "*paid currency required to apply for jobs", cue: "buy" }
  },
  {
    targetStart: 168.0,
    layout: "STACK",
    beat: "annotate",
    why: "explains strategy regarding connects spending",
    label: "SCREEN RECORDING: Job feed filter settings for video editing contracts",
    statement: { text: "spending **connects** with clear intent", cue: "connects" },
    note: { text: "*applying with high proposal standards", cue: "applying" }
  },
  {
    targetStart: 188.0,
    layout: "STACK",
    beat: "takeaway",
    why: "contrasts sister's invitation rate with engineering struggle",
    label: "SCREEN RECORDING: Client messaging inbox and interview invitations",
    statement: { text: "editing niche had high **invitations**", cue: "invitations" },
    note: { text: "*market demand determines client response rate", cue: "engineering" }
  },
  {
    targetStart: 210.0,
    layout: "JOURNEY",
    beat: "journey",
    why: "reaches the pivot milestone where first contract was landed",
    focus: "first_client",
    from: "optimize",
    cue: "first",
    revealSec: 0.5
  },
  {
    targetStart: 228.0,
    layout: "STACK",
    beat: "screenshot",
    why: "shows YouTube video platform where editing skills were applied",
    image: {
      src: "shots/youtube.png",
      label: "YouTube video platform",
      source: "https://www.youtube.com, verified 2026-11-01",
      cue: "youtube"
    },
    statement: { text: "creating edits for **youtube** channels", cue: "youtube" }
  },
  {
    targetStart: 248.0,
    layout: "STACK",
    beat: "stat",
    why: "highlights small dollar milestone that validated the path",
    label: "SCREEN RECORDING: Contract milestone approval and escrow release",
    stat: {
      template: "**$${n}** first contract",
      from: 0,
      to: 15,
      label: "proved clients would pay",
      cue: "first"
    }
  },
  {
    targetStart: 268.0,
    layout: "STACK",
    beat: "takeaway",
    why: "explains reinvesting earnings into essential hardware",
    label: "B-ROLL FOOTAGE: Freelancer workspace setup with laptop and mouse",
    statement: { text: "reinvesting in **laptop** hardware", cue: "laptop" },
    note: { text: "*upgrading tools enabled faster turnaround times", cue: "editing" }
  },
  {
    targetStart: 288.0,
    layout: "STACK",
    beat: "annotate",
    why: "evaluates whether software engineering skills helped freelance journey",
    label: "B-ROLL FOOTAGE: Student studying at desk with computer monitor",
    items: [
      { text: "engineering discipline provided **structure**", cue: "structure" },
      { text: "creative video skills brought **revenue**", cue: "money" }
    ]
  },
  {
    targetStart: 310.0,
    layout: "JOURNEY",
    beat: "journey",
    why: "advances story to the scam awareness phase",
    focus: "scams",
    from: "first_client",
    cue: "scams",
    revealSec: 0.5
  },
  {
    targetStart: 330.0,
    layout: "STACK",
    beat: "screenshot",
    why: "shows external messaging app frequently abused by scammers",
    image: {
      src: "shots/telegram.png",
      label: "Telegram external messaging application",
      source: "https://telegram.org, verified 2026-11-01",
      cue: "telegram"
    },
    statement: { text: "avoiding **telegram** off-platform requests", cue: "telegram" },
    note: { text: "*staying on Upwork protects payment escrow", cue: "scams" }
  },
  {
    targetStart: 352.0,
    layout: "LIST",
    beat: "list",
    why: "common red flags freelancers must avoid",
    list: {
      title: { text: "job feed **red** flags", cue: "flags" },
      items: [
        { text: "unverified payment method", cue: "payment" },
        { text: "off-platform telegram links", cue: "links" },
        { text: "unrealistic budget promises", cue: "budget" }
      ]
    }
  },
  {
    targetStart: 375.0,
    layout: "STACK",
    beat: "screenshot",
    why: "shows search engine used for client vetting and company checks",
    image: {
      src: "shots/google.png",
      label: "Google search platform for company vetting",
      source: "https://www.google.com, verified 2026-11-01",
      cue: "search"
    },
    statement: { text: "vetting clients with **search** checks", cue: "search" }
  },
  {
    targetStart: 395.0,
    layout: "STACK",
    beat: "takeaway",
    why: "highlights selecting projects with clear expectations",
    label: "SCREEN RECORDING: Job feed filter settings for video editing contracts",
    statement: { text: "filtering for **serious** clients", cue: "serious" },
    note: { text: "*ignoring low quality job listings saves connects", cue: "connects" }
  },
  {
    targetStart: 418.0,
    layout: "STACK",
    beat: "stat",
    why: "breakthrough contract milestone that taught professional standards",
    label: "SCREEN RECORDING: Contract milestone approval and escrow release",
    stat: {
      template: "**$${n}** client milestone",
      from: 0,
      to: 90,
      label: "taught professional client standards",
      cue: "ninety"
    }
  },
  {
    targetStart: 440.0,
    layout: "STACK",
    beat: "takeaway",
    why: "explains respecting client brand style versus imposing personal taste",
    label: "SCREEN RECORDING: Adobe Premiere timeline with multi-track cuts",
    statement: { text: "respecting client **style** guidelines", cue: "style" },
    note: { text: "*unwanted edits cause friction and delay approval", cue: "edits" }
  },
  {
    targetStart: 462.0,
    layout: "STACK",
    beat: "takeaway",
    why: "communication principle that prevents revision cycles",
    label: "SCREEN RECORDING: Client messaging inbox and interview invitations",
    statement: { text: "**ask** before making creative changes", cue: "ask" },
    note: { text: "*aligning early protects working relationships", cue: "changes" }
  },
  {
    targetStart: 485.0,
    layout: "STACK",
    beat: "annotate",
    why: "identifying scope creep before taking on impossible jobs",
    label: "FACECAM A-ROLL: Creator explaining freelancing mindset to camera",
    items: [
      { text: "~~accepting every bloated client task~~", cue: "task" },
      { text: "saying **no** to protect review scores", cue: "no" }
    ]
  },
  {
    targetStart: 510.0,
    layout: "STACK",
    beat: "takeaway",
    why: "protecting Job Success Score from toxic contracts",
    label: "SCREEN RECORDING: Job Success Score dashboard and client reviews",
    statement: { text: "protecting your **reviews** and score", cue: "reviews" },
    note: { text: "*bad contracts destroy long term visibility", cue: "visibility" }
  },
  {
    targetStart: 535.0,
    layout: "STACK",
    beat: "takeaway",
    why: "how clients evaluate portfolio work immediately",
    label: "SCREEN RECORDING: Profile description editor and portfolio gallery",
    statement: { text: "clients judge **portfolio** in seconds", cue: "portfolio" },
    note: { text: "*clear evidence beats lengthy proposal paragraphs", cue: "proposal" }
  },
  {
    targetStart: 560.0,
    layout: "JOURNEY",
    beat: "journey",
    why: "advances story to the client retention milestone",
    focus: "retention",
    from: "scams",
    cue: "retention",
    revealSec: 0.5
  },
  {
    targetStart: 585.0,
    layout: "STACK",
    beat: "screenshot",
    why: "shows global payment processing platform used outside Upwork",
    image: {
      src: "shots/stripe.png",
      label: "Stripe payment infrastructure",
      source: "https://stripe.com, verified 2026-11-01",
      cue: "outside"
    },
    statement: { text: "building **revenue** with direct clients", cue: "revenue" }
  },
  {
    targetStart: 608.0,
    layout: "STACK",
    beat: "stat",
    why: "comparison number of outside earnings vs Upwork direct earnings",
    label: "SCREEN RECORDING: External client email inquiry and video brief",
    stat: {
      template: "**$${n}** earned outside",
      from: 0,
      to: 5000,
      label: "from repeat video editing clients",
      cue: "five"
    }
  },
  {
    targetStart: 632.0,
    layout: "STACK",
    beat: "takeaway",
    why: "the core realization about repeat client economics",
    label: "SCREEN RECORDING: Video rendering queue and export settings",
    statement: { text: "repeat clients beat cold **proposals**", cue: "proposals" },
    note: { text: "*retaining one client is worth ten applications", cue: "client" }
  },
  {
    targetStart: 658.0,
    layout: "STEPS",
    beat: "steps",
    why: "ideal sequence if starting freelancing over again",
    steps: {
      heading: { text: "if starting **freelance** again", cue: "starting" },
      items: [
        { text: "master core skill", cue: "master" },
        { text: "build 6 samples", cue: "six" },
        { text: "send direct proposals", cue: "proposals" }
      ]
    }
  },
  {
    targetStart: 685.0,
    layout: "STEPS",
    beat: "steps",
    why: "process of vetting high value job opportunities",
    steps: {
      heading: { text: "client **vetting** process", cue: "vetting" },
      items: [
        { text: "verify payment history", cue: "payment" },
        { text: "confirm realistic scope", cue: "scope" },
        { text: "align on communication", cue: "communication" }
      ]
    }
  },
  {
    targetStart: 712.0,
    layout: "STACK",
    beat: "takeaway",
    why: "emphasizes the primacy of demonstrable proof of work",
    label: "SCREEN RECORDING: Profile description editor and portfolio gallery",
    statement: { text: "your **portfolio** is the backbone", cue: "portfolio" },
    note: { text: "*proof of skill matters more than profile bio", cue: "skill" }
  },
  {
    targetStart: 738.0,
    layout: "STACK",
    beat: "annotate",
    why: "shifts focus from looking professional to developing competence",
    label: "FACECAM A-ROLL: Creator explaining freelancing mindset to camera",
    items: [
      { text: "~~focusing only on profile looks~~", cue: "looks" },
      { text: "becoming genuinely **hireable** first", cue: "hireable" }
    ]
  },
  {
    targetStart: 765.0,
    layout: "JOURNEY",
    beat: "journey",
    why: "final story culmination on the master timeline",
    focus: "verdict",
    from: "retention",
    cue: "journey",
    revealSec: 0.5
  },
  {
    targetStart: 790.0,
    layout: "STACK",
    beat: "stat",
    why: "honest summary of direct platform earnings",
    label: "SCREEN RECORDING: Upwork homepage navigation and search bar",
    stat: {
      template: "**$${n}** Upwork earnings",
      from: 0,
      to: 150,
      label: "valuable experience gained",
      cue: "one"
    }
  },
  {
    targetStart: 818.0,
    layout: "STACK",
    beat: "takeaway",
    why: "final takeaway about the compounding value of freelance skills",
    label: "B-ROLL FOOTAGE: Freelancer workspace setup with laptop and mouse",
    statement: { text: "real freelance **skills** compound", cue: "skills" },
    note: { text: "*early struggles create lasting career leverage", cue: "leverage" }
  },
  {
    targetStart: 848.0,
    layout: "LIST",
    beat: "list",
    why: "topics covered in upcoming technical breakdown video",
    list: {
      title: { text: "topics in the **next** video", cue: "video" },
      items: [
        { text: "finding real clients", cue: "finding" },
        { text: "writing winning proposals", cue: "proposals" },
        { text: "detecting scam listings", cue: "scam" }
      ]
    }
  },
  {
    targetStart: 878.0,
    layout: "STACK",
    beat: "takeaway",
    why: "call to action encouraging viewers to comment for deep dive",
    label: "FACECAM A-ROLL: Creator discussing pricing strategy directly",
    statement: { text: "comment **Upwork** for the deep dive", cue: "comment" },
    note: { text: "*full technical proposal walkthrough coming next", cue: "walkthrough" }
  }
];

console.log("Planned scenes count:", plans.length);
writeTimeline(plans);

function writeTimeline(planList) {
  const scenes = [];
  for (let i = 0; i < planList.length; i++) {
    const p = planList[i];
    const id = "s" + String(i + 1).padStart(3, "0");
    const nextP = planList[i + 1];
    
    // Find word indices
    const startWordIdx = findWordIndex(p.targetStart);
    const endWordIdx = nextP ? findWordIndex(nextP.targetStart) - 1 : rawWords.length - 1;
    const sceneWords = rawWords.slice(startWordIdx, Math.max(startWordIdx + 1, endWordIdx + 1));
    const vo = sceneWords.map(w => w.w).join(" ");
    
    const startSec = i === 0 ? 0.0 : +(sceneWords[0].start - 0.07).toFixed(3);
    const endSec = nextP 
      ? +(rawWords[endWordIdx + 1].start - 0.07).toFixed(3)
      : dur;

    const sc = {
      id,
      startSec,
      endSec,
      layout: p.layout,
      beat: p.beat,
      vo,
      why: p.why
    };

    if (p.layout === "JOURNEY") {
      sc.journey = {
        focus: p.focus,
        ...(p.from ? { from: p.from } : {}),
        cue: p.cue,
        revealSec: p.revealSec ?? 0.5
      };
    } else if (p.layout === "STEPS") {
      const items = p.steps.items.map((it, idx) => {
        const cw = findCue(sceneWords, it.cue) ?? sceneWords[Math.min(sceneWords.length - 1, idx * 3)];
        const atSec = +Math.max(0.4, cw.start - startSec - 0.05).toFixed(2);
        return { text: it.text, cue: cw.w.replace(/[^\w']/g, ""), atSec };
      });
      items.sort((a, b) => a.atSec - b.atSec);
      // Ensure strictly ascending
      for (let k = 1; k < items.length; k++) {
        if (items[k].atSec <= items[k-1].atSec) items[k].atSec = +(items[k-1].atSec + 0.6).toFixed(2);
      }
      const hw = findCue(sceneWords, p.steps.heading.cue) ?? sceneWords[0];
      sc.steps = {
        heading: {
          text: p.steps.heading.text,
          cue: hw.w.replace(/[^\w']/g, ""),
          atSec: +Math.max(0.1, hw.start - startSec - 0.05).toFixed(2)
        },
        items
      };
    } else if (p.layout === "LIST") {
      const items = p.list.items.map((it, idx) => {
        const cw = findCue(sceneWords, it.cue) ?? sceneWords[Math.min(sceneWords.length - 1, idx * 3)];
        const atSec = +Math.max(0.6, cw.start - startSec - 0.05).toFixed(2);
        return { text: it.text, cue: cw.w.replace(/[^\w']/g, ""), atSec };
      });
      items.sort((a, b) => a.atSec - b.atSec);
      for (let k = 1; k < items.length; k++) {
        if (items[k].atSec < items[k-1].atSec + 0.5) items[k].atSec = +(items[k-1].atSec + 0.6).toFixed(2);
      }
      const tw = findCue(sceneWords, p.list.title.cue) ?? sceneWords[0];
      sc.list = {
        title: {
          text: p.list.title.text,
          cue: tw.w.replace(/[^\w']/g, ""),
          atSec: +Math.max(0.1, tw.start - startSec - 0.05).toFixed(2)
        },
        items
      };
    } else if (p.layout === "STACK") {
      sc.stack = {};
      if (p.image) {
        const imw = findCue(sceneWords, p.image.cue) ?? sceneWords[0];
        sc.stack.media = {
          kind: "image",
          src: p.image.src,
          label: p.image.label,
          source: p.image.source,
          verified: true,
          aspect: "16:9",
          cue: imw.w.replace(/[^\w']/g, ""),
          atSec: 0
        };
        // Add UI sound effect for image card entrance
        const uiSfx = sfxManifest.find(m => m.category === "ui" && m.prepped);
        if (uiSfx) {
          sc.sfx = [{
            file: uiSfx.prepped,
            category: "ui",
            atSec: +startSec.toFixed(3)
          }];
        }
      } else if (p.label) {
        const mw = sceneWords[0];
        sc.stack.media = {
          kind: "placeholder",
          label: p.label,
          aspect: "16:9",
          cue: mw.w.replace(/[^\w']/g, ""),
          atSec: 0
        };
      }

      if (p.statement) {
        const sw = findCue(sceneWords, p.statement.cue) ?? sceneWords[0];
        sc.stack.statement = {
          text: p.statement.text,
          cue: sw.w.replace(/[^\w']/g, ""),
          atSec: +Math.max(0.2, sw.start - startSec - 0.05).toFixed(2)
        };
      }

      if (p.note) {
        const nw = findCue(sceneWords, p.note.cue) ?? sceneWords[Math.floor(sceneWords.length / 2)];
        sc.stack.note = {
          text: p.note.text,
          cue: nw.w.replace(/[^\w']/g, ""),
          atSec: +Math.max(sc.stack.statement ? sc.stack.statement.atSec + 0.8 : 0.8, nw.start - startSec - 0.05).toFixed(2)
        };
      }

      if (p.stat) {
        const stw = findCue(sceneWords, p.stat.cue) ?? sceneWords[0];
        sc.stack.stat = {
          template: p.stat.template,
          from: p.stat.from,
          to: p.stat.to,
          label: p.stat.label,
          cue: stw.w.replace(/[^\w']/g, ""),
          atSec: +Math.max(0.2, stw.start - startSec - 0.05).toFixed(2)
        };
      }

      if (p.items) {
        sc.stack.items = p.items.map((it, idx) => {
          const cw = findCue(sceneWords, it.cue) ?? sceneWords[Math.min(sceneWords.length - 1, idx * 3)];
          const atSec = +Math.max(0.4 + idx * 0.8, cw.start - startSec - 0.05).toFixed(2);
          return { text: it.text, cue: cw.w.replace(/[^\w']/g, ""), atSec };
        });
      }
    }

    scenes.push(sc);
  }

  // Ensure contiguous and final duration
  for (let i = 0; i < scenes.length - 1; i++) {
    scenes[i].endSec = scenes[i + 1].startSec;
  }
  scenes[scenes.length - 1].endSec = dur;

  const tl = {
    meta: {
      fps,
      width: 1920,
      height: 1080,
      durationSec: dur,
      background: "bg.mp4",
      backgroundIsVideo: true,
      backgroundDurationSec: 180,
      voiceover: "vo_norm.wav",
      textMode: "light",
      timingFile: "timeline.raw.json",
      journey
    },
    scenes
  };

  const outPath = path.join(proj, "src/timeline.json");
  fs.writeFileSync(outPath, JSON.stringify(tl, null, 2));
  console.log(`Generated ${scenes.length} scenes into ${outPath}`);
}
