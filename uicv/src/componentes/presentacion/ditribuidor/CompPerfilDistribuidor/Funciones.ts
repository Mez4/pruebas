// Generales
import { GetServerUrl } from "./../../../../global/variables";

// Libreria REST
import axios from "axios";

// Interfaces de base de datos
import { DBConfia_Distribuidores } from "../../../../interfaces_db/DBConfia/Distribuidores";

// Interfaces de operaciones
import { IOidc } from "./../../../../interfaces/oidc/IOidc";
import { DBConfia_Cobranza } from "../../../../interfaces_db/DBConfia/Cobranza";
import { DBConfia_Prospeccion } from "../../../../interfaces_db/DBConfia/Prospeccion";

/**
 * Obtiene el detallde de un socia
 * @param {IOidc} oidc Parametros de seguridad
 * @param {number} DistribuidorID Id del socia para la peticion rest
 * @returns {DBConfia_Distribuidores.IAvalesDistribuidor_VW} Registro de la base de datos
 */
export const FNObtenerPorId = (
  oidc: IOidc,
  DistribuidorID: number
): Promise<DBConfia_Distribuidores.IDistribuidores_VW> =>
  new Promise((Resolver, Denegar) => {
    axios
      .get(
        `${GetServerUrl()}Distribuidores/Distribuidor/get/${DistribuidorID}`,
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

export const FNObtenerDistPorId = (
  oidc: IOidc,
  DistribuidorID: number
): Promise<DBConfia_Distribuidores.IDistribuidores_VW> =>
  new Promise((Resolver, Denegar) => {
    axios
      .get(
        `${GetServerUrl()}Distribuidores/Distribuidor/getDist/${DistribuidorID}`,
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

export const FNObtenerDistPorIdMontos = (
  oidc: IOidc,
  DistribuidorID: number
): Promise<DBConfia_Prospeccion.INivelOrigen_Buro_LC_VW> =>
  new Promise((Resolver, Denegar) => {
    axios
      .get(
        `${GetServerUrl()}Distribuidores/Distribuidor/montgetDist/${DistribuidorID}`,
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
export const FNObtenerPorIdEmpresaDv = (
  oidc: IOidc,
  DistribuidorID: number
): Promise<DBConfia_Distribuidores.IDistribuidores_VW> =>
  new Promise((Resolver, Denegar) => {
    axios
      .get(
        `${GetServerUrl()}Distribuidores/Distribuidor/getDistribuidorEmpresa/${DistribuidorID}`,
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

export const FNObtenerAvales = (
  oidc: IOidc,
  DistribuidorID: number
): Promise<DBConfia_Distribuidores.IAvalesDistribuidor_VW[]> =>
  new Promise((Resolver, Denegar) => {
    console.log(oidc.user.state, " getavales");
    axios
      .get(
        `${GetServerUrl()}Distribuidores/Avales/getByDistribuidor/${DistribuidorID}`,
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

export const FNObtenerAvalesDist = (
  oidc: IOidc,
  DistribuidorID: number
): Promise<DBConfia_Distribuidores.IAvalesDistribuidor_VW[]> =>
  new Promise((Resolver, Denegar) => {
    console.log(oidc.user.state, " getavales");
    axios
      .get(
        `${GetServerUrl()}Distribuidores/Avales/getDistribuidor/${DistribuidorID}`,
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

export const FNObtenerReferenciasDist = (
  oidc: IOidc,
  DistribuidorID: number
): Promise<DBConfia_Distribuidores.IAvalesDistribuidor_VW[]> =>
  new Promise((Resolver, Denegar) => {
    console.log(oidc.user.state, " getavales");
    axios
      .get(
        `${GetServerUrl()}Distribuidores/Avales/getDistribuidorRef/${DistribuidorID}`,
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

export const FNObtenerExperiencia = (
  oidc: IOidc,
  DistribuidorID: number
): Promise<DBConfia_Distribuidores.IExperiencia[]> =>
  new Promise((Resolver, Denegar) => {
    axios
      .get(
        `${GetServerUrl()}Distribuidores/Experiencia/getByDistribuidor/${DistribuidorID}`,
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

export const FNObtenerExperienciaDist = (
  oidc: IOidc,
  DistribuidorID: number
): Promise<DBConfia_Prospeccion.IProspectosExperienciaVentas_VW[]> =>
  new Promise((Resolver, Denegar) => {
    axios
      .get(
        `${GetServerUrl()}Distribuidores/Experiencia/getDistribuidor/${DistribuidorID}`,
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

export const FNObtenerValeras = (
  oidc: IOidc,
  DistribuidorID: number
): Promise<DBConfia_Distribuidores.IValeras_VW[]> =>
  new Promise((Resolver, Denegar) => {
    axios
      .get(
        `${GetServerUrl()}Distribuidor/Valeras/getValeraByDistribuidor/${DistribuidorID}`,
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

export const FNObtenerValerasDistr = (
  oidc: IOidc,
  DistribuidorID: number
): Promise<DBConfia_Distribuidores.IValeras_VW[]> =>
  new Promise((Resolver, Denegar) => {
    axios
      .get(
        `${GetServerUrl()}Distribuidor/Valeras/getValeraDistribuidor/${DistribuidorID}`,
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

export const FNObtenerAplicaciones = (
  oidc: IOidc,
  DistribuidorId?: number,
  mostrar?: number
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(
        `${GetServerUrl()}distribuidores/Aplicaciones/getAplicacionId/${DistribuidorId}/${mostrar}`,
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

export const FNObtenerGestores = (
  oidc: IOidc,
  DistribuidorID: number
): Promise<DBConfia_Distribuidores.IDistribuidores[]> =>
  new Promise((Resolver, Denegar) => {
    console.log(DistribuidorID, "iddvgestor");
    axios
      .get(
        `${GetServerUrl()}Cobranza/GestorCobranza/getGestor/${DistribuidorID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${oidc.user.access_token}`,
          },
        }
      )
      .then((respuesta) => {
        console.log(respuesta.data);
        Resolver(respuesta.data);
      })
      .catch((error) => {
        console.log(error);
        Denegar(error);
      });
  });

export const FNObtenerGestoresDist = (
  oidc: IOidc,
  DistribuidorID: number
): Promise<DBConfia_Distribuidores.IDistribuidores[]> =>
  new Promise((Resolver, Denegar) => {
    console.log(DistribuidorID, "iddvgestor");
    axios
      .get(
        `${GetServerUrl()}Cobranza/GestorCobranza/getGestorDist/${DistribuidorID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${oidc.user.access_token}`,
          },
        }
      )
      .then((respuesta) => {
        console.log(respuesta.data);
        Resolver(respuesta.data);
      })
      .catch((error) => {
        console.log(error);
        Denegar(error);
      });
  });

export const FNObtenerCoordinador = (
  oidc: IOidc,
  DistribuidorID: number
): Promise<DBConfia_Distribuidores.IDistribuidores[]> =>
  new Promise((Resolver, Denegar) => {
    axios
      .get(
        `${GetServerUrl()}Creditos/Coordinador/getCoordinador/${DistribuidorID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${oidc.user.access_token}`,
          },
        }
      )
      .then((respuesta) => {
        console.log(respuesta.data);
        Resolver(respuesta.data);
      })
      .catch((error) => {
        console.log(error);
        Denegar(error);
      });
  });

export const FNObtenerCoord = (
  oidc: IOidc,
  DistribuidorID: number
): Promise<DBConfia_Distribuidores.IDistribuidores[]> =>
  new Promise((Resolver, Denegar) => {
    axios
      .get(`${GetServerUrl()}Creditos/Coordinador/getCoord/${DistribuidorID}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
      })
      .then((respuesta) => {
        console.log(respuesta.data);
        Resolver(respuesta.data);
      })
      .catch((error) => {
        console.log(error);
        Denegar(error);
      });
  });

export const FNGetClientesLiquidados = (
  oidc: IOidc,
  DistribuidorID: number
): Promise<DBConfia_Distribuidores.IDistribuidores[]> =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(
        `${GetServerUrl()}Distribuidores/Cliente/getClienteLiquidado/${DistribuidorID}`,
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

export const FNGetCreditosActivos = (
  oidc: IOidc,
  DistribuidorID: number
): Promise<DBConfia_Distribuidores.IDistribuidores[]> =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(
        `${GetServerUrl()}Distribuidores/Cliente/getCreditoActivo/${DistribuidorID}`,
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

export const FNGetClientesCreditosActivos = (
  oidc: IOidc,
  DistribuidorID: number
): Promise<DBConfia_Distribuidores.IDistribuidores[]> =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(
        `${GetServerUrl()}Clientes/ClientesActivos/getClienteActivo/${DistribuidorID}`,
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

export const FNGetClientesCreditos = (
  oidc: IOidc,
  CreditoID: number
): Promise<DBConfia_Distribuidores.IDistribuidores[]> =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(
        `${GetServerUrl()}Clientes/ClientesActivos/getClienteCreditos/${CreditoID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${oidc.user.access_token}`,
          },
        }
      )
      .then((respuesta) => {
        console.log("clientes activos", respuesta.data);
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

export const FNGePlanPagos = (
  oidc: IOidc,
  CreditoID: number
): Promise<DBConfia_Distribuidores.IDistribuidores[]> =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(
        `${GetServerUrl()}Clientes/ClientesActivos/getPlanPagos/${CreditoID}`,
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

export const FNGetAplicaciones = async (
  oidc: IOidc,
  Datos: {
    SucursalID: number;
    DistribuidorID: number;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log("Datos: ", Datos);

    axios
      .post(
        `${GetServerUrl()}creditos/AplicaPagos/getAplicacionesDistribuidor`,
        Datos,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${oidc.user.access_token}`,
          },
        }
      )
      .then((respuesta) => {
        console.log(respuesta, "respcreditosglobal");
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

export const FNGetAbonos = async (oidc: IOidc, AplicacionID: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}creditos/AplicaPagos/getAbonos`,
        { AplicacionID },
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

export const FNGetPlanPagos = async (oidc: IOidc, CreditoID?: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}creditos/PlanPagos/get`,
        { CreditoID },
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

export const FNGetFichaPago = (oidc: IOidc, Datos: { CreditoID: number }) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}creditos/credito/getfichapagoclientefinal`,
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

export const AddSolicitudSCRS = (oidc: IOidc, Data: any) => {
  return new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}Reestructura/SHDR/GenerarSolicitud`, Data, {
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
