// import React, { useState } from 'react'
// import DataTable, { IDataTableColumn } from 'react-data-table-component'
// import { connect } from 'react-redux'
// import { IEstado } from '../../../../../interfaces/redux/IEstado'
// import { IOidc } from '../../../../../interfaces/oidc/IOidc'
// import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
// import { toast } from 'react-toastify'
// import * as Funciones from '../CompAdministracion/Funciones'
// // Icons
// import { FaEye, FaExclamationCircle, FaFileSignature, FaFilter, FaPen, FaPencilAlt, FaPlus, FaFacebookMessenger, FaCheck, FaCheckCircle, FaMobile, FaAd, FaCheckDouble, FaBan, FaDollarSign, FaSearch, FaRegChartBar, FaBarcode, FaBars, FaChartBar, FaLevelDownAlt, FaLevelUpAlt } from 'react-icons/fa'
// // Custom components
// import { ActionSelect, Card, DatePickeEnd, DatePickeStart, Spinner, ImgViewer } from '../../../../global'
// import { FiRefreshCcw } from 'react-icons/fi'
// import { FiltrarDatos, formatDate } from '../../../../../global/functions'
// import { boolean, object, array } from '../../../../../global/idiomaValidacion.bak';
// import { bool } from 'yup'
// import moment from 'moment'
// import { Form, Formik } from 'formik'
// import ReactTooltip from 'react-tooltip'
// import Seguridad from '../../seguridad/Seguridad'
// //import { CFormCancelarSolicitud } from './CreditoSolicitudIncremento/CFormCancelarSolicitud'
// import { format } from 'path';
// //import { CFormEditarSolicitud } from './CreditoSolicitudIncremento/CFormEditarSolicitud'
// import withReactContent from 'sweetalert2-react-content'
// import Swal from 'sweetalert2'
// import { iUI } from '../../../../../interfaces/ui/iUI'
// import { DBConfia_Distribuidores } from '../../../../../interfaces_db/DBConfia/Distribuidores'
// //import Incrementos from '../../personas/CompAdministracion/Incrementos/Incrementos';
// import { AiOutlineBarChart, AiOutlineBarcode, AiOutlineBars } from 'react-icons/ai'
// import { BiBarChart, BiBarChartAlt, BiBarChartAlt2, BiBarChartSquare, BiBarcode, BiBarcodeReader } from 'react-icons/bi'
// import { BsFillBarChartFill, BsFillBarChartLineFill, BsFillFileBarGraphFill, BsFillFileEarmarkBarGraphFill, BsReverseLayoutSidebarInsetReverse } from 'react-icons/bs'
// //import { CFormCancelarSolicitudPrestamoPersonal } from './CreditoSolicitudPrestamosPersonales/CFormCancelarSolicitudPrestamoPersonal'
// //import { CFormEditarSolicitudPrestamoPersonal } from './CreditoSolicitudPrestamosPersonales/CFormSolicitudPrestamoPersonal'

// type CatalogosSolicitudSociaType = {
//     oidc: IOidc,
//     ui: iUI
//     regresa: number
//     ClearSelectedRows: boolean,
//     PerstamosSeleccionados: [],
//     CantidadPrestamosSeleccionados: number,
//     Datos5: DBConfia_Distribuidores.ISolicitudesPrestamos_VW,
// }

// const EstatusSocia = (props: CatalogosSolicitudSociaType) => {
//     let isMounted = React.useRef(true)
//     const MySwal = withReactContent(Swal)

//    // const [startDate, setStartDate] = useState(moment().add(-1,'y').toDate());
//     //const [endDate, setEndDate] = useState(moment().toDate());
//     const [loading, setLoading] = React.useState(false)
//     // console.log('Props:', props)
//     const [loading2, setLoading2] = React.useState(false)

//     const DatosDefectoEstatus = {
//         EstatusID: 0
//     }
//     const DatosDefectoSolicitud = {
//        // PrestamoSolicitado: 0,
//         Observaciones: ''
//     }
//     const DatosDefectoCancelacion = {
//         MotivoCancelacion: ''
//     }
//     const DatosDefecto = {
//         Evidencias: [
//            {
//             SolicitudID: 0,
//             Ruta: ''
//            }

//         ]
//     }

//     const Datos: any[] = []
//     const Datos2: any[] = []
//     const Datos3: any[] = []
//     const Evidencias: any[] = []
//     const DatosMostrar: any[] = []
//     const optSucursales: any[] = []
//     const optEstatus: any[] = []
//     const FiltroSucursal: number = 0
//     const FiltroEstatus: number = 0

//     const [state, setState] = React.useState({
//         SolicitudID: 0,
//         Datos,
//         Datos2,
//         Datos3,
//         DatosMostrar,
//         Evidencias,
//         CargandoOverlay: false,
//         //optSucursales,
//         optEstatus,
//         TipoEstatus: [],
//         DatosPre: [],
//         SolicitudesSeleccionadas: [],
//         CantidadSolicitudesSeleccionadas: 0,
//         ClearSelectedRows: false,
//         Filtro: '',
//         Cargando: false,
//         Error: false,
//         Form: {
//             src: '',
//             MostrarAsignarEstatus: false,
//             MostrarSolicitud: false,
//             MostrarCancelacion: false,
//             MostrarVerEvidencias: false,
//             Ruta: '',
//             SolicitudID: 0,
//             Mostrar: false,
//             DatosEstatus: DatosDefectoEstatus,
//             DatosSolicitud: DatosDefectoSolicitud,
//             DatosCancelacion: DatosDefectoCancelacion,
//             Id: undefined,
//         },
//         FiltroSucursal,
//         FiltroEstatus,
//     })

//     const cbGuardarSolicitud = (item: any) => {
//         console.log("ITEM RECIBIDO", item)
//         let index = state.Datos2.findIndex((x: any) => x.SolicitudPrestamoPersonalID === item.SolicitudPrestamoPersonalID)
//         if (index > -1) {
//               state.Datos2[index].SolicitudPrestamoPersonalID = item.SolicitudPrestamoPersonalID,
//                   state.Datos2[index].PrestamoSolicitdo = item.PrestamoSolicitado

//         }
//         setState({ ...state })
//         //FNGetLocal()
//     }

//     const fnCancelarVerEvidencia = () => {
//         setState(s => ({
//             ...s, Form: {
//                 ...s.Form, VerEvidencia: false
//             }
//         }))
//     }
//     const fnCancelarMostrarCargaEvidencia = () => {
//         setState(s => ({
//             ...s, Form: {
//                 ...s.Form, CargarEvidencia: false
//             }
//         }))
//     }
//     const fnMostrarModalEvidencias = (item: any) => {
//         setState(s => ({
//             ...s, Form: {
//                 ...s.Form, MostrarVerEvidencias: true
//             }
//         }))
//     }

//     // const FNGetLocalImagen = (aclaracionId: number, documentoId: number) => {
//     //     setLoading2(true)
//     //     Funciones.FnGetEvidencia(props.oidc, aclaracionId, documentoId)
//     //         .then((respuesta: any) => {
//     //             if (isMounted.current === true) {
//     //                 console.log("###", respuesta);
//     //                 console.log("###", respuesta.src);
//     //                 setState(s => ({ ...s, Form: { ...s.Form, src: respuesta.src } }))
//     //                 setLoading2(false)
//     //             }
//     //         })
//     //         .catch((error) => {
//     //             console.log("###e", error)
//     //             if (isMounted.current === true) {
//     //                 // setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
//     //             }
//     //         })
//     // }

//     // const fnMostrarImagenesEvidencia = (item?: any) => {
//     //     setState(s => ({
//     //         ...s,
//     //         AclaracionID: item.AclaracionID,
//     //         Form: {
//     //             ...s.Form, src: "", MostrarImagenesEvidencia: true
//     //         }
//     //     }))
//     //     FNGetLocalImagen(item.AclaracionID, item.DocumentoID)
//     // }

//     // const ColumnsEvidencias: IDataTableColumn[] =
//     // [
//     //     {
//     //         name: 'Ruta', selector: 'Ruta', sortable: false, center: true,
//     //         cell: (propss) => <span className="text-center">{propss.Ruta}</span>
//     //     },
//     //     {
//     //         name: 'Acciones', selector: 'Acciones', sortable: false, center: true,
//     //         cell: (propss) => <span className="text-center">
//     //             <button className="btn btn-primary btn-sm" onClick={() => fnMostrarImagenesEvidencia(propss)}><i className="fa fa-eye"></i></button>
//     //         </span>

//     //     }
//     // ]


//     const cbGuardarCancelacion = (item: any) => {
//         console.log("ITEM RECIBIDO", item)
//         let index = state.Datos3.findIndex((x: any) => x.SolicitudPrestamoPersonalID === item.SolicitudPrestamoPersonalID)
//         if (index > -1) {
//             state.Datos3[index].SolicitudPrestamoPersonalID = item.SolicitudPrestamoPersonalID,
//                 state.Datos3[index].MotivoCancelacion = item.MotivoCancelacion
//         }
//         setState({ ...state })
//         //FNGetLocal()
//     }

//     const FNGetLocal = () => {
//         setState(s => ({ ...s, Cargando: true }))
//         Funciones.FNGet(props.oidc).then((respuesta: any) => {
//             if (isMounted.current === true) {
//                 console.log("###", respuesta);
//                 if (respuesta.mensajePeticion === undefined) {
//                     setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
//                 } else {
//                     setState(s => ({ ...s, Cargando: false }))
//                     toast.error("Error al obtener los datos, permisos insuficientes")
//                 }
//             }
//         }
//         )
//             .catch((error: any) => {
//                 if (isMounted.current === true) {
//                     setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
//                 }
//             })
//     }

//     const FNGetTipoEstatus = () => {
//         setState(s => ({ ...s, }))
//         Funciones.FNGetEstatusSolicitud(props.oidc, FiltroEstatus)
//             .then((respuesta: any) => {
//                 console.log("FnEstatus: ", respuesta)
//                 var estatus = respuesta.map((valor: any) => {
//                     var obj = { value: valor.EstatusID, label: valor.Estatus };
//                     return obj
//                 });
//                 setState(s => ({ ...s, optEstatus: estatus }))
//             })
//             .catch(() => {
//                 setState(s => ({ ...s, optEstatus: [] }))
//             })
//     }


//     const fnGetFiltroEstatus = (EstatusID: number) => {
//         // console.log("Mostrando el estatus: " + EstatusID);
//     setState(s => ({ ...s, FiltroEstatus: EstatusID }))
//     Funciones.FNGetV2(props.oidc, EstatusID).then((res : any) => {
//         console.log(res);
//         if (isMounted.current === true) {
//             console.log("###", res);
//             if (res.mensajePeticion === undefined) {
//                 setState(s => ({ ...s, Cargando: false, Error: false, Datos : res }))
//             }
//             else {
//                 setState(s => ({ ...s, Cargando: false }))
//                 toast.error("Error al obtener los datos, permisos insuficientes")
//                     }
//                 //         setState(s => ({ ...s, Cargando: false, Error: false, Datos: res }))}
//         }


//         // if (isMounted.current === true) {
//         //     console.log("###", res);
//         //     if (res.mensajePeticion === undefined) {
//         //         setState(s => ({ ...s, Cargando: false, Error: false, Datos: res }))
//         //     } else {
//         //         setState(s => ({ ...s, Cargando: false }))
//         //         toast.error("Error al obtener los datos, permisos insuficientes")
//         //     }
//         // }

//         // setState(s => ({ ...s, Cargando: false, Error: false, Datos: res.data }))

//     }).catch(err => {
//         // toast.error ("ERROR EN V2")
//         if (isMounted.current === true) {
//             setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
//         }
//     })
//     }



//     // const FnSucursales = () => {
//     //     setState(s => ({ ...s }))
//     //     Funciones.FNGetSucursales(props.oidc)
//     //         .then((respuesta: any) => {
//     //             console.log("FnSucursales: ", respuesta)
//     //             var sucursales = respuesta.map((valor: any) => {
//     //                 var obj = { value: valor.SucursalID, label: valor.Nombre };
//     //                 return obj
//     //             });
//     //             setState(s => ({ ...s, optSucursales: sucursales }))
//     //         })
//     //         .catch(() => {
//     //             setState(s => ({ ...s, optSucursales: [] }))
//     //         })
//     // }

//     const fnGetFiltrosSucursales = (SucursalID: number) => {
//         console.log("Mostrando las sucursales: " + SucursalID)
//         setState(s => ({ ...s, FiltroSucursal: SucursalID }))
//     }

//     function formatearFecha(fecha) {
//         return moment(fecha).format("DD/MM/YYYY")
//     }

//      //Seleccionar varios préstamos 
//      const [selectedRows, setSelectedRows] = React.useState([]);

//      const [toggleCleared, setToggleCleared] = React.useState(true);


//      const handleRowSelected = React.useCallback(state => {
//          setSelectedRows(state.selectedRows);
//          console.log(selectedRows)
//      }, []);

//     const contextActions = React.useMemo(() => {
//         console.log("Arreglo final ,", selectedRows)

//         const handleClick = () => {
//             let total = 0;
//             selectedRows.forEach(element => {
//                 total = total + 1
//             });
//             MySwal.fire({
//                 title: '<strong>Aceptación de Solicitudes de Préstamos</strong>',
//                 icon: 'info',
//                 html:
//                     <div className="text-center">
//                         <br />
//                         Se aceptarán un total de <strong>{total}</strong> préstamos, ¿Desea continuar?.
//                     </div>,
//                 showCloseButton: false,
//                 showCancelButton: true,
//                 showConfirmButton: true,
//                 focusCancel: true,
//                 cancelButtonText: 'Cancelar',
//                 confirmButtonText: 'Aceptar',
//                 confirmButtonAriaLabel: 'Aceptar',
//                 cancelButtonAriaLabel: 'Cancelar',
//                 confirmButtonColor: '#3085d6',
//                 cancelButtonColor: '#d33',
//             }).then((result) => {
//                 if (result.isConfirmed) {
//                     MySwal.fire({
//                         title: '<strong>Solicitudes de Préstamos</strong>',
//                         icon: 'warning',
//                         html:
//                             <div className="text-center">
//                                 <br />
//                                 Total de {total} préstamo/s seleccionado/s para aceptar, ¿confirmar?.
//                                 <br /> <br /><h5><strong style={{ color: 'red' }}>Nota: Esta acción no se puede cancelar ni revertir.</strong></h5>
//                             </div>,
//                         showCloseButton: false,
//                         showCancelButton: true,
//                         showConfirmButton: true,
//                         focusCancel: true,
//                         cancelButtonText: 'Cancelar',
//                         confirmButtonText: 'Aceptar',
//                         confirmButtonAriaLabel: 'Aceptar',
//                         cancelButtonAriaLabel: 'Cancelar',
//                         confirmButtonColor: '#3085d6',
//                         cancelButtonColor: '#d33',
//                     }).then((result) => {
//                         if (result.isConfirmed) {
//                             /*MySwal.fire(
//                                 {
//                                     icon: 'info',
//                                     html: <div><br />
//                                         <h3 className="text-center">Aviso</h3>
//                                         <div className={`modal-body`}>
//                                             <h5 className="text-center">Aceptación de incrementos en progreso...</h5>
//                                         </div>
//                                     </div>,
//                                     timerProgressBar: true,
//                                     allowEscapeKey: false,
//                                     allowOutsideClick: false,
//                                     showConfirmButton: false,
//                                     showCancelButton: false,
//                                     showCloseButton: false,
//                                     didOpen: () => {
//                                         MySwal.showLoading()
//                                     },

