import { useEffect, useState, useRef } from "react"
import { IOidc } from "../../../../../../interfaces/oidc/IOidc"
import { Form, Formik, useFormik } from "formik"
import * as Yup from 'yup'
import { log } from "console"
import { ActionSelect, CustomSelect } from "../../../../../global"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"
import * as Funciones from './Funciones'
import { toast } from "react-toastify"
import { stat } from "fs"
type CFormType = {
    oidc: IOidc,
    distributorId: number,
    cbActualizar(item: boolean): any
    //loader : boolean,
    // error : boolean,

    // initialValues : {
    //     currentBalance : number,
    //     overdueBalance : number,
    //     remove : number,
    //     deadlines : number
    // }
}


export const CFormCRS = (props: CFormType) => {
    const DatosMostrarQuita: any[] = [];
    const [data, setData] = useState({
        DatosMostrarQuita,
    });

    // LIBRERIA PARA MOSTRAR UN MODAL
    const MySwal = withReactContent(Swal);
    // PROPIEDADES DE FORMIK
    const validationSchema = Yup.object({
        remove: Yup.number().required(),
        intentionPaymentAmount: Yup.number().required(),
        deadLines: Yup.number().required(),
        // intentionPercentage: Yup.number().required(),
        observations: Yup.string().required()
    });
    const formik = useFormik({
        initialValues: {
            remove: 0,
            intentionPaymentAmount: 0,
            deadLines: 0,
            intentionPercentage: 0,
            observations: ""
        },
        validationSchema: validationSchema,
        onSubmit: values => {
            console.log("Form", values);
        }
    });
    const deadlines: any = [];
    // const quita:number[] = [10,15,20,25,30,35,40];
    const quita: { value: number, label: string }[] = [
        { value: 10, label: "10" },
        { value: 15, label: "20" },
        { value: 20, label: "30" },
        { value: 25, label: "40" },
        { value: 30, label: "50" },
        { value: 35, label: "60" },
        { value: 40, label: "70" }
    ];
    for (let i = 6; i <= 24; i++) {
        deadlines.push(<option key={i} value={formik.values.deadLines} onChange={formik.handleChange}>{i} QUINCENAS</option>);
    }
    const [state, setState] = useState({
        loader: false,
        ShowSolicitudCRS: true,
        showExitAgreement: true,
        showExitRestruct: false,
        showRestruct: false,
        valorInputIntencion: 0,
        initialValues: {
            currentBalance: 0,
            overdueBalance: 0,
        }
    });
    const [valorIntencion, setValorIntencion] = useState<string>('0'); // Inicializa el estado del contenido

    const showSimulatorDeadlines = () => {
        MySwal.fire({
            title: '<p className="text-center"> Simulacion de pagos </p>',
            showCloseButton: true,
            showConfirmButton: true
        })
    }
    const ObtenerPorcentajeQuita = () => {
        Funciones.FNGetQuita(props.oidc)
            .then((res: any) => {

                var quitas = res.map((val: any) => {
                    var obj = { value: val.PorcientoQuita, label: val.PagosNombre }
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
    const ObtenerDistribuidor = () => {
        let obj = {
            DistribuidorID: props.distributorId
        };
        Funciones.FNGet(props.oidc, obj)
            .then((res: any) => {
                console.log(res.data);
                res = res.data;
                setState(s => ({ ...s, initialValues: { currentBalance: res.saldoActual, overdueBalance: res.SaldoAtrasado } }));
            })
            .catch((error: any) => {
                toast.error(`Error: ${error.response.msg}`);
            });
    }
    useEffect(() => {
        const timeout = setTimeout(() => {

            formik.setFieldValue('intentionPercentage', calcularPorcentaje());
        }, 600);
        return () => {
            clearTimeout(timeout);
        };
    }, [valorIntencion]);

    const cambiarPorcentaje = (e: any) => {
        console.log("Numero capturado ,", e)
        setValorIntencion(e);
    };

    const calcularPorcentaje = () => {
        //Convert the string to a number
        const valorIntencionNuevo = parseFloat(valorIntencion);
        //send on formik
        formik.setFieldValue('intentionPaymentAmount', valorIntencionNuevo);
        //valide if the value is a number
        if (isNaN(valorIntencionNuevo)) {
            return 0;
        }
        const porcentaje = ((valorIntencionNuevo / state.initialValues.currentBalance) * 100).toFixed(2);
        //valide if the value is a number
        if (isNaN(parseFloat(porcentaje))) {
            return 0;
        }
        return porcentaje;
    }


    useEffect(() => {
        ObtenerDistribuidor();
        ObtenerPorcentajeQuita();
        // return () => {
        //     isMounted.current = false
        // }
    }, []);

    const changeTab = (caseTab: number) => {
        switch (caseTab) {
            case 1:
                return setState(s => ({ ...s, showExitAgreement: true, showExitRestruct: false, showRestruct: false }));
            case 2:
                return setState(s => ({ ...s, showExitAgreement: false, showExitRestruct: false, showRestruct: true }));
            case 3:
                return setState(s => ({ ...s, showExitAgreement: false, showExitRestruct: true, showRestruct: false }));
        }
    }
    const toggleModalContract = () => {
        setState(s => ({ ...s, ShowSolicitudCRS: !state.ShowSolicitudCRS }));

    }
    return (
        <>
            <div className={`modal ${state.ShowSolicitudCRS ? 'is-active' : ''}`}>
                {/* FONDO NEGRO QUE AL DAR CLICK SE SALE DEL MODAL */}
                <div className="modal-background" onClick={() => props.cbActualizar(state.ShowSolicitudCRS)}></div>
                {/* COMIENZO DE TARJETA */}
                <div className="modal-card">
                    {/* CABEZERA DE LA TARJETA */}
                    <header className="modal-card-head">
                        <p className="modal-card-title fs-4 fw-semibold">CONVENIO Y REESTRUCTURAS</p>
                        {/* AL DAR CLICK EN EL BOTON SE SALDRA DEL MODAL */}
                        <button className="delete" aria-label="close" onClick={() => props.cbActualizar(state.ShowSolicitudCRS)}></button>
                    </header>
                    {/* CUERPO DE LA TARJETA */}
                    <form onSubmit={formik.handleSubmit}>
                        <section className="modal-card-body">
                            <div className="container">

                                <div className="tabs is-boxed">
                                    {/* do select of quita */}


                                    {/* showExitAgreement : true,
                                            showExitRestruct : false,
                                            showRestruct : false, */}
                                    <ul className='pl-1'>
                                        <li className={`${state.showExitAgreement ? 'is-active' : ''}`}>
                                            <a onClick={() => changeTab(1)}>
                                                <span className='icon is-small'><i className='fa fa-receipt' aria-hidden="true"></i></span>
                                                <span>Convenio Salida</span>
                                            </a>
                                        </li>
                                        <li className={`${state.showRestruct ? 'is-active' : ''}`}>
                                            <a onClick={() => changeTab(2)}>
                                                <span className='icon is-small'><i className='fa fa-briefcase' aria-hidden="true"></i></span>
                                                <span>Reestructuras</span>
                                            </a>
                                        </li>
                                        <li className={`${state.showExitRestruct ? 'is-active' : ''}`}>
                                            <a onClick={() => changeTab(3)}>
                                                <span className='icon is-small'><i className='fa fa-clipboard-list' aria-hidden="true"></i></span>
                                                <span>Reestructura Salida</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className='row input-group'>
                                    <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 text-center">
                                        <label className='form-label fs-6 text fw-bold'>Saldo actual</label>
                                        <input className='input text-center is-small  ' type="input" placeholder='Saldo de la distribuidora...' value={state.initialValues.currentBalance} disabled />
                                    </div>
                                    <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 text-center">
                                        <label className='form-label fs-6 text fw-bold'>Saldo atrasado</label>
                                        <input className='input text-center is-small  ' type="input" placeholder='Saldo de la distribuidora...' value={state.initialValues.overdueBalance} disabled />
                                    </div>
                                    <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 text-center">
                                        <label className='form-label fs-6 text fw-bold'>Simular pagos</label>
                                        <button
                                            type="button"
                                            className={`button is-light  waves-effect waves-light is-small `}
                                            onClick={() => { showSimulatorDeadlines() }}>
                                            <span className='icon is-small'><i className='fa fa-credit-card' aria-hidden="true"></i></span>
                                            <span className="is-hidden-mobile">Ver plan pagos</span>&nbsp;
                                        </button>
                                    </div>
                                </div>
                                <div className="row input-group mt-4">
                                    {(state.showExitAgreement || state.showExitRestruct) &&
                                        <div className={`col-sm-12 col-md-3 col-lg-3 col-xl-3 text-center`}>
                                            <label className='form-label fs-6 text fw-bold'>Quita (%)</label>
                                            {/* actionselect with data.datosmostrarquita  */}
                                            {/* <CustomSelect
                                                disabled={false}
                                                label="Quita"
                                                name="QuitaID"
                                                placeholder="Selecciona una quita"
                                                options={data.DatosMostrarQuita}
                                                addDefault={false}
                                            /> */}

                                            {/* <select className=' form-select ' name="remove" id="remove" onChange={formik.handleChange} value={formik.values.remove}>
                                                {quita.map((opcion, index) => (
                                                    <option key={index} value={formik.values.remove} onChange={formik.handleChange} >
                                                        Quita de {opcion.value}%
                                                    </option>
                                                ))}
                                            </select> */}
                                        </div>
                                    }

                                    {(state.showExitAgreement) &&
                                        <>
                                            <div className="col-sm-12 col-md-4 col-lg-3 col-xl-3 text-center">
                                                <label className='form-label fs-6 text fw-bold'>Pago intención</label>
                                                <input className='input text-center is-small  '
                                                    name="intentionPaymentAmount"
                                                    value={valorIntencion} id="intentionPaymentAmount"
                                                    onChange={e => cambiarPorcentaje(e.target.value)}
                                                    type="number"
                                                    placeholder='Saldo de la distribuidora...' />
                                            </div>
                                            <div className="col-sm-12 col-md-4 col-lg-3 col-xl-3 text-center">
                                                <label className='form-label fs-6 text fw-bold'>P. Intencion (%)</label>
                                                <input className='input text-center is-small' id="intentionPercentage" disabled onChange={formik.handleChange} value={formik.values.intentionPercentage} name="intentionPercentage" type="input" placeholder='Saldo de la distribuidora...' />
                                            </div>
                                        </>
                                    }
                                    <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 text-center ">
                                        <label className='form-label fs-6 text fw-bold'>Plazo</label>
                                        <select className=' form-select ' id="deadLines" name="deadLines" onChange={formik.handleChange} value={formik.values.deadLines}>
                                            {deadlines.map(option => {
                                                return option
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className="row input-group mt-2">
                                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center">
                                        <label className='form-label fs-6 text fw-bold'>OBSERVACIONES</label>
                                        {/* <input className='input text-center is-small' type="input" placeholder='Comentarios de solicitud'/> */}
                                        <textarea className="textarea" id="observations" name="observations" placeholder="Comentarios de solicitud" rows={2} onChange={formik.handleChange} value={formik.values.observations} ></textarea>
                                    </div>
                                </div>


                            </div>

                        </section>
                        <footer className="modal-card-foot d-flex justify-content-end">
                            <button className="button is-danger" onClick={() => props.cbActualizar(state.ShowSolicitudCRS)}>Cancelar</button>
                            <button className="button is-success" type="submit">Guardar</button>
                        </footer>
                    </form>
                    {/* PIE DE PAGINA */}

                </div>
                {/* FIN DE TARJETA */}
            </div>

        </>
    )
}