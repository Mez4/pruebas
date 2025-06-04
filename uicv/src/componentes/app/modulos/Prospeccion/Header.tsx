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

export const Prospeccion_menu: IMenu[] = [
    {
        label: "PROSPECCIÓN/MESA CRÉDITO",
        items: [
            {
                label: "CATALOGOS",
                icon: "pi pi-table",
                items: [
                    { label: "TIPOS PERSONA", icon: "fa fa-users", to: "/app/:productoId/prospeccion/TiposPersona" },
                    { label: "TIPOS PERSONA PRUEBA", icon: "fa fa-users", to: "/app/:productoId/prospeccion/TiposPersonaPrueba" },
                    { label: "ESTATUS PROCESO", icon: "fa fa-tasks", to: "/app/:productoId/prospeccion/StatusProceso" },
                    { label: "NIVELES", icon: "fa fa-layer-group", to: "/app/:productoId/prospeccion/Niveles" },
                    { label: "DOCUMENTOS SOLICITADOS TITULAR", icon: "fa fa-file-excel", to: "/app/:productoId/prospeccion/TipoDocumento" },
                    { label: "DOCUMENTOS SOLICITADOS AVAL", icon: "fa fa-file-excel", to: "/app/:productoId/prospeccion/TipoDocumentoAval" },

                    { label: "TIPO VIVIENDA", icon: "fa fa-home", to: "/app/:productoId/prospeccion/TipoVivienda" },
                    { label: "TUBERIA RESULTADO", icon: "fa fa-tasks", to: "/app/:productoId/prospeccion/TuberiaResultado" },
                    { label: "ESTATUS ASIGNACION", icon: "fa fa-people-arrows", to: "/app/:productoId/prospeccion/EstatusAsignacion" },
                    { label: "ESTATUS VALIDACION", icon: "fa fa-check-circle", to: "/app/:productoId/prospeccion/EstatusValidacion" },
                    { label: "ESTATUS VALIDACION", icon: "fa fa-check-circle", to: "/app/:productoId/prospeccion/EstatusValidacion" },
                    { label: "EMPRESAS EXPERIENCIAS", icon: "fa fa-building", to: "/app/:productoId/prospeccion/EmpresasExperiencia" },
                    { label: "MENSAJES", icon: "fa fa-sms", to: "/app/:productoId/prospeccion/Mensajes" },

                    { label: "MESA DE CRÉDITO", icon: "fa fa-user-tie", to: "/app/:productoId/prospeccion/MesaDeCredito" },
                    { label: "PRODUCTO MESA DE CRÉDITO", icon: "fa fa-project-diagram", to: "/app/:productoId/prospeccion/ProductoMesaDeCredito" },
                    { label: "ENCARGADOS", icon: "fa fa-user-tie", to: "/app/:productoId/prospeccion/Encargados" },
                    { label: "ANALISTAS", icon: "fa fa-user-tie", to: "/app/:productoId/prospeccion/Analistas" },
                ]
            },
            /*   {
                  label: "PROSPECTOS",
                  icon: "fa fa-user-friends",
                  items: [
                      { label: "CATALOGO PROSPECTOS", icon: "fa fa-user-friends", to: "/app/:productoId/prospeccion/ProspectosCatalogo" },
                  ]
              }, */
            /*  {
                 label: "PROSPECCIÓN",
                 icon: "pi pi-users",
                 items: [
                     { label: "PROSPECTOS", icon: "fa fa-user-friends", to: "/app/:productoId/prospeccion/Prospectos" },
                 ]
             }, */
            {
                label: "MESA DE CRÉDITO",
                icon: "pi pi-dollar",
                items: [
                    { label: "REVISIÓN DE BURO", icon: "fa fa-file-pdf", to: "/app/:productoId/prospeccion/RevisionBuro" },
                    { label: "VERIFICACIÓN Y LLAMADAS", icon: "fa fa-phone", to: "/app/:productoId/prospeccion/MesaLlamadas" },
                    { label: "EXPEDIENTE Y ACTIVACIÓN", icon: "fa fa-money-check-alt", to: "/app/:productoId/prospeccion/MesaDeCreditoIndex" },
                ]

            },
            {
                label: "PROCESOS",
                icon: "pi pi-list",
                items: [
                    // { label: "MATRIZ PROCESOS", icon: "fa fa-clipboard-list", to: "/app/prospeccion/MatrizProcesos" },
                    { label: "CONTROL DE PROCESOS", icon: "fa fa-tasks", to: "/app/:productoId/prospeccion/MatrizProcesosDetalle" },
                    { label: "TIEMPOS POR PROCESO", icon: "far fa-clock", to: "/app/:productoId/prospeccion/TiempoProcesos" },
                ]
            }

        ]
    }
]
