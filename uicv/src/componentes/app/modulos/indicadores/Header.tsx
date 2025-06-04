import React from 'react'
import { MostrarMenu } from '../../../../global/functions'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import { iUI } from '../../../../interfaces/ui/iUI'

type HeaderType = {
    pathname: string
    oidc: IOidc
    ui: iUI
}
export const Header = (props: HeaderType) => {
    return (
        <MostrarMenu
            Sidebar={props.ui.Sidebar}
            oidc={props.oidc}
            Path={props.pathname}
            Menus={[
                { label: (<span>Indicadores</span>), Funcion: (par) => alert(par.Det), Parametros: { Det: "DO" }, Href: "" },
                {
                    label: (<span>Disitribuidores</span>), Href: "/app/:productoId/bancos/catalogos", Permiso: "SEGURIDAD_USUARIO_ADMIN",
                    Menus: [
                        { label: (<span>Historico</span>), Href: "/app/:productoId/bancos/catalogos/tipodesembolso" },
                    ]
                },
            ]}
        />
    )
}
