import React, { useEffect, useState, useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  CustomFieldText,
  Spinner,
  CustomSelect,
  CustomFieldImgUpload,
  CustomFieldDatePicker,
  ActionAsyncSelect,
} from "../../../../../global";
import { CustomFieldCheckbox } from "../../../../../global/CustomFieldCheckbox";
import * as Funciones from "./Funciones";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { toast } from "react-toastify";
import { DescripcionDistribuidor } from "../../../../../../global/variables";
import AsyncSelect from "react-select/async";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

type CFormType = {
  oidc: IOidc;
  Id?: number;
  initialValues: {
    EmpresaId: number;
    Producto: string;
    Activo: boolean;
    EsOperativo: boolean;
    TasaTipoId: string;
    TipoProductoID: number;
    DiasPago: string;
    DiaParaCorte: number;
    PrioridadCobranza: number;
    RequiereDistribuidor: boolean;
    RequiereGrupo: boolean;
    ValidaDisponible: boolean;
    Restructura: boolean;
    GeneraDesembolso: boolean;
    SeguroFinanciado: boolean;
    Canje: boolean;
    DesglosarIVA: boolean;
    EdadMinima: number;
    EdadMaxima: number;
    CapitalAlFinal: boolean;
    CargoFinanciado: boolean;
    CargoAlInicio: boolean;
    ActivaCredito: boolean;
    CreditosLiquidadosReq: boolean;
    PermisoEspecial: boolean;
    ValidarCondiciones: boolean;
    AplicaIVAInteres: boolean;
    AplicaIVASeguro: boolean;
    AplicaIVAManejoCuenta: boolean;
    AdicProductoId: number | string;
    CuentaMaestraId: number;
    CtaCapitalId: number | string;
    CtaInteresNormalId: number | string;
    CtaInteresMoraId: number | string;
    CtaIvaId: number | string;
    CtaInteresNormDeudorId: number | string;
    CtaInteresNormAcreedorId: number | string;
    CtaInteresMoraDeudorId: number | string;
    CtaInteresMoraAcreedorId: number | string;
    Logo: string;
    file: null;
    PersonaResponsableId: number;
    NombreCompleto: string;
    AplicaComision: boolean;
  };
  cbActualizar(item: any): any;
  cbGuardar(item: any): any;
  fnCancelar(): any;
  optEmpresas: { value: number; label: string }[];
  optTiposTasas: { value: number; label: string }[];
  optTiposProductos: { value: number; label: string }[];
  optProductos: { value: number; label: string }[];
  optAgrupaciones: { value: number; label: string }[];
  optCuentasContables: { value: number; label: string }[];
  optPersona: { value: number; label: string }[];
  fnGetPersona(PersonaID: number, NombreCompleto: string, callback: any): any;
  DatosPersona: any;
};

