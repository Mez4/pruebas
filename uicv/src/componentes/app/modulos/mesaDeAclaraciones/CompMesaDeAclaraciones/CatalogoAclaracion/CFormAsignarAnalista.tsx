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
import { CFormAgregarEvidencia } from './CFormAgregarEvidencia'
import { Field, ErrorMessage } from 'formik'
import { number } from '../../../../../../global/idiomaValidacion.bak'
import { toast } from 'react-toastify'
type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: {
        AnalistaID: number,
    },
    cbGuardar(item: any): any,
    fnCancelar(): any,
    optAnalistas: { value: number, label: string }[],
}
// let isMounted = React.useRef(true)
export const CFormAsignarAnalista = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)

    // Return the component
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                AnalistaID: Yup.number().required("Campo Obligatorio").moreThan(0, 'Campo Obligatorio'),
            })}  //cuando le das al boton de guardar manda llamar este metodo
            onSubmit={(values: any, { resetForm }) => {
                setLoading(true)
                let objPersonalizado = {
                    AnalistaID: values.AnalistaID,
                    AclaracionID: props.Id,
                }
                Funciones.FNReAsignarSolicitud(props.oidc, objPersonalizado)
                    .then((res: any) => {
                        props.cbGuardar(res)
                        setLoading(false)
                        props.fnCancelar()
                        toast.success("Se ha asignado correctamente el analista")
                    }).catch((err: any) => {
                        console.log(err)
                        toast.error("Error al guardar")
                        setLoading(false)
                    })


            }}>
            <Form>

                <div className="columns is-centered is-mobile is-multiline">
                    <div className="column is-align-items-center is-full">
                        <ActionSelect
                            disabled={loading}
                            label="Analistas"
                            name="AnalistaID"
                            placeholder="TODOS"
                            options={props.optAnalistas}
                            addDefault={true}
                            valor={[{ value: 0, label: 'TODOS' }]}
                            accion={(e) => { console.log(e) }}
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