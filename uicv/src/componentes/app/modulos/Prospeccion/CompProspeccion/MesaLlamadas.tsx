//import React from 'react'
import React, { useState, useRef, useEffect } from 'react'
import moment, { now } from 'moment'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import { iUI } from '../../../../../interfaces/ui/iUI'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from '../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/Funciones'
import { toast } from 'react-toastify'
// Icons
import { FaMobileAlt, FaCopy, FaSearch, FaStickyNote, FaClock, FaFilePdf, FaMobile, FaFile, FaPhoneAlt, FaUserPlus, FaUserCheck, FaCheck, FaExclamationCircle, FaPhone, FaClipboardCheck } from 'react-icons/fa'
// Custom components
import { Card, Spinner, ActionSelect, DatePickeStart, DatePickeEnd, CustomActionSelect } from '../../../../global'
import { CForm } from '../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CForm'
import { CFormConfirmar } from '../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CFormConfirmar'
import { CFormTiempos } from '../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CFormTiempos'
import { CFormMensajes } from '../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CFormMensajes'
import { CFormVerificaTitular } from '../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CFormVerificaTitular'
import { CFormConfirmarTitular } from '../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CFormConfirmarTitular'
import { CFormConfirmaVerificaAval } from '../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CFormConfirmaVerificaAval'
import { CFormListaAvales } from '../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CFormListaAvales'
import { CFormConfirmarRefTitular } from './CatalogoMesaCreditoIndex/CFormConfirmarRefTitular'
import { CFormListaTitulares } from '../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CFormListaTitulares'
import { CFormConfirmarVerificaRefsAvales } from './CatalogoMesaCreditoIndex/CFormConfirmarVerificaRefsAvales'
import { CFormListaAvalesRefs } from '../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CFormListaAvalesRefs'

import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { CFormConfirmarAval } from '../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CFormConfirmarAval'
import ReactTooltip from 'react-tooltip'
import { FaFilter } from 'react-icons/fa'
import { Formik, Form } from 'formik'
import { AsignaAnalistaLlamadas } from './MesaLlamadas/AsignaAnalistaLlamadas'
import { AsignaAnalistaLlamadasM } from './MesaLlamadas/AsignaAnalistaLlamadasM'



