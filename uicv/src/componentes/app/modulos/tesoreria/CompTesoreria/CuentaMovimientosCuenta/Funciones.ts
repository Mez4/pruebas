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
export const FNGetMultiSaldosCuentas = (Seguridad: IOidc, Id: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(
        `${GetServerUrl()}SOMA/ReplicarCuentas/obtenerMultisaldosCuenta/${Id}`,
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

export const FNGet = (Seguridad: IOidc, Id?: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(`${GetServerUrl()}SOMA/ReplicarCuentas/cuentas-movimientos/${Id}`, {
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

export const FNGetPrincipales = (Seguridad: IOidc, Id?: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(`${GetServerUrl()}SOMA/ReplicarCuentas/cuentas-Movimientos`, {
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
      .get(`${GetServerUrl()}SOMA/ReplicarCuentas/sucursales`, {
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

export const FNGetProductos = (Seguridad: IOidc, Id?: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(`${GetServerUrl()}SOMA/ReplicarCuentas/productos`, {
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

export const FNAddCuenta = (
  Seguridad: IOidc,
  Datos: {
    NumeroCuenta: string;
    Descripcion: number;
    ProductoID: number;
    SucursalID: number;
    CuentaBancoID: number;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}SOMA/ReplicarCuentas/guardar-cuenta`, Datos, {
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

export const FNCancelar = (
  oidc: IOidc,
  Datos: {
    Id: number;
    MvCancelacion: string;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}SOMA/ReplicarCuentas/cancel`, Datos, {
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

export const FNGetEstadoCuentaPDF = (
  oidc: IOidc,
  Datos: { CuentaBancoID: number }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}SOMA/ReplicarCuentas/getEstadoCuentaPDF`, Datos, {
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
