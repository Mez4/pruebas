import React, { useEffect, useState } from 'react'
import { IOidc } from '../../../interfaces/oidc/IOidc'
import { iUI } from '../../../interfaces/ui/iUI';
import { DBConfia_General } from '../../../interfaces_db/DBConfia/General'
import { DBConfia_Aclaraciones } from '../../../interfaces_db/DBConfia/Aclaraciones'
import { DBConfia_Prospectos } from '../../../interfaces_db/DBConfia/Prospectos'
import * as FuncionesTel from './CompPerfilPersona/FuncionesTel'
// Importamos las funciones de este componente
import * as Funciones from './CompPerfilPersona/Funciones'
import { Acordion, ModalWin, Spinner } from '../../global'
import { FiRefreshCcw } from 'react-icons/fi'
import ReactTooltip from 'react-tooltip'
import { FaPlusCircle, FaFacebookMessenger, FaEye, FaFileInvoiceDollar, FaClipboardCheck, FaBan, FaRegCheckCircle, FaCheckDouble, FaPrint } from 'react-icons/fa'
import { MdAttachMoney, MdEqualizer } from 'react-icons/md'
import { FcFolder, FcDepartment, FcInspection, FcCheckmark, FcCancel, FcPlus, FcAnswers, FcFinePrint, FcMoneyTransfer } from 'react-icons/fc'
import { MODAL_TITLE_CLASS } from '../../global/ModalWin'
import VerDoc from '../../app/modulos/personas/CompAdministracion/VerDoc'
import moment from 'moment'
import { CForm } from './CFormDatosBancarios'
import { CFormAclaracion } from './CFormAclaracion'
import { CFormSolicitudIncrementos } from './CFormSolicitudIncrementos'
import { CFormVerEvidencia } from './CFormVerEvidencia'
import { CFormAgregarEvidencia } from './CFormAgregarEvidencia'
import CFormNotasRapidas from './CFormNotasRapidas'
import { range } from '../../../global/functions'
import { CFormCargarDocumentoAclaracion } from './CFormCargarDocumento'
import DataTable from 'react-data-table-component'
import { IDataTableColumn } from 'react-data-table-component'
import { CFormMensajes } from '../../app/modulos/mesaDeAclaraciones/CompMesaDeAclaraciones/CatalogoAclaracion/CFormMensajes'
import { IoCash, IoCashOutline, IoCashSharp } from 'react-icons/io5'
import { DBConfia_Distribuidores } from '../../../interfaces_db/DBConfia/Distribuidores'
import Incrementos from '../../app/modulos/personas/CompAdministracion/Incrementos/Incrementos';
import { CFormSolicitudAumentoNivel } from './CFormSolicitudAumentoNivel';
import { CFormSolicitudPrestamosPersonales } from './CFormSolicitudPrestamosPersonales';
import { CFormAgregarEvidenciaPrestamo } from './CFormAgregarEvidenciaPrestamo';
import { CFormVerEvidenciaPrestamo } from './CFormVerEvidenciaPrestamo';
import { CFormCargaDocumentoPrestamo } from './CFormCargaDocumentoPrestamo';
import Vales from '../../app/modulos/distribuidor/CompDistribuidor/Vales';
import PlanPagos from './PlanPagos';
import Prestamos from '../../app/modulos/personas/CompAdministracion/PrestamosDistribuidores/Prestamos';
import { Solicitud } from '../../app/modulos/creditos/CompCreditos/CreditoReestructuraSolicitudes/Solicitud';
import { toast } from 'react-toastify';
import { FormateoDinero } from '../../../global/variables';
import { GoCheckCircle } from 'react-icons/go';
import { BiCheckDouble } from 'react-icons/bi';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaPen } from 'react-icons/fa6';
import CFormSCRSDocumentos from '../../app/modulos/creditos/CompCreditos/CreditoSolicitudCRS/CFormSCRSDocumentos';
import CFormSCRSDocEdit from '../../app/modulos/creditos/CompCreditos/CreditoSolicitudCRS/CFormSCRSDocEdit';
import { TbHistory } from 'react-icons/tb';
import internal from 'stream';
import PersonasDatosBancarios from '../../app/modulos/general/CompGeneral/PersonasDatosBancarios/PersonasDatosBancarios';
import PersonasDatosBancariosPP from '../../presentacion/persona/DatosBancariosPP/PersonasDatosBancarios';

