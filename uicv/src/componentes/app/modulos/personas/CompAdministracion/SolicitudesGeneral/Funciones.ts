import axios from "axios";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { GetServerUrl } from "../../../../../../global/variables";

export const FNGetSolicitudesPrestamoPersonal = async (
  oidc: IOidc,
  Datos: {
    FechaInicio: Date;
    FechaFin: Date;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}Distribuidores/SolicitudesPrestamosPersonales/obtenerSolicitudPrestamoCartera`,
        Datos,
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

export const FNGetSolicitudesIncrementos = async (
  oidc: IOidc,
  Datos: {
    FechaInicio: Date;
    FechaFin: Date;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}Distribuidores/SolicitudesIncrementos/obtenerSolicitudesIncrementoCartera`,
        Datos,
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

export const FNGetSolicitudesAumentoNivel = async (
  oidc: IOidc,
  Datos: {
    FechaInicio: Date;
    FechaFin: Date;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}Distribuidores/SolicitudesIncrementos/getAumentosNivelPersonaCartera`,
        Datos,
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

export const FNGetSolicitudesConvenioCartera = async (
  oidc: IOidc,
  Datos: {
    FechaInicio: Date;
    FechaFin: Date;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}Reestructura/SHDR/GetSolicitudesConvenioCartera`,
        Datos,
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
