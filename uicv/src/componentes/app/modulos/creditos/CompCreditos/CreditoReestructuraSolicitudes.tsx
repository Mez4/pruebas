import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import { DBConfia_Creditos } from '../../../../../../src/interfaces_db/DBConfia/Creditos'
import { iUI } from '../../../../../interfaces/ui/iUI'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import * as Funciones from './ReestructuraSolicitudes/Funciones'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaUserPlus, FaClipboardList } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import ReactTooltip from 'react-tooltip'
import { toast } from 'react-toastify'
import { AsignaAnalista } from './CreditoReestructuraSolicitudes/AsignaAnalista'
import { Solicitud } from './CreditoReestructuraSolicitudes/Solicitud'
import moment from 'moment'

type CatalogosType = {
    oidc: IOidc
    ui: iUI,
}

const ReestructuraSolicitudes = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { SolicitudReestructuraID: 0, Distribuidor: '', DistribuidorID: 0, AnalistaPersonaID: 0 }
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
            Id: undefined
        }
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
        Funciones.FnGetAnalistas(props.oidc)
            .then((respuesta: any) => {
                var sucursales = respuesta.map((valor: any) => {
                    var obj = { value: valor.AnalistaID, label: valor.NombreCompleto };
                    return obj
                });

                setState(s => ({ ...s, optAnalistaPers: sucursales }))
            })
            .catch(() => {
                setState(s => ({ ...s, optAnalistaPers: [] }))
            })
    }

    const fnAsignacion = (Item: any) => setState(s => ({ ...s, ModalAsign: true, Item }))
    const fnSolicitud = (Item: any) => setState(s => ({ ...s, ModalSolicitud: true, Item }))



    const activoStyle = (row: any) => {
        return [
            {
                when: row => row.Clave === 'CAN-0',
                style: { backgroundColor: '#ffeeee' },
            },
            {
                when: row => row.Clave === 'APL-0',
                style: { backgroundColor: '#eeffee' },
            },
        ]
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'id',
                    selector: 'SolicitudReestructuraID',
                    sortable: true,
                    width: '7%',
                    cell: (props) =>
                        <div style={{ width: '100%', textAlign: 'left' }} className='LabelInDTable'>
                            <label style={{ fontSize: '1em' }}>
                                {props.SolicitudReestructuraID}
                            </label>
                        </div>,
                    conditionalCellStyles: activoStyle(props)
                },
                {
                    name: 'Asignar',
                    selector: 'AnalistaUsuarioID',
                    width: '8%',
                    cell: (props) =>
                        <div className='radiusSmallDiv'>
                            {permisoAsignar && <div className={`divInDTable text-center ${props.AnalistaPersonaID ?? 'pulsingButton'}`}>
                                <button data-tip data-for={`AA_${props.ProspectoID}`} className="btn btn-outline-default buttonIconInDTable" type={"button"} onClick={() => {
                                    fnAsignacion(props)
                                    setState(s => ({
                                        ...s,
                                        Form: {
                                            ...state.Form, Mostrar: true,
                                            Datos: { SolicitudReestructuraID: props.SolicitudReestructuraID, Distribuidor: props.Distribuidor, DistribuidorID: props.DistribuidorID, AnalistaPersonaID: props.AnalistaPersonaID },
                                            Id: props.SolicitudReestructuraID,
                                            IdAnalista: props.AnalistaUsuarioID
                                        }
                                    }))
                                }}>
                                    <FaUserPlus color={`${props.AnalistaPersonaID ? 'green' : 'gray'}`} size={props.AnalistaPersonaID ? 30 : 15} />
                                </button>
                                <ReactTooltip id={`AA_${props.ProspectoID}`} type="info" effect="solid">
                                    {props.AnalistaPersonaID ? 'Re' : ''}Asignar Analista a {props.Distribuidor}
                                </ReactTooltip>
                            </div>}
                        </div>,
                    conditionalCellStyles: activoStyle(props)
                },
                {
                    name: 'Analista',
                    selector: 'Analista',
                    sortable: true,
                    width: '16%',
                    conditionalCellStyles: activoStyle(props)
                },
                {
                    name: 'Fecha',
                    selector: 'Fecha',
                    sortable: true,
                    width: '12%',
                    cell: (props) => <span>{moment(props.Fecha).format('DD/MM/YYYY')}</span>,
                    conditionalCellStyles: activoStyle(props)
                },
                {
                    name: 'Tipo',
                    selector: 'Tipo',
                    sortable: true,
                    width: '12%',
                    conditionalCellStyles: activoStyle(props)
                },
                {
                    name: 'Socia DV',
                    selector: 'Distribuidor',
                    sortable: true,
                    width: '16%',
                    cell: (props) =>
                        <>
                            <label data-tip data-for={`P_${props.DistribuidorID}`} className="LabelInDTable">
                                {props.Distribuidor}
                            </label>
                            <ReactTooltip id={`P_${props.DistribuidorID}`} type="info" effect="solid">
                                {props.Distribuidor}
                            </ReactTooltip>
                        </>,
                    conditionalCellStyles: activoStyle(props)
                },
                {
                    name: 'Sucursal',
                    selector: 'Sucursal',
                    sortable: true,
                    width: '17%',
                    conditionalCellStyles: activoStyle(props)
                },
                {
                    name: 'Validación',
                    selector: 'SolicitudReestructuraID',
                    width: '9%',
                    cell: (props) =>
                        <>
                            <div data-tip data-for={`BC_${props.ProspectoID}`} className="divInDTable text-center radiusSmallDivR">
                                <button onClick={() => fnSolicitud(props)} className="btn btn-outline-default buttonIconInDTable" type={"button"}> <FaClipboardList color={props.Clave === 'CAN-0' ? 'red' : props.Clave === 'APL-0' ? 'green' : 'gray'} size={30} /></button>
                            </div>
                            <ReactTooltip id={`BC_${props.ProspectoID}`} type="info" effect="solid">
                                Validación de la solicitud de Reestructura de la socia {props.Distribuidor}
                            </ReactTooltip>
                        </>,
                    conditionalCellStyles: activoStyle(props)
                },
            ]
        return colRet
    }, [state.Form])

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        FnGetAnalistas()
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

    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.SolicitudReestructuraID === item.SolicitudReestructuraID ? item : Dato), ModalAsign: false, Form: { ...state.Form, Mostrar: false, Datos: { SolicitudReestructuraID: 0, Distribuidor: '', DistribuidorID: 0, AnalistaPersonaID: 0 } } })

    //FUNCION PARA CANCELAR LAS FORMAS
    const fnCancelar = () => setState(s => ({
        ...s, ModalAsign: false, ModalSolicitud: false
    }))

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Solicitudes de Reestructura">
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
                                    {state.ModalAsign && <AsignaAnalista
                                        oidc={props.oidc}
                                        initialValues={state.Form.Datos}
                                        Id={state.Form.Id}
                                        optAnalista={state.optAnalistaPers}
                                        cbActualizar={cbActualizar}
                                        fnCancelar={fnCancelar}
                                        Item={state.Item}
                                        mostrar={state.ModalAsign}
                                    />}

                                    {state.ModalSolicitud && <Solicitud
                                        oidc={props.oidc}
                                        initialValues={state.Form.Datos}
                                        Id={state.Form.Id}
                                        optAnalista={state.optAnalistaPers}
                                        cbActualizar={cbActualizar}
                                        fnCancelar={fnCancelar}
                                        Item={state.Item}
                                        mostrar={state.ModalSolicitud}
                                    />}
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
export default connect(mapStateToProps, mapDispatchToProps)(ReestructuraSolicitudes);
