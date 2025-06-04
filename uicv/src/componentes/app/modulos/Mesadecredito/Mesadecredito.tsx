import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router'

import { IEstado } from '../../../../interfaces/redux/IEstado'


import { Header } from './Header'



import { iUI } from '../../../../interfaces/ui/iUI'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import CatalogoAnalista from './CompMesadecredito/CatalogoAnalista'
import CatalogoMesasCreditos from './CompMesadecredito/CatalogoMesasCreditos'
import CatalogoProductosCredMesa from './CompMesadecredito/CatalogoProductosCredMesa'
import SolicitudMesaCredito from './CompMesadecredito/SolicitudMesaCredito'
import RevisionExpediente from './CompMesadecredito/RevisionExpediente'



/** Data type for the app */
type MesadecreditoType = {
    oidc: IOidc,
    ui: iUI,
    location: any
}
const Mesadecredito = (props: MesadecreditoType) => {
    return (
        <React.Fragment>
            <div>
                <Switch>
                <Route path="/app/Mesadecredito/CatalogoAnalista" component={CatalogoAnalista} />
                <Route path="/app/Mesadecredito/CatalogoMesasCreditos" component={CatalogoMesasCreditos} />
                <Route path="/app/Mesadecredito/CatalogoProductosCredMesa" component={CatalogoProductosCredMesa} />
                <Route path="/app/Mesadecredito/SolicitudMesaCredito" component={SolicitudMesaCredito} />
                <Route path="/app/Mesadecredito/RevisionExpediente" component={RevisionExpediente} />


                    <Route render={() => <span>Redirect nivel de modulo</span>} />

                </Switch>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI
})

const MapDispatchToProps = (dispatch: any) => ({

})

export default connect(mapStateToProps, MapDispatchToProps)(Mesadecredito)

