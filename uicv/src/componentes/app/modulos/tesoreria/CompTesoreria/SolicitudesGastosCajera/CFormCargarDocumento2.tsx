import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomFieldImgUpload } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'

type CFormType = {
    oidc: IOidc
    Id?: number,
    DocumentoID: number,
    SolicitudGastoID: number,
    SolicitudDetalleID: number,
    initialValues: {
        file: string
    },
    cbActualizar(item: any): any,
    fnActualizarDetalle(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(): any
    fnCancelarMostrarCargaDeDocumento(): any

}

export const CFormCargarDocumento2 = (props: CFormType) => {

    // Loading
    const [loading, setLoading] = React.useState(false)

    // Return the component
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                file: Yup.string().required("Selecciona un archivo")
            })}
            onSubmit={(values: any) => {

                console.log(values.file, "Datos Imagen")
                // Set our form to a loading state
                setLoading(true)
                console.log(`values iniciados`, values)
                const formData = new FormData()
                formData.append('SolicitudGastoID', props.SolicitudGastoID.toString())
                formData.append('SolicitudDetalleID', props.SolicitudDetalleID.toString())
                formData.append('Descripcion', values.Descripcion)
                formData.append('DocumentoID', props.DocumentoID.toString())
                formData.append('NombreDocumento', values.NombreDocumento)
                formData.append('doc', values.file);

                // Finish the callback
                Funciones.FNSubirEvidenciaCot(props.oidc, formData)
                    .then((respuesta: any) => {
                        setLoading(false)
                        props.fnCancelarMostrarCargaDeDocumento()
                        const MySwal = withReactContent(Swal)
                        MySwal.fire({
                            title: 'Evidencia subida correctamente',
                            html: <div className="text-center">
                                <p>El documento se subio correctamente</p>
                                <p>¿Desea subir otro documento?, para hacerlo, sólo presiona nuevamente subir.</p>

                            </div>,
                            // text: `El pago intencion debe ser mayor al 5% del saldo actual`,
                            icon: 'success',
                            showCloseButton: false,
                            showCancelButton: true,
                            showConfirmButton: false,
                            focusConfirm: false,
                            // confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#3085d6',
                            cancelButtonText: 'Cerrar',
                            confirmButtonAriaLabel: '',
                            cancelButtonAriaLabel: ''
                        })
                    })
                    .catch((error: any) => {
                        toast.error("Error al subir documento, ya se subio evidencia de este rubro")
                        setLoading(false)
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
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelarMostrarCargaDeDocumento}>
                            Cancelar
                        </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Subir Documento</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}