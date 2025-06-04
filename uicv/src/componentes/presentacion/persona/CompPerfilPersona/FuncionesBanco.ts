import axios from "axios"
import { GetServerUrl } from '../../../../../../uicv/src/global/variables'
import { IOidc } from '../../../../../../uicv/src/interfaces/oidc/IOidc'

export const FNAdd = (oidc: IOidc, Datos) =>
new Promise((Resolver: any, Denegar: any) => {
    axios.post(`${GetServerUrl()}General/PersonaDatosBancarios/addDatosBancarios`, Datos, {
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