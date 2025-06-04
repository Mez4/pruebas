import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router'
import { IEstado } from '../../../../interfaces/redux/IEstado'
import { Header } from './Header'
import { useAccesoProducto } from '../../../hooks/useAccesoProducto'
import { iUI } from '../../../../interfaces/ui/iUI'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import CatalogoTipoSolicitud from './CompMesaDeAclaraciones/CatalogoTipoSolicitud'
import Bitacora from './CompMesaDeAclaraciones/Bitacora'
import CatalogoTipoMovimiento from './CompMesaDeAclaraciones/CatalogoTipoMovimiento'
import CatalogoMesaAclaracion from './CompMesaDeAclaraciones/CatalogoMesaAclaracion'
import CatalogoEstatus from './CompMesaDeAclaraciones/CatalogoEstatus'
import CatalogoAnalistas from './CompMesaDeAclaraciones/CatalogoAnalistas'
import CatalogoEncargados from './CompMesaDeAclaraciones/CatalogoEncargados'
import CatalogoProdMesaAclaracion from './CompMesaDeAclaraciones/CatalogoProdMesaAclaracion'
import CatalogoAclaracion from './CompMesaDeAclaraciones/CatalogoAclaracion'
import CatalogoSucursalMesa from './CompMesaDeAclaraciones/CatalogoSucursalMesa'
import CatalogoConceptos from './CompMesaDeAclaraciones/CatalogoConceptos'
import CatalogoBonificacion from './CompMesaDeAclaraciones/CatalogoBonificacion'
import CatalogoAnalistaSucursal from './CompMesaDeAclaraciones/CatalogoAnalistaSucursal'
import CatalogoTurno from './CompMesaDeAclaraciones/CatalogoTurno'
import { AutorizacionesTipos, CodigosAutorizacion } from '../catalogos/CompCatalogos'

const ModuloID: number = 1022

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
                    <Route path="/app/:productoId/mesadeaclaraciones/Bitacora" component={Bitacora} />
                    <Route path="/app/:productoId/mesadeaclaraciones/CatalogoTipoMovimiento" component={CatalogoTipoMovimiento} />
                    <Route path="/app/:productoId/mesadeaclaraciones/CatalogoTipoSolicitud" component={CatalogoTipoSolicitud} />
                    <Route path="/app/:productoId/mesadeaclaraciones/CatalogoMesaAclaracion" component={CatalogoMesaAclaracion} />
                    <Route path="/app/:productoId/mesadeaclaraciones/CatalogoAnalistas" component={CatalogoAnalistas} />
                    <Route path="/app/:productoId/mesadeaclaraciones/CatalogoEncargados" component={CatalogoEncargados} />
                    <Route path="/app/:productoId/mesadeaclaraciones/CatalogoProdMesaAclaracion" component={CatalogoProdMesaAclaracion} />
                    <Route path="/app/:productoId/mesadeaclaraciones/CatalogoEstatus" component={CatalogoEstatus} />
                    <Route path="/app/:productoId/mesadeaclaraciones/CatalogoBonificacion" component={CatalogoBonificacion} />
                    <Route path="/app/:productoId/mesadeaclaraciones/CatalogoConceptos" component={CatalogoConceptos} />
                    <Route path="/app/:productoId/mesadeaclaraciones/CatalogoAclaracion" component={CatalogoAclaracion} />
                    <Route path="/app/:productoId/mesadeaclaraciones/CatalogoSucursalMesa" component={CatalogoSucursalMesa} />
                    <Route path="/app/:productoId/mesadeaclaraciones/CatalogoAnalistaSucursal" component={CatalogoAnalistaSucursal} />
                    <Route path="/app/:productoId/mesadeaclaraciones/CatalogoTurno" component={CatalogoTurno} />
                    <Route path="/app/:productoId/mesadeaclaraciones/Pago/AutorizacionesTipos" component={AutorizacionesTipos} />
                    <Route path="/app/:productoId/mesadeaclaraciones/Pago/CodigosAutorizacion" component={CodigosAutorizacion} />


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