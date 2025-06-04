import React from 'react'

// Interfaces de base de datos
import { DBConfia_General } from '../../../interfaces_db/DBConfia/General'

// Componentes generales
import { Acordion, Tabs, ImgViewer } from '../../global'

// Iconos
import { FaCheck, FaUserAlt, FaEye, FaPencilAlt } from 'react-icons/fa'
import { FcBriefcase, FcHome, FcPhone, FcBusinessman, FcPlus } from 'react-icons/fc'

// Formateo de fechas
import moment from 'moment'
import { FormateoDinero } from '../../../global/variables'
import { MdClose } from 'react-icons/md'
import ModalWin, { MODAL_TITLE_CLASS } from '../../global/ModalWin'
import { CForm } from './CFormTelefonoDomicilio'
import { CFormTelefonoMovil } from './CFormTelefonoMovil'
import { CFormCambiarContrasena } from './CFormCambiarContrasena'


import { IOidc } from '../../../../../uicv/src/interfaces/oidc/IOidc'
import { iUI } from '../../../interfaces/ui/iUI'
import { IEstado } from '../../../../src/interfaces/redux/IEstado'
import { AgregarDireccionesPersona } from '../../app/modulos/personas/CompAdministracion/CompPersona/AgregarDireccionesPersona'
import { AgregarEmpleoPersona } from '../../app/modulos/personas/CompAdministracion/CompPersona/AgregarEmpleoPersona'
import { DBConfia_Prospeccion } from '../../../interfaces_db/DBConfia/Prospeccion'
import { toast } from 'react-toastify'
import { CFormRFC } from './CFormRfc'
import { CFormCurp } from './CFormCurp'
import { CFormNombre } from './CFormNombre'
import { addOneDay } from '../../../global/functions'


// Datos necesarios para el perfil
type PerfilPersonaTipo = {
    oidc: IOidc,
    ui: iUI
    // Detalle para mostrar los detalles del perfil
    Persona: DBConfia_General.IPersonas_VW,
    Empleos: DBConfia_General.IEmpleos_VW[],
    Direcciones: DBConfia_General.IDirecciones_VW[],
    DireccionesMigradas: DBConfia_General.IDireccionesMigradas[],
    Documentos?: {},
    canceladoTemp?: boolean,
    // Podemos editar la persona
    Editar: boolean
}
/**
 * Componente para mostrar los detalles generales de una persona
 * @param {PerfilPersonaTipo} Detalles necesarios para mostrar los datos 
 * @returns Componente de react
 */

