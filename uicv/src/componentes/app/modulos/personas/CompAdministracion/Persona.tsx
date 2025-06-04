import React from "react";

// Estado redux
import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
// Componentes personalizadpos
import {
  Card,
  Spinner,
  Tabs,
  Acordion,
  ActionFieldNumberText,
  CustomSelect,
  ActionSelect,
} from "../../../../global";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import { iUI } from "../../../../../interfaces/ui/iUI";
// Sub-Componentes
import * as Funciones from "./CompPersona/Funciones";
import * as FuncionesSocias from "../../creditos/CompCreditos/CreditoGlobal/Funciones";
// Router
import { useParams, Link } from "react-router-dom";
// Iconos
import { FiFile, FiPhone, FiRefreshCcw } from "react-icons/fi";
// Interfaces de base de datos
import { DBConfia_General } from "../../../../../interfaces_db/DBConfia/General";
import { DBConfia_Creditos } from "../../../../../interfaces_db/DBConfia/Creditos";
import { DescripcionDistribuidor } from "../../../../../global/variables";
// Importamos los componentes de presentación
import {
  PerfilPersona,
  PerfilDistribuidor,
  ListadoContratos,
  MenuDistribuidor,
  DatosPersona,
} from "../../../../presentacion";
import {
  FcDocument,
  FcCalculator,
  FcBullish,
  FcBearish,
  FcMoneyTransfer,
  FcBusinesswoman,
  FcManager,
  FcCustomerSupport,
} from "react-icons/fc";
import {
  FaEye,
  FaCircle,
  FaUserPlus,
  FaUserSlash,
  FaUser,
  FaBan,
  FaLock,
  FaClipboard,
  FaAddressBook,
  FaMobile,
} from "react-icons/fa";
import Incrementos from "./Incrementos/Incrementos";
import Decrementos from "./Decrementos/Decrementos";
import Prestamos from "./PrestamosDistribuidores/Prestamos";
import ModalWin, { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";
import DataTable, { IDataTableColumn } from "react-data-table-component";

import ReactTooltip from "react-tooltip";
import moment from "moment";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import * as FnCreditoCondicionDetalle from "../../creditos/CompCreditos/CreditoCondicionDetalle/Funciones";
import * as FnDistribuidores from "../../distribuidor/CompDistribuidor/Distribuidor/Funciones";
import * as FnVariablesGlobales from "../../catalogos/CompCatalogos/CatalogoVariableGlobal/Funciones";
import * as FnProductos from "../../creditos/CompCreditos/CreditoProducto/Funciones";
import * as FnReestructura from "../../creditos/CompCreditos/CreditoComisionReestructura/Funciones";
import * as FnClientes from "../../distribuidor/CompDistribuidor/Cliente/Funciones";
import {
  FiltrarDatos,
  addOneDay,
  formatDate,
  range,
} from "../../../../../global/functions";
import { AgregarCliente } from "../../creditos/CompCreditos/CreditoCliente/AgregarCliente";
import VerEvidencias from "./VerEvidencias";
import { Credito } from "../../creditos/CompCreditos";
import { DBConfia_Cortes } from "../../../../../interfaces_d/DBConfia/Cortes";
import { SolicitudFallecimiento } from "./CompPersona/SolicitudFallecimiento";
import { SolicitudCancelacionTemporal } from "./CompPersona/SolicitudCancelacionTemporal";
import { Modal } from "react-native";
import { CFormSCRS } from "../../creditos/CompCreditos/CreditoSolicitudCRS/CFormSCRS";
import { log } from "console";
import { GrDocumentWord } from "react-icons/gr";
import { fetchLectorHuella } from "./Funciones";
// import { Field } from 'formik'
// Definimos un tipo de persona a mostrar
enum TipoPersona {
  Cliente,
  Distribuidor,
  Coordinador,
  Empleado,
}
/**
 * Tipo del estado del componente
 */
type EstadoTipo = {
  Datos: {
    Persona?: DBConfia_General.IPersonas_VW;
    Direcciones: DBConfia_General.IDirecciones_VW[];
    Empleos: DBConfia_General.IEmpleos_VW[];
    DireccionesMigradas: DBConfia_General.IDireccionesMigradas[];
    Documentos: {};
    Cliente?: {};
  };
  Form: {
    MostrarVerEvidencias: boolean;
  };
  /*FormSolicitudFallecimiento2 : {
        //Observaciones: string,
        //file: string,
        //TipoDocumentoID: number,
        //Ruta: string,
        //SolicitudID: number,

    },*/
  Cargando: boolean;
  Error: boolean;
  isCancelarTemp: boolean;
  isCancelarPermanente: boolean;
  // Cliente
  isCancelarTempC: boolean;
  Refresh: number;
  RefreshPrestamos: number;
  Detalle: boolean;
  DetalleCredito: boolean;
  DetallePlan: boolean;
  datosDist?: DBConfia_Creditos.IGlobal_VW;
  datosDistInfo?: DBConfia_Creditos.IDistribuidoresInfo;
  datosClienteInfo: any[];
  datosCliente?: DBConfia_Creditos.IDistribuidoresClientesGlobalVW;
  DatosClientes: DBConfia_Creditos.IDistribuidoresClientesGlobalVW[];
  DatosCreditos: DBConfia_Creditos.ICreditos_VW[];
  DatosDetalle: DBConfia_Creditos.IPlanPagos[];
  ClientesLiquidados: DBConfia_Cortes.IRelacionCortesDetalle[];
  CredID: number;
  DocumentoID: number;
  Filtros: {
    DirectorID: number;
    ProductoID: number;
    ZonaID: number;
    SucursalID: number;
    GrupoID: number;
    DistribuidorID: number;
    ClienteID: number;
    tipoDias: number;
  };
  DatosInfo: [];
  ListadoC: boolean;
  ProdPresPersonal: number;
  ContratoSel: number;
  ShowCliente: boolean;
  ShowSolicitudFallecimiento: boolean;
  ShowSolicitudCRS: boolean;

  ShowSolicitudCancelTemp: boolean;
  liquidado: boolean;
  EstadoHDR?: string
};
/**
 * Tipo de las propiedades del componente
 */
type PersonaTipo = {
  oidc: IOidc;
  ui: iUI;
  TipoPersona: TipoPersona;
  IdPersona?: number;
};


// Componente de cliente
const Persona = (props: PersonaTipo) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  const MySwal = withReactContent(Swal);
  // Ontenemos el ID de la persona
  type paramType = { id: string };
  let { id } = useParams<paramType>();
  let id_int: number;
  // Checamos si tenemos el Id Persona
  if (props.IdPersona) id_int = props.IdPersona;
  else id_int = parseInt(id as string);
  // Controlamos el estado del control
  let isMounted = React.useRef(true);
  // Definimos el estado del control
  const Datos2: any[] = [];
  const DatosDefecto = {
    Observaciones: "",
    file: "",
    Ruta: "",
    SolicitudID: 0,
  };

  const Datos3: any[] = [];
  const DatosDefectoCancelTemp = {
    Observaciones: "",
    SolicitudID: 0,
  };
  const Datos4: any[] = [];
  const DatosSCRS: any = {};
  const DatosDefectoReestructura = {
    saldoActual: 0,
    saldoAtrasado: 0,
    porcentaje: 0,
    saldoActual2: 0,
    saldoAtrasado2: 0,
    saldoActual3: 0,
    saldoAtrasado3: 0,
  };

  const [state, setState] = React.useState({
    Datos2,
    Datos3,
    Datos4,
    Cargando: true,
    Error: false,
    FormSolicitudFallecimiento: { Datos2: DatosDefecto },
    FormSolicitudCancelacionTemp: { Datos3: DatosDefectoCancelTemp },
    FormReestructura: { Datos4: DatosDefectoReestructura },
    FormSolicitudSCRS: {
      DatosSCRS: {
        saldoActual: 0,
        saldoAtrasado: 0,
        porcentaje: 0,
        saldoActual2: 0,
        saldoAtrasado2: 0,
        saldoActual3: 0,
        saldoAtrasado3: 0,
      },
    },
  });

  const quita: number[] = [10, 15, 20, 25, 30, 35, 40];
  const [Estado, DefinirEstado] = React.useState<EstadoTipo>({
    Datos: {
      Persona: undefined,
      Empleos: [],
      Direcciones: [],
      DireccionesMigradas: [],
      Documentos: {},
      Cliente: undefined,
    },
    Cargando: true,
    Error: false,
    isCancelarTemp: false,
    isCancelarPermanente: false,
    //CancelarTemporalmenteCliente
    isCancelarTempC: false,
    Refresh: 0,
    RefreshPrestamos: 0,
    Detalle: false,
    DetalleCredito: false,
    liquidado: false,
    DetallePlan: false,
    datosClienteInfo: [],
    DatosClientes: [],
    DatosCreditos: [],
    DatosDetalle: [],
    ClientesLiquidados: [],
    CredID: 0,
    EstadoHDR: '',
    DocumentoID: 0,
    Filtros: {
      DirectorID: 0,
      ProductoID: 0,
      ZonaID: 0,
      SucursalID: 0,
      GrupoID: 0,
      DistribuidorID: 0,
      ClienteID: 0,
      tipoDias: 0,
    },
    datosCliente: undefined,
    DatosInfo: [],
    ListadoC: true,
    ProdPresPersonal: 0,
    ContratoSel: 0,
    ShowCliente: false,
    ShowSolicitudFallecimiento: false,
    ShowSolicitudCancelTemp: false,
    ShowSolicitudCRS: false,

    Form: {
      MostrarVerEvidencias: false,
    },
  });

  const Titulo = () => (
    <div className="page-title-box">
      {/* <h4>Administración</h4>
            <ol className="breadcrumb m-0">
                <li className="breadcrumb-item"><Link to="/app/administracion">Administración</Link></li>
                <li className="breadcrumb-item"><Link to="/app/administracion/personas/distribuidores">Socias</Link></li>
                <li className="breadcrumb-item active">{id}</li>
            </ol> */}
    </div>
  );
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
  // Funcion para obtener la persona del servicio web
  const ConsultarDatos = async () => {
    try {
      // Cacheamos el estado
      DefinirEstado((e) => ({
        ...e,
        Datos: {
          Persona: undefined,
          Direcciones: [],
          Documentos: {},
          Empleos: [] /*Creditos: [],*/,
          DireccionesMigradas: [],
        },
        Cargando: true,
        Error: false,
      }));
      // Obtenemos la persona
      let resultado = await Funciones.FNObtenerPersona(props.oidc, id_int);
      console.log("resultado", resultado);
      // Si nuestro componente esta montado
      if (isMounted)
        // Definimos el estado
        DefinirEstado((e) => ({
          ...e,
          Datos: {
            Persona: resultado.persona,
            Direcciones: resultado.direcciones,
            Empleos: resultado.empleos,
            Documentos: resultado.documentos,
            DireccionesMigradas: resultado.direccionesMigradas,
            /* Creditos: [],*/
          },
          EstadoHDR: resultado.persona.DistribuidoresEstatusID,
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
        DefinirEstado((e) => ({
          ...e,
          Datos: {
            Persona: undefined,
            Direcciones: [],
            Documentos: {},
            Empleos: [] /* Creditos: [],*/,
            DireccionesMigradas: [],
          },
          Cargando: false,
          Error: true,
        }));
    }
  };

  const fnDeshabilitarAppsocia = () => {
    MySwal.fire({
      title: "<strong>Deshabilitar Appsocia</strong>",
      icon: "question",
      html: (
        <div className="text-center">
          Se deshabilitará la AppSocia para este distribuidor. ¿Desea continuar?
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
        Funciones.FNDeshabilitarAppSocia(props.oidc, Estado.Datos.Persona?.PersonaID!)
          .then(() => {
            toast.success("AppSocia deshabilitada correctamente");
          })
          .catch((error: any) => {
            console.log(JSON.stringify(error));
            toast.error(
              "Error al deshabilitar AppSocia, intente nuevamente o reportarlo a sistemas"
            );
          });
      }
    });
  };

  const fnImprimirPDFSocia = () => {
    MySwal.fire({
      title: "<strong>Descargar Detalle de Socia</strong>",
      icon: "question",
      html: (
        <div className="text-center">
          Se descargara el Detalle de Socia ¿Desea continuar?
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
        Funciones.FNGetDistribuidorPDF(props.oidc, {
          Id: Estado.Datos.Persona?.PersonaID!,
        })
          .then((pdf: any) => {
            const file = new Blob([pdf], {
              type: "application/pdf",
            });

            var url = window.URL.createObjectURL(file);
            var anchor = document.createElement("a");
            anchor.download = "myfile.pdf";
            anchor.href = url;
            anchor.click();
          })
          .catch((error: any) => {
            console.log(JSON.stringify(error));

            toast.error(
              "Error al descargar el archivo, intente descargar el archivo nuevamente o reportarlo a sistemas"
            );
          });
      }
    });
  };

  const fnImprimirCartaCobroSocia = () => {
    MySwal.fire({
      title: "<strong>Descargar Carta Cobro Socia</strong>",
      icon: "question",
      html: (
        <div className="text-center">
          Se descargara la Carta Cobro Socia ¿Desea continuar?
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
        Funciones.FNGetDistribuidorCartaCobro(props.oidc, {
          Id: Estado.Datos.Persona?.PersonaID!,
        })
          .then((pdf: any) => {
            const file = new Blob([pdf], {
              type: "application/pdf",
            });

            var url = window.URL.createObjectURL(file);
            var anchor = document.createElement("a");
            anchor.download = "myfile.pdf";
            anchor.href = url;
            anchor.click();
          })
          .catch((error: any) => {
            console.log(JSON.stringify(error));

            toast.error(
              "Error al descargar el archivo, intente descargar el archivo nuevamente o reportarlo a sistemas"
            );
          });
      }
    });
  };
  const ObtenerDistribuidorSCRS = () => {
    console.log('estatussss', Estado.Datos.Persona?.DistribuidoresEstatusID)
    let obj = {
      DistribuidorID: id_int,
    };
    FnReestructura.FNGet(props.oidc, obj)
      .then((res: any) => {
        console.log(res.data);
        setState((s) => ({
          ...s,
          FormSolicitudSCRS: {
            ...s.FormSolicitudSCRS,
            DatosSCRS: {
              saldoActual: res.EstatusID === 'C' ? res.saldoReconvenio : res.saldoActualSalida,
              saldoAtrasado: res.EstatusID === 'C' ? res.saldoAtrasadoReconvenio : res.saldoAtrasadoSalida,
              saldoActual2: res.saldoAtrasadoSalida,
              saldoAtrasado2: res.saldoAtrasadoSalida,
              saldoActual3: res.saldoActualSalida,
              saldoAtrasado3: res.saldoAtrasadoSalida,
              porcentaje: 0,
            },
          },
        }));
      })
      .catch((error: any) => {
        toast.error(`Error: ${error.response.data.msg}`);
      });
  };
  const ObtenerDistribuidor = () => {
    let obj = {
      DistribuidorID: id_int,
    };
    FnReestructura.FNGet(props.oidc, obj)
      .then((res: any) => {
        console.log(res.data);
        setState((s) => ({
          ...s,
          FormReestructura: {
            ...s.FormReestructura,
            Datos4: {
              saldoActual: res.saldoActual,
              saldoAtrasado: res.saldoAtrasado,
              saldoActual2: res.saldoActual,
              saldoAtrasado2: res.saldoAtrasado,
              saldoActual3: res.saldoActual,
              saldoAtrasado3: res.saldoAtrasado,
              porcentaje: 0,
              /*   saldoActual2: res.saldoActual,
                              saldoAtrasado2: res.saldoAtrasado,
                              saldoActual3: res.saldoActual,
                              saldoAtrasado3: res.saldoAtrasado, */
            },
          },
        }));
      })
      .catch((error: any) => {
        // console.log(`Error`, error);
        toast.error(`Error al cargar datos`);
      });
  };

  const permisoActivar = props.ui.PermisosProductos?.find(
    (p) => p.PermisoID == 2786
  );

  const fnVerEvidencia = () => {
    DefinirEstado((s) => ({
      ...s,
      Form: {
        ...s.Form,
        fnVerEvidenvia: true,
      },
    }));
  };
  const FNGetInfoDistribuidor = (DistribuidorID: number) => {
    FuncionesSocias.FNGetInfDistribuidor(props.oidc, DistribuidorID)
      .then((respuesta: any) => {
        DefinirEstado((s) => ({
          ...s,
          datosDistInfo: respuesta,
          Cargando: false,
        }));
      })
      .catch(() => {
        // if (isMounted.current === true) {
        DefinirEstado((s) => ({
          ...s,
          datosDistInfo: undefined,
          Cargando: false,
        }));
        // DefinirEstado(s => ({ ...s, DetallePlan: false, DatosDetalle: [] }))
        toast.error("Error al consultar, vuelva a intentarlo");
        // }
      });
  };
  const FNShowClientes = (
    /*Data: any,*/ DistribuidorID: any,
    ProductoID: any
  ) => {
    DefinirEstado((s) => ({
      ...s,
      /*datosDist: Data,*/ Detalle: true,
      ContratoSel: ProductoID,
    }));
  };
  const FNGetClientes = (DistribuidorID: any, ProductoID: any) => {
    SwalWarning("Aviso", "Obteniendo Clientes.");
    DefinirEstado((s) => ({ ...s, /* datosDist: Data,*/ DatosClientes: [] }));
    FNGetInfoDistribuidor(DistribuidorID);
    FuncionesSocias.FNGetInfClientesProducto(
      props.oidc,
      DistribuidorID,
      ProductoID
    )
      .then((respuesta: any) => {
        if (respuesta.length > 0) {
          let tabla: any[] = [];
          let Capital = 0;
          let ImporteTotal = 0;
          let Interes = 0;
          let SaldoActual = 0;
          let SaldoAtrasado = 0;
          let Seguro = 0;
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
            };
            Capital += element.Capital;
            ImporteTotal += element.ImporteTotal;
            Interes += element.Interes;
            SaldoActual += element.SaldoActual;
            SaldoAtrasado += element.SaldoAtrasado;
            Seguro += element.Seguro;
            tabla.push(Clientes);
          });
          let TotalCliente: any = {
            Capital,
            ClienteID: null,
            DiasAtraso: 0,
            DistribuidorID: 0,
            FechaHoraUltimoPago: "",
            ImporteTotal,
            Interes,
            MovCli: 0,
            NombreCompleto: "TOTAL",
            PagoMod: 0,
            PagosAtrasados: 0,
            SaldoActual,
            SaldoAtrasado,
            Seguro,
          };
          tabla.push(TotalCliente);
          // DefinirEstado(s => ({ ...s, Datos: tabla, Cargando: false }))
          DefinirEstado((s) => ({
            ...s,
            /*datosDist: Data,*/ Detalle: true,
            DatosClientes: tabla,
          }));
          MySwal.close();
        } else {
          DefinirEstado((s) => ({
            ...s,
            /* datosDist: Data,*/ Detalle: true,
            DatosClientes: [],
          }));
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
          DefinirEstado((s) => ({ ...s, Detalle: false, DatosClientes: [] }));
          MySwal.close();
          toast.error("Error al obtener los clientes");
        }
      });
  };
  const fnMostrarImagenesEvidencia = (cotizacion: boolean) => {
    console.log("cotizacion", cotizacion);
    DefinirEstado((s) => ({
      ...s,
      Form: { ...s.Form, MostrarVerEvidencias: true },
      Cotizacion: cotizacion,
    }));
  };
  const FNGetDetalle = (Data: any, CreditoID: number) => {
    FuncionesSocias.FNGetPlanPagosClienteProd(props.oidc, CreditoID)
      .then((respuesta: any) => {
        // console.log("Fecha Vencimiento: ", respuesta)
        if (respuesta.length > 0) {
          // DefinirEstado(s => ({ ...s, MultiSaldoCajaID: respuesta[0].MultisaldosCajaID }))
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
          // DefinirEstado(s => ({ ...s, Datos: tabla, Cargando: false }))
          DefinirEstado((s) => ({
            ...s,
            datosPagos: Data,
            DetallePlan: true,
            DatosDetalle: tabla,
            CredID: CreditoID,
          }));
        } else {
          DefinirEstado((s) => ({
            ...s,
            datosPagos: Data,
            DetallePlan: true,
            DatosDetalle: [],
            CredID: CreditoID,
          }));
        }
        // console.log(respuesta, "respPLANPAGOS")
        // console.log(CreditoID)
        // let creditos = Estado.DatosDetalle.find(Dato => Dato.CreditoID === CreditoID)
        // DefinirEstado(s => ({ ...s, datosPagos: creditos, CredID: CreditoID }))
        // if (isMounted.current === true) {
        // DefinirEstado(s => ({ ...s, DetallePlan: true, DatosDetalle: respuesta }))
        // }
      })
      .catch(() => {
        // if (isMounted.current === true) {
        DefinirEstado((s) => ({ ...s, DetallePlan: false, DatosDetalle: [] }));
        toast.error("Error al consultar, vuelva a intentarlo");
        // }
      });
  };
  const FNGCreditosCliente = (Data: any, ClienteID: number) => {
    SwalWarning("Aviso", "Obteniendo plan de pagos.");
    FuncionesSocias.FNGetCreditosProdCliente(props.oidc, ClienteID)
      .then((respuesta: any) => {
        // console.log("respCreditos: ", respuesta)
        if (respuesta.length > 0) {
          // DefinirEstado(s => ({ ...s, MultiSaldoCajaID: respuesta[0].MultisaldosCajaID }))
          let tabla: any[] = [];
          let Capital = 0;
          let ImporteTotal = 0;
          let Abonos = 0;
          let Interes = 0;
          let SaldoActual = 0;
          let SaldoAtrasado = 0;
          let Seguro = 0;
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
            tabla.push(Creditos);
          });
          let TotalCreditos: any = {
            CreditoID: null,
            Capital,
            ImporteTotal,
            Abonos,
            SaldoActual,
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
          // DefinirEstado(s => ({ ...s, Datos: tabla, Cargando: false }))
          DefinirEstado((s) => ({
            ...s,
            datosCliente: Data,
            DetalleCredito: true,
            DatosCreditos: tabla,
          }));
          MySwal.close();
        } else {
          DefinirEstado((s) => ({
            ...s,
            datosCliente: Data,
            DetalleCredito: true,
            DatosCreditos: [],
          }));
          MySwal.close();
        }
        // let cliente = Estado.DatosClientes.find(Dato => Dato.ClienteID === ClienteID)
        // DefinirEstado(s => ({ ...s, datosCliente: cliente }))
        // // if (isMounted.current === true) {
        // DefinirEstado(s => ({ ...s, DetalleCredito: true, DatosCreditos: respuesta }))
        // // }
      })
      .catch(() => {
        // if (isMounted.current === true) {
        DefinirEstado((s) => ({
          ...s,
          DetalleCredito: false,
          DatosCreditos: [],
        }));
        MySwal.close();
        toast.error("Error al obtener los creditos del cliente");
        // }
      });
  };
  const FNObtenerCliente = () => {
    FnClientes.FNGetbyId(props.oidc, { ClienteID: id_int, ProductoID: 0 })
      .then((respuesta: any) => {
        DefinirEstado((s) => ({ ...s, datosClienteInfo: [respuesta] }));
      })
      .catch(() => {
        DefinirEstado((s) => ({ ...s, datosClienteInfo: [] }));
      });
  };
  const ColumnsClienteSaldo: //= React.useMemo(() => {
    IDataTableColumn[] = [
      {
        name: "",
        selector: "",
        sortable: false,
        width: "90%",
        cell: (props) => <span>Ver detalle de los créditos del cliente</span>,
      },
      {
        name: "Acción",
        selector: "ClienteID",
        sortable: false,
        width: "8%",
        cell: (props) => (
          <button
            data-tip
            data-for={`DetalleClieTooltip${props.ClienteID}`}
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
                { ClienteID: props.ClienteID, NombreCompleto: "" },
                props.ClienteID
              );
            }}
          >
            <FaEye />
          </button>
        ),
      },
    ];
  const DetailColumnsCliente: //= React.useMemo(() => {
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
        width: "200px",
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
          <>
            <span
              style={{ width: "200px", whiteSpace: "nowrap", overflow: "hidden" }}
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
      },
      {
        name: "Imp Total",
        width: "100px",
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
        width: "100px",
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
        name: "Atrasos",
        width: "100px",
        center: true,
        selector: "PagosAtrasados",
        sortable: false,
        cell: (props) =>
          props.ClienteID != null ? (
            <span>{props.PagosAtrasados}</span>
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
        name: "Días Atr",
        width: "100px",
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
        ],
      },
      {
        name: "Fch Último Pag",
        width: "130px",
        selector: "FechaHoraUltimoPago",
        sortable: false,
        cell: (props) => (
          <span>
            {props.FechaHoraUltimoPago
              ? moment(props.FechaHoraUltimoPago).format("DD/MM/YYYY")
              : "00/00/0000"}
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
        width: "100px",
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
      {
        name: "Pago Moda",
        width: "100px",
        selector: "PagoMod",
        sortable: false,
        format: (row) => formatter.format(row.PagoMod),
        cell: (props) =>
          props.ClienteID != null ? (
            <span>{formatter.format(props.PagoMod)}</span>
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
        name: "Créditos",
        sortable: false,
        wrap: true,
        width: "60px",
        center: true,
        cell: (data) =>
          data.ClienteID != null ? (
            <div
              style={{ width: "75px", overflowX: "auto", whiteSpace: "nowrap" }}
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
                  FNGCreditosCliente(data, data.ClienteID);
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
        // FNGCreditosCliente
      },
      // { name: '', selector: '', sortable: false, },
      // { name: 'Fecha Liquidacion', width: '110px', selector: 'FechaLiquidacion', sortable: true, cell: (props) => <span>{props.FechaLiquidacion ? moment(props.FechaLiquidacion).format('DD/MM/YYYY') : ''}</span> },
      // { name: 'Dias Atraso', selector: 'DiasAtraso', sortable: true, },
    ];
  //return colRet
  //}, [])
  const DetailColumnsCreditos: //= React.useMemo(() => {
    //let colRet:
    IDataTableColumn[] = [
      {
        name: "Crédito",
        width: "95px",
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
        name: "Atrasado",
        width: "80px",
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
        name: "Días Atr",
        width: "60px",
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
        name: "Fecha Registro",
        width: "110px",
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
      {
        name: "Estatus",
        selector: "EstatusID",
        sortable: false,
        center: true,
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
        // FNGCreditosCliente
      },
      {
        name: "Documentos",
        sortable: false,
        center: true,
        wrap: true,
        cell: (data) =>
          data.CreditoID != null ? (
            <div
              style={{ width: "25%", overflowX: "auto", whiteSpace: "nowrap" }}
            >
              <button
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
                  console.log("DACLICK");
                  fnMostrarImagenesEvidencia(true);
                }}
              >
                <FaEye />
              </button>
              <ReactTooltip
                type="info"
                effect="solid"
                clickable
                globalEventOff="click"
              >
                Ver Documentos
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
        // FNGCreditosCliente
      },
    ];
  const evidencias: //= React.useMemo(() => {
    //let colRet:
    IDataTableColumn[] = [
      {
        name: "Pagare Frente",
        sortable: false,
        center: true,
        wrap: true,
        cell: (row: any) => (
          <div style={{ width: "25%", overflowX: "auto", whiteSpace: "nowrap" }}>
            <button
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
              onClick={() => { }}
            >
              <FaEye />
            </button>
            <ReactTooltip
              type="info"
              effect="solid"
              clickable
              globalEventOff="click"
            >
              Ver Plan de Pagos
            </ReactTooltip>
          </div>
        ),
        // FNGCreditosCliente
      },
      {
        name: "Pagare Trasero",
        sortable: false,
        center: true,
        wrap: true,
        cell: (row: any) => (
          <div style={{ width: "25%", overflowX: "auto", whiteSpace: "nowrap" }}>
            <button
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
              onClick={() => { }}
            >
              <FaEye />
            </button>
            <ReactTooltip
              type="info"
              effect="solid"
              clickable
              globalEventOff="click"
            >
              Ver Documentos
            </ReactTooltip>
          </div>
        ),
        // FNGCreditosCliente
      },
    ];
  //     return colRet
  // }, [])
  const DetailColumns: //= React.useMemo(() => {
    //let colRet:
    IDataTableColumn[] = [
      {
        name: "# Pago",
        width: "100px",
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
        format: (row) => formatter.format(row.SaldoActual),
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
        width: "100px",
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
                ? moment(props.FechaLiquidacion).format("DD/MM/YYYY")
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

  const cbAgregarCliente = (item: any) => {
    console.log("item: ", item);
    if (item.res == 1) {
      toast.success(item.msj);
    }
    if (item.res == 2) {
      toast.warning(item.msj);
    }
    DefinirEstado((s) => ({ ...s, ShowCliente: false }));
  };

  const cbCancelarCliente = () =>
    DefinirEstado((s) => ({ ...s, ShowCliente: false, VerEvidencias: false }));

  const cbAgregarSolicitud2 = (item: any) => {
    console.log("item: ", item);
    if (item.res == 1) {
      toast.success(item.msj);
    }
    if (item.res == 2) {
      toast.warning(item.msj);
    }
    DefinirEstado((s) => ({ ...s, ShowSolicitudFallecimiento: false }));
  };

  const cbAgregarSolicitud = (item: any) => {
    setState({
      ...state,
      Datos2: [...state.Datos2, item],
      FormSolicitudFallecimiento: {
        ...state.FormSolicitudFallecimiento,
        Datos2: {
          Observaciones: "",
          file: "",
          SolicitudID: 0,
          Ruta: "",
        },
      },
    });
  };

  const cbAgregarSolicitudCT = (item: any) => {
    setState({
      ...state,
      Datos3: [...state.Datos3, item],
      FormSolicitudCancelacionTemp: {
        ...state.FormSolicitudCancelacionTemp,
        Datos3: {
          Observaciones: "",
          SolicitudID: 0,
        },
      },
    });
  };

  const cbActualizarSolicitud = (item: any) =>
    setState({
      ...state,
      FormSolicitudFallecimiento: {
        ...state.FormSolicitudFallecimiento,
        Datos2: {
          Observaciones: "",
          file: "",
          SolicitudID: 0,
          Ruta: "",
        },
      },
    });

  const cbActualizarSolicitudCT = (item: any) =>
    setState({
      ...state,
      FormSolicitudCancelacionTemp: {
        ...state.FormSolicitudCancelacionTemp,
        Datos3: {
          Observaciones: "",
          SolicitudID: 0,
        },
      },
    });

  const cbCancelarSolicitud = () =>
    DefinirEstado((s) => ({
      ...s,
      ShowSolicitudFallecimiento: false,
      VerEvidencias: false,
    }));

  const cbCancelarSolicitudCT = () =>
    DefinirEstado((s) => ({
      ...s,
      ShowSolicitudCancelTemp: false,
      VerEvidencias: false,
    }));

  const fnGetDistribuidores = (SucursalID?: number) => {
    if (SucursalID! > 0)
      FnDistribuidores.FNGetBySucursalProd(props.oidc, SucursalID)
        .then((respuesta: any) => {
          var distribuidores = respuesta.map((valor: any) => {
            var obj = {
              value: valor.DistribuidorID,
              label: valor.PersonaNombre,
            };
            return obj;
          });
          DefinirEstado((s) => ({
            ...s,
            optDistribuidores: distribuidores,
            Distribuidores: respuesta,
          }));
        })
        .catch(() => {
          DefinirEstado((s) => ({
            ...s,
            optDistribuidores: [],
            Distribuidores: [],
          }));
        });
  };

  const fnGetCondicionesDetalle = (
    ProductoID: number,
    SucursalId?: number,
    DistribuidorID?: number
  ) => {
    let Datos = {
      ProductoID,
      SucursalId: SucursalId as number,
      DistribuidorID: DistribuidorID as number,
    };
    if (ProductoID! > 0 && SucursalId! > 0)
      FnCreditoCondicionDetalle.FNGetCondicionesAdminProd(props.oidc, Datos)
        .then((respuesta: any) => {
          let arr = range(
            respuesta[0].ImporteMinimo,
            respuesta[0].ImporteMaximo,
            500
          );
          arr = arr.reverse();
          let capital = arr.map((valor: any) => {
            var obj = { value: valor, label: valor };
            return obj;
          });
          arr = range(
            respuesta[0].PlazosMinimos,
            respuesta[0].PlazosMaximos,
            2
          );
          arr = arr.reverse();
          let plazos = arr.map((valor: any) => {
            var obj = { value: valor, label: valor };
            return obj;
          });
          DefinirEstado((s) => ({
            ...s,
            CondicionesDetalle: respuesta,
            optCapital: capital,
            optPlazos: plazos,
          }));
        })
        .catch(() => {
          DefinirEstado((s) => ({
            ...s,
            CondicionesDetalle: [],
            optCapital: [],
            optPlazos: [],
          }));
        });
  };
  const FNGetVariablesGlobales = () => {
    let datos = { Id: 0, varName: "" };
    if (props.ui.Producto?.EmpresaId == 6) {
      datos = { Id: 29, varName: "PROD_PREST_PERSONAL_PS" };
    } else {
      datos = { Id: 30, varName: "PROD_PREST_PERSONAL_CV" };
    }
    FnVariablesGlobales.FNGet(props.oidc, datos)
      .then((respuesta: any) => {
        // console.log('respuesta: ', respuesta)
        DefinirEstado((s) => ({ ...s, ProdPresPersonal: respuesta.varValue }));
      })
      .catch(() => {
        DefinirEstado((s) => ({ ...s, ProdPresPersonal: 0 }));
      });
  };

  const permisoActivars = props.ui.PermisosProductos?.find(
    (p) => p.PermisoID == 100000
  );

  const FNGetProdPresPer = () => {
    console.log("EmpresaId: ", props.ui.Producto?.EmpresaId);
    FnProductos.FNGetProdPresPer(props.oidc, props.ui.Producto?.EmpresaId)
      .then((respuesta: any) => {
        // console.log('respuesta: ', respuesta)
        DefinirEstado((s) => ({
          ...s,
          ProdPresPersonal: respuesta.ProductoID,
        }));
      })
      .catch(() => {
        DefinirEstado((s) => ({ ...s, ProdPresPersonal: 0 }));
      });
  };

  const FnActivarTemporalmente = () => {
    // toast.error("No cuentas con el permiso para activar socia");

    MySwal.fire({
      icon: "warning",
      html: (
        <div>
          <br />
          <h3 className="text-center">Atenci&oacute;n</h3>
          <div className={`modal-body`}>
            <h5 className="text-center">{"¿Deseas activar a la socia?"}</h5>
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
          FnDistribuidores.FNActivarTemporalmente(props.oidc, {
            Id: id_int,
            DistribuidoresEstatusID: "N",
          })
            .then(() => {
              ConsultarDatos();
              toast.success("Socia activada correctamente");
            })
            .catch((err) => {
              toast.error("No se pudo activar a la socia: " + err);
            });
        }
      })
      .catch(() => toast.error("Ocurrio un error inesperado"));
  };

  const FnCancelarTemporalmente = () => {
    MySwal.fire({
      title: "<strong>Cancelación Temporal Socia</strong>",
      icon: "warning",
      html: (
        <div className="text-center">
          Se cancelara temporalmente a la socia ¿Desea continuar?
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
        FnDistribuidores.FNCancelarTemporalmente(props.oidc, {
          Id: Estado.Datos.Persona?.PersonaID!,
          DistribuidoresEstatusID: "T",
        })
          .then(() => {
            ConsultarDatos();
            toast.success("Socia cancelada temporalmente correctamente");
          })
          .catch((err) => {
            toast.error("No se pudo cancelar temporalmente a la socia: " + err);
          });
      }
    });
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
            Id: id_int,
            DistribuidoresEstatusID: Estado.isCancelarPermanente ? "N" : "F",
          })
            .then(() => {
              ConsultarDatos();
              if (!Estado.isCancelarPermanente) {
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

  // funcion para cancelar temporalmente al cliente

  const FNCancelarTemporalmenteC = () => {
    MySwal.fire({
      icon: "warning",
      html: (
        <div>
          <br />
          <h3 className="text-center">Atenci&oacute;n</h3>
          <div className={`modal-body`}>
            <h5 className="text-center">
              {!Estado.isCancelarTempC
                ? "¿Deseas activar al cliente?"
                : "¿Deseas cancelar temporalmente al cliente?"}
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
          // FnDistribuidores.FNCancelarTemporalmenteC(props.oidc, { Id: id_int, CanjeaVale: !Estado.isCancelarTempC })
          FnDistribuidores.FNCancelarTemporalmenteC(props.oidc, {
            Id: id_int,
            CanjeaVale: Estado.isCancelarTempC ? true : false,
          })
            .then(() => {
              ConsultarDatos();
              // toast.success(Estado.isCancelarTempC ? "Cliente cancelado temporalmente" : "Cliente activado correctamente")
              toast.success(
                !Estado.isCancelarTempC
                  ? "Cliente activado correctamente"
                  : "Cliente cancelado temporalmente"
              );
            })
            .catch((err) => {
              toast.error(
                "No se pudo cancelar temporalmente al cliente: " + err
              );
            });
        }
      })
      .catch(() => toast.error("Ocurrio un error inesperado"));
  };

  React.useEffect(() => {
    // Consultamos los datos
    console.log("Detalle", Estado.Detalle)
    if (Estado.Detalle)
      FNGetClientes(Estado.Datos.Persona?.PersonaID, Estado.ContratoSel);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Estado.Detalle]);
  // Defninimos nuestro proceso para la carga inicial de datos
  React.useEffect(() => {
    console.log("Persona props ui", props.ui.Producto);

    // FNGetProdPresPer()
    // FNGetVariablesGlobales()
    // Consultamos los datos
    ConsultarDatos();
    //Si es tipo cliente
    if (props.TipoPersona === TipoPersona.Cliente) FNObtenerCliente();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id_int]);

  // FUNCION PARA LLAMAR EL MODAL DE CONVENIOS Y REESTRUCTURAS
  const toggleModalSolicitudCRS = () => {
    DefinirEstado((s) => ({
      ...s,
      ShowSolicitudCRS: !Estado.ShowSolicitudCRS,
    }));
  };
  const [lectorHuellaValue, setLectorHuellaValue] = React.useState(false);
  React.useEffect(() => {
    FNGetProdPresPer();
    ObtenerDistribuidorSCRS();
  }, [props.ui.Producto]);
  // Call fetchLectorHuella when the component mounts
  React.useEffect(() => {
    if (props.oidc) {
      fetchLectorHuella(props.oidc, id_int)
        .then((respuesta: any) => {
          console.log("Sucursal persona", respuesta)
          setLectorHuellaValue(respuesta)
        })


    }
  }, [props.oidc]); // Re-run the effect if oidc changes

  if (Estado.Cargando)
    return (
      <div className="row">
        <div className="col-sm-12">
          <Titulo />
          <Card>
            <Card.Body>
              <div className="text-center">
                <Spinner />
                <br />
                <strong>Cargando Datos</strong>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  else if (!Estado.Cargando && Estado.Error)
    return (
      <div className="row">
        <div className="col-sm-12">
          <Titulo />
          <Card>
            <Card.Body>
              <div className="text-center">
                <span>Error al cargar los datos</span>
                <br />
                <button
                  onClick={ConsultarDatos}
                  className="btn btn-sm btn-link"
                >
                  <FiRefreshCcw />{" "}
                </button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  else if (Estado.Datos.Persona !== undefined)
    return (
      <div>
        <div className="page-title-box">
          {/* <h4>Administración</h4>
                    <ol className="breadcrumb m-0">
                        <li className="breadcrumb-item"><Link to="/app/administracion">Administración</Link></li>
                        <li className="breadcrumb-item"><Link to="/app/administracion/personas/distribuidores">Socias</Link></li>
                        <li className="breadcrumb-item active">{id}</li>
                    </ol> */}
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-3">
            <Card
              Title={
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Detalles Personales</span>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    {props.TipoPersona === TipoPersona.Distribuidor && (
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        title="Deshabilitar AppSocia"
                        style={{
                          marginLeft: "5px",
                          paddingLeft: "5px",
                          paddingRight: "5px",
                          paddingTop: "2px",
                          paddingBottom: "2px",
                        }}
                        onClick={() => fnDeshabilitarAppsocia()}
                      >
                        <FaMobile />
                      </button>
                    )}
                    {props.TipoPersona === TipoPersona.Distribuidor && (
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        title="Imprimir detalles socia"
                        style={{
                          marginLeft: "5px",
                          paddingLeft: "5px",
                          paddingRight: "5px",
                          paddingTop: "2px",
                          paddingBottom: "2px",
                        }}
                        onClick={() => fnImprimirPDFSocia()}
                      >
                        <FiFile />
                      </button>
                    )}
                    {props.TipoPersona === TipoPersona.Distribuidor && (
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        title="Imprimir Carta Cobro"
                        style={{
                          marginLeft: "5px",
                          paddingLeft: "5px",
                          paddingRight: "5px",
                          paddingTop: "2px",
                          paddingBottom: "2px",
                        }}
                        onClick={() => fnImprimirCartaCobroSocia()}
                      >
                        <GrDocumentWord />
                      </button>
                    )}
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      style={{
                        marginLeft: "5px",
                        paddingLeft: "5px",
                        paddingRight: "5px",
                        paddingTop: "0px",
                        paddingBottom: "5px",
                      }}
                      onClick={() => ConsultarDatos()}
                    >
                      <FiRefreshCcw />
                    </button>
                  </div>
                </div>
              }
            >
              <Card.Body>
                <React.Fragment>
                  <PerfilPersona
                    Editar={true}
                    canceladoTemp={Estado.isCancelarTemp}
                    Persona={Estado.Datos.Persona}
                    Direcciones={Estado.Datos.Direcciones}
                    Empleos={Estado.Datos.Empleos}
                    Documentos={Estado.Datos.Documentos}
                    oidc={props.oidc}
                    ui={props.ui}
                    DireccionesMigradas={Estado.Datos.DireccionesMigradas}
                  />

                  {/* Start Button Client */}

                  {props.TipoPersona === TipoPersona.Cliente && (
                    <div style={{ textAlign: "center" }}>
                      <button
                        className={`button ${!Estado.isCancelarTempC ? "is-warning" : "is-danger"
                          } is-outlined waves-effect waves-light mt-2`}
                        onClick={FNCancelarTemporalmenteC}
                      >
                        <span className="is-hidden-mobile">
                          {!Estado.isCancelarTempC && permisoActivars
                            ? "Activar Cliente"
                            : "Bloquear Cliente"}
                        </span>
                        &nbsp;
                        {!Estado.isCancelarTempC ? <FaUser /> : <FaUserSlash />}
                      </button>
                    </div>
                  )}

                  {/* End Button */}
                </React.Fragment>
                {props.TipoPersona === TipoPersona.Distribuidor && (
                  <div className="text-center">
                    <button
                      // Deshabilitar boton
                      disabled={Estado.isCancelarPermanente ? true : false}
                      className="button is-primary is-outlined waves-effect waves-light m-1 col-12 col-md-3 col-sm-12 col-lg-12"
                      onClick={() => {
                        DefinirEstado((s) => ({ ...s, ShowCliente: true }));
                      }}
                    >
                      <span className="is-hidden-mobile">
                        {" "}
                        <p className="is-size-7 has-text-centered">
                          Nuevo Cliente
                        </p>
                      </span>
                      &nbsp;
                      <FaUserPlus />
                    </button>
                    {/* Botón Cancel. Temp */}
                    {/* {permisoActivar && */}
                    <button
                      disabled={Estado.isCancelarPermanente ? true : false}
                      className={`button ${Estado.isCancelarTemp ? "is-warning" : "is-danger"
                        }
                                             is-outlined waves-effect waves-light m-1 col-12 col-md-3 col-lg-12`}
                      onClick={
                        !Estado.isCancelarTemp
                          ? FnCancelarTemporalmente
                          : FnActivarTemporalmente
                        //   ? () => {
                        //       //   DefinirEstado((s) => ({
                        //       //     ...s,
                        //       //     ShowSolicitudCancelTemp: true,
                        //       //   }));
                        //     }
                      }
                    >
                      <span className="is-hidden-mobile">
                        <p className="is-size-7 has-text-centered">
                          {" "}
                          {Estado.isCancelarTemp
                            ? "Activar Socia"
                            : "Cancelar Temp."}{" "}
                        </p>
                      </span>
                      &nbsp;
                      {Estado.isCancelarTemp ? <FaUser /> : <FaUserSlash />}
                    </button>
                    {/* } */}

                    {/* Bloqueo permanente de la socia */}
                    <button
                      //Deshabilitar boton
                      disabled={Estado.isCancelarPermanente ? true : false}
                      className={`button ${Estado.isCancelarPermanente ? "is-primary" : "is-danger"
                        }
                                             is-outlined waves-effect waves-light m-1 col-12 col-md-3 col-sm-12 col-lg-12`}
                      //</div>onClick={FNCancelarPermanente}
                      onClick={() => {
                        DefinirEstado((s) => ({
                          ...s,
                          ShowSolicitudFallecimiento: true,
                        }));
                      }}
                    >
                      <span className="is-hidden-mobile">
                        <p className="is-size-7 has-text-centered">
                          {Estado.isCancelarPermanente
                            ? "Bloqueo Permanente"
                            : "Fallecimiento"}
                        </p>
                      </span>
                      &nbsp;
                      {Estado.isCancelarPermanente ? <FaLock /> : <FaUser />}
                    </button>
                  </div>
                )}
              </Card.Body>
            </Card>
            {/* Boton para mostrar los convenios y reestructuras */}
            {props.TipoPersona === TipoPersona.Distribuidor && (
              <Card>
                <Card.Body>
                  <>
                    <button
                      className="button is-info is-outlined waves-effect waves-light my-2 col-12 col-md-3 col-sm-12 col-lg-12"
                      type="button"
                      onClick={() => {
                        DefinirEstado((s) => ({
                          ...s,
                          ShowSolicitudCRS: true,
                        }));
                      }}
                    >
                      <span className="is-hidden-mobile">
                        <p
                          style={{ whiteSpace: "normal" }}
                          className="is-size-7 has-text-centered"
                        >
                          Solicitud de Convenios y Reestructuras{" "}
                        </p>
                      </span>
                      &nbsp; <FaAddressBook />
                    </button>
                  </>
                </Card.Body>
              </Card>
            )}
            {/* <div className="card">
                            <header className="card-header ">
                                <div className='row'>
                                    
                                </div>

                            </header>
                        </div> */}
          </div>

          <div className="col-sm-12 col-md-12 col-lg-9">
            {props.TipoPersona === TipoPersona.Distribuidor && (
              <>
                <Card Title="Socia">
                  <Card.Body>
                    <PerfilDistribuidor
                      DistribuidorID={id_int}
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
                                  Funciones={[
                                    // { Control: <button className="btn btn-sm" title="Detalle"><FcDocument size={18} /></button>, Funcion: (contrato) => alert(contrato.LineaCredito) }
                                    {
                                      Control: (
                                        <button
                                          className="btn btn-sm"
                                          title="Detalle"
                                        >
                                          <FaEye size={18} />
                                        </button>
                                      ),
                                      Funcion: (contrato) =>
                                        FNShowClientes(
                                          /*Estado.Datos.Persona,*/ Estado.Datos
                                            .Persona?.PersonaID,
                                          contrato.ProductoID
                                        ),
                                    },
                                  ]}
                                  Columnas={[
                                    ListadoContratos.EColumnas.ImporteTotal,
                                    ListadoContratos.EColumnas.LineaCredito,
                                    ListadoContratos.EColumnas
                                      .LineaCreditoDisponible,
                                  ]}
                                  oidc={props.oidc}
                                  DatosConsulta={{
                                    DistribuidorID: id_int,
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
                                            valor={props.IncrementoQuincena}
                                            name={"IncrementoQuincena"}
                                            id={
                                              "IncrementoQuincena" +
                                              props.ContratoID
                                            }
                                            placeholder={"$0"}
                                            typeNumber
                                            withButton
                                          // onBlur={() => { ActualizaSaldos(values) }}
                                          />
                                        );
                                      },
                                      Funcion: (contrato) =>
                                        DefinirEstado((e) => ({
                                          ...e,
                                          Refresh: Estado.Refresh + 1,
                                        })),
                                    },
                                  ]}
                                  Columnas={[
                                    // Incrementos.EColumnas.ImporteTotal,
                                    Incrementos.EColumnas.LineaCredito,
                                    Incrementos.EColumnas
                                      .LineaCreditoDisponible,
                                    Incrementos.EColumnas.CapitalColocadoMinimo,
                                    Incrementos.EColumnas.CapitalColocadoMaximo,
                                  ]}
                                  oidc={props.oidc}
                                  DatosConsulta={{
                                    DistribuidorID: id_int,
                                  }}
                                  Refresh={Estado.Refresh}
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
                                            id={"Decremento" + props.ContratoID}
                                            placeholder={"$0"}
                                            typeNumber
                                            withButton
                                          // onBlur={() => { ActualizaSaldos(values) }}
                                          />
                                        );
                                      },
                                      Funcion: (contrato) =>
                                        DefinirEstado((e) => ({
                                          ...e,
                                          Refresh: Estado.Refresh + 1,
                                        })),
                                    },
                                  ]}
                                  Columnas={[
                                    // Incrementos.EColumnas.ImporteTotal,
                                    Decrementos.EColumnas.LineaCredito,
                                    Decrementos.EColumnas
                                      .LineaCreditoDisponible,
                                    Decrementos.EColumnas.CapitalColocadoMinimo,
                                    Decrementos.EColumnas.CapitalColocadoMaximo,
                                  ]}
                                  oidc={props.oidc}
                                  DatosConsulta={{
                                    DistribuidorID: id_int,
                                  }}
                                  Refresh={Estado.Refresh}
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
                                                                            Funcion: (datos) => DefinirEstado(e => ({
                                                                                ...e,
                                                                                RefreshPrestamos: Estado.RefreshPrestamos + 1,
                                                                            }))
                                                                        }
                                                                    ]}
                                                                    Columnas={[
                                                                        // Incrementos.EColumnas.ImporteTotal,
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
                                                                    ProductoID={props.ui.Producto?.ProductoID}
                                                                    DatosConsulta={{
                                                                        ProductoID: Estado.ProdPresPersonal,
                                                                        DistribuidorID: id_int,
                                                                        ClienteID: id_int
                                                                    }}
                                                                    Refresh={Estado.RefreshPrestamos}
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
              </>
            )}
            <div></div>
            <>
              <Card Title="Datos Generales">
                <Card.Body>
                  <DatosPersona
                    personaID={id_int}
                    oidc={props.oidc}
                    iUI={props.ui}
                    aclaracion={props.TipoPersona === TipoPersona.Distribuidor}
                    incremento={props.TipoPersona === TipoPersona.Distribuidor}
                    prestamo={props.TipoPersona === TipoPersona.Distribuidor}
                    herramientas={props.TipoPersona === TipoPersona.Distribuidor}
                    ultimasAplicaciones={props.TipoPersona === TipoPersona.Distribuidor}
                    curp={Estado.Datos.Persona.CURP}
                    lectorHuella={lectorHuellaValue}// Aqui se manda todo
                    sucursalid={0}
                  />
                </Card.Body>
              </Card>
              {props.TipoPersona === TipoPersona.Cliente && (
                <>
                  <Card>
                    <Card.Body>
                      <div className="col-md-12 mt-2">
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
                              <div>
                                <DataTable
                                  data={[{ ClienteID: id_int }]}
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
                                  columns={ColumnsClienteSaldo}
                                />
                              </div>
                            </>
                          </Acordion.Tab>
                        </Acordion>
                      </div>
                      <div className="col-md-12 mt-2">
                        <Acordion TabSelecionado="">
                          <Acordion.Tab
                            Titulo={
                              <span>
                                <FcBusinesswoman size={20} /> SOCIA ASOCIADA (
                                {Estado.datosClienteInfo.length}){" "}
                              </span>
                            }
                            Identificador="socia"
                          >
                            {/* {ui.Permisos.filter(p => p.PermisoID == 73) &&  */}
                            <div>
                              <table
                                style={{ width: "100%", tableLayout: "fixed" }}
                              >
                                <thead>
                                  <tr>
                                    <th
                                      className="text-start"
                                      style={{ width: "15%" }}
                                    >
                                      ID
                                    </th>
                                    <th
                                      className="text-center"
                                      style={{ width: "45%" }}
                                    >
                                      Nombre
                                    </th>
                                    <th
                                      className="text-right"
                                      style={{ width: "40%" }}
                                    >
                                      Fecha Asignación
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Estado.datosClienteInfo !== undefined &&
                                    (Estado.datosClienteInfo as any[]).map(
                                      (a, aId) => (
                                        <tr key={"discli_" + aId}>
                                          <td className="text-start">
                                            {a.DistribuidorID}
                                          </td>
                                          <td className="text-center">
                                            {a.NombreDistribuidor}
                                          </td>
                                          <td className="text-right">
                                            {moment(a.AsignacionFecha).format(
                                              "DD-MM-YYYY"
                                            )}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                </tbody>
                              </table>
                            </div>
                          </Acordion.Tab>
                        </Acordion>
                      </div>
                    </Card.Body>
                  </Card>
                </>
              )}
            </>
          </div>
        </div>
        <div>
          {Estado.Form.MostrarVerEvidencias && (
            <ModalWin
              open={Estado.Form.MostrarVerEvidencias}
              zIndex={3000}
              center={true}
            >
              <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                  Ver evidencia
                  {/* s{`: ` + Estado.Datos.Persona.PersonaID + " - " + Estado.Datos.Persona.NombreCompleto} */}{" "}
                </h5>

                <button
                  type="button"
                  className="delete"
                  onClick={() => {
                    DefinirEstado({
                      ...Estado,
                      Form: {
                        ...Estado.Form,
                        MostrarVerEvidencias: false,
                      },
                    });
                  }}
                />
              </ModalWin.Header>
              <ModalWin.Body>
                <VerEvidencias
                  DocumentoID={Estado.DocumentoID}
                  fnCancelar={cbCancelarCliente}
                />
              </ModalWin.Body>
            </ModalWin>
          )}
          {Estado.Detalle && (
            <ModalWin
              open={Estado.Detalle}
              zIndex={2000}
              center={true}
              xlarge
              scrollable
            >
              <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                  <strong>
                    <h4>{`Detalle ${DescripcionDistribuidor(1)}`} </h4>
                  </strong>
                  <strong>{DescripcionDistribuidor(1)}</strong>
                  {`: ` +
                    Estado.Datos.Persona.PersonaID +
                    " - " +
                    Estado.Datos.Persona.NombreCompleto}{" "}
                  <br />
                  <strong>Estatus: </strong>
                  <>
                    <span data-tip data-for={`DistEsttTooltip`}>
                      <FaCircle color={Estado.datosDistInfo?.DistEstColor} />
                    </span>
                    <ReactTooltip
                      id={`DistEsttTooltip`}
                      type="info"
                      effect="solid"
                      clickable
                      globalEventOff="click"
                    >
                      {Estado.datosDist?.DistribuidoresEstatus}
                    </ReactTooltip>
                  </>
                  <br />
                </h5>
                <button
                  type="button"
                  className="delete"
                  onClick={() => DefinirEstado({ ...Estado, Detalle: false })}
                />
              </ModalWin.Header>
              <ModalWin.Body>
                <DataTable
                  data={Estado.DatosClientes}
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
                />
              </ModalWin.Body>
            </ModalWin>
          )}
          <ModalWin
            open={Estado.DetalleCredito}
            zIndex={2500}
            center={true}
            xlarge
            scrollable
          >
            <ModalWin.Header>
              <h5 className={MODAL_TITLE_CLASS}>
                <strong>
                  <h4>{"Creditos Cliente"} </h4>
                </strong>
                {Estado.datosCliente?.NombreCompleto !== "" && (
                  <>
                    <strong>{DescripcionDistribuidor(1)}</strong>
                    {`: ` +
                      Estado.Datos.Persona.PersonaID +
                      " - " +
                      Estado.Datos.Persona.NombreCompleto}{" "}
                    <br />
                    <strong>Cliente: </strong>
                    {Estado.datosCliente?.ClienteID +
                      " - " +
                      Estado.datosCliente?.NombreCompleto}
                  </>
                )}
                {Estado.datosCliente?.NombreCompleto === "" && (
                  <>
                    <strong>Cliente: </strong>
                    {` ` +
                      Estado.Datos.Persona.PersonaID +
                      " - " +
                      Estado.Datos.Persona.NombreCompleto}{" "}
                    <br />
                  </>
                )}
              </h5>
              <button
                type="button"
                className="delete"
                onClick={() =>
                  DefinirEstado({ ...Estado, DetalleCredito: false })
                }
              />
            </ModalWin.Header>
            <ModalWin.Body>
              <DataTable
                data={Estado.DatosCreditos}
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
              />
            </ModalWin.Body>
          </ModalWin>
          <ModalWin
            open={Estado.DetallePlan}
            zIndex={3000}
            center={true}
            xlarge
            scrollable
          >
            <ModalWin.Header>
              <h5 className={MODAL_TITLE_CLASS}>
                <strong>
                  <h4>{"Plan de Pagos"}</h4>
                </strong>
                {Estado.datosCliente?.NombreCompleto !== "" && (
                  <>
                    <strong>{DescripcionDistribuidor(1)}</strong>
                    {`: ` +
                      Estado.Datos.Persona.PersonaID +
                      " - " +
                      Estado.Datos.Persona.NombreCompleto}{" "}
                    <br />
                    <strong>Cliente: </strong>
                    {Estado.datosCliente?.ClienteID +
                      " - " +
                      Estado.datosCliente?.NombreCompleto}
                  </>
                )}
                {Estado.datosCliente?.NombreCompleto === "" && (
                  <>
                    <strong>Cliente: </strong>
                    {` ` +
                      Estado.Datos.Persona.PersonaID +
                      " - " +
                      Estado.Datos.Persona.NombreCompleto}{" "}
                    <br />
                  </>
                )}
                <strong>{"  N° Crédito: "}</strong>
                {Estado.CredID}
              </h5>
              <button
                type="button"
                className="delete"
                onClick={() => DefinirEstado({ ...Estado, DetallePlan: false })}
              />
            </ModalWin.Header>
            <ModalWin.Body>
              <DataTable
                data={Estado.DatosDetalle}
                striped
                noDataComponent="Sin plan de pagos."
                // paginationD
                dense
                noHeader
                responsive
                // keyField={"NoPago"}
                defaultSortAsc={true}
                defaultSortField={"NoPago"}
                columns={DetailColumns}
              />
            </ModalWin.Body>
          </ModalWin>

          {Estado.ShowCliente && (
            <AgregarCliente
              Item={id_int}
              oidc={props.oidc}
              cbActualizar={() => { }}
              cbGuardar={cbAgregarCliente}
              fnCancelar={cbCancelarCliente}
              mostrar={Estado.ShowCliente}
            />
          )}

          {Estado.ShowSolicitudCancelTemp && (
            <div>
              <ModalWin
                zIndex={3000}
                open={Estado.ShowSolicitudCancelTemp}
                center={true}
                scrollable
              >
                <ModalWin.Header>
                  <h5 className={MODAL_TITLE_CLASS}>
                    SOLICITUD DE CANCELACIÓN TEMPORAL
                  </h5>
                </ModalWin.Header>
                <ModalWin.Body>
                  <SolicitudCancelacionTemporal
                    oidc={props.oidc}
                    ui={props.ui}
                    DistribuidoraID={Estado.Datos.Persona.PersonaID}
                    initialValues={state.FormSolicitudCancelacionTemp.Datos3}
                    cbGuardar={cbAgregarSolicitudCT}
                    fnCancelar={cbCancelarSolicitudCT}
                    cbActualizar={cbActualizarSolicitudCT}
                  />
                </ModalWin.Body>
              </ModalWin>
            </div>
          )}

          {/* SI EL LA VARIABLE DE 'ShowSolicitudCRS' ES VERDADERO SE MOSTRARA UN MODAL*/}
          {Estado.ShowSolicitudCRS && (
            <CFormSCRS
              oidc={props.oidc}
              distributorId={Estado.Datos.Persona.PersonaID}
              initialValues={state.FormSolicitudSCRS.DatosSCRS}
              fnAbrir_Cerrar={toggleModalSolicitudCRS}
              EstatusID={Estado.EstadoHDR ?? ''}
            />
          )}

          {Estado.ShowSolicitudFallecimiento && (
            <div>
              <ModalWin
                zIndex={3000}
                open={Estado.ShowSolicitudFallecimiento}
                center={true}
                scrollable
              >
                <ModalWin.Header>
                  <h5 className={MODAL_TITLE_CLASS}>
                    SOLICITUD DE FALLECIMIENTO
                  </h5>
                </ModalWin.Header>
                <ModalWin.Body>
                  <SolicitudFallecimiento
                    // fnIncrementoNoGuardada={fnIncrementoNoGuardada}
                    //fnIncrementoGuardada={fnIncrementoGuardada}
                    //solicitudGuardada={state.solicitudIncrementoGuardada}
                    oidc={props.oidc}
                    ui={props.ui}
                    DistribuidoraID={Estado.Datos.Persona.PersonaID}
                    //fnGetDistribuidores={fnGetDistribuidores}
                    //fnGetCondicionesDetalle={fnGetCondicionesDetalle}
                    initialValues={state.FormSolicitudFallecimiento.Datos2}
                    //Id={state.FormIncrementos.Id}
                    cbGuardar={cbAgregarSolicitud}
                    fnCancelar={cbCancelarSolicitud}
                    //fnCancelar={() => setState(s => ({ ...s, FormIncrementos: { Mostrar: false, datosIncrementos: DatosIncrementos, Id: undefined } }))}
                    cbActualizar={cbActualizarSolicitud}
                  //optProductosPrincipales={state.TipoProductosIncrementos}
                  />
                </ModalWin.Body>
              </ModalWin>
            </div>
          )}
        </div>
        <p></p>
      </div>
    );
  return null;
};
// Exportamos los tipos de persona que puede mostrar este componente
Persona.TipoPersona = TipoPersona;
// Obtenemos las propiedades del estado
const mapStateToProps = (Estado: IEstado) => ({
  oidc: Estado.oidc,
  ui: Estado.UI,
});
// // Default export
export default connect(mapStateToProps)(Persona);
