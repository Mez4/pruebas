import axios from "axios"
import { Console } from "console"
import { resolveCname, Resolver } from "dns"
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
    vialidadTipoId: number,
    orientacionVialidadTipoId: number,
    viviendaTipoId: number

}

export const FNGet = (oidc: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/EncargadoMesaCobranza/get`, {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log(respuesta.data, 'respuesta get')
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FnGetEncargados = (oidc: IOidc, PersonaID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cobranza/EncargadoMesaCobranza/getEncargados`, { "id": PersonaID }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log(respuesta.data, 'respuesta getEncargados')
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNAdd = (oidc: IOidc, Datos: { PersonaID: number, MesaCobranzaID: number, Activo: boolean, NombreCompleto: string }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('Datos', Datos);
        axios.post(`${GetServerUrl()}Cobranza/EncargadoMesaCobranza/addEncargados`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                console.log(respuesta.data, 'respuesta add')
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

    
export const FNUpdate =(oidc: IOidc, Datos:{DirectorMesaCobranzaID:number, Activo:number}) =>
    new Promise((Resolver:any,Denegar:any) => {
        console.log('Datos FnUdate',Datos);
        axios.post(`${GetServerUrl()}Cobranza/EncargadoMesaCobranza/updEncargados`, Datos,{
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
        .then(respuesta => {
            console.log(respuesta.data, 'respuesta upd')
            Resolver(respuesta.data)
        })
        .catch(error => {
            Denegar(error)
        })

    })

export const FNAgregarPersonaEncargado = (oidc: IOidc, Datos: ProspectoPersonaType) =>
    new Promise((Resolver: any, Denegar: any) => {

        console.log(Datos, 'LLEGO124')

        axios.post(`${GetServerUrl()}Cobranza/EncargadoMesaCobranza/addPersonaEncargado`, Datos, {
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

    export const FNValidacionValidacionAltaEncargados = (oidc: IOidc) => 
    new Promise((Resolver: any, Denegar: any) => { 
        axios.get(`${GetServerUrl()}Cobranza/EncargadoMesaCobranza/getValidacion`, {
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