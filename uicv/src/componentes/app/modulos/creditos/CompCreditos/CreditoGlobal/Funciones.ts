import axios from "axios";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { GetServerUrl } from "../../../../../../global/variables";

export const FNGet = async (oidc: IOidc, CreditoID?: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log(oidc);
    axios
      .get(`${GetServerUrl()}creditos/Global/get/${CreditoID}`, {
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

export const getdataGlobal = async (
  oidc: IOidc,
  Datos: {
    ProductoID: number;
    DirectorID?: number;
    ClienteID: number;
    SucursalID: number;
    ZonaID: number;
    DistribuidorID: number;
    GrupoID: number;
    Tipo: number;
    tipoDias: number;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}creditos/Global/getdataGlobal`, Datos, {
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

export const FNgetbyfiltros = async (
  oidc: IOidc,
  Datos: {
    ProductoID: number;
    DirectorID?: number;
    ClienteID: number;
    SucursalID: number;
    ZonaID: number;
    // EmpresaId: number,
    DistribuidorID: number;
    GrupoID: number;
    // CoordinadorID: number,
    Tipo: number;
    tipoDias: number;
    // ContratoID: number,
    // EstatusID: string,
    // DistribuidorNivelID: number,
    // FechaInicio: Date,
    // FechaFin: Date
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}creditos/Global/getbyfiltros`, Datos, {
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

export const FNgetbyfiltros2 = async (
  oidc: IOidc,
  Datos: {
    ProductoID: number;
    DirectorID?: number;
    ClienteID: number;
    SucursalID: number;
    ZonaID: number;
    // EmpresaId: number,
    DistribuidorID: number;
    GrupoID: number;
    // CoordinadorID: number,
    Tipo: number;
    tipoDias: number;
    // ContratoID: number,
    // EstatusID: string,
    // DistribuidorNivelID: number,
    // FechaInicio: Date,
    // FechaFin: Date
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}creditos/Global/getbyfiltros2`, Datos, {
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

export const FNGetAclaraciones = async (oidc: IOidc, DistribuidorID?: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}creditos/Global/GetAclaraciones`,
        { DistribuidorID },
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

export const FNGetPlanPagosCliente = async (oidc: IOidc, CreditoID?: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}creditos/PlanPagos/getPlanPagos`,
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

export const FNGetPlanPagosClienteProd = async (
  oidc: IOidc,
  CreditoID?: number
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}creditos/PlanPagos/getPlanPagosProd`,
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

export const FNGetClientes = async (
  oidc: IOidc,
  DistribuidorID?: number,
  ClienteID?: number,
  ProductoID?: number
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}creditos/ClientesDistribuidor/get`,
        { DistribuidorID, ClienteID, ProductoID },
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

export const FNGCreditosCliente = async (
  oidc: IOidc,
  DistribuidorID?: number,
  ClienteID?: number,
  ProductoID?: number,
  Todos?: boolean
) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log(oidc, "creditos cliente");
    axios
      .post(
        `${GetServerUrl()}creditos/ClientesDistribuidor/getCreditosCliente`,
        { ClienteID, DistribuidorID, ProductoID, Todos },
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

export const FNGDetallesCliente = async (
  oidc: IOidc,
  DistribuidorID?: number,
  ClienteID?: number,
  ProductoID?: number,
  Todos?: boolean
) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log(oidc, "detalles cliente");
    axios
      .post(
        `${GetServerUrl()}creditos/ClientesDistribuidor/getDetallesCliente`,
        { ClienteID, DistribuidorID, ProductoID, Todos },
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

export const FNGetCreditosPrductoCliente = async (
  oidc: IOidc,
  ClienteID?: number
) =>
  new Promise((Resolver: any, Denegar: any) => {
    // console.log(oidc, ClienteID, ' CREDPRODCLIENT')
    axios
      .post(
        `${GetServerUrl()}creditos/ClientesDistribuidor/getCreditosPrductoCliente`,
        { ClienteID },
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

export const FNGetTipoUsuario = (
  oidc: IOidc,
  data: { usuarioID: number | undefined }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}creditos/reportes/gettipousuario`, data, {
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

export const FNGetCreditosProdCliente = async (
  oidc: IOidc,
  ClienteID?: number
) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log(oidc, ClienteID, " CREDPRODCLIENT");
    axios
      .post(
        `${GetServerUrl()}creditos/ClientesDistribuidor/getCreditosProdCliente`,
        { ClienteID },
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

export const FNCancelar = async (oidc: IOidc, CreditoID: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    // console.log(oidc, CreditoID)
    axios
      .post(
        `${GetServerUrl()}Creditos/Credito/cancel`,
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

export const FNDesembolsar = async (oidc: IOidc, CreditoID: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    // console.log(oidc, CreditoID)
    axios
      .post(
        `${GetServerUrl()}Creditos/Credito/desembolsar`,
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

export const FNGetInfoDistribuidor = async (
  oidc: IOidc,
  DistribuidorID?: number
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}creditos/ClientesDistribuidor/getInfoDistribuidor`,
        { DistribuidorID },
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
        console.log(error);
        Denegar(error);
      });
  });

export const FNGetInfDistribuidor = async (
  oidc: IOidc,
  DistribuidorID?: number
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}creditos/ClientesDistribuidor/getInfDistribuidor`,
        { DistribuidorID },
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
        console.log(error);
        Denegar(error);
      });
  });

export const FNGetClientesProducto = async (
  oidc: IOidc,
  DistribuidorID?: number,
  ProductoID?: number
) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log(oidc, DistribuidorID, ProductoID, "getClientesProducto ");
    axios
      .post(
        `${GetServerUrl()}creditos/ClientesDistribuidor/getClientesProducto`,
        { DistribuidorID, ProductoID },
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

export const FNGetInfClientesProducto = async (
  oidc: IOidc,
  DistribuidorID?: number,
  ProductoID?: number
) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log(oidc, DistribuidorID, ProductoID, "getInfClientesProducto ");
    axios
      .post(
        `${GetServerUrl()}creditos/ClientesDistribuidor/getInfClientesProducto`,
        { DistribuidorID, ProductoID },
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
