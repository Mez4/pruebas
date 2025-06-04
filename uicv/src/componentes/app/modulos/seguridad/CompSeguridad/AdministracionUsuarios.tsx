import React from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import * as Funciones from "./CompAdministracionUsuarios/Funciones";
import * as FnSucursales from '../../general/CompGeneral/Sucursal/Funciones'
// Link
import { Link } from "react-router-dom";

// Icons
import {
  FaArchive,
  FaCheck,
  FaKey,
  FaLock,
  FaLockOpen,
  FaPencilAlt,
  FaPlus,
  FaSearch,
  FaUserPlus,
  FaUsers,
  FaGlobe
} from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";

// Custom components
import { FiltrarDatos } from "../../../../../global/functions";

// Componentes
import {
  FormaBloqueo,
  FormaDesbloqueo,
  AgregarConPersona,
} from "./CompAdministracionUsuarios";
import { Card, ModalWin, Spinner } from "../../../../global";

import { FormaRestContra } from "./CompAdministracionUsuarios/FormaRestContra";

import { IoMdClose } from "react-icons/io";
import { iUI } from "../../../../../interfaces/ui/iUI";
import axios from "axios";
import {
  GenerarCabeceraOIDC,
  GetServerUrl,
} from "../../../../../global/variables";
import { FormaConfirmar } from "./CompAdministracionUsuarios/FormaConfirmar";
import { FormaContra } from "./CompAdministracionUsuarios/FormaContra";
import { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
import { PermisosEspeciales } from "./CompAdministracionUsuarios/PermisosEspeciales";
import { Form, Formik } from "formik";
import { MultiSelect } from "react-multi-select-component";
import { BsLightning } from "react-icons/bs";
import { AgregarPersonaRapido } from "./CompAdministracionUsuarios/AgregarConPersonaRapido";
import { ActivarWebCobranza } from "./CompAdministracionUsuarios/ActivarWebCobranza";
import { UpdateUsuario } from "./CompAdministracionUsuarios/UpdateUsuario";
import { FaLaptopFile } from "react-icons/fa6";
import { FormaPermisosCartera } from "./CompAdministracionUsuarios/FormaPermisoCartera";

type AdministracionUsuariosType = { oidc: IOidc; ui: iUI};

const AdministracionUsuarios = (props: AdministracionUsuariosType) => {
  // Controll our mounted state
  let isMounted = React.useRef(true);
  const MySwal = withReactContent(Swal);
  

  // Basic variables
  const Datos: any[] = [];
  const DatosProducto: any[] = [];
  const DatosSucursales: any[] = [];
  const ProductosDisponibles: any[] = [];
  const optProductos: any[] = []
  const optSucursales: any[] = []
  const DatosDefectoS = {
    UsuarioID: 0,
    SucursalesIds: [] as number[],
    // ProductosIds: []
  }
  const DatosDefectoP = {
    UsuarioID: 0,
    // SucursalesIds: [],
    ProductosIds:[] as number[]
  }
  
  const DatosMostrar: any[] = [];
  const [UsuarioID, setUsuarioID] = React.useState(0);

  const cobranzaWebModules = [
    { value: 1, label: 'Director' },
    { value: 2, label: 'Subdirector' },
    { value: 3, label: 'Zonal' },
    { value: 4, label: 'Gerente' },
    { value: 5, label: 'Coordinador' },
    { value: 6, label: 'Gestor' }
  ]

  const [state, setState] = React.useState({
    ProductosDisponibles,
    Productos: [
      { ProductoID: 1, Nombre: "vale 1" },
      { ProductoID: 2, Nombre: "vale 2" },
    ],
    ProductoID: 0,
    ContrasenaNueva: "",
    Datos,
    DatosProducto,
    DatosSucursales,
    DatosMostrar,
    Filtro: "",
    Cargando: true,
    Error: false,
    FormaAgregar: false,
    FormaRapidoAgregar: false,
    FormaAgregarPermiso: false,
    FormaBloquear: false,
    FormaDesbloqueo: false,
    FormaConfirmar: false,
    FormaMembresias: false,
    FormaRestContra2: false,
    FormaRestContra: false,
    FormaContra: false,
    PermisosEspeciales: false,
    Item: undefined,
    FormaAgregarPermisosEspeciales: false,
    FormaActivarWebCobranza: false,
    CargandoFormaActivarWebCobranza: false,
    ErrorFormaActivarWebCobranza: false,
    FormaPermisosCartera: false,
    CargandoFormaPermisosCartera: false,
    ErrorFormaPermisosCartera: false,
    EnabledModulescobranzaWeb: [0],
    EnabledModulesPermisosCartera: [0],
    FormUpdateUsuarioVisible: false,
    CargandoFormUpdateUsuario: false,
    ErrorFormUpdateUsuario: false,
    CargandoFormaAgregarPermisosEspeciales: false,
    ErrorFormaAgregarPermisosEspeciales: false,
    PermisosDisponiblesPAgregar: [
      {
        PermisoID: 0,
        Nombre: "",
        Descripcion: "",
        Productos: [],
        ProductosSeleccionados: [{ ProductoID: 1, Nombre: "vale 1" }],
      },
    ],
    Form: {
      MostrarContra: false,
    },
    PermisosEspecialesCargando: true,
    PermisosEspecialesError: false,
    PermisosEspecialesInicial: {
      UsuarioID: 0,
      PermisosDelUsuario: [],
      NombreUsuario: "",
    },
    FormAccesosS:
    {
        Mostrar: false,
        DatosSucursales: DatosDefectoS,
        ProductoID: undefined,
    },
    FormAccesosP:
    {
        Mostrar: false,
        DatosProducto: DatosDefectoP,
        ProductoID: undefined,
    },
    optProductos: optProductos,
    optSucursales,
  });

  // #################################################
  // Effectos de la pagina
  // >>

  // Declare the FNGet

  //funcion para obtener permisos especiales
  const FNGetPermisosEspeciales = (UsuarioConsultar: any) => {
    //set loading true
    setState((s) => ({
      ...s,
      PermisosEspecialesCargando: true,
      PermisosEspecialesError: false,
    }));
    Funciones.GetPermisosEspeciales(props.oidc, UsuarioConsultar)
      .then((res: any) => {
        if (isMounted.current === true) {
          //Order res by column UsuarioPermisoEspecialID
          res.sort(
            (a: any, b: any) =>
              a.UsuarioPermisoEspecialID - b.UsuarioPermisoEspecialID
          );
          setState((s) => ({
            ...s,
            PermisosEspecialesInicial: {
              UsuarioID: UsuarioID,
              PermisosDelUsuario: res,
              NombreUsuario: "Usuario",
            },
            PermisosEspecialesCargando: false,
            PermisosEspecialesError: false,
          }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            PermisosEspecialesCargando: false,
            PermisosEspecialesError: true,
          }));
        }
      });
  };

  const FNGetPermisosEspecialesDisponibles = (UsuarioConsultar: any) => {
    Funciones.GetPermisosEspecialesDisponibles(props.oidc, UsuarioConsultar)
      .then((res: any) => {
        if (isMounted.current === true) {
          console.log("PERMISOS DISPONIBLES ,", res);
          res.sort(
            (a: any, b: any) =>
              a.UsuarioPermisoEspecialID - b.UsuarioPermisoEspecialID
          );
          res.forEach((element) => {
            element.Productos = element.Productos.map((item: any) => {
              return { ...item, PermisoID: element.PermisoID };
            });
          });
          console.log("RES NUEVO ,", res);
          setState((s) => ({
            ...s,
            CargandoFormaAgregarPermisosEspeciales: false,
            ErrorFormaAgregarPermisosEspeciales: false,
            PermisosDisponiblesPAgregar: res,
          }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            CargandoFormaAgregarPermisosEspeciales: false,
            ErrorFormaAgregarPermisosEspeciales: false,
            PermisosDisponiblesPAgregar: [],
          }));
        }
      });
  };

  const FNGetLocal = async () => {
    // Cambiamos el estado de la aplicación
    setState((s) => ({ ...s, Cargando: true, Error: false, Datos: [] }));

    // Try...
    try {
      let Datos: any[] = (
        await axios.get(
          `${GetServerUrl()}sistema/usuarios/GetAdminUsuarios`,
          GenerarCabeceraOIDC(props.oidc)
        )
      ).data;

      // Definimos el estado
      if (isMounted.current === true) {
        setState((s) => ({ ...s, Cargando: false, Error: false, Datos }));
      }
    } catch {
      if (isMounted.current === true)
        setState((s) => ({ ...s, Cargando: false, Error: true, Datos: [] }));
    }
  };

  const FnGetProductosP = () => {
          Funciones.GetProductosPrincipales(props.oidc)
              .then((respuesta: any) => {
                  // if (isMounted.current === true) {
                  console.log("productosss",respuesta)
                  var productos = respuesta.map((valor: any) => {
                      var obj = { value: valor.ProductoID, label:`ID: ${valor.ProductoID} - ${ valor.Producto  }, Empresa: ${ valor.EmpresaNombre }` };
                      return obj
                  });
  
                  setState(s => ({ ...s, optProductos: productos }))
                  // }
              })
              .catch(() => {
                  // if (isMounted.current === true) {
                  setState(s => ({ ...s, optProductos: [] }))
                  // }
              })
      }

  const fnMostrarContra = () => {
    setState((s) => ({
      ...s,
      Form: {
        ...state.Form,
        MostrarContra: true,
      },
    }));
  };

  //abrir modalagregar permiso especial y traer datos
  const fnAbrirModalAgregarPermisoEspecial = () => {
    setState((s) => ({
      ...s,
      FormaAgregarPermisosEspeciales: true,
      CargandoFormaAgregarPermisosEspeciales: true,
      ErrorFormaAgregarPermisosEspeciales: false,
    }));
    FNGetPermisosEspecialesDisponibles(UsuarioID);
  };

  const fnAbrirModalActivarWebCobranza = (item: any) => {
    let enabledModulesCobranza: { value: number, label: string }[] = []

    for (const module of cobranzaWebModules) {
      if (item.hasOwnProperty('es' + module.label + 'CobranzaWeb') && item['es' + module.label + 'CobranzaWeb']) {
        state.EnabledModulescobranzaWeb.push(module.value)
      }
    }

    setState((s) => ({
      ...s,
      FormaActivarWebCobranza: true,
      CargandoFormaActivarWebCobranza: false,
      ErrorFormaActivarWebCobranza: false,
      Item: { ...item, enabledModulesCobranza }
    }));
  }

  const fnEditarUsuario = (item: any) => {
    console.log("<<<<<<<<<<<<<<ITEM>>>>>>>>>>>>>>", item);
    setState((s) => ({
      ...s,
      FormUpdateUsuarioVisible: true,
      CargandoFormUpdateUsuario: false,
      ErrorFormUpdateUsuario: false,
      Item: { ...item }
    }));
  }

  const fnMostrarContra2 = () =>
    setState({
      ...state,
      FormaRestContra: false,
      Form: {
        ...state.Form,
        MostrarContra: false,
      },
    });

  //function call FuncionesFNGetProductos
  const FNGetProductos = async () => {
    // Cambiamos el estado de la aplicación
    Funciones.FNGetProductosDisponibles(props.oidc)
      .then((respuesta: any) => {
        console.log("RESPUESTA", respuesta);
        if (isMounted.current === true) {
          //map respuesta to Product column to label and ProductoID to value key
          respuesta = respuesta.filter((item: any) => item.Principal).map((item: any) => {
            return {
              label: item.Producto + " - " + item.EmpresaNombre,
              value: item.ProductoID,
            };
          });
          setState((s) => ({ ...s, ProductosDisponibles: respuesta }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, ProductosDisponibles: [] }));
        }
      });
  };

  const FnGetSucursales = () => {
          FnSucursales.FNGet(props.oidc)
              .then((respuesta: any) => {
                  // if (isMounted.current === true) {
  
                  var sucursales = respuesta.map((valor: any) => {
                      var obj = { value: valor.SucursalID, label: valor.Nombre };
                      return obj
                  });
  
                  setState(s => ({ ...s, optSucursales: sucursales }))
                  // }
              })
              .catch(() => {
                  // if (isMounted.current === true) {
                  setState(s => ({ ...s, optSucursales: [] }))
                  // }
              })
      }

  const FNGetAccesos = (UsuarioID: any) => {
      setState(s => ({ ...s, Cargando: true }))
      Funciones.FNGetAccesos(props.oidc, UsuarioID)
      .then((respuesta: any) => {
        const sucursalesIdsSet = new Set<number>();

        respuesta.forEach((item: any) => {
          sucursalesIdsSet.add(item.SucursalID);
        });
  
        const sucurslesIds = Array.from(sucursalesIdsSet);
  
          setState(s => ({
            ...s,
            Cargando: false,
            Error: false,
            FormAccesosS: {
              ...s.FormAccesosS,
              Mostrar: true,
              DatosSucursales: {
                ...s.FormAccesosS.DatosSucursales,
                SucursalesIds: sucurslesIds
              }
            }
          }));
      
    })
    .catch(() => {
      setState(s => ({
        ...s,
        Cargando: false,
        Error: true,
        FormAccesosP: {
          ...s.FormAccesosP,
          Mostrar: false,
          DatosProducto: {
            ...s.FormAccesosP.DatosProducto,
            ProductosIds: []
          }
        }
      }));
    })
  }

  const FNGetAccesosP = (UsuarioID: any) => {
    setState(s => ({ ...s, Cargando: true }))
    Funciones.FNGetAccesosP(props.oidc, UsuarioID)
    .then((respuesta: any) => {

      const productosIdsSet = new Set<number>();

      respuesta.forEach((item: any) => {
        productosIdsSet.add(item.ProductoID);
      });

      const productosIds = Array.from(productosIdsSet);

        setState(s => ({
          ...s,
          Cargando: false,
          Error: false,
          FormAccesosP: {
            ...s.FormAccesosP,
            Mostrar: true,
            DatosProducto: {
              ...s.FormAccesosP.DatosProducto,
              ProductosIds: productosIds
            }
          }
        }));
    
  })
  .catch(() => {
    setState(s => ({
      ...s,
      Cargando: false,
      Error: true,
      FormAccesosP: {
        ...s.FormAccesosP,
        Mostrar: false,
        DatosProducto: {
          ...s.FormAccesosP.DatosProducto,
          ProductosIds: []
        }
      }
    }));
  })
}

  // On use effect
  React.useEffect(() => {
    const query = async () => await FNGetLocal();
    query();
    FNGetProductos();
    FnGetProductosP();
    FnGetSucursales();
    // eslint-disable-next-line
  }, []);

  // On use effect
  React.useEffect(() => {
    setState((s) => ({
      ...s,
      DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro),
    }));
    // eslint-disable-next-line
  }, [state.Datos, state.Filtro]);

  // <<
  // Effectos de la pagina
  // #################################################

  // #################################################
  // Funciones de la pagina
  // >>

  /** funcion Callback al agregar un item */
  const cbAgregar = (Item: any) => {
    setState((s) => ({
      ...s,
      Datos: [...s.Datos, Item],
      FormaAgregar: false,
      Item: undefined,
    }));
  };

  const cbAgregarRapido = (Item: any) => {
    toast.success(`Usuario creado correctamente ID: ${Item.PersonaID}`);

    setState((s) => ({
      ...s,
      Datos: [...s.Datos, Item],
      FormaRapidoAgregar: false,
      Item: undefined,
    }));
  };

  /** funcion Callback al actualizar un item */
  const cbActualizar = (Item: any) => {
    setState((s) => ({
      ...s,
      Datos: s.Datos.map((Dato) =>
        Dato.PersonaID === Item.PersonaID && Dato.UsuarioID === Item.UsuarioID
          ? Item
          : Dato
      ),
    }));
    fnCancelar();
  };

  const cbActualizarAgregarRapido = (Item: any) => {
    setState((s) => ({
      ...s,
      Datos: s.Datos.map((Dato) =>
        Dato.PersonaID === Item.PersonaID && Dato.UsuarioID === Item.UsuarioID
          ? Item
          : Dato
      ),
    }));
    fnCancelar();
  };

  const cbActualizarContra = (Item: any) => {
    setState((s) => ({
      ...s,
      Datos: s.Datos.map((Dato) =>
        Dato.UsuarioID === Item.UsuarioID ? Item : Dato
      ),
    }));
    fnCancelar();
  };

  const [selectedRows, setSelectedRows] = React.useState([
    {
      PermisoID: 0,
      ProductosSeleccionados: [],
    },
  ]);
  const [toggleCleared, setToggleCleared] = React.useState(false);
  // <<
  // Funciones de la forma de agregar
  // #################################################

  // #################################################
  // Funciones de formas
  // >>

  /** funcion para cancelar */
  const fnCancelar = () =>
    setState((s) => ({
      ...s,
      PermisosEspecialesInicial: {
        UsuarioID: 0,
        PermisosDelUsuario: [],
        NombreUsuario: "",
      },
      FormaAgregar: false,
      FormaRapidoAgregar: false,
      FormaBloquear: false,
      FormaDesbloqueo: false,
      FormaConfirmar: false,
      FormaMembresias: false,
      FormaRestContra: false,
      PermisosEspeciales: false,
      FormaRestContra2: false,
      Item: undefined,
      FormaActivarWebCobranza: false,
      CargandoFormaActivarWebCobranza: false,
      ErrorFormaActivarWebCobranza: false,
      FormaPermisosCartera: false,
      CargandoFormaPermisosCartera: false,
      ErrorFormaPermisosCartera: false,
      EnabledModulescobranzaWeb: [0],
      EnabledModulesPermisosCartera: [0],
      FormUpdateUsuarioVisible: false,
      CargandoFormUpdateUsuario: false,
      ErrorFormUpdateUsuario: false
    }));

  /** funcion para agregar */
  const fnAgregar = () =>
    setState((s) => ({ ...s, FormaAgregar: true, Item: undefined }));

  const fnAgregarRapido = () =>
    setState((s) => ({ ...s, FormaRapidoAgregar: true, Item: undefined }));

  const fnAgregarPermiso = () =>
    setState((s) => ({ ...s, FormaAgregarPermiso: true, Item: undefined }));

  /** funcion para bloquear */
  const fnBloquear = (Item: any) =>
    setState((s) => ({ ...s, FormaBloquear: true, Item }));

  /** funcion para desbloquear */
  const fnDesbloquear = (Item: any) =>
    setState((s) => ({ ...s, FormaDesbloqueo: true, Item }));

  /** funcion para confirmar  */
  const fnConfirmar = (Item: any) =>
    setState((s) => ({ ...s, FormaConfirmar: true, Item }));

  const fnPermisosEsp = (Item: any) => {
    FNGetPermisosEspeciales(Item.UsuarioID);
    setState((s) => ({ ...s, PermisosEspeciales: true, Item: Item }));
    setUsuarioID(Item.UsuarioID);
  };

  const fnPermisosCartera = (item: any) => {
    let enabledModulesCobranza: { value: number, label: string }[] = []

    for (const module of cobranzaWebModules) {
      if (item.hasOwnProperty('es' + module.label + 'CobranzaWeb') && item['es' + module.label + 'CobranzaWeb']) {
        state.EnabledModulesPermisosCartera.push(module.value)
      }
    }

    setState((s) => ({
      ...s,
      FormaPermisosCartera: true,
      CargandoFormaPermisosCartera: false,
      ErrorFormaPermisosCartera: false,
      Item: { ...item, enabledModulesCobranza }
    }));
  }

  const fnUpdateCarteraCompleta = async (Checked: boolean, item: any) => {
    console.log(item)
    console.log("OK", Checked)
    MySwal.fire({
      title: "<strong>Conceder acceso a cartera completa.</strong>",
      icon: "warning",
      html: (
        <div className="text-center">
          <br />
          <span className="text-center">
            ¿Conceder acceso a cartera completa para el usuario
            {<strong>Nro {item.UsuarioID}</strong>}?
          </span>
        </div>
      ),
      showCloseButton: false,
      showCancelButton: true,
      showConfirmButton: true,
      focusCancel: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      confirmButtonAriaLabel: "Aceptar",
      cancelButtonAriaLabel: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        Funciones.FNActivarCarteraCompleta(props.oidc, { ...item, AccesoCarteraCompleta: Checked })
          .then((respuesta: any) => {
            /* setLoading(false); */
            toast.success("Acceso a cartera completa " + (respuesta.AccesoWebCobranza ? "activado." : "desactivado."));
            cbActualizar(respuesta);
          })
          .catch((error: any) => {
            console.log(JSON.stringify(error))
            /* setLoading(false) */
            toast.error("Error al actualizar acceso a cartera completa")
          });
      }
      else {
        fnCancelar();
      }
    });

  }

  const fnRestContra = (Item: any) => {
    MySwal.fire({
      title: "<strong>Restablecer Contraseña del Usuario</strong>",
      icon: "warning",
      html: (
        <div className="text-center">
          <br />
          <span className="text-center">
            ¿Restablecer contraseña para el usuario
            {<strong>Nro {Item.UsuarioID}</strong>}?
          </span>
        </div>
      ),
      showCloseButton: false,
      showCancelButton: true,
      showConfirmButton: true,
      focusCancel: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      confirmButtonAriaLabel: "Aceptar",
      cancelButtonAriaLabel: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        let a = {
          usuarioID: Item.UsuarioID,
          contrasena: Item.Contrasena,
        };
        Funciones.FNUpdate(props.oidc, a)
          .then((respuesta: any) => {
            console.log("RESPUESTA", respuesta);
            if (isMounted.current === true) {
              toast.success("Contraseña restablecida");
              setState((s) => ({
                ...s,
                ContrasenaNueva: respuesta.Contrasena,
              }));
              fnMostrarContra();
            }
          })
          .catch(() => {
            toast.error("Ocurrió un problema al restablecer contraseña.");
          });
      } else {
        MySwal.fire({
          icon: "info",
          html: (
            <div>
              <br />
              <h3 className="text-center">
                <strong>Aviso</strong>
              </h3>
              <div className={`modal-body`}>
                <h5 className="text-center">
                  Operación cancelada por el usuario.
                </h5>
              </div>
            </div>
          ),
          confirmButtonText: `Ok`,
          confirmButtonAriaLabel: `Ok`,
          confirmButtonColor: `#3085d6`,
        });
      }
    });
  };

  const [selected, setSelected] = React.useState([]);

  onchange = (e) => {
    if (!Array.isArray(e)) return;
    if (e.length === 0) return;
    console.log("e", e[0].PermisoID);
    var permisoID = e[0].PermisoID;
    //Find in state.PermisosDisponiblesPAgregar item with PermisoID value and update state.PermisosDisponiblesPAgregar.ProductosSeleccionados with e
    var permisosDisponiblesPAgregar = state.PermisosDisponiblesPAgregar.map(
      (item) => {
        if (item.PermisoID === permisoID) {
          item.ProductosSeleccionados = e;
        }
        return item;
      }
    );
    setState((s) => ({
      ...s,
      PermisosDisponiblesPAgregar: permisosDisponiblesPAgregar,
    }));
  };

  const Columns2: IDataTableColumn[] = [
    { name: "PermisoID", selector: "PermisoID", sortable: false, center: true },
    { name: "Nombre", selector: "Nombre", sortable: false, center: true },
    {
      name: "Descripcion",
      selector: "Descripcion",
      sortable: false,
      center: true,
    },
    {
      name: "Productos",
      selector: "Productos",
      sortable: false,
      center: true,
      cell: (row) => (
        <div id="DIVPARENTMULTISELECT" style={{ width: "100% !important" }}>
          <MultiSelect
            ClearIcon={true}
            ClearSelectedIcon={true}
            options={row.Productos}
            closeOnChangedValue={false}
            value={row.ProductosSeleccionados}
            onChange={onchange}
            labelledBy="Select"
            disableSearch={true}
            hasSelectAll={false}
            overrideStrings={{
              allItemsAreSelected: "Todos seleccionado",
              clearSearch: "Limpiar búsqueda",
              clearSelected: "Limpiar seleccionados",
              noOptions: "No hay productos",
              search: "Buscar",
              selectAll: "Seleccionar todos",
              selectAllFiltered: "Seleccionar todos los filtrados",
              selectSomeItems: "Seleccionar productos",
              create: "Crear",
            }}
          />
        </div>
      ),
    },
  ];

  // <<
  // Funciones de formas
  // #################################################

  // Define the columns
  const Columns: IDataTableColumn[] = [
    { name: "Id", selector: "UsuarioID", sortable: false, grow: 0 },
    {
      name: "Usuario",
      selector: "Usuario",
      sortable: true,
      allowOverflow: false,
      grow: 1
      /* width: "300px", */
    },
    {
      name: "Correo",
      selector: "CorreoElectronico",
      sortable: true,
      allowOverflow: false,
      grow: 1
      /* width: "300px", */
    },
    { name: "Nombre", selector: "Nombre", sortable: true, grow: 1 },
    { name: "Persona", selector: "PersonaID", sortable: false, grow: 0 },
    {
      name: 'Cartera completa',
      selector: 'AccesoCarteraCompleta',
      grow: 0,
      cell: (r) =>
        <div className="form-check form-switch form-switch-md mb-3" >
          <input type="checkbox" disabled={false} className="form-check-input" defaultChecked={r.AccesoCarteraCompleta} onChange={e => fnUpdateCarteraCompleta(e.target.checked, r)} />
        </div>
    },
    {
      name: "Bloqueado",
      selector: "Bloqueado",
      grow: 0,
      sortable: true,
      cell: (r) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {r.Bloqueado ? (
            <React.Fragment>
              <FaLock color="#a61e1e" /> &nbsp;Si
            </React.Fragment>
          ) : (
            <React.Fragment>
              <FaCheck color="#17a62f" /> &nbsp;No
            </React.Fragment>
          )}
        </div>
      ),
    },
    {
      name: "Validado",
      selector: "Validacion",
      grow: 0,
      sortable: true,
      cell: (r) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {r.Validacion ? (
            <>
              <FaCheck color="#17a62f" />
              &nbsp;Si
            </>
          ) : (
            <>
              <IoMdClose size={16} color="#a61e1e" />
              &nbsp;No
            </>
          )}
        </div>
      ),
    },
    {
      name: "Acciones",
      grow: 1,
      /* minWidth: "160px", */
      cell: (e) => (
        <div className="d-flex justify-content-end">
          {!e.Bloqueado && (
            <React.Fragment>
              <button
                onClick={() => fnEditarUsuario(e)}
                title={`Editar usuario`}
                className="ms-1 asstext text-dark"
              >
                <FaPencilAlt />
              </button>
              <button
                onClick={() => fnAbrirModalActivarWebCobranza(e)}
                title={`Activar WebCobranza`}
                className="ms-1 asstext text-dark"
              >
                <FaGlobe />
              </button>
              <button
                onClick={() => fnBloquear(e)}
                title={`Bloquear usuario`}
                className="ms-1 asstext"
                style={{ color: "#a61e1e" }}
              >
                <FaLock color="#a61e1e" />
              </button>
              {/* <button
                onClick={() => fnConfirmar(e)}
                title={`Reenviar correo confirmacion`}
                className="ms-1 asstext text-dark"
              >
                <FaEnvelope />
              </button> */}
              <button
                onClick={() => fnRestContra(e)}
                title={`Restablecer contraseña`}
                className="ms-1 asstext text-dark"
              >
                <FaKey />
              </button>
              <button
                onClick={() => fnPermisosEsp(e)}
                title={`Permisos Especiales`}
                className="ms-1 asstext text-dark"
              >
                <FaArchive />
              </button>

              {e.Validacion && (
                <React.Fragment>
                  <Link
                    className={`has-text-dark ml-1`}
                    title={"Permisos"}
                    to={`/app/seguridad/usuarios/${e.UsuarioID}`}
                  >
                    <FaUsers size={16} />
                  </Link>
                </React.Fragment>
              )}

              <button
                onClick={() => {fnPermisosCartera(e)
                  FNGetAccesos(e.UsuarioID)
                  FNGetAccesosP(e.UsuarioID)}}
                title={`Accesos Cartera`}
                className="ms-1 asstext text-dark"
              >
                <FaLaptopFile size={16}  />
              </button>

            </React.Fragment>
            
              
          )}
          {e.Bloqueado && (
            <React.Fragment>
              <button
                onClick={() => fnDesbloquear(e)}
                title={`Habilitar usuario`}
                className="ms-1 asstext text-dark"
              >
                <FaLockOpen />
              </button>
            </React.Fragment>
          )}
        </div>
      ),
    },
  ];
  const handleRowSelected = React.useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);
  const contextActions = React.useMemo(() => {
    console.log("Arreglo final ,", selectedRows);

    const handleClick = () => {
      var TodosPSeleccionados = true;
      selectedRows.sort((a, b) => {
        return (
          b.ProductosSeleccionados.length - a.ProductosSeleccionados.length
        );
      });
      selectedRows.forEach((element) => {
        if (element.ProductosSeleccionados.length == 0) {
          TodosPSeleccionados = false;
        }
      });

      if (!TodosPSeleccionados) {
        MySwal.fire({
          title: "<strong>Error</strong>",
          icon: "info",
          html: (
            <div className="text-center">
              <br />
              Selecciona al menos un productos en todos los permisos
              seleccionados.
            </div>
          ),
          showCloseButton: false,
          showCancelButton: true,
          showConfirmButton: false,
          focusCancel: true,
          cancelButtonText: "Cancelar",
          cancelButtonColor: "#d33",
        });
      } else {
        let total = 0;
        selectedRows.forEach((element) => {
          total = total + 1;
        });
        console.log("ARREGLO FINAL A GUARDAR ,", selectedRows);
        MySwal.fire({
          title: "<strong>Agregar Permisos Especiales</strong>",
          icon: "info",
          html: (
            <div className="text-center">
              <br />
              Se agregaran un total de <strong>{total}</strong> permisos, ¿desea
              continuar?.
            </div>
          ),
          showCloseButton: false,
          showCancelButton: true,
          showConfirmButton: true,
          focusCancel: true,
          cancelButtonText: "Cancelar",
          confirmButtonText: "Aceptar",
          confirmButtonAriaLabel: "Aceptar",
          cancelButtonAriaLabel: "Cancelar",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
        }).then((result) => {
          if (result.isConfirmed) {
            MySwal.fire({
              title: "<strong>Agregar Permisos Especiales</strong>",
              icon: "warning",
              html: (
                <div className="text-center">
                  <br />
                  Total de {total} permiso/s seleccionado/s para agregar,
                  ¿confirmar?.
                  <br /> <br />
                  <h5>
                    <strong style={{ color: "red" }}>
                      Nota: Esta acción no se puede cancelar ni revertir.
                    </strong>
                  </h5>
                </div>
              ),
              showCloseButton: false,
              showCancelButton: true,
              showConfirmButton: true,
              focusCancel: true,
              cancelButtonText: "Cancelar",
              confirmButtonText: "Aceptar",
              confirmButtonAriaLabel: "Aceptar",
              cancelButtonAriaLabel: "Cancelar",
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
            }).then((result) => {
              if (result.isConfirmed) {
                MySwal.fire({
                  icon: "info",
                  html: (
                    <div>
                      <br />
                      <h3 className="text-center">Aviso</h3>
                      <div className={`modal-body`}>
                        <h5 className="text-center">Agregando permisos...</h5>
                      </div>
                    </div>
                  ),
                  timerProgressBar: true,
                  allowEscapeKey: false,
                  allowOutsideClick: false,
                  showConfirmButton: false,
                  showCancelButton: false,
                  showCloseButton: false,
                  didOpen: () => {
                    MySwal.showLoading();
                  },
                });
                let a = {
                  Permisos: selectedRows,
                  UsuarioID: UsuarioID,
                };
                Funciones.AddPermiso(props.oidc, a)
                  .then((respuesta: any) => {
                    if (isMounted.current === true) {
                      respuesta.Permisos.forEach((element) => {
                        console.log("RESPUESTA", respuesta);
                        let index = state.Datos.findIndex(
                          (x) =>
                            x.UsuarioPermisoEspecialID ===
                            element.UsuarioPermisoEspecialID
                        );
                        if (index !== -1) {
                          state.Datos.splice(index, 1);
                        }
                        fnCancelar();
                      });
                      setToggleCleared(!toggleCleared);
                      setState({
                        ...state,
                        Datos: state.Datos,
                        DatosMostrar: state.Datos,
                      });
                      MySwal.close();
                      MySwal.fire({
                        icon: "success",
                        title: "<strong>Agregar Permisos</strong>",
                        html: (
                          <div className="text-center">
                            <br />
                            <h5>
                              Se agregaron{" "}
                              <strong>
                                {respuesta.DispersionesRegistradas}{" "}
                              </strong>{" "}
                              permisos de{" "}
                              <strong>{respuesta.DispersioneRecibidas}</strong>{" "}
                              solicitados.
                            </h5>
                          </div>
                        ),
                        showCloseButton: false,
                        showCancelButton: false,
                        showConfirmButton: true,
                        focusCancel: true,
                        confirmButtonText: "Aceptar",
                        confirmButtonAriaLabel: "Aceptar",
                        confirmButtonColor: "#3085d6",
                      });
                    }
                  })
                  .catch(() => {
                    if (isMounted.current === true) {
                      toast.success(
                        "Permiso(s) especial(es) agregado con exito"
                      );
                      MySwal.close();
                    }
                  });
              } else {
                MySwal.fire({
                  icon: "info",
                  html: (
                    <div>
                      <br />
                      <h3 className="text-center">Aviso</h3>
                      <div className={`modal-body`}>
                        <h5 className="text-center">
                          Operación cancelada por el usuario.
                        </h5>
                      </div>
                    </div>
                  ),
                  cancelButtonText: "Cancelar",
                  confirmButtonText: "Aceptar",
                  confirmButtonColor: "#3085d6",
                  confirmButtonAriaLabel: "Aceptar",
                  cancelButtonAriaLabel: "",
                });
              }
            });
          } else {
            MySwal.fire({
              icon: "info",
              html: (
                <div>
                  <br />
                  <h3 className="text-center">Aviso</h3>
                  <div className={`modal-body`}>
                    <h5 className="text-center">
                      Operación cancelada por el usuario.
                    </h5>
                  </div>
                </div>
              ),
              cancelButtonText: "Cancelar",
              confirmButtonText: "Aceptar",
              confirmButtonColor: "#3085d6",
              confirmButtonAriaLabel: "Aceptar",
              cancelButtonAriaLabel: "",
            });
          }
        });
      }
    };

    return (
      <button
        data-tip
        data-for="TT1_1"
        style={{ backgroundColor: "#28a745", color: "white" }}
        type="button"
        className="ms-2 btn waves-effect waves-light"
        onClick={handleClick}
      >
        Agregar permisos seleccionados
      </button>
    );
  }, [selectedRows]);

  // Regresamos el componente
  return (
    <React.Fragment>
      <div className="row">
        <div className="col-12">
          <Card Title="Administrar usuarios">
            <Card.Body>
              {state.Cargando && <Spinner />}
              {state.Error && <span>Error al cargar los datos...</span>}
              {!state.Cargando && !state.Error && (
                <div>
                  <DataTable
                    subHeader
                    subHeaderComponent={
                      <div className="row">
                        <div className="col-sm-12">
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Busqueda de usuarios"
                              value={state.Filtro}
                              onChange={(e) =>
                                setState((s) => ({
                                  ...s,
                                  Filtro: e.target.value,
                                }))
                              }
                            />
                            <span className="input-group-text">
                              <FaSearch />
                            </span>
                            <button
                              title={"Agregar usuario rapido"}
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={fnAgregarRapido}
                            >
                              <BsLightning />
                            </button>
                            <button
                              title={"Agregar usuario a persona"}
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={fnAgregar}
                            >
                              <FaPlus />
                            </button>
                            <button
                              title={"Agregar usuario y persona"}
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={fnAgregar}
                            >
                              <FaUserPlus />
                            </button>
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={FNGetLocal}
                            >
                              <FiRefreshCcw />
                            </button>
                          </div>
                        </div>
                      </div>
                    }
                    data={state.DatosMostrar}
                    striped
                    pagination
                    dense
                    noHeader
                    responsive
                    keyField={"ViviendaTipoId"}
                    defaultSortField={"ViviendaTipo"}
                    columns={Columns}
                  />

                  <AgregarConPersona
                    oidc={props.oidc}
                    cbActualizar={cbActualizar}
                    cbGuardar={cbAgregar}
                    fnCancelar={fnCancelar}
                    mostrar={state.FormaAgregar}
                  />
                  <AgregarPersonaRapido
                    cbActualizar={cbActualizarAgregarRapido}
                    fnCancelar={fnCancelar}
                    cbGuardar={cbAgregarRapido}
                    mostrar={state.FormaRapidoAgregar}
                    oidc={props.oidc}
                    productosOptions={state.ProductosDisponibles}
                  />
                  <FormaBloqueo
                    oidc={props.oidc}
                    Item={state.Item}
                    cbActualizar={cbActualizar}
                    fnCancelar={fnCancelar}
                    mostrar={state.FormaBloquear}
                  />
                  <FormaDesbloqueo
                    oidc={props.oidc}
                    Item={state.Item}
                    cbActualizar={cbActualizar}
                    fnCancelar={fnCancelar}
                    mostrar={state.FormaDesbloqueo}
                  />
                  <FormaConfirmar
                    oidc={props.oidc}
                    Item={state.Item}
                    cbActualizar={cbActualizar}
                    fnCancelar={fnCancelar}
                    mostrar={state.FormaConfirmar}
                  />

                  <ActivarWebCobranza
                    oidc={props.oidc}
                    Item={state.Item}
                    cbActualizar={cbActualizar}
                    fnCancelar={fnCancelar}
                    mostrar={state.FormaActivarWebCobranza}
                    multiSelectOptions={cobranzaWebModules}
                    Cargando={state.CargandoFormaActivarWebCobranza}
                    Error={state.ErrorFormaActivarWebCobranza}
                    UsuarioID={UsuarioID}
                    ui={props.ui}
                    cbGuardar={cbAgregar}
                    initialValues={{ enabledModulescobranzaWeb: state.EnabledModulescobranzaWeb }}
                  />

                  <UpdateUsuario
                    oidc={props.oidc}
                    Item={state.Item}
                    cbActualizar={cbActualizar}
                    fnCancelar={fnCancelar}
                    mostrar={state.FormUpdateUsuarioVisible}
                    Cargando={state.CargandoFormUpdateUsuario}
                    Error={state.ErrorFormUpdateUsuario}
                    UsuarioID={UsuarioID}
                    ui={props.ui}
                    cbGuardar={cbAgregar}
                    productosOptions={state.ProductosDisponibles}
                  />

                  <PermisosEspeciales
                    fnAbrirModalAgregarPermisoEspecial={
                      fnAbrirModalAgregarPermisoEspecial
                    }
                    Cargando={state.PermisosEspecialesCargando}
                    Error={state.PermisosEspecialesError}
                    initialValues={state.PermisosEspecialesInicial}
                    oidc={props.oidc}
                    ui={props.ui}
                    UsuarioID={UsuarioID}
                    Item={state.Item}
                    cbAgregarPermiso={fnAgregarPermiso}
                    cbGuardar={cbAgregar}
                    cbActualizar={cbActualizar}
                    fnCancelar={fnCancelar}
                    mostrar={state.PermisosEspeciales}
                  />
                  <FormaRestContra
                    oidc={props.oidc}
                    Item={state.Item}
                    cbActualizar={cbActualizarContra}
                    fnCancelar={fnCancelar}
                    fnMostrarContra={fnMostrarContra}
                    fnMostrarContra2={fnMostrarContra2}
                    FNGetLocal={FNGetLocal}
                    mostrar={state.FormaRestContra}
                  />

                  {state.Form.MostrarContra && (
                    <ModalWin open={state.Form.MostrarContra} center={true}>
                      <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>
                          <FaKey /> NUEVA CONTRASEÑA{" "}
                        </h5>
                      </ModalWin.Header>
                      <ModalWin.Body>
                        {
                          <FormaContra
                            contraNueva={state.ContrasenaNueva}
                            oidc={props.oidc}
                            Item={state.Item}
                            cbActualizar={cbActualizarContra}
                            fnCancelar={fnCancelar}
                            fnMostrarContra={fnMostrarContra}
                            mostrar={state.FormaContra}
                            fnMostrarContra2={fnMostrarContra2}
                            FNGetLocal={FNGetLocal}
                          />
                        }
                      </ModalWin.Body>
                    </ModalWin>
                  )}

                  {state.FormaAgregarPermisosEspeciales && (
                    <ModalWin
                      open={state.FormaAgregarPermisosEspeciales}
                      center
                      xlarge
                    >
                      <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>
                          <FaUserPlus /> Asignar permisos especiales al usuario{" "}
                        </h5>
                        <button
                          type="button"
                          className="delete"
                          onClick={() => {
                            setState((s) => ({
                              ...s,
                              FormaAgregarPermisosEspeciales: false,
                              PermisosDisponiblesPAgregar: [],
                            }));
                          }}
                        />
                      </ModalWin.Header>
                      <ModalWin.Body>
                        <Formik
                          initialValues={{}}
                          enableReinitialize
                          onSubmit={(values: any) => { }}
                        >
                          <Form>
                            <div className="column text-center is-full-desktop is-full-tablet is-full-mobile">
                              <DataTable
                                subHeader
                                contextActions={contextActions}
                                clearSelectedRows={toggleCleared}
                                onSelectedRowsChange={handleRowSelected}
                                //onSelectedRowsChange={(rows: any) => handleSelectDispersion(roUnws)}
                                paginationComponentOptions={{
                                  noRowsPerPage: false,
                                  rowsPerPageText: "Permisos por página",
                                  rangeSeparatorText: "de",
                                  selectAllRowsItem: false,
                                  selectAllRowsItemText: "Todos",
                                }}
                                contextMessage={{
                                  singular: "- Permiso seleccionado",
                                  plural: "- Permisos seleccionados",
                                  message: "para agregar",
                                }}
                                /* selectableRowDisabled={(row: any) => disableRow(row)} */
                                selectableRows
                                //selectableRowsComponent={<div>ssss</div>}
                                noDataComponent={<div>No hay datos</div>}
                                subHeaderComponent={
                                  <div className="row">
                                    <div className="input-group mb-3">
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Buscar Permiso"
                                        value={state.Filtro}
                                        onChange={(e) =>
                                          setState((s) => ({
                                            ...s,
                                            Filtro: e.target.value,
                                          }))
                                        }
                                      />
                                      <span className="input-group-text">
                                        <FaSearch />{" "}
                                      </span>
                                    </div>
                                  </div>
                                }
                                data={state.PermisosDisponiblesPAgregar}
                                striped
                                pagination
                                dense
                                responsive
                                keyField={"PermisoID"}
                                defaultSortField={"PermisoID"}
                                columns={Columns2}
                              />
                            </div>
                            {state.CargandoFormaAgregarPermisosEspeciales && (
                              <Spinner />
                            )}
                          </Form>
                        </Formik>
                      </ModalWin.Body>
                    </ModalWin>
                  )}

                  {state.FormaPermisosCartera &&
                  <FormaPermisosCartera
                    oidc={props.oidc}
                    Item={state.Item}
                    cbActualizar={cbActualizar}
                    fnCancelar={fnCancelar}
                    mostrar={state.FormaPermisosCartera}
                    multiSelectOptions={state.optProductos}
                    optSucursales={state.optSucursales}
                    Cargando={state.CargandoFormaPermisosCartera}
                    Error={state.ErrorFormaPermisosCartera}
                    UsuarioID={UsuarioID}
                    ui={props.ui}
                    cbGuardar={cbAgregar}
                    initialValues={state.FormAccesosP.DatosProducto}
                    initialValues2={state.FormAccesosS.DatosSucursales}
                  />}

                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state: IEstado) => ({
  oidc: state.oidc,
  ui: state.UI,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdministracionUsuarios);
