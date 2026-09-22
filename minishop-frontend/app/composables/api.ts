import type { NitroFetchOptions, NitroFetchRequest } from "nitropack";
import type { Cart } from "~/types/cart";
import type { Category, CategoryWithProducts } from "~/types/category";
import type { Order, OrderStatus } from "~/types/order";
import type { Product } from "~/types/product";
import type { AuthUser, User } from "~/types/user";

interface MessageResponse {
  message: string;
}

interface CheckoutResponse extends MessageResponse {
  order: Order;
}

function apiRequest<T>(
  path: string,
  options: NitroFetchOptions<NitroFetchRequest> = {},
) {
  const config = useRuntimeConfig();

  return $fetch<T>(path, {
    baseURL: config.public.apiBase,
    credentials: "include",
    ...options,
  });
}

// Authentication

export function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  return apiRequest<User>("/auth/register", {
    method: "POST",
    body: data,
  });
}

export function loginUser(data: { email: string; password: string }) {
  return apiRequest<MessageResponse>("/auth/login", {
    method: "POST",
    body: data,
  });
}

export function getCurrentUser(headers?: HeadersInit) {
  return apiRequest<AuthUser>("/auth/me", { headers });
}

export function refreshSession(headers?: HeadersInit) {
  return apiRequest<MessageResponse>("/auth/refresh", {
    method: "POST",
    headers,
  });
}

export function logoutUser() {
  return apiRequest<MessageResponse>("/auth/logout", { method: "POST" });
}

export function changePassword(data: {
  email: string;
  oldPassword: string;
  newPassword: string;
}) {
  return apiRequest<MessageResponse>("/auth/forgot-password", {
    method: "POST",
    body: data,
  });
}

export function resetForgottenPassword(data: {
  email: string;
  newPassword: string;
}) {
  return apiRequest<MessageResponse>("/auth/reset-password", {
    method: "POST",
    body: data,
  });
}

// Categories

export function getCategories() {
  return apiRequest<Category[]>("/categories");
}

export function getCategory(id: string | number) {
  return apiRequest<CategoryWithProducts>(`/categories/${id}`);
}

export function createCategory(formData: FormData) {
  return apiRequest<Category>("/categories/create", {
    method: "POST",
    body: formData,
  });
}

export function deleteCategory(id: number) {
  return apiRequest<MessageResponse>(`/categories/${id}`, {
    method: "DELETE",
  });
}

// Products

export function getProducts(search?: string) {
  const term = search?.trim();

  return apiRequest<Product[]>("/products/find", {
    query: term ? { search: term } : undefined,
  });
}

export function createProduct(formData: FormData) {
  return apiRequest<Product>("/products/create", {
    method: "POST",
    body: formData,
  });
}

export function deleteProduct(id: number) {
  return apiRequest<MessageResponse>(`/products/${id}`, {
    method: "DELETE",
  });
}

// Cart

export function getCart() {
  return apiRequest<Cart>("/cart");
}

export function addToCart(productId: number, quantity = 1) {
  return apiRequest<Cart>("/cart/add", {
    method: "POST",
    body: { productId, quantity },
  });
}

export function updateCartItem(itemId: number, quantity: number) {
  return apiRequest<Cart>(`/cart/item/${itemId}`, {
    method: "PATCH",
    body: { quantity },
  });
}

export function removeCartItem(itemId: number) {
  return apiRequest<Cart>(`/cart/item/${itemId}`, {
    method: "DELETE",
  });
}

// Orders

export function checkoutCart() {
  return apiRequest<CheckoutResponse>("/orders/checkout", {
    method: "POST",
  });
}

export function getMyOrders() {
  return apiRequest<Order[]>("/orders/my");
}

export function getAllOrdersAdmin() {
  return apiRequest<Order[]>("/orders/all");
}

export function updateOrderStatus(orderId: number, status: OrderStatus) {
  return apiRequest<Order>(`/orders/${orderId}/status`, {
    method: "PATCH",
    body: { status },
  });
}

// Users

export function getAllUsersAdmin() {
  return apiRequest<User[]>("/users/all");
}

export function deleteUserAdmin(id: number) {
  return apiRequest<MessageResponse>(`/users/${id}`, {
    method: "DELETE",
  });
}
