import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'
import { DBConfia_Prospeccion } from '../../../../../../interfaces_db/DBConfia/Prospeccion'

type ProspectoPersonaType = {
    // Persona: DBConfia_General.IPersonas_VW,
    Nombre: string,
    ApellidoPaterno: string,
    ApellidoMaterno: string,
    FechaNacimiento: string,
    LugarNacimiento: string,
    SexoID: string,
    TelefonoDomicilio: string,
    TelefonoMovil: string,
    AsentamientoID: number,
    calle: string,
    localidad: string,
    numeroExterior: number,
}

export const FNAgregar = (oidc: IOidc, Datos: ProspectoPersonaType) =>
    new Promise((Resolver: any, Denegar: any) => {


        console.log('Datos: ', Datos)

        axios.post(`${GetServerUrl()}Prospeccion/Interesados/add`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                console.log('error: ', error)
                Denegar(error)
            })
    })

export const FNEditar = (oidc: IOidc, Datos: ProspectoPersonaType, ProspectoID: number) =>
    new Promise((Resolver: any, Denegar: any) => {


        console.log('Datos: ', Datos)

        axios.post(`${GetServerUrl()}Prospeccion/Prospectos/editar`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                console.log('error: ', error)
                Denegar(error)
            })
    })
export const FNGetByInteresados = (oidc: IOidc): Promise<DBConfia_Prospeccion.IInteresados_VW[]> =>
    new Promise((Resolver, Denegar) => {

        axios.post(`${GetServerUrl()}Prospeccion/Prospectos/getInteresados`, {
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


    export const FNGetInteresados = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Creditos/SolicitudCreditosPersonales/getSolicitudCreditosPersonales`, {}, { //ruta del controlador (api)
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

    export const FNAceptar = (oidc: IOidc, Datos: { SolicitudCreditosPersonalesID: number}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Creditos/SolicitudCreditosPersonales/Aceptar`, Datos, {
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

    export const FNRechazar = (oidc: IOidc, Datos: { SolicitudCreditosPersonalesID: number}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Creditos/SolicitudCreditosPersonales/Rechazar`, Datos, {
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

