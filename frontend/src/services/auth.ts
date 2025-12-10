import { api } from "./api";

export async function login(email: string, password: string, setUser: any) {
  const response = await api.post("/login", {
    email,
    password,
  });

  localStorage.setItem("token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));

  setUser(response.data.user);
}

export async function register(name: string, email: string, password: string) {
  const response = await api.post("/register", {
    name,
    email,
    password,
  });

  localStorage.setItem("token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));
  return response.data.user;
}

export async function logout() {
  await api.post('/logout');
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}