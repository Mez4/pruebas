import React from 'react'
import { MostrarMenu } from '../../../../global/functions'
import { IMenu } from '../../../../interfaces/ui/IMenu'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import { iUI } from '../../../../interfaces/ui/iUI'

type HeaderType = {
    pathname: string,
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
                {
                    label: (<span>GESTORIA</span>), Href: "/app/seguridad/roles", Menus:
                        [
                            { label: (<span></span>), Href: "/app/seguridad/roles/rol1" },
                            { label: (<span>ROL 2</span>), Href: "/app/seguridad/roles/rol2", Permiso: "DET__PERMISSION" },
                        ]
                },
            ]}
        />
    )
}

export const menu: IMenu[] = [
    {
        label: "Gestoria",
        items: [
            { label: "SOCIAS CV", icon: "fa fa-user-alt", to: "/app/:productoId/gestor/distribuidores" },
        ]
    }
]