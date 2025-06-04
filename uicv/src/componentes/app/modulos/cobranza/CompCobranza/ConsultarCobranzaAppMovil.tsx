import React, { useState } from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './ConsultarCobranzaAppMovil/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaBan, FaCashRegister, FaListAlt, FaMoneyBill, FaMoneyBillAlt, FaMoneyCheck, FaDollarSign, FaCreditCard, FaPrint } from 'react-icons/fa'

// Custom components
import { ActionSelect, Card, CustomSelect, DatePickeEnd, DatePickeStart, Spinner } from '../../../../global'

// import { CForm } from './CreditoCredito/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { DBConfia_Creditos } from '../../../../../interfaces_db/DBConfia/Creditos';
import DatePicker, { registerLocale } from "react-datepicker"
import * as Yup from 'yup'
import ReactTooltip from 'react-tooltip';
import moment from 'moment'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { DBConfia_STP } from '../../../../../interfaces_db/DBConfia/STP'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { FormateoDinero } from '../../../../../global/variables'
import { iUI } from '../../../../../interfaces/ui/iUI'
import XLSX from 'xlsx';
import { toast } from 'react-toastify'
import { DBConfia_Cobranza } from '../../../../../interfaces_db/DBConfia/Cobranza'

type CatalogosType = {
    oidc: IOidc,
    ui: iUI,
    Filtro2: boolean,

    initialValues: {
        CuentaOrdenante: number,
        NombreOrdenante: string,
        Estatus: string,
        TipoCuenta: number,
        Cliente: string,
    },
    Options: { value: number, label: string }[],
    fnPrinting(loading: boolean): any,
    DatosExcel: any[],

}

type EstadoTipo = {
    Datos: DBConfia_Cobranza.IPorCobrar[],
    DatosMostrar: DBConfia_Cobranza.IPorCobrar[],
    DispersionesSeleccionadas: [],
    CantidadDispersionesSeleccionadas: number,
    optEstatus,
    otpTipoCuenta,
    optCuentasOrdenantes,
    optCuentasOrdenantes2,
    optCuentasOrdenantes3,
    optCuentasOrdenantes4,
    optCuentasOrdenantes5,
    optNombresOrdenandes,
    optDistribuidor,
    DatosTabla,
    DatosExcel: any[]
    DatosExcel2: any[]
    FiltroEncargado: number,
    Filtro2: boolean,
    DatosFormik: {
        fechaInicial: "",
        //fechaFinal = format today date to YYYY-MM-DD to string
        fechaFinal: "",
        SucursalID: 0,
        EstatusSolicitudID: 0,
        EstatusClave: ""
    },
    Filtro: string,
    Cargando: boolean,
    Error: boolean,
    Detalle: boolean,
    RespRes: boolean,
    Form:
    {
        Mostrar: boolean,
    },

}

const ConsultarDispersionH2H = (props: CatalogosType) => {
    let isMounted = React.useRef(true)


    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });



    const [sucursal, setSucursal] = React.useState("")


    const [state, setState] = React.useState<EstadoTipo>({

        Datos: [],
        DatosMostrar: [],
        optEstatus: [],
        optDistribuidor: [],
        DatosTabla: [],
        otpTipoCuenta: [],
        optCuentasOrdenantes: [],
        optCuentasOrdenantes2: [],
        optCuentasOrdenantes3: [],
        optCuentasOrdenantes4: [],
        optCuentasOrdenantes5: [],
        optNombresOrdenandes: [],
        FiltroEncargado: 0,
        DispersionesSeleccionadas: [],
        DatosExcel: [],
        DatosExcel2: [],
        Filtro2: false,

        CantidadDispersionesSeleccionadas: 0,
        Filtro: '',
        DatosFormik: {
            fechaInicial: "",
            //fechaFinal = format today date to YYYY-MM-DD to string
            fechaFinal: "",
            SucursalID: 0,
            EstatusSolicitudID: 0,
            EstatusClave: ""
        },
        Form:
        {
            Mostrar: false,
        },
        Cargando: false,
        Error: false,
        Detalle: false,
        RespRes: false,


    })





    const Columns: IDataTableColumn[] =
        [
            { name: 'ID Por Cobrar', selector: 'porCobrarId', wrap: true, sortable: false, center: true },
            { name: 'ID Credito', center: true, selector: 'creditoId', wrap: true, sortable: false },
            { name: 'Producto', selector: 'productoId', wrap: true, sortable: false, center: true },
            { name: 'Sucursal', selector: 'sucursalId', wrap: true, sortable: false, center: true },
            { name: 'Cobrador Asignado', selector: 'cobradorAsignado', wrap: true, sortable: false, center: true },
            { name: 'Nombre Completo', selector: 'nombreCompleto', wrap: true, sortable: false, center: true },
            { name: 'Celular', selector: 'celular', wrap: true, sortable: false, center: true },
            { name: 'Domicilio', selector: 'domicilio', wrap: true, sortable: false, center: true },
            { name: 'Tipo de Credito', selector: 'tipoCredito', wrap: true, sortable: false, center: true },
            { name: 'Monto a Cobrar', selector: 'montoCobrar', wrap: true, sortable: false, center: true },
            { name: 'Monto Abonado', selector: 'montoAbonado', wrap: true, sortable: false, center: true },
            { name: 'Fecha Ultimo Pago', selector: 'fechaUltimoPago', wrap: true, sortable: false, center: true },
            { name: 'Estatus', selector: 'estatus', wrap: true, sortable: false, center: true },
            { name: 'Puede Realizar Quita', selector: 'puedeRealizarQuita', wrap: true, sortable: false, center: true },
            { name: 'Quita por Rango Minimo', selector: 'quitaPorcRangoMin', wrap: true, sortable: false, center: true },
            { name: 'Quita por Rango Maximo', selector: 'quitaPorcRangoMax', wrap: true, sortable: false, center: true },
            { name: 'Fecha Creacion', selector: 'creacionFecha', wrap: true, sortable: false, center: true },
            /* {
                name: 'Acciones', sortable: false, center: true,
                cell: (propss) => <div className='text-center'>
                    <button className="asstext mx-1" type={"button"} onClick={() => {
                        console.log(propss)
                    }}>
                        <FaPencilAlt />
                    </button>
                    <button disabled={propss.datoBancario == null ? false : true} data-tip data-for={`DetailToolTip${propss.CreditoID}`} className="asstext mx-1" type={"button"} onClick={() => {
                        //state Form.Mostrar = true
                        setState({
                            ...state,
                            Form: {
                                ...state.Form,
                                Mostrar: true
                            }
                        })



                    }}>
                        <FaCreditCard />
                    </button>
                    <ReactTooltip id={`DetailToolTip${propss.CreditoID}`}
                        type="info"
                        effect="solid"
                        clickable
                        globalEventOff="click"
                    >
                        {propss.datoBancario == null && "Desembolsar a tarjeta de débito"}
                        {propss.datoBancario != null && "Cliente cuenta con CLABE registrada"}
                    </ReactTooltip>
                </div>
            }, */
        ]
    const FNget2 = (valor: any, valor2: any, valor3: any, valor4: any, valor5: any, valor6: any, valor7: any, valor8: any, valor9: any, valor10: any) => {
        let b = {
            porCobrarId: valor,
            creditoId: valor2,
            productoId: valor3,
            sucursalId: valor4,
            cobradorAsignado: valor5,
            tipoCredito: valor6,
            estatus: valor7,
            puedeRealizarQuita: valor8,
            FechaInicio: valor9,
            FechaFin: valor10

        }
        Funciones.FNgetbyfiltrosCobranza(props.oidc, b)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var datt = respuesta.map((valor: any) => {
                        var obj = {
                            ID_PorCobrar: valor.porCobrarId,
                            ID_Credito: valor.creditoId,
                            Producto: valor.productoId,
                            Sucursal: valor.sucursalId,
                            Cobrador: valor.cobradorAsignado,
                            Nombre: valor.nombreCompleto,
                            Celular: valor.celular,
                            Domicilio: valor.domicilio,
                            Credito: valor.tipoCredito,
                            Monto_Cobrar: valor.montoCobrar,
                            Monto_Abonado: valor.montoAbonado,
                            UltimoPago: valor.fechaUltimoPago,
                            Estatus: valor.estatus,
                            Reaiza_Quita: valor.puedeRealizarQuita,
                            Quita_Min: valor.quitaPorcRangoMin,
                            Quita_Max: valor.quitaPorcRangoMax,
                            FechaCreacion: valor.creacionFecha
                        };
                        return obj
                    });
                    setState(s => ({ ...s, Cargando: false, Datos: respuesta, RespRes: true, DatosExcel2: datt, Filtro2: true }))
                    setLoading(false)

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Datos: [], DatosExcel2: [], Filtro2: false }))
                    setLoading(false)
                }

            })
    }

    const FNGet = (valor1: any, valor2: any, valor3: any, valor4: any, valor5: any, valor6: any, valor7: any) => {
        let a = {
            FechaInicio: valor1,
            FechaFin: valor2,
            CuentaOrdenante: valor3,
            NombreOrdenante: valor4,
            NombreBeneficiario: valor5,
            EstadoDispersionID: valor6,
            ClaveTipoCuenta: valor7,
        }
        Funciones.FNgetbyfiltros(props.oidc, a)
            .then((respuesta: any) => {
                /* if (respuesta.length > 0) {
 */

                if (isMounted.current === true) {
                    var Excelit = respuesta.map((valor: any) => {
                        var obj = {
                            ClaveSTP: valor.ClaveDispersionSTP,
                            Clave_Rastreo: valor.ClaveRastreo,
                            Nombre_Cliente: valor.NombreBeneficiario,
                            Total: valor.Monto,
                            Cta_Beneficiario: valor.CuentaBeneficiario,
                            Tipo_Cuenta: valor.DescripcionTipoCuenta,
                            Banco: valor.BancoNombre,
                            Estatus: valor.EstadoDisp,
                            Causa_Dev: valor.CausaDevolucion,
                            Fecha_Origen: valor.FechaRegistro,
                            Fecha_Actualizacion: valor.FechaActualizacion
                        };
                        return obj
                    });

                    setState(s => ({ ...s, Cargando: false, Datos: respuesta, RespRes: true, DatosExcel: Excelit, Filtro2: true }))
                    setLoading(false)
                }
                /*  } */
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Datos: [], DatosExcel: [], Filtro2: false }))
                    setLoading(false)
                }

            })
    }

    const generarXLSX = () => {
        toast.success("Excel Generado")

        const XLSX = require('xlsx-js-style');


        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(state.DatosExcel2);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        const styleHeader = {
            font: {
                name: 'Calibri',
                sz: 12,
                bold: true,
            },
            alignment: {
                horizontal: 'center',
                vertical: 'center',
            },
            fill: {
                fgColor: { rgb: "FFFF00" }
            },
            wpx: 800

        };

        var range = XLSX.utils.decode_range(ws['!ref']);
        var noRows = range.e.r; // No.of rows
        var noCols = range.e.c; // No. of cols

        for (let i in ws) {
            if (typeof (ws[i]) != "object") continue;
            let cell = XLSX.utils.decode_cell(i);
            if (cell.r === 0) {
                ws[i].s = styleHeader;
            }
        }

        XLSX.writeFile(wb, 'ConsultaCobranza.xlsx');


    }
    const fnImprimir = () => {
        setLoading(true)
        toast.success("PDF Generado")

        Funciones.imprimircobranza(props.oidc)
            .then((respuesta: any) => {

                const file = new Blob(
                    [respuesta],
                    { type: 'application/pdf' });


                const fileURL = URL.createObjectURL(file);

                window.open(fileURL);
                props.fnPrinting(false)
                setLoading(false)

            })
            .catch((err) => {
                setLoading(false)
                setState(s => ({ ...s, error: true, DatosTabla: [] }))

            })

    }
    const FNGetEstatus = () => {
        Funciones.FNGetPorCobrar(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    var Estado = respuesta.map((valor: any) => {
                        var obj = { value: valor.value, label: valor.CreditoID };
                        return obj
                    });
                    console.log("ESTATUS ,", Estado)

                    setState(s => ({ ...s, optEstatus: Estado }))

                    // }
                }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, options: [] }))
                // }
            })
    }
    const FNGetTipoCuentaBancario = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetProductoYEmpresa(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var Estado = respuesta.map((valor: any) => {
                        var obj = { value: valor.ProductoID, label:`ID: ${valor.ProductoID} - ${ valor.Producto  }, Empresa: ${ valor.EmpresaNombre }`};
                        return obj
                    });
                    setState(s => ({ ...s, otpTipoCuenta: Estado, Cargando: false }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, otpTipoCuenta: [] }))
                }
            })
    }
    const FNGetCuentaOrdenanteo3 = () => {
        Funciones.FNGetPorCobrar(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var Estado = respuesta.map((valor: any) => {
                        var obj = { value: valor.cobradorAsignado, label: valor.cobradorAsignado };
                        console.log("OBJETO ,", obj)
                        return obj
                    });
                    setState(s => ({ ...s, optCuentasOrdenantes4: Estado, Cargando: false }))


                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, optCuentasOrdenantes4: [], Cargando: false }))

                }
            })
    }
    const FNGetCuentaOrdenanteo = () => {
        Funciones.FNGetPorCobrar(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    var Estado = respuesta.map((valor: any) => {
                        var obj = { value: valor.estatus, label: valor.estatus };
                        console.log("OBJETO ,", obj)
                        return obj
                    });
                    setState(s => ({ ...s, optCuentasOrdenantes: Estado, Cargando: false }))


                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, optCuentasOrdenantes: [], Cargando: false }))

                }
            })
    }

    const FNGetCuentaOrdenanteo2 = () => {
        Funciones.FNGetPorCobrar(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    let valor = 0;
                    respuesta.forEach(element => {
                        console.log("ITERANDO")
                        valor += 1
                        element["value"] = valor
                    });

                    var Estado = respuesta.map((valor: any) => {
                        var obj = { value: valor.value, label: valor.sucursalId };
                        console.log("SUCURSAL ,", obj)
                        return obj
                    });
                    setState(s => ({ ...s, optCuentasOrdenantes2: Estado, Cargando: false }))


                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, optCuentasOrdenantes2: [], Cargando: false }))

                }
            })
    }

    const FNGetCuentaOrdenanteo4 = () => {
        Funciones.FNGetPorCobrar(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    let valor = 0;
                    respuesta.forEach(element => {
                        console.log("ITERANDO")
                        valor += 1
                        element["value"] = valor
                    });

                    var Estado = respuesta.map((valor: any) => {
                        var obj = { value: valor.value, label: valor.puedeRealizarQuita };
                        console.log("OBJETO ,", obj)
                        return obj
                    });
                    setState(s => ({ ...s, optCuentasOrdenantes5: Estado, Cargando: false }))


                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, optCuentasOrdenantes5: [], Cargando: false }))

                }
            })
    }

    const FNGetNombreOrdenante = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetPorCobrar(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    var Estado = respuesta.map((valor: any) => {
                        var obj = { value: valor.tipoCredito, label: valor.tipoCredito };
                        console.log("OBJETO2 ,", obj)
                        return obj
                    });
                    setState(s => ({ ...s, optNombresOrdenandes: Estado, Cargando: false }))


                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, optNombresOrdenandes: [], Cargando: false }))

                }
            })
    }





    React.useEffect(() => {
        if (isMounted.current === true) {
            FNGetNombreOrdenante();
            FNGetTipoCuentaBancario();
            FNGetEstatus();
            FNGetCuentaOrdenanteo();
            FNGetCuentaOrdenanteo2();
            FNGetCuentaOrdenanteo3();
            FNGetCuentaOrdenanteo4();



        }
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])
    const fnCancelar = () => setState({
        ...state, Form: {
            ...state.Form, Mostrar: false,
        }

    })
    const [loading, setLoading] = React.useState(false)
    const [nombreOrdenante, setnombreOrdenante] = React.useState("")
    const [cuentaOrdenante, setcuentaOrdenante] = React.useState("")


    const [startDate, setStartDate] = useState(moment().add(-30, 'd').toDate());
    const [endDate, setEndDate] = useState(moment().toDate());
    const funcionCargando = (cargando: any) => {
        //Seteo el estado de cargando
        setState({ ...state, Cargando: cargando })
    }
    const fnGetFiltrosEncargado = (FiltroEncargado: number) => {
        setState(s => ({ ...s, FiltroEncargado: FiltroEncargado }))
    }
    const cbRespuesta = (Datos: any) =>
        setState(s => ({ ...s, Datos: Datos, Cargando: false }))

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Consultar Cobranza App Movil">
                    <Card.Body>
                        <Card.Body.Content>
                            <Formik
                                initialValues={
                                    {
                                        FechaInicio: moment().add(-30, 'd').toDate(),
                                        FechaFin: new Date(),
                                        porCobrarId: 0,
                                        creditoId: 0,
                                        productoId: 0,
                                        sucursalId: 0,
                                        cobradorAsignado: '',
                                        tipoCredito: '',
                                        estatus: '',
                                        puedeRealizarquita: 0

                                    }
                                }
                                validationSchema={
                                    Yup.object().shape({
                                        porCobrarId: Yup.number().required("Ingresa al menos un digito").moreThan(0, "Ingresa al menos un digito"),
                                        creditoId: Yup.number().required("Ingresa al menos un digito").moreThan(0, "Ingresa al menos un digito"),
                                    })}
                                onSubmit={(values: any) => {
                                    console.log("Valores ,", values)

                                    console.log("Valores actualizados ,", values)
                                    setLoading(true)
                                    setState(s => ({ ...s, Cargando: true }))
                                    console.log("VALORES", values)
                                    FNget2(values.porCobrarId, values.creditoId, values.productoId, values.sucursalId, values.cobradorAsignado, values.tipoCredito, values.estatus, values.puedeRealizarQuita, values.FechaInicio, values.FechaFin)
                                }}>
                                <Form>
                                    <div className="columns is-centered is-mobile is-multiline">


                                        <div className="columns is-centered is-mobile is-multiline" style={{ margin: '5px' }}>
                                            <div style={{ backgroundColor: '#F7F7F7', padding: '2em', borderRadius: '15px' }}>
                                                <div className="row" style={{ textAlign: 'initial' }}>

                                                    <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                                        <div className="mb-3">
                                                            <label className="form-label mb-0" htmlFor={"porCobrarId"}>N° de cobro</label>
                                                            <Field disabled={false} id={"porCobrarId"} name={"porCobrarId"}
                                                            >
                                                                {
                                                                    (control: any) => (
                                                                        <input
                                                                            type="number"
                                                                            placeholder='Escribe el ID del cobro'
                                                                            className="form-control"
                                                                            value={control.field.value}
                                                                            disabled={false}
                                                                            onChange={value => {
                                                                                control.form.setFieldValue("porCobrarId", value.target.value)

                                                                            }}
                                                                        />
                                                                    )
                                                                }
                                                            </Field>
                                                            <ErrorMessage component="div" name={"porCobrarId"} className="text-danger" />

                                                        </div>

                                                    </div>
                                                    <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                                        <div className="mb-3">
                                                            <label className="form-label mb-0" htmlFor={"creditoId"}>N° de Credito</label>
                                                            <Field disabled={false} id={"creditoId"} name={"creditoId"}
                                                            >
                                                                {
                                                                    (control: any) => (
                                                                        <input
                                                                            type="text"
                                                                            placeholder='Escribe el ID del Credito'
                                                                            className="form-control"
                                                                            value={control.field.value}
                                                                            disabled={false}
                                                                            onChange={value => {
                                                                                control.form.setFieldValue("creditoId", value.target.value)

                                                                            }}
                                                                        />
                                                                    )
                                                                }
                                                            </Field>
                                                            <ErrorMessage component="div" name={"creditoId"} className="text-danger" />

                                                        </div>

                                                    </div>
                                                    <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                                        <ActionSelect
                                                            disabled={false}
                                                            label="Producto"
                                                            name="productoId"
                                                            placeholder="Elige Producto"
                                                            options={state.otpTipoCuenta}
                                                            addDefault={true}

                                                        />
                                                    </div>
                                                    <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                                        <ActionSelect
                                                            disabled={false}
                                                            label="Sucursal"
                                                            name="sucursalId"
                                                            placeholder="Elige Sucursal"
                                                            options={state.optCuentasOrdenantes2}
                                                            addDefault={true}

                                                        />
                                                    </div>
                                                    <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                                        <ActionSelect
                                                            disabled={false}
                                                            label="CobradorAsignado"
                                                            name="cobradorAsignado"
                                                            placeholder="Elige Cobrador"
                                                            options={state.optCuentasOrdenantes4}
                                                            addDefault={true}

                                                        />
                                                    </div>
                                                    <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                                        <ActionSelect
                                                            disabled={false}
                                                            label="Tipo Credito"
                                                            name="tipoCredito"
                                                            placeholder="Elige Tipo de Credito"
                                                            options={state.optNombresOrdenandes}
                                                            addDefault={true}


                                                        // accion={FNGetEstatus}
                                                        />
                                                    </div>
                                                    <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                                        <ActionSelect
                                                            disabled={false}
                                                            label="Estatus"
                                                            name="estatus"
                                                            placeholder="Elige Estatus"
                                                            options={state.optCuentasOrdenantes}
                                                            addDefault={true}


                                                        />
                                                    </div>
                                                    <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                                        <ActionSelect
                                                            disabled={false}
                                                            label="Puede realizar Quita"
                                                            name="puedeRealizarQuita"
                                                            placeholder="Elige si puede realizar quita"
                                                            options={[
                                                                { label: "Si", value: 1 },
                                                                { label: "No", value: 2 }]}
                                                            addDefault={true}
                                                            accion2={(val) => setSucursal(val)}

                                                        //accion={FNGetEstatus}
                                                        />
                                                    </div>
                                                    <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                                        <DatePickeStart name={'FechaInicio'} label={'Fecha Inicial'} disabled={loading} placeholder={'Inicio'} isClearable startDate={startDate} endDate={endDate} setStartDate={setStartDate} />

                                                    </div>
                                                    <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                                        <DatePickeEnd name={'FechaFin'} label={'Fecha Final'} disabled={loading} placeholder={'Final'} isClearable startDate={startDate} endDate={endDate} setEndDate={setEndDate} />

                                                    </div>
                                                    <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                                        <br />
                                                        <div className='text-center'>
                                                            <button disabled={loading} type="submit" className="btn btn-primary waves-effect waves-light">
                                                                <span className="">Buscar</span>&nbsp;<FiRefreshCcw />
                                                            </button>

                                                        </div>
                                                        <div>

                                                        </div>
                                                    </div>
                                                    <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center "></div>

                                                </div>

                                                <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                                    <button disabled={state.Filtro2 ? false : true} type={"button"} className={"btn btn-primary waves-effect waves-light"} onClick={() => {
                                                        generarXLSX()
                                                    }}>
                                                        <span className="">Excel</span>&nbsp;<FaPrint />
                                                    </button>
                                                    <br />
                                                    <br />
                                                    <button disabled={state.Filtro2 ? false : true} type={"button"} className={"btn btn-primary waves-effect waves-light"} onClick={() => {
                                                        fnImprimir()
                                                    }}>
                                                        <span className="">PDF</span>&nbsp;<FaPrint />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="columns is-centered is-mobile is-multiline">
                                        {state.Cargando && <Spinner />}
                                        {!state.Cargando && !state.Error && <DataTable
                                            subHeader
                                            key={"DispersionID"}
                                            paginationComponentOptions={{
                                                noRowsPerPage: false, rowsPerPageText: 'Dispersiones por página',
                                                rangeSeparatorText: 'de',
                                                selectAllRowsItem: false,
                                                selectAllRowsItemText: 'Todos',

                                            }}
                                            noDataComponent={<div>No hay datos</div>}
                                            subHeaderComponent=
                                            {
                                                <div className="row">
                                                    <div className="input-group pb-3 mb-10">
                                                        <input type="text" className="form-control" placeholder="Buscar" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                    </div>

                                                </div>
                                            }
                                            data={state.DatosMostrar}
                                            striped
                                            pagination
                                            dense
                                            responsive
                                            keyField={"porCobrarId"}
                                            defaultSortField={"porCobrarId"}
                                            columns={Columns}

                                        />}
                                        {/*                                 {state.Cargando && <Spinner />}
 */}


                                    </div>

                                </Form>

                            </Formik>

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

export default connect(mapStateToProps, mapDispatchToProps)(ConsultarDispersionH2H)