import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, ActionSelect } from '../../global'
import * as Funciones from './CompPerfilPersona/FuncionesTel'
import { IOidc } from '../../../interfaces/oidc/IOidc'
// import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { toast } from 'react-toastify'

type CFormRFCType = {
    oidc: IOidc
    Id?: number,
    initialValues: { DistribuidorID: number, RFC: string, /*UsuarioIDModifica: number*/ },
    // cbActualizar(item: any): any,
    cbActualizaRFC(item: any): any
    fnCancelar(): any
}

export const CFormRFC = (props: CFormRFCType) => {

    // Loading
    const [loading, setLoading] = React.useState(false)
    const [isMounted, setisMounted] = React.useState(false)

    // Return the component
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                RFC: Yup.string().required("Campo obligatorio").max(13, 'el RFC debe tener máximo 13 dígitos').min(10, 'el RFC debe tener minimo 10 dígitos')
            })}
            onSubmit={(values: any, { resetForm }) => {

                // Set our form to a loading state
                setLoading(true)
                //console.log(`values`, values)

                Funciones.FNupdateRFC(props.oidc, { ...values, PersonaID: values.DistribuidorID, RFC: values.RFC })
                    .then((respuesta: any) => {
                        // console.log(respuesta, ' cel')
                        setLoading(false)

                        if (respuesta.regresa == 0) {
                            toast.warning(respuesta.mensaje)
                        } else {
                            props.cbActualizaRFC(respuesta.Field)
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
                <CustomFieldText disabled={loading} label="RFC" name="RFC" placeholder="RFC" />
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