import api from "./axios";
export const getAdminOverview = () => api.get("/admin/overview");
