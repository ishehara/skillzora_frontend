// src/Components/Pages/Comment/CommentService.jsx

import axios from "axios";

const API_BASE = "http://localhost:8081/api/comments";

// Helper function for authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const addComment = (data) => {
  return axios.post(API_BASE, data, getAuthHeaders());
};

export const getCommentsByPost = (postId) => {
  return axios.get(`${API_BASE}/post/${postId}`, getAuthHeaders());
};

export const deleteComment = (id) => {
  return axios.delete(`${API_BASE}/${id}`, getAuthHeaders());
};

export const updateComment = (id, data) => {
  return axios.put(`${API_BASE}/${id}`, data, getAuthHeaders());
};