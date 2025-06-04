//VARIABLES GLOBALES
import { GetServerUrl } from "../../../../../../global/variables";
// LIBRERIA PARA PETICIONES API REST
import axios from "axios";
// PARAMETROS DE SEGURIDAD
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";

// SE OBTIENE INFORMACION RESUMIDA DE LA SOCIA EN CREDITO
export const FNObtenerEstadoSocia = (oidc : IOidc, DistribuidorID : number) =>
new Promise((Resolver, Denegar) => {
    axios.get(`${GetServerUrl()}Creditos/Distribuidor/get/${DistribuidorID}`,{
        headers: {
            "Content-Type" : "application/json",
            "Authorization":  `Bearer ${ oidc.user.access_token }`
        }
    }).then(res => {
        Resolver(res.data);
    }).catch(err =>{
        Denegar(err);
    })
}) 

