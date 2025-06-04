import React from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import * as Funciones from "./BalancesFinal/Funciones";
import DataTable, {
  createTheme,
  IDataTableColumn,
} from "react-data-table-component";
import { FormateoDinero } from "../../../../../global/variables";
import ReactTooltip from "react-tooltip";

// Icons
import {
  FaCheckCircle,
  FaEye,
  FaFileExcel,
  FaFilePdf,
  FaLongArrowAltDown,
} from "react-icons/fa";
// Custom components
import { Card, Spinner } from "../../../../global";
import { CForm } from "./Balances/CForm";
import { ErrorMessage, Field, Formik } from "formik";
import { Form } from "usetheform";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";

import axios from "axios";
import download from "downloadjs";
import { toast } from "react-toastify";
import {
  FaPencilAlt,
  FaPlus,
  FaSearch,
  FaCircle,
  FaTrash,
  FaPrint,
} from "react-icons/fa";
import { array } from "yargs";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Swal2 from "sweetalert2";
import withReactContent2 from "sweetalert2-react-content";

import XLSX from "xlsx";
import { iUI } from "../../../../../interfaces/ui/iUI";
import { boolean } from "yup";
import Movimientos from "./BalancesFinal/Movimientos";

type CatalogosType = {
  oidc: IOidc;
  iUI: iUI;
  Detalle: boolean;
};

