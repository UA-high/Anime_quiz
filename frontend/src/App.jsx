import PaperPopDashboard from "./features/landing/pages/PaperPopDashboard";
import {RouterProvider} from 'react-router-dom'
import {router} from "./app.routes"
import { AuthProvider } from "./features/auth/Auth.context";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  );
}
