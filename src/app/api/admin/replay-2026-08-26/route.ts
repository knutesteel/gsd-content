import { createClient } from "@supabase/supabase-js";

const TOKEN = "replay-aug26-7f4c1b2a9e6d";

const stories = [
  {
    title: "Meta Tried to Cut Teams by Up to 60% With AI — Then the Productivity Plan Imploded",
    source_url: "https://www.reuters.com/investigations/mark-zuckerberg-had-bold-plan-replace-meta-staff-with-ai-heres-how-it-imploded-2026-08-26/",
    source_name: "Reuters",
    published_at: "2026-08-26T10:00:00Z",
    category: "Workplace Absurdity",
    score: 100,
    summary: "Meta's Project OT envisioned autonomous AI agents handling routine work, teams shrinking by as much as 60%, and smaller AI-augmented pods. Internal resistance, technical disruptions and weak productivity gains followed; Meta carried out an initial layoff wave but abandoned the planned second wave and shifted its public emphasis toward AI empowering workers.",
    strongest_comment: "Hank: ‘We reduced the team because AI was going to make everyone more productive.’ The squirrel: ‘And then the AI needed the people we reduced?’",
    lesson: "Headcount reduction is not the same thing as productivity transformation. Automating the organization before the automation reliably works can destroy the human capacity needed to make the technology useful.",
    strongest_post_concept: "We Cut the Team Because AI Would Make the Team More Productive",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Performance Dashboards Make Employees Stop Doing the Important Work the Dashboard Can’t See",
    source_url: "https://phys.org/news/2026-08-employee-pitfalls-hr.html",
    source_name: "Phys.org / University of Queensland",
    published_at: "2026-08-25T00:00:00Z",
    category: "Workplace Absurdity",
    score: 99,
    summary: "University of Queensland researchers found that more intensive performance measurement was associated with employees deprioritizing untracked work such as mentoring, helping colleagues and flagging risks, alongside lower engagement and greater intention to quit.",
    strongest_comment: "Hank: ‘Mentoring isn’t on the dashboard.’ The squirrel: ‘Excellent. We have successfully optimized away helping people.’",
    lesson: "People respond rationally to what management says counts. The blind spots in a productivity dashboard may be more important than the numbers it contains.",
    strongest_post_concept: "The Dashboard Can’t See the Work That Matters",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Bear Walks Into a Fire Station and Steals the Firefighters’ Gear",
    source_url: "https://www.upi.com/Odd_News/2026/08/25/Colorado-Springs-Fire-Department-bear-gear-bag/2751787675712/",
    source_name: "UPI",
    published_at: "2026-08-25T12:37:00Z",
    category: "Off-the-Wall Animals",
    score: 100,
    summary: "A black bear walked into an open bay at Colorado Springs Fire Station 16, grabbed a firefighter gear bag and casually left with it.",
    strongest_comment: "Hank: ‘The bear stole the emergency-response equipment.’ The squirrel: ‘Wildlife management has entered self-service.’",
    lesson: "Some incidents escalate faster than the response plan because the incident itself has taken the response plan.",
    strongest_post_concept: "The Incident Stole the Response Plan",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Coyote Picks a Fight With a Bear — and the Bear Backs Down",
    source_url: "https://www.upi.com/Odd_News/2026/08/25/coyote-bear-Los-Angeles-Tarzana/6791787680066/",
    source_name: "UPI",
    published_at: "2026-08-25T13:50:00Z",
    category: "Off-the-Wall Animals",
    score: 98,
    summary: "A Los Angeles home-security camera captured a coyote repeatedly advancing on a bear until the much larger animal retreated. A smaller coyote stood nearby, and the homeowner suspected the larger coyote was protecting it.",
    strongest_comment: "Hank: ‘That bear is several times your size.’ The squirrel: ‘Apparently nobody updated the coyote’s org chart.’",
    lesson: "Size and authority do not automatically determine who controls a situation. Clear priorities plus persistence can make the smaller player surprisingly effective.",
    strongest_post_concept: "The Coyote Didn’t Read the Org Chart",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "17th-Century Risk Management Included a Sickle Over Your Neck and a Padlock on Your Toe",
    source_url: "https://phys.org/news/2026-08-archaeologists-young-woman-17th-century.html",
    source_name: "Phys.org",
    published_at: "2026-08-25T00:00:00Z",
    category: "Squirrel Distraction / Weird Facts",
    score: 100,
    summary: "Researchers reconstructed the story of a wealthy 17-to-19-year-old woman buried in Poland with a curved iron sickle positioned across her neck and a padlock attached to her toe. Evidence indicates the grave was reopened and the implements added as anti-demonic measures.",
    strongest_comment: "Hank: ‘They had a contingency plan in case she came back from the dead.’ The squirrel: ‘And apparently Legal insisted on both physical controls.’",
    lesson: "Uncertainty plus fear can produce spectacularly elaborate safeguards even when nobody has evidence that the underlying threat exists.",
    strongest_post_concept: "17th-Century Risk Management",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Your Brain May Not Actually Have Anyone in Charge of Making Decisions",
    source_url: "https://www.sciencedaily.com/releases/2026/08/260823094148.htm",
    source_name: "ScienceDaily / Indiana University",
    published_at: "2026-08-25T00:00:00Z",
    category: "Squirrel Distraction / Weird Facts",
    score: 97,
    summary: "Indiana University neuroscientist Thomas James argues there may be no distinct central neural process that makes decisions. What we describe as choosing may emerge from interacting sensory, motor, bodily and environmental processes rather than a single executive controller.",
    strongest_comment: "Hank: ‘So who actually makes the decision?’ The squirrel: ‘Apparently this organization has been matrixed all the way down.’",
    lesson: "Complex systems can produce coordinated outcomes without one central controller. That is either fascinating neuroscience or the explanation for several companies.",
    strongest_post_concept: "The Brain Has No Executive Committee",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Screen Time at Age 1 and Age 6 May Matter More Than the Years in Between",
    source_url: "https://sciencedaily.com/releases/2026/08/260823094152.htm",
    source_name: "ScienceDaily",
    published_at: "2026-08-24T00:00:00Z",
    category: "Parenting",
    score: 98,
    summary: "A longitudinal study following 502 children found heavier screen viewing at certain developmental stages, especially age 1 and around age 6, was associated with poorer later academic performance and weaker working memory. The study shows associations, not proof of causation.",
    strongest_comment: "Hank: ‘So the rule isn’t simply screens bad?’ The squirrel: ‘Correct. Parenting guidance has released developmental timing windows.’",
    lesson: "Simple universal rules feel easier, but context and timing frequently matter. Parenting is frustrating partly because the answer is so often ‘it depends.’",
    strongest_post_concept: "Parenting Advice Gets Another Patch Note",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Ten Years of Data Say Normal Social-Media Use Didn’t Damage Family Relationships",
    source_url: "https://phys.org/news/2026-08-heavy-social-media-family-relationship.html",
    source_name: "Phys.org / Norwegian University of Science and Technology",
    published_at: "2026-08-25T00:00:00Z",
    category: "Parenting",
    score: 99,
    summary: "Researchers followed nearly 1,000 young people from ages 10 to 20 and found no evidence that normal variations in parents' or adolescents' social-media use predicted poorer family relationships, weaker attachment or worse family functioning over time.",
    strongest_comment: "Hank: ‘Hours on social media didn’t automatically weaken the family?’ The squirrel: ‘Apparently how much and interrupting dinner every 45 seconds are different questions.’",
    lesson: "Measure the behavior that actually causes the problem rather than whichever number is easiest to track.",
    strongest_post_concept: "The Wrong Screen-Time Metric",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Back-to-School Requires Migrating an Entire Family to a New Time Zone Without Going Anywhere",
    source_url: "https://apnews.com/article/4e0923586dc98bfc38d0a82b31c07cf7",
    source_name: "Associated Press",
    published_at: "2026-08-25T06:03:00Z",
    category: "Parenting",
    score: 95,
    summary: "Sleep specialists recommend moving children's bedtimes gradually, about 15 to 30 minutes earlier each night, rather than trying to flip directly from summer hours to school hours. They also suggest test runs of stressful morning activities and reducing screens before bedtime.",
    strongest_comment: "Hank: ‘School starts Monday. Tonight everybody goes to bed two hours earlier.’ The squirrel: ‘I see we have chosen the zero-change-management migration strategy.’",
    lesson: "Gradual transitions usually beat heroic overnight resets. Routines work partly because they remove repeated decisions from already-chaotic mornings.",
    strongest_post_concept: "The Family Time-Zone Migration",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "One Work Message After Dinner Isn’t One Message When Everyone Is Always Reachable",
    source_url: "https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2026.1939418/full",
    source_name: "Frontiers in Public Health",
    published_at: "2026-08-21T00:00:00Z",
    category: "Overwhelmed",
    score: 99,
    summary: "An open-access analysis of 56,640 wage workers found after-hours work-related technology use was associated with greater work-to-family interference and exhaustion. The cross-sectional design does not establish causation.",
    strongest_comment: "Hank: ‘It was only one email after dinner.’ The squirrel: ‘Correct. Plus one Slack, three Teams messages, two texts and the email asking whether you saw the first email.’",
    lesson: "Overwhelm often comes from repeated role-switching rather than any one enormous task. Recovery requires a boundary somewhere.",
    strongest_post_concept: "It Was Only One Message",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "AI Can Burn You Out With Information You Never Asked It to Show You",
    source_url: "https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2026.1897395/abstract",
    source_name: "Frontiers in Psychology",
    published_at: "2026-08-25T00:00:00Z",
    category: "Overwhelmed",
    score: 97,
    summary: "A cross-sectional study of 566 university students found more frequent AI information encounters were correlated with higher digital burnout and lower cognitive flexibility.",
    strongest_comment: "Hank: ‘Did you search for all this AI content?’ The squirrel: ‘No. The AI proactively found things for me to be overwhelmed by.’",
    lesson: "Inputs you did not request still consume cognitive capacity. Modern information management increasingly means deciding what never deserves to enter your attention in the first place.",
    strongest_post_concept: "Proactive Overwhelm",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Short Videos Designed to Require Almost No Attention May Be Eating the Attention Needed for Everything Else",
    source_url: "https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2026.1910124/full",
    source_name: "Frontiers in Psychology",
    published_at: "2026-08-20T00:00:00Z",
    category: "Overwhelmed",
    score: 98,
    summary: "A cross-sectional study of 500 Chinese undergraduates found problematic short-form video use was associated with perceived attentional decline and English-learning burnout, with both perceived attention problems and emotional enhancement statistically mediating part of the relationship.",
    strongest_comment: "Hank: ‘You said you were taking a five-minute break.’ The squirrel: ‘I was. Twenty-seven videos ago.’",
    lesson: "Tiny distractions can become large cognitive expenses through repetition. The problem is rarely the individual 30-second video; it is losing control of the stopping point.",
    strongest_post_concept: "Twenty-Seven Videos Ago",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Fifty Scraps Sitting in a Museum Since 1911 Turn Out to Be a Lost Roman Tax-Law Book",
    source_url: "https://archaeologymag.com/2026/08/1600-year-old-roman-law-book-fragment/",
    source_name: "Archaeology News",
    published_at: "2026-08-26T00:00:00Z",
    category: "Rabbit Holes with a Good End",
    score: 100,
    summary: "University of Cincinnati classics professor Matthijs Wibier worked with the Penn Museum to piece together 50 animal-skin fragments that had been in the collection since 1911, reconstructing and translating a double-sided fourth-century Roman legal page unlike any known surviving code.",
    strongest_comment: "Hank: ‘Those scraps have been sitting there for 115 years.’ The squirrel: ‘They weren’t scraps. They were a 1,600-year-old compliance manual.’",
    lesson: "Patiently following tiny, boring clues turned apparent debris into a first-of-its-kind historical document. This is exactly when the squirrel should win.",
    strongest_post_concept: "The 1,600-Year-Old Compliance Manual",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Researchers Read the Footnotes and Found Three Kings the Official History Deleted",
    source_url: "https://www.sciencedaily.com/releases/2026/08/260824065549.htm",
    source_name: "ScienceDaily / University of Chicago Press Journals",
    published_at: "2026-08-25T00:00:00Z",
    category: "Rabbit Holes with a Good End",
    score: 100,
    summary: "Researchers pieced together evidence from clay tablets, an overwritten stela, inscriptions and a damaged statue to identify three possible Assyrian rulers missing from the standard Assyrian King List, suggesting the official list may have functioned partly as a legitimizing political canon.",
    strongest_comment: "Hank: ‘The official list says those kings never ruled.’ The squirrel: ‘Good thing somebody checked the supporting documentation.’",
    lesson: "A productive rabbit hole often starts when one piece of evidence refuses to fit the accepted answer. Cross-checking the boring details can reveal that the authoritative source was telling a curated story.",
    strongest_post_concept: "The Kings Deleted From the Official Record",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Scientists Went Looking for a Shipwreck and Found a Deep-Sea Appliance Showroom Instead",
    source_url: "https://www.sciencealert.com/deep-sea-scientists-hunting-a-shipwreck-accidentally-stumbled-across-the-oceans-own-backrooms",
    source_name: "ScienceAlert",
    published_at: "2026-08-26T00:00:00Z",
    category: "Rabbit Holes with a Good End",
    score: 99,
    summary: "A NOAA deep-sea expedition followed a promising sonar target about 1.5 kilometers down in the Gulf of Mexico expecting a shipwreck. The remotely operated vehicle instead found a lost shipping container and a field of refrigerators, freezers and washing machines, revealing both colonization by marine life and human impact in the deep sea.",
    strongest_comment: "Hank: ‘We were looking for a historic shipwreck.’ The squirrel: ‘We found the ocean’s abandoned appliance department.’",
    lesson: "Exploration pays even when the original hypothesis is wrong. Sometimes the detour reveals the problem nobody knew to search for.",
    strongest_post_concept: "The Ocean’s Abandoned Appliance Department",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  }
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("token") !== TOKEN) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !secret) {
    return Response.json({ error: "Missing Supabase server credentials" }, { status: 503 });
  }
  const supabase = createClient<any>(supabaseUrl, secret, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.rpc("ingest_hank_news_updates", {
    p_user_id: "db7d5dee-c813-40b6-a966-ebfacbee862d",
    p_stories: stories,
  });
  if (error) {
    return Response.json({ error: error.message, code: error.code, details: error.details, hint: error.hint }, { status: 500 });
  }
  return Response.json({ count: stories.length, results: data });
}
