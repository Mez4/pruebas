import React, { useState, useRef, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Spinner, CustomSelect, ActionSelect, DatePickeStart, DatePickeEnd } from '../../../../../global'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import * as Funciones from './Funciones'
import { toast } from 'react-toastify'
import { Productos, Sucursales, Zonas, EstatusCredito, Distribuidores, Coordinadores, Clientes } from '../../../../../selectores'
import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import es from 'date-fns/locale/es'
import moment from 'moment'
import ReactTooltip from 'react-tooltip';


// Icons

import { FiRefreshCcw } from 'react-icons/fi'

import { FaFilter } from 'react-icons/fa'
import { iUI } from '../../../../../../interfaces/ui/iUI'
registerLocale("es", es)

type CFormType = {
    oidc: IOidc,
    ui: iUI,
    initialValues: {
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
    },

    cbRespuesta(item: any): any
    funcionCargando(item: any): any,
}

export const CFormFiltrosDispersion = (props: CFormType) => {
    const [loading, setLoading] = useState(false)
    const [startDate, setStartDate] = useState(moment().add(-30, 'd').toDate());
    const [endDate, setEndDate] = useState(moment().toDate());

    return (
        <Formik
            initialValues={props.initialValues}
            // enableReinitialize
            validationSchema={Yup.object().shape({
                // SucursalID: Yup.array().min(1, 'Seleccione al menos una Sucursal'),
                // ZonaID: Yup.array().min(1, 'Seleccione al menos una Zona'),
                // EmpresaID: Yup.array().min(1, 'Seleccione al menos una Empresa'),
                // ClienteID: Yup.number().required("Seleccione el cliente").moreThan(0, 'Seleccione el cliente'),
                // DistribuidorID: Yup.number().required("Seleccione el Socia").moreThan(0, 'Seleccione el Socia'),
                // CoordinadorID: Yup.number().required("Seleccione el Coordinador").moreThan(0, 'Seleccione el Coordinador'),
                // DistribuidorNivelID: Yup.number().required("Seleccione el Nivel Socia").moreThan(0, 'Seleccione el Nivel Socia'),
                // ContratoID: Yup.number().required("Seleccione el Contrato").moreThan(0, 'Seleccione el Contrato'),
                // EstatusID: Yup.string().required("Seleccione el Estatus").moreThan(0, 'Seleccione el Estatus'),
                // ProductoID: Yup.number().required("Seleccione el Producto").moreThan(0, 'Seleccione el Producto'),
                FechaInicio: Yup.string().required("Seleccione la fecha inicial"),
                FechaFin: Yup.string().required("Seleccione la fecha final")
            })}
            onSubmit={(values: any) => {
                setLoading(true)
                props.funcionCargando(true)
                Funciones.FNgetbyfiltros(props.oidc, {
                    ...values,
                    ProductoID: isNaN(values.ProductoID) ? 0 : values.ProductoID,
                    ClienteID: isNaN(values.ClienteID) ? 0 : values.ClienteID,
                    SucursalID: isNaN(values.SucursalID) ? 0 : values.SucursalID,
                    ZonaID: isNaN(values.ZonaID) ? 0 : values.ZonaID,
                    EmpresaID: isNaN(values.EmpresaID) ? 0 : values.EmpresaID,
                    DistribuidorID: isNaN(values.DistribuidorID) ? 0 : values.DistribuidorID,
                    CoordinadorID: isNaN(values.CoordinadorID) ? 0 : values.CoordinadorID,
                    EstatusID: (values.EstatusID.length > 1) ? '' : values.EstatusID,
                    // FechaInicio: moment(values.FechaInicio).format('YYYY-MM-DD'),
                    // FechaFin: moment(values.FechaFin).format('YYYY-MM-DD'), 

                })
                    .then((respuesta: any) => {
                        props.cbRespuesta(respuesta)
                        //  props.funcionCargando(false)
                        setLoading(false)
                    })
                    .catch(() => {
                        setLoading(false)
                        props.funcionCargando(false)
                        toast.error("Error al consultar, vuelva a intentarlo")
                    })
            }}>
            {({ values }) => (
                <Form>
                    <div style={{ backgroundColor: '#F7F7F7', padding: '1em', borderRadius: '15px' }}>
                        <div>
                            <div style={{ float: 'left' }}><FaFilter /></div>
                            <div ><label> FILTROS</label></div>
                        </div>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <div style={{ display: 'inline-block' }}>
                                <div className="columns is-centered is-mobile is-multiline">
                                    <div className="column is-one-quarter-desktop is-half-tablet is-full-mobile">
                                        <Productos oidc={props.oidc} ui={props.ui} isSingle disabled={loading} name={'ProductoID'} valor={values.ProductoID} />
                                    </div>
                                    <div className="column is-one-quarter-desktop is-half-tablet is-full-mobile">
                                        <Zonas oidc={props.oidc} cargar disabled={loading} name={'ZonaID'} />
                                    </div>
                                    <div className="column is-one-quarter-desktop is-half-tablet is-full-mobile">
                                        <Sucursales disabled={loading} name={'SucursalID'} ProductoID={isNaN(values.ProductoID) ? 0 : values.ProductoID} valor={values.SucursalID} />
                                    </div>
                                    <div className="column is-one-quarter-desktop">
                                        <Coordinadores disabled={loading} SucursalID={isNaN(values.SucursalID) ? 0 : values.SucursalID} name={'CoordinadorID'} valor={values.CoordinadorID} />
                                    </div>
                                    <div className="column is-one-quarter-desktop is-half-tablet is-full-mobile">
                                        <Distribuidores disabled={loading} SucursalID={isNaN(values.SucursalID) ? 0 : values.SucursalID} name={'DistribuidorID'} />
                                    </div>
                                    <div className="column is-one-quarter-desktop is-half-tablet is-full-mobile">
                                        <Clientes disabled={loading} DistribuidorID={values.DistribuidorID} name={'ClienteID'} />
                                    </div>
                                    {/*  <div className="column is-2">
                                        <label className="form-label mb-0" htmlFor="EstatusID">Estatus</label>
                                        <EstatusCredito disabled={loading} name={'EstatusID'} />
                                    </div> */}
                                    <div className="column is-one-quarter-desktop is-half-tablet is-full-mobile">
                                        <DatePickeStart name={'FechaInicio'} label={'Fecha Inicial'} disabled={loading} placeholder={'Inicio'} isClearable startDate={startDate} endDate={endDate} setStartDate={setStartDate} />
                                    </div>
                                    <div className="column is-one-quarter-desktop is-half-tablet is-full-mobile">
                                        <DatePickeEnd name={'FechaFin'} label={'Fecha Final'} disabled={loading} placeholder={'Final'} isClearable startDate={startDate} endDate={endDate} setEndDate={setEndDate} />
                                    </div>
                                </div>
                                {loading && <Spinner />}

                            </div>
                            {!loading &&
                                <div className="text-center">
                                    <br />
                                    <button disabled={loading} type="submit" className="ms-2 btn btn-primary waves-effect waves-light" onClick={() => { }}>
                                        <span className="">Buscar</span>&nbsp;<FiRefreshCcw />
                                    </button>
                                </div>}
                        </div>
                    </div>

                </Form>
            )}
        </Formik>
    )
}