import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, ActionSelect } from '../../global'
import * as Funciones from './CompPerfilPersona/FuncionesTel'
import { IOidc } from '../../../interfaces/oidc/IOidc'
// import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { toast } from 'react-toastify'

type CFormCurpType = {
    oidc: IOidc
    Id?: number,
    initialValues: { DistribuidorID: number, Curp: string, /*UsuarioIDModifica: number*/ },
    // cbActualizar(item: any): any,
    cbActualizaCurp(item: any): any
    fnCancelar(): any
}

export const CFormCurp = (props: CFormCurpType) => {

    // Loading
    const [loading, setLoading] = React.useState(false)
    const [isMounted, setisMounted] = React.useState(false)

    // Return the component
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                Curp: Yup.string().required("Campo obligatorio").max(18, 'el Curp debe tener máximo 18 dígitos').min(18, 'el Curp debe tener minimo 18 dígitos')
            })}
            onSubmit={(values: any, { resetForm }) => {

                // Set our form to a loading state
                setLoading(true)
                //console.log(`values`, values)

                Funciones.FNupdateCurp(props.oidc, { ...values, PersonaID: values.DistribuidorID, Curp: values.Curp })
                    .then((respuesta: any) => {
                        // console.log(respuesta, ' cel')
                        setLoading(false)

                        if (respuesta.regresa == 0) {
                            toast.warning(respuesta.mensaje)
                        } else {
                            props.cbActualizaCurp(respuesta.Field)
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
                <CustomFieldText disabled={loading} label="Curp" name="Curp" placeholder="Curp" />
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