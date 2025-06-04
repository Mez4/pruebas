import React from "react";

// Tabla
import DataTable, { IDataTableColumn } from "react-data-table-component";

// Formas
import { Form, Formik } from "formik";
// Componentes personalizados
import { Card, CustomFieldText2, ModalWin, Spinner } from "../../../../global";
import { StatusProceso } from "../../../../selectores";
import { FiltrarDatos } from "../../../../../global/functions";

// Estado
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import * as RAcciones from "../../../../../redux/cache/acciones";

// Iconos
import { BiSearchAlt, BiUserPlus } from "react-icons/bi";
import {
  FaFilter,
  FaBell,
  FaEnvelopeOpen,
  FaUser,
  FaCircle,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

// Notificaciones
import { toast } from "react-toastify";

// Router
import { Link, useParams } from "react-router-dom";
import { DBConfia_Prospeccion } from "../../../../../interfaces_db/DBConfia/Prospeccion";

//Form
import * as Funciones from "./Prospectos/Funciones";
import { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";
import { LogMensajes } from "./LogMensajes";
import { FiRefreshCcw } from "react-icons/fi";
import { LogMensajesProspecto } from "./LogMensajesProspecto";
import ReactTooltip from "react-tooltip";
import { CFormCurp } from "./Prospectos/CFormCurp";
// Cache property
export enum TipoPersonas {
  Prospecto,
  AvalProspecto,
}
type ProspectosType = {
  oidc: IOidc;
  Cache: any;
  TipoPersonas: TipoPersonas;
  SucursalID?: number;
  optSucursales?: any;
  // Funcion para definir el cache
  DefinirCache(Llave: string, Objecto: any): any;
};

const Prospectos = (props: ProspectosType) => {
  // Ontenemos el ID del producto
  type paramType = { productoId: string };
  let { productoId } = useParams<paramType>();
  let id_int: number = parseInt(productoId as string);

  // Controll our mounted state
  let isMounted = React.useRef(true);

  // Control de variables de tipo de consulta
  let CACHE__ESTADO = "";
  let Titulo: string = "";
  let PrefijoUrl: string = "";

  // Validamos el tipo de consulta
  switch (1 /*props.TipoPersonas*/) {
    case /*TipoPersonas.Prospecto*/ 1:
      Titulo = "Prospectos";
      CACHE__ESTADO = "ADMIN.PERSONAS.PROSPECTOS";
      PrefijoUrl = "prospectos";
      break;
    case TipoPersonas.AvalProspecto:
      Titulo = "Avales";
      CACHE__ESTADO = "ADMIN.PERSONAS.AVALESPROSPECTOS";
      PrefijoUrl = "avales";
      break;
  }

  // Definimos el tipo del estado
  type EstadoType = {
    Filtro: string;
    Cargando: boolean;
    Error: boolean;
    Forma: boolean;
    Datos: DBConfia_Prospeccion.IProspectos_VW[];
    DatosMostrar: DBConfia_Prospeccion.IProspectos_VW[];

    // DATA-TABLE CACHE
    defaultSortField: string | undefined;
    defaultSortAsc: boolean;
    paginationDefaultPage: number;
  };

  // Definimos el estado del control
  const EstadoDefecto: EstadoType = props.Cache[CACHE__ESTADO]
    ? props.Cache[CACHE__ESTADO]
    : {
      Filtro: "",
      Cargando: false,
      Error: false,
      Forma: false,
      Datos: [],
      DatosMostrar: [],
      defaultSortAsc: true,
      defaultSortField: undefined,
      paginationDefaultPage: 1,
    };

  let NotifcacionesP: any[] = [];
  const ProspectosNotificacion: any[] = [];
  const MensajesProspecto: DBConfia_Prospeccion.ILogMensajes_VW[] = [];
  const optSucursales: any[] = [];
  const [state, setState] = React.useState({
    /*Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,*/
    FormaAgregar: false,
    Forma: false,
    /*FormaBloquear: false,
        FormaDesbloqueo: false,
        FormaConfirmar: false,
        FormaMembresias: false,*/
    Item: undefined,
    NotificacionesData: [],
    Notificaciones: 0,
    ProspectosNotificacion,
    cargandoNotif: false,
    VerNotificaciones: false,
    VerMensajes: false,
    MensajesProspecto,
    ProspectoID: 0,
    NombreProspecto: "",
    Error: true,
    SucursalID: 0,
    optSucursales: optSucursales,
  });

  // Estado del componente
  const [Estado, DefinirEstado] = React.useState(EstadoDefecto);

  const FNConsultar = async (values: any) => {
    DefinirEstado((e) => ({
      ...e,
      Cargando: true,
      Error: false,
      Datos: [],
      DatosMostrar: [],
    }));
    try {
      values.SucursalID = state.SucursalID;
      let personas = await Funciones.FNGet(props.oidc, values);
      if (isMounted.current === true) {
        DefinirEstado((e) => ({
          ...e,
          Cargando: false,
          Filtro: "",
          DatosMostrar: personas,
          Datos: personas,
          Error: false,
          Forma: false,
        }));
        toast.success(
          personas.length > 0
            ? "Datos obtenidos"
            : "Consulta realizada sin resultados",
          { autoClose: 2500 }
        );
      }
      props.DefinirCache(CACHE__ESTADO, {
        ...Estado,
        Datos: personas,
        DatosMostrar: personas,
        Error: false,
        Forma: false,
      });
    } catch (e) {
      if (isMounted.current === true) {
        DefinirEstado((e) => ({
          ...e,
          Cargando: false,
          Filtro: "",
          Error: true,
        }));
        toast.error("Error al obtener los datos" + e, { autoClose: 2500 });
      }
    }
  };

  const FNNotificaciones = async () => {
    setState((s) => ({ ...s, cargandoNotif: true }));
    Funciones.FNGetNotificaciones(props.oidc, 0)
      .then((respuesta: any) => {
        setState((s) => ({
          ...s,
          cargandoNotif: false,
          Error: false,
          Notificaciones: respuesta.cantidad,
          NotificacionesData: respuesta.data,
          ProspectosNotificacion: respuesta.Prospectos,
        }));
        NotifcacionesP = respuesta.data;
        //props.cbValidar(respuesta)
      })
      .catch((error: any) => {
        if (error.response)
          toast.error(`Response Error: ${error.response.data}`);
        else if (error.request) toast.error(`Request ${error}`);
        else toast.error(`${error}`);

        setState((s) => ({ ...s, cargandoNotif: false, Error: true }));
      });
  };

  /** funcion Callback al agregar un item */
  const cbAgregar = (item: any) => {
    console.log("item: ", item);
    if (item.res == 1) {
      toast.success(item.msj);
      setState((s) => ({ ...s, FormaAgregar: false }));
      window.location.assign(
        `/app/${id_int}/promotor/Prospecto/${item.msj.match(/id: (\d+)/i)[1]}`
      );
    }
    if (item.res == 2) {
      toast.warning(item.msj);
    }
  };

  const FNMostrarMensajes = (prospectoID: number, nombre: string) => {
    let mensajes = state.NotificacionesData.filter(
      (x: any) => x.ProspectoID === prospectoID
    );
    setState((s) => ({
      ...s,
      VerMensajes: true,
      MensajesProspecto: mensajes,
      NombreProspecto: nombre ?? "",
      ProspectoID: prospectoID,
    }));
    mensajesLeído(prospectoID);
  };

  const mensajesLeído = (prospectoID: number) => {
    console.log(prospectoID);
    Funciones.FNGetNotificacionLeida(props.oidc, prospectoID)
      .then((item: any) => {
        FNNotificaciones();
      })
      .catch((error: any) => {
        if (error.response)
          toast.error(`Response Error: ${error.response.data}`);
        else if (error.request) toast.error(`Request ${error}`);
        else toast.error(`${error}`);
      });
  };

  const GetSucursalesDisponibles = () => {
    Funciones.FNSucursalesPromotoria(props.oidc)
      .then((respuesta: any) => {
        var sucursales = respuesta.map((valor: any) => {
          var obj = { value: valor.SucursalID, label: valor.Sucursal };
          return obj;
        });
        sucursales.length == 1 && FNConsultar({});
        setState((s) => ({ ...s, optSucursales: sucursales }));
      })
      .catch((error: any) => {
        if (error.response)
          toast.error(`Response Error: ${error.response.data}`);
        else if (error.request) toast.error(`Request ${error}`);
        else toast.error(`${error}`);
      });
  };

  /** funcion para cancelar */
  const fnCancelar = () => setState((s) => ({ ...s, FormaAgregar: false }));

  const fnCancelarM = () => setState((s) => ({ ...s, VerMensajes: false }));

  const fnCancelarF = () => setState((s) => ({ ...s, Forma: false }));

  /** funcion para agregar */
  const fnAgregar = () =>
    setState((s) => ({ ...s, FormaAgregar: true, Item: undefined }));

  // Define the columns
  const Columns = React.useMemo(() => {
    let colRet: IDataTableColumn[] = [
      {
        name: "Nombre del Prospecto",
        selector: "NombreProspecto",
        width: "30rem",

        cell: (cprops) => (
          <div
            style={{
              display: "flex",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <Link
              style={{ color: "#0000EE" }}
              to={`/app/${id_int}/promotor/Prospecto/${cprops.ProspectoID}`}
            >
              {cprops.ProspectoID}{" "}
              <span
                style={{
                  fontWeight: "bold",
                  fontStyle: "italic",
                }}
              >
                {cprops.NombreProspecto}
              </span>
            </Link>
          </div>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.Activo === false,
            style: {
              textAlign: "center",
              backgroundColor: "#ff000020",
              color: "red",
            },
          },
        ],
      },
      {
        name: "Proceso Actual",
        selector: "StatusProcesoID",
        width: "20rem",
        cell: (cprops) => (
          <div
            style={{
              display: "flex",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <span>
              {cprops.Descripcion == "DICTAMEN"
                ? "VALIDADO"
                : cprops.Descripcion == "CONSOLIDACION"
                  ? "ACTIVADO"
                  : cprops.Descripcion}
            </span>
          </div>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.Activo === false,
            style: {
              textAlign: "center",
              backgroundColor: "#ff000020",
              color: "red",
            },
          },
        ],
      },
      {
        name: "Sucursal",
        selector: "Nombre",
        width: "15rem",
        cell: (cprops) => (
          <div
            style={{
              display: "flex",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <span>{cprops.Nombre}</span>
          </div>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.Activo === false,
            style: {
              textAlign: "center",
              backgroundColor: "#ff000020",
              color: "red",
            },
          },
        ],
      },
      {
        name: "En Mesa",
        selector: "ProspectoID",
        center: true,
        width: "auto",
        cell: (cprops) => (
          <>
            <div
              data-tip
              data-for={`em_${cprops.ProspectoID}`}
              className="notificacion"
              style={{
                textAlign: "left",
                paddingTop: "1rem",
                paddingBottom: "0.5rem",
              }}
            >
              <span>
                {cprops.EnMesa === 1 ? (
                  <FaCircle color="green" title="Activo" />
                ) : (
                  <FaCircle color="lightgray" title="Inactivo" />
                )}
              </span>
            </div>
            <ReactTooltip
              id={`em_${cprops.ProspectoID}`}
              type="info"
              effect="solid"
            >
              {cprops.EnMesa === 1
                ? "PROSPECTO YA EN MESA DE CRÉDITO"
                : `AUN EN CAPTURA`}
            </ReactTooltip>
          </>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.Activo === false,
            style: {
              textAlign: "center",
              backgroundColor: "#ff000020",
              color: "red",
            },
          },
        ],
      },
      {
        name: "Socia",
        selector: "ProspectoID",
        center: true,
        width: "auto",
        cell: (cprops) => (
          <>
            <div
              data-tip
              data-for={`s_${cprops.ProspectoID}`}
              className="notificacion"
              style={{
                textAlign: "left",
                paddingTop: "1rem",
                paddingBottom: "0.5rem",
              }}
            >
              <span>
                {cprops.Consolidacion === 1 ? (
                  <FaCircle color="green" title="Activo" />
                ) : (
                  <FaCircle color="lightgray" title="Inactivo" />
                )}
              </span>
            </div>
            <ReactTooltip
              id={`s_${cprops.ProspectoID}`}
              type="info"
              effect="solid"
            >
              {cprops.Consolidacion === 1
                ? "CONSOLIDADA COMO SOCIA"
                : `EN PROCESO DE ACTIVACIÓN`}
            </ReactTooltip>
          </>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.Activo === false,
            style: {
              textAlign: "center",
              backgroundColor: "#ff000020",
              color: "red",
            },
          },
        ],
      },
      {
        name: "Mensajes",
        selector: "ProspectoID",
        center: true,
        width: "auto",
        cell: (cprops) => (
          <>
            <div
              data-tip
              data-for={`l_${cprops.ProspectoID}`}
              className="notificacion"
              style={{
                textAlign: "left",
                paddingTop: "1rem",
                paddingBottom: "0.5rem",
              }}
            >
              {<span className="badge">{cprops.MsjNoLeidosSucP}</span>}
              <button
                disabled={cprops.EnMesa !== 1}
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => {
                  FNMostrarMensajes(cprops.ProspectoID, cprops.NombreProspecto);
                  let item = cprops;
                  item.MsjNoLeidosSucP = undefined;
                  DefinirEstado((s) => ({
                    ...s,
                    DatosMostrar: s.Datos.map((d) =>
                      d.ProspectoID === item.ProspectoID ? item : d
                    ),
                  }));
                  props.DefinirCache(CACHE__ESTADO, {
                    ...Estado,
                  });
                }}
              >
                <FaEnvelopeOpen size={15} />
              </button>
            </div>
            <ReactTooltip
              id={`l_${cprops.ProspectoID}`}
              type="info"
              effect="solid"
            >
              {cprops.EnMesa !== 1
                ? "DISPONIBLE DESPUES DE VALIDAR PROSPECTO"
                : `VER MENSAJES SOBRE EL PROSPECTO ${cprops.NombreProspecto}`}
            </ReactTooltip>
          </>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.Activo === false,
            style: {
              textAlign: "center",
              backgroundColor: "#ff000020",
              color: "red",
            },
          },
        ],
      },
      {
        name: "Perfil",
        selector: "ProspectoID",
        center: true,
        width: "10rem",
        cell: (cprops) => (
          <>
            <div
              data-tip
              data-for={`p_${cprops.ProspectoID}`}
              style={{
                textAlign: "left",
                paddingTop: "1px",
                paddingBottom: "1px",
              }}
            >
              <Link
                className="btn btn-outline-secondary"
                to={`/app/${id_int}/promotor/Prospecto/${cprops.ProspectoID}`}
              >
                <FaUser size={15} />
              </Link>
            </div>
            <ReactTooltip
              id={`p_${cprops.ProspectoID}`}
              type="info"
              effect="solid"
            >
              VER PERFIL
            </ReactTooltip>
          </>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.Activo === false,
            style: {
              textAlign: "center",
              backgroundColor: "#ff000020",
              color: "red",
            },
          },
        ],
      },
    ];
    return colRet;
  }, [PrefijoUrl]);

  React.useEffect(() => {
    GetSucursalesDisponibles();
    FNNotificaciones();
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    state.SucursalID != 0 && FNConsultar({});
  }, [state.SucursalID]);

  const fnCancelNotif = () => setState({ ...state, VerNotificaciones: false });

  const cbSucursal = (SucursalID: any) => {
    setState((s) => ({ ...s, SucursalID }));
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          <Card
            Title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div>Prospectos</div>
                <div>
                  {state.optSucursales.length < 2 ? (
                    ""
                  ) : (
                    <>
                      <div className="d-flex align-items-center">
                        <label
                          htmlFor={"SucursalID"}
                          className="form-label me-2 mb-0"
                        >
                          {"Sucursal"}
                        </label>
                        <select
                          id={"Sucursal"}
                          name={"Sucursal"}
                          className="form-select"
                          disabled={false}
                          multiple={false}
                          style={{ width: "15rem" }}
                          onChange={(e) => {
                            cbSucursal(e.target.value);
                          }}
                        >
                          {
                            <option selected={state.SucursalID == 0} value={0}>
                              Todas
                            </option>
                          }
                          {state.optSucursales.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                              selected={state.SucursalID == option.value}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>
            }
          >
            <Card.Body>
              <Card.Body.Content>
                {Estado.Cargando && (
                  <div className="text-center">
                    <Spinner />
                    <br />
                    <span>Cargando {Titulo}</span>
                  </div>
                )}
                {Estado.Error && (
                  <div className="text-center">
                    <p>Error al cargar los {Titulo}</p>
                    <button
                      onClick={() =>
                        DefinirEstado((e) => ({
                          ...e,
                          Forma: !e.Forma,
                          Cargando: false,
                          Filtro: "",
                          Error: false,
                        }))
                      }
                      className="btn btn-sm btn-confia text-white"
                    >
                      Volver A Cargar
                    </button>
                  </div>
                )}
                {!Estado.Cargando && !Estado.Error && (
                  <div>
                    {!state.Error && (
                      <DataTable
                        subHeader
                        noDataComponent={
                          <div style={{ margin: "4em" }}>
                            Presiona{" "}
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => {
                                FNConsultar({});
                                FNNotificaciones();
                              }}
                            >
                              <FiRefreshCcw />
                            </button>{" "}
                            para mostrar a todos tus Prospectos o presiona{" "}
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() =>
                                DefinirEstado((e) => ({
                                  ...e,
                                  Forma: !e.Forma,
                                }))
                              }
                            >
                              <FaFilter />
                            </button>{" "}
                            para hacer una consulta por filtros.
                          </div>
                        }
                        subHeaderComponent={
                          <div className="row">
                            <div className="col-sm-12">
                              <div className="input-group mb-3">
                                <div className="">
                                  {Estado.Datos.length > 0 && (
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Buscar persona"
                                      value={Estado.Filtro}
                                      onChange={(e) => {
                                        DefinirEstado((s) => ({
                                          ...s,
                                          Filtro: e.target.value,
                                          DatosMostrar: FiltrarDatos(
                                            s.Datos,
                                            Columns,
                                            e.target.value
                                          ),
                                        }));
                                        props.DefinirCache(CACHE__ESTADO, {
                                          ...Estado,
                                          Filtro: e.target.value,
                                        });
                                      }}
                                    />
                                  )}

                                  <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => {
                                      FNConsultar({});
                                      FNNotificaciones();
                                    }}
                                  >
                                    <FiRefreshCcw />
                                  </button>
                                  <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() =>
                                      DefinirEstado((e) => ({
                                        ...e,
                                        Forma: !e.Forma,
                                      }))
                                    }
                                  >
                                    <FaFilter />
                                    {/*Estado.Datos.length == 0 && ' FILTRAR PROSPECTOS'*/}
                                  </button>
                                  <button
                                    className="btn btn-success"
                                    type="button"
                                    onClick={() =>
                                      setState((e) => ({
                                        ...e,
                                        FormaAgregar: true,
                                      }))
                                    }
                                  >
                                    <BiUserPlus size={22} /> AGREGAR NUEVO
                                    PROSPECTO{" "}
                                  </button>
                                </div>
                                <div
                                  className="notificacion text-end"
                                  style={{
                                    paddingTop: "2rem",
                                    paddingBottom: "2rem",
                                  }}
                                >
                                  {state.cargandoNotif && (
                                    <div
                                      style={{
                                        backgroundColor: "#6f42c1",
                                        padding: ".5em",
                                      }}
                                    >
                                      <Spinner />
                                    </div>
                                  )}
                                  {state.Notificaciones > 0 && (
                                    <span className="badge">
                                      {state.Notificaciones}
                                    </span>
                                  )}
                                  {!state.cargandoNotif && (
                                    <button
                                      className="btn btn-outline-secondary"
                                      type="button"
                                      onClick={() =>
                                        setState((s) => ({
                                          ...s,
                                          VerNotificaciones: true,
                                        }))
                                      }
                                    >
                                      <FaBell size={22} />{" "}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        }
                        data={Estado.DatosMostrar}
                        striped
                        pagination
                        dense
                        noHeader
                        responsive
                        keyField={"PersonaID"}
                        columns={Columns}
                        onSort={(Column, Direction) =>
                          props.DefinirCache(CACHE__ESTADO, {
                            ...Estado,
                            defaultSortField: Column.selector,
                            defaultSortAsc: Direction === "asc",
                          })
                        }
                        onChangePage={(page) => {
                          props.DefinirCache(CACHE__ESTADO, {
                            ...Estado,
                            paginationDefaultPage: page,
                          });
                        }}
                        defaultSortField={Estado.defaultSortField}
                        defaultSortAsc={Estado.defaultSortAsc}
                        paginationDefaultPage={Estado.paginationDefaultPage}
                        paginationPerPage={30}
                      />
                    )}

                    {
                      <ModalWin open={state.FormaAgregar}>
                        <ModalWin.Header>CURP</ModalWin.Header>
                        <ModalWin.Body>
                          <CFormCurp
                            cbGuardar={cbAgregar}
                            fnCancelar={fnCancelar}
                            oidc={props.oidc}
                            initialValues={{}}
                            SucursalID={state.SucursalID}
                            ProductoID={productoId}
                          />
                        </ModalWin.Body>
                      </ModalWin>
                    }
                    {
                      <ModalWin open={Estado.Forma}>
                        <ModalWin.Header>
                          Filtrar Consulta de Prospectos
                        </ModalWin.Header>
                        <ModalWin.Body>
                          <Formik
                            initialValues={{
                              Nombre: "",
                              CURP: "",
                              RFC: "",
                              StatusProcesoID: "",
                            }}
                            onSubmit={(values) => FNConsultar(values)}
                          >
                            <Form>
                              <CustomFieldText2
                                disabled={Estado.Cargando}
                                label={"Nombre"}
                                name={"Nombre"}
                                placeholder={"..."}
                              />
                              <CustomFieldText2
                                disabled={Estado.Cargando}
                                label={"CURP"}
                                name={"CURP"}
                                placeholder={"XXXXXXXXXXXXXXXXXX"}
                              />
                              <CustomFieldText2
                                disabled={Estado.Cargando}
                                label={"RFC"}
                                name={"RFC"}
                                placeholder={"XXXXXXXXXXXX"}
                              />
                              <StatusProceso
                                disabled={Estado.Cargando}
                                label={"ESTATUS"}
                                name={"StatusProcesoID"}
                              />
                              <div className="text-end">
                                <button
                                  type={"button"}
                                  onClick={() =>
                                    DefinirEstado((e) => ({
                                      ...e,
                                      Forma: false,
                                    }))
                                  }
                                  className="btn btn-danger text-white fw-bold text-end me-1"
                                >
                                  <IoMdClose size={20} /> Cancelar
                                </button>
                                <button
                                  type={"submit"}
                                  className="btn btn-confia text-white fw-bold text-end"
                                >
                                  <BiSearchAlt size={20} /> Consultar
                                </button>
                              </div>
                            </Form>
                          </Formik>
                        </ModalWin.Body>
                      </ModalWin>
                    }
                  </div>
                )}
              </Card.Body.Content>
            </Card.Body>
          </Card>
        </div>
      </div>
      {state.VerNotificaciones && (
        <ModalWin open={state.VerNotificaciones} center large>
          <ModalWin.Header>
            <h5 className={MODAL_TITLE_CLASS}>MIS NOTIFICACIONES</h5>
            <button
              type="button"
              className="delete"
              onClick={() => {
                fnCancelNotif();
              }}
            />
          </ModalWin.Header>
          <ModalWin.Body>
            <LogMensajesProspecto
              oidc={props.oidc}
              Notificaciones={state.NotificacionesData}
              FNNotificaciones={FNNotificaciones}
              Prospectos={state.ProspectosNotificacion}
            />
          </ModalWin.Body>
        </ModalWin>
      )}
      {state.VerMensajes && (
        <ModalWin open={state.VerMensajes} center large>
          <ModalWin.Header>
            <h5 className={MODAL_TITLE_CLASS}>
              MENSAJES PROSPECTO <br /> {state.ProspectoID}{" "}
              {state.NombreProspecto}
            </h5>
            <button
              type="button"
              className="delete"
              onClick={() => {
                fnCancelarM();
              }}
            />
          </ModalWin.Header>
          <ModalWin.Body>
            <LogMensajes
              oidc={props.oidc}
              Notificaciones={state.MensajesProspecto}
              FNNotificaciones={FNNotificaciones}
              ProspectoID={state.ProspectoID}
            />
          </ModalWin.Body>
        </ModalWin>
      )}
    </>
  );
};

const mapStateToProps = (state: IEstado) => ({
  oidc: state.oidc,
  Cache: state.Cache,
});

const mapDispatchToProps = (dispatch: any) => ({
  DefinirCache: (Llave: string, Objecto: any) =>
    dispatch(RAcciones.DefinirCache({ Llave, Objecto })),
});
export default connect(mapStateToProps, mapDispatchToProps)(Prospectos);
