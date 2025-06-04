import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CatalogoSucursalFisica/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CatalogoSucursalFisica/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'

import { Acordion } from '../../../../global'

type CatalogosType = {
    oidc: IOidc
}

const CatalogoSucursalFisica = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = { 
        Nombre: '', 
        Telefono: '', 
        vialidadTipoId : 0, 
        orientacionVialidadTipoId : 0, 
        AsentamientoID : 0, 
        NombreVialidad: '', 
        NumeroExterior: '', 
        NumeroInterior: '', 
        ReferenciasGeograficas: '', 
        ViviendaTipoId: 0
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
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

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Nombre', selector: 'Nombre', sortable: true, minWidth: '200px' },
                { name: 'Telefono', selector: 'Telefono', sortable: true, minWidth: '200px' },
                { name: 'Dirección', selector: 'Dirección', sortable: true, cell: (props) =>
                    <Acordion TabSelecionado={''}>
                        <div>
                            {/* {props.Direccion.map((d: any, dId: any) => */}
                                <Acordion.Tab key={'dir_' + props.DireccionID} Identificador={'dir_' + props.DireccionID} Titulo={
                                    `   ${props.vialidadTipo}
                                        ${props.NombreVialidad}
                                        [${props.orientacionVialidadTipo}] 
                                        NO. ${props.NumeroExterior}
                                        ${props.NumeroInterior ? (', Interior: ' + props.NumeroInterior) : ''} - ${props.Asentamiento}
                                    `
                                }>
                                    <div>
                                        <p className={'inbox-item-text text-muted mt-0 mb-1'}><strong>Estado:</strong>&nbsp;{props.Estado}</p>
                                        <p className={'inbox-item-text text-muted mt-0 mb-1'}><strong>Municipio:</strong>&nbsp;{props.Municipio}</p>
                                        <p className={'inbox-item-text text-muted mt-0 mb-1'}><strong>Ciudad:</strong>&nbsp;{props.Ciudad}</p>
                                        <p className={'inbox-item-text text-muted mt-0 mb-1'}>
                                            <strong>Dirección:</strong>&nbsp;
                                            {props.vialidadTipo}&nbsp;{props.NombreVialidad} [{props.orientacionVialidadTipo}], NO. {props.NumeroExterior}
                                            {props.NumeroInterior && <span>, No.Interior: {props.NumeroInterior}</span>}, {props.Asentamiento}
                                        </p>
                                        <p className={'inbox-item-text text-muted mt-0 mb-1'}><strong>CP:&nbsp;</strong>{props.CodigoPostal}</p>
                                        <p className={'inbox-item-text text-muted mt-0 mb-1'}><strong>Referencias:&nbsp;</strong>{props.CodigoPostal}</p>
                                        <p className={'inbox-item-text text-muted mt-0 mb-1'}><strong>T.Vivienda:&nbsp;</strong>{props.vialidadTipo}</p>
                                    </div>
                                </Acordion.Tab>
                             {/* )} */}
                        </div>
                    </Acordion>
                },
                {
                    name: 'Acciones', sortable: false,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...s.Form, Mostrar: true,
                                    Datos: { Nombre: props.Nombre, Telefono: props.Telefono,  vialidadTipoId: props.vialidadTipoId, orientacionVialidadTipoId: props.orientacionVialidadTipoId, AsentamientoID: props.AsentamientoID, NombreVialidad: props.NombreVialidad, NumeroExterior: props.NumeroExterior, NumeroInterior: props.NumeroInterior, ReferenciasGeograficas: props.ReferenciasGeograficas, ViviendaTipoId: props.ViviendaTipoId },
                                    Id: props.SucursalFisicaID
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
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } })

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.SucursalFisicaID === item.SucursalFisicaID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Administrar Sucursales Fisicas">
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
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar Sucursal Fisica" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
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
                                        keyField={"SucursalFisicaID"}
                                        defaultSortField={"SucursalFisicaID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "Editar Sucursal Fisica" : "Agregar Sucursal Fisica"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
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

export default connect(mapStateToProps, mapDispatchToProps)(CatalogoSucursalFisica)