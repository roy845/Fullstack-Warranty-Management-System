import { Admin, Resource } from "react-admin";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Layout } from "./Layout";
import { dataProvider } from "./api/dataProvider";
import UsersList from "./pages/UsersList";
import WarrantiesList from "./pages/WarrantiesList";
import WarrantyEdit from "./pages/WarrantyEdit";
import { authProvider } from "./api/authProvider";
import Dashboard from "./pages/Dashboard";

export const App = () => (
  <Admin
    layout={Layout}
    dashboard={Dashboard}
    dataProvider={dataProvider}
    authProvider={authProvider}
  >
    <Resource name="users" list={UsersList} icon={PeopleIcon} />
    <Resource
      name="warranties"
      list={WarrantiesList}
      edit={WarrantyEdit}
      icon={AssignmentIcon}
    />
  </Admin>
);
