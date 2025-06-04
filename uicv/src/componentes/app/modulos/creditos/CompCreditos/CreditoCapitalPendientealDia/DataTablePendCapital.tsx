import React, { useState, useMemo } from 'react';
//import { useMemo } from "react";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import { Spinner } from "../../../../../global";


export default function DataTablePendCapital(props: { data: any[] }) {
  
//const [props, setState] = useState<{ data: any[]; loading: boolean }>({ data: [], loading: false });
const [loading, setLoading] = React.useState(false)

 // Estructura de las columnas de una tabla
 const Columns = React.useMemo(() => {
  let HeadersColumns: IDataTableColumn[] =
      [
          { name: 'SucursalID', selector: 'SucursalID', sortable: true },
          { name: 'Sucursal', selector: 'Sucursal', sortable: true, width:'8.5%' },
          { name: 'DistribuidorID', selector: 'DistribuidorID', sortable: true, },
          //{ name: 'DistribuidorID', selector: 'DistribuidorID', sortable: true, ,cell: (props) => <span>{props.FechaDelMovimiento ? moment(props.FechaDelMovimiento).format('DD/MM/YYYY')  : ''}</span> },  
          { name: 'Distribuidor', selector: 'Distribuidor', sortable: true, width:'17.5%'} ,
          { name: 'Nivel', selector: 'Nivel', sortable: true,width:'8.5%' },
          { name: 'EstatusID', selector: 'EstatusID', sortable: true,width:'4.0%' }, 
          { name: 'Estatus', selector: 'Estatus', sortable: true,  }, 
          { name: 'IDExterno', selector: 'IDExterno', sortable: true, },
          { name: 'CreditoID', selector: 'CreditoID', sortable: true, },
          { name: 'Capítal Pendientes', selector: 'CapítalPendientes', sortable: true, }, 
          { name: 'Saldo Actual', selector: 'SaldoActual', sortable: true, },
          { name: 'Dias Atraso', selector: 'DiasAtraso', sortable: true,width:'3.5%'  },
          { name: 'Tipo CreditoID', selector: 'TipoCreditoID', sortable: true, width:'4.5%' },
          { name: 'Clave', selector: 'Clave', sortable: true,width:'4%' },
          { name: 'Descripcion', selector: 'Descripcion', sortable: true,},

      ]
  return HeadersColumns
}, [])

return(
  <DataTable
        subHeader
        columns={Columns}
        data={props.data}
        progressComponent={<Spinner />}
        noDataComponent={<p>No hay datos para mostrar</p>}
        responsive
        dense
        striped
        noHeader
        pagination
        paginationPerPage={10} // Limit to 10 rows per page
        paginationComponentOptions={{
          noRowsPerPage: false,
          rowsPerPageText: "Pendientes por página",
          rangeSeparatorText: "de",
          selectAllRowsItem: false,
          selectAllRowsItemText: "Todos",
        }}
      />

);








}
