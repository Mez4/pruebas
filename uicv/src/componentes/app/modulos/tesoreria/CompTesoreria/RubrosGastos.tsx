import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect, useSelector } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import * as Funciones from './RubrosGastos/Funciones'
import { toast } from 'react-toastify'
import { ErrorMessage, Field, Formik } from 'formik'
import { Form } from 'usetheform'
import { iUI } from '../../../../../interfaces/ui/iUI'


// Icons
import { FaCircle, FaClone, FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './RubrosGastos/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import ReactTooltip from 'react-tooltip'

type CatalogosType = {
    pds: iUI,
    oidc: IOidc
}

const RubrosGastos = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = {
        RubroGastosID: 0,
        Clave: '',
        Descripcion: '',
        Activo: false,
        RegistraID: 0,
        AfectaUtilidad: false,
        GastoCorporativo: false,
        Cargo: false,
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const OptPrincipales: any[] = []
    const OptSucursales: any[] = []
    const OptProductos: any[] = []
    const OptionsUsuario: any[] = []





    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        CuentaBancariaPrincipalID: 0,
        OptPrincipales,
        OptSucursales,
        OptProductos,
        OptionsUsuario,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        }
    })


    const FNGetLocal = (id: any) => {
        setState(s => ({ ...s, Cargando: true }))

        Funciones.FNGet(props.oidc, id)
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

    const FNGetPrincipal = () => {
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




    const Columns: IDataTableColumn[] =
        [
            {
                name: 'Id',
                selector: 'RubroGastosID',
                sortable: false,
                center: true,
            },
            {
                name: 'Clave',
                selector: 'Clave',
                sortable: false,
                center: true,
                cell: (row: any) => <span className='text-center'>{row.Clave}</span>

            },
            {
                name: 'Descripcion',
                selector: 'Descripcion',
                sortable: false,
                center: true,
                cell: (row: any) => <span className='text-center'>{row.Descripcion}</span>

            }, {
                name: 'Activo',
                selector: 'Activo',
                sortable: false,
                center: true,
                cell: (props) => <span>{props.Activo ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>

            }, {
                name: 'Usuario Registra',
                selector: 'Nombre',
                sortable: false,
                center: true,
                cell: (row: any) => <span className='text-center'>{row.Nombre}</span>

            }, {
                name: 'AfectaUtilidad',
                selector: 'AfectaUtilidad',
                sortable: false,
                center: true,
                cell: (row: any) => <span className='text-center'>{row.AfectaUtilidad ? <span>Si</span> : <span>No</span>}</span>

            },
            {
                name: 'Gasto Corporativo',
                selector: 'GastoCorporativo',
                sortable: false,
                center: true,
                cell: (row: any) => <span className='text-center'>{row.GastoCorporativo ? <span>Si</span> : <span>No</span>}</span>

            },
            {
                name: 'Factor',
                selector: 'Factor',
                sortable: false,
                center: true,
                cell: (row: any) => <span className='text-center'>{row.Factor}</span>

            },

            {
                name: 'Acciones',
                sortable: false,
                center: true,
                cell: (propss) =>
                    <button data-tip data-for="TT1" className="asstext" type={"button"} onClick={() => {
                        console.log("PROPS CLICK , ", props.pds.Producto?.ProductoID)
                        setState(s => ({
                            ...s,
                            Form: {
                                ...state.Form,
                                Mostrar: true,
                                Datos:
                                {
                                    RubroGastosID: propss.RubroGastosID,
                                    Clave: propss.Clave,
                                    Descripcion: propss.Descripcion,
                                    Activo: propss.Activo,
                                    RegistraID: propss.RegistraID,
                                    AfectaUtilidad: propss.AfectaUtilidad,
                                    GastoCorporativo: propss.GastoCorporativo,
                                    Cargo: propss.Cargo,
                                },
                                Id: propss.RubroGastosID
                            }
                        }))
                    }}>
                        <FaPencilAlt />
                        <ReactTooltip
                            id="TT1"
                            type="info"
                            effect="solid"
                            clickable
                            globalEventOff="click"
                        >
                            Editar rubro
                        </ReactTooltip>
                    </button>
            },
        ]

    React.useEffect(() => {
        FNGetPrincipal()

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

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        toast.success('El rubro se agregó correctamente')

        setState({
            ...state, Datos: [...state.Datos, item], Form: {
                ...state.Form, Mostrar: false, Datos: {
                    RubroGastosID: 0,
                    Clave: '',
                    Descripcion: '',
                    Activo: true,
                    RegistraID: 0,
                    AfectaUtilidad: false,
                    GastoCorporativo: false,
                    Cargo: false,
                }
            }
        })
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => {

        setState({
            ...state, Datos: state.Datos.map(Dato => Dato.RubroGastosID === item.RubroGastosID ? item : Dato), Form: {
                ...state.Form, Mostrar: false, Datos: {
                    RubroGastosID: 0,
                    Clave: '',
                    Descripcion: '',
                    Activo: true,
                    RegistraID: 0,
                    AfectaUtilidad: false,
                    GastoCorporativo: false,
                    Cargo: false,

                }
            }
        })
        toast.success('El rubro se actualizó correctamente')
    }


    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({
        ...state, Form: {
            ...state.Form, Mostrar: false, Datos: {
                RubroGastosID: 0,
                Clave: '',
                Descripcion: '',
                Activo: false,
                RegistraID: 0,
                AfectaUtilidad: false,
                GastoCorporativo: false,
                Cargo: false,
            }
        }
    })

    const FnGetUsuario = (Nombre: string, callback: any) => {

        let Datos = {
            Nombre: Nombre
        }
        setState(s => ({ ...s }))
        Funciones.FNGetUsuariosPOST(props.oidc, Datos)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var usuario = respuesta.map((valor: any) => {
                        var username = valor.nombre + ' ' + valor.apellidoPaterno + ' ' + valor.apellidoMaterno
                        var obj = { value: valor.personaID, label: username, usuarioId: valor.usuarioID };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsUsuario: usuario }))
                    callback(usuario)

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsUsuario: [] }))
                    callback([])
                }
            })
    }

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Gastos Rubros">
                    <Card.Body>
                        <Card.Body.Content>
                            <Formik
                                initialValues={state.Datos}
                                enableReinitialize
                                onSubmit={(values: any) => {
                                }}>
                                <Form>

                                </Form>
                            </Formik>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        paginationComponentOptions={{ rowsPerPageText: 'Resultados por página:', rangeSeparatorText: 'of', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'Todos' }}
                                        subHeader
                                        noDataComponent={
                                            <div className="text-center">
                                                Selecciona una cuenta
                                            </div>
                                        }
                                        subHeaderComponent={
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar tipo de cuenta" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                                        ><FaPlus /></button>
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal(state.CuentaBancariaPrincipalID)}><FiRefreshCcw /></button>
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
                                        keyField={"CuentaBancoID"}
                                        defaultSortField={"CuentaBancoID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar} large={true} center={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "Editar rubro" : "Agregar rubro"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                fnGetClientes={FnGetUsuario}
                                                options={state.OptionsUsuario}
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
    oidc: state.oidc,
    pds: state.UI
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(RubrosGastos);