import React from 'react'
import DataTable from 'react-data-table-component'
import { FaCircle, FaUserAlt } from 'react-icons/fa'
import { FormateoDinero } from '../../../../../../../global/variables'
import Tsp_HiTIndicadores_sp_Historicos from '../../../../../../../interfaces/sp/TIndicadores_sp_Historicos'
import { Card } from '../../../../../../global'
import TIndicadorSP from './TIndicadorSP'

const TablaIncrementos = (props: { indicador: TIndicadorSP, distribuidoras090: Tsp_HiTIndicadores_sp_Historicos[] }) => {

    // Estado de cuenta
    const [estadoCuenta, definirEstadoCuenta] = React.useState<string>('');

    return (
        <React.Fragment>
            <h4>Incrementos</h4>
            <Card Title={
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyItems: 'center' }}>

                    <FaUserAlt className={'mr-2 is-size-7'} />
                    <span className='is-size-7 has-text-weight-semibold'>Socias con posible incremento</span>
                    <div style={{ position: 'absolute', right: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyItems: 'center' }}>
                        <select value={estadoCuenta} onChange={t => { definirEstadoCuenta(t.target.value) }} className="form-select form-select-sm mr-3" aria-label=".form-select-sm example">
                            <option value={''}>Todos [T.Pago]</option>
                            <option value="PA">Anticipado</option>
                            <option value="PP">Puntual</option>
                        </select>
                    </div>
                </div >
            }>
                <Card.Body clssName='pt-1 pl-0 pr-0 pb-0'>
                    <DataTable
                        data={props.distribuidoras090
                            //     .filter(f =>
                            //     (f.IncrementoSugerido ?? 0) > 0
                            //     && (estadoCuenta === '' || f.TipoPagoAnt1 === estadoCuenta)
                            // )
                        }
                        striped
                        pagination
                        dense
                        noHeader
                        responsive
                        keyField={"DistribuidorID"}
                        defaultSortField={"PDisponible"}
                        defaultSortAsc={false}
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
                            // { name: 'Limite', selector: 'Limite', sortable: true, width: '150px', right: true, cell: c => <span>{FormateoDinero.format(c.Limite ?? 0)}</span> },
                            // { name: 'Disponible', selector: 'Disponible', sortable: true, width: '150px', right: true, cell: c => <span>{FormateoDinero.format(c.Disponible ?? 0)}</span> },
                            // { name: '%.Disponible', selector: 'PDisponible', sortable: true, width: '150px', right: true, cell: c => <span>{FormateoDinero.format(c.PDisponible ?? 0).replace('$', '')} %</span> },

                            // { name: 'Sugerido', selector: 'IncrementoSugerido', sortable: true, width: '150px', right: true, cell: c => <span>{FormateoDinero.format(c.IncrementoSugerido ?? 0)}</span> },
                            // { name: 'Autorizado', selector: 'IncrementoAutorizado', sortable: true, width: '150px', right: true, cell: c => <span>{FormateoDinero.format(c.IncrementoAutorizado ?? 0)}</span> },
                        ]}

                        // Valores por defecto
                        paginationPerPage={15}
                    />
                </Card.Body>
            </Card >
        </React.Fragment>
    )
}
export default TablaIncrementos