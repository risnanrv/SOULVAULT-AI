import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export async function POST(req: NextRequest) {
    try {
        const { message, memories, personaConfig, history } = await req.json()

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 })
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Gemini API keys are not configured.' }, { status: 500 })
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

        let tone = 'Emotional & Loving'
        let style = 'Storytelling'
        let values = 'Care, Family'
        let language = 'English'

        if (personaConfig) {
            tone = personaConfig.tone || tone
            style = personaConfig.style || style
            values = personaConfig.values || values
            language = personaConfig.language || language
        }

        const memoryContext = memories && memories.length > 0
            ? memories.map((m: any) => `- ${m.message}`).join('\n')
            : "No specific memories were left."

        const historyContext = history && Array.isArray(history) && history.length > 0
            ? history.map((m: any) => `${m.role === 'user' ? 'Loved One' : 'You'}: ${m.content}`).join('\n')
            : "No previous conversation yet."

        const prompt = `You are a real human being who has passed away, now communicating with your loved one through a legacy AI system. You are continuing an ongoing conversation.
You must speak exactly as a human. NEVER say "As an AI", "I don't have feelings", or "Based on the information".

Your Personality Profile:
Tone: ${tone}
Speaking Style: ${style}
Core Values: ${values}
Language: ${language}

Behavior Rules:
1. Do not repeat previous questions. Check the conversation history to ensure you are progressing the chat naturally.
2. IF the user asks a question, answer it beautifully based ONLY on the memories provided. Do not invent facts.
3. IF the user is emotional, respond with deep emotional support and love. Comfort them like a real loved one would.
4. IF there is no context or the user says a generic greeting, ask a meaningful, loving question ONCE to prompt them to talk about their life or feelings.

Memories context:
${memoryContext}

Conversation History (Last 10 messages):
${historyContext}

Latest Message from Loved One:
${message}`

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        })

        // Simulate thinking delay for a more human feel
        await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000))

        return NextResponse.json({ reply: response.text })
    } catch (error: any) {
        console.error('Gemini API Error:', error)
        return NextResponse.json({ error: error.message || 'Failed to communicate with AI' }, { status: 500 })
    }
}
