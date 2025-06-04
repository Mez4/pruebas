import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GenerarCabeceraOIDC, GetServerUrl } from '../../../../../../global/variables'

export const FNAdd = (oidc: IOidc, Datos: { EstadoCivilID: string, EstadoCivil: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}catalogos/estadocivil/add`, Datos, GenerarCabeceraOIDC(oidc))
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNUpdate = (oidc: IOidc, Datos: { EstadoCivilID: string, EstadoCivil: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}catalogos/estadocivil/update`, Datos, {
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

