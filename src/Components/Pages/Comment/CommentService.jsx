import axios from "axios";

const API_BASE = "http://localhost:8081/api/comments";
const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const addComment = (data) => axios.post(API_BASE, data, authHeaders());
export const getCommentsByPost = (postId) => axios.get(`${API_BASE}/post/${postId}`, authHeaders());
export const deleteComment = (id) => axios.delete(`${API_BASE}/${id}`, authHeaders());
export const updateComment = (id, data) => axios.put(`${API_BASE}/${id}`, data, authHeaders());

