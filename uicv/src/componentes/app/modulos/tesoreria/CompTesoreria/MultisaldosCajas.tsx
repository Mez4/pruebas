import React from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";

import DataTable, { IDataTableColumn } from "react-data-table-component";
import * as Funciones from "./MultiSaldosCaja/Funciones";
import { toast } from "react-toastify";
import * as FuncionesCuentasBanco from "./BancoCuentas/Funciones";
import * as FuncionesBancoNuevo from "./BancoBancos/Funciones";
import * as FuncionesCuentaContable from "../CompTesoreria/CatalogoCuentasContables/Funciones";
import { date } from "yup/lib/locale";
import * as FuncionesCaja from "../CompTesoreria/CatalogoCaja/Funciones";
import ReactTooltip from "react-tooltip";
import { Form } from "usetheform";
import { FormateoDinero } from "../../../../../global/variables";

import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";

// Icons
import {
  FaPencilAlt,
  FaPlus,
  FaSearch,
  FaCircle,
  FaUnlock,
  FaPrint,
  FaFilePdf,
  FaFileExcel,
  FaEye,
} from "react-icons/fa";

// Custom components
import { Card, Spinner } from "../../../../global";
import { CForm } from "./MultiSaldos/CForm";
import { CFormCuentasBancos } from "./CatalogoBoveda/CFormCuentasBancos";
import { CFormBancoNuevo } from "./CatalogoBoveda/CFormBancoNuevo";
import { CFormCuentasContables } from "./CatalogoBoveda/CFormCuentasContables";
import { FiRefreshCcw } from "react-icons/fi";
import { FiltrarDatos } from "../../../../../global/functions";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import { DBConfia_Tesoreria } from "../../../../../interfaces_db/DBConfia/Tesoreria";
import { CFormBovedaArqueos } from "./CatalogoBoveda/CFormBovedaArqueos";
import { ErrorMessage, Field, Formik } from "formik";

import Swal2 from "sweetalert2";
import withReactContent2 from "sweetalert2-react-content";

import {
  CSVLink,
  CSVDownload,
} from "../../../../../../src/node_modules_local/react-csv";
import XLSX from "xlsx";
import { stat } from "fs";
import MovimientosTraspasos from "./MultiSaldosCaja/MovimientosTraspasos";

type EstadoTipo = {
  DatosInitial: {
    incMovs: number;
    incDetalle: number;
  };
  Habilitar: boolean;
  Filtro: string;
  NombreBalance: string;
  Cargando: boolean;
  Error: boolean;
  ProductoID: number;
  MultiSaldoCajaID: number;
  masBalances: boolean;
  Detalle: boolean;
  Form: any;
  Datos: DBConfia_Tesoreria.ICatalogoBoveda[];
  DatosMostrar: DBConfia_Tesoreria.ICatalogoBoveda[];
  OptionsUsuario: any[];
  OptionsSucursal: any[];
  OptionsCuenta: any[];
  OptionsCuentaBanco: any[];
  OptionsAcumula: any[];
  OptionsBanco: any[];
  OptionsAgrupacion: any[];
  OptionsTipoBanco: any[];
  OptionsArchivosDispersion: any[];
  OptionsBancosNuevos: any[];
  OptionsSucursales: any[];
  OptionsAcumula2: any[];
  OptionsTipo2: any[];
  OptionsNaturaleza2: any[];
  OptionsRubro2: any[];
  OptionsEmpresa2: any[];
  OptionsMoneda2: any[];
  OptionsTipoBanco2: any[];
  opPeriodos: any[];
  OptionsCuentaBancos: any[];
  DatosExcel: any[];
};

type CatalogosType = {
  Seguridad: IOidc;
};

