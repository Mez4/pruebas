import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNReporte1549 = async (oidc: IOidc, data: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/reportes/reporte1549`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => Resolver(respuesta.data))
            .catch(error => Denegar(error))
    })

export const FNReporte1549_2 = async (oidc: IOidc, data: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/reportes/reporte1549_2`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => Resolver(respuesta.data))
            .catch(error => Denegar(error))
    })

export const FNDetalleSociasPendientes = async (oidc: IOidc, data: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Indicadores/coordinador/detalleSociasPendientesGerente`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => Resolver(respuesta.data))
            .catch(error => Denegar(error))
    })

export const FNReporteSociasPendientes = async (oidc: IOidc, data: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/reportes/IndicadoresSociasPendientes`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => Resolver(respuesta.data))
            .catch(error => Denegar(error))
    })

export const FNReporteSociasLiquidadas = async (oidc: IOidc, data: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/reportes/IndicadoresSociasLiquidadas`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => Resolver(respuesta.data))
            .catch(error => Denegar(error))
    })

export const FNReporteSemaforo = async (oidc: IOidc, data: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Indicadores/coordinador/Semaforo`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => Resolver(respuesta.data))
            .catch(error => Denegar(error))
    })

export const FNGetFechaCorte = (oidc: IOidc, SucursalID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cortes/FechaCorte/get2`, { SucursalID }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                // console.log(respuesta)
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })


export const FNGetFechaUltimaActualizacion = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Creditos/Reportes/UltimaActualizacion`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                // console.log(respuesta)
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })



export const FNGetFechaUltimaActualizacionGlobal = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Creditos/Reportes/UltimaActualizacionGlobal`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                // console.log(respuesta)
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })


export const FNGetGlobal = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Creditos/Reportes/getGlobalNew`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                // console.log(respuesta)
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })


export const FNgetbyfiltros = async (
    oidc: IOidc,
    Datos: {
        ProductoID: number;
        DirectorID?: number;
        ClienteID: number;
        SucursalID: number;
        ZonaID: number;
        // EmpresaId: number,
        DistribuidorID: number;
        GrupoID: number;
        // CoordinadorID: number,
        Tipo: number;
        tipoDias: number;
        // ContratoID: number,
        // EstatusID: string,
        // DistribuidorNivelID: number,
        // FechaInicio: Date,
        // FechaFin: Date
    }
) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios
            .post(`${GetServerUrl()}gestoria/Global/getbyfiltros3`, Datos, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${oidc.user.access_token}`,
                },
            })
            .then((respuesta) => {
                Resolver(respuesta.data);
            })
            .catch((error) => {
                Denegar(error);
            });
    });