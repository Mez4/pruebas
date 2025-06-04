import axios from "axios"
import { Console } from "console"
import { resolveCname, Resolver } from "dns"
import { GetServerUrl } from "../../../../../../global/variables"
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'


export const FNValidacionValidacionAltaEncargados = (oidc: IOidc) => 
new Promise((Resolver: any, Denegar: any) => { 
    axios.post(`${GetServerUrl()}Cobranza/AnalistaCobranza/ValidacionAltaEncargados`, {}, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${oidc.user.access_token}`
        }
    })
        .then(respuesta => {
            Resolver(respuesta.data)
        })
        .catch(error => {
            console.log('error: ', error)
            Denegar(error)
        })
})

export const FNGet = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/AnalistaCobranza/getAnalistaCobranza`, {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log(respuesta)
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })


export const FnGetMesaCobranza = (oidc: IOidc, MesaCobranzaID?: number) => 
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/AnalistaCobranza/getMesaCobranza`, { "id": MesaCobranzaID }, {
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