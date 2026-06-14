import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getDashboardStats = () =>
  API.get("/dashboard/stats");

export const generateSubjects = (
  data
) =>
  API.post(
    "/subjects/generate",
    data
  );

export const getCampaigns =
  () =>
    API.get("/campaigns");


export const getCampaignById = (id) =>
  API.get(`/campaigns/${id}`);

export const getCampaignStats = (id) =>
  API.get(`/campaigns/${id}/stats`);

export const getCampaignLogs = (id) =>
  API.get(`/campaigns/${id}/logs`);

export const getAISummary = (id) =>
  API.get(
    `/campaigns/${id}/ai-summary`
  );

export default API;