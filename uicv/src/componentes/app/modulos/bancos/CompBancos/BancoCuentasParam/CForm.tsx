import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'

type CFormType = {
    Seguridad: IOidc,
    Id?: number,
    initialValues: {
        parametrosID: number,
        bancoID: number,
        cuentaBancoID: number,
        montoMin: number,
        montoMax: number
    },



    cbActualizar(item: any): any,
    cbGuardar(item: any): any,

    fnCancelar(): any,

    optionsBanco: { value: number, label: string }[],
    optionsCuenta: { value: number, label: string }[],
    // optionsAcumula: { value: number, label: string }[]


}



export const CForm = (props: CFormType) => {

    /*
    
    const [depProps, setDepProps] = React.useState(props)

    
    const handleChange = (event: any) => {
        props.initialValues.bancoID = parseInt(event.target.value)

        setDepProps(state => ({ ...state, initialValues: props.initialValues }))
        Funciones.FNGetContable(props.Seguridad, parseInt(event.target.value))
            .then((respuesta: any) => {

                var cuentaBanco = respuesta.map((valor: any) => {
                    var obj = { value: valor.cuentaBancoID, label: valor.numeroCuenta };
                    return obj
                });
                setDepProps(s => ({ ...s, optionsCuenta: cuentaBanco }))

                console.log(respuesta)
                console.log(depProps)
            })
            .catch(() => {

            })
    };
    */

    const [loading, setLoading] = React.useState(false)
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({

                bancoID: Yup.number().required("Seleccione el banco").moreThan(0, 'Seleccione el banco'),
                cuentaBancoID: Yup.number().required("Seleccione una cuenta bancaria").moreThan(0, 'Seleccione la cuenta contable'),
                montoMin: Yup.number().required("Campo Obligatorio").moreThan(0, 'No permite letras ni valores negativos'),
                montoMax: Yup.number().required("Campo Obligatorio").moreThan(0, 'No permite letras ni valores negativos'),



            })}
            onSubmit={(values: any) => {
                console.log("submit")
                setLoading(true)



                // Finish the callback
                if (props.Id === undefined) {

                    let cuentaBanco: any = {
                        cuentaBancoID: parseInt(values.cuentaBancoID),
                        montoMin: parseInt(values.montoMin),
                        montoMax: parseInt(values.montoMax)

                    }
                    values = cuentaBanco

                    Funciones.FNAdd(props.Seguridad, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)

                        })
                        .catch((error: any) => {
                            toast.error('Seleccione otra cuenta, esta ya se encuentra parametrizada')
                            // alert("Error al guardar los parametros" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
                else {


                    let actualizarCuentaBanco: any = {
                        parametrosID: values.parametrosID,
                        cuentaBancoID: values.cuentaBancoID,
                        montoMin: values.montoMin,
                        montoMax: values.montoMax


                    }
                    values = actualizarCuentaBanco


                    Funciones.FNUpdate(props.Seguridad, { ...values, parametrosID: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al actualizar los parametros" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
            }}
        >
            <Form>

                <div>

                    <CustomSelect
                        disabled={props.Id === undefined ? false : true}
                        label="Banco:"
                        name="bancoID"
                        placeholder="Seleccione..."
                        options={props.optionsBanco}
                        addDefault={false}
                        isMulti={false}
                    //onChange={handleChange}
                    />

                    <div className="mb-3">
                        <label className="form-label mb-0" htmlFor={"cuentaBancoID"}>Cuenta Bancaria:</label>
                        <Field name={"cuentaBancoID"} className="form-select"  >
                            {(control: any) => (
                                <select
                                    className="form-select"
                                    //options={state.optCuenta}                                                                  
                                    value={control.field.value}
                                    onChange={(value: any) => {
                                        control.form.setFieldValue("cuentaBancoID", parseInt(value.target.value))
                                    }}
                                    disabled={props.Id === undefined ? false : true}
                                    id={"cuentaBancoID"}
                                    name={"cuentaBancoID"}
                                >
                                    <option value="0">{"Selecciona una cuenta"}</option>
                                    {props.optionsCuenta.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                </select>

                            )}
                        </Field>
                        <ErrorMessage component="div" name={"cuentaBancoID"} className="text-danger" />
                    </div>

                    {/**  <CustomSelect
                        disabled={props.Id === undefined ? false : true}
                        label="Cuenta Bancarias:"
                        name="cuentaID"
                        placeholder="Seleccione..."
                        options={props.optionsCuenta}
                        addDefault={false}
                        isMulti={false}
                    />*/}

                    <CustomFieldText
                        disabled={loading}
                        label="Monto Mínimo:"
                        name="montoMin"
                        placeholder="Monto Mínimo"
                    />

                    <CustomFieldText
                        disabled={loading}
                        label="Monto Maximo:"
                        name="montoMax"
                        placeholder="Monto Máximo"
                    />




                    {/**   <CustomFieldText 
                    disabled={loading}
                    label="Cuenta:" 
                    name="numeroCuenta" 
                    placeholder="Agregar Cuenta" 
                /> */}

                    {/** <CustomFieldCheckbox disabled={loading} label="Activo" name="activo" /> */}

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

