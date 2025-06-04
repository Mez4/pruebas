import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    Seguridad: IOidc,
    Id?: number,
    initialValues: {
        cuentaBancoID: number,
        numeroCuenta: string,
        bancoID: number,
        cuentaID: number,
        activo: boolean
    },



    cbActualizar(item: any): any,
    cbGuardar(item: any): any,

    fnCancelar(): any,

    optionsBanco: { value: number, label: string }[],
    optionsCuenta: { value: number, label: string }[]


}



export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                numeroCuenta: Yup.string().required("Campo obligatorio").min(4, "Minimo 4 caracteres").max(64, "Maximo 64 caracteres"),
                bancoID: Yup.number().required("Seleccione el banco").moreThan(0, 'Seleccione el banco'),
                cuentaID: Yup.number().required("Seleccione una cuenta contable").moreThan(0, 'Seleccione la cuenta contable'),


            })}
            onSubmit={(values: any) => {

                setLoading(true)



                // Finish the callback
                if (props.Id === undefined) {

                    let cuentaBanco: any = {
                        numeroCuenta: values.numeroCuenta,
                        bancoID: values.bancoID,
                        cuentaID: values.cuentaID,
                        activo: values.activo,

                    }
                    values = cuentaBanco

                    Funciones.FNAdd(props.Seguridad, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)

                        })
                        .catch((error: any) => {
                            //alert("Error al guardar la cuenta" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
                else {


                    let actualizarCuentaBanco: any = {
                        cuentaBancoID: values.cuentaBancoID,
                        numeroCuenta: values.numeroCuenta,
                        bancoID: values.bancoID,
                        cuentaID: values.cuentaID,
                        activo: values.activo,

                    }
                    values = actualizarCuentaBanco


                    Funciones.FNUpdate(props.Seguridad, { ...values, cuentaBancoID: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al actualizar la cuenta" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
            }}
        >
            <Form>


                <div>

                    <CustomFieldText

                        //isDisable={

                        disabled={loading}
                        label="Cuenta:"
                        name="numeroCuenta"
                        placeholder="Agregar Cuenta"
                    />

                    <CustomSelect
                        disabled={props.Id === undefined ? false : true}
                        label="Banco:"
                        name="bancoID"
                        placeholder="Seleccione..."
                        options={props.optionsBanco}
                        addDefault={false}
                        isMulti={false}
                    />

                    <CustomSelect
                        disabled={props.Id === undefined ? false : true}
                        label="Cuenta Contable:"
                        name="cuentaID"
                        placeholder="Seleccione..."
                        options={props.optionsCuenta}
                        addDefault={false}
                        isMulti={false}
                    />
                    <CustomFieldCheckbox disabled={loading} label="Activo" name="activo" />

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
