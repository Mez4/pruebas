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

// export const Bancos_menu: IMenu[] = [
//     {
//         label: "Bancos",
//         items: [
//             {

//                 label: "Catalogos",
//                 icon: "pi pi-table",
//                 items: [
//                     { label: "Tipos de Movimiento", icon: "fa fa-paperclip", to: "/app/bancos/catalogos/tipomovimiento" },
//                     { label: "Tipos Desembolso", icon: "fa fa-file-invoice", to: "/app/bancos/catalogos/tipodesembolso" },
//                     { label: "Tipos Desembolso [Sucursal]", icon: "fa fa-money-bill-alt", to: "/app/bancos/catalogos/tipodesembolsosucursal" },
//                     { label: "Bancos", icon: "fa fa-university", to: "/app/bancos/catalogos/bancobancos" },
//                     { label: "Tipos Banco", icon: "fa fa-list-ol", to: "/app/bancos/catalogos/catalogoTipoBancos" },


//                 ]
//             },
//             {
//                 label: "Cuentas", icon: "fa fa-file-invoice",
//                 items: [
//                     { label: "Catálogo de Cuentas de Banco", icon: "fa fa-list-ol", to: "/app/bancos/catalogos/bancocuentas" },
//                 ]
//             },
//         ]
//     }
// ]

export const Bancos_menu: IMenu[] = [
    {
        label: "Bancos",
        items: [
            {

                label: "Catalogos",
                icon: "pi pi-table",
                items: [
                    { label: "Tipos de Movimiento", icon: "fa fa-paperclip", to: "/app/:productoId/bancos/catalogos/tipomovimiento" },
                    { label: "Tipos Desembolso", icon: "fa fa-file-invoice", to: "/app/:productoId/bancos/catalogos/tipodesembolso" },
                    { label: "Tipos Desembolso [Sucursal]", icon: "fa fa-money-bill-alt", to: "/app/:productoId/bancos/catalogos/tipodesembolsosucursal" },
                    { label: "Bancos", icon: "fa fa-university", to: "/app/:productoId/bancos/catalogos/bancobancos" },
                    { label: "Tipos Banco", icon: "fa fa-list-ol", to: "/app/:productoId/bancos/catalogos/catalogoTipoBancos" },


                ]
            },
            {
                label: "Cuentas", icon: "fa fa-file-invoice",
                items: [
                    { label: "Catálogo de Cuentas de Banco", icon: "fa fa-list-ol", to: "/app/:productoId/bancos/catalogos/bancocuentas" },
                ]
            },
        ]
    }
]