import React, { useRef } from 'react';
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, ActionSelect, Acordion, ImgViewer } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { FaBan, FaCheckCircle, FaClock, FaCommentDots, FaExclamationTriangle, FaFile, FaFilePdf, FaHouseUser, FaSignature, FaUser } from 'react-icons/fa'
import * as FuncionesProspecto from '../Prospectos/Funciones'
import * as FuncionesDoc from '../DocsProspecto/Funciones'
import { DBConfia_Prospeccion } from '../../../../../../interfaces_db/DBConfia/Prospeccion'
import moment from 'moment'
import { FormateoDinero } from '../../../../../../global/variables'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


type CFormConfirmarType = {
    oidc: IOidc
    ProspectoID: number,
    NombreProspecto: string,
    MostrarCFormBuroDeCredito: boolean,
    fnCancelar(): any,
    cbActualizar(item: any): any,
    optBuro: { value: number, label: string }[],
    BuroInternoEstatusID: number,
    RevisionBuro: number,
    EstatusConsultaBuroID: number,
    EstatusConsultaBuroDesc: string,
    item: any,
}

type EstadoTipo = {
    CargandoPerfil: boolean,
    ErrorPerfil: boolean,
    DatosGenerales?: DBConfia_Prospeccion.IProspectosDatosGenereles_VW,
    DatosSocioeconomicos?: DBConfia_Prospeccion.IProspectosDatosSocioeconomicos_VW,
    Vehiculos: DBConfia_Prospeccion.IRelacionAutoMoto[],
    Experiencia: DBConfia_Prospeccion.IProspectosExperienciaVentas_VW[],
    Firma: string
}

