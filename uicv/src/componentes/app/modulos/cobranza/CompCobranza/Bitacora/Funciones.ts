import axios from "axios";
import { promises, Resolver } from "dns";
import { IoIdCard } from "react-icons/io5";
import { date, DateSchema } from "yup";
import { GetServerUrl } from "../../../../../../global/variables";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";

export const FNGet = (oidc: IOidc, Id?: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}Cobranza/Bitacora/get`,
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

export const FNGetProcesos = (oidc: IOidc, Id?: Number) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}Cobranza/Bitacora/getProcesos`,
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
        console.log(error);
        Denegar(error);
      });
  });

export const FNAddProcesos = (
  oidc: IOidc,
  Datos: { Clave: string; Descripcion: string; Activo: boolean }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log(`Datos Ins : `, Datos);
    axios
      .post(`${GetServerUrl()}Cobranza/Bitacora/addProcesos`, Datos, {
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

export const FNUpdProcesos = (
  oidc: IOidc,
  Datos: { Clave: string; Descripcion: string; Activo: boolean }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}Cobranza/Bitacora/updProcesos`, Datos, {
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
