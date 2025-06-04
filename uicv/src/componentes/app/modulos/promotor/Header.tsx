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
                { label: (<span>PROSPECCION/MESA CRÉDITO</span>), Funcion: (par) => alert(par.Det), Parametros: { Det: "DO" }, Href: "" },
                {
                    label: (<span>PROSPECCION</span>), Href: "/app/prospeccion/", Menus: [
                        { label: (<span>PROSPECTOS</span>), Href: "/app/prospeccion/Prospectos" },
                        { label: (<span>AVALES DE PROSPECTOS</span>), Href: "/app/prospeccion/AvalesProspectos" },
                    ]

                },
            ]}
        />
    )
}


export const PromotorMenu: IMenu[] = [
    {
        label: "PROSPECCIÓN",
        items: [

            {
                label: "PROSPECTOS",
                icon: "fa fa-user-friends",
                items: [
                    { label: "CATALOGO PROSPECTOS", icon: "fa fa-user-friends", to: "/app/:productoId/promotor/ProspectosCatalogo" },
                    { label: "REASIGNAR PROSPECTOS E INTERESADOS", icon: "fas fa-user-check", to: "/app/:productoId/promotor/ReasignarProspectoInteresado"}
                ]
            },
            {
                label: "PROSPECCIÓN",
                icon: "pi pi-users",
                items: [
                    { label: "PROSPECTOS", icon: "fa fa-user-friends", to: "/app/:productoId/promotor/Prospectos" },
                    { label: "INTERESADOS", icon: "fa fa-users", to: "/app/:productoId/promotor/Interesados" },
                ]
            },


        ]
    }
]
