import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { Producto: number, NumeroPiezas: number },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    options: { value: number, label: string }[]
    options2: { value: string, label: string }[]
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                Producto: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione el producto'),
                NumeroPiezas: Yup.number().required("Campo obligatorio").moreThan(0, 'No puedes capturar 0 piezas')

            })}
            // handleBlur={console.log('Manejador Blur')}
            onSubmit={(values: any) => {
                console.log(values)

                // Set our form to a loading state
                //setLoading(true)

                // Finish the callback
                if (props.Id === undefined) {
                    setLoading(true)
                    Funciones.FNAdd(props.oidc, values)
                        .then((respuesta: any) => {
                            props.cbGuardar(respuesta)
                            setLoading(false)
                            props.fnCancelar()
                        }
                        )
                        .catch((error: any) => {
                            toast.error('Error al guardar')
                            setLoading(false)
                        }
                        )
                }
                else {
                    console.log('Actualizar')
                }


            }}
        >
            <Form>
                <CustomFieldText
                    disabled={loading}
                    label="Numero de Piezas"
                    name="NumeroPiezas"
                    placeholder="Numero de Piezas"
                />
                <CustomSelect
                    disabled={loading}
                    label="Producto"
                    name="Producto"
                    placeholder="Seleccione un Producto"
                    options={props.options}
                    addDefault={false}
                />
                <CustomSelect
                    disabled={loading}
                    label='Entrada/Salida'
                    name='TipoMOV'
                    placeholder="Selecciona si es entrada o salida"
                    options={props.options2}
                    addDefault={false}
                />
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
        </Formik >
    )
}
