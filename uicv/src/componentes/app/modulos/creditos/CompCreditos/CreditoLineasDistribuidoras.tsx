import { useEffect, useState } from "react";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import * as Funciones from "./CreditoLineasDistribuidoras/Funciones";
import { Card, Spinner } from "../../../../global";
import { iUI } from "../../../../../interfaces/ui/iUI";
import { FaFileExcel } from "react-icons/fa";
import XLSX from "xlsx";
import { FiRefreshCcw } from "react-icons/fi";
import { toast } from "react-toastify";

type CreditosLineasDistribuidoresProps = {
  oidc: IOidc;
  ui: iUI;
  // DATA-TABLE CACHE
  defaultSortField: string;
  defaultSortAsc: boolean;
  paginationDefaultPage: number;
};

const CreditoLineasDistribuidoras = (
  props: CreditosLineasDistribuidoresProps
) => {
  const Datos: any[] = [];
  const [state, setState] = useState({
    Datos,
    Cargando: false,
    Error: false,
    defaultSortAsc: true,
    defaultSortField: "NombreCompleto",
    paginationDefaultPage: 1,
  });

  const generarXLSX = () => {
    const XLSX = require("xlsx-js-style");
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(state.Datos, {
      origin: "A1",
    });

    for (let i in ws) {
      if (typeof ws[i] != "object") continue;
      let cell = XLSX.utils.decode_cell(i);
      // console.log(cell, 'cell')
      if (i.replace(/[^0-9]/gi, "") === "1") {
        ws[i].s = {
          fill: {
            patternType: "solid",
            fgColor: { rgb: "9bbb58 " },
            bgColor: { rgb: "9bbb58 " },
          },
          font: {
            name: "Song Ti",
            sz: 10,
            bold: true,
          },
          border: {
            bottom: {
              style: "thin",
              color: "FF000000",
            },
          },
          alignment: {
            vertical: "center",
            horizontal: "center",
            wrapText: "0",
          },
        };
      } else {
        ws[i].s = {
          font: {
            name: "Song Ti",
            sz: 10,
          },
          alignment: {
            vertical: "center",
            horizontal: "center",
            wrapText: "1",
          },
          border: {
            right: {
              style: "thin",
            },
            left: {
              style: "thin",
            },
            bottom: {
              style: "thin",
            },
          },
        };

        if (
          cell.c == 13 ||
          cell.c == 14 ||
          cell.c == 16 ||
          cell.c == 17 ||
          cell.c == 20 ||
          cell.c == 24
        ) {
          // first column

          ws[i].s.numFmt = "$#,###.00"; // other numbers
        }

        if (cell.r % 2) {
          ws[i].s.fill = {
            patternType: "solid",
            fgColor: { rgb: "EEEEEE" },
            bgColor: { rgb: "EEEEEE" },
          };
        }
      }
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    XLSX.writeFile(wb, "ColocacionSocias.xlsx");
  };

  const Columns: IDataTableColumn[] = [
    {
      name: "Contrato ID",
      selector: "CONTRATOID",
      center: true,
      sortable: false,
      minWidth: "6%",
      // width: "65px",
      cell: (props) => <span className="text-center">{props.CONTRATOID}</span>,
    },
    {
      name: "Producto",
      selector: "PRODUCTONOMBRE",
      center: true,
      sortable: false,
      minWidth: "4%",
      // width: "65px",
      cell: (props) => (
        <span className="text-center">
          {props.PRODUCTONOMBRE.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </span>
      ),
    },
    {
      name: "Distribuidor ID",
      selector: "DISTRIBUIDORID",
      center: true,
      sortable: false,
      minWidth: "4%",
      // width: "65px",
      cell: (props) => (
        <span className="text-center">{props.DISTRIBUIDORID}</span>
      ),
    },
    {
      name: "Nombre",
      selector: "NOMBRECOMPLETO",
      center: true,
      sortable: false,
      minWidth: "15%",
      // width: "65px",
      cell: (props) => (
        <span className="text-center">{props.NOMBRECOMPLETO}</span>
      ),
    },
    {
      name: "Linea de Crédito",
      selector: "LINEACREDITO",
      right: true,
      sortable: false,
      minWidth: "6%",
      // width: "65px",
      cell: (props) => (
        <span className="text-center">
          {props.LINEACREDITO.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </span>
      ),
    },
    {
      name: "Crédito Disponible",
      selector: "LINEACREDITODISPONIBLE",
      right: true,
      sortable: false,
      minWidth: "6%",
      // width: "65px",
      cell: (props) => (
        <span className="text-center">
          {props.LINEACREDITODISPONIBLE.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </span>
      ),
    },
    {
      name: "Saldo Actual",
      selector: "SALDOACTUAL",
      right: true,
      sortable: false,
      minWidth: "6%",
      // width: "65px",
      cell: (props) => (
        <span className="text-center">
          {props.SALDOACTUAL.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </span>
      ),
    },
    {
      name: "Capital Colocado",
      selector: "CAPITALCOLOCADO",
      right: true,
      sortable: false,
      minWidth: "6%",
      // width: "65px",
      cell: (props) => (
        <span className="text-center">
          {props.CAPITALCOLOCADO.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </span>
      ),
    },
    {
      name: "Capital Pendiente",
      selector: "CAPITALPENDIENTE",
      right: true,
      sortable: false,
      minWidth: "6%",
      // width: "65px",
      cell: (props) => (
        <span className="text-center">
          {props.CAPITALPENDIENTE.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </span>
      ),
    },
    {
      name: "Capital Pendiente Disponible",
      selector: "CAPITALPENDIENTEDISPONIBLE",
      right: true,
      sortable: false,
      minWidth: "6%",
      // width: "65px",
      cell: (props) => (
        <span className="text-center">
          {props.CAPITALPENDIENTEDISPONIBLE.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </span>
      ),
    },
  ];

  const FnGetReporteLineasCreditoDistribuidoras = () => {
    setState((s) => ({
      ...s,
      Cargando: true,
    }));

    Funciones.FNGetReporteLineasCreditoDistribuidoras(props.oidc)
      .then((respuesta: any) => {
        toast.info("Datos obtenidos correctamente");
        setState((s) => ({
          ...s,
          Cargando: false,
          Error: false,
          Datos: respuesta,
        }));
      })
      .catch(() => {
        setState((s) => ({
          ...s,
          Cargando: false,
          Error: true,
          Datos: [],
          DatosMostrar: [],
        }));
        toast.error("Hubo un error al obtener los datos");
      });
  };

  useEffect(() => {
    FnGetReporteLineasCreditoDistribuidoras();
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-12">
          <Card Title="LINEAS DE CRÉDITO DISTRIBUIDORAS">
            <Card.Body>
              <Card.Body.Content>
                {state.Cargando && <Spinner />}
                {!state.Cargando && (
                  <div>
                    <div className="text-end mb-4">
                      <button
                        type="button"
                        className="btn mx-1 btn-primary waves-effect waves-light "
                        disabled={state.Cargando}
                        onClick={FnGetReporteLineasCreditoDistribuidoras}
                        style={{
                          width: "7rem",
                        }}
                      >
                        <span className="is-hidden-touch mr-2">Buscar</span>
                        <FiRefreshCcw />
                      </button>
                      <button
                        type="button"
                        className="btn mx-1 btn-success waves-effect waves-light"
                        disabled={state.Cargando || !state.Datos.length}
                        onClick={() => {
                          generarXLSX();
                        }}
                        style={{
                          width: "7rem",
                        }}
                      >
                        <span className="is-hidden-touch mr-2">Exportar</span>
                        <FaFileExcel />
                      </button>
                    </div>
                    <DataTable
                      data={state.Datos}
                      striped
                      pagination
                      dense
                      noHeader
                      responsive
                      paginationPerPage={30}
                      keyField={"DistribuidorID"}
                      defaultSortField={"DistribuidorID"}
                      columns={Columns}
                      onChangePage={(page) =>
                        setState((e) => ({ ...e, paginationDefaultPage: page }))
                      }
                      defaultSortAsc={state.defaultSortAsc}
                      paginationDefaultPage={state.paginationDefaultPage}
                    />
                  </div>
                )}
                {state.Error && (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <span>Error al cargar los datos...</span>
                  </div>
                )}
              </Card.Body.Content>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: IEstado) => ({
  oidc: state.oidc,
  ui: state.UI,
});
const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreditoLineasDistribuidoras);
