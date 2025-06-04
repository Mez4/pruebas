import React, { useEffect, useState } from "react"
import { IOidc } from "../../../../../../interfaces/oidc/IOidc"
import { Form, Formik } from "formik"
import * as Yup from "yup"
import { CustomFieldImgUpload, Spinner } from "../../../../../global";
import * as Funciones from './FuncionesSCRS';
import { toast } from "react-toastify";
type CFormType = {
    oidc: IOidc,
    idSolicitud?: number,
    initialValues: {
        DocumentoID: number,
        TipoDocumentoID: number,
        NombreDocumento: string,
        DistribuidorID: number,
        Accion: number,
        Ruta: string,
        Status: string,
        Autorizado: boolean,
        SolicitudRCID: number,
    }
    cbGuardar(item: any): any,
    cbActualizar(item: any): any,
    fnCancelar(): any,

}
export const CFormSCRSCArchivo = (props: CFormType) => {
    console.log(props.initialValues);

    const [loading, setLoading] = useState(false)
    const [state, setState] = useState({
        MostrarDocumentos: true,
    })

    return (
        <>
            <Formik
                initialValues={props.initialValues}
                onSubmit={(values: any) => {
                    setLoading(true)
                    const formData = new FormData()
                    formData.append('DocumentoID', values.DocumentoID ?? 0)
                    formData.append('Autorizado', values.Autorizado)
                    formData.append('DistribuidorID', values.DistribuidorID)
                    formData.append('Accion', values.Accion)
                    formData.append('NombreDocumento', values.NombreDocumento)
                    formData.append('Ruta', values.Ruta)
                    formData.append('SolicitudRCID', values.SolicitudRCID)
                    formData.append('Status', values.Status)
                    formData.append('TipoDocumentoID', values.TipoDocumentoID)
                    formData.append('file', values.file);
                    console.log("formData", formData);
                    console.log(`values`, values)

                    Funciones.SubirArchivo(props.oidc, formData)
                        .then((res: any) => {
                            setLoading(false)
                            props.cbActualizar(res);
                            console.log(res);
                            toast.success("Documento subido correctamente")

                        }).catch((error: any) => {
                            if (error.response)
                                toast.error(`Response Error: ${error.response.data}`)
                            else if (error.request)
                                toast.error(`Request ${error.request}`)
                            else
                                toast.error(`${error}`)
                            setLoading(false)

                        })
                    props.cbActualizar(values)
                }}
                enableReinitialize
                validationSchema={
                    Yup.object().shape({
                        file: Yup.string().required("Selecciona un archivo").typeError("Selecciona un archivo")
                    })
                }>
                <Form>
                    <div className="d-block">

                        <CustomFieldImgUpload
                            disabled={loading}
                            label="Documento Solicitud"
                            name="file"
                            imageSrc={'data:image/png;base64,' + ''}
                        />
                    </div>

                    {loading && <Spinner />}
                    {!loading &&
                        <footer className="modal-card-foot d-flex justify-content-end">
                            <button type="button" className="button is-danger" onClick={props.fnCancelar()}>
                                Cancelar
                            </button>
                            <button type="submit" className="button is-primary">
                                Subir Documento
                            </button>
                        </footer>
                    }
                </Form>

            </Formik>
        </>
    )
}
export default CFormSCRSCArchivo;