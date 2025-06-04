import DataGridComp from "../../../../../global/DataGrid"

interface TableReporteCreditoTiendita {
    Datos: any[], Columns: any[], Filtro: string, setFiltro(value: string): any
}

export function TableReporteCreditoTiendita({ setFiltro, ...props }: TableReporteCreditoTiendita) {
    // const extractCsvData = (data: any[]) => console.log("M: DATA TABLE", data)
    return (<>
        <DataGridComp
            columns={props.Columns}
            data={props.Datos}
            PermisoID={2}
            totalize
            // chargeCsvData
            // extractCsvData={extractCsvData}
            // pagination={false}
            // totalizeColumns={[
            //     { operation: ['sum'], column: 'ImporteTotal' },
            //     {
            //         operation: ['sum', 'avg'],
            //         column: 'PrecioUnitario',
            //         format(value) {
            //             return `$ ${value}`
            //         },
            //     }
            // ]}
        />
    </>)
}