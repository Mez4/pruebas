import axios from "axios";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { GetServerUrl } from "../../../../../../global/variables";

/**
 * Funcion para obtener los tipos de vivienda
 * @param {IOidc} Seguridad Estado de redux de seguridad
 * @param {number} Id Datos a subir
 * @returns any
 */

export const FNGetReport = (Seguridad: IOidc , Datos : any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/reportes/reporte194`, Datos, {
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

        
    export const FNGetSucursalID = (Seguridad: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}creditos/credito/getByIdSucursal`, {            
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${Seguridad.user.access_token}` }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

    export const FNGetCatologoTipoCredito = (Seguridad: IOidc) => 
        new Promise((Resolver: any, Denegar: any) => {
            axios.get(`${GetServerUrl()}creditos/credito/getTipoCredito`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Seguridad.user.access_token}`
                }
            }).then(respuesta => {
                Resolver(respuesta.data)   
            }).catch(error => {
                Denegar(error)
            })
        })
