import App from "../App";
import { createBrowserRouter } from "react-router-dom";
import Home from "../Home";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>
    },
    {
        path: 'home',
        element: <Home/>
    }
])
export default router