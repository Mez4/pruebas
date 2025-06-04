import React, { useRef } from "react";
import {
  FaCheck,
  FaInfoCircle,
  FaLevelUpAlt,
  FaUserFriends,
  FaEye,
  FaClock,
  FaExclamationCircle,
  FaUsers,
  FaFileInvoice,
  FaUser,
  FaUserSlash,
} from "react-icons/fa";
import {
  FcConferenceCall,
  FcComboChart,
  FcDam,
  FcViewDetails,
  FcAcceptDatabase,
  FcKindle,
  FcPlus,
  FcManager,
  FcPodiumWithSpeaker,
  FcMoneyTransfer,
  FcCurrencyExchange,
  FcCallTransfer,
  FcAddressBook,
} from "react-icons/fc";
import { FiAlertTriangle, FiRefreshCcw } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { FormateoDinero } from "../../../global/variables";
import { IOidc } from "../../../interfaces/oidc/IOidc";
import { iUI } from "../../../interfaces/ui/iUI";
import { DBConfia_Distribuidores } from "../../../interfaces_db/DBConfia/Distribuidores";
import { DBConfia_General } from "../../../interfaces_d/DBConfia/General";

import { Acordion, Spinner, ModalWin, CustomSelect, Card } from "../../global";
// Importamos las funciones de este componente
import * as Funciones from "./CompPerfilDistribuidor/Funciones";
import * as FuncionesReestructuras from "../../app/modulos/creditos/CompCreditos/CreditoComisionReestructura/Funciones";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import moment from "moment";
import ReactTooltip from "react-tooltip";
import Vales from "../../presentacion/ditribuidor/CompPerfilDistribuidor/CFormValeras";
import { MODAL_TITLE_CLASS } from "../../global/ModalWin";

import { AgregarAval } from "../../app/modulos/distribuidor/CompDistribuidor/Distribuidor/AgregarAval";
import { toast } from "react-toastify";
import { DBConfia_Cortes } from "../../../interfaces_d/DBConfia/Cortes";
import { addOneDay, FiltrarDatos, formatDate } from "../../../global/functions";
import { DBConfia_Prospeccion } from "../../../interfaces_db/DBConfia/Prospeccion";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { BsFillBarChartFill } from "react-icons/bs";
import { Formik } from "formik";
import { Form } from "usetheform";
import { IoMdClose } from "react-icons/io";
import { BiSearchAlt } from "react-icons/bi";
import yup from "../../../global/yupLocale";
import { CFormRFC } from "../persona/CFormRfc";
import { CFormRCF } from "./CompPerfilDistribuidor/CFormRCF";
import SwalLoading from "../../global/swalLoading";
import * as FnPersona from "../../app/modulos/personas/CompAdministracion/CompPersona/Funciones";
import { DBConfia_General as DBConfia_Generaldb } from "../../../interfaces_db/DBConfia/General";
import { DBConfia_Creditos } from "../../../interfaces_db/DBConfia/Creditos";
import { PerfilPersonaParaGlobal } from "../persona/PerfilPersonaParaGlobal";
import DatosPersona from "../persona/DatosPersona";
import Persona from "../../app/modulos/personas/CompAdministracion/Persona";
// import {a} from '../../../componentes/global/swalLoading'

/**
 * Función para generar las columnas a utilizar en la tabla (Facil manejo de orden y contenido)
 * @param {EColumna} Columna Columna a mostrar
 * @returns Instancia a mostrar en la tabla
 */

/**
 * Tipo del estado de este componente
 */
type EstadoTipo = {
  Distribuidor?: DBConfia_Distribuidores.IDistribuidores_VW;
  NivelMonto?: DBConfia_Prospeccion.INivelOrigen_Buro_LC_VW;
  AvalesDistribuidor?: DBConfia_Distribuidores.IAvalesDistribuidor_VW[];
  ExperienciaDistribuidor?: DBConfia_Distribuidores.IExperiencia[];
  exp: DBConfia_Distribuidores.IExperiencia[];
  Cargando: boolean;
  Error: boolean;
  Filtro: string;
  Datos: {
    DatosGenerales?: DBConfia_General.IPersonas_VW;
    Avales: DBConfia_Distribuidores.IDistribuidoresAvalesInfo_VW[];
  };
};

/**
 * Tipo del componente
 */
type PerfilDistribuidorTipo = {
  oidc: IOidc;
  DistribuidorID: number;
  ui: iUI;
};

/**
 * Componente para mostrar la caratula de un socia
 * @param {PerfilDistribuidorTipo} props Detalle de seguridad y Id del socia a mostrar
 * @returns Componente de react
 */
