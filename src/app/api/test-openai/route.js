// app/api/process-pdf/route.js
import { NextResponse } from 'next/server';
import { ChatOpenAI } from "@langchain/openai";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const text = await file.text();

    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.2,
      openAIApiKey: process.env.OPENAI_API_KEY
    });

    // Get the response from the model
    const response = await model.invoke(`
      You are a Private Equity expert. Analyze this PE document:
      ${text}

      Provide a detailed analysis covering:
      1. Key financial metrics (EBITDA, revenue, margins, growth rates)
      2. Market position and competitive analysis
      3. Growth opportunities and potential value creation
      4. Risk factors and mitigations
      5. Investment considerations and recommendations

      Format your response in a clear, structured manner suitable for PE professionals.
    `);

    // Extract the content from the response
    const analysis = response.content || response;

    return NextResponse.json({ 
      analysis: typeof analysis === 'string' ? analysis : JSON.stringify(analysis) 
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}