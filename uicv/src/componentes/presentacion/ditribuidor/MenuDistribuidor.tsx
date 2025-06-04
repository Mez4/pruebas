import React from 'react'
import { IOidc } from '../../../interfaces/oidc/IOidc'
import { MenuBarra } from '../../global/'
import { FaChevronDown } from 'react-icons/fa'

type PerfilDistribuidorTipo = {
    oidc: IOidc
    DistribuidorID: number
}

const MenuDistribuidor = ({ oidc, DistribuidorID }: PerfilDistribuidorTipo) => {
    return(
        <div className="row" style={{float: 'right'}}>
            <div className="col-sm-12 col-md-12 col-lg-6" style={{width: '15em'}}>
                <div className="text-center">
                    <MenuBarra styleButton={{padding: '0px', height: '1.3em'}} Titulo={<div style={{color: 'black'}}><strong>GENERAL</strong> <FaChevronDown size={14} /></div>}>
                        <a className="dropdown-item" href="#"><i className="mdi mdi-lock-open-outline font-size-17 text-muted align-middle me-1"></i> Experiencia en ventas</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#"><i className="mdi mdi-lock-open-outline font-size-17 text-muted align-middle me-1"></i> Opciones de buro</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#"><i className="mdi mdi-lock-open-outline font-size-17 text-muted align-middle me-1"></i> Datos bancarios</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#"><i className="mdi mdi-lock-open-outline font-size-17 text-muted align-middle me-1"></i> Definir contraseña App</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#"><i className="mdi mdi-lock-open-outline font-size-17 text-muted align-middle me-1"></i> Registrar direcciones envío CS</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#"><i className="mdi mdi-lock-open-outline font-size-17 text-muted align-middle me-1"></i> Log Cambio de celular</a>
                        <div className="dropdown-divider"></div>
                    </MenuBarra>
                </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-6" style={{width: '15em'}}>
                <div className="text-center">
                    <MenuBarra styleButton={{padding: '0px', height: '1.3em'}} Titulo={<div style={{color: 'black'}}><strong>CREDITO</strong> <FaChevronDown size={14} /></div>}>
                        <a className="dropdown-item" href="#"><i className="mdi mdi-lock-open-outline font-size-17 text-muted align-middle me-1"></i> Expediente digital</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#"><i className="mdi mdi-lock-open-outline font-size-17 text-muted align-middle me-1"></i> Imprimir contrato</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#"><i className="mdi mdi-lock-open-outline font-size-17 text-muted align-middle me-1"></i> Valeras</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#"><i className="mdi mdi-lock-open-outline font-size-17 text-muted align-middle me-1"></i> Asignar Gestor</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#"><i className="mdi mdi-lock-open-outline font-size-17 text-muted align-middle me-1"></i> Asignar estatus especial</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#"><i className="mdi mdi-lock-open-outline font-size-17 text-muted align-middle me-1"></i> Soporte</a>
                        <div className="dropdown-divider"></div>
                    </MenuBarra>
                </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-6" style={{width: '15em'}}>
                <div className="text-center">
                    <MenuBarra styleButton={{padding: '0px', height: '1.3em'}} Titulo={<div style={{color: 'black'}}><strong>LINEA DE CRÉDITO</strong> <FaChevronDown size={14} /></div>}>
                        <a className="dropdown-item" href="#"><i className="mdi mdi-lock-open-outline font-size-17 text-muted align-middle me-1"></i> Reactivar linea de CRÉDITO</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#"><i className="mdi mdi-lock-open-outline font-size-17 text-muted align-middle me-1"></i> Activar no incrementos</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#"><i className="mdi mdi-lock-open-outline font-size-17 text-muted align-middle me-1"></i> Incremento de linea</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#"><i className="mdi mdi-lock-open-outline font-size-17 text-muted align-middle me-1"></i> Decremento de linea</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#"><i className="mdi mdi-lock-open-outline font-size-17 text-muted align-middle me-1"></i> Genera convenio</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#"><i className="mdi mdi-lock-open-outline font-size-17 text-muted align-middle me-1"></i> Ver convenio</a>
                        <div className="dropdown-divider"></div>
                    </MenuBarra>
                </div>
            </div>
        </div>
    )
}

export default MenuDistribuidor