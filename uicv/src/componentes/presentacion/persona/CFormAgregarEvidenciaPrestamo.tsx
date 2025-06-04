
import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomFieldImgUpload, CustomFieldPdfUpload, ModalWin } from '../../global'
import * as Funciones from './CompPerfilPersona/Funciones'
import { IOidc } from '../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { MODAL_TITLE_CLASS } from '../../global/ModalWin'

type CFormType = {
    oidc: IOidc
    Id?: number,
    DocumentoID: number,
    SolicitudPrestamoPersonalID: number,
    initialValues: {
        file: string
    },
    fnCancelarMostrarCargaDeDocumentoPrestamo(): any,
    FNGetLocal(): any
}

export const CFormAgregarEvidenciaPrestamo = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                file: Yup.string().required("")
            })}
            onSubmit={(values: any) => {
                setLoading(true)
                const formData = new FormData()
                formData.append('SolicitudPrestamoPersonalID', props.SolicitudPrestamoPersonalID.toString())
                formData.append('DocumentoID', props.DocumentoID.toString())
                formData.append('NombreDocumento', values.NombreDocumento)
                formData.append('doc', values.file);
                Funciones.FNSubirEvidenciaPrestamo(props.oidc, formData)
                    .then((respuesta: any) => {
                        toast.success("Se agrego correctamente la evidencia");
                        setLoading(false)
                        props.FNGetLocal()
                        props.fnCancelarMostrarCargaDeDocumentoPrestamo()
                        props.FNGetLocal()
                    })
                    .catch((error: any) => {
                        toast.error("Error al subir la evidencia")
                        setLoading(false)
                        props.fnCancelarMostrarCargaDeDocumentoPrestamo()
                    })
            }}>
            <Form>
                <div className="row">
                    <div className="col-md-2"></div>
                    <div className="col-md-8">
                        <CustomFieldImgUpload
                            disabled={loading}
                            label=""
                            name="file"
                            imageSrc={'data:image/png;base64,' + ''}
                        /></div>
                    <div className="col-md-2"></div>
                </div>
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        {/* <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelarMostrarCargaDeDocumento}>
                            Cancelar
                        </button> */}
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Subir</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}