import axios from "axios";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { GetServerUrl } from "../../../../../../global/variables";
import { DBConfia_General } from "../../../../../../interfaces_db/DBConfia/General";

// export const FNGet = (oidc: IOidc, Id?: string) =>
//     new Promise((Resolver: any, Denegar: any) => {
//         axios.post(`${GetServerUrl()}creditos/canjeavale/get`, {}, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${oidc.user.access_token}`
//             }
//         })
//             .then(respuesta => {
//                 Resolver(respuesta.data)
//             })
//             .catch(error => {
//                 Denegar(error)
//             })
//     })

type ClientePersonaType = {
  // Persona: DBConfia_General.IPersonas_VW,
  Nombre: string;
  ApellidoPaterno: string;
  ApellidoMaterno: string;
  FechaNacimiento: string;
  LugarNacimiento: string;
  CURP: string;
  RFC: string;
  SexoID: string;
  EstadoCivilID: string;
  EscolaridadID: number;
  DependientesEconomicos: number;
  TelefonoDomicilio: string;
  TelefonoMovil: string;
  CorreoElectronico: string;
  NombreConyuge: string;
  Observaciones: string;
  identificacionTipoId: number;
  identificacionNumero: string;
  AgregarDireccion: {
    PersonaID: number;
    DireccionPersona_AsentamientoID: number;
    DireccionPersona_NombreVialidad: string;
    DireccionPersona_NumeroInterior: string;
    DireccionPersona_NumeroExterior: string;
    DireccionPersona_vialidadTipoId: number;
    DireccionPersona_orientacionVialidadTipoId: number;
    DireccionPersona_viviendaTipoId: number;
  };
};

