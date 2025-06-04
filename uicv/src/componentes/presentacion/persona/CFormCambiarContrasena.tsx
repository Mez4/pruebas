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
    initialValues: { PersonaID: number, Contrasena: string, Confirmar: string },
    cbActualizaTelefono(item: any): any
    fnCancelar(): any
}

export const CFormCambiarContrasena = (props: CFormType) => {

    // Loading
    const [loading, setLoading] = React.useState(false)
    const [isMounted, setisMounted] = React.useState(false)
    const [passwordShown, setPasswordShown] = React.useState(false);
    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    // Return the component
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                Contrasena: Yup.string().required('La contraseña puede tener como mínimo 6 caracteres').min(6, 'La contraseña puede tener como mínimo 6 caracteres'),
                Confirmar: Yup.string().required('La contraseña puede tener como mínimo 6 caracteres')
                    .oneOf([Yup.ref('Contrasena'), null], 'Las Contraseñas no Coinciden').min(6, 'La contraseña puede tener como mínimo 6 caracteres')
                //   });
            })}
            onSubmit={(values: any, { resetForm }) => {

                // Set our form to a loading state
                setLoading(true)
                console.log(`values`, values)

                Funciones.FNupdateContrasena(props.oidc, { ...values, PersonaID: values.PersonaID, Contrasena: values.Contrasena })
                    .then((respuesta: any) => {
                        setLoading(false)

                        // props.cbActualizaTelefono(respuesta.TelefonoDomicilio)
                        props.fnCancelar()
                        toast.success("Actualizado correctamente")
                        resetForm()
                    })
                    .catch((error: any) => {
                        console.log(error)
                        toast.error("Error al actualizar", error)
                        setLoading(false)
                    })

            }
            }>
            <Form>
                <CustomFieldText disabled={loading} label="Contraseña" name="Contrasena" placeholder="Contrasena" password />
                <CustomFieldText disabled={loading} label="Confirmar Contraseña" name="Confirmar" placeholder="Confirmar" password />
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