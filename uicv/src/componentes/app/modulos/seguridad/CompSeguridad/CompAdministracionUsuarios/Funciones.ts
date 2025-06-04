import axios, { AxiosError } from "axios";
import {
  GenerarCabeceraOIDC,
  GetServerUrl,
} from "../../../../../../global/variables";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import ReactTooltip from "react-tooltip";

export const FNGetProductosDisponibles = (oidc: IOidc, Id?: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(`${GetServerUrl()}sistema/usuarios/obtenerProductosDisponibles`, {
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

export const FNGet = (oidc: IOidc, Id?: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(`${GetServerUrl()}sistema/usuarios/get`, {
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

/**
 * Funcion para obtener los usuarios
 * @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
 * @param {number} Id Datos a subir
 * @returns any
 */
export const FNObtener = (oidc: IOidc, Id?: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(`${GetServerUrl()}sistema/usuarios`, {
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

export const GetContra = (oidc: IOidc, Datos: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(`${GetServerUrl()}sistema/usuarios`, {
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
export const GetPermisosEsp = (oidc: IOidc) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(`${GetServerUrl()}sistema/usuarios/GetPermisosEso`, {
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

export const AddPermiso = async (oidc: IOidc, Datos: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(
        `${GetServerUrl()}sistema/usuarios/AddPermisosEspecialesDisponibles`,
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

export const GetPermisosEspecialesDisponibles = (
  oidc: IOidc,
  UsuarioID: number
) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(
        `${GetServerUrl()}sistema/usuarios/GetPermisosEspecialesDisponibles/${UsuarioID}`,
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

export const GetPermisosEspeciales = (oidc: IOidc, UsuarioID: number) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(
        `${GetServerUrl()}sistema/usuarios/GetPermisosEspUsuario/${UsuarioID}`,
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

export const GetProductos = (oidc: IOidc) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .get(`${GetServerUrl()}sistema/usuarios/GetProducto`, {
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

  export const GetProductosPrincipales = (oidc: IOidc) =>
    new Promise((Resolver: any, Denegar: any) => {
      axios
        .get(`${GetServerUrl()}sistema/usuarios/GetProductoPrincipales`, {
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

/**
 * Funcion para agregar un usuario (sin validar)
 * @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
 * @param Datos Datos a subir
 * @returns any
 */
export const FNAgregar = async (
  oidc: IOidc,
  Datos: {
    Correo: string;
    Nombre: string;
    Master: boolean;
    AdministradorCoordinadores: boolean;
  },
  cbGuardar?: (item: any) => void
) => {
  try {
    // Obtenemos nuestros datos de axios
    var datos = await axios.put(
      `${GetServerUrl()}sistema/usuarios/agregar`,
      Datos,
      GenerarCabeceraOIDC(oidc)
    );

    // Mandamos a la UI
    if (cbGuardar !== undefined) cbGuardar(datos.data);

    return datos.data;
  } catch (ex: any | AxiosError) {
    // Mostramos el mensaje
    const aex: any = ex;

    if (axios.isAxiosError(ex)) {
      if (
        aex.response?.data.status === 400 &&
        aex.response.data &&
        aex.response?.data.errors
      )
        alert(
          aex.response?.data.errors[Object.keys(aex.response?.data.errors)[0]]
        );
      else if (aex.response.data) alert(JSON.stringify(aex.response.data));
      else alert(ex.message);
    } else alert("Error en la aplicación al guardar, valide en su consola");

    throw ex;
  }
};

/**
 * Funcion para agregar un usuario (sin validar)
 * @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
 * @param Datos Datos a subir
 * @returns any
 */
export const FNAgregarUsuarioRapido = async (
  oidc: IOidc,
  Datos: {
    Correo: string;
    Nombre: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
    CURP: string;
    SACId: number;
    FechaNacimiento: string;
  },
  cbGuardar?: (item: any) => void
) => {
  try {
    // Obtenemos nuestros datos de axios
    var datos = await axios.post(
      `${GetServerUrl()}sistema/usuarios/agregarRapido`,
      Datos,
      GenerarCabeceraOIDC(oidc)
    );

    // Mandamos a la UI
    if (cbGuardar !== undefined) cbGuardar(datos.data);

    return datos.data;
  } catch (ex: any | AxiosError) {
    // Mostramos el mensaje
    const aex: any = ex;

    if (axios.isAxiosError(ex)) {
      if (
        aex.response?.data.status === 400 &&
        aex.response.data &&
        aex.response?.data.errors
      )
        alert(
          aex.response?.data.errors[Object.keys(aex.response?.data.errors)[0]]
        );
      else if (aex.response.data) alert(JSON.stringify(aex.response.data));
      else alert(ex.message);
    } else alert("Error en la aplicación al guardar, valide en su consola");

    throw ex;
  }
};

/**
 * Funcion para agregar un usuario (sin validar)
 * @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
 * @param Datos Datos a subir
 * @returns any
 */
export const FNConfirmarCorreo = (oidc: IOidc, Datos: { Usuario: string }) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}sistema/usuarios/correoConfirmacion`, Datos, {
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

/**
 * Funcion para agregar un usuario (sin validar)
 * @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
 * @param Datos Datos a subir
 * @returns any
 */
export const FNBloquear = (oidc: IOidc, Datos: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}sistema/usuarios/bloquear`, Datos, {
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

/**
 * Funcion para agregar un usuario (sin validar)
 * @param {IEstadoSeguridad} Seguridad Estado de redux de seguridad
 * @param Datos Datos a subir
 * @returns any
 */
export const FNDesbloquear = (oidc: IOidc, Datos: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .post(`${GetServerUrl()}sistema/usuarios/desbloquear`, Datos, {
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

export const FNUpdate = (oidc: IOidc, Datos: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios
      .put(`${GetServerUrl()}sistema/usuarios/actualizar`, Datos, {
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

export const FNActivarWebCobranza = (oidc: IOidc, Datos: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios.put(`${GetServerUrl()}sistema/usuarios/ActivarWebCobranza`, Datos, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${oidc.user.access_token}`,
      },
    }).then((respuesta) => {
      Resolver(respuesta.data)
    }).catch((error) => {
      Denegar(error)
    })
  });

export const FNAddPermisosCartera = (oidc: IOidc, Datos: {
    UsuarioID: number,
    SucursalesIds: number[],
    ProductosIds: number[]
}) =>
    new Promise((Resolver: any, Denegar: any) => {
      console.log("prueba funcion",Datos)
      const dataToSend = {
        SucursalesIds: Datos.SucursalesIds,
        ProductosIds: Datos.ProductosIds,
        UsuarioID: Datos.UsuarioID
        }
        axios.post(`${GetServerUrl()}sistema/usuarios/addPermisosCartera`, dataToSend, {
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

export const FNActivarCarteraCompleta = (oidc: IOidc, Datos: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios.put(`${GetServerUrl()}sistema/usuarios/UpdateCarteraCompleta`, Datos, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${oidc.user.access_token}`,
      },
    }).then((respuesta) => {
      Resolver(respuesta.data)
    }).catch((error) => {
      Denegar(error)
    })
  });

export const FNUpdateUsuario = (oidc: IOidc, Datos: any) =>
  new Promise((Resolver: any, Denegar: any) => {
    axios.put(`${GetServerUrl()}sistema/usuarios/UpdateUsuario`, Datos, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${oidc.user.access_token}`,
      },
    }).then((respuesta) => {
      Resolver(respuesta.data)
    }).catch((error) => {
      Denegar(error)
    })
  });

  export const FNGetAccesos = (oidc: IOidc, UsuarioID: number) =>
    new Promise((Resolver: any, Denegar: any) => {
        axios.post(`${GetServerUrl()}sistema/usuarios/GetAccesos`, { UsuarioID }, {
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

    export const FNGetAccesosP = (oidc: IOidc, UsuarioID: number) =>
      new Promise((Resolver: any, Denegar: any) => {
          axios.post(`${GetServerUrl()}sistema/usuarios/GetAccesosP`, { UsuarioID }, {
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