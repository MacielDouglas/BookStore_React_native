import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,

  register: async (username, email, password) => {
    set({ isLoading: true });

    try {
      const response = await fetch(
        "https://bookstore-react-native.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Se a resposta não está OK, lança um erro com a mensagem da API
        throw new Error(data.message || "Erro ao registrar");
      }

      // Extraia apenas os dados necessários do usuário
      const userData = {
        id: data.user._id,
        username: data.user.username,
        email: data.user.email,
        // inclua apenas as propriedades que você realmente precisa
      };

      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await AsyncStorage.setItem("token", data.token);

      set({ token: data.token, user: userData, isLoading: false });

      return {
        success: true,
      };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },
}));
