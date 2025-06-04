import axios from "axios";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { GetServerUrl } from "../../../../../../global/variables";

export const FNGetSaldos = (
  oidc: IOidc,
  Datos: {
    ClienteID: number;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}creditos/SaldoCliente/getById`, Datos, {
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

export const FNGetSaldosCredito = (
  oidc: IOidc,
  Datos: {
    ClienteID: number;
    CreditoID: number;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}creditos/SaldoCliente/getByIdCredito`, Datos, {
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
    ClienteID: number;
    SucursalId: number;
    A_Pagar: number;
    Liquida: boolean;
    Comision: boolean;
    CreditoID: number;
    MovimientoIDs?: [];
    CuentaBancoID: number;
    FechaPago: Date;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}creditos/SaldoCliente/add`, Datos, {
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
      .post(`${GetServerUrl()}creditos/SaldoCliente/pdf`, Datos, {
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
