// src/Components/Pages/ProgressChecker/ProgressCheckerService.jsx

import axios from "axios";

const API_BASE = "http://localhost:8081/api/cooking-progress";

// Helper function for authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const addProgress = (data) => {
  return axios.post(API_BASE, data, getAuthHeaders());
};

export const getProgressByUser = (userId) => {
  return axios.get(`${API_BASE}/user/${userId}`, getAuthHeaders());
};

export const getProgressByPost = (postId) => {
  return axios.get(`${API_BASE}/post/${postId}`, getAuthHeaders());
};

export const updateProgress = (id, data) => {
  return axios.put(`${API_BASE}/${id}`, data, getAuthHeaders());
};

export const deleteProgress = (id) => {
  return axios.delete(`${API_BASE}/${id}`, getAuthHeaders());
};

export const getAllProgress = () => {
  return axios.get(API_BASE, getAuthHeaders());
};