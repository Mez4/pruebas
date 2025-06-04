import React, { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Spinner, CustomSelect, ActionSelect } from "../../../../../global";
import * as Funciones from "./Funciones";
import Select from "react-select";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { toast } from "react-toastify";
import ProgressBar from "../../../../../global/progress-bar.component";
import { DescripcionDistribuidor } from "../../../../../../global/variables";
// Icons
import { FaPrint, FaEnvelope } from "react-icons/fa";

type CFormType = {
  oidc: IOidc;
  ProductoID: number;
  // SucursalId?: number,
  initialValues: {
    SucursalID: number;
    CoordinadorID: number;
    tipo: string;
    formato: string;
    fecha: string;
    // Distribuidores: number[]
  };
  Distribuidores: number[];
  // cbActualizar(item: any): any,
  // cbGuardar(item: any): any,
  // fnCancelar(): any,
  fnGetFechaCortes(SucursalID: number): any;
  fnGetCoordinador(SucursalID: number): any;
  fnGetDistribuidores(
    SucursalID: number,
    CoordinadorID: number,
    fechaCorte: string
  ): any;
  fnPrinting(loading: boolean): any;
  optSucursales: { value: number; label: string }[];
  optCoordinador: { value: number; label: string }[];
  optFechasCortes: { value: number; label: string }[];
  fecha: string;
  // isUpdate: boolean
};

