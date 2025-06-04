import { useState, useMemo, useRef, useEffect } from "react";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import { iUI } from "../../../../../../interfaces/ui/iUI";
import { toast } from "react-toastify";
import FiltroPorUsuario from "../../../general/CompGeneral/FiltroPorUsuario/FiltroPorUsuario";
import * as Funciones from "./Funciones";
import { Spinner } from "../../../../../global";

type FormDistPagoVencimientoType = {
  oidc: IOidc;
  ui: iUI;
  initialValues: {
    DirectorID: number;
    ProductoID: number;
    SucursalID: number;
    ZonaID: number;
    EmpresaID: number;
    DistribuidorID: number;
    CoordinadorID: number;
    creditoPromotorId: number;
    ContratoID: number;
    EstatusID: string;
    DistribuidorNivelID: number;
    FechaInicio: Date;
    FechaFin: Date;
    GrupoID: number;
    Permiso: boolean;
    tipoDias: string;
  };
};

const filtroExceptoCampo = (arr: any[], field: string, data: string) => {
  const response =
    field && data ? arr.filter((element) => element[`${field}`] == data) : arr;
  return response;
};

const filtro = (data: any[], values) => {
  let arr: any[] = filtroExceptoCampo(data, "", "");
  if (!isNaN(values.zona) && values.zona > 0)
    arr = filtroExceptoCampo(arr, "ZonaID", `${values.zona}`);
  if (!isNaN(values.sucursal) && values.sucursal > 0)
    arr = filtroExceptoCampo(arr, "SucursalID", `${values.sucursal}`);
  if (!isNaN(values.coordinador) && values.coordinador > 0)
    arr = filtroExceptoCampo(arr, "CoordinadorID", `${values.coordinador}`);
  return arr;
};

export default function FormDistPagoVencimiento(
  props: FormDistPagoVencimientoType
) {
  let isMounted = useRef(true);
  const Datos: any[] = [];
  const DatosMostrar: any[] = [];

  const [state, setState] = useState({
    Error: false,
    Datos,
    DatosMostrar,
    DatosReporte: false,
    Cargando: false,
  });

  const [loading, setLoading] = useState(false);
  const [zona, setZona] = useState(0);
  const [sucursal, setSucursal] = useState(0);
  const [coordinador, setCoordinador] = useState(0);

  const filtrar = (values: any) => {
    const ProdID = !isNaN(values.ProductoID)
      ? (values.ProductoID as number)
      : 0;
    const SucursalIDAux = !isNaN(values.SucursalID)
      ? (values.SucursalID as number)
      : 0;
    const ZonaAux = !isNaN(values.ZonaID) ? (values.ZonaID as number) : 0;
    const GrupoIDAux = !isNaN(values.GrupoID) ? (values.GrupoID as number) : 0;
    const CoordinadorIDAux = !isNaN(values.CoordinadorID)
      ? (values.CoordinadorID as number)
      : 0;

    if (!Boolean(ProdID)) {
      toast.info("Por favor, seleccione un producto");
      return;
    }

    setState((s) => ({
      ...s,
      Cargando: true,
    }));

    Funciones.FNReporte1625(props.oidc, {
      DirectorID: values.DirectorID,
      DistribuidorID: values.DistribuidorID,
      ClienteID: values.ClienteID,
      SucursalID: SucursalIDAux,
      ZonaID: ZonaAux,
      ProductoID: ProdID,
      GrupoID: GrupoIDAux,
      fechaCorte: values.Fecha, // En esta ocasion se utiliza para buscar una fecha en especifico,
      tipoDias: values.tipoDias,
      CoordinadorID: CoordinadorIDAux,
    })

      .then((respuesta: any) => {
        if (respuesta.length > 0) {
          let tabla: any[] = [];
          let ImporteTotal = 0;
          let SaldoActual = 0;
          let SaldoAtrasado = 0;
          let DiasAtraso = 0;
          let PagosAtrasados = 0;
          respuesta.forEach((element: any) => {
            let Reporte: any = {
              ZonaID: element.ZonaID,
              Zona: element.ZonaNombre,
              CoordinadorID: element.CoordinadorID,
              Coordinador: element.Coordinador,
              DistribuidorID: element.DistribuidorID,
              Distribuidor: element.PersonaNombre,
              Nivel_DistribuidorNivel: element.Nivel_DistribuidorNivel,
              ImporteTotal: element.ImporteTotal,
              SaldoActual: element.SaldoActual,
              SaldoAtrasado: element.SaldoAtrasado,
              DiasAtraso: element.DiasAtraso,
              PagosAtrasados: element.CortesAtrasados,
              DistribuidoresEstatusID: element.DistribuidoresEstatusID,
              DistribuidoresEstatus: element.DistribuidoresEstatus,
            };
            ImporteTotal += element.ImporteTotal;
            SaldoActual += element.SaldoActual;
            SaldoAtrasado += element.SaldoAtrasado;
            DiasAtraso += element.DiasAtraso;
            PagosAtrasados += element.CortesAtrasados;
            tabla.push(Reporte);
          });
          let TotalReporte: any = {
            ZonaID: "",
            Zona: "",
            CoordinadorID: "",
            Coordinador: "",
            DistribuidorID: "",
            Distribuidor: "",
            Nivel_DistribuidorNivel: "TOTAL:",
            ImporteTotal,
            SaldoActual,
            SaldoAtrasado,
            DiasAtraso,
            PagosAtrasados,
          };

          tabla.push(TotalReporte);
          setState((s) => ({
            ...s,
            Error: false,
            Datos: tabla,
            DatosReporte: true,
            Cargando: false,
          }));
          toast.success("Datos obtenidos correctamente");
        } else {
          setState((s) => ({
            ...s,
            Error: false,
            Datos: [],
            DatosReporte: false,
            Cargando: false,
          }));
          toast.warning("Datos No obtenidos, Verifique Si Existe El Cierre");
        }
      })
      .catch(() => {
        setState((s) => ({
          ...s,
          Error: true,
          Datos: [],
          DatosMostrar: [],
          Cargando: false,
        }));
        toast.error("Hubo un error al obtener los datos");
      });
  };

  useEffect(() => {
    const arr = filtro(state.Datos, { zona, sucursal, coordinador });
    setState((s) => ({ ...s, Datos: arr }));
  }, [zona, sucursal, coordinador]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, [props.oidc]);

  const Columns = useMemo(() => {
    let colRet: IDataTableColumn[] = [
      {
        name: "ZonaID",
        selector: "ZonaID",
        sortable: false,
        center: true,
        wrap: true,
        width: "70px",
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
        name: "Zona",
        selector: "Zona",
        sortable: false,
        center: true,
        wrap: true,
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
        name: "Coordinador",
        selector: "Coordinador",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>{props.Coordinador}</span>
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
        name: "Socia ID",
        selector: "DistribuidorID",
        sortable: true,
        center: true,
        wrap: true,
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
        name: "Socia",
        selector: "Distribuidor",
        sortable: true,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>{props.Distribuidor}</span>
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
        name: "Nivel Socia",
        selector: "Nivel_DistribuidorNivel",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props.Nivel_DistribuidorNivel}
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
        name: "Estatus ID",
        selector: "DistribuidoresEstatusID",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props.DistribuidoresEstatusID}
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
        selector: "DistribuidoresEstatus",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props.DistribuidoresEstatus}
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
        name: "Importe Total",
        selector: "ImporteTotal",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props.ImporteTotal?.toLocaleString("en-US", {
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
        name: "Saldo Actual",
        selector: "SaldoActual",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props.SaldoActual.toLocaleString("en-US", {
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
        name: "Saldo Atrasado",
        selector: "SaldoAtrasado",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props.SaldoAtrasado.toLocaleString("en-US", {
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
        name: "Dias Atraso",
        selector: "DiasAtraso",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props.DiasAtraso.toLocaleString("en-US")}
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
        name: "Pagos Atrasados",
        selector: "PagosAtrasados",
        sortable: false,
        center: true,
        cell: (props) => (
          <span style={{ textAlign: "center" }}>
            {props.PagosAtrasados.toLocaleString("en-US")}
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
  }, []);

  return (
    <div>
      {state.Cargando && <Spinner />}
      {!state.Cargando && (
        <FiltroPorUsuario
          oidc={props.oidc}
          ui={props.ui}
          initialValues={props.initialValues}
          onSubmit={filtrar}
          loading={loading}
          Es1506={true}
          PrintExcelObj={{
            data: state.Datos,
            title: "Consulta Rapida 1625",
            nameDoc: "ConsultaRapida(1625)",
          }}
        />
      )}
      <DataTable
        data={state.Datos}
        //progressPending={loading}
        //progressComponent={<Spinner />}
        striped
        //pagination
        defaultSortAsc={true}
        dense
        noHeader
        responsive
        keyField={""}
        columns={Columns}
        theme="solarized"
        onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
          setState((s) => ({ ...s, Error: false, DatosMostrar: state.Datos }));
        }}
      />
    </div>
  );
}
