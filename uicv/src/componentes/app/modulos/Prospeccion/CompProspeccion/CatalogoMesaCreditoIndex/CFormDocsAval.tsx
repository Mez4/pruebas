import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import * as Funciones from '../DocsAval/Funciones'

// Icons
import { FaEye, FaSearch, FaCheckCircle, FaClock, FaFileUpload,FaTimesCircle } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../../global'
import { CForm } from '../DocsAval/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../../global/functions'
import ReactTooltip from 'react-tooltip';
import VerDocAval from '../DocsAval/VerDoc'
import CFormVerDocumentosAval from '../CatalogoMesaCreditoIndex/CFormVerDocumentosAval'

type CatalogosType = {
    oidc: IOidc,
    AvalID: number,
    ProspectoID: number
}

const CFormDocsAval = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { TipoDocumentoAvalID: 0, 
        NombreDocumento: '', 
        Clave: '', 
        Descripcion: '',
        DocumentoAvalID: 0,
        Orden: 0,
        PersonaID: 0,
        TipoPersonaID: 0,
        Ruta: '',
        Autorizado: false,
        rn: 0}
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const AvalIDP: number = props.AvalID
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
            CFormVerDocumentosAval: false,
        },
        Estado: 0,
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
                    width: '25%',
                    cell: (props) =>
                         <span className="text-center">
                            {props.TipoDocumentoAvalID}
                        </span>
                },
                {
                    name: 'Nombre Documento',
                    selector: 'NombreDocumento',
                    sortable: true,
                },
               
                {
                    name: 'Ver Documento',
                    width: '20%',
                    sortable: false,
                    cell: (props) =>
                        props.DocumentoAvalID > 0 ? <><button data-tip data-for={`btnCV_${props.TipoDocumentoAvalID}`} style={{width: '100%', textAlign: 'center', paddingTop: '2px', paddingBottom: '2px'}} className="btn btn-secondary" type={"button"} onClick={() => {
                            FnEstado(props.Estado)
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...state.Form, Mostrar: false, CFormVerDocumentosAval: true,
                                    Datos: { TipoDocumentoAvalID: props.TipoDocumentoAvalID, 
                                        NombreDocumento: props.NombreDocumento, 
                                        Clave: props.Clave, 
                                        Descripcion: props.Descripcion,
                                        DocumentoAvalID: props.DocumentoAvalID,
                                        Orden: props.Orden,
                                        PersonaID: props.PersonaID,
                                        TipoPersonaID: props.TipoPersonaID,
                                        Ruta: props.Ruta,
                                        Autorizado: props.Autorizado,
                                        rn: props.rn },
                                    Id: AvalIDP
                                }
                            }))
                        }}>
                            VER
                        </button>
                        <ReactTooltip id={`btnCV_${props.TipoDocumentoAvalID}`} type="info"effect="solid">
                            VER DOCUMENTO {props.NombreDocumento}
                        </ReactTooltip></> : <div style={{width: '100%', textAlign: 'center'}}>
                            <span>
                                Pendiente
                            </span>
                        </div>
                },

                {
                    name: 'Estatus',
                    selector: 'Estado',
                    sortable: true,
                    width: '10%',
                    cell: (props) =>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            {props.Estado == 1 && <FaCheckCircle color='green' size={20} />} 
                            {props.Estado == 2 && <FaTimesCircle color='red' size={20} />}
                            {props.Estado == 3 && <FaClock color='gray' size={20} />}
                        </div>
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

    const FnEstado = (Estado: number) => {
        setState(s => ({ ...s, Estado: Estado }))
        //console.log(state.Nota)
    }

    /** funcion Callback al agregar un item */
    // const cbAgregar = (item: any) => {
    //     setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, VerDoc: false, Datos: { TipoDocumentoAvalID: 0, 
    //         NombreDocumento: '', 
    //         Clave: '', 
    //         Descripcion: '',
    //         DocumentoAvalID: 0,
    //         Orden: 0,
    //         PersonaID: 0,
    //         TipoPersonaID: 0,
    //         Ruta: '',
    //         Autorizado: false,
    //         rn: 0 } }})
    // }


    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false, CFormVerDocumentosAval: false } })

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
                                    {state.Form.CFormVerDocumentosAval &&<ModalWin open={state.Form.CFormVerDocumentosAval} center large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>{state.Form.Datos.NombreDocumento}</h5>
                                            <button type="button" className="delete" onClick={() => {
                                                fnCancelar()
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormVerDocumentosAval DocumentoAvalID={state.Form.Datos.DocumentoAvalID} fnCancelar={fnCancelar} Estado={state.Estado} FNGetLocal={FNGetLocal} Id={props.ProspectoID} AvalID={props.AvalID} NombreDocumento={state.Form.Datos.NombreDocumento}/>                                            
                                        </ModalWin.Body>
                                    </ModalWin>}
                                    {state.Form.Mostrar &&<ModalWin open={state.Form.Mostrar} center large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>{state.Form.Datos.NombreDocumento}</h5>
                                            <button type="button" className="delete" onClick={() => {
                                                fnCancelar()
                                            }} />
                                        </ModalWin.Header>
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
export default connect(mapStateToProps, mapDispatchToProps)(CFormDocsAval);
