import React from 'react'

import { FaCheck, FaPencilAlt, FaPlusCircle, FaUserAlt } from 'react-icons/fa'
import { FcBusiness, FcBusinessman, FcHome, FcPhoneAndroid } from 'react-icons/fc'
import moment from 'moment'

import Tabs from '../../../../../global/Tabs'
import { Acordion } from '../../../../../global'
import { MdClose } from 'react-icons/md'
import { FormateoDinero } from '../../../../../../global/variables'

import { DBConfia_General } from '../../../../../../interfaces_db/DBConfia/General'


type PerfilType = {
    Persona: DBConfia_General.IPersonas_VW,
    Direcciones: DBConfia_General.IDirecciones_VW[],
    Empleos: DBConfia_General.IEmpleos_VW[],

    // Detalle
    MostrarAgregarEmpleo?(): any,
    MostrarAgregarDireccion?(): any,
    MostrarEditarPersona?(): any,
    OcultarFormas?(): any
}
const Perfil = ({ Persona, Direcciones, Empleos, MostrarAgregarEmpleo, MostrarAgregarDireccion, MostrarEditarPersona }: PerfilType) => {
    return (
        <div>
            <div className={'text-center mb-3'}>
                <FaUserAlt className="rounded-circle avatar-md" />
                <h4 className={'mt-2 mb-0'}>{Persona.NombreCompleto}</h4>
                <p className={"mb-1"}>BURO: <strong style={{ color: Persona.BuroInternoColor }}>{Persona.BuroInternoEstatus}</strong></p>
                {MostrarEditarPersona !== undefined &&
                    <button className={'btn btn-circle btn-sm btn-confia text-white mt-2 fw-bold'} onClick={MostrarEditarPersona}>
                        <FaPencilAlt size={14} />
                    </button>
                }
            </div>
            <Tabs TabSelecionado={'personales'} Justified={true} Kind={Tabs.TabsKind.CUSTOM}>
                <Tabs.Tab Titulo={<FcBusinessman size={20} />} Identificador={'personales'}>
                    <div>
                        <p className={'mt-0 mb-1'}><strong>RFC:</strong>&nbsp;{Persona.RFC}</p>
                        <p className={'mt-0 mb-1'}><strong>CURP:</strong>&nbsp;{Persona.CURP}</p>
                        <hr />
                        <p className={'mt-0 mb-1'}><strong>F.Nacimiento:</strong>&nbsp;{moment(Persona.FechaNacimiento).format('DD-MM-YYYY')}</p>
                        <p className={'mt-0 mb-1'}><strong>Conyuge:</strong>&nbsp;{Persona.NombreConyuge}</p>
                        <p className={'mt-0 mb-1'}><strong>Sexo:</strong>&nbsp;{Persona.Sexo}</p>
                        <p className={'mt-0 mb-1'}><strong>E.Civil:</strong>&nbsp;{Persona.EstadoCivil ?? '-'}</p>
                        <p className={'mt-0 mb-1'}><strong>Escolaridad:</strong>&nbsp;{Persona.Escolaridad}</p>
                        <p className={'mt-0 mb-1'}><strong>Identificaci&oacute;n:</strong>&nbsp;{Persona.identificacionTipo} - {Persona.identificacionNumero}</p>
                        <hr />
                        <p className={'mt-0 mb-1'}><strong>Ingreso Mensual:</strong>&nbsp;{FormateoDinero.format(Persona.IngresosMensuales)}</p>
                        <p className={'mt-0 mb-1'}><strong>Dependientes Economicos:</strong>&nbsp;{Persona.DependientesEconomicos}</p>

                    </div>
                </Tabs.Tab>
                <Tabs.Tab Titulo={<FcPhoneAndroid size={20} />} Identificador={'contacto'}>
                    <div>
                        <p className={'mt-0 mb-1'}><strong>Tel.Casa:</strong>&nbsp;{Persona.TelefonoDomicilio}</p>
                        <p className={'mt-0 mb-1'}><strong>Tel.Movil:</strong>&nbsp;{Persona.TelefonoMovil}</p>
                        <p className={'mt-0 mb-1'}><strong>E-Mail:</strong>&nbsp;{Persona.CorreoElectronico}</p>
                    </div>
                </Tabs.Tab>
                <Tabs.Tab Titulo={<FcHome size={20} />} Identificador={'ubicacion'}>
                    <Acordion TabSelecionado={'dir_0'}>
                        <div>
                            {MostrarAgregarDireccion !== undefined &&
                                <div style={{ position: 'absolute', right: '15px', zIndex: 11, cursor: 'pointer' }} title={'Agregar dirección'} onClick={MostrarAgregarDireccion}>
                                    <FaPlusCircle size={25} />
                                </div>
                            }
                            <div>
                                {Direcciones.map((d, dId) =>
                                    <Acordion.Tab key={'dir_' + dId} Identificador={'dir_' + dId} Titulo={
                                        `
                                            ${d.vialidadTipo}
                                            ${d.NombreVialidad}
                                            [${d.orientacionVialidadTipo}] 
                                            NO. ${d.NumeroExterior}
                                            ${d.NumeroInterior !== undefined ? <span>, NO. INTERIOR: {d.NumeroInterior}</span> : ''}
                                            ${d.NumeroInterior ? <span>, No.Interior: {d.NumeroInterior}</span> : ''} - ${d.Asentamiento}
                                        `
                                    }>
                                        <div>
                                            <p className={'inbox-item-text text-muted mt-0 mb-1'}><strong>Estado:</strong>&nbsp;{d.Estado}</p>
                                            <p className={'inbox-item-text text-muted mt-0 mb-1'}><strong>Municipio:</strong>&nbsp;{d.Municipio}</p>
                                            <p className={'inbox-item-text text-muted mt-0 mb-1'}><strong>Ciudad:</strong>&nbsp;{d.Ciudad}</p>
                                            <p className={'inbox-item-text text-muted mt-0 mb-1'}>
                                                <strong>Dirección:</strong>&nbsp;
                                                {d.vialidadTipo}&nbsp;{d.NombreVialidad} [{d.orientacionVialidadTipo}], NO. {d.NumeroExterior}
                                                {d.NumeroInterior && <span>, No.Interior: {d.NumeroInterior}</span>}, {d.Asentamiento}
                                            </p>
                                            <p className={'inbox-item-text text-muted mt-0 mb-1'}><strong>CP:&nbsp;</strong>{d.CodigoPostal}</p>
                                            <p className={'inbox-item-text text-muted mt-0 mb-1'}><strong>Referencias:&nbsp;</strong>{d.CodigoPostal}</p>
                                            <p className={'inbox-item-text text-muted mt-0 mb-1'}><strong>T.Vivienda:&nbsp;</strong>{d.vialidadTipo}</p>
                                        </div>
                                    </Acordion.Tab>
                                )}
                            </div>
                        </div>
                    </Acordion>
                </Tabs.Tab>
                <Tabs.Tab Titulo={<FcBusiness size={20} />} Identificador={'empleo'}>
                    <Acordion TabSelecionado={'job_0'}>
                        <div>
                            {MostrarAgregarEmpleo !== undefined &&
                                <div style={{ position: 'absolute', right: '15px', zIndex: 10, cursor: 'pointer' }} title={'Agregar empleo'} onClick={MostrarAgregarEmpleo}>
                                    <FaPlusCircle size={25} />
                                </div>
                            }
                            {Empleos.map((d, dId) =>
                                <Acordion.Tab key={'job_' + dId} Identificador={'job_' + dId} Titulo={`Trabajo de [${d.Puesto}] para ${d.Empresa}`}>
                                    <div>
                                        <p className={'inbox-item-text text-muted mt-0 mb-1'}><strong>Teléfono:</strong>&nbsp;{d.Telefono}</p>
                                        <p className={'inbox-item-text text-muted mt-0 mb-1'}><strong>F.Ingreso:</strong>&nbsp;{d.FechaIngreso}</p>
                                        <p className={'inbox-item-text text-muted mt-0 mb-1'}><strong>Activo:</strong>&nbsp;{d.Activo ? <span>Si <FaCheck /></span> : <span>No <MdClose /></span>}</p>
                                        <hr className={'mt-1 mb-1'} />
                                        <p className={'inbox-item-text text-muted mt-0 mb-1'}><strong>Estado:</strong>&nbsp;{d.Direccion_Estado}</p>
                                        <p className={'inbox-item-text text-muted mt-0 mb-1'}><strong>Municipio:</strong>&nbsp;{d.Direccion_Municipio}</p>
                                        <p className={'inbox-item-text text-muted mt-0 mb-1'}><strong>Ciudad:</strong>&nbsp;{d.Direccion_Ciudad}</p>
                                        <p className={'inbox-item-text text-muted mt-0 mb-1'}>
                                            <strong>Dirección:</strong>&nbsp;
                                            {d.Direccion_vialidadTipo}&nbsp;{d.Direccion_NombreVialidad} [{d.Direccion_orientacionVialidadTipo}], NO. {d.Direccion_NumeroExterior}
                                            {d.Direccion_NumeroInterior && <span>, No.Interior: {d.Direccion_NumeroInterior}</span>}, {d.Direccion_Asentamiento}
                                        </p>
                                        <p className={'inbox-item-text text-muted mt-0 mb-1'}><strong>CP:&nbsp;</strong>{d.Direccion_CodigoPostal}</p>
                                        <p className={'inbox-item-text text-muted mt-0 mb-1'}><strong>Referencias:&nbsp;</strong>{d.Direccion_CodigoPostal}</p>
                                        <p className={'inbox-item-text text-muted mt-0 mb-1'}><strong>T.Vivienda:&nbsp;</strong>{d.Direccion_vialidadTipo}</p>
                                    </div>
                                </Acordion.Tab>
                            )}
                        </div>
                    </Acordion>
                </Tabs.Tab>
            </Tabs>
        </div>
    )
}
export default Perfil