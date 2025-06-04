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
import { FaPrint, FaEnvelope, FaCalculator } from "react-icons/fa";
import { Distribuidores } from "../../../../../selectores";

type CFormType = {
  oidc: IOidc;
  initialValues: {
    fechaCorte: string;
    SucursalID: number;
    DistribuidorID: number;
    swForzar: boolean;
  };
  fnGetFechaCortes(SucursalID: number): any;
  fnPrinting(loading: boolean): any;
  optSucursales: { value: number; label: string }[];
  optFechasCortes: { value: number; label: string }[];
  fecha: string;
};

export const CForm = (props: CFormType) => {
  const [loading, setLoading] = useState(false);

  const refSucursal = useRef<Select>(null);
  const refFechaCorte = useRef<Select>(null);

  const sumbit = useRef<HTMLButtonElement>(null);

  const cbSucursal = (value: any) => {
    props.fnGetFechaCortes(value);
  };

  // const [completed, setCompleted] = useState(0);

  // const move = () => {
  //     var i = 0;
  //     var timer = setInterval(frame, 100);
  //     function frame() {
  //         if (i == 99 || !loading) {
  //             if (!loading) {
  //                 setCompleted(0)
  //             }
  //             clearInterval(timer);
  //         } else {
  //             //   console.log('Entra: ', completed)
  //             i++;
  //             setCompleted(i)
  //         }
  //     }
  // }

  useEffect(() => {
    refFechaCorte.current?.select.setValue(
      { value: props.fecha, label: props.fecha },
      "select-option"
    );
  }, [props.fecha]);

  // useEffect(() => {

  //     if (loading) {
  //         move()
  //     }

  // }, [loading])

  const containerStyles = {
    width: "100%",
  };

  return (
    <Formik
      initialValues={props.initialValues}
      enableReinitialize
      validationSchema={Yup.object().shape({
        // SucursalID: Yup.number().required("Seleccione la sucursal").moreThan(0, 'Seleccione la sucursal'),
        DistribuidorID: Yup.number()
          .required("Seleccione la socia")
          .moreThan(0, "Seleccione la socia"),
        fechaCorte: Yup.string().required("Seleccione la fecha de corte"),
      })}
      onSubmit={(values: any) => {
        setLoading(true);
        props.fnPrinting(true);

        // var parts = values.FechaCorte.split('/')
        // var date = new Date(parts[2], parts[1] - 1, parts[0], 0, 0, 0)
        // console.log(date);

        Funciones.FNRecalcular(props.oidc, {
          ...values,
        })
          .then((res: any) => {
            // props.cbActualizar(respuesta)
            console.log(res);
            setLoading(false);
            props.fnPrinting(false);
            toast.success("Relación corte recalculada con éxito.");
          })
          .catch((error: any) => {
            console.log(error);
            setLoading(false);
            props.fnPrinting(false);
            toast.error("Ocurrió un error al imprimir la relación");
          });
        // }
        // else
        //     toast.error(`No ha seleccionado ninguna ${DescripcionDistribuidor(1)}`)
      }}
    >
      {({ values }) => (
        <Form>
          <div className="columns is-desktop is-tablet">
            <div className="column is-12-mobile is-12-tablet is-3-desktop">
              <ActionSelect
                disabled={loading}
                label="Fecha de Corte"
                name="fechaCorte"
                placeholder="Seleccione la Fecha de Corte"
                options={props.optFechasCortes}
                addDefault={false}
                valor={values.fechaCorte}
                // accion={cbFecha}
                ref={refFechaCorte}
              />
            </div>
            <div className="column is-12-mobile is-12-tablet is-3-desktop">
              <ActionSelect
                disabled={loading}
                label="Sucursal"
                name="SucursalID"
                placeholder="TODAS"
                options={props.optSucursales}
                addDefault={false}
                valor={values.SucursalID}
                // accion={cbSucursal}
                ref={refSucursal}
              />
            </div>
            <div className="column is-12-mobile is-12-tablet is-3-desktop">
              <Distribuidores
                disabled={loading}
                SucursalID={values.SucursalID}
                name={"DistribuidorID"}
                WithProducto
                RequiereSuc
                cbAccion={(val) => {
                  //   ActualizaSaldos({
                  //     ...values,
                  //     DistribuidorId: val,
                  //     Importe: 0,
                  //   });
                }}
              />
            </div>
          </div>
          <div className="columns is-desktop is-tablet">
            <div className="column is-12 text-end">
              {loading && <Spinner />}
              {!loading && (
                <div className="control">
                  {/* <button type="submit" hidden ref={sumbit} /> */}
                  <br />
                  <button
                    type="submit"
                    className="ms-2 btn btn-primary waves-effect waves-light"
                  >
                    <span className="is-hidden-touch">Recalcular</span>&nbsp;
                    <FaCalculator />
                  </button>
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
            </div>
            <div className="column"></div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
