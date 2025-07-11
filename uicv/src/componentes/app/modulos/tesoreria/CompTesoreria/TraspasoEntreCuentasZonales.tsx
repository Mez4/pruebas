import React, { useRef } from "react";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import { connect, useSelector } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";
import * as Funciones from "./TraspasoEntreCuentasZonales/Funciones";
import { toast } from "react-toastify";
import { ErrorMessage, Field, Formik } from "formik";
import { Form } from "usetheform";
import { iUI } from "../../../../../interfaces/ui/iUI";
import * as FnCajas from "../../tesoreria/CompTesoreria/CajasUsuarios/Funciones";
import DatePicker, { registerLocale } from "react-datepicker";
import * as Yup from "yup";

// Icons
import { FaFile, FaPlus, FaPlusCircle, FaPrint, FaTimes } from "react-icons/fa";

// Custom components
import { Card, Spinner } from "../../../../global";
import { FiRefreshCcw } from "react-icons/fi";
import { FiltrarDatos } from "../../../../../global/functions";
import ReactTooltip from "react-tooltip";
import { SeleccionarCajaSucursal } from "../../../../selectores";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FormateoDinero } from "../../../../../global/variables";
import ButtonCambiarCajaSucursal from "../../../../global/ButtonCambiarCajaSucursal";

type CatalogosType = {
  pds: iUI;
  oidc: IOidc;
};
const MySwal = withReactContent(Swal);

