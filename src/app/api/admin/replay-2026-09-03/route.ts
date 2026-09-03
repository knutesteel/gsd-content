import { createClient } from "@supabase/supabase-js";

const TOKEN = "replay-sep03-9c7f3a61b4e2";
const USER_ID = "db7d5dee-c813-40b6-a966-ebfacbee862d";

const stories = [
  {
    title: "Meta Made AI Usage a Performance Metric — Then Stopped Counting It",
    source_url: "https://timesofindia.indiatimes.com/technology/tech-news/months-after-meta-made-ai-tools-mandatory-for-employees-company-execs-tell-engineers-performance-reviews-will-not-count-ai-use-and-ask-managers-to-look-at/amp_articleshow/133731983.cms",
    source_name: "Times of India",
    published_at: "2026-09-03",
    category: "WORKPLACE ABSURDITY",
    score: 100,
    summary: "Meta revised engineering performance guidance so managers will focus on overall impact rather than AI-usage dashboards, token counts, or AI-adoption labels after months of pressure to use AI tools more heavily.",
    strongest_comment: "Hank: ‘We made AI usage part of performance.’ The squirrel: ‘Great. Now we aren’t counting AI usage. Did the KPI finish transforming the organization before we retired it?’",
    lesson: "Measure the outcome you actually value, not a proxy behavior. When the metric becomes AI usage, people can optimize the usage instead of the work.",
    strongest_post_concept: "The AI Usage KPI That Retired Itself",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Starbucks Spent Years Defending a Dress Code Because the Store Needed a ‘Steampunk Hipster Vibe’",
    source_url: "https://www.insurancejournal.com/news/east/2026/09/03/883785.htm",
    source_name: "Insurance Journal / Reuters",
    published_at: "2026-09-03",
    category: "WORKPLACE ABSURDITY",
    score: 96,
    summary: "A federal appeals court sided with Starbucks in a dispute over union apparel at its Manhattan Reserve Roastery, where the company argued its dress code helped preserve a specific ‘steampunk, hipster vibe.’ The court sent parts of the dispute back for reconsideration under a different legal balancing test.",
    strongest_comment: "Hank: ‘This went to federal appeals court?’ The squirrel: ‘Yes. The operational requirement is apparently preserving the steampunk hipster vibe.’",
    lesson: "Policies built around image and consistency can become surprisingly expensive systems to administer and defend. The more elaborate the rule, the more clearly its business value should justify the friction.",
    strongest_post_concept: "The Steampunk Hipster Vibe Compliance Program",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Runaway Emu Turns an Australian Traffic Call Into a Police Foot Pursuit",
    source_url: "https://nz.news.yahoo.com/catch-runaway-emu-sparks-australian-050752328.html",
    source_name: "BBC via Yahoo News",
    published_at: "2026-09-03",
    category: "OFF-THE-WALL ANIMALS",
    score: 100,
    summary: "Police near Orange, New South Wales, responded to an emu blocking traffic on a country road. A young officer chased the flightless bird on foot, moved it away from the roadway, and the footage went viral; police even used the episode as a light-hearted recruiting pitch.",
    strongest_comment: "Hank: ‘Did the officer catch the emu?’ The squirrel: ‘No, but traffic cleared and recruiting got content.’",
    lesson: "Real work occasionally hands you a problem no playbook anticipated. Success is solving the actual risk, not necessarily completing the most obvious version of the task.",
    strongest_post_concept: "Other Duties as Assigned: Emu Pursuit",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Father and Son Go Bass Fishing and Accidentally Catch a Bald Eagle",
    source_url: "https://nz.news.yahoo.com/nova-scotia-father-son-haul-200340209.html",
    source_name: "CBC via Yahoo News",
    published_at: "2026-08-29",
    category: "OFF-THE-WALL ANIMALS",
    score: 99,
    summary: "A Nova Scotia father and his 15-year-old son were fishing for smallmouth bass when a bald eagle grabbed their fishing lines and lures, crashed into the lake, and became hooked. They brought it to shore, removed the tackle, and safely released it.",
    strongest_comment: "Hank: ‘We’re fishing for bass.’ The squirrel: ‘The scope has changed. We now have an eagle.’",
    lesson: "Some interruptions immediately become the priority. Good judgment includes knowing when to stop the planned task and deal carefully with the unexpected one in front of you.",
    strongest_post_concept: "The Fishing Trip With a Very Different Catch",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "A Coffee-Table-Size Scorpion Roamed Earth Before Forests Existed",
    source_url: "https://www.sciencedaily.com/releases/2026/08/260831015200.htm",
    source_name: "ScienceDaily",
    published_at: "2026-09-02",
    category: "SQUIRREL DISTRACTION / WEIRD FACTS",
    score: 100,
    summary: "Paleontologists describe a roughly meter-long fossil scorpion from ancient Britain that lived about 415 million years ago, before true forests existed. Its enormous size and possible semi-aquatic lifestyle challenge simple assumptions about when giant arthropods could thrive.",
    strongest_comment: "Hank: ‘We have work to do.’ The squirrel: ‘There was a three-foot scorpion before forests existed. Work has been rescheduled.’",
    lesson: "Some facts are legitimate rabbit-hole magnets because one concrete discovery forces several assumptions about an entire ancient ecosystem to be reconsidered.",
    strongest_post_concept: "Before Trees, There Were Giant Scorpions",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "At 75% of Light Speed, the Light Pushing a Solar Sail Starts Creating Drag",
    source_url: "https://www.sciencedaily.com/releases/2026/08/260831015157.htm",
    source_name: "ScienceDaily",
    published_at: "2026-09-02",
    category: "SQUIRREL DISTRACTION / WEIRD FACTS",
    score: 99,
    summary: "A theoretical analysis of laser-driven lightsails finds that at relativistic speeds, diffuse scattered photons begin producing a drag component at roughly 75% of light speed, even while the laser still provides net forward thrust.",
    strongest_comment: "Hank: ‘The laser pushes the sail.’ The squirrel: ‘Until the same light starts helping with the brakes.’",
    lesson: "A system optimized under one set of conditions can behave differently when it enters a new regime. Past success does not guarantee the same input keeps helping forever.",
    strongest_post_concept: "When the Accelerator Starts Becoming the Brake",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "NYC Bans Student AI Through Eighth Grade — Teachers Can Still Use It",
    source_url: "https://abc7ny.com/post/new-york-city-public-schools-banning-ai-use-middle-school-year/19778716/",
    source_name: "ABC7 New York",
    published_at: "2026-09-03",
    category: "PARENTING",
    score: 100,
    summary: "New York City public schools announced a one-year moratorium on student-facing generative AI from 2-K through eighth grade, affecting nearly 600,000 students. Teachers may still use approved AI for lesson planning and administrative work, while high schools will use limited pilots and AI-literacy lessons.",
    strongest_comment: "Hank: ‘Students can’t use AI.’ The squirrel: ‘Can the teacher?’ Hank: ‘For lesson planning and admin, yes.’ The squirrel: ‘The family policy meeting should be interesting.’",
    lesson: "Rules work better when they explain the skill being protected and why different roles get different access. Otherwise children experience a contradiction instead of a learning boundary.",
    strongest_post_concept: "AI for the Adults, Not Yet for the Kids",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Students Got A’s Online and F’s on Paper — So Teachers Put the Chromebooks Away",
    source_url: "https://nysfocus.com/2026/09/03/new-york-schools-screen-time-pen-paper",
    source_name: "New York Focus",
    published_at: "2026-09-03",
    category: "PARENTING",
    score: 100,
    summary: "New York teachers described students looking up answers, messaging friends, and using ChatGPT during digital assignments. One teacher retested the same online homework questions on paper and saw A-level online results turn into failures, then moved his classroom back to paper-based work.",
    strongest_comment: "Hank: ‘The dashboard says they mastered it.’ The squirrel: ‘The paper says otherwise.’",
    lesson: "A platform can measure successful completion without measuring learning. Test whether the skill transfers when the tool, answer lookup, and shortcuts disappear.",
    strongest_post_concept: "The A on the Screen and the F on the Paper",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Train the Preschool Teachers for 48 Hours, and the Kids’ Behavior Changes",
    source_url: "https://www.dawn.com/news/2027019",
    source_name: "Dawn",
    published_at: "2026-09-03",
    category: "PARENTING",
    score: 95,
    summary: "A four-month study across 12 Karachi public schools followed 24 preschool teachers and 410 children. Teachers receiving 48 hours of social-emotional-learning training plus ongoing mentorship showed stronger classroom quality, while children in those classrooms showed better social-emotional outcomes and fewer behavioral difficulties.",
    strongest_comment: "Hank: ‘We need to improve the kids’ classroom behavior.’ The squirrel: ‘Great. The upgrade is for the adults.’",
    lesson: "Sometimes the best child-focused intervention is improving the environment and the capability of the adults who shape it, rather than adding another system directly onto the child.",
    strongest_post_concept: "The Classroom Upgrade Was the Teacher",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Teachers Are Teaching, Working Second Jobs, Buying Supplies — and Running Out of Capacity",
    source_url: "https://www.aft.org/press-release/aft-survey-shows-teachers-are-stressed-working-second-jobs-and-still-paying-hundreds",
    source_name: "American Federation of Teachers",
    published_at: "2026-09-02",
    category: "OVERWHELMED",
    score: 98,
    summary: "An August survey of more than 2,000 AFT K-12 members found nearly two-thirds rated weekly stress at 7 or higher out of 10, more than 40% reported side jobs, many expected to spend hundreds of dollars on classroom supplies, and 31% said they were likely to leave teaching in the next year.",
    strongest_comment: "Hank: ‘The job is teaching.’ The squirrel: ‘And the second job. And buying supplies. And feeding students. And somehow recovering before Monday.’",
    lesson: "Individual effort cannot permanently patch a structural capacity mismatch. When workload and resources do not fit, personal productivity eventually stops being the answer.",
    strongest_post_concept: "The Job Behind the Job Behind the Job",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Workers Are Told to Keep Upskilling — 63% Say They Can’t Find the Time",
    source_url: "https://www.hrdive.com/news/workers-report-fobo-a-fear-of-becoming-obsolete/828115/",
    source_name: "HR Dive",
    published_at: "2026-08-18",
    category: "OVERWHELMED",
    score: 99,
    summary: "An ETS/Harris Poll survey found 58% of U.S. workers fear becoming obsolete because of skill gaps, while 68% say upskilling costs are difficult to cover and 63% say it is difficult to find time to learn while keeping up with their existing work.",
    strongest_comment: "Hank: ‘You need to continuously reskill so you don’t become obsolete.’ The squirrel: ‘Perfect. Which current responsibility should I stop doing while I continuously reskill?’",
    lesson: "Reskilling cannot be treated as an extra task added to a full workload. If learning is strategically necessary, organizations need to give it time, resources, and a clear path.",
    strongest_post_concept: "Please Upskill in the Time You Don’t Have",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Companies Have So Many Shadow AI Tools That Four in Five Aren’t Even Approved by IT",
    source_url: "https://www.airisktoday.com/ai-tools-without-it-oversight-reco/",
    source_name: "AI Risk Today",
    published_at: "2026-09-03",
    category: "OVERWHELMED",
    score: 98,
    summary: "Security vendor Reco says that within the 62 large enterprises it monitors, four in five AI tools it observed had no IT approval or oversight. In smaller and mid-size customers it reported about 41 unapproved AI tools per 100 employees, illustrating how quickly AI-tool proliferation can outrun governance.",
    strongest_comment: "Hank: ‘How many AI tools do we have?’ The squirrel: ‘Approved or actual?’",
    lesson: "Every added tool becomes another permission set, workflow, risk surface, and support burden. A smaller sanctioned stack can be more productive than letting tool proliferation turn employees into their own integration department.",
    strongest_post_concept: "The AI Tool Inventory Nobody Knew Existed",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Researchers Went Looking for One Spider and Found an Entirely New One Instead",
    source_url: "https://www.boisestatepublicradio.org/science-research/2026-09-02/idaho-spider-species-hexura-vandal",
    source_name: "Boise State Public Radio",
    published_at: "2026-09-02",
    category: "RABBIT HOLES WITH A GOOD END",
    score: 100,
    summary: "A University of Idaho doctoral researcher searching northern Idaho for a different spider species found an unfamiliar nickel-size arachnid instead. The team confirmed it as a new species, Hexura vandal, apparently endemic to Idaho and potentially useful for understanding and protecting the region’s forest habitat.",
    strongest_comment: "Hank: ‘Did you find the spider you were looking for?’ The squirrel: ‘No. We found the spider nobody knew existed.’",
    lesson: "This is when the squirrel should win: the unexpected clue was concrete, testable, and more valuable than the original target, so the team changed direction and followed the evidence.",
    strongest_post_concept: "The Search That Got Better When It Failed",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Archaeologists Find a Lost Medieval Church Under Oslo Without Digging a Hole",
    source_url: "https://www.heritagedaily.com/2026/09/ground-penetrating-radar-reveals-traces-of-lost-medieval-church/159150",
    source_name: "HeritageDaily",
    published_at: "2026-09-02",
    category: "RABBIT HOLES WITH A GOOD END",
    score: 99,
    summary: "Ground-penetrating radar surveys around Oslo Hospital revealed the nearly complete choir of a long-lost Franciscan monastery church, possible altar foundations, a brick-floored room, and likely graves. Decades of archaeology had not produced the same complete picture, and the structures remain safely underground.",
    strongest_comment: "Hank: ‘How much did you excavate?’ The squirrel: ‘None. We changed the tool instead of digging more holes.’",
    lesson: "When an old method keeps leaving blind spots, a new instrument can be more useful than simply doing more of the same work. Productive curiosity includes changing how you look.",
    strongest_post_concept: "The Church They Found Without Digging",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "They Kept Following Last Year’s Mosaic and Found Three More Rooms",
    source_url: "https://www.hurriyetdailynews.com/amp/new-rooms-paintings-unearthed-at-smyrna-226279",
    source_name: "Hürriyet Daily News",
    published_at: "2026-09-01",
    category: "RABBIT HOLES WITH A GOOD END",
    score: 98,
    summary: "Archaeologists extending work around a mosaic floor discovered last year at ancient Smyrna uncovered three additional Late Antique rooms, two more mosaic floors, a marble floor, and wall paintings never previously found in the Agora or theater area.",
    strongest_comment: "Hank: ‘Wasn’t the mosaic the discovery?’ The squirrel: ‘It was the first door.’",
    lesson: "A discovery can be an endpoint or a clue to a larger system. When the edges keep producing new evidence, following them can reveal context the first find could not explain on its own.",
    strongest_post_concept: "The Mosaic Was Only the Beginning",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  }
];

function normalizeResults(data: unknown): any[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray((data as any).results)) return (data as any).results;
  return data == null ? [] : [data];
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("token") !== TOKEN) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !secretKey) return Response.json({ error: "Server Supabase credentials are not configured" }, { status: 503 });

  const supabase = createClient(supabaseUrl, secretKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.rpc("ingest_hank_news_updates", { p_user_id: USER_ID, p_stories: stories });
  if (error) return Response.json({ error: error.message, details: error.details, hint: error.hint }, { status: 500 });

  const results = normalizeResults(data);
  const ids = results.map((row: any) => row?.content_item_id).filter((id: unknown): id is string => typeof id === "string");
  const { data: items, error: itemError } = ids.length
    ? await supabase.from("content_items").select("id,identifier,title,status,content_type,panel_count,score").in("id", ids)
    : { data: [], error: null };
  if (itemError) return Response.json({ count: stories.length, results, verification_error: itemError.message }, { status: 500 });

  const verifications = [];
  for (const item of items ?? []) {
    const { count: sourceCount, error: sourceError } = await supabase.from("content_sources").select("source_id", { count: "exact", head: true }).eq("content_item_id", item.id);
    verifications.push({ ...item, linked_source_count: sourceError ? null : sourceCount, source_error: sourceError?.message ?? null });
  }

  return Response.json({ count: stories.length, result_count: results.length, results, verifications });
}
