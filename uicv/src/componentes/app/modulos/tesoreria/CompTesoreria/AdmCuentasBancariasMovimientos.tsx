import React, { useRef } from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import * as Funciones from "./AdmCuentasBancariasMovimientos/Funciones";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import * as FuncionesP from "./Polizas/Funciones";

import { CFormDetalleMov } from "./AdmCuentasBancariasMovimientos/CFormDetalleMov";
import * as Yup from "yup";
import moment from "moment";
import ReactTooltip from "react-tooltip";

// Icons
import {
  FaSearch,
  FaFile,
  FaPrint,
  FaTimes,
  FaPlusCircle,
  FaPlus,
  FaPencilAlt,
  FaCheck,
} from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
// Custom components
import {
  Card,
  Spinner,
  CustomFieldText,
  CustomFieldDatePicker,
  CustomSelect,
} from "../../../../global";
import { Formik, Form } from "formik";
import { Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";

import DatePicker, { registerLocale } from "react-datepicker";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { string } from "yup/lib/locale";
type CatalogosType = {
  oidc: IOidc;
};

const AdmCuentasBacariasMovimietos = (props: CatalogosType) => {
  // Controll our mounted state
  let isMounted = React.useRef(true);
  const refDeMovs = useRef<HTMLTextAreaElement>(null);
  let [cuenta, setcuenta] = React.useState({
    id: 0,
    cuenta: "",
    cuentaContableID: 0,
    CuentaContable: "",
    cuentaDestinoId: 0,
    cuentaDestino: "",
    cuentaContableDestinoId: 0,
    cuentaContableDestino: "",
  });
  let [movimiento, setmovimiento] = React.useState({
    id: 0,
    movimiento: "",
    factor: 0,
    tipoMov: false,
  });

  const [activarDesactivarMovimiento, setActivarDesactivarMovimiento] =
    React.useState(true);
  const [activarDesactivarCantidad, setActivarDesactivarCantidad] =
    React.useState(true);
  const [activarDesactivarCuentaDestino, setActivarDesactivarCuentaDestino] =
    React.useState(true);

  const [activarDesactivarConcepto, setActivarDesactivarConcepto] =
    React.useState(true);

  const [cuentaSeleccionada, setCuentaSeleccionada] = React.useState(0);
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
    cuentaContableId: 0,
    referencia: "",
    debe: 0,
    haber: 0,
    descripcion: "",
  };
  const Datos: any[] = [];
  const DatosBeneficiario: any[] = [];
  const DatosCredito: any[] = [];

  const DatosTabla: any[] = [];
  const DatosMostrar: any[] = [];
  const optCuentas: any[] = [];
  const optCuentasContables: any[] = [];
  const cuentasContables: any[] = [];
  const cuentasBancarias: any[] = [];
  //  const refReferencia = useRef<TextField>(null)

  const opMovimientos: any[] = [];
  const opPolizasTipoModal: any[] = [];
  let numero: any;
  const [state, setState] = React.useState({
    referenciaM: "",
    TipoOp: 0,
    activaCancelacion: true,
    Datos: {
      fecha: new Date(),
      numero: 0,
      estatus: "",
      referencia: "",
      cuentaOrigen: "",
      cuentaDestino: "",
      movimiento: "",
      cantidad: "",
      beneficiario: "",
      concepto: "",
    },
    DatosTabla,
    DatosMostrar,
    Filtro: "",
    DatosBeneficiario,
    DatosCredito,
    PeriodoSeleccionado: 0,
    Cargando: false,
    Cargando2: false,
    Error: false,
    esTransferencia: false,
    Form: {
      MostrarModalConsecutivo: false,
      MostrarModalCredito: false,
      MostrarModalBeneficiario: false,
      MostrarModalDetalleMov: false,
      Datos: DatosDefecto,
      Id: undefined,
    },
    optCuentas,
    opMovimientos,
    opPolizasTipoModal,
    startDate: null,
    endDate: null,
    numero,
    explorar: false,
    nombre: "",
    DatosDefectoModalDetalle,
    optCuentasContables,
    cuentasContables,
    cuentasBancarias,
    polizaId: 0,
  });

  const handleChange = (value: any) => {
    if (parseInt(value.value) !== 0 && value.target.value !== "0") {
      setActivarDesactivarConcepto(true);
      setActivarDesactivarMovimiento(false);
      let cuentaSeleccionada = state.optCuentas.find((res) => {
        if (value.value !== undefined) {
          setCuentaSeleccionada(parseInt(value.value));
          return res.value === parseInt(value.value);
        } else {
          setCuentaSeleccionada(parseInt(value.target.value));
          return res.value === parseInt(value.target.value);
        }
      });
      let cuenta_concepto = cuentaSeleccionada.label;
      let cuentaBancaria = state.cuentasBancarias.find((res: any) => {
        return res.cuentaBancoID === cuentaSeleccionada.value;
      });
      setcuenta({
        ...cuenta,
        id: parseInt(cuentaSeleccionada.value),
        cuenta: cuenta_concepto,
        CuentaContable: cuentaBancaria.cuentaID.cuenta,
        cuentaContableID: cuentaBancaria.cuentaID.id,
      });
    } else {
      setcuenta({
        id: 0,
        cuenta: "",
        cuentaContableID: 0,
        CuentaContable: "",
        cuentaDestinoId: 0,
        cuentaDestino: "",
        cuentaContableDestinoId: 0,
        cuentaContableDestino: "",
      });
      setState((s) => ({
        ...s,
        Datos: {
          fecha: s.Datos.fecha,
          numero: s.Datos.numero,
          estatus: s.Datos.estatus,
          referencia: s.Datos.referencia,
          cuentaDestino: s.Datos.cuentaDestino,
          cuentaOrigen: s.Datos.cuentaOrigen,
          movimiento: s.Datos.movimiento,
          cantidad: s.Datos.cantidad,
          beneficiario: s.Datos.beneficiario,
          concepto: "",
        },
      }));
      setActivarDesactivarMovimiento(true);
    }
  };

  const habilitarCantidad = (value: any) => {
    if (parseInt(value.value) !== 0 && value.target.value !== "") {
      setActivarDesactivarCantidad(false);
      let movimientoSeleccionado = state.opMovimientos.find((res) => {
        if (value.value !== undefined) {
          return res.value === parseInt(value.value);
        } else {
          return res.value === parseInt(value.target.value);
        }
      });
      if (movimientoSeleccionado != undefined) {
        let movimiento_concepto = movimientoSeleccionado.label;
        setmovimiento(movimiento_concepto);
        setmovimiento({
          ...cuenta,
          id: parseInt(movimientoSeleccionado.value),
          movimiento: movimiento_concepto,
          factor: movimientoSeleccionado.factor,
          tipoMov: movimientoSeleccionado.tipoMov,
        });
      }
    } else {
      setActivarDesactivarCantidad(true);
      setmovimiento({ ...movimiento, id: 0, movimiento: "" });
      setState((s) => ({
        ...s,
        Datos: {
          fecha: s.Datos.fecha,
          numero: s.Datos.numero,
          estatus: s.Datos.estatus,
          referencia: s.Datos.referencia,
          movimiento: s.Datos.movimiento,
          cantidad: s.Datos.cantidad,
          beneficiario: s.Datos.beneficiario,
          cuentaOrigen: s.Datos.cuentaOrigen,
          cuentaDestino: s.Datos.cuentaDestino,
          concepto: "",
        },
      }));
    }
  };

  const habilitaCuentaDestino = (value: any) => {
    console.log("VALUE", value.target.value);
    if (parseInt(value.value) !== 0 && value.target.value !== "") {
      let mov = state.opMovimientos.find((respuesta: any) => {
        return respuesta.value === parseInt(value.target.value);
      });
      console.log("----------", mov);

      if (mov === undefined) {
      } else {
        if (mov.tipoMov) {
          setActivarDesactivarCuentaDestino(false);
        } else {
          setActivarDesactivarCuentaDestino(true);
        }
      }
    }
  };

  const FNGetCuentas = () => {
    Funciones.FNGetCuentas(props.oidc)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          var cuentas = respuesta.map((valor: any) => {
            var obj = { value: valor.cuentaBancoID, label: valor.numeroCuenta };
            return obj;
          });
          setState((s) => ({
            ...s,
            optCuentas: cuentas,
            cuentasBancarias: respuesta,
          }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, optCuentas: [], cuentasBancarias: [] }));
        }
      });
  };

  const FNGetMovimientos = (id: any) => {
    setState((s) => ({ ...s, opMovimientos: [] }));
    Funciones.FNGetMovimientos(props.oidc, id)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          var movimientos = respuesta.map((valor: any) => {
            var obj = {
              value: valor.Id,
              label: valor.TipoMovimiento,
              factor: valor.Factor,
              tipoMov: valor.Transfiere,
            };
            return obj;
          });
          setState((s) => ({ ...s, opMovimientos: movimientos }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, opMovimientos: [] }));
        }
      });
  };

  // Define the columns
  const Columns: IDataTableColumn[] = [
    {
      name: "#",
      selector: "id",
      cell: (propsss) =>
        propsss.id === 1000 ? <span></span> : <span>{propsss.id}</span>,
    },

    {
      name: "Cuenta",
      selector: "cuenta",
    },
    {
      name: "Descripción",
      selector: "descripcion",
      wrap: true,
    },
    {
      name: "Referencia",
      selector: "referencia",
      cell: (propss) => <span>{propss.referencia}</span>,
      conditionalCellStyles: [
        {
          when: (column) => {
            return column.id === 1000;
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
      format: (valor) => formatoNumero(valor.debe),
      conditionalCellStyles: [
        {
          when: (column) => {
            return column.id === 1000;
          },
          style: {
            color: "green",
            backgroundColor: "#e9ecef",
          },
        },
      ],
    },
    {
      name: "Haber",
      selector: "haber",
      format: (valor) => formatoNumero(valor.haber),

      conditionalCellStyles: [
        {
          when: (column) => {
            return column.id === 1000;
          },
          style: {
            color: "red",
            backgroundColor: "#e9ecef",
          },
        },
      ],
    },
  ];

  const formatoNumero = (numero: any) => {
    return new Intl.NumberFormat("ES-MX", {
      style: "currency",
      currency: "MXN",
    }).format(numero);
  };

  const onKeyPress = () => {
    console.log("TAMAÑO", state.DatosTabla.length);
    if (state.Datos.cantidad !== undefined && state.Datos.cantidad !== "") {
      let concepto = "";
      if (cuenta.cuentaDestino === "") {
        concepto =
          "Movimiento: " + movimiento.movimiento + ", Cuenta: " + cuenta.cuenta;
      } else {
        concepto =
          "Movimiento: " +
          movimiento.movimiento +
          ", Cuenta: " +
          cuenta.cuenta +
          " a la Cuenta: " +
          cuenta.cuentaDestino;
      }
      setState((s) => ({
        ...s,
        Datos: {
          ...s.Datos,
          concepto: concepto,
        },
      }));
      let tabla: any[] = [];
      let num = parseFloat(state.Datos.cantidad);
      console.log("CANTIDAD", state.Datos.cantidad);
      if (num !== 0.0 && num !== 0) {
        if (state.DatosTabla.length <= 0) {
          if (movimiento.tipoMov && cuenta.cuentaContableDestinoId < 1) {
            const MySwal = withReactContent(Swal);
            MySwal.fire("Selecciona la cuenta destino", "", "error");
          } else {
            if (movimiento.factor === 1) {
              let detallePoliza: any = {
                id: 1,
                cuenta: cuenta.CuentaContable,
                cuentaContableId: cuenta.cuentaContableID,
                referencia: "",
                debe: num,
                debeNumero: num,
                haber: 0,
                haberNumero: 0,
                descripcion: concepto,
              };
              tabla.push(detallePoliza);

              let sumaHaber = 0;
              let sumaDebe = 0;
              tabla.forEach((element) => {
                sumaDebe = sumaDebe + parseFloat(element.debeNumero);
                sumaHaber = sumaHaber + parseFloat(element.haber);
              });

              let detallePoliza2: any = {
                id: 1000,
                referencia: "Total",
                haberNumero: sumaHaber,
                debeNumero: sumaDebe,
                haber: sumaHaber,
                debe: sumaDebe,
              };
              tabla.push(detallePoliza2);
            }
            if (movimiento.factor === -1 && !movimiento.tipoMov) {
              let detallePoliza: any = {
                id: 1,
                cuenta: cuenta.CuentaContable,
                cuentaContableId: cuenta.cuentaContableID,
                referencia: "",
                debe: 0,
                debeNumero: 0,
                haber: num,
                haberNumero: num,
                descripcion: concepto,
              };
              tabla.push(detallePoliza);

              let sumaHaber = 0;
              let sumaDebe = 0;
              tabla.forEach((element) => {
                sumaDebe = sumaDebe + parseFloat(element.debeNumero);
                sumaHaber = sumaHaber + parseFloat(element.haber);
              });

              let detallePoliza2: any = {
                id: 1000,
                referencia: "Total ",
                haberNumero: sumaHaber,
                debeNumero: sumaDebe,
                haber: sumaHaber,
                debe: sumaDebe,
              };
              tabla.push(detallePoliza2);
              setState((s) => ({
                ...s,
                DatosTabla: tabla,
              }));
            }
            if (movimiento.tipoMov) {
              let detallePoliza: any = {
                id: 1,
                cuenta: cuenta.CuentaContable,
                cuentaContableId: cuenta.cuentaContableID,
                referencia: "",
                debe: 0,
                debeNumero: 0,
                haber: num,
                haberNumero: num,
                descripcion: concepto,
              };
              tabla.push(detallePoliza);

              let detallePolizaContraria: any = {
                id: 2,
                cuenta: cuenta.cuentaContableDestino,
                cuentaContableId: cuenta.cuentaContableDestinoId,
                referencia: "",
                debe: num,
                debeNumero: num,
                haber: 0,
                haberNumero: 0,
                descripcion: concepto,
              };
              tabla.push(detallePolizaContraria);

              let sumaHaber = 0;
              let sumaDebe = 0;
              tabla.forEach((element) => {
                sumaDebe = sumaDebe + element.debe;
                sumaHaber = sumaHaber + element.haber;
              });

              let detallePoliza2: any = {
                id: 1000,
                referencia: "Total ",
                haberNumero: sumaHaber,
                debeNumero: sumaDebe,
                haber: sumaHaber,
                debe: sumaDebe,
              };
              tabla.push(detallePoliza2);
              setState((s) => ({
                ...s,
                DatosTabla: tabla,
              }));
            }
            setState((s) => ({
              ...s,
              Datos: {
                fecha: s.Datos.fecha,
                numero: s.Datos.numero,
                estatus: s.Datos.estatus,
                referencia: s.Datos.referencia,
                movimiento: s.Datos.movimiento,
                cuentaOrigen: s.Datos.cuentaOrigen,
                cuentaDestino: s.Datos.cuentaDestino,

                cantidad: s.Datos.cantidad,
                beneficiario: "",
                concepto: concepto,
              },
              Cargando: false,
              Error: false,
              DatosTabla: tabla,
            }));
          }
        } else {
          if (movimiento.factor === 1) {
            let detallePoliza: any = {
              id: 1,
              cuenta: cuenta.CuentaContable,
              cuentaContableId: cuenta.cuentaContableID,
              referencia: "",
              debe: num,
              debeNumero: num,
              haber: 0,
              haberNumero: 0,
              descripcion: concepto,
            };
            tabla.push(detallePoliza);

            let sumaHaber = 0;
            let sumaDebe = 0;
            tabla.forEach((element) => {
              sumaDebe = sumaDebe + parseFloat(element.debeNumero);
              sumaHaber = sumaHaber + parseFloat(element.haber);
            });

            let detallePoliza2: any = {
              id: 1000,
              referencia: "Total",
              haberNumero: sumaHaber,
              debeNumero: sumaDebe,
              haber: sumaHaber,
              debe: sumaDebe,
            };
            tabla.push(detallePoliza2);
          }
          if (movimiento.factor === -1 && !movimiento.tipoMov) {
            let detallePoliza: any = {
              id: 1,
              cuenta: cuenta.CuentaContable,
              cuentaContableId: cuenta.cuentaContableID,
              referencia: "",
              debe: 0,
              debeNumero: 0,
              haber: num,
              haberNumero: num,
              descripcion: concepto,
            };
            tabla.push(detallePoliza);

            let sumaHaber = 0;
            let sumaDebe = 0;
            tabla.forEach((element) => {
              sumaDebe = sumaDebe + parseFloat(element.debeNumero);
              sumaHaber = sumaHaber + parseFloat(element.haber);
            });

            let detallePoliza2: any = {
              id: 1000,
              referencia: "Total ",
              haberNumero: sumaHaber,
              debeNumero: sumaDebe,
              haber: sumaHaber,
              debe: sumaDebe,
            };
            tabla.push(detallePoliza2);
            setState((s) => ({
              ...s,
              DatosTabla: tabla,
            }));
          }
          if (movimiento.tipoMov) {
            let detallePoliza: any = {
              id: 1,
              cuenta: cuenta.CuentaContable,
              cuentaContableId: cuenta.cuentaContableID,
              referencia: "",
              debe: 0,
              debeNumero: 0,
              haber: num,
              haberNumero: num,
              descripcion: concepto,
            };
            tabla.push(detallePoliza);

            let detallePolizaContraria: any = {
              id: 2,
              cuenta: cuenta.cuentaContableDestino,
              cuentaContableId: cuenta.cuentaContableDestinoId,
              referencia: "",
              debe: num,
              debeNumero: num,
              haber: 0,
              haberNumero: 0,
              descripcion: concepto,
            };
            tabla.push(detallePolizaContraria);

            let sumaHaber = 0;
            let sumaDebe = 0;
            tabla.forEach((element) => {
              sumaDebe = sumaDebe + element.debe;
              sumaHaber = sumaHaber + element.haber;
            });

            let detallePoliza2: any = {
              id: 1000,
              referencia: "Total ",
              haberNumero: sumaHaber,
              debeNumero: sumaDebe,
              haber: sumaHaber,
              debe: sumaDebe,
            };
            tabla.push(detallePoliza2);
            setState((s) => ({
              ...s,
              DatosTabla: tabla,
            }));
          }
          setState((s) => ({
            ...s,
            Datos: {
              fecha: s.Datos.fecha,
              numero: s.Datos.numero,
              estatus: s.Datos.estatus,
              referencia: s.Datos.referencia,
              movimiento: s.Datos.movimiento,
              cuentaOrigen: s.Datos.cuentaOrigen,
              cuentaDestino: s.Datos.cuentaDestino,

              cantidad: s.Datos.cantidad,
              beneficiario: "",
              concepto: concepto,
            },
            Cargando: false,
            Error: false,
            DatosTabla: tabla,
          }));
        }
      }
    } else {
      if (state.Datos.cuentaOrigen !== "" && movimiento.id > 0) {
        if (movimiento.tipoMov) {
          if (cuenta.cuentaDestinoId < 1) {
            const MySwal = withReactContent(Swal);
            MySwal.fire("Selecciona la cuenta destino", "", "error");
          } else {
            const MySwal = withReactContent(Swal);
            MySwal.fire("Ingresa la cantidad", "", "error");
          }
        } else {
          const MySwal = withReactContent(Swal);
          MySwal.fire("Ingresa la cantidad", "", "error");
        }
      } else {
        const MySwal = withReactContent(Swal);
        MySwal.fire("Verifica los datos", "", "error");
      }
    }
  };

  const cuentaDestinoSeleccionada = (value: any) => {
    if (cuenta.id === parseInt(value.target.value)) {
      toast.error("La cuenta de destino debe de ser diferente a la de origen");
    }
  };
  // Use effect
  React.useEffect(() => {
    FNGetCuentas();
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  /** funcion Callback al agregar un item */
  const cbAgregar = (item: any) => {};

  /** funcion Callback al actualizar un item */
  const cbActualizar = (item: any) => {};

  const seleccionadoRenglon = (item: any) => {
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNGetPoliza(props.oidc, item.id)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          let tabla: any[] = [];
          respuesta.listMovPoliza.forEach((element: any) => {
            let detallePoliza: any = {
              id: element.movPolID,
              cuenta: element.cuenta.cuenta,
              cuentaId: element.cuenta.id,
              referencia: element.referencia,
              debe: parseFloat(element.debe),
              haber: parseFloat(element.haber),
              descripcion: element.descripcion,
            };
            tabla.push(detallePoliza);
          });
          let sumaHaber = 0;
          let sumaDebe = 0;
          tabla.forEach((element) => {
            sumaDebe = sumaDebe + parseFloat(element.debe);
            sumaHaber = sumaHaber + parseFloat(element.haber);
          });

          let detallePoliza: any = {
            idTotal: -1,
            referencia: "Total $",
            haber: sumaHaber,
            debe: sumaDebe,
          };
          tabla.push(detallePoliza);

          let fecha = new Date(respuesta.fecha);
          fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());

          respuesta.fecha = fecha;
          //setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta, DatosTabla: tabla, Form: { ...state.Form, Mostrar: false } }))
        }
      })
      .catch((err) => {
        if (isMounted.current === true) {
          toast.error(err.response.data.mensaje);
          setState((s) => ({
            ...s,
            Cargando: false,
            Datos: {
              fecha: new Date(),
              numero: 0,
              estatus: "",
              referencia: "",
              cuentaOrigen: "",
              cuentaDestino: "",
              movimiento: "",
              noCredito: "",
              cantidad: "",
              beneficiario: "",
              concepto: "",
            },
          }));
        }
      });
  };

  /** funcion para cancelar la forma */
  const fnCancelar = () => {
    setState((state) => ({
      ...state,
      Form: {
        ...state.Form,
        MostrarModalConsecutivo: false,
        MostrarModalCredito: false,
        MostrarModalBeneficiario: false,
        MostrarModalDetalleMov: false,
      },
    }));
  };

  const fnCancelarPoliza = (numer: any) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "<strong>Cancelación de póliza</strong>",
      icon: "question",
      html: (
        <div className="mb-3 text-center">
          <br />
          <span
            style={{
              fontWeight: 400,
              fontSize: "900rem !important",
            }}
          >
            ¿Cancelar póliza?
          </span>
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
        let timerInterval;
        MySwal.fire({
          icon: "info",
          html: (
            <div>
              <br />
              <h3 className="text-center">Aviso</h3>
              <div className={`modal-body`}>
                <h5 className="text-center">Cancelando póliza.</h5>
              </div>
            </div>
          ),
          timerProgressBar: true,
          confirmButtonText: `Ok`,
          timer: 500,
          didOpen: () => {
            MySwal.showLoading();
          },
          willClose: () => {
            clearInterval(timerInterval);
          },
        });
        FuncionesP.FNCancelar(props.oidc, state.polizaId).then(
          (respuesta: any) => {
            if (respuesta.polizaid !== undefined) {
              Funciones.FNGetPoliza(props.oidc, respuesta.polizaid)
                .then((respuesta: any) => {
                  console.log("RESPUESTA", respuesta);

                  if (respuesta.length === 0) {
                    toast.info("La póliza especificada no existe");
                    setState((s) => ({ ...s, Cargando: false }));
                  } else {
                    MySwal.fire({
                      icon: "success",
                      html: (
                        <div>
                          <br />
                          <h3 className="text-center">Aviso</h3>
                          <div className={`modal-body`}>
                            <h5 className="text-center">
                              Póliza cancelada correctamente.
                            </h5>
                          </div>
                        </div>
                      ),
                      confirmButtonText: `Ok`,
                    });
                    let tabla: any[] = [];
                    respuesta.listMovPoliza.forEach((element: any) => {
                      let detallePoliza: any = {
                        id: element.movPolID,
                        cuenta: element.cuenta.cuenta,
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
                      id: 1000,
                      referencia: "Total",
                      haber: sumaHaber,
                      debe: sumaDebe,
                    };
                    console.log("Datos resp", respuesta);
                    if (respuesta.listMovPoliza.length > 0) {
                      tabla.push(detallePoliza);
                    }

                    console.log("TABLA CANCELACION", tabla);
                    //respuesta[.fecha = fecha
                    setState((s) => ({
                      ...s,
                      Cargando: false,
                      DatosTabla: tabla,
                      activaCancelacion: false,
                      Datos: {
                        ...s.Datos,
                        estatus: "Cancelada",
                      },
                    }));
                  }
                })
                .catch((err) => {
                  if (isMounted.current === true) {
                    setState((s) => ({ ...s, Cargando: false }));
                  }
                });
            }
          }
        );
      } else {
        MySwal.fire({
          icon: "info",
          html: (
            <div>
              <br />
              <h3 className="text-center">Aviso</h3>
              <div className={`modal-body`}>
                <h5 className="text-center">
                  Operación cancelada por el usuario.
                </h5>
              </div>
            </div>
          ),
          confirmButtonText: `Ok`,
        });
      }
    });
  };
  const FNImprimir = () => {
    console.log("POLIZA ID");
    console.log(state.polizaId);
    if (state.polizaId > 0) {
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
        timer: 500,
        didOpen: () => {
          MySwal.showLoading();
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      });
      let a = {
        polizaId: state.polizaId,
      };
      FuncionesP.FNPrintPoliza(props.oidc, a)
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

  return (
    <div className="row">
      <div className="col-12">
        <Card Title="Movimientos fuera de periodo">
          <Card.Body>
            <Card.Body.Content>
              {state.Cargando && <Spinner />}
              {!state.Cargando && !state.Error && (
                <div>
                  <Formik
                    initialValues={state.Datos}
                    enableReinitialize
                    validationSchema={Yup.object().shape({
                      cuentaOrigen: Yup.string().required("Campo obligatorio"),
                      cantidad: Yup.number().typeError(
                        "Sólo se aceptan numeros"
                      ),
                      movimiento: Yup.string().required("Campo obligatorio"),
                    })}
                    onSubmit={(values: any) => {
                      if (state.DatosTabla.length > 0) {
                        let tipoOp = 0;
                        tipoOp = movimiento.tipoMov ? 1 : 2;
                        setState((s) => ({ ...s, TipoOp: tipoOp }));

                        let total = state.DatosTabla.find((res: any) => {
                          return res.id === 1000;
                        });
                        let tabla = state.DatosTabla;

                        let tabla2 = state.DatosTabla;

                        let datoAEliminar = state.DatosTabla.find(
                          (res: any) => {
                            return res.id === 1000;
                          }
                        );
                        let index = tabla.findIndex((res: any) => {
                          return res.id === 1000;
                        });
                        setState((s) => ({ ...s, DatosTabla: tabla2 }));

                        console.log("INDICE", index);
                        /*    if (index > 0) {
                                                       tabla.splice(index, 1)
                                                   } */

                        //if ((parseFloat(total.debe) === parseFloat(total.haber))) {
                        let day = new Date(values.fecha).getDate();
                        let month = new Date(values.fecha).getMonth() + 1;
                        let year = new Date(values.fecha).getFullYear();

                        let fecha;
                        if (month < 10) {
                          fecha = `${year}-0${month}-${day}`;
                        } else {
                          fecha = `${year}-${month}-${day}`;
                        }
                        var actual = new Date().setHours(0, 0, 0, 0);
                        var seleccionada = new Date(values.fecha).setHours(
                          0,
                          0,
                          0,
                          0
                        );
                        if (seleccionada < actual) {
                          const MySwal = withReactContent(Swal);
                          MySwal.fire({
                            title: "<strong>Fecha anterior</strong>",
                            icon: "question",
                            html: (
                              <div className="mb-3 text-center">
                                <br />
                                <span
                                  style={{
                                    fontWeight: 400,
                                    fontSize: "900rem !important",
                                  }}
                                >
                                  La fecha seleccionada es anterior, ¿desea
                                  continuar?
                                </span>
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
                              const table = state.DatosTabla.map(
                                ({
                                  id,
                                  cuenta,
                                  cuentaContableId,
                                  referencia,
                                  debe,
                                  debeNumero,
                                  haber,
                                  haberNumero,
                                  descripcion,
                                }) => {
                                  return {
                                    id: id,
                                    cuenta: cuenta,
                                    cuentaContableId: cuentaContableId,
                                    referencia: referencia,
                                    debe: debe,
                                    debeNumero: debeNumero,
                                    haber: haber,
                                    haberNumero: haberNumero,
                                    descripcion: descripcion,
                                  };
                                }
                              );

                              if (movimiento.tipoMov) {
                                if (table.length == 3) {
                                  table.splice(2, 1);
                                }
                              } else {
                                if (table.length == 2) {
                                  table.splice(1, 1);
                                }
                              }

                              let Datos = {
                                tipoOperacion: 1,
                                referencia: "",
                                fecha: fecha,
                                concepto: values.concepto,
                                estatus: 1,
                                cuentaID: parseInt(values.cuentaOrigen),
                                cuentaDestinoID:
                                  values.cuentaDestino == ""
                                    ? 0
                                    : parseInt(values.cuentaDestino),
                                fechaAfectacion: fecha,
                                fechaCaptura: fecha,
                                referenciaMovs: refDeMovs.current?.value,
                                importe: parseFloat(values.cantidad),
                                tipoMovimientoID: parseInt(values.movimiento),
                                sucursalID: 1,
                                productoID: null,
                                usuarioID: props.oidc.user.profile.sub,
                                personaid: 1,
                                movimientosPoliza: table,
                                tipoMovTransfiere: movimiento.tipoMov,
                                periodoSeleccionado: state.PeriodoSeleccionado,
                              };
                              console.log("D", Datos);
                              let timerInterval;
                              MySwal.fire({
                                icon: "info",
                                html: (
                                  <div>
                                    <br />
                                    <h3 className="text-center">Aviso</h3>
                                    <div className={`modal-body`}>
                                      <h5 className="text-center">
                                        Obteniendo periodos.
                                      </h5>
                                    </div>
                                  </div>
                                ),
                                timerProgressBar: true,
                                confirmButtonText: `Ok`,
                                timer: 500,
                                didOpen: () => {
                                  MySwal.showLoading();
                                },
                                willClose: () => {
                                  clearInterval(timerInterval);
                                },
                              });
                              /*   setState(s => ({
                                                                  ...s, Cargando: true
                                                              })) */
                              Funciones.FNPostPolizaADM(props.oidc, Datos)
                                .then((respuesta: any) => {
                                  /*  setState(s => ({
                                                                         ...s, Cargando: false
                                                                     })) */
                                  if (respuesta.estatus == 1) {
                                    let tabla: any[] = [];
                                    let PeriodoSeleccionadoLocal = 0;
                                    tabla = respuesta.periodos;
                                    var result = {};
                                    const converted = Object.assign(
                                      {},
                                      ...tabla.map((person) => ({
                                        [person.PeriodoID]:
                                          "Periodo: " +
                                          person.NumeroPeriodo +
                                          " Fecha Apertura: " +
                                          moment(person.FechaApertura).format(
                                            "DD-MM-YYYY"
                                          ),
                                      }))
                                    );
                                    const inputOptions = new Promise(
                                      (resolve) => {
                                        setTimeout(() => {
                                          resolve(converted);
                                          /* result = tabla.map(person => (
                                                                                    {
                                                                                        '': 'Periodo: ' + person.NumeroPeriodo + ' Fecha Apertura: ' + moment(person.FechaApertura).format('DD-MM-YYYY')
                                                                                    }
                                                                                ))); */
                                        }, 1000);
                                      }
                                    );
                                    /* var result = tabla.map(function (o) {
                                                                            o.PeriodoID = o.Periodo;
                                                                            return o;
                                                                        })
                                                                         */ const MySwal =
                                      withReactContent(Swal);

                                    MySwal.fire({
                                      title: "<strong>Periodos</strong>",
                                      icon: "question",
                                      html: (
                                        <div className="mb-3 text-center">
                                          <br />
                                          <span
                                            style={{
                                              fontWeight: 400,
                                              fontSize: "900rem !important",
                                            }}
                                          >
                                            Selecciona el periodo al cual deseas
                                            aplicar el movimiento
                                          </span>
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
                                      input: "radio",
                                      inputOptions: converted,
                                      allowOutsideClick: false,
                                      validationMessage:
                                        "El máximo de días es 30.",
                                      inputValidator: (value) => {
                                        return new Promise((resolve) => {
                                          if (!value) {
                                            resolve(
                                              "Selecciona el periodo al cual deseas aplicar el movimiento"
                                            );
                                          } else {
                                            PeriodoSeleccionadoLocal =
                                              parseInt(value);
                                            setState((s) => ({
                                              ...s,
                                              PeriodoSeleccionado:
                                                parseInt(value),
                                            }));
                                            MySwal.fire({
                                              title:
                                                "<strong>Periodos</strong>",
                                              icon: "question",
                                              html: (
                                                <div className="mb-3 text-center">
                                                  <br />
                                                  <span
                                                    style={{
                                                      fontWeight: 400,
                                                      fontSize:
                                                        "900rem !important",
                                                    }}
                                                  >
                                                    Seleccionaste el{" "}
                                                    {converted[value]}
                                                  </span>
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
                                            }).then(function (result) {
                                              if (result.isConfirmed) {
                                                let Datos = {
                                                  tipoOperacion: 2,
                                                  referencia: "",
                                                  fecha: fecha,
                                                  concepto: values.concepto,
                                                  estatus: 1,
                                                  cuentaID: parseInt(
                                                    values.cuentaOrigen
                                                  ),
                                                  cuentaDestinoID:
                                                    values.cuentaDestino == ""
                                                      ? 0
                                                      : parseInt(
                                                          values.cuentaDestino
                                                        ),
                                                  fechaAfectacion: fecha,
                                                  fechaCaptura: fecha,
                                                  referenciaMovs:
                                                    refDeMovs.current?.value,
                                                  importe: parseFloat(
                                                    values.cantidad
                                                  ),
                                                  tipoMovimientoID: parseInt(
                                                    values.movimiento
                                                  ),
                                                  sucursalID: 1,
                                                  productoID: null,
                                                  usuarioID:
                                                    props.oidc.user.profile.sub,
                                                  personaid: 1,
                                                  movimientosPoliza: table,
                                                  tipoMovTransfiere:
                                                    movimiento.tipoMov,
                                                  periodoSeleccionado:
                                                    state.PeriodoSeleccionado,
                                                };
                                                setState((s) => ({
                                                  ...s,
                                                  Cargando: true,
                                                }));
                                                Funciones.FNPostPolizaADM(
                                                  props.oidc,
                                                  Datos
                                                )
                                                  .then((respuesta: any) => {
                                                    if (
                                                      respuesta.estatus == 2
                                                    ) {
                                                      setState((s) => ({
                                                        ...s,
                                                        Cargando: false,
                                                        polizaId:
                                                          respuesta
                                                            .PolizaGenerada
                                                            .PolizaID,
                                                        Datos: {
                                                          ...s.Datos,
                                                          numero:
                                                            respuesta
                                                              .PolizaGenerada
                                                              .PolizaID,
                                                          referencia:
                                                            respuesta
                                                              .PolizaGenerada
                                                              .Referencia,
                                                          estatus: "Aplicada",
                                                        },
                                                      }));
                                                      setActivarDesactivarMovimiento(
                                                        true
                                                      );
                                                      setActivarDesactivarConcepto(
                                                        true
                                                      );
                                                      setActivarDesactivarCuentaDestino(
                                                        true
                                                      );
                                                      setActivarDesactivarCantidad(
                                                        true
                                                      );
                                                      MySwal.fire({
                                                        icon: "success",
                                                        html: (
                                                          <div>
                                                            <br />
                                                            <h3 className="text-center">
                                                              Información
                                                            </h3>
                                                            <div
                                                              className={`modal-body`}
                                                            >
                                                              <h5 className="text-center">
                                                                Movimiento
                                                                generado
                                                                exitosamente
                                                              </h5>
                                                            </div>
                                                          </div>
                                                        ),
                                                        showCancelButton: false,
                                                        confirmButtonText: `Ok`,
                                                      });
                                                    }
                                                  })
                                                  .catch((err) => {
                                                    toast.error(
                                                      "" +
                                                        err.response.data
                                                          .mensaje
                                                    );
                                                    state.DatosTabla.push(
                                                      datoAEliminar
                                                    );
                                                    setState((s) => ({
                                                      ...s,
                                                      Cargando: false,
                                                    }));
                                                  });
                                              } else {
                                                MySwal.fire({
                                                  icon: "info",
                                                  html: (
                                                    <div>
                                                      <br />
                                                      <h3 className="text-center">
                                                        Aviso
                                                      </h3>
                                                      <div
                                                        className={`modal-body`}
                                                      >
                                                        <h5 className="text-center">
                                                          Operación cancelada
                                                          por el usuario.
                                                        </h5>
                                                      </div>
                                                    </div>
                                                  ),
                                                  confirmButtonText: `Ok`,
                                                });
                                              }
                                            });
                                          }
                                        });
                                      },
                                    });
                                  }
                                })
                                .catch((err) => {
                                  toast.error("" + err.response.data.mensaje);
                                  state.DatosTabla.push(datoAEliminar);
                                  setState((s) => ({
                                    ...s,
                                    Cargando: false,
                                  }));
                                });

                              //} else {
                            }
                          });
                        } else {
                          const MySwal = withReactContent(Swal);

                          const table = state.DatosTabla.map(
                            ({
                              id,
                              cuenta,
                              cuentaContableId,
                              referencia,
                              debe,
                              debeNumero,
                              haber,
                              haberNumero,
                              descripcion,
                            }) => {
                              return {
                                id: id,
                                cuenta: cuenta,
                                cuentaContableId: cuentaContableId,
                                referencia: referencia,
                                debe: debe,
                                debeNumero: debeNumero,
                                haber: haber,
                                haberNumero: haberNumero,
                                descripcion: descripcion,
                              };
                            }
                          );
                          if (movimiento.tipoMov) {
                            if (table.length == 3) {
                              table.splice(2, 1);
                            }
                          } else {
                            if (table.length == 2) {
                              table.splice(1, 1);
                            }
                          }

                          console.log("NEW", table);
                          let Datos = {
                            tipoOperacion: 1,
                            referencia: "",
                            fecha: fecha,
                            concepto: values.concepto,
                            estatus: 1,
                            cuentaID: parseInt(values.cuentaOrigen),
                            cuentaDestinoID:
                              values.cuentaDestino == ""
                                ? 0
                                : parseInt(values.cuentaDestino),
                            fechaAfectacion: fecha,
                            fechaCaptura: fecha,
                            referenciaMovs: refDeMovs.current?.value,
                            importe: parseFloat(values.cantidad),
                            tipoMovimientoID: parseInt(values.movimiento),
                            sucursalID: 1,
                            productoID: null,
                            usuarioID: props.oidc.user.profile.sub,
                            personaid: 1,
                            movimientosPoliza: table,
                            tipoMovTransfiere: movimiento.tipoMov,
                            periodoSeleccionado: state.PeriodoSeleccionado,
                          };
                          console.log("D", Datos);

                          let timerInterval;
                          MySwal.fire({
                            icon: "info",
                            html: (
                              <div>
                                <br />
                                <h3 className="text-center">Aviso</h3>
                                <div className={`modal-body`}>
                                  <h5 className="text-center">
                                    Obteniendo periodos.
                                  </h5>
                                </div>
                              </div>
                            ),
                            timerProgressBar: true,
                            confirmButtonText: `Ok`,
                            timer: 500,
                            didOpen: () => {
                              MySwal.showLoading();
                            },
                            willClose: () => {
                              clearInterval(timerInterval);
                            },
                          });
                          /*   setState(s => ({
                                        ...s, Cargando: true
                                                      })) */
                          Funciones.FNPostPolizaADM(props.oidc, Datos)
                            .then((respuesta: any) => {
                              /*   setState(s => ({
                                        ...s, Cargando: false
                                                              })) */
                              if (respuesta.estatus == 1) {
                                let PeriodoSeleccionadoLocal = 0;
                                let tabla: any[] = [];
                                tabla = respuesta.periodos;
                                var result = {};
                                const converted = Object.assign(
                                  {},
                                  ...tabla.map((person) => ({
                                    [person.PeriodoID]:
                                      "Periodo: " +
                                      person.NumeroPeriodo +
                                      " Fecha Apertura: " +
                                      moment(person.FechaApertura).format(
                                        "DD-MM-YYYY"
                                      ),
                                  }))
                                );
                                const inputOptions = new Promise((resolve) => {
                                  setTimeout(() => {
                                    resolve(converted);
                                  }, 1000);
                                });

                                MySwal.fire({
                                  title: "<strong>Periodos</strong>",
                                  icon: "question",
                                  html: (
                                    <div className="mb-3 text-center">
                                      <br />
                                      <span
                                        style={{
                                          fontWeight: 400,
                                          fontSize: "900rem !important",
                                        }}
                                      >
                                        Selecciona el periodo al cual deseas
                                        aplicar el movimiento
                                      </span>
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
                                  input: "radio",
                                  inputOptions: converted,
                                  allowOutsideClick: false,
                                  validationMessage: "El máximo de días es 30.",
                                  inputValidator: (value) => {
                                    return new Promise((resolve) => {
                                      if (!value) {
                                        resolve(
                                          "Selecciona el periodo al cual deseas aplicar el movimiento"
                                        );
                                      } else {
                                        PeriodoSeleccionadoLocal =
                                          parseInt(value);
                                        setState((s) => ({
                                          ...s,
                                          PeriodoSeleccionado: parseInt(value),
                                        }));
                                        MySwal.fire({
                                          title: "<strong>Periodos</strong>",
                                          icon: "question",
                                          html: (
                                            <div className="mb-3 text-center">
                                              <br />
                                              <span
                                                style={{
                                                  fontWeight: 400,
                                                  fontSize: "900rem !important",
                                                }}
                                              >
                                                Seleccionaste el{" "}
                                                {converted[value]}
                                              </span>
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
                                        }).then(function (result) {
                                          if (result.isConfirmed) {
                                            let Datos = {
                                              tipoOperacion: 2,
                                              referencia: "",
                                              fecha: fecha,
                                              concepto: values.concepto,
                                              estatus: 1,
                                              cuentaID: parseInt(
                                                values.cuentaOrigen
                                              ),
                                              cuentaDestinoID:
                                                values.cuentaDestino == ""
                                                  ? 0
                                                  : parseInt(
                                                      values.cuentaDestino
                                                    ),
                                              fechaAfectacion: fecha,
                                              fechaCaptura: fecha,
                                              referenciaMovs:
                                                refDeMovs.current?.value,
                                              importe: parseFloat(
                                                values.cantidad
                                              ),
                                              tipoMovimientoID: parseInt(
                                                values.movimiento
                                              ),
                                              sucursalID: 1,
                                              productoID: null,
                                              usuarioID:
                                                props.oidc.user.profile.sub,
                                              personaid: 1,
                                              movimientosPoliza: table,
                                              tipoMovTransfiere:
                                                movimiento.tipoMov,
                                              periodoSeleccionado:
                                                PeriodoSeleccionadoLocal,
                                            };
                                            console.log(
                                              "DATOS A ENVIAR ",
                                              Datos
                                            );
                                            setState((s) => ({
                                              ...s,
                                              Cargando: true,
                                            }));
                                            Funciones.FNPostPolizaADM(
                                              props.oidc,
                                              Datos
                                            )
                                              .then((respuesta: any) => {
                                                setState((s) => ({
                                                  ...s,
                                                  Cargando: false,
                                                  polizaId:
                                                    respuesta.PolizaGenerada
                                                      .PolizaID,
                                                  Datos: {
                                                    ...s.Datos,
                                                    numero:
                                                      respuesta.PolizaGenerada
                                                        .PolizaID,
                                                    referencia:
                                                      respuesta.PolizaGenerada
                                                        .Referencia,
                                                    estatus: "Aplicada",
                                                  },
                                                }));
                                                setActivarDesactivarMovimiento(
                                                  true
                                                );
                                                setActivarDesactivarConcepto(
                                                  true
                                                );
                                                setActivarDesactivarCuentaDestino(
                                                  true
                                                );
                                                setActivarDesactivarCantidad(
                                                  true
                                                );
                                                if (respuesta.estatus == 2) {
                                                  MySwal.fire({
                                                    icon: "success",
                                                    html: (
                                                      <div>
                                                        <br />
                                                        <h3 className="text-center">
                                                          Información
                                                        </h3>
                                                        <div
                                                          className={`modal-body`}
                                                        >
                                                          <h5 className="text-center">
                                                            Movimiento generado
                                                            exitosamente
                                                          </h5>
                                                        </div>
                                                      </div>
                                                    ),
                                                    showCancelButton: false,
                                                    confirmButtonText: `Ok`,
                                                  });
                                                }
                                              })
                                              .catch((err) => {
                                                toast.error(
                                                  "" + err.response.data.mensaje
                                                );
                                                state.DatosTabla.push(
                                                  datoAEliminar
                                                );
                                                setState((s) => ({
                                                  ...s,
                                                  Cargando: false,
                                                }));
                                              });
                                          } else {
                                            MySwal.fire({
                                              icon: "info",
                                              html: (
                                                <div>
                                                  <br />
                                                  <h3 className="text-center">
                                                    Aviso
                                                  </h3>
                                                  <div className={`modal-body`}>
                                                    <h5 className="text-center">
                                                      Operación cancelada por el
                                                      usuario.
                                                    </h5>
                                                  </div>
                                                </div>
                                              ),
                                              confirmButtonText: `Ok`,
                                            });
                                          }
                                        });
                                      }
                                    });
                                  },
                                });
                              }
                            })
                            .catch((err) => {
                              toast.error("" + err.response.data.mensaje);
                              state.DatosTabla.push(datoAEliminar);
                              setState((s) => ({
                                ...s,
                                Cargando: false,
                              }));
                            });

                          //} else {
                        }
                      } else {
                        const MySwal = withReactContent(Swal);
                        MySwal.fire("Verifica los datos", "", "error");
                      }

                      //}
                    }}
                  >
                    <Form>
                      <div className="row">
                        <div className="text-end">
                          <button
                            data-tip
                            data-for="Reset"
                            type="reset"
                            className="ms-2 btn btn-primary waves-effect waves-light"
                            onClick={() => {
                              setActivarDesactivarCantidad(true);
                              setActivarDesactivarMovimiento(true);
                              setActivarDesactivarConcepto(true);
                              setcuenta({
                                id: 0,
                                cuenta: "",
                                cuentaContableID: 0,
                                CuentaContable: "",
                                cuentaDestinoId: 0,
                                cuentaDestino: "",
                                cuentaContableDestinoId: 0,
                                cuentaContableDestino: "",
                              });
                              setState((s) => ({
                                ...s,
                                Datos: {
                                  fecha: new Date(),
                                  numero: 0,
                                  estatus: "",
                                  referencia: "",
                                  movimiento: "",
                                  noCredito: "",
                                  cantidad: "",
                                  beneficiario: "",
                                  concepto: "",
                                  cuentaOrigen: "",
                                  cuentaDestino: "",
                                  personaid: "",
                                },
                                DatosTabla: [],
                              }));
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
                          {/*  <button className="ms-2 btn btn-secondary waves-effect waves-light" type="button"
                                                        onClick={() => { }}
                                                    ><FaSearch />  Buscar
                                                    </button> */}
                          <button
                            data-tip
                            data-for="Print"
                            disabled={
                              state.Datos.numero !== 0 &&
                              state.activaCancelacion
                                ? false
                                : true
                            }
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
                            Imprimir póliza
                          </ReactTooltip>

                          <button
                            data-tip
                            data-for="Cancel"
                            disabled={
                              state.Datos.numero !== 0 &&
                              state.activaCancelacion
                                ? false
                                : true
                            }
                            type="button"
                            className="ms-2 btn btn-danger waves-effect waves-light"
                            onClick={() => {
                              if (
                                state.Datos.numero !== undefined &&
                                state.Datos.numero !== 0
                              ) {
                                fnCancelarPoliza(state.polizaId);
                              } else {
                                //error
                              }
                            }}
                          >
                            <FaTimes /> Cancelar
                          </button>
                          <ReactTooltip
                            id="Cancel"
                            type="info"
                            effect="solid"
                            clickable
                            globalEventOff="click"
                          >
                            Cancelar póliza
                          </ReactTooltip>
                          <button
                            data-tip
                            data-for="Save"
                            disabled={
                              state.Datos.numero === 0 ||
                              state.Datos.numero === undefined
                                ? false
                                : true
                            }
                            type="submit"
                            className="ms-2 btn btn-success waves-effect waves-light"
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
                      </div>{" "}
                      <br />
                      <br />
                      <div className="row">
                        <div className="col-2">
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
                                  disabled={
                                    state.Datos.numero === 0 ||
                                    state.Datos.numero === undefined
                                      ? false
                                      : true
                                  }
                                  onChange={(value: any) => {
                                    control.form.setFieldValue("fecha", value);
                                  }}
                                  //  minDate={new Date}
                                  locale="es"
                                  dateFormat="dd-MM-yyyy"
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
                        <div className="col-3">
                          <CustomFieldText
                            disabled={true}
                            label="Poliza"
                            name="numero"
                            placeholder="Poliza"
                          />
                        </div>
                        <div className="col-3">
                          <CustomFieldText
                            disabled={true}
                            label="Estatus"
                            name="estatus"
                            placeholder="Estatus"
                          />
                        </div>
                        <div className="col-3">
                          <div className="mb-3">
                            <label
                              className="form-label mb-0"
                              htmlFor={"referencia"}
                            >
                              Referencia
                            </label>
                            <Field
                              disabled={true}
                              id={"referencia"}
                              name={"referencia"}
                            >
                              {(control: any) => (
                                <input
                                  type="number"
                                  step="0"
                                  placeholder="0"
                                  className="form-control"
                                  value={control.field.value}
                                  //pattern="\d{1,10}(.\d{1,2})?"
                                  disabled={true}
                                  onChange={(value) => {
                                    control.form.setFieldValue(
                                      "referencia",
                                      parseInt(value.target.value)
                                    );
                                  }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              component="div"
                              name={"referencia"}
                              className="text-danger"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-3">
                          <div className="mb-3">
                            <label
                              className="form-label mb-0"
                              htmlFor={"cuentaOrigen"}
                            >
                              Cuenta Origen
                            </label>
                            <Field
                              name={"cuentaOrigen"}
                              className="form-select"
                            >
                              {(control: any) => (
                                <select
                                  className="form-select"
                                  //options={state.optCuentas}
                                  value={control.field.value}
                                  onChange={(value: any) => {
                                    setActivarDesactivarConcepto(
                                      !activarDesactivarConcepto
                                    );
                                    handleChange(value);
                                    setState((s) => ({
                                      ...s,
                                      Datos: {
                                        fecha: s.Datos.fecha,
                                        numero: s.Datos.numero,
                                        estatus: s.Datos.estatus,
                                        referencia: s.Datos.referencia,
                                        movimiento: s.Datos.movimiento,
                                        cuentaOrigen: value.target.value,
                                        cuentaDestino: s.Datos.cuentaDestino,

                                        cantidad: s.Datos.cantidad,
                                        beneficiario: "",
                                        concepto: "",
                                      },
                                      DatosTabla: [],
                                    }));
                                    control.form.setFieldValue(
                                      "cuentaOrigen",
                                      parseInt(value.target.value)
                                    );
                                    FNGetMovimientos(
                                      parseInt(value.target.value)
                                    );
                                  }}
                                  disabled={
                                    state.Datos.numero === 0 ||
                                    state.Datos.numero === undefined
                                      ? false
                                      : true
                                  }
                                  id={"cuentaOrigen"}
                                  name={"cuentaOrigen"}
                                >
                                  <option value="0">
                                    {"Selecciona una cuenta de origen"}
                                  </option>
                                  {state.optCuentas.map((optn, index) => (
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
                              name={"cuentaOrigen"}
                              className="text-danger"
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="mb-3">
                            <label
                              className="form-label mb-0"
                              htmlFor={"movimiento"}
                            >
                              Movimiento
                            </label>
                            <Field name={"movimiento"} className="form-select">
                              {(control: any) => (
                                <select
                                  className="form-select"
                                  //options={state.optCuentas}
                                  value={control.field.value}
                                  onChange={(value: any) => {
                                    habilitaCuentaDestino(value);
                                    habilitarCantidad(value);
                                    let movimiento = state.opMovimientos.find(
                                      (res: any) => {
                                        return (
                                          res.value ===
                                          parseInt(value.target.value)
                                        );
                                      }
                                    );
                                    if (movimiento != undefined) {
                                      if (!movimiento.tipoMov) {
                                        control.form.setFieldValue(
                                          "cuentaDestino",
                                          ""
                                        );
                                      }
                                    }

                                    control.form.setFieldValue(
                                      "movimiento",
                                      parseInt(value.target.value)
                                    );
                                    setState((s) => ({
                                      ...s,
                                      Datos: {
                                        fecha: s.Datos.fecha,
                                        numero: s.Datos.numero,
                                        estatus: s.Datos.estatus,
                                        referencia: s.Datos.referencia,
                                        movimiento: value.target.value,
                                        cuentaOrigen: s.Datos.cuentaOrigen,
                                        cuentaDestino: s.Datos.cuentaDestino,

                                        cantidad: s.Datos.cantidad,
                                        beneficiario: "",
                                        concepto: "",
                                      },
                                      DatosTabla: [],
                                    }));
                                  }}
                                  disabled={activarDesactivarMovimiento}
                                  id={"movimiento"}
                                  name={"movimiento"}
                                >
                                  <option value="0">
                                    {"Selecciona un movimiento"}
                                  </option>
                                  {state.opMovimientos.map((optn, index) => (
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
                              name={"movimiento"}
                              className="text-danger"
                            />
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="mb-3">
                            <label
                              className="form-label mb-0"
                              htmlFor={"cuentaDestino"}
                            >
                              Cuenta Destino
                            </label>
                            <Field
                              name={"cuentaDestino"}
                              className="form-select"
                            >
                              {(control: any) => (
                                <select
                                  className="form-select"
                                  //options={state.optCuentas}
                                  value={control.field.value}
                                  onChange={(value: any) => {
                                    if (
                                      cuenta.id === parseInt(value.target.value)
                                    ) {
                                      cuentaDestinoSeleccionada(value);
                                      control.form.setFieldValue(
                                        "cuentaDestino",
                                        ""
                                      );
                                    } else {
                                      control.form.setFieldValue(
                                        "cuentaDestino",
                                        parseInt(value.target.value)
                                      );
                                      let cuentaBancaria =
                                        state.cuentasBancarias.find(
                                          (res: any) => {
                                            return (
                                              res.cuentaBancoID ===
                                              parseInt(value.target.value)
                                            );
                                          }
                                        );
                                      let cuentaDestino = state.optCuentas.find(
                                        (res: any) => {
                                          return (
                                            res.value ===
                                            parseInt(value.target.value)
                                          );
                                        }
                                      );
                                      if (cuentaDestino != undefined) {
                                        setcuenta((cuenta) => ({
                                          ...cuenta,
                                          cuentaDestinoId: parseInt(
                                            value.target.value
                                          ),
                                          cuentaDestino: cuentaDestino.label,
                                          cuentaContableDestinoId:
                                            cuentaBancaria.cuentaID.id,
                                          cuentaContableDestino:
                                            cuentaBancaria.cuentaID.cuenta,
                                        }));
                                      } else {
                                        control.form.setFieldValue(
                                          "cuentaDestino",
                                          0
                                        );
                                        setcuenta((cuenta) => ({
                                          ...cuenta,
                                          cuentaDestinoId: 0,
                                        }));
                                      }
                                    }

                                    setState((s) => ({
                                      ...s,
                                      Datos: {
                                        fecha: s.Datos.fecha,
                                        numero: s.Datos.numero,
                                        estatus: s.Datos.estatus,
                                        referencia: s.Datos.referencia,
                                        movimiento: s.Datos.movimiento,
                                        cuentaOrigen: s.Datos.cuentaOrigen,
                                        cuentaDestino: value.target.value,

                                        cantidad: s.Datos.cantidad,
                                        beneficiario: "",
                                        concepto: "",
                                      },
                                      DatosTabla: [],
                                    }));
                                  }}
                                  disabled={activarDesactivarCuentaDestino}
                                  id={"cuentaDestino"}
                                  name={"cuentaDestino"}
                                >
                                  <option value="0">
                                    {"Selecciona una cuenta de destino"}
                                  </option>
                                  {state.optCuentas.map((optn, index) => (
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
                              name={"cuentaDestino"}
                              className="text-danger"
                            />
                          </div>
                        </div>
                        <div className="col-2">
                          <div className="mb-3">
                            <label
                              className="form-label mb-0"
                              htmlFor={"cantidad"}
                            >
                              Cantidad
                            </label>
                            <Field
                              disabled={setActivarDesactivarCantidad}
                              id={"cantidad"}
                              name={"cantidad"}
                            >
                              {(control: any) => (
                                <input
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  className="form-control"
                                  value={control.field.value}
                                  //pattern="\d{1,10}(.\d{1,2})?"
                                  disabled={activarDesactivarCantidad}
                                  onBlur={(value) => {
                                    let datos = {
                                      fecha:
                                        control.form.getFieldProps("fecha")
                                          .value,
                                      numero:
                                        control.form.getFieldProps("numero")
                                          .value,
                                      estatus:
                                        control.form.getFieldProps("estatus")
                                          .value,
                                      referencia:
                                        control.form.getFieldProps("referencia")
                                          .value,
                                      movimiento:
                                        control.form.getFieldProps("movimiento")
                                          .value,
                                      cantidad:
                                        control.form.getFieldProps("cantidad")
                                          .value,
                                      beneficiario:
                                        control.form.getFieldProps(
                                          "beneficiario"
                                        ).value,
                                      concepto:
                                        control.form.getFieldProps("concepto")
                                          .value,
                                      cuentaOrigen:
                                        control.form.getFieldProps(
                                          "cuentaOrigen"
                                        ).value,
                                      cuentaDestino:
                                        control.form.getFieldProps(
                                          "cuentaDestino"
                                        ).value,
                                    };
                                    setState((s) => ({ ...s, Datos: datos }));
                                  }}
                                  onChange={(value) => {
                                    let dec = value.target.value.indexOf(".");
                                    let tooLong =
                                      value.target.value.length > dec + 3;
                                    let invalidNum = isNaN(
                                      parseFloat(value.target.value)
                                    );

                                    if ((dec >= 0 && tooLong) || invalidNum) {
                                      value.target.value =
                                        value.target.value.slice(0, -1);
                                    }
                                    control.form.setFieldValue(
                                      "cantidad",
                                      value.target.value
                                    );
                                  }}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              component="div"
                              name={"cantidad"}
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
                            className="ms-2 btn btn-primary waves-effect waves-light"
                            onClick={() => {
                              onKeyPress();
                            }}
                          >
                            <FaPlus />
                          </button>
                          <ReactTooltip
                            id="Apply"
                            type="info"
                            effect="solid"
                            clickable
                            globalEventOff="click"
                          >
                            Generar movimientos
                          </ReactTooltip>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-11">
                          <div className="mb-3">
                            <label
                              className="form-label mb-0"
                              htmlFor={"referenciaMovs"}
                            >
                              Referencia
                            </label>
                            <Field
                              disabled={activarDesactivarConcepto}
                              id={"referenciaMovs"}
                              name={"referenciaMovs"}
                            >
                              {(control: any) => (
                                <textarea
                                  className="form-control"
                                  value={control.field.value}
                                  name="referenciaMovs"
                                  id="referenciaMovs"
                                  placeholder="Referencia"
                                  ref={refDeMovs}
                                  disabled={
                                    state.Datos.numero === 0 ||
                                    state.Datos.numero === undefined
                                      ? false
                                      : true
                                  } //pattern="\d{1,10}(.\d{1,2})?"
                                  //disabled={activarDesactivarConcepto}
                                  onChange={(value) => {
                                    let tabla: any[] = [];
                                    tabla = state.DatosTabla;

                                    tabla.forEach((element) => {
                                      if (element.id > 0 && element.id < 1000) {
                                        element.referencia = value.target.value;
                                      }
                                    });

                                    setState((s) => ({
                                      ...s,
                                      DatosTabla: tabla,
                                    }));
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
                        {/*                <div className="col-1">
                                                    <br />
                                                    <div className="row"
                                                    >
                                                        <div className="col-1">

                                                            <button type="button" className="ms-2 mb-1 btn btn-secondary waves-effect waves-light" onClick={() => { setActivarDesactivarConcepto(false) }}>
                                                                <FaPencilAlt />
                                                            </button>
                                                            <button type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={() => { setActivarDesactivarConcepto(true) }}>
                                                                <FaCheck />
                                                            </button>
                                                        </div>

                                                    </div>

                                                </div> */}
                      </div>
                    </Form>
                  </Formik>
                  <br />

                  <h5>Detalle Poliza</h5>
                  <hr />
                  {/** <br />
                                    {
                                        state.DatosTabla.length <= 0 ?
                                            <button disabled={true} type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={() => {
                                                mostrarModal(5)
                                            }}>
                                                <FaPlus /> Agregar
                                            </button> :
                                            <button disabled={false} type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={() => {
                                                mostrarModal(5)
                                            }}>
                                                <FaPlus /> Agregar
                                            </button>
                                    }
                                    <br /> */}
                  {state.Cargando && <Spinner />}
                  <DataTable
                    data={state.DatosTabla}
                    striped
                    pagination
                    dense
                    noHeader
                    noDataComponent={"Sin movimientos"}
                    responsive
                    defaultSortAsc
                    keyField={"ids"}
                    defaultSortField={""}
                    /*    onRowDoubleClicked={(value: any) => {
                                            if (state.Datos.numero === 0 || state.Datos.numero === undefined || state.Datos.numero === null) {
                                                mostrarModal(4, value)

                                            }
                                        }}
                       */ columns={Columns}
                  />
                  <ModalWin
                    large={state.Form.MostrarModalDetalleMov}
                    open={state.Form.MostrarModalDetalleMov}
                  >
                    <ModalWin.Header>
                      <h5 className={MODAL_TITLE_CLASS}>Movimieto a poliza</h5>
                    </ModalWin.Header>
                    <ModalWin.Body>
                      {
                        <CFormDetalleMov
                          Seguridad={props.oidc}
                          initialValues={state.Form.Datos}
                          Id={state.Form.Id}
                          cbActualizar={cbActualizar}
                          cbGuardar={cbAgregar}
                          fnCancelar={fnCancelar}
                          opCuentasContablesModal={state.optCuentasContables}
                          explorar={state.explorar}
                          DatosDefectoModalDetalle={
                            state.DatosDefectoModalDetalle
                          }
                          cuentasContables={state.cuentasContables}
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdmCuentasBacariasMovimietos);
