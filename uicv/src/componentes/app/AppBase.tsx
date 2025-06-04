// Importamos nuestra aplicación de react
import React, { useEffect, useState } from 'react'
import { Route, Switch } from 'react-router-dom'

import { IEstado } from '../../interfaces/redux/IEstado'
import Catalogos from './modulos/catalogos/Catalogos'
// Importamos los modulos con sus menus
import { menu as CatalogosMenu } from './modulos/catalogos/Header'
import { menu as SeguridadMenu } from './modulos/seguridad/Header'
import Personas from './modulos/personas/Administracion'
import Bancos from './modulos/bancos/Bancos'
import Indicadores, { Indicadores_menu } from './modulos/indicadores/Indicadores'
import Seguridad from './modulos/seguridad/Seguridad'
import Archivo from './modulos/archivo/Archivo'
import Tesoreria from './modulos/tesoreria/Tesoreria'
import Creditos from './modulos/creditos/Creditos'
import Cajas from './modulos/cajas/Cajas'
import Distribuidores from './modulos/distribuidor/Distribuidor'

import Prospeccion from './modulos/Prospeccion/Prospeccion'
import Cobranza from './modulos/cobranza/cobranza'
import { useLocation } from 'react-router-dom'

// Layout
import { BarraTitulo, Sidebar } from '../../global/functions'
import PrimeReact from 'primereact/api'

// Layout - Implementación
import { addClass, removeClass } from '../../global/functions'
import { AppActions, AppStateDefault, reducer as AppReducer, generateClassName } from '../../global/AplicacionBase'

// Shadow over our components
import { CSSTransition } from 'react-transition-group'

// Deprecated (...?)
import { IMenu } from '../../interfaces/ui/IMenu'
import { Bancos_menu } from './modulos/cajas/Header'
import { Creditos_menu } from './modulos/creditos/Header'
import { Pagos_menu } from './modulos/pagos/Header'
import { cobranza_menu } from './modulos/cobranza/Header'
import Pagos from './modulos/pagos/Pagos'
import MesaDeAclaraciones from './modulos/mesaDeAclaraciones/MesaDeAclaraciones'
import { Archivo_menu } from './modulos/archivo/Header'

// Iconos
import axios from 'axios'

import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { MesaDeAclaraciones_menu } from './modulos/mesaDeAclaraciones/Header'
import { PromotorMenu } from './modulos/promotor/Header'
import Promotor from './modulos/promotor/Promotor'
import { CreditoVale } from './modulos/creditos/CompCreditos'
import { CajeraAdm_menu } from './modulos/cajeraadm/Header'
import CajeraAdmistrativa from './modulos/cajeraadm/CajeraAdmistrativa'
import { GetServerUrl } from '../../global/variables'
import { Sucursales } from '../selectores'
import { request } from 'http'
import SelectorModulos from './SelectorModulos'


