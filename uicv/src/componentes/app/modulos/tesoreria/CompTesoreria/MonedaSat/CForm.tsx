import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomFieldDatePicker } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { NombreMoneda: string, TipoCambio: number, Fecha?: Date, ClaveMonedaSat: string },
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
                NombreMoneda: Yup.string().required("Campo obligatorio").min(3, "Minimo 3 caracteres").max(30, "Maximo 30 caracteres"),
                TipoCambio: Yup.number().required("Campo obligatorio"),
                Fecha: Yup.date().required("Seleccione la fecha de corte").nullable(),
                ClaveMonedaSat: Yup.string().required("Campo obligatorio").min(3, "Minimo 3 caracteres").max(3, "Maximo 3 caracteres"),
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)
                console.log(`values`, values)
                // Finish the callback
                if (props.Id === undefined)
                    Funciones.FNAdd(props.oidc, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al guardar el tipo cuenta" + JSON.stringify(error))
                            setLoading(false)
                        })
                else
                    Funciones.FNUpdate(props.oidc, { ...values, MonedaSatID: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al guardar el tipo cuenta" + JSON.stringify(error))
                            setLoading(false)
                        })

            }}>
            <Form>

                <CustomFieldText disabled={loading} label="NombreMoneda" name="NombreMoneda" placeholder="NombreMoneda" />
                <CustomFieldText disabled={loading} label="TipoCambio" name="TipoCambio" placeholder="TipoCambio" />
                <CustomFieldDatePicker
                    disabled={loading}
                    label="Fecha"
                    name="Fecha"
                    placeholder="Seleccione la fecha"
                />
                <CustomFieldText disabled={loading} label="ClaveMonedaSat" name="ClaveMonedaSat" placeholder="ClaveMonedaSat" />
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                    </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Ok</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}