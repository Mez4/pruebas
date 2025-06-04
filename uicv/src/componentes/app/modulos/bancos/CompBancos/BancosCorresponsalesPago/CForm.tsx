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
    initialValues: {
        CorresponsalId: number,
        CorresponsalDesc: string,
        comision: number,
        ordenEnTabla: number,
        mostrarEnTabla: boolean,
        montoMaximoPago: number
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    optBancos: { value: number, label: string }[],
    optUsuarios: { value: number, label: string }[]
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                CorresponsalDesc: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracter").max(64, "Maximo 64 caracteres"),
                comision: Yup.number().required("Campo obligatorio"),
                ordenEnTabla: Yup.number().required("Campo obligatorio"),
                mostrarEnTabla: Yup.boolean().required("Selecciona Mostrar en Tabla"),
                montoMaximoPago: Yup.number().required("Campo obligatorio")
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
                            toast.success("Se guardó el corresponsal pago")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al guardar el corresponsal pago")
                        })
                else
                    Funciones.FNUpdate(props.oidc, { ...values, CorresponsalId: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Se actualizó el corresponsal")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al actualizar el corresponsal pago")
                        })

            }}
        >
            <Form>
                <CustomFieldText disabled={loading} label="Corresponsal Descripcion" name="CorresponsalDesc" placeholder="Descripcion del corresponsal pago" />
                <CustomFieldText disabled={loading} label="Comision" name="comision" placeholder="Comision Corresponsal Pago" />
                <CustomFieldText disabled={loading} label="Orden En Tabla" name="ordenEnTabla" placeholder="Orden en tabla al mostrar" />
                <CustomFieldCheckbox disabled={loading} label="Mostrar En Tabla" name="mostrarEnTabla" />
                <CustomFieldText disabled={loading} label="Monto Maximo Pago" name="montoMaximoPago" placeholder="Monto Maximo Pago" />
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