const Balance = (props: CatalogosType) => {
  let isMounted = React.useRef(true);
  const opPeriodos: any[] = [];
  const Datos: any[] = [];
  const DatosCopy: any[] = [];
  const Datos2: any[] = [];
  const Datos3: any[] = [];
  const Datos4: any[] = [];
  const CuentasSeleccionadas: any[] = [];
  const ProductosSeleccionados: any[] = [];
  const DatosSeleccionados2: any[] = [];
  const DatosSaldoBoveda = {
    billetes: "",
    monedas: "",
    total: "",
    fecha: new Date(),
  };

  const [state, setState] = React.useState({
    ProductoVID: 0,
    CheckedAbierto: true,
    CheckedCerrados: false,
    HabilitarDetalle: true,
    Filtro1: true,
    Filtro2: false,
    Filtro3: false,
    Datos,
    Datos2,
    Datos3,
    DatosCopy,
    DatosInitial: {
      incMovs: 0,
      incDetalle: 0,
    },
    BalanceTemporalID: 0,
    rowsProductosSeleccionables: true,
    rowsCuentasSeleccionables: true,
    Datos4,
    reAbierto: false,
    ProductosSeleccionados,
    DatosSeleccionados2,
    CuentasSeleccionadas,
    BalanceProductoID: 0,
    PeriodoSeleccionadoID: 0,
    EstatusPeriodo: "A",
    SwalMostrado: false,
    Datos3F: false,
    Datos4F: false,
    primeraVez: false,
    Datos2F: false,
    Filtro: "",
    Cargando: false,
    Error: false,
    Cargando2: false,
    Error2: false,
    Cargando3: false,
    Error3: false,
    Form: {
      MostrarModal2: false,
      Mostrar: false,
      Id: undefined,
      CuentaBancoID: undefined,
    },
    estatusPeriodo: "",
    estatusMostrar: true,
    opPeriodos,
    DatosSaldoBoveda,
    periodoID: 0,
    tipoMovID: 0,
    productoID: 0,
    cuentaBancoID: 0,
    agrupacionID: 0,
    cuentaBanco: "",
    producto: "",
    movimiento: "",
    esReporteCuenta: 0,
    Detalle: false,
  });
  const styles = {
    h3Cerrado: {
      color: "red",
    },
    h3Abierto: {
      color: "green",
    },
    div3: {
      marginLeft: "3%",
      marginTop: "5px",
      marginBotom: "15px",
      borderLeftWidth: "8px",
      borderTopWidth: "8px",
      borderTop: "4px solid gray",
    },
    div: {
      marginLeft: "6%",
      marginTop: "5px",
      marginBotom: "15px",
      borderLeftWidth: "8px",
      borderTopWidth: "8px",
      borderTop: "4px solid gray",
    },
    div2: {
      marginLeft: "9%",
      marginTop: "5px",
      marginBotom: "15px",
      borderLeftWidth: "8px",
      borderTopWidth: "8px",
      borderTop: "4px solid gray",
    },
  };

  const imprimirBalance = () => {
    const MySwal = withReactContent(Swal);

    let timerInterval;
    MySwal.fire({
      icon: "info",
      html: (
        <div>
          <br />
          <h3 className="text-center">Aviso</h3>
          <div className={`modal-body`}>
            <div className="row text-center">
              <span className="text-center">
                <h4>Imprimiendo balance.</h4>
              </span>
              <br />
              <span className="text-center">
                <h4>
                  <strong>Por favor espera</strong>
                </h4>
              </span>
            </div>
          </div>
        </div>
      ),
      timerProgressBar: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonText: `Ok`,
      didOpen: () => {
        MySwal.showLoading();
      },
      didClose() {
        MySwal.hideLoading();
      },
    });

    let accion = 0;

    if (
      state.Filtro1 == true &&
      state.Filtro2 == false &&
      state.Filtro3 == false
    ) {
      accion = 1;
    }
    if (
      state.Filtro1 == false &&
      state.Filtro2 == true &&
      state.Filtro3 == false
    ) {
      accion = 2;
    }
    if (
      state.Filtro1 == false &&
      state.Filtro2 == false &&
      state.Filtro3 == true
    ) {
      accion = 3;
    }

    let nombreBalance = {
      value: 0,
      label: "",
    };
    //IF Periodos Abiertos
    if (state.CheckedAbierto == true && state.CheckedCerrados == false) {
      nombreBalance = state.opPeriodos.find((res: any) => {
        return res.value === state.periodoID;
      });
    } else {
      Funciones.FNGetNombreBalance(props.oidc, state.BalanceTemporalID)
        .then((respuesta: any) => {
          if (isMounted.current == true) {
            nombreBalance = {
              value: 0,
              label: respuesta,
            };
          }
        })
        .catch((error: any) => {
          if (isMounted.current == true) {
            toast.error("Ha occurido un problema");
          }
        });
    }

    let datos = {
      Accion: accion,
      BalanceIDTemp: state.BalanceTemporalID,
      NombreBalance: nombreBalance.label,
      PeriodoID: state.periodoID,
      BalanceSeleccionado: 0
    };

    console.log("DATOS PDFAAAAAAAAAAAAA ,", datos);

    Funciones.FNImprimirBalance(props.oidc, datos)
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
      })
      .catch((error: any) => {
        if (isMounted.current == true) {
          toast.error("Error al generar el PDF");
          // alert("Error al guardar los parametros" + JSON.stringify(error))
        }
        MySwal.close();
      });
  };

  const cerrarBalance = () => {
    //se va a generar el pdf aqui
    if (state.periodoID !== 0) {
      if (state.estatusPeriodo == "A") {
        console.log("PERIODO ID", state.periodoID);
        MySwal2.fire({
          icon: "warning",
          html: (
            <div>
              <br />
              <h3 className="text-center">Aviso</h3>
              <div className={`modal-body`}>
                <h5 className="text-center">
                  Estás a punto de cerrar el balance, acciòn no reversible. El
                  periodo se cerrará y sólo un usuario autorizado podra abrirlo
                  nuevamente.
                </h5>
              </div>
            </div>
          ),
          showCancelButton: true,
          confirmButtonText: `Ok`,
        }).then((result) => {
          if (result.isConfirmed) {
            let datosG = {
              periodoId: state.periodoID,
              ctaBanco: 0,
              producto: 0,
              tipoMovimiento: 0,
              BalanceIDTemp: state.BalanceTemporalID,
              accion: 4,
            };
            Funciones.FNCerrarBalance2(props.oidc, datosG)
              .then((respuesta: any) => {
                respuesta.map((res: any) => {
                  if (res.MensajeID == "0") {
                    MySwal2.fire({
                      icon: "success",
                      html: (
                        <div>
                          <br />
                          <h3 className="text-center">Balance cerrado</h3>
                          <div className={`modal-body`}>
                            <h5 className="text-center">{res.Mensaje}</h5>
                          </div>
                        </div>
                      ),
                      showCancelButton: false,
                      confirmButtonText: `Ok`,
                    });
                    setState((s) => ({ ...s, estatusPeriodo: "C" }));
                    FNGetPeriodos("A", props.iUI.Producto?.ProductoID);
                  } else {
                    MySwal2.fire({
                      icon: "warning",
                      html: (
                        <div>
                          <br />
                          <h3 className="text-center">Info</h3>
                          <div className={`modal-body`}>
                            <h5 className="text-center">{res.Mensaje}</h5>
                          </div>
                        </div>
                      ),
                      showCancelButton: false,
                      confirmButtonText: `Ok`,
                    });
                  }
                });
              })
              .catch((err) => {
                toast.error(err);
              });
            let timerInterval;
            MySwal2.fire({
              icon: "info",
              html: (
                <div>
                  <br />
                  <h3 className="text-center">Aviso</h3>
                  <div className={`modal-body`}>
                    <h5 className="text-center">Cerrando balance y periodo.</h5>
                  </div>
                </div>
              ),
              timerProgressBar: true,
              confirmButtonText: `Ok`,
              timer: 500,
              didOpen: () => {
                MySwal2.showLoading();
              },
              willClose: () => {
                clearInterval(timerInterval);
              },
            });
          } else {
            MySwal2.fire({
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
      } else {
        MySwal2.fire({
          icon: "info",
          html: (
            <div>
              <br />
              <h3 className="text-center">Aviso</h3>
              <div className={`modal-body`}>
                <h5 className="text-center">
                  El periodo ya se encuentra cerrado.
                </h5>
              </div>
            </div>
          ),
          confirmButtonText: `Ok`,
        });
      }
    } else {
      MySwal2.fire({
        allowOutsideClick: false,
        icon: "warning",
        html: (
          <div>
            <br />
            <h3 className="text-center">Aviso</h3>
            <div className={`modal-body`}>
              <h5 className="text-center">Primero selecciona un periodo.</h5>
            </div>
          </div>
        ),
        confirmButtonText: `Ok`,
      });
    }
  };
  const periodoReabierto = () => {
    if (state.reAbierto) {
      return <h3 style={{ color: "orange" }}>Periodo Re-Abierto</h3>;
    } else {
      return <h3 style={styles.h3Abierto}>Periodo Abierto</h3>;
    }
  };

  const MySwal = withReactContent(Swal);

  const MySwal2 = withReactContent2(Swal2);

  const FNGetPeriodos = (estatusRecibido: string, productoID?: any) => {
    var EstatusEnviado = estatusRecibido.toUpperCase();

    Funciones.FNGetPeriodo(props.oidc, estatusRecibido, productoID)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          if (EstatusEnviado === "A") {
            var periodos = respuesta.map((valor: any) => {
              var obj = { value: valor.periodoID, label: valor.periodo };
              return obj;
            });
            setState((s) => ({ ...s, opPeriodos: periodos }));
          } else {
            var periodos = respuesta.map((valor: any) => {
              var obj = {
                value: valor.BalanceTempID,
                label: valor.NombreBalance,
              };
              return obj;
            });
            setState((s) => ({ ...s, opPeriodos: periodos }));
          }
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, opPeriodos: [] }));
        }
      });
  };

  const Columns: IDataTableColumn[] = [
    {
      name: "TipoCuenta",
      selector: "TipoCuenta",
      sortable: false,
      center: true,
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "NumeroCuenta",
      center: true,

      selector: "NumeroCuenta",
      sortable: false,
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "DescripcionCuenta",
      selector: "DescripcionCuenta",
      sortable: false,
      center: true,
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Total",
      selector: "Total",
      sortable: false,
      center: true,

      cell: (propss) => FormateoDinero.format(propss.Total),
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "SaldoActual ",
      center: true,

      selector: "SaldoActual",
      sortable: false,
      cell: (propss) => FormateoDinero.format(propss.SaldoActual),
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "SaldoCierreAnterior",
      center: true,

      selector: "SaldoCierreAnterior",
      sortable: false,
      cell: (propss) => FormateoDinero.format(propss.SaldoCierreAnterior),
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
  ];

  const Columns2: IDataTableColumn[] = [
    {
      name: "Nombre Caja",
      selector: "CajaNombre",
      sortable: false,
      center: true,
      cell: (propss) =>
        propss.SaldoActual == -1 ? (
          <span>-</span>
        ) : (
          <span className="text-center">{propss.CajaNombre}</span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
        {
          when: (row) => row.CajaNombre == undefined,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },

    {
      name: "Tipo de cuenta",
      selector: "TipoCuenta",
      sortable: false,
      center: true,
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Nro. de Cta. P.",
      center: true,

      selector: "NumeroCuenta",
      sortable: false,
      cell: (propss) => (
        <span className="text-center">{propss.NumeroCuenta}</span>
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Desc. de Cta. P.",
      selector: "DescripcionCuenta",
      sortable: false,
      center: true,
      //cell
      cell: (propss) => (
        <span className="text-center">{propss.DescripcionCuenta}</span>
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Nro. de Cta. P.",
      center: true,

      selector: "NumeroCuentaF",
      sortable: false,
      cell: (propss) => (
        <span className="text-center">{propss.NumeroCuentaF}</span>
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Desc. de Cta. F.",
      selector: "DescripcionCuentaF",
      sortable: false,
      center: true,
      cell: (propss) => (
        <span className="text-center">{propss.DescripcionCuentaF}</span>
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Tipo Mov.",
      selector: "TipoMovimiento",
      sortable: false,
      center: true,
      cell: (propss) =>
        propss.MovimientoEntSal ? (
          <span
            className="text-center"
            style={{ textAlign: "center", fontWeight: "bold" }}
          >
            {" "}
            {propss.Total < 0 ? (
              <span className="text-center" style={{ color: "red" }}>
                {propss.TipoMovimiento}
              </span>
            ) : (
              <span className="text-center" style={{ color: "green" }}>
                {" "}
                {propss.TipoMovimiento}
              </span>
            )}
          </span>
        ) : (
          <span className="text-center">{propss.TipoMovimiento}</span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Saldo Aceptado",
      selector: "Total",
      sortable: false,
      center: true,
      cell: (propss) => (
        <span className="text-center">
          {FormateoDinero.format(propss.Total)}
        </span>
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Saldo Anterior",
      selector: "SaldoCierreAnterior",
      sortable: false,
      center: true,
      cell: (propss) =>
        propss.MovimientoEntSal ? (
          <span>—</span>
        ) : (
          <span className="text-center">
            {FormateoDinero.format(propss.SaldoCierreAnterior)}
          </span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Saldo Actual",
      selector: "SaldoActual",
      sortable: false,
      center: true,
      cell: (propss) =>
        propss.MovimientoEntSal ? (
          <span>—</span>
        ) : (
          <span className="text-center">
            {" "}
            {FormateoDinero.format(propss.SaldoActual)}
          </span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Acción",
      selector: "Movimientos",
      sortable: false,
      wrap: true,
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
      cell: (data) =>
        data.NumeroCuenta == "" ? (
          <span></span>
        ) : (
          <div
            style={{ width: "25%", overflowX: "auto", whiteSpace: "nowrap" }}
          >
            <button
              title="Detalle"
              data-tip
              data-for="Detail"
              className="asstext"
              type={"button"}
              onClick={() => {
                setState((s) => ({
                  ...s,
                  Detalle: true,
                  Form: {
                    ...s.Form,
                    CuentaBancoID: data.CuentaBancoID,
                  },
                }));
                console.log("cuentaBancoID:", data.CuentaBancoID);
              }}
            >
              <FaEye />
            </button>
            <ReactTooltip
              id="Detail"
              type="info"
              effect="solid"
              clickable
              globalEventOff="click"
            >
              Ver Movimientos
            </ReactTooltip>
          </div>
        ),
    },
  ];
  const Columns3: IDataTableColumn[] = [
    {
      name: "Nro. de Cta. P.",
      selector: "NumeroCuenta",
      sortable: false,
      center: true,
      cell: (propss) => (
        <span className="text-center">{propss.NumeroCuenta}</span>
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },

    {
      name: "Desc. de Cta. P.",
      selector: "DescripcionCuenta",
      sortable: false,
      center: true,
      cell: (propss) => (
        <span className="text-center">{propss.DescripcionCuenta}</span>
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Nro. de Cta. P.",
      center: true,
      selector: "NumeroCuentaF",
      sortable: false,
      cell: (propss) => (
        <span className="text-center">{propss.NumeroCuentaF}</span>
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Desc. de Cta. F.",
      selector: "DescripcionCuentaF",
      sortable: false,
      center: true,
      cell: (propss) => (
        <span className="text-center">{propss.DescripcionCuentaF}</span>
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Nombre Caja",
      selector: "CajaNombre",
      sortable: false,
      center: true,
      cell: (propss) => (
        <span className="text-center">{propss.CajaNombre}</span>
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Tipo de Movimiento",
      selector: "TipoMovimiento",
      sortable: false,
      center: true,
      cell: (propss) =>
        propss.MovimientoEntSal == true ? (
          <span
            className="text-center"
            style={{
              textAlign: "center",
              borderTop: "1px solid black",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            }}
          >
            {" "}
            {propss.TipoMovimiento}{" "}
          </span>
        ) : (
          <span className="text-center">{propss.TipoMovimiento}</span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Observaciones",
      selector: "Observaciones",
      sortable: false,
      center: true,
      cell: (propss) => (
        <span className="text-center">{propss.Observaciones}</span>
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },

    {
      name: "Importe",
      selector: "Importe",
      sortable: false,
      center: true,
      cell: (propss) => (
        <span className="text-center">
          {FormateoDinero.format(propss.Importe)}
        </span>
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    {
      name: "Número de Crédito",
      selector: "CreditoID",
      sortable: false,
      center: true,
      cell: (propss) => <span className="text-center">{propss.CreditoID}</span>,
      conditionalCellStyles: [
        {
          when: (row) => row.NumeroCuenta == "",
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
  ];

  React.useEffect(() => {
    if (isMounted.current === true) {
      if (props.iUI.Producto?.ProductoID != undefined) {
        console.log("PRODUCTO ACTUAL EN LA INTERFAZ ,", props.iUI.Producto);
        FNGetPeriodos("A", props.iUI.Producto.ProductoID);
      }
    }
    // eslint-disable-next-line
  }, [props.iUI.Producto?.ProductoID]);

  const ColumnsTable2: IDataTableColumn[] = [
    {
      name: "Cuenta Banco",
      selector: "CtaBanco",
      sortable: false,
      wrap: true,
      center: true,
    },

    {
      name: "Cuenta Contable",
      selector: "CtaContable",
      sortable: false,
      center: true,
      wrap: true,
    },
    {
      name: "Producto",
      selector: "Producto",
      sortable: false,
      center: true,
      wrap: true,
    },
    {
      name: "Saldo Sistema",
      selector: "SaldoSistema",
      sortable: false,
      center: true,
      wrap: true,
      cell: (propss) => FormateoDinero.format(propss.SaldoSistema),
    },
  ];

  const FNGetEstatusPeriodo2 = (id: any) => {
    setState((s) => ({ ...s, Cargando: true }));

    Funciones.FNGetEstatusPeriodo2(props.oidc, id)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          if (respuesta.ReAbierto == 1) {
            setState((s) => ({ ...s, reAbierto: true }));
          } else {
            setState((s) => ({ ...s, reAbierto: false }));
          }

          if (respuesta.Estatus == "C") {
            setState((s) => ({
              ...s,
              Cargando: false,
              Error: false,
              estatusPeriodo: respuesta.Estatus,
              estatusMostrar: false,
            }));
          } else {
            setState((s) => ({
              ...s,
              Cargando: false,
              Error: false,
              reAbierto: respuesta.ReAbierto,
              estatusPeriodo: respuesta.Estatus,
              estatusMostrar: false,
            }));
          }
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: true,
            estatusPeriodo: "Error",
            estatusMostrar: false,
          }));
        }
      });
  };

  const FNGenerarBalanceFiltro2 = (id?: any) => {
    let datosG2 = {
      periodoId: 0,
      ctaBanco: 0,
      producto: state.BalanceProductoID,
      tipoMovimiento: 0,
      BalanceIDTemp: state.BalanceTemporalID,
      accion: 3,
    };

    Funciones.FNGetGenerarBalance(props.oidc, datosG2)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          let tabla: any[] = [];
          let primero = true;
          let cuenta = "";
          let cuentaf = "";
          let totalImporte = 0;
          let totalSaldoActual = 0;
          let totalSaldoAnterior = 0;
          let posicion = 0;
          let cajaNombre = 0;
          respuesta.forEach((element) => {
            posicion = posicion + 1;
            if (primero) {
              let detalle: any = {
                TipoCuenta: element.TipoCuenta,
                NumeroCuenta: element.NumeroCuenta,
                DescripcionCuenta: element.DescripcionCuenta,
                NumeroCuentaF: element.NumeroCuentaF,
                CuentaBancoID: element.CuentaBancoID,
                DescripcionCuentaF: element.DescripcionCuentaF,
                CajaNombre: element.CajaNombre,
                TipoMovimiento: element.TipoMovimiento,
                SaldoCierreAnterior: element.SaldoCierreAnterior,
                Total: element.Total,
                SaldoActual: element.SaldoActual,
                MovimientoEntSal: element.MovimientoEntSal,
                Movimientos: element.Movimientos,
              };
              cuenta = element.NumeroCuenta;
              cuentaf = element.NumeroCuentaF;
              cajaNombre = element.CajaNombre;
              primero = false;
              tabla.push(detalle);
            } else {
              if (cuenta == element.NumeroCuenta) {
                let detalle: any = {
                  TipoCuenta: "—",
                  NumeroCuenta: "—",
                  DescripcionCuenta: "—",
                  CuentaBancoID: element.CuentaBancoID,
                  NumeroCuentaF: element.MovimientoEntSal
                    ? "—"
                    : element.NumeroCuentaF,
                  DescripcionCuentaF: element.MovimientoEntSal
                    ? "—"
                    : element.DescripcionCuentaF,
                  CajaNombre: element.MovimientoEntSal
                    ? "—"
                    : element.CajaNombre == cajaNombre
                      ? "—"
                      : element.CajaNombre,
                  TipoMovimiento: element.TipoMovimiento,
                  SaldoCierreAnterior: element.MovimientoEntSal
                    ? 0
                    : element.SaldoCierreAnterior,
                  Total: element.Total,
                  SaldoActual: element.SaldoActual,
                  MovimientoEntSal: element.MovimientoEntSal,
                  Movimientos: element.Movimientos,
                };
                tabla.push(detalle);
                cuenta = element.NumeroCuenta;

                if (posicion == respuesta.length) {
                  let filtro2 = respuesta.filter((valor: any) => {
                    return valor.NumeroCuenta == element.NumeroCuenta;
                  });
                  filtro2.forEach((element) => {
                    totalImporte = totalImporte + element.Total;
                    totalSaldoActual = totalSaldoActual + element.SaldoActual;
                    totalSaldoAnterior =
                      totalSaldoAnterior + element.SaldoCierreAnterior;
                  });

                  let detalle2: any = {
                    TipoCuenta: "",
                    NumeroCuenta: "",
                    DescripcionCuenta: "",
                    NumeroCuentaF: "",
                    DescripcionCuentaF: "",
                    CajaNombre: "",
                    TipoMovimiento: "Total",
                    SaldoCierreAnterior: totalSaldoAnterior,
                    Total: totalImporte,
                    SaldoActual: totalSaldoActual,
                    MovimientoEntSal: "",
                    Movimientos: "",
                  };
                  tabla.push(detalle2);

                  totalImporte = 0;
                  totalSaldoActual = 0;
                  totalSaldoAnterior = 0;

                  let totalTotalImporte = 0;
                  let totalTotalSaldoActual = 0;
                  let totalTotalSaldoAnterior = 0;

                  respuesta.forEach((element) => {
                    totalTotalImporte = totalTotalImporte + element.Total;
                    totalTotalSaldoActual =
                      totalTotalSaldoActual + element.SaldoActual;
                    totalTotalSaldoAnterior =
                      totalTotalSaldoAnterior + element.SaldoCierreAnterior;
                  });

                  let detalle3: any = {
                    TipoCuenta: "",
                    NumeroCuenta: "",
                    DescripcionCuenta: "",
                    NumeroCuentaF: "",
                    DescripcionCuentaF: "",
                    CajaNombre: "",
                    TipoMovimiento: "Suma Total",
                    SaldoCierreAnterior: totalTotalSaldoAnterior,
                    Total: totalTotalImporte,
                    SaldoActual: totalTotalSaldoActual,
                    MovimientoEntSal: "",
                    Movimientos: "",
                  };
                  tabla.push(detalle3);
                }
              } else {
                let filtro = respuesta.filter((valor: any) => {
                  return valor.NumeroCuenta == cuenta;
                });

                filtro.forEach((element) => {
                  totalImporte = totalImporte + element.Total;
                  totalSaldoActual = totalSaldoActual + element.SaldoActual;
                  totalSaldoAnterior =
                    totalSaldoAnterior + element.SaldoCierreAnterior;
                });
                // CHECAR PORQUE NO IMPRIME EL CREDITOID
                let detalle2: any = {
                  TipoCuenta: "",
                  NumeroCuenta: "",
                  DescripcionCuenta: "",
                  NumeroCuentaF: "",
                  DescripcionCuentaF: "",
                  CajaNombre: "",
                  TipoMovimiento: "Total",
                  SaldoCierreAnterior: totalSaldoAnterior,
                  Total: totalImporte,
                  SaldoActual: totalSaldoActual,
                  MovimientoEntSal: "",
                  Movimientos: "",
                };
                tabla.push(detalle2);
                totalImporte = 0;
                totalSaldoActual = 0;
                totalSaldoAnterior = 0;

                let detalle: any = {
                  TipoCuenta: element.TipoCuenta,
                  NumeroCuenta: element.NumeroCuenta,
                  DescripcionCuenta: element.DescripcionCuenta,
                  NumeroCuentaF: element.NumeroCuentaF,
                  CuentaBancoID: element.CuentaBancoID,
                  DescripcionCuentaF: element.DescripcionCuentaF,
                  CajaNombre:
                    element.CajaNombre == cajaNombre ? "—" : element.CajaNombre,
                  TipoMovimiento: element.TipoMovimiento,
                  SaldoCierreAnterior: element.SaldoCierreAnterior,
                  Total: element.Total,
                  SaldoActual: element.SaldoActual,
                  MovimientoEntSal: element.MovimientoEntSal,
                  Movimientos: element.Movimientos,
                  CreditoID: element.CreditoID,
                };
                tabla.push(detalle);
                if (posicion == respuesta.length) {
                  let filtro2 = respuesta.filter((valor: any) => {
                    return valor.NumeroCuenta == element.NumeroCuenta;
                  });
                  filtro2.forEach((element) => {
                    totalImporte = totalImporte + element.Total;
                    totalSaldoActual = totalSaldoActual + element.SaldoActual;
                    totalSaldoAnterior =
                      totalSaldoAnterior + element.SaldoCierreAnterior;
                  });

                  let detalle2: any = {
                    TipoCuenta: "",
                    NumeroCuenta: "",
                    DescripcionCuenta: "",
                    NumeroCuentaF: "",
                    DescripcionCuentaF: "",
                    CajaNombre: "",
                    TipoMovimiento: "Total",
                    SaldoCierreAnterior: totalSaldoAnterior,
                    Total: totalImporte,
                    SaldoActual: totalSaldoActual,
                    MovimientoEntSal: "",
                    Movimientos: "",
                  };
                  tabla.push(detalle2);

                  totalImporte = 0;
                  totalSaldoActual = 0;
                  totalSaldoAnterior = 0;

                  let totalTotalImporte = 0;
                  let totalTotalSaldoActual = 0;
                  let totalTotalSaldoAnterior = 0;

                  respuesta.forEach((element) => {
                    totalTotalImporte = totalTotalImporte + element.Total;
                    totalTotalSaldoActual =
                      totalTotalSaldoActual + element.SaldoActual;
                    totalTotalSaldoAnterior =
                      totalTotalSaldoAnterior + element.SaldoCierreAnterior;
                  });

                  let detalle3: any = {
                    TipoCuenta: "",
                    NumeroCuenta: "",
                    DescripcionCuenta: "",
                    NumeroCuentaF: "",
                    DescripcionCuentaF: "",
                    CajaNombre: "",
                    TipoMovimiento: "Suma Total",
                    SaldoCierreAnterior: totalTotalSaldoAnterior,
                    Total: totalTotalImporte,
                    SaldoActual: totalTotalSaldoActual,
                    MovimientoEntSal: "",
                    Movimientos: "",
                  };
                  tabla.push(detalle3);
                }
              }
              cuenta = element.NumeroCuenta;
            }
            cajaNombre = element.CajaNombre;
          });
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: false,
            Datos2: tabla,
            Cargando2: false,
          }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, Cargando: false, Error: true, Datos: [] }));
        }
      });
  };

  const FNGenerarBalanceFiltro3 = (id?: any) => {
    let datosG2 = {
      periodoId: 0,
      ctaBanco: 0,
      producto: 0,
      tipoMovimiento: 0,
      BalanceIDTemp: state.BalanceTemporalID,
      accion: 1,
    };

    Funciones.FNGetGenerarBalance(props.oidc, datosG2)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          let tabla: any[] = [];
          let primero = true;
          let cuenta = "";
          let totalImporte = 0;
          let posicion = 0;
          let totalTotal = 0;
          let cuentaf = "";

          respuesta.forEach((element) => {
            posicion = posicion + 1;
            if (primero) {
              let detalle: any = {
                NumeroCuenta: element.NumeroCuenta,
                DescripcionCuenta: element.DescripcionCuenta,
                NumeroCuentaF: element.NumeroCuentaF,
                DescripcionCuentaF: element.DescripcionCuentaF,
                CajaNombre: element.CajaNombre,
                TipoMovimiento: element.TipoMovimiento,
                Observaciones: element.Observaciones,
                Importe: element.Importe,
                CreditoID: element.CreditoID,
              };

              cuenta = element.NumeroCuenta;
              cuentaf = element.NumeroCuentaF;
              primero = false;

              tabla.push(detalle);
            } else {
              if (cuenta == element.NumeroCuenta) {
                let detalle: any = {
                  NumeroCuenta: "—",
                  DescripcionCuenta: "—",
                  NumeroCuentaF: element.MovimientoEntSal
                    ? "—"
                    : element.NumeroCuentaF,
                  DescripcionCuentaF: element.MovimientoEntSal
                    ? "—"
                    : element.DescripcionCuentaF,
                  CajaNombre: element.MovimientoEntSal
                    ? "—"
                    : element.CajaNombre,
                  TipoMovimiento: element.TipoMovimiento,
                  Observaciones: element.Observaciones,
                  Importe: element.Importe,
                  CreditoID: element.CreditoID,
                };
                tabla.push(detalle);

                if (posicion == respuesta.length) {
                  let filtro2 = respuesta.filter((valor: any) => {
                    return valor.NumeroCuenta == element.NumeroCuenta;
                  });
                  filtro2.forEach((element) => {
                    totalImporte = totalImporte + element.Importe;
                  });

                  let detalle2: any = {
                    NumeroCuenta: "",
                    DescripcionCuenta: "",
                    NumeroCuentaF: "",
                    DescripcionCuentaF: "",
                    CajaNombre: "",
                    TipoMovimiento: "",
                    Observaciones: "Total",
                    Importe: totalImporte,
                  };
                  tabla.push(detalle2);

                  totalImporte = 0;

                  respuesta.forEach((element) => {
                    totalTotal = totalTotal + element.Importe;
                  });

                  let detalle4: any = {
                    NumeroCuenta: "",
                    DescripcionCuenta: "",
                    NumeroCuentaF: "",
                    DescripcionCuentaF: "",
                    CajaNombre: "",
                    TipoMovimiento: "",
                    Observaciones: "Suma Total",
                    Importe: totalTotal,
                  };
                  tabla.push(detalle4);
                }
              } else {
                let filtro = respuesta.filter((valor: any) => {
                  return valor.NumeroCuenta == cuenta;
                });

                filtro.forEach((element) => {
                  totalImporte = totalImporte + element.Importe;
                });

                let detalle2: any = {
                  NumeroCuenta: "",
                  DescripcionCuenta: "",
                  NumeroCuentaF: "",
                  DescripcionCuentaF: "",
                  CajaNombre: "",
                  TipoMovimiento: "",
                  Observaciones: "Total",
                  Importe: totalImporte,
                };
                tabla.push(detalle2);

                totalImporte = 0;

                let detalle: any = {
                  NumeroCuenta: element.NumeroCuenta,
                  DescripcionCuenta: element.DescripcionCuenta,
                  NumeroCuentaF: element.NumeroCuentaF,
                  DescripcionCuentaF: element.DescripcionCuentaF,
                  CajaNombre: element.CajaNombre,
                  TipoMovimiento: element.TipoMovimiento,
                  Observaciones: element.Observaciones,
                  Importe: element.Importe,
                };
                tabla.push(detalle);

                if (posicion == respuesta.length) {
                  let filtro2 = respuesta.filter((valor: any) => {
                    return valor.NumeroCuenta == element.NumeroCuenta;
                  });
                  filtro2.forEach((element) => {
                    totalImporte = totalImporte + element.Importe;
                  });

                  let detalle2: any = {
                    NumeroCuenta: "",
                    DescripcionCuenta: "",
                    NumeroCuentaF: "",
                    DescripcionCuentaF: "",
                    CajaNombre: "",
                    TipoMovimiento: "",
                    Observaciones: "Total",
                    Importe: totalImporte,
                  };
                  tabla.push(detalle2);

                  totalImporte = 0;

                  respuesta.forEach((element) => {
                    totalTotal = totalTotal + element.Importe;
                  });

                  let detalle4: any = {
                    NumeroCuenta: "",
                    DescripcionCuenta: "",
                    NumeroCuentaF: "",
                    DescripcionCuentaF: "",
                    CajaNombre: "",
                    TipoMovimiento: "",
                    Observaciones: "Suma Total",
                    Importe: totalTotal,
                  };
                  tabla.push(detalle4);
                }
              }
              cuenta = element.NumeroCuenta;
            }
          });
          setState((s) => ({
            ...s,
            Cargando3: false,
            Error3: false,
            Datos3: tabla,
          }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            Cargando3: false,
            Error3: true,
            Datos3: [],
          }));
        }
      });
  };

  const FNGetGenerarBalanceCierres = (id: any) => {
    setState((s) => ({ ...s, Cargando: true, BalanceTemporalID: id }));
    var periodo = 0;

    let datosG2 = {
      periodoId: id,
      producto: 0,
      tipoMovimiento: 0,
      BalanceIDTemp: id,
      accion: 2,
    };
    Funciones.FNGetGenerarBalance(props.oidc, datosG2)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          if (respuesta.length > 0) {
            let tabla: any[] = [];
            let totalImporte = 0;
            let totalSaldoActual = 0;
            let totalSaldoAnterior = 0;
            respuesta.forEach((element) => {
              let detalle: any = {
                TipoCuenta: element.TipoCuenta,
                NumeroCuenta: element.NumeroCuenta,
                DescripcionCuenta: element.DescripcionCuenta,
                Total: element.Total,
                SaldoActual: element.SaldoActual,
                SaldoCierreAnterior: element.SaldoCierreAnterior,
              };
              tabla.push(detalle);
            });
            respuesta.forEach((element) => {
              //Sumar totales
              totalImporte = totalImporte + element.Total;
              totalSaldoActual = totalSaldoActual + element.SaldoActual;
              totalSaldoAnterior =
                totalSaldoAnterior + element.SaldoCierreAnterior;
            });
            let detalle: any = {
              TipoCuenta: "",
              NumeroCuenta: "",
              DescripcionCuenta: "Total",
              Total: totalImporte,
              SaldoActual: totalSaldoActual,
              SaldoCierreAnterior: totalSaldoAnterior,
            };
            tabla.push(detalle);

            setState((s) => ({
              ...s,
              Cargando: false,
              Error: false,
              Datos: tabla,
              HabilitarDetalle: false,
            }));
          } else {
            setState((s) => ({
              ...s,
              Cargando: false,
              Error: false,
              Datos: [],
            }));
          }
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, Cargando: false, Error: true, Datos: [] }));
        }
      });
  };

  const FNGetEstatusPeriodo = (id: any) => {
    setState((s) => ({ ...s, Cargando: true }));

    Funciones.FNGetEstatusPeriodo(props.oidc, id)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          if (respuesta.ReAbierto == 1) {
            setState((s) => ({ ...s, reAbierto: true }));
          } else {
            setState((s) => ({ ...s, reAbierto: false }));
          }
          if (respuesta.Estatus == "C") {
            setState((s) => ({
              ...s,
              Cargando: false,
              Error: false,
              estatusPeriodo: respuesta.Estatus,
              estatusMostrar: false,
            }));
          } else {
            setState((s) => ({
              ...s,
              Cargando: false,
              Error: false,
              reAbierto: respuesta.ReAbierto,
              estatusPeriodo: respuesta.Estatus,
              estatusMostrar: false,
            }));
          }
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: true,
            estatusPeriodo: "Error",
            estatusMostrar: false,
          }));
        }
      });
  };

  const FNGetGenerarBalance = (id: any) => {
    setState((s) => ({
      ...s,
      Cargando: true,
      BalanceTemporalID: id,
      Filtro1: true,
      Filtro2: false,
      Filtro3: false,
    }));
    let datosG = {
      periodoId: id,
      ctaBanco: 0,
      producto: 0,
      tipoMovimiento: 0,
      BalanceIDTemp: 0,
      accion: 0,
    };

    Funciones.FNGetGenerarBalance(props.oidc, datosG)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          //console.log("RESPUESTA 0", respuesta)
          if (respuesta[0].Mensaje !== "Sin movimientos") {
            setState((s) => ({
              ...s,
              BalanceTemporalID: respuesta[0].Mensaje,
              BalanceProductoID: respuesta[0].ProductoID,
            }));

            let datosG2 = {
              periodoId: id,
              producto: 0,
              tipoMovimiento: 0,
              BalanceIDTemp: respuesta[0].Mensaje,
              accion: 2,
            };

            Funciones.FNGetGenerarBalance(props.oidc, datosG2)
              .then((respuesta: any) => {
                if (isMounted.current === true) {
                  if (respuesta.length > 0) {
                    let tabla: any[] = [];
                    let totalImporte = 0;
                    let totalSaldoActual = 0;
                    let totalSaldoAnterior = 0;
                    respuesta.forEach((element) => {
                      let detalle: any = {
                        TipoCuenta: element.TipoCuenta,
                        NumeroCuenta: element.NumeroCuenta,
                        DescripcionCuenta: element.DescripcionCuenta,
                        Total: element.Total,
                        SaldoActual: element.SaldoActual,
                        SaldoCierreAnterior: element.SaldoCierreAnterior,
                      };
                      tabla.push(detalle);
                    });
                    respuesta.forEach((element) => {
                      //Sumar totales
                      totalImporte = totalImporte + element.Total;
                      totalSaldoActual = totalSaldoActual + element.SaldoActual;
                      totalSaldoAnterior =
                        totalSaldoAnterior + element.SaldoCierreAnterior;
                    });
                    let detalle: any = {
                      TipoCuenta: "",
                      NumeroCuenta: "",
                      DescripcionCuenta: "Total",
                      Total: totalImporte,
                      SaldoActual: totalSaldoActual,
                      SaldoCierreAnterior: totalSaldoAnterior,
                    };
                    tabla.push(detalle);

                    setState((s) => ({
                      ...s,
                      Datos: tabla,
                      HabilitarDetalle: false,
                    }));
                    setState((s) => ({
                      ...s,
                      Cargando: false,
                      Error: false,
                      HabilitarDetalle: false,
                    }));
                  } else {
                    setState((s) => ({
                      ...s,
                      Cargando: false,
                      Error: false,
                      Datos: [],
                    }));
                  }
                }
              })
              .catch(() => {
                if (isMounted.current === true) {
                  setState((s) => ({
                    ...s,
                    Cargando: false,
                    Error: true,
                    Datos: [],
                  }));
                }
              });
          } else {
            setState((s) => ({
              ...s,
              Cargando: false,
              Error: false,
              Datos: [],
            }));
          }
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, Cargando: false, Error: true, Datos: [] }));
        }
      });
  };
  const cerrarSwal = () => {
    MySwal.close();
  };
  const generarXLSX = () => {
    if (state.HabilitarDetalle == false) {
      let accion = 0;

      if (state.Filtro1 && !state.Filtro2 && !state.Filtro3) {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(state.Datos);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "Balance.xlsx");
      }
      if (!state.Filtro1 && state.Filtro2 && !state.Filtro3) {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(state.Datos2);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "Balance.xlsx");
      }
      if (!state.Filtro1 && !state.Filtro2 && state.Filtro3) {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(state.Datos3);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "Balance.xlsx");
      }
    } else {
      MySwal2.fire({
        icon: "warning",
        html: (
          <div>
            <br />
            <h3 className="text-center">Info</h3>
            <div className={`modal-body`}>
              <h5 className="text-center">Primero genera el multisaldos</h5>
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
        <Card Title="Consulta y cierre de balance">
          <Card.Body>
            <Card.Body.Content>
              <div className="conteiner">
                <Formik
                  initialValues={state.Datos}
                  enableReinitialize
                  onSubmit={(values: any) => { }}
                >
                  <Form>
                    <div className="columns is-centered is-mobile is-multiline">
                      <div className="column text-center is-half-mobile">
                        <br />
                        <div
                          className="btn-group"
                          role="group"
                          aria-label="Basic radio toggle button group"
                        >
                          <Field
                            checked={state.CheckedAbierto}
                            type="radio"
                            className="btn-check"
                            name="tipoCliente"
                            id="Cliente1"
                            autoComplete="off"
                            value="1"
                            onClick={() => {
                              setState((s) => ({
                                ...s,
                                CheckedAbierto: true,
                                CheckedCerrados: false,
                                opPeriodos: [],
                                Datos: [],
                                Datos2: [],
                                Datos3: [],
                                Datos4: [],
                                Datos3F: false,
                                Datos4F: false,
                                Datos2F: false,
                                estatusMostrar: true,
                                BalanceTemporalID: 0,
                                HabilitarDetalle: true,
                              }));
                              FNGetPeriodos(
                                "A",
                                props.iUI.Producto?.ProductoID
                              );
                            }}
                          />
                          <label
                            className="btn btn-outline-primary"
                            htmlFor="Cliente1"
                          >
                            Abiertos
                          </label>

                          <Field
                            checked={state.CheckedCerrados}
                            type="radio"
                            className="btn-check"
                            name="tipoCliente"
                            id="Cliente2"
                            autoComplete="off"
                            value="2"
                            onClick={() => {
                              setState((s) => ({
                                ...s,
                                CheckedCerrados: true,
                                CheckedAbierto: false,
                                opPeriodos: [],
                                Datos: [],
                                Datos2: [],
                                Datos3: [],
                                Datos4: [],
                                Datos3F: false,
                                Datos4F: false,
                                Datos2F: false,
                                estatusMostrar: true,
                                BalanceTemporalID: 0,
                                HabilitarDetalle: true,
                              }));
                              FNGetPeriodos(
                                "C",
                                props.iUI.Producto?.ProductoID
                              );
                            }}
                          />
                          <label
                            className="btn btn-outline-primary"
                            htmlFor="Cliente2"
                          >
                            Cerrados
                          </label>
                        </div>
                      </div>
                      <div className="column text-center is-full-mobile">
                        <div className="mb-3">
                          <label
                            className="form-label mb-0"
                            htmlFor={"periodoID"}
                          >
                            Periodos
                          </label>
                          <Field name={"periodoID"} className="form-select">
                            {(control: any) => (
                              <select
                                className="form-select"
                                //options={state.optCuentas}
                                value={control.field.value}
                                onChange={(value: any) => {
                                  if (
                                    state.CheckedAbierto === true &&
                                    state.CheckedCerrados === false
                                  ) {
                                    if (parseInt(value.target.value) > 0) {
                                      console.log("VALOR ", value.target.value);
                                      setState((s) => ({
                                        ...s,
                                        Datos: [],
                                        Datos2: [],
                                        Datos3: [],
                                      }));
                                      FNGetGenerarBalance(
                                        parseInt(value.target.value)
                                      );
                                      FNGetEstatusPeriodo(
                                        parseInt(value.target.value)
                                      );
                                      setState((state) => ({
                                        ...state,
                                        periodoID: parseInt(value.target.value),
                                        Datos3: [],
                                        Datos4: [],
                                        Datos3F: false,
                                        Datos4F: false,
                                        Datos2F: false,
                                      }));
                                    } else {
                                      //STATE DATOS VACIOS
                                      setState((state) => ({
                                        ...state,
                                        Datos: [],
                                      }));
                                    }
                                  }
                                  if (
                                    state.CheckedAbierto === false &&
                                    state.CheckedCerrados === true
                                  ) {
                                    if (parseInt(value.target.value) > 0) {
                                      setState((s) => ({
                                        ...s,
                                        Datos: [],
                                        Datos2: [],
                                        Datos3: [],
                                      }));
                                      setState((state) => ({
                                        ...state,
                                        BalanceTemporalID: parseInt(
                                          value.target.value
                                        ),
                                        Datos3: [],
                                        Datos4: [],
                                        Datos3F: false,
                                        Datos4F: false,
                                        Datos2F: false,
                                      }));
                                      FNGetEstatusPeriodo2(
                                        parseInt(value.target.value)
                                      );
                                      FNGetGenerarBalanceCierres(
                                        parseInt(value.target.value)
                                      );
                                    } else {
                                      //STATE DATOS VACIOS
                                      setState((state) => ({
                                        ...state,
                                        Datos: [],
                                      }));
                                    }
                                  }
                                }}
                                disabled={false}
                                id={"periodoID"}
                                name={"periodoID"}
                              >
                                <option value="0">
                                  {"Selecciona un periodo"}
                                </option>
                                {state.opPeriodos.map((optn, index) => (
                                  <option
                                    key={index}
                                    value={optn.value}
                                    label={optn.label}
                                  />
                                ))}
                              </select>
                            )}
                          </Field>
                          <ErrorMessage
                            component="div"
                            name={"periodoID"}
                            className="text-danger"
                          />
                        </div>
                      </div>
                      <div className="column text-center is-full-mobile">
                        <br />
                        <div
                          className="btn-group"
                          role="group"
                          aria-label="Basic radio toggle button group"
                          style={
                            state.HabilitarDetalle
                              ? { pointerEvents: "none", opacity: "0.4" }
                              : {}
                          }
                        >
                          <div className="mx-1" data-tip data-for="TT1">
                            <Field
                              checked={state.Filtro1}
                              type="radio"
                              className="btn-check"
                              name="Tipo1"
                              id="Tipo1"
                              autoComplete="off"
                              value="1"
                              onClick={() => {
                                setState((s) => ({
                                  ...s,
                                  Filtro1: true,
                                  Filtro2: false,
                                  Filtro3: false,
                                  Cargando: true,
                                }));
                                if (
                                  state.CheckedAbierto == false &&
                                  state.CheckedCerrados == true
                                ) {
                                  FNGetGenerarBalanceCierres(
                                    state.BalanceTemporalID
                                  );
                                } else {
                                  FNGetGenerarBalance(state.periodoID);
                                }
                              }}
                            />

                            <label
                              className="btn btn-outline-primary"
                              htmlFor="Tipo1"
                            >
                              Filtro 1
                            </label>
                            <ReactTooltip
                              id="TT1"
                              type="info"
                              effect="solid"
                              clickable
                              globalEventOff="click"
                            >
                              Sólo cuentas principales
                            </ReactTooltip>
                          </div>
                          <div className="mx-1" data-tip data-for="TT2">
                            <Field
                              checked={state.Filtro2}
                              type="radio"
                              className="btn-check"
                              name="Tipo2"
                              id="Tipo2"
                              autoComplete="off"
                              value="2"
                              onClick={() => {
                                setState((s) => ({
                                  ...s,
                                  Filtro1: false,
                                  Filtro2: true,
                                  Filtro3: false,
                                  Cargando2: true,
                                }));
                                FNGenerarBalanceFiltro2();
                              }}
                            />
                            <label
                              className="btn btn-outline-primary"
                              htmlFor="Tipo2"
                            >
                              Filtro 2
                            </label>
                            <ReactTooltip
                              id="TT2"
                              type="info"
                              effect="solid"
                              clickable
                              globalEventOff="click"
                            >
                              Sólo cuentas principales y detalle de ficticias
                            </ReactTooltip>
                          </div>
                          <div className="mx-1" data-tip data-for="TT3">
                            <Field
                              checked={state.Filtro3}
                              type="radio"
                              className="btn-check"
                              name="Tipo3"
                              id="Tipo3"
                              autoComplete="off"
                              value="3"
                              onClick={() => {
                                setState((s) => ({
                                  ...s,
                                  Filtro1: false,
                                  Filtro2: false,
                                  Filtro3: true,
                                  Cargando3: true,
                                }));
                                FNGenerarBalanceFiltro3();
                              }}
                            />
                            <label
                              className="btn btn-outline-primary"
                              htmlFor="Tipo3"
                            >
                              Filtro 3
                            </label>
                            <ReactTooltip
                              id="TT3"
                              type="info"
                              effect="solid"
                              clickable
                              globalEventOff="click"
                            >
                              Detalle de Movimientos
                            </ReactTooltip>
                          </div>
                        </div>
                      </div>

                      <div className="column text-center is-full-mobile">
                        <br />

                        <div
                          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
                        >
                          <button
                            data-tip
                            data-for="TT1_1"
                            type="button"
                            className="ms-2 btn btn-primary waves-effect waves-light"
                            disabled={
                              state.estatusPeriodo != "A" ? true : false
                            }
                            onClick={() => {
                              cerrarBalance();
                            }}
                          >
                            <FaCheckCircle size="20px" />
                            <ReactTooltip
                              id="TT1_1"
                              type="info"
                              effect="solid"
                              clickable
                              globalEventOff="click"
                            >
                              Cerrar Balance
                            </ReactTooltip>
                          </button>
                          <button
                            data-tip
                            data-for="TT1_2"
                            type="button"
                            className="ms-2 btn btn-success waves-effect waves-light"
                            //disabled={state.estatusPeriodo != "A" ? true : false}
                            onClick={() => {
                              generarXLSX();
                            }}
                          >
                            <FaFileExcel size="20px" />
                            <ReactTooltip
                              id="TT1_2"
                              type="info"
                              effect="solid"
                              clickable
                              globalEventOff="click"
                            >
                              Exportar a Excel
                            </ReactTooltip>
                          </button>
                          <button
                            data-tip
                            data-for="TT1_3"
                            type="button"
                            className="ms-2 btn btn-secondary waves-effect waves-light"
                            disabled={state.HabilitarDetalle}
                            onClick={() => {
                              imprimirBalance();
                            }}
                          >
                            <FaFilePdf size="20px" />
                            <ReactTooltip
                              id="TT1_3"
                              type="info"
                              effect="solid"
                              clickable
                              globalEventOff="click"
                            >
                              Imprimir PDF
                            </ReactTooltip>
                          </button>
                        </div>
                      </div>
                      <div className="column text-center is-full-mobile">
                        <br />
                        <span hidden={state.estatusMostrar}>
                          {state.estatusPeriodo != "C" ? (
                            periodoReabierto()
                          ) : (
                            <h3 style={styles.h3Cerrado}>Periodo Cerrado</h3>
                          )}
                        </span>
                      </div>
                    </div>
                  </Form>
                </Formik>
                <br />
                {state.Cargando && <Spinner />}
                {state.Error && <span>Error al cargar los datos...</span>}
                {!state.Cargando && !state.Error && state.Filtro1 && (
                  <div>
                    <DataTable
                      data={state.Datos}
                      striped
                      dense
                      noHeader
                      responsive
                      selectableRowsVisibleOnly={true}
                      keyField={"CuentaBancariaPrincipalID"}
                      columns={Columns}
                    />
                  </div>
                )}

                {state.Cargando2 && <Spinner />}
                {state.Error2 && <span>Error al cargar los datos...</span>}
                {!state.Cargando2 && !state.Error2 && state.Filtro2 && (
                  <div>
                    <DataTable
                      data={state.Datos2}
                      striped
                      dense
                      noHeader
                      responsive
                      selectableRowsVisibleOnly={true}
                      keyField={"Id"}
                      columns={Columns2}
                    />
                  </div>
                )}

                {state.Cargando3 && <Spinner />}
                {state.Error3 && <span>Error al cargar los datos...</span>}
                {!state.Cargando3 && !state.Error3 && state.Filtro3 && (
                  <div>
                    <DataTable
                      data={state.Datos3}
                      striped
                      dense
                      paginationPerPage={30}
                      paginationComponentOptions={{
                        rowsPerPageText: "Resultados por página:",
                        rangeSeparatorText: "of",
                        noRowsPerPage: false,
                        selectAllRowsItem: false,
                        selectAllRowsItemText: "Todos",
                      }}
                      noHeader
                      responsive
                      pagination
                      paginationRowsPerPageOptions={[
                        5, 10, 15, 20, 25, 50, 100,
                      ]}
                      selectableRowsVisibleOnly={true}
                      keyField={"MovimientoID"}
                      columns={Columns3}
                    />
                  </div>
                )}
                <ModalWin open={state.Detalle} zIndex={2000} xlarge scrollable>
                  <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}></h5>
                    <button
                      type="button"
                      className="delete"
                      onClick={() => setState({ ...state, Detalle: false })}
                    />
                  </ModalWin.Header>
                  <ModalWin.Body>
                    {state.Detalle && (
                      <Movimientos
                        CuentaBancoID={state.Form.CuentaBancoID}
                        Datos={state.Detalle}
                        Head={state.Detalle}
                      />
                    )}
                  </ModalWin.Body>
                </ModalWin>
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
  iUI: state.UI,
});

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Balance);
