import React, { useState } from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import { toast } from 'react-toastify'
import * as Funciones from '../CompAdministracion/Funciones'
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
//import { CFormCancelarSolicitud } from './CreditoSolicitudIncremento/CFormCancelarSolicitud'
import { format } from 'path';
//import { CFormEditarSolicitud } from './CreditoSolicitudIncremento/CFormEditarSolicitud'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { iUI } from '../../../../../interfaces/ui/iUI'
import { DBConfia_Distribuidores } from '../../../../../interfaces_db/DBConfia/Distribuidores'
//import Incrementos from '../../personas/CompAdministracion/Incrementos/Incrementos';
import { AiOutlineBarChart, AiOutlineBarcode, AiOutlineBars } from 'react-icons/ai'
import { BiBarChart, BiBarChartAlt, BiBarChartAlt2, BiBarChartSquare, BiBarcode, BiBarcodeReader } from 'react-icons/bi'
import { BsFillBarChartFill, BsFillBarChartLineFill, BsFillFileBarGraphFill, BsFillFileEarmarkBarGraphFill, BsReverseLayoutSidebarInsetReverse } from 'react-icons/bs'
type CatalogosSolicitudSociaType = {
    oidc: IOidc,
    ui: iUI
    regresa: number
    ClearSelectedRows: boolean,
    SolicitudesSeleccionados: [],
    CantidadSolicitudesSeleccionadas: number,
}

const SolicitudCancelacionesTemporales = (props: CatalogosSolicitudSociaType) => {
    let isMounted = React.useRef(true)
    const MySwal = withReactContent(Swal)

    const [loading, setLoading] = React.useState(false)
    const [loading2, setLoading2] = React.useState(false)

    const DatosDefectoEstatus = {
        EstatusID: 0
    }
    const DatosDefectoSolicitud = {
        Observaciones: ''
    }
    const DatosDefectoCancelacion = {
        MotivoCancelacion: ''
    }
    const DatosDefecto = {
        Evidencias: [
            {
                SolicitudID: 0,
                Ruta: ''
            }

        ]
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

    const [state, setState] = React.useState({
        SolicitudID: 0,
        Datos,
        Datos2,
        Datos3,
        DatosMostrar,
        Evidencias,
        CargandoOverlay: false,
        //optSucursales,
        optEstatus,
        TipoEstatus: [],
        DatosPre: [],
        SolicitudesSeleccionadas: [],
        CantidadSolicitudesSeleccionadas: 0,
        ClearSelectedRows: false,
        Filtro: '',
        Cargando: false,
        Error: false,
        Form: {
            src: '',
            MostrarAsignarEstatus: false,
            MostrarSolicitud: false,
            MostrarCancelacion: false,
            MostrarVerEvidencias: false,
            Ruta: '',
            SolicitudID: 0,
            Mostrar: false,
            DatosEstatus: DatosDefectoEstatus,
            DatosSolicitud: DatosDefectoSolicitud,
            DatosCancelacion: DatosDefectoCancelacion,
            Id: undefined,
        },
        FiltroSucursal,
        FiltroEstatus,
    })

 
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
        }
        )
            .catch((error: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const FNGetTipoEstatus = () => {
        setState(s => ({ ...s, }))
        Funciones.FNGetEstatusSolicitud(props.oidc, FiltroEstatus)
            .then((respuesta: any) => {
                console.log("FnEstatus: ", respuesta)
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
        console.log("Mostrando el estatus: " + EstatusID);
        setState(s => ({ ...s, FiltroEstatus: EstatusID }))
        Funciones.FNGetV2(props.oidc).then((res: any) => {
            console.log(res);
            if (isMounted.current === true) {
                console.log("###", res);
                if (res.mensajePeticion === undefined) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: res }))
                }
                else {
                    setState(s => ({ ...s, Cargando: false }))
                    toast.error("Error al obtener los datos, permisos insuficientes")
                }
                //         setState(s => ({ ...s, Cargando: false, Error: false, Datos: res }))}
            }
        }).catch(err => {
            // toast.error ("ERROR EN V2")
            if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
            }
        })
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
                title: '<strong>Aceptación de Solicitudes de Cancelaciones Temporales</strong>',
                icon: 'info',
                html:
                    <div className="text-center">
                        <br />
                        Se aceptarán un total de <strong>{total}</strong> solicitudes, ¿desea continuar?.
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
                        title: '<strong>Solicitudes de Cancelación Temporal</strong>',
                        icon: 'warning',
                        html:
                            <div className="text-center">
                                <br />
                                Total de {total} solicitude/s seleccionada/s para aceptar, ¿confirmar?.
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
                            let a = {
                                Prestamo: selectedRows
                            }
                            console.log("A", a)
                        }
                        else {
                            setLoading(false)
                           
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
        }
        return (
            <button data-tip data-for="TT1_1" style={{ backgroundColor: '#28a745', color: 'white' }}
                type="button" className="ms-2 btn waves-effect waves-light" onClick={handleClick}>
                <BsFillBarChartFill />  Aceptar Solicitudes Seleccionadas
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

    //
    const AceptarSolicitud = (item: any) => {
        MySwal.fire({
            title: '<strong>Aceptar Solicitud</strong>',
            icon: 'question',
            html:
                <div className="text-center">
                    Se aceptará la solicitud, ¿desea continuar?
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
                Funciones.FNAceptar(props.oidc, item)
                    .then((resp: any) => {
                        console.log("resp: ", resp)
                        setLoading(false)
                        if (resp.EstatusID == 1) {
                            
                            MySwal.fire(
                                {
                                    icon: 'success',
                                    html: <div><br />
                                        <h3 className="text-center">Aviso</h3>
                                        <div className={`modal-body`}>
                                            <h5 className="text-center">Se cancelo socia temporalmente</h5>
                                        </div>
                                    </div>,
                                    confirmButtonText: `Aceptar`,
                                    allowOutsideClick: false,
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
                                        <h5 className="text-center">Ocurrió un problema al aceptar el préstamo.</h5>
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
            }
            else {
                MySwal.fire(
                    {
                        icon: 'error',
                        html: <div><br />
                            <h3 className="text-center">Error</h3>
                            <div className={`modal-body`}>
                                <h5 className="text-center">Operación cancelada por el usuario.</h5>
                            </div>
                        </div>,
                        confirmButtonText: `Ok`,
                        allowOutsideClick: false,
                    }
                );
            }
        })
    }

    const CancelarSolicitud = (item: any) => {
        MySwal.fire({
            title: '<strong>Cancelar Solicitud</strong>',
            icon: 'question',
            html:
                <div className="text-center">
                    Se cancelará la solicitud, ¿Desea continuar?
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
                Funciones.FNCalcelarSolicitud(props.oidc, item)
                    .then((resp: any) => {
                        console.log("resp: ", resp)
                        setLoading(false)
                        if (resp.EstatusID == 1) {
                            MySwal.fire(
                                {
                                    icon: 'success',
                                    html: <div><br />
                                        <h3 className="text-center">Aviso</h3>
                                        <div className={`modal-body`}>
                                            <h5 className="text-center">Se canceló socia temporalmente</h5>
                                        </div>
                                    </div>,
                                    confirmButtonText: `Aceptar`,
                                    allowOutsideClick: false,
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
                                        <h5 className="text-center">Ocurrió un problema al cancelar.</h5>
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
            }
            else {
                MySwal.fire(
                    {
                        icon: 'error',
                        html: <div><br />
                            <h3 className="text-center">Error</h3>
                            <div className={`modal-body`}>
                                <h5 className="text-center">Operación cancelada por el usuario.</h5>
                            </div>
                        </div>,
                        confirmButtonText: `Ok`,
                        allowOutsideClick: false,
                    }
                );
            }
        })
    }

    const Columns: IDataTableColumn[] =
        [
            {
                name: 'Id',
                center: true,
                selector: 'SolicitudID',
                sortable: false
            },
            {
                name: 'Socia',
                center: true,
                selector: 'PersonaNombre',
                sortable: true,
                minWidth: "300px",
                //width: '15%',
                cell: (props) => <span className="text-center">{props.NombreCompleto}</span>

            },
            // {
            //     name: 'Solicitud Autorizada',
            //     center: true,
            //     selector: 'PrestamoAutorizado',
            //     sortable: false,

            //     minWidth: "150px",
            //     // width: '11%',
            //     cell: props => <span className='text-center'>{props.EstatusID == 3 ? 'CANCELADO' : props.PrestamoAutorizado != undefined ? props.PrestamoAutorizado : "Pendiente Autorización"}</span>
            // },
            {
                name: 'Observaciones',
                center: true,
                selector: 'Observaciones',
                sortable: false,
                minWidth: "200px",
                //width: '11%',
                cell: row => <span className='text-center'>{row.Observaciones ? (row.Observaciones) : 'Sin Observaciones'}</span>
            },
            {
                name: 'Tipo de Solicitud',
                selector: 'Estatus',
                center: true,
                sortable: false,
                minWidth: "150px",
                cell: (props) => <span className='text'>{props.Estatus}</span>
            },
            {
                name: 'Usuario Solicito',
                center: true,
                selector: 'UsuarioRegistraID',
                sortable: false,
                minWidth: "300px",
                //width: '15%',
                cell: (props) => <span className="text-center">{props.UsuarioSolicito}</span>
            },
            {
                name: 'Fecha Solicito',
                center: true,
                selector: 'FechaSolicitud',
                sortable: false,
                minWidth: "110px",
                //width:'11%',
                cell: (props) => <span className="text-center">{props.FechaRegistra == undefined ? "N/A" : formatearFecha(props.FechaRegistra)}</span>
            },
            // {
            //     name: 'Usuario Autoriza',
            //     center: true,
            //     selector: 'UsuarioAutorizo',
            //     sortable: false,
            //     minWidth: "300px",
            //     //width: '15%',
            //     cell: row => <span className='text-center'>{row.UsuarioAutorizo ? (row.UsuarioAutorizo) : 'N/A'}</span>
            // },
            // {
            //     name: 'Fecha Autorización',
            //     center: true,
            //     selector: 'FechaAutorizacion',
            //     sortable: false,
            //     minWidth: "110px",
            //     cell: props => <span className='text-center'>{props.FechaAutorizacion == undefined ? "N/A" : formatearFecha(props.FechaAutorizacion)}
            //     </span>
            // },
            {
                name: 'Aceptar Solicitud',
                center: true,
                sortable: false,
                cell: (propss) =>
                    <div className='divInDTable text-center radiusSmallDivR' data-tip data-for={`AS_${propss.SolicitudID}`}>
                        <button
                            //  disabled={(propss.EstatusID == 3 || propss.EstatusID == 1)}
                            className="btn btn-outline-default buttonIconInDTable"
                            type={"button"}
                            onClick={() => AceptarSolicitud(propss)}>
                            <FaCheckCircle />
                            <ReactTooltip id={`AS_${propss.SolicitudID}`} type="info" effect="solid">Aceptar Solicitud</ReactTooltip>
                        </button>
                    </div>
            },
            {
                name: 'Cancelar Solicitud',
                center: true,
                sortable: false,
                cell: (propss) =>
                    <div className='divInDTable text-center radiusSmallDivR' data-tip data-for={`CS_${propss.SolicitudID}`}>
                        <button
                            disabled={false}
                            className="btn btn-outline-default buttonIconInDTable"
                            type={"button"}
                            onClick={() => CancelarSolicitud(propss)}>
                            <FaBan />
                            <ReactTooltip id={`CS_${propss.SolicitudID}`} type="info" effect="solid">Cancelar Solicitud</ReactTooltip>
                        </button>
                    </div>
            },
        ]



    React.useEffect(() => {
        // FnSucursales()
        FNGetLocal()
        FNGetTipoEstatus()
        return () => {
            isMounted.current = false
        }
    }, [])

    
    React.useEffect(() => {
        setState(s => ({ ...s, Cargando: true }))
        
    }, [state.FiltroEstatus])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
    }, [state.Datos, state.Filtro])

    return (
        <React.Fragment>
            <div className='row'>
                <div className='col-12'>
                    <Card Title={'SOLICITUDES SOCIA'}>
                        <Card.Body>
                            <Card.Body.Content>
                                {state.Cargando && <Spinner />}
                                {state.Error && <span>Error al cargar los datos...</span>}
                                {!state.Cargando && !state.Error &&
                                    <div>
        
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
                                                singular: '- Solicitud seleccionada',
                                                plural: '- Solicitudes seleccionadas',
                                                message: 'para aceptar'
                                            }}

                                            selectableRowDisabled={(row: any) => disableRow(row)}
                                            selectableRows
                                            noDataComponent={<div style={{ margin: '4rem' }}> {<><FaExclamationCircle color={'grey'} size={25} /> No Existen Solicitudes</>} </div>}

                                            title={<span>Lista de Solicitudes de Cancelación Temporal</span>}


                                            data={state.DatosMostrar}
                                            striped
                                            pagination
                                            dense
                                            responsive
                                            keyField={"SolicitudID"}
                                            defaultSortField={"SolicitudID"}
                                            columns={Columns}
                                        />
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
export default connect(mapStateToProps, mapDispatchToProps)(SolicitudCancelacionesTemporales);


