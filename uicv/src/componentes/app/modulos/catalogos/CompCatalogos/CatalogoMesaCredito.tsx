import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CatalogoMesaCredito/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import { toast } from 'react-toastify'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle } from 'react-icons/fa'
import { FiRefreshCcw } from 'react-icons/fi'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CatalogoMesaCredito/CForm'
import { FiltrarDatos } from '../../../../../global/functions'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'


type CatalogosType = {
    Seguridad: IOidc
}
const CatalogoMesaCredito = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = { activo: false, clave: '', nombre: '', directorMesa: {}, productos: [], analistas: [], directorId: 0, productoId: 0, analistaId: 0 }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const OpcionesProductos: any[] = []
    const OpcionesUsuario: any[] = []
    let usuario2: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Cargando: true,
        Error: false,
        Filtro: '',
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        },
        OpcionesProductos,
        OpcionesUsuario
    })
    React.useEffect(() => {
        FnGetProductos()
        FnGetUsuarios()
        FnGetMesaCredito()
        // eslint-disable-next-line
    }, [])

    // On use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    const FnGetMesaCredito = () => {
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                console.log(respuesta)

                //respuesta.acumulaCuenta = respuesta.acumulaCuneta.nombre
                setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))

            })
            .catch(error => {
                console.log("Error: ", error)
                setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
            })
    }
    const FnGetProductos = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetProducto(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    var productos = respuesta.map((valor: any) => {
                        var obj = { value: valor.productoId, label: valor.producto };
                        return obj
                    });

                    setState(s => ({ ...s, OpcionesProductos: productos }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OpcionesProductos: [] }))
                }
            })
    }

    const FnGetUsuarios = (directorId?: any) => {
        setState(s => ({ ...s }))
        Funciones.FNGetUsuarios(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    var usuarios = respuesta.map((valor: any) => {
                        var obj = { value: valor.usuarioID, label: valor.nombre };
                        return obj
                    });

                    usuario2 = usuarios
                    setState(s => ({ ...s, OpcionesUsuario: usuarios }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OpcionesUsuario: [] }))
                }
            })
    }

    const FnObtenerMesasCredito = () => {
        setState(s => ({ ...s, Cargando: true }))

        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                console.log(respuesta)

                //respuesta.acumulaCuenta = respuesta.acumulaCuneta.nombre
                setState(s => ({ ...s, Cargando: false, Datos: respuesta }))

            })
            .catch(error => {
                console.log("Error: ", error)
                setState(s => ({ ...s, Cargando: false, Datos: [] }))
            })
    }

    // Define the columns
    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Id',
                    selector: 'mesaCreditoId',
                    sortable: true,
                },
                {
                    name: 'Nombre',
                    selector: 'nombre',
                    sortable: true,
                },
                {
                    name: 'Clave',
                    selector: 'clave',
                    sortable: true,
                },
                {
                    name: 'Activo',
                    selector: 'activo',
                    sortable: true,
                    cell: (props) => <span title="Texto flotante">{props.activo ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
                },
                {
                    name: 'Acciones',
                    sortable: false,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            abrirModal(props)
                        }}>
                            <FaPencilAlt />
                        </button>
                },

            ]
        return colRet
        // eslint-disable-next-line
    }, [])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        toast.success(item.mensaje)
        FnObtenerMesasCredito()
        setState(state => ({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { activo: false, clave: '', nombre: '', directorMesa: {}, productos: [], analistas: [], directorId: 0, productoId: 0, analistaId: 0 } } }))
    }

    const abrirModal = (props: any) => {
        console.log(usuario2)
        console.log(props)
        let director = props.directorMesa
        // let index = usuario2.findIndex((res: any) => {
        //     return res.value === director.usuarioDirector.usuarioID
        // })
        setState(state => ({
            ...state,
            Form: {
                ...state.Form, Mostrar: true,
                Datos: {
                    activo: props.activo,
                    clave: props.clave,
                    nombre: props.nombre,
                    directorMesa: props.directorMesa,
                    productos: props.productos,
                    analistas: props.analistas,
                    directorId: director.usuarioDirector.usuarioID,
                    productoId: 0,
                    analistaId: 0
                },
                Id: props.mesaCreditoId
            }
        }))
        console.log("" + state.Form.Datos)
    }
    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => {
        console.log(item)
        toast.success(item.mensaje)
        setState(state => ({ ...state, Datos: state.Datos.map(Dato => Dato.mesaCreditoId === item.mesaCreditoId ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { activo: false, clave: '', nombre: '', directorMesa: {}, productos: [], analistas: [], directorId: 0, productoId: 0, analistaId: 0 } } }))
        FnObtenerMesasCredito()
    }
    /** funcion para cancelar la forma */
    const fnCancelar = () => {
        setState(state => ({ ...state, Form: { ...state.Form, Mostrar: false, Datos: { activo: false, clave: '', nombre: '', directorMesa: {}, productos: [], analistas: [], directorId: 0, productoId: 0, analistaId: 0 } } }))
    }

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Administrar Mesas de Credito">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {state.Cargando && <Spinner />}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar mesa de credito" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => {
                                                                setState(state => ({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } }))

                                                            }
                                                            }

                                                        ><FaPlus /></button>
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FnGetMesaCredito()}><FiRefreshCcw /></button>
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
                                        keyField={"mesaCreditoId"}
                                        defaultSortField={"mesaCreditoId"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "Editar Mesa de Crédito" : "Agregar Mesa de Crédito"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CForm
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                opcionesProducto={state.OpcionesProductos}
                                                opcionesUsuario={state.OpcionesUsuario}

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
    Seguridad: state.oidc
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(CatalogoMesaCredito)
