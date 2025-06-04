import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { string } from 'yup/lib/locale'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { idTabMora: number, ProductoID: number, limInferiorDias: number, limSuperiorDias: number, diasMoraCartera: number, Activo: boolean },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    FNGetLocal(),
    Identificador: number
}

export const CForm = (props: CFormType) => {


    console.log(props.Identificador, 'ABC')

    // Loading
    const [loading, setLoading] = React.useState(false)

    // Return the component
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                limSuperiorDias: Yup.number().required("Campo obligatorio").moreThan(0, 'El valor debe ser mayor a cero')
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)
                console.log(`Alexis`, values)
                //Finish the callback
                if (props.Identificador === 2) {
                    Funciones.FNAdd(props.oidc, { ...values, idTabMora: props.Id })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            toast.success(respuesta.msj)
                        })
                        .catch((error: any) => {
                            if (error.response)
                                toast.error(`Response: ${error.response.data}`)
                            else if (error.request)
                                toast.error(`Request ${error}`)
                            else
                                toast.error(`${error}`)
                            setLoading(false)
                        })
                }
                else {
                    Funciones.FNUpdate(props.oidc, { ...values, idTabMora: props.Id })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success(respuesta.msj)
                        })
                        .catch((error: any) => {
                            if (error.response)
                                toast.error(`Response: ${error.response.data}`)
                            else if (error.request)
                                toast.error(`Request ${error}`)
                            else
                                toast.error(`${error}`)
                            setLoading(false)
                        })

                }
            }}>
            <Form>
                <CustomFieldText disabled={true} label="Límite Inferior Días" name="limInferiorDias" placeholder="limInferiorDias" />

                <CustomFieldText disabled={loading} label="Límite Superior Días" name="limSuperiorDias" placeholder="limSuperiorDias" />

                <CustomFieldCheckbox disabled={loading} label="Activo" name="Activo" />

                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Aceptar</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}