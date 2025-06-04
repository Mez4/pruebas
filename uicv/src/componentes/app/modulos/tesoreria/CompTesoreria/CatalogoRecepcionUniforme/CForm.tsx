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
import moment from 'moment'


type CFormType = {
    oidc: IOidc
    Id: number,
    initialValues: {
        RecepcionID: number
        , SolicitudID: number
        , SurteID: number
        , NombreSurte: string
        , RecibeID: number
        , NombreRecibe: string
        , CancelaID: number
        , NombreCancela: string
        , DevuelveID: number
        , NombreDevolucion: string
        , FechaSurtido: string
        , FechaRecepcion: string
        , FechaCancelacion: string
        , FechaDevolucion: string
        , EstatusID: number
        , EstatusDes: string
        , Descripcion: string
        , Cancelada: number
        , RecepcionParcial: number
        , Devolucion: number
        , OrdenID: number
        , ReOrdenID: number
        , SurtidoID: number
        , DevolucionID: number
        , ComprobanteDoc: string
        , DocumentoID: number
        , ComprobanteFirma: string
        , FirmaDocID: number
        , ProductoID: number
        , EmpresaId: number
        , Pendientes: number
        , DetalleRecepcion: any[],
    },
    fnCancelar(): any,
    abrirModalCrearMovimiento(): any,
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    cambiarPiezas(item: any, valor: number): any,
    cambiarPendientes(item: any, valor: number): any,
}


