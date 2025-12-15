import api from "./axios";

// Cases
export const listClinicCases = (params) => api.get("/clinic/cases", { params });
export const getClinicCase = (caseId) => api.get(`/clinic/cases/${caseId}`);
export const addClinicNote = (caseId, payload) => api.post(`/clinic/cases/${caseId}/notes`, payload);
export const updateClinicCaseStatus = (caseId, payload) => api.patch(`/clinic/cases/${caseId}/status`, payload);
export const listClinics = (params) => api.get("/public/clinics", { params });

export const listClinicAppointments = (params) => api.get("/clinic/appointments", { params });
export const approveAppointment = (id, payload) => api.patch(`/clinic/appointments/${id}/approve`, payload);
export const rescheduleAppointment = (id, payload) => api.patch(`/clinic/appointments/${id}/reschedule`, payload);
export const cancelAppointmentByClinic = (id, payload) => api.patch(`/clinic/appointments/${id}/cancel`, payload);
