import React from "react";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";
import * as Funciones from "./AmortizarSolicitudGastos/Funciones";
import { toast } from "react-toastify";
import { ErrorMessage, Field, Formik } from "formik";
import { Form } from "usetheform";
import moment from "moment";
import { FormateoDinero } from "../../../../../global/variables";
import DatePicker, { registerLocale } from "react-datepicker";
import * as Yup from "yup";

// Icons
import {
  FaAirbnb,
  FaBuilding,
  FaCheck,
  FaCircle,
  FaClone,
  FaEye,
  FaHome,
  FaPencilAlt,
  FaPlus,
  FaPrint,
  FaSearch,
  FaWindowClose,
} from "react-icons/fa";

// Custom components
import { Card, CustomSelect, Spinner } from "../../../../global";
import { CForm } from "./AmortizarSolicitudGastos/CForm";
import { CFormTotal } from "./AmortizarSolicitudGastos/CFormTotal";
import { FiRefreshCcw } from "react-icons/fi";
import { FiltrarDatos } from "../../../../../global/functions";
import ReactTooltip from "react-tooltip";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import VerDocumento from "./SolicitudesGastosCajera/VerDocumento";
import { CFormFiltros } from "./AmortizarSolicitudGastos/CFormFiltros";
import VerDocumento2 from "./SolicitudesGastosCajera/VerDocumento2";
import { CFormListaEvidencias } from "./SolicitudesGastosCajera/CFormListaEvidencias";
import { CFormSucursal } from "./AmortizarSolicitudGastos/CFormSucursal";

type CatalogosType = {
  oidc: IOidc;
  Id?: number;
  Solicitante?: string;
  Revisado: boolean;
  datosRubros: any[];
  EstatusDescripcion?: string;
  EstatusClave?: string;
  initialValues2: {
    Total: number;
  };
  initialValues3: { Total: number };
  initialValues: {
    Observaciones: string;
    SolicitudGastoID: number;
    FechaSolicitud: string;
    Autorizada: boolean;
    CajaID: number;
    NombreCaja: string;
    NombreSucursal: string;
    CuentaBancoID: number;
    NumeroCuenta: string;
    MontoSolicitado: number;
    MontoAutorizado: number;
    Solicitante: string;
    ObservacionesTesoreria: string;
    DetalleSaldos: any[];
    // ProrratearGasto?: boolean,
    // Meses?: number,
  };
  fnCancelar(): any;

  setDocumentoID(item: any): any;
  activador(value?: number): any;
  desactivador(value?: number): any;
  cbActualizar(item: any): any;
  cbGuardar(item: any): any;
  cbAgregar(item: any): any;
  fnVerDoc(): any;
  fnMostrarImagenesEvidencia(cotizacion: any): any;
  setSolicitudDetalleID(item: any): any;
  fnCancelar(): any;
  fnCancelarTotal(): any;
};

