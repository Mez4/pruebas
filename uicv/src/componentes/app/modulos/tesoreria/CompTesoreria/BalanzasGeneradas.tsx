import React from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import * as Funciones from "./BalanzaDeComprobacion/Funciones";
import * as Funciones2 from "../CompTesoreria/Balances/Funciones";
import { toast } from "react-toastify";
import { date } from "yup/lib/locale";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";
import download from "downloadjs";
import {
  FaLockOpen,
  FaFileInvoice,
  FaLock,
  FaPrint,
  FaBox,
  FaBan,
  FaEye,
  FaExclamationCircle,
  FaFile,
} from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// Icons
import { FaPencilAlt, FaSearch, FaCircle, FaTrash } from "react-icons/fa";
import moment from "moment";

// Custom components
import { Card, Spinner } from "../../../../global";
import { CForm } from "./CierrePeriodo/CForm";
import { CFormSaldos } from "./CierrePeriodo/CFormSaldos";
import { FiRefreshCcw } from "react-icons/fi";
import { FiltrarDatos } from "../../../../../global/functions";
import { Form } from "formik";
import { isTemplateTail } from "typescript";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import axios from "axios";

import ReactTooltip from "react-tooltip";

type CatalogosType = {
  Seguridad: IOidc;
};

const CatalogoCaja = (props: CatalogosType) => {
  let isMounted = React.useRef(true);
  const DatosDefecto = {
    estatus: true,
  };
  const Datos: any[] = [];
  const DatosMostrar: any[] = [];
  const SaldosPeriodo: any[] = [];

  const OptionsSucursal: any[] = [];

  const [state, setState] = React.useState({
    Habilitar: true,
    Datos,
    DatosMostrar,
    SaldosPeriodo,
    Filtro: "",
    nombre: "",
    Cargando: true,
    Error: false,
    Form: {
      Mostrar: false,
      Datos: DatosDefecto,
      Id: undefined,
    },

    OptionsSucursal,
  });

  //Funcion para obtener los datos generales
  const FNGetLocal = () => {
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNGetBalanzas(props.Seguridad)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          /*  respuesta.forEach((element: any) => {
                         if (element.Estatus === "A") {
                             element.Estatus = true
                         } else if (element.Estatus === "C") {
                             element.Estatus = false
                         }
                         if (element.ReAbierto === 1) {
                             element.ReAbierto = true
                         } else if (element.ReAbierto === 0) {
                             element.ReAbierto = false
                         }
                     });
  */
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

  /*  const FNIniciarPeriodos = () => {
         setState(s => ({ ...s, Cargando: true }))
         Funciones.FNIniciarPeriodos(props.Seguridad)
             .then((respuesta: any) => {
                 if (isMounted.current === true) {
                     FNGetLocal()
                 }
             })
             .catch(() => {
                 if (isMounted.current === true) {
                     setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                 }
             })
     } */
  //Funcion para obtener los datos generales y cargar la pantalla
  const FNGetDatos = () => {
    setState((s) => ({ ...s, Cargando: false }));
    Funciones.FNGetBalanzas(props.Seguridad)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          /*   respuesta.forEach((element: any) => {
                          if (element.Estatus === "A") {
                              element.Estatus = true
                          } else if (element.Estatus === "C") {
                              element.Estatus = false
                          }
                          if (element.ReAbierto === 1) {
                              element.ReAbierto = true
                          } else if (element.ReAbierto === 0) {
                              element.ReAbierto = false
                          }
                      }); */
          setState((s) => ({ ...s, Datos: respuesta }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, Datos: [] }));
        }
      });
  };

  const Columns: IDataTableColumn[] = [
    {
      name: "Producto",
      selector: "Producto",
      sortable: false,
      center: true,
      wrap: true,
      cell: (props) =>
        props.Producto == null ? (
          <span>Usuario no definido</span>
        ) : (
          <span>{props.Producto} </span>
        ),
    },
    {
      name: "Captura",
      selector: "FechaCaptura",
      sortable: false,
      center: true,
      wrap: true,
      cell: (propss) =>
        moment(propss.FechaCaptura, "YYYY-MM-DD").format("DD / MM / YYYY"),
    },
    {
      name: "Fecha Inicio",
      selector: "FechaInicio",
      sortable: false,
      center: true,
      wrap: true,
      cell: (propss) =>
        moment(propss.FechaInicio, "YYYY-MM-DD").format("DD / MM / YYYY"),
    },

    {
      name: "Fecha Fin",
      selector: "FechaFin",
      sortable: false,
      center: true,
      wrap: true,
      cell: (propss) =>
        moment(propss.FechaFin, "YYYY-MM-DD").format("DD / MM / YYYY"),
    },

    {
      name: "Realiza",
      selector: "UsuarioRealiza",
      sortable: false,
      center: true,
      wrap: true,
      cell: (props) => <span>{props.UsuarioRealiza} </span>,
    },
    {
      name: "Acciones",
      sortable: false,
      center: true,
      wrap: true,
      width: "15%",
      style: { display: "block;" },
      cell: (propss) => (
        <div
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
          className="text-center"
        >
          <div></div>
          <button
            data-tip
            data-for={`btnVer_cierre${propss.BalanzaID}`}
            style={{
              margin: ".15em",
              width: "15%",
              height: "40px",
              padding: "0px",
              tableLayout: "fixed",
              borderCollapse: "collapse",
            }}
            className="btn btn-outline-default"
            type={"button"}
            onClick={() => {
              reImprimiBalance(propss.BalanzaID);
            }}
          >
            <FaPrint />
            <ReactTooltip
              id={`btnVer_cierre${propss.BalanzaID}`}
              type="info"
              effect="solid"
            >
              RE-IMPRIMIR BALANZA
            </ReactTooltip>
          </button>
        </div>
      ),
    },
  ];

  React.useEffect(() => {
    FNGetLocal();
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
  const reAbiertoLabel = (reabierto) => {
    if (reabierto) {
      return (
        <label style={{ color: "orange", marginBottom: "0px" }}>
          Re-Abierto
        </label>
      );
    } else {
      return (
        <label style={{ color: "green", marginBottom: "0px" }}>Abierto</label>
      );
    }
  };

  const reImprimiBalance = (balanzaID) => {
    const MySwal = withReactContent(Swal);

    let timerInterval;
    MySwal.fire({
      icon: "info",
      html: (
        <div>
          <br />
          <h3 className="text-center">Aviso</h3>
          <div className={`modal-body`}>
            <h5 className="text-center">Reimprimiendo balanza.</h5>
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
    let datos = {
      BalanzaID: balanzaID,
      incMovs: 1,
      incDetalle: 1,
    };
    Funciones.FNImprimirBalanza(props.Seguridad, datos)
      .then((respuesta: any) => {
        if (isMounted.current == true) {
          //setLoading(false)
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
          MySwal.close();
        }

        //sprops.cbGuardar(respuesta)
      })
      .catch((error: any) => {
        if (isMounted.current == true) {
          toast.error("Error al generar el PDF");
        }
      });
  };

  const cbActualizar = (item: any) => {
    setState((state) => ({
      ...state,
      Datos: state.Datos.map((Dato) =>
        Dato.PeriodoID === item.PeriodoID ? item : Dato
      ),
    }));
    let index = state.Datos.findIndex((res: any) => {
      return res.value === item.PeriodoID;
    });
  };

  /** funcion para cancelar la forma */
  const fnCancelar = () =>
    setState({ ...state, Form: { ...state.Form, Mostrar: false } });
  return (
    <div className="row">
      <div className="col-12">
        <Card Title="Balanzas Generadas">
          <Card.Body>
            <Card.Body.Content>
              {state.Cargando && <Spinner />}
              {state.Error && <span>Error al cargar los datos...</span>}
              {!state.Cargando && !state.Error && (
                <div>
                  <DataTable
                    subHeader
                    defaultSortField="FechaCaptura"
                    defaultSortAsc={false}
                    noDataComponent={"Sin balanzas generadas."}
                    subHeaderComponent={
                      <div className="row">
                        <div className="col-sm-12">
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Buscar balanza"
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
                    keyField={"BalanzaID"}
                    columns={Columns}
                  />
                  <ModalWin
                    large={false}
                    scrollable={true}
                    open={state.Form.Mostrar}
                  >
                    <ModalWin.Header>
                      <h5 className={MODAL_TITLE_CLASS}>
                        Editar periodo
                        {/* {state.Form.Id ? "Editar Caja" : "Agregar Caja"} */}
                      </h5>
                    </ModalWin.Header>
                    <ModalWin.Body>
                      <CForm
                        Seguridad={props.Seguridad}
                        initialValues={state.Form.Datos}
                        Id={state.Form.Id}
                        cbActualizar={cbActualizar}
                        fnCancelar={fnCancelar}
                      />
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
  Seguridad: state.oidc,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CatalogoCaja);
