import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

export const FNGet = (oidc: IOidc, ProductoID?: number, SucursalId?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}bancos/cuenta/get`, {ProductoID, SucursalId}, {
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

export const FNAdd = (oidc: IOidc, Datos: {
    BancoID: number,
    Cuenta: string,
    NombreCuenta: string,
    UsuarioId: number,
    DispersionConvenio: string,
    PuedeDispersar: boolean,
    LogoImg: string,
    activa: boolean,
    global: boolean,
    orden: number,
    importeEnBalance: number,
    importePendienteBalance: number
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}bancos/cuenta/add`, Datos, {
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

export const FNUpdate = (oidc: IOidc, Datos: {
    CuentaID: number,
    BancoID: number,
    Cuenta: string,
    NombreCuenta: string,
    UsuarioId: number,
    DispersionConvenio: string,
    PuedeDispersar: boolean,
    LogoImg: string,
    activa: boolean,
    global: boolean,
    orden: number,
    importeEnBalance: number,
    importePendienteBalance: number
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}bancos/cuenta/update`, Datos, {
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

