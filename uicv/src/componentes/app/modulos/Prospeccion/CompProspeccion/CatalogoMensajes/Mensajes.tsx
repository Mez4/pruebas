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
import { CForm } from '../CatalogoMensajes/CForm'

type CatalogosType = {
    oidc: IOidc
    fnSelectMensaje(mensajeID: number, mensajeName: string): any
    Mostrar: boolean
    fnCancelar(): any
}

const Mensajes = (props: CatalogosType) => {

 // Controll our mounted state
 let isMounted = React.useRef(true)

 const DatosDefecto = { MensajeID: 0, Mensaje: ''}
 const Datos: any[] = []
 const DatosMostrar: any[] = []
 const [stateM, setStateM] = React.useState({
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

     setStateM(s => ({ ...s, Cargando: true }))
     Funciones.FNGet(props.oidc, stateM.Form.Datos.MensajeID)
         .then((respuesta: any) => {
             if (isMounted.current === true) {
                 console.log(respuesta);
                 setStateM(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
             }
         })
         .catch((error) => {
             console.log("###e", error)
             if (isMounted.current === true) {
                 setStateM(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
             }
         })
 }

 function timeout(delay: number) {
    return new Promise(res => setTimeout(res, delay));
 }

 const SelectMensaje = async (mensajeID: number, item: any) => {
     setStateM({ ...stateM, DatosMostrar: stateM.Datos.map(Dato => Dato.MensajeID === item.MensajeID ? {...item, selected: true} : Dato) })
     props.fnSelectMensaje(mensajeID, item.Mensaje);
     await timeout(300);
     window.scrollTo({ top: 0, behavior: 'auto' });
 }

 const Columns = React.useMemo(() => {
     let colRet: IDataTableColumn[] =
         [
            //  {
            //      name: 'ID',
            //      selector: 'MensajeID',
            //      width: '15%'
            //  },
             {
                 name: 'MENSAJE',
                 selector: 'Mensaje',
                 width: '85%',
                 cell: (props) =>
                    <>
                        <label data-tip data-for={`A_${props.MensajeID}`} className="LabelInDTable">
                            {props.Mensaje}
                        </label>
                        <ReactTooltip id={`A_${props.MensajeID}`} type="info" effect="solid">
                            {props.Mensaje}
                        </ReactTooltip>
                    </>
             },
             {
                 name: '',
                 selector: 'MensajeID',
                 width: '10%',
                 cell: (props) =>
                     <button className="asstext" type={"button"} onClick={() => {SelectMensaje(props.MensajeID, props)}}>
                         <FaChevronRight color={props.selected == true ? 'black' : 'gray'}/>
                     </button>
             },
         ]
     return colRet
 }, [stateM.Form])

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
     setStateM(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, stateM.Filtro) }))
     // eslint-disable-next-line
 }, [stateM.Datos, stateM.Filtro])

 /** funcion Callback al agregar un item */
 const cbAgregar = (item: any) => {
     setStateM({ ...stateM, Datos: [item, ...stateM.Datos], Form: { ...stateM.Form, Mostrar: false, Datos: { MensajeID: 0, Mensaje: '' } } })
     props.fnCancelar()
 }

 /** funcion Callback al actualizar un item */
 const cbActualizar = (item: any) =>
     setStateM({ ...stateM, Datos: stateM.Datos.map(Dato => Dato.EmpresaExperienciaID === item.EmpresaExperienciaID ? item : Dato), Form: { ...stateM.Form, Mostrar: false, Datos: { MensajeID: 0, Mensaje: '' } } })

 /** funcion para cancelar la forma */
 const fnCancelar = () => props.fnCancelar()

 return (
     <div className="row">
         <div className="col-12">
             <Card>
                 <Card.Body>
                     <Card.Body.Content>
                         {stateM.Cargando && <Spinner />}
                         {stateM.Error && <span>Error al cargar los datos...</span>}
                         {!stateM.Cargando && !stateM.Error &&
                             <div className="col-sm-12">
                                 <div className="col-sm-12" style={{padding: '5px', backgroundColor: '#e0e0e0'}}>
                                    <label className="LabelInDTable">
                                        MENSAJES
                                    </label>
                                 </div>
                                 <DataTable
                                     subHeader
                                     subHeaderComponent=
                                     {
                                         <div className="row">
                                             <div className="col-sm-12" style={{padding: '0px'}}>
                                                 <div className="input-group">
                                                     <input type="text" className="form-control" placeholder="Buscar Mensaje" value={stateM.Filtro} onChange={e => setStateM(s => ({ ...s, Filtro: e.target.value }))} />
                                                     <span className="input-group-text"><FaSearch /> </span>
                                                     {/* <button className="btn btn-outline-secondary" type="button"
                                                         onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                                     ><FaPlus /></button>
                                                     <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button> */}
                                                 </div>
                                             </div>
                                         </div>
                                     }
                                     data={stateM.DatosMostrar}
                                     striped
                                     //pagination
                                     dense
                                     noHeader
                                     responsive
                                     keyField={"MensajeID"}
                                     //defaultSortField={"MensajeID"}
                                     columns={
                                        [
                                           //  {
                                           //      name: 'ID',
                                           //      selector: 'MensajeID',
                                           //      width: '15%'
                                           //  },
                                            {
                                                name: 'MENSAJE',
                                                selector: 'Mensaje',
                                                width: '85%',
                                                cell: (props) =>
                                                   <>
                                                       <label data-tip data-for={`A_${props.MensajeID}`} className="LabelInDTable">
                                                           {props.Mensaje}
                                                       </label>
                                                       <ReactTooltip id={`A_${props.MensajeID}`} type="info" effect="solid">
                                                           {props.Mensaje}
                                                       </ReactTooltip>
                                                   </>,
                                                conditionalCellStyles: [
                                                    {
                                                        when: row => row.selected == true,
                                                        style: { backgroundColor: '#e0e0e0', fontWeight: 'bold' },
                                                    },
                                                ]
                                            },
                                            {
                                                name: '',
                                                selector: 'MensajeID',
                                                width: '10%',
                                                cell: (props) =>
                                                    <button className="asstext" type={"button"} onClick={() => {SelectMensaje(props.MensajeID, props)}}>
                                                        <FaChevronRight color={props.selected == true ? 'black' : 'gray'}/>
                                                    </button>,
                                                conditionalCellStyles: [
                                                    {
                                                        when: row => row.selected == true,
                                                        style: { backgroundColor: '#e0e0e0', fontWeight: 'bold' },
                                                    },
                                                ]
                                            },
                                        ]}
                                 />
                                 <ModalWin open={props.Mostrar} center>
                                     <ModalWin.Header>
                                         <h5 className={MODAL_TITLE_CLASS}>Agregar Nuevo Mensaje</h5>
                                     </ModalWin.Header>
                                     <ModalWin.Body>
                                        {<CForm
                                             oidc={props.oidc}
                                             initialValues={stateM.Form.Datos}
                                             Id={stateM.Form.Id}
                                             cbActualizar={cbActualizar}
                                             cbGuardar={cbAgregar}
                                             fnCancelar={fnCancelar}
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
export default connect(mapStateToProps, mapDispatchToProps)(Mensajes);