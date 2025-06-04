import React, { useCallback } from 'react'

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
import ImageViewer from "react-simple-image-viewer";
import Parent from '../../../general/CompGeneral/Documento/Parent'


type FormaDocumentoTipo = {
    oidc: IOidc
    Id?: number,
    Item: any,
    SolicitudMesaCreditoID : number,
    fnCancelar(): any ,
    cbActualizar(item: any): any,
    mostrar: boolean,
  
}
export const FormaDocumento = (props: FormaDocumentoTipo) => {
    const [name, setName] = useState("i'm Grand Parent");

    const [currentImage, setCurrentImage] = useState(0);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const images = [
        "https://appcfecontigo.com.mx/wp-content/uploads/2020/06/recibo-de-luz-cfe-impreso-domestico.jpg",
        "https://info7rm.blob.core.windows.net.optimalcdn.com/images/2016/11/09/452034_credencial-focus-0-0-690-460.jpg"
      ];

   
    const openImageViewer = useCallback((index) => {
        setCurrentImage(index);
        setIsViewerOpen(true);
      }, []);
    
      const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
      };
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
        images ,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        }
    
    })


  
   


    
   

    

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) =>
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { MensajeID :0 , mensaje: '', fecha_hora : '' } } })

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.avalTipoId === item.avalTipoId ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: { MensajeID :0 , mensaje: '', fecha_hora : ''} } })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })



const GuardaTiempo = (values: any) => {
    definirEstado(e => ({ ...e, Cargando: true, Error: false }))

    axios.post(`${GetServerUrl()}MesaCredito/sp_Documentos/Getsp_DocumentosInsert`, {...values}, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${props.oidc.user.access_token}`
        }
    })
        .then(() => {
        })
        .catch((error) => {
        })
}


    return (
        
        <ModalWin   open={props.mostrar} large >
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                 Documentos solicitud de credito
                </h5>
            </ModalWin.Header>
            <ModalWin.Body>
                <Formik
                
                    initialValues={{ }}
                    enableReinitialize
                   
                    onSubmit={(values,actions) => {
              
                        let valuesPost: any = { SolicitudMesaCreditoID: props.Item.SolicitudMesaCreditoID,tipo :2}
               
                
                        GuardaTiempo(valuesPost)
                        setLoading(false)
                        props.fnCancelar()
                        actions.setSubmitting(false)
                        actions.resetForm({})

                     
                    }}>
                    <Form>
         
 
                       


            <div className="text-center">
       
       
          

                <Card Title="">
                
                    <Card.Body>
                        <Card.Body.Content>
                 
                                <div>
                                {images.map((src, index) => (
                                  <img
                                    src={src}
                                    onClick={() => openImageViewer(index)}
                                    width="300"
                                    key={index}
                                    style={{ margin: "2px" }}
                                    alt=""
                                  />
                                ))}
                          
                                {isViewerOpen && (
                                  <ImageViewer
                                    src={images}
                                    currentIndex={currentImage}
                                    onClose={closeImageViewer}
                                    disableScroll={false}
                                    backgroundStyle={{
                                      backgroundColor: "rgba(0,0,0,0.9)"
                                    }}
                                    closeOnClickOutside={true}
                                  />
                                )}
                              </div>
                                    
                        
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
                               
                                <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                    Cancelar
                                </button>
                                <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Revisado</button>
                              
                            </div>
                    
                    </Form>
                </Formik>
            </ModalWin.Body>
        </ModalWin>
    )
}

    
    
    