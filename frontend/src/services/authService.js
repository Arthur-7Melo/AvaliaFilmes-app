import { api } from './api';

export function signIn({ email, password }) {
  return api.post('/auth/signin', { email, password });
}

export function signUp({name, email, password}) {
  return api.post('/auth/signup', {name, email, password});
}

export function forgotPassword({email}) {
  return api.post('/auth/forgot-password', {email});
}