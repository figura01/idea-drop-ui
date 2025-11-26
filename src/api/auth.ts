import api from "@/lib/axios";

export const registerUser = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const res = await api.post("/auth/register", { name, email, password });
    return res.data;
  } catch (error) {
    console.log(error);
    throw new Error("Registration failed");
  }
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const res = await api.post("/auth/login", credentials);
    return res.data;
  } catch (error) {
    console.log(error);
    throw new Error("Login failed");
  }
};

export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.log(error);
    throw new Error("Logout failed");
  }
};

export const refreshAccessToken = async () => {
  try {
    const res = await api.post("/auth/refresh");
    return res.data;
  } catch (error: any) {
    console.log(error);
    const message = error.response?.data?.message || "Failed to refresh token";
    throw new Error(message);
  }
};
