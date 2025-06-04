import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router'
import { IEstado } from '../../../../interfaces/redux/IEstado'
//import { Header } from './Header'

import { iUI } from '../../../../interfaces/ui/iUI'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import ConsultarCobranzaAppMovil from './CompCobranza/ConsultarCobranzaAppMovil'
import CatalogoClasificador from './CompCobranza/CatalogoClasificador'
import CatalogoMotivos from './CompCobranza/CatalogoMotivos'
import CatalogoMesaCobranza from './CompCobranza/CatalogoMesaCobranza'
import CatalogoAnalistasCobranza from './CompCobranza/CatalogoAnalistasCobranza'

import CatalogoEncargados from './CompCobranza/CatalogoEncargados'
import CatalogoGestoresCobranza from './CompCobranza/CatalogoGestoresCobranza'

import CatalogoTabDiasMora from './CompCobranza/CatalogoTabDiasMora'
import RelacionMesaCobranza from './CompCobranza/RelacionMesaCreditoProducto'
import { useAccesoProducto } from '../../../hooks/useAccesoProducto'

import Distribuidores from './CompCobranza/RelacionMesaCreditoProducto/Distribuidores'
import Bitacora from './CompCobranza/Bitacora'
import CatalogoProcesosBitacora from './CompCobranza/CatalogoProcesosBitacora'
import ListaAsignarDistribuidor from './CompCobranza/RelacionMesaCreditoProducto/CFormListaAsignarDistribuidor'
import CarteraGestores from './CompCobranza/CarteraGestores'

import GestoresDistribuidores from './CompCobranza/CarteraGestores/GestoresDistribuidores'

import DistribuidoresClientes from './CompCobranza/CarteraGestores/DistribuidoresClientes'
import { ConciliacionTickets } from './CompCobranza'

const ModuloID: number = 20


/** Data type for the app */
type CobranzaType = {
    oidc: IOidc,
    ui: iUI,
    location: any
}
const Cobranza = (props: CobranzaType) => {
    useAccesoProducto(ModuloID)
    console.log("PROPS BASE ,", props.ui)

    return (
        <>

            <div>
                <Switch>
                    <Route path="/app/:productoId/cobranza/ConciliacionTickets" component={ConciliacionTickets} />
                    <Route path="/app/:productoId/cobranza/ConsultarCobranzaAppMovil" component={ConsultarCobranzaAppMovil} />
                    <Route path="/app/:productoId/cobranza/Clasificador" component={CatalogoClasificador} />
                    <Route path="/app/:productoId/cobranza/Motivos" component={CatalogoMotivos} />
                    <Route path="/app/:productoId/cobranza/Encargados" component={CatalogoEncargados} />
                    <Route path="/app/:productoId/cobranza/Gestores" component={CatalogoGestoresCobranza} />
                    <Route path="/app/:productoId/cobranza/MesaCobranza" component={CatalogoMesaCobranza} />
                    <Route path="/app/:productoId/cobranza/TabDiasMora" component={CatalogoTabDiasMora} />
                    <Route path="/app/:productoId/cobranza/RelacionMesaCobranza" component={RelacionMesaCobranza} />
                    <Route path="/app/:productoId/cobranza/Distribuidores/:id" component={Distribuidores} />
                    <Route path="/app/:productoId/cobranza/Bitacora/" component={Bitacora} />
                    <Route path="/app/:productoId/cobranza/ListaAsignarDistribuidor/:id" component={ListaAsignarDistribuidor} />
                    <Route path="/app/:productoId/cobranza/CarteraGestores" component={CarteraGestores} />
                    <Route path="/app/:productoId/cobranza/GestoresDistribuidores/:id" component={GestoresDistribuidores} />
                    <Route path="/app/:productoId/cobranza/CatalogoProcesosBitacora/" component={CatalogoProcesosBitacora}/>
                    <Route path="/app/:productoId/cobranza/CatalogoAnalistasCobranza/" component={CatalogoAnalistasCobranza}/>
                    {/* <Route path="/app/:productoId/cobranza/DistribuidoresClientes/:id" component={DistribuidoresClientes} /> */}
                    <Route render={() => <span>Redirect nivel de modulo</span>} />
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

export default connect(mapStateToProps, MapDispatchToProps)(Cobranza)

