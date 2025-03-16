import { redirect } from "@tanstack/react-router";
import { axiosInstance } from "@/lib/axios";
import {io} from 'socket.io-client'

// Guard for authenticated routes
export async function requireAuth() {
  try {
    const response = await axiosInstance.post('/login/isAuthenticated');
    
    if (!response.data.isAuthenticated) {
      throw redirect({
        to: '/login',
        replace: true,
      });
    }
    
    return response.data;
  } catch (error) {
    // Check if error is a redirect - if so, re-throw it
    if (error) {
      throw error;
    }
    
    // Otherwise, redirect to login
    throw redirect({
      to: '/login',
      replace: true,
    });
  }
}

// Guard for non-authenticated routes (auth pages)
export async function requireNonAuth() {
  try {
    const response = await axiosInstance.post('/login/isAuthenticated');
    
    if (response.data.isAuthenticated === true) {
      throw redirect({
        to: '/chat',
        replace: true,
      });
    }
    
    return { authenticated: false };
  } catch (error) {
    // Check if error is a redirect - if so, re-throw it
    if (error) {
      throw error;
    }
    
    // Otherwise, return not authenticated
    return { authenticated: false };
  }
}