type EstadoTipo = {
    DatosBancarios?: DBConfia_General.IPersonasDatosBancarios[],
    Documentos?: DBConfia_Prospectos.IDocumentos[]
    Buro?: DBConfia_General.IConsultaBuro[],
    Aclaraciones?: DBConfia_Aclaraciones.IAclaraciones[],
    Incrementos?: DBConfia_Distribuidores.ISolicitudesIncrementos[],
    Prestamos?: DBConfia_Distribuidores.ISolicitudesPrestamosPersonales[],
    Docs: [],
    Cargando: boolean,
    Error: boolean,
    Editar: boolean,
    aclaracion: boolean,
    incremento: boolean,
    prestamo: boolean,
    herramientas: boolean,
    ultimasAplicaciones?: boolean
}
type PerfilPersonaTipo = {
    oidc: IOidc
    personaID: number
    iUI: iUI,
    aclaracion: boolean
    incremento: boolean
    prestamo: boolean
    herramientas: boolean
    ultimasAplicaciones?: boolean
    curp: string
    sucursalid: number
    lectorHuella: boolean
}
const DatosPersona = ({ oidc, personaID, iUI, aclaracion, incremento, prestamo, herramientas, ultimasAplicaciones = true, curp, sucursalid, lectorHuella }: PerfilPersonaTipo) => {
    // Monitoreamos que el componente este montado
    let isMounted = React.useRef(true)

    const DatosDefecto = {
        personasDatosBancariosID: 0,
        personaID,
        datoTipoID: 0,
        cveBancoRef: 0,
        datoBancario: '',
    }
    const DatosDefectoBuro = {
        ConsultaBuroID: 0,
        EstatusConsultaBuroID: 0,
        FechaConsulta: '',
        FechaRegistro: '',
        personaID,
        PersonaRegistaID: 0,
        ResultCode: 0,
        ResultDesc: '',
        UsuarioRegistraID: 0,
        XmlResultBuroID: 0,
        url: ''
    }
    const DatosAclaracion = {
        AclaracionID: 0,
        SucursalID: 0,
        DistribuidorID: 0,
        CreditoID: 0,
        DescripcionAclaracion: '',
        EstatusID: 0,
        TipoSolicitudID: 0,
        NotasTesoreria: '',
        Observaciones: '',
        DocumentoID: 0,
        MesaAclaracionID: 0,
        BonificacionID: 0,
        CoordinadorID: 0,
        SolicitaID: 0,
        AutorizaID: 0,
        ConceptoID: 0,
        ProductoID: 0
    }
    const DatosIncrementos = {
        SolicitudID: 0,
        ProductoID: 0,
        SucursalID: 0,
        DistribuidorID: 0,
        ContratoID: 0,
        IncrementoSolicitado: 0,
        EstatusID: 0,
        UsuarioSolicitoID: 0,
        Observaciones: '',

    }
    const DatosPrestamos = {
        SolicitudPrestamoPersonalID: 0,
        ProductoID: 0,
        SucursalID: 0,
        DistribuidorID: 0,
        EmpresaID: 0,
        ContratoID: 0,
        PrestamoSolicitado: 0,
        EstatusID: 0,
        UsuarioSolicitoID: 0,
        Observaciones: '',
        PlazoSolicitado: 0,
        TipoDesembolso: 0

    }
    const DatosHerramientas = {
        Accion: 0,
        PlazoID: 0,
        QuitaID: 0,
        SaldoActual: 0,
        SaldoAtrasado: 0,

    }
    const DatosSolicitudNivel = {
        SolicitudID: 0,
        ProductoID: 0,
        SucursalID: 0,
        DistribuidorID: 0,
        ContratoID: 0,
        IncrementoSolicitado: 0,
        EstatusID: 0,
        UsuarioSolicitoID: 0,
        Observaciones: '',
    }

    const DistribuidorDatos = {
        DistribuidorNivelID: 0
    }

    const Datos: any[] = []
    const datosBancarios: any[] = []
    const datosBuro: any[] = []
    const datosAclaraciones: any[] = []
    const datosUltimasAplicaciones: any[] = []
    const datosIncrementos: any[] = []
    const datosPrestamos: any[] = []
    const datosHerramientas: any[] = []
    const datosHerramientas2: any[] = []
    const datosSolicitudNivel: any[] = []
    const distribuidorDatos: any[] = []
    const DatosIncrementos2: {} = {}
    const DatosPrestamos2: {} = {}
    const DatosHerramientas2: {} = {}
    const DatosMostrar: any[] = []
    const optBancos: any[] = []
    const optTipos: any[] = []
    const optAclaraciones: any[] = []
    const optIncrementos: any[] = []
    /////Estado del componente
    const [Estado, definirEstado] = React.useState<EstadoTipo>({
        aclaracion: false,
        incremento: false,
        ultimasAplicaciones: false,
        prestamo: false,
        DatosBancarios: [],
        Documentos: [],
        Docs: [],
        Buro: [],
        Aclaraciones: [],
        Incrementos: [],
        Prestamos: [],
        Cargando: true,
        Error: false,
        Editar: false,
        herramientas: false,
    })
    const [state, setState] = React.useState({
        ///////////VARIABLES DE ACLARACIONES///////////////////
        aclaracionGuardadaID: 0,
        solicitudGuardada: false,
        permitirEvidencia: false,
        aclaracion,
        aclID: 0,
        MostrarMensajes: false,
        ///////////VARIABLES DE INCREMENTOS///////////////////
        solicitudIncrementoGuardadaID: 0,
        solicitudIncrementoGuardada: false,
        incremento,
        ultimasAplicaciones,
        incID: 0,
        ///////////////////////////////////////////////////////

        ///////////VARIABLES DE PRESTAMOS///////////////////
        solicitudPrestamoGuardadaID: 0,
        solicitudPrestamoGuardada: false,
        permitirEvidenciaPrestamo: false,
        permitirDatosBancarios: false,
        SolicitudPrestamoPersonalID: 0,
        prestamo,


        preID: 0,
        ///////////////////////////////////////////////////////
        showDocumento: false,
        SolicitudRCID: 0,
        Estatus: '',
        Accion: 0,
        herramientas,
        showPlanPagos: false,
        MostrarPlazos: false,

        datosBancarios,
        datosBuro,
        datosAclaraciones,
        datosUltimasAplicaciones,
        datosIncrementos,
        datosPrestamos,
        datosHerramientas,
        datosHerramientas2,
        datosSolicitudNivel,
        distribuidorDatos,
        datosBancos: [],
        srcBC: '',
        Datos,
        DatosMostrar,
        MostrarDoc: false,
        MostrarDocPrestamo: false,
        Documento: {
            documentoID: 0, documentoNombre: ''
        },
        Form: {
            Mostrar: false, VerDoc: false, VerInfo: false, MostrarMensajes: false,
        },
        FormNotasRapida: {
            Mostrar: false, datosNotasRapida: []
        },
        FormDatosBancarios: {
            Mostrar: false, datosBancarios: DatosDefecto, Id: undefined
        },
        FormDatosBuro: {
            Mostrar: false, datosBuro: DatosDefectoBuro, Id: undefined
        },
        FormAclaraciones: {
            Mostrar: false, datosAclaraciones: DatosAclaracion, Id: undefined
        },
        FormIncrementos: {
            Mostrar: false, datosIncrementos: DatosIncrementos, Id: undefined
        },
        FormPrestamos: {
            Mostrar: false, datosPrestamos: DatosPrestamos, Id: undefined
        },
        FormHerramientas: {
            Mostrar: false, datosHerramientas: DatosHerramientas, Id: undefined
        },
        FormAumentoNiv: {
            Mostrar: false, datosSolicitudNivel: DatosSolicitudNivel, Id: undefined
        },
        FormAgregarEvidencia: {
            CargarDocumento: false, DocumentoID: 0, AclaracionID: 0, ComprobanteEvid: false, VerEvi: false
        },
        FormAgregarEvidenciaPrestamo: {
            CargarDocumentoPrestamo: false, DocumentoID: 0, SolicitudPrestamoPersonalID: 0, ComprobanteEvidPrestamo: false, VerEviPrestamo: false
        },
        optBancos,
        optTipos,
        optAclaraciones,
        optIncrementos,
        DatosIncrementos2,
        DatosPrestamos2,
        DatosHerramientas2,
        cveBancoRef: 0,
        TipoMesaAclaracion: [],
        TipoBonificacion: [],
        TipoEstatus: [],
        TiposSolicitudAclaracion: [],
        TipoProductos: [],
        TipoProductosIncrementos: [],
        TipoProductosPrestamos: [],
        TipoContrato: [],
        optSucursales: [],
        Listo: false,
    })

    const [Listo, setListo] = useState(false)

    const [tipoUsuario, setTipoUsuario] = useState(0);
    const MySwal = withReactContent(Swal);


    const FnGetBancos = () => {
        setState(s => ({ ...s }))
        Funciones.FnGetBancosById(oidc).then((respuesta: any) => {
            var bancos = respuesta.map((valor: any) => {
                var obj = { value: valor.BancoID, label: valor.Nombre };
                return obj
            });
            setState(s => ({ ...s, optBancos: bancos }))
        })
            .catch(() => {
                setState(s => ({ ...s, optBancos: [] }))
            })
    }
    const FnGetTipos = () => {
        setState(s => ({ ...s }))
        Funciones.FnGetTiposBanco(oidc).then((respuesta: any) => {
            var tipos = respuesta.map((valor: any) => {
                var obj = { value: valor.datoTipoID, label: valor.datoTipoDesc };
                return obj

            });
            setState(s => ({ ...s, optTipos: tipos }))
        })
            .catch(() => {
                setState(s => ({ ...s, optTipos: [] }))
            })
    }

    const FNGetSucursales = () => {
        setState(s => ({ ...s }))
        Funciones.FnGetsucursalesTotal(oidc).then((respuesta: any) => {
            var tipos = respuesta.map((valor: any) => {
                var obj = { value: valor.SucursalID, label: valor.Nombre };
                return obj
            });
            console.log("TIPOS de sucursales ", tipos)
            setState(s => ({ ...s, optSucursales: tipos }))
        })
            .catch(() => {
                setState(s => ({ ...s, optSucursales: [] }))
            })
    }

    const FnGetTiposProductos = () => {
        setState(s => ({ ...s }))
        Funciones.FnGetTiposProductos(oidc, personaID).then((respuesta: any) => {

            var tipos = respuesta.map((valor: any) => {
                var obj = { value: valor.ProductoID, label: valor.empresaNombre + " - " + valor.Producto, SucursalID: valor.SucursalID };
                return obj
            });
            setState(s => ({ ...s, TipoProductos: tipos }))

        })
            .catch(() => {
                setState(s => ({ ...s, TipoProductos: [] }))
            })
    }

    const FnGetTiposProductosIncrementos = (EmpresaId?: any) => {
        setState(s => ({ ...s }))
        Funciones.FnGetIncrementosProductos(oidc, EmpresaId).then((respuesta: any) => {

            var tipos = respuesta.map((valor: any) => {
                var obj = { value: valor.ProductoID, label: valor.Producto };
                return obj
            });
            setState(s => ({ ...s, TipoProductosIncrementos: tipos }))

        })
            .catch(() => {
                setState(s => ({ ...s, TipoProductosIncrementos: [] }))
            })
    }

    const FnGetUltimasAplicacionesSocia = () => {
        setState(s => ({ ...s }))

        let Datos = { DistribuidorID: personaID as number, SucursalID: 0 }
        Funciones.FNGetAplicacionesSocia(oidc, Datos).then((respuesta: any) => {
            setState(s => ({ ...s, datosUltimasAplicaciones: respuesta }))

        })
            .catch(() => {
                setState(s => ({ ...s, datosUltimasAplicaciones: [] }))
            })
    }

    // Funcion para abrir documentos de las solicitudes
    const AbrirDocumentos = (props) => {
        setState(prevState => ({
            ...prevState,
            showDocumento: true,
            SolicitudRCID: props.SolicitudRCID,
            Estatus: props.Estatus,
            Accion: props.Accion
        }));
    };


    const cbDatosBancarios = (item: any) =>
        setState(s => ({ ...s, permitirDatosBancarios: false }))

    const FNEsDistribuidor = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetEsDistribuidor(oidc, personaID).then((respuesta: any) => {
            setState(s => ({ ...s, aclaracion: respuesta.Distribuidor }))
        })
            .catch(() => {
                setState(s => ({ ...s, aclaracion: false }))
            })

    }

    const FNEsDistribuidor2 = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetEsDistribuidor(oidc, personaID).then((respuesta: any) => {
            setState(s => ({ ...s, incremento: respuesta.Distribuidor }))
        })
            .catch(() => {
                setState(s => ({ ...s, incremento: false }))
            })

    }
    /*---------------------------------------------------------------------------------------*/
    const FNGetAclara = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetAclara(oidc).then((respuesta: any) => {
            var aclaraciones = respuesta.map((valor: any) => {
                var obj = { value: valor.AclaracionID, label: valor.DescripcionAclaracion };
                return obj
            });
            setState(s => ({ ...s, optAclaraciones: aclaraciones }))
            console.log(aclaraciones, 'aclaraciones')
        })
            .catch(() => {
                setState(s => ({ ...s, optAclaraciones: [] }))
            })

    }
    const FNGetIncrem = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetIncrem(oidc).then((respuesta: any) => {
            var incrementos = respuesta.map((valor: any) => {
                var obj = { value: valor.SolicitudID, label: valor.Observaciones };
                return obj
            });
            setState(s => ({ ...s, optIncrementos: incrementos }))
            console.log(incrementos, 'incrementos')
        })
            .catch(() => {
                setState(s => ({ ...s, optIncrementos: [] }))
            })

    }
    const FNGetTipoMesaAclaracion = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetTipoMesaAclaracion(oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var mesa = respuesta.map((valor: any) => {
                        var obj = { value: valor.MesaAclaracionID, label: valor.NombreMesaAclaracion };
                        return obj
                    });
                    setState(s => ({ ...s, Cargando: false, Error: false, TipoMesaAclaracion: mesa }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, TipoMesaAclaracion: [] }))
                }
            })
    }
    const FNGetTipoBonidicacion = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetTipoBonidicacion(oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var mesa = respuesta.map((valor: any) => {
                        var obj = { value: valor.BonificacionID, label: valor.PorcentajeBonificacion };
                        return obj
                    });
                    setState(s => ({ ...s, Cargando: false, Error: false, TipoBonificacion: mesa }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, TipoBonificacion: [] }))
                }
            })
    }
    const FNGetTipoEstatus = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetTipoEstatus(oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var mesa = respuesta.map((valor: any) => {
                        var obj = { value: valor.EstatusID, label: valor.Descripcion };
                        return obj
                    });
                    setState(s => ({ ...s, Cargando: false, Error: false, TipoEstatus: mesa }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, TipoEstatus: [] }))
                }
            })
    }
    const FNGetTiposSolicitudAclaracion = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetTiposSolicitudAclaraciones(oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var concepto = respuesta.map((valor: any) => {
                        var obj = { value: valor.TipoSolicitudID, label: +"" + valor.ClaveSolicitud + " - " + valor.Descripcion };
                        return obj
                    });
                    setState(s => ({ ...s, Cargando: false, Error: false, TiposSolicitudAclaracion: concepto }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, TiposSolicitudAclaracion: [] }))
                }
            })
    }

    const FNGetNotasRapidas = () => {
        Funciones.FNGetNotas(oidc, { DistribuidorID: personaID })
            .then((respuestas: any) => {
                console.log("[resp]", respuestas)
                setState(s => ({ ...s, FormNotasRapida: { ...s.FormNotasRapida, datosNotasRapida: respuestas } }))
            })
            .catch((error) => { console.log("[resp]", error) })
    }
    /************************************************************************** */
    const fnCancelarMostrarCargaDeDocumento = () => {
        setState(s => ({
            ...s, FormAgregarEvidencia: {
                ...s.FormAgregarEvidencia, CargarDocumento: false
            }
        }))
    }

    const fnCancelarMostrarCargaDeDocumentoPrestamo = () => {
        setState(s => ({
            ...s, FormAgregarEvidenciaPrestamo: {
                ...s.FormAgregarEvidenciaPrestamo, CargarDocumentoPrestamo: false
            }
        }))
    }

    const fnCancelarPlanPagos = () => setState({ ...state, showPlanPagos: false, Form: { ...state.Form, Mostrar: false, } })

    const fnCancelarPlanPagosH = () => setState({ ...state, MostrarPlazos: false, Form: { ...state.Form, Mostrar: false, } })

    const fnCancelarVerEvidencia = () => {
        setState(s => ({
            ...s, FormAgregarEvidencia: {
                ...s.FormAgregarEvidencia, VerEvi: false
            }
        }))
    }
    const fnCancelarVerEvidenciaPrestamo = () => {
        setState(s => ({
            ...s, FormAgregarEvidenciaPrestamo: {
                ...s.FormAgregarEvidenciaPrestamo, VerEviPrestamo: false
            }
        }))
    }
    const fnVerEvi = (DocumentoID: any, AclaracionID: any, ComprobanteEvid: any) => {
        setState(s => ({
            ...s, FormAgregarEvidencia: {
                ...s.FormAgregarEvidencia, VerEvi: true, AclaracionID: AclaracionID, ComprobanteEvid: ComprobanteEvid
            }
            , DocumentoID: DocumentoID
        }))
    }
    const fnMostrarCargarEvidencia = (DocumentoID: any, AclaracionID: any) => {

        setState(s => ({
            ...s, FormAgregarEvidencia: {
                ...s.FormAgregarEvidencia, CargarDocumento: true, AclaracionID: AclaracionID
            }, DocumentoID: DocumentoID
        }))
    }
    const FnGetPersona = (Nombre: string, callback: any) => {
        let Datos = {
            Nombre: Nombre
        }
        setState(s => ({ ...s }))
        Funciones.FNGetPersona(oidc, Datos)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var persona = respuesta.map((valor: any) => {
                        var obj = { value: valor.PersonaID, label: valor.NombreCompleto, PersonaID: valor.PersonaID };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsUsuario: persona }))
                    callback(persona)
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsUsuario: [] }))
                    callback([])
                }
            })
    }
    // FUNCION PARA OBETNER LOS DATOS DE LA SUCURSAL
    const FnGetSucursal = (Nombre: string, callback: any) => {
        let Datos = {
            Nombre: Nombre
        }
        setState(s => ({ ...s }))
        Funciones.FNGetSucursal(oidc, Datos)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var sucursal = respuesta.map((valor: any) => {
                        console.log("SucID", valor.SucursalID)
                        var obj = { value: valor.SucursalID, label: valor.Nombre, SucursalID: valor.SucursalID };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsUsuario: sucursal }))
                    callback(sucursal)
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsUsuario: [] }))
                    callback([])
                }
            })
    }
    const FnGetAnalistas = () => {
        setState(s => ({ ...s }))
        Funciones.FnGetAnalistas(oidc)
            .then((respuesta: any) => {
                var sucursales = respuesta.map((valor: any) => {
                    var obj = { value: valor.AnalistaID, label: valor.NombreCompleto };
                    console.log("get errror", obj);
                    return obj
                });
                setState(s => ({ ...s, optAnalistaPers: sucursales }))
            })
            .catch(() => {
                setState(s => ({ ...s, optAnalistaPers: [] }))
            })
    }



    const fnGetCondicionesDetalle = (ProductoID: number, SucursalID?: number, DistribuidorID?: number) => {
        let Datos = {
            ProductoID,
            SucursalID: SucursalID as number,
            DistribuidorID: DistribuidorID as number
        }
        if (ProductoID! > 0 && SucursalID! > 0)
            Funciones.FNGetCondicionesAdminProd(oidc, Datos)
                .then((respuesta: any) => {
                    let arr = range(respuesta[0].ImporteMinimo, respuesta[0].ImporteMaximo, 500)
                    arr = arr.reverse()
                    let capital = arr.map((valor: any) => {
                        var obj = { value: valor, label: valor };
                        return obj
                    });
                    arr = range(respuesta[0].PlazosMinimos, respuesta[0].PlazosMaximos, 2)
                    arr = arr.reverse()
                    let plazos = arr.map((valor: any) => {
                        var obj = { value: valor, label: valor };
                        return obj
                    });
                    setState(s => ({ ...s, CondicionesDetalle: respuesta, optCapital: capital, optPlazos: plazos }))
                })
                .catch(() => {
                    setState(s => ({ ...s, CondicionesDetalle: [], optCapital: [], optPlazos: [] }))
                })
    }

    const fnGetDistribuidores = (SucursalID?: number) => {
        if (SucursalID! > 0)
            Funciones.FNGetBySucursalProd(oidc, SucursalID)
                .then((respuesta: any) => {

                    var distribuidores = respuesta.map((valor: any) => {
                        var obj = { value: valor.DistribuidorID, label: valor.PersonaNombre };
                        return obj
                    });
                    setState(s => ({ ...s, optDistribuidores: distribuidores, Distribuidores: respuesta }))
                })
                .catch(() => {
                    setState(s => ({ ...s, optDistribuidores: [], Distribuidores: [] }))
                })
    }

    /*---------------------------------------------------------------------------------------*/
    function formatearFecha(fecha) {
        return moment(fecha).format("DD/MM/YYYY")
    }
    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        FuncionesTel.FNGetDocumentos(oidc, personaID, 1).then((respuesta: any) => {
            console.log(respuesta, 'DOCS')
            if (isMounted.current === true) {
                definirEstado(s => ({ ...s, Docs: respuesta, srcBC: respuesta.Ruta }))
            }
        })
            .catch(() => {

                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Docs: [] }))
                }
            })
    }
    /////////////////////////////

    const FNObtenerPorId = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNObtenerDatoBanc(oidc, personaID).then((respuesta: any) => {
            if (isMounted.current === true) {
                setState(s => ({ ...s, datosBancarios: respuesta }))
            }
            console.log("Datos Bancarios", datosBancarios)

        })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, datosBancarios: [] }))
                }
            })
    }
    const FnObtenerAclaracionesPorID = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNObtenerAclaraciones(oidc, personaID).then((respuesta: any) => {
            if (isMounted.current === true) {
                setState(s => ({ ...s, datosAclaraciones: respuesta }))
            }
        })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, datosAclaraciones: [] }))
                }
            })
    }
    const FnObtenerIncrementoPorID = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetObtenerIncrementos(oidc, personaID).then((respuesta: any) => {
            if (isMounted.current === true) {
                setState(s => ({ ...s, datosIncrementos: respuesta }))
            }
        })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, datosIncrementos: [] }))
                }
            })
    }

    const FnObtenerPrestamoPorID = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetObtenerPrestamos(oidc, personaID).then((respuesta: any) => {
            console.log('FnObtenerPrestamoPorID: ', respuesta)
            if (isMounted.current === true) {
                setState(s => ({ ...s, datosPrestamos: respuesta }))
            }
        })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, datosPrestamos: [] }))
                }
            })
    }

    const FnObtenerHerramientas = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetObtenerHerramientas(oidc, personaID).then((respuesta: any) => {
            console.log('FnObtenerHerramientas: ', respuesta)
            setState(s => ({ ...s, datosHerramientas: respuesta }))


        })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, datosHerramientas: [] }))
                }
            })
    }

    const FnObtenerDistibuidoresporID = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FnObtenerDistibuidoresporID(oidc, personaID).then((respuesta: any) => {
            if (isMounted.current === true) {
                setState(s => ({ ...s, distribuidorDatos: respuesta }))
            }
        })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, distribuidorDatos: [] }))
                }
            })
    }

    const FnObtenerAumentoNivelporID = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetObtenerAumentosNivel(oidc, personaID).then((respuesta: any) => {
            if (isMounted.current === true) {
                setState(s => ({ ...s, datosSolicitudNivel: respuesta }))
            }
        })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, datosSolicitudNivel: [] }))
                }
            })
    }
    const cbAgregar = (item: any) => {
        setState({
            ...state, datosAclaraciones: [...state.datosAclaraciones, item],
            Form: {
                ...state.Form, Mostrar: false,
            }
        })
    }

    const cbAgregarIncremento = (item: any) => {
        setState({
            ...state, datosIncrementos: [...state.datosIncrementos, item],
            Form: {
                ...state.Form, Mostrar: false,
            }
        })
    }

    const cbAgregarPrestamo = (item: any) => {
        setState({
            ...state, datosPrestamos: [...state.datosPrestamos, item],
            Form: {
                ...state.Form, Mostrar: false,
            }
        })
    }

    const cbAgregarAumento = (item: any) => {
        setState({
            ...state, datosSolicitudNivel: [...state.datosSolicitudNivel, item],
            Form: {
                ...state.Form, Mostrar: false,
            }
        })
    }

    const FNObtenerBuroByPersona = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNgetBuroByPersona(oidc, personaID).then((respuesta: any) => {
            if (isMounted.current === true) {
                setState(s => ({ ...s, datosBuro: respuesta }))
            }
        })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, datosBuro: [] }))
                }
            })
    }
    const ConsultarDatos = async () => {
        // Actualizamos el estado (por si se acciona alguna función de actualización)
        definirEstado(e => ({ ...e, DatosBancarios: [], Documentos: [], Buro: [], Aclaraciones: [], Incrementos: [], Cargando: true, Error: false }))
        console.log("Datos Bancarios", definirEstado)
        try {
            if (isMounted)
                definirEstado(e =>
                ({
                    ...e, /*DatosBancarios: DBancarios,*//* Buro*/
                    Cargando: false, Error: false
                }))
        }
        catch (ex) {
            // Definimos el estado
            if (isMounted)
                definirEstado(e => ({ ...e, DatosBancarios: [], Cargando: false, Error: true }))
            // Logeamos el error
            console.log(`Error al obtener la persona con ID: ${personaID}`, ex)
        }
    }

    const toggleModalSolicitudCRS = () => {
        setState(s => ({ ...s, showDocumento: false }));
    }


    React.useEffect(() => {
        let a = {
            EmpresaId: iUI.Producto?.EmpresaId
        }
        setState({ ...state, aclaracion: false, incremento: false })
        FNEsDistribuidor()
        FNEsDistribuidor2()
        FNGetSucursales()
        ConsultarDatos()
        FNGetLocal()
        FnGetTiposProductos()
        console.log("LOG: ", iUI.Producto?.EmpresaId)
        FnGetTiposProductosIncrementos(a)
        FnGetBancos()
        FnGetTipos()
        FNObtenerPorId()
        FNGetAclara()
        FNGetIncrem()
        FNGetNotasRapidas()
        FNGetTipoMesaAclaracion()
        FNGetTipoBonidicacion()
        FNGetTipoEstatus()
        FnGetAnalistas()
        FNGetTiposSolicitudAclaracion()
        FnGetUltimasAplicacionesSocia()
        FnObtenerAclaracionesPorID()
        FnObtenerIncrementoPorID()
        FnObtenerAumentoNivelporID()
        FnObtenerPrestamoPorID()
        FNObtenerBuroByPersona()
        FnObtenerDistibuidoresporID()
        FnObtenerHerramientas()
        GetRolUsuario()
        return () => {
            isMounted.current = false
        }
    }, [personaID, tipoUsuario])
    const fnVerDoc = (id: number, nombre: string) => {
        setState({ ...state, Form: { ...state.Form, Mostrar: false, VerDoc: true }, Documento: { ...state.Documento, documentoID: id, documentoNombre: nombre } })
    }

    const fnCancelar = () =>
        setState({
            ...state, Form: { ...state.Form, Mostrar: false, VerDoc: false, VerInfo: false }, FormDatosBancarios: {
                ...state.FormDatosBancarios, Mostrar: false,
            }
        })

    const fnMostrarDocAclaracion = () => {
        setState(s => ({
            ...s, MostrarDoc: true
        }))
    }

    const fnMostrarDocPrestamo = () => {
        setState(s => ({
            ...s, MostrarDocPrestamo: true
        }))
    }

    const fnCerrarDocPrestamo = () => {
        setState(s => ({
            ...s, MostrarDocPrestamo: false
        }))
    }

    const fnMostrarFormNotasRapidas = (mostrar: boolean) => {
        setState({
            ...state,
            FormNotasRapida: {
                ...state.FormNotasRapida,
                Mostrar: mostrar
            }
        })
    }

    const fnCerrarDocAclaracion = () => {
        setState(s => ({
            ...s, MostrarDoc: false
        }))
    }

    const fnCancelarMostrarMensajes = () => {
        console.log("ENTRO CERRAR FORM ")
        setState(s => ({
            ...s, MostrarMensajes: false

        }))
        console.log("PASÓ DESPUÉS FORM ")
        FnObtenerAclaracionesPorID()
    }

    const fnMostrarSubirEvidencia = () => {
        setState(s => ({
            ...s, MostrarDoc: true
        }))
    }
    const cbActualizar = (item: any) => {
        console.log(item, 'item agregar', state.datosBancarios)
        const found = state.datosBancarios.find(element => element.datoTipoID == item.datoTipoID);
        console.log(found, 'FOUND');
        if (found) {
            setState({ ...state, datosBancarios: state.datosBancarios.map(Dato => Dato.datoTipoID === item.datoTipoID ? item : Dato), FormDatosBancarios: { ...state.FormDatosBancarios, Mostrar: false, datosBancarios: { personasDatosBancariosID: 0, personaID: 0, datoTipoID: -1, cveBancoRef: -1, datoBancario: '', /*fechaRegistro: '', activo: false*/ } } })
        } else {
            setState({ ...state, datosBancarios: [...state.datosBancarios, item], FormDatosBancarios: { ...state.FormDatosBancarios, Mostrar: false, datosBancarios: { personasDatosBancariosID: 0, personaID: 0, datoTipoID: -1, cveBancoRef: -1, datoBancario: '', /*fechaRegistro: '', activo: false*/ } } })
        }
    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////CALLBACKS DE ACLARACIONES////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const cbActualizarMensajesSinLeer = (item: any) => {
    }

    const fnAclaracionGuardada = (AclaracionID: number) => {
        setState(s => ({
            ...s, solicitudGuardada: true, aclaracionGuardadaID: AclaracionID
        }))
        FnObtenerAclaracionesPorID()
    }

    const fnAclaracionNoGuardada = () => {
        setState(s => ({
            ...s, solicitudGuardada: false
        }))
    }

    const fnHabilitarCargaDeEvidecia = () => {
        setState(s => ({
            ...s, permitirEvidencia: true
        }))
    }

    const fnDeshabilitarCargaDeEvidecia = () => {
        setState(s => ({
            ...s, permitirEvidencia: false
        }))
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////CALLBACKS DE INCREMENTOS////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const fnIncrementoGuardada = (SolicitudID: number) => {
        setState(s => ({
            ...s, solicitudIncrementoGuardada: true, solicitudIncrementoGuardadaID: SolicitudID
        }))
        FnObtenerIncrementoPorID()
    }

    const fnIncrementoNoGuardada = () => {
        setState(s => ({
            ...s, solicitudIncrementoGuardada: false
        }))
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////CALLBACKS DE PRESTAMOS PERSONALES////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const fnPrestamoGuardada = (SolicitudPrestamoPersonalID: number) => {
        setState(s => ({
            ...s, solicitudPrestamoGuardada: true, solicitudPrestamoGuardadaID: SolicitudPrestamoPersonalID
        }))
        FnObtenerPrestamoPorID()
    }

    const fnPrestamoNoGuardada = () => {
        setState(s => ({
            ...s, solicitudPrestamoGuardada: false
        }))
    }
    const fnHabilitarCargaDeEvideciaPrestamo = () => {
        setState(s => ({
            ...s, permitirEvidenciaPrestamo: true
        }))
    }

    const fnHabilitarCargaDeDatosBancarios = () => {
        setState(s => ({
            ...s, permitirDatosBancarios: true
        }))
    }

    const fnToggleListo = () => {
        console.log('listo toggled');
        setState(s => ({
            ...s, Listo: true
        }))
    }

    const fnDeshabilitarCargaDeEvideciaPrestamo = () => {
        setState(s => ({
            ...s, permitirEvidenciaPrestamo: false
        }))
    }

    const fnMostrarSubirEvidenciaPrestamo = () => {
        setState(s => ({
            ...s, MostrarDocPrestamo: true
        }))
    }

    const fnValidar = (SolicitudRCID: any) => {
        MySwal.fire({
            title: "<strong>Validar Solicitud</strong>",
            icon: "question",
            inputAttributes: {
                autocapitalize: "off",
            },
            html: (
                <div className="text-center">
                    Se validará la solicitud ¿Desea continuar? Una vez validada ya no se podrá revertir la acción.
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
        }).then((result) => {
            // console.log('result: ', result)
            if (result.isConfirmed) {
                Funciones.FNValidar(oidc, SolicitudRCID)
                    .then((res: any) => {
                        // console.log(res);
                        toast.success('Validado Exitosamente');
                        FnObtenerHerramientas();
                    }).catch((error: any) => {
                        if (error.response)
                            toast.error(`Response Error: ${error.response.data}`)
                        else if (error.request)
                            toast.error(`Request ${error}`)
                        else
                            toast.error(`${error}`)
                    })
            }
        });
    }


    const fnRechazar = (SolicitudRCID: any) => {
        MySwal.fire({
            title: "<strong>Rechazar Solicitud</strong>",
            icon: "question",
            inputAttributes: {
                autocapitalize: "off",
            },
            html: (
                <div className="text-center">
                    Se rechazará la solicitud ¿Desea continuar? Una vez rechazada ya no se podrá revertir la acción.
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
        }).then((result) => {
            // console.log('result: ', result)
            if (result.isConfirmed) {
                Funciones.FNRechazar(oidc, SolicitudRCID)
                    .then((res: any) => {
                        // console.log(res);
                        toast.success('Rechazado Exitosamente');
                        FnObtenerHerramientas();
                    }).catch((error: any) => {
                        toast.error(`Error: ${error.response}`);
                    })
            }
        });
    }

    const fnReValidar = (SolicitudRCID: any) => {
        MySwal.fire({
            title: "<strong>Re-Validar Solicitud</strong>",
            icon: "question",
            inputAttributes: {
                autocapitalize: "off",
            },
            html: (
                <div className="text-center">
                    Se re-validará la solicitud ¿Desea continuar? Una vez re-validada ya no se podrá revertir la acción.
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
        }).then((result) => {
            // console.log('result: ', result)
            if (result.isConfirmed) {
                Funciones.FNReValidar(oidc, SolicitudRCID)
                    .then((res: any) => {
                        // console.log(res);
                        toast.success('Re-Validado Exitosamente');
                        FnObtenerHerramientas();
                    }).catch((error: any) => {
                        toast.error(`Error: ${error.response}`);
                    })
            }
        });
    }

    const fnImprimir = (SolicitudRCID: any) => {
        MySwal.fire({
            title: "<strong>Descargar Convenio</strong>",
            icon: "question",
            html: (
                <div className="text-center">
                    Se descargara Convenio ¿Desea continuar?
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
                Funciones.FNPdf(oidc, SolicitudRCID)
                    .then((pdf: any) => {
                        const file = new Blob([pdf], {
                            type: "application/pdf",
                        });

                        var url = window.URL.createObjectURL(file);

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
                    })
                    .catch((error: any) => {
                        console.log(JSON.stringify(error));

                        toast.error(
                            "Error al descargar el archivo, intente descargar el archivo nuevamente o reportarlo a sistemas"
                        );
                    });
            }
        });
    }


    const planPagos = (Accion: any, PlazoID: any, QuitaID: any, saldoActual: any, MontoIntencion: any) => {

        if (Accion === 1) {
            const objPlazos = {
                SaldoActual: saldoActual,
                QuitaID: (QuitaID),
                PlazoID: (PlazoID),
                MontoIntencion: (MontoIntencion),
                accion: Accion
            }
            // console.log('objPlazos', objPlazos);

            Funciones.FNGetSimulacionPlazos(oidc, objPlazos)
                .then((res: any) => {
                    // console.log(res);
                    setState(s => ({ ...s, datosHerramientas2: res }));

                }).catch((error: any) => {
                    toast.error(`Error: ${error.response}`);
                })

        } else if (Accion === 2) {
            const obj = {
                SaldoActual: saldoActual,
                PlazoID: (PlazoID),
                accion: Accion
            }
            Funciones.FNGetSimulacionPlazos(oidc, obj)
                .then((res: any) => {
                    // console.log(res);
                    setState(s => ({ ...s, datosHerramientas2: res }));

                }).catch((error: any) => {
                    toast.error(`Error: ${error.response}`);
                })


        } else if (Accion === 3) {
            const obj = {
                SaldoActual: saldoActual,
                QuitaID: (QuitaID),
                PlazoID: (PlazoID),
                accion: Accion,
                DistribuidorID: personaID
            }
            Funciones.FNGetSimulacionPlazos(oidc, obj)
                .then((res: any) => {
                    // console.log(res);
                    setState(s => ({ ...s, datosHerramientas2: res }));

                }).catch((error: any) => {
                    toast.error(`Error: ${error.response}`);
                })
        }

    }

    const GetRolUsuario = () => {
        // setLoading(true);
        Funciones.FNGetTipoUsuario(oidc, { usuarioID: 0 })
            .then((respuesta: any) => {
                setTipoUsuario(respuesta.tipoUsuario);
            })
            .catch((error) => console.log("error!", error))
            .finally(() => 0/*setLoading(false)*/);
    };

    const ColumnsNotas = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Fecha', selector: 'FechaRegistro', sortable: true, center: true, cell: (props) =>
                        <span>{new Date(props.FechaRegistro).toLocaleDateString('en-US')}</span>
                },
                { name: 'Emisor', selector: 'Emisor', sortable: true, center: true },
                { name: 'Descripcion', selector: 'Descripcion', sortable: true, center: true },
                { name: 'Tipos', selector: 'TipoNotasDesc', sortable: true, center: true },
                { name: 'Distribuidora', selector: 'DistribuidorID', sortable: true, center: true },
            ]
        return colRet
    }, [])

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'ID', selector: 'AclaracionID', sortable: true, width: '10%', center: true },
                { name: 'Producto', selector: 'Producto', sortable: true, center: true },
                {
                    name: 'Fecha Registro', selector: 'FechaCaptura', sortable: true, center: true,
                    cell: row => <span>{moment(row.FechaCaptura).format('DD/MM/YYYY hh:mm:ss')}</span>
                },
                { name: 'Sucursal', selector: 'NombreSucursal', sortable: true, center: true },
                {
                    name: 'Notas', selector: 'DescripcionAclaracion', sortable: true, center: true,
                    cell: row => <span data-tip data-for={`A_${row.DescripcionAclaracion}`}>
                        {row.DescripcionAclaracion} <ReactTooltip id={`A_${row.DescripcionAclaracion}`} type="info" effect="solid">
                            {row.DescripcionAclaracion}
                        </ReactTooltip></span>
                },
                {
                    name: 'Tipo Solicitud', selector: 'DescTipoSolicitud', sortable: true, center: true,
                    cell: row => <span data-tip data-for={`A_${row.DescTipoSolicitud}`}>
                        {row.DescTipoSolicitud} <ReactTooltip id={`A_${row.DescTipoSolicitud}`} type="info" effect="solid">
                            {row.DescTipoSolicitud}
                        </ReactTooltip></span>
                },
                {
                    name: 'Estatus', selector: 'DescripcionEstatus', sortable: true, center: true,
                    cell: row => <span data-tip data-for={`A_${row.DescripcionEstatus}`}>
                        {row.DescripcionEstatus} <ReactTooltip id={`A_${row.DescripcionEstatus}`} type="info" effect="solid">
                            {row.DescripcionEstatus}
                        </ReactTooltip></span>
                },
                {
                    name: 'Mensajes',
                    selector: '',
                    sortable: false,
                    center: true,
                    width: "10%",
                    cell: (props) =>
                        <>
                            <div className='notificacion'>
                                <div data-tip data-for={`N_${props.ProspectoID}`} className="divInDTable text-center radiusSmallDiv">
                                    {props.MensajesSinLeer && <span className="badge">{props.CantidadMensajesSinLeer}</span>}
                                    <button onClick={() => {
                                        let nAclaracion = props.AclaracionID
                                        setState(s => ({
                                            ...s, MostrarMensajes: true, aclID: nAclaracion
                                        }))
                                        console.log("ESTADO DESPUES CLICK , ", state.aclID)
                                    }} className=" btn btn-outline-default buttonIconInDTable" type={"button"}>
                                        <FaFacebookMessenger color={'#3e74ba'} size={15} /></button>
                                </div>
                                <ReactTooltip id={`N_${props.ProspectoID}`} type="info" effect="solid">
                                    Notas o mensajes del prospecto {props.NombreProspecto} capturados por el analista
                                </ReactTooltip>
                            </div>
                        </>,
                    // conditionalCellStyles: activoStyle(props)
                },
            ]
        return colRet
    }, [])

    const ColumnsIncrementos = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'ID', selector: 'SolicitudID', sortable: true, width: '10%', center: true },
                { name: 'Producto', selector: 'Producto', sortable: true, center: true },
                {
                    name: 'Fecha Solicitud', selector: 'FechaSolicitud', sortable: true, center: true,
                    cell: (props) => <span>{props.FechaSolicitud ? moment(props.FechaSolicitud).format('DD/MM/YYYY') : ''}</span>
                    //cell: row => <span>{moment(row.FechaSolicitud).format('DD/MM/YYYY hh:mm:ss')}</span>
                },
                { name: 'Sucursal', selector: 'NombreSucursal', sortable: true, center: true },
                {
                    name: 'Observaciones', selector: 'Observaciones', sortable: true, center: true, width: '18%',
                    cell: row => <span className='text-center'>{row.Observaciones ? (row.Observaciones) : 'Sin Observaciones'}</span>
                },
                {
                    name: 'Incremento Solicitado', selector: 'IncrementoSolicitado', sortable: true, center: true,
                },
                {
                    name: 'Estatus', selector: 'Estatus', sortable: true, center: true,
                },
            ]
        return colRet
    }, [])

    const ColumnsSolicitudNivel = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'ID', selector: 'SolicitudAumentoNivID', sortable: false, width: '10%', center: true },
                { name: 'Usuario Solicita', selector: 'UsuarioSolicita', sortable: true, center: true },
                {
                    name: 'Fecha Solicitud', selector: 'FechaSolicitud', sortable: false, center: true,
                    cell: (props) => <span>{props.FechaSolicitud ? moment(props.FechaSolicitud).format('DD/MM/YYYY') : ''}</span>
                    //cell: row => <span>{moment(row.FechaSolicitud).format('DD/MM/YYYY hh:mm:ss')}</span>
                },
                { name: 'Estatus', selector: 'Estatus', sortable: false, center: true },
                { name: 'Usuario Responde', selector: 'UsuarioRespondio', sortable: true, center: true },
                {
                    name: 'Fecha Respuesta', selector: 'FechaRespuesta', sortable: false, center: true,
                    cell: (props) => <span>{props.FechaRespuesta ? moment(props.FechaRespuesta).format('DD/MM/YYYY') : ''}</span>
                    //cell: row => <span>{moment(row.FechaSolicitud).format('DD/MM/YYYY hh:mm:ss')}</span>
                },
                { name: 'Observaciones', selector: 'Observaciones', sortable: false, center: true },


            ]
        return colRet
    }, [])

    const ColumnsPrestamos = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Solicitud ID', selector: 'SolicitudPrestamoPersonalID', width: '10%', center: true },
                { name: 'Producto', selector: 'Producto', center: true },

                { name: 'Credito Id', selector: 'CreditoID', center: true },

                {
                    name: 'Fecha Solicitud', selector: 'FechaSolicitud', center: true,
                    cell: (props) => <span>{props.FechaSolicitud ? moment(props.FechaSolicitud).format('DD/MM/YYYY') : ''}</span>
                },
                {
                    name: 'Fecha Autorización', selector: 'FechaAutorizacion', center: true,
                    cell: (props) => <span>{props.FechaAutorizacion ? moment(props.FechaAutorizacion).format('DD/MM/YYYY') : 'N/A'}</span>
                },
                { name: 'Sucursal', selector: 'NombreSucursal', center: true, width: '150px' },
                {
                    name: 'Préstamo Solicitado', selector: 'PrestamoSolicitado', center: true,
                    cell: row => <span>{row.PrestamoSolicitado ? '$' + parseFloat(row.PrestamoSolicitado).toLocaleString() : ''}</span>
                },
                {
                    name: 'Plazos', selector: 'PlazoSolicitado', center: true, width: '5%',
                    cell: row => <span>{row.PlazoSolicitado}</span>
                },
                {
                    name: 'Observaciones', selector: 'Observaciones', center: true, width: '18%',
                    cell: row => <span className='text-center'>{row.Observaciones ? (row.Observaciones) : 'Sin Observaciones'}</span>
                },
                {
                    name: 'Fecha Autorización', selector: 'FechaAutorizacion', center: true,
                    cell: (props) => <span>{props.FechaAutorizacion ? moment(props.FechaAutorizacion).format('DD/MM/YYYY') : ''}</span>
                },
                {
                    name: 'Estatus', selector: 'Estatus', center: true, width: '15%',
                    cell: row => (
                        <span style={{ color: row.Estatus === 'ACEPTADO' ? 'green' : row.Estatus === 'CANCELADO' ? 'red' : 'inherit' }}>
                            {row.Estatus}
                        </span>
                    )
                },
                {
                    name: 'Plan de Pagos', selector: '', wrap: true, center: true,
                    cell: (props) => <button style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default mb-3" type={"button"}
                        onClick={() => {
                            setState(s => ({
                                ...s,
                                showPlanPagos: true,
                                Accion: props.Accion
                                , Form: { ...state.Form }
                            }))
                        }}>
                        <FaEye />
                    </button>

                },
            ]
        return colRet
    }, [])

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

    const ColumnsUltimasAplicaciones = React.useMemo(() => {
        let colRet: IDataTableColumn[] = [
            { name: "Id", selector: "AplicacionID", sortable: true, hide: "sm", },
            { name: "Sucursal", selector: "Sucursal", sortable: true },
            {
                name: "Socia", width: "250px", selector: "PersonaAplica", sortable: true,
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
                name: "Fecha", width: "110px", selector: "FechaAplicacion", sortable: true,
                cell: (props) => (
                    <span>
                        {moment(new Date(props.FechaAplicacion)).add(1, "days").format("DD/MM/YYYY")}
                    </span>
                ),
            },
            { name: "Pago", selector: "Pago", sortable: true, format: (row) => formatter.format(row.Pago), },
            { name: "Sistema origen", selector: "SistemaOrigen", sortable: true, },
            { name: "Pago atrasado", selector: "PagoAtrasado", sortable: true, cell: (props) => <span>{props.PagoAtrasado ? "SI" : "No"}</span>, },
        ];
        return colRet;
    }, []);

    const ColumnsHerramientas = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Herramienta Solicitada', selector: 'Accion', center: true,
                    cell: row => <span>{row.Accion === 1 ? 'Convenio Salida' : row.Accion === 2 ? 'Reest. Emergencia: ' + row.TipoReestructura : row.Accion === 3 ? 'Reest. Salida' : row.Accion === 4 ? 'Reest. Cliente F.' : 'ReConvenio'}</span>,
                    conditionalCellStyles: [
                        {
                            when: row => row.Estatus == 'A',
                            style: { backgroundColor: '#e1ffdc' },
                        },
                        {
                            when: row => row.Estatus == 'C' || row.Estatus == 'R',
                            style: { backgroundColor: '#f0c0c0' },
                        },
                    ]

                },
                // { name: 'Sucursal', selector: 'Sucursal_Nombre', center: true, width: '150px' },

                {
                    name: 'Plazos', selector: 'Quincenas', center: true, width: '7%',
                    cell: row => <span>{row.Quincenas}</span>,
                    conditionalCellStyles: [
                        {
                            when: row => row.Estatus == 'A',
                            style: { backgroundColor: '#e1ffdc' },
                        },
                        {
                            when: row => row.Estatus == 'C' || row.Estatus == 'R',
                            style: { backgroundColor: '#f0c0c0' },
                        },
                    ]
                },
                {
                    name: 'Motivo', selector: 'Motivo', center: true, width: '18%',
                    cell: row => <span className='text-center'>{row.Motivo ? (row.Motivo) : 'Sin Motivo'}</span>,
                    conditionalCellStyles: [
                        {
                            when: row => row.Estatus == 'A',
                            style: { backgroundColor: '#e1ffdc' },
                        },
                        {
                            when: row => row.Estatus == 'C' || row.Estatus == 'R',
                            style: { backgroundColor: '#f0c0c0' },
                        },
                    ]
                },
                {
                    name: 'Estatus', selector: 'Estatus', center: true, width: '15%',
                    cell: row =>
                        <span style={{ color: row.Estatus === 'A' ? 'green' : row.Estatus === 'C' || row.Estatus === 'R' ? 'red' : 'inherit' }}>
                            {row.Descripcion}
                        </span>,
                    conditionalCellStyles: [
                        {
                            when: row => row.Estatus == 'A',
                            style: { backgroundColor: '#e1ffdc' },
                        },
                        {
                            when: row => row.Estatus == 'C' || row.Estatus == 'R',
                            style: { backgroundColor: '#f0c0c0' },
                        },
                    ]

                },
                {
                    name: 'Fecha Solicitud', selector: 'FechaRegistro', center: true,
                    cell: (props) => <span>{props.FechaRegistro ? moment(props.FechaRegistro).format('DD/MM/YYYY') : ''}</span>,
                    conditionalCellStyles: [
                        {
                            when: row => row.Estatus == 'A',
                            style: { backgroundColor: '#e1ffdc' },
                        },
                        {
                            when: row => row.Estatus == 'C' || row.Estatus == 'R',
                            style: { backgroundColor: '#f0c0c0' },
                        },
                    ]
                },
                {
                    name: 'Fecha Autorización', selector: 'FechaAutorizacion', center: true,
                    cell: (props) => <span>{props.FechaAutorizacion ? moment(props.FechaAutorizacion).format('DD/MM/YYYY') : 'N/A'}</span>,
                    conditionalCellStyles: [
                        {
                            when: row => row.Estatus == 'A',
                            style: { backgroundColor: '#e1ffdc' },
                        },
                        {
                            when: row => row.Estatus == 'C' || row.Estatus == 'R',
                            style: { backgroundColor: '#f0c0c0' },
                        },
                    ]
                },
                {
                    name: 'Plan de Pagos', selector: '', wrap: true, center: true,
                    cell: (props) => <button disabled={props.Estatus === 'A' || props.Estatus === 'R'} style={{ padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default mb-3" type={"button"}
                        onClick={() => {
                            setState(s => ({
                                ...s,
                                MostrarPlazos: true

                            }))
                            planPagos(props.Accion, props.PlazoID, props.QuitaID, props.SaldoActual, props.MontoIntencion)
                        }}>
                        <FaEye style={{ height: '60px' }} />
                    </button>,
                    conditionalCellStyles: [
                        {
                            when: row => row.Estatus == 'A',
                            style: { backgroundColor: '#e1ffdc' },
                        },
                        {
                            when: row => row.Estatus == 'C' || row.Estatus == 'R',
                            style: { backgroundColor: '#f0c0c0' },
                        },
                    ]

                },
                {
                    name: 'Acciones', selector: '', wrap: true, center: true,
                    cell: (props: any) =>
                        <div>
                            {/* ['A', 'C', 'R'].includes(props.Estatus) */}
                            <button disabled={['V', 'R', 'A', 'C', 'X'].includes(props.Estatus) || tipoUsuario > 3} data-tip data-for={`ValidarTooltip${props.SolicitudRCID}`} style={{ padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse', color: 'green', }} className="btn btn-outline-default mb-3" type={"button"}
                                onClick={() => {
                                    setState(s => ({
                                        ...s,

                                    }))
                                    fnValidar(props.SolicitudRCID)
                                }}>
                                <FaClipboardCheck style={{ height: '60px' }} />
                            </button>
                            <ReactTooltip id={`ValidarTooltip${props.SolicitudRCID}`}
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                Validar
                            </ReactTooltip>
                            {'\u00A0'}
                            <button disabled={props.Estatus != 'P' || tipoUsuario > 3} data-tip data-for={`RechazarTooltip${props.SolicitudRCID}`} style={{ padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse', color: 'red', }} className="btn btn-outline-default mb-3" type={"button"}
                                onClick={() => {
                                    setState(s => ({
                                        ...s,

                                    }))
                                    fnRechazar(props.SolicitudRCID)
                                }}>
                                <FaBan style={{ height: '60px' }} />
                            </button>
                            <ReactTooltip id={`RechazarTooltip${props.SolicitudRCID}`}
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                Rechazar
                            </ReactTooltip>
                            {'\u00A0'}
                            <button disabled={props.Estatus != 'C' || tipoUsuario > 3} data-tip data-for={`ReValidarTooltip${props.SolicitudRCID}`} style={{ padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse', color: '#de5400', }} className="btn btn-outline-default mb-3" type={"button"}
                                onClick={() => {
                                    setState(s => ({
                                        ...s,

                                    }))
                                    fnReValidar(props.SolicitudRCID)
                                }}>
                                <FaCheckDouble style={{ height: '60px' }} />
                            </button>
                            <ReactTooltip id={`ReValidarTooltip${props.SolicitudRCID}`}
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                Re-Validar
                            </ReactTooltip>
                            {'\u00A0'}
                            <button disabled={props.Estatus === 'A' || props.Estatus === 'C' || props.Estatus === 'R'} data-tip data-for={`Docs1Tooltip${props.SolicitudRCID}`} style={{ padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse', color: 'black', }} className="btn btn-outline-default mb-3" type={"button"}
                                onClick={() => {
                                    AbrirDocumentos(props)
                                }}>
                                <FaPen style={{ height: '60px' }} />
                            </button>
                            <ReactTooltip id={`Docs1Tooltip${props.SolicitudRCID}`}
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                Modificar Documentos
                            </ReactTooltip>
                            {'\u00A0'}
                            <button disabled={props.Estatus != 'A' || props.Accion != 1} data-tip data-for={`ImprimirTooltip${props.SolicitudRCID}`} style={{ padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse', color: 'black', }} className="btn btn-outline-default mb-3" type={"button"}
                                onClick={() => {
                                    setState(s => ({
                                        ...s,

                                    }))
                                    fnImprimir(props.SolicitudRCID)
                                }}>
                                <FaPrint style={{ height: '60px' }} />
                            </button>
                            <ReactTooltip id={`ImprimirTooltip${props.SolicitudRCID}`}
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                Imprimir Responsiva
                            </ReactTooltip>
                        </div>,
                    conditionalCellStyles: [
                        {
                            when: row => row.Estatus == 'A',
                            style: { backgroundColor: '#e1ffdc' },
                        },
                        {
                            when: row => row.Estatus == 'C' || row.Estatus == 'R',
                            style: { backgroundColor: '#f0c0c0' },
                        },
                    ]
                },
            ]
        return colRet
    }, [])


    const ColumnsSimularPlazos = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'No. Pago',
                    selector: 'NoPago',
                    sortable: true,
                    center: true,
                    cell: (row: any) => <span className="text-center">{row.NoPago}</span>
                },
                {
                    name: 'Fecha Vencimiento',
                    selector: 'FechaVencimiento',
                    sortable: true,
                    cell: (row: any) => <span className="text-center">{moment(row.FechaVencimiento).utc().format("DD/MM/YYYY")}</span>
                },
                {
                    name: 'Importe',
                    selector: 'Importe',
                    sortable: true,
                    cell: (props) => <span className="text-center">{FormateoDinero.format(props.Importe)}</span>

                }
            ]
        return colRet
    }, []);


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /** funcion para cancelar la forma */
    if (Estado.Cargando)
        return (
            <div className="text-center">
                <Spinner />
                <br />
                <span>Obteniendo detalle de persona</span>
            </div>
        )
    else if (!Estado.Cargando && Estado.Error)
        return (
            <div className="text-center">
                <span>Error al cargar el perfil de proveedor</span>
                <br />
                <button onClick={ConsultarDatos} className="btn btn-sm btn-link"><FiRefreshCcw /> </button>
            </div>
        )



    // Renderamos nuestro componente
    else if (Estado.DatosBancarios !== undefined)
        return (
            <div className="row text-center">
                <div className="col-md-6 mt-2">
                    <Acordion TabSelecionado=''>

                        <Acordion.Tab Titulo={<span><FcFolder size={20} /> DOCUMENTOS  ({Estado.Docs.length}) </span>} Identificador="aval">
                            <div className="text-start" style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%' }}>
                                    {Estado.Docs !== undefined && (Estado.Docs as any[]).map((a, aId) =>
                                        <tbody key={'docs_' + aId}>
                                            <tr style={{ padding: '50px' }}>
                                                <td style={{ display: '', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 'bold' }}>
                                                    <p className='m-0'>{a.NombreDocumento}</p>
                                                    <p className='mt-1 mb-3' style={{ fontSize: '.7em', textAlign: 'start', fontWeight: 'bold', fontStyle: 'italic' }}>
                                                        {a.NombrePersona}
                                                    </p>
                                                </td>
                                                {/* <td style={{ fontSize: '.7em', textAlign: 'start', fontWeight: 'bold', fontStyle: 'italic' }}>
                                                    {a.NombrePersona}
                                                </td> */}
                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingTop: '0px', paddingBottom: '0px' }}>{a.NomDoc}</td>                                                                                                <td>
                                                    <button type="button" className="btn btn-link" onClick={() => { fnVerDoc(a.PersonasDocID, a.NombreDocumento) }}>VER</button>
                                                </td>
                                            </tr>

                                            {/* <tr>
                                                <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 'bold' }}>
                                                    {a.NombreDocumento}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ fontSize: '.7em', textAlign: 'start', fontWeight: 'bold', fontStyle: 'italic' }}>

                                                    {a.NombrePersona}
                                             
                                                    </td>
                                            </tr> */}
                                        </tbody>
                                    )}
                                </table>
                            </div>
                        </Acordion.Tab>
                    </Acordion>
                </div>
                <div className="col-md-6 mt-2">
                    <Acordion TabSelecionado=''>
                        <Acordion.Tab Titulo={<span><FcDepartment size={20} /> DATOS BANCARIOS ({state.datosBancarios?.length}) </span>} Identificador="aval">
                            <div>
                                {/* {console.log(ui.PermisosGenerales?.find(p => p.PermisoID == 104) )} */}
                                {iUI.PermisosProductos?.find(p => p.PermisoID == 104) &&
                                    <div style={{ position: 'absolute', right: '15px', zIndex: 10, cursor: 'pointer' }} title={''} onClick={() => setState({ ...state, FormDatosBancarios: { Mostrar: true, datosBancarios: DatosDefecto, Id: undefined } })}>
                                        <FcPlus size={25} />
                                    </div>
                                }
                                <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                    <thead>
                                        <tr>
                                            <th className="text-start" style={{ width: '30%' }}>Tipo</th>
                                            <th className="text-start" style={{ width: '30%' }}>Banco</th>
                                            <th className="text-start">Dato</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {state.datosBancarios !== undefined && (state.datosBancarios as any[]).map((a, aId) =>
                                            <tr key={'banco_' + aId}>
                                                <td className="text-start">{a.datoTipoDesc}</td>
                                                <td className="text-start">{a.BancoNombre}</td>
                                                <td className="text-start">{a.datoBancario}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Acordion.Tab>
                    </Acordion>
                </div>
                <div className="col-md-6 mt-2">
                    <Acordion TabSelecionado=''>
                        <Acordion.Tab Titulo={<span><FcInspection size={20} /> CONSULTA BURO ({state.datosBuro?.length}) </span>} Identificador="buro">
                            {/* {ui.Permisos.filter(p => p.PermisoID == 73) &&  */}
                            <div>
                                <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                    <thead>
                                        <tr>
                                            <th className="text-start" style={{ width: '10%', }}></th>
                                            <th className="text-center" style={{ width: '45%', }}>Resultado</th>
                                            <th className="text-right" style={{ width: '45%', }} >Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {state.datosBuro !== undefined && (state.datosBuro as any[]).map((a, aId) =>
                                            <tr key={'dis_' + aId}>
                                                {a.ResultCode === 0 && <td className="text-start"><FcCheckmark size={20} /></td>}
                                                {a.ResultCode === 1 && <td className="text-start"><FcCancel size={20} /></td>}
                                                <td className="text-start">{a.ResultDesc}</td>
                                                <td className="text-right">{moment(a.FechaConsulta).format('DD-MM-YYYY')}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Acordion.Tab>
                    </Acordion>
                </div>

                <div className=" col-md-12 col-lg-12 mt-5">
                    <Acordion TabSelecionado=''>
                        <Acordion.Tab Titulo={<span> <FcFinePrint size={20} /> NOTAS R&Aacute;PIDAS </span>} Identificador="aval">
                            <div>
                                <DataTable
                                    subHeader
                                    subHeaderComponent={
                                        <div>
                                            <ModalWin zIndex={100000} open={state.FormNotasRapida.Mostrar} center large>
                                                <ModalWin.Header>
                                                    <h5 className={MODAL_TITLE_CLASS}>Crear nota r&aacute;pida</h5>
                                                    <button type="button" className="delete" onClick={() =>
                                                        fnMostrarFormNotasRapidas(false)
                                                    } />
                                                </ModalWin.Header>
                                                <ModalWin.Body>
                                                    <CFormNotasRapidas
                                                        oidc={oidc}
                                                        DistribuidorID={personaID}
                                                        fnCerrarForm={() => {
                                                            fnMostrarFormNotasRapidas(false)
                                                            FNGetNotasRapidas()
                                                        }}
                                                    />
                                                </ModalWin.Body>
                                            </ModalWin>
                                            <button
                                                className="ms-2 btn btn-success waves-effect waves-light"
                                                type="button"
                                                onClick={() => fnMostrarFormNotasRapidas(true)}
                                            >
                                                <FaPlusCircle size={20} /> Agregar notas r&aacute;pidas
                                            </button>
                                        </div>
                                    }
                                    striped
                                    pagination
                                    dense
                                    noHeader
                                    responsive
                                    columns={ColumnsNotas}
                                    data={state.FormNotasRapida.datosNotasRapida}
                                />
                            </div>
                        </Acordion.Tab>
                    </Acordion>
                </div>

                {/* {Inicio ultimas aplicaciones} */}
                {state.ultimasAplicaciones && <div className="col-md-12 col-lg-12 mt-2">
                    <Acordion TabSelecionado=''>
                        <Acordion.Tab Titulo={<span><FcMoneyTransfer size={20} /> ULTIMAS APLICACIONES SOCIA </span>} Identificador="aval">
                            <div>
                                <DataTable
                                    subHeader
                                    striped
                                    pagination
                                    dense
                                    noHeader
                                    responsive
                                    keyField={"AplicacionID"}
                                    defaultSortField={"AplicacionID"}
                                    columns={ColumnsUltimasAplicaciones}
                                    data={state.datosUltimasAplicaciones} />
                            </div>

                        </Acordion.Tab>

                    </Acordion>
                </div>}

                {state.aclaracion &&
                    <div className=" col-md-12 col-lg-12 mt-2">
                        <CFormMensajes
                            oidc={oidc}
                            AclaracionID={state.aclID}
                            Item={1}
                            TipoMesa={1}
                            cbActualizar={cbActualizarMensajesSinLeer}
                            fnCancelar={fnCancelarMostrarMensajes}
                            mostrar={state.MostrarMensajes}
                            EnviadoDesde={true}
                        />
                        <Acordion TabSelecionado=''>
                            <Acordion.Tab Titulo={<span><FcAnswers size={20} /> ACLARACIONES ({state.datosAclaraciones?.length}) </span>} Identificador="aval">
                                <div>
                                    {iUI.PermisosGenerales?.find(p => p.PermisoID == 827) &&
                                        <div style={{ position: 'absolute', right: '15px', zIndex: 10, cursor: 'pointer' }} title={''} onClick={() => setState({ ...state, FormAclaraciones: { Mostrar: true, datosAclaraciones: DatosAclaracion, Id: undefined } })}>
                                            <FcPlus size={25} />
                                        </div>
                                    }
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div>
                                                {state.MostrarDoc && <ModalWin open={state.MostrarDoc} center large>
                                                    <ModalWin.Header>
                                                        <h5 className={MODAL_TITLE_CLASS}>Cargar evidencias</h5>
                                                        <button type="button" className="delete" onClick={() => {
                                                            fnCerrarDocAclaracion()
                                                        }} />
                                                    </ModalWin.Header>
                                                    <ModalWin.Body>
                                                        <CFormCargarDocumentoAclaracion
                                                            AclaracionID={state.aclaracionGuardadaID}
                                                            oidc={oidc}
                                                            initialValues={{ file: "" }}
                                                            fnCancelarMostrarCargaDeDocumento={fnCerrarDocAclaracion}
                                                            fnMostrarSubirEvidencia={fnMostrarSubirEvidencia}
                                                        />
                                                    </ModalWin.Body>
                                                </ModalWin>}

                                                <ModalWin zIndex={100} open={state.FormAclaraciones.Mostrar} center={true}>
                                                    <ModalWin.Header>
                                                        <h5 className={MODAL_TITLE_CLASS}>
                                                            Levantar Aclaración
                                                        </h5>
                                                    </ModalWin.Header>
                                                    <ModalWin.Body>
                                                        {<CFormAclaracion
                                                            fnDeshabilitarCargaDeEvidecia={fnDeshabilitarCargaDeEvidecia}
                                                            fnAclaracionNoGuardada={fnAclaracionNoGuardada}
                                                            fnAclaracionGuardada={fnAclaracionGuardada}
                                                            fnHabilitarCargaDeEvidecia={fnHabilitarCargaDeEvidecia}
                                                            solicitudGuardada={state.solicitudGuardada}
                                                            permitirEvidecia={state.permitirEvidencia}
                                                            fnMostrarCargaDeDocumento={fnMostrarDocAclaracion}
                                                            oidc={oidc}
                                                            ui={iUI}
                                                            DistribuidoraID={personaID}
                                                            fnGetDistribuidores={fnGetDistribuidores}
                                                            fnGetCondicionesDetalle={fnGetCondicionesDetalle}
                                                            initialValues={state.FormAclaraciones.datosAclaraciones}
                                                            Id={state.FormAclaraciones.Id}
                                                            cbGuardar={cbAgregar}
                                                            fnCancelar={() => setState(s => ({ ...s, FormAclaraciones: { Mostrar: false, datosAclaraciones: DatosAclaracion, Id: undefined } }))}
                                                            cbActualizar={cbActualizar}
                                                            fnGetClientes={FnGetPersona}
                                                            fnGetSucursales={FnGetSucursal}
                                                            optMesaAclaracion={state.TipoMesaAclaracion}
                                                            optBonificacion={state.TipoBonificacion}
                                                            optEstatus={state.TipoEstatus}
                                                            optTiposSolicitud={state.TiposSolicitudAclaracion}
                                                            optProductosPrincipales={state.TipoProductos}
                                                            optSucursales={state.optSucursales}
                                                            

                                                        />
                                                        }
                                                    </ModalWin.Body>
                                                </ModalWin>

                                                <button className="ms-2 btn btn-success waves-effect waves-light" type="button" onClick={() => {
                                                    const arraySucursal = state.TipoProductos;
                                                    console.log (arraySucursal);

                                                    state.FormAclaraciones.datosAclaraciones
                                                    setState({
                                                        ...state, FormAclaraciones: {
                                                            ...state.FormAclaraciones,
                                                            Mostrar: true,
                                                            datosAclaraciones: {
                                                                AclaracionID: 0,
                                                                SucursalID: 0,
                                                                DistribuidorID: 0,
                                                                CreditoID: 0,
                                                                DescripcionAclaracion: '',
                                                                EstatusID: 0,
                                                                NotasTesoreria: '',
                                                                Observaciones: '',
                                                                DocumentoID: 0,
                                                                MesaAclaracionID: 0,
                                                                BonificacionID: 0,
                                                                CoordinadorID: 0,
                                                                SolicitaID: 0,
                                                                AutorizaID: 0,
                                                                TipoSolicitudID: 0,
                                                                ConceptoID: 0,
                                                                ProductoID: 0,
                                                            }, Id: undefined
                                                        }
                                                    })
                                                }}
                                                >

                                                    <FaPlusCircle size={20} /> Levantar Aclaración </button>

                                            </div>


                                        }
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"AclaracionID"}
                                        defaultSortField={"AclaracionID"}
                                        columns={Columns}
                                        data={state.datosAclaraciones} />
                                </div>
                            </Acordion.Tab>
                        </Acordion>
                    </div>
                }
                {/**INCREMENTOS */}
                {state.incremento &&
                    <div className=" col-md-12 col-lg-12 mt-2">
                        <Acordion TabSelecionado=''>
                            <Acordion.Tab Titulo={<span><MdAttachMoney size={20} /> SOLICITUDES DE INCREMENTOS ({state.datosIncrementos?.length}) </span>} Identificador="aval">
                                <div>
                                    {iUI.PermisosGenerales?.find(p => p.PermisoID == 827) &&
                                        <div style={{ position: 'absolute', right: '15px', zIndex: 10, cursor: 'pointer' }} title={''} onClick={() => setState({ ...state, FormIncrementos: { Mostrar: true, datosIncrementos: DatosIncrementos, Id: undefined } })}>
                                            <FcPlus size={25} />
                                        </div>
                                    }
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div>
                                                <ModalWin zIndex={100000} open={state.FormIncrementos.Mostrar} center={true}>
                                                    <ModalWin.Header>
                                                        <h5 className={MODAL_TITLE_CLASS}>
                                                            SOLICITAR INCREMENTO
                                                        </h5>
                                                    </ModalWin.Header>
                                                    <ModalWin.Body>
                                                        <CFormSolicitudIncrementos
                                                            fnIncrementoNoGuardada={fnIncrementoNoGuardada}
                                                            fnIncrementoGuardada={fnIncrementoGuardada}
                                                            solicitudGuardada={state.solicitudIncrementoGuardada}
                                                            oidc={oidc}
                                                            ui={iUI}
                                                            DistribuidoraID={personaID}
                                                            fnGetDistribuidores={fnGetDistribuidores}
                                                            fnGetCondicionesDetalle={fnGetCondicionesDetalle}
                                                            initialValues={state.FormIncrementos.datosIncrementos}
                                                            Id={state.FormIncrementos.Id}
                                                            cbGuardar={cbAgregarIncremento}
                                                            fnCancelar={() => setState(s => ({ ...s, FormIncrementos: { Mostrar: false, datosIncrementos: DatosIncrementos, Id: undefined } }))}
                                                            cbActualizar={cbActualizar}
                                                            optProductosPrincipales={state.TipoProductosIncrementos}

                                                        />
                                                    </ModalWin.Body>
                                                </ModalWin>

                                                <button className="ms-2 btn btn-success waves-effect waves-light" type="button" onClick={() => {
                                                    state.FormIncrementos.datosIncrementos
                                                    setState({
                                                        ...state, FormIncrementos: {
                                                            ...state.FormIncrementos,
                                                            Mostrar: true,
                                                            datosIncrementos: {
                                                                SolicitudID: 0,
                                                                ProductoID: 0,
                                                                SucursalID: 0,
                                                                DistribuidorID: 0,
                                                                ContratoID: 0,
                                                                IncrementoSolicitado: 0,
                                                                EstatusID: 0,
                                                                UsuarioSolicitoID: 0,
                                                                Observaciones: '',
                                                            }, Id: undefined
                                                        }
                                                    })
                                                }}
                                                >

                                                    <FaPlusCircle size={20} /> Solicitar Incremento </button>

                                            </div>


                                        }
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"SolicitudID"}
                                        defaultSortField={"SolicitudID"}
                                        columns={ColumnsIncrementos}
                                        data={state.datosIncrementos} />
                                </div>

                            </Acordion.Tab>

                        </Acordion>
                    </div>
                }
                {state.incremento &&
                    <div className=" col-md-12 col-lg-12 mt-2">
                        <Acordion TabSelecionado=''>
                            <Acordion.Tab Titulo={<span><MdEqualizer size={20} /> SOLICITUDES DE AUMENTO DE NIVEL ({state.datosSolicitudNivel?.length}) </span>} Identificador="aval">
                                <div>
                                    {iUI.PermisosGenerales?.find(p => p.PermisoID == 827) &&
                                        <div style={{ position: 'absolute', right: '15px', zIndex: 10, cursor: 'pointer' }} title={''} onClick={() => setState({ ...state, FormAumentoNiv: { Mostrar: true, datosSolicitudNivel: DatosSolicitudNivel, Id: undefined } })}>
                                            <FcPlus size={25} />
                                        </div>
                                    }
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div>
                                                <ModalWin zIndex={100} open={state.FormAumentoNiv.Mostrar} center={true}>
                                                    <ModalWin.Header>
                                                        <h5 className={MODAL_TITLE_CLASS}>
                                                            SOLICITAR AUMENTO DE NIVEL DE LA SOCIA
                                                        </h5>
                                                    </ModalWin.Header>
                                                    <ModalWin.Body>
                                                        <CFormSolicitudAumentoNivel
                                                            fnIncrementoNoGuardada={fnIncrementoNoGuardada}
                                                            fnIncrementoGuardada={fnIncrementoGuardada}
                                                            solicitudGuardada={state.solicitudIncrementoGuardada}
                                                            oidc={oidc}
                                                            ui={iUI}
                                                            DistribuidoraID={personaID}
                                                            fnGetDistribuidores={fnGetDistribuidores}
                                                            fnGetCondicionesDetalle={fnGetCondicionesDetalle}
                                                            initialValues={state.FormAumentoNiv.datosSolicitudNivel}
                                                            Id={state.FormAumentoNiv.Id}
                                                            cbGuardar={cbAgregarIncremento}
                                                            fnCancelar={() => setState(s => ({ ...s, FormAumentoNiv: { Mostrar: false, datosSolicitudNivel: DatosSolicitudNivel, Id: undefined } }))}
                                                            cbActualizar={cbActualizar}
                                                            optProductosPrincipales={state.TipoProductosIncrementos}
                                                            FnObtenerAumentoNivelporID={FnObtenerAumentoNivelporID}

                                                        />
                                                    </ModalWin.Body>
                                                </ModalWin>

                                                <button className="ms-2 btn btn-success waves-effect waves-light" type="button" onClick={() => {
                                                    state.FormAumentoNiv.datosSolicitudNivel
                                                    setState({
                                                        ...state, FormAumentoNiv: {
                                                            ...state.FormAumentoNiv,
                                                            Mostrar: true,
                                                            datosSolicitudNivel: {
                                                                SolicitudID: 0,
                                                                ProductoID: 0,
                                                                SucursalID: 0,
                                                                DistribuidorID: 0,
                                                                ContratoID: 0,
                                                                IncrementoSolicitado: 0,
                                                                EstatusID: 0,
                                                                UsuarioSolicitoID: 0,
                                                                Observaciones: '',
                                                            }, Id: undefined
                                                        }
                                                    })
                                                }}
                                                >

                                                    <FaPlusCircle size={20} /> Solicitar Aumento Nivel </button>

                                            </div>


                                        }
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"SolicitudID"}
                                        defaultSortField={"SolicitudID"}
                                        columns={ColumnsSolicitudNivel}
                                        data={state.datosSolicitudNivel} />
                                </div>

                            </Acordion.Tab>

                        </Acordion>
                    </div>
                }
                {/* {Inicio Prestamos Personales} */}
                {state.prestamo &&
                    <div className="col-md-12 col-lg-12 mt-2">
                        <Acordion TabSelecionado=''>
                            <Acordion.Tab Titulo={<span><FcMoneyTransfer size={20} /> SOLICITUDES DE PRÉSTAMOS PERSONALES ({state.datosPrestamos?.length}) </span>} Identificador="aval">
                                <div>
                                    {iUI.PermisosGenerales?.find(p => p.PermisoID == 827) &&
                                        <div style={{ position: 'absolute', right: '15px', zIndex: 10, cursor: 'pointer' }} title={''} onClick={() => setState({ ...state, FormPrestamos: { Mostrar: true, datosPrestamos: DatosPrestamos, Id: undefined } })}>
                                            <FcPlus size={25} />
                                        </div>
                                    }
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div>
                                                {state.MostrarDocPrestamo && <ModalWin zIndex={100000} open={state.MostrarDocPrestamo} center large>
                                                    <ModalWin.Header>
                                                        <h5 className={MODAL_TITLE_CLASS}>Cargar evidencias</h5>
                                                        <button type="button" className="delete" onClick={() => {
                                                            fnCerrarDocPrestamo()
                                                        }} />
                                                    </ModalWin.Header>
                                                    <ModalWin.Body>
                                                        <CFormCargaDocumentoPrestamo
                                                            SolicitudPrestamoPersonalID={state.solicitudPrestamoGuardadaID}
                                                            oidc={oidc}
                                                            initialValues={{ file: "" }}
                                                            fnCancelarMostrarCargaDeDocumentoPrestamo={fnCerrarDocPrestamo}
                                                            fnMostrarSubirEvidenciaPrestamo={fnMostrarSubirEvidenciaPrestamo}
                                                        />
                                                    </ModalWin.Body>
                                                </ModalWin>}
                                                {/* MODAL SOLICITAR PRESTAMO PERSONAL */}
                                                {state.FormPrestamos.Mostrar &&
                                                    <ModalWin zIndex={10000} open={state.FormPrestamos.Mostrar} center={true}>
                                                        <ModalWin.Header>
                                                            <h5 className={MODAL_TITLE_CLASS}>
                                                                SOLICITAR PRÉSTAMO PERSONAL
                                                            </h5>
                                                        </ModalWin.Header>
                                                        <ModalWin.Body>
                                                            {<CFormSolicitudPrestamosPersonales
                                                                fnHabilitarCargaDeEvideciaPrestamo={fnHabilitarCargaDeEvideciaPrestamo}
                                                                fnHabilitarCargaDeDatosBancarios={fnHabilitarCargaDeDatosBancarios}
                                                                fnDeshabilitarCargaDeEvideciaPrestamo={fnDeshabilitarCargaDeEvideciaPrestamo}
                                                                permitirEvideciaPrestamo={state.permitirEvidenciaPrestamo}
                                                                fnPrestamoNoGuardada={fnPrestamoNoGuardada}
                                                                fnPrestamoGuardada={fnPrestamoGuardada}
                                                                solicitudPrestamoGuardada={state.solicitudPrestamoGuardada}
                                                                fnMostrarCargaDeDocumentoPrestamo={fnMostrarDocPrestamo}
                                                                oidc={oidc}
                                                                ui={iUI}
                                                                DistribuidoraID={personaID}
                                                                EmpresaID={iUI.Producto?.EmpresaId}
                                                                fnGetDistribuidores={fnGetDistribuidores}
                                                                fnGetCondicionesDetalle={fnGetCondicionesDetalle}
                                                                initialValues={state.FormPrestamos.datosPrestamos}
                                                                Id={state.FormPrestamos.Id}
                                                                cbGuardar={cbAgregarPrestamo}
                                                                fnCancelar={() => setState(s => ({ ...s, FormPrestamos: { Mostrar: false, datosPrestamos: DatosPrestamos, Id: undefined } }))}
                                                                cbActualizar={cbActualizar}
                                                                optProductosPrincipales={state.TipoProductosIncrementos}
                                                                SucursalID={0}
                                                                lectorHuella={lectorHuella} //pepe
                                                                curp={curp}
                                                                TipoDesembolso={0}
                                                                Listo={state.Listo}
                                                                fnToggleListo={fnToggleListo}
                                                            />}

                                                        </ModalWin.Body>
                                                    </ModalWin>
                                                }
                                                <button className="ms-2 btn btn-success waves-effect waves-light" type="button" onClick={() => {
                                                    state.FormPrestamos.datosPrestamos
                                                    setState({
                                                        ...state, FormPrestamos: {
                                                            ...state.FormPrestamos,
                                                            Mostrar: true,
                                                            datosPrestamos: {
                                                                SolicitudPrestamoPersonalID: 0,
                                                                ProductoID: 0,
                                                                SucursalID: 0,
                                                                DistribuidorID: 0,
                                                                EmpresaID: 0,
                                                                ContratoID: 0,
                                                                PrestamoSolicitado: 0,
                                                                EstatusID: 0,
                                                                UsuarioSolicitoID: 0,
                                                                Observaciones: '',
                                                                PlazoSolicitado: 0,
                                                                TipoDesembolso: 0
                                                            }, Id: undefined
                                                        }
                                                    })
                                                }}
                                                >
                                                    <FaPlusCircle size={20} /> Solicitar Préstamo Personal  </button>

                                            </div>


                                        }
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"SolicitudPrestamoPersonalID"}
                                        defaultSortField={"SolicitudPrestamoPersonalID"}
                                        columns={ColumnsPrestamos}
                                        data={state.datosPrestamos} />
                                </div>

                            </Acordion.Tab>

                        </Acordion>
                    </div>
                }

                {/* {Fin Prestamos Personales} */}
                {/* {Solicitudes convenios y reestructuras} */}
                {state.herramientas &&
                    <div className="col-md-12 col-lg-12 mt-2">
                        <Acordion TabSelecionado=''>
                            <Acordion.Tab Titulo={<span><FaFileInvoiceDollar size={20} /> SOLICITUDES DE CONVENIOS Y REESTRUCTURAS ({state.datosHerramientas?.length}) </span>} Identificador="convenios">
                                <div>
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div>
                                                {iUI.PermisosGenerales?.find(p => p.PermisoID == 827) &&
                                                    <div style={{ position: 'absolute', right: '15px', zIndex: 10, cursor: 'pointer' }} title={''} onClick={() => setState({ ...state, FormHerramientas: { Mostrar: true, datosHerramientas: DatosHerramientas, Id: undefined } })}>
                                                        <FcPlus size={25} />
                                                    </div>
                                                }
                                            </div>


                                        }
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"SolicitudRCID"}
                                        defaultSortField={"SolicitudRCID"}
                                        columns={ColumnsHerramientas}
                                        data={state.datosHerramientas} />
                                </div>

                            </Acordion.Tab>

                        </Acordion>
                    </div>
                }
                {
                    state.FormAgregarEvidencia.CargarDocumento && <ModalWin open={state.FormAgregarEvidencia.CargarDocumento} center large>
                        <ModalWin.Header>
                            <h5 className={MODAL_TITLE_CLASS}>Agregar Evidencia</h5>
                            <button type="button" className="delete" onClick={() => {
                                fnCancelarMostrarCargaDeDocumento()
                            }} />
                        </ModalWin.Header>
                        <ModalWin.Body>
                            <CFormAgregarEvidencia
                                oidc={oidc}
                                DocumentoID={state.FormAgregarEvidencia.DocumentoID === null ? 0 : state.FormAgregarEvidencia.DocumentoID}
                                AclaracionID={state.aclaracionGuardadaID}
                                initialValues={{ file: "" }}
                                fnCancelarMostrarCargaDeDocumento={fnCancelarMostrarCargaDeDocumento}
                                FNGetLocal={FNGetLocal}
                            />
                        </ModalWin.Body>
                    </ModalWin>
                }
                {
                    state.FormAgregarEvidencia.VerEvi && <ModalWin open={state.FormAgregarEvidencia.VerEvi} center large>
                        <ModalWin.Header>
                            <h5 className={MODAL_TITLE_CLASS}>Visor de Archivos</h5>
                            <button type="button" className="delete" onClick={() => {
                                fnCancelarVerEvidencia()
                            }} />
                        </ModalWin.Header>
                        <ModalWin.Body>
                            <CFormVerEvidencia
                                oidc={oidc}
                                AclaracionID={state.FormAgregarEvidencia.AclaracionID}
                                DocumentoID={state.FormAgregarEvidencia.DocumentoID === null ? 0 : state.FormAgregarEvidencia.DocumentoID}
                                fnCancelarVerEvidencia={fnCancelarVerEvidencia}
                            />
                        </ModalWin.Body>
                    </ModalWin>
                }

                {
                    state.FormAgregarEvidenciaPrestamo.CargarDocumentoPrestamo && <ModalWin open={state.FormAgregarEvidenciaPrestamo.CargarDocumentoPrestamo} center large>
                        <ModalWin.Header>
                            <h5 className={MODAL_TITLE_CLASS}>Agregar Evidencia</h5>
                            <button type="button" className="delete" onClick={() => {
                                fnCancelarMostrarCargaDeDocumentoPrestamo()
                            }} />
                        </ModalWin.Header>
                        <ModalWin.Body>
                            <CFormAgregarEvidenciaPrestamo
                                oidc={oidc}
                                DocumentoID={state.FormAgregarEvidenciaPrestamo.DocumentoID === null ? 0 : state.FormAgregarEvidenciaPrestamo.DocumentoID}
                                SolicitudPrestamoPersonalID={state.solicitudPrestamoGuardadaID}
                                initialValues={{ file: "" }}
                                fnCancelarMostrarCargaDeDocumentoPrestamo={fnCancelarMostrarCargaDeDocumentoPrestamo}
                                FNGetLocal={FNGetLocal}
                            />
                        </ModalWin.Body>
                    </ModalWin>
                }
                {state.permitirDatosBancarios &&
                    <ModalWin open={state.permitirDatosBancarios} zIndex={500000} >
                        <ModalWin.Header>
                            <h5 className={MODAL_TITLE_CLASS}>
                                Datos Bancarios del Cliente
                            </h5>
                            <button title='Cerrar' type="button" className="delete" onClick={() => setState(s => ({ ...s, permitirDatosBancarios: false }))} />
                        </ModalWin.Header>
                        <ModalWin.Body>
                            {state.permitirDatosBancarios &&
                                <PersonasDatosBancariosPP
                                    PersonaID={personaID}
                                    cbGuardar={cbDatosBancarios}
                                    Listo={Listo}
                                    fnToggleListo={fnToggleListo}
                                />
                            }
                        </ModalWin.Body>
                    </ModalWin>
                }
                {
                    state.FormAgregarEvidenciaPrestamo.VerEviPrestamo && <ModalWin open={state.FormAgregarEvidenciaPrestamo.VerEviPrestamo} center large>
                        <ModalWin.Header>
                            <h5 className={MODAL_TITLE_CLASS}>Visor de Archivos</h5>
                            <button type="button" className="delete" onClick={() => {
                                fnCancelarVerEvidenciaPrestamo()
                            }} />
                        </ModalWin.Header>
                        <ModalWin.Body>
                            <CFormVerEvidenciaPrestamo
                                oidc={oidc}
                                SolicitudPrestamoPersonalID={state.FormAgregarEvidenciaPrestamo.SolicitudPrestamoPersonalID}
                                DocumentoID={state.FormAgregarEvidencia.DocumentoID === null ? 0 : state.FormAgregarEvidenciaPrestamo.DocumentoID}
                                fnCancelarVerEvidenciaPrestamo={fnCancelarVerEvidenciaPrestamo}
                            />
                        </ModalWin.Body>
                    </ModalWin>
                }


                {
                    state.Form.VerDoc && <ModalWin open={state.Form.VerDoc} center large >
                        <ModalWin.Header>
                            <h5 className={MODAL_TITLE_CLASS}>{state.Documento.documentoNombre} NOMBRE</h5>
                            <button type="button" className="delete" onClick={() => {
                                fnCancelar()
                            }} />
                        </ModalWin.Header>
                        <ModalWin.Body>
                            <VerDoc DocumentoID={state.Documento.documentoID} fnCancelar={fnCancelar} />
                        </ModalWin.Body>
                    </ModalWin>
                }
                <div>
                    <ModalWin zIndex={5000} open={state.FormDatosBancarios.Mostrar}>
                        <ModalWin.Header>
                            <h5 className={MODAL_TITLE_CLASS}>Registrar Dato Bancario</h5>
                        </ModalWin.Header>
                        <ModalWin.Body>
                            {<CForm
                                oidc={oidc}
                                initialValues={state.FormDatosBancarios.datosBancarios}
                                Id={state.FormDatosBancarios.Id}
                                optBancos={state.optBancos}
                                optTipos={state.optTipos}
                                optAclaraciones={state.optAclaraciones}
                                cbGuardar={cbAgregar}
                                cbActualizar={cbActualizar}
                                fnCancelar={fnCancelar}
                            />}
                        </ModalWin.Body>
                    </ModalWin>
                </div>

                {state.showPlanPagos && <ModalWin open={state.showPlanPagos} center zIndex={5000}  >
                    <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>PLAN DE PAGOS</h5>
                        <button type="button" className="delete" onClick={() => {
                            fnCancelarPlanPagos()
                        }} />
                    </ModalWin.Header>
                    <ModalWin.Body>
                        <PlanPagos SolicitudPrestamoPersonalID={state.SolicitudPrestamoPersonalID} />
                    </ModalWin.Body>
                </ModalWin>}
                {state.MostrarPlazos &&
                    <ModalWin
                        open={state.MostrarPlazos}
                        center={true}

                        scrollable
                        zIndex={3000}
                    >
                        <ModalWin.Header>
                            <h5 >

                                <h4 className="has-text-weight-bold">{"Plan de Pagos"}</h4>

                            </h5>
                            <button type="button" className="delete" onClick={() => {
                                fnCancelarPlanPagosH()
                            }} />

                        </ModalWin.Header>
                        <ModalWin.Body>
                            <DataTable
                                // subHeader
                                data={state.datosHerramientas2}
                                columns={ColumnsSimularPlazos}
                                responsive
                                noHeader

                            />


                        </ModalWin.Body>


                    </ModalWin>}

                {state.showDocumento &&
                    <CFormSCRSDocEdit
                        iodc={oidc}
                        DistribuidorID={personaID}
                        SolicitudRCID={state.SolicitudRCID}
                        Estatus={state.Estatus}
                        Accion={state.Accion}
                        IdSolicitud={state.SolicitudRCID}
                        fnAbrir_Cerrar={() => toggleModalSolicitudCRS()}
                    />
                }

            </div >
        )
    return null
}
export default DatosPersona