export const CForm = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)
    const MySwal = withReactContent(Swal)
    console.log(props.initialValues.DetalleRecepcion)
    const [cantidad, setCandidad] = React.useState(0)
    const [observaciones, setObservaciones] = React.useState('')
    const columns1: IDataTableColumn[] = [
        {
            name: 'Descripcion',
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
            cell: (rows) => <span className='text-center'>{rows.PiezasSolicitadas}</span>
        },
        {
            name: 'Piezas Surtidas',
            selector: 'PiezasSurtidas',
            sortable: false,
            center: true,
            cell: (rows) => <span className='text-center'>{rows.PiezasSurtidas}</span>
        },
        {
            name: 'Piezas Recepcionadas',
            selector: 'PiezasRecepcionadas',
            sortable: false,
            center: true,
            cell: (rows) => <span className='text-center'>{rows.PiezasRecepcionadas}</span>
        },
        {
            name: 'Piezas en existencia',
            selector: 'Existencia',
            sortable: false,
            center: true,
            cell: (rows) => <span className='text-center'>{rows.Existencia}</span>
        },
        {
            name: 'Cantidad',
            selector: 'PiezasRecepcionadas',
            sortable: false,
            center: true,
            cell: (propsss) =>
                <div className="divp" style={(props.initialValues.EstatusID == 12) ? {} : { display: "none" }} >
                    <Field disabled={false}
                        id={"Total" + propsss.RecepcionDetalleID} name={"Total" + propsss.RecepcionDetalleID}>
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
                                    disabled={false}
                                    onBlur={(value: any) => {
                                        props.cambiarPiezas(propsss, parseInt(value.target.value))
                                        if (propsss.PiezasRecepcionadas > propsss.PiezasSurtidas) {
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
                                        if (propsss.PiezasRecepcionadas > propsss.Existencia) {
                                            MySwal.fire({
                                                icon: 'error',
                                                html: <div><br />
                                                    <h3 className="text-center">Aviso</h3>
                                                    <div className={`modal-body`}>
                                                        <h5 className="text-center">La cantidad no puede ser mayor a las piezas en existencia, favor de cambiar la cantidad de piezas</h5>
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
                                        let resta = (propsss.PiezasSurtidas - value.target.value)
                                        propsss.PiezasPendientesRecepcion = resta
                                        props.cambiarPendientes(propsss, propsss.PiezasPendientesRecepcion)
                                    }}
                                    onChange={(value: any) => {
                                        control.form.setFieldValue("Total" + propsss.RecepcionDetalleID, value.target.value)
                                    }}
                                />
                            )
                        }
                    </Field>
                </div>
        },
        {
            name: 'Pendientes Recepcion',
            selector: 'PiezasPendientesRecepcion',
            sortable: false,
            center: true,
            cell: (rows) => <span className='text-center'>{rows.PiezasPendientesRecepcion < 0 ? 0 : rows.PiezasPendientesRecepcion}</span>
        },
    ]

    const columns2: IDataTableColumn[] = [
        {
            name: 'Descripcion',
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
            cell: (rows) => <span className='text-center'>{rows.PiezasSolicitadas}</span>
        },
        {
            name: 'Piezas Surtidas',
            selector: 'PiezasSurtidas',
            sortable: false,
            center: true,
            cell: (rows) => <span className='text-center'>{rows.PiezasSurtidas}</span>
        },
        {
            name: 'Pendientes',
            selector: 'PiezasPendientes',
            sortable: false,
            center: true,
            cell: (rows) => <span className='text-center'>{rows.PiezasPendientes < 0 ? 0 : rows.PiezasPendientes}</span>
        },
        {
            name: 'Piezas Recepcionadas',
            selector: 'PiezasRecepcionadas',
            sortable: false,
            center: true,
            cell: (rows) => <span className='text-center'>{rows.PiezasRecepcionadas}</span>
        },
        {
            name: 'Cantidad',
            selector: 'PiezasRecepcionadas',
            sortable: false,
            center: true,
            cell: (propsss) =>
                <div className="divp" style={(props.initialValues.EstatusID == 12) ? {} : { display: "none" }} >
                    <Field disabled={false}
                        id={"Total" + propsss.RecepcionDetalleID} name={"Total" + propsss.RecepcionDetalleID}>
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
                                    disabled={false}
                                    onBlur={(value: any) => {
                                        props.cambiarPiezas(propsss, parseInt(value.target.value))
                                        if (propsss.PiezasRecepcionadas > propsss.PiezasSurtidas) {
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
                                        let resta = (propsss.PiezasSurtidas - value.target.value)
                                        propsss.PiezasPendientesRecepcion = resta
                                        props.cambiarPendientes(propsss, propsss.PiezasPendientesRecepcion)
                                    }}
                                    onChange={(value: any) => {
                                        control.form.setFieldValue("Total" + propsss.RecepcionDetalleID, value.target.value)
                                    }}
                                />
                            )
                        }
                    </Field>
                </div>
        },
        {
            name: 'Pendientes Recepcion',
            selector: 'PiezasPendientesRecepcion',
            sortable: false,
            center: true,
            cell: (rows) => <span className='text-center'>{rows.PiezasPendientesRecepcion < 0 ? 0 : rows.PiezasPendientesRecepcion}</span>
        },
    ]

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
        if (props.initialValues.DetalleRecepcion.length > 0) {
            setLoading(true)
            let a = {
                Descripcion: observaciones,
                RecepcionID: props.initialValues.RecepcionID,
                DetalleRecepcion: props.initialValues.DetalleRecepcion,
            }
            Funciones.FNGuardarSolicitudUniforme(props.oidc, a)
                .then((res: any) => {
                    setLoading(false)
                    props.cbGuardar(res)
                    setObservaciones('')
                }
                ).catch((err: any) => {
                    setLoading(false)
                    toast.error("Hubo un error al guardar la solicitud. Intente nuevamente.")
                    console.log(err)
                })
        } else {
            MySwal.fire(
                {
                    icon: 'error',
                    html: <div><br />
                        <h3 className="text-center">Aviso</h3>
                        <div className={`modal-body`}>
                            <h5 className="text-center">Debe agregar al menos un detalle a la solicitud'.</h5>
                        </div>
                    </div>,
                    confirmButtonText: `Ok`,
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    showConfirmButton: true,
                    confirmButtonAriaLabel: `Ok`,
                    confirmButtonColor: `#3085d6`,
                }
            );
        }
    }

    return (

        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({})}
            onSubmit={(values: any, { resetForm }) => { }}>
            <Form>{
                props.initialValues.EstatusID == 12 && props.initialValues.Pendientes == 1 ?
                    <><br />
                        <div className="columns is-centered is-mobile is-multiline">
                            <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                <div style={{ fontSize: "14px" }}>
                                    <span><strong>N° Solicitud: </strong> <span >{props.initialValues.SolicitudID}</span></span>
                                </div>
                            </div>
                            <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                <div style={{ fontSize: "14px" }}>
                                    <span><strong>N° Orden: </strong> <span >{props.initialValues.OrdenID}</span></span>
                                </div>
                            </div>
                            <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                <div style={{ fontSize: "14px" }}>
                                    <span><strong>N° ReOrden: </strong> <span >{props.initialValues.ReOrdenID}</span></span>
                                </div>
                            </div>
                            <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                <div style={{ fontSize: "14px" }}>
                                    <span><strong>N° Surtido: </strong> <span >{props.initialValues.SurtidoID}</span></span>
                                </div>
                            </div>
                            <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                <div style={{ fontSize: "14px" }}>
                                    <span><strong>Surtio: </strong> <span >{props.initialValues.NombreSurte}</span></span>
                                </div>
                            </div>
                            <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                <div style={{ fontSize: "14px" }}>
                                    <span ><strong>Estatus: </strong><span style={{ color: estatusColor(props.initialValues.EstatusID) }} >{props.initialValues.EstatusDes}</span></span>
                                </div>
                            </div>
                        </div><br /></>
                    : props.initialValues.EstatusID == 12 && props.initialValues.ReOrdenID > 0 ?
                        <><br />
                            <div className="columns is-centered is-mobile is-multiline">
                                <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                    <div style={{ fontSize: "14px" }}>
                                        <span><strong>N° Solicitud: </strong> <span >{props.initialValues.SolicitudID}</span></span>
                                    </div>
                                </div>
                                <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                    <div style={{ fontSize: "14px" }}>
                                        <span><strong>N° Surtido: </strong> <span >{props.initialValues.SurtidoID}</span></span>
                                    </div>
                                </div>
                                <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                    <div style={{ fontSize: "14px" }}>
                                        <span><strong>N° ReOrden: </strong> <span >{props.initialValues.ReOrdenID}</span></span>
                                    </div>
                                </div>
                                <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                    <div style={{ fontSize: "14px" }}>
                                        <span><strong>Surtio: </strong> <span >{props.initialValues.NombreSurte}</span></span>
                                    </div>
                                </div>
                                <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                    <div style={{ fontSize: "14px" }}>
                                        <span ><strong>Estatus: </strong><span style={{ color: estatusColor(props.initialValues.EstatusID) }} >{props.initialValues.EstatusDes}</span></span>
                                    </div>
                                </div>
                            </div><br /></>
                        :
                        <><br />
                            <div className="columns is-centered is-mobile is-multiline">
                                <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                    <div style={{ fontSize: "14px" }}>
                                        <span><strong>N° Solicitud: </strong> <span >{props.initialValues.SolicitudID}</span></span>
                                    </div>
                                </div>
                                <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                    <div style={{ fontSize: "14px" }}>
                                        <span><strong>N° Surtido: </strong> <span >{props.initialValues.SurtidoID}</span></span>
                                    </div>
                                </div>
                                <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                    <div style={{ fontSize: "14px" }}>
                                        <span><strong>N° Orden: </strong> <span >{props.initialValues.OrdenID}</span></span>
                                    </div>
                                </div>
                                <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                    <div style={{ fontSize: "14px" }}>
                                        <span><strong>Surtio: </strong> <span >{props.initialValues.NombreSurte}</span></span>
                                    </div>
                                </div>
                                <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                                    <div style={{ fontSize: "14px" }}>
                                        <span ><strong>Estatus: </strong><span style={{ color: estatusColor(props.initialValues.EstatusID) }} >{props.initialValues.EstatusDes}</span></span>
                                    </div>
                                </div>
                            </div><br /></>
            }
                <DataTable
                    data={props.initialValues.DetalleRecepcion}
                    striped
                    pagination
                    dense
                    noHeader
                    paginationComponentOptions={{ rowsPerPageText: 'Resultados por página:', rangeSeparatorText: 'of', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'Todos' }}
                    responsive
                    keyField={"RecepcionDetalleID"}
                    defaultSortField={"RecepcionDetalleID"}
                    columns={props.initialValues.Pendientes == 0 && props.initialValues.ReOrdenID >= 0 ? columns1 : columns2}
                />

                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        {<button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>}
                        <button style={props.Id != 0 ? {} : {}} disabled={props.initialValues.EstatusID == 13 || props.initialValues.EstatusID == 9
                            ? true : false} type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={() => { guardarDetalle() }} >Ok</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}