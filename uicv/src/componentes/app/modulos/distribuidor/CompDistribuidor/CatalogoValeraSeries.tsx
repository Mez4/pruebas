import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import * as Funciones from './CatalogoValeraSeries/Funciones'
//import * as FnProductos from '../../creditos/CompCreditos/CreditoProducto/Funciones'
import * as FnProductos from './Vales/Funciones'
import * as FnTipos from './CatalogoValeraSeriesTipos/Funciones'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CatalogoValeraSeries/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'

type CatalogosType = {
    oidc: IOidc
}

const CatalogoValeraSeries = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { serieId: 0, serie: '', serieDesc: '', ProductoID: 0, activo: false, ValeraSeriesTiposID: 0 }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optProductos: any[] = []
    const optTipos: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        optProductos,
        optTipos,
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
                    console.log(respuesta);
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
                var sucursales = respuesta.map((valor: any) => {
                    var obj = { value: valor.ProductoID, label: "ID: "+valor.ProductoID+", " +valor.Producto + ", Empresa: " + valor.EmpresaNombre };
                    return obj
                });

                setState(s => ({ ...s, optProductos: sucursales }))
            })
            .catch(() => {
                setState(s => ({ ...s, optProductos: [] }))
            })
    }

    const FnGetTipos = () => {
        setState(s => ({ ...s }))
        FnTipos.FNGet(props.oidc)
            .then((respuesta: any) => {
                var tipos = respuesta.map((valor: any) => {
                    var obj = { value: valor.ValeraSeriesTiposID, label: valor.Tipo };
                    return obj
                });

                setState(s => ({ ...s, optTipos: tipos }))
            })
            .catch(() => {
                setState(s => ({ ...s, optTipos: [] }))
            })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Id',
                    selector: 'serieId',
                    sortable: true,
                    width: '5%',
                    cell: (props) =>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <span>
                                {props.serieId}
                            </span>
                        </div>
                },
                {
                    name: 'Serie',
                    selector: 'serie',
                    sortable: true,
                    width: '10%',
                    cell: (props) =>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <span className="badge bg-dark" style={{ fontSize: '1em', width: '5em' }}>
                                {props.serie}
                            </span>
                        </div>
                },
                {
                    name: 'Producto',
                    selector: 'producto.Producto',
                    sortable: true,
                    width: '30%',
                    cell: (props) =>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <span className="badge bg-secondary" style={{ fontSize: '1em', width: '20em' }}>
                                {props.producto.Producto}
                            </span>
                        </div>
                },
                {
                    name: 'Tipo',
                    selector: 'tipo.Tipo',
                    sortable: true,
                    width: '10%',
                    cell: (props) =>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <span className={`badge bg-${props.tipo.Tipo.includes('F') ? 'primary' : 'info'}`} style={{ fontSize: '1em', width: '5em' }}>
                                {props.tipo.Tipo}
                            </span>
                        </div>
                },
                {
                    name: 'activo',
                    selector: 'activo',
                    sortable: true,
                    width: '5%',
                    cell: (props) => <span>{props.activo ? "SI" : "No"}</span>
                },
                {
                    name: 'Descripción',
                    selector: 'serieDesc',
                    sortable: true,
                    width: '25%',
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
                                    Datos: { serieId: props.serieId, serie: props.serie, serieDesc: props.serieDesc, ProductoID: props.producto.ProductoID, activo: props.activo, ValeraSeriesTiposID: props.tipo.ValeraSeriesTiposID },
                                    Id: props.serieId
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
        FnGetProductos()
        FnGetTipos()
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
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { serieId: 0, serie: '', serieDesc: '', ProductoID: 0, activo: false, ValeraSeriesTiposID: 0 } } })
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.serieId === item.serieId ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { serieId: 0, serie: '', serieDesc: '', ProductoID: 0, activo: false, ValeraSeriesTiposID: 0 } } })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Administrar Series de Valera">
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
                                                        <input type="text" className="form-control" placeholder="Buscar series de valera" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
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
                                        keyField={"serieId"}
                                        defaultSortField={"serieId"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Agregar Serie de Valera</h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                optProductos={state.optProductos}
                                                optTipos={state.optTipos}
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
export default connect(mapStateToProps, mapDispatchToProps)(CatalogoValeraSeries);
