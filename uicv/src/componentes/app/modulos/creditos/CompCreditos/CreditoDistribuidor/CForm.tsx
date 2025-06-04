import React, { useRef, useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Spinner,
  ActionSelect,
  ActionCreatableSelect,
} from "../../../../../global";
import {
  Sucursales,
  Distribuidores,
  ProdPresPer,
  Cajas,
} from "../../../../../selectores";
import * as Funciones from "./Funciones";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import CreatableSelect from "react-select/creatable";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { iUI } from "../../../../../../interfaces/ui/iUI";
import { toast } from "react-toastify";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../../global/ModalWin";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { DescripcionDistribuidor } from "../../../../../../global/variables";
import {
  ControlDatosBancarios,
  BuscarDatosBancarios,
} from "../../../../../selectores";

type CFormType = {
  oidc: IOidc;
  ui: iUI;
  ProductoID: number;
  Id?: number;
  initialValues: {
    ProductoID: number;
    DistribuidorID: number;
    SucursalId: number;
    CajaID: number;
    ClienteId: number;
    Plazos: number;
    TipoDesembolsoID: number;
    Capital: number;
    personasDatosBancariosID: number;
    RequiereDatosBancarios: boolean;
  };
  // cbActualizar(item: any): any,
  // cbGuardar(item: any): any,
  fnCancelar(res: any): any;
  fnGetDistribuidores(id: any): any;
  fnGetCondicionesDetalle(
    ProductoID: number,
    SucursalId: number,
    DistribuidorID: number
  ): any;
  fnGetTiposDesembolso(ProductoID: number, SucursalId: number): any;
  fnGetListaPlazos(Capital: number): any;
  // fnGetDatosDistribuidor(id: any): any,
  fnGetDatosTipoDesembolso(id: any): any;
  DatosTipoDesembolso: any;
  optDistribuidores: { value: number; label: string }[];
  optSucursales: { value: number; label: string }[];
  optPlazos: { value: string; label: string }[];
  optTiposDesembolso: { value: number; label: string }[];
  optCapital: { value: string; label: string }[];
  DatosDistribuidor: any;
  TiposDesembolso: any;
};

