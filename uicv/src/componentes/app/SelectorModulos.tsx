import React from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { IOidc } from '../../interfaces/oidc/IOidc'
import { IEstado } from '../../interfaces/redux/IEstado'
import { iUI } from '../../interfaces/ui/iUI'

import { Col, Container, Row } from 'react-grid-system'
import { IProducto } from '../../interfaces/seguridad/IProducto'
import { IPermiso } from '../../interfaces/seguridad/IPermiso'
import { IModulo } from '../../interfaces/seguridad/IModulo'

import { DefinirModulo } from '../../redux/ui/acciones'
import { IPersona } from '../../interfaces/oidc/IPersona'
import ModalWin from '../global/ModalWin'
import { type } from 'os'
import * as Funciones from '../../componentes/app/modulos/seguridad/Funciones'
import { CustomFieldText } from '../global'
import { Console } from 'console'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FaCopy, FaKey } from 'react-icons/fa'
import { FormaRestContra } from './modulos/seguridad/CompSeguridad/CompAdministracionUsuarios/FormaRestContra'
import { FormaContra } from './modulos/seguridad/CompSeguridad/CompAdministracionUsuarios/FormaContra'
import { useState } from 'react'
import { Form } from 'usetheform'
import { Formik, FormikHelpers, FormikValues } from 'formik'
import * as Yup from 'yup'
import { CambioContrasena } from './CambioContrasena'
var IPRecibida = ''

type TSelectorModulos = {
    oidc: IOidc,
    ui: iUI,
    FBDefinirModulo: (Permisos: IPermiso[], Producto?: IProducto, Modulo?: IModulo, Persona?: IPersona) => void,

}

type IProductoModulo = {
    EmpresaId: number,
    EmpresaNombre: string,
    ProductoID: number,
    ProductoNombre: string,
    ModuloID: number,
    ModuloNombre: string,
    ModuloIcono: string,
    ModuloColorBorde: string,
    ModuloColorFondo: string,
    ModuloColorFuente: string,
    ModuloRuta: string
}



/**
 * Genera una arreglo de los modulos para mostrar en la lista de selecciòn
 * @param {IPermiso[]} aPermisos Listado de permisos disponibles
 * @returns {IModulo[]} Listado de modulos disponibles
 */
const GenerarArregloModulos = (aPermisos: IPermiso[]): IProductoModulo[] => {
    // Generamos la variable de retorno
    let _ret: IProductoModulo[] = []
    // Agregamos un listado con modulos unicos
    aPermisos.forEach(p => {
        if (!_ret.find(f => f.ModuloID === p.ModuloID)) {
            _ret.push({
                ProductoID: p.ProductoID,
                ProductoNombre: p.ProductoNombre,
                EmpresaId: p.EmpresaId,
                EmpresaNombre: p.EmpresaNombre,
                ModuloID: p.ModuloID,
                ModuloNombre: p.ModuloNombre,
                ModuloIcono: p.ModuloIcono,
                ModuloColorBorde: p.ModuloColorBorde,
                ModuloColorFondo: p.ModuloColorFondo,
                ModuloColorFuente: p.ModuloColorFuente,
                ModuloRuta: p.ModuloRuta
            })
        }
    })

    // Regresamos nuestro arreglo
    return _ret.sort((p, a) => p.ModuloNombre.localeCompare(a.ModuloNombre))
}

/**
 * Genera una arreglo de los modulos para mostrar en la lista de selecciòn
 * @param {IPermiso[]} aPermisos Listado de permisos disponibles
 * @returns {IModulo[]} Listado de modulos disponibles
 */
const GenerarArregloProductos = (aPermisos: IPermiso[]): IProductoModulo[] => {

    // Generamos la variable de retorno
    let _ret: IProductoModulo[] = []

    // Agregamos un listado con modulos unicos
    aPermisos.filter(x => x.ProductoActivo && x.ProductoPrincipal).forEach(p => {
        if (!_ret.find(f => f.ProductoID === p.ProductoID)) {
            _ret.push({
                ProductoID: p.ProductoID,
                ProductoNombre: p.ProductoNombre,
                EmpresaId: p.EmpresaId,
                EmpresaNombre: p.EmpresaNombre,
                ModuloID: p.ModuloID,
                ModuloNombre: p.ModuloNombre,
                ModuloIcono: p.ModuloIcono,
                ModuloColorBorde: p.ModuloColorBorde,
                ModuloColorFondo: p.ModuloColorFondo,
                ModuloColorFuente: p.ModuloColorFuente,
                ModuloRuta: p.ModuloRuta
            })
        }
    })

    // Regresamos nuestro arreglo
    return _ret.sort((p, a) => {
        return p.ProductoNombre.localeCompare(a.ProductoNombre)
    })
}


