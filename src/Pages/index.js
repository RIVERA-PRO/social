import IndexLayout from "../Layouts/IndexLayout";
import MainLayout from "../Layouts/MainLayout";
import { createBrowserRouter } from "react-router-dom";
import Perfil from "./Perfil/Perfil";
import Auth from "../Components/Auth/Auth";
import AuthLayout from "../Layouts/AuthLayout";
import RecuperarContraseña from "../Components/RecuperarContraseña/RecuperarContraseña";
import EditContrasena from "../Components/EditContrasena/EditContrasena";
import Trabajos from "./Trabajos/Trabajos";
import Marketpleace from "./Marketpleace/Marketpleace";
import Servicios from "./Servicios/Servicios";
import Publicacion from "./Publicacion/Publicacion";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <IndexLayout />,

    },
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "/usuario/:idUsuario/:nombre",
                element: <Perfil />,
            },
            {
                path: "/publicacion/:idPublicacion",
                element: <Publicacion />,
            },
            {
                path: "/verificacion",
                element: <RecuperarContraseña />,
            },
            {
                path: "/recuperacion/:idUsuario/:token",
                element: <EditContrasena />,
            },

            {
                path: "/trabajos",
                element: <Trabajos />,
            },
            {
                path: "/marketpleace",
                element: <Marketpleace />,
            },
            {
                path: "/servicios",
                element: <Servicios />,
            },

        ],
    },
    {
        path: "/",
        element: <AuthLayout />,
        children: [

            {
                path: "/auth",
                element: <Auth />,
            },

        ],
    },

]);
