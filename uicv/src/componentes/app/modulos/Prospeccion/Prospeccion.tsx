import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router'

import { IEstado } from '../../../../interfaces/redux/IEstado'


import { Header } from './Header'



import { iUI } from '../../../../interfaces/ui/iUI'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import Prospectos, { TipoPersonas } from './CompProspeccion/Prospectos'
import CatalogoStatusProceso from './CompProspeccion/CatalogoStatusProceso'
import CatalogoTipoDocumento from './CompProspeccion/CatalogoTipoDocumento'
import CatalogoTipoDocumentoAval from './CompProspeccion/CatalogoTipoDocumentoAval'
import CatalogoMesaDeCredito from './CompProspeccion/CatalogoMesaDeCredito'
import CatalogoProductoMesaCredito from './CompProspeccion/CatalogoProductoMesaCredito'
import CatalogoMesaCreditoIndex from './CompProspeccion/CatalogoMesaCreditoIndex'
import CatalogoAnalistas from './CompProspeccion/CatalogoAnalistas'
import CatalogoDirectores from './CompProspeccion/CatalogoDirectores'
import { CatalogoMensajes, CatalogoTiposPersona } from './CompProspeccion'
import CatalogoTipoPersonaPrueba from './CompProspeccion/CatalogoTipoPersonaPrueba'
import { CatalogoTipoVivienda } from './CompProspeccion'
import { CatalogoTuberiaResultado } from './CompProspeccion'
import { CatalogoEstatusAsignacion } from './CompProspeccion'
import { CatalogoEstatusValidacion } from './CompProspeccion'
import { CatalogoMatrizProcesos } from './CompProspeccion'
import { CatalogoEmpresasExperiencia } from './CompProspeccion'
import { MatrizProcesosDetalle } from './CompProspeccion'
import { RevisionBuro } from './CompProspeccion'
import { CatalogoNiveles } from './CompProspeccion'

import Prospecto from './CompProspeccion/Prospectos/prospecto'
import { useAccesoProducto } from '../../../hooks/useAccesoProducto'
import MesaLlamadas from './CompProspeccion/MesaLlamadas'
import ProspectosCatalogo from './CompProspeccion/ProspectosCatalogo'
import ReasignarProspectoInteresado from './CompProspeccion/ReasignarProspectoInteresado'
import TiempoPorProceso from './CompProspeccion/TiempoPorProceso'
import Archivados from './CompProspeccion/Archivados'


const ModuloID: number = 16

/** Data type for the app */
type ProspeccionType = {
    oidc: IOidc,
    ui: iUI,
    location: any
}
const Prospeccion = (props: ProspeccionType) => {
    useAccesoProducto(ModuloID)
    console.log("PROPS BASE ,", props.ui)

    return (
        
        <>
            <div>
                <Switch>
                    <Route path="/app/:productoId/prospeccion/TiposPersona" component={CatalogoTiposPersona} />
                    <Route path="/app/:productoId/prospeccion/TiposPersonaPrueba" component={CatalogoTipoPersonaPrueba} />
                    <Route path="/app/:productoId/prospeccion/TipoVivienda" component={CatalogoTipoVivienda} />
                    <Route path="/app/:productoId/prospeccion/TuberiaResultado" component={CatalogoTuberiaResultado} />
                    <Route path="/app/:productoId/prospeccion/EstatusAsignacion" component={CatalogoEstatusAsignacion} />
                    <Route path="/app/:productoId/prospeccion/EstatusValidacion" component={CatalogoEstatusValidacion} />
                    <Route path="/app/:productoId/prospeccion/MatrizProcesos" component={CatalogoMatrizProcesos} />
                    <Route path="/app/:productoId/prospeccion/EmpresasExperiencia" component={CatalogoEmpresasExperiencia} />
                    <Route path="/app/:productoId/prospeccion/Mensajes" component={CatalogoMensajes} />
                    <Route path="/app/:productoId/Prospeccion/Prospectos" render={() => (<Prospectos key="com_admin_prospectos" TipoPersonas={TipoPersonas.Prospecto} />)} />
                    <Route path="/app/:productoId/Prospeccion/ProspectosCatalogo" render={() => (<ProspectosCatalogo key="com_admin_prospectos_c" TipoPersonas={TipoPersonas.Prospecto} />)} />
                    
                    
                    <Route path="/app/:productoId/prospeccion/Prospecto/:id" render={() => (<Prospecto key="com_admin_prospecto" ui={props.ui} />)} />
                    <Route path="/app/:productoId/prospeccion/StatusProceso" component={CatalogoStatusProceso} />
                    <Route path="/app/:productoId/prospeccion/Niveles" component={CatalogoNiveles} />
                    <Route path="/app/:productoId/prospeccion/TipoDocumento" component={CatalogoTipoDocumento} />
                    <Route path="/app/:productoId/prospeccion/TipoDocumentoAval" component={CatalogoTipoDocumentoAval} />
                    <Route path="/app/:productoId/prospeccion/MesaDeCredito" component={CatalogoMesaDeCredito} />
                    <Route path="/app/:productoId/prospeccion/ProductoMesaDeCredito" component={CatalogoProductoMesaCredito} />
                    <Route path="/app/:productoId/prospeccion/MatrizProcesosDetalle" component={MatrizProcesosDetalle} />
                    <Route path="/app/:productoId/prospeccion/TiempoProcesos" component={TiempoPorProceso} />
                    <Route path="/app/:productoId/prospeccion/MesaDeCreditoIndex" component={CatalogoMesaCreditoIndex} />
                    <Route path="/app/:productoId/prospeccion/Archivados" component={Archivados} />
                    <Route path="/app/:productoId/prospeccion/RevisionBuro" component={RevisionBuro} />
                    <Route path="/app/:productoId/prospeccion/MesaLlamadas" component={MesaLlamadas} />
                    <Route path="/app/:productoId/prospeccion/Analistas" component={CatalogoAnalistas} />
                    <Route path="/app/:productoId/prospeccion/Encargados" component={CatalogoDirectores} />

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

export default connect(mapStateToProps, MapDispatchToProps)(Prospeccion)

