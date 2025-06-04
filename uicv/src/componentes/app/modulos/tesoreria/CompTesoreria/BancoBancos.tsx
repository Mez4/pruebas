import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './BancoBancos/Funciones'
import { toast } from 'react-toastify'
import { date } from 'yup/lib/locale'

import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle, FaTrash } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './BancoBancos/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { Form } from 'formik'
import { isTemplateTail } from 'typescript'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import { iUI } from '../../../../../interfaces/ui/iUI'

type CatalogosType = {
    Seguridad: IOidc,
    ui: iUI,
    location: any
}

const CatalogoBancoBancos = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        bancoID: 0,
        nombre: '',
        activo: true,
        archivoDispersionID: 0,
        tipoBancoID: 0
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const OptionsArchivosDispersion: any[] = []
    const OptionsTipoBanco: any[] = []

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
        OptionsArchivosDispersion,
        OptionsTipoBanco
    })

    //Funcion para obtener los datos generales
    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    respuesta.forEach((element: any) => {
                        element.clave = element.archivoDispersion.clave
                    });
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
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    respuesta.forEach((element: any) => {
                        element.clave = element.archivoDispersion.clave
                    });
                    setState(s => ({ ...s, Cargando: false, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Datos: [] }))
                }
            })
    }

    //Funcion para obtener los tipos de bancos
    const FNGetTipoBanco = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetTipoBancos(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    var tipoBanco = respuesta.map((valor: any) => {
                        var obj = { value: valor.tipoBancoID, label: valor.descripcion };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsTipoBanco: tipoBanco }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsTipoBanco: [] }))
                }
            })
    }

    const FnGetArchivoDispersion = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetArchivoDispersion(props.Seguridad)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var archivoDispersion = respuesta.map((valor: any) => {
                        var obj = { value: valor.archivoDispersionID, label: valor.descripcion };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsArchivosDispersion: archivoDispersion }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsArchivosDispersion: [] }))
                }
            })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'bancoID', sortable: true, },
                { name: 'Nombre Cuenta', selector: 'nombre', sortable: true, },
                {
                    name: 'Estatus',
                    selector: 'activo',
                    sortable: true,
                    cell: (props) => <span>{props.activo ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
                },
                { name: 'Archivo de Dispersión', selector: 'clave', sortable: true, },
                { name: 'Tipo de Banco', selector: 'tipoBanco.descripcion', sortable: true, },

                {
                    name: 'Editar', sortable: false,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...s.Form, Mostrar: true,
                                    Datos: {
                                        bancoID: props.bancoID,
                                        nombre: props.nombre,
                                        activo: props.activo,
                                        archivoDispersionID: props.archivoDispersion.archivoDispersionID,
                                        tipoBancoID: props.tipoBanco.tipoBancoID
                                    },
                                    Id: props.bancoID

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
        FnGetArchivoDispersion()
        FNGetTipoBanco()
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
        console.log(state.Datos);
        toast.success('El banco se agrego correctamente')
        setState({
            ...state, Form: {
                ...state.Form, Mostrar: false,
                Datos: DatosDefecto,

            }
        })
        FNGetDatos()
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => {
        toast.success('El banco se actualizo correctamente')
        setState(state => ({
            ...state, Datos: state.Datos.map(Dato => Dato.bancoID === item.bancoID ? item : Dato),
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    bancoID: 0,
                    nombre: '',
                    activo: true,
                    archivoDispersionID: 0,
                    tipoBancoID: 0
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
                <Card Title="Catálogo Bancos">
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
                                                        <input type="text" className="form-control" placeholder="Buscar banco" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
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
                                        keyField={"bancoID"}
                                        defaultSortField={"bancoID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>

                                                {state.Form.Id ? "Editar Banco" : "Agregar Banco"}

                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                Seguridad={props.Seguridad}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                OptionsTipoBanco={state.OptionsTipoBanco}
                                                fnCancelar={fnCancelar}
                                                OptionsArchivosDispersion={state.OptionsArchivosDispersion}

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
    Seguridad: state.oidc,
    ui: state.UI
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogoBancoBancos)