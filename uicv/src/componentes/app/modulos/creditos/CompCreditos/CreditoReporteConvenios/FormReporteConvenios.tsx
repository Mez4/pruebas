import React, { useState, useRef, useEffect } from "react";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { iUI } from "../../../../../../interfaces/ui/iUI";
import * as Funciones from "./Funciones";
import CForm from "./Cform";
import { toast } from "react-toastify";
import moment from "moment";
import { TableCreditoReporteConvenios } from "./TableCreditoReporteConvenios";
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
    SucursalID: 0,
    loading: false,
    Filtro: ''
  });

  const excludeRows = ['DistribuidorID', 'SucursalID']
  const dateRows = ['FechaRegistro']

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const setSucursal = (sucursal: any) => {
    setState((s) => ({
      ...s,
      SucursalID: sucursal,
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

    Funciones.FNReporte1600(props.oidc, {
      SucursalID: values.SucursalID,
    })
      .then((respuesta: any) => {

        let columns: any[] = []
        if (respuesta.length > 0) { }
        columns = Object.keys(respuesta[0]).map((v, i) => ({
          name: v,
          selector: v,
          center: true,
          format: (row) => {
            if(dateRows.includes(v))
              return moment().format('DD/MM/YYYY')
            if(!excludeRows.includes(v) && !isNaN(row[v]))
              return formatter.format(row[v]) 
            return row[v]
          }
        }))

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
        initialValues={{ SucursalID: state.SucursalID }}
        setSucursal={setSucursal}
        PrintExcelObj={{
          data: state.Datos,
          title: "Consulta Rapida 1600",
          nameDoc: "ConsultaRapida(1600)",
        }}
      />
      <TableCreditoReporteConvenios
        Datos={state.DatosMostrar}
        Columns={state.Columns}
        Filtro={state.Filtro}
        setFiltro={setFiltro}
      />
    </div>
  );
}
