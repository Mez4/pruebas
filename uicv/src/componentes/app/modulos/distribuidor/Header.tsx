import React from 'react'
import { MostrarMenu } from '../../../../global/functions'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import { IMenu } from '../../../../interfaces/ui/IMenu'
import { iUI } from '../../../../interfaces/ui/iUI'

type HeaderType = {
    oidc: IOidc,
    pathname: string,
    ui: iUI
}
export const Header = (props: HeaderType) => {
    const permisoActSucursal = props.ui.PermisosProductos?.find(p => p.PermisoID == 442)


    return (
        <MostrarMenu
            Sidebar={props.ui.Sidebar}
            oidc={props.oidc}
            Path={props.pathname}
            Menus={[
                { label: (<span>SOCIAS</span>), Funcion: (par) => alert(par.Det), Parametros: { Det: "DO" }, Href: "" },

                {

                    label: (<span>CATALOGOS</span>), Href: "/app/distribuidores/catalogos", Menus: [
                        { label: (<span>SERIES TIPOS</span>), Href: "/app/distribuidores/valeras/ValeraSeriesTipos" },
                        { label: (<span>ESTATUS VALERA</span>), Href: "/app/distribuidores/catalogos/ValeraCabeceraEstatus" },
                        { label: (<span>ESTATUS VALES</span>), Href: "/app/distribuidores/catalogos/ValeraEstatus" },
                        { label: (<span>RASTREO VALRERA</span>), Href: "/app/distribuidores/catalogos/ValeraTrackingEstatus" },
                        { label: (<span>VALES POR VALERA</span>), Href: "/app/distribuidores/catalogos/ValeraFraccion" },
                    ]

                },
                {
                    label: (<span>VALERAS</span>), Href: "/app/distribuidores/valeras", Menus: [
                        { label: (<span>SERIES</span>), Href: "/app/distribuidores/valeras/ValeraSeries" },
                        { label: (<span>LOTES DE VALERAS</span>), Href: "/app/distribuidores/valeras/ValerasCabecera" },
                        { label: (<span>VALERAS (BLOQUES)</span>), Href: "/app/distribuidores/valeras/BloqueValeras" },
                    ]
                },
            ]}
        />
    )
}


export const Distribuidores_menu: IMenu[] = [
    {
        label: "SOCIAS",
        items: [
            {
                label: "CATALOGOS",
                icon: "pi pi-table",
                items: [
                    { label: "SERIES TIPOS", icon: "fa fa-clipboard-list", to: "/app/:productoId/distribuidores/valeras/ValeraSeriesTipos" },
                    { label: "ESTATUS VALERA", icon: "fa fa-info-circle", to: "/app/:productoId/distribuidores/catalogos/ValeraCabeceraEstatus" },
                    { label: "ESTATUS VALES", icon: "pi pi-info-circle", to: "/app/:productoId/distribuidores/catalogos/ValeraEstatus" },
                    { label: "RASTREO VALRERA", icon: "fa fa-truck", to: "/app/:productoId/distribuidores/catalogos/ValeraTrackingEstatus" },
                    { label: "VALES POR VALERA", icon: "fa fa-ticket-alt", to: "/app/:productoId/distribuidores/catalogos/ValeraFraccion" },
                ]
            },
            {
                label: "VALERAS",
                icon: "pi pi-ticket",
                items: [
                    { label: "SERIES", icon: "fa fa-clipboard-list", to: "/app/:productoId/distribuidores/valeras/ValeraSeries" },
                    { label: "VALERAS (LOTES)", icon: "fa fa-box", to: "/app/:productoId/distribuidores/valeras/ValerasCabecera" },
                    { label: "VALERAS", icon: "fa fa-ticket-alt", to: "/app/:productoId/distribuidores/valeras/BloqueValeras" },
                ]
            },
            {
                label: "MESA DE AYUDA",
                icon: "pi pi-ticket",
                items: [
                    { label: "REVISIÓN DE VALERA", icon: "fa fa-clipboard-list", to: "/app/:productoId/distribuidores/valeras/RevisionValera" },
                    { label: "CANCELACIÓN DE CRÉDITOS", icon: "fa fa-ban", to: "/app/:productoId/distribuidores/valeras/CancelacionCredito"},
                ]
            }
        ]
    }
]