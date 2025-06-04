import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'
import { TipoPersonas } from '../Personas'
import { DBConfia_General } from '../../../../../../interfaces_db/DBConfia/General'
import { DBConfia_Archivo } from '../../../../../../interfaces_db/DBConfia/Archivo'
import { DBConfia_Distribuidores } from '../../../../../../interfaces_db/DBConfia/Distribuidores'



export const FNGet = (oidc: IOidc, values: any, Tipo: TipoPersonas): Promise<DBConfia_Archivo.IPersonas_Dcs_VW[]> =>
    new Promise((Resolver, Denegar) => {

        // Validamos el tipo de control que esta consultando|
        switch (Tipo) {
            case TipoPersonas.Clientes:
                values.Cliente = true
                break;
            case TipoPersonas.Distribuidores:
                values.Distribuidor = true
                break;
            case TipoPersonas.Coordinadores:
                values.Coordinador = true
                break;
            case TipoPersonas.Promotores:
                values.Promotor = true
                break;
            case TipoPersonas.Analistas:
                values.Analista = true
                break;
            case TipoPersonas.DirectoresMesaCredito:
                values.DirectorMesaCredito = true
                break;
            case TipoPersonas.GestoresCobranza:
                values.GestorCobranza = true
                break;
            case TipoPersonas.DirectoresMesaCobranza:
                values.DirectorMesaCobranza = true
                break;
        }

        // Generamos un nuevo objecto para enviar al servidor
        let valoresEnviar: any = {}
        valoresEnviar.NombreCompleto = values.NombreCompleto
        valoresEnviar.CURP = values.CURP
        valoresEnviar.RFC = values.RFC


        // Validamos los opcionales
        if (values.SexoID) valoresEnviar.SexoID = values.SexoID
        if (values.EstatusID) valoresEnviar.EstatusID = values.EstatusID


        if (values.EstadoCivilID) valoresEnviar.EstadoCivilID = values.EstadoCivilID
        if (values.EscolaridadID) valoresEnviar.EscolaridadID = values.EscolaridadID
        if (values.OcupacionID) valoresEnviar.OcupacionID = values.OcupacionID
        if (values.Cliente) valoresEnviar.Cliente = values.Cliente
        if (values.Distribuidor) valoresEnviar.Distribuidor = values.Distribuidor
        if (values.Coordinador) valoresEnviar.Coordinador = values.Coordinador
        if (values.Promotor) valoresEnviar.Promotor = values.Promotor
        if (values.Analista) valoresEnviar.Analista = values.Analista
        if (values.DirectorMesaCredito) valoresEnviar.DirectorMesaCredito = values.DirectorMesaCredito
        if (values.GestorCobranza) valoresEnviar.GestorCobranza = values.GestorCobranza
        if (values.DirectorMesaCobranza) valoresEnviar.DirectorMesaCobranza = values.DirectorMesaCobranza

        axios.post(`${GetServerUrl()}Archivo/Archivo/get`, valoresEnviar, {
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
// export const FNGet = (oidc: IOidc, values: any, Tipo: TipoPersonas): Promise<DBConfia_Archivo.IPersonas_Dcs_VW[]> =>
//     new Promise((Resolver, Denegar) => {
//         // console.log(Tipo, ' tipo persona')
//         // Validamos el tipo de control que esta consultando|
//         switch (Tipo) {
//             case TipoPersonas.Clientes:
//                 values.Cliente = true
//                 break;
//             case TipoPersonas.Distribuidores:
//                 values.Distribuidor = true
//                 break;
//             case TipoPersonas.Coordinadores:
//                 values.Coordinador = true
//                 break;
//         }

//         // Generamos un nuevo objecto para enviar al servidor
//         let valoresEnviar: any = {}
//         valoresEnviar.PersonaID = values.PersonaID
//         valoresEnviar.DistribuidorID = values.DistribuidorID
//         valoresEnviar.ClienteID = values.ClienteID
//         valoresEnviar.CoordinadorID = values.CoordinadorID
//         valoresEnviar.EstatusID = values.EstatusID
//         valoresEnviar.NombreEstatus = values.NombreEstatus
//         valoresEnviar.Clave = values.Clave
//         valoresEnviar.Color = values.Color
//         valoresEnviar.FechaHoraRegistro = values.FechaHoraRegistro
//         // valoresEnviar.Clave = values.Clave


//         // Validamos los opcionales
//         if (values.SexoID) valoresEnviar.SexoID = values.SexoID
//         if (values.EstadoCivilID) valoresEnviar.EstadoCivilID = values.EstadoCivilID
//         if (values.EscolaridadID) valoresEnviar.EscolaridadID = values.EscolaridadID
//         if (values.OcupacionID) valoresEnviar.OcupacionID = values.OcupacionID
//         if (values.Cliente) valoresEnviar.Cliente = values.Cliente
//         if (values.Distribuidor) valoresEnviar.Distribuidor = values.Distribuidor
//         if (values.Coordinador) valoresEnviar.Coordinador = values.Coordinador
//         console.log(valoresEnviar, 'valores a enviar')

//         axios.post(`${GetServerUrl()}Archivo/Archivo/get`, valoresEnviar, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${oidc.user.access_token}`
//             }
//         })
//             .then(respuesta => {
//                 console.log(respuesta, 'res')
//                 Resolver(respuesta.data)
//             })
//             .catch(error => {
//                 Denegar(error)
//             })
//     })

export const FNGetDocsByDocumentoID = (oidc: IOidc, PersonasDocID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Administracion/Personas/getDoc`, { PersonasDocID }, {
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
/*
export const FNAdd = (oidc: IOidc, Datos: { avalTipo: string, activo: boolean }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}catalogos/avaltipo/add`, Datos, {
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

export const FNUpdate = (oidc: IOidc, Datos: { avalTipoId: number, avalTipo: string, activo: boolean }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}catalogos/avaltipo/update`, Datos, {
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

*/


export const
    FNObtenerPorId = (oidc: IOidc, DistribuidorID: number): Promise<DBConfia_Distribuidores.IDistribuidores_VW> =>
        new Promise((Resolver, Denegar) => {
            axios.get(`${GetServerUrl()}Distribuidores/Distribuidor/get/${DistribuidorID}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${oidc.user.access_token}`
                }
            }).then(respuesta => {
                console.log(respuesta)
                Resolver(respuesta.data)
            }).catch(error => {
                Denegar(error)
            })
        })