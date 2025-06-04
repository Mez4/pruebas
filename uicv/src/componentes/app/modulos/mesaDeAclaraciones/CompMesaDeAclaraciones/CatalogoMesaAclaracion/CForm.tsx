import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, CustomSelect, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { MesaAclaracionID: number, NombreMesaAclaracion: string, Clave: string, Activo: boolean },
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
                NombreMesaAclaracion: Yup.string().required("Campo obligatorio"),
                Clave: Yup.string().required("Campo obligatorio").min(3, "Minimo 3 caracteres").max(5, "Maximo 5 caracteres"),
            })}
            onSubmit={(values: any, { resetForm }) => {
                setLoading(true)
                if (props.Id === undefined) {
                    let a = {
                        ...values,
                        MesaAclaracionID: 0,
                        NombreMesaAclaracion: values.NombreMesaAclaracion,
                        Clave: values.Clave,
                    }
                    Funciones.FNAdd(props.oidc, a)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            resetForm()
                        })
                        .catch((error: any) => {
                            alert("Error al guardar el tipo de Mesa de Aclaración" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
                else {
                    let a = {
                        ...values,
                        MesaAclaracionID: props.Id,
                        NombreMesaAclaracion: values.NombreMesaAclaracion,
                        Clave: values.Clave,
                    }
                    Funciones.FNUpdate(props.oidc, a)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al guardar el tipo de Mesa de Aclaración" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
            }}>
            <Form>
                <CustomFieldText disabled={loading} label="Nombre de la Mesa de Aclaración" name="NombreMesaAclaracion" placeholder="Nombre de Mesa Aclaración" />
                <CustomFieldText disabled={loading} label="Clave" name="Clave" placeholder="Clave de Mesa Aclaración" />
                <CustomFieldCheckbox disabled={loading} label="Activo" name="Activo" />
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