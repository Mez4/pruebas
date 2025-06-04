import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc' 
import { GetServerUrl } from '../../../../../../global/variables' 

export const FNGet = (oidc: IOidc, values:any ) =>
    new Promise((Resolver: any, Denegar: any) => {
       
        axios.post(`${GetServerUrl()}MesaCredito/sp_Verifica/GetVerifica`,{...values} , {
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
