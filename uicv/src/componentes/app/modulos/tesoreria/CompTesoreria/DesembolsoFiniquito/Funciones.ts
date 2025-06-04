import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'

export const FNGet = (oidc: IOidc, Datos: { SucursalID: number, SACId: number, CuentaBancoID: number, Todos: boolean }) =>
    new Promise((Resolver: any, Denegar: any) => {
        // console.log('Datos: ', Datos)
        axios.post(`${GetServerUrl()}Tesoreria/DesembolsoFiniquito/get`, Datos, {
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

export const FNDesembolsar = (oidc: IOidc, 
    Datos: {
        ProductoId: number, 
        SolicitudID: number, 
        TipoDesembolsoID: number,
        CajaID: number,
    }
    // cb: any
) =>
new Promise((Resolver: any, Denegar: any) => {
    // console.log(Datos)
    axios.post(`${GetServerUrl()}Tesoreria/DesembolsoFiniquito/desembolsar`, Datos, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${oidc.user.access_token}`
        },
    })
        .then(respuesta => {
            Resolver(respuesta.data)
        })
        .catch(error => {
            Denegar(error)
        })
})

export const FNCambiarCuenta = (oidc: IOidc, 
    Datos: {
        SolicitudID: number,
        CuentaBancoID: number
    }
    // cb: any
) =>
new Promise((Resolver: any, Denegar: any) => {
    // console.log(Datos)
    axios.post(`${GetServerUrl()}Tesoreria/DesembolsoFiniquito/cambiarcuenta`, Datos, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${oidc.user.access_token}`
        },
    })
        .then(respuesta => {
            Resolver(respuesta.data)
        })
        .catch(error => {
            Denegar(error)
        })
})

// export const FNPrint = (oidc: IOidc, 
//         Datos: {
//             SucursalID: number, 
//             CoordinadorID: number, 
//             tipo: string, 
//             formato: string, 
//             fecha: string, 
//             Distribuidores: []
//         },
//         // cb: any
//     ) =>
//     new Promise((Resolver: any, Denegar: any) => {
//         axios.post(`${GetServerUrl()}cortes/RelacionCortes/print`, Datos, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${oidc.user.access_token}`
//             },
//             responseType: 'blob',
//         })
//             .then(respuesta => {
//                 Resolver(respuesta.data)
//             })
//             .catch(error => {
//                 Denegar(error)
//             })
//     })


