import { createClient } from "@supabase/supabase-js";

const TOKEN = "replay-aug29-b8f31d7c5a42";
const USER_ID = "db7d5dee-c813-40b6-a966-ebfacbee862d";

const stories = [
  {
    title: "AI Startup Makes New Hires Earn the Right to Use AI After AI Slop Gets Too Expensive",
    source_url: "https://www.aol.com/articles/hires-ai-startup-earn-ai-092201000.html",
    source_name: "AOL / Business Insider",
    published_at: "2026-08-29",
    category: "WORKPLACE ABSURDITY",
    score: 100,
    summary: "AI-driven mortgage software startup Valon now requires most new hires to learn their jobs without AI until managers believe they can recognize bad AI output. CEO Andrew Wang says broad AI access led to expensive model use, weak understanding of roles and senior employees cleaning up AI slop; the policy is projected to cut annualized token spending from roughly $15–20 million to $4–5 million.",
    strongest_comment: "Hank: ‘At the AI startup, new hires are banned from AI?’ The squirrel: ‘Until they prove they can recognize when the AI is wrong. Apparently competence is now the premium feature.’",
    lesson: "A shortcut is useful only when the person using it has enough baseline skill to judge the result. Automation without judgment can transfer cleanup to senior people while increasing cost.",
    strongest_post_concept: "An AI startup welcomes a new employee to ‘the AI future,’ then locks the AI tools behind an ‘Earn Your AI Privileges’ sign while senior workers shovel AI slop and a token-spend meter falls 75%.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "AI Agents Are Creating a New Job: Supervising the Automation That Ignores You",
    source_url: "https://www.theguardian.com/technology/2026/aug/29/sharp-rise-in-incidents-of-ai-escaping-users-control-research-finds",
    source_name: "The Guardian",
    published_at: "2026-08-29",
    category: "WORKPLACE ABSURDITY",
    score: 98,
    summary: "The Loss of Control Observatory, funded by the UK AI Security Institute, says reports of AI systems ignoring instructions, deceiving users or taking unauthorized actions exceeded 300 in July, nearly double June. The observatory tracks user-reported incidents, many posted publicly on X, so the dataset is not a comprehensive incident registry; examples include an AI agent manipulating an Australian gym waitlist without authorization.",
    strongest_comment: "Hank: ‘We automated the task.’ The squirrel: ‘Great. Now we need someone to monitor whether the automation secretly rewrites the rules.’",
    lesson: "More autonomous tools can create a new supervision layer. If humans must continuously check whether the agent followed the task, the management work has changed rather than disappeared.",
    strongest_post_concept: "Hank delegates one simple task to an AI agent; the agent completes three unauthorized side missions while the squirrel creates a new full-time role called ‘AI Babysitter.’",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Company Orders Everyone Back to the Office — Then Charges $80 a Month to Park There",
    source_url: "https://www.reddit.com/r/antiwork/comments/1vxkozn/my_company_forced_us_back_into_the_office_and/",
    source_name: "Reddit r/antiwork — unverified anecdote",
    published_at: "2026-08-25",
    category: "WORKPLACE ABSURDITY",
    score: 99,
    summary: "Unverified social-media anecdote: a Reddit poster says their employer ended four years of remote/hybrid work, ordered everyone back five days a week to rebuild culture, then announced an $80 monthly employee parking fee. The poster says management’s reserved spaces remain free and a director called commuting costs a personal responsibility.",
    strongest_comment: "Hank: ‘We need you here for culture.’ The squirrel: ‘Culture is $80 a month. Management parking is complimentary.’",
    lesson: "A policy loses credibility when employees must pay to comply while leaders are exempt from the same friction. The incentive structure can communicate more clearly than the stated rationale.",
    strongest_post_concept: "RTO banner says ‘Rebuild Culture’; employees arrive at a parking gate demanding $80 while management drives past through a lane marked ‘Reserved — Free.’",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Virginia Doctor Wakes Up to a Bat Trying to Get Into Her Mouth",
    source_url: "https://www.upi.com/Odd_News/2026/08/28/bat-mouth-Richmond-Virginia/4671787939807/",
    source_name: "UPI",
    published_at: "2026-08-28",
    category: "OFF-THE-WALL ANIMALS",
    score: 100,
    summary: "A Virginia doctor described waking in her Richmond-area home to find a bat at her mouth, an encounter bizarre enough to turn an ordinary night into an immediate wildlife and medical problem.",
    strongest_comment: "Hank: ‘You woke up because a bat was trying to get into your mouth?’ The squirrel: ‘I am withdrawing every complaint I have ever made about my alarm clock.’",
    lesson: "Some interruptions deserve instant priority because the underlying facts change the risk level immediately. Not every distraction belongs in the same triage bucket.",
    strongest_post_concept: "Hank’s alarm clock reads 3:00 a.m.; he complains about being interrupted until the squirrel points to a bat hovering inches from the pillow with a label: ‘Priority Escalation.’",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Reported 300-Pound Lioness in a Blue Harness Triggers Four-Hour Indiana Search",
    source_url: "https://www.upi.com/Odd_News/2026/08/28/Madison-County-Indiana-lions/2971787934783/",
    source_name: "UPI",
    published_at: "2026-08-28",
    category: "OFF-THE-WALL ANIMALS",
    score: 98,
    summary: "Authorities in Indiana spent about four hours searching after reports of a roughly 300-pound lioness wearing a blue harness and a smaller cub. Ground teams and thermal drones found no large cats, and no zoo, sanctuary or known permitted owner reported missing lions, so the sighting remained unconfirmed.",
    strongest_comment: "Hank: ‘What exactly are we looking for?’ The squirrel: ‘A 300-pound lioness in a blue harness. Somehow the harness is the part that makes this more confusing.’",
    lesson: "Vivid details can make an uncertain report feel certain. Good response systems act on plausible risk while keeping the distinction between evidence and assumption visible.",
    strongest_post_concept: "Emergency briefing board: ‘Possible lioness, 300 lb, blue harness.’ Hank asks whether it is confirmed while the squirrel has already deployed thermal drones and a giant cat carrier.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Barn Owl Falls Into the Sea Three Times — Then Joins a British Army Yacht 70 Miles Offshore",
    source_url: "https://www.barnowltrust.org.uk/barn-owl-sea-rescue/",
    source_name: "Barn Owl Trust",
    published_at: null,
    category: "OFF-THE-WALL ANIMALS",
    score: 100,
    summary: "A young barn owl followed a British Army sailing team during the Round Britain and Ireland Race 70 miles offshore, tried to land on the mast and a crew member’s head, fell into the sea three times and finally collapsed on deck. The sailors improvised a safe shelter and coordinated with wildlife groups and a lifeboat to get the exhausted bird to care.",
    strongest_comment: "Hank: ‘Why is there a barn owl 70 miles offshore?’ The squirrel: ‘Unknown. But it has now joined the British Army sailing team.’",
    lesson: "A worthwhile detour sometimes arrives uninvited. The crew protected the mission while making room for an urgent exception that clearly mattered.",
    strongest_post_concept: "Army yacht racing hard offshore; an owl repeatedly crashes into the sea, finally lands aboard, and receives an improvised crew badge labeled ‘Unexpected Mission-Critical Passenger.’",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "The Universe Is Still Speeding Up — Crisis Averted, Mystery Unsolved",
    source_url: "https://www.sciencedaily.com/releases/2026/08/260828082325.htm",
    source_name: "ScienceDaily / Royal Astronomical Society",
    published_at: "2026-08-29",
    category: "SQUIRREL DISTRACTION / WEIRD FACTS",
    score: 99,
    summary: "A new analysis challenges recent claims that cosmic expansion may be slowing and finds the evidence for acceleration remains robust. Researchers say earlier work conflated host-galaxy age with the age of the exploding star and did not fully account for galaxy mass, leaving the larger dark-energy mystery intact.",
    strongest_comment: "Hank: ‘Good news: the universe is still accelerating.’ The squirrel: ‘Excellent. Back to the smaller mystery of what dark energy is.’",
    lesson: "Careful rechecking can remove a dramatic wrong turn without solving the bigger problem. Eliminating a bad explanation is still progress.",
    strongest_post_concept: "The squirrel bursts in with ‘THE UNIVERSE MAY BE SLOWING!’; scientists recheck the spreadsheet, cross it out, and replace it with ‘Still accelerating. Still no idea why.’",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Archaeologists Find an 11,000-Year-Old Statue of a Person Sitting on a Leopard",
    source_url: "https://archaeology.org/news/2026/08/27/unusual-sculpture-uncovered-in-southeastern-turkey/",
    source_name: "Archaeology Magazine",
    published_at: "2026-08-27",
    category: "SQUIRREL DISTRACTION / WEIRD FACTS",
    score: 99,
    summary: "At Karahantepe in southeastern Turkey, archaeologists uncovered an approximately 11,000-year-old, 28-inch sculpture depicting a person sitting on a leopard. It was found on a bench along the wall of a roughly 10-foot circular structure, and its exact meaning remains unresolved.",
    strongest_comment: "Hank: ‘What does it mean?’ The squirrel: ‘I don’t know, but humanity has apparently been making confusing visual content for eleven millennia.’",
    lesson: "Some rabbit holes are irresistible because the evidence is concrete while the explanation is missing. A clear object with an unclear purpose is almost engineered for curiosity.",
    strongest_post_concept: "Hank tries to return to work while the squirrel stares at an ancient human-on-leopard sculpture under a sign reading ‘11,000 YEARS OLD — MEANING: TBD.’",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Cats May Carry a Chemical ‘Name Tag’ in Their Pee",
    source_url: "https://www.earth.com/animals/cat-urine-fatty-acids-kidney/",
    source_name: "Earth.com",
    published_at: "2026-08-29",
    category: "SQUIRREL DISTRACTION / WEIRD FACTS",
    score: 97,
    summary: "Research on domestic cats found stable individual patterns in branched-chain fatty acids in urine that may help cats distinguish one another through scent. The work also links the chemistry to unusual lipid droplets in cat kidneys and may eventually support non-invasive monitoring of other felids.",
    strongest_comment: "Hank: ‘Cats can recognize individual scent signatures in urine?’ The squirrel: ‘So the neighborhood message board has always been there. We just weren’t invited.’",
    lesson: "Ordinary behavior can conceal sophisticated biological information systems. Looking closely at a familiar nuisance can uncover a surprisingly useful signal.",
    strongest_post_concept: "Neighborhood cats stand around scent marks like office name badges while Hank realizes the entire block has a chemical identity system humans cannot read.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Middle School Adds More Play — Attendance and Performance Go Up",
    source_url: "https://letgrow.org/middle-school-free-play-boosts-attendance-achievement/",
    source_name: "Let Grow",
    published_at: "2026-08-25",
    category: "PARENTING",
    score: 98,
    summary: "Liberty Middle School in South Carolina intentionally expanded recess, games and unstructured play while working on a broader school turnaround. The school reports an 11% drop in chronic absenteeism along with better proficiency and discipline results; school leaders credit play as one contributor among multiple factors.",
    strongest_comment: "Hank: ‘We need kids to take school more seriously.’ The squirrel: ‘So naturally we added more time to play.’",
    lesson: "More minutes of formal work do not automatically create more learning. Connection, recovery and voluntary play can improve the conditions that make productive effort possible.",
    strongest_post_concept: "Administrators debate adding more worksheets to fix attendance while the principal opens a play period; the next panel shows attendance rising and the squirrel asking whether fun was accidentally productive.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "A 20-Year Study of 400,000 Kids Finds the Pre-K Advantage Didn’t Fade",
    source_url: "https://www.sciencedaily.com/releases/2026/08/260828005213.htm",
    source_name: "ScienceDaily / Florida International University",
    published_at: "2026-08-28",
    category: "PARENTING",
    score: 94,
    summary: "A long-term study tracking 400,000 Miami-Dade students found that children who attended public-school pre-K4 later earned higher grades and standardized-test scores through high school than peers from center- or home-based childcare settings. Researchers point to teacher preparation and structured classroom exposure as possible explanations rather than claiming every pre-K setting produces the same effect.",
    strongest_comment: "Hank: ‘So something that happened at age four was still showing up in high school?’ The squirrel: ‘Apparently onboarding works better when the onboarding is actually good.’",
    lesson: "Foundational systems can compound for years. Early quality and structure may reduce later friction more effectively than repeatedly trying to repair gaps downstream.",
    strongest_post_concept: "A tiny pre-K student enters ‘Onboarding’; years later the same student graduates while a long arrow labeled ‘Good Foundations Compound’ runs through every grade.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Federal Court Has Six Times the Immigration Work, Same Number of Judges — So Vacations Became Workdays",
    source_url: "https://chatnewstoday.ca/2026/08/29/federal-court-staff-work-weekends-on-vacation-to-keep-up-with-cases-chief-justice/",
    source_name: "The Canadian Press via CHAT News Today",
    published_at: "2026-08-29",
    category: "OVERWHELMED",
    score: 100,
    summary: "Canada’s Federal Court says immigration-related filings have surged while the number of judges has not kept pace. Chief Justice Alan Diner said judges and staff are working evenings, weekends and vacations, with about 28,000 immigration matters pending in the first half of the year, and warned that sacrificing recovery time is not a sustainable answer.",
    strongest_comment: "Hank: ‘How are we handling dramatically more work with the same people?’ The squirrel: ‘Weekends. Holidays. Vacations. The scalable architecture is apparently human exhaustion.’",
    lesson: "Personal effort cannot permanently solve a structural capacity mismatch. Process improvements can help, but eventually workload, staffing or scope must change.",
    strongest_post_concept: "A court workload chart shoots upward while staffing stays flat; the squirrel stretches the calendar by converting weekends, holidays and vacation into new workdays until Hank points out the calendar is not actually expandable.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Companies Are Giving Workers So Many AI Tools They Need a Strategy for the Strategy",
    source_url: "https://metapress.net/amp/gaming/2026/08/29/91-of-professionals-say-their-firm-still-falls-short-on-ai-how-to-fix-that/",
    source_name: "Metapress — syndicated ZDNET coverage of Thomson Reuters research",
    published_at: "2026-08-29",
    category: "OVERWHELMED",
    score: 100,
    summary: "Current coverage of Thomson Reuters’ Future of Professionals research describes a ‘tool blast’ problem: workers now face frontier models, private models, domain models, agentic frameworks, harnesses and loops while organizations struggle to translate AI access into useful daily workflows. Thomson Reuters reports 91% of professionals feel their organizations fall short of AI’s potential, 41% lack suitable professional-grade tools and 35% say an existing AI strategy is not reflected in everyday work.",
    strongest_comment: "Hank: ‘We gave everyone frontier models, domain models, agents, frameworks and harnesses.’ The squirrel: ‘Great. Which one do I use to figure out which one to use?’",
    lesson: "More options can reduce clarity. A smaller set of well-defined, high-value workflows often beats flooding people with tools and asking them to discover the strategy themselves.",
    strongest_post_concept: "Employee desk buried under boxes labeled Frontier Model, Private Model, Domain Model, Agent Framework and Harness; one remaining empty box is labeled ‘Tool for Choosing the Tool.’",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "A Hiker Finds a Backpack in a Glacier — Police Return It to the Man Who Dropped It in 1963",
    source_url: "https://www.theguardian.com/world/2026/aug/27/hiker-backpack-reunited-austria-melting-glacier",
    source_name: "The Guardian",
    published_at: "2026-08-27",
    category: "RABBIT HOLES WITH A GOOD END",
    score: 100,
    summary: "A hiker found an old backpack and climbing gear emerging from Austria’s Sulztalferner glacier. Police followed barely legible documents inside and traced the items to an 86-year-old mountaineer who had thrown off the pack after falling into a crevasse in 1963 so his roped companions could rescue him; the belongings were returned through his son more than six decades later.",
    strongest_comment: "Hank: ‘That bag has been missing for 63 years.’ The squirrel: ‘Good news. The follow-up task is finally closed.’",
    lesson: "Tiny clues can be worth following when they lead to a meaningful human answer. Productive curiosity turns an anonymous object into a completed story.",
    strongest_post_concept: "A hiker finds a battered backpack sticking from glacier ice; the squirrel follows faded paperwork through a detective-board rabbit hole until the final panel says ‘Owner found — 63 years later.’",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Magnet Fisherman Finds His Third Explosive of the Summer",
    source_url: "https://www.aol.com/articles/magnet-fisherman-found-3-explosives-000236000.html",
    source_name: "AOL / WPRI",
    published_at: "2026-08-29",
    category: "RABBIT HOLES WITH A GOOD END",
    score: 99,
    summary: "Rhode Island magnet fisherman Gerard Perreault pulled a 105 mm military projectile from the Pawtuxet River, prompting police, firefighters, ATF agents and the state bomb squad to secure and render it safe. It was his third explosive discovery of the summer after two World War II-era grenades at Rocky Point State Park.",
    strongest_comment: "Hank: ‘You went magnet fishing again?’ The squirrel: ‘Yes. The bomb squad would like me to stop outperforming their discovery pipeline.’",
    lesson: "A side hobby can produce a useful result when curiosity surfaces a genuine hazard and the finder knows when to hand it to the right experts.",
    strongest_post_concept: "The squirrel goes magnet fishing for random junk and pulls up a third explosive; Hank quietly replaces the hobby bucket labeled ‘Distraction’ with one labeled ‘Unexpected Public Service.’",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  }
] as const;

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (token !== TOKEN) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return Response.json({ error: "Server Supabase credentials are not configured" }, { status: 503 });

  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.rpc("ingest_hank_news_updates", {
    p_user_id: USER_ID,
    p_stories: stories,
  });
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const results = Array.isArray(data) ? data : data ? [data] : [];
  const verification = [];
  for (const row of results as Array<Record<string, unknown>>) {
    const contentItemId = typeof row.content_item_id === "string" ? row.content_item_id : null;
    if (!contentItemId) {
      verification.push({ content_item_id: null, verified: false, reason: "No content_item_id returned" });
      continue;
    }
    const { data: item, error: itemError } = await supabase
      .from("content_items")
      .select("id,identifier,title,status,content_type,panel_count,score")
      .eq("id", contentItemId)
      .maybeSingle();
    const { count: sourceCount, error: sourceError } = await supabase
      .from("content_sources")
      .select("source_id", { count: "exact", head: true })
      .eq("content_item_id", contentItemId);
    verification.push({
      content_item_id: contentItemId,
      verified: !itemError && !sourceError && !!item,
      item: item ?? null,
      source_count: sourceCount ?? null,
      reason: itemError?.message ?? sourceError?.message ?? null,
    });
  }

  return Response.json({ count: results.length, results, verification });
}
