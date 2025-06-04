import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'
import { TipoPersonas } from '../Personas'
import { DBConfia_General } from '../../../../../../interfaces_db/DBConfia/General'

export const FNGet = (oidc: IOidc, values: any, Tipo: TipoPersonas): Promise<DBConfia_General.IPersonas_VW[]> =>
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
            case TipoPersonas.Empleados:
                values.Sac = true
                break;
        }

        // Generamos un nuevo objecto para enviar al servidor
        let valoresEnviar: any = {}
        valoresEnviar.DistribuidorID = values.DistribuidorID
        //DistribuidorIDVR
        valoresEnviar.DistribuidorIDVR = values.DistribuidorIDVR
        valoresEnviar.Nombre = values.Nombre
        valoresEnviar.CURP = values.CURP
        valoresEnviar.RFC = values.RFC

        // Validamos los opcionales
        if (values.SexoID) valoresEnviar.SexoID = values.SexoID
        if (values.EstadoCivilID) valoresEnviar.EstadoCivilID = values.EstadoCivilID
        if (values.EscolaridadID) valoresEnviar.EscolaridadID = values.EscolaridadID
        if (values.OcupacionID) valoresEnviar.OcupacionID = values.OcupacionID
        if (values.Cliente) valoresEnviar.Cliente = values.Cliente
        if (values.Distribuidor) valoresEnviar.Distribuidor = values.Distribuidor
        if (values.Coordinador) valoresEnviar.Coordinador = values.Coordinador
        if (values.Sac) valoresEnviar.Sac = values.Sac
        valoresEnviar.usuario_id = oidc.user.profile.UsuarioID

        axios.post(`${GetServerUrl()}Administracion/Personas/get`, valoresEnviar, {
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

export const AddCoordi = (oidc: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Administracion/Personas/AddCoordi`, Datos, {
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

    export const CanjePlus = (oidc: IOidc, Datos: any) =>
        new Promise((Resolver: any, Denegar: any) => {
            axios.post(`${GetServerUrl()}Administracion/Personas/CanjePlus`, Datos, {
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
    
export const FNUpdate = (oidc: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.put(`${GetServerUrl()}Administracion/Personas/UpdateCoordi`, Datos, {
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