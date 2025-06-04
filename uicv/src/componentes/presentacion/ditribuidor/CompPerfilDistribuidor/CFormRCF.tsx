import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { string } from 'yup/lib/locale'
import yup from '../../../../global/yupLocale'
import { CustomSelect } from '../../../global'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'

type CFormType = {
    oidc: IOidc
    fnCancelar(): any
    selectedRows: any[]
    optPlazos: { value: number, label: string }[],
    DistribuidorID: number
}

export const CFormRCF = (props: CFormType) => {
    const MySwal = withReactContent(Swal)
    let isMounted = React.useRef(true)

    // Loading
    const [loading, setLoading] = React.useState(false)

    const handleClick = async (values: any) => {
        console.log('plazooooos', values)
        let total = 0;
        setLoading(false)
        props.selectedRows.forEach(element => {
            total = total + 1
        });
        MySwal.fire({
            title: '<strong>Solicitudes de Reestructuras de Créditos</strong>',
            icon: 'info',
            html:
                <div className="text-center">
                    <br />
                    Se solicitaran un total de <strong>{total}</strong> reestructuras de créditos, ¿desea continuar?.
                </div>,
            showCloseButton: false,
            showCancelButton: true,
            showConfirmButton: true,
            focusCancel: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar',
            confirmButtonAriaLabel: 'Aceptar',
            cancelButtonAriaLabel: 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        }).then((result) => {
            if (result.isConfirmed) {
                MySwal.fire({
                    title: '<strong>Solicitud de Reestructuras de Créditos</strong>',
                    icon: 'warning',
                    html:
                        <div className="text-center">
                            <br />
                            Total de {total} crédito/s seleccionado/s para solicitar, ¿confirmar?.
                            <br /> <br /><h5><strong style={{ color: 'red' }}>Nota: Esta acción no se puede cancelar ni revertir. LOS DOCUMENTOS DE LA SOLICITUD DEBERÁN SUBIRSE EN EL APARTADO DE ABAJO "SOLICITUDES DE CONVENIOS Y REESTRUCTURAS"</strong></h5>
                        </div>,
                    showCloseButton: false,
                    showCancelButton: true,
                    showConfirmButton: true,
                    focusCancel: true,
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Aceptar',
                    confirmButtonAriaLabel: 'Aceptar',
                    cancelButtonAriaLabel: 'Cancelar',
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                }).then((result) => {
                    if (result.isConfirmed) {
                        MySwal.fire(
                            {
                                icon: 'info',
                                html: <div><br />
                                    <h3 className="text-center">Aviso</h3>
                                    <div className={`modal-body`}>
                                        <h5 className="text-center">Enviando Solicitud...</h5>
                                    </div>
                                </div>,
                                timerProgressBar: true,
                                allowEscapeKey: false,
                                allowOutsideClick: false,
                                showConfirmButton: false,
                                showCancelButton: false,
                                showCloseButton: false,
                                didOpen: () => {
                                    MySwal.showLoading()
                                },

                            }
                        );
                        let a = {
                            CreditosIDs: props.selectedRows,
                            PlazoID: values.PlazoID,
                            accion: 4,
                            DistribuidorID: props.DistribuidorID
                        }
                        console.log("A", a)
                        Funciones.AddSolicitudSCRS(props.oidc, a)
                            .then((respuesta: any) => {
                                if (respuesta.SolicitudRCID != null) {

                                    setLoading(false);
                                    props.fnCancelar();
                                    // setState({ ...state, Datos: state.Datos, DatosMostrar: state.Datos })
                                    MySwal.close();
                                    MySwal.fire({
                                        icon: 'success',
                                        title: '<strong>Envío de Solicitud</strong>',
                                        html:
                                            <div className="text-center">
                                                <br />
                                                <h5>Se envio correctamente</h5>
                                            </div>,
                                        showCloseButton: false,
                                        showCancelButton: false,
                                        showConfirmButton: true,
                                        focusCancel: true,
                                        confirmButtonText: 'Aceptar',
                                        confirmButtonAriaLabel: 'Aceptar',
                                        confirmButtonColor: '#3085d6',
                                    })
                                    console.log("mensajes", respuesta)
                                    toast.success(respuesta)
                                    // FNGetLocal()
                                }
                                else {
                                    console.log("mensajes", respuesta)

                                    // setLoading(false)
                                    // toast.success(respuesta)
                                    // FNGetLocal();
                                }
                            })
                            .catch(() => {
                                if (isMounted.current === true) {
                                    toast.error("Error al realizar la operación")
                                    MySwal.close();
                                }
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
                                cancelButtonText: 'Cancelar',
                                confirmButtonText: 'Aceptar',
                                confirmButtonColor: '#3085d6',
                                confirmButtonAriaLabel: 'Aceptar',
                                cancelButtonAriaLabel: ''
                            }
                        );
                    }
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
                        cancelButtonText: 'Cancelar',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#3085d6',
                        confirmButtonAriaLabel: 'Aceptar',
                        cancelButtonAriaLabel: ''
                    }
                );
            }
        })

    }

    // Return the component
    return (
        <Formik
            initialValues={{ PlazoID: 0 }}
            enableReinitialize
            validationSchema={yup.object().shape({
                PlazoID: yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione una opción'),
            })}
            onSubmit={(values: any) => {
                console.log('entro')
                setLoading(true)
                handleClick(values)
            }}>
            <Form>
                <div className="row">
                    <div className="text-center">
                        <CustomSelect
                            disabled={false}
                            label="Plazos"
                            name="PlazoID"
                            placeholder="Selecciona el plazo"
                            options={props.optPlazos}
                            addDefault={false}
                            isMulti

                        />
                    </div>
                </div>
                {loading && <Spinner />}
                {!loading &&
                    <div >
                        <div className="text-end">
                            <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                Cancelar
                            </button>
                            <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                Continuar
                            </button>

                        </div>
                    </div>
                }
            </Form>
        </Formik>
    )
}