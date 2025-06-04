import axios from "axios";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { GetServerUrl } from "../../../../../../global/variables";

export const FNReporte1625_3 = async (oidc: IOidc, data: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}creditos/reportes/reporte1625_3`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
      })
      .then((respuesta) => Resolver(respuesta.data))
      .catch((error) => Denegar(error));
  });