const PerfilDistribuidor = ({
  oidc,
  DistribuidorID,
  ui,
}: PerfilDistribuidorTipo) => {
  const MySwal = withReactContent(Swal);
  // Monitoreamos que el componente este montado
  let isMounted = React.useRef(true);
  let avalMuestra:
    | DBConfia_Distribuidores.IDistribuidoresAvalesInfo_VW
    | undefined;
  const DatosDefecto = {
    DistribuidorID: 0,
    PersonaID: 0,
    FechaHoraRegistro: "",
    UsuarioIDRegistro: 0,
    TipoAvalID: 0,
    PersonaIDRegistro: 0,
    TipoAval: "",
    ColorAval: "",
    NombreCompleto: "",
  };
  const Datos: any[] = [];
  const datosAvales: any[] = [];
  const datosReferencias: any[] = [];
  const DatosMostrarPlazos: any[] = [];

  interface DatosClienteI {
    Persona?: DBConfia_Generaldb.IPersonas_VW;
    Direcciones: DBConfia_Generaldb.IDirecciones_VW[];
    Empleos: DBConfia_Generaldb.IEmpleos_VW[];
    Creditos?: DBConfia_Creditos.ICreditos_VW;
  }

  const containerStyle = {
    width: "100%", // o cualquier valor fijo que desees
    overflowX: "auto", // Habilita el desplazamiento horizontal
  };

  const tableStyle = {
    minWidth: "1000px", // Asegúrate de que la tabla tenga un ancho suficiente para que se muestre la barra de desplazamiento
  };

  // Estado del componente
  const [Estado, definirEstado] = React.useState<EstadoTipo>({
    Distribuidor: undefined,
    NivelMonto: undefined,
    Cargando: true,
    AvalesDistribuidor: [],
    ExperienciaDistribuidor: [],
    Error: false,
    exp: [],
    Filtro: "",
    Datos: {
      DatosGenerales: undefined,
      Avales: [],
    },
  });
  const [state, setState] = React.useState({
    datosAvales,
    datosReferencias,
    valeras: [],
    avales: [],
    gestores: [],
    coordinadores: [],
    //Aplicacion detalle
    DatosDetalle: [],
    Detalle: false,
    clientesLiquidados: [],
    CreditosActivos: [],
    Form: {
      Mostrar: false,
      Id: undefined,
      evento: "",
    },
    ShowVales: false,
    ValeraID: 0,
    FormaAgregarA: false,
    avalMuestra,
    distribuidorID: 0,
    FormDatosAvales: {
      Mostrar: false,
      datosAvales: DatosDefecto,
      Id: undefined,
    },
    // Apllicaciones
    PagosAplicados: [],
    DetalleAplicacion: false,
    // Variables de plan de pagos
    datosPagos: undefined,
    DetallePlan: false,
    // DatosDetalle: [],
    CredID: 0,
    AplicacionID: 0,
    DatosDetalleCredito: [],
    DetallePlanCredito: false,
    DatosMostrarPlazos,
    ModalPlazos: false,
    Datos,

    DatosCliente: undefined as DatosClienteI | undefined,
    DetalleClienteFinal: false,
    ClienteSelected: undefined,
    isCancelarTempC: false
  });
  const [loading, setLoading] = React.useState(false);

  const [selectedRows, setSelectedRows] = React.useState([]);

  const [toggleCleared, setToggleCleared] = React.useState(true);

  const [mensajeCreditosSeleccionados, setMensajeCreditosSeleccionados] = React.useState("");
  const handleRowSelected = React.useCallback((state) => {
    setSelectedRows(state.selectedRows);
    const saldoTotal = state.selectedRows.reduce(
      (acc, row) => acc + row.SaldoActual,
      0
    );
    setMensajeCreditosSeleccionados('  - Saldo Total: ' + FormateoDinero.format(saldoTotal));
  }, []);

  const FNGetValeras = () => {
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNObtenerValerasDistr(oidc, DistribuidorID)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, valeras: respuesta }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: true,
            valeras: [],
          }));
        }
      });
  };

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

  const FNGetGestores = () => {
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNObtenerGestoresDist(oidc, DistribuidorID)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, gestores: respuesta }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: true,
            gestores: [],
          }));
        }
      });
  };

  const FNGetCoordinador = () => {
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNObtenerCoord(oidc, DistribuidorID)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, coordinadores: respuesta }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: true,
            coordinadores: [],
          }));
        }
      });
  };

  const FNGetAvales = () => {
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNObtenerAvalesDist(oidc, DistribuidorID)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, datosAvales: respuesta }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: true,
            datosAvales: [],
          }));
        }
      });
  };

  const FNGetReferencias = () => {
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNObtenerReferenciasDist(oidc, DistribuidorID)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, datosReferencias: respuesta }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: true,
            datosReferencias: [],
          }));
        }
      });
  };

  const FNGetDetalleAplicacion = (AplicacionID: number, data: any) => {
    setState((s) => ({
      ...s,
      DatosDetalle: [],
    }));
    Funciones.FNGetAbonos(oidc, AplicacionID)
      .then((respuesta: any) => {
        //console.log(AplicacionID, data, respuesta, "FNGetDetalleAplicacion");
        // if (isMounted.current === true) {
        setState((s) => ({
          ...s,
          DetalleAplicacion: true,
          DatosDetalle: respuesta,
          AplicacionID,
        }));
        // }
      })
      .catch(() => {
        // if (isMounted.current === true) {
        toast.error("Error al consultar, vuelva a intentarlo");
        setState((s) => ({
          ...s,
          DetalleAplicacion: false,
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

  const FNGetClienteLiquidado = () => {
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNGetClientesLiquidados(oidc, DistribuidorID)
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, clientesLiquidados: respuesta }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: true,
            clientesLiquidados: [],
          }));
        }
      });
  };

  const FNGetPagosActivos = () => {
    setState((s) => ({ ...s, Cargando: true }));
    var obj = {
      SucursalID: Estado.Distribuidor?.SucursalID,
      DistribuidorID: DistribuidorID,
    };
    Funciones.FNGetAplicaciones(oidc, {
      SucursalID: obj.SucursalID ?? 0,
      DistribuidorID: obj.DistribuidorID,
    })
      .then((respuesta: any) => {
        if (isMounted.current === true) {
          setState((s) => ({ ...s, PagosAplicados: respuesta }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: true,
            PagosAplicados: [],
          }));
        }
      });
  };

  const FNGetCreditosActivos = () => {
    setState((s) => ({ ...s, Cargando: true }));
    Funciones.FNGetCreditosActivos(oidc, DistribuidorID)
      .then((respuesta: any) => {
        // console.log(respuesta);
        if (isMounted.current === true) {
          respuesta.sort((a: any, b: any) => b.CreditoID - a.CreditoID);
          //console.log(respuesta, 'respuesta de creditos activos');
          // ahora se agrega la moda de pago
          const addPagoModa = respuesta.map(credito => {
            return {
              ...credito,
              pagoModa: credito.ImporteTotal / credito.Plazos
            };
          });
          

          // se construye el objeto de totales
          const totalFooter = {
            EstatusID: 100,  
            CreditoID: 'Totales',
            Producto: "Totales",
            ImporteTotal: addPagoModa.reduce((acc, curr) => acc + curr.ImporteTotal, 0),
            Abonos: addPagoModa.reduce((acc, curr) => acc + curr.Abonos, 0),
            SaldoActual: addPagoModa.reduce((acc, curr) => acc + curr.SaldoActual, 0),
            Tiendita: addPagoModa.reduce((acc, curr) => acc + curr.Tiendita, 0),
            pagoModa: '100', // el 100 en texto cumple la validacion para que no aparezca en el footer en caso de ser un numero se mostrara
            FechaVencimientoClienteFinal: "",
            NoPago: null,
            DiasAtraso: 0,
            FechaLiquidacion: "",
          };
          // se agrega un objeto al final del array con los totales de los importes para simular un footer
          addPagoModa.push(totalFooter);

          // por ultimo se setea el estado con los creditos activos con los datos extras
          setState((s) => ({ ...s, CreditosActivos: addPagoModa }));
        }
      })
      .catch(() => {
        if (isMounted.current === true) {
          setState((s) => ({
            ...s,
            Cargando: false,
            Error: true,
            clientesLiquidados: [],
          }));
        }
      });
  };

  const fnCancelar = () =>
    setState({
      ...state,
      ShowVales: false,
      Form: { ...state.Form, Mostrar: false },
    });

  const ConsultarDatos = async () => {
    // Actualizamos el estado (por si se acciona alguna función de actualización)
    definirEstado((e) => ({
      ...e,
      Distribuidor: undefined,
      /*AvalesDistribuidor: [],*/ Cargando: true,
      Error: false,
    }));
    try {
      // Obtenemos el socia de las funciones del componente
      var Distribuidor = await Funciones.FNObtenerDistPorId(
        oidc,
        DistribuidorID
      );

      var NivelMonto = await Funciones.FNObtenerDistPorIdMontos(
        oidc,
        DistribuidorID
      );

      // var Distribuidor = await Funciones.FNObtenerPorIdEmpresaDv(oidc, DistribuidorID)
      // console.log(Distribuidor, 'Distribuidor')

      // var AvalesDistribuidor = await Funciones.FNObtenerAvales(oidc, DistribuidorID)

      var ExperienciaDistribuidor = await Funciones.FNObtenerExperienciaDist(
        oidc,
        DistribuidorID
      );
      // console.log(ExperienciaDistribuidor, 'ExperienciaDistribuidor')
      // var ValerasDistribuidor = await Funciones.FNObtenerValeras(oidc, DistribuidorID)
      // console.log(ValerasDistribuidor, 'ValerasDistribuidor')

      // Definimos el estado
      if (isMounted)
        definirEstado((e) => ({
          ...e,
          Distribuidor,
          NivelMonto,
          /* AvalesDistribuidor, */ /* ExperienciaDistribuidor, exp: ExperienciaDistribuidor, */ /*ValerasDistribuidor,valeras:ValerasDistribuidor*/ Cargando:
            false,
          Error: false,
        }));
    } catch (ex) {
      // Definimos el estado
      if (isMounted)
        definirEstado((e) => ({
          ...e,
          Distribuidor: undefined,
          Cargando: false,
          Error: true,
        }));

      // Logeamos el error
      console.log(`Error al obtener la Socia con ID: ${DistribuidorID}`, ex);
    }
  };

  const cbAgregarA = (item: any, distribuidorID: any) => {
    if (item.res == 1) {
      toast.success(item.msj);
      setState((s) => ({
        ...s,
        datosAvales: [...state.datosAvales, item.Data],
        FormDatosAvales: { ...state.FormDatosAvales, Mostrar: false },
        FormaAgregarA: false,
        distribuidorID: distribuidorID,
      }));
    } else {
      console.log("error");
      toast.warning(item.msj);
    }
  };

  const fnCancelarA = () =>
    setState((s) => ({
      ...s,
      FormDatosAvales: { ...state.FormDatosAvales, Mostrar: false },
      FormaAgregarA: false,
      item: undefined,
    }));

  const cbActualizar = (item: any) => {
    setState({
      ...state,
      datosAvales: [...state.datosAvales, item.Data],
      FormDatosAvales: {
        ...state.FormDatosAvales,
        Mostrar: false,
        datosAvales: {
          DistribuidorID: 0,
          PersonaID: 0,
          FechaHoraRegistro: "",
          UsuarioIDRegistro: 0,
          TipoAvalID: 0,
          PersonaIDRegistro: 0,
          TipoAval: "",
          ColorAval: "",
          NombreCompleto: "",
        },
      },
    });
  };
  const showAvales = (avalID: number, distribuidorID: any) => {
    setState((e) => ({
      ...e,
      FormaAgregarA: true,
      distribuidorID: distribuidorID,
      avalMuestra: Estado.Datos.Avales.find(
        (x: DBConfia_Distribuidores.IDistribuidoresAvalesInfo_VW) =>
          (x.PersonaID = avalID)
      ),
    }));
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  const FNGetDetalle = (Data: any, CreditoID: number) => {
    // SwalWarning('Aviso', 'Obteniendo Plan de Pagos.');
    setState((s) => ({ ...s, DatosDetalleCredito: [] }));
    Funciones.FNGetPlanPagos(oidc, CreditoID)
      .then((respuesta: any) => {
        //console.log(respuesta);

        if (respuesta.length > 0) {
          // setState(s => ({ ...s, MultiSaldoCajaID: respuesta[0].MultisaldosCajaID }))

          setState((s) => ({
            ...s,
            datosPagos: Data,
            DetallePlanCredito: true,
            DatosDetalleCredito: respuesta,
            CredID: CreditoID,
          }));
          // MySwal.close();
        } else {
          setState((s) => ({
            ...s,
            datosPagos: Data,
            DetallePlanCredito: true,
            DatosDetalleCredito: [],
            CredID: CreditoID,
          }));
          // MySwal.close();
        }
      })
      .catch((error: any) => {
        // if (isMounted.current === true) {
        console.log(error);

        setState((s) => ({
          ...s,
          DetallePlanCredito: false,
          DatosDetalleCredito: [],
        }));
        MySwal.close();
        toast.error("Error al consultar, vuelva a intentarlo");
        // }
      });
  };

  const FNGetFichaPago = (Data: any) => {
    SwalLoading("Cargando", "Obteniendo ficha de pago");
    setTimeout(() => {
      MySwal.close();
    }, 5000);
    Funciones.FNGetFichaPago(oidc, {
      CreditoID: Data.CreditoID,
    })
      .then((pdf: any) => {
        const file = new Blob([pdf], {
          type: "application/pdf",
        });
        const fileURL = URL.createObjectURL(file);
        const enlaceTemporal = document.createElement("a");
        enlaceTemporal.href = fileURL;
        enlaceTemporal.target = "_blank";
        enlaceTemporal.style.display = "none";
        document.body.appendChild(enlaceTemporal);
        enlaceTemporal.click();
      })
      .catch((error: any) => {
        console.log(JSON.stringify(error));

        toast.error(
          "Error al descargar el archivo, intente descargar nuevamente el archivo o reportarlo a sistemas"
        );
      });
  };

  const FNGetClienteFinalInfo = async (Data: any) => {
    setState((s) => ({ ...s, ClienteSelected: Data, DetalleClienteFinal: true }));

    /* let resultado = await FnPersona.FNObtenerPersona(
      oidc,
      Data.ClienteID
    );

    setState((e) => ({
      ...e,
      DatosCliente: {
        Persona: resultado.persona,
        Direcciones: resultado.direcciones,
        Empleos: resultado.empleos,
        Creditos: resultado.creditos,
      },
      Cargando: false,
      Error: false,
    })); */
  }

  const DetailColumnsCredito = React.useMemo(() => {
    let colRet: IDataTableColumn[] = [
      {
        name: "# Pago",
        width: "95px",
        selector: "NoPago",
        sortable: false,
        cell: (props) =>
          props.NoPago != null ? (
            <span
              style={{
                width: "95px",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
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
            {props.SaldoActual < 1
              ? 0
              : FormateoDinero.format(props.SaldoActual)}
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
          props.NoPago != null ? (
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
    return colRet;
  }, []);

  const DetailColumns = React.useMemo(() => {
    let colRet: IDataTableColumn[] = [
      {
        name: "Producto",
        width: "12%",
        selector: "Producto",
        sortable: false,
      },
      {
        name: "# Crédito",
        width: "8%",
        selector: "CreditoID",
        sortable: false,
        center: true,
      },
      {
        name: "Cliente ",
        width: "20%",
        selector: "NombreCliente",
        sortable: false,
      },
      {
        name: "# Pago",
        width: "5%",
        selector: "NoPago",
        sortable: false,
        center: true,
      },
      {
        name: "Importe",
        selector: "ImporteTotal",
        sortable: false,
        format: (row) => formatter.format(row.ImporteTotal),
      },
      {
        name: "Abono",
        selector: "Abono",
        sortable: false,
        format: (row) => formatter.format(row.Abono),
      },
      {
        name: "Comisión",
        selector: "Comision",
        sortable: false,
        format: (row) => formatter.format(row.Comision),
      },
      {
        name: "CPT",
        selector: "CPT",
        sortable: false,
        format: (row) => formatter.format(row.PagoPPI),
      },
      {
        name: "Fecha Abono",
        selector: "FechaHoraAbono",
        sortable: false,
        width: "10%",
        cell: (props) => (
          <span>
            {props.FechaHoraAbono
              ? moment(props.FechaHoraAbono).format("DD/MM/YYYY")
              : ""}
          </span>
        ),
      },
      {
        name: "F. Corte Relación",
        selector: "fechaCorte",
        width: "10%",
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

  const fnCancelarPlazos = () =>
    setState((s) => ({ ...s, ModalPlazos: false }));

  // Definimos un estado para el componente
  React.useEffect(() => {
    // Hacemos la petición al servidor
    ConsultarDatos();
    FNGetValeras();
    FNGetAvales();
    FNGetReferencias();
    FNGetGestores();
    FNGetCoordinador();
    FNGetClienteLiquidado();
    FNGetCreditosActivos();
    FNGetPagosActivos();
    ObtenerPlazos();
    // eslint-disable-next-line
  }, [DistribuidorID]);

  const Columns = React.useMemo(() => {
    // Columnas basicas a incluir en la tabla
    const Columnas: IDataTableColumn[] = [
      {
        name: "Empresa",
        selector: "Compania",
        sortable: true,
        maxWidth: "200px",
      },
      {
        name: "Ingreso",
        selector: "FechaHoraRegistro",
        sortable: true,
        maxWidth: "200px",
        cell: (cprops) => (
          <span>{moment(cprops.FechaHoraRegistro).format("DD/MM/YYYY")}</span>
        ),
      },
      {
        name: "Limite Crédito",
        selector: "LimiteCredito",
        sortable: true,
        maxWidth: "200px",
        cell: (cprops) => (
          <span>{FormateoDinero.format(cprops.LimiteCredito)}</span>
        ),
      },
      {
        name: "Crédito Disponible",
        selector: "CreditoDisponible",
        sortable: true,
        maxWidth: "200px",
        cell: (cprops) => (
          <span>{FormateoDinero.format(cprops.CreditoDisponible)}</span>
        ),
      },
    ];

    return Columnas;
    //eslint-disable-next-line
  }, []);

  const ColumnsClienteLiquidado = React.useMemo(() => {
    // Columnas basicas a incluir en la tabla
    const ColumnsClienteLiquidado: IDataTableColumn[] = [
      // { name: 'ID', selector: 'ValeraID', sortable: true, wrap: true },
      {
        name: "ClienteID",
        selector: "ClienteID",
        sortable: true,
        wrap: true,
        maxWidth: "50px",
        center: true,
      },
      {
        name: "Cliente",
        selector: "Cliente",
        sortable: true,
        wrap: true,
        maxWidth: "200px",
        center: true,
      },
      {
        name: "Fecha/Hora Pago",
        selector: "FechaHoraUltimoPago",
        center: true,
        maxWidth: "110px",
        sortable: true,
        wrap: true,
        cell: (cprops) => (
          <span>
            {moment(cprops.FechaHoraUltimoPago)
              .utc()
              .format("DD-MM-YYYY HH:mm:ss A")}
          </span>
        ),
      },
      {
        name: "Importe",
        selector: "importePlazo",
        sortable: true,
        center: true,
        maxWidth: "110px",
        wrap: true,
        cell: (cprops) => (
          <span>{FormateoDinero.format(cprops.importePlazo)}</span>
        ),
      },
      {
        name: "Saldo",
        selector: "saldoPlazo",
        sortable: true,
        center: true,
        maxWidth: "110px",
        wrap: true,
        cell: (cprops) => (
          <span>{FormateoDinero.format(cprops.saldoPlazo)}</span>
        ),
      },

      {
        name: "Abono/Comision",
        selector: "Total",
        sortable: true,
        center: true,
        maxWidth: "110px",
        wrap: true,
        cell: (cprops) => <span>{FormateoDinero.format(cprops.Total)}</span>,
      },
    ];

    return ColumnsClienteLiquidado;

    //eslint-disable-next-line
  }, []);

  const ColumnsCreditosActivos = React.useMemo(() => {
    
    
    // Columnas basicas a incluir en la tabla
    const ColumnsClienteLiquidado: IDataTableColumn[] = [
      // { name: 'ID', selector: 'ValeraID', sortable: true, wrap: true },
      {
        name: "Id",
        selector: "CreditoID",
        sortable: false,
        /* wrap: true, */
        /* maxWidth: "50px", */
        grow: 0,
        center: true,
      },
      {
        name: "Cliente",
        selector: "NombreCompleto",
        sortable: false,
        wrap: true,
        maxWidth: "200px",
        center: true,
      },
      {
        name: "Tipo Credito",
        selector: "TipoCreditoDescripcion",
        sortable: false,
        wrap: true,
        maxWidth: "200px",
        center: true,
      },
      {
        name: "Importe",
        selector: "ImporteTotal",
        sortable: false,
        center: true,
        maxWidth: "100px",
        wrap: true,
        cell: (cprops) => (
          <span>{FormateoDinero.format(cprops.ImporteTotal)}</span>
        ),
      },
      {
        name: "Saldo ",
        selector: "SaldoActual",
        sortable: false,
        center: true,
        maxWidth: "100px",
        wrap: true,
        cell: (cprops) => (
          <span>{FormateoDinero.format(cprops.SaldoActual)}</span>
        ),
      },
      {
        name: "Tiendita",
        selector: "Tiendita",
        sortable: false,
        center: true,
        maxWidth: "80px",
        wrap: true,
        cell: (cprops) => (
          <span>{FormateoDinero.format(cprops.Tiendita)}</span>
        ),
      },
      {
        name: "Plazos",
        selector: "Plazos",
        sortable: false,
        /* wrap: true, */
        /* maxWidth: "150px", */
        grow: 0,
        center: true,
      },
      {
        name: "Pago Moda",
        selector: "pagoModa",
        sortable: false,
        /* wrap: true, */
        /* maxWidth: "150px", */
        grow: 0,
        wrap: true,
        cell: (cprops) => (
          <span>{cprops.pagoModa === '100' ? '' : FormateoDinero.format(cprops.pagoModa)}</span>
        ),
        center: true,
      },
      {
        name: "Fecha Ultimo Pago",
        selector: "FechaHoraUltimoPago",
        sortable: false,
        wrap: true,
        maxWidth: "150px",
        center: true,
        cell: (props) => (
          <span>
            {props.FechaHoraUltimoPago
              ? moment(props.FechaHoraUltimoPago).format("DD/MM/YYYY HH:mm:ss")
              : ""}
          </span>
        ),
      },
      {
        name: "Fecha captura",
        selector: "FechaHoraRegistro",
        sortable: false,
        wrap: true,
        maxWidth: "150px",
        center: true,
        cell: (props) => (
          <span>
            {props.FechaHoraRegistro
              ? moment(props.FechaHoraRegistro).format("DD/MM/YYYY")
              : ""}
          </span>
        ),
      },
      {
        name: "Fecha desembolso",
        selector: "FechaHoraDesembolso",
        sortable: false,
        wrap: true,
        maxWidth: "150px",
        center: true,
        cell: (props) => (
          <span>
            {props.FechaHoraDesembolso
              ? moment(props.FechaHoraDesembolso).format("DD/MM/YYYY")
              : ""}
          </span>
        ),
      },
      {
        name: "Acciones",
        sortable: false,
        center: true,
        grow: 1,
        minWidth: "50px",
        cell: (data) => (
          // se valora el estatusID 100 porque es el estatus de el footer de totales
          data.EstatusID === 100 ? (<div></div>) :

          <div style={{ width: '100%'}} className="d-flex justify-content-around align-items-center">
            <button
              data-tip
              disabled={false}
              data-for={`InfoCreditoCF${data.CreditoID}`}
              className="asstext"
              style={{
                margin: ".15em",
                /* width: "15%", */
                height: "40px",
                padding: "0px",
                tableLayout: "fixed",
                borderCollapse: "collapse",
              }}
              type="button"
              onClick={() => {
                FNGetClienteFinalInfo(data);
              }}
            >
              <FaUser />
            </button>
            <ReactTooltip
              id={`InfoCreditoCF${data.CreditoID}`}
              type="info"
              effect="solid"
              clickable
              globalEventOff="click"
            >
              Ver información de cliente final
            </ReactTooltip>

            <button
              data-tip
              data-for={`DetallePlanPagosCredito${data.CreditoID}`}
              className="asstext"
              style={{
                margin: ".15em",
                /* width: "15%", */
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
              id={`DetallePlanPagosCredito${data.CreditoID}`}
              type="info"
              effect="solid"
              clickable
              globalEventOff="click"
            >
              Ver Plan de Pagos
            </ReactTooltip>

            <button
              data-tip
              disabled={false}
              data-for={`FichaPagoCreditoCF${data.CreditoID}`}
              className="asstext"
              style={{
                margin: ".15em",
                height: "40px",
                padding: "0px",
                tableLayout: "fixed",
                borderCollapse: "collapse",
              }}
              type="button"
              onClick={() => {
                FNGetFichaPago(data);
              }}
            >
              <FaFileInvoice />
            </button>
            <ReactTooltip
              id={`FichaPagoCreditoCF${data.CreditoID}`}
              type="info"
              effect="solid"
              clickable
              globalEventOff="click"
            >
              {data.IDExterno === null
                ? "Generar ficha de pago"
                : "No disponible"}
            </ReactTooltip>
          </div>
        ),
      },
    ];

    return ColumnsClienteLiquidado;

    //eslint-disable-next-line
  }, []);

 

  const ColumnsPagosAplicados = React.useMemo(() => {
    // Columnas basicas a incluir en la tabla
    const ColumnsClienteLiquidado: IDataTableColumn[] = [
      // { name: 'ID', selector: 'ValeraID', sortable: true, wrap: true },
      {
        name: "Aplicacion ID",
        selector: "AplicacionID",
        wrap: true,
        maxWidth: "50px",
        center: true,
      },
      //NombreCaptura
      {
        name: "Nombre Captura",
        selector: "NombreCaptura",
        wrap: true,
        maxWidth: "200px",
        center: true,
        cell: (props) => (
          //span
          <span>{props.NombreCaptura}</span>
        ),
      },

      //{ name: 'Sucursal', selector: 'Sucursal', wrap: true, maxWidth: '200px', center: true },
      // { name: 'Numero Cuenta', selector: 'NumeroCuenta', wrap: true, maxWidth: '200px', center: true },
      {
        name: "Descripcion Cuenta",
        selector: "DescripcionCuenta",
        center: true,
        maxWidth: "110px",
        cell: (props) => (
          <>
            <label data-tip data-for={`P_${props.DescripcionCuenta}`}>
              {props.DescripcionCuenta}
            </label>
            <ReactTooltip
              id={`P_${props.DescripcionCuenta}`}
              type="info"
              effect="solid"
            >
              {props.DescripcionCuenta}
            </ReactTooltip>
          </>
        ),
      },
      {
        name: "Fecha Registro",
        selector: "FechaRegistro",
        center: true,
        maxWidth: "130px",
        wrap: true,
        cell: (props) => (
          <span>{moment(props.FechaRegistro).format("DD/MM/YYYY")}</span>
        ),
      },
      {
        name: "Fecha Aplicacion",
        selector: "FechaAplicacion",
        center: true,
        maxWidth: "130px",
        wrap: true,
        cell: (props) => (
          <span>
            {moment.parseZone(props.FechaAplicacion).format("DD/MM/YYYY")}
          </span>
        ),
      },
      {
        name: "Pago",
        selector: "Pago",
        center: true,
        maxWidth: "110px",
        wrap: true,
        cell: (cprops) => <span>{FormateoDinero.format(cprops.Pago)}</span>,
      },
      {
        name: "Bonificacion",
        selector: "Bonificacion",
        center: true,
        maxWidth: "110px",
        wrap: true,
        cell: (cprops) => (
          <span>{FormateoDinero.format(cprops.ImporteBonificacion)}</span>
        ),
      },
      {
        name: "DNI",
        selector: "DNI",
        center: true,
        maxWidth: "110px",
        wrap: true,
        cell: (cprops) => (
          <span>{FormateoDinero.format(cprops.ImporteDNI)}</span>
        ),
      },
      {
        name: "Est.",
        selector: "Activo",
        center: true,
        width: "15px",
        maxWidth: "30px",
        wrap: true,
        cell: (cprops) => <span>{cprops.Activo ? "A" : "C"}</span>,
      },
      {
        name: "Detalle",
        sortable: false,
        center: true,
        wrap: true,
        maxWidth: "200px",
        cell: (data) =>
          data.AplicacionID != null ? (
            <div>
              <button
                data-tip
                data-for={`DetalleAplicacion${data.CreditoID}`}
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
                  FNGetDetalleAplicacion(data.AplicacionID, data);
                }}
              >
                <FaEye />
              </button>
              <ReactTooltip
                id={`DetalleAplicacion${data.CreditoID}`}
                type="info"
                effect="solid"
                clickable
                globalEventOff="click"
              >
                Ver Detalle Aplicacion
              </ReactTooltip>
            </div>
          ) : (
            <span></span>
          ),
      },
      {
        name: "Tipo Pago",
        selector: "PagoMigrado",
        center: true,
        maxWidth: "110px",
        wrap: true,
        cell: (cprops) => (
          <span>{cprops.PagoMigrado ? "Aclaracion / Bancos" : "Caja"}</span>
        ),
      },
    ];

    return ColumnsClienteLiquidado;

    //eslint-disable-next-line
  }, []);

  const ColumnsValera = React.useMemo(() => {
    // Columnas basicas a incluir en la tabla
    const ColumnasValera: IDataTableColumn[] = [
      { name: "ID", selector: "ValeraID", sortable: true, wrap: true },
      { name: "Producto", selector: "Producto", sortable: true, wrap: true },
      { name: "Serie", selector: "serie", sortable: true, wrap: true },
      {
        name: "F.Inicial",
        selector: "FolioInicial",
        sortable: true,
        wrap: true,
      },
      { name: "F.Final", selector: "FolioFinal", sortable: true, wrap: true },
      {
        name: "Ver",
        selector: "",
        sortable: true,
        wrap: true,
        cell: (cprops) => (
          <button
            /* data-tip data-for={`btnVer_${props.ValeraID}`} */ style={{
              margin: ".15em",
              width: "15%",
              height: "40px",
              padding: "0px",
              tableLayout: "fixed",
              borderCollapse: "collapse",
            }}
            className="btn btn-outline-default mb-3"
            type={"button"}
            onClick={() => {
              setState((s) => ({
                ...s,
                ShowVales: true,
                ValeraID: cprops.ValeraID,
                Form: { ...state.Form },
              }));
            }}
          >
            <FaEye />
          </button>
        ),
      },
      // { name: 'Crédito Disponible', selector: 'CreditoDisponible', sortable: true, maxWidth: "150px", cell: (cprops) => <span>{FormateoDinero.format(cprops.CreditoDisponible)}</span> },
    ];

    return ColumnasValera;
    //eslint-disable-next-line
  }, []);

  const ColumnsGestores = React.useMemo(() => {
    // Columnas basicas a incluir en la tabla
    const ColumnasGestores: IDataTableColumn[] = [
      // { name: 'ID', selector: 'ValeraID', sortable: true, wrap: true },
      {
        name: "Nombre Gestor",
        selector: "NombreGestor",
        sortable: true,
        wrap: true,
        width: "30%",
      },
      {
        name: "FechaAsigna",
        selector: "FechaActualiza",
        sortable: true,
        wrap: true,
        width: "30%",
        cell: (props) => (
          <span>
            {moment.parseZone(props.FechaActualiza).format("DD/MM/YYYY")}
          </span>
        ),
      },
      {
        name: "Nombre Asigna",
        selector: "Nombre",
        sortable: true,
        wrap: true,
        width: "30%",
      },
      // {
      //   name: "limInferiorDias",
      //   selector: "limInferiorDias",
      //   sortable: true,
      //   wrap: true,
      // },
      // {
      //   name: "limSuperiorDias",
      //   selector: "limSuperiorDias",
      //   sortable: true,
      //   wrap: true,
      // },
      // {
      //     name: 'Ver', selector: '', sortable: true, wrap: true,
      //     cell: (cprops) => <button /* data-tip data-for={`btnVer_${props.ValeraID}`} */ style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default mb-3" type={"button"} onClick={() => {
      //         setState(s => ({
      //             ...s,
      //             ShowVales: true,
      //             ValeraID: cprops.ValeraID
      //             , Form: { ...state.Form }
      //         }))
      //     }}>
      //         <FaEye />
      //     </button>

      // },
      // { name: 'Crédito Disponible', selector: 'CreditoDisponible', sortable: true, maxWidth: "150px", cell: (cprops) => <span>{FormateoDinero.format(cprops.CreditoDisponible)}</span> },
    ];

    return ColumnasGestores;

    //eslint-disable-next-line
  }, []);

  const ColumnsCoord = React.useMemo(() => {
    // Columnas basicas a incluir en la tabla
    const ColumnasCoord: IDataTableColumn[] = [
      {
        name: "ID",
        selector: "CoordinadorID",
        sortable: true,
        wrap: true,
        width: "10%",
      },
      {
        name: "Coordinador",
        selector: "NombreCompleto",
        sortable: true,
        wrap: true,
        width: "40%",
      },
      { name: "GrupoID", selector: "GrupoID", sortable: true, wrap: true },
      {
        name: "Descripcion",
        selector: "Descripcion",
        sortable: true,
        wrap: true,
      },
      // { name: 'limSuperiorDias', selector: 'limSuperiorDias', sortable: true, wrap: true },
      // {
      //     name: 'Ver', selector: '', sortable: true, wrap: true,
      //     cell: (cprops) => <button /* data-tip data-for={`btnVer_${props.ValeraID}`} */ style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default mb-3" type={"button"} onClick={() => {
      //         setState(s => ({
      //             ...s,
      //             ShowVales: true,
      //             ValeraID: cprops.ValeraID
      //             , Form: { ...state.Form }
      //         }))
      //     }}>
      //         <FaEye />
      //     </button>

      // },
      // { name: 'Crédito Disponible', selector: 'CreditoDisponible', sortable: true, maxWidth: "150px", cell: (cprops) => <span>{FormateoDinero.format(cprops.CreditoDisponible)}</span> },
    ];
    return ColumnasCoord;
    //eslint-disable-next-line
  }, []);

  const ObtenerPlazos = () => {
    setState((s) => ({ ...s, Cargando: true }));

    FuncionesReestructuras.FNGetPlazos(oidc)
      .then((res: any) => {
        var plazos = res.map((val: any) => {
          var obj = { value: val.PlazoID, label: val.Quincenas };
          return obj;
        });
        setState((s) => ({ ...s, DatosMostrarPlazos: plazos }));
        // setData({ DatosMostrarQuita: res });
      })
      .catch((error: any) => {
        setState((s) => ({ ...s, DatosMostrarPlazos: [] }));
        toast.error(`Error: ${error.response}`);
      });
  };

  const contextActions = React.useMemo(() => {
    //console.log("Arreglo final ,", selectedRows);

    return (
      <button
        data-tip
        className="ms-2 btn btn-primary waves-effect waves-light"
        type="button"
        onClick={() => {
          setState((s) => ({
            ...s,
            ModalPlazos: true,
            Datos: selectedRows,
          }));
        }}
      >
        <FaUsers /> Reestructurar Créditos Seleccionados
      </button>
    );
  }, [selectedRows]);
  const sucursalTxt = useRef<any>()
  const disableRow = (item: any) => {
    // los estatus 3 y 1 existian con anterioridad. se agrego el estatus 100 para no seleccionar la fila de totales
    if (item.EstatusID == 3 || item.EstatusID == 1 || item.EstatusID == 100) {  
      return true;
    } else {
      return false;
    }
  };

  if (Estado.Cargando)
    return (
      <div className="text-center">
        <Spinner />
        <br />
        <span>Obteniendo detalle de la socia</span>
      </div>
    );
  else if (!Estado.Cargando && Estado.Error)
    return (
      <div className="text-center">
        <span>Error al cargar el perfil de proveedor</span>
        <br />
        <button onClick={ConsultarDatos} className="btn btn-sm btn-link">
          <FiRefreshCcw />{" "}
        </button>
      </div>
    );
  // Renderamos nuestro componente
  else if (Estado.Distribuidor !== undefined)
    return (
      <div className="row text-left">
        <div className="col-md-6 mt-2">
          {/* <div className=""> */}
          <div className="col-md-12">
            <Acordion TabSelecionado="">
              <Acordion.Tab
                Titulo={
                  <span>
                    <FcDam size={20} /> SUCURSAL
                  </span>
                }
                Identificador="sucursal"
              >
                <div>
                  {/* <h5 className={'mt-0 mb-0'}>{Estado.Distribuidor.EmpresaId}</h5> */}
                  <p className={"mt-0 mb-0"}>
                    <strong>Zona: </strong>
                    {Estado.Distribuidor.ZonaNombre}
                  </p>
                  <p className={"mt-0 mb-0"} ref={sucursalTxt}>
                    <strong>Sucursal: </strong>
                    {Estado.Distribuidor.Sucursal_Nombre}
                  </p>
                  <p className={"mt-0 mb-0"}>
                    <strong>Dirección:</strong>{" "}
                    {Estado.Distribuidor.NombreVialidad +
                      " #" +
                      Estado.Distribuidor.NumeroExterior}
                  </p>
                  <p className={"mt-0 mb-0"}>
                    {Estado.Distribuidor.Tipo_asenta +
                      " " +
                      Estado.Distribuidor.Asentamiento +
                      " " +
                      "C.P: " +
                      Estado.Distribuidor.codigoPostal}{" "}
                  </p>
                  <p className={"mt-0 mb-0"}>
                    {Estado.Distribuidor.Municipio +
                      ", " +
                      Estado.Distribuidor.Estado}
                  </p>
                  <p className={"mt-0 mb-0"}>
                    <strong>No. Socia: </strong>
                    {Estado.Distribuidor.NumeroDist}
                  </p>
                </div>
              </Acordion.Tab>
            </Acordion>
          </div>

          <div className="col-md-12  mt-2">
            <Acordion TabSelecionado="">
              <Acordion.Tab
                Titulo={
                  <span>
                    <FcComboChart size={20} /> NIVEL
                  </span>
                }
                Identificador="nivel"
              >
                <div>
                  <table style={{ width: "100%", tableLayout: "fixed" }}>
                    <tbody>
                      <tr>
                        <td
                          className="text-start"
                          style={{
                            display: "flex",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Nivel Interno:
                        </td>
                        <td className="text-end">
                          {Estado.Distribuidor.Nivel_DistribuidorNivel}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="text-start"
                          style={{
                            display: "flex",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Nivel Origen:
                        </td>
                        <td className="text-end">
                          {Estado.Distribuidor.DistribuidorNivel}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="text-start"
                          style={{
                            display: "flex",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Linea Credito::
                        </td>
                        <td className="text-end">
                          {FormateoDinero.format(
                            Estado.Distribuidor.LineaCredito as number
                          )}
                        </td>
                      </tr>
                      {/* <tr>
                                                <td className="text-start" style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Capital Colocado Maximo:</td>
                                                <td className="text-end">{FormateoDinero.format(Estado.NivelMonto?.LineaCredito as number)}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-start" style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Capital Colocado Minimo:</td>
                                                <td className="text-end">{FormateoDinero.format(Estado.NivelMonto?.LineaCreditoMinimo as number)}</td>
                                            </tr> */}
                      <tr>
                        <td
                          className="text-start"
                          style={{
                            display: "flex",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Proteccion de :
                        </td>
                        <td className="text-end">
                          {FormateoDinero.format(
                            Estado.Distribuidor
                              .Nivel_ImporteProteccionSaldo as number
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="text-start"
                          style={{
                            display: "flex",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Canje Aval:
                        </td>
                        <td className="text-end">
                          {FormateoDinero.format(
                            Estado.Distribuidor
                              .Nivel_maximoImporteCanjeAval as number
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            display: "flex",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Canje Cliente:
                        </td>
                        <td className="text-end">
                          {FormateoDinero.format(
                            Estado.Distribuidor
                              .Nivel_maximoImporteCanjeCliente as number
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="text-start"
                          style={{
                            display: "flex",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Maximo Prestamo Personal:
                        </td>
                        <td className="text-end">
                          {FormateoDinero.format(
                            Estado.Distribuidor
                              .Nivel_maximoPrestamoPersonal as number
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="text-start"
                          style={{
                            display: "flex",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Comision Base:
                        </td>
                        <td className="text-end">
                          {Estado.Distribuidor.Nivel_PorcComisionBase}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Acordion.Tab>
            </Acordion>
          </div>
          {/* </div> */}
        </div>

        <div className="col-md-6 mt-2">
          <div className="col-md-12">
            <Acordion TabSelecionado="">
              <Acordion.Tab
                Titulo={
                  <span>
                    <FcViewDetails size={20} /> ESTADO{" "}
                    {Estado.Distribuidor.Estatus_DistribuidoresEstatus}
                  </span>
                }
                Identificador="status"
              >
                <div className="text-start">
                  <table style={{ width: "100%", tableLayout: "fixed" }}>
                    <tbody>
                      <tr>
                        <td className="text-center">
                          {Estado.Distribuidor.Estatus_Orden ? (
                            <FaCheck color="green" />
                          ) : (
                            <FiAlertTriangle color="red" />
                          )}
                        </td>
                        <td>
                          {Estado.Distribuidor.Estatus_Orden
                            ? "Puede ordenar"
                            : "No Puede ordenar"}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-center">
                          {Estado.Distribuidor.Estatus_PuedeCanjear ? (
                            <FaCheck color="green" />
                          ) : (
                            <FiAlertTriangle color="red" />
                          )}
                        </td>
                        <td>
                          {Estado.Distribuidor.Estatus_PuedeCanjear
                            ? "Puede canjear"
                            : "No Puede canjear"}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-center">
                          {Estado.Distribuidor.Estatus_Especial ? (
                            <FaCheck color="green" />
                          ) : (
                            <MdClose color="red" />
                          )}
                        </td>
                        <td>
                          {Estado.Distribuidor.Estatus_Especial
                            ? "Estado especial"
                            : "Sin Estado especial"}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-center">
                          {Estado.Distribuidor.Estatus_Convenio ? (
                            <FaCheck color="green" />
                          ) : (
                            <MdClose color="red" />
                          )}
                        </td>
                        <td>
                          {Estado.Distribuidor.Estatus_Convenio
                            ? "En convenio"
                            : "Sin convenio"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Acordion.Tab>
            </Acordion>
          </div>
          <div className="col-md-12 mt-2">
            <Acordion TabSelecionado="">
              <Acordion.Tab
                Titulo={
                  <span>
                    <FcConferenceCall size={20} /> AVALES (
                    {state.datosAvales?.length}){" "}
                  </span>
                }
                Identificador="aval"
              >
                <div>
                  {ui.PermisosProductos?.find((p) => p.PermisoID == 134) && (
                    <div
                      style={{
                        position: "absolute",
                        right: "0px",
                        zIndex: 10,
                        cursor: "pointer",
                        top: "85px",
                      }}
                      title={"Agregar Aval"}
                      onClick={() =>
                        setState({
                          ...state,
                          FormDatosAvales: {
                            Mostrar: true,
                            datosAvales: DatosDefecto,
                            Id: undefined,
                          },
                        })
                      } /* onClick={() => showAvales(0, Estado.Distribuidor?.DistribuidorID)}*/
                    >
                      <FcPlus size={25} />
                    </div>
                  )}
                  <table style={{ width: "100%", tableLayout: "fixed" }}>
                    <tbody>
                      {state.datosAvales !== undefined &&
                        (state.datosAvales as any[]).map((a, aId) => (
                          <tr key={"datosaval_" + aId}>
                            <td className="text-start">{a.NombreCompleto}</td>
                            <td className="text-end">
                              <span
                                className="badge rounded-pill"
                                style={{ backgroundColor: a.ColorAval }}
                              >
                                {a.TipoAval}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Acordion.Tab>
            </Acordion>
          </div>
          <div className="col-md-12 mt-2">
            <Acordion TabSelecionado="">
              <Acordion.Tab
                Titulo={
                  <span>
                    <FcConferenceCall size={20} /> REFERENCIAS (
                    {state.datosReferencias?.length}){" "}
                  </span>
                }
                Identificador="aval"
              >
                <div>
                  {ui.PermisosProductos?.find((p) => p.PermisoID == 134) && (
                    <div
                      style={{
                        position: "absolute",
                        right: "0px",
                        zIndex: 10,
                        cursor: "pointer",
                        top: "85px",
                      }}
                      title={"Agregar Aval"}
                      onClick={() =>
                        setState({
                          ...state,
                          FormDatosAvales: {
                            Mostrar: true,
                            datosAvales: DatosDefecto,
                            Id: undefined,
                          },
                        })
                      } /* onClick={() => showAvales(0, Estado.Distribuidor?.DistribuidorID)}*/
                    >
                      {/*    <FcPlus size={25} /> */}
                    </div>
                  )}
                  <table style={{ width: "100%", tableLayout: "fixed" }}>
                    <tbody>
                      {state.datosReferencias !== undefined &&
                        (state.datosReferencias as any[]).map((a, aId) => (
                          <>
                            <tr>
                              <td className="text-start">
                                NOMBRE: {a.nombre} {a.primerApellido}{" "}
                                {a.segundoApellido}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-start">
                                DOMICILIO: {a.domicilio}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-start">
                                TELEFONO: {a.celular}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-start">
                                PARENTESCO: {a.parentesco}
                              </td>
                            </tr>
                          </>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Acordion.Tab>
            </Acordion>
          </div>
        </div>
        <div className="col-md-12 mt-2">
          <Acordion TabSelecionado="">
            <Acordion.Tab
              Titulo={
                <span>
                  <FcPodiumWithSpeaker size={20} /> COORDINADOR (
                  {state.coordinadores?.length}){" "}
                </span>
              }
              Identificador="coordinadores"
            >
              <div>
                <DataTable
                  data={state.coordinadores}
                  striped
                  // pagination
                  dense
                  noHeader
                  responsive
                  keyField={"CoordinadorID"}
                  columns={ColumnsCoord}
                />
              </div>
            </Acordion.Tab>
          </Acordion>
        </div>
        <div className="col-md-12 mt-2">
          <Acordion TabSelecionado="">
            <Acordion.Tab
              Titulo={
                <span>
                  <FcManager size={20} /> GESTOR ({state.gestores?.length}){" "}
                </span>
              }
              Identificador="gestores"
            >
              <div>
                <DataTable
                  data={state.gestores}
                  striped
                  // pagination
                  dense
                  noHeader
                  responsive
                  keyField={"GestorCobranzaID"}
                  columns={ColumnsGestores}
                />
              </div>
            </Acordion.Tab>
          </Acordion>
        </div>
        <div className="col-md-12 mt-2">
          <Acordion TabSelecionado="">
            <Acordion.Tab
              Titulo={
                <span>
                  <FcKindle size={20} /> VALERAS ({state.valeras?.length}){" "}
                </span>
              }
              Identificador="valeras"
            >
              <div>
                <DataTable
                  data={state.valeras}
                  striped
                  // pagination
                  dense
                  noHeader
                  responsive
                  keyField={"ValeraID"}
                  columns={ColumnsValera}
                />
              </div>
            </Acordion.Tab>
          </Acordion>
        </div>
        <div className="col-md-12 mt-2">
          <Acordion TabSelecionado="">
            <Acordion.Tab
              Titulo={
                <span>
                  <FcAcceptDatabase size={20} /> EXPERIENCIA EN VENTAS (
                  {Estado.ExperienciaDistribuidor?.length}){" "}
                </span>
              }
              Identificador="experiencia"
            >
              <div>
                <DataTable
                  data={Estado.exp}
                  striped
                  // pagination
                  dense
                  noHeader
                  responsive
                  keyField={"CreditosDistribuidoresExperienciaID"}
                  columns={Columns}
                />
              </div>
            </Acordion.Tab>
          </Acordion>
        </div>
        <div className="col-md-12 mt-2">
          <Acordion TabSelecionado="">
            <Acordion.Tab
              Titulo={
                <span>
                  <FcMoneyTransfer size={20} /> CLIENTES LIQUIDADOS (
                  {state.clientesLiquidados?.length})
                </span>
              }
              Identificador="Contratos"
            >
              <>
                <div>
                  <DataTable
                    data={state.clientesLiquidados}
                    striped
                    // pagination
                    dense
                    noHeader
                    responsive
                    keyField={"ClienteID"}
                    columns={ColumnsClienteLiquidado}
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
                  <FcCurrencyExchange size={20} /> CREDITOS ACTIVOS (
                  {state.CreditosActivos?.length - 1}) 
                </span>
                // se resta uno por la fila de totales
              }
              Identificador="Contratos"
            >
              <>
                <div>
                  <DataTable
                    subHeader
                    contextActions={contextActions}
                    clearSelectedRows={toggleCleared}
                    onSelectedRowsChange={handleRowSelected}
                    paginationComponentOptions={{
                      rowsPerPageText: "Registros por pagina:",
                      rangeSeparatorText: "de",
                      noRowsPerPage: false,
                      selectAllRowsItem: false,
                      selectAllRowsItemText: "Todo",
                    }}
                  
                    contextMessage={{
                      singular: "- Crédito seleccionado",
                      plural: "- Créditos seleccionados",
                      message: mensajeCreditosSeleccionados,
                    }}
                    selectableRowDisabled={(row: any) => disableRow(row)}
                    selectableRows
                    //  noDataComponent={<div style={{ margin: '4em' }}> {<><FaExclamationCircle color={'grey'} size={20} />  NO HAY SOLICITUDES </>}</div>}
                    //  title={<span>Lista de Solicitudes Incrementos</span>}

                    data={state.CreditosActivos}
                    striped
                    // pagination
                    dense
                    // noHeader
                    responsive
                    keyField={"CreditoID"}
                    columns={ColumnsCreditosActivos}
                    customStyles={{
                      headRow: {
                        style: {
                          textAlign: "center",
                        },
                      }
                    }}
                    conditionalRowStyles={[
                      {
                        when: (row: any) => row.pagoModa === "100",
                        style: {
                          backgroundColor: "#f2f2f2",
                          borderTop: "1px solid #444",
                          fontWeight: "bold",
                          textAlign: "left",
                          fontSize: ".9em",
                        },
                      },
                    ]}
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
                  <FcAddressBook size={20} /> APLICACIONES (
                  {state.PagosAplicados?.length})
                </span>
              }
              Identificador="Contratos"
            >
              <>
                <div
                  style={{
                    overflow: "auto",
                    maxHeight: "500px",
                  }}
                >
                  <DataTable
                    data={state.PagosAplicados}
                    striped
                    pagination
                    dense
                    noHeader
                    responsive
                    keyField={"AplicacionID"}
                    columns={ColumnsPagosAplicados}
                  />
                </div>
              </>
            </Acordion.Tab>
          </Acordion>
        </div>
        {state.DetalleAplicacion && (
          <ModalWin
            open={state.DetalleAplicacion}
            zIndex={3000}
            xlarge
            scrollable
            center={true}
          >
            <ModalWin.Header>
              <h5 className={MODAL_TITLE_CLASS}>
                <strong>
                  <h4>{"Detalle Aplicacion"}</h4>
                </strong>
                <strong>{"N° Aplicacion: "}</strong>
                {state.AplicacionID}
              </h5>
              <button
                type="button"
                className="delete"
                onClick={() => setState({ ...state, DetalleAplicacion: false })}
              />
            </ModalWin.Header>
            <ModalWin.Body>
              <DataTable
                data={state.DatosDetalle}
                striped
                noDataComponent="No data."
                // pagination
                dense
                noHeader
                responsive
                keyField={"AbonoID"}
                defaultSortAsc={true}
                defaultSortField={"AbonoID"}
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
        )}
        <ModalWin
          open={state.DetallePlanCredito}
          xlarge
          scrollable
          center={true}
        >
          <ModalWin.Header>
            <h5 className={MODAL_TITLE_CLASS}>
              {/* {"Abonos"} <br />
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
                            state.Cliente}{" "} */}
              <br />
            </h5>
            <button
              type="button"
              title="Cerrar"
              className="delete"
              onClick={() => setState({ ...state, DetallePlanCredito: false })}
            />
          </ModalWin.Header>
          <ModalWin.Body>
            <DataTable
              data={state.DatosDetalleCredito}
              striped
              // pagination

              dense
              noHeader
              responsive
              keyField={"NoPago"}
              defaultSortField={"NoPago"}
              columns={DetailColumnsCredito}
            // expandableRows
            // expandOnRowClicked
            // onRowExpandToggled={(res: any) => {
            //     HiddenData(res)
            // }}
            // expandableRowsComponent={<HiddenData/>}
            />
          </ModalWin.Body>
        </ModalWin>

        <ModalWin
          open={state.DetalleClienteFinal}
          center
          scrollable
          full={true}
          zIndex={3000}
        >
          <ModalWin.Header>
            <button
              type="button"
              className="delete"
              onClick={() => setState({ ...state, DetalleClienteFinal: false })}
            />
          </ModalWin.Header>
          <ModalWin.Body>
            {(state.DetalleClienteFinal) && /* (
              <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-3">
                  <Card Title={<span>Detalles Personales</span>}>
                    <Card.Body>
                      <React.Fragment>
                        <PerfilPersonaParaGlobal
                          Editar={false}
                          Persona={
                            state.DatosCliente
                              .Persona as DBConfia_General.IPersonas_VW
                          }
                          Direcciones={state.DatosCliente.Direcciones}
                          Empleos={state.DatosCliente.Empleos}
                          Creditos={
                            state.DatosCliente
                              .Creditos as DBConfia_Creditos.ICreditos_VW
                          }
                          oidc={oidc}
                          ui={ui}
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
                          personaID={state.DatosCliente.Persona?.ClienteID as number}
                          oidc={oidc}
                          iUI={ui}
                          aclaracion={false}
                          incremento={false}
                          prestamo={false}
                          herramientas={false}
                          ultimasAplicaciones={false}
                          curp={""}
                          sucursalid={0}
                          lectorHuella={false}
                        />
                      </React.Fragment>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            ) */

              (
                <Persona key={"com_admin_cliente"}
                  TipoPersona={Persona.TipoPersona.Cliente}
                  IdPersona={(state.ClienteSelected as any)?.PersonaID as number}
                />
              )}
          </ModalWin.Body>
        </ModalWin>

        {state.ShowVales && (
          <ModalWin open={state.ShowVales} center zIndex={5000}>
            <ModalWin.Header>
              <h5 className={MODAL_TITLE_CLASS}>VALERA</h5>
              <button
                type="button"
                className="delete"
                onClick={() => {
                  fnCancelar();
                }}
              />
            </ModalWin.Header>
            <ModalWin.Body>
              <Vales ValeraID={state.ValeraID} />
            </ModalWin.Body>
          </ModalWin>
        )}

        {state.FormDatosAvales.Mostrar && (
          <AgregarAval
            oidc={oidc}
            Id={state.Form.Id}
            cbActualizar={() => { }}
            cbGuardar={cbAgregarA}
            fnCancelar={fnCancelarA}
            Mostrar={state.FormDatosAvales.Mostrar}
            Item={state.avalMuestra}
            distribuidorID={Estado.Distribuidor.DistribuidorID}
          />
        )}

        {state.ModalPlazos && (
          <ModalWin
            open={state.ModalPlazos}
            zIndex={3000}
            scrollable
            center={true}
          >
            <ModalWin.Header>
              <h5 className={MODAL_TITLE_CLASS}>
                <strong>
                  <h4>{"Plazos"}</h4>
                </strong>
              </h5>
              <button
                type="button"
                className="delete"
                onClick={() => setState({ ...state, ModalPlazos: false })}
              />
            </ModalWin.Header>

            <ModalWin.Body>
              <CFormRCF
                oidc={oidc}
                fnCancelar={fnCancelarPlazos}
                selectedRows={selectedRows}
                optPlazos={state.DatosMostrarPlazos}
                DistribuidorID={DistribuidorID}
              />
            </ModalWin.Body>
          </ModalWin>
        )}
      </div>
    );

  return null;
};

export default PerfilDistribuidor;
