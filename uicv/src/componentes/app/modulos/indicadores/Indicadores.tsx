import React from 'react'
import { Route, Switch } from 'react-router'
import { connect } from 'react-redux'

// Importamos la función para definir nuestro modulo en Redux
import { useAccesoProducto } from '../../../hooks/useAccesoProducto'
import { IMenu } from '../../../../interfaces/ui/IMenu'
import { IEstado } from '../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import { iUI } from '../../../../interfaces/ui/iUI'

// Importamos el detalle de las socias
import CobranzaCoordinador from './Coordinador/Seguimiento/Cobranza'
import CobranzaSucursal from './Sucursales/Seguimiento/Cobranza'
import CobranzaGerente from './Gerente/Seguimiento/Cobranza'

/** Id del modulo */
const ModuloID: number = 1019

/**
 * Componente de administración bancaria
 * @returns Componente de Reactxº
 */
const Indicadores = (props: { oidc: IOidc, ui: iUI }): React.ReactElement => {

    // Validamos el acceso a nuestro producto y Modulo
    useAccesoProducto(ModuloID)

    // Render de los componentes bancarios
    return (
        <div>
            <div className="">
                <Switch>
                    {/** Indicadores de socia */}
                    {/* <Route path="/app/:productoId/indicadores/distribuidoras/seguimiento/cobranza" component={CobranzaCoordinador} /> */}
                    <Route path="/app/:productoId/indicadores/sucursales/seguimiento/cobranza" component={CobranzaSucursal} />
                    <Route path="/app/:productoId/indicadores/coordinador/seguimiento/cobranza/:grupoId?" component={CobranzaCoordinador} />
                    <Route path="/app/:productoId/indicadores/gerente/seguimiento/cobranza" component={CobranzaGerente} />
                    {/** Ruta por defecto */}
                    <Route render={() => <span>Redirect nivel de modulo</span>} />
                </Switch>
            </div>
        </div>
    )
}

export const Indicadores_menu: IMenu[] = [
    {
        label: "INDICADORES",
        items: [
            {
                label: "Tableros",
                icon: "fa fa-table",
                items: [
                    { label: "Sucursales", icon: "fa fa-store", to: "/app/:productoId/indicadores/sucursales/seguimiento/cobranza" },
                    { label: "Coordinadores", icon: "fa fa-users", to: "/app/:productoId/indicadores/coordinador/seguimiento/cobranza" },
                    { label: "Gerentes", icon: "fa fa-users", to: "/app/:productoId/indicadores/gerente/seguimiento/cobranza" },
                ]
            }
        ]
    }
]

const mapStateToProps = (props: IEstado) => ({
    oidc: props.oidc,
    ui: props.UI
})

export default connect(mapStateToProps)(Indicadores)