import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomFieldDatePicker, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { Field, ErrorMessage } from 'formik'
import DatePicker, { registerLocale } from "react-datepicker"
import { FaSearch, FaTimes, FaTrashAlt, FaCheckCircle } from 'react-icons/fa'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    Seguridad: IOidc,
    Id?: number,
    initialValues: {
        fecha: Date,
        estatus: number,
        tipo_poliza: string,
        numeroPoliza: number,
        cuenta: string,
        usuario: string,
        empresa: string,
        concepto: string
        fechaFinal: Date,
        fechaInicial: Date
    },
    cbGuardar(item: any): any
    fnCancelar(): any,
    opPolizasTipoModal: { value: number, label: string }[],
    optCuentas: { value: number, label: string }[],
    explorar: boolean
    DatosDefectoModalDetalle: any,
    seleccionadoRenglon(item: any): any

}

export const CForm = (props: CFormType) => {

    const DatosDefecto = { NombreMoneda: '', TipoCambio: 0, Fecha: new Date(), ClaveMonedaSat: '' }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optCuentas: any[] = []
    const opPolizasTipo: any[] = []
    const DatosTabla: any[] = []

    const [state, setState] = React.useState({
        Datos: {
            fechaInicial: "",
            fechaFinal: "",
            tipoPolizaID: "",
            usuario: "",
            numero: 0
        },
        DatosMostrar,
        Filtro: '',
        Cargando: false,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        },
        optCuentas,
        opPolizasTipo,
        startDate: null,
        endDate: null,
        DatosTabla

    })

    const [estado, setEstado] = React.useState({
        numeroP: {
            id: "",
        }
    })
    // Loading
    const [loading, setLoading] = React.useState(false)
    const [habilitar, setHabilitar] = React.useState(true)

    // Define the columns
    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Fecha',
                    selector: 'fecha',
                    center: true,
                    sortable: true,
                },
                {
                    name: 'Tipo',
                    selector: 'tipo',
                    center: true,

                    sortable: true,
                },
                {
                    name: 'Número',
                    selector: 'numero',
                    center: true,

                    sortable: true,
                },
                {
                    name: 'Cocepto',
                    selector: 'concepto',
                    center: true,

                    sortable: true,
                    cell: (propss) => <span>{propss.concepto}</span>
                },
                {
                    name: 'Estatus',
                    selector: 'estatus',
                    center: true,

                    sortable: true,
                }

            ]
        return colRet
    }, [])

    const FNGetPolizas = (tipoId?: number, numero?: number, fechaInicio?: string, fechaFin?: string) => {
        setLoading(true)
        Funciones.FNGetPoliza(props.Seguridad, undefined, tipoId, numero, fechaInicio, fechaFin)
            .then((respuesta: any) => {
                let tabla: any[] = []
                setHabilitar(false)
                respuesta.forEach((element: any) => {
                    let fecha = new Date(element.fecha)
                    fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset())
                    let polizas: any = {
                        id: element.PolizaID,
                        fecha: element.Fecha,
                        tipo: element.Tipo,
                        tipo_id: element.TipoID,
                        numero: element.Numero,
                        concepto: element.Concepto,
                        estatus: element.Estatus,
                        estatus_id: element.EstatusID

                    }
                    tabla.push(polizas)
                });

                setLoading(false)
                setState(s => ({ ...s, Error: false, DatosTabla: tabla }))

            })
            .catch((err) => {
                setLoading(false)
                setState(s => ({ ...s, error: true, DatosTabla: [] }))

            })

    }

    const handleRowClicked = (row: any) => {
        setEstado(e => ({ ...e, numeroP: { ...estado.numeroP, id: row.id } }))
        state.DatosTabla.map(item => {
            if (item.toggleSelected === undefined) {
                if (row.id === item.id) {
                    item.toggleSelected = true
                }
            } else {
                delete item.toggleSelected
            }
        });
        setState(s => ({ ...s, DatosTabla: state.DatosTabla }))
    };
    // Return the component
    return (
        <Formik
            initialValues={props.explorar === true ? state.Datos : props.DatosDefectoModalDetalle}
            enableReinitialize
            validationSchema={
                Yup.object().shape({
                    tipoPolizaID: Yup.number().required("Debes de seleccionar un tipo de poliza"),
                    fechaInicial: Yup.date().required("Debes de seleccionar una fecha inicial"),
                    fechaFinal: Yup.date().required("Debes de seleccionar una fecha Final"),
                    numero: Yup.number().moreThan(-1, "Número invalido")
                })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
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
                let polizaId = values.tipoPolizaID
                let numero = values.numero


                if (values.tipoPolizaID === -1) {
                    polizaId = undefined
                }
                if (values.numero === "" || values.numero === 0) {
                    numero = undefined
                }

                FNGetPolizas(polizaId, numero, fechaInicial, fechaFinal)
                // Finish the callback

            }}>

            <Form>
                {props.explorar && <div>
                    <div className="row">
                        <div className="col-3">
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
                        <div className="col-3">
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
                        <div className="col-3">
                            <div className="mb-3">
                                <label className="form-label mb-0" htmlFor={"tipoPolizaID"}>Tipo de póliza</label>
                                <Field name={"tipoPolizaID"} className="form-select"  >
                                    {(control: any) => (
                                        <select
                                            className="form-select"
                                            //options={state.optCuentas}                                                                  
                                            value={control.field.value}
                                            onChange={(value: any) => {
                                                control.form.setFieldValue("tipoPolizaID", parseInt(value.target.value))
                                            }}
                                            disabled={false}
                                            id={"tipoPolizaID"}
                                            name={"tipoPolizaID"}
                                        >
                                            <option value="0">{"Selecciona un tipo de póliza"}</option>
                                            {props.opPolizasTipoModal.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                        </select>

                                    )}
                                </Field>
                                <ErrorMessage component="div" name={"tipoPolizaID"} className="text-danger" />
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="mb-3">
                                <label className="form-label mb-0" htmlFor={"numero"}>Número</label>
                                <Field disabled={false} id={"numero"} name={"numero"}
                                >
                                    {
                                        (control: any) => (
                                            <input
                                                type="number"
                                                step='1'
                                                placeholder='0'
                                                className="form-control"
                                                value={control.field.value}
                                                //pattern="\d{1,10}(.\d{1,2})?"
                                                disabled={false}
                                                onChange={value => {
                                                    control.form.setFieldValue("numero", parseInt(value.target.value))
                                                }}
                                            />
                                        )
                                    }
                                </Field>
                                <ErrorMessage component="div" name={"numero"} className="text-danger" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="text-end">
                                <button type="submit" className="btn btn-secondary waves-effect waves-light" >
                                    <FaSearch /> Buscar
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            {loading && <Spinner />}
                            {!loading && <DataTable

                                data={state.DatosTabla}
                                striped
                                pagination
                                dense
                                noHeader
                                responsive
                                keyField={"MonedaSatID"}
                                defaultSortField={"MonedaSatID"}
                                columns={Columns}
                                onRowDoubleClicked={(value: any) => {

                                    props.seleccionadoRenglon(value)
                                }}
                                conditionalRowStyles={
                                    [{
                                        when: row => {
                                            return row.toggleSelected === true
                                        },
                                        style: {
                                            backgroundColor: '#bdbdbd',
                                        },

                                    }
                                    ]
                                }

                            />


                            }

                            <div className="text-end">
                                <button type="reset" disabled={loading} className="btn btn-danger waves-effect waves-light" onClick={() => {
                                    props.fnCancelar()
                                    setState(state => ({ ...state, DatosTabla: [], Datos: { fechaFinal: "", fechaInicial: "", numero: 0, tipoPolizaID: "", usuario: "" } }))
                                }}
                                >

                                    Cancelar
                                </button>
                                <button type="submit" disabled={loading} className="ms-2 btn btn-success waves-effect waves-light">Ok</button>
                            </div>
                        </div>
                    </div>

                    {
                        !props.explorar &&
                        <div>
                            <div className="row">
                                <div className="col-12">
                                    <CustomFieldText disabled={true} label="Cuenta" name="cuenta" placeholder="Cuenta" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <CustomSelect
                                        disabled={true}
                                        name="cuentaId"
                                        label=""
                                        placeholder="Seleccione un tipo"
                                        options={props.optCuentas}
                                        addDefault={false}
                                        isMulti={false}
                                    />
                                </div>

                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <CustomFieldText disabled={true} label="Referencia" name="referencia" placeholder="Referencia" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    {
                                        props.DatosDefectoModalDetalle.debe !== 0 ?
                                            <CustomFieldText disabled={true} label="Debe" name="debe" placeholder="Debe" />
                                            :
                                            <CustomFieldText disabled={true} label="Debe" name="debe" placeholder="Debe" />
                                    }
                                </div>
                                <div className="col-6">
                                    {
                                        props.DatosDefectoModalDetalle.haber !== 0 ?
                                            <CustomFieldText disabled={true} label="Haber" name="haber" placeholder="Haber" />
                                            :
                                            <CustomFieldText disabled={true} label="Haber" name="haber" placeholder="Haber" />

                                    }
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <CustomFieldText disabled={true} label="Concepto" name="concepto" placeholder="Concepto" />
                                </div>
                            </div>
                            <div className="row">
                                <div className=" text-end">
                                    <button type="button" className="ms-2 btn btn-danger waves-effect waves-light" onClick={() => { props.fnCancelar() }}>
                                        <FaTimes />  Cerrar
                                    </button>
                                    {/** 
                                <button type="button" className="ms-2 btn btn-danger waves-effect waves-light" onClick={() => { toast.info("Este boton aun no tiene funcionalidad") }}>
                                    <FaTrashAlt /> Borrar
                        </button>
                                <button type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={() => { toast.info("Este boton aun no tiene funcionalidad") }}>
                                    <FaCheckCircle /> Aceptar
                        </button>
                                */}
                                </div>
                            </div>
                        </div>
                    }
                </div>
                }
            </Form>
        </Formik>
    )
}