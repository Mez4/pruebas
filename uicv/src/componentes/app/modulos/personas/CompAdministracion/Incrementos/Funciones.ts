import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNIncrease = (oidc: IOidc, Datos: { 
        DistribuidorID: number, 
        ContratoID: number,
        ProductoID: number,
        UsuarioID: number,
        LineaCredito: number,
        IncrementoQuincena: number,
        regresa: number,
        msj: string,
    }) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.post(`${GetServerUrl()}Contratos/Contratos/increase`, Datos, {
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
