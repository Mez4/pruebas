import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { TipoSolicitudID: number, ClaveSolicitud: string, Descripcion: string },
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
                Descripcion: Yup.string().required("Campo obligatorio").min(3, "Mínimo 3 caracteres").max(30, "Máximo 30 caracteres"),
                ClaveSolicitud: Yup.string().required("Campo obligatorio").min(3, "Mínimo 3 caracteres").max(5, "Máximo 5 caracteres"),
            })}
            onSubmit={(values: any, { resetForm }) => {
                setLoading(true)
                if (props.Id === undefined) {
                    let a = {
                        ...values,
                        TipoSolicitudID: 0,
                        ClaveSolicitud: values.ClaveSolicitud.toUpperCase(),
                        Descripcion: values.Descripcion.toUpperCase(),
                    }
                    Funciones.FNAdd(props.oidc, a)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            resetForm()
                        })
                        .catch((error: any) => {
                            alert("Error al guardar el tipo de solicitud" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
                else {
                    let a = {
                        ...values,
                        TipoSolicitudID: props.Id,
                        ClaveSolicitud: values.ClaveSolicitud.toUpperCase(),
                        Descripcion: values.Descripcion.toUpperCase(),
                    }
                    Funciones.FNUpdate(props.oidc, a)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al guardar el tipo de solicitud" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
            }}>
            <Form>
                <CustomFieldText disabled={loading} label="Clave" name="ClaveSolicitud" placeholder="Clave de Solicitud" />
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