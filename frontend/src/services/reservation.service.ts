import api from './api';

export interface ReservationItem {
  id: number;
  statut: string;
  dateReservation: string;
  heureReservation: string;
  nombrePersonnes: number;
  demandesSpeciales: string | null;
  createdAt: string;
  client: {
    id: number | null;
    nom: string | null;
    telephone: string | null;
    email: string | null;
  };
  restaurant: {
    id: number | null;
    nom: string | null;
  };
  table: {
    id: number;
    numeroTable: string;
  } | null;
}

export interface CreateReservationPayload {
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  restaurantId: number;
  tableId?: number | null;
  dateReservation: string;
  heureReservation: string;
  nombrePersonnes: number;
  demandesSpeciales?: string;
}

const reservationService = {
  getReservations: async (): Promise<ReservationItem[]> => {
    const response = await api.get<ReservationItem[]>('/reservations');
    return response.data;
  },

  createReservation: async (payload: CreateReservationPayload): Promise<{ id: number; message: string }> => {
    const response = await api.post<{ id: number; message: string }>('/reservations', payload);
    return response.data;
  },

  updateReservation: async (id: number, payload: Partial<CreateReservationPayload> & { statut?: string }): Promise<{ id: number; message: string }> => {
    const response = await api.put<{ id: number; message: string }>(`/reservations/${id}`, payload);
    return response.data;
  },

  deleteReservation: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/reservations/${id}`);
    return response.data;
  },
};

export default reservationService;
