import React from 'react'
import { Formik, Form } from 'formik'
import Yup from '../../../../../../global/yupLocale'
import { CustomFieldText, Spinner } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { ViviendaTipo: string, Activa: boolean },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(): any
}
export const CForm = (props: CFormType) => {

    // Loading
    const [loading, setLoading] = React.useState(false)

    // Return the component
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                ViviendaTipo: Yup.string().required().min(3).max(12),
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)

                // Finish the callback
                if (props.Id === undefined)
                    Funciones.FNAdd(props.oidc, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al guardar la vivienda" + JSON.stringify(error))
                            setLoading(false)
                        })
                else
                    Funciones.FNUpdate(props.oidc, { ...values, ViviendaTipoId: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al guardar la vivienda" + JSON.stringify(error))
                            setLoading(false)
                        })

            }}>
            <Form>
                <CustomFieldText disabled={loading} label="Nombre" name="ViviendaTipo" placeholder="Tipo de vivienda" />
                <CustomFieldCheckbox disabled={loading} label="Activa" name="Activa" />
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Ok</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}
