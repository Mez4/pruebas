import axios from "axios"
import { GetServerUrl } from "../../../../../../global/variables"
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

export const FNGetReferenciasByAvalID = (oidc: IOidc, AvalID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/Referencias/getByAval`, {AvalID}, {
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

export const FNAdd = (oidc: IOidc, Datos: { ReferenciaID: number, PersonaID: number, TipoPersonaID: number, numeroReferencia: number, nombre: string, primerApellido: string, segundoApellido: string, parentesco: string, celular: string, domicilio: string, edad: number, Activo: boolean }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('Datos', Datos);
        axios.post(`${GetServerUrl()}Prospeccion/Referencias/AddReferenciaAval`, Datos, {
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

export const FNUpdate = (oidc: IOidc, Datos: { ReferenciaID: number, PersonaID: number, TipoPersonaID: number, numeroReferencia: number, nombre: string, primerApellido: string, segundoApellido: string, parentesco: string, celular: string, domicilio: string, edad: number, Activo: boolean }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/Referencias/UpdateReferenciaAval`, Datos, {
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