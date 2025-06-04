import axios from "axios"
import { GetServerUrl } from '../../../../../../uicv/src/global/variables'
import { IOidc } from '../../../../../../uicv/src/interfaces/oidc/IOidc'

export const FNAddNotaRapida = (oidc: IOidc, Datos: { DistribuidorID: number, Descripcion: string, TipoNotaID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Creditos/notasrapidas/addNotas`, Datos, {
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
    });

export const FNGetTipoNotas = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Creditos/notasrapidas/getTipoNotas`, {
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