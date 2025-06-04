import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

import * as Funciones from './../CatalogoMensajes/Funciones'

// Icons
import { FaChevronRight, FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'

import { FiltrarDatos } from '../../../../../../global/functions'
import ReactTooltip from 'react-tooltip'
// import { CForm } from '../../CatalogoEmpresasExperiencia/CForm'

type CatalogosType = {
    oidc: IOidc,
    MensajeID: number
    ProcesoID: number
    ProcesoName: string
    fnSelectDoc(procesoID: number): any
}

const Documentos = (props: CatalogosType) => {

 // Controll our mounted state
 let isMounted = React.useRef(true)

 const DatosDefecto = { MensajeID: 0, Mensaje: ''}
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
     Funciones.FNGetDocsByStatus(props.oidc, props.MensajeID, props.ProcesoID)
         .then((respuesta: any) => {
             console.log(respuesta);
             setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
         })
         .catch((error) => {
             console.log("###e", error)
             setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
             
         })
 }

function timeout(delay: number) {
    return new Promise(res => setTimeout(res, delay));
}

const cbDocumento = async (Checked : boolean, docID: number) => {
    
    console.log("OK", Checked)
    let check: number = Checked ? 1 : 0
    Funciones.FNUpdateCheckDoc(props.oidc,  props.MensajeID , props.ProcesoID, docID, check)
    await timeout(300);
    await props.fnSelectDoc(0)
    props.fnSelectDoc(props.ProcesoID)
}

 const Columns = React.useMemo(() => {
     let colRet: IDataTableColumn[] =
         [
             {
                 name: '',
                 selector: 'TipoDocumentoID',
                 width: '15%',
                 cell: (props) =>  
                    <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                        <input type="checkbox" disabled={false} className="form-check-input" defaultChecked={props.Activo} onChange={e => cbDocumento(e.target.checked, props.TipoDocumentoID)}/>
                    </div>
             },
             {
                 name: 'DOCUMENTO',
                 selector: 'NombreDocumento',
                 width: '80%',
                 cell: (props) =>
                    <>
                        <label data-tip data-for={`A_${props.NombreDocumento}`} className="LabelInDTable">
                            {props.NombreDocumento}
                        </label>
                        <ReactTooltip id={`A_${props.NombreDocumento}`} type="info" effect="solid">
                            {props.NombreDocumento}
                        </ReactTooltip>
                    </>
             }
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
 }, [props.ProcesoID])

 // On use effect
 React.useEffect(() => {
     setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
     // eslint-disable-next-line
 }, [state.Datos, state.Filtro])

 /** funcion Callback al agregar un item */
 const cbAgregar = (item: any) => {
     setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { MensajeID: 0, Mensaje: '' } } })
 }

 /** funcion Callback al actualizar un item */
 const cbActualizar = (item: any) =>
     setState({ ...state, Datos: state.Datos.map(Dato => Dato.EmpresaExperienciaID === item.EmpresaExperienciaID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { MensajeID: 0, Mensaje: '' } } })

 /** funcion para cancelar la forma */
 const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

 if(props.ProcesoID === 0)
    return <div>
        <Card>
            <Card.Body>
                <Card.Body.Content>
                    <span></span>
                </Card.Body.Content>
            </Card.Body>
        </Card>
    </div>

 return (
     <div className="row">
         <div className="col-12">
             <Card>
                 <Card.Body>
                     <Card.Body.Content>
                         {state.Cargando && <Spinner />}
                         {state.Error && <span>Error al cargar los datos...</span>}
                         {!state.Cargando && !state.Error &&
                             <div className="col-sm-12">
                                 <div className="col-sm-12" style={{padding: '5px', backgroundColor: '#e0e0e0'}}>
                                    <label className="LabelInDTable">
                                        {props.ProcesoName}
                                    </label>
                                 </div>
                                 <DataTable
                                     subHeader
                                     subHeaderComponent=
                                     {
                                         <div className="row">
                                             <div className="col-sm-12" style={{padding: '0px'}}>
                                                 <div className="input-group">
                                                     <input type="text" className="form-control" placeholder="Buscar Documento" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
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
                                     //pagination
                                     dense
                                     noHeader
                                     responsive
                                     keyField={"TipoDocumentoID"}
                                     //defaultSortField={"MensajeID"}
                                     columns={Columns}
                                 />
                                 <ModalWin open={state.Form.Mostrar}>
                                     <ModalWin.Header>
                                         <h5 className={MODAL_TITLE_CLASS}>Agregar Empresas Exoeriencia</h5>
                                     </ModalWin.Header>
                                     <ModalWin.Body>
                                        {/*<CForm
                                             oidc={props.oidc}
                                             initialValues={state.Form.Datos}
                                             Id={state.Form.Id}
                                             cbActualizar={cbActualizar}
                                             cbGuardar={cbAgregar}
                                             fnCancelar={fnCancelar}
                                        />*/}
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
export default connect(mapStateToProps, mapDispatchToProps)(Documentos);