import { GetServerUrl } from './../../../../global/variables'
import axios from 'axios'
// Interfaces de base de datos
import { DBConfia_General } from '../../../../interfaces_db/DBConfia/General'
import { DBConfia_Prospectos } from '../../../../interfaces_db/DBConfia/Prospectos'
import { DBConfia_Aclaraciones } from '../../../../interfaces_db/DBConfia/Aclaraciones'
// Interfaces de operaciones
import { IOidc } from './../../../../interfaces/oidc/IOidc'
import { DBConfia_Distribuidores } from '../../../../interfaces_db/DBConfia/Distribuidores'
/**
 * Obtiene el detallde de un socia
 * @param {IOidc} oidc Parametros de seguridad 
 * @param {number} DistribuidorID Id del socia para la peticion rest
 * @returns {DBConfia_General.IPersonasDatosBancarios} Registro de la base de datos
 */
export const
    FNObtenerPorId = (oidc: IOidc, personaID: number): Promise<DBConfia_General.IPersonasDatosBancarios_VW[]> =>
        new Promise((Resolver, Denegar) => {
            axios.get(`${GetServerUrl()}General/PersonaDatosBancarios/getDatosancariosByPersona/${personaID}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${oidc.user.access_token}`
                }
            }).then(respuesta => {
                Resolver(respuesta.data)
            }).catch(error => {
                Denegar(error)
            })
        })
export const
    FNObtenerDatoBanc = (oidc: IOidc, personaID: number): Promise<DBConfia_General.IPersonasDatosBancarios_VW[]> =>
        new Promise((Resolver, Denegar) => {
            axios.get(`${GetServerUrl()}General/PersonaDatosBancarios/getDatosancariosPersona/${personaID}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${oidc.user.access_token}`
                }
            }).then(respuesta => {
                Resolver(respuesta.data)
            }).catch(error => {
                Denegar(error)
            })
        })
export const
    FNObtenerDocsPorId = (oidc: IOidc, personaID: number): Promise<DBConfia_Prospectos.IDocumentos[]> =>
        new Promise((Resolver, Denegar) => {
            axios.get(`${GetServerUrl()}Administracion/Personas/getDocumentosByPersona/${personaID}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${oidc.user.access_token}`
                }
            }).then(respuesta => {
                Resolver(respuesta.data)
            }).catch(error => {
                Denegar(error)
            })
        })
export const
    FNgetBuroByPersona = (oidc: IOidc, personaID: number): Promise<DBConfia_General.IConsultaBuro[]> =>
        new Promise((Resolver, Denegar) => {
            axios.get(`${GetServerUrl()}Administracion/Personas/getBuroByPersona/${personaID}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${oidc.user.access_token}`
                }
            }).then(respuesta => {
                Resolver(respuesta.data)
            }).catch(error => {
                Denegar(error)
            })
        })
