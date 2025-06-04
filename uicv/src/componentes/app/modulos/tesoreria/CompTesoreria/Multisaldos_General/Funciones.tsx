import axios from "axios";
import { GetServerUrl } from "../../../../../../global/variables";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";

/**
 * Funcion para obtener los tipos de vivienda
 * @param {IOidc} Seguridad Estado de redux de seguridad
 * @param {number} Id Datos a subir
 * @returns any
 */
  export const FNGet = (oidc: IOidc, BalanceID: any) =>
      new Promise((Resolver: any, Denegar: any) => {
          axios.post(`${GetServerUrl()}SOMA/Balance/Multisaldos_General`, {BalanceID}, {
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${oidc.user.access_token}`
              }
          })
              .then(respuesta => {
                  Resolver(respuesta.data)
              })
              .catch(error => {
                  Denegar(error)
              })
      })

export const FNPdf = (Seguridad: IOidc,BalanceID: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}SOMA/Balance/Multisaldos_GeneralPDF`,  {BalanceID},{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Seguridad.user.access_token}`,
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

  export const FNGetBalances = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
      // console.log(oidc, CreditoID)
      axios
        .post(
          `${GetServerUrl()}SOMA/Balance/getBalances`,
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
