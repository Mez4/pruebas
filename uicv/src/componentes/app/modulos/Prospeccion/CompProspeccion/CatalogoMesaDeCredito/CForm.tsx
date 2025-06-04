import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { string } from 'yup/lib/locale'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { MesaCreditoID: number, Nombre: string, Clave: string, Activo: boolean },
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
                Nombre: Yup.string().required(),
                Clave: Yup.string().required(),
                // Activo: Yup.string().required("Campo obligatorio"),
            })}
            onSubmit={(values: any, {resetForm}) => {

                // Set our form to a loading state
                setLoading(true)
                console.log(`values`, values)
                //Finish the callback
                if (props.Id === undefined)
                    Funciones.FNAdd(props.oidc, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            toast.success("Grupo agregado correctamente")
                            resetForm()
                        })
                        .catch((error: any) => {
                            toast.error("Error al agregar Grupo")
                            setLoading(false)
                        })
                else
                    Funciones.FNUpdate(props.oidc, { ...values, MesaCreditoID: props.Id })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Grupo actualizado correctamente")
                        })
                        .catch((error: any) => {
                            toast.error("Error al actualizar Grupo")
                            setLoading(false)
                        })

            }
            }>
            <Form>
                <CustomFieldText disabled={loading} label="Nombre" name="Nombre" placeholder="Nombre" />
                <CustomFieldText disabled={loading} label="Clave" name="Clave" placeholder="Clave" />
                <CustomFieldCheckbox disabled={loading} label="Activo" name="Activo" />
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