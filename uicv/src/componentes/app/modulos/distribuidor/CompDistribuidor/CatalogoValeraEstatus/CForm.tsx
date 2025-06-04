import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { toast } from 'react-toastify'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { ValeraEstatusID: string, ValeraEstatus: string, PuedeCanjear: boolean, AsignaUsuario: boolean, Orden: number },
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
                ValeraEstatusID: Yup.string().required("Campo obligatorio").min(1, "Minimo 3 caracteres").max(1, "Maximo 12 caracteres"),
                ValeraEstatus: Yup.string().required("Campo obligatorio").min(3, "Minimo 3 caracteres").max(20, "Maximo 12 caracteres"),
                //PuedeCanjear: Yup.string().required("Campo obligatorio"),
                //AsignaUsuario: Yup.string().required("Campo obligatorio"),
                Orden: Yup.string().required("Campo obligatorio"),
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
                            toast.success("Estatus agregado correctamente")
                        })
                        .catch((error: any) => {
                            toast.error("Error al agregar estatus")
                            setLoading(false)
                        })
                else
                    Funciones.FNUpdate(props.oidc, { ...values, ValeraEstatusID: props.Id  })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Estatus actualizado correctamente")
                        })
                        .catch((error: any) => {
                            toast.error("Error al actualizar estatus")
                            setLoading(false)
                        })

            }}>
            <Form>

                <CustomFieldText disabled={loading} label="ValeraEstatusID" name="ValeraEstatusID" placeholder="Valera Estatus ID" />
                <CustomFieldText disabled={loading} label="ValeraEstatus" name="ValeraEstatus" placeholder="Valera Estatus Descripciòn" />
                <CustomFieldCheckbox disabled={loading} label="Puede Canjear" name="PuedeCanjear" />
                <CustomFieldCheckbox disabled={loading} label="Asigna Usuario" name="AsignaUsuario" />
                <CustomFieldText disabled={loading} label="Orden" name="Orden" placeholder="Orden" />
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