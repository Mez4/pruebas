import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, ActionSelect } from '../../global'
import * as Funciones from './CompPerfilPersona/FuncionesTel'
import { IOidc } from '../../../interfaces/oidc/IOidc'
// import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { toast } from 'react-toastify'

type CFormNombreType = {
    oidc: IOidc
    Id?: number,
    initialValues: { DistribuidorID: number, Nombre: string, /*UsuarioIDModifica: number*/ },
    // cbActualizar(item: any): any,
    cbActualizaNombre(item: any): any
    fnCancelar(): any
}

export const CFormNombre = (props: CFormNombreType) => {

    // Loading
    const [loading, setLoading] = React.useState(false)
    const [isMounted, setisMounted] = React.useState(false)

    // Return the component
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                Nombre: Yup.string().required("Campo obligatorio").min(1, 'el Nombre debe tener minimo 1 dígito'),
                ApellidoPaterno: Yup.string().required("Campo obligatorio").min(1, 'el Nombre debe tener minimo 1 dígito'),
                ApellidoMaterno: Yup.string().required("Campo obligatorio").min(1, 'el Nombre debe tener minimo 1 dígito')
            })}
            onSubmit={(values: any, { resetForm }) => {

                // Set our form to a loading state
                setLoading(true)
                //console.log(`values`, values)

                Funciones.FNupdateNombre(props.oidc, { ...values, PersonaID: values.DistribuidorID, Nombre: values.Nombre, ApellidoPaterno: values.ApellidoPaterno, ApellidoMaterno: values.ApellidoMaterno })
                    .then((respuesta: any) => {
                        // console.log(respuesta, ' cel')
                        setLoading(false)

                        if (respuesta.regresa == 0) {
                            toast.warning(respuesta.mensaje)
                        } else {
                            props.cbActualizaNombre(respuesta.Field)
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
                <CustomFieldText disabled={loading} label="Nombre" name="Nombre" placeholder="Nombre" />
                <CustomFieldText disabled={loading} label="ApellidoPaterno" name="ApellidoPaterno" placeholder="ApellidoPaterno" />
                <CustomFieldText disabled={loading} label="ApellidoMaterno" name="ApellidoMaterno" placeholder="ApellidoMaterno" />
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