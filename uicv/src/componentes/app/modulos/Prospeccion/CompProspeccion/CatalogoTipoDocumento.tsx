import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import * as Funciones from './CatalogoTipoDocumento/Funciones'

//import * as FnCatTipoDocumento from '../../catalogos/CompCatalogos/CatalogoTipoDocumento/Funciones'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CatalogoTipoDocumento/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { PropsNotForwarded } from '../../../../../node_modules_local/react-csv/lib/metaProps'
import { toast } from 'react-toastify'

type CatalogosType = {
    oidc: IOidc
}

const CatalogoTipoDocumento = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { TipoDocumentoID: 0, CatalogoTipoDocumentoID: 0, Orden: 0, Activo: false }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optTipoDoc: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        optTipoDoc,
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

    const FnGetCatTipoDocumento = () => {
        setState(s => ({ ...s }))
        Funciones.FnGetCatTipoDocumento(props.oidc)
            .then((respuesta: any) => {
                var sucursales = respuesta.map((valor: any) => {
                    var obj = { value: valor.TipoDocumentoID, label: valor.NombreDocumento };
                    return obj

                });

                setState(s => ({ ...s, optTipoDoc: sucursales }))
            })
            .catch(() => {
                setState(s => ({ ...s, optTipoDoc: [] }))
            })
    }

    const cbCapturaObligatoria = (CapturaObligatoria: boolean, TipoDocumentoID: number, CatalogoTipoDocumentoID: number) => {
        Funciones.FNUpdateCapturaObligatoria(props.oidc, { TipoDocumentoID: TipoDocumentoID ?? 0, CapturaObligatoria, CatalogoTipoDocumentoID })
            .then((respuesta: any) => {
                toast.info("Actualizado", { autoClose: 1000 })
            })
            .catch((error: any) => {
                toast.error(`${error} ${error.response ? error.response.data : ''}`)
            })
    }

    const cbConsultaBuro = (CapturaObligatoria: boolean, TipoDocumentoID: number, CatalogoTipoDocumentoID: number) => {
        Funciones.FNUpdateConsultaBuro(props.oidc, { TipoDocumentoID: TipoDocumentoID ?? 0, CapturaObligatoria, CatalogoTipoDocumentoID })
            .then((respuesta: any) => {
                toast.info("Actualizado", { autoClose: 1000 })
            })
            .catch((error: any) => {
                toast.error(`${error} ${error.response ? error.response.data : ''}`)
            })
    }

    const Columns = React.useMemo(() => {

        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Id',
                    selector: 'TipoDocumentoID',
                    width: '10%',
                },
                {
                    name: 'Nombre Documento',
                    selector: 'NombreDocumento',
                    width: '45%',
                    cell: (props) =>
                        <span style={{ fontWeight: 'bold' }}>
                            <i>{props.NombreDocumento}</i>
                        </span>

                },
                {
                    name: 'Activo',
                    selector: 'Activo',
                    width: '20%',
                    cell: (props) => <div>
                        {<div className="form-check form-switch form-switch-md mb-3" dir="ltr"><input type="checkbox" className="form-check-input" defaultChecked={props.Activo} onChange={e => cbCapturaObligatoria(e.target.checked, props.TipoDocumentoID, props.CatalogoTipoDocumentoID)} /></div>}
                    </div>
                },
                {
                    name: 'ConsultaBuro',
                    selector: 'ConsultaBuro',
                    width: '20%',
                    cell: (props) => <div>
                        {<div className="form-check form-switch form-switch-md mb-3" dir="ltr"><input type="checkbox" className="form-check-input" defaultChecked={props.ConsultaBuro} onChange={e => cbConsultaBuro(e.target.checked, props.TipoDocumentoID, props.CatalogoTipoDocumentoID)} /></div>}
                    </div>
                },
                // {
                //     name: 'Orden',
                //     selector: 'Orden',
                //     sortable: true,
                // },
                // {
                //     name: 'Acciones',
                //     sortable: false,
                //     cell: (props) =>
                //         <button className="asstext" type={"button"} onClick={() => {
                //             setState(s => ({
                //                 ...s,
                //                 Form: {
                //                     ...state.Form, Mostrar: true,
                //                     Datos: { TipoDocumentoID: props.TipoDocumentoID, CatalogoTipoDocumentoID: props.CatalogoTipoDocumentoID, Orden: props.Orden, Activo: props.Activo },
                //                     Id: props.TipoDocumentoID

                //                 }
                //             }))
                //         }}>
                //             <FaPencilAlt />
                //         </button>
                // },
            ]
        return colRet
    }, [state.Form])

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        //FnGetCatTipoDocumento()
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
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { TipoDocumentoID: 0, CatalogoTipoDocumentoID: -1, Orden: 0, Activo: false } } })
    }

    // /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.TipoDocumentoID === item.TipoDocumentoID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { TipoDocumentoID: 0, CatalogoTipoDocumentoID: 0, Orden: 0, Activo: false } } })
    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Administrar Documento Solicitados del Prospecto">
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
                                                        <input type="text" className="form-control" placeholder="Buscar Tipo Documento" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        {/* <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                                        ><FaPlus /></button>
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button> */}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        data={state.DatosMostrar}
                                        striped
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"TipoDocumentoID"}
                                        defaultSortField={"TipoDocumentoID"}
                                        columns={Columns}
                                    />
                                    {/* <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Agregar Tipo Documento</h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CForm
                                                oidc={props.oidc}
                                                Id={state.Form.Id}
                                                initialValues={state.Form.Datos}
                                                optTiposDoc={state.optTipoDoc}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                cbActualizar={cbActualizar}
                                            />}
                                        </ModalWin.Body>
                                    </ModalWin> */}
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
export default connect(mapStateToProps, mapDispatchToProps)(CatalogoTipoDocumento);
