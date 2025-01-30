// app/api/process-pdf/route.js
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import pdfParse from 'pdf-parse';

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

    // Convert file to buffer for pdf-parse
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    const pdfData = await pdfParse(buffer);
    const cleanedText = pdfData.text
      .replace(/[^\x20-\x7E\n]/g, '') // Remove non-printable characters
      .replace(/\n{3,}/g, '\n\n')     // Normalize multiple newlines
      .trim();

    // Log the first part of cleaned text for debugging
    console.log('Cleaned text preview:', cleanedText.substring(0, 500));

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a Private Equity expert analyst. Provide a detailed analysis of the investment memorandum, focusing on specific metrics and data provided."
        },
        {
          role: "user",
          content: `Please analyze this investment memorandum and provide a structured evaluation:

${cleanedText}

Focus your analysis on:

1. Financial Analysis
   - Review current metrics (Revenue, EBITDA, margins)
   - Analyze growth rates and projections
   - Evaluate unit economics

2. Market Position
   - Assess market share and competitive position
   - Evaluate customer base and concentration
   - Review product/service offering

3. Growth & Value Creation
   - Evaluate expansion plans
   - Assess operational improvements
   - Review strategic initiatives

4. Risk Assessment
   - Identify market risks
   - Evaluate operational risks
   - Assess financial risks

5. Investment Recommendation
   - Analyze deal structure
   - Evaluate return potential
   - Provide key considerations

Use specific numbers and data points from the memorandum in your analysis.`
        }
      ],
      temperature: 0.2,
    });

    const analysis = completion.choices[0].message.content;

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}