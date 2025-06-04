import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import * as Funciones from './BalanzaDeComprobacion/Funciones'
import download from 'downloadjs'
import * as Yup from 'yup'
import { CFormBalanzaDetalle } from './BalanzaDeComprobacion/CFormBalanzaDetalle'
import { CustomFieldText, CustomSelect } from '../../../../global'

// Icons
import { FaSearch } from 'react-icons/fa'
import "react-datepicker/dist/react-datepicker.css"
import { FaEye, FaFilePdf, FaLongArrowAltDown } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { Formik, Form } from 'formik'
import { Field, ErrorMessage } from 'formik'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import DatePicker, { registerLocale } from "react-datepicker"
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import { CustomFieldCheckbox } from '../../../../global/CustomFieldCheckbox'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import axios from 'axios'
import { FormateoDinero } from '../../../../../global/variables'
import ReactTooltip from 'react-tooltip';

import { CFormBalanzaPDF } from './BalanzaDeComprobacion/CFormBalanzaPDF'
import { string } from 'yup/lib/locale'
import XLSX from 'xlsx';


type CatalogosType = {
    oidc: IOidc
}

const BalanzaDeComprobacion = (props: CatalogosType) => {
    const MySwal = withReactContent(Swal)

    // Controll our mounted state
    let isMounted = React.useRef(true)


    const Datos: any[] = []
    const Productos: any[] = []
    const DatosExcel: any[] = []


    const [loading, setLoading] = React.useState(false)


    const [state, setState] = React.useState({
        FechaInicio: "",
        FechaFin: "",
        DatosExcel,
        Datos2: {
            fechaInicial: "",
            fechaFinal: "",
            usuario: "",
            arqueoId: 0,
            ProductoID: 0,
        },
        DatosInitial: {
            incMovs: 0,
            incDetalle: 0
        },
        Datos,
        Producto: "",
        Cargando: false,
        Error: false,
        Fecha: new Date(),
        Productos,
        RespRes: true,
        BalanzaID: 0,
        ProductoID: 0,
        CuentaBancoID: 0,
        FechaIniXLS: '',
        FechaFinXLS: '',
        Form:
        {
            MostrarModal2: false,
            Mostrar: false,
            Id: undefined,
        },
    })


    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const cerrarSwal = () => {
        MySwal.close();
    }

    const crearXLSX = () => {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(state.DatosExcel);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'Balanza.xlsx');
    }

    const fnImprimir = () => {

        MySwal.fire({
            showCloseButton: true,
            html: <div>
                <div className="modal-header">
                    <h5 className="modal-title">Generación de PDF</h5>
                </div>
                <div className={`modal-body`}>
                    <CFormBalanzaPDF
                        isMounted={isMounted.current}
                        BalanzaID={state.BalanzaID}
                        cerrarSwal={cerrarSwal}
                        key={1}
                        Seguridad={props.oidc}
                        initialValues={state.DatosInitial}
                        Id={state.Form.Id}
                    />
                </div>
            </div>,
            showCancelButton: false,
            showConfirmButton: false,

        })
    }
    const fnGetBalanzaDeComprobacion = (FechaInicio: string, FechaFin: string, ProductoID: number) => {
        let timerInterval
        const MySwal = withReactContent(Swal)
        setState(s => ({ ...s, Datos: [], RespRes: true }))

        MySwal.fire(
            {
                icon: 'info',
                html: <div><br />
                    <h3 className="text-center">Aviso</h3>
                    <div className={`modal-body`}>
                        <h5 className="text-center">Generando balanza de comprobación.</h5>
                    </div>
                </div>,
                timerProgressBar: true,
                confirmButtonText: `Ok`,
                timer: 50000,
                didOpen: () => {
                    MySwal.showLoading()
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
            }
        );
        // generarPDF()
        let datos = {
            FechaInicio: FechaInicio,
            FechaFin: FechaFin,
            ProductoID: ProductoID
        }
        Funciones.FNGetBalanzaDeComprobacion(props.oidc, datos)
            .then((respuesta: any) => {
                if (respuesta.length > 0) {

                    MySwal.close()

                    let tabla: any[] = []
                    if (respuesta.length > 0) {

                        setState(s => ({ ...s, BalanzaID: respuesta[0].BalanzaID, RespRes: false }))
                    }

                    let datos2 = {
                        BalanzaID: respuesta[0].BalanzaID
                    }

                    Funciones.FNGetProductoBalanza(props.oidc, datos2)
                        .then((respuesta2: any) => {
                            setState(s => ({ ...s, Producto: respuesta2 }))

                            let tabla2: any[] = []
                            let primero = true;
                            let posicion2 = 0
                            respuesta.forEach((element: any) => {
                                posicion2 = posicion2 + 1
                                if (primero) {
                                    let detalle: any = {
                                        Cuentas: state.Producto,
                                        DeudorMovimiento: "Fecha Inicio: ",
                                        AcreedorMovimiento: state.FechaIniXLS,
                                        DeudorSaldo: "Fecha Final: ",
                                        AcreedorSaldo: state.FechaFinXLS,
                                    }
                                    tabla2.push(detalle)
                                }
                                let detalle2: any = {
                                    Cuentas: element.CtaBanco,
                                    DeudorMovimiento: element.DeudorMovimiento,
                                    AcreedorMovimiento: element.AcreedorMovimiento,
                                    DeudorSaldo: element.DeudorSaldo,
                                    AcreedorSaldo: element.AcreedorSaldo,
                                }
                                tabla2.push(detalle2)
                                primero = false

                                if (posicion2 == respuesta.length) {
                                    let vTotalDM2 = 0
                                    let vTotalAM2 = 0
                                    let vTotalDS2 = 0
                                    let vTotalAS2 = 0
                                    tabla2.forEach(element => {
                                        if (element.DeudorMovimiento != "Fecha Inicio: " && element.DeudorMovimiento != "Fecha Final: ") {
                                            vTotalDM2 += parseFloat(element.DeudorMov)
                                            vTotalAM2 += parseFloat(element.AcreedorMov)
                                            vTotalDS2 += parseFloat(element.DeudorSaldo)
                                            vTotalAS2 += parseFloat(element.AcreedorSaldo)
                                        }
                                    });

                                    let detallePoliza2: any = {
                                        BalanzaTempID: -1,
                                        CtaBanco: "Total",
                                        DeudorMov: vTotalDM2,
                                        AcreedorMov: vTotalAM2,
                                        DeudorSaldo: vTotalDS2,
                                        AcreedorSaldo: vTotalAS2
                                    }
                                    tabla2.push(detallePoliza2)
                                }
                                console.log("PUSH ,", tabla2)
                                setState(s => ({ ...s, DatosExcel: tabla2 }))

                            })

                        }).catch(() => {
                            toast.error("Ocurrió un problema,")
                        })

                    let vTotalDM = 0
                    let vTotalAM = 0
                    let vTotalDS = 0
                    let vTotalAS = 0
                    respuesta.forEach((element: any) => {
                        let detallePoliza: any = {
                            CuentaBancoID: element.CuentaBancoID,
                            BalanzaID: element.BalanzaID,
                            Producto: element.Producto,
                            BalanzaTempID: element.BalanzaTempID,
                            CtaBanco: element.CtaBanco,
                            DeudorMov: element.DeudorMov,
                            AcreedorMov: element.AcreedorMov,
                            DeudorSaldo: element.DeudorSaldo,
                            AcreedorSaldo: element.AcreedorSaldo
                        }
                        tabla.push(detallePoliza)
                    })

                    tabla.forEach(element => {
                        vTotalDM += parseFloat(element.DeudorMov)
                        vTotalAM += parseFloat(element.AcreedorMov)
                        vTotalDS += parseFloat(element.DeudorSaldo)
                        vTotalAS += parseFloat(element.AcreedorSaldo)

                    });
                    console.log("TABLA ", tabla)
                    let detallePoliza2: any = {
                        BalanzaTempID: -1,
                        CtaBanco: "Total",
                        DeudorMov: vTotalDM,
                        AcreedorMov: vTotalAM,
                        DeudorSaldo: vTotalDS,
                        AcreedorSaldo: vTotalAS
                    }
                    tabla.push(detallePoliza2)
                    setState(s => ({ ...s, Datos: tabla }))
                    MySwal.close();

                } else {
                    MySwal.fire(
                        {
                            icon: 'info',
                            html: <div><br />
                                <h3 className="text-center">Aviso</h3>
                                <div className={`modal-body`}>
                                    <h5 className="text-center">Sin movimientos.</h5>
                                </div>
                            </div>,
                            timerProgressBar: true,
                            confirmButtonText: `Ok`,

                        }
                    );

                }

            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, optSucursales: [] }))
                }
            })
    }
    const Columns: IDataTableColumn[] =
        [

            {
                name: 'Cuentas',
                center: true,

                selector: 'CtaBanco',
                sortable: false,
                conditionalCellStyles: [{

                    when: column => {
                        return column.CtaBanco === "SUMAS IGUALES"
                    },
                    style: {
                        fontWeight: 'bold',
                        backgroundColor: '#e2e2e2'

                    },

                },

                {
                    when: row => row.BalanzaTempID < 0,
                    style: {
                        textAlign: 'center',
                        borderTop: '1px solid black',
                        backgroundColor: '#D3D3D3',
                        fontWeight: 'bold'



                    },


                }
                ]
            },

            {
                name: 'Deudor Movimiento',
                selector: 'DeudorMov',
                sortable: false,
                center: true,

                cell: (props) => FormateoDinero.format(props.DeudorMov),
                conditionalCellStyles: [{

                    when: column => {
                        return column.CtaBanco === "SUMAS IGUALES"
                    },
                    style: {
                        fontWeight: 'bold',
                        backgroundColor: '#e2e2e2'

                    },

                },
                {
                    when: row => row.BalanzaTempID < 0,
                    style: {
                        textAlign: 'center',
                        borderTop: '1px solid black',
                        backgroundColor: '#D3D3D3',
                        fontWeight: 'bold'



                    },


                }
                ]
            },
            {
                name: 'Acreedor Movimiento',
                selector: 'AcreedorMov',
                sortable: false,
                center: true,

                cell: (props) => FormateoDinero.format(props.AcreedorMov),
                conditionalCellStyles: [{

                    when: column => {
                        return column.CtaBanco === "SUMAS IGUALES"
                    },
                    style: {
                        fontWeight: 'bold',
                        backgroundColor: '#e2e2e2'
                        ,

                    },

                },
                {
                    when: row => row.BalanzaTempID < 0,
                    style: {
                        textAlign: 'center',
                        borderTop: '1px solid black',
                        backgroundColor: '#D3D3D3',
                        fontWeight: 'bold'



                    },


                }
                ]
            },
            {
                name: 'Deudor Saldo',
                selector: 'DeudorSaldo',
                sortable: false,
                center: true,

                cell: (props) => FormateoDinero.format(props.DeudorSaldo),
                conditionalCellStyles: [{

                    when: column => {
                        return column.CtaBanco === "SUMAS IGUALES"
                    },
                    style: {
                        fontWeight: 'bold',
                        backgroundColor: '#e2e2e2'

                    },

                },
                {
                    when: row => row.BalanzaTempID < 0,
                    style: {
                        textAlign: 'center',
                        borderTop: '1px solid black',
                        backgroundColor: '#D3D3D3',
                        fontWeight: 'bold'



                    },


                }
                ]
            },
            {
                name: 'Acreedor Saldo',
                selector: 'AcreedorSaldo',
                sortable: false,
                center: true,

                cell: (props) => FormateoDinero.format(props.AcreedorSaldo),
                conditionalCellStyles: [{

                    when: column => {
                        return column.CtaBanco === "SUMAS IGUALES"
                    },
                    style: {
                        fontWeight: 'bold',
                        backgroundColor: '#e2e2e2'
                    },

                },
                {
                    when: row => row.BalanzaTempID < 0,
                    style: {
                        textAlign: 'center',
                        borderTop: '1px solid black',
                        backgroundColor: '#D3D3D3',
                        fontWeight: 'bold'


                    },


                },

                ]
            },
            {
                name: 'Ver Movimientos', sortable: false, center: true,

                cell: (propss) =>
                    propss.BalanzaTempID != -1 ?
                        <button data-tip data-for={`DetailTooltip${propss.CuentaBancoID}`} className="asstext" type={"button"} onClick={() => {
                            verDetalleCta(propss.CuentaBancoID, propss.BalanzaID, propss.CtaBanco, propss.Producto)
                        }} >
                            <FaEye></FaEye>
                            <ReactTooltip
                                id={`DetailTooltip${propss.CuentaBabncoID}`}
                                type="info"
                                effect="solid"
                                clickable
                                globalEventOff="click"
                            >
                                Ver Detalle
                            </ReactTooltip>
                        </button> : < div ></div >,
                conditionalCellStyles: [{

                    when: column => {
                        return column.CtaBanco === "SUMAS IGUALES"
                    },
                    style: {
                        fontWeight: 'bold',
                        backgroundColor: '#e2e2e2'
                    },

                },
                {
                    when: row => row.BalanzaTempID < 0,
                    style: {
                        textAlign: 'center',
                        borderTop: '1px solid black',
                        backgroundColor: '#D3D3D3',
                        fontWeight: 'bold',
                        color: 'transparent'


                    },


                },

                ]
            }
        ]
    const FNGetProductos = () => {
        Funciones.FNGetProductos(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    var productos = respuesta.map((valor: any) => {
                        var obj = {
                            value: valor.ProductoID, label: valor.Producto
                        };
                        return obj
                    });


                    setState(s => ({ ...s, Productos: productos }))
                }
            })
            .catch((error: any) => {
                if (isMounted.current === true) {
                    //  setState(s => ({ ...s, Datos: SaldosPeriodo }))

                }
            })
    }

    // Use effect
    React.useEffect(() => {
        FNGetProductos()

        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    const generarPDF = () => {
        //se va a generar el pdf aqui
        toast.info("Generando PDF")
        console.log(props.oidc.user.profile.name)
        axios({
            url: "https://services-tsr.herokuapp.com/api/pdf/balanzaComprobacion-pdf/" + props.oidc.user.profile.name,
            method: "GET",
            responseType: 'blob',
            headers: {

                'Content-Type': 'application/json',
                "Authorization": `Bearer ${props.oidc.user.access_token}`
            }
        })
            .then((respuesta: any) => {

                toast.success("PDF Generado con exito")
                const content = respuesta.headers['content-type'];
                download(respuesta.data, "Balaza de Comprobación")

            }).catch((error: any) => {
                toast.error("Error al generar el PDF")
                console.log(error)
            }
            );
    }


    const styles = {
        div: {
            border: "groove rgb(218 218 218 / 45%)",
            "border-radius": "1em"
        },
        div2: {
            'margin': '20px',
        }
    }
    const verDetalleCta = (ctaBancoId, balanzaId, ctaBanco, producto) => {
        const MySwal = withReactContent(Swal)

        let timerInterval
        MySwal.fire(
            {
                icon: 'info',
                html: <div><br />
                    <h3 className="text-center">Aviso</h3>
                    <div className={`modal-body`}>
                        <h5 className="text-center">Obteniendo saldos.</h5>
                    </div>
                </div>,
                timerProgressBar: true,
                confirmButtonText: `Ok`,
                timer: 50000,
                didOpen: () => {
                    MySwal.showLoading()
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
            }
        );
        console.log("DATOS ,", ctaBancoId)
        let datos = {
            ctaBanco: ctaBancoId,
            balanzaId: balanzaId
        }
        Funciones.FNGetDetalle(props.oidc, datos)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    MySwal.close()
                    //    setState(s => ({ ...s, SaldosPeriodo: respuesta }))
                    //   console.log("RESPUESTA", respuesta)
                    // console.log("RESPUESTA", state.SaldosPeriodo)
                    MySwal.fire({
                        width: '75%',
                        showCloseButton: true,
                        html: <div>
                            <div className="modal-header">
                                <div className="row">
                                    <div className="row">
                                        <h5 className="modal-title">Cuenta: <strong style={{ color: "red" }}>{ctaBanco}</strong></h5>
                                    </div>
                                    <div className="row">
                                        <h5>Producto: <strong style={{ color: "red" }}>{producto}</strong></h5>
                                    </div>
                                </div>
                            </div>
                            <div className={`modal-body`}>
                                <CFormBalanzaDetalle
                                    DatosSaldos={respuesta}
                                />
                            </div>
                        </div>,
                        showCancelButton: false,
                        showConfirmButton: false,

                    })
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    alert("ERROR")
                    //  setState(s => ({ ...s, Datos: SaldosPeriodo }))

                }   
            })
        // console.log("SALDOS", state.SaldosPeriodo)

    }

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Balanza de Comprobación">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />} 
                            {!state.Cargando && !state.Error &&

                                <div>
                                    <Formik
                                        initialValues={state.Datos2}
                                        enableReinitialize
                                        validationSchema={
                                            Yup.object().shape({
                                                ProductoID: Yup.number().required("Seleccione un producto").moreThan(0, "Selecciones un producto..."),
                                                fechaInicial: Yup.date().required("Debes de seleccionar una fecha inicial"),
                                                fechaFinal: Yup.date().required("Debes de seleccionar una fecha Final"),
                                            })}
                                        onSubmit={(values: any) => {
                                            console.log("VALORES", values)
                                            setLoading(true)

                                            let mesInicio = values.fechaInicial.getMonth() + 1
                                            if (mesInicio < 10)
                                                mesInicio = '0' + mesInicio

                                            let diaInicial = values.fechaInicial.getDate()
                                            if (diaInicial < 10)
                                                diaInicial = '0' + diaInicial

                                            let mesFinal = values.fechaFinal.getMonth() + 1
                                            if (mesFinal < 10)
                                                mesFinal = '0' + mesFinal

                                            let diaFinal = values.fechaFinal.getDate()
                                            if (diaFinal < 10)
                                                diaFinal = '0' + diaFinal

                                            let fechaInicial = "" + values.fechaInicial.getFullYear() + "-" + mesInicio + "-" + diaInicial
                                            let fechaFinal = "" + values.fechaFinal.getFullYear() + "-" + mesFinal + "-" + diaFinal
                                            setState(s => ({ ...s, FechaIni: fechaInicial, FechaFin: fechaFinal, ProductoID: values.ProductoID }))

                                            fnGetBalanzaDeComprobacion(fechaInicial, fechaFinal, values.ProductoID)
                                        }}>
                                        <Form>
                                            <div className="columns is-centered is-mobile is-multiline">
                                                <div className="column is-align-items-center is-two-quarter-desktop">
                                                    <div className="columns is-centered is-mobile is-multiline">
                                                        <div className="column is-one-fifth-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                                            <div className="mb-3" >
                                                                <br />
                                                                <span><strong> Selecciona el rango de fechas</strong></span>
                                                            </div>
                                                        </div>
                                                        <div className="column is-one-fifth-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                                            <div className="mb-3" >
                                                                <label className="form-label mb-0" htmlFor={"fechaInicial"}>Fecha Inicial</label>
                                                                <br />
                                                                <Field disabled={true} id={"fechaInicial"} name={"fechaInicial"}  >
                                                                    {
                                                                        (control: any) => (
                                                                            <DatePicker
                                                                                className="form-control"
                                                                                selected={control.field.value}
                                                                                disabled={false}
                                                                                onChange={(value: any) => {
                                                                                    control.form.setFieldValue("fechaInicial", value)
                                                                                }}
                                                                                placeholderText="Fecha Inicial"
                                                                                locale="es"
                                                                                dateFormat="yyyy-MM-dd"
                                                                            />
                                                                        )
                                                                    }
                                                                </Field>
                                                                <ErrorMessage component="div" name={"fechaInicial"} className="text-danger" />

                                                            </div>
                                                        </div>
                                                        <div className="column is-one-fifth-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                                            <div className="mb-3" >
                                                                <label className="form-label mb-0" htmlFor={"fechaFinal"}>Fecha Final</label>
                                                                <br />
                                                                <Field disabled={true} id={"fechaFinal"} name={"fechaFinal"}  >
                                                                    {
                                                                        (control: any) => (
                                                                            <DatePicker
                                                                                className="form-control"
                                                                                selected={control.field.value}
                                                                                disabled={false}
                                                                                onChange={(value: any) => {
                                                                                    control.form.setFieldValue("fechaFinal", value)
                                                                                }}
                                                                                minDate={new Date(control.form.getFieldProps("fechaInicial").value)}
                                                                                placeholderText="Fecha Final"
                                                                                locale="es"
                                                                                dateFormat="yyyy-MM-dd"
                                                                            />
                                                                        )
                                                                    }
                                                                </Field>
                                                                <ErrorMessage component="div" name={"fechaFinal"} className="text-danger" />

                                                            </div>
                                                        </div>
                                                        <div className="column is-one-fifth-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                                            <CustomSelect
                                                                disabled={false}
                                                                label="Producto:"
                                                                name="ProductoID"
                                                                placeholder="Seleccione..."
                                                                options={state.Productos}
                                                                addDefault={true}
                                                                isMulti={false}
                                                            />
                                                        </div>
                                                        <div className="column is-one-fifth-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                                            <br />
                                                            <div className="columns text-center is-centered is-mobile is-multiline">
                                                                <div className="column is-one-third-mobile is-align-items-center ">
                                                                    <button type="submit" className="btn btn-primary waves-effect waves-light">
                                                                        Generar
                                                                    </button>
                                                                </div>
                                                                <div className="column is-one-third-mobile is-align-items-center ">
                                                                    <button disabled={state.RespRes} type="button" className="ms-1 btn btn-secondary waves-effect waves-light" onClick={() =>
                                                                        fnImprimir()} >
                                                                        Imprimir
                                                                    </button>
                                                                </div>
                                                                <div className="column is-one-third-mobile is-align-items-center ">
                                                                    <button disabled={state.RespRes} type="button" className="ms-1 btn btn-success waves-effect waves-light" onClick={() =>
                                                                        crearXLSX()} >
                                                                        Excel
                                                                    </button>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {state.Datos.length !== 0 &&
                                                <div style={{ borderRadius: "1em", border: "1em", borderColor: "black" }}>
                                                    <hr />
                                                    <h6 style={{ paddingLeft: "10px" }}> {state.Producto} - A {state.Fecha.getDate()} de {monthNames[state.Fecha.getMonth()]} del {state.Fecha.getFullYear()}</h6>
                                                    <hr />
                                                    <DataTable
                                                        data={state.Datos}
                                                        striped
                                                        /* onRowDoubleClicked={(value: any) => {
                                                            console.log("VALORES ,", value)
                                                            verDetalleCta(value.CuentaBancoID, value.BalanzaID, value.CtaBanco)
                                                            //    verDetalleCta(value.CuentaBancoID, value.BalanzaID)
                                                        }} */
                                                        dense
                                                        noHeader
                                                        //pagination
                                                        responsive
                                                        keyField={"CtaBanco"}
                                                        columns={Columns}
                                                    />

                                                </div>
                                            }
                                        </Form>
                                    </Formik>

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
export default connect(mapStateToProps, mapDispatchToProps)(BalanzaDeComprobacion);