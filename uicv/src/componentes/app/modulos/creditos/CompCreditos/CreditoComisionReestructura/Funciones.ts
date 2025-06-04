import axios from 'axios';
import {IOidc} from '../../../../../../interfaces/oidc/IOidc';
import { GetServerUrl } from '../../../../../../global/variables';

export const FNGet = (oidc : IOidc , Datos : {
    DistribuidorID : number
}) => 
    new Promise ((Resolver : any , Denegar : any) => {
        axios.post(`${GetServerUrl()}creditos/credito/obtenerDistribuidor`, Datos, {
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${oidc.user.access_token}`
            }
        }).then(respuesta => {
            Resolver(respuesta.data);
        }).catch(error => {
            Denegar(error);
        });
    });

export const FNGetQuita = (oidc : IOidc) => {
    return new Promise ((Resolver : any , Denegar : any) => {
        axios.get(`${GetServerUrl()}creditos/credito/obtenerQuitaPorcentaje`, {
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${oidc.user.access_token}`
            }
        }).then(respuesta => {
            Resolver(respuesta.data);
        }).catch(error => {
            Denegar(error);
        });
    });
}


export const FNAdd = (oidc: IOidc, Datos) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Reestructura/HDR/add`, Datos, {
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


export const FNGetPlazos = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Reestructura/HDR/obtenerPlazos`, {}, {
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


export const FNGetSimulacionPlazos = async (oidc: IOidc, Datos : any) => 
     new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Reestructura/HDR/obtenerPlazoSimulacion`, Datos, {
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

export function FNGetSolicitud (oidc: IOidc, solicitudRCID : number) {
    return new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Reestructura/HDR/obtenerSolicitud/${solicitudRCID}`, {
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
}