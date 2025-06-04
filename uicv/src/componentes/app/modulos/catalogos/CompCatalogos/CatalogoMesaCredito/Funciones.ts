import axios from 'axios'
// import { GetServerUrl } from '../../../../../../global/variables'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

/**
 * Funcion para obtener los tipos de vivienda
 * @param {IOidc} Seguridad Estado de redux de seguridad
 * @param {number} Id Datos a subir
 * @returns any
 */
export const FNGet = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`https://service-mc.herokuapp.com/api/mesa-credito/show`, {
            headers: {
                "Content-Type": "application/json",

            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })


/**
 * Funcion para agregar un tipo de vivienda
 * @param {IOidc} Seguridad Estado de redux de seguridad
 * @param Datos Datos a subir
 * @returns any
 */
export const FNAdd = (Seguridad: IOidc,
    Datos: { activo: boolean, clave: string, nombre: string, analistas: any[], productos: any[], directorMesa: {} }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('Datos', Datos);
        axios.post(`https://service-mc.herokuapp.com/api/mesa-credito/add`, Datos, {
            headers: {
                "Content-Type": "application/json",

            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

/**
 * Funcion para actualizar un tipo de vivienda
 * @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
 * @param Datos Datos a subir
 * @returns any
 */
export const FNUpdate = (Seguridad: IOidc, mesaCreditoId: number, Datos:
    {
        activo: boolean, clave: string, nombre: string,
        analistas: any[], productos: any[], directorMesa: {}
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)
        axios.put(`https://service-mc.herokuapp.com/api/mesa-credito/update/${mesaCreditoId}`, Datos, {
            headers: {
                "Content-Type": "application/json",

            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

/**
* Funcion para obtener los tipos de vivienda
* @param {IOidc} Seguridad Estado de redux de seguridad
* @param {number} Id Datos a subir
* @returns any
*/
export const FNGetProducto = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`https://service-mc.herokuapp.com/api/productos`, {
            headers: {
                "Content-Type": "application/json",

            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })
export const FNGetUsuarios = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`https://service-mc.herokuapp.com/api/usuarios`, {
            headers: {
                "Content-Type": "application/json",

            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })

    })

export const FNGetMesaCreditoId = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`https://service-mc.herokuapp.com/api/mesa-credito/show/${Id}`, {
            headers: {
                "Content-Type": "application/json",

            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })

    })