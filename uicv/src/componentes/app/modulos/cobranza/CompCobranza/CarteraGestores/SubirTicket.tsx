import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomFieldImgUpload } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { format } from 'path'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { TicketID: number, FechaRegistro: Date, Activo: boolean, DistribuidorID: number },
    GestorID: any,
    DistribuidorID: any,
    Identificador: number,
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(): any,
    FNGetLocal(): any,
    UltRelacionImporte: string,
    Fecha: any,
    FechaCorte: any
}

export const SubirTicket = (props: CFormType) => {

    // Loading
    const [loading, setLoading] = React.useState(false)

    const [state, setState] = React.useState({

        Filtro: '',
        Cargando: true,
        Error: false,
        Monto: ''


    })

    const Pago = (Monto: string) => {
        setState(s => ({ ...s, Monto: Monto }))
        // console.log(Monto, 'yyyyyyyyyyyyyyyyyyyyyyyyy')
    }

    // Return the component
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                // file: Yup.string().required("Selecciona un archivo")
            })}
            onSubmit={(values: any) => {

                if (props.Identificador === 1) {

                    values.TicketID = 0
                }

                // Set our form to a loading state
                setLoading(true)
                console.log(`values`, values)
                const formData = new FormData()
                formData.append('TicketID', values.TicketID)
                formData.append('DistribuidorID', props.DistribuidorID)
                formData.append('GestorID', props.GestorID)
                formData.append('Ruta', values.Ruta)
                formData.append('Monto', state.Monto);
                formData.append('UltRelacionImporte', props.UltRelacionImporte);
                formData.append('FechaCorte', props.FechaCorte);
                formData.append('doc', values.file);


                // Finish the callback
                Funciones.FNSubirTicket(props.oidc, formData)
                    .then((respuesta: any) => {
                        setLoading(false)
                        //props.cbGuardar(respuesta)
                        props.FNGetLocal()
                        props.fnCancelar()
                        props.cbActualizar(respuesta)
                        toast.success(respuesta.msj)
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
            <Form>

                <div className="text-center">
                    <div><b><p>Fecha Corte:</p></b></div>
                    <p> {props.FechaCorte} </p>
                    <br />
                    <div><b><p>Monto Por Cobrar:</p></b></div>
                    <p> $ {props.UltRelacionImporte}</p>
                    <br />
                    <div><b><p>Ultimo Pago:</p></b></div>
                    <p>{props.Fecha}</p>
                    <br />
                    <div><b><p>Monto:</p></b></div>
                    <div className="row justify-content-center">
                        <input type="number" step="any" placeholder="$0.00" className="form-control" style={{ fontSize: '1em', width: '10em' }} onChange={e => Pago(e.target.value)} />
                    </div>
                </div>

                <br />

                <div className="row">
                    <div className="col-md-2">
                    </div>
                    <div className="col-md-8">
                        <CustomFieldImgUpload
                            disabled={loading}
                            label="Ticket"
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
                        {/* <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button> */}
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Aceptar</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}