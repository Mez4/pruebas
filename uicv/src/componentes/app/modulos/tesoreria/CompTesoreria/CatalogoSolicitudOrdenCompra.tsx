import React from "react";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";
import * as Funciones from "./CatalogoSolicitudOrdenCompra/Funciones";
import { toast } from "react-toastify";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

// Icons
import {
  FaCheck,
  FaCheckCircle,
  FaCircle,
  FaClone,
  FaEye,
  FaFilePdf,
  FaPencilAlt,
  FaPlus,
  FaPrint,
  FaSearch,
  FaTrash,
  FaWindowClose,
} from "react-icons/fa";

// Custom components
import { Card, Spinner } from "../../../../global";
import { CForm } from "./CatalogoSolicitudOrdenCompra/CForm";
import { FiRefreshCcw } from "react-icons/fi";
import { FiltrarDatos } from "../../../../../global/functions";
import { inputCSS } from "react-select/src/components/Input";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactTooltip from "react-tooltip";
type CatalogosType = {
  oidc: IOidc;
};

const CatalogoSolicitudOrdenCompra = (props: CatalogosType) => {
  // Controll our mounted state
  let isMounted = React.useRef(true);
  const MySwal = withReactContent(Swal);
  const DatosMostrar: any[] = [];

  const DatosDefecto = {
    OrdenID: 0,
    SolicitudID: 0,
    SolicitanteID: 0,
    NombreSolicita: "",
    ApruebaID: 0,
    NombreAprueba: "",
    AutorizaID: 0,
    NombreAutoriza: "",
    FechaAprobado: "",
    FechaAutorizado: "",
    EstatusID: 0,
    EstatusDes: "",
    Pendientes: 0,
    AprobadoID: 0,
    ProductoID: 0,
    DetalleOrden: [
      {
        OrdenDetalleID: 0,
        OrdenID: 0,
        SolicitudDetalleID: 0,
        AprobadoDetalleID: 0,
        ProductoUniformeID: 0,
        ProductoUniformeDesc: "",
        PiezasSolicitadas: 0,
        PiezasAprobadas: 0,
        PiezasAutorizadas: 0,
        PiezasPendientes: 0,
        FechaCompromiso: "",
        Observaciones: "",
      },
    ],
  };
  const Datos: any[] = [];

  const [state, setState] = React.useState({
    Datos,
    DatosMostrar,
    BotonesModal: false,
    Filtro: "",
    Cargando: true,
    Error: false,
    Form: {
      Mostrar: false,
      Datos: DatosDefecto,
      MostrarCrearMovimiento: false,
      Id: 0,
    },
  });
  const FNGetLocal = () => {
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNGet(props.oidc)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          console.log(respuesta);
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

  const estatusColor = (estatus: number) => {
    switch (estatus) {
      case 1:
        return "Orange";
      case 2:
        return "Red";
      case 3:
        return "Orange";
      case 4:
        return "Yellow";
      case 11:
        return "Orange";
      case 12:
        return "Yellow";
      case 13:
        return "Green";
      case 15:
        return "Orange";
      case 16:
        return "Orange";
      case 17:
        return "Green";
      case 18:
        return "Yellow";
      case 19:
        return "Yellow";
      default:
        return "Green";
    }
  };

  const Columns: IDataTableColumn[] = [
    {
      name: "Orden",
      selector: "OrdenID",
      sortable: true,
      center: true,
      cell: (row) => <span className="text-center">{row.OrdenID}</span>,
    },
    {
      name: "Aprueba",
      selector: "NombreAprueba",
      sortable: true,
      center: true,
      cell: (row) => <span className="text-center">{row.NombreAprueba}</span>,
    },
    {
      name: "Autoriza",
      selector: "NombreAutoriza",
      sortable: true,
      center: true,
      cell: (row) => (
        <span className="text-center">
          {row.NombreAutoriza == undefined ? "--" : row.NombreAutoriza}
        </span>
      ),
    },
    {
      name: "FechaAprobado",
      selector: "FechaAprobado",
      sortable: false,
      center: true,
      cell: (row) => (
        <span className="text-center">
          {row.FechaAprobado == undefined
            ? "--"
            : moment(row.FechaAprobado).format("DD-MM-YYYY hh:mm:ss")}
        </span>
      ),
    },

    {
      name: "FechaAutorizado",
      selector: "FechaAutorizado",
      sortable: false,
      center: true,
      cell: (row) => (
        <span className="text-center">
          {row.FechaAutorizado == undefined
            ? "--"
            : moment(row.FechaAutorizado).format("DD-MM-YYYY hh:mm:ss")}
        </span>
      ),
    },
    {
      name: "Estatus",
      selector: "EstatusID",
      sortable: false,
      center: true,
      cell: (row) => (
        <span className="text-center">
          {<FaCircle color={estatusColor(row.EstatusID)} />}
        </span>
      ),
    },
    {
      name: "Descripcion",
      selector: "EstatusDes",
      sortable: false,
      center: true,
      cell: (row) => <span className="text-center">{row.EstatusDes}</span>,
    },
    {
      name: "Acciones",
      sortable: false,
      center: true,
      cell: (props) => (
        <div className="columns is-centered is-mobile is-multiline">
          <div className="column text-center is-full-desktop is-full-mobile">
            <button
              className="asstext"
              type={"button"}
              data-tip
              data-for="Btn_detalle"
              onClick={() => {
                let nuevo = {
                  OrdenID: props.OrdenID,
                  SolicitudID: props.SolicitudID,
                  SolicitanteID: props.SolicitanteID,
                  NombreSolicita: props.NombreSolicita,
                  ApruebaID: props.ApruebaID,
                  NombreAprueba: props.NombreAprueba,
                  AutorizaID: props.AutorizaID,
                  NombreAutoriza: props.NombreAutoriza,
                  FechaAprobado: props.FechaAprobado,
                  FechaAutorizado: props.FechaAutorizado,
                  EstatusID: props.EstatusID,
                  EstatusDes: props.EstatusDes,
                  Pendientes: props.Pendientes,
                  AprobadoID: props.AprobadoID,
                  ProductoID: props.ProductoID,
                  DetalleOrden: props.DetalleOrden,
                };
                setState((s) => ({
                  ...s,
                  Form: {
                    ...s.Form,
                    Mostrar: true,
                    Datos: nuevo,
                    Id: props.OrdenID,
                  },
                }));
              }}
            >
              <FaEye />
              <ReactTooltip id="Btn_detalle" type="info" effect="solid">
                Ver Detalle
              </ReactTooltip>
            </button>
            &nbsp;&nbsp;&nbsp;
            <button
              className="asstext"
              type={"button"}
              data-tip
              data-for="Btn_orden"
              style={
                props.EstatusID == 11 || props.EstatusID == 15
                  ? {}
                  : { display: "none" }
              }
              onClick={() => {
                generarPDF(
                  props.OrdenID,
                  props.NombreSolicita,
                  props.SolicitudID
                );
              }}
            >
              <FaFilePdf />
              <ReactTooltip id="Btn_orden" type="info" effect="solid">
                Orden de Compra
              </ReactTooltip>
            </button>
          </div>
        </div>
      ),
    },
  ];

  // Use effect
  React.useEffect(() => {
    FNGetLocal();
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
    // eslint-disable-next-line%
  }, [state.Datos, state.Filtro]);

  const cbAgregar = (item: any, number: any) => {
    setState((s) => ({ ...s, Form: state.Form }));
    setState((s) => ({ ...s, BotonesModal: true }));
    let PiezasAu: any[] = [];

    state.Form.Datos.DetalleOrden.forEach((element) => {
      let a = {
        OrdenDetalleID: element.OrdenDetalleID,
        PiezasAprobadas: element.PiezasAprobadas,
        PiezasAutorizadas: element.PiezasAutorizadas,
        PiezasPendientes: element.PiezasPendientes,
      };
      PiezasAu.push(a);
    });
    MySwal.fire({
      focusCancel: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      icon: "info",
      html: (
        <div>
          <br />
          <h3 className="text-center">Confirmación</h3>
          <div className={`modal-body`}>
            <h5 className="text-center">
              Verifica las Piezas. <br />
              <strong>
                NOTA: Una vez confirmadas las piezas estas no podrán
                modificarse.
              </strong>
            </h5>
            <br />
            <div className="row">
              <div className="col-md-12">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered table-sm">
                    <thead>
                      <tr>
                        <th className="text-center">Orden Detalle</th>
                        <th className="text-center">Piezas Aprobadas</th>
                        <th className="text-center">Piezas Autorizadas</th>
                        <th className="text-center">Piezas Pendientes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PiezasAu.map((item: any) => {
                        return (
                          <tr key={item.OrdenDetalleID}>
                            <td className="text-center">
                              <strong>{item.OrdenDetalleID}</strong>
                            </td>
                            <td className="text-center">
                              {item.PiezasAprobadas}
                            </td>
                            <td className="text-center">
                              {item.PiezasAutorizadas}
                            </td>
                            <td className="text-center">
                              {item.PiezasPendientes}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      showCloseButton: false,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#3085d6",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        setState((s) => ({ ...s, BotonesModal: true }));
        MySwal.fire({
          icon: "info",
          html: (
            <div>
              <br />
              <h3 className="text-center">Guardando</h3>
              <div className={`modal-body`}>
                <h5 className="text-center">
                  Espera mientras se realiza la autorizacion. <br />{" "}
                </h5>
              </div>
            </div>
          ),
          timerProgressBar: true,
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => {
            MySwal.showLoading();
          },
        });
        let or = {
          DetalleOrden: item,
          OrdenID: number,
        };
        Funciones.FNGuardarPiezasAutorizadas(props.oidc, or)
          .then((respuesta: any) => {
            setState((s) => ({ ...s, Mostrar: false, BotonesModal: false }));
            setState((s) => ({ ...s, Datos: respuesta }));
            cbAgregarlocal(respuesta);
            FNGetLocal();
            MySwal.close();
          })
          .catch((res: any) => {
            FNGetLocal();
            toast.error(
              "Ocurrio un problema mientras se guardaba, favor de reintentar."
            );
            setState((s) => ({
              ...s,
              Datos: [],
              BotonesModal: false,
              Form: {
                ...s.Form,
                Mostrar: false,
              },
            }));
            MySwal.close();
          });
      } else {
        setState((s) => ({ ...s, BotonesModal: false }));
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
          confirmButtonColor: "#3085d6",
        });
      }
    });
  };

  const cbAgregarlocal = (item: any) => {
    toast.success("Se autorizo correctamente");
    setState((state) => ({
      ...state,
      Datos: [item],
      Form: {
        ...state.Form,
        Mostrar: false,
        Datos: {
          OrdenID: 0,
          SolicitudID: 0,
          SolicitanteID: 0,
          NombreSolicita: "",
          ApruebaID: 0,
          NombreAprueba: "",
          AutorizaID: 0,
          NombreAutoriza: "",
          FechaAprobado: "",
          FechaAutorizado: "",
          EstatusID: 0,
          EstatusDes: "",
          Pendientes: 0,
          AprobadoID: 0,
          ProductoID: 0,
          DetalleOrden: [],
        },
      },
    }));
    FNGetLocal();
  };

  const abrirModalCrearMovimiento = () => {
    setState((state) => ({
      ...state,
      Form: {
        ...state.Form,
        MostrarCrearMovimiento: true,
      },
    }));
  };

  const cambiarPiezas = (item: any, valor: number) => {
    let index = state.Form.Datos.DetalleOrden.findIndex((respuesta: any) => {
      return respuesta.OrdenDetalleID === item.OrdenDetalleID;
    });
    state.Form.Datos.DetalleOrden[index].PiezasAutorizadas = valor;
    setState((s) => ({
      ...s,
      Form: {
        ...s.Form,
        Datos: state.Form.Datos,
      },
    }));
  };
  const cambiarPendientes = (item: any, valor: number) => {
    let index = state.Form.Datos.DetalleOrden.findIndex((respuesta: any) => {
      return respuesta.OrdenDetalleID === item.OrdenDetalleID;
    });
    state.Form.Datos.DetalleOrden[index].PiezasPendientes = valor;
    setState((s) => ({
      ...s,
      Form: {
        ...s.Form,
        Datos: state.Form.Datos,
      },
    }));
  };

  const fnCancelar = () =>
    setState({ ...state, Form: { ...state.Form, Mostrar: false } });

  const generarPDF = (valor: number, nombre: string, solicitud: number) => {
    if (valor > 0) {
      let timerInterval;
      MySwal.fire({
        icon: "info",
        html: (
          <div>
            <br />
            <h3 className="text-center">Aviso</h3>
            <div className={`modal-body`}>
              <h5 className="text-center">Imprimiendo su Orden de Compra.</h5>
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
      let b = {
        OrdenID: valor,
        NombreSolicita: nombre,
        SolicitudID: solicitud,
      };
      console.log(b);
      Funciones.FNPrintPDF(props.oidc, b)
        .then((respuesta: any) => {
          const file = new Blob([respuesta], { type: "application/pdf" });

          // const fileURL = URL.createObjectURL(file);
          // window.open(fileURL);
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

          FNGetLocal();
          MySwal.close();
        })
        .catch((err) => {
          FNGetLocal();
          toast.error("Ocurrió un error al generar el PDF");
        });
    } else {
      MySwal.fire({
        icon: "warning",
        html: (
          <div>
            <br />
            <h3 className="text-center">Info</h3>
            <div className={`modal-body`}>
              <h5 className="text-center">
                No se encuentra la orden de compra
              </h5>
            </div>
          </div>
        ),
        showCancelButton: false,
        confirmButtonText: `Ok`,
      });
    }
  };

  return (
    <div className="row">
      <div className="col-12">
        <Card Title="Autorizacion y Orden de Compra">
          <Card.Body>
            <Card.Body.Content>
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
                    subHeaderComponent={
                      <div className="row">
                        <div className="col-sm-12">
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Buscar"
                              value={state.Filtro}
                              onChange={(e) =>
                                setState((s) => ({
                                  ...s,
                                  Filtro: e.target.value,
                                }))
                              }
                            />

                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => FNGetLocal()}
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
                    keyField={"OrdenID"}
                    defaultSortField={"OrdenID"}
                    columns={Columns}
                  />
                  <ModalWin open={state.Form.Mostrar} center={true} xlarge>
                    <ModalWin.Header>
                      <h5 className={MODAL_TITLE_CLASS}>
                        Autorización y Orden de Compra
                      </h5>
                    </ModalWin.Header>
                    <ModalWin.Body>
                      {
                        <CForm
                          oidc={props.oidc}
                          initialValues={state.Form.Datos}
                          Id={state.Form.Id}
                          cbGuardar={cbAgregar}
                          fnCancelar={fnCancelar}
                          abrirModalCrearMovimiento={abrirModalCrearMovimiento}
                          cambiarPiezas={cambiarPiezas}
                          cambiarPendientes={cambiarPendientes}
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
)(CatalogoSolicitudOrdenCompra);
