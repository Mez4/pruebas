import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect, ActionSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from '../BancoCuentas/Funciones'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    Seguridad: IOidc,
    Id?: number,
    initialValues: {
        cuentaBancoID: number,
        numeroCuenta: string,
        bancoID: number,
        cuentaID: number,
        activo: boolean,
        puedeDispersar: boolean,
        dispersionConvenio: string,
        global: boolean,
        saldoMin: number
        saldoMax: number,
        excedenteSaldo: number,
        agrupacionID: number
    },
    cbGuardar(item: any): any,
    cerrarModalBancos(): any,
    fnCancelarModalBancos(): any,
    FnGetAcumula(value: any): any
    abrirModalBancoNuevo(): any,
    abrirModalCuentaContable(): any,
    optionsBanco: { value: number, label: string, tipoBancoID: number }[],
    optionsCuenta: { value: number, label: string }[],
    optionsAgrupacion: { value: number, label: string }[]
}

export const CFormCuentasBancos = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize={true}
            //Se hacen las validaciones de los campos en el formulario.
            validationSchema={Yup.object().shape({
                numeroCuenta: Yup.string().required("Campo obligatorio").min(4, "Minimo 4 caracteres").max(64, "Maximo 64 caracteres"),
                bancoID: Yup.number().required("Seleccione el banco").moreThan(0, 'Seleccione el banco'),
                cuentaID: Yup.number().required("Seleccione una cuenta contable").moreThan(0, 'Seleccione la cuenta contable'),
                dispersionConvenio: Yup.string().required("Campo obligatorio").min(2, "Minimo 2 caráteres, NA en caso de no aplicar").max(64, "Maximo 64 caracteres"),
                //saldoMin: Yup.number().required("Campo obligatorio solo numericos"),
                saldoMax: Yup.string().required("Campo obligatorio").min(1, "Registra una cantidad monetaria").max(8, "Debes registrar una cantidad monetaria"),
                excedenteSaldo: Yup.string().required("Campo obligatorio").min(1, "Registra una cantidad monetaria").max(8, "Debes registrar una cantidad monetaria"),
                agrupacionID: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione un producto'),
            })}

            onSubmit={(values: any, { resetForm }) => {
                setLoading(true)
                let cuentaBanco: any = {

                    numeroCuenta: values.numeroCuenta,
                    cuentaID: values.cuentaID,
                    bancoID: values.bancoID,
                    activo: values.activo,
                    dispersionConvenio: values.dispersionConvenio,
                    global: values.global,
                    puedeDispersar: values.puedeDispersar,
                    saldoMin: values.saldoMin,
                    saldoMax: values.saldoMax,
                    excedenteSaldo: values.excedenteSaldo,
                    agrupacionID: values.agrupacionID

                }
                values = cuentaBanco

                Funciones.FNAdd(props.Seguridad, values)
                    .then((respuesta: any) => {
                        toast.success('La cuenta se agregó correctamente')
                        props.fnCancelarModalBancos()
                        setLoading(false)
                        resetForm({ values: '' })
                    })
                    .catch((error: any) => {
                        toast.error("Error al guardar la cuenta" + JSON.stringify(error))
                        setLoading(false)
                    })
            }}
        >
            <Form>
                <div>

                    <CustomFieldText
                        disabled={loading}
                        label="Cuenta:"
                        name="numeroCuenta"
                        placeholder="Agregar Cuenta"
                    />
                    <hr></hr>
                    <div className="row">
                        <div className="col-6">
                            <div className="mb-3">
                                <label className="form-label mb-0" htmlFor={"bancoID"}>Banco:</label>
                                <Field name={"bancoID"} className="form-select"  >
                                    {(control: any) => (
                                        <select
                                            className="form-select"
                                            //options={state.optCuentas}                                                                  
                                            value={control.field.value}
                                            onChange={(value: any) => {
                                                control.form.setFieldValue("bancoID", parseInt(value.target.value))

                                                let bancoCuenta = props.optionsBanco.find((res) => {

                                                    return res.value === parseInt(value.target.value)
                                                })

                                                props.FnGetAcumula(bancoCuenta?.tipoBancoID)

                                            }}
                                            disabled={false}
                                            id={"bancoID"}
                                            name={"bancoID"}
                                        >
                                            <option value="0">{"Selecciona una banco"}</option>
                                            {props.optionsBanco.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                        </select>
                                    )}
                                </Field>
                                <ErrorMessage component="div" name={"bancoID"} className="text-danger" />
                            </div>
                            <div className="mb-3">
                                <button type="button" className="btn btn-outline btn-secondary waves-effect waves-light" onClick={props.abrirModalBancoNuevo} >
                                    Agregar banco nuevo
                                </button>
                            </div>




                            {/* <CustomSelect
                                disabled={props.Id === undefined ? false : true}
                                label="Banco:"
                                name="bancoID"
                                placeholder="Seleccione..."
                                options={props.optionsBanco}
                                addDefault={false}
                                isMulti={false}
                            /> */}
                        </div>
                        <div className="col-6">
                            <div className="mb-3">

                                <CustomSelect
                                    disabled={props.Id === undefined ? false : true}
                                    label="Cuenta Contable:"
                                    name="cuentaID"
                                    placeholder="Seleccione..."
                                    options={props.optionsCuenta}
                                    addDefault={false}
                                    isMulti={false}
                                />
                            </div>
                            <div className="mb-3">
                                <button type="button" className="btn btn-outline btn-secondary waves-effect waves-light" onClick={props.abrirModalCuentaContable} >
                                    Agregar cuenta contable nueva
                                </button>
                            </div>
                        </div>

                    </div>

                    <div className="row">
                        <div className="columns is-centered is-mobile is-multiline">

                            <div className="column is-align-items-center is-one-third-desktop is-one-third-tablet is-one-third-mobile">
                                <CustomFieldCheckbox disabled={loading} label="Activo" name="activo" />
                            </div>
                            <div className="column is-align-items-center is-one-third-desktop is-one-third-tablet is-one-third-mobile">
                                <CustomFieldCheckbox disabled={loading} label="Es global" name="global" />
                            </div>
                            <div className="column is-align-items-center is-one-third-desktop is-one-third-tablet is-one-third-mobile">
                                <CustomFieldCheckbox disabled={loading} label="Puede dispersar" name="puedeDispersar" />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="columns is-centered is-mobile is-multiline">

                            <div className="column is-align-items-center is-half-desktop is-half-tablet is-half-mobile">
                                <CustomFieldText
                                    disabled={loading}
                                    label="Convenio de Disp.:"
                                    name="dispersionConvenio"
                                    placeholder="Convenio de dispersión"
                                />
                            </div>
                            <div className="column is-align-items-center is-half-desktop is-half-tablet is-half-mobile">
                                <CustomSelect
                                    disabled={props.Id === undefined ? false : true}
                                    label="Agrupacion:"
                                    name="agrupacionID"
                                    placeholder="Seleccione..."
                                    options={props.optionsAgrupacion}
                                    addDefault={false}
                                    isMulti={false}
                                />
                            </div>
                        </div>

                    </div>

                    <hr></hr>
                    <div className="row">
                        <div className="col-4">
                            <CustomFieldText
                                disabled={loading}

                                label="$ Saldo Mínimo:"
                                name="saldoMin"
                                placeholder="Saldo Mínimo"
                            />
                        </div>
                        <div className="col-4">
                            <CustomFieldText
                                disabled={loading}
                                label="$ Saldo Máximo:"
                                name="saldoMax"
                                placeholder="Saldo Máximo"
                            />
                        </div>
                        <div className="col-4">
                            <CustomFieldText
                                disabled={loading}
                                label="$ Saldo Exedente"
                                name="excedenteSaldo"
                                placeholder="Saldo Excedente"
                            />
                        </div>
                    </div>


                    {loading && <Spinner />}
                    {!loading &&
                        <div className="text-end">
                            <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelarModalBancos}>
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