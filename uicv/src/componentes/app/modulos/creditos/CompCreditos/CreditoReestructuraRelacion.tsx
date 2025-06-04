import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
// import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CreditoReestructuraRelacion/Funciones'
// import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaCheck, FaExclamationCircle, FaFile, FaPencilAlt } from 'react-icons/fa'

// Custom components
import { Card, ModalWin, Spinner } from '../../../../global'
import { CForm } from './CreditoReestructuraRelacion/CForm'
// import { FiRefreshCcw } from 'react-icons/fi'
// import { FiltrarDatos } from '../../../../../global/functions'

import { iUI } from '../../../../../interfaces/ui/iUI'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import moment from 'moment'
import { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import { CFormR } from './CreditoReestructuraRelacion/CFormR'
import { CFormD } from './CreditoReestructuraRelacion/CFormD'
import { toast } from 'react-toastify'
import { DBConfia_Creditos } from '../../../../../interfaces_db/DBConfia/Creditos'
import VerDoc from './CreditoReestructuraRelacion/VerDoc'

type CatalogosType = {
    oidc: IOidc,
    iUI: iUI
}

const ReestructuraRelacion = (props: CatalogosType) => {
    let isMounted = React.useRef(true)

    const DatosDefecto = {
        DistribuidorId: 0,
        SucursalId: 0,
        CuentaId: 0,
        FechaPago: new Date(),
        Importe: 0,
        GenerarDNI: false,
        CodigoAut: '',
        Plazos: 0,
        ConceptoId: 0,

        saldoPlazo: 0,
        PorcComision: 0,
        PagoTotal: 0,
        PagoComision: 0,
        Abono: 0,
        Dif_Pago: 0,

        AbonoAcumulado: 0,
        SldCredPersonal: 0,
        CargoAdic: 0,
        BonDia: 0,
        SldDia: 0,
        PagoMinComision: 0,
        doc: ''

    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optPlazos: any[] = []
    let solActual: DBConfia_Creditos.IReestructurasSolicitudes_VW | undefined
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Form: DatosDefecto,
        Mostrar: false,
        loading: false,
        optTipos: [],
        optPlazos,
        rPendiente: false,
        solActual,
        VerDoc: false,
        documentoPath: '',
        documentoNombre: '',
        SubirDoc: false,
        documentoLabel: 0,
    })

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

    const FnGetConceptos = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetConceptos(props.oidc)
            .then((respuesta: any) => {
                var tipos = respuesta.map((valor: any) => {
                    var obj = { value: valor.ConceptoReestructuraID, label: valor.Concepto };
                    return obj
                });

                setState(s => ({ ...s, optTipos: tipos }))
            })
            .catch(() => {
                setState(s => ({ ...s, optTipos: [] }))
            })
    }

    const FnGetPlazos = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetPlazos(props.oidc)
            .then((respuesta: any) => {
                var tipos = respuesta.map((valor: any) => {
                    var obj = { value: valor.Plazo, label: valor.Plazo };
                    return obj
                });

                setState(s => ({ ...s, optPlazos: tipos }))
            })
            .catch(() => {
                setState(s => ({ ...s, optPlazos: [] }))
            })
    }

    React.useEffect(() => {
        FnGetConceptos()
        FnGetPlazos()
        return () => { isMounted.current = false }
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: s.Datos, Cargando: false }))
    }, [state.Datos])

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'No Pago',
                    selector: 'NoPago',
                },
                {
                    name: 'Saldo Total Inicial',
                    selector: 'SaldoTotalInicial',
                    cell: (props) => <span>{formatter.format(props.SaldoTotalInicial)}</span>
                },
                {
                    name: 'Fecha Vencimiento',
                    selector: 'FechaVencimiento',
                    cell: (props) => <span>{moment(props.FechaVencimiento).format('DD/MM/YYYY')}</span>
                },
                {
                    name: 'Fecha Vencimiento ClienteFinal',
                    selector: 'FechaVencimientoClienteFinal',
                    cell: (props) => <span>{moment(props.FechaVencimientoClienteFinal).format('DD/MM/YYYY')}</span>
                },
                {
                    name: 'Monto por Plazo',
                    selector: 'Capital',
                    cell: (props) => <span><strong>{formatter.format(props.Capital)}</strong></span>
                },
                {
                    name: 'Saldo Total Final',
                    selector: 'SaldoTotalFinal',
                    cell: (props) => <span>{formatter.format(props.SaldoTotalFinal)}</span>
                },
            ]
        return colRet
    }, [state.Form])

    const cbActualizaDatos = (item: any) => {
        // console.log('FechaPago: ', item.FechaPago)
        let hoy = new Date(item.FechaPago)
        hoy.setMinutes(hoy.getMinutes() + hoy.getTimezoneOffset())
        // console.log('hoy: ', hoy)
        setState(s => ({
            ...s, Form: {
                ...state.Form,
                DistribuidorId: item.DistribuidorId,
                SucursalId: item.SucursalId,
                CuentaId: item.CuentaId,
                Abono: item.Abono,
                saldoPlazo: item.saldoPlazo,
                PorcComision: item.PorcComision * 100,
                PagoTotal: item.PagoTotal,
                PagoComision: item.PagoComision,
                Importe: item.Abono == 0 ? item.saldoPlazo : item.Abono,
                Dif_Pago: item.Dif_Pago,
                AbonoAcumulado: item.AbonoAcumulado,
                SldCredPersonal: item.SldCredPersonal,
                CargoAdic: item.CargoAdic,
                BonDia: item.BonDia,
                SldDia: item.SldDia,
                PagoMinComision: item.PagoMinComision,
                FechaPago: hoy,
                CodigoAut: item.CodigoAut
            }
        }))
    }

    const cbMuestrCotizacion = (item: any, importe: 0, plazos: 0) => {
        setState(s => ({ ...s, Datos: item, Form: { ...s.Form, Importe: importe, Plazos: plazos } }));
        window.scrollTo(0, document.body.scrollHeight);
    }

    const cbMuestraActual = (show: boolean) => {
        if (show)
            Funciones.FNGetSolActual(props.oidc, state.Form.DistribuidorId)
                .then((respuesta: any) => {
                    console.log('xxx', respuesta)
                    setState(s => ({ ...s, rPendiente: show, solActual: respuesta, SubirDoc: false }))
                    window.scrollTo(0, document.body.scrollHeight);
                })
                .catch((error: any) => {
                    if (error.response)
                        toast.info(`Response error: ${error.response.data}`)
                    else if (error.request)
                        toast.error(`Request ${error}`)
                    else
                        toast.error(`${error}`)
                })
        else
            setState(s => ({ ...s, rPendiente: show, SubirDoc: false }))
    }

    const fnVerDoc = (documentoPath: string, documentoNombre: string) => setState({ ...state, VerDoc: true, documentoPath, documentoNombre })
    const fnSubirDoc = (documentoNombre: string, documentoLabel: number) => setState({ ...state, SubirDoc: true, documentoNombre, documentoLabel })
    const fnCancelarVerDoc = () => setState({ ...state, VerDoc: false, SubirDoc: false })

    return (
        <>
            <Card Title="Solicitud Reestructura Plazo">
                <Card.Body>
                    <Card.Body.Content>
                        <div>
                            <CForm
                                oidc={props.oidc}
                                ProductoID={props.iUI.Producto?.ProductoID as number}
                                initialValues={state.Form}
                                cbActualizaDatos={cbActualizaDatos}
                                cbMuestrCotizacion={cbMuestrCotizacion}
                                optPlazos={state.optPlazos}
                                cbMuestraActual={cbMuestraActual}
                            />
                        </div>
                    </Card.Body.Content>
                </Card.Body>
            </Card>
            {state.Datos.length > 0 && <div className="row">
                <div className="col-12">
                    <Card Title="Tabla de amortizacion">
                        <Card.Body>
                            <Card.Body.Content>
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

                                <div className="text-end" style={{ margin: '2em' }}>
                                    <button className="btn btn-success" type="button"
                                        onClick={() => setState({ ...state, Mostrar: true })}
                                    >SOLICITAR REESTRUCTURA</button>
                                </div>
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                    <ModalWin open={state.Mostrar} large>
                        <ModalWin.Header>
                            <h5 className={MODAL_TITLE_CLASS}>SOLICITAR REESTRUCTURA</h5>
                            <button type="button" className="delete" onClick={() => setState({ ...state, Mostrar: false })} />
                        </ModalWin.Header>
                        <ModalWin.Body>
                            {<CFormR
                                oidc={props.oidc}
                                ProductoID={props.iUI.Producto?.ProductoID as number}
                                optTipos={state.optTipos}
                                initialValues={state.Form}
                                cbMuestrCotizacion={cbMuestrCotizacion}
                                cbMuestraActual={cbMuestraActual}
                            />}
                        </ModalWin.Body>
                    </ModalWin>
                </div>
            </div >}
            {state.rPendiente && <Card Title={`Detalle de la Solicitud de Reestructura | Tipo: ${state.solActual?.Tipo} - Socia: ${state.solActual?.Distribuidor}`}>
                <Card.Body>
                    <Card.Body.Content>
                        <div className="row">
                            <div className='col-4'>
                                <table className="table table-striped">
                                    <thead>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ fontWeight: 'bold' }}>Fecha</td>
                                            <td>{moment(state.solActual?.Fecha).format('DD/MM/YYYY')}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ fontWeight: 'bold' }}>Plazos</td>
                                            <td>{state.solActual?.Plazos}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ fontWeight: 'bold' }}>Concepto</td>
                                            <td>{state.solActual?.Concepto}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ fontWeight: 'bold' }}>Estatus</td>
                                            <td style={{ paddingTop: '5px', marginTop: '5px' }} className={`badge ${state.solActual?.Clave == 'CAP-0' ? 'bg-secondary' : 'bg-info'}`}><i>{state.solActual?.Estatus}</i></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className='col-8'>
                                {((state.solActual?.IneFrente ?? '').length * (state.solActual?.IneReverso ?? '').length * (state.solActual?.Firma ?? '').length) > 0
                                    ? <div className='text-start'><span style={{ color: 'green' }}><FaCheck color='green' /> LA SOLICITUD YA ESTA EN EL AREA CORRESPONDIENTE PARA SER REVISADA.<br /><FaCheck color='green' /> TODOS LOS DOCUMENTOS SUBIDOS.</span></div>
                                    : <div className='text-start'><span style={{ color: 'red' }}><FaExclamationCircle color='red' /> ES NECESARIO SUBIR TODOS LOS DOCUMENTOS PARA QUE LA SOLICITUD DE REESTRUCTURA PUEDA SER REVISADA Y APLICADA POR EL AREA CORRESPONDIENTE.</span></div>}
                            </div>
                        </div>
                        <label><strong>DOCUMENTOS</strong></label><FaFile color='lightgrey' />
                        <table className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th>{state.solActual?.SolicitudFilePath ? <FaCheck color='green' /> : <FaExclamationCircle color='red' />} Solicitud</th>
                                    <th>{state.solActual?.IneFrente ? <FaCheck color='green' /> : <FaExclamationCircle color='red' />} Identificación Frente</th>
                                    <th>{state.solActual?.IneReverso ? <FaCheck color='green' /> : <FaExclamationCircle color='red' />} Identificacion Reverso</th>
                                    <th>{state.solActual?.Firma ? <FaCheck color='green' /> : <FaExclamationCircle color='red' />} Firma</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <button type="button" style={{ paddingTop: '0px', paddingBottom: '3px' }} className="btn btn-link" onClick={() => fnVerDoc(state.solActual?.SolicitudFilePath ?? '', 'SOLICITUD')}>
                                            VER DOCUMENTO
                                        </button>
                                    </td>
                                    <td>
                                        {state.solActual?.IneFrente
                                            ? <>
                                                <button type="button" style={{ paddingTop: '0px', paddingBottom: '3px' }} className="btn btn-link" onClick={() => fnVerDoc(state.solActual?.IneFrente ?? '', 'IDENTIFICACIÓN FRONTAL')}>
                                                    VER DOCUMENTO
                                                </button>
                                                |&nbsp;&nbsp;&nbsp;
                                                <button type="button" style={{ paddingTop: '0px', paddingBottom: '3px' }} className="btn btn-primary" onClick={() => fnSubirDoc('IDENTIFICACIÓN FRONTAL', 1)}>
                                                    <FaPencilAlt />
                                                </button>
                                            </>
                                            : <button type="button" style={{ paddingTop: '0px', paddingBottom: '3px' }} className="btn btn-primary" onClick={() => fnSubirDoc('IDENTIFICACIÓN FRONTAL', 1)}>
                                                SUBIR DOCUMENTO
                                            </button>
                                        }
                                    </td>
                                    <td>
                                        {state.solActual?.IneReverso
                                            ? <>
                                                <button type="button" style={{ paddingTop: '0px', paddingBottom: '3px' }} className="btn btn-link" onClick={() => fnVerDoc(state.solActual?.IneReverso ?? '', 'IDENTIFICACIÓN REVERSO')}>
                                                    VER DOCUMENTO
                                                </button>
                                                |&nbsp;&nbsp;&nbsp;
                                                <button type="button" style={{ paddingTop: '0px', paddingBottom: '3px' }} className="btn btn-primary" onClick={() => fnSubirDoc('IDENTIFICACIÓN REVERSO', 2)}>
                                                    <FaPencilAlt />
                                                </button>
                                            </>
                                            : <button type="button" style={{ paddingTop: '0px', paddingBottom: '3px' }} className="btn btn-primary" onClick={() => fnSubirDoc('IDENTIFICACIÓN REVERSO', 2)}>
                                                SUBIR DOCUMENTO
                                            </button>
                                        }
                                    </td>
                                    <td>
                                        {state.solActual?.Firma
                                            ? <>
                                                <button type="button" style={{ paddingTop: '0px', paddingBottom: '3px' }} className="btn btn-link" onClick={() => fnVerDoc(state.solActual?.Firma ?? '', 'FIRMA')}>
                                                    VER DOCUMENTO
                                                </button>
                                                |&nbsp;&nbsp;&nbsp;
                                                <button type="button" style={{ paddingTop: '0px', paddingBottom: '3px' }} className="btn btn-primary" onClick={() => fnSubirDoc('FIRMA', 3)}>
                                                    <FaPencilAlt />
                                                </button>
                                            </>
                                            : <button type="button" style={{ paddingTop: '0px', paddingBottom: '3px' }} className="btn btn-primary" onClick={() => fnSubirDoc('FIRMA', 3)}>
                                                SUBIR DOCUMENTO
                                            </button>
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Card.Body.Content>
                </Card.Body>
            </Card>}
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
                        ProductoID={props.iUI.Producto?.ProductoID as number}
                        optTipos={state.optTipos}
                        initialValues={state.Form}
                        documentoLabel={state.documentoLabel}
                        cbMuestraActual={cbMuestraActual}
                    />}
                </ModalWin.Body>
            </ModalWin>}
        </>
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    iUI: state.UI
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(ReestructuraRelacion)