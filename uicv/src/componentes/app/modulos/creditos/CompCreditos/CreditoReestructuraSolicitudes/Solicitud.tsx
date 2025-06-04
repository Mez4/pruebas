import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Spinner, ActionSelect, ModalWin, Acordion, ImgViewer } from '../../../../../global'
import * as Funciones from './Funciones'
import * as FuncionesR from '../CreditoReestructuraRelacion/Funciones'
import * as FuncionesC from '../CreditoReestructuraCliente/Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
//import { DBConfia_Prospeccion } from '../../../../../interfaces_db/DBConfia/Prospeccion'
import { DBConfia_Creditos } from '../../../../../../../src/interfaces_db/DBConfia/Creditos'
import { toast } from 'react-toastify'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { FaExclamationTriangle, FaSignature, FaTable, FaUser } from 'react-icons/fa'
import moment from 'moment'
import { FormateoDinero } from '../../../../../../global/variables'
import DataTable, { IDataTableColumn } from 'react-data-table-component'

type CFormType = {
    oidc: IOidc
    Id?: number,
    Item: DBConfia_Creditos.IReestructurasSolicitudes_VW,
    mostrar: boolean,
    IdAnalista?: number,
    initialValues: {
        SolicitudReestructuraID: number, Distribuidor: string, DistribuidorID: number, AnalistaPersonaID: number
    },
    optAnalista: { value: number, label: string }[],
    cbActualizar(item: any): any,
    fnCancelar(): any
}

