import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import { toast } from 'react-toastify'
import * as Funciones from './CatalogoProdMesaAclaracion/Funciones'

// Icons
import { FaCheck, FaCircle, FaClone, FaEye, FaPencilAlt, FaPlus, FaPrint, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { CForm } from './CatalogoProdMesaAclaracion/CForm'
import { boolean } from '../../../../../global/idiomaValidacion.bak'
import { bool } from 'yup'
type CatalogosType = {
    oidc: IOidc
}

const CatalogoProdMesaAclaraion = (props: CatalogosType) => {    // Controll our mounted state
    let isMounted = React.useRef(true)
    const DatosDefecto = { 
        ProductoMesaAclaracionID: 0, 
        ProductoID: 0, 
        MesaAclaracionID: 0, 
        Activo: true, 
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        TipoMesaAclaracion: [],
        Filtro: '',
        Cargando: false,
        Error: false,
        TipoProducto: [],
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        },
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

    const FNGetTipoMesaAclaracion = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetTipoMesaAclaracion(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var mesa = respuesta.map((valor: any) => {
                        var obj = { value: valor.MesaAclaracionID, label: valor.NombreMesaAclaracion };
                        return obj
                    });
                    setState(s => ({ ...s, Cargando: false, Error: false, TipoMesaAclaracion: mesa }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, TipoMesaAclaracion: [] }))
                }
            })
    }

    const FNGetTIpoProducto = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetTIpoProducto(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var prod = respuesta.map((valor: any) => {
                        var obj = { value: valor.ProductoID, label: valor.Producto };
                        return obj
                    });
                    setState(s => ({ ...s, Cargando: false, Error: false, TipoProducto: prod }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, TipoProducto: [] }))
                }
            })
    }

    const cbActualizar = (item: any) => {
        toast.success('Producto actualizado correctamente')
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.ProductoMesaAclaracionID === item.ProductoMesaAclaracionID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } })
    }

    const fnCancelar = () => setState(s => ({ ...s, Form: { Mostrar: false, Datos: DatosDefecto, Id: undefined } }))

    const cbAgregar = (item: any) => {
        toast.success('Producto agregado correctamente')
        setState({
            ...state, Datos: [...state.Datos, item],
            Form: {
                ...state.Form, Mostrar: false,
                Datos: { ...DatosDefecto, ProductoMesaAclaracionID: 0, ProductoID: 0, MesaAclaracionID: 0, Activo: true, }
            }
        })
    }

    const Columns:/*: React.useMemo(() => {
        let colRet: */ IDataTableColumn[] =
        [
            { name: 'Id', selector: 'ProductoMesaAclaracionID', sortable: true, width: '10%' },
            { name: 'Mesa Aclaración', selector: 'NombreMesaAclaracion', sortable: true, width: '35%' },
            { name: 'Tipo Producto', selector: 'Producto', sortable: true, width: '35%' },
            { name: 'Activo', selector: 'Activo', sortable: true, width: '10%', cell: (props) => <span>{props.Activo ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>},
            { name: 'Acciones', sortable: false, width: '10%',
                cell: (fila) =>
                    <button className="asstext" type={"button"} onClick={() => {
                        console.log("ANTES DE STATE ,", state.Datos)
                        setState(s => ({
                            ...s,
                            Form: {
                                Mostrar: true,
                                Datos: { ...DatosDefecto, 
                                    MesaAclaracionID: fila.MesaAclaracionID, 
                                    ProductoID: fila.ProductoID, 
                                    NombreMesaAclaracion: fila.NombreMesaAclaracion, 
                                    Producto: fila.Producto, 
                                    Activo: fila.Activo },
                                Id: fila.ProductoMesaAclaracionID
                            }
                        }))
                        console.log("DESPUES DE STATE ,", state.Datos)
                    }}>
                    <FaPencilAlt />
                </button>
            },
        ]
    /*   return colRet
  }, [state.Form]) */

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        FNGetTipoMesaAclaracion()
        FNGetTIpoProducto()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Producto Mesa de Aclaración">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        paginationComponentOptions={{ rowsPerPageText: 'Resultados por página:', rangeSeparatorText: 'of', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'Todos' }}
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
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
                                        keyField={"ProductoMesaAclaracionID"}
                                        defaultSortField={"ProductoMesaAclaracionID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar} center={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}> {state.Form.Id != null ? "Editar Producto" : "Agregar Producto"} </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                oidc={props.oidc}
                                                fnGetClientes={FNGetTipoMesaAclaracion}
                                                fnGetClientes2={FNGetTIpoProducto}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                fnCancelar={fnCancelar}
                                                cbGuardar={cbAgregar}
                                                cbActualizar={cbActualizar}
                                                options={state.TipoMesaAclaracion}
                                                options2={state.TipoProducto}
                                            ></CForm>
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
export default connect(mapStateToProps, mapDispatchToProps)(CatalogoProdMesaAclaraion);