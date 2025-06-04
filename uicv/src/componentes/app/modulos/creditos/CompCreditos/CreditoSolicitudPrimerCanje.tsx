import React, { useState } from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import { toast } from 'react-toastify'
import * as Funciones from './CreditoSolicitudPrimerCanje/Funciones'
// Icons
import { FaEye, FaExclamationCircle, FaFileSignature, FaFilter, FaPen, FaPencilAlt, FaPlus, FaFacebookMessenger, FaCheck, FaCheckCircle, FaMobile, FaAd, FaCheckDouble, FaBan, FaDollarSign, FaSearch, FaRegChartBar, FaBarcode, FaBars, FaChartBar, FaLevelDownAlt, FaLevelUpAlt } from 'react-icons/fa'
// Custom components
import { ActionSelect, Card, DatePickeEnd, DatePickeStart, Spinner, ImgViewer } from '../../../../global'
import PDFViewer2 from '../../../../global/PDFViewer2'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos, formatDate } from '../../../../../global/functions'
import { boolean, object, array } from '../../../../../global/idiomaValidacion.bak';
import { bool } from 'yup'
import moment from 'moment'
import { Form, Formik, FormikHelpers, validateYupSchema } from 'formik'
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
import { CFormCancelarSolicitudPrimerCanje } from './CreditoSolicitudPrimerCanje/CFormCancelarSolicitudPrimerCanje'
import { CFormEditarSolicitudPrimerCanje } from './CreditoSolicitudPrimerCanje/CFormSolicitudPrimerCanje'
import { Solicitud } from './CreditoReestructuraSolicitudes/Solicitud';

import { DataGrid, GridColDef, GridFilterModel/* , esES */ } from '@mui/x-data-grid';
import { group } from 'console'
import { Distribuidores, Sucursales } from '../../../../selectores'


type CreditoSolicitudPrimerCanjeType = {
    oidc: IOidc,
    ui: iUI
    regresa: number
    ClearSelectedRows: boolean,
    PerstamosSeleccionados: [],
    CantidadPrestamosSeleccionados: number,
    Datos5: DBConfia_Distribuidores.ISolicitudesPrestamos_VW,
}

const ValoresInicialesForm = {
    FechaInicio: moment().add(-10, 'd').toDate(),
    FechaFin: moment().toDate(),
    SucursalID: 0,
    DistribuidorID: 0
}

