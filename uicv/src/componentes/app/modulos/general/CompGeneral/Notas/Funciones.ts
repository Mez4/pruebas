import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNGet = (oidc: IOidc, SolicitudMesaCreditoID:number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}MesaCredito/LogMensajes/GetMensajes`, {SolicitudMesaCreditoID}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)

              //  console.log(`${GetServerUrl()}MesaCredito/LogMensajes/GetMensajes`, {SolicitudMesaCreditoID})
            })
            .catch(error => {
               
                Denegar(error)
            })
    })
