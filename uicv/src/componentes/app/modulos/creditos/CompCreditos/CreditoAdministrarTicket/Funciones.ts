import axios from "axios";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { GetServerUrl } from "../../../../../../global/variables";

export const FNGetAdministraTickets = async (
  oidc: IOidc,
  Datos: {
    GestorID: number;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log("Datos: ", Datos);

    axios
      .post(`${GetServerUrl()}creditos/AplicaPagos/GetAdministraTickets`, Datos, {
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

export const FNCancelarTicket = async (
  oidc: IOidc,
  MovimientoID: number,
  MotivoCancelacion: string
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}Creditos/AplicaPagos/CancelarTicket`,
        { MovimientoID, MotivoCancelacion },
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

  export const FNAplicarTicket = async (
    oidc: IOidc,
    MovimientoID: number,
    MotivoCancelacion: string
  ) =>
    new Promise((Resolver: any, Denegar: any) => {
      axios
        .post(
          `${GetServerUrl()}Creditos/AplicaPagos/AplicarTicket`,
          { MovimientoID, MotivoCancelacion },
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

export const FNGetEstatusMovimiento = (oidc: IOidc) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(`${GetServerUrl()}creditos/AplicaPagos/getEstatusMovimiento`, {
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

export const FNGetDetalleDNI = (oidc: IOidc, Datos: { MovimientoID: number }) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}SOMA/Movimientos/detalle-movimiento-dni`, Datos, {
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
