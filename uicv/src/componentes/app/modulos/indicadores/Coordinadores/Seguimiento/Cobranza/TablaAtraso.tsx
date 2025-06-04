import React from 'react'
import DataTable from 'react-data-table-component'
import { FaCalendar, FaCircle } from 'react-icons/fa'
import { FormateoNumero } from '../../../../../../../global/variables'
import Tsp_HiTIndicadores_sp_Historicos from '../../../../../../../interfaces/sp/TIndicadores_sp_Historicos'
import { Card } from '../../../../../../global'
import TIndicadorSP from './TIndicadorSP'

const TablaAtraso = (props: { indicador: TIndicadorSP, distribuidoras090: Tsp_HiTIndicadores_sp_Historicos[] }) => {

    // Estado de cuenta
    const [estadoCuenta, definirEstadoCuenta] = React.useState<string>('');
    const [tipoReporte, definirTipoReporte] = React.useState<number>(0)

    const DiasAtrasoInicio = tipoReporte === 0 || tipoReporte === 1 ? 1 : 45
    const DiasAtrasoFin = tipoReporte === 0 ? 15 : tipoReporte === 1 ? 45 : 90

    return (
        <div>
            <h4>Detalle de cobranza</h4>
            <Card Title={
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyItems: 'center' }}>

                    <FaCalendar className={'mr-2 is-size-7'} />
                    <span className='is-size-7 has-text-weight-semibold'>Días atraso entre:</span>
                    <button style={{ width: "60px" }} className={`ml-2 btn btn-sm ${tipoReporte === 0 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => definirTipoReporte(0)}><strong>1 / 15</strong></button>
                    <button style={{ width: "60px" }} className={`ml-2 btn btn-sm ${tipoReporte === 1 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => definirTipoReporte(1)}><strong>1 / 45</strong></button>
                    <button style={{ width: "60px" }} className={`ml-2 btn btn-sm ${tipoReporte === 2 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => definirTipoReporte(2)}><strong>46 / 90</strong></button>
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
                        data={props.distribuidoras090.filter(f =>
                            (f.Pendiente ?? 0) > 1
                            && f.DiasAtraso <= DiasAtrasoFin
                            && f.DiasAtraso >= DiasAtrasoInicio
                            && (estadoCuenta === '' || f.TipoPago === estadoCuenta)
                        )}
                        striped
                        pagination
                        dense
                        noHeader
                        responsive
                        keyField={"PersonaID"}
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
                                            return <span className='has-text-weight-semibold' style={{ color: 'black' }}><FaCircle className={'mr-2 is-size-7'} />&nbsp;Sin Pago</span>
                                        default:
                                            return <span className='has-text-weight-semibold' style={{ color: 'black' }}><FaCircle className={'mr-2 is-size-7'} />&nbsp;{prop.TipoPago}</span>
                                    }
                                }
                            },
                            { name: 'Suc', selector: 'SucursalID', sortable: true, width: '70px', cell: prop => <span title={prop.Sucursal}>{prop.SucursalId}</span> },
                            { name: 'CV', selector: 'DistribuidorID', sortable: true, width: '100px' },
                            { name: 'VR', selector: 'DistAntNumero', sortable: true, width: '100px', cell: prop => <span>{prop.DistribuidorVR}</span> },

                            { name: 'Nombre', selector: 'Distribuidor', sortable: true, },
                            { name: 'Pendiente', selector: 'Pendiente', sortable: true, width: '150px', right: true, cell: c => <span>$ {FormateoNumero.format(c.Pendiente ?? 0)}</span> },
                            { name: 'D.Atraso', selector: 'DiasAtrasoCierre', sortable: true, width: '150px', right: true, cell: c => <span>{FormateoNumero.format(c.DiasAtraso ?? 0)}</span> },
                            { name: 'S.Riesgo', selector: 'Saldo', sortable: true, width: '150px', right: true, cell: c => <span>$ {FormateoNumero.format(c.Saldo ?? 0)}</span> },
                            { name: 'Pendiente', selector: 'Pendiente', sortable: true, width: '150px', right: true, cell: c => <span>$ {FormateoNumero.format(c.Pendiente ?? 0)}</span> },
                            { name: 'Peso', selector: 'Peso', sortable: true, width: ' 130px', right: true, cell: c => <span>{FormateoNumero.format(c.Porc_Peso)} %</span> },
                        ]}

                        // Valores por defecto
                        paginationPerPage={15}
                    />
                </Card.Body>
            </Card >
        </div>
    )
}
export default TablaAtraso