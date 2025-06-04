import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './BancoCuentaDesembolsoTipo/Funciones'
import * as FnCuenta from './BancoCuenta/Funciones'
import * as FnTipoDesembolso from '../../tesoreria/CompTesoreria/BancoTipoDesembolso/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './BancoCuentaDesembolsoTipo/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'

type CatalogosType = {
    oidc: IOidc
}

const BancoCuentaDesembolsoTipo = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        cuentaId: 0, tipoDesembolsoId: 0, activo: false
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optCuentas: any[] = []
    const optTiposDesembolso: any[] = []
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
        optCuentas: optCuentas,
        optTiposDesembolso: optTiposDesembolso
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

    const FnGetCuentas = () => {
        FnCuenta.FNGet(props.oidc)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {

                var cuentas = respuesta.map((valor: any) => {
                    var obj = { value: valor.CuentaID, label: `${valor.Cuenta}-${valor.NombreCuenta}` };
                    return obj
                });

                setState(s => ({ ...s, optCuentas: cuentas }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, optCuentas: [] }))
                // }
            })
    }

    const FnGetTiposDesembolso = () => {
        FnTipoDesembolso.FNGet(props.oidc)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {

                var tipodesembolso = respuesta.map((valor: any) => {
                    var obj = { value: valor.TipoDesembolsoID, label: valor.TipoDesembolso };
                    return obj
                });

                setState(s => ({ ...s, optTiposDesembolso: tipodesembolso }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, optTiposDesembolso: [] }))
                // }
            })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'Id', sortable: true, },
                { name: 'Cuenta', selector: 'Cuenta.Cuenta', sortable: true, },
                { name: 'Tipo Desembolso', selector: 'TiposDesembolso.TipoDesembolso', sortable: true, },
                { name: 'Activo', selector: 'activo', sortable: true, cell: (props) => <span>{props.activo ? "Si" : "No"}</span> },
                {
                    name: 'Acciones', sortable: false,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...s.Form, Mostrar: true,
                                    Datos: {
                                        cuentaId: props.cuentaId,
                                        tipoDesembolsoId: props.tipoDesembolsoId,
                                        activo: props.activo
                                    },
                                    Id: props.Id
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
            FnGetCuentas()
            FnGetTiposDesembolso()
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
                    cuentaId: 0, tipoDesembolsoId: 0, activo: false
                }
            }
        })

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({
            ...state, Datos: state.Datos.map(Dato => Dato.Id === item.Id ? item : Dato), Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    cuentaId: 0, tipoDesembolsoId: 0, activo: false
                }
            }
        })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Administrar Relación Cuentas Tipos desembolsos">
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
                                                        <input type="text" className="form-control" placeholder="Buscar cuentas tipo desembolso" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
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
                                        keyField={"Id"}
                                        defaultSortField={"Id"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "Editar relación cuentas tipo desembolso" : "Agregar relación cuentas tipo desembolso"}
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
                                                optCuentas={state.optCuentas}
                                                optTiposDesembolsos={state.optTiposDesembolso} />
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

export default connect(mapStateToProps, mapDispatchToProps)(BancoCuentaDesembolsoTipo)