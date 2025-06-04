import { toast } from "react-toastify";
import axios from "axios";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { GetServerUrl } from "../../../../../../global/variables";
import { DBConfia_General } from "../../../../../../interfaces_db/DBConfia/General";
import { DBConfia_Creditos } from "../../../../../../interfaces_db/DBConfia/Creditos";

export type FNObtenerPersonaRespuesta = {
  // Datos basicos de una persona
  persona: DBConfia_General.IPersonas_VW;
  direcciones: DBConfia_General.IDirecciones_VW[];
  empleos: DBConfia_General.IEmpleos_VW[];
  contCreditos: DBConfia_Creditos.ICreditos_VW[];
  creditos: DBConfia_Creditos.ICreditos_VW;
  direccionesMigradas: DBConfia_General.IDireccionesMigradas[];
  documentos: {};
  cliente: { CanjeaVale };
  // docs: DBConfia_General.IPersonasDoc[]
};
export const FNObtenerPersona = (
  oidc: IOidc,
  PersonaID: number
): Promise<FNObtenerPersonaRespuesta> =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}Administracion/Personas/get`,
        { PersonaID },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${oidc.user.access_token}`,
          },
        }
      )
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

export const FNGetFoliosByValera = (oidc: IOidc, ValeraId?: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log(oidc, "valera");
    axios
      .post(
        `${GetServerUrl()}distribuidores/ValeraDetalle/getfoliosbyvalera`,
        { ValeraId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${oidc.user.access_token}`,
          },
        }
      )
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

export const FNGetFoliosValera = (oidc: IOidc, ValeraId?: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log(oidc, "valera");
    axios
      .post(
        `${GetServerUrl()}distribuidores/ValeraDetalle/getFoliosValera`,
        { ValeraId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${oidc.user.access_token}`,
          },
        }
      )
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

export const FNObtenerPersonaSAC = (
  oidc: IOidc,
  Datos: { PersonaID: number; NombreCompleto: string }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}Administracion/Personas/getWithSAC`, Datos, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
      })
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 400)
          Denegar(error.response.data);
        Denegar("Error desconocido");
      });
  });

export const FNObtenerCreditosActivos = (oidc: IOidc, values: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}Administracion/Personas/creditos/get`, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
      })
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 400)
          Denegar(error.response.data);
        Denegar("Error desconocido");
      });
  });

export const FNAgregarEmpleo = (oidc: IOidc, Datos: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}Administracion/Personas/empleo/add`, Datos, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
      })
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });
//
export const FNAgregarDireccion = (oidc: IOidc, Datos: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}Administracion/Personas/direccion/add`, Datos, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
      })
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

export const AddDireccion = (oidc: IOidc, Datos: any, personaID?: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log(personaID, "Datos: ", Datos);
    axios
      .post(`${GetServerUrl()}Administracion/Personas/AddDireccion`, Datos, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
      })
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        console.log("errorrr: ", error);
        Denegar(error);
      });
  });

export const AddEmpleo = (oidc: IOidc, Datos: any, personaID?: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log(personaID, "Datos: ", Datos);
    axios
      .post(`${GetServerUrl()}Administracion/Personas/AddEmpleo`, Datos, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
      })
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        console.log("errorrr: ", error);
        Denegar(error);
      });
  });

export const FNEditar = (oidc: IOidc, Datos: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}Administracion/Personas/edit`, Datos, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
      })
      .then((respuesta) => {
        toast.success("Persona Actualizada");
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

export const FNEditarEstatusDist = (oidc: IOidc, Datos: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}Distribuidores/Estatus/update`, Datos, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
      })
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

export const FNGetDistribuidor = (oidc: IOidc, Datos: { Id: number }) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}Distribuidores/Distribuidor/get`, Datos, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
      })
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

  export const FNGeValeraSocia = (oidc: IOidc,  DistribuidorID: number ) =>
    new Promise((Resolver: any, Denegar: any) => {
      axios
        .post(`${GetServerUrl()}Distribuidores/Distribuidor/getserievalera/${DistribuidorID}`, DistribuidorID, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${oidc.user.access_token}`,
          },
        })
        .then((respuesta) => {
          Resolver(respuesta.data);
        })
        .catch((error) => {
          Denegar(error);
        });
    });

export const FNGetDistribuidorPDF = (oidc: IOidc, Datos: { Id: number }) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}Distribuidores/Distribuidor/getPDF`, Datos, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
        responseType: "blob",
      })
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

export const FNGetDistribuidorCartaCobro = (
  oidc: IOidc,
  Datos: { Id: number }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}Distribuidores/Distribuidor/getCartaCobro`,
        Datos,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${oidc.user.access_token}`,
          },
          responseType: "blob",
        }
      )
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

export const FNGetCliente = (oidc: IOidc, Datos: { ClienteId: number }) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}Distribuidores/Cliente/getClienteById`, Datos, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
      })
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

//Solicitud de Fallecimiento
export const FNSubirSolicitud = (oidc: IOidc, Datos: FormData) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}Distribuidores/Distribuidor/subirExpediente`,
        Datos,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${oidc.user.access_token}`,
          },
        }
      )
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

//
export const FnGetEvidencia = (
  oidc: IOidc,
  DocumentoID: number,
  SolicitudID: number
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}Distribuidores/Distribuidor/getEvidencia`,
        { SolicitudID, DocumentoID },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${oidc.user.access_token}`,
          },
        }
      )
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

//Solicitud de Cancelación Temporal
export const FNSubirSolicitudCT = (oidc: IOidc, Datos: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}Distribuidores/Distribuidor/cancelTempObs`,
        Datos,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${oidc.user.access_token}`,
          },
        }
      )
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

export const FNDeshabilitarAppSocia = (oidc: IOidc, dvId: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .put(
        `${GetServerUrl()}Distribuidores/Distribuidor/DisableAppSocia`,
        { DistribuidorId: dvId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${oidc.user.access_token}`,
          },
        }
      )
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });
