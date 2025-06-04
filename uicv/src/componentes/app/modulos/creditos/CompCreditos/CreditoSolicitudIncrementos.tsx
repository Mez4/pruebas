import React, { useState } from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import { toast } from 'react-toastify'
import * as Funciones from './CreditoSolicitudIncremento/Funciones'
// Icons
import { FaEye, FaExclamationCircle, FaFileSignature, FaFilter, FaPen, FaPencilAlt, FaPlus, FaFacebookMessenger, FaCheck, FaCheckCircle, FaMobile, FaAd, FaCheckDouble, FaBan, FaDollarSign, FaSearch, FaRegChartBar, FaBarcode, FaBars, FaChartBar, FaLevelDownAlt, FaLevelUpAlt } from 'react-icons/fa'
// Custom components
import { ActionSelect, Card, DatePickeEnd, DatePickeStart, Spinner, ImgViewer } from '../../../../global'
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


type CatalogosType = {
    oidc: IOidc,
    ui: iUI
    regresa: number
    ClearSelectedRows: boolean,
    IncrememtosSeleccionados: [],
    CantidadIncrementosSeleccionados: number,
    Datos5: DBConfia_Distribuidores.ISolicitudesIncrementos_VW[],


}
const CreditoSolicitudIncrementos = (props: CatalogosType) => {    // Controll our mounted state
    let isMounted = React.useRef(true)
    const MySwal = withReactContent(Swal)

    const [startDate, setStartDate] = useState(moment().add(-1, 'y').toDate());
    const [endDate, setEndDate] = useState(moment().toDate());
    const [loading, setLoading] = React.useState(false)
    const DatosDefectoEstatus = {
        EstatusID: 0,
    }
    const DatosDefectoIncremento = {
        IncrementoSolicitado: 0,
    }
    const DatosDefectoCancelacion = {
        MotivoCancelacion: '',
    }
    const Datos: any[] = []
    const Datos2: any[] = []
    const Datos3: any[] = []
    const DatosMostrar: any[] = []
    const OptionsUsuario: any[] = []
    const optSucursales: any[] = []
    const optEstatus: any[] = []
    const FiltroSucursal: number = 0
    const FiltroEstatus: number = 0
    const [state, setState] = React.useState({
        SolicitudID: 0,
        Datos,
        Datos2,
        Datos3,
        DatosMostrar,
        CargandoOverlay: false,
        optSucursales,
        optEstatus,
        TipoEstatus: [],
        DatosInc: [],
        IncrementosSeleccionados: [],
        CantidadIncrementosSeleccionados: 0,
        ClearSelectedRows: false,
        Filtro: '',
        Cargando: false,
        Error: false,
        Form: {
            src: '',
            MostrarAsignarEstatus: false,
            MostrarIncremento: false,
            MostrarCancelacion: false,
            Ruta: '',
            SolicitudID: 0,
            Mostrar: false,
            DatosEstatus: DatosDefectoEstatus,
            DatosIncremento: DatosDefectoIncremento,
            DatosCancelacion: DatosDefectoCancelacion,
            Id: undefined,
        },
        OptionsUsuario,
        FiltroSucursal,
        FiltroEstatus,
    })

    /*const cbGuardarAsignarAclaracion = (item: any) => {

        let index = state.Datos.findIndex((x: any) => x.AclaracionID === item.AclaracionID)
        if (index > -1) {
            state.Datos[index].AnalistaID = item.AnalistaID
            state.Datos[index].AnalistaNombre = item.AnalistaNombre
        }
        setState({ ...state })
    }*/

    const cbGuardarIncremento = (item: any) => {
        console.log("ITEM RECIBIDO", item)
        let index = state.Datos2.findIndex((x: any) => x.SolicitudID === item.SolicitudID)
        if (index > -1) {
            state.Datos2[index].SolicitudID = item.SolicitudID,
                state.Datos2[index].IncrementoSolicitdo = item.IncrementoSolicitado
        }
        setState({ ...state })
        FNGetLocal()
    }

    const cbGuardarCancelacion = (item: any) => {
        console.log("ITEM RECIBIDO", item)
        let index = state.Datos3.findIndex((x: any) => x.SolicitudID === item.SolicitudID)
        if (index > -1) {
            state.Datos3[index].SolicitudID = item.SolicitudID,
                state.Datos3[index].MotivoCancelacion = item.MotivoCancelacion
        }
        setState({ ...state })
        FNGetLocal()
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

    const FNGetTipoEstatus = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetTipoEstatus(props.oidc)
            .then((respuesta: any) => {

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
        console.log(SucursalID)
        setState(s => ({ ...s, FiltroSucursal: SucursalID }))
    }
    const fnGetFiltroEstatus = (EstatusID: number) => {
        setState(s => ({ ...s, FiltroEstatus: EstatusID }))
    }

    function formatearFecha(fecha) {
        return moment(fecha).format("DD/MM/YYYY")
    }

    const [selectedRows, setSelectedRows] = React.useState([]);

    const [toggleCleared, setToggleCleared] = React.useState(true);

    const handleRowSelected = React.useCallback(state => {
        setSelectedRows(state.selectedRows);
        console.log(selectedRows)
    }, []);


    const contextActions = React.useMemo(() => {
        console.log("Arreglo final ,", selectedRows)

        const handleClick = () => {
            let total = 0;
            selectedRows.forEach(element => {
                total = total + 1
            });
            MySwal.fire({
                title: '<strong>Aceptación de Solicitudes de Incrementos</strong>',
                icon: 'info',
                html:
                    <div className="text-center">
                        <br />
                        Se aceparán un total de <strong>{total}</strong> incrementos, ¿desea continuar?.
                    </div>,
                showCloseButton: false,
                showCancelButton: true,
                showConfirmButton: true,
                focusCancel: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Aceptar',
                confirmButtonAriaLabel: 'Aceptar',
                cancelButtonAriaLabel: 'Cancelar',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
            }).then((result) => {
                if (result.isConfirmed) {
                    MySwal.fire({
                        title: '<strong>Solicitudes de Incrementos</strong>',
                        icon: 'warning',
                        html:
                            <div className="text-center">
                                <br />
                                Total de {total} incremento/s seleccionado/s para aceptar, ¿confirmar?.
                                <br /> <br /><h5><strong style={{ color: 'red' }}>Nota: Esta acción no se puede cancelar ni revertir.</strong></h5>
                            </div>,
                        showCloseButton: false,
                        showCancelButton: true,
                        showConfirmButton: true,
                        focusCancel: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonText: 'Aceptar',
                        confirmButtonAriaLabel: 'Aceptar',
                        cancelButtonAriaLabel: 'Cancelar',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            /*MySwal.fire(
                                {
                                    icon: 'info',
                                    html: <div><br />
                                        <h3 className="text-center">Aviso</h3>
                                        <div className={`modal-body`}>
                                            <h5 className="text-center">Aceptación de incrementos en progreso...</h5>
                                        </div>
                                    </div>,
                                    timerProgressBar: true,
                                    allowEscapeKey: false,
                                    allowOutsideClick: false,
                                    showConfirmButton: false,
                                    showCancelButton: false,
                                    showCloseButton: false,
                                    didOpen: () => {
                                        MySwal.showLoading()
                                    },

                                }
                            );*/
                            let a = {
                                Incremento: selectedRows
                            }
                            console.log("A", a)
                            Funciones.FNAceptarM(props.oidc, a)
                                .then((respuesta: any) => {
                                    if (respuesta.regresa == 1) {
                                        respuesta.Incremento.forEach(element => {
                                            console.log("Respuesta", respuesta)
                                            let index = state.Datos.findIndex(x => x.SolicitudID === element.SolicitudID);
                                            if (index !== -1) {
                                                state.Datos.splice(index, 1);
                                            }
                                        })
                                        setToggleCleared(!toggleCleared);
                                        setState({ ...state, Datos: state.Datos, DatosMostrar: state.Datos })
                                        MySwal.close();
                                        MySwal.fire({
                                            icon: 'success',
                                            title: '<strong>Acepatción de incrementos</strong>',
                                            html:
                                                <div className="text-center">
                                                    <br />
                                                    <h5>Se aceptaron <strong>{respuesta.IncrementosRegistrados} </strong> incrementos de <strong>{respuesta.IncrementosRecibidos}</strong> solicitados.</h5>
                                                </div>,
                                            showCloseButton: false,
                                            showCancelButton: false,
                                            showConfirmButton: true,
                                            focusCancel: true,
                                            confirmButtonText: 'Aceptar',
                                            confirmButtonAriaLabel: 'Aceptar',
                                            confirmButtonColor: '#3085d6',
                                        })
                                        console.log("mensajes", respuesta)
                                        toast.success(respuesta)
                                        FNGetLocal()
                                    }
                                    else {
                                        console.log("mensajes", respuesta)

                                        setLoading(false)
                                        toast.success(respuesta)
                                        FNGetLocal();
                                    }
                                })
                                .catch(() => {
                                    if (isMounted.current === true) {
                                        toast.error("Error al realizar la operación")
                                        MySwal.close();
                                    }
                                })
                        } else {
                            MySwal.fire(
                                {
                                    icon: 'info',
                                    html: <div><br />
                                        <h3 className="text-center">Aviso</h3>
                                        <div className={`modal-body`}>
                                            <h5 className="text-center">Operación cancelada por el usuario.</h5>
                                        </div>
                                    </div>,
                                    cancelButtonText: 'Cancelar',
                                    confirmButtonText: 'Aceptar',
                                    confirmButtonColor: '#3085d6',
                                    confirmButtonAriaLabel: 'Aceptar',
                                    cancelButtonAriaLabel: ''
                                }
                            );
                        }
                    })
                } else {
                    MySwal.fire(
                        {
                            icon: 'info',
                            html: <div><br />
                                <h3 className="text-center">Aviso</h3>
                                <div className={`modal-body`}>
                                    <h5 className="text-center">Operación cancelada por el usuario.</h5>
                                </div>
                            </div>,
                            cancelButtonText: 'Cancelar',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#3085d6',
                            confirmButtonAriaLabel: 'Aceptar',
                            cancelButtonAriaLabel: ''
                        }
                    );
                }
            })

        }

        return (
            <button data-tip data-for="TT1_1" style={{ backgroundColor: '#28a745', color: 'white' }}
                type="button" className="ms-2 btn waves-effect waves-light" onClick={handleClick}>
                <BsFillBarChartFill />  Aceptar Incrementos Seleccionados
            </button>
        );
    }, [selectedRows]);



    const disableRow = (item: any) => {
        if (item.EstatusID == 3 || item.EstatusID == 1) {
            return true
        } else {
            return false
        }
    }


    const AceptarSolicitud = (item: any) => {
        MySwal.fire({
            title: '<strong>SOLICITAR INCREMENTO</strong>',
            icon: 'question',
            html:
                <div className="text-center">
                    Se incrementará crédito, ¿desea continuar?
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
                /*MySwal.fire(
                    {
                        icon: 'info',
                        html: <div><br />
                            <h3 className="text-center">Aviso</h3>
                            <div className={`modal-body`}>
                                <h5 className="text-center">Incrementando crédito...</h5>
                            </div>
                        </div>,
                        confirmButtonText: `Aceptar`,
                        allowOutsideClick: false,
                        //timer: 500,
                        didOpen: () => {
                            MySwal.showLoading()
                        },
                    }
                );*/


                Funciones.FNAceptar(props.oidc, item)
                    .then((resp: any) => {
                        console.log("resp: ", resp)
                        setLoading(false)
                        if (resp.regresa == 1) {
                            MySwal.fire(
                                {
                                    icon: 'success',
                                    html: <div><br />
                                        <h3 className="text-center">Aviso</h3>
                                        <div className={`modal-body`}>
                                            <h5 className="text-center">Se Incremento Crédito Exitosamente</h5>
                                        </div>
                                    </div>,
                                    //timerProgressBar: true,
                                    confirmButtonText: `Aceptar`,
                                    allowOutsideClick: false,
                                    //timer: 500,
                                    /*  didOpen: () => {
                                         MySwal.showLoading()
                                     }, */
                                }
                            );
                            toast.success(resp.msj)
                            FNGetLocal()
                        }
                        else {

                            setLoading(false)
                            toast.error(resp.msj)
                        }

                    })
                    .catch((error: any) => {
                        MySwal.fire(
                            {
                                icon: 'error',
                                html: <div><br />
                                    <h3 className="text-center">Error</h3>
                                    <div className={`modal-body`}>
                                        <h5 className="text-center">Ocurrió un problema al crear el crédito.</h5>
                                    </div>
                                </div>,
                                confirmButtonText: `Aceptar`,
                                allowOutsideClick: false,
                            }
                        );
                        console.log(JSON.stringify(error))
                        console.log(error)
                        setLoading(false)
                    })
            } else {
                MySwal.fire(
                    {
                        icon: 'error',
                        html: <div><br />
                            <h3 className="text-center">Error</h3>
                            <div className={`modal-body`}>
                                <h5 className="text-center">Operación cancelada por el usuario.</h5>
                            </div>
                        </div>,
                        //timerProgressBar: true,
                        confirmButtonText: `Ok`,
                        allowOutsideClick: false,
                        //timer: 500,

                    }
                );
            }
        })

    }

    /*const disableRow = (item: any) => {
        if (item.datoBancario == null || item.DispersionID > 0 && item.EstadoID != 'A' || item.EsReintento) {
            return true
        } else {
            return false
        }
    }*/


    const Columns: IDataTableColumn[] =
        [
            {
                center: true,
                name: 'Id',
                selector: 'SolicitudID',

                sortable: false
            },
            {
                name: 'Producto',
                selector: 'Producto',
                center: true,
                sortable: false
            },
            {
                name: 'Sucursal',
                selector: 'NombreSucursal',
                sortable: false,
                center: true,
                minWidth: "200px",
                cell: (props) => <span className='text'>{props.NombreSucursal}</span>
            },
            {
                name: 'Id Contrato',
                selector: 'ContratoID',
                center: true,
                sortable: false
            },
            {
                name: 'Socia',
                selector: 'PersonaNombre',
                center: true,
                sortable: false,
                minWidth: "300px",
                //width: '15%',
                cell: (propss) => <span className="text-center">{propss.PersonaNombre}</span>

            },
            {
                center: true,
                name: 'Incremento Solicitado',
                selector: 'IncrementoSolicitado',
                sortable: false,

            },
            {
                center: true,
                name: 'Incremento Autorizado',
                selector: 'IncrementoAutorizado',
                sortable: false,

                minWidth: "150px",
                // width: '11%',
                cell: props => <span className='text-center'>{props.EstatusID == 3 ? 'CANCELADO' : props.IncrementoAutorizado != undefined ? props.IncrementoAutorizado : "Pendiente Autorización"}</span>
            },
            {
                name: 'Observaciones',
                selector: 'Observaciones',
                sortable: false,
                center: true,
                minWidth: "200px",
                //width: '11%',
                cell: row => <span className='text-center'>{row.Observaciones ? (row.Observaciones) : 'Sin Observaciones'}</span>
            },
            {
                name: 'Usuario Solicito',
                selector: 'UsuarioSolicito',
                sortable: false,
                center: true,
                minWidth: "300px",
                //width: '15%',
                cell: (propss) => <span className="text-center">{propss.UsuarioSolicito}</span>
            },
            {
                name: 'Fecha Solicito',
                selector: 'FechaSolicitud',
                center: true,
                sortable: false,
                minWidth: "110px",
                //width:'11%',
                cell: (props) => <span className="text-center">{props.FechaSolicitud ? formatearFecha(props.FechaSolicitud) : ''}</span>
            },
            {
                name: 'Usuario Autoriza',
                selector: 'UsuarioAutorizo',
                sortable: false,
                center: true,
                minWidth: "300px",
                //width: '15%',
                cell: row => <span className='text-center'>{row.UsuarioAutorizo ? (row.UsuarioAutorizo) : 'N/A'}</span>
            },
            {
                name: 'Fecha Autorización',
                selector: 'FechaAutorizacion',
                sortable: false,
                center: true,
                minWidth: "110px",
                cell: props => <span className='text-center'>{props.FechaAutorizacion == undefined ? "N/A" : formatearFecha(props.FechaAutorizacion)}
                </span>
            },

            {
                name: 'Usuario Modifica',
                selector: 'UsuarioModifica',
                sortable: false,
                center: true,
                minWidth: "300px",
                //width: '15%',
                cell: row => <span className='text-center'>{row.UsuarioModifica ? (row.UsuarioModifica) : 'N/A'}</span>
            },
            {
                name: 'Fecha Modificación',
                selector: 'FechaModifica',
                sortable: false,
                center: true,
                minWidth: "110px",
                cell: props => <span className='text-center'>{props.FechaModifica == undefined ? "N/A" : formatearFecha(props.FechaModifica)}
                </span>
            },
            {
                name: 'Usuario Cancela',
                selector: 'UsuarioCancelo',
                sortable: false,
                center: true,
                minWidth: "300px",
                //width: '15%',
                cell: row => <span className='text-center'>{row.UsuarioCancelo ? (row.UsuarioCancelo) : 'N/A'}</span>
            },
            {
                name: 'Fecha Cancelación',
                selector: 'FechaAutorizacion',
                sortable: false,
                center: true,
                minWidth: "110px",
                cell: props => <span className='text-center'>{props.FechaCancelacion == undefined ? "N/A" : formatearFecha(props.FechaCancelacion)}
                </span>
            },
            {
                name: 'Motivo Cancelación',
                selector: 'MotivoCancelacion',
                sortable: false,
                center: true,
                minWidth: "200px",
                cell: row => <span className='text-center'>{row.MotivoCancelacion ? (row.MotivoCancelacion) : 'Sin Motivo'}</span>
            },
            {
                name: 'Estatus',
                selector: 'Estatus',
                center: true,
                sortable: false,
                minWidth: "115px",
                cell: (props) => <span className='text'>{props.Estatus}</span>
            },
            {
                name: 'Editar Incremento',
                center: true,
                sortable: false,
                cell: (propss) =>
                    <div className='divInDTable text-center radiusSmallDivR' data-tip data-for={`ES_${propss.SolicitudID}`}>
                        <button
                            disabled={(propss.EstatusID == 3 || propss.EstatusID == 1)}
                            className="btn btn-outline-default buttonIconInDTable"
                            type={"button"}
                            onClick={() => {
                                console.log(propss)
                                setState({

                                    ...state,
                                    SolicitudID: propss.SolicitudID,
                                    Form: {
                                        ...state.Form,
                                        MostrarIncremento: true,
                                        DatosIncremento: {
                                            ...state.Form.DatosIncremento,
                                            IncrementoSolicitado: propss.IncrementoSolicitado,
                                        }
                                    }
                                })
                            }}>
                            <FaPencilAlt />
                            <ReactTooltip id={`ES_${propss.SolicitudID}`} type="info" effect="solid">Editar Monto</ReactTooltip>
                        </button>
                    </div>
            },
            {
                name: 'Aceptar Incremento',
                center: true,
                sortable: false,
                cell: (propss) =>
                    <div className='divInDTable text-center radiusSmallDivR' data-tip data-for={`AS_${propss.SolicitudID}`}>
                        <button
                            disabled={(propss.EstatusID == 3 || propss.EstatusID == 1)}
                            className="btn btn-outline-default buttonIconInDTable"
                            type={"button"}
                            onClick={() => AceptarSolicitud(propss)}>
                            <FaCheckCircle />
                            <ReactTooltip id={`AS_${propss.SolicitudID}`} type="info" effect="solid">Aceptar Solicitud</ReactTooltip>
                        </button>
                    </div>
            },
            {
                name: 'Cancelar Incremento',
                center: true,
                sortable: false,
                cell: (propss) =>
                    <div className='divInDTable text-center radiusSmallDivR' data-tip data-for={`CS_${propss.SolicitudID}`}>
                        <button
                            disabled={(propss.EstatusID == 3 || propss.EstatusID == 1)}
                            className="btn btn-outline-default buttonIconInDTable"
                            type={"button"}
                            onClick={() => {
                                setState({
                                    ...state,
                                    SolicitudID: propss.SolicitudID,
                                    Form: {
                                        ...state.Form,
                                        MostrarCancelacion: true,
                                        DatosCancelacion: {
                                            ...state.Form.DatosCancelacion,
                                            MotivoCancelacion: propss.MotivoCancelacion,
                                        }
                                    }
                                })
                            }}>
                            <FaBan />
                            <ReactTooltip id={`CS_${propss.SolicitudID}`} type="info" effect="solid">Cancelar Solicitud</ReactTooltip>
                        </button>
                    </div>
            },



        ]
    React.useEffect(() => {
        FnSucursales()
        FNGetLocal()
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
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        FnFiltrando()
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])
    return (
        <React.Fragment>
            <div className="row ">
                <div className="col-12">
                    <Card Title="REVISIÓN DE SOLICITUDES DE INCREMENTOS">
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
                                                                                name={'FechaSolicitud'}
                                                                                label={'Fecha de Solicitud'}
                                                                                disabled={loading}
                                                                                placeholder={'Inicio'}
                                                                                isClearable startDate={startDate}
                                                                                endDate={endDate}
                                                                                setStartDate={setStartDate}
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
                                            contextActions={contextActions}
                                            clearSelectedRows={toggleCleared}
                                            onSelectedRowsChange={handleRowSelected}

                                            paginationComponentOptions=
                                            {{
                                                rowsPerPageText: 'Registros por pagina:',
                                                rangeSeparatorText: 'de',
                                                noRowsPerPage: false,
                                                selectAllRowsItem: false,
                                                selectAllRowsItemText: 'Todo'
                                            }}
                                            contextMessage=
                                            {{
                                                singular: '- Incremento seleccionado',
                                                plural: '- Incrementos seleccionados',
                                                message: 'para aceptar'
                                            }}
                                            selectableRowDisabled={(row: any) => disableRow(row)}
                                            selectableRows
                                            noDataComponent={<div style={{ margin: '4em' }}> {<><FaExclamationCircle color={'grey'} size={20} />  NO HAY SOLICITUDES </>}</div>}
                                            title={<span>Lista de Solicitudes Incrementos</span>}


                                            data={state.DatosMostrar}
                                            striped
                                            pagination
                                            dense
                                            responsive
                                            keyField={"SolicitudID"}
                                            defaultSortField={"SolicitudID"}
                                            columns={Columns}

                                        />

                                        {state.Form.MostrarCancelacion &&
                                            <ModalWin open={state.Form.MostrarCancelacion} center={true} >
                                                <ModalWin.Header>
                                                    <h5 className={MODAL_TITLE_CLASS}>CANCELAR SOLICITUD INCREMENTO </h5>
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
                                                    <CFormCancelarSolicitud
                                                        oidc={props.oidc}
                                                        Id={state.SolicitudID}
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

                                        {state.Form.MostrarIncremento &&
                                            <ModalWin open={state.Form.MostrarIncremento} center={true} >
                                                <ModalWin.Header>
                                                    <h5 className={MODAL_TITLE_CLASS}>EDITAR INCREMENTO </h5>
                                                    <button type="button" className="delete" onClick={() => {
                                                        setState({
                                                            ...state,
                                                            Form: {
                                                                ...state.Form,
                                                                MostrarIncremento: false
                                                            }
                                                        })
                                                    }} />
                                                </ModalWin.Header>
                                                <ModalWin.Body>
                                                    <CFormEditarSolicitud
                                                        oidc={props.oidc}
                                                        Id={state.SolicitudID}
                                                        initialValues={state.Form.DatosIncremento}
                                                        fnCancelar={() => setState({
                                                            ...state,
                                                            Form: {
                                                                ...state.Form,
                                                                MostrarIncremento: false
                                                            }
                                                        })}
                                                        cbGuardar={cbGuardarIncremento}
                                                    />
                                                </ModalWin.Body>
                                            </ModalWin>}


                                    </div>
                                }
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
            </div >
        </React.Fragment >
    )
}







const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI,
})
const mapDispatchToProps = {
}
export default connect(mapStateToProps, mapDispatchToProps)(CreditoSolicitudIncrementos);