import { useState, useEffect, useMemo } from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { IOidc } from '../../../../../../../interfaces/oidc/IOidc'
import * as FuncionReporte from '../../../../creditos/CompCreditos/CreditoDistPagosVencimiento/Funciones'


export default function DetalleSociasPendientes(props: { oidc: IOidc, ProductoID: number, SucursalID: number, GrupoID: number, loading: boolean, data: any[] }) {
    const [state, setState] = useState({
        data: []
    })

    const Columns = useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Nombre socia',
                    selector: 'Distribuidor',
                    sortable: true,
                    center: true,
                    cell: (props) => <span style={{ textAlign: "center" }}>{props.Distribuidor}</span>
                },
                {
                    name: 'ID',
                    selector: "DistribuidorID",
                    sortable: true,
                    center: true
                },
                {
                    name: 'Pendiente',
                    selector: "Saldo",
                    sortable: true,
                    center: true,
                    cell: (props) => <span>{(props.Saldo)?.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
                },
                {
                    name: 'Semaforo',
                    sortable: false,
                    center: true,
                    cell: (props) => <span>{"Pendiente"}</span>
                },
            ]
        return colRet
    }, [props.data])


    return (
        <div className='columns'>
            <div className='column is-full-mobile is-full-tablet is-full-desktop'>
                <DataTable
                    subHeader
                    subHeaderComponent={
                        <div style={{ width: "100%" }}>
                            <h3 style={{ textAlign: "center", marginTop: 5 }}>Detalle de socias pendientes en el corte</h3>
                        </div>
                    }
                    noDataComponent={<h6>No hay socias pendientes</h6>}
                    columns={Columns}
                    data={props.data}
                    dense
                    pagination
                    paginationComponentOptions={{
                        noRowsPerPage: false,
                        rowsPerPageText: 'Socias por página',
                        rangeSeparatorText: 'de',
                        selectAllRowsItem: false,
                        selectAllRowsItemText: 'Todos',
                    }}
                    defaultSortField={"DistribuidorID"}
                    striped
                    noHeader
                    responsive
                />
            </div>
        </div>
    )
}