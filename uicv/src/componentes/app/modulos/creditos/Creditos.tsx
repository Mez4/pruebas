import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router'
import { IOidc } from '../../../../interfaces/oidc/IOidc'

import { IEstado } from '../../../../interfaces/redux/IEstado'
import { iUI } from '../../../../interfaces/ui/iUI'

import {
    CreditoNivelesProducto,
    CreditoNiveles,
    CreditoGestor,
    CreditoPromotor,
    CreditoTasaTipo,
    CreditoMotivoCancelacion,
    CreditoComision,
    CreditoCondicion,
    CreditoComisionSucursal2,
    CreditoCondicionSucursal,
    CreditoProducto,
    CreditoRelaciones,
    CreditoRelacionesHistorico,
    CreditoVale,
    CreditoTiendita,
    CreditoCredito,
    CreditoCreditoPersonal,
    CreditoAplicaPago,
    CreditoAplicaPagoAclaraciones,
    CreditoAplicaPagoAclaracionesRestante,
    CreditoAplicaPagoCliente,
    CreditoMonederoMecanicas,
    CreditoClasificadorGrupos,
    CreditoEmpleados,
    CreditoGrupo,
    CreditoGrupoUsuarios,
    CreditoGlobal,
    CreditoValeDigital,
    ReestructuraRelacion,
    ReestructuraCliente,
    TiposReestructura,
    EstatusReestructura,
    PlazosReestructura,
    ReestructuraSolicitudes,
    EncargadosReestructura,
    AnalistasReestructura,
    CreditoRelacionesRecalculo,
    CreditoAplicaciones,
    CreditoAplicaPagoDNI,
    CreditoProteccionesCabecero,
    CreditoProteccionesPaquete,
    CreditoNotasRapidas,
    CreditoSolicitudAumentoNivel,
    CreditoDistPagosVencimiento,
    CreditoCierreValesDist,
    CreditoCumpleanosDistribuidor,
    CreditoDetallesRelacion,
    CreditoDescargas,
    CreditoSolicitudIncrementos,
    CreditoMonederoAsignarMecanicas,
    CreditoCobranzaGlobal,
    CreditoReporteActivaciones,
    CreditoGrupoReasignar,
    SolicitudConveniosReestructuras,
    CreditoColocacion,
    CreditoColocacionSocia,
    CreditoValesDesembolsados,
    AplicacionesSocia,
    CreditoReporteConvenios,
    ReporteCreditoTiendita,
    DistribucionPlanPagos,
    CreditoCapitalPendientealDia,


    GeneradorReportes,
    CreditoSolicitudPrimerCanje,
    GeneradorSpei,
    ConsultasSpei,
    TabComisiones,
    TabTasasPlazos,
    IncrementosDecrementosCsv,
    CreditoAplicaPagoClienteTickets
} from './CompCreditos'

import { useAccesoProducto } from '../../../hooks/useAccesoProducto'
import CreditosSolicitudCreditosPersonales from './CompCreditos/CreditosSolicitudCreditosPersonales'
import CreditoSolicitudPrestamosPersonales from './CompCreditos/CreditoSolicitudPrestamosPersonales'
import CreditoTienditaSocia from './CompCreditos/CreditoTienditaSocia'
import CreditoMesaCredito from './CompCreditos/CreditoMesaCredito'
import AplicacionesCajera from './CompCreditos/AplicacionesCajera'
import CreditoCierreValesDistVencimiento from './CompCreditos/CreditoCierreValesDistVencimiento'
import CreditoLineasDistribuidoras from './CompCreditos/CreditoLineasDistribuidoras'
import CreditoCierreValesDistVencimiento2 from './CompCreditos/CreditoCierreValesDistVencimiento2'
import CreditoGlobalNuevo2 from './CompCreditos/CreditoGlobalNuevo2'
import CreditoAplicacionesDNI from './CompCreditos/CreditoAplicacionesDNI'
import CreditoAplicacionesCanalesPago from './CompCreditos/CreditoAplicacionesCanalesPago'
import AplicacionesClientes from './CompCreditos/AplicacionesClientes'
import CreditoAplicaPagoClienteAclaraciones from './CompCreditos/CreditoAplicaPagoClienteAclaraciones'
import CreditoTienditaCodigos from './CompCreditos/CreditoTienditaCodigos'
import CreditoReporteTienditasComisiones from './CompCreditos/CreditoReporteTienditasComisiones'
import CreditoVentaContado from './CompCreditos/CreditoVentaContado'
import CreditoAplicaPagoTicket from './CompCreditos/CreditoAplicaPagoTicket'
import CreditoAplicacionTicketMasivos from './CompCreditos/CreditoAplicacionTicketMasivos'
import CreditoCreditoTiendita from './CompCreditos/CreditoCreditoTiendita'
import CreditoGlobalNuevo from './CompCreditos/CreditoGlobalNuevo'
import CreditoTienditaMonedero from './CompCreditos/CreditoTienditaMonedero'
import CreditoGerente from './CompCreditos/CreditoGerente'
import CreditoCoordinador from './CompCreditos/CreditoCoordinador'
import CreditoAdministrarTicket from './CompCreditos/CreditoAdministrarTicket'

