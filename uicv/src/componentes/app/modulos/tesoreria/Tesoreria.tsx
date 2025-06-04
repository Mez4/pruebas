import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router'
import { IEstado } from '../../../../interfaces/redux/IEstado'
import { CatalogoTipoCuenta, CatalogoTipoPoliza, DispersionSpei, MonedaSat, Multisaldos_General } from './CompTesoreria'
import AltaSolicitudesAnalista from './CompTesoreria/AltaSolicitudesAnalista'
import AdmCuentasBancariasMovimientos from './CompTesoreria/AdmCuentasBancariasMovimientos'
import BalanzaDeComprobacion from './CompTesoreria/BalanzaDeComprobacion'
import BovedasCaja from './CompTesoreria/BovedasCaja'
import CatalogoCuentasContables from './CompTesoreria/CatalogoCuentasContables'
import Polizas from './CompTesoreria/Polizas'
import MovimientosAgrupa from './CompTesoreria/MovimientosAgrupa'
import { Header } from './Header'
import CatalogoMovimientosCaja from './CompTesoreria/CatalogoMovimientosCaja'
import CatalogoTipoOperacionCaja from './CompTesoreria/CatalogoTipoOperacionCaja'
import CatalogoBoveda from './CompTesoreria/CatalogoBoveda'
import CatalogoCaja from './CompTesoreria/CatalogoCaja'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import Balance from './CompTesoreria/Balance2'
import Balance2 from './CompTesoreria/Balance2'
import BalanceFinal from './CompTesoreria/BalanceFinal'
import CatalogoCuentasBancariasPrincipal from './CompTesoreria/CatalogoCuentasBancariasPrincipal'
import CuentasAbonoCargo from './CompTesoreria/CuentasAbonoCargo'
import CuentaMovimientosCuenta from './CompTesoreria/CuentaMovimientosCuenta'
//import MultiSaldosV2 from './CompTesoreria/MultisaldosV2'
import BalanzasGeneradas from './CompTesoreria/BalanzasGeneradas'
//import MultiSaldos from './CompTesoreria/MultiSaldos'
//import MultisaldosCajas from './CompTesoreria/MultisaldosCajas'
import CerrarBalance from './CompTesoreria/CerrarBalance'
import { iUI } from '../../../../interfaces/ui/iUI'
import CatalogoConciliacion from './CompTesoreria/CatalogoConciliacion'
import CatalogoEstatusDispersion from './CompTesoreria/CatalogoEstatusDispersion'
import DetalleArchivoDispersion from './CompTesoreria/DetalleArchivoDispersion'
import ArchivosDeDispercion from './CompTesoreria/ArchivosDeDispercion'
import ArchivosDeDispercionODP from './CompTesoreria/ArchivosDeDispercionODP'
import CatalogoNaturaleza from './CompTesoreria/CatalogoNaturaleza'
import CierrePeriodo from './CompTesoreria/CierrePeriodo'
import ConciliacionPolizas from './CompTesoreria/ConciliacionPolizas'
import CajaDenominacionesMonedaCajera from './CompTesoreria/CajaDenominacionesMonedaCajera'
import CuentasPorCaja from './CompTesoreria/CuentasPorCaja'
import ReplicarCuentas from './CompTesoreria/ReplicarCuentas'
import RubrosGastos from './CompTesoreria/RubrosGastos'
import { DesembolsoFiniquito } from './CompTesoreria'
import BancoCuentas from './CompTesoreria/BancoCuentas'
import BancoTipoDesembolso from './CompTesoreria/BancoTipoDesembolso'
import BancoTipoDesembolsoSucursal from './CompTesoreria/BancoTipoDesembolsoSucursal'
import CatalogoTipoBancos from './CompTesoreria/CatalogoTipoBancos'
import BancoBancos from './CompTesoreria/BancoBancos'
import { useAccesoProducto } from '../../../hooks/useAccesoProducto'
import AltaSolicitudGastos from './CompTesoreria/AltaSolicitudGastos'
import AmortizarSolicitudGastos from './CompTesoreria/AmortizarSolicitudGastos'
import SolicitudesGastosCajera from './CompTesoreria/SolicitudesGastosCajera'
import CreditosDispersion from './CompTesoreria/CreditosDispersionH2H'
import CreditosDispersionSTP from './CompTesoreria/CreditosDispersionSTP'
import ConsultaDispersionH2H from './CompTesoreria/ConsultaDispersionH2H'
import ConsultaOrdenesH2H from './CompTesoreria/ConsultaOrdenesH2H'
import CuentasCobranzaEmpleados from './CompTesoreria/CuentasCobranzaEmpleados'
// import MultiSaldosBovedas from './CompTesoreria/MultiSaldosBovedas'
// import MultiSaldosArqueos from './CompTesoreria/MultiSaldosArqueos'
// import MultiSaldosCierreDiario from './CompTesoreria/MultiSaldosCierreDiario'
import CatalogoUniformes from './CompTesoreria/CatalogoUniformes'
import CatalogoColores from './CompTesoreria/CatalogoColores'
import CatalogoCortes from './CompTesoreria/CatalogoCortes'
import CatalogoTallas from './CompTesoreria/CatalogoTallas'
import CatalogoTipos from './CompTesoreria/CatalogoTipos'
import CatalogosolicitudUniforme from './CompTesoreria/CatalogosolicitudUniforme'
import CatalogoAprobacionSolicitudUniforme from './CompTesoreria/CatalogoAprobacionSolicitudUniforme'
import CatalogoSolicitudOrdenCompra from './CompTesoreria/CatalogoSolicitudOrdenCompra'
import CatalogoProcesoSurtido from './CompTesoreria/CatalogoProcesoSurtido'
import CatalogoRecepcionUniforme from './CompTesoreria/CatalogoRecepcionUniforme'
import SolicitudesAclaraciones from '../aclaraciones/CompAclaraciones/SolicitudesAclaraciones'
import CajasUsuarios from './CompTesoreria/CajasUsuarios'
import Inventario from './CompTesoreria/Inventario'
import TraspasoEntreCuentas from './CompTesoreria/TraspasoEntreCuentas'
import TraspasoEntreCuentasZonales from './CompTesoreria/TraspasoEntreCuentasZonales'
import ConciliaDispersionH2H from './CompTesoreria/ConciliaDispersionH2H'
import Corresponsales from './CompTesoreria/Corresponsales'
import CorresponsalesTipoComision from './CompTesoreria/CorresponsalesTipoComision'
import SucursalesDetalle from './CompTesoreria/SucursalesDetalle'
import HistorialContratos from './CompTesoreria/HistorialContratos'
import ArqueoDesembolso from './CompTesoreria/ArqueoDesembolso'
import Convenios from './CompTesoreria/Convenios'
import ImprimirArqueoDesembolso from './CompTesoreria/ImprimirArqueoDesembolso'
// import MultiSaldosArqueosBovedas from './CompTesoreria/MultiSaldosArqueosBovedas'
import AsignarConvenios from './CompTesoreria/AsignarConvenios'
import BalanceFinalV2 from './CompTesoreria/BalanceFinalV2'
import TraspasoCajaBoveda from './CompTesoreria/TraspasoCajaBoveda'
import TraspasoEntreSistemas from './CompTesoreria/TraspasoEntreSistemas'
import BalanceFinalV3 from './CompTesoreria/BalanceFinalV3'
import { ConsultasSpei, GeneradorSpei } from '../creditos/CompCreditos'
import SpeiaEfectivo from './CompTesoreria/SpeiaEfectivo'
import CreditosTesoreria from './CompTesoreria/CreditosTesoreria'

