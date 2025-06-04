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

export const cobranza_menu: IMenu[] = [
    {
        label: "COBRANZA/COBRANZA",
        items: [
            {
                label: "CATALOGOS",
                icon: "pi pi-table",
                items: [
                    { label: "CLASIFICADOR", icon: "fa fa-clipboard-list", to: "/app/:productoId/cobranza/Clasificador" },
                    { label: "MOTIVOS", icon: "fa fa-clipboard-list", to: "/app/:productoId/cobranza/Motivos" },
                    { label: "MESAS DE COBRANZA", icon: "fa fa-table", to: "/app/:productoId/cobranza/MesaCobranza" },
                    { label: "ENCARGADOS", icon: "fa fa-user-plus", to: "/app/:productoId/cobranza/Encargados" },
                    { label: "GESTORES COBRANZA", icon: "fa fa-user-plus", to: "/app/:productoId/cobranza/Gestores" },
                    // { label: "ANALISTAS DE COBRANZA", icon:"fa fa-user-plus", to: "/app/:productoId/cobranza/CatalogoAnalistasCobranza"},
                    { label: "TABULADOR DIAS MORA", icon: "fa fa-clipboard-list", to: "/app/:productoId/cobranza/TabDiasMora" }
                ]
            },

            {
                label: "COBRANZA",
                icon: "fa fa-chart-line",
                items: [
                    { label: "COBRANZA DETALLE", icon: "fa fa-chart-line", to: "/app/:productoId/cobranza/RelacionMesaCobranza" },
                    { label: "CONSULTAR COBRANZA APP MOVIL", icon: "fa fa-mobile", to: "/app/:productoId/cobranza/ConsultarCobranzaAppMovil" },
                    { label: "CONCILIACION TICKETS", icon: "fa fa-list-alt", to: "/app/:productoId/cobranza/ConciliacionTickets" }

                ]
            },

            {
                label: "GESTORES",
                icon: "fa fa-user",
                items: [
                    { label: "LISTA DE GESTORES", icon: "fa fa-clipboard-list", to: "/app/:productoId/cobranza/CarteraGestores" }
                ]
            },

            {
                label: "BITACORA",
                icon: "pi pi-list",
                items: [
                    { label: "BITACORA", icon: "fa fa-tasks", to: "/app/:productoId/cobranza/Bitacora" },
                    { label: "PROCESOS", icon: "fa fa-plus", to: "/app/:productoId/cobranza/CatalogoProcesosBitacora" }
                ]
            },
        ]
    }
]