//                                 }
//                             );*/
//                             let a = {
//                                 Prestamo: selectedRows
//                             }
//                             console.log("A", a)
//                             // Funciones.FNAceptarM(props.oidc, a)
//                             //     .then((respuesta: any) => {
//                             //         if (respuesta.regresa == 1) {
//                             //             respuesta.Prestamo.forEach(element => {
//                             //                 console.log("Respuesta", respuesta)
//                             //                 let index = state.Datos.findIndex(x => x.SolicitudPrestamoPersonalID === element.SolicitudPrestamoPersonalID);
//                             //                 if (index !== -1) {
//                             //                     state.Datos.splice(index, 1);
//                             //                 }
//                             //             })
//                             //             setToggleCleared(!toggleCleared);
//                             //             setState({ ...state, Datos: state.Datos, DatosMostrar: state.Datos })
//                             //             MySwal.close();
//                             //             MySwal.fire({
//                             //                 icon: 'success',
//                             //                 title: '<strong>Aceptación de Préstamos</strong>',
//                             //                 html:
//                             //                     <div className="text-center">
//                             //                         <br />
//                             //                         <h5>Se aceptaron <strong>{respuesta.PrestamosRegistrados} </strong> préstamos de <strong>{respuesta.PrestamosRecibidos}</strong> solicitados.</h5>
//                             //                     </div>,
//                             //                 showCloseButton: false,
//                             //                 showCancelButton: false,
//                             //                 showConfirmButton: true,
//                             //                 focusCancel: true,
//                             //                 confirmButtonText: 'Aceptar',
//                             //                 confirmButtonAriaLabel: 'Aceptar',
//                             //                 confirmButtonColor: '#3085d6',
//                             //             })
//                             //             console.log("mensajes", respuesta)
//                             //             toast.success(respuesta)
//                             //             FNGetLocal()
//                                     }
//                                     else {
//                                         //console.log("mensajes", respuesta)

//                                         setLoading(false)
//                                         //toast.success(respuesta)
//                                         //FNGetLocal();
//                                     }
//                                 })
//                                 .catch(() => {
//                                     if (isMounted.current === true) {
//                                         toast.error("Error al realizar la operación")
//                                         MySwal.close();
//                                     }
//                                 })
//                         } else {
//                             MySwal.fire(
//                                 {
//                                     icon: 'info',
//                                     html: <div><br />
//                                         <h3 className="text-center">Aviso</h3>
//                                         <div className={`modal-body`}>
//                                             <h5 className="text-center">Operación cancelada por el usuario.</h5>
//                                         </div>
//                                     </div>,
//                                     cancelButtonText: 'Cancelar',
//                                     confirmButtonText: 'Aceptar',
//                                     confirmButtonColor: '#3085d6',
//                                     confirmButtonAriaLabel: 'Aceptar',
//                                     cancelButtonAriaLabel: ''
//                                 }
//                             );
//                         }
//                     })
//             //     } else {
//             //         MySwal.fire(
//             //             {
//             //                 icon: 'info',
//             //                 html: <div><br />
//             //                     <h3 className="text-center">Aviso</h3>
//             //                     <div className={`modal-body`}>
//             //                         <h5 className="text-center">Operación cancelada por el usuario.</h5>
//             //                     </div>
//             //                 </div>,
//             //                 cancelButtonText: 'Cancelar',
//             //                 confirmButtonText: 'Aceptar',
//             //                 confirmButtonColor: '#3085d6',
//             //                 confirmButtonAriaLabel: 'Aceptar',
//             //                 cancelButtonAriaLabel: ''
//             //             }
//             //         );
//             //     }
//             // })

//         }

//         return (
//             <button data-tip data-for="TT1_1" style={{ backgroundColor: '#28a745', color: 'white' }}
//                 type="button" className="ms-2 btn waves-effect waves-light" onClick={handleClick}>
//                 <BsFillBarChartFill />  Aceptar Préstamos Seleccionados
//             </button>
//         );
//     }, [selectedRows]);

//     const disableRow = (item: any) => {
//         if (item.EstatusID == 3 || item.EstatusID == 1) {
//             return true
//         } else {
//             return false
//         }
//     }

