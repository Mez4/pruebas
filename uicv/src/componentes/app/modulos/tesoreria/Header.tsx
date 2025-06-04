import React from 'react'
import { MostrarMenu } from '../../../../global/functions'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import { iUI } from '../../../../interfaces/ui/iUI'
import { IMenu } from '../../../../interfaces/ui/IMenu'

type HeaderType = {
    oidc: IOidc,
    ui: iUI,
    pathname: string
}
export const Header = (props: HeaderType) => {
    return (
        <MostrarMenu
            Sidebar={props.ui.Sidebar}
            oidc={props.oidc}
            Path={props.pathname}
            Menus={[
                { label: (<span>TESORERIA</span>), Funcion: (par) => alert(par.Det), Parametros: { Det: "DO" }, Href: "" },
                {
                    label: (<span>CATALOGOS</span>), Href: "/app/tesoreria/catalogos", Menus: [
                        { label: (<span>T.CUENTA</span>), Href: "/app/tesoreria/catalogos/CuentasTipos" },
                        { label: (<span>T.POLIZAS</span>), Href: "/app/tesoreria/catalogos/PolizasTipos" },
                        { label: (<span>MONEDAS SAT</span>), Href: "/app/tesoreria/catalogos/MonedasSat" },
                        { label: (<span>NATURALEZA</span>), Href: "/app/tesoreria/catalogos/CatalogoNaturaleza" },
                        // { label: (<span>TIPOS MOVIMIENTOS</span>), Href: "/app/tesoreria/catalogos/CatalogosMovimientosCaja" },
                        { label: (<span>ASIGNA ANALISTAS</span>), Href: "/app/tesoreria/catalogos/AltaSolicitudAnalista" },
                        { label: (<span>MOVIMIENTOS AGRUPA</span>), Href: "/app/tesoreria/catalogos/MovimientosAgrupa" },

                        { label: (<span>MOVIMIENTOS CAJA</span>), Href: "/app/tesoreria/catalogos/CatalogosMovimientosCaja" },

                        { label: (<span>TIPO OPERACION - CAJA</span>), Href: "/app/tesoreria/catalogos/CatalogoTipoOperacionCaja" },
                        { label: (<span>BOVEDA</span>), Href: "/app/tesoreria/catalogos/CatalogosBoveda" },
                        { label: (<span>CAJA</span>), Href: "/app/tesoreria/catalogos/CatalogosCaja" },
                        { label: (<span>CUENTAS CONTABLES</span>), Href: "/app/tesoreria/catalogos/CatalogosCuentasContables" },
                        { label: (<span>PERIODOS</span>), Href: "/app/tesoreria/catalogos/CierrePeriodo" },
                        { label: (<span>BALANZAS</span>), Href: "/app/tesoreria/catalogos/BalanzasGeneradas" },

                        { label: (<span>CATALOGO CONCILIACION</span>), Href: "/app/tesoreria/catalogos/CatalogoConciliacion" },
                        //   { label: (<span>ESTATUS DISPERSION</span>), Href: "/app/tesoreria/catalogos/CatalogoEstatusDispersion" },
                        { label: (<span>DETALLE ARCHIVO DISPERSION</span>), Href: "/app/tesoreria/catalogos/DetalleArchivoDispersion" },
                        { label: (<span>CONTABILIZACIÓN DE POLIZA</span>), Href: "/app/tesoreria/catalogos/ConciliacionPoliza" },


                    ]
                },
                { label: (<span>POLIZAS</span>), Href: "/app/polizas" },
                { label: (<span>ADM. CUENTAS BANCARIAS</span>), Href: "/app/admCuentasBancarias" },
                { label: (<span>CAJAS/BÓVEDAS</span>), Href: "/app/cajasBovedas" },
                { label: (<span>BALANZA DE COMPROBACIÓN</span>), Href: "/app/BalanzaDeComprobacion" },
                // { label: (<span>CIERRE BALANCE</span>), Href: "/app/CerrarBalance" },


                { label: (<span>BALANCE</span>), Href: "/app/Balance" },
                { label: (<span>ARCHIVOS DE DISPERSIÓN</span>), Href: "/app/ArchivosDeDispercion" },

            ]}

        />
    )
}

