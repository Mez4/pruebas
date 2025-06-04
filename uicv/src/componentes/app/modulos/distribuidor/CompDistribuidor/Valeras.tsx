import React, { Component, useEffect, useState } from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import { iUI } from '../../../../../interfaces/ui/iUI'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import Vales from './Vales'
import * as Funciones from './Valeras/Funciones'
import * as FnProductos from './Vales/Funciones'
import * as FnSeries from '../../distribuidor/CompDistribuidor/CatalogoValeraSeries/Funciones'
import * as FnTracking from '../../distribuidor/CompDistribuidor/CatalogoValeraTrackingEstatus/Funciones'
import * as FnSucursales from '../../general/CompGeneral/Sucursal/Funciones'
import * as FnDistribuidores from '../../distribuidor/CompDistribuidor/Distribuidor/Funciones'

// Icons
import { FaRetweet, FaStore, FaShippingFast, FaTruckLoading, FaEye, FaBan, FaUpload, FaDownload, FaUserPlus, FaTicketAlt, FaFilter, FaExclamationCircle } from 'react-icons/fa'

// Custom components
import { Card, Spinner, ActionSelect, CustomFieldText } from '../../../../global'
import { CForm } from './Valeras/CForm'
import { CFormM } from './Valeras/CForm_M'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import ReactTooltip from 'react-tooltip';
import { Formik, Form } from 'formik'
import { toast } from 'react-toastify'

type CatalogosType = {
    oidc: IOidc,
    ui: iUI,
}

