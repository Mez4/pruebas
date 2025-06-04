import React from 'react'
import { MostrarMenu } from '../../../../global/functions'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import { IMenu } from '../../../../interfaces/ui/IMenu'
import { iUI } from '../../../../interfaces/ui/iUI'

type HeaderType = {
    pathname: string
    oidc: IOidc,
    ui: iUI
}

export const Header = (props: HeaderType) => {

    return (
        <MostrarMenu
            Sidebar={props.ui.Sidebar}
            oidc={props.oidc}
            Path={props.pathname}
            Menus={[
                { label: (<span>CREDITOS</span>), Funcion: (par) => alert(par.Det), Parametros: { Det: "DO" }, Href: "" },
                {
                    label: (<span>CATALOGOS</span>), Href: "/app/:productoId/creditos/catalogos/", Menus:
                        [
                            { label: (<span>PRODUCTOS</span>), Href: "/app/:productoId/creditos/catalogos/productos" },
                            { label: (<span>GESTORES</span>), Href: "/app/:productoId/creditos/catalogos/gestores" },
                            { label: (<span>PROMOTORES</span>), Href: "/app/:productoId/creditos/catalogos/promotores" },
                            { label: (<span>TIPOS DE TASA</span>), Href: "/app/:productoId/creditos/catalogos/tasastipos" },
                            { label: (<span>MOTIVOS CANCELACIÓN</span>), Href: "/app/:productoId/creditos/catalogos/motivoscancelaciones" },
                            { label: (<span>COMISIONES</span>), Href: "/app/:productoId/creditos/catalogos/comisiones" },
                            { label: (<span>CONDICIONES</span>), Href: "/app/:productoId/creditos/catalogos/condiciones" },
                            { label: (<span>SUCURSAL CONDICIONES</span>), Href: "/app/:productoId/creditos/catalogos/sucursalcondiciones" },
                            { label: (<span>NIVELES</span>), Href: "/app/:productoId/creditos/catalogos/CreditoNiveles" },

                        ]
                },
                {
                    label: (<span>PROTECCIONES</span>), Href: "/app/:productoId/creditos/protecciones", Menus:
                        [
                            { label: (<span>PAQUETES</span>), Href: "/app/:productoId/creditos/protecciones/paquetes" },
                            { label: (<span>CABECERO</span>), Href: "/app/:productoId/creditos/protecciones/cabecero" }
                        ]
                },
                {
                    label: (<span>VALES</span>), Href: "/app/:productoId/creditos/vales", Menus:
                        [
                            { label: (<span>CAPTURA DE VALES</span>), Href: "/app/:productoId/creditos/vales/capturavales" },
                            { label: (<span>TIENDITA</span>), Href: "/app/:productoId/creditos/vales/tiendita" }
                        ]
                },
                {
                    label: (<span>CRÉDITOS</span>), Href: "/app/:productoId/creditos/creditos"
                },
                {
                    label: (<span>CORTES</span>), Href: "/app/:productoId/creditos/cortes", Menus:
                        [
                            { label: (<span>RELACIONES</span>), Href: "/app/:productoId/creditos/cortes/creditorelaciones" },
                            { label: (<span>PAGOS</span>), Href: "/app/:productoId/creditos/cortes/pagos" }
                        ]
                },
                {
                    label: (<span>GLOBAL</span>), Href: "/app/:productoId/creditos/CreditoGlobal"
                },
                {
                    label: (<span>SOLICITUD INCREMENTOS</span>), Href: "/app/:productoId/creditos/SolicitudIncrementos"
                },
                {
                    label: (<span>SOLICITUDES DE CONVENIOS Y REESTRUCTURAS</span>), Href: "/app/:productoId/creditos/SolicitudConveniosReestructuras"
                },
                {
                    label: (<span>SOLICITUD PRESTAMOS PERSONALES</span>), Href: "/app/:productoId/creditos/CreditoSolicitudPrestamosPersonales"
                },
                {
                    label: (<span>SOLICITUDES AUMENTOS NIVEL</span>), Href: "/app/:productoId/creditos/CreditoSolicitudAumentoNivel"
                },


            ]}
        />
    )
}



