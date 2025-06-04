import React from 'react'
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
import { skipPartiallyEmittedExpressions } from 'typescript'


type CFormType = {
    oidc: IOidc
    Id: number
    initialValues: {
        AprobadoID: number
        , SolicitudID: number
        , SolicitanteID: number
        , NombreSolicita: string
        , ApruebaID: number
        , NombreAprueba: string
        , FechaSolicitud: string
        , FechaAprobado: string
        , EstatusID: number
        , EstatusDes: string
        , Descripcion: string
        , ProductoID: number
        , DetalleAprobacion: any[]
    },
    fnCancelar(): any,
    cambiarPiezas(item: any, valor: number): any,
    cbGuardar(item: any, numer: any): any,
}


export const CForm = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)
    const MySwal = withReactContent(Swal)
    const [cantidad, setCantidad] = React.useState(0)
    const [observaciones, setObservaciones] = React.useState('')

    const columns: IDataTableColumn[] = [
        {
            name: 'Producto',
            selector: 'ProductoUniformeDesc',
            sortable: false,
            center: true,

            cell: (rows) => <span className='text-center'>{rows.ProductoUniformeDesc}</span>

        },
        {
            name: 'Piezas Solicitadas',
            selector: 'PiezasSolicitadas',
            sortable: false,
            center: true,

        },
        {
            name: 'Piezas Aprobadas',
            selector: 'PiezasAprobadas',
            sortable: false,
            center: true,
        },
        {
            name: 'Cantidad',
            selector: 'PiezasAprobadas',
            sortable: false,
            center: true,
            cell: (propss) =>
                <div className="divp" style={(props.initialValues.EstatusID == 1) ? {} : { display: "none" }} >
                    <Field disabled={false} id={"Total" + propss.AprobadoDetalleID} name={"Total" + propss.AprobadoDetalleID}>
                        {
                            (control: any) => (
                                <input
                                    type="number"
                                    step='0'
                                    placeholder='0'
                                    className="form-control text-center"
                                    value={control.field.value}
                                    defaultValue="0"
                                    pattern="[0-9]*"
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                    disabled={(props.initialValues.EstatusID == 1) ? false : true}
                                    onBlur={(value: any) => {
                                        props.cambiarPiezas(propss, parseInt(value.target.value))
                                        if (propss.PiezasAprobadas > propss.PiezasSolicitadas) {
                                            MySwal.fire({
                                                icon: 'error',
                                                html: <div><br />
                                                    <h3 className="text-center">Aviso</h3>
                                                    <div className={`modal-body`}>
                                                        <h5 className="text-center">La cantidad no puede ser mayor a las piezas solicitadas, favor de cambiar la cantidad de piezas</h5>
                                                    </div>
                                                </div>,
                                                confirmButtonText: `Ok`,
                                                allowEscapeKey: false,
                                                allowOutsideClick: false,
                                                showConfirmButton: true,
                                                confirmButtonAriaLabel: `Ok`,
                                                confirmButtonColor: `#3085d6`,
                                            });
                                            props.cambiarPiezas(propss, 0)
                                        }
                                    }}
                                    onChange={(value: any) => {
                                        control.form.setFieldValue("Total" + propss.AprobadoDetalleID, value.target.value)
                                    }}
                                />
                            )
                        }
                    </Field>
                </div>
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
            name: 'Piezas Solicitadas',
            selector: 'PiezasSolicitadas',
            sortable: false,
            center: true,

        },
        {
            name: 'Piezas Aprobadas',
            selector: 'PiezasAprobadas',
            sortable: false,
            center: true,
        },
    ]

    const guardarDetalle = () => {
        if (props.initialValues.DetalleAprobacion.length > 0) {
            props.cbGuardar(props.initialValues.DetalleAprobacion, props.initialValues.AprobadoID);
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
            <Form>
                <br /><br />
                <div className="columns is-centered is-mobile is-multiline">
                    <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                        <div style={{ fontSize: "14px" }}>
                            <span><strong>Solicitud:</strong> <span >{props.initialValues.SolicitudID}</span></span>
                        </div>
                    </div>
                    <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                        <div style={{ fontSize: "14px" }}>
                            <span><strong>Solicita:</strong> <span >{props.initialValues.NombreSolicita}</span></span>
                        </div>
                    </div>
                    <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                        <div style={{ fontSize: "14px" }}>
                            <span ><strong>Estatus:</strong> <span style={{ color: estatusColor(props.initialValues.EstatusID) }} >{props.initialValues.EstatusDes}</span></span>
                        </div>
                    </div>
                </div><br />
                <DataTable
                    data={props.initialValues.DetalleAprobacion}
                    striped
                    pagination
                    dense
                    noHeader
                    paginationComponentOptions={{ rowsPerPageText: 'Resultados por página:', rangeSeparatorText: 'of', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'Todos' }}
                    responsive
                    keyField={"AprobadoDetalleID"}
                    defaultSortField={"AprobadoDetalleID"}
                    columns={props.initialValues.EstatusID == 1 ? columns : columns2}
                />

                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        {<button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>}
                        <button style={(props.initialValues.EstatusID >= 2 || props.Id == 0) ? { display: "none" } : {}} type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={() => { guardarDetalle() }} >Aprobar</button>
                    </div>
                }
            </Form>
        </Formik >
    )
}