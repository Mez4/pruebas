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
                { label: (<span>MESA DE CREDITO</span>), Funcion: (par) => alert(par.Det), Parametros: { Det: "DO" }, Href: "" },
                {
                    label: (<span>CATALOGOS</span>), Href: "/app/mesadecredito/", Menus: [
                        { label: (<span>ANALISTAS</span>), Href: "/app/mesadecredito/CatalogoAnalista" },
                        { label: (<span>MESAS DE CREDITO</span>), Href: "/app/mesadecredito/CatalogoMesasCreditos" },
                        { label: (<span>MESA DE CREDITO PRODUCTO</span>), Href: "/app/mesadecredito/CatalogoProductosCredMesa" },
                        { label: (<span>DOCUMENTOS</span>), Href: "/app/mesadecredito/RevisionExpediente" },
                    ]

                },
                {
                    label: (<span>SOLICITUDES DE CREDITO</span>), Href: "/app/mesadecredito/", Menus: [
                        { label: (<span>SOLICITUDES DE MESA DE CREDITO</span>), Href: "/app/mesadecredito/SolicitudMesaCredito" },
                        { label: (<span>REVISION DE EXPEDIENTE</span>), Href: "/app/mesadecredito/RevisionExpediente" },
                    ]

                },


            ]}
        />
    )
}

export const menu: IMenu[] = [
    {
        label: "MESA DE CREDITO",
        items: [
            {
                label: "CATALOGOS",
                icon: "pi pi-table",
                items: [
                    { label: "ANALISTAS", icon: "fa fa-clipboard-list", to: "/app/mesadecredito/CatalogoAnalista" },
                    { label: "MESAS DE CREDITO", icon: "fa fa-clipboard-list", to: "/app/mesadecredito/CatalogoMesasCreditos" },
                    { label: "MESA DE CREDITO PRODUCTO", icon: "fa fa-clipboard-list", to: "/app/mesadecredito/CatalogoProductosCredMesa" },
                    { label: "DOCUMENTOS", icon: "fa fa-clipboard-list", to: "/app/mesadecredito/RevisionExpediente" },
                ]
            },
            {
                label: "SOLICITUDES DE CREDITO",
                icon: "pi pi-table",
                items: [
                    { label: "SOLICITUDES DE MESA DE CREDITO", icon: "fa fa-clipboard-list", to: "/app/mesadecredito/SolicitudMesaCredito" },
                    { label: "REVISION DE EXPEDIENTE", icon: "fa fa-file", to: "/app/mesadecredito/RevisionExpediente" },
                ]
            }
        ]
    }
]