export const Tesoreria_menu: IMenu[] = [
    {
        label: "Tesoreria",
        items: [
            {
                label: "Catalogos",
                icon: "pi pi-table",
                items: [
                    { label: "Tipo Cuenta", icon: "fa fa-paperclip", to: "/app/:productoId/tesoreria/catalogos/CuentasTipos" },
                    { label: "Tipos Póliza", icon: "fa fa-file-invoice", to: "/app/:productoId/tesoreria/catalogos/PolizasTipos" },
                    { label: "Monedas SAT", icon: "fa fa-money-bill-alt", to: "/app/:productoId/tesoreria/catalogos/MonedasSat" },
                    { label: "Naturaleza", icon: "fa fa-home", to: "/app/:productoId/tesoreria/catalogos/CatalogoNaturaleza" },
                    { label: "Movs. Agrupa", icon: "fa fa-layer-group", to: "/app/:productoId/tesoreria/catalogos/MovimientosAgrupa" },
                    { label: "Tipos Desembolso", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/TipoDesembolso" },
                    { label: "Tipos Desembolsos x Sucursal", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/TipoDesembolsoSucursal" },
                    { label: "Tipos Bancos", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/TipoBancos" },
                    { label: "Bancos", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/Bancos" },
                    { label: "Tipos de Movimiento", icon: "fa fa-list-ol", to: "/app/:productoId/tesoreria/catalogos/CatalogosMovimientosCaja" },

                ]

            },
            {
                label: "MultiSaldos",
                icon: "fa fa-file-invoice",
                items: [
                    { label: "Multi-saldos Gral.", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/MultiSaldos" },
                    { label: "Multi-saldos de Cajas", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/MultiSaldosCaja" },
                    //    { label: "Multi-saldos de Bovedas", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/MultiSaldosBoveda" },
                    { label: "Multi-saldos de Arqueos", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/MultiSaldosArqueos" },
                    { label: "Multi-saldos de Cierre Diario", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/MultiSaldosCierrerDiario" },
                ]

            },

            {
                label: "Balances", icon: "fa fa-file-invoice",
                items: [
                    { label: "Periodos", icon: "fa fa-calendar-alt", to: "/app/:productoId/tesoreria/catalogos/CierrePeriodo" },
                    //  { label: "Generar Balance", icon: "fa fa-file-alt", to: "/app/:productoId/tesoreria/Balance" },
                    { label: "Generar Balance", icon: "fa fa-file-alt", to: "/app/:productoId/tesoreria/BalanceFinal" },
                    { label: "Generar Balanza", icon: "fa fa-balance-scale-right", to: "/app/:productoId/tesoreria/BalanzaDeComprobacion" },
                    { label: "Consultar Balanza", icon: "fa fa-file-pdf", to: "/app/:productoId/tesoreria/catalogos/BalanzasGeneradas" },
                    /*     { label: "Multi-saldos Gral.", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/MultiSaldos" },
                        { label: "Multi-saldos de Cajas", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/MultiSaldosCaja" },
                        { label: "Multi-saldos de Bovedas", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/MultiSaldosBoveda" },
                        { label: "Multi-saldos de Arqueos", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/MultiSaldosArqueos" },
                        { label: "Multi-saldos de Cierre Diario", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/MultiSaldosCierreDiario" },
     */
                ]
            },
            /*  {
                 label: "Bóvedas", icon: "fa fa-key",
                 items: [
                     { label: " Catálogo de Bóvedas", icon: "fa fa-list-ol", to: "/app/:productoId/tesoreria/catalogos/CatalogosBoveda" },
                     { label: "Saldos de Bóvedas", icon: "pi pi-id-card", to: "/app/:productoId/tesoreria/cajasBovedas" },
                 ]
             }, */
            {
                label: "Cajas", icon: "fa fa-cash-register",
                items: [
                    { label: " Catálogo de Cajas", icon: "fa fa-list-ol", to: "/app/:productoId/tesoreria/catalogos/CatalogosCaja" },
                    { label: "Permisos Cajas", icon: "pi pi-key", to: "/app/:productoId/tesoreria/catalogos/CajasUsuarios" },
                    { label: "Tipo de Operación de Caja", icon: "fa fa-wallet", to: "/app/:productoId/tesoreria/catalogos/CatalogoTipoOperacionCaja" },
                    { label: "Arqueo", icon: "fa fa-funnel-dollar", to: "/app/:productoId/tesoreria/CajaDenominacionesMonedaCajera" },
                    { label: "Traspaso caja/boveda", icon: "fa fa-exchange", to: "/app/:productoId/tesoreria/TraspasoCajaBoveda" },
                    // { label: "Tipos de Movimiento", icon: "fa fa-list-ol", to: "/app/:productoId/tesoreria/catalogos/CatalogosMovimientosCaja" },

                ]
            },
            {
                label: "Gastos", icon: "fa fa-comment-dollar",
                items: [
                    { label: " Catálogo de rubros ", icon: "fa fa-list-ol", to: "/app/:productoId/tesoreria/rubrosgastos" },
                    //     { label: " Alta Solicitud Gastos ", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/altasolicitudgastos" },
                    { label: " Amortizar Solicitud Gastos ", icon: "fa fa-file-invoice-dollar", to: "/app/:productoId/tesoreria/amortizarsolicitudgastos" },
                    { label: " Consultar Solicitud Gastos ", icon: "fa fa-file-invoice-dollar", to: "/app/:productoId/tesoreria/solicitudesgastoscajera" },

                ]
            },
            {
                label: "Uniformes", icon: "fa fa-child",
                items: [
                    { label: "Solicitud", icon: "fa fa-user-tag", to: "/app/:productoId/tesoreria/catalogoSolicitudUniforme" },
                    { label: "Aprobación", icon: "fa fa-user-check", to: "/app/:productoId/tesoreria/catalogoAprobacionSolicitudUniforme" },
                    { label: "Autorización y Orden", icon: "fas fa-file-alt", to: "/app/:productoId/tesoreria/catalogoSolicitudOrdenCompra" },
                    { label: "Surtido", icon: "fas fa-clipboard-check", to: "/app/:productoId/tesoreria/catalogoProcesoSurtido" },
                    { label: "Recepción", icon: "fas fa-boxes", to: "/app/:productoId/tesoreria/catalogoRecepcionUniforme" },

                    { label: "Estatus", icon: "fa fa-circle", to: "/app/:productoId/tesoreria/catalogoUniformes" },
                    //{ label: "Colores", icon: "fa fa-palette", to: "/app/:productoId/tesoreria/catalogoColores" },
                    { label: "Productos", icon: "fa fa-tshirt", to: "/app/:productoId/tesoreria/catalogoCortes" },
                    /*                     { label: "Tallas", icon: "fa fa-tape", to: "/app/:productoId/tesoreria/catalogoTallas" },
                     */                    //{ label: "Tipos", icon: "fa fa-shapes", to: "/app/:productoId/tesoreria/catalogoTipos" },
                    { label: "Inventario", icon: "fa fa-database", to: "/app/:productoId/tesoreria/inventario" },
                ]
            },
            {
                label: "Cuentas", icon: "fa fa-money-check-alt",
                items: [
                    { label: "Cuentas Principal", icon: "fa fa-hand-holding-usd", to: "/app/:productoId/tesoreria/CuentasBancariasPrincipal" },
                    { label: "Cuentas Bancarias", icon: "fa fa-file-invoice-dollar", to: "/app/:productoId/tesoreria/CuentasBancarias" },
                    { label: "Cuentas Contables", icon: "fa fa-file-alt", to: "/app/:productoId/tesoreria/catalogos/CatalogosCuentasContables" },
                    { label: "Replicar cuentas", icon: "pi pi-id-card", to: "/app/:productoId/tesoreria/replicarCuentas" },
                ]
            },
            {
                label: "Pólizas", icon: "fa fa-file-invoice",
                items: [
                    { label: "Búsqueda de pólizas", icon: "fa fa-file-alt", to: "/app/:productoId/tesoreria/polizas" },
                    { label: "Contabilización de pólizas", icon: "pi pi-id-card", to: "/app/:productoId/tesoreria/catalogos/ConciliacionPoliza" },
                ]
            },
            {
                label: "Dispersiones", icon: "fa fa-file-invoice-dollar",
                items: [
                    { label: "Archivos de Dispersión [Archivos]", icon: "fa fa-file-csv", to: "/app/:productoId/tesoreria/ArchivosDeDispercion" },
                    { label: "Archivos de Dispersión ODP [Archivos]", icon: "fa fa-file-csv", to: "/app/:productoId/tesoreria/ArchivosDeDispercionODP" },
                    { label: "Detalle de Dispersión [Archivos]", icon: "fa fa-file-excel", to: "/app/:productoId/tesoreria/catalogos/DetalleArchivoDispersion" },
                    { label: "Desembolsos Finiquitos", icon: "fas fa-file-signature", to: "/app/:productoId/tesoreria/catalogos/DesembolsoFiniquito" },
                    { label: "Dispersar Créditos H2H", icon: "fa fa-file-csv", to: "/app/:productoId/tesoreria/creditosDispersion" },
/*                     { label: "Dispersar Créditos STP", icon: "fa fa-file", to: "/app/:productoId/tesoreria/creditosDispersionSTP" },
 */                    { label: "Consulta Dispersiones H2H", icon: "fa fa-file-invoice-dollar", to: "/app/:productoId/tesoreria/consultaDispersion" },
                    { label: "Conciliar Dispersiones H2H", icon: "fa fa-file-invoice-dollar", to: "/app/:productoId/tesoreria/ConciliaDispersionesH2H" },
                    { label: "Consulta Órdenes H2H", icon: "fa fa-file-invoice-dollar", to: "/app/:productoId/tesoreria/consultaOrdenes" },
                ]
            },
            {
                label: "Movimientos cuentas", icon: "fa fa-money-check-alt",
                items: [
                    { label: "Movimientos fuera de periodo", icon: "fa fa-file-alt", to: "/app/:productoId/tesoreria/admCuentasBancarias" },
                    { label: "Traspaso entre cuentas", icon: "fa fa-dollar-sign", to: "/app/:productoId/tesoreria/TraspasoEntreCuentas" },
                    { label: "Traspaso entre cuentas Zonales", icon: "fa fa-dollar-sign", to: "/app/:productoId/tesoreria/TraspasoEntreCuentasZonales" },
                    { label: "Traspaso entre Sistemas", icon: "fa fa-dollar-sign", to: "/app/:productoId/tesoreria/TraspasoEntreSistemas" },
                ]
            },
            {
                label: "Corresponsales", icon: "fa fa-user-tie",
                items: [
                    { label: "Corresponsales", icon: "fa fa-user-tie", to: "/app/:productoId/tesoreria/Corresponsales" },
                    { label: "Tipo comisión", icon: "fa fa-list-ol", to: "/app/:productoId/tesoreria/TipoComision" },
                ]
            },
            {
                label: "Refencias", icon: "fa fa-user-tie",
                items: [
                    { label: " Convenios", icon: "fa file-upload", to: "/app/:productoId/tesoreria/Referencias/Convenios" },
                    { label: " Asignar Convenios", icon: "fa file-upload", to: "/app/:productoId/tesoreria/Referencias/AsignarConvenios" },
                ]
            },
            {
                label: "Renta Sucursales", icon: "fa fa-store",
                items: [
                    { label: "Renta detalle", icon: "fa fa-store", to: "/app/:productoId/tesoreria/SucursalesDetalle" },
                    { label: "Contratos", icon: "fa fa-store", to: "/app/:productoId/tesoreria/HistorialContratosSucursales" }

                ]
            }

        ]
    }
]
