import React, { useState } from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import * as Funciones from "./ConsultaDispersionH2H/Funciones";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";

// Icons
import {
  FaPencilAlt,
  FaPlus,
  FaSearch,
  FaBan,
  FaCashRegister,
  FaListAlt,
  FaMoneyBill,
  FaMoneyBillAlt,
  FaMoneyCheck,
  FaDollarSign,
  FaCreditCard,
  FaFilter,
  FaPrint,
} from "react-icons/fa";

// Custom components
import {
  ActionSelect,
  Card,
  CustomSelect,
  DatePickeEnd,
  DatePickeStart,
  Spinner,
} from "../../../../global";
import { BuscarCreditos } from "./CreditosDispersionH2H/BuscarCreditos";
import { CFormFiltrosDispersion } from "./ConsultaDispersionH2H/CFormFiltrosDispersion";

// import { CForm } from './CreditoCredito/CForm'
import { FiRefreshCcw } from "react-icons/fi";
import { FiltrarDatos } from "../../../../../global/functions";
import { DBConfia_Creditos } from "../../../../../interfaces_db/DBConfia/Creditos";
import DatePicker, { registerLocale } from "react-datepicker";
import * as Yup from "yup";
import ReactTooltip from "react-tooltip";
import moment from "moment";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { DBConfia_STP } from "../../../../../interfaces_db/DBConfia/STP";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { FormateoDinero } from "../../../../../global/variables";
import { DispersarTarjeta } from "./CreditosDispersionH2H/DispersarTarjeta";
import { iUI } from "../../../../../interfaces/ui/iUI";
import XLSX from "xlsx";
import { toast } from "react-toastify";

type CatalogosType = {
  oidc: IOidc;
  ui: iUI;
  Filtro2: boolean;

  initialValues: {
    CuentaOrdenante: number;
    NombreOrdenante: string;
    Estatus: string;
    TipoCuenta: number;
    Cliente: string;
  };
  Options: { value: number; label: string }[];
  fnPrinting(loading: boolean): any;
  DatosExcel: any[];
};

type EstadoTipo = {
  Datos: DBConfia_STP.IDispersiones_VW[];
  DatosMostrar: DBConfia_STP.IDispersiones_VW[];
  DispersionesSeleccionadas: [];
  CantidadDispersionesSeleccionadas: number;
  optEstatus;
  otpTipoCuenta;
  optCuentasOrdenantes;
  optNombresOrdenandes;
  optDistribuidor;
  DatosTabla;
  DatosExcel: any[];
  FiltroEncargado: number;
  Filtro2: boolean;

  DatosFormik: {
    fechaInicial: "";
    //fechaFinal = format today date to YYYY-MM-DD to string
    fechaFinal: "";
    SucursalID: 0;
    EstatusSolicitudID: 0;
    EstatusClave: "";
  };
  Filtro: string;
  Cargando: boolean;
  Error: boolean;
  Detalle: boolean;
  RespRes: boolean;
  Form: {
    Mostrar: boolean;
  };
};

