import { createClient } from "@supabase/supabase-js";

const TOKEN = "replay-aug30-9c7f4e2a61b8";
const USER_ID = "db7d5dee-c813-40b6-a966-ebfacbee862d";

const stories = [
  {
    title: "KPMG Gave Nearly 4,000 Workers AI Training. The Improvement Didn’t Stick",
    source_url: "https://arxiv.org/abs/2608.27364",
    source_name: "arXiv / KPMG field study",
    published_at: "2026-08-27",
    category: "WORKPLACE ABSURDITY",
    score: 100,
    summary: "Researchers analyzed 713,564 prompts from 3,925 KPMG back-office employees across 15 functions over eight months. AI-use sophistication did not improve with ordinary use, and formal training produced no lasting improvement after the training period.",
    strongest_comment: "Hank: ‘We trained everyone on AI.’ The squirrel: ‘Great. Did it stick?’ Hank: ‘Not for long.’",
    lesson: "A one-time training event is not behavior change. Skill improves when practice, feedback, workflow design and reinforcement continue after the class ends.",
    strongest_post_concept: "AI training has the retention curve of a New Year’s resolution: training complete, dashboard green, behavior back to baseline.",
    post_type: "multi_pane_cartoon",
    panel_count: 4,
  },
  {
    title: "Morgan & Morgan Founder Says 23 Remote Workers Quit After Cameras Went on Their Computers",
    source_url: "https://www.aol.com/articles/put-camera-billionaire-reveals-fallout-010135000.html",
    source_name: "AOL / Daily Caller",
    published_at: "2026-08-30",
    category: "WORKPLACE ABSURDITY",
    score: 98,
    summary: "Morgan & Morgan founder John Morgan said on a podcast that 23 remote employees resigned in the first week after the firm installed monitoring cameras on work computers. He also said qualifying remote workers are monitored through keystrokes and productivity scores. The resignation count is Morgan’s reported claim and has not been independently verified.",
    strongest_comment: "Hank: ‘We installed cameras to improve accountability.’ The squirrel: ‘And the first measurable output was 23 resignations.’",
    lesson: "Surveillance can create its own management cost. If the measurement system becomes the dominant issue, leaders should ask whether they are measuring outcomes or merely visibility.",
    strongest_post_concept: "The accountability dashboard works perfectly: Camera installed, keystrokes tracked, productivity scored, trust metric unavailable.",
    post_type: "multi_pane_cartoon",
    panel_count: 4,
  },
  {
    title: "Operation Care Bear: Firefighters Cut Open a Cistern So a Bear Family Could Climb Out on a Ladder",
    source_url: "https://abc7.com/post/wildlife-officials-work-free-trapped-bears-la-verne/19760944/",
    source_name: "ABC7 Los Angeles",
    published_at: "2026-08-30",
    category: "OFF-THE-WALL ANIMALS",
    score: 100,
    summary: "A mother bear and three cubs became trapped in a large water-storage tank near La Verne, California. One cub escaped on its own; after more than 12 hours, firefighters and wildlife officials widened an opening and placed a ladder so the remaining bears could climb out safely.",
    strongest_comment: "Hank: ‘Forty responders, concrete cutting, wildlife coordination… what finally solved it?’ The squirrel: ‘A ladder.’",
    lesson: "Complex incidents still often turn on one simple enabling action. Good problem-solving coordinates all the expertise needed to make the simple solution possible.",
    strongest_post_concept: "Operation Care Bear: an enormous incident-command structure culminating in the strategic deployment of one ladder.",
    post_type: "multi_pane_cartoon",
    panel_count: 4,
  },
  {
    title: "Two Newborn Puppies Needed an Urban Search-and-Rescue Airbag to Escape a Boulder",
    source_url: "https://www.aol.com/articles/firefighters-rescue-newborn-puppies-under-033909000.html",
    source_name: "AOL / FOX 5 San Diego & KUSI",
    published_at: "2026-08-29",
    category: "OFF-THE-WALL ANIMALS",
    score: 97,
    summary: "Two newborn puppies became trapped beneath a large boulder on the Campo Reservation in San Diego County. CAL FIRE crews used a lifting airbag from an Urban Search and Rescue vehicle to raise the rock and return both puppies unharmed to their mother and owner.",
    strongest_comment: "Hank: ‘The problem is a boulder.’ The squirrel: ‘Good thing the truck has a button for that.’",
    lesson: "The right specialized tool can turn an apparently enormous problem into a small, controlled movement. Capability matters more than brute force.",
    strongest_post_concept: "Tiny puppies, giant boulder, one precisely chosen rescue tool: the most visually literal version of ‘use the right tool.’",
    post_type: "multi_pane_cartoon",
    panel_count: 4,
  },
  {
    title: "Ancient Egyptian Princesses May Actually Have Used the Weapons Buried With Them",
    source_url: "https://www.sciencedaily.com/releases/2026/08/260828082348.htm",
    source_name: "ScienceDaily / Frontiers",
    published_at: "2026-08-30",
    category: "SQUIRREL DISTRACTION / WEIRD FACTS",
    score: 99,
    summary: "Researchers reexamined royal remains from Dahshur and found robust muscle attachments and other skeletal changes consistent with repeated strenuous upper-body activity, including archery or weapon use. The findings challenge the assumption that weapons in several princesses’ tombs were purely ceremonial, though bones cannot identify a specific activity with certainty.",
    strongest_comment: "Hank: ‘We assumed the weapons were symbolic.’ The squirrel: ‘The skeletons would like to update the job description.’",
    lesson: "Old interpretations can harden into facts until someone checks the evidence again. New questions can make familiar artifacts tell a different story.",
    strongest_post_concept: "Museum label: CEREMONIAL WEAPONS. Skeleton: ‘About that…’",
    post_type: "multi_pane_cartoon",
    panel_count: 4,
  },
  {
    title: "Scientists Find a Quantum Version of a Curving Ping-Pong Ball",
    source_url: "https://www.psi.ch/en/news/media-releases/a-surprising-twist-in-the-quantum-world",
    source_name: "Paul Scherrer Institute",
    published_at: "2026-08-27",
    category: "SQUIRREL DISTRACTION / WEIRD FACTS",
    score: 97,
    summary: "Researchers directly observed the optical Magnus effect for the first time using a single trapped calcium ion. In tightly focused laser light, the strongest atom-light interaction shifts slightly away from the beam center, analogous to the spin-induced curve of a ping-pong ball; the effect matters for precise qubit control.",
    strongest_comment: "Hank: ‘The strongest interaction should be in the center.’ The squirrel: ‘Quantum physics has moved the center.’",
    lesson: "What looks like the obvious center of a system may not be where the real interaction happens. Small hidden offsets can matter enormously in precision work.",
    strongest_post_concept: "Hank tries to aim a quantum laser perfectly at center while the squirrel explains that physics has curved the target sideways.",
    post_type: "multi_pane_cartoon",
    panel_count: 4,
  },
  {
    title: "Seattle Bans Phones; Students Move the Chatroom to Google Docs",
    source_url: "https://www.seattleschild.com/lessons-from-the-big-ban-launch/",
    source_name: "Seattle's Child",
    published_at: "2026-08-26",
    category: "PARENTING",
    score: 100,
    summary: "Seattle Public Schools’ new phone restrictions took phones out of K-8 school days and high-school classrooms, but students quickly found workarounds on school devices. Teachers reported students using shared Google Docs as chatrooms and finding browser games that escaped content blocks.",
    strongest_comment: "Hank: ‘We banned the phone.’ The squirrel: ‘Great. I moved the chatroom to the school-approved Google Doc.’",
    lesson: "Blocking one device does not remove the underlying incentive to distract or socialize. Focus systems have to address behavior and environment, not just one delivery mechanism.",
    strongest_post_concept: "DIGITAL WHACK-A-MOLE: Phones down, Google Docs chat up, browser games up, teacher enforcement workload up.",
    post_type: "multi_pane_cartoon",
    panel_count: 4,
  },
  {
    title: "Modern Parenting Has Become a Negotiation: Homework for Screen Time, Chores for Treats",
    source_url: "https://timesofindia.indiatimes.com/life-style/parenting/bribe-or-reward-how-gen-zalpha-parents-are-striking-deals-at-home/articleshow/133611923.cms",
    source_name: "Times of India",
    published_at: "2026-08-30",
    category: "PARENTING",
    score: 97,
    summary: "Current parenting coverage describes families increasingly using transactional deals such as homework for screen time, chores for toys, or completed tasks for treats. Experts distinguish rewards that reinforce effort from repeated bargaining that can teach children to expect a payoff for ordinary responsibilities.",
    strongest_comment: "Hank: ‘Please clean your room.’ The squirrel, playing the kid: ‘What’s the current offer?’",
    lesson: "If every routine responsibility becomes a negotiation, parents create more decisions for themselves and teach children to reopen the contract every time. Defaults reduce bargaining overhead.",
    strongest_post_concept: "A parent tries to run bedtime while the squirrel operates a tiny negotiation desk with a live exchange rate for chores, screens and snacks.",
    post_type: "multi_pane_cartoon",
    panel_count: 4,
  },
  {
    title: "New Brunswick Goes Nearly Screen-Free for the Youngest Kids",
    source_url: "https://www.gnb.ca/en/news/n-b.2026.08.government-introduces-measures-reduce-classroom-distractions.html",
    source_name: "Government of New Brunswick",
    published_at: "2026-08-28",
    category: "PARENTING",
    score: 96,
    summary: "New Brunswick is banning personal devices all day for K-8 students beginning in September and restricting social media on school networks. In licensed child care, children age two and under get no screen time; older children are capped at 30 minutes a day, with educational, educator-guided use only and none at meals.",
    strongest_comment: "Hank: ‘What’s the screen-time policy for the toddler?’ The squirrel: ‘For once, there is no negotiation. Zero.’",
    lesson: "Clear defaults can eliminate dozens of recurring micro-decisions for parents and educators. The value of a rule is partly the cognitive load it removes.",
    strongest_post_concept: "The family screen-time negotiation board disappears because the system finally supplies a default instead of another decision.",
    post_type: "multi_pane_cartoon",
    panel_count: 4,
  },
  {
    title: "AI Adoption Made Email Rise 104% and Chat Rise 145%",
    source_url: "https://hrexecutive.com/the-workforce-risk-doesnt-show-up-in-engagement-survey/",
    source_name: "HR Executive / ActivTrak Productivity Lab",
    published_at: "2026-08-26",
    category: "OVERWHELMED",
    score: 100,
    summary: "ActivTrak compared 10,584 workers for 180 days before and after AI adoption. Time increased across every measured work category: email rose 104%, chat and messaging 145%, and business-management activity 94%. The findings suggest AI is often being added to existing work rather than replacing it.",
    strongest_comment: "Hank: ‘AI was supposed to reduce the work.’ The squirrel: ‘It did reduce the time between messages.’",
    lesson: "Higher throughput is not the same as lower workload. Automation only simplifies work when something else is actually removed.",
    strongest_post_concept: "AI arrives with a SAVE TIME banner; the inbox, chat and task counters immediately double.",
    post_type: "multi_pane_cartoon",
    panel_count: 4,
  },
  {
    title: "Workers Use Seven Tools on Average — and Old Ones Often Never Get Retired",
    source_url: "https://www.howdy.com/blog/ai-tool-sprawl-statistics",
    source_name: "Howdy",
    published_at: "2026-08-24",
    category: "OVERWHELMED",
    score: 99,
    summary: "A survey of 954 knowledge workers found they regularly use seven tools on average; 52% use at least three project-management tools, 49% are required to use overlapping tools across teams, and one-quarter say old tools are never properly sunset. Respondents estimated losing 31 minutes a day to switching among tools.",
    strongest_comment: "Hank: ‘Which tool tracks the project?’ The squirrel: ‘All four. None agree.’",
    lesson: "Every new tool needs a retirement plan for the tool it replaces. Otherwise employees become the human integration layer between overlapping systems.",
    strongest_post_concept: "The project has four project-management apps and one employee whose full-time job is updating all four.",
    post_type: "multi_pane_cartoon",
    panel_count: 4,
  },
  {
    title: "AI Brain Fry: Supervising Too Many AI Tools Is Becoming Its Own Job",
    source_url: "https://www.bcg.com/publications/2026/ai-for-ceos",
    source_name: "Boston Consulting Group",
    published_at: "2026-06-23",
    category: "OVERWHELMED",
    score: 98,
    summary: "BCG surveyed 1,488 full-time U.S. workers and found 14% of AI users reported ‘AI brain fry,’ defined as mental fatigue from excessive AI use or oversight. High levels of AI oversight were associated with greater mental effort, fatigue and information overload, and users reporting excessive AI use also reported more errors and decision fatigue.",
    strongest_comment: "Hank: ‘The AI is handling the task.’ The squirrel: ‘Yes, and I’m spending my day supervising the things handling the task.’",
    lesson: "Delegation that requires continuous vigilance is not real delegation. The number of agents a person can oversee is still constrained by human attention.",
    strongest_post_concept: "One employee sits at a control desk supervising an expanding org chart of AI agents while the ‘work saved’ meter and ‘oversight required’ meter rise together.",
    post_type: "multi_pane_cartoon",
    panel_count: 4,
  },
  {
    title: "Kodak Retiree Follows a Tardigrade Hobby Into a New Species",
    source_url: "https://www.aol.com/articles/kodak-retiree-discovers-unique-tardigrade-202106000.html",
    source_name: "AOL / WROC",
    published_at: "2026-08-28",
    category: "RABBIT HOLES WITH A GOOD END",
    score: 100,
    summary: "After retiring from Kodak, Judy Dobles began studying tardigrades to document New York varieties. At the RMSC Cumming Nature Center she found more than a dozen kinds unique to New York and one previously undocumented species, later named Mesocrista ojagwaji with collaborators including the Tonawanda Seneca Nation.",
    strongest_comment: "Hank: ‘What are you doing in retirement?’ The squirrel: ‘Apparently adding a species to science.’",
    lesson: "A side interest can become genuine expertise when curiosity is paired with repeated observation, documentation and collaboration.",
    strongest_post_concept: "Retirement plan: ‘Look at tiny water bears for fun.’ Outcome: ‘Please help name the new species.’",
    post_type: "multi_pane_cartoon",
    panel_count: 4,
  },
  {
    title: "Scientist Checks iNaturalist ‘Out of Curiosity’ and Finds a New Snail",
    source_url: "https://www.inaturalist.org/pages/newsletter-2026-08",
    source_name: "iNaturalist",
    published_at: "2026-08-26",
    category: "RABBIT HOLES WITH A GOOD END",
    score: 100,
    summary: "Hungarian malacologist Barna Páll-Gergely checked iNaturalist ‘out of curiosity’ for interesting photographs of the snail family Plectopylidae. One observation stood out, leading to collaboration with a naturalist in China and a formal scientific description of a tiny species new to science.",
    strongest_comment: "Hank: ‘Were you looking for a new species?’ The squirrel: ‘No. I was just checking iNaturalist out of curiosity.’",
    lesson: "A rabbit hole pays off when the observations are structured enough to verify and share. Public data can turn casual curiosity into a scientifically useful lead.",
    strongest_post_concept: "The squirrel opens iNaturalist for ‘one quick look’; four panels later a scientific paper has a new species name on it.",
    post_type: "multi_pane_cartoon",
    panel_count: 4,
  },
  {
    title: "Century-Old Museum DNA Helps Reveal Seven New Frog Species",
    source_url: "https://www.sciencedaily.com/releases/2026/08/260828082347.htm",
    source_name: "ScienceDaily / University of Copenhagen",
    published_at: "2026-08-30",
    category: "RABBIT HOLES WITH A GOOD END",
    score: 99,
    summary: "Researchers combined DNA from living Madagascar diamond frogs with genetic material from century-old museum specimens to resolve a long-running taxonomic puzzle. The revision identified seven previously undescribed Rhombophryne species, bringing the known total to 27.",
    strongest_comment: "Hank: ‘Those specimens have been sitting in drawers for a century.’ The squirrel: ‘They were waiting for the sequel: DNA.’",
    lesson: "Old evidence is not exhausted evidence. Better tools can turn archived material into answers that were impossible when the collection was assembled.",
    strongest_post_concept: "A museum drawer labeled OLD SPECIMENS opens; modern DNA analysis turns seven frogs into seven new species cards.",
    post_type: "multi_pane_cartoon",
    panel_count: 4,
  },
] as const;

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  if (requestUrl.searchParams.get("token") !== TOKEN) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    return Response.json({ error: "Supabase server credentials unavailable" }, { status: 503 });
  }

  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.rpc("ingest_hank_news_updates", {
    p_user_id: USER_ID,
    p_stories: stories,
  });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const results = Array.isArray(data) ? data : data ? [data] : [];
  const ids = results
    .map((row: any) => row?.content_item_id)
    .filter((id: unknown): id is string => typeof id === "string" && id.length > 0);

  let verification: any[] = [];
  let sourceCounts: Record<string, number> = {};
  if (ids.length) {
    const { data: items, error: itemError } = await supabase
      .from("content_items")
      .select("id,identifier,title,status,content_type,panel_count,score")
      .in("id", ids);
    if (itemError) return Response.json({ count: stories.length, results, verification_error: itemError.message }, { status: 500 });
    verification = items ?? [];

    const { data: links, error: linkError } = await supabase
      .from("content_sources")
      .select("content_item_id")
      .in("content_item_id", ids);
    if (linkError) return Response.json({ count: stories.length, results, verification, source_verification_error: linkError.message }, { status: 500 });
    for (const link of links ?? []) {
      sourceCounts[link.content_item_id] = (sourceCounts[link.content_item_id] ?? 0) + 1;
    }
  }

  return Response.json({ count: stories.length, results, verification, sourceCounts });
}
