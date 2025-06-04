import { useMemo } from "react";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import { Spinner } from "../../../../../global";

export default function Corte20(props: { data: any[] }) {
  const Columns = useMemo(() => {
    let colRet: IDataTableColumn[] = [
      {
        name: "zonaValesId",
        selector: "zonaValesId",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>{props.zonaValesId}</span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "zonaVales",
        selector: "zonaVales",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>{props.zonaVales}</span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "sucursalValeId",
        selector: "sucursalValeId",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>{props.sucursalValeId}</span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "sucursalVale",
        selector: "sucursalVale",
        sortable: false,
        center: true,
        minWidth: "3%",
        cell: (props) => (
          <span style={{ textAlign: "center" }}>{props.sucursalVale}</span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "coordinadorValeId",
        selector: "coordinadorValeId",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>{props.coordinadorValeId}</span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "CoordinadorVale",
        selector: "CoordinadorVale",
        sortable: false,
        center: true,
        minWidth: "6%",
        cell: (props) => (
          <span style={{ textAlign: "center" }}>{props.CoordinadorVale}</span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "distribuidorId",
        selector: "distribuidorId",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>{props.distribuidorId}</span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "nombreDistribuidor",
        selector: "nombreDistribuidor",
        sortable: false,
        center: true,
        minWidth: "8%",
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props.nombreDistribuidor}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Estatus",
        selector: "Estatus",
        sortable: false,
        center: true,
        minWidth: "3%",
        cell: (props) => (
          <span style={{ textAlign: "center" }}>{props.Estatus}</span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "FechaConvenio",
        selector: "FechaConvenio",
        sortable: false,
        center: true,
        minWidth: "4%",
        cell: (props) => (
          <span style={{ textAlign: "center" }}>{props.FechaConvenio}</span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "salAtrAlInicioCorte",
        selector: "salAtrAlInicioCorte",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props.salAtrAlInicioCorte.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Dias de Atraso",
        selector: "Dias de Atraso",
        sortable: false,
        center: true,
        minWidth: "3%",
        cell: (props) => (
          <span style={{ textAlign: "center" }}>{props["Dias de Atraso"]}</span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "pagAtrAlInicioCorte",
        selector: "pagAtrAlInicioCorte",
        sortable: false,
        center: true,
        minWidth: "3%",
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props.pagAtrAlInicioCorte.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "vencidoCorte",
        selector: "vencidoCorte",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props.vencidoCorte.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "aplicado",
        selector: "aplicado",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props.aplicado.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "bonificacion",
        selector: "bonificacion",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props.bonificacion.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "pagos",
        selector: "pagos",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props.pagos.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Día 08",
        selector: "D_08",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props?.D_08.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Día 09",
        selector: "D_09",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props?.D_09.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Día 10",
        selector: "D_10",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props?.D_10.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Día 11",
        selector: "D_11",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props?.D_11.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Día 12",
        selector: "D_12",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props?.D_12.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Día 13",
        selector: "D_13",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props?.D_13.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Día 14",
        selector: "D_14",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props?.D_14.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Día 15",
        selector: "D_15",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props?.D_15.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Día 16",
        selector: "D_16",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props?.D_16.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Día 17",
        selector: "D_17",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props?.D_17.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Día 18",
        selector: "D_18",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props?.D_18.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Día 19",
        selector: "D_19",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props?.D_19.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Día 20",
        selector: "D_20",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props?.D_20.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Día 21",
        selector: "D_21",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props?.D_21.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Día 22",
        selector: "D_22",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props?.D_22.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Día 23",
        selector: "D_23",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props?.D_23.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "pagosAntes",
        selector: "pagosAntes",
        sortable: false,
        center: true,
        minWidth: "3%",
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props.pagosAntes?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "pagosAntesLiqCliFinal",
        selector: "pagosAntesLiqCliFinal",
        sortable: false,
        center: true,
        minWidth: "3%",
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props.pagosAntesLiqCliFinal?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "pagosDespues",
        selector: "pagosDespues",
        sortable: false,
        center: true,
        minWidth: "3%",
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props.pagosDespues?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "PACTADO",
        selector: "PACTADO",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props.PACTADO?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "ANTICIPADA",
        selector: "ANTICIPADA",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props.ANTICIPADA.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "PURA",
        selector: "PURA",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props.PURA.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "NORMAL",
        selector: "NORMAL",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "right" }}>
            {props.NORMAL.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "TARDÍA",
        selector: "TARDÍA",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props.TARDÍA.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "FINAL",
        selector: "FINAL",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props.FINAL.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ZonaID == 0,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
    ];
    return colRet;
  }, [props.data]);

  return (
    <>
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
        paginationComponentOptions={{
          noRowsPerPage: false,
          rowsPerPageText: "Socias por página",
          rangeSeparatorText: "de",
          selectAllRowsItem: false,
          selectAllRowsItemText: "Todos",
        }}
      />
    </>
  );
}
