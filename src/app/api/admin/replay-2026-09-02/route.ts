import { createClient } from "@supabase/supabase-js";

const TOKEN = "replay-sep02-d4c9f76a82b1";
const USER_ID = "db7d5dee-c813-40b6-a966-ebfacbee862d";

const stories = [
  {
    title: "Meta Moves Everyone to Slack Because the AI Agents Like It Better",
    source_url: "https://thenextweb.com/news/meta-slack-ai-agents-europe-sovereign-collaboration-data-act-switching",
    source_name: "The Next Web",
    published_at: "2026-09-01",
    category: "WORKPLACE ABSURDITY",
    score: 100,
    summary: "Meta is migrating its internal communications from Google Chat to Slack. A memo from AI chief Alexandr Wang says Slack is the strongest platform available for AI agents because of its conversational interface, developer tooling and third-party integrations, and argues the shift will benefit the company even beyond employees directly building agents.",
    strongest_comment: "Hank: ‘We’re moving everyone to a new chat platform?’ The squirrel: ‘Yes. The coworkers who aren’t people prefer Slack.’",
    lesson: "AI agents should reduce coordination work, not automatically create another company-wide migration. A tool change earns its keep only if the end-to-end workflow becomes simpler for humans as well as agents.",
    strongest_post_concept: "Company-wide migration announcement: employees ask whether they requested Slack; Hank points to an AI agent wearing a Slack badge and says, ‘No, but your new digital coworkers did.’",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "92% of AI Users Have Tried Agentic AI at Work — Only 33% Got Formal Training",
    source_url: "https://www.benefitnews.com/news/more-employees-are-using-agentic-ai-but-lack-training",
    source_name: "Employee Benefit News",
    published_at: "2026-09-02",
    category: "WORKPLACE ABSURDITY",
    score: 99,
    summary: "Adobe for Business research cited by Employee Benefit News says 92% of AI users have already adopted agentic AI in the workplace, while only 33% have received formal training from their employers. The gap raises the risk that organizations deploy increasingly autonomous tools before employees know how to use, supervise or evaluate them effectively.",
    strongest_comment: "Hank: ‘We gave employees autonomous AI agents.’ The squirrel: ‘Great. Did we train them?’ Hank: ‘That appears to be on the roadmap.’",
    lesson: "Giving people a more powerful tool without teaching them how to supervise it is not adoption strategy. Training, guardrails and judgment need to scale with autonomy.",
    strongest_post_concept: "An employee receives a powerful AI-agent console with dozens of controls; the training packet beside it is one blank page labeled ‘Coming Soon.’",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Uber Says It Has Too Much Coordination — So It’s Cutting 3,300 Jobs and Nearly Halving Micro-Teams",
    source_url: "https://www.reuters.com/business/world-at-work/uber-cut-3300-jobs-overhaul-bloomberg-news-reports-2026-09-02/",
    source_name: "Reuters",
    published_at: "2026-09-02",
    category: "WORKPLACE ABSURDITY",
    score: 96,
    summary: "Uber plans to cut about 3,300 jobs, roughly 10% of its global workforce, while reducing management layers and nearly halving its number of micro-teams. The company also plans to concentrate more employees in New York and San Francisco and reduce remote roles to about 1% as it tries to simplify an organization it says has accumulated too much coordination overhead.",
    strongest_comment: "Hank: ‘We have too many coordination-heavy roles and tiny teams.’ The squirrel: ‘So the reorganization is mostly about reorganizing the organization?’",
    lesson: "When coordination becomes a major share of the work, structure itself becomes the productivity problem. The useful question is whether the redesign permanently removes handoffs rather than merely redrawing them.",
    strongest_post_concept: "An org chart has dozens of tiny boxes connected by hundreds of arrows; management announces a ‘simplification’ and starts erasing boxes while Hank asks how many arrows actually disappear.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Homeowner Calls 911 for a Burglar — Police Find a Growling Bobcat Upstairs",
    source_url: "https://mynorthwest.com/local/bobcat-kirkland-home-burglar/4271387",
    source_name: "KIRO 7 / MyNorthwest",
    published_at: "2026-09-01",
    category: "OFF-THE-WALL ANIMALS",
    score: 100,
    summary: "A Kirkland, Washington, homeowner heard banging inside the house and called 911 believing a burglar had broken in. Police instead found a growling bobcat at the top of the stairs, monitored it with a drone, isolated it until wildlife officers arrived, and later released it near Forbes Creek. Authorities think it may have entered through an open window, possibly while following the homeowner’s cat.",
    strongest_comment: "Hank: ‘There’s a burglar upstairs.’ The squirrel: ‘Technically yes. It is just a much more literal cat burglar.’",
    lesson: "Good triage starts with the evidence you have and stays flexible when the evidence changes. The right response to a strange fact is to update the diagnosis quickly, not defend the first assumption.",
    strongest_post_concept: "911 dispatch board says ‘BURGLAR’; police reach the staircase and replace it with ‘BOBCAT’; the squirrel adds a sticky note: ‘Cat burglar was not metaphorical.’",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Runaway Goat Has Been Eluding Berkeley Residents, Animal Control and Police for Days",
    source_url: "https://www.berkeleyscanner.com/2026/09/02/community/runaway-goat-gives-berkeley-police-slip/",
    source_name: "The Berkeley Scanner",
    published_at: "2026-09-01",
    category: "OFF-THE-WALL ANIMALS",
    score: 100,
    summary: "A loose goat has roamed Berkeley for days while residents track sightings online and animal control repeatedly arrives after it has moved on. Police found the goat on Tunnel Road, but it escaped through an unfenced backyard when officers tried to corral it. Residents have speculated it may have escaped from a fire-mitigation grazing herd, though its origin had not been confirmed at publication.",
    strongest_comment: "Hank: ‘Animal control keeps arriving after the goat leaves.’ The squirrel: ‘The goat has apparently implemented agile route planning.’",
    lesson: "A response process fails when it is consistently slower than the thing it is trying to manage. Sometimes the system needs a different interception strategy, not another repetition of the same chase.",
    strongest_post_concept: "A city response map fills with goat sightings one step ahead of animal control; the squirrel moves a tiny goat token every time the team arrives.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Wild Parrot Gets Its Head Stuck Between Glass Panes on a Third-Floor Balcony",
    source_url: "https://www.upi.com/Odd_News/2026/09/01/stuck-wild-parrot-San-Francisco/4431788272834/",
    source_name: "UPI",
    published_at: "2026-09-01",
    category: "OFF-THE-WALL ANIMALS",
    score: 98,
    summary: "San Francisco firefighters and animal control rescued a wild parrot whose head became wedged between panes of glass on a third-floor balcony of a building under construction. Firefighters used a roof ladder, slid the bird upward to free it, and an animal-control officer checked it before release. Other parrots gathered nearby and squawked after the rescued bird returned to a tree.",
    strongest_comment: "Hank: ‘How did your head get between two panes of glass?’ The squirrel: ‘The entry plan was significantly better than the exit plan.’",
    lesson: "Curiosity is cheap on the way into a problem and can be expensive on the way out. Before squeezing into a narrow option, it helps to know whether the same path works in reverse.",
    strongest_post_concept: "Parrot confidently enters a gap labeled ‘Looks Interesting’; next panel shows an entire rescue team deploying ladders under a sign labeled ‘Exit Strategy.’",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "A New ‘Demon Cavefish’ Hid for Decades in One of Alabama’s Most Studied Caves",
    source_url: "https://www.uah.edu/science/science-news/20363-hiding-plain-sight-uah-researchers-discover-new-demon-cavefish-in-north-alabama-cave",
    source_name: "University of Alabama in Huntsville",
    published_at: "2026-07-27",
    category: "SQUIRREL DISTRACTION / WEIRD FACTS",
    score: 100,
    summary: "Researchers identified a completely eyeless, colorless, faintly electric-blue cavefish as an entirely new genus, Demogorgonichthys arcanus, in Bobcat Cave beneath Redstone Arsenal. The cave has been monitored at least quarterly for more than 30 years, but the fish escaped notice because it closely resembles another blind cavefish living in the same pools. Modern anatomy, CT imaging and DNA finally separated the two lineages.",
    strongest_comment: "Hank: ‘We’ve monitored this cave for thirty years.’ The squirrel: ‘Excellent. There was an entire genus in the same pool we thought we already understood.’",
    lesson: "Familiarity can hide anomalies. When something looks almost exactly like what you expect, careful re-examination can be more valuable than searching somewhere new.",
    strongest_post_concept: "A checklist says ‘Cave surveyed for 30 years — nothing new’; the squirrel zooms in on two nearly identical blind fish and circles one: ‘Entire new genus.’",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Earth May Have Temporarily Lost the Sun’s Protective Bubble Millions of Years Ago",
    source_url: "https://sciencedaily.com/releases/2026/09/260901070523.htm",
    source_name: "ScienceDaily / NASA-funded SHIELD Center",
    published_at: "2026-09-02",
    category: "SQUIRREL DISTRACTION / WEIRD FACTS",
    score: 99,
    summary: "NASA-funded simulations suggest that when the solar system passed through dense interstellar clouds roughly 2–3, 6–7 and 13–14 million years ago, the heliosphere may have compressed to smaller than Earth’s orbit. If so, Earth would temporarily have sat outside the Sun’s usual protective bubble and been exposed directly to a different interstellar environment.",
    strongest_comment: "Hank: ‘The Sun has a protective bubble around the solar system.’ The squirrel: ‘Had. Temporarily. Earth may have fallen outside it. I will be unavailable for the next hour.’",
    lesson: "A fact becomes irresistible when it turns an invisible background assumption into a system that can fail. Even planetary protection has operating conditions.",
    strongest_post_concept: "Earth sits comfortably inside a giant ‘SUN PROTECTION’ bubble; a dense interstellar cloud squeezes the bubble inside Earth’s orbit while the squirrel opens seventeen browser tabs.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "One Odd Wallaby Tooth Reveals 1,200-Year-Old Jewelry After a Site Was Almost Written Off as a Dingo Den",
    source_url: "https://phys.org/news/2026-09-resin-mounted-wallaby-teeth-reveal.html",
    source_name: "Phys.org",
    published_at: "2026-09-01",
    category: "SQUIRREL DISTRACTION / WEIRD FACTS",
    score: 99,
    summary: "While sorting animal bones from the Windmill Way rock shelter in Queensland, archaeologist Lynley Wallis noticed a wallaby tooth with a small ball of dark resin on its root. That led to 11 more resin-mounted teeth. Chemical tests tied the adhesive to local tree gums, while fibers and hide residues suggest the teeth were probably strung into a necklace or headband. The shelter had initially looked so full of gnawed bones that researchers nearly wrote it off as a dingo den.",
    strongest_comment: "Hank: ‘This pile looks like a dingo den.’ The squirrel: ‘Except this one tooth has glue on it. Cancel lunch.’",
    lesson: "The useful rabbit hole often begins with one detail that does not fit the easy classification. An anomaly deserves a second look before the whole pile gets labeled and ignored.",
    strongest_post_concept: "Archaeologist robotically sorts bones into a bin marked ‘DINGO DEN,’ pauses at one tooth with a tiny resin blob, and the next panel explodes into ‘1,200-YEAR-OLD JEWELRY.’",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "120+ Experts Say School ‘Digital Detox’ Rules May Solve the Wrong Screen Problem",
    source_url: "https://www.uow.edu.au/media/2026/researchers-warn-digital-detox-in-schools-may-do-more-harm-than-good.php",
    source_name: "University of Wollongong",
    published_at: "2026-09-02",
    category: "PARENTING",
    score: 98,
    summary: "More than 120 Australian researchers and organizations signed a position statement urging governments to focus on what students do with screens rather than imposing blanket school screen-time limits. They argue that indiscriminate restrictions could remove useful learning and digital-literacy opportunities, especially for students with less access to technology at home. The statement does not argue for unlimited device use; it calls for evaluating quality, purpose and context.",
    strongest_comment: "Hank: ‘Screen time is screen time.’ The squirrel: ‘So thirty minutes of coding and thirty minutes of doomscrolling are the same thing now?’",
    lesson: "A simple metric can hide very different behaviors. Parenting and school policies work better when they target the activity creating the problem rather than whichever number is easiest to count.",
    strongest_post_concept: "A giant timer labels every screen minute identical; Hank separates two tablets—one showing coding, one endless scrolling—and the timer dashboard starts smoking.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Teenagers May Be Flying Between Two Time Zones Every Week Without Leaving Home",
    source_url: "https://medicalxpress.com/news/2026-09-social-jet-lag-contribute-teenage.html",
    source_name: "MedicalXpress / University of Southampton",
    published_at: "2026-09-01",
    category: "PARENTING",
    score: 98,
    summary: "A systematic review and meta-analysis covering 12 comparable studies and more than 230,000 participants found a small but consistent association between greater ‘social jet lag’—the mismatch between weekday and weekend sleep timing—and higher anxiety in teenagers. Researchers note that puberty naturally shifts sleep later while early school schedules pull wake times earlier, encouraging weekend catch-up sleep and repeated schedule shifts.",
    strongest_comment: "Hank: ‘We didn’t travel anywhere this weekend.’ The squirrel: ‘Your teenager changed time zones Friday night and flew back Sunday evening.’",
    lesson: "A routine can create friction even when every individual day looks reasonable. Consistency is sometimes more useful than optimizing weekdays and weekends separately.",
    strongest_post_concept: "Teen bedroom has two clocks labeled ‘School Time Zone’ and ‘Weekend Time Zone’; every Friday and Sunday the squirrel drags a suitcase between them.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "53% of Americans Say They Spend Too Much Time on Their Phones — Cutting Back Is the Hard Part",
    source_url: "https://www.pewresearch.org/short-reads/2026/09/01/about-half-of-americans-say-they-spend-too-much-time-on-their-smartphone/",
    source_name: "Pew Research Center",
    published_at: "2026-09-01",
    category: "OVERWHELMED",
    score: 100,
    summary: "Pew Research Center found 53% of U.S. adults say they spend too much time on their smartphone. Forty-five percent say they tried to cut back in the past year; among those, only 25% say they were very or extremely successful, while 52% were somewhat successful and 23% were not very or not at all successful. Respondents were also more likely to say phones hurt sleep and productivity than help those areas.",
    strongest_comment: "Hank: ‘More than half of us know the phone is taking too much time.’ The squirrel: ‘Awareness notification received. Would you like to dismiss it and keep scrolling?’",
    lesson: "Knowing an input is excessive is not the same as controlling it. Good systems make stopping easier instead of asking willpower to defeat an always-available stream of novelty.",
    strongest_post_concept: "Phone displays ‘You spend too much time on me’ with buttons ‘CUT BACK’ and ‘REMIND ME AFTER 14 MORE SCROLLS’; the squirrel chooses the second one.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "AI Saves Some Workers a Full Day a Week — Two-Thirds Get Little or No Guidance on What to Do With It",
    source_url: "https://www.bcg.com/publications/2026/ai-at-work-why-strategy-matters-more-than-tools",
    source_name: "Boston Consulting Group",
    published_at: "2026-06-03",
    category: "OVERWHELMED",
    score: 100,
    summary: "BCG’s 2026 AI at Work survey found 42% of regular frontline AI users report saving eight hours or more per week, yet 66% receive limited or no guidance on how to use the time they save, and more than half say they are not reinvesting it in more strategic work. The same research found substantial shares spending more time making decisions or managing and directing AI.",
    strongest_comment: "Hank: ‘AI gave you a day back.’ The squirrel: ‘Great. Management left the day blank, so the calendar filled it for us.’",
    lesson: "Efficiency only creates capacity when the organization decides what the capacity is for. Otherwise saved time becomes an empty container that more work immediately fills.",
    strongest_post_concept: "AI hands an employee an eight-hour block labeled ‘TIME SAVED’; before Hank can assign a priority, notifications and meetings pour into it until the block disappears.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Undergrad Spots a Sesame-Seed-Sized Sea Slug on a Recreational Dive — It Becomes a New Species",
    source_url: "https://utmsi.utexas.edu/science-and-the-sea/print-article/a-sesame-seed-sized-surprise/",
    source_name: "University of Texas Marine Science Institute",
    published_at: "2026-09-01",
    category: "RABBIT HOLES WITH A GOOD END",
    score: 100,
    summary: "Undergraduate Ho-Yeung Chan was on a recreational dive off Keelung, Taiwan, when he noticed a translucent sea slug only about 3 millimeters long. He contacted a nudibranch expert on Facebook, and the chance observation eventually became the formally described new species Thecacera sesama. Difficult seasonal diving conditions meant researchers spent years gathering enough information to complete the work.",
    strongest_comment: "Hank: ‘You were just recreational diving?’ The squirrel: ‘Yes. I saw something the size of a sesame seed and accidentally added a species to science.’",
    lesson: "Sometimes the squirrel should win because the odd detail is specific, observable and worth testing. Curiosity becomes productive when somebody follows the clue with documentation and persistence.",
    strongest_post_concept: "Undergrad swims past a nearly invisible speck, doubles back while everyone else keeps moving, and the final panel replaces ‘tiny distraction’ with ‘NEW SPECIES.’",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Physicists Search for One Exotic Particle, Don’t Find It — and Discover Two Other Structures Instead",
    source_url: "https://www.sciencedaily.com/releases/2026/08/260831015147.htm",
    source_name: "ScienceDaily / Thomas Jefferson National Accelerator Facility",
    published_at: "2026-09-02",
    category: "RABBIT HOLES WITH A GOOD END",
    score: 100,
    summary: "The GlueX experiment at Jefferson Lab searched for a mysterious particle known as Y(2175) through photoproduction and did not observe the expected signal. Instead, the analysis revealed evidence for two different structures, including a Y(2240) signal at five-sigma significance and an X(1830) signal at lower significance, opening new questions about how exotic combinations of quarks and gluons form.",
    strongest_comment: "Hank: ‘Did you find the particle you were looking for?’ The squirrel: ‘No. We found two different mysteries. The detour has been promoted.’",
    lesson: "A failed search can still be productive when the experiment is designed to notice unexpected evidence. The goal is learning, not merely confirming the original guess.",
    strongest_post_concept: "Scientists open a box labeled ‘FIND Y(2175)’ and find it empty; behind it are two glowing boxes labeled ‘Y(2240)’ and ‘X(1830)’ while the squirrel says, ‘Task failed successfully.’",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  }
];

