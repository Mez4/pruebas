import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

// Componentes personalizados
import ComponenteAplicacion from './app/AplicacionBase'
import LoginBase from './login/LoginBase'
import CallbackPage from './seguridad/CallbackPage'

/** Componente base, solo regresa las rutas */
const ComponenteBase = () => {

    // Renderizar el componente
    return (

        <Switch>
            <Route exact path="/app/callback" component={CallbackPage} />
            <Route path="/app" component={ComponenteAplicacion} />
            <Route path="/login" component={LoginBase} />
            <Route render={() => (<Redirect to="/app" />)} />
        </Switch>
    )
}

// Exportación defacto
export default ComponenteBase