import { apiClient } from "@/lib/api-client";
import type { Patient } from "@/types";

export const PatientService = {

    async getAll(page = 1, limit = 10, search = "") {
        return apiClient<{ data: Patient[]; meta: any }>(`/patients?page=${page}&limit=${limit}&search=${search}`);
    },

    async getById(id: string) {
        return apiClient<Patient>(`/patients/${id}`);
    },

    async create(data: Partial<Patient>) {
        return apiClient<Patient>("/patients", {
            method: "POST",
            body: data,
        });
    },

    async update(id: string, data: Partial<Patient>) {
        return apiClient<Patient>(`/patients/${id}`, {
            method: "PUT",
            body: data,
        });
    },

    /**
     * Upload patient files (Reports, Avatar)
     */
    async uploadFile(id: string, file: File, type: string) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);

        // Note: apiClient automatically handles Content-Type for FormData (by not setting it)
        return apiClient<{ fileId: string; url: string }>(`/patients/${id}/files`, {
            method: "POST",
            body: formData,
        });
    }
};
