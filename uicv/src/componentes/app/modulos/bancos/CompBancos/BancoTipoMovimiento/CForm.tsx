import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { TipoMovimientoID: string, TipoMovimiento: string, Cargo: boolean, usuario: boolean },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                TipoMovimientoID: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracter").max(4, "Maximo 4 caracteres"),
                TipoMovimiento: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracter").max(50, "Maximo 50 caracteres")
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
                            toast.success("Se guardó el tipo de movimiento")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al guardar el tipo de movimiento")
                        })
                else
                    Funciones.FNUpdate(props.oidc, { ...values, Id: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Se actualizó el tipo de movimiento")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al actualizar el tipo de movimiento")
                        })

            }}>
            <Form>
                <CustomFieldText disabled={loading} label="Identificador" name="TipoMovimientoID" placeholder="Identificador del tipo de movimiento" />
                <CustomFieldText disabled={loading} label="Tipo Movimiento" name="TipoMovimiento" placeholder="Tipo Movimiento" />
                <CustomFieldCheckbox disabled={loading} label="Cargo" name="Cargo" />
                <CustomFieldCheckbox disabled={loading} label="Usuario" name="usuario" />
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
