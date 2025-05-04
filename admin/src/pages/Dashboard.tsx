// src/pages/Dashboard.tsx
import { Card, CardContent, Typography } from "@mui/material";

const Dashboard = () => (
  <Card>
    <CardContent>
      <Typography variant="h5">Welcome to the Admin Dashboard</Typography>
      <Typography variant="body1">
        Use the sidebar to manage users and warranties.
      </Typography>
    </CardContent>
  </Card>
);

export default Dashboard;
