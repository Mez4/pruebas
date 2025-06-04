import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './BancosCorresponsalesPago/Funciones'
import * as FnBancos from './BancosCorresponsalesPago/Funciones'
import * as FnUsuarios from '../../seguridad/CompSeguridad/CompAdministracionUsuarios/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './BancosCorresponsalesPago/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'

type CatalogosType = {
    oidc: IOidc
}

const BancosCorresponsalesPago = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        CorresponsalId: 0,
        CorresponsalDesc: '',
        comision: 0,
        ordenEnTabla: 1,
        mostrarEnTabla: false,
        montoMaximoPago: 0
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optBancos: any[] = []
    const optUsuarios: any[] = []
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
        optBancos,
        optUsuarios
    })

    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                // }
            })
    }

    const FnGetBancos = () => {
        FnBancos.FNGet(props.oidc)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {

                var bancos = respuesta.map((valor: any) => {
                    var obj = { value: valor.BancoID, label: valor.Banco };
                    return obj
                });

                setState(s => ({ ...s, optBancos: bancos }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, optBancos: [] }))
                // }
            })
    }

    const FnGetUsuarios = () => {
        FnUsuarios.FNObtener(props.oidc)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {

                var usuarios = respuesta.map((valor: any) => {
                    var obj = { value: valor.UsuarioID, label: `${valor.Usuario} - ${valor.Nombre}` };
                    return obj
                });

                setState(s => ({ ...s, optUsuarios: usuarios }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, optUsuarios: [] }))
                // }
            })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'CorresponsalId', sortable: true, },
                { name: 'Descripcion', selector: 'CorresponsalDesc', sortable: true, },
                { name: 'Comision', selector: 'comision', sortable: true, },
                { name: 'Orden En Tabla', selector: 'ordenEnTabla', sortable: true, },
                { name: 'Mostrar En Tabla', selector: 'mostrarEnTabla', sortable: true, cell: (props) => <span>{props.mostrarEnTabla ? "Si" : "No"}</span> },
                { name: 'Monto Maximo Pago', selector: 'montoMaximoPago', sortable: true, },

                {
                    name: 'Acciones', sortable: false,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...s.Form, Mostrar: true,
                                    Datos: {
                                        CorresponsalId: props.CorresponsalId,
                                        CorresponsalDesc: props.CorresponsalDesc,
                                        comision: props.comision,
                                        ordenEnTabla: props.ordenEnTabla,
                                        mostrarEnTabla: props.mostrarEnTabla,
                                        montoMaximoPago: props.montoMaximoPago
                                    },
                                    Id: props.CorresponsalId
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
        if (isMounted.current === true) {
            FNGetLocal()
            FnGetBancos()
            FnGetUsuarios()
        }
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
    const cbAgregar = (item: any) =>
        setState({
            ...state, Datos: [...state.Datos, item],
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    CorresponsalId: 0,
                    CorresponsalDesc: '',
                    comision: 0,
                    ordenEnTabla: 1,
                    mostrarEnTabla: true,
                    montoMaximoPago: 0
                }
            }
        })

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({
            ...state, Datos: state.Datos.map(Dato => Dato.CorresponsalId === item.CorresponsalId ? item : Dato), Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    CorresponsalId: 0,
                    CorresponsalDesc: '',
                    comision: 0,
                    ordenEnTabla: 1,
                    mostrarEnTabla: true,
                    montoMaximoPago: 0
                }
            }
        })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Corresponsales Pagos">
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
                                                        <input type="text" className="form-control" placeholder="Buscar Corresponsales" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
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
                                        keyField={"CorresponsalId"}
                                        defaultSortField={"CorresponsalId"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "Editar Corresponsal Pago" : "Agregar Corresponsal Pago"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                optBancos={state.optBancos}
                                                optUsuarios={state.optUsuarios} />
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

export default connect(mapStateToProps, mapDispatchToProps)(BancosCorresponsalesPago)