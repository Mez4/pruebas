import axios from "axios"
import { Console } from "console"
import { GetServerUrl } from "../../../../../../global/variables"
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type ProspectoPersonaType = {
    //Persona: DBConfia_General.IPersonas_VW,
    Nombre: string,
    ApellidoPaterno: string,
    ApellidoMaterno: string,
    FechaNacimiento: string,
    SexoID: string,
    CURP: string,
    RFC: string,
    EstadoCivilID: string,
    NombreConyuge: string,
    EscolaridadID: number,
    TelefonoMovil: string,
    CorreoElectronico: string,
    LugarNacimiento: string,
    AsentamientoID: number
    Calle: string
    NumeroExterior: string
    TelefonoDomicilio: string,
    Observaciones: string,
    identificacionTipoId: number,
    identificacionNumero: string,
    MesaCobranzaID: number,
    vialidadTipoId: number,
    orientacionVialidadTipoId: number,
    viviendaTipoId: number

}


export const FNGetMesa = (oidc: IOidc) =>
new Promise((Resolver: any, Denegar: any) => {
    axios.post(`${GetServerUrl()}Cobranza/GestorCobranza/getMesa`, {}, {
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


export const FNGet = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/GestorCobranza/getGestorCobranzaIndex`, {}, {
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

    
export const FnGetMesaCobranza = (oidc: IOidc, MesaCobranzaID?: number) => 
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/GestorCobranza/getMesaCobranza`, { "id": MesaCobranzaID }, {
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

export const FnGetGestores = (oidc: IOidc, PersonaID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/GestorCobranza/getGestores`, { "id": PersonaID }, {
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

    export const getGestoresMesa = (oidc: IOidc, PersonaID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/GestorCobranza/getGestoresMesa`, {}, {
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
    
export const FNAdd = (oidc: IOidc, Datos: { PersonaID: number, NombreCompleto: string, MesaCobranzaID: number, mesaCobranza: string,  Activo: boolean }) =>
    new Promise((Resolver: any, Denegar: any) => {
        // console.log('Datos', Datos);
        axios.post(`${GetServerUrl()}Cobranza/GestorCobranza/addGestor`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                // console.log(respuesta, 'respuesta add')
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

    export const FNUpd = (oidc: IOidc,  Datos: {
                                                 PersonaID: number,
                                                 NombreCompleto: string,
                                                 MesaCobranzaID: number,
                                                 MesaAnteriorId: number,
                                                 Activo: boolean }) =>
    new Promise((Resolver: any, Denegar: any) => {
        // console.log('Datos', Datos);
        axios.post(`${GetServerUrl()}Cobranza/GestorCobranza/updGestor`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                // console.log(respuesta, 'respuesta add')
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

    export const FNAgregarPersonaGestor = (oidc: IOidc, Datos: ProspectoPersonaType) =>
    new Promise((Resolver: any, Denegar: any) => {

        // console.log(Datos,'LLEGO124')
        
        axios.post(`${GetServerUrl()}Cobranza/GestorCobranza/addPersonaGestor`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                // console.log('error: ', error)
                Denegar(error)
            })
    })

    export const FNValidacionAltaGestorCobranza = (oidc: IOidc, valida) => 

    new Promise((Resolver: any, Denegar: any) => { 
        // console.log(valida)
        // console.log('Validacion')
        axios.post(`${GetServerUrl()}Cobranza/GestorCobranza/validacionAltaGestorCobranza`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                // console.log('error: ', error)
                Denegar(error)
            })
    })