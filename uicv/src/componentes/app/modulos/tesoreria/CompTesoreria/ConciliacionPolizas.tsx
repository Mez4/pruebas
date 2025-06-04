import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import * as Funciones from './ConciliacionPolizas/Funciones'
import * as Yup from 'yup'
import { FormateoDinero } from '../../../../../global/variables'


import DataTable, { IDataTableColumn } from 'react-data-table-component'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
// Icons
import { FaTimes, FaEye, FaSearch, FaFileExcel, FaFileAlt } from 'react-icons/fa'
import "react-datepicker/dist/react-datepicker.css"
// Custom components
import { Card, Spinner, CustomFieldText, CustomFieldDatePicker, CustomSelect } from '../../../../global'
import { CForm } from './Polizas/CForm'
import { FiltrarDatos } from '../../../../../global/functions'
import { Formik, Form } from 'formik'
import { Field, ErrorMessage } from 'formik'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
// import ExportExcel from 'react-export-excel'
import DatePicker, { registerLocale } from "react-datepicker"
// import { saveAs } from 'file-saver'


type CatalogosType = {
    oidc: IOidc
}

const ConciliacionPolizas = (props: CatalogosType) => {
    // const ExcelFile = ExportExcel.ExcelFile
    // const ExcelSheet = ExportExcel.ExcelSheet
    // const ExcelColumn = ExportExcel.ExcelColumn
    // Controll our mounted state
    let isMounted = React.useRef(true)



    const DatosDefecto = {
        fecha: new Date(),
        estatus: 0,
        tipo_poliza: '',
        numeroPoliza: 0,
        cuenta: '',
        usuario: '',
        empresa: '',
        concepto: '',
        fechaFinal: new Date(),
        fechaInicial: new Date()
    }

    const Datos: any[] = []
    const DatosTabla: any[] = []
    const DatosSeleccionados: any[] = []
    const opAgrupacion: any[] = []
    const Productos: any[] = []
    const TiposMovimiento: any[] = []
    const CtaBancos: any[] = []
    const DatosUltimaPeticion: {} = {}



    const [state, setState] = React.useState({
        Productos,
        TiposMovimiento,
        CtaBancos,
        Datos,
        DatosTabla,
        DatosSeleccionados,
        Filtro: '',
        Cargando: false,
        Error: false,
        opAgrupacion,
        DatosUltimaPeticion,
        Datos2: {
            fechaInicial: "",
            fechaFinal: "",
            ProductoID: 0,
            TipoMovID: 0,
            CtaBancoID: 0

        },
    })


    const FNGetLocalF = (Datos: any) => {
        setState(s => ({ ...s, Cargando: true }))

        Funciones.FNGetPolizas(props.oidc, Datos)
            .then((respuesta: any) => {
                // console.log(respuesta)

                setState(s => ({ ...s, Cargando: false, DatosTabla: respuesta, DatosSeleccionados: respuesta }))

            })
            .catch((err: any) => {
                console.log(err)
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, DatosTabla: [], DatosSeleccionados: [] }))
                }
            })
    }





    /** funcion Callback al agregar un item */

    const cbAgregar = () => {

        setState(s => ({ ...s, Cargando: true }))

        console.log(state.DatosSeleccionados)

        let Datos = {
            movsContabilizar: state.DatosSeleccionados
        }

        Funciones.FNContabilizarPoliza(props.oidc, Datos)
            .then((respuesta: any) => {
                setState(s => ({ ...s, Cargando: false }))
                FNGetLocalF(state.DatosUltimaPeticion);
                toast.success('Poliza(s) generada(s) correctamente')
                //   console.log("DATOS ULTIMA PETICION ,", state.DatosUltimaPeticion)
            })
            .catch((err: any) => {
                console.log(err)
                toast.error('Error al generar pólizas')
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false }))
                }
            })
    }

    // Define the columns
    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Producto',
                    selector: 'Producto',
                    sortable: false,
                    center: true,
                    wrap: true,
                },
                {
                    name: 'Tipo Movimiento',
                    selector: 'TipoMovimiento',
                    wrap: true,
                    center: true,
                    sortable: false,
                    cell: (props) => <span className="text-center">{props.TipoMovimiento}</span>

                },
                {
                    name: 'Número de Cuenta',
                    selector: 'NumeroCuenta',
                    sortable: false,
                    center: true,
                    wrap: true
                },
                {
                    name: 'Observaciones',
                    selector: 'Observaciones',
                    sortable: false,
                    wrap: true,

                },
                {
                    name: 'Fecha Captura',
                    selector: 'FechaCaptura',
                    sortable: false,
                    center: true,
                    wrap: true,
                    format: (r) => r.FechaCaptura && new Date(r.FechaCaptura).toLocaleDateString()
                },
                {
                    name: 'Importe',
                    selector: 'Importe',
                    sortable: false,
                    center: true,
                    wrap: true,
                    cell: (props) => <span>{FormateoDinero.format(props.Importe)}</span>
                }
            ]
        return colRet
    }, [])



    const FNGetProductos = () => {
        Funciones.FNGetProductos(props.oidc)
            .then((respuesta: any) => {
                console.log("GET PRODUCTOS: ", respuesta)
                if (isMounted.current === true) {

                    var productos = respuesta.map((valor: any) => {
                        var obj = {
                            value: valor.ProductoID, label: `ID: ${valor.ProductoID} ${ valor.Producto }, Empresa: ${valor.EmpresaNombre} `
                        };
                        return obj
                    });
                    setState(s => ({ ...s, Productos: productos }))
                }
            })
            .catch((error: any) => {
                if (isMounted.current === true) {
                    console.log("ERROR API ", error)
                    //  setState(s => ({ ...s, Datos: SaldosPeriodo }))

                }
            })
    }

    const FNGetTiposMovimientos = () => {
        Funciones.FNGetTiposMovimientos(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    console.log("RESPUESTA ", respuesta)
                    var TiposMovimiento = respuesta.map((valor: any) => {
                        var obj = {
                            value: valor.Id, label: valor.TipoMovimiento
                        };
                        return obj
                    });
                    setState(s => ({ ...s, TiposMovimiento: TiposMovimiento }))
                }
            })
            .catch((error: any) => {
                if (isMounted.current === true) {
                    console.log("ERROR API ", error)
                    //  setState(s => ({ ...s, Datos: SaldosPeriodo }))

                }
            })
    }

    const FNGetCuentas = (ProductoID?: number) => {
        Funciones.FNGetCuentasBanco(props.oidc, ProductoID)
            .then((respuesta: any) => {
                if (isMounted.current === true) {

                    var productos = respuesta.map((valor: any) => {
                        var obj = {
                            value: valor.CuentaBancoID, label: valor.NumeroCuenta
                        };
                        return obj
                    });
                    console.log("PRODS ,", productos)


                    setState(s => ({ ...s, CtaBancos: productos }))
                }
            })
            .catch((error: any) => {
                if (isMounted.current === true) {
                    console.log("ERROR API ", error)
                    //  setState(s => ({ ...s, Datos: SaldosPeriodo }))

                }
            })
    }




    React.useEffect(() => {
        FNGetProductos()
        FNGetTiposMovimientos()
        // FNGetLocal()

        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Contabilización de Pólizas">
                    <Card.Body>
                        <Card.Body.Content>
                            <div>
                                <Formik
                                    validationSchema={Yup.object().shape({
                                        ProductoID: Yup.number().required("Seleccione el producto").moreThan(0, "Seleccione el producto"),
                                        fechaInicial: Yup.date().required("Debes de seleccionar una fecha Inicial"),
                                        fechaFinal: Yup.date().required("Debes de seleccionar una fecha Final"),

                                    })}
                                    initialValues={state.Datos2}
                                    enableReinitialize
                                    onSubmit={(values: any) => {
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

                                        let fechaInicialD = "" + values.fechaInicial.getFullYear() + "-" + mesInicio + "-" + diaInicial
                                        let fechaFinalD = "" + values.fechaFinal.getFullYear() + "-" + mesFinal + "-" + diaFinal
                                        let Datos = {
                                            FechaInicial: fechaInicialD,
                                            FechaFinal: fechaFinalD,
                                            Producto: values.ProductoID,
                                            TipoMovID: values.TipoMovID,
                                            CtaBancoID: values.CtaBancoID
                                        }
                                        FNGetLocalF(Datos)
                                        setState(s => ({ ...s, DatosUltimaPeticion: Datos }))

                                    }}>
                                    <Form>

                                        <div className="columns is-centered is-mobile is-multiline">
                                            <div className="column is-one-third-desktop is-half-tablet is-half-mobile">
                                                <div className="mb-2" >
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

                                            <div className="column is-one-third-desktop is-half-tablet is-half-mobile">
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

                                            <div className="column is-one-third-desktop is-half-tablet is-half-mobile">
                                                <div className="mb-2" >
                                                    <label className="form-label mb-0" htmlFor={"ProductoID"}>Producto</label>
                                                    <Field name={"ProductoID"} className="form-select"  >
                                                        {(control: any) => (
                                                            <select
                                                                className="form-select"
                                                                //options={state.optCuentas}                                                                  
                                                                value={control.field.value}
                                                                onChange={(value: any) => {
                                                                    //alert(parseInt(value.target.value))
                                                                    control.form.setFieldValue("ProductoID", parseInt(value.target.value))
                                                                    FNGetCuentas(parseInt(value.target.value))

                                                                }}
                                                                //disabled={(state.Datos.numero === 0 || state.Datos.numero === undefined) ? false : true}
                                                                id={"ProductoID"}
                                                                name={"ProductoID"}
                                                            >
                                                                <option value="0">{"Selecciona un producto"}</option>
                                                                {state.Productos.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                                            </select>

                                                        )}
                                                    </Field>
                                                    <ErrorMessage component="div" name={"ProductoID"} className="text-danger" />

                                                </div>
                                            </div>
                                            <div className="column is-one-third-desktop is-half-tablet is-half-mobile">
                                                <div className="mb-2" >
                                                    <label className="form-label mb-0" htmlFor={"TipoMovID"}>Movimientos</label>
                                                    <Field name={"TipoMovID"} className="form-select"  >
                                                        {(control: any) => (
                                                            <select
                                                                className="form-select"
                                                                //options={state.optCuentas}                                                                  
                                                                value={control.field.value}
                                                                onChange={(value: any) => {
                                                                    //alert(parseInt(value.target.value))
                                                                    control.form.setFieldValue("TipoMovID", parseInt(value.target.value))
                                                                    //  FNGetCuentas(parseInt(value.target.value))

                                                                }}
                                                                //disabled={(state.Datos.numero === 0 || state.Datos.numero === undefined) ? false : true}
                                                                id={"TipoMovID"}
                                                                name={"TipoMovID"}
                                                            >
                                                                <option value="0">{"Selecciona un tipo de movimiento"}</option>
                                                                {state.TiposMovimiento.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                                            </select>

                                                        )}
                                                    </Field>
                                                    <ErrorMessage component="div" name={"TipoMovID"} className="text-danger" />

                                                </div>
                                            </div>
                                            <div className="column is-one-third-desktop is-half-tablet is-full-mobile">
                                                <div className="mb-2" >
                                                    <label className="form-label mb-0" htmlFor={"CtaBancoID"}>Cuentas</label>
                                                    <Field name={"CtaBancoID"} className="form-select"  >
                                                        {(control: any) => (
                                                            <select
                                                                className="form-select"
                                                                //options={state.optCuentas}                                                                  
                                                                value={control.field.value}
                                                                onChange={(value: any) => {
                                                                    //alert(parseInt(value.target.value))
                                                                    control.form.setFieldValue("CtaBancoID", parseInt(value.target.value))
                                                                    //  FNGetCuentas(parseInt(value.target.value))

                                                                }}
                                                                //disabled={(state.Datos.numero === 0 || state.Datos.numero === undefined) ? false : true}
                                                                id={"CtaBancoID"}
                                                                name={"CtaBancoID"}
                                                            >
                                                                <option value="0">{"Selecciona una cuenta de banco"}</option>
                                                                {state.CtaBancos.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                                            </select>

                                                        )}
                                                    </Field>
                                                    <ErrorMessage component="div" name={"CtaBancoID"} className="text-danger" />

                                                </div>
                                            </div>

                                            <div className="column is-one-third-desktop is-half-tablet is-half-mobile text-center">
                                                <div className="columns is-centered is-mobile is-multiline">
                                                    <div className="column is-half-desktop is-half-tablet is-half-mobile text-center">

                                                        <div className="mb-2" >

                                                            <label className="form-label mb-0" htmlFor={"fechaFinal"}></label>
                                                            <br />
                                                            <button className="btn btn-secondary active" type="submit">Actualizar Resultados</button>
                                                        </div>
                                                    </div>
                                                    <div className="column is-half-desktop is-half-tablet is-half-mobile text-center">

                                                        <div className="mb-2" >
                                                            <br />
                                                            <button type="button" className="ms-2 btn btn-primary waves-effect waves-light"
                                                                disabled={state.DatosTabla.length > 0 ? false : true} onClick={() => { cbAgregar() }}
                                                            >
                                                                Generar Pólizas
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>



                                        </div>

                                    </Form>
                                </Formik>
                                <br />
                                {state.Cargando && <Spinner />}
                                {state.Error && <span>Error al cargar los datos...</span>}
                                {!state.Cargando && !state.Error &&
                                    < DataTable
                                        data={state.DatosTabla}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"id"}
                                        defaultSortField={"id"}
                                        onRowDoubleClicked={(value: any) => { }}
                                        columns={Columns}
                                        selectableRows
                                        selectableRowsHighlight
                                        selectableRowSelected={() => true}
                                        onSelectedRowsChange={(res: any) => {
                                            console.log(res)
                                            setState(s => ({ ...s, Cargando: false, DatosSeleccionados: res.selectedRows }))
                                        }}
                                    />}
                            </div>

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
export default connect(mapStateToProps, mapDispatchToProps)(ConciliacionPolizas);