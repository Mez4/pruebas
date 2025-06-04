import React from 'react'
import { IOidc } from "../../../../../../interfaces/oidc/IOidc"
import { Formik, Form } from 'formik'
import { object, number } from '../../../../../../global/idiomaValidacion.bak';
import * as Yup from 'yup'
import * as Funciones from './Funciones'
import { toast } from 'react-toastify';
import { CustomFieldText, CustomSelect, Spinner } from '../../../../../global';


type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: {
        Minimo: number,
        Maximo: number,
        Monto: number,
        DistribuidorNivelID: number,
        OrigenNivelID: number
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    optDistribuidoraNivel: { value: number, label: string }[],
    optDistribuidoraNivelOrigen: { value: number, label: string }[],
    isUpdate: boolean
}

export const CForm = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                Minimo: Yup.number()
                    .required("Campo obligatorio")
                    .moreThan(0, "Campo Obligatorio"),
                Maximo: Yup.number()
                    .required("Campo obligatorio")
                    .moreThan(0, "Campo Obligatorio"),
                Monto: Yup.number()
                    .required("Campo obligatorio")
                    .moreThan(0, "Campo Obligatorio"),
                DistribuidorNivelID: Yup.number().required("Seleccione el Nivel Distribuidor").moreThan(0, 'Seleccione Nivel Distribuidor'),
                OrigenNivelID: Yup.number().required("Seleccione el Nivel de Origen").moreThan(0, 'Seleccione Nivel Distribuidor Origen'),
            })}
            onSubmit={(values: any) => {
                setLoading(true)

                if (props.Id === undefined)
                    Funciones.FNAdd(props.oidc, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            toast.success("Se guardó paquete protección")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al guardar paquete protección")
                        })
                else
                    Funciones.FNUpdate(props.oidc, {
                        ...values,
                        ProteccionID: props.Id as number
                    })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Se actualizó paquete protección")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al actualizar paquete protección")
                        })
            }}>
            <Form>
                <CustomFieldText
                    disabled={loading}
                    label='Mínimo'
                    name="Minimo"
                    placeholder='Ingrese Mínimo'
                />
                <CustomFieldText
                    disabled={loading}
                    label='Máximo'
                    name="Maximo"
                    placeholder='Ingrese Máximo'
                />
                <CustomFieldText
                    disabled={loading}
                    label='Monto'
                    name="Monto"
                    placeholder='Ingrese Monto'
                />
                <CustomSelect
                    disabled={loading}
                    label="Distribuidor Nivel"
                    name="DistribuidorNivelID"
                    placeholder="Seleccione Distribuidor Nivel"
                    options={props.optDistribuidoraNivel}
                    addDefault={false}
                />
                <CustomSelect
                    disabled={loading}
                    label="Distribuidor Nivel Origen"
                    name="OrigenNivelID"
                    placeholder="Seleccione Distribuidor Nivel Origen"
                    options={props.optDistribuidoraNivelOrigen}
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