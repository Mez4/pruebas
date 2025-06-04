import React from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import * as Funciones from "./CreditoAplicaciones/Funciones";
import * as FnPagoDist from "./CreditoAplicaPago/Funciones";
import * as FnPagoCliente from "./CreditoAplicaPagoCliente/Funciones";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";

// Icons
import {
  FaPencilAlt,
  FaPlus,
  FaSearch,
  FaBan,
  FaCashRegister,
  FaListAlt,
  FaReceipt,
  FaFileDownload,
} from "react-icons/fa";

// Custom components
import { Card, Spinner } from "../../../../global";
import { Aplicaciones } from "./CreditoAplicaciones/Aplicaciones";
import { FiRefreshCcw } from "react-icons/fi";
import { FiltrarDatos, addOneDay } from "../../../../../global/functions";
import { DBConfia_Creditos } from "../../../../../interfaces_db/DBConfia/Creditos";

import ReactTooltip from "react-tooltip";
import moment from "moment";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
import { iUI } from "../../../../../interfaces/ui/iUI";
import { string } from "yup";

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

const CreditoAplicaciones = (props: CatalogosType) => {
  let isMounted = React.useRef(true);

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

  const FNGetDetalle = (AplicacionID: number, data: any) => {
    setState((s) => ({
      ...s,
      DatosDetalle: [],
    }));
    Funciones.FNGetAbonos(props.oidc, AplicacionID)
      .then((respuesta: any) => {
        // if (isMounted.current === true) {
        setState((s) => ({
          ...s,
          Detalle: true,
          DatosDetalle: respuesta,
          DistribuidorID: data.DistribuidorID,
          Distribuidor: data.Distribuidor,
          ClienteID: data.ClienteID,
          Cliente: data.Cliente,
          AplicacionID,
        }));
        // }
      })
      .catch(() => {
        // if (isMounted.current === true) {
        setState((s) => ({
          ...s,
          Detalle: false,
          DatosDetalle: [],
          DistribuidorID: 0,
          Distribuidor: "",
          ClienteID: 0,
          Cliente: "",
          AplicacionID: 0,
        }));
        // }
      });
  };

  const FNCancelar = (AplicacionID: number, MotivoCancelacion: string) => {
    Funciones.FNCancelar(props.oidc, AplicacionID, MotivoCancelacion)
      .then((respuesta: any) => {
        if (respuesta.regresa == 1) {
          toast.success(respuesta.msj);
          cbCancelar(respuesta);
        } else {
          toast.error(respuesta.msj);
        }
      })
      .catch(() => {
        toast.error(
          "Ocurrio un error, vuelva a intentarlo o reportelo a sistemas."
        );
      });
  };

  const FNDescargar = (data: any) => {
    toast.info("Se está generando el comprobante, por favor espere...");

    setState({ ...state, Descargar: true });

    // console.log('data: ', data)

    if (data.ClienteID > 0)
      FnPagoCliente.FNPdf(props.oidc, {
        MovimientoID: data.MovimientoIdPago,
      })
        .then((pdf: any) => {
          const file = new Blob([pdf], { type: "application/pdf" });

          // console.log('pdf: ', pdf)

          //const fileURL = URL.createObjectURL(file);

          // window.open(fileURL);

          var url = window.URL.createObjectURL(file);
          //var anchor = document.createElement("a");
          //anchor.download = "myfile.pdf";
          //anchor.href = url;
          //anchor.click();
          const fileURL = URL.createObjectURL(file);
          const enlaceTemporal = document.createElement("a");
          enlaceTemporal.href = fileURL;
          enlaceTemporal.target = "_blank";
          enlaceTemporal.style.display = "none";

          document.body.appendChild(enlaceTemporal);

          enlaceTemporal.click();

          setTimeout(() => {
            // Imprimir el documento
            // window.print();
          }, 1000);
          setState({ ...state, Descargar: false });
        })
        .catch((error: any) => {
          console.log(JSON.stringify(error));

          toast.error(
            "Error al descargar el archivo, intente descargar el archivo o reportarlo a sistemas"
          );

          setState({ ...state, Descargar: false });
        });
    else
      FnPagoDist.FNPdf(props.oidc, {
        MovimientoID: data.MovimientoIdPago,
        dni: 0,
      })
        .then((pdf: any) => {
          const file = new Blob([pdf], { type: "application/pdf" });

          // console.log('pdf: ', pdf)

          //const fileURL = URL.createObjectURL(file);

          // window.open(fileURL);

          var url = window.URL.createObjectURL(file);
          var anchor = document.createElement("a");
          anchor.download = "myfile.pdf";
          anchor.href = url;
          anchor.click();

          setState({ ...state, Descargar: false });
        })
        .catch((error: any) => {
          console.log(JSON.stringify(error));

          toast.error(
            "Error al descargar el archivo, intente descargar el archivo o reportarlo a sistemas"
          );

          setState({ ...state, Descargar: false });
        });
  };

  // const FNDesembolsar = (CreditoID: number) => {
  //     Funciones.FNDesembolsar(props.oidc, CreditoID)
  //         .then((respuesta: any) => {
  //             if (respuesta.res == 1) {
  //                 toast.success(respuesta.msj)
  //                 cbActualizar(respuesta.Data)
  //             }
  //             else {
  //                 toast.warning(respuesta.msj)
  //             }
  //         })
  //         .catch(() => {
  //             toast.error("Error al desembolsar el crédito, vuelva a intentarlo.")
  //         })
  // }

  const Columns = React.useMemo(() => {
    let colRet: IDataTableColumn[] = [
      {
        name: "Id",
        selector: "AplicacionID",
        sortable: true,
        hide: "sm" || "md",
      },
      { name: "Sucursal", selector: "Sucursal", sortable: true },
      { name: "Id Socia", selector: "DistribuidorID", sortable: true },
      {
        name: "Socia",
        width: "225px",
        selector: "Distribuidor",
        sortable: true,
        cell: (props) => (
          <>
            <span
              data-tip
              data-for={`DistribuidorTooltip${props.AplicacionID}`}
            >
              {props.Distribuidor}
            </span>
            <ReactTooltip
              id={`DistribuidorTooltip${props.AplicacionID}`}
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
      { name: "Id Cliente", selector: "ClienteID", sortable: true },
      {
        name: "Cliente",
        width: "225px",
        selector: "Cliente",
        sortable: true,
        cell: (props) => (
          <>
            <span data-tip data-for={`ClienteTooltip${props.AplicacionID}`}>
              {props.Cliente}
            </span>
            <ReactTooltip
              id={`ClienteTooltip${props.AplicacionID}`}
              type="dark"
              effect="solid"
              clickable
              globalEventOff="click"
            >
              {props.Cliente}
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
        name: "Activo",
        selector: "Activo",
        sortable: true,
        width: '70px',
        cell: (props) => <span>{props.Activo ? "SI" : "No"}</span>,
      },
      {
        name : "Movimiento Pago ",
        selector : "MovimientoIdPago",
        sortable : true
      },
      {
        name: "Fecha Cancelacion",
        width: "110px",
        selector: "FechaCancelacion",
        sortable: true,
        cell: (props) => (
          <span>
            {props.FechaCancelacion
              ? moment(props.FechaCancelacion).format("DD/MM/YYYY")
              : ""}
          </span>
        ),
      },
      {
        name: "DNI Cancelacion",
        selector: "MovimientoIdCancelacion",
        sortable: true,
      },
    
    ];
    return colRet;
  }, []);

  const DetailColumns = React.useMemo(() => {
    let colRet: IDataTableColumn[] = [
      {
        name: "Producto",
        width: "110px",
        selector: "Producto",
        sortable: false,
      },
      {
        name: "# Crédito",
        width: "110px",
        selector: "CreditoID",
        sortable: false,
      },
      {
        name: "# Pago",
        width: "95px",
        selector: "NoPago",
        sortable: false,
      },
      {
        name: "Importe", //width: '150px',
        selector: "ImporteTotal",
        sortable: false,
        format: (row) => formatter.format(row.ImporteTotal),
      },
      {
        name: "Abono", //width: '150px',
        selector: "Abono",
        sortable: false,
        format: (row) => formatter.format(row.Abono),
      },
      {
        name: "Comisión", //width: '150px',
        selector: "Comision",
        sortable: false,
        format: (row) => formatter.format(row.Comision),
      },
      {
        name: "CPT", //width: '150px',
        selector: "CPT",
        sortable: false,
        format: (row) => formatter.format(row.PagoPPI),
      },
      {
        name: "Fecha Abono", //width: '110px',
        selector: "FechaHoraAbono",
        sortable: false,
        cell: (props) => (
          <span>
            {props.FechaHoraAbono
              ? moment(props.FechaHoraAbono).format("DD/MM/YYYY")
              : ""}
          </span>
        ),
      },
      {
        name: "F. Corte Relación", //width: '110px',
        selector: "fechaCorte",
        sortable: false,
        cell: (props) => (
          <span>
            {props.fechaCorte
              ? moment(addOneDay(new Date(props.fechaCorte))).format(
                  "DD/MM/YYYY"
                )
              : ""}
          </span>
        ),
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
            title="Detalle"
            data-tip
            data-for={`DetalleTooltip${data.AplicacionID}`}
            className="asstext"
            style={{
              margin: ".15em",
              width: "15%",
              height: "40px",
              padding: "0px",
              tableLayout: "fixed",
              borderCollapse: "collapse",
            }}
            type="button"
            onClick={() => {
              FNGetDetalle(data.AplicacionID, data);
            }}
          >
            <FaListAlt />
          </button>
          <ReactTooltip
            id={`DetalleTooltip${data.AplicacionID}`}
            type="info"
            effect="solid"
            clickable
            globalEventOff="click"
          >
            Detalle Aplicación
          </ReactTooltip>
          <button
            disabled={data.Activo == false}
            data-tip="true"
            data-for={`CancelarTooltip${data.AplicacionID}`}
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
                title: "<strong>Cancelar la Aplicación</strong>",
                icon: "question",
                input: "text",
                inputAttributes: {
                  autocapitalize: "off",
                },
                html: (
                  <div className="text-center">
                    Se cancelará la aplicación ¿Desea continuar?
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
                // console.log('result: ', result)
                if (result.isConfirmed) {
                  let motivo = result.value as unknown;
                  FNCancelar(data.AplicacionID, motivo as string);
                }
              });
            }}
          >
            <FaBan />
          </button>
          <ReactTooltip
            id={`CancelarTooltip${data.AplicacionID}`}
            type="info"
            effect="solid"
            clickable
            globalEventOff="click"
          >
            Desaplicar Pago
          </ReactTooltip>
          <button
            disabled={data.Activo == false || state.Descargar}
            data-tip="true"
            data-for={`DescargarTooltip${data.AplicacionID}`}
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
                title: "<strong>Descargar Recibo Pago</strong>",
                icon: "question",
                html: (
                  <div className="text-center">
                    Se descargara el Recibo Pago ¿Desea continuar?
                  </div>
                ),
                showCloseButton: false,
                showCancelButton: true,
                showConfirmButton: true,
                focusConfirm: false,
                cancelButtonText: "Cancelar",
                confirmButtonText: "Aceptar",
                confirmButtonAriaLabel: "Aceptar",
                cancelButtonAriaLabel: "",
              }).then((result) => {
                if (result.isConfirmed) {
                  FNDescargar(data);
                }
              });
            }}
          >
            <FaFileDownload />
          </button>
          <ReactTooltip
            id={`DescargarTooltip${data.AplicacionID}`}
            type="info"
            effect="solid"
            clickable
            globalEventOff="click"
          >
            Descargar Recibo Pago
          </ReactTooltip>
        </div>
      ),
    },
  ];
  // return col
  // }, [])

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
        keyField={"AplicacionID"}
        defaultSortField={"AplicacionID"}
        columns={HiddenColumns}
      />
    );
  };

  React.useEffect(() => {
    if (isMounted.current === true) {
      // FNGetLocal()
    }
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    setState((s) => ({
      ...s,
      DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro),
    }));
    // eslint-disable-next-line
  }, [state.Datos, state.Filtro]);

  /** funcion Callback al agregar un item */
  const cbRespuesta = (Datos: any) => setState((s) => ({ ...s, Datos: Datos }));

  /** funcion Callback al actualizar un item */
  // const cbActualizar = (item: any) =>
  //     setState({ ...state, Datos: state.Datos.map(Dato => Dato.AplicacionID === item.AplicacionID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: undefined } })

  /** funcion para cancelar la forma */
  const fnCancelar = () =>
    setState({ ...state, Form: { ...state.Form, Mostrar: false } });

  const cbCancelar = (item: any) => {
    console.log("item: ", item);
    setState({
      ...state,
      Datos: state.Datos.filter((obj) => {
        return obj.AplicacionID != item.AplicacionID;
      }),
    });
  };

  return (
    <div className="row">
      <div className="col-12">
        <Card Title="Administrar Aplicaciones">
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
                      ProductoID: 0,
                      ClienteID: 0,
                      SucursalID: 0,
                      DistribuidorID: 0,
                      Activo: true,
                      FechaInicio: moment().add(-15, "d").toDate(),
                      FechaFin: new Date(),
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
                            {/* {actionsMemo} */}
                            {/* <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: undefined, Id: undefined } })}
                                                        ><FaPlus />
                                                        </button> */}
                            {/* <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button> */}
                          </div>
                        </div>
                      </div>
                    }
                    data={state.DatosMostrar}
                    striped
                    pagination
                    dense
                    // noHeader
                    responsive
                    keyField={"AplicacionID"}
                    defaultSortField={"AplicacionID"}
                    columns={Columns}
                    expandableRows
                    noDataComponent={"No se encontró ningún registro"}
                    // expandOnRowClicked
                    onRowExpandToggled={(res: any) => {
                      HiddenData(res);
                    }}
                    expandableRowsComponent={<HiddenData />}
                    // actions={actionsMemo}
                  />

                  <ModalWin open={state.Detalle} xlarge scrollable>
                    <ModalWin.Header>
                      <h5 className={MODAL_TITLE_CLASS}>
                        {"Abonos"} <br />
                        {"Id Aplicacion: " + state.AplicacionID} <br />
                        {"Socia: " +
                          state.DistribuidorID +
                          " - " +
                          state.Distribuidor}{" "}
                        <br />
                        {state.ClienteID &&
                          "Cliente: " +
                            state.ClienteID +
                            " - " +
                            state.Cliente}{" "}
                        <br />
                      </h5>
                      <button
                        type="button"
                        title="Cerrar"
                        className="delete"
                        onClick={() => setState({ ...state, Detalle: false })}
                      />
                    </ModalWin.Header>
                    <ModalWin.Body>
                      <DataTable
                        data={state.DatosDetalle}
                        striped
                        // pagination
                        dense
                        noHeader
                        responsive
                        keyField={"NoPago"}
                        defaultSortField={"NoPago"}
                        columns={DetailColumns}
                        // expandableRows
                        // expandOnRowClicked
                        // onRowExpandToggled={(res: any) => {
                        //     HiddenData(res)
                        // }}
                        // expandableRowsComponent={<HiddenData/>}
                      />
                    </ModalWin.Body>
                  </ModalWin>
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
)(CreditoAplicaciones);
