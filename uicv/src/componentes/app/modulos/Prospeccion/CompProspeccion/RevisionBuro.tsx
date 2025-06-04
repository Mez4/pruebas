import React, { useState } from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import { iUI } from '../../../../../interfaces/ui/iUI'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from '../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/Funciones'
import { toast } from 'react-toastify'
import { FaStickyNote, FaClock, FaFilePdf, FaUserPlus, FaExclamationCircle, FaStore, FaUser, FaArrowDown } from 'react-icons/fa'
import { Card, Spinner, ActionSelect, DatePickeStart, DatePickeEnd, CustomActionSelect } from '../../../../global'
import { CFormTiempos } from '../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CFormTiempos'
import { CFormMensajes } from '../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CFormMensajes'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { CFormConfirmarBuroDeCredito } from '../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CFormConfirmaBuroDeCredito'
import { CFormBuroDeCredito } from '../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CFormBuroDeCredito'
import ReactTooltip from 'react-tooltip'
import { FaFilter } from 'react-icons/fa'
import { Formik, Form } from 'formik'
import { AsignaAnalistaBuro } from './RevisionBuro/AsignaAnalistaBuro'
import { AsignaAnalistaBuroM } from './RevisionBuro/AsignaAnalistaM'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { CFormArchivar } from './CatalogoMesaCreditoIndex/CFormArchivar'

