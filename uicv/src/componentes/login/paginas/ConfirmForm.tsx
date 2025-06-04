import React from 'react'

import { Form, Formik } from 'formik'
import { CustomFieldText, Spinner } from '../../global'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'
import axios from 'axios'
import { GetServerUrl } from '../../../global/variables'
import userManager from '../../../userManager'
import { toast } from 'react-toastify'

export const ConfirmForm = (
) => {

    // Use the state
    const [loading, setLoading] = React.useState(false)

    // Render the component
    return (
        <div>

            <h4 className="text-muted font-size-18 mb-1 text-center">Confirmación de contraseña</h4>
            <p className="text-muted text-center">Ingrese sus datos para continuar</p>

            <Formik
                initialValues={{ Usuario: '', Contrasena: '', Codigo: '', Confirmar: '' }}
                validationSchema={Yup.object().shape({
                    Usuario: Yup.string().min(5).required("Campo requerido"),
                    Codigo: Yup.string().required("Campo obligatorio").min(6, "6 Caracteres").max(6, "6 Caracteres"),
                    Contrasena: Yup.string().required("Campo requerido").min(6, "Minimo 6 caracteres").max(18, "Maximo 18 caracteres"),
                    Confirmar: Yup.string().oneOf([Yup.ref('Contrasena'), null], "Las contraseñas no coinciden")
                })}
                onSubmit={async (values: any) => {

                    // setLoading
                    setLoading(true)

                    try {

                        // Send an axios request
                        await axios.post(`${GetServerUrl()}Seguridad/confirmar`, values)

                        // SignIn redirect
                        userManager.signinRedirect()


                    }
                    catch (Ex) {

                        setLoading(false)
                        toast.error("Ocurrio un error, valide su codigo/usuario e intente de nuevo")
                    }

                }}
            >
                <Form>
                    <CustomFieldText label="Usuario" name="Usuario" placeholder="correo@dominio.com/teléfono" disabled={loading} />
                    <CustomFieldText label="Codigo de validación" name="Codigo" placeholder="#####" disabled={loading} />
                    <CustomFieldText label="Contraseña" name="Contrasena" placeholder="******" disabled={loading} password />
                    <CustomFieldText label="Confirmar contraseña" name="Confirmar" placeholder="******" disabled={loading} password />
                    {loading && <Spinner />}
                    {!loading &&
                        <div className="text-end">
                            <button className="btn btn-confia w-md waves-effect waves-light" type="submit"><strong>Confirmar</strong></button>
                        </div>
                    }
                    {!loading &&
                        <div className="col-12 mt-1">
                            <div><Link to="/login/" className="text-muted">Iniciar sesión</Link></div>
                        </div>
                    }
                </Form>
            </Formik>
        </div >
    )
}