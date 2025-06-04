import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

//Función para traer los datos de la pantalla principal
export const FNGet = (Seguridad: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`https://service-tsr.herokuapp.com/api/efectivo-caja/corte-caja-sucursales/07-06-2021/07-06-2021`, {
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })


//Queda pendiente si se hará el reporte por sucursales  
//https://service-tsr.herokuapp.com/api/efectivo-caja/corte-caja-suc/2/08-06-2021 


//  Funcion para obtener el corte de caja, por caja pasando como parametros el id de la caja y la fecha en que se generó 
export const FNGetDenominaciones = (Seguridad: IOidc, Id?: number, fecha?: Date) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`https://service-tsr.herokuapp.com/api/efectivo-caja/corte-caja/${Id}/${fecha}`, {
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

//Funcion para obtener una lista de las sucursales    
export const FNGetSucursal = (Seguridad: IOidc, Id?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}SOMA/CatSucursalesRest/all`, {
            headers: {
                //  "Content-Type": "application/json",
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

//Funcion para obtener los cortes de caja en base al filtrado de la sucursal y un rango de fechas
export const FNGetFiltroSucursales = (Seguridad: IOidc, Id?: number, fechaInicial?: Date, fechaFinal?: Date) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log("")
        axios.get(`https://service-tsr.herokuapp.com/api/efectivo-caja/corte-caja-sucursal/${Id}/${fechaInicial}/${fechaFinal}`, {

        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })
