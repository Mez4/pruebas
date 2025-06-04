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
                { label: (<span>ADMINISTRACION</span>), Href: "/app/administracion/" },
                {
                    label: (<span>PERSONAS</span>), Href: "/app/administracion/personas", PermisoRealm: "ADMINISTRACION",
                    Menus: [
                        { label: (<span>CLIENTES</span>), Href: "/app/administracion/personas/clientes" },
                        { label: (<span>SOCIAS</span>), Href: "/app/administracion/personas/distribuidores" },
                        { label: (<span>COORDINADORES</span>), Href: "/app/administracion/personas/coordinadores" },
                        { label: (<span>EMPLEADOS</span>), Href: "/app/administracion/personas/empleados" },
                    ]
                },
            ]}
        />
    )
}

export const menu: IMenu[] = [
    {
        label: "ADMINISTRACIÓN",
        items: [
            {
                label: "PERSONAS",
                icon: "pi pi-table",
                items: [
                    { label: "CLIENTES", icon: "fa fa-clipboard-list", to: "/app/:productoId/personas/clientes" },
                    { label: "SOCIAS DV", icon: "fa fa-clipboard-list", to: "/app/:productoId/personas/distribuidores" },
                    { label: "COORDINADORES", icon: "fa fa-clipboard-list", to: "/app/:productoId/personas/coordinadores" },
                    { label: "EMPLEADOS", icon: "fa fa-clipboard-list", to: "/app/:productoId/personas/empleados" }
                ]
            },
        ]
    }
]