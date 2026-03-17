
import { NextRequest, NextResponse } from "next/server"

const XAI_KEY = process.env.XAI_API_KEY || ""
const COLLECTION_ID = "collection_54242e4b-351f-4c70-89d3-833165fca772"

export async function POST(req: NextRequest) {
  const { messages, model, webSearch, useMemory } = await req.json()

  const tools: any[] = []
  if (webSearch) tools.push({ type: "web_search" }, { type: "x_search" })
  if (useMemory) tools.push({ type: "collections_search", vector_store_ids: [COLLECTION_ID] })

  // Use responses API for memory/tools, chat/completions for simple
  const useResponsesAPI = tools.length > 0

  try {
    if (useResponsesAPI) {
      const res = await fetch("https://api.x.ai/v1/responses", {
        method: "POST",
        headers: { "Authorization": `Bearer ${XAI_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          input: messages.map((m: any) => ({ role: m.role, content: m.content })),
          tools
        })
      })
      const data = await res.json()
      let content = ""
      for (const item of data.output || []) {
        for (const c of item.content || []) {
          if (c.type === "output_text") content = c.text
        }
      }
      return NextResponse.json({ content: content || data.output_text || "No response", model })
    } else {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${XAI_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages, max_tokens: 4096 })
      })
      const data = await res.json()
      return NextResponse.json({ content: data.choices?.[0]?.message?.content || "Error", model })
    }
  } catch (e: any) {
    return NextResponse.json({ content: "API Error: " + e.message }, { status: 500 })
  }
}
