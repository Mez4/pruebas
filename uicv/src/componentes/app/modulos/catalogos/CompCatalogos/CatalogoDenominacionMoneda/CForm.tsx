import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { valueContainerCSS } from 'react-select/src/components/containers'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    Seguridad: IOidc,


    Id?: number,
    initialValues: {
        catDenomEfectivoID: number,
        clave: string,
        concepto: string,
        valorMonetario: number
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
                clave: Yup.string().required("Campo obligatorio").min(3, "Debe contener 3 caracteres").max(10, "Debe contener menos de 10 caracteres"),
                concepto: Yup.string().required("Campo obligatorio").min(5, "Debe contener 10 caracteres").max(60, "Debe contener menos de 60 caracteres"),
            })}
            onSubmit={(values: any) => {

                setLoading(true)
                // Finish the callback
                if (props.Id === undefined) {

                    let agregarMoneda: any = {
                        Clave: values.clave,
                        Concepto: values.concepto,
                        ValorMonetario: values.valorMonetario,
                    }
                    values = agregarMoneda


                    Funciones.FNAdd(props.Seguridad, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)

                        })
                        .catch((error: any) => {
                            toast.error("La clave no se puede guardar porque ya existe")
                            setLoading(false)
                        })
                }
                else {

                    let actualizarMoneda: any = {
                        catDenomEfectivoID: values.catDenomEfectivoID,
                        Clave: values.clave,
                        Concepto: values.concepto,
                        ValorMonetario: values.valorMonetario
                    }
                    values = actualizarMoneda

                    Funciones.FNUpdate(props.Seguridad, { ...values, catDenomEfectivoID: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            setLoading(false)
                            //toast.error('Error al desactivar el banco, tiene cuentas activas')
                            alert("Error al actualizar el valor monetario" + JSON.stringify(error))

                        })
                }
            }}
        >
            <Form>
                <div>

                    <CustomFieldText
                        disabled={false}
                        label="Clave:"
                        name="clave"
                        placeholder="Agregar Clave"
                    />

                    <CustomFieldText
                        disabled={false}
                        label="Concepto:"
                        name="concepto"
                        placeholder="Agregar Concepto"
                    />

                    <CustomFieldText
                        disabled={false}
                        label="Valor Monetario:"
                        name="valorMonetario"
                        placeholder="Agregar Valor Monetario"
                    />


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