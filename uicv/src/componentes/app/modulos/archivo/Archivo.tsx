import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import { IEstado } from '../../../../interfaces/redux/IEstado'
import { Header } from './Header'

// import Persona from './CompArchivo/Persona'
import { iUI } from '../../../../interfaces/ui/iUI'
import Personas from './CompArchivo/Personas'
import { useAccesoAdministracion } from '../../../hooks/useAccesoAdministracion'
import CatalogoEstatus from './CompArchivo/CatalogoEstatus'
// ModuloID
const ModuloID: number = 1025

type ArchivoType = {
    oidc: IOidc,
    ui: iUI,
    location: any
}
const Archivo = (props: ArchivoType) => {

    // Accedemos al hook e seguridad
    useAccesoAdministracion(ModuloID)

    return (
        <>
            <div className="">
                <Switch>
                    <Route exact path="/app/archivo/personas/clientes" render={() => (<Personas key={"com_admin_clientes"} TipoPersonas={Personas.TipoPersonas.Clientes} />)} />
                    <Route exact path="/app/archivo/personas/distribuidores" render={() => (<Personas key={"com_admin_distribuidores"} TipoPersonas={Personas.TipoPersonas.Distribuidores} />)} />
                    <Route exact path="/app/archivo/personas/coordinadores" render={() => (<Personas key={"com_admin_coordinadores"} TipoPersonas={Personas.TipoPersonas.Coordinadores} />)} />
                    <Route exact path="/app/archivo/personas/promotores" render={() => (<Personas key={"com_admin_promotores"} TipoPersonas={Personas.TipoPersonas.Promotores} />)} />
                    <Route exact path="/app/archivo/personas/analistas" render={() => (<Personas key={"com_admin_analistas"} TipoPersonas={Personas.TipoPersonas.Analistas} />)} />
                    <Route exact path="/app/archivo/personas/directoresmesacredito" render={() => (<Personas key={"com_admin_directoresmesacredito"} TipoPersonas={Personas.TipoPersonas.DirectoresMesaCredito} />)} />
                    <Route exact path="/app/archivo/personas/gestorescobranza" render={() => (<Personas key={"com_admin_gestorescobranza"} TipoPersonas={Personas.TipoPersonas.GestoresCobranza} />)} />
                    <Route exact path="/app/archivo/personas/directoresmesacobranza" render={() => (<Personas key={"com_admin_directoresmesacobranza"} TipoPersonas={Personas.TipoPersonas.DirectoresMesaCobranza} />)} />
                    <Route path="/app/archivo/CompPersonas/CatalogoEstatus" component={CatalogoEstatus} />

                    {/* 
                    <Route path="/app/administracion/personas/clientes/:id" render={() => (<Persona key="com_admin_cliente" TipoPersona={Persona.TipoPersona.Cliente} />)} />
                    <Route path="/app/administracion/personas/distribuidores/:id" render={() => (<Persona key="com_admin_distribuidor" TipoPersona={Persona.TipoPersona.Distribuidor} />)} />
                    <Route path="/app/administracion/personas/coordinadores/:id" render={() => (<Persona key="com_admin_coordinador" TipoPersona={Persona.TipoPersona.Coordinador} />)} /> */}

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

export default connect(mapStateToProps)(Archivo)