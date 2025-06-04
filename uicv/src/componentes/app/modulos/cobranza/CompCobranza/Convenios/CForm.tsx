import React, { useRef, useState, useEffect } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Card, Spinner, CustomFieldText, CustomFieldText2, CustomFieldDatePicker, ActionSelect, ActionCreatableSelect, ActionMultipleSelect, ActionFieldText, ActionFieldNumberText, ImgViewer, ActionAsyncSelect, CardItem } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { ConveniosPlazos, ConveniosPorcQuita } from '../../../../../selectores'
import * as Funciones from './Funciones'
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import CreatableSelect from 'react-select/creatable';
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { FaWindowClose, FaShoppingCart, FaCloudDownloadAlt, FaAddressCard, FaListAlt } from 'react-icons/fa'
// import { DBConfia_General } from '../../../../../../interfaces_db/DBConfia/General'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FiRefreshCcw } from 'react-icons/fi'
import { DescripcionDistribuidor } from '../../../../../../global/variables'
import { truncateDecimals } from '../../../../../../global/functions'
import { ConvenioDetalle } from './Detalle'

type CFormType = {
    oidc: IOidc
    DistribuidorDesc: string,
    initialValues: {
        ConvenioID: number,
        EstatusId: number,
        Editar: boolean,
        DistribuidorID: number,
        SucursalID: number,
        isPagoIntencion: boolean,
        PorcPagInt: number,
        PorcBon: number,
        Plazos: number,
        SaldoActual: number,
        saldoAtrasado: number,
        DiasAtraso: number,
    },
    loading: boolean,
    fnCancelar(): any
    // cbActualizar(item: any): any,
    cbGuardar(Datos: { DistribuidorID: number, ConvenioID: number, SucursalID: number, PorcPagInt: number, PorcBon: number, Plazos: number, Editar: boolean }): any
}

