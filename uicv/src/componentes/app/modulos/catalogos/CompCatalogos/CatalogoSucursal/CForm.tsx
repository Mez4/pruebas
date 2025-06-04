import React, { useRef, useState, useEffect } from "react";

import * as Yup from "yup";
import * as Funciones from "./Funciones";

import {
  CustomFieldText2,
  Spinner,
  ActionAsyncSelect,
  CustomActionSelect,
  CustomSelect,
  CustomSelect2,
} from "../../../../../global";
import { Formik, Form } from "formik";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { toast } from "react-toastify";
import {
  Zonas,
  Productos,
  SucursalesFisicas,
  TabuladoresTipos,
} from "../../../../../selectores";

import AsyncSelect from "react-select/async";
import { iUI } from "../../../../../../interfaces/ui/iUI";
import { CustomFieldCheckbox } from "../../../../../global/CustomFieldCheckbox";
import SucursalesOrigen from "../../../../../selectores/SucursalesOrigen";

type CFormType = {
  oidc: IOidc;
  ui: iUI;
  Id?: number;
  initialValues: {
    Nombre: string;
    distribuidorIdMin: number;
    distribuidorIdMax: number;
    importeLimiteCreditoDefault: number;
    tabuladorTipoID: number;
    empresaId: number;
    ZonaID: number;
    ProductoID: number;
    SucursalFisicaID: number;
    ProductosIds: any;
    NombreCompleto: string;
    PersonaResponsableId: number;
    SucursalOrigenID: number;
    //    PermisoRangoFecha:boolean;
  };
  cbActualizar(item: any): any;
  cbGuardar(item: any): any;
  fnCancelar(): any;
  optPersona: { value: number; label: string }[];
  //fnGetSucOrigen: (callback: any) : any;
  fnGetPersona(
    PersonaID: number,
    NombreCompleto: string,
    isSucursal: boolean,
    callback: any
  ): any;
  DatosPersona: any;
};

export const CForm = (props: CFormType) => {
  const [loading, setLoading] = React.useState(false);

  const loadOptionsPersonas = (inputText: string, callback: any) => {
    props.fnGetPersona(1, inputText, true, callback);
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
    console.log(props.initialValues.PersonaResponsableId);
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
        Nombre: Yup.string()
          .required("Campo obligatorio")
          .min(1, "Minimo 1 caracter")
          .max(35, "Maximo 35 caracteres"),
        // ProductoID: Yup.number().required().min(1),
        ProductosIds: Yup.array().min(1, "Seleccione al menos un Producto"),
        SucursalFisicaID: Yup.number()
          .required("Seleccione la Sucursal Fisica")
          .moreThan(0, "Seleccione la Sucursal Fisica"),
        ZonaID: Yup.number()
          .required("Seleccione la Zona")
          .moreThan(0, "Seleccione la Zona"),
        tabuladorTipoID: Yup.number()
          .required("Seleccione el Tipo de Tabulador")
          .moreThan(0, "Seleccione el Tipo de Tabulador"),
        PersonaResponsableId: Yup.number()
        .required(`Seleccione un Encargado`)
        .moreThan(0, `Seleccione un Encargado`),
      })}
      onSubmit={(values: any) => {
        // Set our form to a loading state
        setLoading(true);
        // Finish the callback
        if (props.Id === undefined)
          Funciones.FNAdd(props.oidc, values)
            .then((respuesta: any) => {
              setLoading(false);
              props.cbGuardar(respuesta);
              toast.success("Se guardó la sucursal");
            })
            .catch((error: any) => {
              console.log(JSON.stringify(error));
              setLoading(false);
              toast.error("Error al guardar la sucursal");
            });
        else
          Funciones.FNUpdate(props.oidc, {
            ...values,
            SucursalID: props.Id as number,
          })
            .then((respuesta: any) => {
              setLoading(false);
              props.cbActualizar(respuesta);
              toast.success("Se actualizó la sucursal");
            })
            .catch((error: any) => {
              console.log(JSON.stringify(error));
              setLoading(false);
              toast.error("Error al actualizar la sucursal");
            });
      }}
    >
      {({ values }) => (
        <Form>
          <CustomFieldText2
            disabled={loading}
            datoType='text'
            label="Nombre"
            name="Nombre"
            placeholder="Nombre Sucursal"
          />
          <SucursalesFisicas
            oidc={props.oidc}
            unaLinea
            disabled={loading}
            name={"SucursalFisicaID"}
          />
          <Zonas
            oidc={props.oidc}
            unaLinea={true}
            disabled={loading}
            cargar={true}
            name={"ZonaID"}
          />
          <SucursalesOrigen
            oidc={props.oidc}
            unaLinea={true}
            disabled={loading}
            name={"SucursalOrigenID"}
          />
          <hr />
          <CustomFieldText2
            disabled={loading}
            datoType='text'
            label="Numero Minimo de Socia"
            name="distribuidorIdMin"
            placeholder="Numero Minimo de Socia"
          />
          <CustomFieldText2
            disabled={loading}
            label="Numero Maximo de Socia"
            datoType='text'
            name="distribuidorIdMax"
            placeholder="Numero Maximo de Socia"
          />
          <CustomFieldText2
            disabled={loading}
            label="Limite de Credito"
            datoType='text'
            name="importeLimiteCreditoDefault"
            placeholder="Limite de Credito"
          />
          {/* <CustomFieldText2 disabled={loading} label="Tipo Tabulador" name="tabuladorTipoID" placeholder="Tipo Tabulador" /> */}
          <TabuladoresTipos
            oidc={props.oidc}
            unaLinea={true}
            disabled={loading}
            name={"tabuladorTipoID"}
          />
          {/* <CustomFieldText2 disabled={loading} label="Empresa" name="empresaId" placeholder="Empresa" /> */}

          <hr />
          <Productos
            oidc={props.oidc}
            ui={props.ui}
            ProductosIds={props.initialValues.ProductosIds}
            disabled={loading}
            name={"ProductosIds"}
            valor={values.ProductoID}


          />
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
            label="Permiso rango fecha"
            name="PermisoRangoFecha"
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
