import { List, Datagrid, TextField, DateField, EditButton } from "react-admin";

export default function WarrantiesList() {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="clientName" label="Client Name" />
        <TextField source="productInfo" label="Product Info" />
        <DateField source="installationDate" label="Installation Date" />
        <TextField source="status" label="Status" />

        <TextField source="user.username" label="User" />

        <EditButton />
      </Datagrid>
    </List>
  );
}
