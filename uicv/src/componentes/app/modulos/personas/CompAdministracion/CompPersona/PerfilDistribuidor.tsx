import React from 'react'
import { Link } from 'react-router-dom'

// Icons
import { FaCheck, FaLink } from 'react-icons/fa'
import { FiAlertTriangle } from 'react-icons/fi'
import { GrClose } from 'react-icons/gr'
import { RiGroupLine } from 'react-icons/ri'
import { MdGroup } from 'react-icons/md'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { HiDocument, HiOutlineDocument } from 'react-icons/hi'

// Formateo de fechas
import moment from 'moment'

// Gerneral components
import { FormateoDinero } from '../../../../../../global/variables'
import Tabs from '../../../../../global/Tabs'

type PerfilType = {
    Distribuidor: any | null,
    AvalesDistribuidor: any[] | null,
    Clientes: any[] | null,
    Contratos: any[] | null
}
const PerfilDistribuidor = ({ Distribuidor, AvalesDistribuidor, Clientes, Contratos }: PerfilType) => {

    if (Distribuidor === null)
        return (
            <div className='text-center'>
                <FiAlertTriangle size={25} />
                <p><strong>No es una socia</strong></p>
            </div>
        )

    return (
        <div>
            <div className={'text-center'}>
                <h5 className={'mt-2 mb-0'}>{Distribuidor.empresaNombre}</h5>
                <h6 className={'mt-0 mb-0'}>{Distribuidor.ZonaNombre}</h6>
                <p className={'mt-0 mb-0'}>Sucursal {Distribuidor.Sucursal_Nombre}</p>
            </div>
            <Tabs Justified={true} Kind={Tabs.TabsKind.CUSTOM} TabSelecionado='general'>
                <Tabs.Tab Identificador='general' Titulo={<React.Fragment><AiOutlineInfoCircle size={18} /><br /> General</React.Fragment>}>
                    <div className={'mb-3'}>
                        <p className={'mt-0 mb-0'}>No. Socia: <strong>{Distribuidor.NumeroDist}</strong></p>
                        <p className={'mt-0 mb-0'}>Referencia Contable: <strong>{Distribuidor.ReferenciaContable}</strong></p>
                        <p className={'mt-0 mb-0'}>ESTADO: <strong>{Distribuidor.Estatus_DistribuidoresEstatus}</strong></p>
                        <hr />
                        <p className={'mt-0 mb-0'}>Especial:&nbsp;{Distribuidor.Estatus_Especial ? <React.Fragment><FaCheck /> Si</React.Fragment> : <GrClose />}</p>
                        <p className={'mt-0 mb-0'}>Orden:&nbsp;{Distribuidor.Estatus_Orden ? <FaCheck /> : <GrClose />}</p>
                        <p className={'mt-0 mb-0'}>Puede Canjear:&nbsp;{Distribuidor.Estatus_Orden ? <FaCheck /> : <GrClose />}</p>
                        <hr />
                        <p className={'mt-0 mb-0'}>NIVEL <strong>{Distribuidor.Nivel_DistribuidorNivel}</strong></p>
                        {/* <p className={'mt-0 mb-0'}>Capital Colocado Maximo:&nbsp;<strong>{FormateoDinero.format(Distribuidor.Nivel_CapitalColocadoMaximo)}</strong></p>
                        <p className={'mt-0 mb-0'}>Capital Colocado Minimo:&nbsp;<strong>{FormateoDinero.format(Distribuidor.Nivel_CapitalColocadoMinimo)}</strong></p> */}
                        <p className={'mt-0 mb-0'}>Proteccion de saldo:&nbsp;<strong>{Distribuidor.Nivel_ImporteProteccionSaldo}</strong></p>
                        <p className={'mt-0 mb-0'}>Canje Aval:&nbsp;<strong>{FormateoDinero.format(Distribuidor.Nivel_maximoImporteCanjeAval)}</strong></p>
                        <p className={'mt-0 mb-0'}>Canje Cliente:&nbsp;<strong>{FormateoDinero.format(Distribuidor.Nivel_maximoImporteCanjeCliente)}</strong></p>
                        <p className={'mt-0 mb-0'}>Maximo Prestamo Personal:&nbsp;<strong>{FormateoDinero.format(Distribuidor.Nivel_maximoPrestamoPersonal)}</strong></p>
                        <p className={'mt-0 mb-0'}>Comision Base:&nbsp;<strong>{Distribuidor.Nivel_PorcComisionBase}</strong></p>
                    </div>
                </Tabs.Tab>
                <Tabs.Tab Identificador='avales' Titulo={<React.Fragment><RiGroupLine size={18} /> <br />Avales</React.Fragment>}>
                    <div className="table-responsive">
                        <table className="table align-middle table-centered table-vertical table-nowrap">
                            <tbody>
                                {AvalesDistribuidor !== undefined && (AvalesDistribuidor as any[]).map((a, aId) =>
                                    <tr key={'dis_' + aId}>
                                        <td><Link to={`${a.PersonaID}`} className={"btn btn-link waves-effect"}><FaLink /> {a.NombreCompleto}</Link></td>
                                        <td>
                                            <span className="badge rounded-pill" style={{ backgroundColor: a.ColorAval }}>{a.TipoAval}</span>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Tabs.Tab>
                <Tabs.Tab Identificador='clientes' Titulo={<React.Fragment><MdGroup size={18} /> <br />Clientes</React.Fragment>}>
                    <div className="table-responsive">
                        <table className="table align-middle table-centered table-vertical table-nowrap">
                            <tbody>
                                {Clientes !== undefined && (Clientes as any[]).map((c, cId) =>
                                    <tr key={'clie_' + cId}>
                                        <td><Link to={`${c.PersonaID}`} className={"btn btn-link waves-effect"}><FaLink /> {c.NombreCompleto}</Link></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Tabs.Tab>
                <Tabs.Tab Identificador='contratos' Titulo={<React.Fragment><HiDocument size={18} /><br />Contratos</React.Fragment>}>
                    <div className="inbox-wid">
                        {Contratos !== undefined && (Contratos as any[]).map((c, cId) =>
                            <div className="text-dark" key={'con_' + cId}>
                                <div className="inbox-item">
                                    <div className="inbox-item-img float-start me-3">
                                        <HiOutlineDocument size={30} />
                                    </div>
                                    <p className="inbox-item-author mb-0 font-size-20">#{c.ContratoID}</p>
                                    <p className="inbox-item-text text-muted mb-0">
                                        PRODUCTO: <strong>{c.ProductoNombre}</strong>< br />
                                        LINEA-CREDITO: <strong>{FormateoDinero.format(c.LineaCredito)}</strong>< br />
                                        DISPONIBLE: <strong>{FormateoDinero.format(c.LineaCreditoDisponible)}</strong>< br />
                                        COORDINADOR: <Link to="#/"><FaLink /> {c.coordinadorNombre}</Link>< br />
                                    </p>
                                    <p className="inbox-item-date text-muted"><strong>{moment(c.FechaHoraRegistro, 'YYYY-MM-DD').format("DD / MM / YYYY")}</strong></p>
                                    <p className="inbox-item-date text-muted"><strong>{moment(c.FechaHoraRegistro, 'YYYY-MM-DD').format("DD / MM / YYYY")}</strong></p>
                                </div>
                            </div>
                        )}
                    </div>
                </Tabs.Tab>
            </Tabs>
        </div>
    )
}
export default PerfilDistribuidor