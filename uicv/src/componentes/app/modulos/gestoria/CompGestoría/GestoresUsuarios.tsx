import DataTable, { IDataTableColumn } from "react-data-table-component"
import { IEstado } from "../../../../../interfaces/redux/IEstado"
import { MODAL_TITLE_CLASS } from "../../../../global/ModalWin"
import { FiltrarDatos } from '../../../../../global/functions'
import { Card, ModalWin, Spinner } from "../../../../global"
import * as FnGestoria from "./GestoresUsuarios/Funciones"
import { FaLink, FaPencilAlt, FaSearch } from "react-icons/fa"
import { CForm } from "./GestoresUsuarios/CForm"
import { connect } from 'react-redux'

import React from "react"

interface IBuscarSocias {
    SucursalID: number;
    CoordinadorID: number;
}
type InitialState = {
    optCoordinadores: any[],
    optSucursales: any[],
    optGestores: any[],
    DatosMostrar: any[],
    optTipos: any[],
    Datos: any[],
    Filtro: string,
    SucursalID: number,
    Cargando: boolean,
    Error: boolean,
    Form: {
        Mostrar?: boolean,
        Id: undefined,
        Datos: {
            UsuarioID: number,
            ResponsableId: number,
            TipoUsuarioID: number
        }
    }
}

const GestoresUsuarios = (props) => {
    const DatosMostrar: any[] = []
    const Datos: any[] = []
    let isMounted = React.useRef(true)
    const modalStyle = { overflowY: 'unset' };

    const [state, setState] = React.useState<InitialState>({
        optCoordinadores: [],
        optSucursales: [],
        optGestores: [],
        optTipos: [],
        Datos,
        DatosMostrar,
        Filtro: '',
        SucursalID: 0,
        Cargando: false,
        Error: false,
        Form: {
            Mostrar: false,
            Id: undefined,
            Datos: {
                UsuarioID: 0,
                ResponsableId: 0,
                TipoUsuarioID: 0
            }
        }
    })

    const FnGetUsuarios = () => {
        setState(s => ({ ...s, Cargando: true }))
        FnGestoria.FNGetUsuarios(props.oidc)
            .then((respuesta: any) => {
                setState(s => ({ ...s, Cargando: false, Datos: respuesta }))
            })
            .catch(() => {
                setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
            })
    }

    const gestorModal = (open = true, UsuarioID) => {
        // if (open)
        //     FnGetResponsables()
        setState(s => ({
            ...s,
            Form: { ...s.Form, Mostrar: open, Datos: { ...s.Form.Datos, UsuarioID: UsuarioID } }
        }))
    }

    const FnGetTipos = () => {
            setState(s => ({ ...s }))
            FnGestoria.FNGetTipos(props.oidc)
                .then((respuesta: any) => {
                    var tipos = respuesta.map((valor: any) => {
                        var obj = { value: valor.TipoUsuarioID, label: valor.TipoUsuario };
                        return obj
                    });
    
                    setState(s => ({ ...s, optTipos: tipos }))
                })
                .catch(() => {
                    setState(s => ({ ...s, optTipos: [] }))
                })
        }

    const dgGuardar = () => setState(s => ({
        ...s,
        Form: { ...s.Form, Mostrar: false, Datos: { ...s.Form.Datos, Distribuidores: [] } }
    }))

    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.ResponsableId === item.ResponsableId ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { UsuarioID: 0, TipoUsuarioID: 0, ResponsableId: 0} } })

    const fnCancelar = () => setState(s => ({
        ...s,
        Form: { ...s.Form, Mostrar: false, Datos: { ...s.Form.Datos } }
    }))

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    React.useEffect(() => {
        if (isMounted.current === true)
            FnGetUsuarios()
            FnGetTipos()
        return () => { isMounted.current = false }
    }, [])


    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] = [
            { name: 'Usuario ID', selector: 'UsuarioID', sortable: false, wrap: true },
            { name: 'Nombre', selector: 'Nombre', sortable: false, wrap: true, },
            { name: 'Usuario', selector: 'Usuario', sortable: false, wrap: true, },
            {
                name: 'Acciones', cell: (e) => (<>
                    {'\u00A0'}
                    {'\u00A0'}
                    <React.Fragment>
                        <button onClick={() => gestorModal(true, e.UsuarioID)} title={`Habilitar usuario`} className="asstext text-dark"><FaLink /></button>
                    </React.Fragment>
                    {'\u00A0'}
                    {'\u00A0'}
                    {'\u00A0'}
                    {'\u00A0'}
                    {/* <React.Fragment>
                        <button onClick={() => {
                                setState(s => ({
                                    ...s,
                                    Form: {
                                        ...s.Form, Mostrar: true,
                                        Datos: props,
                                        Id: props.ResponsableId
                                    }
                                }))
                            }} title={`Editar Tipo Usuario`} className="asstext text-dark"><FaPencilAlt /></button>
                    </React.Fragment> */}
                    
                </>)
            }
        ]
        return colRet
    }, [])

    return (
        <div>
            <div className="row">
                <div className="col-12">
                    <Card Title={'Gestores usuarios'}>
                        <Card.Body>
                            <Card.Body.Content>
                                <div className="columns is-centered is-mobile is-multiline">
                                    {state.Cargando && <Spinner />}
                                    {state.Error && <span>Error al cargar los datos...</span>}
                                    {(!state.Cargando && !state.Error) &&
                                        <DataTable
                                            subHeader
                                            subHeaderComponent=
                                            {
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <div className="input-group mb-3">
                                                            <input type="text" className="form-control" placeholder="Buscar persona" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                            <span className="input-group-text"><FaSearch /> </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            data={state.DatosMostrar}
                                            paginationComponentOptions={{
                                                noRowsPerPage: false, rowsPerPageText: 'Usuarios por página',
                                                rangeSeparatorText: 'de',
                                                selectAllRowsItem: false,
                                                selectAllRowsItemText: 'Todos',
                                            }}
                                            contextMessage={{
                                                singular: '- Usuario seleccionado',
                                                plural: '- Usuarios seleccionados',
                                                message: ''
                                            }}
                                            striped
                                            pagination
                                            dense
                                            responsive
                                            //selectableRowDisabled={(row: any) => disableRow(row)}
                                            //selectableRowsComponent={<div>ssss</div>}
                                            noDataComponent={<div>No hay datos</div>}
                                            title={<span>Lista de Usuarios</span>}

                                            keyField={"UsuarioID"}
                                            defaultSortField={"UsuarioID"}
                                            columns={Columns}
                                        />}
                                </div>
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            <ModalWin open={state.Form.Mostrar}>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>Seleccione el responsable</h5>
                </ModalWin.Header>
                <ModalWin.Body style={modalStyle}>
                    <CForm
                        dgGuardar={dgGuardar}
                        fnCancelar={fnCancelar}
                        setState={setState}
                        initialValues={state.Form.Datos}
                        oidc={props.oidc}
                        state={state}
                        optTipos={state.optTipos}
                        Id={state.Form.Id}
                        cbActualizar={cbActualizar}
                    />
                </ModalWin.Body>
            </ModalWin>
        </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(GestoresUsuarios)