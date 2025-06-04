import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

import * as Funciones from './Funciones'

import moment from 'moment'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle, FaCheckCircle, FaClock, FaBan, FaEye, FaTimesCircle, FaComment, FaListAlt, FaCheckDouble } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'
import ReactTooltip from 'react-tooltip'
import { FormateoDinero, FormateoPorcentaje, FormateoNumero2D } from '../../../../../../global/variables'

import { FiltrarDatos, truncateDecimals } from '../../../../../../global/functions'
import { CForm } from './CForm'
import { SubirSolicitud } from './SubirSolicitud'
import { ConvenioDetalle } from './Detalle'
import { date } from 'yup'
import { toast } from 'react-toastify'
import { HiDownload, HiUpload } from 'react-icons/hi'


type CatalogosType = {
    oidc: IOidc,
    // fnCancelar(): any,
    cbActualizar(Datos: any, item: any): any,
    DistribuidorID: number,
    DistribuidorDesc: string,
    Data: any[],
    DatosDefecto: {
        ConvenioID: number,
        EstatusId: number,
        Editar: boolean,
        DistribuidorID: number,
        SucursalID: number,
        PorcPagInt: number,
        PorcBon: number,
        Plazos: number,
        SaldoActual: number,
        saldoAtrasado: number,
        DiasAtraso: number,
        isPagoIntencion: boolean,
        doc: string,
        file: null
    }
}

