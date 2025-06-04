import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router'

import { IEstado } from '../../../../interfaces/redux/IEstado'



import { iUI } from '../../../../interfaces/ui/iUI'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import Dashboard from './CompPagos/Dashboard'


/** Data type for the app */
type PagosType = {
    oidc: IOidc,
    ui: iUI,
    location: any
}
const Pagos = (props: PagosType) => {
    return (
        <div className="">

            <Switch>

                <Route path="/app/pagos/dashboard" component={Dashboard} />
                <Route render={() => <span>Redirect nivel de módulo</span>} />

            </Switch>
        </div>
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI
})

const MapDispatchToProps = (dispatch: any) => ({

})

export default connect(mapStateToProps, MapDispatchToProps)(Pagos)

