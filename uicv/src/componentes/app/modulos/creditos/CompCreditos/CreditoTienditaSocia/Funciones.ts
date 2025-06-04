

import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNValidarCodigoTiendita = (oidc: IOidc, values: { Codigo: string, SKU: number, DistribuidorID: number, ClienteID?: number }) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios.post(`${GetServerUrl()}creditos/CreditoTienditaCodigos/validarCodigo`, values, {
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
