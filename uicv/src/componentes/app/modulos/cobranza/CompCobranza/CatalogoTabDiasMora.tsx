import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

import * as Funciones from './CatalogoTabDiasMora/Funciones'
import * as FnProductos from '../../creditos/CompCreditos/CreditoProducto/Funciones'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'

import { FiltrarDatos } from '../../../../../global/functions'
import { CForm } from './CatalogoTabDiasMora/CForm'
import { number } from '../../../../../global/idiomaValidacion.bak'
import { useParams, Link } from 'react-router-dom'



type CatalogosType = {
    oidc: IOidc
}

const CatalogoTabDiasMora = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { idTabMora: 0, ProductoID: 0, limInferiorDias: 0, limSuperiorDias: 0, diasMoraCartera: 0, Activo: true }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optProductos: any[] = []
    const [state, setState] = React.useState({
        Datos,
        optProductos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Final: '',
        idTabMora: '',
        Identificador: 0,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        }
    })

    type paramType = { id: string, productoId: string }
    let { id } = useParams<paramType>()
    let { productoId } = useParams<paramType>()
    let ProductoID: number = parseInt(productoId as string)



    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc, ProductoID)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    console.log(respuesta);
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch((error) => {
                console.log("###e", error)
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const FNSiguiente = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetSiguiente(props.oidc, ProductoID)
            .then((respuesta: any) => {
                //console.log(respuesta.limSuperiorDiasSiguiente)
                setState(s => ({
                    ...s, Identificador: 2,
                    Form: {
                        ...state.Form, Mostrar: true,
                        Datos: { idTabMora: 0, ProductoID: 0, limInferiorDias: respuesta.limSuperiorDiasSiguiente, limSuperiorDias: 0, diasMoraCartera: 0, Activo: true },
                    }
                }))
            })
            .catch(() => {
                setState(s => ({ ...s }))
            })
    }

    // const FnGetProductos = () => {
    //     setState(s => ({ ...s }))
    //     FnProductos.FNGet(props.oidc)
    //         .then((respuesta: any) => {
    //             var productos = respuesta.map((valor: any) => {
    //                 var obj = { value: valor.ProductoID, label: valor.Producto };
    //                 return obj
    //             });

    //             setState(s => ({ ...s, optProductos: productos }))
    //         })
    //         .catch(() => {
    //             setState(s => ({ ...s, optProductos: [] }))
    //         })
    // }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Id',
                    selector: 'idTabMora',
                    sortable: true,
                },

                //  {
                //     name: 'Producto',
                //     selector: 'producto',
                //     sortable: true, 
                //     cell: (props) => 
                //     <span>
                //      {props.producto.Producto}  
                //     </span>     
                // },

                {
                    name: 'Límite Inferior Días',
                    selector: 'limInferiorDias',
                    sortable: true,
                    center: true,
                },

                {
                    name: 'Límite Superior Días',
                    selector: 'limSuperiorDias',
                    sortable: true,
                    center: true,
                },

                {
                    name: 'Días Mora Cartera',
                    selector: 'diasMoraCartera',
                    sortable: true,
                    center: true,
                },

                {
                    name: 'Activo',
                    selector: 'Activo',
                    sortable: true,
                    center: true,
                    cell: (props) => <span>{props.Activo ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
                },
                {
                    name: 'Acciones',
                    sortable: false,
                    center: true,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s, Identificador: 1,
                                Form: {
                                    ...state.Form, Mostrar: true,
                                    Datos: { idTabMora: props.idTabMora, ProductoID: props.ProductoID, limInferiorDias: props.limInferiorDias, limSuperiorDias: props.limSuperiorDias, diasMoraCartera: props.diasMoraCartera, Activo: props.Activo },
                                    Id: props.idTabMora
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
        // FnGetProductos()
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
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { idTabMora: 0, ProductoID: 0, limInferiorDias: 0, limSuperiorDias: 0, diasMoraCartera: 0, Activo: false } } })
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.idTabMora === item.idTabMora ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { idTabMora: 0, ProductoID: 0, limInferiorDias: 0, limSuperiorDias: 0, diasMoraCartera: 0, Activo: false } } })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="TABULADOR DÍAS MORA">
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
                                                        <input type="text" className="form-control" placeholder="Buscar Tabulador" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            // onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined, } })}
                                                            onClick={() => FNSiguiente()}
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
                                        keyField={"idTabMora"}
                                        defaultSortField={"idTabMora"}
                                        columns={Columns}
                                    />

                                    <ModalWin open={state.Form.Mostrar} center>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>AGREGAR/ACTUALIZAR</h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                FNGetLocal={FNGetLocal}
                                                Identificador={state.Identificador}
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
export default connect(mapStateToProps, mapDispatchToProps)(CatalogoTabDiasMora);
