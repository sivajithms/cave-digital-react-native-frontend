
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Task } from '../types';

// Auth storage
export const storeToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem('auth_token', token);
};

export const getToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('auth_token');
};

export const storeUser = async (user: User): Promise<void> => {
  await AsyncStorage.setItem('user', JSON.stringify(user));
};

export const getUser = async (): Promise<User | null> => {
  const userData = await AsyncStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

export const clearAuth = async (): Promise<void> => {
  await AsyncStorage.multiRemove(['auth_token', 'user']);
};
