import { api } from "./api";

export const login = async(email: string, password: string) => {
  const response = await api.post("/login", {
    email,
    password,
  });

  localStorage.setItem("token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));

  return response.data;
}

export const register = async(name: string, email: string, password: string) => {
  const response = await api.post("/register", {
    name,
    email,
    password,
  });

  localStorage.setItem("token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));

  return response.data;
}

export const logout = async() => {
  await api.post('/logout');
}