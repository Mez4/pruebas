import axios from "axios";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { GetServerUrl } from "../../../../../../global/variables";

export const FNGetSaldos = (
  oidc: IOidc,
  Datos: {
    ProductoId: number;
    DistribuidorId: number;
    SucursalId: number;
    CuentaId: number;
    FechaPago: Date;
    Importe: number;
    GenerarDNI: boolean;
    CodigoAut: string;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}creditos/AplicaPagos/getSaldos`, Datos, {
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

export const FNAdd = (
  oidc: IOidc,
  Datos: {
    ProductoId: number;
    DistribuidorId: number;
    SucursalId: number;
    CajaID: number;
    CuentaId: number;
    FechaPago: Date;
    Importe: number;
    GenerarDNI: boolean;
    CodigoAut: string;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}creditos/AplicaPagos/addaclaracion`, Datos, {
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

export const FNPdf = (oidc: IOidc, Datos: { MovimientoID: number }) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}creditos/AplicaPagos/pdf`, Datos, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
        responseType: "blob",
      })
      .then((respuesta) => {
        console.log(respuesta);
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

export const FNGetDNIs = (
  oidc: IOidc,
  Datos: {
    DistribuidorId: number;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}creditos/AplicaPagos/getDNIs`, Datos, {
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

export const FNAddPagoDNI = (
  oidc: IOidc,
  Datos: {
    ProductoId: number;
    DistribuidorId: number;
    SucursalId: number;
    CajaID: number;
    CuentaId: number;
    FechaPago: Date;
    Importe: number;
    GenerarDNI: boolean;
    CodigoAut: string;
    MovimientoIDs: [];
    CuentaBancoID: number;
    Observacion: string;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log("Datos: ", Datos);
    axios
      .post(`${GetServerUrl()}creditos/AplicaPagos/addpagodni`, Datos, {
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

export const FNGetCuentasBancarias = (oidc: IOidc) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(`${GetServerUrl()}creditos/AplicaPagos/getCuentasBancarias`, {
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
