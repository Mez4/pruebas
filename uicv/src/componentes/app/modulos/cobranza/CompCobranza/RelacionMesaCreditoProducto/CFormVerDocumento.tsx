import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { Acordion, Card, ImgViewer, Spinner } from '../../../../../global'
//import * as Funciones from './Funciones'
import { toast } from 'react-toastify'
//import { AdvertenciaDoc } from './AdvertenciaDoc'
import { FaPlus, FaSearch, FaCheckCircle, FaClock, FaTimesCircle, FaUser, FaSignature, FaExclamationTriangle } from 'react-icons/fa'

import * as Funciones from './Funciones'

import { DBConfia_Cobranza } from '../../../../../../interfaces_db/DBConfia/Cobranza'

import moment from 'moment'
import { FormaDatosGenerales } from '../../../../../formas/cobranza'
//import { DBConfia_Catalogos } from '../../../../../../interfaces_db/DBConfia/Catalogos'

type CatalogosType = {
    oidc: IOidc,
    initialValues: { PersonasDocID: number, PersonaID: number, TiposDocumentoID: number, RutaDoc: string, Fecha: string, Activo: boolean, NomDoc: string, PersonaIDRegistro: number, UsuarioIDRegistro: number, Clave: string }
    Id?: number
}

type EstadoTipo = {
    CargandoPerfil: boolean,
    ErrorPerfil: boolean,
    DatosGenerales?: DBConfia_Cobranza.IDatosGenerales_VW,
    Firma: string,
    doc: string,
    docLabel: string,
    ine: string,
    ineReveso: string,
}

