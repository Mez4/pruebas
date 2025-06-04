import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import * as Funciones from './CatalogoSolicitudUniforme/Funciones'
import { toast } from 'react-toastify'

// Icons
import { FaArrowRight, FaCheck, FaCheckCircle, FaCircle, FaCircleNotch, FaClone, FaEye, FaInfoCircle, FaLine, FaPencilAlt, FaPlus, FaPrint, FaSearch, FaSpinner } from 'react-icons/fa'
// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CatalogoSolicitudUniforme/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { inputCSS } from 'react-select/src/components/Input'
import moment from 'moment'
import { ErrorMessage, Field } from 'formik'
import ReactTooltip from 'react-tooltip'

type CatalogosType = {
    oidc: IOidc
}

const CatalogoSolicitudUniforme = (props: CatalogosType) => {    // Controll our mounted state
    let isMounted = React.useRef(true)
    const OptionsCorte: any[] = []
    const DatosMostrar: any[] = []

    const DatosDefecto = {
        SolicitudID: 0,
        SolicitanteID: 0,
        NombreSolicita: '',
        RecepcionaID: 0,
        NombreRecepciona: '',
        CancelaID: 0,
        NombreCancela: '',
        FechaSolicitud: '',
        FechaRecepcion: '',
        FechaCancelacion: '',
        EstatusID: 0,
        EstatusDes: '',
        Piezas: 0,
        Descripcion: '',
        OrdenID: 0,
        ReOrdenID: 0,
        RecepcionID: 0,
        Recepcionado: 0,
        Aprobado: 0,
        RecepcionParcialID: 0,
        DevolucionID: 0,
        ProductoID: 0,
        EmpresaId: 0,
        DetalleSolicitud:
            [{
                SolicitudDetalleID: 0,
                SolicitudID: 0,
                ProductoUniformeID: 0,
                ProductoUniformeDesc: '',
                PiezasSolicitadas: 0,
                PiezasRecepcionadas: 0,
            }],
        ProductoUniformeID: 0,
    }
    const Datos: any[] = []

    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            MostrarCrearMovimiento: false,
            CargarMapEstatus: false,
            Id: 0,
            EstatusID: 0,
        },
        OptionsCorte,
    })

    const FNGetLocal = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const FNGetDatos = () => {
        setState(s => ({ ...s, Cargando: false }))
        Funciones.FNGet(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Datos: [] }))
                }
            })
    }

    const agregarConjunto = (item: any) => {
        state.Form.Datos.DetalleSolicitud.push(item)
        setState(s => ({
            ...s, Form: {
                ...s.Form, Datos: state.Form.Datos
            }
        }))
    }

    const eliminarConjunto = (item: any) => {
        let index = state.Form.Datos.DetalleSolicitud.findIndex((respuesta: any) => {
            return respuesta.Identificador === item.Identificador
        })
        state.Form.Datos.DetalleSolicitud.splice(index, 1)
        setState(s => ({
            ...s, Form: {
                ...s.Form, Datos: state.Form.Datos
            }

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
                name: 'N° Solicitud',
                selector: 'SolicitudID',
                sortable: true,
                center: true,
            },
            {
                name: 'Solicita',
                selector: 'NombreSolicita',
                sortable: false,
                center: true,
                cell: row => <span className='text-center'>{row.NombreSolicita}</span>
            },
            {
                name: 'Fecha Solicitud',
                selector: 'FechaSolicitud',
                sortable: false,
                center: true,
                cell: row => <span className='text-center'>{row.FechaSolicitud == undefined ? "--" : moment(row.FechaSolicitud).format("DD-MM-YYYY hh:mm:ss")}</span>

            },
            {
                name: 'Estatus',
                selector: 'EstatusID',
                sortable: false,
                center: true,
                cell: (propss) =>
                    propss.EstatusID == 2 ?
                        <span className='text-center'>{<FaCircle color={estatusColor(propss.EstatusID)} />}</span>
                        :
                        <button data-tip data-for="Btn_verEst" className="asstext" type={"button"} onClick={() => {
                            fnMostrarMapaEstatus(propss.EstatusID)
                        }}>
                            <FaCircle /*className='fa-2x'*/ color={estatusColor(propss.EstatusID)} />
                            <ReactTooltip id="Btn_verEst" type="info" effect="solid">Seguimiento</ReactTooltip>
                        </button>
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
                cell: row => <span className='text-center'>{row.Descripcion}</span>
            },
            {
                name: 'Acciones',
                sortable: false,
                center: true,
                cell: (props) =>
                    <button className="asstext" type={"button"} onClick={() => {
                        let nuevo = {
                            SolicitudID: props.SolicitudID,
                            SolicitanteID: props.SolicitanteID,
                            NombreSolicita: props.NombreSolicita,
                            RecepcionaID: props.RecepcionaID,
                            NombreRecepciona: props.NombreRecepciona,
                            CancelaID: props.CancelaID,
                            NombreCancela: props.NombreCancela,
                            FechaSolicitud: props.FechaSolicitud,
                            FechaRecepcion: props.FechaRecepcion,
                            FechaCancelacion: props.FechaCancelacion,
                            EstatusID: props.EstatusID,
                            EstatusDes: props.EstatusDes,
                            Piezas: props.Piezas,
                            Descripcion: props.Descripcion,
                            OrdenID: props.OrdenID,
                            ReOrdenID: props.ReOrdenID,
                            RecepcionID: props.RecepcionID,
                            Recepcionado: props.Recepcionado,
                            Aprobado: props.Aprobado,
                            RecepcionParcialID: props.RecepcionParcialID,
                            DevolucionID: props.DevolucionID,
                            ProductoID: props.ProductoID,
                            EmpresaId: props.EmpresaId,
                            DetalleSolicitud: props.DetalleSolicitud,
                            ProductoUniformeID: 0,
                        }
                        console.log(nuevo)
                        setState(s => ({
                            ...s,
                            Form: {
                                ...s.Form,
                                Mostrar: true,
                                Datos: nuevo,
                                Id: props.SolicitudID
                            }
                        }))
                    }}>
                        <FaEye data-tip data-for="Btn_VerDet" />
                        <ReactTooltip id="Btn_VerDet" type="info" effect="solid">Ver Detalle</ReactTooltip>
                    </button>
            },
        ]


    React.useEffect(() => {
        FNGetLocal()
        FNGetCorte()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    const fnMostrarMapaEstatus = (EstatusID: number) => {
        setState(s => ({
            ...s, Form: {
                ...s.Form, CargarMapEstatus: true, EstatusID: EstatusID
            }
        }))
    }

    const fnCancelarMapaEstatus = () => {
        setState(s => ({
            ...s, Form: {
                ...s.Form, CargarMapEstatus: false,
            }
        }))
    }
    const cbAgregar = (item: any) => {
        toast.success('Se agrego correctamente')
        setState(state => ({
            ...state, Datos: [...state.Datos, item],
            Form: {
                ...state.Form, Mostrar: false,
                Datos: {
                    SolicitudID: 0,
                    SolicitanteID: 0,
                    NombreSolicita: '',
                    RecepcionaID: 0,
                    NombreRecepciona: '',
                    CancelaID: 0,
                    NombreCancela: '',
                    FechaSolicitud: '',
                    FechaRecepcion: '',
                    FechaCancelacion: '',
                    EstatusID: 0,
                    EstatusDes: '',
                    Piezas: 0,
                    Descripcion: '',
                    OrdenID: 0,
                    ReOrdenID: 0,
                    RecepcionID: 0,
                    Recepcionado: 0,
                    Aprobado: 0,
                    RecepcionParcialID: 0,
                    DevolucionID: 0,
                    ProductoID: 0,
                    EmpresaId: 0,
                    DetalleSolicitud: [],
                    ProductoUniformeID: 0,
                }
            }
        }))
        FNGetDatos();
    }

    const FNGetCorte = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetCorte(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var corte = respuesta.map((valor: any) => {
                        var obj = { value: valor.ProductoUniformeID, label: valor.ProductoUniformeDesc + " - " + valor.Clave };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsCorte: corte }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsCorte: [] }))
                }
            })
    }

    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Solicitud">
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
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => {
                                                                state.Form.Datos.DetalleSolicitud.splice(0, 1)
                                                                setState({
                                                                    ...state, Form: {
                                                                        ...state.Form,
                                                                        Id: 0,
                                                                        Mostrar: true,
                                                                        Datos: {
                                                                            SolicitudID: 0,
                                                                            SolicitanteID: 0,
                                                                            NombreSolicita: '',
                                                                            RecepcionaID: 0,
                                                                            NombreRecepciona: '',
                                                                            CancelaID: 0,
                                                                            NombreCancela: '',
                                                                            FechaSolicitud: '',
                                                                            FechaRecepcion: '',
                                                                            FechaCancelacion: '',
                                                                            EstatusID: 0,
                                                                            EstatusDes: '',
                                                                            Piezas: 0,
                                                                            Descripcion: '',
                                                                            OrdenID: 0,
                                                                            ReOrdenID: 0,
                                                                            RecepcionID: 0,
                                                                            Recepcionado: 0,
                                                                            Aprobado: 0,
                                                                            RecepcionParcialID: 0,
                                                                            DevolucionID: 0,
                                                                            ProductoID: 0,
                                                                            EmpresaId: 0,
                                                                            DetalleSolicitud: [],
                                                                            ProductoUniformeID: 0,
                                                                        },
                                                                    }
                                                                })
                                                            }}><FaPlus /></button>
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
                                        keyField={"SolicitudID"}
                                        defaultSortField={"SolicitudID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar} center={true} xlarge>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>{state.Form.Id == 0 ? "Agregar Solicitud" : "Solicitud"}</h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                optionsCorte={state.OptionsCorte}
                                                agregarConjunto={agregarConjunto}
                                                eliminarConjunto={eliminarConjunto}
                                            />}
                                        </ModalWin.Body>
                                    </ModalWin>
                                    {state.Form.CargarMapEstatus && <ModalWin open={state.Form.CargarMapEstatus} center large>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>Seguimiento de la Solicitud</h5>
                                            <button type="button" className="delete" onClick={() => {
                                                fnCancelarMapaEstatus()
                                            }} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <div className="columns is-centered is-mobile is-multiline">
                                                <div className="column text-center is-full-desktop is-full-mobile">
                                                    <br /><br />
                                                    <span className='text-center'>
                                                        <FaCircle data-tip data-for="Btn_Est1" className='fa-2x' color={estatusColor(state.Form.EstatusID == 1 || state.Form.EstatusID == 3 || state.Form.EstatusID == 11 || state.Form.EstatusID == 12 || state.Form.EstatusID == 4 || state.Form.EstatusID == 13 || state.Form.EstatusID == 15 || state.Form.EstatusID == 16 || state.Form.EstatusID == 18 || state.Form.EstatusID == 19 || state.Form.EstatusID == 17 ? 1 : 0)} /><ReactTooltip disable={state.Form.EstatusID == 1 ? false : true} id="Btn_Est1" type="info" effect="solid">Pendiente de Aprobacion</ReactTooltip>&nbsp;&nbsp;
                                                        <FaArrowRight data-tip data-for="Btn_Est1_1" className='fa-2x' color={estatusColor(state.Form.EstatusID == 1 || state.Form.EstatusID == 3 || state.Form.EstatusID == 11 || state.Form.EstatusID == 12 || state.Form.EstatusID == 4 || state.Form.EstatusID == 13 || state.Form.EstatusID == 15 || state.Form.EstatusID == 16 || state.Form.EstatusID == 18 || state.Form.EstatusID == 19 || state.Form.EstatusID == 17 ? 1 : 0)} /><ReactTooltip disable={state.Form.EstatusID == 1 ? false : true} id="Btn_Est1_1" type="info" effect="solid">Aprobando...</ReactTooltip>&nbsp;&nbsp;

                                                        <FaCircle data-tip data-for="Btn_Est2" className='fa-2x' color={estatusColor(state.Form.EstatusID == 3 || state.Form.EstatusID == 11 || state.Form.EstatusID == 12 || state.Form.EstatusID == 4 || state.Form.EstatusID == 13 || state.Form.EstatusID == 15 || state.Form.EstatusID == 16 || state.Form.EstatusID == 18 || state.Form.EstatusID == 19 || state.Form.EstatusID == 17 ? 3 : 0)} /><ReactTooltip disable={state.Form.EstatusID == 3 ? false : true} id="Btn_Est2" type="info" effect="solid">Pendiente de Autorizacion</ReactTooltip>&nbsp;&nbsp;
                                                        <FaArrowRight data-tip data-for="Btn_Est2_2" className='fa-2x' color={estatusColor(state.Form.EstatusID == 3 || state.Form.EstatusID == 11 || state.Form.EstatusID == 12 || state.Form.EstatusID == 4 || state.Form.EstatusID == 13 || state.Form.EstatusID == 15 || state.Form.EstatusID == 16 || state.Form.EstatusID == 18 || state.Form.EstatusID == 19 || state.Form.EstatusID == 17 ? 3 : 0)} /><ReactTooltip disable={state.Form.EstatusID == 3 ? false : true} id="Btn_Est2_2" type="info" effect="solid">Autorizando...</ReactTooltip>&nbsp;&nbsp;

                                                        <FaCircle data-tip data-for="Btn_Est3" className='fa-2x' color={estatusColor(state.Form.EstatusID == 11 || state.Form.EstatusID == 12 || state.Form.EstatusID == 4 || state.Form.EstatusID == 13 || state.Form.EstatusID == 17 || state.Form.EstatusID == 15 || state.Form.EstatusID == 16 || state.Form.EstatusID == 18 || state.Form.EstatusID == 19 ? 11 : 0)} /><ReactTooltip disable={state.Form.EstatusID == 11 || state.Form.EstatusID == 15 || state.Form.EstatusID == 16 ? false : true} id="Btn_Est3" type="info" effect="solid">Pendiente de Surtir</ReactTooltip>&nbsp;&nbsp;
                                                        <FaArrowRight data-tip data-for="Btn_Est3_3" className='fa-2x' color={estatusColor(state.Form.EstatusID == 11 || state.Form.EstatusID == 12 || state.Form.EstatusID == 4 || state.Form.EstatusID == 13 || state.Form.EstatusID == 17 || state.Form.EstatusID == 15 || state.Form.EstatusID == 16 || state.Form.EstatusID == 18 || state.Form.EstatusID == 19 ? 11 : 0)} /><ReactTooltip disable={state.Form.EstatusID == 11 || state.Form.EstatusID == 15 || state.Form.EstatusID == 16 ? false : true} id="Btn_Est3_3" type="info" effect="solid">Surtiendo...</ReactTooltip>&nbsp;&nbsp;

                                                        <FaCircle data-tip data-for="Btn_Est4" className='fa-2x' color={estatusColor(state.Form.EstatusID == 12 || state.Form.EstatusID == 4 || state.Form.EstatusID == 13 || state.Form.EstatusID == 17 || state.Form.EstatusID == 18 || state.Form.EstatusID == 19 ? 12 : 0)} /><ReactTooltip disable={state.Form.EstatusID == 12 ? false : true} id="Btn_Est4" type="info" effect="solid">Surtido</ReactTooltip>&nbsp;&nbsp;
                                                        <FaArrowRight data-tip data-for="Btn_Est4_4" className='fa-2x' color={estatusColor(state.Form.EstatusID == 12 || state.Form.EstatusID == 4 || state.Form.EstatusID == 13 || state.Form.EstatusID == 17 || state.Form.EstatusID == 18 || state.Form.EstatusID == 19 ? 12 : 0)} /><ReactTooltip disable={state.Form.EstatusID == 12 ? false : true} id="Btn_Est4_4" type="info" effect="solid">Enviando...</ReactTooltip>&nbsp;&nbsp;

                                                        <FaCircle data-tip data-for="Btn_Est5" className='fa-2x' color={estatusColor(state.Form.EstatusID == 4 || state.Form.EstatusID == 13 || state.Form.EstatusID == 18 || state.Form.EstatusID == 19 || state.Form.EstatusID == 17 ? 4 : 0)} /><ReactTooltip disable={state.Form.EstatusID == 4 ? false : true} id="Btn_Est5" type="info" effect="solid">Enviado</ReactTooltip>&nbsp;&nbsp;
                                                        <FaArrowRight data-tip data-for="Btn_Est5_5" className='fa-2x' color={estatusColor(state.Form.EstatusID == 4 || state.Form.EstatusID == 13 || state.Form.EstatusID == 18 || state.Form.EstatusID == 19 || state.Form.EstatusID == 17 ? 4 : 0)} /><ReactTooltip disable={state.Form.EstatusID == 4 ? false : true} id="Btn_Est5_5" type="info" effect="solid">...</ReactTooltip>&nbsp;&nbsp;

                                                        <FaCircle data-tip data-for="Btn_Est6" className='fa-2x' color={estatusColor(state.Form.EstatusID == 13 || state.Form.EstatusID == 17 || state.Form.EstatusID == 18 || state.Form.EstatusID == 19 ? 13 : 0)} /><ReactTooltip disable={state.Form.EstatusID == 13 || state.Form.EstatusID == 18 || state.Form.EstatusID == 19 ? false : true} id="Btn_Est6" type="info" effect="solid">Pendiente de Recepcion</ReactTooltip>&nbsp;&nbsp;
                                                        <FaArrowRight data-tip data-for="Btn_Est6_6" className='fa-2x' color={estatusColor(state.Form.EstatusID == 13 || state.Form.EstatusID == 17 || state.Form.EstatusID == 18 || state.Form.EstatusID == 19 ? 13 : 0)} /><ReactTooltip disable={state.Form.EstatusID == 13 || state.Form.EstatusID == 18 || state.Form.EstatusID == 19 ? false : true} id="Btn_Est6_6" type="info" effect="solid">...</ReactTooltip>&nbsp;&nbsp;

                                                        <FaCircle data-tip data-for="Btn_Est7" className='fa-2x' color={estatusColor(state.Form.EstatusID == 17 ? 17 : 0)} /><ReactTooltip disable={state.Form.EstatusID == 17 ? false : true} id="Btn_Est7" type="info" effect="solid">Entregado/Recepcionado</ReactTooltip>&nbsp;&nbsp;
                                                    </span>
                                                    <br /><br />
                                                </div>
                                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(CatalogoSolicitudUniforme);