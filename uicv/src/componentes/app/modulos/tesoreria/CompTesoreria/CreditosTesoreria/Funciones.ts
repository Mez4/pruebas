import axios from "axios";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { GetServerUrl } from "../../../../../../global/variables";

export const FNGet = async (oidc: IOidc, CreditoID?: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(`${GetServerUrl()}creditos/credito_vw/get/${CreditoID}`, {
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
    CreditoID: number;
    ProductoID: number;
    ClienteID: number;
    SucursalID: number;
    ZonaID: number;
    DistribuidorNivelID: number;
    DistribuidorID: number;
    EstatusID: string;
    ContratoID: number;
    CoordinadorID: number;
    FechaInicio: Date | null;
    FechaFin: Date | null;
    CajaID: number;
    EmpresaId: number;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    // console.log('Datos: ', Datos)

    axios
      .post(`${GetServerUrl()}creditos/credito_vw/getbyfiltrosTesoreria`, Datos, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
      })
      .then((respuesta) => {
        // console.log(respuesta, 'respcreditosglobal')
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

  export const updatedCreditoSpeiaEfectivo = async (
    oidc: IOidc,
    Datos: {
      CreditoID: number;
      CajaID: number
    }
  ) =>
    new Promise((Resolver: any, Denegar: any) => {
      // console.log(oidc, CreditoID)
      axios
        .post(`${GetServerUrl()}Creditos/Credito/updateSpeiaEfectivo`, Datos, {
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

export const FNgetbyfiltrosCancelacion = async (
  oidc: IOidc,
  Datos: {
    CreditoID: number;
    ProductoID: number;
    ClienteID: number;
    SucursalID: number;
    ZonaID: number;
    DistribuidorNivelID: number;
    DistribuidorID: number;
    EstatusID: string;
    ContratoID: number;
    CoordinadorID: number;
    FechaInicio: Date | null;
    FechaFin: Date | null;
    CajaID: number;
    EmpresaId: number;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    // console.log('Datos: ', Datos)

    axios
      .post(`${GetServerUrl()}creditos/credito_vw/getbyfiltrosCancelacion`, Datos, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
      })
      .then((respuesta) => {
        // console.log(respuesta, 'respcreditosglobal')
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

export const FNGetTiendita = async (oidc: IOidc, CreditoID?: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log('aqui3',CreditoID)
    axios
      .post(
        `${GetServerUrl()}creditos/PlanPagos/getTiendita`,
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

export const FNCancelar = async (oidc: IOidc, Datos: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    // console.log(oidc, CreditoID)
    axios
      .post(
        `${GetServerUrl()}Creditos/Credito/cancel`,
        { Datos },
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

export const FNAutorizar = async (oidc: IOidc, CreditoID: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    // console.log(oidc, CreditoID)
    axios
      .post(
        `${GetServerUrl()}Creditos/Credito/Autorizar`,
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

export const FNDesembolsar = async (oidc: IOidc, CreditoID: number, CajaID: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    // console.log(oidc, CreditoID)
    axios
      .post(
        `${GetServerUrl()}Creditos/Credito/desembolsar`,
        { CreditoID, CajaID },
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

export const FNModificarSucCaja = async (
  oidc: IOidc,
  Datos: {
    CreditoID: number;
    SucursalID: number;
    CajaID: number;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    // console.log('Datos: ', Datos)

    axios
      .post(`${GetServerUrl()}creditos/Credito/cambiarsuccaja`, Datos, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
      })
      .then((respuesta) => {
        // console.log(respuesta, 'respcreditosglobal')
        Resolver(respuesta.data);
      })
      .catch((error) => {
        Denegar(error);
      });
  });

export const FNGetTipoUsuario = (oidc: IOidc) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}distribuidor/Valeras/TipoUsuario`,
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
