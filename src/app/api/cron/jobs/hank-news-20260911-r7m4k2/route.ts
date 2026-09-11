import { createClient } from "@supabase/supabase-js";

const userId = "db7d5dee-c813-40b6-a966-ebfacbee862d";

const stories = [
  {
    title: "Meta Flattened the Managers, Then Asked Some of Them to Become Managers Again",
    source_url: "https://cncbnews.com/article/2026/09/meta-is-asking-some-of-its-employees-to-become-managers-again-in-a-new-reorg",
    source_name: "CNCB News / Business Insider",
    published_at: "2026-09-10",
    category: "WORKPLACE ABSURDITY",
    score: 100,
    summary: "Meta is asking some individual contributors in its Applied AI division if they want to move back into management roles. Some of those employees had previously been managers before Meta reassigned them as individual contributors during its push toward flatter, leaner teams, making the new opt-in reshuffle a partial reversal of the manager-light strategy.",
    strongest_comment: "Hank: “Didn’t we just remove managers?” The squirrel: “Yes. We have now entered the management restoration phase.”",
    lesson: "Org-chart simplification is not the same as simplifying the work. If coordination, coaching and decision-making still need owners, flattening the titles can merely push management work somewhere less visible.",
    strongest_post_concept: "A giant FLATTEN MANAGEMENT org chart boomerangs months later into a memo asking former managers to become managers again.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Small Businesses Adopt AI to Do More With Less — Then Hire More Humans",
    source_url: "https://www.axios.com/2026/09/10/ai-hiring-small-business",
    source_name: "Axios",
    published_at: "2026-09-10",
    category: "WORKPLACE ABSURDITY",
    score: 97,
    summary: "Gusto data reported by Axios found that very small businesses using AI often expanded rather than shrinking their teams. Businesses with fewer than 10 employees that adopted AI grew headcount by about 10% one year later, while AI-using businesses overall grew headcount faster than comparable non-users; the findings come from Gusto customer data and should not be treated as a universal causal estimate.",
    strongest_comment: "Hank: “AI means we need fewer people, right?” The squirrel: “Apparently it can also remove the bottleneck that was keeping us too small to hire them.”",
    lesson: "Automation can change the constraint rather than simply eliminate labor. Measure whether AI expands capacity, demand and output instead of assuming every automated task translates directly into fewer jobs.",
    strongest_post_concept: "The efficiency plan that automates work, grows the business, and ends with a larger hiring plan.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "A Mystery Marmot May Have Drunk Radiator Fluid, Passed Out Under a Car, and Woken Up in San Francisco",
    source_url: "https://www.upi.com/Odd_News/2026/09/10/San-Francisco-mystery-marmot/2781789056914/",
    source_name: "UPI",
    published_at: "2026-09-10",
    category: "OFF-THE-WALL ANIMALS",
    score: 100,
    summary: "A marmot turned up in a backyard in San Francisco's Mission District, far from its normal mountain habitat. Wildlife rescuers say marmots are known to climb into vehicle undercarriages and can be attracted to radiator fluid, so they are investigating whether this animal may have inadvertently ridden into the city from the Sierra or another recent travel destination; that origin remains a hypothesis, not a confirmed itinerary.",
    strongest_comment: "Hank: “How did you get to San Francisco?” The squirrel: “Current theory: bad beverage choice plus unauthorized rideshare.”",
    lesson: "A bizarre outcome can come from a chain of individually simple causes. Follow and verify the chain rather than treating the mystery itself as the explanation.",
    strongest_post_concept: "The wildlife mystery that looks like a road-trip comedy: mountain marmot, radiator-fluid theory, accidental ride, Mission District backyard.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Residents Find a One-Meter Caiman Hiding Under a Parked Car in the Canary Islands",
    source_url: "https://cadenaser.com/canarias/2026/09/11/un-caiman-en-las-palmas-de-gran-canaria-escena-de-pelicula-en-la-isleta-ser-las-palmas/",
    source_name: "Cadena SER",
    published_at: "2026-09-11",
    category: "OFF-THE-WALL ANIMALS",
    score: 99,
    summary: "Residents in La Isleta, Las Palmas de Gran Canaria, discovered a roughly one-meter caiman underneath a parked car. Local police and Spain's SEPRONA wildlife authorities captured the animal safely and are investigating its origin, with an escaped or illegally kept exotic pet among the likely explanations.",
    strongest_comment: "Hank: “What’s under the car?” The squirrel: “Not the catalytic-converter problem you were expecting.”",
    lesson: "The strange local exception can be evidence of a larger system. Solving the immediate animal problem matters, but tracing how it got there can reveal the exotic-pet or trafficking problem behind it.",
    strongest_post_concept: "A routine look under a parked car turns into a one-meter-caiman response plan.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Tasmanian Devils May Have Been Australia’s Prehistoric Camp Garbage Disposal",
    source_url: "https://www.theguardian.com/environment/2026/sep/11/tasmanian-devils-lived-alongside-humans-in-pilbara-for-millennia-juukan-gorge-fossils-reveal",
    source_name: "The Guardian",
    published_at: "2026-09-11",
    category: "SQUIRREL DISTRACTION / WEIRD FACTS",
    score: 100,
    summary: "Fossils from Juukan Gorge in Western Australia's Pilbara show Tasmanian devils lived alongside humans on mainland Australia for thousands of years. Bite marks and digested bone evidence suggest the scavengers may have fed around human camps, leading researchers to consider whether the relationship functioned in part as a natural waste-disposal system before mainland devils disappeared about 3,200 years ago.",
    strongest_comment: "Hank: “How did prehistoric camps handle food scraps?” The squirrel: “Potentially with screaming marsupial sanitation.”",
    lesson: "Odd evidence can reveal a practical relationship hiding inside an ecological one. What looks like scavenging may also have provided a useful service to the people sharing the landscape.",
    strongest_post_concept: "Prehistoric camp operations discovers its oldest outsourced service: waste disposal by Tasmanian devil.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "The Moon May Have Formed Intact in About Five Hours",
    source_url: "https://www.sciencedaily.com/releases/2026/09/260909231729.htm",
    source_name: "ScienceDaily / University of Arizona",
    published_at: "2026-09-10",
    category: "SQUIRREL DISTRACTION / WEIRD FACTS",
    score: 100,
    summary: "New high-resolution simulations of the Moon-forming impact suggest that under some conditions a large, intact moon can emerge in roughly five hours rather than gradually assembling from a long-lived debris disk. The result is a model, not proof of the historical sequence, and comes from simulations that explicitly include material strength and temperature effects often simplified in earlier work.",
    strongest_comment: "Hank: “How long does it take to build a moon?” The squirrel: “Possibly less than one workday. I need the rest of the morning.”",
    lesson: "A neglected assumption can dominate a model. When researchers changed how the colliding material itself behaves, the same broad event produced a radically different timeline.",
    strongest_post_concept: "The universe ships an entire Moon before the end of the workday while Hank is still waiting on one project status update.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "In the Age of Instant Answers, Experts Say Parents Should Let Kids Struggle a Little",
    source_url: "https://apnews.com/article/b760652431b50f08ee7b034994a9ee18",
    source_name: "Associated Press",
    published_at: "2026-09-11",
    category: "PARENTING",
    score: 100,
    summary: "Educators and child-development experts are urging parents not to eliminate every manageable frustration in an era of instant answers, AI and constant adult intervention. Allowing children to handle boredom, small mistakes, schoolwork, basic tasks and age-appropriate decisions can build agency and problem-solving skills when the stakes are low enough for them to recover.",
    strongest_comment: "Hank: “Should I help?” The squirrel: “Maybe wait thirty seconds and see whether the kid invents a solution before we launch the rescue operation.”",
    lesson: "Not every friction point is waste. Some manageable struggle is the practice through which independence, judgment and confidence are built.",
    strongest_post_concept: "Hank reaches for the fix-it button while the squirrel physically blocks him long enough for the kid to solve the problem alone.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "NYC Parents Hope School AI Rules Will End at Least One Screen-Time Argument at Home",
    source_url: "https://www.chalkbeat.org/newyork/2026/09/10/nyc-parents-applaud-back-to-school-ai-screen-time-limits/",
    source_name: "Chalkbeat New York",
    published_at: "2026-09-10",
    category: "PARENTING",
    score: 99,
    summary: "New York City families began the school year under new limits on student-facing generative AI for younger students and restrictions on individual devices in the earliest grades. Parents interviewed by Chalkbeat said the school rules may help reinforce boundaries they are already struggling to maintain around screens and AI at home.",
    strongest_comment: "Hank: “The school banned it.” The squirrel: “Finally, the parent gets to cite policy instead of renegotiating the family treaty every night.”",
    lesson: "Boundaries are easier to sustain when institutions and families send compatible signals. Consistency can remove repeated negotiation work even when the rule itself is simple.",
    strongest_post_concept: "The school policy becomes the exhausted parent’s newest household negotiation tool: ‘It’s not just me — look at the rule.’",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Three-Quarters of Parents Hit a Breakfast Bottleneck Before the School Day Even Starts",
    source_url: "https://mottpoll.org/reports/starting-day-healthy-way",
    source_name: "C.S. Mott Children's Hospital National Poll on Children's Health",
    category: "PARENTING",
    score: 98,
    summary: "A national C.S. Mott Children's Hospital poll found 76% of parents report at least one barrier to getting their child a healthy breakfast on school mornings. Common problems include picky eating, children being slow or grumpy, too little time and screen distraction; about one-third say their child has 15 minutes or less to eat before heading out.",
    strongest_comment: "Hank: “Breakfast is one item.” The squirrel: “Breakfast is food selection, mood management, time compression, screen control and transportation.”",
    lesson: "Morning chaos tends to recur at predictable bottlenecks. Reduce choices, prepare upstream and design the routine around the actual constraint instead of solving the same emergency every day.",
    strongest_post_concept: "Hank writes BREAKFAST as one task; the squirrel expands it into a full morning dependency map before the bus arrives.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "41% of Lawyers Say the Profession Is Bad for Their Mental Health",
    source_url: "https://www.reuters.com/legal/litigation/legal-profession-is-detrimental-mental-health-say-41-lawyers-2026-09-10/",
    source_name: "Reuters",
    published_at: "2026-09-10",
    category: "OVERWHELMED",
    score: 99,
    summary: "A national survey of more than 37,000 lawyers found 41% said working in the legal profession is detrimental to their mental health. The survey also reported substantial rates of depression, anxiety, stress and hazardous drinking, with long hours and high-pressure practice settings among the factors associated with worse outcomes.",
    strongest_comment: "Hank: “Didn’t firms add wellness resources?” The squirrel: “Yes. The workload appears to have retained veto power.”",
    lesson: "Resilience programs cannot permanently compensate for a structural workload problem. Reduce the source of overload as well as offering tools for coping with it.",
    strongest_post_concept: "The wellness toolkit sits on top of a mountain of hours, deadlines and work that nobody removed.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Companies Bought Enough Meeting Tech to Create a New Meeting Problem",
    source_url: "https://www.itpro.com/software/business-apps/clunky-workplace-tech-is-ruining-meetings-and-impacting-productivity",
    source_name: "ITPro",
    published_at: "2026-09-10",
    category: "OVERWHELMED",
    score: 99,
    summary: "A Logitech-sponsored report says more than 70% of IT leaders frequently encounter meeting-room technology problems such as poor audio or dropped connections, while workplace technology decisions remain split across IT, HR and facilities at many organizations. Because the study is vendor-sponsored, the exact prevalence should be treated cautiously, but the fragmented-ownership problem is concrete.",
    strongest_comment: "Hank: “We have a meeting about why the meeting room won’t connect.” The squirrel: “Excellent. The collaboration technology has scheduled itself.”",
    lesson: "Every tool adds coordination cost. Design the end-to-end experience, assign ownership and remove friction before adding another piece of hardware or software to the stack.",
    strongest_post_concept: "A meeting about fixing the technology whose entire purpose was to make meetings easier.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Parents Spend the Equivalent of a Workweek Just Researching Childcare",
    source_url: "https://nypost.com/2026/09/09/lifestyle/parents-say-raising-children-needs-a-wider-support-group-than-it-did-a-generation-ago-new-survey/",
    source_name: "New York Post / Talker Research",
    published_at: "2026-09-09",
    category: "OVERWHELMED",
    score: 98,
    summary: "A Goddard School-commissioned survey of 2,000 U.S. parents of children ages 0 to 6 found parents who use childcare spend about 40 hours researching their options on average, while 71% say raising children today requires a broader support network than previous generations had. Because the research was commissioned by a childcare company, the figures are best treated as illustrative rather than universal.",
    strongest_comment: "Hank: “Childcare is one decision.” The squirrel: “Forty hours of vendor selection says it has become a procurement project.”",
    lesson: "Family logistics become overwhelming when every household has to rebuild the same research process from scratch. Trusted shortlists, shared knowledge and clearer decision criteria can remove duplicated life-admin work.",
    strongest_post_concept: "The family calendar turns into an enterprise procurement dashboard because choosing childcare consumed a full workweek of research.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "He Was Looking for Fish Fossils and Found a Feather Inside Dinosaur Poop",
    source_url: "https://www.washington.edu/news/2026/09/10/fossil-feathers-preserved-inside-dinosaur-poop-could-help-explain-why-some-birds-survived-the-dinosaur-mass-extinction/",
    source_name: "University of Washington",
    published_at: "2026-09-10",
    category: "RABBIT HOLES WITH A GOOD END",
    score: 100,
    summary: "Paleontologist David DeMar was crawling across a Montana outcrop collecting fish fossils when he picked up a small reddish nodule and saw a tiny feather through a hand lens. The object was fossilized feces; CT scans revealed additional feathers, bones and scales inside, providing exceptionally preserved evidence of what a Cretaceous predator ate and opening a new path for studying fossil feathers inside coprolites.",
    strongest_comment: "Hank: “Did you find the fish fossils?” The squirrel: “Better. Dinosaur poop with ancient bird feathers. The original task has been reassigned.”",
    lesson: "A rabbit hole earns its keep when the anomaly is specific enough to test and rich enough to open a new method of inquiry. The detour became a research program, not merely a curiosity.",
    strongest_post_concept: "A fish-fossil search gets derailed by one weird pebble that turns out to be dinosaur poop containing pristine ancient feathers.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "A Rockfall Into a Sheep Field Exposed a 560-Million-Year-Old 3D Animal",
    source_url: "https://www.cam.ac.uk/research/news/one-of-the-oldest-known-3d-animal-fossils-found-in-norwegian-sheep-field",
    source_name: "University of Cambridge",
    published_at: "2026-09-09",
    category: "RABBIT HOLES WITH A GOOD END",
    score: 100,
    summary: "Researchers identified an exceptionally preserved three-dimensional fossil of Charnia, one of the oldest known complex organisms, at a new Ediacaran site in Norway. The fossil-bearing rocks became accessible after material fell into a sheep field, and the unusual 3D preservation is giving scientists a clearer view of an organism normally known as flattened impressions.",
    strongest_comment: "Hank: “What started the discovery?” The squirrel: “A cliff dropped 560-million-year-old evidence into a sheep field.”",
    lesson: "Chance creates value only when someone recognizes what the changed conditions have exposed. Productive curiosity means being ready to inspect new evidence that the original plan never expected to see.",
    strongest_post_concept: "A farm gets an accidental 560-million-year-old delivery when a rockfall turns a sheep field into a paleontology site.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "A Volunteer Followed a Tiny Hobby Into 143 Sites and Found a New Species of Tardigrade",
    source_url: "https://rmsc.org/press/2026-new-tardigrade-species/",
    source_name: "Rochester Museum & Science Center",
    published_at: "2026-08-27",
    category: "RABBIT HOLES WITH A GOOD END",
    score: 100,
    summary: "Citizen scientist Judy Dobles helped survey tardigrades across 143 sites at the Rochester Museum & Science Center's Cumming Nature Center and discovered a species new to science, Mesocrista ojagwaji. Her path grew from years of volunteer naturalist work into increasingly specialized microscopy and sampling; the broader project substantially expanded the number of formally recognized tardigrade species known from New York.",
    strongest_comment: "Hank: “This started as citizen science?” The squirrel: “Yes. Then the hobby acquired a microscope, 143 sampling sites and a species name.”",
    lesson: "Sustained curiosity compounds. A side interest becomes expertise when observations are repeated, documented and connected with a community capable of validating what was found.",
    strongest_post_concept: "The hobby that keeps gaining scope until the volunteer is holding a microscope and a newly named species.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  }
];

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return Response.json({ error: "Missing Supabase server configuration" }, { status: 503 });

  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.rpc("ingest_hank_news_updates", { p_user_id: userId, p_stories: stories });
  if (error) return Response.json({ error: error.message, details: error.details, hint: error.hint, code: error.code }, { status: 500 });

  const urls = stories.map((story) => story.source_url);
  const { data: sourceRows, error: sourceError } = await supabase
    .from("sources")
    .select("id,canonical_url,title")
    .eq("owner_id", userId)
    .in("canonical_url", urls);

  const sourceIds = (sourceRows ?? []).map((row) => row.id);
  const { data: links, error: linkError } = sourceIds.length
    ? await supabase.from("content_sources").select("source_id,content_item_id").eq("owner_id", userId).in("source_id", sourceIds)
    : { data: [], error: null };

  const itemIds = Array.from(new Set((links ?? []).map((row) => row.content_item_id)));
  const { data: items, error: itemError } = itemIds.length
    ? await supabase.from("content_items").select("id,identifier,title,status,content_type,panel_count,score").eq("owner_id", userId).in("id", itemIds)
    : { data: [], error: null };

  const sourceById = new Map((sourceRows ?? []).map((row) => [row.id, row]));
  const itemById = new Map((items ?? []).map((row) => [row.id, row]));
  const verification = (links ?? []).map((link) => ({ source: sourceById.get(link.source_id) ?? null, item: itemById.get(link.content_item_id) ?? null }));
  const foundUrls = new Set((sourceRows ?? []).map((row) => row.canonical_url));
  const missingSourceUrls = urls.filter((storyUrl) => !foundUrls.has(storyUrl));

  return Response.json({
    count: Array.isArray(data) ? data.length : null,
    data,
    verification: {
      sourcesFound: sourceRows?.length ?? 0,
      linkedItemsFound: verification.length,
      missingSourceUrls,
      rows: verification,
      errors: {
        sources: sourceError?.message ?? null,
        links: linkError?.message ?? null,
        items: itemError?.message ?? null
      }
    }
  });
}
