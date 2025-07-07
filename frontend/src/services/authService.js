import { api } from './api';

export async function signIn({ email, password }) {
  const response = await api.post('/auth/signin', { email, password });
  return response.data.token;
}

export function signUp({name, email, password}) {
  return api.post('/auth/signup', {name, email, password});
}

export function forgotPassword({email}) {
  return api.post('/auth/forgot-password', {email});
}