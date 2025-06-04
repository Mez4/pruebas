import React, { useState } from "react";

// Tabla
import DataTable, { IDataTableColumn } from "react-data-table-component";

// Formas
import { Form, Formik } from "formik";

// Componentes personalizados
import { Card, CustomFieldText2, ModalWin, Spinner } from "../../../../global";
import {
  Escolaridad,
  EstadoCivil,
  Ocupaciones,
  Sexos,
  StatusProceso,
} from "../../../../selectores";
import { FiltrarDatos } from "../../../../../global/functions";

// Estado
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import * as RAcciones from "../../../../../redux/cache/acciones";

// Iconos
import { BiCloudDownload, BiSearchAlt, BiUserPlus } from "react-icons/bi";
import {
  FaExclamationCircle,
  FaEnvelope,
  FaFilter,
  FaBell,
  FaEnvelopeOpen,
  FaUser,
  FaCircle,
  FaCheck,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FaLink, FaSearch } from "react-icons/fa";

// Sub-Componentes
//import * as Funciones from './CompPersonas/Funciones'

// Notificaciones
import { toast } from "react-toastify";
import moment from "moment";
// Router
import { Link, useParams } from "react-router-dom";
import { DBConfia_Prospeccion } from "../../../../../interfaces_db/DBConfia/Prospeccion";