const ConsultarDispersionH2H = (props: CatalogosType) => {
  let isMounted = React.useRef(true);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const [state, setState] = React.useState<EstadoTipo>({
    Datos: [],
    DatosMostrar: [],
    optEstatus: [],
    optDistribuidor: [],
    DatosTabla: [],
    otpTipoCuenta: [],
    optCuentasOrdenantes: [],
    optNombresOrdenandes: [],
    FiltroEncargado: 0,
    DispersionesSeleccionadas: [],
    DatosExcel: [],
    Filtro2: false,

    CantidadDispersionesSeleccionadas: 0,
    Filtro: "",
    DatosFormik: {
      fechaInicial: "",
      //fechaFinal = format today date to YYYY-MM-DD to string
      fechaFinal: "",
      SucursalID: 0,
      EstatusSolicitudID: 0,
      EstatusClave: "",
    },
    Form: {
      Mostrar: false,
    },
    Cargando: false,
    Error: false,
    Detalle: false,
    RespRes: false,
  });

  const Columns: IDataTableColumn[] = [
    {
      name: "Clave STP",
      selector: "ClaveDispersionSTP",
      wrap: true,
      sortable: false,
      center: true,
    },
    {
      name: "Clave Rastreo",
      center: true,
      selector: "ClaveRastreo",
      wrap: true,
      sortable: false,
      cell: (propss) => (
        <span className="text-center">{propss.ClaveRastreo}</span>
      ),
    },
    {
      name: "Nombre Cliente",
      center: true,
      width: "10%",
      selector: "NombreCompleto",
      sortable: false,
      cell: (props) => (
        <>
          <span
            className="text-center"
            data-tip
            data-for={`NombreCompletoTooltip${props.CreditoID}`}
          >
            {props.NombreCompleto}
          </span>
          <ReactTooltip
            id={`NombreCompletoTooltip${props.CreditoID}`}
            type="dark"
            effect="solid"
            clickable
            globalEventOff="click"
          >
            {props.NombreCompleto}
          </ReactTooltip>
        </>
      ),
    },
    {
      center: true,
      name: "Total",
      selector: "Capital",
      sortable: false,
      format: (row) => FormateoDinero.format(row.Capital),
    },
    {
      center: true,
      name: "Cuenta Beneficiario",
      selector: "CuentaBeneficiario",
      sortable: false,
      cell: (props) => (
        <span className="text-center">{props.CuentaBeneficiario}</span>
      ),
    },
    {
      center: true,
      name: "Tipo Cuenta",
      selector: "DescripcionTipoCuenta",
      sortable: false,
      cell: (props) => (
        <span className="text-center">{props.DescripcionTipoCuenta}</span>
      ),
    },
    {
      center: true,
      name: "Banco",
      selector: "BancoNombre",
      sortable: false,
      cell: (props) => <span className="text-center">{props.BancoNombre}</span>,
    },
    {
      center: true,
      name: "Estatus",
      selector: "EstadoDisp",
      sortable: false,
      cell: (props) => <span className="text-center">{props.EstadoDisp}</span>,
    },
    {
      center: true,
      name: "Causa Dev.",
      selector: "CausaDevolucion",
      sortable: false,
      cell: (props) =>
        props.ClaveEstatus == "CN" || props.ClaveEstatus == "D" ? (
          <span className="text-center">{props.CausaDevolucion}</span>
        ) : (
          <span className="text-center">-</span>
        ),
    },
    {
      center: true,
      name: "Fecha Origen",
      selector: "FechaRegistro",
      sortable: false,
      cell: (props) => (
        <span className="text-center">
          {moment(props.FechaRegistro).format("DD/MM/YYYY hh:mm:ss")}
        </span>
      ),
    },
    {
      center: true,
      name: "Fecha Actualización",
      selector: "FechaActualizacion",
      sortable: false,
      cell: (props) =>
        props.FechaActualizacion ? (
          <span className="text-center">
            {moment(props.FechaActualizacion).format("DD/MM/YYYY hh:mm:ss")}
          </span>
        ) : (
          <span className="text-center">S/N STP</span>
        ),
    },
    /* {
                name: 'Acciones', sortable: false, center: true,
                cell: (propss) => <div className='text-center'>
                    <button className="asstext mx-1" type={"button"} onClick={() => {
                        console.log(propss)
                    }}>
                        <FaPencilAlt />
                    </button>
                    <button disabled={propss.datoBancario == null ? false : true} data-tip data-for={`DetailToolTip${propss.CreditoID}`} className="asstext mx-1" type={"button"} onClick={() => {
                        //state Form.Mostrar = true
                        setState({
                            ...state,
                            Form: {
                                ...state.Form,
                                Mostrar: true
                            }
                        })



                    }}>
                        <FaCreditCard />
                    </button>
                    <ReactTooltip id={`DetailToolTip${propss.CreditoID}`}
                        type="info"
                        effect="solid"
                        clickable
                        globalEventOff="click"
                    >
                        {propss.datoBancario == null && "Desembolsar a tarjeta de débito"}
                        {propss.datoBancario != null && "Cliente cuenta con CLABE registrada"}
                    </ReactTooltip>
                </div>
            }, */
  ];

  const FNGet = (
    valor1: any,
    valor2: any,
    valor3: any,
    valor4: any,
    valor5: any,
    valor6: any,
    valor7: any
  ) => {
    let a = {
      FechaInicio: valor1,
      FechaFin: valor2,
      CuentaOrdenante: valor3,
      NombreOrdenante: valor4,
      NombreBeneficiario: valor5,
      EstadoDispersionID: valor6,
      ClaveTipoCuenta: valor7,
    };
    Funciones.FNgetbyfiltros(props.oidc, a)
      .then((respuesta: any) => {
        /* if (respuesta.length > 0) {
         */

        if (isMounted.current === true) {
          var Excelit = respuesta.map((valor: any) => {
            var obj = {
              ClaveSTP: valor.ClaveDispersionSTP,
              Clave_Rastreo: valor.ClaveRastreo,
              Nombre_Cliente: valor.NombreBeneficiario,
              Total: valor.Monto,
              Cta_Beneficiario: valor.CuentaBeneficiario,
              Tipo_Cuenta: valor.DescripcionTipoCuenta,
              Banco: valor.BancoNombre,
              Estatus: valor.EstadoDisp,
              Causa_Dev: valor.CausaDevolucion,
              Fecha_Origen: valor.FechaRegistro,
              Fecha_Actualizacion: valor.FechaActualizacion,
            };
            return obj;
          });

          setState((s) => ({
            ...s,
            Cargando: false,
            Datos: respuesta,
            RespRes: true,
            DatosExcel: Excelit,
            Filtro2: true,
          }));
          setLoading(false);
        }
        /*  } */
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            Cargando: false,
            Datos: [],
            DatosExcel: [],
            Filtro2: false,
          }));
          setLoading(false);
        }
      });
  };

  const generarXLSX = () => {
    toast.success("Excel Generado");

    const XLSX = require("xlsx-js-style");

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(state.DatosExcel);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const styleHeader = {
      font: {
        name: "Calibri",
        sz: 12,
        bold: true,
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
      fill: {
        fgColor: { rgb: "DC143C" },
      },
      wpx: 800,
    };

    var range = XLSX.utils.decode_range(ws["!ref"]);
    var noRows = range.e.r; // No.of rows
    var noCols = range.e.c; // No. of cols

    for (let i in ws) {
      if (typeof ws[i] != "object") continue;
      let cell = XLSX.utils.decode_cell(i);
      if (cell.r === 0) {
        ws[i].s = styleHeader;
      }
    }

    XLSX.writeFile(wb, "ConsultaDispersion.xlsx");
  };
  const fnImprimir = () => {
    setLoading(true);
    toast.success("PDF Generado");

    Funciones.Imprimirdispersion(props.oidc)
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
        props.fnPrinting(false);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setState((s) => ({ ...s, error: true, DatosTabla: [] }));
      });
  };
  const FNGetEstatus = () => {
    Funciones.FNGetEstatus(props.oidc)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          var Estado = respuesta.map((valor: any) => {
            var obj = {
              value: valor.EstadoDispersionID,
              label: valor.Clave + " - " + valor.Estado,
            };
            return obj;
          });
          console.log("ESTADO ,", Estado);

          setState((s) => ({ ...s, optEstatus: Estado }));

          // }
        }
      })
      .catch(() => {
        // if (isMounted.current === true) {
        setState((s) => ({ ...s, options: [] }));
        // }
      });
  };
  const FNGetTipoCuentaBancario = () => {
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNGetTipoCuentaBancario(props.oidc)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          var Estado = respuesta.map((valor: any) => {
            var obj = { value: valor.TipoCuentaID, label: valor.Descripcion };
            return obj;
          });
          console.log("ESTADO ,", Estado);

          setState((s) => ({ ...s, otpTipoCuenta: Estado, Cargando: false }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: true,
            otpTipoCuenta: [],
          }));
        }
      });
  };
  const FNGetCuentaOrdenanteo = () => {
    Funciones.FNGetCuentaOrdenanteo(props.oidc)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          let valor = 0;
          respuesta.forEach((element) => {
            console.log("ITERANDO");
            valor += 1;
            element["value"] = valor;
          });

          var Estado = respuesta.map((valor: any) => {
            var obj = { value: valor.value, label: valor.CuentaOrdenante };
            console.log("OBJETO ,", obj);
            return obj;
          });
          setState((s) => ({
            ...s,
            optCuentasOrdenantes: Estado,
            Cargando: false,
          }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            optCuentasOrdenantes: [],
            Cargando: false,
          }));
        }
      });
  };
  const FNGetNombreOrdenante = () => {
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNGetNombreOrdenante(props.oidc)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          let valor = 0;
          console.log("RESPUESTA N ORDENANTE ,", respuesta);
          respuesta.forEach((element) => {
            console.log("ITERANDO");
            valor += 1;
            element["value"] = valor;
          });

          var Estado = respuesta.map((valor: any) => {
            var obj = { value: valor.value, label: valor.NombreOrdenante };
            console.log("OBJETO2 ,", obj);
            return obj;
          });
          setState((s) => ({
            ...s,
            optNombresOrdenandes: Estado,
            Cargando: false,
          }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            optNombresOrdenandes: [],
            Cargando: false,
          }));
        }
      });
  };

  React.useEffect(() => {
    if (isMounted.current === true) {
      FNGetNombreOrdenante();
      FNGetTipoCuentaBancario();
      FNGetEstatus();
      FNGetCuentaOrdenanteo();
    }
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
  const fnCancelar = () =>
    setState({
      ...state,
      Form: {
        ...state.Form,
        Mostrar: false,
      },
    });
  const [loading, setLoading] = React.useState(false);
  const [nombreOrdenante, setnombreOrdenante] = React.useState("");
  const [cuentaOrdenante, setcuentaOrdenante] = React.useState("");

  const [startDate, setStartDate] = useState(moment().add(-30, "d").toDate());
  const [endDate, setEndDate] = useState(moment().toDate());
  const funcionCargando = (cargando: any) => {
    //Seteo el estado de cargando
    setState({ ...state, Cargando: cargando });
  };
  const fnGetFiltrosEncargado = (FiltroEncargado: number) => {
    setState((s) => ({ ...s, FiltroEncargado: FiltroEncargado }));
  };
  const cbRespuesta = (Datos: any) =>
    setState((s) => ({ ...s, Datos: Datos, Cargando: false }));

  return (
    <div className="row">
      <div className="col-12">
        <Card Title="Consultar dispersiones">
          <Card.Body>
            <Card.Body.Content>
              <Formik
                initialValues={{
                  FechaInicio: moment().add(-30, "d").toDate(),
                  FechaFin: new Date(),
                  CuentaOrdenante: 0,
                  NombreOrdenante: "",
                  EstatusID: 0,
                  TipoCuentaID: 0,
                  NombreCliente: "",
                }}
                enableReinitialize
                /*  validationSchema={
                                     Yup.object().shape({
                                         FechaInicio: Yup.string().required("Seleccione la fecha inicial").typeError("Seleccione la fecha inicial"),
                                         FechaFin: Yup.string().required("Seleccione la fecha final").typeError("Seleccione la fecha final")
                                     })} */
                onSubmit={(values: any) => {
                  console.log("Valores ,", values);
                  values.NombreOrdenante = nombreOrdenante;
                  values.CuentaOrdenante = cuentaOrdenante;
                  console.log("Valores actualizados ,", values);

                  setLoading(true);
                  setState((s) => ({ ...s, Cargando: true }));
                  console.log("VALORES", values);
                  FNGet(
                    values.FechaInicio,
                    values.FechaFin,
                    values.CuentaOrdenante,
                    values.NombreOrdenante,
                    values.NombreCliente,
                    values.EstatusID,
                    values.TipoCuentaID
                  );
                }}
              >
                <Form>
                  <div className="columns is-centered is-mobile is-multiline">
                    <div
                      className="column is-full-desktop is-full-mobile is-full-tablet"
                      style={{
                        backgroundColor: "#F7F7F7",
                        padding: "2em",
                        borderRadius: "15px",
                      }}
                    >
                      <div>
                        <div style={{ float: "left" }}>
                          <FaFilter />
                        </div>
                        <div>
                          <label> FILTROS</label>
                        </div>
                      </div>
                      <div className="row" style={{ textAlign: "initial" }}>
                        <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                          <ActionSelect
                            disabled={loading}
                            label="Cuenta Ordenante"
                            name="CuentaOrdenante"
                            placeholder="Elige Cuenta"
                            options={state.optCuentasOrdenantes}
                            addDefault={true}
                            valor={state.FiltroEncargado}
                            accion2={(val) =>
                              setcuentaOrdenante(val.NombreSucursal)
                            }
                          />
                        </div>
                        <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                          <ActionSelect
                            disabled={loading}
                            label="Nombre Ordenante"
                            name="NombreOrdenante"
                            placeholder="Elige Nombre Ordenante"
                            options={state.optNombresOrdenandes}
                            addDefault={true}
                            valor={state.FiltroEncargado}
                            accion2={(val) =>
                              setnombreOrdenante(val.NombreSucursal)
                            }
                            // accion={FNGetEstatus}
                          />
                        </div>
                        <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                          <ActionSelect
                            disabled={loading}
                            label="Estatus"
                            name="EstatusID"
                            placeholder="Elige Estatus"
                            options={state.optEstatus}
                            addDefault={true}
                            valor={state.FiltroEncargado}
                            //accion={FNGetEstatus}
                          />
                        </div>
                        <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                          <ActionSelect
                            disabled={loading}
                            label="Tipo Cuenta Beneficiario"
                            name="TipoCuentaID"
                            placeholder="Elige Tipo Cuenta"
                            options={state.otpTipoCuenta}
                            addDefault={true}
                            valor={state.FiltroEncargado}
                            //  accion={e => []}
                          />
                        </div>
                        <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                          <div className="mb-3">
                            <label
                              className="form-label mb-0"
                              htmlFor={"NombreCliente"}
                            >
                              Nombre Cliente
                            </label>
                            <Field
                              disabled={loading}
                              id={"NombreCliente"}
                              name={"NombreCliente"}
                            >
                              {(control: any) => (
                                <input
                                  type="text"
                                  placeholder="Escribe el nombre del cliente"
                                  className="form-control"
                                  value={control.field.value}
                                  disabled={loading}
                                  onChange={(value) => {
                                    control.form.setFieldValue(
                                      "NombreCliente",
                                      value.target.value
                                    );
                                  }}
                                />
                              )}
                            </Field>
                          </div>
                        </div>

                        <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                          <DatePickeStart
                            name={"FechaInicio"}
                            label={"Fecha Inicial"}
                            disabled={loading}
                            placeholder={"Inicio"}
                            isClearable
                            startDate={startDate}
                            endDate={endDate}
                            setStartDate={setStartDate}
                          />
                        </div>
                        <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                          <DatePickeEnd
                            name={"FechaFin"}
                            label={"Fecha Final"}
                            disabled={loading}
                            placeholder={"Final"}
                            isClearable
                            startDate={startDate}
                            endDate={endDate}
                            setEndDate={setEndDate}
                          />
                        </div>
                        <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                          <br />
                          <div className="text-center">
                            <button
                              disabled={loading}
                              type="submit"
                              className="btn btn-primary waves-effect waves-light"
                            >
                              <span className="">Buscar</span>&nbsp;
                              <FiRefreshCcw />
                            </button>
                          </div>
                        </div>
                        <div>
                          <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                            <div>
                              <button
                                disabled={state.Filtro2 ? false : true}
                                type={"button"}
                                className={
                                  "btn btn-primary waves-effect waves-light"
                                }
                                onClick={() => {
                                  fnImprimir();
                                }}
                              >
                                <span className="">PDF</span>&nbsp;
                                <FaPrint />
                              </button>
                            </div>
                            <div>
                              <button
                                disabled={state.Filtro2 ? false : true}
                                type={"button"}
                                className={
                                  "btn btn-primary waves-effect waves-light"
                                }
                                onClick={() => {
                                  generarXLSX();
                                }}
                              >
                                <span className="">Excel</span>&nbsp;
                                <FaPrint />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="columns is-centered is-mobile is-multiline">
                    {state.Cargando && <Spinner />}
                    {!state.Cargando && !state.Error && (
                      <DataTable
                        subHeader
                        key={"DispersionID"}
                        paginationComponentOptions={{
                          noRowsPerPage: false,
                          rowsPerPageText: "Dispersiones por página",
                          rangeSeparatorText: "de",
                          selectAllRowsItem: false,
                          selectAllRowsItemText: "Todos",
                        }}
                        noDataComponent={<div>No hay datos</div>}
                        subHeaderComponent={
                          <div className="row">
                            <div className="input-group pb-3 mb-10">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar dispersión"
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
                            </div>
                          </div>
                        }
                        data={state.DatosMostrar}
                        striped
                        pagination
                        dense
                        responsive
                        keyField={"DispersionID"}
                        defaultSortField={"DispersionID"}
                        columns={Columns}
                      />
                    )}
                    {/*                                 {state.Cargando && <Spinner />}
                     */}
                  </div>
                </Form>
              </Formik>
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
)(ConsultarDispersionH2H);
