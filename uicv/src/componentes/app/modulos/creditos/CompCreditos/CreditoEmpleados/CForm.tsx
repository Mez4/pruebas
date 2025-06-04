import React, { useRef, useState, useEffect } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Spinner,
  ActionSelect,
  ActionCreatableSelect,
  ActionAsyncSelect,
  ActionFieldText,
} from "../../../../../global";
import {
  ControlDatosBancarios,
  BuscarDatosBancarios,
  Cajas,
  Sucursales,
  Empleados,
  TiposDesembolsos,
} from "../../../../../selectores";
import * as Funciones from "./Funciones";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import CreatableSelect from "react-select/creatable";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { toast } from "react-toastify";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../../global/ModalWin";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { DBConfia_General } from "../../../../../../interfaces_db/DBConfia/General";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

type CFormType = {
  oidc: IOidc;
  ProductoID: number;
  Id?: number;
  evento: string;
  initialValues: {
    ProductoId: number;
    EmpleadoId: number;
    SucursalId: number;
    CajaID: number;
    ClienteId: number;
    Capital: number;
    Plazos: number;
    TipoDesembolsoID: number;
    Motivo: string;
    InteresVG: string;
    ManejoVG: string;
    IvaVG: string;
  };
  cbActualizar(item: any): any;
  cbGuardar(item: any): any;
  fnCancelar(): any;
  fnGetTiposDesembolso(SucursalId: number, ProductoID: number): any;
  fnGetDistribuidores(id: any): any;
  fnGetEmpleados(DistribuidorID: number, Nombre: string, callback: any): any;
  cbDatosEmpleado?(Datos: any, Id: number): any;
  fnGetCondicionesDetalle(
    ProductoID: number,
    SucursalId: number,
    DistribuidorID: number
  ): any;
  fnGetListaPlazos(Capital: number): any;
  fnGetDatosFolios(id: any): any;
  fnGetDatosDistribuidor(id: any): any;
  fnGetDatosEmpleado(id: any): any;
  fnGetDatosTipoDesembolso(id: any): any;
  fnGetListaCapital(): any;
  FNGetVariablesGlobales(): any;
  optDistribuidores: { value: number; label: string }[];
  optSucursales: { value: number; label: string }[];
  optEmpleados: { value: number; label: string }[];
  optCapital: { value: string; label: string }[];
  optPlazos: { value: string; label: string }[];
  optTiposDesembolso: { value: number; label: string }[];
  optSeries: { value: number; label: string }[];
  optFolios: { value: number; label: string }[];
  isUpdate: boolean;
  DatosCliente: any;
  DatosDistribuidor: any;
  DatosEmpleado: any;
  InteresVG: string;
  ManejoVG: string;
  IvaVG: string;
  DatosFolio: any;
  DatosTipoDesembolso: any;
};

type EstadoTipo = {
  Datos: {
    Persona?: DBConfia_General.IPersonas_VW;
    Direcciones: DBConfia_General.IDirecciones_VW[];
    Empleos: DBConfia_General.IEmpleos_VW[];
  };
  Cargando: boolean;
  Error: boolean;
};

