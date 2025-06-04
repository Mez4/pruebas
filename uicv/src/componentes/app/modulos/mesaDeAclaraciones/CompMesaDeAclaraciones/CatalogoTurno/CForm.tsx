import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { IdTurnos: number, Turno: string },
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
                Turno: Yup.string().required("Campo obligatorio").min(3, "Minimo 3 caracteres").max(5, "Maximo 5 caracteres"),
                HoraEntrada: Yup.string().required("Campo obligatorio").min(4, "Formato 24 hrs (00:00)").max(5, "Formato 24 hrs (00:00)"),
                HoraSalida: Yup.string().required("Campo obligatorio").min(4, "Formato 24 hrs (00:00)").max(5, "Formato 24 hrs (00:00)"),

            })}
            onSubmit={(values: any, { resetForm }) => {
                setLoading(true)
                if (props.Id === undefined) {
                    let a = {
                        ...values,
                        Turno: values.Turno,
                        HoraEntrada: values.HoraEntrada,
                        HoraSalida: values.HoraSalida
                    }
                    Funciones.FNAdd(props.oidc, a)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            resetForm()
                        })
                        .catch((error: any) => {
                            alert("Error al guardar turno" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
                else {
                    let a = {
                        ...values,
                        IdTurnos: values.IdTurnos,
                        Turno: values.Turno,
                        HoraEntrada: values.HoraEntrada,
                        HoraSalida: values.HoraSalida
                    }
                    Funciones.FNUpdate(props.oidc, a)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            resetForm()
                        })
                        .catch((error: any) => {
                            alert("Error al guardar turno" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
            }}>
            <Form>
                <CustomFieldText disabled={loading} label="Turno" name="Turno" placeholder="Ingrese el turno" />
                <CustomFieldText disabled={loading} label="Hora Entrada" name="HoraEntrada" placeholder="Ingrese la hora en formato 24 horas (00:00)" />
                <CustomFieldText disabled={loading} label="Hora Salida" name="HoraSalida" placeholder="Ingrese la hora en formato 24 horas (00:00)" />

                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Aceptar</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}