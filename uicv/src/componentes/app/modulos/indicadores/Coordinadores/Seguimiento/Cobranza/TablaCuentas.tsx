import React from 'react'
import DataTable from 'react-data-table-component'
import { FaCircle, FaShare, FaUserAlt } from 'react-icons/fa'
import { FormateoNumero } from '../../../../../../../global/variables'
import { Card } from '../../../../../../global'
import TIndicadorSP from './TIndicadorSP'

const TablaCuentas = (props: { indicador: TIndicadorSP, definirDistribuidorID(arg: number): void }) => {

    // Estado de cuenta
    const [estadoCuenta, definirEstadoCuenta] = React.useState<string>('');
    const [tipoCuenta, definirTipoCuenta] = React.useState<number>(0)

    return (
        <Card Title={
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyItems: 'center' }}>
                <FaUserAlt className={'mr-2 is-size-7'} />
                <span className='is-size-7 has-text-weight-semibold'>Cuentas con 0 días de atraso:</span>
                <button className={`ml-2 btn btn-sm ${tipoCuenta === 0 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => definirTipoCuenta(0)}>General</button>
                <button className={`ml-2 btn btn-sm ${tipoCuenta === 1 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => definirTipoCuenta(1)}>Convenio</button>
                <div style={{ position: 'absolute', right: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyItems: 'center' }}>
                    <select value={estadoCuenta} onChange={t => { definirEstadoCuenta(t.target.value) }} className="form-select form-select-sm mr-3" aria-label=".form-select-sm example">
                        <option value={''}>Todos [T.Pago]</option>
                        <option value="PA">Anticipado</option>
                        <option value="PP">Puntual</option>
                        <option value="PI">Impuntual</option>
                        <option value="PT">Tardio</option>
                        <option value="SP">Sin-Pago</option>
                    </select>
                </div>
            </div >
        }>
            <Card.Body clssName='p-0'>
                <DataTable
                    data={props.indicador.Cuentas0DiasAtraso.slice(0, -1).filter(f =>
                        (f.Pendiente ?? 0) > 1
                        && (estadoCuenta === '' || f.TipoPago === estadoCuenta)
                        && ((tipoCuenta === 0 && f.DistribuidorEstatus !== 'C') || (tipoCuenta === 1 && f.DistribuidorEstatus === 'C'))
                    )}
                    striped
                    pagination
                    dense
                    noHeader
                    responsive
                    defaultSortField={"OrdenTipoPagoAnt"}
                    defaultSortAsc={true}
                    columns={[
                        {
                            name: 'T.Pago', selector: 'OrdenTipoPagoAnt', sortable: true, width: '130px', cell: prop => {
                                switch (prop.TipoPago) {
                                    case "PA":
                                        return <span className='has-text-weight-semibold' style={{ color: '#347061' }}><FaCircle className={'mr-2 is-size-7'} />&nbsp;Anticipado</span>
                                    case "PP":
                                        return <span className='has-text-weight-semibold' style={{ color: '#268E74' }}><FaCircle className={'mr-2 is-size-7'} />&nbsp;Puntual</span>
                                    case "PI":
                                        return <span className='has-text-weight-semibold' style={{ color: '#F3D104' }}><FaCircle className={'mr-2 is-size-7'} />&nbsp;Impuntual</span>
                                    case "PT":
                                        return <span className='has-text-weight-semibold' style={{ color: '#e02f2f' }}><FaCircle className={'mr-2 is-size-7'} />&nbsp;Tardio</span>
                                    case "SP":
                                        return <span className='has-text-weight-semibold' style={{ color: '#black' }}><FaCircle className={'mr-2 is-size-7'} />&nbsp;Sin Pago</span>
                                    default:
                                        return <span className='has-text-weight-semibold' style={{ color: 'black' }}><FaCircle className={'mr-2 is-size-7'} />&nbsp;{prop.TipoPago}</span>
                                }
                            }
                        },
                        { name: 'Suc', selector: 'SucursalID', sortable: true, width: '70px', cell: prop => <span title={prop.Sucursal}>{prop.SucursalId}</span> },
                        { name: 'CV', selector: 'DistribuidorID', sortable: true, width: '100px' },
                        { name: 'VR', selector: 'DistAntNumero', sortable: true, width: '110px', cell: prop => <span>{prop.DistribuidorVR}</span> },

                        { name: 'Nombre', selector: 'Distribuidor', sortable: true, },
                        { name: 'Pendiente', selector: 'Pendiente', sortable: true, width: '150px', right: true, cell: c => <span>$ {FormateoNumero.format(c.Pendiente ?? 0)}</span> },
                        { name: 'Peso', selector: 'Pendiente', sortable: true, width: ' 130px', right: true, cell: c => <span>{FormateoNumero.format(c.Porc_Peso)} %</span> },
                        { name: '', sortable: false, width: '50px', cell: prop => <span onClick={() => { props.definirDistribuidorID(prop.DistribuidorID) }} className='has-text-link' style={{ cursor: 'pointer' }}><FaShare /></span> },
                    ]}

                    // Valores por defecto
                    paginationPerPage={15}
                />
            </Card.Body>
        </Card >
    )
}
export default TablaCuentas