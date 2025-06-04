import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { EstatusID: number, Clave: string, Descripcion: string },
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
                Descripcion: Yup.string().required("Campo obligatorio").min(3, "Minimo 3 caracteres").max(30, "Maximo 30 caracteres"),
                Clave: Yup.string().required("Campo obligatorio").min(3, "Minimo 3 caracteres").max(5, "Maximo 5 caracteres"),
            })}
            onSubmit={(values: any, { resetForm }) => {
                setLoading(true)
                if (props.Id === undefined) {
                    let a = {
                        ...values,
                        EstatusID: 0,
                        Clave: values.Clave.toUpperCase(),
                        Descripcion: values.Descripcion.toUpperCase(),
                    }
                    Funciones.FNAdd(props.oidc, a)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            resetForm()
                        })
                        .catch((error: any) => {
                            alert("Error al guardar el estatus" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
                else {
                    let a = {
                        ...values,
                        EstatusID: props.Id,
                        Clave: values.Clave.toUpperCase(),
                        Descripcion: values.Descripcion.toUpperCase(),
                    }
                    Funciones.FNUpdate(props.oidc, a)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al guardar el estatus" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
            }}>
            <Form>
                <CustomFieldText disabled={loading} label="Clave" name="Clave" placeholder="Clave" />
                <CustomFieldText disabled={loading} label="Descripción" name="Descripcion" placeholder="Descripción" />
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