const Valeras = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { ProductoID: 0, DistribuidorID: 0, serieId: '', FolioInicial: 0, FolioFinal: 0, Estatus: 'A', RegistroFecha: new Date, RegistroUsuarioId: '', AsignaSucursalId: 0, AsignaSucursalUsuarioId: '', ReciboSucursalUsuarioId: '', AsignaDistribudiorUsuarioId: '', CanceladoUsuarioId: '', ValeraTrackingEstatusID: 0, EnvioSucursalNota: '', ReciboSucursalNota: '', doc: '', doc2: '', productoName: '', serieName: '', CodigoBarras: '0000' }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const conditionalRowStyles: any[] = []
    const optProductos: any[] = []
    const optSeries: any[] = []
    const optSucursales: any[] = []
    const optDistribuidores: any[] = []
    const tituloModal: string = ''
    const DatosAuxMostrar: any[] = []
    const FiltroProductos: number = 0
    const FiltroSeries: number = 0
    const FiltroSucursales: number = 0
    const FiltroDistribuidoras: number = 0
    const Filtrotracking: number = 0
    const FiltroCodigo: string = ''
    const FiltroFolioI: number = 0
    const FiltroFolioF: number = 0
    const tipoUsuario2: number = 0
    const ProductoIDtipoU: number = 0
    const SucursalIDtipoU: number = 0
    const optSeriesFiltro: any[] = []
    const optDistribuidoresFiltro: any[] = []
    const optRastreos: any[] = []
    const optCodigosB: any[] = []
    const ValerasX: number[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        conditionalRowStyles,
        optProductos,
        optSeries,
        optSucursales,
        optRastreos,
        optDistribuidores,
        tituloModal: 'Agregar Valera',
        statusCircle: 'red',
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
        ModalAux:
        {
            Mostrar: false,
            tituloModalM: 'Asignar Sucursales',
            evento: ''
        },
        DatosAuxMostrar,
        btnAsignar: false,
        btnReasignar: false,
        btnEnviar: false,
        btnRecibir: false,
        btnReenviar: false,
        ValerasX,
        FiltroProductos,
        FiltroSeries,
        FiltroSucursales,
        FiltroDistribuidoras,
        FiltroCodigo,
        FiltroFolioI,
        FiltroFolioF,
        Filtrotracking,
        FiltroTodo: false,
        optSeriesFiltro,
        optDistribuidoresFiltro,
        optCodigosB,
        showSerieFitro: true,
        showDistribuidorFitro: true,
        showRastreoFitro: true,
        Filtrando: false,
        ShowVales: false,
        ValeraID: 0,
        tipoUsuario2,
    })

    const permisoActSucursal = props.ui.PermisosProductos?.find(p => p.PermisoID == 442)
    const permisoRasigSucursal = props.ui.PermisosProductos?.find(p => p.PermisoID == 443)
    const permisoEnvio = props.ui.PermisosProductos?.find(p => p.PermisoID == 445)
    const permisoRecibido = props.ui.PermisosProductos?.find(p => p.PermisoID == 446)
    const permisoReenvio = props.ui.PermisosProductos?.find(p => p.PermisoID == 447)
    const [tipoUsuario, setTipoUsuario] = useState(0);
    const [sucursal, setSucursal] = useState(0);
    const [producto, setProducto] = useState(0);
    const [loading, setLoading] = useState(false);



    const FnGetProductos = () => {
        setState(s => ({ ...s }))
        FnProductos.FNGet(props.oidc)
            .then((respuesta: any) => {
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

    const FnGetSeries = (ProductoID: number) => {
        //console.log('FnGetSeries Access')
        setState(s => ({ ...s }))
        FnSeries.FNGetByProduct(props.oidc, ProductoID)
            .then((respuesta: any) => {
                var series = respuesta.map((valor: any) => {
                    var obj = { value: valor.serieId, label: `${valor.serie} (${valor.serieDesc})` };
                    return obj
                });

                setState(s => ({ ...s, optSeries: series }))

            })
            .catch(() => {
                setState(s => ({ ...s, Form: { ...s.Form }, optSeries: [] }))
            })
    }

    const FnGetTracking = () => {
        setState(s => ({ ...s }))
        FnTracking.FNGet(props.oidc)
            .then((respuesta: any) => {
                var rastreos = respuesta.map((valor: any) => {
                    var obj = { value: valor.ValeraTrackingEstatusID, label: valor.TrackingEstatus, color: valor.Color, descripcion: valor.Descripcion };
                    return obj
                });

                setState(s => ({ ...s, optRastreos: rastreos }))
            })
            .catch(() => {
                setState(s => ({ ...s, optRastreos: [] }))
            })
    }

    const FnGetSucursales = () => {
        setState(s => ({ ...s }))
        FnSucursales.FNGetAux(props.oidc)
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

    const fnGetDistribuidores = (SucursalID?: number) => {
        setState(s => ({ ...s }))
        if (SucursalID! > 0)
            FnDistribuidores.FNGetBySucursalProd(props.oidc, SucursalID)
                .then((respuesta: any) => {

                    var distribuidores = respuesta.map((valor: any) => {
                        var obj = { value: valor.DistribuidorID, label: `${valor.DistribuidorID} - ${valor.PersonaNombre}` };
                        return obj
                    });

                    setState(s => ({ ...s, optDistribuidores: distribuidores }))
                })
                .catch(() => {
                    setState(s => ({ ...s, optDistribuidores: [] }))
                })
    }

    const validarDistribuidor = (value: any) => {
        FnDistribuidores.FNGetDistribuidor(props.oidc, { Id: value.SucursalID })
            .then((respuesta: any) => {
                if (respuesta.DistribuidoresEstatusID == "T") {

                    toast.info(`La socia ${value.NombreSucursal} está cancelada temporalmente`)
                }
                else if (respuesta.DistribuidoresEstatusID == "F") {

                    toast.info(`La socia ${value.NombreSucursal} está en estatus Fallecida`)
                }
            })
            .catch(() => {
                toast.error("Ha ocurrido un error al obtener el distribuidor")
            })
    }


    const FnGetCodigos = (datos: any) => {
        var codigos = datos.map((valor: any) => {
            var obj = { value: valor.ValeraID, label: `${valor.CodigoBarras}` };
            return obj
        });
        setState(s => ({ ...s, optCodigosB: codigos }))
    }

    const FnGetSucursalFiltro = (SucursalID: number) => {
        setState(s => ({ ...s, showDistribuidorFitro: false }))
        if (SucursalID === 0) {
            setState(s => ({ ...s, optDistribuidoresFiltro: [], FiltroSucursales: 0, FiltroDistribuidoras: 0, showDistribuidorFitro: true }))
        } else {
            FnDistribuidores.FNGetBySucursalProd(props.oidc, SucursalID)
                .then((respuesta: any) => {

                    var distribuidores = respuesta.map((valor: any) => {
                        var obj = { value: valor.DistribuidorID, label: `${valor.DistribuidorID} - ${valor.PersonaNombre}` };
                        return obj
                    });
                    setState(s => ({ ...s, optDistribuidoresFiltro: distribuidores, FiltroSucursales: SucursalID, FiltroDistribuidoras: 0, showDistribuidorFitro: true }))
                })
                .catch(() => {
                    setState(s => ({ ...s, optDistribuidoresFiltro: [], FiltroSucursales: 0, FiltroDistribuidoras: 0, showDistribuidorFitro: true }))
                })
        }
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

    const GetRolUsuario = () => {
        setLoading(true);
         Funciones.FNGetTipoUsuario(props.oidc, { usuarioID: 0 })
             .then((respuesta: any) => {
                 setTipoUsuario(respuesta.tipoUsuario)
                 setProducto(respuesta.ProductoID)
                 setSucursal(respuesta.SucursalID)
                 switch (respuesta.tipoUsuario) {
                    case 6:
                        FnGetSucursalFiltro(respuesta.SucursalID)
                    break;
                    case 3:
                        FnGetSucursalFiltro(respuesta.SucursalID)
                    break;
              
                 }
                 
                 setLoading(false);
             })
             .catch((error) => console.log("error!", error))
             .finally(() => setLoading(false))
     } 

     const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                    if (state.Filtrando)
                        FnFiltrando()
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const FnGetDistribuidoresFiltro = (DistribuidoID: number) => {
        setState(s => ({ ...s, FiltroDistribuidoras: DistribuidoID }))
    }

    const FnGetSeriesFiltro = (serieID: number) => {
        setState(s => ({ ...s, FiltroSeries: serieID }))
    }

    const FnGetFolioIFiltro = (Folio: string) => {
        let folio = Folio ? parseInt(Folio) : 0
        setState(s => ({ ...s, FiltroFolioI: folio }))
    }

    const FnGetCodigoFiltro = (Codigo: string) => {
        console.log('Codigo', Codigo)
        setState(s => ({ ...s, FiltroCodigo: Codigo }))
    }

    const FnGetFolioFFiltro = (Folio: string) => {
        let folio = Folio ? parseInt(Folio) : 0
        setState(s => ({ ...s, FiltroFolioF: folio }))
    }

    const FnGetRastreoFiltro = (rastreoId: number) => {
        setState(s => ({ ...s, Filtrotracking: rastreoId }))
    }

    const FnGetTodoFiltro = (selc: boolean) => {
        setState(s => ({ ...s, FiltroTodo: selc }))
    }

    const FnFiltrando = () => {
        let numFiltro = (state.FiltroProductos + state.FiltroSeries + state.Filtrotracking + state.FiltroSucursales +
            state.FiltroDistribuidoras + (state.FiltroCodigo.length > 3 ? 1 : 0) + state.FiltroFolioI + state.FiltroFolioF + (state.FiltroTodo ? 1 : 0))
        let datosFiltro = numFiltro > 0 || state.FiltroTodo ? state.Datos : []

        if (numFiltro > 0)
            setState(s => ({ ...s, Filtrando: true }))
        else
            setState(s => ({ ...s, Filtrando: false }))
        if (state.FiltroProductos > 0)
            datosFiltro = datosFiltro.filter(d => { return d.producto.ProductoID === state.FiltroProductos })
        if (state.FiltroSeries > 0)
            datosFiltro = datosFiltro.filter(d => { return d.serie.serieId === state.FiltroSeries })
        if (state.FiltroSucursales > 0)
            datosFiltro = datosFiltro.filter(d => { return d.AsignaSucursal.SucursalID === state.FiltroSucursales })
        if (state.FiltroDistribuidoras > 0)
            datosFiltro = datosFiltro.filter(d => { return d.DistribuidorID === state.FiltroDistribuidoras })
        if (state.FiltroCodigo.length > 3)
            datosFiltro = datosFiltro.filter(d => { return d.CodigoBarras.match(state.FiltroCodigo) })
        if (state.FiltroFolioI > 0)
            datosFiltro = datosFiltro.filter(d => { return d.FolioInicial >= state.FiltroFolioI })
        if (state.FiltroFolioF > 0)
            datosFiltro = datosFiltro.filter(d => { return d.FolioFinal <= state.FiltroFolioF })
        if (state.Filtrotracking > 0)
            datosFiltro = datosFiltro.filter(d => { return d.valeraTrackingEstatus.ValeraTrackingEstatusID === state.Filtrotracking })

        setState(s => ({ ...s, DatosMostrar: datosFiltro }))
    }

    const selectValeras = (row: any) => {
        if (row.allSelected && row.selectedCount === 0)
            return null
        setState(s => ({
            ...s,
            ValerasX: row.selectedRows.map((valor: any) => {
                return valor.ValeraID;
            })
        }))
    }

    const selectValerasMultiple = (valeraId: any) => {
        let valerasAux = valeraId
        setState(s => ({
            ...s,
            ValerasX: valerasAux,
            DatosAuxMostrar: state.DatosAuxMostrar
        }))
    }

    const ProductoFiltroM = (ProductId: number, Tracking: number) => {
        let datosFiltrados = state.Datos.filter(d => { return d.producto.ProductoID === ProductId && d.valeraTrackingEstatus.ValeraTrackingEstatusID === Tracking })
        setState(s => ({ ...s, DatosAuxMostrar: datosFiltrados }))
    }

    const SerieFiltroM = (serieId: number, Tracking: number) => {
        let datosFiltrados = state.Datos.filter(d => { return d.serie.serieId === serieId && d.valeraTrackingEstatus.ValeraTrackingEstatusID === Tracking })
        setState(s => ({ ...s, DatosAuxMostrar: datosFiltrados }))
    }

    const filtrandoM = (ProductId: number, serieId: number, SucursalId: number,
        FolioI: number, FolioF: number, CodigoB: string, Tracking: number[], selc: boolean) => {
        console.log(`${ProductId}-${serieId}-${SucursalId}-${FolioI}-${FolioF}-${CodigoB}-${Tracking}-${selc}`)
        let datosFiltro = state.Datos.filter(d => { return Tracking.includes(d.valeraTrackingEstatus.ValeraTrackingEstatusID) })
        if (ProductId > 0)
            datosFiltro = datosFiltro.filter(d => { return d.producto.ProductoID === ProductId })
        if (serieId > 0)
            datosFiltro = datosFiltro.filter(d => { return d.serie.serieId === serieId })
        if (SucursalId > 0)
            datosFiltro = datosFiltro.filter(d => { return d.AsignaSucursal.SucursalID === SucursalId })
        if (FolioI > 0)
            datosFiltro = datosFiltro.filter(d => { return d.FolioInicial >= FolioI })
        if (FolioF > 0)
            datosFiltro = datosFiltro.filter(d => { return d.FolioFinal <= FolioF })
        if (CodigoB.length > 0)
            datosFiltro = datosFiltro.filter(d => { return d.CodigoBarras.match(CodigoB) })
        if (selc)
            datosFiltro = datosFiltro.filter(d => { return state.ValerasX.includes(d.ValeraID) })
        setState(s => ({ ...s, DatosAuxMostrar: datosFiltro }))
    }

    // Define the columns
    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [

                {
                    name: '',
                    selector: 'valeraTrackingEstatus.TrackingEstatusID',
                    sortable: true,
                    width: '1%',
                    cell: (props) =>
                        <div>
                            <div style={{ width: '15px', height: '15px', borderRadius: '50%', backgroundColor: props.valeraTrackingEstatus.Color }}></div>
                        </div>
                },
                {
                    name: 'Id',
                    selector: 'ValeraID',
                    sortable: true,
                    width: '5%',
                    cell: (props) =>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <span>
                                {props.ValeraID}
                            </span>
                        </div>
                },
                {
                    name: 'Susursal Asignada',
                    selector: `AsignaSucursal.Nombre`,
                    sortable: true,
                    width: '11%',
                    cell: (props) =>
                        <>
                            {props.AsignaSucursal.SucursalID > 0 && <div className="LabelInDTable" style={{ fontWeight: 'bold' }}>
                                {`${props.AsignaSucursal.Nombre}`}
                            </div>}
                            {props.AsignaSucursal.SucursalID <= 0 && <div style={{ width: '100%', textAlign: 'center' }}>
                                -
                            </div>}
                        </>
                },
                {
                    name: 'Producto/Serie',
                    selector: 'producto.Producto',
                    sortable: true,
                    width: '12%',
                    cell: (props) =>
                        <div>
                            <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {props.producto.Producto}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Serie: {props.serie.serie}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                },
                {
                    name: 'Folio Inicial',
                    selector: 'FolioInicial',
                    sortable: true,
                    width: '10%',
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
                    sortable: true,
                    width: '10%',
                    cell: (props) =>
                        <div>
                            <span className="badge bg-info" style={{ fontSize: '1.2em', width: '6em' }}>
                                {props.FolioFinal}
                            </span>
                        </div>
                },
                {
                    name: 'Fecha de Registro',
                    selector: 'RegistroFecha',
                    sortable: true,
                    width: '9%',

                },
                {
                    name: 'Estatus',
                    selector: 'Estatus',
                    sortable: true,
                    width: '5%',
                    cell: (props) =>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <span style={{ fontSize: '1em' }} className={props.Estatus === 'X' ? 'badge bg-danger' : props.Estatus === 'C' ? 'badge bg-success' : 'badge bg-primary'}>
                                {props.Estatus}
                            </span>
                        </div>
                },
                {
                    name: 'Rastreo',
                    selector: `valeraTrackingEstatus.TrackingEstatus`,
                    sortable: true,
                    width: '12%',
                    cell: (props) => {
                        let diasEnvio = props.valeraTrackingEstatus.ValeraTrackingEstatusID !== 5 ? 0 :
                            ((new Date().getTime() - new Date(props.EnvioSucursalFecha).getTime()) / (1000 * 3600 * 24))
                        let mensaje = diasEnvio >= 2 ? ` (HACE ${diasEnvio.toFixed(0)} DÍAS)` : (diasEnvio >= 1 && diasEnvio < 2) ? ` (HACE ${diasEnvio.toFixed(0)} DÍA)` : " (HOY)"
                        return <div className="LabelInDTable" data-tip data-for={`estatus_${props.ValeraID}`}>
                            <label style={{ color: props.valeraTrackingEstatus.Color, marginBottom: '0px' }}>
                                {props.valeraTrackingEstatus.TrackingEstatus}
                                {props.valeraTrackingEstatus.ValeraTrackingEstatusID === 5 ? mensaje : ""}
                                {diasEnvio > props.AsignaSucursal.DiasDeEntregaAprox ? <> <FaExclamationCircle /></> : ""}
                            </label>
                            <ReactTooltip id={`estatus_${props.ValeraID}`} type="info" effect="solid">
                                {props.valeraTrackingEstatus.Descripcion}
                            </ReactTooltip>
                        </div>
                    }
                },
                {
                    name: 'Acciones',
                    sortable: false,
                    width: '23%',
                    style: { display: 'block;' },
                    cell: (props) =>
                        <div style={{ overflowX: 'hidden', whiteSpace: 'nowrap' }}>
                            {true && <><button data-tip data-for={`btnVer_${props.ValeraID}`} style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"} onClick={() => {
                                setState(s => ({
                                    ...s,
                                    Form: {
                                        ...state.Form, Mostrar: true,
                                        Datos: getDatos(props),
                                        Id: props.ValeraID,
                                        evento: 'Ver Valera',
                                    },
                                    tituloModal: 'Ver Valera',
                                    statusCircle: props.valeraTrackingEstatus.Color
                                }))
                            }}>
                                <FaEye />
                            </button>
                                <ReactTooltip id={`btnVer_${props.ValeraID}`} type="info" effect="solid">
                                    VER VALERA
                                </ReactTooltip></>}
                            {[6, 7].includes(props.valeraTrackingEstatus.ValeraTrackingEstatusID) && <><button data-tip data-for={`btnAD_${props.ValeraID}`} style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"} onClick={() => {
                                setState(s => ({
                                    ...s,
                                    Form: {
                                        ...state.Form, Mostrar: true,
                                        Datos: getDatos(props),
                                        Id: props.ValeraID,
                                        evento: 'Asignar Socia',
                                    },
                                    tituloModal: props.valeraTrackingEstatus.ValeraTrackingEstatusID === 6 ? 'Asignar Socia' : 'ReAsignar Socia',
                                    statusCircle: props.valeraTrackingEstatus.Color
                                }))
                            }}>
                                <FaUserPlus />
                            </button>
                                <ReactTooltip id={`btnAD_${props.ValeraID}`} type="info" effect="solid">
                                    {props.valeraTrackingEstatus.ValeraTrackingEstatusID === 7 ? 'RE' : ''}ASIGNAR BLOQUE DE VALERA A SOCIA
                                </ReactTooltip></>}
                            {![6, 7].includes(props.valeraTrackingEstatus.ValeraTrackingEstatusID) && <button style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"}></button>}
                            {(props.valeraTrackingEstatus.ValeraTrackingEstatusID === 7) && <><button data-tip data-for={`btnSD_${props.ValeraID}`} style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"} onClick={() => {
                                setState(s => ({
                                    ...s, 
                                    Form: {
                                        ...state.Form, Mostrar: true,
                                        Datos: getDatos(props),
                                        Id: props.ValeraID,
                                        evento: 'Subir Expediente',
                                    },
                                    tituloModal: 'Subir Expediente de Recibo de Valera',
                                    statusCircle: props.valeraTrackingEstatus.Color
                                }))
                            }}>
                                <FaUpload />
                            </button>
                                <ReactTooltip id={`btnSD_${props.ValeraID}`} type="info" effect="solid">
                                    SUBIR EL DOCUMENTO DE RECIBO DE VALERA FIRMADO POR LA DV
                                </ReactTooltip></>}
                            {props.valeraTrackingEstatus.ValeraTrackingEstatusID !== 7 && <button style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"}></button>}
                            {(props.valeraTrackingEstatus.ValeraTrackingEstatusID === 7) && <><button data-tip data-for={`btnVD_${props.ValeraID}`} style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"} onClick={() => {
                                setState(s => ({
                                    ...s,
                                    Form: {
                                        ...state.Form, Mostrar: true,
                                        Datos: getDatos(props),
                                        Id: props.ValeraID,
                                        evento: 'Descargar Documento',
                                    },
                                    tituloModal: 'Descargar Documento',
                                    statusCircle: props.valeraTrackingEstatus.Color
                                }))
                            }}>
                                <FaDownload />
                            </button>
                                <ReactTooltip id={`btnVD_${props.ValeraID}`} type="info" effect="solid">
                                    VER Y/O DESCARGAR EL DOCUMENTO DE RECIBO DE VALERA PARA SER FIRMADO POR LA DV
                                </ReactTooltip></>}
                            {props.valeraTrackingEstatus.ValeraTrackingEstatusID !== 7 && <button style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"}></button>}
                            {([8, 10].includes(props.valeraTrackingEstatus.ValeraTrackingEstatusID)) && <><button data-tip data-for={`btnVV_${props.ValeraID}`} style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"} onClick={() => {
                                setState(s => ({
                                    ...s,
                                    ShowVales: true,
                                    ValeraID: props.ValeraID
                                    , Form: { ...state.Form }
                                }))
                            }}>
                                <FaTicketAlt />
                            </button>
                                <ReactTooltip id={`btnVV_${props.ValeraID}`} type="info" effect="solid">
                                    VER VALES
                                </ReactTooltip></>}
                            {props.valeraTrackingEstatus.ValeraTrackingEstatusID !== 8 && <button style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"}></button>}
                            {(props.valeraTrackingEstatus.ValeraTrackingEstatusID != 10 && props.valeraTrackingEstatus.ValeraTrackingEstatusID > 2) && <><button data-tip data-for={`btnCV_${props.ValeraID}`} style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"} onClick={() => {
                                setState(s => ({
                                    ...s,
                                    Form: {
                                        ...state.Form, Mostrar: true,
                                        Datos: getDatos(props),
                                        Id: props.ValeraID,
                                        evento: 'Cancelar Valera',
                                    },
                                    tituloModal: 'Confirmar Cancelar Valera',
                                    statusCircle: props.valeraTrackingEstatus.Color
                                }))
                            }}>
                                <FaBan />
                            </button>
                                <ReactTooltip id={`btnCV_${props.ValeraID}`} type="info" effect="solid">
                                    CANCELAR BLOQUE DE VALERA
                                </ReactTooltip></>}
                        </div>
                },
            ]
        return colRet
    }, [state.Form])

    const ColumnsM = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: '', selector: 'valeraTrackingEstatus.TrackingEstatusID', sortable: true, width: '2%',
                    cell: (props) =>
                        <div>
                            <div style={{ width: '15px', height: '15px', borderRadius: '50%', backgroundColor: props.valeraTrackingEstatus.Color }}></div>
                        </div>
                },
                {
                    name: 'Id', selector: 'ValeraID', sortable: true, width: '7%', cell: (props) =>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <span>
                                {props.ValeraID}
                            </span>
                        </div>
                },
                {
                    name: 'Sucursal Asignada',
                    selector: `AsignaSucursal.SucursalID`,
                    sortable: true,
                    width: '13%',
                    cell: (props) =>
                        <>
                            {props.AsignaSucursal.SucursalID > 0 && <div style={{ fontWeight: 'bold' }}>
                                {`${props.AsignaSucursal.Nombre}`}
                            </div>}
                            {props.AsignaSucursal.SucursalID <= 0 && <div style={{ width: '100%', textAlign: 'center' }}>
                                -
                            </div>}
                        </>
                },
                {
                    name: 'Código', selector: 'CodigoBarras', sortable: true, width: '12%',
                },
                {
                    name: 'Producto/Serie', selector: 'producto.Producto', sortable: true, width: '15%', cell: (props) =>
                        <div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>{props.producto.Producto}</td>
                                    </tr>
                                    <tr>
                                        <td>Serie: {props.serie.serie}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                },
                {
                    name: 'Folio Inicial', selector: 'FolioInicial', sortable: true, width: '12%',
                    cell: (props) =>
                        <div>
                            <span className="badge bg-info" style={{ fontSize: '1.2em', width: '6em' }}>
                                {props.FolioInicial}
                            </span>
                        </div>
                },
                {
                    name: 'Folio Final', selector: 'FolioFinal', sortable: true, width: '12%',
                    cell: (props) =>
                        <div>
                            <span className="badge bg-info" style={{ fontSize: '1.2em', width: '6em' }}>
                                {props.FolioFinal}
                            </span>
                        </div>
                },
                {
                    name: 'Rastreo',
                    selector: `valeraTrackingEstatus.TrackingEstatus`,
                    sortable: true,
                    width: '20%',
                    cell: (props) =>
                        <div data-tip data-for={`estatus_${props.ValeraID}`}>
                            <label style={{ color: props.valeraTrackingEstatus.Color, marginBottom: '0px' }}>
                                {props.valeraTrackingEstatus.TrackingEstatus}
                            </label>
                            <ReactTooltip id={`estatus_${props.ValeraID}`} type="info" effect="solid">
                                {props.valeraTrackingEstatus.Descripcion}
                            </ReactTooltip>
                        </div>
                },
            ]
        return colRet
    }, [state.Form])

    const getDatos = (props: any) => {
        var from = props.RegistroFecha.split("/")
        var registrof = new Date(from[2], from[1] - 1, from[0])
        return {
            ProductoID: props.producto.ProductoID,
            DistribuidorID: props.DistribuidorID === null ? 0 : props.DistribuidorID,
            serieId: props.serie.serieId,
            FolioInicial: props.FolioInicial,
            FolioFinal: props.FolioFinal,
            Estatus: props.Estatus,
            RegistroFecha: registrof,
            RegistroUsuarioId: props.RegistroUsuarioId,
            AsignaSucursalId: props.AsignaSucursal.SucursalID === null ? '' : props.AsignaSucursal.SucursalID,
            AsignaSucursalUsuarioId: props.AsignaSucursalUsuarioId === null ? '' : props.AsignaSucursalUsuarioId,
            ReciboSucursalUsuarioId: props.ReciboSucursalUsuarioId,
            AsignaDistribudiorUsuarioId: props.AsignaDistribudiorUsuarioId === null ? '' : props.AsignaDistribudiorUsuarioId,
            CanceladoUsuarioId: props.CanceladoUsuarioId,
            ValeraTrackingEstatusID: props.valeraTrackingEstatus.ValeraTrackingEstatusID,
            EnvioSucursalNota: props.EnvioSucursalNota === null ? '' : props.EnvioSucursalNota,
            ReciboSucursalNota: props.ReciboSucursalNota === null ? '' : props.ReciboSucursalNota,
            doc: '',
            doc2: '',
            productoName: props.producto.Producto,
            serieName: `${props.serie.serie} (${props.serie.serieDesc})`,
            CodigoBarras: props.CodigoBarras
        };
    }
    
    useEffect(() => {
        GetRolUsuario()
    }, [tipoUsuario, producto, sucursal])

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        FnGetProductos()
        //FnGetSeries()
        FnGetTracking()
        FnGetSucursales()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])



    // On use effect
    React.useEffect(() => {
        // let rulesConditionColors: any[] = [];
        // state.Datos.forEach((element: any) => {
        //     rulesConditionColors.push(
        //         {
        //             when: (row: { valeraTrackingEstatus: { ValeraTrackingEstatusID: number } }) => row.valeraTrackingEstatus.ValeraTrackingEstatusID === element.valeraTrackingEstatus.ValeraTrackingEstatusID,
        //             style: {borderLeft: 'solid', borderLeftColor:'white', borderLeftWidth: '1em', borderBottom: 'solid', borderBottomColor: element.valeraTrackingEstatus.Color}
        //         },
        //     )
        // });

        if (state.Filtrando)
            setState(s => ({ ...s, DatosMostrar: s.DatosMostrar }))
        else
            setState(s => ({ ...s, DatosMostrar: []/*FiltrarDatos(s.Datos, Columns, state.Filtro), conditionalRowStyles: rulesConditionColors*/ }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])
    validarDistribuidor
    React.useEffect(() => {
        validarDistribuidor(state.Form.Datos.AsignaSucursalId)
    }, [state.Form.Datos.AsignaSucursalId])

    React.useEffect(() => {
        fnGetDistribuidores(state.Form.Datos.AsignaSucursalId)
    }, [state.Form.Datos.AsignaSucursalId])

    React.useEffect(() => {
        FnFiltrando()
    }, [state.FiltroProductos, state.FiltroSeries, state.Filtrotracking, state.FiltroSucursales, state.FiltroDistribuidoras, state.FiltroFolioI, state.FiltroFolioF, state.FiltroCodigo, state.FiltroTodo])

    // React.useEffect(()=>{
    //     var codigos = state.DatosAuxMostrar.map((valor: any) => {
    //         var obj = { value: valor.ValeraID, label: `${valor.CodigoBarras}` };
    //         return obj
    //     });
    //     setState(s=>({ ...s, optCodigosB: codigos}))
    // }, [state.DatosAuxMostrar])

    React.useEffect(() => {
        if (!state.btnAsignar)
            return
        let disponibles = state.Datos.filter(d => { return d.valeraTrackingEstatus.ValeraTrackingEstatusID === 3 })
        setState(s => ({ ...s, DatosAuxMostrar: disponibles }))
        FnGetCodigos(disponibles)
    }, [state.btnAsignar])

    React.useEffect(() => {
        if (!state.btnReasignar)
            return
        let disponibles = state.Datos.filter(d => { return [4,11].includes(d.valeraTrackingEstatus.ValeraTrackingEstatusID) })
        setState(s => ({ ...s, DatosAuxMostrar: disponibles }))
        FnGetCodigos(disponibles)
    }, [state.btnReasignar])

    React.useEffect(() => {
        if (!state.btnEnviar)
            return
        let asignados = state.Datos.filter(d => { return d.valeraTrackingEstatus.ValeraTrackingEstatusID === 4 })
        setState(s => ({ ...s, DatosAuxMostrar: asignados }))
        FnGetCodigos(asignados)
    }, [state.btnEnviar])

    React.useEffect(() => {
        if (!state.btnRecibir)
            return
        let enviados = state.Datos.filter(d => { return d.valeraTrackingEstatus.ValeraTrackingEstatusID === 5 })
        setState(s => ({ ...s, DatosAuxMostrar: enviados }))
        FnGetCodigos(enviados)
    }, [state.btnRecibir])

    React.useEffect(() => {
        if (!state.btnReenviar)
            return
        let asignados = state.Datos.filter(d => { return d.valeraTrackingEstatus.ValeraTrackingEstatusID === 5 })
        setState(s => ({ ...s, DatosAuxMostrar: asignados }))
        FnGetCodigos(asignados)
    }, [state.btnReenviar])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { ProductoID: 0, DistribuidorID: 0, serieId: '', FolioInicial: 0, FolioFinal: 0, Estatus: '', RegistroFecha: new Date(), RegistroUsuarioId: '', AsignaSucursalId: 0, AsignaSucursalUsuarioId: '', ReciboSucursalUsuarioId: '', AsignaDistribudiorUsuarioId: '', CanceladoUsuarioId: '', ValeraTrackingEstatusID: 0, EnvioSucursalNota: '', ReciboSucursalNota: '', doc: '', doc2: '', productoName: '', serieName: '', CodigoBarras: '0000' } } })
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({
            ...state,
            Datos: state.Datos.map(Dato => Dato.ValeraID === item.ValeraID ? item : Dato),
            DatosMostrar: state.DatosMostrar.map(Dato => Dato.ValeraID === item.ValeraID ? item : Dato),
            Form: { ...state.Form, Mostrar: false, Datos: { ProductoID: 0, DistribuidorID: 0, serieId: '', FolioInicial: 0, FolioFinal: 0, Estatus: '', RegistroFecha: new Date(), RegistroUsuarioId: '', AsignaSucursalId: 0, AsignaSucursalUsuarioId: '', ReciboSucursalUsuarioId: '', AsignaDistribudiorUsuarioId: '', CanceladoUsuarioId: '', ValeraTrackingEstatusID: 0, EnvioSucursalNota: '', ReciboSucursalNota: '', doc: '', doc2: '', productoName: '', serieName: '', CodigoBarras: '0000' } }
        })

    /** funcion Callback al actualizar uno o varios item */
    const cbActualizarM = (Valeras: number[], values: any, tracking: number) => {
        console.log('state.Datos', state.Datos)
        console.log('values', values)
        console.log('tracking', tracking)
        setState({
            ...state, Form: { ...state.Form, Datos: DatosDefecto }, ModalAux: { ...state.ModalAux, Mostrar: false }, ValerasX: [], btnAsignar: false, btnReasignar: false, btnEnviar: false, btnRecibir: false, btnReenviar: false, Datos: state.Datos.map(Dato => Valeras.includes(Dato.ValeraID)
                ? {
                    ValeraID: Dato.ValeraID,
                    producto: { ProductoID: Dato.producto.ProductoID, Producto: Dato.producto.Producto },
                    DistribuidorID: Dato.DistribuidorID,
                    serie: { serieId: Dato.serie.serieId, serie: Dato.serie.serie, serieDesc: Dato.serie.serieDesc },
                    FolioInicial: Dato.FolioInicial,
                    FolioFinal: Dato.FolioFinal,
                    Estatus: Dato.Estatus,
                    RegistroFecha: Dato.RegistroFecha,
                    RegistroUsuarioId: Dato.RegistroUsuarioId,
                    AsignaSucursal: {
                        SucursalID: values.AsignaSucursalId === 0 ? Dato.AsignaSucursal.SucursalID : values.AsignaSucursalId,
                        Nombre: state.optSucursales.find(suc => suc.value === (values.AsignaSucursalId === 0 ? Dato.AsignaSucursal.SucursalID : values.AsignaSucursalId))?.label,
                    },
                    AsignaSucursalUsuarioId: Dato.AsignaSucursalUsuarioId,
                    ReciboSucursalUsuarioId: Dato.ReciboSucursalUsuarioId,
                    AsignaDistribudiorUsuarioId: Dato.AsignaDistribudiorUsuarioId,
                    CanceladoUsuarioId: Dato.CanceladoUsuarioId,
                    valeraTrackingEstatus: {
                        ValeraTrackingEstatusID: Dato.valeraTrackingEstatus.ValeraTrackingEstatusID != 11 && Dato.valeraTrackingEstatus.ValeraTrackingEstatusID > tracking ? 11 : tracking,
                        Color: state.optRastreos.find(track => track.value === (Dato.valeraTrackingEstatus.ValeraTrackingEstatusID != 11 && Dato.valeraTrackingEstatus.ValeraTrackingEstatusID > tracking ? 11 : tracking))?.color,
                        Descripcion: state.optRastreos.find(track => track.value === (Dato.valeraTrackingEstatus.ValeraTrackingEstatusID != 11 && Dato.valeraTrackingEstatus.ValeraTrackingEstatusID > tracking ? 11 : tracking))?.descripcion,
                        TrackingEstatus: state.optRastreos.find(track => track.value === (Dato.valeraTrackingEstatus.ValeraTrackingEstatusID != 11 && Dato.valeraTrackingEstatus.ValeraTrackingEstatusID > tracking ? 11 : tracking))?.label
                    },
                    EnvioSucursalNota: !values.EnvioSucursalNota ? Dato.EnvioSucursalNota : values.EnvioSucursalNota,
                    ReciboSucursalNota: !values.ReciboSucursalNota ? Dato.ReciboSucursalNota : values.ReciboSucursalNota,
                    doc: Dato.doc,
                    CodigoBarras: Dato.CodigoBarras,
                }
                : Dato), DatosMostrar: state.DatosMostrar.map(Dato => Valeras.includes(Dato.ValeraID)
                    ? {
                        ValeraID: Dato.ValeraID,
                        producto: { ProductoID: Dato.producto.ProductoID, Producto: Dato.producto.Producto },
                        DistribuidorID: Dato.DistribuidorID,
                        serie: { serieId: Dato.serie.serieId, serie: Dato.serie.serie, serieDesc: Dato.serie.serieDesc },
                        FolioInicial: Dato.FolioInicial,
                        FolioFinal: Dato.FolioFinal,
                        Estatus: Dato.Estatus,
                        RegistroFecha: Dato.RegistroFecha,
                        RegistroUsuarioId: Dato.RegistroUsuarioId,
                        AsignaSucursal: {
                            SucursalID: values.AsignaSucursalId === 0 ? Dato.AsignaSucursal.SucursalID : values.AsignaSucursalId,
                            Nombre: state.optSucursales.find(suc => suc.value === (values.AsignaSucursalId === 0 ? Dato.AsignaSucursal.SucursalID : values.AsignaSucursalId))?.label,
                        },
                        AsignaSucursalUsuarioId: Dato.AsignaSucursalUsuarioId,
                        ReciboSucursalUsuarioId: Dato.ReciboSucursalUsuarioId,
                        AsignaDistribudiorUsuarioId: Dato.AsignaDistribudiorUsuarioId,
                        CanceladoUsuarioId: Dato.CanceladoUsuarioId,
                        valeraTrackingEstatus: {
                            ValeraTrackingEstatusID: Dato.valeraTrackingEstatus.ValeraTrackingEstatusID != 11 && Dato.valeraTrackingEstatus.ValeraTrackingEstatusID > tracking ? 11 : tracking,
                            Color: state.optRastreos.find(track => track.value === (Dato.valeraTrackingEstatus.ValeraTrackingEstatusID != 11 && Dato.valeraTrackingEstatus.ValeraTrackingEstatusID > tracking ? 11 : tracking))?.color,
                            Descripcion: state.optRastreos.find(track => track.value === (Dato.valeraTrackingEstatus.ValeraTrackingEstatusID != 11 && Dato.valeraTrackingEstatus.ValeraTrackingEstatusID > tracking ? 11 : tracking))?.descripcion,
                            TrackingEstatus: state.optRastreos.find(track => track.value === (Dato.valeraTrackingEstatus.ValeraTrackingEstatusID != 11 && Dato.valeraTrackingEstatus.ValeraTrackingEstatusID > tracking ? 11 : tracking))?.label
                        },
                        EnvioSucursalNota: !values.EnvioSucursalNota ? Dato.EnvioSucursalNota : values.EnvioSucursalNota,
                        ReciboSucursalNota: !values.ReciboSucursalNota ? Dato.ReciboSucursalNota : values.ReciboSucursalNota,
                        doc: Dato.doc,
                        CodigoBarras: Dato.CodigoBarras,
                    }
                    : Dato)
        })


        //FNGetLocal()
    }
    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Datos: DatosDefecto, Mostrar: false, evento: '' } })

    /** funcion para cancelar la forma M*/
    const fnCancelarM = () => setState({ ...state, Form: { ...state.Form, Datos: DatosDefecto }, ModalAux: { ...state.ModalAux, Mostrar: false, evento: '' }, ValerasX: [], btnAsignar: false, btnReasignar: false, btnEnviar: false, btnRecibir: false, btnReenviar: false, optCodigosB: [] })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Administrar Valeras (BLOQUES)">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        subHeader
                                        noDataComponent={<div style={{ margin: '4em' }}> {state.Filtrando ? <><FaExclamationCircle color={'grey'} size={20} />  NO HAY VALERAS QUE COINCIDAN CON LOS FILTROS SELECCIONADOS</> : ""}</div>}
                                        paginationComponentOptions={{ rowsPerPageText: 'Registros por pagina:', rangeSeparatorText: 'de', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'Todo' }}
                                        subHeaderComponent=
                                        {
                                            <div className="row" style={{ width: '102%' }}>
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3" style={{ justifyContent: 'space-between' }}>
                                                        <div></div>
                                                        <div>
                                                            {permisoActSucursal && <button type="button" className="ms-2 btn btn-outline-secondary waves-effect waves-light" onClick={() => setState({ ...state, ModalAux: { tituloModalM: 'Asignación de Valeras a Sucursal', Mostrar: true, evento: 'ASIGNAR' }, btnAsignar: true })}>
                                                                <FaStore size={20} /> ASIGNAR A SUCURSAL
                                                            </button>}
                                                            {permisoRasigSucursal && <button type="button" className="ms-2 btn btn-outline-secondary waves-effect waves-light" onClick={() => setState({ ...state, ModalAux: { tituloModalM: 'Reasignación de Valeras a una nueva Sucursal', Mostrar: true, evento: 'REASIGNAR' }, btnReasignar: true })}>
                                                                <FaRetweet size={20} /> REASIGNAR A SUCURSAL
                                                            </button>}
                                                            {permisoEnvio && <button type="button" className="ms-2 btn btn-outline-secondary waves-effect waves-light" onClick={() => setState({ ...state, ModalAux: { tituloModalM: 'Envío de Valeras a Sucursales', Mostrar: true, evento: 'ENVIAR' }, btnEnviar: true })}>
                                                                <FaShippingFast size={20} /> ENVIAR A SUCURSAL
                                                            </button>}
                                                            {permisoReenvio && <button type="button" className="ms-2 btn btn-outline-secondary waves-effect waves-light" onClick={() => setState({ ...state, ModalAux: { tituloModalM: 'Confirmación de recepción de Valeras en Sucursales', Mostrar: true, evento: 'REENVIAR' }, btnReenviar: true })}>
                                                                <FaShippingFast size={20} /> REENVIAR A SUCURSAL
                                                            </button>}
                                                            {permisoRecibido && <button type="button" className="ms-2 btn btn-outline-secondary waves-effect waves-light" onClick={() => setState({ ...state, ModalAux: { tituloModalM: 'Confirmación de recepción de Valeras en Sucursales', Mostrar: true, evento: 'RECIBIR' }, btnRecibir: true })}>
                                                                <FaTruckLoading size={20} /> RECIBIDO EN SUCURSAL
                                                            </button>}
                                                            {<button className="ms-2 btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>}
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
                                                                                    disabled={false || tipoUsuario == 6 || tipoUsuario == 3}
                                                                                    label="Productos"
                                                                                    name="ProductoIDF"
                                                                                    placeholder=" -"
                                                                                    options={state.optProductos}
                                                                                    addDefault={true}
                                                                                    valor={state.FiltroProductos || producto}
                                                                                    accion={FnGetProductosFiltro} />
                                                                            </div>
                                                                            <div style={{ height: '67px', width: '250px' }}>
                                                                                {!state.showSerieFitro && <div>
                                                                                    <label className="form-label mb-0">Cargando Series ...</label>
                                                                                    <Spinner />
                                                                                </div>}
                                                                                {state.showSerieFitro && <ActionSelect
                                                                                    disabled={state.optSeriesFiltro.length === 0}
                                                                                    label="Series"
                                                                                    name="serieIdF"
                                                                                    placeholder="NO SELECCIONADO"
                                                                                    options={state.optSeriesFiltro}
                                                                                    addDefault={true}
                                                                                    valor={state.FiltroSeries}
                                                                                    accion={FnGetSeriesFiltro} />}
                                                                            </div>
                                                                            <div style={{ height: '67px', width: '250px' }}>
                                                                                {state.showRastreoFitro && <div>
                                                                                    <ActionSelect
                                                                                        disabled={false}
                                                                                        label="Rastreo"
                                                                                        name="TrackingIDF"
                                                                                        placeholder="NO SELECCIONADO"
                                                                                        options={state.optRastreos}
                                                                                        addDefault={true}
                                                                                        valor={state.Filtrotracking}
                                                                                        accion={FnGetRastreoFiltro} />
                                                                                </div>}
                                                                            </div>
                                                                            <div style={{ height: '67px', width: '250px' }}>
                                                                                {state.showRastreoFitro && <div>
                                                                                    <label className="form-label mb-0">Folio Inicial</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        placeholder="Folio INICIAL"
                                                                                        value={state.FiltroFolioI}
                                                                                        onChange={e => FnGetFolioIFiltro(e.target.value)} />
                                                                                </div>}
                                                                            </div>
                                                                        </div>
                                                                        <div className="row" style={{ textAlign: 'initial' }}>
                                                                            <div style={{ height: '57px', width: '250px' }}>
                                                                                {state.showRastreoFitro && <div>
                                                                                    <ActionSelect
                                                                                        disabled={false || tipoUsuario == 6 || tipoUsuario == 3}
                                                                                        label="Sucursales"
                                                                                        name="SucursalIDF"
                                                                                        placeholder="NO SELECCIONADO"
                                                                                        options={state.optSucursales}
                                                                                        addDefault={true}
                                                                                        valor={state.FiltroSucursales || sucursal}
                                                                                        accion={FnGetSucursalFiltro} />
                                                                                </div>}
                                                                            </div>
                                                                            <div style={{ height: '57px', width: '250px' }}>
                                                                                {!state.showDistribuidorFitro && <div>
                                                                                    <label className="form-label mb-0">Cargando DVs ...</label>
                                                                                    <Spinner />
                                                                                </div>}
                                                                                {state.showDistribuidorFitro && <ActionSelect
                                                                                    disabled={state.optDistribuidoresFiltro.length === 0}
                                                                                    label="DVs"
                                                                                    name="DistribuidorIDF"
                                                                                    placeholder="NO SELECCIONADO"
                                                                                    options={state.optDistribuidoresFiltro}
                                                                                    addDefault={true}
                                                                                    valor={state.FiltroDistribuidoras}
                                                                                    accion={FnGetDistribuidoresFiltro} />}
                                                                            </div>
                                                                            <div style={{ height: '67px', width: '250px' }}>
                                                                                {state.showRastreoFitro && <div>
                                                                                    <label className="form-label mb-0">Código de Barras</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        placeholder="NO CAPTURADO"
                                                                                        value={state.FiltroCodigo}
                                                                                        onChange={e => FnGetCodigoFiltro(e.target.value)} />
                                                                                </div>}
                                                                            </div>
                                                                            <div style={{ height: '67px', width: '250px' }}>
                                                                                {state.showRastreoFitro && <div>
                                                                                    <label className="form-label mb-0">Folio Final</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        placeholder="Folio FINAL"
                                                                                        value={state.FiltroFolioF}
                                                                                        onChange={e => FnGetFolioFFiltro(e.target.value)} />
                                                                                </div>}
                                                                            </div>
                                                                            <div style={{ height: '67px', width: '150px' }}>
                                                                                {<div>
                                                                                    <label className="form-label mb-0">Todas</label>
                                                                                    <br />
                                                                                    <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            style={{ marginTop: '0.7em' }}
                                                                                            className="form-check-input"
                                                                                            checked={state.FiltroTodo}
                                                                                            onChange={e => FnGetTodoFiltro(e.target.checked)} />
                                                                                    </div>
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
                                        keyField={"ValeraID"}
                                        defaultSortField={"ValeraID"}
                                        columns={Columns}
                                    //conditionalRowStyles={state.conditionalRowStyles}
                                    />
                                    <ModalWin open={state.Form.Mostrar} large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>{state.tituloModal}</h5>
                                            <div>
                                                <div style={{ width: '25px', height: '25px', borderRadius: '50%', backgroundColor: state.statusCircle }}></div>
                                            </div>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                optProductos={state.optProductos}
                                                optSeries={state.optSeries}
                                                optSucursales={state.optSucursales}
                                                optDistribuidores={state.optDistribuidores}
                                                evento={state.Form.evento}
                                                fnGetDistribuidores={fnGetDistribuidores}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                            />}
                                        </ModalWin.Body>
                                    </ModalWin>
                                    {/*MODAL ACCIONES MASIVAS*/}
                                    <ModalWin open={state.ModalAux.Mostrar} xlarge>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>{state.ModalAux.tituloModalM}</h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CFormM
                                                oidc={props.oidc}
                                                datos={state.DatosAuxMostrar}
                                                Valeras={state.ValerasX}
                                                evento={state.ModalAux.evento}
                                                columns={ColumnsM}
                                                initialValues={state.Form.Datos}
                                                optProductos={state.optProductos}
                                                optSeries={state.optSeries}
                                                optSucursales={state.optSucursales}
                                                optCodigosB={state.optCodigosB}
                                                cbGuardar={cbAgregar}
                                                FnGetSeries={FnGetSeries}
                                                fnCancelar={fnCancelarM}
                                                selectValeras={selectValeras}
                                                selectValerasMultiple={selectValerasMultiple}
                                                filtrandoM={filtrandoM}
                                                cbActualizarM={cbActualizarM}
                                            />}

                                        </ModalWin.Body>
                                    </ModalWin>
                                    {/*MODAL VALES*/}
                                    <ModalWin open={state.ShowVales}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                Administrar Vales
                                            </h5>
                                            <button type="button" className="delete" onClick={() => {
                                                setState(s => ({ ...s, ShowVales: false }))
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {state.ShowVales &&
                                                <Vales
                                                    ValeraID={state.ValeraID}
                                                // cbClose={cbClose}
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

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(Valeras);

