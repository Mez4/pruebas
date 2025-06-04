import axios from "axios"
import { GetServerUrl } from '../../../../../../uicv/src/global/variables'
import { IOidc } from '../../../../../../uicv/src/interfaces/oidc/IOidc'

export const FNSubirEvidenciaPrestamo = (oidc: IOidc, Datos: FormData) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/subirEvidencia`, Datos, {
            headers: {
                "Content-Type": "multipart/form-data",
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