export const CForm = (props: CFormType) => {
  const [loading, setLoading] = React.useState(false);
  const MySwal = withReactContent(Swal)

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
        EmpresaId: Yup.number()
          .required("Seleccione la Empresa")
          .moreThan(0, "Seleccione la Empresa"),
        Producto: Yup.string()
          .required("Campo obligatorio")
          .min(1, "Minimo 1 caracter")
          .max(50, "Maximo 50 caracteres"),
          TasaTipoId: Yup.string().required("Seleccione el tipo de tasa"),
          TipoProductoID: Yup.number()
          .required(`Seleccione el tipo de producto`)
          .moreThan(0, "Seleccione el tipo de producto"),
        DiasPago: Yup.string()
          .required("Campo obligatorio")
          .min(1, "Minimo 1 caracter")
          .max(50, "Maximo 20 caracteres"),
        EdadMinima: Yup.number()
          .required("Campo obligatorio")
          .max(255, "No debe ser mayor a 255"),
        DiaParaCorte: Yup.number()
          .required("Campo obligatorio")
          .moreThan(0, "Campo obligatorio"),
        PrioridadCobranza: Yup.number().required("Campo obligatorio"),
        EdadMaxima: Yup.number()
          .required("Campo obligatorio")
          .max(255, "No debe ser mayor a 255"),
        /*     CuentaMaestraId: Yup.number()
              .required("Seleccione la Cuenta Maestra")
              .moreThan(0, "Seleccione la Cuenta Maestra"), */
        PersonaResponsableId: Yup.number()
         .required(`Seleccione un Encargado`)
         .moreThan(0, `Seleccione un Encargado`),
      })}
      onSubmit={(values: any) => {
        // Set our form to a loading state
        setLoading(true);

        const formData = new FormData();
        formData.append("EmpresaId", values.EmpresaId);
        formData.append("Producto", values.Producto);
        formData.append("Activo", values.Activo);
        formData.append("EsOperativo", values.EsOperativo);
        formData.append("TasaTipoId", values.TasaTipoId);
        formData.append("TipoProductoID", values.TipoProductoID);
        formData.append("DiasPago", values.DiasPago);
        formData.append("DiaParaCorte", values.DiaParaCorte);
        formData.append("PrioridadCobranza", values.PrioridadCobranza);
        formData.append("RequiereDistribuidor", values.RequiereDistribuidor);
        formData.append("RequiereGrupo", values.RequiereGrupo);
        formData.append("ValidaDisponible", values.ValidaDisponible);
        formData.append("Restructura", values.Restructura);
        formData.append("GeneraDesembolso", values.GeneraDesembolso);
        formData.append("SeguroFinanciado", values.SeguroFinanciado);
        formData.append("Canje", values.Canje);
        formData.append("DesglosarIVA", values.DesglosarIVA);
        formData.append("EdadMinima", values.EdadMinima);
        formData.append("EdadMaxima", values.EdadMaxima);
        formData.append("CapitalAlFinal", values.CapitalAlFinal);
        formData.append("CargoFinanciado", values.CargoFinanciado);
        formData.append("CargoAlInicio", values.CargoAlInicio);
        formData.append("ActivaCredito", values.ActivaCredito);
        formData.append("CreditosLiquidadosReq", values.CreditosLiquidadosReq);
        formData.append("PermisoEspecial", values.PermisoEspecial);
        formData.append("ValidarCondiciones", values.ValidarCondiciones);
        formData.append("AplicaIVAInteres", values.AplicaIVAInteres);
        formData.append("AplicaIVASeguro", values.AplicaIVASeguro);
        formData.append("AplicaIVAManejoCuenta", values.AplicaIVAManejoCuenta);
        formData.append("AdicProductoId", values.AdicProductoId);
        formData.append("CuentaMaestraId", values.CuentaMaestraId);
        formData.append("CtaCapitalId", values.CtaCapitalId);
        formData.append("CtaInteresNormalId", values.CtaInteresNormalId);
        formData.append("CtaInteresMoraId", values.CtaInteresMoraId);
        formData.append("CtaIvaId", values.CtaIvaId);
        formData.append("AplicaComision", values.AplicaComision);
        formData.append(
          "CtaInteresNormDeudorId",
          values.CtaInteresNormDeudorId
        );
        formData.append(
          "CtaInteresNormAcreedorId",
          values.CtaInteresNormAcreedorId
        );
        formData.append(
          "CtaInteresMoraDeudorId",
          values.CtaInteresMoraDeudorId
        );
        formData.append(
          "CtaInteresMoraAcreedorId",
          values.CtaInteresMoraAcreedorId
        );
        formData.append("DiasCaducidadFolio", values.DiasCaducidadFolio);
        formData.append("DiasCaducidadVale", values.DiasCaducidadVale);
        formData.append("Logo", values.file);
        formData.append("PersonaResponsableId", values.PersonaResponsableId);

        console.log(values);

        // Finish the callback
        if (props.Id === undefined)
          if(values.AplicaComision == true && values.TipoProductoID > 1)
          {
              MySwal.fire({
                title: 'Aplica Comisión',
                icon: 'question',
                html:
                    <div className="text-center">
                        El tipo de producto seleccionado no es Principal, ¿Esta seguro de agregar la aplicación de comisión?
                    </div>,
                showCloseButton: false,
                showCancelButton: true,
                showConfirmButton: true,
                focusConfirm: false,
                focusCancel: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonAriaLabel: 'Aceptar',
                cancelButtonAriaLabel: ''
            }).then((result) => {
              if (result.isConfirmed) {
              Funciones.FNAdd(props.oidc, formData)
              .then((respuesta: any) => {
                setLoading(false);
                props.cbGuardar(respuesta);
                toast.success("Se guardó el producto");
              })
              .catch((error: any) => {
                if (error.response) toast.error(`Response : ${error.response.data}`);
              else if (error.request) toast.error(`Request ${error}`);
              else toast.error(`${error}`);
              setLoading(false);
            });
            }
          else {
            MySwal.fire(
                {
                    icon: 'info',
                    html: <div><br />
                        <h3 className="text-center">Aviso</h3>
                        <div className={`modal-body`}>
                            <h5 className="text-center">Operación cancelada por el usuario.</h5>
                        </div>
                    </div>,
                    confirmButtonText: `Continuar`,
                    confirmButtonColor: '#3085d6',
                }
            );
            setLoading(false);
        }
            })
          }
          else
          {
          Funciones.FNAdd(props.oidc, formData)
            .then((respuesta: any) => {
              setLoading(false);
              props.cbGuardar(respuesta);
              toast.success("Se guardó el producto");
            })
            .catch((error: any) => {
              if (error.response) toast.error(`Response : ${error.response.data}`);
            else if (error.request) toast.error(`Request ${error}`);
            else toast.error(`${error}`);
            setLoading(false);
            });
          }
        else {
          formData.append("ProductoID", props.Id as any);
          if(values.AplicaComision == true && values.TipoProductoID > 1)
          {
            MySwal.fire({
              title: 'Aplica Comisión',
              icon: 'question',
              html:
                  <div className="text-center">
                      El tipo de producto seleccionado no es Principal, ¿Esta seguro de agregar la aplicación de comisión?
                  </div>,
              showCloseButton: false,
              showCancelButton: true,
              showConfirmButton: true,
              focusConfirm: false,
              focusCancel: true,
              cancelButtonText: 'Cancelar',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonAriaLabel: 'Aceptar',
              cancelButtonAriaLabel: ''
          }).then((result) => {
              if (result.isConfirmed) {
                Funciones.FNUpdate(props.oidc, formData)
              .then((respuesta: any) => {
                setLoading(false);
                props.cbActualizar(respuesta);
                toast.success("Se actualizó el producto");
              })
              .catch((error: any) => {
                console.log(JSON.stringify(error));
                setLoading(false);
                toast.error("Error al actualizar el producto");
              });
            }
            else
            {
              MySwal.fire(
                {
                    icon: 'info',
                    html: <div><br />
                        <h3 className="text-center">Aviso</h3>
                        <div className={`modal-body`}>
                            <h5 className="text-center">Operación cancelada por el usuario.</h5>
                        </div>
                    </div>,
                    confirmButtonText: `Continuar`,
                    confirmButtonColor: '#3085d6',
                }
            );
            setLoading(false);
            }
          })
          }
          else
          {
          Funciones.FNUpdate(props.oidc, formData)
            .then((respuesta: any) => {
              setLoading(false);
              props.cbActualizar(respuesta);
              toast.success("Se actualizó el producto");
            })
            .catch((error: any) => {
              console.log(JSON.stringify(error));
              setLoading(false);
              toast.error("Error al actualizar el producto");
            });
          }
        }
      }}
    >
      <Form>
        <div className="container">
          <div className="columns is-desktop is-tablet">
          <div className="column is-one-third">
              <CustomSelect
                disabled={loading}
                label="Empresa"
                name="EmpresaId"
                placeholder="Seleccione la Empresa"
                options={props.optEmpresas}
                addDefault={false}
                isMulti={false}
              />
            </div>
            <div className="column is-one-third">
              <CustomFieldText
                disabled={loading}
                label="Producto"
                name="Producto"
                placeholder="Descripción del producto"
              />
            </div>
            <div className="column is-2">
              <br />
              <CustomFieldCheckbox
                disabled={loading}
                label="Activo"
                name="Activo"
              />
            </div>
            <div className="column is-2">
              <br />
              <CustomFieldCheckbox
                disabled={loading}
                label="Es Operativo"
                name="EsOperativo"
              />
            </div>
          </div>
          <div className="columns is-desktop is-tablet">
            <div className="column is-one-third">
              <CustomSelect
                disabled={loading}
                label="Tipo de Tasa"
                name="TasaTipoId"
                placeholder="Seleccione el tipo de tasa"
                options={props.optTiposTasas}
                addDefault={false}
                isMulti={false}
              />
            </div>
            <div className="column is-one-third">
              <CustomSelect
                disabled={loading || props.Id != undefined}
                label="Tipo de Producto"
                name="TipoProductoID"
                placeholder="Seleccione el tipo de producto"
                options={props.optTiposProductos}
                addDefault={false}
                isMulti={false}
              />
            </div>
            <div className="column is-2">
              <CustomFieldText
                disabled={loading}
                label="Edad Mínima"
                name="EdadMinima"
                placeholder="Edad Mínima"
              />
            </div>
            <div className="column is-2">
              <CustomFieldText
                disabled={loading}
                label="Edad Máxima"
                name="EdadMaxima"
                placeholder="Edad Máxima"
              />
            </div>
           
          </div>
          <div className="columns is-desktop is-tablet">
          <div className="column is-one-third">
              <CustomFieldText
                disabled={loading}
                label="Días de Pago"
                name="DiasPago"
                placeholder="Días de Pago"
              />
            </div>
            <div className="column is-one-third">
              <CustomFieldText
                disabled={loading}
                label="Día Para Corte"
                name="DiaParaCorte"
                placeholder="Día Para Corte"
              />
            </div>
            <div className="column is-one-third">
              <CustomFieldText
                disabled={loading}
                label="Prioridad Cobranza"
                name="PrioridadCobranza"
                placeholder="Prioridad Cobranza"
              />
            </div>
            
          </div>
          <div className="columns is-desktop is-tablet">
            <div className="column is-one-quarter">
              <CustomFieldCheckbox
                disabled={loading}
                label={`Requiere ${DescripcionDistribuidor(1)}`}
                name="RequiereDistribuidor"
              />
            </div>
            <div className="column is-one-quarter">
              <CustomFieldCheckbox
                disabled={loading}
                label="Requiere Grupo"
                name="RequiereGrupo"
              />
            </div>
            <div className="column is-one-quarter">
              <CustomFieldCheckbox
                disabled={loading}
                label="Valida Disponible"
                name="ValidaDisponible"
              />
            </div>
            <div className="column is-one-quarter">
              <CustomFieldCheckbox
                disabled={loading}
                label="Restructura"
                name="Restructura"
              />
            </div>
          </div>
          <div className="columns is-desktop is-tablet">
            <div className="column is-one-quarter">
              <CustomFieldCheckbox
                disabled={loading}
                label="Genera Desembolso"
                name="GeneraDesembolso"
              />
            </div>
            <div className="column is-one-quarter">
              <CustomFieldCheckbox
                disabled={loading}
                label="Seguro Financiado"
                name="SeguroFinanciado"
              />
            </div>
            <div className="column is-one-quarter">
              <CustomFieldCheckbox
                disabled={loading}
                label="Canje"
                name="Canje"
              />
            </div>
            <div className="column is-one-quarter">
              <CustomFieldCheckbox
                disabled={loading}
                label="Desglosar IVA"
                name="DesglosarIVA"
              />
            </div>
          </div>
          <div className="columns is-desktop is-tablet">
            
            <div className="column is-one-quarter">
              <CustomFieldCheckbox
                disabled={loading}
                label="Capital al Final"
                name="CapitalAlFinal"
              />
            </div>
            <div className="column is-one-quarter">
              <CustomFieldCheckbox
                disabled={loading}
                label="Cargo Financiado"
                name="CargoFinanciado"
              />
            </div>
            <div className="column is-one-quarter">
              <CustomFieldCheckbox
                disabled={loading}
                label="Cargo al Inicio"
                name="CargoAlInicio"
              />
            </div>
            <div className="column is-one-quarter">
              <CustomFieldCheckbox
                disabled={loading}
                label="Activa Crédito"
                name="ActivaCredito"
              />
            </div>
          </div>
          <div className="columns is-desktop is-tablet">
            <div className="column is-one-quarter">
              <CustomFieldCheckbox
                disabled={loading}
                label="Créditos Liquidados"
                name="CreditosLiquidadosReq"
              />
            </div>
            <div className="column is-one-quarter">
              <CustomFieldCheckbox
                disabled={loading}
                label="Permiso Especial"
                name="PermisoEspecial"
              />
            </div>
            <div className="column is-one-quarter">
              <CustomFieldCheckbox
                disabled={loading}
                label="Validar Condiciones"
                name="ValidarCondiciones"
              />
            </div>
            <div className="column is-one-quarter">
              <CustomFieldCheckbox
                disabled={loading}
                label="Aplica IVA Interés"
                name="AplicaIVAInteres"
              />
            </div>
          </div>
          <div className="columns is-desktop is-tablet">
           
            <div className="column is-one-quarter">
              <CustomFieldCheckbox
                disabled={loading}
                label="Aplica IVA Seguro"
                name="AplicaIVASeguro"
              />
            </div>
            <div className="column is-one-quarter">
              <CustomFieldCheckbox
                disabled={loading}
                label="Aplica IVA Manejo Cuenta"
                name="AplicaIVAManejoCuenta"
              />
            </div>
            <div className="column is-one-quarter">
              <CustomFieldCheckbox
                disabled={loading}
                label="Aplica Comisión"
                name="AplicaComision"
              />
            </div>
          </div>
          <div className="columns is-desktop is-tablet">
            {/*   <div className="column is-one-third">
              <CustomSelect
                disabled={loading}
                label="Cuenta Maestra"
                name="CuentaMaestraId"
                placeholder="Seleccione la Cuenta Maestra"
                options={props.optAgrupaciones}
                addDefault={false}
                isMulti={false}
              />
            </div> */}
            <div className="column is-one-third">
              <CustomSelect
                disabled={loading}
                label="Producto Adicional"
                name="AdicProductoId"
                placeholder="Producto Adicional"
                options={props.optProductos}
                addDefault={true}
                isMulti={false}
              />
            </div>
            <div className="column is-one-third">
              <CustomSelect
                disabled={loading}
                label="Cuenta Capital"
                name="CtaCapitalId"
                placeholder=""
                options={props.optCuentasContables}
                addDefault={false}
                isMulti={false}
              />
            </div>
            <div className="column is-one-third">
              <CustomSelect
                disabled={loading}
                label="Cta. Interés Normal"
                name="CtaInteresNormalId"
                placeholder=""
                options={props.optCuentasContables}
                addDefault={false}
                isMulti={false}
              />
            </div>
          </div>
          <div className="columns is-desktop is-tablet">
            <div className="column is-one-third">
              <CustomSelect
                disabled={loading}
                label="Cta. Interés Mora"
                name="CtaInteresMoraId"
                placeholder=""
                options={props.optCuentasContables}
                addDefault={false}
                isMulti={false}
              />
            </div>
            <div className="column is-one-third">
              <CustomSelect
                disabled={loading}
                label="Cuenta IVA"
                name="CtaIvaId"
                placeholder=""
                options={props.optCuentasContables}
                addDefault={false}
                isMulti={false}
              />
            </div>
            <div className="column is-one-third">
              <CustomSelect
                disabled={loading}
                label="Cta. Interés Normal Deudor"
                name="CtaInteresNormDeudorId"
                placeholder=""
                options={props.optCuentasContables}
                addDefault={false}
                isMulti={false}
              />
            </div>
          </div>
          <div className="columns is-desktop is-tablet">
            <div className="column is-one-third">
              <CustomSelect
                disabled={loading}
                label="Cta. Interés Normal Acreedor"
                name="CtaInteresNormAcreedorId"
                placeholder=""
                options={props.optCuentasContables}
                addDefault={false}
                isMulti={false}
              />
            </div>
            <div className="column is-one-third">
              <CustomSelect
                disabled={loading}
                label="Cuenta Interés Mora Deudor"
                name="CtaInteresMoraDeudorId"
                placeholder=""
                options={props.optCuentasContables}
                addDefault={false}
                isMulti={false}
              />
            </div>
            <div className="column is-one-third">
              <CustomSelect
                disabled={loading}
                label="Cta. Interés Mora Acreedor"
                name="CtaInteresMoraAcreedorId"
                placeholder=""
                options={props.optCuentasContables}
                addDefault={false}
                isMulti={false}
              />
            </div>
          </div>
          <div className="columns is-desktop is-tablet">
            <div className="column is-one-third">
              <ActionAsyncSelect
                loadOptions={loadOptionsPersonas}
                disabled={loading}
                label="Encargado"
                name="PersonaResponsableId"
                placeholder="Escriba el nombre del Encargado"
                options={formValues.optPersonas}
                addDefault={true}
                valor={props.initialValues.PersonaResponsableId}
                accion={cbPersona}
                noOptionsMessage={"No encontrado"}
                //  blur={fnGetCondicionesDetalleByDistribuidor}
                ref={refPersona}
              />
            </div>
            <div className="column is-2">
              <CustomFieldText
                disabled={loading}
                label="Días de caducidad de folio"
                name="DiasCaducidadFolio"
                placeholder="DiasCaducidadFolio"
              />
            </div>
            <div className="column is-2">
              <CustomFieldText
                disabled={loading}
                label="Días de caducidad de vales"
                name="DiasCaducidadVale"
                placeholder="DiasCaducidadVale"
              />
            </div>

            <div className="column is-one-third">
              <CustomFieldImgUpload
                disabled={loading}
                label="Logo"
                name="file"
                imageSrc={"data:image/png;base64," + props.initialValues.Logo}
              />
            </div>
          </div>
        </div>
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
              Aceptar
            </button>
          </div>
        )}
      </Form>
    </Formik>
  );
};
