import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  DateInput,
} from "react-admin";
import { WarrantyStatus } from "../types/warranty.types";

export default function WarrantyEdit() {
  const warrantyStatusChoices = [
    { id: WarrantyStatus.APPROVED, name: "Approved" },
    { id: WarrantyStatus.REJECTED, name: "Rejected" },
    { id: WarrantyStatus.PENDING, name: "Pending" },
    { id: WarrantyStatus.MANUAL_REVIEW, name: "Manual Review" },
  ];

  const today = new Date().toLocaleDateString("en-CA");

  return (
    <Edit>
      <SimpleForm>
        <TextInput source="clientName" label="Client Name" />
        <TextInput source="productInfo" label="Product Info" />
        <DateInput
          source="installationDate"
          label="Installation Date"
          slotProps={{
            input: {
              inputProps: {
                max: today,
              },
            },
          }}
        />

        <SelectInput
          source="status"
          label="Status"
          choices={warrantyStatusChoices}
        />
      </SimpleForm>
    </Edit>
  );
}
