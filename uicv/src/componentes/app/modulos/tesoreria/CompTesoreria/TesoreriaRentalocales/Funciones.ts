import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'
import { Resolver } from 'dns'




export const FNObtenerContratoRentaSucursalHist = async (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}tesoreria/RentaSucursales/obtenerSucursalHist`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
                console.log(respuesta)
            })
            .catch(error => {
                Denegar(error)
            })
})

export const FNObtenerDetalleRentaSucursal = async (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}tesoreria/RentaSucursales/obtenerDetalleRentaSucursal`, {
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

export const FNActualizarDetalleRantaSucursal = async (oidc: IOidc, Datos: {
    ContratoID          :       number,
    Monto               :       number,
    DetSuc              :       string,
    FechaInicio         :       any,
    FechaFin            :       any,
}
    
    ) =>
new Promise((Resolver: any, Denegar: any) => {
   
     axios.post(`${GetServerUrl()}tesoreria/RentaSucursales/update`, Datos , {
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
            //  console.log(error)
         })
})


export const FNCargarDetalleRantaSucursal =   async (oidc: IOidc, Datos: {
    SucursalId          :       string,
    Monto               :       number,
    FechaInicio         :       string,
    FechaFin            :       string,
    DetSuc          :       string,

}


    
    ) =>
new Promise((Resolver: any, Denegar: any) => {
   
     axios.post(`${GetServerUrl()}tesoreria/RentaSucursales/add`, Datos , {
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
            //  console.log(error)
         })
})



export const FNSubirDoc = (oidc: IOidc, Datos: FormData) =>
    new Promise((Resolver: any, Denegar: any) => {
        // console.log('xx', Datos)
        axios.post(`${GetServerUrl()}tesoreria/RentaSucursales/subirDoc`, Datos, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    }
    )

export const FNGet = async (oidc: IOidc) =>
new Promise((Resolver: any, Denegar: any) => {
    axios.get(`${GetServerUrl()}tesoreria/RentaSucursales/obtenerSucursal`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${oidc.user.access_token}`
        }
    })
        .then(respuesta => {
            Resolver(respuesta.data)
            // console.log(respuesta)
        })
        .catch(error => {
            Denegar(error)
        })
})

export const FNGetDocsByDocumentoID = (oidc: IOidc, ContratoID?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}tesoreria/RentaSucursales/getDoc`, {ContratoID}, {
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