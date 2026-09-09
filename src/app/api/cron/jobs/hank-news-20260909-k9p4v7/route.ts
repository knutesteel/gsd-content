import { createClient } from "@supabase/supabase-js";

const stories = [
  {
    "title": "Gartner Predicts 30% of AI-Replaced Workers Will Need to Be Rehired",
    "source_url": "https://emt.gartnerweb.com/en/newsroom/press-releases/2026-09-09-gartner-identifies-four-shifts-shaping-the-future-of-work",
    "source_name": "Gartner",
    "published_at": "2026-09-09",
    "category": "WORKPLACE ABSURDITY",
    "score": 100,
    "summary": "Gartner predicts that by 2029, 30% of employees laid off because AI replaced their roles will need to be rehired, often at significantly higher cost, as organizations discover they cut institutional knowledge and talent pipelines too aggressively.",
    "strongest_comment": "Hank: “We eliminated your job because AI could do it.” The squirrel: “Great. Why am I back?” Hank: “The AI-era efficiency plan needs your institutional knowledge. Also, your new salary is higher.”",
    "lesson": "Automation should amplify capability before it removes capability. Cutting people faster than the organization understands what knowledge, judgment and relationships they carry can turn a cost-saving initiative into an expensive rehire program.",
    "strongest_post_concept": "The AI layoff boomerang: fire the employee because AI can replace them, then rehire the same capability later at a higher price.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "Nearly a Quarter of Workers Say Leaders Don’t Follow Their Own PTO or RTO Rules",
    "source_url": "https://cmmonline.com/news/most-workers-say-leadership-makes-decisions-they-dont-understand",
    "source_name": "Cleaning & Maintenance Management / Howdy.com survey",
    "published_at": "2026-09-09",
    "category": "WORKPLACE ABSURDITY",
    "score": 99,
    "summary": "A Howdy.com survey of more than 1,000 full-time workers found 72% had seen a leadership decision they did not understand in the past year, while 24% said leaders do not follow their own PTO or return-to-office policies and 42% believe the C-suite is held to a lower behavior standard.",
    "strongest_comment": "Hank: “The policy applies to everyone.” The squirrel: “Excellent. Does ‘everyone’ include the people who wrote it?”",
    "lesson": "Rules lose legitimacy when employees watch leaders exempt themselves. Consistency is a management system: if an exception is justified, explain it; otherwise the policy becomes theater.",
    "strongest_post_concept": "The employee handbook with a hidden executive edition: same policy, different rules.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "A Rare Bat Clocked In at an Omaha Office and Became Nebraska’s First Recorded Cave Myotis",
    "source_url": "https://people.com/rare-bat-found-in-office-building-in-nebraska-first-ever-documented-in-state-12111780",
    "source_name": "People",
    "published_at": "2026-09-09",
    "category": "OFF-THE-WALL ANIMALS",
    "score": 100,
    "summary": "Workers in an Omaha office building found a tiny bat that wildlife experts identified as a cave myotis—the first documented record of the species in Nebraska, hundreds of miles from its normal range. Experts suspect it may have stowed away in freight or a truck.",
    "strongest_comment": "Hank: “New employee?” The squirrel: “Apparently. No Nebraska work authorization, arrived by freight, and chose a ramekin as temporary housing.”",
    "lesson": "An anomaly in the wrong place is information, not merely an inconvenience. Verify what you are seeing before forcing it into the nearest familiar category.",
    "strongest_post_concept": "The office’s most unexpected new hire: a bat species never before recorded in the state.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "Firefighters Use the Jaws of Life to Rescue a Terrier From a Recliner",
    "source_url": "https://patch.com/maryland/belair/dog-freed-inside-recliner-jaws-life-joppa-magnolia-vfc",
    "source_name": "Patch",
    "published_at": "2026-09-08",
    "category": "OFF-THE-WALL ANIMALS",
    "score": 100,
    "summary": "A rescue terrier named Highway became so deeply trapped inside a recliner in Joppatowne, Maryland, that firefighters used hydraulic Jaws of Life equipment normally associated with vehicle extrication to free him before taking him to an emergency veterinarian.",
    "strongest_comment": "Hank: “What’s the emergency?” The squirrel: “Dog versus recliner. The recliner has escalated to heavy rescue equipment.”",
    "lesson": "Small causes can create large recovery jobs. Solve the problem at the scale it has become, not the scale it looked like when it started.",
    "strongest_post_concept": "A household chair quietly upgrades a pet problem into a Jaws-of-Life emergency.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "Prehistoric Builders Hauled 55,000-Pound Stones 11 Miles Instead of Using Closer Rock",
    "source_url": "https://sciencedaily.com/releases/2026/09/260909005152.htm",
    "source_name": "ScienceDaily / Curtin University",
    "published_at": "2026-09-09",
    "category": "SQUIRREL DISTRACTION / WEIRD FACTS",
    "score": 100,
    "summary": "Mineral fingerprinting shows Britain’s Devil’s Arrows were made from roughly 25-ton stones transported at least 18 kilometers from Brimham Rocks about 4,000 years ago, even though suitable-looking stone sources were closer.",
    "strongest_comment": "Hank: “There was rock closer.” The squirrel: “Yes, but apparently prehistoric project management had a very strong stakeholder requirement for the rock eleven miles away.”",
    "lesson": "People do not always optimize for convenience. When a choice looks irrational, investigate the value system or constraint the decision-maker was actually optimizing.",
    "strongest_post_concept": "The 4,000-year-old project plan that chose the 55,000-pound material from eleven miles away on purpose.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "Scientists Asked Hundreds of Astrobiologists if We Found Aliens. Only 6.6% Said Probably.",
    "source_url": "https://www.sciencedaily.com/releases/2026/09/260909005212.htm",
    "source_name": "ScienceDaily / The Conversation",
    "published_at": "2026-09-09",
    "category": "SQUIRREL DISTRACTION / WEIRD FACTS",
    "score": 100,
    "summary": "After high-profile 2025 claims involving possible biological molecules on exoplanet K2-18b, a survey of astrobiologists found only 6.6% thought extraterrestrial life had probably been found; 15.1% said the same about intriguing mineral patterns in a Martian rock.",
    "strongest_comment": "Hank: “The headline says strongest hint of alien life.” The squirrel: “The people who study alien life voted 6.6%. I have questions.”",
    "lesson": "Exciting evidence and confident conclusions are different things. Curiosity should increase when evidence is surprising; certainty should increase only when the evidence earns it.",
    "strongest_post_concept": "The alien-life headline versus the tiny ‘probably aliens’ bar on the scientist poll.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "School District Spends Millions on i-Ready, Then Votes to Study What the Screen Time Is Doing",
    "source_url": "https://www.kolotv.com/2026/09/09/wcsd-approves-study-into-screen-time-impact-students/",
    "source_name": "KOLO 8 News Now",
    "published_at": "2026-09-09",
    "category": "PARENTING",
    "score": 100,
    "summary": "Washoe County School District voted to study the effect of student screen time amid parent opposition to its K-8 i-Ready program. The district has spent more than $8 million on i-Ready since its 2023 rollout and approved a $2.02 million extension in May; study findings could affect the next renewal.",
    "strongest_comment": "Hank: “How did the evaluation go before we spent millions?” The squirrel: “We’re doing the evaluation now.”",
    "lesson": "Evaluate the outcome before a tool becomes infrastructure. Once families, teachers, budgets and routines depend on a system, asking whether it works becomes much more expensive.",
    "strongest_post_concept": "The school software lifecycle: buy it, scale it, spend millions, then schedule the ‘does this help?’ study.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "A Student Calls AI a ‘Study Buddy’ Because It Does the Homework",
    "source_url": "https://www.axios.com/local/cleveland/2026/09/09/cmsd-ai-school-district-policy-artificial-intelligence",
    "source_name": "Axios Cleveland",
    "published_at": "2026-09-09",
    "category": "PARENTING",
    "score": 100,
    "summary": "Cleveland Metropolitan School District is rolling out a human-centered AI policy while confronting a practical enforcement problem: students can use AI to complete assignments. One student described AI as a ‘study buddy’ that does the homework, while research cited by Axios found AI can improve homework performance while hurting later exam performance.",
    "strongest_comment": "Hank: “What does your study buddy do?” The squirrel, playing the student: “Mostly the studying. And the homework.”",
    "lesson": "Performance on the assignment is not the same as learning. A useful family or school rule should preserve the part of the task where the student has to think, retrieve and struggle productively.",
    "strongest_post_concept": "The ‘study buddy’ that completes the homework and leaves the student to take the test alone.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "Even Perfect School Attendance Covers Only About 14% of a Child’s Waking Hours",
    "source_url": "https://humancapabilityinitiative.org/en/hci/2025/knowledge-hub/raising-futures-why-parents-are-key-to-skill-development2",
    "source_name": "Human Capability Initiative",
    "published_at": "2026-09-09",
    "category": "PARENTING",
    "score": 96,
    "summary": "A Human Capability Initiative analysis notes that even a child who attends two full years of preschool plus 13 years of compulsory school without missing a day spends only about 14% of waking hours in school, underscoring how much learning environment exists outside formal education.",
    "strongest_comment": "Hank: “The school is responsible for developing the kid.” The squirrel: “Great. What’s our plan for the other 86% of waking childhood?”",
    "lesson": "Do not assign 100% of an outcome to the system that controls 14% of the available time. Parenting routines, conversation, reading, sleep and everyday expectations are part of the learning environment too.",
    "strongest_post_concept": "The pie chart where ‘school’ is 14% and parents discover the other 86% still exists.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "Only 31% of Workers Say They Reach a True Focus State Every Day",
    "source_url": "https://www.resume-now.com/job-resources/careers/fleeting-flow",
    "source_name": "Resume Now",
    "published_at": "2026-09-08",
    "category": "OVERWHELMED",
    "score": 100,
    "summary": "A survey of 1,012 U.S. employees found only 31% feel fully focused every day, while 77% say low-value repetitive work consumes a meaningful portion of their week, 64% say only about half or fewer of their meetings are productive and 58% feel pressure to remain available outside normal hours.",
    "strongest_comment": "Hank: “When do you do the actual work?” The squirrel: “Between the meeting about the work, the notification about the meeting and the busywork proving I’m working.”",
    "lesson": "Focus is a capacity that organizations can either protect or continuously spend. Reduce low-value work, interruptions and meetings before asking employees for another productivity technique.",
    "strongest_post_concept": "A workday calendar so full of work-about-work that the real work has nowhere to go.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "The Nonstop News Cycle Now Comes With Built-In Guided Meditation",
    "source_url": "https://www.thewrap.com/media-platforms/journalism/ms-now-rachel-maddow-calm-membership/",
    "source_name": "TheWrap",
    "published_at": "2026-09-08",
    "category": "OVERWHELMED",
    "score": 100,
    "summary": "MS NOW’s new direct-to-consumer membership launches with live news Q&As plus guided meditations from Calm designed to help members recover from an ‘overwhelming, nonstop news cycle’ without disengaging from the news.",
    "strongest_comment": "Hank: “We finished consuming the news.” The squirrel: “Great. The news app has opened the recovery module.”",
    "lesson": "When an information stream requires a built-in recovery experience, the volume itself is part of the product problem. Deliberate off-ramps and limits can be more useful than simply consuming better content faster.",
    "strongest_post_concept": "Doomscrolling has matured into a full product journey: headline, live Q&A, then guided recovery meditation.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "85% of Executives Say Their Tech Stack Is Disconnected — and the C-Suite Can’t Agree Who Should Fix It",
    "source_url": "https://somo.social/e/ondiscourse-breakfast-club-for-ai-leaders-the-9-september-2026",
    "source_name": "ON_Discourse / Code and Theory event preview",
    "published_at": "2026-09-09",
    "category": "OVERWHELMED",
    "score": 99,
    "summary": "A preview of forthcoming WSJ Intelligence and Code and Theory research involving 800 C-suite leaders says 85% acknowledge their tech stacks are disconnected while executives disagree about ownership of fixing the problem; meanwhile the number of AI tools continues to multiply.",
    "strongest_comment": "Hank: “Who owns connecting all the tools?” The squirrel: “The CEO says CTO. The CTO says CEO. While they decide, I added three more tools.”",
    "lesson": "Tool proliferation without clear ownership turns employees into integration middleware. Define who owns orchestration and retire redundant systems before adding another layer.",
    "strongest_post_concept": "An org chart where every executive points at another executive while disconnected AI apps reproduce in the background.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "A NASA Satellite-Image Algorithm Became an Archaeology Tool Because One Man Connected His Job to His Hobby",
    "source_url": "https://www.nasa.gov/technology/tech-transfer-spinoffs/nasa-technique-for-manipulating-satellite-photos-now-reveals-ancient-images/",
    "source_name": "NASA",
    "published_at": "2026-09-08",
    "category": "RABBIT HOLES WITH A GOOD END",
    "score": 100,
    "summary": "Decorrelation stretch was developed for image analysis at NASA/JPL, but rock-art enthusiast Jon Harman recognized that the technique could expose faint colors in ancient paintings. His DStretch implementation has since helped reveal about 200 paintings at Angkor Wat and imagery, structures and tattoos at archaeological sites worldwide.",
    "strongest_comment": "Hank: “What does your NASA image-processing work have to do with your rock-art hobby?” The squirrel: “Apparently about 200 invisible paintings at Angkor Wat.”",
    "lesson": "Sometimes the squirrel should win because expertise from one domain becomes unusually valuable when carried into another. Side interests create connections that a narrowly optimized job description may never produce.",
    "strongest_post_concept": "NASA satellite tech takes a hobby detour and starts revealing ancient paintings nobody could see.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "An Amateur’s iNaturalist Photo Triggered the Discovery of a New Hoverfly Species",
    "source_url": "https://timesofindia.indiatimes.com/science/wildlife/meet-franklin-howley-dumit-serulle-the-amateur-naturalist-whose-online-insect-photo-helped-reveal-a-new-hoverfly-species/articleshow/133960389.cms",
    "source_name": "The Times of India / Swiss Academy of Sciences",
    "published_at": "2026-09-09",
    "category": "RABBIT HOLES WITH A GOOD END",
    "score": 100,
    "summary": "Amateur naturalist Franklin Howley-Dumit Serulle uploaded a photograph of an unusual hoverfly from the Dominican Republic to iNaturalist. An entomologist noticed the morphology, specialists followed the clue, a field expedition collected a specimen and laboratory analysis confirmed the new species Monoceromyia ndidiae.",
    "strongest_comment": "Hank: “You uploaded a bug photo.” The squirrel: “Correct. Scientists turned it into a field expedition and a new species.”",
    "lesson": "Productive curiosity leaves evidence other people can use. Document the weird thing, share it in the right place and let a community with complementary expertise follow the trail.",
    "strongest_post_concept": "One random bug photo becomes a scientist group chat, field expedition and new species.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "A Student Tweaked a Repeat Experiment for Better Purity and Accidentally Made a Molecule New to Science",
    "source_url": "https://mag.washcoll.edu/spring-2026/spring-2026-home/people-robert-donnelly/index.html",
    "source_name": "Washington College",
    "published_at": "2026-09-08",
    "category": "RABBIT HOLES WITH A GOOD END",
    "score": 100,
    "summary": "Washington College student Robert Donnelly was interning at the U.S. Naval Research Laboratory and tasked with precisely repeating published ligand experiments. He made a small process tweak intended to improve purity; the deviation created an unreported molecule, and his detailed lab notes helped colleagues recognize what had happened.",
    "strongest_comment": "Hank: “Your assignment was to repeat the experiment exactly.” The squirrel: “I changed one thing for purity.” Hank: “And?” The squirrel: “New molecule.”",
    "lesson": "The squirrel should win when deviation is observable and documented. Controlled tinkering plus meticulous notes can turn an apparent mistake into a reproducible discovery.",
    "strongest_post_concept": "The intern who slightly ignores ‘repeat exactly’ and accidentally adds a molecule to science.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  }
];

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return Response.json({ error: "Missing Supabase server configuration" }, { status: 503 });
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.rpc("ingest_hank_news_updates", {
    p_user_id: "db7d5dee-c813-40b6-a966-ebfacbee862d",
    p_stories: stories
  });
  if (error) return Response.json({ error: error.message, details: error.details, hint: error.hint, code: error.code }, { status: 500 });
  return Response.json({ count: Array.isArray(data) ? data.length : null, data });
}
