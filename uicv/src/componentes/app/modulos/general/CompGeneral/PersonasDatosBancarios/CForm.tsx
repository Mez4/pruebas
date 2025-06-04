import React, { useRef, useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Spinner, CustomSelect, ActionSelect, ActionFieldText } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { FiRefreshCcw } from 'react-icons/fi'
// import { PERMISO, usePuedeAgregarDatoBancario } from '../../../../../hooks/DesabilitarInputBancos'
import { PERMISO, usePuedeAgregarDatoBancario } from '../../../../../hooks/DesabilitarInputBancos'


type CFormType = {
    oidc: IOidc,
    personaID: number,
    // DatosBancarios: any[],
    initialValues: {
        cveBancoRef: number,
        TelefonoMovil: number,
        telefonia: number,
        clabe: string,
        cuenta: string,
        tarjeta: string,
        codigo: number
    },
    cbGuardar(item: any): any,
    fnCancelar(): any,
    fnGetPdf(item: any): any,
    optBancos: { value: number, label: string }[],
    optTelefonia: { value: number, label: string }[],
    SMS: string,
    Listo?: boolean,
}

const DatosBancarios = [
    {
        datoTipoID: 1,
        datoBancario: ''
    },
    {
        datoTipoID: 2,
        datoBancario: ''
    },
    {
        datoTipoID: 3,
        datoBancario: ''
    }
]

