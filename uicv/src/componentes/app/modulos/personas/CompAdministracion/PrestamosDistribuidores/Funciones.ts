import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'
import { DBConfia_Creditos } from '../../../../../../interfaces_db/DBConfia/Creditos'

export const FNgetbyfiltros = async (oidc: IOidc, Datos: {
    ProductoID: number,
    ClienteID: number,
    DistribuidorID: number,    
    SucursalID: number,
    EstatusID: string,
    ZonaID: number,
    DistribuidorNivelID: number,
    ContratoID: number,
    CoordinadorID: number,
    EmpresaId: number,
}): Promise<DBConfia_Creditos.ICreditosPermisos_VW[]> =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('Datos: ', Datos)

        axios.post(`${GetServerUrl()}creditos/credito_vw/getbyfiltros`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`,
                // "ProductoID": 2
            }
        })
            .then(respuesta => {
                console.log(respuesta, 'respcreditosglobal')
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNGetPlanPagos = async (oidc: IOidc, CreditoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/PlanPagos/getAdmin`, {CreditoID}, {
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

export const FNGetGrupoDistribuidor = async (oidc: IOidc, Datos: {
    ProductoID: number | undefined,
    DistribuidorID: number,    
    SucursalID?: number
}): Promise<DBConfia_Creditos.IGruposDetalle_VW> =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/GrupoDetalle/getdistribuidor`, Datos, {
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