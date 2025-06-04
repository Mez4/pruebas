import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from '../CompTesoreria/MovimientosAgrupa/Funciones'
import { toast } from 'react-toastify'
import { date } from 'yup/lib/locale'

import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle, FaTrash } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from '../CompTesoreria/MovimientosAgrupa/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { Form } from 'formik'
import { classicNameResolver, isTemplateTail } from 'typescript'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'

type CatalogosType = {
    Seguridad: IOidc
}

const CatalogoAgrupaMovimientos = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        movAgrupaId: 0,
        clave: '',
        nombre: '',
        estatus: true
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

    //Funcion para pintar la pantalla principal
    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'movAgrupaId', sortable: true, },
                { name: 'Clave', selector: 'clave', sortable: true, },
                { name: 'Nombre', selector: 'nombre', sortable: true, },
                {
                    name: 'Estatus',
                    selector: 'estatus',
                    sortable: true,
                    cell: (props) => <span>{props.estatus ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
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
                                        movAgrupaId: props.movAgrupaId,
                                        clave: props.clave,
                                        nombre: props.nombre,
                                        estatus: props.estatus,
                                    },
                                    Id: props.movAgrupaId

                                }
                            }))
                        }}>
                            <FaPencilAlt />
                        </button>
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
    }, [props.Seguridad])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */

    const cbAgregar = (item: any) => {
        toast.success('El movimiento se agrego correctamente')
        setState({
            ...state, Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    movAgrupaId: 0,
                    clave: '',
                    nombre: '',
                    estatus: true,
                }
            }
        })

        FNGetDatos()
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => {
        toast.success('El movimiento se actualizo correctamente')
        setState(state => ({
            ...state, Datos: state.Datos.map(Dato => Dato.movAgrupaId === item.movAgrupaId ? item : Dato),
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    movAgrupaId: 0,
                    clave: '',
                    nombre: '',
                    estatus: true
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

                <Card Title="Agrupación de movimientos">
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
                                                        <input type="text" className="form-control" placeholder="Buscar Movimiento" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
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
                                        keyField={"movAgrupaId"}
                                        defaultSortField={"movAgrupaId"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar} center={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>

                                                {state.Form.Id ? "Editar Movimiento Agrupado" : "Agregar Movimiento Agrupado"}

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

export default connect(mapStateToProps, mapDispatchToProps)(CatalogoAgrupaMovimientos)