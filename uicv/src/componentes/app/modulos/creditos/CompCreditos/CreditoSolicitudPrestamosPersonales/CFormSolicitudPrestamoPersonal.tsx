import React, { useEffect, useRef } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, CustomSelect, Spinner, CustomFieldImgUpload, ActionSelect } from '../../../../../global'
import * as Funciones from './Funciones'
//import * as Funciones2 from '../../../../../presentacion/ditribuidor/CompPerfilDistribuidor/Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { ActionAsyncSelect, ActionAsyncSelectDefault } from '../../../../../global'
import { setDefaultLocale } from 'react-datepicker'
import { Field, ErrorMessage } from 'formik'
import { number } from '../../../../../../global/idiomaValidacion.bak'
import { toast } from 'react-toastify'
import { Solicitud } from '../CreditoReestructuraSolicitudes/Solicitud';
import { FNGetContrato } from '../../../../../presentacion/persona/CompPerfilPersona/Funciones';
import { iUI } from '../../../../../../interfaces/ui/iUI';

type CFormType = {
    oidc: IOidc,
    ui: iUI,
    Id?: number,
    DistribuidoraID?: number,
    initialValues: {
        PrestamoSolicitado: number,
        PlazoSolicitado: number,
        Observaciones: string,
        DistribuidorID: number,
    },
    cbGuardar(item: any): any,
    fnCancelar(): any,
}

export const CFormEditarSolicitudPrestamoPersonal = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)
    console.log("PropsEditarSolicitud: ", props)

    const [LineaCredito, setLineaCredito] = React.useState(0)
    const [formValues, setFormValues] = React.useState({
     LineaCredito: 0
    })   
    console.log("Madre mía: ", props.initialValues.DistribuidorID);

//Obtener la línea de crédito
const fnGetContrato = () => {
    FNGetContrato(props.oidc, props.initialValues.DistribuidorID).then((res: any) => {
        console.log("Aqui sí",res.LineaCredito)
        setLineaCredito(res.LineaCredito)
    }).catch((error: any) => {
        console.log("Error", error)
    })
}

useEffect(() =>{
  fnGetContrato()
},[])

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
               // PrestamoSolicitado: Yup.number().required("Campo Obligatorio").moreThan(0, "Campo Obligatorio").max(10000, "Préstamo demasiado alto"),
                //Observaciones: Yup.string().required("Campo Obligatorio").min(5, "Minimo 5 caracteres").max(250, "Máximo 250 caracteres")
                PrestamoSolicitado: Yup.string().required("Campo obligatorio")
                .matches(/^[0-9]+$/, 'Ingrese sólo números.')
                .test('Monto', 'El monto no puede ser mayor a la línea de crédito disponible.', function (value: any) {
                    return value <= LineaCredito
                }),
            })}
            onSubmit={(values: any, { resetForm }) => {
                setLoading(true)
                let obj = {
                    Observaciones: values.Observaciones,
                    PlazoSolicitado: values.PlazoSolicitado,
                    PrestamoSolicitado: values.PrestamoSolicitado,
                    SolicitudPrestamoPersonalID: props.Id,
                    DistribuidorID: props.initialValues.DistribuidorID,
                    Interes: values.Interes
                }

                Funciones.FNModificaIncremento(props.oidc, obj)
                    .then((res: any) => {
                        console.log("RespuestaModificarPrestamo: ", res)
                        setLoading(false)
                        props.cbGuardar(res)
                        props.fnCancelar()
                        toast.success("Se actualizó correctamente el préstamo")
                    }).catch((err: any) => {
                        console.log(JSON.stringify(err))
                        toast.error("Error al guardar")
                        setLoading(false)
                    })
            }}>
            <Form>
                <div className="columns is-centered is-mobile is-multiline">
                    <div className="column is-align-items-center is-full">
                        <CustomFieldText
                            disabled={loading}
                            label="Préstamo a solicitar"
                            name="PrestamoSolicitado"
                            placeholder="Ingresa Monto"
                        />

                       
                        <div className='columns is-centered is-mobile is-multiline'>
                            <div className='column is-align-items-center is-full'>
                                <label className='form-label mb-2' htmlFor="PlazoSolicitado"> Plazo Solicitado</label>
                                        <Field  name="PlazoSolicitado" className="form-select">
                                        {(control: any) => (
                                            <select 
                                            className="form-select" 
                                            onChange={(value: any) => {
                                                control.form.setFieldValue("PlazoSolicitado", (value.target.value))
                                            }}
                                            id={"PlazoSolicitado"}
                                            name={"PlazoSolicitado"}>
                                                <option value="0">{"Selecciona un plazo"}</option>
                                                {Array.from({ length: 8 }, (_, index) => (
                                                <option key={index} value={(index + 1) * 2}>
                                                {(index + 1) * 2} quincenas
                                                </option>
                                            ))}
                                        </select>
                                        )} 
                                    </Field>  
                                <ErrorMessage component="div" name={"PlazoSolicitado"} className="text-danger" /> 
                            </div>
                        </div>

                        <CustomFieldText
                            disabled={loading}
                            label="Motivo"
                            name="Observaciones"
                            placeholder="Ingresa el motivo"
                        />
                        {props.ui.PermisosGenerales?.find(p => p.PermisoID == 99999) &&
                    <div className='columns is-centered is-mobile is-multiline'>
                        <div className='column is-align-items-center is-full'>
                            <label className='form-label mb-2' htmlFor=""> Seleccione Interés</label>
                            <Field disabled name={"Interes"} className="form-select">
                                {(control: any) => (
                                    <select 
                                        className="form-select" 
                                        onChange={(value: any) => {
                                            control.form.setFieldValue("Interes", (value.target.value))
                                        }}
                                        id={"Interes"}
                                        name={"Interes"}>
                                        <option value="0">{"Selecciona el interés"}</option>
                                        {Array.from({ length: 5 }, (_, index) => (
                                            <option key={index} value={(index + 1) * 10}>
                                                {(index + 1) * 10} %
                                            </option>
                                        ))}
                                    </select>
                                )} 
                            </Field>  
                            <ErrorMessage component="div" name={"Interes"} className="text-danger" /> 
                        </div>
                    </div>
                     } 

                        {loading && <Spinner />}
                        {!loading &&
                            <div className="column is-align-items-center is-full">
                                <div className="text-end">
                                    <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </Form>
        </Formik>
    )
}