const TraspasoEntreCuentasZonales = (props: CatalogosType) => {
  let isMounted = React.useRef(true);
  const refDeMovs = useRef<HTMLTextAreaElement>(null);
  const [errorCantidad, setErrorCantidad] = React.useState(false);
  const [habilitarCuentaOrigen, setHabilitarCuentaOrigen] =
    React.useState(false);
  const [habilitarCuentaDestino, setHabilitarCuentaDestino] =
    React.useState(true);
  const [habilitarCantidad, setHabilitarCantidad] = React.useState(true);
  const [habilitarAceptar, setHabilitarAceptar] = React.useState(true);
  const [habilitarAgregarMovimiento, setHabilitarAgregarMovimiento] =
    React.useState(true);
  const [habilitarConcepto, setHabilitarConcepto] = React.useState(true);
  const [habilitarImprimir, setHabilitarImprimir] = React.useState(true);

  const CajaDefault = {
    ProductoID: 0,
    SucursalID: 0,
    CajaID: 0,
  };

  const DatosDefecto = {
    Fecha: new Date(),
    Concepto: "",
    Cargo: 0.0,
    Abono: 0.0,
    Cantidad: 0.0,
    CuentaOrigenID: 0,
    EmpresaIDOrigen: 0,
    CuentaOrigenLabel: "",
    OrigenSucursalID: 0,
    OrigenCajaID: 0,
    OrigenTipoMov: 0,
    CuentaDestinoID: 0,
    EmpresaIDDestino: 0,
    CuentaDestinoLabel: "",
    DestinoSucursalID: 0,
    DestinoCajaID: 0,
    DestinoTipoMov: 0,
  };
  const Datos: any[] = [];
  const DatosMostrar: any[] = [];
  const DatosTabla: any[] = [];

  const OptSucursales: any[] = [];
  const OptionsMovimientosRetiro: any[] = [];
  const OptionsMovimientosDeposito: any[] = [];

  const [state, setState] = React.useState({
    Form: {
      Datos: DatosDefecto,
    },
    CajaDefault,
    DatosTabla,
    DatosMostrar,
    OptSucursales,
    Producto: "",
    OptionsMovimientosRetiro,
    OptionsMovimientosDeposito,
    Filtro: "",
    Cargando: true,
    Error: false,
    CuentaBancariaPrincipalID: 0,
    ShowCaja: true,
    SucursalSeleccionadaID: 0,
    CajaSeleccionadaID: 0,
    Cantidad: 0,
  });

  React.useEffect(() => {
    setState({ ...state, DatosTabla: [], Form: { Datos: DatosDefecto } });

    setHabilitarCuentaOrigen(false);
    setHabilitarCuentaDestino(true);
    setHabilitarCantidad(true);
    setHabilitarConcepto(true);
    setHabilitarAgregarMovimiento(true);
    setHabilitarAceptar(true);
    setHabilitarImprimir(true);
    return () => {
      isMounted.current = false;
    };
  }, [state.ShowCaja]);
  React.useEffect(() => {
    if (state.Form.Datos.Concepto.length > 6) {
      setHabilitarAgregarMovimiento(false);
    } else {
      setHabilitarAgregarMovimiento(true);
    }
  }, [state.Form.Datos.Concepto]);

  const fnGetSucursalesCaja = () => {
    FnCajas.FNGetSucursales(props.oidc)
      .then((respuesta: any) => {
        var sucursales = respuesta.map((valor: any) => {
          var obj = { value: valor.SucursalID, label: valor.Sucursal };
          return obj;
        });

        setState((s) => ({ ...s, OptSucursales: sucursales }));
      })
      .catch(() => {
        setState((s) => ({ ...s, OptSucursales: [] }));
      });
  };

  const FNGetMovimientosRetiro = (CajaID: number) => {
    let a = {
      CajaID: CajaID,
    };
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNGetRetiro(props.oidc, a)
      .then((respuesta: any) => {
        var movimientosRetiro = respuesta.map((valor: any) => {
          var obj = {
            value: valor.CuentaBancoId,
            label:
              "" +
              valor.CuentaBancoId +
              ": " +
              valor.NombreCaja +
              " - N° Cta: " +
              valor.NumeroCuenta +
              " - " +
              valor.TipoMovimiento,
            cajaID: valor.CajaID,
            tipoMovimientoID: valor.Id,
          };
          return obj;
        });
        setState((s) => ({
          ...s,
          OptionsMovimientosRetiro: movimientosRetiro,
          Cargando: false,
        }));
      })
      .catch(() => {
        setState((s) => ({
          ...s,
          OptionsMovimientosRetiro: [],
          Cargando: false,
        }));
      });
  };

  const FNTraspaso = (
    CuentaOrigenID: number,
    CuentaDestinoID: number,
    Cantidad: number,
    CajaID: number,
    SucursalID: number,
    Concepto: string
  ) => {
    let a = {
      CuentaOrigenID: CuentaOrigenID,
      CuentaDestinoID: CuentaDestinoID,
      Cantidad: Cantidad,
      CajaID: CajaID,
      SucursalID: SucursalID,
      Concepto: Concepto,
    };
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNGetTraspaso(props.oidc, a)
      .then((respuesta: any) => {
        setState((s) => ({ ...s, Traspaso: respuesta, Cargando: false }));
        console.log("respues", respuesta);
        toast.success(respuesta.msj);
        setHabilitarImprimir(false);
      })
      .catch((error: any) => {
        setState((s) => ({ ...s, Traspaso: "", Cargando: false }));
        if (error.response) toast.error(`ERROR: ${error.response.data}`);
        else if (error.request) toast.error(`ERROR: ${error}`);
        else toast.error(`${error}`);
      });
  };
  const generarTraspaso = () => {
    //cargando = true
    setState((s) => ({ ...s, Cargando: true }));
    FNTraspaso(
      state.Form.Datos.CuentaOrigenID,
      state.Form.Datos.CuentaDestinoID,
      state.Form.Datos.Cantidad,
      state.CajaSeleccionadaID,
      state.SucursalSeleccionadaID,
      state.Form.Datos.Concepto
    );
  };

  const FNGetMovimientosDeposito = (CajaID: number) => {
    let a = {
      CajaID: CajaID,
    };
    console.log("Datos GET Cuenta Deposito :", a);
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNGetDeposito(props.oidc, a)
      .then((respuesta: any) => {
        var movimientosDeposito = respuesta.map((valor: any) => {
          var obj = {
            value: valor.CuentaBancoId,
            label:
              "" +
              valor.CuentaBancoId +
              ": " +
              valor.NombreCaja +
              " - N° Cta: " +
              valor.NumeroCuenta +
              " - " +
              valor.TipoMovimiento,
            cajaID: valor.CajaID,
            tipoMovimientoID: valor.Id,
          };

          return obj;
        });
        setState((s) => ({
          ...s,
          OptionsMovimientosDeposito: movimientosDeposito,
          Cargando: false,
        }));
        setHabilitarCuentaDestino(false);
      })
      .catch((error: any) => {
        console.log("ERROR EN GET MOVIMIENTOS DEPOSITO ,", error);
        setState((s) => ({
          ...s,
          OptionsMovimientosDeposito: [],
          Cargando: false,
        }));
      });
  };

  const fnSetSucCaja = (Data: any) => {
    setState((s) => ({
      ...s,
      SucursalSeleccionadaID: Data.SucursalID,
      CajaSeleccionadaID: Data.CajaID,
      ShowCaja: false,
    }));
    FNGetMovimientosRetiro(Data.CajaID);
  };

  const FNImprimir = () => {
    if (state.Form.Datos.CuentaOrigenID > 0) {
      let timerInterval;
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        icon: "info",
        html: (
          <div>
            <br />
            <h3 className="text-center">Aviso</h3>
            <div className={`modal-body`}>
              <h5 className="text-center">Generando PDF.</h5>
            </div>
          </div>
        ),
        timerProgressBar: true,
        confirmButtonText: `Ok`,
        timer: 38000,
        didOpen: () => {
          MySwal.showLoading();
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      });
      let a = {
        CuentaOrigenID: state.Form.Datos.CuentaOrigenID,
        CuentaDestinoID: state.Form.Datos.CuentaDestinoID,
        Cantidad: state.Form.Datos.Cantidad,
        Concepto: state.Form.Datos.Concepto,
      };
      Funciones.FNPrintTraspaso(props.oidc, a)
        .then((pdf: any) => {
          // props.cbActualizar(respuesta)
          // console.log(pdf)

          const file = new Blob([pdf], { type: "application/pdf" });

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

          // setCompleted(0)
        })
        .catch(() => {
          if (isMounted.current === true) {
          }
        });
    } else {
      toast.info("Ocurrió un problema al generar el traspaso");
    }
  };

  React.useEffect(() => {
    fnGetSucursalesCaja();
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  const abrirSeleccionarCaja = () => {
    //update properties of state.CajaDefault to current selected
    setState((s) => ({
      ...s,
      CajaDefault: {
        ...s.CajaDefault,
        SucursalID: state.SucursalSeleccionadaID,
        CajaID: state.CajaSeleccionadaID,
      },
      ShowCaja: true,
    }));
  };

  return (
    <div className="row">
      <div className="col-12">
        <Card
          Title="Traspaso entre cuentas zonales"
          TitleEnd={
            !state.ShowCaja ? (
              <ButtonCambiarCajaSucursal accion={abrirSeleccionarCaja} />
            ) : null
          }
        >
          <Card.Body>
            <Card.Body.Content>
              {state.Cargando && <Spinner />}
              {state.Error && <span>Error al cargar los datos...</span>}
              {!state.Cargando && !state.Error && (
                <div>
                  <Formik
                    initialValues={state.Form.Datos}
                    enableReinitialize
                    validationSchema={Yup.object().shape({
                      Cantidad: Yup.number()
                        .required("Campo requerido")
                        .moreThan(0, "La cantidad debe ser mayor a 0"),
                    })}
                    onSubmit={(values: any) => {}}
                  >
                    <Form>
                      <div>
                        <div className="row">
                          <div
                            className="columns is-centered is-mobile is-multiline"
                            style={{ paddingTop: "5% !important" }}
                          >
                            <div className="column is-align-items-center is-one-quarter-desktop is-half-tablet is-full-mobile">
                              <div className="mb-3">
                                <label
                                  className="form-label mb-0"
                                  htmlFor={"Fecha"}
                                >
                                  Fecha
                                </label>
                                <br />
                                <Field
                                  disabled={true}
                                  id={"Fecha"}
                                  name={"Fecha"}
                                >
                                  {(control: any) => (
                                    <DatePicker
                                      className="form-control"
                                      selected={control.field.value}
                                      disabled={true}
                                      onChange={(value: any) => {
                                        control.form.setFieldValue(
                                          "Fecha",
                                          value
                                        );
                                        setState({
                                          ...state,
                                          Form: {
                                            ...state.Form,
                                            Datos: {
                                              ...state.Form.Datos,
                                              Fecha: value,
                                            },
                                          },
                                        });
                                      }}
                                      //  minDate={new Date}
                                      locale="es"
                                      dateFormat="dd-MM-yyyy"
                                    />
                                  )}
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  name={"Fecha"}
                                  className="text-danger"
                                />
                              </div>
                            </div>

                            <div className="column is-align-items-center is-one-quarter-desktop is-half-tablet is-full-mobile">
                              <div className="mb-3">
                                <label
                                  className="form-label mb-0"
                                  htmlFor={"CuentaOrigenID"}
                                >
                                  Cuenta origen:
                                </label>
                                <Field
                                  name={"CuentaOrigenID"}
                                  className="form-select"
                                >
                                  {(control: any) => (
                                    <select
                                      className="form-select"
                                      value={control.field.value}
                                      disabled={habilitarCuentaOrigen}
                                      onChange={(value: any) => {
                                        let itemSeleccionado =
                                          state.OptionsMovimientosRetiro.find(
                                            (res: any) => {
                                              return (
                                                res.value ===
                                                parseInt(value.target.value)
                                              );
                                            }
                                          );
                                        if (itemSeleccionado) {
                                          console.log(
                                            "ITEM SELECTED , ",
                                            itemSeleccionado
                                          );
                                          control.form.setFieldValue(
                                            "CuentaOrigenID",
                                            parseInt(value.target.value)
                                          );
                                          control.form.setFieldValue(
                                            "CuentaOrigenLabel",
                                            itemSeleccionado.label
                                          );
                                          control.form.setFieldValue(
                                            "OrigenSucursalID",
                                            itemSeleccionado.sucursalID
                                          );
                                          control.form.setFieldValue(
                                            "OrigenCajaID",
                                            itemSeleccionado.cajaID
                                          );
                                          control.form.setFieldValue(
                                            "OrigenTipoMov",
                                            itemSeleccionado.tipoMovimientoID
                                          );

                                          setState({
                                            ...state,
                                            Form: {
                                              ...state.Form,
                                              Datos: {
                                                ...state.Form.Datos,
                                                CuentaOrigenID: parseInt(
                                                  value.target.value
                                                ),
                                                CuentaOrigenLabel:
                                                  itemSeleccionado.label,
                                                OrigenSucursalID:
                                                  itemSeleccionado.sucursalID,
                                                OrigenCajaID:
                                                  itemSeleccionado.cajaID,
                                                OrigenTipoMov:
                                                  itemSeleccionado.tipoMovimientoID,
                                              },
                                            },
                                          });
                                        }
                                        FNGetMovimientosDeposito(
                                          state.CajaSeleccionadaID
                                        );
                                      }}
                                      id={"CuentaOrigenID"}
                                      name={"CuentaOrigenID"}
                                    >
                                      <option value="0">
                                        {"Selecciona la cuenta"}
                                      </option>
                                      {state.OptionsMovimientosRetiro.map(
                                        (optn, index) => (
                                          <option
                                            key={index}
                                            value={optn.value}
                                            label={optn.label}
                                          />
                                        )
                                      )}
                                    </select>
                                  )}
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  name={"CuentaOrigenID"}
                                  className="text-danger"
                                />
                              </div>
                            </div>
                            <div className="column is-align-items-center is-one-quarter-desktop is-half-tablet is-full-mobile">
                              <div className="mb-3">
                                <label
                                  className="form-label mb-0"
                                  htmlFor={"CuentaDestinoID"}
                                >
                                  Cuenta destino:
                                </label>
                                <Field
                                  name={"CuentaDestinoID"}
                                  className="form-select"
                                >
                                  {(control: any) => (
                                    <select
                                      className="form-select"
                                      value={control.field.value}
                                      onChange={(value: any) => {
                                        let itemSeleccionado =
                                          state.OptionsMovimientosDeposito.find(
                                            (res: any) => {
                                              return (
                                                res.value ===
                                                parseInt(value.target.value)
                                              );
                                            }
                                          );
                                        if (itemSeleccionado) {
                                          console.log(
                                            "ITEM SELECCIONADO DESTINO ",
                                            itemSeleccionado
                                          );
                                          control.form.setFieldValue(
                                            "CuentaDestinoID",
                                            parseInt(value.target.value)
                                          );
                                          control.form.setFieldValue(
                                            "CuentaDestinoLabel",
                                            itemSeleccionado.label
                                          );
                                          control.form.setFieldValue(
                                            "DestinoSucursalID",
                                            itemSeleccionado.sucursalID
                                          );
                                          control.form.setFieldValue(
                                            "DestinoCajaID",
                                            itemSeleccionado.cajaID
                                          );
                                          control.form.setFieldValue(
                                            "DestinoTipoMov",
                                            itemSeleccionado.tipoMovimientoID
                                          );

                                          setState({
                                            ...state,
                                            Form: {
                                              ...state.Form,
                                              Datos: {
                                                ...state.Form.Datos,
                                                CuentaDestinoID: parseInt(
                                                  value.target.value
                                                ),
                                                CuentaDestinoLabel:
                                                  itemSeleccionado.label,
                                                DestinoSucursalID:
                                                  itemSeleccionado.sucursalID,
                                                DestinoCajaID:
                                                  itemSeleccionado.cajaID,
                                                DestinoTipoMov:
                                                  itemSeleccionado.tipoMovimientoID,
                                              },
                                            },
                                          });
                                          setHabilitarCantidad(false);
                                        }
                                      }}
                                      disabled={habilitarCuentaDestino}
                                      id={"CuentaDestinoID"}
                                      name={"CuentaDestinoID"}
                                    >
                                      <option value="0">
                                        {"Selecciona la cuenta"}
                                      </option>
                                      {state.OptionsMovimientosDeposito.map(
                                        (optn, index) => (
                                          <option
                                            key={index}
                                            value={optn.value}
                                            label={optn.label}
                                          />
                                        )
                                      )}
                                    </select>
                                  )}
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  name={"CuentaDestinoID"}
                                  className="text-danger"
                                />
                              </div>
                            </div>
                            <div className="column is-align-items-center is-one-quarter-desktop is-half-tablet is-full-mobile">
                              <div className="row">
                                <div className="col">
                                  <div className="mb-3">
                                    <label
                                      className="form-label mb-0"
                                      htmlFor={"Cantidad"}
                                    >
                                      Cantidad
                                    </label>
                                    <Field
                                      disabled={habilitarCantidad}
                                      id={"Cantidad"}
                                      name={"Cantidad"}
                                    >
                                      {(control: any) => (
                                        <input
                                          type="number"
                                          step="0.01"
                                          placeholder="0.00"
                                          className="form-control"
                                          value={control.field.value}
                                          //pattern="\d{1,10}(.\d{1,2})?"
                                          disabled={habilitarCantidad}
                                          onKeyPress={(event) => {
                                            if (!/[0-9]/.test(event.key)) {
                                              event.preventDefault();
                                            }
                                          }}
                                          onBlur={(value) => {
                                            setHabilitarConcepto(true);
                                            if (
                                              parseFloat(value.target.value) >
                                              100000
                                            ) {
                                              MySwal.fire({
                                                title:
                                                  "<strong>Cantidad excedida</strong>",
                                                html: (
                                                  <div className="text-center">
                                                    <br />
                                                    <p>
                                                      La cantidad no puede ser
                                                      mayor a $100,000
                                                    </p>
                                                  </div>
                                                ),
                                                icon: "error",
                                                confirmButtonText: "Aceptar",
                                              });
                                              control.form.setFieldValue(
                                                "Cantidad",
                                                0
                                              );
                                              //setState Form.Datos.Cantidad
                                              setState({
                                                ...state,
                                                Form: {
                                                  ...state.Form,
                                                  Datos: {
                                                    ...state.Form.Datos,
                                                    Cantidad: 0,
                                                  },
                                                },
                                              });
                                            } else if (
                                              parseFloat(value.target.value) ==
                                              0
                                            ) {
                                              setHabilitarConcepto(true);
                                              MySwal.fire({
                                                title:
                                                  "<strong>Ingresa la cantidad</strong>",
                                                html: (
                                                  <div className="text-center">
                                                    <br />
                                                    <p>
                                                      La cantidad no puede ser 0
                                                    </p>
                                                  </div>
                                                ),
                                                icon: "error",
                                                confirmButtonText: "Aceptar",
                                              });
                                              control.form.setFieldValue(
                                                "Cantidad",
                                                0
                                              );
                                              setState({
                                                ...state,
                                                Form: {
                                                  ...state.Form,
                                                  Datos: {
                                                    ...state.Form.Datos,
                                                    Cantidad: 0,
                                                  },
                                                },
                                              });
                                            } else {
                                              setHabilitarConcepto(false);
                                              control.form.setFieldValue(
                                                "Cantidad",
                                                value.target.value
                                              );
                                              setState({
                                                ...state,
                                                Form: {
                                                  ...state.Form,
                                                  Datos: {
                                                    ...state.Form.Datos,
                                                    Cantidad: parseInt(
                                                      value.target.value
                                                    ),
                                                  },
                                                },
                                              });
                                            }
                                          }}
                                          onChange={(value) => {
                                            let dec =
                                              value.target.value.indexOf(".");
                                            let tooLong =
                                              value.target.value.length >
                                              dec + 3;
                                            let invalidNum = isNaN(
                                              parseFloat(value.target.value)
                                            );

                                            if (
                                              (dec >= 0 && tooLong) ||
                                              invalidNum
                                            ) {
                                              value.target.value =
                                                value.target.value.slice(0, -1);
                                            }
                                            control.form.setFieldValue(
                                              "Cantidad",
                                              value.target.value
                                            );
                                          }}
                                        />
                                      )}
                                    </Field>
                                    {errorCantidad && (
                                      <span style={{ color: "red" }}>
                                        Campo obligatorio, valida los datos.
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div
                              className="columns is-centered is-mobile is-multiline"
                              style={{ paddingTop: "5% !important" }}
                            >
                              <div className="column is-align-items-center is-full-desktop is-full-tablet is-full-mobile">
                                <div className="row">
                                  <div className="col-11">
                                    <div className="mb-3">
                                      <label
                                        className="form-label mb-0"
                                        htmlFor={"Concepto"}
                                      >
                                        Concepto:
                                      </label>
                                      <Field
                                        disabled={habilitarConcepto}
                                        id={"Concepto"}
                                        name={"Concepto"}
                                      >
                                        {(control: any) => (
                                          <textarea
                                            className="form-control"
                                            value={control.field.value}
                                            name="Concepto"
                                            id="Concepto"
                                            placeholder="Concepto"
                                            ref={refDeMovs}
                                            disabled={habilitarConcepto} //pattern="\d{1,10}(.\d{1,2})?"
                                            onChange={(value) => {
                                              setState({
                                                ...state,
                                                Form: {
                                                  ...state.Form,
                                                  Datos: {
                                                    ...state.Form.Datos,
                                                    Concepto:
                                                      value.target.value,
                                                  },
                                                },
                                              });
                                            }}
                                          />
                                        )}
                                      </Field>
                                      <ErrorMessage
                                        component="div"
                                        name={"concepto"}
                                        className="text-danger"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-1">
                                    <br />
                                    <button
                                      data-tip
                                      data-for="Apply"
                                      type="button"
                                      disabled={habilitarAgregarMovimiento}
                                      className="ms-2 btn btn-primary waves-effect waves-light"
                                      onClick={() => {
                                        console.log(
                                          "DATOS , ",
                                          state.Form.Datos
                                        );
                                        console.log(
                                          "state.Datos.Cantidad , ",
                                          state.Form.Datos
                                        );
                                        console.log(
                                          "state.DAtos.Cuenta , ",
                                          state.Form.Datos.CuentaOrigenID
                                        );
                                        let abono = state.Form.Datos.Cantidad;
                                        let cargo =
                                          state.Form.Datos.Cantidad * -1;
                                        console.log("ABONO , ", abono);
                                        console.log("CARGO , ", cargo);
                                        setState({
                                          ...state,
                                          Form: {
                                            ...state.Form,
                                            Datos: {
                                              ...state.Form.Datos,
                                              Cargo: cargo,
                                              Abono: abono,
                                            },
                                          },
                                        });

                                        let objetoAbonoOrigen = {
                                          CuentaOrigenID:
                                            state.Form.Datos.CuentaOrigenID,
                                          CuentaOrigenLabel:
                                            state.Form.Datos.CuentaOrigenLabel,
                                          CuentaDestinoLabel: "-",
                                          Concepto: state.Form.Datos.Concepto,
                                          Abono: "-",
                                          Cargo: cargo,
                                        };
                                        state.DatosTabla.push(
                                          objetoAbonoOrigen
                                        );

                                        let objetoAbonoDestino = {
                                          CuentaDestinoID:
                                            state.Form.Datos.CuentaDestinoID,
                                          CuentaOrigenLabel: "-",
                                          CuentaDestinoLabel:
                                            state.Form.Datos.CuentaDestinoLabel,
                                          Concepto: state.Form.Datos.Concepto,
                                          Abono: abono,
                                          Cargo: "-",
                                        };
                                        state.DatosTabla.push(
                                          objetoAbonoDestino
                                        );

                                        setHabilitarCuentaOrigen(true);
                                        setHabilitarCuentaDestino(true);
                                        setHabilitarCantidad(true);
                                        setHabilitarConcepto(true);
                                        setHabilitarAgregarMovimiento(true);
                                        setHabilitarAceptar(false);

                                        setState({
                                          ...state,
                                          DatosTabla: state.DatosTabla,
                                        });
                                      }}
                                    >
                                      <FaPlus />
                                    </button>
                                  </div>
                                </div>
                                <br />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="text-end">
                            <button
                              data-tip
                              data-for="Reset"
                              type="button"
                              className="ms-2 btn btn-primary waves-effect waves-light"
                              onClick={() => {
                                setState({
                                  ...state,
                                  DatosTabla: [],
                                  Form: { Datos: DatosDefecto },
                                });

                                setHabilitarCuentaOrigen(false);
                                setHabilitarCuentaDestino(true);
                                setHabilitarCantidad(true);
                                setHabilitarConcepto(true);
                                setHabilitarAgregarMovimiento(true);
                                setHabilitarAceptar(true);
                                setHabilitarImprimir(true);
                              }}
                            >
                              <FaFile /> Nuevo
                            </button>
                            <ReactTooltip
                              id="Reset"
                              type="info"
                              effect="solid"
                              clickable
                              globalEventOff="click"
                            >
                              Limpiar datos
                            </ReactTooltip>

                            <button
                              data-tip
                              data-for="Print"
                              disabled={habilitarImprimir}
                              type="button"
                              className="ms-2 btn btn-secondary waves-effect waves-light"
                              onClick={() => {
                                FNImprimir();
                              }}
                            >
                              <FaPrint /> Imprimir
                            </button>
                            <ReactTooltip
                              id="Print"
                              type="info"
                              effect="solid"
                              clickable
                              globalEventOff="click"
                            >
                              Imprimir Traspaso
                            </ReactTooltip>

                            {/*<button
                                                            data-tip data-for="Cancel"
                                                            disabled={true}
                                                            type="button" className="ms-2 btn btn-danger waves-effect waves-light"
                                                            onClick={() => {

                                                            }}>
                                                            <FaTimes />  Cancelar
                                                        </button>
                                                        <ReactTooltip id="Cancel"
                                                            type="info"
                                                            effect="solid"
                                                            clickable
                                                            globalEventOff="click"
                                                        >
                                                            Cancelar póliza
                                                        </ReactTooltip>*/}
                            <button
                              data-tip
                              data-for="Save"
                              disabled={habilitarAceptar}
                              type="button"
                              className="ms-2 btn btn-success waves-effect waves-light"
                              onClick={() => generarTraspaso()}
                            >
                              <FaPlusCircle /> Aceptar
                            </button>
                            <ReactTooltip
                              id="Save"
                              type="info"
                              effect="solid"
                              clickable
                              globalEventOff="click"
                            >
                              Guardar
                            </ReactTooltip>
                          </div>
                          <br />
                          <br />
                        </div>
                        &nbsp;
                      </div>
                    </Form>
                  </Formik>
                  <h5>Detalle Traspaso</h5>
                  <hr />
                  <div className="row">
                    <DataTable
                      columns={[
                        {
                          name: "Cuenta Origen",
                          selector: "CuentaOrigenLabel",
                          sortable: false,
                          center: true,
                          cell: (row: any) => (
                            <span className="text-center">
                              {row.CuentaOrigenLabel}
                            </span>
                          ),
                        },
                        {
                          name: "Cuenta Destino",
                          selector: "CuentaDestinoLabel",
                          sortable: false,
                          center: true,
                          cell: (row: any) => (
                            <span className="text-center">
                              {row.CuentaDestinoLabel}
                            </span>
                          ),
                        },
                        {
                          name: "Concepto",
                          selector: "Concepto",
                          sortable: false,
                          center: true,
                          cell: (row: any) => (
                            <span className="text-center">{row.Concepto}</span>
                          ),
                        },

                        {
                          name: "Cargo",
                          selector: "Cargo",
                          sortable: false,
                          center: true,
                          cell: (row: any) => (
                            <span
                              className="text-center"
                              style={{ color: "red" }}
                            >
                              {" "}
                              {row.Cargo == "-"
                                ? ""
                                : FormateoDinero.format(row.Cargo.toString())}
                            </span>
                          ),
                        },
                        {
                          name: "Abono",
                          selector: "Abono",
                          sortable: false,
                          center: true,
                          cell: (row: any) => (
                            <span
                              className="text-center"
                              style={{ color: "green" }}
                            >
                              {" "}
                              {row.Abono == "-"
                                ? ""
                                : FormateoDinero.format(row.Abono.toString())}
                            </span>
                          ),
                        },
                      ]}
                      data={state.DatosTabla}
                      striped={true}
                      highlightOnHover={true}
                      pagination={true}
                      paginationRowsPerPageOptions={[
                        5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
                      ]}
                      paginationPerPage={5}
                      paginationComponentOptions={{
                        rowsPerPageText: "Filas por página:",
                        rangeSeparatorText: "de",
                        noRowsPerPage: false,
                        selectAllRowsItem: true,
                        selectAllRowsItemText: "Todos",
                      }}
                      noHeader={true}
                      fixedHeader={true}
                      fixedHeaderScrollHeight="300px"
                      paginationServer={true}
                    />
                  </div>
                </div>
              )}

              {state.ShowCaja && (
                <ModalWin open={state.ShowCaja} center large scrollable>
                  <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>Selección de Caja</h5>
                  </ModalWin.Header>
                  <ModalWin.Body>
                    {state.ShowCaja && (
                      <SeleccionarCajaSucursal
                        optSucursales={state.OptSucursales}
                        initialValues={state.CajaDefault}
                        cbAceptar={fnSetSucCaja}
                      />
                    )}
                  </ModalWin.Body>
                </ModalWin>
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
  pds: state.UI,
});

const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TraspasoEntreCuentasZonales);
