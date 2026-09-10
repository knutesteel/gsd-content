import { createClient } from "@supabase/supabase-js";

const stories = [
  {
    "title": "Oklahoma Judge Used ChatGPT for Research, Then His Ruling Cited Two Cases That Do Not Exist",
    "source_url": "https://www.reuters.com/legal/litigation/oklahoma-judge-used-ai-in-ruling-that-contained-false-citations-prosecutor-says-2026-09-09/",
    "source_name": "Reuters",
    "published_at": "2026-09-09",
    "category": "WORKPLACE ABSURDITY",
    "score": 100,
    "summary": "Oklahoma District Court Judge Lawrence Wheeler acknowledged using ChatGPT for legal research, and an order he drafted contained two citations to cases that do not exist, according to a prosecutor’s letter reviewed by Reuters. The state attorney general said the evidence was insufficient for criminal prosecution, though judicial discipline remains a separate question.",
    "strongest_comment": "Hank: “The AI helped research the law.” The squirrel: “Excellent. It also invented two laws-adjacent things called cases.”",
    "lesson": "AI can accelerate professional research, but accountability stays with the human whose name is on the decision. Verification is part of the work, not an optional cleanup step after automation.",
    "strongest_post_concept": "The AI-assisted court ruling where the legal research got faster and two nonexistent cases arrived with it.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "Wipro Says AI Freed Capacity Equal to 20,000 Workers — and Reassigned the People",
    "source_url": "https://www.reuters.com/world/india/wipros-ai-push-frees-capacity-equivalent-20000-workers-cto-says-2026-09-10/",
    "source_name": "Reuters",
    "published_at": "2026-09-10",
    "category": "WORKPLACE ABSURDITY",
    "score": 99,
    "summary": "Wipro says its AI push has generated productivity gains equivalent to the output of about 20,000 workers. CTO Sandhya Arun said those employees were reassigned rather than laid off, while more than 100,000 staff have been trained in advanced AI skills and the company is shifting its emphasis from raw productivity to business outcomes.",
    "strongest_comment": "Hank: “AI freed twenty thousand workers’ worth of capacity.” The squirrel: “Great. What did we decide to do with twenty thousand workers’ worth of capacity?”",
    "lesson": "Efficiency is unfinished until the organization decides where the freed capacity goes. The useful metric is not hours saved but what better result those hours produce.",
    "strongest_post_concept": "The productivity dashboard hits +20,000 workers of capacity, followed immediately by the harder question: now what?",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "Accenture and Google Cloud Are Deploying 1,000 Humans to Help Companies Scale AI Agents",
    "source_url": "https://newsroom.accenture.com/news/2026/accenture-and-google-cloud-deepen-partnership-with-formation-of-new-accenture-gemini-enterprise-business-group",
    "source_name": "Accenture",
    "published_at": "2026-09-08",
    "category": "WORKPLACE ABSURDITY",
    "score": 99,
    "summary": "Accenture and Google Cloud announced a new Gemini Enterprise business group that will establish a 1,000-person forward-deployed engineering workforce to help enterprises turn agentic AI investments into measurable business value. The announcement highlights the amount of human integration work still required to make autonomous systems useful inside real organizations.",
    "strongest_comment": "Hank: “The AI agents are supposed to do the work.” The squirrel: “Correct. We hired a thousand humans to help the AI agents do the work.”",
    "lesson": "Automation does not eliminate integration. Count the humans required to configure, connect, govern and maintain an AI system when calculating how much work it actually removes.",
    "strongest_post_concept": "The thousand-person human team whose job is helping enterprise AI agents become autonomous.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "Squirrel Gets Trapped in Sold-Out Ohio Stadium; Fans Offer Pretzels Until Police Arrive",
    "source_url": "https://weather.com/2026/09/08/nature-wild-animals/squirrel-rescued-after-getting-trapped-inside-ohio-stadium-during-buckeyes-game",
    "source_name": "The Weather Channel",
    "published_at": "2026-09-08",
    "category": "OFF-THE-WALL ANIMALS",
    "score": 100,
    "summary": "A frightened squirrel became trapped among the bleachers during Ohio State’s sold-out football opener against Ball State. Fans offered pretzels while police responded; an officer captured the squirrel in a cardboard box and released it outside the stadium.",
    "strongest_comment": "Hank: “You got distracted and ended up inside a sold-out football stadium?” The squirrel: “Yes, but there were pretzels and law enforcement provided transportation home.”",
    "lesson": "Not every interruption deserves a complicated system. Sometimes the right response is calm the problem, contain it, and get everyone back to what they were doing.",
    "strongest_post_concept": "The squirrel literally wins the daily squirrel slot by turning a football game into a police-assisted pretzel rescue.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "Puppy Rescue Under a Sidewalk Reveals a Bigger Problem: the Sidewalk Itself Could Collapse",
    "source_url": "https://www.conroenews.org/news/firefighters-rescue-two-puppies-trapped-under-a-sidewalk",
    "source_name": "Conroe News / Click2Houston",
    "published_at": "2026-09-09",
    "category": "OFF-THE-WALL ANIMALS",
    "score": 100,
    "summary": "Firefighters near a Texas elementary school responded to a puppy trapped under a sidewalk, freed one animal, then dug for nearly two hours to reach another. During the rescue they discovered a large void beneath the walkway that could pose a collapse hazard, prompting notification for repairs.",
    "strongest_comment": "Hank: “We came for the puppy.” The squirrel: “Good news: puppy rescued. Also, the sidewalk is apparently hollow.”",
    "lesson": "A useful interruption can expose a larger underlying problem. Fix the root condition you discover instead of closing the ticket the moment the visible symptom is gone.",
    "strongest_post_concept": "The puppy rescue that accidentally became an infrastructure inspection and found the more important problem.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "Eight Baby Swans Were Stranded on a Road, So Rescuers Carried Them Away in IKEA Bags",
    "source_url": "https://people.com/8-baby-swans-rescued-from-road-and-carried-to-safety-in-ikea-bags-12111740",
    "source_name": "People",
    "published_at": "2026-09-09",
    "category": "OFF-THE-WALL ANIMALS",
    "score": 99,
    "summary": "Eight cygnets found stranded on a road in Somerset were secured by wildlife rescuers and police after their parents could not be located. Rescuers used IKEA’s large blue bags to carry the birds safely to an animal ambulance; seven healthy cygnets were later returned to the wild.",
    "strongest_comment": "Hank: “What’s the official swan-transport equipment?” The squirrel: “Apparently aisle one, next to flat-pack furniture.”",
    "lesson": "Good execution often means using the simple tool already available rather than waiting for the perfect specialized one. Fit-for-purpose beats fancy.",
    "strongest_post_concept": "The wildlife-rescue gear nobody put on the procurement list: eight swans, several IKEA bags, problem solved.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "Scientists Identify the ‘Chunkiest’ Jurassic Squid-Like Animal Ever Found",
    "source_url": "https://www.eurekalert.org/news-releases/1143290",
    "source_name": "EurekAlert / University of Manchester",
    "published_at": "2026-09-09",
    "category": "SQUIRREL DISTRACTION / WEIRD FACTS",
    "score": 100,
    "summary": "Researchers described Wyoteuthis linsterorum, a 160-million-year-old belemnite from Wyoming with an unusually thick, barrel-shaped internal skeleton. The team calls it the ‘chunkiest’ or ‘fattest’ known belemnite; one of the two key fossils had sat unstudied for years.",
    "strongest_comment": "Hank: “What did you learn?” The squirrel: “Jurassic Wyoming had the chunkiest squid cousin science has ever seen. I will not be taking further questions about productivity.”",
    "lesson": "Specific, surprising facts are powerful because they make complex science instantly legible. A weird physical trait can also be the clue that an old specimen deserves a second look.",
    "strongest_post_concept": "A museum drawer finally produces science’s official champion for chunkiest Jurassic squid cousin.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "25,000-Year-Old Teeth Suggest Humans Have Been Getting Buzzed Far Longer Than We Knew",
    "source_url": "https://www.abc.net.au/news/science/2026-09-10/earliest-evidence-of-human-drug-use-discovered-in-indonesia/107130656",
    "source_name": "ABC News Australia",
    "published_at": "2026-09-10",
    "category": "SQUIRREL DISTRACTION / WEIRD FACTS",
    "score": 100,
    "summary": "Researchers studying prehistoric remains from Sulawesi found unusual tooth grooves plus traces of arecoline, the psychoactive compound in betel nut. One individual dates to between 16,000 and 25,000 years ago, potentially making this the oldest known direct evidence of habitual psychoactive plant use.",
    "strongest_comment": "Hank: “Humans were using mind-altering plants twenty-five thousand years ago?” The squirrel: “And apparently damaging their teeth with the cure for the tooth pain caused by the habit. We have always been us.”",
    "lesson": "Human behavior changes less than our tools do. The especially useful twist is the feedback loop: a short-term relief habit may have worsened the problem that encouraged more of the habit.",
    "strongest_post_concept": "The 25,000-year-old habit loop: use the nut for tooth pain, damage the teeth, then use more nut for the new tooth pain.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "Archaeologists Open a Roman-Era Cemetery and Find a 5,000-Year-Old Man Buried With Two Human Skulls and 42 Teeth",
    "source_url": "https://archaeology.org/news/2026/09/09/another-unusual-burial-found-at-ancient-polish-cemetery/",
    "source_name": "Archaeology Magazine",
    "published_at": "2026-09-09",
    "category": "SQUIRREL DISTRACTION / WEIRD FACTS",
    "score": 100,
    "summary": "Excavators at a Roman-era cemetery near Wrocław, Poland, uncovered a much older Neolithic burial dating to about 2900 B.C. The man was buried with two human skulls, amber beads, a flint blade, a serpentinite battle axe and a necklace made from 42 drilled teeth from large mammals; researchers are still studying the identities and relationships involved.",
    "strongest_comment": "Hank: “We’re excavating a Roman cemetery.” The squirrel: “Not anymore. We have a five-thousand-year-old guy, two extra skulls and a 42-tooth necklace.”",
    "lesson": "The real story can sit underneath the category you started with. When evidence breaks the expected timeline, protect the anomaly and let it redirect the investigation.",
    "strongest_post_concept": "The archaeological dig where the timeline suddenly jumps backward thousands of years and the inventory gets much stranger.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "Kids Tell Ireland a Social-Media Ban Won’t Work Because Kids Will Find a Way Around It",
    "source_url": "https://www.cnam.ie/online-safety-childrens-digital-lives-research-report-published/",
    "source_name": "Coimisiún na Meán",
    "published_at": "2026-09-10",
    "category": "PARENTING",
    "score": 100,
    "summary": "New Irish research on children’s digital lives found most children favor being taught how to stay safe online over a social-media ban. A majority also said a ban would not work because children would find ways around it; many parents similarly doubted that a ban alone would be effective.",
    "strongest_comment": "Hank: “We’ll solve social media by banning it.” The squirrel, playing the kid: “Great. Would you like me to explain the workaround now or after dinner?”",
    "lesson": "A rule that ignores predictable circumvention is incomplete. Teach judgment and design the environment around real behavior instead of assuming the announcement changes the behavior.",
    "strongest_post_concept": "Adults propose the ban; the kids immediately add ‘circumvention’ to the implementation plan.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "120 West Virginia Students Built About 80 Apps Instead of Just Learning About AI",
    "source_url": "https://www.rockefellerfoundation.org/news/thunkable-education-pilot-west-virginia-students-builds-future-ready-ai-entrepreneurship-app-development-skills/",
    "source_name": "The Rockefeller Foundation / Thunkable",
    "published_at": "2026-09-10",
    "category": "PARENTING",
    "score": 98,
    "summary": "A Thunkable education pilot supported by The Rockefeller Foundation engaged about 120 high-school students across four West Virginia schools and produced roughly 80 final mobile apps aimed at problems in their schools and communities. About half entered with little or no familiarity with AI concepts, according to the program announcement.",
    "strongest_comment": "Hank: “Should kids be using AI?” The squirrel: “These kids stopped debating the question long enough to build eighty apps.”",
    "lesson": "The quality of screen time changes when children move from passive consumption to building something useful. Creation gives technology a purpose, constraints and a real outcome to evaluate.",
    "strongest_post_concept": "The screen-time debate changes completely when the students are the ones shipping the software.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "Korn Ferry Says AI Is Increasing Workload for More Than Half of ‘AI-Weary’ Workers",
    "source_url": "https://www.kornferry.com/about-us/press/korn-ferry-workforce-2026-report-unlocking-growth-requires-rethinking-how-work-gets-done",
    "source_name": "Korn Ferry",
    "published_at": "2026-09-08",
    "category": "OVERWHELMED",
    "score": 100,
    "summary": "Korn Ferry’s Workforce 2026 report says 62% of employees report significantly heavier workloads than two years ago, 45% are too busy to deliver meaningful growth results, and 52% of workers it describes as AI-weary say AI has increased their workload. Sixty-one percent say they are doing responsibilities from more than one role.",
    "strongest_comment": "Hank: “AI was supposed to take work off the list.” The squirrel: “It did. Then it became another item on the list.”",
    "lesson": "A productivity tool that requires ongoing prompting, checking and management can become a second job. Remove old work when adding new operating models instead of stacking transformation on top of full capacity.",
    "strongest_post_concept": "The AI productivity tool arrives with its own workload, while the employee is already doing more than one job.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "Gallup Finds the Workers Using AI Most Often Are More Afraid It Will Eliminate Their Jobs",
    "source_url": "https://www.gallup.com/workplace/713231/ai-not-reassure-workers-managers-do.aspx",
    "source_name": "Gallup",
    "published_at": "2026-09-09",
    "category": "OVERWHELMED",
    "score": 99,
    "summary": "Gallup reports that workers using AI daily or several times a week are more than twice as likely to fear job elimination within five years as infrequent users. The longitudinal analysis also finds that supportive management and clearer organizational context materially reduce that anxiety.",
    "strongest_comment": "Hank: “Using AI every day should make you more comfortable with it.” The squirrel: “It does. I’m now extremely comfortable watching it learn my job.”",
    "lesson": "Every new productivity tool can create a second mental workload when people do not know what it means for their role. Clear expectations and credible management communication reduce uncertainty better than another generic AI message.",
    "strongest_post_concept": "The more often employees use the productivity tool, the more often it reminds them to wonder whether they are training their replacement.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "Scientist Looking for Frog Habitat Spots an Odd Rock — It’s a Mastodon Tooth",
    "source_url": "https://www.sfgate.com/bayarea/article/ice-age-tooth-22424677.php",
    "source_name": "SFGATE",
    "published_at": "2026-09-09",
    "category": "RABBIT HOLES WITH A GOOD END",
    "score": 100,
    "summary": "Geomorphologist Brigid Lynch was surveying a San Mateo County creek for a habitat-enhancement project supporting threatened California red-legged frogs when she noticed an oddly shaped rock. Paleontologists confirmed it was an exceptionally complete adult Pacific mastodon molar, now donated to Stanford for further study.",
    "strongest_comment": "Hank: “Did you finish the frog survey?” The squirrel: “We found an Ice Age mastodon tooth. The frog project has generated a paleontology workstream.”",
    "lesson": "Sometimes the squirrel should win because the distraction is concrete evidence. Notice what does not fit, preserve it, and bring in the expertise needed to determine whether the detour matters.",
    "strongest_post_concept": "Go looking for frog habitat, notice one weird rock, come home with one of the area’s best mastodon teeth.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  },
  {
    "title": "Teacher Looking for an Easier Route After Knee Surgery Finds the First Adult T. Rex Trackway",
    "source_url": "https://phys.org/news/2026-09-million-year-trackway-captures-adult.html",
    "source_name": "Phys.org / Denver Museum of Nature & Science",
    "published_at": "2026-09-09",
    "category": "RABBIT HOLES WITH A GOOD END",
    "score": 100,
    "summary": "High-school teacher Kent Hups, recovering from knee replacement, was looking for an easier route out of a rocky North Dakota valley when a peculiar shape stopped him. The find became the first described trackway likely made by an adult T. rex: four roughly three-foot footprints spanning about 23 feet.",
    "strongest_comment": "Hank: “You were looking for the easy way out?” The squirrel: “Yes. I found four T. rex footprints instead. Technically the detour was historically productive.”",
    "lesson": "The best rabbit holes start with careful observation rather than random wandering. Hups changed direction because a specific clue earned the attention.",
    "strongest_post_concept": "The easier route after knee surgery leads directly to the first adult T. rex trackway science has described.",
    "post_type": "multi_pane_cartoon",
    "panel_count": 4
  }
];

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return Response.json({ error: "Missing Supabase server configuration" }, { status: 503 });
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.rpc("ingest_hank_news_updates", {
    p_user_id: "db7d5dee-c813-40b6-a966-ebfacbee862d",
    p_stories: stories
  });
  if (error) return Response.json({ error: error.message, details: error.details, hint: error.hint, code: error.code }, { status: 500 });
  return Response.json({ count: Array.isArray(data) ? data.length : null, data });
}
