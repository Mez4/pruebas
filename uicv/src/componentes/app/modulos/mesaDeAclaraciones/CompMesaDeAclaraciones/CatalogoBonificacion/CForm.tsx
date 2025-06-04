import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { BonificacionID: number, PorcentajeBonificacion: string },
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
                PorcentajeBonificacion: Yup.string().required("Campo obligatorio")
                // Clave: Yup.string().required("Campo obligatorio").min(3, "Minimo 3 caracteres").max(5, "Maximo 5 caracteres"),
            })}
            onSubmit={(values: any, { resetForm }) => {
                setLoading(true)
                if (props.Id === undefined) {
                    let a = {
                        ...values,
                        BonificacionID: 0,
                        PorcentajeBonificacion: values.PorcentajeBonificacion.toUpperCase(),
                    }
                    Funciones.FNAdd(props.oidc, a)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            resetForm()
                        })
                        .catch((error: any) => {
                            alert("Error al guardar la bonificación" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
                else {
                    let a = {
                        ...values,
                        BonificacionID: values.BonificacionID,
                        PorcentajeBonificacion: values.PorcentajeBonificacion.toUpperCase(),
                    }
                    Funciones.FNUpdate(props.oidc, a)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al guardar la bonificación" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
            }}>
            <Form>
                <CustomFieldText disabled={loading} label="Porcentaje Bonificación" name="PorcentajeBonificacion" placeholder="Ingrese el porcentaje, con punto decimal" />
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