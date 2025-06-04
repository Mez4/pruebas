import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CajaDenominacionesMonedaGeneral/Funciones'
import { toast } from 'react-toastify'
import { date } from 'yup/lib/locale'
import { Field, ErrorMessage, Formik } from 'formik'

import * as Yup from 'yup'

import Select from 'react-select'

import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle, FaTrash } from 'react-icons/fa'

// Custom components
import { Card, CustomSelect, Spinner } from '../../../../global'
import { CForm } from './CajaDenominacionesMonedaGeneral/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { Form } from 'formik'
import { isTemplateTail } from 'typescript'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import es from 'date-fns/locale/es'
import { iUI } from '../../../../../interfaces/ui/iUI'

type CatalogosType = {
    oidc: IOidc,
    location: any,
    ui: iUI
}

const CatalogoBancoBancos = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        cajaID: 0,
        denominacion: [],
        fechaInicial: new Date(),
        fechaFinal: new Date()

    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const OptionsSucursal: any[] = []
    const OptionsCaja: any[] = []
    const DatosTabla: any[] = []

    const [state, setState] = React.useState({
        Habilitar: true,
        Datos,
        Datos2: {
            cajaID: 0,
            fechaInicial: "",
            fechaFinal: "",
            sucursalId: 0

        },
        DatosTabla,
        DatosMostrar,
        Filtro: '',
        nombre: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        },
        OptionsSucursal,
        OptionsCaja,
        startDate: null,
        endDate: null
    })


    //Funcion para obtener los datos generales de la pantalla principal, en base al filtrado.
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

    //Funcion para llenar el modal con el detalle de corte.
    const FNGetTable = (item: any, fecha: any) => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetDenominaciones(props.oidc, item, fecha)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, DatosTabla: respuesta }))
                    console.log(respuesta)
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, DatosTabla: [] }))
                }
            })
    }


    //Funcion para llenar el combo con las sucursales 
    const FnGetSucursal = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetSucursal(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    var sucursal = respuesta.map((valor: any) => {
                        var obj = { value: valor.sucursalId, label: valor.sucursal };
                        return obj
                    });
                    setState(s => ({ ...s, OptionsSucursal: sucursal }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, OptionsSucursal: [] }))
                }
            })
    }

    //Funcion para filtrar los datos en base a la sucursal seleccionada.
    const FNFiltroSucursales = (sucursalId: any, fechaInicial: any, fechaFinal: any) => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGetFiltroSucursales(props.oidc, sucursalId, fechaInicial, fechaFinal)
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

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'SUCURSAL', selector: 'sucursal', sortable: true, },
                { name: 'NOMBRE CAJA', selector: 'nombreCaja', sortable: true, },
                { name: 'ID CAJA', selector: 'cajaID', sortable: true, },
                { name: 'REALIZA ARQUEO', selector: 'realizaArqueo', sortable: true, },
                { name: 'CUENTA', selector: 'cuenta', sortable: true, },
                { name: 'FECHA', selector: 'fecha', sortable: true, },

                {
                    name: 'Acciones', sortable: false,
                    cell: (props) =>
                        <button className="btn btn-info" type={"button"} onClick={() => {
                            FNGetTable(props.cajaID, props.fecha)
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...s.Form, Mostrar: true,
                                    Datos: {
                                        cajaID: props.cajaID,
                                        sucursalId: props.sucursalId,
                                        denominacion: [],
                                        fechaFinal: new Date(),
                                        fechaInicial: new Date()
                                    },
                                    Id: props.cajaID,
                                    fechaInicial: props.fechaInicial,
                                    fechaFinal: props.fechaFinal
                                }
                            }))
                        }}>
                            <FaPencilAlt size='15' />
                            &nbsp; Ver Detalle</button>
                },
            ]
        return colRet
    }, [])

    React.useEffect(() => {
        FNGetLocal()
        // FNGetDatos()
        FnGetSucursal()
        //FnGetCajas()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [props.oidc])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => { }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) => { }


    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    return (
        <div className="row">
            <div className="mt-lg-5 p-3">

                <Card Title="Cantidades Monetarias">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <Formik
                                        initialValues={state.Datos2}
                                        enableReinitialize
                                        validationSchema={
                                            Yup.object().shape({
                                                // cantidad: Yup.number().typeError('Solo se aceptan numeros')
                                            })}
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
                                            let fechaInicialD = "" + diaInicial + "-" + mesInicio + "-" + values.fechaInicial.getFullYear()
                                            let fechaFinalD = "" + diaFinal + "-" + mesFinal + "-" + values.fechaFinal.getFullYear()
                                            FNFiltroSucursales(values.sucursalId, fechaInicialD, fechaFinalD)

                                        }}>
                                        <Form>
                                            {/*Inician fechas */}
                                            <div className="row">
                                                <div className="col-2">
                                                    <div className="mb-3">
                                                        <label className="form-label mb-0" htmlFor={"sucursalId"}>Sucursales</label>
                                                        <Field name={"sucursalId"} className="form-select"  >
                                                            {(control: any) => (
                                                                <select
                                                                    className="form-select"
                                                                    //options={state.optCuentas}                                                                  
                                                                    value={control.field.value}
                                                                    onChange={(value: any) => {
                                                                        control.form.setFieldValue("sucursalId", parseInt(value.target.value))
                                                                    }}
                                                                    disabled={false}
                                                                    id={"tipoMovID"}
                                                                    name={"tipoMovID"}
                                                                >
                                                                    <option value="0">{"Selecciona una sucursal"}</option>
                                                                    {state.OptionsSucursal.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                                                </select>

                                                            )}
                                                        </Field>
                                                        <ErrorMessage component="div" name={"sucursalId"} className="text-danger" />
                                                    </div>
                                                </div>



                                                <div className="col-2">
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

                                                <div className="col-2">
                                                    <div className="mb-2" >
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

                                                <div className="col-2">
                                                    <div className="mb-2" >
                                                        <label className="form-label mb-0" htmlFor={"fechaFinal"}>Buscar</label>
                                                        <br />
                                                        <button disabled={state.Cargando} className="btn btn-outline-secondary" type="submit"><FaSearch />Buscar</button>
                                                    </div>
                                                </div>



                                            </div>
                                            {/*terminan fechas */}

                                        </Form>
                                    </Formik>

                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar movimientos" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
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
                                        keyField={"cajaID"}
                                        defaultSortField={"cajaID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar} xlarge={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "Cantidades Monetarias por Caja" : "Cantidades Monetarias por Caja"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                Seguridad={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                DatosTabla={state.DatosTabla}
                                                fnCancelar={fnCancelar}
                                                optionsSucursal={state.OptionsSucursal}
                                                optionsCajas={state.OptionsCaja}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>
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
    Oidc: state.oidc,
    ui: state.UI
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogoBancoBancos)