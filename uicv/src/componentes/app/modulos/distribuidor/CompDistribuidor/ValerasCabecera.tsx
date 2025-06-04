import React, { Component } from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import * as Funciones from './ValerasCabecera/Funciones'
import * as FnProductos from './Vales/Funciones'
import * as FnSeries from '../../distribuidor/CompDistribuidor/CatalogoValeraSeries/Funciones'
import * as FnFraccion from '../../distribuidor/CompDistribuidor/CatalogoValeraFraccion/Funciones'
import * as FnTracking from '../../distribuidor/CompDistribuidor/CatalogoValeraTrackingEstatus/Funciones'

// Icons
import { FaPlus, FaFilter, FaCalendarCheck, FaBox, FaBan, FaEye, FaExclamationCircle, FaDownload } from 'react-icons/fa'

// Custom components
import { Card, Spinner, ActionSelect } from '../../../../global'
import { CForm } from './ValerasCabecera/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import ReactTooltip from 'react-tooltip';
import { Formik, Form } from 'formik'

type CatalogosType = {
    oidc: IOidc
}

const ValerasCabecera = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { ProductoID: 0, serieId: 0, FolioInicial: 0, FolioFinal: 0, Estatus: 'A', RegistroFecha: new Date, RegistroUsuarioId: props.oidc.user.profile.name, RegistroPersonaID: 0, ValerasFraccionID: 0 }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const conditionalRowStyles: any[] = []
    const optProductos: any[] = []
    const optSeries: any[] = []
    const optFracciones: any[] = []
    const optSeriesFiltro: any[] = []
    const optRastreos: any[] = []
    const tituloModal: string = ''
    const FiltroProductos: number = 0
    const FiltroSeries: number = 0
    const Filtrotracking: number = 0
    const FiltroFolioI: number = 0
    const FiltroFolioF: number = 0
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        conditionalRowStyles,
        optProductos,
        optSeries,
        optFracciones,
        optSeriesFiltro,
        optRastreos,
        tituloModal: 'Agregar Lote de Valera',
        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined,
            evento: ''
        },
        FiltroProductos,
        FiltroSeries,
        Filtrotracking,
        FiltroFolioI,
        FiltroFolioF,
        showSerieFitro: true,
        Filtrando: false,
    })

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

    const FnGetProductos = () => {
        setState(s => ({ ...s }))
        FnProductos.FNGet(props.oidc)
            .then((respuesta: any) => {
                console.log("PRODUCTOSYEMPRESA: ", respuesta)
                var productosActivos = respuesta.filter((d: any) => { return d.Canje })
                var productos = productosActivos.map((valor: any) => {
                    var obj = { value: valor.ProductoID, label: valor.Producto + ", Empresa: " + valor.EmpresaNombre };
                    return obj
                });

                setState(s => ({ ...s, optProductos: productos }))
            })
            .catch(() => {
                setState(s => ({ ...s, optProductos: [] }))
            })
    }

    const FnGetSeries = (ProductoID: number, ValerasFraccionID: number, isUpdate: boolean) => {
        //console.log('FnGetSeries Access')
        setState(s => ({ ...s }))
        FnSeries.FNGetByProduct(props.oidc, ProductoID)
            .then((respuesta: any) => {
                var seriesActivos = respuesta.filter((d: any) => { return d.activo && d.tipo.ValeraSeriesTiposID === 1 })
                var series = seriesActivos.map((valor: any) => {
                    var obj = { value: valor.serieId, label: `${valor.serie}` };
                    return obj
                });

                setState(s => ({
                    ...s, Form: {
                        ...s.Form,
                        Datos: {
                            ...s.Form.Datos,
                            serieId: isUpdate === false ? 0 : state.Form.Datos.serieId,
                            ProductoID: ProductoID,
                            FolioInicial: isUpdate === false ? 0 : state.Form.Datos.FolioInicial,
                            FolioFinal: isUpdate === false ? 0 : state.Form.Datos.FolioFinal,
                            ValerasFraccionID: isUpdate === false ? 0 : ValerasFraccionID
                        }
                    }, optSeries: series
                }))

            })
            .catch(() => {
                setState(s => ({ ...s, Form: { ...s.Form }, optSeries: [] }))
            })
    }

    const FnGetTracking = () => {
        setState(s => ({ ...s }))
        FnTracking.FNGet(props.oidc)
            .then((respuesta: any) => {
                var rastreosActivos = respuesta.filter((d: any) => { return [1, 2, 3, 9, 10].includes(d.ValeraTrackingEstatusID) })
                var rastreos = rastreosActivos.map((valor: any) => {
                    var obj = { value: valor.ValeraTrackingEstatusID, label: valor.TrackingEstatus, color: valor.Color, descripcion: valor.Descripcion };
                    return obj
                });

                setState(s => ({ ...s, optRastreos: rastreos }))
            })
            .catch(() => {
                setState(s => ({ ...s, optRastreos: [] }))
            })
    }

    const FNGetFolioSiguiente = (serieId: number, ProductId: number, FolioFinal: number, ValerasFraccionID: number) => {
        //console.log({  serie: serieId })
        setState(s => ({ ...s }))
        Funciones.FNGetFolioSiguiente(props.oidc, { serieId: serieId })
            .then((respuesta: any) => {
                //console.log('res', respuesta)
                setState(s => ({
                    ...s,
                    Form: {
                        ...s.Form,
                        Datos: {
                            ...s.Form.Datos,
                            serieId: serieId,
                            ProductoID: ProductId,
                            FolioInicial: respuesta.folioSiguiente,
                            FolioFinal: FolioFinal,
                            ValerasFraccionID: ValerasFraccionID
                        }
                    }
                }))
            })
            .catch(() => {
                setState(s => ({ ...s }))
            })
    }

    const FnGetFraccion = () => {
        setState(s => ({ ...s }))
        FnFraccion.FNGet(props.oidc)
            .then((respuesta: any) => {
                var fraccion = respuesta.map((valor: any) => {
                    var obj = { value: valor.ValerasFraccionID, label: valor.Fraccion };
                    return obj
                });

                setState(s => ({ ...s, optFracciones: fraccion }))
            })
            .catch(() => {
                setState(s => ({ ...s, optFracciones: [] }))
            })
    }

    const FnGetProductosFiltro = (ProductoID: number) => {
        setState(s => ({ ...s, showSerieFitro: false }))
        if (ProductoID === 0) {
            setState(s => ({ ...s, optSeriesFiltro: [], FiltroProductos: 0, FiltroSeries: 0, showSerieFitro: true }))
        } else {
            FnSeries.FNGetByProduct(props.oidc, ProductoID)
                .then(async (respuesta: any) => {
                    var seriesActivos = respuesta.filter((d: any) => { return d.tipo.ValeraSeriesTiposID === 1 })
                    var series = seriesActivos.map((valor: any) => {
                        var obj = { value: valor.serieId, label: `${valor.serie} (${valor.serieDesc})` };
                        return obj
                    });
                    setState(s => ({ ...s, optSeriesFiltro: series, FiltroProductos: ProductoID, FiltroSeries: 0, showSerieFitro: true }))
                })
                .catch(() => {
                    setState(s => ({ ...s, Form: { ...s.Form }, optSeriesFiltro: [], FiltroProductos: 0, FiltroSeries: 0, showSerieFitro: true }))
                })
        }
    }

    const FnGetSeriesFiltro = (serieID: number) => {
        setState(s => ({ ...s, FiltroSeries: serieID }))
    }

    const FnGetRastreoFiltro = (rastreoId: number) => {
        setState(s => ({ ...s, Filtrotracking: rastreoId }))
    }

    const FnGetFolioIFiltro = (Folio: string) => {
        let folio = Folio ? parseInt(Folio) : 0
        setState(s => ({ ...s, FiltroFolioI: folio }))
    }

    const FnGetFolioFFiltro = (Folio: string) => {
        let folio = Folio ? parseInt(Folio) : 0
        setState(s => ({ ...s, FiltroFolioF: folio }))
    }

    const FnFiltrando = () => {
        let numFiltro = (state.FiltroProductos + state.FiltroSeries + state.Filtrotracking +
            state.FiltroFolioI + state.FiltroFolioF)
        let datosFiltro = state.Datos
        if (numFiltro > 0)
            setState(s => ({ ...s, Filtrando: true }))
        else
            setState(s => ({ ...s, Filtrando: false }))
        if (state.FiltroProductos > 0)
            datosFiltro = datosFiltro.filter(d => { return d.Producto.ProductoID === state.FiltroProductos })
        if (state.FiltroSeries > 0)
            datosFiltro = datosFiltro.filter(d => { return d.Serie.serieId === state.FiltroSeries })
        if (state.FiltroFolioI > 0)
            datosFiltro = datosFiltro.filter(d => { return d.FolioInicial >= state.FiltroFolioI })
        if (state.FiltroFolioF > 0)
            datosFiltro = datosFiltro.filter(d => { return d.FolioFinal <= state.FiltroFolioF })
        if (state.Filtrotracking > 0)
            datosFiltro = datosFiltro.filter(d => { return d.Tracking.ValeraTrackingEstatusID === state.Filtrotracking })

        setState(s => ({ ...s, DatosMostrar: datosFiltro }))
    }

    // Define the columns
    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: '',
                    selector: 'Tracking.TrackingEstatusID',
                    sortable: true,
                    width: '1%',
                    cell: (props) =>
                        <div>
                            {/*props.Tracking.Color*/}
                            <FaBox size={25} color={`${props.Tracking.Color}`} />

                        </div>
                },
                {
                    name: 'Id',
                    selector: 'ValeraCabeceraID',
                    sortable: true,
                    width: '5%',
                    cell: (props) =>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <span>
                                {props.ValeraCabeceraID}
                            </span>
                        </div>
                },
                {
                    name: 'Producto',
                    selector: 'Producto.Producto',
                    sortable: true,
                    width: '15%',
                    cell: (props) =>
                        <div>
                            <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {props.Producto.Producto}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Serie: {props.Serie.serie}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                },
                {
                    name: 'Folio Inicial',
                    selector: 'FolioInicial',
                    width: '10%',
                    sortable: true,
                    cell: (props) =>
                        <div>
                            <span className="badge bg-info" style={{ fontSize: '1.2em', width: '6em' }}>
                                {props.FolioInicial}
                            </span>
                        </div>
                },
                {
                    name: 'Folio Final',
                    selector: 'FolioFinal',
                    width: '10%',
                    sortable: true,
                    cell: (props) =>
                        <div>
                            <span className="badge bg-info" style={{ fontSize: '1.2em', width: '6em' }}>
                                {props.FolioFinal}
                            </span>
                        </div>
                },
                {
                    name: 'Valeras Totales',
                    selector: `Fraccion.Fraccion`,
                    width: '8%',
                    sortable: true,
                    cell: (props) =>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <span className="badge bg-secondary" style={{ fontSize: '1.3em', width: '4em' }}>
                                {(props.FolioFinal - (props.FolioInicial - 1)) / props.Fraccion.Fraccion}
                            </span>
                        </div>
                },
                {
                    name: 'Vales x Valera',
                    selector: 'Fraccion.Fraccion',
                    width: '8%',
                    sortable: true,
                    cell: (props) =>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <span className="badge bg-secondary" style={{ fontSize: '1.2em', width: '3em' }}>
                                {props.Fraccion.Fraccion}
                            </span>
                        </div>

                },
                {
                    name: 'Fecha de Registro',
                    selector: 'RegistroFecha',
                    width: '9%',
                    sortable: true,

                },
                {
                    name: 'Estatus',
                    selector: 'Estatus',
                    width: '5%',
                    sortable: true,
                    cell: (props) =>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <span style={{ fontSize: '1em' }} className={props.Estatus === 'X' ? 'badge bg-danger' : props.Estatus === 'C' ? 'badge bg-success' : 'badge bg-primary'}>
                                {props.Estatus}
                            </span>
                        </div>
                },
                {
                    name: 'Rastreo',
                    selector: `Tracking.TrackingEstatus`,
                    sortable: true,
                    width: '12%',
                    cell: (props) =>
                        <div data-tip data-for={`estatus_${props.ValeraCabeceraID}`}>
                            <label style={{ color: props.Tracking.Color, marginBottom: '0px' }}>
                                {props.Tracking.TrackingEstatus}
                            </label>
                            <ReactTooltip id={`estatus_${props.ValeraCabeceraID}`} type="info" effect="solid">
                                {props.Tracking.Descripcion}
                            </ReactTooltip>
                        </div>
                },
                {
                    name: 'Acciones',
                    sortable: false,
                    width: '15%',
                    style: { display: 'block;' },
                    cell: (props) =>
                        <>
                            <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                {true && <><button data-tip data-for={`btnVer_${props.ValeraCabeceraID}`} style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"} onClick={() => {
                                    setState(s => ({
                                        ...s,
                                        Form: {
                                            ...state.Form, Mostrar: true,
                                            Datos: getDatos(props),
                                            Id: props.ValeraCabeceraID,
                                            evento: 'Ver Valera',
                                        },
                                        tituloModal: 'Ver Valera',
                                        statusCircle: props.Tracking.Color
                                    }))
                                }}>
                                    <FaEye />
                                </button>
                                    <ReactTooltip id={`btnVer_${props.ValeraCabeceraID}`} type="info" effect="solid">
                                        VER LOTE DE VALERAS
                                    </ReactTooltip></>}

                                {props.Tracking.ValeraTrackingEstatusID !== 1 && <button style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"}></button>}
                                {props.Tracking.ValeraTrackingEstatusID === 1 && <><button data-tip data-for={`btnPed_${props.ValeraCabeceraID}`} style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"} onClick={() => {
                                    setState(s => ({
                                        ...s,
                                        Form: {
                                            ...state.Form, Mostrar: true,
                                            Datos: getDatos(props),
                                            Id: props.ValeraCabeceraID,
                                            evento: 'Pedir Valera',
                                        },
                                        tituloModal: 'Cofirmar Pedido del Lote de Valeras',
                                        statusCircle: props.Tracking.Color
                                    }))
                                }}>
                                    <FaCalendarCheck />
                                </button>
                                    <ReactTooltip id={`btnPed_${props.ValeraCabeceraID}`} type="info" effect="solid">
                                        CONFIRMAR PEDIDO DEL LOTE DE VALERAS CON EL PROVEEDOR
                                    </ReactTooltip></>}
                                {props.Tracking.ValeraTrackingEstatusID !== 2 && <button style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"}></button>}
                                {props.Tracking.ValeraTrackingEstatusID === 2 && <><button data-tip data-for={`btnDis_${props.ValeraCabeceraID}`} style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"} onClick={() => {
                                    setState(s => ({
                                        ...s,
                                        Form: {
                                            ...state.Form, Mostrar: true,
                                            Datos: getDatos(props),
                                            Id: props.ValeraCabeceraID,
                                            evento: 'Surtir Valera',
                                        },
                                        tituloModal: 'Confirmar Entrega y Disponibilidad del Lote de Valeras',
                                        statusCircle: props.Tracking.Color
                                    }))
                                }}>
                                    <FaBox />
                                </button>
                                    <ReactTooltip id={`btnDis_${props.ValeraCabeceraID}`} type="info" effect="solid">
                                        CONFIRMAR ENTREGA DEL LOTE DE VALERAS POR PARTE DEL PROVEEDOR
                                    </ReactTooltip></>}
                                {props.Tracking.ValeraTrackingEstatusID === 10 && <button style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"}></button>}
                                {props.Tracking.ValeraTrackingEstatusID !== 10 && <><button data-tip data-for={`btnCan_${props.ValeraCabeceraID}`} style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"} onClick={() => {
                                    setState(s => ({
                                        ...s,
                                        Form: {
                                            ...state.Form, Mostrar: true,
                                            Datos: getDatos(props),
                                            Id: props.ValeraCabeceraID,
                                            evento: 'Cancelar Valera',
                                        },
                                        tituloModal: 'Confirmar Cancelacion del Lote entero de Valera',
                                        statusCircle: props.Tracking.Color
                                    }))
                                }}>
                                    <FaBan />
                                </button>
                                    <ReactTooltip id={`btnCan_${props.ValeraCabeceraID}`} type="info" effect="solid">
                                        CANCELAR LOTE DE VALERAS
                                    </ReactTooltip></>}

                                {true && <><button data-tip data-for={`btnPDF_${props.ValeraCabeceraID}`} style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"} onClick={() => {
                                    setState(s => ({
                                        ...s,
                                        Form: {
                                            ...state.Form, Mostrar: true,
                                            Datos: getDatos(props),
                                            Id: props.ValeraCabeceraID,
                                            evento: 'Descargar PDF',
                                        },
                                        tituloModal: 'Descargar PDF Valera',
                                        statusCircle: props.Tracking.Color
                                    }))
                                }}>
                                    <FaDownload />
                                </button>
                                    <ReactTooltip id={`btnPDF_${props.ValeraCabeceraID}`} type="info" effect="solid">
                                        DESCARGAR LAYOUT DEL LOTE DE VALERAS
                                    </ReactTooltip></>}

                            </div>
                        </>
                },
            ]
        return colRet
    }, [state.Form])

    const getDatos = (props: any) => {
        //console.log("props", props)
        var from = props.RegistroFecha.split("/")
        var registrof = new Date(from[2], from[1] - 1, from[0])
        return {
            ProductoID: props.Producto.ProductoID,
            serieId: props.Serie.serieId,
            FolioInicial: props.FolioInicial,
            FolioFinal: props.FolioFinal,
            Estatus: props.Estatus,
            RegistroFecha: registrof,
            RegistroUsuarioId: props.RegistroUsuarioId,
            RegistroPersonaID: props.RegistroPersonaID,
            ValerasFraccionID: props.Fraccion.ValerasFraccionID,
        };
    }
    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        FnGetProductos()
        FnGetFraccion()
        FnGetTracking()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        FnFiltrando()
    }, [state.FiltroProductos, state.FiltroSeries, state.FiltroFolioI, state.FiltroFolioF, state.Filtrotracking])


    // On use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro), }))
        FnFiltrando()
        //setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro)}))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    React.useEffect(() => {
        FnGetSeries(state.Form.Datos.ProductoID, state.Form.Datos.ValerasFraccionID, true)
    }, [state.Form.Datos.ProductoID])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { ProductoID: 0, serieId: 0, FolioInicial: 0, FolioFinal: 0, Estatus: 'A', RegistroFecha: new Date, RegistroUsuarioId: '', RegistroPersonaID: 0, ValerasFraccionID: 0 } } })
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({
            ...state,
            Datos: state.Datos.map(Dato => Dato.ValeraCabeceraID === item.ValeraCabeceraID ? item : Dato),
            DatosMostrar: state.DatosMostrar.map(Dato => Dato.ValeraCabeceraID === item.ValeraCabeceraID ? item : Dato),
            Form: { ...state.Form, Mostrar: false, Datos: { ProductoID: 0, serieId: 0, FolioInicial: 0, FolioFinal: 0, Estatus: 'A', RegistroFecha: new Date, RegistroUsuarioId: '', RegistroPersonaID: 0, ValerasFraccionID: 0 } }
        })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { Mostrar: false, Datos: DatosDefecto, Id: undefined, evento: 'Crear Valera' }, tituloModal: 'Crear Valera' })


    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Administrar LOTES de valeras">
                    {console.log("Datos defecto: ", state.Datos)}
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        subHeader
                                        noDataComponent={<div style={{ margin: '4em' }}> {state.Filtrando ? <><FaExclamationCircle color={'grey'} size={20} />  NO HAY LOTES DE VALERAS QUE COINCIDAN CON LOS FILTROS SELECCIONADOS</> : ""}</div>}
                                        paginationComponentOptions={{ rowsPerPageText: 'Registros por pagina:', rangeSeparatorText: 'de', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'Todo' }}
                                        subHeaderComponent=
                                        {
                                            <div className="row" style={{ width: '102%' }}>
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3" style={{ justifyContent: 'space-between' }}>
                                                        <div></div>
                                                        <div>
                                                            <button className="btn btn-outline-secondary" type="button"
                                                                onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined, evento: 'Crear Valera' }, tituloModal: 'Registrar Lote de Valeras' })}
                                                            ><FaPlus /></button>
                                                            <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-sm-12">
                                                    <div style={{ backgroundColor: '#F7F7F7', padding: '1em', borderRadius: '15px' }}>
                                                        <div>
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
                                                                            <div style={{ height: '67px', width: '250px' }}>
                                                                                <ActionSelect
                                                                                    disabled={false}
                                                                                    label="Productos"
                                                                                    name="ProductoIDF"
                                                                                    placeholder=" -"
                                                                                    options={state.optProductos}
                                                                                    addDefault={true}
                                                                                    valor={state.FiltroProductos}
                                                                                    accion={FnGetProductosFiltro} />
                                                                            </div>
                                                                            <div style={{ height: '57px', width: '250px' }}>
                                                                                {!state.showSerieFitro && <div>
                                                                                    <label className="form-label mb-0">Cargando Series ...</label>
                                                                                    <Spinner />
                                                                                </div>}
                                                                                {state.showSerieFitro && <ActionSelect
                                                                                    disabled={state.optSeriesFiltro.length === 0}
                                                                                    label="Series"
                                                                                    name="serieIdF"
                                                                                    placeholder="TODAS LAS SERIES"
                                                                                    options={state.optSeriesFiltro}
                                                                                    addDefault={true}
                                                                                    valor={state.FiltroSeries}
                                                                                    accion={FnGetSeriesFiltro} />}
                                                                            </div>
                                                                            <div style={{ height: '67px', width: '250px' }}>
                                                                                {<div>
                                                                                    <ActionSelect
                                                                                        disabled={false}
                                                                                        label="Rastreo"
                                                                                        name="TrackingIDF"
                                                                                        placeholder="TODOS LOS ESTATUS"
                                                                                        options={state.optRastreos}
                                                                                        addDefault={true}
                                                                                        valor={state.Filtrotracking}
                                                                                        accion={FnGetRastreoFiltro} />
                                                                                </div>}
                                                                            </div>
                                                                            <div style={{ height: '67px', width: '150px' }}>
                                                                                {<div>
                                                                                    <label className="form-label mb-0">Folio Inicial</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        placeholder="Folio INICIAL"
                                                                                        value={state.FiltroFolioI}
                                                                                        onChange={e => FnGetFolioIFiltro(e.target.value)} />
                                                                                </div>}
                                                                            </div>
                                                                            <div style={{ height: '67px', width: '150px' }}>
                                                                                {<div>
                                                                                    <label className="form-label mb-0">Folio Final</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        placeholder="Folio FINAL"
                                                                                        value={state.FiltroFolioF}
                                                                                        onChange={e => FnGetFolioFFiltro(e.target.value)} />
                                                                                </div>}
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
                                        keyField={"ValeraCabeceraID"}
                                        defaultSortField={"ValeraCabeceraID"}
                                        defaultSortAsc={false}
                                        columns={Columns}
                                    //conditionalRowStyles={state.conditionalRowStyles}
                                    />
                                    <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>{state.tituloModal}</h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                optProductos={state.optProductos}
                                                optSeries={state.optSeries}
                                                optFracciones={state.optFracciones}
                                                evento={state.Form.evento}
                                                FnGetSeries={FnGetSeries}
                                                FNGetFolioSiguiente={FNGetFolioSiguiente}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
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
export default connect(mapStateToProps, mapDispatchToProps)(ValerasCabecera);