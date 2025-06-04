import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CatalogoMsjAceptadoRechazado/Funciones'
import { toast } from 'react-toastify'
import { date } from 'yup/lib/locale'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle, FaTrash } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CatalogoMsjAceptadoRechazado/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { Form } from 'formik'
import { isTemplateTail } from 'typescript'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'

type CatalogosType = {
    Seguridad: IOidc
}

const CatalogoMsjAceptadoRechazado = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        msjMotivoID: 0,
        mensaje: '',
        clave: '',
        msjError: true,
        activo: true
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []


    const [state, setState] = React.useState({
        Habilitar: true,
        Datos,
        DatosMostrar,
        Filtro: '',
        nombre: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        },

    })

    //Funcion para obtener los datos generales
    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.Seguridad)
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

    //Funcion para obtener los datos generales y cargar la pantalla
    const FNGetDatos = () => {
        setState(s => ({ ...s, Cargando: false }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: [] }))
                }
            })
    }

    //Funcion para obtener los datos de Acumula Cuenta
    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'msjMotivoID', sortable: true, },
                { name: 'Mensaje', selector: 'mensaje', sortable: true, },
                { name: 'Clave', selector: 'clave', sortable: true, },
                {
                    name: 'Mensaje de Error',
                    selector: 'msjError',
                    sortable: true,
                    cell: (props) => <span>{props.msjError ? "Mensaje de estatus rechazado" : "Mensaje de estatus aceptado"}</span>
                },
                {
                    name: 'Estatus',
                    selector: 'activo',
                    sortable: true,
                    cell: (props) => <span>{props.activo ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
                },
                {
                    name: 'Editar', sortable: false,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...s.Form, Mostrar: true,
                                    Datos: {
                                        msjMotivoID: props.msjMotivoID,
                                        mensaje: props.mensaje,
                                        clave: props.clave,
                                        msjError: props.msjError,
                                        activo: props.activo
                                    },
                                    Id: props.msjMotivoID
                                }
                            }))
                        }}>
                            <FaPencilAlt />
                        </button >
                },
            ]
        return colRet
    }, [])

    React.useEffect(() => {
        FNGetLocal()
        FNGetDatos()

        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        toast.success('El mensaje se agrego correctamente')
        setState({
            ...state, Datos: [...state.Datos, item],
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    msjMotivoID: 0,
                    mensaje: '',
                    clave: '',
                    msjError: true,
                    activo: true,
                }
            }
        })

        FNGetDatos()
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => {
        toast.success('El mensaje se actualizo correctamente')
        setState(state => ({
            ...state, Datos: state.Datos.map(Dato => Dato.msjMotivoID === item.msjMotivoID ? item : Dato),
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    msjMotivoID: 0,
                    mensaje: '',
                    clave: '',
                    msjError: true,
                    activo: true,
                }
            }
        }
        ))

        FNGetDatos()
    }

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <div className="row">
            <div className="col-12">

                <Card Title="Catalogo Mensajes Aceptados/Rechazados">
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
                                                        <input type="text" className="form-control" placeholder="Buscar mensaje" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
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
                                        keyField={"msjMotivoID"}
                                        defaultSortField={"msjMotivoID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>

                                                {state.Form.Id ? "Editar Mensaje" : "Agregar Mensaje"}

                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
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
    Seguridad: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogoMsjAceptadoRechazado)