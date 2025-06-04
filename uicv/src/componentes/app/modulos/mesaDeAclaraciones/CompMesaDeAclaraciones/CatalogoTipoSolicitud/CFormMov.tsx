import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { TipoMovimientoID: number, ClaveMovimiento: string, DescripcionMov: string },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(): any
}

export const CFormMov = (props: CFormType) => {
    // Loading
    const [loading, setLoading] = React.useState(false)
    // Return the component
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                DescripcionMov: Yup.string().required("Campo obligatorio").min(3, "Mínimo 3 caracteres").max(30, "Máximo 30 caracteres"),
                ClaveMovimiento: Yup.string().required("Campo obligatorio").min(3, "Mínimo 3 caracteres").max(5, "Máximo 5 caracteres"),
            })}
            onSubmit={(values: any, { resetForm }) => {
                setLoading(true)
                if (props.Id === undefined) {
                    let a = {
                        ...values,
                        TipoMovimientoID: 0,
                        ClaveMovimiento: values.ClaveMovimiento.toUpperCase(),
                        DescripcionMov: values.DescripcionMov.toUpperCase(),
                    }
                    Funciones.FNAddMov(props.oidc, a)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            resetForm()
                        })
                        .catch((error: any) => {
                            alert("Error al guardar el tipo de movimiento" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
                else {
                    let a = {
                        ...values,
                        TipoMovimientoID: props.Id,
                        ClaveMovimiento: values.ClaveMovimiento.toUpperCase(),
                        DescripcionMov: values.DescripcionMov.toUpperCase(),
                    }
                    Funciones.FNUpdateMov(props.oidc, a)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al guardar el tipo de movimiento" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
            }}>
            <Form>
                <CustomFieldText disabled={loading} label="Clave" name="ClaveMovimiento" placeholder="Clave de Movimiento" />
                <CustomFieldText disabled={loading} label="Descripción" name="DescripcionMov" placeholder="Descripción Movimiento" />
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