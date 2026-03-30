import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export async function POST(req: NextRequest) {
    try {
        const { responses } = await req.json()

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'Gemini API keys are not configured.' }, { status: 500 })
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

        const answeredQuestions = responses && responses.length > 0
            ? responses.map((r: any) => `Q: ${r.prompt}\nA: ${r.answer}`).join('\n\n')
            : "No questions answered yet."

        const prompt = `You are an AI interviewer helping to build a comprehensive legacy profile of a human. 
The user has answered the following questions so far:
${answeredQuestions}

Based ONLY on their previous answers, generate the NEXT single most meaningful question you should ask them to deep-dive into their life, values, or memories. 
If they haven't answered anything yet, ask: "Tell me about your favorite childhood memory."
DO NOT repeat any previous questions. Ask exactly one question. Do NOT include any intro like "Here is your question:". Just output the question.`

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        })

        return NextResponse.json({ question: response.text })
    } catch (error: any) {
        console.error('Gemini API Error:', error)
        return NextResponse.json({ error: error.message || 'Failed to generate question' }, { status: 500 })
    }
}
