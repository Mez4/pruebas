import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import * as Funciones from './Inventario/Funciones'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'
import { toast } from 'react-toastify'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './Inventario/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'

type CatalogosType = {
    oidc: IOidc
}

const InventarioUniformes = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { NumeroPiezas: 1, Producto: 0 }
    const Datos: any[] = []
    const options: { value: number, label: string }[] = []
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
        Options: options
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

    const FNGetProductos = () => {
        Funciones.FNGetProducto(props.oidc)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {

                var productos = respuesta.map((valor: any) => {
                    var obj = { value: valor.ProductoUniformeID, label: valor.ProductoUniformeDesc + " - " + valor.Clave };
                    return obj
                });

                setState(s => ({ ...s, Options: productos }))

                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Options: [] }))
                // }
            })
    }


    // Define the columns
    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'InventarioID',
                    selector: 'InventarioID',
                    sortable: false,
                    center: true,
                },
                {
                    name: 'Persona',
                    selector: 'NombreCompleto',
                    sortable: false,
                    center: true,

                },
                {
                    name: 'Producto',
                    selector: 'ProductoUniformeDesc',
                    sortable: false,
                    center: true,
                },

                //NumeroPiezas
                {
                    name: 'Numero de Piezas',
                    selector: 'NumeroPiezas',
                    sortable: false,
                    center: true,

                },

                {
                    name: 'Fecha Captura',
                    selector: 'FechaCaptura',
                    sortable: false,
                    center: true,
                    cell: (row: any) => {
                        return <span className='text-center' >{row.FechaCaptura ? new Date(row.FechaCaptura).toLocaleDateString() : ''}
                        </span>
                    }
                },
                {
                    name: 'Tipo de Movimiento',
                    selector: 'TipoMov',
                    sortable: false,
                    center: true,
                    cell: (row: any) => {
                        return <span>{row.TipoMov === 'ENT' ? 'Entrada' : 'Salida'}
                        </span>
                    }
                },


            ]
        return colRet
    }, [state.Form])

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
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
        FNGetLocal()
        console.log("STATE ANTES DE AGREGAR ", state.Datos)
        toast.success('Se ha guardado correctamente')
        //Push item to the array state.Datos
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } })
        console.log(item)
        console.log("STATE DESPUES DE AGREGAR ", state.Datos)

    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => {
        toast.success('Se ha actualizado correctamente')
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.MonedaSatID === item.MonedaSatID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } })

    }
    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Resumen de movimientos de entrada y salida de uniformes">
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
                                                        <input type="text" className="form-control" placeholder="Buscar movimiento" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
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
                                        keyField={"MonedaSatID"}
                                        defaultSortField={"MonedaSatID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar} center={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Agregar movimiento</h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                options={state.Options}
                                                options2={[
                                                    { value: 'ENT', label: 'Entrada' },
                                                    { value: 'SAL', label: 'Salida' },
                                                ]} />}
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
export default connect(mapStateToProps, mapDispatchToProps)(InventarioUniformes);
