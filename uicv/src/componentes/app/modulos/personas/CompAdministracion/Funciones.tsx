import { date } from 'yup/lib/locale';
import { ErrorMessage } from 'formik';
import axios from "axios"
import { GetServerUrl } from "../../../../../global/variables"
import { IOidc } from "../../../../../interfaces/oidc/IOidc"
import Seguridad from '../../seguridad/Seguridad';
// import { Solicitud } from '../CreditoReestructuraSolicitudes/Solicitud';

/**
 * Funcion para obtener los tipos de vivienda
 * @param {IOidc} Seguridad Estado de redux de seguridad
 * @param {number} Id Datos a subir
 * @returns any
 */

//Obtener estatus de la solicitud
export const FNGetEstatusSolicitud = (Seguridad: IOidc, Id?: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Distribuidores/Distribuidor/obtenerEstatusSolicitud`, {
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

// export const FNCancelacion = (oidc: IOidc, Datos?: any) =>
//     new Promise((Resolver: any, Deneger: any) => {
//         axios.post(`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/Cancelacion`, Datos, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${oidc.user.access_token}`
//             }
//         })
//             .then(respuesta => {
//                 Resolver(respuesta.data)
//             })
//             .catch(error => {
//                 Deneger(error)
//             })
//     })


export const FNGetV2 = (Seguridad: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Distribuidores/Distribuidor/obtenerSolicitudSociaFallecida`, { id: 2 }, { //ruta del controlador (api)
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

export const FNGet = (Seguridad: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Distribuidores/Distribuidor/obtenerSolicitudSociaCancelada`, { id: 1 }, { //ruta del controlador (api)
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



export const FNAceptar = (Seguridad: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Distribuidores/Distribuidor/AceptarSolicitud`, Datos, {
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

export const FNAceptarFallecida = (Seguridad: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Distribuidores/Distribuidor/AceptarSolicitudFallecida`, Datos, {
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



export const FNCalcelarSolicitud = (Seguridad: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Distribuidores/Distribuidor/CancelarSolicitud`, Datos, {
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

export const FNCalcelarSolicitudFallecida = (Seguridad: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Distribuidores/Distribuidor/CancelarSolicitudFallecida`, Datos, {
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



// export const FNAceptarM = (Seguridad: IOidc, Datos: any) =>
//     new Promise((Resolver: any, Denegar: any) => {
//         axios.post(`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/AceptarMuchos`, Datos, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${Seguridad.user.access_token}`
//             }
//         })
//             .then(respuesta => {
//                 Resolver(respuesta.data)
//             })
//             .catch(error => {
//                 Denegar(error)
//             })
//     })

// export const FNObtenerEvidencia = ( Seguridad: IOidc, Datos: any ) =>
//         new Promise((Resolver: any, Denegar: any) => {
//         axios.post(`${GetServerUrl()}Distribuidores/Distribuidor/GetEvidencia`, Datos, 
//             {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${ Seguridad.user.access_token }`
//             }
//         })
//             .then(respuesta => {
//                 Resolver(respuesta.data)
//             })
//             .catch(error => {
//                 console.log('error: ', error)
//                 Denegar(error)
//             })
//     })

export const FNObtenerEvidencia = (oidc: IOidc, Ruta?: string) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Distribuidores/Distribuidor/getEvidencia`, { Ruta }, {
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

    export const fetchLectorHuella = (oidc: IOidc, DistribuidorID:number) => 
        new Promise((Resolver: any, Denegar: any) => {
        const url =`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/lectorHuellaSucursal` 
      
        try {      
          axios.post(url, {
            'DistribuidorID': DistribuidorID
          }, {
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${oidc.user.access_token}`
            },
          }).then(response =>{
          const lectorHuella = response.data.LectorHuellas;
      
          console.log('LectorHuella:', lectorHuella);
          
          Resolver(lectorHuella);
          }).catch(error => {
            console.error('Error fetching LectorHuella:', error);
            Resolver(false);
        })
      

      
        } catch (error) {
          console.error('Error fetching LectorHuella:', error);
          Resolver(false); // Return null or handle the error appropriately
        }
      });
      
      export const fetchHuellaSucursal = (oidc: IOidc, SucursalID:number) => 
        new Promise((Resolver: any, Denegar: any) => {
        const url =`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/lectorHuellaBySucursal` 
      
        try {      
          axios.post(url, {
            'DistribuidorID': SucursalID
          }, {
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${oidc.user.access_token}`
            },
          }).then(response =>{
          const lectorHuella = response.data.LectorHuellas;
      
          console.log('LectorHuella:', lectorHuella);
          
          Resolver(lectorHuella);
          }).catch(error => {
            console.error('Error fetching LectorHuella:', error);
            Resolver(false);
        })
      

      
        } catch (error) {
          console.error('Error fetching LectorHuella:', error);
          Resolver(false); // Return null or handle the error appropriately
        }
      });

      export const fetchHuellaCliente = (oidc: IOidc, ClienteID:number) => 
        new Promise((Resolver: any, Denegar: any) => {
        const url =`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/lectorHuellaByClienteID` 
      
        try {      
          axios.post(url, {
            'ClienteID': ClienteID
          }, {
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${oidc.user.access_token}`
            },
          }).then(response =>{
            
          const lectorHuella = response.data.LectorHuellas;
      
          console.log('LectorHuella:', lectorHuella);
          
          Resolver(lectorHuella);
          }).catch(error => {
            console.error('Error fetching LectorHuella:', error);
            Resolver(false);
        })
      

      
        } catch (error) {
          console.error('Error fetching LectorHuella:', error);
          Resolver(false); // Return null or handle the error appropriately
        }
      });
      export const fetchHuellaDist = (oidc: IOidc, ClienteID:number) => 
        new Promise((Resolver: any, Denegar: any) => {
        const url =`${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/lectorHuellaByDistribuidorID` 
      
        try {      
          axios.post(url, {
            'ClienteID': ClienteID
          }, {
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${oidc.user.access_token}`
            },
          }).then(response =>{
            
          const lectorHuella = response.data.LectorHuellas;
      
          console.log('LectorHuella:', lectorHuella);
          
          Resolver(lectorHuella);
          }).catch(error => {
            console.error('Error fetching LectorHuella:', error);
            Resolver(false);
        })
      

      
        } catch (error) {
          console.error('Error fetching LectorHuella:', error);
          Resolver(false); // Return null or handle the error appropriately
        }
      });
      export const fetchHuellaCurp = (oidc: IOidc, Curp:string) => 
        new Promise((Resolver: any, Denegar: any) => {
        const url =`${GetServerUrl()}General/SensorHuellas/lectorHuellaByCurp` 
        console.log(url)
        try {      
          axios.post(url, {
            'Curp': Curp
          }, {
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${oidc.user.access_token}`
            },
          }).then(response =>{
            
          const lectorHuella = response.data.LectorHuellas;
      
          console.log('LectorHuella:', lectorHuella);
          
          Resolver(lectorHuella);
          }).catch(error => {
            console.error('Error fetching LectorHuella:', error);
            Denegar(false);
        })
        } catch (error) {
          console.error('Error fetching LectorHuella:', error);
          Denegar(false); // Return null or handle the error appropriately
        }
      });
      export const fetchExcepcionHuella = (oidc: IOidc, DistribuidorID:number) => 
        new Promise((Resolver: any, Denegar: any) => {
        const url =`${GetServerUrl()}General/SensorHuellas/excepcionHuellas` 
        console.log(url)
        try {      
          axios.post(url, {
            'DistribuidorID': DistribuidorID
          }, {
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${oidc.user.access_token}`
            },
          }).then(response =>{
            
          const lectorHuella = response.data.LectorHuellas;
      
          console.log('ExcepLectorHuella:', lectorHuella);
          
          Resolver(lectorHuella);
          }).catch(error => {
            console.error('Error fetching LectorHuella:', error);
            Denegar(false);
        })
        } catch (error) {
          console.error('Error fetching LectorHuella:', error);
          Denegar(false); // Return null or handle the error appropriately
        }
      });