import React from 'react'
import { Link, useHistory } from 'react-router-dom'

// Formik
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'

// Importar nuestras funciones thunk
import { CustomFieldText, Spinner } from '../../global'
import { GetServerUrl } from '../../../global/variables'

// Import our notification library
import { toast } from 'react-toastify'

// Typo de propiedades para login
type RecoverLoginType = {
    fnRecuperar(values: { Correo: string }, setLoading: any): any
}

export const RecoverForm = (props: RecoverLoginType) => {

    const history = useHistory()

    /**
    * Confirmación de usuario
    * @param valores Valores de usuario
    * @returns Regresa un inicio de sesión
    */
    const FNRecuperar = (valores: { Correo: string }) => {

        // Set loading
        setLoading(true)

        // Haga una promesa para confirmar el usuario
        axios.post(`${GetServerUrl()}Seguridad/recuperar`, valores, { headers: { "Content-Type": "application/json" } })
            .then(() => {
                history.push("/login/confirm")
            })
            .catch((error) => {
                setLoading(false)
                toast.error("Ocurrio un error en la operación, intente de nuevo")
            })
    }


    // Inicializar historial de react-router-dom
    var [loading, setLoading] = React.useState(false)

    // Return our component
    return (
        <div>
            <h4 className="text-muted font-size-18 mb-1 text-center">Olvido su contraseña?</h4>
            <p className="text-muted text-center">Ingrese su correo para continuar</p>

            <Formik
                initialValues={{ Correo: '' }}
                validationSchema={Yup.object().shape({
                    Correo: Yup.string().required("Campo requerido").email("Se requiere un email")
                })}
                onSubmit={FNRecuperar}
            >
                <Form>
                    <CustomFieldText label="Correo electronico" name="Correo" placeholder="correo@dominio.com" disabled={loading} />
                    {loading && <Spinner />}
                    {!loading &&
                        <div className="text-end">
                            <button className="btn btn-confia w-md waves-effect waves-light" type="submit"><strong>Recuperar</strong></button>
                        </div>
                    }
                    {!loading &&
                        <div className="col-12 mt-1">
                            <div><Link to="/login/" className="text-muted">Iniciar sesión</Link></div>
                        </div>
                    }
                </Form>
            </Formik>
        </div>
    )
}
