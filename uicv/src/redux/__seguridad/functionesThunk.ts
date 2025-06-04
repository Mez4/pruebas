// Importar las acciones comunes de redux
import * as sa from './acciones'
import axios from 'axios'
import { GetServerUrl } from '../../global/variables'

/**
 * Inicio de sesión
 * @param valores Credenciales del usuario
 * @returns Regresa un inicio de sesión
 */
/*
export const SeguridadLogin = (valores: { Correo: string, Contrasena: string }) =>

    // Devuelve una función con posibilidad despachar acciones de redux
    (dispatch: any) =>

        // Devuelve una nueva promessa
        new Promise((Resolver, Denegar) => {

            // Cambia nuestro estado a iniciar sesión
            dispatch(sa.seguridadLoginRequest())

            // Intentar iniciar sesión con la API
            axios.post(`${GetServerUrl()}Seguridad/login`, valores, { headers: { "Content-Type": "application/json" } })
                .then((respuesta) => {

                    // despachar a redux
                    dispatch(sa.seguridadLoginOk(respuesta.data))

                    // Resolver el detalle de usuario
                    Resolver(respuesta.data)

                })
                .catch((error: any) => {

                    // Despachar el error a redux
                    dispatch(sa.seguridadLoginError(error))

                    // Denegar la petición
                    Denegar(error)

                })
        })

/**
* Confirmación de usuario
* @param valores Valores de usuario
* @returns Regresa un inicio de sesión
*/
/*
export const SeguridadConfirmar = (valores: { Correo: string, Contrasena: string, Codigo: string }) =>

    // Devuelve una funcion que devuelva una promesa
    (dispatch: any) =>

        // Devuelve una nueva promesa
        new Promise((Resolver, Denegar) => {

            // Haga una promesa para confirmar el usuario
            axios.post(`${GetServerUrl()}Seguridad/confirmar`, valores, { headers: { "Content-Type": "application/json" } })
                .then((respuesta) => {

                    // despachar a redux
                    dispatch(sa.seguridadLoginOk(respuesta.data))

                    // Resolver el detalle del usuario
                    Resolver(respuesta.data)

                })
                .catch((error) => {

                    // Despachar el error a redux
                    dispatch(sa.seguridadLoginError(error))

                    // Denegar la petición
                    Denegar(error)

                })

        })
        */