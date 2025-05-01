import axios from "axios";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const OPENAI_MODEL = "gpt-4o";

// Function to get AI-generated response
export const getAIResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await axios.post("/api/ai/chat", { prompt });
    return response.data.message;
  } catch (error) {
    console.error("Error getting AI response:", error);
    throw new Error("Failed to get AI response");
  }
};

// Function to get AI-generated tips
export const getAITip = async (category: string): Promise<string> => {
  try {
    const response = await axios.post("/api/ai/tip", { category });
    return response.data.tip;
  } catch (error) {
    console.error(`Error getting ${category} tip:`, error);
    throw new Error(`Failed to get ${category} tip`);
  }
};

// Function to analyze user data and provide insights
export const getAIInsights = async (userData: any): Promise<string> => {
  try {
    const response = await axios.post("/api/ai/insights", { userData });
    return response.data.insights;
  } catch (error) {
    console.error("Error getting AI insights:", error);
    throw new Error("Failed to get AI insights");
  }
};

// Function to get AI-generated recommendations
export const getAIRecommendations = async (category: string, userData: any): Promise<any[]> => {
  try {
    const response = await axios.post("/api/ai/recommendations", { 
      category, 
      userData 
    });
    return response.data.recommendations;
  } catch (error) {
    console.error(`Error getting ${category} recommendations:`, error);
    throw new Error(`Failed to get ${category} recommendations`);
  }
};

export default {
  getAIResponse,
  getAITip,
  getAIInsights,
  getAIRecommendations
};
