import React from 'react'
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './guards/ProtectedRoute';
// layout
import Layout from './pages/Layout';
// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Registro from './pages/Registro';
import AreaPersonal from './pages/AreaPersonal';



export const Router = createBrowserRouter([
    {
        path:'/',
        element: <Layout/>,
        children:[
            {index: true, element: <Login/>},
            {path: 'login', element:<Login/>},
            {path: 'registro', element:<Registro />},
        // zona protegida
            {
                element: <ProtectedRoute />,
                children:[
                    {path:"home", element: <Home/>},
                    {path:"areapersonal", element: <AreaPersonal/>}
                ]
            },
            // error 404
            {path:"*", element:<NotFound/>}
        ]
    }
])