import { createClient } from "@supabase/supabase-js";

const TOKEN = "hank-news-aug28-9c41d7b3f2a6";
const USER_ID = "db7d5dee-c813-40b6-a966-ebfacbee862d";

const stories = [
  {
    title: "Cisco Gives 90,000 Employees Their Own Always-On AI Agent",
    source_url: "https://blogs.cisco.com/news/my-agent-and-the-rise-of-ambient-intelligence-ciscos-next-step-in-enterprise-ai",
    source_name: "Cisco Blogs",
    published_at: "2026-08-27",
    category: "WORKPLACE ABSURDITY",
    score: 97,
    summary: "Cisco is rolling MyAgent out to 90,000 employees. The persistent AI companion can coordinate supervised workflows across Outlook, Webex, Jira, SharePoint and other systems while remembering user preferences and context, with humans remaining accountable for outcomes.",
    strongest_comment: "Hank: ‘So every employee gets an always-on digital coworker?’ The squirrel: ‘Correct. We have doubled the number of things that need permissions, context and supervision without adding any desks.’",
    lesson: "Automation can remove coordination work, but at enterprise scale it also creates a new governance and oversight layer. The test is whether the agent reduces cognitive load rather than merely relocating it.",
    strongest_post_concept: "Cisco hands 90,000 workers their own AI coworkers while Hank tries to count who now needs access, supervision and accountability.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "New Hires Spend 12 Hours on 13 Documents — and Remember About Half",
    source_url: "https://hrexecutive.com/new-hires-name-5-onboarding-icks-hr-keeps-repeating/",
    source_name: "HR Executive",
    published_at: "2026-08-27",
    category: "WORKPLACE ABSURDITY",
    score: 100,
    summary: "Adobe Acrobat research on 1,006 U.S. workers who had started a job within the previous two years found new hires received an average of 13 onboarding documents and spent about 12 hours reviewing materials in week one. Workers said only 60% of the content was necessary, 44% retained half or less, and 63% had to re-enter the same personal information across forms.",
    strongest_comment: "Hank: ‘We streamlined onboarding.’ The squirrel: ‘Great. I only entered my address four times and spent twelve hours reading thirteen documents I’ll remember half of.’",
    lesson: "Organizations often confuse delivered information with transferred understanding. Good onboarding should reduce duplication, sequence information when it is needed and protect the new hire’s attention for actually learning the job.",
    strongest_post_concept: "A new hire finishes a 13-document, 12-hour onboarding marathon only to be asked to enter the same information again before starting any real work.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Kitten Rescued From an Excavator Gets a Hard Hat and Joins the Crew",
    source_url: "https://www.upi.com/Odd_News/2026/08/27/construction-kitten-RiverReach-Sue/3161787839205/",
    source_name: "UPI",
    published_at: "2026-08-27",
    category: "OFF-THE-WALL ANIMALS",
    score: 100,
    summary: "An Ohio construction crew found a tiny orange kitten inside a Komatsu excavator, rescued her through the bottom of the machine and named her Komatsu, or Sue. After fostering, she is set to become the shop mechanic’s cat, and Komatsu sent her a miniature safety vest and hard hat.",
    strongest_comment: "Hank: ‘You found a kitten inside the excavator?’ The squirrel: ‘Yes. HR has already completed onboarding and PPE issued a hard hat.’",
    lesson: "A completely unplanned interruption can become something worth keeping when people respond with judgment rather than treating every deviation from the plan as wasted time.",
    strongest_post_concept: "A construction crew’s rescue mission turns into an employee onboarding sequence for a kitten wearing full PPE.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Groundhog Gets Its Head Stuck in a Jar and Outsources the Exit Strategy",
    source_url: "https://hoodline.com/2026/08/pittsburgh-officers-free-groundhog-wandering-with-jar-stuck-on-its-head/",
    source_name: "Hoodline",
    published_at: "2026-08-27",
    category: "OFF-THE-WALL ANIMALS",
    score: 96,
    summary: "Pittsburgh Animal Care & Control officers rescued a groundhog wandering with a plastic jar stuck over its head. Officials say food containers commonly trap groundhogs because the animals can force their heads inside but struggle to back out.",
    strongest_comment: "Hank: ‘You put your head in the jar without an exit plan?’ The squirrel: ‘In fairness, the acquisition phase was extremely successful.’",
    lesson: "Curiosity becomes someone else’s task when there is no stopping rule or exit plan. Before diving into a rabbit hole, know what will tell you it is time to come back out.",
    strongest_post_concept: "The squirrel enthusiastically demonstrates a curiosity strategy modeled on a groundhog that optimized getting into the jar and forgot about getting out.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Ancient DNA Says People in Georgia Were Getting Cacao 1,000 Years Ago",
    source_url: "https://phys.org/news/2026-08-ancient-dna-reveals-cacao-consumed.html",
    source_name: "Phys.org",
    published_at: "2026-08-27",
    category: "SQUIRREL DISTRACTION / WEIRD FACTS",
    score: 99,
    summary: "Researchers found Theobroma cacao DNA in residue from 800- to 900-year-old pottery sherds at the Etowah site in present-day Georgia. Because cacao grows in tropical regions, the result points to long-distance pre-Columbian exchange networks reaching far beyond the Southeast.",
    strongest_comment: "Hank: ‘You were researching a pot in Georgia.’ The squirrel: ‘Correct. It has now become a thousand-year-old chocolate supply-chain investigation.’",
    lesson: "A small physical clue can expose a much larger network. The useful rabbit-hole question is not just what was in the pot, but what system had to exist to get it there.",
    strongest_post_concept: "One pottery fragment sends the squirrel from Georgia to a wall-sized map of ancient cacao trade routes.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Budapest’s ‘Rock of Starvation’ Reappears When the Danube Gets Dangerously Low",
    source_url: "https://www.popsci.com/environment/rock-of-starvation-reappears-budapest/",
    source_name: "Popular Science",
    published_at: "2026-08-27",
    category: "SQUIRREL DISTRACTION / WEIRD FACTS",
    score: 98,
    summary: "A historically ominous stone outcrop in the Danube known as the Rock of Starvation has reappeared near Budapest during severe drought. The marker becomes visible only at critically low water levels and has long served as a physical warning of difficult conditions ahead.",
    strongest_comment: "Hank: ‘How bad is the drought?’ The squirrel: ‘The river just unlocked an old dashboard called Rock of Starvation.’",
    lesson: "Useful systems do not have to be complicated. A durable signal tied directly to a real threshold can communicate urgency better than another dashboard nobody checks.",
    strongest_post_concept: "Hank opens a modern analytics dashboard while the squirrel points to a centuries-old rock in the river that already says everything they need to know.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Parents Think Their Teens Barely Use AI — Teens Say About Two-Thirds Use It for Schoolwork",
    source_url: "https://schaeffer.usc.edu/research/three-things-parents-miss-about-their-teens-lives/",
    source_name: "USC Schaeffer Institute",
    published_at: "2026-08-27",
    category: "PARENTING",
    score: 100,
    summary: "USC polling summarized this week says about two-thirds of teens use AI for schoolwork, while only about one-third of parents report that their teens ever use AI. Researchers argue parents need a clearer understanding of the tools before they can have useful conversations about how children are using them.",
    strongest_comment: "Hank: ‘My kid doesn’t really use AI for school.’ The squirrel quietly tilts the laptop screen away: ‘That is certainly one of the available interpretations.’",
    lesson: "Parenting rules built on assumptions miss the real behavior. Before setting limits or giving advice, understand what the child is actually doing and why.",
    strongest_post_concept: "A parent confidently explains the family’s AI rules while the child’s hidden laptop shows a completely different operating reality.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "New Jersey District Caps Classroom Screen Time — and Sixth Graders Need a Paper Tutorial",
    source_url: "https://www.cbsnews.com/newyork/news/lebanon-township-nj-classroom-screen-time-limit/",
    source_name: "CBS News New York",
    published_at: "2026-08-27",
    category: "PARENTING",
    score: 100,
    summary: "Lebanon Township, New Jersey, is capping classroom screen time at two hours a day for K-8 students. A sixth-grade teacher said some students now need explicit instruction on basics such as orienting lined paper, finding the margin and writing their names because laptops have become so dominant.",
    strongest_comment: "Hank: ‘Today we’re learning a legacy interface.’ The squirrel: ‘Does the paper need Wi-Fi, or is the margin the login screen?’",
    lesson: "A tool can become so convenient that it crowds out foundational skills. Sometimes removing technology is the fastest way to see what capability remains without it.",
    strongest_post_concept: "A sixth-grade class receives a serious onboarding session for paper, complete with instructions for margins, orientation and where the name goes.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "The Laptop Required for Homework Is Also an Unlimited Distraction Machine",
    source_url: "https://phys.org/news/2026-08-child-tablets-laptops-distractions-schoolwork.html",
    source_name: "Associated Press via Phys.org",
    published_at: "2026-08-27",
    category: "PARENTING",
    score: 97,
    summary: "AP reporting highlights the basic conflict of modern school devices: children need laptops and tablets for assignments, but the same machines also provide games, social media, notifications and endless browsing. Experts recommend reducing task switching, quieting notifications, using focused work periods and helping children build attention-management skills rather than relying only on surveillance.",
    strongest_comment: "Hank: ‘The laptop is required for homework.’ The squirrel: ‘Excellent. The school supply list included the homework and the distraction factory in the same box.’",
    lesson: "When the required tool contains unlimited alternate tasks, success depends on reducing switching and creating clear focus conditions rather than pretending temptation can be eliminated.",
    strongest_post_concept: "A child opens one homework tab while dozens of games, messages and notifications burst out of the same required school laptop.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Half of Workers Say AI Has Taken Longer Than Just Doing the Task Themselves",
    source_url: "https://www.walkme.com/news-releases/the-ai-confidence-trap/",
    source_name: "WalkMe",
    published_at: "2026-08-25",
    category: "OVERWHELMED",
    score: 100,
    summary: "A WalkMe survey of about 2,000 U.S. workers who use AI found 90% felt confident with it, but only 24.6% said AI worked on the first try. Half said they had spent longer getting AI to complete a task than doing it manually, while 51% said AI caused managers or teams to expect more output in the same amount of time.",
    strongest_comment: "Hank: ‘Did AI save time?’ The squirrel: ‘After four retries, technically yes. Management already assigned something to the saved time.’",
    lesson: "Perceived fluency is not the same as operational productivity. If reliability lags while expectations rise immediately, the productivity tool can become another source of pressure.",
    strongest_post_concept: "An AI finishes a task after repeated retries just as management instantly converts the theoretical time savings into a larger workload.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "More Digital Skill Helps — but Complicated Systems Can Still Wear People Out",
    source_url: "https://link.springer.com/article/10.1007/s10758-026-09977-4",
    source_name: "Springer Nature / Technology, Knowledge and Learning",
    published_at: "2026-05-27",
    category: "OVERWHELMED",
    score: 96,
    summary: "An open-access study of 412 university students found higher digital literacy and readiness were associated with lower technology fatigue, while system-specific overload from complex features, interfaces and processes helped explain fatigue. The authors argue that better user skills cannot fully compensate for unnecessarily complicated technology.",
    strongest_comment: "Hank: ‘Maybe people just need more training.’ The squirrel: ‘Or perhaps the system with forty-seven features and weekly interface changes is also participating in the problem.’",
    lesson: "Do not turn every usability problem into a user-training problem. Complexity itself consumes attention, and simplifying the system can be more effective than asking people to become better at enduring it.",
    strongest_post_concept: "Hank keeps assigning training while the squirrel is buried under menus, features and updates from the system the training is supposed to make tolerable.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "When Work Tech Follows You Home, Your Brain May Never Fully Clock Out",
    source_url: "https://link.springer.com/article/10.1007/s41542-026-00264-3",
    source_name: "Springer Nature / Occupational Health Science",
    published_at: "2026-06-03",
    category: "OVERWHELMED",
    score: 98,
    summary: "An open-access multi-wave study found both techno-overload and techno-invasion were associated with greater work-family conflict. Technology that extended work into non-work time was also linked to reduced psychological detachment, helping explain why constant reachability can make work continue mentally after the workday ends.",
    strongest_comment: "Hank: ‘Work ended at five.’ The squirrel, holding six glowing devices at the dinner table: ‘Correct. Work simply declined to leave.’",
    lesson: "Recovery requires a real boundary. A workload can remain cognitively active long after the last task if technology keeps reopening the work role throughout the evening.",
    strongest_post_concept: "Hank closes the office door at 5 p.m., only to watch Slack, email and work alerts follow him physically through the house to dinner.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "A 190-Year-Old Museum Specimen Solves a Pangolin Identity Mystery",
    source_url: "https://www.sciencedaily.com/releases/2026/08/260826055500.htm",
    source_name: "ScienceDaily / Field Museum",
    published_at: "2026-08-26",
    category: "RABBIT HOLES WITH A GOOD END",
    score: 100,
    summary: "Scientists extracted DNA from the 1836 type specimen of a Himalayan pangolin and used it with modern genomic and morphological evidence to resolve a long-running taxonomic question. The work confirms Manis aurita as a distinct species and could improve wildlife-forensics efforts against pangolin trafficking.",
    strongest_comment: "Hank: ‘You went back to a specimen collected in 1836?’ The squirrel: ‘Yes. It still had the answer everyone else was arguing about.’",
    lesson: "A productive rabbit hole often means returning to old evidence with a better question and better tools. The detour is justified when it resolves uncertainty and changes what people can do next.",
    strongest_post_concept: "The squirrel opens a 190-year-old museum drawer and pulls out the missing clue to a modern conservation problem.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "A Toad Fossil Collected in 1929 Sat in a Museum Until Someone Looked Closely",
    source_url: "https://www.smithsonianmag.com/smart-news/paleontologists-discover-a-new-species-of-ice-age-toad-at-the-la-brea-tar-pits-offering-clues-about-the-areas-ancient-climate-180989390/",
    source_name: "Smithsonian Magazine",
    published_at: "2026-08-27",
    category: "RABBIT HOLES WITH A GOOD END",
    score: 100,
    summary: "Paleontologists identified a new extinct Ice Age spadefoot toad, Spea labreae, from La Brea Tar Pits fossils that had been collected decades ago, including material recovered in 1929. Reexamining an understudied amphibian collection revealed a rare species that can also help reconstruct ancient Southern California climate conditions.",
    strongest_comment: "Hank: ‘That fossil has been in the collection since 1929.’ The squirrel: ‘Which means procrastination just became a ninety-seven-year research strategy.’",
    lesson: "Old work is not necessarily exhausted work. Fresh questions and careful attention can turn overlooked material into a discovery without collecting anything new.",
    strongest_post_concept: "The squirrel bypasses the flashy mammoth fossils and finds a major discovery in the dusty drawer everybody has been ignoring for decades.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Bad Observing Conditions Blocked DESI’s Main Job — So the Side Project Found Disintegrated Planets",
    source_url: "https://phys.org/news/2026-07-desi-side-reveals-spectra-disintegrated.html",
    source_name: "Phys.org",
    published_at: "2026-08-02",
    category: "RABBIT HOLES WITH A GOOD END",
    score: 100,
    summary: "DESI was built to survey distant galaxies, but when observing conditions were unsuitable for its primary targets, researchers used the time on nearer white dwarfs instead. That side project produced unusually clear spectra of 12 metal-rich white dwarfs, revealing the chemistry of rocky exoplanet debris being consumed by dying stars.",
    strongest_comment: "Hank: ‘We can’t do the main task tonight.’ The squirrel: ‘Great. Let’s use the telescope to study dead stars eating planets.’",
    lesson: "Blocked time does not have to become wasted time. A well-scoped side quest can be productive when it uses available capacity, has a real question and produces evidence worth keeping.",
    strongest_post_concept: "The main telescope task gets crossed off because of bad conditions, and the squirrel turns the downtime into a side quest that uncovers shredded exoplanets.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  }
];

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  if (requestUrl.searchParams.get("token") !== TOKEN) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !secretKey) {
    return Response.json({ error: "Server-side Supabase credentials are not configured" }, { status: 503 });
  }

  const supabase = createClient(supabaseUrl, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { data, error } = await supabase.rpc("ingest_hank_news_updates", {
    p_user_id: USER_ID,
    p_stories: stories
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const results = Array.isArray(data) ? data : data ? [data] : [];
  const ids = results
    .map((row: any) => row?.content_item_id)
    .filter((value: unknown): value is string => typeof value === "string" && value.length > 0);

  let verification: any[] = [];
  let verification_error: string | null = null;

  if (ids.length) {
    const { data: items, error: itemsError } = await supabase
      .from("content_items")
      .select("id,identifier,title,status,content_type,panel_count,score")
      .in("id", ids);

    const { data: links, error: linksError } = await supabase
      .from("content_sources")
      .select("content_item_id,source_id")
      .in("content_item_id", ids);

    if (itemsError || linksError) {
      verification_error = itemsError?.message ?? linksError?.message ?? "Verification failed";
    } else {
      const sourceCounts = new Map<string, number>();
      for (const link of links ?? []) {
        sourceCounts.set(link.content_item_id, (sourceCounts.get(link.content_item_id) ?? 0) + 1);
      }
      verification = (items ?? []).map((item) => ({
        ...item,
        source_count: sourceCounts.get(item.id) ?? 0
      }));
    }
  }

  return Response.json({
    requested: stories.length,
    returned: results.length,
    results,
    verification,
    verification_error
  });
}
