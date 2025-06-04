import React, { useEffect, useState, useRef } from "react"
import { IOidc } from "../../../../../../interfaces/oidc/IOidc"
import { ErrorMessage, Field, Form, Formik, useFormik } from "formik"
import * as Yup from 'yup'
import { log } from "console"
import { Acordion, ActionFieldNumberText, ActionFieldText, ActionFieldText2, ActionSelect, CustomFieldText, CustomFieldText2, CustomSelect, ModalWin, Spinner, Tabs } from "../../../../../global"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"
import * as Funciones from './FuncionesSCRS'
import * as FuncionesCRS from '../CreditoComisionReestructura/Funciones';
import { toast } from "react-toastify"
import { stat } from "fs"
import { FcDocument, FcBriefcase, FcList, FcSurvey } from 'react-icons/fc'
import { FaClipboard, FaReceipt } from 'react-icons/fa'
import { parse } from "path"
import { MODAL_TITLE_CLASS } from "../../../../../global/ModalWin";
import DataTable, { IDataTableColumn } from "react-data-table-component"
import moment from "moment"
import { format } from "url"
import { FormateoDinero } from "../../../../../../global/variables"
import ReactTooltip from "react-tooltip"
import CFormSCRSDocumentos from "./CFormSCRSDocumentos"
import Distribuidor from "../../../distribuidor/Distribuidor"


type CFormType = {
    oidc: IOidc,
    distributorId: number,
    EstatusID: string,
    // cbActualizar(item: boolean): any
    initialValues: {
        saldoActual: number,
        saldoAtrasado: number,
        saldoActual2: number,
        saldoAtrasado2: number,
        saldoActual3: number,
        saldoAtrasado3: number,
        porcentaje: number,
    }
    fnAbrir_Cerrar(): any

}


