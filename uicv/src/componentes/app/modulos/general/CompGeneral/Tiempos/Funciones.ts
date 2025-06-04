import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'


export const FNGet = (oidc: IOidc, SolicitudMesaCreditoID:number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}MesaCredito/LogTiempos/GetTiempos`, {SolicitudMesaCreditoID}, {
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
