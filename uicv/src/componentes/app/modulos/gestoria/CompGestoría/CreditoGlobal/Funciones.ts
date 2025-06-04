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
      .post(`${GetServerUrl()}gestoria/Global/getbyfiltros`, Datos, {
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

  
export const FNGetFechaUltimaActualizacionGlobal = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.get(`${GetServerUrl()}Creditos/Reportes/UltimaActualizacionGlobal`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                // console.log(respuesta)
                Resolver(respuesta.data)
            })
            .catch(error => {
                Denegar(error)
            })
    })

export const FNGetGlobal = (oidc: IOidc) =>
      new Promise((Resolver: any, Denegar: any) => {
          axios.get(`${GetServerUrl()}Creditos/Reportes/getGlobalNewGestoria`, {
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${oidc.user.access_token}`
              }
          })
              .then(respuesta => {
                  // console.log(respuesta)
                  Resolver(respuesta.data)
              })
              .catch(error => {
                  Denegar(error)
              })
      })