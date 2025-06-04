import axios from "axios"
import { IOidc } from "../../../../../../interfaces/oidc/IOidc"
import { GetServerUrl } from "../../../../../../global/variables"

export const FNGetResponsables = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}gestoria/gestorusuarios/getResponsables`, {
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

