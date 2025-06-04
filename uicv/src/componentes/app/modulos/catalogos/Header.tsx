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
                { label: (<span>CATALOGOS</span>), Funcion: (par) => alert(par.Det), Parametros: { Det: "DO" }, Href: "" },

                {
                    label: (<span>PERSONA</span>), Href: "/app/catalogos/persona", Menus:
                        [
                            { label: (<span>T.DOCUMENTOS</span>), Href: "/app/catalogos/persona/documentosTipos" },
                            { label: (<span>T.IDENTIFICACION</span>), Href: "/app/catalogos/persona/IdentificacionesTipos" },
                            { label: (<span>ESCOLARIDAEDS</span>), Href: "/app/catalogos/persona/escolaridades" },
                            { label: (<span>ESTADO CIVIL</span>), Href: "/app/catalogos/persona/estadoCivilTipo" },
                            { label: (<span>OCUPACIONES</span>), Href: "/app/catalogos/persona/ocupaciones" },
                            { label: (<span>SEXO</span>), Href: "/app/catalogos/persona/sexo" },
                        ]
                },
                {
                    label: (<span>SISTEMA</span>), Href: "/app/catalogos/sistema", Menus:
                        [
                            { label: (<span>VARIABLES</span>), Href: "/app/catalogos/sistema/variablesGlobales" },
                            { label: (<span>T.IDENTIFICACION</span>), Href: "/app/catalogos/sistema/EventosTipos" },
                        ]
                },
                {
                    label: (<span>CREDITO</span>), Href: "/app/catalogos/credito", Menus:
                        [
                            { label: (<span>T.AVAL</span>), Href: "/app/catalogos/credito/avalesTipos" },
                            { label: (<span>T.LINEA ADICIONAL</span>), Href: "/app/catalogos/credito/lineaAdicionalTipo" },
                            { label: (<span>ESTATUS BURO INTERNO</span>), Href: "/app/catalogos/credito/BuroInternoEstatus" },
                            { label: (<span>ESTATUS PAGARE</span>), Href: "/app/catalogos/credito/PagareEstatus" },
                            { label: (<span>T.REFERENCIAS</span>), Href: "/app/catalogos/credito/ReferenciasTipos" },
                            { label: (<span>ESTATUS DE CREDITO</span>), Href: "/app/catalogos/credito/EstatusCredito" },
                            { label: (<span>ESTADOS COORDINADOR</span>), Href: "/app/catalogos/credito/CatalogoEstadoCoordinador" },
                            { label: (<span>ESTATUS CONSULTA BURO</span>), Href: "/app/catalogos/credito/CatalogoEstatusConsultaBuro" }

                        ]
                },
                {
                    label: (<span>EMPRESA</span>), Href: "/app/catalogos/empresa", Menus:
                        [
                            { label: (<span>EMPRESAS</span>), Href: "/app/catalogos/empresa/Empresas" },
                            { label: (<span>SUCURSALES</span>), Href: "/app/catalogos/empresa/Sucursales" },
                            { label: (<span>SUCURSALES FISICA</span>), Href: "/app/catalogos/empresa/SucursalesFisica" },
                            { label: (<span>ZONAS</span>), Href: "/app/catalogos/empresa/Zonas" },
                            { label: (<span>ZONAS SUCURSALES</span>), Href: "/app/catalogos/empresa/CatalogoZonasSucursales" },
                        ]
                },
                {
                    label: (<span>MESA DE CRÉDITO</span>), Href: "/app/catalogos/credito", Menus:
                        [
                            { label: (<span>MESA DE CRÉDITO</span>), Href: "/app/catalogos/mesacredito/MesaCredito" },
                        ]
                },
                {
                    label: (<span>Mensajes</span>), Href: "/app/catalogos/credito", Menus:
                        [
                            { label: (<span>MENSAJES </span>), Href: "/app/catalogos/empresa/MensajesAceptadoRechazado" },
                        ]
                },
                {
                    label: (<span>Monedas / Archivos</span>), Href: "/app/catalogos/credito", Menus:
                        [
                            { label: (<span>DENOMINACION MONEDA </span>), Href: "/app/catalogos/empresa/DenominacionMoneda" },
                            { label: (<span>ARCHIVO DISPERSION </span>), Href: "/app/catalogos/empresa/ArchivoDispersion" },
                            { label: (<span>LISTA DOCUMENTOS </span>), Href: "/app/catalogos/empresa/CatalogoListaDocumentos" },
                            { label: (<span>ASIGNA DOCUMENTOS </span>), Href: "/app/catalogos/empresa/AsignaDocumentos" }
                        ]
                },
            ]}
        />
    )
}




