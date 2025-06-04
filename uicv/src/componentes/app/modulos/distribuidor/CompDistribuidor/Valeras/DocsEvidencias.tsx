import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import * as Funciones from './Funciones'

// Icons
import { FaEye, FaSearch, FaCheckCircle, FaClock, FaFileUpload, FaExclamationTriangle } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../../global'
//import { CForm } from './DocsProspecto/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../../global/functions'
import ReactTooltip from 'react-tooltip';
import { toast } from 'react-toastify'
import VerDoc from './VerDoc'
//import VerDoc from './DocsProspecto/VerDoc'

type CatalogosType = {
    oidc: IOidc,
    ValeraID: number
}

const DocsEvidencias = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = {
        TipoDocumentoID: 0,
        NombreDocumento: '',
        Clave: '',
        Descripcion: '',
        DocumentoID: 0,
        Orden: 0,
        PersonaID: 0,
        TipoPersonaID: 0,
        Ruta: '',
        Autorizado: false,
        rn: 0
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const ProspectoIDP: number = props.ValeraID
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
            Id: undefined || 0,
            VerDoc: false,
        }
    })

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetDocsByValeraID(props.oidc, { ValeraID: props.ValeraID })
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    console.log(respuesta);
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch((error) => {
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                // {
                //     name: 'ID',
                //     selector: 'ValeraID',
                //     cell: (props) => 
                //         <div style={{width: '100%'}}>
                //             <span>
                //                 {props.ValeraID}
                //             </span>
                //         </div>
                // },
                {
                    name: 'Documento',
                    selector: 'ValeraID',
                    cell: (props, index) =>
                        <div style={{ width: '100%' }}>
                            Doc. Evidencia {index + 1}
                        </div>
                },
                {
                    name: 'Ver Documento',
                    sortable: false,
                    cell: (props) =>
                        <><button data-tip data-for={`btnCV_${props.TipoDocumentoID}`} style={{ width: '100%', textAlign: 'center', paddingTop: '2px', paddingBottom: '2px' }} className="btn btn-link" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...state.Form, Mostrar: false, VerDoc: true,
                                    Datos: {
                                        TipoDocumentoID: props.TipoDocumentoID,
                                        NombreDocumento: props.NombreDocumento,
                                        Clave: props.Clave,
                                        Descripcion: props.Descripcion,
                                        DocumentoID: props.DocumentoID,
                                        Orden: props.Orden,
                                        PersonaID: props.PersonaID,
                                        TipoPersonaID: props.TipoPersonaID,
                                        Ruta: props.Ruta,
                                        Autorizado: props.Autorizado,
                                        rn: props.rn
                                    },
                                    Id: ProspectoIDP
                                }
                            }))
                        }}>
                            VER
                        </button>
                            <ReactTooltip id={`btnCV_${props.TipoDocumentoID}`} type="info" effect="solid">
                                VER DOCUMENTO {props.NombreDocumento}
                            </ReactTooltip></>
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
                    TipoDocumentoID: 0,
                    NombreDocumento: '',
                    Clave: '',
                    Descripcion: '',
                    DocumentoID: 0,
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
    const cbActualizar = (item: any) =>
        setState({
            ...state, Datos: state.Datos.map(Dato => Dato.TipoDocumentoID === item.TipoDocumentoID ? item : Dato), Form: {
                ...state.Form, Mostrar: false, VerDoc: false, Datos: {
                    TipoDocumentoID: 0,
                    NombreDocumento: '',
                    Clave: '',
                    Descripcion: '',
                    DocumentoID: 0,
                    Orden: 0,
                    PersonaID: 0,
                    TipoPersonaID: 0,
                    Ruta: '',
                    Autorizado: false,
                    rn: 0
                }
            }
        })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false, VerDoc: false } })

    return (
        <div className="row">
            <div className="col-12">
                <Card>
                    <label className="form-label mb-0">Documentos Evidencia Entrega</label>
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        noDataComponent={<div style={{ margin: '4em' }}>NO HAY DOCUMENTOS DE EVIDENCIA SUBIDOS</div>}
                                        data={state.DatosMostrar}
                                        striped
                                        //pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"TipoDocumentoID"}
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
                                            <VerDoc DocumentoID={state.Form.Datos.DocumentoID} src={state.Form.Datos.Ruta} fnCancelar={fnCancelar} />
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
export default connect(mapStateToProps, mapDispatchToProps)(DocsEvidencias);
