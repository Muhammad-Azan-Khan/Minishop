import { getCurrentUser, refreshSession } from "~/composables/api";

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  const publicPages = [
    "/",
    "/login",
    "/register",
    "/signup",
    "/reset-password",
  ];

  if (!authStore.isLoggedIn) {
    const headers = import.meta.server
      ? useRequestHeaders(["cookie"])
      : undefined;

    try {
      const me = await getCurrentUser(headers);
      authStore.setUser(me);

    } catch {
      try {
        await refreshSession(headers);
        const me = await getCurrentUser(headers);
        authStore.setUser(me);

      } catch { }
    }
  }

  if (!authStore.isLoggedIn && !publicPages.includes(to.path)) {
    return navigateTo("/login");
  }

  const adminRoutes = [
  "/adminaccount",
  "/admin/categories",
  "/admin/products",
  "/admin/orders",
  "/admin/users",
];

const userRoutes = [
  "/account",
  "/categories/page",
  "/products",
  "/orders",
  "/cart",
  "/checkout",
];

// USER cannot access admin pages
if (
  authStore.isLoggedIn &&
  !authStore.isAdmin &&
  adminRoutes.some((route) => to.path.startsWith(route))
) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page Not Found",
  });
}

// ADMIN cannot access customer pages
if (
  authStore.isLoggedIn &&
  authStore.isAdmin &&
  userRoutes.some((route) => to.path.startsWith(route))
) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page Not Found",
  });
}
});
