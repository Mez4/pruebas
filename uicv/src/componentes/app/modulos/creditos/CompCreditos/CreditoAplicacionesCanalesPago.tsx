import { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import * as Funciones from "./CreditoAplicacionesCanalesPago/Funciones";
// Icons
import { FaSearch, FaBan } from "react-icons/fa";

// Custom components
import { Card, Spinner } from "../../../../global";
import { AplicacionesCanalesPago } from "./CreditoAplicacionesCanalesPago/AplicacionesCanalesPago";
import { FiltrarDatos, addOneDay } from "../../../../../global/functions";

import ReactTooltip from "react-tooltip";
import moment from "moment";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
import { iUI } from "../../../../../interfaces/ui/iUI";
import { DataGrid, /* esES, */ GridColDef } from "@mui/x-data-grid";

type CatalogosType = {
  oidc: IOidc;
  ui: iUI;
};

type EstadoTipo = {
  Datos: any[];
  Cargando: boolean;
  Error: boolean;
  MovimientoID: number;
  DistribuidorID: number;
  Distribuidor: string;
  Descargar: boolean;
};

const CreditoAplicacionesCanalesPago = (props: CatalogosType) => {
  const [state, setState] = useState<EstadoTipo>({
    Datos: [],
    Cargando: false,
    Error: false,
    MovimientoID: 0,
    DistribuidorID: 0,
    Distribuidor: "",
    Descargar: false,
  });

  const columnsMUI: GridColDef[] = [
    {
      field: "Sucursal",
      headerName: "Sucursal",
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "DistribuidorID",
      headerName: "Socia ID",
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "NombreCompleto",
      headerName: "Socia",
      align: "center",
      headerAlign: "center",
      flex: 1,
      renderCell: (cell: any) => (
        <span>{cell.row.NombreCompleto?.toUpperCase()}</span>
      ),
    },
    {
      field: "FechaRegistro",
      headerName: "Fecha Registro",
      align: "center",
      headerAlign: "center",
      flex: 1,
      renderCell: (cell: any) => (
        <span>{moment(cell.row.FechaRegistro).format("DD/MM/YYYY")}</span>
      ),
    },
    {
      field: "FechaAplicacion",
      headerName: "Fecha Aplicación",
      align: "center",
      headerAlign: "center",
      flex: 1,
      renderCell: (cell: any) => (
        <span>{moment(cell.row.FechaAplicacion).format("DD/MM/YYYY")}</span>
      ),
    },
    {
      field: "Importe",
      headerName: "Importe",
      align: "right",
      headerAlign: "center",
      flex: 1,
      renderCell: (cell: any) => (
        <span>
          {cell.row.Importe !== null && cell.row.Importe !== undefined
            ? `${cell.row.Importe.toLocaleString("es-ES", {
                style: "currency",
                currency: "MXN",
              })}`
            : "N/A"}
        </span>
      ),
    },
    {
      field: "AplicacionID",
      headerName: "Aplicacion",
      align: "center",
      headerAlign: "center",
      flex: 1,
      renderCell: (cell: any) => (
        <span>
          {cell.row.AplicacionID !== null && cell.row.AplicacionID !== undefined
            ? `${cell.row.AplicacionID}`
            : " - "}
        </span>
      ),
    },
  ];

  /** funcion Callback al agregar un item */
  const cbRespuesta = (Datos: any) => setState((s) => ({ ...s, Datos: Datos }));

  return (
    <div className="row">
      <div className="col-12">
        <Card Title="Administrar Canales de Pago">
          <Card.Body>
            <Card.Body.Content>
              {state.Cargando && <Spinner />}
              {state.Error && <span>Error al cargar los datos...</span>}
              {!state.Cargando && !state.Error && (
                <div>
                  <AplicacionesCanalesPago
                    oidc={props.oidc}
                    ui={props.ui}
                    initialValues={{
                      ProductoID: 0,
                      SucursalID: 0,
                      DistribuidorID: 0,
                      FechaInicio: moment().add(-7, "d").toDate(),
                      FechaFin: new Date(),
                      CanalPago: 1,
                    }}
                    cbRespuesta={cbRespuesta}
                  />
                  <DataGrid
                    className="mt-5"
                    rows={state.Datos}
                    columns={columnsMUI}
                    /* localeText={
                      esES.components.MuiDataGrid.defaultProps.localeText
                    } */
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: 20, page: 0 },
                      },
                    }}
                    getRowId={(row) => crypto.randomUUID()}
                    pageSizeOptions={[15, 20, 50, 100]}
                    rowSelection={false}
                    // rowHeight={42}
                  />
                </div>
              )}
            </Card.Body.Content>
          </Card.Body>
        </Card>
      </div>
    </div>
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
)(CreditoAplicacionesCanalesPago);
