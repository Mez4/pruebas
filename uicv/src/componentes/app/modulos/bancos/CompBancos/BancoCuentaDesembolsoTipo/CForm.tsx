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
    initialValues: { cuentaId: number, tipoDesembolsoId: number, activo: boolean },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    optCuentas: { value: number, label: string }[],
    optTiposDesembolsos: { value: number, label: string }[]
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                cuentaId: Yup.number().required("Seleccione la cuenta").moreThan(0, 'Seleccione la cuenta'),
                tipoDesembolsoId: Yup.number().required("Seleccione el tipo desembolso").moreThan(0, 'Seleccione el tipo de desembolso')
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
                            toast.success("Se guardó la relación entre la cuenta y el tipo desembolso")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al guardar la relación entre la cuenta y el tipo desembolso")
                        })
                else
                    Funciones.FNUpdate(props.oidc, { ...values, BancoID: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Se actualizó la relación entre la cuenta y el tipo desembolso")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al actualizar la relación entre la cuenta y el tipo desembolso")
                        })

            }}>
            <Form>
                <CustomSelect
                    disabled={loading}
                    label="Cuenta Bancaria"
                    name="cuentaId"
                    placeholder="Seleccione la cuenta bancaria"
                    options={props.optCuentas}
                    addDefault={false}
                />
                <CustomSelect
                    disabled={loading}
                    label="Tipo Desembolso"
                    name="tipoDesembolsoId"
                    placeholder="Seleccione el tipo de desembolso"
                    options={props.optTiposDesembolsos}
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
