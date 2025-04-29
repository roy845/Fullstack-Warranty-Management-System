import { Admin, Resource } from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./api/dataProvider";
import UsersList from "./pages/UsersList";
import WarrantiesList from "./pages/WarrantiesList";
import WarrantyEdit from "./pages/WarrantyEdit";
import { authProvider } from "./api/authProvider";

export const App = () => (
  <Admin
    layout={Layout}
    dataProvider={dataProvider}
    authProvider={authProvider}
  >
    <Resource name="users" list={UsersList} />
    <Resource name="warranties" list={WarrantiesList} edit={WarrantyEdit} />
  </Admin>
);