const MultisaldosCajas = (props: CatalogosType) => {
  let isMounted = React.useRef(true);

  const [state, setState] = React.useState<EstadoTipo>({
    OptionsSucursales: [],
    Habilitar: true,
    NombreBalance: "",
    ProductoID: 0,
    MultiSaldoCajaID: 0,
    OptionsBancosNuevos: [],
    Datos: [],
    masBalances: false,
    DatosMostrar: [],
    OptionsCuentaBancos: [],
    Filtro: "",
    Cargando: false,
    Detalle: false,
    Error: false,
    opPeriodos: [],
    DatosInitial: {
      incMovs: 0,
      incDetalle: 0,
    },
    Form: {
      BovedaID: undefined,
      Mostrar: false,
      MostrarCuentasBancos: false,
      BobedaID: undefined,
      Nuevo: false,
      Id: undefined,
      IdCuentaContable: undefined,
      MostrarArqueos: false,
      IdBoveda: 0,
    },
    OptionsUsuario: [],
    OptionsSucursal: [],
    OptionsCuenta: [],
    OptionsCuentaBanco: [],
    OptionsAcumula: [],
    OptionsBanco: [],
    OptionsAgrupacion: [],
    OptionsTipoBanco: [],
    OptionsArchivosDispersion: [],
    OptionsAcumula2: [],
    OptionsTipo2: [],
    OptionsNaturaleza2: [],
    OptionsRubro2: [],
    OptionsEmpresa2: [],
    OptionsMoneda2: [],
    OptionsTipoBanco2: [],
    DatosExcel: [],
  });
  const MostrarMasBalance = (valor: any) => {
    setState({ ...state, masBalances: !valor });
  };

  const Columns: IDataTableColumn[] = [
    {
      name: "Nombre Caja",
      selector: "NombreCaja",
      sortable: false,
      center: true,
      cell: (props) =>
        props.NombreCaja == "espacio" ? (
          <span></span>
        ) : (
          <span className="text-center">
            <strong>{props.NombreCaja}</strong>
          </span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.MuiltisaldosCajaDetalleID == -1,
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
      name: "Cuenta Banco ID",
      selector: "CuentaBancoID",
      sortable: false,
      center: true,
      cell: (props) =>
        props.CuentaBancoID == "espacio" ? (
          <span></span>
        ) : (
          <span className="text-center">{props.CuentaBancoID}</span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.MuiltisaldosCajaDetalleID == -1,
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
      name: "Número de Cuenta",
      selector: "NumeroCuenta",
      sortable: false,
      center: true,
      cell: (props) =>
        props.NumeroCuenta == "espacio" ? (
          <span></span>
        ) : (
          <span className="text-center">{props.NumeroCuenta}</span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.MuiltisaldosCajaDetalleID == -1,
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
      name: "Tipo Mov",
      selector: "TipoMovDesc",
      sortable: false,
      center: true,
      cell: (props) =>
        props.TipoMovDesc == "espacio" ? (
          <span></span>
        ) : (
          <span className="text-center">{props.TipoMovDesc}</span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.MuiltisaldosCajaDetalleID == -1,
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
      name: "Saldo Arqueo Anterior",
      selector: "SaldoArqueoAnterior",
      sortable: false,
      center: true,
      cell: (props) =>
        props.SaldoArqueoAnterior == "espacio" ? (
          <span></span>
        ) : (
          <span className="text-center">
            {FormateoDinero.format(props.SaldoArqueoAnterior)}
          </span>
        ),

      conditionalCellStyles: [
        {
          when: (row) => row.MuiltisaldosCajaDetalleID == -1,
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
      name: "Saldo Físico",
      selector: "SaldoFisico",
      sortable: false,
      center: true,
      cell: (propss) =>
        propss.SaldoFisico == "espacio" ? (
          <span></span>
        ) : (
          <span className="text-center">
            {FormateoDinero.format(propss.SaldoFisico)}
          </span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.MuiltisaldosCajaDetalleID == -1,
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
      name: "Diferencia",
      selector: "Diferencia",
      sortable: false,
      center: true,
      cell: (propss) =>
        propss.Diferencia == "espacio" ? (
          <span></span>
        ) : (
          <span className="text-center">
            {FormateoDinero.format(propss.Diferencia)}
          </span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.MuiltisaldosCajaDetalleID == -1,
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
      selector: "MovimientosTraspasos",
      sortable: false,
      wrap: true,
      center: true,
      conditionalCellStyles: [
        {
          when: (row) => row.MuiltisaldosCajaDetalleID == -1,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
      cell: (data) =>
        data.MovimientosTraspasos == "espacio" ||
        data.MuiltisaldosCajaDetalleID == -1 ? (
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
                    ProductoID: data.ProductoID,
                  },
                }));
                console.log("cuentaBancoID:", data.CuentaBancoID);
                console.log("ProductoID:", data.ProductoID);
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
              Ver Traspasos
            </ReactTooltip>
          </div>
        ),
    },
  ];
  const EsBoveda = (valor: any) => {
    if (valor == "false") {
      return <span className="text-center">No</span>;
    } else if (valor == "true") {
      return <span className="text-center">Si</span>;
    } else {
      return (
        <span style={{ fontWeight: "bold" }} className="text-center">
          {valor}{" "}
        </span>
      );
    }
  };

  const EsPeriodo = (valor: number) => {
    if (valor < 0) {
      return <span className="text-center"></span>;
    } else {
      return <span className="text-center">{valor}</span>;
    }
  };

  React.useEffect(() => {
    //  FNGetPeriodos("A")
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  const FNGetPeriodos = (estatusRecibido: any) => {
    Funciones.FNGetPeriodo2(props.Seguridad)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          var periodos = respuesta.map((valor: any) => {
            var obj = {
              value: valor.ProductoID,
              label: valor.Producto,
              checked: false,
              disabled: false,
            };
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
  //Función para encontrar un elemento en un arreglo por ID
  const find = (ProductoID: any) => {
    //Encontrar elemento en arreglo por ID
    var elemento = state.opPeriodos.find((x) => x.value == ProductoID);
    let productoString = elemento.label;
    return productoString;
  };

  const FNGetMultiSaldos = () => {
    Funciones.FNGet(props.Seguridad)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          if (respuesta.length > 0) {
            console.log("respuesta", respuesta);
            setState((s) => ({
              ...s,
              MultiSaldoCajaID: respuesta[0].MultisaldosCajaID,
            }));
            let tabla: any[] = [];
            let totalDiferencia = 0;
            let totalCajaFisico = 0;
            let totalCajaSistema = 0;
            let cajaAnteriorID = 0;
            let posicion = 0;
            let posicion2 = 0;
            let tabla2: any[] = [];

            respuesta.forEach((element: any) => {
              posicion = posicion + 1;
              if (cajaAnteriorID == 0) {
                let detalleSaldos: any = {
                  MuiltisaldosCajaDetalleID: element.MuiltisaldosCajaDetalleID,
                  MultisaldosCajaID: element.MultiSaldoCajaID,
                  CajaID: element.CajaID,
                  NombreCaja: element.NombreCaja,
                  CuentaBancoID: element.CuentaBancoID,
                  TipoMovID: element.TipoMovID,
                  TipoMovDesc: element.TipoMovDesc,
                  NumeroCuenta: element.NumeroCuenta,
                  DescripcionCuenta: element.DescripcionCuenta,
                  FechaUltimoArqueo: element.FechaUltimoArqueo,
                  SaldoArqueoAnterior: element.SaldoArqueoAnterior,
                  SaldoFisico: element.SaldoFisico,
                  Diferencia: element.Diferencia,
                  MovimientosTraspasos: element.MovimimientosTraspasos,
                };
                tabla.push(detalleSaldos);
                cajaAnteriorID = element.CajaID;
              } else {
                if (cajaAnteriorID === element.CajaID) {
                  let detalleSaldos: any = {
                    MuiltisaldosCajaDetalleID:
                      element.MuiltisaldosCajaDetalleID,
                    MultisaldosCajaID: element.MultiSaldoCajaID,
                    CajaID: element.CajaID,
                    NombreCaja: "",
                    CuentaBancoID: element.CuentaBancoID,
                    TipoMovID: element.TipoMovID,
                    TipoMovDesc: element.TipoMovDesc,
                    NumeroCuenta: element.NumeroCuenta,
                    DescripcionCuenta: element.DescripcionCuenta,
                    FechaUltimoArqueo: element.FechaUltimoArqueo,
                    SaldoArqueoAnterior: element.SaldoArqueoAnterior,
                    SaldoFisico: element.SaldoFisico,
                    Diferencia: element.Diferencia,
                    MovimientosTraspasos: element.MovimientosTraspasos,
                  };
                  tabla.push(detalleSaldos);
                  cajaAnteriorID = element.CajaID;
                } else {
                  let filtro = respuesta.filter((valor: any) => {
                    return valor.CajaID == cajaAnteriorID;
                  });
                  filtro.forEach((element) => {
                    totalCajaFisico = totalCajaFisico + element.SaldoFisico;
                    totalCajaSistema =
                      totalCajaSistema + element.SaldoArqueoAnterior;
                    totalDiferencia = totalDiferencia + element.Diferencia;
                  });

                  let detalleSaldos22: any = {
                    MuiltisaldosCajaDetalleID: -1,
                    MultisaldosCajaID: "",
                    CajaID: "",
                    NombreCaja: "",
                    CuentaBancoID: "",
                    TipoMovID: "",
                    TipoMovDesc: "",
                    NumeroCuenta: "Totales",
                    DescripcionCuenta: "Totales",
                    FechaUltimoArqueo: "Totales",
                    SaldoArqueoAnterior: totalCajaSistema,
                    SaldoFisico: totalCajaFisico,
                    Diferencia: totalDiferencia,
                    MovimientosTraspasos: "",
                  };
                  tabla.push(detalleSaldos22);

                  totalCajaFisico = 0;
                  totalCajaSistema = 0;
                  totalDiferencia = 0;

                  let detalleSaldos2: any = {
                    MuiltisaldosCajaDetalleID: -2,
                    MultisaldosCajaID: "espacio",
                    CajaID: "espacio",
                    NombreCaja: "espacio",
                    CuentaBancoID: "espacio",
                    TipoMovID: "espacio",
                    TipoMovDesc: "espacio",
                    NumeroCuenta: "espacio",
                    DescripcionCuenta: "espacio",
                    FechaUltimoArqueo: "espacio",
                    SaldoArqueoAnterior: "espacio",
                    SaldoFisico: "espacio",
                    Diferencia: "espacio",
                    MovimientosTraspasos: "espacio",
                  };
                  tabla.push(detalleSaldos2);

                  let detalleSaldos3: any = {
                    MuiltisaldosCajaDetalleID:
                      element.MuiltisaldosCajaDetalleID,
                    MultisaldosCajaID: element.MultiSaldoCajaID,
                    CajaID: element.CajaID,
                    NombreCaja: element.NombreCaja,
                    CuentaBancoID: element.CuentaBancoID,
                    TipoMovID: element.TipoMovID,
                    TipoMovDesc: element.TipoMovDesc,
                    NumeroCuenta: element.NumeroCuenta,
                    DescripcionCuenta: element.DescripcionCuenta,
                    FechaUltimoArqueo: element.FechaUltimoArqueo,
                    SaldoArqueoAnterior: element.SaldoArqueoAnterior,
                    SaldoFisico: element.SaldoFisico,
                    Diferencia: element.Diferencia,
                    MovimientosTraspasos: element.MovimientosTraspasos,
                  };
                  tabla.push(detalleSaldos3);
                  cajaAnteriorID = element.CajaID;
                }
                console.log("F1 LENGTH ,", respuesta.length);
                console.log("F1 POSICION ,", posicion);
                if (posicion == respuesta.length) {
                  let filtro2 = respuesta.filter((valor: any) => {
                    return valor.CajaID == element.CajaID;
                  });
                  filtro2.forEach((element) => {
                    totalCajaFisico = totalCajaFisico + element.SaldoFisico;
                    totalCajaSistema =
                      totalCajaSistema + element.SaldoArqueoAnterior;
                    totalDiferencia = totalDiferencia + element.Diferencia;
                  });

                  let detalleSaldos: any = {
                    MuiltisaldosCajaDetalleID: -1,
                    MultisaldosCajaID: "",
                    CajaID: "",
                    NombreCaja: "",
                    CuentaBancoID: "",
                    TipoMovID: "",
                    TipoMovDesc: "",
                    NumeroCuenta: "Totales",
                    DescripcionCuenta: "Totales",
                    FechaUltimoArqueo: "Totales",
                    SaldoArqueoAnterior: totalCajaSistema,
                    SaldoFisico: totalCajaFisico,
                    Diferencia: totalDiferencia,
                    MovimientosTraspasos: "",
                  };
                  tabla.push(detalleSaldos);
                  totalCajaFisico = 0;
                  totalCajaSistema = 0;
                  totalDiferencia = 0;
                }
              }
            });

            /*     respuesta.forEach(element => {
                                
                            }); */

            setState((s) => ({
              ...s,
              Datos: tabla,
              Cargando: false,
              DatosExcel: respuesta,
            }));
          }
        }
      })
      .catch((Ex: any) => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, Cargando: false, Error: true, Datos: [] }));
        }
      });
  };

  const activador = (valor: any) => {
    state.opPeriodos[valor].checked = !state.opPeriodos[valor].checked;
    setState((s) => ({ ...s, opPeriodos: state.opPeriodos }));
  };

  React.useEffect(() => {
    setState((s) => ({
      ...s,
      DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro),
    }));
    // eslint-disable-next-line
  }, [state.Datos, state.Filtro]);
  const cerrarSwal = () => {
    MySwal2.close();
  };
  const MySwal2 = withReactContent2(Swal2);
  const cerrarSwal2 = () => {
    MySwal2.close();
  };

  const generarMultiSal = () => {
    //cargando = true
    setState((s) => ({ ...s, Cargando: true }));
    FNGetMultiSaldos();
  };

  const generarXLSX = () => {
    if (state.MultiSaldoCajaID > 0) {
      // const XLSX = require('xlsx-js-style');
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(state.DatosExcel);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();

      ws["A1"].s = {
        // set the style for target cell
        font: {
          name: "宋体",
          sz: 24,
          bold: true,
          color: {
            rgb: "FFFFAA00",
          },
        },
      };

      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "MultiSaldo.xlsx");
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
  const generarPDF = () => {
    if (state.MultiSaldoCajaID > 0) {
      //Export to excel state of Datos

      let timerInterval;
      MySwal2.fire({
        icon: "info",
        html: (
          <div>
            <br />
            <h3 className="text-center">Aviso</h3>
            <div className={`modal-body`}>
              <h5 className="text-center">Imprimiendo multisaldos.</h5>
            </div>
          </div>
        ),
        timerProgressBar: false,
        confirmButtonText: `Ok`,
        timer: 10000,
        didOpen: () => {
          MySwal2.showLoading();
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      });

      let datos = {
        MultiSaldoCajaID: state.MultiSaldoCajaID,
      };
      Funciones.FNPrintPDF(props.Seguridad, datos)
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
          MySwal2.close();
        })
        .catch((err) => {
          //   setState(s => ({ ...s, error: true, DatosTabla: [] }))
          toast.error("Ocurrió un error al generar el PDF");
        });
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
        <Card Title="Multisaldos cajas">
          <Card.Body>
            <Card.Body.Content>
              <div>
                {" "}
                <Formik
                  initialValues={state.Datos}
                  enableReinitialize
                  onSubmit={(values: any) => {}}
                >
                  <Form>
                    <div className="columns is-centered is-mobile is-multiline">
                      <div className="column text-center is-full-desktop is-full-mobile">
                        <button
                          type="button"
                          className="btn mx-1 btn-primary waves-effect waves-light"
                          //disabled={state.estatusPeriodo != "A" ? true : false}
                          onClick={() => {
                            generarMultiSal();
                          }}
                        >
                          Generar multisaldos
                        </button>
                        <button
                          type="button"
                          className="btn mx-1 btn-secondary waves-effect waves-light"
                          //disabled={state.estatusPeriodo != "A" ? true : false}
                          onClick={() => {
                            generarPDF();
                          }}
                        >
                          <FaFilePdf size="20px" />
                        </button>
                        <button
                          type="button"
                          className="btn mx-1 btn-success waves-effect waves-light"
                          //disabled={state.estatusPeriodo != "A" ? true : false}
                          onClick={() => {
                            generarXLSX();
                          }}
                        >
                          <FaFileExcel size="20px" />
                        </button>
                        <button
                          className="btn mx-1 btn-outline-secondary"
                          type="button"
                          onClick={() => {
                            setState((s) => ({
                              ...s,
                              Cargando: true,
                              Error: false,
                              Datos: [],
                            }));
                            FNGetMultiSaldos();
                          }}
                        >
                          <FiRefreshCcw />
                        </button>
                      </div>
                    </div>
                  </Form>
                </Formik>
              </div>
              {state.Cargando && (
                <div>
                  <br /> <Spinner />
                </div>
              )}
              {state.Error && <span>Error al cargar los datos...</span>}
              {!state.Cargando && !state.Error && (
                <div>
                  <DataTable
                    subHeader
                    data={state.DatosMostrar}
                    striped
                    pagination={false}
                    dense
                    noHeader
                    paginationServer={true}
                    paginationTotalRows={state.DatosMostrar.length}
                    //paginationComponent
                    responsive
                    keyField={"MultiSaldoDetalleID"}
                    defaultSortField={"MultiSaldoDetalleID"}
                    columns={Columns}
                  />

                  {/*            <ModalWin center={true} open={state.Form.MostrarCuentasBancos} scrollable={true} >
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                Agregar Cuenta Banco
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>

                                        </ModalWin.Body>
                                    </ModalWin>
 */}
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
                    <MovimientosTraspasos
                      ProductoID={state.Form.ProductoID}
                      CuentaBancoID={state.Form.CuentaBancoID}
                      Datos={state.Detalle}
                      Head={state.Detalle}
                    />
                  )}
                </ModalWin.Body>
              </ModalWin>
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

export default connect(mapStateToProps, mapDispatchToProps)(MultisaldosCajas);
