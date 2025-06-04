import React, { useRef, useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  CustomFieldText,
  Spinner,
  ActionAsyncSelect,
  ActionSelect,
} from "../../../../../global";
import AsyncSelect from "react-select/async";
import { CustomFieldCheckbox } from "../../../../../global/CustomFieldCheckbox";
import * as Funciones from "./Funciones";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { toast } from "react-toastify";
import { number, string } from "yup/lib/locale";
import Select from "react-select";
import { MdPanoramaPhotosphere } from "react-icons/md";

type CFormType = {
  oidc: IOidc;
  Id?: number;
  initialValues: {
    zonaNombre: string;
    NombreCompleto: string;
    PersonaResponsableId: number;
    Activa: boolean;
  };
  cbActualizar(item: any): any;
  cbGuardar(item: any): any;
  fnCancelar(): any;
  optPersona: { value: number; label: string }[];
  fnGetPersona(PersonaID: number, NombreCompleto: string, callback: any): any;
  DatosPersona: any;
  FNGetLocal(): any;
};

export const CForm = (props: CFormType) => {
  const [loading, setLoading] = React.useState(false);

  const loadOptionsPersonas = (inputText: string, callback: any) => {
    props.fnGetPersona(1, inputText, callback);
  };

  const refPersona = useRef<AsyncSelect<[], false>>(null);
  const [formValues, setFormValues] = useState({
    optPersonas: [{ value: 0, label: "" }],
    PersonaResponsableId: props.initialValues.PersonaResponsableId,
  });

  const cbPersona = (value: any) => {
    props.initialValues.PersonaResponsableId = value;
    setFormValues((s) => ({
      ...s,
      PersonaResponsableId: value,
    }));
    console.log(props.initialValues.PersonaResponsableId)
  };

  const clearFormByLevel = (level: number) => {
    if (level === 0) {
      const person: any = refPersona.current?.select;
      person.select.setValue({ value: "0", label: "" }, "deselect-option");
      setFormValues((s) => ({
        ...s,
        optPersonas: [],
        PersonaResponsableId: 0,
      }));
    }
  };

  useEffect(() => {
    setFormValues((s) => ({ ...s, optPersonas: props.optPersona }));
  }, [props.optPersona]);

  return (
    <Formik
      initialValues={props.initialValues}
      enableReinitialize
      validationSchema={Yup.object().shape({
        zonaNombre: Yup.string()
          .required("Campo obligatorio")
          .min(1, "Minimo 1 caracter")
          .max(30, "Maximo 30 caracteres"),
        // PersonaResponsableId: Yup.number().required(),
        PersonaResponsableId: Yup.number()
          .required(`Seleccione un Encargado`)
          .moreThan(0, `Seleccione un Encargado`),
      })}
      onReset={(values: any) => {
        clearFormByLevel(0);
      }}
      onSubmit={(values: any) => {
        // Set our form to a loading state
        setLoading(true);

        // Finish the callback
        if (props.Id === undefined)
          Funciones.FNAdd(props.oidc, values)
            .then((respuesta: any) => {
              setLoading(false);
              console.log(values);
              props.cbGuardar(respuesta);
              props.FNGetLocal();
              toast.success("Se guardó la zona");
            })
            .catch((error: any) => {
              console.log(JSON.stringify(error));
              setLoading(false);
              toast.error("Error al guardar la zona");
            });
        else
          Funciones.FNUpdate(props.oidc, {
            ...values,
            ZonaID: props.Id as number,
          })
            .then((respuesta: any) => {
              setLoading(false);
              props.FNGetLocal();
              props.cbActualizar(respuesta);
              toast.success("Se actualizó la zona");
              // 
            })
            .catch((error: any) => {
              console.log(JSON.stringify(error));
              setLoading(false);
              toast.error("Error al actualizar la zona");
            });
      }}
    >
      {({ values }) => (
        <Form>
          <CustomFieldText
            disabled={loading}
            label="Nombre"
            name="zonaNombre"
            placeholder="Nombre Zona"
          />
          {/* <div style={{ fontWeight: 500 }}>Encargado</div> */}
          <ActionAsyncSelect
            loadOptions={loadOptionsPersonas}
            disabled={loading}
            label="Encargado"
            name="PersonaResponsableId"
            placeholder="Seleccione un Encargado"
            options={formValues.optPersonas}
            addDefault={true}
            valor={props.initialValues.PersonaResponsableId}
            accion={cbPersona}
            noOptionsMessage={"No encontrado"}
            //  blur={fnGetCondicionesDetalleByDistribuidor}
            ref={refPersona}
          />
          <CustomFieldCheckbox
            disabled={loading}
            label="Activa"
            name="Activa"
          />
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
              >
                Ok
              </button>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};
