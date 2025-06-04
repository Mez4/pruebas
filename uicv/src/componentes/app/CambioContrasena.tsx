import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { IOidc } from '../../interfaces/oidc/IOidc'
import * as Funciones from '../../componentes/app/modulos/seguridad/Funciones'
import { CustomFieldText } from '../global'


type CFormType = {
    oidc: IOidc
    fnCerrar: any
}

export const CambioContrasena = (props: CFormType) => {
    let isMounted = React.useRef(true)
    const MySwal = withReactContent(Swal)

    const [loading, setLoading] = React.useState(false)
    const optComisionOrigen: any[] = []
    const optComisiones: any[] = []
    const optNiveles: any[] = []
    const optNivelesDestino: any[] = []
    const [mostrarContrasena, setMostrarContrasena] = React.useState(false)


    const [state, setState] = React.useState({

        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            SucursalId: undefined,
        },
        optComisionOrigen,
        optComisiones,
        optNiveles,
        optNivelesDestino,
        isUpdate: false,
        NivelesDestinoIds: []
    })


    React.useEffect(() => {
        if (isMounted.current === true) {

        }
        return () => {
            isMounted.current = false
        }
    }, [])

    return (
        <Formik
            initialValues={props}
            enableReinitialize
            validationSchema={Yup.object().shape({
                Contrasena: Yup.string()
                    .required('Campo Requerido')
                    .min(4, 'Minimo 4 caracteres')
                    .max(20, 'Maximo 20 caracteres')
            })}
            onSubmit={(values: any) => {
                MySwal.fire({
                    title: '<strong>Restablecer Contraseña del Usuario</strong>',
                    icon: 'warning',
                    html:
                        <div className="text-center">
                            <br />
                            <span className='text-center'>¿Restablecer contraseña para el usuario {<strong>{props.oidc.user.profile.Persona[0].Nombre} {props.oidc.user.profile.Persona[0].ApellidoPaterno}</strong>}?</span>
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
                })
                    .then((result) => {
                        if (result.isConfirmed) {
                            let a = {
                                UsuarioID: props.oidc.user.profile.UsuarioID,
                                Contrasena: values.Contrasena
                            }
                            Funciones.FNUpdate(props.oidc, a)
                                .then((respuesta: any) => {
                                    if (isMounted.current === true) {
                                        setState(s => ({ ...s, ContrasenaNueva: respuesta.Contrasena }))
                                        props.fnCerrar();
                                        toast.success(`Contraseña restablecida correctamente.`)
                                        toast.info(`Su nueva contraseña es: ${respuesta.Contrasena}`)
                                        setMostrarContrasena(true)
                                    }

                                },
                                )
                                .catch(() => {
                                    toast.error("Ocurrió un problema al restablecer contraseña, inténtelo de nuevo.")
                                })
                        } else {
                            MySwal.fire(
                                {
                                    icon: 'info',
                                    html: <div><br />
                                        <h3 className="text-center"><strong>Aviso</strong></h3>
                                        <div className={`modal-body`}>
                                            <h5 className="text-center">Operación cancelada por el usuario.</h5>
                                        </div>
                                    </div>,
                                    confirmButtonText: `Ok`,
                                    confirmButtonAriaLabel: `Ok`,
                                    confirmButtonColor: `#3085d6`,
                                }
                            );
                        }
                    })


            }}>
            <Form>
                <div style={{ textAlign: 'center' }}>
                    Usuario:   {props.oidc.user.profile.Persona[0].Nombre} {props.oidc.user.profile.Persona[0].ApellidoPaterno}
                </div>
                <div style={{ textAlign: 'center' }}>

                    <CustomFieldText disabled={false} label="Contraseña Nueva:" name="Contrasena" placeholder="Agregar Contraseña nueva" />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                        Aceptar
                    </button>
                </div>
            </Form>
        </Formik>)
}