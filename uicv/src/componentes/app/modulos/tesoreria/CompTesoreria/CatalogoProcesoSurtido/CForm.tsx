import React, { useState, useEffect, useRef } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { ActionAsyncSelect, CustomFieldText, CustomSelect, Spinner } from '../../../../../global'
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
import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import ReactInputDateMask from 'react-input-date-mask';

type CFormType = {
    oidc: IOidc
    Id: number,
    initialValues: {
        SurtidoID: number,
        SolicitudID: number,
        AutorizaID: number,
        NombreAutoriza: string,
        SurteID: number,
        NombreSurte: string,
        CancelaID: number,
        NombreCancela: string,
        FechaAutorizado: string,
        FechaSurtido: string,
        FechaCancelacion: string,
        EstatusID: number,
        EstatusDes: string,
        Descripcion: string,
        Cancelada: number,
        ReOrden: number,
        OrdenID: number,
        ReOrdenID: number,
        ComprobanteDoc: string,
        DocumentoID: number,
        ComprobanteFirma: string,
        FirmaDocID: number,
        ProductoID: number,
        EmpresaId: number,
        Pendientes: number,
        DetalleSurtido: any[]
    },
    fnCancelar(): any,
    cbGuardar(item: any, number: any, tipo: any, estatus: any): any
    cbCancelar(item: any, number: any): any
    cambiarFecha(item: any, fecha: string): any,
    cambiarObservaciones(item: any, value: string): any,
}


