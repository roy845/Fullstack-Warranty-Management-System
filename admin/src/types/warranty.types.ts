export enum WarrantyStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  MANUAL_REVIEW = "manual_review",
}

export type Warranty = {
  id: string;
  clientName: string;
  productInfo: string;
  installationDate: string;
  status: string;
};
