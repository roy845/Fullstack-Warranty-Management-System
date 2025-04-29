import { List, Datagrid, TextField, EmailField } from "react-admin";

export default function UsersList() {
  return (
    <List>
      <Datagrid>
        <TextField source="username" label="Username" />
        <EmailField source="email" label="Email" />
        <TextField source="roles" label="Roles" />
      </Datagrid>
    </List>
  );
}
