import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'

import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    Seguridad: IOidc,
    Id?: number
    initialValues: {
        estatus: boolean

    },
    cbActualizar(item: any): any,
    fnCancelar(): any,

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

                if (values.estatus === true) {
                    let actualizarPeriodo: any = {
                        periodoID: values.periodoID,
                        estatus: "A",
                    }
                    values = actualizarPeriodo
                } else if (values.estatus === false) {
                    let actualizarPeriodo: any = {
                        periodoID: values.periodoID,
                        estatus: "C",
                    }
                    values = actualizarPeriodo
                }

                Funciones.FNUpdate(props.Seguridad, { ...values, cajaId: props.Id as number })
                    .then((respuesta: any) => {
                        setLoading(false)
                        props.cbActualizar(respuesta)
                    })
                    .catch((error: any) => {
                        alert("Error al actualizar el periodo" + JSON.stringify(error))
                        setLoading(false)
                    })

            }}
        >
            <Form>

                <div>

                    <div className="row columns is-centered is-mobile is-multiline">
                        <div className="column is-half-desktop is-half-tablet is-half-mobile">
                            <CustomFieldText
                                disabled={loading}//props.Id=== undefined? false : true
                                label="Dias gracia:"
                                name="DiasGracia"
                                placeholder="Dias de gracia para el periodo"
                            />
                        </div>
                        <div className="column is-half-desktop is-half-tablet is-half-mobile">
                            <label>Cerrado / Abierto</label>
                            <CustomFieldCheckbox disabled={loading} label="Estatus" name="estatus" />
                        </div>
                    </div>
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
