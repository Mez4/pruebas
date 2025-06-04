import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'


//Obtiene el  ID del usuario
//var usuarioID = 'manuel';

export const FNGet = (Seguridad: IOidc, Id?: string) =>
 new Promise((Resolver: any, Denegar: any) => {
     axios.get(`https://service-mc.herokuapp.com/api/mesa-credito-solicitud/listar/haro/0`, {
        
     })
         .then(respuesta => {
             Resolver(respuesta.data)
         })
         .catch(error => {
             Denegar(error)
         })
 })


 export const FNGetFiltroSolicitudes = (Seguridad: IOidc, Id?: number) =>
 new Promise((Resolver: any, Denegar: any) => {
     axios.get(`https://service-mc.herokuapp.com/api/mesa-credito-solicitud/listar/haro/${Id}`, {
        
     })
         .then(respuesta => {
             Resolver(respuesta.data)
         })
         .catch(error => {
             Denegar(error)
         })
 })

 export const FNGetAnalistas = (Seguridad: IOidc, Id?: string) =>
 new Promise((Resolver: any, Denegar: any) => {
     //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`https://service-mc.herokuapp.com/api/mesa-credito/show-analistas-director/haro`,{ //// CAMBAIR POR LA API QUE LE VOY A PEDIR AL DANIEL
         
     })
         .then(respuesta => {
             Resolver(respuesta.data)
  
         })
         
         .catch(error => {
             Denegar(error)
         })
 })


export const FNAdd = (Seguridad: IOidc, Datos: { 
    personaID           : number, 
    grupoID             : number,
    esGrupal            : boolean,
    productoID          : number,
    sucursalID          : number,
    usuarioRegistraID   : number,
    esBuro              : boolean,
    creditoID           : number,
    estatusValidacionID : number
}) =>
 new Promise((Resolver: any, Denegar: any) => {
    // Datos.personaID = Datos.personaID
     axios.post(`https://service-mc.herokuapp.com/api/mesa-credito-solicitud/listar/haro/true`, Datos, {
        
     })
         .then(respuesta => {
             Resolver(respuesta.data)
         })
         .catch(error => {
             Denegar(error)
         })
 })

 export const FNGetEstatusSolicitud = (Seguridad: IOidc, Id?: string) =>
 new Promise((Resolver: any, Denegar: any) => {
     //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`https://service-mc.herokuapp.com/api/catalogos/estatus-validacion/listar`,{ //// CAMBAIR POR LA API QUE LE VOY A PEDIR AL DANIEL
         
     })
         .then(respuesta => {
             Resolver(respuesta.data)
         })
         .catch(error => {
             Denegar(error)
         })
 })

export const FNUpdate = (Seguridad: IOidc, Datos: { 
    personaID           : number, 
    grupoID             : number,
    esGrupal            : boolean,
    productoID          : number,
    sucursalID          : number,
    usuarioRegistraID   : number,
    esBuro              : boolean,
    creditoID           : number,
    estatusValidacionID : number
}) =>
 new Promise((Resolver: any, Denegar: any) => {
  //  Datos.personaID = Datos.personaID
     axios.put(`https://service-mc.herokuapp.com/api/mesa-credito-solicitud/asignar-solicitud-analista`, Datos, {  //// queda pendiente al API de Daniel
         
     })
        .then(respuesta => {
            Resolver(respuesta.data)
        })
        .catch(error => {
            Denegar(error)
        })
 }) 

