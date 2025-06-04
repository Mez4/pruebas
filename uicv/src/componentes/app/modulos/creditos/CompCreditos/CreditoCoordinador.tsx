import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CreditoCoordinador/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaUser } from 'react-icons/fa'

import { Link, useParams } from 'react-router-dom'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CreditoCoordinador/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { CFormAsigna } from './CreditoCoordinador/CFormAsigna'
import Sucursales from '../../../../selectores/Sucursales';
import moment from 'moment'
import { iUI } from '../../../../../interfaces/ui/iUI';

type CatalogosType = {
    oidc: IOidc,
    ui: iUI
}

const CreditoCoordinador = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const modalStyle = { overflowY: 'unset' };
    const DatosDefecto = { Nombre: '', SucursalID: 0, ClasificadorID: 0, PersonaID: 0, UsuarioID: 0 }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        },
        MostrarAsigna: false,
        Sucursales: [],
        Usuarios: [],
        UsuariosOptions: []
    })

    // Ontenemos el ID del producto
    type paramType = { productoId: string }
    let { productoId } = useParams<paramType>()
    let id_int: number = parseInt(productoId as string)

    const FNGetLocal = () => {
        console.log("ProductoID", props.ui);
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc)
            .then((respuesta: any) => {
                setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
            })
            .catch(() => {
                setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
            })
    }

    const FNGetUsuariosProducto = () => {

        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetUsuariosProducto(props.oidc)
            .then((respuesta: any) => {
                console.log(respuesta);
                setState(s => ({
                    ...s, Cargando: false, Error: false, Usuarios: respuesta, UsuariosOptions: respuesta.map(usuario => {
                        return { value: usuario.UsuarioID, label: usuario.Nombre }
                    })
                }))
            })
            .catch(() => {
                setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
            })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'CoordinadorID', sortable: true, },
                { name: 'Nombre', selector: 'Nombre', sortable: true, },
                { name: 'Fecha Registro', selector: 'FechaHoraRegistro', sortable: true, cell: (props) => <span>{props.FechaHoraRegistro ? moment(props.FechaHoraRegistro).format('DD/MM/YYYY HH:mm a') : ""}</span> },
                { name: 'Sucursal', selector: 'SucursalNombre', sortable: true },
                { name: 'Usuario Creó', selector: 'UsuarioRegistro', sortable: true },
                {
                    name: 'Acciones', sortable: false,
                    cell: (props) =>
                        <button title='Editar' className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...s.Form, Mostrar: true,
                                    Datos: { Nombre: props.Nombre, SucursalID: props.SucursalID, ClasificadorID: props.ClasificadorGrupoID, PersonaID: props.PersonaID, UsuarioID: props.UsuarioID },
                                    Id: props.CoordinadorID
                                }
                            }))
                        }}>
                            <FaPencilAlt />
                        </button>
                },
            ]
        return colRet
    }, [])

    React.useEffect(() => {
        if (isMounted.current === true) {
            FNGetLocal();
            FNGetUsuariosProducto();
        }
        return () => {
            isMounted.current = false
        }
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    const cbAgregar = (respuesta: any) => {
        const usuarioRegistrado = state.Usuarios.find((u: any) => u.PersonaID === respuesta[0].PersonaID) as any
        setState(s => ({ ...s, Datos: [...state.Datos, respuesta[0]], Form: { ...s.Form, Mostrar: false, Datos: DatosDefecto }, MostrarAsigna: false, Usuarios: s.Usuarios.filter((u: any) => u.PersonaID !== respuesta[0].PersonaID), UsuariosOptions: s.UsuariosOptions.filter((u: any) => u.value !== (usuarioRegistrado?.UsuarioID ?? 0)) }))
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (respuesta: any) => {
        setState({
            ...state, Datos: state.Datos.map(Dato => Dato.CoordinadorID === respuesta.CoordinadorID ? respuesta : Dato),
            Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto }, MostrarAsigna: false
        })
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
    }

    const cbChangeSucursal = (item: any) => {
        Funciones.FNGetClasificadorGrupoIDBySucursal(props.oidc, item)
            .then((respuesta: any) => {
                setState(s => ({ ...s, Datos: [...state.Datos], Form: { ...s.Form, Datos: { ...state.Form.Datos, SucursalID: item, ClasificadorID: (respuesta[0] ? respuesta[0].ClasificadorGrupoID : 0) } } }))
            })
            .catch(() => {
                setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
            })
    }

    const cbChangeUsuario = (item: any) => {
        console.log(item)
        const personaID = (state.Usuarios.find((u: any) => u.UsuarioID === item) as any)?.PersonaID
        console.log(personaID)
        setState(s => ({ ...s, Datos: [...state.Datos], Form: { ...s.Form, Datos: { ...state.Form.Datos, PersonaID: personaID } } }))
    }

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })
    const fnCancelarAsigna = () => setState({ ...state, MostrarAsigna: false })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Administrar Cordinadores">
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
                                                        <input type="text" className="form-control" placeholder="Buscar coordinador" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /></span>
                                                        <button title='Agregar' className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, MostrarAsigna: true, })}
                                                        ><FaPlus /></button>
                                                        <button title='Actualizar' className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
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
                                        keyField={"CoordinadorID"}
                                        defaultSortField={"CoordinadorID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "Editar Coordinador" : "Agregar Cordinador"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body style={{ overflowY: 'unset' }}>
                                            <CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                ProdID={id_int}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                SucursalesOptions={state.Sucursales}
                                                cbChangeSucursal={cbChangeSucursal}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>
                                    <ModalWin open={state.MostrarAsigna}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                Asignar persona como coordinador
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body style={modalStyle}>
                                            <CFormAsigna
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={id_int}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelarAsigna}
                                                UsuariosOptions={state.UsuariosOptions}
                                                cbChangeSucursal={cbChangeSucursal}
                                                cbChangeUsuario={cbChangeUsuario}
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
    oidc: state.oidc,
    ui: state.UI
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CreditoCoordinador)