import api from './api';

export interface RestaurantTable {
  id: number;
  numeroTable: string;
  capacite: number;
  type: string;
  statut: string;
  restaurantId: number;
}

export interface ServiceItem {
  id: number;
  type: string;
  heureDebut: string;
  heureFin: string;
  joursOuverture: string[];
}

export interface RestaurantItem {
  id: number;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  capaciteTotale: number;
  dureeRepas: number;
  bufferNettoyage: number;
  tables: RestaurantTable[];
}

export interface CreateRestaurantPayload {
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  capaciteTotale: number;
  dureeRepas: number;
  bufferNettoyage: number;
}

export interface CreateTablePayload {
  numeroTable: string;
  capacite: number;
  type: string;
  statut: string;
  restaurantId: number;
}

export interface CreateServicePayload {
  restaurantId: number;
  type: string;
  heureDebut: string;
  heureFin: string;
  joursOuverture: string[];
}

const restaurantService = {
  getRestaurants: async (): Promise<RestaurantItem[]> => {
    const response = await api.get<RestaurantItem[]>('/restaurants');
    return response.data;
  },

  createRestaurant: async (payload: CreateRestaurantPayload): Promise<RestaurantItem> => {
    const response = await api.post<RestaurantItem>('/restaurants', payload);
    return response.data;
  },

  updateRestaurant: async (id: number, payload: Partial<CreateRestaurantPayload>): Promise<RestaurantItem> => {
    const response = await api.put<RestaurantItem>(`/restaurants/${id}`, payload);
    return response.data;
  },

  deleteRestaurant: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/restaurants/${id}`);
    return response.data;
  },

  createTable: async (payload: CreateTablePayload): Promise<RestaurantTable> => {
    const response = await api.post<RestaurantTable>('/tables', payload);
    return response.data;
  },

  updateTable: async (id: number, payload: Partial<CreateTablePayload>): Promise<RestaurantTable> => {
    const response = await api.put<RestaurantTable>(`/tables/${id}`, payload);
    return response.data;
  },

  deleteTable: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/tables/${id}`);
    return response.data;
  },

  getServices: async (restaurantId: number): Promise<ServiceItem[]> => {
    const response = await api.get<ServiceItem[]>(`/restaurants/${restaurantId}/services`);
    return response.data;
  },

  createService: async (payload: CreateServicePayload): Promise<ServiceItem> => {
    const response = await api.post<ServiceItem>('/services', payload);
    return response.data;
  },

  updateService: async (id: number, payload: Partial<CreateServicePayload>): Promise<ServiceItem> => {
    const response = await api.put<ServiceItem>(`/services/${id}`, payload);
    return response.data;
  },

  deleteService: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/services/${id}`);
    return response.data;
  },
};

export default restaurantService;
