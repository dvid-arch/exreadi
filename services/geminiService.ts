import { GoogleGenAI, Chat, Content } from "@google/genai";
import { ChatMessage } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this example, we'll throw an error if the API key is not set.
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const buildHistory = (messages: ChatMessage[]): Content[] => {
    return messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));
};

export const sendMessageToAI = async (message: string, history: ChatMessage[]): Promise<string> => {
    try {
        const currentChat: Chat = ai.chats.create({
            model: 'gemini-2.5-pro',
            config: {
                systemInstruction: `You are Ai-buddy, a friendly and encouraging AI tutor for ExamRedi. Your goal is to help students understand complex topics and prepare for their exams. Explain concepts clearly, provide examples, and test their knowledge with relevant questions. Keep your tone positive and supportive. Format your responses using markdown for better readability.`,
            },
            history: buildHistory(history)
        });

        const response = await currentChat.sendMessage({ message });
        
        return response.text;
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        return "I'm having trouble connecting right now. Please try again later.";
    }
};

export const generateStudyGuide = async (subject: string, topic: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Generate a study guide for the subject "${subject}" on the topic "${topic}".`,
            config: {
                systemInstruction: `You are an expert educator and content creator. Your task is to generate a concise and easy-to-understand study guide on a given topic. The guide should be structured like a handbook, focusing on key concepts, definitions, and important points. Use clear headings, bullet points, and simple language to make the information digestible for a student preparing for an exam. Use markdown for formatting.`,
            },
        });
        
        return response.text;

    } catch (error) {
        console.error("Error generating study guide:", error);
        return "Sorry, I encountered an error while generating the study guide. Please check the topic and try again.";
    }
};