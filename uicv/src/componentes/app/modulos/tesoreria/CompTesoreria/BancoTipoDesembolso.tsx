import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './BancoTipoDesembolso/Funciones'
import * as FnTiposMovimientos from '../../bancos/CompBancos/BancoTipoMovimiento/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './BancoTipoDesembolso/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'

type CatalogosType = {
    oidc: IOidc
}

const BancoTipoDesembolso = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = { TipoDesembolso: '', Activo: false, TipoMovimientoID: 0, FormatoImpresionExtra: false, RequiereDatosBancarios: false }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optTiposMovimiento: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        optTiposMovimiento,
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

    const FnGetTiposMovimientos = () => {
        FnTiposMovimientos.FNGet(props.oidc)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {

                var tiposMovimientos = respuesta.map((valor: any) => {
                    var obj = { value: valor.id, label: valor.tipoMovimiento };
                    return obj
                });

                setState(s => ({ ...s, optTiposMovimiento: tiposMovimientos }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, optTiposMovimiento: [] }))
                // }
            })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'TipoDesembolsoID', sortable: true, },
                { name: 'Tipo', selector: 'TipoDesembolso', sortable: true, },
                { name: 'Activo', selector: 'Activo', sortable: true, cell: (props) => <span>{props.Activo ? "SI" : "No"}</span> },
                { name: 'Tipo Movimiento', selector: 'TipoMovimiento.TipoMovimiento', sortable: true, },
                { name: 'Formato Impresión Extra', selector: 'FormatoImpresionExtra', sortable: true, cell: (props) => <span>{props.FormatoImpresionExtra ? "SI" : "No"}</span> },
                { name: 'Requiere Datos Bancarios', selector: 'RequiereDatosBancarios', sortable: true, cell: (props) => <span>{props.RequiereDatosBancarios ? "SI" : "No"}</span> },
                {
                    name: 'Acciones', sortable: false,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...s.Form, Mostrar: true,
                                    Datos: { TipoDesembolso: props.TipoDesembolso, Activo: props.Activo, TipoMovimientoID: props.TipoMovimientoID, FormatoImpresionExtra: props.FormatoImpresionExtra, RequiereDatosBancarios: props.RequiereDatosBancarios },
                                    Id: props.TipoDesembolsoID
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
            FnGetTiposMovimientos()
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
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { TipoDesembolso: '', Activo: false, TipoMovimientoID: 0, FormatoImpresionExtra: false, RequiereDatosBancarios: false } } })

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.TipoDesembolsoID === item.TipoDesembolsoID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { TipoDesembolso: '', Activo: false, TipoMovimientoID: 0, FormatoImpresionExtra: false, RequiereDatosBancarios: false } } })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Administrar tipos de desembolso">
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
                                                        <input type="text" className="form-control" placeholder="Buscar tipo de desembolso" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
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
                                        keyField={"TipoDesembolsoID"}
                                        defaultSortField={"TipoDesembolsoID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "Editar tipo de desembolso" : "Agregar tipo de desembolso"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                optTiposMovimiento={state.optTiposMovimiento}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar} />
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

export default connect(mapStateToProps, mapDispatchToProps)(BancoTipoDesembolso)