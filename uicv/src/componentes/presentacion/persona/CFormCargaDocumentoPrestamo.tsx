import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomFieldImgUpload } from '../../.../../global'
import * as Funciones from './CompPerfilPersona/FuncionesPrestamos'
import { IOidc } from '../../../..../..//interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

type CFormType = {
    oidc: IOidc
    Id?: number,
    DocumentoID?: number,
    SolicitudPrestamoPersonalID: number,
    initialValues: {
        file: string
    },
    cbActualizarPrestamo?(item: any): any,
    fnActualizarDetallePrestamo?(item: any): any,
    cbGuardarPrestamo?(item: any): any
    fnCancelarMostrarCargaDeDocumentoPrestamo(): any
    fnMostrarSubirEvidenciaPrestamo(): any
}


export const CFormCargaDocumentoPrestamo = (props: CFormType) => {

    const MySwal = withReactContent(Swal)

    // Loading
    const [loading, setLoading] = React.useState(false)
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                file: Yup.string().required("Selecciona un archivo")
            })}
            onSubmit={(values: any, { resetForm }) => {
                console.log(values.file)
                // Set our form to a loading state
                setLoading(true)
                const formData = new FormData()
                formData.append('SolicitudPrestamoPersonalID', props.SolicitudPrestamoPersonalID.toString())
                formData.append('NombreDocumento', values.NombreDocumento)
                formData.append('doc', values.file);

                Funciones.FNSubirEvidenciaPrestamo(props.oidc, formData)
                    .then((respuesta: any) => {
                        setLoading(false)
                        props.fnCancelarMostrarCargaDeDocumentoPrestamo()
                        // props.cbGuardar(respuesta)
                        MySwal.fire({
                            title: '<strong>Evidencia cargada correctamente</strong>',
                            icon: 'question',
                            html:
                                <div className="text-center">
                                    <br></br>
                                    <h5>¿Deseas subir más evidencias?</h5>
                                </div>,
                            showCloseButton: false,
                            showCancelButton: true,
                            showConfirmButton: true,
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Si',
                            cancelButtonText: 'No',
                            confirmButtonColor: '#3085d6',
                            focusConfirm: false,
                            confirmButtonAriaLabel: 'Aceptar',
                            cancelButtonAriaLabel: ''
                        }).then((result) => {
                            if (result.isConfirmed) {
                                resetForm()
                                props.fnMostrarSubirEvidenciaPrestamo()
                            } else {

                                props.fnCancelarMostrarCargaDeDocumentoPrestamo

                            }
                        })
                    })
                    .catch((error: any) => {
                        console.log(JSON.stringify(error))
                        setLoading(false)
                        toast.error("Error al guardar el documento")
                    })
                console.log(formData)
            }}>
            <Form>
                <div className="row">
                    <div className="col-md-2">
                    </div>
                    <div className="col-md-8">
                        <CustomFieldImgUpload
                            disabled={loading}
                            label="Documento"
                            name="file"
                            imageSrc={'data:image/png;base64,' + ''}
                        />
                    </div>
                    <div className="col-md-2">
                    </div>
                </div>

                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        {/*   <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelarMostrarCargaDeDocumento}>
                            Cancelar
                        </button> */}
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Subir Documento</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}