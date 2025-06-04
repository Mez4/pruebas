import React, { useState } from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import { toast } from 'react-toastify'
import * as Funciones from './CreditoSolicitudPrestamosPersonales/Funciones'
// Icons
import { FaEye, FaExclamationCircle, FaFileSignature, FaFilter, FaPen, FaPencilAlt, FaPlus, FaFacebookMessenger, FaCheck, FaCheckCircle, FaMobile, FaAd, FaCheckDouble, FaBan, FaDollarSign, FaSearch, FaRegChartBar, FaBarcode, FaBars, FaChartBar, FaLevelDownAlt, FaLevelUpAlt } from 'react-icons/fa'
// Custom components
import { ActionSelect, Card, DatePickeEnd, DatePickeStart, Spinner, ImgViewer } from '../../../../global' 
import PDFViewer2 from '../../../../../../src/componentes/global/PDFViewer2'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos, formatDate } from '../../../../../global/functions'
import { boolean, object, array } from '../../../../../global/idiomaValidacion.bak';
import { bool } from 'yup'
import moment from 'moment'
import { Form, Formik } from 'formik'
import ReactTooltip from 'react-tooltip'
import Seguridad from '../../seguridad/Seguridad'
import { CFormCancelarSolicitud } from './CreditoSolicitudIncremento/CFormCancelarSolicitud'
import { format } from 'path';
import { CFormEditarSolicitud } from './CreditoSolicitudIncremento/CFormEditarSolicitud'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { iUI } from '../../../../../interfaces/ui/iUI'
import { DBConfia_Distribuidores } from '../../../../../interfaces_db/DBConfia/Distribuidores'
import Incrementos from '../../personas/CompAdministracion/Incrementos/Incrementos';
import { AiOutlineBarChart, AiOutlineBarcode, AiOutlineBars } from 'react-icons/ai'
import { BiBarChart, BiBarChartAlt, BiBarChartAlt2, BiBarChartSquare, BiBarcode, BiBarcodeReader } from 'react-icons/bi'
import { BsFillBarChartFill, BsFillBarChartLineFill, BsFillFileBarGraphFill, BsFillFileEarmarkBarGraphFill, BsReverseLayoutSidebarInsetReverse } from 'react-icons/bs'
import { CFormCancelarSolicitudPrestamoPersonal } from './CreditoSolicitudPrestamosPersonales/CFormCancelarSolicitudPrestamoPersonal'
import { CFormEditarSolicitudPrestamoPersonal } from './CreditoSolicitudPrestamosPersonales/CFormSolicitudPrestamoPersonal'
import { Solicitud } from './CreditoReestructuraSolicitudes/Solicitud';

import { DataGrid, GridColDef, GridFilterModel, /* esES */ } from '@mui/x-data-grid';
import { group } from 'console'


type CatalogosSolicitudPrestamosPersonalesType = {
    oidc: IOidc,
    ui: iUI
    regresa: number
    ClearSelectedRows: boolean,
    PerstamosSeleccionados: [],
    CantidadPrestamosSeleccionados: number,
    Datos5: DBConfia_Distribuidores.ISolicitudesPrestamos_VW,
}

