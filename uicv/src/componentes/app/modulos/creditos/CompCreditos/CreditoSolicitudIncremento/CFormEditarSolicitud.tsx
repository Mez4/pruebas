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
import { Solicitud } from '../CreditoReestructuraSolicitudes/Solicitud';
type CFormType = {
    oidc: IOidc

    Id?: number,
    initialValues: {
        IncrementoSolicitado: number,
    },
    cbGuardar(item: any): any,
    fnCancelar(): any,
}
export const CFormEditarSolicitud = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)
    console.log("PROPS RECIBIDOS ,", props)
    // Return the component
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                //IncrementoSolicitado: Yup.number().required("Campo obligatorio").min(1, "Mínimo 1 carácter").max(10000, "Monto Máximo $10,000"),
                IncrementoSolicitado: Yup.number().required("Campo Obligatorio").moreThan(0, 'Campo Obligatorio'),
            })}  //cuando le das al boton de guardar manda llamar este metodo
            onSubmit={(values: any, { resetForm }) => {
                setLoading(true)
                let objPersonalizado = {
                    IncrementoSolicitado: values.IncrementoSolicitado,
                    SolicitudID: props.Id,
                }
                Funciones.FNModificaIncremento(props.oidc, objPersonalizado)
                    .then((res: any) => {
                        console.log("RESPUESTA , ", res)
                        //props.cbActualizar(res)
                        setLoading(false)
                        props.cbGuardar(res)
                        props.fnCancelar()
                        toast.success("Se ha actualizado correctamente el incrememto")
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
                    label='Incremento'
                    name="IncrementoSolicitado"
                    placeholder='Ingresa Monto'
                />
                        {loading && <Spinner />}
                        {!loading &&
                            <div className="column is-align-items-center is-full">
                                <div className="text-end">
                                    <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Guardar</button>
                                </div>
                            </div>}
                    </div>
                </div>
            </Form>
        </Formik>
    )
}