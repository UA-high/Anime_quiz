import {createBrowserRouter, Router} from 'react-router-dom'
import Landing from './features/landing/pages/Landing'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'

export const router = createBrowserRouter([
    {
        path:"/",
        element:<Landing/>
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    }
])