//Form
import { AgregarConPersona } from "./AgregarConPersonaForm";
import * as Funciones from "./Prospectos/Funciones";
import { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";
import { LogMensajes } from "./LogMensajes";
import { FiRefreshCcw } from "react-icons/fi";
import { LogMensajesProspecto } from "./LogMensajesProspecto";
import ReactTooltip from "react-tooltip";
import { AgregarPosPros } from "./AgregarProsPos";
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

const ProspectosCatalogo = (props: ProspectosType) => {
  // Ontenemos el ID del producto
  type paramType = { productoId: string };
  let { productoId } = useParams<paramType>();
  let id_int: number = parseInt(productoId as string);
  const optSucursales: any[] = [];

  // Controll our mounted state
  let isMounted = React.useRef(true);

  // Control de variables de tipo de consulta
  let CACHE__ESTADO = "";
  let Titulo: string = "";
  let PrefijoUrl: string = "";

  // Validamos el tipo de consulta
  switch (1 /*props.TipoPersonas*/) {
    case /*TipoPersonas.Prospecto*/ 1:
      Titulo = "ProspectosCatalogo";
      CACHE__ESTADO = "ADMIN.PERSONAS.PROSPECTOSCATALOGO";
      PrefijoUrl = "prospectosCatalogo";
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
  const [forma, setforma] = useState(false);
  const [state, setState] = React.useState({
    /*Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,*/
    FormaAgregar: false,
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
    setState((s) => ({ ...s, cargandoNotif: false, Error: false }));
    DefinirEstado((e) => ({
      ...e,
      Cargando: true,
      Error: false,
      Datos: [],
      DatosMostrar: [],
    }));
    try {
      values.SucursalID = state.SucursalID;
      let personas = await Funciones.FNGetByProduct(props.oidc, values);
      console.log(personas);
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
        `/app/${id_int}/prospeccion/Prospecto/${
          item.msj.match(/id: (\d+)/i)[1]
        }`
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
        setState((s) => ({ ...s, optSucursales: sucursales }));
        sucursales.length == 1 && FNConsultar({});
      })
      .catch((error: any) => {
        if (error.response)
          toast.error(`Response Error: ${error.response.data}`);
        else if (error.request) toast.error(`Request ${error}`);
        else toast.error(`${error}`);
      });
  };

  /** funcion para cancelar */
  const fnCancelar = () =>
    setState((s) => ({ ...s, FormaAgregar: false, item: undefined }));

  const fnCancelarM = () => setState((s) => ({ ...s, VerMensajes: false }));

  const fnCancelarForma = () => setforma(false);

  /** funcion para agregar */
  const fnAgregar = () =>
    setState((s) => ({ ...s, FormaAgregar: true, Item: undefined }));

  // Define the columns
  const Columns = React.useMemo(() => {
    let colRet: IDataTableColumn[] = [
      {
        name: "Nombre del Prospecto",
        selector: "NombreProspecto",
        sortable: true,
        width: "50%",
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
              to={`/app/${id_int}/prospeccion/Prospecto/${cprops.ProspectoID}`}
            >
              {cprops.ProspectoID}{" "}
              <span style={{ fontWeight: "bold", fontStyle: "italic" }}>
                {cprops.NombreProspecto}
              </span>
            </Link>
          </div>
        ),
      },
      {
        name: "Proceso Actual",
        selector: "StatusProcesoID",
        sortable: true,
        width: "38%",
        cell: (cprops) => (
          <div
            style={{
              display: "flex",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <span>{cprops.Descripcion}</span>
          </div>
        ),
      },
      {
        name: "Mensajes",
        selector: "ProspectoID",
        center: true,
        width: "5%",
        cell: (cprops) => (
          <>
            <div
              data-tip
              data-for={`l_${cprops.ProspectoID}`}
              className="notificacion"
              style={{
                textAlign: "left",
                paddingTop: "1px",
                paddingBottom: "1px",
              }}
            >
              {<span className="badge">{cprops.MsjNoLeidosSucP}</span>}
              <button
                disabled={cprops.EnMesa !== 1}
                className="btn btn-primary"
                type="button"
                onClick={() =>
                  FNMostrarMensajes(cprops.ProspectoID, cprops.NombreProspecto)
                }
              >
                <FaEnvelopeOpen color="#D0D0D0" size={15} />
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
      },
      {
        name: "Perfil",
        selector: "ProspectoID",
        center: true,
        width: "5%",
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
                className="btn btn-success"
                style={{ color: "#0000EE" }}
                to={`/app/${id_int}/prospeccion/Prospecto/${cprops.ProspectoID}`}
              >
                <FaUser color="#FFFFFF" size={15} />
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

  const cbSucursal = (SucursalID: any) => {
    setState((s) => ({ ...s, SucursalID }));
  };

  const fnCancelNotif = () => setState({ ...state, VerNotificaciones: false });

  const activoStyle = (row: any) => {
    return [
      {
        when: (row) => row.Consolidacion === 1,
        style: { backgroundColor: "#d2f8d2", fontWeight: "bold" },
      },
    ];
  };

  return (
    <div>
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
                <div>Prospectos Catalogo</div>
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
                    {/* <div className="text-end">
                                            <div className="notificacion text-end">
                                                {state.cargandoNotif && <div style={{backgroundColor: 'lightgray', padding: '.5em'}}><Spinner/></div>}
                                                {!state.cargandoNotif && <button className="btn btn-info" type="button" onClick={() => setState(s => ({ ...s, VerNotificaciones: true }))}><FaEnvelope size={22} /> </button>}
                                                {state.Notificaciones > 0 &&<span className="badge">{state.Notificaciones}</span>}
                                            </div>
                                        </div> */}
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
                                FNConsultar({}); /*FNNotificaciones()*/
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
                              <div className="">
                                <div className="input-group mb-3">
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
                                  {/*Estado.Datos.length > 0 && <span className="input-group-text"><FaSearch /> </span>*/}
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
                        columns={[
                          {
                            name: "ProspectoID",
                            selector: "ProspectoID",
                            width: "10%",
                            cell: (cprops) => (
                              <div
                                style={{
                                  display: "flex",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {cprops.ProspectoID}
                              </div>
                            ),
                            conditionalCellStyles: activoStyle(props),
                          },
                          {
                            name: "Nombre del Prospecto",
                            selector: "NombreProspecto",
                            width: "20%",
                            cell: (cprops) => (
                              <div
                                style={{
                                  display: "flex",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {cprops.NombreProspecto}
                              </div>
                            ),
                            conditionalCellStyles: activoStyle(props),
                          },
                          {
                            name: "Sucursal",
                            selector: "Nombre",
                            width: "10%",
                            cell: (cprops) => (
                              <div
                                style={{
                                  display: "flex",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {cprops.Nombre}
                              </div>
                            ),
                            conditionalCellStyles: activoStyle(props),
                          },
                          {
                            name: "Prospecto Registro",
                            selector: "ProspectoID",
                            center: true,
                            cell: (cprops) => (
                              <>
                                <div
                                  data-tip
                                  data-for={`pr_${cprops.ProspectoID}`}
                                  className="notificacion"
                                  style={{
                                    textAlign: "left",
                                    paddingTop: "1px",
                                    paddingBottom: "1px",
                                  }}
                                >
                                  <span>
                                    <FaCheck color="green" title="Activo" />
                                  </span>
                                </div>
                                <ReactTooltip
                                  id={`pr_${cprops.ProspectoID}`}
                                  type="info"
                                  effect="solid"
                                >
                                  PROSPECTO REGISTRADO
                                </ReactTooltip>
                              </>
                            ),
                            conditionalCellStyles: activoStyle(props),
                          },
                          {
                            name: "Primer Canje",
                            selector: "FechaPrimerCanje",
                            sortable: false,
                            center: true,
                            cell: (props) =>
                              props.PrimerCanje ? (
                                <FaCheck color="green" title="Activo" />
                              ) : (
                                <FaCircle color="lightgray" title="Inactivo" />
                              ),
                            conditionalCellStyles: activoStyle(props),
                          },
                          {
                            name: "Consulta Buro",
                            selector: "ProspectoID",
                            center: true,
                            cell: (cprops) => (
                              <>
                                <div
                                  data-tip
                                  data-for={`cb_${cprops.ProspectoID}`}
                                  className="notificacion"
                                  style={{
                                    textAlign: "left",
                                    paddingTop: "1px",
                                    paddingBottom: "1px",
                                  }}
                                >
                                  <span>
                                    {[2, 4].includes(
                                      cprops.EstatusConsultaBuroID
                                    ) ? (
                                      <FaCheck color="green" title="Activo" />
                                    ) : (
                                      <FaCircle
                                        color="lightgray"
                                        title="Inactivo"
                                      />
                                    )}
                                  </span>
                                </div>
                                <ReactTooltip
                                  id={`cb_${cprops.ProspectoID}`}
                                  type="info"
                                  effect="solid"
                                >
                                  CONSULTA DE BURO
                                </ReactTooltip>
                              </>
                            ),
                            conditionalCellStyles: activoStyle(props),
                          },
                          {
                            name: "En Revisión Mesa Crédtito",
                            selector: "ProspectoID",
                            center: true,
                            cell: (cprops) => (
                              <>
                                <div
                                  data-tip
                                  data-for={`rm_${cprops.ProspectoID}`}
                                  className="notificacion"
                                  style={{
                                    textAlign: "left",
                                    paddingTop: "1px",
                                    paddingBottom: "1px",
                                  }}
                                >
                                  <span>
                                    {cprops.EnMesa === 1 ? (
                                      <FaCheck color="green" title="Activo" />
                                    ) : (
                                      <FaCircle
                                        color="lightgray"
                                        title="Inactivo"
                                      />
                                    )}
                                  </span>
                                </div>
                                <ReactTooltip
                                  id={`rm_${cprops.ProspectoID}`}
                                  type="info"
                                  effect="solid"
                                >
                                  {cprops.EnMesa === 1
                                    ? "PROSPECTO YA EN MESA DE CRÉDITO"
                                    : `AUN EN CAPTURA`}
                                </ReactTooltip>
                              </>
                            ),
                            conditionalCellStyles: activoStyle(props),
                          },
                          {
                            name: "Fecha Expediente Subido ",
                            selector: "ProspectoID",
                            width: "10%",
                            center: true,
                            cell: (cprops) => (
                              <>
                                <div
                                  data-tip
                                  data-for={`ds_${cprops.ProspectoID}`}
                                  className="notificacion"
                                  style={{
                                    textAlign: "left",
                                    paddingTop: "1px",
                                    paddingBottom: "1px",
                                  }}
                                >
                                  <span>
                                    {cprops.EnMesa === 1 ? (
                                      <span style={{ color: "green" }}>
                                        {moment(cprops.FechaEnMesa)
                                          .utc()
                                          .format("DD-MM-YYYY hh:mm:ss A")}
                                      </span>
                                    ) : (
                                      <>
                                        <br />
                                        <br />
                                      </>
                                    )}
                                  </span>
                                </div>
                                <ReactTooltip
                                  id={`ds_${cprops.ProspectoID}`}
                                  type="info"
                                  effect="solid"
                                >
                                  {cprops.EnMesa === 1
                                    ? "LOS DATOS Y DOCUMENTOS DEL PROSPECTO SE HAN CAPTURADO "
                                    : `AUN EN CAPTURA`}
                                </ReactTooltip>
                              </>
                            ),
                            conditionalCellStyles: activoStyle(props),
                          },
                          {
                            name: "Expediente Validado",
                            selector: "ProspectoID",
                            center: true,
                            cell: (cprops) => (
                              <>
                                <div
                                  data-tip
                                  data-for={`ds_${cprops.ProspectoID}`}
                                  className="notificacion"
                                  style={{
                                    textAlign: "left",
                                    paddingTop: "1px",
                                    paddingBottom: "1px",
                                  }}
                                >
                                  <span>
                                    {cprops.RevisionDocumentos === 1 ? (
                                      <FaCheck color="green" title="Activo" />
                                    ) : (
                                      <FaCircle
                                        color="lightgray"
                                        title="Inactivo"
                                      />
                                    )}
                                  </span>
                                </div>
                                <ReactTooltip
                                  id={`ds_${cprops.ProspectoID}`}
                                  type="info"
                                  effect="solid"
                                >
                                  {cprops.RevisionDocumentos === 1
                                    ? "DOCUMENTOS REVISADOS Y VALIDADOS POR MESA DE CRÉDITO"
                                    : `AUN EN CAPTURA`}
                                </ReactTooltip>
                              </>
                            ),
                            conditionalCellStyles: activoStyle(props),
                          },
                          {
                            name: "Prospecto Validado",
                            selector: "ProspectoID",
                            center: true,
                            cell: (cprops) => (
                              <>
                                <div
                                  data-tip
                                  data-for={`pv_${cprops.ProspectoID}`}
                                  className="notificacion"
                                  style={{
                                    textAlign: "left",
                                    paddingTop: "1px",
                                    paddingBottom: "1px",
                                  }}
                                >
                                  <span>
                                    {cprops.Dictamen === 1 ? (
                                      <FaCheck color="green" title="Activo" />
                                    ) : (
                                      <FaCircle
                                        color="lightgray"
                                        title="Inactivo"
                                      />
                                    )}
                                  </span>
                                </div>
                                <ReactTooltip
                                  id={`pv_${cprops.ProspectoID}`}
                                  type="info"
                                  effect="solid"
                                >
                                  {cprops.Dictamen === 1
                                    ? "PROSPECTO VALIDADO POR MESA DE CRÉDTIO"
                                    : `EN PROCESO DE VALIDACIÓN`}
                                </ReactTooltip>
                              </>
                            ),
                            conditionalCellStyles: activoStyle(props),
                          },
                          {
                            name: "Prospecto Activado",
                            selector: "ProspectoID",
                            center: true,
                            cell: (cprops) => (
                              <>
                                <div
                                  data-tip
                                  data-for={`pa_${cprops.ProspectoID}`}
                                  className="notificacion"
                                  style={{
                                    textAlign: "left",
                                    paddingTop: "1px",
                                    paddingBottom: "1px",
                                  }}
                                >
                                  <span>
                                    {cprops.Consolidacion === 1 ? (
                                      <FaCheck color="green" title="Activo" />
                                    ) : (
                                      <FaCircle
                                        color="lightgray"
                                        title="Inactivo"
                                      />
                                    )}
                                  </span>
                                </div>
                                <ReactTooltip
                                  id={`pa_${cprops.ProspectoID}`}
                                  type="info"
                                  effect="solid"
                                >
                                  {cprops.Consolidacion === 1
                                    ? "ACTIVADA COMO SOCIA"
                                    : `EN PROCESO DE ACTIVACIÓN`}
                                </ReactTooltip>
                              </>
                            ),
                            conditionalCellStyles: activoStyle(props),
                          },
                          // {
                          //     name: 'Validar prospecto',
                          //     selector: 'ProspectoID',
                          //     sortable: true,
                          //     // width: '7%',
                          //     cell: (cprops) =>
                          //         <div className='radiusSmallDiv'>
                          //             <div className={`divInDTable text-center ${cprops.Dictamen == 1  ? ''
                          //                                                        : 'pulsingButton'}`}>
                          //                 <button data-tip data-for={`pa_${cprops.ProspectoID}`}
                          //                         className="btn btn-outline-default  buttonIconInDTable"
                          //                         type={"button"}
                          //                         disabled={cprops.Dictamen == 1}
                          //                         onClick={() => {
                          //                             console.log("Funciona")
                          //                             setforma(true);

                          //                 }} >
                          //                     <FaCheck color="green"
                          //                              size={10} />
                          //                 </button>
                          //                 <ReactTooltip id={`pa_${cprops.ProspectoID}`}
                          //                               type="info"
                          //                               effect="solid">
                          //                 {cprops.Consolidacion === 1 ? 'ACTIVADA COMO SOCIA'
                          //                                             : `EN PROCESO DE ACTIVACIÓN`}
                          //                 </ReactTooltip>
                          //             </div>
                          //         </div>,
                          //      conditionalCellStyles: activoStyle(props)

                          // },
                          // {
                          //     name: 'Perfil', selector: 'ProspectoID', center: true, cell: (cprops) =>
                          //         <>
                          //             <div data-tip data-for={`p_${cprops.ProspectoID}`} style={{ textAlign: 'left', paddingTop: '1px', paddingBottom: '1px' }}>
                          //                 <Link className="btn btn-outline-secondary" style={{ color: '#0000EE' }} to={`/app/${id_int}/prospeccion/Prospecto/${cprops.ProspectoID}`}>
                          //                     <FaUser color='grey' size={15} />
                          //                 </Link>
                          //             </div>
                          //             <ReactTooltip id={`p_${cprops.ProspectoID}`} type="info" effect="solid">
                          //                 VER PERFIL
                          //             </ReactTooltip>
                          //         </>
                          // },
                        ]}
                        // Cache de configuracion
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
                        // Valores por defecto
                        defaultSortField={Estado.defaultSortField}
                        defaultSortAsc={Estado.defaultSortAsc}
                        paginationDefaultPage={Estado.paginationDefaultPage}
                        paginationPerPage={30}
                      />
                    )}

                    {/* {forma == true && 
                                            <AgregarPosPros 
                                                oidc={props.oidc} 
                                                cbActualizar={() => {}}
                                                cbGuardar={cbAgregar}  
                                                fnCancelar={fnCancelarForma}
                                                mostrar={forma == true} 
                                                // Item={Estado.DatosMostrar}
                                                Id={state.ProspectoID}
                                                
                                            />
                                        } */}

                    {/* {state.FormaAgregar &&
                                            <AgregarConPersona oidc={props.oidc} cbActualizar={() => { }} cbGuardar={cbAgregar} fnCancelar={fnCancelar} mostrar={state.FormaAgregar} />
                                        } */}
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
                              {/* <StatusProceso disabled={Estado.Cargando} label={'ESTATUS'} name={'StatusProcesoID'} /> */}
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
    </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(ProspectosCatalogo);
