import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router'
import { IEstado } from '../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import { iUI } from '../../../../interfaces/ui/iUI'
import { useAccesoProducto } from '../../../hooks/useAccesoProducto'
import {
    CreditoGlobal,
    Personas,
    GestoresUsuarios,
    GestoriaDistpagosVencimiento,
    Responsables,
    NotasRapidas,
    ReferenciasCreditos,
    PagosClientes,
    CreditoGlobalNuevoGestoria,
    AsignacionRol
} from './CompGestoría'

const ModuloID: number = 1030

/** Data type for the app */
type GestoriaType = {
    oidc: IOidc,
    ui: iUI,
    location: any
}
const Gestoria = (): React.ReactElement => {
    useAccesoProducto(ModuloID)

    return (
        <div className="">
            <Switch>

                <Route path="/app/:productoId/gestor/distribuidores" component={Personas} />
                <Route path="/app/:productoId/gestor/GestoresUsuarios" component={GestoresUsuarios} />
                <Route path="/app/:productoId/gestor/reportes/DistPagosVencimiento" component={GestoriaDistpagosVencimiento} />
                <Route path="/app/:productoId/gestor/reportes/NotasRapidas" component={NotasRapidas} />
                <Route path="/app/:productoId/gestor/reportes/ReferenciasCreditos" component={ReferenciasCreditos} />
                <Route path="/app/:productoId/gestor/reportes/PagosClientes" component={PagosClientes} />
                <Route path="/app/:productoId/gestor/CreditoGlobal" component={CreditoGlobal} />
                <Route path="/app/:productoId/gestor/CreditoGlobalNuevoGestoria" component={CreditoGlobalNuevoGestoria} />
                <Route path="/app/:productoId/gestor/Responsables" component={Responsables} />
                <Route path="/app/:productoId/gestor/AsignacionRol" component={AsignacionRol} />
                <Route render={() => <span>Redirect nivel de modulo</span>} />

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

export default Gestoria

