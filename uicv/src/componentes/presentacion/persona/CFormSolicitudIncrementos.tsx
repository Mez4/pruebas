import React, { useRef } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, CustomSelect, Spinner, CustomFieldImgUpload } from '../../global'
import * as Funciones from './CompPerfilPersona/Funciones'
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
    initialValues: {
        SolicitudID: number,
        ProductoID: number,
        SucursalID: number,
        DistribuidorID: number,
        ContratoID: number,
        IncrementoSolicitado: number,
        EstatusID: number,
        UsuarioSolicitoID: number,
        Observaciones: string,
    },
    fnIncrementoNoGuardada(): any,
    fnIncrementoGuardada(SolicitudID: number): any,
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    //optMesaAclaracion: { value: number, label: string }[],
    //optBonificacion: { value: number, label: string }[],
    //optEstatus: { value: number, label: string }[],
    optProductosPrincipales: { value: number, label: string }[],
    //fnGetClientes(Nombre: string, callback: any): any,
    fnGetDistribuidores(id: any): any,
    fnGetCondicionesDetalle(ProductoID: number, SucursalId: number, DistribuidorID: number): any,

}
export const CFormSolicitudIncrementos = (props: CFormType) => {
    const MySwal = withReactContent(Swal)

    // Loading
    const [loading, setLoading] = React.useState(false)

    const refSucursal = useRef<Select>(null)
    const [formValues, setFormValues] = React.useState({
        optDistribuidores: props.initialValues.DistribuidorID,

        ContratoID: props.initialValues.ContratoID,
    })

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={props.solicitudGuardada ? null : Yup.object().shape({
                ProductoID: Yup.number().required("Campo Obligatorio").moreThan(0, "Seleccione el producto"),
                IncrementoSolicitado: Yup.number().required("Campo obligatorio").min(1, "Mínimo 1 carácter").max(10000, "Monto Máximo $10,000"),
                Observaciones: Yup.string(),
            })
            }
            onSubmit={(values: any, { resetForm }) => {
                let data = {
                    ProductoID: values.ProductoID,
                    IncrementoSolicitado: values.IncrementoSolicitado,
                    Observaciones: values.Observaciones,
                    DistribuidorID: props.DistribuidoraID,
                }

                if (!props.solicitudGuardada) {
                    props.fnCancelar()

                    //////GUARDAR ACLARACION SIN EVIDENCIA//////////
                    MySwal.fire({
                        title: '<strong>Guardar solicitud</strong>',
                        icon: 'warning',
                        html:

                            <div className="text-center">
                                <br></br>
                                <p>La solicitud de incremento no podrá ser modificada.</p>
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

                            Funciones.FNAltaIncremento(props.oidc, data)
                                .then((respuesta: any) => {
                                    props.fnIncrementoGuardada(respuesta.SolicitudID);
                                    MySwal.fire({
                                        icon: 'success',
                                        html: <div><br />
                                            <h3 className="text-center">Éxito</h3>
                                        </div>,
                                        showCancelButton: false,
                                        showConfirmButton: true,
                                        allowOutsideClick: false,
                                        showCloseButton: false,
                                        confirmButtonText: 'Aceptar',
                                        confirmButtonColor: '#3085d6',

                                    })

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
                } else {
                    console.log("SOLICITUD GUARDADA CLICK");


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
                                                    value={control.field.value}
                                                    onChange={(value: any) => {
                                                        control.form.setFieldValue("ProductoID", parseInt(value.target.value))
                                                        let obj = props.optProductosPrincipales.find((x: any) => x.value === parseInt(value.target.value))
                                                        console.log("obj", obj)

                                                    }}
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

                                <div className="column is-full-desktop is-full-mobile">
                                    <CustomFieldText
                                        disabled={loading}
                                        label="Incremento Solicitado"
                                        name="IncrementoSolicitado"
                                        placeholder="Incremento a Solicitar" />
                                </div>
                                <div className="column is-full-desktop is-full-mobile">
                                    <CustomFieldText
                                        disabled={loading}
                                        label="Motivo de Solicitud"
                                        name="Observaciones"
                                        placeholder="Ingrese Observaciones" />
                                </div>

                            </div>

                        </div>


                        {loading && <Spinner />}
                        {!loading &&
                            <div className="text-end">
                                <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                    Cancelar
                                </button>
                                <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Aceptar</button>
                            </div>
                        }
                    </Form>
                )
            }
        </Formik >
    )
}