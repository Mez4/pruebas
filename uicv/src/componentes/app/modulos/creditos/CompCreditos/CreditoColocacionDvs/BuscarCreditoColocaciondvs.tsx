import React, { useState, useRef, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Card, CustomFieldDatePicker } from '../../../../../global'
import { Spinner, CustomSelect, ActionSelect, DatePickeStart, DatePickeEnd, CustomFieldText, CustomFieldText2 } from '../../../../../global'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import * as Funciones from './../../CompCreditos/CreditoColocacionDvs/Funciones'
import { toast } from 'react-toastify'
import { Productos, Sucursales, Zonas, EstatusCredito, Distribuidores, Coordinadores, Clientes, Cajas } from '../../../../../selectores'
import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import es from 'date-fns/locale/es'
import moment from 'moment'
import { DescripcionDistribuidor } from '../../../../../../global/variables'

// Icons
import { FiRefreshCcw } from 'react-icons/fi'
import { FaFilter } from 'react-icons/fa'
import { iUI } from '../../../../../../interfaces/ui/iUI'
import Select from 'react-select'
import { optionCSS } from 'react-select/src/components/Option'
import XLSX from 'xlsx';
import { FaFileExcel, FaCashRegister, FaListAlt } from 'react-icons/fa'

registerLocale("es", es)
type EstadoTipo = {
    FechaInicio: Date;
    FechaFin: Date;
};

const optSucursales: any[] = []
const FiltroSucursal: number = 0

type CFormType = {
    oidc: IOidc,
    ui: iUI,
    cbFiltrar(item: any): any,
    initialValues: {
        FechaInicio: any
        FechaFin: any
        // FechaInicio: state.FechaInicio,
        // FechaFin: state.FechaFin,

    },
    cbRespuesta(item: any): any,
    filtrandoSusursal: any
    generarXLSX(values: {
        DirectorID: number,
        ProductoID: number,
        ClienteID: number,
        SucursalID: number,
        ZonaID: number,
        EmpresaID: number,
        DistribuidorID: number,
        CoordinadorID: number,
        ContratoID: number,
        EstatusID: string,
        DistribuidorNivelID: number,
        FechaInicio: Date,
        FechaFin: Date,
        Permiso: boolean,
        GrupoID: number
    }): any
}

export const BuscarCreditoColocaciondvs = (props: CFormType) => {


    const [state, setState] = useState({
        data: [{}],
        loading: false,
        DatosMostrar: [],
        Cargando: false,
        Error: false,
        Filtro: "",
        optSucursales,
        FiltroSucursal

    })
    function formatearFecha(fecha) {
        return moment(fecha).format("DD/MM/YYYY")
    }

    const FnSucursales = () => {
        setState(s => ({ ...s }))
        Funciones.FNGetSucursales(props.oidc)
            .then((respuesta: any) => {
                var sucursales = respuesta.map((valor: any) => {
                    var obj = { value: valor.SucursalID, label: valor.Nombre };
                    return obj
                });
                setState(s => ({ ...s, optSucursales: sucursales }))
            })
            .catch(() => {
                setState(s => ({ ...s, optSucursales: [] }))
            })
    }
    const fnGetFiltrosSucursales = (SucursalID: number) => {
        props.cbFiltrar(SucursalID)
        //  setState(s => ({ ...s, FiltroSucursal: SucursalID }))
    }


    let isMounted = React.useRef(true)
    const [loading, setLoading] = useState(false)
    React.useEffect(() => {
        FnSucursales()
        return () => {
            isMounted.current = false
        }
    }, [])

    console.log('FILTRANDO VALOR ,', props.filtrandoSusursal)
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                FechaInicio: Yup.date()
                    .required("Seleccione una Fecha(Obligatorio)")
                    .nullable(),
                FechaFin: Yup.date()
                    .required("Seleccione una Fecha(Obligatorio)")
                    .nullable(),
            })}
            onSubmit={(values: any) => {
                setLoading(true)
                console.log('VALORES ', values)
                console.log('VALORES2', props.initialValues)
                let Datos = {
                    // FechaInicio: props.initialValues.FechaInicio,
                    // FechaFin: props.initialValues.FechaFin
                    FechaInicio: values.FechaInicio,
                    FechaFin: values.FechaFin
                }

                // console.log("FECHA FINAL", Datos.FechaFin)
                // console.log("FECHA INICIO", Datos.FechaInicio)
                Funciones.FNgetbyfiltros(props.oidc, Datos)
                    .then((respuesta: any) => {
                        // console.log("RESPUESTOIDE", respuesta)

                        props.cbRespuesta(respuesta.data)
                        setLoading(false)//false
                    })
                    .catch(() => {
                        setLoading(false)
                        toast.error("Error al consultar, vuelva a intentarlo")
                    })
            }}>
            <Form>
                <div style={{ backgroundColor: '#F7F7F7', padding: '1em', borderRadius: '15px' }}>
                    <div>
                        <div style={{ float: 'left' }}><FaFilter /></div>
                        <div ><label> FILTROS</label></div>
                    </div>

                    <div className="columns is-centered is-mobile is-multiline">
                        {/* <div className="column is-align-items-center  is-one-quarter-desktop is-half-tablet is-full-mobile">
                            <Distribuidores disabled={loading} WithProducto name={'DistribuidorID'} label={`${DescripcionDistribuidor(1)}`} />
                        </div> */}

                        <div className="column is-4-desktop">
                            <CustomFieldDatePicker
                                disabled={state.loading}
                                label='Fecha inicio'
                                name='FechaInicio'
                            />
                        </div>
                        <div className="column is-4-desktop">
                            <CustomFieldDatePicker
                                disabled={state.loading}
                                label='Fecha fin'
                                name='FechaFin'
                            />
                        </div>
                        <div className="column is-4-desktop">
                            <ActionSelect
                                disabled={props.filtrandoSusursal == 1 ? false : true}
                                label="Sucursales"
                                name="SucursalID"
                                placeholder="TODOS"
                                options={state.optSucursales}
                                addDefault={false}
                                valor={state.FiltroSucursal}
                                accion={fnGetFiltrosSucursales}
                            />
                        </div>

                        {/* SE COMENTO ESTA PARTE POR QUE ES EL COMBOBOX PARA LAS FECHAS DE CORTE */}
                        {/* <div className="column is-align-items-center  is-one-quarter-desktop is-half-tablet is-full-mobile">
                            <CustomSelect
                                // disabled={loading}
                                label="Corte"
                                name="DiaID"
                                placeholder="Seleccione la Fecha de Corte"
                                options={optDia}
                                addDefault={false}
                            />
                        </div> */}
                        {/* SE COMENTO POR QUE NO NECESITO EL MES */}
                        {/* <div className="column is-align-items-center  is-one-quarter-desktop is-half-tablet is-full-mobile">
                            <CustomSelect
                                disabled={loading}
                                label="Mes"
                                name="MesID"
                                placeholder="Seleccione el mes"
                                options={optMes}
                                addDefault={false}
                            />
                        </div> */}
                        {/* SE DESAHBILITARA TAMBIEN EL AÑO YA QUE NO LO NECESITO */}
                        {/* <div className="column is-align-items-center  is-one-quarter-desktop is-half-tablet is-full-mobile">
                        <CustomFieldText 
                        disabled={loading} 
                        label="Año" name="AID" 
                        placeholder={"Ingrese Año"}
                        
                        />
                        </div> */}
                    </div>
                </div>
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <br />
                        <button type="submit" className="ms-2 btn btn-primary waves-effect waves-light">
                            <span className="is-hidden-touch">Buscar</span>&nbsp;<FiRefreshCcw />
                        </button>
                    </div>

                }
            </Form>

        </Formik>
    )
}
