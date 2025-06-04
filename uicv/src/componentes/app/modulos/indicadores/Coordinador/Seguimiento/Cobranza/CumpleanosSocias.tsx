import { useState, useEffect, useMemo } from 'react';
import { IOidc } from '../../../../../../../interfaces/oidc/IOidc';
import * as Funciones from '../../../Funciones';
import DataTable, { IDataTableColumn } from 'react-data-table-component';
import moment from 'moment';
import { emit } from 'process';

type CumpleanosSociasType = {
    data: {},
    loading: boolean
}

export default function CumpleanosSocias(props: { data: any[]}) {
   
    const Columns = useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Nombre de la Socia',
                    selector: 'Distribuidor',
                    sortable: true,
                    center: true,
                    cell: (props) => <span>{props.Distribuidor}</span>
                },
                {
                    name: 'ID',
                    selector: 'DistribuidorID',
                    sortable: true,
                    center: true,
                    cell: (props) => <span>{props.DistribuidorID}</span>
                },
                {
                    name: 'Fecha Cumpleaños',
                    selector: 'FechaCumple',
                    sortable: true,
                    center: true,
                    cell: (props) => <span>{moment(props.FechaCumple).format('DD-MM-YYYY')}</span>
                }
            ]
        return colRet
    }, [props.data])

    return <>
        <DataTable
            subHeader
            subHeaderComponent={
                <div style={{ width: "100%" }}>
                    <h3 style={{ textAlign: "center", marginTop: 5 }}>Cumpleaños de Socias</h3>
                </div>
            }
            columns={Columns}
            data={props.data}
            noDataComponent={<p>No hay socias que cumplan años este mes</p>}
            responsive
            pagination
            paginationComponentOptions={{
                noRowsPerPage: false, rowsPerPageText: 'Socias por página',
                rangeSeparatorText: 'de',
                selectAllRowsItem: false,
                selectAllRowsItemText: 'Todos',
            }}
        />
    </>
}