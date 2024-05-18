import { Language } from "./language.enum";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture?: string;
  role: Role;
  password: string;
  language: Language;
  created_at: Date;
  updated_at?: Date;
}

export interface UserCreation {
  first_name: string;
  last_name: string;
  email: string;
  profile_picture?: string;
  role: Role;
  password: string;
  language: Language;
}

export enum Role {
  ADMIN = "admin",
  USER = "user",
}
