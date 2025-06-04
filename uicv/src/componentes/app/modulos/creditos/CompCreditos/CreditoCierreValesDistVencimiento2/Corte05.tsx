import { useMemo } from "react";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import { Spinner } from "../../../../../global";

export default function Corte05(props: { data: any[] }) {
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
        name: "Día 24",
        selector: "D_24",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props?.D_24.toLocaleString("en-US", {
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
        name: "Día 25",
        selector: "D_25",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props?.D_25.toLocaleString("en-US", {
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
        name: "Día 26",
        selector: "D_26",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props?.D_26.toLocaleString("en-US", {
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
        name: "Día 27",
        selector: "D_27",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props?.D_27.toLocaleString("en-US", {
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
        name: "Día 28",
        selector: "D_28",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props?.D_28.toLocaleString("en-US", {
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
        name: "Día 29",
        selector: "D_29",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props?.D_29.toLocaleString("en-US", {
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
        name: "Día 30",
        selector: "D_30",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props?.D_30.toLocaleString("en-US", {
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
        name: "Día 31",
        selector: "D_31",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props?.D_31.toLocaleString("en-US", {
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
        name: "Día 01",
        selector: "D_01",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props?.D_01.toLocaleString("en-US", {
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
        name: "Día 02",
        selector: "D_02",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props?.D_02.toLocaleString("en-US", {
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
        name: "Día 03",
        selector: "D_03",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props?.D_03.toLocaleString("en-US", {
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
        name: "Día 04",
        selector: "D_04",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props?.D_04.toLocaleString("en-US", {
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
        name: "Día 05",
        selector: "D_05",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props?.D_05.toLocaleString("en-US", {
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
        name: "Día 06",
        selector: "D_06",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props?.D_06.toLocaleString("en-US", {
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
        name: "Día 07",
        selector: "D_07",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props?.D_07.toLocaleString("en-US", {
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
          <span style={{ textAlign: "center" }}>
            {props.D_08.toLocaleString("en-US", {
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
          <span style={{ textAlign: "right" }}>
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
          <span style={{ textAlign: "right" }}>
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
          <span style={{ textAlign: "right" }}>
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
          <span style={{ textAlign: "right" }}>
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
          <span style={{ textAlign: "right" }}>
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
