/* eslint-disable react/jsx-no-undef */
import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import * as Funciones from './CatalogoProcesoSurtido/Funciones'
import { toast } from 'react-toastify'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'

// Icons
import { FaCheck, FaCheckCircle, FaCircle, FaClone, FaEye, FaPencilAlt, FaPlus, FaPrint, FaSearch, FaFolderPlus, FaSignature, FaFile, FaFileSignature } from 'react-icons/fa'


// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CatalogoProcesoSurtido/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { inputCSS } from 'react-select/src/components/Input'
import moment from 'moment'
import ReactTooltip from 'react-tooltip'


import { CFormAgregarComprobante } from './CatalogoProcesoSurtido/CFormAgregarComprobante'
import { CFormVerComprobante } from './CatalogoProcesoSurtido/CFormVerComprobante'
import { CFormAgregarFirma } from './CatalogoProcesoSurtido/CFormAgregarFirma'
import { CFormVerFirma } from './CatalogoProcesoSurtido/CFormVerFirma'

type CatalogosType = {
    oidc: IOidc
}

const CatalogoProcesoSurtido = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const MySwal = withReactContent(Swal)
    const DatosMostrar: any[] = []
    const DatosDefecto = {
        SurtidoID: 0,
        SolicitudID: 0,
        AutorizaID: 0,
        NombreAutoriza: '',
        SurteID: 0,
        NombreSurte: '',
        CancelaID: 0,
        NombreCancela: '',
        FechaAutorizado: '',
        FechaSurtido: '',
        FechaCancelacion: '',
        EstatusID: 0,
        EstatusDes: '',
        Descripcion: '',
        Cancelada: 0,
        ReOrden: 0,
        OrdenID: 0,
        ReOrdenID: 0,
        ComprobanteDoc: '',
        DocumentoID: 0,
        ComprobanteFirma: '',
        FirmaDocID: 0,
        ProductoID: 0,
        EmpresaId: 0,
        Pendientes: 0,
        DetalleSurtido:
            [{
                SurtidoDetalleID: 0,
                SurtidoID: 0,
                SolicitudDetalleID: 0,
                OrdenDetalleID: 0,
                ProductoUniformeID: 0,
                ProductoUniformeDesc: '',
                PiezasAutorizadas: 0,
                PiezasSurtidas: 0,
                PiezasPendientes: 0,
                FechaCompromiso: '',
                Observaciones: '',
            }],
    }
    const Datos: any[] = []

    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        DocumentoID: 0,
        FirmaDocID: 0,
        Form:
        {
            CargarDocumento: false,
            Mostrar: false,
            Datos: DatosDefecto,
            MostrarCrearMovimiento: false,
            DocumentoID: 0,
            FirmaDocID: 0,
            SurtidoID: 0,
            ComprobanteDoc: '',
            VerDoc: false,
            CargarFirma: false,
            VerFirma: false,
            Id: 0,
        },
    })

    const cambiarFecha = (item: any, value: string) => {
        let index = state.Form.Datos.DetalleSurtido.findIndex((respuesta: any) => {
            return respuesta.SurtidoDetalleID === item.SurtidoDetalleID
        })
        state.Form.Datos.DetalleSurtido[index].FechaCompromiso = value
        setState(s => ({
            ...s, Form: {
                ...s.Form, Datos: state.Form.Datos
            }

        }))
    }

    const cambiarObservaciones = (item: any, value: string) => {
        let index = state.Form.Datos.DetalleSurtido.findIndex((respuesta: any) => {
            return respuesta.SurtidoDetalleID === item.SurtidoDetalleID
        })
        state.Form.Datos.DetalleSurtido[index].Observaciones = value
        setState(s => ({
            ...s, Form: {
                ...s.Form, Datos: state.Form.Datos
            }

        }))
    }

    const fnVerDoc = (DocumentoID: any, SurtidoID: any, ComprobanteDoc: any) => {
        setState(s => ({
            ...s, Form: {
                ...s.Form, VerDoc: true, SurtidoID: SurtidoID, ComprobanteDoc: ComprobanteDoc
            }
            , DocumentoID: DocumentoID
        }))
    }

    const fnVerFirma = (FirmaDocID: number, SurtidoID: number) => {
        setState(s => ({
            ...s, Form: {
                ...s.Form, VerFirma: true, SurtidoID: SurtidoID
            }, FirmaDocID: FirmaDocID
        }))
    }

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const estatusColor = (estatus: number) => {
        switch (estatus) {
            case 1:
                return 'Orange'
            case 2:
                return 'Red'
            case 3:
                return 'Orange'
            case 4:
                return 'Yellow'
            case 11:
                return 'Orange'
            case 12:
                return 'Yellow'
            case 13:
                return 'Green'
            case 15:
                return 'Orange'
            case 16:
                return 'Orange'
            case 17:
                return 'Green'
            case 18:
                return 'Yellow'
            case 19:
                return 'Yellow'
            default:
                return 'Green'
        }
    }

    const fnMostrarCargaDeDocumento = (DocumentoID: any, SurtidoID: any) => {

        setState(s => ({
            ...s, Form: {
                ...s.Form, CargarDocumento: true, SurtidoID: SurtidoID
            }
            , DocumentoID: DocumentoID
        }))
    }
    const fnCancelarMostrarCargaDeDocumento = () => {
        setState(s => ({
            ...s, Form: {
                ...s.Form, CargarDocumento: false
            }
        }))
    }
    const fnCancelarVerDocumento = () => {
        setState(s => ({
            ...s, Form: {
                ...s.Form, VerDoc: false
            }
        }))
    }
    const fnCancelarVerFirma = () => {
        setState(s => ({
            ...s, Form: {
                ...s.Form, VerFirma: false
            }
        }))
    }

    const fnMostrarCargaFirma = (FirmaDocID: any, SurtidoID: any) => {

        setState(s => ({
            ...s, Form: {
                ...s.Form, CargarFirma: true, SurtidoID: SurtidoID
            }
            , FirmaDocID: FirmaDocID
        }))
    }

    const fnCancelarCargaFirma = () => {

        setState(s => ({
            ...s, Form: {
                ...s.Form, CargarFirma: false
            }
        }))
    }

    const Columns: IDataTableColumn[] =
        [
            {
                name: 'Surtido',
                selector: 'SurtidoID',
                sortable: true,
                center: true,
                cell: row => <span className='text-center'>{row.SurtidoID}</span>
            },
            {
                name: 'Autoriza',
                selector: 'NombreAutoriza',
                sortable: false,
                center: true,
                cell: row => <span className='text-center'>{row.NombreAutoriza}</span>
            },
            {
                name: 'Surte',
                selector: 'NombreSurte',
                sortable: false,
                center: true,
                cell: row => <span className='text-center'>{row.NombreSurte != undefined ? row.NombreSurte : "--"}</span>
            },
            {
                name: 'Cancela',
                selector: 'NombreCancela',
                sortable: false,
                center: true,
                cell: row => <span className='text-center'>{row.NombreCancela != undefined ? row.NombreCancela : "--"}</span>
            },
            {
                name: 'Fecha Autorizado',
                selector: 'FechaAutorizado',
                sortable: false,
                center: true,
                cell: row => <span className='text-center'>{row.FechaAutorizado == undefined ? "--" : moment(row.FechaAutorizado).format("DD-MM-YYYY hh:mm:ss")}</span>
            },
            {
                name: 'Fecha Surtido',
                selector: 'FechaSurtido',
                sortable: false,
                center: true,
                cell: row => <span className='text-center'>{row.FechaSurtido == undefined ? "--" : moment(row.FechaSurtido).format("DD-MM-YYYY hh:mm:ss")}</span>
            },
            {
                name: 'Fecha Cancelacion',
                selector: 'FechaCancelacion',
                sortable: false,
                center: true,
                cell: row => <span className='text-center'>{row.FechaCancelacion == undefined ? "--" : moment(row.FechaCancelacion).format("DD-MM-YYYY hh:mm:ss")}</span>
            },
            {
                name: 'Estatus',
                selector: 'EstatusID',
                sortable: false,
                center: true,
                cell: row => <span className='text-center'>{<FaCircle color={estatusColor(row.EstatusID)} />}</span>
            },
            {
                name: 'Descripcion',
                selector: 'EstatusDes',
                sortable: false,
                center: true,
                cell: row => <span className='text-center'>{row.EstatusDes}</span>
            },
            {
                name: 'Observaciones',
                selector: 'Descripcion',
                sortable: false,
                center: true,
                cell: row => <span className='text-center'>{row.Descripcion}</span>
            },
            {
                name: 'Documento',
                center: true,
                sortable: false,
                cell: (propss) =>
                    propss.ComprobanteDoc == null || propss.ComprobanteDoc == "" || propss.ComprobanteDoc == undefined ?
                        <div>
                            <button style={propss.EstatusID == 11 || propss.EstatusID == 15 || propss.EstatusID == 12 ? {} : { display: "none" }} data-tip data-for="Btn_Examinar" className="asstext" type={"button"}
                                onClick={() => {
                                    fnMostrarCargaDeDocumento(propss.DocumentoID, propss.SurtidoID)
                                }}>
                                <FaFile />
                                <ReactTooltip id="Btn_Examinar" type="info" effect="solid">
                                    Agregar Comprobante
                                </ReactTooltip>
                            </button>
                        </div>
                        :
                        <div>
                            <button style={propss.EstatusID >= 4 ? {} : { display: "none" }} data-tip data-for="Btn_Mostrar" className="asstext" type={"button"}
                                onClick={() => {
                                    fnVerDoc(propss.DocumentoID, propss.SurtidoID, propss.ComprobanteDoc)
                                }}>
                                <FaEye />
                                <ReactTooltip id="Btn_Mostrar" type="info" effect="solid">
                                    Ver Comprobante
                                </ReactTooltip>
                            </button>
                        </div>
            },
            {
                name: 'Firma',
                center: true,
                sortable: false,
                cell: (propsss) =>
                    propsss.ComprobanteFirma == null || propsss.ComprobanteFirma == "" || propsss.ComprobanteFirma == undefined ?
                        <div>
                            {console.log(propsss.ComprobanteFirma)}
                            <button
                                style={propsss.EstatusID == 11 || propsss.EstatusID == 15 || propsss.EstatusID == 12 ? {} : { display: "none" }}
                                data-tip data-for="Btn_Firmar"
                                className="asstext"
                                type={"button"}
                                onClick={() => { fnMostrarCargaFirma(propsss.FirmaDocID, propsss.SurtidoID) }}>
                                <FaFileSignature />
                                <ReactTooltip id="Btn_Firmar" type="info" effect="solid">Agregar Firma</ReactTooltip>
                            </button>
                        </div>
                        :
                        <div>
                            <button
                                style={propsss.EstatusID >= 4 ? {} : { display: "none" }}
                                data-tip data-for="Btn_VerFirmar"
                                className="asstext"
                                type={"button"}
                                onClick={() => { fnVerFirma(propsss.FirmaDocID, propsss.SurtidoID) }}>
                                <FaSignature />
                                <ReactTooltip id="Btn_VerFirmar" type="info" effect="solid"> Ver Firma</ReactTooltip>
                            </button>
                        </div>
            },
            {
                name: 'Acciones',
                sortable: false,
                center: true,
                cell: (props) =>
                    <div className="columns is-centered is-mobile is-multiline">
                        <div className="column text-center is-full-desktop is-full-mobile">
                            <button data-tip data-for="Btn_Ver" className="asstext" type={"button"} onClick={() => {
                                let nuevo = {
                                    SurtidoID: props.SurtidoID,
                                    SolicitudID: props.SolicitudID,
                                    AutorizaID: props.AutorizaID,
                                    NombreAutoriza: props.NombreAutoriza,
                                    SurteID: props.SurteID,
                                    NombreSurte: props.NombreSurte,
                                    CancelaID: props.CancelaID,
                                    NombreCancela: props.NombreCancela,
                                    FechaAutorizado: props.FechaAutorizado,
                                    FechaSurtido: props.FechaSurtido,
                                    FechaCancelacion: props.FechaCancelacion,
                                    EstatusID: props.EstatusID,
                                    EstatusDes: props.EstatusDes,
                                    Descripcion: props.Descripcion,
                                    Cancelada: props.Cancelada,
                                    ReOrden: props.ReOrden,
                                    OrdenID: props.OrdenID,
                                    ReOrdenID: props.ReOrdenID,
                                    ComprobanteDoc: props.ComprobanteDoc,
                                    DocumentoID: props.DocumentoID,
                                    ComprobanteFirma: props.ComprobanteFirma,
                                    FirmaDocID: props.FirmaDocID,
                                    ProductoID: props.ProductoID,
                                    EmpresaId: props.EmpresaId,
                                    Pendientes: props.Pendientes,
                                    DetalleSurtido: props.DetalleSurtido,
                                }
                                setState(s => ({
                                    ...s,
                                    Form: {
                                        ...s.Form,
                                        Mostrar: true,
                                        Datos: nuevo,
                                        Id: props.SurtidoID
                                    }
                                }))
                            }}>
                                <FaEye />
                                <ReactTooltip id="Btn_Ver" type="info" effect="solid">
                                    Ver Detalle
                                </ReactTooltip>
                            </button>
                        </div>
                    </div>
            },
        ]

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    // On use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any, number: any, tipo: any, estatus: any) => {
        setState(s => ({ ...s, Form: state.Form }))
        setState(s => ({ ...s, BotonesModal: true }))
        let PiezasAu: any[] = []
        state.Form.Datos.DetalleSurtido.forEach(element => {
            let a = {
                SurtidoID: element.SurtidoID,
                SurtidoDetalleID: element.SurtidoDetalleID,
                PiezasAutorizadas: element.PiezasAutorizadas,
                PiezasSurtidas: element.PiezasSurtidas,
                PiezasPendientes: element.PiezasPendientes,
            }
            PiezasAu.push(a)
        });
        if (tipo.toString() === "true" && estatus == 11) {
            MySwal.fire({
                focusCancel: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                icon: 'info',
                html: <div><br />
                    <h3 className="text-center">Existen piezas pendientes.</h3>
                    <div className={`modal-body`}>
                        <h4 className="text-center">¿Deseas surtir y generar una nueva Orden por las piezas pendientes o Cancelar las piezas pendientes y surtir?<br /></h4><br /><br />
                        <div className="row">
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    <table className="table table-striped table-bordered table-sm">
                                        <thead>
                                            <tr>
                                                <th className='text-center'>Piezas Autorizadas</th>
                                                <th className='text-center'>Piezas a Surtir</th>
                                                <th className='text-center'>Piezas Pendientes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {PiezasAu.map((item: any) => {
                                                return (
                                                    <tr key={item.SurtidoID}>
                                                        <td className='text-center'>{item.PiezasAutorizadas} </td>
                                                        <td className='text-center'>{item.PiezasAutorizadas} </td>
                                                        <td className='text-center'>{item.PiezasPendientes != 0 ? item.PiezasPendientes : 0}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>,
                showCloseButton: true,
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: 'Surtir y Generar Orden',
                confirmButtonColor: '#3085d6',
                cancelButtonText: 'Cancelar Piezas',
                cancelButtonColor: '#d33',
            }).then((result) => {
                if (result.isConfirmed) {
                    setState(s => ({ ...s, BotonesModal: true }))
                    MySwal.fire(
                        {
                            icon: 'info',
                            html: <div><br />
                                <h3 className="text-center">Surtiendo y Generando nueva orden por las piezas pendientes</h3>
                                <div className={`modal-body`}>
                                    <h5 className="text-center">Espere un momento... <br /> </h5>
                                </div>
                            </div>,
                            timerProgressBar: true,
                            allowEscapeKey: false,
                            allowOutsideClick: false,
                            didOpen: () => {
                                MySwal.showLoading()
                            },
                        }
                    );
                    let un = {
                        DetalleSurtido: item,
                        SurtidoId: number,
                    }
                    Funciones.FNGenerarNOrden(props.oidc, un)
                        .then((res: any) => {
                            setState(s => ({ ...s, Mostrar: false, BotonesModal: false }))
                            setState(s => ({ ...s, Datos: res }))
                            cbGuardarReOrden(res)
                            FNGetLocal()
                            MySwal.close()
                        }
                        ).catch((err: any) => {
                            FNGetLocal()
                            toast.error("Hubo un error al hacer la nueva orden. Intente nuevamente")
                            setState(s => ({
                                ...s,
                                Datos: [],
                                BotonesModal: false,
                                Form: {
                                    ...s.Form,
                                    Mostrar: false,
                                }
                            }))
                            MySwal.close()
                        })
                }
                else {
                    setState(s => ({ ...s, BotonesModal: true }))
                    MySwal.fire(
                        {
                            icon: 'info',
                            html: <div><br />
                                <h3 className="text-center">Cancelando las piezas pendientes</h3>
                                <div className={`modal-body`}>
                                    <h5 className="text-center">Espere un momento... <br /> </h5>
                                </div>
                            </div>,
                            timerProgressBar: true,
                            allowEscapeKey: false,
                            allowOutsideClick: false,
                            didOpen: () => {
                                MySwal.showLoading()
                            },
                        }
                    );
                    let un = {
                        DetalleSurtido: item,
                        SurtidoID: number,
                    }
                    Funciones.FNCancelarPiezasPendientes(props.oidc, un)
                        .then((res: any) => {
                            setState(s => ({ ...s, Mostrar: false, BotonesModal: false }))
                            setState(s => ({ ...s, Datos: res }))
                            cbCancelarPiezasPendientes(res)
                            FNGetLocal()
                            MySwal.close()
                        }
                        ).catch((err: any) => {
                            FNGetLocal()
                            toast.error("Hubo un error al cancelar las piezas pendientes. Intente nuevamente")
                            setState(s => ({
                                ...s,
                                Datos: [],
                                BotonesModal: false,
                                Form: {
                                    ...s.Form,
                                    Mostrar: false,
                                }
                            }))
                            MySwal.close()
                        })
                }
            })
        }
        else {
            MySwal.fire({
                focusCancel: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                icon: 'info',
                html: <div><br />
                    <h3 className="text-center">Confirmación</h3>
                    <div className={`modal-body`}>
                        <h5 className="text-center">Verifica las Piezas. <br /></h5><br />
                        <div className="row">
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    <table className="table table-striped table-bordered table-sm">
                                        <thead>
                                            <tr>
                                                <th className='text-center'>Detalle</th>
                                                <th className='text-center'>Piezas Autorizadas</th>
                                                <th className='text-center'>Piezas Surtidas</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {PiezasAu.map((item: any) => {
                                                return (
                                                    <tr key={item.SutidoID}>
                                                        <td className='text-center'><strong>{item.SurtidoDetalleID}</strong></td>
                                                        <td className='text-center'>{item.PiezasAutorizadas}</td>
                                                        <td className='text-center'>{item.PiezasSurtidas}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>,
                showCloseButton: false,
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#3085d6',
                cancelButtonText: 'Cancelar',
                cancelButtonColor: '#d33',
            }).then((result) => {
                if (result.isConfirmed) {
                    setState(s => ({ ...s, BotonesModal: true }))
                    MySwal.fire(
                        {
                            icon: 'info',
                            html: <div><br />
                                <h3 className="text-center">Guardando</h3>
                                <div className={`modal-body`}>
                                    <h5 className="text-center">Espera mientras se realiza el proceso de surtido. <br /> </h5>
                                </div>
                            </div>,
                            timerProgressBar: true,
                            allowEscapeKey: false,
                            allowOutsideClick: false,
                            didOpen: () => {
                                MySwal.showLoading()
                            },
                        }
                    );
                    let un = {
                        DetalleSurtido: item,
                        SurtidoID: number,
                    }
                    Funciones.FNGenerarNOrden(props.oidc, un)
                        .then((res: any) => {
                            setState(s => ({ ...s, Mostrar: false, BotonesModal: false }))
                            setState(s => ({ ...s, Datos: res }))
                            cbGuardarLocal(res)
                            FNGetLocal()
                            MySwal.close()
                        }
                        ).catch((err: any) => {
                            FNGetLocal()
                            toast.error("Hubo un error al surtir. Intente nuevamente")
                            setState(s => ({
                                ...s,
                                Datos: [],
                                BotonesModal: false,
                                Form: {
                                    ...s.Form,
                                    Mostrar: false,
                                }
                            }))
                            MySwal.close()
                        })
                }
                else {
                    setState(s => ({ ...s, BotonesModal: false }))
                    MySwal.fire(
                        {
                            icon: 'info',
                            html: <div><br />
                                <h3 className="text-center">Aviso</h3>
                                <div className={`modal-body`}>
                                    <h5 className="text-center">Operación cancelada por el usuario.</h5>
                                </div>
                            </div>,
                            confirmButtonText: `Continuar`,
                            confirmButtonColor: '#3085d6',
                        }
                    );
                }
            })
        }
    }
    const cbGuardarLocal = (item: any) => {
        toast.success('Se surtio correctamente')
        setState(state => ({
            ...state, Datos: [item],
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    SurtidoID: 0,
                    SolicitudID: 0,
                    AutorizaID: 0,
                    NombreAutoriza: '',
                    SurteID: 0,
                    NombreSurte: '',
                    CancelaID: 0,
                    NombreCancela: '',
                    FechaAutorizado: '',
                    FechaSurtido: '',
                    FechaCancelacion: '',
                    EstatusID: 0,
                    EstatusDes: '',
                    Descripcion: '',
                    Cancelada: 0,
                    ReOrden: 0,
                    OrdenID: 0,
                    ReOrdenID: 0,
                    ComprobanteDoc: '',
                    DocumentoID: 0,
                    ComprobanteFirma: '',
                    FirmaDocID: 0,
                    ProductoID: 0,
                    EmpresaId: 0,
                    Pendientes: 0,
                    DetalleSurtido: [],
                }
            }
        }))
        FNGetLocal();
    }

    const cbCancelar = (item: any, number: any) => {
        setState(s => ({ ...s, Form: state.Form }))
        setState(s => ({ ...s, BotonesModal: true }))
        let PiezasAu: any[] = []
        state.Form.Datos.DetalleSurtido.forEach(element => {
            let a = {
                SurtidoID: element.SurtidoID,
                PiezasAutorizadas: element.PiezasAutorizadas,
                PiezasSurtidas: element.PiezasSurtidas,
                PiezasPendientes: element.PiezasPendientes,
            }
            PiezasAu.push(a)
        });
        MySwal.fire({
            focusCancel: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            icon: 'info',
            html: <div><br />
                <h3 className="text-center">Confirmación</h3>
                <div className={`modal-body`}>
                    <h5 className="text-center">Realmente deseas cancelar? <br /></h5><br />
                </div>
            </div>,
            showCloseButton: false,
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#3085d6',
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#d33',
        }).then((result) => {
            if (result.isConfirmed) {
                setState(s => ({ ...s, BotonesModal: true }))
                MySwal.fire(
                    {
                        icon: 'info',
                        html: <div><br />
                            <h3 className="text-center">Cancelando</h3>
                            <div className={`modal-body`}>
                                <h5 className="text-center">Espera mientras se cancela. <br /> </h5>
                            </div>
                        </div>,
                        timerProgressBar: true,
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        didOpen: () => {
                            MySwal.showLoading()
                        },
                    }
                );
                let un = {
                    DetalleSurtido: item,
                    SurtidoID: number,
                }
                Funciones.FNCancelarSurtido(props.oidc, un)
                    .then((res: any) => {
                        setState(s => ({ ...s, Mostrar: false, BotonesModal: false }))
                        setState(s => ({ ...s, Datos: res }))
                        cbGuardarLocal2(res)
                        MySwal.close()
                    }
                    ).catch((err: any) => {
                        FNGetLocal()
                        toast.error("Hubo un error al cancelar. Intente nuevamente")
                        setState(s => ({
                            ...s,
                            Datos: [],
                            BotonesModal: false,
                            Form: {
                                ...s.Form,
                                Mostrar: false,
                            }
                        }))
                        MySwal.close()
                    })
            }
            else {
                setState(s => ({ ...s, BotonesModal: false }))
                MySwal.fire(
                    {
                        icon: 'info',
                        html: <div><br />
                            <h3 className="text-center">Aviso</h3>
                            <div className={`modal-body`}>
                                <h5 className="text-center">Operación cancelada por el usuario.</h5>
                            </div>
                        </div>,
                        confirmButtonText: `Continuar`,
                        confirmButtonColor: '#3085d6',
                    }
                );
            }
        })
    }
    const cbGuardarLocal2 = (item: any) => {
        toast.success('Se cancelo correctamente')
        setState(state => ({
            ...state, Datos: [item],
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    SurtidoID: 0,
                    SolicitudID: 0,
                    AutorizaID: 0,
                    NombreAutoriza: '',
                    SurteID: 0,
                    NombreSurte: '',
                    CancelaID: 0,
                    NombreCancela: '',
                    FechaAutorizado: '',
                    FechaSurtido: '',
                    FechaCancelacion: '',
                    EstatusID: 0,
                    EstatusDes: '',
                    Descripcion: '',
                    Cancelada: 0,
                    ReOrden: 0,
                    OrdenID: 0,
                    ReOrdenID: 0,
                    ComprobanteDoc: '',
                    DocumentoID: 0,
                    ComprobanteFirma: '',
                    FirmaDocID: 0,
                    ProductoID: 0,
                    EmpresaId: 0,
                    Pendientes: 0,
                    DetalleSurtido: [],
                }
            }
        }))
        FNGetLocal();
    }

    const cbGuardarReOrden = (item: any) => {
        toast.success('Se surtio y se genero la nueva orden correctamente')
        setState(state => ({
            ...state, Datos: [item],
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    SurtidoID: 0,
                    SolicitudID: 0,
                    AutorizaID: 0,
                    NombreAutoriza: '',
                    SurteID: 0,
                    NombreSurte: '',
                    CancelaID: 0,
                    NombreCancela: '',
                    FechaAutorizado: '',
                    FechaSurtido: '',
                    FechaCancelacion: '',
                    EstatusID: 0,
                    EstatusDes: '',
                    Descripcion: '',
                    Cancelada: 0,
                    ReOrden: 0,
                    OrdenID: 0,
                    ReOrdenID: 0,
                    ComprobanteDoc: '',
                    DocumentoID: 0,
                    ComprobanteFirma: '',
                    FirmaDocID: 0,
                    ProductoID: 0,
                    EmpresaId: 0,
                    Pendientes: 0,
                    DetalleSurtido: [],
                }
            }
        }))
        FNGetLocal();
    }

    const cbCancelarPiezasPendientes = (item: any) => {
        toast.success('Se cancelaron las piezas correctamente')
        setState(state => ({
            ...state, Datos: [item],
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    SurtidoID: 0,
                    SolicitudID: 0,
                    AutorizaID: 0,
                    NombreAutoriza: '',
                    SurteID: 0,
                    NombreSurte: '',
                    CancelaID: 0,
                    NombreCancela: '',
                    FechaAutorizado: '',
                    FechaSurtido: '',
                    FechaCancelacion: '',
                    EstatusID: 0,
                    EstatusDes: '',
                    Descripcion: '',
                    Cancelada: 0,
                    ReOrden: 0,
                    OrdenID: 0,
                    ReOrdenID: 0,
                    ComprobanteDoc: '',
                    DocumentoID: 0,
                    ComprobanteFirma: '',
                    FirmaDocID: 0,
                    ProductoID: 0,
                    EmpresaId: 0,
                    Pendientes: 0,
                    DetalleSurtido: [],
                }
            }
        }))
        FNGetLocal();
    }

    const fnCancelar = () => { setState({ ...state, Form: { ...state.Form, Mostrar: false } }) }

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Proceso de Surtido">
                    <Card.Body>
                        <Card.Body.Content >
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        paginationComponentOptions={{ rowsPerPageText: 'Resultados por página:', rangeSeparatorText: 'of', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'Todos' }}
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
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
                                        keyField={"SurtidoID"}
                                        defaultSortField={"SurtidoID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar} center={true} xlarge>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Surtido</h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbGuardar={cbAgregar}
                                                cbCancelar={cbCancelar}
                                                fnCancelar={fnCancelar}
                                                cambiarFecha={cambiarFecha}
                                                cambiarObservaciones={cambiarObservaciones}
                                            />}
                                        </ModalWin.Body>
                                    </ModalWin>
                                    {state.Form.CargarDocumento && <ModalWin open={state.Form.CargarDocumento} center large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Agregar Comprobante</h5>
                                            <button type="button" className="delete" onClick={() => {
                                                fnCancelarMostrarCargaDeDocumento()
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormAgregarComprobante
                                                oidc={props.oidc}
                                                DocumentoID={state.DocumentoID === null ? 0 : state.DocumentoID}
                                                SurtidoID={state.Form.SurtidoID}
                                                initialValues={{ file: "" }}
                                                fnCancelarMostrarCargaDeDocumento={fnCancelarMostrarCargaDeDocumento}
                                                FNGetLocal={FNGetLocal}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>}
                                    {state.Form.CargarFirma && <ModalWin open={state.Form.CargarFirma} center large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Agregar Firma</h5>
                                            <button type="button" className="delete" onClick={() => {
                                                fnCancelarCargaFirma()
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormAgregarFirma
                                                oidc={props.oidc}
                                                SurtidoID={state.Form.SurtidoID}
                                                initialValues={{ file: "" }}
                                                fnCancelarCargaFirma={fnCancelarCargaFirma}
                                                FNGetLocal={FNGetLocal}
                                                FirmaDocID={state.FirmaDocID == null ? 0 : state.FirmaDocID}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>}
                                    {state.Form.VerDoc && <ModalWin open={state.Form.VerDoc} center large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Visor de Archivos</h5>
                                            <button type="button" className="delete" onClick={() => {
                                                fnCancelarVerDocumento()
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormVerComprobante
                                                oidc={props.oidc}
                                                SurtidoID={state.Form.SurtidoID}
                                                DocumentoID={state.DocumentoID === null ? 0 : state.DocumentoID}
                                                file={state.Form.ComprobanteDoc}
                                                fnCancelarVerDocumento={fnCancelarVerDocumento}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>}
                                    {state.Form.VerFirma && <ModalWin open={state.Form.VerFirma} center large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Visor de Firmas</h5>
                                            <button type="button" className="delete" onClick={() => {
                                                fnCancelarVerFirma()
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormVerFirma
                                                oidc={props.oidc}
                                                SurtidoID={state.Form.SurtidoID}
                                                FirmaDocID={state.FirmaDocID == null ? 0 : state.FirmaDocID}
                                                fnCancelarVerFirma={fnCancelarVerFirma}
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
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})
const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogoProcesoSurtido);