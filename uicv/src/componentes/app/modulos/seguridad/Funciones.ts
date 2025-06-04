import axios from 'axios'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../global/variables'

export const FNGetUsuario = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}sistema/usuarios/GetUsuarios`, {
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

export const FNUpdateContrasena = (oidc: IOidc, Datos) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.put(`${GetServerUrl()}sistema/Usuarios/updateContrasena`, { Contrasena: Datos }, {
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
                console.log("Error en la Petición: ", error)
            })
    })


export const FNUpdate = (oidc: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.put(`${GetServerUrl()}sistema/usuarios/RestablecerContra`, Datos, {
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