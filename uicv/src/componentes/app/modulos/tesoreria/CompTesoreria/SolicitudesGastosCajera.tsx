import React from "react";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";
import * as Funciones from "./SolicitudesGastosCajera/Funciones";
import { toast } from "react-toastify";
import { ErrorMessage, Field, Formik } from "formik";
import { Form } from "usetheform";
import moment from "moment";
import { FormateoDinero } from "../../../../../global/variables";
import VerDocumento from "./SolicitudesGastosCajera/VerDocumento";
import VerDocumento2 from "./SolicitudesGastosCajera/VerDocumento2";
import CustomFieldImgUpload from "../../../../global/CustomFieldImgUpload";
import * as FnCajas from "../../tesoreria/CompTesoreria/CajasUsuarios/Funciones";

// Icons
import {
  FaCheck,
  FaCircle,
  FaClone,
  FaEye,
  FaPencilAlt,
  FaPlus,
  FaPrint,
  FaSearch,
} from "react-icons/fa";

// Custom components
import { Card, Spinner } from "../../../../global";
import { CForm } from "./SolicitudesGastosCajera/CForm";
import { FiRefreshCcw } from "react-icons/fi";
import { FiltrarDatos } from "../../../../../global/functions";
import ReactTooltip from "react-tooltip";
import { CFormNuevoGasto } from "./SolicitudesGastosCajera/CFormNuevoGasto";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { stat } from "fs";
import { CFormCargarDocumento } from "./SolicitudesGastosCajera/CFormCargarDocumento";
import { CFormCargarDocumento2 } from "./SolicitudesGastosCajera/CFormCargarDocumento2";
import SeleccionarCajaSucursal from "../../../../selectores/SeleccionarCajaSucursal";
import ButtonCambiarCajaSucursal from "../../../../global/ButtonCambiarCajaSucursal";
import { CFormListaEvidencias } from "./SolicitudesGastosCajera/CFormListaEvidencias";

type CatalogosType = {
  oidc: IOidc;
  DocumentoID: number;
};

