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
                { label: (<span>BANCOS</span>), Funcion: (par) => alert(par.Det), Parametros: { Det: "DO" }, Href: "" },
                {
                    label: (<span>CATALOGOS</span>), Href: "/app/:productoId/bancos/catalogos", Permiso: "SEGURIDAD_USUARIO_ADMIN",
                    Menus: [
                        // label: (<span>DISPERSION ESATUS</span>), Href: "/app/bancos/catalogos/dispersionestatus" },
                        { label: (<span>T.DESEMBOLSO</span>), Href: "/app/:productoId/bancos/catalogos/tipodesembolso" },
                        { label: (<span>T.DESEMBOLSO SUCURSAL</span>), Href: "/app/:productoId/bancos/catalogos/tipodesembolsosucursal" },
                        // { label: (<span>DENOMINACIONES</span>), Href: "/app/bancos/catalogos/denominacion" },
                        { label: (<span>T.MOVIMIENTO</span>), Href: "/app/:productoId/bancos/catalogos/tipomovimiento" },
                        //{ label: (<span>BANCOS</span>), Href: "/app/bancos/catalogos/banco" },
                        // { label: (<span>CUENTAS</span>), Href: "/app/bancos/catalogos/cuenta" },
                        //{ label: (<span>DISPERCIONES</span>), Href: "/app/bancos/catalogos/dispersion" },
                        // { label: (<span>MOVIMIENTOS</span>), Href: "/app/bancos/catalogos/movimiento" },
                        // { label: (<span>CUENTA CORTE</span>), Href: "/app/bancos/catalogos/cuentacorte" },
                        // { label: (<span>PARAMETROS BANCOS</span>), Href: "/app/bancos/catalogos/parametrosbancos" },
                        // { label: (<span>ALTA ANALISTAS</span>), Href: "/app/bancos/catalogos/altaanalista" },
                        // { label: (<span>CATALOGO CUENTAS BANCO</span>), Href: "/app/bancos/catalogos/CatalogoCuentasBanco" },
                        // { label: (<span>CATALOGO BANCOS</span>), Href: "/app/bancos/catalogos/CatalogoBanco" },
                        // { label: (<span>DISPERSION</span>), Href: "/app/bancos/catalogos/CatalogoDispersiones" },
                        // { label: (<span>CORRESPONSALES PAGOS</span>), Href: "/app/bancos/catalogos/corresponsalespago" },
                        { label: (<span>CUENTAS LKS</span>), Href: "/app/:productoId/bancos/catalogos/bancocuentas" },
                        { label: (<span>BANCOS LKS</span>), Href: "/app/:productoId/bancos/catalogos/bancobancos" },
                        { label: (<span>CUENTAS MAESTRAS</span>), Href: "/app/:productoId/bancos/catalogos/bancocuentasmaestras" },
                        // { label: (<span>PARAMETROS BANCOS</span>), Href: "/app/bancos/catalogos/parametrosbancos" },
                        //{ label: (<span>ALTA ANALISTAS</span>), Href: "/app/bancos/catalogos/altaanalista" },
                        { label: (<span>TIPO BANCOS</span>), Href: "/app/:productoId/bancos/catalogos/catalogoTipoBancos" },

                    ]
                },
            ]}
        />
    )
}