export const CFormBuroDeCredito = (props: CFormConfirmarType) => {
    // Loading
    const MySwal = withReactContent(Swal);
    const [loading, setLoading] = React.useState(false)

    const [estado, setEstado] = React.useState<EstadoTipo>({
        CargandoPerfil: true,
        ErrorPerfil: false,
        DatosGenerales: undefined,
        DatosSocioeconomicos: undefined,
        Vehiculos: [],
        Experiencia: [],
        Firma: ''
    })

    let isMounted = React.useRef(true)
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    let Docs: any[] = []
    let docsBuro: any[] = []

    const [state, setState] = React.useState({
        Datos,
        Procesos: [],
        DatosMostrar,
        Filtro: '',
        Cargando: false,
        Error: false,
        Item: undefined,
        DataLoaded: false,
        CFormDocumentos: false,
        CatalogoMesaCreditoIndex: false,
        Form:
        {
            Mostrar: false,
            Id: undefined,
        },
        BuroInternoEstatusID: 0,
        Modifica: false,
        doc: '',
        docLabel: '',
        ine: '',
        ineReveso: '',
        domicilio: '',
        autorizacion: '',
        Docs,
        srcBC: '',
        resultDesc: '',
        mostrarConfirm: false,
        Nota: '',
        optNotas: [],
        MostrarCancelar: false,
        docsBuro
    })

    const [mensajeID, setMensajeID] = React.useState(0)

    const ConsultarPersona = async () => {
        setState(e => ({ ...e, CargandoPerfil: true }))
        FuncionesProspecto.FNObtenerPersona(props.oidc, props.ProspectoID)
            .then((resultado: any) => {
                if (isMounted)
                    setEstado(e => ({
                        ...e, CargandoPerfil: false, ErrorPerfil: false,
                        DatosGenerales: resultado.DatosGenerales,
                        DatosSocioeconomicos: resultado.DatosSocioeconomicos,
                        Firma: resultado.Firma
                    }))
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

    const ConsultaDocs = async () => {
        Docs = await FuncionesDoc.FNGetDocsBuro(props.oidc, props.ProspectoID) as any[]
        console.log('oks', Docs)
        setState(s => ({ ...s, Docs: Docs }))
        let docsBuroAux: any[] = []
        Docs.forEach(async (e, i) => {
            let respuesta = await FuncionesDoc.FNGetDocsByDocumentoID(props.oidc, e.DocumentoID) as any
            let obj = { label: e.NombreDocumento, src: respuesta.src };
            docsBuroAux.push(obj)
            if (i === 0)
                setState(s => ({ ...s, doc: respuesta.src, docLabel: e.NombreDocumento, docsBuro: [...s.docsBuro, obj] }))
            else
                setState(s => ({ ...s, docsBuro: [...s.docsBuro, obj] }))
        });
    }

    const ConsultaBuro = async () => {
        setState(e => ({ ...e, CargandoPerfil: true }))
        FuncionesProspecto.FNObtenerBC(props.oidc, props.ProspectoID)
            .then((resultado: any) => {
                if (isMounted)
                    setState(e => ({
                        ...e,
                        srcBC: resultado.src,
                        resultDesc: resultado.result.ResultDesc
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

    const GetMensajesFijos = () => {
        setState(s => ({ ...s }))
        Funciones.FnGetMensajesFijos(props.oidc, { StatusProcesoID: 11, TipoDocumentoID: 0 })
            .then((respuesta: any) => {
                var mensajes = respuesta.map((valor: any) => {
                    var obj = { value: valor.Mensaje, label: valor.Mensaje };
                    return obj
                });

                setState(s => ({ ...s, optNotas: mensajes }))
            })
            .catch(() => {
                setState(s => ({ ...s, optNotas: [] }))
            })
    }

    const ConsultarProcesos = async () => {
        try {
            let procesos: any = await FuncionesProspecto.FNObtenerProceso(props.oidc, props.ProspectoID)
            //if (isMounted)
            console.log('???', procesos)
            setState(e => ({
                ...e,
                Procesos: procesos
            }))
        }
        catch (e) {

        }
    }

    const fnBuro = (BuroInternoEstatusID: number) => {
        setState(s => ({ ...s, BuroInternoEstatusID: BuroInternoEstatusID }))
    }

    const fnconfirmConsulta = () => {
        setState(s => ({ ...s, mostrarConfirm: true }))
    }

    const fnAgregarNota = () => setState(s => ({ ...s, Form: { ...s.Form, Mostrar: true } }))

    const fnAgregarNotaC = () => setState(s => ({ ...s, Form: { ...s.Form }, MostrarCancelar: true }))

    const fnCancelarConfirm = () => {
        setState(s => ({ ...s, mostrarConfirm: false }))
    }

    const fnCancelar = () => setState(s => ({ ...s, Form: { ...s.Form, Mostrar: false } }))

    const fnCancelarC = () => setState(s => ({ ...s, Form: { ...s.Form }, MostrarCancelar: false }))

    const FnNota = (Nota: string) => setState(s => ({ ...s, Nota: Nota }))

    const fnConsultar = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNConsultaBuro(props.oidc, props.ProspectoID)
            .then((resultado: any) => {
                if (isMounted) {
                    setState(s => ({ ...s, Cargando: false, mostrarConfirm: false }))
                    console.log(props.item)
                    props.item.EstatusConsultaBuroDesc = "PENDIENTE";
                    props.item.EstatusConsultaBuroID = 3;
                    props.cbActualizar(props.item)
                    props.fnCancelar()
                    toast.success(`${resultado.msj}`, { autoClose: 10000 })
                    toast.info(`${resultado.msjBDVR}`, { autoClose: 10000 })
                }
            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)

                if (isMounted)
                    setState(s => ({ ...s, Cargando: false }))
            })
    }


    
    const fnReConsultar = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNReConsultaBuro(props.oidc, props.ProspectoID)
            .then((resultado: any) => {
                if (isMounted) {
                    setState(s => ({ ...s, Cargando: false }))
                    toast.success(`EL BURO SE HA ENVIADO A CONSULTAR NUEVAMEMTE`)
                    props.fnCancelar()
                }
            })
            .catch((error: any) => {

                toast.error(`ERROR AL ENVIAR A CONSULTAR`)

            })
    }



    const fnEnviarMensaje = (Nota: string) => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNEviarMsjPromotorSucursal(props.oidc, { ProspectoID: props.ProspectoID, Nota, TipoMesa: 1, DesdeProceso: 1 })
            .then((resultado: any) => {
                setState(s => ({ ...s, Cargando: false, Form: { ...s.Form, Mostrar: false } }))
                toast.success('MENSAJE ENVIADO')
            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                setState(s => ({ ...s, Cargando: false }))
            })
    }

    const showPDF = (url : string ) => {
        if (url.includes("pdf")) {
            
            MySwal.fire({
                title: '<strong> Previsualización de PDF</strong>',
                html: 
                <div className='d-flex justify-content-center'>
                    
                    <object className='d-flex justify-content-center' data={url} type='application/pdf' width={'470px'} height={'700px'} />
                </div>,
                    showCloseButton : true,
                    showConfirmButton: false
                    
            });
            
        }else{
            toast.info("No hay archivos PDF")
        }
    }

    const fnCancelarProspecto = (Nota: string) => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNCancelarProspecto(props.oidc, { ProspectoID: props.ProspectoID, Nota, TipoMesa: 1, DesdeProceso: 1 })
            .then((resultado: any) => {
                setState(s => ({ ...s, Cargando: false, Form: { ...s.Form }, MostrarCancelar: false }))
                props.cbActualizar(resultado)
                props.fnCancelar()
                toast.success('PROSPECTO CANCELADO')
            })
            .catch((error: any) => {
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                setState(s => ({ ...s, Cargando: false, MostrarCancelar: false }))
            })
    }

    let validationShapeM = {
        Mensaje: Yup.string().required("Campo Obligatorio")
    }

    let validationShape = {
        BuroInternoEstatusID: Yup.number().moreThan(0, 'Seleccione un estatus de buro')
    }

    if (props.RevisionBuro == 1 || props.EstatusConsultaBuroID != 2) {
        state.Modifica = true
    }

    if (props.RevisionBuro != 1 && !state.Procesos.find((x: any) => x.Descripcion === 'REVISION BURO DE CREDITO' && x.DictamenObligatorio)) {
        state.Modifica = false
    }

    React.useEffect(() => {
        ConsultarPersona()
        ConsultarProcesos()
        if ([1, 4].includes(props.EstatusConsultaBuroID)) {
            ConsultaDocs()
            GetMensajesFijos()
        }
        if ([2, 4].includes(props.EstatusConsultaBuroID)) ConsultaBuro()
    }, [props.ProspectoID])

    return (
        <>
            <ModalWin open={props.MostrarCFormBuroDeCredito} center xlarge >
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>
                        BURO DE CREDITO<br /> PROSPECTO: &nbsp; {props.ProspectoID} &nbsp; {props.NombreProspecto}
                    </h5>
                   
                    <button type="button" className="delete" onClick={() => { props.fnCancelar() }} />
                </ModalWin.Header>
                <ModalWin.Body>

                    {([1, 4].includes(props.EstatusConsultaBuroID)) && <div className="row">
                        <div className="row justify-content-end" style={{ paddingBottom: '1em', marginLeft : '2px' }}>
                            {state.Cargando && <Spinner />}
                            {(!state.Cargando && [1].includes(props.EstatusConsultaBuroID)) && <button disabled={false} type="submit" className="col-12 col-md-3 mx-1 col-sm-12 my-1 btn btn-danger waves-effect waves-light" onClick={() => { fnAgregarNotaC() }}>CANCELAR PROSPECTO</button>}
                            {(!state.Cargando && [1].includes(props.EstatusConsultaBuroID)) && <button disabled={false} type="submit" className="col-12 col-md-3 mx-1 col-sm-12 btn my-1 btn-warning waves-effect waves-light" onClick={() => { fnAgregarNota() }}>AGREGAR NOTA</button>}
                            {(!state.Cargando && [1].includes(props.EstatusConsultaBuroID)) && <button disabled={false} type="submit" className="col-12 col-md-3 mx-1 col-sm-12 btn my-1 btn-primary waves-effect waves-light" onClick={() => { fnconfirmConsulta() }}>CONSULTAR BURO DE CREDITO</button>}
                            {(!state.Cargando && [4].includes(props.EstatusConsultaBuroID)) && <button disabled={false} type="submit" className="col-12 col-md-3 mx-1 col-sm-12 btn my-1 btn-danger waves-effect waves-light" onClick={() => { fnReConsultar() }}>RE-CONSULTAR BURO DE CREDITO</button>} 
                        </div>
                        
                        {<div className="col-md-12 text-center" style={{ paddingBottom: '1em' }}>
                            {state.Cargando && <Spinner />}
                            {(!state.Cargando && [4].includes(props.EstatusConsultaBuroID)) && <span style={{ color: 'red', fontWeight: 'bold', fontSize: '1.4em' }}>ERROR {state.resultDesc}</span>}
                        
                        </div>}
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
                                    <Acordion TabSelecionado='selectDocument'>
                                        <Acordion.Tab Identificador='selectDocument' Titulo={<><FaFile/>&nbsp;Documentos</>}>
                                            <div className='row'>
                                            {state.docsBuro.map((c: any, cId: number) =>
                                                    <div className="col-4  col-md-2 col-sm-4 col-lg-4 col-xl-4 col-xs-2">
                                                        <figure className="figure" >
                                                            <figcaption style={{fontSize: "10px",minHeight : "20px", maxHeight: "20px"}} className="my-5 fw-bold     figure-caption">{cId + 1}-{c.label}</figcaption>
                                                            <div className='border sqImage'>
                                                                {state.docsBuro.length === 0 && c.src === '' && <div><Spinner /></div>}
                                                                {state.docsBuro.length > 0 && c.src === '' && <div className='text-center' style={{ marginTop: '1em' }}><FaExclamationTriangle /> <br /> <span className='badge'>NO ENCONTRADO</span></div>}
                                                                {/* SE PREGUNTARA SI EN EL ARCHIVO CONTIENE LA PALABRA PDF */}
                                                                {!c.src.includes("pdf") ? (
                                                                <img
                                                                    style={{ cursor: 'pointer' }}
                                                                    src={c.src} className="w-100"
                                                                    onClick={() => setState(e => ({ ...e, doc: c.src, docLabel: c.label }))}
                                                                /> 
                                                                ): (
                                                                    <div className='d-flex justify-content-center '> 
                                                                        <button  onClick={() => showPDF(c.src)} type="button" className='btn btn-danger waves-effect waves-light'><FaFilePdf/>&nbsp;Ver PDF</button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            
                                                        </figure>
                                                    </div>
                                                )}          
                                            </div>
                                        </Acordion.Tab>
                                    </Acordion>
                                </div>
                            </div>}

                        </div>

                        <div className="col-md-6">
                            <Acordion TabSelecionado="Documentos">
                                <Acordion.Tab Identificador="Documentos" Titulo={<React.Fragment><FaUser />&nbsp;DOCUMENTOS</React.Fragment>}>
                                    <>
                                        <div>
                                            <div className="row">
                                                <div className="col-12 text-center" style={{ marginBottom: '1em' }}>
                                                    <div className="lightbox" style={{ width: '100%', minHeight: '500px', backgroundColor: 'white' }}>
                                                        <figure className="figure"   >
                                                            <figcaption className="figure-caption">{state.docLabel}</figcaption>
                                                                                                                        {/* <ImgViewer imgSrc={state.doc} noToolbar={false} zIndex={1000} maxWidth={500} maxHeight={330} /> */}
                                                            {state.doc.includes("pdf") ? 
                                                             <div style={{overflow: 'auto' }}>
                                                                
                                                                {/* <object data={state.doc}type="application/pdf" width="100%" height="740px"  /> */}
                                                                {/* <object data={state.doc}type="application/pdf" width="500px" height="740px"  />  */}
                                                            </div>
                                                            : 
                                                            // {state.doc.includes("pdf") ? <object data={state.doc} type='application/pdf' width={'100%'} height={'100%'} /> : 
                                                            <ImgViewer imgSrc={state.doc} noToolbar={false} zIndex={1006} maxWidth={'100%'} maxHeight={"100%"} />}
                                                        </figure>
                                                    </div>
                                                </div>
                                                {/* <div className="col-3 p-1">
                                                    <figure className="figure">
                                                        <figcaption className="figure-caption">IDENTIFICACIÓN</figcaption>
                                                        <div className='border sqImage'>
                                                            {state.Docs.length === 0 && state.ine === '' && <div><Spinner /></div>}
                                                            {state.Docs.length > 0 && state.ine === '' && <div className='text-center' style={{ marginTop: '1em' }}><FaExclamationTriangle /> <br /> <span className='badge'>NO ENCONTRADO</span></div>}
                                                            <img
                                                                style={{ cursor: 'pointer' }}
                                                                src={state.ine} className="w-100"
                                                                onClick={() => setState(e => ({ ...e, doc: e.ine, docLabel: 'IDENTIFICACIÓN' }))}
                                                            />
                                                        </div>
                                                    </figure>
                                                </div> */}
                                                
                                                {/* <div className="col-3 p-1">
                                                    <figure className="figure">
                                                        <figcaption className="figure-caption">IDENTIF. REVERSO</figcaption>
                                                        <div className='border sqImage'>
                                                            {state.Docs.length === 0 && state.ineReveso === '' && <div><Spinner /></div>}
                                                            {state.Docs.length > 0 && state.ineReveso === '' && <div className='text-center' style={{ marginTop: '1em' }}><FaExclamationTriangle /> <br /> <span className='badge  bg-dark'>NO ENCONTRADO</span></div>}
                                                            <img
                                                                style={{ cursor: 'pointer' }}
                                                                src={state.ineReveso} className="w-100"
                                                                onClick={() => setState(e => ({ ...e, doc: e.ineReveso, docLabel: 'IDENTIFICACIÓN REVERSO' }))}
                                                            />
                                                        </div>
                                                    </figure>
                                                </div>
                                                <div className="col-3 p-1">
                                                    <figure className="figure">
                                                        <figcaption className="figure-caption">C. DE DOMICILIO</figcaption>
                                                        <div className='border sqImage'>
                                                            {state.Docs.length === 0 && state.domicilio === '' && <div><Spinner /></div>}
                                                            {state.Docs.length > 0 && state.domicilio === '' && <div className='text-center' style={{ marginTop: '1em' }}><FaExclamationTriangle /> <br /> <span className='badge'>NO ENCONTRADO</span></div>}
                                                            <img
                                                                style={{ cursor: 'pointer' }}
                                                                src={state.domicilio} className="w-100"
                                                                onClick={() => setState(e => ({ ...e, doc: e.domicilio, docLabel: 'COMPROBANTE DE DOCMICILIO' }))}
                                                            />
                                                        </div>
                                                    </figure>
                                                </div>
                                                <div className="col-3 p-1">
                                                    <figure className="figure">
                                                        <figcaption className="figure-caption">A. DE BURO</figcaption>
                                                        <div className='border sqImage'>
                                                            {state.Docs.length === 0 && state.autorizacion === '' && <div><Spinner /></div>}
                                                            {state.Docs.length > 0 && state.autorizacion === '' && <div className='text-center' style={{ marginTop: '1em' }}><FaExclamationTriangle /> <br /> <span className='badge'>NO ENCONTRADO</span></div>}
                                                            <img
                                                                style={{ cursor: 'pointer' }}
                                                                src={state.autorizacion} className="w-100"
                                                                onClick={() => setState(e => ({ ...e, doc: e.autorizacion, docLabel: 'AUTORIZACIÓN DE BURO' }))}
                                                            />
                                                        </div>
                                                    </figure>
                                                </div> */}
                                            </div>
                                        </div>
                                    </>
                                </Acordion.Tab>
                            </Acordion>
                        </div>
                    </div>}
                    {([2, 3].includes(props.EstatusConsultaBuroID)) && <Formik
                        initialValues={{ BuroInternoEstatusID: 0 }}
                        enableReinitialize
                        validationSchema={Yup.object().shape(validationShape)}
                        onSubmit={(values: any) => {
                            setState(e => ({ ...e, Cargando: true }))
                            Funciones.FNupdateValidarBuroDeCredito(props.oidc, props.ProspectoID, state.BuroInternoEstatusID)
                                .then((respuesta: any) => {
                                    props.cbActualizar(respuesta)
                                    props.fnCancelar()
                                    toast.success(respuesta.msj)
                                })
                                .catch((error: any) => {
                                    if (error.response)
                                        toast.error(error.response.data)
                                    else if
                                        (error.request)
                                        toast.error('Error: SE PERDIO LA CONEXION A LA BASE DE DATOS')
                                    else
                                        toast.error('Error: SE PERDIO LA CONEXION A LA BASE DE DATOS')
                                    setState(e => ({ ...e, Cargando: false }))
                                })
                        }}
                    >

                        {([2, 3].includes(props.EstatusConsultaBuroID)) && <div className="row">
                            <div className="col-md-12 text-end" style={{ paddingBottom: '1em' }}>
                                {!state.Procesos.find((x: any) => x.Descripcion === 'REVISION BURO DE CREDITO' && x.DictamenObligatorio) && !state.srcBC && <button disabled={false} type="submit" className="ms-2 btn btn-primary waves-effect waves-light" onClick={() => { fnReConsultar() }}>RE-CONSULTAR BURO DE CREDITO</button>}
                            </div>
                            {!state.Procesos.find((x: any) => x.Descripcion === 'REVISION BURO DE CREDITO' && x.DictamenObligatorio) && <div className='text-end'><span style={{ color: 'green' }}>ES POSIBLE DICTAMINAR SIN LA REVISIÓN DEL PDF.</span><br /><span style={{ color: 'blue' }}>POR FAVOR CONFIRME LA SITUACIÓN CON SU ENCARGADO.</span></div>}
                            <div className="col-md-8">
                                <div style={{ textAlign: 'center' }}>
                                    <label>{props.EstatusConsultaBuroDesc}</label>
                                </div>
                                {props.EstatusConsultaBuroID === 3 && <div style={{ textAlign: 'center' }}>
                                    <FaClock size={100} />
                                    <div style={{ padding: '2em' }}>La consulta de buró esta en proceso, en unos minutos se indicará si la consuta fue exitosa o si hay algun error. Por favor espere.</div>
                                </div>}
                                {props.EstatusConsultaBuroID === 2 && <div style={{ width: '100%', height: '500px' }}>
                                    <iframe title={""} src={`data:application/pdf;base64,${state.srcBC}`} style={{ width: '100%', height: '100%' }} />
                                </div>}
                            </div>
                            <div className="col-md-4" style={{ backgroundColor: '#f9f9f9', padding: '1em' }}>
                                {props.EstatusConsultaBuroID === 3 && <div>
                                    <div style={{ padding: '0em' }}> <FaExclamationTriangle size={20} /> Una vez la cosulta sea EXITOSA podrá dictaminar el estatus del buró de crédito del prospecto</div>
                                    <br />
                                </div>}
                                <Form>
                                    <div className="col-md-12">
                                        <div className="">
                                            <ActionSelect
                                                disabled={state.Modifica}
                                                label="Clasificación de Buro"
                                                name="BuroInternoEstatusID"
                                                placeholder="Seleccione Un Estatus De Buro"
                                                options={props.optBuro}
                                                addDefault={false}
                                                valor={props.BuroInternoEstatusID}
                                                accion={fnBuro}
                                            />
                                        </div>
                                        <p></p>
                                        <div className="text-end">
                                            {state.Cargando && <Spinner />}
                                            {!state.Cargando && [2, 3].includes(props.RevisionBuro) && <button disabled={state.Modifica} type="submit" className="ms-2 btn btn-success waves-effect waves-light">VALIDAR BURO DE CREDITO</button>}
                                        </div>
                                    </div>
                                </Form>
                            </div>
                            <p></p>
                            <div className="col-ms-12 d-flex justify-content-center">
                                {props.RevisionBuro == 1 && <FaCheckCircle color='green' size={40} />}
                            </div>
                        </div>}
                    </Formik>}
                </ModalWin.Body>
            </ModalWin>
            <ModalWin open={state.mostrarConfirm} center>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>
                        CONFIRMACIÓN
                    </h5>
                    <button type="button" className="delete" onClick={() => { fnCancelarConfirm() }} />
                </ModalWin.Header>
                <ModalWin.Body>
                    <span >Esta por solicitar la consulta de buro de crédito para el  prospecto: {props.NombreProspecto}. ¿Desea continuar?</span><br /><br />
                    <div className="text-end">
                        <div className="row">
                            <div className="col-sm-12">
                                {state.Cargando && <Spinner />}
                                {!state.Cargando && <button onClick={() => { fnConsultar() }} type="submit" className="ms-1 btn btn-success waves-effect waves-light">SI, CONSULTAR BURO</button>}
                            </div>
                        </div>
                    </div>

                </ModalWin.Body>
            </ModalWin>
            <ModalWin open={state.Form.Mostrar} center>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>
                        AGREGAR NOTA
                    </h5>
                    <button type="button" className="delete" onClick={() => { fnCancelar() }} />
                </ModalWin.Header>
                <ModalWin.Body>
                    <div>
                        <div className="row">
                            <div className="col-sm-12">
                                <Formik initialValues={{ Mensaje: '' }}
                                    enableReinitialize
                                    validationSchema={Yup.object().shape(validationShapeM)}
                                    onSubmit={(values: any) => {

                                        setState(e => ({ ...e, Cargando: true }))
                                        if (values.Mensaje === '') {
                                            toast.error(`ES NECESARIO SELECCIONAR UN MOTIVO`)
                                        } else {
                                            console.log(values)
                                            console.log(`${values.Mensaje} ${state.Nota ? ' - ' + state.Nota : ''}`)
                                            fnEnviarMensaje(`${values.Mensaje} ${state.Nota ? ' - ' + state.Nota : ''}`)
                                        }

                                    }} >
                                    <Form>
                                        <ActionSelect
                                            disabled={loading}
                                            label="Nota"
                                            name="Mensaje"
                                            placeholder="Selecciona el motivo de la nota"
                                            options={state.optNotas}
                                            addDefault={true}
                                            valor={mensajeID}
                                        // accion={setMensajeID}
                                        />
                                        {/* <CustomFieldText disabled={loading} label="Mensaje (Opcional)" name="Anotacion" placeholder=""/>  */}
                                        <label>Anotación</label>
                                        <textarea className="form-control" name='Anotacion' id='Anotacion' rows={5} placeholder="Escribe aquí un Mensaje para complementar la Nota a enviar (Opcional)" onChange={e => FnNota(e.target.value)} />
                                        <div className="text-center">
                                            <br />
                                            {state.Cargando && <Spinner />}
                                            {!state.Cargando && <button /*onClick={() => { fnEnviarMensaje() }}*/ type="submit" className="ms-1 btn btn-primary waves-effect waves-light"><FaCommentDots size={20} /> ENVIAR MENSAJE</button>}
                                        </div>
                                    </Form>
                                </Formik>
                            </div>
                        </div>
                    </div>

                </ModalWin.Body>
            </ModalWin>
            <ModalWin open={state.MostrarCancelar} center>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>CANCELAR PROSPECTO</h5>
                    <button type="button" className="delete" onClick={() => { fnCancelarC() }} />
                </ModalWin.Header>
                <ModalWin.Body>
                    <div>
                        <div className="row">
                            <div className="col-sm-12">
                                <Formik initialValues={{ Mensaje: '' }}
                                    enableReinitialize
                                    validationSchema={Yup.object().shape(validationShapeM)}
                                    onSubmit={(values: any) => {

                                        setState(e => ({ ...e, Cargando: true }))
                                        if (values.Mensaje === '') {
                                            toast.error(`ES NECESARIO SELECCIONAR UN MOTIVO`)
                                        } else {
                                            fnCancelarProspecto(`${values.Mensaje} ${state.Nota ? ' - ' + state.Nota : ''}`)
                                        }

                                    }} >
                                    <Form>
                                        <ActionSelect
                                            disabled={loading}
                                            label="Nota"
                                            name="Mensaje"
                                            placeholder="Selecciona el motivo de la nota"
                                            options={state.optNotas}
                                            addDefault={true}
                                            valor={mensajeID}
                                        // accion={setMensajeID}
                                        />
                                        {/* <CustomFieldText disabled={loading} label="Mensaje (Opcional)" name="Anotacion" placeholder=""/>  */}
                                        <label>Anotación</label>
                                        <textarea className="form-control" name='Anotacion' id='Anotacion' rows={5} placeholder="Escribe aquí un Mensaje para complementar la Nota a enviar (Opcional)" onChange={e => FnNota(e.target.value)} />
                                        <div className="text-center">
                                            <br />
                                            {state.Cargando && <Spinner />}
                                            {!state.Cargando && <button /*onClick={() => { fnEnviarMensaje() }}*/ type="submit" className="ms-1 btn btn-danger waves-effect waves-light"><FaBan /> CANCELAR PROSPECTO</button>}
                                        </div>
                                    </Form>
                                </Formik>
                            </div>
                        </div>
                    </div>

                </ModalWin.Body>
            </ModalWin>
        </>
    )
}