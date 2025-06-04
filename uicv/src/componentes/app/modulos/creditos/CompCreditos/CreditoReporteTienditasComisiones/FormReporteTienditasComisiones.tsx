import { useState, useMemo } from "react";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { iUI } from "../../../../../../interfaces/ui/iUI";
import * as Funciones from "./Funciones";
import CForm from "./Cform";
import { toast } from "react-toastify";
import moment from "moment";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import ReactTooltip from "react-tooltip";

type FormReporteComisionesTienditaType = {
  oidc: IOidc;
  ui: iUI;
};

export default function FormReporteComisionesTiendita(
  props: FormReporteComisionesTienditaType
) {
  const Datos: any[] = [];
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const [state, setState] = useState({
    Error: false,
    Datos,
    FechaInicio: moment().add(-2, "d").toDate(),
    FechaFin: moment().toDate(),
    loading: false,
  });

  const filtrar = (values: any) => {
    setState((s) => ({
      ...s,
      loading: true,
    }));

    Funciones.FnObtenerReporte(props.oidc, {
      FechaInicio: values.FechaInicio,
      FechaFin: values.FechaFin,
    })
      .then((respuesta: any) => {
        if (respuesta.length > 0) {
          setState((s) => ({
            ...s,
            Error: false,
            Datos: respuesta,
            loading: false,
          }));
        } else {
          setState((s) => ({
            ...s,
            Error: false,
            Datos: [],
            loading: false,
          }));
          toast.warning("No se encontraron datos para mostrar");
        }
      })
      .catch((err) => {
        setState((s) => ({
          ...s,
          Error: false,
          Datos: [],
          loading: false,
        }));
        toast.error("Hubo un error al obtener los datos");
      });
  };

  const Columns = useMemo(() => {
    let colRet: IDataTableColumn[] = [
      {
        name: "Fecha Corrida",
        selector: "FechaHoraRegistro",
        sortable: true,
        center: true,
        width: "10rem",
        cell: (props) => (
          <span>
            {moment(props.FechaHoraRegistro).format("DD/MM/YYYY HH:mm:ss")}
          </span>
        ),
      },
      {
        name: "N° Crédito",
        selector: "CreditoID",
        sortable: true,
      },
      {
        name: "Id SKU",
        selector: "IdSku",
        sortable: true,
      },
      {
        name: "Marca",
        selector: "Marca",
        sortable: true,
        center: true,
        width: "8rem",
      },
      {
        name: "Estilo",
        selector: "Estilo",
        sortable: true,
        center: true,
        width: "10rem",
        cell: (props) => (
          <>
            <span data-tip data-for={`Estilo${props.IdSku}`}>
              {props.Estilo}
            </span>
            <ReactTooltip
              id={`Estilo${props.IdSku}`}
              type="dark"
              effect="solid"
              clickable
              globalEventOff="click"
            >
              {props.Estilo}
            </ReactTooltip>
          </>
        ),
      },
      {
        name: "Color",
        selector: "Color",
        sortable: true,
      },
      {
        name: "Cantidad",
        selector: "Cantidad",
        sortable: true,
      },
      {
        name: "Costo Neto",
        selector: "CostoNeto",
        sortable: true,
        format: (row) => formatter.format(row.CostoNeto),
      },
      {
        name: "Precio",
        selector: "Precio",
        sortable: true,
        format: (row) => formatter.format(row.Precio),
      },
      {
        name: "Importe",
        selector: "Importe",
        sortable: true,
        format: (row) => formatter.format(row.Importe),
      },
      {
        name: "Comisión",
        selector: "Comision",
        sortable: true,
        format: (row) => formatter.format(row.Comision),
      },
      {
        name: "Comisión Especial",
        selector: "ComisionEspecial",
        sortable: true,
        format: (row) => formatter.format(row.ComisionEspecial),
      },
      {
        name: "Categoría",
        selector: "Categoria",
        sortable: true,
        center: true,
        width: "10rem",
        cell: (props) => (
          <>
            <span data-tip data-for={`Categoria${props.IdSku}`}>
              {props.Categoria}
            </span>
            <ReactTooltip
              id={`Categoria${props.IdSku}`}
              type="dark"
              effect="solid"
              clickable
              globalEventOff="click"
            >
              {props.Categoria}
            </ReactTooltip>
          </>
        ),
      },
      {
        name: "Tipo Categoría ID",
        selector: "id_tipo_category",
        sortable: true,
      },
      {
        name: "Captura",
        selector: "Captura",
        sortable: true,
        center: true,
        width: "10rem",
        cell: (props) => (
          <>
            <span data-tip data-for={`Captura${props.IdSku}`}>
              {props.Captura}
            </span>
            <ReactTooltip
              id={`Captura${props.IdSku}`}
              type="dark"
              effect="solid"
              clickable
              globalEventOff="click"
            >
              {props.Captura}
            </ReactTooltip>
          </>
        ),
      },
      {
        name: "Vendedor",
        selector: "Vendedor",
        sortable: true,
        center: true,
        width: "10rem",
        cell: (props) => (
          <>
            <span data-tip data-for={`Vendedor${props.IdSku}`}>
              {props.Vendedor}
            </span>
            <ReactTooltip
              id={`Vendedor${props.IdSku}`}
              type="dark"
              effect="solid"
              clickable
              globalEventOff="click"
            >
              {props.Vendedor}
            </ReactTooltip>
          </>
        ),
      },
      {
        name: "Sucursal Corrida",
        selector: "sucursal",
        sortable: true,
        center: true,
        width: "10rem",
      },
      {
        name: "Sistema Registro",
        selector: "SistemaRegistro",
        sortable: true,
        center: true,
        width: "10rem",
      },
      {
        name: "Sistema Origen",
        selector: "SistemaOrigen",
        sortable: true,
        center: true,
        width: "10rem",
      },
      {
        name: "Nota",
        selector: "Nota",
        sortable: true,
        center: true,
        width: "10rem",
        cell: (props) => (
          <>
            <span data-tip data-for={`Nota${props.IdSku}`}>
              {props.Nota}
            </span>
            <ReactTooltip
              id={`Nota${props.IdSku}`}
              type="dark"
              effect="solid"
              clickable
              globalEventOff="click"
            >
              {props.Nota}
            </ReactTooltip>
          </>
        ),
      },
    ];
    return colRet;
  }, []);

  return (
    <div>
      <CForm
        oidc={props.oidc}
        ui={props.ui}
        onSubmit={filtrar}
        loading={state.loading}
        initialValues={{
          FechaInicio: state.FechaInicio,
          FechaFin: state.FechaFin,
        }}
        PrintExcelObj={{
          data: state.Datos,
          title: "Reporte Tienditas Comisiones",
          nameDoc: "ReporteTienditasComisiones",
        }}
      />
      <DataTable
        data={state.Datos}
        striped
        pagination
        responsive
        keyField={"CreditoID"}
        defaultSortField={"CreditoID"}
        columns={Columns}
      />
    </div>
  );
}
