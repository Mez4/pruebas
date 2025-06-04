import React, { useState } from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import DataTable, { IDataTableColumn } from "react-data-table-component";

// Icons
import { FaSearch, FaBan, FaListAlt, FaFileDownload } from "react-icons/fa";

// Custom components
import { Card, Spinner } from "../../../../global";
import { Aplicaciones } from "./AplicacionesSocia/AplicacionesSocia";
import { FiltrarDatos, addOneDay } from "../../../../../global/functions";
import { DBConfia_Creditos } from "../../../../../interfaces_db/DBConfia/Creditos";

import ReactTooltip from "react-tooltip";
import moment from "moment";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { iUI } from "../../../../../interfaces/ui/iUI";

type CatalogosType = {
  oidc: IOidc;
  ui: iUI;
};

type EstadoTipo = {
  Datos: DBConfia_Creditos.IAplicaciones_VW[];
  DatosMostrar: DBConfia_Creditos.IAplicaciones_VW[];
  DatosDetalle: any[];
  Filtro: string;
  Cargando: boolean;
  Error: boolean;
  Form: {
    Mostrar: boolean;
    Datos?: DBConfia_Creditos.IAplicaciones;
    Id?: number;
  };
  Detalle: boolean;
  AplicacionID: number;
  DistribuidorID: number;
  Distribuidor: string;
  ClienteID: number;
  Cliente: string;
  Descargar: boolean;
};

const AplicacionesSocia = (props: CatalogosType) => {
  const MySwal = withReactContent(Swal);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const [state, setState] = React.useState<EstadoTipo>({
    Datos: [],
    DatosMostrar: [],
    DatosDetalle: [],
    Filtro: "",
    Cargando: false,
    Error: false,
    Form: {
      Mostrar: false,
      Datos: undefined,
      Id: undefined,
    },
    Detalle: false,
    AplicacionID: 0,
    DistribuidorID: 0,
    Distribuidor: "",
    ClienteID: 0,
    Cliente: "",
    Descargar: false,
    // CreditoID: 0,
  });

  // const FNGetDetalle = (AplicacionID: number, data: any) => {
  //   setState((s) => ({
  //     ...s,
  //     DatosDetalle: [],
  //   }));
  //   Funciones.FNGetAbonos(props.oidc, AplicacionID)
  //     .then((respuesta: any) => {
  //       setState((s) => ({
  //         ...s,
  //         Detalle: true,
  //         DatosDetalle: respuesta,
  //         DistribuidorID: data.DistribuidorID,
  //         Distribuidor: data.Distribuidor,
  //         ClienteID: data.ClienteID,
  //         Cliente: data.Cliente,
  //         AplicacionID,
  //       }));
  //     })
  //     .catch(() => {
  //       setState((s) => ({
  //         ...s,
  //         Detalle: false,
  //         DatosDetalle: [],
  //         DistribuidorID: 0,
  //         Distribuidor: "",
  //         ClienteID: 0,
  //         Cliente: "",
  //         AplicacionID: 0,
  //       }));
  //     });
  // };  

  const Columns = React.useMemo(() => {
    let colRet: IDataTableColumn[] = [
      {
        name: "Id",
        selector: "AplicacionID",
        sortable: true,
        hide: "sm",
      },
      { name: "Sucursal", selector: "Sucursal", sortable: true },
      {
        name: "Socia",
        width: "250px",
        selector: "PersonaAplica",
        sortable: true,
        cell: (props) => (
          <>
            <span
              data-tip
              data-for={`DistribuidorTooltip${props.AplicacionID}`}
            >
              {props.PersonaAplica}
            </span>
            <ReactTooltip
              id={`DistribuidorTooltip${props.AplicacionID}`}
              type="dark"
              effect="solid"
              clickable
              globalEventOff="click"
            >
              {props.PersonaAplica}
            </ReactTooltip>
          </>
        ),
      },
      {
        name: "Fecha",
        width: "110px",
        selector: "FechaAplicacion",
        sortable: true,
        cell: (props) => (
          <span>
            {moment(new Date(props.FechaAplicacion))
              .add(1, "days")
              .format("DD/MM/YYYY")}
          </span>
        ),
      },
      {
        name: "Pago",
        selector: "Pago",
        sortable: true,
        format: (row) => formatter.format(row.Pago),
      },
      {
        name: "Sistema origen",
        selector: "SistemaOrigen",
        sortable: true,
      },
      {
        name: "Pago atrasado",
        selector: "PagoAtrasado",
        sortable: true,
        cell: (props) => <span>{props.PagoAtrasado ? "SI" : "No"}</span>,
      },
    ];
    return colRet;
  }, []);

  React.useEffect(() => {
    setState((s) => ({
      ...s,
      DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro),
    }));
  }, [state.Datos, state.Filtro]);

  /** funcion Callback al agregar un item */
  const cbRespuesta = (Datos: any) => setState((s) => ({ ...s, Datos: Datos }));

  return (
    <div className="row">
      <div className="col-12">
        <Card Title="Aplicaciones Socia">
          <Card.Body>
            <Card.Body.Content>
              {state.Cargando && <Spinner />}
              {state.Error && <span>Error al cargar los datos...</span>}
              {!state.Cargando && !state.Error && (
                <div>
                  <Aplicaciones
                    oidc={props.oidc}
                    ui={props.ui}
                    initialValues={{
                      SucursalID: 0,
                      DistribuidorID: 0,
                    }}
                    cbRespuesta={cbRespuesta}
                  />
                  <DataTable
                    subHeader
                    subHeaderComponent={
                      <div className="row">
                        <div className="col-sm-12">
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Buscar aplicacion"
                              value={state.Filtro}
                              onChange={(e) =>
                                setState((s) => ({
                                  ...s,
                                  Filtro: e.target.value,
                                }))
                              }
                            />
                            <span className="input-group-text">
                              <FaSearch />{" "}
                            </span>
                          </div>
                        </div>
                      </div>
                    }
                    data={state.DatosMostrar}
                    striped
                    pagination
                    dense
                    responsive
                    keyField={"AplicacionID"}
                    defaultSortField={"AplicacionID"}
                    columns={Columns}
                    // expandableRows
                    noDataComponent={"No se encontró ningún registro"}
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

export default connect(mapStateToProps, mapDispatchToProps)(AplicacionesSocia);