const ModuloID: number = 13

/** Data type for the app */
type TesoreriaType = {
    oidc: IOidc,
    ui: iUI,
    location: any
}
const Tesoreria = (props: TesoreriaType) => {

    useAccesoProducto(ModuloID)

    return (
        <div className="">
            {/*                 <Header pathname={props.location.pathname} oidc={props.oidc} ui={props.ui} />
 */}
            <Switch>

                <Route path="/app/:productoId/tesoreria/CuentasBancarias" component={BancoCuentas} />
                <Route path="/app/:productoId/tesoreria/TipoDesembolso" component={BancoTipoDesembolso} />
                <Route path="/app/:productoId/tesoreria/TipoDesembolsoSucursal" component={BancoTipoDesembolsoSucursal} />
                <Route path="/app/:productoId/tesoreria/TipoBancos" component={CatalogoTipoBancos} />
                <Route path="/app/:productoId/tesoreria/Bancos" component={BancoBancos} />
                <Route path="/app/:productoId/tesoreria/CuentasBancariasPrincipal" component={CatalogoCuentasBancariasPrincipal} />
                <Route path="/app/:productoId/tesoreria/CuentasAbonoCargo" component={CuentasAbonoCargo} />CuentaMovimientosCuenta
                <Route path="/app/:productoId/tesoreria/CuentaMovimientosCuenta" component={CuentaMovimientosCuenta} />
                {/* <Route path="/app/:productoId/tesoreria/MultiSaldosV2" component={MultiSaldosV2} /> */}
                <Route path="/app/:productoId/tesoreria/CajaDenominacionesMonedaCajera" component={CajaDenominacionesMonedaCajera} />
                <Route path="/app/:productoId/tesoreria/CuentasPCaja" component={CuentasPorCaja} />
                <Route path="/app/:productoId/tesoreria/RubrosGastos" component={RubrosGastos} />
                <Route path="/app/:productoId/tesoreria/polizas" component={Polizas} />
                <Route path="/app/:productoId/tesoreria/admCuentasBancarias" component={AdmCuentasBancariasMovimientos} />
                <Route path="/app/:productoId/tesoreria/cajasBovedas" component={BovedasCaja} />
                <Route path="/app/:productoId/tesoreria/BalanzaDeComprobacion" component={BalanzaDeComprobacion} />
                <Route path="/app/:productoId/tesoreria/CerrarBalance" component={CerrarBalance} />
                <Route path="/app/:productoId/tesoreria/Balance" component={Balance} />
                <Route path="/app/:productoId/tesoreria/Multisaldos_General" component={Multisaldos_General} />
                {/* <Route path="/app/:productoId/tesoreria/MultiSaldos" component={MultiSaldos} /> */}
                {/* <Route path="/app/:productoId/tesoreria/MultiSaldosCaja" component={MultisaldosCajas} /> */}
                <Route path="/app/:productoId/tesoreria/catalogos/CuentasTipos" component={CatalogoTipoCuenta} />
                <Route path="/app/:productoId/tesoreria/catalogos/PolizasTipos" component={CatalogoTipoPoliza} />
                <Route path="/app/:productoId/tesoreria/catalogos/MonedasSat" component={MonedaSat} />
                <Route path="/app/:productoId/tesoreria/catalogos/AltaSolicitudAnalista" component={AltaSolicitudesAnalista} />
                <Route path="/app/:productoId/tesoreria/catalogos/MovimientosAgrupa" component={MovimientosAgrupa} />
                <Route path="/app/:productoId/tesoreria/catalogos/CatalogoNaturaleza" component={CatalogoNaturaleza} />
                <Route path="/app/:productoId/tesoreria/catalogos/CatalogosCuentasContables" component={CatalogoCuentasContables} />
                <Route path="/app/:productoId/tesoreria/catalogos/CatalogosBoveda" component={CatalogoBoveda} />
                <Route path="/app/:productoId/tesoreria/catalogos/CatalogosCaja" component={CatalogoCaja} />
                <Route path="/app/:productoId/tesoreria/catalogos/CatalogosMovimientosCaja" component={CatalogoMovimientosCaja} />
                <Route path="/app/:productoId/tesoreria/catalogos/CatalogoTipoOperacionCaja" component={CatalogoTipoOperacionCaja} />
                <Route path="/app/:productoId/tesoreria/catalogos/CierrePeriodo" component={CierrePeriodo} />
                <Route path="/app/:productoId/tesoreria/catalogos/BalanzasGeneradas" component={BalanzasGeneradas} />
                <Route path="/app/:productoId/tesoreria/catalogos/CatalogoConciliacion" component={CatalogoConciliacion} />
                <Route path="/app/:productoId/tesoreria/catalogos/CatalogoEstatusDispersion" component={CatalogoEstatusDispersion} />
                <Route path="/app/:productoId/tesoreria/catalogos/DetalleArchivoDispersion" component={DetalleArchivoDispersion} />
                <Route path="/app/:productoId/tesoreria/ArchivosDeDispercion" component={ArchivosDeDispercion} />
                <Route path="/app/:productoId/tesoreria/ArchivosDeDispercionODP" component={ArchivosDeDispercionODP} />
                <Route path="/app/:productoId/tesoreria/catalogos/ConciliacionPoliza" component={ConciliacionPolizas} />
                <Route path="/app/:productoId/tesoreria/catalogos/DesembolsoFiniquito" component={DesembolsoFiniquito} />
                <Route path="/app/:productoId/tesoreria/BalanceFinal" component={BalanceFinal} />
                <Route path="/app/:productoId/tesoreria/BalanceFinalV2" component={BalanceFinalV2} />
                <Route path="/app/:productoId/tesoreria/BalanceFinalV3" component={BalanceFinalV3} />
                <Route path="/app/:productoId/tesoreria/replicarCuentas" component={ReplicarCuentas} />
                <Route path="/app/:productoId/tesoreria/AltaSolicitudGastos" component={AltaSolicitudGastos} />
                <Route path="/app/:productoId/tesoreria/amortizarsolicitudgastos" component={AmortizarSolicitudGastos} />
                <Route path="/app/:productoId/tesoreria/solicitudesgastoscajera" component={SolicitudesGastosCajera} />
                <Route path="/app/:productoId/tesoreria/creditosDispersion" component={CreditosDispersion} />
                <Route path="/app/:productoId/tesoreria/consultaDispersion" component={ConsultaDispersionH2H} />
                <Route path="/app/:productoId/tesoreria/CreditosDispersionSTP" component={CreditosDispersionSTP} />
                <Route path="/app/:productoId/tesoreria/consultaOrdenes" component={ConsultaOrdenesH2H} />
                <Route path="/app/:productoId/tesoreria/cuentasCobranzaEmpleados" component={CuentasCobranzaEmpleados} />
                {/* <Route path="/app/:productoId/tesoreria/MultiSaldosBoveda" component={MultiSaldosBovedas} />
                <Route path="/app/:productoId/tesoreria/MultiSaldosArqueos" component={MultiSaldosArqueos} />
                <Route path="/app/:productoId/tesoreria/MultiSaldosArqueosBovedas" component={MultiSaldosArqueosBovedas} />
                <Route path="/app/:productoId/tesoreria/MultiSaldosCierrerDiario" component={MultiSaldosCierreDiario} /> */}


                <Route path="/app/:productoId/tesoreria/catalogoUniformes" component={CatalogoUniformes} />
                <Route path="/app/:productoId/tesoreria/catalogoColores" component={CatalogoColores} />
                <Route path="/app/:productoId/tesoreria/catalogoCortes" component={CatalogoCortes} />
                <Route path="/app/:productoId/tesoreria/catalogoTallas" component={CatalogoTallas} />
                <Route path="/app/:productoId/tesoreria/catalogoTipos" component={CatalogoTipos} />
                <Route path="/app/:productoId/tesoreria/catalogoSolicitudUniforme" component={CatalogosolicitudUniforme} />
                <Route path="/app/:productoId/tesoreria/Inventario" component={Inventario} />
                <Route path="/app/:productoId/tesoreria/catalogoAprobacionSolicitudUniforme" component={CatalogoAprobacionSolicitudUniforme} />
                <Route path="/app/:productoId/tesoreria/catalogoSolicitudOrdenCompra" component={CatalogoSolicitudOrdenCompra} />
                <Route path="/app/:productoId/tesoreria/catalogoProcesoSurtido" component={CatalogoProcesoSurtido} />
                <Route path="/app/:productoId/tesoreria/catalogoRecepcionUniforme" component={CatalogoRecepcionUniforme} />
                <Route path="/app/:productoId/tesoreria/gastos" component={SolicitudesAclaraciones} />
                <Route path="/app/:productoId/tesoreria/catalogos/CajasUsuarios" component={CajasUsuarios} />
                <Route path="/app/:productoId/tesoreria/TraspasoEntreCuentas" component={TraspasoEntreCuentas} />
                <Route path="/app/:productoId/tesoreria/TraspasoEntreCuentasZonales" component={TraspasoEntreCuentasZonales} />
                <Route path="/app/:productoId/tesoreria/ConciliaDispersionesH2H" component={ConciliaDispersionH2H} />
                <Route path="/app/:productoId/tesoreria/Referencias/Convenios" component={Convenios} />
                <Route path="/app/:productoId/tesoreria/Referencias/AsignarConvenios" component={AsignarConvenios} />
                <Route path="/app/:productoId/tesoreria/Corresponsales" component={Corresponsales} />
                <Route path="/app/:productoId/tesoreria/TipoComision" component={CorresponsalesTipoComision} />
                <Route path="/app/:productoId/tesoreria/SucursalesDetalle" component={SucursalesDetalle} />
                <Route path="/app/:productoId/tesoreria/ArqueoDesembolso" component={ArqueoDesembolso} />
                <Route path="/app/:productoId/tesoreria/ImprimirArqueoDesembolso" component={ImprimirArqueoDesembolso} />
                <Route path="/app/:productoId/tesoreria/TraspasoCajaBoveda" component={TraspasoCajaBoveda} />
                <Route path="/app/:productoId/tesoreria/TraspasoEntreSistemas" component={TraspasoEntreSistemas} />
                <Route path="/app/:productoId/tesoreria/CreditosTesoreria" component={CreditosTesoreria} />
                <Route path="/app/:productoId/tesoreria/GeneradorSpei" component={GeneradorSpei} />
                <Route path="/app/:productoId/tesoreria/ConsultasSpei" component={ConsultasSpei} />
                <Route path="/app/:productoId/tesoreria/DispersionSpei" component={DispersionSpei} />
                <Route path="/app/:productoId/tesoreria/SpeiaEfectivo" component={SpeiaEfectivo} />


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

export default connect(mapStateToProps, MapDispatchToProps)(Tesoreria)

