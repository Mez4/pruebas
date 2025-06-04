import axios from "axios"
import { GetServerUrl } from "../../../../../global/variables"
import { IOidc } from "../../../../../interfaces/oidc/IOidc"

export const FNComparativoContraQuincena = (oidc: IOidc, data: { GrupoID: number, DistribuidorID: number, ProductoID?: number, SucursalID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Indicadores/coordinador/comparativoContraQuincena2`, data, {
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

export const FNComparativoContraQuincenaGerente = (oidc: IOidc, data: { GrupoID: number, SucursalID: number, ProductoID?: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Indicadores/coordinador/comparativoContraQuincenaGerente`, data, {
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

export const FNResumenQuincenaVigentes = (oidc: IOidc, data: { DistribuidorID: number, GrupoID: number, isGerente: boolean, ProductoID?: number, SucursalID:number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Indicadores/coordinador/resumenQuincenaVigentes`, data, {
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

export const FNResumenQuincenaVigentesGerente = (oidc: IOidc, data: { SucursalID: number, GrupoID: number, ProductoID?: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Indicadores/coordinador/resumenQuincenaVigentesGerente`, data, {
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

export const FNSociasPendientesGerente = (oidc: IOidc, data: { SucursalID: number, GrupoID: number, ProductoID?: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Indicadores/coordinador/sociasPendientesGerente`, data, {
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



export const FNCumpleaniosSocias = (oidc: IOidc, data: { GrupoID: number, SucursalID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Indicadores/coordinador/cumpleaniosSocias`, data, {
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