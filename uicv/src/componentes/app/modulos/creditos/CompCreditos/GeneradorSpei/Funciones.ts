import axios from "axios"
import { IOidc } from "../../../../../../interfaces/oidc/IOidc"
import { GetServerUrl } from "../../../../../../global/variables"


type SpeiCreditos = {
    SucursalID: number,
    FechaInicio: Date,
    FechaFin: Date,
}

export const FNGetCreditos = (oidc: IOidc, FormData: SpeiCreditos) =>
    new Promise((Resolver: any, Denegar: any) => {
        // console.log('Datos: ', this.props.Datos)
        // console.log('Credito: ', Credito)

        axios.post(`${GetServerUrl()}creditos/credito_vw/GetCreditosSpei`, FormData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log('res: ', respuesta.data)
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })


export const GetSpeiFile = (oidc: IOidc, Creditos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/credito_vw/GetSpeiFile`, { Creditos }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            },
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

