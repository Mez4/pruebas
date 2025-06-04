import { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import * as Funciones from "./CreditoAdministrarTicket/Funciones";
// Icons
import { FaSearch, FaBan, FaFileDownload, FaCheck } from "react-icons/fa";

// Custom components
import { Card, Spinner } from "../../../../global";
import { AplicacionesDNI } from "./CreditoAplicacionesDNI/AplicacionesDNI";
import { FiltrarDatos, addOneDay } from "../../../../../global/functions";

import ReactTooltip from "react-tooltip";
import moment from "moment";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
import { iUI } from "../../../../../interfaces/ui/iUI";
import { AdministrarTicket } from "./CreditoAdministrarTicket/AdministrarTicket";
import { FaCircleCheck } from "react-icons/fa6";

type MovimientosDNI = {
  MovimientoID: number;
  CuentaID: number;
  SucursalId: number;
  NombreSucursal: string;
  CuentaDestinoID?: number;
  FechaAfectacion?: Date;
  FechaCaptura: Date;
  Importe: number;
  Observaciones: string;
  TipoMovimientoID: number;
  ProductoId?: number;
  RefApl?: number;
  gastoSucursal?: number;
  movimientoIdTraspaso?: number;
  cancelacionObservacion: string;
  cancelacionUsuario?: number;
  cancelacionImporte?: number;
  cancelacionFhRegistro?: Date;
  cancelacionTipMovimiento?: number;
  PolizaId?: number;
  Estatus: string;
  Contabilizado?: boolean;
  CajaId?: number;
  PersonaIDRegistro?: number;
  NombrePersonaRegistro: string;
  PeriodoID: number;
  ObservacionesUsuario: string;
  CatEstatusMovID: number;
  FechaCancelacion?: Date;
  UsuarioIDRegistra: number;
  MovimientoBoveda: boolean;
  TipoMovimiento: string;
  EstDsc: string;
  Distribuidor: string;
  DistribuidorID: number;
  bitAplicado?: boolean;
  bitAplicadoResto?: boolean;
  restoDNI?: number;
};

type CatalogosType = {
  oidc: IOidc;
  ui: iUI;
};

type EstadoTipo = {
  Datos: MovimientosDNI[];
  DatosMostrar: MovimientosDNI[];
  DatosDetalle: any[];
  Filtro: string;
  Cargando: boolean;
  Error: boolean;
  MovimientoID: number;
  DistribuidorID: number;
  Distribuidor: string;
  Descargar: boolean;
  estatusMovimientoOpt: any[];
};

const CreditoAdministrarTicket = (props: CatalogosType) => {
  const MySwal = withReactContent(Swal);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const [state, setState] = useState<EstadoTipo>({
    Datos: [],
    DatosMostrar: [],
    DatosDetalle: [],
    Filtro: "",
    Cargando: false,
    Error: false,
    MovimientoID: 0,
    DistribuidorID: 0,
    Distribuidor: "",
    Descargar: false,
    estatusMovimientoOpt: [],
  });

  const fNCancelarDNI = (MovimientoID: number, MotivoCancelacion: string) => {
    Funciones.FNCancelarTicket(props.oidc, MovimientoID, MotivoCancelacion)
      .then((respuesta: any) => {
        console.log('respppp',respuesta)
        if(respuesta.regresa === 1)
        {
          toast.success(respuesta.msj);
          cbCancelar(MovimientoID);
        }
        else
        {
          toast.warning('Error en cancelación: ',respuesta.msj);
        }
        
      })
      .catch(() => {
        toast.error(
          "Ocurrio un error, vuelva a intentarlo o reportelo a sistemas."
        );
      });
  };

  const fNAplicarTicket = (MovimientoID: number, MotivoCancelacion: string) => {
    Funciones.FNAplicarTicket(props.oidc, MovimientoID, MotivoCancelacion)
      .then((respuesta: any) => {
        console.log('respppp',respuesta)
        if(respuesta.regresa === 1)
        {
          toast.success(respuesta.msj);
          cbCancelar(MovimientoID);
        }
        else
        {
          toast.warning('Error en aplicación: ',respuesta.msj);
        }
        
      })
      .catch(() => {
        toast.error(
          "Ocurrio un error, vuelva a intentarlo o reportelo a sistemas."
        );
      });
  };

  const fnGetEstatusMovimiento = () => {
    setState((s) => ({ ...s, Cargando: true }));

    Funciones.FNGetEstatusMovimiento(props.oidc)
      .then((respuesta: any) => {
        var estatusMovimientoOpt = respuesta.map((valor: any) => {
          var obj = {
            value: valor.CatEstatusMovID,
            label: valor.Descripcion,
          };
          return obj;
        });

        setState((s) => ({
          ...s,
          estatusMovimientoOpt: estatusMovimientoOpt,
          Cargando: false,
        }));
      })
      .catch(() => {
        setState((s) => ({ ...s, estatusMovimientoOpt: [], Cargando: false }));
      });
  };

  const Columns = useMemo(() => {
    let colRet: IDataTableColumn[] = [
      {
        name: "Id",
        selector: "MovimientoID",
        sortable: true,
      },
      {
        name: "Sucursal",
        selector: "NombreSucursal",
        style: { whiteSpace: "wrap" },
        sortable: true,
        cell: (props) => (
          <>
            <span data-tip data-for={`SucursalTooltip${props.NombreSucursal}`}>
              {props.NombreSucursal}
            </span>
            <ReactTooltip
              id={`SucursalTooltip${props.NombreSucursal}`}
              type="dark"
              effect="solid"
              clickable
              globalEventOff="click"
            >
              {props.NombreSucursal}
            </ReactTooltip>
          </>
        ),
      },
      { name: "Id Socia", selector: "DistribuidorID", sortable: true },
      {
        name: "Socia",
        selector: "Distribuidor",
        style: { whiteSpace: "wrap" },
        sortable: true,
        cell: (props) => (
          <>
            <span
              data-tip
              data-for={`DistribuidorTooltip${props.DistribuidorID}`}
            >
              {props.Distribuidor}
            </span>
            <ReactTooltip
              id={`DistribuidorTooltip${props.DistribuidorID}`}
              type="dark"
              effect="solid"
              clickable
              globalEventOff="click"
            >
              {props.Distribuidor}
            </ReactTooltip>
          </>
        ),
      },
      {
        name: "Fecha Aplicación",
        selector: "FechaAfectacion",
        sortable: true,
        cell: (props) => (
          <span>
            {moment(new Date(props.FechaAfectacion)).format("DD/MM/YYYY")}
          </span>
        ),
      },
      {
        name: "Fecha Captura",
        selector: "FechaCaptura",
        sortable: true,
        cell: (props) => (
          <span>
            {moment(new Date(props.FechaCaptura)).format("DD/MM/YYYY")}
          </span>
        ),
      },
      {
        name: "Persona registro",
        selector: "NombreGestorRegistra",
        sortable: true,
        style: { whiteSpace: "wrap" },
        cell: (props) => <span>{props.NombreGestorRegistra}</span>,
      },
      {
        name: "Importe",
        selector: "Importe",
        sortable: true,
        format: (row) => formatter.format(row.Importe),
      },
      {
        name: "Estatus",
        selector: "EstDsc",
        sortable: true,
        cell: (props) => <span>{props.EstDsc}</span>,
      },
      {
        name: "Fecha Cancelacion",
        selector: "Fecha_Cancela",
        sortable: true,
        cell: (props) => (
          <span>
            {props.cancelacionFhRegistro
              ? moment(props.Fecha_Cancela).format("DD/MM/YYYY")
              : ""}
          </span>
        ),
      },
      {
        name: "Observacion Cancelacion",
        selector: "cancelacionObservacion",
        sortable: true,
        cell: (props) => <span>{props.cancelacionObservacion}</span>,
      },
      {
        name: "Persona cancela",
        selector: "PersonaCancela",
        sortable: true,
        style: { whiteSpace: "wrap" },
        cell: (props) => <span>{props.PersonaCancela}</span>,
      },
      
      {
        name: "Observacion Aplicación",
        selector: "aplicacionObservacion",
        sortable: true,
        cell: (props) => <span>{props.aplicacionObservacion}</span>,
      },
      {
        name: "Persona cancela",
        selector: "PersonaAplica",
        sortable: true,
        style: { whiteSpace: "wrap" },
        cell: (props) => <span>{props.PersonaAplica}</span>,
      },
    ];
    return colRet;
  }, []);

  const HiddenColumns: IDataTableColumn[] = [
    {
      name: "Acciones",
      sortable: false,
      wrap: true,
      cell: (data) => (
        <div style={{ width: "25%", overflowX: "auto", whiteSpace: "nowrap" }}>
          <button
            disabled={
              (data.CatEstatusMovID == 3)
            }
            data-tip="true"
            data-for={`CancelarTooltip${data.MovimientoID}`}
            className="asstext"
            style={{
              margin: ".15em",
              width: "15%",
              height: "40px",
              padding: "0px",
              tableLayout: "fixed",
              borderCollapse: "collapse",
            }}
            type={"button"}
            onClick={() => {
              MySwal.fire({
                title: "<strong>Cancelar Ticket</strong>",
                icon: "question",
                input: "text",
                inputAttributes: {
                  autocapitalize: "off",
                },
                html: (
                  <div className="text-center">
                    Se cancelará el Ticket ¿Desea continuar?
                  </div>
                ),
                showCloseButton: false,
                showCancelButton: true,
                showConfirmButton: true,
                showLoaderOnConfirm: true,
                focusConfirm: false,
                cancelButtonText: "Cancelar",
                confirmButtonText: "Aceptar",
                confirmButtonAriaLabel: "Aceptar",
                cancelButtonAriaLabel: "",
                preConfirm: (motivo) => {
                  if (motivo == "") {
                    Swal.showValidationMessage(
                      `Ingrese el motivo de Cancelación`
                    );
                  }
                },
              }).then((result) => {
                if (result.isConfirmed) {
                  let motivo = result.value as unknown;
                  fNCancelarDNI(data.MovimientoID, motivo as string);
                }
              });
            }}
          >
            <FaBan />
          </button>
          <ReactTooltip
            id={`CancelarTooltip${data.MovimientoID}`}
            type="info"
            effect="solid"
            clickable
            globalEventOff="click"
          >
            Cancelar Ticket
          </ReactTooltip>
          <button
            disabled={data.CatEstatusMovID != 2}
            data-tip="true"
            data-for={`DetalleTooltip${data.MovimientoID}`}
            className="asstext"
            style={{
              margin: ".15em",
              width: "15%",
              height: "40px",
              padding: "0px",
              tableLayout: "fixed",
              borderCollapse: "collapse",
            }}
            type={"button"}
            onClick={() => {
                MySwal.fire({
                  title: "<strong>Marcar Ticket Como Aplicado</strong>",
                  icon: "question",
                  input: "text",
                  inputAttributes: {
                    autocapitalize: "off",
                  },
                  html: (
                    <div className="text-center">
                      Se marcará como aplicato el Ticket ¿Desea continuar?
                    </div>
                  ),
                  showCloseButton: false,
                  showCancelButton: true,
                  showConfirmButton: true,
                  showLoaderOnConfirm: true,
                  focusConfirm: false,
                  cancelButtonText: "Cancelar",
                  confirmButtonText: "Aceptar",
                  confirmButtonAriaLabel: "Aceptar",
                  cancelButtonAriaLabel: "",
                  preConfirm: (motivo) => {
                    if (motivo == "") {
                      Swal.showValidationMessage(
                        `Ingrese el motivo de Aplicación`
                      );
                    }
                  },
                }).then((result) => {
                  if (result.isConfirmed) {
                    let motivo = result.value as unknown;
                    fNAplicarTicket(data.MovimientoID, motivo as string);
                  }
                });
              }}
          >
            <FaCheck />
          </button>
          <ReactTooltip
            id={`DetalleTooltip${data.MovimientoID}`}
            type="info"
            effect="solid"
            clickable
            globalEventOff="click"
          >
            Marcar Como Aplicado
          </ReactTooltip>
        </div>
      ),
    },
  ];

  const HiddenData = (data: any) => {
    const Datos = [data.data];
    // console.log(Datos)
    return (
      <DataTable
        data={Datos}
        striped
        noHeader
        noTableHead
        responsive
        keyField={"MovimientoID"}
        defaultSortField={"MovimientoID"}
        columns={HiddenColumns}
      />
    );
  };

  useEffect(() => {
    setState((s) => ({
      ...s,
      DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro),
    }));
    // eslint-disable-next-line
  }, [state.Datos, state.Filtro]);

  useEffect(() => {
    fnGetEstatusMovimiento();
  }, []);

  /** funcion Callback al agregar un item */
  const cbRespuesta = (Datos: any) => setState((s) => ({ ...s, Datos: Datos }));

  const cbCancelar = (item: any) => {
    setState({
      ...state,
      Datos: state.Datos.filter((obj) => {
        return obj.MovimientoID != item;
      }),
    });
  };

  return (
    <div className="row">
      <div className="col-12">
        <Card Title="Administrar Ticket">
          <Card.Body>
            <Card.Body.Content>
              {state.Cargando && <Spinner />}
              {state.Error && <span>Error al cargar los datos...</span>}
              {!state.Cargando && !state.Error && (
                <div>
                  <AdministrarTicket
                    oidc={props.oidc}
                    ui={props.ui}
                    initialValues={{
                      GestorID: 0,
                    }}
                    estatusMovimientoOpt={state.estatusMovimientoOpt}
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
                              placeholder="Buscar Ticket"
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
                    dense
                    responsive
                    keyField={"MovimientoID"}
                    defaultSortField={"MovimientoID"}
                    columns={Columns}
                    noDataComponent={"No se encontró ningún registro"}
                    expandableRows
                    pagination
                    expandOnRowClicked
                    onRowExpandToggled={(res: any) => {
                      HiddenData(res);
                    }}
                    expandableRowsComponent={<HiddenData />}
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
)(CreditoAdministrarTicket);
