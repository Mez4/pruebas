import React, { useEffect } from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";
import * as Funciones from "./CuentaMovimientosCuenta/Funciones";
import { toast } from "react-toastify";
import { ErrorMessage, Field, Formik } from "formik";
import { Form } from "usetheform";
import XLSX from "xlsx";
import Swal from "sweetalert2";

// Icons
import { FaBan, FaCircle, FaFilePdf, FaPrint } from "react-icons/fa";

// Custom components
import { ActionSelect, Card, DatePickeEnd, DatePickeStart, Spinner } from "../../../../global";
import { CForm } from "./CuentaMovimientosCuenta/CForm";
import ReactTooltip from "react-tooltip";
import moment from "moment";
import { FormateoDinero } from "../../../../../global/variables";
import { CFormCancelar } from "./CuentaMovimientosCuenta/CFormCancelar";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import withReactContent from "sweetalert2-react-content";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { FNGet } from "./CajasUsuarios/Funciones";

type CatalogosType = {
  oidc: IOidc;
};

const CuentaMovimientosCuenta = (props: CatalogosType) => {
  // Controll our mounted state
  let isMounted = React.useRef(true);
  const MySwal = withReactContent(Swal);

  const DatosDefecto = {
    NumeroCuentaPrincipal: "",
    DescripcionCuentaPrincipal: "",
    CuentaBancoID: 0,
    NumeroCuenta: "",
    DescripcionCuenta: "",
    SucursalID: 0,
    ProductoID: 0,
    TipoCuenta: "",
  };
  const Datos: any[] = [];
  const DatosMostrar: any[] = [];
  const OptPrincipales: any[] = [];
  const OptSucursales: any[] = [];
  const OptProductos: any[] = [];
  const [SaldoReal, setSaldoReal] = React.useState(0);

  const [state, setState] = React.useState({
    Datos,
    DatosMostrar,
    Filtro: "",
    Cargando: true,
    Error: false,
    CuentaBancariaPrincipalID: 0,
    OptPrincipales,
    OptSucursales,
    OptProductos,
    DatosExcel: [],
    CuentaBancoID: 0,
    Form: {
      Mostrar: false,
      Datos: DatosDefecto,
      Id: undefined,
    },
    FormCancelar: {
      Mostrar: false,
      Motivo: false,
      Datos: {
        MovimientoID: 0,
        MvCancelacion: "",
      },
      Id: undefined,
    },
  });

  const fngetMultisaldosCuenta = (id: any) => {
    Funciones.FNGetMultiSaldosCuentas(props.oidc, id)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          console.log("RESPUESTA ,", respuesta);
          setSaldoReal(respuesta.saldoTotalCuenta);
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setSaldoReal(0);
        }
      });
  };

  const FNGetLocal = (id: any, FechaInicio: any, FechaFinal: any) => {
    setState((s) => ({ ...s, Cargando: true, CuentaBancariaPrincipalID: id }));
    Funciones.FNGet(props.oidc, id)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          console.log("Cuenta seleccionada ,", id);
          console.log("DATOS: ", respuesta);
          fngetMultisaldosCuenta(id);

          var Excelit = respuesta.map((valor: any) => ({
            ProductoID: valor.ProductoId,
            MovimientoID: valor.MovimientoID,
            CatEstatusMovID:
              valor.CatEstatusMovID == 1
                ? "APLICADO"
                : valor.CatEstatusMovID == 2
                  ? "CANCELADO"
                  : valor.CatEstatusMovID == 3
                    ? "PENDIENTE"
                    : "APLICADO PARCIAL",
            CuentaID: valor.CuentaID,
            Importe: valor.Importe,
            // TipoMovimientoID: valor.TipoMovimientoID,
            TipoMovimiento: valor.TipoMovimiento,
            EstDsc: valor.EstDsc,
            UsuarioID: valor.UsuarioID,
            Nombre: valor.Nombre,
            Observaciones: valor.Observaciones,
            cancelacionObservacion: valor.cancelacionObservacion,
            cancelacionUsuarioNombre: valor.cancelacionUsuarioNombre,
            FechaCancelacion: valor.FechaCancelacion,
            FechaAfectacion: valor.FechaAfectacion
              ? moment(valor.FechaAfectacion)
                .utc()
                .format("DD-MM-YYYY HH:mm:ss A")
              : "NA",
            cancelacionFhRegistro: valor.cancelacionFhRegistro
              ? moment(valor.cancelacionFhRegistro)
                .utc()
                .format("DD-MM-YYYY HH:mm:ss A")
              : "NA",
            FechaCaptura: moment(valor.FechaCaptura)
              .utc()
              .format("DD-MM-YYYY HH:mm:ss A"),
            BalanceID: valor.BalanceID,
            FechaBalance: valor.FechaCaptura
              ? moment(valor.FechaCaptura).utc().format("DD-MM-YYYY HH:mm:ss A")
              : "N/A",
          }));
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: false,
            Datos: respuesta, //.map(respuesta=>({
            //     MovimientoID: respuesta.MovimientoID,
            //     CatEstatusMovID: respuesta.CatEstatusMovID,
            //     CuentaID: respuesta.CuentaID,
            //     Importe:  respuesta.Importe,
            //     TipoMovimiento: respuesta.TipoMovimiento,
            //     EstDsc: respuesta.EstDsc,
            //     UsuarioID: respuesta.UsuarioID,
            //     Nombre:  respuesta.Nombre,
            //     Observaciones: respuesta.Observaciones,
            //     CancelacionObservacion: respuesta.CancelacionObservacion,
            //     //TipoMovimiento: respuesta.TipoMovimiento
            //     cell: (data) =>
            //         <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
            //             <button disabled={data.EstDsc === 'Cancelado' || (data.TipoMovimiento !== 'Cargo' && data.TipoMovimiento !== 'Abono')} data-tip="true" data-for={`CancelarTooltip${data.CreditoID}`} className="asstext" style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse', }} type={"button"} onClick={() => {
            //                 FNCancelarMess(data)
            //             }}>
            //                 <FaBan />
            //             </button>
            //             <ReactTooltip id={`CancelarTooltip${data.CreditoID}`}
            //                 type="info"
            //                 effect="solid"
            //                 clickable
            //                 globalEventOff="click"
            //             >
            //                 Cancelar Movimiento
            //             </ReactTooltip>
            //         </div>

            //
            // })),
            DatosExcel: Excelit,
          }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, Cargando: false, Error: true, Datos: [] }));
        }
      });
  };

  const FNGetPrincipal = () => {
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNGetPrincipales(props.oidc)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          var principales = respuesta.map((valor: any) => {
            var obj = {
              value: valor.CuentaBancoID,
              label:
                valor.CuentaBancoID +
                " - " +
                valor.NumeroCuenta +
                " - " +
                valor.DescripcionCuenta,
            };
            return obj;
          });
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: false,
            OptPrincipales: principales,
          }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: true,
            OptPrincipales: [],
          }));
        }
      });
  };

  const FNGetEstadoCuentaPDF = () => {
    if (state.CuentaBancoID == 0) {
      toast.error("Favor de seleccionar una cuenta de banco primero.");
      return false;
    }
    MySwal.fire({
      title: "<strong>Descargar Estado de cuenta</strong>",
      icon: "question",
      html: (
        <div className="text-center">
          Se descargara el Estado de cuenta ¿Desea continuar?
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
        setState((s) => ({ ...s, Cargando: true }));
        Funciones.FNGetEstadoCuentaPDF(props.oidc, {
          CuentaBancoID: state.CuentaBancoID,
        })
          .then((pdf: any) => {
            const file = new Blob([pdf], {
              type: "application/pdf",
            });

            var url = window.URL.createObjectURL(file);
            var anchor = document.createElement("a");
            anchor.download = "myfile.pdf";
            anchor.href = url;
            setState((s) => ({ ...s, Cargando: false }));
            anchor.click();
          })
          .catch((error: any) => {
            setState((s) => ({ ...s, Cargando: false }));
            toast.error(
              "Error al descargar el archivo, intente descargar el archivo nuevamente o reportarlo a sistemas"
            );
          });
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

    XLSX.writeFile(wb, "MovimientosCuenta.xlsx");
  };

  const cbCerrarMotivo = () => {
    //set false state.Form.Motivo
    setState((s) => ({
      ...s,
      FormCancelar: { ...s.FormCancelar, Motivo: false },
    }));
    FNGetLocal(state.CuentaBancariaPrincipalID, fechaInicio, fechaFin);
  };
  const FNCancelarMess = (Datos: any) => {
    console.log("Datos Mod: ", Datos);
    setState((s) => ({
      ...s,
      FormCancelar: {
        ...s.FormCancelar,
        Motivo: true,
        Datos: {
          MovimientoID: Datos.MovimientoID,
          MvCancelacion: "",
        },
        Id: Datos.MovimientoID,
      },
    }));
  };

  const Columns: GridColDef[] = [
    {
      headerName: "MovimientoId",
      field: "MovimientoID",
      sortable: true,
      headerAlign: "center",
      flex: 2,
      renderCell: (row: any) => (
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          {row.value}
        </div>
      ),
    },
    {
      headerName: "Estatus Movimiento",
      field: "CatEstatusMovID",
      sortable: true,
      headerAlign: "center",
      flex: 3,
      renderCell: (row) => (
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          {row.value === 1 && <FaCircle color="green" title="Activo" />}
          {row.value === 2 && <FaCircle color="red" title="Cancelado" />}
          {row.value === 3 && <FaCircle color="yellow" title="Pendiente" />}
          {row.value === 4 && (
            <FaCircle color="orange" title="Aplicado Parcial" />
          )}
        </div>
      ),
    },
    {
      headerName: "CuentaID ",
      field: "CuentaID",
      sortable: true,
      headerAlign: "center",
      flex: 2,
      //cellClassName: "text-center",
      renderCell: (row: any) => (
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          {row.value}
        </div>
      ),
    },
    {
      headerName: "Fecha Afecta",
      field: "FechaAfectacion",
      sortable: true,
      headerAlign: "center",
      cellClassName: "text-center",
      flex: 2,
      renderCell: (props) => moment(props.value).format("DD/MM/YYYY"),
    },
    {
      headerName: "Fecha Captura",
      field: "FechaCaptura",
      sortable: true,
      headerAlign: "center",
      cellClassName: "text-center",
      flex: 2,
      renderCell: (props) => moment(props.value).format("DD/MM/YYYY"),
    },
    {
      headerName: "Fecha Cancelacion",
      field: "cancelacionFhRegistro",
      sortable: true,
      headerAlign: "center",
      cellClassName: "text-center",
      flex: 2,
      renderCell: (props) => moment(props.value).format("DD/MM/YYYY"),
    },
    {
      headerName: "Importe",
      field: "Importe",
      sortable: true,
      headerAlign: "center",
      flex: 2,
      renderCell: (row: any) => (
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          {FormateoDinero.format(row.value)}
        </div>
      ),
    },
    {
      headerName: "Tipo Mov",
      field: "TipoMovimiento",
      sortable: true,
      headerAlign: "center",
      flex: 4,
      renderCell: (row: any) => (
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          {row.value}
        </div>
      ),
    },
    {
      headerName: "Estatus",
      field: "EstDsc",
      sortable: true,
      headerAlign: "center",
      flex: 3,
      renderCell: (row: any) => (
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          {row.value}
        </div>
      ),
    },
    {
      headerName: "BalanceID",
      field: "BalanceID",
      sortable: true,
      headerAlign: "center",
      flex: 4,
      renderCell: (row: any) => (
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          {row.value}
        </div>
      ),
    },
    {
      headerName: "Usuario ID",
      field: "UsuarioID",
      sortable: true,
      headerAlign: "center",
      flex: 1,
      cellClassName: "text-center",
      renderCell: (row: any) => (row.value ? row.value : "-"),
    },
    {
      headerName: "Usuario Reg.",
      field: "Nombre",
      sortable: true,
      headerAlign: "center",
      flex: 2,
      cellClassName: "text-center",
      renderCell: (row: any) => (row.value ? row.value : "-"),
    },
    {
      headerName: "Observaciones",
      field: "Observaciones",
      sortable: true,
      headerAlign: "center",
      flex: 3,
      cellClassName: "text-center",
      renderCell: (row: any) => (row.value ? row.value : "-"),
    },
    {
      headerName: "Cancelacion Obs.",
      field: "cancelacionObservacion",
      sortable: true,
      headerAlign: "center",
      flex: 3,
      cellClassName: "text-center",
      renderCell: (row: any) => (row.value ? row.value : "-"),
    },
    {
      headerName: "Fecha Cancelación",
      field: "FechaCancelacion",
      sortable: true,
      headerAlign: "center",
      flex: 1,
      cellClassName: "text-center",
      renderCell: (props) =>
        !!props.value ? moment(props.value).format("DD/MM/YYYY") : "",
    },
    {
      headerName: "Usuario Cancelo",
      field: "cancelacionUsuarioNombre",
      sortable: true,
      headerAlign: "center",
      flex: 2,
      cellClassName: "text-center",
      renderCell: (row: any) => (row.value ? row.value : "-"),
    },
    {
      headerName: "Cancelar Movimiento",
      field: "",
      headerAlign: "center",
      flex: 1,
      renderCell: (cell: any) => (
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <button
            disabled={
              cell.row.Estatus === "C" ||
              (cell.row.TipoMovimientoID !== 40 &&
                cell.row.TipoMovimientoID !== 60)
            }
            data-tip="true"
            data-for={`CancelarTooltip${cell.row.value}`}
            className="asstext"
            style={{
              margin: ".15em",
              width: "15%",
              height: "40px",
              padding: "0px",
              tableLayout: "fixed",
              borderCollapse: "collapse",
            }}
            type={"button"}
            onClick={() => {
              FNCancelarMess(cell.row);
            }}
          >
            <FaBan />
          </button>
          <ReactTooltip
            id={`CancelarTooltip${cell.row.value}`}
            type="info"
            effect="solid"
            clickable
            globalEventOff="click"
          >
            Cancelar Movimiento
          </ReactTooltip>
        </div>
      ),
    },
  ];

  React.useEffect(() => {
    FNGetPrincipal();
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  // On use effect
  //   React.useEffect(() => {
  //     setState((s) => ({
  //       ...s,
  //       DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro),
  //     }));
  //     // eslint-disable-next-line
  //   }, [state.Datos, state.Filtro]);

  /** funcion Callback al agregar un item */
  const cbAgregar = (item: any) => {
    toast.success("La cuenta se agrego correctamente");

    setState({
      ...state,
      Datos: [...state.Datos, item],
      Form: {
        ...state.Form,
        Mostrar: false,
        Datos: {
          NumeroCuentaPrincipal: "",
          DescripcionCuentaPrincipal: "",
          CuentaBancoID: 0,
          NumeroCuenta: "",
          DescripcionCuenta: "",
          SucursalID: 0,
          ProductoID: 0,
          TipoCuenta: "",
        },
      },
    });
  };

  /** funcion Callback al actualizar un item */
  const cbActualizar = (item: any) => {
    setState({
      ...state,
      Datos: state.Datos.map((Dato) =>
        Dato.TipoID === item.TipoID ? item : Dato
      ),
      Form: {
        ...state.Form,
        Mostrar: false,
        Datos: {
          NumeroCuentaPrincipal: "",
          DescripcionCuentaPrincipal: "",
          CuentaBancoID: 0,
          NumeroCuenta: "",
          DescripcionCuenta: "",
          SucursalID: 0,
          ProductoID: 0,
          TipoCuenta: "",
        },
      },
    });
    toast.success("La cuenta se actualizó correctamente");
  };

  /** funcion para cancelar la forma */
  const fnCancelar = () =>
    setState({
      ...state,
      Form: {
        ...state.Form,
        Mostrar: false,
        Datos: {
          NumeroCuentaPrincipal: "",
          DescripcionCuentaPrincipal: "",
          CuentaBancoID: 0,
          NumeroCuenta: "",
          DescripcionCuenta: "",
          SucursalID: 0,
          ProductoID: 0,
          TipoCuenta: "",
        },
      },
    });

  const hoy = new Date();
  const haceUnMes = new Date();
  haceUnMes.setMonth(hoy.getMonth() - 1);
  const [fechaInicio, setFechaInicio] = React.useState<Date | null>(haceUnMes);
  const [fechaFin, setFechaFin] = React.useState<Date | null>(hoy);

  const filtrarPorFechas = () => {
    if (!fechaInicio || !fechaFin) {
      toast.error("Selecciona ambas fechas para filtrar.");
      return;
    }

    const inicio = moment(fechaInicio).startOf("day");
    const fin = moment(fechaFin).endOf("day");

    const filtrado = state.Datos.filter((mov) => {
      const fecha = moment(mov.FechaCaptura);
      return fecha.isBetween(inicio, fin, undefined, "[]");
    });

    setState((s) => ({ ...s, DatosMostrar: filtrado }));
  };

  return (
    <div className="row">
      <div className="col-12">
        <Card Title="Movimientos Cuentas">
          <Card.Body>
            <Card.Body.Content>
              <Formik
                initialValues={state.Datos}
                enableReinitialize
                onSubmit={(values: any) => { }}
              >
                <Form>
                  <div
                    className="column is-full-desktop is-full-mobile is-full-tablet"
                    style={{
                      backgroundColor: "#F7F7F7",
                      padding: "1em",
                      borderRadius: "15px",
                    }}
                  >
                    <div className="row">
                      {/* DatePickers y selector de cuenta en la misma fila */}
                      <div className="column is-3-desktop">
                        <label className="label">Fecha Inicio</label>
                        <DatePicker
                          selected={fechaInicio}
                          onChange={(date: Date | null) => setFechaInicio(date)}
                          dateFormat="yyyy-MM-dd"
                          className="form-control"
                          placeholderText="Selecciona fecha"
                          maxDate={new Date()}
                        />
                      </div>
                      <div className="column is-3-desktop">
                        <label className="label">Fecha Fin</label>
                        <DatePicker
                          selected={fechaFin}
                          onChange={(date: Date | null) => setFechaFin(date)}
                          dateFormat="yyyy-MM-dd"
                          className="form-control"
                          placeholderText="Selecciona fecha"
                          maxDate={new Date()}
                        />
                      </div>
                      <div className="column is-3-desktop">
                        <Field name={"CuentaBancoID"} className="form-select">
                          {({ field }) => (
                            <ActionSelect
                              disabled={false}
                              label="Seleccione una cuenta:"
                              name="CuentaBancoID"
                              placeholder={"Seleccione una cuenta"}
                              options={state.OptPrincipales.map((optn) => ({
                                value: optn.value,
                                label: optn.label,
                              }))}
                              addDefault={true}
                              valor={state.CuentaBancoID}
                              accion={(value: any) => {
                                // IF > 0
                                if (value > 0) {
                                  setState((s) => ({
                                    ...s,
                                    CuentaBancoID: value,
                                  }));
                                  FNGetLocal(value, fechaInicio, fechaFin);
                                } else {
                                  setState((s) => ({
                                    ...s,
                                    CuentaBancoID: 0,
                                    Datos: [],
                                  }));
                                }
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          component="div"
                          name={"CuentaBancoID"}
                          className="text-danger"
                        />
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="column is-half-desktop is-full-mobile is-full-tablet is-align-items-center">
                        <h3>
                          Total de la cuenta: {FormateoDinero.format(SaldoReal)}{" "}
                        </h3>
                      </div>
                      <div className="column is-half-desktop is-full-mobile is-full-tablet is-align-items-center">
                        <div className="text-end">
                          <>
                            <button
                              disabled={false}
                              type={"button"}
                              className={
                                "btn btn-success waves-effect waves-light mr-2"
                              }
                              onClick={() => {
                                FNGetEstadoCuentaPDF();
                              }}
                            >
                              <span>PDF</span>&nbsp;
                              <FaFilePdf />
                            </button>
                            <button
                              disabled={false}
                              type={"button"}
                              className={
                                "btn btn-success waves-effect waves-light"
                              }
                              onClick={() => {
                                generarXLSX();
                              }}
                            >
                              <span>Excel</span>&nbsp;
                              <FaPrint />
                            </button>
                          </>
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              </Formik>
              {state.Cargando && <Spinner />}
              {state.Error && <span>Error al cargar los datos...</span>}
              {!state.Cargando && !state.Error && (
                <div className="mt-3">
                  <DataGrid
                    columns={Columns}
                    density="compact"
                    rows={state.Datos}
                    getRowId={(row) => row.MovimientoID}
                    // disableColumnFilter
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: 10, page: 0 },
                      },
                    }}
                    pageSizeOptions={[10, 20, 30]}

                  // paginationComponentOptions={{ rowsPerPageText: 'Resultados por página:', rangeSeparatorText: 'of', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'Todos' }}
                  // subHeader

                  // subHeaderComponent={
                  //     <div className="row">
                  //         <div className="input-group pb-3 mb-10">
                  //             <input type="text" className="form-control" placeholder="Buscar tipo de cuenta" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                  //             <span className="input-group-text"><FaSearch /> </span>
                  //             <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal(state.CuentaBancariaPrincipalID)}><FiRefreshCcw /></button>
                  //         </div>
                  //     </div>
                  // }
                  // noDataComponent={
                  //     <div className="text-center">
                  //         Selecciona una cuenta
                  //     </div>
                  // }
                  // data={state.DatosMostrar}
                  // striped
                  // pagination
                  // dense
                  // noHeader
                  // responsive
                  // keyField={"CuentaBancoID"}
                  // defaultSortField={"CuentaBancoID"}
                  // columns={Columns}
                  />

                  {/* <DataTable
                                        paginationComponentOptions={{ rowsPerPageText: 'Resultados por página:', rangeSeparatorText: 'of', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'Todos' }}
                                        subHeader

                                        subHeaderComponent={
                                            <div className="row">
                                                <div className="input-group pb-3 mb-10">
                                                    <input type="text" className="form-control" placeholder="Buscar tipo de cuenta" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                    <span className="input-group-text"><FaSearch /> </span>
                                                    <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal(state.CuentaBancariaPrincipalID)}><FiRefreshCcw /></button>
                                                </div>
                                            </div>
                                        }
                                        noDataComponent={
                                            <div className="text-center">
                                                Selecciona una cuenta
                                            </div>
                                        }
                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"CuentaBancoID"}
                                        defaultSortField={"CuentaBancoID"}
                                        columns={Columns}
                                    /> */}

                  <ModalWin
                    open={state.Form.Mostrar}
                    large={true}
                    center={true}
                  >
                    <ModalWin.Header>
                      <h5 className={MODAL_TITLE_CLASS}>Replicar cuenta</h5>
                    </ModalWin.Header>
                    <ModalWin.Body>
                      {
                        <CForm
                          oidc={props.oidc}
                          initialValues={state.Form.Datos}
                          Id={state.Form.Id}
                          cbActualizar={cbActualizar}
                          cbGuardar={cbAgregar}
                          fnCancelar={fnCancelar}
                          OptSucursales={state.OptSucursales}
                          OptProductos={state.OptProductos}
                        />
                      }
                    </ModalWin.Body>
                  </ModalWin>

                  {state.FormCancelar.Motivo && (
                    <ModalWin open={state.FormCancelar.Motivo} large center>
                      <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>
                          {"Cancelación de Movimiento"}
                        </h5>
                        <button
                          title="Cerrar"
                          type="button"
                          className="delete"
                          onClick={() => cbCerrarMotivo()}
                        />
                      </ModalWin.Header>
                      <ModalWin.Body>
                        {state.Form.Datos! && (
                          <CFormCancelar
                            cbCerrarMotivo={cbCerrarMotivo}
                            initialValues={state.FormCancelar.Datos}
                            // callBack={cbActualizar}
                            oidc={props.oidc}
                            Id={state.FormCancelar.Id}
                          />
                        )}
                      </ModalWin.Body>
                    </ModalWin>
                  )}
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
  oidc: state.oidc,
});

const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CuentaMovimientosCuenta);