const SelectorModulos = (props: TSelectorModulos) => {
    console.log('Esto es props', props.ui.DireccionIP)
    //convert to string
    var ipString = JSON.stringify(props.ui.DireccionIP)

    IPRecibida = ipString

    console.log('Esto es IP', IPRecibida)

    const MySwal = withReactContent(Swal)
    let isMounted = React.useRef(true)
    // Manejamos el historial
    const history = useHistory()

    // Valor del Modulo seleccionado
    const [producto, cambiarProducto] = React.useState<string | number>("None")
    const [cambiarContrasena, setCambiarContrasena] = React.useState(false)
    const [mostrarContrasena, setMostrarContrasena] = React.useState(false)
    const [dataInformacion, setDataInformacion]: any = React.useState('')
    const [showPad, setShowPad] = useState(false)

    const fnCerrar = () => {
        setState({ ...state, cambiodecontrasena: false })
    }

    console.log(producto)

    const [state, setState] = React.useState({
        cambiodecontrasena: false,
        ContrasenaNueva: '',
    })


    const FNCambioContrasena = (Datos: { Contrasena }) => {
        Funciones.FNUpdateContrasena(props.oidc, Datos)
            .then((res: any) => {
                setDataInformacion(res.data)
                setCambiarContrasena(false)
                toast.success(`Su contraseña es: ${dataInformacion} `)
            })
            .catch((err: any) => {
                console.log(err)
            })
    }

    const obtenerCambioContrasena = () => {
        Funciones.FNGetUsuario(props.oidc)
            .then((res: any) => {
                if (res.MasterUser == false) {
                    if (res.CambiarContrasena == true) {
                        setState(s => ({ ...s, cambiodecontrasena: res.CambiarContrasena }))
                        setCambiarContrasena(true)
                    }
                }
            })
            .catch((err: any) => {
                console.log("ERROR EN LA PETICION: ", err)
            })
    }


    React.useEffect(() => {
        obtenerCambioContrasena()
        // eslint-disable-next-line
    }, [])

    const fnRestContra = () => {
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

                    }
                    Funciones.FNUpdate(props.oidc, a)
                        .then((respuesta: any) => {
                            if (isMounted.current === true) {
                                setState(s => ({ ...s, ContrasenaNueva: respuesta.Contrasena }))
                                toast.success(`Contraseña restablecida correctamente.
                                Su nueva contraseña es: ${respuesta.Contrasena}`)
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
    }


    // Render the component
    return (
        <Container className="mt-auto pt-5">
            <Row>
                {state.cambiodecontrasena &&
                    <ModalWin open={cambiarContrasena} center scrollable>
                        <ModalWin.Header>
                            <h5><FaKey /> RESTABLECER CONTRASEÑA</h5>
                        </ModalWin.Header>
                        <ModalWin.Body>
                            <CambioContrasena
                                oidc={props.oidc}
                                fnCerrar={fnCerrar}
                            />
                        </ModalWin.Body>
                    </ModalWin>
                }
                {/* Mostrar Contraseña restablecida */}
                <ModalWin open={mostrarContrasena} center scrollable>
                    <ModalWin.Header>
                        <h2> <FaKey /> Contraseña Restablecida</h2>
                    </ModalWin.Header>
                    <ModalWin.Body>
                        La nueva contraseña del usuario <strong>{props.oidc.user.profile.Persona[0].Nombre} {props.oidc.user.profile.Persona[0].ApellidoPaterno}</strong> es:
                        <div className="column text-center is-full-desktop is-full-tablet is-full-mobile">
                            <strong><h3>{state.ContrasenaNueva}</h3></strong>
                        </div>
                        <br>
                        </br>

                        <button type="button" className={"btn btn-primary waves-effect waves-light"}>
                            <span className="" onClick={() => {
                                navigator.clipboard.writeText(state.ContrasenaNueva), toast.success("Contraseña copiada correctamente")
                            }}>Copiar</span>&nbsp;<FaCopy />
                        </button>


                    </ModalWin.Body>
                    <ModalWin.Footer>
                        <button
                            className='btn btn-danger'
                            onClick={() => { setMostrarContrasena(false), setCambiarContrasena(false) }}
                        >
                            Cancelar
                        </button>

                    </ModalWin.Footer>
                </ModalWin>


                <Col xs={12} sm={12} md={10} offset={{ md: 1, sm: 0, xs: 0 }}>

                    <div>
                        {/*      <div style={{ marginLeft: '100%', backgroundColor: 'blue' }}>
                            <button onClick={() => fnRestContra()} title={`Restablecer contraseña`} className="ms-1 asstext text-dark"><FaKey /></button>
                        </div> */}
                        <select
                            value={producto}
                            onChange={(e) => {
                                if (e.target.value === 'Interno' || e.target.value === 'None') {
                                    cambiarProducto(e.target.value)
                                }
                                else {
                                    const ProductoID = parseInt(e.target.value)

                                    const moduloSelect = (props.ui.PermisosProductos ?? []).find(ag => ag.ProductoID === ProductoID)
                                    if (moduloSelect !== undefined)
                                        cambiarProducto(parseInt(e.target.value))
                                }
                            }}

                            className="form-select my-2"
                            style={{ width: "100%" }}
                        >
                            {/** Default option */}

                            <option value="None" disabled>Seleccionar</option>

                            {/** Detalle de permiso general */}
                            {(props.ui.PermisosGenerales ?? []).length > 0 && (<option value="Interno">Administración</option>)}

                            {/** Detalle de los permisos de productos en especifico */}
                            {
                                (GenerarArregloProductos((props.ui.PermisosProductos ?? [])).map((p, pId) => (
                                    <option key={pId} value={p.ProductoID}>ID: {p.ProductoID} - {p.ProductoNombre}, Empresa: {p.EmpresaNombre}</option>
                                )))

                                

                            }
                        </select>

                        <div className="container mx-0">
                            <div className="row">

                                {/** Mostramos los modulos internos */}
                                {producto === "Interno" && GenerarArregloModulos((props.ui.PermisosGenerales ?? [])).map((modulo, moduloId) =>
                                    <div
                                        key={`ag __${moduloId}`}
                                        className={`col-sm-12 col-md-6 col-lg-4 my-2`}
                                        style={{ cursor: "pointer", userSelect: "none" }}
                                        onClick={() => {

                                            // Definimos el modulo
                                            props.FBDefinirModulo((props.ui.PermisosGenerales ?? []).filter(m => m.ModuloID === modulo.ModuloID), undefined, modulo)

                                            // Vamos a la ruta del modulo
                                            history.push(`/app/${modulo.ModuloRuta}`)
                                        }}
                                    >
                                        <div className="
                                                text-center
                                                px-5 py-2 mb-3"
                                            style={{ color: modulo.ModuloColorFuente, backgroundColor: modulo.ModuloColorFondo, border: `1.5px solid ${modulo.ModuloColorBorde}`, borderRadius: "2.5px" }}
                                        >
                                            <p className="fs-3 my-3 is-size-4" style={{ color: modulo.ModuloColorFuente }}>{modulo.ModuloNombre}</p>
                                            <i className={`fa-4x my-5 py-5 fa fa-${modulo.ModuloIcono}`} style={{ color: modulo.ModuloColorFuente }} />
                                            <hr style={{ color: modulo.ModuloColorFuente }} />
                                            <p className="fs-3 my-3 is-size-7" style={{ color: modulo.ModuloColorFuente }}>Ingresar</p>
                                        </div>
                                    </div>
                                )}

                                {/** Mostramos los modulos de producto */}
                                {producto !== "Interno" && producto !== "None" && GenerarArregloModulos((props.ui.PermisosProductos ?? []).filter(f => f.ProductoID === producto)).map((modulo, moduloId) =>
                                    <div
                                        key={`ag__${moduloId}`}
                                        className={`col-sm-12 col-md-6 col-lg-4 my-3`}
                                        style={{ cursor: "pointer", userSelect: "none" }}
                                        onClick={() => {

                                            // Definimos el modulo
                                            props.FBDefinirModulo((props.ui.PermisosProductos ?? []).filter(x => x.ProductoID === producto), modulo, modulo)

                                            // Vamos a la ruta del modulo
                                            history.push(`/app/${producto}/${modulo.ModuloRuta}`)
                                        }}
                                    >
                                        <div className="text-center px-5 py-2"
                                            style={{ color: modulo.ModuloColorFuente, backgroundColor: modulo.ModuloColorFondo, border: `1.5px solid ${modulo.ModuloColorBorde}`, borderRadius: "2.5px" }}
                                        >
                                            <p className="fs-3 my-3 is-size-4" style={{ color: modulo.ModuloColorFuente }}>{modulo.ModuloNombre}</p>
                                            <i className={`fa-4x my-5 py-5 fa fa-${modulo.ModuloIcono}`} style={{ color: modulo.ModuloColorFuente }} />
                                            <hr style={{ color: modulo.ModuloColorFuente }} />
                                            <p className="fs-3 my-3 is-size-7" style={{ color: modulo.ModuloColorFuente }}>Ingresar</p>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

// Mapear el estado a las propiedades
const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI
})

/** Funciones de manejo de redux */
const mapDispatchToProps = (dispatch: any) => ({
    FBDefinirModulo: (Permisos: IPermiso[], Producto?: IProducto, Modulo?: IModulo, DirIP?: any) => dispatch(DefinirModulo({ Producto, Modulo, Permisos, DirIP: IPRecibida }))
})


// Exportamos el componente conectado
export default connect(mapStateToProps, mapDispatchToProps)(SelectorModulos)