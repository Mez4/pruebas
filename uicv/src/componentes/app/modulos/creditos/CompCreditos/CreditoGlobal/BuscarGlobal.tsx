import React, { useState, useRef, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Spinner, CustomSelect, ActionSelect, DatePickeStart, DatePickeEnd } from '../../../../../global'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import * as Funciones from './Funciones'
import { toast } from 'react-toastify'
import { Directores, Productos, Sucursales, Zonas, EstatusCredito, Distribuidores, Coordinadores, Clientes, Grupos } from '../../../../../selectores'
import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import es from 'date-fns/locale/es'
import moment from 'moment'

// Icons
import { FiRefreshCcw } from 'react-icons/fi'
import { FaFileExcel, FaFilter } from 'react-icons/fa'
import { iUI } from '../../../../../../interfaces/ui/iUI'

registerLocale("es", es)

type CFormType = {
    oidc: IOidc,
    ui: iUI,
    initialValues: {
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
        GrupoID: number,
        Permiso: boolean,
        tipoDias: string
    },
    fnCargando(): any
    cbRespuesta(item: any, values: {
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
    }): any,
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

export const BuscarGlobal = (props: CFormType) => {
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
                props.fnCargando()
                // Funciones.FNgetbyfiltros(props.oidc, {
                //     ...values,
                //     DirectorID: isNaN(values.DirectorID) ? 0 : values.DirectorID,
                //     ProductoID: isNaN(values.ProductoID) ? 0 : values.ProductoID,
                //     ClienteID: isNaN(values.ClienteID) ? 0 : values.ClienteID,
                //     SucursalID: isNaN(values.SucursalID) ? 0 : values.SucursalID,
                //     ZonaID: isNaN(values.ZonaID) ? 0 : values.ZonaID,
                //     DistribuidorID: isNaN(values.DistribuidorID) ? 0 : values.DistribuidorID,
                //     GrupoID: isNaN(values.GrupoID) ? 0 : values.GrupoID,
                //     Tipo: 0
                // })
                //     .then((res: any) => {
                Funciones.FNgetbyfiltros(props.oidc, {
                    ...values,
                    DirectorID: isNaN(values.DirectorID) ? 0 : values.DirectorID,
                    ProductoID: isNaN(values.ProductoID) ? 0 : values.ProductoID,
                    ClienteID: isNaN(values.ClienteID) ? 0 : values.ClienteID,
                    SucursalID: isNaN(values.SucursalID) ? 0 : values.SucursalID,
                    ZonaID: isNaN(values.ZonaID) ? 0 : values.ZonaID,
                    DistribuidorID: isNaN(values.DistribuidorID) ? 0 : values.DistribuidorID,
                    GrupoID: isNaN(values.GrupoID) ? 0 : values.GrupoID,
                    Tipo: 1
                })
                    .then((respuesta: any) => {
                        // console.log(respuesta, 'resp fngetbyfiltros')
                        props.cbRespuesta(respuesta, {
                            ...values,
                            DirectorID: isNaN(values.DirectorID) ? 0 : values.DirectorID,
                            ProductoID: isNaN(values.ProductoID) ? 0 : values.ProductoID,
                            ClienteID: isNaN(values.ClienteID) ? 0 : values.ClienteID,
                            SucursalID: isNaN(values.SucursalID) ? 0 : values.SucursalID,
                            ZonaID: isNaN(values.ZonaID) ? 0 : values.ZonaID,
                            DistribuidorID: isNaN(values.DistribuidorID) ? 0 : values.DistribuidorID,
                            GrupoID: isNaN(values.GrupoID) ? 0 : values.GrupoID,
                            // Tipo: 1
                        })
                        setLoading(false)
                    })
                    .catch(() => {
                        props.cbRespuesta([], values)
                        setLoading(false)
                        toast.error("Error al consultar, vuelva a intentarlo")
                    })
                // })
                // .catch(() => {
                //     props.cbRespuesta([], values)
                //     setLoading(false)
                //     toast.error("Error al consultar, vuelva a intentarlo")
                // })
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
                                <div className="columns is-desktop ">
                                    <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                        <Directores oidc={props.oidc} isSingle disabled={loading} name={'DirectorID'} valor={values.DirectorID} />
                                    </div>
                                    <div className="column is-3">
                                        <Productos oidc={props.oidc} ui={props.ui} isSingle disabled={loading} DirectorID={isNaN(values.DirectorID!) ? 0 : values.DirectorID} name={'ProductoID'} valor={values.ProductoID} />
                                    </div>
                                    <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                        <Zonas oidc={props.oidc} cargar disabled={loading} isProducto name={'ZonaID'} />
                                    </div>
                                    <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                        <Sucursales disabled={loading} ZonaID={isNaN(values.ZonaID) ? 0 : values.ZonaID} name={'SucursalID'} valor={values.SucursalID} />
                                    </div>
                                </div>
                                <div className="columns is-desktop ">
                                    <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                        {/* {console.log(values.SucursalID, values.ProductoID, values.Permiso, 'GRUPO PROPS')} */}
                                        <Grupos oidc={props.oidc} disabled={loading} cargar SucursalID={isNaN(values.SucursalID) ? 0 : values.SucursalID} ProductoID={values.ProductoID} Permiso={true} />
                                    </div>
                                    <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                        <Distribuidores disabled={loading} SucursalID={isNaN(values.SucursalID) ? 0 : values.SucursalID} GrupoID={isNaN(values.GrupoID) ? 0 : values.GrupoID} name={'DistribuidorID'} />
                                    </div>
                                    <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                        <Clientes disabled={loading} DistribuidorID={values.DistribuidorID} name={'ClienteID'} />
                                    </div>
                                    <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                        {/* <br /> */}
                                        <label className="form-label mb-0">Dias Atraso</label>
                                        <br className="is-hidden-desktop" />
                                        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                            <Field type="radio" className="btn-check" name="tipoDias" id="Dias0" autoComplete="off" value="0" />
                                            <label className="btn btn-outline-primary" htmlFor="Dias0">N/A</label>

                                            <Field type="radio" className="btn-check" name="tipoDias" id="Dias1" autoComplete="off" value="1" />
                                            <label className="btn btn-outline-primary" htmlFor="Dias1">1/45</label>

                                            <Field type="radio" className="btn-check" name="tipoDias" id="Dias2" autoComplete="off" value="2" />
                                            <label className="btn btn-outline-primary" htmlFor="Dias2">46/90</label>

                                            <Field type="radio" className="btn-check" name="tipoDias" id="Dias3" autoComplete="off" value="3" />
                                            <label className="btn btn-outline-primary" htmlFor="Dias3">90+</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="columns is-desktop ">
                                    {/* <div className="column is-3">
                                        <label className="form-label mb-0" htmlFor="EstatusID">Estatus Crédito</label>
                                        <EstatusCredito disabled={loading} name={'EstatusID'} />
                                    </div> */}
                                    {/* <div className="column is-2">
                                        <DatePickeStart name={'FechaInicio'} label={'Fecha Inicial'} disabled={loading} placeholder={'Inicio'} isClearable startDate={startDate} endDate={endDate} setStartDate={setStartDate}/>
                                    </div>
                                    <div className="column is-2">  
                                        <DatePickeEnd name={'FechaFin'} label={'Fecha Final'} disabled={loading} placeholder={'Final'} isClearable startDate={startDate} endDate={endDate} setEndDate={setEndDate}/>
                                    </div> */}
                                    {/* <div className="column is-6"></div> */}
                                    <div className="column is-12-mobile is-6-tablet is-3-desktop is-offset-6">
                                        {loading && <Spinner />}
                                        {!loading &&
                                            <div className="text-end">
                                                <br />
                                                <button disabled={loading} type="submit" className="ms-2 btn btn-primary waves-effect waves-light" onClick={() => { }}>
                                                    <span >Buscar</span>&nbsp;<FiRefreshCcw />
                                                    {/* className="is-hidden-touch" */}
                                                </button>
                                            </div>
                                        }
                                    </div>
                                    <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                        {loading && <Spinner />}
                                        {!loading &&
                                            <div className="text-end">
                                                <br />
                                                <button type="button" className="btn mx-1 btn-success waves-effect waves-light"
                                                    //disabled={state.estatusPeriodo != "A" ? true : false}
                                                    onClick={() => {
                                                        // props.fnCargando()
                                                        // setLoading(true)
                                                        props.generarXLSX(values)
                                                    }}>
                                                    <span >Exportar</span>&nbsp;<FaFileExcel size="20px" />
                                                </button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    )
}