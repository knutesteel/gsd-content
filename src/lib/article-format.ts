export const CONTENT_TYPES = ["Single Pane Cartoon", "Multi-pane Cartoon", "Carousel (seperate images)"] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

export async function recommendArticleFormat(article: { title: string; summary?: string | null; text?: string | null }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { content_type: "Single Pane Cartoon" as ContentType, panel_count: 1 };
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
      input: `Review this article for a Hank and the Squirrel Instagram cartoon. Choose the format that tells the joke most effectively. Use Single Pane Cartoon for one strong visual beat, Multi-pane Cartoon for a short sequential joke contained in one image, or Carousel (seperate images) when the story benefits from multiple distinct scenes or a longer progression. Choose the exact number of panes/images needed, without padding.\n\nTitle: ${article.title}\nSummary: ${article.summary ?? ""}\nArticle: ${(article.text ?? "").slice(0, 12000)}`,
      text: { format: { type: "json_schema", name: "article_format", strict: true, schema: {
        type: "object", additionalProperties: false,
        properties: { content_type: { type: "string", enum: CONTENT_TYPES }, panel_count: { type: "integer", minimum: 1, maximum: 10 } },
        required: ["content_type", "panel_count"],
      } } },
    }),
  });
  const body = await response.json() as { output_text?: string; output?: Array<{ content?: Array<{ type?: string; text?: string }> }> };
  const outputText = body.output_text ?? body.output?.flatMap(item => item.content ?? []).find(part => part.type === "output_text")?.text;
  if (!response.ok || !outputText) return { content_type: "Single Pane Cartoon" as ContentType, panel_count: 1 };
  const result = JSON.parse(outputText) as { content_type: ContentType; panel_count: number };
  return { ...result, panel_count: result.content_type === "Single Pane Cartoon" ? 1 : result.panel_count };
}
