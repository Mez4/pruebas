import React, { useState } from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { BiUserPlus, BiGroup } from 'react-icons/bi'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AgregarCaptura } from './AgregarCaptura'
import { AgregarDocumento } from './AgregarDocumentos'
import { AgregarAval } from './AgregarAval'
import { AgregarDocumentoAval } from './AgregarDocumentosAval'
import { AgregarReferencia } from './AgregarReferencia'
import { AgregarReferenciaAval } from './AgregarReferenciaAval'
import { Card, Spinner, Tabs, Acordion, ModalWin } from '../../../../../global'
import { FaCheckCircle, FaCircle, FaClock, FaDownload, FaEnvelopeOpen, FaEye, FaFile, FaQuestionCircle, FaUpload } from 'react-icons/fa'
import * as Funciones from './Funciones'
import { PerfilProspecto } from './PerfilProspecto'
import { DBConfia_Prospeccion } from '../../../../../../interfaces_db/DBConfia/Prospeccion'
import { AgregarConPersona } from '../AgregarConPersonaForm'
import ReactTooltip from 'react-tooltip'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { LogMensajes } from '../LogMensajes'
import { CFormD } from './CFormD'
import VerDoc from './VerDoc'
import { iUI } from '../../../../../../interfaces/ui/iUI'

type CatalogosType = {
    oidc: IOidc
    ui: iUI,
}

type EstadoTipo = {
    Datos: {
        DatosGenerales?: DBConfia_Prospeccion.IProspectosDatosGenereles_VW,
        DatosSocioeconomicos?: DBConfia_Prospeccion.IProspectosDatosSocioeconomicos_VW,
        Vehiculos: DBConfia_Prospeccion.IRelacionAutoMoto[],
        Experiencia: DBConfia_Prospeccion.IProspectosExperienciaVentas_VW[],
        Referencias: DBConfia_Prospeccion.IReferencias[]
        Documentos: DBConfia_Prospeccion.IProspectosDocumentos_VW[]
        Avales: DBConfia_Prospeccion.IAvales_VW[]
        DatosProspectos?: DBConfia_Prospeccion.IProspectos_VW,
        Procesos: []
    },
    CargandoProceso: boolean,
    CargandoPerfil: boolean,
    ErrorProceso: boolean
    ErrorPerfil: boolean
    Validado: boolean
}

