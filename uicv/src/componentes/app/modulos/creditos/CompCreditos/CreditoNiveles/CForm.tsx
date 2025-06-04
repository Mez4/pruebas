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
import { DescripcionDistribuidor } from '../../../../../../global/variables'
import AsyncSelect from "react-select/async";

type CFormType = {
    oidc: IOidc;
    Id?: number;
    initialValues: {
        EmpresaId: number;
        Producto: string;
        Activo: boolean;
        TasaTipoId: string;
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
    };
    intialValues2: {
        DistribuidorNivel: string;
        PorcComisionBase: number;
        CapitalColocadoMinimo: number;
        CapitalColocadoMaximo: number;
        ImporteProteccionSaldo: number;
        importeMaxCanje: number;
        maximoPrestamoPersonal: number;
        maximoImporteCanjeCliente: number;
        maximoImporteCanjeAval: number;

    }

    cbActualizar(item: any): any;
    cbGuardar(item: any): any;
    fnCancelar(): any;
    optEmpresas: { value: number; label: string }[];
    optTiposTasas: { value: number; label: string }[];
    optProductos: { value: number; label: string }[];
    optAgrupaciones: { value: number; label: string }[];
    optCuentasContables: { value: number; label: string }[];
    optPersona: { value: number; label: string }[];
    fnGetPersona(
        PersonaID: number,
        NombreCompleto: string,
        callback: any
    ): any;
    DatosPersona: any;
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
            initialValues={props.intialValues2}
            enableReinitialize
            validationSchema={Yup.object().shape({
                DistribuidorNivel: Yup.string()
                    .required("Campo obligatorio")
                    .min(1, "Minimo 1 caracter")
                    .max(50, "Maximo 50 caracteres"),
                PorcComisionBase: Yup.number()
                    .required("Campo obligatorio")
                    .moreThan(0, "Campo obligatorio"),
                CapitalColocadoMinimo: Yup.number()
                    .required("Campo obligatorio")
                    .moreThan(0, "Campo obligatorio"),
                CapitalColocadoMaximo: Yup.number()
                    .required("Campo obligatorio")
                    .moreThan(0, "Campo obligatorio"),
                ImporteProteccionSaldo: Yup.number()
                    .required("Campo obligatorio")
                    .moreThan(0, "Campo obligatorio"),
                importeMaxCanje: Yup.number()
                    .required("Campo obligatorio")
                    .moreThan(0, "Campo obligatorio"),
                maximoPrestamoPersonal: Yup.number()
                    .required("Campo obligatorio")
                    .moreThan(0, "Campo obligatorio"),
                maximoImporteCanjeCliente: Yup.number()
                    .required("Campo obligatorio")
                    .moreThan(0, "Campo obligatorio"),
                maximoImporteCanjeAval: Yup.number()
                    .required("Campo obligatorio")
                    .moreThan(0, "Campo obligatorio"),
            })}
            onSubmit={(values: any) => {
                // Set our form to a loading state
                setLoading(true);

                let a = {
                    DistribuidorNivelID: values.DistribuidorNivelID,
                    DistribuidorNivel: values.DistribuidorNivel,
                    PorcComisionBase: values.PorcComisionBase,
                    CapitalColocadoMinimo: values.CapitalColocadoMinimo,
                    CapitalColocadoMaximo: values.CapitalColocadoMaximo,
                    ImporteProteccionSaldo: values.ImporteProteccionSaldo,
                    importeMaxCanje: values.importeMaxCanje,
                    maximoPrestamoPersonal: values.maximoPrestamoPersonal,
                    maximoImporteCanjeCliente: values.maximoImporteCanjeCliente,
                    maximoImporteCanjeAval: values.maximoImporteCanjeAval
                }

                // Finish the callback
                if (props.Id === undefined)
                    Funciones.FNAgregar(props.oidc, a)

                        .then((respuesta: any) => {
                            setLoading(false);
                            console.log("respuesta");
                            props.cbGuardar(respuesta);
                            toast.success("Se guardó el nivel correctamente");
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error));
                            setLoading(false);
                            toast.error("Error al guardar el producto");
                        });
                else {
                    Funciones.FNActualizar(props.oidc, a)
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
            }}
        >
            <Form>
                <div className="container">
                    <div className="columns is-desktop is-tablet">
                        <div className="column is-one-third">
                            <CustomFieldText
                                disabled={loading}
                                label="Nivel"
                                name="DistribuidorNivel"
                                placeholder="Descripción del Nivel"
                            />
                        </div>
                        <div className="column is-one-third">
                            <CustomFieldText
                                disabled={loading}
                                label="Comision Base"
                                name="PorcComisionBase"
                                placeholder="Ingrese monto"
                            />
                        </div>
                        <div className="column is-one-third">
                            <CustomFieldText
                                disabled={loading}
                                label="Capital Minimo"
                                name="CapitalColocadoMinimo"
                                placeholder="Ingrese monto"
                            />
                        </div>
                    </div>
                    <div className="columns is-desktop is-tablet">
                        <div className="column is-one-third">
                            <CustomFieldText
                                disabled={loading}
                                label="Capital Maximo"
                                name="CapitalColocadoMaximo"
                                placeholder="Ingrese monto"
                            />
                        </div>
                        <div className="column is-one-third">
                            <CustomFieldText
                                disabled={loading}
                                label="Proteccion Saldo"
                                name="ImporteProteccionSaldo"
                                placeholder="Ingrese monto"
                            />
                        </div>
                        <div className="column is-one-third">
                            <CustomFieldText
                                disabled={loading}
                                label="Maximo Canje"
                                name="importeMaxCanje"
                                placeholder="Ingrese monto"
                            />
                        </div>
                    </div>
                    <div className="columns is-desktop is-tablet">

                        <div className="column is-one-third">
                            <CustomFieldText
                                disabled={loading}
                                label="Maximo Prestamo Personal"
                                name="maximoPrestamoPersonal"
                                placeholder="Ingrese monto"
                            />
                        </div>
                        <div className="column is-one-third">
                            <CustomFieldText
                                disabled={loading}
                                label="Maximo Canje Cliente"
                                name="maximoImporteCanjeCliente"
                                placeholder="Ingrese monto"
                            />
                        </div>
                        <div className="column is-one-third">
                            <CustomFieldText
                                disabled={loading}
                                label="Maximo Canje Aval"
                                name="maximoImporteCanjeAval"
                                placeholder="Ingrese monto"
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