export const CFormSCRS = (props: CFormType) => {

    // console.log('props', props.initialValues);

    // DECLARACION DE VARIABLES 
    const DatosMostrarQuita: any[] = [];
    const DatosMostrarPlazos: any[] = [];
    const DatosDetallePlazos: any = {};
    const DatosPlazoSimulacion: any[] = [];
    // TABLA AUXILIAR PARA INSERTAR LOS DATOS DE LA PETICION DE SOLICITUD
    const DatosPeticion: any[] = [];
    const [data, setData] = useState({
        DatosMostrarQuita,
        DatosMostrarPlazos,
        DatosDetallePlazos,
        DatosPlazoSimulacion,
        DatosPeticion
    });
    const [loading, setLoading] = useState(false)
    const [loadingSolicitud, setLoadingSolicitud] = useState(false)
    // LIBRERIA PARA MOSTRAR UN MODAL
    const MySwal = withReactContent(Swal);
    // console.log('props', props.initialValues);
    // LA MAYORIA DE LAS VARIABLES ESTAN EN CFORMCRS , ES BASICAMENTE UNA COPIA DE ESA CLASE
    const [state, setState] = useState({
        loader: false,
        ShowSolicitudCRS: true,
        showExitAgreement: true,
        showExitRestruct: true,
        showRestruct: true,
        MostrarPlazos: false,
        accion: 0,
        showconvenio: false,
        showReestructura: false,
        showReestructuraSalida: false,
        valorInputIntencion: 0,
        tabActivo: 1,
        initialValues: {
            SolicitudRCID: 0,
            SaldoActual: 0,
            SaldoAtrasado: 0,
            QuitaID: 0,
            MontoIntencion: 0,
            PlazoID: 0,
            Motivo: "",
            DistribuidorID: 0,
            Accion: 0,
            TipoReestructura: "",
            Completado: false,
            Estatus: "",
            DNI: ""
        },
        showDocumento: false,

    });
    const toggleModalSolicitudCRS = () => {
        setState(s => ({ ...s, showDocumento: !state.showDocumento }));
    }

    //OBTENER SOLICITUD ID
    useEffect(() => {
        if (state.accion === 1) {
            setState(s => ({ ...s, showExitAgreement: true, showExitRestruct: false, showRestruct: false }));
        } else if (state.accion === 2) {
            setState(s => ({ ...s, showExitAgreement: false, showExitRestruct: false, showRestruct: true }));
        } else if (state.accion === 3) {
            setState(s => ({ ...s, showExitAgreement: false, showExitRestruct: true, showRestruct: false }));
        } else {
            setState(s => ({ ...s, showExitAgreement: true, showExitRestruct: true, showRestruct: true }));
        }
    }, [state.accion])


    const ObtenerSolicitudId = () => {
        Funciones.GetIdSolicitud(props.oidc, props.distributorId)
            .then((res: any) => {
                setData(s => ({ ...s, DatosPeticion: res }));

                console.log(res);
                if (res.Accion === -1) {
                    setState(s => ({
                        ...s, initialValues: {
                            ...state.initialValues,
                            Accion: -1
                        }
                    }));
                    console.log(state.initialValues);

                } else if (res.Accion == 1 || res.Accion == 5) {
                    setState(s => ({
                        ...s, initialValues: {
                            ...state.initialValues,
                            SolicitudRCID: res.SolicitudRCID,
                            saldoActual: res.SaldoActual,
                            saldoAtrasado: res.SaldoAtrasado,
                            QuitaID: res.QuitaID,
                            MontoIntencion: res.MontoIntencion,
                            PlazoID: res.PlazoID,
                            motivo: res.Motivo,
                            DistribuidorID: res.DistribuidorID,
                            Accion: res.Accion,
                            // Estatus: res.Estatus,
                            // TipoReestructura: res.TipoReestructura,
                            Completado: res.Completado,
                            DNI: res.DNI
                        },
                        accion: res.Accion == 5 ? 1 : res.Accion,
                        tabActivo: res.Accion == 5 ? 1 : res.Accion
                    }));
                    setData(s => ({
                        ...s, DatosDetallePlazos: {
                            ...s.DatosDetallePlazos,
                            SolicitudRCID: res.SolicitudRCID,
                            motivo: res.Motivo,
                            QuitaID: res.QuitaID,
                            PlazoID: res.PlazoID,
                            MontoIntencion: res.MontoIntencion,
                            DistribuidorID: res.DistribuidorID,
                            Accion: res.Accion,
                            DNI: res.DNI
                        }
                    }));
                } else if (res.Accion == 2) {
                    setState(s => ({
                        ...s, initialValues: {
                            ...state.initialValues,
                            SolicitudRCID: res.SolicitudRCID,
                            saldoActual2: res.SaldoActual,
                            saldoAtrasado2: res.SaldoAtrasado,
                            QuitaID: res.QuitaID,
                            MontoIntencion: res.MontoIntencion,
                            PlazoID2: res.PlazoID,
                            motivo2: res.Motivo,
                            DistribuidorID: res.DistribuidorID,
                            Accion: res.Accion,
                            Estatus: res.Estatus,
                            TipoReestructura: res.TipoReestructura,
                            Completado: res.Completado
                        }
                        , accion: res.Accion,
                        tabActivo: res.Accion

                    }));
                    setData(s => ({
                        ...s, DatosDetallePlazos: {
                            ...s.DatosDetallePlazos,
                            TipoReestructura: res.TipoReestructura,
                            SolicitudRCID: res.SolicitudRCID,
                            motivo2: res.Motivo,
                            PlazoID2: res.PlazoID,
                            DistribuidorID: res.DistribuidorID,
                            Accion: res.Accion
                        }
                    }));
                } else if (res.Accion == 3) {
                    setState(s => ({
                        ...s, initialValues: {
                            ...state.initialValues,
                            SolicitudRCID: res.SolicitudRCID,
                            saldoActual3: res.SaldoActual,
                            saldoAtrasado3: res.SaldoAtrasado,
                            QuitaID3: res.QuitaID,
                            PlazoID3: res.PlazoID,
                            motivo3: res.Motivo,
                            DistribuidorID: res.DistribuidorID,
                            Accion: res.Accion,
                            Estatus: res.Estatus,
                            Completado: res.Completado
                        },
                        accion: res.Accion,
                        tabActivo: res.Accion
                    }));
                    setData(s => ({
                        ...s, DatosDetallePlazos: {
                            ...s.DatosDetallePlazos,
                            QuitaID3: res.QuitaID,
                            PlazoID3: res.PlazoID,
                            motivo3: res.Motivo,
                            DistribuidorID: res.DistribuidorID,
                            SolicitudRCID: res.SolicitudRCID,
                            Accion: res.Accion
                        }
                    }));
                }
                // console.log(state.initialValues);
            }).catch((error: any) => {
                toast.error(`Error: ${error.response}`);
            });
    }

    const ObtenerPorcentajeQuita = () => {
        FuncionesCRS.FNGetQuita(props.oidc)
            .then((res: any) => {

                var quitas = res.map((val: any) => {
                    var obj = { value: val.QuitaID, label: val.PorcientoQuita + '%' }
                    return obj;
                })
                setData(s => ({ ...s, DatosMostrarQuita: quitas }));
                // setData({ DatosMostrarQuita: res });
            })
            .catch((error: any) => {
                setData(s => ({ ...s, DatosMostrarQuita: [] }));
                toast.error(`Error: ${error.response}`);

            });
    };




    const TipoReestructura = [
        { value: '0', label: 'Selecciona la herramienta', disabled: true },
        { value: 'ROBO', label: 'Por Robo', },
        { value: 'EMERGENCIA', label: 'De Emergencia' },
        { value: 'DESASTRE NATURAL', label: 'Desastre Natural' }
    ];



    const ObtenerPlazos = () => {

        FuncionesCRS.FNGetPlazos(props.oidc)
            .then((res: any) => {

                var plazos = res.map((val: any) => {
                    var obj = { value: val.PlazoID, label: val.Quincenas }
                    return obj;
                })
                setData(s => ({ ...s, DatosMostrarPlazos: plazos }));
                // setData({ DatosMostrarQuita: res });
            })
            .catch((error: any) => {
                setData(s => ({ ...s, DatosMostrarPlazos: [] }));
                toast.error(`Error: ${error.response}`);

            });
    };


    const ConfirmarSolicitud = () => {
        // setLoadingSolicitud(true);
        MySwal.fire({
            title: '<h2 class="title is-3">¿Estás seguro?</h2>',
            html:

                <div >
                    <p className="text-center title is-6">Se enviará la solicitud de convenio</p>
                    <p className="text-center">¿Deseas continuar?</p>
                </div>,
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar solicitud',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // LEER EL FORMULARIO Y ENVIAR LOS DATOS
                setLoadingSolicitud(true);


                Funciones.ConfirmarPeticion(props.oidc, data.DatosDetallePlazos).then((res: any) => {
                    // console.log(res);

                    if (res.status) {
                        toast.success('Solicitud enviada correctamente');
                        setLoadingSolicitud(false);
                        // cerrar el modal
                        props.fnAbrir_Cerrar();
                        // setState(s => ({ ...s, ShowSolicitudCRS: false }));
                    }
                    setLoadingSolicitud(false);
                }).catch((error: any) => {
                    setLoadingSolicitud(false);
                    console.log(error);

                    toast.error(`Error: ${error.response.data}`);
                });
            }
        })
    }
    const planPagos = () => {
        // console.log('plan de pagos', data.DatosDetallePlazos);
        // console.log(state.accion);

        // console.log('data', data.DatosDetallePlazos);
        data.DatosDetallePlazos = (data.DatosDetallePlazos && Object.keys(data.DatosDetallePlazos).length > 0)
            ? data.DatosDetallePlazos
            : state.initialValues;

        if (data.DatosDetallePlazos != undefined) {
            // var objPlazos: any = {}
            if (state.tabActivo === 1) {

                if (props.EstatusID === 'C') {
                    if (data.DatosDetallePlazos.PlazoID > 0) {
                        setState({ ...state, MostrarPlazos: true });
                        const obj = {
                            SaldoActual: data.DatosDetallePlazos.saldoActual,
                            PlazoID: parseInt(data.DatosDetallePlazos.PlazoID),
                            accion: 2
                        }
                        FuncionesCRS.FNGetSimulacionPlazos(props.oidc, obj)
                            .then((res: any) => {
                                // console.log(res);
                                setData(s => ({ ...s, DatosPlazoSimulacion: res }));

                            }).catch((error: any) => {
                                toast.error(`Error: ${error.response}`);
                            })
                    } else {
                        toast.error('El plazo es requerido');
                        setLoading(false);
                        return;
                    }
                } else {
                    if (data.DatosDetallePlazos.QuitaID > 0) {
                        if (data.DatosDetallePlazos.MontoIntencion > 0) {
                            if (data.DatosDetallePlazos.PlazoID > 0) {
                                setState({ ...state, MostrarPlazos: true });
                                const objPlazos = {
                                    SaldoActual: data.DatosDetallePlazos.saldoActual,
                                    QuitaID: parseInt(data.DatosDetallePlazos.QuitaID),
                                    PlazoID: parseInt(data.DatosDetallePlazos.PlazoID),
                                    MontoIntencion: parseFloat(data.DatosDetallePlazos.MontoIntencion),
                                    accion: state.tabActivo
                                }
                                // console.log('objPlazos', objPlazos);

                                FuncionesCRS.FNGetSimulacionPlazos(props.oidc, objPlazos)
                                    .then((res: any) => {
                                        // console.log(res);
                                        setData(s => ({ ...s, DatosPlazoSimulacion: res }));

                                    }).catch((error: any) => {
                                        toast.error(`Error: ${error.response}`);
                                    })

                            } else {
                                toast.error('El plazo es requerido');
                                setLoading(false);
                                return;
                            }
                        } else {
                            toast.error('El pago intencion es requerido');
                            setLoading(false);
                            return;
                        }


                    } else {
                        toast.error('La quita es requerida');
                        setLoading(false);
                        return;
                    }

                }

            } else if (state.tabActivo === 2) {
                if (data.DatosDetallePlazos.PlazoID2 > 0) {
                    setState({ ...state, MostrarPlazos: true });
                    const obj = {
                        SaldoActual: data.DatosDetallePlazos.saldoActual2,
                        PlazoID: parseInt(data.DatosDetallePlazos.PlazoID2),
                        accion: state.tabActivo
                    }
                    FuncionesCRS.FNGetSimulacionPlazos(props.oidc, obj)
                        .then((res: any) => {
                            // console.log(res);
                            setData(s => ({ ...s, DatosPlazoSimulacion: res }));

                        }).catch((error: any) => {
                            toast.error(`Error: ${error.response}`);
                        })
                } else {
                    toast.error('El plazo es requerido');
                    setLoading(false);
                    return;
                }

            } else if (state.tabActivo === 3) {
                if (data.DatosDetallePlazos.QuitaID3 > 0) {
                    if (data.DatosDetallePlazos.PlazoID3 > 0) {
                        setState({ ...state, MostrarPlazos: true });
                        const obj = {
                            SaldoActual: data.DatosDetallePlazos.saldoActual3,
                            QuitaID: parseInt(data.DatosDetallePlazos.QuitaID3),
                            PlazoID: parseInt(data.DatosDetallePlazos.PlazoID3),
                            accion: state.tabActivo,
                            DistribuidorID: props.distributorId
                        }
                        FuncionesCRS.FNGetSimulacionPlazos(props.oidc, obj)
                            .then((res: any) => {
                                // console.log(res);
                                setData(s => ({ ...s, DatosPlazoSimulacion: res }));

                            }).catch((error: any) => {
                                toast.error(`Error: ${error.response}`);
                            })

                    } else {
                        toast.error('El plazo es requerido');
                        setLoading(false);
                        return;
                    }
                } else {
                    toast.error('La quita es requerida');
                    setLoading(false);
                    return;
                }
            }

        } else {
            toast.error('No se ha seleccionado un plazo');

        }
    }

    const Documentos: any[] = [
        {
            NombreDocumento: 'Solicitud',
            SubirDocumento: <button type="button" className="button is-link is-small waves-effect waves-light" onClick={() => { }}>Subir</button>,
            VerDocumento: <button type="button" className="button is-link is-small waves-effect waves-light" onClick={() => { }}>Pendiente</button>
        },

    ];

    const ParrafoNota: string = 'Nota: Adjunta la evidencia necesaria para procesar la solicitud';
    //COLUMNAS DE TABLA PLAN DE PAGOS
    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'No. Pago',
                    selector: 'NoPago',
                    sortable: true,
                    center: true,
                    cell: (row: any) => <span className="text-center">{row.NoPago}</span>
                },
                {
                    name: 'Fecha Vencimiento',
                    selector: 'FechaVencimiento',
                    sortable: true,
                    cell: (row: any) => <span className="text-center">{moment(row.FechaVencimiento).utc().format("DD/MM/YYYY")}</span>
                },
                {
                    name: 'Importe',
                    selector: 'Importe',
                    sortable: true,
                    cell: (props) => <span className="text-center">{FormateoDinero.format(props.Importe)}</span>

                }
            ]
        return colRet
    }, []);
    const handleTabClick = (index: number) => {
        setState({ ...state, tabActivo: index });
    };

    const handleChange = (event) => {
        console.log(event.target);

        setData({
            ...data,
            DatosDetallePlazos: {
                ...data.DatosDetallePlazos,
                [event.target.name]: event.target.value,
            }

        });
    };

    const noShowConvenioSalida = () => {
        return { display: `${props.EstatusID === 'C' ? 'none' : ''}` };
    }

    useEffect(() => {
        if (props.EstatusID == 'C') setState(s => ({ ...s, accion: 1 }));
        ObtenerSolicitudId();
        ObtenerPorcentajeQuita();
        ObtenerPlazos();
    }, []);


    return (
        <>
            <div className={`modal ${state.ShowSolicitudCRS ? 'is-active' : ''}`}>
                {/* FONDO NEGRO QUE AL DAR CLICK SE SALE DEL MODAL */}
                <div className="modal-background" onClick={props.fnAbrir_Cerrar}></div>
                {/* COMIENZO DE TARJETA */}
                <div className="modal-card">
                    {/* CABEZERA DE LA TARJETA */}
                    <header className="modal-card-head">
                        <p className="modal-card-title fs-4 fw-semibold text-start">CONVENIOS Y REESTRUCTURAS</p>
                        {/* AL DAR CLICK EN EL BOTON SE SALDRA DEL MODAL */}
                        <button className="delete" aria-label="close" onClick={() => props.fnAbrir_Cerrar()}></button>
                    </header>
                    <Formik
                        initialValues={state.initialValues.Accion == -1 ? props.initialValues : state.initialValues}
                        enableReinitialize
                        validationSchema={
                            // state.tabActivo == 1 ?
                            //     Yup.object().shape({
                            //         QuitaID: Yup.number().required('La quita es requerida')
                            //             .moreThan(0, 'La quita es requerida').default(0).typeError('La quita es requerida'),
                            //         PlazoID: Yup.number().required('El plazo es requerido')
                            //             .moreThan(0, 'El plazo es requerido').default(0).typeError('El plazo es requerido'),
                            //         MontoIntencion: Yup.number().required('El pago intencion es requerido')
                            //             .moreThan(0, 'El pago intencion es requerido').default(0).typeError('El pago intencion es requerido'),
                            //         motivo: Yup.string().required('El motivo es requerido').typeError('El motivo es requerido'),
                            //         DNI: Yup.string().typeError('El DNI es requerido')
                            //     }) :
                            //     state.tabActivo == 2 ?
                            //         Yup.object().shape({
                            //             PlazoID2: Yup.number().required('El plazo es requerido')
                            //                 .moreThan(0, 'El plazo es requerido').default(0).typeError('El plazo es requerido'),
                            //             TipoReestructura: Yup.string().required('El tipo de rescate es requerido').typeError('El tipo de rescate es requerido'),
                            //             motivo2: Yup.string().required('El motivo es requerido').typeError('El motivo es requerido')

                            //         }) :
                            //         state.tabActivo == 3 ?
                            //             Yup.object().shape({
                            //                 QuitaID3: Yup.number().required('La quita es requerida')
                            //                     .moreThan(0, 'La quita es requerida').default(0).typeError('La quita es requerida'),
                            //                 PlazoID3: Yup.number().required('El plazo es requerido')
                            //                     .moreThan(0, 'El plazo es requerido').default(0).typeError('El plazo es requerido'),
                            //                 motivo3: Yup.string().required('El motivo es requerido').typeError('El motivo es requerido')
                            //             }) 
                            // : 
                            Yup.object().shape({})
                        }
                        onSubmit={(values: any) => {

                            if (state.tabActivo === 1 && props.EstatusID === 'C') {
                                console.log('values', values);
                                console.log(state.tabActivo);
                                setLoading(true);
                                const obj = {
                                    saldoActual: values.saldoActual,
                                    saldoAtrasado: values.saldoAtrasado,
                                    PlazoID: parseInt(values.PlazoID),
                                    Motivo: values.motivo,
                                    DistribuidorID: props.distributorId,
                                    accion: 5
                                }
                                Funciones.AddSolicitudSCRS(props.oidc, obj).then((res: any) => {
                                    setState(s => {

                                        const newInitialValues = {
                                            ...s.initialValues,
                                            Accion: res.Accion,
                                            Estatus: res.Estatus,
                                            SolicitudRCID: res.SolicitudRCID,
                                            PlazoID: res.PlazoID,
                                            DistribuidorID: res.DistribuidorID,
                                            motivo: res.Motivo

                                        }
                                        return { ...s, accion: res.Accion, initialValues: newInitialValues };

                                    })
                                    setData(data => {
                                        const newInitialValues = {
                                            ...data, DatosDetallePlazos: {
                                                ...data.DatosDetallePlazos,
                                                SolicitudRCID: res.SolicitudRCID,
                                                DistribuidorID: res.DistribuidorID
                                            }
                                        };

                                        return { ...data, DatosDetallePlazos: newInitialValues };
                                    });

                                    toast.success('Solicitud convenio guardada correctamente con el ID: ' + res.SolicitudRCID);
                                }).catch((error: any) => {
                                    setLoading(false);
                                    toast.error(`Error: ${error.response}`);
                                });
                            } else if (state.tabActivo === 1) {
                                console.log("No deberia de entrar aqui");

                                setLoading(true);
                                const obj = {
                                    SaldoActual: values.saldoActual,
                                    SaldoAtrasado: values.saldoAtrasado,
                                    QuitaID: parseInt(values.QuitaID),
                                    Motivo: values.motivo,
                                    DistribuidorID: props.distributorId,
                                    PlazoID: parseInt(values.PlazoID),
                                    MontoIntencion: parseFloat(values.MontoIntencion),
                                    accion: state.tabActivo,
                                    DNI: values.DNI || ''
                                }

                                Funciones.AddSolicitudSCRS(props.oidc, obj).then((res: any) => {
                                    setState(s => {
                                        const newInitialValues = {
                                            ...s.initialValues,
                                            Accion: res.Accion,
                                            Estatus: res.Estatus,
                                            SolicitudRCID: res.SolicitudRCID,
                                            QuitaID: res.QuitaID,
                                            PlazoID: res.PlazoID,
                                            MontoIntencion: res.MontoIntencion,
                                            DistribuidorID: res.DistribuidorID,
                                            motivo: res.Motivo,
                                            DNI: res.DNI
                                        };
                                        return { ...s, accion: res.Accion, initialValues: newInitialValues };
                                    });
                                    setData(data => {
                                        const newInitialValues = {
                                            ...data, DatosDetallePlazos: {
                                                ...data.DatosDetallePlazos,
                                                SolicitudRCID: res.SolicitudRCID,
                                                DistribuidorID: res.DistribuidorID
                                            }
                                        };

                                        return { ...data, DatosDetallePlazos: newInitialValues };
                                    });




                                    // console.log("VALORES DE LA PETICION", state.initialValues);
                                    toast.success('Solicitud convenio guardada correctamente con el ID: ' + res.SolicitudRCID);
                                }).catch((error: any) => {
                                    setLoading(false);
                                    toast.error(`Error: ${error.response}`);
                                })
                            }
                            else if (state.tabActivo === 2) {

                                // console.log('values', values);

                                // setLoading(true);
                                const obj = {
                                    SaldoActual: values.saldoActual2,
                                    SaldoAtrasado: values.saldoAtrasado2,
                                    Motivo: values.motivo2,
                                    DistribuidorID: props.distributorId,
                                    PlazoID: parseInt(values.PlazoID2),
                                    TipoReestructura: values.TipoReestructura,
                                    accion: state.tabActivo,
                                }
                                Funciones.AddSolicitudSCRS(props.oidc, obj).then((res: any) => {
                                    setState(s => {
                                        const newInitialValues = {
                                            ...s.initialValues,
                                            Accion: res.Accion,
                                            Estatus: res.Estatus,
                                            SolicitudRCID: res.SolicitudRCID,
                                            saldoActual2: res.SaldoActual,
                                            PlazoID2: res.PlazoID,
                                            DistribuidorID: res.DistribuidorID,
                                            TipoReestructura: res.TipoReestructura,
                                        };
                                        return { ...s, accion: res.Accion, initialValues: newInitialValues };
                                    });
                                    setData(data => {
                                        const newInitialValues = {
                                            ...data, DatosDetallePlazos: {
                                                ...data.DatosDetallePlazos,
                                                SolicitudRCID: res.SolicitudRCID,
                                                DistribuidorID: res.DistribuidorID,

                                            }
                                        };

                                        return { ...data, DatosDetallePlazos: newInitialValues };
                                    });
                                    setLoading(false);

                                    toast.success('Solicitud reestructura guardada correctamente con el ID: ' + res.SolicitudRCID);
                                }).catch((error: any) => {

                                    setLoading(false);
                                    // console.log(error.response.data);

                                    toast.error(`Error: ${error}`);
                                });
                            } else if (state.tabActivo === 3) {
                                setLoading(true);
                                const obj = {
                                    SaldoActual: values.saldoActual3,
                                    SaldoAtrasado: values.saldoAtrasado3,
                                    QuitaID: parseInt(values.QuitaID3),
                                    Motivo: values.motivo3,
                                    DistribuidorID: props.distributorId,
                                    PlazoID: parseInt(values.PlazoID3),
                                    accion: state.tabActivo,
                                }
                                Funciones.AddSolicitudSCRS(props.oidc, obj).then((res: any) => {
                                    setState(s => {
                                        const newInitialValues = {
                                            ...s.initialValues,
                                            Accion: res.Accion,
                                            Estatus: res.Estatus,
                                            SolicitudRCID: res.SolicitudRCID,
                                            saldoActual3: res.SaldoActual,
                                            PlazoID3: res.PlazoID,
                                            QuitaID3: parseInt(values.QuitaID3),
                                            DistribuidorID: res.DistribuidorID,
                                            saldoAtrasado3: res.SaldoAtrasado,
                                        };
                                        return { ...s, accion: res.Accion, initialValues: newInitialValues };
                                    });

                                    setData(data => {
                                        const newInitialValues = {
                                            ...data, DatosDetallePlazos: {
                                                ...data.DatosDetallePlazos,
                                                SolicitudRCID: res.SolicitudRCID,
                                                DistribuidorID: res.DistribuidorID,

                                            }
                                        };

                                        return { ...data, DatosDetallePlazos: newInitialValues };
                                    });
                                    console.log('respuesta', res);

                                    setLoading(false);
                                    toast.success('Solicitud reestructura salida guardada correctamente con ID: ' + res.SolicitudRCID);
                                }).catch((error: any) => {
                                    setLoading(false);
                                    toast.error(`Error al asignar la solicitud`);
                                });

                            }

                            setLoading(false);

                        }}
                    >
                        {({ setFieldValue, values }) => (

                            <Form onClick={() => {
                                setData({ ...data, DatosDetallePlazos: values })
                            }
                            }>
                                <section className="modal-card-body">
                                    <div className="container">
                                        <div className="tabs is-boxed">
                                            <ul className="fs-6">
                                                {state.showExitAgreement &&
                                                    <li className={state.tabActivo === 1 ? "is-active" : ""} onClick={() => handleTabClick(1)}><a><FcDocument size={25} className="mx-1" /> {props.EstatusID == 'C' ? 'Reeconvenio' : 'Convenio Salida'} </a></li>

                                                }
                                                {state.showRestruct &&
                                                    <li className={state.tabActivo === 2 ? "is-active" : ""} onClick={() => handleTabClick(2)}><a><FcBriefcase size={25} className="mx-1" /> Reestructura </a></li>

                                                }
                                                {state.showExitRestruct &&
                                                    <li className={state.tabActivo === 3 ? "is-active" : ""} onClick={() => handleTabClick(3)}><a><FcSurvey size={25} className="mx-1" /> Reestructura de salida </a></li>
                                                }
                                            </ul>
                                        </div>
                                        <div>
                                            {state.tabActivo == 1 &&
                                                <>
                                                    <div className="row">
                                                        <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 text-center">
                                                            <CustomFieldText
                                                                disabled={true}
                                                                label='Saldo Actual'
                                                                name='saldoActual'
                                                                placeholder='0' />
                                                        </div>
                                                        <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 text-center">
                                                            <CustomFieldText
                                                                disabled={true}
                                                                label={"Saldo Atrasado"}
                                                                name={"saldoAtrasado"}
                                                                placeholder={"0"}
                                                            />
                                                        </div>
                                                        <div className="col-sm-12 col-md-2 col-lg-2 col-xl-2 text-center" style={noShowConvenioSalida()}>
                                                            <CustomSelect
                                                                disabled={false}
                                                                label="Quita%"
                                                                name="QuitaID"
                                                                placeholder="Seleccione..."
                                                                options={data.DatosMostrarQuita}
                                                                addDefault={false}
                                                            />
                                                        </div>
                                                        <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 text-center d-flex justify-content-center my-auto">
                                                            <button
                                                                type="button"
                                                                className={`button is-link  waves-effect waves-light is-small my-2 `}
                                                                onClick={() => { planPagos() }}>
                                                                <span className='icon is-small'><i className='fa fa-eye' aria-hidden="true"></i></span>
                                                                <span className="">Ver plan pagos</span>&nbsp;
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="row">

                                                        <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 text-center" style={noShowConvenioSalida()}>
                                                            <label className="form-label mb-0" htmlFor={"porcentaje"}>Pago Intención</label>
                                                            <Field
                                                                autoComplete="off"
                                                                disabled={true}
                                                                className="form-control"
                                                                type="number"
                                                                id={"MontoIntencion"}
                                                                name="MontoIntencion"
                                                                render={({ field }) => (

                                                                    <input
                                                                        className="form-control"
                                                                        {...field}
                                                                        type="number" onChange={(e: any) => {
                                                                            const newValue = e.target.value
                                                                            if (!newValue) {
                                                                                return;
                                                                            }
                                                                            setFieldValue('MontoIntencion', newValue);
                                                                            var valor = parseFloat(newValue);
                                                                            if (isNaN(valor)) {
                                                                                return;
                                                                            }
                                                                            const porcentaje = ((valor / props.initialValues.saldoActual) * 100).toFixed(2);
                                                                            if (isNaN(parseFloat(porcentaje))) {
                                                                                return;
                                                                            }
                                                                            setFieldValue('porcentaje', porcentaje);

                                                                        }}
                                                                    />


                                                                )}
                                                            />
                                                            <ErrorMessage component="div" name="MontoIntencion" className="text-danger" />
                                                        </div>
                                                        <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 text-center" style={noShowConvenioSalida()}>
                                                            <label className="form-label mb-0" htmlFor={"porcentaje"}>P.Intención(%)</label>
                                                            <Field autoComplete="off" disabled={true} className="form-control" type="text" id={"porcentaje"} name={"porcentaje"} />
                                                            <ErrorMessage component="div" name="porcentaje" className="text-danger" />
                                                        </div>
                                                        <div className={`col-sm-12 ${props.EstatusID == 'C' ? 'col-xl-6' : 'col-xl-2'} col-md-2 col-lg-2  text-center`}>
                                                            <CustomSelect
                                                                disabled={false}
                                                                label="Plazos"
                                                                name="PlazoID"
                                                                placeholder="Seleccione..."
                                                                options={data.DatosMostrarPlazos}
                                                                addDefault={false}

                                                            />
                                                        </div>
                                                        <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 text-center" style={noShowConvenioSalida()}>
                                                            <CustomFieldText
                                                                disabled={false}
                                                                label='DNI'
                                                                name='DNI'
                                                                placeholder='Opcional' />
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center">
                                                            <label className="form-label mb-0" htmlFor={"motivo"}>Motivo</label>
                                                            <Field as="textarea" autoComplete="off" disabled={false} className="form-control textarea" placeholder="Comentarios..." rows={2} id="motivo" name="motivo" />
                                                            <ErrorMessage component="div" name="motivo" className="text-danger" />
                                                        </div>
                                                    </div>


                                                </>

                                            }
                                            {state.tabActivo == 2 &&
                                                <>
                                                    <div className="row">
                                                        <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 text-center">
                                                            <CustomFieldText
                                                                disabled={true}
                                                                label='Saldo Actual'
                                                                name='saldoActual2'
                                                                placeholder='0' />
                                                        </div>
                                                        <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 text-center">
                                                            <CustomFieldText
                                                                disabled={true}
                                                                label={"Saldo Atrasado"}
                                                                name={"saldoAtrasado2"}
                                                                placeholder={"0"}
                                                            />
                                                        </div>
                                                        <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 text-center d-flex justify-content-center my-auto">
                                                            <button
                                                                type="button"
                                                                className={`button is-link  waves-effect waves-light is-small my-2 `}
                                                                onClick={() => { planPagos() }}>
                                                                <span className='icon is-small'><i className='fa fa-eye' aria-hidden="true"></i></span>
                                                                <span className="">Ver plan pagos</span>&nbsp;
                                                            </button>
                                                        </div>

                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 text-center">
                                                            <CustomSelect
                                                                disabled={false}
                                                                label="Plazos"
                                                                name="PlazoID2"
                                                                placeholder="Seleccione..."
                                                                options={data.DatosMostrarPlazos}
                                                                addDefault={false}

                                                            />
                                                        </div>
                                                        <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 text-center">
                                                            <CustomSelect
                                                                disabled={false}
                                                                label="Tipo Rescate"
                                                                name="TipoReestructura"
                                                                options={TipoReestructura}
                                                                addDefault={false}
                                                                isMulti

                                                            />
                                                        </div>



                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center">
                                                            <label className="form-label mb-0" htmlFor={"motivo2"}>Motivo</label>
                                                            <Field as="textarea" autoComplete="off" disabled={false} className="form-control textarea" placeholder="Comentarios..." rows={2} id="motivo2" name="motivo2" />
                                                            <ErrorMessage component="div" name="motivo2" className="text-danger" />
                                                        </div>
                                                    </div>


                                                </>

                                            }
                                            {state.tabActivo == 3 &&
                                                <>
                                                    <div className="row">
                                                        <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 text-center">
                                                            <CustomFieldText
                                                                disabled={true}
                                                                label='Saldo Actual'
                                                                name='saldoActual3'
                                                                placeholder='0' />
                                                        </div>
                                                        <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 text-center">
                                                            <CustomFieldText
                                                                disabled={true}
                                                                label={"Saldo Atrasado"}
                                                                name={"saldoAtrasado3"}
                                                                placeholder={"0"}
                                                            />
                                                        </div>
                                                        <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 text-center d-flex justify-content-center my-auto">
                                                            <button
                                                                type="button"
                                                                className={`button is-link  waves-effect waves-light is-small my-2 `}
                                                                onClick={() => { planPagos() }}>
                                                                <span className='icon is-small'><i className='fa fa-eye' aria-hidden="true"></i></span>
                                                                <span className="">Ver plan pagos</span>&nbsp;
                                                            </button>
                                                        </div>

                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 text-center">
                                                            <CustomSelect
                                                                disabled={false}
                                                                label="Quita%"
                                                                name="QuitaID3"
                                                                placeholder="Seleccione..."
                                                                options={data.DatosMostrarQuita}
                                                                addDefault={false}
                                                            />
                                                        </div>
                                                        <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 text-center">
                                                            <CustomSelect
                                                                disabled={false}
                                                                label="Plazos"
                                                                name="PlazoID3"
                                                                placeholder="Seleccione..."
                                                                options={data.DatosMostrarPlazos}
                                                                addDefault={false}

                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center">
                                                            <label className="form-label mb-0" htmlFor={"motivo3"}>Motivo</label>
                                                            <Field as="textarea" autoComplete="off" disabled={false} className="form-control textarea" placeholder="Comentarios..." rows={2} id="motivo3" name="motivo3" />
                                                            <ErrorMessage component="div" name="motivo3" className="text-danger" />
                                                        </div>
                                                    </div>


                                                </>

                                            }
                                            <div className="" style={state.initialValues.SolicitudRCID <= 0 ? { pointerEvents: "none", opacity: "0.4" } : {}}>
                                                <div className="row my-2">
                                                    <hr className="hr" />
                                                    <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 text-center">
                                                        <p className="form-label mb-0 pl-3">
                                                            {ParrafoNota}
                                                        </p>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 text-center">
                                                        <button
                                                            disabled={state.initialValues.SolicitudRCID <= 0 ? true : false}
                                                            type="button"
                                                            className={`btn btn-primary  waves-effect waves-light is-small my-2 `}
                                                            onClick={() => { setState({ ...state, showDocumento: true }) }}>
                                                            <span className='icon is-small'><i className='fa fa-book ' aria-hidden="true"></i></span>
                                                            <span className="">Subir Evidencia</span>&nbsp;
                                                        </button>
                                                    </div>
                                                    <hr className="hr" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <footer className="modal-card-foot d-flex justify-content-end">
                                    <button className="button is-danger" onClick={() => props.fnAbrir_Cerrar()}>Cancelar</button>
                                    <button className="button is-primary text-center" disabled={state.initialValues.SolicitudRCID <= 0 ? false : true} onClick={() => setLoading(true)} type="submit">Asignar</button>
                                    <button className="button is-link" disabled={state.initialValues.SolicitudRCID <= 0 ? true : false} type="button" onClick={() => ConfirmarSolicitud()}>{loadingSolicitud ? <Spinner /> : 'Enviar Solicitud'}</button>
                                </footer>
                            </Form>
                        )}
                    </Formik>
                </div>
                {/* FIN DE TARJETA */}

            </div>
            <ModalWin
                open={state.MostrarPlazos}
                center={true}

                scrollable
                zIndex={3000}
            >
                <ModalWin.Header>
                    <h5 >

                        <h4 className="has-text-weight-bold">{"Plan de Pagos"}</h4>

                    </h5>
                    <button
                        title="Cerrar"
                        type="button"
                        className="delete"
                        onClick={() => {
                            setState({ ...state, MostrarPlazos: false })
                            setData({ ...data, DatosDetallePlazos: [] })
                        }}
                    />

                </ModalWin.Header>
                <ModalWin.Body>
                    <DataTable
                        // subHeader
                        data={data.DatosPlazoSimulacion}
                        columns={Columns}
                        responsive
                        noHeader

                    />


                </ModalWin.Body>


            </ModalWin>
            {state.showDocumento &&
                <CFormSCRSDocumentos
                    iodc={props.oidc}
                    DistribuidorID={props.distributorId}
                    SolicitudRCID={state.initialValues.SolicitudRCID}
                    Estatus={state.initialValues.Estatus}
                    Accion={state.tabActivo}
                    IdSolicitud={state.initialValues.SolicitudRCID}
                    fnAbrir_Cerrar={() => toggleModalSolicitudCRS()}
                />
            }


        </>
    );



}
export default CFormSCRS;