import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

export const FNGet = (Seguridad: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`https://services-tsr.herokuapp.com/api/cuentas-bancos/find-all`, {//https://service-tsr.herokuapp.com
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

export const FNAdd = (Seguridad: IOidc, Datos: {
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
        axios.post(`${GetServerUrl()}bancos/cuenta`, Datos, {  //  /add

        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNUpdate = (Seguridad: IOidc, Datos: {
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
        axios.post(`${GetServerUrl()}bancos/cuenta`, Datos, { ///   /update

        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

