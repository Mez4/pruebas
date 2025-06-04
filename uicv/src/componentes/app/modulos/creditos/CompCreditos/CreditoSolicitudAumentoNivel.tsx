import React, { useState } from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import { toast } from 'react-toastify'
import * as Funciones from './CreditoSolicitudAumentoNivel/Funciones'
// Icons
import { FaEye, FaExclamationCircle, FaFileSignature, FaFilter, FaPen, FaPencilAlt, FaPlus, FaFacebookMessenger, FaCheck, FaCheckCircle, FaMobile, FaAd, FaCheckDouble, FaBan } from 'react-icons/fa'
// Custom components
import { ActionSelect, Card, DatePickeEnd, DatePickeStart, Spinner, ImgViewer } from '../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos, formatDate } from '../../../../../global/functions'
import { boolean } from '../../../../../global/idiomaValidacion.bak'
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
import { CFormCancelarSolicitudAumento } from './CreditoSolicitudAumentoNivel/CFormCancelarSolicitudAumento'
type CatalogosType = {
    oidc: IOidc,
}
const CreditoSolicitudAumentoNivel = (props: CatalogosType) => {    // Controll our mounted state
    let isMounted = React.useRef(true)
    const MySwal = withReactContent(Swal)

    const [startDate, setStartDate] = useState(moment().add(-1, 'y').toDate());
    const [endDate, setEndDate] = useState(moment().toDate());
    const [loading, setLoading] = React.useState(false)
    const [loading2, setLoading2] = React.useState(false)
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
    const MesaAclaracion: any[] = []
    const OptionsUsuario: any[] = []
    const OptionsCredito: any[] = []
    const optSucursales: any[] = []
    const optEstatus: any[] = []
    const optBuro: any[] = []
    const optProspecto: any[] = []
    const FiltroSucursal: number = 0
    const FiltroProspecto: number = 0
    const FiltroConsolida: number = 0
    const FiltroEstatus: number = 0
    const [state, setState] = React.useState({
        SolicitudID: 0,
        Datos,
        Datos2,
        Datos3,
        DatosMostrar,
        optSucursales,
        optEstatus,
        TipoEstatus: [],
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
        OptionsCredito,
        FiltroSucursal,
        FiltroProspecto,
        FiltroConsolida,
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
    const cbGuardarAsignarEstatus = (item: any) => {
        console.log("ITEM RECIBIDO", item)
        let index = state.Datos.findIndex((x: any) => x.SolicitudID === item.SolicitudID)
        if (index > -1) {
            state.Datos[index].EstatusID = item.EstatusID,
                state.Datos[index].Estatus = item.Estatus
        }
        setState({ ...state })
    }

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
        Funciones.FNGetAumentoSol(props.oidc).then((respuesta: any) => {
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
    /*const FNGetTipoBonidicacion = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetTipoBonidicacion(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var mesa = respuesta.map((valor: any) => {
                        var obj = { value: valor.BonificacionID, label: valor.PorcentajeBonificacion };
                        return obj
                    });
                    setState(s => ({ ...s, Cargando: false, Error: false, TipoBonificacion: mesa }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, TipoBonificacion: [] }))
                }
            })
    }*/
    const FNGetTipoEstatus = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetEstatus(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var estatus = respuesta.map((valor: any) => {
                        var obj = { value: valor.EstatusID, label: valor.Estatus };
                        return obj
                    });
                    setState(s => ({ ...s, Cargando: false, Error: false, TipoEstatus: estatus, optEstatus: estatus }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, TipoEstatus: [] }))
                }
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
    /*const cbActualizar = (item: any) => {
        toast.success('Aclaración actualizada correctamente')
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.AclaracionID === item.AclaracionID ? item : Dato), Form: { ...state.Form, Mostrar: false, } })
    }*/
    /****************************************************************************************************/

    //const fnCancelar = () => setState(s => ({ ...s, Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } }))
    /*const cbAgregar = (item: any) => {
        toast.success('Aclaración agregada correctamente')

    }*/
    function formatearFecha(fecha) {
        return moment(fecha).format("DD/MM/YYYY HH:mm:ss")
    }

    const AceptarSolicitud = (Item: any) => {
        MySwal.fire({
            title: '<strong>Aceptar Solicitud Incremento</strong>',
            icon: 'warning',
            html:
                <div className="text-center">
                    <br />
                    <span className='text-center'>¿Aceptar Solicitud # {<strong>{Item.SolicitudAumentoNivID} </strong>}?</span>
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

        }
        )
            .then((result) => {
                if (result.isConfirmed) {
                    let a = {
                        DistribuidorID: Item.DistribuidorID,

                    }
                    console.log("DISTRIBUIDOR", Item.DistibuidorID)
                    Funciones.FNUpdateSoliAceptada(props.oidc, a)
                        .then((respuesta: any) => {
                            if (isMounted.current === true) {
                                FNGetLocal()
                                toast.success("Solicitud Aceptada Exitosamente")
                                /*     setState(s => ({ ...s, ContrasenaNueva: respuesta.Contrasena }))
                                    fnMostrarContra() */
                            }

                        },
                        )
                        .catch(() => {
                            toast.error("Error en la solicitud")

                        })
                } else {
                    MySwal.fire(
                        {
                            icon: 'info',
                            html: <div><br />
                                <h3 className="text-center"><strong>Aviso</strong></h3>
                                <div className={`modal-body`}>
                                    <h5 className="text-center">Operación cancelada por el usuario.</h5>
                                </div>
                            </div>,
                            confirmButtonText: `Aceptar`,
                            confirmButtonAriaLabel: `Aceptar`,
                            confirmButtonColor: `#3085d6`,
                        }
                    );
                }
            })
    }
    const Columns: IDataTableColumn[] =
        [
            {
                name: 'Id',
                selector: 'SolicitudAumentoNivID',
                center: true,
                sortable: false
            },
            {
                name: 'Distribuidor',
                selector: 'UsuarioSolicita',
                center: true,
                minWidth: "300px",
                sortable: false
            },
            {
                name: 'Sucursal',
                selector: 'Sucursal',
                sortable: false,
                center: true,
                minWidth: "200px",
                cell: (props) => <span className='text'>{props.Sucursal}</span>
            },
            {
                name: 'Estatus',
                selector: 'Estatus',
                center: true,
                sortable: false,
                minWidth: "115px",
                //cell: (props) => <span className='text'>{props.Estatus}</span>
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
                name: 'Fecha Solicito',
                selector: 'FechaSolicitud',
                center: true,
                sortable: false,
                //width:'11%',
                cell: (props) => <span className="text-center">{props.FechaSolicitud == undefined ? "N/A" : moment(props.FechaSolicitud).format("DD-MM-YYYY HH:mm:ss")}</span>
            },

            {
                name: 'Usuario Autoriza',
                selector: 'UsuarioResponde',
                sortable: false,
                center: true,
                minWidth: "300px",
                //width: '15%',
                cell: row => <span className='text-center'>{row.UsuarioResponde ? (row.UsuarioResponde) : 'N/A'}</span>
            },
            {
                name: 'Fecha Autorización',
                selector: 'FechaRespuesta',
                sortable: false,
                center: true,
                cell: props => <span className='text-center'>{props.FechaRespuesta == undefined ? "N/A" : moment(props.FechaRespuesta).format("DD-MM-YYYY HH:mm:ss")}
                </span>
            },
            {
                name: 'Motivo Cancelacion',
                selector: 'MotivoCancelacion',
                sortable: false,
                center: true,
                minWidth: "200px",
                //width: '11%',
            },
            {
                name: 'Aceptar Solicitud',
                center: true,
                sortable: false,
                cell: (propss) =>
                    <div className='divInDTable text-center radiusSmallDivR' data-tip data-for={`AS_${propss.SolicitudAumentoNivID}`}>
                        <button
                            disabled={(propss.EstatusID != 3)}
                            className="btn btn-outline-default buttonIconInDTable"
                            type={"button"}
                            onClick={() => AceptarSolicitud(propss)}>
                            <FaCheckCircle />
                            <ReactTooltip id={`AS_${propss.SolicitudAumentoNivID}`} type="info" effect="solid">Aceptar Solicitud</ReactTooltip>
                        </button>
                    </div>
            },
            {
                name: 'Cancelar Incremento',
                center: true,
                sortable: false,
                cell: (propss) =>
                    <div className='divInDTable text-center radiusSmallDivR' data-tip data-for={`CS_${propss.SolicitudAumentoNivID}`}>
                        <button
                            disabled={(propss.EstatusID != 3)}
                            className="btn btn-outline-default buttonIconInDTable"
                            type={"button"}
                            onClick={() => {
                                setState({
                                    ...state,
                                    SolicitudID: propss.SolicitudAumentoNivID,
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
                            <ReactTooltip id={`CS_${propss.SolicitudAumentoNivID}`} type="info" effect="solid">Cancelar Solicitud</ReactTooltip>
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

        if (startDate != null && endDate != null) {
            startDate.setHours(0, 0, 0)
            endDate.setHours(23, 59, 59)
            datosFiltro = datosFiltro.filter(d => { return d.FechaSolicitud >= startDate.toISOString() && d.FechaSolicitud <= endDate.toISOString() || d.FechaSolicitud === null })
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
        <div className="row ">
            <div className="col-12">
                <Card Title="REVISIÓN DE SOLICITUDES DE AUMENTO DE NIVEL">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando &&
                                <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        subHeader
                                        noDataComponent={
                                            <div style={{ margin: '4em' }}>
                                                {<><FaExclamationCircle color={'grey'} size={20} />  NO HAY SOLICITUDES </>}
                                            </div>}
                                        paginationComponentOptions={{ rowsPerPageText: 'Registros por página:', rangeSeparatorText: 'de', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'Todo' }}
                                        subHeaderComponent=
                                        {
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
                                                                                    label="Sucursales"
                                                                                    name="SucursalID"
                                                                                    placeholder="TODOS"
                                                                                    options={state.optSucursales}
                                                                                    addDefault={false}
                                                                                    valor={state.FiltroSucursal}
                                                                                    accion={fnGetFiltrosSucursales}
                                                                                />
                                                                            </div>
                                                                            <div style={{ height: '57px', width: '245px' }}>
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
                                                                        </div>
                                                                    </Form>
                                                                </Formik>
                                                            </div>
                                                        </div>
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
                                        keyField={"SolicitudID"}
                                        defaultSortAsc={false}
                                        columns={Columns}
                                        paginationPerPage={10}
                                        style={{ paddingBottom: '2em', width: '100%' }}
                                        fixedHeaderScrollHeight={'fixed'}
                                    />
                                    <ModalWin open={state.Form.MostrarCancelacion} center={true} >
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>CANCELAR SOLICITUD AUMENTO DE NIVEL </h5>
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
                                            <CFormCancelarSolicitudAumento
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
                                                CbRefresh={FNGetLocal}
                                            />
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
const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})
const mapDispatchToProps = {
}
export default connect(mapStateToProps, mapDispatchToProps)(CreditoSolicitudAumentoNivel);