export const FnGetBancos = (oidc: IOidc, BancoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Bancos/Banco/get`, { "id": BancoID }, {
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
export const FnGetBancosById = (oidc: IOidc, BancoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Bancos/Banco/getBanco`, { "id": BancoID }, {
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
export const FnGetTipos = (oidc: IOidc, datoTipoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Bancos/DatosBancariosTipo/get`, { "id": datoTipoID }, {
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
export const FnGetTiposBanco = (oidc: IOidc, datoTipoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Bancos/DatosBancariosTipo/getTipoBanco`, { "id": datoTipoID }, {
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
export const FnGetsucursalesTotal = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Aclaraciones/Aclaracion/obtenerSucursalesSelect`, {
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

export const FnGetTiposProductos = (oidc: IOidc, DistribuidorID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Aclaraciones/Aclaracion/obtenerProductos/${DistribuidorID}`, {
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


export const FNGetEsDistribuidor = (oidc: IOidc, personaID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Bancos/DatosBancariosTipo/esDistribuidor/${personaID > 0 ? personaID : 0}`, {
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



/********************************************ACLARACIONES*******************************************/
export const
    FNObtenerAclaraciones = (oidc: IOidc, personaID: number): Promise<DBConfia_Aclaraciones.IAclaraciones[]> =>
        new Promise((Resolver, Denegar) => {
            axios.get(`${GetServerUrl()}Aclaraciones/Aclaracion/getAclaracionPersona/${personaID}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${oidc.user.access_token}`
                }
            }).then(respuesta => {
                Resolver(respuesta.data)
            }).catch(error => {
                Denegar(error)
            })
        })



export const FNGetAclara = (Seguridad: IOidc, Id?: number): Promise<DBConfia_Aclaraciones.IAclaraciones[]> =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Aclaraciones/Aclaracion/obtenerAclaracion`, { //ruta del controlador (api)
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Seguridad.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })
export const FNAddAclara = (Seguridad: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Aclaraciones/Aclaracion/altaAclaracion`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Seguridad.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })
export const FNUpdateAclara = (Seguridad: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Aclaraciones/Aclaracion/actualizaAclaracion`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Seguridad.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })
export const FNGetPersonaPOST = (oidc: IOidc, Datos?: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}General/Persona/show`, Datos, {
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
export const FNGetPersona = (oidc: IOidc, Datos?: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Aclaraciones/Analistas/show`, Datos, {
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
export const FNGetSucursal = (oidc: IOidc, Datos?: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Aclaraciones/Aclaracion/showSucursal`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log(respuesta.data)
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })
export const FNGetSucursales = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}general/sucursal/get`, {}, {
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
export const FNGetTipoMesaAclaracion = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Aclaraciones/MesaAclaracion/obtenerMesaAclaracion`, { //ruta del controlador (api)
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Seguridad.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })
export const FNGuardarTipoMesaAclaracion = (Seguridad: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Aclaraciones/MesaAclaracion/altaMesaAclaracion`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Seguridad.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })
export const FNGetTipoBonidicacion = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Aclaraciones/Bonificaciones/obtenerBonificacion`, { //ruta del controlador (api)
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Seguridad.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })
export const FNGetTipoEstatus = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Aclaraciones/Estatus/obtenerEstatus`, { //ruta del controlador (api)
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Seguridad.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })
export const FNGuardarTipoBonidicacion = (Seguridad: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Aclaraciones/Bonificaciones/altaBonificacion`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Seguridad.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })
export const FNGetMesas = (oidc: IOidc, AnalistaID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/obtenerMesas`, { "id": AnalistaID }, {
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
export const FnGetAnalistas = (oidc: IOidc, AnalistaID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/getAnalistas`, { "id": AnalistaID }, {
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
export const FNGetCreditos = (oidc: IOidc, Datos?: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Aclaraciones/Aclaracion/showCreditos`, Datos, {
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


export const FNGetTiposSolicitudAclaraciones = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Aclaraciones/TiposAclaraciones/obtenerTiposSolicitud`, { //ruta del controlador (api)
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Seguridad.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNGetCondicionesAdminProd = (oidc: IOidc, Datos: {
    ProductoID: number,
    SucursalID: number,
    DistribuidorID: number,
}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/condiciondetallevw/getAdminProd`, Datos, {
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
        axios.post(`${GetServerUrl()}distribuidores/distribuidor/getBySucursalProd`, { SucursalID, GrupoID }, {
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

/**********************************************INCREMENTOS*********************************************/
export const
    FNGetObtenerIncrementos = (oidc: IOidc, personaID: number): Promise<DBConfia_Distribuidores.ISolicitudesIncrementos[]> =>
        new Promise((Resolver, Denegar) => {
            axios.get(`${GetServerUrl()}Distribuidores/SolicitudesIncrementos/getIncrementosPersona/${personaID}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${oidc.user.access_token}`
                }
            }).then(respuesta => {
                Resolver(respuesta.data)
            }).catch(error => {
                Denegar(error)
            })
        })

export const
    FNGetObtenerAumentosNivel = (oidc: IOidc, personaID: number): Promise<DBConfia_Distribuidores.ISolicitudesAumentoNivel[]> =>
        new Promise((Resolver, Denegar) => {
            axios.get(`${GetServerUrl()}Distribuidores/SolicitudesIncrementos/getAumentosNivelPersona/${personaID}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${oidc.user.access_token}`
                }
            }).then(respuesta => {
                Resolver(respuesta.data)
            }).catch(error => {
                Denegar(error)
            })
        })

export const
    FnObtenerDistibuidoresporID = (oidc: IOidc, personaID: number) =>
        new Promise((Resolver, Denegar) => {
            axios.get(`${GetServerUrl()}Distribuidores/SolicitudesIncrementos/getDistribuidorNivel/${personaID}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${oidc.user.access_token}`
                }
            }).then(respuesta => {
                Resolver(respuesta.data)
            }).catch(error => {
                Denegar(error)
            })
        })


export const FNGetIncrem = (Seguridad: IOidc, Id?: number): Promise<DBConfia_Distribuidores.ISolicitudesIncrementos[]> =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Distribuidores/SolicitudesIncrementos/obtenerSolicitudIncremento`, { //ruta del controlador (api)
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Seguridad.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNAltaIncremento = (oidc: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidores/solicitudesincrementos/altaSolicitudIncremento`, Datos, {
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


/**********************************************PRÉSTAMOS_PERSONALES*********************************************/
export const FNGetObtenerPrestamos = (oidc: IOidc, personaID: number): Promise<DBConfia_Distribuidores.ISolicitudesPrestamosPersonales[]> =>
    new Promise((Resolver, Denegar) => {
        axios.get(`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/getPrestamosPersona/${personaID}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        }).then(respuesta => {
            Resolver(respuesta.data)
        }).catch(error => {
            Denegar(error)
        })
    })

export const FNAltaPrestamo = (oidc: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log("SentDatos:",Datos)
        axios.post(`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/altaSolicitudPrestamo`, Datos, {
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

export const FNGetContrato = (oidc: IOidc, DistribuidorID: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/obtenerContrato/${DistribuidorID}`, {
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


export const altaSolicitudAumentoNivel = (oidc: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidores/solicitudesincrementos/altaSolicitudAumentoNivel`, Datos, {
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

export const FnGetIncrementosProductos = (oidc: IOidc, EmpresaId?: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Distribuidores/SolicitudesIncrementos/getIncrementosProductos`, EmpresaId, {
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

/*export const FnGetTiposProductosIncrementos = (oidc: IOidc, DistribuidorID?: number) =>
new Promise((Resolver: any, Denegar: any) => {
    axios.get(`${GetServerUrl()}Distribuidores/SolicitudesIncrementos/obtenerProductos/${DistribuidorID}`, {
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
})*/

/**********************************************SOLICITUDES_HERRAMIENTAS*******************************************/
export const FNGetObtenerHerramientas = (oidc: IOidc, personaID: number): Promise<DBConfia_Distribuidores.ISolicitudesPrestamosPersonales[]> =>
    new Promise((Resolver, Denegar) => {
        axios.get(`${GetServerUrl()}Reestructura/HDR/getHerramientas/${personaID}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        }).then(respuesta => {
            Resolver(respuesta.data)
        }).catch(error => {
            Denegar(error)
        })
    })

export const FNGetSimulacionPlazos = async (oidc: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Reestructura/HDR/obtenerPlazoSimulacion`, Datos, {
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

export const FNGetTipoUsuario = (oidc: IOidc, data: { usuarioID: number | undefined }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}SOMA/ArqueosDesembolso/TUArqueosDesembolso`, {}, {
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

export const FNValidar = async (oidc: IOidc, SolicitudRCID: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Reestructura/HDR/ValidarSolicitud`, { SolicitudRCID }, {
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

export const FNRechazar = async (oidc: IOidc, SolicitudRCID: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Reestructura/HDR/RechazarSolicitud`, { SolicitudRCID }, {
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

export const FNReValidar = async (oidc: IOidc, SolicitudRCID: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Reestructura/HDR/ReValidarSolicitud`, { SolicitudRCID }, {
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

export const FNPdf = (oidc: IOidc, SolicitudRCID: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Reestructura/HDR/pdf`, { SolicitudRCID }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            },
            responseType: 'blob'
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })
/**********************************************EVIDENCIA*********************************************/
export const FNSubirEvidencia = (oidc: IOidc, Datos: FormData) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Aclaraciones/Aclaracion/subirEvidencia`, Datos, {
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
export const FnGetEvidencia = (oidc: IOidc, AclaracionID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Aclaraciones/Aclaracion/getEvidencia`, { AclaracionID }, {
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

//Evidencia Prestamo Personal
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

export const FnGetEvidenciaPrestamo = (oidc: IOidc, SolicitudPrestamoPersonalID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/getEvidencia`, { SolicitudPrestamoPersonalID }, {
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



//Fin Evidencia Prestamo Personal

export const FNGetNotas = (oidc: IOidc, datos: { DistribuidorID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Creditos/notasrapidas/getNotas`, datos, {
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


export const FNGet = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/obtenerSolicitudPrestamo`, { //ruta del controlador (api)
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Seguridad.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNGetPlanPagos = (oidc: IOidc, SolicitudPrestamoPersonalID: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/obtenerPlanDePagos/${SolicitudPrestamoPersonalID}`, {
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

export const FNGetAplicacionesSocia = async (oidc: IOidc, Datos: { SucursalID: number,
    DistribuidorID: number}) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/AplicaPagos/getAplicacionesSociaVrCv`, Datos, {
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
    

