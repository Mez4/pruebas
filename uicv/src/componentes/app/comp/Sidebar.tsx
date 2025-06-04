import React from 'react'
import { FaChartLine, FaCogs, FaDatabase, FaPiggyBank } from 'react-icons/fa'
import Menu from './sidebarComp/Menu'
import MultipleMenu from './sidebarComp/MultipleMenu'

type Sidebartype = {
    location: any
}
const Sidebar = (props: Sidebartype) => {

    return (
        <div className="vertical-menu">
            <div className="simplebar-wrapper m-0">
                <div className="simplebar-height-auto-observer-wrapper">
                    <div className="simplebar-height-auto-observer"></div>
                </div>
                <div className="simplebar-mask">
                    <div className="simplebar-offset" style={{ right: "0px", bottom: "0px" }}>
                        <div className="simplebar-content-wrapper" style={{ height: "100%", overflow: "hidden" }}>
                            <div className="simplebar-content p-0">
                                <div id="sidebar-menu" className="pt-0 mm-active">
                                    <ul className="metismenu list-unstyled mm-show" id="side-menu">
                                        <li className="menu-title">Menu</li>

                                        <Menu path={"/app"} current_Path={props.location.pathname} Label="Indicadores" Icon={FaChartLine} />

                                        <MultipleMenu base={"/app/bancos"} location={props.location} Label="Bancos" Icon={FaPiggyBank}>                                   
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/bancos/banco" Label="Bancos" />  
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/bancos/cuentacorte" Label="Corte de Caja" />                                                                    
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/bancos/cuenta" Label="Cuentas" />   
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/bancos/denominacion" Label="Denominaciones" />                                            
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/bancos/dispersion" Label="Dispersiones" />
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/bancos/dispersionestatus" Label="Dispersiones Estatus" />
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/bancos/movimiento" Label="Movimientos" />
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/bancos/tipodesembolso" Label="Tipos Desembolso" />
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/bancos/tipomovimiento" Label="Tipos Movimientos" />
                                        </MultipleMenu>
                                        <MultipleMenu base={"/app/catalogos"} location={props.location} Label="Catalogos" Icon={FaDatabase}>
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/catalogos/viviendasTipos" Label="Viviendas" />
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/catalogos/documentosTipos" Label="Tipos de Documento" />
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/catalogos/variablesGlobales" Label="Variables Globales" />
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/catalogos/estadosPais" Label="Estados" />
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/catalogos/escolaridades" Label="Escolaridades" />
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/catalogos/orientacionVialidadTipos" Label="Tipos de Orientacion de Vialidad" />

                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/catalogos/avalesTipos" Label="Avales Tipos" />
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/catalogos/ciudades" Label="Ciudades" />
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/catalogos/estadoCivilTipo" Label="Estado Civil Tipos" />
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/catalogos/lineaAdicionalTipo" Label="Lineas adicionales Tipos" />
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/catalogos/asentamientos" Label="Asentamientos" />
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/catalogos/vialidadTipos" Label="Vialidad Tipos" />
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/catalogos/identificacionesTipos" Label="Identificaciones Tipos" />
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/catalogos/BuroInternoEstatus" Label="Estatus Buro Interno" />
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/catalogos/PagareEstatus" Label="Estatus Pagare" />
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/catalogos/ReferenciasTipos" Label="Tipos Referencias" />
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/catalogos/EventosTipos" Label="Tipos Eventos" />
                                        </MultipleMenu>

                                        <MultipleMenu base={"/app/sistemas"} location={props.location} Label="Sistemas" Icon={FaCogs}>
                                            <MultipleMenu.MultipleMenuitem location={props.location} Path="/app/sistemas/usuarios" Label="Usuarios" />
                                        </MultipleMenu>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
