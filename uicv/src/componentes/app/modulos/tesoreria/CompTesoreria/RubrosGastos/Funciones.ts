import { date } from 'yup/lib/locale';
import { ErrorMessage } from 'formik';
import axios from "axios"
import { GetServerUrl } from "../../../../../../global/variables"
import { IOidc } from "../../../../../../interfaces/oidc/IOidc"

/**
 * Funcion para obtener los tipos de vivienda
 * @param {IOidc} Seguridad Estado de redux de seguridad
 * @param {number} Id Datos a subir
 * @returns any
 */
export const FNGet = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/RubrosGastos/rubros`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Seguridad.user.access_token}`
            }

        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNGetUsuariosPOST = (oidc: IOidc, Datos?: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.post(`${GetServerUrl()}SOMA/CatUsuariosRest/show`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })

            .then(respuesta => {
                Resolver(respuesta.data)

            })

            .catch(error => {
                Denegar(error)
            })
    })

//Guardar rubro
export const FNGuardarRubro = (oidc: IOidc, Datos?: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/RubrosGastos/rubros`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)

            })
            .catch(error => {
                Denegar(error)
            })
    })

//Actualizar rubro
export const FNActualizarRubro = (oidc: IOidc, Datos?: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.put(`${GetServerUrl()}SOMA/RubrosGastos/rubros`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)

            })
            .catch(error => {
                Denegar(error)
            })
    }
    )


