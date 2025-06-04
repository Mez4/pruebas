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
                { label: (<span>SEGURIDAD</span>), Funcion: (par) => alert(par.Det), Parametros: { Det: "DO" }, Href: "" },
                { label: (<span>USUARIOS</span>), Href: "/app/seguridad/usuarios", Permiso: "SEGURIDAD_USUARIO_ADMIN" },
                {
                    label: (<span>ROLES</span>), Href: "/app/seguridad/roles", Menus:
                        [
                            { label: (<span>ROL 1</span>), Href: "/app/seguridad/roles/rol1" },
                            { label: (<span>ROL 2</span>), Href: "/app/seguridad/roles/rol2", Permiso: "DET__PERMISSION" },
                        ]
                },
            ]}
        />
    )
}

export const menu: IMenu[] = [
    {
        label: "Seguridad",
        items: [
            { label: "Usuarios", icon: "fa fa-user-alt", to: "/app/seguridad/usuarios" },
            { label: "Roles", icon: "fa fa-users", to: "/app/seguridad/roles" },
            { label: "Permisos", icon: "fa fa-key", to: "/app/seguridad/permisos" },
            { label: "Permisos Especiales", icon: "fa fa-key", to: "/app/seguridad/PermisosEspeciales" },
            { label: "Pantallas", icon: "fa fa-square", to: "/app/seguridad/pantallas" },
            
            { label: "Pantallas Excel", icon: "fa fa-file-excel", to: "/app/seguridad/PantallasExcel" },
            { label: "Permisos Excel", icon: "fa fa-file-excel", to: "/app/seguridad/PermisosExcel" },
        ]
    }
]