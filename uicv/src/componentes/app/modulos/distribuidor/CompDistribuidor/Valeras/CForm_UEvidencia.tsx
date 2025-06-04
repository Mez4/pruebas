import React, { useRef, useEffect } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomFieldDatePicker, ActionSelect, CustomFieldPdfUpload, CustomFieldImgUpload } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { FaArrowAltCircleLeft } from 'react-icons/fa'
import { useBarcode } from 'react-barcodes'

type CFormType = {
    oidc: IOidc
    Id?: number,
    close(): any
}

export const CForm_UEvidencia = (props: CFormType) => {

    // Loading
    const [loading, setLoading] = React.useState(false)
    const [isMounted, setisMounted] = React.useState(false)

    useEffect(() => {
        setisMounted(true)
    }, [])

    let validationShape = {
        file: Yup.string(),
    }

    validationShape.file = Yup.string().required("Campo obligatorio")
        

    // Return the component
    return (
        <Formik
            initialValues={{}}
            enableReinitialize
            validationSchema={Yup.object().shape(validationShape)}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)
                console.log(`values`, values)
                // Finish the callback
                const formData = new FormData()
                formData.append('ValeraID', `${props.Id}`);
                formData.append('doc', values.file);
                Funciones.FNSubirExpedienteEvidencia(props.oidc, formData)
                    .then((respuesta: any) => {
                        setLoading(false)
                        toast.success("Subida de Documento realizada correctamente")
                        props.close()
                    })
                    .catch((error: any) => {
                        if (error.response)
                            toast.info(`Response Error: ${error.response.data}`)
                        else if (error.request)
                            toast.error(`Request ${error}`)
                        else
                            toast.error(`${error}`)
                        setLoading(false)
                    })
            }}>
            <Form>
                {!loading && <div className="row">
                    <div className="col-md-12">
                        <CustomFieldImgUpload
                            disabled={loading}
                            label="Evidencia de Entrega Doc"
                            name="file"
                            imageSrc={'data:image/png;base64,' + ''}
                        />
                    </div>
                </div>}
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                            {'Subir'}
                        </button>
                        <button type="button" onClick={()=>props.close()}  className="ms-2 btn btn-danger waves-effect waves-light">
                            {'Cancelar'}
                        </button>
                    </div>
                }
            </Form>
        </Formik>
    )
}