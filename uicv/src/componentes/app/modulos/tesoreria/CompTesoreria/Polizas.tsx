import React from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import * as Funciones from "./Polizas/Funciones";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";
// Icons
import { FaTimes, FaEye, FaSearch, FaFilePdf } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
// Custom components
import {
  Card,
  Spinner,
  CustomFieldText,
  CustomFieldDatePicker,
  CustomSelect,
} from "../../../../global";
import { CForm } from "./Polizas/CForm";
import { Formik, Form } from "formik";
import { Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import DatePicker, { registerLocale } from "react-datepicker";
import moment from "moment";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

type CatalogosType = {
  oidc: IOidc;
};

const Polizas = (props: CatalogosType) => {
  const MySwal = withReactContent(Swal);

  // Controll our mounted state
  let isMounted = React.useRef(true);

  const DatosDefecto = {
    fecha: new Date(),
    estatus: 0,
    tipo_poliza: "",
    numeroPoliza: 0,
    cuenta: "",
    usuario: "",
    empresa: "",
    concepto: "",
    fechaFinal: new Date(),
    fechaInicial: new Date(),
  };

  const DatosDefectoModalDetalle = {
    cuenta: "",
    cuentaId: 0,
    referencia: "",
    debe: "",
    haber: "",
    concepto: "",
  };
  const Datos: any[] = [];
  const DatosTabla: any[] = [];
  const DatosMostrar: any[] = [];
  const optCuentas: any[] = [];
  const opPolizasTipo: any[] = [];
  const opPolizasTipoModal: any[] = [];
  const opEmpresas: any[] = [];
  const DatosIniciales: any[] = [];
  let numero: any;
  let polizaId: any;
  let explorar: any;
  let tipoId: any;
  const [state, setState] = React.useState({
    Datos,
    DatosTabla,
    DatosMostrar,
    Filtro: "",
    Cargando: false,
    Error: false,
    Form: {
      Mostrar: false,
      Datos: DatosDefecto,
      Id: undefined,
    },
    DatosIniciales: {
      fecha: new Date(),
      estatus: "",
      tipoId: 0,
      numero: 0,
      concepto: "",
    },
    optCuentas,
    opPolizasTipo,
    opPolizasTipoModal,
    startDate: null,
    endDate: null,
    opEmpresas,
    numero,
    tipoId,
    polizaId,
    explorar: true,
    nombre: "",
    DatosDefectoModalDetalle,
  });
  const [activarDesactivarBoton, setADBoton] = React.useState(true);

  const formatoNumero = (numero: any) => {
    return new Intl.NumberFormat("ES-MX", {
      style: "currency",
      currency: "MXN",
    }).format(numero);
  };

  const FNGetTipoPolizas = () => {
    Funciones.FNGet(props.oidc)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          var tipoPolizas = respuesta.map((valor: any) => {
            var obj = { value: valor.tipoPolizaID, label: valor.descripcion };
            return obj;
          });

          var tipoPolizasModal = respuesta.map((valor: any) => {
            var obj = { value: valor.tipoPolizaID, label: valor.descripcion };
            return obj;
          });
          tipoPolizasModal.push({ value: -1, label: "Todas" });

          setState((s) => ({
            ...s,
            opPolizasTipo: tipoPolizas,
            opPolizasTipoModal: tipoPolizasModal,
          }));
        }
      })
      .catch((erro: any) => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            opPolizasTipo: [],
            opPolizasTipoModal: [],
          }));
        }
      });
  };

  const FNImprimir = () => {
    console.log("POLIZA ID");
    console.log(state.polizaId);
    if (state.polizaId > 0) {
      toast.info("Generando Póliza");
      let a = {
        polizaId: state.polizaId,
      };
      Funciones.FNPrintPoliza(props.oidc, a)
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
      toast.info("Ocurrió un problema al generar la póliza");
    }
  };
  const FNGetEmpresas = () => {
    Funciones.FNGetEmpresas(props.oidc)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          var empresas = respuesta.map((valor: any) => {
            var obj = { value: valor.id, label: valor.nombre };
            return obj;
          });

          setState((s) => ({ ...s, opEmpresas: empresas }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, opEmpresas: [] }));
        }
      });
  };

  const FNGetPolizaPricipal = () => {
    if (
      state.numero === undefined ||
      state.numero === null ||
      state.numero === 0 ||
      state.numero === ""
    ) {
      toast.warning("Debes especificar un número de póliza");
    } else if (
      state.tipoId === undefined ||
      state.tipoId === null ||
      state.tipoId === 0 ||
      state.tipoId === ""
    ) {
      toast.warning("Debes de seleccionar un tipo de póliza");
    } else {
      setState((s) => ({ ...s, Cargando: true }));
      Funciones.FNGetPoliza(props.oidc, undefined, state.tipoId, state.numero)
        .then((respuesta: any) => {
          if (respuesta.length === 0) {
            toast.info("La póliza especificada no existe");
            setState((s) => ({
              ...s,
              Cargando: false,
              Datos: [],
              DatosTabla: [],
              numero: "",
            }));
          } else {
            setADBoton(false);
            if (isMounted.current === true) {
              let tabla: any[] = [];
              respuesta[0].listMovPoliza.forEach((element: any) => {
                let detallePoliza: any = {
                  id: element.movPolID,
                  cuenta: element.cuenta.cuenta,
                  cuentaId: element.cuenta.id,
                  referencia: element.referencia,
                  debe: element.debe,
                  haber: element.haber,
                  descripcion: element.descripcion,
                };
                tabla.push(detallePoliza);
              });
              let sumaHaber = 0;
              let sumaDebe = 0;
              tabla.forEach((element) => {
                sumaDebe = sumaDebe + element.debe;
                sumaHaber = sumaHaber + element.haber;
              });

              let detallePoliza: any = {
                idTotal: -1,
                referencia: "Total $",
                haber: sumaHaber,
                debe: sumaDebe,
              };
              if (respuesta[0].listMovPoliza.length > 0) {
                tabla.push(detallePoliza);
              }

              let fecha = new Date(respuesta[0].fecha);

              setState((s) => ({
                ...s,
                Cargando: false,
                Error: false,
                polizaId: respuesta[0].polizaId,
                Datos: respuesta[0],
                DatosTabla: tabla,
              }));
            }
          }
        })
        .catch((err) => {
          if (isMounted.current === true) {
            setState((s) => ({ ...s, Cargando: false, Datos: [] }));
          }
        });
    }
  };

  // Define the columns
  const Columns = React.useMemo(() => {
    let colRet: IDataTableColumn[] = [
      {
        name: "#",
        selector: "id",
        sortable: false,
        wrap: true,
      },

      {
        name: "Cuenta",
        selector: "cuenta",
        wrap: true,
        sortable: false,
      },
      {
        name: "Descripción",
        selector: "descripcion",
        sortable: false,
        width: "25%",
        wrap: true,
      },
      {
        name: "Referencia",
        selector: "referencia",
        sortable: false,
        wrap: true,
        conditionalCellStyles: [
          {
            when: (column) => {
              return column.idTotal === -1;
            },
            style: {
              backgroundColor: "#e9ecef",
            },
          },
        ],
      },
      {
        name: "Debe",
        selector: "debe",
        sortable: false,
        wrap: true,
        format: (valor) => formatoNumero(valor.debe),
        conditionalCellStyles: [
          {
            when: (column) => {
              return column.idTotal === -1;
            },
            style: {
              backgroundColor: "#e9ecef",
            },
          },
        ],
      },
      {
        name: "Haber",
        selector: "haber",
        sortable: false,
        wrap: true,
        format: (valor) => formatoNumero(valor.haber),
        conditionalCellStyles: [
          {
            when: (column) => {
              return column.idTotal === -1;
            },
            style: {
              backgroundColor: "#e9ecef",
            },
          },
        ],
      },
    ];
    return colRet;
  }, []);
  const fnGetCuentas = () => {
    Funciones.FNGetCuentasContables(props.oidc)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          var cuentas = respuesta.map((valor: any) => {
            var obj = {
              value: valor.id,
              label: valor.cuenta + " " + valor.nombre,
            };
            return obj;
          });

          setState((s) => ({ ...s, optCuentas: cuentas }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, optCuentas: [] }));
        }
      });
  };

  const fnCancelarPoliza = (number: any) => {
    if (state.Datos.length > 0) {
      let poliza: any = state.Datos[0];

      console.log("PolizaID ,", state.polizaId);
      if (poliza.Estatus === "Cancelado") {
        toast.error("La póliza ya se encuentra cancelada");
      } else {
        MySwal.fire({
          title: "<strong>Cancelar Póliza</strong>",
          icon: "question",
          html: (
            <div className="mb-3 text-center">
              <br />
              <span>Se cancelará la póliza Nro. {state.polizaId}</span>
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
            Funciones.FNCancelar(props.oidc, state.polizaId)
              .then((respuesta: any) => {
                if (respuesta.status == 204) {
                  toast.error("La póliza ya se encuentra cancelada");
                }
                if (respuesta.status == 201) {
                  setState((s) => ({ ...s, Cargando: true }));
                  Funciones.FNGetPoliza(props.oidc, respuesta.data.polizaid)
                    .then((respuesta: any) => {
                      if (isMounted.current === true) {
                        console.log();
                        let tabla: any[] = [];
                        if (respuesta.length > 0) {
                          respuesta.forEach((element: any) => {
                            let detallePoliza: any = {
                              id: element.MovimientoPolizaID,
                              cuenta: element.NumeroCuenta,
                              cuentaId: element.CuentaBancoID,
                              referencia: element.RefMovPoliza,
                              debe: element.Debe,
                              haber: element.Haber,
                              descripcion: element.DescMovimientoPoliza,
                            };
                            tabla.push(detallePoliza);
                          });

                          let sumaHaber = 0;
                          let sumaDebe = 0;
                          tabla.forEach((element) => {
                            sumaDebe = sumaDebe + element.debe;
                            sumaHaber = sumaHaber + element.haber;
                          });

                          let detallePoliza: any = {
                            idTotal: -1,
                            referencia: "Total",
                            haber: sumaHaber,
                            debe: sumaDebe,
                          };
                          tabla.push(detallePoliza);
                          let fecha = new Date(respuesta[0].Fecha);

                          let estatus = respuesta[0].Estatus;
                          let tipoid = respuesta[0].TipoPolizaID;
                          let numero = respuesta[0].Numero;
                          let concepto = respuesta[0].DescMovimientoPoliza;

                          setState((state) => ({
                            ...state,
                            DatosIniciales: {
                              ...state.DatosIniciales,
                              estatus: estatus,
                              fecha: fecha,
                              tipoId: tipoid,
                              numero: numero,
                              concepto: concepto,
                            },
                            Cargando: false,
                            polizaId: respuesta[0].PolizaID,
                            Error: false,
                            Datos: respuesta,
                            DatosTabla: tabla,
                            Form: {
                              ...state.Form,
                              Mostrar: false,
                            },
                          }));
                          setADBoton(false);
                          //setState(s => ({ ...s, Cargando: false, polizaId: respuesta[0].PolizaID, tipoId: item.TipoPolizaID, numero: item.Numero, Error: false, Datos: respuesta, DatosTabla: tabla, Form: { ...state.Form, Mostrar: false } }))
                        }
                      }
                    })
                    .catch((err) => {
                      alert("SDSD" + err);
                      if (isMounted.current === true) {
                        setADBoton(true);
                        setState((s) => ({ ...s, Cargando: false, Datos: [] }));
                      }
                    });
                }
              })
              .catch((error: any) => {
                toast.error(
                  "Ocurrió un problema mientras se cancelaba la póliza"
                );
              });
          }
        });
      }
    }
  };
  // Use effect
  React.useEffect(() => {
    FNGetTipoPolizas();
    FNGetEmpresas();
    fnGetCuentas();
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  // Funcion de cambio de fecha
  const CambioFecha = (stri: any, strf: any) => {
    let data: any[] = [];
    let fini: any = new Date(stri);
    let ffin: any = new Date(strf);

    if (fini.valueOf() === 0 && ffin.valueOf() === 0) {
      data = state.Datos;

      setState((s) => ({
        ...s,
        DatosMostrar: data,
        startDate: null,
        endDate: null,
      }));
    } else {
      if (fini.valueOf() > 0 && ffin.valueOf() === 0) {
        const filtro = function (obj: any) {
          let date;
          let arr = obj.fecha.split("/");
          date = new Date(arr[2], arr[1] - 1, arr[0]);
          return date.valueOf() >= fini.valueOf();
        };

        data = state.Datos.filter(filtro);

        setState((s) => ({
          ...s,
          DatosMostrar: data,
          startDate: fini,
          endDate: null,
        }));
      } else {
        if (fini.valueOf() === 0 && ffin.valueOf() > 0) {
          const filtro = function (obj: any) {
            let date;
            let arr = obj.fecha.split("/");
            date = new Date(arr[2], arr[1] - 1, arr[0]);
            return date.valueOf() <= ffin.valueOf();
          };

          data = state.Datos.filter(filtro);

          setState((s) => ({
            ...s,
            DatosMostrar: data,
            startDate: null,
            endDate: ffin,
          }));
        } else {
          const filtro = function (obj: any) {
            let date;
            let arr = obj.fecha.split("/");
            date = new Date(arr[2], arr[1] - 1, arr[0]);
            return (
              date.valueOf() >= fini.valueOf() &&
              date.valueOf() <= ffin.valueOf()
            );
          };

          data = state.Datos.filter(filtro);

          setState((s) => ({
            ...s,
            DatosMostrar: data,
            startDate: fini,
            endDate: ffin,
          }));
        }
      }
    }
  };

  /** funcion Callback al agregar un item */
  const cbAgregar = (item: any) => {
    setState({
      ...state,
      Datos: [...state.Datos, item],
      explorar: false,
      nombre: "Movimiento de Polizas",
      Form: {
        ...state.Form,
        Mostrar: false,
        Datos: {
          fecha: new Date(),
          estatus: 0,
          tipo_poliza: "",
          numeroPoliza: 0,
          cuenta: "",
          usuario: "",
          empresa: "",
          concepto: "",
          fechaInicial: new Date(),
          fechaFinal: new Date(),
        },
      },
    });
  };

  /** funcion Callback al actualizar un item */
  const cbActualizar = (item: any) =>
    setState({
      ...state,
      Datos: state.Datos.map((Dato) =>
        Dato.MonedaSatID === item.MonedaSatID ? item : Dato
      ),
      explorar: false,
      nombre: "Movimiento de Polizas",
      Form: {
        ...state.Form,
        Mostrar: false,
        Datos: {
          fecha: new Date(),
          estatus: 0,
          tipo_poliza: "",
          numeroPoliza: 0,
          cuenta: "",
          usuario: "",
          empresa: "",
          concepto: "",
          fechaInicial: new Date(),
          fechaFinal: new Date(),
        },
      },
    });

  const seleccionadoRenglon = (item: any) => {
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNGetPoliza(props.oidc, item.id)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          console.log();
          let tabla: any[] = [];
          if (respuesta.length > 0) {
            console.log("respuesta", respuesta);
            respuesta.forEach((element: any) => {
              let detallePoliza: any = {
                id: element.MovimientoPolizaID,
                cuenta: element.NumeroCuenta,
                cuentaId: element.CuentaBancoID,
                referencia: element.RefMovPoliza,
                debe: element.Debe,
                haber: element.Haber,
                descripcion: element.DescMovimientoPoliza,
              };
              tabla.push(detallePoliza);
            });

            let sumaHaber = 0;
            let sumaDebe = 0;
            tabla.forEach((element) => {
              sumaDebe = sumaDebe + element.debe;
              sumaHaber = sumaHaber + element.haber;
            });

            let detallePoliza: any = {
              idTotal: -1,
              referencia: "Total",
              haber: sumaHaber,
              debe: sumaDebe,
            };
            tabla.push(detallePoliza);
            console.log("RECIBIDO ", respuesta[0]);
            //let fecha = new Date(respuesta[0].Fecha)
            let fecha2 = formatDate(respuesta[0].Fecha);
            let fecha = new Date(fecha2);

            console.log("FECHA ", fecha2);
            console.log("FECHA S", respuesta[0].Fecha);

            let estatus = respuesta[0].Estatus;
            let tipoid = respuesta[0].TipoPolizaID;
            let numero = respuesta[0].Numero;
            let concepto = respuesta[0].DescMovimientoPoliza;

            setState((state) => ({
              ...state,
              DatosIniciales: {
                ...state.DatosIniciales,
                estatus: estatus,
                fecha: fecha,
                tipoId: tipoid,
                numero: numero,
                concepto: concepto,
              },
              Cargando: false,
              polizaId: respuesta[0].PolizaID,
              Error: false,
              Datos: respuesta,
              DatosTabla: tabla,
              Form: {
                ...state.Form,
                Mostrar: false,
              },
            }));
            setADBoton(false);
            //setState(s => ({ ...s, Cargando: false, polizaId: respuesta[0].PolizaID, tipoId: item.TipoPolizaID, numero: item.Numero, Error: false, Datos: respuesta, DatosTabla: tabla, Form: { ...state.Form, Mostrar: false } }))
          }
        }
      })
      .catch((err) => {
        alert("SDSD" + err);
        if (isMounted.current === true) {
          setADBoton(true);
          setState((s) => ({ ...s, Cargando: false, Datos: [] }));
        }
      });
  };

  /** funcion para cancelar la forma */
  const fnCancelar = () =>
    setState((state) => ({
      ...state,
      explorar: false,
      nombre: "Movimiento de Polizas",
      Form: { ...state.Form, Mostrar: false },
    }));

  const FechaInicial = (fecha: any) => {
    CambioFecha(fecha, state.endDate);
  };

  const formatDate = (date: any) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };
  return (
    <div className="row">
      <div className="col-12">
        <Card Title="Búsqueda de pólizas">
          <Card.Body>
            <Card.Body.Content>
              {state.Cargando && <Spinner />}
              {!state.Cargando && !state.Error && (
                <div>
                  <div className="row">
                    <div className="text-end">
                      <br></br>
                      <button
                        type="button"
                        className="ms-2 btn btn-secondary waves-effect waves-light"
                        disabled={state.polizaId > 0 ? false : true}
                        onClick={() => {
                          FNImprimir();
                        }}
                      >
                        <FaFilePdf size="20px" />
                      </button>
                      {/*   <button type="button" className="ms-2 btn btn-secondary waves-effect waves-light" onClick={FNGetPolizaPricipal}>
                                                <FaSearch /> Buscar
                                            </button> */}
                      <button
                        className="ms-2 btn btn-primary waves-effect waves-light"
                        type="button"
                        onClick={() =>
                          setState((state) => ({
                            ...state,
                            explorar: true,
                            nombre: "Explorador de Pólizas",
                            Form: {
                              Mostrar: true,
                              Datos: DatosDefecto,
                              Id: undefined,
                            },
                          }))
                        }
                      >
                        <FaEye /> Explorar
                      </button>
                      <button
                        type="button"
                        className="ms-2 btn btn-danger waves-effect waves-light"
                        disabled={activarDesactivarBoton}
                        onClick={() => {
                          if (
                            state.DatosIniciales.numero !== undefined &&
                            state.DatosIniciales.numero !== 0
                          ) {
                            fnCancelarPoliza(state.polizaId);
                          } else {
                            alert("ELSE");
                          }
                        }}
                      >
                        <FaTimes /> Cancelar
                      </button>
                    </div>
                  </div>
                  <br />
                  <h5>Encabezado de Poliza</h5>
                  <br />

                  <Formik
                    initialValues={state.DatosIniciales}
                    enableReinitialize
                    onSubmit={(values: any) => {}}
                  >
                    <Form>
                      <div className="columns is-centered is-mobile is-multiline">
                        <div className="column text-center is-half-desktop is-half-mobile">
                          <div className="mb-3">
                            <label
                              className="form-label mb-0"
                              htmlFor={"fecha"}
                            >
                              Fecha
                            </label>
                            <br />
                            <Field disabled={true} id={"fecha"} name={"fecha"}>
                              {(control: any) => (
                                <DatePicker
                                  className="form-control"
                                  selected={control.field.value}
                                  disabled={true}
                                  onChange={(value: any) => {
                                    control.form.setFieldValue("fecha", value);
                                  }}
                                  placeholderText="Fecha"
                                  locale="es"
                                  dateFormat="yyyy-MM-dd"
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              component="div"
                              name={"fecha"}
                              className="text-danger"
                            />
                          </div>
                        </div>
                        <div className="column text-center is-half-desktop is-half-mobile">
                          <CustomFieldText
                            disabled={true}
                            label="Estatus"
                            name="estatus"
                            placeholder="Estatus"
                          />
                        </div>
                        <div className="column text-center is-half-desktop is-half-mobile">
                          <div className="mb-3">
                            <label
                              className="form-label mb-0"
                              htmlFor={"tipoId"}
                            >
                              Tipo de póliza
                            </label>
                            <Field name={"tipoId"} className="form-select">
                              {(control: any) => (
                                <select
                                  className="form-select"
                                  //options={state.optCuentas}
                                  value={control.field.value}
                                  onChange={(value: any) => {
                                    control.form.setFieldValue(
                                      "tipoId",
                                      parseInt(value.target.value)
                                    );
                                    setState((state) => ({
                                      ...state,
                                      tipoId: parseInt(value.target.value),
                                    }));
                                  }}
                                  disabled={true}
                                  id={"tipoId"}
                                  name={"tipoId"}
                                >
                                  <option value="0">
                                    {"Selecciona un tipo de póliza"}
                                  </option>
                                  {state.opPolizasTipo.map((optn, index) => (
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
                              name={"tipoId"}
                              className="text-danger"
                            />
                          </div>
                        </div>
                        <div className="column text-center is-half-desktop is-half-mobile">
                          <div className="mb-3">
                            <label className="form-label mb-0" htmlFor="numero">
                              Numero
                            </label>
                            <Field
                              disabled={true}
                              className="form-control"
                              type="number"
                              id="numero"
                              name="numero"
                              placeholder="Número"
                              min="0"
                              pattern="^[0-9]+"
                              onChange={(numero: any) => {
                                if (state.Datos.length > 0) {
                                  setState((state) => ({
                                    ...state,
                                    numero: parseInt(numero.target.value),
                                  }));
                                } else {
                                  setState((state) => ({
                                    ...state,
                                    numero: parseInt(numero.target.value),
                                    Datos: {
                                      ...state.Datos,
                                      numero: parseInt(numero.target.value),
                                    },
                                  }));
                                }
                                setADBoton(true);
                              }}
                            />
                            <ErrorMessage
                              component="div"
                              name="numero"
                              className="text-danger"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <CustomFieldText
                            disabled={true}
                            label="Concepto"
                            name="concepto"
                            placeholder="Concepto"
                          />
                        </div>
                      </div>
                    </Form>
                  </Formik>

                  <br />
                  <h5>Detalle Poliza</h5>
                  <br />
                  {state.Error && <span>Error al cargar los datos...</span>}
                  <DataTable
                    noDataComponent={"No existen movimientos de la póliza"}
                    data={state.DatosTabla}
                    striped
                    pagination
                    dense
                    noHeader
                    responsive
                    keyField={"id"}
                    defaultSortField={"id"}
                    columns={Columns}
                  />
                  <ModalWin
                    large={state.explorar}
                    open={state.Form.Mostrar}
                    center={true}
                  >
                    <ModalWin.Header>
                      <h5 className={MODAL_TITLE_CLASS}>{state.nombre}</h5>
                    </ModalWin.Header>
                    <ModalWin.Body>
                      {
                        <CForm
                          Seguridad={props.oidc}
                          initialValues={state.Form.Datos}
                          Id={state.Form.Id}
                          cbGuardar={cbAgregar}
                          fnCancelar={fnCancelar}
                          opPolizasTipoModal={state.opPolizasTipoModal}
                          optCuentas={state.optCuentas}
                          explorar={state.explorar}
                          DatosDefectoModalDetalle={
                            state.DatosDefectoModalDetalle
                          }
                          seleccionadoRenglon={seleccionadoRenglon}
                        />
                      }
                    </ModalWin.Body>
                  </ModalWin>
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
export default connect(mapStateToProps, mapDispatchToProps)(Polizas);
