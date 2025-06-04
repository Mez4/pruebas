import React from 'react'
import { MostrarMenu } from '../../../../global/functions'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import { IMenu } from '../../../../interfaces/ui/IMenu'
import { iUI } from '../../../../interfaces/ui/iUI'

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
                { label: (<span>ARCHIVO</span>), Href: "/app/archivo/" },
                {
                    label: (<span>PERSONAS</span>), Href: "/app/archivo/personas", PermisoRealm: "ARCHIVO",
                    Menus: [
                        { label: (<span>CLIENTES</span>), Href: "/app/archivo/personas/clientes" },
                        { label: (<span>SOCIAS</span>), Href: "/app/archivo/personas/distribuidores" },
                        { label: (<span>COORDINADORES</span>), Href: "/app/archivo/personas/coordinadores" },
                    ]
                },
            ]}
        />
    )
}

export const Archivo_menu: IMenu[] = [
    {
        label: "ARCHIVO",
        items: [
            {
                label: "CATALOGOS",
                icon: "pi pi-table",
                items: [
                    // { label: "RASTREO VALRERA", icon: "fa fa-truck", to: "/app/:productoId/distribuidores/catalogos/ValeraTrackingEstatus" },

                    { label: "Estatus", icon: "fa fa-clipboard-list", to: "/app/archivo/CompPersonas/CatalogoEstatus" },
                ]
            },
            {
                label: "PERSONAS",
                icon: "pi pi-table",
                items: [
                    { label: "CLIENTES", icon: "fa fa-user-alt", to: "/app/archivo/personas/clientes" },
                    { label: "SOCIAS", icon: "fa fa-user-alt", to: "/app/archivo/personas/distribuidores" },
                    { label: "COORDINADORES", icon: "fa fa-user-alt", to: "/app/archivo/personas/coordinadores" },
                    { label: "PROMOTORES", icon: "fa fa-user-alt", to: "/app/archivo/personas/promotores" },
                    { label: "ANALISTAS", icon: "fa fa-user-alt", to: "/app/archivo/personas/Analistas" },
                    { label: "DIRECTORES MESA DE CRÉDITO", icon: "fa fa-user-alt", to: "/app/archivo/personas/directoresmesacredito" },
                    { label: "GESTORES COBRANZA", icon: "fa fa-user-alt", to: "/app/archivo/personas/gestorescobranza" },
                    { label: "DIRECTORES MESA DE COBRANZA", icon: "fa fa-user-alt", to: "/app/archivo/personas/directoresmesacobranza" },
                ]
            },

        ]
    }
]