export const CForm = (props: CFormType) => {

    // console.log('initialValues: ', props.initialValues)

    const MySwal = withReactContent(Swal)

    // const [loading, setLoading] = useState(false)
    const DatosDetalle = {
        ConvenioID: 0,
        DistribuidorID: 0,
        ProductoID: 0,
        SucursalID: 0,
        PorcPagInt: 0,
        PorcBon: 0,
        Plazos: 0,
        // SaldoActual: number,
        // saldoAtrasado: number,
        // DiasAtraso: number
    }
    const [state, setState] = React.useState({
        DatosDetalle,
        Detalle: false
    })

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

    // useEffect(() => {
    //     console.log('loading: ', props.loading)
    //     setLoading(props.loading)
    //     // eslint-disable-next-line
    // }, [props.loading])

    return (
        <>
            <Formik
                initialValues={props.initialValues}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    // DistribuidorId: Yup.number().required(`Seleccione la ${DescripcionDistribuidor(1)}`).moreThan(0, `Seleccione la ${DescripcionDistribuidor(1)}`),
                    // SucursalId: Yup.number().required("Seleccione la sucursal").moreThan(0, 'Seleccione la sucursal'),
                    // CuentaId: Yup.number().required(`Seleccione una cuenta`).moreThan(0, `Seleccione una cuenta`),
                    // FechaPago: Yup.string().required('Seleccione una fecha'), //Yup.date().required('Seleccione una fecha'), 
                    PorcPagInt: Yup.number().when('isPagoIntencion', {
                        is: (value: boolean) => value == true,
                        then: Yup.number().required("Ingrese el Pago Intencion").moreThan(0, 'Ingrese el Pago Intencion')
                    }),
                    // PorcPagInt: Yup.number().required("Ingrese el Pago Intencion").moreThan(-1, 'Ingrese el Pago Intencion'),
                    PorcBon: Yup.number().required("Ingrese el Porcentaje de Quita").moreThan(-1, 'Ingrese el Porcentaje de Quita'),
                    Plazos: Yup.number().required("Ingrese los Plazos").moreThan(0, 'Ingrese los Plazos'),
                })}
                onReset={(values: any) => {
                    // clearFormByLevel(0)
                }}
                onSubmit={(values: any) => {

                    if (values.isPagoIntencion && truncateDecimals(values.PorcPagInt / values.SaldoActual, 4) < 0.0499) {

                        MySwal.fire({
                            title: 'Pago Intención',
                            html: <div className="text-center">
                                El pago intencion debe ser mayor al 5% del saldo actual
                            </div>,
                            // text: `El pago intencion debe ser mayor al 5% del saldo actual`,
                            icon: 'error',
                            showCloseButton: false,
                            showCancelButton: true,
                            showConfirmButton: false,
                            focusConfirm: false,
                            // confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            cancelButtonText: 'Cerrar',
                            confirmButtonAriaLabel: '',
                            cancelButtonAriaLabel: ''
                        })

                    } else {

                        let MSG = ''
                        let title = ''

                        switch (values.EstatusId) {
                            case 0:
                                title = 'Solicitar Convenio'
                                MSG = `¿Desea crear una solicitud de convenio para la socia: ${values.DistribuidorID} ${props.DistribuidorDesc}?`
                                break;
                            case 1:
                                title = 'Autorizar Convenio'
                                MSG = `Se autorizará el Convenio para la socia: ${values.DistribuidorID} ${props.DistribuidorDesc} ¿Desea continuar?`
                                break;
                            case 2:
                                title = 'Aplicar Convenio'
                                MSG = `Se aplicará el Convenio para la socia: ${values.DistribuidorID} ${props.DistribuidorDesc} ¿Desea continuar?`
                                break;
                            default:
                        }

                        MySwal.fire({
                            title: title,
                            icon: 'question',
                            html:
                                <div className="text-center">
                                    {MSG}
                                </div>,
                            showCloseButton: false,
                            showCancelButton: true,
                            showConfirmButton: true,
                            focusConfirm: false,
                            focusCancel: true,
                            cancelButtonText: 'Cancelar',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonAriaLabel: 'Aceptar',
                            cancelButtonAriaLabel: ''
                        }).then((result) => {
                            if (result.isConfirmed) {

                                // setLoading(true)

                                props.cbGuardar({
                                    ...values,
                                    PorcPagInt: values.isPagoIntencion ? (values.PorcPagInt / values.SaldoActual) : 0
                                })
                                //FNAutorizar({ ConvenioID: data.ConvenioID, DistribuidorID: data.DistribuidorID, SucursalID: data.SucursalID, Estatus: data.EstatusId })
                            }
                        })

                    }

                }}>
                {({ values }) => (
                    <Form>
                        <div className="columns is-desktop is-tablet">
                            <div className="column is-12-mobile is-12-tablet is-12-desktop">
                                <div className="input-group">
                                    <label className="input-group-text" style={{ minWidth: "50%", display: 'block', textAlign: "right", fontWeight: "bold" }} htmlFor={"SaldoActual"}>{'Saldo Actual'}</label>
                                    <label className="input-group-text" style={{ minWidth: "50%", display: 'block', textAlign: "right" }} >{formatter.format(values.SaldoActual)}</label>
                                </div>
                            </div>
                        </div>
                        <div className="columns is-desktop is-tablet">
                            <div className="column is-12-mobile is-12-tablet is-12-desktop">
                                <div className="input-group">
                                    <label className="input-group-text" style={{ minWidth: "50%", display: 'block', textAlign: "right", fontWeight: "bold" }} htmlFor={"saldoAtrasado"}>{'Saldo Atrasado'}</label>
                                    <label className="input-group-text" style={{ minWidth: "50%", display: 'block', textAlign: "right" }} >{formatter.format(values.saldoAtrasado)}</label>
                                </div>
                            </div>
                        </div>
                        <div className="columns is-desktop is-tablet">
                            <div className="column is-12-mobile is-12-tablet is-12-desktop">
                                <div className="input-group">
                                    <label className="input-group-text" style={{ minWidth: "50%", display: 'block', textAlign: "right", fontWeight: "bold" }} htmlFor={"DiasAtraso"}>{'Dias de Atraso'}</label>
                                    <label className="input-group-text" style={{ minWidth: "50%", display: 'block', textAlign: "right" }} >{(values.DiasAtraso)}</label>
                                </div>
                            </div>
                        </div>
                        <div className="columns is-desktop is-tablet">
                            <div className="column is-12-mobile is-12-tablet is-12-desktop">
                                <ConveniosPlazos
                                    oidc={props.oidc}
                                    valor={values.Plazos}
                                    name={"Plazos"}
                                    disabled={props.loading}
                                    DiasAtraso={values.DiasAtraso}
                                    Saldo={values.SaldoActual}
                                    unaLinea
                                />
                            </div>
                        </div>
                        <div className="columns is-desktop is-tablet">
                            <div className="column is-12-mobile is-12-tablet is-12-desktop">
                                <ConveniosPorcQuita
                                    oidc={props.oidc}
                                    valor={values.PorcBon}
                                    name={"PorcBon"}
                                    disabled={props.loading}
                                    DiasAtraso={values.DiasAtraso}
                                    Saldo={values.SaldoActual}
                                    unaLinea
                                />
                            </div>
                        </div>
                        <div className="columns is-desktop is-tablet">
                            <div className="column is-12-mobile is-12-tablet is-12-desktop">
                                <CustomFieldCheckbox disabled={props.loading} label="Con Pago Intencion?" name="isPagoIntencion" />
                            </div>
                        </div>
                        <div className="columns is-desktop is-tablet">
                            <div className="column is-12-mobile is-12-tablet is-12-desktop">
                                {values.isPagoIntencion &&
                                    <ActionFieldNumberText disabled={props.loading} label={'Pago Intencíon'} valor={values.PorcPagInt} name={'PorcPagInt'} placeholder={'Ingrese el Pago Intencion'}
                                    // onBlur={() => { ActualizaSaldos(values) }} 
                                    />}
                            </div>
                        </div>
                        {props.loading && <Spinner />}
                        {!props.loading &&
                            <div className="columns is-desktop is-tablet">
                                <div className="column">
                                    <div className="text-end">
                                        <button className="btn btn-secondary waves-effect waves-light"
                                            type="button"
                                            onClick={() => {
                                                setState({
                                                    ...state,
                                                    Detalle: true,
                                                    DatosDetalle: {
                                                        ConvenioID: 0,
                                                        DistribuidorID: values.DistribuidorID,
                                                        ProductoID: 0,
                                                        SucursalID: values.SucursalID,
                                                        PorcPagInt: values.isPagoIntencion ? (values.PorcPagInt / values.SaldoActual) : 0,
                                                        PorcBon: values.PorcBon,
                                                        Plazos: values.Plazos,
                                                    }
                                                })
                                            }}>
                                            Plan Pagos <FaListAlt />
                                        </button>

                                        <button
                                            type="button"
                                            className="ms-2 btn btn-danger waves-effect waves-light"
                                            onClick={props.fnCancelar}
                                        >
                                            Cancelar
                                        </button>

                                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light" >
                                            Aceptar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }
                    </Form>
                )}
            </Formik>

            <ModalWin open={state.Detalle} center large scrollable>
                <ModalWin.Header>
                    <h5 className={MODAL_TITLE_CLASS}>
                        {"Plan de Pagos"}
                    </h5>
                    <button type="button" className="delete" onClick={() => setState({ ...state, Detalle: false })} />
                </ModalWin.Header>
                <ModalWin.Body>
                    {state.Detalle &&
                        <ConvenioDetalle
                            oidc={props.oidc}
                            DistribuidorDesc={props.DistribuidorDesc}
                            Params={state.DatosDetalle}
                        />
                    }
                </ModalWin.Body>
            </ModalWin>
        </>
    )
}