type ResultRow = {
  ordinal?: number;
  title?: string;
  result?: string;
  content_item_id?: string;
  identifier?: string;
  reason?: string | null;
};

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (token !== TOKEN) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return Response.json({ error: "Supabase server credentials are not configured" }, { status: 503 });

  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.rpc("ingest_hank_news_updates", {
    p_user_id: USER_ID,
    p_stories: stories,
  });
  if (error) return Response.json({ error: error.message, details: error.details, hint: error.hint }, { status: 500 });

  const results: ResultRow[] = Array.isArray(data) ? data as ResultRow[] : [];
  const ids = results.map((row) => row.content_item_id).filter((id): id is string => typeof id === "string" && id.length > 0);
  let verification: Array<Record<string, unknown>> = [];
  let verification_error: string | null = null;

  if (ids.length) {
    const [{ data: items, error: itemsError }, { data: links, error: linksError }] = await Promise.all([
      supabase.from("content_items").select("id,identifier,title,status,content_type,panel_count,score").in("id", ids),
      supabase.from("content_sources").select("content_item_id,source_id").in("content_item_id", ids),
    ]);
    if (itemsError || linksError) {
      verification_error = itemsError?.message ?? linksError?.message ?? "Verification query failed";
    } else {
      const linkCounts = new Map<string, number>();
      for (const link of links ?? []) linkCounts.set(link.content_item_id, (linkCounts.get(link.content_item_id) ?? 0) + 1);
      verification = (items ?? []).map((item) => ({ ...item, source_count: linkCounts.get(item.id) ?? 0 }));
    }
  }

  return Response.json({ count: results.length, results, verification, verification_error });
}
