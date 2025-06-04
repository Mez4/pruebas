import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import * as Funciones from './CatalogoRecepcionUniforme/Funciones'
import { toast } from 'react-toastify'

// Icons
import { FaCheck, FaCheckCircle, FaCircle, FaClone, FaEye, FaFile, FaFileSignature, FaPencilAlt, FaPlus, FaPrint, FaSearch, FaSignature } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CatalogoRecepcionUniforme/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { inputCSS } from 'react-select/src/components/Input'
import moment from 'moment'
import { ErrorMessage, Field } from 'formik'
import ReactTooltip from 'react-tooltip'

import { CFormAgregarComprobante } from './CatalogoRecepcionUniforme/CFormAgregarComprobante'
import { CFormVerComprobante } from './CatalogoRecepcionUniforme/CFormVerComprobante'
import { CFormAgregarFirma } from './CatalogoRecepcionUniforme/CFormAgregarFirma'
import { CFormVerFirma } from './CatalogoRecepcionUniforme/CFormVerFirma'

type CatalogosType = {
    oidc: IOidc
}

const CatalogoRecepcionUniforme = (props: CatalogosType) => {    // Controll our mounted state
    let isMounted = React.useRef(true)
    const DatosMostrar: any[] = []

    const DatosDefecto = {
        RecepcionID: 0
        , SolicitudID: 0
        , SurteID: 0
        , NombreSurte: ""
        , RecibeID: 0
        , NombreRecibe: ""
        , CancelaID: 0
        , NombreCancela: ""
        , DevuelveID: 0
        , NombreDevolucion: ""
        , FechaSurtido: ""
        , FechaRecepcion: ""
        , FechaCancelacion: ""
        , FechaDevolucion: ""
        , EstatusID: 0
        , EstatusDes: ""
        , Descripcion: ""
        , Cancelada: 0
        , RecepcionParcial: 0
        , Devolucion: 0
        , OrdenID: 0
        , ReOrdenID: 0
        , SurtidoID: 0
        , DevolucionID: 0
        , ComprobanteDoc: ""
        , DocumentoID: 0
        , ComprobanteFirma: ""
        , FirmaDocID: 0
        , ProductoID: 0
        , EmpresaId: 0
        , Pendientes: 0
        , DetalleRecepcion:
            [{
                RecepcionDetalleID: 0
                , RecepcionID: 0
                , SolicitudDetalleID: 0
                , SurtidoDetalleID: 0
                , CorteID: 0
                , ProductoUniformeID: 0
                , ProductoUniformeDesc: ""
                , PiezasSolicitadas: 0
                , PiezasSurtidas: 0
                , PiezasRecepcionadas: 0
                , PiezasPendientes: 0
                , NumeroPiezas: 0
                , PiezasPendientesRecepcion: 0
                , FechaCompromiso: ""
                , Observaciones: ""
            }],
    }
    const Datos: any[] = []

    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        DocumentoID: 0,
        FirmaDocID: 0,
        Form:
        {
            CargarDocumento: false,
            DocumentoID: 0,
            FirmaDocID: 0,
            RecepcionID: 0,
            ComprobanteDoc: '',
            VerDoc: false,
            CargarFirma: false,
            VerFirma: false,
            Mostrar: false,
            Datos: DatosDefecto,
            MostrarCrearMovimiento: false,
            Id: 0,
        },
    })

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    console.log(respuesta)
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }
    const cambiarPiezas = (item: any, valor: number) => {
        let index = state.Form.Datos.DetalleRecepcion.findIndex((respuesta: any) => {
            return respuesta.RecepcionDetalleID == item.RecepcionDetalleID
        })
        state.Form.Datos.DetalleRecepcion[index].PiezasRecepcionadas = valor
        setState(s => ({
            ...s, Form: {
                ...s.Form, Datos: state.Form.Datos
            }

        }))
    }

    const cambiarPendientes = (item: any, valor: number) => {
        let index = state.Form.Datos.DetalleRecepcion.findIndex((respuesta: any) => {
            return respuesta.RecepcionDetalleID == item.RecepcionDetalleID
        })
        state.Form.Datos.DetalleRecepcion[index].PiezasPendientesRecepcion = valor
        setState(s => ({
            ...s, Form: {
                ...s.Form, Datos: state.Form.Datos
            }

        }))
    }

    const fnMostrarCargaDeDocumento = (DocumentoID: any, RecepcionID: any) => {

        setState(s => ({
            ...s, Form: {
                ...s.Form, CargarDocumento: true, RecepcionID: RecepcionID
            }
            , DocumentoID: DocumentoID
        }))
    }
    const fnCancelarMostrarCargaDeDocumento = () => {
        setState(s => ({
            ...s, Form: {
                ...s.Form, CargarDocumento: false
            }
        }))
    }
    const fnCancelarVerDocumento = () => {
        setState(s => ({
            ...s, Form: {
                ...s.Form, VerDoc: false
            }
        }))
    }
    const fnCancelarVerFirma = () => {
        setState(s => ({
            ...s, Form: {
                ...s.Form, VerFirma: false
            }
        }))
    }

    const fnMostrarCargaFirma = (FirmaDocID: any, RecepcionID: any) => {

        setState(s => ({
            ...s, Form: {
                ...s.Form, CargarFirma: true, RecepcionID: RecepcionID
            }
            , FirmaDocID: FirmaDocID
        }))
    }

    const fnCancelarCargaFirma = () => {

        setState(s => ({
            ...s, Form: {
                ...s.Form, CargarFirma: false
            }
        }))
    }

    const fnVerDoc = (DocumentoID: any, RecepcionID: any, ComprobanteDoc: any) => {
        console.log("VALORES RECIBIDOS ,", DocumentoID, RecepcionID, ComprobanteDoc)
        setState(s => ({
            ...s, Form: {
                ...s.Form, VerDoc: true, RecepcionID: RecepcionID, ComprobanteDoc: ComprobanteDoc
            }
            , DocumentoID: DocumentoID
        }))
    }

    const fnVerFirma = (FirmaDocID: number, RecepcionID: number) => {
        setState(s => ({
            ...s, Form: {
                ...s.Form, VerFirma: true, RecepcionID: RecepcionID
            }, FirmaDocID: FirmaDocID
        }))
    }

    const estatusColor = (estatus: number) => {
        switch (estatus) {
            case 1:
                return 'Orange'
            case 2:
                return 'Red'
            case 3:
                return 'Orange'
            case 4:
                return 'Yellow'
            case 11:
                return 'Orange'
            case 12:
                return 'Yellow'
            case 13:
                return 'Green'
            case 15:
                return 'Orange'
            case 16:
                return 'Orange'
            case 17:
                return 'Green'
            case 18:
                return 'Yellow'
            case 19:
                return 'Yellow'
            default:
                return 'Green'
        }
    }

    const Columns: IDataTableColumn[] =
        [
            {
                name: 'Recepcion',
                selector: 'RecepcionID',
                sortable: false,
                center: true,
                cell: (rows) => <span className='text-center'>{rows.RecepcionID}</span>
            },
            {
                name: 'Surte',
                selector: 'NombreSurte',
                sortable: false,
                center: true,
                cell: (rows) => <span className='text-center'>{rows.NombreSurte}</span>
            },
            {
                name: 'Recibe',
                selector: 'NombreRecibe',
                sortable: false,
                center: true,
                cell: (rows) => <span className='text-center'>{rows.NombreRecibe == undefined ? "--" : rows.NombreRecibe}</span>
            },
            {
                name: 'Cancela',
                selector: 'NombreCancela',
                sortable: false,
                center: true,
                cell: (rows) => <span className='text-center'>{rows.NombreCancela == undefined ? "--" : rows.NombreCancela}</span>
            },
            {
                name: 'Devuelve',
                selector: 'NombreDevolucion',
                sortable: false,
                center: true,
                cell: (rows) => <span className='text-center'>{rows.NombreDevolucion == undefined ? "--" : rows.NombreDevolucion}</span>
            },
            {
                name: 'Fecha Surtido',
                selector: 'FechaSurtido',
                sortable: false,
                center: true,
                cell: row => <span className='text-center'>{row.FechaSurtido == undefined ? "--" : moment(row.FechaSurtido).format("DD-MM-YYYY hh:mm:ss")}</span>
            },
            {
                name: 'Fecha Recepcion',
                selector: 'FechaRecepcion',
                sortable: false,
                center: true,
                cell: row => <span className='text-center'>{row.FechaRecepcion == undefined ? "--" : moment(row.FechaRecepcion).format("DD-MM-YYYY hh:mm:ss")}</span>
            },
            {
                name: 'Fecha Cancelacion',
                selector: 'FechaCancelacion',
                sortable: false,
                center: true,
                cell: row => <span className='text-center'>{row.FechaCancelacion == undefined ? "--" : moment(row.FechaCancelacion).format("DD-MM-YYYY hh:mm:ss")}</span>
            },
            {
                name: 'Fecha Devolucion',
                selector: 'FechaDevolucion',
                sortable: false,
                center: true,
                cell: row => <span className='text-center'>{row.FechaDevolucion == undefined ? "--" : moment(row.FechaDevolucion).format("DD-MM-YYYY hh:mm:ss")}</span>
            },
            {
                name: 'Estatus',
                selector: 'EstatusID',
                sortable: false,
                center: true,
                cell: row => <span className='text-center'>{<FaCircle color={estatusColor(row.EstatusID)} />}</span>
            },
            {
                name: 'Descripcion',
                selector: 'EstatusDes',
                sortable: false,
                center: true,
                cell: row => <span className='text-center'>{row.EstatusDes}</span>
            },
            {
                name: 'Observaciones',
                selector: 'Descripcion',
                sortable: false,
                center: true,
                cell: row => <span className='text-center'>{row.Descripcion == undefined ? "--" : row.Descripcion}</span>
            },
            {
                name: 'Documento',
                center: true,
                sortable: false,
                cell: (propss) =>
                    propss.ComprobanteDoc == null || propss.ComprobanteDoc == "" || propss.ComprobanteDoc == undefined ?
                        <div>
                            <button style={propss.EstatusID == 11 || propss.EstatusID == 15 || propss.EstatusID == 12 ? {} : { display: "none" }} data-tip data-for="Btn_Examinar" className="asstext" type={"button"}
                                onClick={() => {
                                    fnMostrarCargaDeDocumento(propss.DocumentoID, propss.RecepcionID)
                                }}>
                                <FaFile />
                                <ReactTooltip id="Btn_Examinar" type="info" effect="solid">
                                    Agregar Comprobante
                                </ReactTooltip>
                            </button>
                        </div>
                        :
                        <div>
                            <button style={propss.EstatusID >= 4 ? {} : { display: "none" }} data-tip data-for="Btn_Mostrar" className="asstext" type={"button"}
                                onClick={() => {
                                    fnVerDoc(propss.DocumentoID, propss.RecepcionID, propss.ComprobanteDoc)
                                }}>
                                <FaEye />
                                <ReactTooltip id="Btn_Mostrar" type="info" effect="solid">
                                    Ver Comprobante
                                </ReactTooltip>
                            </button>
                        </div>
            },
            {
                name: 'Firma',
                center: true,
                sortable: false,
                cell: (propsss) =>
                    propsss.ComprobanteFirma == null || propsss.ComprobanteFirma == "" || propsss.ComprobanteFirma == undefined ?
                        <div>
                            {console.log(propsss.ComprobanteFirma)}
                            <button
                                style={propsss.EstatusID == 11 || propsss.EstatusID == 15 || propsss.EstatusID == 12 ? {} : { display: "none" }}
                                data-tip data-for="Btn_Firmar"
                                className="asstext"
                                type={"button"}
                                onClick={() => { fnMostrarCargaFirma(propsss.FirmaDocID, propsss.RecepcionID) }}>
                                <FaFileSignature />
                                <ReactTooltip id="Btn_Firmar" type="info" effect="solid">Agregar Firma</ReactTooltip>
                            </button>
                        </div>
                        :
                        <div>
                            <button style={propsss.EstatusID >= 4 ? {} : { display: "none" }} data-tip data-for="Btn_VerFirmar" className="asstext" type={"button"}
                                onClick={() => {
                                    fnVerFirma(propsss.FirmaDocID, propsss.RecepcionID)
                                }}>
                                <FaSignature />
                                <ReactTooltip id="Btn_VerFirmar" type="info" effect="solid">
                                    Ver Firma
                                </ReactTooltip>
                            </button>
                        </div>
            },
            {
                name: 'Acciones',
                sortable: false,
                center: true,
                cell: (props) =>
                    <button className="asstext" type={"button"} onClick={() => {
                        let nuevo = {
                            RecepcionID: props.RecepcionID
                            , SolicitudID: props.SolicitudID
                            , SurteID: props.SurteID
                            , NombreSurte: props.NombreSurte
                            , RecibeID: props.RecibeID
                            , NombreRecibe: props.NombreRecibe
                            , CancelaID: props.CancelaID
                            , NombreCancela: props.NombreCancela
                            , DevuelveID: props.DevuelveID
                            , NombreDevolucion: props.NombreDevolucion
                            , FechaSurtido: props.FechaSurtido
                            , FechaRecepcion: props.FechaRecepcion
                            , FechaCancelacion: props.FechaCancelacion
                            , FechaDevolucion: props.FechaDevolucion
                            , EstatusID: props.EstatusID
                            , EstatusDes: props.EstatusDes
                            , Descripcion: props.Descripcion
                            , Cancelada: props.Cancelada
                            , RecepcionParcial: props.RecepcionParcial
                            , Devolucion: props.Devolucion
                            , OrdenID: props.OrdenID
                            , ReOrdenID: props.ReOrdenID
                            , SurtidoID: props.SurtidoID
                            , DevolucionID: props.DevolucionID
                            , ComprobanteDoc: props.ComprobanteDoc
                            , DocumentoID: props.DocumentoID
                            , ComprobanteFirma: props.ComprobanteFirma
                            , FirmaDocID: props.FirmaDocID
                            , ProductoID: props.ProductoID
                            , EmpresaId: props.EmpresaId
                            , Pendientes: props.Pendientes
                            , DetalleRecepcion: props.DetalleRecepcion
                        }
                        console.log("RECEPCION CLICK ,", props.DetalleRecepcion)
                        setState(s => ({
                            ...s,
                            Form: {
                                ...s.Form,
                                Mostrar: true,
                                Datos: nuevo,
                                Id: props.RecepcionID
                            }
                        }))
                    }}>
                        <FaEye />
                    </button>
            },
        ]


    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        return () => {
            isMounted.current = false
        }
    }, [])

    // On use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])


    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        toast.success('Se agrego correctamente')
        setState(state => ({
            ...state, Datos: [...state.Datos, item],
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    RecepcionID: 0
                    , SolicitudID: 0
                    , SurteID: 0
                    , NombreSurte: ""
                    , RecibeID: 0
                    , NombreRecibe: ""
                    , CancelaID: 0
                    , NombreCancela: ""
                    , DevuelveID: 0
                    , NombreDevolucion: ""
                    , FechaSurtido: ""
                    , FechaRecepcion: ""
                    , FechaCancelacion: ""
                    , FechaDevolucion: ""
                    , EstatusID: 0
                    , EstatusDes: ""
                    , Descripcion: ""
                    , Cancelada: 0
                    , RecepcionParcial: 0
                    , Devolucion: 0
                    , OrdenID: 0
                    , ReOrdenID: 0
                    , SurtidoID: 0
                    , DevolucionID: 0
                    , ComprobanteDoc: ""
                    , DocumentoID: 0
                    , ComprobanteFirma: ""
                    , FirmaDocID: 0
                    , ProductoID: 0
                    , EmpresaId: 0
                    , Pendientes: 0
                    , DetalleRecepcion: []
                }
            }
        }))
        FNGetLocal();

    }

    const cbActualizar = (item: any) => {
        toast.success('El movimiento se actualizo correctamente')
        setState(state => ({
            ...state,
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    RecepcionID: 0
                    , SolicitudID: 0
                    , SurteID: 0
                    , NombreSurte: ""
                    , RecibeID: 0
                    , NombreRecibe: ""
                    , CancelaID: 0
                    , NombreCancela: ""
                    , DevuelveID: 0
                    , NombreDevolucion: ""
                    , FechaSurtido: ""
                    , FechaRecepcion: ""
                    , FechaCancelacion: ""
                    , FechaDevolucion: ""
                    , EstatusID: 0
                    , EstatusDes: ""
                    , Descripcion: ""
                    , Cancelada: 0
                    , RecepcionParcial: 0
                    , Devolucion: 0
                    , OrdenID: 0
                    , ReOrdenID: 0
                    , SurtidoID: 0
                    , DevolucionID: 0
                    , ComprobanteDoc: ""
                    , DocumentoID: 0
                    , ComprobanteFirma: ""
                    , FirmaDocID: 0
                    , ProductoID: 0
                    , EmpresaId: 0
                    , Pendientes: 0
                    , DetalleRecepcion: []
                }
            }
        }
        ))
        FNGetLocal();
    }

    const abrirModalCrearMovimiento = () => {
        setState(state => ({
            ...state,
            Form: {
                ...state.Form, MostrarCrearMovimiento: true,

            }
        }
        ))
    }
    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Recepción de Orden">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        paginationComponentOptions={{ rowsPerPageText: 'Resultados por página:', rangeSeparatorText: 'of', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'Todos' }}
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        {/* <Field name={"EstatusID"} className="form-select"  >
                                                            {(control: any) => ( 
                                                                <select
                                                                    className="form-select"

                                                                    //options={state.OptionsEstatus}                                                                  
                                                                    value={control.field.value}
                                                                    onChange={(value: any) => {
                                                                        control.form.setFieldValue("EstatusID", parseInt(value.target.value))
                                                                    }}
                                                                    //disabled={false}
                                                                    id={"EstatusID"}
                                                                    name={"EstatusID"}
                                                                >
                                                                    <option value="0">{"Selecciona"}</option>
                                                                    {state.OptionsEstatus.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                                                </select>
                                                             )}
                                                       </Field> */}
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"RecepcionID"}
                                        defaultSortField={"RecepcionID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar} center={true} xlarge>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Recepcion Uniformes</h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                cambiarPiezas={cambiarPiezas}
                                                cambiarPendientes={cambiarPendientes}
                                                abrirModalCrearMovimiento={abrirModalCrearMovimiento}
                                            />}
                                        </ModalWin.Body>
                                    </ModalWin>
                                    {state.Form.CargarDocumento && <ModalWin open={state.Form.CargarDocumento} center large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Agregar Comprobante</h5>
                                            <button type="button" className="delete" onClick={() => {
                                                fnCancelarMostrarCargaDeDocumento()
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormAgregarComprobante
                                                oidc={props.oidc}
                                                DocumentoID={state.DocumentoID === null ? 0 : state.DocumentoID}
                                                RecepcionID={state.Form.RecepcionID}
                                                initialValues={{ file: "" }}
                                                fnCancelarMostrarCargaDeDocumento={fnCancelarMostrarCargaDeDocumento}
                                                FNGetLocal={FNGetLocal}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>}
                                    {state.Form.CargarFirma && <ModalWin open={state.Form.CargarFirma} center large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Agregar Firma</h5>
                                            <button type="button" className="delete" onClick={() => {
                                                fnCancelarCargaFirma()
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormAgregarFirma
                                                oidc={props.oidc}
                                                RecepcionID={state.Form.RecepcionID}
                                                initialValues={{ file: "" }}
                                                fnCancelarCargaFirma={fnCancelarCargaFirma}
                                                FNGetLocal={FNGetLocal}
                                                FirmaDocID={state.FirmaDocID == null ? 0 : state.FirmaDocID}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>}
                                    {state.Form.VerDoc && <ModalWin open={state.Form.VerDoc} center large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Visor de Archivos</h5>
                                            <button type="button" className="delete" onClick={() => {
                                                fnCancelarVerDocumento()
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormVerComprobante
                                                oidc={props.oidc}
                                                RecepcionID={state.Form.RecepcionID}
                                                DocumentoID={state.DocumentoID === null ? 0 : state.DocumentoID}
                                                file={state.Form.ComprobanteDoc}
                                                fnCancelarVerDocumento={fnCancelarVerDocumento}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>}
                                    {state.Form.VerFirma && <ModalWin open={state.Form.VerFirma} center large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Visor de Firmas</h5>
                                            <button type="button" className="delete" onClick={() => {
                                                fnCancelarVerFirma()
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CFormVerFirma
                                                oidc={props.oidc}
                                                RecepcionID={state.Form.RecepcionID}
                                                FirmaDocID={state.FirmaDocID == null ? 0 : state.FirmaDocID}
                                                fnCancelarVerFirma={fnCancelarVerFirma}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>}
                                </div>
                            }
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>
        </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})
const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogoRecepcionUniforme);