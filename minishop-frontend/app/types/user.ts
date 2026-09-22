export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  createdAt: string;
  updatedAt?: string;
}

export interface AuthUser {
  userId: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}
