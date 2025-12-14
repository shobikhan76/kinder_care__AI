import api from "./axios";

// Children
export const createChild = (payload) => api.post("/parent/children", payload);
export const listChildren = () => api.get("/parent/children");
export const deleteChild = (childId) => api.delete(`/parent/children/${childId}`);

// Cases
export const createCase = (payload) => api.post("/parent/cases", payload);
export const listCases = (params) => api.get("/parent/cases", { params });
export const getCase = (caseId) => api.get(`/parent/cases/${caseId}`);
export const cancelCase = (caseId) => api.patch(`/parent/cases/${caseId}/cancel`);

// Appointments
export const requestAppointment = (payload) => api.post("/parent/appointments", payload);
export const listAppointments = () => api.get("/parent/appointments");
export const cancelAppointment = (id) => api.patch(`/parent/appointments/${id}/cancel`);