type CatalogosType = {
    oidc: IOidc,
    Filtro: Number,
    ui: iUI,
}
const MesaLlamadas = (props: CatalogosType) => {

    // Controll our mounted state
    let isMounted = React.useRef(true)

    const [startDate, setStartDate] = useState(moment().add(-1, 'y').toDate());
    const [endDate, setEndDate] = useState(moment().toDate());

    // Basic variables
    const DatosDefecto = {
        ProspectoID: 0, PersonaAnalistaID: 0
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optAnalistaPers: any[] = []
    const optSucursales: any[] = []
    const optBuro: any[] = []
    const optActivo: any[] = []
    const optProceso: any[] = []
    const optProspecto: any[] = []
    const optConsolidado: any[] = []
    const optVerifTitular: any[] = []
    const optRefTitular: any[] = []
    const optVerifAval: any[] = []
    const optRefAval: any[] = []
    const FiltroActivo: number = 3
    const FiltroAnalista: number = 0
    const FiltroSucursal: number = 0
    const FiltroProceso: number = 0
    const FiltroProspecto: number = 0
    const FiltroConsolida: number = 0
    const FiltroVerifTitular: number = 0
    const FiltroRefTitular: number = 0
    const FiltroVerifAval: number = 0
    const FiltroRefAval: number = 0
    const [loading, setLoading] = React.useState(false)
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        optAnalistaPers,
        optSucursales,
        optProceso,
        optActivo,
        optBuro,
        optProspecto,
        optConsolidado,
        optVerifTitular,
        optRefTitular,
        optVerifAval,
        optRefAval,
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
        CForm: false, //Asignacion
        CFormM: false,
        CFormDocumentos: false,
        CFormConfirmar: false,
        CFormConfirmarAval: false,
        CFormDocumentosAval: false,
        CFormTiempos: false,
        CFormMensajes: false,
        CFormVerificaTitular: false,
        CFormConfirmarTitular: false,
        CFormConfirmaVerificaAval: false,
        CFormListaAvales: false,
        CFormAvalesProspectoInfo: false,
        CFormListaTitulares: false,
        RevisionBuro: 0,
        BuroInternoEstatusID: 0,
        EstatusConsultaBuroID: 0,
        EstatusConsultaBuroDesc: '',
        CFormConfirmarBuroDeCredito: false,
        CFormBuroDeCredito: false,
        CFormConfirmarRefTitular: false,
        CFormConfirmarVerificaRefsAvales: false,
        CFormListaAvalesRefs: false,
        Item: undefined,
        ProspectoID: 0,
        NombreProspecto: '',
        RevisionDocumentosAval: 0,
        RevisionDocumentos: 0,
        Id: undefined,
        nombreP: '',
        Dictamen: false,
        DictamenInfo: {
            Dictaminado: 0,
            DistribuidorNivelID: 0,
            DistribuidorNivel: '',
            Monto: 0.0,
            DistribuidoresEstatusID: 0,
            DistribuidoresEstatus: '',
            PersonaAnalistaID: 0,
            DistribuidorTiposID: 0,
            DistribuidorTipos: '',
        },
        Consolidacion: false,
        verificaTitularID: 0,
        VerificaTitular: 0,
        VerificaAval: 0,
        ObservacionVerificaAval: '',
        ObservacionRevisionRefTitular: '',
        RevisionRefTitular: 0,
        RevisionRefAval: 0,
        ObservacionRevisionRefAval: '',

        FiltroAnalista,
        FiltroSucursal,
        FiltroProceso,
        FiltroProspecto,
        FiltroActivo,
        FechaInicio: '',
        FechaFinal: '',
        FiltroConsolida,
        FiltroVerifTitular,
        FiltroRefTitular,
        FiltroVerifAval,
        FiltroRefAval,
        DatosProspe: {},
        flag: true,
    })

    const [selectedRows, setSelectedRows] = React.useState([]);

    const handleRowSelected = React.useCallback(state => {
        setSelectedRows(state.selectedRows);
    }, []);

    const permisoAsignar = props.ui.PermisosProductos?.find(p => p.PermisoID > 1)

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetLlamadas(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
                /*estatus proceso*/
                var dictamen = respuesta.map((valor: any) => {
                    var obj = { value: valor.StatusProcesoID, label: valor.Descripcion }
                    return obj
                })
                let DictamenOpt = dictamen.filter((obj, pos, arr) => {
                    return dictamen.map(mapObj => mapObj.value).indexOf(obj.value) === pos;
                })
                /*Verificacion titular*/
                var dictamenVT = respuesta.map((valor: any) => {
                    var obj = { value: valor.VerificaTitular, label: valor.ColorVerificaTitularDesc }
                    return obj
                })
                let VerifTitular = dictamenVT.filter((obj, pos, arr) => {
                    return dictamenVT.map(mapObj => mapObj.value).indexOf(obj.value) === pos;
                })
                /*Referencia titular*/
                var dictamenRF = respuesta.map((valor: any) => {
                    var obj = { value: valor.RevisionRefTitular, label: valor.ColorRevisionRefTitularDesc }
                    return obj
                })
                let RefTitular = dictamenRF.filter((obj, pos, arr) => {
                    return dictamenRF.map(mapObj => mapObj.value).indexOf(obj.value) === pos;
                })
                /*Verificacion titular*/
                var dictamenVA = respuesta.map((valor: any) => {
                    var obj = { value: valor.VerificaAval, label: valor.ColorVerificaAvalDesc }
                    return obj
                })
                let tVerifAval = dictamenVA.filter((obj, pos, arr) => {
                    return dictamenVA.map(mapObj => mapObj.value).indexOf(obj.value) === pos;
                })
                /*Referencia Aval*/
                var dictamenRA = respuesta.map((valor: any) => {
                    var obj = { value: valor.RevisionRefAval, label: valor.ColorRevisionRefAvalDesc }
                    return obj
                })
                let RefAval = dictamenRA.filter((obj, pos, arr) => {
                    return dictamenRA.map(mapObj => mapObj.value).indexOf(obj.value) === pos;
                })
                //


                setState(s => ({ ...s, optVerifTitular: VerifTitular }))
                setState(s => ({ ...s, optRefTitular: RefTitular }))
                setState(s => ({ ...s, optVerifAval: tVerifAval }))

                setState(s => ({ ...s, optRefAval: RefAval }))
                setState(s => ({ ...s, optProceso: DictamenOpt }))



            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
                setState(s => ({ ...s, optVerifTitular: [] }))
                setState(s => ({ ...s, optRefTitular: [] }))
                setState(s => ({ ...s, optVerifAval: [] }))
                setState(s => ({ ...s, optRefAval: [] }))
                setState(s => ({ ...s, optProceso: [] }))
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
                width: '6%',
                cell: (props) =>
                    <div style={{ width: '100%', textAlign: 'center' }} className='LabelInDTable'>
                        <label style={{ fontSize: '.75em' }}>
                            {props.ProspectoID}
                        </label>
                    </div>,
                conditionalCellStyles: activoStyle(props)

            },
            {
                name: 'Asigna',
                selector: '',
                sortable: true,
                width: '7%',
                cell: (props) =>
                    <div className='radiusSmallDiv'>
                        {permisoAsignar && <div className={`divInDTable text-center ${props.AnalistaLlamadasID ?? 'pulsingButton'}`}>
                            <button data-tip data-for={`AA_${props.ProspectoID}`} className="btn btn-outline-default buttonIconInDTable" type={"button"} onClick={() => {
                                fnAsignacion(props)
                                setState(s => ({
                                    ...s,
                                    Form: {
                                        ...state.Form, Mostrar: true,
                                        Datos: { ProspectoID: props.ProspectoID, PersonaAnalistaID: props.AnalistaLlamadasID, Descripcion: props.Descripcion },
                                        Id: props.ProspectoID,
                                        IdAnalista: props.AnalistaLlamadasID
                                    }
                                }))
                            }}>
                                <FaUserPlus color={props.AnalistaLlamadasID ? 'green' : 'gray'} size={[8, 9].includes(props.StatusProcesoID) ? 30 : 15} />
                            </button>
                            <ReactTooltip id={`AA_${props.ProspectoID}`} type="info" effect="solid">
                                {props.AnalistaLlamadasID ?? 'Re'}Asignar Analista a {props.NombreProspecto}
                            </ReactTooltip>
                        </div>}
                    </div>,
                conditionalCellStyles: activoStyle(props)
            },
            {
                name: 'Asignada A', selector: 'NombreAnalistaLlamadas', sortable: true,
                width: "13%",
                cell: (props) =>
                    <>
                        {props.AnalistaLlamadasID && <div>
                            <label data-tip data-for={`A_${props.ProspectoID}`} className="LabelInDTable" >
                                {props.NombreAnalistaLlamadas}
                            </label>
                            <ReactTooltip id={`A_${props.ProspectoID}`} type="info" effect="solid">
                                {props.NombreAnalistaLlamadas}
                            </ReactTooltip>
                        </div>}
                        {!props.AnalistaLlamadasID && <div style={{ width: '100%', textAlign: 'center' }}>
                            <span >-</span>
                        </div>}
                    </>,
                conditionalCellStyles: activoStyle(props)
            },
            {
                name: 'Notas', selector: '', sortable: true,
                width: "7%",
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
                width: "13%",
                cell: (props) =>
                    <>
                        <label data-tip data-for={`S_${props.ProspectoID}`} className="LabelInDTable" >
                            {props.Nombre}
                        </label>
                        <ReactTooltip id={`S_${props.ProspectoID}`} type="info" effect="solid">
                            {props.Nombre}
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: activoStyle(props)
            },
            {
                name: 'Prospecto', selector: 'NombreProspecto', sortable: true, width: "15%",
                cell: (props) =>
                    <>
                        <label data-tip data-for={`P_${props.ProspectoID}`} className="LabelInDTable" >
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
                width: "7%",
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
                name: 'Verif. Titular', selector: '', sortable: true, width: "8%", center: true,
                cell: (props) =>
                    <>
                        <div data-tip data-for={`VT_${props.ProspectoID}`} className="divInDTable text-center radiusSmallDivR">
                            <button onClick={() => fnConfirmacionTitular(props.ProspectoID, props.NombreProspecto, props.VerificaTitular)} className="btn btn-outline-default buttonIconInDTable">
                                <FaMobileAlt color={props.ColorVerificaTitular} size={[14].includes(props.StatusProcesoID) ? 30 : 15} /></button>
                        </div>
                        <ReactTooltip id={`VT_${props.ProspectoID}`} type="info" effect="solid">
                            Validación del prospecto {props.NombreProspecto}
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: activoStyle(props)
            },
            {
                name: 'Ref. Titular', selector: '', sortable: true, width: "8%", center: true,
                cell: (props) =>
                    <>
                        <div data-tip data-for={`RT_${props.ProspectoID}`} className="divInDTable text-center radiusSmallDivR">
                            <button className="btn btn-outline-default buttonIconInDTable" type={"button"} onClick={() => fnConfirmaVerificaRefTitular(props.ProspectoID, props.NombreProspecto, props.RevisionRefTitular, props.ObservacionRevisionRefTitular)} >
                                <FaPhoneAlt color={props.ColorRevisionRefTitular} size={[12].includes(props.StatusProcesoID) ? 30 : 15} />
                            </button>
                        </div>
                        <ReactTooltip id={`RT_${props.ProspectoID}`} type="info" effect="solid">
                            Validación de las Referencias del prospecto {props.NombreProspecto}
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: activoStyle(props)
            },
            {
                name: 'Verif. Avales', selector: '', sortable: true, width: "8%", center: true,
                cell: (props) =>
                    <>
                        <div data-tip data-for={`VA_${props.ProspectoID}`} className="divInDTable text-center radiusSmallDivR">
                            <button className="btn btn-outline-default buttonIconInDTable" type={"button"} onClick={() => fnConfirmaVerificaAval(props.ProspectoID, props.NombreProspecto, props.VerificaAval, props.ObservacionVerificaAval)} >
                                <FaMobile color={props.ColorVerificaAval} size={[15].includes(props.StatusProcesoID) ? 30 : 15} />
                            </button>
                        </div>
                        <ReactTooltip id={`VA_${props.ProspectoID}`} type="info" effect="solid">
                            Validación de los Avales del prospecto {props.NombreProspecto}
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: activoStyle(props)
            },
            {
                name: 'Ref. Avales', selector: '', sortable: true, width: "8%", center: true,
                cell: (props) =>
                    <>
                        <div data-tip data-for={`RA_${props.ProspectoID}`} className="divInDTable text-center radiusSmallDivR">
                            <button className="btn btn-outline-default buttonIconInDTable" type={"button"} onClick={() => fnConfirmaVerificaRefAval(props.ProspectoID, props.NombreProspecto, props.RevisionRefAval, props.ObservacionRevisionRefAval)} >
                                <FaPhoneAlt color={props.ColorRevisionRefAval} size={[13].includes(props.StatusProcesoID) ? 30 : 15} />
                            </button>
                        </div>
                        <ReactTooltip id={`RA_${props.ProspectoID}`} type="info" effect="solid">
                            Validación de las Referencias de los Avales del prospecto {props.NombreProspecto}
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: activoStyle(props)
            }
        ]

    // Use effect
    React.useEffect(() => {
        
        
        FNGetLocal()
        FnGeTActivo()
        FnGetAnalistas()
        FnSucursales()
        FnProspectos()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])


    React.useEffect(() => {
        FnFiltrando()
    }, [state.FiltroAnalista, state.FiltroSucursal, state.FiltroProceso, state.FiltroProspecto, startDate, endDate, state.FiltroConsolida, state.FiltroVerifTitular, state.FiltroRefTitular, state.FiltroVerifAval, state.FiltroRefAval, state.FiltroActivo])


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
        CFormDocumentosAval: false, CFormConfirmarAval: false, CFormTiempos: false, CFormMensajes: false,
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
    const formaCFormDocumentos = () => { setState(s => ({ ...s, CFormDocumentos: true })) }
    const formaCFormDocumentosAval = () => { setState(s => ({ ...s, CFormDocumentosAval: true })) }
    const formaCFormVerificaTitular = () => { setState(s => ({ ...s, CFormVerificaTitular: true })) }
    const formaCFormListaAvales = () => { setState(s => ({ ...s, CFormListaAvales: true })) }
    const formaCFormListaTitulares = () => { setState(s => ({ ...s, CFormListaTitulares: true })) }
    const formaCFormListaAvalesRefs = () => { setState(s => ({ ...s, CFormListaAvalesRefs: true })) }


    //VERIFICA TITULAR
    const fnCancelarVerifica = () => setState(s => ({ ...s, CFormVerificaTitular: false }))

    const fnConfirmacionTitular = (ProspectoID: any, NombreProspecto: string, VerificaTitular: number) => {
        setState(e => ({ ...e, CargandoOverlay: true }))
        Funciones.FNupdateProcesoTitular(props.oidc, ProspectoID, 3)
            .then((respuesta: any) => {
                cbActualizar(respuesta) //Actualiza los Renglones
                if (VerificaTitular == 3) {
                    setState(s => ({ ...s, CargandoOverlay: false, CFormConfirmarTitular: true, ProspectoID: ProspectoID, NombreProspecto: NombreProspecto, VerificaTitular: VerificaTitular, Item: ProspectoID }))
                }
                else {
                    setState(s => ({ ...s, CargandoOverlay: false, CFormVerificaTitular: true, ProspectoID: ProspectoID, NombreProspecto: NombreProspecto, VerificaTitular: VerificaTitular, Item: ProspectoID }))
                }
            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                setState(e => ({ ...e, CargandoOverlay: false }))
            })
    }

    //VERIFICA AVAL
    const fnCancelarListaAvales = () => setState(s => ({ ...s, CFormListaAvales: false }))

    const fnConfirmaVerificaAval = (ProspectoID: any, NombreProspecto: string, VerificaAval: number, ObservacionVerificaAval: string) => {
        setState(e => ({ ...e, CargandoOverlay: true }))
        Funciones.FNupdateProcesoAval(props.oidc, ProspectoID, 9)
            .then((respuesta: any) => {
                cbActualizar(respuesta) //Actualiza los Renglones
                if (VerificaAval == 3) {
                    setState(s => ({ ...s, CargandoOverlay: false, CFormConfirmaVerificaAval: true, ProspectoID: ProspectoID, NombreProspecto: NombreProspecto, VerificaAval: VerificaAval, ObservacionVerificaAval: ObservacionVerificaAval, Item: ProspectoID }))
                }
                else {
                    setState(s => ({ ...s, CargandoOverlay: false, CFormListaAvales: true, ProspectoID: ProspectoID, NombreProspecto: NombreProspecto, VerificaAval: VerificaAval, ObservacionVerificaAval: ObservacionVerificaAval, Item: ProspectoID }))
                }
            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                setState(e => ({ ...e, CargandoOverlay: false }))
            })
    }

    //VERIFICA REF TIT
    const fnCancelarRefTitular = () => setState(s => ({ ...s, CFormListaTitulares: false }))

    const fnConfirmaVerificaRefTitular = (ProspectoID: any, NombreProspecto: string, RevisionRefTitular: number, ObservacionRevisionRefTitular: string) => {
        setState(e => ({ ...e, CargandoOverlay: true }))
        Funciones.FNupdateProcesoRefTitular(props.oidc, ProspectoID, 11)
            .then((respuesta: any) => {
                cbActualizar(respuesta) //Actualiza los Renglones
                //setState(s => ({ ...s, ProspectoID: ProspectoID, NombreProspecto: NombreProspecto, RevisionRefTitular: RevisionRefTitular }))
                if (RevisionRefTitular == 3) {
                    setState(s => ({ ...s, CargandoOverlay: false, CFormConfirmarRefTitular: true, ProspectoID: ProspectoID, NombreProspecto: NombreProspecto, RevisionRefTitular: RevisionRefTitular, ObservacionRevisionRefTitular: ObservacionRevisionRefTitular, Item: ProspectoID }))
                }
                else {
                    setState(s => ({ ...s, CargandoOverlay: false, CFormListaTitulares: true, ProspectoID: ProspectoID, NombreProspecto: NombreProspecto, RevisionRefTitular: RevisionRefTitular, Item: ProspectoID, ObservacionRevisionRefTitular: ObservacionRevisionRefTitular }))
                }
            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                setState(e => ({ ...e, CargandoOverlay: false }))
            })
    }

    //VERIFICA REF AVALES
    const fnCerrarListaAvalesRefs = () => setState(s => ({ ...s, CFormListaAvalesRefs: false }))

    const fnConfirmaVerificaRefAval = (ProspectoID: any, NombreProspecto: string, RevisionRefAval: number, ObservacionRevisionRefAval: string) => {
        setState(e => ({ ...e, CargandoOverlay: true }))
        Funciones.FNupdateProcesoAval(props.oidc, ProspectoID, 13)
            .then((respuesta: any) => {
                cbActualizar(respuesta) //Actualiza los Renglones
                //setState(s => ({ ...s, ProspectoID: ProspectoID, NombreProspecto: NombreProspecto, RevisionRefAval: RevisionRefAval, ObservacionRevisionRefAval: ObservacionRevisionRefAval, Item: ProspectoID }))
                if (RevisionRefAval == 3) {
                    setState(s => ({ ...s, CargandoOverlay: false, CFormConfirmarVerificaRefsAvales: true, ProspectoID: ProspectoID, NombreProspecto: NombreProspecto, RevisionRefAval: RevisionRefAval, ObservacionRevisionRefAval: ObservacionRevisionRefAval, Item: ProspectoID }))
                }
                else {
                    setState(s => ({ ...s, CargandoOverlay: false, CFormListaAvalesRefs: true, ProspectoID: ProspectoID, NombreProspecto: NombreProspecto, RevisionRefAval: RevisionRefAval, ObservacionRevisionRefAval: ObservacionRevisionRefAval, Item: ProspectoID }))
                }
            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                setState(e => ({ ...e, CargandoOverlay: false }))
            })
    }

    // AQUI EMPIEZAN LA PARTE DE LOS FILTROS
    const fnGetFiltrosAnalistas = (PersonaAnalistaID: number) => {
        console.log(PersonaAnalistaID)
        setState(s => ({ ...s, FiltroAnalista: PersonaAnalistaID }))
    }

    const fnGetFiltrosSucursales = (SucursalID: number) => {
        console.log(SucursalID)
        setState(s => ({ ...s, FiltroSucursal: SucursalID }))
    }
    const fnFiltroProceso = (StatusProcesoID: number) => {
        setState(s => ({ ...s, FiltroProceso: StatusProcesoID }))
    }

    const fnGetFiltrosProspecto = (ProspectoID: number) => {
        console.log(ProspectoID)
        setState(s => ({ ...s, FiltroProspecto: ProspectoID }))
    }

    const fnGetFiltrosVerifTitular = (VerificaTitular: number) => {
        console.log(VerificaTitular)
        setState(s => ({ ...s, FiltroVerifTitular: VerificaTitular }))
    }

    const fnGetFiltrosReftTitular = (RevisionRefTitular: number) => {
        console.log(RevisionRefTitular)
        setState(s => ({ ...s, FiltroRefTitular: RevisionRefTitular }))
    }

    const fnGetFiltrosVeriAval = (VerificaAval: number) => {
        console.log(VerificaAval)
        setState(s => ({ ...s, FiltroVerifAval: VerificaAval }))
    }
    const fnGetFiltrosRefAval = (RevisionRefAval: number) => {
        console.log(RevisionRefAval)
        setState(s => ({ ...s, FiltroRefAval: RevisionRefAval }))
    }
    const fnGetFiltrosEstatus = (Activo: number) => {
        console.log(Activo)
        setState(s => ({ ...s, FiltroActivo: Activo }))
    }

    const FnFiltrando = () => {
        let numFiltro = (state.FiltroAnalista + state.FiltroSucursal + state.FiltroProceso + state.FiltroProspecto + state.FiltroConsolida + state.FiltroVerifTitular + state.FiltroRefTitular + state.FiltroVerifAval + state.FiltroRefAval + state.FiltroActivo)
        let datosFiltro = state.Datos
        if (numFiltro > 0)
            setState(s => ({ ...s, Filtrando: true }))
        else
            setState(s => ({ ...s, Filtrando: false }))

        if (state.FiltroAnalista > 0)
            datosFiltro = datosFiltro.filter(d => { return d.PersonaAnalistaID === state.FiltroAnalista })

        if (state.FiltroSucursal > 0)
            datosFiltro = datosFiltro.filter(d => { return d.SucursalID === state.FiltroSucursal })

        if (state.FiltroProceso > 0)
            datosFiltro = datosFiltro.filter(d => { return d.StatusProcesoID === state.FiltroProceso })

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

        if (startDate != null && endDate != null) {
            startDate.setHours(0, 0, 0)
            endDate.setHours(23, 59, 59)
            datosFiltro = datosFiltro.filter(d => { return d.FechaAsignacion >= startDate.toISOString() && d.FechaAsignacion <= endDate.toISOString() || d.FechaAsignacion === null })
        }

        if (state.FiltroVerifTitular > 0)
            datosFiltro = datosFiltro.filter(d => { return d.VerificaTitular === state.FiltroVerifTitular })

        if (state.FiltroRefTitular > 0)
            datosFiltro = datosFiltro.filter(d => { return d.RevisionRefTitular === state.FiltroRefTitular })

        if (state.FiltroVerifAval > 0)
            datosFiltro = datosFiltro.filter(d => { return d.VerificaAval === state.FiltroVerifAval })

        if (state.FiltroRefAval > 0)
            datosFiltro = datosFiltro.filter(d => { return d.RevisionRefAval === state.FiltroRefAval })

        if (state.FiltroActivo < 3 && state.FiltroActivo.toString() != undefined) {
            datosFiltro = datosFiltro.filter(d => { return d.Activo == state.FiltroActivo })
        }

        setState(s => ({ ...s, DatosMostrar: datosFiltro }))
    }

    const disableRow = (item: any) => {
        if (item.ColorVerificaTitular === "GREEN" && item.ColorRevisionRefTitular === "GREEN" && item.ColorVerificaAval === "GREEN" && item.ColorRevisionRefAval === "GREEN") {
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
                    <Card Title="Mesa De Verificación y Llamadas">
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

                                                                        <div style={{ height: '57px', width: '245px' }}>
                                                                            <ActionSelect
                                                                                disabled={false}
                                                                                label="Verif. Titular"
                                                                                name="VerificaTitular"
                                                                                placeholder="TODOS"
                                                                                options={state.optVerifTitular}
                                                                                addDefault={true}
                                                                                valor={state.FiltroVerifTitular}
                                                                                accion={fnGetFiltrosVerifTitular}
                                                                            />
                                                                        </div>
                                                                        <div style={{ height: '57px', width: '245px' }}>
                                                                            <ActionSelect
                                                                                disabled={false}
                                                                                label="Ref. Titular"
                                                                                name="StatusProcesoID"
                                                                                placeholder="TODOS"
                                                                                options={state.optRefTitular}
                                                                                addDefault={true}
                                                                                valor={state.FiltroRefTitular}
                                                                                accion={fnGetFiltrosReftTitular}
                                                                            />
                                                                        </div>
                                                                        <div style={{ height: '57px', width: '245px' }}>
                                                                            <ActionSelect
                                                                                disabled={false}
                                                                                label="Verif. Avales"
                                                                                name="VerificaAval"
                                                                                placeholder="TODOS"
                                                                                options={state.optVerifAval}
                                                                                addDefault={true}
                                                                                valor={state.FiltroVerifAval}
                                                                                accion={fnGetFiltrosVeriAval}
                                                                            />
                                                                        </div>
                                                                        <div style={{ height: '57px', width: '245px' }}>
                                                                            <ActionSelect
                                                                                disabled={false}
                                                                                label="Ref. Avales"
                                                                                name="StatusProcesoID"
                                                                                placeholder="TODOS"
                                                                                options={state.optRefAval}
                                                                                addDefault={true}
                                                                                valor={state.FiltroRefAval}
                                                                                accion={fnGetFiltrosRefAval}
                                                                            />
                                                                        </div>

                                                                        <div style={{ height: '57px', width: '245px' }}>
                                                                            <ActionSelect
                                                                                disabled={false}
                                                                                label="Proceso Actual"
                                                                                name="StatusProcesoID"
                                                                                placeholder="TODOS"
                                                                                options={state.optProceso}
                                                                                addDefault={true}
                                                                                valor={state.FiltroProceso}
                                                                                accion={fnFiltroProceso}
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
                                            subHeaderComponent={
                                                <span style={{color: 'red'}}>*Recargar la pagina cuando se hayan validado todos los campos de un prospecto</span>
                                            }
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
                                        {state.CForm && <AsignaAnalistaLlamadas
                                            oidc={props.oidc}
                                            initialValues={state.Form.Datos}
                                            Id={state.Form.Id}
                                            optAnalista={state.optAnalistaPers}
                                            cbActualizar={cbActualizar}
                                            fnCancelar={fnCancelar}
                                            Item={state.Item}
                                            mostrar={state.CForm}
                                        />}

                                        {state.CFormM && <AsignaAnalistaLlamadasM
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

                                        {state.CFormConfirmar && <CFormConfirmar
                                            oidc={props.oidc}
                                            Id={state.Form.Id}
                                            Item={state.Item}
                                            MostrarCFormConfirmar={state.CFormConfirmar}
                                            fnCancelar={fnCancelar}
                                            ProspectoID={state.ProspectoID}
                                            NombreProspecto={state.NombreProspecto}
                                            formaCFormDocumentos={formaCFormDocumentos}
                                            cbActualizar={cbActualizar}
                                        />}

                                        {state.CFormConfirmarAval && <CFormConfirmarAval
                                            oidc={props.oidc}
                                            Id={state.Form.Id}
                                            Item={state.Item}
                                            MostrarCFormConfirmar={state.CFormConfirmarAval}
                                            fnCancelar={fnCancelar}
                                            ProspectoID={state.ProspectoID}
                                            NombreProspecto={state.NombreProspecto}
                                            formaCFormDocumentosAval={formaCFormDocumentosAval}
                                            cbActualizar={cbActualizar}
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
                                            TipoMesa={3}
                                        />}

                                        {state.CFormVerificaTitular && <CFormVerificaTitular
                                            oidc={props.oidc}
                                            Id={state.Form.Id}
                                            Item={state.Item}
                                            mostrar={state.CFormVerificaTitular}
                                            fnCancelarVerifca={fnCancelar}
                                            fnCancelarVerificaModal={fnCancelarVerifica}
                                            ProspectoID={state.ProspectoID}
                                            nombreP={state.NombreProspecto}
                                            flag={state.flag}
                                            cbActualizar={cbActualizar}
                                            VerificaTitular={state.VerificaTitular}
                                        />}

                                        {state.CFormConfirmarTitular && <CFormConfirmarTitular
                                            oidc={props.oidc}
                                            Id={state.Form.Id}
                                            Item={state.Item}
                                            MostrarCFormConfirmarTitular={state.CFormConfirmarTitular}
                                            fnCancelar={fnCancelar}
                                            ProspectoID={state.ProspectoID}
                                            NombreProspecto={state.NombreProspecto}
                                            //fnTitular={fnVerificarTitular}
                                            cbActualizar={cbActualizar}
                                            formaCFormVerificaTitular={formaCFormVerificaTitular}

                                        />}


                                        {state.CFormConfirmaVerificaAval && <CFormConfirmaVerificaAval
                                            oidc={props.oidc}
                                            Id={state.Form.Id}
                                            Item={state.Item}
                                            MostrarCFormConfirmaVerificaAval={state.CFormConfirmaVerificaAval}
                                            fnCancelar={fnCancelar}
                                            ProspectoID={state.ProspectoID}
                                            NombreProspecto={state.NombreProspecto}
                                            //fnVerificarAval={fnVerificarAval}
                                            cbActualizar={cbActualizar}
                                            formaCFormListaAvales={formaCFormListaAvales}
                                        />}
                                        {state.CFormListaAvales && <CFormListaAvales
                                            oidc={props.oidc}
                                            Id={state.Form.Id}
                                            Item={state.Item}
                                            mostrar={state.CFormListaAvales}
                                            fnCancelarListaAvales={fnCancelarListaAvales}
                                            ProspectoID={state.ProspectoID}
                                            nombreP={state.NombreProspecto}
                                            flag={state.flag}
                                            cbActualizar={cbActualizar}
                                            VerificaAval={state.VerificaAval}
                                            ObservacionVerificaAval={state.ObservacionVerificaAval}
                                        />}


                                        {state.CFormConfirmarRefTitular && <CFormConfirmarRefTitular
                                            oidc={props.oidc}
                                            Id={state.Form.Id}
                                            Item={state.Item}
                                            MostrarCFormConfirmarRefTitular={state.CFormConfirmarRefTitular}
                                            fnCancelar={fnCancelar}
                                            ProspectoID={state.ProspectoID}
                                            NombreProspecto={state.NombreProspecto}
                                            //fnVerificarRef={fnVerificarRefTitular}
                                            cbActualizar={cbActualizar}
                                            formaCFormListaTitulares={formaCFormListaTitulares}
                                        />}

                                        {state.CFormListaTitulares && <CFormListaTitulares
                                            oidc={props.oidc}
                                            Id={state.Form.Id}
                                            Item={state.Item}
                                            mostrar={state.CFormListaTitulares}
                                            fnCancelarListaRefTirulares={fnCancelarRefTitular}
                                            ProspectoID={state.ProspectoID}
                                            nombreP={state.NombreProspecto}
                                            flag={state.flag}
                                            cbActualizar={cbActualizar}
                                            RevisionRefTitular={state.RevisionRefTitular}
                                            ObservacionRevisionRefTitular={state.ObservacionRevisionRefTitular}
                                        />}
                                        {state.CFormConfirmarVerificaRefsAvales && <CFormConfirmarVerificaRefsAvales
                                            oidc={props.oidc}
                                            Id={state.Form.Id}
                                            Item={state.Item}
                                            MostrarCFormConfirmarVerificaRefsAvales={state.CFormConfirmarVerificaRefsAvales}
                                            fnCancelar={fnCancelar}
                                            ProspectoID={state.ProspectoID}
                                            NombreProspecto={state.NombreProspecto}
                                            //fnVerificarRef={fnVerificarRefAval}
                                            cbActualizar={cbActualizar}
                                            formaCFormListaAvalesRefs={formaCFormListaAvalesRefs}
                                        />}

                                        {state.CFormListaAvalesRefs && <CFormListaAvalesRefs
                                            oidc={props.oidc}
                                            Id={state.Form.Id}
                                            Item={state.Item}
                                            mostrar={state.CFormListaAvalesRefs}
                                            fnCerrarListaAvalesRefs={fnCerrarListaAvalesRefs}
                                            ProspectoID={state.ProspectoID}
                                            nombreP={state.NombreProspecto}
                                            flag={state.flag}
                                            cbActualizar={cbActualizar}
                                            RevisionRefAval={state.RevisionRefAval}
                                            ObservacionRevisionRefAval={state.ObservacionRevisionRefAval}
                                        //fnVerificarAval={fnVerificarRefAval}
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
export default connect(mapStateToProps, mapDispatchToProps)(MesaLlamadas)