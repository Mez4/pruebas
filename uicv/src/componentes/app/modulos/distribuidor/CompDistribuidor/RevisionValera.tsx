import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import { DBConfia_Creditos } from '../../../../../../src/interfaces_db/DBConfia/Creditos'
import { iUI } from '../../../../../interfaces/ui/iUI'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import * as Funciones from './RevisionValera/Funciones'
import * as FnDistribuidores from '../../distribuidor/CompDistribuidor/Distribuidor/Funciones'
import * as FnSucursales from '../../general/CompGeneral/Sucursal/Funciones'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaUserPlus, FaClipboardList, FaExclamationCircle } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import ReactTooltip from 'react-tooltip'
import { toast } from 'react-toastify'
// import { AsignaAnalista } from './CreditoReestructuraSolicitudes/AsignaAnalista'
// import { Solicitud } from './CreditoReestructuraSolicitudes/Solicitud'
import { CForm } from './RevisionValera/CForm'
import moment from 'moment'

type CatalogosType = {
    oidc: IOidc
    ui: iUI,
}

const RevisionValera = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { ProductoID: 0, DistribuidorID: 0, serieId: '', FolioInicial: 0, FolioFinal: 0, Estatus: 'A', RegistroFecha: new Date, RegistroUsuarioId: '', AsignaSucursalId: 0, AsignaSucursalUsuarioId: '', ReciboSucursalUsuarioId: '', AsignaDistribudiorUsuarioId: '', CanceladoUsuarioId: '', ValeraTrackingEstatusID: 0, EnvioSucursalNota: '', ReciboSucursalNota: '', doc: '', doc2: '', productoName: '', serieName: '', CodigoBarras: '0000' }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optAnalistaPers: any[] = []
    const Item: DBConfia_Creditos.IReestructurasSolicitudes_VW = {
        Producto: '',
        Distribuidor: '',
        Concepto: undefined,
        Analista: undefined,
        Estatus: '',
        Clave: '',
        Tipo: undefined,
        Sucursal: '',
        TelefonoMovil: '',
        SolicitudReestructuraID: 0,
        ProductoID: 0,
        DistribuidorID: 0,
        Plazos: 0,
        AltaUsuarioID: 0,
        AltaPersonaID: 0,
        Fecha: '',
        ConceptoReestructuraID: 0,
        SolicitudFilePath: '',
        MachoteFilePath: undefined,
        AnalistaUsuarioID: undefined,
        AnalistaPersonaID: undefined,
        EstatusReestructuraID: 0,
        TipoReestructuraID: 0,
        SaldoAReestructurar: 0,
        IneFrente: undefined,
        IneReverso: undefined,
        SucursalID: undefined,
        FechaCorte: '',
    }
    const optProductos: any[] = []
    const optSeries: any[] = []
    const optSucursales: any[] = []
    const optDistribuidores: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        ModalAsign: false,
        ModalSolicitud: false,
        optAnalistaPers,
        Item,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined,
            evento: ''
        },
        tituloModal: 'Agregar Valera',
        statusCircle: 'red',
        optProductos,
        optSeries,
        optSucursales,
        optDistribuidores,
    })

    const permisoAsignar = props.ui.PermisosProductos?.find(p => p.PermisoID == 312)

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc)
            .then((respuesta: any) => {
                console.log('SSS', respuesta)
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch((error) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const FnGetAnalistas = () => {
        setState(s => ({ ...s }))
        // Funciones.FnGetAnalistas(props.oidc)
        //     .then((respuesta: any) => {
        //         var sucursales = respuesta.map((valor: any) => {
        //             var obj = { value: valor.AnalistaID, label: valor.NombreCompleto };
        //             return obj
        //         });

        //         setState(s => ({ ...s, optAnalistaPers: sucursales }))
        //     })
        //     .catch(() => {
        //         setState(s => ({ ...s, optAnalistaPers: [] }))
        //     })
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

    const getDatos = (props: any) => {
        console.log('props', props)
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

    const cbAgregar = (item: any) => {
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { ProductoID: 0, DistribuidorID: 0, serieId: '', FolioInicial: 0, FolioFinal: 0, Estatus: '', RegistroFecha: new Date(), RegistroUsuarioId: '', AsignaSucursalId: 0, AsignaSucursalUsuarioId: '', ReciboSucursalUsuarioId: '', AsignaDistribudiorUsuarioId: '', CanceladoUsuarioId: '', ValeraTrackingEstatusID: 0, EnvioSucursalNota: '', ReciboSucursalNota: '', doc: '', doc2: '', productoName: '', serieName: '', CodigoBarras: '0000' } } })
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => {
        FNGetLocal();
        fnCancelar();
    }
        

    const fnAsignacion = (Item: any) => setState(s => ({ ...s, ModalAsign: true, Item }))
    const fnSolicitud = (Item: any) => setState(s => ({ ...s, ModalSolicitud: true, Item }))

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
                    width: '18%',
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
                    name: 'Revisión de Valera',
                    width: '9%',
                    cell: (props) =>
                        <>
                            <div data-tip data-for={`BC_${props.ProspectoID}`} className="divInDTable text-center radiusSmallDivR">
                                <button className="btn btn-outline-default buttonIconInDTable" type={"button"} onClick={() => {
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
                                }}> <FaClipboardList color={'gray'} size={30} /></button>
                            </div>
                            <ReactTooltip id={`BC_${props.ProspectoID}`} type="info" effect="solid">
                                Revisión Valera
                            </ReactTooltip>
                        </>
                },
            ]
        return colRet
    }, [state.Form])

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        FnGetAnalistas()
        FnGetSucursales()
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

    React.useEffect(() => {
        fnGetDistribuidores(state.Form.Datos.AsignaSucursalId)
    }, [state.Form.Datos.AsignaSucursalId])

    //FUNCION PARA CANCELAR LAS FORMAS
    const fnCancelar = () => setState(s => ({
        ...s, ModalAsign: false, ModalSolicitud: false, Form: { ...state.Form, Datos: DatosDefecto, Mostrar: false, evento: '' }
    }))

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Revisión de Valera">
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
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        data={state.DatosMostrar}
                                        striped
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"ValerasCabeceraEstatusID"}
                                        defaultSortField={"ValerasCabeceraEstatusID"}
                                        columns={Columns}
                                    />
                                    {state.Form.Mostrar && <ModalWin open={state.Form.Mostrar} large>
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
                                    </ModalWin>}

                                    {/* {state.ModalSolicitud && <Solicitud
                                        oidc={props.oidc}
                                        initialValues={state.Form.Datos}
                                        Id={state.Form.Id}
                                        optAnalista={state.optAnalistaPers}
                                        cbActualizar={cbActualizar}
                                        fnCancelar={fnCancelar}
                                        Item={state.Item}
                                        mostrar={state.ModalSolicitud}
                                    />} */}
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
export default connect(mapStateToProps, mapDispatchToProps)(RevisionValera);
