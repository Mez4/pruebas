import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomFieldImgUpload, CustomFieldPdfUpload, ModalWin } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

type CFormType = {
    oidc: IOidc
    Id?: number,
    DocumentoID: number,
    RecepcionID: number,
    initialValues: {
        file: string
    },
    fnCancelarMostrarCargaDeDocumento(): any,
    FNGetLocal(): any
}

export const CFormAgregarComprobante = (props: CFormType) => {
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
                formData.append('RecepcionID', props.RecepcionID.toString())
                formData.append('DocumentoID', props.DocumentoID.toString())
                formData.append('NombreDocumento', values.NombreDocumento)
                formData.append('doc', values.file);

                Funciones.FNSubirEvidencia(props.oidc, formData)
                    .then((respuesta: any) => {
                        toast.success("Se agrego correctamente el documento");
                        setLoading(false)
                        props.FNGetLocal()
                        props.fnCancelarMostrarCargaDeDocumento()
                        props.FNGetLocal()
                    })
                    .catch((error: any) => {
                        toast.error("Error al subir documento")
                        setLoading(false)
                        props.fnCancelarMostrarCargaDeDocumento()
                    })
            }}>

            <Form>
                <div className="row">
                    <div className="col-md-2"></div>
                    <div className="col-md-8">
                        <CustomFieldPdfUpload
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
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Subir Documento</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}