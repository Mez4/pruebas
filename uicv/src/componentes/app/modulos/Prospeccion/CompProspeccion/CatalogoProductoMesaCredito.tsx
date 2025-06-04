import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import * as Funciones from './CatalogoProductoMesaCredito/Funciones'

//import * as FnCatTipoDocumento from '../../catalogos/CompCatalogos/CatalogoProductoMesaCredito/Funciones'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CatalogoProductoMesaCredito/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { PropsNotForwarded } from '../../../../../node_modules_local/react-csv/lib/metaProps'

type CatalogosType = {
    oidc: IOidc
}

const CatalogoProductoMesaCredito = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { ProductoMesaCreditoID: 0, MesaCreditoID: 0, ProductoID: 0, Activo: false }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optProdMesa: any[] = []
    const optProductos: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        optProdMesa,
        optProductos,
        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        }
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

    const FnGetMesaCredito = () => {
        setState(s => ({ ...s }))
        Funciones.FnGetMesaCredito(props.oidc)
            .then((respuesta: any) => {
                var sucursales = respuesta.map((valor: any) => {
                    var obj = { value: valor.MesaCreditoID, label: valor.Nombre };
                    return obj

                });

                setState(s => ({ ...s, optProdMesa: sucursales }))
            })
            .catch(() => {
                setState(s => ({ ...s, optProdMesa: [] }))
            })
    }

    const FnGetProductos = () => {
        setState(s => ({ ...s }))
        Funciones.FnGetProductos(props.oidc)
            .then((respuesta: any) => {
                var sucursales = respuesta.map((valor: any) => {
                    var obj = { value: valor.ProductoID, label: `ID: ${valor.ProductoID} - ${valor.Producto}`};
                    return obj

                });

                setState(s => ({ ...s, optProductos: sucursales }))
            })
            .catch(() => {
                setState(s => ({ ...s, optProductos: [] }))
            })
    }



    const Columns = React.useMemo(() => {

        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Id',
                    selector: 'ProductoMesaCreditoID',
                    sortable: true,
                },
                {
                    name: 'Mesa Credito',
                    selector: 'mesaCredito.MesaCreditoID',
                    sortable: true,
                    cell: (props) =>

                        <span >
                            {props.mesaCredito.Nombre}
                        </span>
                },
                {
                    name: 'Producto',
                    selector: 'producto.ProductoID',
                    sortable: true,
                    cell: (props) =>

                        <span >
                            {props.producto.Producto}
                        </span>
                },
                {
                    name: 'Activo',
                    selector: 'Activo',
                    sortable: true,
                    cell: (props) => <span>{props.Activo ? "SI" : "No"}</span>
                },
                {
                    name: 'Acciones',
                    sortable: false,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...state.Form, Mostrar: true,
                                    Datos: { ProductoMesaCreditoID: props.ProductoMesaCreditoID, MesaCreditoID: props.mesaCredito.MesaCreditoID, ProductoID: props.producto.ProductoID, Activo: props.Activo },
                                    Id: props.ProductoMesaCreditoID,

                                }
                            }))
                        }}>
                            <FaPencilAlt />
                        </button>
                },
            ]
        return colRet
    }, [state.Form])

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        FnGetMesaCredito()
        FnGetProductos()
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

    // /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { ProductoMesaCreditoID: 0, MesaCreditoID: -1, ProductoID: -1, Activo: false } } })
    }

    // /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.ProductoMesaCreditoID === item.ProductoMesaCreditoID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { ProductoMesaCreditoID: 0, MesaCreditoID: 0, ProductoID: 0, Activo: false } } })
    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Administrar Productos">
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
                                                        <input type="text" className="form-control" placeholder="Buscar Producto" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                                        ><FaPlus /></button>
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
                                        keyField={"ProductoMesaCreditoID"}
                                        defaultSortField={"ProductoMesaCreditoID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Agregar Tipo Documento</h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                optTiposDoc={state.optProdMesa}
                                                optTiposDoc2={state.optProductos}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                cbActualizar={cbActualizar}
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
export default connect(mapStateToProps, mapDispatchToProps)(CatalogoProductoMesaCredito);
