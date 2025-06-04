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
    initialValues: { TipoDocumentoID: number, 
        NombreDocumento: string, 
        Clave: string, 
        Descripcion: string,
        DocumentoID: number,
        Orden: number,
        PersonaID: number,
        TipoPersonaID: number
        Ruta: string,
        Autorizado: boolean,
        rn: number },
    updateTable : any,
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
                formData.append('DocumentoID', values.DocumentoID ? values.DocumentoID : 0)
                formData.append('NombreDocumento', values.NombreDocumento)
                formData.append('Orden', values.Orden)
                formData.append('PersonaID', `${props.Id}`)
                formData.append('Ruta', values.Ruta)
                formData.append('TipoDocumentoID', values.TipoDocumentoID)
                formData.append('TipoPersonaID', `${1}`)
                formData.append('doc', values.file);
                // const formData : any = {
                //     Autorizado  : values.Autorizado,
                //     Clave : values.Clave,
                //     Descripcion : values.Descripcion,
                //     DocumentoID : values.DocumentoID,
                //     NombreDocumento : values.NombreDocumento,
                //     Orden : values.Orden,
                //     PersonaID : props.Id,
                //     Ruta : values.Ruta,
                //     TipoDocumentoID : values.TipoDocumentoID,
                //     TipoPersonaID : 1,
                //     doc : values.file
                // };
                // Finish the callback
                Funciones.FNSubirExpediente(props.oidc, formData)
                    .then((respuesta: any) => {
                        if (respuesta.msj != null) {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            props.updateTable();
                            toast.error(respuesta.msj)
                        }
                        else
                        {
                        setLoading(false)
                        props.cbActualizar(respuesta)
                        props.updateTable();
                        toast.success("Subida de Documento realizada correctamente")
                        }
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