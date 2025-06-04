import React from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";

import DataTable, { IDataTableColumn } from "react-data-table-component";
import * as Funciones from "./MultiSaldos/Funciones";
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
  FaUser,
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
import { Link } from "react-router-dom";
import { FNGetClientes } from "../../creditos/CompCreditos/CreditoGlobal/Funciones";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { FNGetMovimientos } from "./MultiSaldos/Funciones";
import { StatusProcesoQuery } from "../../../../../redux/catalogos/acciones";
import Movimientos from "./MultiSaldos/Movimientos";

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
  CuentaBancoID: number;
  MultiSaldoID: number;
  Detalle: boolean;
  masBalances: boolean;
  Form: any;
  Datos: DBConfia_Tesoreria.ICatalogoBoveda[];
  DatosMostrar: DBConfia_Tesoreria.ICatalogoBoveda[];
  datosMov?: DBConfia_Tesoreria.IMultisaldos_MovimientosVW;
  DatosMovimientos: DBConfia_Tesoreria.IMultisaldos_MovimientosVW[];
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

const MultiSaldos = (props: CatalogosType) => {
  let isMounted = React.useRef(true);

  const [state, setState] = React.useState<EstadoTipo>({
    OptionsSucursales: [],
    Habilitar: true,
    NombreBalance: "",
    ProductoID: 0,
    CuentaBancoID: 0,
    MultiSaldoID: 0,
    OptionsBancosNuevos: [],
    Datos: [],
    masBalances: false,
    DatosMostrar: [],
    datosMov: undefined,
    DatosMovimientos: [],
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
      ProductoID: undefined,
      CuentaBancoID: undefined,
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
      name: "PeriodoID",
      selector: "PeriodoID",
      sortable: false,
      center: true,
      cell: (props) =>
        props.PeriodoID == -2 ? <span></span> : EsPeriodo(props.PeriodoID),
      conditionalCellStyles: [
        {
          when: (row) => row.PeriodoID == -1,
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
      name: "Nombre Banco",
      selector: "NombreBanco",
      sortable: false,
      center: true,
      cell: (props) =>
        props.NombreBanco == "espacio" ? (
          <span></span>
        ) : (
          <span className="text-center">{props.NombreBanco}</span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.PeriodoID == -1,
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
          when: (row) => row.PeriodoID == -1,
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
          when: (row) => row.PeriodoID == -1,
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
      name: "Es Bóveda",
      selector: "EsBoveda",
      sortable: false,
      center: true,
      cell: (props) =>
        props.EsBoveda == "espacio" ? (
          <span className="text-center"></span>
        ) : (
          EsBoveda(props.EsBoveda.toString())
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.PeriodoID == -1,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
          },
        },
      ],
    },

    {
      name: "Saldo Aceptado",
      selector: "SaldoAceptado",
      sortable: false,
      center: true,
      cell: (propss) =>
        propss.SaldoAceptado == "espacio" ? (
          <span></span>
        ) : (
          <span className="text-center">
            {FormateoDinero.format(propss.SaldoAceptado)}
          </span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.PeriodoID == -1,
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
      name: "Abonos",
      selector: "Abonos",
      sortable: false,
      center: true,
      cell: (propss) =>
        propss.Abonos == "espacio" ? (
          <span></span>
        ) : (
          <span className="text-center">
            {FormateoDinero.format(propss.Abonos)}
          </span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.PeriodoID == -1,
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
      name: "Cargos",
      selector: "Cargos",
      sortable: false,
      center: true,
      cell: (propss) =>
        propss.Cargos == "espacio" ? (
          <span></span>
        ) : (
          <span className="text-center">
            {FormateoDinero.format(propss.Cargos)}
          </span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.PeriodoID == -1,
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
      name: "Saldo S/Aceptar",
      selector: "SaldoSinAceptar",
      sortable: false,
      center: true,
      cell: (propss) =>
        propss.SaldoSinAceptar == "espacio" ? (
          <span></span>
        ) : (
          <span className="text-center">
            {FormateoDinero.format(propss.SaldoSinAceptar)}
          </span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.PeriodoID == -1,
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
        propss.SaldoActual == "espacio" ? (
          <span></span>
        ) : (
          <span className="text-center">
            {FormateoDinero.format(propss.SaldoActual)}
          </span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.PeriodoID == -1,
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
          when: (row) => row.PeriodoID == -1,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",

            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
      cell: (data) =>
        data.Movimientos == "espacio" || data.PeriodoID == -1 ? (
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
                console.log("ProductoId:", data.ProductoID);
                console.log("CuentaBancoID:", data.CuentaBancoID);
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
    FNGetPeriodos("A");
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
            setState((s) => ({
              ...s,
              MultiSaldoID: respuesta[0].MultiSaldoID,
            }));

            let tabla: any[] = [];
            let saldoAceptado = 0;
            let abonos = 0;
            let cargas = 0;
            let saldoSinAceptar = 0;
            let saldoActual = 0;
            let productoAnterior = "";
            let posicion = 0;
            let posicion2 = 0;
            let productoAnterior2 = "";
            let tabla2: any[] = [];

            respuesta.forEach((element: any) => {
              posicion = posicion + 1;
              if (productoAnterior == "") {
                productoAnterior = element.ProductoID;
                let detalleSaldos: any = {
                  PeriodoID: element.PeriodoID,
                  ProductoID: element.ProductoID,
                  NombreBanco: element.NombreBanco,
                  CuentaBancoID: element.CuentaBancoID,
                  NumeroCuenta: element.NumeroCuenta,
                  EsBoveda: element.EsBoveda,
                  SaldoAceptado: element.SaldoAceptado,
                  Abonos: element.Abonos,
                  Cargos: element.Cargos,
                  SaldoSinAceptar: element.SaldoSinAceptar,
                  SaldoActual: element.SaldoActual,
                  Movimientos: element.Movimientos,
                };
                tabla.push(detalleSaldos);
              } else {
                if (element.ProductoID === productoAnterior) {
                  let detalleSaldos: any = {
                    PeriodoID: element.PeriodoID,
                    ProductoID: element.ProductoID,
                    NombreBanco: element.NombreBanco,
                    CuentaBancoID: element.CuentaBancoID,
                    NumeroCuenta: element.NumeroCuenta,
                    EsBoveda: element.EsBoveda,
                    SaldoAceptado: element.SaldoAceptado,
                    Abonos: element.Abonos,
                    Cargos: element.Cargos,
                    SaldoSinAceptar: element.SaldoSinAceptar,
                    SaldoActual: element.SaldoActual,
                    Movimientos: element.Movimientos,
                  };
                  tabla.push(detalleSaldos);
                  productoAnterior = element.ProductoID;
                } else {
                  let filtro = respuesta.filter((valor: any) => {
                    return valor.ProductoID == productoAnterior;
                  });

                  filtro.forEach((element) => {
                    saldoAceptado = saldoAceptado + element.SaldoAceptado;
                    abonos = abonos + element.Abonos;
                    cargas = cargas + element.Cargos;
                    saldoSinAceptar = saldoSinAceptar + element.SaldoSinAceptar;
                    saldoActual = saldoActual + element.SaldoActual;
                  });
                  var ProductoString = find(productoAnterior);
                  let datelleMultiSaldos: any = {
                    PeriodoID: -1,
                    NombreBanco: "Total",
                    CuentaBancoID: "del",
                    ProductoID: "",
                    NumeroCuenta: "producto",
                    EsBoveda: ProductoString.toString(),
                    SaldoAceptado: saldoAceptado,
                    Abonos: abonos,
                    Cargos: cargas,
                    SaldoSinAceptar: saldoSinAceptar,
                    SaldoActual: saldoActual,
                    Movimientos: "",
                  };
                  tabla.push(datelleMultiSaldos);

                  saldoAceptado = 0;
                  abonos = 0;
                  cargas = 0;
                  saldoSinAceptar = 0;
                  saldoActual = 0;

                  let detalleSaldos2: any = {
                    PeriodoID: -2,
                    ProductoID: "espacio",
                    NombreBanco: "espacio",
                    CuentaBancoID: "espacio",
                    NumeroCuenta: "espacio",
                    EsBoveda: "espacio",
                    SaldoAceptado: "espacio",
                    Abonos: "espacio",
                    Cargos: "espacio",
                    SaldoSinAceptar: "espacio",
                    SaldoActual: "espacio",
                    Movimientos: "espacio",
                  };
                  tabla.push(detalleSaldos2);

                  let detalleSaldos: any = {
                    PeriodoID: element.PeriodoID,
                    ProductoID: element.ProductoID,
                    NombreBanco: element.NombreBanco,
                    CuentaBancoID: element.CuentaBancoID,
                    NumeroCuenta: element.NumeroCuenta,
                    EsBoveda: element.EsBoveda,
                    SaldoAceptado: element.SaldoAceptado,
                    Abonos: element.Abonos,
                    Cargos: element.Cargos,
                    SaldoSinAceptar: element.SaldoSinAceptar,
                    SaldoActual: element.SaldoActual,
                    Movimientos: element.Movimientos,
                  };
                  tabla.push(detalleSaldos);
                  productoAnterior = element.ProductoID;
                  let posicion2 = respuesta.indexOf(element);
                }
              }
              if (posicion == respuesta.length) {
                let posicion2 = respuesta.indexOf(element);

                var ProductoString2 = find(element.ProductoID);

                let filtro2 = respuesta.filter((valor: any) => {
                  return valor.ProductoID == element.ProductoID;
                });

                filtro2.forEach((element) => {
                  saldoAceptado = saldoAceptado + element.SaldoAceptado;
                  abonos = abonos + element.Abonos;
                  cargas = cargas + element.Cargos;
                  saldoSinAceptar = saldoSinAceptar + element.SaldoSinAceptar;
                  saldoActual = saldoActual + element.SaldoActual;
                });
                let datelleMultiSaldos: any = {
                  PeriodoID: -1,
                  NombreBanco: "Total",
                  CuentaBancoID: "del",
                  ProductoID: "",
                  NumeroCuenta: "producto :",
                  EsBoveda: ProductoString2.toString(),
                  SaldoAceptado: saldoAceptado,
                  Abonos: abonos,
                  Cargos: cargas,
                  SaldoSinAceptar: saldoSinAceptar,
                  SaldoActual: saldoActual,
                  Movimientos: "",
                };
                tabla.push(datelleMultiSaldos);

                // tabla.push(datelleMultiSaldos)

                saldoAceptado = 0;
                abonos = 0;
                cargas = 0;
                saldoSinAceptar = 0;
                saldoActual = 0;

                let detalleSaldos2: any = {
                  PeriodoID: -2,
                  ProductoID: "espacio",
                  NombreBanco: "espacio",
                  CuentaBancoID: "espacio",
                  NumeroCuenta: "espacio",
                  EsBoveda: "espacio",
                  SaldoAceptado: "espacio",
                  Abonos: "espacio",
                  Cargos: "espacio",
                  SaldoSinAceptar: "espacio",
                  SaldoActual: "espacio",
                  Movimientos: "espacio",
                };
                tabla.push(detalleSaldos2);
                respuesta.forEach((element) => {
                  saldoAceptado = saldoAceptado + element.SaldoAceptado;
                  abonos = abonos + element.Abonos;
                  cargas = cargas + element.Cargos;
                  saldoSinAceptar = saldoSinAceptar + element.SaldoSinAceptar;
                  saldoActual = saldoActual + element.SaldoActual;
                });
                let totalFinal: any = {
                  PeriodoID: -1,
                  NombreBanco: "Total",
                  CuentaBancoID: "de",
                  ProductoID: "",
                  NumeroCuenta: "los",
                  EsBoveda: "productos :",
                  SaldoAceptado: saldoAceptado,
                  Abonos: abonos,
                  Cargos: cargas,
                  SaldoSinAceptar: saldoSinAceptar,
                  SaldoActual: saldoActual,
                  Movimientos: "",
                };
                tabla.push(totalFinal);

                saldoAceptado = 0;
                abonos = 0;
                cargas = 0;
                saldoSinAceptar = 0;
                saldoActual = 0;
              }
            });

            setState((s) => ({
              ...s,
              Cargando: false,
              Error: false,
              Datos: tabla,
              MultiSaldoID: respuesta[0].MultiSaldoID,
            }));

            respuesta.forEach((valor: any) => {
              posicion2 = posicion2 + 1;
              let saldoAceptado = 0;
              let abonos = 0;
              let cargas = 0;
              let saldoSinAceptar = 0;
              let saldoActual = 0;
              if (productoAnterior2 === "") {
                var ProductoString = find(valor.ProductoID);
                let detalleSaldos: any = {
                  ProductoID: ProductoString.toString(),
                };
                tabla2.push(detalleSaldos);

                let detalleSaldos2: any = {
                  Periodo: valor.PeriodoID,
                  ProductoID: valor.ProductoID,
                  NombreBanco: valor.NombreBanco,
                  CuentaBancoID: valor.CuentaBancoID,
                  Numerocuenta: valor.Numerocuenta,
                  EsBoveda: valor.EsBoveda,
                  SaldoAceptado: valor.SaldoAceptado,
                  Abonos: valor.Abonos,
                  Cargos: valor.Cargos,
                  SaldoSinAceptar: valor.SaldoSinAceptar,
                  SaldoActual: valor.SaldoActual,
                  Movimientos: valor.Movimientos,
                };
                tabla2.push(detalleSaldos2);
                productoAnterior2 = valor.ProductoID;
              } else {
                if (productoAnterior2 === valor.ProductoID) {
                  let detalleSaldos: any = {
                    Periodo: valor.PeriodoID,
                    ProductoID: valor.ProductoID,
                    NombreBanco: valor.NombreBanco,
                    CuentaBancoID: valor.CuentaBancoID,
                    Numerocuenta: valor.Numerocuenta,
                    EsBoveda: valor.EsBoveda,
                    SaldoAceptado: valor.SaldoAceptado,
                    Abonos: valor.Abonos,
                    Cargos: valor.Cargos,
                    SaldoSinAceptar: valor.SaldoSinAceptar,
                    SaldoActual: valor.SaldoActual,
                    Movimientos: valor.Movimientos,
                  };
                  tabla2.push(detalleSaldos);
                  productoAnterior2 = valor.ProductoID;
                } else {
                  let filtro = respuesta.filter((valor: any) => {
                    return valor.ProductoID == productoAnterior2;
                  });

                  filtro.forEach((element) => {
                    saldoAceptado = saldoAceptado + element.SaldoAceptado;
                    abonos = abonos + element.Abonos;
                    cargas = cargas + element.Cargos;
                    saldoSinAceptar = saldoSinAceptar + element.SaldoSinAceptar;
                    saldoActual = saldoActual + element.SaldoActual;
                  });
                  var ProductoString = find(productoAnterior);
                  let datelleMultiSaldos: any = {
                    EsBoveda: "Total",
                    SaldoAceptado: saldoAceptado,
                    Abonos: abonos,
                    Cargos: cargas,
                    SaldoSinAceptar: saldoSinAceptar,
                    SaldoActual: saldoActual,
                  };

                  tabla2.push(datelleMultiSaldos);
                  var ProductoString = find(valor.ProductoID);
                  let detalleSaldos2: any = {
                    ProductoID: ProductoString.toString(),
                  };
                  tabla2.push(detalleSaldos2);

                  let detalleSaldos: any = {
                    Periodo: valor.PeriodoID,
                    ProductoID: valor.ProductoID,
                    NombreBanco: valor.NombreBanco,
                    CuentaBancoID: valor.CuentaBancoID,
                    Numerocuenta: valor.Numerocuenta,
                    EsBoveda: valor.EsBoveda,
                    SaldoAceptado: valor.SaldoAceptado,
                    Abonos: valor.Abonos,
                    Cargos: valor.Cargos,
                    SaldoSinAceptar: valor.SaldoSinAceptar,
                    SaldoActual: valor.SaldoActual,
                    Movimientos: valor.Movimientos,
                  };
                  tabla2.push(detalleSaldos);

                  productoAnterior2 = valor.ProductoID;
                }
                if (posicion2 == respuesta.length) {
                  let filtro3 = respuesta.filter((val: any) => {
                    return val.ProductoID === valor.ProductoID;
                  });

                  let saldoAceptado = 0;
                  let abonos = 0;
                  let cargas = 0;
                  let saldoSinAceptar = 0;
                  let saldoActual = 0;

                  filtro3.forEach((element) => {
                    saldoAceptado = saldoAceptado + element.SaldoAceptado;
                    abonos = abonos + element.Abonos;
                    cargas = cargas + element.Cargos;
                    saldoSinAceptar = saldoSinAceptar + element.SaldoSinAceptar;
                    saldoActual = saldoActual + element.SaldoActual;
                  });

                  let datelleMultiSaldos2: any = {
                    EsBoveda: "Total",
                    SaldoAceptado: saldoAceptado,
                    Abonos: abonos,
                    Cargos: cargas,
                    SaldoSinAceptar: saldoSinAceptar,
                    SaldoActual: saldoActual,
                  };
                  tabla2.push(datelleMultiSaldos2);
                }
              }
            });
            setState((s) => ({
              ...s,
              Cargando: false,
              Error: false,
              DatosExcel: tabla2,
            }));
          } else {
            setState((s) => ({
              ...s,
              Cargando: false,
              Error: true,
              Datos: [],
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
      });
    }
  };

  const generarPDF = () => {
    if (state.MultiSaldoID > 0) {
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
        <Card Title="Multisaldos">
          <Card.Body>
            <Card.Body.Content>
              <div>
                {" "}
                <Formik
                  initialValues={state.Datos}
                  enableReinitialize
                  onSubmit={(values: any) => { }}
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
                    <Movimientos
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

export default connect(mapStateToProps, mapDispatchToProps)(MultiSaldos);
