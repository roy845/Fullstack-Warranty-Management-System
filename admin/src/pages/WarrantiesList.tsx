import {
  List,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  TextInput,
} from "react-admin";

export default function WarrantiesList() {
  const warrantyFilters = [
    <TextInput
      label="Search by client Name or product info"
      source="q"
      alwaysOn
      sx={{ width: 300, mb: 2 }}
    />,
  ];

  return (
    <List
      filters={warrantyFilters}
      sort={{ field: "createdAt", order: "DESC" }}
    >
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