// METODO PARA COMPROBAR SI LA CAJA ESTA CERRADA
export const FNCheckBox = (oidc: IOidc, Id: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(`${GetServerUrl()}SOMA/CatCajaRest/checkcaja/${Id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
      })
      .then((res: any) => {
        // SI EL STATUS QUE RECIBIMOS ES UN VERDADERO, LE ASIGNAMOS LA INFORMACION A LA MISMA VARIABLE
        res.data.status
          ? (res = res.data.data)
          : console.log("No se encontro la caja");
        // console.log(res );
        // MANDAMOS LA RESPUESTA
        Resolver(res);
      })
      .catch((err) => {
        // EN CASO DE CUALQUIER ERROR, SE MUESTRA UN MENSAJE
        Denegar(err);
      });
  });
// SE EMPIEZA CON LA PETICION DE OBTENER LA CAJA

// Agregar nueva peticion para comprobar si la caja aun sigue abierta
// `${GetServerUrl()}SOMA/CajasUsuarios/getbysucursal`
export const FNAdd = (
  oidc: IOidc,
  Datos: {
    ProductoID: number;
    DistribuidorId: number;
    ClienteId: number;
    SucursalId: number;
    articles: any;
    CajaID: number;
    Folio: number;
    SerieId: number;
    Capital: number;
    Plazos: number;
    TipoDesembolsoID: number;
    // articles: [],
    // datoBancario?: string,
    Monto?: number;
    // MovimientoID?: number,
    // VentaId?: number,
    // JsonTda?: string,
    TipoCanje: number;
    FechaExpedicion?: Date;
    NombreBeneficiario: string;
    ApellidoPaternoBeneficiario: string;
    ApellidoMaternoBeneficiario: string;
    ParentescoBeneficiario: string;
    FechaNacimientoBeneficiario: Date | null;
    Validado: boolean;
    Sucursal: {
      id_empresa: number;
      id_sucursal: number;
      id_origen: string;
      sistema: string;
    };
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log(Datos);

    // console.log('JsonTda: ', Datos.JsonTda)
    // console.log('Datos: ', Datos)

    axios
      .post(`${GetServerUrl()}creditos/canjeavale/add`, Datos, {
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

export const FNAgregarArticuloCredito = (
  oidc: IOidc,
  Datos: {
    CreditoID: number;
    DistribuidorId: number;
    ClienteId: number;
    SucursalId: number;
    articles: any;
    CajaID: number;
    Monto?: number;
    Validado: boolean;
    TipoCanje: number;
    Sucursal: {
      id_empresa: number;
      id_sucursal: number;
      id_origen: string;
      sistema: string;
    };
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}creditos/canjeavale/addProductoTiendita`, Datos, {
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

export const FNValeZona = (
  oidc: IOidc,
  Datos: {
    ProductoID: number;
    DistribuidorId: number;
    ClienteId: number;
    SucursalId: number;
    SucursalDistID: number;
    articles: any;
    CajaID: number;
    Folio: number;
    SerieId: number;
    Capital: number;
    Plazos: number;
    TipoDesembolsoID: number;
    // articles: [],
    // datoBancario?: string;
    Monto?: number;
    // MovimientoID?: number;
    // VentaId?: number;
    // JsonTda?: string;
    TipoCanje: number;
    FechaExpedicion?: Date;
    NombreBeneficiario: string;
    ApellidoPaternoBeneficiario: string;
    ApellidoMaternoBeneficiario: string;
    ParentescoBeneficiario: string;
    FechaNacimientoBeneficiario: Date | null;
    Validado: boolean;
    Sucursal: {
      id_empresa: number;
      id_sucursal: number;
      id_origen: string;
      sistema: string;
    };
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}creditos/canjeavale/valezona`, Datos, {
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

export const FNUpdate = (
  oidc: IOidc,
  Datos: {
    CreditoID?: number;
    ProductoID: number;
    DistribuidorId: number;
    ClienteId: number;
    SucursalId: number;
    CajaID: number;
    Folio: number;
    SerieId: number;
    Capital: number;
    Plazos: number;
    TipoDesembolsoID: number;
    // articles: [],
    datoBancario?: string;
    MovimientoID?: number;
    VentaId?: number;
    JsonTda?: string;
    TipoCanje: number;
    FechaExpedicion?: Date;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    // console.log('JsonTda: ', Datos.JsonTda)
    // console.log('Datos: ', Datos)

    axios
      .post(`${GetServerUrl()}creditos/canjeavale/update`, Datos, {
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
export const FNCancelar = async (
  oidc: IOidc,
  CreditoID: number,
  MvCancelacion: string,
  TipoCancelacionID: number
) =>
  new Promise((Resolver: any, Denegar: any) => {
    // console.log(oidc, CreditoID)
    axios
      .post(
        `${GetServerUrl()}Creditos/Credito/cancel`,
        { CreditoID, MvCancelacion, TipoCancelacionID },
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

export const FNTipoCancelacion = (oidc: IOidc) =>
  new Promise((Resolver: any, Denegar: any) => {
    // console.log(oidc, CreditoID)
    axios
      .post(
        `${GetServerUrl()}Creditos/Credito/getTipoCancelacion`,
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

export const FNComprarTiendita = (
  oidc: IOidc,
  Datos: {
    ProductoID: number;
    ProductoTiendita: number;
    DistribuidorId: number;
    ClienteId: number;
    SucursalId: number;
    CajaID: number;
    Folio: number;
    SerieId: number;
    Capital: number;
    Plazos: number;
    TipoDesembolsoID: number;
    articles: [];
    datoBancario?: string;
    MovimientoID?: number;
    VentaId?: number;
    JsonTda?: string;
    TipoCanje: number;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log("JsonTda: ", Datos.JsonTda);
    console.log("Datos: ", Datos);

    axios
      .post(`${GetServerUrl()}creditos/canjeavale/tienditacliente`, Datos, {
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

export const FNPdf = (
  oidc: IOidc,
  Datos: {
    ProductoID: number;
    CreditoID: number;
    CreditoID_2: number;
    SoloFormatoExtra?: boolean;
    Reimpresion?: boolean;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}creditos/canjeavale/pdf`, Datos, {
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

export const FNPdf2 = (
  oidc: IOidc,
  Datos: { CreditoId: number; personasDatosBancariosID: number }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}general/personadatosbancarios/pdfSPEI`, Datos, {
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
export const getPlanPagos = (oidc: IOidc, Datos: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}creditos/canjeavale/getByProducto`, Datos, {
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

export const FNGetPlanPagoPDF = (oidc: IOidc, Datos: { CreditoID: number }) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}creditos/credito/getplanpagospdf`, Datos, {
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

export const FNGetDatos = (
  oidc: IOidc,
  Datos: {
    ProductoID: number;
    Codigo: string;
    SucursalID: number;
    CajaID: number;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    // console.log('JsonTda: ', Datos.JsonTda)
    // console.log('Datos: ', Datos)

    axios
      .post(`${GetServerUrl()}AppVale/AppCreditos/getDatos`, Datos, {
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

export const FNGetPrimerCanje = (
  oidc: IOidc,
  Datos: {
    ProductoID: number;
    Codigo: string;
    SucursalID: number;
    CajaID: number;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    // console.log('JsonTda: ', Datos.JsonTda)
    console.log('Datos: ', Datos)

    axios
      .post(`${GetServerUrl()}AppVale/AppCreditos/primerCanje`, Datos, {
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

export const FNAgregar = (oidc: IOidc, Datos: ClientePersonaType) =>
  new Promise((Resolver: any, Denegar: any) => {
    console.log("Datos Cliente: ", Datos);

    axios
      .post(`${GetServerUrl()}AppVale/AppCreditos/updateClienteDatos`, Datos, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
      })
      .then((respuesta) => {
        Resolver(respuesta.data);
      })
      .catch((error) => {
        console.log("error: ", error);
        Denegar(error);
      });
  });

export const FNAppCanje = (
  oidc: IOidc,
  Datos: {
    ProductoID: number;
    Codigo: string;
    // DistribuidorId: number,
    // ClienteId: number,
    SucursalID: number;
    CajaID: number;
    // Folio: number,
    // SerieId: number,
    // Capital: number,
    // Plazos: number,
    // TipoDesembolsoID: number,
    // articles: [],
    // datoBancario?: string,
    // MovimientoID?: number,
    // VentaId?: number,
    // JsonTda?: string,
    // TipoCanje: number
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    // console.log('JsonTda: ', Datos.JsonTda)
    // console.log('Datos: ', Datos)

    axios
      .post(`${GetServerUrl()}AppVale/AppCreditos/canjevalecv`, Datos, {
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

export const FNGetVale = (
  oidc: IOidc,
  Datos: {
    SerieId: number;
    ValeCanje: number;
  }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}Distribuidores/ValeraDetalle/getvale`, Datos, {
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

export const FNGetUltimoBeneficiario = (
  oidc: IOidc,
  Datos: { ClienteID: number }
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}creditos/credito/getUltimoBeneficiario`, Datos, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${oidc.user.access_token}`,
        },
      })
      .then((respuesta) => Resolver(respuesta.data))
      .catch((error) => Denegar(error));
  });

// export const FNUpdate = (oidc: IOidc, Datos: {}) =>
//     new Promise((Resolver: any, Denegar: any) => {
//         axios.post(`${GetServerUrl()}creditos/credito/update`, Datos, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${oidc.user.access_token}`
//             }
//         })
//             .then(respuesta => {
//                 Resolver(respuesta.data)
//             })
//             .catch(error => {
//                 Denegar(error)
//             })
//     })
