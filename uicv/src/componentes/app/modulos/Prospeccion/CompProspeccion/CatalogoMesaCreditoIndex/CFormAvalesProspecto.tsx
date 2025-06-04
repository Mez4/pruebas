import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import * as Funciones from '../DocsAval/Funciones'

// Icons
import { FaEye, FaSearch, FaCheckCircle, FaClock, FaFileUpload } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../../global'
import { CForm } from '../DocsProspecto/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from './../../../../../../global/functions'
import CFormDocsAval from '../CatalogoMesaCreditoIndex/CFormDocsAval'



import ReactTooltip from 'react-tooltip';
import DocsAval from '../DocsAval'
import ReferenciasAval from '../ReferenciasAval/ReferenciasAval'

type CatalogosType = {
    oidc: IOidc,
    ProspectoID: number,
    Documentos: boolean,
}

const CFormAvalesProspecto = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { AvalID: 0, NombreCompleto: '' }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const ProspectoIDP: number = props.ProspectoID
    const DocsBool: boolean = props.Documentos
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
        Funciones.FNGetAvalesByProspectoID(props.oidc, props.ProspectoID)
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
                    selector: 'AvalID',
                    sortable: true,
                    width: '25%',
                    cell: (props) =>
                         <span className="text-center">
                            {props.AvalID}
                        </span>
                },
                {
                    name: 'Nombre Completo Aval',
                    selector: 'NombreCompleto',
                    sortable: true,
                    width: '45%',
                    cell: (props) =>
                         <span className="text-center">
                            {props.NombreCompleto}
                        </span>
                },
                {
                    name: 'Accion',
                    sortable: true,
                    width: '25%',
                    cell: (props) =>
                        <><button data-tip data-for={`btnVD_${props.AvalID}`} style={{ width: '100%', textAlign: 'center', paddingTop: '2px', paddingBottom: '2px' }} className="btn btn-outline-primary" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...state.Form, Mostrar: true,
                                    Datos: { AvalID: props.AvalID, NombreCompleto: props.NombreCompleto },
                                    Id: props.AvalID
                                }
                            }))
                        }}>
                            VER {(DocsBool ? 'DOCUMENTOS' : 'REFERENCIAS')}
                        </button>
                            <ReactTooltip id={`btnVD_${props.AvalID}`} type="info" effect="solid">
                                VER {(DocsBool ? 'DOCUMENTOS' : 'REFERENCIAS')} DEL AVAL: {props.NombreCompleto}
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
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, VerDoc: false, Datos: { AvalID: 0, NombreCompleto: '' } } })
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.TipoDocumentoID === item.TipoDocumentoID ? item : Dato), Form: { ...state.Form, Mostrar: false, VerDoc: false, Datos: { AvalID: 0, NombreCompleto: '' } } })

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
                                        keyField={"AvalID"}
                                        defaultSortField={"AvalID"}
                                        columns={Columns}
                                    />
                                    {state.Form.Mostrar && <ModalWin open={state.Form.Mostrar} center large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>{(DocsBool ? 'DOCUMENTOS' : 'Referencias')} AVAL <br /> AVAL: &nbsp; {state.Form.Datos.AvalID} &nbsp; {state.Form.Datos.NombreCompleto} </h5>
                                            <button type="button" className="delete" onClick={() => {
                                                fnCancelar()
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {DocsBool && <CFormDocsAval AvalID={state.Form.Id} ProspectoID={props.ProspectoID} />}
                                            {/* {!DocsBool && <ReferenciasAval AvalID={state.Form.Id}/>} */}
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
export default connect(mapStateToProps, mapDispatchToProps)(CFormAvalesProspecto);
