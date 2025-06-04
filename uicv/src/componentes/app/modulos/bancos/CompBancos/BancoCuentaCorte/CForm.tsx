import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect, CustomFieldDatePicker } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: {
        cuentaId: number,
        fecha?: Date,
        usuarioID: number,
        observaciones: string,
        importeSistema: number,
        importeFisico: number,
        diferencia: number,
        fechaCaptura?: Date,
        saldoInicial: number,
        cancelado: boolean,
        usuarioIdCancela: number,
        comentarioCancela: string,
        importeSistemaAnt: number,
        importeFisicoAnt: number,
        fechaAnt?: Date
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    optCuentas: { value: number, label: string }[]
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                cuentaId: Yup.number().required("Seleccione la cuenta").moreThan(0, 'Seleccione la cuenta'),
                observaciones: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracter").max(500, "Maximo 500 caracteres"),
                importeFisico: Yup.number().required("Campo obligatorio"),
                fecha: Yup.date().required("Seleccione la fecha de corte").nullable()
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
                            toast.success("Se guardó el corte de caja")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al guardar el corte de caja")
                        })
                else
                    Funciones.FNUpdate(props.oidc, { ...values, BancoID: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Se actualizó el corte de caja")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al actualizar el corte de caja")
                        })

            }}>
            <Form>
                <CustomFieldDatePicker
                    disabled={loading}
                    label="Fecha de Corte"
                    name="fecha"
                    placeholder="Seleccione la fecha"
                />
                <CustomSelect
                    disabled={loading}
                    label="Cuenta Bancaria"
                    name="cuentaId"
                    placeholder="Seleccione la cuenta bancaria"
                    options={props.optCuentas}
                    addDefault={false}
                />
                <CustomFieldText disabled={loading} label="Observaciones" name="observaciones" placeholder="Observaciones" />
                <CustomFieldText disabled={loading} label="Importe" name="importeFisico" placeholder="Importe" />
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
