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

export const FNCancelacion = (oidc: IOidc, Datos?: any) =>
    new Promise((Resolver: any, Deneger: any) => {
        axios.post(`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/Cancelacion`, Datos, {
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

export const FNModificaIncremento = (oidc: IOidc, Datos?: any) =>
    new Promise((Resolver: any, Deneger: any) => {
        axios.post(`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/updatePrestamo`, Datos, {
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

export const FNGet = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/obtenerSolicitudPrestamo`, { //ruta del controlador (api)
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

export const FNGetFilter = (Seguridad: IOidc, data) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/obtenerSolicitudPrestamoFiltro`, data, { //ruta del controlador (api)
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

// export const FNAceptar = (Seguridad: IOidc, Datos: any) =>
//     new Promise((Resolver: any, Denegar: any) => {

//         axios.post(`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/AceptarPrestamo`, Datos, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${Seguridad.user.access_token}`
//             }
//         })
//             .then(respuesta => {
//                 console.log('respuesta',respuesta)
//                 Resolver(respuesta.data)
//             })
//             .catch(error => {
//                 Denegar(error)
//             })
//     })

export const FNAceptar = (Seguridad: IOidc, SolicitudPrestamoPersonalID: number) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.put(`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/AceptarSolicitud`, { SolicitudPrestamoPersonalID: SolicitudPrestamoPersonalID }, {
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

export const FNReimprimirPrestamoPersonal = (Seguridad: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/canjeavale/pdf`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Seguridad.user.access_token}`
            },
            responseType: 'blob'
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })


export const FNReimprimirSolicitudPrestamosPersonalesPDF = (Seguridad: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/canjeavale/pdf`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Seguridad.user.access_token}`
            },
            responseType: 'blob'
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })


export const FNAceptarM = (Seguridad: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/AceptarMuchos`, Datos, {
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

export const FNSubirEvidenciaPrestamo = (oidc: IOidc, Datos: FormData) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/subirEvidencia`, Datos, {
            headers: {
                "Content-Type": "multipart/form-data",
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

export const FnGetEvidenciaPrestamo = (oidc: IOidc, DocumentoID: number, SolicitudPrestamoPersonalID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/getEvidencia`, { SolicitudPrestamoPersonalID, DocumentoID }, {
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

export const FnGetEvidencia = (oidc: IOidc, DocumentoID: number, AclaracionID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Aclaraciones/Aclaracion/getEvidencia`, { AclaracionID, DocumentoID }, {
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