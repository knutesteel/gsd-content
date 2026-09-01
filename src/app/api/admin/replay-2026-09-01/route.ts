import { createClient } from "@supabase/supabase-js";

const TOKEN = "replay-sep01-8c41f03d7a2e";
const USER_ID = "db7d5dee-c813-40b6-a966-ebfacbee862d";

const stories = [
  {
    title: "Claims Adjusters Are Nearly United on One Thing: They Hate Their Companies’ AI",
    source_url: "https://www.glassdoor.com/blog/how-workers-feel-about-ai-2026/",
    source_name: "Glassdoor",
    published_at: "2026-08-27",
    category: "WORKPLACE ABSURDITY",
    score: 99,
    summary: "Glassdoor’s 2026 review analysis found insurance claims adjusters were the most AI-critical role it tracked, with complaints centered on leaders forcing error-prone AI into claims work and creating cleanup for employees and clients.",
    strongest_comment: "Hank: ‘We bought AI to help claims adjusters.’ The squirrel: ‘Excellent. Why are the adjusters spending their day fixing what it did?’",
    lesson: "Automation is not a productivity gain when errors are merely transferred to the frontline people who must verify, repair, and explain them.",
    strongest_post_concept: false,
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Axios Says Its Productivity Breakthrough Was Deleting Work Instead of Adding More Tools",
    source_url: "https://www.axios.com/2026/09/01/simplify-book-axios-jim-vandehei-ceos",
    source_name: "Axios",
    published_at: "2026-09-01",
    category: "WORKPLACE ABSURDITY",
    score: 98,
    summary: "Axios says a three-year internal simplification push built around confronting bloat, deleting redundant work, and amplifying priorities helped raise revenue per employee by 75%, an unusually literal counterpoint to the normal corporate instinct to solve complexity by adding another process.",
    strongest_comment: "Hank: ‘How did you improve productivity?’ The squirrel: ‘We deleted work.’ Hank: ‘Are companies allowed to do that?’",
    lesson: "Before adding a tool, meeting, dashboard, or workflow, ask what can disappear. Simplification only works when subtraction is an explicit management action.",
    strongest_post_concept: false,
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Shop Owner Blames a Ghost Until CCTV Reveals a Ninja Hedgehog",
    source_url: "https://www.yahoo.com/news/videos/ghost-caught-camera-turns-ninja-070454087.html",
    source_name: "Yahoo News / SWNS",
    published_at: "2026-09-01",
    category: "OFF-THE-WALL ANIMALS",
    score: 100,
    summary: "A shop owner in Swanage, England, thought a ghost might be knocking over items at night until CCTV revealed the culprit was a young hedgehog climbing and tumbling through the displays. The dehydrated animal was rescued, treated, and later released.",
    strongest_comment: "Hank: ‘We may have a ghost.’ The squirrel: ‘No. We have a hedgehog doing unauthorized overnight visual merchandising.’",
    lesson: "When the evidence is weird, verify the evidence before inventing an elaborate explanation. The simplest answer can still be wonderfully strange.",
    strongest_post_concept: false,
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Three Giant Rodents Escape a Zoo; One Makes It to a Neighbor’s Garden",
    source_url: "https://www.upi.com/Odd_News/2026/08/31/netherlands-Paragonian-maras-escape-Avifauna/6041788190903/",
    source_name: "UPI",
    published_at: "2026-08-31",
    category: "OFF-THE-WALL ANIMALS",
    score: 98,
    summary: "Three Patagonian maras escaped a temporary holding area at a Netherlands zoo while awaiting transfer. Police helped search; one was found on zoo grounds, one in a nearby home garden, and the third back inside the zoo the next morning. The zoo said human error likely left the enclosure unsecured.",
    strongest_comment: "Hank: ‘Three escapees?’ The squirrel: ‘One reached a residential garden. One apparently escaped into the zoo.’",
    lesson: "The best recovery plan cannot compensate for a basic control that was never closed. Small process failures can create surprisingly large scavenger hunts.",
    strongest_post_concept: false,
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "British Columbia Confirmed a 105,000-Square-Foot Island — Then Lost It",
    source_url: "https://www.upi.com/Odd_News/2026/08/31/canda-Hydro-floating-island-Williston-Reservoir/1031788196078/",
    source_name: "UPI",
    published_at: "2026-08-31",
    category: "SQUIRREL DISTRACTION / WEIRD FACTS",
    score: 100,
    summary: "A tree-covered floating island estimated at about 105,000 square feet appeared in British Columbia’s Williston Reservoir, was confirmed in July satellite imagery, and had vanished from the imagery by August 5. Officials think a mass of driftwood and vegetation broke loose as water levels rose and may have drifted elsewhere.",
    strongest_comment: "Hank: ‘We confirmed the island existed.’ The squirrel: ‘Great. Where is it?’ Hank: ‘That is the current action item.’",
    lesson: "A confident first conclusion should remain updateable when the thing you are measuring can literally move. Also: ‘we lost an island’ is a legitimate rabbit hole.",
    strongest_post_concept: false,
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "A Giant Plume of Hot Rock Deep Under Africa May Be Helping Pull the Continent Apart",
    source_url: "https://www.sciencedaily.com/releases/2026/08/260831015210.htm",
    source_name: "ScienceDaily / Virginia Tech",
    published_at: "2026-09-01",
    category: "SQUIRREL DISTRACTION / WEIRD FACTS",
    score: 99,
    summary: "Virginia Tech-led modeling points to the African Superplume, a huge upwelling of hot mantle material, as a contributor to unusual deformation beneath the East African Rift, helping explain how deep-mantle and shallower forces are reshaping the continent together.",
    strongest_comment: "Hank: ‘You were supposed to check one geology fact.’ The squirrel: ‘Africa has a giant plume underneath it and the continent is pulling apart. The original task has been deprioritized.’",
    lesson: "Some rabbit holes are irresistible because one concrete observation connects a local mystery to a system operating on continental scale.",
    strongest_post_concept: false,
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Parents Are Reading With Preschoolers Less Than Before the Pandemic — and Physical Books Still Matter",
    source_url: "https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2853467",
    source_name: "JAMA Network Open",
    published_at: "2026-09-01",
    category: "PARENTING",
    score: 99,
    summary: "A nationally representative survey study found parent-child shared book reading fell after the pandemic and had not returned to prepandemic levels by 2024. Each additional 10 physical books in the home was associated with 8% higher odds of frequent shared reading, while ebook access was not significantly associated.",
    strongest_comment: "Hank: ‘We have hundreds of books available on the tablet.’ The squirrel: ‘Apparently the stack of actual books on the floor is still doing some work.’",
    lesson: "The most convenient format is not always the one that best supports the routine. Make the desired behavior visible, easy, and physically available.",
    strongest_post_concept: false,
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Kids’ Bedtime Is Competing With Video Games, Social Media, Homework, Friends, Sports, and Jobs",
    source_url: "https://www.globenewswire.com/news-release/2026/08/31/3353444/0/en/healthy-sleep-sets-the-stage-for-student-success.html",
    source_name: "American Academy of Sleep Medicine / GlobeNewswire",
    published_at: "2026-08-31",
    category: "PARENTING",
    score: 98,
    summary: "An American Academy of Sleep Medicine parent survey found video games and social media were the most commonly reported activities harming school-age sleep, followed by homework, friends, clubs or sports, and after-school jobs — a useful picture of how many legitimate and non-legitimate demands compete for the same evening hours.",
    strongest_comment: "Hank: ‘Bedtime is at ten.’ The squirrel: ‘Before or after gaming, homework, soccer, friends, scrolling, and the part-time job?’",
    lesson: "A bedtime problem is often a priority-stack problem. Protecting sleep means deciding what loses when the evening has more commitments than hours.",
    strongest_post_concept: false,
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "French High Schools Discover That Banning Phones Is Easy Until the Phone Runs the Timetable and Cafeteria",
    source_url: "https://www.theguardian.com/world/2026/aug/31/french-high-schools-phone-ban-macron",
    source_name: "The Guardian",
    published_at: "2026-08-31",
    category: "PARENTING",
    score: 97,
    summary: "French high schools are racing to implement a new phone ban for students ages 15 to 18 while confronting practical dependencies: schools must revise internal rules, and many students already use smartphones for functions such as timetables and cafeteria access. Education unions say the logistics and consultation cannot be skipped.",
    strongest_comment: "Hank: ‘Phones are banned.’ The squirrel: ‘Great. Where is my timetable?’ Hank: ‘On your phone.’",
    lesson: "A rule is not an implementation plan. Before removing a tool, identify every ordinary process that quietly became dependent on it.",
    strongest_post_concept: false,
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Workers Spend About 20 Workdays a Year Troubleshooting AI That Was Supposed to Save Time",
    source_url: "https://www.bamboohr.com/about-bamboohr/press-release/bamboohr-research-redesigning-work-ai-performance-review",
    source_name: "BambooHR",
    published_at: "2026-09-01",
    category: "OVERWHELMED",
    score: 100,
    summary: "BambooHR surveyed more than 1,600 U.S. salaried desk workers and found they spend an average 87 minutes a day with AI. About 42% of that AI time goes to troubleshooting errors and iterating prompts versus 35% to productive work, equivalent to roughly 20 workdays a year spent getting AI to work correctly.",
    strongest_comment: "Hank: ‘AI is saving us time.’ The squirrel: ‘Absolutely. I only spend twenty workdays a year convincing it to do that.’",
    lesson: "A productivity tool should be measured net of correction, prompting, verification, and recovery time. Otherwise the organization measures the promise while employees absorb the friction.",
    strongest_post_concept: true,
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Teachers Use AI More, Finish Tasks Faster — and Still Work the Same Hours",
    source_url: "https://tech.yahoo.com/ai/articles/teachers-getting-more-comfortable-using-060000136.html",
    source_name: "TechRadar via Yahoo",
    published_at: "2026-08-31",
    category: "OVERWHELMED",
    score: 99,
    summary: "New YouGov data reported by TechRadar says about 80% of teachers now use AI, but only 35% report working fewer hours while 55% work the same amount. Time saved on individual tasks is often redirected into other work rather than reducing total workload.",
    strongest_comment: "Hank: ‘The AI made that task faster.’ The squirrel: ‘Perfect. I found three more tasks for the time we saved.’",
    lesson: "Efficiency does not automatically create capacity. Unless leaders decide what will stop, faster work simply creates room for more work.",
    strongest_post_concept: false,
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Parents Spend Nearly 300 Hours a School Year Just Managing the School Routine",
    source_url: "https://wnbf.com/ixp/498/p/school-routines-cost-families/",
    source_name: "WNBF / K12 survey",
    published_at: "2026-08-31",
    category: "OVERWHELMED",
    score: 98,
    summary: "A K12 survey of 1,000 parents estimates families spend nearly 300 hours per school year on school-related logistics such as getting children ready, transportation, and daily school needs. Nearly two-thirds reported losing sleep because of the schedule, and 43% said their children also lose sleep.",
    strongest_comment: "Hank: ‘School is six hours a day.’ The squirrel: ‘Correct. Family operations begins several hundred hours before and after that.’",
    lesson: "Life admin becomes overwhelming when hundreds of small recurring tasks remain individually invisible. Simplification starts by treating the routine as a system, not a series of emergencies.",
    strongest_post_concept: false,
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "One Weird Fuzzy Fish Photo Started a 23-Year Hunt and Ended With Mr. Snuffleupagus",
    source_url: "https://www.smithsonianmag.com/smart-news/meet-the-newly-discovered-fuzzy-fish-species-named-after-mr-snuffleupagus-from-sesame-street-180988774/",
    source_name: "Smithsonian Magazine",
    published_at: "2026-08-31",
    category: "RABBIT HOLES WITH A GOOD END",
    score: 100,
    summary: "Marine biologist David Harasti photographed an unfamiliar red fuzzy fish in Papua New Guinea in 2003, triggering a yearslong search. Researchers eventually collected enough evidence, including CT scans and DNA, to confirm a new ghost pipefish species, Solenostomus snuffleupagus, named for the Sesame Street character.",
    strongest_comment: "Hank: ‘You have been chasing one fuzzy fish since 2003?’ The squirrel: ‘Correct. It now has a scientific name and a Sesame Street reference.’",
    lesson: "A rabbit hole earns its keep when curiosity becomes disciplined persistence: notice the anomaly, document it, keep looking, and eventually test the answer.",
    strongest_post_concept: false,
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Scientists Saw a Weird Fish on TikTok, Pumped 2,500 Liters From a Borewell, and Found a New Genus",
    source_url: "https://www.the-independent.com/news/science/tiktok-species-discovery-translucent-eel-b3034761.html",
    source_name: "The Independent",
    published_at: "2026-08-18",
    category: "RABBIT HOLES WITH A GOOD END",
    score: 100,
    summary: "Researchers spotted a tiny translucent fish emerging from a borewell in a 2024 TikTok video near the India-Nepal border. They tracked down the location, manually pumped roughly 2,500 liters of groundwater to obtain intact material, and used genetics and micro-CT imaging to confirm Gangaichthys indonepalicus, a new genus and species and the first known subterranean fish from the Gangetic Basin.",
    strongest_comment: "Hank: ‘You watched a TikTok and then pumped 2,500 liters of groundwater?’ The squirrel: ‘Yes. New genus.’",
    lesson: "The squirrel should win when a random clue is specific enough to test. Productive curiosity turns ‘that is weird’ into a location, a method, and evidence.",
    strongest_post_concept: false,
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Man Hunting Vintage Motorcycle Parts in a Scrapyard Finds a 1,800-Year-Old Warrior’s Shield",
    source_url: "https://www.heritagedaily.com/2026/08/2nd-century-warriors-shield-boss-discovered-in-polish-scrap-yard/159034",
    source_name: "HeritageDaily",
    published_at: "2026-08-23",
    category: "RABBIT HOLES WITH A GOOD END",
    score: 100,
    summary: "Włodzimierz Starykiewicz was searching a Polish scrapyard for vintage car or motorcycle parts when he noticed a badly corroded iron object and sent a photo to a museum. It proved to be a second-century shield boss. Because he wisely left the compacted soil inside untouched, specialists also recovered cremated human bone that linked it to a lost warrior burial.",
    strongest_comment: "Hank: ‘Did you find the motorcycle part?’ The squirrel: ‘No. I found an 1,800-year-old warrior burial clue and, importantly, did not clean it.’",
    lesson: "A good rabbit hole includes restraint. He noticed the odd thing, escalated it to experts, and preserved the context instead of ‘fixing’ the evidence himself.",
    strongest_post_concept: false,
    post_type: "multi_pane_cartoon",
    panel_count: 4
  }
];

function normalizeResults(data: unknown) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray((data as { results?: unknown[] }).results)) return (data as { results: unknown[] }).results;
  return data == null ? [] : [data];
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (token !== TOKEN) return Response.json({ error: "Forbidden" }, { status: 403 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return Response.json({ error: "Server-side Supabase credentials are not configured" }, { status: 503 });

  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.rpc("ingest_hank_news_updates", { p_user_id: USER_ID, p_stories: stories });
  if (error) return Response.json({ error: error.message, code: error.code, details: error.details, hint: error.hint }, { status: 500 });

  const results = normalizeResults(data) as Array<Record<string, unknown>>;
  const ids = results.map((row) => String(row.content_item_id ?? row.id ?? "")).filter(Boolean);
  let verification: Array<Record<string, unknown>> = [];

  if (ids.length) {
    const { data: items, error: itemsError } = await supabase
      .from("content_items")
      .select("id,identifier,title,status,content_type,panel_count,score")
      .in("id", ids);
    if (itemsError) return Response.json({ results, verification_error: itemsError.message }, { status: 500 });

    const { data: links, error: linksError } = await supabase
      .from("content_sources")
      .select("content_item_id")
      .in("content_item_id", ids);
    if (linksError) return Response.json({ results, verification_error: linksError.message }, { status: 500 });

    const counts = new Map<string, number>();
    for (const link of links ?? []) counts.set(link.content_item_id, (counts.get(link.content_item_id) ?? 0) + 1);
    verification = (items ?? []).map((item) => ({ ...item, source_count: counts.get(item.id) ?? 0 }));
  }

  return Response.json({ story_count: stories.length, result_count: results.length, results, verification });
}
