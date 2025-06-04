/* eslint-disable react/jsx-no-undef */
import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { ActionAsyncSelect, CustomFieldDatePicker2, CustomFieldText, CustomSelect, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { ErrorMessage, Field } from 'formik'
import { toast } from 'react-toastify'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { FormateoDinero } from '../../../../../../global/variables'
import { FaCheck, FaCircle, FaEraser, FaEye, FaLock, FaLockOpen, FaMoneyCheckAlt, FaTrash, FaWindowClose } from 'react-icons/fa'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ReactTooltip from 'react-tooltip'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { skipPartiallyEmittedExpressions } from 'typescript'
import CustomFieldDatePicker from '../../../../../global/CustomFieldDatePicker2'


type CFormType = {
    oidc: IOidc
    Id: number
    initialValues: {
        OrdenID: number,
        SolicitudID: number,
        ApruebaID: number,
        NombreAprueba: string,
        AutorizaID: number,
        NombreAutoriza: string,
        FechaAprobado: string,
        FechaAutorizado: string,
        EstatusID: number,
        EstatusDes: string,
        Pendientes: number,
        AprobadoID: number,
        ProductoID: number,
        DetalleOrden: any[],
    },
    fnCancelar(): any,
    abrirModalCrearMovimiento(): any,
    cbGuardar(item: any, number: any): any,
    cambiarPiezas(item: any, valor: number): any,
    cambiarPendientes(item: any, valor: number): any,
}

export const CForm = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)
    const MySwal = withReactContent(Swal)
    const [cantidad, setCantidad] = React.useState(0)

    const [observaciones, setObservaciones] = React.useState('')
    const columns3: IDataTableColumn[] = [
        {
            name: 'Descripción',
            selector: 'ProductoUniformeDesc',
            sortable: false,
            center: true,
            cell: (rows) => <span className='text-center'>{rows.ProductoUniformeDesc}</span>
        },
        {
            name: 'Piezas Aprobadas',
            selector: 'PiezasAprobadas',
            sortable: false,
            center: true,
            cell: (rows) => <span className='text-center'>{rows.PiezasAprobadas}</span>
        },
        {
            name: 'Piezas Autorizadas',
            selector: 'PiezasAutorizadas',
            sortable: false,
            center: true,
            cell: (rows) => <span className='text-center'>{rows.PiezasAutorizadas}</span>
        },
    ]
    const columns2: IDataTableColumn[] = [
        {
            name: 'Descripción',
            selector: 'ProductoUniformeDesc',
            sortable: false,
            center: true,
            cell: (rows) => <span className='text-center'>{rows.ProductoUniformeDesc}</span>
        },
        {
            name: 'Piezas Aprobadas',
            selector: 'PiezasAprobadas',
            sortable: false,
            center: true,
            cell: (rows) => <span className='text-center'>{rows.PiezasAprobadas}</span>
        },
        {
            name: 'Piezas Autorizadas',
            selector: 'PiezasAutorizadas',
            sortable: false,
            center: true,
            cell: (rows) => <span className='text-center'>{rows.PiezasAutorizadas}</span>
        },
        {
            name: 'Piezas Pendientes',
            selector: 'PiezasPendientes',
            sortable: false,
            center: true,
            cell: (rows) => <span className='text-center'>{rows.PiezasPendientes}</span>
        },
    ]
    const columns1: IDataTableColumn[] = [
        {
            name: 'Descripción',
            selector: 'ProductoUniformeDesc',
            sortable: false,
            center: true,
            cell: (rows) => <span className='text-center'>{rows.ProductoUniformeDesc}</span>
        },
        {
            name: 'Piezas Aprobadas',
            selector: 'PiezasAprobadas',
            sortable: false,
            center: true,
            cell: (rows) => <span className='text-center'>{rows.PiezasAprobadas}</span>
        },
        {
            name: 'Piezas Autorizadas',
            selector: 'PiezasAutorizadas',
            sortable: false,
            center: true,
            cell: (rows) => <span className='text-center'>{rows.PiezasAutorizadas}</span>
        },
        {
            name: 'Cantidad',
            selector: 'PiezasAutorizadas',
            sortable: false,
            center: true,
            cell: (propsss) =>
                <div className="divp" style={(props.initialValues.EstatusID >= 4 || props.initialValues.EstatusID == 2) ? { display: "none" } : {}} >
                    <Field disabled={false}
                        id={"Total" + propsss.OrdenDetalleID} name={"Total" + propsss.OrdenDetalleID}>
                        {
                            (control: any) => (
                                <input
                                    type="number"
                                    className="form-control text-center"
                                    value={control.field.value}
                                    defaultValue="0"
                                    min={0}
                                    pattern="[0-9]*"
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                    disabled={(props.initialValues.EstatusID >= 4) ? true : false}
                                    onBlur={(value: any) => {
                                        props.cambiarPiezas(propsss, parseInt(value.target.value))
                                        if (propsss.PiezasAutorizadas > propsss.PiezasAprobadas) {
                                            MySwal.fire({
                                                icon: 'error',
                                                html: <div><br />
                                                    <h3 className="text-center">Aviso</h3>
                                                    <div className={`modal-body`}>
                                                        <h5 className="text-center">La cantidad no puede ser mayor a las piezas aprobadas, favor de cambiar la cantidad de piezas</h5>
                                                    </div>
                                                </div>,
                                                confirmButtonText: `Ok`,
                                                allowEscapeKey: false,
                                                allowOutsideClick: false,
                                                showConfirmButton: true,
                                                confirmButtonAriaLabel: `Ok`,
                                                confirmButtonColor: `#3085d6`,
                                            });
                                            props.cambiarPiezas(propsss, 0)
                                        }
                                        let resta = (propsss.PiezasAprobadas - value.target.value)
                                        propsss.PiezasPendientes = resta
                                        props.cambiarPendientes(propsss, propsss.PiezasPendientes)
                                    }}
                                    onChange={(value: any) => {
                                        control.form.setFieldValue("Total" + propsss.OrdenDetalleID, value.target.value)
                                    }}
                                />
                            )
                        }
                    </Field>
                </div>
        },
        {
            name: 'Piezas Pendientes',
            selector: 'PiezasPendientes',
            sortable: false,
            center: true,
            cell: (proop) => <span className='text-center'>{proop.PiezasPendientes}</span>
        },
    ]

    const guardarAutoriza = () => {
        if (props.initialValues.DetalleOrden.length > 0) {
            props.cbGuardar(props.initialValues.DetalleOrden, props.initialValues.OrdenID);
        }
    }

    const estatusColor = (estatus: number) => {
        switch (estatus) {
            case 1:
                return 'Orange'
            case 2:
                return 'Red'
            case 3:
                return 'Orange'
            case 4:
                return 'Yellow'
            case 11:
                return 'Orange'
            case 12:
                return 'Yellow'
            case 13:
                return 'Green'
            case 15:
                return 'Orange'
            case 16:
                return 'Orange'
            case 17:
                return 'Green'
            case 18:
                return 'Yellow'
            case 19:
                return 'Yellow'
            default:
                return 'Green'
        }
    }

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            onSubmit={(values: any, { resetForm }) => {
            }}>
            <Form >
                <br /><br />
                <div className="columns is-centered is-mobile is-multiline">
                    <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                        <div style={{ fontSize: "14px" }}>
                            <span><strong>Solicitud:</strong> <span >{props.initialValues.SolicitudID}</span></span>
                        </div>
                    </div>
                    <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                        <div style={{ fontSize: "14px" }}>
                            <span><strong>Aprueba:</strong> <span >{props.initialValues.NombreAprueba}</span></span>
                        </div>
                    </div>
                    <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                        <div style={{ fontSize: "14px" }}>
                            <span ><strong>Estatus:</strong> <span style={{ color: estatusColor(props.initialValues.EstatusID) }} >{props.initialValues.EstatusDes}</span></span>
                        </div>
                    </div>
                </div><br />
                <DataTable
                    data={props.initialValues.DetalleOrden}
                    striped
                    pagination
                    dense
                    noHeader
                    paginationComponentOptions={{ rowsPerPageText: 'Resultados por página:', rangeSeparatorText: 'of', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'Todos' }}
                    responsive
                    keyField={"OrdenDetalleID"}
                    defaultSortField={"OrdenDetalleID"}
                    columns={props.initialValues.EstatusID == 3 ? columns1 : props.initialValues.Pendientes == 1 ? columns2 : columns3}
                />
                {
                    <div className="text-end">
                        {<button type="reset" className="btn btn-danger waves-effect waves-light"
                            onClick={props.fnCancelar} >
                            Cancelar
                        </button>}
                        <button style={(props.initialValues.EstatusID >= 4 || props.initialValues.EstatusID == 2 || props.Id == 0) ? { display: "none" } : {}} type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={() => { guardarAutoriza() }} >Autorizar</button>
                    </div>
                }
            </Form>
        </Formik >
    )
}


