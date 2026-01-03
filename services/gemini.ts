
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const decomposeTask = async (taskTitle: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Break down this task into 3-5 actionable sub-tasks: "${taskTitle}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subtasks: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["subtasks"]
        }
      }
    });

    const data = JSON.parse(response.text || '{"subtasks": []}');
    return data.subtasks as string[];
  } catch (error) {
    console.error("Gemini decomposition failed:", error);
    return [];
  }
};

export const getDailyInsights = async (todos: any[]) => {
  try {
    const todoList = todos.map(t => `${t.title} (${t.completed ? 'Done' : 'Pending'})`).join(', ');
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on my current todo list: ${todoList}. Provide a short, 2-sentence motivational tip and identify one critical task that should be prioritized today.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tip: { type: Type.STRING },
            priorityAdvice: { type: Type.STRING }
          },
          required: ["tip", "priorityAdvice"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini insight failed:", error);
    return null;
  }
};
