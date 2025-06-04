import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CustomFieldText, Spinner, CustomSelect } from "../../../../../global";
import { CustomFieldCheckbox } from "../../../../../global/CustomFieldCheckbox";
import * as Funciones from "../Balances/Funciones";
import { valueContainerCSS } from "react-select/src/components/containers";
import { MODAL_TITLE_CLASS } from "../../../../../global/ModalWin";
import { valueEventAriaMessage } from "react-select/src/accessibility";
import { toast } from "react-toastify";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import DataTable from "react-data-table-component";
import { FaCheckSquare, FaRegSquare, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import Swal2 from "sweetalert2";
import withReactContent2 from "sweetalert2-react-content";
type CFormType = {
  Seguridad: IOidc;
  Id?: number;
  periodoId?: number;
  nombreBalance?: string;
  esReporteCuenta: number;

  initialValues: {
    incMovs: number;
    incDetalle: number;
  };
  DatosSeleccionados: { value: number; producto: string }[];
  CuentasSeleccionadas: {}[];
  isMounted: boolean;
  cerrarSwal(): any;
};

export const CForm = (props: CFormType) => {
  const incluirDetalle = [
    { value: 1, label: "Si" },
    { value: 2, label: "No" },
  ];
  const incluirMovimientos = [
    { value: 1, label: "Si" },
    { value: 2, label: "No" },
  ];
  const MySwal2 = withReactContent2(Swal2);

  const [loading, setLoading] = React.useState(false);

  console.log("DATOS RECIBIDOS FORM");
  console.log(props.DatosSeleccionados);
  return (
    <Formik
      enableReinitialize
      initialValues={props.initialValues}
      validationSchema={Yup.object().shape({
        incMovs: Yup.number()
          .required("Seleccione el banco")
          .moreThan(0, "Seleccione el banco"),
        incDetalle: Yup.number()
          .required("Campo obligatorio")
          .moreThan(0, "Campo obligatorio"),
      })}
      onSubmit={(values: any, { resetForm }) => {
        if (props.isMounted == true) {
          setLoading(true);
          let timerInterval;

          MySwal2.fire({
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
              MySwal2.showLoading();
            },
            willClose: () => {
              clearInterval(timerInterval);
            },
          });

          console.log(props.DatosSeleccionados);

          let datos: any = {
            periodoId: props.periodoId,
            productos_seleccionados: props.DatosSeleccionados,
            incMovs: values.incMovs,
            incDetalle: values.incDetalle,
            nombreBalance: props.nombreBalance,
            esReporteCuenta: props.esReporteCuenta,
            cuentas_seleccionadas: props.CuentasSeleccionadas,
          };
          values = datos;

          console.log("VALORES A ENVIAR", values);

          Funciones.FNImprimir(props.Seguridad, values)
            .then((respuesta: any) => {
              if (props.isMounted == true) {
                //setLoading(false)
                const file = new Blob([respuesta], { type: "application/pdf" });

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

                props.cerrarSwal();
              }

              //sprops.cbGuardar(respuesta)
            })
            .catch((error: any) => {
              if (props.isMounted == true) {
                toast.error("Error al generar el PDF");
                // alert("Error al guardar los parametros" + JSON.stringify(error))
                setLoading(false);
              }
            });
        }
      }}
    >
      <Form>
        <div>
          <div></div>
          <div className="columns is-centered is-mobile is-multiline">
            <div className="column is-align-items-center is-half-desktop is-full-tablet is-full-mobile">
              <div className="mb-3">
                <label className="form-label mb-0" htmlFor={"incMovs"}>
                  ¿Incluir movimientos?
                </label>
                <Field name={"incMovs"} className="form-select">
                  {(control: any) => (
                    <select
                      className="form-select"
                      //options={state.optCuentas}
                      value={control.field.value}
                      onChange={(value: any) => {
                        control.form.setFieldValue(
                          "incMovs",
                          parseInt(value.target.value)
                        );
                        if (parseInt(value.target.value) == 2) {
                          control.form.setFieldValue("incDetalle", 2);
                        }
                      }}
                      disabled={false}
                      id={"incMovs"}
                      name={"incMovs"}
                    >
                      <option value="0">{"Selecciona un producto"}</option>
                      {incluirMovimientos.map((optn, index) => (
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
                  name={"incMovs"}
                  className="text-danger"
                />
              </div>
            </div>
            <div className="column is-align-items-center is-half-desktop is-full-tablet is-full-mobile">
              <label className="form-label mb-0" htmlFor={"incDetalle"}>
                ¿Incluir detalle?
              </label>
              <Field name={"incDetalle"} className="form-select">
                {(control: any) => (
                  <select
                    className="form-select"
                    //options={state.optCuentas}
                    value={control.field.value}
                    onChange={(value: any) => {
                      control.form.setFieldValue(
                        "incDetalle",
                        parseInt(value.target.value)
                      );
                    }}
                    disabled={false}
                    id={"incDetalle"}
                    name={"incDetalle"}
                  >
                    <option value="0">{"Selecciona un producto"}</option>
                    {incluirDetalle.map((optn, index) => (
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
                name={"incDetalle"}
                className="text-danger"
              />
            </div>
          </div>
          {loading && <Spinner />}
          {!loading && (
            <div className="text-end">
              <button
                type="submit"
                className="ms-2 btn btn-success waves-effect waves-light"
              >
                Ok
              </button>
            </div>
          )}
        </div>
      </Form>
    </Formik>
  );
};
