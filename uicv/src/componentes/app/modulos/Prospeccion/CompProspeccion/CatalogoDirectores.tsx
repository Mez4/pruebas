import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import * as Funciones from './CatalogoDirectores/Funciones'

//import * as FnCatTipoDocumento from '../../catalogos/CompCatalogos/CatalogoDirectores/Funciones'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CatalogoDirectores/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { PropsNotForwarded } from '../../../../../node_modules_local/react-csv/lib/metaProps'

type CatalogosType = {
    oidc: IOidc
}

const CatalogoDirectores = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { /*DirectorMesaCreditoID: 0,*/ PersonaID: 0, MesaCreditoID: 0, Activo: false }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optProdMesa: any[] = []
    const optPersonas: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        optProdMesa,
        optPersonas,
        Filtro: '',
        Cargando: true,
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

    const FnGetMesaCredito = () => {
        setState(s => ({ ...s }))
        Funciones.FnGetMesaCredito(props.oidc)
            .then((respuesta: any) => {
                var sucursales = respuesta.map((valor: any) => {
                    var obj = { value: valor.MesaCreditoID, label: valor.Nombre };
                    return obj

                });

                setState(s => ({ ...s, optProdMesa: sucursales }))
            })
            .catch(() => {
                setState(s => ({ ...s, optProdMesa: [] }))
            })
    }

    const FnGetPersonas = () => {
        setState(s => ({ ...s }))
        Funciones.FnGetDirectores(props.oidc)
            .then((respuesta: any) => {
                var sucursales = respuesta.map((valor: any) => {
                    var obj = { value: valor.PersonaID, label: valor.NombreCompleto };
                    return obj

                });

                setState(s => ({ ...s, optPersonas: sucursales }))
            })
            .catch(() => {
                setState(s => ({ ...s, optPersonas: [] }))
            })
    }



    const Columns = React.useMemo(() => {

        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Id',
                    selector: 'DirectorMesaCreditoID',
                    sortable: true,
                    // width:'30%'
                },
                {
                    name: 'Nombre Completo',
                    selector: 'NombreCompleto',
                    sortable: true,
                    cell: (props) =>

                        <span >
                            {props.NombreCompleto}
                        </span>
                },
                {
                    name: 'Activo',
                    selector: 'Activo',
                    sortable: true,
                    cell: (props) => <span>{props.Activo ? "SI" : "No"}</span>
                },
                {
                    name: 'Mesa Credito',
                    selector: 'mesaCredito',
                    sortable: true,
                    // cell: (props) =>

                    //     <span >
                    //         {props.mesaCredito.Nombre}
                    //     </span>
                },
            ]
        return colRet
    }, [state.Form])

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        FnGetMesaCredito()
        FnGetPersonas()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    // On use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    // /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { /*DirectorMesaCreditoID: 0,*/ PersonaID: -1, MesaCreditoID: -1, Activo: false } } })
    }

    // /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.DirectorMesaCreditoID === item.DirectorMesaCreditoID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { /*DirectorMesaCreditoID: 0,*/ PersonaID: 0, MesaCreditoID: 0, Activo: false } } })
    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Catálogo de Encargados">
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
                                                        <input type="text" className="form-control" placeholder="Buscar Encargado" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
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
                                        keyField={"DirectorMesaCreditoID"}
                                        defaultSortField={"DirectorMesaCreditoID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Agregar Encargado</h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                optTiposDoc={state.optProdMesa}
                                                optTiposDoc2={state.optPersonas}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                cbActualizar={cbActualizar}
                                            />}

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
export default connect(mapStateToProps, mapDispatchToProps)(CatalogoDirectores);