type CatalogosType = {
    oidc: IOidc,
    Filtro: Number,
    ui: iUI,
}
const RevisionBuro = (props: CatalogosType) => {

    // Controll our mounted state
    let isMounted = React.useRef(true)

    const [startDate, setStartDate] = useState(moment().add(-1, 'y').toDate());
    const [endDate, setEndDate] = useState(moment().toDate());

    // Basic variables
    const DatosDefecto = {
        ProspectoID: 0, PersonaAnalistaID: 0
    }
    const DatosDefectoArchivar = {
        ProspectoID: 0, Motivo: '',TipoArchivadoID: 0
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optAnalistaPers: any[] = []
    const optSucursales: any[] = []
    const optBuro: any[] = []
    const optActivo: any[] = []
    const optProspecto: any[] = []
    const optDictamen: any[] = []
    const FiltroActivo: number = 3
    const FiltroAnalista: number = 0
    const FiltroSucursal: number = 0
    const FiltroProspecto: number = 0
    const FiltroConsolida: number = 0
    const FiltroDictamen: number = 0
    const [loading, setLoading] = React.useState(false)
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        optAnalistaPers,
        optSucursales,
        optActivo,
        optBuro,
        optProspecto,
        optDictamen,
        Filtro: '',
        Cargando: true,
        CargandoOverlay: false,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined,
            IdAnalista: undefined
        },
        FormArchivar:
        {
            Mostrar: false,
            Datos: DatosDefectoArchivar,
            Id: undefined,
        },
        CForm: false, //Asignacion
        CFormM: false, //Asignacion
        CFormTiempos: false,
        CFormMensajes: false,
        CFormArchivar: false,
        RevisionBuro: 0,
        BuroInternoEstatusID: 0,
        EstatusConsultaBuroID: 0,
        EstatusConsultaBuroDesc: '',
        CFormConfirmarBuroDeCredito: false,
        CFormBuroDeCredito: false,
        Item: undefined,
        ProspectoID: 0,
        NombreProspecto: '',
        Id: undefined,
        nombreP: '',
        FiltroActivo,
        FiltroAnalista,
        FiltroSucursal,
        FiltroProspecto,
        FechaInicio: '',
        FechaFinal: '',
        FiltroConsolida,
        FiltroDictamen,
        DatosProspe: {},
    })

    const [selectedRows, setSelectedRows] = React.useState([]);
    const MySwal = withReactContent(Swal);

    const handleRowSelected = React.useCallback(state => {
        setSelectedRows(state.selectedRows);
    }, []);

    const permisoAsignar = props.ui.PermisosProductos?.find(p => p.PermisoID > 1)

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetBuro(props.oidc)
            .then((respuesta: any) => {
                console.log('datosssss',respuesta)
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
                var dictamen = respuesta.map((valor: any) => {
                    var obj = { value: valor.RevisionBuro, label: valor.ColorRevisionBuroDesc }
                    return obj
                })
                let DictamenOpt = dictamen.filter((obj, pos, arr) => {
                    return dictamen.map(mapObj => mapObj.value).indexOf(obj.value) === pos;
                })
                console.log(DictamenOpt)
                setState(s => ({ ...s, optDictamen: DictamenOpt }))
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
                setState(s => ({ ...s, optDictamen: [] }))
            })
    }
    const FnGeTActivo = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetActivo(props.oidc)
            .then((respuesta: any) => {
                var ActivoLst = respuesta.map((valor: any) => {
                    var obj = { value: valor.Activo, label: valor.ActivoDesc };
                    return obj
                })
                console.log('activo')
                console.log(ActivoLst)

                setState(s => ({ ...s, optActivo: ActivoLst }))
            })
            .catch(() => {
                setState(s => ({ ...s, optActivo: [] }))
            })
    }

    const FnGetAnalistas = () => {
        setState(s => ({ ...s }))
        Funciones.FnGetAnalistas(props.oidc)
            .then((respuesta: any) => {
                var sucursales = respuesta.map((valor: any) => {
                    var obj = { value: valor.AnalistaID, label: valor.NombreCompleto };
                    return obj
                });

                setState(s => ({ ...s, optAnalistaPers: sucursales }))
            })
            .catch(() => {
                setState(s => ({ ...s, optAnalistaPers: [] }))
            })
    }

    const FnGetEstatusBuroDeCredito = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetBuroDeCredito(props.oidc)
            .then((respuesta: any) => {
                var buro = respuesta.map((valor: any) => {
                    var obj = { value: valor.BuroInternoEstatusID, label: valor.Nombre };
                    return obj

                });

                setState(s => ({ ...s, optBuro: buro }))
            })
            .catch(() => {
                setState(s => ({ ...s, optBuro: [] }))
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

    const FnProspectos = () => {
        setState(s => ({ ...s }))
        Funciones.FNGet(props.oidc)
            .then((respuesta: any) => {
                var Prospecto = respuesta.map((valor: any) => {
                    var obj = { value: valor.ProspectoID, label: valor.NombreProspecto };
                    return obj
                });

                setState(s => ({ ...s, optProspecto: Prospecto }))
            })
            .catch(() => {
                setState(s => ({ ...s, optProspecto: [] }))
            })
    }

    const activoStyle = (row: any) => {
        return [
            {
                when: row => !row.Activo,
                style: { backgroundColor: '#ffb3b3', fontWeight: 'bold' },
            },
        ]
    }

    // Define the columns
    const Columns: IDataTableColumn[] =
        [
            {
                name: 'Id',
                selector: 'ProspectoID',
                sortable: true,
                center: true,
                width: '90px',
                cell: (props) =>
                    <div style={{ width: '100%', textAlign: 'center' }} className='LabelInDTable'>
                        <label style={{ fontSize: '.75em' }}>
                            {props.ProspectoID}
                        </label>
                    </div>,
                conditionalCellStyles: activoStyle(props)
            },
            {
                name: 'Asignar',
                selector: '',
                sortable: true,
                width: '90px',
                cell: (props) =>
                    <div className='radiusSmallDiv'>
                        {permisoAsignar && <div className={`divInDTable text-center ${props.AnalistaBuroID ?? 'pulsingButton'}`}>
                            <button data-tip data-for={`AA_${props.ProspectoID}`} className="btn btn-outline-default buttonIconInDTable" type={"button"} onClick={() => {
                                fnAsignacion(props)
                                setState(s => ({
                                    ...s,
                                    Form: {
                                        ...state.Form, Mostrar: true,
                                        Datos: { ProspectoID: props.ProspectoID, PersonaAnalistaID: props.AnalistaBuroID, Descripcion: props.Descripcion },
                                        Id: props.ProspectoID,
                                        IdAnalista: props.AnalistaBuroID
                                    }
                                }))
                                
                            }}>
                                <FaUserPlus color={`${props.AnalistaBuroID ? 'green' : 'gray'}`} size={props.AnalistaBuroID ? 30 : 15} />
                            </button>
                            <ReactTooltip id={`AA_${props.ProspectoID}`} type="info" effect="solid">
                                {props.AnalistaBuroID ? 'Re' : ''}Asignar Analista de Buro a {props.NombreProspecto}
                            </ReactTooltip>
                        </div>}
                    </div>,
                conditionalCellStyles: activoStyle(props)
            },
            {
                name: 'Asignada A', selector: 'NombreAnalistaBuro', sortable: true,
                width: '200px',
                cell: (props) =>
                    <>
                        {props.AnalistaBuroID && <div>
                            <label data-tip data-for={`A_${props.ProspectoID}`} className="LabelInDTable">
                                {props.NombreAnalistaBuro}
                            </label>
                            <ReactTooltip id={`A_${props.ProspectoID}`} type="info" effect="solid">
                                {props.NombreAnalistaBuro}
                            </ReactTooltip>
                        </div>}
                        {!props.AnalistaBuroID && <div style={{ width: '100%', textAlign: 'center' }}>
                            <span >-</span>
                        </div>}
                    </>,
                conditionalCellStyles: activoStyle(props)
            },

            {
                name: 'Notas', selector: '', sortable: true, center: true,
                width: '90px',
                cell: (props) =>
                    <>
                        <div className='notificacion'>
                            <div data-tip data-for={`N_${props.ProspectoID}`} className="divInDTable text-center radiusSmallDiv">
                                {<span className="badge">{props.MsjNoLeidosMesa}</span>}
                                <button onClick={() => fnMesajes(props.ProspectoID, props.NombreProspecto)} className="btn btn-outline-default buttonIconInDTable">   <FaStickyNote color={'#3e74ba'} size={15} /></button>
                            </div>
                            <ReactTooltip id={`N_${props.ProspectoID}`} type="info" effect="solid">
                                Notas o mensajes del prospecto {props.NombreProspecto} capturados por el analista
                            </ReactTooltip>
                        </div>
                    </>,
                conditionalCellStyles: activoStyle(props)
            },
            {
                name: 'Sucursal', selector: 'Nombre', sortable: true,
                width: '130px',
                cell: (props) =>
                    <>
                        <label data-tip data-for={`S_${props.ProspectoID}`} className="LabelInDTable">
                            {props.Nombre}
                        </label>
                        <ReactTooltip id={`S_${props.ProspectoID}`} type="info" effect="solid">
                            {props.Nombre}
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: activoStyle(props)
            },
            {
                name: 'Prospecto', selector: 'NombreProspecto', sortable: true, width: '200px',
                cell: (props) =>
                    <>
                        <label data-tip data-for={`P_${props.ProspectoID}`} className="LabelInDTable">
                            {props.NombreProspecto}
                        </label>
                        <ReactTooltip id={`P_${props.ProspectoID}`} type="info" effect="solid">
                            {props.NombreProspecto}
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: activoStyle(props)
            },
            {
                name: 'Tiempos',
                selector: '',
                sortable: false,
                center: true,
                width: '90px',
                cell: (props) =>
                    <>
                        <div data-tip data-for={`T_${props.ProspectoID}`} className="divInDTable text-center radiusSmallDiv">
                            <button onClick={() => fnTiempos(props.ProspectoID, props.NombreProspecto)} className="btn btn-outline-default buttonIconInDTable">   <FaClock color={'#3e74ba'} size={15} /></button>
                        </div>
                        <ReactTooltip id={`T_${props.ProspectoID}`} type="info" effect="solid">
                            Historial y acualizaciones del prospecto {props.NombreProspecto} en Mesa de Crédito
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: activoStyle(props)
            },
            {
                name: 'Consulta',
                selector: '',
                sortable: false,
                center: true,
                width: '120px',
                cell: (props) =>
                    <>
                        <span data-tip data-for={`E_${props.ProspectoID}`} className="divInDTable" style={{ fontSize: '.8em', fontStyle: 'italic' }}>
                            {props.EstatusConsultaBuroDesc}
                            {props.EstatusConsultaBuroID === 2 && <span style={{ color: 'green', fontWeight: 'bold', fontSize: '1.4em' }}>-OK</span>}
                            {props.EstatusConsultaBuroID === 4 && <span style={{ color: 'red', fontWeight: 'bold', fontSize: '1.4em' }}>!</span>}
                        </span>
                        <ReactTooltip id={`E_${props.ProspectoID}`} type="info" effect="solid">
                            Estatus de la consulta de buro del prospecto {props.NombreProspecto}
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: activoStyle(props)
            },
            {
                name: 'Dictamén',
                selector: '',
                sortable: true,
                center: true,
                width: '90px',
                cell: (props) =>
                    <>
                        <div data-tip data-for={`BC_${props.ProspectoID}`} className="divInDTable text-center radiusSmallDivR">
                            <button onClick={() => fnBuroDeCredito(props.ProspectoID, props.NombreProspecto, props.BuroInternoEstatusID, props.RevisionBuro, props.EstatusConsultaBuroID, props.EstatusConsultaBuroDesc)} className="btn btn-outline-default buttonIconInDTable" type={"button"}>
                                <FaFilePdf color={props.ColorRevisionBuro} size={[11].includes(props.StatusProcesoID) ? 30 : 15} /></button>
                        </div>
                        <ReactTooltip id={`BC_${props.ProspectoID}`} type="info" effect="solid">
                            Validación del Buró de Crédito del prospecto {props.NombreProspecto}
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: activoStyle(props)
            },
            {
                name: 'Archivar',
                selector: '',
                sortable: true,
                center: true,
                width: '90px',
                cell: (props) =>
                    <>
                        <div data-tip data-for={`AP_${props.ProspectoID}`} className="divInDTable text-center radiusSmallDivR">
                            <button onClick={() => setState(s => ({ ...s, ProspectoID: props.ProspectoID, nombreP: props.NombreProspecto, CFormArchivar: true }))}className="btn btn-outline-default buttonIconInDTable" type={"button"}>
                                <FaArrowDown style={{color:'#d00000'}} size={15} /></button>
                        </div>
                        <ReactTooltip id={`AP_${props.ProspectoID}`} type="info" effect="solid">
                            Archivar Prospecto {props.NombreProspecto}
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: activoStyle(props)
            },
        ]

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        FnGeTActivo()
        FnGetAnalistas()
        FnGetEstatusBuroDeCredito()
        FnSucursales()
        FnProspectos()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])


    React.useEffect(() => {
        FnFiltrando()
    }, [state.FiltroAnalista, state.FiltroSucursal, state.FiltroProspecto, startDate, endDate, state.FiltroConsolida, state.FiltroDictamen, state.FiltroActivo])


    // On use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        FnFiltrando()
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])


    //ACTUALIZA
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.ProspectoID === item.ProspectoID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { ProspectoID: 0, PersonaAnalistaID: 0 } } })

    const cbActualizarM = () => FNGetLocal()

    //FUNCION PARA CANCELAR LAS FORMAS
    const fnCancelar = () => setState(s => ({
        ...s, CForm: false, CFormM: false, CFormDocumentos: false, CFormConfirmar: false,
        CFormDocumentosAval: false, CFormConfirmarAval: false, CFormTiempos: false, CFormMensajes: false, CFormArchivar: false,
        CFormConfirmarTitular: false, Dictamen: false, CFormConfirmarBuroDeCredito: false, CFormBuroDeCredito: false,
        CFormConfirmaVerificaAval: false, Consolidacion: false, CFormConfirmarRefTitular: false, CFormConfirmarVerificaRefsAvales: false
    }))

    //FUNCION LOG TIEMPOS
    const fnTiempos = (ProspectoID: any, nombreP: any) => { setState(s => ({ ...s, ProspectoID: ProspectoID, nombreP: nombreP, CFormTiempos: true, Item: ProspectoID })) }

    //LOGMENSAJES
    const fnMesajes = (ProspectoID: any, nombreP: any) => { setState(s => ({ ...s, ProspectoID: ProspectoID, nombreP: nombreP, CFormMensajes: true, Item: state.Datos.find(D => D.ProspectoID === ProspectoID) })) }

    //FUNCION ASIGNACION
    const fnAsignacion = (Item: any) => setState(s => ({ ...s, CForm: true, Item }))

    //ABRIR FORMAS AL MOMENTO DE INICIAR UN PROCESO
    const formaCFormBuroDeCredito = () => { setState(s => ({ ...s, CFormBuroDeCredito: true })) }

    //BURO CREDITO
    const fnBuroDeCredito = (ProspectoID: any, NombreProspecto: string, BuroInternoEstatusID: number, RevisionBuro: number, EstatusConsultaBuroID: number, EstatusConsultaBuroDesc: string) => {
        setState(e => ({ ...e, CargandoOverlay: true }))
        Funciones.FNConfirmarBuroDeCredito(props.oidc, ProspectoID, 7)
            .then((respuesta: any) => {
                cbActualizar(respuesta) //Actualiza los Renglones
                if (RevisionBuro == 3) {

                    setState(s => ({ ...s, CargandoOverlay: false, CFormConfirmarBuroDeCredito: true, ProspectoID: ProspectoID, NombreProspecto: NombreProspecto, BuroInternoEstatusID: BuroInternoEstatusID, RevisionBuro: RevisionBuro, EstatusConsultaBuroID: EstatusConsultaBuroID, EstatusConsultaBuroDesc: EstatusConsultaBuroDesc, Item: ProspectoID }))
                }
                else {

                    setState(s => ({ ...s, CargandoOverlay: false, CFormBuroDeCredito: true, ProspectoID: ProspectoID, NombreProspecto: NombreProspecto, BuroInternoEstatusID: BuroInternoEstatusID, RevisionBuro: RevisionBuro, EstatusConsultaBuroID: EstatusConsultaBuroID, EstatusConsultaBuroDesc: EstatusConsultaBuroDesc, Item: ProspectoID }))
                }
            })
            .catch((error: any) => {
                console.log(error.response)
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                setState(e => ({ ...e, CargandoOverlay: false }))
            })
    }

    //ARCHIVAR PROSPECTO
    // const fnArchivarProspecto = (ProspectoID: any) => {
    //     MySwal.fire({
    //         title: "<strong>ARCHIVAR PROSPECTO</strong>",
    //         icon: "question",
    //         html: (
    //           <div className="text-center">
    //             Se archivara el prospecto ¿Desea continuar?
    //           </div>
    //         ),
    //         showCloseButton: false,
    //         showCancelButton: true,
    //         showConfirmButton: true,
    //         focusConfirm: false,
    //         cancelButtonText: "Cancelar",
    //         confirmButtonText: "Aceptar",
    //         confirmButtonAriaLabel: "Aceptar",
    //         cancelButtonAriaLabel: "",
    //       }).then((result) => {

    //         if (result.isConfirmed) {
    //             Funciones.FNArchivarProspecto(props.oidc, ProspectoID)
    //         .then((respuesta: any) => {
    //             cbActualizarM() //Actualiza los Renglones
    //             toast.success("PROSPECTO ARCHIVADO CORRECTAMENTE")
    //         })
    //         .catch((error: any) => {
    //             console.log(error.response)
    //             if (error.response)
    //                 toast.error(`Response Error: ${error.response.data}`)
    //             else if (error.request)
    //                 toast.error(`Request ${error}`)
    //             else
    //                 toast.error(`${error}`)
    //             setState(e => ({ ...e, CargandoOverlay: false }))
    //         })
    //         }
    //       });
      
    // }

    // AQUI EMPIEZAN LA PARTE DE LOS FILTROS
    const fnGetFiltrosAnalistas = (PersonaAnalistaID: number) => {
        console.log(PersonaAnalistaID)
        setState(s => ({ ...s, FiltroAnalista: PersonaAnalistaID }))
    }

    const fnGetFiltrosSucursales = (SucursalID: number) => {
        console.log(SucursalID)
        setState(s => ({ ...s, FiltroSucursal: SucursalID }))
    }


    const fnGetFiltrosProspecto = (ProspectoID: number) => {
        console.log(ProspectoID)
        setState(s => ({ ...s, FiltroProspecto: ProspectoID }))
    }

    const fnFiltroDictamen = (RevisionBuro: number) => {
        console.log(RevisionBuro)
        setState(s => ({ ...s, FiltroDictamen: RevisionBuro }))
    }
    const fnGetFiltrosEstatus = (Activo: number) => {
        console.log(Activo)
        setState(s => ({ ...s, FiltroActivo: Activo }))
    }

    const FnFiltrando = () => {
        let numFiltro = (state.FiltroAnalista + state.FiltroSucursal + state.FiltroProspecto + state.FiltroConsolida + state.FiltroDictamen + state.FiltroActivo)
        let datosFiltro = state.Datos
        if (numFiltro > 0)
            setState(s => ({ ...s, Filtrando: true }))
        else
            setState(s => ({ ...s, Filtrando: false }))

        if (state.FiltroAnalista > 0)
            datosFiltro = datosFiltro.filter(d => { return d.AnalistaBuroID === state.FiltroAnalista })

        if (state.FiltroSucursal > 0)
            datosFiltro = datosFiltro.filter(d => { return d.SucursalID === state.FiltroSucursal })

        if (state.FiltroProspecto > 0)
            datosFiltro = datosFiltro.filter(d => { return d.ProspectoID === state.FiltroProspecto })

        if (state.FiltroConsolida > 0)

            if (state.FiltroConsolida == 1) {
                datosFiltro = datosFiltro.filter(d => { return d.Consolidacion === 1 })
            }

        if (state.FiltroConsolida == 2) {
            datosFiltro = datosFiltro.filter(d => { return d.Dictamen === 1 })
        }

        if (state.FiltroConsolida == 3) {
            datosFiltro = datosFiltro.filter(d => { return d.Consolidacion === 3 })
            datosFiltro = datosFiltro.filter(d => { return d.Dictamen === 3 })
        }

        if (state.FiltroDictamen > 0)
            datosFiltro = datosFiltro.filter(d => { return d.RevisionBuro === state.FiltroDictamen })

        if (startDate != null && endDate != null) {
            startDate.setHours(0, 0, 0)
            endDate.setHours(23, 59, 59)
            datosFiltro = datosFiltro.filter(d => { return d.FechaAsignacionBuro >= startDate.toISOString() && d.FechaAsignacionBuro <= endDate.toISOString() || d.FechaAsignacionBuro === null })
        }
        if (state.FiltroActivo < 3 && state.FiltroActivo.toString() != undefined) {
            datosFiltro = datosFiltro.filter(d => { return d.Activo == state.FiltroActivo })
        }
        setState(s => ({ ...s, DatosMostrar: datosFiltro }))
    }

    const disableRow = (item: any) => {
        if (item.ColorRevisionBuro === "GREEN") {
            return true
        } else {
            return false
        }
    }

    const contextActions = React.useMemo(() => {
        return (
            <button type="button" className="ms-2 btn btn-primary waves-effect waves-light" onClick={() => setState(s => ({ ...s, CFormM: true }))}>
                <FaUserPlus size={20} /> ASIGNAR A ANALISTA
            </button>
        );
    }, [selectedRows]);

    return (
        <>
            {state.CargandoOverlay && <div className='overlay'>
                <div className='divOverlay'>
                    <Spinner />
                    <label >
                        CARGANDO ...
                    </label>
                </div>
            </div>}
            <div className="row ">
                <div className="col-12">
                    <Card Title="Revisión de Buro de Crédito">
                        <Card.Body>
                            <Card.Body.Content>
                                {state.Cargando && <Spinner />}
                                {state.Error && <span>Error al cargar los datos...</span>}
                                {!state.Cargando && !state.Error &&
                                    <div>

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

                                                                        <div style={{ height: '67px', width: '245px' }}>
                                                                            <ActionSelect
                                                                                disabled={false}
                                                                                label="Prospecto"
                                                                                name="ProspectoID"
                                                                                placeholder="TODOS"
                                                                                options={state.optProspecto}
                                                                                addDefault={true}
                                                                                valor={state.FiltroProspecto}
                                                                                accion={fnGetFiltrosProspecto}
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

                                                                        <div style={{ height: '67px', width: '245px' }}>
                                                                            <ActionSelect
                                                                                disabled={false}
                                                                                label="Dictamen"
                                                                                name="RevisionBuro"
                                                                                placeholder="TODOS"
                                                                                options={state.optDictamen}
                                                                                addDefault={true}
                                                                                valor={state.FiltroDictamen}
                                                                                accion={fnFiltroDictamen}
                                                                            />
                                                                        </div>
                                                                        <div style={{ height: '67px', width: '245px' }}>
                                                                            <CustomActionSelect
                                                                                disabled={false}
                                                                                label="Estatus."
                                                                                name="Activo"
                                                                                placeholder="TODOS"
                                                                                options={state.optActivo}
                                                                                addDefault={true}
                                                                                valor={state.FiltroActivo}
                                                                                accion={fnGetFiltrosEstatus}
                                                                            />
                                                                        </div>

                                                                    </div>
                                                                </Form>
                                                            </Formik>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <DataTable
                                            subHeader
                                            noDataComponent={<div style={{ margin: '4em' }}> {<><FaExclamationCircle color={'grey'} size={20} />  NO HAY SOLICITUDES </>}</div>}
                                            paginationComponentOptions={{ rowsPerPageText: 'Registros por pagina:', rangeSeparatorText: 'de', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'Todo' }}
                                            // subHeaderComponent=
                                            // {
                                            //     <div className="row" style={{ width: '102%' }}>
                                            //         <div className="col-sm-12">
                                            //             <div className="input-group mb-3" style={{ justifyContent: 'space-between' }}>
                                            //                 <div></div>
                                            //                 <div className="input-group mb-15" style={{ width: 'auto' }} >
                                            //                     {/* <input type="text" className="form-control" placeholder="Buscar Solicitud Credito" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} /> */}
                                            //                     {/* <span className="input-group-text"><FaSearch /> </span> */}
                                            //                     {/* <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button> */}
                                            //                 </div>
                                            //             </div>
                                            //         </div>
                                            //         <div className="col-sm-12">
                                            //             <div style={{ backgroundColor: '#F7F7F7', padding: '1em', borderRadius: '15px' }}>
                                            //                 <div>
                                            //                     <div style={{ float: 'right' }}>
                                            //                         <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
                                            //                     </div>
                                            //                     <div style={{ float: 'left' }}><FaFilter /></div>
                                            //                     <div ><label> FILTROS</label></div>
                                            //                 </div>

                                            //                 <div style={{ width: '100%', textAlign: 'center' }}>
                                            //                     <div style={{ display: 'inline-block' }}>

                                            //                         <Formik
                                            //                             initialValues={{}}
                                            //                             onSubmit={() => { }}
                                            //                         >
                                            //                             <Form>
                                            //                                 <div className="row" style={{ textAlign: 'initial' }}>

                                            //                                     <div style={{ height: '57px', width: '245px' }}>
                                            //                                         <ActionSelect
                                            //                                             disabled={false}
                                            //                                             label="Analistas"
                                            //                                             name="PersonaAnalistaID"
                                            //                                             placeholder="TODOS"
                                            //                                             options={state.optAnalistaPers}
                                            //                                             addDefault={true}
                                            //                                             valor={state.FiltroAnalista}
                                            //                                             accion={fnGetFiltrosAnalistas}
                                            //                                         />
                                            //                                     </div>

                                            //                                     <div style={{ height: '57px', width: '245px' }}>
                                            //                                         <ActionSelect
                                            //                                             disabled={false}
                                            //                                             label="Sucursales"
                                            //                                             name="SucursalID"
                                            //                                             placeholder="TODOS"
                                            //                                             options={state.optSucursales}
                                            //                                             addDefault={false}
                                            //                                             valor={state.FiltroSucursal}
                                            //                                             accion={fnGetFiltrosSucursales}
                                            //                                         />
                                            //                                     </div>

                                            //                                     <div style={{ height: '67px', width: '245px' }}>
                                            //                                         <ActionSelect
                                            //                                             disabled={false}
                                            //                                             label="Prospecto"
                                            //                                             name="ProspectoID"
                                            //                                             placeholder="TODOS"
                                            //                                             options={state.optProspecto}
                                            //                                             addDefault={true}
                                            //                                             valor={state.FiltroProspecto}
                                            //                                             accion={fnGetFiltrosProspecto}
                                            //                                         />
                                            //                                     </div>

                                            //                                     <div style={{ height: '67px', width: '140px' }}>
                                            //                                         <DatePickeStart
                                            //                                             name={'FechaInicio'}
                                            //                                             label={'FH Inicial Asign.'}
                                            //                                             disabled={loading}
                                            //                                             placeholder={'Inicio'}
                                            //                                             isClearable startDate={startDate}
                                            //                                             endDate={endDate}
                                            //                                             setStartDate={setStartDate}
                                            //                                         />
                                            //                                     </div>

                                            //                                     <div style={{ height: '67px', width: '140px' }}>
                                            //                                         <DatePickeEnd
                                            //                                             name={'FechaFinal'}
                                            //                                             label={'FH Final Asign.'}
                                            //                                             disabled={loading}
                                            //                                             placeholder={'Final'}
                                            //                                             isClearable startDate={startDate}
                                            //                                             endDate={endDate}
                                            //                                             setEndDate={setEndDate} />
                                            //                                     </div>

                                            //                                 </div>
                                            //                             </Form>
                                            //                         </Formik>
                                            //                     </div>
                                            //                 </div>
                                            //             </div>
                                            //         </div>
                                            //     </div>

                                            // }
                                            data={state.DatosMostrar}
                                            striped
                                            pagination
                                            dense
                                            selectableRows
                                            contextActions={contextActions}
                                            selectableRowDisabled={(row: any) => disableRow(row)}
                                            onSelectedRowsChange={handleRowSelected}
                                            contextMessage={{ singular: ' Prospecto seleccionado', plural: ' Prospectos seleccionados', message: '' }}
                                            title={<span>Lista de Prospectos</span>}
                                            responsive
                                            keyField={"ProspectoID"}
                                            defaultSortField={"FechaUltimaActualizacion"}
                                            defaultSortAsc={false}
                                            columns={Columns}
                                            paginationPerPage={10}
                                            style={{ paddingBottom: '2em', width: '100%' }}
                                            fixedHeaderScrollHeight={'fixed'}
                                        />

                                        {state.CForm && <AsignaAnalistaBuro
                                            oidc={props.oidc}
                                            initialValues={state.Form.Datos}
                                            Id={state.Form.Id}
                                            optAnalista={state.optAnalistaPers}
                                            cbActualizar={cbActualizar}
                                            fnCancelar={fnCancelar}
                                            Item={state.Item}
                                            mostrar={state.CForm}
                                        />}

                                        {state.CFormM && <AsignaAnalistaBuroM
                                            oidc={props.oidc}
                                            initialValues={state.Form.Datos}
                                            Id={state.Form.Id}
                                            optAnalista={state.optAnalistaPers}
                                            cbActualizar={cbActualizarM}
                                            fnCancelar={fnCancelar}
                                            Item={state.Item}
                                            selectedRows={selectedRows}
                                            mostrar={state.CFormM}
                                        />}

                                        {state.CFormTiempos && <CFormTiempos
                                            oidc={props.oidc}
                                            Id={state.Form.Id}
                                            Item={state.Item}
                                            mostrar={state.CFormTiempos}
                                            fnCancelar={fnCancelar}
                                            ProspectoID={state.ProspectoID}
                                            nombreP={state.nombreP}
                                        />}

                                        {state.CFormMensajes && <CFormMensajes
                                            oidc={props.oidc}
                                            Id={state.Form.Id}
                                            Item={state.Item}
                                            mostrar={state.CFormMensajes}
                                            fnCancelar={fnCancelar}
                                            ProspectoID={state.ProspectoID}
                                            nombreP={state.nombreP}
                                            cbActualizar={cbActualizar}
                                            TipoMesa={1}
                                        />}

                                        {state.CFormConfirmarBuroDeCredito && <CFormConfirmarBuroDeCredito
                                            oidc={props.oidc}
                                            Id={state.Form.Id}
                                            Item={state.Item}
                                            MostrarCFormConfirmar={state.CFormConfirmarBuroDeCredito}
                                            fnCancelar={fnCancelar}
                                            ProspectoID={state.ProspectoID}
                                            NombreProspecto={state.NombreProspecto}
                                            formaCFormBuroDeCredito={formaCFormBuroDeCredito}
                                            cbActualizar={cbActualizar}
                                        />}

                                        {state.CFormBuroDeCredito && <CFormBuroDeCredito
                                            oidc={props.oidc}
                                            ProspectoID={state.ProspectoID}
                                            NombreProspecto={state.NombreProspecto}
                                            MostrarCFormBuroDeCredito={state.CFormBuroDeCredito}
                                            fnCancelar={fnCancelar}
                                            cbActualizar={cbActualizar}
                                            optBuro={state.optBuro}
                                            BuroInternoEstatusID={state.BuroInternoEstatusID}
                                            RevisionBuro={state.RevisionBuro}
                                            EstatusConsultaBuroID={state.EstatusConsultaBuroID}
                                            EstatusConsultaBuroDesc={state.EstatusConsultaBuroDesc}
                                            item={state.Datos.find(D => D.ProspectoID === state.ProspectoID)}
                                        />}

                                        {state.CFormArchivar && <CFormArchivar
                                            oidc={props.oidc}
                                            fnCancelar={fnCancelar}
                                            ProspectoID={state.ProspectoID}
                                            nombreP={state.nombreP}
                                            initialValues={state.FormArchivar.Datos}
                                            actualizar={cbActualizarM}
                                        />}

                                        <div style={{ float: 'right' }}>
                                            <div style={{ float: 'left' }}>
                                                <div className='boxLegend' style={{ backgroundColor: '#3e74ba' }}></div>
                                                <span style={{ fontSize: '.8em' }}>INFORMACIÓN</span>
                                            </div>
                                            <div style={{ float: 'left' }}>
                                                <div className='boxLegend' style={{ backgroundColor: 'gray' }}></div>
                                                <span style={{ fontSize: '.8em' }}>NO COMENZADO</span>
                                            </div>
                                            <div style={{ float: 'left' }}>
                                                <div className='boxLegend' style={{ backgroundColor: 'goldenrod' }}></div>
                                                <span style={{ fontSize: '.8em' }}>PENDIENTE</span>
                                            </div>
                                            <div style={{ float: 'left' }}>
                                                <div className='boxLegend' style={{ backgroundColor: 'green' }}></div>
                                                <span style={{ fontSize: '.8em' }}>VALIDADO</span>
                                            </div>
                                            <div style={{ float: 'left' }}>
                                                <div className='boxLegend' style={{ backgroundColor: 'red' }}></div>
                                                <span style={{ fontSize: '.8em' }}>RECHAZADO</span>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
            </div >
        </>
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(RevisionBuro)