import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { chatbotService } from '../services/chatbot.service';
import type { ChatbotInitResponse } from '../services/chatbot.service';
import SendIcon from '@mui/icons-material/Send';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import './ChatWidget.css';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

export default function ChatWidget() {
  const [searchParams] = useSearchParams();
  const restaurantId = parseInt(searchParams.get('restaurantId') || '1', 10);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<ChatbotInitResponse['restaurant'] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Initialiser la session de chatbot au montage du composant
    const initChat = async () => {
      try {
        setIsInitializing(true);
        setError(null);
        const data = await chatbotService.initSession(restaurantId);
        setSessionId(data.sessionId);
        setRestaurant(data.restaurant);
        setMessages([
          {
            id: 'welcome',
            sender: 'bot',
            text: data.welcomeMessage,
            timestamp: new Date(),
          },
        ]);
      } catch (err) {
        console.error('Erreur lors de l’initialisation du chatbot:', err);
        setError('Impossible d’initialiser le chatbot de réservation. Veuillez réessayer plus tard.');
      } finally {
        setIsInitializing(false);
      }
    };

    initChat();
  }, [restaurantId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !sessionId || isTyping) return;

    const userText = inputValue.trim();
    setInputValue('');

    // Ajouter le message utilisateur à la liste
    const userMessageId = `user-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        sender: 'user',
        text: userText,
        timestamp: new Date(),
      },
    ]);

    // Afficher l'indicateur d'écriture du bot
    setIsTyping(true);

    try {
      // Envoyer le message à l'API
      const data = await chatbotService.sendMessage(
        sessionId,
        restaurantId,
        userText
      );

      // Ajouter la réponse du bot à la liste
      const botMessageId = `bot-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: botMessageId,
          sender: 'bot',
          text: data.response,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error('Erreur lors de l’envoi du message:', err);
      // Message d'erreur convivial en cas de soucis de connexion
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: 'bot',
          text: 'Désolé, j’ai un problème temporaire de connexion. Pouvez-vous reformuler votre demande ?',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Connexion au restaurant en cours...</p>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="loader-container" style={{ padding: '20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{error || 'Restaurant introuvable.'}</p>
      </div>
    );
  }

  return (
    <div className="widget-container">
      {/* En-tête du Chatbot */}
      <div className="widget-header">
        <div className="header-avatar">
          <RestaurantIcon />
        </div>
        <div className="header-info">
          <h2>{restaurant.nom}</h2>
          <p>
            <span className="status-dot"></span>
            Assistant de réservation en direct
          </p>
        </div>
      </div>

      {/* Zone d'affichage des messages */}
      <div className="messages-list">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
            <div className="message-bubble">
              {msg.text}
            </div>
          </div>
        ))}

        {/* Indicateur de saisie "..." de l'IA */}
        {isTyping && (
          <div className="message-wrapper bot">
            <div className="message-bubble" style={{ padding: '8px 16px' }}>
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie */}
      <div className="input-container">
        <form onSubmit={handleSend}>
          <input
            type="text"
            className="chat-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Écrivez votre message ici..."
            disabled={isTyping}
          />
          <button type="submit" className="send-button" disabled={!inputValue.trim() || isTyping}>
            <SendIcon style={{ fontSize: '1.2rem' }} />
          </button>
        </form>
      </div>
    </div>
  );
}
