import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router'

import { IEstado } from '../../../../interfaces/redux/IEstado'
import { CatalogoValeraSeries, CatalogoValeraSeriesTipos, CatalogoValeraEstatus, CatalogoValeraCabeceraEstatus, CatalogoValeraFraccion, CatalogoValeratrackingEstatus, Valeras, ValerasCabecera, RevisionValera, CatalogoValeraCosto } from './CompDistribuidor'

//import { CatalogoTipoCuenta, CatalogoTipoPoliza, MonedaSat } from './CompTesoreria'
import { Header } from './Header'

import { IOidc } from '../../../../interfaces/oidc/IOidc'
import { iUI } from '../../../../interfaces/ui/iUI'
import { useAccesoProducto } from '../../../hooks/useAccesoProducto'
import CancelacionCredito from './CompDistribuidor/CancelacionCredito'

const ModuloID: number = 8

/** Data type for the app */
type DistribuidoresType = {
    oidc: IOidc,
    ui: iUI,
    location: any
}
const Distribuidores = (props: DistribuidoresType) => {
    useAccesoProducto(ModuloID)
    console.log("PROPS BASE ,", props.ui)
    
    return (
        <React.Fragment>
            <div>
                <Switch>

                    <Route path="/app/:productoId/distribuidores/valeras/ValeraSeries" component={CatalogoValeraSeries} />
                    <Route path="/app/:productoId/distribuidores/valeras/ValeraSeriesTipos" component={CatalogoValeraSeriesTipos} />
                    <Route path="/app/:productoId/distribuidores/catalogos/ValeraEstatus" component={CatalogoValeraEstatus} />
                    <Route path="/app/:productoId/distribuidores/catalogos/ValeraFraccion" component={CatalogoValeraFraccion} />
                    <Route path="/app/:productoId/distribuidores/catalogos/ValeraCabeceraEstatus" component={CatalogoValeraCabeceraEstatus} />
                    <Route path="/app/:productoId/distribuidores/catalogos/ValeraTrackingEstatus" component={CatalogoValeratrackingEstatus} />
                    <Route path="/app/:productoId/distribuidores/valeras/BloqueValeras" component={Valeras} />
                    <Route path="/app/:productoId/distribuidores/valeras/ValerasCabecera" component={ValerasCabecera} />
                    <Route path="/app/:productoId/distribuidores/valeras/RevisionValera" component={RevisionValera} />
                    <Route path="/app/:productoId/distribuidores/catalogos/ValeraCosto" component={CatalogoValeraCosto} />
                    <Route path="/app/:productoId/distribuidores/valeras/CancelacionCredito" component={CancelacionCredito} />
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

export default connect(mapStateToProps, MapDispatchToProps)(Distribuidores)

