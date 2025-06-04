import React, { useRef } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, CustomSelect, Spinner, CustomFieldImgUpload, ActionSelect } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { ActionAsyncSelect, ActionAsyncSelectDefault } from '../../../../../global'
import { setDefaultLocale } from 'react-datepicker'
import { Field, ErrorMessage } from 'formik'
import { number } from '../../../../../../global/idiomaValidacion.bak'
import { toast } from 'react-toastify'
type CFormType = {
    oidc: IOidc

    Id?: number,
    initialValues: {
        MotivoCancelacion: string,
    },
    cbGuardar(item: any): any,
    CbRefresh(item: any): any,
    fnCancelar(): any,
}
// let isMounted = React.useRef(true)
export const CFormCancelarSolicitudAumento = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)
    console.log("PROPS RECIBIDOS ,", props)
    // Return the component
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                MotivoCancelacion: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracteter").max(250, "Maximo 250 caracteres"),
            })}  //cuando le das al boton de guardar manda llamar este metodo
            onSubmit={(values: any, { resetForm }) => {
                setLoading(true)
                let objPersonalizado = {
                    MotivoCancelacion: values.MotivoCancelacion,
                    SolicitudID: props.Id,
                }
                console.log("ID", props.Id)
                Funciones.FNCancelarAumento(props.oidc, objPersonalizado)
                    .then((res: any) => {
                        console.log("RESPUESTA , ", res)
                        props.cbGuardar(res)
                        props.CbRefresh(res)
                        setLoading(false)
                        props.fnCancelar()
                        toast.success("Cancelación exitosa")
                    }).catch((err: any) => {
                        console.log(err)
                        toast.error("Error al cancelar")
                        setLoading(false)
                    })

            }}>
            <Form>

                <div className="columns is-centered is-mobile is-multiline">
                    <div className="column is-align-items-center is-full">
                        <CustomFieldText
                            disabled={loading}
                            label='Cancelación'
                            name="MotivoCancelacion"
                            placeholder='Ingresa Motivo de Cancelacion'
                        />
                        {loading && <Spinner />}
                        {!loading &&
                            <div className="column is-align-items-center is-full">
                                <div className="text-end">
                                    <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Aceptar</button>
                                </div>
                            </div>}
                    </div>
                </div>
            </Form>
        </Formik>
    )
}