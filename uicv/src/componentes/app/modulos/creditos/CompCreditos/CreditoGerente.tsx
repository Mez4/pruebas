import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CreditoGerente/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaUser } from 'react-icons/fa'

import { Link, useParams } from 'react-router-dom'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CreditoGerente/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { CFormAsigna } from './CreditoGerente/CFormAsigna'
import Sucursales from '../../../../selectores/Sucursales';
import moment from 'moment'
import { iUI } from '../../../../../interfaces/ui/iUI';

type CatalogosType = {
    oidc: IOidc,
    ui: iUI
}

const CreditoGerente = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const modalStyle = { overflowY: 'unset' };
    const DatosDefecto = { Nombre: '', UsuarioID: 0, SucursalID: 0, SucursalesIDs: [] }
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
    })

    // Ontenemos el ID del producto
    type paramType = { productoId: string }
    let { productoId } = useParams<paramType>()
    let id_int: number = parseInt(productoId as string)

    const FNGetLocal = () => {
        console.log("ProductoID", props.ui);
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc, props.ui.Producto?.ProductoID ?? 0)
            .then((respuesta: any) => {
                console.log(respuesta);
                // Fusionar elementos con el mismo UsuarioID
                const datosUnicos = Object.values(
                    respuesta.reduce((acc: any, item: any) => {
                        if (!acc[item.UsuarioID]) {
                            acc[item.UsuarioID] = { ...item, SucursalesIDs: [item.SucursalID] };
                        } else {
                            acc[item.UsuarioID] = {
                                ...item,
                                SucursalesIDs: Array.from(new Set([...acc[item.UsuarioID].SucursalesIDs, item.SucursalID]))
                            };
                        }
                        return acc;
                    }, {})
                );
                setState(s => ({ ...s, Cargando: false, Error: false, Datos: datosUnicos }))
            })
            .catch(() => {
                setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
            })
    }

    const FNGetSucursales = () => {

        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetSucursalesByProd(props.oidc, props.ui.Producto?.ProductoID ?? 0)
            .then((respuesta: any) => {
                console.log(respuesta);
                setState(s => ({
                    ...s, Cargando: false, Error: false, Sucursales: respuesta.map(sucursal => {
                        return { value: sucursal.SucursalID, label: sucursal.Nombre }
                    })
                }))
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
                    ...s, Cargando: false, Error: false, Usuarios: respuesta.map(usuario => {
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
                { name: 'Id', selector: 'GerenteID', sortable: true, },
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
                                    Datos: { Nombre: props.Nombre, UsuarioID: props.UsuarioID, SucursalID: props.SucursalID, SucursalesIDs: props.SucursalesIDs },
                                    Id: props.GerenteID
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
            FNGetLocal()
            FNGetSucursales();
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
        const datosUnicos = Object.values(
            respuesta.reduce((acc: any, item: any) => {
                if (!acc[item.UsuarioID]) {
                    acc[item.UsuarioID] = { ...item, SucursalesIDs: [item.SucursalID] };
                } else {
                    acc[item.UsuarioID] = {
                        ...item,
                        SucursalesIDs: Array.from(new Set([...acc[item.UsuarioID].SucursalesIDs, item.SucursalID]))
                    };
                }
                return acc;
            }, {})
        );
        setState(s => ({ ...s, Datos: [...state.Datos, (datosUnicos as any)[0]], Form: { ...s.Form, Mostrar: false, Datos: DatosDefecto }, MostrarAsigna: false, Usuarios: s.Usuarios.filter((u: any) => u.value !== (datosUnicos as any)[0].UsuarioID) }))
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (respuesta: any) => {
        const datosUnicos: any = Object.values(
            respuesta.reduce((acc: any, item: any) => {
                if (!acc[item.UsuarioID]) {
                    acc[item.UsuarioID] = { ...item, SucursalesIDs: [item.SucursalID] };
                } else {
                    acc[item.UsuarioID] = {
                        ...item,
                        SucursalesIDs: Array.from(new Set([...acc[item.UsuarioID].SucursalesIDs, item.SucursalID]))
                    };
                }
                return acc;
            }, {})
        )[0];
        setState({
            ...state, Datos: state.Datos.map(Dato => Dato.UsuarioID === datosUnicos.UsuarioID ? datosUnicos : Dato),
            Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto }, MostrarAsigna: false
        })
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
    }

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })
    const fnCancelarAsigna = () => setState({ ...state, MostrarAsigna: false })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Administrar Gerentes">
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
                                                        <input type="text" className="form-control" placeholder="Buscar gerente" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
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
                                        keyField={"GerenteID"}
                                        defaultSortField={"GerenteID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "Editar Gerente" : "Agregar Gerente"}
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
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>
                                    <ModalWin open={state.MostrarAsigna}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                Asignar persona como gerente
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
                                                SucursalesOptions={state.Sucursales}
                                                UsuariosOptions={state.Usuarios}
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

export default connect(mapStateToProps, mapDispatchToProps)(CreditoGerente)