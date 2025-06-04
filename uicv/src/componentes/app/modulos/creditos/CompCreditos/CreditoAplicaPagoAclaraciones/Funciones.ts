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
    GenPPI: boolean;
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

  export const FNGetSaldosAclaracion = (
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
      GenPPI: boolean;
      BonificacionID: number;
    }
  ) =>
    new Promise((Resolver: any, Denegar: any) => {
      axios
        .post(`${GetServerUrl()}creditos/AplicaPagos/getSaldosAclaracion`, Datos, {
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

  export const FNGetBonificaciones = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
      axios
        .get(`${GetServerUrl()}creditos/AplicaPagos/getBonificaciones`, {
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

  export const FNGetTiposCodigo = (oidc: IOidc) =>
      new Promise((Resolver: any, Denegar: any) => {
        axios
          .get(`${GetServerUrl()}creditos/AplicaPagos/getTiposCodigo`, {
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
    CuentaBancoID: number;
    BonificacionID: number;
    Observacion: string;
    GenPPI: boolean;
    TipoCodigoID: number;
    FechaCorte: any;
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

export const FNPdf = (
  oidc: IOidc,
  Datos: { MovimientoID: number },
  dni: number
) =>
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