export const CForm = (props: CFormType) => {
  console.log("Id ", props.Id);

  const MySwal = withReactContent(Swal);

  const [loading, setLoading] = useState(false);

  const [ShowDatosBancarios, setShowDatosBancarios] = useState(false);

  const [CanjearVale, setCanjearVale] = useState(false);

  const [InteresVG, setInteresVG] = useState("0");

  const [ManejoVG, setManejoVG] = useState("0");

  const [IvaVG, setIvaVG] = useState("0");

  const [capital, setCapital] = useState(0);

  const [state, setState] = useState({
    Motivo: "",
  });

  const [creditoVale, setCreditoVale] = useState(0);

  const [creditoTienda, setCreditoTienda] = useState(0);

  const [MovimientoID, setMovimientoID] = useState(0);

  const [VentaId, setVentaId] = useState(0);

  const [errorVale, setErrorVale] = useState(false);

  const [errorTienda, setErrorTienda] = useState(false);

  const [resCredito, setResCredito] = useState(false);

  const [formValues, setFormValues] = useState({
    optDistribuidores: [{ value: 0, label: "" }],
    optCapital: [{ value: "", label: "" }],
    optPlazos: [{ value: "", label: "" }],
    optFolios: [{ value: 0, label: "" }],
    optSeries: [{ value: 0, label: "" }],
    optEmpleados: [{ value: 0, label: "", estatus: "" }],
    optTiposDesembolso: props.optTiposDesembolso,
    SucursalId: props.initialValues.SucursalId,
    EmpleadoId: props.initialValues.EmpleadoId,
    ClienteId: props.initialValues.ClienteId,
    Capital: props.initialValues.Capital,
    InteresVG: props.InteresVG,
    ManejoVG: props.ManejoVG,
    IvaVG: props.IvaVG,
    Plazos: props.initialValues.Plazos,
    TipoDesembolsoID: props.initialValues.TipoDesembolsoID,
    DatosFolio: props.DatosFolio,
    datoBancario: "",
    personasDatosBancariosID: 0,
    Motivo: props.initialValues.Motivo,
  });

  const [total, setTotal] = useState(0);

  const [totalInteres, setTotalInteres] = useState(0);

  const [totalManejo, setTotalManejo] = useState(0);

  const [totalIVA, setTotalIVA] = useState(0);

  const [totalUSV, setTotalUSV] = useState(0);

  const refSucursal = useRef<Select>(null);
  const refEmpleado = useRef<AsyncSelect<[], false>>(null);
  const refCapital =
    useRef<CreatableSelect<{ value: string; label: string }, false>>(null);
  const refPlazos =
    useRef<CreatableSelect<{ value: string; label: string }, false>>(null);
  const refTipoDesembolso = useRef<Select>(null);

  const clearFormByLevel = (level: number) => {
    if (level === 0) {
      // refSucursal.current?.select.setValue({ value: '0', label: '' }, "deselect-option")
    }
    if (level === 0 || level === 1) {
      setFormValues((s) => ({
        ...s,
        optCapital: [],
        optPlazos: [],
        optEmpleados: [],
        Motivo: "",
        optTiposDesembolso: [],
      }));
      refTipoDesembolso.current?.select.setValue(
        { value: "0", label: "" },
        "deselect-option"
      );
    }
    if (level === 0 || level === 1 || level === 2) {
      const capital: any = refCapital.current?.select;
      const plazos: any = refPlazos.current?.select;
      // const employe: any = refEmpleado.current?.select

      //   refEmpleado.current?.select.setValue({ value: '0', label: '' }, "deselect-option")
      // employe.select.setValue({ value: '0', label: '' }, "deselect-option")
      capital.select.clearValue();
      plazos.select.clearValue();

      //props.DatosEmpleado[0] = '';
      setState({ ...state, Motivo: "" });
      setState((s) => ({ ...s, InteresVG: "0", ManejoVG: "0", IvaVG: "0" }));
    }
    if (level === 0 || level === 1 || level === 2 || level === 3) {
    }
  };

  const loadOptionsEmpleados = (inputText: string, callback: any) => {
    // const sucursal: any = refSucursal;
    // const SucursalId = sucursal.current.props.value.value as number;
    props.fnGetEmpleados(props.initialValues.SucursalId, inputText, callback);
  };

  const fnGetCondicionesDetalle = () => {
    const sucursal: any = refSucursal;
    const ProductoID = props.ProductoID; //.DatosEmpleado.productoID;
    const SucursalId = sucursal.current.props.value.value as number;
    props.fnGetCondicionesDetalle(ProductoID, SucursalId, 0);
    // props.fnGetTiposDesembolso(SucursalId, ProductoID);
  };
  const fnSetCapital = (value: number) => {
    setCapital(value == 0 ? 0 : value);
    props.fnGetListaPlazos(value);
    setInteresVG(props.initialValues.InteresVG);
    setManejoVG(props.initialValues.ManejoVG);
    setIvaVG(props.initialValues.IvaVG);
    fnCalculos();
  };

  const cbSucursal = (value: any) => {
    clearFormByLevel(1);
    props.fnGetDatosEmpleado(value);
    props.fnGetListaCapital();
  };

  const cbEmpleado = (value: any) => {
    clearFormByLevel(3);
  };

  const cbPlazo = (value: any) => {
    setFormValues((s) => ({ ...s, Plazos: value }));
    fnCalculos();
  };

  const cbTipoDesembolso = (value: any) => {
    setFormValues((s) => ({ ...s, TipoDesembolsoID: value }));
    props.fnGetDatosTipoDesembolso(value);
  };

  const fnCancelarDatosBancarios = () => setShowDatosBancarios(false);

  const cbAceptarDatosBancarios = (id: number) => {
    setShowDatosBancarios(false);
    setFormValues((s) => ({ ...s, personasDatosBancariosID: id }));
  };

  useEffect(() => {
    setFormValues((s) => ({ ...s, optCapital: props.optCapital }));
  }, [props.optCapital]);

  useEffect(() => {
    setFormValues((s) => ({ ...s, optPlazos: props.optPlazos }));
  }, [props.optPlazos]);

  useEffect(() => {
    setFormValues((s) => ({ ...s, DatosFolio: props.DatosFolio }));
  }, [props.DatosFolio]);

  useEffect(() => {
    let total = capital + totalInteres + totalManejo + totalIVA;
    setTotal(total);
    fnCalculos();
  }, [capital, totalInteres, totalManejo, totalIVA]);

  useEffect(() => {
    setFormValues((s) => ({ ...s, InteresVG: formValues.InteresVG }));
    fnCalculos();
  }, [formValues.InteresVG]);

  useEffect(() => {
    setFormValues((s) => ({ ...s, ManejoVG: formValues.ManejoVG }));
    fnCalculos();
  }, [formValues.ManejoVG]);

  useEffect(() => {
    setFormValues((s) => ({ ...s, IvaVG: formValues.IvaVG }));
    fnCalculos();
  }, [formValues.IvaVG]);

  useEffect(() => {
    setState({ ...state, Motivo: props.initialValues.Motivo });

    // if(props.initialValues.TipoDesembolsoID > 0){
    //     // console.log('TipoDesembolsoID: ', props.initialValues.TipoDesembolsoID)
    //     setFormValues(s => ({ ...s, TipoDesembolsoID: props.initialValues.TipoDesembolsoID }))
    //     refTipoDesembolso.current?.select.setValue({ value: String(props.initialValues.TipoDesembolsoID), label: 'Desembolso Actual' }, "select-option")
    // }

    // if(props.initialValues.Plazos > 0){
    //     // console.log('Capital', props.initialValues.Capital)
    //     setFormValues(s => ({ ...s, Plazos: props.initialValues.Plazos }))
    //     const plazos: any = refPlazos.current?.select
    //     plazos.select.setValue({ value: props.initialValues.Plazos, label: props.initialValues.Plazos }, "select-option")
    // }
  }, [props.initialValues.Motivo]);

  useEffect(() => {
    // console.log('initial: ', props.initialValues)
    if (props.initialValues.Capital > 0) {
      // console.log('Capital', props.initialValues.Capital)
      const capital: any = refCapital.current?.select;
      capital.select.setValue(
        {
          value: props.initialValues.Capital,
          label: props.initialValues.Capital,
        },
        "select-option"
      );
      fnSetCapital(props.initialValues.Capital);
    }
  }, [props.optCapital, props.initialValues.Capital]);

  useEffect(() => {
    if (props.initialValues.TipoDesembolsoID > 0) {
      // console.log('TipoDesembolsoID: ', props.initialValues.TipoDesembolsoID)
      setFormValues((s) => ({
        ...s,
        TipoDesembolsoID: props.initialValues.TipoDesembolsoID,
      }));
      refTipoDesembolso.current?.select.setValue(
        {
          value: String(props.initialValues.TipoDesembolsoID),
          label: "Desembolso Actual",
        },
        "select-option"
      );
    }
  }, [props.initialValues.TipoDesembolsoID]);

  useEffect(() => {
    setFormValues((s) => ({
      ...s,
      optTiposDesembolso: props.optTiposDesembolso,
    }));

    // if(props.initialValues.TipoDesembolsoID > 0 && props.initialValues.personasDatosBancariosID > 0){
    //     cbTipoDesembolso(props.initialValues.TipoDesembolsoID)
    // }
  }, [props.optTiposDesembolso]);

  useEffect(() => {
    // console.log('initial: ', props.initialValues)
    if (props.initialValues.Plazos > 0) {
      // console.log('Capital', props.initialValues.Capital)
      setFormValues((s) => ({ ...s, Plazos: props.initialValues.Plazos }));
      const plazos: any = refPlazos.current?.select;
      plazos.select.setValue(
        {
          value: props.initialValues.Plazos,
          label: props.initialValues.Plazos,
        },
        "select-option"
      );
    }
  }, [props.optPlazos, props.initialValues.Plazos]);

  useEffect(() => {
    fnCalculos();
  }, [InteresVG, IvaVG, ManejoVG, formValues.Plazos, formValues.Capital]);

  const fnCalculos = () => {
    let MontoInteres =
      ((capital * (parseInt(InteresVG) / 100)) / 2) * formValues.Plazos;
    setTotalInteres(isNaN(MontoInteres) ? 0 : MontoInteres);

    let MontoManejo = capital * (parseInt(ManejoVG) / 100);
    setTotalManejo(isNaN(MontoManejo) ? 0 : MontoManejo);

    //let MontoUSV = (MontoInteres / 1000) * (USV / 100) * (formValues.Plazos * DiasPer)

    let MontoIVA = (MontoInteres + MontoManejo) * (parseInt(IvaVG) / 100);
    setTotalIVA(isNaN(MontoIVA) ? 0 : MontoIVA);
  };

  const DescargarPDF = (respuesta: any) => {
    toast.info("Se está generando el pagaré, por favor espere...");
    Funciones.FNPdf(props.oidc, {
      ProductoID: props.ProductoID,
      CreditoID: respuesta.CreditoId,
      CreditoID_2: 0,
    })
      .then((pdf: any) => {
        const file = new Blob([pdf], { type: "application/pdf" });

        // const fileURL = URL.createObjectURL(file);

        // window.open(fileURL);

        var url = window.URL.createObjectURL(file);
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
        // var anchor = document.createElement("a");
        // anchor.download = "myfile.pdf";
        // anchor.href = url;
        // anchor.click();

        setLoading(false);

        // setCanjearVale(false)

        // clearFormByLevel(0)
      })
      .catch((error: any) => {
        console.log(JSON.stringify(error));

        // toast.error("Error al descargar el archivo, intente descargar el archivo o reportarlo a sistemas")

        MySwal.fire({
          title: "<strong>Error</strong> al descargar el archivo",
          icon: "error",
          html: (
            <div className="text-center">
              Intente volver a descargar el archivo o reportarlo a sistemas.
            </div>
          ),
          showCloseButton: false,
          showCancelButton: true,
          showConfirmButton: true,
          focusConfirm: false,
          cancelButtonText: "Cerrar",
          confirmButtonText: "Descargar",
          confirmButtonAriaLabel: "",
          cancelButtonAriaLabel: "",
        }).then((result) => {
          if (result.isConfirmed) {
            DescargarPDF(respuesta);
            setLoading(false);
          } else {
            setLoading(false);
          }
        });
      });
  };

  return (
    <>
      <Formik
        initialValues={props.initialValues}
        enableReinitialize
        validationSchema={Yup.object().shape({
          SucursalId: Yup.number()
            .required("Seleccione la Sucursal")
            .moreThan(0, "Seleccione la Sucursal"),
          CajaID: Yup.number()
            .required("Seleccione la Caja")
            .moreThan(0, "Seleccione la Caja"),
          EmpleadoId: Yup.number()
            .required("Seleccione un Empleado")
            .moreThan(0, "Seleccione un Empleado"),
          Capital: Yup.object()
            .shape({
              label: Yup.string().required(),
              value: Yup.string().required(),
            })
            .required("Seleccione o ingrese el Capital")
            .nullable(), //Yup.number().required("Ingrese el capital").moreThan(0, 'Ingrese el capital'),
          Plazos: Yup.object()
            .shape({
              label: Yup.string().required(),
              value: Yup.string().required(),
            })
            .required("Seleccione o ingrese el número de Plazos")
            .nullable(),
          TipoDesembolsoID: Yup.number()
            .required("Seleccione el tipo de Desembolso")
            .moreThan(0, "Seleccione el tipo de Desembolso"),

          InteresVG: Yup.number().required("Ingresa un porcentaje de Interes"),
          ManejoVG: Yup.number().required(
            "Ingresa un porcentaje de Manejo de cta"
          ),
          IvaVG: Yup.number().required("Ingresa un porcentaje de IVA"),
        })}
        onReset={(values: any) => {
          clearFormByLevel(0);
        }}
        onSubmit={(values: any) => {
          console.log("values: ", values);
          // console.log('props: ', props)
          // Finish the callback
          if (total > 0) {
            setResCredito(true);
            setLoading(true);
            setCanjearVale(true);

            if (props.Id! > 0) {
              Funciones.FNUpdate(props.oidc, {
                ...values,
                CreditoID: props.Id,
                SucursalId: values.SucursalId as number,
                CajaID: values.CajaID,
                EmpleadoId: values.EmpleadoId as number,
                ProductoID: props.DatosEmpleado.productoID,
                Motivo: (state.Motivo === null ? "" : state.Motivo) as string,
                Capital: values.Capital.value as number,
                Interes: totalInteres as number,
                Manejocta: totalManejo as number,
                IVA: totalIVA as number,
                Plazos: values.Plazos.value as number,
                TipoDesembolsoID: values.TipoDesembolsoID as number,
              })
                .then((respuesta: any) => {
                  console.log(respuesta);
                  if (respuesta.regresa === 1) {
                    toast.success(
                      `Se creó el crédito con el N° ${respuesta.CreditoId}`
                    );
                    setMovimientoID(respuesta.MovimientoID);

                    DescargarPDF(respuesta);
                    setLoading(false);
                    clearFormByLevel(0);
                    props.cbGuardar(respuesta.Credito);

                    // window.location.replace('');
                  } else {
                    // setErrorVale(true)
                    setLoading(false);
                    // setResCredito(false)
                    toast.error("Error al comprar, " + respuesta.msj);
                  }
                })
                .catch((error: any) => {
                  console.log(JSON.stringify(error));
                  // setErrorVale(true)
                  setLoading(false);
                  // setResCredito(false)
                  toast.error(
                    "Error al crear el crédito, intente nuevamente o reporte el error a sistemas"
                  );
                });
            } else {
              Funciones.FNAdd(props.oidc, {
                SucursalId: values.SucursalId as number,
                CajaID: values.CajaID,
                EmpleadoId: values.EmpleadoId as number,
                ProductoID: props.DatosEmpleado.productoID,
                Motivo: (state.Motivo === null ? "" : state.Motivo) as string,
                Capital: values.Capital.value as number,
                Interes: totalInteres as number,
                Manejocta: totalManejo as number,
                IVA: totalIVA as number,
                Plazos: values.Plazos.value as number,
                TipoDesembolsoID: values.TipoDesembolsoID as number,
                // TipoCanje: 1
                // articles: articles
              })
                .then((respuesta: any) => {
                  if (respuesta.regresa === 1) {
                    toast.success(
                      `Se creó el crédito con el N° ${respuesta.CreditoId}`
                    );
                    setCreditoVale(respuesta.CreditoId);
                    setMovimientoID(respuesta.MovimientoID);
                    setVentaId(respuesta.VentaId);
                    setErrorVale(false);
                    setCanjearVale(false);
                    //DESCARGAR EL PAGARE
                    DescargarPDF(respuesta);
                  } else {
                    // setErrorVale(true)
                    setLoading(false);
                    setResCredito(false);
                    toast.error(respuesta.msj);
                  }
                })
                .catch((error: any) => {
                  console.log(JSON.stringify(error));
                  setErrorVale(true);
                  setCanjearVale(false);
                  setLoading(false);
                  setResCredito(false);
                  toast.error("Error al crear el vale");
                });
            }
          } else {
            toast.error(`Debes de seleccionar un monto de crédito.`);
          }
        }}
      >
        {({ values }) => (
          <Form>
            <div className="columns is-desktop is-tablet">
              <div className="column is-12-mobile is-12-tablet is-half-desktop">
                {/* { isMounted &&  */}
                {/* <ActionSelect
                                    disabled={ loading}
                                    label="Sucursal"
                                    name="SucursalId"
                                    placeholder="Seleccione la sucursal"
                                    options={props.optSucursales}
                                    addDefault={false}
                                    valor={values.SucursalId}
                                    accion={cbSucursal}
                                    ref={refSucursal}
                                /> */}
                <Sucursales
                  disabled={props.isUpdate || loading}
                  name={"SucursalId"}
                  valor={values.SucursalId}
                  ProductoID={props.ProductoID}
                />
              </div>
              <div className="column is-12-mobile is-12-tablet is-half-desktop">
                <Cajas
                  name="CajaID"
                  // unaLinea
                  disabled
                  // ProductoID={props.ProductoID}
                  SucursalId={values.SucursalId}
                  oidc={props.oidc}
                />
              </div>
            </div>

            <div className="columns is-desktop is-tablet">
              <div className="column is-12-mobile is-12-tablet is-one-third-desktop">
                {/* { isMounted &&  */}
                {props.isUpdate && (
                  <Empleados
                    disabled
                    SucursalID={
                      isNaN(values.SucursalId) ? 0 : values.SucursalId
                    }
                    name={"EmpleadoId"}
                    label={"Empleado"}
                    valor={values.EmpleadoId}
                    cbAccion={cbEmpleado}
                    cbDatos={props.cbDatosEmpleado}
                  />
                )}
                {!props.isUpdate && (
                  <ActionAsyncSelect
                    loadOptions={loadOptionsEmpleados}
                    disabled={props.isUpdate || loading}
                    label="Empleado"
                    name="EmpleadoId"
                    placeholder="Seleccione un Empleado"
                    options={props.optEmpleados}
                    addDefault={false}
                    valor={props.initialValues.EmpleadoId}
                    accion={cbEmpleado}
                    noOptionsMessage={"No encontrado"}
                    ref={refEmpleado}
                    blur={fnGetCondicionesDetalle}
                  />
                )}
              </div>
              <div className="column is-12-mobile is-12-tablet is-2-desktop">
                Estatus Empleado
                <input
                  disabled={true}
                  value={
                    props.DatosEmpleado[0] === "A"
                      ? "ACTIVO"
                      : props.DatosEmpleado[0] === "F"
                      ? "FINIQUITADO"
                      : props.DatosEmpleado[0] === "T"
                      ? "TRASPASO"
                      : ""
                  }
                  className="form-control"
                  name=""
                />
              </div>
              <div className="column is-Third">
                Motivo
                <input
                  disabled={loading || props.isUpdate}
                  placeholder=""
                  className="form-control"
                  name="Motivo"
                  id="Motivo"
                  value={state.Motivo}
                  onChange={(e) =>
                    setState({ ...state, Motivo: e.target.value })
                  }
                  type="string"
                />
                {/* <CustomFieldText disabled={loading} label="Motivo" name="Motivo" placeholder="" /> */}
              </div>
            </div>
            <div className="columns is-desktop is-tablet">
              <div className="column is-12-mobile is-12-tablet is-one-quarter-desktop">
                <ActionCreatableSelect
                  disabled={loading}
                  label="Cantidad a Solicitar"
                  name="Capital"
                  placeholder="Seleccione o ingrese el importe"
                  options={formValues.optCapital}
                  // addDefault={false}
                  accion={fnSetCapital}
                  value={values.Capital}
                  ref={refCapital}
                />
              </div>
              <div className="column is-12-mobile is-12-tablet is-3-desktop">
                <br />
                {/* Interes % */}
                {/* <input disabled={loading} placeholder={state.InteresVG} className="form-control" name="InteresVG" id="InteresVG" value={state.InteresVG} onChange={e => setState({ ...state, InteresVG: e.target.value }) } type='number' /> */}
                <ActionFieldText
                  disabled={loading}
                  label="Interes %"
                  placeholder={""}
                  name={"InteresVG"}
                  valor={props.InteresVG}
                  onBlur={() => {
                    setInteresVG(values.InteresVG);
                  }}
                  onChange={() => {
                    setInteresVG(values.InteresVG);
                  }}
                />
              </div>
              <div className="column is-12-mobile is-12-tablet is-3-desktop">
                <br />
                {/* Manejo de cta %
                                <input disabled={loading} placeholder={state.ManejoVG} className="form-control" name="ManejoVG" id="ManejoVG" value={state.ManejoVG} onChange={e => setState({ ...state, ManejoVG: e.target.value })} type='number' /> */}
                <ActionFieldText
                  disabled={loading}
                  label="Manejo de cta %"
                  placeholder={""}
                  name={"ManejoVG"}
                  valor={props.ManejoVG}
                  onBlur={() => {
                    setManejoVG(values.ManejoVG);
                  }}
                  onChange={() => {
                    setManejoVG(values.ManejoVG);
                  }}
                />
              </div>
              <div className="column is-12-mobile is-12-tablet is-3-desktop">
                <br />
                {/* IVA %
                                <input disabled={loading} placeholder={state.IvaVG} className="form-control" name="IvaVG" id="IvaVG" value={state.IvaVG} onChange={e => setState({ ...state, IvaVG: e.target.value })} type='number' />*/}
                <ActionFieldText
                  disabled={loading}
                  label="IVA %"
                  placeholder={""}
                  name={"IvaVG"}
                  valor={props.IvaVG}
                  onBlur={() => {
                    setIvaVG(values.IvaVG);
                  }}
                  onChange={() => {
                    setIvaVG(values.IvaVG);
                  }}
                />
              </div>
            </div>
            <div className="columns is-desktop is-tablet">
              <div className="column is-12-mobile is-12-tablet is-one-third-desktop">
                {/* { isMounted &&  */}
                <ActionCreatableSelect
                  disabled={loading}
                  label="Plazos"
                  name="Plazos"
                  placeholder="Seleccione el número de plazos"
                  options={formValues.optPlazos}
                  // addDefault={false}
                  value={values.Plazos}
                  ref={refPlazos}
                  accion={cbPlazo}
                />
                {/* } */}
              </div>
              <div className="column is-12-mobile is-12-tablet is-one-third-desktop">
                {/* { isMounted &&  */}
                {props.isUpdate && (
                  <TiposDesembolsos
                    oidc={props.oidc}
                    disabled={loading}
                    SucursalID={
                      isNaN(values.SucursalId) ? 0 : values.SucursalId
                    }
                    name={"TipoDesembolsoID"}
                    label={"Tipo de Desembolso"}
                    valor={values.TipoDesembolsoID}
                    cbAccion={cbEmpleado}
                    cbDatos={props.cbDatosEmpleado}
                    isSingle
                  />
                )}
                {!props.isUpdate && (
                  <ActionSelect
                    disabled={loading}
                    label="Tipo de Desembolso"
                    name="TipoDesembolsoID"
                    placeholder="Seleccione el tipo de desembolso"
                    options={props.optTiposDesembolso}
                    addDefault={false}
                    valor={values.TipoDesembolsoID}
                    ref={refTipoDesembolso}
                    accion={cbTipoDesembolso}
                  />
                )}
              </div>
              <div className="column is-one-third">
                <br />
                <ControlDatosBancarios
                  name={`personasDatosBancariosID`}
                  RequiereDatosBancarios={
                    props.DatosTipoDesembolso.RequiereDatosBancarios ?? false
                  }
                  ClienteId={values.ClienteId}
                  valor={formValues.personasDatosBancariosID}
                  fnOpen={() => setShowDatosBancarios(true)}
                />
              </div>
            </div>

            <div className="columns is-desktop is-tablet">
              <div className="column is-two-thirds"></div>
              <div className="column is-one-third">
                <h1 className="title is-3">{`TOTAL: $${total}`}</h1>
              </div>
            </div>
            <br />
            {loading && <Spinner />}
            {!loading && (
              <div className="text-end">
                <button
                  type="reset"
                  className="btn btn-danger waves-effect waves-light"
                  onClick={props.fnCancelar}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="ms-2 btn btn-success waves-effect waves-light"
                >
                  Generar Crédito
                </button>
              </div>
            )}
          </Form>
        )}
      </Formik>

      <ModalWin open={resCredito}>
        <ModalWin.Header>
          <h5 className={MODAL_TITLE_CLASS}>Generando Crédito</h5>
        </ModalWin.Header>
        <ModalWin.Body>
          <button
            className={`btn btn-${
              errorVale ? "danger" : CanjearVale ? "warning" : "success"
            }`}
            type="button"
            disabled
          >
            {CanjearVale && (
              <>
                <span
                  className="spinner-grow spinner-grow-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                &nbsp; Canjeando Vale...
              </>
            )}
            {!CanjearVale && !errorVale && <>Canje de Vale Completado</>}
            {errorVale && <>Error</>}
          </button>
          &nbsp;
          {creditoVale > 0 && (
            <>
              N° de Crédito: <strong>{creditoVale}</strong>
            </>
          )}
          <br />
          <br />
          <br />
          <hr />
          <br />
          <div className="text-end">
            <button
              type="button"
              disabled={loading || creditoVale < 0}
              className="ms-2 btn btn-danger waves-effect waves-light"
              onClick={() => {
                setResCredito(false);
                clearFormByLevel(0);
                setCreditoVale(0);
                setCreditoTienda(0);
                setMovimientoID(0);
                setVentaId(0);
                setErrorVale(false);
                setErrorTienda(false);
                setLoading(false);
              }}
            >
              Cerrar
            </button>
            <button
              type="button"
              disabled={loading || creditoVale < 0}
              className="ms-2 btn btn-primary waves-effect waves-light"
              onClick={() => {
                setLoading(true);
                Funciones.FNPdf(props.oidc, {
                  ProductoID: props.ProductoID,
                  CreditoID: creditoVale,
                  CreditoID_2: creditoTienda,
                })
                  .then((pdf: any) => {
                    const file = new Blob([pdf], { type: "application/pdf" });

                    // const fileURL = URL.createObjectURL(file);

                    // window.open(fileURL);
                    var url = window.URL.createObjectURL(file);
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
                  })
                  .catch((error: any) => {
                    console.log(JSON.stringify(error));
                    setLoading(false);
                    toast.error(
                      "Error al descargar el archivo, intente descargar el archivo o reportarlo a sistemas"
                    );
                  });
              }}
            >
              Descargar Pagare&nbsp;
              <FaCloudDownloadAlt />
            </button>
          </div>
        </ModalWin.Body>
      </ModalWin>

      <ModalWin center open={ShowDatosBancarios}>
        <ModalWin.Header>
          <h5 className={MODAL_TITLE_CLASS}>{"Datos Bancarios"}</h5>
        </ModalWin.Header>
        <ModalWin.Body>
          {ShowDatosBancarios && (
            <BuscarDatosBancarios
              initialValues={{
                personaID: formValues.ClienteId,
                cveBancoRef: 0,
                datoTipoID: 0,
                datoBancario: "",
                personasDatosBancariosID: 0,
              }}
              cbAceptar={cbAceptarDatosBancarios}
              fnCancelar={fnCancelarDatosBancarios}
            />
          )}
        </ModalWin.Body>
      </ModalWin>
    </>
  );
};
