import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'

type CFormType = {
    oidc: IOidc
    Id?: string,
    initialValues: { TasaTipoId: string, TasaTipo: string, capitalizacionesPorMes: number, capitalizacionesPorAnio: number },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    isUpdate: boolean
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                TasaTipoId: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracter").max(1, "Maximo 1 caracter"),
                TasaTipo: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracter").max(19, "Maximo 19 caracteres"),
                capitalizacionesPorMes: Yup.number().required("Campo obligatorio"),
                capitalizacionesPorAnio: Yup.number().required("Campo obligatorio")
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)

                // Finish the callback
                if (props.Id === undefined)
                    Funciones.FNAdd(props.oidc, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            toast.success("Se guardó el tipo de tasa")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al guardar el tipo de tasa")
                        })
                else
                    Funciones.FNUpdate(props.oidc, { ...values, TasaTipoId: props.Id as string })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Se actualizó el tipo de tasa")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al actualizar el tipo de tasa")
                        })

            }}>
            <Form>
                <CustomFieldText disabled={props.isUpdate || loading} label="Id" name="TasaTipoId" placeholder="Identificador del tipo de tasa" />
                <CustomFieldText disabled={loading} label="Tipo de Tasa" name="TasaTipo" placeholder="Descripción del tipo de tasa" />
                <CustomFieldText disabled={loading} label="Capitalizaciones por mes" name="capitalizacionesPorMes" placeholder="Capitalizaciones por mes" />
                <CustomFieldText disabled={loading} label="Capitalizaciones por año" name="capitalizacionesPorAnio" placeholder="Capitalizaciones por año" />
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                            Aceptar
                        </button>
                    </div>
                }
            </Form>
        </Formik>
    )
}
