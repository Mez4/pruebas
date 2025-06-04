import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import * as Funciones from './DocsAval/Funciones'

// Icons
import { FaEye, FaSearch, FaCheckCircle, FaClock, FaFileUpload, FaExclamationTriangle } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './DocsAval/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import ReactTooltip from 'react-tooltip';
import VerDocAval from './DocsAval/VerDoc'

type CatalogosType = {
    oidc: IOidc,
    AvalID: number,
    Editar: boolean
}

const DocsAval = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = {
        TipoDocumentoAvalID: 0,
        NombreDocumento: '',
        Clave: '',
        Descripcion: '',
        DocumentoAvalID: 0,
        Orden: 0,
        PersonaID: 0,
        TipoPersonaID: 0,
        Ruta: '',
        Autorizado: false,
        rn: 0
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const AvalIDP: number = props.AvalID
    const EditarP: boolean = props.Editar
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        MostrarSubirDocumentos: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined || 0,
            VerDoc: false,
        }
    })

    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetDocsByAvalID(props.oidc, props.AvalID)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    console.log(respuesta);
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch((error) => {
                console.log("###e", error)
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'ID',
                    selector: 'TipoDocumentoAvalID',
                    sortable: true,
                    width: '10%',
                    cell: (props) =>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <span>
                                {props.TipoDocumentoAvalID}
                            </span>
                        </div>
                },
                {
                    name: 'Nombre Documento',
                    selector: 'NombreDocumento',
                    sortable: true,
                    width: '38%',
                    cell: (props) =>
                        <div style={{ width: '100%', textAlign: 'start' }}>
                            {props.NombreDocumento}
                        </div>
                },
                {
                    name: 'Subir Documento',
                    width: '20%',
                    sortable: false,
                    cell: (props) =>
                        <>{<button disabled={props.Autorizado} data-tip data-for={`btnSD_${props.TipoDocumentoAvalID}`} style={{ width: '100%', textAlign: 'center', paddingTop: '2px', paddingBottom: '2px' }} className={props.Autorizado ? 'btn btn-success' : 'btn btn-primary'} type={"button"} onClick={() => {
                            if (props.Autorizado !== true) setState(s => ({
                                ...s,
                                Form: {
                                    ...state.Form, Mostrar: true,
                                    Datos: {
                                        TipoDocumentoAvalID: props.TipoDocumentoAvalID,
                                        NombreDocumento: props.NombreDocumento,
                                        Clave: props.Clave,
                                        Descripcion: props.Descripcion,
                                        DocumentoAvalID: props.DocumentoAvalID,
                                        Orden: props.Orden,
                                        PersonaID: props.PersonaID,
                                        TipoPersonaID: props.TipoPersonaID,
                                        Ruta: props.Ruta,
                                        Autorizado: props.Autorizado,
                                        rn: props.rn
                                    },
                                    Id: AvalIDP
                                }
                            }))
                        }}>
                            {props.Autorizado ? 'VALIDADO' : props.Autorizado === false ? 'SUBIR' : 'SUBIR'}
                        </button>}
                            <ReactTooltip id={`btnSD_${props.TipoDocumentoAvalID}`} type="info" effect="solid">
                                SUBIR DOCUMENTO {props.NombreDocumento}
                            </ReactTooltip></>
                },
                {
                    name: 'Ver Documento',
                    width: '20%',
                    sortable: false,
                    cell: (props) =>
                        props.DocumentoAvalID > 0 ? <><button data-tip data-for={`btnCV_${props.TipoDocumentoAvalID}`} style={{ width: '100%', textAlign: 'center', paddingTop: '2px', paddingBottom: '2px' }} className="btn btn-secondary" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...state.Form, Mostrar: false, VerDoc: true,
                                    Datos: {
                                        TipoDocumentoAvalID: props.TipoDocumentoAvalID,
                                        NombreDocumento: props.NombreDocumento,
                                        Clave: props.Clave,
                                        Descripcion: props.Descripcion,
                                        DocumentoAvalID: props.DocumentoAvalID,
                                        Orden: props.Orden,
                                        PersonaID: props.PersonaID,
                                        TipoPersonaID: props.TipoPersonaID,
                                        Ruta: props.Ruta,
                                        Autorizado: props.Autorizado,
                                        rn: props.rn
                                    },
                                    Id: AvalIDP
                                }
                            }))
                        }}>
                            VER
                        </button>
                            <ReactTooltip id={`btnCV_${props.TipoDocumentoAvalID}`} type="info" effect="solid">
                                VER DOCUMENTO {props.NombreDocumento}
                            </ReactTooltip></> : <div style={{ width: '100%', textAlign: 'center' }}>
                            <span>
                                Pendiente
                            </span>
                        </div>
                },
                {
                    name: 'Subido',
                    selector: 'DocumentoAvalID',
                    sortable: true,
                    width: '10%',
                    cell: (props) =>
                        <>
                            {(props.Autorizado === false) &&
                                <div style={{ width: '100%', textAlign: 'center' }}>
                                    <FaExclamationTriangle color='orange' size={20} />
                                </div>
                            }

                            {(props.Autorizado || props.Autorizado === null) &&
                                <div style={{ width: '100%', textAlign: 'center' }}>
                                    {props.DocumentoAvalID > 0 ? <FaCheckCircle color='green' size={20} /> : <FaClock color='gray' size={20} />}
                                </div>
                            }
                        </>
                },
            ]
        return colRet
    }, [state.Form])

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
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

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        setState({
            ...state, Datos: [...state.Datos, item], Form: {
                ...state.Form, Mostrar: false, VerDoc: false, Datos: {
                    TipoDocumentoAvalID: 0,
                    NombreDocumento: '',
                    Clave: '',
                    Descripcion: '',
                    DocumentoAvalID: 0,
                    Orden: 0,
                    PersonaID: 0,
                    TipoPersonaID: 0,
                    Ruta: '',
                    Autorizado: false,
                    rn: 0
                }
            }
        })
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => {
        console.log("###", state.Datos)
        setState({
            ...state, Datos: state.Datos.map(Dato => Dato.TipoDocumentoAvalID === item.TipoDocumentoAvalID ? item : Dato), Form: {
                ...state.Form, Mostrar: false, VerDoc: false, Datos: {
                    TipoDocumentoAvalID: 0,
                    NombreDocumento: '',
                    Clave: '',
                    Descripcion: '',
                    DocumentoAvalID: 0,
                    Orden: 0,
                    PersonaID: 0,
                    TipoPersonaID: 0,
                    Ruta: '',
                    Autorizado: false,
                    rn: 0
                }
            }
        })
    }

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false, VerDoc: false } })

    return (
        <div className="row">
            <div className="col-12">
                <Card>
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
                                                        <input type="text" className="form-control" placeholder="Buscar Documento" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
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
                                        keyField={"TipoDocumentoAvalID"}
                                        defaultSortField={"Orden"}
                                        columns={Columns}
                                    />
                                    {state.Form.VerDoc && <ModalWin open={state.Form.VerDoc} center large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>{state.Form.Datos.NombreDocumento}</h5>
                                            <button type="button" className="delete" onClick={() => {
                                                fnCancelar()
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <VerDocAval DocumentoAvalID={state.Form.Datos.DocumentoAvalID} fnCancelar={fnCancelar} />
                                        </ModalWin.Body>
                                    </ModalWin>}
                                    {state.Form.Mostrar && <ModalWin open={state.Form.Mostrar} center large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>{state.Form.Datos.NombreDocumento}</h5>
                                            <button type="button" className="delete" onClick={() => {
                                                fnCancelar()
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>}

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
export default connect(mapStateToProps, mapDispatchToProps)(DocsAval);
