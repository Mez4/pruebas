import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import * as Funciones from "./ArqueoDesembolso/Funciones";

// Icons
import { FaSearch, FaFilter, FaPrint } from "react-icons/fa";

// Custom components
import {
  ActionAsyncSelect,
  ActionSelect,
  Card,
  CustomFieldDatePicker,
  CustomFieldText,
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
import { ErrorMessage, Form, Formik } from "formik";
import { FormateoDinero } from "../../../../../global/variables";
import { iUI } from "../../../../../interfaces/ui/iUI";
import XLSX from "xlsx";
import { toast } from "react-toastify";
import { Sucursales, Zonas } from "../../../../selectores";

type CatalogosType = {
  oidc: IOidc;
  ui: iUI;
  Filtro2: boolean;

  initialValues: {
    // FechaInicio: string,
    ZonaID: number;
    SucursalID: number;
    ValesCapturados: number;
    ImporteDesembolsado: number;
    Observaciones: string;
  };
  Options: { value: number; label: string }[];
  //optZonas: { value: number, label: string }[],
  fnPrinting(loading: boolean): any;
  DatosExcel: any[];
};

type EstadoTipo = {
  Datos: DBConfia_Creditos.ICreditos_VW[];
  DatosMostrar: DBConfia_Creditos.ICreditos_VW[];
  optTipoDesembolso;
  optZonas;
  optSucursales;
  DatosTabla;
  DatosExcel: any[];
  FiltroEncargado: number;
  Filtro2: boolean;

  DatosFormik: {
    FechaInicio: "";
    SucursalID: 0;
    ZonaID: 0;
    ValesCapturados: 0;
    ImporteDesembolsado: 0;
    Observaciones: "";
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

const ArqueosDesembolso = (props: CatalogosType) => {
  let isMounted = React.useRef(true);

  const [tipoUsuario, setTipoUsuario] = useState(0);

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
    optZonas: [],
    optSucursales: [],
    FiltroEncargado: 0,
    DatosExcel: [],
    Filtro2: false,
    Filtro: "",
    DatosFormik: {
      FechaInicio: "",
      SucursalID: 0,
      ZonaID: 0,
      ValesCapturados: 0,
      ImporteDesembolsado: 0,
      Observaciones: "",
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
      name: "CreditoID",
      selector: "CreditoID",
      center: true,
      sortable: false,
      width: "7%",
      cell: (propss) => <span className="text-center">{propss.CreditoID}</span>,
    },
    {
      center: true,
      name: "Cliente",
      selector: "NombreCompleto",
      sortable: false,
      width: "15%",
      cell: (propss) => (
        <span className="text-center">{propss.NombreCompleto}</span>
      ),
    },
    {
      name: "Folio Vale",
      selector: "ValeCanje",
      center: true,
      sortable: false,
      width: "9%",
      cell: (propss) => <span className="text-center">{propss.ValeCanje}</span>,
    },
    {
      name: "Estatus",
      selector: "EstatusNombre",
      center: true,
      sortable: false,
      width: "10%",
      cell: (propss) => (
        <span className="text-center">{propss.EstatusNombre}</span>
      ),
    },
    {
      name: "Tipo Desembolso",
      selector: "TipoDesembolso",
      center: true,
      sortable: false,
      width: "8%",
      cell: (propss) => (
        <span className="text-center">{propss.TipoDesembolso}</span>
      ),
    },
    {
      name: "Capital",
      selector: "Capital",
      sortable: false,
      center: true,
      width: "9%",
      cell: (props) => (
        <span className="text-center">
          {FormateoDinero.format(props.Capital)}
        </span>
      ),
    },
    {
      center: true,
      name: "Fecha Activación",
      selector: "fechaHoraActivacion",
      sortable: false,
      width: "10%",
      cell: (propss) => (
        <span className="text-center">
          {moment(propss.fechaHoraActivacion)
            .utc()
            .format("DD-MM-YYYY HH:mm:ss A")}
        </span>
      ),
    },
    {
      center: true,
      name: "Usuario Captura",
      selector: "NombreCompletoRegistra",
      sortable: false,
      width: "15%",
      cell: (propss) => (
        <span className="text-center">{propss.NombreCompletoRegistra}</span>
      ),
    },
    {
      name: "Fecha Registro",
      selector: "FechaHoraRegistro",
      sortable: false,
      center: true,
      width: "10%",
      cell: (propss) => (
        <span className="text-center">
          {moment(propss.FechaHoraRegistro)
            .utc()
            .format("DD-MM-YYYY HH:mm:ss A")}
        </span>
      ),
    },
    {
      name: "SociaID",
      selector: "DistribuidorID",
      center: true,
      sortable: false,
      width: "7%",
      cell: (propss) => (
        <span className="text-center">{propss.DistribuidorID}</span>
      ),
    },
    {
      name: "Socia",
      selector: "Distribuidor",
      center: true,
      sortable: false,
      width: "15%",
      cell: (propss) => (
        <span className="text-center">{propss.Distribuidor}</span>
      ),
    },
  ];

  const FnGetZonas = () => {
    Funciones.FNGetZonas(props.oidc)
      .then((respuesta: any) => {
        var zonas = respuesta.map((valor: any) => {
          var obj = { value: valor.ZonaID, label: valor.Nombre };
          return obj;
        });
        setState((s) => ({ ...s, optZonas: zonas }));
      })
      .catch(() => {
        setState((s) => ({ ...s, optZonas: [] }));
      });
  };

  const FnGetSucursales = () => {
    Funciones.FNGetSucursales(props.oidc)
      .then((respuesta: any) => {
        var sucursales = respuesta.map((valor: any) => {
          var obj = { value: valor.SucursalID, label: valor.Nombre };
          return obj;
        });
        setState((s) => ({ ...s, optSucursales: sucursales }));
      })
      .catch(() => {
        setState((s) => ({ ...s, optSucursales: [] }));
      });
  };

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
      .catch((err) => {
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
  const fnImprimir = (
    valor1: any,
    valor2: any,
    valor3: any,
    valor4: any,
    valor5: any,
    valor6: any
  ) => {
    // mandar una fecha del dia de ayer con moment
    let a: any = {
      FechaInicio: moment(valor1).format("YYYY-MM-DD"),
      ZonaID: valor2,
      SucursalID: valor3,
      ValesCapturados: valor4,
      ImporteDesembolsado: valor5,
      Observaciones: valor6,
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
      .catch(async (error: any) => {
        console.log("error", error);
      
        let mensaje = "Ocurrió un error al generar el PDF.";
      
        if (error.response && error.response.data instanceof Blob) {
          try {
            const textoError = await error.response.data.text(); 
            const jsonError = JSON.parse(textoError); 
            mensaje = jsonError.message || textoError;
          } catch (e) {
            mensaje = "Error al procesar la respuesta del servidor.";
          }
        } else if (error.message) {
          mensaje = error.message;
        }
      
        toast.error(mensaje);
        setLoading(false);
      });
      
  };

  useEffect(() => {
    setState((s) => ({
      ...s,
      DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro),
    }));
    // eslint-disable-next-line
  }, [state.Datos, state.Filtro]);

  const [loading, setLoading] = React.useState(false);

  const [startDate, setStartDate] = useState(moment().add(-10, "d").toDate());
  const [endDate, setEndDate] = useState(moment().toDate());

  const GetRolUsuario = () => {
    setLoading(true);
    Funciones.FNGetTipoUsuario(props.oidc, { usuarioID: 0 })
      .then((respuesta: any) => {
        setTipoUsuario(respuesta.tipoUsuario);
        switch (respuesta.tipoUsuario) {
          case 3:
            state.DatosFormik.SucursalID = respuesta.SucursalID;
            state.DatosFormik.ZonaID = respuesta.ZonaID;
            break;
        }
        //setLoading(false);
      })
      .catch((error) => console.log("error!", error))
      .finally(() => setLoading(false));
  };
  console.log("datostabla", state.Datos.length);

  useEffect(() => {
    GetRolUsuario();
    FnGetZonas();
    FnGetSucursales();
  }, [tipoUsuario]);

  useEffect(() => {
    // setStartDate(moment().toDate());
    // setEndDate(moment().toDate());
  }, []);

  return (
    <div className="row">
      <div className="col-12">
        <Card Title="ARQUEOS DESEMBOLSO">
          <Card.Body>
            <Card.Body.Content>
              <Formik
                initialValues={
                  tipoUsuario == 3
                    ? state.DatosFormik
                    : {
                      FechaInicio: moment().toDate(),
                      ZonaID: 0,
                      SucursalID: 0,
                      ValesCapturados: 0,
                      ImporteDesembolsado: 0,
                      Observaciones: "",
                    }
                }
                enableReinitialize
                validationSchema={Yup.object().shape({
                  FechaInicio: Yup.date()
                    .required("Seleccione una Fecha (Obligatorio)")
                    .max(new Date(), "La fecha no puede ser en el futuro"),
                  SucursalID: Yup.number().moreThan(0, "Seleccione una Sucursal(Obligatorio)"),
                  // ZonaID: Yup.number().moreThan(0, "Seleccione una Zona(Obligatorio)"),
                  ValesCapturados: Yup.number().moreThan(
                    0,
                    "Ingrese Vales Capturados(Obligatorio)"
                  ),
                  ImporteDesembolsado: Yup.number().moreThan(
                    0,
                    "Ingrese Importe Desembolsado(Obligatorio)"
                  ),
                  ZonaID: Yup.number().moreThan(0, "Seleccione una Zona(Obligatorio)"),
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
                            {/* <DatePickeStart
                              name={"FechaInicio"}
                              label={"Fecha"}
                              disabled={loading}
                              placeholder={"Inicio"}
                              isClearable
                              startDate={startDate}
                              endDate={endDate}
                              setStartDate={setStartDate}
                            /> */}
                            <CustomFieldDatePicker
                              name={'FechaInicio'}
                              label={'Fecha'}
                              disabled={false}
                              key={`FechaInicio`}
                              startDate={startDate}
                              endDate={endDate}
                            />
                            <ErrorMessage component="div" name="FechaInicio" className="text-danger" />
                          </div>
                          <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                            <ActionSelect
                              disabled={loading || tipoUsuario == 3}
                              label="Zona"
                              name="ZonaID"
                              placeholder="Seleccione la Zona"
                              options={state.optZonas}
                              addDefault={true}
                              valor={values.ZonaID}
                            />
                          </div>
                          <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                            <ActionSelect
                              disabled={loading || tipoUsuario == 3}
                              label="Sucursal"
                              name="SucursalID"
                              placeholder="Seleccione la Sucursal"
                              options={state.optSucursales}
                              addDefault={true}
                              valor={values.SucursalID}
                            />
                          </div>
                          <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                            <CustomFieldText
                              disabled={loading}
                              label="Vales Capturados"
                              name="ValesCapturados"
                              placeholder="Vales Capturados(Obligatorio)"
                            />
                          </div>
                        </div>
                        <div className="columns is-centered is-mobile is-multiline">
                          <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                            <CustomFieldText
                              disabled={loading}
                              label="Importe Desembolsado"
                              name="ImporteDesembolsado"
                              placeholder="Importe Desembolsado(Obligatorio)"
                            />
                          </div>
                          <div className="column is-three-quarters-desktop is-full-mobile is-full-tablet is-align-items-center ">
                            <CustomFieldText
                              disabled={loading}
                              label="Observaciones"
                              name="Observaciones"
                              placeholder="Ingrese Observaciones(Opcional)"
                            />
                          </div>
                        </div>
                        <div className="text-end column is-12-mobile is-12-tablet is-12-desktop mt-3">
                          <div className="text-end">
                            {/* <button disabled={loading} type="submit" className="btn btn-primary waves-effect waves-light">
                                                        <span className="">Buscar</span>&nbsp;<FiRefreshCcw />
                                                        
                                </button>*/}

                            <button
                              type={"button"}
                              className={
                                "btn btn-success waves-effect waves-light mx-2"
                              }
                              onClick={() => {
                                console.log("pdf", values);
                                fnImprimir(
                                  values.FechaInicio,
                                  values.ZonaID,
                                  values.SucursalID,
                                  values.ValesCapturados,
                                  values.ImporteDesembolsado,
                                  values.Observaciones
                                );
                              }}
                            >
                              <span className="">Generar</span>&nbsp;
                              <FaPrint />
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

                    {/*<div className="columns is-centered is-mobile is-multiline">
                                        {state.Cargando && <Spinner />}
                                        {!state.Cargando && !state.Error && <DataTable
                                            subHeader
                                            noDataComponent={<div>No hay datos</div>}
                                            subHeaderComponent=
                                            {
                                                <div className="row">
                                                    <div className="input-group pb-3 mb-10">
                                                        <input type="text" className="form-control" placeholder="Buscar" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                    </div>

                                                </div>
                                            }
                                            data={state.DatosMostrar}
                                            striped
                                            pagination
                                            dense
                                            responsive
                                            keyField={"CreditoID"}
                                            defaultSortField={"CreditoID"}
                                            columns={Columns}

                                        />}
                                        </div>*/}
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

export default connect(mapStateToProps, mapDispatchToProps)(ArqueosDesembolso);