const permisoActivar = false;

export const Creditos_menu: IMenu[] = [
    {
        label: "CRÉDITOS",
        items: [
            {
                label: "Catálogos",
                icon: "pi pi-table",
                items: [
                    { label: "Productos", icon: "pi pi-bookmark", to: "/app/:productoId/creditos/catalogos/productos" },
                    // { label: "Gestores", icon: "fa fa-address-book", to: "/app/:productoId/creditos/catalogos/gestores" },
                    // { label: "Promotores", icon: "fa fa-address-card", to: "/app/:productoId/creditos/catalogos/promotores" },
                    { label: "Tipos de Tasa", icon: "pi pi-percentage", to: "/app/:productoId/creditos/catalogos/tasastipos" },
                    { label: "Motivos Cancelación", icon: "pi pi-comment", to: "/app/:productoId/creditos/catalogos/motivoscancelaciones" },
                    { label: "Comisiones", icon: "pi pi-chart-line", to: "/app/:productoId/creditos/catalogos/comisiones" },
                    { label: "Condiciones", icon: "pi pi-sliders-v", to: "/app/:productoId/creditos/catalogos/condiciones" },
                    { label: "Sucursal Condiciones", icon: "pi pi-sitemap", to: "/app/:productoId/creditos/catalogos/sucursalcondiciones" },
                    { label: "Clasificador de Grupos", icon: "pi pi-filter", to: "/app/:productoId/creditos/catalogos/clasificadorgrupos" },
                    { label: "Grupos", icon: "pi pi-table", to: "/app/:productoId/creditos/catalogos/creditoGrupo" },
                    { label: "Grupos Reasignar", icon: "pi pi-table", to: "/app/:productoId/creditos/catalogos/creditoGrupoReasignar" },
                    { label: "Grupos Permisos", icon: "pi pi-key", to: "/app/:productoId/creditos/catalogos/CreditoGrupoUsuarios" },
                    { label: "Niveles", icon: "pi pi-list", to: "/app/:productoId/creditos/catalogos/CreditoNiveles" },
                    { label: "Niveles Producto", icon: "pi pi-chart-bar", to: "/app/:productoId/creditos/catalogos/CreditoNivelesProducto" },
                ]
            },
            permisoActivar ? { label: ' ', icon: '' } : {
                label: "Promotores", icon: "fa fa-user", to: "/app/:productoId/creditos/catalogos/promotores"
            },

            {
                label: "Protecciones Cabecero", icon: "pi pi-key",
                items: [
                    { label: "Paquetes", icon: "fa fa-layer-group", to: "/app/:productoId/creditos/protecciones/paquetes" },
                    { label: "Cabecero", icon: "pi pi-table", to: "/app/:productoId/creditos/protecciones/cabecero" },
                ]
            },
            {
                label: "Vales", icon: "pi pi-ticket",
                items: [
                    { label: "Captura de Vales", icon: "fas fa-hand-holding-usd", to: "/app/:productoId/creditos/vales/capturavales" },
                    { label: "Folio Digital", icon: "fas fa-mobile-alt", to: "/app/:productoId/creditos/vales/canjevaledigital" },
                    { label: "Crédito de Empleado", icon: "fas fa-hand-holding-usd", to: "/app/:productoId/creditos/vales/creditosempleados" },
                    { label: "Tiendita", icon: "pi pi-shopping-cart", to: "/app/:productoId/creditos/vales/tiendita" }
                ]
            },
            {
                label: "Créditos", icon: "fa fa-money-check-alt", to: "/app/:productoId/creditos/creditos"
            },
            {
                label: "Prestamos Personales", icon: "fa fa-money-check-alt", to: "/app/:productoId/creditos/creditosPersonal"
            },
            {
                label: "Cortes", icon: "fas fa-calendar-day", items:
                    [
                        { label: "Relaciones", icon: "fas fa-file-invoice-dollar", to: "/app/:productoId/creditos/cortes/creditorelaciones" },
                        { label: "Relaciones Historico", icon: "fas fa-file", to: "/app/:productoId/creditos/cortes/CreditoRelacionesHistorico" },
                        { label: "Recálculo Relaciones", icon: "fas fa-calculator", to: "/app/:productoId/creditos/cortes/CreditoRelacionesRecalculo" },
                        { label: "Pagos", icon: "fas fa-cash-register", to: "/app/:productoId/creditos/cortes/pagos" },
                        { label: "Pagos Aclaraciones", icon: "fas fa-cash-register", to: "/app/:productoId/creditos/cortes/pagosaclaraciones" },
                        { label: "Pagos por DNI", icon: "fas fa-cash-register", to: "/app/:productoId/creditos/cortes/creditoaplicapagodni" },
                        { label: "Pagos Cliente", icon: "fas fa-user-check", to: "/app/:productoId/creditos/cortes/pagoscliente" },
                        { label: "Aplicaciones", icon: "fa fa-calendar-alt", to: "/app/:productoId/creditos/cortes/creditoaplicaciones" },
                    ]
            },
            {
                label: "Monedero", icon: "pi pi-wallet", items: [
                    { label: "Catalogo Mecanicas", icon: "pi pi-table", to: "/app/:productoId/creditos/monedero/mecanicas" }, //fa fa-dollar-sign
                    { label: "Asignar Mecanicas", icon: "pi pi-table", to: "/app/:productoId/creditos/monedero/asignarMecanica" },
                ]
            },
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
            },
            {
                label: "Global", icon: "fa fa-money-check-alt", to: "/app/:productoId/creditos/CreditoGlobal"
            },
            {
                label: "Consultas Rápidas (Reportes)", icon: "fa fa-file", items:
                    [
                        { label: "Dist. pagos x vencimiento (1549)", icon: "fa fa-file", to: "/app/:productoId/creditos/reportes/DistPagosVencimiento" },
                        { label: "Cierre vales x Distribuidor (1506)", icon: "fa fa-user", to: "/app/:productoId/creditos/reportes/CierreValesDist" },
                        { label: "Cumpleaños Socia (191)", icon: "fa fa-birthday-cake", to: "/app/:productoId/creditos/reportes/CumpleanosDistribuidor" },
                        { label: "Notas Rápidas (221)", icon: "fa fa-sticky-note", to: "/app/:productoId/creditos/reportes/NotasRapidas" },
                        { label: "Detalle Relación (314)", icon: "fa fa-list-alt", to: "/app/:productoId/creditos/reportes/DetallesRelacion" },
                    ]
            },
            {
                label: "Solicitud Incrementos", icon: "pi pi-list", to: "/app/:productoId/creditos/SolicitudIncrementos"
            },
            {
                label: "Solicitudes de convenios y reestructuras", icon: "fas fa-retweet", to: "/app/:productoId/creditos/SolicitudConveniosReestructuras"
            },
            {
                label: "Solicitud Aumento Niveles", icon: "pi pi-chart-bar", to: "/app/:productoId/creditos/CreditoSolicitudAumentoNivel"
            },

            {
                label: "Solicitud Prestamos Personales", icon: "fa fa-money-check-alt", to: "/app/:productoId/creditos/CreditoSolicitudPrestamosPersonales"
            },

            {
                label: "Descargas", icon: "fa fa-file", to: "/app/:productoId/creditos/Descargas"
            },
            {
                label: "Solicitud Créditos Personales", icon: "fa fa-address-card", to: "/app/:productoId/creditos/SolicitudCreditosPersonales"
            },

        ]
    }
]
