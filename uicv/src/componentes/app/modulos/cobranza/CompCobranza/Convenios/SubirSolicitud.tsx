import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomFieldImgUpload, CustomFieldPdfUpload } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { format } from 'path'

type CFormType = {
    oidc: IOidc
    DistribuidorDesc: string,
    initialValues: {
        ConvenioID: number,
        EstatusId: number,
        Editar: boolean,
        DistribuidorID: number,
        SucursalID: number,
        isPagoIntencion: boolean,
        PorcPagInt: number,
        PorcBon: number,
        Plazos: number,
        SaldoActual: number,
        saldoAtrasado: number,
        DiasAtraso: number,
        doc: string,
        file: null,
    },
    cbActualizar(item: any): any,
    // cbGuardar(item: any): any
    fnCancelar(): any
}

export const SubirSolicitud = (props: CFormType) => {

    // Loading
    const [loading, setLoading] = React.useState(false)

    const [state, setState] = React.useState({
        Filtro: '',
        Cargando: true,
        Error: false,
        // Monto: ''
    })

    // Return the component
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                // file: Yup.string().required("Selecciona un archivo")
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)

                const formData = new FormData()
                formData.append('ConvenioID', values.ConvenioID)
                formData.append('DistribuidorID', values.DistribuidorID)
                formData.append('Ruta', values.Ruta)
                formData.append('doc', values.file);

                // Finish the callback
                Funciones.FNSubirPDF(props.oidc, formData)
                    .then((respuesta: any) => {

                        // const file = new Blob(
                        //     [respuesta],
                        //     { type: 'application/pdf' });

                        // var url = window.URL.createObjectURL(file);
                        // var anchor = document.createElement("a");
                        // anchor.download = "solicitud.pdf";
                        // anchor.href = url;
                        // anchor.click();

                        console.log('res: ', respuesta)
                        setLoading(false)
                        props.cbActualizar(respuesta.data)
                        toast.success('Archivo subido correctamente')
                    })
                    .catch((error: any) => {
                        if (error.response)
                            toast.error(`Response: ${error.response.data}`)
                        else if (error.request)
                            toast.error(`Request ${error}`)
                        else
                            toast.error(`${error}`)
                        setLoading(false)
                    })

            }}>
            {({ values }) => (
                <Form>

                    <div className="text-center">
                        <div><b><p>ID Convenio:</p></b></div>
                        <p> {values.ConvenioID} </p>
                        <div><b><p>Socia:</p></b></div>
                        <p>{values.DistribuidorID} {props.DistribuidorDesc}</p>
                        {/* <br />
                        <div><b><p>Monto Por Cobrar:</p></b></div>
                        <p> $ {props.UltRelacionImporte}</p>
                        <br />
                        <div><b><p>Ultimo Pago:</p></b></div>
                        <p>{props.Fecha}</p>
                        <br />
                        <div><b><p>Monto:</p></b></div>
                        <div className="row justify-content-center">
                            <input type="number" step="any" placeholder="$0.00" className="form-control" style={{ fontSize: '1em', width: '10em' }} onChange={e => Pago(e.target.value)} />
                        </div> */}
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-md-2">
                        </div>
                        <div className="col-md-8">
                            <CustomFieldPdfUpload
                                disabled={loading}
                                label="Solicitud Convenio"
                                name="file"
                                imageSrc={'data:image/png;base64,' + values.doc}
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
                            <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Subir</button>
                        </div>
                    }
                </Form>
            )}
        </Formik>
    )
}