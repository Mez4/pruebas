import React from 'react'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import { iUI } from '../../../../interfaces/ui/iUI'
import { IMenu } from '../../../../interfaces/ui/IMenu'

type HeaderType = {
    oidc: IOidc,
    ui: iUI,
    pathname: string
}

export const Pagos_menu: IMenu[] = [
    {
        label: "Pagos",
        items: [
            { label: "Dashboard", icon: "fa fa-cash-register", to: "/app/pagos/dashboard", },
            { label: "Clientes", icon: "fa fa-user", to: "/app/pagos/dashboard", },
            { label: "Corresponsales", icon: "fa fa-university", to: "/app/pagos/dashboard", },
            { label: "Cuentas", icon: "fa fa-money-check-alt", to: "/app/pagos/dashboard", },
            { label: "Importación de layouts", icon: "fa fa-file-import", to: "/app/pagos/dashboard", },
            { label: "Pagos", icon: "fa fa-money-bill-alt", to: "/app/pagos/dashboard", },
            { label: "Conciliaciones", icon: "fa fa-file-invoice-dollar", to: "/app/pagos/dashboard", },
            { label: "Logs", icon: "fa fa-clipboard-check", to: "/app/pagos/dashboard", },

        ]
    }
]
