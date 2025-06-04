import { useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Spinner, CustomFieldImgUpload, CustomFieldPdfUpload } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'

type CFormType = {
    oidc: IOidc
    initialValues: {
        ProspectoID: number,
        doc: string,
    },
    prospectoID: number
    documentoLabel: number,
    fnCancelarVerDoc(): any
    ConsultarProcesos(): any
    ConsultarPersona(): any
}

export const CFormD = (props: CFormType) => {

    const [loading, setLoading] = useState(false)

    return (
        <>
            <Formik
                initialValues={props.initialValues}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    file: Yup.string().required("Campo obligatorio")
                })}
                onReset={(values: any) => {
                    // clearFormByLevel(0)
                }}
                onSubmit={(values: any) => {
                    setLoading(true)
                    const formData = new FormData()
                    formData.append('ProspectoID', `${props.prospectoID}`);
                    formData.append('identificador', `${props.documentoLabel}`);
                    formData.append('doc', values.file);
                    Funciones.FNSubirDoc(props.oidc, formData)
                        .then((respuesta: any) => {
                            if (respuesta.regresa === 1) {
                                setLoading(false)
                                toast.success(`Documento subido con Éxito. ${respuesta.data.path}`)
                                props.fnCancelarVerDoc()
                                props.ConsultarProcesos()
                                props.ConsultarPersona()
                            }
                            else {
                                setLoading(false)
                                toast.error(respuesta.msj)
                            }
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            if (error.response)
                                toast.error(`Response Error: ${error.response.data}`)
                            else if (error.request)
                                toast.error(`Request ${error}`)
                            else
                                toast.error(`${error}`)
                        })
                }}>
                {({ values }) => (
                    <Form>
                        <div className="row">
                            <div className="col-12">
                                {props.documentoLabel === 1 && <CustomFieldPdfUpload
                                    disabled={loading}
                                    label=""
                                    name="file"
                                    imageSrc={'data:image/png;base64,' + ''}
                                />}
                                {props.documentoLabel !== 1 && <CustomFieldImgUpload
                                    disabled={loading}
                                    label="Documento"
                                    name="file"
                                    imageSrc={'data:image/png;base64,' + props.initialValues.doc}
                                />}
                            </div>
                        </div>

                        {loading && <Spinner />}
                        {!loading &&
                            <div >
                                <div className="text-end">
                                    <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                        SUBIR DOCUMENTO
                                    </button>
                                </div>
                            </div>
                        }
                    </Form>
                )}
            </Formik>
        </>
    )
}
