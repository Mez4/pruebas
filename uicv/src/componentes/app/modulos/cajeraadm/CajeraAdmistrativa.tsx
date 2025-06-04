import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router'

import { IEstado } from '../../../../interfaces/redux/IEstado'
import CajaDenominacionesMonedaCajera from '../tesoreria/CompTesoreria/CajaDenominacionesMonedaCajera'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import { Header } from './Header'
import { iUI } from '../../../../interfaces/ui/iUI'
import { CreditoVale } from '../creditos/CompCreditos'
import { useAccesoProducto } from '../../../hooks/useAccesoProducto'

const ModuloID: number = 1029


/** Data type for the app */
type TesoreriaType = {
    location: any,
    ui: iUI,
    oidc: IOidc
}
const CajeraAdmistrativa = (props: TesoreriaType) => {
    useAccesoProducto(ModuloID)
    return (
        <React.Fragment>
            <div>
                <Switch>
                    <Route path="/app/:productoId/administrativa/capturaVales" component={CreditoVale} />
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

export default connect(mapStateToProps, MapDispatchToProps)(CajeraAdmistrativa)

