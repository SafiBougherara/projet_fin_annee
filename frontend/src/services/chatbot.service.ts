import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export interface ChatbotInitResponse {
  sessionId: string;
  restaurant: {
    id: number;
    nom: string;
    adresse: string;
    telephone: string;
    email: string;
  };
  welcomeMessage: string;
}

export interface ChatbotMessageResponse {
  response: string;
  ready_to_book: boolean;
  booked: boolean;
}

export const chatbotService = {
  initSession: async (restaurantId: number): Promise<ChatbotInitResponse> => {
    const response = await axios.get<ChatbotInitResponse>(`${apiUrl}/api/chatbot/init/${restaurantId}`);
    return response.data;
  },

  sendMessage: async (
    sessionId: string,
    restaurantId: number,
    message: string
  ): Promise<ChatbotMessageResponse> => {
    const response = await axios.post<ChatbotMessageResponse>(
      `${apiUrl}/api/chatbot/message`,
      {
        sessionId,
        restaurantId,
        message,
      }
    );
    return response.data;
  },
};