const CreditoSolicitudPrimerCanje = (props: CreditoSolicitudPrimerCanjeType) => {
    let isMounted = React.useRef(true)
    const MySwal = withReactContent(Swal)

    const [startDate, setStartDate] = useState(moment().add(-10, 'd').toDate());
    const [endDate, setEndDate] = useState(moment().toDate());
    const [loading, setLoading] = React.useState(false)

    const DatosDefecto = {
        Evidencias: [
            {
                DocumentoID: 0,
                SolicitudPrimerCanjeID: 0,
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
    const [FilterData, setFilterData] = useState(ValoresInicialesForm);
    const [state, setState] = React.useState({
        SolicitudPrimerCanjeID: 0,
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
            MostrarVerINE: false,
            verEvidencia: false,
            Ruta: '',
            SolicitudID: 0,
            SolicitudPrimerCanjeID: 0,
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
        Ine: {
            Frente: null,
            Reverso: null,
            Cargando: false
        }
    })

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

    const AceptarSolicitud = (SolicitudPrimerCanjeID: number) => {
        MySwal.fire({
            title: '<strong>Aceptar solicitud de canje</strong>',
            icon: 'question',
            html: <div className="text-center">Se aceptará el canje, ¿Desea Continuar?</div>,
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
                Funciones.FNAceptar(props.oidc, SolicitudPrimerCanjeID)
                    .then((resp: any) => {

                        if (resp.estatus == 1) {
                            toast.success(resp.mensaje)
                            FnGetSolicitudes(FilterData)
                        } else {
                            toast.warning(resp.mensaje)
                        }
                    })
                    .catch((error: any) => {
                        console.log(error.response);

                        MySwal.fire(
                            {
                                icon: 'error',
                                html: <div><br />
                                    <h3 className="text-center">Error</h3>
                                    <div className={`modal-body`}>
                                        <h5 className='text-center'>{error.response.data ?? 'Ocurrió un problema al aceptar el canje'}</h5>
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

    const fnMostrarModalIne = (item: any) => {
        setState(s => ({ ...s, Ine: { ...s.Ine, Cargando: false } }))
        Funciones.FnGetIne(props.oidc, item.ClienteID)
            .then((res: any) => {
                setState(s => ({
                    ...s,
                    Form: {
                        ...s.Form, MostrarVerINE: true
                    },
                    Ine: {
                        Frente: res.frenteIne,
                        Reverso: res.reversoIne,
                        Cargando: false
                    }
                }))
            }).catch(err =>
                toast.error('Ha habido un error al obtener la INE')
            )
    }


    const FnCancelarCanje = (SolicitudPrimerCanjeID) => {
        MySwal.fire({
            title: '<strong>Cancelar solicitud de canje</strong>',
            icon: 'question',
            html: <div className="text-center">Se cancelara la solicitud, ¿Desea Continuar?</div>,
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
                Funciones.FNCancelacion(props.oidc, SolicitudPrimerCanjeID)
                    .then((res: any) => {
                        if (res.estatus == 1) {
                            toast.success(res.mensaje)
                            FnGetSolicitudes(FilterData)
                        } else {
                            toast.warning(res.mensaje)
                        }
                    })
                    .catch((error: any) => {
                        console.log(error.response);

                        MySwal.fire(
                            {
                                icon: 'error',
                                html: <div><br />
                                    <h3 className="text-center">Error</h3>
                                    <div className={`modal-body`}>
                                        <h5 className='text-center'>{error.response.data ?? 'Ocurrió un problema al cancelar'}</h5>
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
        // 
        //     }).catch(err => toast.error(`Ha habido un error al realizar la cancelación ${err}`))
    }

    const columns: any[] = [
        {
            field: '', headerName: 'Acciones', width: 250, headerAlign: 'center', align: 'center', sortable: false, renderCell: (cell: any) => (
                <div className="d-flex justify-content-center">
                    <div className={`${cell.row.cancelado == true ? 'btn-disabled' : ''}`}
                        data-tip data-for={`AS_${cell.row.canjeId}`}
                    >
                        <button
                            disabled={(cell.row.Status === 'Cancelado' || cell.row.Status === 'Activo')}
                            className="btn btn-outline-default buttonIconInDTable radiusSmallDivR mx-2"
                            type="button"
                            onClick={() => AceptarSolicitud(cell.row.canjeId)}
                        >
                            <FaCheckCircle size={15} />
                            <ReactTooltip id={`AS_${cell.row.canjeId}`} type="info" effect="solid" className='z-3'>Aceptar Solicitud</ReactTooltip>
                        </button>

                    </div>
                    <div data-tip data-for={`CS_${cell.row.canjeId}`}>
                        <button
                            disabled={cell.row.Status === 'Cancelado' || cell.row.Status === 'Activo'}
                            className="btn btn-outline-default buttonIconInDTable radiusSmallDivR mx-2"
                            type="button"
                            onClick={() => FnCancelarCanje(cell.row.canjeId)}
                        >
                            <FaBan size={15} />
                            <ReactTooltip id={`CS_${cell.row.canjeId}`} type="info" effect="solid">Cancelar Solicitud</ReactTooltip>
                        </button>
                    </div>
                    <div data-tip data-for={`VE_${cell.row.canjeId}`}>
                        <button
                            className="btn btn-outline-default buttonIconInDTable radiusSmallDivR mx-2"
                            type="button"
                            onClick={() => fnMostrarModalIne(cell.row)}
                        >
                            <FaEye size={15} />
                            <ReactTooltip id={` VE_${cell.row.canjeId}`} type="info" effect="solid">Editar Solicitud</ReactTooltip>
                        </button>

                    </div>
                </div>
            )
        },
        { field: 'SolicitudCreditoID', headerName: 'SolicitudID', width: 100, align: 'center', headerAlign: 'center' },
        { field: 'DistribuidorID', headerName: 'Distribuidor ID', width: 100, align: 'center', headerAlign: 'center' },
        { field: 'NombreDV', headerName: 'Nombre Distribuidor', width: 300, align: 'center', headerAlign: 'center' },
        { field: 'ClienteID', headerName: 'Cliente ID', width: 100, align: 'center', headerAlign: 'center' },
        { field: 'nombreCliente', headerName: 'Nombre Cliente', width: 300, align: 'center', headerAlign: 'center' },

        { field: 'NombreSucursal', headerName: 'NombreSucursal', width: 200, align: 'center', headerAlign: 'center' },
        {
            field: 'telefono', headerName: 'Telefono', width: 200, align: 'center', headerAlign: 'center', valueFormatter: (params) => {
                const rawValue = params.value ? params.value.toString() : '';
                if (rawValue.length === 10) {
                    return `(${rawValue.slice(0, 3)}) ${rawValue.slice(3, 6)}-${rawValue.slice(6)}`;
                }
                return rawValue || "N/A"; // Mostrar "N/A" si no existe un valor
            }
        },
        {
            field: 'importe', headerName: 'Importe', width: 100, align: 'center', headerAlign: 'center', valueFormatter: (params) => {
                const valueFormatted = new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN'
                }).format(params.value);
                return valueFormatted;
            }
        },
        { field: 'plazos', headerName: 'Plazos', width: 100, align: 'center', headerAlign: 'center' },
        {
            field: 'fhRegistro', headerName: 'F. Registro', width: 100, align: 'center', headerAlign: 'center', valueFormatter: (params) => {
                if (!params.value) {
                    return "N/A";
                }
                const date = new Date(params.value);
                const formattedDate = date.toLocaleDateString('es-MX', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
                return formattedDate;
            }
        },
        // { field: 'cancelado', headerName: 'Cancelado', width: 100, align: 'center', headerAlign: 'center' },
        {
            field: 'fhCancelacion',
            headerName: 'F. Cancelación',
            width: 100,
            align: 'center',
            headerAlign: 'center',
            valueFormatter: (params) => {
                if (!params.value) {
                    return "N/A";  // Retorna "N/A" si no hay valor
                }
                const date = new Date(params.value);  // Convierte el valor en un objeto Date

                // Verifica si la fecha es menor a 2024
                if (date.getFullYear() < 2024) {
                    return "N/A";  // Retorna "N/A" si la fecha es menor a 2024
                }

                const formattedDate = date.toLocaleDateString('es-MX', {  // Formatea la fecha
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
                return formattedDate;  // Devuelve la fecha formateada
            }
        }
        ,
        { field: 'valeraDetalleId', headerName: 'ValeraDetalle ID', width: 100, align: 'center', headerAlign: 'center' },

        // { field: 'codigoVale', headerName: 'Codigo Vale', width: 100, align: 'center', headerAlign: 'center' },
        { field: 'CreditoID', headerName: 'Credito ID', width: 100, align: 'center', headerAlign: 'center' },
        { field: 'folio', headerName: 'Folio', width: 100, align: 'center', headerAlign: 'center' },

    ];

    const getRowClassName = (params) => params.row.Status == 'Cancelado' ? 'row-highlight-red' : '';

    const GetCatalogsData = () => {
        FnSucursales()
        FNGetTipoEstatus()
    }

    const FnGetSolicitudes = (values) => {
        setFilterData(values)
        setState(prev => ({ ...prev, Cargando: true }))
        Funciones.FNGet(props.oidc, values)
            .then((res: any) => {
                setState(prev => ({
                    ...prev,
                    Datos: res,
                }))
            })
            .catch(err => toast.error(err))
            .finally(() => setState(prev => ({
                ...prev, Cargando: false
            })))
    }

    React.useEffect(() => {
        if (isMounted) GetCatalogsData()
        return () => { isMounted.current = false }
    }, [])

    React.useEffect(() => {
        const cols = columns.map(res => ({ selector: res.field }))
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, cols, state.Filtro) }))
    }, [state.Datos, state.Filtro])

    return (
        <ContentBg>
            {state.Cargando && <Spinner />}
            {state.Error && <span>Error al cargar los datos...</span>}
            {(!state.Cargando && !state.Error) && <div>
                <FiltroStyle>
                    <Formik
                        initialValues={FilterData}
                        onSubmit={FnGetSolicitudes}
                    >{({ values, setValues }) => (<>
                        <Form>
                            <div className="row" style={{ textAlign: 'initial' }}>
                                <div style={{ height: '57px', width: '290px' }}>
                                    <ActionSelect
                                        disabled={false}
                                        label={`Sucursales`}
                                        name="SucursalID"
                                        placeholder="TODOS"
                                        options={state.optSucursales}
                                        addDefault={false}
                                        valor={values.SucursalID}
                                    />

                                </div>
                                <div style={{ height: '57px', width: '260px' }}>
                                    <Distribuidores
                                        SucursalID={values.SucursalID}
                                        RequiereSuc={true}
                                        valor={values.DistribuidorID}
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
                                    <button className="button is-link mt-3" type='submit' >Buscar</button>
                                </div>
                            </div>
                        </Form>
                    </>)}
                    </Formik>
                </FiltroStyle>
                <div className='m-1 p-5 z-2' style={{ width: '100%', height: 800 }}>
                    <DataGrid
                        rows={state.Datos}
                        columns={columns}
                        // localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                        getRowId={(row) => row.canjeId}
                        pageSizeOptions={[15, 20, 50, 100]}
                        rowSelection={false}
                        rowHeight={42}
                        getRowClassName={getRowClassName}
                    />
                </div>


                <ModalWin open={state.Form.MostrarVerINE} center={true} large>
                    <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>Ver INE </h5>
                        <button type="button" className="delete" onClick={() => {
                            setState({
                                ...state,
                                Form: {
                                    ...state.Form,
                                    MostrarVerINE: false
                                }
                            })
                        }} />
                    </ModalWin.Header>
                    <ModalWin.Body>
                        <div className="row">
                            <div className="col-12">
                                <Card Title={"INE " + state.SolicitudPrimerCanjeID}>
                                    <Card Title={"Frente"}>
                                        {state.Ine.Frente && <img src={`data:image/png;base64, ${state.Ine.Frente}`} alt="" />}
                                    </Card>
                                    <Card Title={"Reverso"}>
                                        {state.Ine.Reverso && <img src={`data:image/png;base64, ${state.Ine.Reverso}`} alt="" />}
                                    </Card>
                                </Card>
                            </div>
                        </div>
                    </ModalWin.Body>
                </ModalWin>
                {/* <ModalWin open={state.Form.MostrarImagenesEvidencia} center={true} large>
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
                </ModalWin> */}

                {/* {state.Form.MostrarCancelacion &&
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
                            <CFormCancelarSolicitudPrimerCanje
                                oidc={props.oidc}
                                Id={state.SolicitudPrimerCanjeID}
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
                    </ModalWin>} */}

                {/* {state.Form.MostrarPrestamo &&
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
                            <CFormEditarSolicitudPrimerCanje
                                oidc={props.oidc}
                                Id={state.SolicitudPrimerCanjeID}
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
                    </ModalWin>} */}
            </div>
            }
        </ContentBg >
    )
}

const ContentBg = ({ children }) => (<React.Fragment>
    <div className='row'>
        <div className='col-12'>
            <Card Title={'REVISIÓN DE SOLICITUDES DE PRIMEROS CANJES'}>
                <Card.Body>
                    <Card.Body.Content>
                        {children}
                    </Card.Body.Content>
                </Card.Body>
            </Card>
        </div>
    </div>
</React.Fragment >)

const FiltroStyle = ({ children }) => (
    <div className="row" style={{ width: '102%' }}>
        <div className="col-sm-12">
            <div className="input-group mb-3" style={{ justifyContent: 'space-between' }}>
            </div>
        </div>
        <div className="col-sm-12">
            <div style={{ backgroundColor: '#F7F7F7', padding: '1em', borderRadius: '15px' }}>
                <div>
                    <div style={{ float: 'left' }}><FaFilter /></div>
                    <div> <label style={{ marginLeft: '5px' }}>FILTROS</label> </div>
                </div>
                <div style={{ width: '100%', textAlign: 'center' }}>
                    <div style={{ display: 'inline-block' }}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    </div>)


const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI,
})
const mapDispatchToProps = {
}
export default connect(mapStateToProps, mapDispatchToProps)(CreditoSolicitudPrimerCanje);