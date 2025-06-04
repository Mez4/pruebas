import axios from "axios";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { GetServerUrl } from "../../../../../../global/variables"
import Distribuidor from "../../../distribuidor/Distribuidor";
import Usuario from "../../../seguridad/CompSeguridad/CompAdministracionUsuarios/Usuario";
import { TiposReestructura } from "..";

// FUNCION PARA INSERTAR EN TABLA SolicitudReestructuraConvenios
export const AddSolicitudSCRS = (oidc: IOidc, Data: any) => {
    return new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Reestructura/SHDR/GenerarSolicitud`, Data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        }).then(respuesta => {
            Resolver(respuesta.data);
        }).catch(error => {
            Denegar(error);
        });
    });
};
// FUNCION PARA OBTNEER LA INFORMACION DE LA SOCIA
export const GetInfoSocia = (oidc: IOidc, IdSocia: number) => {
    return new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Reestructura/SHDR/GetInfoSocia/${IdSocia}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        }).then(respuesta => {
            Resolver(respuesta.data);
        }).catch(error => {
            Denegar(error);
        });
    });
}

//FUNCION PARA OBTENER EL ID DE LA SOLICITUD
export const GetIdSolicitud = (oidc: IOidc, distribuidorID: number) => {
    return new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Reestructura/SHDR/comprobarSolicitud/${distribuidorID}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        }).then(respuesta => {
            Resolver(respuesta.data);
        }).catch(error => {
            Denegar(error);
        });
    });

}

export function GetDocumentos(iodc: IOidc, SolicitudRCID: number) {
    return new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Reestructura/SHDR/GetDocsSolicitud/${SolicitudRCID}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${iodc.user.access_token}`
            }
        }).then(respuesta => {
            Resolver(respuesta.data);
        }).catch(error => {
            Denegar(error);
        });
    });
}
export function GetDocs(iodc: IOidc) {
    return new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Reestructura/SHDR/GetDocs`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${iodc.user.access_token}`
            }
        }).then(respuesta => {
            Resolver(respuesta.data);
        }).catch(error => {
            Denegar(error);
        });
    });
}

export function SubirArchivo(oidc: IOidc, Datos: FormData) {
    return new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Reestructura/SHDR/subirArchivo`, Datos, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        }).then(respuesta => {
            Resolver(respuesta.data);
        }).catch(error => {
            Denegar(error);
        });
    });
}

export function VerDocumento(oidc: IOidc, DocumentoID: number) {
    return new Promise((Resolver: any, Denegar: any) => {
        console.log("###", DocumentoID);

        axios.get(`${GetServerUrl()}Reestructura/SHDR/GetDocID/${DocumentoID}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        }).then(respuesta => {
            Resolver(respuesta.data);
        }).catch(error => {
            Denegar(error);
        });
    });
}


// CONFIRMAR PETICION , ACTUALIZAR LA COLUMNA COMPLETADO
export function ConfirmarPeticion(oidc: IOidc, data: any) {
    // data = data.DatosDetallePlazos ? data.DatosDetallePlazos : data;
    return new Promise((Resolver: any, Denegar: any) => {
        data = data.DatosDetallePlazos ? data.DatosDetallePlazos : data;
        console.log("###", data);
        if (data.Accion === 1) {
            data = {
                SolicitudRCID: data.SolicitudRCID,
                QuitaID: data.QuitaID,
                MontoIntencion: data.MontoIntencion,
                PlazoID: data.PlazoID,
                Motivo: data.motivo,
                DistribuidorID: data.DistribuidorID,
                accion: data.Accion,
                DNI: data.DNI,
            }
        } else
            if (data.Accion === 2) {
                data = {
                    SolicitudRCID: data.SolicitudRCID,
                    //Hacer entero el PlazoID2
                    PlazoID: parseInt(data.PlazoID2),
                    Motivo: data.motivo2,
                    DistribuidorID: data.DistribuidorID,
                    accion: data.Accion,
                    TipoReestructura: data.TipoReestructura,
                    Estatus: data.Estatus
                }
            } else
                if (data.Accion === 3) {
                    data = {
                        SolicitudRCID: data.SolicitudRCID,
                        QuitaID: data.QuitaID3,
                        PlazoID: data.PlazoID3,
                        Motivo: data.motivo3,
                        DistribuidorID: data.DistribuidorID,
                        accion: data.Accion,

                    }
                }
        axios.post(`${GetServerUrl()}Reestructura/SHDR/CompletarSolicitud`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        }).then(respuesta => {
            Resolver(respuesta.data);
        }).catch(error => {
            Denegar(error);
        });
    });
}
//OBTENER DATOS DEL ANALISTA
export const GetAnalistas = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Reestructura/SHDR/GetAnalistas`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        }).then(respuesta => {
            Resolver(respuesta.data);
        }).catch(error => {
            Denegar(error);
        });
    });

    //OBTENER TIPO DE ANALISTA
export const GetTipoAnalista = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Reestructura/SHDR/GetTipoAnalista`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        }).then(respuesta => {
            Resolver(respuesta.data);
        }).catch(error => {
            Denegar(error);
        });
    });

//OBTENER DATOS DE LA SUCURSAL
export const GetSucursales = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Reestructura/SHDR/GetSucursales`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        }).then(respuesta => {
            Resolver(respuesta.data);
        }).catch(error => {
            Denegar(error);
        });
    });

// OBTENER DATOS DE LA SOLICITUD PARA LA PANTALLA DE LAS SOLICIUTDES
export const GetSolicitudes = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Reestructura/SHDR/GetSolicitudesRC`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        }).then(respuesta => {
            Resolver(respuesta.data);
        }).catch(error => {
            Denegar(error);
        });
    });


export function CancelarSolicitud(oidc: IOidc, data: { SolicitudRCID: number, ComentariosCancelacion: string }) {
    return new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Reestructura/SHDR/cancelarSolicitud`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        }).then(respuesta => {
            Resolver(respuesta.data);
        }).catch(error => {
            Denegar(error);
        });
    });
}

// FUNCION PARA GENERAR HERRAMIENTA DE RESCATE
export const AceptarSolicitud = (oidc: IOidc, data: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Reestructura/HDR/add`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        }).then(respuesta => {
            Resolver(respuesta.data);
        }).catch(error => {
            Denegar(error);
        });
    });
// FUNCION PARA OBTENER LAS NOTAS
export const GetNotas = (oidc: IOidc, datos: { SolicitudRCID: number, DistribuidorID: number }) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Reestructura/SHDR/VerNotas`, datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        }).then(respuesta => {
            Resolver(respuesta.data);
        }).catch(error => {
            Denegar(error);
        });
    });


export const FNGetResCF = async (oidc: IOidc, Datos: any) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}Reestructura/SHDR/ResCF`, Datos, {
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

    export const FNValidarSolicitud = async (oidc: IOidc, Datos: any) =>
        new Promise((Resolver: any, Denegar: any) => {
            axios.post(`${GetServerUrl()}Reestructura/SHDR/ValidarSolicitud`, Datos, {
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


    export const FNGetSimulacionPlazos = async (oidc: IOidc, DistribuidorID : any) => 
        new Promise((Resolver: any, Denegar: any) => {
           axios.post(`${GetServerUrl()}Reestructura/HDR/VerConvenioPP`, {DistribuidorID}, {
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