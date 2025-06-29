import { apiClient } from "./apiClient";
import {
  Supplier,
  CreateSupplierData,
  UpdateSupplierData,
  SupplierFilters,
  SuppliersApiResponse,
  SupplierApiResponse,
} from "../types/supplier.types";

export class SuppliersService {
  private readonly baseUrl = "/suppliers";

  async getAll(filters: SupplierFilters = {}): Promise<SuppliersApiResponse> {
    try {
      const params = new URLSearchParams();
      // Construire les paramètres de requête
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });

      const response = await apiClient.get(
        `${this.baseUrl}?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getById(id: number): Promise<SupplierApiResponse> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(data: CreateSupplierData): Promise<SupplierApiResponse> {
    try {
      const response = await apiClient.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(
    id: number,
    data: UpdateSupplierData
  ): Promise<SupplierApiResponse> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async bulkDelete(ids: number[]): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/bulk-delete`, { ids });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async export(filters: SupplierFilters = {}): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });

      const response = await apiClient.get(
        `${this.baseUrl}/export?${params.toString()}`,
        {
          responseType: "blob",
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async uploadDocument(supplierId: number, file: File): Promise<any> {
    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await apiClient.post(
        `${this.baseUrl}/${supplierId}/documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      // Erreur de réponse du serveur

      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        `Erreur ${error.response.status}`;
      return new Error(message);
    } else if (error.request) {
      // Erreur de réseau
      return new Error("Erreur de connexion au serveur");
    } else {
      // Autre erreur
      return new Error(error.message || "Une erreur inattendue s'est produite");
    }
  }
}

export const suppliersAPI = new SuppliersService();
