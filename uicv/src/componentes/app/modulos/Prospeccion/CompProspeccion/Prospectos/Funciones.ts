import axios from "axios";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { GetServerUrl } from "../../../../../../global/variables";
import { DBConfia_Prospeccion } from "../../../../../../interfaces_db/DBConfia/Prospeccion";

type ProspectoPersonaType = {
  // Persona: DBConfia_General.IPersonas_VW,
  Nombre: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  FechaNacimiento: string;
  LugarNacimiento: string;
  CURP: string;
  RFC: string;
  SexoID: string;
  EstadoCivilID: string;
  EscolaridadID: number;
  DependientesEconomicos: number;
  TelefonoDomicilio: string;
  TelefonoMovil: string;
  CorreoElectronico: string;
  NombreConyuge: string;
  Observaciones: string;
  identificacionTipoId: number;
  identificacionNumero: string;
  AgregarProspecto: {
    CrearProspecto: boolean;
  };
  AgregarCliente: {};
  AgregarDirector: {};
  SucursalID?: number;
  Prospeccion?: number;
};

export const FNAgregar = (oidc: IOidc, Datos: ProspectoPersonaType) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log("Datos: ", Datos);

    axios
      .post(`${GetServerUrl()}Administracion/Personas/add`, Datos, {
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

export const FNAgregarAval = (oidc: IOidc, Datos: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log("Datos: ", Datos);
    axios
      .post(`${GetServerUrl()}Prospeccion/Prospectos/AddAval`, Datos, {
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

export const FNEditarAval = (oidc: IOidc, Datos: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log("Datos: ", Datos);
    axios
      .post(`${GetServerUrl()}Prospeccion/Prospectos/EditAval`, Datos, {
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

export const FNGet = (
  oidc: IOidc,
  values: any
): Promise<DBConfia_Prospeccion.IProspectos_VW[]> =>
  new Promise((Resolver, Denegar) => {
    values.Prospecto = true;
    // Generamos un nuevo objecto para enviar al servidor
    let valoresEnviar: any = {};
    valoresEnviar.Nombre = values.Nombre;
    valoresEnviar.CURP = values.CURP;
    valoresEnviar.RFC = values.RFC;
    valoresEnviar.SucursalID = values.SucursalID;
    if (values.StatusProcesoID)
      valoresEnviar.StatusProcesoID = values.StatusProcesoID;
    console.log(valoresEnviar);
    console.log(values);
    // Validamos los opcionales
    // if (values.SexoID) valoresEnviar.SexoID = values.SexoID
    // if (values.EstadoCivilID) valoresEnviar.EstadoCivilID = values.EstadoCivilID
    // if (values.EscolaridadID) valoresEnviar.EscolaridadID = values.EscolaridadID
    // if (values.OcupacionID) valoresEnviar.OcupacionID = values.OcupacionID
    if (values.Prospecto) valoresEnviar.Prospecto = values.Prospecto;

    axios
      .post(`${GetServerUrl()}Prospeccion/Prospectos/get`, valoresEnviar, {
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

export const FNGetByCoordinador = (
  oidc: IOidc,
  values: any
): Promise<DBConfia_Prospeccion.IProspectos_VW[]> =>
  new Promise((Resolver, Denegar) => {
    values.Prospecto = true;
    // Generamos un nuevo objecto para enviar al servidor
    let valoresEnviar: any = {};
    valoresEnviar.Nombre = values.Nombre;
    valoresEnviar.CURP = values.CURP;
    valoresEnviar.RFC = values.RFC;
    if (values.StatusProcesoID)
      valoresEnviar.StatusProcesoID = values.StatusProcesoID;
    console.log(valoresEnviar);
    console.log(values);
    // Validamos los opcionales
    // if (values.SexoID) valoresEnviar.SexoID = values.SexoID
    // if (values.EstadoCivilID) valoresEnviar.EstadoCivilID = values.EstadoCivilID
    // if (values.EscolaridadID) valoresEnviar.EscolaridadID = values.EscolaridadID
    // if (values.OcupacionID) valoresEnviar.OcupacionID = values.OcupacionID
    if (values.Prospecto) valoresEnviar.Prospecto = values.Prospecto;

    axios
      .post(
        `${GetServerUrl()}Prospeccion/Prospectos/getByCoordinador`,
        valoresEnviar,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${oidc.user.access_token}`,
          },
        }
      )
      .then((respuesta) => {
        console.log(respuesta);
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

export const FNGetByProduct = (
  oidc: IOidc,
  values: any
): Promise<DBConfia_Prospeccion.IProspectos_VW[]> =>
  new Promise((Resolver, Denegar) => {
    values.Prospecto = true;
    // Generamos un nuevo objecto para enviar al servidor
    let valoresEnviar: any = {};
    valoresEnviar.Nombre = values.Nombre;
    valoresEnviar.CURP = values.CURP;
    valoresEnviar.RFC = values.RFC;
    valoresEnviar.SucursalID = values.SucursalID;

    if (values.StatusProcesoID)
      valoresEnviar.StatusProcesoID = values.StatusProcesoID;
    console.log(valoresEnviar);
    console.log(values);
    // Validamos los opcionales
    // if (values.SexoID) valoresEnviar.SexoID = values.SexoID
    // if (values.EstadoCivilID) valoresEnviar.EstadoCivilID = values.EstadoCivilID
    // if (values.EscolaridadID) valoresEnviar.EscolaridadID = values.EscolaridadID
    // if (values.OcupacionID) valoresEnviar.OcupacionID = values.OcupacionID
    if (values.Prospecto) valoresEnviar.Prospecto = values.Prospecto;

    axios
      .post(
        `${GetServerUrl()}Prospeccion/Prospectos/getByProduct`,
        valoresEnviar,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${oidc.user.access_token}`,
          },
        }
      )
      .then((respuesta) => {
        console.log(respuesta);
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

export const FNAgregarDatosEconomicos = (oidc: IOidc, Datos: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log("Datos: ", Datos);

    axios
      .post(
        `${GetServerUrl()}Prospeccion/Prospectos/AddDatosEconomicos`,
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
        console.log("error: ", error);
        Denegar(error);
      });
  });

export const FNEditarDatosEconomicos = (oidc: IOidc, Datos: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log("Datos: ", Datos);

    axios
      .post(
        `${GetServerUrl()}Prospeccion/Prospectos/EditDatosEconomicos`,
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
        console.log("error: ", error);
        Denegar(error);
      });
  });

export const FNAgregarReferencia = (oidc: IOidc, Datos: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log("Datos: ", Datos);

    axios
      .post(`${GetServerUrl()}Prospeccion/Referencias/AddReferencia`, Datos, {
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

export const FNObtenerProceso = (oidc: IOidc, ProspectoID: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log("Datos: ", ProspectoID);
    axios
      .post(
        `${GetServerUrl()}Prospeccion/Prospectos/GetProcesos`,
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

export const FNObtenerProspectos = (oidc: IOidc, ProspectoID: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log("Datos: ", ProspectoID);
    axios
      .post(
        `${GetServerUrl()}Prospeccion/Prospectos/GetPerfilProspecto`,
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

export const FNObtenerBC = (oidc: IOidc, ProspectoID: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log("Datos: ", ProspectoID);
    axios
      .post(
        `${GetServerUrl()}Prospeccion/Prospectos/GetBC`,
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

export const FNValidarDocumentos = (oidc: IOidc, ProspectoID: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log("Datos: ", ProspectoID);
    axios
      .post(
        `${GetServerUrl()}Prospeccion/Prospectos/ValidarDocumentos`,
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

export const FNValidarDocumentosCompletos = (
  oidc: IOidc,
  ProspectoID: number
) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log("Datos: ", ProspectoID);
    axios
      .post(
        `${GetServerUrl()}Prospeccion/Prospectos/ValidarDocumentosCompletos`,
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

export const FNValidarDocumentosAvales = (oidc: IOidc, ProspectoID: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log("Datos: ", ProspectoID);
    axios
      .post(
        `${GetServerUrl()}Prospeccion/Prospectos/ValidarDocumentosAvales`,
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

export const FNValidarReferenciasAvales = (oidc: IOidc, ProspectoID: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log("Datos: ", ProspectoID);
    axios
      .post(
        `${GetServerUrl()}Prospeccion/Prospectos/ValidarReferenciasAvales`,
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

export const FNValidarProspecto = (oidc: IOidc, ProspectoID: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log("Datos: ", ProspectoID);
    axios
      .post(
        `${GetServerUrl()}Prospeccion/Prospectos/ValidarProspecto`,
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

export const FNGetNotificaciones = (oidc: IOidc, ProspectoID: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}Prospeccion/Prospectos/GetNotificaciones`,
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

export const FNGetNotificacionLeida = (oidc: IOidc, ProspectoID: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}Prospeccion/Prospectos/NotificacionLeida`,
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

export const FNEviarMsjPromotorSucursal = (oidc: IOidc, Datos: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log(Datos);
    axios
      .post(
        `${GetServerUrl()}Prospeccion/Prospectos/EviarMsjPromotorSucursal`,
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
        console.log("error: ", error);
        Denegar(error);
      });
  });

export const FNSubirDoc = (oidc: IOidc, Datos: FormData) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log("xx", Datos);
    axios
      .post(
        `${GetServerUrl()}Prospeccion/Prospectos/subirDocActivacion`,
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

export const FNGetDocsByDocumentoPath = (oidc: IOidc, DocumentoPath?: string) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}Prospeccion/Prospectos/getDocActivacion`,
        { DocumentoPath },
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

export const FNBuscarCurp = (
  oidc: IOidc,
  datos: {
    Curp: string;
    status: boolean;
    ProductoID?: number;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}General/Renapo/buscaCurp`, datos, {
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

export const FNSucursalesPromotoria = (oidc: IOidc) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}Prospeccion/Prospectos/getSucursalesPromotor`,
        {},
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

//Vcanas - SP para editar solamente NivelOrigen y Dictamen Buro en expediente y activacion (se puede usar para cosas similares agregando un IF con un @opcion diferente)
export const FNEditarProspectoPreActivacion = (oidc: IOidc, Datos: {
  opcion: number,
  ProspectoID: number | undefined,
  ProductoID: number | undefined,
  NivelOrigen?: any,
  BuroInterno?: any,
}) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios.post(`${GetServerUrl()}Prospeccion/MesaCredito/EditarSocia`, Datos, {
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
