import { createContext } from "react"
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type IntArticles = {
    SKU: number,
    Codigo: string
}


type IntCreditoTienditaCtx = {
    DistribuidorID: number,
    ClienteID?: number,
    Oidc: IOidc,
    ArticulosSelector?: any[]
    ArticulosCarrito: any[]
    InfoToSent?: {
        totalItems: number
        totalPrice: number
        totalQty: number
        totalPriceOrg: number
    }
    avoidCodigo?: boolean,
    setInfoToSent?(props: any): any,
    setDistribuidorID?(...props: any): any,
    setClienteID?(...props: any): any,
    setArticulosSelector?: any,
    setArticulosCarrito(props: any): any,
}

export const CtxInitCreditoTiendita: any = {
    DistribuidorID: 0,
    ClienteID: 0,
    ArticulosSelector: [],
    ArticulosCarrito: [],
    InfoToSent: {
        totalItems: 0,
        totalPrice: 0,
        totalQty: 0,
        totalPriceOrg: 0,
    },
    avoidCodigo: false,
    setInfoToSent: () => { },
    setDistribuidorID: () => { },
    setClienteID: () => { },
    setArticulosSelector: () => { },
    setArticulosCarrito: () => { },
}


export const CtxCreditoTiendita = createContext<IntCreditoTienditaCtx>(CtxInitCreditoTiendita);

export const CtxTienditaArticles = createContext<IntCreditoTienditaCtx>(CtxInitCreditoTiendita);

