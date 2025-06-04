import React, { useRef } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, CustomSelect, Spinner, CustomFieldImgUpload, CustomFieldPdfUpload, CustomFieldPdfUpload2 } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { FaCheck, FaCircle, FaClone, FaEye, FaPencilAlt, FaPlus, FaPrint, FaSearch } from 'react-icons/fa'
import { iUI } from '../../../../../../interfaces/ui/iUI'
import Select from 'react-select'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { toast } from 'react-toastify'

type CFormType = {
    oidc: IOidc
    ui: iUI,
   // Id?: number,
      DistribuidoraID?: number,
    initialValues: {
        Observaciones: string,
        file: string, 
        Ruta: string,
        SolicitudID: number,
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
}
export const SolicitudFallecimiento = (props: CFormType) => {
    const MySwal = withReactContent(Swal);

    // Loading
    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                file: Yup.string().required("Selecciona un archivo")
            })
            }
            onSubmit = {(values: any) => {
                setLoading(true)
                console.log('values', values)
                const formData = new FormData()
                formData.append('doc', values.file)
                formData.append('Ruta', values.Ruta)
                formData.append('SolicitudID', values.SolicitudID)
                formData.append('Observaciones', values.Observaciones)
                formData.append('DistribuidorID', `${props.DistribuidoraID}`)
                console.log('formdata', formData)
                MySwal.fire({
                    title: '<strong> Guardar Solicitud</strong>',
                    icon: 'warning',
                    html: 
                          <div className='text-center'>
                            <br />
                            <p>¿Desea guardar la solicitud de fallecimiento?</p>
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

                        Funciones.FNSubirSolicitud(props.oidc, formData)
                            .then((respuesta: any) => {
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
                    } else {
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
                ({ values }) => (
                    <Form>
                            <div className="columns is-centered is-full-mobile is-multiline">
                            <div className="col-6">
                                
                                    <CustomFieldPdfUpload2
                                        disabled={loading}
                                        label="Documento Acta de Defunción"
                                        name="file"
                                        imageSrc={'data:image/png;base64,' + ''}
                                    />
                                </div>

                                <div className="column is-full-desktop is-full-mobile text-center">
                                    <CustomFieldText
                                        disabled={loading}
                                        label="Observaciones"
                                        name="Observaciones"
                                        placeholder="Ingrese observaciones (Opcional)" />
                                </div>

                            </div>
                        {loading && <Spinner />}
                        {!loading &&
                            <div className="text-end">
                                <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                    Cancelar
                                </button>
                                <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Aceptar</button>
                            </div>
                        }
                    </Form>
                )
            }
        </Formik >
    )
}