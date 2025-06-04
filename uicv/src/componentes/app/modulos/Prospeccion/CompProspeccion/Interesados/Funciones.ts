import axios from "axios";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { GetServerUrl } from "../../../../../../global/variables";
import { DBConfia_Prospeccion } from "../../../../../../interfaces_db/DBConfia/Prospeccion";
import { toast } from "react-toastify";

type ProspectoPersonaType = {
  // Persona: DBConfia_General.IPersonas_VW,
  Nombre: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  FechaNacimiento: string;
  LugarNacimiento: string;
  SexoID: string;
  TelefonoDomicilio: string;
  TelefonoMovil: string;
  AsentamientoID: number;
  calle: string;
  localidad: string;
  numeroExterior: number;
};

export const FNGetinteresadosgerente = (
  Seguridad: IOidc,
  GereneteId?: number
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}Prospeccion/Interesados/getInteresadosGerente`,
        { GereneteId },
        {
          //ruta del controlador (api)
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Seguridad.user.access_token}`,
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

export const VerficarGerente = (oidc: IOidc) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(`${GetServerUrl()}Prospeccion/Interesados/getVerifGerente`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
      })
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        console.log("error: ", error);
        Denegar(error);
      });
  });

export const FNAgregar = (oidc: IOidc, Datos: ProspectoPersonaType) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log("Datos: ", Datos);

    axios
      .post(`${GetServerUrl()}Prospeccion/Interesados/add`, Datos, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
      })
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        if (error.response) {
          // Handle JSON error directly
          const parsedError = error.response.data;
          const errorMessage =
            parsedError?.message || parsedError?.error || "Unknown error";
          toast.error(`ERROR: ${errorMessage}`);
        } else if (error.request) {
          // Request was made but no response
          toast.error("ERROR: No response received from the server");
        } else {
          // Other errors
          toast.error(`ERROR: ${error.message}`);
        }
        Denegar(error);
      });
  });

export const FNEditar = (
  oidc: IOidc,
  Datos: ProspectoPersonaType,
  ProspectoID: number
) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log("Datos: ", Datos);

    axios
      .post(`${GetServerUrl()}Prospeccion/Prospectos/editar`, Datos, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
      })
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        console.log("error: ", error);
        Denegar(error);
      });
  });
export const FNGetByInteresados = (
  oidc: IOidc
): Promise<DBConfia_Prospeccion.IInteresados_VW[]> =>
  new Promise((Resolver, Denegar) => {
    axios
      .post(`${GetServerUrl()}Prospeccion/Prospectos/getInteresados`, {
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

export const FNGetInteresados = (Seguridad: IOidc, Id?: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}Prospeccion/Interesados/getInteresados`,
        {},
        {
          //ruta del controlador (api)
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Seguridad.user.access_token}`,
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

export const FNGetInteresadosEdit = (
  Seguridad: IOidc,
  InteresadosID?: number
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}Prospeccion/Interesados/getInteresadosEdi`,
        { InteresadosID },
        {
          //ruta del controlador (api)
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Seguridad.user.access_token}`,
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

export const FNGetInteresadosEditGerente = (
  Seguridad: IOidc,
  InteresadosID?: number
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}Prospeccion/Interesados/getInteresadosEdiGerente`,
        { InteresadosID },
        {
          //ruta del controlador (api)
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Seguridad.user.access_token}`,
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

export const FNUpdate = (
  oidc: IOidc,
  Datos: { InteresadosID: number; InicioProceso: boolean }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}Prospeccion/Interesados/update`, Datos, {
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

export const FNObtenerPersona = (oidc: IOidc, ProspectoID: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log("Datos: ", ProspectoID);
    axios
      .post(
        `${GetServerUrl()}Prospeccion/Prospectos/GetPerfil`,
        { ProspectoID },
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
        console.log("error: ", error);
        Denegar(error);
      });
  });

export const FNConsultarEstatusCURP = (oidc: IOidc) => {
  return new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(`${GetServerUrl()}General/Renapo/ObtenerEstatusCurp`, {
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
};

export const FNBuscarCurp = (oidc: IOidc, Curp: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}General/Renapo/buscaCurp`, Curp, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
      })
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        console.log("error: ", error);
        Denegar(error);
      });
  });
