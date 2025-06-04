import React, { useEffect, useRef, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, CustomSelect, Spinner, CustomFieldImgUpload, ActionSelect } from '../../global'
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
import { toast } from 'react-toastify';
import CreatableSelect from 'react-select/creatable';
import { placeholderCSS } from 'react-select/src/components/Placeholder'
import { ObtenerContratoPorId } from '../contratos/CompListadoContratos/Funciones';
import StateManager from 'react-select'
import { fetchExcepcionHuella, fetchHuellaDist } from '../../app/modulos/personas/CompAdministracion/Funciones'

type CFormType = {
    TipoDesembolso: any
    oidc: IOidc
    ui: iUI,
    Id?: number,
    Listo?: boolean,
    solicitudPrestamoGuardada: boolean,
    DistribuidoraID: number,
    EmpresaID: any,
    permitirEvideciaPrestamo: boolean,
    SucursalID: any,
    curp: string,
    lectorHuella: boolean,
    initialValues: {
        SolicitudPrestamoPersonalID: number,
        ProductoID: number,
        SucursalID: number,
        DistribuidorID: number,
        ContratoID: number,
        PrestamoSolicitado: number,
        EstatusID: number,
        UsuarioSolicitoID: number,
        Observaciones: string,
        PlazoSolicitado: number,
        TipoDesembolso: number

    },

    fnToggleListo(): any,
    fnDeshabilitarCargaDeEvideciaPrestamo(): any,
    fnPrestamoNoGuardada(): any,
    fnHabilitarCargaDeEvideciaPrestamo(): any,
    fnHabilitarCargaDeDatosBancarios(): any,
    fnPrestamoGuardada(SolicitudPrestamoPersonalID: number): any,
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    optProductosPrincipales: { value: number, label: string }[],
    fnMostrarCargaDeDocumentoPrestamo(): any,
    fnGetDistribuidores(id: any): any,
    fnGetCondicionesDetalle(ProductoID: number, SucursalId: number, DistribuidorID: number): any,

}

//---------------------------
function extractNumbers(str: string): number[] {
    const matches = str.match(/\d+/g);

    // Convert the matched strings to numbers and return the array
    return matches ? matches.map(num => parseInt(num, 10)) : [];
}

export const CFormSolicitudPrestamosPersonales = (props: CFormType) => {
    const MySwal = withReactContent(Swal)


    const [loading, setLoading] = React.useState(false)

    const refSucursal = useRef<Select>(null)
    const [LineaCredito, setLineaCredito] = React.useState(0)
    const [formValues, setFormValues] = React.useState({
        optDistribuidores: props.initialValues.DistribuidorID,
        ContratoID: props.initialValues.ContratoID,
        LineaCredito: 0
    })

    //Obtenemos el contrato por Distribuidor
    const fnGetContrato = () => {
        Funciones.FNGetContrato(props.oidc, props.DistribuidoraID).then((res: any) => {
            console.log("LineaCredito: ", res.LineaCredito)
            setLineaCredito(res.LineaCredito)
        }).catch((error: any) => {
            console.log("Error", error)
        })
    }

    useEffect(() => {
        fnGetContrato();
    }, []);
    let permitirSubirHuella = props.lectorHuella
    useEffect(() => {
        //console.log("DIstID", props.DistribuidoraID)
        console.log("DIstID", props.DistribuidoraID)
        console.log("Sucur", props.lectorHuella)
        if (props.lectorHuella) {
            fetchExcepcionHuella(props.oidc, props.DistribuidoraID)
                .then((respuesta2: any) => {
                    console.log("Check reg", respuesta2);
                    permitirSubirHuella = !respuesta2
                });
        }

        fetchHuellaDist(props.oidc, props.DistribuidoraID)
            .then((respuesta: any) => {
                console.log("Check reg", respuesta);
                if (respuesta) {
                    Instrucciones.current.innerHTML = "Verifique la identidad de la socia escaneando el dedo índice derecho";
                    btnHuella.current.innerHTML = "Verificar huella";
                } else {
                    Instrucciones.current.innerHTML = "Registre la huella de la socia escaneando el índice derecho 3 veces.";
                    btnHuella.current.innerHTML = "Registrar huella";
                }
            });
    }, [props.oidc, props.initialValues.DistribuidorID, props.lectorHuella]);



    // useEffect(() => {

    // }, [props.oidc, props.initialValues.DistribuidorID]);


    const btnSubmit = useRef<any>();
    const btnHuella = useRef<any>();
    const Instrucciones = useRef<any>();
    // WEB SOCKET HUELLAS

    let retries = 0;
    const maxRetries = 10; // Max number of retries
    let recieved: boolean;
    let huellaConfirmada = false;


    function connectWebSocket() {
        const socketUrl = "ws://localhost:8080";
        let socket = new WebSocket(socketUrl);
        // Connection opened
        socket.addEventListener("open", event => {
            console.log("Connection established");
            socket.send("Connection established");
            retries = 0;
        });

        // Handle WebSocket close event (if the connection is lost)
        socket.addEventListener("close", event => {
            console.log("WebSocket closed");
            if ((retries < maxRetries) && !recieved) {
                retries++;
                console.log(`Retrying... (${retries}/${maxRetries})`);
                setInterval(connectWebSocket, 1000);
            } else {
                if (!recieved) {
                    toast.error("NO TIENE INSTALADO EN PROGRAMA DEL SENSOR DE HUELLAS")
                }
                console.log("Max retries reached. Could not establish connection.");
            }
        });

        // Handle WebSocket error event
        socket.addEventListener("error", error => {
            //console.error("WebSocket error", error);
            //toast.error("No tiene instalado el programa")
        });
        // Listen for messages
        socket.addEventListener("message", event => {
            //console.log("Message from app", JSON.parse(event.data))
            //setLoading(false) 
            let parsedData;
            try {
                parsedData = JSON.parse(event.data);
                console.log(parsedData)
            } catch (e) {
                console.error("Error parsing message data", e);
                return;
            }
            if (parsedData != null && parsedData != "") {
                recieved = true
            }
            console.log(parsedData)
            if (parsedData?.data?.codeData != null && parsedData.data.codeData == -1) {
                toast.info("HUELLAS NO COINCIDEN; REINTENTA");
            }
            else if (parsedData["Image64"] != "error") {
                toast.info(parsedData.msj != "USUARIO YA EXISTENTE" ? parsedData.msj : "HUELLA VERIFICADA CORRECTAMENTE")
                btnSubmit.current.removeAttribute("disabled")
                btnHuella.current.setAttribute("disabled", "true")
                btnHuella.current.innerHTML = "Huella verificada"
                huellaConfirmada = true
                console.info(parsedData.msj)
            } else {
                toast.error("EL PROGRAMA FUE CERRADO SIN REGISTRAR LA HUELLA, INTENTE NUEVAMENTE")
            }

        });
    }

    const requestFingerprint = (e, Curp, producto, usuarioid) => {

        e.preventDefault()
        console.log("Opening reader")
        console.log(usuarioid)
        const link = document.createElement('a');

        link.href = `cv://registrarhuella?productoid=${producto}&curp=${Curp}&usuarioid=${usuarioid}`;

        link.click();

        connectWebSocket();
    }

    //setAllowHuellas(props.lectorHuella)
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={props.solicitudPrestamoGuardada ? null : Yup.object().shape({
                PrestamoSolicitado: Yup.string().required("Campo obligatorio")
                    .matches(/^[0-9]+$/, 'Ingrese sólo números.')
                    .test('Monto', 'El monto no puede ser mayor a la línea de crédito disponible.', function (value: any) {
                        return value <= LineaCredito
                    }),
                PlazoSolicitado: Yup.number().required("Campo obligatorio").moreThan(0, "Selecciona un plazo"),
                TipoDesembolso: Yup.number().required("Campo obligatorio").moreThan(0, "TipoDesembolso"),
                Observaciones: Yup.string().required("Campo obligatorio"),
            })
            }
            onSubmit={(values: any, { resetForm }) => {
                let data = {
                    PrestamoSolicitado: values.PrestamoSolicitado,
                    Observaciones: values.Observaciones,
                    PlazoSolicitado: values.PlazoSolicitado,
                    DistribuidorID: props.DistribuidoraID,
                    EmpresaID: props.EmpresaID,
                    TipoDesembolso: values.TipoDesembolso
                }
                console.log("LISTOOO", props.Listo)
                console.log("VALUEEES", values)
                if (values.PrestamoSolicitado > 8000 && values.TipoDesembolso == 1) {
                    MySwal.fire({
                        icon: 'error',
                        html: <div><br />
                            <h3 className="text-center">NO APTO</h3>
                            <div className={`modal-body`}>
                                <h5 className="text-center">LA SOLICITUD SUPERA LOS $8000 Y NO PUEDE CANJEARSE EN EFECTIVO.</h5>
                                <h5 className="text-center"> CAMBIE EL TIPO DE DESEMBOLSO A SPEI E INGRESE SUS DATOS BANCARIOS.</h5>
                            </div>
                        </div>,
                        showCancelButton: false,
                        showConfirmButton: true,
                        allowOutsideClick: false,
                        showCloseButton: true,
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#3085d6',
                    })
                    setLoading(false)
                    resetForm()
                }
                else {
                    if (values.TipoDesembolso == 2 && props.Listo == false) {
                        props.fnHabilitarCargaDeDatosBancarios();
                        console.log("SI LLEGO");
                        // setListo(1)
                    }

                    else {
                        if (!props.solicitudPrestamoGuardada && !props.permitirEvideciaPrestamo && (values.TipoDesembolso == 2 ? props.Listo == true : true)) {
                            // Guardar Solicitud de Préstamo personal sin evidencia
                            MySwal.fire({
                                title: '<strong>Guardar solicitud de préstamo</strong>',
                                icon: 'warning',
                                html:
                                    <div className="text-center">
                                        <br></br>
                                        <h5>La solicitud de préstamo no podrá ser modificada.</h5>
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
                                if (result.isConfirmed && (huellaConfirmada || !permitirSubirHuella)) {
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
                                    Funciones.FNAltaPrestamo(props.oidc, data)
                                        .then((respuesta: any) => {
                                            console.log("Respuesta", respuesta.status)

                                            if (respuesta.status == 401) {
                                                console.log(respuesta)

                                                props.fnPrestamoGuardada(respuesta.SolicitudID);
                                                props.fnHabilitarCargaDeEvideciaPrestamo();

                                                MySwal.fire({
                                                    icon: respuesta.status == 401 ? 'warning' : 'error',
                                                    html: <div><br />
                                                        <h3 className="text-center">{respuesta.status == 401 ? 'Su solicitud será mandada a revisión' : 'Error al guardar la solicitud'}</h3>
                                                        <div className={`modal-body`}>
                                                            <h5 className="text-center">{respuesta.data ?? 'Ocurrió un problema al guardar la solicitud.'}</h5>
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
                                            } else {
                                                console.log("Respuesta", respuesta)
                                                props.fnPrestamoGuardada(respuesta.SolicitudPrestamoPersonalID);
                                                props.fnHabilitarCargaDeEvideciaPrestamo();
                                                MySwal.fire({
                                                    icon: 'success',
                                                    html: <div><br />
                                                        <h3 className="text-center">Éxito</h3>
                                                        <div className={`modal-body`}>
                                                            <h5 className="text-center">Solicitud guardada correctamente.</h5>
                                                            <h5 className="text-center"> A continuación adjunta las evidencias para continuar.</h5>
                                                        </div>
                                                    </div>,
                                                    showCancelButton: false,
                                                    showConfirmButton: true,
                                                    allowOutsideClick: false,
                                                    showCloseButton: true,
                                                    confirmButtonText: 'Aceptar',
                                                    confirmButtonColor: '#3085d6',
                                                })
                                                setLoading(false)
                                                resetForm()
                                            }
                                        })
                                        .catch((error: any) => {
                                            console.log(error.response)

                                            MySwal.fire({
                                                icon: 'error',
                                                html: <div><br />
                                                    <h3 className="text-center">{'Error al guardar la solicitud'}</h3>
                                                    <div className={`modal-body`}>
                                                        <h5 className="text-center">{error.response.data ?? 'Ocurrió un problema al guardar la solicitud.'}</h5>
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
                                    console.log(data)
                                } else {
                                    if (result.isDismissed) {
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
                                    else {
                                        MySwal.fire(
                                            {
                                                icon: 'error',
                                                html: <div><br />
                                                    <h3 className="text-center">Aviso</h3>
                                                    <div className={`modal-body`}>
                                                        <h5 className="text-center">No se ha capturado la huella.</h5>
                                                    </div>
                                                </div>,
                                                confirmButtonText: `Continuar`,
                                                confirmButtonColor: '#3085d6',
                                            }
                                        );
                                    }

                                }
                            })
                        } else {
                            ////GUARDAR SOLO EVIDENCIA//////////////
                            console.log("Solicitud Préstamo Personal Guardada CLICK");

                            MySwal.fire({
                                title: '<strong>Guardar Préstamo</strong>',
                                icon: 'question',
                                html:
                                    <div className="text-center">
                                        <br></br>
                                        {/* <p>¿Todas las evidencias han sido capturadas?. La solicitud de préstamo no podra ser modificada.</p> */}
                                        <h5>¿Todas las evidencias han sido capturadas?</h5>
                                        <h5>La solicitud no podrá ser modificada.</h5>
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
                                console.log("Mensaje", result)
                                if (result.isConfirmed) {
                                    props.fnCancelar();
                                    props.fnPrestamoNoGuardada();
                                    props.fnDeshabilitarCargaDeEvideciaPrestamo();
                                    resetForm()
                                }
                            }
                            )
                        }
                    }
                }
            }
            }>
            {
                ({ values }) => (
                    <Form>
                        <div style={props.solicitudPrestamoGuardada ? { pointerEvents: "none", opacity: "0.4" } : {}}>
                            <div className="columns is-centered is-mobile is-multiline">
                                <div className="column is-full-desktop is-full-mobile">
                                    <CustomFieldText
                                        disabled={loading}
                                        label="Préstamo Solicitado"
                                        name="PrestamoSolicitado"
                                        placeholder="Préstamo a Solicitar"
                                    />
                                </div>

                                {/* Plazo Solicitado a quincenas  */}
                                <div className='column is-full-desktop is-full-mobile'>
                                    <div className='mb-2'>
                                        <label className='form-label mb-2' htmlFor="PlazoSolicitado"> Plazo Solicitado</label>
                                        <Field disabled name={"PlazoSolicitado"} className="form-select">
                                            {(control: any) => (
                                                <select
                                                    className="form-select"
                                                    onChange={(value: any) => {
                                                        control.form.setFieldValue("PlazoSolicitado", (value.target.value))
                                                    }}
                                                    id={"PlazoSolicitado"}
                                                    name={"PlazoSolicitado"}>
                                                    <option value="0">{"Selecciona un plazo"}</option>
                                                    {Array.from({ length: 8 }, (_, index) => (
                                                        <option key={index} value={(index + 1) * 2}>
                                                            {(index + 1) * 2} quincenas
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </Field>
                                        <ErrorMessage component="div" name={"PlazoSolicitado"} className="text-danger" />
                                    </div>
                                </div>
                                {/* Plazo Solicitado a quincenas  */}
                                <div className='column is-full-desktop is-full-mobile'>
                                    <div className='mb-2'>
                                        <label className='form-label mb-2' htmlFor="TipoDesembolso"> Tipo Desembolso</label>
                                        <Field disabled name={"TipoDesembolso"} className="form-select">
                                            {(control: any) => (
                                                <select
                                                    className="form-select"
                                                    onChange={(value: any) => {
                                                        control.form.setFieldValue("TipoDesembolso", (value.target.value))
                                                    }}
                                                    id={"TipoDesembolso"}
                                                    name={"TipoDesembolso"}>
                                                    <option value="0">{"Selecciona un tipo de desembolso"}</option>
                                                    <option value="1">{"Efectivo"}</option>
                                                    <option value="2">{"SPEI"}</option>
                                                </select>
                                            )}
                                        </Field>
                                        <ErrorMessage component="div" name={"PlazoSolicitado"} className="text-danger" />
                                    </div>
                                </div>


                                <div className="column is-full-desktop is-full-mobile">
                                    <CustomFieldText
                                        disabled={loading}
                                        label="Motivo de Solicitud"
                                        name="Observaciones"
                                        placeholder="Ingrese Motivo de Solicitud" />
                                </div>

                            </div >
                        </div>
                        <hr hidden={!permitirSubirHuella}></hr>
                        <div style={!permitirSubirHuella ? { pointerEvents: "none", opacity: "0.4" } : {}} hidden={!permitirSubirHuella}>

                            <div className="row">
                                <div className="column is-half-desktop is-half-mobile">
                                    <label className="form-label mb-0 pl-3" htmlFor={"Nota"} ref={Instrucciones}>
                                        Verifique la identidad de la socia escaneando el índice derecho.</label>
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 my-2">
                                    <button ref={btnHuella} data-tip style={{ width: '100%', textAlign: 'center', justifyContent: "center", borderRadius: "4px" }} className="btn btn-primary pr-3" type={"button"}
                                        onClick={(e) => {
                                            let userID = props.oidc.user.profile.UsuarioID
                                            requestFingerprint(e, props.curp, props.ui.Producto?.ProductoID, userID)
                                            console.log("curp", userID)
                                        }
                                        }>Verificar huella</button>
                                </div>
                            </div>
                        </div>
                        <hr></hr>
                        <div style={!props.permitirEvideciaPrestamo ? { pointerEvents: "none", opacity: "0.4" } : {}}>
                            <div className="row">
                                <div className="column is-half-desktop is-half-mobile">
                                    <label className="form-label mb-0 pl-3" htmlFor={"Nota"}>Nota: Adjunta la evidencia necesaria para procesar el préstamo.</label>
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 my-2">
                                    <button data-tip style={{ width: '100%', textAlign: 'center', justifyContent: "center", borderRadius: "4px" }} className="btn btn-primary pr-3" type={"button"}
                                        onClick={() => {
                                            props.fnMostrarCargaDeDocumentoPrestamo()

                                        }
                                        }>Subir Evidencia</button>
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

                                <button type="submit" className="ms-2 btn btn-success waves-effect waves-light" ref={btnSubmit} disabled={props.lectorHuella}>Aceptar</button>
                            </div>
                        }
                    </Form>
                )
            }
        </Formik>
    )
}
