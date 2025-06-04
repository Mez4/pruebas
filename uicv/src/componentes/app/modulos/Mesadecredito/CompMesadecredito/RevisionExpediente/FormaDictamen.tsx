import React from 'react'
import { CustomFieldText, CustomSelect, ModalWin, Spinner } from '../../../../../global'
import * as FnAnalista from '../../../general/CompGeneral/Analistas/Funciones'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { FaLock } from 'react-icons/fa'
import { toast } from 'react-toastify'
import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import { useState } from 'react';

type FormaDictamenTipo = {
    oidc: IOidc
    Id?: number,
    Item: any,
    optAnalistas: { value: number, label: string }[],
    fnCancelar(): any ,
    cbActualizar(item: any): any,
    // Modal controls
    mostrar: boolean,
}
export const FormaDictamen = (props: FormaDictamenTipo) => {
   



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

   
      // Definimos la funcion para asignar un rol
      const AsignarRol = (values: any) => {

        // Cambiamos el estado a carga
        definirEstado(e => ({ ...e, Cargando: true, Error: false }))

        // Posteamos los datos usando axios
        axios.post(`${GetServerUrl()}MesaCredito/sp_Dictamen/GetDictamen`, {...values}, {
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
                  Dictamen 
                </h5>
            </ModalWin.Header>
            <ModalWin.Body>
                <Formik
                    // props.Item?.Correo
                    initialValues={{ monto :'' }}
                    enableReinitialize
                    validationSchema={Yup.object().shape({
                        monto: Yup.string().required("Para dictamnar una solicitud de credito tienes que ingresar un monto")
                    })}
                    onSubmit={(values,actions) => {
                        console.log('values' + values)
                        let valuesPost: any = { SolicitudMesaCreditoID: props.Item.SolicitudMesaCreditoID ,monto:values.monto}
               
                
                        AsignarRol(valuesPost)
                        setLoading(false)
                        actions.setSubmitting(false)
                        actions.resetForm({})

                        props.fnCancelar()

                     
                    }}>
                    <Form>
                                 <CustomFieldText disabled={loading} label="$ Monto" name="monto" placeholder="Monto Dictaminado" />
                        {loading && <Spinner />}
                        {!loading &&

                            <div className="text-end">
                                
                                
                                <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                    Cancelar
                                </button>
                                <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Dictamen</button>
                            </div>
                        }
                    </Form>
                </Formik>
            </ModalWin.Body>
        </ModalWin>
    )
}

    
    
    