const AppBase = ({ oidc, UI, Cache }: IEstado) => {

    const [userMaster, setUserMaster] = React.useState(false)
    // Sidelbar click
    let sidebarClick = false

    const onWrapperClick = () => dispatch({ type: AppActions.onWrapperClick })
    const onToggleMenuClick = () => dispatch({ type: AppActions.onToggleMenuClick })
    const onMobileTopbarMenuClick = () => dispatch({ type: AppActions.onMobileTopbarMenuClick })
    const onLayoutMenuItemClick = () => dispatch({ type: AppActions.onMenuItemClick })

    useEffect(() => {
        axios.post(`${GetServerUrl()}sistema/usuarios/obtenerMasterUser`,
            { "IDUsuario": oidc.user?.profile.UsuarioID }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${oidc.user?.access_token}`
            }
        }).then((respuesta: any) => {
            if (respuesta.data[0] !== undefined) {
                setUserMaster(true)
            }
            else {
                setUserMaster(false)
            }
        })
            .catch(error => {
                return (error)
            })
    }, [])


    const permisoAsignar = UI.PermisosProductos?.find(p => p.PermisoID > 1)
    const limpiarVacios = (Arreglo?: any) => {
        return Arreglo.filter(m => m.label !== '')
    }

    const Tesoreria_menu: IMenu[] = [
        {

            label: "Tesoreria",
            items: [
                userMaster ||
                    UI.PermisosProductos?.find(p => p.PermisoID == 224) ?
                    {
                        label: "Catalogos",
                        icon: "pi pi-table",
                        items: [
                            userMaster ||
                                UI.PermisosProductos?.find(p => p.PermisoID == 224) ?
                                { label: "Tipo Cuenta", icon: "fa fa-paperclip", to: "/app/:productoId/tesoreria/catalogos/CuentasTipos" } : { label: '', icon: '' },
                            userMaster ?
                                { label: "Tipos Póliza", icon: "fa fa-file-invoice", to: "/app/:productoId/tesoreria/catalogos/PolizasTipos" } : { label: '', icon: '' },
                            userMaster ?
                                { label: "Monedas SAT", icon: "fa fa-money-bill-alt", to: "/app/:productoId/tesoreria/catalogos/MonedasSat" } : { label: '', icon: '' },
                            userMaster ?
                                { label: "Naturaleza", icon: "fa fa-home", to: "/app/:productoId/tesoreria/catalogos/CatalogoNaturaleza" } : { label: '', icon: '' },
                            userMaster ?
                                { label: "Movs. Agrupa", icon: "fa fa-layer-group", to: "/app/:productoId/tesoreria/catalogos/MovimientosAgrupa" } : { label: '', icon: '' },
                            userMaster ?
                                { label: "Tipos Desembolso", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/TipoDesembolso" } : { label: '', icon: '' },
                            userMaster ?
                                { label: "Tipos Desembolsos x Sucursal", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/TipoDesembolsoSucursal" } : { label: '', icon: '' },
                            userMaster ?
                                { label: "Tipos Bancos", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/TipoBancos" } : { label: '', icon: '' },
                            userMaster ?
                                { label: "Bancos", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/Bancos" } : { label: '', icon: '' },
                            userMaster ?
                                { label: "Tipos de Movimiento", icon: "fa fa-list-ol", to: "/app/:productoId/tesoreria/catalogos/CatalogosMovimientosCaja" } : { label: '', icon: '' },
                        ]

                    } : { label: '', icon: '' },

                userMaster ?
                    {
                        label: "MultiSaldos",
                        icon: "fa fa-file-invoice",
                        items: [

                            { label: "Multi-saldos Gral.", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/MultiSaldos" },
                            { label: "Multi-saldos de Cajas", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/MultiSaldosCaja" },
                            //    { label: "Multi-saldos de Bovedas", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/MultiSaldosBoveda" },
                            { label: "Multi-saldos de Arqueos", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/MultiSaldosArqueos" },
                            { label: "Multi-saldos de Arqueos Bóvedas", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/MultiSaldosArqueosBovedas" },
                            { label: "Multi-saldos de Cierre Diario", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/MultiSaldosCierrerDiario" },
                        ]

                    } : { label: '', icon: '' },

                userMaster ?
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
                    } : { label: '', icon: '' },
                /*  {
                     label: "Bóvedas", icon: "fa fa-key",
                     items: [
                         { label: " Catálogo de Bóvedas", icon: "fa fa-list-ol", to: "/app/:productoId/tesoreria/catalogos/CatalogosBoveda" },
                         { label: "Saldos de Bóvedas", icon: "pi pi-id-card", to: "/app/:productoId/tesoreria/cajasBovedas" },
                     ]
                 }, */
                userMaster ||
                    UI.PermisosProductos?.find(p => p.PermisoID == 2611) ?
                    {
                        label: "Cajas", icon: "fa fa-cash-register",
                        items: [
                            userMaster ?
                                { label: " Catálogo de Cajas", icon: "fa fa-list-ol", to: "/app/:productoId/tesoreria/catalogos/CatalogosCaja" }
                                : { label: '', icon: '' },
                            userMaster ?
                                { label: "Permisos Cajas", icon: "pi pi-key", to: "/app/:productoId/tesoreria/catalogos/CajasUsuarios" }
                                : { label: '', icon: '' },
                            userMaster ?
                                { label: "Tipo de Operación de Caja", icon: "fa fa-wallet", to: "/app/:productoId/tesoreria/catalogos/CatalogoTipoOperacionCaja" }
                                : { label: '', icon: '' },

                            userMaster ||
                                UI.PermisosProductos?.find(p => p.PermisoID == 2611) ?
                                { label: "Arqueo", icon: "fa fa-funnel-dollar", to: "/app/:productoId/tesoreria/CajaDenominacionesMonedaCajera" }
                                : { label: '', icon: '' },
                            //userMaster ?
                            //    { label: "Arqueo Desembolso", icon: "fa fa-search-dollar", to: "/app/:productoId/tesoreria/ArqueoDesembolso" }
                            //    : { label: '', icon: '' },
                            // { label: "Tipos de Movimiento", icon: "fa fa-list-ol", to: "/app/:productoId/tesoreria/catalogos/CatalogosMovimientosCaja" },

                        ]
                    } : { label: '', icon: '' },

                userMaster ?
                    {
                        label: "Gastos", icon: "fa fa-comment-dollar",
                        items: [
                            { label: " Catálogo de rubros ", icon: "fa fa-list-ol", to: "/app/:productoId/tesoreria/rubrosgastos" },
                            //     { label: " Alta Solicitud Gastos ", icon: "fa fa-cash-register", to: "/app/:productoId/tesoreria/altasolicitudgastos" },
                            { label: " Amortizar Solicitud Gastos ", icon: "fa fa-file-invoice-dollar", to: "/app/:productoId/tesoreria/amortizarsolicitudgastos" },
                            { label: " Consultar Solicitud Gastos ", icon: "fa fa-file-invoice-dollar", to: "/app/:productoId/tesoreria/solicitudesgastoscajera" },

                        ]
                    } : { label: '', icon: '' },

                userMaster ?
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
                    } : { label: '', icon: '' },

                userMaster ?
                    {
                        label: "Cuentas", icon: "fa fa-money-check-alt",
                        items: [
                            { label: "Cuentas Principal", icon: "fa fa-hand-holding-usd", to: "/app/:productoId/tesoreria/CuentasBancariasPrincipal" },
                            { label: "Cuentas Bancarias", icon: "fa fa-file-invoice-dollar", to: "/app/:productoId/tesoreria/CuentasBancarias" },
                            { label: "Cuentas Contables", icon: "fa fa-file-alt", to: "/app/:productoId/tesoreria/catalogos/CatalogosCuentasContables" },
                            { label: "Replicar cuentas", icon: "pi pi-id-card", to: "/app/:productoId/tesoreria/replicarCuentas" },
                        ]
                    } : { label: '', icon: '' },

                userMaster ?
                    {
                        label: "Pólizas", icon: "fa fa-file-invoice",
                        items: [

                            { label: "Búsqueda de pólizas", icon: "fa fa-file-alt", to: "/app/:productoId/tesoreria/polizas" },
                            { label: "Contabilización de pólizas", icon: "pi pi-id-card", to: "/app/:productoId/tesoreria/catalogos/ConciliacionPoliza" },
                        ]
                    } : { label: '', icon: '' },

                userMaster ?
                    {
                        label: "Dispersiones", icon: "fa fa-file-invoice-dollar",
                        items: [
                            { label: "Archivos de Dispersión [Archivos]", icon: "fa fa-file-csv", to: "/app/:productoId/tesoreria/ArchivosDeDispercion" },
                            { label: "Detalle de Dispersión [Archivos]", icon: "fa fa-file-excel", to: "/app/:productoId/tesoreria/catalogos/DetalleArchivoDispersion" },
                            { label: "Desembolsos Finiquitos", icon: "fas fa-file-signature", to: "/app/:productoId/tesoreria/catalogos/DesembolsoFiniquito" },
                            { label: "Dispersar Créditos H2H", icon: "fa fa-file-csv", to: "/app/:productoId/tesoreria/creditosDispersion" },
    /*                     { label: "Dispersar Créditos STP", icon: "fa fa-file", to: "/app/:productoId/tesoreria/creditosDispersionSTP" },
     */                    { label: "Consulta Dispersiones H2H", icon: "fa fa-file-invoice-dollar", to: "/app/:productoId/tesoreria/consultaDispersion" },
                            { label: "Conciliar Dispersiones H2H", icon: "fa fa-file-invoice-dollar", to: "/app/:productoId/tesoreria/ConciliaDispersionesH2H" },
                            { label: "Consulta Órdenes H2H", icon: "fa fa-file-invoice-dollar", to: "/app/:productoId/tesoreria/consultaOrdenes" },
                        ]
                    } : { label: '', icon: '' },

                userMaster ?
                    {
                        label: "Movimientos cuentas", icon: "fa fa-money-check-alt",
                        items: [
                            { label: "Movimientos fuera de periodo", icon: "fa fa-file-alt", to: "/app/:productoId/tesoreria/admCuentasBancarias" },
                            { label: "Traspaso entre cuentas", icon: "fa fa-dollar-sign", to: "/app/:productoId/tesoreria/TraspasoEntreCuentas" },

                        ]
                    } : { label: '', icon: '' },

                userMaster ?
                    {
                        label: "Corresponsales", icon: "fa fa-user-tie",
                        items: [
                            { label: "Corresponsales", icon: "fa fa-user-tie", to: "/app/:productoId/tesoreria/Corresponsales" },
                            { label: "Tipo comisión", icon: "fa fa-list-ol", to: "/app/:productoId/tesoreria/TipoComision" },
                        ]
                    } : { label: '', icon: '' },

                userMaster ?
                    {
                        label: "Renta Sucursales", icon: "fa fa-store",
                        items: [
                            { label: "Renta detalle", icon: "fa fa-store", to: "/app/:productoId/tesoreria/SucursalesDetalle" },
                            { label: "Contratos", icon: "fa fa-store", to: "/app/:productoId/tesoreria/HistorialContratosSucursales" }

                        ]
                    } : { label: '', icon: '' },

                userMaster || UI.PermisosProductos?.find(p => p.PermisoID == 2653) ?
                    {
                        label: "Arqueos Desembolso", icon: "fa fa-funnel-dollar",
                        items: [
                            userMaster || UI.PermisosProductos?.find(p => p.PermisoID == 2653) ?
                                { label: "Generar Arqueo Desembolso", icon: "fa fa-search-dollar", to: "/app/:productoId/tesoreria/ArqueoDesembolso" } : { label: '', icon: '' },
                            userMaster || UI.PermisosProductos?.find(p => p.PermisoID == 2654) ?
                                { label: "Imprimir Arqueo Desembolso", icon: "fa fa-print", to: "/app/:productoId/tesoreria/ImprimirArqueoDesembolso" } : { label: '', icon: '' }
                        ]
                    } : { label: '', icon: '' },

                userMaster ?
                    {
                        label: "Referencias", icon: "fa fa-money-check-alt",
                        items: [
                            { label: "Convenios", icon: "fa fa-file-upload", to: "/app/:productoId/tesoreria/Referencias/Convenios" },
                            { label: "Asignar Convenios", icon: "fa fa-file-upload", to: "/app/:productoId/tesoreria/Referencias/AsignarConvenios" },
                        ]
                    } : { label: '', icon: '' }
            ]
        }
    ]

    const Creditos_Menu: IMenu[] = [
        {
            label: "CRÉDITOS",
            items: [
                userMaster ||
                    UI.PermisosProductos?.find(p => p.PermisoID == 2676) ?
                    {
                        label: "Catálogos",
                        icon: "pi pi-table",
                        items: [
                            userMaster ? { label: "Productos", icon: "pi pi-bookmark", to: "/app/:productoId/creditos/catalogos/productos" } : { label: '', icon: '' },
                            userMaster ? { label: "Promotores", icon: "pi pi-users", to: "/app/:productoId/creditos/catalogos/promotores" } : { label: '', icon: '' },
                            userMaster ? { label: "Gerentes", icon: "fas fa-user", to: "/app/:productoId/creditos/catalogos/gerentes" } : { label: '', icon: '' },
                            userMaster ? { label: "Coordinadores", icon: "fas fa-user-plus", to: "/app/:productoId/creditos/catalogos/coordinadores" } : { label: '', icon: '' },
                            // { label: "Gestores", icon: "fa fa-address-book", to: "/app/:productoId/creditos/catalogos/gestores" },
                            // { label: "Promotores", icon: "fa fa-address-card", to: "/app/:productoId/creditos/catalogos/promotores" },
                            userMaster ? { label: "Tipos de Tasa", icon: "pi pi-percentage", to: "/app/:productoId/creditos/catalogos/tasastipos" } : { label: '', icon: '' },
                            userMaster ? { label: "Motivos Cancelación", icon: "pi pi-comment", to: "/app/:productoId/creditos/catalogos/motivoscancelaciones" } : { label: '', icon: '' },
                            userMaster ? { label: "Comisiones", icon: "pi pi-chart-line", to: "/app/:productoId/creditos/catalogos/comisiones" } : { label: '', icon: '' },
                            userMaster ? { label: "Condiciones", icon: "pi pi-sliders-v", to: "/app/:productoId/creditos/catalogos/condiciones" } : { label: '', icon: '' },
                            userMaster ? { label: "Sucursal Comisiones", icon: "pi pi-sitemap", to: "/app/:productoId/creditos/catalogos/sucursalcomisiones2" } : { label: '', icon: '' },
                            userMaster ? { label: "Sucursal Condiciones", icon: "pi pi-sitemap", to: "/app/:productoId/creditos/catalogos/sucursalcondiciones" } : { label: '', icon: '' },
                            userMaster ? { label: "Clasificador de Grupos", icon: "pi pi-filter", to: "/app/:productoId/creditos/catalogos/clasificadorgrupos" } : { label: '', icon: '' },
                            userMaster || UI.PermisosProductos?.find(p => p.PermisoID == 2676) ?
                                { label: "Grupos", icon: "pi pi-table", to: "/app/:productoId/creditos/catalogos/creditoGrupo" } : { label: '', icon: '' },
                            userMaster ?
                                { label: "Reasignar Grupos", icon: "fas fa-user-check", to: "/app/:productoId/creditos/catalogos/creditoGrupoReasignar" } : { label: '', icon: '' },
                            userMaster ? { label: "Grupos Permisos", icon: "pi pi-key", to: "/app/:productoId/creditos/catalogos/CreditoGrupoUsuarios" } : { label: '', icon: '' },
                            userMaster ? { label: "Niveles", icon: "pi pi-list", to: "/app/:productoId/creditos/catalogos/CreditoNiveles" } : { label: '', icon: '' },
                            userMaster ? { label: "Niveles Producto", icon: "pi pi-chart-bar", to: "/app/:productoId/creditos/catalogos/CreditoNivelesProducto" } : { label: '', icon: '' },
                        ]
                    } : { label: '', icon: '' },
                userMaster ?
                    {
                        label: "Protecciones Cabecero", icon: "pi pi-key",
                        items: [
                            { label: "Paquetes", icon: "fa fa-layer-group", to: "/app/:productoId/creditos/protecciones/paquetes" },
                            { label: "Cabecero", icon: "pi pi-table", to: "/app/:productoId/creditos/protecciones/cabecero" },
                        ]
                    } : { label: '', icon: '' },

                userMaster ||
                    UI.PermisosProductos?.find(p => p.PermisoID == 2604) ||
                    UI.PermisosProductos?.find(p => p.PermisoID == 2613) ?
                    {
                        label: "Vales", icon: "pi pi-ticket",
                        items: [
                            { label: "Captura de Vales", icon: "fas fa-hand-holding-usd", to: "/app/:productoId/creditos/vales/capturavales" },
                            { label: "Folio Digital", icon: "fas fa-mobile-alt", to: "/app/:productoId/creditos/vales/canjevaledigital" },
                            userMaster ?
                                { label: "Crédito de Empleado", icon: "fas fa-hand-holding-usd", to: "/app/:productoId/creditos/vales/creditosempleados" } : { label: '', icon: '' },
                            { label: "Tiendita", icon: "pi pi-shopping-cart", to: "/app/:productoId/creditos/vales/tiendita" }
                        ]
                    } : { label: '', icon: '' },


                userMaster ||
                    UI.PermisosProductos?.find(p => p.PermisoID == 2613) ?
                    {
                        label: "Créditos", icon: "fa fa-money-check-alt", to: "/app/:productoId/creditos/creditos"
                    } : { label: '', icon: '' },


                userMaster ||
                    UI.PermisosProductos?.find(p => p.PermisoID == 2613) ?
                    {
                        label: "Prestamos Personales", icon: "fa fa-money-check-alt", to: "/app/:productoId/creditos/creditosPersonal"
                    } : { label: '', icon: '' },


                userMaster ||
                    UI.PermisosProductos?.find(p => p.PermisoID == 2579) ||
                    UI.PermisosProductos?.find(p => p.PermisoID == 2613) ?
                    {
                        label: 'Cortes',
                        icon: 'fas fa-calendar-day',
                        items: [
                            userMaster ||
                                UI.PermisosProductos?.find(p => p.PermisoID == 2579) ?
                                { label: "Relaciones", icon: "fas fa-file-invoice-dollar", to: "/app/:productoId/creditos/cortes/creditorelaciones" } : { label: '', icon: '' },
                            userMaster ||
                                UI.PermisosProductos?.find(p => p.PermisoID == 2579) ?
                                { label: "Relaciones Historico", icon: "fas fa-file", to: "/app/:productoId/creditos/cortes/CreditoRelacionesHistorico" } : { label: '', icon: '' },
                            userMaster ?
                                { label: "Recálculo Relaciones", icon: "fas fa-calculator", to: "/app/:productoId/creditos/cortes/CreditoRelacionesRecalculo" } : { label: '', icon: '' },
                            userMaster ||
                                UI.PermisosProductos?.find(p => p.PermisoID == 2613) ?
                                { label: "Pagos", icon: "fas fa-cash-register", to: "/app/:productoId/creditos/cortes/pagos" } : { label: '', icon: '' },
                            userMaster ?
                                { label: "Pagos Aclaraciones", icon: "fas fa-cash-register", to: "/app/:productoId/creditos/cortes/pagosaclaraciones" } : { label: '', icon: '' },
                            userMaster ?
                                { label: "Pagos por DNI", icon: "fas fa-cash-register", to: "/app/:productoId/creditos/cortes/creditoaplicapagodni" } : { label: '', icon: '' },
                            userMaster ||
                                UI.PermisosProductos?.find(p => p.PermisoID == 2613) ?
                                { label: "Pagos Cliente", icon: "fas fa-user-check", to: "/app/:productoId/creditos/cortes/pagoscliente" } : { label: '', icon: '' },
                            userMaster ?
                                { label: "Aplicaciones", icon: "fa fa-calendar-alt", to: "/app/:productoId/creditos/cortes/creditoaplicaciones" } : { label: '', icon: '' },

                        ]
                    }
                    : { label: '', icon: '' },



                userMaster ||
                    UI.PermisosProductos?.find(p => p.PermisoID == 2579) ?
                    {
                        label: "Reestructuras", icon: "fas fa-retweet", items:
                            [
                                { label: "Tipos Reestructura", icon: "pi pi-table", to: "/app/:productoId/creditos/catalogos/tiposReestructura" },
                                { label: "Estatus Reestructura", icon: "pi pi-table", to: "/app/:productoId/creditos/catalogos/estatusReestructura" },
                                { label: "Plazos Reestructura", icon: "pi pi-table", to: "/app/:productoId/creditos/catalogos/plazosReestructura" },
                                { label: "Encargados", icon: "fa fa-user-tie", to: "/app/:productoId/creditos/catalogos/encargadosReestructura" },
                                { label: "Analistas", icon: "fa fa-user-tie", to: "/app/:productoId/creditos/catalogos/analistasReestructura" },
                                { label: "R. Saldo Corte", icon: "fa fa-calendar-alt", to: "/app/:productoId/creditos/cortes/reestructurarelacion" },
                                { label: "R. Cliente Final", icon: "fa fa-user", to: "/app/:productoId/creditos/cortes/reestructuracliente" },
                                { label: "Solicitudes", icon: "fa fa-clipboard-list", to: "/app/:productoId/creditos/cortes/reestructuraSolicitudes" },
                            ]
                    } : { label: '', icon: '' },


                userMaster ||
                    UI.PermisosProductos?.find(p => p.PermisoID == 2579) ?
                    {
                        label: "Global", icon: "fa fa-money-check-alt", to: "/app/:productoId/creditos/CreditoGlobal"
                    } : { label: '', icon: '' },


                userMaster ||
                    UI.PermisosProductos?.find(p => p.PermisoID == 2579) ?
                    {
                        label: "Consultas Rápidas (Reportes)", icon: "fa fa-file", items:
                            [
                                { label: "Dist. pagos x vencimiento (1549)", icon: "fa fa-file", to: "/app/:productoId/creditos/reportes/DistPagosVencimiento" },
                                { label: "Cierre vales x Distribuidor (1506)", icon: "fa fa-user", to: "/app/:productoId/creditos/reportes/CierreValesDist" },
                                { label: "Cobranza Global (264)", icon: "fa fa-money-check-alt", to: "/app/:productoId/creditos/reportes/CobranzaGlobal" },
                                { label: "Cumpleaños Socia (191)", icon: "fa fa-birthday-cake", to: "/app/:productoId/creditos/reportes/CumpleanosDistribuidor" },
                                { label: "Notas Rápidas (221)", icon: "fa fa-sticky-note", to: "/app/:productoId/creditos/reportes/NotasRapidas" },
                                { label: "Detalle Relación (314)", icon: "fa fa-list-alt", to: "/app/:productoId/creditos/reportes/DetallesRelacion" },
                            ]
                    } : { label: '', icon: '' },


                userMaster ?
                    {
                        label: "Solicitud Incrementos", icon: "pi pi-list", to: "/app/:productoId/creditos/SolicitudIncrementos"
                    } : { label: '', icon: '' },


                userMaster ?
                    {
                        label: "Solicitud Aumento Niveles", icon: "pi pi-chart-bar", to: "/app/:productoId/creditos/CreditoSolicitudAumentoNivel"
                    } : { label: '', icon: '' },

                userMaster  ||
                UI.PermisosProductos?.find(p => p.PermisoID == 2999) ?
                    {
                        label: "Solicitud Prestamos Personales", icon: "fa fa-money-check-alt", to: "/app/:productoId/creditos/CreditoSolicitudPrestamosPersonales"
                    } : { label: '', icon: '' },



                userMaster ||
                    UI.PermisosProductos?.find(p => p.PermisoID == 2579) ||
                    UI.PermisosProductos?.find(p => p.PermisoID == 2604) ||
                    UI.PermisosProductos?.find(p => p.PermisoID == 2613) ?
                    {
                        label: "Descargas", icon: "fa fa-file", to: "/app/:productoId/creditos/Descargas"
                    } : { label: '', icon: '' },

                userMaster ||
                    UI.PermisosProductos?.find(p => p.PermisoID == 2722) ?
                    {
                        label: "Monedero", icon: "pi pi-money-bill", items: [
                            { label: 'Dar de alta Mecanicas', icon: "", to: "/app/:productoId/creditos/monedero/mecanicas" },
                            { label: 'Asignar Mecanicas', icon: "", to: "/app/:productoId/creditos/monedero/asignarMecanicas" }
                        ]
                    } : { label: '', icon: '' },

            ]
        }
    ]

    const Prospeccion_menu: IMenu[] = [
        {
            label: "PROSPECCIÓN/MESA CRÉDITO",
            items: [
                userMaster ?
                    {
                        label: "CATALOGOS",
                        icon: "pi pi-table",
                        items: [
                            { label: "TIPOS PERSONA", icon: "fa fa-users", to: "/app/:productoId/prospeccion/TiposPersona" },
                            { label: "TIPOS PERSONA PRUEBA", icon: "fa fa-users", to: "/app/:productoId/prospeccion/TiposPersonaPrueba" },
                            { label: "ESTATUS PROCESO", icon: "fa fa-tasks", to: "/app/:productoId/prospeccion/StatusProceso" },
                            { label: "NIVELES", icon: "fa fa-layer-group", to: "/app/:productoId/prospeccion/Niveles" },
                            { label: "DOCUMENTOS SOLICITADOS TITULAR", icon: "fa fa-file-excel", to: "/app/:productoId/prospeccion/TipoDocumento" },
                            { label: "DOCUMENTOS SOLICITADOS AVAL", icon: "fa fa-file-excel", to: "/app/:productoId/prospeccion/TipoDocumentoAval" },

                            { label: "TIPO VIVIENDA", icon: "fa fa-home", to: "/app/:productoId/prospeccion/TipoVivienda" },
                            { label: "TUBERIA RESULTADO", icon: "fa fa-tasks", to: "/app/:productoId/prospeccion/TuberiaResultado" },
                            { label: "ESTATUS ASIGNACION", icon: "fa fa-people-arrows", to: "/app/:productoId/prospeccion/EstatusAsignacion" },
                            { label: "ESTATUS VALIDACION", icon: "fa fa-check-circle", to: "/app/:productoId/prospeccion/EstatusValidacion" },
                            { label: "ESTATUS VALIDACION", icon: "fa fa-check-circle", to: "/app/:productoId/prospeccion/EstatusValidacion" },
                            { label: "EMPRESAS EXPERIENCIAS", icon: "fa fa-building", to: "/app/:productoId/prospeccion/EmpresasExperiencia" },
                            { label: "MENSAJES", icon: "fa fa-sms", to: "/app/:productoId/prospeccion/Mensajes" },

                            { label: "MESA DE CRÉDITO", icon: "fa fa-user-tie", to: "/app/:productoId/prospeccion/MesaDeCredito" },
                            { label: "PRODUCTO MESA DE CRÉDITO", icon: "fa fa-project-diagram", to: "/app/:productoId/prospeccion/ProductoMesaDeCredito" },
                            { label: "ENCARGADOS", icon: "fa fa-user-tie", to: "/app/:productoId/prospeccion/Encargados" },
                            { label: "ANALISTAS", icon: "fa fa-user-tie", to: "/app/:productoId/prospeccion/Analistas" },
                        ]

                    } : { label: '', icon: '' },
                {
                    label: "MESA DE CRÉDITO",
                    icon: "pi pi-dollar",
                    items: [
                        userMaster ||

                            userMaster ||
                            UI.PermisosProductos?.find(p => p.PermisoID == 2580) ? { label: "REVISIÓN DE BURO", icon: "fa fa-file-pdf", to: "/app/:productoId/prospeccion/RevisionBuro" } : { label: "", icon: "" },

                        userMaster ||
                            UI.PermisosProductos?.find(p => p.PermisoID == 2597) ? { label: "VERIFICACIÓN Y LLAMADAS", icon: "fa fa-phone", to: "/app/:productoId/prospeccion/MesaLlamadas" } : { label: '', icon: '' },

                        userMaster ||
                            UI.PermisosProductos?.find(p => p.PermisoID == 2599) ? { label: "EXPEDIENTE Y ACTIVACIÓN", icon: "fa fa-money-check-alt", to: "/app/:productoId/prospeccion/MesaDeCreditoIndex" } : { label: '', icon: '' }
                    ]

                },
                userMaster ?
                    {
                        label: "PROCESOS",
                        icon: "pi pi-list",
                        items: [
                            // { label: "MATRIZ PROCESOS", icon: "fa fa-clipboard-list", to: "/app/prospeccion/MatrizProcesos" },
                            { label: "CONTROL DE PROCESOS", icon: "fa fa-tasks", to: "/app/:productoId/prospeccion/MatrizProcesosDetalle" },
                        ]
                    } : { label: '', icon: '' }

            ],

        },


    ]

    const Distribuidores_menu: IMenu[] = [


        {
            label: 'SOCIAS',
            items: [


                userMaster ?
                    {
                        label: "CATALOGOS",
                        icon: "pi pi-table",
                        items: [
                            { label: "SERIES TIPOS", icon: "fa fa-clipboard-list", to: "/app/:productoId/distribuidores/valeras/ValeraSeriesTipos" },
                            { label: "ESTATUS VALERA", icon: "fa fa-info-circle", to: "/app/:productoId/distribuidores/catalogos/ValeraCabeceraEstatus" },
                            { label: "ESTATUS VALES", icon: "pi pi-info-circle", to: "/app/:productoId/distribuidores/catalogos/ValeraEstatus" },
                            { label: "COSTO VALERA", icon: "fa fa-dollar-sign", to: "/app/:productoId/distribuidores/catalogos/ValeraCosto" },
                            { label: "RASTREO VALRERA", icon: "fa fa-truck", to: "/app/:productoId/distribuidores/catalogos/ValeraTrackingEstatus" },
                            { label: "VALES POR VALERA", icon: "fa fa-ticket-alt", to: "/app/:productoId/distribuidores/catalogos/ValeraFraccion" },
                        ]
                    } : { label: '', icon: '' },

                userMaster ||
                    UI.PermisosProductos?.find(p => p.PermisoID == 2600) ||
                    UI.PermisosProductos?.find(p => p.PermisoID == 2601) ||
                    UI.PermisosProductos?.find(p => p.PermisoID == 2609) ?
                    {
                        label: 'VALERAS',
                        icon: 'pi pi-ticket',
                        items: [

                            userMaster ||
                                UI.PermisosProductos?.find(p => p.PermisoID == 2600) ?
                                { label: "SERIES", icon: "fa fa-clipboard-list", to: "/app/:productoId/distribuidores/valeras/ValeraSeries" } : { label: '', icon: '' },

                            userMaster ||
                                UI.PermisosProductos?.find(p => p.PermisoID == 2600) ?
                                { label: "VALERAS (LOTES)", icon: "fa fa-box", to: "/app/:productoId/distribuidores/valeras/ValerasCabecera" } : { label: '', icon: '' },

                            userMaster ||
                                UI.PermisosProductos?.find(p => p.PermisoID == 2600) ||
                                UI.PermisosProductos?.find(p => p.PermisoID == 2601) ||
                                UI.PermisosProductos?.find(p => p.PermisoID == 439) ?
                                { label: "VALERAS", icon: "fa fa-ticket-alt", to: "/app/:productoId/distribuidores/valeras/BloqueValeras" } : { label: '', icon: '' },
                        ]
                    } : { label: '', icon: '' },

                userMaster ||
                    UI.PermisosProductos?.find(p => p.PermisoID == 2603) ||
                    UI.PermisosProductos?.find(p => p.PermisoID == 2684)
                    ?
                    {
                        label: "MESA DE AYUDA",
                        icon: "pi pi-ticket",
                        items: [

                            { label: "REVISIÓN DE VALERA", icon: "fa fa-clipboard-list", to: "/app/:productoId/distribuidores/valeras/RevisionValera" },
                            { label: "CANCELACIÓN DE CRÉDITOS", icon: "fa fa-ban", to: "/app/:productoId/distribuidores/valeras/CancelacionCredito" }
                        ]
                    } : { label: '', icon: '' },

            ]
        }
    ]

    const PersonasMenu: IMenu[] = [
        userMaster ||
            UI.PermisosProductos?.find(p => p.PermisoID == 2605) ||
            UI.PermisosProductos?.find(p => p.PermisoID == 2608) ||
            UI.PermisosProductos?.find(p => p.PermisoID == 2625) ||
            UI.PermisosProductos?.find(p => p.PermisoID == 2624) ?
            {
                label: 'ADMINISTRACIÓN',
                items: [{

                    label: "PERSONAS",
                    icon: "pi pi-table",
                    items: [
                        userMaster ||
                            UI.PermisosProductos?.find(p => p.PermisoID == 2605) ||
                            UI.PermisosProductos?.find(p => p.PermisoID == 2608) ||
                            UI.PermisosProductos?.find(p => p.PermisoID == 2624) ||
                            UI.PermisosProductos?.find(p => p.PermisoID == 2625) ?
                            { label: "CLIENTES", icon: "fa fa-clipboard-list", to: "/app/:productoId/personas/clientes" } : { label: '', icon: '' },
                        userMaster ||
                            UI.PermisosProductos?.find(p => p.PermisoID == 2625) ||
                            UI.PermisosProductos?.find(p => p.PermisoID == 2608) ?
                            { label: "SOCIAS DV", icon: "fa fa-clipboard-list", to: "/app/:productoId/personas/distribuidores" } : { label: '', icon: '' },
                        userMaster ?
                            { label: "COORDINADORES", icon: "fa fa-clipboard-list", to: "/app/:productoId/personas/coordinadores" } : { label: '', icon: '' },
                        userMaster ?
                            { label: "EMPLEADOS", icon: "fa fa-clipboard-list", to: "/app/:productoId/personas/empleados" } : { label: '', icon: '' },
                        userMaster ?
                            {
                                label: "SOLICITUDES SOCIA",
                                icon: "fa fa-clipboard-list",
                                items: [

                                    { label: "SOLICITUDES DE CANCELACIÓN TEMPORAL", icon: "fa fa-clipboard-list", to: "/app/:productoId/personas/SolicitudesCancelacionesTemporales" },
                                    { label: "SOLICITUDES DE FALLECIMIENTO", icon: "fa fa-clipboard-list", to: "/app/:productoId/personas/SolicitudesFallecimiento" }
                                ]
                            } : { label: '', icon: '' },
                        // { label: "SOLICITUDES SOCIA", icon: "fa fa-user", to: "/app/:productoId/personas/EstatusSocia" } : { label: '', icon: ''}
                    ]
                },
                ]
            } : { label: '', icon: '' }
    ]

    const Indicadores_menu: IMenu[] = [

        userMaster ||
            UI.PermisosProductos?.find(p => p.PermisoID == 2626) ||
            UI.PermisosProductos?.find(p => p.PermisoID == 2610) ?
            {
                label: "INDICADORES",
                items: [
                    {
                        label: "Tableros",
                        icon: "fa fa-table",
                        items: [
                            // userMaster ||
                            //     UI.PermisosProductos?.find(p => p.PermisoID == 2610) ?

                            //     { label: "Sucursales", icon: "fa fa-store", to: "/app/:productoId/indicadores/sucursales/seguimiento/cobranza" }
                            //     : { label: '', icon: '' },

                            userMaster ||
                                UI.PermisosProductos?.find(p => p.PermisoID == 2626) ||
                                UI.PermisosProductos?.find(p => p.PermisoID == 2610) ?
                                { label: "Coordinadores", icon: "fa fa-users", to: "/app/:productoId/indicadores/coordinador/seguimiento/cobranza" }
                                : { label: '', icon: '' },

                            userMaster ||
                                UI.PermisosProductos?.find(p => p.PermisoID == 2626) ||
                                UI.PermisosProductos?.find(p => p.PermisoID == 2610) ?
                                { label: "Gerentes", icon: "fa fa-users", to: "/app/:productoId/indicadores/gerente/seguimiento/cobranza" }
                                : { label: '', icon: '' },
                        ]
                    }
                ]
            } : { label: '', icon: '' }

    ]

    const PromotorMenu: IMenu[] = [

        userMaster || UI.PermisosProductos?.find(p => p.PermisoID == 2730) ?
            {
                label: "PROSPECCIÓN",
                items: [

                    {
                        label: "PROSPECTOS",
                        icon: "fa fa-user-friends",
                        items: [
                            { label: "CATALOGO PROSPECTOS", icon: "fa fa-user-friends", to: "/app/:productoId/promotor/ProspectosCatalogo" },
                            userMaster ||
                                UI.PermisosProductos?.find(p => p.PermisoID == 2734) ?
                                { label: "REASIGNAR PROSPECTOS E INTERESADOS", icon: "fas fa-user-check", to: "/app/:productoId/promotor/ReasignarProspectoInteresado" } : { label: '', icon: '' }
                        ]
                    },
                    {
                        label: "PROSPECCIÓN",
                        icon: "pi pi-users",
                        items: [
                            { label: "PROSPECTOS", icon: "fa fa-user-friends", to: "/app/:productoId/promotor/Prospectos" },
                            { label: "INTERESADOS", icon: "fa fa-users", to: "/app/:productoId/promotor/Interesados" },
                        ]
                    }


                ]
            } : { label: '', icon: '' }

    ]

    // // Cache the location
    const location = useLocation()

    // // Define an inital state for our app
    const [state, dispatch] = React.useReducer(AppReducer, AppStateDefault)

    // Enable ripple
    PrimeReact.ripple = state.ripple

    // #######################################################
    // Cambio para el estilo del componente
    // #######################################################
    React.useEffect(() => {
        if (state.mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [state.mobileMenuActive])

    // // Generate our className
    const wrapperClass = React.useMemo<string>(() => generateClassName(state), [state])

    // //Metodo para limpiar objetos vacios

    // // Reemplazamos el productoId en nuestros menus
    const parsearMenuProducto = (Menus: IMenu[]) => {
        const menusNuevos = limpiarVacios(Menus)
        return menusNuevos.map(m => ({
            ...m,
            to: m.to !== undefined ? (m.to as string).replace(":productoId", (UI.Producto?.ProductoID ?? 0).toString()) : undefined,
            items: m.items !== undefined ? parsearMenuProducto(m.items as IMenu[]) : undefined
        }))
    }

    let nombreModulo: string = ""
    const path = location.pathname.replace("/app/", "").split("/")
    if (Number(path[0]))
        nombreModulo = path[1]
    else
        nombreModulo = path[0]

    // Obtenemos el modulo actual
    let SidebarMenu: IMenu[] = React.useMemo(() => {

        // Iteramos el nombre del modulo
        switch (nombreModulo) {
            case "catalogos":
                return CatalogosMenu
            // case "administracion":
            //     return AdministracionMenu
            case "archivo":
                return Archivo_menu
            case "seguridad":
                return SeguridadMenu
            case "mesadeaclaraciones":
                return parsearMenuProducto(MesaDeAclaraciones_menu)
            case "tesoreria":
                return parsearMenuProducto(Tesoreria_menu)
            case "bancos":
                return parsearMenuProducto(Bancos_menu)
            // case "valeras":
            //     return parsearMenuProducto(Distribuidores_menu)
            case "distribuidores":
                return parsearMenuProducto(Distribuidores_menu)
            case "mesadecredito":
                return parsearMenuProducto(Prospeccion_menu)
            case "prospeccion":
                return parsearMenuProducto(Prospeccion_menu)
            case "creditos":
                return parsearMenuProducto(Creditos_Menu)
            case "creditos":
                return parsearMenuProducto(Creditos_menu)
            case "pagos":
                return Pagos_menu
            case "cobranza":
                return parsearMenuProducto(cobranza_menu)
            case "indicadores":
                return parsearMenuProducto(Indicadores_menu)
            case "personas":
                return parsearMenuProducto(PersonasMenu)
            case "promotor":
                return parsearMenuProducto(PromotorMenu)
            case "administrativa":
                return parsearMenuProducto(CajeraAdm_menu)
            default:
                return ([] as IMenu[])
        }

    }, [UI])

    // Request interceptors for API calls

    // //GET IUI console.log("Esta es la informacion: ", Estado.UI.Persona)
    //console.log("Estado.UI", oidc.user?.profile)
    axios.interceptors.request.use(
        config => {
            config.headers.ProductoID = `${window.location.href.split("/")[4]}`
            config.headers.UsuarioNombre = `${oidc.user?.profile.name}`
            config.headers.UsuarioID = `${oidc.user?.profile.UsuarioID}`
            return config
        },
        error => {
            return Promise.reject(error);
        }
    );
    // console.log("Version")
    // // Add a 401 response interceptor
    axios.interceptors.response.use(function (response) {
        return response;
    }, function (error) {
        if (401 === error.response.status) {
            // toast(error.response.data.message)
            if (error.response.data && error.response.data.Mensaje) {
                toast.warning(JSON.stringify(error.response.data.Mensaje))
            }
        } else {
            return Promise.reject(error)
        }
    })

    return (
        <>
            <BarraTitulo
                onToggleMenuClick={onToggleMenuClick}
                layoutColorMode={state.layoutColorMode}
                mobileTopbarMenuActive={state.mobileTopbarMenuActive}
                onMobileTopbarMenuClick={onMobileTopbarMenuClick}
                Producto={UI.Producto}
                Modulo={UI.Modulo}
                Persona={oidc.user.profile.Persona}
                iUI={UI}
                Seguridad={oidc}
            />
            <div className={wrapperClass}>

                {/** RENDER DE LA SIDEBAR  */}
                <div className="layout-sidebar" onClick={(event: React.MouseEvent) => {
                    sidebarClick = true
                    event.preventDefault()
                }}>
                    <div className="layout-menu-container">
                        <Sidebar items={SidebarMenu} onMenuItemClickLayout={onLayoutMenuItemClick} />
                    </div>
                </div>

                { /** Renderea nuestra pagina principal dentro de un contenedor para la app */}
                <div className="layout-main-container">
                    <div className="layout-main">
                        <React.Fragment>
                            <Switch>
                                {/** Ruta base */}
                                <Route exact path="/app" render={() => <SelectorModulos />} />
                                {/** Rutas que no requieren un Producto [Administrativas] u [Operativas] */}
                                <Route path="/app/seguridad" component={Seguridad} />
                                <Route path="/app/catalogos" component={Catalogos} />
                                <Route path="/app/archivo" component={Archivo} />
                                <Route path="/app/cajas" component={Cajas} />
                                {/* <Route path="/app/administracion" component={Administracion} /> */}

                                <Route path="/app/pagos" component={Pagos} />

                                {/** Rutas que requieren un producto */}
                                <Route path="/app/:productoId/bancos" component={Bancos} />
                                <Route path="/app/:productoId/mesadeaclaraciones" component={MesaDeAclaraciones} />
                                <Route path="/app/:productoId/indicadores" component={Indicadores} />
                                <Route path="/app/:productoId/creditos" component={Creditos} />
                                < Route path="/app/:productoId/tesoreria" component={Tesoreria} />

                                {/*
                                <Route path="/app/polizas" component={Tesoreria} />
                                <Route path="/app/admCuentasBancarias" component={Tesoreria} />
                                <Route path="/app/cajasBovedas" component={Tesoreria} />
                                <Route path="/app/BalanzaDeComprobacion" component={Tesoreria} />
                                <Route path="/app/tesoreria/Balance" component={Tesoreria} />
                                <Route path="/app/CerrarBalance" component={Tesoreria} />
                                <Route path="/app/ArchivosDeDispercion" component={Tesoreria} /> 
                                */}

                                <Route path="/app/:productoId/personas" component={Personas} />
                                <Route path="/app/:productoId/mesadecredito" component={Prospeccion} />
                                <Route path="/app/:productoId/prospeccion" component={Prospeccion} />
                                <Route path="/app/:productoId/distribuidores" component={Distribuidores} />
                                <Route path="/app/:productoId/cobranza" component={Cobranza} />
                                <Route path="/app/:productoId/promotor" component={Promotor} />
                                <Route path="/app/:productoId/administrativa" component={CajeraAdmistrativa} />

                                {/* Adminsitración de personas a nivel de producto, no general */}
                                <Route path="/app/:productoId/clientes" component={Prospeccion} />
                                <Route path="/app/:productoId/distribuidores" component={Prospeccion} />
                                <Route path="/app/:productoId/coordinadores" component={Prospeccion} />
                                {/* <Route path="/app/:productoId/SolicitudesCancelacionesTemporales" component={Personas} /> */}
                                {/** Ruta no encontrada */}
                                <Route render={() => <span>Not found</span>} />
                            </Switch >
                        </React.Fragment >
                    </div >
                </div >

                { /** Render de la sombre en nuestro GUI para ocultar en movil */}
                < CSSTransition classNames="layout-mask" timeout={{ enter: 100, exit: 200 }} in={state.mobileMenuActive} unmountOnExit onClick={() => {
                    if (!sidebarClick) {
                        onWrapperClick()
                    }
                    else {
                        sidebarClick = false
                    }
                }}>
                    <div className="layout-mask p-component-overlay"></div>
                </CSSTransition >
            </div >
        </>
    )
}

export default AppBase;