export type WarrantyStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "manual_review";

type User = {
  email: string;
  username: string;
};

export type Warranty = {
  _id: string;
  clientName: string;
  productInfo: string;
  installationDate: string;
  invoiceFilename: string;
  status: WarrantyStatus;
  user: User;
  createdAt: string;
  updatedAt: string;
};
