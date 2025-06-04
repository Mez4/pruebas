import axios from "axios"
import { GetServerUrl } from "../../../../../../global/variables"
import { IOidc } from "../../../../../../interfaces/oidc/IOidc"
import { DBConfia_Creditos } from "../../../../../../interfaces_db/DBConfia/Creditos"
import { DBConfia_Distribuidores } from "../../../../../../interfaces_db/DBConfia/Distribuidores"

export const FNGetDvSucursalCoordinador = (oidc: IOidc, data?: { SucursalID: number, CoordinadorID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Distribuidores/Distribuidor/getByCoordinador`, data, {
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

export const FNEnlazarSociasGestor = (oidc: IOidc, Distribuidores: DBConfia_Distribuidores.IDistribuidores[], UsuarioID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}gestoria/GrupoGestorDetalle/add`, { Distribuidores, UsuarioID }, {
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

export const FNGetGestoresBySucursal = (oidc: IOidc, data: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}gestoria/grupogestor/get`, data, {
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
