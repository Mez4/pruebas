import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router'
import { IOidc } from '../../../../interfaces/oidc/IOidc'

import { IEstado } from '../../../../interfaces/redux/IEstado'

import CatalogoArchivoDispersion from './CompCatalogos/CatalogoArchivoDispersion'
import CatalogoAsignaDocumentos from './CompCatalogos/CatalogoAsignaDocumentos'
import CatalogoDenominacionMoneda from './CompCatalogos/CatalogoDenominacionMoneda'
import CatalogoListaDocumentos from './CompCatalogos/CatalogoListaDocumentos'
import CatalogoMsjAceptadoRechazado from './CompCatalogos/CatalogoMsjAceptadoRechazado'
import CatalogoMesaCredito from './CompCatalogos/CatalogoMesaCredito'
import { BuroInternoEstatus, CatalogoAsentamiento, CatalogoAvalTipo, CatalogoCiudadEstado, CatalogoEscolaridad, CatalogoEstadoCivil, CatalogoLineaAdicionalTipo, CatalogoOcupacion, CatalogoSexo, CatalogoTipoDocumento, CatalogoTipoOrientacionVialidad, CatalogoTipoVialidad, CatalogoTipoVivienda, CatalogoVariableGlobal, EstadoPais, EventosTipos, IdentificacionesTipos, PagareEstatus, ReferenciasTipos, CatalogoEmpresa, CatalogoSucursal, CatalogoEstatusCredito, CatalogoSucursalFisica, AutorizacionesTipos, CodigosAutorizacion, EstatusConsultaBuro,CatalogoZonas,CatalogoDirectores } from './CompCatalogos'
import { Header } from './Header'
import { iUI } from '../../../../interfaces/ui/iUI'
import CatalogoEstadosCoordinador from './CompCatalogos/CatalogoEstadosCoordinadores'
import CatalogoEstatusConsultaBuro from './CompCatalogos/CatalogoEstatusConsultaBuro'
import { useAccesoAdministracion } from '../../../hooks/useAccesoAdministracion'
import CatalogoZonasSucursales from './CompCatalogos/CatalogoZonasSucursales'

/** Data type for the app */
type CatalogosType = { location: any, oidc: IOidc, ui: iUI }

// Definimos el ID del modulo
const ModuloID = 5

const Catalogos = (props: CatalogosType) => {

    // Protegemos el acceso al modulo
    useAccesoAdministracion(ModuloID)

    // Render de nuestrom componente
    return (
        <React.Fragment>
            <div>
                <Switch>
                    <Route path="/app/catalogos/ubicaciones/ciudades" component={CatalogoCiudadEstado} />
                    <Route path="/app/catalogos/ubicaciones/estadosPais" component={EstadoPais} />
                    <Route path="/app/catalogos/ubicaciones/vialidades/vialidadTipos" component={CatalogoTipoVialidad} />
                    <Route path="/app/catalogos/ubicaciones/vialidades/orientacionVialidadTipos" component={CatalogoTipoOrientacionVialidad} />
                    <Route path="/app/catalogos/ubicaciones/asentamientos" component={CatalogoAsentamiento} />
                    <Route path="/app/catalogos/ubicaciones/viviendasTipos" component={CatalogoTipoVivienda} />

                    <Route path="/app/catalogos/persona/documentosTipos" component={CatalogoTipoDocumento} />
                    <Route path="/app/catalogos/persona/IdentificacionesTipos" component={IdentificacionesTipos} />
                    <Route path="/app/catalogos/persona/estadoCivilTipo" component={CatalogoEstadoCivil} />
                    <Route path="/app/catalogos/persona/escolaridades" component={CatalogoEscolaridad} />
                    <Route path="/app/catalogos/persona/ocupaciones" component={CatalogoOcupacion} />
                    <Route path="/app/catalogos/persona/sexo" component={CatalogoSexo} />

                    <Route path="/app/catalogos/sistema/variablesGlobales" component={CatalogoVariableGlobal} />
                    <Route path="/app/catalogos/sistema/EventosTipos" component={EventosTipos} />

                    <Route path="/app/catalogos/credito/avalesTipos" component={CatalogoAvalTipo} />
                    <Route path="/app/catalogos/credito/lineaAdicionalTipo" component={CatalogoLineaAdicionalTipo} />
                    <Route path="/app/catalogos/credito/BuroInternoEstatus" component={BuroInternoEstatus} />
                    <Route path="/app/catalogos/credito/PagareEstatus" component={PagareEstatus} />
                    <Route path="/app/catalogos/credito/ReferenciasTipos" component={ReferenciasTipos} />
                    <Route path="/app/catalogos/credito/EstatusCredito" component={CatalogoEstatusCredito} />
                    <Route path="/app/catalogos/credito/CatalogoEstadoCoordinador" component={CatalogoEstadosCoordinador} />
                    <Route path="/app/catalogos/credito/CatalogoEstatusConsultaBuro" component={CatalogoEstatusConsultaBuro} />
                    <Route path="/app/catalogos/pago/AutorizacionesTipos" component={AutorizacionesTipos} />
                    <Route path="/app/catalogos/pago/CodigosAutorizacion" component={CodigosAutorizacion} />

                    <Route path="/app/catalogos/empresa/Empresas" component={CatalogoEmpresa} />
                    <Route path="/app/catalogos/empresa/Sucursales" component={CatalogoSucursal} />
                    <Route path="/app/catalogos/empresa/SucursalesFisica" component={CatalogoSucursalFisica} />
                    <Route path="/app/catalogos/empresa/MensajesAceptadoRechazado" component={CatalogoMsjAceptadoRechazado} />
                    <Route path="/app/catalogos/empresa/Zonas" component={CatalogoZonas} />
                    <Route path="/app/catalogos/empresa/CatalogoZonasSucursales" component={CatalogoZonasSucursales} />
                    <Route path="/app/catalogos/empresa/Directores" component={CatalogoDirectores} />

                    <Route path="/app/catalogos/empresa/DenominacionMoneda" component={CatalogoDenominacionMoneda} />
                    <Route path="/app/catalogos/empresa/ArchivoDispersion" component={CatalogoArchivoDispersion} />
                    <Route path="/app/catalogos/empresa/CatalogoListaDocumentos" component={CatalogoListaDocumentos} />
                    <Route path="/app/catalogos/empresa/AsignaDocumentos" component={CatalogoAsignaDocumentos} />


                    <Route path="/app/catalogos/mesacredito/MesaCredito" component={CatalogoMesaCredito} />

                    <Route path="/app/catalogos/CompCatalogos/CatalogoEstatusConsultaBuro" component={CatalogoEstatusConsultaBuro} />

                    <Route render={() => <span>Redirect nivel de modulo</span>} />

                </Switch>
            </div>
        </React.Fragment>
    )
}

// <React.Fragment>
// <Header oidc={props.oidc} pathname={props.location.pathname} ui={props.ui} />
// </React.Fragment>

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI
})

const MapDispatchToProps = (dispatch: any) => ({

})

export default connect(mapStateToProps, MapDispatchToProps)(Catalogos)