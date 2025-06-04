import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { ValeraID: number, Folio: number, Estatus: string },
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
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)
                console.log(`values`, values)
                // Finish the callback
                Funciones.cancelFolio(props.oidc, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Vale cancelado correctamente")
                        })
                        .catch((error: any) => {
                            toast.error("Error al cancelar vale")
                            setLoading(false)
                        })

            }}>
            <Form>
            <div className="row">
                <div className="col-md-2">
                </div>
                <div className="col-md-8">
                    <CustomFieldText disabled={true} label="Valera Id" name="ValeraID" placeholder="ValeraID" />
                    <CustomFieldText disabled={true} label="Folio" name="Folio" placeholder="Folio" />
                </div>
                <div className="col-md-2">
                </div>
            </div>
                
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Volver
                    </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Cancelar Folio</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}