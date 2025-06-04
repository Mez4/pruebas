import { FaCheckCircle, FaDownload, FaFilter, FaList } from "react-icons/fa";
import { Card, CustomFieldDatePicker, Spinner } from "../../../../global";
import ModalDispersionSpei from "./DispersionSpei/ModalConsultasSpei";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { FnReadCsvFile, getErrorParsed } from "../../../../../global/functions";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import withReactContent from "sweetalert2-react-content";
import * as Funciones from "./DispersionSpei/Funciones";
import DataGridComp from "../../../../global/DataGrid";
import { Sucursales } from "../../../../selectores";
import { useMemo, useRef, useState } from "react";
import { Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { Form, Formik } from "formik";
import Swal from "sweetalert2";
import moment from "moment";

type CatalogosType = {
  oidc: IOidc;
};

type SpeiCreditos = {
  SucursalID: number;
  FechaInicio: Date;
  FechaFin: Date;
};

type CsvAccesor = {
  [string: string]: { v: any; t: string; w: any };
};

type SpeiCreditosState = {
  SpeiList: any[];
  CreditosList: any[];
  Error: boolean;
  Cargando: boolean;
  Enviando: boolean;
  OpenCreditos: boolean;
  OpenDispersion: boolean;
};

const initialFormValues: SpeiCreditos = {
  SucursalID: 0,
  FechaInicio: moment().subtract(1, "day").parseZone().toDate(),
  FechaFin: moment().parseZone().toDate(),
};

const DispersionSpei = (props: CatalogosType) => {
  const MySwal = withReactContent(Swal);
  const fileInput = useRef<any>();
  const [state, setState] = useState<SpeiCreditosState>({
    SpeiList: [],
    CreditosList: [],
    Error: false,
    Cargando: false,
    Enviando: false,
    OpenCreditos: false,
    OpenDispersion: false,
  });

  const FnHandleFileInput = (e) => {
    e.preventDefault();
    fileInput && fileInput.current.click();
  };

  const FNDispersarPagos = () => {
    setState((s) => ({ ...s, Enviando: true }));

    const displaySpeiResultsAsTable = (results, title) => {
      return (
        <div>
          <h3>{title}</h3>
          {results && results.length > 0 ? (
            <table className="table table-striped table-sm table-dense table-bordered">
              <thead>
                <tr>
                  <th>Crédito ID</th>
                  <th>ID Transacción</th>
                  <th>Envío STP ID</th>
                  <th>Motivo</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item) => (
                  <tr key={item.ID}>
                    <td>{item.CreditoID}</td>
                    <td>{item.ID}</td>
                    <td>{item.EnvioSTPID}</td>
                    <td>{item.Motivo ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No se encontraron resultados.</p>
          )}
        </div>
      );
    };

    MySwal.fire({
      icon: "question",
      html: (
        <div>
          <br />
          <h3 className="text-center">
            <strong>Aviso</strong>
          </h3>
          <div className={`modal-body`}>
            <h5 className="text-center">
              ¿Estás seguro de guardar dispersar? .
            </h5>
            <h6 className="text-center">
              Esta operación no se puede deshacer.
            </h6>
          </div>
        </div>
      ),
      confirmButtonText: `Aceptar`,
      cancelButtonText: "Cancelar",
      showCancelButton: true,
      confirmButtonColor: `#3085d6`,
      cancelButtonColor: "red",
    })
      .then((value) => {
        if (value.isConfirmed)
          Funciones.FnDispersionSpei(props.oidc, {
            PagosList: JSON.stringify(state.SpeiList),
          })
            .then((respuesta: any) => {
              // AGREGAR SWAL CON DATOS
              let ArrayJsonDispersados = JSON.parse(respuesta.JsonDispersados);
              let ArrayJsonCancelados = JSON.parse(respuesta.JsonCancelados);
              console.log(ArrayJsonDispersados);
              console.log(ArrayJsonCancelados);
              MySwal.fire({
                icon: "info",
                width: "55rem",
                html: (
                  <div className="text-center">
                    <h1>Dispersar Pagos SPEI CV</h1>
                    {displaySpeiResultsAsTable(
                      ArrayJsonCancelados,
                      "Pagos No Dispersados (Cancelados)"
                    )}
                    {displaySpeiResultsAsTable(
                      ArrayJsonDispersados,
                      "Pagos Dispersados"
                    )}
                  </div>
                ),
                confirmButtonText: `Aceptar`,
                cancelButtonText: "Cancelar",
                showCancelButton: false,
                confirmButtonColor: `#3085d6`,
                cancelButtonColor: "red",
              }).then((value) => {
                if (value.isConfirmed) {
                  toast.success(
                    respuesta.msj ?? "PAGOS DISPERSADOS CORRECTAMENTE"
                  );
                  if (respuesta.status == 1)
                    setState((prev) => ({ ...prev, SpeiList: [] }));
                }
              });
            })
            .catch((error) => {
              console.log(error);
              toast.error(getErrorParsed(error));
            })
            .finally(() =>
              setState((s) => ({
                ...s,
                Enviando: false,
              }))
            );
        else setState((s) => ({ ...s, Enviando: false }));
      })
      .catch(() => {
        toast.error("Hubo un error al confirmar la dispersión de los pagos");
        setState((prev) => ({ ...prev, Enviando: false }));
      });
  };

  const readCsvFile = (props) => {
    setState((prev) => ({ ...prev, Cargando: true }));

    const extras = {
      consoleSheet: false,
      consoleJson: false,
      range: "A2:O10000",
      // mutator: (csvList: CsvAccesor | string) => {
      //   const newObj = {};
      //   Object.keys(csvList).forEach((val) => {
      //     console.log(csvList[val], val);
      //     newObj[val] = csvList[val];
      //   });
      //   return newObj;
      // },
    };

    FnReadCsvFile(props, extras)
      .then((res: any) => {
        toast.success("Datos obtenidos correctamente");
        setState((prev) => ({ ...prev, SpeiList: res }));
      })
      .catch((err) => toast.error(err))
      .finally(() =>
        setState((prev) => ({
          ...prev,
          Cargando: false,
        }))
      );
  };

  const Columns = useMemo(() => {
    if (state.SpeiList.length == 0) return [];

    return Object.keys(state.SpeiList[0]).map((v, i) => ({
      selector: v,
      name: v,
      center: true,
      flex: 1,
      minWidth: 120,
    }));
  }, [state.SpeiList]);

  return (
    <>
      <input
        type="file"
        ref={fileInput}
        onChange={readCsvFile}
        className="d-none"
        accept=".csv,.xlsx,.xls"
      />
      <div className="row ">
        <div className="col-12">
          <Card>
            <TituloConSelector Titulo={"DISPERSION SPEI"} />
            <Card.Body>
              <Card.Body.Content>
                <Formik
                  initialValues={initialFormValues}
                  onSubmit={FNDispersarPagos}
                >
                  {() => (
                    <>
                      <Form>
                        <FilterTemplate>
                          <div className="text-end column is-12-mobile is-12-tablet is-12-desktop">
                            <button
                              disabled={state.Cargando || state.Enviando}
                              className="btn btn-primary btn-lg"
                              onClick={FnHandleFileInput}
                            >
                              Subir archivo
                            </button>
                            <button
                              disabled={state.Cargando || state.Enviando}
                              className="btn btn-success btn-lg ml-2"
                              type="submit"
                            >
                              Dispersar pagos
                            </button>
                          </div>
                        </FilterTemplate>
                      </Form>
                    </>
                  )}
                </Formik>
              </Card.Body.Content>
              <div>
                {state.Cargando && <Spinner />}
                {state.Error && <span>Error al cargar los datos...</span>}
                {!state.Cargando && !state.Error && (
                  <>
                    <DataGridComp data={state.SpeiList} columns={Columns} />
                  </>
                )}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
};

const TituloConSelector = ({ Titulo = "" }) => {
  return (
    <div className="col-12 is-flex is-flex-direction-row is-justify-content-space-between card-header">
      <h4 className="font-16 mt-2">{Titulo}</h4>
    </div>
  );
};

export const FilterTemplate = ({ children }) => {
  return (
    <div
      style={{
        backgroundColor: "#F0F0F0",
        padding: "1em",
        borderRadius: "15px",
      }}
    >
      <div>
        <label>
          <FaFilter /> FILTROS
        </label>
      </div>

      <div
        style={{
          width: "100%",
          textAlign: "center",
          display: "inline-block",
        }}
      >
        <div className="columns is-left is-mobile is-multiline">{children}</div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IEstado) => ({
  oidc: state.oidc,
  ui: state.UI,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DispersionSpei);
