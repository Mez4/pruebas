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

export const aclaracionesMenu: IMenu[] = [
    {
        label: "ACLARACIONES",
        items: [
            {
                label: "Solicitudes de Aclaraciones",
                icon: "pi pi-table",
                items: [
                    { label: "Solicitudes", icon: "fa fa-clipboard-list", to: "/app/aclaraciones/solicitudesaclaraciones" },
                ]
            },
        ]
    }
]