const ModuloID: number = 7

/** Data type for the app */
type CatalogosType = {
    oidc: IOidc,
    location: any,
    ui: iUI
}
const Creditos = (props: CatalogosType) => {

    useAccesoProducto(ModuloID)

    return (
        <React.Fragment>
            <div>
                {/* <Header pathname={props.location.pathname} oidc={props.oidc} ui={props.ui} /> */}
                {/* <div className="mt-lg-5 p-3"> */}
                <Switch>
                    {/* <Route path="/app/creditos/catalogos/productos" component={CreditoProducto} />
                    <Route path="/app/creditos/catalogos/gestores" component={CreditoGestor} />
                    <Route path="/app/creditos/catalogos/promotores" component={CreditoPromotor} />
                    <Route path="/app/creditos/catalogos/tasastipos" component={CreditoTasaTipo} />
                    <Route path="/app/creditos/catalogos/motivoscancelaciones" component={CreditoMotivoCancelacion} />
                    <Route path="/app/creditos/catalogos/comisiones" component={CreditoComision} />
                    <Route path="/app/creditos/catalogos/condiciones" component={CreditoCondicion} />
                    <Route path="/app/creditos/catalogos/sucursalcondiciones" component={CreditoCondicionSucursal} />
                    <Route path="/app/creditos/vales/capturavales" component={CreditoVale} />
                    <Route path="/app/creditos/vales/creditosempleados" component={CreditoEmpleados} />
                    <Route path="/app/creditos/cortes/creditorelaciones" component={CreditoRelaciones} />
                    <Route path="/app/creditos/vales/tiendita" component={CreditoTiendita} />
                    <Route path="/app/creditos/creditos" component={CreditoCredito} />
                    <Route path="/app/creditos/cortes/pagos" component={CreditoAplicaPago} />
                    <Route path="/app/creditos/cortes/pagoscliente" component={CreditoAplicaPagoCliente} />
                    <Route path="/app/creditos/catalogos/clasificadorgrupos" component={CreditoClasificadorGrupos} />
                    <Route path="/app/creditos/credito/CreditoEmpleados" component={CreditoEmpleados} />
                    <Route path="/app/creditos/catalogos/creditoGrupo" component={CreditoGrupo} />
                    <Route path="/app/creditos/catalogos/CreditoGrupoUsuarios" component={CreditoGrupoUsuarios} /> */}
                    <Route path="/app/:productoId/creditos/CreditoGlobal" component={CreditoGlobal} />
                    <Route path="/app/:productoId/creditos/catalogos/productos" component={CreditoProducto} />
                    <Route path="/app/:productoId/creditos/catalogos/tiposReestructura" component={TiposReestructura} />
                    <Route path="/app/:productoId/creditos/catalogos/estatusReestructura" component={EstatusReestructura} />
                    <Route path="/app/:productoId/creditos/catalogos/plazosReestructura" component={PlazosReestructura} />
                    <Route path="/app/:productoId/creditos/catalogos/encargadosReestructura" component={EncargadosReestructura} />
                    <Route path="/app/:productoId/creditos/catalogos/analistasReestructura" component={AnalistasReestructura} />
                    <Route path="/app/:productoId/creditos/catalogos/gestores" component={CreditoGestor} />
                    <Route path="/app/:productoId/creditos/catalogos/promotores" component={CreditoPromotor} />
                    <Route path="/app/:productoId/creditos/catalogos/gerentes" component={CreditoGerente} />
                    <Route path="/app/:productoId/creditos/catalogos/coordinadores" component={CreditoCoordinador} />
                    <Route path="/app/:productoId/creditos/catalogos/tasastipos" component={CreditoTasaTipo} />
                    <Route path="/app/:productoId/creditos/catalogos/motivoscancelaciones" component={CreditoMotivoCancelacion} />
                    <Route path="/app/:productoId/creditos/catalogos/comisiones" component={CreditoComision} />
                    <Route path="/app/:productoId/creditos/catalogos/condiciones" component={CreditoCondicion} />
                    <Route path="/app/:productoId/creditos/catalogos/sucursalcomisiones2" component={CreditoComisionSucursal2} />
                    <Route path="/app/:productoId/creditos/catalogos/sucursalcondiciones" component={CreditoCondicionSucursal} />
                    <Route path="/app/:productoId/creditos/protecciones/paquetes" component={CreditoProteccionesPaquete} />
                    <Route path="/app/:productoId/creditos/protecciones/cabecero" component={CreditoProteccionesCabecero} />
                    <Route path="/app/:productoId/creditos/vales/capturavales" component={CreditoVale} />
                    <Route path="/app/:productoId/creditos/vales/creditosempleados" component={CreditoEmpleados} />
                    <Route path="/app/:productoId/creditos/cortes/creditorelaciones" component={CreditoRelaciones} />
                    <Route path="/app/:productoId/creditos/cortes/CreditoRelacionesHistorico" component={CreditoRelacionesHistorico} />
                    <Route path="/app/:productoId/creditos/cortes/CreditoRelacionesRecalculo" component={CreditoRelacionesRecalculo} />
                    <Route path="/app/:productoId/creditos/vales/tiendita" component={CreditoTiendita} />
                    <Route path="/app/:productoId/creditos/creditos" component={CreditoCredito} />
                    <Route path="/app/:productoId/creditos/creditosTiendita" component={CreditoCreditoTiendita} />
                    <Route path="/app/:productoId/creditos/creditosPersonal" component={CreditoCreditoPersonal} />
                    <Route path="/app/:productoId/creditos/cortes/pagos" component={CreditoAplicaPago} />
                    <Route path="/app/:productoId/creditos/cortes/pagosaclaraciones" component={CreditoAplicaPagoAclaraciones} />
                    <Route path="/app/:productoId/creditos/cortes/reestructurarelacion" component={ReestructuraRelacion} />
                    <Route path="/app/:productoId/creditos/cortes/reestructuracliente" component={ReestructuraCliente} />
                    <Route path="/app/:productoId/creditos/cortes/reestructuraSolicitudes" component={ReestructuraSolicitudes} />
                    <Route path="/app/:productoId/creditos/cortes/pagoscliente" component={CreditoAplicaPagoCliente} />
                    <Route path="/app/:productoId/creditos/cortes/pagosclienteaclaraciones" component={CreditoAplicaPagoClienteAclaraciones} />
                    <Route path="/app/:productoId/creditos/cortes/pagosclientetickets" component={CreditoAplicaPagoClienteTickets} />
                    <Route path="/app/:productoId/creditos/cortes/CreditoAplicacionTicketMasivos" component={CreditoAplicacionTicketMasivos} />
                    <Route path="/app/:productoId/creditos/cortes/CreditoAplicaPagoAclaracionesRestante" component={CreditoAplicaPagoAclaracionesRestante} />
                    <Route path="/app/:productoId/creditos/monedero/mecanicas" component={CreditoMonederoMecanicas} />
                    <Route path="/app/:productoId/creditos/monedero/asignarMecanicas" component={CreditoMonederoAsignarMecanicas} />
                    <Route path="/app/:productoId/creditos/catalogos/clasificadorgrupos" component={CreditoClasificadorGrupos} />
                    <Route path="/app/:productoId/creditos/credito/CreditoEmpleados" component={CreditoEmpleados} />
                    <Route path="/app/:productoId/creditos/catalogos/creditoGrupo" component={CreditoGrupo} />
                    <Route path="/app/:productoId/creditos/catalogos/creditoGrupoReasignar" component={CreditoGrupoReasignar} />
                    <Route path="/app/:productoId/creditos/catalogos/CreditoGrupoUsuarios" component={CreditoGrupoUsuarios} />
                    <Route path="/app/:productoId/creditos/vales/canjevaledigital" component={CreditoValeDigital} />
                    <Route path="/app/:productoId/creditos/cortes/creditoaplicaciones" component={CreditoAplicaciones} />
                    <Route path="/app/:productoId/creditos/AplicacionesSocia" component={AplicacionesSocia} />
                    <Route path="/app/:productoId/creditos/cortes/aplicacionescajera" component={AplicacionesCajera} />
                    <Route path="/app/:productoId/creditos/cortes/CreditoAplicacionesDNI" component={CreditoAplicacionesDNI} />
                    <Route path="/app/:productoId/creditos/cortes/CreditoAdministrarTicket" component={CreditoAdministrarTicket} />
                    <Route path="/app/:productoId/creditos/cortes/CreditoAplicacionesTickets" component={CreditoAplicaPagoTicket} />
                    <Route path="/app/:productoId/creditos/cortes/creditoaplicapagodni" component={CreditoAplicaPagoDNI} />
                    <Route path="/app/:productoId/creditos/cortes/creditoaplicacionescanalespago" component={CreditoAplicacionesCanalesPago} />
                    <Route path="/app/:productoId/creditos/catalogos/CreditoNiveles" component={CreditoNiveles} />
                    <Route path="/app/:productoId/creditos/catalogos/CreditoNivelesProducto" component={CreditoNivelesProducto} />
                    <Route path="/app/:productoId/creditos/reportes/DistPagosVencimiento" component={CreditoDistPagosVencimiento} />
                    <Route path="/app/:productoId/creditos/reportes/CierreValesDist" component={CreditoCierreValesDist} />
                    {/* <Route path="/app/:productoId/creditos/reportes/CreditoCierreValesDistVencimiento" component={CreditoCierreValesDistVencimiento} /> */}
                    <Route path="/app/:productoId/creditos/reportes/CreditoCierreValesDistVencimiento2" component={CreditoCierreValesDistVencimiento2} />
                    <Route path="/app/:productoId/creditos/reportes/CreditoGlobalNuevo2" component={CreditoGlobalNuevo2} />
                    <Route path="/app/:productoId/creditos/reportes/CobranzaGlobal" component={CreditoCobranzaGlobal} />
                    <Route path="/app/:productoId/creditos/reportes/CreditoReporteActivaciones" component={CreditoReporteActivaciones} />
                    <Route path="/app/:productoId/creditos/reportes/CumpleanosDistribuidor" component={CreditoCumpleanosDistribuidor} />
                    <Route path="/app/:productoId/creditos/reportes/NotasRapidas" component={CreditoNotasRapidas} />
                    <Route path="/app/:productoId/creditos/reportes/DetallesRelacion" component={CreditoDetallesRelacion} />
                    <Route path="/app/:productoId/creditos/reportes/MesaCredito" component={CreditoMesaCredito} />
                    <Route path="/app/:productoId/creditos/SolicitudConveniosReestructuras" component={SolicitudConveniosReestructuras} />
                    <Route path="/app/:productoId/creditos/SolicitudIncrementos" component={CreditoSolicitudIncrementos} />
                    <Route path="/app/:productoId/creditos/CreditoSolicitudAumentoNivel" component={CreditoSolicitudAumentoNivel} />
                    <Route path="/app/:productoId/creditos/SolicitudCreditosPersonales" component={CreditosSolicitudCreditosPersonales} />
                    <Route path="/app/:productoId/creditos/CreditoSolicitudPrestamosPersonales" component={CreditoSolicitudPrestamosPersonales} />
                    <Route path="/app/:productoId/creditos/CreditoSolicitudPrimerCanje" component={CreditoSolicitudPrimerCanje} />
                    <Route path="/app/:productoId/creditos/CreditoTienditaSocia" component={CreditoTienditaSocia} />
                    <Route path="/app/:productoId/creditos/CreditoVentaContado" component={CreditoVentaContado} />
                    <Route path="/app/:productoId/creditos/CreditoTienditaMonedero" component={CreditoTienditaMonedero} />
                    <Route path="/app/:productoId/creditos/CreditoTienditaCodigos" component={CreditoTienditaCodigos} />
                    <Route path="/app/:productoId/creditos/reportes/CreditoColocacion" component={CreditoColocacion} />
                    <Route path="/app/:productoId/creditos/reportes/CreditoColocacionSocia" component={CreditoColocacionSocia} />
                    <Route path="/app/:productoId/creditos/reportes/ValesDesembolsados" component={CreditoValesDesembolsados} />
                    <Route path="/app/:productoId/creditos/cortes/AplicacionesCliente" component={AplicacionesClientes} />
                    <Route path="/app/:productoId/creditos/reportes/ReporteConvenios" component={CreditoReporteConvenios} />
                    <Route path="/app/:productoId/creditos/reportes/ReporteCreditoTiendita" component={ReporteCreditoTiendita} />

                    <Route path="/app/:productoId/creditos/CreditoSolicitudPrimerCanje" component={CreditoSolicitudPrimerCanje} />
                    <Route path="/app/:productoId/creditos/cortes/DistribucionPlanPagos" component={DistribucionPlanPagos} />
                    <Route path="/app/:productoId/creditos/reportes/CreditoCapitalPendientealDia" component={CreditoCapitalPendientealDia} />
                    <Route path="/app/:productoId/creditos/reportes/CreditoReporteTienditasComisiones" component={CreditoReporteTienditasComisiones} />
                    <Route path="/app/:productoId/creditos/GeneradorReportes" component={GeneradorReportes} />
                    <Route path="/app/:productoId/creditos/catalogos/TabComisiones" component={TabComisiones} />
                    <Route path="/app/:productoId/creditos/IncrementosDecrementosCsv" component={IncrementosDecrementosCsv} />
                    <Route path="/app/:productoId/creditos/catalogos/TabTasasPlazos" component={TabTasasPlazos} />
                    <Route path="/app/:productoId/creditos/Descargas" component={CreditoDescargas} />
                    <Route render={() => <span>Redirect nivel de modulo</span>} />
                </Switch>
                {/* </div> */}
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI
})

export default connect(mapStateToProps)(Creditos)