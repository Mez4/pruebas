import React, { useEffect, useState, useRef } from "react"
import { IOidc } from "../../../../../../interfaces/oidc/IOidc"
import { ErrorMessage, Field, Form, Formik, useFormik } from "formik"
import * as Yup from 'yup'
import { log } from "console"
import { Acordion, ActionFieldNumberText, ActionFieldText, ActionFieldText2, ActionSelect, CustomFieldText, CustomFieldText2, CustomSelect, ModalWin, Spinner, Tabs } from "../../../../../global"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"
import * as Funciones from './Funciones'
import { toast } from "react-toastify"
import { stat } from "fs"
import { FcDocument, FcBriefcase, FcList, FcSurvey } from 'react-icons/fc'
import { FaClipboard } from 'react-icons/fa'
import { parse } from "path"
import { MODAL_TITLE_CLASS } from "../../../../../global/ModalWin";
import DataTable, { IDataTableColumn } from "react-data-table-component"
import moment from "moment"
import { format } from "url"
import { FormateoDinero } from "../../../../../../global/variables"

type CFormType = {
    oidc: IOidc,
    solicitudRCID: number,
    distribuidorID: number,
    cbActualizar(item: boolean): any,
    fnCancelar(): any
    fnActualizar(): any
    TipoAnalista: string

}


