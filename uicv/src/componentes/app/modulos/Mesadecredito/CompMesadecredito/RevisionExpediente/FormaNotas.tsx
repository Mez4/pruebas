import React from 'react'

import * as Funciones from '../../../general/CompGeneral/Notas/Funciones'
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

type FormaNotasTipo = {
    oidc: IOidc
    Id?: number,
    Item: any,
    SolicitudMesaCreditoID : number,
    fnCancelar(): any ,
    cbActualizar(item: any): any,
    mostrar: boolean,
}
export const FormaNotas = (props: FormaNotasTipo) => {
    
  
    
    const [loading, setLoading] = React.useState(false)

    const [isOpen, setIsOpen] = useState(false);

    const DatosDefecto = {MensajeID :0 ,mensaje:'' ,fecha_hora:'' }
    let isMounted = React.useRef(true)
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    


    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Item: undefined,
        DataLoaded:false ,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        }
    
    })


 
   
  // Definimos la funcion para asignar un rol
  const AgregarNota = (values: any) => {

    // Cambiamos el estado a carga
    setState(e => ({ ...e, Cargando: true, Error: false }))

    // Posteamos los datos usando axios
    axios.post(`${GetServerUrl()}MesaCredito/LogMensajes/GetLogMensajes`, {...values}, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${props.oidc.user.access_token}`
        }
    })
        .then(() => {

            // Obtenemos los roles del usuario
          //  ObtenerRoles(props.Item)

        })
        .catch((error) => {

            // Alerta
            
           alert( `${GetServerUrl()}MesaCredito/LogMensajes/GetLogMensajes`
           )

            // Cambiamos el estado a carga
           // definirEstado(e => ({ ...e, Cargando: false, Error: true }))
        })
}
   
  

    const FNGetLocal = (value:any) => {
    
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc, value)
            .then((respuesta: any) => {
              
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))

            

               // console.log(respuesta)
            })
            .catch(() => {
              
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
              
            })
    }

     // Define the columns
     const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'MensajeID', sortable: true, },
                { name: 'Nota', selector: 'mensaje', sortable: true, },
                { name: 'Fecha', selector: 'fecha_hora', sortable: true, }
           
         
               
             
                
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
                  Notas en la solicitud de credito
                </h5>
            </ModalWin.Header>
            <ModalWin.Body>
                <Formik
                    // props.Item?.Correo
                    initialValues={{ Nota: ''}}
                    enableReinitialize
                    validationSchema={Yup.object().shape({
                        Nota: Yup.string().required("Campo obligatorio")
                    })}
                    onSubmit={(values,actions) => {
              

                      let valuesPost: any = { SolicitudMesaCreditoID: props.Item.SolicitudMesaCreditoID , mensaje: values.Nota }
      
                 
                        
                        AgregarNota(valuesPost)
                        
                        actions.setSubmitting(false)
                        actions.resetForm({})
                        FNGetLocal(props.Item.SolicitudMesaCreditoID)
                        
                       // setLoading(false)
                //props.fnCancelar()
                        
                      
                    }}>
                    <Form >
                    <CustomFieldText disabled={loading} label="Nota" name="Nota" placeholder="Nota en solicitud de credito" />
 
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
                                                        <input type="text" className="form-control" placeholder="Buscar Nota" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
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
                                <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Guardar</button>
                            </div>
                        }
                    </Form>
                </Formik>
            </ModalWin.Body>
        </ModalWin>
    )
}

    
    
    