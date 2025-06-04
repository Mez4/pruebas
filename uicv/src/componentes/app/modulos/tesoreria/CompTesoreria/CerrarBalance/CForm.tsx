import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    Seguridad: IOidc,
    Id?: number
    initialValues: {
        cerrado: boolean
    },

    cbCerrar(item: any): any,
    fnCancelar(): any

    options: { value: number, label: string }[],
    options2: { value: number, label: string }[],
    options3: { value: number, label: string }[],
    options4: { value: number, label: string }[],

}



export const CForm = (props: CFormType) => {


    const [loading, setLoading] = React.useState(false)
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({

            })}
            onSubmit={(values: any) => {

                setLoading(true)
                // Finish the callback
                if (props.Id === undefined) {

                    let agregarCaja: any = {

                        cerrado: props.initialValues.cerrado

                    }
                    values = agregarCaja
                    Funciones.FNAdd(props.Seguridad, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbCerrar(respuesta)

                        })
                        .catch((error: any) => {
                            alert("Error al guardar la caja" + JSON.stringify(error))
                            setLoading(false)
                        })
                }

            }}
        >
            <Form>

                <div>
                    <h4>
                        ¿Estas seguro de cerrar el balance?
                    </h4>

                    {loading && <Spinner />}
                    {!loading &&
                        <div className="text-end">
                            <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                Cancelar
                            </button>
                            <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                Ok
                            </button>
                        </div>
                    }
                </div>



            </Form>

        </Formik>
    )
}
