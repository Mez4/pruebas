import { useEffect, useState } from "react";
import { IOidc } from "../../../../../../interfaces/oidc/IOidc";
import * as Funciones from "./Funciones";
import { toast } from "react-toastify";
import moment from "moment";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import {
  ActionSelect,
  DatePickeEnd,
  DatePickeStart,
  Spinner,
} from "../../../../../global";
import {
  FaExclamationCircle,
  FaFileExcel,
  FaFilter,
  FaSearch,
} from "react-icons/fa";
import { Form, Formik } from "formik";
import { FiltrarDatos } from "../CreditoColocacion/Funciones";
import * as Yup from "yup";
import XLSX from "xlsx";
import { Sucursales } from "../../../../../selectores";

type CFormType = {
  oidc: IOidc;
};
export const CFormValesDesembolsados = (props: CFormType) => {
  // informacion cruda de la peticion
  const data: any[] = [];
  //informacion de los tipos de creditos
  const [tipoCredito, setTipoCredito] = useState<any[]>([]);
  // informacion que se podra filtrar
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(moment().toDate());
  const [endDate, setEndDate] = useState(moment().toDate());

  const [state, setState] = useState({
    data,
    tipoCredito,
    loading: true,
    filterFolio: 0,
    filterTipoCredito: 0,
    filterSearch: "",
  });

  const fnGetFiltroTipoCredito = (TipoCredito: number) => {
    setState((s) => ({ ...s, filterTipoCredito: TipoCredito }));
  };
  const getTipoCredito = () => {
    Funciones.FNGetCatologoTipoCredito(props.oidc)
      .then((res: any) => {
        res.unshift({ TipoCreditoID: 0, Clave: "TODOS", Descripcion: "TODOS" });
        var estatus = res.map((tipo: any) => {
          return {
            value: tipo.TipoCreditoID,
            label: `${tipo.Descripcion} (${tipo.Clave})`,
          };
        });
        setTipoCredito(estatus);
      })
      .catch(() => {
        toast.error("Error al obtener los tipos de credito");
      });
  };

  const getReport_149 = (startDate, endDate, SucursalID) => {
    setState((s) => ({ ...s, loading: true }));
    var obj = {
      FechaInicio: moment(startDate).format("YYYY-MM-DD"),
      FechaFin: moment(endDate).format("YYYY-MM-DD"),
      SucursalID: SucursalID,
    };
    //OBTENEMOS EL REPORTE 149
    Funciones.FNGetReport(props.oidc, obj)
      .then((res: any) => {
        //ENVIAMOS LA INFORMACION A UN ARREGLO
        setState((s) => ({
          ...s,
          data: res,
          loading: false,
        }));
      })
      .catch(() => {
        toast.error(
          "Ocurrio un error, vuelva a intentarlo o reportelo a sistemas."
        );
        setState((s) => ({ ...s, loading: false }));
      });
  };

  const fnFiltrando = () => {
    let data = state.data;
    // console.log(data);
    if (state.filterTipoCredito !== 0) {
      data = data.filter(
        (item: any) => item.TipoCreditoID === state.filterTipoCredito
      );
    }

    if (state.filterFolio === 1) {
      data = data.filter((item: any) => item.ValeCanje > 0);
    } else if (state.filterFolio === 2) {
      data = data.filter((item: any) => item.ValeCanje <= 0);
    } else {
      data = data;
    }

    data = FiltrarDatos(data, Columns, state.filterSearch);
    console.log(data);

    setFilteredData(data);

    setState((s) => ({ ...s, loading: false }));
  };
  const GenerarXLSX = (data: any[], title: string, nameDoc: string) => {
    console.log(data);

    console.log("GenerarXLSX");

    if (data.length == 0) {
      toast.warning("No se encontro informacion para exportar");
      return;
    }
    const XLSX = require("xlsx-js-style");

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    // XLSX.writeFile(wb, `${nameDoc}.xlsx`);
    setTimeout(() => {
      XLSX.writeFile(wb, `${nameDoc}.xlsx`);
    }, 100);
  };

  useEffect(() => {
    fnFiltrando();
  }, [
    state.filterFolio,
    state.data,
    state.filterSearch,
    state.filterTipoCredito,
  ]);

  useEffect(() => {
    getTipoCredito();
  }, []);

  //COLUMNAS DE LOS REGISTROS DE LOS REPORTES
  const Columns: IDataTableColumn[] = [
    {
      name: "Sucursal ID",
      selector: "SucursalID",
      sortable: true,
      center: true,
      width: "150px",
      cell: (row) => {
        return <span className="text-center">{row.SucursalID}</span>;
      },
    },
    {
      name: "Sucursal",
      selector: "SucursalNombre",
      sortable: true,
      center: true,
      width: "300px",
      cell: (row) => {
        return <span className="text-center">{row.SucursalNombre}</span>;
      },
    },
    {
      name: "Coordinador ID",
      selector: "CoordinadorID",
      sortable: true,
      center: true,
      width: "150px",
      cell: (row) => {
        return <span className="text-center">{row.CoordinadorID}</span>;
      },
    },
    {
      name: "Coordinador Vale",
      selector: "NombreCompleto",
      sortable: true,
      center: true,
      width: "300px",
      cell: (row) => <span className="text-center">{row.NombreCompleto}</span>,
    },
    {
      name: "Distribuidor ID",
      selector: "DistribuidorID",
      sortable: true,
      center: true,
      width: "150px",
      cell: (row) => <span className="text-center">{row.DistribuidorID}</span>,
    },
    {
      name: "Nombre Distribuidor",
      selector: "PersonaNombre",
      sortable: true,
      center: true,
      width: "300px",
      cell: (row) => <span className="text-center">{row.PersonaNombre}</span>,
    },
    {
      name: "Linea Credito",
      selector: "LineaCredito",
      sortable: true,
      center: true,
      width: "150px",
      cell: (row) => <span className="text-center">{row.LineaCredito}</span>,
    },
    {
      name: "Linea Credito Disponible",
      selector: "CreditoDisponible",
      sortable: true,
      center: true,
      width: "150px",
      cell: (row) => (
        <span className="text-center">{row.LineaCreditoDisponible}</span>
      ),
    },
    {
      name: "Credito ID",
      selector: "CreditoID",
      sortable: true,
      center: true,
      width: "150px",
      cell: (row) => <span className="text-center">{row.CreditoID}</span>,
    },
    {
      name: "Cliente ID",
      selector: "ClienteID",
      sortable: true,
      center: true,
      width: "150px",
      cell: (row) => <span className="text-center">{row.ClienteID}</span>,
    },
    {
      name: "Nombre Cliente",
      selector: "NombreCliente",
      sortable: false,
      center: true,
      width: "300px",
      cell: (row) => <span className="text-center">{row.NombreCliente}</span>,
    },
    {
      name: "Vale Canje",
      selector: "ValeCanje",
      sortable: false,
      center: true,
      width: "150px",
      cell: (row) => <span className="text-center">{row.ValeCanje}</span>,
    },
    {
      name: "FechaHoraRegistro",
      selector: "Hora Registro",
      sortable: true,
      center: true,
      width: "300px",
      cell: (row) => (
        <span className="text-center">
          {moment(row.FechaHoraRegistro).format("DD/MM/YYYY hh:mm:ss")}
        </span>
      ),
    },
    {
      name: "Contador",
      selector: "Contador",
      sortable: false,
      center: true,
      width: "150px",
      cell: (row) => <span className="text-center">{row.Contador}</span>,
    },
    {
      name: "ImporteTotal",
      selector: "ImporteTotal",
      sortable: false,
      center: true,
      width: "150px",
      cell: (row) => (
        <span className="text-center">{`${row.ImporteTotal.toLocaleString(
          "es-ES",
          { style: "currency", currency: "MXN" }
        )}`}</span>
      ),
    },
    {
      name: "Interes",
      selector: "Interes",
      sortable: false,
      center: true,
      width: "150px",
      cell: (row) => (
        <span className="text-center">{`${row.Interes.toLocaleString("es-ES", {
          style: "currency",
          currency: "MXN",
        })}`}</span>
      ),
    },
    {
      name: "Seguro",
      selector: "Seguro",
      sortable: false,
      center: true,
      width: "150px",
      cell: (row) => (
        <span className="text-center">{`${row.Seguro.toLocaleString("es-ES", {
          style: "currency",
          currency: "MXN",
        })}`}</span>
      ),
    },
    {
      name: "IVA",
      selector: "IVA",
      sortable: false,
      center: true,
      width: "150px",
      cell: (row) => (
        <span className="text-center">{`${row.IVA.toLocaleString("es-ES", {
          style: "currency",
          currency: "MXN",
        })}`}</span>
      ),
    },
    {
      name: "Plazos",
      selector: "Plazos",
      sortable: false,
      center: true,
      width: "100px",
      cell: (row) => <span className="text-center">{row.Plazos}</span>,
    },
    {
      name: "EstatusID",
      selector: "EstatusID",
      sortable: false,
      center: true,
      width: "150px",
      cell: (row) => {
        const getStatus = (statusID) => {
          switch (statusID) {
            case "A":
              return "Activo";
            case "C":
              return "Cancelado";
            case "D":
              return "Entrega";
            case "K":
              return "ODP Cancelada";
            case "L":
              return "Liquidado";
            case "P":
              return "Prospecto";
            case "R":
              return "Rechazado";
            default:
              return "Sin Estatus";
          }
        };
        return <span className="text-center">{getStatus(row.EstatusID)}</span>;
      },
    },
    {
      name: "UsuarioID Creador",
      selector: "UsuarioIDRegistro",
      sortable: false,
      center: true,
      width: "150px",
      cell: (row) => (
        <span className="text-center">{row.UsuarioIDRegistro}</span>
      ),
    },
    {
      name: "Usuario Creador",
      selector: "nombreUsuarioCreacion",
      sortable: false,
      center: true,
      width: "300px",
      cell: (row) => (
        <span className="text-center">{row.nombreUsuarioCreacion}</span>
      ),
    },
    {
      name: "Tipo Desembolso",
      selector: "TipoDesembolso",
      sortable: false,
      center: true,
      width: "250px",
      cell: (row) => <span className="text-center">{row.TipoDesembolso}</span>,
    },
    {
      name: "Tipo Credito",
      selector: "tipoCreditoNombre",
      sortable: false,
      center: true,
      width: "200px",
      cell: (row) => (
        <span className="text-center">{row.tipoCreditoNombre}</span>
      ),
    },
  ];

  // FUNCION PARA COLOREAR UNA CELDA SEGUN EL FOLIO
  const conditionalRowStyles = [
    //NOMINA FISCAL
    {
      when: (row) => row.TipoCreditoID == 4,
      style: {
        backgroundColor: "#FABE79",
      },
    },
    //PRESTAMO SOCIA
    {
      when: (row) => row.TipoCreditoID == 5,
      style: {
        backgroundColor: "#bffcfe",
      },
    },
    //TIENDITA
    {
      when: (row) => row.TipoCreditoID == 6,
      style: {
        backgroundColor: "#f5f5ad",
      },
    },
    //CONFIASHOP
    {
      when: (row) => row.TipoCreditoID == 3,
      style: {
        backgroundColor: "#ccfbb0",
      },
    },
    // VALERA
    {
      when: (row) => row.TipoCreditoID == 7,
      style: {
        backgroundColor: "#b0fbe7",
      },
    },
    // PROTECCIONES
    {
      when: (row) => row.TipoCreditoID == 8,
      style: {
        backgroundColor: "#f9d3fb",
      },
    },
    // PROTECCIONES
    {
      when: (row) => row.TipoCreditoID == 1,
      style: {
        backgroundColor: "#ffe2ca",
      },
    },
  ];
  return (
    <div className="col-12">
      {state.loading ? (
        <div className="text-center">
          <Spinner />
          <p className="mt-1">Cargando datos... </p>
        </div>
      ) : (
        <>
          <div className="col-sm-12">
            <div style={{ background: "#F7F7F7" }} className="p-4">
              <div>
                <div style={{ float: "left" }}>
                  <FaFilter />
                </div>
                <p>
                  <label> FILTROS</label>
                </p>
              </div>
              <Formik
                initialValues={{
                  FechaInicio: startDate,
                  FechaFin: endDate,
                  SucursalID: 0,
                }}
                validationSchema={Yup.object().shape({
                  FechaInicio: Yup.date()
                    .required("La fecha inicio es requerida")
                    .typeError("Fecha inicio es requerida"),
                  FechaFin: Yup.date()
                    .required("La fecha fin es requerida")
                    .typeError("Fecha fin es requerida"),
                  SucursalID: Yup.number().nullable(true),
                })}
                onSubmit={(values) => {
                  getReport_149(
                    values.FechaInicio,
                    values.FechaFin,
                    values.SucursalID
                  );
                }}
              >
                <Form>
                  <div className="columns is-desktop is-tablet">
                    <div className="column is-12-mobile is-12-tablet is-3-desktop">
                      <DatePickeStart
                        name={"FechaInicio"}
                        label={"Fecha Inicio"}
                        disabled={loading}
                        placeholder={"Fecha"}
                        isClearable
                        startDate={startDate}
                        endDate={endDate}
                        setStartDate={setStartDate}
                      />
                    </div>
                    <div className="column is-12-mobile is-12-tablet is-3-desktop">
                      <DatePickeEnd
                        name={"FechaFin"}
                        label={"Fecha Fin"}
                        disabled={loading}
                        placeholder={"Fecha"}
                        isClearable
                        startDate={startDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                      />
                    </div>
                    <div className="column is-12-mobile is-12-tablet is-3-desktop">
                      <ActionSelect
                        disabled={false}
                        label="Tipo de Credito"
                        name="TipoCredito"
                        placeholder="TODOS"
                        options={tipoCredito}
                        addDefault={false}
                        valor={state.tipoCredito}
                        accion={fnGetFiltroTipoCredito}
                      />
                    </div>
                    <div className="column is-12-mobile is-12-tablet is-3-desktop">
                      <Sucursales
                        disabled={loading}
                        IsAction
                        name={"SucursalID"}
                        valor={0}
                      />
                    </div>
                  </div>
                  <div className="text-end column is-12-mobile is-12-tablet is-12-desktop mt-3">
                    <button
                      disabled={state.loading}
                      type="button"
                      className="btn btn-success waves-effect waves-light me-2"
                      onClick={() => {
                        GenerarXLSX(state.data, "REPORTE", `REPORTEVALES`);
                      }}
                    >
                      Exportar
                      <FaFileExcel
                        size="20px"
                        style={{ marginTop: -2 }}
                        className="ms-2"
                      />
                    </button>
                    <button
                      disabled={state.loading}
                      className="btn btn-primary waves-effect waves-light"
                      type="submit"
                    >
                      Buscar
                    </button>
                  </div>
                </Form>
              </Formik>
            </div>
          </div>
          <div className="col-sm-12">
            <DataTable
              noHeader
              subHeader
              fixedHeader
              subHeaderComponent={
                <>
                  <div
                    style={{ height: "40px", width: "200px" }}
                    className="input-group mt-4"
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Busqueda"
                      value={state.filterSearch}
                      onChange={(e) =>
                        setState((s) => ({
                          ...s,
                          filterSearch: e.target.value,
                        }))
                      }
                    />
                    <span className="input-group-text">
                      <FaSearch />{" "}
                    </span>
                  </div>
                </>
              }
              paginationComponentOptions={{
                rowsPerPageText: "Registros por página:",
                rangeSeparatorText: "de",
                noRowsPerPage: false,
                selectAllRowsItem: false,
                selectAllRowsItemText: "Todo",
              }}
              noDataComponent={
                <div className="text-center" style={{ margin: "4em" }}>
                  <FaExclamationCircle />
                  <h5>No hay datos</h5>
                </div>
              }
              data={filteredData}
              columns={Columns}
              pagination
              striped
              responsive
              conditionalRowStyles={conditionalRowStyles}
              defaultSortAsc={false}
            />
          </div>
        </>
      )}
    </div>
  );
};
