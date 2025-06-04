import React from 'react'
import { CustomSelect, ModalWin, Spinner } from '../../../../../global'
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

type FormaAsignacionTipo = {
    oidc: IOidc
    Id?: number,
    Item: any,
    optAnalistas: { value: number, label: string }[],
    fnCancelar(): any ,
    cbActualizar(item: any): any,
    // Modal controls
    mostrar: boolean,
}
export const FormaAsignacion = (props: FormaAsignacionTipo) => {
   



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
        axios.post(`${GetServerUrl()}MesaCredito/AsignaAnalistaProspecto/GetAsignaAnalistaProspecto`, {...values}, {
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
                  Asigna Analista 
                </h5>
            </ModalWin.Header>
            <ModalWin.Body>
                <Formik
                    // props.Item?.Correo
                    initialValues={{ analistaID :'' }}
                    enableReinitialize
                    validationSchema={Yup.object().shape({
                        analistaID: Yup.number().min(1, 'selecciona a un analista').required('selecciona a un analista') 
                    })}
                    onSubmit={(values) => {
              
                        let valuesPost: any = { SolicitudMesaCreditoID: props.Item.SolicitudMesaCreditoID, AsignaAnalistaID: values.analistaID , enSucursal :1,CatValidacionMesaID :1}
               
                
                        AsignarRol(valuesPost)
                        setLoading(false)
                        props.fnCancelar()
                     
                    }}>
                    <Form>
                        
                        {loading && <Spinner />}
                        {!loading &&

                            <div className="text-end">
                                
                                <div className="col-5">
                                <CustomSelect 
                                    disabled={loading}
                                    label=""
                                    name="analistaID"
                                    placeholder="Seleccione al analista"
                                    options={props.optAnalistas}
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

    
    
    