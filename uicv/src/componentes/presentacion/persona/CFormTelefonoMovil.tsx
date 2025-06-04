import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, ActionSelect } from '../../global'
import * as Funciones from './CompPerfilPersona/FuncionesTel'
import { IOidc } from '../../../interfaces/oidc/IOidc'
// import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { toast } from 'react-toastify'

type CFormTelefonoMovilType = {
    oidc: IOidc
    Id?: number,
    initialValues: { DistribuidorID: number, Celular: string, /*UsuarioIDModifica: number*/ },
    // cbActualizar(item: any): any,
    cbActualizaCelular(item: any): any
    fnCancelar(): any
}

export const CFormTelefonoMovil = (props: CFormTelefonoMovilType) => {

    // Loading
    const [loading, setLoading] = React.useState(false)
    const [isMounted, setisMounted] = React.useState(false)

    // Return the component
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                Celular: Yup.string().required("Campo obligatorio").max(10, 'el teléfono debe tener máximo 10 dígitos').min(10, 'el teléfono debe tener máximo 10 dígitos')
            })}
            onSubmit={(values: any, { resetForm }) => {

                // Set our form to a loading state
                setLoading(true)
                //console.log(`values`, values)

                Funciones.FNupdateTelefonoMovil(props.oidc, { ...values, DistribuidorID: values.DistribuidorID, Celular: values.Celular })
                    .then((respuesta: any) => {
                        // console.log(respuesta, ' cel')
                        setLoading(false)

                        if (respuesta.regresa == 0) {
                            toast.warning(respuesta.mensaje)
                        } else {
                            props.cbActualizaCelular(respuesta.TelefonoMovil)
                            toast.success(respuesta.mensaje)
                            resetForm()
                        }
                        // props.cbActualizar(respuesta)
                        // toast.success("Actualizado correctamente")

                    })
                    .catch((error: any) => {
                        console.log(error)
                        toast.error("Error al actualizar")
                        setLoading(false)
                    })

            }
            }>
            <Form>
                <CustomFieldText disabled={loading} label="Teléfono Movil" name="Celular" placeholder="Teléfono Movil" />
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