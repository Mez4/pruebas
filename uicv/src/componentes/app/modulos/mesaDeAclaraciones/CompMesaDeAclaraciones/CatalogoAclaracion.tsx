import React, { useState } from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import { toast } from 'react-toastify'
import * as Funciones from './CatalogoAclaracion/Funciones'
// Icons
import { FaEye, FaExclamationCircle, FaFileSignature, FaFilter, FaPen, FaPencilAlt, FaPlus, FaFacebookMessenger, FaCheck, FaCheckCircle } from 'react-icons/fa'
// Custom components
import { ActionSelect, Card, DatePickeEnd, DatePickeStart, Spinner, ImgViewer } from '../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos, formatDate } from '../../../../../global/functions'
import { CForm } from './CatalogoAclaracion/CForm'
import { boolean } from '../../../../../global/idiomaValidacion.bak'
import { bool } from 'yup'
import moment from 'moment'
import { Form, Formik } from 'formik'
import ReactTooltip from 'react-tooltip'
import { CFormAgregarEvidencia } from './CatalogoAclaracion/CFormAgregarEvidencia'
import { CFormVerEvidencias } from './CatalogoAclaracion/CFormVerEvidencias'
import VerDocumentosAclaracion from './CatalogoAclaracion/VerDocumentosAclaracion'
import { CFormMensajes } from './CatalogoAclaracion/CFormMensajes'
import { CFormAsignarAnalista } from './CatalogoAclaracion/CFormAsignarAnalista'
import Seguridad from '../../seguridad/Seguridad'
import { CFormAsignaEstatus } from './CatalogoAclaracion/CFormAsignarEstatus'
type CatalogosType = {
    oidc: IOidc,
}
const CatalogoAclaracion = (props: CatalogosType) => {    // Controll our mounted state
    let isMounted = React.useRef(true)
    const [startDate, setStartDate] = useState(moment().add(-1, 'y').toDate());
    const [endDate, setEndDate] = useState(moment().toDate());
    const [loading, setLoading] = React.useState(false)
    const [loading2, setLoading2] = React.useState(false)
    const DatosDefecto = {
        Evidencias: [
            {
                DocumentoID: 0,
                AclaracionID: 0,
                Ruta: '',
            }
        ]
    }
    const DatosDefectoAsignarAnalista = {
        AnalistaID: 0,
    }
    const DatosDefectoEstatus = {
        EstatusID: 0,
    }
    const Datos: any[] = []
    const Evidencias: any[] = []
    const DatosMostrar: any[] = []
    const MesaAclaracion: any[] = []
    const OptionsUsuario: any[] = []
    const OptionsCredito: any[] = []
    const optAnalistaPers: any[] = []
    const optAnalistaPersCform: any[] = []
    const optSucursales: any[] = []
    const optEstatus: any[] = []
    const optBuro: any[] = []
    const optProspecto: any[] = []
    const FiltroAnalista: number = 0
    const FiltroSucursal: number = 0
    const FiltroProspecto: number = 0
    const FiltroConsolida: number = 0
    const FiltroEstatus: number = 0
    const [state, setState] = React.useState({
        DocumentoID: 0,
        AclaracionID: 0,
        PuedeAsignar: false,
        Datos,
        Evidencias,
        DatosMostrar,
        optAnalistaPers,
        optAnalistaPersCform,
        optSucursales,
        optEstatus,
        optBuro,
        optProspecto,
        TipoMesaAclaracion: [],
        TipoBonificacion: [],
        TipoEstatus: [],
        TipoConceptos: [],
        Filtro: '',
        Cargando: false,
        Error: false,
        MesaAclaracion,
        Form: {
            src: '',
            MostrarAsignarAnalista: false,
            MostrarAsignarEstatus: false,
            MostrarImagenesEvidencia: false,
            MostrarVerEvidencias: false,
            MostrarMensajes: false,
            VerEvidencia: false,
            Ruta: '',
            DocumentoID: 0,
            CargarEvidencia: false,
            AclaracionID: 0,
            Mostrar: false,
            Datos: DatosDefecto,
            DatosAsignarAnalista: DatosDefectoAsignarAnalista,
            DatosEstatus: DatosDefectoEstatus,
            Id: undefined,
        },
        OptionsUsuario,
        OptionsCredito,
        FiltroAnalista,
        FiltroSucursal,
        FiltroProspecto,
        FiltroConsolida,
        FiltroEstatus,
    })

    const cbGuardarAsignarAclaracion = (item: any) => {

        let index = state.Datos.findIndex((x: any) => x.AclaracionID === item.AclaracionID)
        if (index > -1) {
            state.Datos[index].AnalistaID = item.AnalistaID
            state.Datos[index].AnalistaNombre = item.AnalistaNombre
        }
        setState({ ...state })
    }
    const cbGuardarAsignarEstatus = (item: any) => {
        console.log("ITEM RECIBIDO", item)
        let index = state.Datos.findIndex((x: any) => x.AclaracionID === item.AclaracionID)
        if (index > -1) {
            state.Datos[index].EstatusID = item.EstatusID,
                state.Datos[index].DescripcionEstatus = item.DescripcionEstatus
        }
        setState({ ...state })
    }
    const FNGetLocalImagen = (aclaracionId: number, documentoId: number) => {
        setLoading2(true)
        Funciones.FnGetEvidencia(props.oidc, aclaracionId, documentoId)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    console.log("###", respuesta);
                    console.log("###", respuesta.src);
                    setState(s => ({ ...s, Form: { ...s.Form, src: respuesta.src } }))
                    setLoading2(false)
                }
            })
            .catch((error) => {
                console.log("###e", error)
                if (isMounted.current === true) {
                    // setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }
    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc).then((respuesta: any) => {
            if (isMounted.current === true) {
                console.log("###", respuesta);
                if (respuesta.mensajePeticion === undefined) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                } else {
                    setState(s => ({ ...s, Cargando: false }))
                    toast.error("Error al obtener los datos, permisos insuficientes")
                }
            }
        })
            .catch((error: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }
    const FNGetTipoMesaAclaracion = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetTipoMesaAclaracion(props.oidc)
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
        Funciones.FNGetTipoBonidicacion(props.oidc)
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
        Funciones.FNGetTipoEstatus(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var estatus = respuesta.map((valor: any) => {
                        var obj = { value: valor.EstatusID, label: valor.Descripcion };
                        return obj
                    });
                    setState(s => ({ ...s, Cargando: false, Error: false, TipoEstatus: estatus, optEstatus: estatus }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, TipoEstatus: [] }))
                }
            })
    }
    const FNGetTipoConceptos = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetTipoConceptos(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var concepto = respuesta.map((valor: any) => {
                        var obj = { value: valor.ConceptoID, label: valor.DescripcionConcepto };
                        return obj
                    });
                    setState(s => ({ ...s, Cargando: false, Error: false, TipoConceptos: concepto }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, TipoConceptos: [] }))
                }
            })
    }
    //Funcion para obtener los datos de Usuario
    const FnGetPersona = (Nombre: string, callback: any) => {
        let Datos = {
            Nombre: Nombre
        }
        setState(s => ({ ...s }))
        Funciones.FNGetPersona(props.oidc, Datos)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var persona = respuesta.map((valor: any) => {
                        var obj = { value: valor.PersonaID, label: valor.NombreCompleto, PersonaID: valor.PersonaID };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsUsuario: persona }))
                    callback(persona)
                }
                console.log("Personas", persona)
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
        Funciones.FNGetSucursal(props.oidc, Datos)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var sucursal = respuesta.map((valor: any) => {
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
        Funciones.FnGetAnalistas(props.oidc)
            .then((respuesta: any) => {
                var sucursalesBackup = respuesta.map((valor: any) => {
                    var obj = { value: valor.AnalistaID, label: valor.NombreCompleto };
                    return obj
                });
                var sucursales = respuesta.map((valor: any) => {
                    var obj = { value: valor.AnalistaID, label: valor.NombreCompleto };
                    return obj
                });
                let a = {
                    value: null, label: "SIN ASIGNAR"
                }
                sucursales.unshift(a);
                setState(s => ({ ...s, optAnalistaPers: sucursales, optAnalistaPersCform: sucursalesBackup }))
            })
            .catch(() => {
                setState(s => ({ ...s, optAnalistaPers: [] }))
            })
    }

    const FNPuedeAsignar = () => {
        setState(s => ({ ...s }))
        Funciones.FNPuedeAsignar(props.oidc)
            .then((respuesta: any) => {
                setState(s => ({ ...s, PuedeAsignar: respuesta.PuedeAsignar }))
            })
            .catch(() => {
                setState(s => ({ ...s, optSucursales: [] }))
            })
    }
    const FnSucursales = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetSucursales(props.oidc)
            .then((respuesta: any) => {
                var sucursales = respuesta.map((valor: any) => {
                    var obj = { value: valor.SucursalID, label: valor.Nombre };
                    return obj
                });
                setState(s => ({ ...s, optSucursales: sucursales }))
            })
            .catch(() => {
                setState(s => ({ ...s, optSucursales: [] }))
            })
    }
    const fnGetFiltrosAnalistas = (PersonaAnalistaID: number) => {

        setState(s => ({ ...s, FiltroAnalista: PersonaAnalistaID }))
    }
    const fnGetFiltrosSucursales = (SucursalID: number) => {
        console.log(SucursalID)
        setState(s => ({ ...s, FiltroSucursal: SucursalID }))
    }
    const fnGetFiltroEstatus = (EstatusID: number) => {
        setState(s => ({ ...s, FiltroEstatus: EstatusID }))
    }
    const cbActualizar = (item: any) => {
        toast.success('Aclaración actualizada correctamente')
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.AclaracionID === item.AclaracionID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } })
    }
    /****************************************************************************************************/
    const fnVerEvidencia = (DocumentoID: any, AclaracionID: any, Ruta: any) => {
        setState(s => ({
            ...s, Form: {
                ...s.Form, VerEvidencia: true, AclaracionID: AclaracionID, Ruta: Ruta
            }
            , DocumentoID: DocumentoID
        }))
    }
    const fnMostrarCargarEvidencia = (DocumentoID: any, AclaracionID: any) => {
        setState(s => ({
            ...s, Form: {
                ...s.Form, CargarEvidencia: true, AclaracionID: AclaracionID
            }
            , DocumentoID: DocumentoID
        }))
    }
    const fnCancelarMostrarMensajes = () => {
        setState(s => ({
            ...s, Form: {
                ...s.Form, MostrarMensajes: false
            }
        }))
        FNGetLocal()
    }


    const fnCancelarVerEvidencia = () => {
        setState(s => ({
            ...s, Form: {
                ...s.Form, VerEvidencia: false
            }
        }))
    }
    const fnCancelarMostrarCargaEvidencia = () => {
        setState(s => ({
            ...s, Form: {
                ...s.Form, CargarEvidencia: false
            }
        }))
    }
    const fnMostrarModalEvidencias = (item: any) => {
        item.Evidencias.length > 0 ? setState(s => ({
            ...s, AclaracionID: item.Evidencias[0].AclaracionID
        })) : 0
        setState(s => ({
            ...s, Evidencias: item.Evidencias,
        }))
        setState(s => ({
            ...s, Form: {
                ...s.Form, MostrarVerEvidencias: true
            }
        }))
    }
    /****************************************************************************************************/




    const fnCancelar = () => setState(s => ({ ...s, Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } }))
    const cbAgregar = (item: any) => {
        toast.success('Aclaración agregada correctamente')

    }
    function formatearFecha(fecha) {
        return moment(fecha).format("DD/MM/YYYY hh:mm")
    }


    const fnMostrarImagenesEvidencia = (item?: any) => {
        setState(s => ({
            ...s,
            AclaracionID: item.AclaracionID,
            Form: {
                ...s.Form, src: "", MostrarImagenesEvidencia: true
            }
        }))
        FNGetLocalImagen(item.AclaracionID, item.DocumentoID)
    }


    const ColumnsEvidencias: IDataTableColumn[] =
        [
            { name: 'DocumentoID', selector: 'DocumentoID', sortable: false, center: true },
            {
                name: 'Ruta', selector: 'Ruta', sortable: false, center: true,
                cell: (propss) => <span className="text-center">{propss.Ruta}</span>
            },
            {
                name: 'Acciones', selector: 'Acciones', sortable: false, center: true,
                cell: (propss) => <span className="text-center">
                    <button className="btn btn-primary btn-sm" onClick={() => fnMostrarImagenesEvidencia(propss)}><i className="fa fa-eye"></i></button>
                </span>

            }
        ]
    const Columns: IDataTableColumn[] =
        [
            {
                name: 'Id',
                selector: 'AclaracionID',
                center: true,
                sortable: false
            },
            {
                name: 'Socia',
                selector: 'Distribuidor',
                center: true,
                sortable: false,
                cell: (propss) => <span className="text-center">{propss.Distribuidor}</span>

            },
            {
                name: 'Fecha Captura',
                selector: 'FechaCaptura',
                center: true,
                sortable: false,
                cell: (props) => <span className='text'>{formatearFecha(props.FechaCaptura)}</span>
            },
            {
                name: 'Asginar',
                selector: '',
                sortable: false,
                center: true,
                cell: (props) =>
                    <>
                        <div data-tip data-for={!props.AnalistaID ? `BC_${props.AclaracionID}` : {}} className="divInDTable text-center radiusSmallDivR">
                            {/* <button disabled={state.PuedeAsignar} onClick={() => { */}
                            <button onClick={() => {
                                setState({
                                    ...state,
                                    AclaracionID: props.AclaracionID,
                                    Form: {
                                        ...state.Form,
                                        MostrarAsignarAnalista: true
                                    }
                                })
                            }} className="btn btn-outline-default buttonIconInDTable" type={"button"}> <FaPen color={props.ColorRevisionBuro} size={[11].includes(props.StatusProcesoID) ? 30 : 15} /></button>
                        </div>
                        <ReactTooltip id={`BC_${props.AclaracionID}`} type="info" effect="solid">
                            Asignación de la aclaración Nro {props.AclaracionID}
                        </ReactTooltip>
                    </>,
                // conditionalCellStyles: activoStyle(props)
            },
            {
                name: 'Mensajes',
                selector: '',
                sortable: false,
                center: true,
                cell: (props) =>
                    <>
                        <div className='notificacion'>


                            <div data-tip data-for={`MSN_${props.AclaracionID}`} className="divInDTable text-center radiusSmallDivR">
                                {props.MensajesSinLeer && <span className="badge">{props.CantidadMensajesSinLeer}</span>}
                                <button onClick={() => {
                                    setState({
                                        ...state,
                                        AclaracionID: props.AclaracionID,
                                        Form: {
                                            ...state.Form,
                                            MostrarMensajes: true
                                        }
                                    })
                                }} className="btn btn-outline-default buttonIconInDTable" type={"button"}>
                                    <FaFacebookMessenger color={'#3e74ba'} size={15} /></button>
                            </div>
                            <ReactTooltip id={`MSN_${props.AclaracionID}`} type="info" effect="solid">
                                Historial de mensajes con el coordinador.
                            </ReactTooltip>
                        </div>
                    </>,
                // conditionalCellStyles: activoStyle(props)
            },
            {
                name: 'Analista',
                selector: 'AnalistaNombre',
                sortable: false,
                center: true,
                cell: props => <span className='text'>{props.AnalistaNombre != undefined ? props.AnalistaNombre : "Pendiente de asignar"}</span>
            },
            {
                name: 'Sucursal',
                selector: 'NombreSucursal',
                sortable: false,
                center: true,
                cell: (props) => <span className='text'>{props.NombreSucursal}</span>
            },
            {
                name: 'Fecha Asignación',
                selector: 'FechaInicioAsignacion',
                sortable: false,
                center: true,
                cell: props => <span className='text-center'>{props.FechaInicioAsignacion == undefined ? "N/A" : moment(props.FechaInicioAsignacion).format("DD-MM-YYYY HH:mm:ss")}
                </span>
            },
            {
                name: 'Concepto',
                selector: 'DescTipoSolicitud',
                sortable: false,
                center: true,
                cell: (props) => <span className='text-center'>{props.DescTipoSolicitud}</span>
            },
            {
                name: 'Evidencia',
                center: true,
                sortable: false,
                cell: (propss) =>
                    <div className='divInDTable text-center radiusSmallDivR' data-tip data-for={`VE_${propss.AclaracionID}`}>
                        <button
                            className="btn btn-outline-default buttonIconInDTable" type={"button"}
                            onClick={() => { fnMostrarModalEvidencias(propss) }}>
                            <FaEye />
                            <ReactTooltip id={`VE_${propss.AclaracionID}`} type="info" effect="solid">Ver Evidencia</ReactTooltip>
                        </button>
                    </div>


            },
            {
                name: 'Descripción Estatus',
                selector: 'DescripcionEstatus',
                center: true,
                sortable: false,
                cell: (props) => <span className='text'>{props.DescripcionEstatus}</span>
            },
            {
                name: 'Estatus',
                center: true,
                sortable: false,
                cell: (propss) =>
                    <div className='divInDTable text-center radiusSmallDivR' data-tip data-for={`CE_${propss.AclaracionID}`}>
                        <button
                            className="btn btn-outline-default buttonIconInDTable"
                            type={"button"}
                            onClick={() => {
                                setState({
                                    ...state,
                                    AclaracionID: propss.AclaracionID,
                                    Form: {
                                        ...state.Form,
                                        MostrarAsignarEstatus: true,
                                        DatosEstatus: {
                                            ...state.Form.DatosEstatus,
                                            EstatusID: propss.EstatusID,
                                        }
                                    }
                                })
                            }}>
                            <FaCheckCircle />
                            <ReactTooltip id={`CE_${propss.AclaracionID}`} type="info" effect="solid">Actualizar estatus de la solicitud</ReactTooltip>
                        </button>
                    </div>


            },
            {
                name: 'Tiempo Total',
                selector: 'TiempoTotalSolicitud',
                center: true,
                sortable: false,
                cell: (props) => {
                  let tiempo = props.TiempoTotalSolicitud;
                  
                  if (tiempo === null) {
                    return (
                      <span style={{ color: '#E62629', fontWeight: 'bold' }}>
                        Sin tiempo registrado
                      </span>
                    );
                  }
              
                  if (tiempo > 60) {
                    const horas = Math.floor(tiempo / 60);
                    const minutos = tiempo % 60;
              
                    return (
                      <span style={{ color: '#00A86B', fontWeight: 'bold' }}>
                        {`${horas} Horas con ${minutos} Minutos`}
                      </span>
                    );
                  } else {
                    return (
                      <span style={{ color: '#00A86B', fontWeight: 'bold' }}>
                        {`${tiempo} Minutos`}
                      </span>
                    );
                  }
                }
              }
        ]
    React.useEffect(() => {
        FnSucursales()
        FNPuedeAsignar()
        FNGetLocal()
        FNGetTipoBonidicacion()
        FNGetTipoEstatus()
        FNGetTipoConceptos()
        FnGetAnalistas()
        return () => {
            isMounted.current = false
        }
    }, [])
    const FnFiltrando = () => {
        let numFiltro = (state.FiltroAnalista + state.FiltroSucursal + state.FiltroEstatus)
        let datosFiltro = state.Datos
        if (numFiltro > 0)
            setState(s => ({ ...s, Filtrando: true }))
        else
            setState(s => ({ ...s, Filtrando: false }))

        if (state.FiltroAnalista === null) {
            datosFiltro = datosFiltro.filter(d => { return d.AnalistaID === null })
        }

        if (state.FiltroAnalista > 0)
            datosFiltro = datosFiltro.filter(d => { return d.AnalistaID === state.FiltroAnalista })

        if (state.FiltroSucursal > 0)
            datosFiltro = datosFiltro.filter(d => { return d.SucursalID === state.FiltroSucursal })

        if (state.FiltroEstatus > 0)
            datosFiltro = datosFiltro.filter(d => { return d.EstatusID === state.FiltroEstatus })

        if (startDate != null && endDate != null) {
            startDate.setHours(0, 0, 0)
            endDate.setHours(23, 59, 59)
            datosFiltro = datosFiltro.filter(d => { return d.FechaAsignacion >= startDate.toISOString() && d.FechaAsignacion <= endDate.toISOString() || d.FechaAsignacion === null })
        }
        setState(s => ({ ...s, DatosMostrar: datosFiltro }))
    }
    React.useEffect(() => {
        FnFiltrando()
    }, [state.FiltroAnalista, state.FiltroSucursal, state.FiltroEstatus, startDate, endDate])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        FnFiltrando()
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])
    return (
        <div className="row ">
            <div className="col-12">
                <Card Title="REVISIÓN DE SOLICITUDES DE ACLARACIÓN">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando &&
                                <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        subHeader
                                        noDataComponent={<div style={{ margin: '4em' }}> {<><FaExclamationCircle color={'grey'} size={20} />  NO HAY SOLICITUDES </>}</div>}
                                        paginationComponentOptions={{ rowsPerPageText: 'Registros por página:', rangeSeparatorText: 'de', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'Todo' }}
                                        subHeaderComponent=
                                        {
                                            <div className="row" style={{ width: '102%' }}>
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3" style={{ justifyContent: 'space-between' }}>
                                                        <div></div>
                                                        <div className="input-group mb-15" style={{ width: 'auto' }} >
                                                            {/* <input type="text" className="form-control" placeholder="Buscar Solicitud Credito" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} /> */}
                                                            {/* <span className="input-group-text"><FaSearch /> </span> */}
                                                            {/* <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button> */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-12">
                                                    <div style={{ backgroundColor: '#F7F7F7', padding: '1em', borderRadius: '15px' }}>
                                                        <div>
                                                            <div style={{ float: 'right' }}>
                                                                <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>


                                                            </div>
                                                            <div style={{ float: 'left' }}><FaFilter /></div>
                                                            <div ><label> FILTROS</label></div>
                                                        </div>
                                                        <div style={{ width: '100%', textAlign: 'center' }}>
                                                            <div style={{ display: 'inline-block' }}>
                                                                <Formik
                                                                    initialValues={{}}
                                                                    onSubmit={() => { }}
                                                                >
                                                                    <Form>
                                                                        <div className="row" style={{ textAlign: 'initial' }}>
                                                                            <div style={{ height: '57px', width: '245px' }}>
                                                                                <ActionSelect
                                                                                    disabled={false}
                                                                                    label="Analistas"
                                                                                    name="PersonaAnalistaID"
                                                                                    placeholder="TODOS"
                                                                                    options={state.optAnalistaPers}
                                                                                    addDefault={true}
                                                                                    valor={state.FiltroAnalista}
                                                                                    accion={fnGetFiltrosAnalistas}
                                                                                />
                                                                            </div>
                                                                            <div style={{ height: '57px', width: '245px' }}>
                                                                                <ActionSelect
                                                                                    disabled={false}
                                                                                    label="Sucursales"
                                                                                    name="SucursalID"
                                                                                    placeholder="TODOS"
                                                                                    options={state.optSucursales}
                                                                                    addDefault={false}
                                                                                    valor={state.FiltroSucursal}
                                                                                    accion={fnGetFiltrosSucursales}
                                                                                />
                                                                            </div>
                                                                            <div style={{ height: '57px', width: '245px' }}>
                                                                                <ActionSelect
                                                                                    disabled={false}
                                                                                    label="Estatus"
                                                                                    name="EstatusID"
                                                                                    placeholder="TODOS"
                                                                                    options={state.optEstatus}
                                                                                    addDefault={false}
                                                                                    valor={state.FiltroEstatus}
                                                                                    accion={fnGetFiltroEstatus}
                                                                                />
                                                                            </div>
                                                                            <div style={{ height: '67px', width: '140px' }}>
                                                                                <DatePickeStart
                                                                                    name={'FechaInicio'}
                                                                                    label={'FH Inicial Asign.'}
                                                                                    disabled={loading}
                                                                                    placeholder={'Inicio'}
                                                                                    isClearable startDate={startDate}
                                                                                    endDate={endDate}
                                                                                    setStartDate={setStartDate}
                                                                                />
                                                                            </div>
                                                                            <div style={{ height: '67px', width: '140px' }}>
                                                                                <DatePickeEnd
                                                                                    name={'FechaFinal'}
                                                                                    label={'FH Final Asign.'}
                                                                                    disabled={loading}
                                                                                    placeholder={'Final'}
                                                                                    isClearable startDate={startDate}
                                                                                    endDate={endDate}
                                                                                    setEndDate={setEndDate} />
                                                                            </div>
                                                                        </div>
                                                                    </Form>
                                                                </Formik>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"ProspectoID"}
                                        defaultSortField={"FechaEnMesa"}
                                        defaultSortAsc={false}
                                        columns={Columns}
                                        paginationPerPage={10}
                                        style={{ paddingBottom: '2em', width: '100%' }}
                                        fixedHeaderScrollHeight={'fixed'}
                                    />
                                    <ModalWin open={state.Form.MostrarAsignarEstatus} center={true} >
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>ASIGNAR ESTATUS A LA ACLARACIÓN N°: {state.AclaracionID} </h5>
                                            <button type="button" className="delete" onClick={() => {
                                                setState({
                                                    ...state,
                                                    Form: {
                                                        ...state.Form,
                                                        MostrarAsignarEstatus: false
                                                    }
                                                })
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormAsignaEstatus
                                                oidc={props.oidc}
                                                Id={state.AclaracionID}
                                                initialValues={state.Form.DatosEstatus}
                                                optEstatus={state.TipoEstatus}
                                                fnCancelar={() => setState({
                                                    ...state,
                                                    Form: {
                                                        ...state.Form,
                                                        MostrarAsignarEstatus: false
                                                    }
                                                })}
                                                cbGuardar={cbGuardarAsignarEstatus}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>

                                    <ModalWin open={state.Form.MostrarAsignarAnalista} center={true} >
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>ASIGNAR ANALISTA A LA ACLARACIÓN N°: {state.AclaracionID} </h5>
                                            <button type="button" className="delete" onClick={() => {
                                                setState({
                                                    ...state,
                                                    Form: {
                                                        ...state.Form,
                                                        MostrarAsignarAnalista: false
                                                    }
                                                })
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormAsignarAnalista
                                                oidc={props.oidc}
                                                Id={state.AclaracionID}
                                                initialValues={state.Form.DatosAsignarAnalista}
                                                optAnalistas={state.optAnalistaPersCform}
                                                fnCancelar={() => setState({
                                                    ...state,
                                                    Form: {
                                                        ...state.Form,
                                                        MostrarAsignarAnalista: false
                                                    }
                                                })}
                                                cbGuardar={cbGuardarAsignarAclaracion}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>

                                    <ModalWin open={state.Form.MostrarVerEvidencias} center={true} large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>VER EVIDENCIAS </h5>
                                            <button type="button" className="delete" onClick={() => {
                                                setState({
                                                    ...state,
                                                    Form: {
                                                        ...state.Form,
                                                        MostrarVerEvidencias: false
                                                    }
                                                })
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <div className="row">
                                                <div className="col-12">
                                                    <Card Title={"EVIDENCIAS DE LA ACLARACIÓN N°: " + state.AclaracionID}>
                                                        <Card.Body>
                                                            <Card.Body.Content>
                                                                <DataTable
                                                                    data={state.Evidencias}
                                                                    striped
                                                                    // pagination
                                                                    dense
                                                                    noHeader
                                                                    responsive
                                                                    keyField={"DocumentoID"}
                                                                    defaultSortField={"DocumentoID"}
                                                                    columns={ColumnsEvidencias}

                                                                />
                                                            </Card.Body.Content>
                                                        </Card.Body>
                                                    </Card>
                                                </div>
                                            </div>
                                        </ModalWin.Body>
                                    </ModalWin>




                                    <ModalWin open={state.Form.MostrarVerEvidencias} center={true} large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>VER EVIDENCIAS </h5>
                                            <button type="button" className="delete" onClick={() => {
                                                setState({
                                                    ...state,
                                                    Form: {
                                                        ...state.Form,
                                                        MostrarVerEvidencias: false
                                                    }
                                                })
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <div className="row">
                                                <div className="col-12">
                                                    <Card Title={"EVIDENCIAS DE LA ACLARACIÓN N°: " + state.AclaracionID}>
                                                        <Card.Body>
                                                            <Card.Body.Content>
                                                                <DataTable
                                                                    data={state.Evidencias}
                                                                    striped
                                                                    dense
                                                                    noHeader
                                                                    responsive
                                                                    keyField={"DocumentoID"}
                                                                    defaultSortField={"DocumentoID"}
                                                                    columns={ColumnsEvidencias}

                                                                />
                                                            </Card.Body.Content>
                                                        </Card.Body>
                                                    </Card>
                                                </div>
                                            </div>
                                        </ModalWin.Body>
                                    </ModalWin>
                                    <ModalWin open={state.Form.MostrarImagenesEvidencia} center={true} large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Previsualizando evidencia </h5>
                                            <button type="button" className="delete" onClick={() => {
                                                setState({
                                                    ...state,
                                                    Form: {
                                                        ...state.Form,
                                                        MostrarImagenesEvidencia: false
                                                    }
                                                })
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>

                                            <div style={{ width: '100%', height: '150px', backgroundColor: 'white', textAlign: 'center' }}>
                                                {loading2 &&
                                                    <div className='text-center'>
                                                        <Spinner /></div>}
                                                {!loading2 &&
                                                    <ImgViewer imgSrc={state.Form.src} noToolbar={false} zIndex={1500} maxWidth={500} maxHeight={150} />
                                                } </div>
                                        </ModalWin.Body>
                                    </ModalWin>
                                    <CFormMensajes
                                        oidc={props.oidc}
                                        AclaracionID={state.AclaracionID}
                                        Item={1}
                                        TipoMesa={1}
                                        cbActualizar={(e) => { }}
                                        fnCancelar={fnCancelarMostrarMensajes}
                                        mostrar={state.Form.MostrarMensajes}
                                        EnviadoDesde={false}
                                    />
                                    {state.Form.CargarEvidencia && <ModalWin open={state.Form.CargarEvidencia} center large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Agregar Evidencia</h5>
                                            <button type="button" className="delete" onClick={() => {
                                                fnCancelarMostrarCargaEvidencia()
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormAgregarEvidencia
                                                oidc={props.oidc}
                                                DocumentoID={state.Form.DocumentoID === null ? 0 : state.Form.DocumentoID}
                                                AclaracionID={state.Form.AclaracionID}
                                                initialValues={{ file: "" }}
                                                fnCancelarMostrarCargaEvidencia={fnCancelarMostrarCargaEvidencia}
                                                FNGetLocal={FNGetLocal}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>}
                                    {state.Form.VerEvidencia && <ModalWin open={state.Form.VerEvidencia} center large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Visor de Archivos</h5>
                                            <button type="button" className="delete" onClick={() => {
                                                fnCancelarVerEvidencia()
                                            }} />
                                        </ModalWin.Header>
                                        {/* <ModalWin.Body>

                                        </ModalWin.Body> */}
                                    </ModalWin>}
                                </div>
                            }
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>
        </div >
    )
}
const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})
const mapDispatchToProps = {
}
export default connect(mapStateToProps, mapDispatchToProps)(CatalogoAclaracion);