export const menu: IMenu[] = [
    {
        label: "CATALOGOS",
        items: [
            {

                label: "Ubicaciones",
                icon: "pi pi-table",
                items: [
                    { label: "Ciudades", icon: "fa fa-building", to: "/app/catalogos/ubicaciones/ciudades" },
                    { label: "Estados/Pais", icon: "fa fa-square", to: "/app/catalogos/ubicaciones/estadosPais" },
                    {
                        label: "Vialidades", icon: "fa fa-road", items: [
                            { label: "Tipos", icon: "fa fa-square", to: "/app/catalogos/ubicaciones/vialidades/vialidadTipos" },
                            { label: "Orientación", icon: "pi pi-directions", to: "/app/catalogos/ubicaciones/vialidades/orientacionVialidadTipos" }
                        ]
                    },
                    { label: "Asentamientos", icon: "pi pi-microsoft", to: "/app/catalogos/ubicaciones/asentamientos" },
                    { label: "T.Vivienda", icon: "fa fa-home", to: "/app/catalogos/ubicaciones/viviendasTipos" },
                ]
            },
            {
                label: "Persona", icon: "pi pi-user",
                items: [
                    { label: "T.Documentos", icon: "fa fa-file-alt", to: "/app/catalogos/persona/documentosTipos" },
                    { label: "T.Identificacion", icon: "pi pi-id-card", to: "/app/catalogos/ubicaciones/ciudades" },
                    { label: "Escolaridades", icon: "fa fa-user-tie", to: "/app/catalogos/persona/escolaridades" },
                    { label: "Estado Civil", icon: "fa fa-user-friends", to: "/app/catalogos/persona/estadoCivilTipo" },
                    { label: "Ocupaciones", icon: "fa fa-user-ninja", to: "/app/catalogos/persona/ocupaciones" },
                    { label: "Sexo", icon: "fa fa-mars", to: "/app/catalogos/persona/sexo" },
                ]
            },
            {
                label: "Crédito", icon: "fa fa-money-check-alt", items: [
                    { label: "T.Aval", icon: "fa fa-user-circle", to: "/app/catalogos/credito/avalesTipos" },
                    { label: "T.Linea adicional", icon: "fa fa-grip-lines-vertical", to: "/app/catalogos/credito/lineaAdicionalTipo" },
                    { label: "Estado buro interno", icon: "fa fa-book", to: "/app/catalogos/credito/BuroInternoEstatus" },
                    { label: "Estatus pagare", icon: "fa fa-question-circle", to: "/app/catalogos/credito/PagareEstatus" },
                    { label: "T.Referencia", icon: "fa fa-user-friends", to: "/app/catalogos/credito/ReferenciasTipos" },
                    { label: "Estatus crédito", icon: "fa fa-info-circle", to: "/app/catalogos/credito/EstatusCredito" },
                    { label: "Estatus coordinador", icon: "fa fa-user-tie", to: "/app/catalogos/credito/CatalogoEstadoCoordinador" },
                    { label: "Estatus Consulta Buro", icon: "fa fa-user-tie", to: "/app/catalogos/credito/CatalogoEstatusConsultaBuro" }
                ]
            },
            {
                label: "Empresa", icon: "fa fa-industry", items: [
                    { label: "Empresas", icon: "fa fa-industry", to: "/app/catalogos/empresa/Empresas" },
                    { label: "Sucursales", icon: "fa fa-store-alt", to: "/app/catalogos/empresa/Sucursales" },
                    { label: "Sucursales Físicas", icon: "fa fa-store", to: "/app/catalogos/empresa/SucursalesFisica" },
                    { label: "Zonas", icon: "fa fa-city", to: "/app/catalogos/empresa/Zonas" },
                    { label: "Zonas Sucursales", icon: "fa fa-city", to: "/app/catalogos/empresa/CatalogoZonasSucursales" },
                    { label: "Directores", icon: "fa fa-user-tie", to: "/app/catalogos/empresa/Directores" },
                ]
            },
            {
                label: "Mesa de crédito", icon: "fa fa-table", items: [
                    { label: "Mesa de crédito", icon: "fa fa-table", to: "/app/catalogos/mesacredito/MesaCredito" }
                ]
            },
            {
                label: "Mensajes", icon: "fa fa-comments", items: [
                    { label: "Mensajes", icon: "fa fa-comments", to: "/app/catalogos/empresa/MensajesAceptadoRechazado" }
                ]
            },
            {
                label: "Monedas / Archivos", icon: "fa fa-coins", items: [
                    { label: "Denominación", icon: "fa fa-hashtag", to: "/app/catalogos/empresa/DenominacionMoneda" },
                    { label: "Archivos dispersión", icon: "fa fa-file-alt", to: "/app/catalogos/empresa/ArchivoDispersion" },
                    { label: "Lista documentos", icon: "fa fa-copy", to: "/app/catalogos/empresa/CatalogoListaDocumentos" },
                    { label: "Asigna documentos", icon: "fa fa-file-export", to: "/app/catalogos/empresa/AsignaDocumentos" },
                ]
            }
        ]
    }
]