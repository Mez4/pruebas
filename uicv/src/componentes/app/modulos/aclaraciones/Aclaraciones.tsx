import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router'

import { IEstado } from '../../../../interfaces/redux/IEstado'


import { Header } from './Header'
import { useAccesoProducto } from '../../../hooks/useAccesoProducto'



import { iUI } from '../../../../interfaces/ui/iUI'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import SolicitudAclaraciones from './CompAclaraciones/SolicitudesAclaraciones'

const ModuloID: number = 1023

/** Data type for the app */
type MesadeAclaracionesType = {
    oidc: IOidc,
    ui: iUI,
    location: any
}
const MesaDeAclaraciones = (props: MesadeAclaracionesType) => {
    useAccesoProducto(ModuloID)
    return (
        <React.Fragment>
            <div>
                <Switch>
                    <Route path="/app/:productoId/mesadeaclaraciones/SolicitudAclaraciones" component={SolicitudAclaraciones} />
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

export default connect(mapStateToProps, MapDispatchToProps)(MesaDeAclaraciones)

