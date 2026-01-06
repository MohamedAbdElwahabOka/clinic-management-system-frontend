import { apiClient } from "@/lib/api-client";
import type { Appointment, AppointmentStatus, QueueItem } from "@/types";

/**
 * Service to handle all Appointment & Queue related API calls
 */
export const AppointmentService = {

    /**
     * List appointments with optional filters
     */
    async getAll(params?: { date?: string; doctorId?: string; status?: string }) {
        const query = new URLSearchParams(params as Record<string, string>).toString();
        return apiClient<Appointment[]>(`/appointments?${query}`);
    },

    /**
     * Get single appointment details
     */
    async getById(id: string) {
        return apiClient<Appointment>(`/appointments/${id}`);
    },

    /**
     * Create a new appointment
     */
    async create(data: { patientId: string; doctorId: string; dateTime: string; visitType: string; reason: string }) {
        return apiClient<Appointment>("/appointments", {
            method: "POST",
            body: data,
        });
    },

    /**
     * Update appointment details (Reschedule, etc.)
     */
    async update(id: string, data: Partial<Appointment>) {
        return apiClient<Appointment>(`/appointments/${id}`, {
            method: "PUT",
            body: data,
        });
    },

    /**
     * Update Status (Critical for Queue Management)
     * e.g. "Scheduled" -> "Arrived" -> "Completed"
     */
    async updateStatus(id: string, status: AppointmentStatus) {
        return apiClient<Appointment>(`/appointments/${id}/status`, {
            method: "PATCH",
            body: { status },
        });
    },

    /**
     * Cancel Appointment
     */
    async cancel(id: string) {
        return apiClient<{ message: string }>(`/appointments/${id}`, {
            method: "DELETE",
        });
    },

    /**
     * Get Current Queue (Derived from appointments)
     */
    async getQueue(doctorId?: string) {
        const query = doctorId ? `?doctorId=${doctorId}` : "";
        return apiClient<QueueItem[]>(`/queue${query}`);
    }
};
