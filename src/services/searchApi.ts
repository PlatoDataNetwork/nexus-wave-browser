import axios from 'axios';
import { toast } from "sonner";

const searchApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SEARCH_API_URL || 'http://localhost:3001',
});

// Function to handle search queries
export const performSearch = async (query: string, indexName: string = 'nexus-gpt-index') => {
  try {
    const response = await searchApi.post('/search', { query, indexName });
    return response.data;
  } catch (error: any) {
    handleError(error);
    return null;
  }
};

// Function to handle document uploads
export const uploadDocument = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await searchApi.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success("Document uploaded successfully");
    return response.data;
  } catch (error: any) {
    handleError(error);
    return null;
  }
};

// Function to handle document deletions
export const deleteDocument = async (fileName: string) => {
  try {
    const response = await searchApi.delete(`/delete?fileName=${fileName}`);
    toast.success("Document deleted successfully");
    return response.data;
  } catch (error: any) {
    handleError(error);
    return null;
  }
};

// Function to handle index creation
export const createIndex = async (indexName: string) => {
  try {
    const response = await searchApi.post('/createIndex', { indexName });
    toast.success("Index created successfully");
    return response.data;
  } catch (error: any) {
    handleError(error);
    return null;
  }
};

// Function to handle index deletions
export const deleteIndex = async (indexName: string) => {
  try {
    const response = await searchApi.delete(`/deleteIndex?indexName=${indexName}`);
    toast.success("Index deleted successfully");
    return response.data;
  } catch (error: any) {
    handleError(error);
    return null;
  }
};

// Error handling function
const handleError = (error: any) => {
  console.error("Search API error:", error);
  toast.error("An error occurred while searching");
};
