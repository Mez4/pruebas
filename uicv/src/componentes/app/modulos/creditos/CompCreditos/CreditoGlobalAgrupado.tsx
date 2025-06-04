import React, { useEffect, useReducer, useState } from "react";
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import * as Funciones from "./CreditoGlobal/Funciones";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";
import ssglobal from '../../../../../theme/images/ssglobal.png'
import * as FuncionesSocias from '../../creditos/CompCreditos/CreditoGlobal/Funciones'
import {
  DescripcionDistribuidor,
  FormateoDinero,
} from "../../../../../global/variables";
import {
  formatDate2,
  formatDate,
  addOneDay,
} from "../../../../../global/functions";
import * as FnPersona from "../../personas/CompAdministracion/CompPersona/Funciones";
import * as FnGetTipoUsuario from "../../../modulos/general/CompGeneral/FiltroPorUsuario/Funciones";

// Icons
import {
  FaPencilAlt,
  FaPlus,
  FaSearch,
  FaBan,
  FaCashRegister,
  FaListAlt,
  FaRegCheckCircle,
  FaRegCircle,
  FaCircle,
  FaMinus,
  FaEye,
  FaUser,
  FaUserSlash,
  FaUserPlus,
  FaLock,
} from "react-icons/fa";
import {
  FcOk,
  FcCancel,
  FcSynchronize,
  FcCalculator,
  FcBearish,
  FcMoneyTransfer,
  FcBullish,
  FcDocument,
  FcPlus,
} from "react-icons/fc";

// Custom components
import {
  Card,
  Spinner,
  Acordion,
  Tabs,
  ActionFieldNumberText,
} from "../../../../global";
import { BuscarGlobal } from "./CreditoGlobal/BuscarGlobal";
// import { CForm } from './CreditoGlobal/CForm'
import { FiRefreshCcw } from "react-icons/fi";
import { FiltrarDatos } from "../../../../../global/functions";
import { DBConfia_Creditos } from "../../../../../interfaces_db/DBConfia/Creditos";

import ReactTooltip from "react-tooltip";
import moment from "moment";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
import XLSX from "xlsx";
import { iUI } from "../../../../../interfaces/ui/iUI";
import FiltroPorUsuario from "../../general/CompGeneral/FiltroPorUsuario/FiltroPorUsuario";
import Personas from "../../personas/CompAdministracion/Personas";
import { DBConfia_General } from "../../../../../interfaces_db/DBConfia/General";
import {
  DatosPersona,
  ListadoContratos,
  PerfilDistribuidor,
  PerfilPersona,
} from "../../../../presentacion";
import { PerfilPersonaParaGlobal } from "../../../../presentacion/persona/PerfilPersonaParaGlobal";
import { useParams } from "react-router-dom";
import { FNCancelarTemporalmenteC } from "../../distribuidor/CompDistribuidor/Distribuidor/Funciones";
import * as FnDistribuidores from "../../distribuidor/CompDistribuidor/Distribuidor/Funciones";
import Decrementos from "../../personas/CompAdministracion/Decrementos/Decrementos";
import Prestamos from "../../personas/CompAdministracion/PrestamosDistribuidores/Prestamos";
import Incrementos from "../../personas/CompAdministracion/Incrementos/Incrementos";
import { AgregarCliente } from "./CreditoCliente/AgregarCliente";

type CatalogosType = {
  oidc: IOidc;
  ui: iUI;
};

interface Global {
  UsuarioID: number;
  ProductoID: number;
  Producto: string;
  DirectorID: number;
  NombreDirector: string;
  SucursalID: number;
  CountDistribuidor: number;
  Nombre: string;
  Calidad: number;
  GrupoID: number;
  ClasificadorGrupoID: number;
  Descripcion: string;
  CoordinadorID: number;
  Coordinador: string;
  DistribuidorID: number;
  NombreCompleto: string;
  DistribuidoresEstatus: string;
  DistEstColor: string;
  LimiteDeCredito: number;
  Disponible: number;
  SaldoActual: number;
  Cartera: number;
  SaldoAtrasado: number;
  CreditosAtrasados: number;
  saldoEnRiesgo: number;
  Recuperado: number;
  Colocado: number;
  Capital: number;
  CapLiquidado: number;
  CarteraEnRiesgo: number;
  Detalle: any[];
  Total: {};
}



type EstadoTipo = {

  keyTemp: number;
  isCancelarTemp: boolean;
  isCancelarTempC: boolean;
  isCancelarPermanente: boolean;
  ShowCliente: boolean;
  datosIncrementos: any[];
  DatosExcel: any[];
  // Datos: DBConfia_Creditos.IGlobal_VW[],
  DirectorID: number;
  ProductoID: number;
  SucursalID: number;
  ClienteID: number;
  DistribuidorID: number;
  // GrupoID: number,
  Datos: any[];
  DatosProd: any[];
  DatosSuc: any[];
  DatosGpo: Global[];
  datosDist?: DBConfia_Creditos.IGlobal_VW;
  DatosMostrar: DBConfia_Creditos.IGlobal_VW[];
  DatosDetalle: DBConfia_Creditos.IPlanPagos[];
  datosPagos?: DBConfia_Creditos.IPlanPagos;
  DatosClientes: DBConfia_Creditos.IDistribuidoresClientesGlobalVW[];
  datosCliente?: DBConfia_Creditos.IDistribuidoresClientesGlobalVW;
  DatosCreditos: DBConfia_Creditos.ICreditos_VW[];

  DatosMostrarDist: any[];
  FiltroDist: string;
  Cargando: boolean;
  Error: boolean;
  Datos1F: boolean;
  CargandoProd: boolean;
  ErrorProd: boolean;
  Datos2F: boolean;
  CargandoSuc: boolean;
  ErrorSuc: boolean;
  Datos3F: boolean;
  CargandoGpo: boolean;
  ErrorGpo: boolean;
  Datos4F: boolean;
  tipoUsuario: number;
  Form: {
    Mostrar: boolean;
    Datos?: DBConfia_Creditos.ICreditos;
    Id?: number;
  };
  Detalle: boolean;
  DetalleCredito: boolean;
  DetallePlan: boolean;
  CredID: number;
  Filtros: {
    DirectorID: number;
    ProductoID: number;
    ZonaID: number;
    SucursalID: number;
    GrupoID: number;
    DistribuidorID: number;
    ClienteID: number;
    tipoDias: number;
    // CoordinadorID: number,
    // ContratoID: number,
    // EstatusID: string,
    // DistribuidorNivelID: number,
    // FechaInicio: Date,
    // FechaFin: Date,
    // Permiso: boolean,
  };
  Datos2: {
    Persona?: DBConfia_General.IPersonas_VW;
    Direcciones: DBConfia_General.IDirecciones_VW[];
    Empleos: DBConfia_General.IEmpleos_VW[];
    Creditos?: DBConfia_Creditos.ICreditos_VW;
  };
  Datos3: {
    Persona?: DBConfia_General.IPersonas_VW;
    Direcciones: DBConfia_General.IDirecciones_VW[];
    Empleos: DBConfia_General.IEmpleos_VW[];
    Documentos: {};
    Cliente?: {};
  };
  ContratoSel: number,
  DetalleSaldos: boolean
};





