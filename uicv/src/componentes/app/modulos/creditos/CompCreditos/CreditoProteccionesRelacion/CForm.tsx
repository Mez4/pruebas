import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect, ActionMultipleSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { DescripcionDistribuidor } from '../../../../../../global/variables'

type CFormType = {
    oidc: IOidc
    ProteccionCabeceroID?: number,
    Id?: number,
    initialValues: {
        ProteccionCabeceroID: number,
        ProteccionesIDS: any
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    Actualizar(item: any): any,
    fnCancelar(): any,
    optProteccion: { value: number, label: string }[],
    isUpdate: boolean
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                ProteccionIDS: Yup.number().required("Campo obligatorio"),

            })}
            onSubmit={(values: any) => {
                console.log("CABECEROID", props.ProteccionCabeceroID)
                // Set our form to a loading state
                setLoading(true)

                // Finish the callback
                if (props.Id === undefined)
                    Funciones.FNAddRelacion(props.oidc, {
                        ...values,
                        ProteccionCabeceroID: props.ProteccionCabeceroID,

                    })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            props.Actualizar(respuesta)
                            toast.success("Se guardó la comisión")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al guardar la comisión")
                        })
                else
                    Funciones.FNUpdate(props.oidc, {
                        ...values,

                        ProteccionCabeceroID: props.ProteccionCabeceroID,
                        Id: props.Id as number
                    })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Se actualizó la comisión")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al actualizar la comisión")
                        })

            }}>
            <Form>

                <ActionMultipleSelect
                    disabled={loading}
                    label=""
                    name="ProteccionIDS"
                    placeholder="Seleccione los Paquetes"
                    options={props.optProteccion}
                    addDefault={false}
                    valor={props.initialValues.ProteccionesIDS}
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
