import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect, ActionAsyncSelect, ActionSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    Seguridad: IOidc,
    Id?: number
    initialValues: {
        MovimientoID: number,
        CuentaID: number,
        Nombre: string,
        CuentaDestinoID: number,
        CuentaEnvia: number,
        CuentaDestino: string,
        FechaAfectacion: string,
        FechaCaptura: string,
        NombreCompleto: string
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    optCuentas: { value: number, label: string }[],
    optTipoCuentaBancaria: { value: number, label: string }[],

}

export const CForm = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                CatalogoCuentaID: Yup.number().required("Campo obligatorio").moreThan(0, "Seleccione una opción"),
                Monto: Yup.number().required("Campo obligatorio").min(2, "Minimo 2 caracteres"),
            })}
            onSubmit={(values: any) => {

                setLoading(true)
                console.log(values, 'Valores')
                let Agregarmovimiento: any = {

                    CatalogoCuentaID: values.CatalogoCuentaID,
                    Monto: values.Monto,
                    CargoAbono: values.CargoAbono,
                    Observaciones: values.Observaciones,

                }
                values = Agregarmovimiento
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

            }
        >
            <Form>
                <div className="columns is-centered is-mobile is-multiline">
                    <div className="column is-align-items-center is-half-desktop is-half-tablet is-full-mobile">
                        <ActionSelect
                        disabled={false}
                        name="CatalogoCuentaID"
                        placeholder="Seleccione el banco..."
                        label={"Cuenta:"}
                        options={props.optCuentas}
                        addDefault={false}
                        />
                    </div>
                    <div className="column is-align-items-center is-half-desktop is-half-tablet is-full-mobile">
                        <CustomFieldText
                            disabled={loading}
                            label="Monto:"
                            name="Monto"
                            placeholder="Monto"
                        />
                    </div>
                    <div className="column is-align-items-center is-half-desktop is-half-tablet is-full-mobile">
                        <CustomFieldCheckbox disabled={loading} label="Cargo / Abono" name="CargoAbono" />
                    </div>
                    <div className="column is-align-items-center is-half-desktop is-half-tablet is-full-mobile">
                        <CustomFieldText
                            disabled={loading}
                            label="Observaciones:"
                            name="Observaciones"
                            placeholder="Observaciones"
                        />

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
