const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const chatbotConfig = {
  apiUrl: `${API_BASE_URL}/api/chat`,
};
