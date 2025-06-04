import React from 'react'
import { Formik, Form } from 'formik'
import Yup from '../../../../../../global/yupLocale'
import { CustomFieldText2, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { SelectorColor } from '../../../../../selectores'

type CFormType = {
    oidc: IOidc
    EstadoCoordinadorId?: string,
    initialValues: { EstadoCoordinadorId: string, Nombre: string, Color: string },
    edit: boolean,
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
                EstadoCoordinadorId: Yup.string().required().min(1).max(1),
                Nombre: Yup.string().required().min(3).max(120),
                Color: Yup.string().required().min(3).max(120)
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)

                // Finish the callback
                if (props.EstadoCoordinadorId === undefined)
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
                    Funciones.FNUpdate(props.oidc, { ...values })
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
                <CustomFieldText2 disabled={loading || props.edit} datoType='text' label="Id" name="EstadoCoordinadorId" placeholder="X" />
                <CustomFieldText2 disabled={loading} label="Nombre" datoType='text' name="Nombre" placeholder="Nombre" />
                <SelectorColor label={'Color'} name={'Color'} />
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
