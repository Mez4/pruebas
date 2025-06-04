import React, { useState } from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";

import DataTable, { IDataTableColumn } from "react-data-table-component";
import * as Funciones from "./MultiSaldosArqueos/Funciones";
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

const MultiSaldosArqueos = (props: CatalogosType) => {
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
    /* 
            {
                name: 'SucursalID',
                selector: 'SucursalID',
                sortable: false,
                center: true,
                cell: (props) => props.IDT == "esp" ? <span></span> : <span className="text-center"><strong>{props.SucursalID}</strong></span>,
                conditionalCellStyles: [
                    {
                        when: row => row.IDT == -1,
                        style: {
                            textAlign: 'center',
                            borderTop: '1px solid black',
                            backgroundColor: '#f0f0f0',
                            fontWeight: 'bold'
                        },
                    },
                ],
            }, */

    {
      name: "NombreSucursal",
      selector: "NombreSucursal",
      sortable: false,
      center: true,
      cell: (props) =>
        props.IDT == "esp" ? (
          <span></span>
        ) : (
          <span className="text-center">
            <strong>{props.NombreSucursal}</strong>
          </span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.IDT == -1,
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
      name: "NombreCaja",
      selector: "NombreCaja",
      sortable: false,
      center: true,
      cell: (props) => <span className="text-center">{props.NombreCaja}</span>,
      conditionalCellStyles: [
        {
          when: (row) => row.IDT == -1,
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
      name: "Cerrada",
      selector: "Cerrada",
      sortable: false,
      center: true,
      wrap: true,
      width: "7%",
      cell: (props) =>
        props.IDT == "esp" || props.IDT == -1 ? (
          <span></span>
        ) : props.Cerrada ? (
          <span className="text-center">
            <i className="fas fa-lock"></i>
          </span>
        ) : (
          <span className="text-center">
            <i className="fas fa-unlock"></i>
          </span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.IDT == -1,
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
      name: "Estatus",
      selector: "Estatus",
      sortable: false,
      center: true,
      wrap: true,
      width: "7%",
      cell: (props) =>
        props.IDT == "esp" || props.IDT == -1 ? (
          <span></span>
        ) : props.Estatus ? (
          <FaCircle color="green" title="Activo" />
        ) : (
          <FaCircle color="red" title="Inactivo" />
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.IDT == -1,
          style: {
            textAlign: "center",
            borderTop: "1px solid black",
            backgroundColor: "#f0f0f0",
            fontWeight: "bold",
          },
        },
      ],
    },
    //FechaUltimoArqueo
    {
      name: "Fecha Últ Arqueo",
      selector: "FechaUltimoArqueo",
      sortable: false,
      center: true,
      cell: (props) =>
        props.IDT == -1 || props.IDT == "esp" ? (
          <span></span>
        ) : props.FechaUltimoArqueo == "0001-01-01T00:00:00" ? (
          <span>S/A</span>
        ) : (
          <span className="text-center">
            {moment(props.FechaUltimoArqueo).format("DD-MM-yyyy hh:mm")}
          </span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.IDT == -1,
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
      name: "Realiza",
      selector: "UsuarioRealiza",
      sortable: false,
      center: true,
      cell: (props) =>
        props.IDT == -1 ? (
          <span>S/A</span>
        ) : (
          <span className="text-center">{props.UsuarioRealiza}</span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.IDT == -1,
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
        props.CuentaBancoID == "0" ? (
          <span>S/A</span>
        ) : (
          <span className="text-center">{props.CuentaBancoID}</span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.IDT == -1,
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
      name: "NombreCuenta",
      selector: "NombreCuenta",
      sortable: false,
      center: true,
      cell: (props) =>
        props.NombreCaja == "espacio" ? (
          <span></span>
        ) : (
          <span className="text-center">{props.NombreCuenta}</span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.IDT == -1,
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
      name: "Desc. de Cuenta",
      selector: "DescCuenta",
      sortable: false,
      center: true,
      cell: (props) =>
        props.IDT == "esp" ? (
          <span></span>
        ) : (
          <span className="text-center">{props.DescCuenta}</span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.IDT == -1,
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
      name: "Saldo Fisico",
      selector: "SaldoFisicoUltA",
      sortable: false,
      center: true,
      cell: (propss) =>
        propss.IDT == "esp" ? (
          <span></span>
        ) : (
          <span className="text-center">
            {FormateoDinero.format(propss.SaldoFisicoUltimoA)}
          </span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.IDT == -1,
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
      name: "Saldo Sistema",
      selector: "SaldoSistemaUltA",
      sortable: false,
      center: true,
      cell: (propss) =>
        propss.IDT == "esp" ? (
          <span></span>
        ) : (
          <span className="text-center">
            {FormateoDinero.format(propss.SaldoSistemaUltimoA)}
          </span>
        ),
      conditionalCellStyles: [
        {
          when: (row) => row.IDT == -1,
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

  const FNGetMultiSaldos = () => {
    const MySwal = withReactContent(Swal);

    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNGet(props.Seguridad)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          if (respuesta.length > 0) {
            let tabla: any[] = [];
            let primero = true;
            let sucursalAnterior = 0;
            let cajaAnterior = 0;
            let posicion = 0;
            let nombreSucursalAnterior: 0;
            console.log(respuesta);
            if (respuesta.length > 0) {
              if (respuesta[0].MultiSaldoArqueoID != null) {
                setState((s) => ({
                  ...s,
                  MultiSaldoID: respuesta[0].MultiSaldoArqueoID,
                }));
                respuesta.forEach((element) => {
                  posicion = posicion + 1;
                  if (primero) {
                    let detalle: any = {
                      IDT: element.IDT,
                      MensajeID: element.MensajeID,
                      SucursalID: element.SucursalID,
                      NombreSucursal: element.NombreSucursal,
                      Cerrada: element.Cerrada,
                      Estatus: element.Estatus,
                      CajaID: element.CajaID,
                      NombreCaja: element.NombreCaja,
                      CuentaBancoID: element.CuentaBancoID,
                      NombreCuenta: element.NombreCuenta,
                      DescCuenta: element.DescCuenta,
                      ArqueoID: element.ArqueoID,
                      UsuarioRealiza: element.UsuarioRealiza,
                      FechaUltimoArqueo: element.FechaUltimoArqueo,
                      SaldoSistemaUltimoA: element.SaldoSistemaUltimoA,
                      SaldoFisicoUltimoA: element.SaldoFisicoUltimoA,
                    };
                    tabla.push(detalle);
                    sucursalAnterior = element.SucursalID;
                    cajaAnterior = element.CajaID;
                    nombreSucursalAnterior = element.NombreSucursal;
                    primero = false;
                  } else {
                    if (element.SucursalID == sucursalAnterior) {
                      let detalle: any = {
                        IDT: element.IDT,
                        MensajeID: element.MensajeID,
                        SucursalID: element.SucursalID,
                        NombreSucursal: "-",
                        Cerrada:
                          cajaAnterior == element.CajaID
                            ? "-"
                            : element.Cerrada,
                        Estatus:
                          cajaAnterior == element.CajaID
                            ? "-"
                            : element.Estatus,
                        CajaID:
                          cajaAnterior == element.CajaID ? "-" : element.CajaID,
                        NombreCaja:
                          cajaAnterior == element.CajaID
                            ? "-"
                            : element.NombreCaja,
                        CuentaBancoID: element.CuentaBancoID,
                        NombreCuenta: element.NombreCuenta,
                        DescCuenta: element.DescCuenta,
                        ArqueoID: element.ArqueoID,
                        UsuarioRealiza: element.UsuarioRealiza,
                        FechaUltimoArqueo: element.FechaUltimoArqueo,
                        SaldoSistemaUltimoA: element.SaldoSistemaUltimoA,
                        SaldoFisicoUltimoA: element.SaldoFisicoUltimoA,
                      };
                      tabla.push(detalle);
                      sucursalAnterior = element.SucursalID;
                      cajaAnterior = element.CajaID;
                      nombreSucursalAnterior = element.NombreSucursal;
                    } else {
                      let filtro = respuesta.filter((valor: any) => {
                        return valor.SucursalID == sucursalAnterior;
                      });
                      let saldoFisicoTotal = 0;
                      let saldoSistemaTotal = 0;
                      filtro.forEach((element) => {
                        saldoFisicoTotal =
                          saldoFisicoTotal + element.SaldoFisicoUltimoA;
                        saldoSistemaTotal =
                          saldoSistemaTotal + element.SaldoSistemaUltimoA;
                      });

                      let objEsp = {
                        IDT: "esp",
                        FechaUltimoArqueo: "0001-01-01T00:00:00",
                      };

                      let objTotales = {
                        IDT: -1,
                        NombreCuenta: "Total Sucursal",
                        FechaUltimoArqueo: "0001-01-01T00:00:00",
                        DescCuenta: nombreSucursalAnterior,
                        SaldoFisicoUltimoA: saldoFisicoTotal,
                        SaldoSistemaUltimoA: saldoSistemaTotal,
                      };
                      tabla.push(objTotales);
                      tabla.push(objEsp);

                      let obj = {
                        IDT: element.IDT,
                        MensajeID: element.MensajeID,
                        SucursalID: element.SucursalID,
                        NombreSucursal: element.NombreSucursal,
                        Cerrada: element.Cerrada,
                        Estatus: element.Estatus,
                        CajaID:
                          cajaAnterior == element.CajaID ? "-" : element.CajaID,
                        NombreCaja:
                          cajaAnterior == element.CajaID
                            ? "-"
                            : element.NombreCaja,
                        CuentaBancoID: element.CuentaBancoID,
                        NombreCuenta: element.NombreCuenta,
                        DescCuenta: element.DescCuenta,
                        ArqueoID: element.ArqueoID,
                        UsuarioRealiza: element.UsuarioRealiza,
                        FechaUltimoArqueo: element.FechaUltimoArqueo,
                        SaldoSistemaUltimoA: element.SaldoSistemaUltimoA,
                        SaldoFisicoUltimoA: element.SaldoFisicoUltimoA,
                      };
                      tabla.push(obj);
                      sucursalAnterior = element.SucursalID;
                      cajaAnterior = element.CajaID;
                      nombreSucursalAnterior = element.NombreSucursal;
                    }

                    if (posicion == respuesta.length) {
                      let filtro = respuesta.filter((valor: any) => {
                        return valor.SucursalID == sucursalAnterior;
                      });
                      let saldoFisicoTotal = 0;
                      let saldoSistemaTotal = 0;
                      filtro.forEach((element) => {
                        saldoFisicoTotal =
                          saldoFisicoTotal + element.SaldoFisicoUltimoA;
                        saldoSistemaTotal =
                          saldoSistemaTotal + element.SaldoSistemaUltimoA;
                      });

                      let objEsp = {
                        IDT: "esp",
                        FechaUltimoArqueo: "0001-01-01T00:00:00",
                      };
                      let objTotal = {
                        IDT: -1,
                        NombreCuenta: "Total Sucursal",
                        FechaUltimoArqueo: "0001-01-01T00:00:00",
                        DescCuenta: nombreSucursalAnterior,
                        SaldoFisicoUltimoA: saldoFisicoTotal,
                        SaldoSistemaUltimoA: saldoSistemaTotal,
                      };

                      tabla.push(objTotal);

                      let totalTotalSistema = 0;
                      let totalTotalFisico = 0;
                      respuesta.forEach((element) => {
                        totalTotalSistema =
                          totalTotalSistema + element.SaldoSistemaUltimoA;
                        totalTotalFisico =
                          totalTotalFisico + element.SaldoFisicoUltimoA;
                      });
                      let objTotalTotal = {
                        IDT: -1,

                        DescCuenta: "Total Sucursales",
                        SaldoFisicoUltimoA: totalTotalFisico,
                        SaldoSistemaUltimoA: totalTotalSistema,
                      };
                      tabla.push(objTotalTotal);
                    }
                  }
                });
              }
            } else {
              MySwal.fire({
                icon: "error",
                html: (
                  <div>
                    <br />
                    <h3 className="text-center">Info</h3>
                    <div className={`modal-body`}>
                      <h5 className="text-center">
                        Ocurrió un problema al generar el multisaldos..
                      </h5>
                    </div>
                  </div>
                ),
                confirmButtonText: `Ok`,
                confirmButtonColor: `#3085d6`,
              });
            }

            setState((s) => ({
              ...s,
              Cargando: false,
              Error: false,
              Datos: tabla,
              DatosExcel: tabla,
            }));
          } else {
            MySwal.fire({
              icon: "info",
              html: (
                <div>
                  <br />
                  <h3 className="text-center">Info</h3>
                  <div className={`modal-body`}>
                    <h5 className="text-center">
                      Ocurrió un problema al generar el multisaldos..
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
        allowOutsideClick: false,
        allowEscapeKey: false,
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
          MySwal2.close();
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
        <Card Title="Multisaldos Arqueos">
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
                      <div className="column text-center is-full-desktop is-full-mobile">
                        <br />
                        <button
                          type="submit"
                          className="btn mx-1 btn-primary waves-effect waves-light" //disabled={state.estatusPeriodo != "A" ? true : false}
                          onClick={() => {
                            FNGetMultiSaldos();
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

export default connect(mapStateToProps, mapDispatchToProps)(MultiSaldosArqueos);
