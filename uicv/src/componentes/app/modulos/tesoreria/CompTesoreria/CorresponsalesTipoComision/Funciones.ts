import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNObtenerCorresponsalesTipo = async (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}tesoreria/corresponsales/obtenerCorresponsalesTipo`, {
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

export const FNActualizarCorresponsalesTipo = async (oidc: IOidc, data: {
    TipoComisionID: number,
    TipoComision: string,
    TipoPorcentaje: boolean,
    TipoMontoFijo: boolean,
    TipoMontoCorte: boolean
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}tesoreria/corresponsales/actualizarCorresponsalesTipo`, data , {
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

export const FNAgregarCorresponsalesTipo = async (oidc: IOidc, data: {
        TipoComision: string,
        TipoPorcentaje: boolean,
        TipoMontoFijo: boolean,
        TipoMontoCorte: boolean
    }) =>
        new Promise((Resolver: any, Denegar: any) => {
            axios.post(`${GetServerUrl()}tesoreria/corresponsales/agregarCorresponsales`, data , {
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