//     //
//     const AceptarSolicitud = (item: any) => {
//         MySwal.fire({
//             title: '<strong>Aceptar Solicitud</strong>',
//             icon: 'question',
//             html:
//                 <div className="text-center">
//                     Se aceptará la solicitud, ¿desea continuar?
//                 </div>,
//             showCloseButton: false,
//             showCancelButton: true,
//             showConfirmButton: true,
//             focusConfirm: false,
//             cancelButtonText: 'Cancelar',
//             confirmButtonText: 'Aceptar',
//             confirmButtonAriaLabel: 'Aceptar',
//             allowOutsideClick: false,
//             cancelButtonAriaLabel: ''
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 Funciones.FNAceptar(props.oidc, item)
//                     .then((resp: any) => {
//                         console.log("resp: ", resp)
//                         setLoading(false)
//                         if (resp.EstatusID == 1) {
//                             MySwal.fire(
//                                 {
//                                     icon: 'success',
//                                     html: <div><br />
//                                         <h3 className="text-center">Aviso</h3>
//                                         <div className={`modal-body`}>
//                                             <h5 className="text-center">Se Acepto el Préstamo Exitosamente</h5>
//                                         </div>
//                                     </div>,
//                                     //timerProgressBar: true,
//                                     confirmButtonText: `Aceptar`,
//                                     allowOutsideClick: false,
//                                     //timer: 500,
//                                     /*  didOpen: () => {
//                                          MySwal.showLoading()
//                                      }, */
//                                 }
//                             );
//                             toast.success(resp.msj)
//                             FNGetLocal()
//                         }
//                         else {

//                             setLoading(false)
//                             toast.error(resp.msj)
//                         }

//                    })
//                     .catch((error: any) => {

//                         MySwal.fire(
//                             {
//                                 icon: 'error',
//                                 html: <div><br />
//                                     <h3 className="text-center">Error</h3>
//                                     <div className={`modal-body`}>
//                                         <h5 className="text-center">Ocurrió un problema al aceptar el préstamo.</h5>
//                                     </div>
//                                 </div>,
//                                 confirmButtonText: `Aceptar`,
//                                 allowOutsideClick: false,
//                             }
//                         );
//                         console.log(JSON.stringify(error))
//                         console.log(error)
//                         setLoading(false)
//                     })
//                 }
//                 else {
//                 MySwal.fire(
//                     {
//                         icon: 'error',
//                         html: <div><br />
//                             <h3 className="text-center">Error</h3>
//                             <div className={`modal-body`}>
//                                 <h5 className="text-center">Operación cancelada por el usuario.</h5>
//                             </div>
//                         </div>,
//                         //timerProgressBar: true,
//                         confirmButtonText: `Ok`,
//                         allowOutsideClick: false,
//                         //timer: 500,

//                     }
//                 );
//             }
//         })
//     }

//     const Columns: IDataTableColumn[] =
//         [
//             {
//                 name: 'Id',
//                 center: true,
//                 selector: 'SolicitudID',
//                 sortable: false
//             },
//             {
//                 name: 'Socia',
//                 center: true,
//                 selector: 'PersonaNombre',
//                 sortable: true,
//                 minWidth: "300px",
//                 //width: '15%',
//                 cell: (props) => <span className="text-center">{props.NombreCompleto}</span>

//             },
//             {
//                 name: 'Solicitud Autorizada',
//                 center: true,
//                 selector: 'PrestamoAutorizado',
//                 sortable: false,

//                 minWidth: "150px",
//                 // width: '11%',
//                 cell: props => <span className='text-center'>{props.EstatusID == 3 ? 'CANCELADO' : props.PrestamoAutorizado != undefined ? props.PrestamoAutorizado : "Pendiente Autorización"}</span>
//             },
//             {
//                 name: 'Observaciones',
//                 center: true,
//                 selector: 'Observaciones',
//                 sortable: false,
//                 minWidth: "200px",
//                 //width: '11%',
//                 cell: row => <span className='text-center'>{row.Observaciones ? (row.Observaciones) : 'Sin Observaciones'}</span>
//             },
//             {
//                 name: 'Estatus',
//                 selector: 'Estatus',
//                 center: true,
//                 sortable: false,
//                 minWidth: "150px",
//                 cell: (props) => <span className='text'>{props.Estatus}</span>
//             },
//             {
//                 name: 'Usuario Solicito',
//                 center: true,
//                 selector: 'UsuarioSolicito',
//                 sortable: false,
//                 minWidth: "300px",
//                 //width: '15%',
//                 cell: (propss) => <span className="text-center">{propss.UsuarioSolicito}</span>
//             },
//             {
//                 name: 'Fecha Solicito',
//                 center: true,
//                 selector: 'FechaSolicitud',
//                 sortable: false,
//                 minWidth: "110px",
//                 //width:'11%',
//                 cell: (props) => <span className="text-center">{props.FechaRegistra == undefined ? "N/A": formatearFecha(props.FechaRegistra)}</span>
//             },
//             {
//                 name: 'Usuario Autoriza',
//                 center: true,
//                 selector: 'UsuarioAutorizo',
//                 sortable: false,
//                 minWidth: "300px",
//                 //width: '15%',
//                 cell: row => <span className='text-center'>{row.UsuarioAutorizo ? (row.UsuarioAutorizo) : 'N/A'}</span>
//             },
//             {
//                 name: 'Fecha Autorización',
//                 center: true,
//                 selector: 'FechaAutorizacion',
//                 sortable: false,
//                 minWidth: "110px",
//                 cell: props => <span className='text-center'>{props.FechaAutorizacion == undefined ? "N/A" : formatearFecha(props.FechaAutorizacion)}
//                 </span>
//             },

