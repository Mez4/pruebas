import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    Seguridad: IOidc,
    Id?: number
    initialValues: {
        BancoID: number,
        NumeroCuenta: String
        DescripcionCuenta: String
        TipoCuentaBancoID: number
        EsReal: boolean,
        CuentaActiva: boolean
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    optBancos: { value: number, label: string }[],
    optTipoCuentaBancaria: { value: number, label: string }[],

}

export const CForm = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                NumeroCuenta: Yup.string().required("Campo obligatorio").min(1, "Minimo 5 caracteres").max(64, "1"),
                DescripcionCuenta: Yup.string().required("Campo obligatorio").min(1, "Minimo 5 caracteres").max(64, "Maximo 64 caracteres"),
                TipoCuentaBancoID: Yup.number().required("Campo obligatorio").moreThan(0, "Seleccione una opción"),
                BancoID: Yup.number().required("Campo obligatorio").moreThan(0, "Seleccione una opción"),

            })}
            onSubmit={(values: any) => {

                setLoading(true)

                // Finish the callback
                if (props.Id === undefined) {

                    let agregarCuenta: any = {

                        NumeroCuenta: values.NumeroCuenta,
                        DescripcionCuenta: values.DescripcionCuenta,
                        TipoCuentaBancoID: values.TipoCuentaBancoID,
                        BancoID: values.BancoID,
                        EsReal: values.EsReal,
                        CuentaActiva: values.CuentaActiva,

                    }
                    values = agregarCuenta
                    Funciones.FNAddCuenta(props.Seguridad, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)

                        })
                        .catch((error: any) => {
                            alert("Error al guardar la cuenta" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
                else {
                    let actualizarCuenta: any = {
                        CuentaBancariaPrincipalID: props.Id,
                        NumeroCuenta: values.NumeroCuenta,
                        DescripcionCuenta: values.DescripcionCuenta,
                        TipoCuentaBancoID: values.TipoCuentaBancoID,
                        BancoID: values.BancoID,
                        EsReal: values.EsReal,
                        Activa: values.CuentaActiva,

                    }
                    values = actualizarCuenta


                    Funciones.FNUpdateCuenta(props.Seguridad, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            console.log('RESPUESTA ')
                            console.log(respuesta)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al actualizar la conciliación" + JSON.stringify(error))
                            setLoading(false)
                        })
                }

            }}
        >
            <Form>
                <div className="columns is-centered is-mobile is-multiline">
                    <div className="column is-align-items-center is-half-desktop is-half-tablet is-full-mobile">

                        <CustomFieldText
                            disabled={loading}
                            label="Número cuenta:"
                            name="NumeroCuenta"
                            placeholder="Número cuenta"
                        />
                    </div>
                    <div className="column is-align-items-center is-half-desktop is-half-tablet is-full-mobile">
                        <CustomFieldText
                            disabled={loading}
                            label="Descripción:"
                            name="DescripcionCuenta"
                            placeholder="Descripción"
                        />
                    </div>
                    <div className="column is-align-items-center is-half-desktop is-half-tablet is-full-mobile">
                        <CustomSelect
                            disabled={false}
                            label={"Banco:"}
                            name="BancoID"
                            placeholder="Seleccione el banco..."
                            options={props.optBancos}
                            addDefault={false}
                            isMulti={false}
                        />
                    </div>
                    <div className="column is-align-items-center is-half-desktop is-half-tablet is-full-mobile">
                        <CustomSelect
                            disabled={false}
                            label={"Tipo Cuenta:"}
                            name="TipoCuentaBancoID"
                            placeholder="Seleccione el tipo de cuenta..."
                            options={props.optTipoCuentaBancaria}
                            addDefault={false}
                            isMulti={false}
                        />
                    </div>
                    <div className="column is-align-items-center is-half-desktop is-half-tablet is-full-mobile">
                        <CustomFieldCheckbox disabled={loading} label="Es Real" name="EsReal" />
                    </div>
                    <div className="column is-align-items-center is-half-desktop is-half-tablet is-full-mobile">
                        <CustomFieldCheckbox disabled={loading} label="Activa" name="CuentaActiva" />
                    </div>
                    {loading && <Spinner />}
                    {!loading &&
                        <div className="column is-align-items-center is-full-desktop is-full-tablet is-full-mobile">
                            <div className="text-end">
                                <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                    Cancelar
                                </button>
                                <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                    Ok
                                </button>
                            </div>
                        </div>
                    }
                </div>



            </Form>

        </Formik>
    )
}
