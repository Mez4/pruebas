//Importaciones
import React from 'react'
import {Formik, Form} from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { iUI } from '../../../../../../interfaces/ui/iUI'
import { toast } from 'react-toastify'
import Select from 'react-select'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Persona from '../Persona'


type CFormType = {
    oidc: IOidc
    ui: iUI,
    //SolicitudGuardadaCancelTemp: boolean,
    DistribuidoraID?: number,
    initialValues: {
        Observaciones: string,
        SolicitudID: number,
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
}


export const SolicitudCancelacionTemporal = (props: CFormType) => {
    const MySwal = withReactContent(Swal)

//Loading
const [loading, setLoading] = React.useState(false)

    return (
        <Formik 
            initialValues={props.initialValues}
            enableReinitialize
 
            onSubmit={(values: any, { resetForm }) => {
            let data = {
                Observaciones: values.Observaciones,
                DistribuidorID: props.DistribuidoraID,
                SolicitudID: values.SolicitudID,
            }

            MySwal.fire({
                title: '<strong> Guardar Solicitud</strong>',
                icon: 'warning',
                html: 
                      <div className='text-center'>
                        <br />
                        <p>¿Desea guardar la solicitud de cancelación temporal?</p>
                      </div>,
                showCloseButton: false,
                showCancelButton: true,
                showConfirmButton: true,
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#3085d6',
                focusConfirm: false,
                confirmButtonAriaLabel: 'Aceptar',
                cancelButtonAriaLabel: ''
            }).then((result) =>{
                if(result.isConfirmed){
                    let timerInterval
                        MySwal.fire(
                            {
                                icon: 'info',
                                html: 
                                     <div>
                                        <br />
                                        <h3 className='text-center'>Aviso</h3>
                                        <div className={`modal-body`}>
                                            <h5 className="text-center">Guardando Solicitud.</h5>
                                        </div>
                                     </div>,
                                timerProgressBar: false,
                                confirmButtonText: `Ok`,
                                allowOutsideClick: false,
                                didOpen: () => {
                                    MySwal.showLoading()
                                },
                                willClose: () =>{
                                    clearInterval(timerInterval)
                                }      
                            }
                        );
                        
                        Funciones.FNSubirSolicitudCT(props.oidc, data)
                             .then((respuesta: any) =>{    
                              props.fnCancelar();  
                        MySwal.fire({
                                icon: 'success',
                                html: 
                                    <div>
                                        <br />
                                        <h3 className="text-center">Éxito</h3>
                                        <div className={`modal-body`}>
                                            <h5 className="text-center">
                                                Solicitud guardada correctamente.
                                            </h5>
                                        </div>
                                    </div>,
                                showCloseButton: false,
                                allowOutsideClick: false,
                                confirmButtonText: 'Aceptar',
                                confirmButtonColor: '#3085d6',
                            })  
                        }) 
                            .catch((error: any) => {
                                MySwal.fire({
                                    icon: 'error',
                                    html:
                                         <div>
                                            <br />
                                         <h3 className="text-center">Error al guardar la solicitud</h3>
                                         <div className={`modal-body`}>
                                            <h5 className="text-center">Ocurrió un problema al guardar la solicitud</h5>
                                         </div>
                                        </div>,
                                        showCancelButton: false,
                                        showConfirmButton: true,
                                        confirmButtonText: 'Aceptar',
                                        confirmButtonColor: '#3085d6',
                                        allowOutsideClick: false,
                                        showCloseButton: true,
                                })
                                     setLoading(false)
                             })                                 
                }
                else {
                    props.fnCancelar();
                    MySwal.fire(
                        {
                            icon: 'info',
                            html:
                                <div>
                                    <br />
                                    <h3 className='text-center'>Aviso</h3>
                                    <div className={`modal-body`}>
                                        <h5 className='text-center'>Operación cancelada.</h5>
                                    </div>
                                </div>,
                                confirmButtonText: 'Continuar',
                                confirmButtonColor: '#3085d6',
                        }
                    );
                }
            })
        }}>
        {
            ({values}) => (
                <Form>
                <div className="column is-full-desktop">
                    <div className="text-center">
                        <CustomFieldText
                            disabled={loading}
                            label="Observaciones"
                            name="Observaciones"
                            placeholder='Ingrese observaciones'
                        />
                    </div>
                </div>
                {loading && <Spinner/>}
                {!loading &&
                    <div className="text-center">
                        <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>

                        <button type="submit" className='ms-2 btn btn-success waves-effect waves-light'>
                            Aceptar
                        </button>
                    </div>

                    
                }
            </Form>
            )
        }
        </Formik>
    )
}
