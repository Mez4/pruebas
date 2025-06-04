import React from 'react'
import DataTable from 'react-data-table-component'
import { FaMoneyBillAlt } from 'react-icons/fa'
import { FormateoDinero } from '../../../../../../../global/variables'
import Tsp_HiTIndicadores_sp_Historicos from '../../../../../../../interfaces/sp/TIndicadores_sp_Historicos'
import { Card } from '../../../../../../global'
import TIndicadorSP from './TIndicadorSP'

export const TablaColocacionImproductivas = (props: { indicador: TIndicadorSP, distribuidoras090: Tsp_HiTIndicadores_sp_Historicos[] }) => {

    // Tipo de reporte
    let porcentajeInicio: number = 0;
    let porcentajeFin: number = 0;

    const [porcentajeReporte, definirPorcentajeReporte] = React.useState<number>(0)
    switch (porcentajeReporte) {
        case 0:
            porcentajeInicio = -9999
            porcentajeFin = 9999
            break;
        case 1:
            porcentajeInicio = -9999
            porcentajeFin = 20
            break;
        case 2:
            porcentajeInicio = 21
            porcentajeFin = 60
            break;
        case 3:
            porcentajeInicio = 61
            porcentajeFin = 80
            break;
        default:
            porcentajeInicio = 81
            porcentajeFin = 9999
            break;
    }

    // Colocacion
    const [filtroReporte, definirFiltroReporte] = React.useState<string>("ALL")

    return (
        <React.Fragment>
            <h4>Colocación e improductivas</h4>
            <Card Title={
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyItems: 'center' }}>
                    <FaMoneyBillAlt className={'mr-2 is-size-7'} />
                    <span className='is-size-7 has-text-weight-semibold'>%.Disponible: </span>
                    <button onClick={() => definirPorcentajeReporte(0)} style={{ width: "75px" }} className={`ml-2 btn btn-sm ${porcentajeReporte === 0 ? 'btn-primary' : 'btn-outline-primary'}`}><strong>Todos</strong></button>
                    <button onClick={() => definirPorcentajeReporte(4)} style={{ width: "75px" }} className={`ml-2 btn btn-sm ${porcentajeReporte === 4 ? 'btn-primary' : 'btn-outline-primary'}`}><strong>81-100 %</strong></button>
                    <button onClick={() => definirPorcentajeReporte(3)} style={{ width: "75px" }} className={`ml-2 btn btn-sm ${porcentajeReporte === 3 ? 'btn-primary' : 'btn-outline-primary'}`}><strong>61-80 %</strong></button>
                    <button onClick={() => definirPorcentajeReporte(2)} style={{ width: "75px" }} className={`ml-2 btn btn-sm ${porcentajeReporte === 2 ? 'btn-primary' : 'btn-outline-primary'}`}><strong>21-60 %</strong></button>
                    <button onClick={() => definirPorcentajeReporte(1)} style={{ width: "75px" }} className={`ml-2 btn btn-sm ${porcentajeReporte === 1 ? 'btn-primary' : 'btn-outline-primary'}`}><strong>0-20 %</strong></button>
                    <div style={{ position: 'absolute', right: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyItems: 'center' }}>
                        <select value={filtroReporte} onChange={v => definirFiltroReporte(v.target.value)} className="form-select form-select-sm mr-3" aria-label=".form-select-sm example">
                            <option value="ALL">Todos</option>
                            <option value="SC">Sin colocación</option>
                            <option value="SD">Sin disponible</option>
                        </select>
                    </div>
                </div >
            }>
                <Card.Body>
                    <DataTable
                        data={props.indicador.ColocacionImproductivas
                            .filter(f =>
                                (f.Porc_Disponible ?? 0) >= porcentajeInicio
                                && (f.Porc_Disponible ?? 0) <= porcentajeFin
                                && (
                                    filtroReporte === "ALL"
                                    || (filtroReporte === "SC" && (f.Colocacion ?? 0) <= 0)
                                    || (filtroReporte === "SD" && (f.Disponible ?? 0) <= 0)
                                ))
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
                            { name: 'Suc', selector: 'SucursalID', sortable: true, width: '70px', cell: prop => <span title={prop.Sucursal}>{prop.SucursalId}</span> },
                            { name: 'CV', selector: 'DistribuidorID', sortable: true, width: '100px' },
                            { name: 'VR', selector: 'DistAntNumero', sortable: true, width: '100px', cell: prop => <span>{prop.DistribuidorVR}</span> },
                            { name: 'Nombre', selector: 'Distribuidor', sortable: true, },

                            { name: 'Limite', selector: 'Limite', sortable: true, width: '150px', right: true, cell: c => <span>{FormateoDinero.format(c.Limite ?? 0).replace(".00", "")}</span> },
                            { name: 'Disponible', selector: 'Disponible', sortable: true, width: '150px', right: true, cell: c => <span>{FormateoDinero.format(c.Disponible ?? 0).replace(".00", "")}</span> },
                            { name: '%.Disponible', selector: 'Porc_Disponible', sortable: true, width: '150px', right: true, cell: c => <span>{FormateoDinero.format(c.Porc_Disponible ?? 0).replace('$', '')} %</span> },
                            { name: 'Colocacion', selector: 'Colocacion', sortable: true, width: '150px', right: true, cell: c => <span>{FormateoDinero.format(c.Colocacion ?? 0).replace(".00", "")}</span> },
                            { name: 'Colocacion.Anterior', selector: 'Colocacion', sortable: true, width: '150px', right: true, cell: c => <span>{FormateoDinero.format(c.ColocacionAnterior ?? 0).replace(".00", "")}</span> },
                            { name: 'Bono*', selector: 'Peso', sortable: true, width: '130px', right: true, cell: c => <span>{FormateoDinero.format(c.Bono ?? 0).replace(".00", "")}</span> },
                        ]}
                        // Valores por defecto
                        paginationPerPage={15}
                    />
                </Card.Body>
            </Card>
        </React.Fragment>
    )
}
