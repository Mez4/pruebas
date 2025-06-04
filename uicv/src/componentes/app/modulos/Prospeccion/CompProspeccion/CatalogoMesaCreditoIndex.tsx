//import React from 'react'
import React, { useState, useRef, useEffect } from 'react'
import moment, { now } from 'moment'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import { iUI } from '../../../../../interfaces/ui/iUI'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from '../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import { toast } from 'react-toastify'
import DatePicker, { registerLocale } from "react-datepicker"
// Icons
import { FaMobileAlt, FaCopy, FaSearch, FaStickyNote, FaClock, FaFilePdf, FaMobile, FaFile, FaPhoneAlt, FaUserPlus, FaUserCheck, FaCheck, FaExclamationCircle, FaPhone, FaClipboardCheck, FaArrowDown } from 'react-icons/fa'
// Custom components
import { Card, Spinner, ActionSelect, DatePickeStart, DatePickeEnd, CustomActionSelect } from '../../../../global'
import { CForm } from '../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CForm'
import { CFormDocumentos } from '../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CFormDocumentos'
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
import { date, number } from '../../../../../global/idiomaValidacion.bak'
import prospecto from './Prospectos/prospecto'
import { stat } from 'fs'
import { CFormConfirmarAval } from '../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CFormConfirmarAval'
import { CFormDocumentosAval } from '../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CFormDocumentosAval'
import { CFormConfirmarBuroDeCredito } from '../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CFormConfirmaBuroDeCredito'
import { CFormBuroDeCredito } from '../../Prospeccion/CompProspeccion/CatalogoMesaCreditoIndex/CFormBuroDeCredito'
import ReactTooltip from 'react-tooltip'
import { DictamenProspecto } from './CatalogoMesaCreditoIndex/Dictamen'
import { ConsolidaProspecto } from './CatalogoMesaCreditoIndex/Consolidacion'

import { BuroInternoEstatus } from '../../catalogos/CompCatalogos'
import { FaFilter } from 'react-icons/fa'
import { Formik, Form } from 'formik'
import { Console } from 'console'
import { AsignaAnalistaM } from './CatalogoMesaCreditoIndex/CFormAsignaM'
import { CFormArchivar } from './CatalogoMesaCreditoIndex/CFormArchivar'



