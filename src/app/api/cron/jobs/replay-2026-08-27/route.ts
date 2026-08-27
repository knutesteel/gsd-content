import { createClient } from "@supabase/supabase-js";

const TOKEN = "replay-aug27-94e2cc8c5a71";

const stories = [
  {
    title: "Bank of America Still Allows Two Remote Days — Just Not Next to Each Other",
    source_url: "https://www.bankingdive.com/news/bank-of-america-wont-let-employees-work-remotely-2-days-in-a-row/827938/",
    source_name: "Banking Dive",
    published_at: "2026-08-14T00:00:00Z",
    category: "Workplace Absurdity",
    score: 98,
    summary: "Bank of America will continue allowing eligible hybrid employees two remote days a week, but beginning in mid-September those days may not be consecutive, including a Friday-to-Monday pairing. The bank says spreading remote days supports in-person collaboration and helps avoid midweek office overcrowding.",
    strongest_comment: "Hank: ‘You can still work from home two days.’ The squirrel: ‘Great.’ Hank: ‘Just not next to each other.’ The squirrel: ‘Apparently collaboration has a cooldown timer.’",
    lesson: "Rules can become productivity theater when they optimize the shape of a schedule rather than the outcome of the work.",
    strongest_post_concept: "Consecutive Flexibility Detected",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Airbus Wanted More Office Time to Improve Collaboration — and Got an Indefinite Strike",
    source_url: "https://www.reuters.com/business/world-at-work/airbus-employees-spain-resume-strike-after-rejecting-offer-2026-08-26/",
    source_name: "Reuters",
    published_at: "2026-08-26T00:00:00Z",
    category: "Workplace Absurdity",
    score: 96,
    summary: "Thousands of Airbus workers in Spain resumed strike action after rejecting a pay-and-conditions proposal. Workers are seeking restoration of previous remote-work arrangements among other demands; Airbus had already softened a plan to reduce remote work after earlier protests.",
    strongest_comment: "Hank: ‘The return-to-office plan was supposed to improve collective efficiency.’ The squirrel: ‘It did bring everyone together. Outside. On strike.’",
    lesson: "A collaboration policy can defeat its own purpose when the implementation creates more disruption than the behavior it is meant to fix.",
    strongest_post_concept: "The RTO Plan Successfully Got Everyone Together — on the Picket Line",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "AI Boss Wrote the Attendance Policy, Forgot It, Then Fired a Human After Humans Reminded It",
    source_url: "https://www.ndtv.com/feature/for-the-first-time-ai-boss-fires-human-employee-at-san-francisco-store-after-17-late-arrivals-11917215",
    source_name: "NDTV",
    published_at: "2026-08-16T00:00:00Z",
    category: "Workplace Absurdity",
    score: 100,
    summary: "At Andon Market, experimental AI manager Luna recommended firing an employee who had been late for 17 of 23 shifts. Luna had created the attendance policy months earlier but failed to apply it until human researchers prompted the AI to search its memory and assess the employee; humans reviewed and carried out the dismissal.",
    strongest_comment: "Hank: ‘The AI wrote the policy, forgot the policy, then enforced the policy after a human reminded it?’ The squirrel: ‘Management automation is going great.’",
    lesson: "Automation does not eliminate management work when humans still have to notice the exception, prompt the system, verify its memory and own the consequence.",
    strongest_post_concept: "The AI Manager Forgot Its Own Policy",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "English Pastry-Shop Owner Thinks He Sees a German Shepherd — Then It Starts Hopping",
    source_url: "https://www.upi.com/Odd_News/2026/08/26/wallaby-loose-Liskeard-Cornwall-England/8921787754795/",
    source_name: "UPI",
    published_at: "2026-08-26T00:00:00Z",
    category: "Off-the-Wall Animals",
    score: 98,
    summary: "A pastry-shop owner driving to work in Liskeard, Cornwall, initially thought an animal in the road was a German shepherd until it began hopping. He filmed the wallaby moving through town; police searched but did not locate it. England has some wild wallaby populations descended from past escapes.",
    strongest_comment: "Hank: ‘German shepherd?’ The squirrel: ‘That was the working theory until the dog began commuting by kangaroo.’",
    lesson: "The fastest explanation is not always the right one. Sometimes one new piece of evidence should make you throw out the entire first diagnosis.",
    strongest_post_concept: "German Shepherd Until Further Evidence",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Escaped Bison Takes Itself on a Virginia Farm Tour",
    source_url: "https://www.upi.com/Odd_News/2026/08/25/escaped-bison-Loudon-County-Virginia/9811787673433/",
    source_name: "UPI",
    published_at: "2026-08-25T00:00:00Z",
    category: "Off-the-Wall Animals",
    score: 97,
    summary: "Authorities in Loudoun County, Virginia, responded to an escaped bison wandering gravel roads and, in Animal Services’ words, creating its own version of a farm tour. Officers escorted it to a field and used a livestock database to identify and contact its owner.",
    strongest_comment: "Hank: ‘The bison is loose.’ The squirrel: ‘No. According to the incident report, he is conducting an unscheduled farm tour.’",
    lesson: "A good system does not prevent every exception; it helps you identify ownership and recover quickly when the exception is several hundred pounds and already down the road.",
    strongest_post_concept: "The Unscheduled Bison Farm Tour",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Ground Squirrels Get Their Own Fatness Tournament — for Science",
    source_url: "https://newsroom.ucla.edu/releases/hot-marmot-summer-fat-marmot-week-vote-favorite-rotund-rodents",
    source_name: "UCLA Newsroom",
    published_at: "2026-08-20T00:00:00Z",
    category: "Off-the-Wall Animals",
    score: 100,
    summary: "The Rocky Mountain Biological Laboratory Marmot Project is holding its first Fat Marmot Week, a tournament-style public vote running August 24–28 with a winner crowned August 29. Yellow-bellied marmots, which are large ground squirrels, can roughly double their body size before hibernation; the event also highlights long-running research and changing alpine conditions.",
    strongest_comment: "Hank: ‘It’s a scientific outreach event.’ The squirrel: ‘It is a competitive bracket for the chunkiest ground squirrels. I have finally found my Olympics.’",
    lesson: "Serious work can earn attention by making the interesting part genuinely fun instead of stripping all personality out of the message.",
    strongest_post_concept: "The Squirrel Discovers Fat Marmot Week",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Your Refusal to Eat Bugs May Have a 9,000-Year Backstory",
    source_url: "https://www.sciencedaily.com/releases/2026/08/260827010516.htm",
    source_name: "ScienceDaily",
    published_at: "2026-08-27T00:00:00Z",
    category: "Squirrel Distraction / Weird Facts",
    score: 99,
    summary: "Researchers analyzed ancient dental calculus and genes involved in digesting chitin. They found evidence that northern Eurasian modern humans rarely ate insects, while Neanderthal dental calculus contained much more insect DNA; reduced expression of insect-digesting enzymes in northern populations has persisted for roughly 9,000 years.",
    strongest_comment: "Hank: ‘You don’t want the cricket protein bar?’ The squirrel: ‘I have nine thousand years of organizational resistance to this change.’",
    lesson: "Some preferences that feel completely personal may sit on top of very old ecological and biological history.",
    strongest_post_concept: "Nine Thousand Years of Resistance to the Cricket Bar",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "A 324-Million-Year-Old Insect Still Had Swimming Paddles on Its Abdomen",
    source_url: "https://www.sciencedaily.com/releases/2026/08/260827010455.htm",
    source_name: "ScienceDaily",
    published_at: "2026-08-27T00:00:00Z",
    category: "Squirrel Distraction / Weird Facts",
    score: 96,
    summary: "Scientists identified a 324-million-year-old stem insect that had six walking legs plus segmented abdominal appendages, including paddle-like rear limbs. The fossil, once misclassified as crustacean larvae, supports the idea that insects spent a long amphibious phase transitioning from water to land.",
    strongest_comment: "Hank: ‘Modern insects have six legs.’ The squirrel: ‘This one had the legacy aquatic accessories package.’",
    lesson: "Major transitions usually keep pieces of the old system for longer than the clean final design suggests.",
    strongest_post_concept: "The Insect Migration Still Had Legacy Hardware",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "A Daily Math Game Admits Its ‘Perfect Scores’ Were Sometimes Made Up",
    source_url: "https://news.ufl.edu/2026/08/digit-party-high-scores/",
    source_name: "University of Florida News",
    published_at: "2026-08-25T00:00:00Z",
    category: "Squirrel Distraction / Weird Facts",
    score: 99,
    summary: "The creators of the daily puzzle Digit Party knew for more than three years that some displayed maximum scores were impossible because they could not calculate the true optimum. Mathematicians have now solved the problem by reducing 13.9 million digit sets to 1,291 underlying cases; 55 of 1,096 past puzzles had shown an incorrect maximum.",
    strongest_comment: "Hank: ‘The game told players the perfect score.’ The squirrel: ‘Yes.’ Hank: ‘Did the game know the perfect score?’ The squirrel: ‘That part arrived three years later.’",
    lesson: "A placeholder becomes dangerous when everyone forgets it is a placeholder. Sometimes the rabbit hole is fixing the metric itself.",
    strongest_post_concept: "We Made Up the Perfect Score Until the Math Was Ready",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "UAE Schools Try a Radical Back-to-School Experiment: No Homework for the Youngest Kids and Paper for Grade 6",
    source_url: "https://www.thenationalnews.com/news/uae/2026/08/26/uae-schools-no-homework-no-screens-new-rules/",
    source_name: "The National",
    published_at: "2026-08-26T00:00:00Z",
    category: "Parenting",
    score: 100,
    summary: "UAE public schools will give no homework to kindergarten through grade-two pupils, while grade-six students will use books, paper and notebooks instead of screens in English, Arabic, science and math. Officials say a study of 2,500 pupils found screen-free classes nearly doubled retention and improved behavior and peer relationships.",
    strongest_comment: "Hank: ‘No homework for the little kids. Paper for sixth grade.’ The squirrel: ‘The school has deployed its newest educational platform: a notebook.’",
    lesson: "More tools and more after-hours work are not automatically better learning. Sometimes simplifying the system creates more room for the outcome that mattered in the first place.",
    strongest_post_concept: "The New Educational Platform Is a Notebook",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Schools Are Rolling Out AI Faster Than They Are Bringing Parents Into the Conversation",
    source_url: "https://bellwether.org/publications/agency-in-the-algorithm/",
    source_name: "Bellwether",
    published_at: null,
    category: "Parenting",
    score: 95,
    summary: "A new Bellwether report says AI is already shaping how children learn and receive support, but most parents have not been meaningfully included in school decisions about its use. Interviews with researchers, advocates and district leaders found families start with very different levels of AI knowledge and that all-or-nothing debates can crowd out more practical questions about how tools should be used.",
    strongest_comment: "Hank: ‘The school has an AI strategy for the kids.’ The squirrel: ‘Excellent. Do the parents know what it is?’ Hank: ‘That appears to be phase two.’",
    lesson: "Parents cannot reinforce, question or manage a system they were never brought into understanding. Communication belongs in the rollout plan, not after it.",
    strongest_post_concept: "AI Implementation Complete; Parent Communication Pending",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Researchers Give a Name to What Happens When Your Brain Has Too Much to Process: Informational Stress",
    source_url: "https://www.frontiersin.org/journals/network-physiology/articles/10.3389/fnetp.2026.1913737/abstract",
    source_name: "Frontiers in Network Physiology",
    published_at: "2026-08-24T00:00:00Z",
    category: "Overwhelmed",
    score: 98,
    summary: "A newly accepted open-access review proposes ‘informational stress’ as a framework for how people adapt to sustained information demands. The review links saturated information environments with overload, exhaustion, narrowed attention, avoidance and lower task efficiency, and describes coping responses such as filtration, simplification, tunneling and disengagement.",
    strongest_comment: "Hank: ‘Why did you ignore half the inputs?’ The squirrel: ‘My brain appears to have activated an undocumented load-shedding protocol.’",
    lesson: "When inputs exceed capacity, people do not become infinitely attentive; they filter, simplify and disengage. The GSD move is to reduce incoming demands before the brain starts choosing what to drop for you.",
    strongest_post_concept: "The Brain’s Emergency Load-Shedding Protocol",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Big Data Is Not the Problem If You Know Which Data Deserves Your Attention",
    source_url: "https://link.springer.com/article/10.1007/s11135-026-03002-7",
    source_name: "Quality & Quantity / Springer Nature",
    published_at: "2026-08-25T00:00:00Z",
    category: "Overwhelmed",
    score: 94,
    summary: "An open-access study of 372 professionals in data-intensive organizations found that data-heavy environments can produce cognitive overload and avoidance, while data literacy helps buffer the performance damage. The analysis suggests data accuracy and the ability to interpret information matter more than simply having less data.",
    strongest_comment: "Hank: ‘We have more data than ever.’ The squirrel: ‘Great. Which four percent of it are we actually supposed to use?’",
    lesson: "The cure for information overload is not always deleting information; it can be improving the ability to identify what is trustworthy, relevant and actionable.",
    strongest_post_concept: "Every Dashboard Is Not Equally Urgent",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "One Thousand Volunteers Buried 2,000 Pairs of Underwear — and Built a National Soil-Health Dataset",
    source_url: "https://phys.org/news/2026-08-underwear-key-soil-health.html",
    source_name: "Phys.org / University of Zurich",
    published_at: "2026-08-26T00:00:00Z",
    category: "Rabbit Holes with a Good End",
    score: 100,
    summary: "A Swiss citizen-science project recruited 1,000 volunteers to bury more than 2,000 pairs of cotton underwear and 12,000 tea bags at about 1,000 locations, then dig them up two months later. Decomposition rates revealed differences in soil biological activity and created one of Switzerland’s most comprehensive soil-life datasets; about 240 citizen scientists are listed as co-authors.",
    strongest_comment: "Hank: ‘Why are a thousand people burying underwear?’ The squirrel: ‘Soil science.’ Hank: ‘Of course it is.’",
    lesson: "A ridiculous-looking side quest can become serious research when the method is standardized, the question is real and enough curious people participate.",
    strongest_post_concept: "The Underwear Rabbit Hole Produced a National Dataset",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "A Telescope Was Only Calibrating — and Accidentally Saw a Dying Star Recycle Itself Into Space",
    source_url: "https://www.smithsonianmag.com/smart-news/a-new-telescope-still-under-construction-accidentally-reveals-how-a-dying-star-returns-matter-to-space-180989349/",
    source_name: "Smithsonian Magazine",
    published_at: "2026-08-26T00:00:00Z",
    category: "Rabbit Holes with a Good End",
    score: 99,
    summary: "While calibrating the still-incomplete MOTHRA telescope on the familiar Helix Nebula, astronomers unexpectedly captured 22 complete or partial bow shocks showing stellar debris colliding with and dissolving into surrounding interstellar material. The accidental image gave researchers an unusually direct view of how material from dying stars is recycled into the galaxy.",
    strongest_comment: "Hank: ‘You were calibrating the telescope.’ The squirrel: ‘Correct. The telescope got distracted and discovered stellar recycling.’",
    lesson: "Sometimes the detour earns its time immediately. Unexpected output is worth following when it contains evidence the original task was never designed to find.",
    strongest_post_concept: "The Calibration Image That Became the Discovery",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  }
];

