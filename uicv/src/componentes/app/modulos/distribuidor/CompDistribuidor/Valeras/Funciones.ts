import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'
import * as pako from 'pako';

export const FNGet = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidor/Valeras/get`, {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                let dcData = decompressBase64(respuesta.data)
                Resolver(dcData)
            })
            .catch(error => {
                Denegar(error)
            })
    })

/**
 * Funcion para agregar un tipo de vivienda
 * @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
 * @param Datos Datos a subir
 * @returns any
 */
export const FNAdd = (oidc: IOidc, Datos: { ProductoID: number, DistribuidorID: number, serieId: string, FolioInicial: number, FolioFinal: number, Estatus: string, RegistroFecha?: Date, RegistroUsuarioId: string, AsignaSucursalId: number, AsignaSucursalUsuarioId: string, ReciboSucursalUsuarioId: string, AsignaDistribudiorUsuarioId: string, CanceladoUsuarioId: string, ValeraTrackingEstatusID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        //Datos.RegistroUsuarioId = '0' 
        axios.post(`${GetServerUrl()}distribuidor/Valeras/add`, Datos, {
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

/**
* Funcion para actualizar un tipo de vivienda
* @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
* @param Datos Datos a subir
* @returns any
*/
export const FNUpdate = (oidc: IOidc, Datos: { ProductoID: number, DistribuidorID: number, serieId: string, FolioInicial: number, FolioFinal: number, Estatus: string, RegistroFecha?: Date, RegistroUsuarioId: string, AsignaSucursalId: number, AsignaSucursalUsuarioId: string, ReciboSucursalUsuarioId: string, AsignaDistribudiorUsuarioId: string, CanceladoUsuarioId: string, ValeraTrackingEstatusID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidor/Valeras/update`, Datos, {
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

/**
* Funcion para actualizar un tipo de vivienda
* @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
* @param Datos Datos a subir
* @returns any
*/
export const FNUpdateSucursal = (oidc: IOidc, Datos: { ProductoID: number, DistribuidorID: number, serieId: string, FolioInicial: number, FolioFinal: number, Estatus: string, RegistroFecha?: Date, RegistroUsuarioId: string, AsignaSucursalId: number, AsignaSucursalUsuarioId: string, ReciboSucursalUsuarioId: string, AsignaDistribudiorUsuarioId: string, CanceladoUsuarioId: string, ValeraTrackingEstatusID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidor/Valeras/updateSucursal`, Datos, {
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

export const FNUpdateSucursalM = (oidc: IOidc, Datos: { ProductoID: number, DistribuidorID: number, serieId: string, FolioInicial: number, FolioFinal: number, Estatus: string, RegistroFecha?: Date, RegistroUsuarioId: string, AsignaSucursalId: number, AsignaSucursalUsuarioId: string, ReciboSucursalUsuarioId: string, AsignaDistribudiorUsuarioId: string, CanceladoUsuarioId: string, ValeraTrackingEstatusID: number, Valeras: [] }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('Datos', Datos)
        axios.post(`${GetServerUrl()}distribuidor/Valeras/updateSucursalM`, Datos, {
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

export const FNREUpdateSucursalM = (oidc: IOidc, Datos: { ProductoID: number, DistribuidorID: number, serieId: string, FolioInicial: number, FolioFinal: number, Estatus: string, RegistroFecha?: Date, RegistroUsuarioId: string, AsignaSucursalId: number, AsignaSucursalUsuarioId: string, ReciboSucursalUsuarioId: string, AsignaDistribudiorUsuarioId: string, CanceladoUsuarioId: string, ValeraTrackingEstatusID: number, Valeras: [] }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('Datos', Datos)
        axios.post(`${GetServerUrl()}distribuidor/Valeras/reupdateSucursalM`, Datos, {
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

export const FNGetFileM = (oidc: IOidc, Datos: { ProductoID: number, DistribuidorID: number, serieId: string, FolioInicial: number, FolioFinal: number, Estatus: string, RegistroFecha?: Date, RegistroUsuarioId: string, AsignaSucursalId: number, AsignaSucursalUsuarioId: string, ReciboSucursalUsuarioId: string, AsignaDistribudiorUsuarioId: string, CanceladoUsuarioId: string, ValeraTrackingEstatusID: number, Valeras: [] }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidor/Valeras/getFileM`, Datos, {
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

export const FNUpdateEnvioM = (oidc: IOidc, Datos: { ProductoID: number, DistribuidorID: number, serieId: string, FolioInicial: number, FolioFinal: number, Estatus: string, RegistroFecha?: Date, RegistroUsuarioId: string, AsignaSucursalId: number, AsignaSucursalUsuarioId: string, ReciboSucursalUsuarioId: string, AsignaDistribudiorUsuarioId: string, CanceladoUsuarioId: string, ValeraTrackingEstatusID: number, Valeras: [] }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('Datos', Datos)
        axios.post(`${GetServerUrl()}distribuidor/Valeras/updateEnvioM`, Datos, {
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

export const FNUpdateReciboM = (oidc: IOidc, Datos: { ProductoID: number, DistribuidorID: number, serieId: string, FolioInicial: number, FolioFinal: number, Estatus: string, RegistroFecha?: Date, RegistroUsuarioId: string, AsignaSucursalId: number, AsignaSucursalUsuarioId: string, ReciboSucursalUsuarioId: string, AsignaDistribudiorUsuarioId: string, CanceladoUsuarioId: string, ValeraTrackingEstatusID: number, Valeras: [] }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('Datos', Datos)
        axios.post(`${GetServerUrl()}distribuidor/Valeras/updateReciboM`, Datos, {
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

export const FNUpdateREEnvioM = (oidc: IOidc, Datos: { ProductoID: number, DistribuidorID: number, serieId: string, FolioInicial: number, FolioFinal: number, Estatus: string, RegistroFecha?: Date, RegistroUsuarioId: string, AsignaSucursalId: number, AsignaSucursalUsuarioId: string, ReciboSucursalUsuarioId: string, AsignaDistribudiorUsuarioId: string, CanceladoUsuarioId: string, ValeraTrackingEstatusID: number, Valeras: [] }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('Datos', Datos)
        axios.post(`${GetServerUrl()}distribuidor/Valeras/updateREEnvioM`, Datos, {
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

/**
* Funcion para actualizar un tipo de vivienda
* @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
* @param Datos Datos a subir
* @returns any
*/
export const FNUpdateReciboSucursal = (oidc: IOidc, Datos: { ProductoID: number, DistribuidorID: number, serieId: string, FolioInicial: number, FolioFinal: number, Estatus: string, RegistroFecha?: Date, RegistroUsuarioId: string, AsignaSucursalId: number, AsignaSucursalUsuarioId: string, ReciboSucursalUsuarioId: string, AsignaDistribudiorUsuarioId: string, CanceladoUsuarioId: string, ValeraTrackingEstatusID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidor/Valeras/updateReciboSucursal`, Datos, {
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

/**
* Funcion para actualizar un tipo de vivienda
* @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
* @param Datos Datos a subir
* @returns any
*/
export const FNUpdateEnviadoSucursal = (oidc: IOidc, Datos: { ProductoID: number, DistribuidorID: number, serieId: string, FolioInicial: number, FolioFinal: number, Estatus: string, RegistroFecha?: Date, RegistroUsuarioId: string, AsignaSucursalId: number, AsignaSucursalUsuarioId: string, ReciboSucursalUsuarioId: string, AsignaDistribudiorUsuarioId: string, CanceladoUsuarioId: string, ValeraTrackingEstatusID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidor/Valeras/updateEnviadoSucursal`, Datos, {
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

/**
* Funcion para actualizar un tipo de vivienda
* @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
* @param Datos Datos a subir
* @returns any
*/
export const FNUpdateDistribuidor = (oidc: IOidc, Datos: { ProductoID: number, DistribuidorID: number, serieId: string, FolioInicial: number, FolioFinal: number, Estatus: string, RegistroFecha?: Date, RegistroUsuarioId: string, AsignaSucursalId: number, AsignaSucursalUsuarioId: string, ReciboSucursalUsuarioId: string, AsignaDistribudiorUsuarioId: string, CanceladoUsuarioId: string, ValeraTrackingEstatusID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidor/Valeras/updateDistribuidor`, Datos, {
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

/**
* Funcion para actualizar un tipo de vivienda
* @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
* @param Datos Datos a subir
* @returns any
*/
export const FNGetFile = (oidc: IOidc, Datos: { ProductoID: number, DistribuidorID: number, serieId: string, FolioInicial: number, FolioFinal: number, Estatus: string, RegistroFecha?: Date, RegistroUsuarioId: string, AsignaSucursalId: number, AsignaSucursalUsuarioId: string, ReciboSucursalUsuarioId: string, AsignaDistribudiorUsuarioId: string, CanceladoUsuarioId: string, ValeraTrackingEstatusID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidor/Valeras/getFile`, Datos, {
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

/**
* Funcion para actualizar un tipo de vivienda
* @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
* @param Datos Datos a subir
* @returns any
*/
export const FNSubirExpediente = (oidc: IOidc, Datos: FormData) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidor/Valeras/subirExpediente`, Datos, {
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

export const FNSubirExpedienteEvidencia = (oidc: IOidc, Datos: FormData) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidor/Valeras/subirExpedienteEvidencia`, Datos, {
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

export const FNSubirExpedienteEvidenciaImg = (oidc: IOidc, Datos: FormData) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidor/Valeras/subirExpedienteEvidenciaImg`, Datos, {
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

export const FNGetDocsByValeraID = (oidc: IOidc, Datos: {ValeraID}) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('xxx', Datos)
        axios.post(`${GetServerUrl()}distribuidor/Valeras/GetDocsByValeraID`, Datos, {
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

export const FNGetImgsByValeraID = (oidc: IOidc, Datos: {ValeraID}) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('xxx', Datos)
        axios.post(`${GetServerUrl()}distribuidor/Valeras/GetImgByValeraID`, Datos, {
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

export const FNGetDocsByDocumentoPath = (oidc: IOidc, DocumentoID?: number, DocumentoPath?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidor/Valeras/GetDocsByDocumentoPath`, { DocumentoID, DocumentoPath }, {
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

/**
* Funcion para actualizar un tipo de vivienda
* @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
* @param Datos Datos a subir
* @returns any
*/
export const FNCancelarValera = (oidc: IOidc, Datos: { ProductoID: number, DistribuidorID: number, serieId: string, FolioInicial: number, FolioFinal: number, Estatus: string, RegistroFecha?: Date, RegistroUsuarioId: string, AsignaSucursalId: number, AsignaSucursalUsuarioId: string, ReciboSucursalUsuarioId: string, AsignaDistribudiorUsuarioId: string, CanceladoUsuarioId: string, ValeraTrackingEstatusID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}distribuidor/Valeras/cancelValera`, Datos, {
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
        axios.post(`${GetServerUrl()}distribuidor/Valeras/TipoUsuario`, {}, {
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
    function decompressBase64(base64CompressedString: string): string {
        // Step 1: Decode the Base64 string to a byte array
        const compressedBytes = Uint8Array.from(atob(base64CompressedString), c => c.charCodeAt(0));
    
        // Step 2: Decompress the byte array using pako.inflate (GZIP decompression)
        const decompressedBytes = pako.inflate(compressedBytes);
    
        // Step 3: Convert the decompressed byte array to a string (UTF-8)
        const decompressedString = new TextDecoder().decode(decompressedBytes);
    // Step 4: Parse the string into an array of JSON objects
        const jsonArray = JSON.parse(decompressedString);
    
        return jsonArray;
    }
    