//             {
//                 name: 'Usuario Modifica',
//                 center: true,
//                 selector: 'UsuarioModifica',
//                 sortable: false,
//                 minWidth: "300px",
//                 //width: '15%',
//                 cell: row => <span className='text-center'>{row.UsuarioModifica ? (row.UsuarioModifica) : 'N/A'}</span>
//             },
//             {
//                 name: 'Fecha Modificación',
//                 center: true,
//                 selector: 'FechaModifica',
//                 sortable: false,
//                 minWidth: "110px",
//                 cell: props => <span className='text-center'>{props.FechaModifica == undefined ? "N/A" : formatearFecha(props.FechaModifica)}
//                 </span>
//             },
//             {
//                 name: 'Usuario Cancela',
//                 center: true,
//                 selector: 'UsuarioCancelo',
//                 sortable: false,
//                 minWidth: "300px",
//                 //width: '15%',
//                 cell: row => <span className='text-center'>{row.UsuarioCancelo ? (row.UsuarioCancelo) : 'N/A'}</span>
//             },
//             {
//                 name: 'Fecha Cancelación',
//                 center: true,
//                 selector: 'FechaAutorizacion',
//                 sortable: false,
//                 minWidth: "110px",
//                 cell: props => <span className='text-center'>{props.FechaCancelacion == undefined ? "N/A" : formatearFecha(props.FechaCancelacion)}
//                 </span>
//             },
//             {
//                 name: 'Motivo Cancelación',
//                 center: true,
//                 selector: 'MotivoCancelacion',
//                 sortable: false,
//                 minWidth: "200px",
//                 cell: row => <span className='text-center'>{row.MotivoCancelacion ? (row.MotivoCancelacion) : 'Sin Motivo'}</span>
//             },
//             {
//                 name: 'Editar Solicitud',
//                 center: true,
//                 sortable: false,
//                 cell: (props) =>
//                     <div className='divInDTable text-center radiusSmallDivR' data-tip data-for={`ES_${props.SolicitudID}`}>
//                         <button
//                             disabled={(props.EstatusID == 3 || props.EstatusID == 1)}
//                             className="btn btn-outline-default buttonIconInDTable"
//                             type={"button"}
//                             onClick={() => {
//                                 console.log(props)
//                                 setState({
//                                     ...state,
//                                     SolicitudID: props.SolicitudPrestamoPersonalID,
//                                     Form: {
//                                         ...state.Form,
//                                         MostrarSolicitud: true,
//                                         DatosSolicitud: {
//                                             ...state.Form.DatosSolicitud,
//                                            // PrestamoSolicitado: props.PrestamoSolicitado,
//                                             Observaciones: props.Obervaciones,
//                                         }
//                                     }
//                                 })
//                             }}>
//                             <FaPencilAlt />
//                             <ReactTooltip id={`ES_${props.SolicitudPrestamoPersonalID}`} type="info" effect="solid">Editar Préstamo</ReactTooltip>
//                         </button>
//                     </div>
//             },
//             {
//                 name: 'Aceptar Solicitud',
//                 center: true,
//                 sortable: false,
//                 cell: (propss) =>
//                     <div className='divInDTable text-center radiusSmallDivR' data-tip data-for={`AS_${propss.SolicitudID}`}>
//                         <button
//                           //  disabled={(propss.EstatusID == 3 || propss.EstatusID == 1)}
//                             className="btn btn-outline-default buttonIconInDTable"
//                             type={"button"}
//                             onClick={() => AceptarSolicitud(propss)}>
//                             <FaCheckCircle />
//                             <ReactTooltip id={`AS_${propss.SolicitudID}`} type="info" effect="solid">Aceptar Solicitud</ReactTooltip>
//                         </button>
//                     </div>
//             },
//             {
//                 name: 'Cancelar Solicitud',
//                 center: true,
//                 sortable: false,
//                 cell: (propss) =>
//                     <div className='divInDTable text-center radiusSmallDivR' data-tip data-for={`CS_${propss.SolicitudPrestamoPersonalID}`}>
//                         <button
//                             disabled={(propss.EstatusID == 3 || propss.EstatusID == 1)}
//                             className="btn btn-outline-default buttonIconInDTable"
//                             type={"button"}
//                             onClick={() => {
//                                 setState({
//                                     ...state,
//                                     SolicitudID: propss.SolicitudPrestamoPersonalID,
//                                     Form: {
//                                         ...state.Form,
//                                         MostrarCancelacion: true,
//                                         DatosCancelacion: {
//                                             ...state.Form.DatosCancelacion,
//                                             MotivoCancelacion: propss.MotivoCancelacion,
//                                         }
//                                     }
//                                 })
//                             }}>
//                             <FaBan />
//                             <ReactTooltip id={`CS_${propss.SolicitudPrestamoPersonalID}`} type="info" effect="solid">Cancelar Solicitud</ReactTooltip>
//                         </button>
//                     </div>
//             },
//             {
//                 name: 'Evidencia',
//                 center: true,
//                 sortable: false,
//                 cell: (propss) =>
//                     <div className='divInDTable text-center radiusSmallDivR' data-tip data-for={`VE_${propss.SolicitudID}`}>
//                         <button
//                             className="btn btn-outline-default buttonIconInDTable" type={"button"}
//                             onClick={() => { fnMostrarModalEvidencias(propss) }}>
//                             <FaEye />
//                             <ReactTooltip id={`VE_${propss.SolicitudID}`} type="info" effect="solid">Ver Evidencia</ReactTooltip>
//                         </button>
//                     </div>


//             },
//         ]



//     React.useEffect(() => {
//         // FnSucursales()
//         FNGetLocal()
//         FNGetTipoEstatus()
//         return () => {
//             isMounted.current = false
//         }
//     }, [])

//     // const FnFiltrando = () => {
//     //     let numFiltro = (state.FiltroSucursal + state.FiltroEstatus)
//     //     let datosFiltro = state.Datos
//     //     if (numFiltro > 0)
//     //         setState(s => ({ ...s, Filtrando: true }))
//     //     else
//     //         setState(s => ({ ...s, Filtrando: false }))

//     //     if (state.FiltroSucursal > 0)
//     //         datosFiltro = datosFiltro.filter(d => { return d.SucursalID === state.FiltroSucursal })

//     //     if (state.FiltroEstatus > 0)
//     //         datosFiltro = datosFiltro.filter(d => { return d.EstatusID === state.FiltroEstatus })

//     //     // if (startDate != null) {
//     //     //     datosFiltro = datosFiltro.filter(d => { return d.FechaSolicitud >= startDate.toISOString() || d.FechaSolicitud === null })
//     //     // }
//     //     setState(s => ({ ...s, DatosMostrar: datosFiltro }))
//     // }
//     React.useEffect(() => {
//         // fnGetFiltroEstatus(FiltroEstatus)
//         // console.log(state.FiltroEstatus)
//         // console.log(state.FiltroEstatus)
//         setState(s => ({ ...s, Cargando: true }))
//         // Funciones.FNGetV2(props.oidc, state.FiltroEstatus).then((res : any) => {
//         //     console.log(res);
//         //     if (isMounted.current === true) {
//         //         console.log("###", res);
//         //         if (res.mensajePeticion === undefined) {
//         //             // setState(s => ({ ...s, Cargando: false, Error: false, Datos: res }))
//         //         }
//         //             //         setState(s => ({ ...s, Cargando: false, Error: false, Datos: res }))}
//         //     }

//         //     // if (isMounted.current === true) {
//         //     //     console.log("###", res);
//         //     //     if (res.mensajePeticion === undefined) {
//         //     //         setState(s => ({ ...s, Cargando: false, Error: false, Datos: res }))
//         //     //     } else {
//         //     //         setState(s => ({ ...s, Cargando: false }))
//         //     //         toast.error("Error al obtener los datos, permisos insuficientes")
//         //     //     }
//         //     // }

//         //     // setState(s => ({ ...s, Cargando: false, Error: false, Datos: res.data }))

//         // }).catch(err => {
//         //     // toast.error ("ERROR EN V2")
//         //     if (isMounted.current === true) {
//         //         setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
//         //     }
//         // })
//     }, [ state.FiltroEstatus])

//     React.useEffect(() => {
//         setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
//         //FnFiltrando()
//         // eslint-disable-next-line
//     }, [state.Datos, state.Filtro])

//     return (
//         <React.Fragment>
//             <div className='row'>
//                 <div className='col-12'>
//                     <Card Title={'SOLICITUDES SOCIA'}>
//                         <Card.Body>
//                             <Card.Body.Content>
//                                 {state.Cargando && <Spinner />}
//                                 {state.Error && <span>Error al cargar los datos...</span>}
//                                 {!state.Cargando && !state.Error &&
//                                     <div>       
//                                         <div className="row" style={{ width: '102%' }}>
//                                             <div className="col-sm-12">
//                                                 <div className="input-group mb-3" style={{ justifyContent: 'space-between' }}>
//                                                 </div>
//                                             </div>
//                                             <div className="col-sm-12">
//                                                 <div style={{ backgroundColor: '#F7F7F7', padding: '1em', borderRadius: '15px' }}>
//                                                     <div>
//                                                         <div style={{ float: 'right' }}>
//                                                             <button
//                                                                 className="btn btn-outline-secondary"
//                                                                 type="button"
//                                                                 // onClick={() => FNGetLocal()}
//                                                                 >
//                                                                      <FiRefreshCcw />
//                                                             </button>
//                                                         </div>
//                                                         <div style={{ float: 'left' }}><FaFilter /></div>
//                                                         <div> <label style={{ marginLeft: '5px' }}>FILTROS</label> </div>
//                                                     </div>
//                                                     <div style={{ width: '100%', textAlign: 'center' }}>
//                                                         <div style={{ display: 'inline-block' }}>
//                                                             <Formik
//                                                                 initialValues={{}}
//                                                                 onSubmit={() => { }}
//                                                             >
//                                                                 <Form>
//                                                                     <div className="row" style={{ textAlign: 'initial' }}>
//                                                                         <div style={{ height: '57px', width: '290px' }}>
//                                                                             <ActionSelect
//                                                                                 disabled={false}
//                                                                                 label="Estado de la solicitud"
//                                                                                 name="EstatusID"
//                                                                                 placeholder="Seleccione un estado"
//                                                                                 options={state.optEstatus}
//                                                                                 addDefault={false}
//                                                                                 valor={state.FiltroEstatus}
//                                                                                 accion={fnGetFiltroEstatus}
//                                                                             />
//                                                                         </div>
//                                                                     </div>
//                                                                 </Form>
//                                                             </Formik>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                        <DataTable

