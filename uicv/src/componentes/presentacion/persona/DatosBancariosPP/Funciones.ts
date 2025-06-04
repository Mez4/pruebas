import axios from 'axios'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../global/variables'

export const FNGet = (oidc: IOidc, Datos: { personaID: number, cveBancoRef?: number, datoTipoID?: number, datoBancario?: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}general/personadatosbancarios/get`, Datos, {
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

export const GetDatosBancActivo = (oidc: IOidc, Datos: { personaID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}general/personadatosbancarios/GetDatosBancActivo`, Datos, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${oidc.user.access_token}`,
            },
        })
            .then((respuesta) => {
                Resolver(respuesta.data);
            })
            .catch((error) => {
                Denegar(error);
            });
    });

export const FNEnviarCodigo = (oidc: IOidc, Datos: {
    PersonaID: number,
    TelefonoMovil: string,
    src: string,
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}general/CodigoSMS/add`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log(respuesta.data)
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNVerificar = (oidc: IOidc, Datos: {
    Id: number,
    Codigo: string
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}general/CodigoSMS/verificar`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log(respuesta.data)
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNAdd = (oidc: IOidc, Datos: {
    personaID: number,
    cveBancoRef: number,
    TelefonoMovil: string,
    DatosBancarios: any[]
}) =>
    new Promise((Resolver: any, Denegar: any) => {

        console.log('IDUSUARIO', oidc.user.profile.UsuarioID);
        axios.post(`${GetServerUrl()}general/personadatosbancarios/addReplace`, { ...Datos, UsuarioModificaID: oidc.user.profile.UsuarioID }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log(respuesta.data)
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNPdf = (oidc: IOidc, Datos: { personaID: number, cveBancoRef: number, datoTipoID?: number, datoBancario?: string }) =>
    new Promise((Resolver: any, Denegar: any) => {

        // console.log('Datos: ', Datos)

        axios.post(`${GetServerUrl()}general/personadatosbancarios/pdf`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
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