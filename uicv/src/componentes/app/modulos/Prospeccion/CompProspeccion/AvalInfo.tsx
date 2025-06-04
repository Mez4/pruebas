import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import * as Funciones from './DocsAval/Funciones'

// Icons
import { FaEye, FaSearch, FaCheckCircle, FaClock, FaFileUpload, FaUser } from 'react-icons/fa'

// Custom components
import { Acordion, Card, Spinner } from '../../../../global'
import { CForm } from './DocsAval/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import ReactTooltip from 'react-tooltip';
import VerDocAval from './DocsAval/VerDoc'
import { DBConfia_Prospeccion } from '../../../../../interfaces_db/DBConfia/Prospeccion'
import moment from 'moment'
import { FormateoDinero } from '../../../../../global/variables'

type CatalogosType = {
    DatosGenerales: DBConfia_Prospeccion.IAvales_VW
}

const AvalInfo = (props: CatalogosType) => {
    return (
        <div className="">
            <Acordion TabSelecionado="General">    
                <Acordion.Tab Identificador="General" Titulo={<React.Fragment><FaUser />&nbsp;DATOS GENERALES</React.Fragment>}>
                    <>
                        <div className='row'>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                                <div className="text-start">
                                    <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Fecha Nacimiento:</td>
                                                <td>{moment(props.DatosGenerales.FechaNacimiento).format('DD-MM-YYYY')}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sexo:</td>
                                                <td>{props.DatosGenerales.Sexo}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>CURP: </td>
                                                <td>{props.DatosGenerales.CURP}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>EDO. CIVIL: </td>
                                                <td>{props.DatosGenerales.EstadoCivil}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tel.Movil:</td>
                                                <td>{props.DatosGenerales.TelefonoMovil}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>E-Mail:</td>
                                                <td>{props.DatosGenerales.CorreoElectronico}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Lugar Nacimiento:</td>
                                                <td>{props.DatosGenerales.LugarNacimiento}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dirección:</td>
                                                <td>{props.DatosGenerales.DireccionAval}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Telefono Fijo:</td>
                                                <td>{props.DatosGenerales.TelefonoDomicilio}</td>
                                            </tr>
                                            
                                        </tbody>
                                    </table>
                                </div>
                                <hr />
                                <div className="text-start">
                                    <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                        <thead><strong>DATOS LABORALES</strong></thead>
                                        {!props.DatosGenerales.TieneEmpleo && <tbody>
                                            <tr>
                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>No tiene Empleo</td>
                                                <td></td>
                                            </tr>
                                        </tbody>}
                                        {Boolean(props.DatosGenerales.TieneEmpleo) && <tbody>
                                            <tr>
                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Empresa:</td>
                                                <td>{props.DatosGenerales.Empresa}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ocupación:</td>
                                                <td>{props.DatosGenerales.Ocupacion}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sueldo:</td>
                                                <td>{FormateoDinero.format(props.DatosGenerales.Sueldo ?? 0)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Antigüedad:</td>
                                                <td>{props.DatosGenerales.Antiguedad}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dirección:</td>
                                                <td>{props.DatosGenerales.DireccionEmpresaAval}</td>
                                            </tr>
                                        </tbody>}
                                    </table>
                                </div>
                            </div>

                            <div className="col-sm-12 col-md-6 col-lg-6" style={{borderLeft: 'solid', borderColor: 'lightgray'}}>
                                <div className="text-start">
                                    <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                        <thead><strong>DATOS CONYUGE</strong></thead>
                                        {!props.DatosGenerales.TieneConyuge && <tbody>
                                            <tr>
                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>No tiene conyuge</td>
                                                <td></td>
                                            </tr>
                                        </tbody>}
                                        {Boolean(props.DatosGenerales.TieneConyuge) && <tbody>
                                            <tr>
                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Nombre:</td>
                                                <td>{props.DatosGenerales.NombreConyuge}</td>
                                            </tr>
                                        </tbody>}
                                    </table>
                                </div>
                                {Boolean(props.DatosGenerales.TieneConyuge && props.DatosGenerales.TieneEmpleoConyuge) &&<div className="text-start">
                                    <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                        <thead><strong>DATOS LABORALES CONYUGE</strong></thead>
                                        {<tbody>
                                            <tr>
                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Empresa:</td>
                                                <td>{props.DatosGenerales.EmpresaConyuge}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ocupación:</td>
                                                <td>{props.DatosGenerales.OcupacionConyuge}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sueldo:</td>
                                                <td>{FormateoDinero.format(props.DatosGenerales.SueldoConyuge ?? 0 )}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Antigüedad:</td>
                                                <td>{props.DatosGenerales.AntiguedadConyuge}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dirección:</td>
                                                <td>{props.DatosGenerales.DireccionEmpresaConyugeAval}</td>
                                            </tr>
                                        </tbody>}
                                    </table>
                                </div>}
                            </div>   
  
                        </div>
                    </>
                </Acordion.Tab>
            </Acordion>
        </div>
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(AvalInfo);
