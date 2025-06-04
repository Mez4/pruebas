import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router'

import { IEstado } from '../../../../interfaces/redux/IEstado'
import CajaDenominacionesMonedaCajera from '../tesoreria/CompTesoreria/CajaDenominacionesMonedaCajera'
import CajaDenominacionesMonedaGeneral from './CompCajas/CajaDenominacionesMonedaGeneral'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import { Header } from './Header'
import { iUI } from '../../../../interfaces/ui/iUI'


/** Data type for the app */
type TesoreriaType = {
    location: any,
    ui: iUI,
    oidc: IOidc
}
const Tesoreria = (props: TesoreriaType) => {
    return (
        <div>
            <Header pathname={props.location.pathname} oidc={props.oidc} ui={props.ui} />
            <div className="p-3">
                <Switch>

                    <Route path="/app/cajas/cajas/CajaDenominacionesMonedaCajera" component={CajaDenominacionesMonedaCajera} />
                    <Route path="/app/cajas/cajas/CajaDenominacionesMonedaGeneral" component={CajaDenominacionesMonedaGeneral} />
                    <Route render={() => <span>Redirect nivel de modulo</span>} />

                </Switch>
            </div>
        </div>
    )
} 


//prueba

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI
})

const MapDispatchToProps = (dispatch: any) => ({

})

export default connect(mapStateToProps, MapDispatchToProps)(Tesoreria)

