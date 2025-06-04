import axios from 'axios'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { GetServerUrl } from '../../../../../../global/variables'
import { toast } from 'react-toastify'

export const FNPrint = (oidc: IOidc,
    Datos: {
        ProductoID: number,
        SucursalID: number,
        CoordinadorID: number,
        tipo: number,
        formato: number,
        fecha: string,
        Distribuidores: [],
        // EmpresaId: number,
    },
    // cb: any
) =>
    new Promise((Resolver: any, Denegar: any) => {
        console.log('print datos: ', Datos)
        axios.post(`${GetServerUrl()}cortes/RelacionCortes/print3`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            },
            responseType: 'blob',
            // onUploadProgress: (progressEvent) => {
            //     var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
            //     console.log('Upload', progressEvent);
            // }, 
            // onDownloadProgress: (progressEvent) => {
            //     var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
            //     if(percentCompleted == 100){
            //         cb(percentCompleted)
            //     }
            // } 
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                if (error.response) {
                    error.response.data?.text()
                        .then((errorMessage: string) => {
                            const parsedError = JSON.parse(errorMessage); // Parse the JSON error
                            toast.error(`ERROR: ${parsedError.message || 'Unknown error'}`); // Show the toast
                        })
                        .catch(() => {
                            toast.error('ERROR: Unable to parse error message');
                        });
                } else if (error.request) {
                    toast.error('ERROR: No response received from the server');
                } else {
                    toast.error(`ERROR: ${error.message}`);
                }
                Denegar(error);
            })
    })

export const FNGetTipoUsuario = (oidc: IOidc, data: { usuarioID: number | undefined }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}creditos/reportes/gettipousuarioRelaciones`, data, {
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



export const FNbloquearRelaciones = (oidc: IOidc, data: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cortes/RelacionCortes/bloquear`, data, {
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

export const FNdesbloquearRelacionesXProducto = (oidc: IOidc, data: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cortes/RelacionCortes/desbloquearproducto`, data, {
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

export const FNSend = (oidc: IOidc,
    Datos: {
        ProductoID: number,
        SucursalID: number,
        CoordinadorID: number,
        tipo: string,
        formato: string,
        fecha: string,
        Distribuidores: [],
        // EmpresaId: number,
    },
    // cb: any
) =>
    new Promise((Resolver: any, Denegar: any) => {
        // console.log(Datos)
        axios.post(`${GetServerUrl()}cortes/RelacionCortes/correo`, Datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            },
            // onUploadProgress: (progressEvent) => {
            //     var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
            //     console.log('Upload', progressEvent);
            // }, 
            // onDownloadProgress: (progressEvent) => {
            //     var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
            //     if(percentCompleted == 100){
            //         cb(percentCompleted)
            //     }
            // } 
        })
            .then(respuesta => {
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNGetFechaCorte = (oidc: IOidc, SucursalID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Cortes/FechaCorte/get`, { SucursalID }, {
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
