import { useState } from "react"
import DataTable from "react-data-table-component"
import { FaSearch } from "react-icons/fa"


interface ITableCreditoReporteConvenios {
    Datos: any[], Columns: any[], Filtro: string, setFiltro(value:string): any
}

export function TableCreditoReporteConvenios({ setFiltro, ...props }: ITableCreditoReporteConvenios) {
    return (<>
        <DataTable
            subHeader
            subHeaderComponent=
            {
                <div className="row">
                    <div className="col-sm-12">
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Buscar" value={props.Filtro} onChange={e => setFiltro(e.target.value)} />
                            <span className="input-group-text"><FaSearch /> </span>
                        </div>
                    </div>
                </div>
            }
            data={props.Datos}
            paginationComponentOptions={{
                noRowsPerPage: false, rowsPerPageText: 'Registros por página',
                rangeSeparatorText: 'de',
                selectAllRowsItem: false,
                selectAllRowsItemText: 'Todos',
            }}
            striped
            pagination
            dense
            responsive
            noDataComponent={<div>No hay datos</div>}
            keyField={"UsuarioID"}
            defaultSortField={"UsuarioID"}
            columns={props.Columns}
        />
    </>)
}