//                                             subHeader
//                                             contextActions={contextActions}
//                                             clearSelectedRows={toggleCleared}
//                                             onSelectedRowsChange={handleRowSelected}

//                                             paginationComponentOptions=
//                                             {{
//                                                 rowsPerPageText: 'Registros por pagina:',
//                                                 rangeSeparatorText: 'de',
//                                                 noRowsPerPage: false,
//                                                 selectAllRowsItem: false,
//                                                 selectAllRowsItemText: 'Todo'
//                                             }}
//                                             contextMessage=
//                                             {{
//                                                 singular: '- Solicitud seleccionada',
//                                                 plural: '- Solicitudes seleccionadas',
//                                                 message: 'para aceptar'
//                                             }}

//                                             selectableRowDisabled={(row: any) => disableRow(row)}
//                                             selectableRows
//                                             noDataComponent={<div style={{ margin: '4rem' }}> {<><FaExclamationCircle color={'grey'} size={25} /> No Existen Solicitudes</>} </div>}

//                                             title={<span>Lista de Solicitudes Socia</span>}


//                                             data={state.DatosMostrar}
//                                             striped
//                                             pagination
//                                             dense
//                                             responsive
//                                             keyField={"SolicitudPrestamoPersonalID"}
//                                             defaultSortField={"SolicitudPrestamoPersonalID"}
//                                             columns={Columns}
//                                         />

//                                             {state.Form.MostrarCancelacion &&
//                                             <ModalWin open={state.Form.MostrarCancelacion} center={true} >
//                                                 <ModalWin.Header>
//                                                     <h5 className={MODAL_TITLE_CLASS}>CANCELAR SOLICITUD PRÉSTAMO</h5>
//                                                     <button type="button" className="delete" onClick={() => {
//                                                         setState({
//                                                             ...state,
//                                                             Form: {
//                                                                 ...state.Form,
//                                                                 MostrarCancelacion: false
//                                                             }
//                                                         })
//                                                     }} />
//                                                 </ModalWin.Header>
//                                                 <ModalWin.Body>
//                                                     {/* <CFormCancelarSolicitudPrestamoPersonal
//                                                         oidc={props.oidc}
//                                                         Id={state.SolicitudID}
//                                                         initialValues={state.Form.DatosCancelacion}
//                                                         fnCancelar={() => setState({
//                                                             ...state,
//                                                             Form: {
//                                                                 ...state.Form,
//                                                                 MostrarCancelacion: false
//                                                             }
//                                                         })}
//                                                         cbGuardar={cbGuardarCancelacion}
//                                                     /> */}
//                                                 </ModalWin.Body>
//                                             </ModalWin>}

//                                         {state.Form.MostrarSolicitud &&
//                                             <ModalWin open={state.Form.MostrarSolicitud} center={true} >
//                                                 <ModalWin.Header>
//                                                     <h5 className={MODAL_TITLE_CLASS}>EDITAR PRÉSTAMO</h5>
//                                                     <button type="button" className="delete" onClick={() => {
//                                                         setState({
//                                                             ...state,
//                                                             Form: {
//                                                                 ...state.Form,
//                                                                 MostrarSolicitud: false
//                                                             }
//                                                         })
//                                                     }} />
//                                                 </ModalWin.Header>
//                                                 <ModalWin.Body>
//                                                     {/* <CFormEditarSolicitudPrestamoPersonal
//                                                         oidc={props.oidc}
//                                                         Id={state.SolicitudPrestamoPersonalID}
//                                                         initialValues={state.Form.DatosPrestamo}
//                                                         fnCancelar={() => setState({
//                                                             ...state,
//                                                             Form: {
//                                                                 ...state.Form,
//                                                                 MostrarPrestamo: false
//                                                             }
//                                                         })}
//                                                         cbGuardar={cbGuardarSolicitud} 
//                                                     /> */}
//                                                 </ModalWin.Body>
//                                             </ModalWin>}
//                                     </div>
//                                 }
//                             </Card.Body.Content>
//                         </Card.Body>
//                     </Card>
//                 </div>
//             </div>
//         </React.Fragment>
//     )
// }

// const mapStateToProps = (state: IEstado) => ({
//     oidc: state.oidc,
//     ui: state.UI,
// })
// const mapDispatchToProps = {
// }
// export default connect(mapStateToProps, mapDispatchToProps)(EstatusSocia);

// export {}

// // function fnMostrarModalEvidencias(propss: any) {
// //     throw new Error('Function not implemented.')
// // }
export { }