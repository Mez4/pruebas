import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import * as Funciones from './DocsProspecto/Funciones';

import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'

// Icons
import { FaEye, FaSearch, FaCheckCircle, FaClock, FaFileUpload, FaExclamationTriangle, FaMarker } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './DocsProspecto/CForm'
import { FiRefreshCcw , FiXCircle} from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import ReactTooltip from 'react-tooltip';
import VerDoc from './DocsProspecto/VerDoc'


type CatalogosType = {
    oidc: IOidc,
    ProspectoID: number
}

const DocsProspecto = (props: CatalogosType) => {
    
    const MySwal = withReactContent(Swal)
    // Controll our mounted state
    let isMounted = React.useRef(true)

    const DatosDefecto = { TipoDocumentoID: 0, 
        NombreDocumento: '', 
        Clave: '', 
        Descripcion: '',
        DocumentoID: 0,
        Orden: 0,
        PersonaID: 0,
        TipoPersonaID: 0,
        Ruta: '',
        Autorizado: false,
        rn: 0}
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const ProspectoIDP: number = props.ProspectoID
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
    // FUNCIONA PARA ELIMINAR LOS ARCHIVOS OPCIONALES DE PROSPECTO
    const confirmDelete = (rowDocument: any) => {
        // SE GENERA UNA ALERTA DE CONFIRMACION
        MySwal.fire({
            title : `<strong>${rowDocument.NombreDocumento}</strong>`,
            icon : 'warning',
            showCloseButton : true,
            showConfirmButton : true,
            showCancelButton : true,
            confirmButtonText : 'Confirmar',
            cancelButtonText : 'Cancelar',
            html:
                <div className="text-center">
                    ¿Esta seguro de elimnar el documento?
                </div>,
        }).then((result) => {
            console.log(result);
            if (result.isConfirmed) {
                Funciones.FNDeleteDoc(props.oidc, rowDocument.DocumentoID)
                .then((res: any) => {
                    // cbActualizar(rowDocument);
                    toast.success(res.msj)
                    FNGetLocal();
                }).catch(err => {
                    toast.error("No se puede borrar el documento")
                })
            }
        })
    }
    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetDocsByProspectoIDP(props.oidc, props.ProspectoID)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    console.log(respuesta);
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta.data }))
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
                    selector: 'TipoDocumentoID',
                    sortable: true,
                    width: '10%',
                    cell: (props) => 
                        <div style={{width: '100%', textAlign: 'center'}}>
                            <span>
                                {props.TipoDocumentoID}
                            </span>
                        </div>
                },
                {
                    name: 'Nombre Documento',
                    selector: 'NombreDocumento',
                    sortable: true,
                    width: '38%',
                    cell: (props) => 
                        <div style={{width: '100%', textAlign: 'start'}}>
                            {props.NombreDocumento}
                        </div>
                },
                {
                    name: 'Subir Documento',
                    width: '20%',
                    sortable: false,
                    cell: (props) =>
                        <><button disabled={props.Autorizado} data-tip data-for={`btnSD_${props.TipoDocumentoID}`} style={{width: '100%', textAlign: 'center', paddingTop: '2px', paddingBottom: '2px'}} className={props.Autorizado ? 'btn btn-success' : 'btn btn-primary'} type={"button"} onClick={() => {
                            if(props.Autorizado !== true) setState(s => ({
                                ...s,
                                Form: {
                                    ...state.Form, Mostrar: true,
                                    Datos: { TipoDocumentoID: props.TipoDocumentoID, 
                                        NombreDocumento: props.NombreDocumento, 
                                        Clave: props.Clave, 
                                        Descripcion: props.Descripcion,
                                        DocumentoID: props.DocumentoID,
                                        Orden: props.Orden,
                                        PersonaID: props.PersonaID,
                                        TipoPersonaID: props.TipoPersonaID,
                                        Ruta: props.Ruta,
                                        Autorizado: props.Autorizado,
                                        rn: props.rn },
                                    Id: ProspectoIDP
                                }
                            }))
                        }}>
                            {props.Autorizado ? 'VALIDADO' : props.Autorizado === false ? 'SUBIR' : 'SUBIR'}
                        </button>
                        <ReactTooltip id={`btnSD_${props.TipoDocumentoID}`} type="info"effect="solid">
                            SUBIR DOCUMENTO {props.NombreDocumento}
                        </ReactTooltip></>
                },
                {
                    name: 'Ver Documento',
                    width: '15%',
                    sortable: false,
                    cell: (props) =>
                        props.DocumentoID > 0 ? 
                        <>
                            <button data-tip data-for={`btnCV_${props.TipoDocumentoID}`} style={{width: '100%', textAlign: 'center', paddingTop: '2px', paddingBottom: '2px'}} className="btn btn-secondary" type={"button"} onClick={() => {
                                setState(s => ({
                                ...s,
                                Form: {
                                    ...state.Form, Mostrar: false, VerDoc: true,
                                    Datos: { TipoDocumentoID: props.TipoDocumentoID, 
                                        NombreDocumento: props.NombreDocumento, 
                                        Clave: props.Clave, 
                                        Descripcion: props.Descripcion,
                                        DocumentoID: props.DocumentoID,
                                        Orden: props.Orden,
                                        PersonaID: props.PersonaID,
                                        TipoPersonaID: props.TipoPersonaID,
                                        Ruta: props.Ruta,
                                        Autorizado: props.Autorizado,
                                        rn: props.rn },
                                    Id: ProspectoIDP
                                }
                                }))
                            }}>
                            VER
                            </button>
                            <ReactTooltip id={`btnCV_${props.TipoDocumentoID}`} type="info"effect="solid">
                                VER DOCUMENTO {props.NombreDocumento}
                            </ReactTooltip>
                        </> : 
                        <div style={{width: '100%', textAlign: 'center'}}>
                            <span>
                                Pendiente
                            </span>
                        </div>
                },
                {
                    name : 'Eliminar',
                    selector : 'EliminarDocumentoID',
                    sortable : false,
                    minWidth : '8%',
                    width: '8%',
                    
                    cell: (row) => 
                    <>
                        {/* MOSTRARA EL ICONO Y SE PODRA ELMINAR SIEMPRE Y CUANDO EXISTA UN DOCUMENTO */}
                        {(!row.ConsultaBuro && row.DocumentoID > 0) &&
                            <div style={{width: '100%', textAlign: 'center'}} title={'Eliminar Documento'} onClick={() => confirmDelete(row)}>
                            <FiXCircle 
                                size={20}
                                style= 
                                {{ 
                                    cursor : 'pointer',
                                    color :  'red' 
                                }}
                            />
                        </div>
                        }
                        {/* MOSTRARA EL ICONO PERO NO SE PODRA INTERACTUAR YA QUE NO EXISTE ALGUN DOCUMENTO */}
                        {(!row.ConsultaBuro && row.DocumentoID == null) &&
                            <div style={{width: '100%', textAlign: 'center'}} title={'Eliminar Documento'}>
                            <FiXCircle 
                                size={20}
                                style= 
                                {{ 
                                    color : 'gray'
                                }}
                            />
                        </div>
                        }
                        {/* <div style={{width: '100%', textAlign: 'center'}} title={'Eliminar Documento'} onClick={() => confirmDelete(row)}>
                            <FiXCircle 
                                size={20}
                                style= 
                                {{ 
                                    pointerEvents: row.Opcional ? 'auto' : 'none' ,
                                    cursor : 'pointer',
                                    color : row.Opcional ? 'red' : 'gray'
                                }}
                            />
                        </div> */}
                    </>
                },
                {
                    name: 'Subido',
                    selector: 'DocumentoID',
                    sortable: true,
                    width: '9%',
                    cell: (props) =>
                    <>    
                        {(props.Autorizado === false) &&  
                            <div style={{width: '100%', textAlign: 'center'}}>
                                <FaExclamationTriangle color='orange' size={20}/>
                            </div>
                        }
                        
                        {(props.Autorizado || props.Autorizado === null) &&
                            <div style={{width: '100%', textAlign: 'center'}}>
                                {props.DocumentoID > 0 ? <FaCheckCircle color='green' size={20}/> : <FaClock color='gray' size={20}/>}
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
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, VerDoc: false, Datos: { TipoDocumentoID: 0, 
            NombreDocumento: '', 
            Clave: '', 
            Descripcion: '',
            DocumentoID: 0,
            Orden: 0,
            PersonaID: 0,
            TipoPersonaID: 0,
            Ruta: '',
            Autorizado: false,
            rn: 0 } }})
    }
    // ESTA FUNCION SE USA PARA ACTUALIZAR LA TABLA CUANDO SE ENVIAN LOS DATOS, POSIBLEMENTE HAY UNA MEJOR OPCION
    const manejoDeRenglon = (res) => {
        FNGetLocal();
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.TipoDocumentoID === item.TipoDocumentoID ? item : Dato), Form: { ...state.Form, Mostrar: false, VerDoc: false, Datos: { TipoDocumentoID: 0, 
            NombreDocumento: '', 
            Clave: '', 
            Descripcion: '',
            DocumentoID: 0,
            Orden: 0,
            PersonaID: 0,
            TipoPersonaID: 0,
            Ruta: '',
            Autorizado: false,
            rn: 0 } } })

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
                                        //pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"TipoDocumentoID"}
                                        defaultSortField={"Orden"}
                                        columns={Columns}
                                    />
                                    {state.Form.VerDoc &&<ModalWin open={state.Form.VerDoc} center large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>{state.Form.Datos.NombreDocumento}</h5>
                                            <button type="button" className="delete" onClick={() => {
                                                fnCancelar()
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <VerDoc DocumentoID={state.Form.Datos.DocumentoID} fnCancelar={fnCancelar}/>                                            
                                        </ModalWin.Body>
                                    </ModalWin>}
                                    {state.Form.Mostrar &&<ModalWin open={state.Form.Mostrar} center large>
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
                                                updateTable={manejoDeRenglon}
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
export default connect(mapStateToProps, mapDispatchToProps)(DocsProspecto);
