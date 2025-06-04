import { date } from "yup/lib/locale";
import { ErrorMessage } from "formik";
import axios from "axios";
import { GetServerUrl } from "../../../../../../global/variables";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";

/**
 * Funcion para obtener los tipos de vivienda
 * @param {IOidc} Seguridad Estado de redux de seguridad
 * @param {number} Id Datos a subir
 * @returns any
 */

export const FNCancelarSolicitud = (
  Seguridad: IOidc,
  Datos: {
    SolicitudGastoID: number;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .put(`${GetServerUrl()}SOMA/RubrosGastos/cancelar-solicitud-v2`, Datos, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Seguridad.user.access_token}`,
        },
      })
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

export const FNGetSucursales = (Seguridad: IOidc, Id?: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(`${GetServerUrl()}SOMA/RubrosGastos/getSucursales`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Seguridad.user.access_token}`,
        },
      })
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

export const FNGetRubros = (Seguridad: IOidc, Id?: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(`${GetServerUrl()}SOMA/RubrosGastos/getRubros`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Seguridad.user.access_token}`,
        },
      })
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

export const FNGetEstatus = (Seguridad: IOidc, Id?: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(`${GetServerUrl()}SOMA/RubrosGastos/getEstatus`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Seguridad.user.access_token}`,
        },
      })
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

export const FNGet = (
  Seguridad: IOidc,
  Datos: {
    FechaInicial?: string;
    FechaFinal?: string;
    SucursalCajaID: number;
    EstatusClave: string;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}SOMA/RubrosGastos/solicitud-gastos-v2`, Datos, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Seguridad.user.access_token}`,
        },
      })
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

export const FNGetDetalle = (Seguridad: IOidc, Id?: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(
        `${GetServerUrl()}SOMA/RubrosGastos/detalle-solicitud-gastos/${Id}`,
        {
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

export const FNRechazarSolicitud = (Seguridad: IOidc, Datos?: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}SOMA/RubrosGastos/rechazar-solicitud`, Datos, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Seguridad.user.access_token}`,
        },
      })
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

export const FNAceptarSolicitud = (Seguridad: IOidc, Datos?: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}SOMA/RubrosGastos/aplicar-solicitud`, Datos, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Seguridad.user.access_token}`,
        },
      })
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

export const FNProrratear = (Seguridad: IOidc, Datos?: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .put(`${GetServerUrl()}SOMA/RubrosGastos/actualizarProrrateo`, Datos, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Seguridad.user.access_token}`,
        },
      })
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

export const FNAutorizarSolicitud = (Seguridad: IOidc, Datos?: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}SOMA/RubrosGastos/autorizar-solicitud-gastos`,
        Datos,
        {
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

export const FNImprimir = (
  oidc: IOidc,
  Datos: {
    SolicitudGastoID: number;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}SOMA/rubrosgastos/imprimirSolgas`, Datos, {
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

export const FNUpdate = (oidc: IOidc, Datos: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .put(`${GetServerUrl()}SOMA/rubrosgastos/actualizar`, Datos, {
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

export const FNUpdateSucursal = (oidc: IOidc, Datos: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .put(`${GetServerUrl()}SOMA/rubrosgastos/actualizarSucursal`, Datos, {
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
