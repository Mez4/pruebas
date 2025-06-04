import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomFieldImgUpload } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: {
        TipoDocumentoAvalID: number,
        NombreDocumento: string,
        Clave: string,
        Descripcion: string,
        DocumentoAvalID: number,
        Orden: number,
        PersonaID: number,
        TipoPersonaID: number
        Ruta: string,
        Autorizado: boolean,
        rn: number
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(): any
}

export const CForm = (props: CFormType) => {

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

                // Set our form to a loading state
                setLoading(true)
                console.log(`values`, values)
                const formData = new FormData()
                formData.append('Autorizado', values.Autorizado)
                formData.append('Clave', values.Clave)
                formData.append('Descripcion', values.Descripcion)
                formData.append('DocumentoAvalID', values.DocumentoAvalID)
                formData.append('NombreDocumento', values.NombreDocumento)
                formData.append('Orden', values.Orden)
                formData.append('PersonaID', `${props.Id}`)
                formData.append('Ruta', values.Ruta)
                formData.append('TipoDocumentoAvalID', values.TipoDocumentoAvalID)
                formData.append('TipoPersonaID', `${3}`)
                formData.append('doc', values.file);

                // Finish the callback
                Funciones.FNSubirExpediente(props.oidc, formData)
                    .then((respuesta: any) => {
                        setLoading(false)
                        console.log("##", respuesta)
                        props.cbActualizar(respuesta)
                        toast.success("Subida de Documento Aval realizada correctamente")
                    })
                    .catch((error: any) => {
                        if (error.response)
                            toast.error(`Response Error: ${error.response.data}`)
                        else if (error.request)
                            toast.error(`Request ${error}`)
                        else
                            toast.error(`${error}`)
                        setLoading(false)
                    })

            }}>
            <Form>
                <div className="row">
                    <div className="col-md-2">
                    </div>
                    <div className="col-md-8">
                        <CustomFieldImgUpload
                            disabled={loading}
                            label="Documento Aval"
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
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Subir Documento</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}