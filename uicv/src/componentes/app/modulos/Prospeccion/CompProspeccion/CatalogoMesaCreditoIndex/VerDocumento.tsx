import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { Acordion, Card, ImgViewer, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { toast } from 'react-toastify'
import { AdvertenciaDoc } from './AdvertenciaDoc'
import { FaPlus, FaSearch, FaCheckCircle, FaClock, FaTimesCircle, FaUser, FaSignature, FaExclamationTriangle } from 'react-icons/fa'
import * as FuncionesProspecto from '../Prospectos/Funciones'
import * as FuncionesDoc from '../DocsProspecto/Funciones'
import { DBConfia_Prospeccion } from '../../../../../../interfaces_db/DBConfia/Prospeccion'
import moment from 'moment'

type CatalogosType = {
    oidc: IOidc,
    Id?: number
    DocumentoID: number,
    fnCancelar(): any,
    Estado: Number,
    FNGetLocal(): any,
    NombreDocumento: string,
}

type EstadoTipo = {
    CargandoPerfil: boolean,
    ErrorPerfil: boolean,
    DatosGenerales?: DBConfia_Prospeccion.IProspectosDatosGenereles_VW,
    DatosSocioeconomicos?: DBConfia_Prospeccion.IProspectosDatosSocioeconomicos_VW,
    Vehiculos: DBConfia_Prospeccion.IRelacionAutoMoto[],
    Experiencia: DBConfia_Prospeccion.IProspectosExperienciaVentas_VW[],
    Firma: string,

    doc: string,
    docLabel: string,
    ine: string,
    ineReveso: string,
}

const VerDocumento = (props: CatalogosType) => {
    // Controll our mounted state
    const [loading, setLoading] = React.useState(false)
    let isMounted = React.useRef(true)
    let Docs: any[] = []

    const [estado, setEstado] = React.useState<EstadoTipo>({
        CargandoPerfil: true,
        ErrorPerfil: false,
        DatosGenerales: undefined,
        DatosSocioeconomicos: undefined,
        Vehiculos: [],
        Experiencia: [],
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
            Nota: '',
            CatalogoTipoDocumentoID: 0
        },
        AdvertenciaDoc: false,
        DocumentoID: 0,
        Filtro: 0,
        Docs,
    })

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetVerDocumentos(props.oidc, props.DocumentoID)
            .then((respuesta: any) => {
                console.log(props.DocumentoID)
                if (isMounted.current === true) {
                    // console.log("###", respuesta);
                    // console.log("###", respuesta.src);
                    console.log(respuesta.Nota);
                    setState(s => ({ ...s, Cargando: false, Error: false, Form: { ...s.Form, src: respuesta.src, Nota: respuesta.Nota, CatalogoTipoDocumentoID: respuesta.CatalogoTipoDocumentoID } }))
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
        FuncionesProspecto.FNObtenerPersona(props.oidc, props.Id)
            .then((resultado: any) => {
                if (isMounted)
                    setEstado(e => ({
                        ...e, CargandoPerfil: false, ErrorPerfil: false,
                        DatosGenerales: resultado.DatosGenerales,
                        DatosSocioeconomicos: resultado.DatosSocioeconomicos,
                        Firma: resultado.Firma,

                        doc: resultado.Firma, docLabel: 'FIRMA TITULAR'
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
        Docs = await FuncionesDoc.FNGetDocsByProspectoID(props.oidc, props.Id) as any[]
        console.log(Docs)
        setState(s => ({ ...s, Docs: Docs }))
        Docs.forEach(e => {
            if (['D001', 'D008'].includes(e.Clave)) {
                console.log(e.Clave)
                FuncionesDoc.FNGetDocsByDocumentoID(props.oidc, e.DocumentoID)
                    .then((respuesta: any) => {
                        if (isMounted.current === true) {
                            if (e.Clave === 'D001') setEstado(s => ({ ...s, ine: respuesta.src }))
                            if (e.Clave === 'D008') setEstado(s => ({ ...s, ineReveso: respuesta.src }))
                        }
                    })
                    .catch((error) => {
                        if (isMounted.current === true) {
                            toast.error(`${e.Clave}- ${e.NombreDocumento} Error: ${error}`)
                            if (e.Clave === 'D001') setEstado(s => ({ ...s, ine: `Error: ${error}` }))
                            if (e.Clave === 'D008') setEstado(s => ({ ...s, ineReveso: `Error: ${error}` }))
                        }
                    })
            }
        });
    }

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        ConsultarPersona()
        if (props.NombreDocumento.toUpperCase().includes('FIRMA'))
            ConsultaIne()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])


    const fnDocumentosAutoriza = (Item: any) => setState(s => ({ ...s, AdvertenciaDoc: true, DocumentoID: props.DocumentoID, Filtro: 1, Item }))
    const fnDocumentosRechaza = (Item: any) => setState(s => ({ ...s, AdvertenciaDoc: true, DocumentoID: props.DocumentoID, Filtro: 0, Item }))
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form }, AdvertenciaDoc: false })

    return (
        <div className="row">
            <div className="col-md-12 text-end" style={{ marginBottom: '1em' }}>
                {props.Estado == 3 && <button onClick={() => fnDocumentosRechaza(props)} type="submit" className="ms-2 btn btn-warning waves-effect waves-light">RECHAZAR DOCUMENTO</button>}
                {props.Estado == 3 && <button onClick={() => fnDocumentosAutoriza(props)} type="submit" className="ms-2 btn btn-success waves-effect waves-light">VALIDAR DOCUMENTO</button>}
            </div>
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
                                                    <td>{estado.DatosGenerales?.DireccionProspecto}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Telefono Fijo:</td>
                                                    <td>{estado.DatosGenerales?.TelefonoDomicilio}</td>
                                                </tr>
                                                {estado.DatosSocioeconomicos?.TipoVivienda &&
                                                    <tr>
                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>RFC:</td>
                                                        <td>{estado.DatosSocioeconomicos?.RFC}</td>
                                                    </tr>
                                                }
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
                {!props.NombreDocumento.toUpperCase().includes('FIRMA') &&
                    <Acordion TabSelecionado="Documentos">
                        <Acordion.Tab Identificador="Documentos" Titulo={<React.Fragment><FaUser />&nbsp;DOCUMENTO</React.Fragment>}>
                            <>
                                <div>
                                    <div className="row">
                                        <div className="col-12 text-center" style={{ marginBottom: '1em' }}>
                                            {state.Cargando && <Spinner />}
                                            {state.Error && <span>Error al cargar los datos...</span>}
                                            {!state.Cargando && !state.Error &&
                                                <div className="lightbox" style={{ width: '100%', height: '380px', backgroundColor: 'white' }}>
                                                    <figure className="figure">
                                                        <figcaption className="figure-caption">{props.NombreDocumento}</figcaption>
                                                        {state.Form.src.includes("pdf") ? <object data={state.Form.src} type='application/pdf' width={'100%'} height={'380px'} /> : <ImgViewer imgSrc={state.Form.src} noToolbar={false} zIndex={1000} maxWidth={'100%'} maxHeight={330} />}
                                                    </figure>
                                                </div>
                                            }
                                        </div>
                                        <div className="col-12 p-1">
                                            {props.Estado == 1 && <FaCheckCircle color='green' className="col-md-12" size={45} />}
                                            {props.Estado == 2 && <FaTimesCircle color='red' className="col-md-12" size={45} />}
                                            {props.Estado == 2 && <label style={{ width: '100%', textAlign: 'center', color: 'black' }}> <b>NOTA:</b> {state.Form.Nota}</label>}
                                        </div>
                                    </div>
                                </div>
                            </>
                        </Acordion.Tab>
                    </Acordion>
                }
                {props.NombreDocumento.toUpperCase().includes('FIRMA') &&
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
                                                    {state.Docs.length === 0 && estado.Firma === '' && <div><Spinner /></div>}
                                                    {state.Docs.length > 0 && estado.Firma === '' && <div className='text-center' style={{ marginTop: '1em' }}><FaExclamationTriangle /> <br /> <span className='badge  bg-dark'>NO ENCONTRADO</span></div>}
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
                                                    {state.Docs.length === 0 && estado.ine === '' && <div><Spinner /></div>}
                                                    {state.Docs.length > 0 && estado.ine === '' && <div className='text-center' style={{ marginTop: '1em' }}><FaExclamationTriangle /> <br /> <span className='badge'>NO ENCONTRADO</span></div>}
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
                                                    {state.Docs.length === 0 && estado.ineReveso === '' && <div><Spinner /></div>}
                                                    {state.Docs.length > 0 && estado.ineReveso === '' && <div className='text-center' style={{ marginTop: '1em' }}><FaExclamationTriangle /> <br /> <span className='badge  bg-dark'>NO ENCONTRADO</span></div>}
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

            {state.AdvertenciaDoc && <AdvertenciaDoc
                oidc={props.oidc}
                mostrar={state.AdvertenciaDoc}
                DocumentoID={state.DocumentoID}
                tipoDocumentoID={state.Form.CatalogoTipoDocumentoID}
                Filtro={state.Filtro}
                fnCancelar={fnCancelar}
                fnCancelar2={props.fnCancelar}
                FNGetLocal={props.FNGetLocal}
                initialValues={state.Form.Datos}
            />}
        </div >

    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(VerDocumento);