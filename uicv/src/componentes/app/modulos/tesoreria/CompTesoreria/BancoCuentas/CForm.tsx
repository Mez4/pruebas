import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import yup from '../../../../../../global/yupLocale'

type CFormType = {
    Seguridad: IOidc,
    Id?: number,
    initialValues: {
        descripcionCuenta: string,
        cuentaBancoID: number,
        numeroCuenta: string,
        bancoID: number,
        cuentaID: number,
        activo: boolean,
        puedeDispersar: boolean,
        dispersionConvenio: string,
        cobranzaConvenio: string,
        global: boolean,
        saldoMin: number
        saldoMax: number,
        saldoActual: number,
        banderaSaldoActual: boolean,
        excedenteSaldo: number,
        productoID: number,
        cajaID: number,
        EsBoveda: boolean,
        sucursalId: number,
        responsableNombre: string,
        encargadoNombre: string
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    abrirModalCuentaContable(): any,
    abrirModalBancoNuevo(): any,
    FnGetAcumula(value: any): any,
    optionsSucursal: { value: number, label: string }[]
    optionsBanco: { value: number, label: string, tipoBancoID: number }[],
    optionsCuenta: { value: number, label: string, sucursalID: number }[],
    optionsAgrupacion: { value: number, label: string }[]
    optionsCuentasPrincipal: { value: number, label: string }[]
}

export const CForm = (props: CFormType) => {
    const optionsCajas: any[] = []

    const [loading, setLoading] = React.useState(false)
    const [saldoActualFlag, setSaldoActualFlag] = React.useState(props.initialValues.banderaSaldoActual)
    const [activarSucursales, setActivarDesactivarSucursales] = React.useState()

    const [state, setState] = React.useState({
        optionsCajas,
        sucursal: "",
        sucursalID: 0,
        MostrarProducto: true,
        EsBovedaBool: false
    })
    const handleCheckClick = () => {
        setState(s => ({ ...s, EsBovedaBool: !state.EsBovedaBool }));
        //props.initialValues.EsBoveda = state.EsBovedaBool
    }

    /*  React.useEffect(() => {
         if (!state.EsBovedaBool) {
             setActivarDesactivarSucursales(false)
             console.log("ES BOVEDA ,", state.EsBovedaBool)
             return;
         } else {
             console.log("ES BOVEDA ,", state.EsBovedaBool)
             setActivarDesactivarSucursales(true)
         }
     }, [state.EsBovedaBool]) */

    /*     React.useEffect(() => {
            if (props.initialValues.EsBoveda) {
                setState(s => ({ ...s, EsBovedaBool: props.initialValues.EsBoveda }));
    
                console.log("STATE TRUE ,", state.EsBovedaBool)
                return;
            } else {
                setState(s => ({ ...s, EsBovedaBool: props.initialValues.EsBoveda }));
                console.log("STATE FALSE,", state.EsBovedaBool)
    
            }
        }, [props.initialValues.EsBoveda]) */

    /*   React.useEffect(() => {
          if (props.initialValues.cajaID > 0) {
              setActivarDesactivarSucursales(false)
              return;
          } else {
              setActivarDesactivarSucursales(true)
          }
      }, [props.initialValues]) */
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            //Se hacen las validaciones de los campos en el formulario.
            validationSchema={Yup.object().shape({
                numeroCuenta: Yup.string().required("Campo obligatorio").min(4, "Minimo 4 caracteres").max(64, "Maximo 64 caracteres"),
                CuentaBancariaPrincipalID: Yup.number().required("Seleccione la cuenta").moreThan(0, 'Seleccione el banco'),
                cuentaID: Yup.number().required("Seleccione una cuenta contable").moreThan(0, 'Seleccione la cuenta contable'),
                dispersionConvenio: Yup.string().required("Campo obligatorio").min(2, "Minimo 2 carateres, NA en caso de no aplicar").max(64, "Maximo 64 caracteres"),
                cobranzaConvenio: Yup.string().required("Campo obligatorio").min(2, "Minimo 2 carateres, NA en caso de no aplicar").max(64, "Maximo 64 caracteres"),
                saldoMax: Yup.number().required("Campo obligatorio").moreThan(0, "Registra una cantidad monetaria superior a 0"),
                saldoMin: Yup.number().required("Campo obligatorio").moreThan(0, "Registra una cantidad monetaria superior a 0"),
                excedenteSaldo: Yup.number().required("Campo obligatorio").moreThan(0, "Registra una cantidad monetaria superior a 0"),
                //excedenteSaldo: Yup.string().required("Campo obligatorio").min(1, "Registra una cantidad monetaria").max(8, "Debes registrar una cantidad monetaria"),
                descripcionCuenta: Yup.string().required("Campo obligatorio").min(4, "Minimo 4 caracteres").max(64, "Maximo 64 caracteres"),
                //productoID: Yup.number().when("EsBoveda", { is: !state.EsBovedaBool ? true : false, then: yup.number().required("Seleccione el producto").moreThan(0, 'Seleccione el banco'), })
                productoID: Yup.number().required("Seleccione el producto").moreThan(0, 'Seleccione el banco'),
            })}

            onSubmit={(values: any) => {
                setLoading(true)
                // Finish the callback
                if (props.Id === undefined) {
                    let cuentaBanco: any = {
                        numeroCuenta: values.numeroCuenta,
                        cuentaID: values.cuentaID,
                        CuentaBancariaPrincipalID: values.CuentaBancariaPrincipalID,
                        activo: values.activo,
                        dispersionConvenio: values.dispersionConvenio,
                        cobranzaConvenio: values.cobranzaConvenio,
                        global: values.global,
                        puedeDispersar: values.puedeDispersar,
                        saldoMin: values.saldoMin,
                        saldoMax: values.saldoMax,
                        saldoActual: values.banderaSaldoActual ? values.saldoActual : 0,
                        excedenteSaldo: values.excedenteSaldo,
                        productoID: values.productoID,
                        descripcionCuenta: values.descripcionCuenta,
                        cajaID: values.cajaID,
                        sucursalID: values.sucursalId,
                        EsBoveda: values.EsBoveda
                    }
                    values = cuentaBanco
                    Funciones.FNAdd(props.Seguridad, values)
                        //RESPUESTA TOTAL
                        .then((respuesta: any) => {
                            setLoading(false)
                            if (respuesta.status == 206) {
                                toast.error(respuesta.data.data)
                            }
                            if (respuesta.status == 200) {
                                props.cbGuardar(respuesta.data)
                            }
                        })
                        .catch((error: any) => {
                            toast.error("Ocurrió un problema al guardar la cuenta")
                            console.log(error)
                            //alert("Error al guardar la cuenta" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
                else {
                    let actualizarCuentaBanco: any = {
                        cuentaBancoID: values.cuentaBancoID,
                        numeroCuenta: values.numeroCuenta,
                        cuentaID: values.cuentaID,
                        CuentaBancariaPrincipalID: values.CuentaBancariaPrincipalID,
                        activo: values.activo,
                        dispersionConvenio: values.dispersionConvenio,
                        cobranzaConvenio: values.cobranzaConvenio,
                        global: values.global,
                        puedeDispersar: values.puedeDispersar,
                        saldoMin: values.saldoMin,
                        saldoMax: values.saldoMax,
                        saldoActual: values.saldoActual,
                        excedenteSaldo: values.excedenteSaldo,
                        productoID: values.productoID,
                        descripcionCuenta: values.descripcionCuenta,
                        cajaID: values.cajaID,
                        sucursalID: state.sucursalID,
                        EsBoveda: values.EsBoveda
                    }
                    values = actualizarCuentaBanco

                    Funciones.FNUpdate(props.Seguridad, { ...values, cuentaBancoID: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta);
                        })
                        .catch((error: any) => {
                            if (error.response) {
                                toast.error(error.response.data.error)
                            }
                            setLoading(false)
                        })
                }
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
                    <CustomFieldText
                        disabled={loading}
                        label="Descripción de cuenta:"
                        name="descripcionCuenta"
                        placeholder="Agregar descripción de la cuenta"
                    />
                    <hr></hr>
                    <div className="mb-3">
                        <CustomFieldCheckbox disabled={loading} label="¿Es bóveda?" name="EsBoveda" />
                        {/*                         <CustomFieldCheckbox disabled={loading} label="¿Es bóveda?" name="EsBoveda" />
 */}                    </div>
                    <div className="row">
                        <div className="col-6">
                            <div className="mb-3">
                                <label className="form-label mb-0" htmlFor={"CuentaBancariaPrincipalID"}>Cuenta Principal:</label>
                                <Field name={"CuentaBancariaPrincipalID"} className="form-select"  >
                                    {(control: any) => (
                                        <select
                                            disabled={props.Id === undefined ? false : true}
                                            className="form-select"
                                            value={control.field.value}
                                            onChange={(value: any) => {
                                                control.form.setFieldValue("CuentaBancariaPrincipalID", parseInt(value.target.value))
                                                /*  let bancoCuenta = props.optionsBanco.find((res) => {
                                                     return res.value === parseInt(value.target.value)
                                                 })
 
                                                 props.FnGetAcumula(bancoCuenta?.tipoBancoID) */
                                            }}
                                            id={"CuentaBancariaPrincipalID"}
                                            name={"CuentaBancariaPrincipalID"}
                                        >
                                            <option value="0">{"Selecciona una cuenta"}</option>
                                            {props.optionsCuentasPrincipal.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                        </select>
                                    )}
                                </Field>
                                <ErrorMessage component="div" name={"CuentaBancariaPrincipalID"} className="text-danger" />
                            </div>
                            {/*  <div className="mb-3">
                                <button
                                    disabled={props.Id === undefined ? false : true}
                                    type="button" className="btn btn-outline btn-secondary waves-effect waves-light" onClick={props.abrirModalBancoNuevo} >
                                    Agregar banco
                                </button>
                            </div> */}
                        </div>

                        <div className="col-6">
                            <div className="mb-3">
                                <label className="form-label mb-0" htmlFor={"cuentaID"}>Cuenta Contable</label>
                                <Field name={"cuentaID"} className="form-select"  >
                                    {(control: any) => (
                                        <select
                                            className="form-select"
                                            //options={state.optCuentas}                                                                  
                                            value={control.field.value}
                                            onChange={(value: any) => {
                                                control.form.setFieldValue("cuentaID", parseInt(value.target.value))
                                                if (parseInt(value.target.value) !== 0) {
                                                    let index = props.optionsCuenta.findIndex((res: any) => {
                                                        return res.value === parseInt(value.target.value)
                                                    })
                                                    /*      if (props.optionsCuenta[index].sucursalID !== null) {
                                                             if (!state.EsBovedaBool) {
                                                                 //setActivarDesactivarSucursales(false)
                                                                 console.log("SUCURSAL ", state.sucursalID)
                                                                 Funciones.FNGetCajas(props.Seguridad, props.optionsCuenta[index].sucursalID)
                                                                     .then((respuesta: any) => {
                                                                         setState(s => ({ ...s, optionsCajas: respuesta.cajas, sucursal: respuesta.sucursal, sucursalID: props.optionsCuenta[index].sucursalID }))
                                                                         if (respuesta.cajas.length <= 0) {
                                                                             toast.info("La sucursal " + respuesta.sucursal + " no cuenta con cajas")
                                                                         }
                                                                     })
                                                                     .catch((error: any) => {
                                                                         setState(s => ({ ...s, optionsCajas: [], sucursal: "" }))
                                                                         toast.error("Ocurrió un error, recarga la página")
                                                                     })
                                                             }
                                                         } else {
                                                             setActivarDesactivarSucursales(true)
                                                             setState(s => ({ ...s, optionsCajas: [], sucursal: "" }))
                                                             control.form.setFieldValue("cajaID", 0)
                                                         } */
                                                } else {
                                                    setState(s => ({ ...s, optionsCajas: [], sucursal: "" }))
                                                    // setActivarDesactivarSucursales(true)
                                                    control.form.setFieldValue("cajaID", 0)
                                                }
                                            }}
                                            disabled={props.Id === undefined ? false : true}
                                            id={"cuentaID"}
                                            name={"cuentaID"}
                                        >
                                            <option value="0">{"Selecciona una cuenta contable"}</option>
                                            {props.optionsCuenta.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                        </select>

                                    )}
                                </Field>
                                <ErrorMessage component="div" name={"cuentaID"} className="text-danger" />
                            </div>
                            {/*     <div className="mb-3">
                                <button
                                    disabled={props.Id === undefined ? false : true}
                                    type="button" className="btn btn-outline btn-secondary waves-effect waves-light" onClick={props.abrirModalCuentaContable} >
                                    Agregar cuenta contable
                                </button>
                            </div> */}
                        </div>
                    </div>
                    {/*   <div className="row" hidden={activarSucursales}>
                        <div className="col-12">
                            <CustomSelect
                                disabled={props.Id === undefined ? false : true}
                                label={"Cajas de la sucursal " + state.sucursal}
                                name="cajaID"
                                placeholder="Seleccione..."
                                options={state.optionsCajas}
                                addDefault={false}
                                isMulti={false}
                            />
                        </div>
                    </div> */}
                    <div className="row">
                        <div className="col-4">
                            <CustomFieldCheckbox disabled={loading} label="Activo" name="activo" />
                        </div>
                        <div className="col-4">
                            <CustomFieldCheckbox disabled={loading} label="Es global" name="global" />
                        </div>
                        <div className="col-4">
                            <CustomFieldCheckbox disabled={loading} label="Dispersa" name="puedeDispersar" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <CustomFieldText
                                disabled={loading}
                                label="Convenio de dispersión :"
                                name="dispersionConvenio"
                                placeholder="Convenio de dispersión"
                            />
                        </div>
                        <div className="col-12">
                            <CustomFieldText
                                disabled={loading}
                                label="Convenio de cobranza:"
                                name="cobranzaConvenio"
                                placeholder="Convenio de cobranza"
                            />
                        </div>
                        <div className="col-12">
                            <CustomSelect
                                disabled={props.Id === undefined ? false : true}
                                label="Sucursal:"
                                name="sucursalId"
                                placeholder="Seleccione..."
                                options={props.optionsSucursal}
                                addDefault={false}
                                isMulti={false}
                            />
                        </div>
                        <div className="col-12">
                            <CustomSelect
                                disabled={props.Id === undefined ? false : true}
                                label="Producto:"
                                name="productoID"
                                placeholder="Seleccione..."
                                options={props.optionsAgrupacion}
                                addDefault={false}
                                isMulti={false}
                            />
                        </div>


                    </div>

                    <hr></hr>
                    <div className="row">
                        <div className="col-6">
                            <CustomFieldText
                                disabled={loading}

                                label="$ Saldo Mínimo:"
                                name="saldoMin"
                                placeholder="Saldo Mínimo"
                            />
                        </div>
                        <div className="col-6">
                            <CustomFieldText
                                disabled={loading}
                                label="$ Saldo Máximo:"
                                name="saldoMax"
                                placeholder="Saldo Máximo"
                            />
                        </div>
                        <div className="col-6">
                            <CustomFieldText
                                disabled={loading}
                                label="$ Saldo Excedente"
                                name="excedenteSaldo"
                                placeholder="Saldo Excedente"
                            />
                        </div>
                        <div className="col-6">
                            <CustomFieldText
                                disabled={!saldoActualFlag}
                                label="$ Saldo Actual"
                                name="saldoActual"
                                placeholder="Saldo Actual"
                            />
                            <CustomFieldCheckbox disabled={props.Id === undefined ? false : true} onChage={props.Id === undefined ? ()=>setSaldoActualFlag(!saldoActualFlag): ()=>{}} label="Saldo actual" name="banderaSaldoActual"  />
                        </div>
                    </div>

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