const Prospecto = (props: CatalogosType) => {

    // Ontenemos el ID de la persona
    type paramType = { id: string }
    let { id } = useParams<paramType>()
    let id_int: number = parseInt(id as string)
    let id_ints: number = parseInt(id as string)

    let avalMuestra: DBConfia_Prospeccion.IAvales_VW | undefined

    // Controll our mounted state
    const DatosDefecto = {
        ProspectoID: 0,
        doc: ''
    }
    let isMounted = React.useRef(true)
    const MensajesProspecto: DBConfia_Prospeccion.ILogMensajes_VW[] = []
    const [state, setState] = React.useState({
        FormaAgregar: false,
        FormaAgregarDE: false,
        FormaAgregarD: false,
        FormaAgregarA: false,
        FormaAgregarDA: false,
        FormaAgregarR: false,
        FormaAgregarRA: false,
        Item: undefined,
        avalMuestra,
        VerNotificaciones: false,
        VerMensajes: false,
        MensajesProspecto,
        NombreProspecto: '',
        SubirDoc: false,
        documentoLabel: 0,
        documentoNombre: '',
        VerDoc: false,
        documentoPath: '',
        Form: DatosDefecto,
    })

    const [Estado, DefinirEstado] = React.useState<EstadoTipo>({
        Datos: {
            Procesos: [],
            DatosGenerales: undefined,
            DatosSocioeconomicos: undefined,
            Vehiculos: [],
            Experiencia: [],
            Referencias: [],
            Documentos: [],
            Avales: [],
            DatosProspectos: undefined
        },
        CargandoProceso: true,
        CargandoPerfil: true,
        ErrorProceso: false,
        ErrorPerfil: false,
        Validado: false
    })
    
    const permisoDocumentacion = props.ui?.PermisosProductos?.find(p => p.PermisoID == 2345)


    const [loading, setLoading] = useState(false)

    const ConsultarProcesos = async () => {
        try {
            DefinirEstado(e => ({ ...e, Datos: { ...e.Datos, Procesos: [] }, CargandoProceso: true, ErrorProceso: false }))
            let procesos: any = await Funciones.FNObtenerProceso(props.oidc, id_int)
            if (isMounted)
                DefinirEstado(e => ({
                    ...e,
                    Datos: { ...e.Datos, Procesos: procesos },
                    CargandoProceso: false,
                    ErrorProceso: false
                }))
        }
        catch (e) {
            if (isMounted)
                DefinirEstado(e => ({ ...e, Datos: { ...e.Datos, Procesos: [] }, CargandoProceso: false, ErrorProceso: true }))
        }
    }

    const ConsultarPersona = async () => {
        DefinirEstado(e => ({ ...e, Datos: { ...e.Datos, DatosGenerales: undefined, DatosSocioeconomicos: undefined, Vehiculos: [], Experiencia: [], Referencias: [], Documentos: [], Avales: [] }, CargandoPerfil: true, ErrorPerfil: false }))
        Funciones.FNObtenerPersona(props.oidc, id_int)
            .then((resultado: any) => {
                if (isMounted)
                    DefinirEstado(e => ({
                        ...e,
                        Datos: { ...e.Datos, DatosGenerales: resultado.DatosGenerales, DatosSocioeconomicos: resultado.DatosSocioeconomicos, Vehiculos: resultado.Vehiculos, Experiencia: resultado.Experiencia, Referencias: resultado.Referencias, Documentos: resultado.Documentos, Avales: resultado.Avales },
                        CargandoPerfil: false,
                        ErrorPerfil: false,
                        Validado: resultado.Validado
                    }))
            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)

                if (isMounted)
                    DefinirEstado(e => ({ ...e, Datos: { ...e.Datos, DatosGenerales: undefined, DatosSocioeconomicos: undefined, Vehiculos: [], Experiencia: [], Referencias: [], Documentos: [], Avales: [] }, CargandoPerfil: false, ErrorPerfil: true }))
            })
    }

    const ConsultarProspecto = async () => {
        DefinirEstado(e => ({ ...e, Datos: { ...e.Datos, DatosGenerales: undefined, DatosSocioeconomicos: undefined, Vehiculos: [], Experiencia: [], Referencias: [], Documentos: [], Avales: [] }, CargandoPerfil: true, ErrorPerfil: false }))
        Funciones.FNObtenerProspectos(props.oidc, id_int)
            .then((resultado: any) => {
                if (isMounted)
                    DefinirEstado(e => ({
                        ...e,
                        Datos: { ...e.Datos, DatosProspectos: resultado },
                        CargandoPerfil: false,
                        ErrorPerfil: false,
                        Validado: resultado.Validado
                    }))
            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)

                if (isMounted)
                    DefinirEstado(e => ({ ...e, Datos: { ...e.Datos, DatosGenerales: undefined, DatosSocioeconomicos: undefined, Vehiculos: [], Experiencia: [], Referencias: [], Documentos: [], Avales: [] }, CargandoPerfil: false, ErrorPerfil: true }))
            })
    }

    // Defninimos nuestro proceso para la carga inicial de datos
    React.useEffect(() => {
        console.log("IUUUU", props.ui)
        ConsultarProcesos()
        ConsultarPersona()
        FNNotificaciones()
        ConsultarProspecto()
    }, [id_int])

    const cbAgregar = (item: any) => {
        console.log('item: ', item)
        if (item.res == 1) {
            ConsultarProcesos()
            ConsultarPersona()
            toast.success(item.msj)
            setState(s => ({ ...s, FormaAgregar: false }))
        } else {
            toast.warning(item.msj)
        }
    }

    const cbAgregarDE = (item: any) => {
        console.log('item: ', item)
        if (item.res == 1) {
            ConsultarProcesos()
            ConsultarPersona()
            toast.success(item.msj)
            setState(s => ({ ...s, FormaAgregarDE: false }))
        } else {
            toast.warning(item.msj)
        }
    }

    const cbAgregarD = (item: any) => {
        if (item.res == 1) {
            ConsultarProcesos()
            ConsultarPersona()
            toast.success(item.msj)
            setState(s => ({ ...s, FormaAgregarD: false }))
        } else {
            toast.error(item.msj)
        }
    }

    const cbAgregarA = (item: any) => {
        if (item.res == 1) {
            ConsultarProcesos()
            ConsultarPersona()
            toast.success(item.msj)
            setState(s => ({ ...s, FormaAgregarA: false }))
        } else {
            toast.warning(item.msj)
        }
    }

    const cbAgregarDA = (item: any) => {
        if (item.res == 1) {
            ConsultarProcesos()
            ConsultarPersona()
            toast.success(item.msj)
            setState(s => ({ ...s, FormaAgregarDA: false }))
        } else {
            toast.error(item.msj)
        }
    }

    const cbAgregarR = (item: any) => {
        console.log('item: ', item)
        if (item.res == 1) {
            ConsultarProcesos()
            ConsultarPersona()
            toast.success(item.msj)
            setState(s => ({ ...s, FormaAgregarR: false }))
        } else {
            toast.warning(item.msj)
        }
    }

    const cbAgregarRA = (item: any) => {
        console.log('item: ', item)
        if (item.res == 1) {
            ConsultarProcesos()
            ConsultarPersona()
            toast.success(item.msj)
            setState(s => ({ ...s, FormaAgregarRA: false }))
        } else {
            toast.error(item.msj)
        }
    }

    const showDatos = () => setState(e => ({ ...e, FormaAgregar: true }))

    const showDatosEconomicos = () => setState(e => ({ ...e, FormaAgregarDE: true }))

    const showDocumentos = () => setState(e => ({ ...e, FormaAgregarD: true }))

    const showReferencias = () => setState(e => ({ ...e, FormaAgregarR: true }))

    const showAvales = (avalID: number) => {
        console.log(avalID)
        if (avalID === 0) {
            // (Estado.Datos.Procesos.find((x: any) => 
            // x.Descripcion === 'DOCUMENTACION AVALES' && !x.Validado) && 
            // Estado.Datos.Procesos.find((x: any) => 
            // x.Descripcion === 'REFERENCIAS AVALES' && !x.Validado))
            Estado.Datos.Procesos.find((x: any) =>
                x.Descripcion === 'VERIFICA AVAL' && !x.Validado) &&
                setState(e => ({ ...e, FormaAgregarA: true, avalMuestra: Estado.Datos.Avales.find((x: DBConfia_Prospeccion.IAvales_VW) => x.AvalID === avalID) }))
        } else {
            Estado.Datos.Procesos.find((x: any) =>
                x.Descripcion === 'VERIFICA AVAL' && !x.Validado) &&
                setState(e => ({ ...e, FormaAgregarA: true, avalMuestra: Estado.Datos.Avales.find((x: DBConfia_Prospeccion.IAvales_VW) => x.AvalID === avalID) }))
        }
    }

    const FNNotificaciones = async () => {
        setState(s => ({ ...s, cargandoNotif: true }))
        Funciones.FNGetNotificaciones(props.oidc, id_int)
            .then((respuesta: any) => {
                setState(s => ({ ...s, MensajesProspecto: respuesta.data }))
            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)

                setState(s => ({ ...s, cargandoNotif: false }))
            })
    }

    const FNMostrarMensajes = () => {

        setState(s => ({ ...s, VerMensajes: true, NombreProspecto: Estado.Datos.DatosGenerales?.NombreCompleto ?? '' }))
        mensajesLeído(id_int)
    }

    const mensajesLeído = (prospectoID: number) => {
        console.log(prospectoID)
        Funciones.FNGetNotificacionLeida(props.oidc, prospectoID)
            .then((item: any) => {
                console.log(item)
            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
            })
    }

    const download = () => {
        setLoading(true)
        window.location.href = "~/File/CONTRATO2020.pdf";
        // Funciones.getFileContrato(props.oidc, { ProspectoID: id_int })
        //     .then((pdf: any) => {
        //         const file = new Blob(
        //             [pdf],
        //             { type: 'application/pdf' });

        //         const fileURL = URL.createObjectURL(file);

        //         window.open(fileURL);
        //         setLoading(false)
        //         toast.success("Descarga de documento realizada correctamente")
        //     })
        //     .catch((error: any) => {
        //         toast.error("Error al descargar documento")
        //         setLoading(false)
        //     })

    }

    const fnCancelar = () => setState(s => ({ ...s, FormaAgregar: false, item: undefined }))

    const fnCancelarDE = () => setState(s => ({ ...s, FormaAgregarDE: false, item: undefined }))

    const fnCancelarD = () => setState(s => ({ ...s, FormaAgregarD: false, item: undefined }))

    const fnCancelarA = () => setState(s => ({ ...s, FormaAgregarA: false, item: undefined }))

    const fnCancelarDA = () => setState(s => ({ ...s, FormaAgregarDA: false, item: undefined }))

    const fnCancelarR = () => setState(s => ({ ...s, FormaAgregarR: false, item: undefined }))

    const fnCancelarRA = () => setState(s => ({ ...s, FormaAgregarRA: false, item: undefined }))

    const fnCancelarM = () => setState(s => ({ ...s, VerMensajes: false }))

    const fnSubirDoc = (documentoNombre: string, documentoLabel: number) => setState({ ...state, SubirDoc: true, documentoNombre, documentoLabel })
    const fnVerDoc = (documentoPath: string, documentoNombre: string) => setState({ ...state, VerDoc: true, documentoPath, documentoNombre })
    const fnCancelarVerDoc = () => setState({ ...state, VerDoc: false, SubirDoc: false })

    console.log('Proceso contrato:', Estado.Datos.Procesos);
    

    return (
        <>
            <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-3">
                    <Card>
                        <Card.Body>
                            {Estado.CargandoProceso && <Spinner />}
                            {Estado.ErrorProceso && <span>Error al cargar los datos del Proceso del Prospecto...</span>}
                            {Estado.Datos.Procesos?.length > 0 && <table className='table'>
                                <tbody>
                                    <tr style={{ verticalAlign: 'middle' }}>
                                        <td style={{ paddingTop: '14px' }}><FaCheckCircle color='#58db83' size={20} /></td>
                                        <td><button className="btn btn-success" style={{ width: '100%', textAlign: 'center', paddingLeft: '0px', paddingRight: '0px' }} type="button" onClick={() => { }}>DATOS GENERALES</button></td>
                                        <td></td>
                                    </tr>

                                    {Estado.Datos.Procesos.find((x: any) => x.Descripcion.includes('DATOS ECONOMICOS') && x.Validado) && <tr style={{ verticalAlign: 'middle' }}>
                                        <td style={{ paddingTop: '14px' }}><FaCheckCircle color='#58db83' size={20} /></td>
                                        <td><button className="btn btn-success" style={{ width: '100%', textAlign: 'center', paddingLeft: '0px', paddingRight: '0px' }} type="button" onClick={() => { }}>DATOS ECONOMICOS</button></td>
                                        <td></td>
                                    </tr>}
                                    {Estado.Datos.Procesos.find((x: any) => x.Descripcion.includes('DATOS ECONOMICOS') && !x.Validado) && <tr style={{ verticalAlign: 'middle' }}>
                                        <td style={{ paddingTop: '14px' }}><FaClock color='gray' size={20} /></td>
                                        <td><button className="btn btn-primary" style={{ width: '100%', textAlign: 'center', paddingLeft: '0px', paddingRight: '0px' }} type="button" onClick={showDatosEconomicos}>DATOS ECONOMICOS</button></td>
                                        <td></td>
                                    </tr>}

                                    {Estado.Datos.Procesos.find((x: any) => x.Descripcion === 'DOCUMENTACION PROSPECTO' && x.Validado) && <tr>
                                        <td style={{ paddingTop: '14px' }}><FaCheckCircle color='#58db83' size={20} /></td>
                                        <td><button className="btn btn-success" style={{ width: '100%', textAlign: 'center', paddingLeft: '0px', paddingRight: '0px' }} type="button" onClick={() => { }}>DOCUMENTOS</button></td>
                                        <td></td>
                                    </tr>}
                                    {Estado.Datos.Procesos.find((x: any) => x.Descripcion === 'DOCUMENTACION PROSPECTO' && !x.Validado) && <tr>
                                        <td style={{ paddingTop: '14px' }}><FaClock color='gray' size={20} /></td>
                                        <td><button className="btn btn-primary" style={{ width: '100%', textAlign: 'center', paddingLeft: '0px', paddingRight: '0px' }} type="button" onClick={showDocumentos}>DOCUMENTOS</button></td>
                                        <td></td>
                                    </tr>}

                                    {Estado.Datos.Procesos.find((x: any) => x.Descripcion === 'REFERENCIAS PROSPECTO' && x.Validado) && <tr>
                                        <td style={{ paddingTop: '14px' }}><FaCheckCircle color='#58db83' size={20} /></td>
                                        <td><button className="btn btn-success" style={{ width: '100%', textAlign: 'center', paddingLeft: '0px', paddingRight: '0px' }} type="button" onClick={() => !Estado.Validado && setState(e => ({ ...e, FormaAgregarR: true }))}>AGREGAR REFERENCIA</button></td>
                                        <td></td>
                                    </tr>}
                                    {Estado.Datos.Procesos.find((x: any) => x.Descripcion === 'REFERENCIAS PROSPECTO' && !x.Validado) && <tr>
                                        <td style={{ paddingTop: '14px' }}><FaClock color='gray' size={20} /></td>
                                        <td><button className="btn btn-primary" style={{ width: '100%', textAlign: 'center', paddingLeft: '0px', paddingRight: '0px' }} type="button" onClick={showReferencias}>AGREGAR REFERENCIA</button></td>
                                        <td></td>
                                    </tr>}

                                    {Estado.Datos.Procesos.find((x: any) => x.Descripcion === 'CAPTURA AVALES' && x.Validado) && <tr>
                                        <td style={{ paddingTop: '14px' }}><FaCheckCircle color='#58db83' size={20} /></td>
                                        <td><button className="btn btn-success" style={{ width: '100%', textAlign: 'center', paddingLeft: '0px', paddingRight: '0px' }} type="button" onClick={() => { }}>AGREGAR AVAL</button></td>
                                        <td></td>
                                    </tr>}
                                    {Estado.Datos.Procesos.find((x: any) => x.Descripcion === 'CAPTURA AVALES' && !x.Validado) && <tr>
                                        <td style={{ paddingTop: '14px' }}><FaClock color='gray' size={20} /></td>
                                        <td><button className="btn btn-primary" style={{ width: '100%', textAlign: 'center', paddingLeft: '0px', paddingRight: '0px' }} type="button" onClick={() => showAvales(0)}>AGREGAR AVAL</button></td>
                                        <td></td>
                                    </tr>}

                                    {Estado.Datos.Procesos.find((x: any) => x.Descripcion === 'DOCUMENTACION AVALES' && x.Validado) && <tr>
                                        <td style={{ paddingTop: '14px' }}><FaCheckCircle color='#58db83' size={20} /></td>
                                        <td><button className="btn btn-success" style={{ width: '100%', textAlign: 'center', paddingLeft: '0px', paddingRight: '0px' }} type="button" onClick={() => { }}>DOCUMENTOS AVAL</button></td>
                                        <td></td>
                                    </tr>}
                                    {Estado.Datos.Procesos.find((x: any) => x.Descripcion === 'DOCUMENTACION AVALES' && !x.Validado) && <tr>
                                        <td style={{ paddingTop: '14px' }}><FaClock color='gray' size={20} /></td>
                                        <td><button className="btn btn-primary" style={{ width: '100%', textAlign: 'center', paddingLeft: '0px', paddingRight: '0px' }} type="button" onClick={() => setState(e => ({ ...e, FormaAgregarDA: true }))}>DOCUMENTOS AVAL</button></td>
                                        <td></td>
                                    </tr>}

                                    {Estado.Datos.Procesos.find((x: any) => x.Descripcion === 'REFERENCIAS AVALES' && x.Validado) && <tr>
                                        <td style={{ paddingTop: '14px' }}><FaCheckCircle color='#58db83' size={20} /></td>
                                        <td><button className="btn btn-success" style={{ width: '100%', textAlign: 'center', paddingLeft: '0px', paddingRight: '0px' }} type="button" onClick={() => { }}>REFERENCIAS AVAL</button></td>
                                        <td></td>
                                    </tr>}
                                    {Estado.Datos.Procesos.find((x: any) => x.Descripcion === 'REFERENCIAS AVALES' && !x.Validado) && <tr>
                                        <td style={{ paddingTop: '14px' }}><FaClock color='gray' size={20} /></td>
                                        <td><button className="btn btn-primary" style={{ width: '100%', textAlign: 'center', paddingLeft: '0px', paddingRight: '0px' }} type="button" onClick={() => setState(e => ({ ...e, FormaAgregarRA: true }))}>REFERENCIAS AVAL</button></td>
                                        <td></td>
                                    </tr>}
                                </tbody>
                            </table>}
                        </Card.Body>
                    </Card>
                    {Estado.Datos.DatosProspectos?.BuroInternoEstatus &&
                        <Card>

                            <Card.Body>
                                <div className='notificacion' style={{ width: '100%', textAlign: 'center' }}>
                                    <button disabled={false} className="btn btn-info" type="reset"
                                    >ESTATUS BURO: {Estado.Datos.DatosProspectos?.BuroInternoEstatus}</button>
                                </div>
                            </Card.Body>
                        </Card>}
                    {Estado.Validado && <Card>
                        <Card.Body>
                            <div data-tip data-for={`l_${id_int}`} className='notificacion' style={{ width: '100%', textAlign: 'center' }}>
                                {<span className="badge">{[]}</span>}
                                <button disabled={!Estado.Validado} className="btn btn-primary" type="button"
                                    onClick={() => FNMostrarMensajes()}
                                ><FaEnvelopeOpen color='#D0D0D0' size={15} /> VER MENSAJES</button>
                            </div>
                            <ReactTooltip id={`l_${id_int}`} type="info" effect="solid">
                                {!Estado.Validado ? 'DISPONIBLE DESPUES DE VALIDAR PROSPECTO' : `VER MENSAJES SOBRE EL PROSPECTO ${Estado.Datos.DatosGenerales?.NombreCompleto}`}
                            </ReactTooltip>
                        </Card.Body>
                    </Card>}
                    {Estado.Datos.Procesos.find((x: any) => x.Descripcion.includes('DICTAMEN') && x.Validado) && permisoDocumentacion && <Card>
                        <Card.Body>
                            <div className="text-start">
                                <span className={'mt-2 mb-0 fw-bold'}><FaCircle color="green" title="Activo" /> DOCUMENTOS ACTIVACIÓN</span>
                            </div>
                            <table className='table table-striped' style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '15%' }}></th>
                                        <th style={{ width: '40%' }}>Documento</th>
                                        <th style={{ width: '25%' }}>Subir</th>
                                        <th style={{ width: '20%' }}>Ver</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ verticalAlign: 'middle' }}>
                                        <td style={{}}>
                                            {Estado.Datos.DatosGenerales?.Contrato && <FaCheckCircle color='green' size={20} />}
                                            {Estado.Datos.DatosGenerales?.Contrato === null && <FaClock color='gray' size={20} />}
                                        </td>
                                        <td style={{ width: '1px', fontSize: '.9em' }}>CONTRATO<br />FIRMADO</td>
                                         <td style={{ marginTop: '5px', marginBottom: '5px' }}><button className="btn btn-primary" style={{ width: '100%', textAlign: 'center', paddingLeft: '0px', paddingRight: '0px' }}  type="button" onClick={() => fnSubirDoc('CONTRATO', 1)}><FaUpload color='white' size={17} /></button></td>
                                        <td>
                                            {Estado.Datos.DatosGenerales?.Contrato && <button className="btn btn-link" style={{ width: '100%', textAlign: 'center', paddingLeft: '0px', paddingRight: '0px' }} type="button" onClick={() => fnVerDoc(Estado.Datos.DatosGenerales?.Contrato ?? '', 'CONTRATO')}><FaEye color='gray' size={17} /></button>}
                                            {Estado.Datos.DatosGenerales?.Contrato === null && <div className="text-center"><i style={{ fontSize: '.8em' }}>Pendiete</i></div>}
                                        </td>
                                    </tr>
                                    <tr style={{ verticalAlign: 'middle' }}>
                                        <td style={{}}>
                                            {Estado.Datos.DatosGenerales?.Pagare && <FaCheckCircle color='green' size={20} />}
                                            {Estado.Datos.DatosGenerales?.Pagare === null && <FaClock color='gray' size={20} />}
                                        </td>
                                        <td style={{ width: '1px', fontSize: '.9em' }}>PAGARE<br />FRENTE</td>
                                        <td style={{ marginTop: '5px', marginBottom: '5px' }}><button className="btn btn-primary" style={{ width: '100%', textAlign: 'center', paddingLeft: '0px', paddingRight: '0px' }}  type="button" onClick={() => fnSubirDoc('PAGARE', 2)}><FaUpload color='white' size={17} /></button></td>
                                        <td>
                                            {Estado.Datos.DatosGenerales?.Pagare && <button className="btn btn-link" style={{ width: '100%', textAlign: 'center', paddingLeft: '0px', paddingRight: '0px' }} type="button" onClick={() => fnVerDoc(Estado.Datos.DatosGenerales?.Pagare ?? '', 'PAGARE')}><FaEye color='gray' size={17} /></button>}
                                            {Estado.Datos.DatosGenerales?.Pagare === null && <div className="text-center"><i style={{ fontSize: '.8em' }}>Pendiete</i></div>}
                                        </td>
                                    </tr>
                                    <tr style={{ verticalAlign: 'middle' }}>
                                        <td style={{}}>
                                            {Estado.Datos.DatosGenerales?.PagareReverso && <FaCheckCircle color='green' size={20} />}
                                            {Estado.Datos.DatosGenerales?.PagareReverso === null && <FaClock color='gray' size={20} />}
                                        </td>
                                        <td style={{ width: '1px', fontSize: '.9em' }}>PAGARE<br />REVERSO</td>
                                        <td style={{ marginTop: '5px', marginBottom: '5px' }}><button className="btn btn-primary" style={{ width: '100%', textAlign: 'center', paddingLeft: '0px', paddingRight: '0px' }}   type="button" onClick={() => fnSubirDoc('PAGARE REVERESO', 3)}><FaUpload color='white' size={17} /></button></td>
                                        <td>
                                            {Estado.Datos.DatosGenerales?.PagareReverso && <button className="btn btn-link" style={{ width: '100%', textAlign: 'center', paddingLeft: '0px', paddingRight: '0px' }} type="button" onClick={() => fnVerDoc(Estado.Datos.DatosGenerales?.PagareReverso ?? '', 'PAGARE REVERSO')}><FaEye color='gray' size={17} /></button>}
                                            {Estado.Datos.DatosGenerales?.PagareReverso === null && <div className="text-center"><i style={{ fontSize: '.8em' }}>Pendiete</i></div>}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="text-end">
                                <a style={{ color: 'blue' }} href='/CONTRATO2020.pdf' download><i> DESCARGAR CONTRATO </i> <FaDownload color='blue' size={17} /></a>
                                {/* {loading && <Spinner />}
                                {!loading && <button className="btn btn-link" style={{ width: '100%', textAlign: 'end', paddingLeft: '0px', paddingRight: '0px' }} type="button" onClick={() => download()}><i> DESCARGAR CONTRATO </i><FaDownload color='blue' size={17} /></button>} */}
                            </div>
                        </Card.Body>
                    </Card>}
                </div>
                <div className="col-sm-12 col-md-12 col-lg-9 text-center">
                    <Card>
                        <Card.Body>
                            {Estado.CargandoPerfil && <Spinner />}
                            {Estado.ErrorPerfil && <span>Error al cargar los datos del Perfil del Prospecto...</span>}
                            {Estado.Datos.DatosProspectos?.Activo == false ?
                                <button  style={{marginBottom:'5px'}} disabled={false} className="btn btn-danger" type="reset"
                                >ESTATUS SOCIA: {Estado.Datos.DatosProspectos?.ActivoDesc}</button> : ''
                            }
                            {(Estado.Datos.DatosGenerales !== undefined && Estado.Datos.DatosSocioeconomicos !== undefined) && <PerfilProspecto oidc={props.oidc} ui={props.ui} Validado={Estado.Validado} Editar={!Estado.Validado} DatosGenerales={Estado.Datos.DatosGenerales} DatosSocioeconomicos={Estado.Datos.DatosSocioeconomicos} Vehiculos={Estado.Datos.Vehiculos} Experiencia={Estado.Datos.Experiencia} Referencias={Estado.Datos.Referencias} Documentos={Estado.Datos.Documentos} Avales={Estado.Datos.Avales} Procesos={Estado.Datos.Procesos} Id={id_int} showDocumentos={showDocumentos} showReferencias={showReferencias} showAvales={showAvales} showDatosEconomicos={showDatosEconomicos} showDatos={showDatos} />}
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {state.FormaAgregar &&
                <AgregarConPersona oidc={props.oidc} cbActualizar={() => { }} cbGuardar={cbAgregar} fnCancelar={fnCancelar} mostrar={state.FormaAgregar} Item={Estado.Datos.DatosGenerales} />
            }
            {state.FormaAgregarDE &&
                <AgregarCaptura oidc={props.oidc} Id={id_int} cbActualizar={() => { }} cbGuardar={cbAgregarDE} fnCancelar={fnCancelarDE} mostrar={state.FormaAgregarDE} Item={Estado.Datos.DatosSocioeconomicos} Vehiculos={Estado.Datos.Vehiculos} Experiencia={Estado.Datos.Experiencia} />
            }
            {state.FormaAgregarD &&
                <AgregarDocumento oidc={props.oidc} Id={id_int} cbActualizar={() => { }} cbGuardar={cbAgregarD} fnCancelar={fnCancelarD} mostrar={state.FormaAgregarD} Procesos={Estado.Datos.Procesos} Prospecto={Estado.Datos.DatosProspectos} />
            }
            {state.FormaAgregarA &&
                <AgregarAval oidc={props.oidc} Id={id_int} cbActualizar={() => { }} cbGuardar={cbAgregarA} fnCancelar={fnCancelarA} mostrar={state.FormaAgregarA} Item={state.avalMuestra} />
            }
            {state.FormaAgregarDA &&
                <AgregarDocumentoAval oidc={props.oidc} Id={id_int} cbActualizar={() => { }} cbGuardar={cbAgregarDA} fnCancelar={fnCancelarDA} mostrar={state.FormaAgregarDA} />
            }
            {state.FormaAgregarR &&
                <AgregarReferencia oidc={props.oidc} Id={id_int} TipoPersona={1} cbActualizar={() => { }} cbGuardar={cbAgregarR} fnCancelar={fnCancelarR} mostrar={state.FormaAgregarR} />
            }
            {state.FormaAgregarRA &&
                <AgregarReferenciaAval oidc={props.oidc} Id={id_int} cbActualizar={() => { }} cbGuardar={cbAgregarRA} fnCancelar={fnCancelarRA} mostrar={state.FormaAgregarRA} />
            }
            {state.VerMensajes && <ModalWin open={state.VerMensajes} center large>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>MENSAJES PROSPECTO <br /> {id_int} {state.NombreProspecto}</h5>
                    <button type="button" className="delete" onClick={() => {
                        fnCancelarM()
                    }} />
                </ModalWin.Header>
                <ModalWin.Body>
                    <LogMensajes oidc={props.oidc} Notificaciones={state.MensajesProspecto} FNNotificaciones={() => { }} ProspectoID={id_int} />
                </ModalWin.Body>
            </ModalWin>}
            {state.VerDoc && <ModalWin open={state.VerDoc} center large>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>{state.documentoNombre}</h5>
                    <button type="button" className="delete" onClick={() => {
                        fnCancelarVerDoc()
                    }} />
                </ModalWin.Header>
                <ModalWin.Body>
                    <VerDoc DocumentoPath={state.documentoPath} fnCancelar={fnCancelarVerDoc} />
                </ModalWin.Body>
            </ModalWin>}
            {state.SubirDoc && <ModalWin open={state.SubirDoc} center large>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>{state.documentoNombre}</h5>
                    <button type="button" className="delete" onClick={() => {
                        fnCancelarVerDoc()
                    }} />
                </ModalWin.Header>
                <ModalWin.Body>
                    {<CFormD
                        oidc={props.oidc}
                        initialValues={state.Form}
                        prospectoID={id_int}
                        documentoLabel={state.documentoLabel}
                        fnCancelarVerDoc={fnCancelarVerDoc}
                        ConsultarProcesos={ConsultarProcesos}
                        ConsultarPersona={ConsultarPersona}
                    />}
                </ModalWin.Body>
            </ModalWin>}
        </>
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(Prospecto);