import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import { toast } from 'react-toastify'
import * as Funciones from './CatalogoAnalistaSucursal/Funciones'
import moment from 'moment'
import { FaCheck, FaCircle, FaClone, FaEye, FaPencilAlt, FaPlus, FaPrint, FaSearch } from 'react-icons/fa'
import { Card, CustomSelect, Spinner } from '../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { CForm } from './CatalogoAnalistas/CForm'
import { boolean } from '../../../../../global/idiomaValidacion.bak'
import { bool } from 'yup'
import { FNGetMesaAclaracion } from './CatalogoSucursalMesa/Funciones'
import { Formik } from 'formik'
import { CFormAnalistaSucursal } from './CatalogoAnalistaSucursal/CForm'
type CatalogosType = {
    oidc: IOidc
}
const CatalogoAnalistaSucursal = (props: CatalogosType) => {    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefectoCForm = {
        AnalistaID: 0,
        SucursalID: 0,
        Nombre: '',
        Sucursales: [
            {
                Estatus: 0,
                AnalistaID: 0,
                SucursalID: 0,
                Nombre: '',
            }
        ]
    }

    const Datos: any[] = []
    const DatosCopia: any[] = []
    const DatosMostrar: any[] = []
    const SucursalesRow: any[] = []
    const OptionSucursal: any[] = []
    const OptionsAnalistas: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        DatosCopia,
        SucursalesRow,
        TipoMesaAclaracion: [],
        Filtro: '',
        Cargando: false,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefectoCForm,
            Id: undefined
        },
        OptionSucursal,
        OptionsAnalistas
    })

    const cbAgregarSucursalLocal = (item: any) => {
        if (state.Form.Datos.Sucursales.find(x => x.SucursalID === item.SucursalID && (x.Estatus == 4 || x.Estatus == 3))) {
            const index = state.Form.Datos.Sucursales.findIndex(x => x.SucursalID === item.SucursalID)
            state.Form.Datos.Sucursales[index].Estatus = 2
            setState({ ...state, Form: state.Form })
            return
        }
        if (state.Form.Datos.Sucursales.find(x => x.SucursalID === item.SucursalID)) {
            toast.warning("Ya existe la sucursal")
            return
        }
        state.Form.Datos.Sucursales.push(item)
        setState({ ...state, Form: state.Form })
    }

    const cbEliminarSucursalLocal = (item: any) => {
        //Find index of item.SucursalID
        const index = state.Form.Datos.Sucursales.findIndex(x => x.SucursalID === item.SucursalID)
        state.Form.Datos.Sucursales[index].Estatus = 3
        setState({ ...state, Form: state.Form })
    }

    const cbFilaModificada = (item: any) => {
        const index = state.Form.Datos.Sucursales.findIndex(x => x.SucursalID === item.SucursalID)
        state.Form.Datos.Sucursales[index].Estatus = 4
        setState({ ...state, Form: state.Form })
    }


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

    const FNGetAnalistaSelect = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FnGetAnalistaSelect(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var sucursales = respuesta.map((valor: any) => {
                        var obj = { value: valor.AnalistaID, label: valor.NombreCompleto };
                        return obj
                    });
                    setState(s => ({ ...s, Cargando: false, Error: false, OptionsAnalistas: sucursales }))

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, OptionsAnalistas: [] }))
                }
            })
    }


    const FNGetSucursales = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetSucursales(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var sucursales = respuesta.map((valor: any) => {
                        var obj = { value: valor.SucursalID, label: valor.Nombre };
                        return obj
                    });
                    setState(s => ({ ...s, Cargando: false, Error: false, OptionSucursal: sucursales }))

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, OptionSucursal: [] }))
                }
            })
    }

    //Funcion para obtener los datos de Usuario

    const cbActualizar = () => {
        toast.success('Analista actualizado correctamente')
        setState({ ...state, Form: { ...state.Form, Mostrar: false, } })
        FNGetLocal();
        FNGetAnalistaSelect();
        FNGetSucursales();
    }

    const fnCancelarModal = () => {
        FNGetLocal();
        setState({ ...state, Form: { ...state.Form, Mostrar: false, } })
    }


    const Columns: IDataTableColumn[] =
        [
            {
                name: 'Id',
                selector: 'AnalistaID',
                sortable: false,
                center: true,
            },
            {
                name: 'Nombre',
                selector: 'NombreCompleto',
                sortable: false,
                center: true,
            },
            {
                name: 'Fecha Registró',
                selector: 'FechaRegistro',
                sortable: false,
                center: true,
                cell: props => <div> {formatearFecha(props.FechaRegistro)} </div>
            },
            {
                name: 'Acciones',
                sortable: false,
                center: true,
                cell: (row) =>
                    <button className="asstext" type={"button"} onClick={() => {
                        setState({
                            ...state,
                            Form: {
                                ...state.Form,
                                Mostrar: true,
                                Id: row.Sucursales.length > 0 ? row.Sucursales[0].AnalistaID : undefined,
                                Datos: {
                                    ...state.Form.Datos,
                                    Nombre: row.NombreCompleto,
                                    Sucursales: row.Sucursales,
                                }
                            }
                        })
                    }}>
                        <FaPencilAlt />
                    </button>
            },
        ]


    const ColumnSucursales: IDataTableColumn[] =
        [
            {
                name: 'Id',
                selector: 'SucursalID',
                sortable: false,
                center: true,
            },
            {
                name: 'Nombre',
                selector: 'Nombre',
                sortable: false,
                center: true,
            },
            {
                name: 'Acciones',
                sortable: false,
                center: true,
                cell: (row) =>
                    <button className="asstext" type={"button"} onClick={() => {

                    }}>
                        <FaPencilAlt />
                    </button>
            },
        ]

    function formatearFecha(FechaRegistro) {
        return moment(FechaRegistro).format("DD/MM/YYYY HH:MM")
    }
    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        FNGetSucursales()
        FNGetAnalistaSelect()
        return () => {
            isMounted.current = false
        }
    }, [])

    const RefreshAll = () => {
        FNGetLocal();
        FNGetSucursales();
        FNGetAnalistaSelect();
    }

    const cbAgregar = () => {
        toast.success('Analista agregado correctamente')
        setState({ ...state, Form: { ...state.Form, Mostrar: false, } })
        FNGetLocal();
        FNGetAnalistaSelect();
        FNGetSucursales();
    }
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
    }, [state.Datos, state.Filtro])
    return (
        <div className="row">
            <div className="col-12">
                <Card Title={"ANALISTAS / SUCURSAL"}>
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
                                                        <input type="text" className="form-control" placeholder="Buscar Analista" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({
                                                                ...state, Form: {
                                                                    Mostrar: true, Id: undefined, Datos: {
                                                                        ...state.Form.Datos,
                                                                        AnalistaID: 0,
                                                                        SucursalID: 0,
                                                                        Sucursales: []

                                                                    }
                                                                }
                                                            })}
                                                        ><FaPlus /></button>
                                                        <button className="btn btn-outline-secondary" type="button" onClick={(e) => RefreshAll()}><FiRefreshCcw /></button>
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
                                        keyField={"AnalistaID"}
                                        defaultSortField={"AnalistaID"}
                                        columns={Columns} />

                                    <ModalWin open={state.Form.Mostrar} center={true} large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "EDITAR SUCURSAL ANALISTA" : "AGREGAR SUCURSAL ANALISTA"}
                                            </h5>
                                            <button type="button" className="delete" onClick={() => {
                                                setState({ ...state, Form: { ...state.Form, Mostrar: false } })
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormAnalistaSucursal
                                                cbAgregarSucursalLocal={cbAgregarSucursalLocal}
                                                cbEliminarSucursalLocal={cbEliminarSucursalLocal}
                                                cbFilaModificada={cbFilaModificada}
                                                Seguridad={props.oidc}
                                                Id={state.Form.Id}
                                                options={state.OptionSucursal}
                                                optionsAnalistas={state.OptionsAnalistas}
                                                fnCancelar={fnCancelarModal}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                initialValues={state.Form.Datos}

                                            ></CFormAnalistaSucursal>


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
export default connect(mapStateToProps, mapDispatchToProps)(CatalogoAnalistaSucursal);