import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, ActionSelect } from '../../global'
import * as Funciones from './CompPerfilPersona/FuncionesTel'
import { IOidc } from '../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { DistribuidorID: number, Telefono?: string, },
    cbActualizaTelefono(item: any): any
    fnCancelar(): any
}

export const CForm = (props: CFormType) => {

    // Loading
    const [loading, setLoading] = React.useState(false)
    const [isMounted, setisMounted] = React.useState(false)

    // Return the component
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                Telefono: Yup.string().required("Campo obligatorio").max(10, 'el teléfono debe tener máximo 10 dígitos').min(10, 'el teléfono debe tener máximo 10 dígitos'),
            })}
            onSubmit={(values: any, { resetForm }) => {

                // Set our form to a loading state
                setLoading(true)
                //console.log(`values`, values)

                Funciones.FNupdateTelefono(props.oidc, { ...values, DistribuidorID: values.DistribuidorID, Telefono: values.Telefono })
                    .then((respuesta: any) => {
                        // console.log(respuesta, 'resp telef')

                        setLoading(false)
                        if (respuesta.regresa == 0) {
                            // props.cbActualizaTelefono(respuesta.TelefonoDomicilio)
                            toast.warning(respuesta.mensaje)
                        } else {
                            props.cbActualizaTelefono(respuesta.TelefonoDomicilio)
                            toast.success(respuesta.mensaje)
                            resetForm()
                        }
                    })
                    .catch((error: any) => {
                        toast.error("Error al actualizar")
                        setLoading(false)
                    })

            }
            }>
            <Form>
                <CustomFieldText disabled={loading} label="Teléfono" name="Telefono" placeholder="Teléfono" />
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