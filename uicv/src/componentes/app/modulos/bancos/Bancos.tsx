import React from 'react'
import { Route, Switch } from 'react-router'

import { BancoDispersionEstatus, BancoTipoDesembolso, BancoCuentasCortesDenominacion, BancoTipoMovimiento, BancoBanco, BancoCuenta, BancoDispersion, BancoMovimiento, BancoCuentaCorte, BancoTipoDesembolsoSucursal } from './CompBancos'
import BancosCorresponsalesPago from './CompBancos/BancosCorresponsalesPago'

//import AltaSolicitudesAnalista from './CompBancos/AltaSolicitudesAnalista'
import BancoBancos from '../tesoreria/CompTesoreria/BancoBancos'
import BancoCuentas from '../tesoreria/CompTesoreria/BancoCuentas'
import BancoCuentasParam from './CompBancos/BancoCuentasParam'
import BancosParametros from './CompBancos/BancosParametros'

// import BancoCuentasMaestras from './CompBancos/BancoCuentasMaestras'
import CatalogoCuentasBanco from './CompBancos/CatalogoCuentasBanco'
import CatalogoDispersiones from './CompBancos/CatalogoDispersiones'
import CatalogoBanco from './CompBancos/CatalogoBanco'

//import CatalogoTipoBancos from './CompBancos/CatalogoTipoBancos'
import BancoCuentasMaestras from './CompBancos/BancoCuentasMaestras'
import CatalogoTipoBancos from '../tesoreria/CompTesoreria/CatalogoTipoBancos'

// Importamos la función para definir nuestro modulo en Redux
import { useAccesoProducto } from '../../../hooks/useAccesoProducto'

/** Id del modulo */
const ModuloID: number = 4

/**
 * Componente de administración bancaria
 * @returns Componente de React
 */
const Bancos = (): React.ReactElement => {

    console.log("DOMO BANCOS")

    // Validamos el acceso a nuestro producto y Modulo
    useAccesoProducto(ModuloID)

    // Render de los componentes bancarios
    return (
        <div>
            <div className="">
                <Switch>
                    <Route path="/app/:productoId/bancos/catalogos/dispersionestatus" component={BancoDispersionEstatus} />
                    <Route path="/app/:productoId/bancos/catalogos/tipodesembolso" component={BancoTipoDesembolso} />
                    <Route path="/app/:productoId/bancos/catalogos/tipodesembolsosucursal" component={BancoTipoDesembolsoSucursal} />
                    <Route path="/app/:productoId/bancos/catalogos/denominacion" component={BancoCuentasCortesDenominacion} />
                    <Route path="/app/:productoId/bancos/catalogos/tipomovimiento" component={BancoTipoMovimiento} />
                    <Route path="/app/:productoId/bancos/catalogos/banco" component={BancoBanco} />
                    <Route path="/app/:productoId/bancos/catalogos/cuenta" component={BancoCuenta} />
                    <Route path="/app/:productoId/bancos/catalogos/dispersion" component={BancoDispersion} />
                    <Route path="/app/:productoId/bancos/catalogos/movimiento" component={BancoMovimiento} />
                    <Route path="/app/:productoId/bancos/catalogos/cuentacorte" component={BancoCuentaCorte} />
                    <Route path="/app/:productoId/bancos/catalogos/corresponsalespago" component={BancosCorresponsalesPago} />
                    <Route path="/app/:productoId/bancos/catalogos/parametrosbancos" component={BancosParametros} />
                    {/* <Route path="/app/bancos/catalogos/altaanalista" component={AltaSolicitudesAnalista} /> */}
                    <Route path="/app/:productoId/bancos/catalogos/bancobancos" component={BancoBancos} />
                    <Route path="/app/:productoId/bancos/catalogos/bancocuentas" component={BancoCuentas} />
                    <Route path="/app/:productoId/bancos/catalogos/bancocuentasparam" component={BancoCuentasParam} />
                    <Route path="/app/:productoId/bancos/catalogos/bancocuentasmaestras" component={BancoCuentasMaestras} />

                    <Route path="/app/:productoId/bancos/catalogos/catalogoBanco" component={CatalogoBanco} />
                    <Route path="/app/:productoId/bancos/catalogos/catalogoCuentasBanco" component={CatalogoCuentasBanco} />
                    <Route path="/app/:productoId/bancos/catalogos/catalogoDispersiones" component={CatalogoDispersiones} />
                    <Route path="/app/:productoId/bancos/catalogos/catalogoTipoBancos" component={CatalogoTipoBancos} />

                    {/*<Route path="/app/bancos/catalogos/catalogoTipoBancos" component={CatalogoTipoBancos} />*/}
                    <Route render={() => <span>Redirect nivel de modulo</span>} />

                </Switch>
            </div>
        </div>
    )
}

export default Bancos