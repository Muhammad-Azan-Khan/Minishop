import type { AuthUser } from "~/types/user";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as AuthUser | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === "ADMIN",
  },

  actions: {
    setUser(user: AuthUser) {
      this.user = user;
    },
    clearUser() {
      this.user = null;
    },
  },
});
