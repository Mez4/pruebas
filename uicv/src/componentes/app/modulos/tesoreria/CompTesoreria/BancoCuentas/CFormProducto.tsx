import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { number } from 'yup/lib/locale'

type CFormType = {
    Seguridad: IOidc,
    //Id?: number,
    initialValues: {
        productoID: number,
    },
    productoID: number,
    CuentaBancoID: number,

    fnCancelar(): any,
    cbActualizar(item: any): any,

    optionsAgrupacion: { value: number, label: string }[]

}

export const CFormProducto = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)
    props.initialValues.productoID = props.productoID
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            //Se hacen las validaciones de los campos en el formulario.
            validationSchema={Yup.object().shape({
                productoID: Yup.number().required("Seleccione el banco").moreThan(0, 'Seleccione el banco'),

            })}

            onSubmit={(values: any) => {
                setLoading(true)

                let Datos = {
                    CuentaBancoID: props.CuentaBancoID,
                    ProductoID: values.productoID
                }

                Funciones.FNActualizarProducto(props.Seguridad, Datos)
                    .then((respuesta: any) => {
                        setLoading(false)
                        if (respuesta.estatus == 1) {
                            toast.success("Producto actualizado correctamente")
                            props.fnCancelar()
                            props.cbActualizar(respuesta)

                        } else {
                            toast.error(respuesta.mensaje)
                            props.fnCancelar()
                        }

                    })
                    .catch((error: any) => {
                        setLoading(false)
                        console.log(error)
                        toast.error("Error al actualizar la cuenta: " + error.message)
                    })
            }}
        >
            <Form>
                <div>
                    <div>
                        <CustomSelect
                            disabled={false}
                            label="Producto:"
                            name="productoID"
                            placeholder="Seleccione..."
                            options={props.optionsAgrupacion}
                            addDefault={false}
                            isMulti={false}
                        />
                    </div>

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
        </Formik >
    )
}