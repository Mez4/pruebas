import React, { useState, useRef, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Spinner, CustomSelect, ActionSelect, DatePickeStart, DatePickeEnd } from '../../../../../global'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import * as Funciones from './Funciones'
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

registerLocale("es", es)

type CFormType = {
    oidc: IOidc,
    ui: iUI,
    initialValues: {
        ProductoID: number,
        ClienteID: number,
        SucursalID: number,
        CajaID: number,
        ZonaID: number,
        EmpresaID: number,
        DistribuidorID: number,
        CoordinadorID: number,
        ContratoID: number,
        EstatusID: string,
        DistribuidorNivelID: number,
        FechaInicio: Date,
        FechaFin: Date
    },
    cbRespuesta(item: any): any
}

export const BuscarCreditos = (props: CFormType) => {
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
                FechaInicio: Yup.string().required("Seleccione la fecha inicial").typeError('Seleccione la fecha inicial'),
                FechaFin: Yup.string().required("Seleccione la fecha final").typeError('Seleccione la fecha final')
            })}
            onSubmit={(values: any) => {
                setLoading(true)
                Funciones.FNgetbyfiltros(props.oidc, {
                    ...values,
                    ProductoID: isNaN(values.ProductoID) ? 0 : values.ProductoID,
                    ClienteID: isNaN(values.ClienteID) ? 0 : values.ClienteID,
                    SucursalID: isNaN(values.SucursalID) ? 0 : values.SucursalID,
                    CajaID: isNaN(values.CajaID) ? 0 : values.CajaID,
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
                        setLoading(false)
                    })
                    .catch(() => {
                        setLoading(false)
                        toast.error("Error al consultar, vuelva a intentarlo")
                    })
            }}>
            {({ values }) => (
                <Form>
                    <div style={{ backgroundColor: '#F7F7F7', padding: '1em', borderRadius: '15px', }}>
                        <div>
                            <div style={{ float: 'left' }} className='mx-3'><FaFilter /></div>
                            <div ><label> FILTROS</label></div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ display: '', }} className=''>
                                <div className="d-flex justify-content-center row">
                                    {/* <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                        <Productos oidc={props.oidc} isSingle disabled={loading} name={'ProductoID'} valor={values.ProductoID} ui={props.ui} />
                                    </div> */}
                                    {/* <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                        <Zonas oidc={props.oidc} cargar disabled={loading} name={'ZonaID'} isProducto />
                                    </div> */}
                                    <div className="col-sm-12 col-md-3 col-lg-4 col-xl-3 text-center mt-1">
                                        <Sucursales disabled={loading} name={'SucursalID'} ProductoID={isNaN(values.ProductoID) ? 0 : values.ProductoID} valor={values.SucursalID} />
                                    </div>
                                    <div className="col-sm-12 col-md-3 col-lg-4 col-xl-3 text-center">
                                        <Distribuidores disabled={loading} WithProducto SucursalID={isNaN(values.SucursalID) ? 0 : values.SucursalID} name={'DistribuidorID'} label={`${DescripcionDistribuidor(1)}`} />
                                    </div>
                                    {/* <div className="col-sm-12 col-md-3 col-lg-4 col-xl-3 text-center">
                                        <Cajas oidc={props.oidc} name="CajaID" RecSuc SucursalId={values.SucursalID} disabled={loading} />
                                    </div> */}
                                    {/* <div className="column is-12-mobile is-12-tablet is-4-desktop">
                                        <Coordinadores disabled={loading} SucursalID={isNaN(values.SucursalID) ? 0 : values.SucursalID} name={'CoordinadorID'} valor={values.CoordinadorID} />
                                    </div> 
                                    <div className="column is-12-mobile is-12-tablet is-5-desktop">
                                        <Clientes disabled={loading} DistribuidorID={values.DistribuidorID} name={'ClienteID'} />
                                    </div>  */}

                                </div>
                                <div className="d-flex justify-content-center row">
                                    {/* <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                        <Distribuidores disabled={loading} WithProducto SucursalID={isNaN(values.SucursalID) ? 0 : values.SucursalID} name={'DistribuidorID'} label={`${DescripcionDistribuidor(1)}`} />
                                    </div> */}
                                    {/* <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                        <Clientes disabled={loading} DistribuidorID={values.DistribuidorID} name={'ClienteID'} />
                                    </div> */}
                                    {/* <div className="col-sm-12 col-md-3 col-lg-4 col-xl-3 text-center">
                                        <EstatusCredito disabled={loading} name={'EstatusID'} />
                                    </div> */}
                                    <div className="col-sm-12 col-md-3 col-lg-4 col-xl-3 text-center">
                                        <DatePickeStart name={'FechaInicio'} label={'Fecha Inicial'} disabled={loading} placeholder={'Inicio'} isClearable startDate={startDate} endDate={endDate} setStartDate={setStartDate} />
                                    </div>
                                    <div className="col-sm-12 col-md-3 col-lg-4 col-xl-3 text-center">
                                        <DatePickeEnd name={'FechaFin'} label={'Fecha Final'} disabled={loading} placeholder={'Final'} isClearable startDate={startDate} endDate={endDate} setEndDate={setEndDate} />
                                    </div>
                                </div>
                                {/* <div className="columns is-desktop is-tablet">
                                    <div className="column">
                                        
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    {loading && <Spinner />}
                    {!loading &&
                        <div className="text-end">
                            <br />
                            <button type="submit" className="ms-2 btn btn-primary waves-effect waves-light" onClick={() => { }}>
                                <span className="is-hidden-touch">Buscar</span>&nbsp;<FiRefreshCcw />
                            </button>
                        </div>
                    }
                </Form>
            )}
        </Formik>
    )
}