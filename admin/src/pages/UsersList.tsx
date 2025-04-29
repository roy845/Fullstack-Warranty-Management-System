import { List, Datagrid, TextField, EmailField, TextInput } from "react-admin";

export default function UsersList() {
  const userFilters = [
    <TextInput
      label="Search email or username"
      source="q"
      alwaysOn
      sx={{ width: 300, mb: 2 }}
    />,
  ];
  return (
    <List filters={userFilters} sort={{ field: "createdAt", order: "DESC" }}>
      <Datagrid>
        <TextField source="username" label="Username" />
        <EmailField source="email" label="Email" />
        <TextField source="roles" label="Roles" />
      </Datagrid>
    </List>
  );
}