export const CFormCRS2 = (props: CFormType) => {

    console.log('CFormCRS2', props);
    const DatosMostrarQuita: any[] = [];
    const DatosMostrarPlazos: any[] = [];
    const DatosDetallePlazos: any = {};
    const DatosPlazoSimulacion: any[] = [];
    const Datos_Solicitud: any[] = [];
    const [data, setData] = useState({
        DatosMostrarQuita,
        DatosMostrarPlazos,
        DatosDetallePlazos,
        DatosPlazoSimulacion,
        Datos_Solicitud
    });

    const [loading, setLoading] = React.useState(false)

    // LIBRERIA PARA MOSTRAR UN MODAL
    const MySwal = withReactContent(Swal);

    const [state, setState] = useState({
        loader: false,
        ShowSolicitudCRS: true,
        showExitAgreement: true,
        showExitRestruct: false,
        showRestruct: false,
        MostrarPlazos: false,
        accion: 0,
        showconvenio: false,
        showReestructura: false,
        showReestructuraSalida: false,
        valorInputIntencion: 0,
        initialValues: {
            saldoActual: 0,
            saldoAtrasado: 0,
            pagoIntencion: 0,
            QuitaID: 0,
            PlazoID: 0,
            observaciones: '',
            TipoReestructura: '',
            DNI: ''
        },
        Accion: 0
    });
    const [valorIntencion, setValorIntencion] = useState<string>('0'); // Inicializa el estado del contenido
    const formRef = useRef();
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { id: 1, action: () => console.log('tab1') },
        { id: 2, action: () => console.log('tab2') },
        { id: 3, action: () => console.log('tab3') }
    ];

    const handleTabClick = (tabNumber) => {
        setActiveTab(tabNumber);

    }

    const ObtenerPorcentajeQuita = () => {
        Funciones.FNGetQuita(props.oidc)
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
        { value: '0', label: 'Selecciona el tipo de rescate', disabled: true },
        { value: 'ROBO', label: 'Por Robo' },
        { value: 'EMERGENCIA', label: 'De Emergencia' },
        { value: 'DESASTRE NATURAL', label: 'Desastre Natural' }
    ]
    const ObtenerPlazos = () => {
        setData(s => ({ ...s, Cargando: true }))

        Funciones.FNGetPlazos(props.oidc)
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
    const ObtenerInformacion = () => {
        Funciones.FNGetSolicitud(props.oidc, props.solicitudRCID)
            .then((res: any) => {
                console.log('res', res);
                setState(s => ({
                    ...s, initialValues: {
                        ...s.initialValues,
                        saldoActual: res.SaldoActual,
                        saldoAtrasado: res.SaldoAtrasado,
                        pagoIntencion: res.MontoIntencion,
                        QuitaID: res.QuitaID,
                        PlazoID: res.PlazoID,
                        observaciones: res.Motivo,
                        TipoReestructura: res.TipoReestructura,
                        DNI: res.DNI


                    },
                    accion: res.Accion
                }));
            })
            .catch((error: any) => {
                setData(s => ({ ...s, Datos_Solicitud: [] }));
                toast.error(`Error: ${error.response}`);
            });
    }
    const planPagos = () => {
        //HACE LA SOLICITUD EN CASO DE NO ASIGNAR POR PRIMERA VEZ
        data.DatosDetallePlazos = (data.DatosDetallePlazos && Object.keys(data.DatosDetallePlazos).length > 0)
            ? data.DatosDetallePlazos
            : state.initialValues;
        // console.log('data.DatosDetallePlazos', data.DatosDetallePlazos);

        if (data.DatosDetallePlazos != undefined) {
            // var objPlazos: any = {}
            if (state.accion === 1) {
                if (data.DatosDetallePlazos.QuitaID > 0) {
                    if (data.DatosDetallePlazos.pagoIntencion > 0) {
                        if (data.DatosDetallePlazos.PlazoID > 0) {
                            setState({ ...state, MostrarPlazos: true });
                            const objPlazos = {
                                SaldoActual: data.DatosDetallePlazos.saldoActual,
                                QuitaID: parseInt(data.DatosDetallePlazos.QuitaID),
                                PlazoID: parseInt(data.DatosDetallePlazos.PlazoID),
                                MontoIntencion: parseFloat(data.DatosDetallePlazos.pagoIntencion),
                                accion: state.accion
                            }
                            console.log('objPlazos', objPlazos);

                            Funciones.FNGetSimulacionPlazos(props.oidc, objPlazos)
                                .then((res: any) => {
                                    console.log(res);
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
            } else if (state.accion === 2) {
                if (data.DatosDetallePlazos.PlazoID > 0) {
                    setState({ ...state, MostrarPlazos: true });
                    const obj = {
                        SaldoActual: data.DatosDetallePlazos.saldoActual,
                        PlazoID: parseInt(data.DatosDetallePlazos.PlazoID),
                        accion: state.accion
                    }
                    Funciones.FNGetSimulacionPlazos(props.oidc, obj)
                        .then((res: any) => {
                            console.log(res);
                            setData(s => ({ ...s, DatosPlazoSimulacion: res }));

                        }).catch((error: any) => {
                            toast.error(`Error: ${error.response}`);
                        })
                } else {
                    toast.error('El plazo es requerido');
                    setLoading(false);
                    return;
                }

            } else if (state.accion === 3) {
                if (data.DatosDetallePlazos.QuitaID > 0) {
                    if (data.DatosDetallePlazos.PlazoID > 0) {
                        setState({ ...state, MostrarPlazos: true });
                        const obj = {
                            SaldoActual: data.DatosDetallePlazos.saldoActual,
                            QuitaID: parseInt(data.DatosDetallePlazos.QuitaID),
                            PlazoID: parseInt(data.DatosDetallePlazos.PlazoID),
                            accion: state.accion,
                            DistribuidorID: props.distribuidorID
                        }
                        Funciones.FNGetSimulacionPlazos(props.oidc, obj)
                            .then((res: any) => {
                                console.log(res);
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
            if (state.accion === 5) {
                        if (data.DatosDetallePlazos.PlazoID > 0) {
                            setState({ ...state, MostrarPlazos: true });
                            const objPlazos = {
                                SaldoActual: data.DatosDetallePlazos.saldoActual,
                                PlazoID: parseInt(data.DatosDetallePlazos.PlazoID),
                                accion: 2
                            }
                            console.log('objPlazos', objPlazos);

                            Funciones.FNGetSimulacionPlazos(props.oidc, objPlazos)
                                .then((res: any) => {
                                    console.log(res);
                                    setData(s => ({ ...s, DatosPlazoSimulacion: res }));

                                }).catch((error: any) => {
                                    toast.error(`Error: ${error.response}`);
                                })

                        } else {
                            toast.error('El plazo es requerido');
                            setLoading(false);
                            return;
                        }
            }

        } else {
            toast.error('No se ha seleccionado un plazo');

        }
    }

    // const cbPorcentaje = (value: any) => {
    //    // setFormValues(s => ({ ...s, DistribuidorId: value }))
    //    // if (!props.isUpdate) {
    //    //     clearFormByLevel(2)
    //    // }
    //    // props.fnGetDatosDistribuidor(value);
    //    // props.fnGetLineaTiendita(value);
    //    var porcentaje = 0;
    //    porcentaje = ((value / props.initialValues.saldoActual) * 100);
    //    props.initialValues.porcentaje = porcentaje;
    //    //valide if the value is a number
    //    if (isNaN((porcentaje))) {
    //        return 0;
    //    }
    //    return porcentaje;
    // }

    const accion2 = () => {
        switch (state.accion) {
            case 1:
                Yup.object().shape({
                    pagoIntencion: Yup.number().required('El pago de intención es requerido')
                        .moreThan(0, 'El pago de intención es requerido'),
                    QuitaID: Yup.number().required('La quita es requerida')
                        .moreThan(0, 'La quita es requerida'),
                    PlazoID: Yup.number().required('El plazo es requerido')
                        .moreThan(0, 'El plazo es requerido'),
                    observaciones: Yup.string().required('Las observaciones son requeridas')
                        .min(1, 'Minimo 4 caracteres')
                        .max(300, 'Maximo 300 caracteres')
                })
                break;
            case 2:
                Yup.object().shape({
                    PlazoID: Yup.number().required('El plazo es requerido')
                        .moreThan(0, 'El plazo es requerido'),
                    observaciones: Yup.string().required('Las observaciones son requeridas')
                        .min(1, 'Minimo 4 caracteres')
                        .max(300, 'Maximo 300 caracteres')
                })
                break;
            case 3:
                Yup.object().shape({
                    QuitaID: Yup.number().required('La quita es requerida')
                        .moreThan(0, 'La quita es requerida'),
                    PlazoID: Yup.number().required('El plazo es requerido')
                        .moreThan(0, 'El plazo es requerido'),
                    observaciones: Yup.string().required('Las observaciones son requeridas')
                        .min(1, 'Minimo 4 caracteres')
                        .max(300, 'Maximo 300 caracteres')
                })
                break;
        }

    };
    const planPagos2 = () => {
        // console.log('plan de pagos', data.DatosDetallePlazos);
        console.log(state.accion);

        setState({ ...state, MostrarPlazos: true });
        if (data.DatosDetallePlazos != undefined) {
            var objPlazos: any = {}
            if (state.accion === 1) {
                objPlazos = {
                    SaldoActual: data.DatosDetallePlazos.saldoActual,
                    IDQuita: data.DatosDetallePlazos.QuitaID,
                    IDPlazos: data.DatosDetallePlazos.PlazoID,
                    MontoIntencion: parseFloat(data.DatosDetallePlazos.pagoIntencion).toFixed(2),
                    accion: state.accion,
                }
                console.log('objPlazos', objPlazos);

            }
        } else {
            toast.error('No se ha seleccionado un plazo');

        }
    }
    useEffect(() => {
        ObtenerInformacion();
        ObtenerPorcentajeQuita();
        ObtenerPlazos()

    }, []);
    // console.log('accioooonR', state.accion)

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
    }, [])

    return (
        <>
            <style>
                {`
                .button:focus:not(:active), .button.is-focused:not(:active){
                    box-shadow : none !important;
                }
                
                `}
            </style>
            <Formik
                initialValues={state.initialValues}
                enableReinitialize
                validationSchema={state.accion == 1 ?
                    Yup.object().shape({
                        pagoIntencion: Yup.number().required('El pago de intención es requerido')
                            .moreThan(0, 'El pago de intención es requerido'),
                        QuitaID: Yup.number().required('La quita es requerida')
                            .moreThan(0, 'La quita es requerida'),
                        PlazoID: Yup.number().required('El plazo es requerido')
                            .moreThan(0, 'El plazo es requerido').typeError('El plazo es requerido'),
                        observaciones: Yup.string().required('Las observaciones son requeridas')
                            .min(1, 'Minimo 4 caracteres')
                            .max(300, 'Maximo 300 caracteres'),
                        observaciones_adicionales: Yup.string().required('Las observaciones son requeridas'),
                        DNI: Yup.string().nullable().notRequired()

                    })
                    : state.accion == 2 ? Yup.object().shape({
                        PlazoID: Yup.number().required('El plazo es requerido')
                            .moreThan(0, 'El plazo es requerido').typeError('El plazo es requerido'),
                        observaciones: Yup.string().required('Las observaciones son requeridas')
                            .min(1, 'Minimo 4 caracteres')
                            .max(300, 'Maximo 300 caracteres'),
                        //ESCOJER CUALQUIER TIPO DE REESTRUCTURA A EXCEPCION DE 'Seleccion el tipo de rescate'
                        TipoReestructura: Yup.string()
                            .notOneOf(['default'], 'El tipo de reestructura es requerido')
                            .required('El tipo de reestructura es requerido'),
                        observaciones_adicionales: Yup.string().required('Las observaciones son requeridas')
                    }) : state.accion == 3 ?
                        Yup.object().shape({
                            QuitaID: Yup.number().required('La quita es requerida')
                                .moreThan(0, 'La quita es requerida'),
                            PlazoID: Yup.number().required('El plazo es requerido')
                                .moreThan(0, 'El plazo es requerido'),
                            observaciones: Yup.string().required('Las observaciones son requeridas')
                                .min(1, 'Minimo 4 caracteres')
                                .max(300, 'Maximo 300 caracteres'),
                            observaciones_adicionales: Yup.string().required('Las observaciones son requeridas')
                        }) : Yup.object().shape({})}
                onSubmit={(values) => {
                    const obj = {
                        ...values,
                        accion: state.accion
                    }
                    console.log('objeto', obj);


                    MySwal.fire({
                        title: '<strong>Convenios y Reestructura</strong>',
                        icon: 'question',
                        html:
                            <div className="text-center">
                                ¿Esta seguro de de realizar la acción? Una vez aceptado, los cambios no podrán ser modificados
                            </div>,
                        showCloseButton: false,
                        showCancelButton: true,
                        showConfirmButton: true,
                        focusConfirm: false,
                        cancelButtonText: 'Cancelar',
                        confirmButtonText: 'Aceptar',
                        confirmButtonAriaLabel: 'Aceptar',
                        cancelButtonAriaLabel: ''

                    }).then((result) => {
                        if (result.isConfirmed) {
                            const obj = {
                                ...values,
                                SolicitudRCID: props.solicitudRCID,
                                DistribuidorID: props.distribuidorID,
                                accion: state.accion
                            }
                            Funciones.FNAdd(props.oidc, obj)
                                .then((respuesta: any) => {
                                    props.fnCancelar()
                                    setLoading(false)
                                    toast.success(respuesta.msg);
                                    props.fnActualizar();
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
                    }).catch((error) => {
                        toast.error("Error en el formulario, favor de revisar los datos");
                    });
                }}
            >
                {({ setFieldValue, values }) => (
                    <Form onClick={() => setData({ ...data, DatosDetallePlazos: values })}>
                        <>


                            {(state.accion === 1 || state.accion === 5) &&
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
                                        {state.accion === 1 && <div className="col-sm-12 col-md-2 col-lg-2 col-xl-2 text-center">
                                            <CustomSelect
                                                disabled={false}
                                                label="Quita%"
                                                name="QuitaID"
                                                placeholder="Selecciona la quita"
                                                options={data.DatosMostrarQuita}
                                                addDefault={false}
                                            />
                                        </div>}
                                        <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 text-center d-flex justify-content-center my-auto">
                                            <button
                                                type="button"
                                                className={`button is-link  waves-effect waves-light is-small `}
                                                onClick={() => { planPagos() }}>
                                                <span className='icon is-small'><i className='fa fa-eye' aria-hidden="true"></i></span>
                                                <span className="is-hidden-mobile">Ver plan pagos</span>&nbsp;
                                            </button>
                                        </div>

                                    </div>

                                    <div className="row">

                                        {state.accion === 1 && <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 text-center">
                                            <div className="mb-3">
                                                <label className="form-label mb-0" htmlFor={"porcentaje"}>Pago Intención</label>
                                                <Field
                                                    autoComplete="off"
                                                    className="form-control"
                                                    type="number"
                                                    id={"pagoIntencion"}
                                                    name="pagoIntencion"
                                                    render={({ field }) => (

                                                        <input
                                                            className="form-control"
                                                            {...field}
                                                            disabled={true}
                                                            type="number" onChange={(e: any) => {
                                                                const newValue = e.target.value
                                                                setFieldValue('pagoIntencion', newValue);
                                                                var valor = parseFloat(newValue);
                                                                if (isNaN(valor)) {
                                                                    return;
                                                                }
                                                                const porcentaje = ((valor / state.initialValues.saldoActual) * 100).toFixed(2);
                                                                if (isNaN(parseFloat(porcentaje))) {
                                                                    return;
                                                                }
                                                                setFieldValue('porcentaje', porcentaje);

                                                            }}
                                                        />


                                                    )}
                                                />
                                                <ErrorMessage component="div" name="pagoIntencion" className="text-danger" />
                                            </div>

                                        </div>}
                                        {state.accion === 1 && <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 text-center">
                                            {/* <CustomFieldText disabled={true} label="P.Intención(%)" name="porcentaje" placeholder="0"/> */}
                                            <div className="mb-3">
                                                <label className="form-label mb-0" htmlFor={"porcentaje"}>P.Intención(%)</label>
                                                <Field autoComplete="off" disabled={true} className="form-control" type="text" id={"porcentaje"} name={"porcentaje"} />
                                                <ErrorMessage component="div" name="porcentaje" className="text-danger" />
                                            </div>
                                        </div>}
                                        <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 text-center">
                                            <CustomSelect
                                                disabled={false}
                                                label="Plazos"
                                                name="PlazoID"
                                                placeholder="Selecciona el plazo"
                                                options={data.DatosMostrarPlazos}
                                                addDefault={false}

                                            />
                                        </div>
                                        {state.accion === 1 && <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 text-center">
                                            <CustomFieldText
                                                disabled={true}
                                                label='DNI'
                                                name='DNI'
                                                placeholder='Opcional' />
                                        </div>}
                                    </div>

                                    <div className="row">
                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center">
                                            <CustomFieldText
                                                disabled={true}
                                                label="Observaciones"
                                                name="observaciones"
                                                placeholder="Comentarios de Solicitud" />
                                        </div>
                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center">
                                            <CustomFieldText disabled={false} label="Observaciones adicionales" name="observaciones_adicionales" placeholder="Comentarios adicionales" />
                                        </div>
                                    </div>
                                </>

                            }

                            {state.accion === 2 &&
                                <>
                                    <div className="row">
                                        <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 text-center ">
                                            <CustomFieldText disabled={true} label="Saldo Actual" name="saldoActual" placeholder="0" />
                                        </div>
                                        <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 text-center ">
                                            <CustomFieldText disabled={true} label="Saldo Atrasado" name="saldoAtrasado" placeholder="0" />
                                        </div>
                                        <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 text-center d-flex justify-content-center my-auto">
                                            <button
                                                type="button"
                                                className={`button is-link  waves-effect waves-light is-small `}
                                                onClick={() => { planPagos() }}>
                                                <span className='icon is-small'><i className='fa fa-eye' aria-hidden="true"></i></span>
                                                <span className="is-hidden-mobile">Ver plan pagos</span>&nbsp;
                                            </button>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 text-center ">
                                            <CustomSelect
                                                disabled={false}
                                                label="Plazos"
                                                name="PlazoID"
                                                placeholder="Selecciona el plazo"
                                                options={data.DatosMostrarPlazos}
                                                addDefault={false}
                                                isMulti

                                            />
                                        </div>
                                        <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 text-center ">
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
                                            <CustomFieldText disabled={true} label="Observaciones" name="observaciones" placeholder="Comentarios de Solicitud" />
                                        </div>
                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center">
                                            <CustomFieldText disabled={false} label="Observaciones adicionales" name="observaciones_adicionales" placeholder="Comentarios adicionales" />
                                        </div>
                                    </div>
                                </>


                            }
                            {state.accion === 3 &&

                                <>
                                    <div className="row">
                                        <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 text-center">
                                            <CustomFieldText disabled={true} label="Saldo Actual" name="saldoActual" placeholder="0" />
                                        </div>
                                        <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 text-center">
                                            <CustomFieldText disabled={true} label="Saldo Atrasado" name="saldoAtrasado" placeholder="0" />
                                        </div>
                                        <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 text-center d-flex justify-content-center my-auto">
                                            <button
                                                type="button"
                                                className={`button is-link  waves-effect waves-light is-small `}
                                                onClick={() => { planPagos() }}>
                                                <span className='icon is-small'><i className='fa fa-eye' aria-hidden="true"></i></span>
                                                <span className="is-hidden-mobile">Ver plan pagos</span>&nbsp;
                                            </button>
                                        </div>


                                    </div>

                                    <div className="row">
                                        <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 text-center">
                                            <CustomSelect
                                                disabled={false}
                                                label="Quita%"
                                                name="QuitaID"
                                                placeholder="Selecciona la quita"
                                                options={data.DatosMostrarQuita}
                                                addDefault={false}
                                            />
                                        </div>
                                        <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 text-center">
                                            <CustomSelect
                                                disabled={false}
                                                label="Plazos"
                                                name="PlazoID"
                                                placeholder="Selecciona el plazo"
                                                options={data.DatosMostrarPlazos}
                                                addDefault={false}
                                                isMulti

                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center">
                                            <CustomFieldText disabled={true} label="Observaciones" name="observaciones" placeholder="Comentarios de Solicitud" />
                                        </div>
                                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center">
                                            <CustomFieldText disabled={false} label="Observaciones adicionales" name="observaciones_adicionales" placeholder="Comentarios adicionales" />
                                        </div>
                                    </div>

                                </>
                            }

                        </>
                        {loading && <Spinner />}
                        {!loading &&
                            <div className="text-end">
                                <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                    Cancelar
                                </button>
                                <button disabled={props.TipoAnalista === 'ANL'} type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                    Aceptar
                                </button>
                            </div>
                        }
                    </Form>
                )}
            </Formik>
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
        </>
    )

}
export default CFormCRS2;