import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Spinner, ActionFieldText2 } from "../../../../../global";
import * as Funciones from "./Funciones";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { toast } from "react-toastify";
import { AgregarConPersonaCurp } from "../AgregarConPersonaCurp";

type CFormType = {
  oidc: IOidc;
  initialValues?: any;
  cbGuardar(item: any): any;
  fnCancelar(): any;
  SucursalID: number;
  ProductoID?: string;
};

export const CFormCurp = (props: CFormType) => {
  const [loading, setLoading] = useState(false);
  const [curp, setCurp] = useState(false);

  const [state, setState] = useState({
    DatosGenerales: undefined,
    Forma: false,
  });

  const fnCancelar = () => {
    setState((s) => ({ ...s, Forma: false }));
    props.fnCancelar();
  };

  const FNConsultarCURP_Habilitada = () => {
    Funciones.FNConsultarEstatusCURP(props.oidc)
      .then((res: any) => {
        let statusCurp = parseInt(res) === 1 ? true : false;
        setCurp(statusCurp);
      })
      .catch((error: any) => {
        if (!error.response.status) toast.error(`Error: ${error.response.msj}`);
        else if (error.request) toast.error(`Error 404`);
        else toast.error(`Error al consultar el estado de CURP`);
      });
  };

  useEffect(() => {
    FNConsultarCURP_Habilitada();
  }, []);

  return (
    <>
      <Formik
        initialValues={props.initialValues}
        enableReinitialize
        validationSchema={Yup.object().shape({
          Curp: Yup.string().required("Campo obligatorio").min(18).max(18),
        })}
        onReset={(values: any) => {
          // clearFormByLevel(0)
        }}
        onSubmit={(values: any) => {
          setLoading(true);
          var datos: any = {
            Curp: values.Curp,
            status: curp,
            ProductoID: props.ProductoID
          };
          values = datos;
          Funciones.FNBuscarCurp(props.oidc, values)
            .then((respuesta: any) => {
              setState((s) => ({
                ...s,
                DatosGenerales: respuesta.data,
                Forma: true,
              }));

              setLoading(false);
            })
            .catch((error: any) => {
              if (error.response) toast.error(`CURP INCORRECTA`);
              setState((s) => ({
                ...s,
                Forma: false,
              }));

              setLoading(false);
            });
        }}
      >
        {({ values }) => (
          <Form>
            <div className="row">
              <div className="col-12">
                <ActionFieldText2
                  disabled={false}
                  label={"CURP"}
                  name={"Curp"}
                  placeholder={"CURP"}
                />
              </div>
            </div>

            {loading && <Spinner />}
            {!loading && (
              <div>
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
                    Continuar
                  </button>
                </div>
              </div>
            )}
            {state.Forma == true && (
              <AgregarConPersonaCurp
                oidc={props.oidc}
                cbActualizar={() => { }}
                cbGuardar={props.cbGuardar}
                fnCancelar={fnCancelar}
                mostrar={state.Forma}
                Item={state.DatosGenerales}
                statusCurp={curp}
                SucursalID={props.SucursalID}
              />
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};
