import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { Costo: number },
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
                Costo: Yup.number().required("Campo obligatorio").moreThan(0, "Número mayor a 0"),
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)
                console.log(`values`, values)
                // Finish the callback
                if (props.Id === undefined)
                    Funciones.FNAdd(props.oidc, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            toast.success("Costo agregado correctamente")
                        })
                        .catch((error: any) => {
                            toast.error("Error al agregar costo")
                            setLoading(false)
                        })
                else
                    Funciones.FNUpdate(props.oidc, { ...values, ValeraCostoID: props.Id })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Costo actualizado correctamente")
                        })
                        .catch((error: any) => {
                            toast.error("Error al actualizar costo")
                            setLoading(false)
                        })

            }}>
            <Form>
                <CustomFieldText disabled={loading} label="Costo" name="Costo" placeholder="Valera Costo" />
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