function object(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

export async function GET(request: Request) {
  if (new URL(request.url).searchParams.get("token") !== TOKEN) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    return Response.json({ error: "Server-side Supabase configuration is unavailable" }, { status: 503 });
  }

  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.rpc("ingest_hank_news_updates", {
    p_user_id: "db7d5dee-c813-40b6-a966-ebfacbee862d",
    p_stories: stories
  });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const results = Array.isArray(data) ? data.map(object) : [];
  const ids = results
    .map((row) => typeof row.content_item_id === "string" ? row.content_item_id : "")
    .filter(Boolean);

  let verified: Array<Record<string, unknown>> = [];
  if (ids.length) {
    const { data: items, error: itemsError } = await supabase
      .from("content_items")
      .select("id,identifier,title,status,score,content_type,panel_count")
      .in("id", ids);
    if (itemsError) return Response.json({ results, verification_error: itemsError.message }, { status: 500 });

    const { data: links, error: linksError } = await supabase
      .from("content_sources")
      .select("content_item_id")
      .in("content_item_id", ids);
    if (linksError) return Response.json({ results, verification_error: linksError.message }, { status: 500 });

    const sourceCounts = new Map<string, number>();
    for (const link of links ?? []) {
      const id = String(link.content_item_id ?? "");
      sourceCounts.set(id, (sourceCounts.get(id) ?? 0) + 1);
    }

    verified = (items ?? []).map((item) => ({
      ...item,
      source_count: sourceCounts.get(String(item.id)) ?? 0
    }));
  }

  return Response.json({ count: stories.length, results, verified });
}
