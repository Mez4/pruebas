import React, { useRef } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, CustomSelect, Spinner, CustomFieldImgUpload } from '../../global'
import * as Funciones from './CompPerfilPersona/FuncionesAclaracion'
import { IOidc } from '../../../interfaces/oidc/IOidc'
import { Sucursales, Distribuidores, ProdPresPer, Coordinadores } from '../../selectores'
import { ActionAsyncSelect, ActionAsyncSelectDefault } from '../../global'
import { FaCheck, FaCircle, FaClone, FaEye, FaPencilAlt, FaPlus, FaPrint, FaSearch } from 'react-icons/fa'
import { setDefaultLocale } from 'react-datepicker'
import { CFormTelefonoMovil } from './CFormTelefonoMovil'
import { iUI } from '../../../interfaces/ui/iUI'
import { DescripcionDistribuidor } from '../../../global/variables'
import Select from 'react-select'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


import CreatableSelect from 'react-select/creatable';
type CFormType = {
    oidc: IOidc
    ui: iUI,
    Id?: number,
    solicitudGuardada: boolean,
    DistribuidoraID?: number,
    permitirEvidecia: boolean,
    initialValues: {
        AclaracionID: number,
        SucursalID: number,
        DistribuidorID: number,
        CreditoID: number,
        DescripcionAclaracion: string,
        ConceptoID: number,
        EstatusID: number,
        NotasTesoreria: string,
        TipoSolicitudID: number,
        Observaciones: string,
        DocumentoID: number,
        MesaAclaracionID: number,
        BonificacionID: number,
        CoordinadorID: number,
        SolicitaID: number,
        AutorizaID: number,
        ProductoID: number
    },
    fnDeshabilitarCargaDeEvidecia(): any,
    fnAclaracionNoGuardada(): any,
    fnHabilitarCargaDeEvidecia(): any,
    fnAclaracionGuardada(AclaracionID: number): any,
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    optMesaAclaracion: { value: number, label: string }[],
    optBonificacion: { value: number, label: string }[],
    optEstatus: { value: number, label: string }[],
    optTiposSolicitud: { value: number, label: string }[],
    optProductosPrincipales: { value: number, label: string, SucursalID: string }[],
    optSucursales: { value: number, label: string }[],
    fnGetClientes(Nombre: string, callback: any): any,
    fnMostrarCargaDeDocumento(): any,
    fnGetSucursales(Nombre: string, callback: any): any,
    fnGetDistribuidores(id: any): any,
    fnGetCondicionesDetalle(ProductoID: number, SucursalId: number, DistribuidorID: number): any,

}
const datosAclaraciones: any[] = []
export const CFormAclaracion = (props: CFormType) => {
    
    const MySwal = withReactContent(Swal)

    const loadOptionsClientes = (inputText: string, callback: any) => {
        props.fnGetClientes(inputText, callback);
    }
    const loadOptionsSucursales = (inputText: string, callback: any) => {
        props.fnGetSucursales(inputText, callback);
    }
    // Loading
    const [loading, setLoading] = React.useState(false)
    //evidenciaCargada
    const [evidenciaCargada, setEvidenciaCargada] = React.useState(false)
    const [sucursal, setSucursal] = React.useState("")
    const [distribuidor, setDistribuidor] = React.useState("")
    const [credito, setCredito] = React.useState("")
    const [encargado, setEncargado] = React.useState("") //gerente
    const [solicita, setSolicita] = React.useState("")
    const [autoriza, setAutoriza] = React.useState("")
    
    const refTipoDesembolso = useRef<Select>(null)
    const refSucursal = useRef<Select>(null)
    const refPlazos = useRef<CreatableSelect<{ value: string; label: string; }, false>>(null)
    const refCapital = useRef<CreatableSelect<{ value: string; label: string; }, false>>(null)
    const [formValues, setFormValues] = React.useState({
        optDistribuidores: [{ value: 0, label: '' }],
        // optPlazos: [{ value: '0', label: '' }],
        // optCuenta: [{ value: 0, label: '' }],
        // optTiposDesembolso: [{ value: 0, label: '' }],
        SucursalID: props.initialValues.SucursalID,
        // ClienteId: props.initialValues.ClienteId,
        // Plazos: props.initialValues.Plazos,
        // TipoDesembolsoID: props.initialValues.TipoDesembolsoID,
        // personasDatosBancariosID: 0
    })
    
    const clearFormByLevel = (level: number) => {
        if (level === 0) {
            refSucursal.current?.select.setValue({ value: '0', label: '' }, "deselect-option")
        }
        if (level === 0 || level === 1) {
            setFormValues(s => ({ ...s, optPlazos: [], optDistribuidores: [], optCuenta: [], optTiposDesembolso: [] }))
            refTipoDesembolso.current?.select.setValue({ value: '0', label: '' }, "deselect-option")
        }
        if (level === 0 || level === 1 || level === 2) {
            const capital: any = refCapital.current?.select
            capital.select.clearValue()
            const plazos: any = refPlazos.current?.select
            plazos.select.clearValue()

        }
    }
    const cbDistribuidor = (value: any) => {
        setFormValues(s => ({ ...s, DistribuidorID: value }))
        clearFormByLevel(2)
    }

    let isMounted = React.useRef(true)
    const Obs = useRef<HTMLTextAreaElement>(null);
    //fnCancelr sin evidencia
    const fnCancelarSinEvidencia = () => {
        if (props.solicitudGuardada) {
            MySwal.fire({
                title: '¿Está seguro de cancelar la solicitud?',
                text: "Se perderán los cambios realizados",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, cancelar',
                cancelButtonText: 'No, regresar'
            }).then((result) => {
                if (result.isConfirmed) {
                    props.fnCancelar()
                }
            })
        } else {
            props.fnCancelar()
        }
        props.fnCancelar()

    }
    

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={props.solicitudGuardada ? null : Yup.object().shape({
                TipoSolicitudID: Yup.number().required("Campo Obligatorio").moreThan(0, 'Seleccione una opción'),
                ProductoID: Yup.number().required("Campo Obligatorio").moreThan(0, "Seleccione el producto"),
                SucursalID: Yup.number().required("Campo Obligatorio").moreThan(0, "Seleccione la sucursal"),
                CoordinadorID: Yup.number().required("Campo Obligatorio").moreThan(0, "Seleccione el coordinador"),
                DescripcionAclaracion: Yup.string().required("Campo Obligatorio"),
            })
            }
            onSubmit={(values: any, { resetForm }) => {
                let data = {
                    ProductoID: values.ProductoID,
                    TipoSolicitudID: parseInt(values.TipoSolicitudID),
                    SucursalID: values.SucursalID,
                    CoordinadorID: parseInt(values.CoordinadorID),
                    DistribuidorID: props.DistribuidoraID,
                    DescripcionAclaracion: values.DescripcionAclaracion,
                }

                if (!props.solicitudGuardada && !props.permitirEvidecia) {
                    //////GUARDAR ACLARACION SIN EVIDENCIA//////////
                    MySwal.fire({
                        title: '<strong>Guardar aclaración</strong>',
                        icon: 'warning',
                        html:

                            <div className="text-center">
                                <br></br>
                                <p>La solicitud de aclaración no podra ser modificada.</p>
                            </div>,
                        showCloseButton: false,
                        showCancelButton: true,
                        showConfirmButton: true,
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Aceptar',
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#3085d6',
                        focusConfirm: false,
                        confirmButtonAriaLabel: 'Aceptar',
                        cancelButtonAriaLabel: ''
                    }).then((result) => {
                        if (result.isConfirmed) {
                            let timerInterval
                            MySwal.fire(
                                {
                                    icon: 'info',
                                    html: <div><br />
                                        <h3 className="text-center">Aviso</h3>
                                        <div className={`modal-body`}>
                                            <h5 className="text-center">Guardando solicitud.</h5>
                                        </div>
                                    </div>,
                                    timerProgressBar: false,
                                    confirmButtonText: `Ok`,
                                    //disable cancelable
                                    allowOutsideClick: false,
                                    didOpen: () => {
                                        MySwal.showLoading()
                                    },
                                    willClose: () => {
                                        clearInterval(timerInterval)
                                    }
                                }
                            );

                            Funciones.FNAltaAclaracion(props.oidc, data)
                                .then((respuesta: any) => {
                                    props.fnAclaracionGuardada(respuesta.AclaracionID);
                                    props.fnHabilitarCargaDeEvidecia();
                                    MySwal.fire({
                                        icon: 'success',
                                        html: <div><br />
                                            <h3 className="text-center">Éxito</h3>
                                            <div className={`modal-body`}>
                                                <h5 className="text-center">Solicitud guardada correctamente, a continuación adjunta las evdencias para continuar.</h5>
                                            </div>
                                        </div>,
                                        showCancelButton: false,
                                        showConfirmButton: true,
                                        allowOutsideClick: false,
                                        showCloseButton: false,
                                        confirmButtonText: 'Aceptar',
                                        confirmButtonColor: '#3085d6',
                                    })
                                    setLoading(false)

                                    resetForm()
                                })
                                .catch((error: any) => {
                                    MySwal.fire({
                                        icon: 'error',
                                        html: <div><br />
                                            <h3 className="text-center">Error al guardar la solicitud</h3>
                                            <div className={`modal-body`}>
                                                <h5 className="text-center">Ocurrió un problema al guardar la solicitud.</h5>
                                            </div>
                                        </div>,
                                        showCancelButton: false,
                                        showConfirmButton: true,
                                        confirmButtonText: 'Aceptar',
                                        confirmButtonColor: '#3085d6',
                                        allowOutsideClick: false,
                                        showCloseButton: true,
                                    })
                                    setLoading(false)
                                })
                        } else {
                            MySwal.fire(
                                {
                                    icon: 'info',
                                    html: <div><br />
                                        <h3 className="text-center">Aviso</h3>
                                        <div className={`modal-body`}>
                                            <h5 className="text-center">Operación cancelada por el usuario.</h5>
                                        </div>
                                    </div>,
                                    confirmButtonText: `Continuar`,
                                    confirmButtonColor: '#3085d6',
                                }
                            );
                        }
                    })
                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////7
                } else {
                    ////GUARDAR SOLO EVIDENCIA//////////////
                    console.log("SOLICITUD GUARDADA CLICK");

                    MySwal.fire({
                        title: '<strong>Guardar aclaración</strong>',
                        icon: 'question',
                        html:
                            <div className="text-center">
                                <br></br>
                                <p>¿Todas las evidencias han sido capturadas?. La solicitud de aclaración no podra ser modificada.</p>
                            </div>,
                        showCloseButton: false,
                        showCancelButton: true,
                        showConfirmButton: true,
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Aceptar',
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#3085d6',
                        focusConfirm: false,
                        confirmButtonAriaLabel: 'Aceptar',
                        cancelButtonAriaLabel: ''
                    }).then((result) => {
                        if (result.isConfirmed) {
                            props.fnCancelar();
                            props.fnAclaracionNoGuardada();
                            props.fnDeshabilitarCargaDeEvidecia();
                            resetForm()
                        } else {

                        }
                    }
                    )
                }
            }
            }       >
            {
                ({ values }) => (
                    <Form>
                        <div style={props.solicitudGuardada ? { pointerEvents: "none", opacity: "0.4" } : {}}>
                            <div className="columns is-centered is-mobile is-multiline">
                                <div className="column is-half-desktop is-full-mobile">
                                    <div className="mb-2" >
                                        <label className="form-label mb-0" htmlFor={"ProductoID"}>Producto</label>
                                        <Field name={"ProductoID"} className="form-select"  >
                                            {(control: any) => (
                                                <select
                                                    className="form-select"
                                                    //options={state.optCuentas}                                                                  
                                                    value={control.field.value}
                                                    onChange={(value: any) => {
                                                        //alert(parseInt(value.target.value))
                                                        control.form.setFieldValue("ProductoID", parseInt(value.target.value))
                                                        let obj = props.optProductosPrincipales.find((x: any) => x.value === parseInt(value.target.value))
                                                        console.log("obj", obj)
                                                        if (obj !== undefined) {
                                                            control.form.setFieldValue("SucursalID", obj.SucursalID)
                                                        }

                                                    }}
                                                    //disabled={(state.Datos.numero === 0 || state.Datos.numero === undefined) ? false : true}
                                                    id={"ProductoID"}
                                                    name={"ProductoID"}
                                                >
                                                    <option value="0">{"Selecciona un producto"}</option>
                                                    {props.optProductosPrincipales.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                                </select>
                                            )}
                                        </Field>
                                        <ErrorMessage component="div" name={"ProductoID"} className="text-danger" />
                                    </div>
                                </div>

                                <div className="column is-half-desktop is-full-mobile">
                                    <div className="mb-2" >
                                        <label className="form-label mb-0" htmlFor={"SucursalID"}>Sucursal</label>
                                        <Field disabled name={"SucursalID"} className="form-select"   >
                                            {(control: any) => (
                                                <select
                                                    disabled
                                                    className="form-select"
                                                    value={control.field.value}
                                                    onChange={(value: any) => {
                                                        control.form.setFieldValue("SucursalID", parseInt(value.target.value))
                                                    }}
                                                    id={"SucursalID"}
                                                    name={"SucursalID"}
                                                >
                                                    <option value="0">{"Selecciona una sucursal"}</option>
                                                    {props.optSucursales.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                                </select>
                                            )}
                                        </Field>
                                        <ErrorMessage component="div" name={"SucursalID"} className="text-danger" />
                                    </div>
                                </div>

                                <div className="column is-half-desktop is-half-mobile">
                                    <CustomSelect
                                        disabled={loading}
                                        label="Tipo de Solicitud"
                                        name="TipoSolicitudID"
                                        placeholder="Seleccione una opcion"
                                        options={props.optTiposSolicitud}
                                        addDefault={true}
                                        isMulti={false} />
                                </div>

                                <div className="column is-half-desktop is-full-mobile">
                                    {isMounted &&
                                        <Coordinadores
                                            disabled={loading}
                                            name={'CoordinadorID'}
                                            valor={values.CoordinadorID}
                                            SucursalID={isNaN(values.SucursalID) ? 0 : values.SucursalID}
                                        />
                                    }
                                </div>

                                <div className="column is-full-desktop is-full-mobile">
                                    <CustomFieldText
                                        disabled={loading}
                                        label="Descripcion Aclaración"
                                        name="DescripcionAclaracion"
                                        placeholder="Descripcion Aclaración" />
                                </div>

                            </div>

                        </div>
                        <hr></hr>
                        <div style={!props.permitirEvidecia ? { pointerEvents: "none", opacity: "0.4" } : {}}>
                            <div className="columns is-mobile">

                                <div className="column is-half-desktop is-full-mobile">
                                    <label className="form-label mb-0 pl-3" htmlFor={"Nota"}>Nota: Adjunta la evidencia necesaria para procesar la aclaración</label>
                                </div>

                                <div className="column is-half-desktop is-full-mobile">
                                    <button data-tip style={{ width: '100%', textAlign: 'center', justifyContent: "center", borderRadius: "4px" }} className="btn btn-primary pr-3" type={"button"}
                                        onClick={() => {
                                            props.fnMostrarCargaDeDocumento()
                                        }
                                        }>Subir evidencia</button>

                                </div>
                            </div>
                        </div>
                        <hr></hr>


                        {loading && <Spinner />}
                        {!loading &&
                            <div className="text-end">
                                <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                    Cancelar
                                </button>
                                <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Guardar</button>
                            </div>
                        }
                    </Form>
                )
            }
        </Formik >
    )
}