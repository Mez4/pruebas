import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router'

import { IEstado } from '../../../../interfaces/redux/IEstado'


import { Header } from '././Header'



import { iUI } from '../../../../interfaces/ui/iUI'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import Prospectos, { TipoPersonas } from '../Prospeccion/CompProspeccion/Prospectos'
import { useAccesoProducto } from '../../../hooks/useAccesoProducto'
import ProspectosCatalogo from '../Prospeccion/CompProspeccion/ProspectosCatalogo'
import Prospecto from '../Prospeccion/CompProspeccion/Prospectos/prospecto'
import Interesados from '../Prospeccion/CompProspeccion/Interesados';
import ReasignarProspectoInteresado from '../Prospeccion/CompProspeccion/ReasignarProspectoInteresado'
import { ProspectosCoordinador } from '../Prospeccion/CompProspeccion'


const ModuloID: number = 1028

/** Data type for the app */
type ProspeccionType = {
    oidc: IOidc,
    ui: iUI,
    location: any
}
const Promotor = (props: ProspeccionType) => {
    useAccesoProducto(ModuloID)
    console.log("PROPS BASE ,", props.ui)

    return (
        <>
            <div>
                <Switch>
                    <Route path="/app/:productoId/promotor/Interesados" render={() => (<Interesados ui={props.ui} />)} />
                    <Route path="/app/:productoId/promotor/Prospectos" render={() => (<Prospectos key="com_admin_prospectos" TipoPersonas={TipoPersonas.Prospecto} />)} />
                    <Route path="/app/:productoId/promotor/ProspectosCatalogo" render={() => (<ProspectosCatalogo key="com_admin_prospectos_c" TipoPersonas={TipoPersonas.Prospecto} />)} />
                    <Route path="/app/:productoId/promotor/ReasignarProspectoInteresado" render={() => (<ReasignarProspectoInteresado />)} />
                    <Route path="/app/:productoId/promotor/Prospecto/:id" render={() => (<Prospecto key="com_admin_prospecto" ui={props.ui} />)} />
                    <Route path="/app/:productoId/promotor/ProspectosCoordinador" render={() => (<ProspectosCoordinador key="com_admin_prospectos_c" TipoPersonas={TipoPersonas.Prospecto} />)} />
                    <Route render={() => <span>Redirigir nivel de modulo</span>} />
                </Switch>
            </div>
        </>
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI
})

const MapDispatchToProps = (dispatch: any) => ({

})

export default connect(mapStateToProps, MapDispatchToProps)(Promotor)

