import React from 'react'
import { Link } from 'react-router-dom'

// Formik
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

// Importar nuestras funciones thunk
import { CustomFieldText, Spinner } from '../../global'

// Typo de propiedades para login
type LogInType = {
    fnLogIn(values: { Correo: string, Contrasena: string }, setLoading: any): any
}

// Login Form
const LoginForm = (props: LogInType) => {

    // Inicializar historial de react-router-dom
    var [loading, setLoading] = React.useState(false)

    // Return our component
    return (
        <div>
            <h4 className="text-muted font-size-18 mb-1 text-center">Bienvenido de vuelta!</h4>
            <p className="text-muted text-center">Inicie sesión para continuar</p>

            <Formik
                initialValues={{ Correo: '', Contrasena: '' }}
                validationSchema={Yup.object().shape({
                    Correo: Yup.string().required("Campo requerido").email("Se requiere un email"),
                    Contrasena: Yup.string().required("Campo requerido").min(6, "Minimo 6 caracteres").max(18, "Maximo 18 caracteres")
                })}
                onSubmit={(values: any) => {
                    setLoading(true)
                    props.fnLogIn(values, setLoading)
                }}
            >
                <Form>
                    <CustomFieldText label="Correo" name="Correo" placeholder="Correo electronico" disabled={loading} />
                    <CustomFieldText label="Contraseña" name="Contrasena" placeholder="Contraseña" disabled={loading} password />
                    {loading && <Spinner />}
                    {!loading &&

                        <div className="text-end">
                            <button className="btn btn-confia w-md waves-effect waves-light" type="submit"><strong>Iniciar sesión</strong></button>
                        </div>
                    }
                    {!loading &&
                        <div className="col-12 mt-1">
                            <div><Link to="/login/recover" className="text-muted">Olvido su contraseña</Link></div>
                            <div><Link to="/login/confirm" className="text-muted mt-1">Confirmar usuario</Link></div>
                        </div>
                    }
                </Form>
            </Formik>
        </div>
    )
}
export default LoginForm