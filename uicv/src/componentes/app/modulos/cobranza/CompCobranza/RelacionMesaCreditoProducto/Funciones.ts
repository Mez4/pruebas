import axios from "axios"
import { resolve } from "dns"
import { GetServerUrl } from "../../../../../../global/variables"
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'


type ProspectoPersonaType = {
    AsentamientoID: number
    Calle: string
    NumeroExterior: string
    identificacionNumero: string,
    vialidadTipoId: number,
    orientacionVialidadTipoId: number,
    viviendaTipoId: number,
    DistribuidorID: number,
    Nota: string,
    GestorID: number,
    idRelMesaCredProd: number,
    ReferenciasGeograficas: string

}

export const FNGet = (oidc: IOidc, Datos: { ProductoID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/get`, Datos, {
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

 
export const FnValidaAsignacion = (oidc: IOidc,   ProductoID: number ) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/validaAsignacion`, {ProductoID} , {
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

export const FNGetDirectores = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/getDirectores`, {}, {
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

export const FNAdd = (oidc: IOidc, Datos: { idTabMora: number, lMesaCobranzaID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        // console.log('Datos', Datos);
        // console.log(GetServerUrl())
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/add`, Datos, {
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

export const FNUpdate = (oidc: IOidc, Datos: { Resultado: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/update`, Datos, {
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

export const FNValidacionAltaRelacionMesaProducto = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/ValidacionAltaRelacionMesaProducto`, {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                console.log('error: ', error)
                Denegar(error)
            })
    })

    export const FNGetMesaC = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/getMesaCobranza`, {}, {
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

export const FNGetTabMora = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/getTabMora`, {}, {
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

export const GetDistribuidoresDiasAtrasos = (oidc: IOidc, Datos: { idRelMesaCredProd: number, ProductoID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        //console.log(limInferiorDias, 'AAAAA')
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/getDistribuidoresDiasAtrasos`, Datos, {
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

export const FNAsignarGestor = (oidc: IOidc, Datos: { DistribuidorID: number, DistribuidorDesc: string, SucursalDesc: string, DiasAtraso: number, GestorId: number, GestorDesc: string, ColorAsignaGestor: string, ColorReferencias: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        //console.log(limInferiorDias, 'AAAAA')
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/AsignarGestor`, Datos, {
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

export const FNGetReferencias = (oidc: IOidc, DistribuidorID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/getReferencias`, { DistribuidorID }, {
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

export const FNGetDocumentos = (oidc: IOidc, DistribuidorID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/getDocumentos`, { DistribuidorID }, {
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

export const FNGetVerDocumentos = (oidc: IOidc, PersonasDocID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
       // console.log('Datos', PersonasDocID);
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/getVerDocumentos`, { PersonasDocID }, {
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

export const FNObtenerPersona = (oidc: IOidc, PersonaID: any) =>
    new Promise((Resolver: any, Denegar: any) => {
       // console.log('Datos: ', PersonaID)
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/GetPerfil`, { PersonaID }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                console.log('error: ', error)
                Denegar(error)
            })
    })

export const FNGetIne = (oidc: IOidc, PersonaID: number, Clave: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/getIne`, { PersonaID, Clave }, {
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


export const FNGetGrupo = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/getGrupo`, {}, {
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

export const FNGetDistribuidores = (oidc: IOidc, ProductoID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/getDistribuidores`, { ProductoID }, {
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

export const FNGetFiltroDistribuidor = (oidc: IOidc, DistribuidorID: number, ProductoID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/FiltroDistribuidor`, { DistribuidorID, ProductoID }, {
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

export const FNGetReferenciasAvales = (oidc: IOidc, DistribuidorID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/getReferenciaAvales`, { DistribuidorID }, {
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

export const getAsignarDistribuidor = (oidc: IOidc, ProductoID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/getAsignarDistribuidor`, { ProductoID }, {
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

export const getMotivosAsignacion = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/getMotivosAsignacion`, {}, {
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

export const AsignarDistribuidor = (oidc: IOidc, DistribuidorID: number, MesaCobranzaID: number, MotivoID: number, DiasAtraso: number, Capital: number, SaldoActual: number, ProductoID: number, idRelMesaCredProd: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        //console.log('Datos', Datos);
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/AsignarDistribuidor`, { DistribuidorID, MesaCobranzaID, MotivoID, DiasAtraso, Capital, SaldoActual, ProductoID, idRelMesaCredProd }, {
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

export const RelacionMesaProducto = (oidc: IOidc, idRelMesaCredProd: number, ProductoID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/getRelacion`, { idRelMesaCredProd, ProductoID }, {
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


// se comenta porque esta funcion se carga ahora desde  //  const RelacionMesaProducto 
// export const getGestorCobranza = (oidc: IOidc, idRelMesaCredProd: number) =>
//     new Promise((Resolver: any, Denegar: any) => {
//         axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/getGestorCobranza`, { idRelMesaCredProd }, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${oidc.user.access_token}`
//             }
//         })
//             .then(respuesta => {
//                 Resolver(respuesta.data)
//             })
//             .catch(error => {
//                 Denegar(error)
//             })
//     })

export const ValidarBit = (oidc: IOidc, idRelMesaCredProd: number, GestorID: number, Filtro: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/ValidacionBitMesaCobranza`, { idRelMesaCredProd, GestorID, Filtro }, {
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


export const FNGetDireccion = (oidc: IOidc, PersonaID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/getDirecciones`, { PersonaID }, {
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

export const FNAgregarDireccion = (oidc: IOidc, Datos: ProspectoPersonaType) =>
    new Promise((Resolver: any, Denegar: any) => {

        //console.log(Datos, 'LLEGO124')

        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/addDireccion`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                console.log('error: ', error)
                Denegar(error)
            })
    })

export const getSucursales = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/getSucursales`, {}, {
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


export const ValidacionAsignaGestor = (oidc: IOidc, DistribuidorID: number, MesaCobranzaID: number, ProductoID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/ValidacionAsignaGestor`, { DistribuidorID, MesaCobranzaID, ProductoID }, {
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

export const getTipoCobranza = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/RelacionMesaCreditoProducto/getTipoCobranza`, {}, {
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