export const CForm = (props: CFormType) => {
  // console.log('initialValues: ', props.initialValues)

  const MySwal = withReactContent(Swal);

  const [loading, setLoading] = useState(false);

  const [MovimientoID, setMovimientoID] = useState(0);

  const [formValues, setFormValues] = useState({
    optDistribuidores: [{ value: 0, label: "" }],
    optPlazos: [{ value: "0", label: "" }],
    optCuenta: [{ value: 0, label: "" }],
    optTiposDesembolso: [{ value: 0, label: "" }],
    SucursalId: props.initialValues.SucursalId,
    ClienteId: props.initialValues.ClienteId,
    Plazos: props.initialValues.Plazos,
    TipoDesembolsoID: props.initialValues.TipoDesembolsoID,
    personasDatosBancariosID: 0,
  });

  const [ShowDatosBancarios, setShowDatosBancarios] = useState(false);

  const [capital, setCapital] = useState(0);

  const [isMounted, setisMounted] = useState(false);
  const refSucursal = useRef<Select>(null);
  const refDistribuidor = useRef<Select>(null);
  const refPlazos =
    useRef<CreatableSelect<{ value: string; label: string }, false>>(null);
  const refCapital =
    useRef<CreatableSelect<{ value: string; label: string }, false>>(null);
  const refTipoDesembolso = useRef<Select>(null);

  const clearFormByLevel = (level: number) => {
    if (level === 0) {
      refSucursal.current?.select.setValue(
        { value: "0", label: "" },
        "deselect-option"
      );
    }
    if (level === 0 || level === 1) {
      setFormValues((s) => ({
        ...s,
        optPlazos: [],
        optDistribuidores: [],
        optCuenta: [],
        optTiposDesembolso: [],
      }));
      refTipoDesembolso.current?.select.setValue(
        { value: "0", label: "" },
        "deselect-option"
      );
    }
    if (level === 0 || level === 1 || level === 2) {
      const capital: any = refCapital.current?.select;
      capital.select.clearValue();

      const plazos: any = refPlazos.current?.select;
      plazos.select.clearValue();
    }
  };

  const cbDistribuidor = (value: any) => {
    setFormValues((s) => ({ ...s, DistribuidorId: value }));
    clearFormByLevel(2);
    // props.fnGetDatosDistribuidor(value);
  };

  // const fnGetCondicionesDetalle = () => {
  //     const sucursal: any = refSucursal;
  //     const distribuidor: any = refDistribuidor;

  //     const ProductoID = props.ProductoID;
  //     const SucursalId = sucursal.current.props.value.value as number;
  //     const DistribuidorID = distribuidor.current.props.value.value as number;

  //     props.fnGetCondicionesDetalle(ProductoID, SucursalId, DistribuidorID);
  // }

  // const cbSucursal = (value: any) => {
  //     setFormValues(s => ({ ...s, SucursalId: value }))
  //     clearFormByLevel(1)
  //     props.fnGetDistribuidores(value)
  //     props.fnGetTiposDesembolso(props.ProductoID, value)
  //     props.fnGetCondicionesDetalle(props.ProductoID, value, 0);
  // }

  const fnCancelar = (res: any) => {
    clearFormByLevel(1);
    props.fnCancelar(res);
  };

  const cbPlazo = (value: any) => {
    setFormValues((s) => ({ ...s, Plazos: value }));
  };

  const cbTipoDesembolso = (value: any) => {
    props.fnGetDatosTipoDesembolso(value);
  };

  const fnCancelarDatosBancarios = () => setShowDatosBancarios(false);

  const cbAceptarDatosBancarios = (id: number) => {
    setShowDatosBancarios(false);
    setFormValues((s) => ({ ...s, personasDatosBancariosID: id }));
  };

  const fnSetCapital = (value: number) => {
    // const capital: any = refCapital;
    setCapital(value == 0 ? 0 : value);
  };

  const DescargarPDF = (respuesta: any) => {
    toast.info("Se está generando el pagaré, por favor espere...");
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
          } else {
            setLoading(false);
          }
        });
      });
  };

  useEffect(() => {
    if (props.initialValues.SucursalId > 0) {
      setFormValues((s) => ({
        ...s,
        SucursalId: props.initialValues.SucursalId,
      }));
      // refSucursal.current?.select.setValue({ value: String(props.initialValues.SucursalId), label: 'SUCURSAL' }, "select-option")
    }
  }, [props.initialValues.SucursalId]);

  useEffect(() => {
    setFormValues((s) => ({
      ...s,
      optTiposDesembolso: props.optTiposDesembolso,
    }));
    // let val = props.optTiposDesembolso.length > 0 ? { value: String(props.optTiposDesembolso[0].value), label: props.optTiposDesembolso[0].label } : { value: '0', label: 'Sin tipo desembolso' }
    // refTipoDesembolso.current?.select.setValue(val, 'select-option')
  }, [props.optTiposDesembolso]);

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

  // useEffect(() => {
  //     setFormValues(s => ({ ...s, TipoDesembolsoID: formValues.optTiposDesembolso.length > 0 ? formValues.optTiposDesembolso[0].value : 0 }))
  // }, [formValues.optTiposDesembolso])

  // useEffect(() => {
  //     setFormValues(s => ({ ...s, TipoDesembolsoID: props.TiposDesembolso.TipoDesembolsoID ? props.TiposDesembolso.TipoDesembolsoID : 0 }))
  // }, [props.TiposDesembolso])

  useEffect(() => {
    setFormValues((s) => ({ ...s, optPlazos: props.optPlazos }));
  }, [props.optPlazos]);

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
  }, [props.initialValues.Capital]);

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
  }, [props.initialValues.Plazos]);

  useEffect(() => {
    if (
      props.initialValues.TipoDesembolsoID > 0 &&
      props.initialValues.personasDatosBancariosID > 0
    ) {
      cbTipoDesembolso(props.initialValues.TipoDesembolsoID);
    }
  }, [props.optTiposDesembolso]);

  useEffect(() => {
    if (props.initialValues.personasDatosBancariosID > 0) {
      setFormValues((s) => ({
        ...s,
        personasDatosBancariosID: props.initialValues.personasDatosBancariosID,
      }));
    }
  }, [props.initialValues.personasDatosBancariosID]);

  useEffect(() => {
    // console.log('initial ', props.initialValues)
    // return () => {
    setisMounted(true);
    // }
  }, []);

  return (
    <>
      <Formik
        initialValues={props.initialValues}
        enableReinitialize
        validationSchema={Yup.object().shape({
          ProductoID: Yup.number()
            .required("Seleccione el producto")
            .moreThan(0, "Seleccione el producto"),
          DistribuidorID: Yup.number()
            .required(`Seleccione la ${DescripcionDistribuidor(1)}`)
            .moreThan(0, `Seleccione la ${DescripcionDistribuidor(1)}`),
          SucursalId: Yup.number()
            .required("Seleccione la sucursal")
            .moreThan(0, "Seleccione la sucursal"),
          CajaID: Yup.number()
            .required("Seleccione la Caja")
            .moreThan(0, "Seleccione la Caja"),
          //Plazos: Yup.number().required("Seleccione el número de plazos").moreThan(0, 'Seleccione el número de plazos'),
          Capital: Yup.object()
            .shape({
              label: Yup.string().required(),
              value: Yup.string().required(),
            })
            .required("Ingrese el capital")
            .nullable(), //Yup.number().required("Ingrese el capital").moreThan(0, 'Ingrese el capital'),
          Plazos: Yup.object()
            .shape({
              label: Yup.string().required(),
              value: Yup.string().required(),
            })
            .required("Seleccione o ingrese el número de Plazos")
            .nullable(),
          TipoDesembolsoID: Yup.number()
            .required("No se encontro el tipo de desembolso")
            .moreThan(0, "No se encontro el tipo de desembolso"),
          personasDatosBancariosID: Yup.number().when(
            "RequiereDatosBancarios",
            {
              is: true,
              then: Yup.number()
                .required(`Seleccione la cuenta o la CLABE del cliente`)
                .moreThan(0, `Seleccione la cuenta o la CLABE del cliente`),
            }
          ),
        })}
        onReset={(values: any) => {
          clearFormByLevel(0);
        }}
        onSubmit={(values: any) => {
          setLoading(true);

          if (props.Id! > 0) {
            Funciones.FNUpdate(props.oidc, {
              ...values,
              // ProductoID: props.ProductoID,
              CreditoId: props.Id,
              Plazos: values.Plazos.value as number,
              Capital: values.Capital.value as number,
              TipoCanje: 5,
              PrestamoNomina: false,
              ClienteId: values.DistribuidorID,
              // TipoDesembolsoID: props.TiposDesembolso.TipoDesembolsoID as number,
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
                  props.fnCancelar(respuesta.Credito);
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
            // setCanjearVale(true)
            Funciones.FNAdd(props.oidc, {
              ...values,
              // ProductoID: props.ProductoID,
              Plazos: values.Plazos.value as number,
              Capital: values.Capital.value as number,
              TipoCanje: 5,
              PrestamoNomina: false,
              ClienteId: values.DistribuidorID,
              // TipoDesembolsoID: props.TiposDesembolso.TipoDesembolsoID as number,
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
                  props.fnCancelar(respuesta);
                  // window.location.replace('');
                } else if (respuesta.regresa === 22) {
                  toast.success(respuesta.msj);
                  setLoading(false);
                  props.fnCancelar(respuesta);
                } else if (respuesta.regresa === 23) {
                  toast.success(respuesta.msj);
                  setLoading(false);
                  props.fnCancelar(respuesta);
                } else {
                  // setErrorVale(true)
                  setLoading(false);
                  // setResCredito(false)
                  if (respuesta.regresa === 21) {
                    toast.error("Error: " + respuesta.msj);
                  } else {
                    toast.error("Error al comprar, " + respuesta.msj);
                  }
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
          }
          // }
          // else
          //     toast.error("Error no se tiene parametrizado el tipo de desembolso, verifique.")
        }}
      >
        {({ values }) => (
          <Form>
            <div className="columns is-desktop is-tablet">
              <div className="column is-12-mobile is-12-tablet is-4-desktop">
                <ProdPresPer
                  oidc={props.oidc}
                  ui={props.ui}
                  name="ProductoID"
                  disabled
                  ProductoID={values.ProductoID}
                  valor={values.ProductoID}
                  isSingle
                />
              </div>
              <div className="column is-12-mobile is-12-tablet is-4-desktop">
                {
                  isMounted && (
                    <Sucursales
                      disabled={loading}
                      name={"SucursalId"}
                      valor={values.SucursalId}
                      ProductoID={props.ProductoID}
                      DistribuidorID={values.DistribuidorID}
                    />
                  )
                  // <ActionSelect
                  //     disabled={loading}
                  //     label="Sucursal"
                  //     name="SucursalId"
                  //     placeholder="Seleccione la sucursal"
                  //     options={props.optSucursales}
                  //     addDefault={false}
                  //     valor={values.SucursalId}
                  //     // accion={cbSucursal}
                  //     ref={refSucursal}
                  // />
                }
              </div>
              <div className="column is-12-mobile is-12-tablet is-4-desktop">
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
              <div className="column is-12-mobile is-12-tablet is-6-desktop">
                {isMounted && (
                  <Distribuidores
                    disabled
                    WithProducto
                    // SucursalID={isNaN(values.SucursalId) ? 0 : values.SucursalId}
                    // RequiereSuc
                    name={"DistribuidorID"}
                    label={DescripcionDistribuidor(1)}
                    cbAccion={cbDistribuidor}
                    valor={values.DistribuidorID}
                  />
                )}
              </div>
              <div className="column is-12-mobile is-12-tablet is-6-desktop">
                {isMounted && (
                  <ActionCreatableSelect
                    disabled={loading}
                    label="Capital"
                    name="Capital"
                    placeholder="Seleccione o ingrese el capital"
                    options={props.optCapital}
                    // addDefault={false}
                    accion={fnSetCapital}
                    value={values.Capital}
                    ref={refCapital}
                  />
                )}
              </div>
            </div>
            <div className="columns is-desktop is-tablet">
              <div className="column is-12-mobile is-12-tablet is-3-desktop">
                {isMounted && (
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
                )}
              </div>
              <div className="column is-12-mobile is-12-tablet is-4-desktop">
                {/* {isMounted &&  */}
                <ActionSelect
                  disabled={loading}
                  label="Tipo de Desembolso"
                  name="TipoDesembolsoID"
                  placeholder="Seleccione el tipo de desembolso"
                  options={formValues.optTiposDesembolso}
                  addDefault={false}
                  valor={formValues.TipoDesembolsoID}
                  ref={refTipoDesembolso}
                  accion={cbTipoDesembolso}
                />
                {/* } */}
              </div>

              <div className="column is-12-mobile is-12-tablet is-5-desktop">
                <br />
                {/* {props.DatosTipoDesembolso.RequiereDatosBancarios && */}
                <ControlDatosBancarios
                  name={`personasDatosBancariosID`}
                  RequiereDatosBancarios={
                    props.DatosTipoDesembolso.RequiereDatosBancarios ?? false
                  }
                  ClienteId={values.DistribuidorID}
                  valor={formValues.personasDatosBancariosID}
                  fnOpen={() => setShowDatosBancarios(true)}
                  label={"Cuenta"}
                />
                {/* } */}
              </div>
            </div>
            <div className="columns is-desktop is-tablet">
              <div className="column">
                <div className="box">
                  <div className="text-end">
                    <p className="title is-5">
                      Total:{" "}
                      {capital.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="box">
              <div className="columns is-desktop is-tablet">
                <div className="column">
                  {loading && <Spinner />}
                  {!loading && (
                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-danger waves-effect waves-light"
                        onClick={fnCancelar}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="ms-2 btn btn-success waves-effect waves-light"
                      >
                        Aceptar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      <ModalWin center open={ShowDatosBancarios} zIndex={10000}>
        <ModalWin.Header>
          <h5 className={MODAL_TITLE_CLASS}>{"Datos Bancarios"}</h5>
        </ModalWin.Header>
        <ModalWin.Body>
          {ShowDatosBancarios && (
            <BuscarDatosBancarios
              initialValues={{
                personaID: props.initialValues.DistribuidorID,
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