export const CFormVerDocumento = (props: CatalogosType) => {
    // Controll our mounted state
    const [loading, setLoading] = React.useState(false)
    let isMounted = React.useRef(true)
    let Docs: any[] = []

    const [estado, setEstado] = React.useState<EstadoTipo>({
        CargandoPerfil: true,
        ErrorPerfil: false,
        DatosGenerales: undefined,
        Firma: '',

        doc: '',
        docLabel: '',
        ine: '',
        ineReveso: '',
    })

    const DatosDefecto = { Nota: '' }
    const [state, setState] = React.useState({
        Cargando: true,
        Error: false,
        Form: {
            src: ''
            , AdvertenciaDoc: false,
            Datos: DatosDefecto,
            Nota: ''
        },
        AdvertenciaDoc: false,
        DocumentoID: 0,
        Filtro: 0,
        Docs,
    })


    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetVerDocumentos(props.oidc, props.initialValues.PersonasDocID)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Form: { ...s.Form, src: respuesta.src } }))
                }
            })
            .catch((error) => {
                console.log("###e", error)
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const ConsultarPersona = async () => {
        setState(e => ({ ...e, CargandoPerfil: true }))
        Funciones.FNObtenerPersona(props.oidc, props.initialValues.PersonaID)
            .then((resultado: any) => {
                if (isMounted)
                    setEstado(e => ({
                        ...e, CargandoPerfil: false, ErrorPerfil: false,
                        DatosGenerales: resultado.DatosGenerales,
                        Firma: resultado.Firma,
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
                    setState(e => ({ ...e, CargandoPerfil: false, ErrorPerfil: true }))
            })
    }

    const ConsultaIne = async () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetIne(props.oidc, props.initialValues.PersonaID, 'D001')
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setEstado(s => ({ ...s, ine: respuesta.src }))
                }
            })
            .catch((error) => {
                console.log("###e", error)
                if (isMounted.current === true) {
                    setEstado(s => ({ ...s, ine: `Error: ${error}` }))
                }
            })
        Funciones.FNGetIne(props.oidc, props.initialValues.PersonaID, 'D008')
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setEstado(s => ({ ...s, ineReveso: respuesta.src }))
                }
            })
            .catch((error) => {
                console.log("###e", error)
                if (isMounted.current === true) {
                    setEstado(s => ({ ...s, ineReveso: `Error: ${error}` }))
                }
            })
    }

    // On use effect
    React.useEffect(() => {
        if (props.initialValues.PersonasDocID > 0) {
            console.log('DOS')
            FNGetLocal()
            ConsultarPersona()
            if (props.initialValues.Clave === 'D001') {
                ConsultaIne()
            }
        }
    }, [props.initialValues.PersonasDocID])

    React.useEffect(() => {
        console.log('DOS')
        setEstado(s => ({ ...s, DatosGenerales: s.DatosGenerales, ine: s.ine }))
    }, [estado.DatosGenerales, estado.ine])

    return (
        <div className="row">
            <div className="col-md-6">
                {estado.CargandoPerfil && <Spinner />}
                {estado.ErrorPerfil && <span>Error al cargar los datos del Prospecto...</span>}
                {(!estado.CargandoPerfil && !estado.ErrorPerfil) && <div className='row'>
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <Acordion TabSelecionado="General">
                            <Acordion.Tab Identificador="General" Titulo={<React.Fragment><FaUser />&nbsp;DATOS CAPTURADOS</React.Fragment>}>
                                <>
                                    <div className="text-start">
                                        <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Nombre:</td>
                                                    <td>{estado.DatosGenerales?.NombreCompleto}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Fecha Nacimiento:</td>
                                                    <td>{moment(estado.DatosGenerales?.FechaNacimiento).format('DD-MM-YYYY')}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sexo:</td>
                                                    <td>{estado.DatosGenerales?.Sexo}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>CURP: </td>
                                                    <td>{estado.DatosGenerales?.CURP}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>EDO.CIVIl: </td>
                                                    <td>{estado.DatosGenerales?.EstadoCivil}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tel.Movil:</td>
                                                    <td>{estado.DatosGenerales?.TelefonoMovil}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>E-Mail:</td>
                                                    <td>{estado.DatosGenerales?.CorreoElectronico}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Lugar Nacimiento:</td>
                                                    <td>{estado.DatosGenerales?.LugarNacimiento}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dirección:</td>
                                                    <td>{estado.DatosGenerales?.NombreVialidad}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Telefono Fijo:</td>
                                                    <td>{estado.DatosGenerales?.TelefonoDomicilio}</td>
                                                </tr>
                                                {/* {estado.DatosSocioeconomicos?.TipoVivienda &&
                                                    <tr>
                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>RFC:</td>
                                                        <td>{estado.DatosSocioeconomicos?.RFC}</td>
                                                    </tr>
                                                } */}
                                            </tbody>
                                        </table>
                                    </div>
                                    <hr />

                                </>
                            </Acordion.Tab>
                        </Acordion>
                        <Acordion TabSelecionado="Firma">
                            <Acordion.Tab Identificador="Firma" Titulo={<React.Fragment><FaSignature />&nbsp;FIRMA</React.Fragment>}>
                                <div className='text-center'>
                                    {estado.Firma === '' && <div>SIN DOCUMENTO FIRMA</div>}
                                    <ImgViewer imgSrc={estado.Firma} noToolbar={false} zIndex={1000} maxWidth={250} maxHeight={250} />
                                </div>
                            </Acordion.Tab>
                        </Acordion>
                    </div>
                </div>}
            </div>
            <div className="col-md-6">
                {props.initialValues.Clave != 'D001' &&
                    <Acordion TabSelecionado="Documentos">
                        <Acordion.Tab Identificador="Documentos" Titulo={<React.Fragment><FaUser />&nbsp;DOCUMENTO</React.Fragment>}>
                            <>
                                <div>
                                    <div className="row">
                                        <div className="col-12 text-center" style={{ marginBottom: '1em' }}>
                                            {state.Cargando && <Spinner />}
                                            {state.Error && <span>Error al cargar los datos...</span>}
                                            {!state.Cargando && !state.Error &&
                                                <div className="lightbox" style={{ width: '100%', height: '330px', backgroundColor: 'white' }}>
                                                    <figure className="figure">
                                                        <figcaption className="figure-caption">{props.initialValues.NomDoc}</figcaption>
                                                        <ImgViewer imgSrc={state.Form.src} noToolbar={false} zIndex={1000} maxWidth={500} maxHeight={330} />
                                                    </figure>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </>
                        </Acordion.Tab>
                    </Acordion>
                }

                {/* {props.initialValues.NomDoc.toUpperCase().includes('FIRMA') && */}
                {props.initialValues.Clave === 'D001' &&
                    <Acordion TabSelecionado="Documentos">
                        <Acordion.Tab Identificador="Documentos" Titulo={<React.Fragment><FaUser />&nbsp;DOCUMENTOS</React.Fragment>}>
                            <>
                                <div>
                                    <div className="row">
                                        <div className="col-12 text-center" style={{ marginBottom: '1em' }}>
                                            <div className="lightbox" style={{ width: '100%', height: '330px', backgroundColor: 'white' }}>
                                                <figure className="figure">
                                                    <figcaption className="figure-caption">{estado.docLabel}</figcaption>
                                                    <ImgViewer imgSrc={estado.doc} noToolbar={false} zIndex={1000} maxWidth={500} maxHeight={330} />
                                                </figure>
                                            </div>
                                        </div>
                                        <div className="col-3 p-1">
                                            <figure className="figure">
                                                <figcaption className="figure-caption">FIRMA</figcaption>
                                                <div className='border sqImage'>
                                                    {/* {state.Docs.length === 0 && estado.Firma === '' && <div><Spinner /></div>} */}
                                                    {estado.Firma === '' && <div className='text-center' style={{ marginTop: '1em' }}><FaExclamationTriangle /> <br /> <span className='badge  bg-dark'>NO ENCONTRADO</span></div>}
                                                    <img
                                                        style={{ cursor: 'pointer' }}
                                                        src={estado.Firma} className="w-100"
                                                        onClick={() => setEstado(e => ({ ...e, doc: e.Firma, docLabel: 'FIRMA TITULAR' }))}
                                                    />
                                                </div>
                                            </figure>
                                        </div>
                                        <div className="col-3 p-1">
                                            <figure className="figure">
                                                <figcaption className="figure-caption">IDENTIFICACIÓN</figcaption>
                                                <div className='border sqImage'>
                                                    {/* {state.Docs.length === 0 && estado.ine === '' && <div><Spinner /></div>} */}
                                                    {estado.ine === '' && <div className='text-center' style={{ marginTop: '1em' }}><FaExclamationTriangle /> <br /> <span className='badge'>NO ENCONTRADO</span></div>}
                                                    <img
                                                        style={{ cursor: 'pointer' }}
                                                        src={estado.ine} className="w-100"
                                                        onClick={() => setEstado(e => ({ ...e, doc: e.ine, docLabel: 'IDENTIFICACIÓN' }))}
                                                    />
                                                </div>
                                            </figure>
                                        </div>
                                        <div className="col-3 p-1">
                                            <figure className="figure">
                                                <figcaption className="figure-caption">IDENTIF. REVERSO</figcaption>
                                                <div className='border sqImage'>
                                                    {/* {estado.ineReveso === '' && <div><Spinner /></div>} */}
                                                    {estado.ineReveso === '' && <div className='text-center' style={{ marginTop: '1em' }}><FaExclamationTriangle /> <br /> <span className='badge  bg-dark'>NO ENCONTRADO</span></div>}
                                                    <img
                                                        style={{ cursor: 'pointer' }}
                                                        src={estado.ineReveso} className="w-100"
                                                        onClick={() => setEstado(e => ({ ...e, doc: e.ineReveso, docLabel: 'IDENTIFICACIÓN REVERSO' }))}
                                                    />
                                                </div>
                                            </figure>
                                        </div>
                                    </div>
                                </div>
                            </>
                        </Acordion.Tab>
                    </Acordion>
                }
            </div>
        </div >

    )
}
