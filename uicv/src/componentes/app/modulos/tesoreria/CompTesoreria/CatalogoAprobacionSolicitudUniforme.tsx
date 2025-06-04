import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import * as Funciones from './CatalogoAprobacionSolicitudUniforme/Funciones'
import { toast } from 'react-toastify'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
// Icons
import { FaCheck, FaCheckCircle, FaCircle, FaClone, FaEye, FaPencilAlt, FaPlus, FaPrint, FaSearch, FaTrash, FaWindowClose } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CatalogoAprobacionSolicitudUniforme/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { inputCSS } from 'react-select/src/components/Input'
import moment from 'moment'
import ReactTooltip from 'react-tooltip'
type CatalogosType = {
    oidc: IOidc
}

const CatalogoAprobacionSolicitudUniforme = (props: CatalogosType) => {    // Controll our mounted state
    let isMounted = React.useRef(true)
    const DatosMostrar: any[] = []
    const DetalleSolicitud: any[] = []
    const MySwal = withReactContent(Swal)

    const DatosDefecto = {
        AprobadoID: 0
        , SolicitudID: 0
        , SolicitanteID: 0
        , NombreSolicita: ''
        , ApruebaID: 0
        , NombreAprueba: ''
        , FechaSolicitud: ''
        , FechaAprobado: ''
        , EstatusID: 0
        , EstatusDes: ''
        , Descripcion: ''
        , ProductoID: 0
        , DetalleAprobacion:
            [{
                AprobadoDetalleID: 0
                , AprobadoID: 0
                , SolicitudDetalleID: 0
                , CorteID: 0
                , Corte: ''
                , PiezasSolicitadas: 0
                , PiezasAprobadas: 0
            }],
    }

    const Datos: any[] = []

    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        DetalleSolicitud,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            MostrarCrearMovimiento: false,
            Id: 0
        }
    })

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    console.log(respuesta)
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const cambiarPiezas2 = (item: any, valor: number) => {
        let index = state.Form.Datos.DetalleAprobacion.findIndex((respuesta: any) => {
            return respuesta.AprobadoDetalleID === item.AprobadoDetalleID
        })
        state.Form.Datos.DetalleAprobacion[index].PiezasAprobadas = valor
        setState(s => ({
            ...s, Form: {
                ...s.Form, Datos: state.Form.Datos
            }

        }))
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

    const Columns: IDataTableColumn[] =
        [
            {
                name: 'Aprobacion',
                selector: 'AprobadoID',
                sortable: true,
                center: true,
                cell: row => <span className='text-center'>{row.AprobadoID}</span>
            },
            {
                name: 'Solicita',
                selector: 'NombreSolicita',
                sortable: false,
                center: true,
                cell: row => <span className='text-center'>{row.NombreSolicita}</span>
            },
            {
                name: 'Aprueba',
                selector: 'NombreAprueba',
                sortable: false,
                center: true,
                cell: row => <span className='text-center'>{row.NombreAprueba != undefined ? row.NombreAprueba : "--"}</span>
            },
            {
                name: 'FechaSolicitud',
                selector: 'FechaSolicitud',
                sortable: false,
                center: true,
                cell: row => <span className='text-center'>{row.FechaSolicitud == undefined ? "--" : moment(row.FechaSolicitud).format("DD-MM-YYYY hh:mm:ss")}</span>

            },
            {
                name: 'FechaAprobado',
                selector: 'FechaAprobado',
                sortable: false,
                center: true,
                cell: row => <span className='text-center'>{row.FechaAprobado == undefined ? "--" : moment(row.FechaAprobado).format("DD-MM-YYYY hh:mm:ss")}</span>

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
                name: 'Acciones',
                sortable: false,
                center: true,
                cell: (props) =>
                    <button className="asstext" type={"button"} data-tip data-for="Btn_deta" onClick={() => {
                        let nuevo = {
                            AprobadoID: props.AprobadoID
                            , SolicitudID: props.SolicitudID
                            , SolicitanteID: props.SolicitanteID
                            , NombreSolicita: props.NombreSolicita
                            , ApruebaID: props.ApruebaID
                            , NombreAprueba: props.NombreAprueba
                            , FechaSolicitud: props.FechaSolicitud
                            , FechaAprobado: props.FechaAprobado
                            , EstatusID: props.EstatusID
                            , EstatusDes: props.EstatusDes
                            , Descripcion: props.Descripcion
                            , ProductoID: props.ProductoID
                            , DetalleAprobacion: props.DetalleAprobacion
                        }
                        setState(s => ({
                            ...s,
                            Form: {
                                ...s.Form,
                                Mostrar: true,
                                Datos: nuevo,
                                Id: props.AprobadoID
                            }
                        }))
                    }}>
                        <FaEye />
                        <ReactTooltip id="Btn_deta" type="info" effect="solid" >
                            Ver Detalle
                        </ReactTooltip>
                    </button>
            },
        ]

    React.useEffect(() => {
        FNGetLocal()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])


    const cbAgregar = (item: any, number: any) => {
        setState(s => ({ ...s, Form: state.Form }))
        setState(s => ({ ...s, BotonesModal: true }))
        let PiezasAu: any[] = []
        state.Form.Datos.DetalleAprobacion.forEach(element => {
            let a = {
                AprobadoDetalleID: element.AprobadoDetalleID,
                PiezasSolicitadas: element.PiezasSolicitadas,
                PiezasAprobadas: element.PiezasAprobadas,
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
                    <h5 className="text-center">Verifica las Piezas. <br />
                        <strong>NOTA: Una vez confirmadas las piezas estas no podrán modificarse.
                        </strong></h5><br />
                    <div className="row">
                        <div className="col-md-12">
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered table-sm">
                                    <thead>
                                        <tr>
                                            <th className='text-center'>Detalle</th>
                                            <th className='text-center'>Piezas Solicitadas</th>
                                            <th className='text-center'>Piezas Aprobadas</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {PiezasAu.map((item: any) => {
                                            return (
                                                <tr key={item.AprobadoDetalleID}>
                                                    <td className='text-center'>{item.AprobadoDetalleID}</td>
                                                    <td className='text-center'>{item.PiezasSolicitadas} </td>
                                                    <td className='text-center'>{item.PiezasAprobadas}</td>
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
                                <h5 className="text-center">Espera mientras se realiza la aprobacion. <br /> </h5>
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
                let or = {
                    DetalleAprobacion: item,
                    AprobadoID: number,
                }
                Funciones.FNGuardarPiezasAprobadas(props.oidc, or)
                    .then((respuesta: any) => {
                        setState(s => ({ ...s, Mostrar: false, BotonesModal: false }))
                        setState(s => ({ ...s, Datos: respuesta }))
                        cbAgregarlocal(respuesta)
                        MySwal.close()
                    })
                    .catch((res: any) => {
                        FNGetLocal()
                        toast.error("Ocurrio un problema mientras se guardaba, favor de reintentar.")
                        setState(s => ({
                            ...s, Datos: [], BotonesModal: false,
                            Form: {
                                ...s.Form,
                                Mostrar: false,
                            }
                        }))
                        FNGetLocal()
                        MySwal.close()
                    })
            } else {
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

    const cbAgregarlocal = (item: any) => {
        toast.success('Se aprobo correctamente')
        setState(state => ({
            ...state, Datos: [item],
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    AprobadoID: 0
                    , SolicitudID: 0
                    , SolicitanteID: 0
                    , NombreSolicita: ''
                    , ApruebaID: 0
                    , NombreAprueba: ''
                    , FechaSolicitud: ''
                    , FechaAprobado: ''
                    , EstatusID: 0
                    , EstatusDes: ''
                    , Descripcion: ''
                    , ProductoID: 0
                    , DetalleAprobacion: []
                }
            }
        }));
        FNGetLocal();
    }

    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Aprobación">
                    <Card.Body>
                        <Card.Body.Content>
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
                                        keyField={"AprobadoID"}
                                        defaultSortField={"AprobadoID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar} center={true} xlarge>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Aprobar Piezas</h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                fnCancelar={fnCancelar}
                                                cambiarPiezas={cambiarPiezas2}
                                                cbGuardar={cbAgregar}
                                            />}
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

export default connect(mapStateToProps, mapDispatchToProps)(CatalogoAprobacionSolicitudUniforme);