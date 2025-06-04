import { useState, useMemo } from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'

export default function TableSeguimientoCobranzaGerente(props: { data: any[] }) {
    const Columns = useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Coordinador',
                    sortable: false,
                    center: true,
                    width: '140px',
                    style: {
                        background: "#e0ecf4"
                    },
                    cell: (props) => <span>{props.Coordinador}</span>
                },
                {
                    name: 'Por Cobrar',
                    sortable: false,
                    center: true,
                    width: '110px',
                    style: {
                        background: "#e0ecf4"
                    },
                    cell: (props) => <span>{(props.Pactado)?.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
                },
                {
                    name: 'Anticipada',
                    sortable: false,
                    center: true,
                    width: '110px',
                    style: {
                        background: "#08b454"
                    },
                    cell: (props) => <span>{props.Anticipada?.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
                },
                {
                    name: '%',
                    sortable: false,
                    center: true,
                    style: {
                        background: "#08b454"
                    },
                    cell: (props) => <span>{(((props.Anticipada / props.Pactado) * 100) > 100 ? 100 : ((props.Anticipada / props.Pactado) * 100))?.toLocaleString('en-US')}%</span>
                },
                {
                    name: 'Puntual',
                    sortable: false,
                    center: true,
                    width: '110px',
                    style: {
                        background: "#98d454"
                    },
                    cell: (props) => <span>{props.Puntual?.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
                },
                {
                    name: '%',
                    sortable: false,
                    center: true,
                    style: {
                        background: "#98d454"
                    },
                    cell: (props) => <span>{(((props.Puntual / props.Pactado) * 100) > 100 ? 100 : ((props.Puntual / props.Pactado) * 100))?.toLocaleString('en-US')}%</span>
                },
                {
                    name: 'Acumulado',
                    sortable: false,
                    center: true,
                    width: '110px',
                    style: {
                        background: "#d8cccc"
                    },
                    cell: (props) => <span>{(props.Puntual + props.Anticipada)?.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
                },
                {
                    name: '%',
                    selector: '',
                    sortable: false,
                    center: true,
                    style: {
                        background: "#d8cccc"
                    },
                    cell: (props) => <span>{((((props.Puntual + props.Anticipada) / props.Pactado) * 100) > 100 ? 100 : (((props.Puntual + props.Anticipada) / props.Pactado) * 100))?.toLocaleString('en-US')}%</span>
                },
                {
                    name: 'Tardía',
                    sortable: false,
                    center: true,
                    width: '110px',
                    style: {
                        background: "#ffc404"
                    },
                    cell: (props) => <span>{props.Tardia?.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
                },
                {
                    name: '%',
                    sortable: false,
                    center: true,
                    style: {
                        background: "#ffc404"
                    },
                    cell: (props) => <span>{(((props.Tardia / props.Pactado) * 100) > 100 ? 100 : ((props.Tardia / props.Pactado) * 100))?.toLocaleString('en-US')}%</span>
                },
                {
                    name: 'Final',
                    sortable: false,
                    center: true,
                    width: '110px',
                    style: {
                        background: "#FF2020"
                    },
                    cell: (props) => <span>{props.Final?.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
                },
                {
                    name: '%',
                    sortable: false,
                    center: true,
                    style: {
                        background: "#FF2020"
                    },
                    cell: (props) => <span>{(((props.Final / props.Pactado) * 100) > 100 ? 100 : ((props.Final / props.Pactado) * 100))?.toLocaleString('en-US')}%</span>
                },
                {
                    name: 'Total',
                    sortable: false,
                    center: true,
                    width: '110px',
                    style: {
                        background: "#08b4f4"
                    },
                    cell: (props) => <span>{(props.Anticipada + props.Puntual + props.Tardia + props.Final)?.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
                },
                {
                    name: '%',
                    sortable: false,
                    center: true,
                    style: {
                        background: "#08b4f4"
                    },
                    cell: (props) => <span>{((((props.Anticipada + props.Puntual + props.Tardia + props.Final) / props.Pactado) * 100) > 100 ? 100 : (((props.Anticipada + props.Puntual + props.Tardia + props.Final) / props.Pactado) * 100))?.toLocaleString('en-US')}%</span>
                },
                {
                    name: 'Pendiente',
                    sortable: false,
                    center: true,
                    width: '110px',
                    style: {
                        background: "#FF2020"
                    },
                    cell: (props) => <span>{((props.Pactado - (props.Anticipada + props.Puntual + props.Tardia + props.Final)) < 0 ? 0 : (props.Pactado - (props.Anticipada + props.Puntual + props.Tardia + props.Final)))?.toLocaleString('en-US', { style: 'currency', currency: 'USD', })}</span>
                },
                {
                    name: '%',
                    sortable: false,
                    center: true,
                    style: {
                        background: "#FF2020"
                    },
                    cell: (props) => <span>{((((props.Pactado - (props.Anticipada + props.Puntual + props.Tardia + props.Final)) / props.Pactado) * 100) < 0 ? 0 : (((props.Pactado - (props.Anticipada + props.Puntual + props.Tardia + props.Final)) / props.Pactado) * 100))?.toLocaleString('en-US')}%</span>
                },

            ]
        return colRet
    }, [props.data])

    return (
        <div className="columns">
            <div className="column table-container is-full-mobile is-full-tablet is-full-desktop">
                <DataTable
                    subHeader
                    subHeaderComponent={
                        <div style={{ width: "100%" }}>
                            <h3 style={{ textAlign: "center", marginTop: 5 }}>Detalle de socias pendientes en el corte</h3>
                        </div>
                    }
                    noDataComponent={<h6>No hay datos para mostrar</h6>}
                    columns={Columns}
                    data={props.data}
                    pagination
                    paginationComponentOptions={{
                        noRowsPerPage: false,
                        rowsPerPageText: 'Socias por página',
                        rangeSeparatorText: 'de',
                        selectAllRowsItem: false,
                        selectAllRowsItemText: 'Todos',
                    }}
                    responsive
                    striped
                />
            </div>
        </div>
    );
} 