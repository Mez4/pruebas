import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'


//Funcion para llenar todos los datos de la tabla principal.
export const FNGet = (Seguridad: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        //axios.post(`${GetServerUrl()}catalogos/ciudadestado/get`, {}, {
        axios.get(`https://service-mc.herokuapp.com/api/catalogos/msj-motivo/show-all`, {  //https://service-mc.herokuapp.com
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })


//Funcion para agregar el mootivo de los mensajes.
export const FNAdd = (Seguridad: IOidc,
    Datos: {
        mensaje:    String,
        msjError:   boolean,
        activo:     boolean,
      
    }) =>
    new Promise((Resolver: any, Denegar: any) => {

        axios.post(`https://service-mc.herokuapp.com/api/catalogos/msj-motivo/create`, Datos, {
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

//Funcion para actualizar  los motivos de los mensajes.
export const FNUpdate = (Seguridad: IOidc,
    Datos: {
        msjMotivoID: number,
        mensaje:     String,
        msjError:    boolean,
        activo:      boolean,
    }) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log(Datos)
        axios.put(`https://service-mc.herokuapp.com/api/catalogos/msj-motivo/update/${Datos.msjMotivoID}`, Datos, {

        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

