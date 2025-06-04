import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import { IEstado } from '../../../../interfaces/redux/IEstado'
import { Header } from './Header'

import Persona from './CompAdministracion/Persona'
import Personas from './CompAdministracion/Personas'
import { iUI } from '../../../../interfaces/ui/iUI'
import { useAccesoAdministracion } from '../../../hooks/useAccesoAdministracion'
import { TipoPersonas } from '../Prospeccion/CompProspeccion/Prospectos'
import { useAccesoProducto } from '../../../hooks/useAccesoProducto'
//import EstatusSocia from './CompAdministracion/EstatusSocia'
import SolicitudesCancelacionesTemporales from './CompAdministracion/SolicitudesCancelacionesTemporales'
import SolicitudesFallecimiento from './CompAdministracion/SolicitudesFallecimiento'
import SolicitudesGeneral from './CompAdministracion/SolicitudesGeneral'

// ModuloID
const ModuloID: number = 1026

type AdministracionType = {
    oidc: IOidc,
    ui: iUI,
    location: any
}
const MPersonas = (props: AdministracionType) => {

    // Accedemos al hook e seguridad
    useAccesoProducto(ModuloID)

    // Render our component
    return (
        <>
            <div className="">
                <Switch>

                    <Route exact path="/app/:productoId/personas/clientes" render={() => (<Personas key={"com_admin_clientes"} TipoPersonas={Personas.TipoPersonas.Clientes} />)} />
                    <Route exact path="/app/:productoId/personas/distribuidores" render={() => (<Personas key={"com_admin_distribuidores"} TipoPersonas={Personas.TipoPersonas.Distribuidores} />)} />
                    <Route exact path="/app/:productoId/personas/coordinadores" render={() => (<Personas key={"com_admin_coordinadores"} TipoPersonas={Personas.TipoPersonas.Coordinadores} />)} />
                    <Route exact path="/app/:productoId/personas/empleados" render={() => (<Personas key={"com_admin_empleados"} TipoPersonas={Personas.TipoPersonas.Empleados} />)} />
                    <Route exact path="/app/:productoId/personas/SolicitudesCancelacionesTemporales"component={SolicitudesCancelacionesTemporales}  />
                    <Route exact path="/app/:productoId/personas/SolicitudesFallecimiento"component={SolicitudesFallecimiento}  />
                    <Route exact path="/app/:productoId/personas/SolicitudesGeneral"component={SolicitudesGeneral}  />
                    <Route path="/app/:productoId/personas/clientes/:id" render={() => (<Persona key="com_admin_cliente" TipoPersona={Persona.TipoPersona.Cliente} />)} />
                    <Route path="/app/:productoId/personas/distribuidores/:id" render={() => (<Persona key="com_admin_distribuidor" TipoPersona={Persona.TipoPersona.Distribuidor} />)} />
                    <Route path="/app/:productoId/personas/coordinadores/:id" render={() => (<Persona key="com_admin_coordinador" TipoPersona={Persona.TipoPersona.Coordinador} />)} />
                    <Route path="/app/:productoId/personas/coordinadores/:id" render={() => (<Persona key="com_admin_empleados" TipoPersona={Persona.TipoPersona.Empleado} />)} />

                    <Route render={() => <span>Redirect nivel de modulo</span>} />
                </Switch>
            </div>
        </>
    )
}

const mapStateToProps = (estado: IEstado) => ({
    oidc: estado.oidc,
    ui: estado.UI
})

export default connect(mapStateToProps)(MPersonas)