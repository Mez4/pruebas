import React from 'react'
import { MostrarMenu } from '../../../../global/functions'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import { iUI } from '../../../../interfaces/ui/iUI'
import { IMenu } from '../../../../interfaces/ui/IMenu'


type HeaderType = {
    pathname: string,
    ui: iUI,
    oidc: IOidc
}
export const Header = (props: HeaderType) => {
    return (
        <MostrarMenu
            Sidebar={props.ui.Sidebar}
            oidc={props.oidc}
            Path={props.pathname}
            Menus={[
                { label: (<span>CAJAS</span>), Funcion: (par) => alert(par.Det), Parametros: { Det: "DO" }, Href: "" },
                {
                    label: (<span>CAJAS</span>), Href: "/app/cajas/cajas", Menus: [
                        { label: (<span>R. Denominaciones Cajeras</span>), Href: "/app/cajas/cajas/CajaDenominacionesMonedaCajera" },
                        { label: (<span>DENOM CAJA GENERAL</span>), Href: "/app/cajas/cajas/CajaDenominacionesMonedaGeneral" },

                    ]
                },
            ]}
        />
    )
}

export const CajeraAdm_menu: IMenu[] = [
    {
        label: "Cajera Administrativa",
        items: [
            { label: "Captura de vales", icon: "fa fa-cash-register", to: "/app/:productoId/administrativa/capturaVales", },
        ]
    }
]