import axios from "axios";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { GetServerUrl } from "../../../../../../global/variables";

export const FNGetAplicacionesCanalesPago = async (
  oidc: IOidc,
  Datos: {
    ClienteID: number;
    SucursalID: number;
    DistribuidorID: number;
    Activo: boolean;
    FechaInicio: Date;
    FechaFin: Date;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}creditos/AplicaPagos/getAplicacionesCanalesPago`,
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