const SolicitudesGastosCajera = (props: CatalogosType) => {
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
    DetalleSaldos: [
      {
        Clave: "",
        Descripcion: "",
        SolicitudDetalleID: 0,
        SolicitudGastoID: 0,
        Total: 0,
        RubroGastosID: 0,
        // Cancelado: false,
        Revisado: false,
        Aceptado: false,
      },
    ],
  };

  const DatosDefecto2 = {
    CajaID: 0,
    CuentaBancoID: 0,
    RubroID: 0,
    Observaciones: "",
    GeneraGastoSucursal: false,
    SucursalID: 0,
    Rubros: [
      {
        RubroID: 0,
        Clave: "",
        Descripcion: "",
        Total: 0,
        SolicitudDetalleGasID: 0,
        PermitirEvidencia: 0,
      },
    ],
  };
  const DatosDefecto3 = {
    Evidencias: [
      {
        DocumentoID: 0,
        AclaracionID: 0,
        Ruta: "",
      },
    ],
  };

  const Datos: any[] = [];
  const DatosMostrar: any[] = [];
  const DetalleSolicitud: any[] = [];
  const CuentasGastos: any[] = [];
  const CatRubros: any[] = [];
  const CatSucursales: any[] = [];
  const optSucursales: any[] = [];
  const Evidencias: any[] = [];
  const EvidenciasLista: any[] = [];

  const CajaDefault = {
    ProductoID: 0,
    SucursalID: 0,
    CajaID: 0,
  };

  const [state, setState] = React.useState({
    Cotizacion: false,
    EvidenciasLista,
    SucursalSeleccionadaID: 0,
    CajaSeleccionadaID: 0,
    Datos,
    DatosMostrar,
    TituloFecha: "",
    SolicitudGastoID: 0,
    Filtro: "",
    Cargando: true,
    EstatusClave: "",
    Error: false,
    Evidencias,
    CatSucursales,
    CuentaBancariaPrincipalID: 0,
    DetalleSolicitud,
    EstatusDescripcion: "",
    DocumentosConfirmados: false,
    CuentasGastos,
    CatRubros,
    BloquearCuenta: false,
    BloquearRegistros: false,
    solicitudGuardada: false,
    permitirEvidecia: false,
    DocumentoID: 0,
    SolicitudDetalleID: 0,
    Ruta: "",
    ShowCaja: true,
    optSucursales,
    Form: {
      MostrarVerEvidencias: false,
      CargarDocumento: false,
      CargarDocumento2: false,
      Mostrar: false,
      Mostrar2: false,
      VerDoc: false,
      fnverEvidenvia: false,
      DocumentoID: 0,
      Datos: DatosDefecto,
      Datos2: DatosDefecto2,
      Id: undefined,
      Solicitante: "",
      Revisado: false,
      CajaDefault,
    },
  });

  const cbActualizarSolicitudDetalleID = (item?: any) => {
    item.DetalleSaldos.forEach((element) => {
      let index = state.Form.Datos2.Rubros.findIndex(
        (x) => x.RubroID === element.RubroGastosID
      );
      if (index !== -1) {
        state.Form.Datos2.Rubros[index].SolicitudDetalleGasID =
          element.SolicitudDetalleID;
        state.Form.Datos2.Rubros[index].PermitirEvidencia = 1;
      }
    });
    setState((s) => ({
      ...s,
      Form: {
        ...s.Form,
        Datos2: { ...s.Form.Datos2, Rubros: state.Form.Datos2.Rubros },
      },
    }));
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
    Funciones.FNGet(props.oidc, 44)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: false,
            Datos: respuesta,
          }));
          console.log("DATOS RECIBIDOS RESPUESTA", respuesta);
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, Cargando: false, Error: true, Datos: [] }));
        }
      });
  };

  const FNGetCuentasBancos = (Valor1: number) => {
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNGetCuentasGastos(props.oidc, Valor1)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          var cuentasBanc = respuesta.map((valor: any) => {
            var cuenta = valor.NumeroCuentaCBP + " - " + valor.NumeroCuentaCB;
            var obj = { value: valor.CuentaBancoID, label: cuenta };
            return obj;
          });
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: false,
            CuentasGastos: cuentasBanc,
          }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: true,
            CuentasGastos: [],
          }));
        }
      });
  };
  const FNGetRubros = () => {
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNGetRubros(props.oidc, 44)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          var rubroGasto = respuesta.map((valor: any) => {
            var rubroDesc = valor.Clave + " - " + valor.Descripcion;
            var obj = {
              value: valor.RubroGastosID,
              label: rubroDesc,
              total: 0,
              clave: valor.Clave,
              descripcion: valor.Descripcion,
            };
            return obj;
          });
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: false,
            CatRubros: rubroGasto,
          }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: true,
            CuentasGastos: [],
          }));
        }
      });
  };
  const FNGetLocal2 = () => {
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNGetDocsByDocumentoID(props.oidc, props.DocumentoID)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          console.log("###", respuesta);
          console.log("###", respuesta.src);
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: false,
            Form: { ...s.Form, src: respuesta.src },
          }));
        }
      })
      .catch((error) => {
        console.log("###e", error);
        if (isMounted.current === true) {
          setState((s) => ({ ...s, Cargando: false, Error: true, Datos: [] }));
        }
      });
  };

  const FNGetSucursales = () => {
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNGetSucursales(props.oidc)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          var sucursales = respuesta.map((valor: any) => {
            var obj = { value: valor.SucursalID, label: valor.Nombre };
            return obj;
          });
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: false,
            CatSucursales: sucursales,
          }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: true,
            CatSucursales: [],
          }));
        }
      });
  };
  const bloquearCta = () => {
    setState((s) => ({ ...s, BloquearCuenta: true }));
  };

  const bloquearRegistros = () => {
    setState((s) => ({ ...s, BloquearRegistros: true }));
  };

  const tituloFecha = (valor?: any) => {
    if (valor.FechaAutorizado != null && valor.FechaAplicado == null) {
      setState((s) => ({ ...s, TituloFecha: "Fecha Autorizado" }));
    }
    if (valor.FechaAutorizado != null && valor.FechaAplicado != null) {
      setState((s) => ({ ...s, TituloFecha: "Fecha Aplicado" }));
    }
    if (valor.FechaAutorizado == null && valor.FechaAplicado == null) {
      setState((s) => ({ ...s, TituloFecha: "Fecha Solicitud" }));
    }
    if (valor.FechaRechazado != null) {
      setState((s) => ({ ...s, TituloFecha: "Fecha Rechazado" }));
    }
  };

  const setDocumentoID = (id: any) => {
    setState((s) => ({ ...s, DocumentoID: id }));
  };
  const setSolicitudDetalleID = (id: any) => {
    setState((s) => ({ ...s, SolicitudDetalleID: id }));
  };

  const setSolicitudGastoID = (id: any) => {
    setState((s) => ({ ...s, SolicitudGastoID: id }));
  };
  const fnMostrarImagenesEvidencia = (cotizacion: boolean) => {
    console.log("cotizacion", cotizacion);
    setState((s) => ({
      ...s,
      Form: { ...s.Form, MostrarVerEvidencias: true },
      Cotizacion: cotizacion,
    }));
  };

  const ColumnsEvidencias: IDataTableColumn[] = [
    {
      name: "DocumentoID",
      selector: "DocumentoID",
      sortable: false,
      center: true,
    },
    {
      name: "Ruta",
      selector: "Ruta",
      sortable: false,
      center: true,
      cell: (propss) => <span className="text-center">{propss.Ruta}</span>,
    },
    {
      name: "Acciones",
      selector: "Acciones",
      sortable: false,
      center: true,
      cell: (propss) => (
        <span className="text-center">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => fnMostrarImagenesEvidencia(propss)}
          >
            <i className="fa fa-eye"></i>
          </button>
        </span>
      ),
    },
  ];

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
      cell: (row: any) => (
        <span className="text-center">
          {moment(row.FechaSolicitud, "YYYY-MM-DD hh:mm:ss a").format(
            "DD / MM / YYYY hh:mm a"
          )}
        </span>
      ),
    },
    {
      name: "Fecha",
      selector: "FechaSolicitud",
      sortable: false,
      center: true,
      cell: (props: any) => {
        if (props.Estatus == "PEND") {
          return <span className="text-center">Sin revisar</span>;
        } else if (props.Estatus == "AUTZ") {
          return (
            <span className="text-center">
              Autorizado: <br />
              {moment(props.FechaAutorizada, "YYYY-MM-DD hh:mm:ss a").format(
                "DD / MM / YYYY hh:mm a"
              )}
            </span>
          );
        } else if (props.Estatus == "APLI") {
          return (
            <span className="text-center">
              Aplicado: <br />
              {moment(props.FechaAplicado, "YYYY-MM-DD hh:mm:ss a").format(
                "DD / MM / YYYY hh:mm a"
              )}
            </span>
          );
        } else if (props.Estatus == "CANC") {
          return (
            <span className="text-center">
              Cancelado: <br />
              {moment(props.FechaCancelado, "YYYY-MM-DD hh:mm:ss a").format(
                "DD / MM / YYYY hh:mm a"
              )}
            </span>
          );
        } else if (props.Estatus == "RECH") {
          return (
            <span className="text-center">
              Rechazado: <br />
              {moment(props.FechaRechazado, "YYYY-MM-DD hh:mm:ss a").format(
                "DD / MM / YYYY hh:mm a"
              )}
            </span>
          );
        } else if (props.Estatus == "DOCS") {
          return (
            <span className="text-center">
              Docs Subidos: <br />
              {moment(props.FechaDocumentosCon, "YYYY-MM-DD hh:mm:ss a").format(
                "DD / MM / YYYY hh:mm a"
              )}
            </span>
          );
        } else {
          return <span className="text-center">Sin revisar</span>;
        }
      },
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
      name: "Descripción",
      selector: "Descripcion",
      width: "10%",
      sortable: false,
      center: true,
      cell: (propsss) => (
        <span className="text-center">{propsss.Descripcion}</span>
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
      name: "Sucursal",
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
        <div className="text-center">
          {propsss.Revisado && (
            <>
              <button
                style={{
                  margin: ".15em",
                  width: "15%",
                  height: "40px",
                  padding: "2px",
                  tableLayout: "fixed",
                  borderCollapse: "collapse",
                }}
                data-tip
                data-for="TT1"
                className="asstext"
                type={"button"}
                onClick={() => {
                  fnImprimir(propsss.SolicitudGastoID);
                }}
              >
                <FaPrint />
                <ReactTooltip
                  id="TT1"
                  type="info"
                  effect="solid"
                  clickable
                  globalEventOff="click"
                >
                  {" "}
                  Generar solicitud{" "}
                </ReactTooltip>
              </button>
            </>
          )}
          <>
            <button
              data-tip
              data-for="TT1"
              style={{
                margin: ".15em",
                width: "15%",
                height: "40px",
                padding: "2px",
                tableLayout: "fixed",
                borderCollapse: "collapse",
              }}
              className="asstext"
              type={"button"}
              onClick={() => {
                console.log("propsss", propsss);
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
                  ObservacionesTesoreria: propsss.ObservacionesTesoreria,
                  DetalleSaldos: propsss.DetalleSaldos,
                  Revisado: propsss.Revisado,
                };

                setState((s) => ({
                  ...s,
                  SolicitudGastoID: propsss.SolicitudGastoID,
                  DetalleSolicitud: propsss.DetalleSaldos,
                  EstatusDescripcion: propsss.Descripcion,
                  EstatusClave: propsss.EstatusClave,
                  DocumentosConfirmados: propsss.DocumentosConfirmados,
                  Form: {
                    ...s.Form,
                    Mostrar: true,
                    Datos: nuevo,
                    Id: propsss.SolicitudGastoID,
                    Solicitante: propsss.Solicitante,
                    Revisado: propsss.Revisado,
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
                Ver estatus
              </ReactTooltip>
            </button>
          </>
        </div>
      ),
    },
  ];
  const fnSetSucCaja = (Data: any) => {
    FNGetCuentasBancos(Data.CajaID);
    setState((s) => ({
      ...s,
      SucursalSeleccionadaID: Data.SucursalID,
      CajaSeleccionadaID: Data.CajaID,
      ShowCaja: false,
    }));
  };

  const fnGetSucursalesCaja = () => {
    FnCajas.FNGetSucursales(props.oidc)
      .then((respuesta: any) => {
        var sucursales = respuesta.map((valor: any) => {
          var obj = { value: valor.SucursalID, label: valor.Sucursal };
          return obj;
        });
        setState((s) => ({ ...s, optSucursales: sucursales }));
      })
      .catch(() => {
        setState((s) => ({ ...s, optSucursales: [] }));
      });
  };

  React.useEffect(() => {
    FNGetPrincipal();
    FNGetRubros();
    FNGetSucursales();
    fnGetSucursalesCaja();
    return () => {
      isMounted.current = false;
    };
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
        // props.cbActualizar(respuesta)
        // console.log(pdf)

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

        // setCompleted(0)
      })
      .catch(() => {
        if (isMounted.current === true) {
        }
      });
  };
  //function fnCancelar setState state.Form.Mostrar, Mostrar2, CargarDocumento2 and state.BloquearRegistrosto false
  const fnCancelar = () =>
    setState({
      ...state,
      Form: {
        ...state.Form,
        Mostrar: false,
        Mostrar2: false,
        CargarDocumento2: false,
      },
      BloquearRegistros: false,
    });

  const fnCancelarCargarDocumento2 = () =>
    setState({
      ...state,
      Form: {
        ...state.Form,
        CargarDocumento2: false,
      },
    });

  const fnAgregarItem = (item: any) => {
    state.Datos.push(item);
    setState((s) => ({
      ...s,
      DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro),
    }));
  };
  const fnHabilitarCargaDeEvidecia = () => {
    setState((s) => ({
      ...s,
      permitirEvidencia: true,
    }));
  };
  const fnBloquearRegistros = () => {
    setState((s) => ({
      ...s,
      BloquearRegistros: true,
    }));
  };

  const fnActualizarDetalle = (item: any) => {
    console.log("ITEM ANTES DE AGREGAR PERMITIR EVIDENCIA");
    item["PermitirEvidencia"] = 0;
    console.log("ITEM DESPUES DE AGREGAR PERMITIR EVIDENCIA");
    let index = state.Form.Datos2.Rubros.findIndex(
      (x) => x.RubroID === item.RubroGastosID
    );
    state.Form.Datos2.Rubros[index] = item;
    setState((s) => ({
      ...s,
      Form: {
        ...s.Form,
        Datos2: { ...s.Form.Datos2, Rubros: state.Form.Datos2.Rubros },
      },
    }));
  };

  const fnActualizarConfirmarDocumentos = (item: any) => {
    //Remplazar el item
    let index = state.DatosMostrar.findIndex(
      (x) => x.SolicitudGastoID === item.SolicitudGastoID
    );
    state.DatosMostrar[index] = item;
    setState((s) => ({ ...s, DatosMostrar: state.DatosMostrar }));
    toast.success("Documentos confirmados correctamente");
  };

  const activador = (item?: any) => {
    setState((state) => ({
      ...state,
      DetalleSolicitud: state.DetalleSolicitud.map((Dato) =>
        Dato.SolicitudDetalleID === item.SolicitudDetalleID
          ? { ...Dato, Cancelado: false }
          : Dato
      ),
    }));
  };

  const desactivador = (item?: any) => {
    setState((state) => ({
      ...state,
      DetalleSolicitud: state.DetalleSolicitud.map((Dato) =>
        Dato.SolicitudDetalleID === item.SolicitudDetalleID
          ? { ...Dato, Cancelado: true }
          : Dato
      ),
    }));
  };

  const agregarRubro = (item: any) => {
    state.Form.Datos2.Rubros.push(item);
    setState((s) => ({
      ...s,
      Form: {
        ...s.Form,
        Datos2: state.Form.Datos2,
      },
    }));
  };

  const eliminarRubro = (item: any) => {
    state.Form.Datos2.Rubros = state.Form.Datos2.Rubros.filter(
      (Dato) => Dato.RubroID !== item.RubroID
    );
    setState((s) => ({
      ...s,
      Form: {
        ...s.Form,
        Datos2: state.Form.Datos2,
      },
    }));
  };
  //Mostrar modal VerDoc
  const fnVerDoc = () => {
    setState((s) => ({
      ...s,
      Form: {
        ...s.Form,
        VerDoc: true,
      },
    }));
  };
  const fnverEvidenvia = () => {
    setState((s) => ({
      ...s,
      Form: {
        ...s.Form,
        fnverEvidenvia: true,
      },
    }));
  };

  const fnCancelarMostrarVerDoc = () => {
    console.log("ENTROSSSSS");
    setState((s) => ({
      ...s,
      Form: {
        ...s.Form,
        VerDoc: false,
        Mostrar: true,
      },
    }));
  };
  const fnCancelarMostrarVerDoc2 = () => {
    setState((s) => ({
      ...s,
      Form: {
        ...s.Form,
        fnverEvidenvia: false,
        Mostrar: true,
      },
    }));
  };

  const fnMostrarCargaDeDocumento = () => {
    setState((s) => ({
      ...s,
      Form: {
        ...s.Form,
        CargarDocumento: true,
      },
    }));
  };

  const fnMostrarCargaDeDocumento2 = () => {
    setState((s) => ({
      ...s,
      Form: {
        ...s.Form,
        CargarDocumento2: true,
      },
    }));
  };

  const fnCancelarMostrarCargaDeDocumento = () => {
    setState((s) => ({
      ...s,
      Form: {
        ...s.Form,
        CargarDocumento: false,
      },
    }));
  };
  const abrirSeleccionarCaja = () => {
    //update properties of state.CajaDefault to current selected
    setState((s) => ({
      ...s,
      CajaDefault: {
        ...s,
        SucursalID: state.SucursalSeleccionadaID,
        CajaID: state.CajaSeleccionadaID,
      },
      ShowCaja: true,
    }));
  };
  return (
    <div className="row">
      <div className="col-12">
        <Card
          Title="Consultar mis solicitudes de gastos"
          TitleEnd={
            !state.ShowCaja ? (
              <ButtonCambiarCajaSucursal accion={abrirSeleccionarCaja} />
            ) : null
          }
        >
          <Card.Body>
            <Card.Body.Content>
              <Formik
                initialValues={state.Datos}
                enableReinitialize
                onSubmit={(values: any) => { }}
              >
                <Form></Form>
              </Formik>
              {state.Cargando && <Spinner />}
              {state.Error && <span>Error al cargar los datos...</span>}
              {!state.Cargando && !state.Error && (
                <div>
                  <DataTable
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
                    subHeaderComponent={
                      <div className="row">
                        <div className="col-sm-12">
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Buscar tipo de cuenta"
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
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() =>
                                setState({
                                  ...state,
                                  BloquearCuenta: false,
                                  Form: {
                                    VerDoc: false,
                                    fnverEvidenvia: false,
                                    CajaDefault,
                                    MostrarVerEvidencias: false,
                                    CargarDocumento: false,
                                    CargarDocumento2: false,
                                    DocumentoID: 0,
                                    Mostrar: false,
                                    Mostrar2: true,
                                    Datos: DatosDefecto,
                                    Datos2: {
                                      CajaID: 0,
                                      CuentaBancoID: 0,
                                      RubroID: 0,
                                      Observaciones: "",
                                      GeneraGastoSucursal: false,
                                      SucursalID: 0,
                                      Rubros: [],
                                    },
                                    Id: undefined,
                                    Solicitante: "",
                                    Revisado: false,
                                  },
                                })
                              }
                            >
                              <FaPlus />
                            </button>
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => FNGetPrincipal()}
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
                    keyField={"SolicitudGastoID"}
                    defaultSortField={"SolicitudGastoID"}
                    columns={Columns}
                  />
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
                  {state.ShowCaja && (
                    <ModalWin open={state.ShowCaja} center large scrollable>
                      <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>Selección de Caja</h5>
                      </ModalWin.Header>
                      <ModalWin.Body>
                        {state.ShowCaja && (
                          <SeleccionarCajaSucursal
                            optSucursales={state.optSucursales}
                            initialValues={state.Form.CajaDefault}
                            cbAceptar={fnSetSucCaja}
                          />
                        )}
                      </ModalWin.Body>
                    </ModalWin>
                  )}

                  {state.Form.CargarDocumento2 && (
                    <ModalWin open={state.Form.CargarDocumento2} center large>
                      <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>
                          Cargar imagen - Cotización
                        </h5>
                      </ModalWin.Header>
                      <ModalWin.Body>
                        <CFormCargarDocumento2
                          fnActualizarDetalle={fnActualizarDetalle}
                          cbActualizar={fnAgregarItem}
                          fnCancelar={fnCancelar}
                          cbGuardar={fnAgregarItem}
                          DocumentoID={0}
                          SolicitudGastoID={state.SolicitudGastoID}
                          SolicitudDetalleID={state.SolicitudDetalleID}
                          oidc={props.oidc}
                          initialValues={{ file: "" }}
                          fnCancelarMostrarCargaDeDocumento={
                            fnCancelarCargarDocumento2
                          }
                        />
                      </ModalWin.Body>
                    </ModalWin>
                  )}

                  {state.Form.CargarDocumento && (
                    <ModalWin open={state.Form.CargarDocumento} center large>
                      <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>
                          Cargar imagen - Evidencia
                        </h5>
                        <button
                          type="button"
                          className="delete"
                          onClick={() => {
                            setState((s) => ({
                              ...s,
                              Form: {
                                ...s.Form,
                                CargarDocumento: false,
                              },
                            }));
                          }}
                        />
                      </ModalWin.Header>
                      <ModalWin.Body>
                        <CFormCargarDocumento
                          fnActualizarDetalle={fnActualizarDetalle}
                          cbActualizar={fnAgregarItem}
                          fnHabilitarCargaDeEvidecia={
                            fnHabilitarCargaDeEvidecia
                          }
                          fnCancelar={fnCancelar}
                          cbGuardar={fnAgregarItem}
                          DocumentoID={state.DocumentoID}
                          SolicitudGastoID={state.SolicitudGastoID}
                          SolicitudDetalleID={state.SolicitudDetalleID}
                          oidc={props.oidc}
                          initialValues={{ file: "" }}
                          fnCancelarMostrarCargaDeDocumento={
                            fnCancelarMostrarCargaDeDocumento
                          }
                        />
                      </ModalWin.Body>
                    </ModalWin>
                  )}
                  {state.Form.VerDoc && (
                    <ModalWin open={state.Form.VerDoc} center large>
                      <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>
                          Visualizar evidencia
                        </h5>
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
                  {state.Form.fnverEvidenvia && (
                    <ModalWin open={state.Form.fnverEvidenvia} center large>
                      <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>Ver Evidencia</h5>
                        <button
                          type="button"
                          className="delete"
                          onClick={() => {
                            fnCancelarMostrarVerDoc2();
                          }}
                        />
                      </ModalWin.Header>
                      <ModalWin.Body>
                        <VerDocumento2
                          DocumentoID={state.DocumentoID}
                          fnCancelar={fnCancelarMostrarVerDoc2}
                        />
                      </ModalWin.Body>
                    </ModalWin>
                  )}
                  <ModalWin
                    open={state.Form.Mostrar}
                    large={true}
                    xlarge={true}
                    center={true}
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
                          setState((s) => ({
                            ...s,
                            Form: { ...s.Form, Mostrar: false },
                          }));
                        }}
                      />
                    </ModalWin.Header>
                    <ModalWin.Body>
                      {
                        <CForm
                          fnMostrarImagenesEvidencia={
                            fnMostrarImagenesEvidencia
                          }
                          fnActualizarConfirmarDocumentos={
                            fnActualizarConfirmarDocumentos
                          }
                          DocumentosConfirmados={state.DocumentosConfirmados}
                          SolicitudGastoID={state.SolicitudGastoID}
                          fnVerDoc={fnVerDoc}
                          fnverEvidenvia={fnverEvidenvia}
                          setDocumentoID={setDocumentoID}
                          setSolicitudGastoID={setSolicitudGastoID}
                          setSolicitudDetalleID={setSolicitudDetalleID}
                          fnMostrarCargaDeDocumento={fnMostrarCargaDeDocumento}
                          fnMostrarCargaDeDocumento2={
                            fnMostrarCargaDeDocumento2
                          }
                          datosRubros={state.DetalleSolicitud}
                          oidc={props.oidc}
                          initialValues={state.Form.Datos}
                          Id={state.Form.Id}
                          Revisado={state.Form.Revisado}
                          Solicitante={state.Form.Solicitante}
                          fnCancelar={fnCancelar}
                          activador={activador}
                          desactivador={desactivador}
                          EstatusDescripcion={state.EstatusDescripcion}
                          EstatusClave={state.EstatusClave}
                        />
                      }
                    </ModalWin.Body>
                  </ModalWin>
                  <ModalWin
                    open={state.Form.Mostrar2}
                    large={true}
                    center={true}
                  >
                    <ModalWin.Header>
                      <h5 className={MODAL_TITLE_CLASS}>
                        {/*        {state.Form.Id ? "Revisar solicitud" : "Agregar solicitud"} */}{" "}
                        Registrar nueva solicitud de gastos
                      </h5>
                    </ModalWin.Header>
                    <ModalWin.Body>
                      {
                        <CFormNuevoGasto
                          OptionsCuentas={state.CuentasGastos}
                          OptionsRubros={state.CatRubros}
                          OptionsSucursales={state.CatSucursales}
                          BloquearCuenta={state.BloquearCuenta}
                          BloquearRegistros={state.BloquearRegistros}
                          oidc={props.oidc}
                          initialValues={state.Form.Datos2}
                          Id={state.Form.Id}
                          cbActualizarSolicitudDetalleID={
                            cbActualizarSolicitudDetalleID
                          }
                          fnCancelar={fnCancelar}
                          fnBloquearRegistros={fnBloquearRegistros}
                          fnHabilitarCargaDeEvidecia={
                            fnHabilitarCargaDeEvidecia
                          }
                          bloquearCta={bloquearCta}
                          bloquearRegistros={bloquearRegistros}
                          agregarRubro={agregarRubro}
                          eliminarRubro={eliminarRubro}
                          solicitudGuardada={state.solicitudGuardada}
                          permitirEvidecia={state.permitirEvidecia}
                          fnAgregarItem={fnAgregarItem}
                          setSolicitudGastoID={setSolicitudGastoID}
                          fnMostrarCargaDeDocumento={fnMostrarCargaDeDocumento}
                          fnMostrarCargaDeDocumento2={
                            fnMostrarCargaDeDocumento2
                          }
                          setDocumentoID={setDocumentoID}
                          //setSolicitudGastoID={setSolicitudDetalleID}
                          setSolicitudDetalleID={setSolicitudDetalleID}
                          CajaSeleccionada={state.CajaSeleccionadaID}
                          SucursalSeleccionada={state.SucursalSeleccionadaID}
                          fnVerDoc={fnVerDoc}
                        />
                      }
                    </ModalWin.Body>
                  </ModalWin>
                </div>
              )}
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
)(SolicitudesGastosCajera);
