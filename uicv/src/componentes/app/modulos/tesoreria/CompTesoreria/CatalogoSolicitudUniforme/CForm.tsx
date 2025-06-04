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


type CFormType = {
    oidc: IOidc
    Id: number,
    initialValues: {
        SolicitudID: number,
        SolicitanteID: number,
        NombreSolicita: string,
        RecepcionaID: number,
        NombreRecepciona: string,
        CancelaID: number,
        NombreCancela: string,
        FechaSolicitud: string,
        FechaRecepcion: string,
        FechaCancelacion: string,
        EstatusID: number,
        EstatusDes: string,
        Piezas: number,
        Descripcion: string,
        OrdenID: number,
        ReOrdenID: number,
        RecepcionID: number,
        Recepcionado: number,
        Aprobado: number,
        RecepcionParcialID: number,
        DevolucionID: number,
        ProductoID: number,
        EmpresaId: number,
        DetalleSolicitud: any[],
        ProductoUniformeID: number,
    },
    agregarConjunto(item: any): any,
    eliminarConjunto(item: any): any,
    fnCancelar(): any,
    optionsCorte: { value: number, label: string }[],
    cbGuardar(item: any): any
}


export const CForm = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)
    const MySwal = withReactContent(Swal)
    const [cantidad, setCandidad] = React.useState(0)
    const [observaciones, setObservaciones] = React.useState('')
    const columns1: IDataTableColumn[] = [
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
            cell: (rows) => <span className='text-center'>{rows.PiezasSolicitadas}</span>
        },
        {
            center: true,
            name: 'Acciones',
            selector: 'Acciones',
            sortable: false,
            style: { display: 'block;' },
            cell: (propss) =>
                <div className='text-center' style={{ overflowY: 'auto', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                    {<>
                        <button data-tip data-for="Btn_Eliminar" style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"} onClick={() => {
                            props.eliminarConjunto(propss);
                        }}>
                            <FaTrash />
                            <ReactTooltip id="Btn_Eliminar" type="info" effect="solid">
                                Eliminar
                            </ReactTooltip>

                        </button>
                    </>}
                </div>
        },
    ]

    const columns2: IDataTableColumn[] = [
        {
            name: 'Descripción',
            selector: 'ProductoUniformeDesc',
            sortable: false,
            center: true,
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
            name: 'Piezas Recepcionadas',
            selector: 'PiezasRecepcionadas',
            sortable: false,
            center: true,
            cell: (rows) => <span className='text-center'>{rows.PiezasRecepcionadas == undefined ? 'N/R' : rows.PiezasRecepcionadas}</span>
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

    const columns4: IDataTableColumn[] = [
        {
            name: 'Corte',
            selector: 'ProductoUniformeDesc',
            sortable: false,
            center: true,
        },
        {
            name: 'Piezas Solicitadas',
            selector: 'PiezasSolicitadas',
            sortable: false,
            center: true,
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
        if (props.initialValues.DetalleSolicitud.length > 0) {
            setLoading(true)
            let a = {
                Descripcion: observaciones,
                DetalleSolicitud: props.initialValues.DetalleSolicitud,
            }
            Funciones.FNGuardarSolicitud(props.oidc, a)
                .then((res: any) => {
                    setLoading(false)
                    props.cbGuardar(res)
                    setObservaciones('')
                }
                ).catch((err: any) => {
                    setLoading(false)
                    toast.error("Hubo un error al guardar la solicitud. Intente nuevamente")
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
            validationSchema={Yup.object().shape({
                ProductoUniformeID: Yup.number().required("Campo Obligatorio").moreThan(0, "Seleccione un ProductoUniformeDesc"),
                PiezasSolicitadas: Yup.number().required("Campo Obligatorio").moreThan(0, "Ingrese un número entero positivo de piezas"),
                Descripcion: Yup.string().required("Campo Obligatorio").max(255, "No se permiten mas caracteres"),
            })}
            onSubmit={(values: any, { resetForm }) => {
                let ProductoUniformeDesc = props.optionsCorte.find((res: any) => {
                    return res.value === values.ProductoUniformeID
                })
                let a = {
                    Identificador: cantidad + 1,
                    ProductoUniformeID: values.ProductoUniformeID,
                    ProductoUniformeDesc: ProductoUniformeDesc?.label,
                    PiezasSolicitadas: values.PiezasSolicitadas,
                }
                console.log("Valor", a)
                props.agregarConjunto(a);
                setCandidad(cantidad + 1);
                resetForm({ values: { ...values, PiezasSolicitadas: 0, ProductoUniformeID: 0 } });

            }}>
            <Form>
                <div style={props.Id != 0 ? { display: "none" } : {}}>
                    <div className="columns is-centered is-mobile is-multiline">
                        <div className="column text-center is-full-desktop is-full-tablet is-full-mobile">
                            <div className="mb-3">
                                <label className="form-label mb-0" htmlFor='Descripcion'>  Observaciones de la Solicitud</label>
                                <Field
                                    type="textarea"
                                    disabled={loading}
                                    className="form-control"
                                    rows={3}
                                    id="Descripcion"
                                    name="Descripcion"
                                    placeholder="Observaciones"
                                    multiple={true}
                                    onChangeCapture={e => (setObservaciones(e.target.value))}
                                />
                                <ErrorMessage component="div" name="Descripcion" className="text-danger" />
                            </div>
                        </div>
                        <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                            <div className="mb-3">
                                <label className="form-label mb-0" htmlFor={"ProductoUniformeID"}>Cortes:</label>
                                <Field name={"ProductoUniformeID"} className="form-select"  >
                                    {(control: any) => (
                                        <select
                                            className="form-select"
                                            value={control.field.value}
                                            onChange={(value: any) => {
                                                control.form.setFieldValue("ProductoUniformeID", parseInt(value.target.value))
                                            }}
                                            disabled={loading}
                                            id={"ProductoUniformeID"}
                                            name={"ProductoUniformeID"}
                                        >
                                            <option value="0">{"Selecciona un corte"}</option>
                                            {props.optionsCorte.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                        </select>
                                    )}
                                </Field>
                                <ErrorMessage component="div" name={"ProductoUniformeID"} className="text-danger" />
                            </div>
                        </div>
                        {/* <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                            <div className="mb-3">
                                <label className="form-label mb-0" htmlFor={"TipoID"}>Tipo:</label>
                                <Field name={"TipoID"} className="form-select"  >
                                    {(control: any) => (
                                        <select
                                            className="form-select"                                                               
                                            value={control.field.value}
                                            onChange={(value: any) => {
                                                control.form.setFieldValue("TipoID", parseInt(value.target.value))
                                            }}
                                            disabled={loading}
                                            id={"TipoID"}
                                            name={"TipoID"}
                                        >
                                            <option value="0">{"Selecciona un tipo"}</option>
                                            {props.optionsTipos.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                        </select>
                                    )}
                                </Field>
                                <ErrorMessage component="div" name={"TipoID"} className="text-danger" />
                            </div>
                        </div> */}
                        <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                            <div className="mb-3">
                                <label className="form-label mb-0" htmlFor={"PiezasSolicitadas"}>Piezas:</label>

                                <Field disabled={loading} id="PiezasSolicitadas" name="PiezasSolicitadas">
                                    {
                                        (control: any) => (
                                            <input
                                                step=''
                                                min=''
                                                defaultValue={0}
                                                id="PiezasSolicitadas"
                                                placeholder='Número de Piezas'
                                                className="form-control"
                                                disabled={loading}
                                                onKeyPress={(event) => {
                                                    if (!/[0-9]/.test(event.key)) {
                                                        event.preventDefault();
                                                    }
                                                }}
                                                value={control.field.value}
                                                type="text"
                                                pattern="[0-9]*"

                                                onChange={(value: any) => {
                                                    control.form.setFieldValue("PiezasSolicitadas", value.target.value)

                                                }}
                                            />
                                        )
                                    }
                                </Field>
                                <ErrorMessage component="div" name={"PiezasSolicitadas"} className="text-danger" />
                            </div>
                        </div>

                    </div>
                    <div className="text-end">
                        <button type="submit" className="button is-small is-success is-outlined is-responsive">Agregar</button>
                    </div>
                </div><br /><br />
                <div style={props.Id == 0 ? { display: "none" } : {}} className="columns is-centered is-mobile is-multiline">
                    <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                        <div style={{ fontSize: "14px" }}>
                            <span><strong>Solicitud: </strong> <span >{props.initialValues.SolicitudID}</span></span>
                        </div>
                    </div>
                    <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                        <div style={{ fontSize: "14px" }}>
                            <span><strong>Solicita: </strong> <span >{props.initialValues.NombreSolicita}</span></span>
                        </div>
                    </div>
                    <div className="column text-center is-one-third-desktop is-full-tablet is-full-mobile">
                        <div style={{ fontSize: "14px" }}>
                            <span ><strong>Estatus: </strong><span style={{ color: estatusColor(props.initialValues.EstatusID) }} >{props.initialValues.EstatusDes}</span></span>
                        </div>
                    </div>
                </div><br />
                <DataTable
                    data={props.initialValues.DetalleSolicitud}
                    striped
                    pagination
                    dense
                    noHeader
                    paginationComponentOptions={{ rowsPerPageText: 'Resultados por página:', rangeSeparatorText: 'of', noRowsPerPage: false, selectAllRowsItem: false, selectAllRowsItemText: 'Todos' }}
                    responsive
                    keyField={"SolicitudDetalleID"}
                    defaultSortField={"SolicitudDetalleID"}
                    columns={props.Id == 0 ? columns1 : props.initialValues.Recepcionado == 1 ? columns2 : props.initialValues.Aprobado == 1 ? columns3 : columns4}
                />

                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        {<button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>}
                        <button style={props.Id != 0 ? { display: "none" } : {}} disabled={false} type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={() => { guardarDetalle() }} >Solicitar</button>
                    </div>
                }
            </Form>
        </Formik >
    )
}