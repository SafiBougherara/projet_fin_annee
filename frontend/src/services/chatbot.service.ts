import axios from 'axios';

/**
 * FEATURE (front) : assistant conversationnel de réservation.
 * Consomme backend/src/Controller/ChatbotController.php.
 *
 * On utilise axios directement (et non services/api.ts) car ces routes sont publiques :
 * le client final n'est pas authentifié, il ne faut donc pas envoyer de token JWT.
 */
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
  // Ouvre une session de dialogue et récupère le sessionId + le message d'accueil.
  initSession: async (restaurantId: number): Promise<ChatbotInitResponse> => {
    const response = await axios.get<ChatbotInitResponse>(`${apiUrl}/api/chatbot/init/${restaurantId}`);
    return response.data;
  },

  // Envoie un message ; l'historique est conservé côté serveur via le sessionId.
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
