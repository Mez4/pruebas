import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { type } from "os";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { CustomFieldText, Spinner } from "../../../../../global";
import { CustomFieldCheckbox } from "../../../../../global/CustomFieldCheckbox";
import { GiExplosionRays } from "react-icons/gi";
import * as Funciones from "./Funciones";
import { toast } from "react-toastify";
import yup from "../../../../../../global/yupLocale";
import { FaRegSurprise } from "react-icons/fa";

type CFormType = {
  oidc: IOidc;
  Id?: number;
  initialValues: {
    ProcesoId: number;
    Clave: string;
    Descripcion: string;
    Activo: boolean;
  };
  cbActualizar(item: any): any;
  cbGuardar(item: any): any;
  fnCancelar(): any;
};

export const CForm = (props: CFormType) => {
  const [loading, setLoading] = React.useState(false);

  return (
    <Formik
      initialValues={props.initialValues}
      enableReinitialize
      validationSchema={Yup.object().shape({
        Clave: Yup.string().required("Campo obligatorio"),
        Descripcion: Yup.string().required("Campo obligatorio"),
        Activo: Yup.string().required(),
      })}
      onSubmit={(values: any) => {
        setLoading(true);
        console.log(`Valores Add : `, values);

        if (props.Id === undefined)
          Funciones.FNAddProcesos(props.oidc, values)
            .then((respuesta: any) => {
              setLoading(false);
              props.cbGuardar(respuesta);
              toast.success("Agregado correctamente");
            })
            .catch((error: any) => {
              toast.error("Error al actualizar");
              setLoading(false);
            });
        else
          Funciones.FNUpdProcesos(props.oidc, {
            ...values,
            ProcesoId: props.Id,
          })
            .then((respuesta: any) => {
              setLoading(false);
              props.cbActualizar(respuesta);
              toast.success("Actualizado correctamente");
            })
            .catch((error: any) => {
              toast.error("Error al actualizar");
              setLoading(false);
            });
      }}
    >
      <Form>
        <CustomFieldText
          disabled={loading}
          label="Clave"
          name="Clave"
          placeholder="Clave : 00000"
        />
        <CustomFieldText
          disabled={loading}
          label="Descripcion"
          name="Descripcion"
          placeholder="Descripcion"
        />
        <CustomFieldCheckbox disabled={loading} label="Activo" name="Activo" />
        {loading && <Spinner />}
        {!loading && (
          <div className="text-end">
            <button
              type="button"
              className="btn btn-danger waves-effect waves-light"
              onClick={props.fnCancelar}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="ms-2 btn btn-success waves-effect waves-light"
              // onClick={props.cbGuardar}
            >
              Ok
            </button>
          </div>
        )}
      </Form>
    </Formik>
  );
};
