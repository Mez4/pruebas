
import React from 'react'
import { CustomSelect, ModalWin, Spinner } from '../../../../../global'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import { useState } from 'react';

type FormaConsolidacionTipo = {
    oidc: IOidc
    Id?: number,
    Item: any,
    optDistribuidoresNiveles: { value :number ,label :string}[],
    optDistribuidoresEstatus: { value :string ,label :string}[],
    fnCancelar(): any ,
    cbActualizar(item: any): any,
    // Modal controls
    mostrar: boolean,
}
export const FormaConsolidacion = (props: FormaConsolidacionTipo) => {
   



    // Loading
    const [loading, setLoading] = React.useState(false)
    const DatosDefecto: any[] = []
    //  Estado
    const [Estado, definirEstado] = React.useState({
        Datos: DatosDefecto,
        Cargando: false,
        Error: false,
        Tipo: 'Zona',
        asel:  0
    })
     let lblmsj  = ''

   
      // Definimos la funcion para asignar un rol
      const AsignarRol = (values: any) => {

        // Cambiamos el estado a carga
        definirEstado(e => ({ ...e, Cargando: true, Error: false }))

        // Posteamos los datos usando axios
        axios.post(`${GetServerUrl()}MesaCredito/sp_Consolidacion/GetConsolidacion`, {...values}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${props.oidc.user.access_token}`
            }
        })
            .then((respuesta) => {

                  
                 lblmsj=respuesta.data[0].msj 
                // console.log(lblmsj)
                alert(lblmsj)


            })
            .catch((error) => {

                // Alerta
               alert(error)

                // Cambiamos el estado a carga
               // definirEstado(e => ({ ...e, Cargando: false, Error: true }))
            })
    }
    // Return the component
    return (
        
        <ModalWin open={props.mostrar} large >
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                  Asigna Analista 
                </h5>
            </ModalWin.Header>
            <ModalWin.Body>
                <Formik
                    // props.Item?.Correo
                    initialValues={{ DistribuidorNivelID :'' ,DistribuidoresEstatusID : ''}}
                    enableReinitialize
                    validationSchema={Yup.object().shape({
                        DistribuidorNivelID: Yup.number().min(1, 'selecciona un nivel').required('selecciona un nivel') ,
                        DistribuidoresEstatusID: Yup.number().min(1, 'selecciona un estatus').required('selecciona un estatus')
                    })}
                    onSubmit={(values) => {
              
                        let valuesPost: any = { SolicitudMesaCreditoID: props.Item.SolicitudMesaCreditoID, DistribuidorNivelID: values.DistribuidorNivelID , DistribuidoresEstatusID : values.DistribuidoresEstatusID}
               
                     //    console.log(valuesPost)
                        AsignarRol(valuesPost)
                        setLoading(false)
                       // props.fnCancelar()
                     
                    }}>
                    <Form>
                        
                        {loading && <Spinner />}
                        {!loading &&

                            <div className="text-end">
                                
                                <div className="col-5">
                                <CustomSelect 
                                    disabled={loading}
                                    label=""
                                    name="DistribuidorNivelID"
                                    placeholder="Seleccione el nivel"
                                    options={props.optDistribuidoresNiveles}
                                    addDefault={false}
                                    isMulti={false}
                                />

                                <CustomSelect 
                                    disabled={loading}
                                    label=""
                                    name="DistribuidoresEstatusID"
                                    placeholder="Seleccione el Estatus"
                                    options={props.optDistribuidoresEstatus}
                                    addDefault={false}
                                    isMulti={false}
                                />

                                
                                </div>
                                <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                    Cancelar
                                </button>
                                <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Asignar</button>
                            </div>
                        }
                    </Form>
                </Formik>
            </ModalWin.Body>
        </ModalWin>
    )
}

    
    
    