import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
// import * as FnUsuarios from './CreditoGrupoTraspaso/Funciones'
import * as Funciones from './CreditoGrupoUsuarios/Funciones'
import * as FnGrupoDetalle from './CreditoGrupoDetalle/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CreditoGrupoTraspaso/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { DescripcionDistribuidor } from '../../../../../global/variables'

type CatalogosType = {
    oidc: IOidc,
    GrupoID: number,
    SucursalID: number
}

const CreditoGrupoTraspasoReasignar = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = { GrupoID: props.GrupoID, GrupoDestinoID: 0, SucursalID: props.SucursalID }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Form: DatosDefecto,
        Distribuidores: [] as number[],
        loading: false
    })

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'DistribuidorID', sortable: true, },
                // { name: 'Coordinador', selector: 'Coordinador', sortable: true, },
                { name: `${DescripcionDistribuidor(1)}`, selector: 'NombreCompleto', sortable: true, },
                { name: 'Estatus', selector: 'Estatus', sortable: true, cell: (props) => <span>{props.Estatus ? "Activo" : "Inactivo"}</span> },
                // {
                //     name: 'Acciones', sortable: false,
                //     cell: (props) =>
                //         <button className="asstext" type={"button"} onClick={() => {
                //             setState(s => ({
                //                 ...s,
                //                 Form: {
                //                     ...s.Form, Mostrar: true,
                //                     Datos: { creditoPromotorNombre: props.creditoPromotorNombre, activo: props.activo },
                //                     Id: props.creditoPromotorId
                //                 }
                //             }))
                //         }}>
                //             <FaPencilAlt />
                //         </button>
                // },
            ]
        return colRet
    }, [])

    React.useEffect(() => {
        if (isMounted.current === true) {
            FNGetLocal()
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
    // const cbAgregar = (item: any) =>
    //     setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { creditoPromotorNombre: '', activo: true } } })

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState(s => ({ ...s, Error: false, Datos: item }))
    // setState({ ...state, Datos: state.Datos.map(Dato => Dato.creditoPromotorId === item.creditoPromotorId ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { creditoPromotorNombre: '', activo: true } } })

    /** funcion para cancelar la forma */
    const fnTraspasando = (loading: boolean) => {
        setState(s => ({ ...s, loading: loading }))
    }

    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))
        FnGrupoDetalle.FNGetReasignar(props.oidc, props.GrupoID)
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

    const fnGetDistribuidores = (GrupoID: number) => {
        if (GrupoID > 0)
            Funciones.FNGet(props.oidc, GrupoID)
                .then((respuesta: any) => {
                    // if (isMounted.current === true) {
                    setState(s => ({ ...s, Error: false, Datos: respuesta }))
                    // }
                })
                .catch(() => {
                    // if (isMounted.current === true) {
                    setState(s => ({ ...s, Error: true, Datos: [] }))
                    // }
                })
    }

    return (
        // <div className="row">
        //     <div className="col-12">
        <Card Title={`Traspasar ${DescripcionDistribuidor(1)} de Grupo`}>
            <Card.Body>
                <Card.Body.Content>
                    {state.Cargando && <Spinner />}
                    {state.Error && <span>Error al cargar los datos...</span>}
                    {!state.Cargando && !state.Error &&
                        <div>
                            {/* <div className="text-end">
                                        <button type="button" className="btn btn-secondary btn-sm mb-2"
                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                        >
                                            Agregar
                                        </button>
                                    </div> */}
                            <CForm
                                oidc={props.oidc}
                                initialValues={state.Form}
                                Distribuidores={state.Distribuidores}
                                fnTraspasando={fnTraspasando}
                                cbActualizar={cbActualizar}
                                fnGetDistribuidor={fnGetDistribuidores}
                            />
                            <br />
                            <DataTable
                                subHeader
                                subHeaderComponent=
                                {
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="input-group mb-3">
                                                <input type="text" className="form-control" placeholder={`Buscar ${DescripcionDistribuidor(1)}`} value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                <span className="input-group-text"><FaSearch /></span>
                                            </div>
                                        </div>
                                    </div>
                                }
                                data={state.DatosMostrar}
                                selectableRows
                                onSelectedRowsChange={(row: any) => setState(s => ({
                                    ...s,
                                    // Form:
                                    // {
                                    //     ...s.Form,
                                    Distribuidores: row.selectedRows.map((valor: any) => {
                                        return valor.DistribuidorID;
                                    })
                                    // }
                                }))
                                }
                                // selectableRowSelected={rowSelectCritera}
                                striped
                                pagination
                                dense
                                noHeader
                                responsive
                                keyField={"DistribuidorID"}
                                defaultSortField={"DistribuidorID"}
                                columns={Columns}
                            />
                        </div>
                    }
                </Card.Body.Content>
            </Card.Body>
        </Card>
        //     </div>
        // </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CreditoGrupoTraspasoReasignar)