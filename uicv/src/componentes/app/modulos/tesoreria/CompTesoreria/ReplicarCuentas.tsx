import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import * as Funciones from './ReplicarCuentas/Funciones'
import { toast } from 'react-toastify'
import { ErrorMessage, Field, Formik } from 'formik'
import { Form } from 'usetheform'



// Icons
import { FaClone, FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './ReplicarCuentas/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import ReactTooltip from 'react-tooltip'

type CatalogosType = {
    oidc: IOidc
}

const ReolicarCuentas = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = {
        NumeroCuentaPrincipal: '',
        DescripcionCuentaPrincipal: '',
        CuentaBancoID: 0,
        NumeroCuenta: '',
        DescripcionCuenta: '',
        SucursalID: 0,
        ProductoID: 0,
        TipoCuenta: '',
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const OptPrincipales: any[] = []
    const OptSucursales: any[] = []
    const OptProductos: any[] = []


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
        Funciones.FNGetPrincipales(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var principales = respuesta.map((valor: any) => {
                        var obj = { value: valor.CuentaBancariaPrincipalID, label: valor.NumeroCuenta + " - " + valor.DescripcionCuenta };
                        return obj
                    });
                    setState(s => ({ ...s, Cargando: false, Error: false, OptPrincipales: principales }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, OptPrincipales: [] }))
                }
            })
    }

    const FNGetSucursales = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetSucursales(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var principales = respuesta.map((valor: any) => {
                        var obj = { value: valor.SucursalID, label: valor.Nombre };
                        return obj
                    });
                    setState(s => ({ ...s, Cargando: false, Error: false, OptSucursales: principales }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, OptSucursales: [] }))
                }
            })
    }
    const FNGetProductos = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetProductos(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var principales = respuesta.map((valor: any) => {
                        var obj = { value: valor.ProductoID, label: valor.Producto };
                        return obj
                    });
                    setState(s => ({ ...s, Cargando: false, Error: false, OptProductos: principales }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, OptProductos: [] }))
                }
            })
    }

    const Columns: IDataTableColumn[] =
        [
            {
                name: 'Id',
                selector: 'CuentaBancoID',
                sortable: false,
                center: true,
            },
            {
                name: 'Cuenta Principal',
                selector: 'NumeroCuentaPrincipal',
                sortable: false,
                center: true,
                cell: (row: any) => <span className='text-center'>{row.NumeroCuentaPrincipal}</span>

            },
            {
                name: 'Desc Principal',
                selector: 'DescripcionCuentaPrincipal',
                sortable: false,
                center: true,
                cell: (row: any) => <span className='text-center'>{row.DescripcionCuentaPrincipal}</span>
            },
            {
                name: 'Numero de Cta',
                selector: 'NumeroCuenta',
                sortable: false,
                center: true,
                cell: (row: any) => <span className='text-center'>{row.NumeroCuenta}</span>
            },
            {
                name: 'Descripcion',
                selector: 'DescripcionCuenta',
                sortable: false,
                center: true,
                cell: (row: any) => <span className='text-center'>{row.DescripcionCuenta}</span>
            },
            {
                name: 'Sucursal',
                selector: 'sucursal',
                sortable: false,
                center: true,
                cell: (row: any) => <span className='text-center'>{row.sucursal}</span>
            },
            {
                name: 'Producto',
                selector: 'Producto',
                sortable: false,
                center: true,
                cell: (row: any) => <span className='text-center'>{row.Producto}</span>

            },
            {
                name: 'Es Boveda',
                selector: 'EsBoveda',
                sortable: false,
                center: true,
                cell: (row: any) => <span className='text-center'>{row.EsBoveda ? 'Si' : 'No'}</span>
            },
            {
                name: 'Acciones',
                sortable: false,
                center: true,
                cell: (props) =>
                    <button data-tip data-for="TT1" className="asstext" type={"button"} onClick={() => {
                        console.log("PROPS ,", props)
                        setState(s => ({
                            ...s,
                            Form: {
                                ...state.Form,
                                Mostrar: true,
                                Datos:
                                {
                                    NumeroCuentaPrincipal: props.NumeroCuentaPrincipal,
                                    DescripcionCuentaPrincipal: props.DescripcionCuentaPrincipal,
                                    CuentaBancoID: props.CuentaBancoID,
                                    NumeroCuenta: props.NumeroCuenta,
                                    DescripcionCuenta: props.DescripcionCuenta,
                                    SucursalID: props.sucursalId,
                                    ProductoID: props.ProductoID,
                                    TipoCuenta: props.TipoCuenta,
                                },
                                Id: props.CuentaBancoID
                            }
                        }))
                    }}>
                        <FaClone />
                        <ReactTooltip
                            id="TT1"
                            type="info"
                            effect="solid"
                            clickable
                            globalEventOff="click"
                        >
                            Replicar cuenta
                        </ReactTooltip>
                    </button>
            },
        ]

    React.useEffect(() => {
        FNGetPrincipal()
        FNGetSucursales()
        FNGetProductos()
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
        toast.success('La cuenta se agrego correctamente')

        setState({
            ...state, Datos: [...state.Datos, item], Form: {
                ...state.Form, Mostrar: false, Datos: {
                    NumeroCuentaPrincipal: '',
                    DescripcionCuentaPrincipal: '',
                    CuentaBancoID: 0,
                    NumeroCuenta: '',
                    DescripcionCuenta: '',
                    SucursalID: 0,
                    ProductoID: 0,
                    TipoCuenta: '',
                }
            }
        })
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => {

        setState({
            ...state, Datos: state.Datos.map(Dato => Dato.TipoID === item.TipoID ? item : Dato), Form: {
                ...state.Form, Mostrar: false, Datos: {
                    NumeroCuentaPrincipal: '',
                    DescripcionCuentaPrincipal: '',
                    CuentaBancoID: 0,
                    NumeroCuenta: '',
                    DescripcionCuenta: '',
                    SucursalID: 0,
                    ProductoID: 0,
                    TipoCuenta: '',
                }
            }
        })
        toast.success('La cuenta se actualizó correctamente')
    }


    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({
        ...state, Form: {
            ...state.Form, Mostrar: false, Datos: {
                NumeroCuentaPrincipal: '',
                DescripcionCuentaPrincipal: '',
                CuentaBancoID: 0,
                NumeroCuenta: '',
                DescripcionCuenta: '',
                SucursalID: 0,
                ProductoID: 0,
                TipoCuenta: '',
            }
        }
    })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Replicar cuentas">
                    <Card.Body>
                        <Card.Body.Content>
                            <Formik
                                initialValues={state.Datos}
                                enableReinitialize
                                onSubmit={(values: any) => {
                                }}>
                                <Form>
                                    <div className='container'>
                                        <div className="columns is-centered is-mobile is-multiline">
                                            <div className="column text-center is-one-third-desktop is-half-mobile">
                                                <br />
                                                <label className="form-label mb-0" htmlFor={"CuentaBancariaPrincipalID"}>Selecciona una cuenta principal: </label>                                            </div>


                                            <div className="column text-center is-one-third-desktop is-half-mobile">

                                                <div className="mb-3">
                                                    <br />
                                                    {/*                                                   <label className="form-label mb-0" htmlFor={"CuentaBancariaPrincipalID"}>Cuentas Principales</label>
 */}                                                    <Field name={"CuentaBancariaPrincipalID"} className="form-select"  >
                                                        {(control: any) => (
                                                            <select
                                                                className="form-select"
                                                                //options={state.optCuentas}                                                                  
                                                                value={control.field.value}
                                                                onChange={(value: any) => {
                                                                    //IF > 0
                                                                    if (value.target.value > 0) {
                                                                        setState(s => ({ ...s, CuentaBancariaPrincipalID: value.target.value }))
                                                                        FNGetLocal(value.target.value)
                                                                    }
                                                                    else {
                                                                        setState(s => ({ ...s, CuentaBancariaPrincipalID: 0, Datos: [] }))
                                                                    }

                                                                }}
                                                                disabled={false}
                                                                id={"CuentaBancariaPrincipalID"}
                                                                name={"CuentaBancariaPrincipalID"}
                                                            >
                                                                <option value="0">{"Selecciona un periodo"}</option>
                                                                {state.OptPrincipales.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}

                                                            </select>

                                                        )}
                                                    </Field>
                                                    <ErrorMessage component="div" name={"CuentaBancariaPrincipalID"} className="text-danger" />
                                                </div>

                                            </div>


                                            <div className="column text-center is-full-desktop is-one-third-desktop">
                                                <br />
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <div className="input-group mb-3">
                                                            <input type="text" className="form-control" placeholder="Buscar tipo de cuenta" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                            <span className="input-group-text"><FaSearch /> </span>
                                                            {/*  <button className="btn btn-outline-secondary" type="button"
                                                                onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                                            ><FaPlus /></button> */}
                                                            <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal(state.CuentaBancariaPrincipalID)}><FiRefreshCcw /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                    </div>
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
                                            <h5 className={MODAL_TITLE_CLASS}>Replicar cuenta</h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                OptSucursales={state.OptSucursales}
                                                OptProductos={state.OptProductos}
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
export default connect(mapStateToProps, mapDispatchToProps)(ReolicarCuentas);