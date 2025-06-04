import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { CustomFieldText, CustomSelect } from '../../../../../global'
import * as Funciones from './Funciones'
import { FaTimes, FaTrashAlt, FaCheckCircle } from 'react-icons/fa'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    Seguridad: IOidc,
    Id?: number,
    initialValues: {
        fecha: Date,
        estatus: number,
        tipo_poliza: string,
        numeroPoliza: number,
        cuenta: string,
        usuario: string,
        empresa: string,
        concepto: string
        fechaFinal: Date,
        fechaInicial: Date
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    opCuentasContablesModal: { value: number, label: string }[],
    explorar: boolean
    DatosDefectoModalDetalle: {
        cuenta: string,
        cuentaContableId: number,
        referencia: string,
        debe: number,
        haber: number,
        descripcion: string
    },

    cuentasContables: any[]

}

export const CFormDetalleMov = (props: CFormType) => {
    const [dPorps, setDprops] = React.useState(props)
    const [activarDesactivarHabe, setactivarDesactivarHaber] = React.useState(false)
    const [activarDesactivarDeber, setactivarDesactivarDeber] = React.useState(false)

    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optCuentas: any[] = []
    const opPolizasTipo: any[] = []
    const DatosTabla: any[] = []
    const optCuentasContables: any[] = []

    const cuentasContables: any[] = []

    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: false,
        Error: false,
        optCuentas,
        opPolizasTipo,
        startDate: null,
        endDate: null,
        DatosTabla,
        optCuentasContables,
        cuentasContables

    })
    // Loading
    const [loading, setLoading] = React.useState(false)

    const handleChange = (event: any) => {
        props.DatosDefectoModalDetalle.cuentaContableId = parseInt(event.target.value)
        if (parseInt(event.target.value) !== 0) {
            let cuenta = state.cuentasContables.find((res: any) => { return res.id === parseInt(event.target.value) })
            console.log(cuenta)
            props.DatosDefectoModalDetalle.cuenta = cuenta.cuenta
            setDprops(state => ({ ...state, DatosDefectoModalDetalle: props.DatosDefectoModalDetalle }))
        }
    }

    const obtenerCuetasContables = () => {
        Funciones.FNGetCuentasContables(props.Seguridad)
            .then((respuesta: any) => {
                var cuentasC = respuesta.map((valor: any) => {
                    var obj = { value: valor.id, label: valor.cuenta + " " + valor.nombre };
                    return obj
                });

                setState(s => ({ ...s, optCuentasContables: cuentasC, cuentasContables: respuesta }))

            })
            .catch(() => {
                setState(s => ({ ...s, optCuentasContables: [], cuentasContables: [] }))

            })
    }

    // Use effect
    React.useEffect(() => {
        obtenerCuetasContables()
    }, [])

    // Return the component
    return (
        <Formik
            initialValues={props.DatosDefectoModalDetalle}
            validationSchema={Yup.object().shape({
                cuentaContableId: Yup.number().required("Seleccione la cuenta").moreThan(0, 'Seleccione la cuenta'),
                referencia: Yup.string().required("Campo obligatorio"),
                debe: Yup.number().typeError('Solo se aceptan numeros'),
                haber: Yup.number().typeError('Solo se aceptan numeros'),
                descripcion: Yup.string().required("Campo obligatorio")

            })}
            enableReinitialize
            onSubmit={(values: any) => {
                setactivarDesactivarDeber(false)
                setactivarDesactivarHaber(false)
                values.haber = parseFloat(values.haber)
                values.debe = parseFloat(values.debe)

                let cuenta = props.cuentasContables.find((respuesta: any) => {
                    return respuesta.id === parseInt(values.cuentaContableId)
                })
                let res = cuenta.tipoCuenta.descripcion === 'ACUMULABLE'
                if (res) {
                    toast.error("Verifique el campo Cuenta, seleccione una cuenta afectable")
                } else {
                }
            }}>
            <Form>
                <div className="row">
                    <div className="col-12">
                        <CustomFieldText disabled={true} label="Cuenta" name="cuenta" placeholder="Cuenta" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="mb-3">
                            <Field name={"cuentaContableId"} className="form-select"  >
                                {(control: any) => (
                                    <select
                                        className="form-select"
                                        //options={state.optCuentas}

                                        value={control.form.initialValues.cuentaContableId}
                                        onChange={(value: any) => {
                                            handleChange(value)
                                            control.form.setFieldValue("cuentaContableId", parseInt(value.target.value))

                                        }}
                                        disabled={true}
                                        id={"cuentaContableId"}
                                        name={"cuentaContableId"}
                                    >
                                        <option value="0">{"Selecciona una cuenta"}</option>
                                        {state.optCuentasContables.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                    </select>

                                )}
                            </Field>
                            <ErrorMessage component="div" name={"cuentaContableId"} className="text-danger" />
                        </div>
                    </div>

                </div>
                <div className="row">
                    <div className="col-12">
                        <CustomFieldText disabled={false} label="Referencia" name="referencia" placeholder="Referencia" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        {
                            props.DatosDefectoModalDetalle.debe === 0 && props.Id !== undefined ?
                                <div className="mb-3">
                                    <label className="form-label mb-0" htmlFor={"debe"}>Debe</label>
                                    <Field disabled={!activarDesactivarDeber} id={"debe"} name={"debe"}
                                    >
                                        {
                                            (control: any) => (
                                                <input
                                                    type="number"
                                                    step='0.01'
                                                    placeholder='0.00'
                                                    className="form-control"
                                                    value={control.field.value}
                                                    //pattern="\d{1,10}(.\d{1,2})?"
                                                    disabled={!activarDesactivarDeber}
                                                    onBlur={value => {
                                                        console.log(value.target.value)
                                                    }}
                                                    onChange={value => {
                                                        let dec = value.target.value.indexOf(".")
                                                        let tooLong = value.target.value.length > dec + 3
                                                        let invalidNum = isNaN(parseFloat(value.target.value))

                                                        if ((dec >= 0 && tooLong) || invalidNum) {
                                                            value.target.value = value.target.value.slice(0, -1)
                                                            console.log(value)
                                                        }
                                                        setactivarDesactivarHaber(true)
                                                        control.form.setFieldValue("debe", value.target.value)
                                                    }}
                                                />
                                            )
                                        }
                                    </Field>
                                    <ErrorMessage component="div" name={"debe"} className="text-danger" />
                                </div>
                                :
                                <div className="mb-3">
                                    <label className="form-label mb-0" htmlFor={"debe"}>Debe</label>
                                    <Field disabled={activarDesactivarDeber} id={"debe"} name={"debe"}
                                    >
                                        {
                                            (control: any) => (
                                                <input
                                                    type="number"
                                                    step='0.01'
                                                    placeholder='0.00'
                                                    className="form-control"
                                                    value={control.field.value}
                                                    //pattern="\d{1,10}(.\d{1,2})?"
                                                    disabled={activarDesactivarDeber}
                                                    onBlur={value => {
                                                        console.log(value.target.value)
                                                    }}
                                                    onChange={value => {
                                                        let dec = value.target.value.indexOf(".")
                                                        let tooLong = value.target.value.length > dec + 3
                                                        let invalidNum = isNaN(parseFloat(value.target.value))

                                                        if ((dec >= 0 && tooLong) || invalidNum) {
                                                            value.target.value = value.target.value.slice(0, -1)
                                                            console.log(value)
                                                        }
                                                        setactivarDesactivarHaber(true)
                                                        control.form.setFieldValue("debe", value.target.value)
                                                    }}
                                                />
                                            )
                                        }
                                    </Field>
                                    <ErrorMessage component="div" name={"debe"} className="text-danger" />
                                </div>

                        }
                    </div>
                    <div className="col-6">
                        {
                            props.DatosDefectoModalDetalle.haber === 0 && props.Id !== undefined ?

                                <div className="mb-3">
                                    <label className="form-label mb-0" htmlFor={"haber"}>Haber</label>
                                    <Field disabled={!activarDesactivarHabe} id={"haber"} name={"haber"}
                                    >
                                        {
                                            (control: any) => (
                                                <input
                                                    type="number"
                                                    step='0.01'
                                                    placeholder='0.00'
                                                    className="form-control"
                                                    value={control.field.value}
                                                    //pattern="\d{1,10}(.\d{1,2})?"
                                                    disabled={!activarDesactivarHabe}
                                                    onChange={value => {
                                                        let dec = value.target.value.indexOf(".")
                                                        let tooLong = value.target.value.length > dec + 3
                                                        let invalidNum = isNaN(parseFloat(value.target.value))

                                                        if ((dec >= 0 && tooLong) || invalidNum) {
                                                            value.target.value = value.target.value.slice(0, -1)
                                                            console.log(value)
                                                        }
                                                        setactivarDesactivarDeber(true)
                                                        control.form.setFieldValue("haber", value.target.value)
                                                    }}
                                                />
                                            )
                                        }
                                    </Field>
                                    <ErrorMessage component="div" name={"haber"} className="text-danger" />
                                </div>

                                :
                                <div className="mb-3">
                                    <label className="form-label mb-0" htmlFor={"haber"}>Haber</label>
                                    <Field disabled={activarDesactivarHabe} id={"haber"} name={"haber"}
                                    >
                                        {
                                            (control: any) => (
                                                <input
                                                    type="number"
                                                    step='0.01'
                                                    placeholder='0.00'
                                                    className="form-control"
                                                    value={control.field.value}
                                                    //pattern="\d{1,10}(.\d{1,2})?"
                                                    disabled={activarDesactivarHabe}
                                                    onChange={value => {
                                                        let dec = value.target.value.indexOf(".")
                                                        let tooLong = value.target.value.length > dec + 3
                                                        let invalidNum = isNaN(parseFloat(value.target.value))

                                                        if ((dec >= 0 && tooLong) || invalidNum) {
                                                            value.target.value = value.target.value.slice(0, -1)
                                                            console.log(value)
                                                        }
                                                        control.form.setFieldValue("haber", value.target.value)
                                                        setactivarDesactivarDeber(true)
                                                    }}
                                                />
                                            )
                                        }
                                    </Field>
                                    <ErrorMessage component="div" name={"haber"} className="text-danger" />
                                </div>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <CustomFieldText disabled={false} label="Descripción" name="descripcion" placeholder="Descripción" />
                    </div>
                </div>
                <div className="row">
                    <div className=" text-end">
                        <button type="button" className="ms-2 btn btn-danger waves-effect waves-light" onClick={() => {
                            props.fnCancelar();
                            setactivarDesactivarDeber(false)
                            setactivarDesactivarHaber(false)
                        }}>
                            <FaTimes />  Cancelar
                        </button>
                        <button type="button" className="ms-2 btn btn-danger waves-effect waves-light">
                            <FaTrashAlt /> Borrar
                        </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                            <FaCheckCircle /> Aceptar
                        </button>
                    </div>
                </div>


            </Form>
        </Formik>
    )
}