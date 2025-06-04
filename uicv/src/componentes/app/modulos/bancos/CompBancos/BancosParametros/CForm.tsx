import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    Seguridad: IOidc,
    Id?: number,
    initialValues: {
        BancoID: number,
        Cuenta: string,
        NombreCuenta: string,
        UsuarioId: number,
        DispersionConvenio: string,
        PuedeDispersar: boolean,
        LogoImg: string,
        activa: boolean,
        global: boolean,
        orden: number,
        importeEnBalance: number,
        importePendienteBalance: number
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
                BancoID: Yup.number().required("Seleccione el banco").moreThan(0, 'Seleccione el banco'),
                Ceuntaa: Yup.number().required("Seleccione el banco").moreThan(0, 'Seleccione el banco'),
                Cuenta: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracter").max(30, "Maximo 30 caracteres"),
                importePendienteBalance: Yup.number().required("Campo obligatorio"),
            })}

            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)

                // Finish the callback
                if (props.Id === undefined)
                    Funciones.FNAdd(props.Seguridad, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            toast.success("Se guardó la cuenta")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al guardar la cuenta")
                        })
                else
                    Funciones.FNUpdate(props.Seguridad, { ...values, CuentaID: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Se actualizó la cuenta")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al actualizar la cuenta")
                        })
            }}>

            <Form>
                <CustomSelect
                    disabled={loading}
                    label="Banco"
                    name="BancoID"
                    placeholder="Seleccione el Banco"
                    options={props.optBancos}
                    addDefault={false}
                    isMulti={false}
                />
                <CustomFieldText disabled={props.Id === undefined ? true : false} label="BancoT" name="BancoT" placeholder="Importe Máximo" />

                <CustomFieldCheckbox disabled={loading} label="Estatus de Banco" name="PuedeDispersar" />

                <CustomFieldText disabled={loading} label="Importe Máximo" name="importeEnBalance" placeholder="Importe Máximo" />

                <CustomFieldText disabled={loading} label="Importe Mínimo" name="importePendienteBalance" placeholder="Importe Mínimo" />

                <CustomSelect
                    disabled={loading}
                    label="Cuenta de Banco"
                    name="Cuentaa"
                    placeholder="Seleccione una cuenta"
                    options={props.optBancos}
                    addDefault={false}
                    isMulti={false}
                />

                <CustomFieldText disabled={loading} label="Saldo" name="q" placeholder="Saldo" />

                <CustomSelect
                    disabled={loading}
                    label="Cuenta "
                    name="CuentaB"
                    placeholder="Seleccione una cuenta"
                    options={props.optBancos}
                    addDefault={false}
                    isMulti={false}
                />

                <CustomFieldCheckbox disabled={loading} label="Estatus de Cuenta" name="x" />

                <CustomFieldText disabled={loading} label="Fecha" name="Fecha" placeholder="Cuenta" />

                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                            Ok
                        </button>
                    </div>
                }
            </Form>
        </Formik>
    )
}