export const Convenios = (props: CatalogosType) => {

    // console.log('DatosDefecto: ', props.DatosDefecto)

    const MySwal = withReactContent(Swal)

    const SwalWarning = (title: string, msg: string) => {

        let timerInterval

        MySwal.fire(
            {
                icon: 'info',
                html: <div><br />
                    <h3 className="text-center">{title}</h3>
                    <div className={`modal-body`}>
                        <div className='row text-center'>
                            <span className="text-center"><h4>{msg}</h4></span>
                            <br />
                            <span className='text-center'><h4><strong>Por favor espere...</strong></h4></span>
                        </div>
                    </div>
                </div>,
                timerProgressBar: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonText: `Ok`,
                didOpen: () => {
                    MySwal.showLoading()
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
            }
        );
    }

    // Controll our mounted state
    let isMounted = React.useRef(true)
    const [loading, setLoading] = React.useState(false)

    // const DatosDefecto = { DistribuidorID: 0, FechaRegistro: new Date, Activo: true, DistribuidorID: 0, Monto: 0 }
    const Saldos = {
        SaldoActual: 0,
        saldoAtrasado: 0,
        DiasAtraso: 0,
        PorcPagInt: 0
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    // const DatosDetalle: any[] = []
    const DatosDetalle = {
        ConvenioID: 0,
        DistribuidorID: 0,
        ProductoID: 0,
        SucursalID: 0,
        PorcPagInt: 0,
        PorcBon: 0,
        Plazos: 0,
        // SaldoActual: number,
        // saldoAtrasado: number,
        // DiasAtraso: number
    }
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        DatosDetalle,
        Filtro: '',
        Cargando: true,
        Error: false,
        Detalle: false,
        // VerTicket: false,
        // SubirTicket: false,
        // GestorID: 0,
        // TicketID: 0,
        // Abono: 0,
        // FechaRegistro: date,
        // Activo: 0,
        // Identificador: 0,
        // UltRelacionImporte: '',
        // Fecha: '',
        // FechaCorte: '',
        // Confirmacion: false,
        // ConfirmacionSMS: false,
        Form:
        {
            Mostrar: false,
            Saldos,
            Datos: props.DatosDefecto,
            Id: undefined,
            // Estatus: 0,
            loading: false
        },
        SubirPDF: false,
    })

    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))
        Funciones.getSaldoRelacion(props.oidc, props.DistribuidorID)
            .then((respuesta: any) => {

                // console.log('respuesta: ', respuesta)

                var PorcPagInt = truncateDecimals(respuesta.data.SaldoActual * 0.05, 2)

                setState(s => ({ ...s, Cargando: false, Error: false, Form: { ...state.Form, Mostrar: false, Saldos: { saldoAtrasado: respuesta.data.saldoAtrasado, SaldoActual: respuesta.data.SaldoActual, DiasAtraso: respuesta.data.DiasAtraso, PorcPagInt }, Datos: { ...state.Form.Datos, saldoAtrasado: respuesta.data.saldoAtrasado, SaldoActual: respuesta.data.SaldoActual, DiasAtraso: respuesta.data.DiasAtraso, PorcPagInt, EstatusId: respuesta.data.EstatusId } } }))
            })
            .catch((error) => {
                setState(s => ({ ...s, Cargando: false, Error: true, Form: { ...state.Form, Mostrar: false, Saldos: { saldoAtrasado: 0, SaldoActual: 0, DiasAtraso: 0, PorcPagInt: 0 }, Datos: props.DatosDefecto } }))
            })
    }

    // const FNGetDetalle = (ConvenioID: number) => {
    //     Funciones.getConvenioDetalle(props.oidc, ConvenioID)
    //         .then((respuesta: any) => {
    //             // if (isMounted.current === true) {
    //             setState(s => ({ ...s, Detalle: true, DatosDetalle: respuesta.data }))
    //             // }
    //         })
    //         .catch(() => {
    //             // if (isMounted.current === true) {
    //             setState(s => ({ ...s, Detalle: false, DatosDetalle: [] }))
    //             // }
    //         })
    // }

    // const FNAutorizar = (Datos: { ConvenioID: number, DistribuidorID: number, SucursalID: number, Estatus: number }) => {

    //     setState({ ...state, Form: { ...state.Form, Mostrar: true, Estatus: Datos.Estatus } })
    // Funciones.autorizaConvenio(props.oidc, Datos)
    //     .then((respuesta: any) => {
    //         if (respuesta.resultCode == 0) {
    //             toast.success(respuesta.resultDesc)
    //             cbActualizar(respuesta.data)
    //         }
    //         else {
    //             toast.warning(respuesta.resultDesc)
    //         }
    //     })
    //     .catch(() => {
    //         toast.error("Error al autorizar el convenio, vuelva a intentarlo.")
    //     })
    // }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Id',
                    width: '5%',
                    selector: 'ConvenioID',
                    sortable: true,
                },

                {
                    name: 'Saldo Conveniado',
                    selector: 'SaldoConveniado',
                    width: '10%',
                    sortable: true,
                    center: true,
                    cell: (props) => <span className="LabelInDTable">{FormateoDinero.format(props.SaldoConveniado)}</span>
                },

                {
                    name: 'Estatus',
                    selector: 'EstatusDesc',
                    width: '9%',
                    sortable: true,
                    center: true,
                    cell: (props) =>
                        <div style={{ width: '100%', textAlign: 'center', color: `${props.Color}` }}>
                            {props.EstatusDesc}
                        </div>
                },

                {
                    name: '% Bonif',
                    selector: 'PorcBon',
                    width: '6%',
                    sortable: true,
                    center: true,
                    cell: (props) => <span className="LabelInDTable">{FormateoPorcentaje.format(props.PorcBon)}</span>
                },

                {
                    name: 'Imp Bonificado',
                    selector: 'ImporteBonificar',
                    width: '10%',
                    sortable: true,
                    center: true,
                    cell: (props) => <span className="LabelInDTable">{FormateoDinero.format(props.ImporteBonificar)}</span>
                },

                {
                    name: 'Importe Conveniado',
                    selector: 'ImporteConvenio',
                    width: '10%',
                    sortable: true,
                    center: true,
                    cell: (props) => <span className="LabelInDTable">{FormateoDinero.format(props.ImporteConvenio)}</span>
                },

                {
                    name: 'Cobrado',
                    selector: 'Saldo_Deposito',
                    width: '10%',
                    sortable: true,
                    center: true,
                    cell: (props) => <span className="LabelInDTable">{FormateoDinero.format(props.Saldo_Deposito)}</span>
                },

                {
                    name: 'Saldo Actual',
                    selector: 'SaldoActual',
                    width: '10%',
                    sortable: true,
                    center: true,
                    cell: (props) => <span className="LabelInDTable">{FormateoDinero.format(props.SaldoActual)}</span>
                },

                {
                    name: 'Plazos',
                    selector: 'PlazosTotales',
                    width: '5%',
                    sortable: true,
                },

                {
                    name: '% Int',
                    selector: 'PorcPagInt',
                    width: '9%',
                    sortable: true,
                    center: true,
                    cell: (props) => <span className="LabelInDTable">{FormateoPorcentaje.format(props.PorcPagInt)}</span>
                },

                {
                    name: 'Pago Intencion',
                    selector: 'PagoIntencion',
                    width: '9%',
                    sortable: true,
                    center: true,
                    cell: (props) => <span className="LabelInDTable">{FormateoDinero.format(props.PagoIntencion)}</span>
                },

                { name: 'Fecha Registro', width: '110px', selector: 'FechaRegistro', sortable: true, cell: (props) => <span>{moment(props.FechaRegistro).format('DD/MM/YYYY')}</span> },

            ]
        return colRet
    }, [state.Form])

    const HiddenColumns: IDataTableColumn[] =
        [
            {
                name: 'Acciones',
                sortable: false,
                wrap: true,
                cell: (data) =>
                    <div style={{ width: '50%', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                        <button disabled={!(data.EstatusId == 3 || data.EstatusId == 4)} data-tip data-for={`DetalleTooltip${data.ConvenioID}`} className="asstext" style={{ margin: '.15em', width: '16%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} type="button" onClick={() => {

                            setState({
                                ...state,
                                Detalle: true,
                                DatosDetalle: {
                                    ConvenioID: data.ConvenioID,
                                    DistribuidorID: data.DistribuidorID,
                                    ProductoID: data.ProductoID,
                                    SucursalID: data.SucursalID,
                                    PorcPagInt: 0,
                                    PorcBon: 0,
                                    Plazos: 0,
                                }
                            })
                        }}>
                            <FaListAlt />
                        </button>
                        <ReactTooltip id={`DetalleTooltip${data.ConvenioID}`}
                            type="info"
                            effect="solid"
                            clickable
                            globalEventOff="click"
                        >
                            Plan de Pagos
                        </ReactTooltip>

                        <button disabled={data.EstatusId != 1} data-tip="true" data-for={`AutorizarTooltip${data.ConvenioID}`} className="asstext" style={{ margin: '.15em', width: '16%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} type={"button"} onClick={() => {
                            setState({
                                ...state, Form: {
                                    ...state.Form, Mostrar: true, Id: undefined,
                                    Datos: {
                                        ...state.Form.Datos,
                                        ConvenioID: data.ConvenioID,
                                        PorcPagInt: data.PagoIntencion,
                                        PorcBon: data.PorcBon,
                                        Plazos: data.Plazos,
                                        SaldoActual: state.Form.Saldos.SaldoActual,
                                        saldoAtrasado: state.Form.Saldos.saldoAtrasado,
                                        DiasAtraso: state.Form.Saldos.DiasAtraso,
                                        isPagoIntencion: data.PorcPagInt > 0 ? true : false,
                                        EstatusId: data.EstatusId
                                    }
                                }
                            })
                        }}>
                            <FaCheckCircle color={data.EstatusId == 1 ? 'green' : 'gray'} />
                        </button>
                        <ReactTooltip id={`AutorizarTooltip${data.ConvenioID}`}
                            type="info"
                            effect="solid"
                            clickable
                            globalEventOff="click"
                        >
                            Autorizar Convenio
                        </ReactTooltip>

                        <button disabled={data.EstatusId != 2} data-tip="true" data-for={`AplicarTooltip${data.ConvenioID}`} className="asstext" style={{ margin: '.15em', width: '16%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} type={"button"} onClick={() => {
                            // console.log('Datos Aplicar: ', data)
                            setState({
                                ...state, Form: {
                                    ...state.Form, Mostrar: true, Id: undefined,
                                    Datos: {
                                        ...state.Form.Datos,
                                        ConvenioID: data.ConvenioID,
                                        PorcPagInt: data.PagoIntencion,
                                        PorcBon: data.PorcBon,
                                        Plazos: data.Plazos,
                                        SaldoActual: state.Form.Saldos.SaldoActual,
                                        saldoAtrasado: state.Form.Saldos.saldoAtrasado,
                                        DiasAtraso: state.Form.Saldos.DiasAtraso,
                                        isPagoIntencion: data.PorcPagInt > 0 ? true : false,
                                        EstatusId: data.EstatusId,
                                    }
                                }
                            })
                        }}>
                            <FaCheckDouble color={data.EstatusId == 2 ? 'blue' : 'gray'} />
                        </button>
                        <ReactTooltip id={`AplicarTooltip${data.ConvenioID}`}
                            type="info"
                            effect="solid"
                            clickable
                            globalEventOff="click"
                        >
                            Aplicar Convenio
                        </ReactTooltip>

                        <button disabled={data.EstatusId != 3} data-tip="true" data-for={`SolicitudPDFTooltip${data.ConvenioID}`} className="asstext" style={{ margin: '.15em', width: '16%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} type={"button"} onClick={() => {
                            setState({
                                ...state,
                                Form: {
                                    ...state.Form,
                                    Datos: {
                                        ...state.Form.Datos,
                                        ConvenioID: data.ConvenioID,
                                        PorcPagInt: data.PagoIntencion,
                                        PorcBon: data.PorcBon,
                                        Plazos: data.Plazos,
                                        SaldoActual: state.Form.Saldos.SaldoActual,
                                        saldoAtrasado: state.Form.Saldos.saldoAtrasado,
                                        DiasAtraso: state.Form.Saldos.DiasAtraso,
                                        isPagoIntencion: data.PorcPagInt > 0 ? true : false,
                                        EstatusId: data.EstatusId,
                                    }
                                },
                                SubirPDF: true,
                            })
                        }}>
                            <HiUpload color={(data.EstatusId != 3) ? 'gray' : 'green'} />
                        </button>
                        <ReactTooltip id={`SolicitudPDFTooltip${data.ConvenioID}`}
                            type="info"
                            effect="solid"
                            clickable
                            globalEventOff="click"
                        >
                            Subir Solicitud de Convenio
                        </ReactTooltip>

                        <button disabled={data.DocumentoConvenioID == 0} data-tip="true" data-for={`DescargarPDFTooltip${data.ConvenioID}`} className="asstext" style={{ margin: '.15em', width: '16%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} type={"button"} onClick={() => {
                            Funciones.FNDescargarPDF(props.oidc, data.DocumentoConvenioID)
                                .then((pdf: any) => {
                                    console.log('PDF: ', pdf)

                                    // var request = new XMLHttpRequest();
                                    // request.open('GET', pdf.src, true);
                                    // request.responseType = 'blob';
                                    // request.onload = function () {
                                    //     var reader = new FileReader();
                                    //     reader.readAsDataURL(request.response);
                                    //     reader.onload = function (e: any) {
                                    //         console.log('DataURL:', e.target.result);
                                    //     };
                                    // };
                                    // request.send();

                                    // function previewFile(file) {

                                    //     console.log('file: ', file)

                                    //     var reader = new FileReader();
                                    //     reader.onloadend = function () {
                                    //         console.log('result: ', reader.result); //this is an ArrayBuffer
                                    //     }
                                    //     reader.readAsArrayBuffer(file);
                                    //     console.log('reader: ', reader)
                                    // }

                                    // previewFile(pdf.src)

                                    const file = new Blob(
                                        [pdf],
                                        { type: 'application/pdf' });

                                    var url = window.URL.createObjectURL(file);
                                    var anchor = document.createElement("a");
                                    anchor.download = "solicitud.pdf";
                                    anchor.href = url;
                                    anchor.click();
                                    // setLoading(false)

                                    toast.success("Descarga de documento realizada correctamente")
                                })
                                .catch((error: any) => {
                                    toast.error("Error al descargar documento")
                                    setLoading(false)
                                })
                        }}>
                            <HiDownload color={(data.DocumentoConvenioID > 0) ? 'orange' : 'gray'} />
                        </button>
                        <ReactTooltip id={`DescargarPDFTooltip${data.ConvenioID}`}
                            type="info"
                            effect="solid"
                            clickable
                            globalEventOff="click"
                        >
                            Descargar Solicitud de Convenio
                        </ReactTooltip>

                        <button disabled={data.EstatusId == 3 || data.EstatusId == 4 || data.EstatusId == 5} data-tip="true" data-for={`CancelarTooltip${data.ConvenioID}`} className="asstext" style={{ margin: '.15em', width: '16%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} type={"button"} onClick={() => {
                            MySwal.fire({
                                title: '<strong>Cancelar Convenio</strong>',
                                icon: 'question',
                                html:
                                    <div className="text-center">
                                        Se cancelará el convenio ¿Desea continuar?
                                    </div>,
                                showCloseButton: false,
                                showCancelButton: true,
                                showConfirmButton: true,
                                focusConfirm: false,
                                cancelButtonText: 'Cancelar',
                                confirmButtonText: 'Aceptar',
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonAriaLabel: 'Aceptar',
                                cancelButtonAriaLabel: ''
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    SwalWarning('Aviso', 'Cancelando solicitud de convenio, porfavor espere.');

                                    Funciones.cancelarConvenio(props.oidc, data.ConvenioID)
                                        .then((respuesta: any) => {
                                            if (respuesta.resultCode === 0) {
                                                toast.success(`Se canceló el convenio con el Id ${respuesta.data.ConvenioID}`)
                                                cbActualizar(respuesta.data)
                                                MySwal.close();
                                                // toast.info("Se está generando el comprobante, por favor espere...")
                                            }
                                            else {
                                                MySwal.close();
                                                setLoading(false)
                                                toast.error(respuesta.resultDesc)
                                            }
                                        })
                                        .catch((error: any) => {
                                            MySwal.close();
                                            console.log(JSON.stringify(error))
                                            setLoading(false)

                                            toast.error("Error al generar el convenio")
                                        })

                                    // FNCancelar(data.ConvenioID)
                                }
                            })
                        }}>
                            <FaBan color={(data.EstatusId == 3 || data.EstatusId == 4 || data.EstatusId == 5) ? 'gray' : 'red'} />
                        </button>
                        <ReactTooltip id={`CancelarTooltip${data.ConvenioID}`}
                            type="info"
                            effect="solid"
                            clickable
                            globalEventOff="click"
                        >
                            Cancelar Convenio
                        </ReactTooltip>

                    </div>
            },
        ]
    // return col
    // }, [])

    const HiddenData = (data: any) => {
        const Datos = [data.data]
        // console.log(Datos)
        return (
            <DataTable
                data={Datos}
                striped
                noHeader
                noTableHead
                responsive
                keyField={"ConvenioID"}
                defaultSortField={"ConvenioID"}
                columns={HiddenColumns}
            />
        )
    }

    // const DetailColumns = React.useMemo(() => {
    //     let colRet: IDataTableColumn[] =
    //         [
    //             { name: '# Pago', width: '95px', selector: 'NoPago', sortable: true, },
    //             { name: 'Fecha Vencimiento', width: '110px', selector: 'FechaVencimiento', sortable: true, cell: (props) => <span>{moment(props.FechaVencimiento).format('DD/MM/YYYY')}</span> },
    //             { name: 'Importe', width: '150px', selector: 'Importe', sortable: true, format: row => FormateoDinero.format(row.ImporteTotal) },
    //             { name: 'Abono', width: '150px', selector: 'Saldo_Dep', sortable: true, format: row => FormateoDinero.format(row.Abonos) },
    //             { name: 'Saldo', width: '150px', selector: 'Saldo_Plazo', sortable: true, format: row => FormateoDinero.format(row.SaldoActual) },
    //             { name: 'Fecha Deposito', width: '110px', selector: 'FechaDeposito', sortable: true, cell: (props) => <span>{props.FechaLiquidacion ? moment(props.FechaLiquidacion).format('DD/MM/YYYY') : ''}</span> },
    //             { name: 'Dias Atraso', selector: 'DiasAtraso', sortable: true, },
    //         ]
    //     return colRet
    // }, [])

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        //FNGetRelaciones()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])


    React.useEffect(() => {
        setState(s => ({ ...s, Datos: props.Data }))
        // eslint-disable-next-line
    }, [props.Data])

    // On use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    const FNAutorizar = (Datos: { DistribuidorID: number, ConvenioID: number, SucursalID: number, PorcPagInt: number, PorcBon: number, Plazos: number, Editar: boolean }) => {
        setState({ ...state, Form: { ...state.Form, loading: true } })

        switch (state.Form.Datos.EstatusId) {
            case 0:
                SwalWarning('Aviso', 'Creando solicitud de convenio, porfavor espere.');
                Funciones.solicitarConvenio(props.oidc, Datos)
                    .then((respuesta: any) => {
                        if (respuesta.resultCode === 0) {
                            toast.success(`Se creó el convenio con el Id ${respuesta.data.ConvenioID}`)
                            cbAgregar(respuesta.data)
                            MySwal.close();
                            // toast.info("Se está generando el comprobante, por favor espere...")
                        }
                        else {
                            MySwal.close();
                            // setLoading(false)
                            toast.error(respuesta.resultDesc)
                        }
                    })
                    .catch((error: any) => {
                        MySwal.close();
                        console.log(JSON.stringify(error))
                        // setLoading(false)

                        toast.error("Error al generar el convenio")
                    })
                break;
            case 1:
                SwalWarning('Aviso', 'Autorizando la solicitud de convenio, porfavor espere.');
                Funciones.creaConvenio(props.oidc, Datos)
                    .then((respuesta: any) => {
                        if (respuesta.resultCode === 0) {
                            toast.success(`Se autorizó el convenio con el Id ${respuesta.data.ConvenioID}`)
                            cbActualizar(respuesta.data)
                            // toast.info("Se está generando el comprobante, por favor espere...")
                        }
                        else {
                            // setLoading(false)
                            setState({ ...state, Form: { ...state.Form, loading: false } })
                            toast.error(respuesta.resultDesc)
                        }

                        MySwal.close();

                    })
                    .catch((error: any) => {

                        setState({ ...state, Form: { ...state.Form, loading: false } })

                        MySwal.close();

                        console.log(JSON.stringify(error))
                        // setLoading(false)

                        toast.error("Error al generar el convenio")
                    })
                break;
            case 2:
                SwalWarning('Aviso', 'Aplicando la solicitud de convenio, porfavor espere.');
                Funciones.autorizaConvenio(props.oidc, Datos)
                    .then((respuesta: any) => {
                        if (respuesta.resultCode == 0) {
                            toast.success(respuesta.resultDesc)
                            toast.info("Se está generando la solicitud de convenio, por favor espere...")

                            Funciones.pdfConvenio(props.oidc, respuesta.data.ConvenioID)
                                .then((pdf: any) => {

                                    const file = new Blob(
                                        [pdf],
                                        { type: 'application/pdf' });

                                    var url = window.URL.createObjectURL(file);
                                    var anchor = document.createElement("a");
                                    anchor.download = "Solicitud_Convenio.pdf";
                                    anchor.href = url;
                                    anchor.click();

                                    cbActualizar(respuesta.data)
                                    MySwal.close();

                                })
                                .catch((error: any) => {
                                    console.log(JSON.stringify(error))
                                    setState({ ...state, Form: { ...state.Form, loading: false } })
                                    toast.error("Error al descargar el archivo, reportarlo a sistemas")
                                    MySwal.close();

                                })
                        }
                        else {
                            setState({ ...state, Form: { ...state.Form, loading: false } })
                            toast.warning(respuesta.resultDesc)
                            MySwal.close();
                        }

                    })
                    .catch(() => {
                        setState({ ...state, Form: { ...state.Form, loading: false } })

                        MySwal.close();

                        toast.error("Error al aplicar el convenio, vuelva a intentarlo.")
                    })
                break;
            default:
                toast.error("El convenio no puede ser modificado, solicite uno nuevo.")
        }

    }

    const cbActualizar = (item: any) => {

        props.cbActualizar(state.Datos.map(Dato => Dato.ConvenioID === item.ConvenioID ? item : Dato), item)

        setState({
            ...state, //Datos: state.Datos.map(Dato => Dato.ConvenioID === item.ConvenioID ? item : Dato), 
            Form: { ...state.Form, Mostrar: false, loading: false, Datos: props.DatosDefecto },
            SubirPDF: false
        })
    }
    /** funcion Callback al actualizar un item */
    const cbAgregar = (item: any) => {

        props.cbActualizar([...state.Datos, item], item)

        setState({
            ...state, //Datos: [...state.Datos, item], 
            Form: { ...state.Form, Mostrar: false, Datos: props.DatosDefecto },
            SubirPDF: false
        })
    }

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false }, SubirPDF: false })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="CONVENIOS">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-primary" type="button"
                                                            onClick={() =>
                                                                setState({
                                                                    ...state, Form: {
                                                                        ...state.Form, Mostrar: true, Id: undefined,
                                                                        Datos: {
                                                                            ...state.Form.Datos,
                                                                            ConvenioID: 0,
                                                                            PorcBon: 0,
                                                                            Plazos: 0,
                                                                            SaldoActual: state.Form.Saldos.SaldoActual,
                                                                            saldoAtrasado: state.Form.Saldos.saldoAtrasado,
                                                                            DiasAtraso: state.Form.Saldos.DiasAtraso,
                                                                            PorcPagInt: state.Form.Saldos.PorcPagInt,
                                                                            isPagoIntencion: false,
                                                                            EstatusId: 0,
                                                                        }
                                                                    }
                                                                })
                                                                // setState({ ...state, Form: { ...state.Form, Mostrar: true, Id: undefined } })
                                                            }
                                                        ><FaPlus /></button>
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
                                                    </div>
                                                </div>
                                                <br />
                                            </div>
                                        }
                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"ConvenioID"}
                                        defaultSortField={"ConvenioID"}
                                        noDataComponent="Socia sin convenios activos"
                                        // keyField={"Activo"}
                                        // defaultSortField={"Activo"}
                                        columns={Columns}
                                        expandableRows
                                        // expandOnRowClicked
                                        onRowExpandToggled={(res: any) => {
                                            HiddenData(res)
                                        }}
                                        expandableRowsComponent={<HiddenData />}
                                    />

                                    <ModalWin open={state.Form.Mostrar} center>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>SOCIA: {props.DistribuidorID} {props.DistribuidorDesc}</h5>
                                            <button type="button" className="delete" onClick={fnCancelar}></button>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {state.Form.Mostrar && <CForm
                                                oidc={props.oidc}
                                                DistribuidorDesc={props.DistribuidorDesc}
                                                initialValues={state.Form.Datos}
                                                loading={state.Form.loading}
                                                cbGuardar={FNAutorizar}
                                                fnCancelar={fnCancelar}
                                            />}
                                        </ModalWin.Body>
                                    </ModalWin>

                                    <ModalWin open={state.Detalle} center large scrollable>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {"Plan de Pagos"}
                                            </h5>
                                            <button type="button" className="delete" onClick={() => setState({ ...state, Detalle: false })} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {state.Detalle &&
                                                <ConvenioDetalle
                                                    oidc={props.oidc}
                                                    DistribuidorDesc={props.DistribuidorDesc}
                                                    Params={state.DatosDetalle}
                                                />
                                            }
                                        </ModalWin.Body>
                                    </ModalWin>

                                    <ModalWin open={state.SubirPDF} center large scrollable>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {"Subir Solicitud de Convenio"}
                                            </h5>
                                            <button type="button" className="delete" onClick={() => setState({ ...state, SubirPDF: false })} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {state.SubirPDF &&
                                                <SubirSolicitud
                                                    oidc={props.oidc}
                                                    DistribuidorDesc={props.DistribuidorDesc}
                                                    initialValues={state.Form.Datos}
                                                    cbActualizar={cbActualizar}
                                                    fnCancelar={fnCancelar}
                                                />
                                            }
                                        </ModalWin.Body>
                                    </ModalWin>

                                </div>
                            }
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>
        </div >
    )
}
