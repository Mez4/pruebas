import { date } from 'yup/lib/locale';
import { ErrorMessage } from 'formik';
import axios from "axios"
import { GetServerUrl } from "../../../../../../global/variables"
import { IOidc } from "../../../../../../interfaces/oidc/IOidc"
// import { Solicitud } from '../CreditoReestructuraSolicitudes/Solicitud';

/**
 * Funcion para obtener los tipos de vivienda
 * @param {IOidc} Seguridad Estado de redux de seguridad
 * @param {number} Id Datos a subir
 * @returns any
 */

export const FNGetSucursales = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/GetSucursalesSelect`, {
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

export const FNGetEstatus = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/obtenerEstatusPrestamo`, {
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

export const FNCancelacion = (oidc: IOidc, SolicitudPrimerCanjeID: number) =>
    new Promise((Resolver: any, Deneger: any) => {
        axios.post(`${GetServerUrl()}Distribuidores/SolicitudesPrimerCanje/Cancelacion`, { SolicitudPrimerCanjeID: SolicitudPrimerCanjeID }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Deneger(error)
            })
    })

export const FNGet = (Seguridad: IOidc, data: { DistribuidorID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Distribuidores/SolicitudesPrimerCanje/obtenerSolicitudesPrimerCanje`, data, { //ruta del controlador (api)
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


export const FNAceptar = (Seguridad: IOidc, SolicitudPrimerCanjeID: number) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.post(`${GetServerUrl()}Distribuidores/SolicitudesPrimerCanje/AceptarSolicitud`, { SolicitudPrimerCanjeID: SolicitudPrimerCanjeID }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Seguridad.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log('respuesta', respuesta)
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FnGetIne = (oidc: IOidc, ClienteID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Distribuidores/SolicitudesPrimerCanje/obtenerIneCliente/${ClienteID}`, {
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