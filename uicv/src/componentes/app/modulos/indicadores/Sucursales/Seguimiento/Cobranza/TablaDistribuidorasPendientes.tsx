import React from 'react'
import DataTable from 'react-data-table-component'
import { FaCircle, FaList } from 'react-icons/fa'
import { FormateoDinero } from '../../../../../../../global/variables'
import Tsp_HiTIndicadores_sp_Historicos from '../../../../../../../interfaces/sp/TIndicadores_sp_Historicos'
import { Card } from '../../../../../../global'

const TablaDistribuidorasPendientes = (props: { distribuidoras: Tsp_HiTIndicadores_sp_Historicos[] }) => {
    return (
        <Card Title={
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyItems: 'center' }}>
                <FaList className={'mr-2 is-size-7'} />
                <span className='is-size-7 has-text-weight-semibold'>Resumen de la cuenta vigente</span>
            </div>
        }>
            <Card.Body clssName='p-0'>

                <DataTable
                    data={props.distribuidoras.filter(d => d.Pendiente > 1 && d.Distribuidor !== "TOTAL")}
                    striped
                    pagination
                    dense
                    noHeader
                    responsive
                    defaultSortField={"Pendiente"}
                    defaultSortAsc={false}
                    columns={[

                        { name: 'Socia', selector: 'SucursalID', sortable: true, width: '300px', cell: prop => <span>{prop.Distribuidor}</span> },
                        { name: 'ID', selector: 'DistribuidorID', sortable: true, cell: prop => <span title={prop.DistribuidorVR}>{prop.DistribuidorID}</span> },
                        { name: 'Pendiente', selector: 'Pendiente', sortable: true, cell: prop => <span>{FormateoDinero.format(prop.Pendiente ?? 0).replace(".00", "")}</span> },
                        { name: 'Peso', selector: 'Pendiente', sortable: true, cell: prop => <span>{FormateoDinero.format(prop.Porc_Peso).replace('$', '')} %</span> },
                        {
                            name: 'Semaforo', selector: 'TipoPagoAnt1', sortable: true, right: true, cell: prop =>
                                <span>
                                    {prop.TipoPago === 'PA' && <span className='has-text-weight-semibold' style={{ color: '#347061' }}><FaCircle className={'mr-2 is-size-7'} />&nbsp;Anticipado</span>}
                                    {prop.TipoPago === 'PP' && <span className='has-text-weight-semibold' style={{ color: '#268E74' }}><FaCircle className={'mr-2 is-size-7'} />&nbsp;Puntual</span>}
                                    {prop.TipoPago === 'PI' && <span className='has-text-weight-semibold' style={{ color: '#F3D104' }}><FaCircle className={'mr-2 is-size-7'} />&nbsp;Impuntual</span>}
                                    {prop.TipoPago === 'PT' && <span className='has-text-weight-semibold' style={{ color: '#e02f2f' }}><FaCircle className={'mr-2 is-size-7'} />&nbsp;Tardio</span>}
                                </span>
                        },
                    ]}

                    // Valores por defecto
                    paginationPerPage={15}
                />

                {/* <table className="table table-sm table-striped responsibe__table" style={{ fontSize: '0.7rem', fontWeight: '600' }}>
                    <thead className=''>
                        <tr>
                            <th className='p-1 pl-2 has-background-link text-white' scope="col" style={{ width: '35%' }}>Nombre</th>
                            <th className='p-1 px-2 has-background-link text-white' style={{ textAlign: 'right' }} scope="col">ID</th>
                            <th className='p-1 px-2 has-background-link text-white' style={{ textAlign: 'right' }} scope="col">Pendiente</th>
                            <th className='p-1 px-2 has-background-link text-white' style={{ textAlign: 'right' }} scope="col">Peso</th>
                            <th className='p-1 px-2 has-background-link text-white' style={{ textAlign: 'right' }} scope="col">Semaforo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.indicador.Distribuidoras.filter(d => d.Pendiente ?? 0 > 0).map((d, dId) =>
                            <tr key={dId}>
                                <td className='p-1 px-2 has-text-right' title={'VR: ' + d.DistAntSistema}>{d.DistribuidorID}</td>
                                <td className='p-1 px-2 has-text-right'>{FormateoDinero.format(d.Pendiente ?? 0)}</td>
                                <td className='p-1 px-2 has-text-right'>{FormateoDinero.format((100 / props.indicador.TotalesCoordinadores.Pendiente) * (d.Pendiente ?? 0)).replace('$', '')} %</td>
                                <td>
                                    {d.TipoPagoAnt1 === 'PA' && <span className='has-text-weight-semibold' style={{ color: '#347061' }}><FaCircle className={'mr-2 is-size-7'} />&nbsp;Anticipado</span>}
                                    {d.TipoPagoAnt1 === 'PP' && <span className='has-text-weight-semibold' style={{ color: '#268E74' }}><FaCircle className={'mr-2 is-size-7'} />&nbsp;Anticipado</span>}
                                    {d.TipoPagoAnt1 === 'PI' && <span className='has-text-weight-semibold' style={{ color: '#F3D104' }}><FaCircle className={'mr-2 is-size-7'} />&nbsp;Anticipado</span>}
                                    {d.TipoPagoAnt1 === 'PT' && <span className='has-text-weight-semibold' style={{ color: '#e02f2f' }}><FaCircle className={'mr-2 is-size-7'} />&nbsp;Anticipado</span>}
                                    {d.TipoPagoAnt1 === 'PP' && <span className='has-text-weight-semibold' style={{ color: '#black' }}><FaCircle className={'mr-2 is-size-7'} />&nbsp;Anticipado</span>}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table> */}
            </Card.Body>
        </Card>
    )
}

export default TablaDistribuidorasPendientes