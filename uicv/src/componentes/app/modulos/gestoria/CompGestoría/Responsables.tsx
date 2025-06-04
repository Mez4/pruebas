import DataTable, { IDataTableColumn } from "react-data-table-component"
import { IEstado } from "../../../../../interfaces/redux/IEstado"
import { MODAL_TITLE_CLASS } from "../../../../global/ModalWin"
import { FiltrarDatos } from '../../../../../global/functions'
import { Card, ModalWin, Spinner } from "../../../../global"
import * as FnResponsables from "./Responsables/Funciones"
import { FaLink, FaSearch } from "react-icons/fa"
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
    Datos: any[],
    Filtro: string,
    SucursalID: number,
    Cargando: boolean,
    Error: boolean,
    Form: {
        Mostrar?: boolean,
        Datos: {
            UsuarioID: number,
            ResponsableId: number
        }
    }
}

const Responsables = (props) => {
    const DatosMostrar: any[] = []
    const Datos: any[] = []
    let isMounted = React.useRef(true)

    const [state, setState] = React.useState<InitialState>({
        optCoordinadores: [],
        optSucursales: [],
        optGestores: [],
        Datos,
        DatosMostrar,
        Filtro: '',
        SucursalID: 0,
        Cargando: false,
        Error: false,
        Form: {
            Mostrar: false,
            Datos: {
                UsuarioID: 0,
                ResponsableId: 0
            }
        }
    })

    const FnGetResponsables = () => {
        setState(s => ({ ...s, Cargando: true }))
        FnResponsables.FNGetResponsables(props.oidc)
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

    const dgGuardar = () => setState(s => ({
        ...s,
        Form: { ...s.Form, Mostrar: false, Datos: { ...s.Form.Datos, Distribuidores: [] } }
    }))

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
            FnGetResponsables()
        return () => { isMounted.current = false }
    }, [])


    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] = [
            { name: 'Responsable ID', selector: 'ResponsableId', sortable: false, wrap: true, width: '100px' },
            { name: 'Nombre', selector: 'ResponsableNombre', sortable: false, wrap: true, },
            { name: 'Usuario ID', selector: 'UsuarioID', cell: (item)=> item.UsuarioID || '-' },
            { name: 'Usuario', selector: 'Usuario', cell: (item)=> item.Usuario || '-' },
            // {
            //     name: 'Acciones', cell: (e) => (<>

            //         <React.Fragment>
            //             <button onClick={() => gestorModal(true,  e.UsuarioID)} title={`Habilitar usuario`} className="asstext text-dark"><FaLink /></button>
            //         </React.Fragment>
            //     </>)
            // }
        ]
        return colRet
    }, [])

    return (
        <div>
            <div className="row">
                <div className="col-12">
                    <Card Title={'Responsables'}>
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
                                                noRowsPerPage: false, rowsPerPageText: 'Responsables por página',
                                                rangeSeparatorText: 'de',
                                                selectAllRowsItem: false,
                                                selectAllRowsItemText: 'Todos',
                                            }}
                                            contextMessage={{
                                                singular: '- Responsable seleccionado',
                                                plural: '- Responsables seleccionados',
                                                message: ''
                                            }}
                                            striped
                                            pagination
                                            dense
                                            responsive
                                            //selectableRowDisabled={(row: any) => disableRow(row)}
                                            //selectableRowsComponent={<div>ssss</div>}
                                            noDataComponent={<div>No hay datos</div>}
                                            keyField={"ResponsableId"}
                                            defaultSortField={"ResponsableId"}
                                            columns={Columns}
                                        />}
                                </div>
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {/* <ModalWin open={state.Form.Mostrar}>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>Seleccione el responsable</h5>
                </ModalWin.Header>
                <ModalWin.Body>
                    <CForm
                        dgGuardar={dgGuardar}
                        fnCancelar={fnCancelar}
                        setState={setState}
                        initialValues={state.Form.Datos}
                        oidc={props.oidc}
                        state={state}
                        optTipos={}
                    />
                </ModalWin.Body>
            </ModalWin> */}
        </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Responsables)