export const CForm = (props: CFormType) => {

    // // const [datos, setDatos] = useState(DatosBancarios)

    const puedeAgregar = usePuedeAgregarDatoBancario(PERMISO.InputBancosPerfilSocia,props.personaID)
    const deshabilitar = !puedeAgregar

    const [loading, setLoading] = useState(false)

    const [codigoId, setCodigoId] = useState(0)

    const [disabledCode, setDisabledCode] = useState(false)

    const [disabledConfirm, setDisabledConfirm] = useState(true)

    const [disabledValidate, setDisabledValidate] = useState(true)

    const refTelefonia = useRef(null)

    const refCelular = useRef(null)

    const refClabe = useRef(null)

    const refCuenta = useRef(null)

    const refTarjeta = useRef(null)

    const refCodigo = useRef(null)

    const [CuentaAct, ActiCuent] = React.useState(false)


    const fnSendCode = () => {
        const celular: any = refCelular;
        const telefonia: any = refTelefonia;
        let cel = celular.current.value as number
        let tel = telefonia.current.props.value.value as number
        if (cel && tel) {
            setDisabledCode(true)
            Funciones.FNEnviarCodigo(props.oidc,
                {
                    PersonaID: props.personaID,
                    TelefonoMovil: celular.current.value,
                    src: 'CV'
                })
                .then((respuesta: any) => {
                    setDisabledConfirm(false)
                    setCodigoId(respuesta.Id)
                    toast.success("Se envió el código verificador.")
                })
                .catch((error: any) => {
                    console.log(JSON.stringify(error))
                    setDisabledCode(false)
                    toast.error("Ocurrió un error favor volver a intentarlo.")
                })
        }
        else {
            toast.error("Ingrese el telefono celular y la compañia")
        }
    }

    const GetDatosBancActivo = (value: any) => {
        Funciones.GetDatosBancActivo(props.oidc, { personaID: props.personaID })
            .then((respuesta: any) => {

                if (respuesta == 0) {

                }
                else if (respuesta != null) {
                    toast.error(`El cliente Nº${props.personaID} tiene un desembolso SPEI activo, no puede modificar sus datos bancarios hasta que se complete el desembolso`)
                    ActiCuent(true)
                    console.log("Respuesta", respuesta)
                }

            })
            .catch(() => {
                toast.error("Ha ocurrido un error al obtener el distribuidor")
            })
    }

    const fnConfirm = () => {
        const codigo: any = refCodigo
        if (codigo.current.value) {
            setDisabledConfirm(true)
            Funciones.FNVerificar(props.oidc,
                {
                    Id: codigoId,
                    Codigo: codigo.current.value
                })
                .then((respuesta: any) => {
                    if (respuesta.Codigo) {
                        setDisabledValidate(false)
                        toast.success("Código correcto favor de guardar")
                    }
                    else {
                        setDisabledConfirm(false)
                        toast.error("Código incorrecto o caduco favor de volver a intentarlo")
                    }
                })
                .catch((error: any) => {
                    // console.log(JSON.stringify(error))
                    setDisabledConfirm(false)
                    toast.error("Ocurrió un error vuelva a intentarlo.")
                })
        }
        else {
            toast.error("Ingrese el código")
        }
    }

    const fnReSend = () => {
        setCodigoId(0)
        setDisabledCode(false)
        setDisabledConfirm(true)
        setDisabledValidate(true)
    }

    const fnCancelar = () => {
        setCodigoId(0)
        setDisabledCode(false)
        setDisabledConfirm(true)
        setDisabledValidate(true)
        props.fnCancelar()
    }
  
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                TelefonoMovil: Yup.number().required("Campo requerido"),
                cveBancoRef: Yup.number().required("Seleccione el banco").moreThan(0, 'Seleccione el banco'),
                telefonia: Yup.number(),
                // clabe: Yup.number().required("Campo requerido"),
                // cuenta: Yup.number().required("Campo requerido"),
                // tarjeta: Yup.number().required("Campo requerido"),

                // DatosBancarios: Yup.array()
                // .min(3, '')
                // .of(
                //   Yup.object().shape({
                //     label: Yup.string().required(),
                //     value: Yup.string().required(),
                //   })
                // )
            })}
            onReset={(values: any) => {
                const telefonia: any = refTelefonia;
                telefonia.current?.select.setValue({ value: '0', label: '' }, "deselect-option")
            }}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)

                // Finish the callback
                if (props.personaID !== undefined) {
                    const clabe: any = refClabe;
                    const tarjeta: any = refTarjeta;
                    const cuenta: any = refCuenta;

                    // setDatos(datos.map(function (dato) {
                    //     if (dato.datoTipoID == 1)
                    //         dato.datoBancario = clabe.current.value as string;
                    //     if (dato.datoTipoID == 2)
                    //         dato.datoBancario = tarjeta.current.value as string;
                    //     if (dato.datoTipoID == 3)
                    //         dato.datoBancario = cuenta.current.value as string;
                    //     return dato;
                    // }))

                    let datos: any[] = [];
                    let clabeVal = clabe.current.value as string;
                    let tarjetaVal = tarjeta.current.value as string;
                    let cuentaVal = cuenta.current.value as string;

                    if (clabeVal.length > 0)
                        datos = [...datos, {
                            datoTipoID: 1,
                            datoBancario: clabeVal
                        }]
                    if (tarjetaVal.length > 0)
                        datos = [...datos, {
                            datoTipoID: 2,
                            datoBancario: tarjetaVal
                        }]
                    if (cuentaVal.length > 0)
                        datos = [...datos, {
                            datoTipoID: 3,
                            datoBancario: cuentaVal
                        }]

                    const telefonia: any = refTelefonia;
                    let tel = telefonia.current.props.value.label as string

                    if (datos.length > 0) {
                        Funciones.FNAdd(props.oidc, {
                            personaID: props.personaID,
                            cveBancoRef: values.cveBancoRef,
                            TelefonoMovil: values.TelefonoMovil,
                            DatosBancarios: datos
                        })
                            .then((respuesta: any) => {

                                setLoading(false)
                                props.cbGuardar(respuesta)
                                props.fnGetPdf({ personaID: respuesta.Persona.PersonaID, telefonia: tel, cveBancoRef: values.cveBancoRef })
                                toast.success("Se guardaron los datos bancarios")
                                props.Listo = true;
                            })
                            .catch((error: any) => {
                                console.log(JSON.stringify(error))
                                setLoading(false)
                                toast.error("Error al guardar los datos bancarios")
                            })
                    }
                    else {
                        setLoading(false)
                        toast.error("Debe proporcionar al menos un dato bancario.")
                    }
                }
                // else
                //     Funciones.FNUpdate(props.oidc, {
                //         ...values,
                //         ProductoID: props.ProductoID as number,
                //         SucursalId: props.SucursalId as number,
                //     })
                //         .then((respuesta: any) => {
                //             setLoading(false)
                //             props.cbActualizar(respuesta)
                //             toast.success ("Se actualizó la relación de la sucursal con la condición")
                //         })
                //         .catch((error: any) => {
                //             console.log(JSON.stringify(error))
                //             setLoading(false)
                //             toast.error("Error al actualizar la relación de la sucursal con la condición")
                //         })

            }}>
            <Form>
                
                {!puedeAgregar &&  (
                <div className="alert alert-warning" role="alert">
                    <p style={{ color: 'red', fontWeight: 'bold', fontSize: '8.5pt', margin: 0 }}>
                    Este cliente ya cuenta con una tarjeta bancaria registrada. Si necesita hacer algún cambio, por favor, contacte a Mesa de Ayuda.
                    </p>
                </div>
                )}
                <div className="flex-column columns is-desktop is-tablet">
                    {/* <div className="column is-half"> */}
                    <ActionFieldText
                        disabled={loading}
                        label="Telefono Celular"
                        name="TelefonoMovil"
                        placeholder=""
                        // onBlur={fnGetListaPlazos}
                        valor={props.initialValues.TelefonoMovil}
                        ref={refCelular}
                    />
                    {/* </div>
                    <div className="column is-half">
                        
                    </div> */}
                </div>
                <ActionSelect
                    disabled={loading || CuentaAct}
                    label="Compañia Celular"
                    name="telefonia"
                    placeholder="Seleccione la Compañia"
                    options={props.optTelefonia}
                    addDefault={true}
                    valor={props.initialValues.telefonia}
                    ref={refTelefonia}
                    accion2={GetDatosBancActivo}

                />
                <CustomSelect
                    disabled={loading || CuentaAct || deshabilitar}
                    label="Banco"
                    name="cveBancoRef"
                    placeholder="Seleccione el Banco"
                    options={props.optBancos}
                    addDefault={true}

                />
                <ActionFieldText
                    disabled={loading || CuentaAct || deshabilitar}
                    label="Clabe Interbancaria"
                    name="clabe"
                    placeholder=""
                    // onBlur={fnGetListaPlazos}
                    valor={props.initialValues.clabe}
                    ref={refClabe}
                />
                <ActionFieldText
                    disabled={loading || CuentaAct || deshabilitar}
                    label="Número de Cuenta"
                    name="cuenta"
                    placeholder=""
                    // onBlur={fnGetListaPlazos}
                    valor={props.initialValues.cuenta}
                    ref={refCuenta}
                />
                <ActionFieldText
                    disabled={loading || CuentaAct || deshabilitar}
                    label="Número de Tarjeta"
                    name="tarjeta"
                    placeholder=""
                    // onBlur={fnGetListaPlazos}
                    valor={props.initialValues.tarjeta}
                    ref={refTarjeta}
                />
                {props.SMS == 'S' &&
                    <>
                        <div className="columns is-desktop is-tablet">
                            <div className="column">
                                <br />
                                <button
                                    type="button"
                                    className="btn btn-primary waves-effect waves-light"
                                    disabled={disabledCode}
                                    onClick={fnSendCode}
                                >
                                    Enviar Código
                                </button>
                                {/* <br/> */}
                                <button
                                    title='Refrescar'
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={fnReSend}
                                >
                                    <FiRefreshCcw />
                                </button>
                            </div>
                            {/* <div className="column is-2">
                        
                    </div>    */}
                        </div>
                        <div className="columns is-desktop is-tablet">
                            <div className="column">
                                <ActionFieldText
                                    disabled={loading}
                                    label="Código"
                                    name="codigo"
                                    placeholder=""
                                    // onBlur={fnGetListaPlazos}
                                    ref={refCodigo}
                                />
                                {/* <br/> */}
                            </div>
                            <div className="column is-3">
                                <button type="button" className="btn btn-primary waves-effect waves-light" disabled={disabledConfirm}
                                    onClick={fnConfirm}>
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </>
                }
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="reset" className="btn btn-danger waves-effect waves-light" disabled={deshabilitar} onClick={fnCancelar} >
                            Limpiar
                        </button>
                        <button disabled={CuentaAct || deshabilitar}
                            type="submit"
                            className="ms-2 btn btn-success waves-effect waves-light"
                        >
                            Aceptar
                        </button>
                    </div>
                }
            </Form>
        </Formik>
    )
}
