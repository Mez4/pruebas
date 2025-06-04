import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    Seguridad: IOidc,

    Id?: number,
    initialValues: {
        bancoID: number,
        nombre: string,
        activo: boolean
    },
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
                nombre: Yup.string().required("Campo obligatorio").min(4, "Minimo 4 caracteres").max(64, "Maximo 64 caracteres"),
                //acumulaCuentaId: Yup.number().required("Seleccione la cuenta acumula").moreThan(0, 'Seleccione la cuenta acumula'),
            })}
            onSubmit={(values: any) => {
                setLoading(true)
                // Finish the callback
                if (props.Id === undefined) {

                    let agregarBanco: any = {
                        nombre: values.nombre,
                        activo: values.activo,
                    }
                    values = agregarBanco
                    Funciones.FNAdd(props.Seguridad, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)

                        })
                        .catch((error: any) => {
                            alert("Error al guardar la cuenta" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
                else {
                    let actualizarBanco: any = {
                        bancoID: values.bancoID,
                        nombre: values.nombre,
                        activo: values.activo,
                    }
                    values = actualizarBanco
                    Funciones.FNUpdate(props.Seguridad, { ...values, bancoID: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al actualizar la cuenta" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
            }}
        >
            <Form>
                <div>
                    <CustomFieldText
                        //isDisable={
                        disabled={props.Id === undefined ? false : true}
                        label="Nombre:"
                        name="nombre"
                        placeholder="Agregar Banco"
                    />
                    <CustomFieldCheckbox disabled={loading} label="Activo" name="activo" />
                    {loading && <Spinner />}
                    {!loading &&
                        <div className="text-end">
                            <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                Cancelar
                            </button>
                            <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                Ok
                            </button>
                        </div>
                    }
                </div>
            </Form>
        </Formik>
    )
}