export const CForm = (props: CFormType) => {
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("");

  const refSucursal = useRef<Select>(null);
  const refCoordinador = useRef<Select>(null);
  const refFechaCorte = useRef<Select>(null);

  // const [formValues, setFormValues] = useState({
  //     Distribuidores: [] as number[]
  // })

  const [Distribuidores, setDistribuidores] = useState([] as number[]);

  const sumbit = useRef<HTMLButtonElement>(null);

  const clearFormByLevel = (level: number) => {
    // if(level === 0){
    //     setArticles([])
    //     setArticulosIds([])
    //     setShopInfo({
    //         totalItems: 0,
    //         totalPrice: 0,
    //         totalQty: 0
    //     })
    //    refSucursal.current?.select.setValue( { value: '0', label: '' }, "deselect-option")
    // }
    if (level === 0 || level === 1) {
      refCoordinador.current?.select.setValue(
        { value: "0", label: "" },
        "deselect-option"
      );
    }
    if (level === 0 || level === 1 || level === 2) {
      setDistribuidores([]);
      //     const cliente: any = refCliente.current?.select
      //     cliente.select.setValue({ value: '0', label: '' }, "deselect-option")
      //     refCapital.current?.select.setValue({ value: '0', label: '' }, "deselect-option")
      //     refFolio.current?.select.setValue({ value: '0', label: '' }, "deselect-option")
      //     refPlazos.current?.select.setValue({ value: '0', label: '' }, "deselect-option")
    }
  };

  const cbSucursal = (value: any) => {
    clearFormByLevel(1);
    props.fnGetFechaCortes(value);
    props.fnGetCoordinador(value);
  };

  const cbCoordinador = (value: any) => {
    clearFormByLevel(2);
    const sucursal: any = refSucursal;
    const SucursalId = sucursal.current.props.value.value as number;

    const fechaCorte: any = refFechaCorte;
    const fecha =
      (fechaCorte.current.props.value.value as string) == "0"
        ? Date.now().toString()
        : (fechaCorte.current.props.value.value as string);
    props.fnGetDistribuidores(SucursalId, value, fecha);
  };

  useEffect(() => {
    setDistribuidores(props.Distribuidores);
  }, [props.Distribuidores]);

  const [completed, setCompleted] = useState(0);

  const move = () => {
    var i = 0;
    var timer = setInterval(frame, 100);
    function frame() {
      if (i == 99 || !loading) {
        if (!loading) {
          setCompleted(0);
        }
        clearInterval(timer);
      } else {
        //   console.log('Entra: ', completed)
        i++;
        setCompleted(i);
      }
    }
  };

  useEffect(() => {
    refFechaCorte.current?.select.setValue(
      { value: props.fecha, label: props.fecha },
      "select-option"
    );
  }, [props.fecha]);

  useEffect(() => {
    if (loading) {
      move();
    }
  }, [loading]);

  useEffect(() => {
    if (action !== "") {
      const btn: any = sumbit;
      btn.current.click();
    }
  }, [action]);

  const containerStyles = {
    width: "100%",
  };

  return (
    <Formik
      initialValues={props.initialValues}
      enableReinitialize
      validationSchema={Yup.object().shape({
        SucursalID: Yup.number()
          .required("Seleccione la sucursal")
          .moreThan(0, "Seleccione la sucursal"),
        CoordinadorID: Yup.number()
          .required("Seleccione el coordinador")
          .moreThan(0, "Seleccione el coordinador"),
        tipo: Yup.number()
          .required("Seleccione una opción")
          .moreThan(0, "Seleccione una opción"),
        formato: Yup.number()
          .required("Seleccione un formato")
          .moreThan(0, "Seleccione un formato"),
        fecha: Yup.string().required("Seleccione la fecha de corte"),
        // Distribuidores: Yup.array()
        //         .min(1, 'Seleccione al menos una socia')
      })}
      onSubmit={(values: any) => {
        if (Distribuidores.length > 0) {
          setLoading(true);
          props.fnPrinting(true);
          // move()

          // var parts = values.FechaCorte.split('/')
          // var date = new Date(parts[2], parts[1] - 1, parts[0], 0, 0, 0)
          // console.log(date);

          switch (action) {
            case "print": {
              Funciones.FNPrint(
                props.oidc,
                {
                  ...values,
                  ProductoID: props.ProductoID,
                  Distribuidores,
                }
                // function(percent: any) {
                //     setCompleted(percent)
                // }
              )
                .then((pdf: any) => {
                  // props.cbActualizar(respuesta)
                  console.log(pdf);

                  const file = new Blob([pdf], { type: "application/pdf" });

                  // const fileURL = URL.createObjectURL(file);

                  // window.open(fileURL);

                  // var url = window.URL.createObjectURL(file);
                  // var anchor = document.createElement("a");
                  // anchor.download = "myfile.pdf";
                  // anchor.href = url;
                  // anchor.click();
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
                  setLoading(false);
                  props.fnPrinting(false);
                  // setCompleted(0)
                })
                .catch((error: any) => {
                  console.log(error);
                  setLoading(false);
                  props.fnPrinting(false);
                  toast.error("Ocurrió un error al imprimir la relación");
                });
              break;
            }
            case "send": {
              Funciones.FNSend(
                props.oidc,
                {
                  ...values,
                  ProductoID: props.ProductoID,
                  Distribuidores,
                }
                // function(percent: any) {
                //     setCompleted(percent)
                // }
              )
                .then((res: any) => {
                  // console.log('res: ', res)

                  if (res === 1) {
                    toast.success(
                      "Se han mandado las relaciones por correo electronico"
                    );
                  } else {
                    toast.warning("No hay información la cual procesar");
                  }
                  setLoading(false);
                  props.fnPrinting(false);
                })
                .catch((error: any) => {
                  console.log(error);
                  setLoading(false);
                  props.fnPrinting(false);
                  toast.error("Ocurrió un error al imprimir la relación");
                });
              break;
            }
            default: {
              break;
            }
          }
          setAction("");
        } else
          toast.error(
            `No ha seleccionado ninguna ${DescripcionDistribuidor(1)}`
          );
      }}
    >
      {({ values }) => (
        <Form>
          <div className="columns is-desktop is-tablet">
            <div className="column is-12-mobile is-12-tablet is-4-desktop">
              <ActionSelect
                disabled={loading}
                label="Sucursal"
                name="SucursalID"
                placeholder="Seleccione la sucursal"
                options={props.optSucursales}
                addDefault={false}
                valor={values.SucursalID}
                accion={cbSucursal}
                ref={refSucursal}
              />
            </div>
            <div className="column is-12-mobile is-12-tablet is-3-desktop">
              <div id="opciones">Opciones</div>
              <div role="group" aria-labelledby="opciones">
                <label className="radio">
                  <Field type="radio" name="tipo" value="1" />
                  {" Imprimir solo relación"}
                </label>
                <br />
                <label className="radio">
                  <Field type="radio" name="tipo" value="2" />
                  {" Imprimir solo recibos"}
                </label>
              </div>
              <ErrorMessage
                component="div"
                name="tipo"
                className="text-danger"
              />
            </div>
            <div className="column is-12-mobile is-12-tablet is-3-desktop">
              <div id="opciones">Formato</div>
              <div role="group" aria-labelledby="opciones">
                <label className="radio">
                  <Field type="radio" name="formato" value="1" />
                  {values.tipo == "1" &&
                    " Imprimir con tabla bonificación de 9 días"}
                  {values.tipo == "2" && " Imprimir recibo con hoja de 6"}
                </label>
                <br />
                <label className="radio">
                  <Field type="radio" name="formato" value="2" />
                  {values.tipo == "1" &&
                    " Imprimir con tabla bonificación de 6 días"}
                  {values.tipo == "2" && " Imprimir recibo con hoja de 10"}
                </label>
              </div>
              <ErrorMessage
                component="div"
                name="formato"
                className="text-danger"
              />
            </div>
          </div>
          <div className="columns is-desktop is-tablet">
            <div className="column is-12-mobile is-12-tablet is-4-desktop">
              <ActionSelect
                disabled={loading}
                label="Coordinador"
                name="CoordinadorID"
                placeholder="Seleccione el Coordinador"
                options={props.optCoordinador}
                addDefault={false}
                valor={values.CoordinadorID}
                accion={cbCoordinador}
              />
            </div>
            <div className="column is-12-mobile is-12-tablet is-3-desktop">
              <ActionSelect
                disabled={loading}
                label="Fecha de Corte"
                name="fecha"
                placeholder="Seleccione la Fecha de Corte"
                options={props.optFechasCortes}
                addDefault={false}
                valor={props.initialValues.fecha}
                // accion={cbFecha}
                ref={refFechaCorte}
              />
              {/* <CustomSelect+
                                disabled={true}
                                label="Fecha de Corte"
                                name="fecha"
                                placeholder="Seleccione la Fecha de Corte"
                                options={props.optFechasCortes}
                                addDefault={false}
                                isMulti={false}
                            /> */}
            </div>
            <div className="column is-1"></div>
            <div className="column is-4">
              {loading && <Spinner />}
              {!loading && (
                <div className="control">
                  <button type="submit" hidden ref={sumbit} />
                  <br />
                  <button
                    className="ms-2 btn btn-success waves-effect waves-light"
                    onClick={() => {
                      setAction("print");
                    }}
                  >
                    <span className="is-hidden-touch">Imprimir</span>&nbsp;
                    <FaPrint />
                  </button>
                  {/* <button className="ms-2 btn btn-primary waves-effect waves-light" onClick={() => {
                                        setAction('send')
                                    }}>
                                        <span className="is-hidden-touch">Enviar Correo</span>&nbsp;<FaEnvelope />
                                    </button> */}
                </div>
              )}
            </div>
          </div>
          <div className="columns is-desktop is-tablet">
            <div className="column"></div>
            <div className="column is-three-quarters">
              {loading && (
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    aria-valuenow={75}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    style={containerStyles}
                  ></div>
                </div>
              )}
              <br />
              {/* {loading &&
                        <ProgressBar bgcolor={"#3CEB68"} completed={completed} />
                    } */}
            </div>
            <div className="column"></div>
          </div>
          {Distribuidores.length === 0 && values.CoordinadorID > 0 && (
            <div className="text-danger">
              Seleccione al menos una {`${DescripcionDistribuidor(1)}`}
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};
