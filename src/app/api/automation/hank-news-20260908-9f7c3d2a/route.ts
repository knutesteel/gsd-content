import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const USER_ID = "db7d5dee-c813-40b6-a966-ebfacbee862d";

const STORIES = [
  {
    title: "AI Company Tells Employees: Please Send Me the D+ Version Before AI Turns It Into Five Pages",
    source_url: "https://tech.yahoo.com/ai/deals/articles/tech-ceo-said-wants-d-095501025.html",
    source_name: "Yahoo Tech / Business Insider",
    published_at: "2026-09-07",
    category: "WORKPLACE ABSURDITY",
    score: 100,
    summary: "Spellbook CEO Scott Stevenson says AI polish can hide weak thinking, so the company asks employees to start with rough bullets, label AI-assisted drafts, keep core proposal reasoning human-first, and remain accountable for the final result.",
    strongest_comment: "Hank: ‘The AI company is asking employees not to use AI on the proposal?’ The squirrel: ‘Only until the idea exists.’",
    lesson: "Writing is part of thinking. If automation polishes before the reasoning exists, it can hide uncertainty and create more reading work. Optimize clarity and decision speed, not apparent polish.",
    strongest_post_concept: "The D+ Draft: five rough bullets beat five pages of AI polish.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Workers Are Building AI Org Charts — Then Hiring Another AI to Manage the AIs",
    source_url: "https://tech.yahoo.com/ai/articles/why-coworker-suddenly-obsessed-little-080701633.html",
    source_name: "Yahoo Tech / Business Insider",
    published_at: "2026-09-08",
    category: "WORKPLACE ABSURDITY",
    score: 100,
    summary: "A current workplace trend has employees building teams of named AI agents. One marketer built 16 agents plus a ‘Conductor’ to coordinate them; another runs roughly 25 agents and an additional agent to monitor them, while Glean says office workers can spend more than six hours a week ‘botsitting.’",
    strongest_comment: "Hank: ‘How many coworkers do you have?’ The squirrel: ‘Sixteen agents and one agent whose job is supervising the agents.’",
    lesson: "Agent count is a vanity metric. Measure reliable time saved, quality improved, and bottlenecks removed after maintenance and supervision are included.",
    strongest_post_concept: "The AI Org Chart Needs an AI Manager.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "A Third of Workers Think an AI Boss Would Make Them More Productive — but Three Quarters Still Want Human Feedback",
    source_url: "https://www.techradar.com/pro/a-third-of-workers-believe-having-an-ai-boss-would-make-them-more-productive",
    source_name: "TechRadar",
    published_at: "2026-09-08",
    category: "WORKPLACE ABSURDITY",
    score: 98,
    summary: "A Careerminds UK survey of 600 full-time employees found 36.7% think an AI boss would improve their productivity, yet 74.2% still prefer a human for performance feedback. Directors were more optimistic about AI-driven productivity gains than managers.",
    strongest_comment: "Hank: ‘You want an AI boss?’ The squirrel: ‘For the admin. For my performance review, I’d like a mammal.’",
    lesson: "Management mixes routing and administration with judgment, context, and trust. Automate the reducible parts before assuming the human parts should disappear too.",
    strongest_post_concept: "AI Boss Until Performance Review Day.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Five Baby Orangutans Appear in an Indian Forest Where Orangutans Do Not Live",
    source_url: "https://indianexpress.com/article/india/odisha-forest-baby-orangutans-10868229/",
    source_name: "The Indian Express",
    published_at: "2026-09-08",
    category: "OFF-THE-WALL ANIMALS",
    score: 100,
    summary: "Forest officials rescued five juvenile orangutans near Badapai village in Odisha. Orangutans are not native to India, so authorities are investigating how they arrived there and suspect wildlife trafficking or another human-caused explanation rather than a natural sighting.",
    strongest_comment: "Hank: ‘We found five orangutans.’ The squirrel: ‘In India?’ Hank: ‘Correct, which changes this from a sighting to an investigation.’",
    lesson: "A fact in the wrong context is often the clue. Update the diagnosis promptly instead of forcing an anomaly into the expected category.",
    strongest_post_concept: "The Wildlife Sighting That Is Geographically Impossible.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Florida Accidentally Turned Opossum Tracking Collars Into Python Detectors",
    source_url: "https://timesofindia.indiatimes.com/world/us/a-12-foot-burmese-python-revealed-floridas-bizarre-new-method-for-finding-hidden-invasive-snakes-after-it-swallowed-a-collared-opossum/articleshow/133865070.cms",
    source_name: "The Times of India",
    published_at: "2026-09-07",
    category: "OFF-THE-WALL ANIMALS",
    score: 100,
    summary: "Current coverage revisits a Florida wildlife-tracking method that emerged from a strange 2022 signal: when a collared opossum’s mortality beacon was followed by renewed movement, researchers realized the tracker could be inside an invasive Burmese python, turning prey telemetry into a way to locate otherwise hidden snakes.",
    strongest_comment: "Hank: ‘The collar started moving again after the opossum stopped.’ The squirrel: ‘Which is how Florida discovered the tracker was now inside a python.’",
    lesson: "Unexpected telemetry can reveal a second use for a system. Investigate signals that violate the assumptions instead of automatically discarding them as bad data.",
    strongest_post_concept: "The AirTag Is Moving Again — Inside the Python.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Injured Leopard Attacks Rescuer Before the Tranquilizer Fully Takes Effect",
    source_url: "https://www.ndtv.com/india-news/leopard-hit-by-car-attacks-forest-official-during-rescue-in-karnataka-video-goes-viral-12017904",
    source_name: "NDTV",
    published_at: "2026-09-08",
    category: "OFF-THE-WALL ANIMALS",
    score: 97,
    summary: "A leopard injured after being struck by a vehicle in Karnataka lunged at a rescue official after a tranquilizer had been administered but before the sedative was fully effective. Colleagues intervened, and the animal was later secured and taken for veterinary care.",
    strongest_comment: "Hank: ‘We’re here to help it.’ The squirrel: ‘The leopard is injured, frightened, and has not adopted our project plan.’",
    lesson: "Good intentions do not reduce operational risk. Build the plan around the actual state of a stressed or unpredictable subject rather than the state you expect it to reach.",
    strongest_post_concept: "Rescue Plan Meets a Leopard That Isn’t Sedated Yet.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "A Brainless Single Cell Rebuilt Tokyo’s Rail Network and Started a Fight About Intelligence",
    source_url: "https://www.theguardian.com/news/ng-interactive/2026/sep/08/this-is-dangerous-slime-moulds-and-the-bitter-debate-over-the-nature-of-intelligence",
    source_name: "The Guardian",
    published_at: "2026-09-08",
    category: "SQUIRREL DISTRACTION / WEIRD FACTS",
    score: 100,
    summary: "Physarum polycephalum is a brainless single-celled slime mould famous for maze-solving and for reproducing network patterns that resembled Tokyo’s rail system. Its behavior continues to fuel scientific debate over what words such as learning, memory, and intelligence should mean without a nervous system.",
    strongest_comment: "Hank: ‘It doesn’t have a brain.’ The squirrel: ‘Neither does our project-routing spreadsheet, and the slime mould may be better at transit.’",
    lesson: "Do not let a familiar label stop you from examining unexpected problem-solving behavior. The anomaly may reveal that the category itself needs refinement.",
    strongest_post_concept: "The Brainless Transit Planner.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Scientists Made Car-Paint-Quality Color With No Pigment",
    source_url: "https://www.kobe-u.ac.jp/en/news/article/20260908-68240/",
    source_name: "Kobe University",
    published_at: "2026-09-08",
    category: "SQUIRREL DISTRACTION / WEIRD FACTS",
    score: 100,
    summary: "Kobe University researchers developed a glossy structural-color coating based on silicon nanospheres rather than conventional pigment. The approach is designed to resist fading, scale to complex 3D surfaces, and reduce the strong angle dependence that often limits structural colors.",
    strongest_comment: "Hank: ‘What color is the pigment?’ The squirrel: ‘There is no pigment. The color is geometry.’",
    lesson: "Radical simplification sometimes comes from changing the mechanism instead of optimizing the ingredients already in the system.",
    strongest_post_concept: "The Paint With No Paint.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Scientists Are Modeling Love With Equations That Trace Back to Rabbits and Predators",
    source_url: "https://www.sciencedaily.com/releases/2026/09/260906170140.htm",
    source_name: "ScienceDaily / Taylor & Francis Group",
    published_at: "2026-09-07",
    category: "SQUIRREL DISTRACTION / WEIRD FACTS",
    score: 99,
    summary: "Researchers are applying dynamical-systems mathematics to attraction, conflict, recovery, and relationship tipping points. The mathematical lineage includes population and predator–prey models, but the researchers present the models as tools for understanding patterns rather than deterministic predictions of individual relationships.",
    strongest_comment: "Hank: ‘Can math save a relationship?’ The squirrel: ‘It can apparently warn when the system is approaching “we need to talk.”’",
    lesson: "A model can expose patterns and tipping points without pretending to predict individual destiny. Use models to sharpen questions, not replace judgment.",
    strongest_post_concept: "Romance, Now With Predator-Prey Equations.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Teenagers Have More Text Than Ever — and Reading Scores Are at a 25-Year Low",
    source_url: "https://www.reuters.com/world/china/teen-reading-slumps-worst-this-century-due-surge-screen-time-2026-09-08/",
    source_name: "Reuters",
    published_at: "2026-09-08",
    category: "PARENTING",
    score: 100,
    summary: "OECD PISA 2025 results covering about 760,000 15-year-olds across 91 countries and economies show reading, math, and science performance at their lowest levels since 2000. The OECD links heavier digital distraction and less pleasure reading with weaker comprehension, while the data are observational rather than proof that screen time alone caused the decline.",
    strongest_comment: "Hank: ‘They’re surrounded by words all day.’ The squirrel: ‘We appear to have invented reading without the lingering.’",
    lesson: "Consuming text is not the same as practicing sustained reading. Protect stretches of deep attention before adding another learning technology or notification stream.",
    strongest_post_concept: "Surrounded by Text, Losing the Skill of Reading.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Parents Say U.S. Schools Are Failing — Except, Mostly, Their Own Kid’s School",
    source_url: "https://news.gallup.com/poll/714017/satisfaction-education-hits-new-low.aspx",
    source_name: "Gallup",
    published_at: "2026-09-07",
    category: "PARENTING",
    score: 99,
    summary: "Gallup found only 32% of Americans satisfied with U.S. K-12 education, while 66% of parents with a child in K-12 are satisfied with the education their own child receives. Both measures are low by their historical standards, but the national-versus-personal gap remains striking.",
    strongest_comment: "Hank: ‘How’s American education?’ The squirrel: ‘Terrible.’ Hank: ‘How’s your kid’s education?’ The squirrel: ‘Mostly good.’",
    lesson: "National narratives and direct local experience can diverge sharply. Diagnose the system closest to you with firsthand evidence before assuming the broad story perfectly describes the local one.",
    strongest_post_concept: "The School-System Perception Gap.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Parenting Has So Much Admin That Families Are Hiring an AI Chief of Staff",
    source_url: "https://techcrunch.com/2026/09/01/fambot-introduces-an-ai-chief-of-staff-for-families/",
    source_name: "TechCrunch",
    published_at: "2026-09-01",
    category: "OVERWHELMED",
    score: 100,
    summary: "Fambot is positioning itself as an AI chief of staff for families, consolidating information from email, calendars, WhatsApp, school and activity logistics into daily checklists and look-aheads. Its CEO, a father of three, said he was spending about an hour just catching up across roughly 40 emails plus family communication channels; the product has been tested by more than 1,000 families.",
    strongest_comment: "Hank: ‘You have a chief of staff?’ The squirrel: ‘No. The children generated enough logistics to qualify the household as a small company.’",
    lesson: "Consolidate recurring inputs into one triage system. Human memory should not be the integration layer for email, calendars, school apps, sports chats, and paper flyers.",
    strongest_post_concept: "The Family Has a Chief of Staff Now.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "The CIO Is Responsible When the AI Agent Fails — Even Without the Authority to Prevent It",
    source_url: "https://www.investors.8x8.com/news-releases/news-release-details/cios-carry-blame-ai-failure-often-without-authority-prevent-it",
    source_name: "8x8 / Censuswide",
    published_at: "2026-09-08",
    category: "OVERWHELMED",
    score: 99,
    summary: "An 8x8-commissioned Censuswide survey of 2,501 CIOs and CTOs found 52% say the CIO is held accountable when an AI agent makes an error. The company argues that this responsibility often exceeds leaders’ authority over vendor behavior, audit visibility, and other controls; the figures should be read as vendor-sponsored survey findings rather than universal prevalence estimates.",
    strongest_comment: "Hank: ‘You’re responsible for the bot?’ The squirrel: ‘Yes.’ Hank: ‘Did you choose it?’ The squirrel: ‘Not necessarily.’ Hank: ‘Can you audit it?’ The squirrel: ‘We should schedule a meeting.’",
    lesson: "Accountability without matching authority is organizational overload. Assign ownership together with the visibility, controls, and decision rights needed to act on it.",
    strongest_post_concept: "All the Blame, None of the Controls.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Geologists Drilled for Copper 1,500 Feet Down and Hit a Dinosaur",
    source_url: "https://www.sci.news/paleontology/cretaceous-dinosaur-fossil-deep-drill-core-china-15048.html",
    source_name: "Sci.News",
    published_at: "2026-09-07",
    category: "RABBIT HOLES WITH A GOOD END",
    score: 100,
    summary: "Chinese geologists conducting a copper-mineral survey recovered dinosaur bone from a drill core about 473 meters underground in Inner Mongolia. The roughly 115-million-year-old ornithischian fossil is the first dinosaur record reported from the remote western Bayan Gobi Formation and expands the known regional fossil record.",
    strongest_comment: "Hank: ‘Did you find copper?’ The squirrel: ‘We found a dinosaur. Please update the project scope.’",
    lesson: "Good exploratory systems preserve anomalies outside the original objective. The unexpected signal may be more valuable than the thing the project was initially built to find.",
    strongest_post_concept: "Copper Survey, Dinosaur Deliverable.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Scientists Buried Bioplastic to See What Ate It — and Found a Pac-Man Enzyme That Also Eats Antibiotics",
    source_url: "https://www.sci.news/biology/plastic-antibiotic-degrading-soil-bacteria-enzyme-15045.html",
    source_name: "Sci.News",
    published_at: "2026-09-07",
    category: "RABBIT HOLES WITH A GOOD END",
    score: 100,
    summary: "Researchers studying forest-soil bacteria that degrade long-chain aliphatic polyester bioplastics found an enzyme with a broad, Pac-Man-like active site. In addition to breaking down the polyester, the enzyme can break down beta-lactam antibiotics including penicillin and ampicillin, eliminating their antibacterial activity and opening a second line of inquiry beyond the original plastics work.",
    strongest_comment: "Hank: ‘We were studying plastic degradation.’ The squirrel: ‘Great. The enzyme also deactivates penicillin. The rabbit hole just became medically relevant.’",
    lesson: "Follow unexpected secondary behavior. Side effects can become more important than the target result when they reveal a mechanism with consequences in an entirely different domain.",
    strongest_post_concept: "The Plastic-Eating Pac-Man Had a Second Menu.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  }
];

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return Response.json({ error: "Missing Supabase environment configuration" }, { status: 503 });

  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.rpc("ingest_hank_news_updates", {
    p_user_id: USER_ID,
    p_stories: STORIES,
  });

  if (error) {
    return Response.json({ error: error.message, details: error.details, hint: error.hint, code: error.code }, { status: 500 });
  }

  const urls = STORIES.map((story) => story.source_url);
  const { data: sources, error: sourcesError } = await supabase
    .from("sources")
    .select("id,canonical_url,title,summary,strongest_comment")
    .eq("owner_id", USER_ID)
    .in("canonical_url", urls);

  if (sourcesError) {
    return Response.json({ rpc: data, verification_error: sourcesError.message }, { status: 200 });
  }

  const sourceIds = (sources ?? []).map((source) => source.id);
  let links: Array<{ source_id: string; content_item_id: string }> = [];
  let linksError: string | null = null;
  if (sourceIds.length) {
    const result = await supabase
      .from("content_sources")
      .select("source_id,content_item_id")
      .eq("owner_id", USER_ID)
      .in("source_id", sourceIds);
    links = (result.data ?? []) as Array<{ source_id: string; content_item_id: string }>;
    linksError = result.error?.message ?? null;
  }

  const itemIds = [...new Set(links.map((link) => link.content_item_id))];
  let items: Array<Record<string, unknown>> = [];
  let itemsError: string | null = null;
  if (itemIds.length) {
    const result = await supabase
      .from("content_items")
      .select("id,identifier,title,status,content_type,panel_count,score,overview,first_comment,publishing_notes,generation_prompt")
      .eq("owner_id", USER_ID)
      .in("id", itemIds);
    items = (result.data ?? []) as Array<Record<string, unknown>>;
    itemsError = result.error?.message ?? null;
  }

  const verification = STORIES.map((story) => {
    const source = (sources ?? []).find((candidate) => candidate.canonical_url === story.source_url);
    const link = source ? links.find((candidate) => candidate.source_id === source.id) : undefined;
    const item = link ? items.find((candidate) => candidate.id === link.content_item_id) : undefined;
    return {
      source_url: story.source_url,
      title: story.title,
      source_found: Boolean(source),
      content_link_found: Boolean(link),
      item: item ?? null,
    };
  });

  return Response.json({ rpc: data, verification, verification_errors: { links: linksError, items: itemsError } });
}
