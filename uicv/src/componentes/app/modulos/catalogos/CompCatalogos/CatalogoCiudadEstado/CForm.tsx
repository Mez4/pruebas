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
    initialValues: { ciudadEstadoNombre: string, estadoPaisId: number },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    options: { value: number, label: string }[]
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                ciudadEstadoNombre: Yup.string().required("Campo obligatorio").min(4, "Minimo 4 caracteres").max(64, "Maximo 64 caracteres"),
                estadoPaisId: Yup.number().required("Seleccione el estado").moreThan(0, 'Seleccione el estado')
                // estado: Yup.array()
                // .min(1, 'Seleccione el estado')
                // .of(
                //   Yup.object().shape({                      
                //     value: Yup.number().required(),
                //     label: Yup.string().required(),
                //   })
                // )
            })}
            // handleBlur={console.log('Manejador Blur')}
            onSubmit={(values: any) => {

                // console.log(values)

                // Set our form to a loading state
                setLoading(true)

                // Finish the callback
                if (props.Id === undefined)
                    Funciones.FNAdd(props.oidc, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            toast.success("Se guardó la ciudad")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al guardar la ciudad")
                        })
                else
                    Funciones.FNUpdate(props.oidc, { ...values, ciudadEstadoId: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Se actualizó la ciudad")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al actualizar la ciudad")
                        })

            }}
        >
            <Form>
                <CustomFieldText
                    disabled={loading}
                    label="Ciudad"
                    name="ciudadEstadoNombre"
                    placeholder="Nombre de la ciudad"
                />
                <CustomSelect
                    disabled={loading}
                    label="Estado"
                    name="estadoPaisId"
                    placeholder="Seleccione un estado"
                    options={props.options}
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
        </Formik>
    )
}
