import React from 'react'
import { Link, Route, Switch } from 'react-router-dom'

// Importar nuestras funciones thunk
// import * as fnt from '../../redux/seguridad/functionesThunk'
import { Container } from './comp/Container'
import { ConfirmForm } from './paginas/ConfirmForm'
import { RecoverForm } from './paginas/RecoverForm'

// Typo de propiedades para login
// type LogInType = {
//     oidc: IOidc
//     FNLogin: any,
//     FNConfirm: any
// }

// Componente de sesiones
function LoginBase() {

    // Iniciar sesión
    // const fnLogIn = (values: { Correo: string, Contrasena: string }, setLoading: any) => {
    //     setLoading(true)
    //     props.FNLogin(values)
    //         .then(() => {
    //             setLoading(false)
    //             Historial.push("/login/module")
    //             toast.success("Sesión iniciada")
    //         })
    //         .catch(() => {
    //             setLoading(false)
    //             toast.error("Error al iniciar sesión")
    //         })
    // }

    // Confirmar usuario
    // const fnConfirmar = (values: { Correo: string, Contrasena: string, Codigo: string }, setLoading: any) => {
    //     setLoading(true)
    //     props.FNConfirm(values)
    //         .then(() => {
    //             setLoading(false)
    //             Historial.push("/login/module")
    //             toast.success("Sesión iniciada")
    //         })
    //         .catch(() => {
    //             setLoading(false)
    //             toast.error("Error al iniciar sesión")
    //         })
    // }

    // // Recuperar usuario
    // const fnRecuperar = (values: { Correo: string }, setLoading: any) => {
    //     setLoading(true)
    //     props.FNConfirm(values)
    //         .then(() => {
    //             setLoading(false)
    //             Historial.push("/login/confirm")
    //             toast.success("Sesión iniciada")
    //         })
    //         .catch(() => {
    //             setLoading(false)
    //             toast.error("Error al iniciar sesión")
    //         })
    // }

    // Return the component
    return (
        <Container>
            <div className="p-3">
                <Switch>
                    {/* <Route exact path="/login" render={() => <LoginForm fnLogIn={fnLogIn} />} /> */}
                    <Route path="/login/recover" render={() => <RecoverForm fnRecuperar={() => alert("DOMO")} />} />
                    <Route path="/login/confirm" render={() => <ConfirmForm />} />
                    <Route path="/login" render={() =>
                        <div className='text-center'>
                            <h3>Recover passwors</h3>
                            <Link to={"/login/confirm"}>
                                <button>DOMO !!</button>
                            </Link>
                        </div>
                    } />
                </Switch>
            </div>
        </Container >
    )
}

//  <Route path="/login/module" render={() => <ModuleSelect oidc={props.oidc} />} />

// const MapStateToProps = (Estado: IEstado) => ({
//     Seguridad: Estado.oidc
// })

// const MapDispatchToprops = (dispatch: any) => ({
//     // FNLogin: (valores: { Correo: string, Contrasena: string }) => dispatch(fnt.SeguridadLogin(valores)),
//     // FNConfirm: (valores: { Correo: string, Contrasena: string, Codigo: string }) => dispatch(fnt.SeguridadConfirmar(valores)),
// })

export default LoginBase // connect(MapStateToProps, MapDispatchToprops)(LoginBase)