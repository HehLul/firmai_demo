// lib/ai-processor.js
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatOpenAI } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";

class PEAnalyzer {
  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    this.model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4o-mini",
      temperature: 0.2,
    });

    this.vectorStore = null;
  }

  async initialize() {
    try {
      const documents = PE_KNOWLEDGE_BASE.map(item => 
        new Document({
          pageContent: item.content,
          metadata: { type: item.type }
        })
      );

      // Using FaissStore
      this.vectorStore = await FaissStore.fromDocuments(
        documents,
        this.embeddings
      );

      console.log("PE knowledge base initialized");
    } catch (error) {
      console.error("Failed to initialize:", error);
      throw error;
    }
  }

  async analyzePDF(file) {
    try {
      if (!this.vectorStore) {
        throw new Error("Knowledge base not initialized");
      }

      // Load PDF
      const loader = new PDFLoader(file);
      const docs = await loader.load();

      // Since we're not using text splitter, we'll treat each page as a chunk
      const analyses = await Promise.all(
        docs.map(async (doc) => {
          const relevantKnowledge = await this.vectorStore.similaritySearch(
            doc.pageContent,
            2
          );

          const context = relevantKnowledge.map(doc => doc.pageContent).join('\n');
          
          const response = await this.model.invoke(`
            Use this PE expertise:
            ${context}

            To analyze this document section:
            ${doc.pageContent}

            Provide analysis of:
            1. Key financial metrics
            2. Market position
            3. Risks and opportunities
          `);

          return response;
        })
      );

      const finalSummary = await this.model.invoke(`
        Synthesize these analyses into a PE executive summary:
        ${analyses.join('\n\n')}
      `);

      return finalSummary;

    } catch (error) {
      console.error("Analysis failed:", error);
      throw error;
    }
  }
}

const analyzer = new PEAnalyzer();
export default analyzer;