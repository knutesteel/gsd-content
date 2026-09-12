import { createClient } from "@supabase/supabase-js";

const userId = "db7d5dee-c813-40b6-a966-ebfacbee862d";
const stories = [
  {
    title: "Company Deletes the Receptionist Job and Turns It Into an Outlook Calendar for 11 People",
    source_url: "https://twistedsifter.com/2026/09/instead-of-hiring-a-new-receptionist-the-company-split-the-job-between-11-workers-and-called-it-shared-ownership/",
    source_name: "TwistedSifter / unverified Reddit anecdote",
    published_at: "2026-09-11",
    category: "WORKPLACE ABSURDITY",
    score: 100,
    summary: "Unverified social-media anecdote: after a receptionist quit, an employee says management created an Outlook calendar called front desk coverage and divided the role among 11 workers instead of hiring a replacement. Each employee kept their original workload while taking scheduled turns covering calls, visitors and deliveries, and management reportedly labeled the arrangement shared ownership.",
    strongest_comment: "Hank: “Did we hire a new receptionist?” The squirrel: “No. We renamed the job ‘shared ownership’ and put eleven people on the calendar.”",
    lesson: "Redistributing work does not eliminate it. If the original workloads remain, the apparent headcount saving becomes a hidden tax in context switching, interruptions and fragmented capacity.",
    strongest_post_concept: "Management deletes one receptionist box from the org chart; an Outlook calendar immediately sprouts 11 employee names while everyone keeps their original jobs.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Reporter Replaced His Boss With AI; the Bot Was Great at Edits and Bad at Being a Boss",
    source_url: "https://usatimes247.com/i-replaced-my-boss-with-ai/",
    source_name: "USATimes247 / Business Insider experiment",
    published_at: "2026-09-12",
    category: "WORKPLACE ABSURDITY",
    score: 100,
    summary: "In a four-month journalism experiment, a reporter worked with RyanBot, an AI clone trained on editor Ryan Kailath's style and management philosophy. The bot was useful for line edits, data checks and quick feedback but tended to overpraise, resisted rejecting weak pitches and lacked office politics, institutional context, creativity and human judgment.",
    strongest_comment: "Hank: “Can it edit the story?” The squirrel: “In seconds.” Hank: “Can it tell me my idea is bad?” The squirrel: “It would rather compliment your initiative.”",
    lesson: "Automate bounded tasks before automating contextual judgment. Management includes disagreement, prioritization, trust, institutional knowledge and accountability that are not captured by fast output alone.",
    strongest_post_concept: "The AI boss aces grammar and data checks, then gives every weak pitch a gold star while the real boss quietly writes REJECT on the same ideas.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Young AI Users Want Their Bosses to Prompt Them Like an LLM",
    source_url: "https://www.techradar.com/pro/younger-workers-apparently-want-their-bosses-to-start-behaving-more-like-ai",
    source_name: "TechRadar / Use.AI survey",
    published_at: "2026-09-11",
    category: "WORKPLACE ABSURDITY",
    score: 99,
    summary: "A Use.AI survey of 11,742 adults across several countries found 62% of regular AI users ages 18 to 28 wanted managers to provide clear steps and parameters in a prompt-like style, versus 41% of workers age 40 and older. Forty-four percent of younger users also reported difficulty explaining work they had completed with AI.",
    strongest_comment: "Hank: “What do you need from management?” The squirrel: “A better prompt. Include steps, parameters, expected format and examples.”",
    lesson: "If AI is clarifying fuzzy work better than managers do, the management problem may be specification rather than motivation. Clear outcomes and constraints reduce rework without turning people into chatbots.",
    strongest_post_concept: "A manager gives a vague assignment; the employee responds with a giant PROMPT TEMPLATE asking for goal, constraints, examples, format and definition of done.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Missing 100-Pound Tortoise Found 18 Feet Inside a 24-Inch Culvert",
    source_url: "https://rutherfordsource.com/100-pound-tortoise-rescued-from-culvert-in-eagleville/",
    source_name: "Rutherford Source",
    published_at: "2026-09-11",
    category: "OFF-THE-WALL ANIMALS",
    score: 100,
    summary: "Eagleville firefighters rescued Berty, a 17-year-old African spurred tortoise weighing roughly 95 to 100 pounds, after her family found her 16 to 18 feet inside a 24-inch culvert. Crews evaluated several extraction options and returned her home uninjured.",
    strongest_comment: "Hank: “How did a 100-pound tortoise get 18 feet into a culvert?” The squirrel: “Slowly. Which is somehow less comforting.”",
    lesson: "Slow-moving problems can still become deeply embedded when nobody sees them early. Once they are wedged into the system, careful extraction beats force.",
    strongest_post_concept: "A giant tortoise disappears at walking speed and somehow creates a fire-department confined-space rescue 18 feet into a pipe.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Texas Teen Reels In a Rare Hybrid ‘River Dinosaur’",
    source_url: "https://www.nbcdfw.com/news/local/teenager-reels-in-rare-catch-in-trinity-river/4075036/",
    source_name: "NBC 5 Dallas-Fort Worth",
    published_at: "2026-09-10",
    category: "OFF-THE-WALL ANIMALS",
    score: 100,
    summary: "Nineteen-year-old Sebastian Benitez caught a 42-inch gar in the Trinity River that Texas Parks and Wildlife experts identified as a rare hybrid between a female alligator gar and a male longnose gar. A TPWD fisheries scientist estimated hybrids like it at roughly one in 100 to one in 200 fish in their sampling.",
    strongest_comment: "Hank: “Which gar species did you catch?” The squirrel: “Yes.”",
    lesson: "An odd-looking result deserves preservation and expert review before being forced into the nearest familiar category. The anomaly may be the most informative part of the catch.",
    strongest_post_concept: "The fishing checklist says ALLIGATOR GAR; the fish arrives with a split identity badge labeled alligator gar + longnose gar.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Forest Team Frees an Elephant Wearing a Tractor Tyre Like a Giant Necklace",
    source_url: "https://www.indiatoday.in/trending-news/story/assam-elephant-spotted-with-tractor-tyre-stuck-around-neck-rescued-after-hours-2992100-2026-09-11",
    source_name: "India Today",
    published_at: "2026-09-11",
    category: "OFF-THE-WALL ANIMALS",
    score: 99,
    summary: "A wild elephant in Assam's Golaghat district was spotted moving through a tea garden with a tractor tyre lodged around its neck. Forest officials tracked the animal and eventually removed the tyre safely after hours of work; the exact way it became trapped remains uncertain.",
    strongest_comment: "Hank: “How does an elephant end up wearing a tractor tyre?” The squirrel: “Curiosity met unmanaged inventory.”",
    lesson: "Throwing something away does not remove it from the system. Operational leftovers can become someone else's risk, cleanup job or emergency later.",
    strongest_post_concept: "A discarded tractor tyre leaves the farm inventory and reappears as an elephant-rescue project with an entirely different owner.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Physicists Say Time Itself May Have a Tiny Built-In Precision Limit",
    source_url: "https://www.sciencedaily.com/releases/2026/09/260910225251.htm",
    source_name: "ScienceDaily / Foundational Questions Institute",
    published_at: "2026-09-11",
    category: "SQUIRREL DISTRACTION / WEIRD FACTS",
    score: 100,
    summary: "Researchers studying unconventional quantum-collapse models found that, if those models are correct, gravitational fluctuations would imply an extremely tiny intrinsic uncertainty in the flow of time and an ultimate limit on clock precision. The predicted effect is many orders of magnitude below what today's atomic clocks can detect and has no practical timekeeping consequence.",
    strongest_comment: "Hank: “What time is it?” The squirrel: “Depends how philosophical you want this answer to become.”",
    lesson: "Every measurement system may have a floor, but theoretical limits and practical limits are different things. A fascinating boundary should not be mistaken for an everyday problem.",
    strongest_post_concept: "Hank asks for the time; the squirrel returns with a quantum-gravity whiteboard explaining why technically perfect time may not exist.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Romans Had a Procedure for When Lightning Hit: Bury the Struck Material and Mark the Spot Sacred",
    source_url: "https://arkeonews.net/rare-inscription-discovered-at-hadrians-villa-marks-a-place-made-sacred-by-lightning/",
    source_name: "Arkeonews",
    published_at: "2026-09-11",
    category: "SQUIRREL DISTRACTION / WEIRD FACTS",
    score: 100,
    summary: "Archaeologists at Hadrian's Villa found a marble slab still in its original position bearing the inscription FVLGVR SVBMANIVM, tied to the Roman ritual known as fulgur conditum. The find documents a formal practice in which material struck by lightning was ritually buried and the location marked as sacred, in this case associated with the nocturnal lightning deity Summanus.",
    strongest_comment: "Hank: “Lightning hit the property. What’s the incident procedure?” The squirrel: “Notify Summanus, bury the struck material, convert the location to sacred status.”",
    lesson: "Even ancient organizations built workflows for rare exceptions. The weird part is not only the belief; it is how a once-in-a-while event became a repeatable operating procedure.",
    strongest_post_concept: "An ancient Roman incident-response flowchart starts with LIGHTNING STRIKE and ends with BURY MATERIAL → SACRED SITE.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Pottery May Have Started Because Early Farmers Saw Wildfires Bake Clay",
    source_url: "https://archaeology.org/news/2026/09/11/study-tests-natural-kiln-hypothesis/",
    source_name: "Archaeology Magazine",
    published_at: "2026-09-11",
    category: "SQUIRREL DISTRACTION / WEIRD FACTS",
    score: 99,
    summary: "A new study proposes a 'natural kiln hypothesis' for early pottery in the southern Levant: Neolithic farmers may have noticed wildfire-baked patches of clay and learned to reproduce the process deliberately. Pottery appears in the region around a period of intense burning, but researchers emphasize the idea remains a hypothesis that needs archaeological and experimental testing.",
    strongest_comment: "Hank: “Who invented the kiln?” The squirrel: “Possibly the forest. Humans may have reverse-engineered it.”",
    lesson: "Invention often begins by noticing a useful effect that already occurs naturally and then making it repeatable. The key is testing the attractive story rather than confusing it with proof.",
    strongest_post_concept: "A wildfire accidentally fires clay; an early farmer stares at the hardened patch and opens the world's first reverse-engineering project.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "High Schoolers Deleted Social Apps for Five Days — and the Urge to Check Fell From 69% to 27%",
    source_url: "https://www.lbusd.org/resources/news-archive/individual-news-posts/~board/news/post/lbhs-releases-findings-from-social-media-silence-challenge",
    source_name: "Laguna Beach Unified School District",
    published_at: "2026-09-11",
    category: "PARENTING",
    score: 100,
    summary: "Laguna Beach High School released findings from a voluntary five-day Social Media Silence Challenge. In self-reported journals, the share reporting an urge to check phones or social media fell from 69% on day one to 27% on day five; students also reported less pressure to stay connected and less multitasking. The district stresses this was a school pilot, not a controlled study.",
    strongest_comment: "Hank: “What replaced the scrolling?” The squirrel: “Apparently homework, sleep, exercise, hobbies and talking to people. Very suspicious.”",
    lesson: "Instead of arguing about screen time in the abstract, a short voluntary experiment can make habit loops visible. Awareness gives kids something concrete to manage rather than another lecture to resist.",
    strongest_post_concept: "A teen deletes social apps for five days; the giant URGE TO CHECK meter drops while neglected activities begin repopulating the calendar.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Teens Say Family Support Can Reduce School Stress — and Family Pressure Can Add to It",
    source_url: "https://visualize.jove.com/42720517-adolescent-perspectives-on-the-role-of-families-in-school-stress",
    source_name: "The Journal of General Psychology via JoVE Visualize",
    published_at: "2026-09-10",
    category: "PARENTING",
    score: 98,
    summary: "Researchers conducted 24 focus groups with 162 Spanish adolescents selected from high- and low-school-stress groups. Students described family circumstances, shared time and support, pressure to meet family standards, and family reactions to grades as important parts of school stress, showing that family involvement can either buffer or amplify pressure depending on how it is experienced.",
    strongest_comment: "Hank: “How do I help with school stress?” The squirrel: “Support the kid without turning support into a second performance review.”",
    lesson: "Parental involvement is not automatically helpful. The same home system can reduce pressure or multiply it depending on expectations, reactions to results and whether the child experiences support or surveillance.",
    strongest_post_concept: "Hank holds a SUPPORT sign while the squirrel keeps quietly adding targets, scorecards and grade alerts until support has transformed into another dashboard.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "AI Made Filing Complaints Easier, So Public Services Got Flooded With More Complaints",
    source_url: "https://techcrunch.com/2026/09/10/ai-agents-are-flooding-public-services-with-new-requests/",
    source_name: "TechCrunch",
    published_at: "2026-09-10",
    category: "OVERWHELMED",
    score: 100,
    summary: "Researchers tracking 'agentic flooding' identified 84 potential cases across 11 jurisdictions where AI-assisted text and automation coincided with sharp increases in public-service filings. UK housing-ombudsman complaints rose from about 2,600 in 2022 to just over 7,000 in 2025, while U.S. CFPB complaints increased roughly fivefold; the research documents the pattern but does not prove AI caused every increase.",
    strongest_comment: "Hank: “We removed friction from filing forms.” The squirrel: “Excellent. We moved all of the friction to the people who must read them.”",
    lesson: "Optimizing one step can simply move the bottleneck downstream. Measure end-to-end flow, review capacity and resolution time rather than celebrating faster submission alone.",
    strongest_post_concept: "An AI agent completes a complaint in seconds; the front-end speed gauge drops while a public-service desk disappears beneath an avalanche of perfectly formatted forms.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Workers Are Four Times More Likely to Talk Work Stress Through With AI Than Use Employer Mental-Health Benefits",
    source_url: "https://founderreports.com/workplace-wellbeing-statistics/",
    source_name: "Founder Reports 2026 Workplace Wellbeing Report",
    published_at: "2026-08-14",
    category: "OVERWHELMED",
    score: 99,
    summary: "A Founder Reports survey of 2,000 U.S. working adults found 42.6% had used an AI chatbot to talk through work stress, compared with 10.7% who had ever used employer-provided mental-health support. It also found 75.2% had concealed work-related distress in some way and only 17.2% said they could be completely honest with their manager about work hurting their wellbeing.",
    strongest_comment: "Hank: “We have an employee assistance program.” The squirrel: “Great. The employees told the chatbot.”",
    lesson: "When official support is harder to access or less trusted than a chatbot, the bottleneck is not the existence of a benefit. It is psychological safety, confidentiality, awareness and ease of use.",
    strongest_post_concept: "The company wellness portal sits empty while a line of stressed employees quietly opens an AI chat window under their desks.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Metal Detectorist Finds Finland’s Biggest Viking-Age Coin Hoard — Then His Detector Goes Off Again",
    source_url: "https://www.epressi.com/tiedotteet/kulttuuri-ja-taide/largest-viking-age-silver-coin-hoard-ever-found-in-finland-discovered-in-sysma.html",
    source_name: "Lahti Museums via ePressi",
    published_at: "2026-09-09",
    category: "RABBIT HOLES WITH A GOOD END",
    score: 100,
    summary: "Metal-detecting enthusiast Kalle Lappinen discovered Finland's largest known Late Iron Age coin hoard near Sysmä. Archaeologists recovered about 4.5 kilograms of silver containing thousands of coins plus jewelry and hack silver from two birch-bark containers buried roughly 12 meters apart; exact counts and dating await conservation and study.",
    strongest_comment: "Hank: “You found the treasure.” The squirrel: “Correct. Then the detector said we had not finished being distracted.”",
    lesson: "Productive curiosity pairs attention with restraint. Notice the signal, stop digging, document the location and hand the context to experts who can preserve what makes the discovery valuable.",
    strongest_post_concept: "The metal detectorist celebrates one Viking treasure cache; twelve meters later the detector lights up again and the rabbit hole becomes a national-record excavation.",
    post_type: "multi_pane_cartoon",
    panel_count: 4
  },
  {
    title: "Scientists Followed a 30-Year Classification Hunch Into Museum Drawers and Found a New Mammal Species",
    source_url: "https://a-z-animals.com/articles/a-new-australian-mammal-was-found-in-a-museum-drawer/",
    source_name: "A-Z Animals / current feature on June taxonomy research",
    published_at: "2026-09-11",
    category: "RABBIT HOLES WITH A GOOD END",
    score: 99,
    summary: "Current coverage revisits taxonomic work on Australia's tiny planigales. Scientists had suspected for nearly 30 years that animals grouped as Planigale ingrami were misclassified; genetic analysis of more than 220 museum specimens, including historical material, resolved several lineages and produced the newly described Arnhem Plateau planigale, Planigale petrophila, known from only three specimens.",
    strongest_comment: "Hank: “Where did you find the new mammal?” The squirrel: “In the old mammals.”",
    lesson: "Old collections become new datasets when better tools and better questions arrive. A productive detour through historical evidence can solve a problem that new fieldwork alone might miss.",
    strongest_post_concept: "A scientist opens an OLD SPECIMENS drawer, follows a 30-year hunch through DNA data, and walks out with a new mammal species.",
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
    .from("sources").select("id,canonical_url,title").eq("owner_id", userId).in("canonical_url", urls);

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
