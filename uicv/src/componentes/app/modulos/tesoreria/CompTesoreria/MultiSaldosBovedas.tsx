import React, { useState } from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";

import DataTable, { IDataTableColumn } from "react-data-table-component";
import * as Funciones from "./MultiSaldosBovedas/Funciones";
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
} from "react-icons/fa";

// Custom components
import {
  Card,
  DatePickeEnd,
  DatePickeStart,
  Spinner,
} from "../../../../global";
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

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Swal2 from "sweetalert2";
import withReactContent2 from "sweetalert2-react-content";

import {
  CSVLink,
  CSVDownload,
} from "../../../../../../src/node_modules_local/react-csv";
import XLSX from "xlsx";
import moment from "moment";

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
  MultiSaldoID: number;
  masBalances: boolean;
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

const MultiSaldosBovedas = (props: CatalogosType) => {
  let isMounted = React.useRef(true);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState(moment().toDate());
  const [endDate, setEndDate] = useState(moment().toDate());

  const [state, setState] = React.useState<EstadoTipo>({
    OptionsSucursales: [],
    Habilitar: true,
    NombreBalance: "",
    ProductoID: 0,
    MultiSaldoID: 0,
    OptionsBancosNuevos: [],
    Datos: [],
    masBalances: false,
    DatosMostrar: [],
    OptionsCuentaBancos: [],
    Filtro: "",
    Cargando: false,
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

  const Columns: IDataTableColumn[] = [
    {
      name: "Producto",
      selector: "Producto",
      sortable: false,
      center: true,
      cell: (props) =>
        props.Producto == "espacio" ? (
          <span></span>
        ) : (
          <span className="text-center">
            <strong>{props.Producto}</strong>
          </span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.ProductoID == -1,
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
      name: "Sucursal",
      selector: "NombreSucursal",
      sortable: false,
      center: true,
      cell: (props) => (
        <span className="text-center">{props.NombreSucursal}</span>
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.ProductoID == -1,
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
      name: "Num Cuenta Pr.",
      selector: "NumCuentaPR",
      sortable: false,
      center: true,
      cell: (props) => <span className="text-center">{props.NumCuentaPR}</span>,
      conditionalCellStyles: [
        {
          when: (row) => row.ProductoID == -1,
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
      name: "Desc Cuenta Pr.",
      selector: "DescCuentaPR",
      sortable: false,
      center: true,
      cell: (props) => (
        <span className="text-center">{props.DescCuentaPR}</span>
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.ProductoID == -1,
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
      name: "Caja",
      selector: "NombreCaja",
      sortable: false,
      center: true,
      cell: (props) =>
        props.NombreCaja == "espacio" ? (
          <span></span>
        ) : (
          <span className="text-center">{props.NombreCaja}</span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.ProductoID == -1,
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
          when: (row) => row.ProductoID == -1,
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
        props.ProductoID == "esp" ? (
          <span></span>
        ) : (
          <span className="text-center">{props.NumeroCuenta}</span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.ProductoID == -1,
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
        propss.ProductoID == "esp" ? (
          <span></span>
        ) : (
          <span className="text-center">
            {FormateoDinero.format(propss.SaldoActual)}
          </span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.ProductoID == -1,
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
    //FNGetPeriodos("A")
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

  const FNGetMultiSaldos = (FechaInicio: any) => {
    const MySwal = withReactContent(Swal);

    console.log("FechaInicio", startDate);
    if (startDate == null) {
      MySwal.fire({
        icon: "error",
        html: (
          <div>
            <br />
            <h3 className="text-center">Error</h3>
            <div className={`modal-body`}>
              <h5 className="text-center">Primero selecciona una fecha.</h5>
            </div>
          </div>
        ),
        confirmButtonText: `Ok`,
        confirmButtonColor: `#3085d6`,
      });
    } else {
      let a: any;
      //Compare startDate with new Date() ignoring time, only days before
      if (startDate.getTime() < new Date().setHours(0, 0, 0, 0)) {
        console.log("Fecha Inicio es menor a la fecha actual");
        a = {
          TipoMultiSaldos: 2,
          FechaInicio: startDate,
        };
      } else {
        console.log("Fecha Inicio es mayor a la fecha actual");
        a = {
          TipoMultiSaldos: 1,
          FechaInicio: startDate,
        };
      }
      setState((s) => ({ ...s, Cargando: true }));
      Funciones.FNGet(props.Seguridad, a)
        .then((respuesta: any) => {
          if (isMounted.current === true) {
            if (respuesta.length > 0) {
              if (respuesta[0].MultiSaldoBovedaID != null) {
                setState((s) => ({
                  ...s,
                  MultiSaldoID: respuesta[0].MultiSaldoBovedaID,
                }));
                let tabla: any[] = [];
                let primero = true;
                let productoAnterior = 0;
                let cuentabancariaAnterior = 0;
                let posicion = 0;
                let productoNombre: "";
                respuesta.forEach((valor: any) => {
                  posicion = posicion + 1;
                  productoNombre = valor.Producto;
                  if (primero) {
                    let obj = {
                      ProductoID: valor.ProductoID,
                      Producto: valor.Producto,
                      SucursalID: valor.SucursalID,
                      NombreSucursal: valor.NombreSucursal,
                      CuentaBancariaPrincipalID:
                        valor.CuentaBancariaPrincipalID,
                      NumCuentaPR: valor.NumCuentaPR,
                      DescCuentaPR: valor.DescCuentaPR,
                      CajaID: valor.CajaID,
                      NombreCaja: valor.NombreCaja,
                      CuentaBancoID: valor.CuentaBancoID,
                      NumeroCuenta: valor.NumeroCuenta,
                      DescripcionCuenta: valor.DescripcionCuenta,
                      SaldoActual: valor.SaldoActual,
                      SaldoMinimo: valor.SaldoMinimo,
                      SaldoMAximo: valor.SaldoMaximo,
                      ExcedenteSaldo: valor.ExcedenteSaldo,
                    };
                    tabla.push(obj);
                    primero = false;
                    productoAnterior = valor.ProductoID;
                    cuentabancariaAnterior = valor.CuentaBancariaPrincipalID;
                  } else {
                    if (productoAnterior == valor.ProductoID) {
                      let obj = {
                        ProductoID: valor.ProductoID,
                        Producto: "-",
                        SucursalID: valor.SucursalID,
                        NombreSucursal: valor.NombreSucursal,
                        CuentaBancariaPrincipalID:
                          cuentabancariaAnterior ==
                          valor.CuentaBancariaPrincipalID
                            ? "-"
                            : valor.CuentaBancariaPrincipalID,
                        NumCuentaPR:
                          cuentabancariaAnterior ==
                          valor.CuentaBancariaPrincipalID
                            ? "-"
                            : valor.NumCuentaPR,
                        DescCuentaPR:
                          cuentabancariaAnterior ==
                          valor.CuentaBancariaPrincipalID
                            ? "-"
                            : valor.DescCuentaPR,
                        CajaID: valor.CajaID,
                        NombreCaja: valor.NombreCaja,
                        CuentaBancoID: valor.CuentaBancoID,
                        NumeroCuenta: valor.NumeroCuenta,
                        DescripcionCuenta: valor.DescripcionCuenta,
                        SaldoActual: valor.SaldoActual,
                        SaldoMinimo: valor.SaldoMinimo,
                        SaldoMAximo: valor.SaldoMaximo,
                        ExcedenteSaldo: valor.ExcedenteSaldo,
                      };
                      tabla.push(obj);
                      productoAnterior = valor.ProductoID;
                      cuentabancariaAnterior = valor.CuentaBancariaPrincipalID;
                    } else {
                      let filtro = respuesta.filter((valor: any) => {
                        return valor.ProductoID == productoAnterior;
                      });
                      let saldoTotalProducto = 0;
                      filtro.forEach((element) => {
                        saldoTotalProducto =
                          saldoTotalProducto + element.SaldoActual;
                      });

                      let objEsp = {
                        ProductoID: "esp",
                      };
                      let objTotal = {
                        ProductoID: -1,
                        CuentaBancoID: "Total Bovedas de",
                        NumeroCuenta: productoNombre,
                        SaldoActual: saldoTotalProducto,
                      };

                      tabla.push(objTotal);
                      tabla.push(objEsp);

                      let obj = {
                        ProductoID: valor.ProductoID,
                        Producto: valor.Producto,
                        SucursalID: valor.SucursalID,
                        NombreSucursal: valor.NombreSucursal,
                        CuentaBancariaPrincipalID:
                          cuentabancariaAnterior ==
                          valor.CuentaBancariaPrincipalID
                            ? "-"
                            : valor.CuentaBancariaPrincipalID,
                        NumCuentaPR:
                          cuentabancariaAnterior ==
                          valor.CuentaBancariaPrincipalID
                            ? "-"
                            : valor.NumCuentaPR,
                        DescCuentaPR:
                          cuentabancariaAnterior ==
                          valor.CuentaBancariaPrincipalID
                            ? "-"
                            : valor.DescCuentaPR,
                        CajaID: valor.CajaID,
                        NombreCaja: valor.NombreCaja,
                        CuentaBancoID: valor.CuentaBancoID,
                        NumeroCuenta: valor.NumeroCuenta,
                        DescripcionCuenta: valor.DescripcionCuenta,
                        SaldoActual: valor.SaldoActual,
                        SaldoMinimo: valor.SaldoMinimo,
                        SaldoMAximo: valor.SaldoMaximo,
                        ExcedenteSaldo: valor.ExcedenteSaldo,
                      };
                      tabla.push(obj);
                      productoAnterior = valor.ProductoID;
                      cuentabancariaAnterior = valor.CuentaBancariaPrincipalID;
                    }

                    if (posicion == respuesta.length) {
                      let filtro = respuesta.filter((valor: any) => {
                        return valor.ProductoID == productoAnterior;
                      });
                      let saldoTotalProducto = 0;
                      filtro.forEach((element) => {
                        saldoTotalProducto =
                          saldoTotalProducto + element.SaldoActual;
                      });

                      let objEsp = {
                        ProductoID: "esp",
                      };
                      let objTotal = {
                        ProductoID: -1,
                        CuentaBancoID: "Total Bovedas de",
                        NumeroCuenta: productoNombre,
                        SaldoActual: saldoTotalProducto,
                      };

                      tabla.push(objTotal);

                      let totalTotal = 0;
                      respuesta.forEach((element) => {
                        totalTotal = totalTotal + element.SaldoActual;
                      });
                      let objTotalTotal = {
                        ProductoID: -1,
                        CuentaBancoID: "Total Bovedas",
                        NumeroCuenta: "",
                        SaldoActual: totalTotal,
                      };
                      tabla.push(objTotalTotal);
                    }
                  }
                });
                setState((s) => ({
                  ...s,
                  Cargando: false,
                  Error: false,
                  Datos: tabla,
                  DatosExcel: tabla,
                }));
              }
            } else {
              MySwal.fire({
                icon: "info",
                html: (
                  <div>
                    <br />
                    <h3 className="text-center">Info</h3>
                    <div className={`modal-body`}>
                      <h5 className="text-center">
                        No existen multisaldos para el día seleccionado.
                      </h5>
                    </div>
                  </div>
                ),
                confirmButtonText: `Ok`,
                confirmButtonColor: `#3085d6`,
              });
              setState((s) => ({
                ...s,
                Cargando: false,
                Error: false,
                Datos: [],
              }));
            }
          }
        })
        .catch((Ex: any) => {
          if (isMounted.current === true) {
            setState((s) => ({
              ...s,
              Cargando: false,
              Error: true,
              Datos: [],
            }));
          }
        });
    }
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

  const generarXLSX = () => {
    if (state.MultiSaldoID > 0) {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(state.DatosExcel);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
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
        confirmButtonColor: `#3085d6`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
    }
  };
  const generarPDF = () => {
    if (state.MultiSaldoID > 0) {
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
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          MySwal2.showLoading();
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      });

      let datos = {
        MultiSaldoID: state.MultiSaldoID,
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
        <Card Title="Multisaldos Bóvedas">
          <Card.Body>
            <Card.Body.Content>
              <div>
                <Formik
                  initialValues={state.Datos}
                  enableReinitialize
                  onSubmit={(values: any) => {}}
                >
                  <Form>
                    <div className="columns is-centered is-mobile is-multiline">
                      <div className="column text-center is-half-desktop is-full-mobile">
                        <DatePickeStart
                          name={"FechaInicio"}
                          label={"Fecha Consulta"}
                          disabled={loading}
                          placeholder={"Inicio"}
                          isClearable
                          startDate={startDate}
                          endDate={new Date()}
                          setStartDate={setStartDate}
                        />
                      </div>

                      <div className="column text-center is-half-desktop is-full-mobile">
                        <br />
                        <button
                          type="submit"
                          className="btn mx-1 btn-primary waves-effect waves-light" //disabled={state.estatusPeriodo != "A" ? true : false}
                          onClick={() => {
                            FNGetMultiSaldos(startDate);
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
                            FNGetMultiSaldos(startDate);
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

export default connect(mapStateToProps, mapDispatchToProps)(MultiSaldosBovedas);
