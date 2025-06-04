import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { ErrorMessage, Field } from 'formik'
import { toast } from 'react-toastify'

type CFormType = {
    oidc: IOidc
    Id?: number,
    OptSucursales: { value: number, label: string, producto: string }[],
    OptProductos: { value: number, label: string, producto: string }[],
    initialValues: {
        NumeroCuentaPrincipal: string,
        DescripcionCuentaPrincipal: string,
        CuentaBancoID: number,
        NumeroCuenta: string,
        DescripcionCuenta: string,
        SucursalID: number,
        ProductoID: number,
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(): any
}

export const CForm = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                NumeroCuenta: Yup.string().required("Campo obligatorio").min(3, "Mínimo 3 caracteres").max(50, "Máximo 50 caracteres"),
                DescripcionCuenta: Yup.string().required("Campo obligatorio").min(3, "Mínimo 3 caracteres").max(60, "Máximo 50 caracteres"),
                SucursalID: Yup.number().required("Campo obligatorio").moreThan(0, "Seleccione una sucursal"),
                ProductoID: Yup.number().required("Campo obligatorio").moreThan(0, "Seleccione un producto"),
            })}
            onSubmit={(values: any) => {
                setLoading(true)
                if (props.Id === undefined) {
                    toast.error("Error al replicar cuenta")
                }
                else {
                    setLoading(true)
                    let a = {
                        CuentaBancoID: props.Id,
                        NumeroCuenta: values.NumeroCuenta,
                        Descripcion: values.DescripcionCuenta,
                        SucursalID: values.SucursalID,
                        ProductoID: values.ProductoID
                    }
                    Funciones.FNAddCuenta(props.oidc, a)
                        .then((respuesta: any) => {
                            props.fnCancelar()
                            props.cbGuardar(respuesta)
                            setLoading(false)
                        })
                        .catch(() => {
                            toast.error("Ocurrió un problema al replicar cuenta")
                            setLoading(false)
                        })
                }
            }}>
            <Form>
                <div className="columns is-centered is-mobile is-multiline">

                    <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                        <CustomFieldText disabled={true} label="Tipo Cuenta Principal" name="TipoCuenta" placeholder="TipoCuenta" />
                    </div>

                    <div className="column text-center is-one-third-desktop is-half-tablet is-full-mobile">
                        <CustomFieldText disabled={true} label="Nro Cta Principal" name="NumeroCuentaPrincipal" placeholder="NumeroCuentaPrincipal" />
                    </div>

                    <div className="column text-center is-one-third-desktop is-half-tablet is-full-mobile">
                        <CustomFieldText disabled={true} label="Desc Cta Principal" name="DescripcionCuentaPrincipal" placeholder="NumeroCuentaPrincipal" />
                    </div>

                    <div className="column text-center is-half-desktop is-half-tablet  is-full-mobile">
                        <CustomFieldText disabled={loading} label="Nro Cuenta" name="NumeroCuenta" placeholder="NumeroCuenta" />
                    </div>

                    <div className="column text-center is-half-desktop is-half-tablet is-full-mobile">
                        <CustomFieldText disabled={loading} label="Desc Cuenta" name="DescripcionCuenta" placeholder="DescripcionCuenta" />
                    </div>

                    <div className="column text-center is-half-desktop is-half-tablet is-full-mobile">
                        <label className="form-label mb-0" htmlFor={"ProductoID"}>Productos</label>
                        <Field name={"ProductoID"} className="form-select"  >
                            {(control: any) => (
                                <select
                                    className="form-select"
                                    //options={state.optCuentas}                                                                  
                                    value={control.field.value}
                                    onChange={(value: any) => {
                                        //IF > 0
                                        if (value.target.value > 0) {
                                            control.form.setFieldValue("ProductoID", parseInt(value.target.value))

                                        }
                                        else {
                                            control.form.setFieldValue("ProductoID", parseInt(value.target.value))

                                        }

                                    }}
                                    disabled={false}
                                    id={"ProductoID"}
                                    name={"ProductoID"}
                                >
                                    <option value="0">{"Selecciona un producto"}</option>
                                    {props.OptProductos.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}

                                </select>

                            )}
                        </Field>
                        <ErrorMessage component="div" name={"ProductoID"} className="text-danger" />
                    </div>

                    <div className="column text-center is-half-desktop is-half-tablet is-full-mobile">
                        <label className="form-label mb-0" htmlFor={"SucursalID"}>Sucursales</label>
                        <Field name={"SucursalID"} className="form-select"  >
                            {(control: any) => (
                                <select
                                    className="form-select"
                                    //options={state.optCuentas}                                                                  
                                    value={control.field.value}
                                    onChange={(value: any) => {
                                        //IF > 0
                                        if (value.target.value > 0) {
                                            control.form.setFieldValue("SucursalID", parseInt(value.target.value))

                                        }
                                        else {
                                            control.form.setFieldValue("SucursalID", parseInt(value.target.value))

                                        }

                                    }}
                                    disabled={false}
                                    id={"SucursalID"}
                                    name={"SucursalID"}
                                >
                                    <option value="0">{"Selecciona una sucursal"}</option>
                                    {props.OptSucursales.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}

                                </select>

                            )}
                        </Field>
                        <ErrorMessage component="div" name={"SucursalID"} className="text-danger" />
                    </div>



                </div>




                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Ok</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}