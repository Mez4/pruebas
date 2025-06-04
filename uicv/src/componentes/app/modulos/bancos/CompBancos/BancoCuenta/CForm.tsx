import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'

type CFormType = {
    oidc: IOidc
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
                Cuenta: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracter").max(30, "Maximo 30 caracteres"),
                NombreCuenta: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracter").max(80, "Maximo 80 caracteres"),
                DispersionConvenio: Yup.string().required("Campo obligatorio").max(32, "Maximo 32 caracteres"),
                UsuarioId: Yup.number().required("Seleccione el usuario").moreThan(0, 'Seleccione el usuario'),
                orden: Yup.number().required("Campo obligatorio"),
                importeEnBalance: Yup.number().required("Campo obligatorio"),
                importePendienteBalance: Yup.number().required("Campo obligatorio"),
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
                            toast.success("Se guardó la cuenta")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                           // toast.error("Error al guardar la cuenta")
                        })
                else
                    Funciones.FNUpdate(props.oidc, { ...values, CuentaID: props.Id as number })
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
                />
                <CustomFieldText disabled={loading} label="Cuenta" name="Cuenta" placeholder="Número de la Cuenta" />
                <CustomFieldText disabled={loading} label="Nombre Cuenta" name="NombreCuenta" placeholder="Nombre de la Cuenta" />
                <CustomFieldText disabled={loading} label="Convenio Dispersion" name="DispersionConvenio" placeholder="Número de convenio para dispersiones" />
                <CustomSelect
                    disabled={loading}
                    label="Usuario autorizado para aplicar pagos a la cuenta"
                    name="UsuarioId"
                    placeholder="Seleccione el Usuario"
                    options={props.optUsuarios}
                    addDefault={false}
                />
                <CustomFieldCheckbox disabled={loading} label="Cuenta puede realizar dispersiones" name="PuedeDispersar" />
                <CustomFieldCheckbox disabled={loading} label="Cuenta activa" name="activa" />
                <CustomFieldCheckbox disabled={loading} label="Cuenta será global" name="global" />
                <CustomFieldText disabled={loading} label="Orden" name="orden" placeholder="Orden para reportes" />
                <CustomFieldText disabled={loading} label="Importe en Balance" name="importeEnBalance" placeholder="Importe total en la cuenta al momento de generar el balance" />
                <CustomFieldText disabled={loading} label="Importe Pendiente" name="importePendienteBalance" placeholder="Importe en tránsito en la cuenta que aún no se encuentra en balance" />
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