export const Solicitud = (props: CFormType) => {

    // Loading
    let isMounted = React.useRef(true)
    const [loading, setLoading] = React.useState(false)

    const DatosMostrar: any[] = []
    const [state, setState] = React.useState({
        doc: '',
        docLabel: '',
        ine: '',
        ineReveso: '',
        machote: '',
        solicitud: '',
        firma: '',
        cargandoDocs: true,
        Cargando: true,
        Error: false,
        DatosMostrar,
        ModalConfirm: false,
        ModalConfirm2: false,
    })

    const Cotizar = async () => {
        setState(s => ({ ...s, Cargando: true }))
        var dateString = moment(props.Item.Fecha).format('DD/MM/YYYY'); // Oct 23
        var dateParts = dateString.split("/");
        if (props.Item.TipoReestructuraID === 1) {
            FuncionesR.FNGetAmortizacion(props.oidc,
                {
                    ProductoId: props.Item.ProductoID,
                    DistribuidorId: props.Item.DistribuidorID,
                    SucursalId: props.Item.SucursalID ?? 0,
                    FechaPago: new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]),
                    Plazos: props.Item.Plazos,
                    ValAnt: 1,
                }
            )
                .then((respuesta: any) => {
                    if (respuesta.regresa === 1) {
                        setState(s => ({ ...s, DatosMostrar: respuesta.data, Cargando: false, Error: false }))
                    }
                    else {
                        toast.error(respuesta.msj)
                        setState(s => ({ ...s, DatosMostrar: [], Cargando: false, Error: true }))
                    }
                })
                .catch((error: any) => {
                    setState(s => ({ ...s, Cargando: false, Error: true }))
                    if (error.response)
                        toast.error(`Response Error: ${error.response.data}`)
                    else if (error.request)
                        toast.error(`Request ${error}`)
                    else
                        toast.error(`${error}`)
                })
        } else {
            FuncionesC.FNGetClientesAmortizacion(props.oidc, {
                SolicitudReestructuraID: props.Item.SolicitudReestructuraID,
            })
                .then((resp: any) => {

                    let creditosCliente = resp.map((valor: any) => {
                        return valor.CreditoID;
                    })

                    FuncionesC.FNGetAmortizacion(props.oidc, {
                        ProductoId: props.Item.ProductoID,
                        DistribuidorId: props.Item.DistribuidorID,
                        SucursalId: props.Item.SucursalID ?? 0,
                        FechaPago: new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]),
                        Plazos: props.Item.Plazos,
                        Clientes: creditosCliente, //[33252, 33321],
                        ValAnt: 1,
                    })
                        .then((respuesta: any) => {
                            if (respuesta.regresa === 1) {
                                setState(s => ({ ...s, DatosMostrar: respuesta.data, Cargando: false, Error: false }))
                            }
                            else {
                                toast.error(respuesta.msj)
                                setState(s => ({ ...s, DatosMostrar: [], Cargando: false, Error: true }))
                            }
                        })
                        .catch((error: any) => {
                            setState(s => ({ ...s, Cargando: false, Error: true }))
                            if (error.response)
                                toast.error(`Response Error: ${error.response.data}`)
                            else if (error.request)
                                toast.error(`Request ${error}`)
                            else
                                toast.error(`${error}`)
                        })
                })
                .catch((error: any) => {
                    setState(s => ({ ...s, Cargando: false, Error: true }))
                    if (error.response)
                        toast.error(`Response Error: ${error.response.data}`)
                    else if (error.request)
                        toast.error(`Request ${error}`)
                    else
                        toast.error(`${error}`)
                })
        }
    }

    const ConsultaDocs = async () => {
        setState(s => ({ ...s, cargandoDocs: true }))
        var times = [0, 1, 2, 3, 4];
        times.forEach(e => {
            Funciones.FNGetDocsByCode(props.oidc, e, props.Item.SolicitudReestructuraID)
                .then((respuesta: any) => {
                    if (props.Item.EstatusReestructuraID < 4)
                        props.Item.Estatus = 'EN REVISIÓN'
                    if (isMounted.current === true) {
                        if (e === 0) setState(s => ({ ...s, ine: respuesta.src }))
                        if (e === 1) setState(s => ({ ...s, ineReveso: respuesta.src }))
                        if (e === 2) setState(s => ({ ...s, machote: respuesta.src }))
                        if (e === 3) setState(s => ({ ...s, solicitud: respuesta.src, doc: respuesta.src, docLabel: 'SOLICITUD' }))
                        if (e === 4) setState(s => ({ ...s, firma: respuesta.src }))
                    }
                })
                .catch((error) => {
                    if (isMounted.current === true) {
                        if (error.response)
                            toast.warn(`Response Error: ${error.response.data}`)
                        else if (error.request)
                            toast.warn(`Request ${error}`)
                        else
                            toast.warn(`${error}`)
                        if (e === 0) setState(s => ({ ...s, ine: `Error: ${error}` }))
                        if (e === 1) setState(s => ({ ...s, domicilio: `Error: ${error}` }))
                        if (e === 2) setState(s => ({ ...s, autorizacion: `Error: ${error}` }))
                        if (e === 3) setState(s => ({ ...s, ineReveso: `Error: ${error}` }))
                        if (e === 4) setState(s => ({ ...s, firma: `Error: ${error}` }))
                    }
                })
        })
        setState(s => ({ ...s, cargandoDocs: false }))
    }

    const fnAgregarNota = () => {
        console.log('fnAgregarNota');
    }

    function timeout(delay: number) {
        return new Promise(res => setTimeout(res, delay));
    }

    const fnconfirmCancela = () => setState(s => ({ ...s, ModalConfirm: true }))

    const fnCancela = () => {
        setState(s => ({ ...s, Cargando: true }))
        FuncionesR.FNCancela(props.oidc, { SolicitudReestructuraID: props.Item.SolicitudReestructuraID })
            .then(async (respuesta: any) => {
                toast.success('SE HA CANCELADO AL SOLICITUD CORRECTAMENTE.')
                setState(s => ({ ...s, ModalConfirm: false }))
                props.cbActualizar(respuesta)
                await timeout(1000)
                props.fnCancelar()
            })
            .catch((error: any) => {
                setState(s => ({ ...s, Cargando: false }))
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
            })
    }

    const fnconfirmConsulta = () => setState(s => ({ ...s, ModalConfirm2: true }))

    const fnAplica = () => {
        setState(s => ({ ...s, Cargando: true }))
        if (props.Item.TipoReestructuraID === 1) {
            FuncionesR.FNAplica(props.oidc, { SolicitudReestructuraID: props.Item.SolicitudReestructuraID })
                .then(async (respuesta: any) => {
                    toast.success('SE HA APLICADO LA REESTRUCTURA CORRECTAMENTE A LA SOCIA DV.')
                    setState(s => ({ ...s, ModalConfirm2: false }))
                    props.cbActualizar(respuesta)
                    await timeout(1000)
                    props.fnCancelar()
                })
                .catch((error: any) => {
                    setState(s => ({ ...s, Cargando: false }))
                    if (error.response)
                        toast.error(`Response Error: ${error.response.data}`)
                    else if (error.request)
                        toast.error(`Request ${error}`)
                    else
                        toast.error(`${error}`)
                })
        } else {
            FuncionesC.FNAplica(props.oidc, { SolicitudReestructuraID: props.Item.SolicitudReestructuraID })
                .then(async (respuesta: any) => {
                    toast.success('SE HA APLICADO LA REESTRUCTURA CORRECTAMENTE A LA SOCIA DV.')
                    setState(s => ({ ...s, ModalConfirm2: false }))
                    props.cbActualizar(respuesta)
                    await timeout(1000)
                    props.fnCancelar()
                })
                .catch((error: any) => {
                    setState(s => ({ ...s, Cargando: false }))
                    if (error.response)
                        toast.error(`Response Error: ${error.response.data}`)
                    else if (error.request)
                        toast.error(`Request ${error}`)
                    else
                        toast.error(`${error}`)
                })
        }
    }

    const fnCancelarConfirm = () => {
        setState(s => ({ ...s, ModalConfirm: false, ModalConfirm2: false }))
    }

    React.useEffect(() => {
        //if (props.oidc.user.profile.Persona.Id !== props.Item.AnalistaPersonaID) {
        if (props.oidc.user.profile.Persona[0].Id !== props.Item.AnalistaPersonaID) {
            toast.error("El usuario actual no esta asignado a esta Solicitud")
            props.fnCancelar()
            return
        }
        ConsultaDocs()
        Cotizar()
    }, [props.Id])

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'No Pago',
                    selector: 'NoPago',
                    cell: (props) => <span><strong>{props.NoPago}</strong></span>
                },
                {
                    name: 'Saldo Total Inicial',
                    selector: 'SaldoTotalInicial',
                    cell: (props) => <span>{FormateoDinero.format(props.SaldoTotalInicial)}</span>
                },
                {
                    name: 'Fecha Vencimiento',
                    selector: 'FechaVencimiento',
                    cell: (props) => <span style={{ fontSize: '.85em' }}>{moment(props.FechaVencimiento).format('DD/MM/YYYY')}</span>
                },
                {
                    name: 'Fecha Vencimiento ClienteFinal',
                    selector: 'FechaVencimientoClienteFinal',
                    cell: (props) => <span style={{ fontSize: '.85em' }}>{moment(props.FechaVencimientoClienteFinal).format('DD/MM/YYYY')}</span>
                },
                {
                    name: 'Monto por Plazo',
                    selector: 'Capital',
                    cell: (props) => <span><strong>{FormateoDinero.format(props.Capital)}</strong></span>
                },
                {
                    name: 'Saldo Total Final',
                    selector: 'SaldoTotalFinal',
                    cell: (props) => <span>{FormateoDinero.format(props.SaldoTotalFinal)}</span>
                },
            ]
        return colRet
    }, [props.Id])

    // Return the component
    return (
        <>
            <ModalWin open={props.mostrar} center xlarge>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>
                        Solicitud de Reestructura {props.Item.Tipo} {props.Item.Clave === 'CAN-0' ? <span style={{ backgroundColor: 'red', color: 'white', padding: '2.5px', fontSize: '.75em' }}>{props.Item.Estatus}</span> : props.Item.Clave === 'APL-0' ? <span style={{ backgroundColor: 'green', color: 'white', padding: '2.5px', fontSize: '.75em' }}>{props.Item.Estatus}</span> : ''}<br />
                        Socia DV: {props.Item.Distribuidor}
                    </h5>
                    <button type="button" className="delete" onClick={() => {
                        props.fnCancelar()
                    }} />
                </ModalWin.Header>
                <ModalWin.Body>
                    <div className="row">
                        <div className="col-md-12 text-end" style={{ paddingBottom: '1em' }}>
                            {state.Cargando && <Spinner />}
                            {/* {<button disabled={false} type="submit" className="ms-2 btn btn-warning waves-effect waves-light" onClick={() => { fnAgregarNota() }}>NOTAS</button>} */}
                            {(!state.Cargando && ['SOL-0', 'ASI-0', 'REV-0'].includes(props.Item.Clave)) && <button disabled={false} type="submit" className="ms-2 btn btn-danger waves-effect waves-light" onClick={() => { fnconfirmCancela() }}>RECHAZAR SOLICITUD</button>}
                            {(!state.Cargando && ['SOL-0', 'ASI-0', 'REV-0'].includes(props.Item.Clave)) && <button disabled={false} type="submit" className="ms-2 btn btn-primary waves-effect waves-light" onClick={() => { fnconfirmConsulta() }}>GENERAR REESTRUCTURA</button>}
                        </div>
                        <div className="col-md-6">
                            <Acordion TabSelecionado="General">
                                <Acordion.Tab Identificador="General" Titulo={<React.Fragment><FaUser />&nbsp;DATOS CAPTURADOS</React.Fragment>}>
                                    <>
                                        <div className="text-start">
                                            <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                                <tbody>
                                                    <tr>
                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Socia DV:</td>
                                                        <td>{props.Item.Distribuidor}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Teléfono Movil:</td>
                                                        <td style={{ fontWeight: 'bold' }}>{props.Item.TelefonoMovil}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Concepto:</td>
                                                        <td style={{ fontWeight: 'bold' }}>{props.Item.Concepto}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Analista:</td>
                                                        <td>{props.Item.Analista}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Estatus: </td>
                                                        <td>{props.Item.Estatus}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Tipo:</td>
                                                        <td style={{ fontWeight: 'bold' }}>{props.Item.Tipo}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Sucursal:</td>
                                                        <td>{props.Item.Sucursal}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ fontWeight: 'bold', display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Plazos:</td>
                                                        <td style={{ fontWeight: 'bold' }}>{props.Item.Plazos}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Fecha de Solicitud:</td>
                                                        <td style={{ fontWeight: 'bold' }}>{moment(props.Item.Fecha).utc().format('DD/MM/YYYY')}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Fecha de Corte:</td>
                                                        <td style={{ fontWeight: 'bold' }}>{moment(props.Item.FechaCorte).utc().format('DD/MM/YYYY')}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ fontWeight: 'bold', display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Saldo Pendiente A Reestructurar:</td>
                                                        <td style={{ fontWeight: 'bold' }}>{FormateoDinero.format(props.Item.SaldoAReestructurar ?? 0)}</td>
                                                    </tr>
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
                                        {state.firma === '' && <div>SIN DOCUMENTO FIRMA</div>}
                                        <ImgViewer imgSrc={state.firma} noToolbar={false} zIndex={1000} maxWidth={250} maxHeight={250} />
                                    </div>
                                </Acordion.Tab>
                            </Acordion>
                            <Acordion TabSelecionado="">
                                <Acordion.Tab Identificador="AMORTIZACION" Titulo={<React.Fragment><FaTable />&nbsp;TABLA DE AMORTIZACIÓN</React.Fragment>}>
                                    <div className='text-center'>
                                        {state.Cargando && <Spinner />}
                                        {state.Error && <span>Error al cargar los datos...</span>}
                                        {!state.Cargando && !state.Error &&
                                            <div>
                                                <DataTable
                                                    data={state.DatosMostrar}
                                                    striped
                                                    dense
                                                    noHeader
                                                    responsive
                                                    keyField={"ValeraEstatusID"}
                                                    defaultSortField={"ValeraEstatusID"}
                                                    columns={Columns}
                                                />
                                            </div>
                                        }
                                    </div>
                                </Acordion.Tab>
                            </Acordion>
                        </div>
                        <div className="col-md-6">
                            <Acordion TabSelecionado="Documentos">
                                <Acordion.Tab Identificador="Documentos" Titulo={<React.Fragment><FaUser />&nbsp;DOCUMENTOS</React.Fragment>}>
                                    <>
                                        <div>
                                            <div className="row">
                                                <div className="col-12 text-center" style={{ marginBottom: '1em' }}>
                                                    <div className="lightbox" style={{ width: '100%', height: '330px', backgroundColor: 'white' }}>
                                                        <figure className="figure">
                                                            <figcaption className="figure-caption">{state.docLabel}</figcaption>
                                                            <ImgViewer imgSrc={state.doc} noToolbar={false} zIndex={1000} maxWidth={500} maxHeight={330} />
                                                        </figure>
                                                    </div>
                                                </div>
                                                <div className="col-3 p-1">
                                                    <figure className="figure">
                                                        <figcaption className="figure-caption">SOLICITUD</figcaption>
                                                        <div className='border sqImage'>
                                                            {state.cargandoDocs && state.solicitud === '' && <div><Spinner /></div>}
                                                            {!state.cargandoDocs && state.solicitud === '' && <div className='text-center' style={{ marginTop: '1em' }}><FaExclamationTriangle /> <br /> <span className='badge bg-dark'>NO ENCONTRADO</span></div>}
                                                            <img
                                                                style={{ cursor: 'pointer' }}
                                                                src={state.solicitud} className="w-100"
                                                                onClick={() => setState(e => ({ ...e, doc: e.solicitud, docLabel: 'SOLICITUD' }))}
                                                            />
                                                        </div>
                                                    </figure>
                                                </div>
                                                <div className="col-3 p-1">
                                                    <figure className="figure">
                                                        <figcaption className="figure-caption">INE</figcaption>
                                                        <div className='border sqImage'>
                                                            {state.cargandoDocs && state.ine === '' && <div><Spinner /></div>}
                                                            {!state.cargandoDocs && state.ine === '' && <div className='text-center' style={{ marginTop: '1em' }}><FaExclamationTriangle /> <br /> <span className='badge bg-dark'>NO ENCONTRADO</span></div>}
                                                            <img
                                                                style={{ cursor: 'pointer' }}
                                                                src={state.ine} className="w-100"
                                                                onClick={() => setState(e => ({ ...e, doc: e.ine, docLabel: 'INE' }))}
                                                            />
                                                        </div>
                                                    </figure>
                                                </div>
                                                <div className="col-3 p-1">
                                                    <figure className="figure">
                                                        <figcaption className="figure-caption">INE REVERSO</figcaption>
                                                        <div className='border sqImage'>
                                                            {state.cargandoDocs && state.ineReveso === '' && <div><Spinner /></div>}
                                                            {!state.cargandoDocs && state.ineReveso === '' && <div className='text-center' style={{ marginTop: '1em' }}><FaExclamationTriangle /> <br /> <span className='badge bg-dark'>NO ENCONTRADO</span></div>}
                                                            <img
                                                                style={{ cursor: 'pointer' }}
                                                                src={state.ineReveso} className="w-100"
                                                                onClick={() => setState(e => ({ ...e, doc: e.ineReveso, docLabel: 'INE REVERSO' }))}
                                                            />
                                                        </div>
                                                    </figure>
                                                </div>
                                                <div className="col-3 p-1">
                                                    <figure className="figure">
                                                        <figcaption className="figure-caption">MACHOTE</figcaption>
                                                        <div className='border sqImage'>
                                                            {state.cargandoDocs && state.machote === '' && <div><Spinner /></div>}
                                                            {!state.cargandoDocs && state.machote === '' && <div className='text-center' style={{ marginTop: '1em' }}><FaExclamationTriangle /> <br /> <span className='badge bg-dark'>NO ENCONTRADO</span></div>}
                                                            <img
                                                                style={{ cursor: 'pointer' }}
                                                                src={state.machote} className="w-100"
                                                                onClick={() => setState(e => ({ ...e, doc: e.machote, docLabel: 'MACHOTE (SOLO REESTRUCTURA CLIENTE)' }))}
                                                            />
                                                        </div>
                                                        <figcaption className="figure-caption">SOLO REESTRUCTURA POR CLIENTE</figcaption>
                                                    </figure>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                </Acordion.Tab>
                            </Acordion>
                        </div>
                    </div>
                </ModalWin.Body>
            </ModalWin>
            <ModalWin open={state.ModalConfirm} center>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>
                        CONFIRMACIÓN
                    </h5>
                    <button type="button" className="delete" onClick={() => { fnCancelarConfirm() }} />
                </ModalWin.Header>
                <ModalWin.Body>
                    <span >Esta por cancelar la solicitud de reestructura por {props.Item.Tipo} para la Socia DV: {props.Item.Distribuidor}. ¿Desea continuar?</span><br /><br />
                    <div className="text-end">
                        <div className="row">
                            <div className="col-sm-12">
                                {state.Cargando && <Spinner />}
                                {!state.Cargando && <button onClick={() => { fnCancela() }} type="submit" className="ms-1 btn btn-danger waves-effect waves-light">SI, CANCELAR</button>}
                            </div>
                        </div>
                    </div>

                </ModalWin.Body>
            </ModalWin>
            <ModalWin open={state.ModalConfirm2} center>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>
                        CONFIRMACIÓN
                    </h5>
                    <button type="button" className="delete" onClick={() => { fnCancelarConfirm() }} />
                </ModalWin.Header>
                <ModalWin.Body>
                    <span >Esta por aceptar y aplicar la solicitud de reestructura por {props.Item.Tipo} para la Socia DV: {props.Item.Distribuidor}. ¿Desea continuar?</span><br /><br />
                    <div className="text-end">
                        <div className="row">
                            <div className="col-sm-12">
                                {state.Cargando && <Spinner />}
                                {!state.Cargando && <button onClick={() => { fnAplica() }} type="submit" className="ms-1 btn btn-success waves-effect waves-light">SI, APLICAR</button>}
                            </div>
                        </div>
                    </div>

                </ModalWin.Body>
            </ModalWin>
        </>

    )
}