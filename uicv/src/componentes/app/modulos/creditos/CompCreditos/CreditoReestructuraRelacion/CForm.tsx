import React, { useRef, useState, useEffect } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Card, Spinner, CustomFieldText, CustomFieldText2, CustomFieldDatePicker, ActionSelect, ActionCreatableSelect, ActionMultipleSelect, ActionFieldText, ActionFieldNumberText, ImgViewer, ActionAsyncSelect, CardItem } from '../../../../../global'
import { BuscarDatosBancarios, Clientes, Distribuidores, Sucursales, Cuentas } from '../../../../../selectores'
import * as Funciones from './Funciones'
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import CreatableSelect from 'react-select/creatable';
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { FaWindowClose, FaShoppingCart, FaCloudDownloadAlt, FaAddressCard } from 'react-icons/fa'
import CreditoArticulos from '../CreditoArticulos'
//import * as FnPersona from '../../../administracion/CompAdministracion/CompPersona/Funciones'
import { PerfilPersona } from '../../../../../presentacion'
// import { DBConfia_General } from '../../../../../../interfaces_db/DBConfia/General'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FiRefreshCcw } from 'react-icons/fi'
import { DescripcionDistribuidor } from '../../../../../../global/variables'

type CFormType = {
    oidc: IOidc
    ProductoID: number,
    initialValues: {
        DistribuidorId: number,
        SucursalId: number,
        CuentaId: number,
        FechaPago: Date,
        Importe: number,
        GenerarDNI: boolean,
        saldoPlazo: number,
        PorcComision: number,
        PagoTotal: number,
        PagoComision: number,
        Abono: number,
        Dif_Pago: number,
        AbonoAcumulado: number,
        SldCredPersonal: number,
        CargoAdic: number,
        BonDia: number,
        SldDia: number,
        PagoMinComision: number,
        CodigoAut: string,
        Plazos: number
    },
    cbActualizaDatos(item: any): any
    cbMuestrCotizacion(item: any, importe: number, plazos: number): any
    cbMuestraActual(show: boolean): any
    optPlazos: { value: number, label: string }[],
}

export const CForm = (props: CFormType) => {

    const MySwal = withReactContent(Swal)

    const [loading, setLoading] = useState(false)

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

    const formPerc = new Intl.NumberFormat('en-US', {
        style: 'percent',
        // currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });


    const ActualizaSaldos = (Datos: {
        DistribuidorId: number,
        SucursalId: number,
        CuentaId: number,
        FechaPago: Date,
        Importe: number,
        GenerarDNI: boolean,
        CodigoAut: string,
        CajaID?: number
    }) => {
        // console.log('Datos: ', Datos)
        if (Datos.DistribuidorId > 0 && Datos.FechaPago)
            Funciones.FNGetSaldos(props.oidc, {
                ...Datos,
                ProductoId: props.ProductoID,
                CajaID: 999
            })
                .then((respuesta: any) => {
                    // console.log('respuesta: ', respuesta)
                    setLoading(false)
                    props.cbActualizaDatos(respuesta)
                    if (respuesta.regresa == 0) {
                        toast.error(respuesta.msj)
                    }
                })
                .catch((error: any) => {
                    // console.log(JSON.stringify(error))

                    toast.error("Error al recuperar los saldos, intente lo nuevamente o reportarlo a sistemas")

                    setLoading(false)

                })
    }

    return (
        <>
            <Formik
                initialValues={props.initialValues}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    Plazos: Yup.number().required("Seleccione los plazos").moreThan(0, 'Seleccione los plazos'),
                    DistribuidorId: Yup.number().required(`Seleccione la ${DescripcionDistribuidor(1)}`).moreThan(0, `Seleccione la ${DescripcionDistribuidor(1)}`),
                    SucursalId: Yup.number().required("Seleccione la sucursal").moreThan(0, 'Seleccione la sucursal'),
                    FechaPago: Yup.string().required('Seleccione una fecha'), //Yup.date().required('Seleccione una fecha'), 
                })}
                onReset={(values: any) => {
                    // clearFormByLevel(0)
                }}
                onSubmit={(values: any) => {
                    props.cbMuestraActual(false)
                    console.log('##', values)
                    setLoading(true)
                    Funciones.FNGetAmortizacion(props.oidc, {
                        ...values,
                        ProductoID: props.ProductoID
                    })
                        .then((respuesta: any) => {
                            if (respuesta.regresa === 1) {
                                setLoading(false)
                                toast.success(`Cotización realizada`)
                                props.cbMuestrCotizacion(respuesta.data, values.Importe, values.Plazos);
                            }
                            else {
                                setLoading(false)
                                toast.error(respuesta.msj)
                                props.cbMuestrCotizacion([], values.Importe, values.Plazos);
                            }
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            if (error.response) {
                                toast.info(`Response: ${error.response.data}`)
                                if (`${error.response.data}`.includes('PENDIENTE'))
                                    props.cbMuestraActual(true)
                            } else if (error.request)
                                toast.error(`Request ${error}`)
                            else
                                toast.error(`${error}`)
                        })
                }}>
                {({ values }) => (
                    <Form>
                        <div className="columns is-desktop is-tablet">
                            <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                <Sucursales disabled={loading} ProductoID={props.ProductoID} name={'SucursalId'} valor={values.SucursalId} />
                            </div>
                            {/* <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                <Cuentas ProductoID={props.ProductoID} SucursalId={values.SucursalId} name={'CuentaId'} disabled={loading} oidc={props.oidc} />
                            </div> */}
                            <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                <Distribuidores disabled={values.SucursalId <= 0} SucursalID={values.SucursalId} name={'DistribuidorId'} WithProducto RequiereSuc cbAccion={(val) => { ActualizaSaldos({ ...values, DistribuidorId: val }) }} />
                            </div>
                            <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                <CustomFieldDatePicker disabled={true} label={'Fecha'} name={'FechaPago'} placeholder={''} onChange={(val) => { ActualizaSaldos({ ...values, FechaPago: val }) }} />
                            </div>
                            <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                <ActionSelect
                                    disabled={values.SucursalId <= 0}
                                    label="Plazos"
                                    name="Plazos"
                                    placeholder="Seleccione los plazos"
                                    //options={[{ value: 2, label: '2' }, { value: 4, label: '4' }, { value: 6, label: '6' }, { value: 8, label: '8' }, { value: 10, label: '10' }, { value: 12, label: '12' }]}
                                    options={props.optPlazos}
                                    addDefault={true}
                                    valor={0}

                                />
                            </div>
                        </div>

                        {loading && <Spinner />}
                        {!loading &&
                            <div className="columns is-desktop is-tablet">
                                <div className="column is-12-mobile is-12-tablet is-3-desktop"></div>
                                <div className="column is-12-mobile is-12-tablet is-3-desktop"></div>
                                <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                    <ActionFieldNumberText disabled={true} label={'SALDO'} valor={props.initialValues.Importe} name={'Importe'} placeholder={'0'} onBlur={() => { ActualizaSaldos(values) }} />
                                </div>
                                <div className="column is-12-mobile is-12-tablet is-3-desktop">
                                    <div className="text-center">
                                        <button type="submit" className="ms-2 btn btn-info waves-effect waves-light" >
                                            COTIZAR REESTRUCTURA
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }
                    </Form>
                )}
            </Formik>
        </>
    )
}