const AmortizarSolicitudGastos = (props: CatalogosType) => {
  // Controll our mounted state
  let isMounted = React.useRef(true);

  const DatosDefecto = {
    SolicitudGastoID: 0,
    FechaSolicitud: "",
    Autorizada: false,
    CajaID: 0,
    NombreCaja: "",
    NombreSucursal: "",
    CuentaBancoID: 0,
    NumeroCuenta: "",
    MontoSolicitado: 0,
    MontoAutorizado: 0,
    Solicitante: "",
    Observaciones: "",
    ObservacionesTesoreria: "",
    ProrratearGasto: false,
    Meses: 0,

    DetalleSaldos: [
      {
        Clave: "",
        Descripcion: "",
        SolicitudDetalleID: 0,
        SolicitudGastoID: 0,
        Total: 0,
        RubroGastosID: 0,
        Cancelado: false,
      },
    ],
  };
  const Datos: any[] = [];
  const DatosMostrar: any[] = [];
  const DetalleSolicitud: any[] = [];
  const OptionsSucursales: any[] = [];
  const OptionsRubros: any[] = [];
  const Options: any[] = [];
  var today = new Date().toDateString();
  const EvidenciasLista: any[] = [];
  const DatosDefecto2 = { SolicitudDetalleID: 0, Total: 0 };

  const [state, setState] = React.useState({
    Cotizacion: false,
    EvidenciasLista,
    SolicitudDetalleID: 0,
    Datos,
    DatosMostrar,
    OptionsSucursales,
    OptionsRubros,
    Options,
    Filtro: "",
    Cargando: false,
    DocumentoID: 0,
    Error: false,
    EstatusClave: "",
    EstatusDescripcion: "",
    CuentaBancariaPrincipalID: 0,
    DetalleSolicitud,
    DetalleFilaModificada: {
      MontoFilaModificada: 0,
      SolicitudDetalleID: 0,
      MontoAutorizar: 0,
    },
    DatosFormik: {
      fechaInicial: "",
      //fechaFinal = format today date to YYYY-MM-DD to string
      fechaFinal: "",
      SucursalID: 0,
      EstatusSolicitudID: 0,
      EstatusClave: "",
    },
    Form: {
      MostrarVerEvidencias: false,
      VerDoc: false,
      Mostrar: false,
      ModificarTotal: false,
      ModificarSucursal: false,
      Datos: DatosDefecto,
      Id: undefined,
      MontoSolicitado: undefined,
      Observaciones: undefined,
      Solicitante: "",
      Revisado: false,
    },
    Form1: {
      Mostrar: false,
      Datos: DatosDefecto2,
      Id: undefined,
    },
  });
  const cbAgregar = (item: any) => {
    toast.success("La cuenta se agrego correctamente");
  };

  const FNGetLocal = (id: any) => {
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNGet(props.oidc, id)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: false,
            DatosSaldos: respuesta,
          }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: true,
            DatosSaldos: [],
          }));
        }
      });
  };

  const FNGetPrincipal = () => {
    setState((s) => ({ ...s, Cargando: true }));
    let a = {
      FechaInicial: state.DatosFormik.fechaInicial,
      FechaFinal: state.DatosFormik.fechaFinal,
      SucursalCajaID: state.DatosFormik.SucursalID,
      EstatusClave: state.DatosFormik.EstatusClave,
    };
    Funciones.FNGet(props.oidc, a)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: false,
            Datos: respuesta,
          }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, Cargando: false, Error: true, Datos: [] }));
        }
      });
  };

  const estatusFecha = (item: any) => {
    if (item.EstatusClave == "AUTZ") {
      return (
        <span className="text-center">
          {moment(item.FechaAutorizada, "YYYY-MM-DD hh:mm").format(
            "DD / MM / YYYY hh:mm"
          )}
        </span>
      );
    } else if (item.EstatusClave == "APLI") {
      return (
        <span className="text-center">
          {moment(item.FechaAplicado, "YYYY-MM-DD hh:mm").format(
            "DD / MM / YYYY hh:mm"
          )}
        </span>
      );
    } else if (item.EstatusClave == "CANC") {
      return (
        <span className="text-center">
          {moment(item.FechaCancelado, "YYYY-MM-DD hh:mm").format(
            "DD / MM / YYYY hh:mm"
          )}
        </span>
      );
    } else if (item.EstatusClave == "RECH") {
      return (
        <span className="text-center">
          {moment(item.FechaRechazado, "YYYY-MM-DD hh:mm").format(
            "DD / MM / YYYY hh:mm"
          )}
        </span>
      );
    } else if (item.EstatusClave == "DOCS") {
      return (
        <span className="text-center">
          {moment(item.FechaDocumentosCon, "YYYY-MM-DD hh:mm").format(
            "DD / MM / YYYY hh:mm"
          )}
        </span>
      );
    } else {
      return <span className="text-center">Sin Actualización</span>;
    }
  };

  const fnMostrarImagenesEvidencia = (cotizacion: boolean) => {
    //setstate Form.MostrarVerEvidencias
    setState((s) => ({
      ...s,
      Form: { ...s.Form, MostrarVerEvidencias: true },
      Cotizacion: cotizacion,
    }));
  };

  const setDocumentoID = (id: any) => {
    setState((s) => ({ ...s, DocumentoID: id }));
  };
  const setSolicitudDetalleID = (id: any) => {
    console.log("ID DETALLE", id);
    setState((s) => ({ ...s, SolicitudDetalleID: id }));
  };

  const Columns: IDataTableColumn[] = [
    {
      name: "Id",
      selector: "SolicitudGastoID",
      sortable: false,
      center: true,
    },
    {
      name: "Solicitante",
      selector: "Solicitante",
      sortable: false,
      center: true,
      cell: (row: any) => (
        <span className="text-center">{row.Solicitante}</span>
      ),
    },
    {
      name: "Fecha Solicitud",
      selector: "FechaSolicitud",
      sortable: false,
      center: true,

      cell: (propss) => (
        <span className="text-center">
          {moment(propss.FechaSolicitud, "YYYY-MM-DD hh:mm").format(
            "DD / MM / YYYY hh:mm"
          )}{" "}
        </span>
      ),
    },
    {
      name: "Fecha Actualización",
      selector: "FechaActualizacion",
      sortable: false,
      width: "9%",
      center: true,
      cell: (propss) => (
        <span className="text-center">{estatusFecha(propss)}</span>
      ),
    },
    {
      name: "Estatus",
      selector: "Estatus",
      sortable: false,
      center: true,
      width: "5%",
      cell: (props) => {
        if (props.Estatus == "PEND") {
          return <FaCircle color="light-gray" title="Autorizada" />;
        } else if (props.Estatus == "AUTZ") {
          return <FaCircle color="#FFEA00" title="Autorizada" />;
        } else if (props.Estatus == "APLI") {
          return <FaCircle color="green" title="Aplicada" />;
        } else if (props.Estatus == "CANC") {
          return <FaCircle color="red" title="Rechazada" />;
        } else if (props.Estatus == "RECH") {
          return <FaCircle color="red" title="Rechazada" />;
        } else if (props.Estatus == "DOCS") {
          return <FaCircle color="#FFEA00" title="Documentos" />;
        } else {
          return <FaCircle color="light-gray" title="Sin Revisar" />;
        }
      },
    },
    {
      name: "Estatus Clave",
      selector: "EstatusClave",
      sortable: false,
      center: true,
      cell: (propss) => (
        <span className="text-center">{propss.EstatusClave}</span>
      ),
    },
    {
      name: "Estatus Desc.",
      selector: "Descripcion",
      sortable: false,
      center: true,
      cell: (propss) => (
        <span className="text-center">{propss.Descripcion}</span>
      ),
    },
    {
      name: "Monto Solicitado",
      selector: "MontoSolicitado",
      sortable: false,
      center: true,
      cell: (props: any) => (
        <span className="text-center">
          {FormateoDinero.format(props.MontoSolicitado)}{" "}
        </span>
      ),
    },
    {
      name: "Monto Autorizado",
      selector: "MontoAutorizado",
      sortable: false,
      center: true,
      cell: (props: any) => (
        <span className="text-center">
          {FormateoDinero.format(props.MontoAutorizado)}{" "}
        </span>
      ),
    },
    {
      name: "Observaciones",
      selector: "Observaciones",
      sortable: false,
      center: true,
      cell: (row: any) => (
        <span className="text-center">{row.Observaciones}</span>
      ),
    },
    {
      name: "Sucursal Origen",
      selector: "NombreSucursal",
      sortable: false,
      center: true,
      cell: (row: any) => (
        <span className="text-center">{row.NombreSucursal}</span>
      ),
    },
    {
      name: "Acciones",
      sortable: false,
      center: true,
      wrap: true,
      cell: (propsss) => (
        <div
          className="text-center"
          style={{ width: "100%", overflowX: "auto", whiteSpace: "nowrap" }}
        >
          <button
            data-tip
            data-for="TT3"
            className="asstext"
            style={{
              margin: ".15em",
              width: "15%",
              height: "40px",
              padding: "0px",
              tableLayout: "fixed",
              borderCollapse: "collapse",
            }}
            type={"button"}
            onClick={() => {
              fnImprimir(propsss.SolicitudGastoID);
            }}
          >
            <FaPrint />
            <ReactTooltip
              id="TT3"
              type="info"
              effect="solid"
              clickable
              globalEventOff="click"
            >
              Generar solicitud
            </ReactTooltip>
          </button>
          <button
            data-tip
            data-for="TT2"
            className="asstext"
            style={{
              margin: ".15em",
              width: "15%",
              height: "40px",
              padding: "0px",
              tableLayout: "fixed",
              borderCollapse: "collapse",
            }}
            type={"button"}
            onClick={() => {
              let nuevo = {
                SolicitudGastoID: propsss.SolicitudGastoID,
                FechaSolicitud: propsss.FechaSolicitud,
                Autorizada: propsss.Autorizada,
                CajaID: propsss.CajaID,
                NombreCaja: propsss.NombreCaja,
                NombreSucursal: propsss.NombreSucursal,
                CuentaBancoID: propsss.CuentaBancoID,
                NumeroCuenta: propsss.NumeroCuenta,
                MontoSolicitado: propsss.MontoSolicitado,
                MontoAutorizado: propsss.MontoAutorizado,
                Solicitante: propsss.Solicitante,
                Observaciones: propsss.Observaciones,
                ObservacionesTesoreria:
                  propsss.ObservacionesTesoreria == null
                    ? ""
                    : propsss.ObservacionesTesoreria,
                DetalleSaldos: propsss.DetalleSaldos,
                Revisado: propsss.Revisado,
                ProrratearGasto: propsss.ProrratearGasto,
                Meses: propsss.Meses,
              };
              setState((s) => ({
                ...s,
                DetalleSolicitud: propsss.DetalleSaldos,
                EstatusClave: propsss.EstatusClave,
                EstatusDescripcion: propsss.Descripcion,
                Form: {
                  ...s.Form,
                  Mostrar: true,
                  Datos: nuevo,
                  Id: propsss.SolicitudGastoID,
                  Solicitante: propsss.Solicitante,
                  Revisado: propsss.Revisado,
                  Observaciones: propsss.Obsevaciones,
                  MontoSolicitado: propsss.MontoSolicitado,
                  SolicitudDetalleID: propsss.SolicitudDetalleID,
                  ProrratearGasto: propsss.ProrratearGasto,
                  Meses: propsss.Meses,
                },
              }));
            }}
          >
            <FaEye />
            <ReactTooltip
              id="TT2"
              type="info"
              effect="solid"
              clickable
              globalEventOff="click"
            >
              Autorizar
            </ReactTooltip>
          </button>
          <>
            {propsss.EstatusClave == "APLI" && (
              <button
                data-tip
                data-for="TT1"
                className="asstext"
                style={{
                  margin: ".15em",
                  width: "15%",
                  height: "40px",
                  padding: "0px",
                  tableLayout: "fixed",
                  borderCollapse: "collapse",
                }}
                type={"button"}
                onClick={() => {
                  fnCancelarSolicitud(propsss);
                }}
              >
                <FaWindowClose />
                <ReactTooltip
                  id="TT1"
                  type="info"
                  effect="solid"
                  clickable
                  globalEventOff="click"
                >
                  Cancelar aplicación
                </ReactTooltip>
              </button>
            )}
          </>
        </div>
      ),
    },
    {
      name: "Modificar Sucursal",
      sortable: false,
      center: true,
      wrap: true,
      cell: (propsss) => (
        <div
          className="text-center"
          style={{ width: "100%", overflowX: "auto", whiteSpace: "nowrap" }}
        >
          <button
            disabled={propsss.Estatus != "PEND"}
            data-tip
            data-for="TT4"
            className="asstext"
            style={{
              margin: ".15em",
              width: "15%",
              height: "40px",
              padding: "0px",
              tableLayout: "fixed",
              borderCollapse: "collapse",
            }}
            type={"button"}
            onClick={() => {
              let nuevo = {
                SolicitudGastoID: propsss.SolicitudGastoID,
                FechaSolicitud: propsss.FechaSolicitud,
                Autorizada: propsss.Autorizada,
                CajaID: propsss.CajaID,
                NombreCaja: propsss.NombreCaja,
                NombreSucursal: propsss.NombreSucursal,
                CuentaBancoID: propsss.CuentaBancoID,
                NumeroCuenta: propsss.NumeroCuenta,
                MontoSolicitado: propsss.MontoSolicitado,
                MontoAutorizado: propsss.MontoAutorizado,
                Solicitante: propsss.Solicitante,
                Observaciones: propsss.Observaciones,
                ObservacionesTesoreria:
                  propsss.ObservacionesTesoreria == null
                    ? ""
                    : propsss.ObservacionesTesoreria,
                DetalleSaldos: propsss.DetalleSaldos,
                Revisado: propsss.Revisado,
                ProrratearGasto: propsss.ProrratearGasto,
                Meses: propsss.Meses,
              };
              setState((s) => ({
                ...s,
                DetalleSolicitud: propsss.DetalleSaldos,
                EstatusClave: propsss.EstatusClave,
                EstatusDescripcion: propsss.Descripcion,
                Form: {
                  ...s.Form,
                  ModificarSucursal: true,
                  Datos: nuevo,
                  Id: propsss.SolicitudGastoID,
                  Solicitante: propsss.Solicitante,
                  Revisado: propsss.Revisado,
                  Observaciones: propsss.Obsevaciones,
                  MontoSolicitado: propsss.MontoSolicitado,
                  SolicitudDetalleID: propsss.SolicitudDetalleID,
                  ProrratearGasto: propsss.ProrratearGasto,
                  Meses: propsss.Meses,
                },
              }));
            }}
          >
            <FaBuilding />
            <ReactTooltip
              id="TT4"
              type="info"
              effect="solid"
              clickable
              globalEventOff="click"
            >
              Modificar Sucursal
            </ReactTooltip>
          </button>
        </div>
      ),
    },
  ];
  //OBtener fecha y hora actual

  const actualizarSolicitudCancelada = (item: any) => {
    if (item.success) {
      toast.success(item.message);
      setState((state) => ({
        ...state,
        Datos: state.Datos.map((Dato) =>
          Dato.SolicitudGastoID === item.data.SolicitudGastoID
            ? {
                ...Dato,
                FechaCancelado: item.data.FechaCancelado,
                Estatus: "CANC",
                EstatusClave: "CANC",
                Descripcion: "Solicitud cancelada.",
              }
            : Dato
        ),
      }));
    } else {
      toast.warn(item.message);
    }
  };

  const fnCancelarSolicitud = (element: any) => {
    let Datos = {
      SolicitudGastoID: element.SolicitudGastoID,
    };

    const MySwal = withReactContent(Swal);
    MySwal.fire({
      icon: "warning",
      html: (
        <div>
          <br />
          <h3 className="text-center">Aviso</h3>
          <div className={`modal-body`}>
            <h5 className="text-center">
              Estás por cancelar la solicitud número{" "}
              <strong>{element.SolicitudGastoID}</strong>, solicitada por{" "}
              <strong>{element.Solicitante} </strong> ¿seguro desea continuar?.{" "}
              <strong>Nota: La acción no es reversible.</strong>{" "}
            </h5>
          </div>
        </div>
      ),
      timerProgressBar: false,
      showCancelButton: true,
      showConfirmButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      focusConfirm: false,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonAriaLabel: "Aceptar",
      cancelButtonAriaLabel: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        Funciones.FNCancelarSolicitud(props.oidc, Datos)
          .then((respuesta: any) => {
            setState((s) => ({ ...s, Cargando: false }));
            actualizarSolicitudCancelada(respuesta);
          })
          .catch((error: any) => {
            toast.error("Ocurrió un error al cancelar la solicitud.");
          });
      } else {
        setState((s) => ({ ...s, Cargando: false }));
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
          confirmButtonText: `Continuar`,
          confirmButtonAriaLabel: "Continuar",
          confirmButtonColor: "#3085d6",
        });
      }
    });
  };
  React.useEffect(() => {
    FNGetSucursales();
    FNGetEstatus();
    FNGetRubros();

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    setState((s) => ({
      ...s,
      DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro),
    }));
    // eslint-disable-next-line
  }, [state.Datos, state.Filtro]);

  const fnCancelar = () =>
    setState({
      ...state,
      Form: {
        ...state.Form,
        Mostrar: false,
      },
    });
  const fnCancelarTotal = () =>
    setState({
      ...state,
      Form: {
        ...state.Form,
        ModificarTotal: false,
        ModificarSucursal: false,
      },
    });

  const FNGetEstatus = () => {
    Funciones.FNGetEstatus(props.oidc)
      .then((respuesta: any) => {
        // if (isMounted.current === true) {

        var Estatus = respuesta.map((valor: any) => {
          var obj = {
            value: valor.Estatus,
            label: valor.Estatus + " - " + valor.Descripcion,
          };
          return obj;
        });

        setState((s) => ({ ...s, Options: Estatus }));
        // }
      })
      .catch(() => {
        // if (isMounted.current === true) {
        setState((s) => ({ ...s, Options: [] }));
        // }
      });
  };
  const FNGetSucursales = () => {
    Funciones.FNGetSucursales(props.oidc)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          var sucursales = respuesta.map((valor: any) => {
            var obj = { value: valor.SucursalID, label: valor.Nombre };
            return obj;
          });
          setState((s) => ({ ...s, OptionsSucursales: sucursales }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, OptionsSucursales: [] }));
        }
      });
  };
  const FNGetRubros = () => {
    Funciones.FNGetRubros(props.oidc)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          var Rubros = respuesta.map((valor: any) => {
            var obj = { value: valor.RubroGastosID, label: valor.Descripcion };
            return obj;
          });
          setState((s) => ({ ...s, OptionsRubros: Rubros }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, OptionsRubros: [] }));
        }
      });
  };

  const cbActualizarTotal = (item: any) => {
    setState({
      ...state,
      Datos: state.Datos.map((Dato) =>
        Dato.SolicitudDetalleID === item.SolicitudDetalleID ? item : Dato
      ),
      Form1: { ...state.Form, Mostrar: false, Datos: DatosDefecto2 },
    });
  };

  const cbActualizar = (element: any) => {
    setState({
      ...state,
      Datos: state.Datos.map((Dato) =>
        Dato.SolicitudGastoID === element.SolicitudGastoID ? element : Dato
      ),
      Form: {
        ...state.Form,
        Mostrar: false,
        Datos: {
          SolicitudGastoID: 0,
          FechaSolicitud: "",
          Autorizada: false,
          CajaID: 0,
          NombreCaja: "",
          NombreSucursal: "",
          CuentaBancoID: 0,
          NumeroCuenta: "",
          MontoSolicitado: 0,
          MontoAutorizado: 0,
          Solicitante: "",
          Observaciones: "",
          ObservacionesTesoreria: "",
          ProrratearGasto: false,
          Meses: 0,
          DetalleSaldos: [
            {
              Clave: "",
              Descripcion: "",
              SolicitudDetalleID: 0,
              SolicitudGastoID: 0,
              Total: 0,
              RubroGastosID: 0,
              Cancelado: false,
            },
          ],
        },
      },
    });
  };

  const fnActualizarRespuesta = (
    FechaInicial: string,
    FechaFinal: string,
    SucursalCajaID: number,
    EstatusClave: string
  ) => {
    setState((s) => ({ ...s, Cargando: true }));
    let a = {
      FechaInicial: FechaInicial,
      FechaFinal: FechaFinal,
      SucursalCajaID: SucursalCajaID,
      EstatusClave: EstatusClave,
    };
    Funciones.FNGet(props.oidc, a)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: false,
            Datos: respuesta,
          }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, Cargando: false, Error: true, Datos: [] }));
        }
      });
  };

  const fnImprimir = (id: number) => {
    const MySwal = withReactContent(Swal);

    let timerInterval;
    MySwal.fire({
      icon: "info",
      html: (
        <div>
          <br />
          <h3 className="text-center">Aviso</h3>
          <div className={`modal-body`}>
            <h5 className="text-center">Imprimiendo solicitud.</h5>
          </div>
        </div>
      ),
      timerProgressBar: false,
      confirmButtonText: `Ok`,
      timer: 10000,
      didOpen: () => {
        MySwal.showLoading();
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });
    let a = {
      SolicitudGastoID: id,
    };
    Funciones.FNImprimir(props.oidc, a)
      .then((pdf: any) => {
        const file = new Blob([pdf], { type: "application/pdf" });

        // const fileURL = URL.createObjectURL(file);
        const fileURL = URL.createObjectURL(file);
        const enlaceTemporal = document.createElement("a");
        enlaceTemporal.href = fileURL;
        enlaceTemporal.target = "_blank";
        enlaceTemporal.style.display = "none";

        document.body.appendChild(enlaceTemporal);

        enlaceTemporal.click();

        setTimeout(() => {
          // Imprimir el documento
          // window.print();
        }, 1000);
        MySwal.close();
        // window.open(fileURL);
      })
      .catch(() => {
        if (isMounted.current === true) {
        }
      });
  };

  const fnCancelarMostrarVerDoc = () => {
    setState((s) => ({
      ...s,
      Form: {
        ...s.Form,
        VerDoc: false,
        Mostrar: true,
      },
    }));
  };

  const activador = (item?: any) => {
    setState((state) => ({
      ...state,
      DetalleSolicitud: state.DetalleSolicitud.map((Dato) =>
        Dato.SolicitudDetalleID === item.SolicitudDetalleID
          ? { ...Dato, Revisado: true, Aceptado: true }
          : Dato
      ),
    }));
  };

  const desactivador = (item?: any) => {
    setState((state) => ({
      ...state,
      DetalleSolicitud: state.DetalleSolicitud.map((Dato) =>
        Dato.SolicitudDetalleID === item.SolicitudDetalleID
          ? { ...Dato, Revisado: true, Aceptado: false }
          : Dato
      ),
    }));
  };
  const fnVerDoc = () => {
    setState((s) => ({
      ...s,
      Form: {
        ...s.Form,
        VerDoc: true,
      },
    }));
  };
  const fnVerModificar = (row: any) => {
    setState((s) => ({
      ...s,
      DetalleFilaModificada: {
        ...s.DetalleFilaModificada,
        SolicitudDetalleID: row.SolicitudDetalleID,
        MontoFilaModificada: row.Total,
        DescripcionModificada: row.Observaciones,
      },
      Form: {
        ...s.Form,
        ModificarTotal: true,
      },
    }));
  };

  return (
    <div className="row">
      <div className="col-12">
        <Card Title="Amortizar Solicitud De Gastos">
          <Card.Body>
            <Card.Body.Content>
              <div>
                <div
                  className="row"
                  style={{ textAlign: "end", flexDirection: "row-reverse" }}
                >
                  <div
                    style={{
                      maxWidth: "25%",
                      textAlign: "right",
                      alignContent: "end",
                    }}
                  >
                    <br></br>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar tipo solicitud"
                        value={state.Filtro}
                        onChange={(e) =>
                          setState((s) => ({ ...s, Filtro: e.target.value }))
                        }
                      />
                      <span className="input-group-text">
                        <FaSearch />{" "}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="columns is-centered is-mobile is-multiline">
                  <div className="column  is-full-desktop is-full-tablet is-full-mobile">
                    <CFormFiltros
                      initialValues={state.DatosFormik}
                      fnCancelar={fnCancelar}
                      OptionsSucursales={state.OptionsSucursales}
                      fnSetRespuesta={fnActualizarRespuesta}
                      Options={state.Options}
                    />
                  </div>{" "}
                  *
                  {/*    <div className="column is-one-quarter-desktop is-full-tablet is-full-mobile text-end">
                                        <br></br><div className="input-group mb-3">
                                            <input type="text" className="form-control" placeholder="Buscar tipo solicitud" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                            <span className="input-group-text"><FaSearch /> </span>
                                        </div>
                                    </div> */}
                </div>
                {state.Cargando && <Spinner />}
                {state.Error && <span>Error al cargar los datos...</span>}
                {!state.Cargando && !state.Error && (
                  <div>
                    <DataTable
                      data={state.DatosMostrar}
                      paginationComponentOptions={{
                        rowsPerPageText: "Resultados por página:",
                        rangeSeparatorText: "of",
                        noRowsPerPage: false,
                        selectAllRowsItem: false,
                        selectAllRowsItemText: "Todos",
                      }}
                      subHeader
                      noDataComponent={
                        <div className="text-center">Sin registros</div>
                      }
                      /*    subHeaderComponent={
                                                   <div className="row">
                                                       <div className="col-sm-12">
                                                           <div className="input-group mb-3">
                                                               <input type="text" className="form-control" placeholder="Buscar tipo solicitud" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                               <span className="input-group-text"><FaSearch /> </span>
                                                           </div>
                                                       </div>
                                                   </div> 
                                               } */
                      striped
                      pagination
                      dense
                      noHeader
                      responsive
                      keyField={"SolicitudGastoID"}
                      defaultSortField={"SolicitudGastoID"}
                      columns={Columns}
                    />
                    {state.Form.ModificarTotal && (
                      <ModalWin open={state.Form.ModificarTotal} center={true}>
                        <ModalWin.Header>
                          <h5 className={MODAL_TITLE_CLASS}>
                            Modificar Solicitud{" "}
                          </h5>
                        </ModalWin.Header>
                        <ModalWin.Body>
                          {
                            <CFormTotal
                              oidc={props.oidc}
                              initialValues2={state.DetalleFilaModificada}
                              Id={state.Form.Id}
                              MontoSolicitado={state.Form.MontoSolicitado}
                              Observaciones={state.Form.Observaciones}
                              cbGuardar={cbAgregar}
                              fnCancelar={fnCancelar}
                              fnCancelarTotal={fnCancelarTotal}
                              initialValues={state.Form.Datos}
                              Revisado={false}
                              datosRubros={[]}
                              initialValues3={{ Total: 0 }}
                              cbActualizar={cbActualizarTotal}
                              SolicitudDetalleID={state.SolicitudDetalleID}
                              OptionsSucursales={state.OptionsSucursales}
                              OptionsRubros={state.OptionsRubros}
                            />
                          }
                        </ModalWin.Body>
                      </ModalWin>
                    )}
                    {state.Form.ModificarSucursal && (
                      <ModalWin
                        open={state.Form.ModificarSucursal}
                        center={true}
                      >
                        <ModalWin.Header>
                          <h5 className={MODAL_TITLE_CLASS}>
                            Modificar Sucursal{" "}
                          </h5>
                        </ModalWin.Header>
                        <ModalWin.Body>
                          {
                            <CFormSucursal
                              oidc={props.oidc}
                              initialValues2={state.DetalleFilaModificada}
                              Id={state.Form.Id}
                              MontoSolicitado={state.Form.MontoSolicitado}
                              Observaciones={state.Form.Observaciones}
                              cbGuardar={cbAgregar}
                              fnCancelar={fnCancelar}
                              fnCancelarTotal={fnCancelarTotal}
                              initialValues={state.Form.Datos}
                              Revisado={false}
                              datosRubros={[]}
                              initialValues3={{ Total: 0 }}
                              cbActualizar={cbActualizarTotal}
                              SolicitudDetalleID={state.SolicitudDetalleID}
                              OptionsSucursales={state.OptionsSucursales}
                              OptionsRubros={state.OptionsRubros}
                            />
                          }
                        </ModalWin.Body>
                      </ModalWin>
                    )}
                    {state.Form.MostrarVerEvidencias && (
                      <ModalWin
                        open={state.Form.MostrarVerEvidencias}
                        center={true}
                        large
                      >
                        <ModalWin.Header>
                          <h5 className={MODAL_TITLE_CLASS}>Ver evidencias </h5>
                          <button
                            type="button"
                            className="delete"
                            onClick={() => {
                              setState({
                                ...state,
                                Form: {
                                  ...state.Form,
                                  MostrarVerEvidencias: false,
                                },
                              });
                            }}
                          />
                        </ModalWin.Header>
                        <ModalWin.Body>
                          <CFormListaEvidencias
                            oidc={props.oidc}
                            Cotizacion={state.Cotizacion}
                            Evidencias={state.EvidenciasLista}
                            SolicitudDetalleID={state.SolicitudDetalleID}
                            fnSetDocumentoID={setDocumentoID}
                            fnVerDoc={fnVerDoc}
                          />
                        </ModalWin.Body>
                      </ModalWin>
                    )}
                    {state.Form.VerDoc && (
                      <ModalWin open={state.Form.VerDoc} center large>
                        <ModalWin.Header>
                          <h5 className={MODAL_TITLE_CLASS}>Ver documento</h5>
                          <button
                            type="button"
                            className="delete"
                            onClick={() => {
                              fnCancelarMostrarVerDoc();
                            }}
                          />
                        </ModalWin.Header>
                        <ModalWin.Body>
                          <VerDocumento
                            DocumentoID={state.DocumentoID}
                            fnCancelar={fnCancelarMostrarVerDoc}
                          />
                        </ModalWin.Body>
                      </ModalWin>
                    )}
                    <ModalWin
                      open={state.Form.Mostrar}
                      large={true}
                      center={true}
                      xlarge={true}
                    >
                      <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>
                          {state.Form.Id
                            ? "Revisar solicitud"
                            : "Agregar solicitud"}
                        </h5>
                        <button
                          type="button"
                          className="delete"
                          onClick={() => {
                            fnCancelar();
                          }}
                        />
                      </ModalWin.Header>
                      <ModalWin.Body>
                        {
                          <CForm
                            setSolicitudDetalleID={setSolicitudDetalleID}
                            fnMostrarImagenesEvidencia={
                              fnMostrarImagenesEvidencia
                            }
                            setDocumentoID={setDocumentoID}
                            fnVerDoc={fnVerDoc}
                            datosRubros={state.DetalleSolicitud}
                            oidc={props.oidc}
                            initialValues={state.Form.Datos}
                            Id={state.Form.Id}
                            Revisado={state.Form.Revisado}
                            Solicitante={state.Form.Solicitante}
                            fnCancelar={fnCancelar}
                            activador={activador}
                            desactivador={desactivador}
                            cbActualizar={cbActualizar}
                            EstatusDescripcion={state.EstatusDescripcion}
                            EstatusClave={state.EstatusClave}
                            cbAgregar={cbAgregar}
                            cbGuardar={cbAgregar}
                            initialValues2={{ Total: 0 }}
                            initialValues3={{ Total: 0 }}
                            fnModificarTotal={fnVerModificar}
                          />
                        }
                      </ModalWin.Body>
                    </ModalWin>
                  </div>
                )}
              </div>
            </Card.Body.Content>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IEstado) => ({
  oidc: state.oidc,
});

const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AmortizarSolicitudGastos);
