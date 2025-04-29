import { AllowedRoles } from "./roles.types";

type Bio = {
  _id: string;
  welcomeMessage: string;
  avatar: string;
};

export type User = {
  _id: string;
  username: string;
  email: string;
  roles: AllowedRoles[];
  bio: Bio;
  createdAt: string;
  updatedAt: string;
};
