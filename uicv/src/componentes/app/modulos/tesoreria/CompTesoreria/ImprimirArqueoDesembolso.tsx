import React, { useState } from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import * as Funciones from "./ImprimirArqueoDesembolso/Funciones";

// Icons
import { FaSearch, FaFilter, FaPrint, FaBan } from "react-icons/fa";

// Custom components
import {
  ActionSelect,
  Card,
  CustomFieldText,
  CustomSelect,
  DatePickeEnd,
  DatePickeStart,
  Spinner,
} from "../../../../global";

// import { CForm } from './CreditoCredito/CForm'
import { FiRefreshCcw } from "react-icons/fi";
import { FiltrarDatos } from "../../../../../global/functions";
import { DBConfia_Creditos } from "../../../../../interfaces_db/DBConfia/Creditos";
import * as Yup from "yup";
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
import { Sucursales, Zonas } from "../../../../selectores";
import { format } from "path";

type CatalogosType = {
  oidc: IOidc;
  ui: iUI;
  Filtro2: boolean;

  initialValues: {
    FechaInicio: string;
    ZonaID: number;
    SucursalID: number;
  };
  Options: { value: number; label: string }[];
  fnPrinting(loading: boolean): any;
  DatosExcel: any[];
};

type EstadoTipo = {
  Datos: any[];
  DatosMostrar: any[];
  optTipoDesembolso;
  DatosTabla;
  DatosExcel: any[];
  FiltroEncargado: number;
  Filtro2: boolean;

  DatosFormik: {
    FechaInicio: "";
    SucursalID: 0;
    ZonaID: 0;
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

const ImprimirArqueoDesembolso = (props: CatalogosType) => {
  let isMounted = React.useRef(true);
  const MySwal = withReactContent(Swal);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const [state, setState] = React.useState<EstadoTipo>({
    Datos: [],
    DatosMostrar: [],
    DatosTabla: [],
    optTipoDesembolso: [],
    FiltroEncargado: 0,
    DatosExcel: [],
    Filtro2: false,
    Filtro: "",
    DatosFormik: {
      FechaInicio: "",
      SucursalID: 0,
      ZonaID: 0,
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
      name: "ID",
      selector: "ArqueosDesembolsoID",
      center: true,
      sortable: false,
      width: "100px",
      cell: (propss) => (
        <span className="text-center">{propss.ArqueosDesembolsoID}</span>
      ),
    },
    {
      center: true,
      name: "Sucursal",
      selector: "Nombre",
      sortable: false,
      width: "130px",
      cell: (propss) => <span className="text-center">{propss.Nombre}</span>,
    },
    {
      name: "Fecha Desembolsos",
      selector: "FechaReporte",
      center: true,
      sortable: false,
      width: "120px",
      cell: (propss) => (
        <span className="text-center">
          {moment(propss.FechaReporte).utc().format("DD-MM-YYYY HH:mm:ss A")}
        </span>
      ),
    },
    {
      name: "Vales Desembolsados",
      selector: "ValesDesembolsados",
      center: true,
      sortable: false,
      width: "100px",
      cell: (propss) => (
        <span className="text-center">{propss.ValesDesembolsados}</span>
      ),
    },
    {
      name: "Vales Capturados",
      selector: "ValesCapturados",
      center: true,
      sortable: false,
      width: "80px",
      cell: (propss) => (
        <span className="text-center">{propss.ValesCapturados}</span>
      ),
    },
    {
      name: "Diferencia Vales",
      selector: "DiferenciaVales",
      sortable: false,
      center: true,
      width: "80px",
      cell: (propss) => (
        <span className="text-center">{propss.DiferenciaVales}</span>
      ),
    },
    {
      center: true,
      name: "Desembolsado Sistema",
      selector: "ImporteDesembolsadoSistema",
      sortable: false,
      width: "110px",
      cell: (propss) => (
        <span className="text-center">
          {FormateoDinero.format(propss.ImporteDesembolsadoSistema)}
        </span>
      ),
    },
    {
      center: true,
      name: "Efectivo Capturado",
      selector: "ImporteDesembolsado",
      sortable: false,
      width: "110px",
      cell: (propss) => (
        <span className="text-center">
          {FormateoDinero.format(propss.ImporteDesembolsado)}
        </span>
      ),
    },
    {
      center: true,
      name: "Diferencia Importe",
      selector: "DiferenciaImporte",
      sortable: false,
      width: "130px",
      cell: (propss) => (
        <span className="text-center">
          {FormateoDinero.format(propss.DiferenciaImporte)}
        </span>
      ),
    },
    {
      center: true,
      name: "Observaciones",
      selector: "Observaciones",
      sortable: false,
      width: "130px",
      cell: (propss) => (
        <span className="text-center">
          {propss.Observaciones == null
            ? "Sin Observaciones"
            : propss.Observaciones}
        </span>
      ),
    },
    {
      name: "Realizo Arqueo Desembolso",
      selector: "NombreCompleto",
      sortable: false,
      center: true,
      width: "200px",
      cell: (propss) => (
        <span className="text-center">{propss.NombreCompleto}</span>
      ),
    },
    {
      name: "Fecha Arqueo Desembolso",
      selector: "FechaRegistra",
      center: true,
      sortable: false,
      width: "120px",
      cell: (propss) => (
        <span className="text-center">
          {moment(propss.FechaRegistra).utc().format("DD-MM-YYYY HH:mm:ss A")}
        </span>
      ),
    },
    {
      name: "Acción",
      sortable: false,
      center: true,
      width: "80px",
      cell: (values) => (
        <div>
          
        <button
          className="asstext"
          title="Imprimir Arqueo Desembolso"
          type={"button"}
          onClick={() => {
            console.log("imp", values);
            fnImprimir(values.ArqueosDesembolsoID);
          }}
        >
          <FaPrint />
        </button>
        {'\u00A0'}
        {'\u00A0'}
        
         <button
          className="asstext"
          disabled={values.Cancelado}
          title="Cancelar Arqueo Desembolso"
          type={"button"}
          // style={values.Cancelado == true ? {color:'gray'} : {color:'red'}}
          onClick={() => {
            console.log("imp", values);
            fnCancelarArqueo(values.ArqueosDesembolsoID);
          }}
        >
          <FaBan style={values.Cancelado == true ? {color:'gray'} : {color:'red'}}/>
        </button>
        </div>
        
      ),
    },
  ];

  const FNGet = (valor1: any, valor2: any, valor3: any) => {
    let a = {
      FechaInicio: valor1,
      ZonaID: valor2,
      SucursalID: valor3,
    };
    Funciones.FNgetbyfiltros(props.oidc, a)
      .then((respuesta: any) => {
        /* if (respuesta.length > 0) {
         */
console.log("respuestaaaa",respuesta)
        if (isMounted.current === true) {
          var Excelit = respuesta.map((valor: any) => {
            var obj = {
              CreditoID: valor.CreditoID,
              Cliente: valor.NombreCompleto,
              Folio_Vale: valor.ValeCanje,
              Estatus: valor.EstatusNombre,
              Tipo_Desembolso: valor.TipoDesembolso,
              Capital: valor.Capital,
              Fecha_Activacion: moment(valor.fechaHoraActivacion)
                .utc()
                .format("DD-MM-YYYY HH:mm:ss A"),
              Usuario_Captura: valor.NombreCompletoRegistra,
              Fecha_Registro: moment(valor.FechaHoraRegistro)
                .utc()
                .format("DD-MM-YYYY HH:mm:ss A"),
              SociaID: valor.DistribuidorID,
              Socia: valor.Distribuidor,
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
        fgColor: { rgb: "71d63e" },
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

    XLSX.writeFile(wb, "ConsultaArqueoDesembolso.xlsx");
  };
  const fnImprimir = (valor1: any) => {
    let a = {
      ArqueosDesembolsoID: valor1,
    };
    //setLoading(true)
    console.log("pdf2", a);
    Funciones.ImprimirPDF(props.oidc, a)
      .then((pdf: any) => {
        const file = new Blob([pdf], { type: "application/pdf" });

        console.log("pdf: ", pdf);

        // const fileURL = URL.createObjectURL(file);

        // //window.open(fileURL);

        // var url = window.URL.createObjectURL(file);
        // var anchor = document.createElement("a");
        // anchor.download = "myfile.pdf";
        // anchor.href = url;
        // anchor.click();
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

        setLoading(false);

        //ActualizaSaldos({ ...values, Importe: 0 })
      })
      .catch((error: any) => {
        console.log(JSON.stringify(error));

        toast.error(
          "Error al descargar el archivo, intente descargar el archivo o reportarlo a sistemas"
        );

        setLoading(false);

        // clearFormByLevel(0)
      });
  };

  const fnCancelarArqueo = (valor1: any) => {
    let Datos = {
      ArqueosDesembolsoID: valor1,
    };

    MySwal.fire({
      title: "<strong>Cancelar Arqueo Desembolso</strong>",
      icon: "warning",
      html: (
        <div className="text-center">
          Se cancelará el arqueo desembolso, estos cambios no serán revertidos ¿Desea continuar?
        </div>
      ),
      showCloseButton: false,
      showCancelButton: true,
      showConfirmButton: true,
      focusConfirm: false,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar",
      confirmButtonAriaLabel: "Aceptar",
      cancelButtonAriaLabel: "",
    }).then((result) => {
      if (result.isConfirmed) {
        Funciones.FNCancelarArqueo(props.oidc, Datos)
          .then((respuesta: any) => {
            toast.success("Arqueo Cancelado Correctamente") 
          })
          .catch((error: any) => {
            console.log(JSON.stringify(error));

            toast.error("Error al cancelar arqueo desembolso")

            setLoading(false);
          });
        }
      })
  };

  React.useEffect(() => {
    if (isMounted.current === true) {
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

  const [startDate, setStartDate] = useState(moment().toDate());
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
        <Card Title="IMPRIMIR ARQUEOS DESEMBOLSO">
          <Card.Body>
            <Card.Body.Content>
              <Formik
                initialValues={{
                  FechaInicio: startDate,
                  ZonaID: 0,
                  SucursalID: 0,
                }}
                enableReinitialize
                validationSchema={Yup.object().shape({
                  FechaInicio: Yup.date()
                    .required("Seleccione una Fecha(Obligatorio)")
                    .nullable(),
                  SucursalID: Yup.number().moreThan(
                    0,
                    "Seleccione una Sucursal(Obligatorio)"
                  ),
                })}
                onSubmit={(values: any) => {
                  console.log("Valores ,", values);

                  setLoading(true);
                  setState((s) => ({ ...s, Cargando: true }));
                  console.log("VALORES", values);
                  FNGet(values.FechaInicio, values.ZonaID, values.SucursalID);
                }}
              >
                {({ values }) => (
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
                            <DatePickeStart
                              name={"FechaInicio"}
                              label={"Fecha"}
                              disabled={loading}
                              placeholder={"Inicio"}
                              isClearable
                              startDate={startDate}
                              endDate={endDate}
                              setStartDate={setStartDate}
                            />
                          </div>
                          <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                            <Zonas
                              oidc={props.oidc}
                              cargar
                              disabled={loading}
                              name={"ZonaID"}
                            />
                          </div>
                          <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                            <Sucursales
                              disabled={loading}
                              name={"SucursalID"}
                              ZonaID={isNaN(values.ZonaID) ? 0 : values.ZonaID}
                              valor={values.SucursalID}
                            />
                          </div>
                        </div>
                        <div className="text-end column is-12-mobile is-12-tablet is-12-desktop mt-3">
                          <div className="text-end">
                            <button
                              disabled={loading}
                              type="submit"
                              className="btn btn-primary waves-effect waves-light"
                            >
                              <span className="">Buscar</span>&nbsp;
                              <FiRefreshCcw />
                            </button>

                            {/*<button disabled={state.Filtro2 ? false : true} type={"button"} className={"btn btn-success waves-effect waves-light"} onClick={() => {
                                                        generarXLSX()
                                                    }}>
                                                        <span className="">Excel</span>&nbsp;<FaPrint />
                                                </button>*/}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="columns is-centered is-mobile is-multiline">
                      {state.Cargando && <Spinner />}
                      {!state.Cargando && !state.Error && (
                        <DataTable
                          subHeader
                          noDataComponent={<div>No hay datos</div>}
                          subHeaderComponent={
                            <div className="row">
                              <div className="input-group pb-3 mb-10">
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
                          keyField={"ArqueosDesembolsoID"}
                          defaultSortField={"ArqueosDesembolsoID"}
                          columns={Columns}
                        />
                      )}
                    </div>
                  </Form>
                )}
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
)(ImprimirArqueoDesembolso);