export const CForm = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)
    const MySwal = withReactContent(Swal)
    const [cantidad, setCandidad] = React.useState(0)
    const [observaciones, setObservaciones] = React.useState('')

    const columns4: IDataTableColumn[] = [
        {
            name: 'Producto',
            selector: 'ProductoUniformeDesc',
            sortable: false,
            center: true,
        },
        {
            name: 'Piezas Autorizadas',
            selector: 'PiezasAutorizadas',
            sortable: false,
            center: true,
        },
        {
            name: 'Piezas Surtidas',
            selector: 'PiezasSurtidas',
            sortable: false,
            center: true,
        },
    ]

    const columns3: IDataTableColumn[] = [
        {
            name: 'Descripción',
            selector: 'ProductoUniformeDesc',
            sortable: false,
            center: true,
        },
        {
            name: 'Piezas Autorizadas',
            selector: 'PiezasAutorizadas',
            sortable: false,
            center: true,
        },
        {
            name: 'Piezas Surtidas',
            selector: 'PiezasSurtidas',
            sortable: false,
            center: true,
        },
        {
            name: 'Observaciones',
            selector: 'Observaciones',
            sortable: false,
            center: true,
        },
        {
            name: 'Fecha Compromiso',
            selector: 'FechaCompromiso',
            sortable: false,
            center: true,
        },
    ]

    const columns2: IDataTableColumn[] = [
        {
            name: 'Decripción',
            selector: 'ProductoUniformeDesc',
            sortable: false,
            center: true,
        },
        {
            name: 'Piezas Autorizadas',
            selector: 'PiezasAutorizadas',
            sortable: false,
            center: true,
        },
        {
            name: 'Piezas Surtidas',
            selector: 'PiezasSurtidas',
            sortable: false,
            center: true,
        },
        {
            name: 'Piezas Pendientes',
            selector: 'PiezasPendientes',
            sortable: false,
            center: true,
        },
    ]

    const columns1: IDataTableColumn[] = [
        {
            name: 'Corte',
            selector: 'Corte',
            sortable: false,
            center: true,
        },
        {
            name: 'Piezas Autorizadas',
            selector: 'PiezasAutorizadas',
            sortable: false,
            center: true,
        },
        {
            name: 'Piezas Surtidas',
            selector: 'PiezasSurtidas',
            sortable: false,
            center: true,
        },
        {
            name: 'Piezas Pendientes',
            selector: 'PiezasPendientes',
            sortable: false,
            center: true,
            cell: (rows) => <span className='text-center'>{rows.PiezasPendientes == undefined ? 0 : rows.PiezasPendientes}</span>
        },
        {
            name: 'Observaciones',
            selector: 'Observaciones',
            sortable: false,
            center: true,
            cell: (propsss) =>
                <div className="divp" style={propsss.PiezasPendientes == 0 || props.initialValues.EstatusID != 11 ? { display: 'none' } : {}}>
                    <Field disabled={false} id={"ob" + propsss.SurtidoDetalleID} name={"ob" + propsss.SurtidoDetalleID}>
                        {
                            (control: any) => (
                                <input
                                    type="text"
                                    className="form-control text-center"
                                    value={control.field.value}
                                    onBlur={(value: any) => {
                                        props.cambiarObservaciones(propsss, value.target.value)
                                    }}
                                    onChange={(value: any) => {
                                        control.form.setFieldValue("ob" + propsss.SurtidoDetalleID, value.target.value)
                                    }}
                                />
                            )
                        }
                    </Field>
                </div>
        },
        {
            name: 'Fecha Compromiso',
            selector: 'FechaCompromiso',
            sortable: false,
            center: true,
            cell: (proops) =>
                <div style={proops.PiezasPendientes == 0 || props.initialValues.EstatusID != 11 ? { display: 'none' } : {}}>
                    <Field disabled={true} id={"fecha" + proops.SurtidoDetalleID} name={"fecha" + proops.SurtidoDetalleID}  >
                        {
                            (control: any) => (
                                <input
                                    type="text"
                                    placeholder='dd/mm/yyyy'
                                    className="form-control text-center"
                                    value={control.field.value}
                                    pattern="[0-9]*"
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                    onBlur={(value: any) => {
                                        props.cambiarFecha(proops, value.target.value)
                                    }}
                                    onChange={(value: any) => {
                                        control.form.setFieldValue("fecha" + proops.SurtidoDetalleID, value.target.value)
                                    }} />
                            )
                        }
                    </Field>
                </div>
        },
    ]

    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: props.initialValues,
            Id: undefined
        },
        startDate: null,
        endDate: null
    })

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

    const guardarDetalle = () => {
        if (props.initialValues.DetalleSurtido.length > 0) {
            props.cbGuardar(props.initialValues.DetalleSurtido, props.initialValues.SurtidoID, props.initialValues.Pendientes, props.initialValues.EstatusID)
        }
    }
    const cancelarDetalle = () => {
        if (props.initialValues.DetalleSurtido.length > 0) {
            props.cbCancelar(props.initialValues.DetalleSurtido, props.initialValues.SurtidoID)
        }
    }

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({})}
            onSubmit={(values: any, { resetForm }) => { }}>
            <Form>{
                props.initialValues.EstatusID == 15 ?
                    <><br /><br /><div className="columns is-centered is-mobile is-multiline">
                        <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                            <div style={{ fontSize: "14px" }}>
                                <span><strong>Solicitud:</strong> <span>{props.initialValues.SolicitudID}</span></span>
                            </div>
                        </div>
                        <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                            <div style={{ fontSize: "14px" }}>
                                <span><strong>ReOrden:</strong> <span>{props.initialValues.ReOrdenID}</span></span>
                            </div>
                        </div>
                        <br />
                        <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                            <div style={{ fontSize: "14px" }}>
                                <span><strong>Autoriza:</strong> <span>{props.initialValues.NombreAutoriza}</span></span>
                            </div>
                        </div>
                        <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                            <div style={{ fontSize: "14px" }}>
                                <span><strong>Estatus:</strong> <span style={{ color: estatusColor(props.initialValues.EstatusID) }}>{props.initialValues.EstatusDes}</span></span>
                            </div>
                        </div>
                    </div><br /></>
                    : props.initialValues.EstatusID == 16 ?
                        <><br /><br /><div className="columns is-centered is-mobile is-multiline">
                            <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                <div style={{ fontSize: "14px" }}>
                                    <span><strong>Solicitud:</strong> <span>{props.initialValues.SolicitudID}</span></span>
                                </div>
                            </div>
                            <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                <div style={{ fontSize: "14px" }}>
                                    <span><strong>Orden:</strong> <span>{props.initialValues.OrdenID}</span></span>
                                </div>
                            </div>
                            <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                <div style={{ fontSize: "14px" }}>
                                    <span><strong>ReOrden:</strong> <span>{props.initialValues.ReOrdenID}</span></span>
                                </div>
                            </div>
                            <br />
                            <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                <div style={{ fontSize: "14px" }}>
                                    <span><strong>Autoriza:</strong> <span>{props.initialValues.NombreAutoriza}</span></span>
                                </div>
                            </div>
                            <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                <div style={{ fontSize: "14px" }}>
                                    <span><strong>Estatus:</strong> <span style={{ color: estatusColor(props.initialValues.EstatusID) }}>{props.initialValues.EstatusDes}</span></span>
                                </div>
                            </div>
                        </div><br /></>
                        : props.initialValues.EstatusID == 12 && props.initialValues.Pendientes == 1 ?
                            <><br /><br /><div className="columns is-centered is-mobile is-multiline">
                                <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                    <div style={{ fontSize: "14px" }}>
                                        <span><strong>Solicitud:</strong> <span>{props.initialValues.SolicitudID}</span></span>
                                    </div>
                                </div>
                                <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                    <div style={{ fontSize: "14px" }}>
                                        <span><strong>Orden:</strong> <span>{props.initialValues.OrdenID}</span></span>
                                    </div>
                                </div>
                                <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                    <div style={{ fontSize: "14px" }}>
                                        <span><strong>ReOrden:</strong> <span>{props.initialValues.ReOrdenID}</span></span>
                                    </div>
                                </div>
                                <br />
                                <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                    <div style={{ fontSize: "14px" }}>
                                        <span><strong>Autoriza:</strong> <span>{props.initialValues.NombreAutoriza}</span></span>
                                    </div>
                                </div>
                                <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                    <div style={{ fontSize: "14px" }}>
                                        <span><strong>Estatus:</strong> <span style={{ color: estatusColor(props.initialValues.EstatusID) }}>{props.initialValues.EstatusDes}</span></span>
                                    </div>
                                </div>
                            </div><br /></>
                            : props.initialValues.EstatusID == 12 && props.initialValues.Pendientes == 0 && props.initialValues.ReOrden == 1 ?
                                <><br /><br /><div className="columns is-centered is-mobile is-multiline">
                                    <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                        <div style={{ fontSize: "14px" }}>
                                            <span><strong>Solicitud:</strong> <span>{props.initialValues.SolicitudID}</span></span>
                                        </div>
                                    </div>
                                    <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                        <div style={{ fontSize: "14px" }}>
                                            <span><strong>ReOrden:</strong> <span>{props.initialValues.ReOrdenID}</span></span>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                        <div style={{ fontSize: "14px" }}>
                                            <span><strong>Autoriza:</strong> <span>{props.initialValues.NombreAutoriza}</span></span>
                                        </div>
                                    </div>
                                    <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                        <div style={{ fontSize: "14px" }}>
                                            <span><strong>Estatus:</strong> <span style={{ color: estatusColor(props.initialValues.EstatusID) }}>{props.initialValues.EstatusDes}</span></span>
                                        </div>
                                    </div>
                                </div><br /></>
                                :
                                <><br /><br /><div className="columns is-centered is-mobile is-multiline">
                                    <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                        <div style={{ fontSize: "14px" }}>
                                            <span><strong>Solicitud:</strong> <span>{props.initialValues.SolicitudID}</span></span>
                                        </div>
                                    </div>
                                    <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                        <div style={{ fontSize: "14px" }}>
                                            <span><strong>Orden:</strong> <span>{props.initialValues.OrdenID}</span></span>
                                        </div>
                                    </div>
                                    <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                        <div style={{ fontSize: "14px" }}>
                                            <span><strong>Autoriza:</strong> <span>{props.initialValues.NombreAutoriza}</span></span>
                                        </div>
                                    </div>
                                    <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                        <div style={{ fontSize: "14px" }}>
                                            <span><strong>Estatus:</strong> <span style={{ color: estatusColor(props.initialValues.EstatusID) }}>{props.initialValues.EstatusDes}</span></span>
                                        </div>
                                    </div>
                                </div><br /></>

            }
                <DataTable
                    data={props.initialValues.DetalleSurtido}
                    striped
                    pagination
                    dense
                    noHeader
                    paginationComponentOptions={{ rowsPerPageText: 'Resultados por página:', rangeSeparatorText: 'of', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'Todos' }}
                    responsive
                    keyField={"SurtidoDetalleID"}
                    defaultSortField={"SurtidoDetalleID"}
                    columns={props.initialValues.EstatusID == 11 ?
                        props.initialValues.Pendientes == 0 ?
                            columns4
                            :
                            columns1
                        :
                        props.initialValues.EstatusID == 15 ?
                            columns3
                            :
                            props.initialValues.EstatusID == 12 && props.initialValues.Pendientes == 1 ?
                                columns2
                                :
                                props.initialValues.EstatusID == 16 ?
                                    columns2
                                    :
                                    columns4
                    }
                /><br />
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button style={props.initialValues.EstatusID != 11 ? { display: "none" } : {}} disabled={false} type="button" className="ms-2 btn btn-danger waves-effect waves-light" onClick={() => { cancelarDetalle() }} >
                            Cancelar Orden
                        </button>
                        <button type="button" className="ms-2 btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cerrar
                        </button>
                        <button style={props.initialValues.EstatusID == 11 || props.initialValues.EstatusID == 15 ? {} : { display: "none" }} disabled={props.initialValues.FirmaDocID == undefined || props.initialValues.DocumentoID == undefined ? true : false} type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={() => { guardarDetalle() }} >
                            Surtir
                        </button>
                    </div>
                }
            </Form>
        </Formik>
    )
}

// function cbCancelar(): React.MouseEventHandler<HTMLButtonElement> | undefined {
//     throw new Error('Function not implemented.')
// }
