import React, { useState, useRef, useEffect } from "react";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { iUI } from "../../../../../../interfaces/ui/iUI";
import * as Funciones from "./Funciones";
import CForm from "./Cform";
import { toast } from "react-toastify";
import moment from "moment";
import { TableReporteCreditoTiendita } from "./TableReporteCreditoTiendita";
import { FiltrarDatos } from "../../../../../../global/functions";

type FormReporteConveniosType = {
  oidc: IOidc;
  ui: iUI;
};

export default function FormReporteConvenios(
  props: FormReporteConveniosType
) {
  let isMounted = useRef(true);
  const Datos: any[] = [];
  const DatosMostrar: any[] = [];
  const Columns: any[] = [];

  const [state, setState] = useState({
    Error: false,
    Datos,
    DatosMostrar,
    Columns,
    FechaVencimiento: moment().parseZone().toDate(),
    loading: false,
    Filtro: ''
  });

  const excludeRows = ['DistribuidorID', 'CreditoTienditaID', 'CreditoID', 'Unidades']
  const dateRows = ['FechaRegistra']

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const setFecha = (fecha: any) => {
    setState((s) => ({
      ...s,
      FechaVencimiento: fecha,
    }));
  };

  const setFiltro = (value: any) => {
    setState((s) => ({
      ...s,
      Filtro: value,
    }));
  };

  const filtrar = (values: any) => {
    setState((s) => ({
      ...s,
      loading: true,
    }));

    Funciones.FNReporteCreditoTiendita(props.oidc, {
      FechaVencimiento: values.FechaVencimiento,
    })
      .then((respuesta: any) => {
        let columns: any[] = []
          // if (!respuesta[0].estatus) {
          //   toast.error(respuesta[0].mensaje)
          //   setState(prev => ({ ...prev, loading: false }))
          //   return
          // }
          columns = Object.keys(respuesta[0])
            .filter(v => v != 'estatus' && v != 'mensaje')
            .map((v, i) => ({
              name: v,
              selector: v,
              center: true,
              flex: 1,
              renderCell: (row: any = {}) => {
                if (dateRows.includes(row.field))
                  return moment().parseZone().format('DD/MM/YYYY')
                if (!excludeRows.includes(row.field) && !isNaN(row[row.field]))
                  return formatter.format(row[row.field])
                return row.value
              }
            }))
            console.log(respuesta, columns)
        setState((s) => ({
          ...s,
          Error: false,
          Datos: respuesta,
          Columns: columns,
          loading: false,
        }));
      })
      .catch((err) => {
        setState((s) => ({
          ...s,
          Error: false,
          Datos: [],
          DatosMostrar: [],
          loading: false,
        }));
        toast.error("Hubo un error al obtener los datos");
      });
  };

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, [props.oidc]);

  React.useEffect(() => {
    setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, state.Columns, state.Filtro) }))
    // eslint-disable-next-line
  }, [state.Datos, state.Filtro])

  return (
    <div>
      <CForm
        oidc={props.oidc}
        ui={props.ui}
        onSubmit={filtrar}
        loading={state.loading}
        initialValues={{ FechaVencimiento: state.FechaVencimiento }}
        setFecha={setFecha}
        PrintExcelObj={{
          data: state.Datos,
          title: "Reporte créditos tiendita",
          nameDoc: "ReporteCreditoTiendita",
        }}
      />
      <TableReporteCreditoTiendita
        Datos={state.DatosMostrar}
        Columns={state.Columns}
        Filtro={state.Filtro}
        setFiltro={setFiltro}
      />
    </div>
  );
}