export const PerfilPersona = (props: PerfilPersonaTipo, ui) => {
    // Necesidad de cambiar otro componente padre
    const [showFirma, setShowFirma] = React.useState(false)

    const changeImage = (e) => {
        e.preventDefault()
        setShowFirma(!showFirma)
    }
    const DatosDefecto = { DistribuidorID: props.Persona.PersonaID, Telefono: props.Persona.TelefonoDomicilio,/* UsuarioIDModifica: 0,*/ }
    const DatosCelular = { DistribuidorID: props.Persona.PersonaID, Celular: props.Persona.TelefonoMovil,/* UsuarioIDModifica: 0,*/ }
    const DatosRFC = { DistribuidorID: props.Persona.PersonaID, RFC: props.Persona.RFC,/* UsuarioIDModifica: 0,*/ }
    const DatosCurp = { DistribuidorID: props.Persona.PersonaID, Curp: props.Persona.CURP,/* UsuarioIDModifica: 0,*/ }
    const DatosNombre = { DistribuidorID: props.Persona.PersonaID, Nombre: props.Persona.Nombre, ApellidoPaterno: props.Persona.ApellidoPaterno, ApellidoMaterno: props.Persona.ApellidoMaterno/* UsuarioIDModifica: 0,*/ }
    const DatosContrasena = { PersonaID: props.Persona.PersonaID, Contrasena: '', Confirmar: '',/* UsuarioIDModifica: 0,*/ }
    const Datos: any[] = []
    const datosDirecciones: any[] = []
    const datosDireccionesMigradas: any[] = []
    const datosEmpleo: any[] = []
    const DatosDireccion = {
        DireccionID: 0, vialidadTipoId: 0, orientacionVialidadTipoId: 0, AsentamientoID: 0, NombreVialidad: '', NumeroExterior: 0,
        NumeroInterior: 0, ReferenciasGeograficas: '', ViviendaTipoId: 0, CreacionFecha: '', CreacionPersonaID: 0, codigoPostal: '', CreacionUsuarioID: 0
    }
    const DatosDireccionMigradas = {
        Direccion: ''
    }
    const DatosEmpleo = {
        EmpleoID: 0, PersonaID: 0, OcupacionID: 0, Empresa: '', Puesto: '', Telefono: '', DireccionID: 0, FechaIngreso: '', FechaTermino: '',
        SueldoMensual: 0, Activo: true, CreacionFecha: '', CreacionPersonaID: 0, CreacionUsuarioID: 0
    }

    const [state, setState] = React.useState({
        datosDirecciones,
        datosDireccionesMigradas,
        datosEmpleo,
        Datos,
        DatosCelular,
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        },
        FormCelular:
        {
            Mostrar: false,
            DatosCelular: DatosCelular,
            Id: undefined
        },
        FormRFC:
        {
            Mostrar: false,
            DatosRFC: DatosRFC,
            Id: undefined
        },
        FormCurp:
        {
            Mostrar: false,
            DatosCurp: DatosCurp,
            Id: undefined
        },
        FormNombre:
        {
            Mostrar: false,
            DatosNombre: DatosNombre,
            Id: undefined
        },
        tel: props.Persona.TelefonoDomicilio,
        cel: props.Persona.TelefonoMovil,
        RFC: props.Persona.RFC,
        Curp: props.Persona.CURP,
        Nombre: props.Persona.NombreCompleto,
        FormDireccion:
        {
            Mostrar: false,
            datosDirecciones: DatosDireccion,
            datosDireccionesMigradas: DatosDireccionMigradas,
            Id: undefined
        },
        FormEmpleo:
        {
            Mostrar: false,
            datosEmpleo: DatosEmpleo,
            Id: undefined
        },
        FormContrasena:
        {
            Mostrar: false,
            Datos: DatosContrasena,
            Id: undefined
        },
    })


    const cbActualizaTelefono = (telefono: any) => {
        setState({ ...state, tel: telefono, Form: { ...state.Form, Mostrar: false }, })
    }
    const cbActualizaCelular = (celular: any) => {
        setState({ ...state, cel: celular, FormCelular: { ...state.FormCelular, Mostrar: false } })
    }
    const cbActualizaRFC = (RFC: any) => {
        setState({ ...state, RFC: RFC, FormRFC: { ...state.FormRFC, Mostrar: false } })
    }
    const cbActualizaCurp = (Curp: any) => {
        setState({ ...state, Curp: Curp, FormCurp: { ...state.FormCurp, Mostrar: false } })
    }
    const cbActualizaNombre = (Nombre: any) => {
        setState({ ...state, Nombre: Nombre, FormNombre: { ...state.FormNombre, Mostrar: false } })
    }
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false }, FormCelular: { ...state.FormCelular, Mostrar: false }, FormRFC: { ...state.FormRFC, Mostrar: false }, FormCurp: { ...state.FormCurp, Mostrar: false }, FormNombre: { ...state.FormNombre, Mostrar: false } })
    const fnCancelarContra = () => setState({ ...state, FormContrasena: { ...state.FormContrasena, Mostrar: false } })

    //DIRECCIONES
    const cbAgregarA = (item: any, personaID: any) => {
        if (item.res == 1) {
            toast.success(item.msj)
            props.Direcciones.map(d => d.DireccionID)
            props.Direcciones.unshift(item.Data)
            setState(s => ({ ...s, datosDirecciones: [...state.datosDirecciones, item.Data], FormDireccion: { ...state.FormDireccion, Mostrar: false, }, FormaAgregarA: false, personaID: personaID }))
        } else {
            toast.warning(item.msj)
        }
    }

    const cbAgregarAs = (item: any, personaID: any) => {
        if (item.res == 1) {
            toast.success(item.msj)
            props.DireccionesMigradas.map(d => d.IDDireccion)
            props.DireccionesMigradas.unshift(item.Data)
            setState(s => ({ ...s, datosDireccionesMigradas: [...state.datosDireccionesMigradas, item.Data], FormDireccion: { ...state.FormDireccion, Mostrar: false, }, FormaAgregarA: false, personaID: personaID }))
        } else {
            toast.warning(item.msj)
        }
    }
    const fnCancelarA = () => setState(s => ({ ...s, FormDireccion: { ...state.FormDireccion, Mostrar: false, }, FormaAgregarA: false, item: undefined }))

    //EMPLEO
    const cbAgregarE = (item: any, personaID: any) => {
        if (item.res == 1) {
            toast.success(item.msj)
            props.Empleos.map(d => d.EmpleoID)
            props.Empleos.unshift(item.Data)
            setState(s => ({ ...s, datosEmpleo: [...state.datosEmpleo, item.Data], FormEmpleo: { ...state.FormEmpleo, Mostrar: false, }, FormAgregarA: false, personaID: personaID }))
        } else {
            toast.warning(item.msj)
        }
    }
    const fnCancelarE = () => setState(s => ({ ...s, FormEmpleo: { ...state.FormEmpleo, Mostrar: false, }, FormaAgregarA: false, item: undefined }))

    // Defninimos nuestro proceso para la carga inicial de datos
    React.useEffect(() => {

        // Consultamos los datos
        // ConsultarDatos()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    // Rendereamos el componente
    return (
        <div className="col-12 text-center">
            {/* <img src="/images/noimagen.png" alt="" /> */}
            {!props.Documentos ?
                <FaUserAlt className="rounded-circle avatar-lg" /> :
                <>
                    {/* <p className={"mb-1 fw-bold"} style={{ color: props.Persona.BuroInternoColor }}>ID Socia: {props.Persona.DistribuidorID}</p> */}
                    <p className={"mb-1 fw-bold"} style={{ color: props.Persona.BuroInternoColor }}>{props.Persona.ClienteID ? `ID Cliente: ${props.Persona.ClienteID}` : `ID: ${props.Persona.DistribuidorID}`}</p>
                    {(props.Persona.DistribuidorIDVR) && <p className={"mb-1 fw-bold"} style={{ color: props.Persona.BuroInternoColor }}>
                        {/* props.Persona.ClienteIDVR ? `ID Cliente VR: ${props.Persona.ClienteIDVR}` : */ `ID: ${props.Persona.DistribuidorIDVR}`}
                    </p>}

                    <a href="#" style={{/* marginLeft: '15em',*/ padding: '0' }} className={"btn btn-link waves-effect mb-2"} onClick={(e) => changeImage(e)}><FaEye /> <span>{showFirma ? 'Foto' : 'Firma'}</span></a>
                    <div className="d-flex justify-content-center">
                        <div className={'d-flex justify-content-center align-items-center'} style={{ width: '50%', height: '150px', backgroundColor: '', border: '1px solid black', borderRadius: '6px' }}>
                            <ImgViewer imgSrc={props.Documentos[showFirma ? 'firma' : 'ine']} noToolbar={false} zIndex={1500} maxWidth={"100%"} maxHeight={150} />
                            {/* <p className='text-center p-3'>{props.Documentos['flag'] == 2 ? '*no se ha guardado este documento' : ''}</p> */}
                        </div>

                    </div>
                </>
            }
            <div className={'mt-2 mb-0 fw-bold'}>
                <div className='my-2 d-flex'>
                    <div className={`d-flex justify-content-center flex-grow-1`}>
                        <p className='is-size-8  has-text-centered '>{state.Nombre}</p>
                    </div>
                    {props.ui.PermisosProductos?.find(p => p.PermisoID == 112) /*props.Editar */ &&
                        <>
                            {/* // <div style={{ position: 'absolute', right: '50px', zIndex: 10, cursor: 'pointer' }} title={'Editar Nombre'} onClick={() => setState({ ...state, FormNombre: { Mostrar: true, DatosNombre: DatosNombre, Id: undefined } })}> */}
                            <div className="d-flex justify-content-center flex-grow-none">
                                <FaPencilAlt className='' size={20} style={{ color: 'rgb(76, 175, 80)', cursor: 'pointer' }} onClick={() => setState({ ...state, FormNombre: { Mostrar: true, DatosNombre: DatosNombre, Id: undefined } })}></FaPencilAlt>
                            </div>
                            {/* <FcPlus size={25} /> */}
                        </>

                    }
                </div>
                {/* {state.Nombre} */}
            </div>
            <p className={"mb-1 fw-bold"} style={{ color: props.Persona.BuroInternoColor }}>BURO {props.Persona.BuroInternoEstatus}</p>
            {props.canceladoTemp && <p className={"mb-1 fw-bold"} style={{ color: "#FF0000" }}>Cancelado Temporalmente</p>}
            {props.Persona.UsuarioID == null && <p className='btn btn-link mb-0 fw-bold'>Usuario no asignado</p>}
            {props.Persona.UsuarioID != null && <button type="button" className="btn btn-link mt-2 mb-0 fw-bold" onClick={() => setState({ ...state, FormContrasena: { Mostrar: true, Datos: DatosContrasena, Id: undefined } })}>Cambiar Contraseña</button>}            {/* {props.ui.PermisosGenerales?.find(p => p.PermisoID == 487) &&
             <button type="button" className="btn btn-link mt-2 mb-0 fw-bold" onClick={() => setState({ ...state, FormContrasena: { Mostrar: true, Datos: DatosContrasena, Id: undefined } })}>Cambiar Contraseña</button>} */}
            <Acordion TabSelecionado="">
                <Acordion.Tab Identificador="contacto" Titulo={<React.Fragment><FcPhone size={20} />&nbsp;CONTACTO</React.Fragment>}>
                    <div>
                        <div className="text-start">
                            <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                <tbody>
                                    <tr>

                                        <td className='mb-1' style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tel.Movil:
                                            {props.ui.PermisosProductos?.find(p => p.PermisoID == 112) /*props.Editar */ &&
                                                <div style={{ position: 'absolute', right: '15px', zIndex: 10, cursor: 'pointer' }} title={'Editar Celular'} onClick={() => setState({ ...state, FormCelular: { Mostrar: true, DatosCelular: DatosCelular, Id: undefined } })}>
                                                    <FcPlus size={25} />
                                                </div>
                                            }
                                        </td>

                                        <td>{state.cel}</td>
                                    </tr>

                                    <tr>

                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tel.Casa:
                                            {props.ui.PermisosProductos?.find(p => p.PermisoID == 110) && /*props.Editar &&*/
                                                <div style={{ position: 'absolute', right: '15px', zIndex: 10, cursor: 'pointer' }} title={'Editar Telefono'} onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}>
                                                    <FcPlus size={25} />
                                                </div>
                                            }
                                        </td>

                                        <td>{state.tel}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>E-Mail:</td>
                                        <td>{props.Persona.CorreoElectronico}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </Acordion.Tab>
                <Acordion.Tab Identificador="info" Titulo={<React.Fragment><FcBusinessman size={20} />&nbsp;GENERAL</React.Fragment>}>
                    <>
                        <div className="text-start">
                            <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                <tbody>
                                    <tr>
                                        <td className='mb-1' style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>RFC:
                                            {props.ui.PermisosProductos?.find(p => p.PermisoID == 112) /*props.Editar */ &&
                                                <div style={{ position: 'absolute', right: '15px', zIndex: 10, cursor: 'pointer' }} title={'Editar RFC'} onClick={() => setState({ ...state, FormRFC: { Mostrar: true, DatosRFC: DatosRFC, Id: undefined } })}>
                                                    <FcPlus size={25} />
                                                </div>
                                            }
                                        </td>
                                        <td>{state.RFC}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>CURP:
                                            {props.ui.PermisosProductos?.find(p => p.PermisoID == 112) /*props.Editar */ &&
                                                <div style={{ position: 'absolute', right: '15px', zIndex: 10, cursor: 'pointer' }} title={'Editar Curp'} onClick={() => setState({ ...state, FormCurp: { Mostrar: true, DatosCurp: DatosCurp, Id: undefined } })}>
                                                    <FcPlus size={25} />
                                                </div>
                                            }
                                        </td>
                                        <td style={{ fontSize: '.8em' }}>{state.Curp}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>F.Nacimiento:</td>
                                        <td>{moment(addOneDay(new Date(props.Persona.FechaNacimiento))).format("DD/MM/YYYY")}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Conyuge:</td>
                                        <td>{props.Persona.NombreConyuge}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sexo:</td>
                                        <td>{props.Persona.Sexo}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>E.Civil:</td>
                                        <td>{props.Persona.EstadoCivil}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Escolaridad:</td>
                                        <td>{props.Persona.Escolaridad}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <hr />
                        <div className="text-start">
                            <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Identificaci&oacute;n:</td>
                                        <td>{props.Persona.identificacionTipo} - {props.Persona.identificacionNumero}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ingreso Mensual:</td>
                                        <td>{FormateoDinero.format(props.Persona.IngresosMensuales)}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dependientes E.:</td>
                                        <td>{props.Persona.DependientesEconomicos}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </>
                </Acordion.Tab>
            </Acordion>
            <Tabs TabSelecionado={'ubicacion'} Justified={true} Kind={Tabs.TabsKind.CUSTOM}>
                <Tabs.Tab Titulo={<><FcHome size={20} /> <br /> DIRECCIONES</>} Identificador={'ubicacion'}>

                    <Acordion TabSelecionado={''}>
                        <div>
                            {props.Editar && props.ui.PermisosProductos?.find(p => p.PermisoID == 470) &&
                                <div style={{ position: 'absolute', right: '15px', zIndex: 10, cursor: 'pointer' }} title={'Agregar dirección'}
                                    onClick={() => setState({ ...state, FormDireccion: { Mostrar: true, datosDirecciones: DatosDireccion, datosDireccionesMigradas: DatosDireccionMigradas, Id: undefined, } })} /*onClick={() => alert("DOMO !")}*/>
                                    <FcPlus size={25} />
                                </div>
                            }
                            <div>
                                <div>
                                    {props.DireccionesMigradas.map((d, dIds) =>
                                        <Acordion.Tab key={'dirs_' + dIds} Identificador={'dirs_' + dIds} Titulo={
                                            `
                                                    ${d.Direccion}
                                                    `
                                        }>
                                            <div className="text-start">
                                                <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                    <tbody>
                                                        <tr>
                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ciudad:</td>
                                                            <td style={{ fontSize: '.8em' }}>{d.Ciudad}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Direccion:</td>
                                                            <td style={{ fontSize: '.8em' }}>{d.Direccion}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </Acordion.Tab>
                                    )}
                                </div>
                                {props.Direcciones.map((d, dId) =>
                                    <Acordion.Tab key={'dir_' + dId} Identificador={'dir_' + dId} Titulo={
                                        `
                                                    ${d.vialidadTipoId !== 1 ? d.vialidadTipo : ''}
                                                    ${d.NombreVialidad}
                                                    ${d.orientacionVialidadTipoId !== 0 ? `[${d.orientacionVialidadTipo}]` : ''}
                                                    #${d.NumeroExterior}
                                                    ${d.NumeroInterior ? ', No. Interior: ' + d.NumeroInterior : ''}
                                                    - ${d.Asentamiento}
                                                    `
                                    }>
                                        <div className="text-start">
                                            <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                <tbody>
                                                    <tr>
                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dirección:</td>
                                                        <td style={{ fontSize: '.8em' }}>{d.vialidadTipoId !== 1 ? d.vialidadTipo : ''}&nbsp;{d.NombreVialidad} {d.orientacionVialidadTipoId !== 0 ? `[${d.orientacionVialidadTipo}]` : ''}, #{d.NumeroExterior}
                                                            {d.NumeroInterior && <span>, No.Interior: {d.NumeroInterior}</span>}, {d.Asentamiento}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>CP:</td>
                                                        <td style={{ fontSize: '.8em' }}>{d.CodigoPostal}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Municipio:</td>
                                                        <td style={{ fontSize: '.8em' }}>{d.Municipio}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ciudad:</td>
                                                        <td style={{ fontSize: '.8em' }}>{d.Ciudad}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Estado:</td>
                                                        <td style={{ fontSize: '.8em' }}>{d.Estado}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>T.Vivienda:</td>
                                                        <td style={{ fontSize: '.8em' }}>{d.ViviendaTipo}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </Acordion.Tab>
                                )}
                            </div>

                        </div>
                    </Acordion>
                </Tabs.Tab>
                <Tabs.Tab Titulo={<><FcBriefcase size={20} /> <br /> EMPLEOS</>} Identificador={'empleo'}>
                    <Acordion TabSelecionado={''}>
                        <div>
                            {props.Editar && props.ui.PermisosProductos?.find(p => p.PermisoID == 471) &&
                                <div style={{ position: 'absolute', right: '15px', zIndex: 10, cursor: 'pointer' }} title={'Agregar Empleo'}
                                    onClick={() => setState({ ...state, FormEmpleo: { Mostrar: true, datosEmpleo: DatosEmpleo, Id: undefined, } })} /*onClick={() => alert("DOMO !")}*/>
                                    <FcPlus size={25} />
                                </div>
                            }
                            {props.Empleos.map((d, dId) =>
                                <Acordion.Tab key={'job_' + dId} Identificador={'job_' + dId} Titulo={`Trabajo de [${d.Puesto}] para ${d.Empresa}`}>
                                    <div className="text-start">
                                        <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Teléfono:</td>
                                                    <td>{d.Telefono}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>F.Ingreso:</td>
                                                    <td>{moment(d.FechaIngreso).format('DD-MM-YYYY')}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Activo:</td>
                                                    <td>{d.Activo ? <span>Si <FaCheck /></span> : <span>No <MdClose /></span>}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <hr className={'mt-1 mb-1'} />
                                        <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Estado:</td>
                                                    <td style={{ fontSize: '.8em' }}>{d.Direccion_Estado}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Municipio:</td>
                                                    <td style={{ fontSize: '.8em' }}>{d.Direccion_Municipio}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ciudad:</td>
                                                    <td style={{ fontSize: '.8em' }}>{d.Direccion_Ciudad}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dirección:</td>
                                                    <td style={{ fontSize: '.8em' }}>{d.Direccion_vialidadTipo}&nbsp;{d.Direccion_NombreVialidad} [{d.Direccion_orientacionVialidadTipo}], NO. {d.Direccion_NumeroExterior}
                                                        {d.Direccion_NumeroInterior && <span>, No.Interior: {d.Direccion_NumeroInterior}</span>}, {d.Direccion_Asentamiento}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>CP:</td>
                                                    <td style={{ fontSize: '.8em' }}>{d.Direccion_CodigoPostal}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>T.Vivienda:</td>
                                                    <td style={{ fontSize: '.8em' }}>{d.Direccion_ViviendaTipo}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Acordion.Tab>
                            )}
                        </div>
                    </Acordion>
                </Tabs.Tab>
            </Tabs>
            <div>
                <ModalWin open={state.Form.Mostrar}>
                    <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>Actualizar Teléfono Domicilio</h5>
                    </ModalWin.Header>
                    <ModalWin.Body>
                        {<CForm
                            oidc={props.oidc}
                            initialValues={state.Form.Datos}
                            Id={state.Form.Id}
                            cbActualizaTelefono={cbActualizaTelefono}
                            fnCancelar={fnCancelar}
                        />}
                    </ModalWin.Body>
                </ModalWin>
            </div>
            <div>
                <ModalWin open={state.FormContrasena.Mostrar}>
                    <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>Actualizar Contraseña</h5>
                    </ModalWin.Header>
                    <ModalWin.Body>
                        {<CFormCambiarContrasena
                            oidc={props.oidc}
                            initialValues={state.FormContrasena.Datos}
                            Id={state.FormContrasena.Id}
                            cbActualizaTelefono={cbActualizaTelefono}
                            fnCancelar={fnCancelarContra}
                        />}

                    </ModalWin.Body>
                </ModalWin>

            </div>
            <div>
                <ModalWin open={state.FormCelular.Mostrar}>
                    <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>Actualizar Teléfono Móvil</h5>
                    </ModalWin.Header>
                    <ModalWin.Body>
                        {<CFormTelefonoMovil
                            oidc={props.oidc}
                            initialValues={state.FormCelular.DatosCelular}
                            Id={state.FormCelular.Id}
                            cbActualizaCelular={cbActualizaCelular}
                            fnCancelar={fnCancelar}
                        />}

                    </ModalWin.Body>
                </ModalWin>
                <ModalWin open={state.FormRFC.Mostrar}>
                    <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>Actualizar RFC</h5>
                    </ModalWin.Header>
                    <ModalWin.Body>
                        {<CFormRFC
                            oidc={props.oidc}
                            initialValues={state.FormRFC.DatosRFC}
                            Id={state.FormCelular.Id}
                            cbActualizaRFC={cbActualizaRFC}
                            fnCancelar={fnCancelar}
                        />}

                    </ModalWin.Body>
                </ModalWin>
                <ModalWin open={state.FormCurp.Mostrar}>
                    <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>Actualizar Curp</h5>
                    </ModalWin.Header>
                    <ModalWin.Body>
                        {<CFormCurp
                            oidc={props.oidc}
                            initialValues={state.FormCurp.DatosCurp}
                            Id={state.FormCelular.Id}
                            cbActualizaCurp={cbActualizaCurp}
                            fnCancelar={fnCancelar}
                        />}

                    </ModalWin.Body>
                </ModalWin>
                <ModalWin open={state.FormNombre.Mostrar}>
                    <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>Actualizar Nombre</h5>
                    </ModalWin.Header>
                    <ModalWin.Body>
                        {<CFormNombre
                            oidc={props.oidc}
                            initialValues={state.FormNombre.DatosNombre}
                            Id={state.FormCelular.Id}
                            cbActualizaNombre={cbActualizaNombre}
                            fnCancelar={fnCancelar}
                        />}

                    </ModalWin.Body>
                </ModalWin>
                {state.FormDireccion.Mostrar &&
                    <AgregarDireccionesPersona
                        oidc={props.oidc} Id={state.Form.Id} cbActualizar={() => { }} cbGuardar={cbAgregarA} fnCancelar={fnCancelarA} Mostrar={state.FormDireccion.Mostrar} /*Item={state.avalMuestra}*/ personaID={props.Persona.PersonaID} />
                }

                {state.FormEmpleo.Mostrar &&
                    <AgregarEmpleoPersona
                        oidc={props.oidc} Id={state.Form.Id} cbActualizar={() => { }} cbGuardar={cbAgregarE} fnCancelar={fnCancelarE} Mostrar={state.FormEmpleo.Mostrar} /*Item={state.avalMuestra}*/ personaID={props.Persona.PersonaID} />
                }
            </div>
        </div>

    )

}
const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI
})