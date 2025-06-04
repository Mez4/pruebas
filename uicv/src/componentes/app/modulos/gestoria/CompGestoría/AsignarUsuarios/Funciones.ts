import axios from "axios"
import { IOidc } from "../../../../../../interfaces/oidc/IOidc"
import { GetServerUrl } from "../../../../../../global/variables"


export const FNGet = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}gestoria/gestorasignaciones/getZonales`, {
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

    export const FNAdd = (oidc: IOidc, Datos: { ResponsableId: number, ZonalID?: number, Zonal?:boolean,GestorID?:number }) =>
        new Promise((Resolver: any, Denegar: any) => {
            axios.post(`${GetServerUrl()}gestoria/gestorasignaciones/add`, Datos, {
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
    
    export const FNUpdate = (oidc: IOidc, Datos: { ResponsableId: number, ZonalID: number, Zonal?:boolean, Id?:number,GestorID:number  }) =>
        new Promise((Resolver: any, Denegar: any) => {
            axios.post(`${GetServerUrl()}gestoria/gestorasignaciones/update`, Datos, {
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
    
        export const FNGetResponsables = async (
            oidc: IOidc,
            Datos: {
              Nombre: string;
              Zonal?: boolean;
            }
          ) =>
            new Promise((Resolver: any, Denegar: any) => {
              // console.log('Datos: ', Datos)
          
              axios
                .post(`${GetServerUrl()}gestoria/gestorasignaciones/getResponsables`, Datos, {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${oidc.user.access_token}`,
                  },
                })
                .then((respuesta) => {
                  // console.log(respuesta, 'respcreditosglobal')
                  Resolver(respuesta.data);
                })
                .catch((error) => {
                  Denegar(error);
                });
            });


            export const FNGetGestores = (oidc: IOidc) =>
                new Promise((Resolver: any, Denegar: any) => {
                    axios.get(`${GetServerUrl()}gestoria/gestorasignaciones/getGestores`, {
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