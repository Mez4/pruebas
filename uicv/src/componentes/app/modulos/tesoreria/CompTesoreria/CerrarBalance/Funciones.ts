import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'


export const FNGet = (Seguridad: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`https://service-tsr.herokuapp.com/api/balance/abierto`, {

        })
            .then(respuesta => {
                Resolver(respuesta.data)

            })

            .catch(error => {
                Denegar(error)
            })
    })

export const FNAdd = (Seguridad: IOidc,
    Datos: {
        cerrado: boolean
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)
        axios.post(`https://service-tsr.herokuapp.com/api/balance/cerrar`, Datos, {
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })



export const FNUpdate = (Seguridad: IOidc,

    Datos: {
        cajaId: number,
        nombre: String,
        clave: String,
        descripcion: String,
        estatus: boolean,
        cajaSucursal: {},
        cuentaCaja: {},
        cajaUsuario: {},
        cajaBoveda: {},

    }) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.put(`https://service-tsr.herokuapp.com/api/cajas/update/${Datos.cajaId}`, Datos, {

        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })





