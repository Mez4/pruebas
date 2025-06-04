import withReactContent from "sweetalert2-react-content";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import Swal from "sweetalert2";
import moment from "moment";
import React, { useEffect, useState, useRef } from "react";
import * as Funciones from './CreditoSolicitudCRS/FuncionesSCRS';
import { toast } from "react-toastify";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { connect } from "react-redux";
import { ActionSelect, Card, DatePickeEnd, DatePickeStart, ModalWin, Spinner } from "../../../../global";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import { FaBan, FaCheckCircle, FaCross, FaExclamationCircle, FaFile, FaFileContract, FaFilter, FaSearch } from "react-icons/fa";
import ReactTooltip from "react-tooltip";
import CFormCRS2 from "./CreditoComisionReestructura/CFormCRS2";
import { MODAL_TITLE_CLASS } from "../../../../global/ModalWin";
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { FiRefreshCcw } from "react-icons/fi";
import { start } from "repl";
import CFormSCRSDocumentos from "./CreditoSolicitudCRS/CFormSCRSDocumentos";
import { addOneDay, FiltrarDatos } from '../../../../../global/functions'
import { FormateoDinero } from "../../../../../global/variables";
import { TbFileCheck } from "react-icons/tb";
import Distribuidor from "../../distribuidor/Distribuidor";
type CatalogosType = {
    oidc: IOidc,
}
const SolicitudConveniosReestructuras = (props: CatalogosType) => {

    const MySwal = withReactContent(Swal)
    const [startDate, setStartDate] = useState(moment().add(-1, 'y').toDate());
    const [endDate, setEndDate] = useState(moment().toDate());
    const [loading, setLoading] = React.useState(false)
    const [loading2, setLoading2] = React.useState(false)
    const optSucursales: any[] = []
    const notas: any[] = []
    // COMPROBAR SI EL COMPONENTE ESTA MONTADO
    const isMounted = useRef(true);

    const optEstatus: any[] = []
    const optAnalistas: any[] = []
    // FECHA ACTUAL
    const DataSolicitud: any[] = [];
    const datosPlanPagos: any[] = []

    const [state, setState] = useState({
        SolicitudRCID: 0,
        DistribuidorID: 0,
        DistribuidorNombre: '',
        Cargando: false,
        ShowCRS: false,
        ShowCCF: false,
        verNotas: false,
        verDocs: false,
        DataSolicitud,
        FiltroEstatus: 0,
        FiltroSucursal: 0,
        FiltroAnalista: 0,
        notas,
        FiltroBusqueda: '',
        optSucursales,
        optEstatus,
        optAnalistas,
        DatosDetalleCF: [],
        TipoAnalista: '',
        showPlanPagos: false,
        datosPlanPagos,
        Form: {
            Mostrar: false, VerDoc: false, VerInfo: false, MostrarMensajes: false,
        },
    });
    const EstadoDefecto =
    {
        Filtro: '',
        Cargando: false,
        Error: false,
        Forma: false,
        Datos: [],
        filteredData: [],
        defaultSortAsc: true,
        defaultSortField: 'NombreCompleto',
        paginationDefaultPage: 1,
    }


    const [Estado, DefinirEstado] = React.useState(EstadoDefecto)


    function ActualizarTabla() {
        ObtenerDatos();
    }

    const ObtenerDatos = () => {
        Funciones.GetSolicitudes(props.oidc)
            .then((respuesta: any) => {
                // MAPEAR PARA DARLE FORMATO A LA FECHAREGISTRO 'DD/MM/YYYY'
                // respuesta.map((solicitud: any) => {
                //     solicitud.FechaRegistro = moment(solicitud.FechaRegistro).format("DD/MM/YYYY")
                // })
                setState(s => ({ ...s, DataSolicitud: respuesta }))
                console.log("###", respuesta);

            }).catch((error) => {
                console.log("###e", error)
                toast.error("Error al obtener los datos");
            });
    }
    const toggleModalDocs = () => {
        setState(s => ({ ...s, verDocs: !state.verDocs }));
    }
    // FUNCION PARA LLAMAR EL MODAL DE CONVENIOS Y REESTRUCTURAS
    const toggleModalCRS = () => {
        setState(s => ({ ...s, ShowCRS: !state.ShowCRS }));
    }
    //FUNCION PARA OBTENER LOS LOS ANALISTAS
    const FNGetAnalistas = () => {
        Funciones.GetAnalistas(props.oidc)
            .then((respuesta: any) => {
                console.log("###", respuesta);

                var analista = respuesta.map((res: any) => {
                    return { value: res.PersonaID, label: res.NombreCompleto }
                });
                setState(s => ({ ...s, optAnalistas: analista }))
            }).catch((error) => {
                toast.error("Error al obtener los analistas");
            });
    }
    //FUNCION PARA OBTENER TIPO DE ANALISTA
    const FNGetTipoAnalista = () => {
        Funciones.GetTipoAnalista(props.oidc)
            .then((respuesta: any) => {
                console.log("TipoAnalista", respuesta);

                setState(s => ({ ...s, TipoAnalista: respuesta.Clave }))
            }).catch((error) => {
                toast.error("Error al obtener los analistas");
            });
    }
    //FUNCION PARA OBTENER LAS SUCURSALES
    const FNGetSucursales = () => {
        Funciones.GetSucursales(props.oidc)
            .then((respuesta: any) => {


                var estatus = respuesta.map((sucursal: any) => {
                    return { value: sucursal.SucursalID, label: sucursal.Nombre }
                })
                setState(s => ({ ...s, optSucursales: estatus }))
            }).catch((error) => {
                toast.error("Error al obtener las sucursales");
            });
    }
    //FUNCION PARA OBTENER LAS NOTAS
    const FNGetNotas = (solicitudRCID, DistribuidorID) => {
        console.log(solicitudRCID, DistribuidorID);

        var obj = {
            SolicitudRCID: parseInt(solicitudRCID),
            DistribuidorID: parseInt(DistribuidorID)
        }
        Funciones.GetNotas(props.oidc, obj)
            .then((respuesta: any) => {
                console.log("###", respuesta);
                setState(s => ({ ...s, notas: respuesta, verNotas: true }))
            }).catch((error) => {
                toast.error("Error al obtener las notas");
            });
    }

    const FNGetDetalle = (SolicitudID: number, DistribuidorID: number) => {
        // SwalWarning('Aviso', 'Obteniendo Plan de Pagos.');
        console.log('3entroooooooooooooo')
        setState(s => ({ ...s, DatosDetalleCredito: [], ShowCCF: true, SolicitudRCID: SolicitudID, DistribuidorID: DistribuidorID }))
        let Datos = {
            SolicitudRCID: SolicitudID,
            DistribuidorID: DistribuidorID
        }
        Funciones.FNGetResCF(props.oidc, Datos)
            .then((respuesta: any) => {
                console.log(respuesta);

                if (respuesta.length > 0) {
                    // setState(s => ({ ...s, MultiSaldoCajaID: respuesta[0].MultisaldosCajaID }))

                    setState(s => ({ ...s, DatosDetalleCF: respuesta }))
                    // MySwal.close();
                } else {
                    setState(s => ({ ...s, DatosDetalleCF: [] }))
                    // MySwal.close();
                }


            })
            .catch((error: any) => {
                // if (isMounted.current === true) {
                console.log(error);

                setState(s => ({ ...s, ShowCCF: false, DatosDetalleCredito: [] }))
                MySwal.close();
                toast.error("Error al consultar, vuelva a intentarlo")
                // }
            })
    }

    const FNValidarSolicitud = (SolicitudID: number, DistribuidorID: number) => {
        MySwal.fire({
            title: "<strong>Validar Solicitud</strong>",
            icon: "question",
            inputAttributes: {
                autocapitalize: "off",
            },
            html: (
                <div className="text-center">
                    Se validará la solicitud ¿Desea continuar? Una vez validada ya no se podrá revertir la acción.
                </div>
            ),
            showCloseButton: false,
            showCancelButton: true,
            showConfirmButton: true,
            showLoaderOnConfirm: true,
            focusConfirm: false,
            cancelButtonText: "Cancelar",
            confirmButtonText: "Aceptar",
            confirmButtonAriaLabel: "Aceptar",
            cancelButtonAriaLabel: "",
        }).then((result) => {
            if (result.isConfirmed) {
                let Datos = {
                    SolicitudRCID: SolicitudID,
                    DistribuidorID: DistribuidorID
                };
                Funciones.FNValidarSolicitud(props.oidc, Datos)
                .then(() => {
                    toast.success('Solicitud Validada Correctamente');
                })
                 .catch((err) => {
                               toast.error(
                                 err
                               );
                             });
                    
            }
        })
    };
    


    const FNAceptarRCF = () => {
        let datos = {
            DistribuidorID: state.DistribuidorID,
            SolicitudRCID: state.SolicitudRCID
        }
        Funciones.FNAdd(props.oidc, datos)
            .then((respuesta: any) => {
                setState({ ...state, ShowCCF: false })
                setLoading(false)
                toast.success(respuesta.msg);
                ActualizarTabla();
            })
            .catch((error: any) => {
                // toast.error(`Error al aceptar la solicitud`);
                if (error.response)
                    toast.error(`${error.response.data.msg}`);
                else if (error.request) toast.error(`Request ${error}`);
                else toast.error(`${error.response}`);
                setLoading(false);
            });
    }

    //FUNCION PARA CANCELAR LA SOLICITUD
    const CancelarSolicitud = (SolicitudRCID: number) => {
        MySwal.fire({
            title: '<h2 class="title is-5">¿Deseas cancelar la solicitud </h2>',
            html:

                <div >
                    <p className="text-center title is-6">No habra cambios despues de confirmar</p>
                    <p className="text-center">Por favor introduzca razon o motivo de cancelacion</p>
                    {/* INPUTA PARA SOLICITAR UN MOTIVO DE CANCELACION */}
                    {/* Hacer un formik para este input */}
                    <Formik
                        initialValues={{
                            ComentariosCancelacion: ''
                        }}
                        onSubmit={(values) => {
                            console.log("###", values);
                            var obj = {
                                SolicitudRCID: SolicitudRCID,
                                ComentariosCancelacion: values.ComentariosCancelacion
                            }
                            Funciones.CancelarSolicitud(props.oidc, obj)
                                .then((respuesta: any) => {
                                    toast.warning("Solicitud cancelada correctamente");
                                    MySwal.close();
                                    setState(s => ({ ...s, DataSolicitud: respuesta }))
                                }).catch((error: any) => {
                                    toast.error("Error al cancelar la solicitud");
                                });
                        }}
                        validationSchema={Yup.object().shape({
                            ComentariosCancelacion: Yup.string().required("Campo obligatorio").typeError("Campo obligatorio")
                        })}
                    >
                        <Form>
                            <div className="form-control mb-3">
                                <Field type="text" className="input d-block" placeholder="Motivo de cancelación" name="ComentariosCancelacion" id="ComentariosCancelacion" />
                                <ErrorMessage name="ComentariosCancelacion" component="div" className="text-danger" />
                            </div>
                            <footer className="modal-card-foot d-flex justify-content-end">
                                {/* <button className="button is-danger" onClick={() => props.fnAbrir_Cerrar()}>Cancelar</button> */}
                                {/* <button className="button is-primary text-center" disabled={state.initialValues.SolicitudRCID <= 0 ? false : true} onClick={() => setLoading(true)} type="submit">{loading ? <Spinner /> : "Asignar"}</button> */}
                                <button className="button is-danger" onClick={() => MySwal.close()}>Cancelar</button>
                                <button className="button is-link" type="submit" >Aceptar</button>
                                {/* Boton para cerrar el modal */}
                            </footer>
                        </Form>
                    </Formik>
                </div>,
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            //NO TENER BOTONES DE CONFIRMACION
            showConfirmButton: false,

            // confirmButtonText: 'Si, cancelar solicitud!'
        }).then((result) => {
            if (result.isConfirmed) {

            }
        })
    }

    const planPagos = (DistribuidorID: any) => {
        setState(s => ({ ...s, showPlanPagos: true }))
        // console.log('objPlazos', objPlazos);
        Funciones.FNGetSimulacionPlazos(props.oidc, DistribuidorID)
            .then((res: any) => {
                // console.log(res);
                setState(s => ({ ...s, datosPlanPagos: res }));
            }).catch((error: any) => {
                toast.error(`Error: ${error.response}`);
            })
    }

    const fnGetFiltrosSucursales = (SucursalID: number) => {
        console.log(SucursalID)
        setState(s => ({ ...s, FiltroSucursal: SucursalID }))
    }

    const fnGetFiltroEstatus = (EstatusID: number) => {
        setState(s => ({ ...s, FiltroEstatus: EstatusID }))
    }
    const fnGetFiltroAnalista = (PersonaID: number) => {
        setState(s => ({ ...s, FiltroAnalista: PersonaID }))
    }
    const fnCancelarPlanPagos = () => setState({ ...state, showPlanPagos: false, Form: { ...state.Form, Mostrar: false, } })
    //ARREGLO DE OPCIONES DE ESTATUS
    const EstatusOptions = [
        { value: 0, label: 'TODOS' },
        { value: 1, label: 'CANCELADOS' },
        { value: 2, label: 'ACTIVOS' },
        { value: 3, label: 'VALIDADOS' },
        { value: 4, label: 'RE-VALIDADOS' }
    ]
    // const [filteredData, setFilteredData] = useState([]);}

    const DetailColumnsCredito = React.useMemo(() => {
        let colRet: IDataTableColumn[] = [
            {
                name: 'CreditoID', width: '10%', selector: 'CreditoID', sortable: false, cell: (props) => <span style={{ width: '95px', whiteSpace: 'nowrap', overflow: 'hidden' }}>{props.CreditoID}</span>
            },
            {
                name: 'Cliente', width: '25%', selector: 'Cliente', sortable: true, cell: (props) => <span>{props.Cliente}</span>
            },
            {
                name: 'ClienteID', width: '10%', selector: 'ClienteID', sortable: false, cell: (props) => <span style={{ width: '95px', whiteSpace: 'nowrap', overflow: 'hidden' }}>{props.ClienteID}</span>
            },
            {
                name: 'SaldoActual', width: '15%', selector: 'SaldoActual', sortable: false, cell: (props) =>
                    <span className="text-center">
                        {FormateoDinero.format(props.SaldoActual)}
                    </span>
            },
            {
                name: 'Plazos Solicita', width: '10%', selector: 'PlazosSolicita', sortable: false, cell: (props) => <span style={{ width: '95px', whiteSpace: 'nowrap', overflow: 'hidden' }}>{props.PlazosSolicita}</span>
            },
            {
                name: 'Persona Solicita', width: '20%', selector: 'PersonaSolicita', sortable: false, cell: (props) => <span style={{ width: '95px', whiteSpace: 'nowrap', overflow: 'hidden' }}>{props.PersonaSolicita}</span>
            },
            {
                name: 'Fecha Solicita', width: '15%', selector: 'FechaSolicita', sortable: false, cell: (props) => <span>{moment(addOneDay(new Date(props.FechaSolicita))).format('DD/MM/YYYY')}</span>
            },

        ];
        return colRet;
    }, []);

    const [filteredData, setFilteredData] = useState<any[]>([]);

    const fnFiltrando = () => {
        let data = state.DataSolicitud;
        // console.log("aaaaa", state.DataSolicitud);
        // console.log("la fecha es :", startDate);
        // Crear una varuiable para guardar un estatus segun lo que me llega de state.filtroEstatus
        // CHECAR SI EL FILTROBUSQUEDA NO ESTA VACIO



        if (state.FiltroEstatus > 0) {
            var estatus = state.FiltroEstatus == 1 ? 'C'
                : state.FiltroEstatus == 2 ? 'A'
                    : state.FiltroEstatus == 3 ? 'V'
                        : state.FiltroEstatus == 4 ? 'X' : 0;
            // FILTRAR POR ESTATUS DE LA TABLA Y SI ES 0 MOSTRAR TODOS
            if (estatus) {
                data = data.filter((solicitud: any) => solicitud.Estatus === estatus)
            }
        }
        // FILTRAR POR SUCURSAL
        if (state.FiltroSucursal > 0) {
            data = data.filter((solicitud: any) => solicitud.SucursalID === state.FiltroSucursal)
        }
        // FILTRAR POR ANALISTA
        if (state.FiltroAnalista > 0) {
            data = data.filter((solicitud: any) => solicitud.PersonaID === state.FiltroAnalista)
        }
        // FILTRAR POR FECHA de stardate solamente
        if (startDate != null && endDate != null) {
            //FILTRADO POR FECHAREGISTRO DE MI TABLA SIN HORA Y SIN EL startdate
            data = data.filter((solicitud: any) => {
                return moment(solicitud.FechaRegistro).format('YYYY-MM-DD') <= moment(endDate).format('YYYY-MM-DD')
            })


            // startDate.setHours(0, 0, 0)
            // endDate.setHours(23, 59, 59)
            // data = data.filter(d => { return d.FechaRegistro >= startDate.toISOString() && d.FechaRegistro <= endDate.toISOString() || d.FechaRegistro === null })
        }
        data = FiltrarDatos(data, Columns, state.FiltroBusqueda)
        console.log(data);

        setFilteredData(data);
    }
    useEffect(() => {
        fnFiltrando();
    }, [state.FiltroEstatus, state.DataSolicitud, state.FiltroSucursal, startDate, state.FiltroAnalista, endDate, state.FiltroBusqueda])


    // FUNCION PARA COLOREAR UNA CELDA SEGUN EL ESTATUS DE LA SOLICITUD
    const conditionalRowStyles = [
        {
            when: row => row.Estatus === 'C',
            style: {
                backgroundColor: 'rgba(225, 0, 61, 0.2)',
            }
        },
        {
            when: row => row.Estatus === 'A',
            style: {
                backgroundColor: 'rgba(5, 207, 149, 0.2)',
            }
        }
    ]

    const Columns: IDataTableColumn[] = [
        //MOSTRAR 2 BOTONES EN UNA SOLA COLUMNA PARA ACEPTAR Y CANCELA LA SOLICITUD


        {
            name: 'Estatus',
            selector: 'Estatus',
            sortable: false,
            center: true,
            width: '200px',
            cell: (row: any) => {
                return <span className={`${row.Estatus === 'P' ? 'columnPulsing' : ''} text-center`}>{row.Descripcion}</span>
            }
        },
        {
            name: "Sucursal",
            selector: 'Sucursal_Nombre',
            sortable: true,
            width: '140px',
            cell: (row: any) =>
                <>
                    <span
                        data-tip
                        data-for={`CR_Sucursal_${row.SolicitudRCID}`}
                    >{row.Sucursal_Nombre}</span>
                    <ReactTooltip id={`CR_Sucursal_${row.SolicitudRCID}`} type="info" effect="solid">{row.Sucursal_Nombre}</ReactTooltip>
                </>
        },
        {
            name: "Distribuidor ID",
            selector: 'DistribuidorID',
            sortable: false,
            center: true,
            cell: (row: any) => <span className="text-center">{row.DistribuidorID}</span>
        },
        {
            name: "Nombre Distribuidor",
            selector: 'PersonaNombre',
            sortable: true,
            width: '200px',
            cell: (row: any) =>
                <>
                    <span
                        data-tip
                        data-for={`CR_Nombre_${row.SolicitudRCID}`}
                    >{row.PersonaNombre}</span>
                    <ReactTooltip id={`CR_Nombre_${row.SolicitudRCID}`} type="info" effect="solid">{row.PersonaNombre}</ReactTooltip>
                </>
        },
        {
            name: "Herramienta Rescate",
            selector: 'Accion',
            width: '150px',
            sortable: false,
            center: true,
            cell: (row: any) => {
                return <span className="text-center">{row.Accion === 1 ? "Convenio de Salida" : row.Accion === 2 ? "Reestructura" : row.Accion === 3 ? "Reestructura de Salida" : row.Accion === 4 ? "Reestructura Cliente F." : row.Accion === 5 ? 'Reconvenio' : "Sin herramienta"}</span>
            }
        },
        {
            name: "Tipo Reestructura",
            selector: 'TipoReestructura',
            sortable: true,
            cell: (row: any) => <span>{row.TipoReestructura ? row.TipoReestructura : "NO APLICA"}</span>
        },
        {
            name: "Motivo",
            selector: 'Motivo',
            sortable: false,
            center: true,
            cell: (row: any) =>
                <>
                    <span
                        className="text-center"
                        data-tip
                        data-for={`CR_Motivo_${row.SolicitudRCID}`}
                    >{row.Motivo}</span>
                    <ReactTooltip id={`CR_Motivo_${row.SolicitudRCID}`} type="info" effect="solid">{row.Motivo}</ReactTooltip>
                </>
        },
        {
            name: "Plazos",
            selector: 'Quincenas',
            sortable: true,
            center: true,
            cell: (row: any) => <p className="text-center">{row.Quincenas}</p>
        },
        {
            name: "Saldo Actual",
            selector: 'SaldoActual',
            sortable: true,
            cell: (row: any) => <span>{row.SaldoActual.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>
        },
        {
            name: "Saldo Atrasado",
            selector: 'SaldoAtrasado',
            sortable: true,
            cell: (row: any) => <span>{row.SaldoAtrasado.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>
        },
        {
            name: "Porcentaje Quita",
            selector: "PorcientoQuita",
            sortable: false,
            center: true,
            cell: (row: any) => <span className="text-center">{row.PorcientoQuita ? `%${row.PorcientoQuita}` : "NO APLICA"}</span>
        },
        {
            name: "Persona Registra",
            selector: 'Nombre',
            sortable: false,
            center: true,
            width: '150px',
            cell: (row: any) =>
                <>
                    <span
                        className="text-center"
                        data-tip
                        data-for={`CR_PersonaRegistra_${row.SolicitudRCID}`}
                    >{row.Nombre}</span>
                    <ReactTooltip id={`CR_PersonaRegistra_${row.SolicitudRCID}`} type="info" effect="solid">{row.Nombre}</ReactTooltip>
                </>

        },
        {
            name: "Fecha Registro",
            selector: 'FechaRegistro',
            sortable: true,
            width: '150px',
            cell: (row: any) =>
                <>
                    <span
                        data-tip
                        data-for={`CR_FechaRegistro_${row.SolicitudRCID}`}
                    >
                        {moment(row.FechaRegistro).format("DD/MM/YYYY")}
                    </span>
                    <ReactTooltip id={`CR_FechaRegistro_${row.SolicitudRCID}`} type="info" effect="solid">{row.FechaRegistro}</ReactTooltip>
                </>

        },
        {
            name: 'Acciones',
            sortable: true,
            center: true,
            cell: (row: any) => {
                return (
                    <div className="is-grouped d-flex justify-content-center">

                        <button
                            className="button is-primary m-1 text-center is-small"
                            data-tip
                            data-for={`CR_Aceptar_${row.SolicitudRCID}`}
                            disabled={row.Estatus === 'A' || row.Estatus === 'C' ? true : false}
                            onClick={() =>
                                row.Accion == 4 ?
                                    (FNGetDetalle(row.SolicitudRCID, row.DistribuidorID))

                                    : setState(s => ({ ...s, SolicitudRCID: row.SolicitudRCID, ShowCRS: true, DistribuidorID: row.DistribuidorID, DistribuidorNombre: row.PersonaNombre }))
                            }
                        >
                            <FaCheckCircle />
                            <ReactTooltip id={`CR_Aceptar_${row.SolicitudRCID}`} type="info" effect="solid">Aceptar Solicitud</ReactTooltip>
                        </button>

                        {state.TipoAnalista === 'ANL' &&
                            <button
                                className="button m-1 text-center is-small"
                                style={{ backgroundColor: 'orange', color: 'white' }}
                                data-tip
                                data-for={`CR_Validar_${row.SolicitudRCID}`}
                                disabled={row.Estatus === 'A' || row.Estatus === 'C' ? true : false}
                                onClick={() =>
                                    (FNValidarSolicitud(row.SolicitudRCID, row.DistribuidorID))
                                }
                            >
                                <TbFileCheck />
                                <ReactTooltip id={`CR_Validar_${row.SolicitudRCID}`} type="info" effect="solid">Validar Solicitud</ReactTooltip>
                            </button>
                        }
                        <button
                            className="button is-danger m-1 text-center is-small"
                            onClick={() => CancelarSolicitud(row.SolicitudRCID)}
                            data-tip
                            data-for={`CR_Cancelar_${row.SolicitudRCID}`}
                            disabled={row.Estatus === 'A' || row.Estatus === 'C' ? true : false}
                        >
                            <FaBan />
                            <ReactTooltip id={`CR_Cancelar_${row.SolicitudRCID}`} type="info" effect="solid">Cancelar Solicitud</ReactTooltip>
                        </button>
                    </div>
                )
            }

        },
        {
            name: "Informacion",
            sortable: false,
            center: true,
            cell: (row: any) => {
                return (
                    <div className="is-grouped d-flex justify-content-center">
                        <button className="button is-link m-1 text-center is-small"
                            data-tip
                            data-for={`CR_Documentos_${row.SolicitudRCID}`}
                            onClick={() => setState(s => ({ ...s, verDocs: true, SolicitudRCID: row.SolicitudRCID, DistribuidorID: row.DistribuidorID }))}
                        >
                            {/* <i class="fa-regular fa-file-lines"></i> */}
                            <FaFile />
                            <ReactTooltip id={`CR_Documentos_${row.SolicitudRCID}`} type="info" effect="solid">Ver Documentos</ReactTooltip>
                        </button>
                        <button className="button is-dark m-1 text-center is-small"
                            data-tip
                            data-for={`CR_Notas_${row.SolicitudRCID}`}
                            onClick={() => FNGetNotas(row.SolicitudRCID, row.DistribuidorID)}>
                            {/* <i class="fa-regular fa-file-lines"></i> */}
                            <FaFileContract />
                            <ReactTooltip id={`CR_Notas_${row.SolicitudRCID}`} type="info" effect="solid">Ver Notas</ReactTooltip>
                        </button>
                    </div>
                )
            }
        },
        {
            name: "",
            sortable: false,
            center: true,
            cell: (row: any) => {
                return (
                    <div className="is-grouped d-flex justify-content-center">
                        <button disabled={(row.Estatus === 'A' && row.Accion === 1) ? false : true} style={{ backgroundColor: '#504d4d' }} className="button is-link m-1 text-center is-small"
                            onClick={() =>
                                planPagos(row.DistribuidorID)}
                        >
                            Ver Convenio
                        </button>
                    </div>
                )
            }
        },
    ];

    const ColumnsSimularPlazos = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'No. Pago',
                    selector: 'NumeroPago',
                    sortable: true,
                    center: true,
                    cell: (row: any) => <span className="text-center">{row.NumeroPago}</span>
                },
                {
                    name: 'Fecha Vencimiento',
                    selector: 'FechaVencimiento',
                    sortable: true,
                    cell: (row: any) => <span className="text-center">{moment(row.FechaVencimiento).utc().format("DD/MM/YYYY")}</span>
                },
                {
                    name: 'Importe',
                    selector: 'TotalCapital',
                    sortable: true,
                    cell: (props) => <span className="text-center">{FormateoDinero.format(props.TotalCapital)}</span>

                }
            ]
        return colRet
    }, []);

    // En tu manejador de eventos, solo actualizar el estado si el componente está montado
    const handleInputChange = (e) => {
        if (isMounted.current) {
            // console.log("###", e.target.value);

            setState(s => ({ ...s, FiltroBusqueda: e.target.value }));
        }
    };

    React.useEffect(() => {
        ObtenerDatos();
        FNGetSucursales();
        FNGetAnalistas();
        FNGetTipoAnalista();
        isMounted.current = true;

        // Cuando el componente se desmonta, establecer isMounted en false
        return () => {
            isMounted.current = false;
        };
    }, []);
    // Hola
    return (
        <>

            <div className="row">
                <div className="col">
                    <Card Title="REVISION DE SOLICITUDES DE CONVENIOS Y REESTRUCTURAS">
                        <Card.Body>
                            <Card.Body.Content>
                                {/* SE USA UN SPINNER EN LO QUE SE CARGAN LOS DATOS */}
                                {state.Cargando ?? <Spinner />}
                                {!state.Cargando &&
                                    <DataTable
                                        noHeader
                                        subHeader
                                        noDataComponent={
                                            <div className="text-center" style={{ margin: '4em' }}>
                                                <FaExclamationCircle /><h5>No hay datos</h5>
                                            </div>
                                        }

                                        paginationComponentOptions={{ rowsPerPageText: 'Registros por página:', rangeSeparatorText: 'de', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'Todo' }}
                                        subHeaderComponent={
                                            <div className="row" style={{ width: '102%' }}>
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3" style={{ justifyContent: 'space-between' }}>
                                                        <div></div>
                                                        <div className="input-group mb-15" style={{ width: 'auto' }} >
                                                            {/* <input type="text" className="form-control" placeholder="Buscar Solicitud Credito" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} /> */}
                                                            {/* <span className="input-group-text"><FaSearch /> </span> */}
                                                            {/* <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button> */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-12">
                                                    <div style={{ backgroundColor: '#F7F7F7', padding: '1em', borderRadius: '15px' }}>
                                                        <div>
                                                            <div style={{ float: 'right' }}>
                                                                <button className="btn btn-outline-secondary" type="button" onClick={() => ObtenerDatos()}><FiRefreshCcw /></button>


                                                            </div>
                                                            <div style={{ float: 'left' }}><FaFilter /></div>
                                                            <div ><label> FILTROS</label></div>
                                                        </div>
                                                        <div style={{ width: '100%', textAlign: 'center' }}>
                                                            <div style={{ display: 'inline-block' }}>
                                                                <Formik
                                                                    initialValues={{}}
                                                                    onSubmit={() => { }}
                                                                >
                                                                    <Form>
                                                                        <div className="row" style={{ textAlign: 'initial' }}>

                                                                            <div style={{ height: '57px', width: '245px' }}>
                                                                                <ActionSelect
                                                                                    disabled={false}
                                                                                    label="Analistas"
                                                                                    name="AnalistaID"
                                                                                    placeholder="TODOS"
                                                                                    options={state.optAnalistas}
                                                                                    addDefault={false}
                                                                                    valor={state.FiltroAnalista}
                                                                                    accion={fnGetFiltroAnalista}
                                                                                />
                                                                            </div>
                                                                            <div style={{ height: '57px', width: '245px' }}>
                                                                                <ActionSelect
                                                                                    disabled={false}
                                                                                    label="Sucursales"
                                                                                    name="SucursalID"
                                                                                    placeholder="TODOS"
                                                                                    options={state.optSucursales}
                                                                                    addDefault={false}
                                                                                    valor={state.FiltroSucursal}
                                                                                    accion={fnGetFiltrosSucursales}
                                                                                />
                                                                            </div>
                                                                            <div style={{ height: '67px', width: '170px' }}>
                                                                                <ActionSelect
                                                                                    disabled={false}
                                                                                    label="Estatus"
                                                                                    name="Estatus"
                                                                                    placeholder="TODOS"
                                                                                    options={EstatusOptions}
                                                                                    addDefault={false}
                                                                                    valor={state.FiltroEstatus}
                                                                                    accion={fnGetFiltroEstatus}
                                                                                />
                                                                            </div>
                                                                            <div style={{ height: '67px', width: '140px' }}>
                                                                                <DatePickeEnd
                                                                                    name={'Fecha'}
                                                                                    label={'Fecha'}
                                                                                    disabled={loading}
                                                                                    placeholder={'Fecha'}
                                                                                    isClearable startDate={startDate}
                                                                                    endDate={endDate}
                                                                                    setEndDate={setEndDate}
                                                                                />
                                                                            </div  >
                                                                            <div style={{ height: '67px', width: '200px' }}>
                                                                                <label className="form-label mb-0" htmlFor={"Busqueda"}>Busqueda Nombre</label>
                                                                                <div className="input-group">


                                                                                    <input type="text" className="form-control" placeholder="Buscar persona" value={state.FiltroBusqueda}
                                                                                        onChange={e => handleInputChange(e)}
                                                                                    />
                                                                                    <span className="input-group-text"><FaSearch /> </span>

                                                                                </div>

                                                                            </div >
                                                                        </div>
                                                                    </Form>
                                                                </Formik>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        data={filteredData}
                                        columns={Columns}
                                        pagination
                                        striped
                                        responsive
                                        conditionalRowStyles={conditionalRowStyles}
                                        defaultSortAsc={false}
                                        style={{ width: '100%' }}
                                    />
                                }
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
            </div>
            {/* MODAL PARA CONVENIOS Y REESTRUCTURAS  */}
            {state.ShowCRS &&
                <div>
                    <ModalWin large open={state.ShowCRS} center={true} scrollable zIndex={500}>
                        <ModalWin.Header>
                            <h5 className={MODAL_TITLE_CLASS}>
                                CONVENIOS Y REESTRUCTURAS<br />
                                <h5 className={MODAL_TITLE_CLASS}>SOCIA: {state.DistribuidorID} {state.DistribuidorNombre}</h5>
                            </h5>
                        </ModalWin.Header>
                        <ModalWin.Body>
                            <CFormCRS2
                                oidc={props.oidc}
                                solicitudRCID={state.SolicitudRCID}
                                distribuidorID={state.DistribuidorID}
                                cbActualizar={() => { }}
                                fnCancelar={toggleModalCRS}
                                fnActualizar={ActualizarTabla}
                                TipoAnalista={state.TipoAnalista}
                            />
                        </ModalWin.Body>
                    </ModalWin>

                </div>

            }
            {/* MODAL PARA REESTRUCTURAS CLIENTE FINAL */}
            {state.ShowCCF &&
                <div>
                    <ModalWin xlarge open={state.ShowCCF} center={true} scrollable>
                        <ModalWin.Header>
                            <h5 className={MODAL_TITLE_CLASS}>
                                REESTRUCTURAS CLIENTE FINAL
                            </h5>
                            <button
                                type="button"
                                title="Cerrar"
                                className="delete"
                                onClick={() => setState({ ...state, ShowCCF: false })}
                            />
                        </ModalWin.Header>
                        <ModalWin.Body>
                            <DataTable
                                data={state.DatosDetalleCF}
                                striped
                                // pagination

                                dense
                                noHeader
                                responsive
                                keyField={"CreditoID"}
                                defaultSortField={"CreditoID"}
                                columns={DetailColumnsCredito}
                            // expandableRows
                            // expandOnRowClicked
                            // onRowExpandToggled={(res: any) => {
                            //     HiddenData(res)
                            // }}
                            // expandableRowsComponent={<HiddenData/>}
                            />
                            <div className="text-end">
                                <button type="submit" disabled={state.TipoAnalista === 'ANL'} className="ms-2 btn btn-success waves-effect waves-light" onClick={FNAceptarRCF}>
                                    Aceptar Reestructuras
                                </button>
                            </div>
                        </ModalWin.Body>
                    </ModalWin>

                </div>

            }
            {/* MODAL PARA VER LAS NOTAS */}
            {state.verNotas &&
                <ModalWin
                    open={state.verNotas}
                    center={true}
                    xlarge

                    scrollable
                    zIndex={3000}
                >
                    <ModalWin.Header>
                        <h5 >

                            <h4 className="has-text-weight-bold">{"Notas"}</h4>

                        </h5>
                        <button
                            title="Cerrar"
                            type="button"
                            className="delete"
                            onClick={() => {
                                setState({ ...state, verNotas: false })

                            }}
                        />

                    </ModalWin.Header>
                    <ModalWin.Body>
                        {state.notas.map((nota: any) => {
                            return (
                                <div className="d-flex justify-content-end" style={{ width: '100%' }}>
                                    <article className="message is-dark my-3">
                                        <div className="message-header">
                                            <p>{nota.Emisor}</p>
                                        </div>
                                        <div className="message-body">
                                            <strong className="d-block">Tipo Nota : {nota.TipoNotasDesc}</strong>
                                            <p>{nota.Descripcion} </p>
                                        </div>
                                    </article>
                                </div>
                            )
                        })}
                    </ModalWin.Body>


                </ModalWin>
            }
            {/* MODAL PARA VER LOS DOCUMENTOS */}
            {state.verDocs &&
                <CFormSCRSDocumentos
                    iodc={props.oidc}
                    DistribuidorID={state.DistribuidorID}
                    SolicitudRCID={state.SolicitudRCID}
                    Accion={0}
                    IdSolicitud={state.SolicitudRCID}
                    fnAbrir_Cerrar={() => toggleModalDocs()}
                    disabled={true}
                />
            }
            {state.showPlanPagos &&
                <ModalWin
                    open={state.showPlanPagos}
                    center={true}

                    scrollable
                    zIndex={3000}
                >
                    <ModalWin.Header>
                        <h5 >

                            <h4 className="has-text-weight-bold">{"Plan de Pagos"}</h4>

                        </h5>
                        <button type="button" className="delete" onClick={() => {
                            fnCancelarPlanPagos()
                        }} />

                    </ModalWin.Header>
                    <ModalWin.Body>
                        <DataTable
                            // subHeader
                            data={state.datosPlanPagos}
                            columns={ColumnsSimularPlazos}
                            responsive
                            noHeader

                        />


                    </ModalWin.Body>


                </ModalWin>}
        </>
    )
}
// ESTAS DOS CONSTANTES SE USAN PARA REALIZAR PETICIONES A LA API
const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(SolicitudConveniosReestructuras);