import React from 'react'

import * as Funciones from '../../../general/CompGeneral/Tiempos/Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import { useState } from 'react';
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { FiRefreshCcw } from 'react-icons/fi'
import { Card, CustomFieldText, Spinner } from '../../../../../global'
import { FaPlus, FaSearch } from 'react-icons/fa'
import { FiltrarDatos } from '../../../../../../global/functions'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'

type FormaTiempoTipo = {
    oidc: IOidc
    Id?: number,
    Item: any,
    SolicitudMesaCreditoID : number,
    fnCancelar(): any ,
    cbActualizar(item: any): any,
    mostrar: boolean,
}
export const FormaTiempo = (props: FormaTiempoTipo) => {
    
    const [loading, setLoading] = React.useState(false)



    const DatosDefecto = {MensajeID :0 ,mensaje:'' ,fecha_hora:'' }
    let isMounted = React.useRef(true)
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    
    const [Estado, definirEstado] = React.useState({
        Datos: DatosDefecto,
        Cargando: false,
        Error: false,
        Tipo: 'Zona',
        asel:  0
    })

    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Item: undefined,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        }
    
    })


  
   


    const FNGetLocal = (value:any) => {
    
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc, value)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))

                }

               // console.log(respuesta)
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

     // Define the columns
     const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'TiempoID', sortable: true, },
                { name: 'Solicitud', selector: 'SolicitudMesaCreditoID', sortable: true, },
                { name: 'Motivo' , selector: 'Motivo' , sortable:true ,} ,
                { name: 'Tiempo', selector: 'Tiempo', sortable: true, }
           
         
               
             
                
            ]
        return colRet
    }, [])
   
  

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
   
            if(state.Cargando && props.Item)
            {
                FNGetLocal(props.Item.SolicitudMesaCreditoID)
            }

    }, [state.Datos, state.Filtro,state.Cargando,props])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) =>
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { MensajeID :0 , mensaje: '', fecha_hora : '' } } })

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.avalTipoId === item.avalTipoId ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { MensajeID :0 , mensaje: '', fecha_hora : ''} } })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        
        <ModalWin   open={props.mostrar} large >
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                  Tiempos en la solicitud de credito
                </h5>
            </ModalWin.Header>
            <ModalWin.Body>
                <Formik
                    // props.Item?.Correo
                    initialValues={{ Nota: ''}}
                    enableReinitialize
                   
                    onSubmit={(values,actions) => {
              

                      //let valuesPost: any = { SolicitudMesaCreditoID: props.Item.SolicitudMesaCreditoID , mensaje: values.Nota }
      
                 
                        setLoading(true)
                        actions.setSubmitting(false)
                        actions.resetForm({})
              
                        
                      
                    }}>
                    <Form>
         
 
                        {loading && <Spinner />}
                        {!loading &&


            <div className="text-end">
       
       
          

                <Card Title="">
                
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
                                                        <input type="text" className="form-control" placeholder="Buscar Motivo" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                    
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal(props.Item.SolicitudMesaCreditoID)}><FiRefreshCcw /></button>
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
                                        keyField={"MensajeID"}
                                        defaultSortField={"mensaje"}
                                        columns={Columns}
                                    />
                                   
                           

                                </div>
                            }
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
                               
                                <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                    Cancelar
                                </button>
                              
                            </div>
                        }
                    </Form>
                </Formik>
            </ModalWin.Body>
        </ModalWin>
    )
}

    
    
    