type CatalogosType = {
    oidc: IOidc,
    Filtro: Number,
    ui: iUI,
}
const CatalogoMesaCreditoIndex = (props: CatalogosType) => {

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
    const optProceso: any[] = []
    const optProspecto: any[] = []
    const optConsolidado: any[] = []
    const optDictamenBuro: any[] = []
    const optDictamenBuroFile: any[] = []
    const optDictamenValidacion: any[] = []
    const optDictamenConsolidacion: any[] = []
    const FiltroActivo: number = 3
    const FiltroAnalista: number = 0
    const FiltroSucursal: number = 0
    const FiltroProceso: number = 0
    const FiltroProspecto: number = 0
    const FiltroConsolida: number = 0
    const FiltroDisctamenBuro: number = 0
    const FiltroDisctamenBuroFile: number = 0
    const FiltroDisctamenValidacion: number = 0
    const FiltroDisctamenConsolidacion: number = 0

    const [loading, setLoading] = React.useState(false)
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        optAnalistaPers,
        optSucursales,
        optProceso,
        optBuro,
        optActivo,
        optProspecto,
        optConsolidado,
        optDictamenBuro,
        optDictamenBuroFile,
        optDictamenValidacion,
        optDictamenConsolidacion,
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
        CFormArchivar: false,
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
            Activo: true,
            NivelOrigen_BuroID: 0
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
        FechaInicio: '',
        FechaFinal: '',
        FiltroActivo,
        FiltroConsolida,
        FiltroDisctamenBuro,
        FiltroDisctamenBuroFile,
        FiltroDisctamenValidacion,
        FiltroDisctamenConsolidacion,
        DatosProspe: {},
        flag: true,
    })

    const [selectedRows, setSelectedRows] = React.useState([]);
    const [FormListener, setListener] = React.useState<boolean>(true)
    const handleRowSelected = React.useCallback(state => {
        setSelectedRows(state.selectedRows);
    }, []);

    const permisoAsignar = props.ui.PermisosProductos?.find(p => p.PermisoID > 1)
    const permisoActivar = props.ui.PermisosProductos?.find(p => p.PermisoID > 1)

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc)
            .then((respuesta: any) => {
                console.log(respuesta);

                setListener(false)
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
                //filtro dictamen
                var Dictamen = respuesta.map((valor: any) => {
                    var obj = { value: valor.BuroInternoEstatusID, label: valor.BuroInternoEstatus }
                    return obj
                })
                let DictamenOpt = Dictamen.filter((obj, pos, arr) => {
                    return Dictamen.map(mapObj => mapObj.value).indexOf(obj.value) === pos;
                })
                //filtro expediente
                var DictamenBuro = respuesta.map((valor: any) => {
                    var obj = { value: valor.RevisionDocumentos, label: valor.ColorRevisionDocumentosDesc }
                    return obj
                })
                let DictamenBuroOpt = DictamenBuro.filter((obj, pos, arr) => {
                    return DictamenBuro.map(mapObj => mapObj.value).indexOf(obj.value) === pos;
                })
                //validacion    
                var DictamenVal = respuesta.map((valor: any) => {
                    var obj = { value: valor.Dictamen, label: valor.ColorDictamenDesc }
                    return obj
                })
                let DictamenValidacion = DictamenVal.filter((obj, pos, arr) => {
                    return DictamenVal.map(mapObj => mapObj.value).indexOf(obj.value) === pos;
                })
                //Consolidacion/Activacion    
                var DictamenConsolida = respuesta.map((valor: any) => {
                    var obj = { value: valor.Consolidacion, label: valor.ColorConsolidacionDesc }
                    return obj
                })
                let DictamenConsolidacion = DictamenConsolida.filter((obj, pos, arr) => {
                    return DictamenConsolida.map(mapObj => mapObj.value).indexOf(obj.value) === pos;
                })

                setState(s => ({ ...s, optDictamenBuro: DictamenOpt }))
                setState(s => ({ ...s, optDictamenBuroFile: DictamenBuroOpt }))
                setState(s => ({ ...s, optDictamenValidacion: DictamenValidacion }))
                setState(s => ({ ...s, optDictamenConsolidacion: DictamenConsolidacion }))
                setListener(true)
            })
            .catch(() => {
                setListener(true)
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
                setState(s => ({ ...s, optDictamenBuro: [] }))
                setState(s => ({ ...s, optDictamenBuroFile: [] }))
                setState(s => ({ ...s, optDictamenValidacion: [] }))
                setState(s => ({ ...s, optDictamenConsolidacion: [] }))
            })
        Funciones.FNGetLlamadas(props.oidc)
            .then((respuesta: any) => {
                console.log('Consultado');

            })
            .catch((ex) => {
                console.log('error: ', ex);

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

    const FnProcesos = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetProcesos(props.oidc)
            .then((respuesta: any) => {
                var proceso = respuesta.map((valor: any) => {
                    var obj = { value: valor.StatusProcesoID, label: valor.Descripcion };
                    return obj
                });

                setState(s => ({ ...s, optProceso: proceso }))
            })
            .catch(() => {
                setState(s => ({ ...s, optProceso: [] }))
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

    const FnConsolidadoDictamen = () => {
        var obj = [{ value: 3, label: 'EN REVISION' }, { value: 2, label: 'VALIDADO' }, { value: 1, label: 'ACTIVADO' }]
        setState(s => ({ ...s, optConsolidado: obj }))
        return obj
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
                        {permisoAsignar && <div className={`divInDTable text-center ${props.AsignadoValidado != 1 ? 'pulsingButton' : ''}`}>
                            <button data-tip data-for={`AA_${props.ProspectoID}`} className="btn btn-outline-default buttonIconInDTable" type={"button"} onClick={() => {
                                console.log("PROPS", props)
                                fnAsignacion(props)
                                setState(s => ({
                                    ...s,
                                    Form: {
                                        ...state.Form, Mostrar: true,
                                        Datos: { ProspectoID: props.ProspectoID, PersonaAnalistaID: props.PersonaAnalistaID, Descripcion: props.Descripcion },
                                        Id: props.ProspectoID,
                                        IdAnalista: props.PersonaAnalistaID
                                    }
                                }))
                            }}>
                                <FaUserPlus color={props.ColorAsignadoValidado} size={[8, 9].includes(props.StatusProcesoID) ? 30 : 15} />
                            </button>
                            <ReactTooltip id={`AA_${props.ProspectoID}`} type="info" effect="solid">
                                {props.AsignadoValidado === 1 ? 'Re' : ''}Asignar Analista a {props.NombreProspecto}
                            </ReactTooltip>
                        </div>}
                    </div>,
                conditionalCellStyles: activoStyle(props)
            },
            {
                name: 'Asignada A', selector: 'NombreAnalista', sortable: true,
                width: "11%",
                cell: (props) =>
                    <>
                        <label data-tip data-for={`A_${props.ProspectoID}`} className="LabelInDTable" >
                            {props.NombreAnalista}
                        </label>
                        <ReactTooltip id={`A_${props.ProspectoID}`} type="info" effect="solid">
                            {props.NombreAnalista}
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: activoStyle(props)
            },
            {
                name: 'Notas', selector: 'ProspectoID',
                width: "6%",
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
                width: "10%",
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
                name: 'Prospecto', selector: 'NombreProspecto', sortable: true, width: "10%",
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
                name: 'Tipo DV', selector: 'DistribuidorTiposID', sortable: true, width: "12%",
                cell: (props) =>
                    <>
                        <label data-tip data-for={`td_${props.ProspectoID}`} className="LabelInDTable" >
                            {props.DistribuidorTipos}
                        </label>
                        <ReactTooltip id={`td_${props.ProspectoID}`} type="info" effect="solid">
                            {props.DistribuidorTipos}
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: activoStyle(props)
            },
            {
                name: 'Tiempos',
                selector: 'ProspectoID',
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
                name: 'Dictamén Buró',
                selector: 'ProspectoID',
                width: "8%",
                cell: (props) =>
                    <>
                        <label data-tip data-for={`B_${props.ProspectoID}`} className="LabelInDTable" style={{ color: `${props.BuroInternoEstatusColor}`, fontWeight: 'bold' }}>
                            <FaFilePdf color={`${props.BuroInternoEstatusColor}`} /> {props.BuroInternoEstatus}
                        </label>
                        <ReactTooltip id={`B_${props.ProspectoID}`} type="info" effect="solid">
                            Dictamén Buró de Crédito de {props.NombreProspecto} ({props.BuroInternoEstatus})
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: activoStyle(props)
            },
            // {
            //     name: 'Docs Aval',
            //     selector: '',
            //     sortable: true,
            //     width: "5%",
            //     cell: (props) =>
            //         <>
            //             <div data-tip data-for={`DA_${props.ProspectoID}`} className="divInDTable text-center radiusSmallDivR">
            //                 <button onClick={() => fnDocumentosAvales(props.ProspectoID, props.NombreProspecto, props.RevisionDocumentosAval)} className="btn btn-outline-default buttonIconInDTable"><FaCopy color={props.ColorRevisionDocumentosAval} size={[16].includes(props.StatusProcesoID) ? 30 : 15} /></button>
            //             </div>
            //             <ReactTooltip id={`DA_${props.ProspectoID}`} type="info" effect="solid">
            //                 Validación de los Documentos de los Avales del prospecto {props.NombreProspecto}
            //             </ReactTooltip>
            //         </>
            // },
            // {
            //     name: 'Buró Crédito',
            //     selector: '',
            //     sortable: true,
            //     width: "5%",
            //     cell: (props) =>
            //         <>
            //             <div data-tip data-for={`BC_${props.ProspectoID}`} className="divInDTable text-center radiusSmallDivR">
            //                 <button onClick={() => fnBuroDeCredito(props.ProspectoID, props.NombreProspecto, props.BuroInternoEstatusID, props.RevisionBuro, props.EstatusConsultaBuroID, props.EstatusConsultaBuroDesc)} className="btn btn-outline-default buttonIconInDTable" type={"button"}> <FaFilePdf color={props.ColorRevisionBuro} size={[11].includes(props.StatusProcesoID) ? 30 : 15} /></button>
            //             </div>
            //             <ReactTooltip id={`BC_${props.ProspectoID}`} type="info" effect="solid">
            //                 Validación del Buró de Crédito del prospecto {props.NombreProspecto}
            //             </ReactTooltip>
            //         </>
            // },
            {
                name: 'Revisión Expdte.',
                selector: 'ProspectoID',
                width: "7%",
                cell: (props) =>
                    <>
                        <div data-tip data-for={`DT_${props.ProspectoID}`} className="divInDTable text-center radiusSmallDivR">
                            <button onClick={() => fnDocumentos(props.ProspectoID, props.NombreProspecto, props.RevisionDocumentos)} className="btn btn-outline-default buttonIconInDTable">
                                <FaFile color={props.ColorRevisionDocumentos} size={[10].includes(props.StatusProcesoID) ? 30 : 15} /></button>
                        </div>
                        <ReactTooltip id={`DT_${props.ProspectoID}`} type="info" effect="solid">
                            Validación de los Documentos del prospecto {props.NombreProspecto}
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: activoStyle(props)
            },
            // {
            //     name: 'Verif. Titular', selector: '', sortable: true, width: "6%",center: true,
            //     cell: (props) =>
            //         <>
            //             <div data-tip data-for={`VT_${props.ProspectoID}`} className="divInDTable text-center radiusSmallDivR">
            //                 <button onClick={() => fnConfirmacionTitular(props.ProspectoID, props.NombreProspecto, props.VerificaTitular)} className="btn btn-outline-default buttonIconInDTable">   <FaMobileAlt color={props.ColorVerificaTitular} size={[14].includes(props.StatusProcesoID) ? 30 : 15} /></button>
            //             </div>
            //             <ReactTooltip id={`VT_${props.ProspectoID}`} type="info" effect="solid">
            //                 Validación del prospecto {props.NombreProspecto}
            //             </ReactTooltip>
            //         </>
            // },
            // {
            //     name: 'Ref. Titular', selector: '', sortable: true, width: "6%",center: true,
            //     cell: (props) =>
            //         <>
            //             <div data-tip data-for={`RT_${props.ProspectoID}`} className="divInDTable text-center radiusSmallDivR">
            //                 <button className="btn btn-outline-default buttonIconInDTable" type={"button"} onClick={() => fnConfirmaVerificaRefTitular(props.ProspectoID, props.NombreProspecto, props.RevisionRefTitular, props.ObservacionRevisionRefTitular)} >
            //                     <FaPhoneAlt color={props.ColorRevisionRefTitular} size={[12].includes(props.StatusProcesoID) ? 30 : 15} />
            //                 </button>
            //             </div>
            //             <ReactTooltip id={`RT_${props.ProspectoID}`} type="info" effect="solid">
            //                 Validación de las Referencias del prospecto {props.NombreProspecto}
            //             </ReactTooltip>
            //         </>

            // },
            // {
            //     name: 'Verif. Avales', selector: '', sortable: true, width: "6%",center: true,
            //     cell: (props) =>
            //         <>
            //             <div data-tip data-for={`VA_${props.ProspectoID}`} className="divInDTable text-center radiusSmallDivR">
            //                 <button className="btn btn-outline-default buttonIconInDTable" type={"button"} onClick={() => fnConfirmaVerificaAval(props.ProspectoID, props.NombreProspecto, props.VerificaAval, props.ObservacionVerificaAval)} >
            //                     <FaMobile color={props.ColorVerificaAval} size={[15].includes(props.StatusProcesoID) ? 30 : 15} />
            //                 </button>
            //             </div>
            //             <ReactTooltip id={`VA_${props.ProspectoID}`} type="info" effect="solid">
            //                 Validación de los Avales del prospecto {props.NombreProspecto}
            //             </ReactTooltip>
            //         </>
            // },
            // {
            //     name: 'Ref. Avales', selector: '', sortable: true, width: "6%",center: true,
            //     cell: (props) =>
            //         <>
            //             <div data-tip data-for={`RA_${props.ProspectoID}`} className="divInDTable text-center radiusSmallDivR">
            //                 <button className="btn btn-outline-default buttonIconInDTable" type={"button"} onClick={() => fnConfirmaVerificaRefAval(props.ProspectoID, props.NombreProspecto, props.RevisionRefAval, props.ObservacionRevisionRefAval)} >
            //                     <FaPhoneAlt color={props.ColorRevisionRefAval} size={[13].includes(props.StatusProcesoID) ? 30 : 15} />
            //                 </button>
            //             </div>
            //             <ReactTooltip id={`RA_${props.ProspectoID}`} type="info" effect="solid">
            //                 Validación de las Referencias de los Avales del prospecto {props.NombreProspecto}
            //             </ReactTooltip>
            //         </>
            // },
            {
                name: 'Validación', selector: 'ProspectoID', width: "7%",
                cell: (props) =>
                    <>
                        <div data-tip data-for={`D_${props.ProspectoID}`} className="divInDTable text-center radiusSmallDiv">

                            <button className="btn btn-outline-default buttonIconInDTable" type={"button"}

                                onClick={() => { setState(s => ({ ...s, Dictamen: true, Id: props.ProspectoID, NombreProspecto: props.NombreProspecto, DictamenInfo: { ...s.DictamenInfo, NivelOrigen_BuroID: props.NivelOrigen_BuroID, Dictaminado: props.Dictamen, DistribuidorNivel: props.DistribuidorNivel, DistribuidoresEstatus: props.DistribuidoresEstatus, Monto: props.MontoDictaminado, PersonaAnalistaID: props.PersonaAnalistaID, DistribuidorTiposID: props.DistribuidorTiposID, DistribuidorTipos: props.DistribuidorTipos, Activo: props.Activo } })) }}>
                                <FaClipboardCheck color={props.ColorDictamen} size={[17].includes(props.StatusProcesoID) ? 30 : 15} />
                            </button>
                        </div>
                        <ReactTooltip id={`D_${props.ProspectoID}`} type="info" effect="solid">
                            Dictamen del prospecto {props.NombreProspecto}
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: activoStyle(props)
            },
            {
                name: 'Activación', selector: 'ProspectoID', width: "7%",
                cell: (props) =>
                    <>
                        <div className="radiusSmallDiv">
                            {permisoActivar && <div data-tip data-for={`C_${props.ProspectoID}`} className="divInDTable text-center">
                                <button className="btn btn-outline-default buttonIconInDTable" type={"button"} onClick={() => {
                                    setState(s => ({
                                        ...s,
                                        Consolidacion: true,
                                        Id: props.ProspectoID,
                                        NombreProspecto: props.NombreProspecto, DictamenInfo: {
                                            ...s.DictamenInfo,
                                            Dictaminado: props.Consolidacion,
                                            NivelOrigen_BuroID: props.NivelOrigen_BuroID,
                                            DistribuidorNivelInternoID: props.DistribuidorNivelInternoID,
                                            DistribuidorNivel: props.DistribuidorNivel,
                                            DistribuidorNivelID: props.DistribuidorNivelID,
                                            DistribuidoresEstatus: props.DistribuidoresEstatus,
                                            DistribuidoresEstatusID: props.DistribuidoresEstatusID,
                                            Monto: props.MontoDictaminado,
                                            PersonaAnalistaID: props.PersonaAnalistaID,
                                            DistribuidorTiposID: props.DistribuidorTiposID,
                                            DistribuidorTipos: props.DistribuidorTipos,
                                            Activo: props.Activo
                                        }
                                    }))
                                }}>
                                    <FaUserCheck color={props.ColorConsolidacion} size={[18].includes(props.StatusProcesoID) ? 30 : 15} />
                                </button>
                                <ReactTooltip id={`C_${props.ProspectoID}`} type="info" effect="solid">
                                    Consolidación del prospecto {props.NombreProspecto}
                                </ReactTooltip>
                            </div>}
                        </div>
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
                            <button onClick={() =>  setState(s => ({ ...s, ProspectoID: props.ProspectoID, nombreP: props.NombreProspecto, CFormArchivar: true }))} className="btn btn-outline-default buttonIconInDTable" type={"button"}>
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
        console.log("DICTAMEN", state.DictamenInfo)
        FNGetLocal()
        FnGeTActivo()
        FnGetAnalistas()
        FnGetEstatusBuroDeCredito()
        FnSucursales()
        FnProcesos()
        FnProspectos()
        FnConsolidadoDictamen()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])


    React.useEffect(() => {
        FnFiltrando()
    }, [state.FiltroAnalista, state.FiltroSucursal, state.FiltroProceso, state.FiltroProspecto, startDate, endDate, state.FiltroConsolida, state.FiltroDisctamenBuro, state.FiltroDisctamenBuroFile, state.FiltroDisctamenValidacion, state.FiltroDisctamenConsolidacion, state.FiltroActivo])


    // On use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        FnFiltrando()
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])


    //ESTADO DE LA COLUMNA PARA SABER SI ESTA VALIDADO
    const fnEstadoColumna = (EstadoColumna: number) => {
        setState(s => ({ ...s, RevisionDocumentosAval: EstadoColumna, RevisionDocumentos: EstadoColumna, VerificaTitular: EstadoColumna, VerificaAval: EstadoColumna, RevisionBuro: EstadoColumna, RevisionRefTitular: EstadoColumna, RevisionRefAval: EstadoColumna, }))
    }

    //ACTUALIZA
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.ProspectoID === item.ProspectoID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { ProspectoID: 0, PersonaAnalistaID: 0 } } })

    const cbActualizarM = async () => {
        setState({
            ...state, Consolidacion: false
        })
        await FNGetLocal();
        setState({
            ...state, Consolidacion: true
        })
    }


    //FUNCION PARA CANCELAR LAS FORMAS
    const fnCancelar = () => setState(s => ({
        ...s, CForm: false, CFormM: false, CFormDocumentos: false, CFormConfirmar: false,
        CFormDocumentosAval: false, CFormConfirmarAval: false, CFormTiempos: false, CFormMensajes: false,
        CFormArchivar: false,
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
    const formaCFormBuroDeCredito = () => { setState(s => ({ ...s, CFormBuroDeCredito: true })) }
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

    //DOCUMENTOS TITULAR
    const fnDocumentos = (ProspectoID: any, NombreProspecto: string, RevisionDocumentos: number) => {
        setState(e => ({ ...e, CargandoOverlay: true }))
        Funciones.FNupdateConfirmarDocumentos(props.oidc, ProspectoID, 1)
            .then((respuesta: any) => {
                cbActualizar(respuesta) //Actualiza los Renglones
                //  setState(s => ({ ...s, ProspectoID: ProspectoID, NombreProspecto: NombreProspecto, RevisionDocumentos: RevisionDocumentos }))
                if (RevisionDocumentos == 3) {
                    setState(s => ({ ...s, CargandoOverlay: false, CFormConfirmar: true, ProspectoID: ProspectoID, NombreProspecto: NombreProspecto, RevisionDocumentos: RevisionDocumentos, Item: ProspectoID }))
                }
                else {
                    setState(s => ({ ...s, CargandoOverlay: false, CFormDocumentos: true, ProspectoID: ProspectoID, NombreProspecto: NombreProspecto, RevisionDocumentos: RevisionDocumentos, Item: ProspectoID }))
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

    //DOCUMENTOS AVALES
    const fnDocumentosAvales = (ProspectoID: any, NombreProspecto: string, RevisionDocumentosAval: number) => {
        Funciones.FNupdateConfirmarDocumentosAvales(props.oidc, ProspectoID, 5)
            .then((respuesta: any) => {
                cbActualizar(respuesta) //Actualiza los Renglones
                if (RevisionDocumentosAval == 3) {
                    setState(s => ({ ...s, CFormConfirmarAval: true, ProspectoID: ProspectoID, NombreProspecto: NombreProspecto, RevisionDocumentosAval: RevisionDocumentosAval, Item: ProspectoID }))
                }
                else {
                    setState(s => ({ ...s, CFormDocumentosAval: true, ProspectoID: ProspectoID, NombreProspecto: NombreProspecto, RevisionDocumentosAval: RevisionDocumentosAval, Item: ProspectoID }))
                }
            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(error.response.data)
                else if
                    (error.request)
                    toast.error('Error: SE PERDIO LA CONEXION A LA BASE DE DATOS')
                else
                    toast.error('Error: SE PERDIO LA CONEXION A LA BASE DE DATOS')
            })
    }

    //BURO CREDITO
    const fnBuroDeCredito = (ProspectoID: any, NombreProspecto: string, BuroInternoEstatusID: number, RevisionBuro: number, EstatusConsultaBuroID: number, EstatusConsultaBuroDesc: string) => {
        Funciones.FNConfirmarBuroDeCredito(props.oidc, ProspectoID, 7)
            .then((respuesta: any) => {
                cbActualizar(respuesta) //Actualiza los Renglones
                if (RevisionBuro == 3) {
                    setState(s => ({ ...s, CFormConfirmarBuroDeCredito: true, ProspectoID: ProspectoID, NombreProspecto: NombreProspecto, BuroInternoEstatusID: BuroInternoEstatusID, RevisionBuro: RevisionBuro, EstatusConsultaBuroID: EstatusConsultaBuroID, EstatusConsultaBuroDesc: EstatusConsultaBuroDesc, Item: ProspectoID }))
                }
                else {
                    setState(s => ({ ...s, CFormBuroDeCredito: true, ProspectoID: ProspectoID, NombreProspecto: NombreProspecto, BuroInternoEstatusID: BuroInternoEstatusID, RevisionBuro: RevisionBuro, EstatusConsultaBuroID: EstatusConsultaBuroID, EstatusConsultaBuroDesc: EstatusConsultaBuroDesc, Item: ProspectoID }))
                }
            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(error.response.data)
                else if
                    (error.request)
                    toast.error('Error: SE PERDIO LA CONEXION A LA BASE DE DATOS')
                else
                    toast.error('Error: SE PERDIO LA CONEXION A LA BASE DE DATOS')
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

    const fnGetFiltrosProcesos = (StatusProcesoID: number) => {
        console.log(StatusProcesoID)
        setState(s => ({ ...s, FiltroProceso: StatusProcesoID }))
    }

    const fnGetFiltrosProspecto = (ProspectoID: number) => {
        console.log(ProspectoID)
        setState(s => ({ ...s, FiltroProspecto: ProspectoID }))
    }

    const fnGetFiltrosConsolidaDictamen = (ConsolidadoID: number) => {
        console.log(ConsolidadoID)
        setState(s => ({ ...s, FiltroConsolida: ConsolidadoID }))
    }

    const fnGetFiltrosDictamenBuro = (BuroInternoEstatusID: number) => {
        console.log(BuroInternoEstatusID)
        setState(s => ({ ...s, FiltroDisctamenBuro: BuroInternoEstatusID }))
    }

    const fnGetFiltrosDictamenFile = (RevisionDocumentos: number) => {
        console.log(RevisionDocumentos)
        setState(s => ({ ...s, FiltroDisctamenBuroFile: RevisionDocumentos }))
    }

    const fnGetFiltrosDictamenValidacion = (Dictamen: number) => {
        console.log(Dictamen)
        setState(s => ({ ...s, FiltroDisctamenValidacion: Dictamen }))
    }

    const fnGetFiltrosDictamenConsolidacion = (Consolidacion: number) => {
        console.log(Consolidacion)
        setState(s => ({ ...s, FiltroDisctamenConsolidacion: Consolidacion }))
    }

    const fnGetFiltrosEstatus = (Activo: number) => {
        console.log(Activo)
        setState(s => ({ ...s, FiltroActivo: Activo }))
    }
    let data
    const FnFiltrando = () => {

        let numFiltro = (state.FiltroAnalista + state.FiltroSucursal + state.FiltroProceso + state.FiltroProspecto + state.FiltroConsolida + state.FiltroDisctamenBuro + state.FiltroDisctamenBuroFile + state.FiltroDisctamenValidacion + state.FiltroDisctamenConsolidacion + state.FiltroActivo)
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
        if (state.FiltroDisctamenBuro > 0)
            datosFiltro = datosFiltro.filter(d => { return d.BuroInternoEstatusID == state.FiltroDisctamenBuro })

        if (state.FiltroDisctamenBuroFile > 0)
            datosFiltro = datosFiltro.filter(d => { return d.RevisionDocumentos == state.FiltroDisctamenBuroFile })

        if (state.FiltroDisctamenValidacion > 0)
            datosFiltro = datosFiltro.filter(d => { return d.Dictamen == state.FiltroDisctamenValidacion })

        if (state.FiltroDisctamenConsolidacion > 0)
            datosFiltro = datosFiltro.filter(d => { return d.Consolidacion == state.FiltroDisctamenConsolidacion })

        if (state.FiltroActivo < 3 && state.FiltroActivo.toString() != undefined) {
            datosFiltro = datosFiltro.filter(d => { return d.Activo == state.FiltroActivo })
        }

        if (startDate != null && endDate != null) {
            startDate.setHours(0, 0, 0)
            endDate.setHours(23, 59, 59)
            datosFiltro = datosFiltro.filter(d => { return d.FechaAsignacion >= startDate.toISOString() && d.FechaAsignacion <= endDate.toISOString() || d.FechaAsignacion === null })
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
    console.log(FormListener);

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
                    <Card Title="Mesa De Credito">
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
                                                                        <div style={{ height: '67px', width: '245px' }}>
                                                                            <ActionSelect
                                                                                disabled={false}
                                                                                label="Muestra"
                                                                                name="ConsolidadoID"
                                                                                placeholder="TODOS"
                                                                                options={state.optConsolidado}
                                                                                addDefault={true}
                                                                                valor={state.FiltroConsolida}
                                                                                accion={fnGetFiltrosConsolidaDictamen}
                                                                            />
                                                                        </div>

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

                                                                        {/* <div style={{ height: '67px', width: '245px' }}>
                                                                            <ActionSelect
                                                                                disabled={false}
                                                                                label="Proceso Actual"
                                                                                name="StatusProcesoID"
                                                                                placeholder="TODOS"
                                                                                options={state.optProceso}
                                                                                addDefault={true}
                                                                                valor={state.FiltroProceso}
                                                                                accion={fnGetFiltrosProcesos}
                                                                            />
                                                                        </div> */}

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
                                                                                label="Dictamen Buro"
                                                                                name="BuroInternoEstatusID"
                                                                                placeholder="TODOS"
                                                                                options={state.optDictamenBuro}
                                                                                addDefault={true}
                                                                                valor={state.FiltroDisctamenBuro}
                                                                                accion={fnGetFiltrosDictamenBuro}
                                                                            />
                                                                        </div>
                                                                        <div style={{ height: '67px', width: '245px' }}>
                                                                            <ActionSelect
                                                                                disabled={false}
                                                                                label="Revisión Expte."
                                                                                name="RevisionDocumentos"
                                                                                placeholder="TODOS"
                                                                                options={state.optDictamenBuroFile}
                                                                                addDefault={true}
                                                                                valor={state.FiltroDisctamenBuroFile}
                                                                                accion={fnGetFiltrosDictamenFile}
                                                                            />
                                                                        </div>
                                                                        <div style={{ height: '67px', width: '245px' }}>
                                                                            <ActionSelect
                                                                                disabled={false}
                                                                                label="Validacion."
                                                                                name="Dictamen"
                                                                                placeholder="TODOS"
                                                                                options={state.optDictamenValidacion}
                                                                                addDefault={true}
                                                                                valor={state.FiltroDisctamenValidacion}
                                                                                accion={fnGetFiltrosDictamenValidacion}
                                                                            />
                                                                        </div>

                                                                        <div style={{ height: '67px', width: '245px' }}>
                                                                            <ActionSelect
                                                                                disabled={false}
                                                                                label="Activacion."
                                                                                name="Consolidacion"
                                                                                placeholder="TODOS"
                                                                                options={state.optDictamenConsolidacion}
                                                                                addDefault={true}
                                                                                valor={state.FiltroDisctamenConsolidacion}
                                                                                accion={fnGetFiltrosDictamenConsolidacion}
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
                                            //subHeaderComponent={}
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
                                        {state.CForm && <CForm
                                            oidc={props.oidc}
                                            initialValues={state.Form.Datos}
                                            Id={state.Form.Id}
                                            optAnalista={state.optAnalistaPers}
                                            cbActualizar={cbActualizar}
                                            fnCancelar={fnCancelar}
                                            Item={state.Item}
                                            mostrar={state.CForm}
                                        />}

                                        {state.CFormM && <AsignaAnalistaM
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

                                        {state.CFormDocumentos && <CFormDocumentos
                                            oidc={props.oidc}
                                            Id={state.Form.Id}
                                            Item={state.Item}
                                            mostrar={state.CFormDocumentos}
                                            fnCancelar={fnCancelar}
                                            ProspectoID={state.ProspectoID}
                                            NombreProspecto={state.NombreProspecto}
                                            RevisionDocumentos={state.RevisionDocumentos}
                                            FNGetLocal={FNGetLocal}
                                            cbActualizar={cbActualizar}
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

                                        {state.CFormDocumentosAval && <CFormDocumentosAval
                                            oidc={props.oidc}
                                            Id={state.ProspectoID}
                                            NombreProspecto={state.NombreProspecto}
                                            mostrar={state.CFormDocumentosAval}
                                            fnCancelar={fnCancelar}
                                            RevisionDocumentosAval={state.RevisionDocumentosAval}
                                            FNGetLocal={FNGetLocal}
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
                                            TipoMesa={2}
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

                                        {state.Dictamen && <DictamenProspecto
                                            oidc={props.oidc}
                                            Id={state.Id}
                                            nombreProspecto={state.NombreProspecto}
                                            mostrar={state.Dictamen}
                                            fnCancelar={fnCancelar}
                                            cbActualizar={cbActualizar}
                                            DictamenInfo={state.DictamenInfo}
                                        />}
                                        {state.Consolidacion && FormListener &&
                                            <ConsolidaProspecto
                                                oidc={props.oidc}
                                                Id={state.Id}
                                                productoID={props.ui.Producto?.ProductoID}
                                                nombreProspecto={state.NombreProspecto}
                                                mostrar={state.Consolidacion}
                                                fnCancelar={fnCancelar}
                                                cbActualizar={cbActualizar}
                                                Actualizar={cbActualizarM}
                                                Listener={FormListener}
                                                DictamenInfo={state.DictamenInfo}
                                                ui={props.ui}
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
export default connect(mapStateToProps, mapDispatchToProps)(CatalogoMesaCreditoIndex)