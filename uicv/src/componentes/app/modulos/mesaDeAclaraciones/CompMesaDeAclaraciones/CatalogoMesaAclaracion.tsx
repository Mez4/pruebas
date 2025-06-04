import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import { toast } from 'react-toastify'
import * as Funciones from './CatalogoMesaAclaracion/Funciones'

// Icons
import { FaCheck, FaCircle, FaClone, FaEye, FaPencilAlt, FaPlus, FaPrint, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { CForm } from './CatalogoMesaAclaracion/CForm'
import { boolean } from '../../../../../global/idiomaValidacion.bak'
import { bool } from 'yup'
type CatalogosType = {
    oidc: IOidc
}

const CatalogoMesaAclaracion = (props: CatalogosType) => {    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = {
        MesaAclaracionID: 0,
        NombreMesaAclaracion: '',
        Clave: '',
        Activo: true,
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: false,
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

    const cbActualizar = (item: any) => {
        toast.success('Mesa de Aclaración actualiada correctamente')
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.MesaAclaracionID === item.MesaAclaracionID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } })
    }

    const fnCancelar = () => setState(s => ({ ...s, Form: { Mostrar: false, Datos: DatosDefecto, Id: undefined } }))

    const cbAgregar = (item: any) => {
        toast.success('Mesa de Aclaración agregada correctamente')
        setState({
            ...state, Datos: [...state.Datos, item],
            Form: {
                ...state.Form, Mostrar: false,
                Datos: { ...DatosDefecto, MesaAclaracionID: 0, NombreMesaAclaracion: '', Clave: '', Activo: true, }
            }
        })
    }

    const Columns:/*: React.useMemo(() => {
        let colRet: */ IDataTableColumn[] =
        [
            { name: 'Id', selector: 'MesaAclaracionID', sortable: true, width: '15%', },
            { name: 'Nombre', selector: 'NombreMesaAclaracion', sortable: true, width: '40%', },
            { name: 'Clave', selector: 'Clave', sortable: true, width: '15%', },
            { name: 'Activo', selector: 'Activo', sortable: true, width: '15%', cell: (props) => <span>{props.Activo ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span> },
            {
                name: 'Acciones',
                sortable: false,
                width: '15%',
                cell: (fila) =>
                    <button className="asstext" type={"button"} onClick={() => {
                        setState(s => ({
                            ...s,
                            Form: {
                                Mostrar: true,
                                Datos: {
                                    ...DatosDefecto,
                                    MesaAclaracionID: fila.MesaAclaracionID,
                                    NombreMesaAclaracion: fila.NombreMesaAclaracion,
                                    Clave: fila.Clave,
                                    Activo: fila.Activo
                                },
                                Id: fila.MesaAclaracionID
                            }
                        }))
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
                <Card Title="Mesa de Aclaraciones">

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
                                                            onClick={() => setState({
                                                                ...state, Form:
                                                                {
                                                                    Mostrar: true, Datos: {
                                                                        MesaAclaracionID: 0,
                                                                        NombreMesaAclaracion: '',
                                                                        Clave: '',
                                                                        Activo: true
                                                                    },
                                                                    Id: undefined
                                                                }
                                                            })}
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
                                        keyField={"MesaAclaracionID"}
                                        defaultSortField={"MesaAclaracionID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar} center={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}> {state.Form.Id != null ? "Editar mesa de aclaración" : "Agregar mesa de aclaración"} </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                cbActualizar={cbActualizar}
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
export default connect(mapStateToProps, mapDispatchToProps)(CatalogoMesaAclaracion);