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
    fnCancelar(): any,
}

export const CFormCancelarSolicitudPrimerCanje = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)
    console.log("PropsCancelarSolicitud: ", props)
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                MotivoCancelacion: Yup.string().required("Campo Obligatorio").min(5, "Minimo 5 Caracteres").max(250, "Máximo 250 Caracteres").typeError("Campo Obligatorio")
            })}
            onSubmit={(values: any, { resetForm }) => {
                setLoading(true)
                let obj = {
                    MotivoCancelacion: values.MotivoCancelacion,
                    SolicitudPrimerCanjeID: props.Id
                }
                // Funciones.FNCancelacion(props.oidc, obj)
                //     .then((res: any) => {
                //         //Cancelar préstamo 
                //         setLoading(false)
                //         props.cbGuardar(res)
                //         props.fnCancelar()
                //         toast.success("El préstamo ha sido cancelado")
                //     }).catch((err: any) => {
                //         console.log("Error en la Solicitud: ", err)
                //         toast.error("Error en la Solicitud: ", err)
                //         setLoading(false)
                //     })
            }}>
            <Form>
                <div className="columns is-centered is-mobile is-multiline">
                    <div className="column is-align-items-center is-full">
                        <CustomFieldText
                            disabled={loading}
                            label="Cancelación"
                            name="MotivoCancelacion"
                            placeholder="Ingresa el motivo"
                        />
                        {loading && <Spinner />}
                        {!loading &&
                            <div className="column is-align-items-center is-full">
                                <div className="text-end">
                                    <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                        Aceptar
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
