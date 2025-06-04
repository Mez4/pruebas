import axios from "axios";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { GetServerUrl } from "../../../../../../global/variables";

// export const FNGet = (oidc: IOidc, Id?: string) =>
//     new Promise((Resolver: any, Denegar: any) => {
//         axios.post(`${GetServerUrl()}creditos/canjeavale/get`, {}, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${oidc.user.access_token}`
//             }
//         })
//             .then(respuesta => {
//                 Resolver(respuesta.data)
//             })
//             .catch(error => {
//                 Denegar(error)
//             })
//     })

export const FNAdd = (
  oidc: IOidc,
  Datos: {
    ProductoID: number;
    ProductoTiendita: number;
    DistribuidorId: number;
    CuentaId: number;
    ClienteId: number;
    SucursalId: number;
    Folio: number;
    SerieId: number;
    Capital: number;
    Plazos: number;
    TipoDesembolsoID: number;
    articles: [];
    MovimientoID?: number;
    VentaId?: number;
    JsonTda?: string;
    TipoCanje: number;
    PrestamoNomina: boolean;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    // console.log('Datos: ', Datos)
    if (Datos.TipoCanje == 3)
      axios
        .post(`${GetServerUrl()}creditos/canjeavale/tiendita`, Datos, {
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
    else
      axios
        .post(`${GetServerUrl()}creditos/canjeavale/tienditacontado`, Datos, {
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
  Datos: { ProductoID: number; CreditoID: number; CreditoID_2: number }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}creditos/canjeavale/pdf`, Datos, {
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

// export const FNUpdate = (oidc: IOidc, Datos: {}) =>
//     new Promise((Resolver: any, Denegar: any) => {
//         axios.post(`${GetServerUrl()}creditos/credito/update`, Datos, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${oidc.user.access_token}`
//             }
//         })
//             .then(respuesta => {
//                 Resolver(respuesta.data)
//             })
//             .catch(error => {
//                 Denegar(error)
//             })
//     })

export const FNAddTiendita = (
  oidc: IOidc,
  Datos: {
    ProductoTienditaID: number;
    ProductoID: number;
    DistribuidorId: number;
    // ClienteId: number,
    SucursalId: number;
    articles: any;
    CajaID: number;
    Capital: number;
    Plazos: number;
    TipoDesembolsoID: number;
    Sucursal: {
      id_empresa: number;
      id_sucursal: number;
      id_origen: string;
      sistema: string;
    };
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log(Datos);

    axios
      .post(`${GetServerUrl()}creditos/canjeavale/addTiendita`, Datos, {
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

export const FNAddVentaContado = (
  oidc: IOidc,
  Datos: {
    ProductoTienditaID: number;
    ProductoID: number;
    SucursalId: number;
    articles: any;
    CajaID: number;
    Capital: number;
    Sucursal: {
      id_empresa: number;
      id_sucursal: number;
      id_origen: string;
      sistema: string;
    };
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log(Datos);

    axios
      .post(`${GetServerUrl()}creditos/canjeavale/addVentaContado`, Datos, {
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


export const FNAddVentaContadoMonedero = (
  oidc: IOidc,
  Datos: {
    ProductoTienditaID: number;
    ProductoID: number;
    SucursalId: number;
    DistribuidorId: number;
    articles: any;
    CajaID: number;
    Capital: number;
    Sucursal: {
      id_empresa: number;
      id_sucursal: number;
      id_origen: string;
      sistema: string;
    };
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log(Datos);
    axios
      .post(`${GetServerUrl()}creditos/canjeavale/addVentaContadoMonedero`, Datos, {
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

export const FNPdfVentaContado = (
  oidc: IOidc,
  Datos: { ProductoID: number; CreditoID: number; CreditoID_2: number }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}creditos/canjeavale/pdfVentaContado`, Datos, {
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
