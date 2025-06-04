import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import { toast } from 'react-toastify'
import * as Funciones from './CatalogoAnalistas/Funciones'
import moment from 'moment'

// Icons
import { FaCheck, FaCircle, FaClone, FaEye, FaPencilAlt, FaPlus, FaPrint, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { CForm } from './CatalogoAnalistas/CForm'
import { boolean } from '../../../../../global/idiomaValidacion.bak'
import { bool } from 'yup'
import { FNGetMesaAclaracion } from './CatalogoSucursalMesa/Funciones'
type CatalogosType = {
    oidc: IOidc
}
const CatalogoAnalistas = (props: CatalogosType) => {    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = {
        AnalistaID: 0,
        NombreCompleto: '',
        MesaAclaracionID: 0,
        Activo: true,
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const OptionsUsuario: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        TipoMesaAclaracion: [],
        Filtro: '',
        Cargando: false,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        },
        OptionsUsuario,
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
    //Funcion para obtener los datos de Usuario
    const FnGetPersona = (Nombre: string, callback: any) => {
        let Datos = {
            Nombre: Nombre
        }
        setState(s => ({ ...s }))
        Funciones.FNGetPersona(props.oidc, Datos)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var persona = respuesta.map((valor: any) => {
                        var obj = { value: valor.PersonaID, label: valor.NombreCompleto, PersonaID: valor.PersonaID };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsUsuario: persona }))
                    callback(persona)
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsUsuario: [] }))
                    callback([])
                }
            })
    }
    const cbActualizar = (item: any) => {
        toast.success('Analista actualizado correctamente')
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.AnalistaID === item.AnalistaID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } })

    }
    const fnCancelar = () => {
        // FNGetLocal();
        setState(s => ({ ...s, Form: { Mostrar: false, Datos: DatosDefecto, Id: undefined } }))
    }
    const cbAgregar = (item: any) => {
        toast.success('Analista agregado correctamente')
        setState({
            ...state, Datos: [...state.Datos, item],
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    ...DatosDefecto,
                    AnalistaID: 0,
                    MesaAclaracionID: 0,
                    Activo: true,
                }
            }
        })
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
                name: 'Activo',
                selector: 'Activo',
                sortable: false,
                center: true,
                cell: (props) => <span className='text-center'>{props.Activo ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
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
                cell: (props) =>
                    <button className="asstext" type={"button"} onClick={() => {
                        console.log("ANTES DE STATE ,", state.Datos);
                        setState(s => ({
                            ...s,
                            Form: {
                                Mostrar: true,
                                Datos:
                                {
                                    ...DatosDefecto,
                                    AnalistaID: props.AnalistaID,
                                    MesaAclaracionID: props.MesaAclaracionID,
                                    NombreCompleto: props.NombreCompleto,
                                    NombreMesaAclaracion: props.NombreMesaAclaracion,
                                    Activo: props.Activo
                                },
                                Id: props.AnalistaID
                            }
                        }))
                        console.log("DESPUES DE STATE ,", props.AnalistaID);
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
        FNGetTipoMesaAclaracion()
        return () => {
            isMounted.current = false
        }
    }, [])
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
    }, [state.Datos, state.Filtro])
    return (
        <div className="row">
            <div className="col-12">
                <Card Title="ANALISTAS">
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
                                        keyField={"AnalistaID"}
                                        defaultSortField={"AnalistaID"}
                                        columns={Columns} />
                                    <ModalWin open={state.Form.Mostrar} center={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "EDITAR ANALISTA" : "AGREGAR ANALISTA"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                fnGetClientes={FnGetPersona}
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                fnCancelar={fnCancelar}
                                                cbGuardar={cbAgregar}
                                                cbActualizar={cbActualizar}
                                                options={state.TipoMesaAclaracion}
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
    oidc: state.oidc
})
const mapDispatchToProps = {
}
export default connect(mapStateToProps, mapDispatchToProps)(CatalogoAnalistas);