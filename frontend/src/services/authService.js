import api from "./api";

const register = (name, email, password) => {
  return api.post("/auth/register", { name, email, password });
};

const login = (email, password) => {
  return api.post("/auth/login", { email, password });
};

const getMe = () => {
  return api.get("/auth/me");
};

const logout = () => {
  return api.post("/auth/logout");
};

const forgotPassword = (email) => {
  return api.post("/auth/forgotpassword", { email });
};

const resetPassword = (resetToken, password) => {
  return api.put(`/auth/resetpassword/${resetToken}`, { password });
};

const authService = {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
};

export default authService;
