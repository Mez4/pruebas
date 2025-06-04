import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNGet = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidores/distribuidor/get`, {}, {
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

export const FNCancelarTemporalmente = (oidc: IOidc, datos: { Id: number, DistribuidoresEstatusID: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidores/distribuidor/cancelartemp`, datos, {
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

// Se creo como separacion del metodo,FNCancelarTemporalmente 
export const FNActivarTemporalmente = (oidc: IOidc, datos: { Id: number, DistribuidoresEstatusID: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidores/distribuidor/activar`, datos, {
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


export const FNCancelarPermanente = (oidc: IOidc, datos: { Id: number, DistribuidoresEstatusID: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidores/distribuidor/cancelarpermanente`, datos, {
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

export const FNCancelarTemporalmenteC = (oidc: IOidc, datos: { Id: number, CanjeaVale: boolean }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidores/cliente/cancelartempc`, datos, {
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

export const FNGetSinGrupo = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidores/distribuidor/GetInfo`, {}, {
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

export const FNGetBySucursal = (oidc: IOidc, SucursalID?: number, GrupoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidores/distribuidor/getbysucursal`, { SucursalID, GrupoID }, {
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

export const FNGetBySucursalProd = (oidc: IOidc, SucursalID?: number, GrupoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidores/distribuidor/getByZonaProd`, { SucursalID, GrupoID }, {
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

export const FNGetDistribuidor = (oidc: IOidc, Datos: { Id: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios
            .post(`${GetServerUrl()}Distribuidores/Distribuidor/get`, Datos, {
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

export const FNGetByCoordinadorSucursal = (oidc: IOidc, SucursalID: number, CoordinadorID: number, fechaCorte: string,) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidores/distribuidor/getByCoordinadorSucursal`, { SucursalID, CoordinadorID, fechaCorte }, {
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

export const FNGetByCoordinadorSucursalHistorico = (oidc: IOidc, SucursalID: number, CoordinadorID: number, fechaCorte: string,) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidores/distribuidor/getByCoordinadorSucursalHistorico`, { SucursalID, CoordinadorID, fechaCorte }, {
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



export const getFoliosValera = (oidc: IOidc, Id: number, SerieId: number, Folio: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidores/distribuidor/getfoliosvalera`, { Id, SerieId, Folio }, {
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

export const FNLealtadAuth = (SucursalID?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`https://lealtad.confiashop.com/api/Auth/login`, { email: 'jjaramillo@fconfia.com', password: 'jjaramillo' }, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNLealtadGet = (Distribuidor: string, token: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`https://lealtad.confiashop.com/api/Lealtad?id_usuario=${Distribuidor}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNGetNivelProducto = (oidc: IOidc, ProductoID: number, DistribuidorID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidores/distribuidor/getNivelProducto`, { ProductoID, Id: DistribuidorID }, {
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


export const FNAgregarAval = (oidc: IOidc, Datos: any, distribuidorID?: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(distribuidorID, 'Datos: ', Datos)
        axios.post(`${GetServerUrl()}distribuidores/distribuidor/AddAval`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log(respuesta.data, 'respuesta')
                Resolver(respuesta.data)
            })
            .catch(error => {
                console.log('error: ', error)
                Denegar(error)
            })
    })

export const FNGetDistSucursal = (oidc: IOidc, Nombre: string, SucursalID?: number, GrupoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidores/distribuidor/getdistsuc`, { Nombre }, {
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

export const FNGetbyZona = (oidc: IOidc, SucursalID: number, Nombre?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidores/distribuidor/getbyzona`, { SucursalID }, {
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


export const FNGetNivelDistribuidor = (oidc: IOidc, ProductoID: number, DistribuidorID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidores/distribuidor/getNivelTiendita`, { ProductoID, DistribuidorID }, {
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

export const FNGetDistribuidorMonedero = (oidc: IOidc, ProductoID: number, DistribuidorID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidores/distribuidor/getMonederoTiendita`, { ProductoID, DistribuidorID }, {
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