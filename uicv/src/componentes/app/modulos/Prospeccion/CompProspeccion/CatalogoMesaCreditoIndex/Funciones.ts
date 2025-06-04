import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

/**
 * Funcion para obtener los tipos de vivienda
 * @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
 * @param {number} Id Datos a subir
 * @returns any
 */
export const FNGetBuro = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/getMesaCreditoBuro`, {}, {
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

export const FNGet = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/getMesaCreditoIndex`, {}, {
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

export const FNGetLlamadas = (oidc: IOidc, ProspectoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/getMesaCreditoLlamadas`, {}, {
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

export const FNGetActivo = (oidc: IOidc, Activo?: boolean) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/getActivo`, {}, {
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
 * Funcion para agregar un tipo de vivienda
 * @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
 * @param Datos Datos a subir
 * @returns any
 */
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

/**
 * Funcion para agregar un tipo de vivienda
 * @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
 * @param Datos Datos a subir
 * @returns any
 */
export const FNAsignaAnalista = (oidc: IOidc, Datos: { ProspectoID: number, PersonaAnalistaID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/AsignaAnalista`, Datos, {
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

export const FNAsignaAnalistaM = (oidc: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/AsignaAnalistaM`, Datos, {
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

export const FNGetDocumentos = (oidc: IOidc, ProspectoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('Datos', ProspectoID);
        axios.post(`${GetServerUrl()}Prospeccion/DocumentosMesaDeCredito/getDocumentos`, { ProspectoID }, {
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

export const FNGetVerDocumentos = (oidc: IOidc, DocumentoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('Datos', DocumentoID);
        axios.post(`${GetServerUrl()}Prospeccion/DocumentosMesaDeCredito/GetVerDocumentos`, { DocumentoID }, {
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

export const FNGetLogTiempos = (oidc: IOidc, ProspectoID?: number, nombreP?: String) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/getLogTiempos`, { "id": ProspectoID, "nombreP": nombreP }, {
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

export const FNupdateAutorizaDocumento = (oidc: IOidc, DocumentoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        //console.log('Datos', DocumentoID);
        axios.post(`${GetServerUrl()}Prospeccion/DocumentosMesaDeCredito/updateAutorizaDocumeto`, { DocumentoID }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log('')
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNGetNotificaciones = (oidc: IOidc, ProspectoID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/Prospectos/GetMesajesByProspectoID`, { ProspectoID }, {
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

export const FNEviarMsjPromotorSucursal = (oidc: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/EviarMsjPromotorSucursal`, Datos, {
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

export const FNGetNotificacionLeida = (oidc: IOidc, ProspectoID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/NotificacionLeida`, { ProspectoID }, {
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

export const FNGetLogMensajes = (oidc: IOidc, ProspectoID?: number, nombreP?: String) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/getLogMesajes`, { "id": ProspectoID, "nombreP": nombreP }, {
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

export const FNupdateConfirmarDocumentos = (oidc: IOidc, ProspectoID?: number, Identificador?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        // console.log('Datos', Datos);
        axios.post(`${GetServerUrl()}Prospeccion/DocumentosMesaDeCredito/updateConfirmarDocumentos`, { ProspectoID, Identificador }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log('')
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNupdateRechazaDocumento = (oidc: IOidc, Datos: { DocumentoID?: number, Nota?: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        // console.log('Datos', Datos);
        axios.post(`${GetServerUrl()}Prospeccion/DocumentosMesaDeCredito/updateRechazaDocumento`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log('')
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNupdateProceso = (oidc: IOidc, ProspectoID?: number, Identificador?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        // console.log('Datos', Datos);
        axios.post(`${GetServerUrl()}Prospeccion/DocumentosMesaDeCredito/updateProceso`, { ProspectoID, Identificador }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log('')
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNupdateValidarDocumentos = (oidc: IOidc, ProspectoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(ProspectoID);
        axios.post(`${GetServerUrl()}Prospeccion/DocumentosMesaDeCredito/updateValidarDocumentos`, { ProspectoID }, {

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log('')
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })


export const FNGetInfoTitular = (oidc: IOidc, ProspectoID?: number, nombreP?: String) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/getInfoTitular`, { "id": ProspectoID, "nombreP": nombreP }, {
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

export const FNupdateConfirmarDocumentosAvales = (oidc: IOidc, ProspectoID?: number, Identificador?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        //console.log(ProspectoID);
        axios.post(`${GetServerUrl()}Prospeccion/Avales/updateConfirmarDocumentosAvales`, { ProspectoID, Identificador }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log('')
                Resolver(respuesta.data)
            })
            .catch(error => {
                console.log(error)
                Denegar(error)
            })
    })


export const FNupdateProcesoTitular = (oidc: IOidc, ProspectoID?: number, Identificador?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/updateProcesoTitular`, { ProspectoID, Identificador }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log(respuesta, 'resp update proce')
                Resolver(respuesta.data)
            })
            .catch(error => {
                console.log(error)
                Denegar(error)
            })
    })

export const FNGetVerDocumentosAvales = (oidc: IOidc, DocumentoAvalID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/Avales/GetVerDocumentosAvales`, { DocumentoAvalID }, {
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

export const FNGetFirmaAval = (oidc: IOidc, AvalID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/Avales/GetFirmaAval`, { AvalID }, {
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

export const FNupdateAutorizaDocumentoAval = (oidc: IOidc, DocumentoAvalID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(DocumentoAvalID)
        //console.log('Datos', DocumentoID);
        axios.post(`${GetServerUrl()}Prospeccion/Avales/updateAutorizaDocumetoAval`, { DocumentoAvalID }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log('')
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNupdateRechazaDocumentoAval = (oidc: IOidc, Datos: { DocumentoAvalID?: number, Nota?: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        // console.log('Datos', Datos);
        axios.post(`${GetServerUrl()}Prospeccion/Avales/updateRechazaDocumetoAval`, Datos, {

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log('')
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })


export const FNupdateVerificaTitular = (oidc: IOidc, ProspectoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/updateVerificaTitular`, { ProspectoID }, {
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


export const FNupdateValidarDocumentosAvales = (oidc: IOidc, ProspectoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(ProspectoID);
        axios.post(`${GetServerUrl()}Prospeccion/Avales/updateValidarDocumentosAval`, { ProspectoID }, {

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log('')
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })


export const FNupdateRechazaTitular = (oidc: IOidc, Datos: { ProspectoID?: number, Nota?: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/updateRechazaTitular`, Datos, {
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


export const FNupdateProcesoAval = (oidc: IOidc, ProspectoID?: number, Identificador?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/Avales/updateProcesoAval`, { ProspectoID, Identificador }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                console.log(error)
                Denegar(error)
            })
    })


export const FNGetAvalesByProspectoID = (oidc: IOidc, ProspectoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/Avales/getByProspectoAval`, { ProspectoID }, {
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



export const FNupdateValidaAval = (oidc: IOidc, AvalID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/Avales/updateValidaAval`, { AvalID }, {
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

export const FNupdateRechazAval = (oidc: IOidc, Datos: { AvalID?: number, Nota?: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/Avales/updateRechazAval`, Datos, {
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



export const FNConfirmarBuroDeCredito = (oidc: IOidc, ProspectoID?: number, Identificador?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        // console.log('Datos', Datos);
        axios.post(`${GetServerUrl()}Prospeccion/BuroDeCredito/updateConfirmarBuroDeCredito`, { ProspectoID, Identificador }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log('')
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNArchivarProspecto = async(oidc: IOidc, ProspectoID?: number, Motivo?: string, TipoArchivadoID?: number) =>
        new Promise((Resolver: any, Denegar: any) => {
            // console.log('Datos', Datos);
            axios.post(`${GetServerUrl()}Prospeccion/BuroDeCredito/ArchivarProspecto`, { ProspectoID, Motivo, TipoArchivadoID }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${oidc.user.access_token}`
                }
            })
                .then(respuesta => {
                    console.log('')
                    Resolver(respuesta.data)
                })
                .catch(error => {
                    Denegar(error)
                })
        })

export const FnGetMensajesFijos = (oidc: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/GetMensajesFijos`, Datos, {
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


export const FNupdateVerificaAvales = (oidc: IOidc, ProspectoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/Avales/updateVerificaAvales`, { ProspectoID }, {
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


export const FNupdateValidarBuroDeCredito = (oidc: IOidc, ProspectoID?: number, BuroInternoEstatusID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        //console.log(BuroInternoEstatusID);
        axios.post(`${GetServerUrl()}Prospeccion/BuroDeCredito/updateValidarBuroDeCredito`, { ProspectoID, BuroInternoEstatusID }, {

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log('')
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNConsultaBuro = (oidc: IOidc, PersonaID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        //console.log(BuroInternoEstatusID);
        axios.post(`${GetServerUrl()}General/ConsultaBuro/ConsultaBuro`, { PersonaID }, {

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log('')
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNReConsultaBuro = (oidc: IOidc, PersonaID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        //console.log(BuroInternoEstatusID);
        axios.post(`${GetServerUrl()}General/ConsultaBuro/ReConsultaBuro`, { PersonaID }, {

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log('')
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNupdateRechazarAvales = (oidc: IOidc, Datos: { ProspectoID?: number, Nota?: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/Avales/updateRechazarAvales`, Datos, {
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


export const FNGetBuroDeCredito = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Catalogos/BuroInternoEstatus/get`, {}, {
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

export const FNGetByTitularRef = (oidc: IOidc, ProspectoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/getByTitularRef`, { ProspectoID }, {
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
export const FNGetSucursales = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}general/sucursal/getAux`, {}, {
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


export const FNupdateProcesoRefTitular = (oidc: IOidc, ProspectoID?: number, Identificador?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/updateProcesoRefTitular`, { ProspectoID, Identificador }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                console.log(error)
                Denegar(error)
            })
    })

export const FNupdateValidaRefTitular = (oidc: IOidc, ReferenciaID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/updateValidaRefTitular`, { ReferenciaID }, {
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



export const FNupdateRechazRefTitular = (oidc: IOidc, Datos: { ReferenciaID?: number, Nota?: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/updateRechazRefTitular`, Datos, {
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


export const FNGetProcesos = (oidc: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/getProceso`, {}, {
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



export const FNupdateVerificaReferenciasTitular = (oidc: IOidc, ProspectoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/updateVerificaReferenciasTitular`, { ProspectoID }, {
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

export const FNupdateRechazarReferenciasTitular = (oidc: IOidc, Datos: { ProspectoID?: number, Nota?: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/updateRechazarReferenciasTitular`, Datos, {
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


export const FNGetByAvalReferencias = (oidc: IOidc, AvalID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/Avales/getByAvalReferencias`, { AvalID }, {
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


// updateValidaAvalRef

export const FNupdateValidaAvalRef = (oidc: IOidc, ReferenciaID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/Avales/updateValidaAvalRef`, { ReferenciaID }, {
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

export const FNupdateRechazRefAval = (oidc: IOidc, Datos: { ReferenciaID?: number, Nota?: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/Avales/updateRechazRefAval`, Datos, {
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


export const FNupdateVerificaRefsAvales = (oidc: IOidc, ProspectoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/Avales/updateVerificaRefsAvales`, { ProspectoID }, {
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

export const FNupdateRechazarRefsAvales = (oidc: IOidc, Datos: { ProspectoID?: number, Nota?: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Prospeccion/Avales/updateRechazarRefsAvales`, Datos, {
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

export const FNCancelarProspecto = (oidc: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)
        axios.post(`${GetServerUrl()}Prospeccion/Prospectos/CancelarProspecto`, Datos, {
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

export const FNGetArchivados = (oidc: IOidc, Id?: number) =>
        new Promise((Resolver: any, Denegar: any) => {
            axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/getArchivados`, {}, {
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

export const FNDesarchivarProspecto = (oidc: IOidc, ProspectoID?: number) =>
            new Promise((Resolver: any, Denegar: any) => {
                // console.log('Datos', Datos);
                axios.post(`${GetServerUrl()}Prospeccion/BuroDeCredito/DesarchivarProspecto`, { ProspectoID }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${oidc.user.access_token}`
                    }
                })
                    .then(respuesta => {
                        console.log('')
                        Resolver(respuesta.data)
                    })
                    .catch(error => {
                        Denegar(error)
                    })
            })

export const FNTipoArchivado = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
      // console.log(oidc, CreditoID)
      axios
        .post(
          `${GetServerUrl()}Prospeccion/MesaCredito/getTipoArchivados`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${oidc.user.access_token}`,
            },
          }
        )
        .then((respuesta) => {
          Resolver(respuesta.data);
        })
        .catch((error) => {
          Denegar(error);
        });
    });