const CreditoGlobal = (props: CatalogosType) => {
  let params = useParams<{ productoId: string }>();
  let isMounted = React.useRef(true);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [cargandoDatos, setCargandoDatos] = useState(false);

  const MySwal = withReactContent(Swal);

  const iconSize = "15px";

  const permisoActivar = props.ui.PermisosProductos?.find(p => p.PermisoID == 2786)


  const ConsultarDatos = async () => {
    try {
      // Cacheamos el estado
      setState((e) => ({
        ...e,
        Datos2: {
          Persona: undefined,
          Direcciones: [],
          Documentos: {},
          Empleos: [] /*Creditos: [],*/,
        },
        Cargando: true,
        Error: false,
      }));
      // Obtenemos la persona 
      let resultado = await FnPersona.FNObtenerPersona(
        props.oidc,
        state.DistribuidorID
      );
      // Si nuestro componente esta montado
      if (isMounted)
        // Definimos el estado
        setState((e) => ({
          ...e,
          Datos2: {
            Persona: resultado.persona,
            Direcciones: resultado.direcciones,
            Empleos: resultado.empleos,
            Documentos: resultado.documentos,
            /* Creditos: [],*/
          },
          isCancelarTemp: resultado.persona.DistribuidoresEstatusID == "T",
          isCancelarPermanente:
            resultado.persona.DistribuidoresEstatusID == "F",
          isCancelarTempC: resultado.cliente?.CanjeaVale,
          Cargando: false,
          Error: false,
        }));

      // debugger
    } catch (error: any) {
      if (error.response) toast.error(`Response Error: ${error.response.data}`);
      else if (error.request) toast.error(`Request ${error}`);
      else toast.error(`${error}`);
      if (isMounted)
        setState((e) => ({
          ...e,
          Datos2: {
            Persona: undefined,
            Direcciones: [],
            Documentos: {},
            Empleos: [] /* Creditos: [],*/,
          },
          Cargando: false,
          Error: true,
        }));
    }
  };

  const FNCancelarTemporalmente = () => {
    MySwal.fire({
      icon: "warning",
      html: (
        <div>
          <br />
          <h3 className="text-center">Atenci&oacute;n</h3>
          <div className={`modal-body`}>
            <h5 className="text-center">
              {state.isCancelarTemp
                ? "¿Deseas activar a la socia?"
                : "¿Deseas cancelar temporalmente a la socia?"}
            </h5>
          </div>
        </div>
      ),
      showCancelButton: true,
      cancelButtonColor: "#FF0000",
      confirmButtonText: `Aceptar`,
      confirmButtonColor: `#3085d6`,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    })
      .then((respuesta) => {
        if (respuesta.isConfirmed) {
          if (!state.isCancelarTemp) {
            FnDistribuidores.FNCancelarTemporalmente(props.oidc, {
              Id: state.DistribuidorID,
              DistribuidoresEstatusID: "T",
            })
              .then(() => {
                toast.success("Socia cancelada temporalmente");
                ConsultarDatos();
              })
              .catch((err) => {
                toast.error(
                  "No se pudo cancelar temporalmente a la socia: " + err
                );
              });
          } else {
            FnDistribuidores.FNActivarTemporalmente(props.oidc, {
              Id: state.DistribuidorID,
              DistribuidoresEstatusID: "N",
            })
              .then(() => {
                toast.success("Socia activada correctamente");
                ConsultarDatos();
              })
              .catch((err) => {
                toast.error("No se pudo activar a la socia: " + err);
              });
          }
        }
      })
      .catch(() => toast.error("Ocurrio un error inesperado"));
  };



  const FNCancelarPermanente = () => {
    MySwal.fire({
      icon: "warning",
      html: (
        <div>
          <br />
          <h3 className="text-center">Atenci&oacute;n</h3>
          <div className={`modal-body`}>
            <h5 className="text-center">
              {"¿Deseas cancelar a la socia por fallecimiento?"}
              <h5>{"La cancelación es permanente"}</h5>
            </h5>
          </div>
        </div>
      ),
      showCancelButton: true,
      cancelButtonColor: "#FF0000",
      confirmButtonText: `Aceptar`,
      confirmButtonColor: `#3085d6`,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    })
      .then((respuesta) => {
        if (respuesta.isConfirmed) {
          FnDistribuidores.FNCancelarPermanente(props.oidc, {
            Id: state.DistribuidorID,
            DistribuidoresEstatusID: state.isCancelarPermanente ? "N" : "F",
          })
            .then(() => {
              ConsultarDatos();
              if (!state.isCancelarPermanente) {
                toast.success("Socia cancelada permanentemente");
              }
            })
            .catch((err) => {
              toast.error(
                "No se pudo cancelar permanentemente a la socia: " + err
              );
            });
        }
      })
      .catch(() => toast.error("Ocurrio un error inesperado"));
  };



  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const styles = {
    h3Cerrado: {
      color: "red",
    },
    h3Abierto: {
      color: "green",
    },
    div0: {
      marginLeft: "0%",
      marginTop: "5px",
      marginBotom: "15px",
      borderLeftWidth: "8px",
      borderTopWidth: "8px",
      borderTop: "4px solid gray",
    },
    div1: {
      marginLeft: "3%",
      marginTop: "5px",
      marginBotom: "15px",
      borderLeftWidth: "8px",
      borderTopWidth: "8px",
      borderTop: "4px solid gray",
    },
    div2: {
      marginLeft: "6%",
      marginTop: "5px",
      marginBotom: "15px",
      borderLeftWidth: "8px",
      borderTopWidth: "8px",
      borderTop: "4px solid gray",
    },
    div3: {
      marginLeft: "9%",
      marginTop: "5px",
      marginBotom: "15px",
      borderLeftWidth: "8px",
      borderTopWidth: "8px",
      borderTop: "4px solid gray",
    },
  };

  //   const [Estado, DefinirEstado] = React.useState<EstadoTipo>({
  //     Datos: {
  //         Persona: undefined,
  //         Empleos: [],
  //         Direcciones: [],
  //         Documentos: {},
  //         Cliente: undefined,
  //     },
  //     Cargando: true,
  //     Error: false,
  //     isCancelarTemp: false,
  //     isCancelarPermanente: false,
  //     //CancelarTemporalmenteCliente
  //     isCancelarTempC: false,
  //     Refresh: 0,
  //     RefreshPrestamos: 0,
  //     Detalle: false,
  //     DetalleCredito: false,
  //     liquidado: false,
  //     DetallePlan: false,
  //     datosClienteInfo: [],
  //     DatosClientes: [],
  //     DatosCreditos: [],
  //     DatosDetalle: [],
  //     ClientesLiquidados: [],
  //     CredID: 0,
  //     DocumentoID: 0,
  //     Filtros: {
  //         DirectorID: 0,
  //         ProductoID: 0,
  //         ZonaID: 0,
  //         SucursalID: 0,
  //         GrupoID: 0,
  //         DistribuidorID: 0,
  //         ClienteID: 0,
  //         tipoDias: 0,
  //     },
  //     datosCliente: undefined,
  //     DatosInfo: [],
  //     ListadoC: true,
  //     ProdPresPersonal: 0,
  //     ContratoSel: 0,
  //     ShowCliente: false,
  //     ShowSolicitudFallecimiento: false,
  //     ShowSolicitudCancelTemp: false,
  //     ShowSolicitudCRS: false,

  //     Form: {
  //         MostrarVerEvidencias: false
  //     },

  // })

  const [state, setState] = React.useState<EstadoTipo>({
    keyTemp: 0,
    ShowCliente: false,
    isCancelarTemp: false,
    isCancelarTempC: false,
    isCancelarPermanente: false,
    DatosExcel: [],
    DirectorID: 0,
    ProductoID: 0,
    SucursalID: 0,
    // GrupoID: 0,
    ClienteID: 0,
    DistribuidorID: 0,
    Datos: [],
    DatosProd: [],
    DatosSuc: [],
    DatosGpo: [],
    datosDist: undefined,
    datosIncrementos: [],
    DatosMostrar: [],
    DatosDetalle: [],
    datosPagos: undefined,
    DatosClientes: [],
    datosCliente: undefined,
    DatosCreditos: [],
    DatosMostrarDist: [],
    FiltroDist: "",
    Cargando: false,
    Error: false,
    Datos1F: false,
    CargandoProd: false,
    ErrorProd: false,
    Datos2F: false,
    CargandoSuc: false,
    ErrorSuc: false,
    Datos3F: false,
    CargandoGpo: false,
    ErrorGpo: false,
    Datos4F: false,
    tipoUsuario: 0,
    Form: {
      Mostrar: false,
      Datos: undefined,
      Id: undefined,
    },
    Detalle: false,
    DetalleCredito: false,
    DetallePlan: false,
    CredID: 0,
    Filtros: {
      DirectorID: 0,
      ProductoID: 0,
      ZonaID: 0,
      SucursalID: 0,
      GrupoID: 0,
      DistribuidorID: 0,
      ClienteID: 0,
      tipoDias: 0,
      // CoordinadorID: 0,
      // EstatusID: '',
      // DistribuidorNivelID: 0,
    },

    Datos2: {
      Persona: undefined,
      Empleos: [],
      Direcciones: [],
      Creditos: undefined,
    },
    Datos3: {
      Persona: undefined,
      Empleos: [],
      Direcciones: [],
      Documentos: {},
      Cliente: undefined,
    },
    ContratoSel: 0,
    DetalleSaldos: false
  });

  const [ShowClientePerfil, setShowClientePerfil] = React.useState(false);
  const [ShowSociaPerfil, setShowSociaPerfil] = React.useState(false);

  const SwalWarning = (title: string, msg: string) => {
    MySwal.fire({
      icon: "info",
      html: (
        <div>
          <br />
          <h3 className="text-center">{title}</h3>
          <div className={`modal-body`}>
            <div className="row text-center">
              <span className="text-center">
                <h4>{msg}</h4>
              </span>
              <br />
              <span className="text-center">
                <h4>
                  <strong>Por favor espere...</strong>
                </h4>
              </span>
            </div>
          </div>
        </div>
      ),
      timerProgressBar: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonText: `Ok`,
      didOpen: () => {
        MySwal.showLoading();
      },
    });
  };

  const cbAgregarCliente = (item: any) => {
    console.log("item: ", item);
    if (item.res == 1) {
      toast.success(item.msj);
    }
    if (item.res == 2) {
      toast.warning(item.msj);
    }
    setState((s) => ({ ...s, ShowCliente: false }));
  };

  const cbCancelarCliente = () =>
    setState((s) => ({ ...s, ShowCliente: false, VerEvidencias: false }));



  const generarXLSX = (values: {
    DirectorID: number;
    ProductoID: number;
    ClienteID: number;
    SucursalID: number;
    ZonaID: number;
    EmpresaID: number;
    DistribuidorID: number;
    CoordinadorID: number;
    ContratoID: number;
    EstatusID: string;
    DistribuidorNivelID: number;
    FechaInicio: Date;
    FechaFin: Date;
    Permiso: boolean;
    GrupoID: number;
    tipoDias: number;
  }) => {
    SwalWarning("Aviso", "Exportando a Excel.");

    const getProd = () => {
      Funciones.getdataGlobal(props.oidc, {
        ...values,
        DirectorID: isNaN(values.DirectorID) ? 0 : values.DirectorID,
        ProductoID: isNaN(values.ProductoID) ? 0 : values.ProductoID,
        ClienteID: isNaN(values.ClienteID) ? 0 : values.ClienteID,
        SucursalID: isNaN(values.SucursalID) ? 0 : values.SucursalID,
        ZonaID: isNaN(values.ZonaID) ? 0 : values.ZonaID,
        DistribuidorID: isNaN(values.DistribuidorID)
          ? 0
          : values.DistribuidorID,
        GrupoID: isNaN(values.GrupoID) ? 0 : values.GrupoID,
        Tipo: 2,
      })
        .then((respuesta: any) => {
          let tabla: any[] = [];

          // let DirectorID = 0;
          let Director = "";
          if (respuesta.length > 0) {
            const XLSX = require("xlsx-js-style");
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            const writeSheet = () => {
              const Heading = [
                {
                  CoordinadorValeID: "CoordinadorValeID",
                  ZonaVales: "ZonaVales",
                  SucursalVale: "SucursalVale",
                  catGrupos: "catGrupos",
                  CoordinadorVale: "CoordinadorVale",
                  DistribuidorID: "DistribuidorID",
                  NombreCom: "NombreCom",
                  LimiteCredito: "LimiteCredito",
                  limiteDeCreditoD: "limiteDeCreditoD",
                  disponibleD: "disponibleD",
                  CreditoDisponible: "CreditoDisponible",
                  ZonaValesID: "ZonaValesID",
                  limiteDeCreditoCS: "limiteDeCreditoCS",
                  disponibleCS: "disponibleCS",
                  Nivel: "Nivel",
                  SucursalValeID: "SucursalValeID",
                  EstatusID: "EstatusID",
                  FechaUltimoPago_1: "FechaUltimoPago_1",
                  OrigenIngresoID: "OrigenIngresoID",
                  limiteDeCreditoTDA: "limiteDeCreditoTDA",
                  disponibleTDA: "disponibleTDA",
                  ventasTotalesTiendita: "ventasTienditaCF",
                  OrigenIngreso: "OrigenIngreso",
                  Contraseña: "Contraseña",
                  "Vales Digitales": "Vales Digitales",
                  nivelSocieconomicoId: "nivelSocieconomicoId",
                  color: "color",
                  saldoEnRiesgoTDA: "saldoEnRiesgoTDA",
                  TienditaAtr: "TienditaAtr",
                  AnalistaID: "AnalistaID",
                  NombreAnalista: "NombreAnalista",
                  Foraneo: "Foraneo",
                  Dia: "Dia",
                  " ": " ",
                  saldoActualD: "saldoActualD",
                  saldoActualCS: "saldoActualCS",
                  Cartera: "Cartera",
                  SaldoPrestPer: "SaldoPrestPer",
                  CredActivos: "CredActivos",
                  NumPrestPer: "NumPrestPer",
                  SaldoAtrasado: "SaldoAtrasado",
                  SaldoAtrPrestPer: "SaldoAtrPrestPer",
                  DiasAtraso: "DiasAtraso",
                  PagosAtrasados: "PagosAtrasados",
                  CreditosAtrasados: "CreditosAtrasados",
                  Capital: "Capital",
                  Interes: "Interes",
                  Seguro: "Seguro",
                  PorcColocacionLimite: "PorcColocacionLimite",
                  FechaUltimoPago: "FechaUltimoPago",
                  FechaUltimoVale: "FechaUltimoVale",
                  CapitalLiquidado: "CapitalLiquidado",
                  TabuladorComisionesID: "TabuladorComisionesID",
                  CarteraEnRiesgo: "CarteraEnRiesgo",
                  ExpedienteDigitalEstatus: "ExpedienteDigitalEstatus",
                  GestorID: "GestorID",
                  NombreGestor: "NombreGestor",
                  ExpedienteID: "ExpedienteID",
                  PromotorID: "PromotorID",
                  EstatusCarteraID: "EstatusCarteraID",
                  Convenio: "Convenio",
                  Pendiente: "Pendiente",
                  UltRelacionFecha: "UltRelacionFecha",
                  SaldoUltimoCorte: "SaldoUltimoCorte",
                  FechaPrimerCanje: "FechaPrimerCanje",
                  numAvales: "numAvales",
                  ContrasenaT: "ContrasenaT",
                  lineaTipoDescripcionD: "lineaTipoDescripcionD",
                  lineaTipoDescripcionCS: "lineaTipoDescripcionCS",
                  saldoEnRiesgoD: "saldoEnRiesgoD",
                  saldoEnRiesgoCS: "saldoEnRiesgoCS",
                  saldoAtrasadoD: "saldoAtrasadoD",
                  saldoAtrasadoCS: "saldoAtrasadoCS",
                  eslineaD: "eslineaD",
                  eslineaCS: "eslineaCS",
                  saldoActualCovid: "saldoActualCovid",
                  saldoTotalCovid: "saldoTotalCovid",
                  Recuperado: "Recuperado",
                  UltRelacionImporte: "UltRelacionImporte",
                  DiasDesdeUltPago: "DiasDesdeUltPago",
                  Promotor: "Promotor",
                  DistribCondicionID: "DistribCondicionID",
                  Condición: "Condición",
                  UsuarioIncremLineaD: "UsuarioIncremLineaD",
                  NombreAutorizaIncremLineaD: "NombreAutorizaIncremLineaD",
                  TipoIncremLineaD: "TipoIncremLineaD",
                  FHIncremLineaD: "FHIncremLineaD",
                  IncrementoLineaD: "IncrementoLineaD",
                  UsuarioIncremLineaCS: "UsuarioIncremLineaCS",
                  NombreAutorizaIncremLineaCS: "NombreAutorizaIncremLineaCS",
                  TipoIncremLineaCS: "TipoIncremLineaCS",
                  FHIncremLineaCS: "FHIncremLineaCS",
                  IncrementoLineaCS: "IncrementoLineaCS",
                  SaldoActual: "SaldoActual",
                  SalActConvenio: "SalActConvenio",
                  SalAtrConvenio: "SalAtrConvenio",
                  SalRieConvenio: "SalRieConvenio",
                  Reestructura: "Reestructura",
                  SalActReestructura: "SalActReestructura",
                  SalAtrReestructura: "SalAtrReestructura",
                  SalRieReestructura: "SalRieReestructura",
                  "  ": "  ",
                  Estatus: "Estatus",
                  PorcMora: "PorcMora",
                  PorcCalidad: "PorcCalidad",
                  PesoxZona: "PesoxZona",
                  PesoxSucursal: "PesoxSucursal",
                  PesoxCoordi: "PesoxCoordi",
                },
              ];

              const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(Heading, {
                header: [
                  "CoordinadorValeID",
                  "ZonaVales",
                  "SucursalVale",
                  "catGrupos",
                  "CoordinadorVale",
                  "DistribuidorID",
                  "NombreCom",
                  "LimiteCredito",
                  "limiteDeCreditoD",
                  "disponibleD",
                  "CreditoDisponible",
                  "ZonaValesID",
                  "limiteDeCreditoCS",
                  "disponibleCS",
                  "Nivel",
                  "SucursalValeID",
                  "EstatusID",
                  "FechaUltimoPago_1",
                  "OrigenIngresoID",
                  "limiteDeCreditoTDA",
                  "disponibleTDA",
                  "ventasTotalesTiendita",
                  "OrigenIngreso",
                  "Contraseña",
                  "Vales Digitales",
                  "nivelSocieconomicoId",
                  "color",
                  "saldoEnRiesgoTDA",
                  "TienditaAtr",
                  "AnalistaID",
                  "NombreAnalista",
                  "Foraneo",
                  "Dia",
                  " ",
                  "saldoActualD",
                  "saldoActualCS",
                  "Cartera",
                  "SaldoPrestPer",
                  "CredActivos",
                  "NumPrestPer",
                  "SaldoAtrasado",
                  "SaldoAtrPrestPer",
                  "DiasAtraso",
                  "PagosAtrasados",
                  "CreditosAtrasados",
                  "Capital",
                  "Interes",
                  "Seguro",
                  "PorcColocacionLimite",
                  "FechaUltimoPago",
                  "FechaUltimoVale",
                  "CapitalLiquidado",
                  "TabuladorComisionesID",
                  "CarteraEnRiesgo",
                  "ExpedienteDigitalEstatus",
                  "GestorID",
                  "NombreGestor",
                  "ExpedienteID",
                  "PromotorID",
                  "EstatusCarteraID",
                  "Convenio",
                  "Pendiente",
                  "UltRelacionFecha",
                  "SaldoUltimoCorte",
                  "FechaPrimerCanje",
                  "numAvales",
                  "ContrasenaT",
                  "lineaTipoDescripcionD",
                  "lineaTipoDescripcionCS",
                  "saldoEnRiesgoD",
                  "saldoEnRiesgoCS",
                  "saldoAtrasadoD",
                  "saldoAtrasadoCS",
                  "eslineaD",
                  "eslineaCS",
                  "saldoActualCovid",
                  "saldoTotalCovid",
                  "Recuperado",
                  "UltRelacionImporte",
                  "DiasDesdeUltPago",
                  "Promotor",
                  "DistribCondicionID",
                  "Condición",
                  "UsuarioIncremLineaD",
                  "NombreAutorizaIncremLineaD",
                  "TipoIncremLineaD",
                  "FHIncremLineaD",
                  "IncrementoLineaD",
                  "UsuarioIncremLineaCS",
                  "NombreAutorizaIncremLineaCS",
                  "TipoIncremLineaCS",
                  "FHIncremLineaCS",
                  "IncrementoLineaCS",
                  "SaldoActual",
                  "SalActConvenio",
                  "SalAtrConvenio",
                  "SalRieConvenio",
                  "Reestructura",
                  "SalActReestructura",
                  "SalAtrReestructura",
                  "SalRieReestructura",
                  "  ",
                  "Estatus",
                  "PorcMora",
                  "PorcCalidad",
                  "PesoxZona",
                  "PesoxSucursal",
                  "PesoxCoordi",
                ],
                skipHeader: true,
                origin: "A4",
              });

              XLSX.utils.sheet_add_json(ws, tabla, {
                skipHeader: true,
                origin: "A5", //ok
              });

              XLSX.utils.sheet_add_aoa(ws, [["Reporte Global de Vales"]], {
                origin: "A1",
              });

              const header = Object.keys(tabla[0]);

              var wscols: { wch: number }[] = [];
              for (var i = 0; i < header.length; i++) {
                wscols.push({ wch: header[i].length + 5 });
              }
              ws["!cols"] = wscols;

              let headerlength = Object.keys(tabla[0]).length;

              const merge = [
                { s: { r: 0, c: 0 }, e: { r: 2, c: headerlength - 1 } },
              ];
              ws["!merges"] = merge;

              for (let i in ws) {
                if (typeof ws[i] != "object") continue;
                let cell = XLSX.utils.decode_cell(i);
                if (i.replace(/[^0-9]/gi, "") === "4") {
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
                      wrapText: "1",
                    },
                  };
                } else {
                  ws[i].s = {
                    // styling for all cells
                    font: {
                      name: "Song Ti",
                      sz: 10,
                    },
                    alignment: {
                      vertical: "center",
                      horizontal: "center",
                      wrapText: "1", // any truthy value here
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
                  if (cell.r % 2) {
                    // every other row
                    ws[i].s.fill = {
                      // background color
                      patternType: "solid",
                      fgColor: { rgb: "EEEEEE" },
                      bgColor: { rgb: "EEEEEE" },
                    };
                  }
                }
              }

              ws["A1"].s = {
                font: {
                  name: "Song Ti",
                  sz: 18,
                  bold: true,
                },
                alignment: {
                  vertical: "center",
                  horizontal: "center",
                  wrapText: "1", // any truthy value here
                },
              };

              ws["!ref"] = XLSX.utils.encode_range({
                s: { c: 0, r: 0 },
                e: { c: headerlength - 1, r: tabla.length + 3 },
              });
              XLSX.utils.book_append_sheet(wb, ws, Director);

              tabla = [];
            };
            respuesta.forEach((element: any) => {
              let Productos: any = {
                CoordinadorValeID: element.CoordinadorValeID ?? "",
                ZonaVales: element.ZonaVale ?? "",
                SucursalVale: element.SucursalVale ?? "",
                catGrupos: element.catGrupos ?? "",
                CoordinadorVale: element.CoordinadorVale ?? "",
                DistribuidorID: element.DistribuidorID ?? "",
                NombreCom: element.NombreCom ?? "",
                LimiteCredito: element.LimiteCredito ?? "",
                limiteDeCreditoD: element.LimiteCreditoID ?? "",
                disponibleD: element.DisponibleID ?? "",
                CreditoDisponible: element.CreditoDisponible ?? "",
                ZonaValesID: element.ZonaValesID ?? "",
                limiteDeCreditoCS: element.LimiteDeCreditoCS ?? "",
                disponibleCS: element.DisponibleCS ?? "",
                Nivel: element.Nivel ?? "",
                SucursalValeID: element.SucursalValeID ?? "",
                EstatusID: element.EstatusID ?? "",
                FechaUltimoPago_1: element.FechaUltimoPago
                  ? moment(element.FechaUltimoPago).format("DD/MM/YYYY")
                  : "",
                OrigenIngresoID: element.OrigenIngresoID ?? "",
                limiteDeCreditoTDA: element.limiteDeCreditoTDA ?? "",
                disponibleTDA: element.disponibleTDA ?? "",
                ventasTotalesTiendita: element.ventasTotalesTiendita ?? "",
                OrigenIngreso: element.OrigenIngreso ?? "",
                Contraseña: element.Contraseña ?? "",
                "Vales Digitales": element.ValesDigital ?? "",
                nivelSocieconomicoId: element.nivelSocieconomicoId ?? "",
                color: element.color ?? "",
                saldoEnRiesgoTDA: element.saldoEnRiesgoTDA ?? "",
                TienditaAtr: element.TienditaAtr ?? "",
                AnalistaID: element.AnalistaID ?? "",
                NombreAnalista: element.NombreAnalista ?? "",
                Foraneo: element.Foraneo ?? "",
                Dia: element.Dia ?? "",
                " ": "",
                saldoActualD: element.SaldoActualID ?? "",
                saldoActualCS: element.SaldoActualCS ?? "",
                Cartera: element.Cartera ?? "",
                SaldoPrestPer: element.SaldoPresPer ?? "",
                CredActivos: element.CredActovps ?? "",
                NumPrestPer: element.NumPrestPer ?? "",
                SaldoAtrasado: element.SaldoAtrasado ?? "",
                SaldoAtrPrestPer: element.SaldoAtrPrestPer ?? "",
                DiasAtraso: element.DiasAtraso ?? "",
                PagosAtrasados: element.PagosAtrasados ?? "",
                CreditosAtrasados: element.CreditosAtrasados ?? "",
                Capital: element.Capital ?? "",
                Interes: element.Interes ?? "",
                Seguro: element.Seguro ?? "",
                PorcColocacionLimite: element.PorcColocacionLimite ?? "",
                FechaUltimoPago: element.FechaUltimoPago
                  ? moment(element.FechaUltimoPago).format("DD/MM/YYYY")
                  : "",
                FechaUltimoVale: element.fechaUltimoVale
                  ? moment(element.fechaUltimoVale).format("DD/MM/YYYY")
                  : "",
                CapitalLiquidado: element.CapitalLiquidado ?? "",
                TabuladorComisionesID: element.TabuladorComisionesID ?? "",
                CarteraEnRiesgo: element.CarteraEnRiesgo ?? "",
                ExpedienteDigitalEstatus: element.EXPEDIENTEDIG ?? "",
                GestorID: element.GestorID ?? "",
                NombreGestor: element.NombreGestor ?? "",
                ExpedienteID: element.ExpedienteID ?? "",
                PromotorID: element.PromotorID ?? "",
                EstatusCarteraID: element.EstatusCarteraID ?? "",
                Convenio: element.CONVENIO ?? "",
                Pendiente: element.PENDIENTE ?? "",
                UltRelacionFecha: element.UltimaRelacionFecha
                  ? moment(element.UltimaRelacionFecha).format("DD/MM/YYYY")
                  : "",
                SaldoUltimoCorte: element.SaldoUltimoCorte ?? "",
                FechaPrimerCanje: element.FechaPrimerCanje
                  ? moment(element.FechaPrimerCanje).format("DD/MM/YYYY")
                  : "",
                numAvales: element.NumAvales ?? "",
                ContrasenaT: element.ContrasenaT ?? "",
                lineaTipoDescripcionD: element.lineaTipoDescripcionD ?? "",
                lineaTipoDescripcionCS: element.lineaTipoDescripcionCS ?? "",
                saldoEnRiesgoD: element.SaldoEnRiesgoD ?? "",
                saldoEnRiesgoCS: element.SaldoEnRiesgoCS ?? "",
                saldoAtrasadoD: element.SaldoAtrasadoD ?? "",
                saldoAtrasadoCS: element.SaldoAtrasadoCS ?? "",
                eslineaD: element.eslineaD ?? "",
                eslineaCS: element.eslineaCS ?? "",
                saldoActualCovid: element.saldoActualCovid ?? "",
                saldoTotalCovid: element.saldoTotalCovid ?? "",
                Recuperado: element.Recuperado ?? "",
                UltRelacionImporte: element.UltRelacionImporte ?? "",
                DiasDesdeUltPago: element.DiasDesdeUltPago ?? "",
                Promotor: element.PROMOTOR ?? "Migrada",
                DistribCondicionID: element.DistribCondicionID ?? "",
                Condición: element.Condición ?? "",
                UsuarioIncremLineaD: element.UsuarioIncremLineaD ?? "",
                NombreAutorizaIncremLineaD:
                  element.NombreAutorizaIncremLineaD ?? "",
                TipoIncremLineaD: element.TipoIncremLineaD ?? "",
                FHIncremLineaD: element.FHIncremLineaD ?? "",
                IncrementoLineaD: element.IncrementoLineaD ?? "",
                UsuarioIncremLineaCS: element.UsuarioIncremLineaCS ?? "",
                NombreAutorizaIncremLineaCS:
                  element.NombreAutorizaIncremLineaCS ?? "",
                TipoIncremLineaCS: element.TipoIncremLineaCS ?? "",
                FHIncremLineaCS: element.FHIncremLineaCS ?? "",
                IncrementoLineaCS: element.IncrementoLineaCS ?? "",
                SaldoActual: element.SaldoActual ?? "",
                SalActConvenio: element.SalActConvenio ?? "",
                SalAtrConvenio: element.SalAtrConvenio ?? "",
                SalRieConvenio: element.SalRieConvenio ?? "",
                Reestructura: element.Reestructura ?? "",
                SalActReestructura: element.SalActReestructura ?? "",
                SalAtrReestructura: element.SalAtrReestructura ?? "",
                SalRieReestructura: element.SalRieReestructura ?? "",
                "  ": "",
                Estatus: element.DistribuidoresEstatus ?? "",
                PorcMora: element.PorcMora ?? "",
                PorcCalidad: element.PorcCalidad ?? "",
                PesoxZona: element.PesoxZona ?? "",
                PesoxSucursal: element.PesoxSucursal ?? "",
                PesoxCoordi: element.PesoxCoordi ?? "",
              };
              tabla.push(Productos);
            });
            writeSheet();
            XLSX.writeFile(wb, "GlobalCreditos.xlsx");

            MySwal.close();
          } else {
            toast.warning("No se encontro informacion para exportar");
            MySwal.close();
          }
        })
        .catch((reason: any) => {
          toast.error("Error al exportar el Excel, vuelva a intentarlo");
          MySwal.close();
        });
    };

    if (state.Datos.length == 0) {
      Funciones.FNgetbyfiltros(props.oidc, {
        ...values,
        DirectorID: isNaN(values.DirectorID) ? 0 : values.DirectorID,
        ProductoID: isNaN(values.ProductoID) ? 0 : values.ProductoID,
        ClienteID: isNaN(values.ClienteID) ? 0 : values.ClienteID,
        SucursalID: isNaN(values.SucursalID) ? 0 : values.SucursalID,
        ZonaID: isNaN(values.ZonaID) ? 0 : values.ZonaID,
        DistribuidorID: isNaN(values.DistribuidorID)
          ? 0
          : values.DistribuidorID,
        GrupoID: isNaN(values.GrupoID) ? 0 : values.GrupoID,
        Tipo: 1,
      })
        .then((respuesta: any) => {
          getProd();
        })
        .catch((reason: any) => {
          // setState(s => ({ ...s, Cargando: false }))
          toast.error("Error al exportar el Excel, vuelva a intentarlo");
          MySwal.close();
        });
    } else {
      getProd();
    }
  };

  const FNGetProductos = (DirectorID: number, Tipo: number) => {
    setState((s) => ({
      ...s,
      ProductoID: 0,
      CargandoProd: true,
      ErrorProd: false,
      DatosProd: [],
      DatosSuc: [],
      DatosGpo: [],
      Datos2F: false,
      Datos3F: false,
      Datos4F: false,
    }));

    Funciones.FNgetbyfiltros(props.oidc, {
      DirectorID,
      ProductoID: state.Filtros.ProductoID,
      SucursalID: state.Filtros.SucursalID,
      ZonaID: state.Filtros.ZonaID,
      DistribuidorID: state.Filtros.DistribuidorID,
      GrupoID: state.Filtros.GrupoID,
      ClienteID: state.Filtros.ClienteID,
      Tipo,
      tipoDias: state.Filtros.tipoDias,
    })
      .then((respuesta: any) => {
        if (respuesta.length > 0) {
          // setState(s => ({ ...s, MultiSaldoCajaID: respuesta[0].MultisaldosCajaID }))
          let tabla: any[] = [];
          let Cartera = 0;
          let Disponible = 0;
          let Colocado = 0;
          let SaldoAtrasado = 0;
          let CreditosAtrasados = 0;
          let Capital = 0;
          let Calidad = 0;
          let CapLiquidado = 0;
          let CarteraEnRiesgo = 0;
          let Recuperado = 0;
          let CountDistribuidor = 0;
          let LimiteDeCredito = 0;
          // let posicion = 0

          respuesta.forEach((element: any) => {
            // posicion = posicion + 1
            //if (cajaAnteriorID == 0) {
            let Productos: any = {
              UsuarioID: element.UsuarioID,
              DirectorID: element.DirectorID,
              NombreDirector: element.NombreDirector,
              ProductoID: element.ProductoID,
              Producto: element.Producto,
              CountDistribuidor: element.CountDistribuidor,
              LimiteDeCredito: element.LimiteDeCredito,
              Disponible: element.Disponible,
              Colocado: element.Colocado,
              SaldoActual: element.SaldoActual,
              Cartera: element.Cartera,
              SaldoAtrasado: element.SaldoAtrasado,
              Calidad: (element.CarteraEnRiesgo / element.Cartera) * 100 - 100,
              CreditosAtrasados: element.CreditosAtrasados,
              saldoEnRiesgo: element.saldoEnRiesgo,
              Recuperado: element.Recuperado,
              Capital: element.Capital,
              CapLiquidado: element.CapLiquidado,
              CarteraEnRiesgo: element.CarteraEnRiesgo,
            };
            Cartera += element.Cartera;
            Disponible += element.Disponible;
            Colocado += element.Colocado;
            CountDistribuidor += element.CountDistribuidor;
            SaldoAtrasado += element.SaldoAtrasado;
            CreditosAtrasados += element.CreditosAtrasados;
            Calidad = (element.CarteraEnRiesgo / Cartera) * 100 - 100;
            Capital += element.Capital;
            CapLiquidado += element.CapLiquidado;
            CarteraEnRiesgo += element.CarteraEnRiesgo;
            Recuperado += element.Recuperado;
            LimiteDeCredito += element.LimiteDeCredito;
            tabla.push(Productos);
          });

          let TotalProd: any = {
            UsuarioID: 0,
            DirectorID: 0,
            NombreDirector: "",
            ProductoID: null,
            Producto: "TOTAL",
            LimiteDeCredito: LimiteDeCredito,
            Disponible: Disponible,
            Colocado,
            Calidad,
            SaldoActual: 0,
            Cartera,
            SaldoAtrasado,
            CreditosAtrasados,
            saldoEnRiesgo: 0,
            Recuperado,
            Capital,
            CapLiquidado,
            CarteraEnRiesgo,
            CountDistribuidor,
          };

          tabla.push(TotalProd);

          // setState(s => ({ ...s, Datos: tabla, Cargando: false }))

          setState((s) => ({
            ...s,
            DatosExcel: tabla,
            CargandoProd: false,
            ErrorProd: false,
            DatosProd: tabla,
            Datos2F: true,
          }));
        } else {
          setState((s) => ({
            ...s,
            DatosExcel: [],
            CargandoProd: false,
            ErrorProd: true,
            DatosProd: [],
            Datos2F: false,
          }));
        }
      })
      .catch(() => {
        setState((s) => ({
          ...s,
          DirectorID: 0,
          DatosExcel: [],
          CargandoProd: false,
          ErrorProd: true,
          DatosProd: [],
          Datos2F: false,
        }));
        toast.error("Error al consultar, vuelva a intentarlo");
      });
  };

  const FNGetSucursales = (
    DirectorID: number,
    ProductoID: number,
    Tipo: number
  ) => {
    setState((s) => ({
      ...s,
      SucursalID: 0,
      CargandoSuc: true,
      ErrorSuc: false,
      DatosSuc: [],
      DatosGpo: [],
      Datos3F: false,
      Datos4F: false,
    }));
    Funciones.FNgetbyfiltros(props.oidc, {
      DirectorID,
      ProductoID,
      SucursalID: state.Filtros.SucursalID,
      ZonaID: state.Filtros.ZonaID,
      DistribuidorID: state.Filtros.DistribuidorID,
      GrupoID: state.Filtros.GrupoID,
      ClienteID: state.Filtros.ClienteID,
      Tipo,
      tipoDias: state.Filtros.tipoDias,
    })
      .then((respuesta: any) => {
        if (respuesta.length > 0) {
          // setState(s => ({ ...s, MultiSaldoCajaID: respuesta[0].MultisaldosCajaID }))
          let tabla: any[] = [];
          let Cartera = 0;
          let Disponible = 0;
          let Colocado = 0;
          let SaldoAtrasado = 0;
          let Calidad = 0;
          let CreditosAtrasados = 0;
          let Capital = 0;
          let CapLiquidado = 0;
          let CarteraEnRiesgo = 0;
          let Recuperado = 0;
          let CountDistribuidor = 0;
          let LimiteDeCredito = 0;
          // let posicion = 0

          respuesta.forEach((element: any) => {
            // posicion = posicion + 1
            //if (cajaAnteriorID == 0) {
            console.log("ELEMENT SUCURSAL", element);
            let Sucursales: any = {
              UsuarioID: element.UsuarioID,
              DirectorID: element.DirectorID,
              NombreDirector: element.NombreDirector,
              ProductoID: element.ProductoID,
              Producto: element.Producto,
              SucursalID: element.SucursalID,
              Nombre: element.Nombre,
              CountDistribuidor: element.CountDistribuidor,
              LimiteDeCredito: element.LimiteDeCredito,
              Disponible: element.Disponible,
              Colocado: element.Colocado,
              SaldoActual: element.SaldoActual,
              Cartera: element.Cartera,
              SaldoAtrasado: element.SaldoAtrasado,
              Calidad: (element.CarteraEnRiesgo / element.Cartera) * 100 - 100,
              CreditosAtrasados: element.CreditosAtrasados,
              saldoEnRiesgo: element.saldoEnRiesgo,
              Recuperado: element.Recuperado,
              Capital: element.Capital,
              CapLiquidado: element.CapLiquidado,
              CarteraEnRiesgo: element.CarteraEnRiesgo,
            };
            Cartera += element.Cartera;
            Disponible += element.Disponible;
            Colocado += element.Colocado;
            CountDistribuidor += element.CountDistribuidor;
            SaldoAtrasado += element.SaldoAtrasado;
            CreditosAtrasados += element.CreditosAtrasados;
            Calidad = (element.CarteraEnRiesgo / Cartera) * 100 - 100;
            Capital += element.Capital;
            CapLiquidado += element.CapLiquidado;
            CarteraEnRiesgo += element.CarteraEnRiesgo;
            Recuperado += element.Recuperado;
            LimiteDeCredito += element.LimiteDeCredito;
            tabla.push(Sucursales);
          });

          let TotalSuc: any = {
            UsuarioID: 0,
            DirectorID: 0,
            NombreDirector: "",
            ProductoID: 0,
            Producto: "",
            SucursalID: null,
            Nombre: "TOTAL",
            LimiteDeCredito: LimiteDeCredito,
            Disponible: Disponible,
            Colocado,
            Calidad,
            SaldoActual: 0,
            Cartera,
            SaldoAtrasado,
            CreditosAtrasados,
            saldoEnRiesgo: 0,
            Recuperado,
            Capital,
            CapLiquidado,
            CarteraEnRiesgo,
            CountDistribuidor,
          };

          tabla.push(TotalSuc);

          // setState(s => ({ ...s, Datos: tabla, Cargando: false }))

          setState((s) => ({
            ...s,
            CargandoSuc: false,
            ErrorSuc: false,
            DatosSuc: tabla,
            Datos3F: true,
          }));
        } else {
          setState((s) => ({
            ...s,
            CargandoSuc: false,
            ErrorSuc: true,
            DatosSuc: [],
            Datos3F: false,
          }));
        }
      })
      .catch(() => {
        setState((s) => ({
          ...s,
          ProductoID: 0,
          CargandoSuc: false,
          ErrorSuc: true,
          DatosSuc: [],
          Datos3F: false,
        }));
        toast.error("Error al consultar, vuelva a intentarlo");
      });
  };

  const [formValues, setFormValues] = useState({
    ClienteId: 13,
  });

  const FNGetGrupos = (
    DirectorID: number,
    ProductoID: number,
    SucursalID: number,
    Tipo: number
  ) => {
    setState((s) => ({
      ...s,
      CargandoGpo: true,
      ErrorGpo: false,
      DatosGpo: [],
      Datos4F: false,
    }));
    Funciones.FNgetbyfiltros(props.oidc, {
      DirectorID,
      ProductoID,
      SucursalID,
      ZonaID: state.Filtros.ZonaID,
      DistribuidorID: state.Filtros.DistribuidorID,
      GrupoID: state.Filtros.GrupoID,
      ClienteID: state.Filtros.ClienteID,
      Tipo,
      tipoDias: state.Filtros.tipoDias,
    })
      .then((respuesta: any) => {
        if (respuesta.length > 0) {
          // setState(s => ({ ...s, MultiSaldoCajaID: respuesta[0].MultisaldosCajaID }))
          let tabla: any[] = [];
          let Cartera = 0;
          let Disponible = 0;
          let Colocado = 0;
          let SaldoAtrasado = 0;
          let CreditosAtrasados = 0;
          let Capital = 0;
          let Calidad = 0;
          let CapLiquidado = 0;
          let CarteraEnRiesgo = 0;
          let Recuperado = 0;
          let CountDistribuidor = 0;
          let LimiteDeCredito = 0;
          // let posicion = 0

          respuesta.forEach((element: any) => {
            // posicion = posicion + 1
            //if (cajaAnteriorID == 0) {
            let Grupos: any = {
              UsuarioID: element.UsuarioID,
              DirectorID: element.DirectorID,
              NombreDirector: element.NombreDirector,
              ProductoID: element.ProductoID,
              Producto: element.Producto,
              SucursalID: element.SucursalID,
              Nombre: element.Nombre,
              GrupoID: element.GrupoID,
              ClasificadorGrupoID: element.ClasificadorGrupoID,
              Descripcion: element.Descripcion,
              Coordinador: element.Coordinador,
              LimiteDeCredito: element.LimiteDeCredito,
              Disponible: element.Disponible,
              Colocado: element.Colocado,
              SaldoActual: element.SaldoActual,
              Cartera: element.Cartera,
              SaldoAtrasado: element.SaldoAtrasado,
              Calidad: (element.CarteraEnRiesgo / element.Cartera) * 100 - 100,
              CreditosAtrasados: element.CreditosAtrasados,
              saldoEnRiesgo: element.saldoEnRiesgo,
              Recuperado: element.Recuperado,
              Capital: element.Capital,
              CapLiquidado: element.CapLiquidado,
              CarteraEnRiesgo: element.CarteraEnRiesgo,
              Detalle: element.Detalle,
              Total: element.Total,
              CountDistribuidor: element.CountDistribuidor,
            };

            let CarteraDist = 0;
            let DisponibleDist = 0;
            let ColocadoDist = 0;
            let SaldoAtrasadoDist = 0;
            let CreditosAtrasadosDist = 0;
            let CapitalDist = 0;
            let CalidadDist = 0;
            let CapLiquidadoDist = 0;
            let CarteraEnRiesgoDist = 0;
            let RecuperadoDist = 0;
            let CountDistribuidorDist = 0;
            let LimiteDeCreditoDist = 0;

            if (element.Detalle.length > 0) {
              element.Detalle.forEach((dist: any) => {
                CarteraDist += dist.Cartera;
                DisponibleDist += dist.Disponible;
                (ColocadoDist += dist.Colocado),
                  (SaldoAtrasadoDist += dist.SaldoAtrasado);
                CreditosAtrasadosDist += dist.CreditosAtrasados;
                CapitalDist += dist.Capital;
                CountDistribuidorDist += dist.Countdistribuidor;
                CalidadDist =
                  (element.CarteraEnRiesgo / CarteraDist) * 100 - 100;
                CapLiquidadoDist += dist.CapLiquidado;
                CarteraEnRiesgoDist += dist.CarteraEnRiesgo;
                RecuperadoDist += dist.Recuperado;
                LimiteDeCreditoDist += element.LimiteDeCredito;
              });
            }

            let TotalDist: any = {
              UsuarioID: 0,
              DirectorID: 0,
              NombreDirector: "",
              ProductoID: 0,
              Producto: "",
              SucursalID: 0,
              Nombre: "",
              GrupoID: 0,
              ClasificadorGrupoID: 0,
              Descripcion: "",
              CoordinadorID: 0,
              Coordinador: "",
              DistribuidorID: null,
              NombreCompleto: "TOTAL",
              LimiteDeCredito: LimiteDeCreditoDist,
              Disponible: DisponibleDist,
              Calidad: CalidadDist,
              Colocado: ColocadoDist,
              SaldoActual: 0,
              Cartera: CarteraDist,
              SaldoAtrasado: SaldoAtrasadoDist,
              CreditosAtrasados: CreditosAtrasadosDist,
              saldoEnRiesgo: 0,
              Recuperado: RecuperadoDist,
              Capital: CapitalDist,
              CountDistribuidor: CountDistribuidor,
              CapLiquidado: CapLiquidadoDist,
              CarteraEnRiesgo: CarteraEnRiesgoDist,
              Detalle: {},
            };

            Grupos.Total = TotalDist;

            // console.log('ele Total: ', element.Total)

            Cartera += element.Cartera;
            Disponible += element.Disponible;
            Colocado += element.Colocado;
            SaldoAtrasado += element.SaldoAtrasado;
            CountDistribuidor += element.CountDistribuidor;
            CreditosAtrasados += element.CreditosAtrasados;
            Capital += element.Capital;
            Calidad = (element.CarteraEnRiesgo / Cartera) * 100 - 100;
            CapLiquidado += element.CapLiquidado;
            CarteraEnRiesgo += element.CarteraEnRiesgo;
            Recuperado += element.Recuperado;
            LimiteDeCredito += element.LimiteDeCredito;
            tabla.push(Grupos);
          });

          let TotalGpo: any = {
            UsuarioID: 0,
            DirectorID: 0,
            NombreDirector: "",
            ProductoID: 0,
            Producto: "",
            SucursalID: 0,
            Nombre: "",
            GrupoID: null,
            ClasificadorGrupoID: 0,
            Descripcion: "",
            Coordinador: "TOTAL",
            LimiteDeCredito: LimiteDeCredito,
            Disponible: Disponible,
            Colocado,
            SaldoActual: 0,
            Cartera,
            Calidad,
            SaldoAtrasado,
            CreditosAtrasados,
            saldoEnRiesgo: 0,
            Recuperado,
            Capital,
            CountDistribuidor,
            CapLiquidado,
            CarteraEnRiesgo,
            Detalle: {},
          };

          tabla.push(TotalGpo);

          console.log("tablaGpo: ", tabla);

          // setState(s => ({ ...s, Datos: tabla, Cargando: false }))

          setState((s) => ({
            ...s,
            CargandoGpo: false,
            ErrorGpo: false,
            DatosGpo: tabla,
            Datos4F: true,
          }));
        } else {
          setState((s) => ({
            ...s,
            CargandoGpo: false,
            ErrorGpo: true,
            DatosGpo: [],
            Datos4F: false,
          }));
        }
      })
      .catch(() => {
        setState((s) => ({
          ...s,
          SucursalID: 0,
          CargandoGpo: false,
          ErrorGpo: true,
          DatosGpo: [],
          Datos4F: false,
        }));
        toast.error("Error al consultar, vuelva a intentarlo");
      });
  };

  const FNGetDetalle = (Data: any, CreditoID: number) => {
    SwalWarning("Aviso", "Obteniendo Plan de Pagos.");
    setState((s) => ({ ...s, DatosDetalle: [] }));
    Funciones.FNGetPlanPagos(props.oidc, CreditoID)
      .then((respuesta: any) => {
        if (respuesta.length > 0) {
          // setState(s => ({ ...s, MultiSaldoCajaID: respuesta[0].MultisaldosCajaID }))
          let tabla: any[] = [];
          let ImporteTotal = 0;
          let Abonos = 0;
          let SaldoActual = 0;
          let Comision = 0;

          respuesta.forEach((element: any) => {
            // posicion = posicion + 1
            //if (cajaAnteriorID == 0) {
            let PlanPagos: any = {
              NoPago: element.NoPago,
              FechaVencimiento: element.FechaVencimiento,
              ImporteTotal: element.ImporteTotal,
              Abonos: element.Abonos,
              SaldoActual: element.SaldoActual,
              Comision: element.Comision,
              FechaLiquidacion: element.FechaLiquidacion,
              DiasAtraso: element.DiasAtraso,
              FechaVencimientoClienteFinal:
                element.FechaVencimientoClienteFinal,
            };

            ImporteTotal += element.ImporteTotal;
            SaldoActual += element.SaldoActual;
            Abonos += element.Abonos;
            Comision += element.Comision;

            tabla.push(PlanPagos);
          });

          let TotalPlanPagos: any = {
            NoPago: null,
            FechaVencimiento: "",
            ImporteTotal,
            Abonos,
            SaldoActual,
            Comision,
            FechaLiquidacion: "",
            DiasAtraso: 0,
            FechaVencimientoClienteFinal: "",
          };

          tabla.push(TotalPlanPagos);

          // setState(s => ({ ...s, Datos: tabla, Cargando: false }))

          setState((s) => ({
            ...s,
            datosPagos: Data,
            DetallePlan: true,
            DatosDetalle: tabla,
            CredID: CreditoID,
          }));
          MySwal.close();
        } else {
          setState((s) => ({
            ...s,
            datosPagos: Data,
            DetallePlan: true,
            DatosDetalle: [],
            CredID: CreditoID,
          }));
          MySwal.close();
        }
      })
      .catch(() => {
        // if (isMounted.current === true) {
        setState((s) => ({ ...s, DetallePlan: false, DatosDetalle: [] }));
        MySwal.close();
        toast.error("Error al consultar, vuelva a intentarlo");
        // }
      });
  };

  const GetAclaraciones = (DistribuidorID: number) => {
    /* setState(s => ({ ...s, Cargando: true })) */
    Funciones.FNGetAclaraciones(props.oidc, DistribuidorID)
      .then((respuesta: any) => {
        setState((s) => ({ ...s, datosIncrementos: respuesta }));

        if (respuesta != null) {
        }
      })
      .catch(() => {
        // if (isMounted.current === true) {
        setState((s) => ({
          ...s,
          Cargando: false,
          Error: true,
          Datos: [],
          optProductos: [],
        }));
        // }
      });
  };

  const FNGetInfoDistribuidor = (DistribuidorID: number) => {
    FuncionesSocias.FNGetInfDistribuidor(props.oidc, DistribuidorID)
      .then((respuesta: any) => {
        setState(s => ({ ...s, datosDist: respuesta, Cargando: false }))
      })
      .catch(() => {
        setState(s => ({ ...s, datosDist: undefined, Cargando: false }))
        toast.error("Error al consultar, vuelva a intentarlo")
      })
  }

  const FNGetSaldoDetalles = (DistribuidorID: any, ProductoID: any) => {
    SwalWarning('Aviso', 'Obteniendo Clientes.');
    setState((s) => ({ ...s, DatosClientes: [] }));
    FNGetInfoDistribuidor(DistribuidorID)
    Funciones.FNGetInfClientesProducto(props.oidc, DistribuidorID, ProductoID)
      .then((respuesta: any) => {
        if (respuesta.length > 0) {
          let tabla: any[] = []
          let Capital = 0
          let ImporteTotal = 0
          let Interes = 0
          let SaldoActual = 0
          let SaldoAtrasado = 0
          let Seguro = 0
          respuesta.forEach((element: any) => {
            let Clientes: any = {
              Capital: element.Capital,
              ClienteID: element.ClienteID,
              DiasAtraso: element.DiasAtraso,
              DistribuidorID: element.DistribuidorID,
              FechaHoraUltimoPago: element.FechaHoraUltimoPago,
              ImporteTotal: element.ImporteTotal,
              Interes: element.Interes,
              MovCli: element.MovCli,
              NombreCompleto: element.NombreCompleto,
              PagoMod: element.PagoMod,
              PagosAtrasados: element.PagosAtrasados,
              SaldoActual: element.SaldoActual,
              SaldoAtrasado: element.SaldoAtrasado,
              Seguro: element.Seguro,
            }
            Capital += element.Capital
            ImporteTotal += element.ImporteTotal
            Interes += element.Interes
            SaldoActual += element.SaldoActual
            SaldoAtrasado += element.SaldoAtrasado
            Seguro += element.Seguro
            tabla.push(Clientes)
          });
          let TotalCliente: any = {
            Capital,
            ClienteID: null,
            DiasAtraso: 0,
            DistribuidorID: 0,
            FechaHoraUltimoPago: '',
            ImporteTotal,
            Interes,
            MovCli: 0,
            NombreCompleto: 'TOTAL',
            PagoMod: 0,
            PagosAtrasados: 0,
            SaldoActual,
            SaldoAtrasado,
            Seguro
          }
          tabla.push(TotalCliente)
          setState(s => ({ ...s, /*datosDist: Data,*/ DetalleSaldos: true, DatosClientes: tabla }))
          MySwal.close();
        } else {
          setState(s => ({ ...s, /* datosDist: Data,*/ DetalleSaldos: true, DatosClientes: [] }))
          MySwal.close();
        }
      })
      .catch((error) => {
        if (isMounted.current === true) {
          setState(s => ({ ...s, DetalleSaldos: false, DatosClientes: [] }))
          MySwal.close();
          toast.error('Error al obtener los clientes')
        }
      })
  }

  const FNShowClientes = (/*Data: any,*/ DistribuidorID: any, ProductoID: any) => {
    setState(s => ({ ...s, /*datosDist: Data,*/ DetalleSaldo: true, ContratoSel: ProductoID }))
  }

  const FNGetClientes = (Data: any, DistribuidorID: number) => {
    console.log("DATOS DEL CLIENTES: ", Data);
    SwalWarning("Aviso", "Obteniendo Clientes.");
    setState((s) => ({ ...s, DatosClientes: [] }));

    Funciones.FNGetClientes(
      props.oidc,
      DistribuidorID,
      state.Filtros.ClienteID,
      Data.ProductoID
    )
      .then((respuesta: any) => {
        // console.log("respCLIENTES", respuesta)

        if (respuesta.length > 0) {
          // setState(s => ({ ...s, MultiSaldoCajaID: respuesta[0].MultisaldosCajaID }))
          let tabla: any[] = [];
          let Capital = 0;
          let ImporteTotal = 0;
          let Interes = 0;
          let SaldoActual = 0;
          let SaldoAtrasado = 0;
          let Seguro = 0;
          let PagoMod = 0;
          let ProductoID = 0;

          respuesta.forEach((element: any) => {
            // posicion = posicion + 1
            //if (cajaAnteriorID == 0) {
            let Clientes: any = {
              Capital: element.Capital,
              ClienteID: element.ClienteID,
              DiasAtraso: element.DiasAtraso,
              ProductoID: element.ProductoID,
              DistribuidorID: element.DistribuidorID,
              FechaHoraUltimoPago: element.FechaHoraUltimoPago,
              ImporteTotal: element.ImporteTotal,
              Interes: element.Interes,
              MovCli: element.MovCli,
              NombreCompleto: element.NombreCompleto,
              PagoMod: element.PagoMod,
              PagosAtrasados: element.PagosAtrasados,
              SaldoActual: element.SaldoActual,
              SaldoAtrasado: element.SaldoAtrasado,
              Seguro: element.Seguro,
              Creditos: element.Creditos,
            };

            Capital += element.Capital;
            ImporteTotal += element.ImporteTotal;
            Interes += element.Interes;
            SaldoActual += element.SaldoActual;
            SaldoAtrasado += element.SaldoAtrasado;
            Seguro += element.Seguro;
            PagoMod += element.PagoMod;

            tabla.push(Clientes);
          });

          let TotalCliente: any = {
            Capital,
            ClienteID: null,
            DiasAtraso: 0,
            ProductoID: 0,
            DistribuidorID: 0,
            FechaHoraUltimoPago: "",
            ImporteTotal,
            Interes,
            MovCli: 0,
            NombreCompleto: "TOTAL",
            PagoMod,
            PagosAtrasados: 0,
            SaldoActual,
            SaldoAtrasado,
            Seguro
          };

          tabla.push(TotalCliente);

          // setState(s => ({ ...s, Datos: tabla, Cargando: false }))

          console.log("respCLIENTES", tabla);

          setState((s) => ({
            ...s,
            datosDist: Data,
            Detalle: true,
            DatosClientes: tabla,
          }));
          MySwal.close();
        } else {
          setState((s) => ({
            ...s,
            datosDist: Data,
            Detalle: true,
            DatosClientes: [],
          }));
          MySwal.close();
        }
      })
      .catch(() => {
        // if (isMounted.current === true) {
        setState((s) => ({ ...s, Detalle: false, DatosClientes: [] }));
        MySwal.close();
        toast.error("Error al obtener los clientes");
        // }
      });
  };

  const FNGetSaldosDetalles = (DistribuidorID: any, ProductoID: any) => {
    // Distribuidor 60659 38
    console.log('Distribuidor', DistribuidorID, ProductoID);
    // SwalWarning('Aviso', 'Obteniendo Clientes.');
    setState(s => ({ ...s, /* datosDist: Data,*/  DatosClientes: [] }))
    FNGetInfoDistribuidor(DistribuidorID)
    FuncionesSocias.FNGetInfClientesProducto(props.oidc, DistribuidorID, ProductoID)
      .then((respuesta: any) => {
        if (respuesta.length > 0) {
          let tabla: any[] = []
          let Capital = 0
          let ImporteTotal = 0
          let Interes = 0
          let SaldoActual = 0
          let SaldoAtrasado = 0
          let Seguro = 0
          respuesta.forEach((element: any) => {
            let Clientes: any = {
              Capital: element.Capital,
              ClienteID: element.ClienteID,
              DiasAtraso: element.DiasAtraso,
              DistribuidorID: element.DistribuidorID,
              FechaHoraUltimoPago: element.FechaHoraUltimoPago,
              ImporteTotal: element.ImporteTotal,
              Interes: element.Interes,
              MovCli: element.MovCli,
              NombreCompleto: element.NombreCompleto,
              PagoMod: element.PagoMod,
              PagosAtrasados: element.PagosAtrasados,
              SaldoActual: element.SaldoActual,
              SaldoAtrasado: element.SaldoAtrasado,
              Seguro: element.Seguro,
            }
            Capital += element.Capital
            ImporteTotal += element.ImporteTotal
            Interes += element.Interes
            SaldoActual += element.SaldoActual
            SaldoAtrasado += element.SaldoAtrasado
            Seguro += element.Seguro
            tabla.push(Clientes)
          });
          let TotalCliente: any = {
            Capital,
            ClienteID: null,
            DiasAtraso: 0,
            DistribuidorID: 0,
            FechaHoraUltimoPago: '',
            ImporteTotal,
            Interes,
            MovCli: 0,
            NombreCompleto: 'TOTAL',
            PagoMod: 0,
            PagosAtrasados: 0,
            SaldoActual,
            SaldoAtrasado,
            Seguro
          }
          tabla.push(TotalCliente)
          // DefinirEstado(s => ({ ...s, Datos: tabla, Cargando: false }))
          setState(s => ({ ...s, /*datosDist: Data,*/ Detalle: true, DatosClientes: tabla }))
          MySwal.close();
        } else {
          setState(s => ({ ...s, /* datosDist: Data,*/ Detalle: true, DatosClientes: [] }))
          MySwal.close();
        }
        // console.log('respuesta: ', respuesta)
        // let distribuidor = Data.find(Dato => Dato.DistribuidorID == DistribuidorID)
        // console.log('distribuidor: ', distribuidor)
        // DefinirEstado(s => ({ ...s, datosDist: Data, Detalle: true, DatosClientes: respuesta }))
        // if (isMounted.current === true) {
        //     DefinirEstado(s => ({ ...s, Detalle: true, DatosClientes: respuesta }))
        // }
      })
      .catch((error) => {
        if (isMounted.current === true) {
          setState(s => ({ ...s, Detalle: false, DatosClientes: [] }))
          MySwal.close();
          toast.error('Error al obtener los clientes')
        }
      })
  }

  // const FNGetClientes = (Data: any, DistribuidorID: number) => {
  //   console.log("DATOS DEL CLIENTES: ", Data);
  //   SwalWarning("Aviso", "Obteniendo Clientes.");
  //   setState((s) => ({ ...s, DatosClientes: [] }));

  //   Funciones.FNGetClientes(
  //     props.oidc,
  //     DistribuidorID,
  //     state.Filtros.ClienteID,
  //     Data.ProductoID
  //   )
  //     .then((respuesta: any) => {
  //       // console.log("respCLIENTES", respuesta)

  //       if (respuesta.length > 0) {
  //         // setState(s => ({ ...s, MultiSaldoCajaID: respuesta[0].MultisaldosCajaID }))
  //         let tabla: any[] = [];
  //         let Capital = 0;
  //         let ImporteTotal = 0;
  //         let Interes = 0;
  //         let SaldoActual = 0;
  //         let SaldoAtrasado = 0;
  //         let Seguro = 0;
  //         let PagoMod = 0;

  //         respuesta.forEach((element: any) => {
  //           // posicion = posicion + 1
  //           //if (cajaAnteriorID == 0) {
  //           let Clientes: any = {
  //             Capital: element.Capital,
  //             ClienteID: element.ClienteID,
  //             DiasAtraso: element.DiasAtraso,
  //             ProductoID: element.ProductoID,
  //             DistribuidorID: element.DistribuidorID,
  //             FechaHoraUltimoPago: element.FechaHoraUltimoPago,
  //             ImporteTotal: element.ImporteTotal,
  //             Interes: element.Interes,
  //             MovCli: element.MovCli,
  //             NombreCompleto: element.NombreCompleto,
  //             PagoMod: element.PagoMod,
  //             PagosAtrasados: element.PagosAtrasados,
  //             SaldoActual: element.SaldoActual,
  //             SaldoAtrasado: element.SaldoAtrasado,
  //             Seguro: element.Seguro,
  //             Creditos: element.Creditos,
  //           };

  //           Capital += element.Capital;
  //           ImporteTotal += element.ImporteTotal;
  //           Interes += element.Interes;
  //           SaldoActual += element.SaldoActual;
  //           SaldoAtrasado += element.SaldoAtrasado;
  //           Seguro += element.Seguro;
  //           PagoMod += element.PagoMod;

  //           tabla.push(Clientes);
  //         });

  //         let TotalCliente: any = {
  //           Capital,
  //           ClienteID: null,
  //           DiasAtraso: 0,
  //           ProductoID: 0,
  //           DistribuidorID: 0,
  //           FechaHoraUltimoPago: "",
  //           ImporteTotal,
  //           Interes,
  //           MovCli: 0,
  //           NombreCompleto: "TOTAL",
  //           PagoMod,
  //           PagosAtrasados: 0,
  //           SaldoActual,
  //           SaldoAtrasado,
  //           Seguro,
  //         };

  //         tabla.push(TotalCliente);

  //         // setState(s => ({ ...s, Datos: tabla, Cargando: false }))

  //         console.log("respCLIENTES", tabla);

  //         setState((s) => ({
  //           ...s,
  //           datosDist: Data,
  //           Detalle: true,
  //           DatosClientes: tabla,
  //         }));
  //         MySwal.close();
  //       } else {
  //         setState((s) => ({
  //           ...s,
  //           datosDist: Data,
  //           Detalle: true,
  //           DatosClientes: [],
  //         }));
  //         MySwal.close();
  //       }
  //     })
  //     .catch(() => {
  //       // if (isMounted.current === true) {
  //       setState((s) => ({ ...s, Detalle: false, DatosClientes: [] }));
  //       MySwal.close();
  //       toast.error("Error al obtener los clientes");
  //       // }
  //     });
  // };

  const FNGCreditosCliente = (
    Data: any,
    DistribuidorID: number,
    ClienteID: number,
    ProductoID: number
  ) => {
    SwalWarning("Aviso", "Obteniendo créditos.");

    setState((s) => ({ ...s, DatosCreditos: [] }));
    Funciones.FNGCreditosCliente(
      props.oidc,
      DistribuidorID,
      ClienteID,
      ProductoID
    )
      .then((respuesta: any) => {
        if (respuesta.length > 0) {
          // setState(s => ({ ...s, MultiSaldoCajaID: respuesta[0].MultisaldosCajaID }))
          let tabla: any[] = [];
          let Capital = 0;
          let ImporteTotal = 0;
          let Abonos = 0;
          let Interes = 0;
          let SaldoActual = 0;
          let SaldoAtrasado = 0;
          let Seguro = 0;
          let pagoModa = 0;

          respuesta.forEach((element: any) => {
            // posicion = posicion + 1
            //if (cajaAnteriorID == 0) {
            let Creditos: any = {
              CreditoID: element.CreditoID,
              Capital: element.Capital,
              ImporteTotal: element.ImporteTotal,
              Abonos: element.Abonos,
              SaldoActual: element.SaldoActual,
              SaldoAtrasado: element.SaldoAtrasado,
              DiasAtraso: element.DiasAtraso,
              pagoModa: element.pagoModa,
              FechaHoraRegistro: element.FechaHoraRegistro,
              EstatusID: element.EstatusID,
              EstatusNombre: element.EstatusNombre,
              MovimientoID: element.MovimientoID,
              Interes: element.Interes,
              Seguro: element.Seguro,
              Color: element.Color,
            };

            Capital += element.Capital;
            ImporteTotal += element.ImporteTotal;
            Interes += element.Interes;
            SaldoActual += element.SaldoActual;
            SaldoAtrasado += element.SaldoAtrasado;
            Seguro += element.Seguro;
            Abonos += element.Abonos;
            pagoModa += element.pagoModa;

            tabla.push(Creditos);
          });

          let TotalCreditos: any = {
            CreditoID: null,
            Capital,
            ImporteTotal,
            Abonos,
            SaldoActual,
            pagoModa,
            SaldoAtrasado,
            DiasAtraso: 0,
            FechaHoraRegistro: "",
            EstatusID: "",
            EstatusNombre: "",
            MovimientoID: 0,
            Interes,
            Seguro,
            Color: "",
          };

          tabla.push(TotalCreditos);

          setState((s) => ({
            ...s,
            datosCliente: Data,
            DetalleCredito: true,
            DatosCreditos: tabla,
          }));
          MySwal.close();
        } else {
          setState((s) => ({
            ...s,
            datosCliente: Data,
            DetalleCredito: true,
            DatosCreditos: [],
          }));
          MySwal.close();
        }
      })
      .catch(() => {
        // if (isMounted.current === true) {
        setState((s) => ({ ...s, DetalleCredito: false, DatosCreditos: [] }));
        setShowClientePerfil(false);
        MySwal.close();
        toast.error("Error al obtener los creditos del cliente");
        // }
      });
  };

  const DirCols: //= React.useMemo(() => {
    // let colRet:
    IDataTableColumn[] = [
      {
        name: "Ver",
        sortable: false,
        center: true,
        wrap: true,
        cell: (props) =>
          props.DirectorID != null ? (
            state.CargandoProd ? (
              state.DirectorID == props.DirectorID ? (
                <div className="d-flex justify-content-center">
                  {/* <div className="spinner-border" role="status"> */}
                  <FcSynchronize
                    className="spinner-border spinner-border-sm"
                    size={iconSize}
                  ></FcSynchronize>
                  {/* </div> */}
                </div>
              ) : (
                <FaRegCircle size={iconSize}></FaRegCircle>
              )
            ) : (
              <button
                data-tip
                data-for={`DetailTooltipDirector${props.DirectorID}`}
                className="asstext"
                type={"button"}
                onClick={() => {
                  setState((s) => ({ ...s, DirectorID: props.DirectorID }));
                }}
              >
                {state.DirectorID == props.DirectorID && (
                  <FcOk size={iconSize}></FcOk>
                )}
                {state.DirectorID != props.DirectorID && (
                  <FaRegCircle size={iconSize}></FaRegCircle>
                )}
                <ReactTooltip
                  id={`DetailTooltipDirector${props.DirectorID}`}
                  type="info"
                  effect="solid"
                  clickable
                  globalEventOff="click"
                >
                  Ver Productos
                </ReactTooltip>
              </button>
            )
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.DirectorID == null,
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
        name: "Id",
        selector: "DirectorID",
        wrap: true,
        sortable: false,
        width: "70px",
        cell: (props) =>
          props.DirectorID != null ? (
            <span>{props.DirectorID}</span>
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.DirectorID == null,
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
        name: "Director",
        selector: "NombreDirector",
        sortable: false,
        width: "140px",
        wrap: true,
        conditionalCellStyles: [
          {
            when: (row) => row.DirectorID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
        cell: (props) =>
          props.DirectorID != null ? (
            <>
              <span
                style={{
                  width: "140px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
                data-tip
                data-for={`DirectorTooltip${props.DirectorID}`}
              >
                {props.NombreDirector}{" "}
              </span>
              <ReactTooltip
                id={`DirectorTooltip${props.DirectorID}`}
                type="info"
                effect="solid"
                clickable
                globalEventOff="click"
              >
                {props.NombreDirector}
              </ReactTooltip>
            </>
          ) : (
            <span>{props.NombreDirector}</span>
          ),
      },
      {
        name: "Límite",
        selector: "LimiteDeCredito",
        sortable: false,
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.LimiteDeCredito),
        conditionalCellStyles: [
          {
            when: (row) => row.DirectorID == null,
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
        name: "Cartera",
        selector: "Cartera",
        sortable: false,
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.Cartera),
        style: {
          fontWeight: "bold",
        },
        conditionalCellStyles: [
          {
            when: (row) => row.DirectorID == null,
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
        name: "Colocado/Capital",
        selector: "Capital",
        sortable: false,
        wrap: true,
        width: "130px",
        center: true,
        format: (row) => formatter.format(row.Capital),
        conditionalCellStyles: [
          {
            when: (row) => row.DirectorID == null,
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
        name: "Disponible",
        selector: "Disponible",
        wrap: true,
        width: "120px",
        center: true,
        sortable: false,
        format: (row) => formatter.format(row.Disponible),
        // style: {
        //     fontWeight: 'bold',
        // },
        conditionalCellStyles: [
          {
            when: (row) => row.DirectorID == null,
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
        wrap: true,
        format: (row) => formatter.format(row.SaldoAtrasado),
        conditionalCellStyles: [
          {
            when: (row) => row.SaldoAtrasado > 0,
            style: {
              color: "red",
            },
          },
          {
            when: (row) => row.DirectorID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",
              color: "red",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Créditos Atrasados",
        selector: "CreditosAtrasados",
        center: true,
        wrap: true,
        sortable: false,
        conditionalCellStyles: [
          {
            when: (row) => row.CreditosAtrasados > 0,
            style: {
              color: "red",
            },
          },
          {
            when: (row) => row.DirectorID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",
              color: "red",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Capital Liquidado",
        selector: "CapLiquidado",
        sortable: false,
        center: true,
        wrap: true,
        format: (row) => formatter.format(row.CapLiquidado),
        conditionalCellStyles: [
          {
            when: (row) => row.DirectorID == null,
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
        name: "Cartera Riesgo",
        selector: "CarteraEnRiesgo",
        sortable: false,
        center: true,
        wrap: true,
        format: (row) => formatter.format(row.CarteraEnRiesgo),
        // style: {
        //     fontWeight: 'bold',
        // },
        conditionalCellStyles: [
          {
            when: (row) => row.DirectorID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      // {
      //     name: 'Recuperado', selector: 'Recuperado', sortable: false, format: row => formatter.format(row.Recuperado),
      //     // style: {
      //     //     fontWeight: 'bold',
      //     // },
      //     conditionalCellStyles: [
      //         {
      //             when: row => row.DirectorID == null,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ],
      // },
    ];
  //     return colRet
  // }, [])

  const ProdCols: //= React.useMemo(() => {
    // let colRet:
    IDataTableColumn[] = [
      {
        name: "Ver",
        sortable: false,
        center: true,
        wrap: true,
        cell: (props) =>
          props.ProductoID != null ? (
            state.CargandoSuc ? (
              state.ProductoID == props.ProductoID ? (
                <FcSynchronize
                  className="spinner-border spinner-border-sm"
                  size={iconSize}
                ></FcSynchronize>
              ) : (
                <FaRegCircle size={iconSize}></FaRegCircle>
              )
            ) : (
              <button
                data-tip
                data-for={`DetailTooltipProductos${props.ProductoID}`}
                className="asstext"
                type={"button"}
                onClick={() => {
                  setState((s) => ({ ...s, ProductoID: props.ProductoID }));
                }}
              >
                {state.ProductoID == props.ProductoID && (
                  <FcOk size={iconSize}></FcOk>
                )}
                {state.ProductoID != props.ProductoID && (
                  <FaRegCircle></FaRegCircle>
                )}
                <ReactTooltip
                  id={`DetailTooltipProductos${props.ProductoID}`}
                  type="info"
                  effect="solid"
                  clickable
                  globalEventOff="click"
                >
                  Ver Sucursales
                </ReactTooltip>
              </button>
            )
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.ProductoID == null,
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
        name: "Id",
        selector: "ProductoID",
        sortable: false,
        width: "70px",
        cell: (props) =>
          props.ProductoID != null ? (
            <span>{props.ProductoID}</span>
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.ProductoID == null,
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
        name: "Producto",
        selector: "Producto",
        sortable: false /*width: '180px'*/,
        conditionalCellStyles: [
          {
            when: (row) => row.ProductoID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
        cell: (props) =>
          props.ProductoID != null ? (
            <>
              <span
                style={{
                  width: "140px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
                data-tip
                data-for={`ProductoTooltip${props.ProductoID}`}
              >
                {props.Producto}{" "}
              </span>
              <ReactTooltip
                id={`ProductoTooltip${props.ProductoID}`}
                type="info"
                effect="solid"
                clickable
                globalEventOff="click"
              >
                {props.Producto}
              </ReactTooltip>
            </>
          ) : (
            <span>{props.Producto}</span>
          ),
      },
      {
        name: "Cartera",
        selector: "Cartera",
        sortable: false,
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.Cartera),
        style: {
          fontWeight: "bold",
        },
        conditionalCellStyles: [
          {
            when: (row) => row.ProductoID == null,
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
        name: "Límite",
        selector: "LimiteDeCredito",
        sortable: false,
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.LimiteDeCredito),
        conditionalCellStyles: [
          {
            when: (row) => row.ProductoID == null,
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
        name: "Colocado/Capital",
        selector: "Colocado",
        sortable: false,
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.Colocado),
        conditionalCellStyles: [
          {
            when: (row) => row.ProductoID == null,
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
        name: "Disponible",
        selector: "Disponible",
        sortable: false,
        wrap: true,
        center: true,
        width: "120px",
        format: (row) => formatter.format(row.Disponible),
        // style: {
        //     fontWeight: 'bold',
        // },
        conditionalCellStyles: [
          {
            when: (row) => row.ProductoID == null,
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
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.SaldoAtrasado),
        conditionalCellStyles: [
          {
            when: (row) => row.SaldoAtrasado > 0,
            style: {
              color: "red",
            },
          },
          {
            when: (row) => row.ProductoID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",
              color: "red",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Créditos Atrasados",
        selector: "CreditosAtrasados",
        sortable: false,
        wrap: true,
        center: true,
        conditionalCellStyles: [
          {
            when: (row) => row.CreditosAtrasados > 0,
            style: {
              color: "red",
            },
          },
          {
            when: (row) => row.ProductoID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",
              color: "red",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      // {
      //     name: 'Capital', selector: 'Capital', sortable: false, wrap: true, center: true, format: row => formatter.format(row.Capital), conditionalCellStyles: [
      //         {
      //             when: row => row.ProductoID == null,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ],
      // },
      {
        name: "Capital Liquidado",
        selector: "CapLiquidado",
        sortable: false,
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.CapLiquidado),
        conditionalCellStyles: [
          {
            when: (row) => row.ProductoID == null,
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
        name: "Cartera Riesgo",
        selector: "CarteraEnRiesgo",
        sortable: false,
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.CarteraEnRiesgo),
        style: {
          fontWeight: "bold",
        },
        conditionalCellStyles: [
          {
            when: (row) => row.ProductoID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      // {
      //     name: 'Recuperado', selector: 'Recuperado', sortable: false, format: row => formatter.format(row.Recuperado),
      //     // style: {
      //     //     fontWeight: 'bold',
      //     // },
      //     conditionalCellStyles: [
      //         {
      //             when: row => row.ProductoID == null,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ],
      // },
    ];

  const SucCols: //= React.useMemo(() => {
    // let colRet:
    IDataTableColumn[] = [
      {
        name: "Ver",
        sortable: false,
        center: true,
        wrap: true,
        cell: (props) =>
          props.SucursalID != null ? (
            state.CargandoGpo ? (
              state.SucursalID == props.SucursalID ? (
                <FcSynchronize
                  className="spinner-border spinner-border-sm"
                  size={iconSize}
                ></FcSynchronize>
              ) : (
                <FaRegCircle size={iconSize}></FaRegCircle>
              )
            ) : (
              <button
                data-tip
                data-for={`DetailTooltipSucursales${props.SucursalID}`}
                className="asstext"
                type={"button"}
                onClick={() => {
                  setState((s) => ({ ...s, SucursalID: props.SucursalID }));
                }}
              >
                {state.SucursalID == props.SucursalID && (
                  <FcOk size={iconSize}></FcOk>
                )}
                {state.SucursalID != props.SucursalID && (
                  <FaRegCircle></FaRegCircle>
                )}
                <ReactTooltip
                  id={`DetailTooltipSucursales${props.SucursalID}`}
                  type="info"
                  effect="solid"
                  clickable
                  globalEventOff="click"
                >
                  Ver Grupos
                </ReactTooltip>
              </button>
            )
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.SucursalID == null,
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
        name: "Id",
        selector: "SucursalID",
        sortable: false,
        width: "70px",
        cell: (props) =>
          props.SucursalID != null ? (
            <span>{props.SucursalID}</span>
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.SucursalID == null,
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
        name: "Sucursal",
        selector: "Nombre",
        sortable: false,
        wrap: true,
        width: "140px",
        conditionalCellStyles: [
          {
            when: (row) => row.SucursalID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
        cell: (props) =>
          props.SucursalID != null ? (
            <>
              <span
                style={{
                  width: "140px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
                data-tip
                data-for={`NombreSucursalTooltip${props.SucursalID}`}
              >
                {props.Nombre}{" "}
              </span>
              <ReactTooltip
                id={`NombreSucursalTooltip${props.SucursalID}`}
                type="info"
                effect="solid"
                clickable
                globalEventOff="click"
              >
                {props.Nombre}
              </ReactTooltip>
            </>
          ) : (
            <span>{props.Nombre}</span>
          ),
      },
      {
        name: "Cartera",
        selector: "Cartera",
        sortable: false,
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.Cartera),
        style: {
          fontWeight: "bold",
        },
        conditionalCellStyles: [
          {
            when: (row) => row.SucursalID == null,
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
        name: "Límite",
        selector: "LimiteDeCredito",
        sortable: false,
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.LimiteDeCredito),
        conditionalCellStyles: [
          {
            when: (row) => row.SucursalID == null,
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
        name: "Colocado/Capital",
        selector: "Colocado",
        sortable: false,
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.Colocado),
        conditionalCellStyles: [
          {
            when: (row) => row.SucursalID == null,
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
        name: "Disponible",
        selector: "Disponible",
        sortable: false,
        wrap: true,
        center: true,
        width: "120px",
        format: (row) => formatter.format(row.Disponible),
        // style: {
        //     fontWeight: 'bold',
        // },
        conditionalCellStyles: [
          {
            when: (row) => row.SucursalID == null,
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
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.SaldoAtrasado),
        conditionalCellStyles: [
          {
            when: (row) => row.SaldoAtrasado > 0,
            style: {
              color: "red",
            },
          },
          {
            when: (row) => row.SucursalID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",
              color: "red",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Créditos Atrasados",
        selector: "CreditosAtrasados",
        sortable: false,
        wrap: true,
        center: true,
        conditionalCellStyles: [
          {
            when: (row) => row.CreditosAtrasados > 0,
            style: {
              color: "red",
            },
          },
          {
            when: (row) => row.SucursalID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",
              color: "red",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      // {
      //     name: 'Capital', selector: 'Capital', sortable: false, wrap: true, center: true, format: row => formatter.format(row.Capital), conditionalCellStyles: [
      //         {
      //             when: row => row.SucursalID == null,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ],
      // },
      {
        name: "Capital Liquidado",
        selector: "CapLiquidado",
        sortable: false,
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.CapLiquidado),
        conditionalCellStyles: [
          {
            when: (row) => row.SucursalID == null,
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
        name: "Cartera Riesgo",
        selector: "CarteraEnRiesgo",
        sortable: false,
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.CarteraEnRiesgo),
        style: {
          fontWeight: "bold",
        },
        conditionalCellStyles: [
          {
            when: (row) => row.SucursalID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      // {
      //     name: 'Recuperado', selector: 'Recuperado', sortable: false, format: row => formatter.format(row.Recuperado),
      //     // style: {
      //     //     fontWeight: 'bold',
      //     // },
      //     conditionalCellStyles: [
      //         {
      //             when: row => row.SucursalID == null,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ],
      // },
    ];

  const GpoCols: //= React.useMemo(() => {
    // let colRet:
    IDataTableColumn[] = [
      // {
      //     name: 'Ver',
      //     sortable: false,
      //     center: true,
      //     wrap: true,
      //     cell: (props) => props.GrupoID != 0 ?
      //         <button data-tip data-for={`DetailTooltipGrupos${props.GrupoID}`} className="asstext" type={"button"} onClick={() => {
      //             // FNGetDistribuidores(props.DirectorID, props.ProductoID, props.SucursalID, props.GrupoID, 4)
      //         }}>

      //             {state.GrupoID == props.GrupoID && <FcOk></FcOk>}
      //             {state.GrupoID != props.GrupoID && <FaRegCircle></FaRegCircle>}
      //             <ReactTooltip
      //                 id={`DetailTooltipGrupos${props.GrupoID}`}
      //                 type="info"
      //                 effect="solid"
      //                 clickable
      //                 globalEventOff="click"
      //             >
      //                 Mostrar
      //             </ReactTooltip>
      //         </button> : <span></span>,
      //     conditionalCellStyles: [
      //         {
      //             when: row => row.GrupoID == 0,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ]
      // },
      // {
      //     name: 'Sucursal', selector: 'Nombre', sortable: true, /*width: '180px'*/
      //     conditionalCellStyles: [
      //         {
      //             when: row => row.GrupoID == 0,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ]
      // },
      {
        name: "Grupo",
        selector: "GrupoID",
        sortable: false,
        width: "70px",
        cell: (props) =>
          props.GrupoID != null ? (
            <div className="d-flex flex-row-reverse">
              {props.ClasificadorGrupoID == 1 && <span>{props.Descripcion}</span>}
              {props.ClasificadorGrupoID == 2 && <span>{props.GrupoID}</span>}
            </div>
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.GrupoID == null,
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
        wrap: true,
        width: "140px",
        cell: (props) =>
          // <div style={{ width: '110px' }}>
          props.GrupoID != null ? (
            <>
              <span
                style={{
                  width: "140px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
                data-tip
                data-for={`NombreCoodinadorTooltip${props.GrupoID}`}
              >
                {props.Coordinador}{" "}
              </span>
              <ReactTooltip
                id={`NombreCoodinadorTooltip${props.GrupoID}`}
                type="info"
                effect="solid"
                clickable
                globalEventOff="click"
              >
                {props.Coordinador}
              </ReactTooltip>
            </>
          ) : (
            <span>{props.Coordinador}</span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.GrupoID == null,
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
        name: "Cartera",
        selector: "Cartera",
        sortable: false,
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.Cartera),
        style: {
          fontWeight: "bold",
        },
        conditionalCellStyles: [
          {
            when: (row) => row.GrupoID == null,
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
        name: "Límite",
        selector: "LimiteDeCredito",
        sortable: false,
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.LimiteDeCredito),
        conditionalCellStyles: [
          {
            when: (row) => row.GrupoID == null,
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
        name: "Colocado/Capital",
        selector: "Colocado",
        sortable: false,
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.Colocado),
        conditionalCellStyles: [
          {
            when: (row) => row.GrupoID == null,
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
        name: "Disponible",
        selector: "Disponible",
        sortable: false,
        wrap: true,
        center: true,
        width: "120px",
        format: (row) => formatter.format(row.Disponible),
        // style: {
        //     fontWeight: 'bold',
        // },
        conditionalCellStyles: [
          {
            when: (row) => row.GrupoID == null,
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
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.SaldoAtrasado),
        conditionalCellStyles: [
          {
            when: (row) => row.SaldoAtrasado > 0,
            style: {
              color: "red",
            },
          },
          {
            when: (row) => row.GrupoID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",
              color: "red",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Créditos Atrasados",
        selector: "CreditosAtrasados",
        wrap: true,
        center: true,
        sortable: false,
        conditionalCellStyles: [
          {
            when: (row) => row.CreditosAtrasados > 0,
            style: {
              color: "red",
            },
          },
          {
            when: (row) => row.GrupoID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",
              color: "red",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      // {
      //     name: 'Capital', selector: 'Capital', sortable: false, wrap: true, center: true, format: row => formatter.format(row.Capital), conditionalCellStyles: [
      //         {
      //             when: row => row.GrupoID == null,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ],
      // },
      {
        name: "Capital Liquidado",
        selector: "CapLiquidado",
        sortable: false,
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.CapLiquidado),
        conditionalCellStyles: [
          {
            when: (row) => row.GrupoID == null,
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
        name: "Cartera Riesgo",
        selector: "CarteraEnRiesgo",
        sortable: false,
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.CarteraEnRiesgo),
        style: {
          fontWeight: "bold",
        },
        conditionalCellStyles: [
          {
            when: (row) => row.GrupoID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      // {
      //     name: 'Recuperado', selector: 'Recuperado', sortable: false, format: row => formatter.format(row.Recuperado),
      //     // style: {
      //     //     fontWeight: 'bold',
      //     // },
      //     conditionalCellStyles: [
      //         {
      //             when: row => row.GrupoID == null,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ],
      // },
    ];

  const DistCols: //= React.useMemo(() => {
    // let colRet:
    IDataTableColumn[] = [
      // {
      //     name: 'Ver',
      //     sortable: false,
      //     center: true,
      //     wrap: true,
      //     cell: (props) => props.DistribuidorID != 0 ?
      //         <button data-tip data-for={`DetailTooltipGrupos${props.DistribuidorID}`} className="asstext" type={"button"} onClick={() => {
      //             // FNGetDistribuidores(props.DirectorID, props.ProductoID, props.SucursalID, props.DistribuidorID, 4)
      //         }}>

      //             {state.DistribuidorID == props.DistribuidorID && <FcOk></FcOk>}
      //             {state.DistribuidorID != props.DistribuidorID && <FaRegCircle></FaRegCircle>}
      //             <ReactTooltip
      //                 id={`DetailTooltipGrupos${props.DistribuidorID}`}
      //                 type="info"
      //                 effect="solid"
      //                 clickable
      //                 globalEventOff="click"
      //             >
      //                 Mostrar
      //             </ReactTooltip>
      //         </button> : <span></span>,
      //     conditionalCellStyles: [
      //         {
      //             when: row => row.DistribuidorID == 0,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ]
      // },
      {
        name: "Id",
        selector: "DistribuidorID",
        sortable: false,
        width: "90px",
        cell: (props) =>
          props.DistribuidorID != null ? (
            <span>{props.DistribuidorID}</span>
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.DistribuidorID == null,
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
        name: `${DescripcionDistribuidor(1)}`,
        selector: "NombreCompleto",
        sortable: false,
        width: "130px",
        wrap: true,
        conditionalCellStyles: [
          {
            when: (row) => row.DistribuidorID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
        cell: (props) =>
          // <div style={{ width: '110px' }}>
          props.DistribuidorID != null ? (
            <>
              {/* <label data-tip data-for={`NombreClienteTooltip${props.DistribuidorID}`}> {props.NombreCompleto} </label> */}
              <span
                style={{
                  width: "130px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
                data-tip
                data-for={`NombreDistTooltip${props.DistribuidorID}`}
              >
                {props.NombreCompleto}{" "}
              </span>
              <ReactTooltip
                id={`NombreDistTooltip${props.DistribuidorID}`}
                type="info"
                effect="solid"
                clickable
                globalEventOff="click"
              >
                {props.NombreCompleto}
              </ReactTooltip>
            </>
          ) : (
            <span>{props.NombreCompleto}</span>
          ),
      },
      {
        name: "Cartera",
        selector: "Cartera",
        sortable: false,
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.Cartera),
        style: {
          fontWeight: "bold",
        },
        conditionalCellStyles: [
          {
            when: (row) => row.DistribuidorID == null,
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
        name: "Límite",
        selector: "LimiteDeCredito",
        sortable: false,
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.LimiteDeCredito),
        conditionalCellStyles: [
          {
            when: (row) => row.DistribuidorID == null,
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
        name: "Colocado/Capital",
        selector: "Colocado",
        sortable: false,
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.Colocado),
        conditionalCellStyles: [
          {
            when: (row) => row.DistribuidorID == null,
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
        name: "Disponible",
        selector: "Disponible",
        sortable: false,
        wrap: true,
        center: true,
        width: "120px",
        format: (row) => formatter.format(row.Disponible),
        // style: {
        //     fontWeight: 'bold',
        // },
        conditionalCellStyles: [
          {
            when: (row) => row.DistribuidorID == null,
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
        width: "100px",
        selector: "SaldoAtrasado",
        sortable: false,
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.SaldoAtrasado),
        conditionalCellStyles: [
          {
            when: (row) => row.SaldoAtrasado > 0,
            style: {
              color: "red",
            },
          },
          {
            when: (row) => row.DistribuidorID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",
              color: "red",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Crédito Atrasado",
        width: "100px",
        selector: "CreditosAtrasados",
        sortable: false,
        wrap: true,
        center: true,
        conditionalCellStyles: [
          {
            when: (row) => row.CreditosAtrasados > 0,
            style: {
              color: "red",
            },
          },
          {
            when: (row) => row.DistribuidorID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",
              color: "red",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      // {
      //     name: 'Capital', selector: 'Capital', sortable: false, wrap: true, center: true, format: row => formatter.format(row.Capital), conditionalCellStyles: [
      //         {
      //             when: row => row.DistribuidorID == null,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ],
      // },
      {
        name: "Capital Liquidado",
        selector: "CapLiquidado",
        sortable: false,
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.CapLiquidado),
        conditionalCellStyles: [
          {
            when: (row) => row.DistribuidorID == null,
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
        name: "Cartera Riesgo",
        selector: "CarteraEnRiesgo",
        sortable: false,
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.CarteraEnRiesgo),
        style: {
          fontWeight: "bold",
        },
        conditionalCellStyles: [
          {
            when: (row) => row.DistribuidorID == null,
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
        name: "Pagado Corte",
        selector: "Recuperado",
        sortable: false,
        wrap: true,
        center: true,
        format: (row) => formatter.format(row.Recuperado),
        // style: {
        //     fontWeight: 'bold',
        // },
        conditionalCellStyles: [
          {
            when: (row) => row.DistribuidorID == null,
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
        name: "Cortes Atrasados",
        width: "100px",
        selector: "CortesAtrasados",
        wrap: true,
        center: true,
        sortable: false,
        conditionalCellStyles: [
          {
            when: (row) => row.CortesAtrasados > 0,
            style: {
              color: "red",
            },
          },
          {
            when: (row) => row.DistribuidorID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",
              color: "red",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Clientes",
        sortable: false,
        wrap: true,
        center: true,
        conditionalCellStyles: [
          {
            when: (row) => row.DistribuidorID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
        cell: (data) =>
          data.DistribuidorID != null ? (
            <div
              style={{ width: "25%", overflowX: "auto", whiteSpace: "nowrap" }}
            >

              {console.log(data, "data clientes")}
              <button
                data-tip
                data-for={`DetalleDvTooltip${data.DistribuidorID}`}
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
                  FNGetClientes(data, data.DistribuidorID);
                  GetAclaraciones(data.DistribuidorID);
                }}
              >
                <FaEye />
              </button>
              <ReactTooltip
                id={`DetalleDvTooltip${data.DistribuidorID}`}
                type="info"
                effect="solid"
                clickable
                globalEventOff="click"
              >
                Ver Clientes
              </ReactTooltip>
            </div>
          ) : (
            <span></span>
          ),
      },

      //Boton ver detalles socia
      {
        name: "Detalles Socia",
        sortable: false,
        wrap: true,
        center: true,
        width: "100px",
        cell: (data) =>
          data.DistribuidorID != null ? (
            <div
              style={{ width: "25%", overflowX: "auto", whiteSpace: "nowrap" }}
            >
              {/* {console.log('ID SOCIA: ', data.DistribuidorID)}
                        {console.log('DATOS DE LA SOCIA: ', data)} */}
              <button
                data-tip
                data-for={`3DetalleDvTooltip${data.DistribuidorID}`}
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
                onClick={async () => {
                  state.DistribuidorID = data.DistribuidorID;
                  setState((e) => ({
                    ...e,
                    Datos3: {
                      Persona: undefined,
                      Empleos: [],
                      Direcciones: [],
                      Documentos: {},
                      Cliente: undefined,
                    },
                    Cargando: true,
                    Error: false,
                  }));

                  let res = await FnPersona.FNObtenerPersona(
                    props.oidc,
                    data.DistribuidorID
                  );
                  console.log(
                    "OBTENER PERSONA, DIRECCIONES, EMPLEOS, CREDITOS: ",
                    res
                  );

                  setState((e) => ({
                    ...e,
                    Datos3: {
                      Persona: res.persona,
                      Direcciones: res.direcciones,
                      Empleos: res.empleos,
                      Creditos: res.creditos,
                      Documentos: res.documentos,
                    },
                    Cargando: false,
                    Error: false,
                  }));
                  ConsultarDatos();
                  setShowSociaPerfil(true);
                }}
              >
                <FaUser />
              </button>
              <ReactTooltip
                id={`3DetalleDvTooltip${data.DistribuidorID}`}
                type="info"
                effect="solid"
                clickable
                globalEventOff="click"
              >
                Ver Detalles Socia
              </ReactTooltip>
            </div>
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.DistribuidorID == null,
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

  const ExpandableComponent = (DATA: any) => {

    if (DATA.data !== undefined) {


      const styles = {
        div: {
          "margin-left": "3%",
          "margin-top": "5px",
          "margin-bottom": "15px",
          padding: "15px",
          "border-left-width": "8px",
          "border-left-color": "#BABABA",
          "border-left-style": "inset",
          "border-top-width": "8px",
          "border-top-color": "#BABABA",
          "border-top-style": "inset",
        },
      };
      let Total;
      if (DATA.data.Cartera > 0) {
        Total =
          DATA.data.Calidad < 0 ? DATA.data.Calidad * -1 : DATA.data.Calidad;
      } else {
        Total = (DATA.data.CarteraEnRiesgo / 1) * 100 - 100;

        if (Total < 0) {
          Total = Total * -1;
        }
      }
      return (
        <div
          style={{
            marginLeft: "3%",
            marginTop: "5px",
            marginBottom: "15px",
            padding: "15px",
            borderLeftWidth: "8px",
            borderLeftColor: "#BABABA",
            borderLeftStyle: "inset",
            borderTopWidth: "8px",
            borderTopColor: "#BABABA",
            borderTopStyle: "inset",
          }}
        >
          {" "}
          <strong>
            {DescripcionDistribuidor(2)}({DATA.data.Detalle.length}) -{" "}
            {Total >= 85 ? (
              <strong style={{ color: "green", fontSize: "14px" }}>
                Calidad: {parseFloat(Total.toFixed(2))}%
              </strong>
            ) : Total >= 50 ? (
              <strong style={{ color: "orangered", fontSize: "14px" }}>
                Calidad: {parseFloat(Total.toFixed(2))}%
              </strong>
            ) : (
              <strong style={{ color: "red", fontSize: "14px" }}>
                Calidad: {parseFloat(Total.toFixed(2))}%
              </strong>
            )}
          </strong>
          <DataTable
            // conditionalRowStyles={[
            //     {
            //         when: row => row.estado === "Buena",
            //         style: {
            //             backgroundColor: '#b8f3b8',
            //         },
            //     },
            //     {
            //         when: row => row.estado === "Regular",
            //         style: {
            //             backgroundColor: '#FDFF8F',

            //         },
            //     },
            //     {
            //         when: row => row.estado === "Mala",
            //         style: {
            //             backgroundColor: '#ff000052',

            //         },
            //     }
            // ]}
            // subHeader
            // subHeaderComponent=
            // {
            //     <div className="row">
            //         <div className="col-sm-12">
            //             <div className="input-group mb-3">
            //                 <input type="text" className="form-control" placeholder={`Buscar ${DescripcionDistribuidor(1)}`} value={state.FiltroDist} onChange={e => setState(s => ({ ...s, FiltroDist: e.target.value }))} />
            //                 <span className="input-group-text"><FaSearch /> </span>
            //             </div>
            //         </div>
            //     </div>
            // }
            data={DATA.data.Detalle} //{state.DatosMostrarDist}
            striped
            pagination
            paginationPerPage={10}
            dense
            noHeader
            responsive
            keyField={"DistribuidorID"}
            //defaultSortField={"DistribuidorID"}
            //defaultSortAsc={true}
            columns={DistCols}
            theme="solarized"
          // expandableRows={true}
          // onRowExpandToggled={(res: any, row: any) => {
          //     ExpandableComponent2(row)
          // }}
          // expandableRowsComponent={<ExpandableComponent2 />}
          // expandOnRowClicked
          />
          <DataTable
            data={[DATA.data.Total]}
            noTableHead
            striped
            dense
            noHeader
            responsive
            keyField={"DistribuidorID"}
            defaultSortField={"DistribuidorID"}
            defaultSortAsc={true}
            columns={DistCols}
            theme="solarized"
          />
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  const DetailColumns: //= React.useMemo(() => {
    //let colRet:
    IDataTableColumn[] = [
      // { name: '# Pago', width: '95px', selector: 'CreditoID', sortable: true, },
      {
        name: "# Pago",
        width: "95px",
        selector: "NoPago",
        sortable: false,
        cell: (props) =>
          props.NoPago != null ? (
            <span
              style={{ width: "95px", whiteSpace: "nowrap", overflow: "hidden" }}
            >
              {props.NoPago}
            </span>
          ) : (
            <span>TOTAL</span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.NoPago == null,
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
        name: "Importe",
        width: "150px",
        selector: "ImporteTotal",
        sortable: false,
        format: (row) => formatter.format(row.ImporteTotal),
        conditionalCellStyles: [
          {
            when: (row) => row.NoPago == null,
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
        name: "Abono",
        width: "150px",
        selector: "Abonos",
        sortable: false,
        format: (row) => formatter.format(row.Abonos),
        conditionalCellStyles: [
          {
            when: (row) => row.NoPago == null,
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
        name: "Saldo",
        width: "150px",
        selector: "SaldoActual",
        sortable: false,
        cell: (props) => (
          <span className="text-center">
            {props.SaldoActual < 1 ? 0 : FormateoDinero.format(props.SaldoActual)}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.DiasAtraso > 0,
            style: {
              color: "red",
            },
          },
          {
            when: (row) => row.NoPago == null,
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
        name: "Comisión",
        width: "150px",
        selector: "Comision",
        sortable: false,
        format: (row) => formatter.format(row.Comision),
        conditionalCellStyles: [
          {
            when: (row) => row.NoPago == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      // {
      //     name: 'Vencimiento', width: '150px', selector: 'FechaVencimiento', sortable: false, cell: (props) => props.NoPago != null ? <span>{formatDate(addOneDay(new Date(props.FechaVencimiento)))}</span> : <span></span>, conditionalCellStyles: [
      //         {
      //             when: row => row.NoPago == null,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ]
      // },

      {
        name: "Vencimiento",
        width: "150px",
        selector: "FechaVencimientoClienteFinal",
        sortable: false,
        cell: (props) =>
          props.NoPago != null ? (
            <span>
              {formatDate(
                addOneDay(new Date(props.FechaVencimientoClienteFinal))
              )}
            </span>
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.NoPago == null,
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
        name: "Días Atr",
        width: "95px",
        selector: "DiasAtraso",
        sortable: false,
        cell: (props) =>
          props.NoPago != null ? <span>{props.DiasAtraso}</span> : <span></span>,
        conditionalCellStyles: [
          {
            when: (row) => row.DiasAtraso > 0,
            style: {
              color: "red",
            },
          },
          {
            when: (row) => row.NoPago == null,
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
        name: "Fch Liq",
        width: "150px",
        selector: "FechaLiquidacion",
        sortable: false,
        cell: (props) =>
          props.NoPago != null ? (
            <span>
              {props.FechaLiquidacion
                ? moment(addOneDay(new Date(props.FechaLiquidacion))).format(
                  "DD/MM/YYYY"
                )
                : ""}
            </span>
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.NoPago == null,
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
  //     return colRet
  // }, [])

  const DetailColumnsCliente: //= React.useMemo(() => {
    //let colRet:
    IDataTableColumn[] = [
      {
        name: "N°",
        width: "65px",
        selector: "ClienteID",
        sortable: false,
        cell: (props) =>
          props.ClienteID != null ? (
            <span
              style={{ width: "65px", whiteSpace: "nowrap", overflow: "hidden" }}
            >
              {props.ClienteID}
            </span>
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.ClienteID == null,
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
        name: "Cliente",
        width: "150px",
        selector: "NombreCompleto",
        sortable: false,
        conditionalCellStyles: [
          {
            when: (row) => row.ClienteID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
        cell: (props) => (
          // <div style={{ width: '110px' }}>
          <>
            {/* <label data-tip data-for={`NombreClienteTooltip${props.ClienteID}`}> {props.NombreCompleto} </label> */}
            <span
              style={{ width: "150px", whiteSpace: "nowrap", overflow: "hidden" }}
              data-tip
              data-for={`NombreClienteTooltip${props.ClienteID}`}
            >
              {props.NombreCompleto}{" "}
            </span>
            <ReactTooltip
              id={`NombreClienteTooltip${props.ClienteID}`}
              type="info"
              effect="solid"
              clickable
              globalEventOff="click"
            >
              {props.NombreCompleto}
            </ReactTooltip>
          </>
        ),
        // </div>
      },
      {
        name: "Imp Total",
        width: "130px",
        selector: "ImporteTotal",
        sortable: false,
        format: (row) => formatter.format(row.ImporteTotal),
        conditionalCellStyles: [
          {
            when: (row) => row.ClienteID == null,
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
        name: "Saldo",
        width: "125px",
        selector: "SaldoActuals",
        sortable: false,
        format: (row) => formatter.format(row.SaldoActual),
        conditionalCellStyles: [
          {
            when: (row) => row.ClienteID == null,
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
        width: "125px",
        center: true,
        selector: "SaldoAtrasado",
        sortable: false,
        cell: (props) => formatter.format(props.SaldoAtrasado), //props.ClienteID != null ? <span>{formatter.format(props.SaldoAtrasado)}</span> : <span></span>,
        conditionalCellStyles: [
          {
            when: (row) => row.ClienteID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",
              color: "red",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
          {
            when: (row) => row.DiasAtraso > 0,
            style: {
              color: "red",
            },
          },
        ],
      },
      {
        name: "Días Atr",
        width: "65px",
        selector: "DiasAtraso",
        sortable: false,
        cell: (props) =>
          props.ClienteID != null ? (
            <span>{props.DiasAtraso}</span>
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.ClienteID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
          {
            when: (row) => row.DiasAtraso > 0,
            style: {
              color: "red",
            },
          },
        ],
      },
      {
        name: "Fch Último Pag",
        width: "110px",
        selector: "FechaHoraUltimoPago",
        sortable: false,
        cell: (props) => (
          <span>
            {props.FechaHoraUltimoPago
              ? moment(props.FechaHoraUltimoPago).format("DD/MM/YYYY")
              : ""}
          </span>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ClienteID == null,
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
        name: "Capital",
        width: "115px",
        selector: "Capital",
        sortable: false,
        format: (row) => formatter.format(row.Capital),
        conditionalCellStyles: [
          {
            when: (row) => row.ClienteID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      // {
      //     name: 'Interes', width: '150px', selector: 'Interes', sortable: true, format: row => formatter.format(row.Interes), conditionalCellStyles: [
      //         {
      //             when: row => row.ClienteID == 0,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ]
      // },
      // {
      //     name: 'Seguro', width: '150px', selector: 'Seguro', sortable: true, format: row => formatter.format(row.Seguro), conditionalCellStyles: [
      //         {
      //             when: row => row.ClienteID == 0,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ]
      // },

      {
        name: "Pago Moda",
        selector: "PagoMod",
        sortable: true,
        minWidth: "300px",
        cell: (props) => (
          <div>
            {props.Creditos && (
              <Acordion TabSelecionado={""}>
                <Acordion.Tab
                  key={"pagmod_" + props.ClienteID}
                  Identificador={"pagmod_" + props.ClienteID}
                  Titulo={`${formatter.format(props.PagoMod)}`}
                >
                  <div>
                    {props.Creditos.length < 1 && "$0"}
                    <ul className="list-group list-group-flush">
                      {props.Creditos.length > 0 && (
                        <li className="list-group">
                          <div className="columns">
                            <div className="column is-12">
                              <strong>N°</strong> - <strong>Pago Moda</strong>
                              {/* </div>
                                        <div className="column is-7"> */}
                            </div>
                          </div>
                        </li>
                      )}
                      {props.Creditos.map((d: any, dId: any) => (
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          <div className="columns">
                            <div className="column is-12">
                              {d.CreditoID} - {formatter.format(d.pagoModa)}
                            </div>
                            {/* <div className="column is-7">{d.pagoModa}</div> */}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Acordion.Tab>
              </Acordion>
            )}
            {!props.Creditos && formatter.format(props.PagoMod)}
          </div>
        ),
        conditionalCellStyles: [
          {
            when: (row) => row.ClienteID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },

      // {
      //     name: 'Pago Moda', width: '110px', selector: 'PagoMod', sortable: false, format: row => formatter.format(row.PagoMod), cell: (props) => props.ClienteID != null ? <span>{formatter.format(props.PagoMod)}</span> : <span></span>,
      //     conditionalCellStyles: [
      //         {
      //             when: row => row.ClienteID == null,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ]
      // },
      {
        name: "Créditos",
        sortable: false,
        wrap: true,
        width: "50px",
        center: true,
        cell: (data) =>
          data.ClienteID != null ? (
            <div
              style={{ width: "70px", overflowX: "auto", whiteSpace: "nowrap" }}
            >
              <button
                data-tip
                data-for={`DetalleClieTooltip${data.ClienteID}`}
                className="asstext"
                style={{
                  margin: ".15em",
                  width: "15%",
                  height: "40px",
                  padding: "5px",
                  tableLayout: "fixed",
                  borderCollapse: "collapse",
                }}
                type="button"
                onClick={() => {
                  FNGCreditosCliente(
                    data,
                    data.DistribuidorID,
                    data.ClienteID,
                    data.ProductoID
                  );
                }}
              >
                <FaEye />
              </button>
              <ReactTooltip
                id={`DetalleClieTooltip${data.ClienteID}`}
                type="info"
                effect="solid"
                clickable
                globalEventOff="click"
              >
                Ver Créditos
              </ReactTooltip>
            </div>
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.ClienteID == null,
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
        name: "Detalles Cliente",
        sortable: false,
        wrap: true,
        width: "100px",
        center: true,
        cell: (data) =>
          data.ClienteID != null ? (
            <div
              style={{ width: "70px", overflowX: "auto", whiteSpace: "nowrap" }}
            >
              <button
                data-tip
                data-for={`2DetalleClieTooltip${data.ClienteID}`}
                className="asstext"
                style={{
                  margin: ".15em",
                  width: "15%",
                  height: "40px",
                  padding: "5px",
                  tableLayout: "fixed",
                  borderCollapse: "collapse",
                }}
                type="button"
                onClick={async () => {
                  state.ClienteID = data.ClienteID;
                  setState((e) => ({
                    ...e,
                    Datos2: {
                      Persona: undefined,
                      Direcciones: [],
                      Empleos: [],
                      Creditos: undefined,
                    },
                    Cargando: true,
                    Error: false,
                  }));
                  let resultado = await FnPersona.FNObtenerPersona(
                    props.oidc,
                    data.ClienteID
                  );
                  // console.log("CLIENTE ID", data.ClienteID)
                  // console.log("DATOS DEL CLIENTE: ", resultado)
                  setState((e) => ({
                    ...e,
                    Datos2: {
                      Persona: resultado.persona,
                      Direcciones: resultado.direcciones,
                      Empleos: resultado.empleos,
                      Creditos: resultado.creditos,
                    },
                    Cargando: false,
                    Error: false,
                  }));
                  setShowClientePerfil(true);
                }}
              >
                <FaUser />
              </button>

              <ReactTooltip
                id={`2DetalleClieTooltip${data.ClienteID}`}
                type="info"
                effect="solid"
                clickable
                globalEventOff="click"
              >
                Ver Detalle Cliente
              </ReactTooltip>
            </div>
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.ClienteID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      { name: "", selector: "", sortable: false },
      // { name: 'Fecha Liquidacion', width: '110px', selector: 'FechaLiquidacion', sortable: true, cell: (props) => <span>{props.FechaLiquidacion ? moment(props.FechaLiquidacion).format('DD/MM/YYYY') : ''}</span> },
      // { name: 'Dias Atraso', selector: 'DiasAtraso', sortable: true, },
    ];
  //return colRet
  //}, [])

  const DetailColumnsCreditos: //= React.useMemo(() => {
    //let colRet:
    IDataTableColumn[] = [
      {
        name: "Crédito", //width: '95px',
        selector: "CreditoID",
        sortable: false,
        cell: (props) =>
          props.CreditoID != null ? (
            <span
              style={{ width: "95px", whiteSpace: "nowrap", overflow: "hidden" }}
            >
              {props.CreditoID}
            </span>
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.CreditoID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      // { name: 'Id Cliente', selector: 'ClienteID', sortable: true, },
      // {
      //     name: 'Nombre Cliente', width: '250px', selector: 'NombreCompleto', sortable: true,
      //     cell: (props) =>
      //         <>
      //             <span data-tip data-for={`NombreCompletoTooltip${props.CreditoID}`}>{props.NombreCompleto}</span>
      //             <ReactTooltip id={`NombreCompletoTooltip${props.CreditoID}`}
      //                 type="dark"
      //                 effect="solid"
      //                 clickable
      //                 globalEventOff="click"
      //             >
      //                 {props.NombreCompleto}
      //             </ReactTooltip>
      //         </>
      // },
      {
        name: "Capital",
        selector: "Capital",
        sortable: false,
        format: (row) => formatter.format(row.Capital),
        conditionalCellStyles: [
          {
            when: (row) => row.CreditoID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      // {
      //     name: 'Interes', selector: 'Interes', sortable: true, format: row => formatter.format(row.Interes), conditionalCellStyles: [
      //         {
      //             when: row => row.CreditoID == 0,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ]
      // },
      // {
      //     name: 'MC', selector: 'ManejoCuenta', sortable: true, format: row => formatter.format(row.ManejoCuenta), conditionalCellStyles: [
      //         {
      //             when: row => row.CreditoID == 0,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ]
      // },
      // {
      //     name: 'Seguro', selector: 'Seguro', sortable: true, format: row => formatter.format(row.Seguro), conditionalCellStyles: [
      //         {
      //             when: row => row.CreditoID == 0,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ]
      // },
      // {
      //     name: 'Cargo', selector: 'Cargo', sortable: true, format: row => formatter.format(row.Cargo), conditionalCellStyles: [
      //         {
      //             when: row => row.CreditoID == 0,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ]
      // },
      // {
      //     name: 'IVA', selector: 'IVA', sortable: true, format: row => formatter.format(row.IVA), conditionalCellStyles: [
      //         {
      //             when: row => row.CreditoID == 0,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ]
      // },
      {
        name: "Importe",
        selector: "ImporteTotal",
        sortable: false,
        format: (row) => formatter.format(row.ImporteTotal),
        conditionalCellStyles: [
          {
            when: (row) => row.CreditoID == null,
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
        name: "Abonos",
        selector: "Abonos",
        sortable: false,
        format: (row) => formatter.format(row.Abonos),
        style: {
          fontWeight: "bold",
        },
        conditionalCellStyles: [
          {
            when: (row) => row.CreditoID == null,
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
        name: "Saldo",
        selector: "SaldoActual",
        sortable: false,
        format: (row) => formatter.format(row.SaldoActual),
        style: {
          fontWeight: "bold",
        },
        conditionalCellStyles: [
          {
            when: (row) => row.CreditoID == null,
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
        name: "Atrasado", //width: '80px',
        selector: "SaldoAtrasado",
        sortable: false,
        format: (row) => formatter.format(row.SaldoAtrasado),
        conditionalCellStyles: [
          {
            when: (row) => row.SaldoAtrasado > 0,
            style: {
              color: "red",
            },
          },
          {
            when: (row) => row.CreditoID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",
              color: "red",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Días Atr", //width: '60px',
        selector: "DiasAtraso",
        sortable: false,
        cell: (props) =>
          props.CreditoID != null ? (
            <span>{props.DiasAtraso}</span>
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.DiasAtraso > 0,
            style: {
              color: "red",
            },
          },
          {
            when: (row) => row.CreditoID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",
              color: "red",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Pag Moda",
        selector: "pagoModa",
        sortable: false,
        format: (row) => formatter.format(row.pagoModa),
        style: {
          fontWeight: "bold",
        },
        conditionalCellStyles: [
          {
            when: (row) => row.CreditoID == null,
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
        name: "Fecha Registro", //width: '110px',
        selector: "FechaHoraRegistro",
        sortable: false,
        cell: (props) =>
          props.CreditoID != null ? (
            <span>{moment(props.FechaHoraRegistro).format("DD/MM/YYYY")}</span>
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.CreditoID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      // {
      //     name: 'Vale', selector: 'ValeCanje', sortable: true, conditionalCellStyles: [
      //         {
      //             when: row => row.CreditoID == 0,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ]
      // },
      {
        name: "Estatus",
        selector: "EstatusID",
        sortable: false,
        center: true,
        // cell: (props) => <span>{props.EstatusID}</span>,
        cell: (props) =>
          props.CreditoID != null ? (
            <>
              <span data-tip data-for={`CreditoEsttTooltip${props.CreditoID}`}>
                <FaCircle color={props.Color} title={props.color} />
              </span>
              <ReactTooltip
                id={`CreditoEsttTooltip${props.CreditoID}`}
                type="info"
                effect="solid"
                clickable
                globalEventOff="click"
              >
                {props.EstatusNombre}
              </ReactTooltip>
            </>
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.CreditoID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      // {
      //     name: 'Desembolsado', selector: 'MovimientoID', sortable: false, cell: (props) => props.CreditoID != null ? <span>{props.MovimientoID ? "SI" : "No"}</span> : <span></span>, conditionalCellStyles: [
      //         {
      //             when: row => row.CreditoID == null,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ]
      // },
      // {
      //     name: 'Movimiento', selector: 'MovimientoID', sortable: true, conditionalCellStyles: [
      //         {
      //             when: row => row.CreditoID == 0,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ]
      // },
      // {
      //     name: 'Id Venta', selector: 'VentaId', sortable: true, conditionalCellStyles: [
      //         {
      //             when: row => row.CreditoID == 0,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ]
      // },
      {
        name: "Plan Pagos",
        sortable: false,
        center: true,
        wrap: true,
        cell: (data) =>
          data.CreditoID != null ? (
            <div
              style={{ width: "25%", overflowX: "auto", whiteSpace: "nowrap" }}
            >
              <button
                data-tip
                data-for={`DetallePagoTooltip${data.CreditoID}`}
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
                  FNGetDetalle(data, data.CreditoID);
                }}
              >
                <FaEye />
              </button>
              <ReactTooltip
                id={`DetallePagoTooltip${data.CreditoID}`}
                type="info"
                effect="solid"
                clickable
                globalEventOff="click"
              >
                Ver Plan de Pagos
              </ReactTooltip>
            </div>
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.CreditoID == null,
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
  //     return colRet
  // }, [])

  //Columnas Tabla Detalles Cliente
  const ColumnasDetallesClientes: //= React.useMemo(() => {
    //let colRet:
    IDataTableColumn[] = [
      {
        name: "Persona ID", //width: '95px',
        selector: "CreditoID",
        sortable: false,
        cell: (props) =>
          props.CreditoID != null ? (
            <span
              style={{ width: "95px", whiteSpace: "nowrap", overflow: "hidden" }}
            >
              {props.CreditoID}
            </span>
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.CreditoID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      // { name: 'Id Cliente', selector: 'ClienteID', sortable: true, },
      // {
      //     name: 'Nombre Cliente', width: '250px', selector: 'NombreCompleto', sortable: true,
      //     cell: (props) =>
      //         <>
      //             <span data-tip data-for={`NombreCompletoTooltip${props.CreditoID}`}>{props.NombreCompleto}</span>
      //             <ReactTooltip id={`NombreCompletoTooltip${props.CreditoID}`}
      //                 type="dark"
      //                 effect="solid"
      //                 clickable
      //                 globalEventOff="click"
      //             >
      //                 {props.NombreCompleto}
      //             </ReactTooltip>
      //         </>
      // },
      {
        name: "Nombre",
        selector: "Capital",
        sortable: false,
        format: (row) => formatter.format(row.Capital),
        conditionalCellStyles: [
          {
            when: (row) => row.CreditoID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      // {
      //     name: 'Interes', selector: 'Interes', sortable: true, format: row => formatter.format(row.Interes), conditionalCellStyles: [
      //         {
      //             when: row => row.CreditoID == 0,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ]
      // },
      // {
      //     name: 'MC', selector: 'ManejoCuenta', sortable: true, format: row => formatter.format(row.ManejoCuenta), conditionalCellStyles: [
      //         {
      //             when: row => row.CreditoID == 0,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ]
      // },
      // {
      //     name: 'Seguro', selector: 'Seguro', sortable: true, format: row => formatter.format(row.Seguro), conditionalCellStyles: [
      //         {
      //             when: row => row.CreditoID == 0,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ]
      // },
      // {
      //     name: 'Cargo', selector: 'Cargo', sortable: true, format: row => formatter.format(row.Cargo), conditionalCellStyles: [
      //         {
      //             when: row => row.CreditoID == 0,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ]
      // },
      // {
      //     name: 'IVA', selector: 'IVA', sortable: true, format: row => formatter.format(row.IVA), conditionalCellStyles: [
      //         {
      //             when: row => row.CreditoID == 0,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ]
      // },
      {
        name: "Apellido Paterno",
        selector: "ImporteTotal",
        sortable: false,
        format: (row) => formatter.format(row.ImporteTotal),
        conditionalCellStyles: [
          {
            when: (row) => row.CreditoID == null,
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
        name: "Apellido Materno",
        selector: "Abonos",
        sortable: false,
        format: (row) => formatter.format(row.Abonos),
        style: {
          fontWeight: "bold",
        },
        conditionalCellStyles: [
          {
            when: (row) => row.CreditoID == null,
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
        name: "Fecha Nacimiento",
        selector: "SaldoActual",
        sortable: false,
        format: (row) => formatter.format(row.SaldoActual),
        style: {
          fontWeight: "bold",
        },
        conditionalCellStyles: [
          {
            when: (row) => row.CreditoID == null,
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
        name: "Lugar Nacimiento", //width: '80px',
        selector: "SaldoAtrasado",
        sortable: false,
        format: (row) => formatter.format(row.SaldoAtrasado),
        conditionalCellStyles: [
          {
            when: (row) => row.SaldoAtrasado > 0,
            style: {
              color: "red",
            },
          },
          {
            when: (row) => row.CreditoID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",
              color: "red",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "", //width: '60px',
        selector: "DiasAtraso",
        sortable: false,
        cell: (props) =>
          props.CreditoID != null ? (
            <span>{props.DiasAtraso}</span>
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.DiasAtraso > 0,
            style: {
              color: "red",
            },
          },
          {
            when: (row) => row.CreditoID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",
              color: "red",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      {
        name: "Pag Moda",
        selector: "pagoModa",
        sortable: false,
        format: (row) => formatter.format(row.pagoModa),
        style: {
          fontWeight: "bold",
        },
        conditionalCellStyles: [
          {
            when: (row) => row.CreditoID == null,
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
        name: "Fecha Registro", //width: '110px',
        selector: "FechaHoraRegistro",
        sortable: false,
        cell: (props) =>
          props.CreditoID != null ? (
            <span>{moment(props.FechaHoraRegistro).format("DD/MM/YYYY")}</span>
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.CreditoID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      // {
      //     name: 'Vale', selector: 'ValeCanje', sortable: true, conditionalCellStyles: [
      //         {
      //             when: row => row.CreditoID == 0,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ]
      // },
      {
        name: "Estatus",
        selector: "EstatusID",
        sortable: false,
        center: true,
        // cell: (props) => <span>{props.EstatusID}</span>,
        cell: (props) =>
          props.CreditoID != null ? (
            <>
              <span data-tip data-for={`CreditoEsttTooltip${props.CreditoID}`}>
                <FaCircle color={props.Color} title={props.color} />
              </span>
              <ReactTooltip
                id={`CreditoEsttTooltip${props.CreditoID}`}
                type="info"
                effect="solid"
                clickable
                globalEventOff="click"
              >
                {props.EstatusNombre}
              </ReactTooltip>
            </>
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.CreditoID == null,
            style: {
              textAlign: "center",
              borderTop: "1px solid black",

              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            },
          },
        ],
      },
      // {
      //     name: 'Desembolsado', selector: 'MovimientoID', sortable: false, cell: (props) => props.CreditoID != null ? <span>{props.MovimientoID ? "SI" : "No"}</span> : <span></span>, conditionalCellStyles: [
      //         {
      //             when: row => row.CreditoID == null,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ]
      // },
      // {
      //     name: 'Movimiento', selector: 'MovimientoID', sortable: true, conditionalCellStyles: [
      //         {
      //             when: row => row.CreditoID == 0,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ]
      // },
      // {
      //     name: 'Id Venta', selector: 'VentaId', sortable: true, conditionalCellStyles: [
      //         {
      //             when: row => row.CreditoID == 0,
      //             style: {
      //                 textAlign: 'center',
      //                 borderTop: '1px solid black',

      //                 backgroundColor: '#f0f0f0',
      //                 fontWeight: 'bold'

      //             },

      //         },
      //     ]
      // },
      {
        name: "Plan Pagos",
        sortable: false,
        center: true,
        wrap: true,
        cell: (data) =>
          data.CreditoID != null ? (
            <div
              style={{ width: "25%", overflowX: "auto", whiteSpace: "nowrap" }}
            >
              <button
                data-tip
                data-for={`DetallePagoTooltip${data.CreditoID}`}
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
                  FNGetDetalle(data, data.CreditoID);
                }}
              >
                <FaEye />
              </button>
              <ReactTooltip
                id={`DetallePagoTooltip${data.CreditoID}`}
                type="info"
                effect="solid"
                clickable
                globalEventOff="click"
              >
                Ver Plan de Pagos
              </ReactTooltip>
            </div>
          ) : (
            <span></span>
          ),
        conditionalCellStyles: [
          {
            when: (row) => row.CreditoID == null,
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
  //     return colRet
  // }, [])

  const HiddenColumns: IDataTableColumn[] = [
    {
      name: "Acciones",
      sortable: false,
      wrap: true,
      cell: (data) => (
        <div style={{ width: "25%", overflowX: "auto", whiteSpace: "nowrap" }}>
          <button
            data-tip
            data-for={`DetalleDvTooltip${data.DistribuidorID}`}
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
              FNGetClientes(data, data.DistribuidorID);
            }}
          >
            <FaEye />
          </button>
          <ReactTooltip
            id={`DetalleDvTooltip${data.DistribuidorID}`}
            type="info"
            effect="solid"
            clickable
            globalEventOff="click"
          >
            Detalle {DescripcionDistribuidor(1)}
          </ReactTooltip>
        </div>
      ),
    },
  ];
  // return col
  // }, [])

  const HiddenColumns2: IDataTableColumn[] = [
    {
      name: "Acciones",
      sortable: false,
      wrap: true,
      cell: (data) => (
        <div style={{ width: "25%", overflowX: "auto", whiteSpace: "nowrap" }}>
          <button
            data-tip
            data-for={`DetalleClieTooltip${data.ClienteID}`}
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
              FNGCreditosCliente(
                data,
                data.DistribuidorID,
                data.ClienteID,
                data.ProductoID
              );
            }}
          >
            <FaEye />
          </button>
          <ReactTooltip
            id={`DetalleClieTooltip${data.ClienteID}`}
            type="info"
            effect="solid"
            clickable
            globalEventOff="click"
          >
            Ver Créditos
          </ReactTooltip>
        </div>
      ),
    },
  ];
  // return col
  // }, [])

  const HiddenColumns3: IDataTableColumn[] = [
    {
      name: "Acciones",
      sortable: false,
      wrap: true,
      cell: (data) => (
        <div style={{ width: "25%", overflowX: "auto", whiteSpace: "nowrap" }}>
          <button
            data-tip
            data-for={`DetallePagoTooltip${data.CreditoID}`}
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
              FNGetDetalle(data, data.CreditoID);
            }}
          >
            <FaEye />
          </button>
          <ReactTooltip
            id={`DetallePagoTooltip${data.CreditoID}`}
            type="info"
            effect="solid"
            clickable
            globalEventOff="click"
          >
            Detalle Plan de Pagos
          </ReactTooltip>
        </div>
      ),
    },
  ];
  // return col
  // }, [])

  const HiddenData = (data: any) => {
    const Datos = [data.data];
    return (
      <DataTable
        data={Datos}
        striped
        noHeader
        noTableHead
        responsive
        keyField={"CreditoID"}
        defaultSortField={"CreditoID"}
        columns={HiddenColumns}
      />
    );
  };

  const HiddenData2 = (data: any) => {
    const Datos = [data.data];
    return (
      <DataTable
        data={Datos}
        striped
        noHeader
        noTableHead
        responsive
        keyField={"ClienteID"}
        defaultSortField={"ClienteID"}
        columns={HiddenColumns2}
      />
    );
  };

  const HiddenData3 = (data: any) => {
    const Datos = [data.data];
    return (
      <DataTable
        data={Datos}
        striped
        noHeader
        noTableHead
        responsive
        keyField={"CreditoID"}
        defaultSortField={"CreditoID"}
        columns={HiddenColumns3}
      />
    );
  };

  React.useEffect(() => {

    console.log('detalle', state.Detalle)
    // Consultamos los datos
    if (state.DetalleSaldos)
      FNGetSaldosDetalles(state.Datos3.Persona?.PersonaID, state.ContratoSel)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.DetalleSaldos])


  React.useEffect(() => {
    if (state.DirectorID != 0) FNGetProductos(state.DirectorID, 2);
  }, [state.DirectorID]);

  React.useEffect(() => {
    if (
      (state.DirectorID != 0 && state.ProductoID != 0) ||
      state.tipoUsuario >= 3
    )
      FNGetSucursales(state.DirectorID, state.ProductoID, 3);
  }, [state.ProductoID]);

  React.useEffect(() => {
    if (state.SucursalID != 0 || state.tipoUsuario == 4) {
      FNGetGrupos(state.DirectorID, state.ProductoID, state.SucursalID, 4);
    }
  }, [state.SucursalID]);

  React.useEffect(() => {

    // Consultamos los datos
    if (state.DetalleSaldos)
      FNGetSaldoDetalles(state.Datos3.Persona?.PersonaID, state.ContratoSel)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.DetalleSaldos])

  const fnCargando = () => {
    setState((s) => ({
      ...s,
      DirectorID: 0,
      ProductoID: 0,
      SucursalID: 0,
      Cargando: true,
      Error: false,
      Datos: [],
      DatosProd: [],
      DatosSuc: [],
      DatosGpo: [],
      Datos1F: false,
      Datos2F: false,
      Datos3F: false,
      Datos4F: false,
    }));
  };

  const response = async () => {
    const resp: any = await FnGetTipoUsuario.FNGetTipoUsuario(props.oidc);
    setState((s) => ({
      ...s,
      tipoUsuario: resp.tipoUsuario,
      ProductoID: parseInt(params.productoId),
    }));
  };

  const clearFormByLevel = (level: number) => {
    if (level === 0) {
      //const sucursal: any = refSucursal.current?.select
      state.Cargando = false;
      state.Datos1F = false;
      state.Datos = [];
      state.DirectorID = 0;

      state.CargandoProd = false;
      state.Datos2F = false;
      state.DatosProd = [];

      state.CargandoSuc = false;
      state.Datos3F = false;
      state.DatosSuc = [];

      state.CargandoGpo = false;
      state.Datos4F = false;
      state.DatosGpo = [];
      //sucursal.select.clearValue()
    }
    if (level === 0 || level === 1 || level === 2 || level === 3) {
    }
  };

  const filtrar = (values: any) => {
    setCargandoDatos(true);
    clearFormByLevel(0);

    setState((s) => ({ ...s, keyTemp: Math.random() }));
    Funciones.FNgetbyfiltros(props.oidc, {
      ...values,
      DirectorID: isNaN(values.DirectorID) ? 0 : values.DirectorID,
      ProductoID: isNaN(values.ProductoID) ? 0 : values.ProductoID, //props.ui.Producto?.ProductoID ?? 1,
      ClienteID: isNaN(values.ClienteID) ? 0 : values.ClienteID,
      SucursalID: isNaN(values.SucursalID) ? 0 : values.SucursalID,
      ZonaID: !Number.isInteger(values.ZonaID) ? 0 : values.ZonaID,
      DistribuidorID: isNaN(values.DistribuidorID) ? 0 : values.DistribuidorID,
      GrupoID: isNaN(values.GrupoID) ? 0 : values.GrupoID,
      Tipo: 1,
    })
      .then((respuesta: any) => {
        console.log(respuesta, "resp fngetbyfiltros");
        cbDirectores(respuesta, {
          ...values,
          DirectorID: isNaN(values.DirectorID) ? 0 : values.DirectorID,
          ProductoID: isNaN(values.ProductoID) ? 0 : values.ProductoID,
          ClienteID: isNaN(values.ClienteID) ? 0 : values.ClienteID,
          SucursalID: isNaN(values.SucursalID) ? 0 : values.SucursalID,
          ZonaID: isNaN(values.ZonaID) ? 0 : values.ZonaID,
          DistribuidorID: isNaN(values.DistribuidorID)
            ? 0
            : values.DistribuidorID,
          GrupoID: isNaN(values.GrupoID) ? 0 : values.GrupoID,
          // Tipo: 1
        });
        response();
        setCargandoDatos(false);
      })
      .catch(() => {
        cbDirectores([], values);
        toast.error("Error al consultar, vuelva a intentarlo");
      });
  };

  /** funcion Callback al agregar un item */
  const cbRespuesta = (Datos: any, item: any) => {
    // console.log(Datos, 'cbRespuesta1')
    if (isMounted.current === true) {
      if (Datos.length > 0) {
        setState((s) => ({ ...s, ProductoID: Datos[0].ProductoID }));
        let tabla: any[] = [];
        // let totalDiferencia = 0
        // let totalCajaFisico = 0
        // let totalCajaSistema = 0
        // let cajaAnteriorID = 0
        // let posicion = 0
        // let posicion2 = 0
        // let tabla2: any[] = []

        Datos.forEach((element: any) => {
          // posicion = posicion + 1
          // if (cajaAnteriorID == 0) {
          let datosGlobal: any = {
            ProductoID: element.ProductoID,
            Producto: element.Producto,
            DirectorID: element.DirectorID,
            Director: element.NombreDirector,
            ZonaID: element.ZonaID,
            Zona: element.ZonaNombre,
            SucursalID: element.SucursalID,
            Sucursal: element.Nombre,
            GrupoID: element.GrupoID,
            Grupo: element.ClasificadorGrupoID,
            Descripcion: element.Descripcion,
            DistribuidorID: element.DistribuidorID,
            Distribuidor: element.NombreCompleto,
            Credito: element.LimiteDeCredito,
            Disponible: element.Disponible,
            Nivel: element.DistribuidorNivel,
            Cartera: element.Cartera,
            PrestamoPersonal: element.saldoPresPersonal,
            NoCreditosPersonales: element.numCreditosPersonales,
            CreditosActivos: element.CreditosActivos,
            SaldoAtrasado: element.SaldoAtrasado,
            DiasAtraso: element.DiasAtraso,
            PagosAtrasados: element.PagosAtrasados,
            CreditosAtrasados: element.CreditosAtrasados,
            Capital: element.Capital,
            Intereses: element.Interes,
            Seguro: element.Seguro,
            PorcentajeColocacion: element.PorcColocacionLimite,
            FechaUltimoVale: element.fechaUltimoVale,
            CapitalLiquidado: element.CapLiquidado,
            CarteraRiesgo: element.CarteraEnRiesgo,
            SaldoRiesgo: element.saldoEnRiesgo,
            UltimoImporteRelacion: element.UltRelacionImporte,
            Recuperado: element.Recuperado,
            UltimaFechaRelacion: element.UltimaRelacionFecha,
            DiasDesdeUltimoPago: element.DiasDesdeUltPago,
            EstatusID: element.DistribuidoresEstatusID,
            Estatus: element.DistribuidoresEstatus,
          };

          tabla.push(datosGlobal);
          // cajaAnteriorID = element.CajaID
          // }
        });

        /*     respuesta.forEach(element => {
                        
                    }); */

        setState((s) => ({ ...s, Datos: Datos, DatosExcel: tabla }));
      }
    }
    //  setState(s => ({ ...s, Datos: Datos, DatosExcel: Datos }))
  };
  const cbDirectores = (Datos: any, values: any) => {
    setState((s) => ({ ...s, Filtros: values, DatosExcel: [] }));

    if (Datos.length > 0) {
      // setState(s => ({ ...s, MultiSaldoCajaID: respuesta[0].MultisaldosCajaID }))
      let tabla: any[] = [];
      let Cartera = 0;
      let Disponible = 0;
      let Colocado = 0;
      let Calidad = 0;
      let SaldoAtrasado = 0;
      let CreditosAtrasados = 0;
      let Capital = 0;
      let CapLiquidado = 0;
      let CarteraEnRiesgo = 0;
      let Recuperado = 0;
      let CountDistribuidor = 0;
      let LimiteDeCredito = 0;
      // let posicion = 0

      Datos.forEach((element: any) => {
        // posicion = posicion + 1
        //if (cajaAnteriorID == 0) {
        let Productos: any = {
          // UsuarioID: element.UsuarioID,
          // ProductoID: element.ProductoID,
          // Producto: element.Producto,
          DirectorID: element.DirectorID,
          NombreDirector: element.NombreDirector,
          LimiteDeCredito: element.LimiteDeCredito,
          Disponible: element.Disponible,
          Colocado: element.Colocado,
          CountDistribuidor: element.CountDistribuidor,
          Calidad: (element.CarteraEnRiesgo / element.Cartera) * 100 - 100,
          SaldoActual: element.SaldoActual,
          Cartera: element.Cartera,
          SaldoAtrasado: element.SaldoAtrasado,
          CreditosAtrasados: element.CreditosAtrasados,
          saldoEnRiesgo: element.saldoEnRiesgo,
          Recuperado: element.Recuperado,
          Capital: element.Capital,
          CapLiquidado: element.CapLiquidado,
          CarteraEnRiesgo: element.CarteraEnRiesgo,
        };
        Cartera += element.Cartera;
        Disponible += element.Disponible;
        Colocado += element.Colocado;
        CountDistribuidor += element.CountDistribuidor;
        SaldoAtrasado += element.SaldoAtrasado;
        CreditosAtrasados += element.CreditosAtrasados;
        Calidad = (element.CarteraEnRiesgo / Cartera) * 100 - 100;
        Capital += element.Capital;
        CapLiquidado += element.CapLiquidado;
        CarteraEnRiesgo += element.CarteraEnRiesgo;
        Recuperado += element.Recuperado;
        LimiteDeCredito += element.LimiteDeCredito;
        tabla.push(Productos);
      });

      let TotalProd: any = {
        // UsuarioID: 0,
        // ProductoID: 0,
        // Producto: 'TOTAL',
        DirectorID: null,
        NombreDirector: "TOTAL",
        LimiteDeCredito: LimiteDeCredito,
        Disponible: Disponible,
        Colocado,
        Calidad,
        CountDistribuidor,
        SaldoActual: 0,
        Cartera,
        SaldoAtrasado,
        CreditosAtrasados,
        saldoEnRiesgo: 0,
        Recuperado,
        Capital,
        CapLiquidado,
        CarteraEnRiesgo,
      };

      tabla.push(TotalProd);
      setTimeout(
        () =>
          setState((s) => ({
            ...s,
            Datos: tabla,
            Cargando: false,
            Error: false,
            Datos1F: true,
          })),
        500
      );
    } else {
      setState((s) => ({
        ...s,
        Datos: [],
        Cargando: false,
        Error: false,
        Datos1F: true,
      }));
    }
  };
  // setState(s => ({ ...s, Datos: Datos }))

  /** funcion Callback al actualizar un item */
  // const cbActualizar = (item: any) =>
  //     setState({ ...state, Datos: state.Datos.map(Dato => Dato.CreditoID === item.CreditoID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: undefined } })

  /** funcion para cancelar la forma */
  const fnCancelar = () =>
    setState({ ...state, Form: { ...state.Form, Mostrar: false } });

  // const cbCancelar = (item: any) =>
  //     setState({ ...state, Datos: state.Datos.filter((obj) => { return obj.CreditoID !== item.CreditoID }) })

  const Export = ({ onExport }) => (
    <button
      className="ms-2 btn btn-primary waves-effect waves-light"
      type={"button"}
      onClick={(e) => onExport(e.target)}
    >
      Exportar
    </button>
  );

  const actionsMemo = React.useMemo(
    () => <Export onExport={() => downloadCSV(state.DatosMostrar)} />,
    []
  );

  function downloadCSV(array) {
    const link = document.createElement("a");
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv == null) return;

    const filename = "export.csv";

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    link.click();
  }

  function convertArrayOfObjectsToCSV(array) {
    let result;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(state.DatosMostrar[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item) => {
      let ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

  const TotalSociasDirector = () => {
    var Total = 0;

    state.Datos.map((valor) => {
      if (valor.NombreDirector == "TOTAL") {
        Total = valor.CountDistribuidor;
      }
    });
    return Total;
  };

  const TotalCalidadDirector = () => {
    var Total = 0;

    state.Datos.map((valor) => {
      if (valor.Cartera > 0) {
        if (valor.NombreDirector == "TOTAL") {
          Total = valor.Calidad < 0 ? valor.Calidad * -1 : valor.Calidad;
        }
      } else {
        if (valor.NombreDirector == "TOTAL") {
          Total = (valor.CarteraEnRiesgo / 1) * 100 - 100;

          if (Total < 0) {
            Total = Total * -1;
          }
        }
      }
    });
    return parseFloat(Total.toFixed(2));
  };

  const TotalSociasProductos = () => {
    var Total = 0;

    state.DatosProd.map((valor) => {
      if (valor.Producto == "TOTAL") {
        Total = valor.CountDistribuidor;
      }
    });
    return Total;
  };

  const TotalCalidadProductos = () => {
    var Total = 0;

    state.DatosProd.map((valor) => {
      if (valor.Cartera == 0) {
        if (valor.Producto == "TOTAL") {
          Total = (valor.CarteraEnRiesgo / 1) * 100 - 100;

          if (Total < 0) {
            Total = Total * -1;
          }
        }
      } else {
        if (valor.Producto == "TOTAL") {
          Total = valor.Calidad < 0 ? valor.Calidad * -1 : valor.Calidad;
        }
      }
    });
    return parseFloat(Total.toFixed(2));
  };

  const TotalSociasSucursales = () => {
    var Total = 0;

    if (state.DatosSuc.length > 0) {
    }
    state.DatosSuc.map((valor) => {
      if (valor.Nombre == "TOTAL") {
        Total = valor.CountDistribuidor;
      }
    });
    return Total;
  };

  const TotalCalidadSucursales = () => {
    var Total = 0;

    state.DatosSuc.map((valor) => {
      if (valor.Cartera == 0) {
        if (valor.Nombre == "TOTAL") {
          Total = (valor.CarteraEnRiesgo / 1) * 100 - 100;

          if (Total < 0) {
            Total = Total * -1;
          }
        }
      } else {
        if (valor.Nombre == "TOTAL") {
          Total = valor.Calidad < 0 ? valor.Calidad * -1 : valor.Calidad;
        }
      }
    });
    return parseFloat(Total.toFixed(2));
  };

  const TotalSociasGrupos = () => {
    var Total = 0;

    state.DatosGpo.map((valor) => {
      if (valor.Coordinador == "TOTAL") {
        Total = valor.CountDistribuidor;
      }
    });
    //Total < 0 ? (Total * -1) : Total
    return Total;
  };
  const [showContent, setShowContent] = useState(false);

  const TotalCalidadGrupos = () => {
    var Total = 0;

    state.DatosGpo.map((valor) => {
      if (valor.Cartera == 0) {
        if (valor.Coordinador == "TOTAL") {
          Total = (valor.CarteraEnRiesgo / 1) * 100 - 100;
        }
        if (Total < 0) {
          Total = Total * -1;
        }
      } else {
        if (valor.Coordinador == "TOTAL") {
          Total = valor.Calidad < 0 ? valor.Calidad * -1 : valor.Calidad;
        }
      }
    });
    return parseFloat(Total.toFixed(2));
  };
  /* useEffect(() => {
    const showModal = async () => {
      const result = await MySwal.fire({
        title: "<strong>AVISO</strong>",
        icon: "warning",
        html: (
          <div className="text-center">
            <div>
              <strong>
                ESTE REPORTE DE GLOBAL YA NO ESTA DISPONIBLE.</strong>
              <div>  El nuevo Global se encuentra en la lista de consultas rápidas.
                Por favor, dirígete allí para acceder a la información más actualizada.
              </div>
              <div>
                <div>
                  <img src={ssglobal} alt={"Logo de app"} className="auth-logo-dark" style={{ width: "1000px" }} />
                </div>
              </div>

            </div>
          </div >


        ),
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: false,
        showLoaderOnConfirm: true,
        focusConfirm: false,
        confirmButtonText: "Aceptar",
        confirmButtonAriaLabel: "Aceptar",
        cancelButtonAriaLabel: "",
        confirmButtonColor: `#3085d6`,
        width: "1200px"
      });

      if (result.isConfirmed) {
        setShowContent(true);
      } else {
        setShowContent(false);
      }
    };

    showModal();
  }, []); */

  return (
    <div className="row">
      <div className="col-12">
        <Card Title="Global Créditosss">
          <Card.Body>
            <Card.Body.Content>
              {/* {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error && */}
              <div>
                <FiltroPorUsuario
                  oidc={props.oidc}
                  ui={props.ui}
                  initialValues={{
                    DirectorID: 0,
                    ProductoID: 0,
                    ClienteID: 0,
                    SucursalID: 0,
                    ZonaID: 0,
                    EmpresaID: 0,
                    DistribuidorID: 0,
                    CoordinadorID: 0,
                    creditoPromotorId: 0,
                    ContratoID: 0,
                    EstatusID: "A",
                    DistribuidorNivelID: 0,
                    FechaInicio: moment().add(-30, "d").toDate(),
                    FechaFin: new Date(),
                    GrupoID: 0,
                    Permiso: true,
                    tipoDias: "0",
                  }}
                  EsGlobal={true}
                  onSubmit={filtrar}
                  loading={cargandoDatos}
                  PrintExcel={generarXLSX}
                />

                {cargandoDatos && <Spinner />}
                {state.Error && <span>Error al cargar los datos...</span>}
                {/* {!state.Cargando && !state.Datos1F && !state.Error && <span>No se encontró información...</span>} */}
                {!cargandoDatos &&
                  state.Datos1F &&
                  !state.Error &&
                  state.tipoUsuario <= 1 && (
                    <div style={styles.div0}>
                      {" "}
                      <strong>
                        Directores (Socias: {TotalSociasDirector()} -
                        {TotalCalidadDirector() >= 85 ? (
                          <strong style={{ color: "green", fontSize: "14px" }}>
                            Calidad: {TotalCalidadDirector()}%
                          </strong>
                        ) : TotalCalidadDirector() >= 50 ? (
                          <strong
                            style={{ color: "orangered", fontSize: "14px" }}
                          >
                            Calidad: {TotalCalidadDirector()}%
                          </strong>
                        ) : (
                          <strong style={{ color: "red", fontSize: "14px" }}>
                            Calidad: {TotalCalidadDirector()}%
                          </strong>
                        )}
                        )
                      </strong>
                      <DataTable
                        key={state.keyTemp}
                        data={state.Datos}
                        striped
                        dense
                        noDataComponent="No se encontró información."
                        noHeader
                        responsive
                        // onRowDoubleClicked={(value: any) => {
                        //     FNGetProductos(value.DirectorID, 2)
                        // }}
                        keyField={"DirectorID"}
                        defaultSortField={"DirectorID"}
                        defaultSortAsc={true}
                        columns={DirCols}
                      />
                    </div>
                  )}
                <br />

                {state.CargandoProd && <Spinner />}
                {state.ErrorProd && <span>Error al cargar los datos...</span>}
                {!state.CargandoProd &&
                  state.Datos2F &&
                  !state.ErrorProd &&
                  state.tipoUsuario <= 2 && (
                    <div style={styles.div1}>
                      {" "}
                      <strong>
                        Productos (Socias: {TotalSociasProductos()} -{" "}
                        {TotalCalidadProductos() >= 85 ? (
                          <strong style={{ color: "green", fontSize: "14px" }}>
                            Calidad: {TotalCalidadProductos()}%
                          </strong>
                        ) : TotalCalidadProductos() >= 50 ? (
                          <strong
                            style={{ color: "orangered", fontSize: "14px" }}
                          >
                            Calidad: {TotalCalidadProductos()}%
                          </strong>
                        ) : (
                          <strong style={{ color: "red", fontSize: "14px" }}>
                            Calidad: {TotalCalidadProductos()}%
                          </strong>
                        )}
                        ){" "}
                      </strong>
                      <DataTable
                        data={state.DatosProd}
                        striped
                        dense
                        noHeader
                        responsive
                        keyField={"ProductoID"}
                        defaultSortField={"ProductoID"}
                        defaultSortAsc={true}
                        columns={ProdCols}
                        theme="solarized"
                      />
                    </div>
                  )}
                <br />

                {state.CargandoSuc && <Spinner />}
                {state.ErrorSuc && <span>Error al cargar los datos...</span>}
                {!state.CargandoSuc &&
                  state.Datos3F &&
                  !state.ErrorSuc &&
                  state.tipoUsuario <= 4 && (
                    <div style={styles.div2}>
                      {" "}
                      <strong>
                        Sucursales (Socias: {TotalSociasSucursales()} -{" "}
                        {TotalCalidadSucursales() >= 85 ? (
                          <strong style={{ color: "green", fontSize: "14px" }}>
                            Calidad: {TotalCalidadSucursales()}%
                          </strong>
                        ) : TotalCalidadSucursales() >= 50 ? (
                          <strong
                            style={{ color: "orangered", fontSize: "14px" }}
                          >
                            Calidad: {TotalCalidadSucursales()}%
                          </strong>
                        ) : (
                          <strong style={{ color: "red", fontSize: "14px" }}>
                            Calidad: {TotalCalidadSucursales()}%
                          </strong>
                        )}
                        )
                      </strong>
                      <DataTable
                        data={state.DatosSuc}
                        striped
                        dense
                        noHeader
                        responsive
                        keyField={"SucursalID"}
                        defaultSortField={"SucursalID"}
                        defaultSortAsc={true}
                        columns={SucCols}
                        theme="solarized"
                      />
                    </div>
                  )}
                <br />

                {state.CargandoGpo && <Spinner />}
                {state.ErrorGpo && <span>Error al cargar los datos...</span>}
                {!state.CargandoGpo && state.Datos4F && !state.ErrorGpo && (
                  <div style={styles.div3}>
                    <DataTable
                      data={state.DatosGpo}
                      striped
                      pagination={false}
                      dense
                      noHeader
                      responsive
                      keyField={"GrupoID"}
                      defaultSortField={"GrupoID"}
                      defaultSortAsc={true}
                      columns={GpoCols}
                      theme="solarized"
                      expandableRows={true}
                      onRowExpandToggled={(res: any, row: any) => {
                        console.log("Aqui");

                        ExpandableComponent(row);
                      }}
                      expandableRowDisabled={(row: any) =>
                        row.GrupoID == null ? true : false
                      }
                      expandableIcon={{
                        collapsed: <FaPlus />,
                        expanded: <FaMinus />,
                      }}
                      // expandableRowsHideExpander={(row: any) => row.GrupoID == 0 ? true : false}
                      expandableRowsComponent={<ExpandableComponent />}
                      expandOnRowClicked
                    />
                  </div>
                )}

                {/* <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar crédito" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
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
                                        keyField={"CreditoID"}
                                        defaultSortField={"CreditoID"}
                                        columns={Columns}
                                        expandableRows
                                        // expandOnRowClicked
                                        onRowExpandToggled={(res: any) => {
                                            HiddenData(res)
                                        }}
                                        expandableRowsComponent={<HiddenData />}
                                    /> */}

                <ModalWin open={state.DetalleSaldos || state.Detalle} zIndex={2000} xlarge scrollable>
                  <ModalWin.Header>
                    {/* <div className="d-flex flex-row-reverse">
                                            </div> */}
                    <h5 className={MODAL_TITLE_CLASS}>
                      <strong>
                        <h4>{`Detalle ${DescripcionDistribuidor(1)}`} </h4>
                      </strong>
                      {/* {state.datosDist?.ClasificadorGrupoID == 1 && <span>Grupo: {state.datosDist?.Descripcion}</span>}
                                                {state.datosDist?.ClasificadorGrupoID == 2 && <span>Grupo: {state.datosDist?.ClasificadorGrupoID}</span>} <br /> */}
                      {/* {"Detalle del Socia" + state.datosDist?.ClasificadorGrupoID+ state.datosDist?.Descripcion} <br /> */}
                      <strong>{DescripcionDistribuidor(1)}</strong>
                      {`: ` +
                        state.datosDist?.DistribuidorID +
                        " - " +
                        state.datosDist?.NombreCompleto}{" "}
                      <br />
                      <strong>
                        <h5>
                          {state.datosIncrementos.length > 0
                            ? "Aclaraciones: " + state.datosIncrementos?.length
                            : "Sin aclaraciones"}
                        </h5>
                      </strong>
                      <strong>
                        Estatus: {state.datosDist?.DistribuidoresEstatus}
                      </strong>
                      <>
                        <span
                          data-tip
                          data-for={`DistEsttTooltip`}
                          className="mx-1"
                        >
                          <FaCircle
                            color={`${state.datosDist?.DistEstColor}`}
                          />
                        </span>
                        <ReactTooltip
                          id={`DistEsttTooltip`}
                          type="info"
                          effect="solid"
                          clickable
                          globalEventOff="click"
                        >
                          {state.datosDist?.DistribuidoresEstatus}
                        </ReactTooltip>
                      </>
                      <br />
                    </h5>
                    <button
                      type="button"
                      className="delete"
                      onClick={() => setState({ ...state, Detalle: false, DetalleSaldos: false })}
                    />
                  </ModalWin.Header>
                  <ModalWin.Body>
                    <DataTable
                      data={state.DatosClientes}
                      striped
                      // pagination
                      fixedHeader={true}
                      noDataComponent="Sin clientes con crédito activo."
                      dense
                      noHeader
                      responsive
                      keyField={"ClienteID"}
                      defaultSortAsc={true}
                      defaultSortField={"ClienteID"}
                      columns={DetailColumnsCliente}
                    // expandableRows
                    // expandOnRowClicked
                    // onRowExpandToggled={(res: any) => {
                    //     HiddenData2(res)
                    // }}
                    // expandableRowDisabled={(row: any) => row.ClienteID == null ? true : false}
                    // expandableRowsComponent={<HiddenData2 />}
                    // actions={actionsMemo}
                    />
                  </ModalWin.Body>
                </ModalWin>

                <ModalWin
                  open={state.DetalleCredito}
                  zIndex={2500}
                  xlarge
                  scrollable
                >
                  <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>
                      <strong>
                        <h4>{"Creditos Cliente"} </h4>
                      </strong>
                      <strong>{DescripcionDistribuidor(1)}</strong>
                      {`: ` +
                        state.datosDist?.DistribuidorID +
                        " - " +
                        state.datosDist?.NombreCompleto}{" "}
                      <br />
                      <strong>Cliente: </strong>
                      {state.datosCliente?.ClienteID +
                        " - " +
                        state.datosCliente?.NombreCompleto}
                    </h5>
                    <button
                      type="button"
                      className="delete"
                      onClick={() =>
                        setState({ ...state, DetalleCredito: false })
                      }
                    />
                  </ModalWin.Header>
                  <ModalWin.Body>
                    <DataTable
                      data={state.DatosCreditos}
                      striped
                      // pagination
                      noDataComponent="Cliente no cuenta con Créditos."
                      dense
                      noHeader
                      responsive
                      keyField={"CreditoID"}
                      defaultSortAsc={true}
                      defaultSortField={"CreditoID"}
                      selectableRowSelected={(row: any) =>
                        row.CreditoID > 0 ? true : false
                      }
                      // defaultSortField={"CreditoID"}
                      columns={DetailColumnsCreditos}
                    // expandableRows
                    // // expandOnRowClicked
                    // onRowExpandToggled={(res: any) => {
                    //     HiddenData3(res)
                    // }}
                    // expandableRowDisabled={(row: any) => row.CreditoID == null ? true : false}
                    // expandableRowsComponent={<HiddenData3 />}
                    // actions={actionsMemo}
                    />
                  </ModalWin.Body>
                </ModalWin>

                {/* Inicio Modal Para Mostrar Detalles Cliente */}
                <ModalWin
                  open={ShowClientePerfil}
                  center
                  scrollable
                  full={true}
                  zIndex={3000}
                >
                  <ModalWin.Header>
                    <button
                      type="button"
                      className="delete"
                      onClick={() => setShowClientePerfil(false)}
                    />
                  </ModalWin.Header>
                  <ModalWin.Body>
                    {ShowClientePerfil && (
                      <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-3">
                          <Card Title={<span>Detalles Personales</span>}>
                            <Card.Body>
                              <React.Fragment>
                                <PerfilPersonaParaGlobal
                                  Editar={false}
                                  Persona={
                                    state.Datos2
                                      .Persona as DBConfia_General.IPersonas_VW
                                  }
                                  Direcciones={state.Datos2.Direcciones}
                                  Empleos={state.Datos2.Empleos}
                                  Creditos={
                                    state.Datos2
                                      .Creditos as DBConfia_Creditos.ICreditos_VW
                                  }
                                  oidc={props.oidc}
                                  ui={props.ui}
                                />
                                <div style={{ textAlign: "center" }}>
                                  <button
                                    className={`button ${state.isCancelarTempC
                                      ? "is-warning"
                                      : "is-danger"
                                      } is-outlined waves-effect waves-light mt-2`}
                                  // onClick={FNCancelarTemporalmenteC}
                                  >
                                    <span className="is-hidden-mobile">
                                      {state.isCancelarTempC
                                        ? "Activar Cliente"
                                        : "Bloquear Cliente"}
                                    </span>
                                    &nbsp;
                                    {state.isCancelarTempC ? (
                                      <FaUser />
                                    ) : (
                                      <FaUserSlash />
                                    )}
                                  </button>
                                </div>
                              </React.Fragment>
                            </Card.Body>
                          </Card>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-9">
                          <Card Title="Datos Generales">
                            <Card.Body>
                              <React.Fragment>
                                <DatosPersona
                                  personaID={state.ClienteID}
                                  oidc={props.oidc}
                                  iUI={props.ui}
                                  aclaracion={true}
                                  incremento={true}
                                  prestamo={true}
                                  herramientas={true}
                                  curp={""}
                                  sucursalid={0}
                                  lectorHuella={false}
                                />
                              </React.Fragment>
                            </Card.Body>
                          </Card>
                        </div>
                      </div>
                    )}
                  </ModalWin.Body>
                </ModalWin>
                {/* Fin Modal Para Mostrar Detalles Cliente */}

                {/* Inicio Modal Para Mostrar Detalles Socia */}
                <ModalWin open={ShowSociaPerfil} scrollable center full={true}>
                  <ModalWin.Header>
                    <button
                      type="button"
                      className="delete"
                      onClick={() => setShowSociaPerfil(false)}
                    />
                  </ModalWin.Header>
                  <ModalWin.Body>
                    {ShowSociaPerfil && (
                      <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-3">
                          <Card Title={<span> Detalles Personales
                            {/* <button className="btn btn-outline-secondary" type="button"
                                          style={{ marginLeft: "5px", paddingLeft: '5px', paddingRight: "5px", paddingTop: "2px", paddingBottom: "2px" }}
                                          onClick={() => ConsultarDatos()}>
                                          <FiRefreshCcw />
                                        </button>  */}
                          </span>
                          }
                          >
                            <Card.Body>
                              <React.Fragment>
                                <PerfilPersonaParaGlobal
                                  Editar={false}
                                  Persona={
                                    state.Datos3
                                      .Persona as DBConfia_General.IPersonas_VW
                                  }
                                  Documentos={state.Datos3.Documentos}
                                  Creditos={
                                    state.Datos2
                                      .Creditos as DBConfia_Creditos.ICreditos_VW
                                  }
                                  Direcciones={state.Datos3.Direcciones}
                                  Empleos={state.Datos3.Empleos}
                                  oidc={props.oidc}
                                  ui={props.ui}
                                />
                                <div className="text-center">

                                  <button
                                    className="button is-primary is-outlined waves-effect waves-light mt-2"
                                    onClick={() => {
                                      setState((s) => ({
                                        ...s,
                                        ShowCliente: true,
                                      }));
                                    }}
                                  >

                                    <span className="is-hidden-mobile">
                                      Nuevo Cliente
                                    </span>
                                    &nbsp;
                                    <FaUserPlus />
                                  </button>

                                  {/* {permisoActivar && */}
                                  <button
                                    disabled={
                                      state.isCancelarPermanente ? true : false
                                    }
                                    className={`button ${state.isCancelarTemp
                                      ? "is-warning"
                                      : "is-danger"
                                      } is-outlined waves-effect waves-light mt-2`}
                                    onClick={FNCancelarTemporalmente}
                                  >
                                    <span className="is-hidden-mobile">
                                      {state.isCancelarTemp
                                        ? "Activar Socia"
                                        : "Cancelar Temp."}
                                    </span>
                                    &nbsp;
                                    {state.isCancelarTemp ? (
                                      <FaUser />
                                    ) : (
                                      <FaUserSlash />
                                    )
                                    }
                                  </button>
                                  {/* } */}
                                  {/* Bloqueo permanente de la socia */}
                                  <button
                                    disabled={
                                      state.isCancelarPermanente ? true : false
                                    }
                                    className={`button ${state.isCancelarPermanente
                                      ? "is-primary"
                                      : "is-danger"
                                      } is-outlined waves-effect waves-light mt-2`}
                                    onClick={FNCancelarPermanente}
                                  >
                                    <span className="is-hidden-mobile">
                                      {state.isCancelarPermanente
                                        ? "Bloqueo Permanente"
                                        : "Fallecimiento"}
                                    </span>
                                    &nbsp;
                                    {state.isCancelarPermanente ? (
                                      <FaLock />
                                    ) : (
                                      <FaUser />
                                    )}
                                  </button>
                                </div>
                              </React.Fragment>
                            </Card.Body>
                          </Card>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-9">
                          <Card Title="Socia">
                            <Card.Body>
                              <PerfilDistribuidor
                                DistribuidorID={state.DistribuidorID}
                                oidc={props.oidc}
                                ui={props.ui}
                              />
                              <br />
                              <Acordion TabSelecionado="">
                                <Acordion.Tab
                                  Titulo={
                                    <span>
                                      <FcCalculator size={20} /> SALDOS{" "}
                                    </span>
                                  }
                                  Identificador="Contratos"
                                >
                                  <>
                                    <Tabs
                                      TabSelecionado="contratos"
                                      Justified={false}
                                      Kind={Tabs.TabsKind.CUSTOM}
                                    >
                                      <Tabs.Tab
                                        Identificador="contratos"
                                        Titulo={
                                          <span>
                                            <FcDocument size={20} /> Contratos
                                          </span>
                                        }
                                      >
                                        <div>
                                          <ListadoContratos
                                            //   oidc={props.oidc}
                                            Funciones={
                                              [
                                                // { Control: <button className="btn btn-sm" title="Detalle"><FcDocument size={18} /></button>, Funcion: (contrato) => alert(contrato.LineaCredito) }
                                                // { Control: <button className="btn btn-sm" title="Detalle"><FaEye size={18} /></button>, Funcion: (contrato) => FNShowClientes( /*Estado.Datos.Persona,*/state.Datos3?.Persona?.PersonaID, contrato.ProductoID) }
                                                { Control: <button className="btn btn-sm" title={"Detalle"}><FaEye size={18} /></button>, Funcion: (contrato) => FNShowClientes( /*Estado.Datos.Persona,*/state.Datos3?.Persona?.PersonaID, contrato.ProductoID) }
                                              ]
                                            }
                                            Columnas={[
                                              ListadoContratos.EColumnas.ImporteTotal,
                                              ListadoContratos.EColumnas.LineaCredito,
                                              ListadoContratos.EColumnas.LineaCreditoDisponible,
                                            ]}
                                            oidc={props.oidc}
                                            DatosConsulta={{
                                              DistribuidorID: state.DistribuidorID,
                                            }}
                                          />
                                        </div>
                                      </Tabs.Tab>
                                      {/*Incrementos EVP 16/03/2022  */}
                                      <Tabs.Tab
                                        Identificador="incrementos"
                                        Titulo={
                                          <span>
                                            <FcBullish size={20} /> Incrementos
                                          </span>
                                        }
                                      >
                                        <div>
                                          <Incrementos
                                            Funciones={[
                                              {
                                                Control: (props) => {
                                                  // console.log(props, "props")
                                                  return props.Type == 1 ? (
                                                    <></>
                                                  ) : (
                                                    <ActionFieldNumberText
                                                      disabled={false}
                                                      class={"input"}
                                                      label={""}
                                                      valor={
                                                        props.IncrementoQuincena
                                                      }
                                                      name={
                                                        "IncrementoQuincena"
                                                      }
                                                      id={
                                                        "IncrementoQuincena" +
                                                        props.ContratoID
                                                      }
                                                      placeholder={"$0"}
                                                      typeNumber
                                                      withButton
                                                    />
                                                  );
                                                },
                                                Funcion: (contrato) =>
                                                  setState((e) => ({
                                                    ...e,
                                                    // Refresh: Estado.Refresh + 1,
                                                  })),
                                              },
                                            ]}
                                            Columnas={[
                                              // Incrementos.EColumnas.ImporteTotal,
                                              Incrementos.EColumnas
                                                .LineaCredito,
                                              Incrementos.EColumnas
                                                .LineaCreditoDisponible,
                                              Incrementos.EColumnas
                                                .CapitalColocadoMinimo,
                                              Incrementos.EColumnas
                                                .CapitalColocadoMaximo,
                                            ]}
                                            oidc={props.oidc}
                                            DatosConsulta={{
                                              DistribuidorID:
                                                state.DistribuidorID,
                                            }}
                                            Refresh={0} // Refresh={Estado.Refresh}
                                          />
                                        </div>
                                      </Tabs.Tab>
                                      {/*----------------------------*/}
                                      {/*Decrementos EVP 16/03/2022  */}
                                      <Tabs.Tab
                                        Identificador="decrementos"
                                        Titulo={
                                          <span>
                                            <FcBearish size={20} /> Decrementos
                                          </span>
                                        }
                                      >
                                        <div>
                                          <Decrementos
                                            Funciones={[
                                              {
                                                Control: (props) => {
                                                  // console.log(props, "props")
                                                  return props.Type == 1 ? (
                                                    <></>
                                                  ) : (
                                                    <ActionFieldNumberText
                                                      disabled={false}
                                                      class={"input"}
                                                      label={""}
                                                      valor={props.Decremento}
                                                      name={"Decremento"}
                                                      id={
                                                        "Decremento" +
                                                        props.ContratoID
                                                      }
                                                      placeholder={"$0"}
                                                      typeNumber
                                                      withButton
                                                    />
                                                  );
                                                },
                                                Funcion: (contrato) =>
                                                  setState((e) => ({
                                                    ...e,
                                                    // Refresh: Estado.Refresh + 1,
                                                  })),
                                              },
                                            ]}
                                            Columnas={[
                                              // Incrementos.EColumnas.ImporteTotal,
                                              Decrementos.EColumnas
                                                .LineaCredito,
                                              Decrementos.EColumnas
                                                .LineaCreditoDisponible,
                                              Decrementos.EColumnas
                                                .CapitalColocadoMinimo,
                                              Decrementos.EColumnas
                                                .CapitalColocadoMaximo,
                                            ]}
                                            oidc={props.oidc}
                                            DatosConsulta={{
                                              DistribuidorID:
                                                state.DistribuidorID,
                                            }}
                                            Refresh={0} // Refresh={Estado.Refresh}
                                          />
                                        </div>
                                      </Tabs.Tab>
                                      {/*----------------------------*/}
                                      {/*Prestamos EVP 22/04/2022  */}
                                      {/* <Tabs.Tab Identificador="prestamos" Titulo={<span><FcMoneyTransfer size={20} /> Prestamos Personales</span>}>
                                                                                <div>
                                                                                    <Prestamos
                                                                                        Funciones={[
                                                                                            {
                                                                                                Control: (props) => {

                                                                                                    return (
                                                                                                        <></>
                                                                                                    )
                                                                                                },
                                                                                                Funcion: (datos) => setState(e => ({
                                                                                                    ...e,
                                                                                                }))
                                                                                            }
                                                                                        ]}
                                                                                        Columnas={[
                                                                                            Prestamos.EColumnas.Capital,
                                                                                            Prestamos.EColumnas.ImporteTotal,
                                                                                            Prestamos.EColumnas.Abonos,
                                                                                            Prestamos.EColumnas.SaldoActual,
                                                                                            Prestamos.EColumnas.SaldoAtrasado,
                                                                                            Prestamos.EColumnas.DiasAtraso,
                                                                                            Prestamos.EColumnas.FechaHoraRegistro,
                                                                                            Prestamos.EColumnas.EstatusID,
                                                                                        ]}
                                                                                        oidc={props.oidc}
                                                                                        ProductoID={props.ui.Producto?.ProductoID} DatosConsulta={{
                                                                                            ProductoID: 0,
                                                                                            DistribuidorID: 0,
                                                                                            ClienteID: 0
                                                                                        }} Refresh={0}
                                                                                    />
                                                                                </div>
                                                                            </Tabs.Tab> */}
                                      {/*----------------------------*/}
                                    </Tabs>
                                  </>
                                </Acordion.Tab>
                              </Acordion>
                            </Card.Body>
                          </Card>

                          {/* <Card Title="Socia">
                                                        <Card.Body>
                                                            <React.Fragment>
                                                                <PerfilDistribuidor DistribuidorID={state.DistribuidorID} oidc={props.oidc} ui={props.ui} />
                                                            </React.Fragment>
                                                        </Card.Body>
                                                    </Card> */}

                          <Card Title="Datos Generales">
                            <Card.Body>
                              <React.Fragment>
                                <DatosPersona
                                  personaID={state.DistribuidorID}
                                  oidc={props.oidc}
                                  iUI={props.ui}
                                  aclaracion={true}
                                  incremento={true}
                                  prestamo={true}
                                  herramientas={true}
                                  curp={""}
                                  sucursalid={0}
                                  lectorHuella={false}
                                />
                              </React.Fragment>
                            </Card.Body>
                          </Card>
                        </div>
                      </div>
                    )}
                  </ModalWin.Body>
                </ModalWin>
                {/*Fin Modal Para Mostrar Detalles Socia */}

                <ModalWin
                  open={state.DetallePlan}
                  zIndex={3000}
                  xlarge
                  scrollable
                >
                  <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>
                      <strong>
                        <h4>{"Plan de Pagos"}</h4>
                      </strong>
                      <strong>{DescripcionDistribuidor(1)}</strong>
                      {`: ` +
                        state.datosDist?.DistribuidorID +
                        " - " +
                        state.datosDist?.NombreCompleto}{" "}
                      <br />
                      <strong>Cliente: </strong>
                      {"" +
                        state.datosCliente?.ClienteID +
                        " - " +
                        state.datosCliente?.NombreCompleto}{" "}
                      <br />
                      <strong>{"N° Crédito: "}</strong>
                      {state.CredID}
                    </h5>
                    <button
                      type="button"
                      className="delete"
                      onClick={() => setState({ ...state, DetallePlan: false })}
                    />
                  </ModalWin.Header>
                  <ModalWin.Body>
                    <DataTable
                      data={state.DatosDetalle}
                      striped
                      noDataComponent="Sin plan de pagos."
                      // pagination
                      dense
                      noHeader
                      responsive
                      keyField={"NoPago"}
                      defaultSortAsc={true}
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
                {state.ShowCliente && (
                  <AgregarCliente
                    Item={state.DistribuidorID}
                    oidc={props.oidc}
                    cbActualizar={() => { }}
                    cbGuardar={cbAgregarCliente}
                    fnCancelar={cbCancelarCliente}
                    mostrar={state.ShowCliente}
                  />
                )}
              </div>
              {/* } */}
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

export default connect(mapStateToProps, mapDispatchToProps)(CreditoGlobal);