const CreditoSolicitudPrestamosPersonales = (props: CatalogosSolicitudPrestamosPersonalesType) => {
    let isMounted = React.useRef(true)
    const MySwal = withReactContent(Swal)

    const [startDate, setStartDate] = useState(moment().add(-10, 'd').toDate());
    const [endDate, setEndDate] = useState(moment().toDate());
    const [loading, setLoading] = React.useState(false)
    const [loading2, setLoading2] = React.useState(false)
    // // console.log('Props:', props)
    const DatosDefecto = {
        Evidencias: [
            {
                DocumentoID: 0,
                SolicitudPrestamoPersonalID: 0,
                Ruta: '',
            }
        ]
    }

    const DatosDefectoEstatus = {
        EstatusID: 0
    }
    const DatosDefectoPrestamo = {
        PrestamoSolicitado: 0,
        PlazoSolicitado: 0,
        Observaciones: '',
        DistribuidorID: 0,
    }
    const DatosDefectoCancelacion = {
        MotivoCancelacion: ''
    }

    const Datos: any[] = []
    const Datos2: any[] = []
    const Datos3: any[] = []
    const Evidencias: any[] = []
    const DatosMostrar: any[] = []
    const optSucursales: any[] = []
    const optEstatus: any[] = []
    const FiltroSucursal: number = 0
    const FiltroEstatus: number = 0
    const [filterData, setFilterData] = useState({
        SucursalID: 0,
        FechaInicio: startDate,
        FechaFin: endDate
    });
    const [showTable, setShowTable] = useState(false);




    const [state, setState] = React.useState({

        

        SolicitudPrestamoPersonalID: 0,
        DocumentoID: 0,
        DistribuidorID: 0,
        Datos,
        Datos2,
        Datos3,
        DatosMostrar,
        Evidencias,
        CargandoOverlay: false,
        optSucursales,
        optEstatus,
        TipoEstatus: [],
        DatosPre: [],
        PrestamosSeleccionados: [],
        CantidadPrestamosSeleccionados: 0,
        ClearSelectedRows: false,
        Filtro: '',
        Cargando: false,
        Error: false,

        Form: {
            src: '',
            MostrarAsignarEstatus: false,
            MostrarImagenesEvidencia: false,
            MostrarPrestamo: false,
            MostrarCancelacion: false,
            MostrarVerEvidencias: false,
            verEvidencia: false,
            Ruta: '',
            SolicitudID: 0,
            SolicitudPrestamoPersonalID: 0,
            DocumentoID: 0,
            CargarEvidencia: false,
            Mostrar: false,
            DatosEstatus: DatosDefectoEstatus,
            DatosPrestamo: DatosDefectoPrestamo,
            DatosCancelacion: DatosDefectoCancelacion,
            Datos: DatosDefecto,
            Id: undefined,
        },
        FiltroSucursal,
        FiltroEstatus,
    })

    const cbGuardarSolicitud = (item: any) => {
        // // console.log("ITEM RECIBIDO", item)
        let index = state.Datos2.findIndex((x: any) => x.SolicitudPrestamoPersonalID === item.SolicitudPrestamoPersonalID)
        if (index > -1) {
            state.Datos2[index].SolicitudPrestamoPersonalID = item.SolicitudPrestamoPersonalID,
                state.Datos2[index].PrestamoSolicitdo = item.PrestamoSolicitado

        }
        setState({ ...state })
        FNGetLocal(filterData)
    }


    const cbGuardarCancelacion = (item: any) => {
        // // console.log("ITEM RECIBIDO", item)
        let index = state.Datos3.findIndex((x: any) => x.SolicitudPrestamoPersonalID === item.SolicitudPrestamoPersonalID)
        if (index > -1) {
            state.Datos3[index].SolicitudPrestamoPersonalID = item.SolicitudPrestamoPersonalID,
                state.Datos3[index].MotivoCancelacion = item.MotivoCancelacion
        }
        setState({ ...state })
        FNGetLocal(filterData)
    }

    const FNGetLocal = (values) => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetFilter(props.oidc, values).then((respuesta: any) => {
            if (isMounted.current === true) {
                //// console.log("###", respuesta);
                if (respuesta.mensajePeticion === undefined) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                    setShowTable(true);
                } else {
                    setState(s => ({ ...s, Cargando: false }))
                    toast.error("Error al obtener los datos, permisos insuficientes")
                    setShowTable(false);
                }
            }


        }
        )
            .catch((error: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const FNGetLocalImagen = (SolicitudPrestamoPersonalID: number, DocumentoID: number) => {
        setLoading2(true)
        Funciones.FnGetEvidenciaPrestamo(props.oidc, SolicitudPrestamoPersonalID, DocumentoID)
            .then((respuesta: any) => {
 
                if (isMounted.current === true) {
                    // // console.log("Ya llega", respuesta);
                    //  console.log("Ya llega xfavor", respuesta.src);
                    setState(s => ({ ...s, Form: { ...s.Form, src: respuesta.src } }))
                    setLoading2(false)
                }
            })
            .catch((error) => {
                // // console.log("###e", error)
                if (isMounted.current === true) {
                    // setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const FNGetTipoEstatus = () => {
        setState(s => ({ ...s, }))
        Funciones.FNGetEstatus(props.oidc)
            .then((respuesta: any) => {
                // // console.log("FnEstatus: ", respuesta)
                //Quitar es estatus activo y pendiente
                respuesta = respuesta.filter((item: any) => item.EstatusID !== 1 && item.EstatusID !== 2)
                var estatus = respuesta.map((valor: any) => {
                    var obj = { value: valor.EstatusID, label: valor.Estatus };
                    return obj
                });
                setState(s => ({ ...s, optEstatus: estatus }))
            })
            .catch(() => {
                setState(s => ({ ...s, optEstatus: [] }))
            })
    }


    const fnGetFiltroEstatus = (EstatusID: number) => {
        // // console.log("Mostrando el estatus: " + EstatusID);
        setState(s => ({ ...s, FiltroEstatus: EstatusID }))
    }

    const FnSucursales = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetSucursales(props.oidc)
            .then((respuesta: any) => {
                // // console.log("FnSucursales: ", respuesta)
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

    const fnGetFiltrosSucursales = (SucursalID: number) => {
        // console.log("Mostrando las sucursales: " + SucursalID)
        setState(s => ({ ...s, FiltroSucursal: SucursalID }))
    }



    const AceptarSolicitud = (SolicitudPrestamoPersonalID: number) => {
        console.log(SolicitudPrestamoPersonalID);

        MySwal.fire({
            title: '<strong>Aceptar solicitud de préstamo</strong>',
            icon: 'question',
            html:
                <div className="text-center">
                    Se aceptará el préstamo, ¿Desea Continuar?
                </div>,
            showCloseButton: false,
            showCancelButton: true,
            showConfirmButton: true,
            focusConfirm: false,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar',
            confirmButtonAriaLabel: 'Aceptar',
            allowOutsideClick: false,
            cancelButtonAriaLabel: ''
        }).then((result) => {
            if (result.isConfirmed) {


                Funciones.FNAceptar(props.oidc, SolicitudPrestamoPersonalID)
                    .then((resp: any) => {
                        console.log("resp: ", resp)
                        toast.info(resp.message);
                        //QUITAR DE LA TABLA EL REGISTRO ACEPTADO
                        setState(s => ({ ...s, Datos: state.Datos.filter((item: any) => item.SolicitudPrestamoPersonalID !== SolicitudPrestamoPersonalID) }))
                        setLoading(false)
                        // if (resp.EstatusID == 1) {
                        //     MySwal.fire(
                        //         {
                        //             icon: 'success',
                        //             html: <div><br />
                        //                 <h3 className="text-center">Aviso</h3>
                        //                 <div className={`modal-body`}>
                        //                     <h5 className="text-center">Se mando la solcitud para desembolsar</h5>
                        //                 </div>
                        //             </div>,
                        //             //timerProgressBar: true,
                        //             confirmButtonText: `Aceptar`,
                        //             allowOutsideClick: false,
                        //             //timer: 500,
                        //             /*  didOpen: () => {
                        //                  MySwal.showLoading()
                        //              }, */
                        //         }
                        //     );
                        //     toast.success(resp.msj)
                        //     FNGetLocal(filterData)
                        //     const resData = {
                        //         CreditoID: resp.CreditoID,
                        //         ProductoID: 0,
                        //         CreditoID_2: 0,
                        //         SoloFormatoExtra: true
                        //     }
                        //     Funciones.FNReimprimirSolicitudPrestamosPersonalesPDF(props.oidc, resData)
                        //         .then((res: any) => {
                        //             const file = new Blob([res], { type: "application/pdf" });

                        //             const fileURL = URL.createObjectURL(file);
                        //             const enlaceTemporal = document.createElement("a");
                        //             enlaceTemporal.href = fileURL;
                        //             enlaceTemporal.target = "_blank";
                        //             enlaceTemporal.style.display = "none";

                        //             document.body.appendChild(enlaceTemporal);

                        //             enlaceTemporal.click();
                        //         })
                        // }
                        // else {

                        //     setLoading(false)
                        //     toast.error(resp.msj)
                        // }

                    })
                    .catch((error: any) => {
                        console.log(error.response);

                        MySwal.fire(
                            {
                                icon: 'error',
                                html: <div><br />
                                    <h3 className="text-center">Error</h3>
                                    <div className={`modal-body`}>
                                        <h5 className='text-center'>{error.response.data ?? 'Ocurrió un problema al aceptar el préstamo'}</h5>

                                    </div>
                                </div>,
                                confirmButtonText: `Aceptar`,
                                allowOutsideClick: false,
                            }
                        );
                        setLoading(false)
                    })
            }
        })
    }
    const fnMostrarModalEvidencias = (item: any) => {
        console.log("Item2", item.Evidencias);
        console.log("Item", item);
        item.Evidencias.length > 0 ? setState(s => ({
            ...s, SolicitudPrestamoPersonalID: item.Evidencias[0].SolicitudPrestamoPersonalID,
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

    const fnMostrarImagenesEvidencia = (item?: any) => { 
        setState(s => ({
                ...s, SolicitudPrestamoPersonalID:  item.SolicitudPrestamoPersonalID, 
            Form: {
                ...s.Form, src: "", MostrarImagenesEvidencia: true
            }
        }))
        FNGetLocalImagen(item.SolicitudPrestamoPersonalID, item.DocumentoID)
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

    // Columnas de MUI
    const columns: GridColDef[] = [
        {
            field: '', headerName: 'Acciones', width: 250, headerAlign: 'center', align: 'center', sortable: false, renderCell: (cell: any) => (
                <div className="d-flex justify-content-center">
                    <div className={`${cell.row.EstatusID == 3 ? 'btn-disabled' : ''}`}
                        data-tip data-for={`AS_${cell.row.SolicitudPrestamoPersonalID}`

                        }
                    >
                        <button
                            disabled={(cell.row.EstatusID === 3 || cell.row.EstatusID === 1)}
                            className="btn btn-outline-default buttonIconInDTable radiusSmallDivR mx-2"
                            type="button"
                            onClick={() => AceptarSolicitud(cell.row.SolicitudPrestamoPersonalID)}
                        >
                            <FaCheckCircle size={15} />
                            <ReactTooltip id={`AS_${cell.row.SolicitudPrestamoPersonalID}`} type="info" effect="solid" className='z-3'>Aceptar Solicitud</ReactTooltip>
                        </button>

                    </div>
                    <div className=""
                        data-tip data-for={`ED_${cell.row.SolicitudPrestamoPersonalID}`}
                    >
                        <button
                            disabled={(cell.row.EstatusID === 3 || cell.row.EstatusID === 1)}
                            className="btn btn-outline-default buttonIconInDTable radiusSmallDivR mx-2"
                            type="button"
                            onClick={() => {
                                setState({
                                    ...state,
                                    SolicitudPrestamoPersonalID: cell.row.SolicitudPrestamoPersonalID,
                                    DistribuidorID: cell.row.DistribuidorID,

                                    Form: {
                                        ...state.Form,
                                        MostrarPrestamo: true,
                                        DatosPrestamo: {
                                            ...state.Form.DatosPrestamo,
                                            PrestamoSolicitado: cell.row.PrestamoSolicitado,
                                            PlazoSolicitado: cell.row.PlazoSolicitado,
                                            Observaciones: cell.row.Observaciones,
                                            DistribuidorID: cell.row.DistribuidorID
                                        }
                                    }
                                })
                            }}
                        >
                            <FaPencilAlt size={15} />

                            <ReactTooltip id={`ED_${cell.row.SolicitudPrestamoPersonalID}`} type="info" effect="solid">Editar Solicitud</ReactTooltip>

                        </button>

                    </div>
                    <div className=""
                        data-tip data-for={`CS_${cell.row.SolicitudPrestamoPersonalID}`}
                    >
                        <button
                            disabled={(cell.row.EstatusID === 3 || cell.row.EstatusID === 1)}
                            className="btn btn-outline-default buttonIconInDTable radiusSmallDivR mx-2"
                            type="button"
                            onClick={() => {
                                setState({
                                    ...state,
                                    SolicitudPrestamoPersonalID: cell.row.SolicitudPrestamoPersonalID,
                                    Form: {
                                        ...state.Form,
                                        MostrarCancelacion: true,
                                        DatosCancelacion: {
                                            ...state.Form.DatosCancelacion,
                                            MotivoCancelacion: cell.row.MotivoCancelacion,
                                        }
                                    }
                                })
                            }}
                        >
                            <FaBan size={15} />
                            <ReactTooltip id={`CS_${cell.row.SolicitudPrestamoPersonalID}`} type="info" effect="solid">Cancelar Solicitud</ReactTooltip>
                        </button>
                    </div>
                    <div className=""
                        data-tip data-for={`VE_${cell.row.SolicitudPrestamoPersonalID}`}
                    >
                        <button

                            className="btn btn-outline-default buttonIconInDTable radiusSmallDivR mx-2"
                            type="button"
                            onClick={() => { fnMostrarModalEvidencias(cell.row) }}
                        >
                            <FaEye size={15} />
                            <ReactTooltip id={` VE_${cell.row.SolicitudPrestamoPersonalID}`} type="info" effect="solid">Editar Solicitud</ReactTooltip>

                        </button>

                    </div>
                </div>
            )
        },
        { field: 'SolicitudPrestamoPersonalID', headerName: 'Solicitud ID', width: 100, align: 'center', headerAlign: 'center' },
        { field: 'Producto', headerName: 'Producto', width: 200, align: 'center', headerAlign: 'center' },
        { field: 'NombreSucursal', headerName: 'Sucursal', width: 300, align: 'center', headerAlign: 'center' },
        { field: 'CreditoID', headerName: 'N. Credito', width: 100, align: 'center', headerAlign: 'center', renderCell: (cell) => <span>{cell.row.CreditoID || 'N/A'}</span> },
        { field: 'ContratoID', headerName: 'Contrato ID', width: 100, align: 'center', headerAlign: 'center' },
        { field: 'DistribuidorID', headerName: 'Socia ID', width: 100, align: 'center', headerAlign: 'center' },
        { field: 'PersonaNombre', headerName: 'Socia', width: 300, align: 'center', headerAlign: 'center' },
        {
            field: 'PrestamoSolicitado', headerName: 'Préstamo  Solicitado', width: 150, align: 'center', headerAlign: 'center', renderCell: (cell: any) => (
                <span>{cell.row.PrestamoSolicitado !== null && cell.row.PrestamoSolicitado !== undefined
                    ? `${cell.row.PrestamoSolicitado.toLocaleString('es-ES', { style: 'currency', currency: 'MXN' })}`
                    : 'N/A'}</span>
            )
        },
        { field: 'PlazoSolicitado', headerName: 'Plazos', width: 100, align: 'center', headerAlign: 'center' },
        { field: 'Observaciones', headerName: 'Observaciones', width: 300, align: 'center', headerAlign: 'center' },

        {
            field: 'PrestamoAutorizado', headerName: 'Préstamo Autorizado', width: 150, align: 'center', headerAlign: 'center', renderCell: (cell: any) => (<span>{cell.row.PrestamoAutorizado !== null && cell.row.PrestamoAutorizado !== undefined
                ? `${cell.row.PrestamoAutorizado.toLocaleString('es-ES', { style: 'currency', currency: 'MXN' })}`
                : 'N/A'}</span>)
        },
        { field: 'UsuarioSolicito', headerName: 'Usuario Solicito', width: 300, align: 'center', headerAlign: 'center' },
        {
            field: 'FechaSolicitud', headerName: 'Fecha Solicito', width: 200, align: 'center', headerAlign: 'center', renderCell: (cell: any) => (
                <span>{moment(cell.row.FechaSolicitud).format("DD/MM/YYYY")}</span>
            )
        },
        { field: 'MotivoCancelacion', headerName: 'Motivo Cancelacion', width: 350, align: 'center', headerAlign: 'center' },

    ];

    const getRowClassName = (params) => {
        // Define tu condición aquí
        if (params.row.EstatusID == 3) {
            return 'row-highlight-red';
        }
        // if (params.row.EstatusID == 4) {
        //     return 'row-highlight-yelow';
        // }
        return '';
    };



    React.useEffect(() => {
        FnSucursales()
        FNGetLocal(filterData)
        FNGetTipoEstatus()
        return () => {
            isMounted.current = false
        }
    }, [])

    const FnFiltrando = () => {
        let numFiltro = (state.FiltroSucursal + state.FiltroEstatus)
        let datosFiltro = state.Datos



        if (numFiltro > 0)
            setState(s => ({ ...s, Filtrando: true }))
        else
            setState(s => ({ ...s, Filtrando: false }))

        if (state.FiltroSucursal > 0)
            datosFiltro = datosFiltro.filter(d => { return d.SucursalID === state.FiltroSucursal })

        if (state.FiltroEstatus > 0)
            datosFiltro = datosFiltro.filter(d => { return d.EstatusID === state.FiltroEstatus })

        if (startDate != null) {
            datosFiltro = datosFiltro.filter(d => { return d.FechaSolicitud >= startDate.toISOString() || d.FechaSolicitud === null })
        }
        setState(s => ({ ...s, DatosMostrar: datosFiltro }))

    }
    React.useEffect(() => {
        FnFiltrando()
    }, [state.FiltroSucursal, state.FiltroEstatus, startDate, endDate])

    React.useEffect(() => {
        // setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, columns, state.Filtro) }))
        FnFiltrando()
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    return (
        <React.Fragment>
            <div className='row'>
                <div className='col-12'>
                    <Card Title={'REVISIÓN DE SOLICITUDES DE PRÉSTAMOS PERSONALES'}>
                        <Card.Body>
                            <Card.Body.Content>
                                {state.Cargando && <Spinner />}
                                {state.Error && <span>Error al cargar los datos...</span>}
                                {!state.Cargando && !state.Error &&
                                    <div>
                                        <div className="row" style={{ width: '102%' }}>
                                            <div className="col-sm-12">
                                                <div className="input-group mb-3" style={{ justifyContent: 'space-between' }}>
                                                </div>
                                            </div>
                                            <div className="col-sm-12">
                                                <div style={{ backgroundColor: '#F7F7F7', padding: '1em', borderRadius: '15px' }}>
                                                    <div>
                                                        <div style={{ float: 'right' }}>
                                                            <button
                                                                className="btn btn-outline-secondary"
                                                                type="button"
                                                                onClick={() => FNGetLocal(filterData)}> <FiRefreshCcw />
                                                            </button>
                                                        </div>
                                                        <div style={{ float: 'left' }}><FaFilter /></div>
                                                        <div> <label style={{ marginLeft: '5px' }}>FILTROS</label> </div>
                                                    </div>
                                                    <div style={{ width: '100%', textAlign: 'center' }}>
                                                        <div style={{ display: 'inline-block' }}>
                                                            <Formik
                                                                initialValues={{
                                                                    FechaInicio: startDate,
                                                                    FechaFin: endDate,
                                                                    SucursalID: 0

                                                                }}
                                                                onSubmit={(values) => {
                                                                    console.log(values);
                                                                    setFilterData(set => ({ ...set, SucursalID: values.SucursalID, FechaInicio: values.FechaInicio, FechaFin: values.FechaFin }))
                                                                    FNGetLocal(filterData)

                                                                }}
                                                            >
                                                                <Form>
                                                                    <div className="row" style={{ textAlign: 'initial' }}>
                                                                        <div style={{ height: '57px', width: '290px' }}>
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
                                                                        <div style={{ height: '57px', width: '290px' }}>
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
                                                                        <div style={{ height: '67px', width: '260px' }}>
                                                                            <DatePickeStart
                                                                                name={'FechaInicio'}
                                                                                label={'Fecha Fin'}
                                                                                disabled={loading}
                                                                                placeholder={'Inicio'}
                                                                                isClearable
                                                                                startDate={startDate}
                                                                                endDate={endDate}
                                                                                setStartDate={setStartDate}
                                                                            />
                                                                        </div>
                                                                        <div style={{ height: '67px', width: '260px' }}>
                                                                            <DatePickeEnd
                                                                                name={'FechaFin'}
                                                                                label={'Fecha Fin'}
                                                                                disabled={loading}
                                                                                placeholder={'Fin'}
                                                                                isClearable
                                                                                startDate={startDate}
                                                                                endDate={endDate}
                                                                                setEndDate={setEndDate}
                                                                            />
                                                                        </div>
                                                                        <div className="col mt-1">
                                                                            <button className="button is-link mt-3" type="submit" >Buscar</button>
                                                                        </div>
                                                                    </div>
                                                                </Form>
                                                            </Formik>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {showTable &&
                                            <div className='m-1 p-5 z-2' style={{ width: '100%', height: 800 }}>
                                                <DataGrid
                                                    rows={state.DatosMostrar}
                                                    columns={columns}
                                                    // localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                                    getRowId={(row) => row.SolicitudPrestamoPersonalID}
                                                    pageSizeOptions={[15, 20, 50, 100]}
                                                    rowSelection={false}
                                                    rowHeight={42}
                                                    getRowClassName={getRowClassName}
                                                />
                                            </div>
                                        }

                                        <ModalWin open={state.Form.MostrarVerEvidencias} center={true} large>
                                            <ModalWin.Header>
                                                <h5 className={MODAL_TITLE_CLASS}>Ver Evidencias </h5>
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
                                                        <Card Title={"Evidencias de la Solicitud N°: " + state.SolicitudPrestamoPersonalID}>
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

                                        {state.Form.MostrarCancelacion &&
                                            <ModalWin open={state.Form.MostrarCancelacion} center={true} >
                                                <ModalWin.Header>
                                                    <h5 className={MODAL_TITLE_CLASS}>CANCELAR SOLICITUD PRÉSTAMO</h5>
                                                    <button type="button" className="delete" onClick={() => {
                                                        setState({
                                                            ...state,
                                                            Form: {
                                                                ...state.Form,
                                                                MostrarCancelacion: false
                                                            }
                                                        })
                                                    }} />
                                                </ModalWin.Header>
                                                <ModalWin.Body>
                                                    <CFormCancelarSolicitudPrestamoPersonal
                                                        oidc={props.oidc}
                                                        Id={state.SolicitudPrestamoPersonalID}
                                                        initialValues={state.Form.DatosCancelacion}
                                                        fnCancelar={() => setState({
                                                            ...state,
                                                            Form: {
                                                                ...state.Form,
                                                                MostrarCancelacion: false
                                                            }
                                                        })}
                                                        cbGuardar={cbGuardarCancelacion}
                                                    />
                                                </ModalWin.Body>
                                            </ModalWin>}

                                        {state.Form.MostrarPrestamo &&
                                            <ModalWin open={state.Form.MostrarPrestamo} center={true} >
                                                <ModalWin.Header>
                                                    <h5 className={MODAL_TITLE_CLASS}>EDITAR PRÉSTAMO</h5>
                                                    <button type="button" className="delete" onClick={() => {
                                                        setState({
                                                            ...state,
                                                            Form: {
                                                                ...state.Form,
                                                                MostrarPrestamo: false
                                                            }
                                                        })
                                                    }} />



                                                </ModalWin.Header>
                                                <ModalWin.Body>
                                                    <CFormEditarSolicitudPrestamoPersonal
                                                        oidc={props.oidc}
                                                        Id={state.SolicitudPrestamoPersonalID}
                                                        initialValues={state.Form.DatosPrestamo}
                                                        ui={props.ui}
                                                        fnCancelar={() => setState({
                                                            ...state,
                                                            Form: {
                                                                ...state.Form,
                                                                MostrarPrestamo: false
                                                            }
                                                        })}
                                                        cbGuardar={cbGuardarSolicitud}
                                                    />
                                                </ModalWin.Body>
                                            </ModalWin>}
                                    </div>
                                }
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI,
})
const mapDispatchToProps = {
}
export default connect(mapStateToProps, mapDispatchToProps)(CreditoSolicitudPrestamosPersonales);