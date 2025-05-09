// src/services/ProgressCheckerService.js
import axios from "axios";

const API_BASE = "http://localhost:8081/api/cooking-progress";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const addProgress = (data) =>
  axios.post(API_BASE, data, authHeaders());

export const getProgressByUser = (userId) =>
  axios.get(`${API_BASE}/user/${userId}`, authHeaders());

export const updateProgress = (id, data) =>
  axios.put(`${API_BASE}/${id}`, data, authHeaders());

export const deleteProgress = (id) =>
  axios.delete(`${API_BASE}/${id}`, authHeaders());


export const getProgressByPost = (postId) =>
  axios.get(`http://localhost:8081/api/cooking-progress/post/${postId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
