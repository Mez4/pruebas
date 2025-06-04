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
  const [balanceSeleccionado, setBalanceSeleccionado] = React.useState(0);
  const [resultadoBalance, setResultadoBalance] = React.useState(0);
  const [diferenciaBalance, setDiferenciaBalance] = React.useState(0);
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
  let valorBalanceTemp = "";

  const [balanceTemporalGenerado, setBalanceTemporalGenerado] = React.useState("");
  const [state, setState] = React.useState({
    BTemporalID: "",
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

  const guardarBalanceTemporal = (id: any) => {
    let datos = {
      BalanceSeleccionado: id,
    }
    Funciones.FNBalanceTemporal(props.oidc, datos)
      .then((respuesta: any) => {
        if (isMounted.current == true) {
          valorBalanceTemp = respuesta.BalanceTemporalID;
          toast.success(`PreBalance Nro. ${respuesta.BalanceTemporalID} generado correctamente`);
          imprimirBalance(id, respuesta.BalanceTemporalID);
          setState((s) => ({ ...s, BTemporalID: respuesta.BalanceTemporalID }));

        }
      }).catch((error: any) => {
        if (isMounted.current == true) {
          toast.error("Error al guardar los parametros");
          // alert("Error al guardar los parametros" + JSON.stringify(error))
        }
      });
  }


  const validarCajasAbiertas = (valorElegido: any) => {
    let datos = {
      BalanceSeleccionado: valorElegido,
    }
    const MySwal = withReactContent(Swal);
    Funciones.FNValidarCajas(props.oidc, datos)
      .then((respuesta: any) => {
        if (isMounted.current == true) {
          if (respuesta.Codigo == 0) {
            toast.error(respuesta.Mensaje);
            setBalanceSeleccionado(0);
          } else {
            //MYSwal que diga el mensaje de respeusta.Mensaje y tenga dos botones de pregunta Conitnuar y Cancelar
            MySwal.fire({
              icon: "info",
              html: (
                <div>
                  <br />
                  <h3 className="text-center">Aviso</h3>
                  <div className={`modal-body`}>
                    <h5 className="text-center">{respuesta.Mensaje}</h5>
                  </div>
                </div>
              ),
              showCancelButton: true,
              confirmButtonText: `Continuar`,
            }).then((result) => {
              if (result.isConfirmed) {
                guardarBalanceTemporal(valorElegido);
              } else {
                setBalanceSeleccionado(0);
              }
            });
          }
        }
      })
      .catch((error: any) => {
        if (isMounted.current == true) {
          toast.error("Ha occurido un problema");
        }
      });
  }

  const imprimirBalance = (val: any, val2: any) => {
    valorBalanceTemp = val2;
    const MySwal = withReactContent(Swal);
    if (val == 0) {
      MySwal.fire({
        icon: "info",
        html: (
          <div>
            <br />
            <h3 className="text-center">Aviso</h3>
            <div className={`modal-body`}>
              <h5 className="text-center">Selecciona un balance.</h5>
            </div>
          </div>
        ),
        confirmButtonText: `Ok`,
      });
    } else {
      let timerInterval;
      let accion = 0;
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
        allowEscapeKey: true,
        confirmButtonText: `Ok`,
        didOpen: () => {
          MySwal.showLoading();
        },
      });

      let datos = {
        Accion: accion,
        BalanceIDTemp: state.BalanceTemporalID,
        NombreBalance: '',
        PeriodoID: state.periodoID,
        BalanceSeleccionado: val,
        BalanceTempID: val2,
      };



      Funciones.FNImprimirBalance3(props.oidc, datos)
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
        });
    }
  }




  const FNGetPeriodos = () => {
    Funciones.FNGetPeriodo(props.oidc)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          var periodos = respuesta.map((valor: any) => {
            var obj = { value: valor.BalanceID, label: valor.NombreBalance };
            return obj;
          });
          setState((s) => ({ ...s, opPeriodos: periodos }));
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
        FNGetPeriodos();
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


  const cerrarBalance = () => {
    const MySwal = withReactContent(Swal);
    console.log("valorBalanceTemp", valorBalanceTemp);
    console.log("ESTADO ,", state)
    MySwal.fire({
      icon: "info",
      html: (
        <div>
          <br />
          <h3 className="text-center">Aviso</h3>
          <div className={`modal-body`}>
            {/* Corregido: Llaves simples para interpolar valorBalanceTemp */}
            <h5 className="text-center">¿Estás seguro que deseas cerrar el balance nro {state.BTemporalID + '.'}?</h5>
          </div>
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        let aaa = {
          BTemporalID: state.BTemporalID,
        }
        Funciones.FNCerrarBalance(props.oidc, aaa)
          .then((respuesta: any) => {
            if (isMounted.current == true) {
              if (respuesta.Codigo == 1) {
                toast.success("Balance cerrado correctamente");
                setBalanceSeleccionado(0);
              } else {
                toast.error(respuesta.Mensaje);
              }
            }
          })
          .catch((error: any) => {
            if (isMounted.current == true) {
              toast.error("Error al cerrar el balance");
            }
          });

      }
    });
  }


  return (
    <div className="row">
      <div className="col-12">
        <Card Title=" Balance V3">
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
                      <div className="column text-center is-full-mobile">
                        <div className="mb-3">
                          <label
                            className="form-label mb-0"
                            htmlFor={"periodoID"}
                          >
                            Balances
                          </label>
                          <Field name={"periodoID"} className="form-select">
                            {(control: any) => (
                              <select
                                className="form-select"
                                //options={state.optCuentas}
                                value={control.field.value}
                                onChange={(value: any) => {
                                  if (parseInt(value.target.value) > 0) {
                                    validarCajasAbiertas(parseInt(value.target.value));
                                    setBalanceSeleccionado(parseInt(value.target.value));
                                  }
                                  else {
                                    setBalanceSeleccionado(0);
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
                          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
                        >
                          <button
                            data-tip
                            data-for="TT1_1"
                            type="button"
                            className="ms-2 btn btn-primary waves-effect waves-light"
                            // disabled={valorBalanceTemp != "" ? false : true}
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
                        </div>
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
