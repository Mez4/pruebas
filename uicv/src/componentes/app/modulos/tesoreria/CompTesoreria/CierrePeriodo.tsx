import React from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import * as Funciones from "./CierrePeriodo/Funciones";
import * as Funciones2 from "../CompTesoreria/Balances/Funciones";
import { toast } from "react-toastify";

import moment from "moment";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Icons
import { FaPencilAlt, FaSearch } from "react-icons/fa";
import { FaLockOpen, FaFileInvoice, FaLock, FaPrint } from "react-icons/fa";

// Custom components
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";
import { Card, Spinner } from "../../../../global";
import { CForm } from "./CierrePeriodo/CForm";
import { CFormSaldos } from "./CierrePeriodo/CFormSaldos";
import { FiRefreshCcw } from "react-icons/fi";
import { FiltrarDatos } from "../../../../../global/functions";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";

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
    Funciones.FNGet(props.Seguridad)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          respuesta.forEach((element: any) => {
            if (element.Estatus === "A") {
              element.Estatus = true;
            } else if (element.Estatus === "C") {
              element.Estatus = false;
            }
            if (element.ReAbierto === 1) {
              element.ReAbierto = true;
            } else if (element.ReAbierto === 0) {
              element.ReAbierto = false;
            }
          });

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

  const FNIniciarPeriodos = () => {
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNIniciarPeriodos(props.Seguridad)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          FNGetLocal();
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, Cargando: false, Error: true, Datos: [] }));
        }
      });
  };
  //Funcion para obtener los datos generales y cargar la pantalla
  const FNGetDatos = () => {
    setState((s) => ({ ...s, Cargando: false }));
    Funciones.FNGet(props.Seguridad)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          respuesta.forEach((element: any) => {
            if (element.Estatus === "A") {
              element.Estatus = true;
            } else if (element.Estatus === "C") {
              element.Estatus = false;
            }
            if (element.ReAbierto === 1) {
              element.ReAbierto = true;
            } else if (element.ReAbierto === 0) {
              element.ReAbierto = false;
            }
          });
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
    { name: "Ejercicio", selector: "Ejercicio", sortable: true, center: true },
    {
      name: "Apertura",
      selector: "FechaApertura",
      sortable: true,
      center: true,
      cell: (propss) =>
        moment(propss.FechaApertura, "YYYY-MM-DD").format("DD / MM / YYYY"),
    },
    {
      name: "Cierre",
      selector: "FechaCierre",
      sortable: true,
      cell: (props) => (
        <span>
          {props.PersonaCierre !== ""
            ? moment(props.FechaCierre, "YYYY-MM-DD").format("DD / MM / YYYY")
            : "Periodo aún no cerrado"}
        </span>
      ),
      center: true,
    },

    {
      name: "Numero Periodo",
      selector: "NumeroPeriodo",
      sortable: true,
      center: true,
      width: "4%",
    },
    { name: "Producto", selector: "Agrupacion", sortable: true, center: true },

    {
      name: "Dias Gracia",
      selector: "DiasGracia",
      sortable: true,
      center: true,
      width: "4%",
    },

    {
      name: "Estatus",
      selector: "Estatus",
      sortable: true,
      center: true,
      cell: (propss) => (
        <span>
          {propss.Estatus !== false ? (
            reAbiertoLabel(propss.ReAbierto)
          ) : (
            <label style={{ color: "red", marginBottom: "0px" }}>Cerrado</label>
          )}
        </span>
      ),
    },
    {
      name: "Persona Abre",
      selector: "PersonaApertura",
      sortable: true,
      center: true,
      cell: (props) => <span>{props.PersonaApertura} </span>,
    },
    {
      name: "Persona Cierra",
      selector: "PersonaCierre",
      sortable: true,
      cell: (props) => (
        <span>
          {props.PersonaCierre !== ""
            ? props.PersonaCierre
            : "Periodo aún no cerrado"}
        </span>
      ),
      center: true,
    },

    {
      name: "Acciones",
      sortable: false,
      center: false,
      width: "15%",
      style: { display: "block;" },
      cell: (propss) => (
        <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
          {!propss.Estatus && (
            <>
              <button
                data-tip
                data-for="btnVer_1"
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
                  reAbrirPeriodo(propss.PeriodoID, propss.Agrupacion);
                }}
              >
                <FaLockOpen />
                <ReactTooltip id="btnVer_1" type="info" effect="solid">
                  RE-ABRIR PERIODO
                </ReactTooltip>
              </button>
            </>
          )}
          {propss.Estatus && (
            <>
              <button
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
              ></button>
            </>
          )}
          {!propss.Estatus && (
            <>
              <button
                data-tip
                data-for="btnVer_saldos"
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
                  verSaldosPeriodo(propss.PeriodoID);
                }}
              >
                <FaFileInvoice />
                <ReactTooltip id="btnVer_saldos" type="info" effect="solid">
                  VER SALDOS DE CIERRE
                </ReactTooltip>
              </button>
            </>
          )}
          {propss.Estatus && (
            <>
              <button
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
              ></button>
            </>
          )}
          <>
            <button
              data-tip
              data-for="btnVer_3"
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
                editarDiasGracia(propss.DiasGracia, propss.PeriodoID);
              }}
            >
              <FaPencilAlt />
            </button>
            <ReactTooltip id="btnVer_3" type="info" effect="solid">
              EDITAR DIAS DE GRACIA
            </ReactTooltip>
          </>
          {!propss.Estatus && (
            <>
              <button
                data-tip
                data-for="btnVer_cierre"
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
                  reImprimiBalance(propss.PeriodoID);
                }}
              >
                <FaPrint />
                <ReactTooltip id="btnVer_cierre" type="info" effect="solid">
                  RE-IMPRIMIR CIERRE
                </ReactTooltip>
              </button>
            </>
          )}
          {propss.Estatus && (
            <>
              <button
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
              ></button>
            </>
          )}
          {propss.ReAbierto && (
            <>
              <button
                data-tip
                data-for="btnVer_1"
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
                  cerrarPeriodo(propss.PeriodoID, propss.Agrupacion);
                }}
              >
                <FaLock />
                <ReactTooltip id="btnVer_1" type="info" effect="solid">
                  CERRAR PERIODO
                </ReactTooltip>
              </button>
            </>
          )}
          {!propss.ReAbierto && (
            <button
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
            ></button>
          )}
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

  const reImprimiBalance = (periodo) => {
    const MySwal = withReactContent(Swal);

    let timerInterval;
    MySwal.fire({
      icon: "info",
      html: (
        <div>
          <br />
          <h3 className="text-center">Aviso</h3>
          <div className={`modal-body`}>
            <h5 className="text-center">Reimprimiendo balance.</h5>
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
      PeriodoID: periodo,
    };
    Funciones.FNImprimirBalance(props.Seguridad, datos)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          Funciones2.FNImprimir(props.Seguridad, respuesta)
            .then((respuesta: any) => {
              if (isMounted.current === true) {
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
              if (isMounted.current === true) {
                toast.error("Error al generar el PDF");
                // alert("Error al guardar los parametros" + JSON.stringify(error))
              }
            });
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, Datos: SaldosPeriodo }));
        }
      });
    console.log("SALDOS", state.SaldosPeriodo);
  };

  const verSaldosPeriodo = (periodo) => {
    const MySwal = withReactContent(Swal);

    let timerInterval;
    MySwal.fire({
      icon: "info",
      html: (
        <div>
          <br />
          <h3 className="text-center">Aviso</h3>
          <div className={`modal-body`}>
            <h5 className="text-center">Obteniendo saldos.</h5>
          </div>
        </div>
      ),
      timerProgressBar: true,
      confirmButtonText: `Ok`,
      timer: 500,
      didOpen: () => {
        MySwal.showLoading();
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });
    let datos = {
      PeriodoID: periodo,
    };
    Funciones.FNGetSaldosPeriodo(props.Seguridad, datos)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, SaldosPeriodo: respuesta }));
          console.log("RESPUESTA", respuesta);
          console.log("RESPUESTA", state.SaldosPeriodo);
          let tabla: any[] = [];

          let sumaSaldoSistema = 0;
          let sumaSaldoEdoCuenta = 0;
          let sumaDiferencia = 0;

          respuesta.forEach((element: any) => {
            let detalleSaldos: any = {
              BalanceResumenID: element.BalanceResumenID,
              BalanceID: element.BalanceID,
              CtaBancaria: element.CtaBancaria,
              CtaContable: element.CtaContable,
              SaldoSistema: element.SaldoSistema,
              SaldoEdoCuenta: element.SaldoEdoCuenta,
              Diferencia: element.Diferencia,
            };
            tabla.push(detalleSaldos);
          });
          tabla.forEach((element) => {
            sumaSaldoSistema += element.SaldoSistema;
            sumaSaldoEdoCuenta += element.SaldoEdoCuenta;
            sumaDiferencia += element.Diferencia;
          });
          let detallePoliza: any = {
            BalanceResumenID: -1,
            CtaContable: "Total",
            SaldoSistema: sumaSaldoSistema,
            SaldoEdoCuenta: sumaSaldoEdoCuenta,
            Diferencia: sumaDiferencia,
          };
          tabla.push(detallePoliza);
          MySwal.fire({
            width: "75%",
            showCloseButton: true,
            html: (
              <div>
                <div className="modal-header">
                  <h5 className="modal-title">Saldos del periodo</h5>
                </div>
                <div className={`modal-body`}>
                  <CFormSaldos DatosSaldos={tabla} />
                </div>
              </div>
            ),
            showCancelButton: false,
            showConfirmButton: false,
          });
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, Datos: SaldosPeriodo }));
        }
      });
    console.log("SALDOS", state.SaldosPeriodo);
  };
  const cerrarPeriodo = (periodo, nombre) => {
    const MySwal = withReactContent(Swal);

    MySwal.fire({
      icon: "warning",
      html: (
        <div>
          <br />
          <h3 className="text-center">Aviso</h3>
          <div className={`modal-body`}>
            <h5 className="text-center">
              ¿Cerrar el periodo {nombre} con ID: {periodo}?
            </h5>
          </div>
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: `Ok`,
    }).then((result) => {
      if (result.isConfirmed) {
        let datos = {
          PeriodoID: periodo,
        };
        Funciones.FNCerrarPeriodo(props.Seguridad, datos)
          .then((respuesta: any) => {
            if (isMounted.current === true) {
              if (respuesta.Estatus === 1) {
                MySwal.fire({
                  icon: "success",
                  html: (
                    <div>
                      <br />
                      <h3 className="text-center">Información</h3>
                      <div className={`modal-body`}>
                        <h5 className="text-center">
                          Periodo cerrado correctamente
                        </h5>
                      </div>
                    </div>
                  ),
                  showCancelButton: false,
                  confirmButtonText: `Ok`,
                });
                if (respuesta.Periodo.Estatus === "A") {
                  respuesta.Periodo.Estatus = true;
                } else if (respuesta.Periodo.Estatus === "C") {
                  respuesta.Periodo.Estatus = false;
                }
                if (respuesta.Periodo.ReAbierto === 1) {
                  respuesta.Periodo.ReAbierto = true;
                } else if (respuesta.Periodo.ReAbierto === 0) {
                  respuesta.Periodo.ReAbierto = false;
                }
                cbActualizar(respuesta.Periodo);
              }
            }
          })
          .catch(() => {
            if (isMounted.current === true) {
              MySwal.fire({
                icon: "error",
                html: (
                  <div>
                    <br />
                    <h3 className="text-center">Información</h3>
                    <div className={`modal-body`}>
                      <h5 className="text-center">
                        Ocurrió un problema el cerrar el periodo.
                      </h5>
                    </div>
                  </div>
                ),
                showCancelButton: false,
                confirmButtonText: `Ok`,
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
          confirmButtonText: `Ok`,
        });
      }
    });
  };

  const editarDiasGracia = (dias, periodo) => {
    console.log("DESDE SWAL", state);
    const MySwal = withReactContent(Swal);

    MySwal.fire({
      icon: "info",
      title: "Editar días de gracia",
      input: "number",
      inputLabel: "Ingresa un valor",
      inputPlaceholder: "Ingresa los días de gracia",
      inputAutoTrim: true,
      inputAttributes: {
        max: "30",
      },
      inputValue: dias,
      showCancelButton: false,
      confirmButtonText: "Ok",
      showLoaderOnConfirm: true,
      showCloseButton: true,
      validationMessage: "El máximo de días es 30.",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        let datos = {
          PeriodoID: periodo,
          DiasGracia: result.value,
        };
        Funciones.FNEditarDias(props.Seguridad, datos)
          .then((respuesta: any) => {
            if (isMounted.current === true) {
              if (respuesta.Estatus === 1) {
                MySwal.fire({
                  icon: "success",
                  html: (
                    <div>
                      <br />
                      <h3 className="text-center">Información</h3>
                      <div className={`modal-body`}>
                        <h5 className="text-center">
                          Dias de gracia actualizados correctament.e
                        </h5>
                      </div>
                    </div>
                  ),
                  showCancelButton: false,
                  confirmButtonText: `Ok`,
                });
                if (respuesta.Periodo.Estatus === "A") {
                  respuesta.Periodo.Estatus = true;
                } else if (respuesta.Periodo.Estatus === "C") {
                  respuesta.Periodo.Estatus = false;
                }
                if (respuesta.Periodo.ReAbierto === 1) {
                  respuesta.Periodo.ReAbierto = true;
                } else if (respuesta.Periodo.ReAbierto === 0) {
                  respuesta.Periodo.ReAbierto = false;
                }
                cbActualizar2(respuesta.Periodo);
              }
            }
          })
          .catch(() => {
            if (isMounted.current === true) {
              MySwal.fire({
                icon: "error",
                html: (
                  <div>
                    <br />
                    <h3 className="text-center">Información</h3>
                    <div className={`modal-body`}>
                      <h5 className="text-center">
                        Ocurrió un problema al actualizar los días de gracia.
                      </h5>
                    </div>
                  </div>
                ),
                showCancelButton: false,
                confirmButtonText: `Ok`,
              });
            }
          });
      }
    });
  };

  /** funcion Callback al agregar un item */
  const reAbrirPeriodo = (periodo, nombre) => {
    const MySwal = withReactContent(Swal);

    MySwal.fire({
      icon: "warning",
      html: (
        <div>
          <br />
          <h3 className="text-center">Aviso</h3>
          <div className={`modal-body`}>
            <h5 className="text-center">
              ¿Re-abrir el periodo de {nombre} con ID: {periodo} ?
            </h5>
          </div>
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: `Ok`,
    }).then((result) => {
      if (result.isConfirmed) {
        let datos = {
          PeriodoID: periodo,
        };
        Funciones.FNReAbrirPeriodo(props.Seguridad, datos)
          .then((respuesta: any) => {
            if (isMounted.current === true) {
              if (respuesta.Estatus === 1) {
                MySwal.fire({
                  icon: "success",
                  html: (
                    <div>
                      <br />
                      <h3 className="text-center">Información</h3>
                      <div className={`modal-body`}>
                        <h5 className="text-center">
                          Periodo abierto correctamente
                        </h5>
                      </div>
                    </div>
                  ),
                  showCancelButton: false,
                  confirmButtonText: `Ok`,
                });
                cbActualizar(respuesta.Periodo);
              } else if (respuesta.Estatus === 2) {
                MySwal.fire({
                  icon: "warning",
                  html: (
                    <div>
                      <br />
                      <h3 className="text-center">Información</h3>
                      <div className={`modal-body`}>
                        <h5 className="text-center">
                          Periodo no se puede abrir, excedió tiempo de gracia.
                        </h5>
                      </div>
                    </div>
                  ),
                  showCancelButton: false,
                  confirmButtonText: `Ok`,
                });
              } else {
                MySwal.fire({
                  icon: "warning",
                  html: (
                    <div>
                      <br />
                      <h3 className="text-center">Información</h3>
                      <div className={`modal-body`}>
                        <h5 className="text-center">
                          Ya existen dos periodos abiertos.
                        </h5>
                      </div>
                    </div>
                  ),
                  showCancelButton: false,
                  confirmButtonText: `Ok`,
                });
              }
              setState((s) => ({ ...s }));
            }
          })
          .catch(() => {
            if (isMounted.current === true) {
              MySwal.fire({
                icon: "error",
                html: (
                  <div>
                    <br />
                    <h3 className="text-center">Información</h3>
                    <div className={`modal-body`}>
                      <h5 className="text-center">
                        Ocurrió un problema al re-abrir el periodo.
                      </h5>
                    </div>
                  </div>
                ),
                showCancelButton: false,
                confirmButtonText: `Ok`,
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
          confirmButtonText: `Ok`,
        });
      }
    });
  };

  /** funcion Callback al actualizar un item */
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

  const cbActualizar2 = (item: any) => {
    setState((state) => ({
      ...state,
      Datos: state.Datos.map((Dato) =>
        Dato.PeriodoID === item.PeriodoID
          ? { ...Dato, DiasGracia: item.DiasGracia }
          : Dato
      ),
    }));
  };

  /** funcion para cancelar la forma */
  const fnCancelar = () =>
    setState({ ...state, Form: { ...state.Form, Mostrar: false } });
  return (
    <div className="row">
      <div className="col-12">
        <Card Title="Periodos Activos">
          <Card.Body>
            <Card.Body.Content>
              {state.Cargando && <Spinner />}
              {state.Error && <span>Error al cargar los datos...</span>}
              {!state.Cargando && !state.Error && (
                <div>
                  <DataTable
                    subHeader
                    noDataComponent={
                      <div className="row">
                        <div className="col-sm-8">
                          <label className="text-center">
                            No existen periodos registrados, ¿deseas
                            iniciarlizarlos?
                          </label>
                        </div>
                        <div className="col-sm-4">
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => FNIniciarPeriodos()}
                          >
                            <FiRefreshCcw />
                          </button>
                        </div>
                      </div>
                    } //or your component
                    subHeaderComponent={
                      <div className="row">
                        <div className="col-sm-12">
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Buscar periodo"
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
                            {/* <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                                        ><FaPlus /></button> */}
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
                    keyField={"PeriodoID"}
                    defaultSortField={"PeriodoID"}
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
