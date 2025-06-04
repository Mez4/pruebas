import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { toast } from 'react-toastify'
import { SelectorColor } from '../../../../../selectores'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { NombreEstatus: string, Clave: string, Color: string, Descripcion: string },
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
                NombreEstatus: Yup.string().required("Campo obligatorio").min(1, "Minimo 3 caracteres").max(35, "Maximo 35 caracteres"),
                Clave: Yup.string().required("Campo obligatorio").min(2, "Minimo 2 caracteres").max(4, "Maximo 4 caracteres"),
                Color: Yup.string().required("Campo obligatorio").min(3, "Minimo 3 caracteres").max(35, "Maximo 35 caracteres"),
                Descripcion: Yup.string().required("Campo obligatorio").min(3, "Minimo 3 caracteres").max(100, "Maximo 100 caracteres"),
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
                            toast.success("agregado correctamente")
                        })
                        .catch((error: any) => {
                            toast.error("Error al agregar")
                            setLoading(false)
                        })
                else
                    Funciones.FNUpdate(props.oidc, { ...values, EstatusID: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("actualizado correctamente")
                        })
                        .catch((error: any) => {
                            toast.error("Error al actualizar")
                            setLoading(false)
                        })

            }}>
            <Form>

                <CustomFieldText disabled={loading} label="NombreEstatus" name="NombreEstatus" placeholder="Estatus" />
                <CustomFieldText disabled={loading} label="Clave" name="Clave" placeholder="Clave" />
                <SelectorColor name={'Color'} label={'Color'} />
                <CustomFieldText disabled={loading} label="Decripción" name="Descripcion" placeholder="Descripción" />
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