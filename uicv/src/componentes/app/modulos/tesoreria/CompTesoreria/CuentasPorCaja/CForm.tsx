import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { valueContainerCSS } from 'react-select/src/components/containers'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { valueEventAriaMessage } from 'react-select/src/accessibility'
import DataTable from 'react-data-table-component'
import { FaCheckSquare, FaCircle, FaPencilAlt, FaRegSquare, FaTrash, FaTrashAlt, FaUnlink } from 'react-icons/fa'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import ReactTooltip from 'react-tooltip';
import withReactContent from 'sweetalert2-react-content'
import ArrayList from '../../../../../global/ArrayList'
type CFormType = {
    Seguridad: IOidc,
    Id?: number,
    initialValues: {
        CajaID: number,
        NombreCaja: string,
        NumeroCuentas: number,
        Producto: string,
        Cuentas: any[]
    },
    OptionsCaja: { value: number, label: string, sucursal: number }[],
    OptionsCuentasBanco: { value: number, label: string, producto: string }[],
    fnCancelar(): any,
    cbActualizar(item: any): any,
    agregarTipoOperacionLista(item: any, cajaId: any): any,
    filaNoModificada(item: any): any,
    filaEliminadaOffline(item: any): any
    fnCuentas(value: any): any,
}
export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)
    const DatosProps: any[] = []

    const [state, setState] = React.useState({
        DatosProps: DatosProps,
        CajaID: 0,
    })
    const hasDuplicates = (arr: any) => {
        return new Set(arr).size !== arr.length;
    }

    return (

        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                // cajaId: Yup.number().required("Seleccione la caja").moreThan(0, 'Seleccione la caja'),
                // tipoOperacionId: Yup.number().required("Seleccione el movimiento").moreThan(0, 'Seleccione el movimiento'),
            })}
            onSubmit={async (values: any, { resetForm }) => {
                try {
                    if (props.Id === undefined) {
                        if (values.CajaID == 0) {
                            const MySwal = withReactContent(Swal)
                            MySwal.fire(
                                {
                                    icon: 'error',
                                    html: <div><br />
                                        <h3 className="text-center">Aviso</h3>
                                        <div className={`modal-body`}>
                                            <h5 className="text-center">Selecciona la caja.</h5>
                                        </div>
                                    </div>,
                                    confirmButtonText: `Ok`,
                                }
                            );
                        } else {
                            if (values.Cuentas.length == 0) {
                                console.log("VALUES DE ARREGLO ,", values.Cuentas)
                                const MySwal = withReactContent(Swal)
                                MySwal.fire(
                                    {
                                        icon: 'error',
                                        html: <div><br />
                                            <h3 className="text-center">Aviso</h3>
                                            <div className={`modal-body`}>
                                                <h5 className="text-center">Selecciona alguna cuenta.</h5>
                                            </div>
                                        </div>,
                                        confirmButtonText: `Ok`,
                                    }
                                );
                            } else {
                                console.log('INSERTAR')
                                let obj_insertar = {
                                    CajaID: values.CajaID,
                                    CuentasCaja: values.Cuentas
                                }
                                setLoading(true)
                                Funciones.FNAddCuentas(props.Seguridad, obj_insertar)
                                    .then((respuesta: any) => {
                                        props.fnCancelar()
                                        props.cbActualizar(respuesta)
                                        setLoading(false)
                                        toast.success("Cambios guardados correctamente.")

                                    }).catch((error: any) => {
                                        toast.error("Error al guardar el registro, reintente.")
                                        console.log(error)
                                        setLoading(false)
                                    })
                            }
                        }

                    }
                    else {
                        setLoading(true)
                        let obj_actualizar = {
                            CajaID: props.Id,
                            CuentasCaja: values.Cuentas
                        }
                        Funciones.FNUpdateCuentas(props.Seguridad, obj_actualizar)
                            .then((respuesta: any) => {
                                console.log("RESPUESTA UPT ,", respuesta)
                                if (respuesta.status == 200) {
                                    props.fnCancelar()
                                    props.cbActualizar(respuesta)
                                    setLoading(false)
                                    toast.success(respuesta.data.data)
                                }
                                else {
                                    props.fnCancelar()
                                    props.cbActualizar(respuesta)
                                    setLoading(false)
                                    toast.warning(respuesta.data.data)
                                }
                            }).catch((error: any) => {
                                toast.error("Error al guardar el registro, reintente.")
                                console.log(error)
                                setLoading(false)
                            })
                    }
                }
                catch (error) {
                    toast.error("Ocurrió un problema al guardar el registro, verifica los datos.")
                }

                // Set loading false

            }}

        >
            <Form>
                {/*Empieza modal para agregar */}
                {!props.Id &&
                    <div>
                        <div className="mb-3">
                            <label className="form-label mb-0" htmlFor={"CajaID"}>Cajas:</label>
                            <Field name={"CajaID"} className="form-select"  >
                                {(control: any) => (
                                    <select
                                        className="form-select"
                                        //options={state.optCuentas}                                                                  
                                        value={control.field.value}
                                        onChange={(value: any) => {
                                            control.form.setFieldValue("CajaID", parseInt(value.target.value))
                                            if (parseInt(value.target.value) != 0) {
                                                let SucursalFind = props.OptionsCaja.find((res: any) => {
                                                    return res.value === parseInt(value.target.value)
                                                })

                                                props.fnCuentas(SucursalFind?.sucursal)
                                            }
                                        }}
                                        disabled={false}
                                        id={"CajaID"}
                                        name={"CajaID"}
                                    >
                                        <option value="0">{"Selecciona una caja"}</option>
                                        {props.OptionsCaja.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                    </select>
                                )}
                            </Field>
                            <ErrorMessage component="div" name={"CajaID"} className="text-danger" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label mb-0" htmlFor={"CuentaBancoID"}>Cuentas Banco:</label>
                            <Field name={"CuentaBancoID"} className="form-select"  >
                                {(control: any) => (
                                    <select
                                        className="form-select"
                                        //options={state.optCuentas}                                                                  
                                        value={control.field.value}
                                        onChange={(value: any) => {

                                            control.form.setFieldValue("CuentaBancoID", parseInt(value.target.value))
                                            if (parseInt(value.target.value) != 0) {
                                                let movimiebtoOp = props.OptionsCuentasBanco.find((res: any) => {
                                                    return res.value === parseInt(value.target.value)
                                                })
                                                let movimiento = {
                                                    Estatus: 3,
                                                    NumeroCuenta: movimiebtoOp !== undefined && movimiebtoOp.label,
                                                    Producto: movimiebtoOp !== undefined && movimiebtoOp.producto,
                                                    CuentaBancoID: parseInt(value.target.value),


                                                }
                                                let CuentaBancoID = parseInt(control.form.getFieldProps('CuentaBancoID').value)
                                                props.agregarTipoOperacionLista(movimiento, CuentaBancoID)
                                            }

                                        }}
                                        disabled={false}
                                        id={"CuentaBancoID"}
                                        name={"CuentaBancoID"}
                                    >
                                        <option value="0">{"Selecciona la cuenta"}</option>
                                        {props.OptionsCuentasBanco.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                    </select>
                                )}
                            </Field>
                            <ErrorMessage component="div" name={"CuentaBancoID"} className="text-danger" />
                        </div>
                        <div>
                            <hr />
                            <h4 >
                                Cuentas de banco asignadas:
                            </h4>
                            <hr />
                            <DataTable
                                data={props.initialValues.Cuentas}
                                striped
                                pagination
                                dense
                                noHeader
                                responsive
                                keyField={"tipoMovID"}
                                defaultSortField={"tipoMovID"}
                                columns={[
                                    {
                                        name: 'Id',
                                        selector: 'CuentaBancoID',
                                        sortable: false,
                                        center: true,
                                        conditionalCellStyles: [
                                            {
                                                when: row => row.Estatus == 2,
                                                style: {
                                                    textAlign: 'center',
                                                    color: 'red',
                                                    fontWeight: 'bold'
                                                },

                                            },
                                            {
                                                when: row => row.Estatus == 3,
                                                style: {
                                                    textAlign: 'center',
                                                    color: 'green',
                                                    fontWeight: 'bold'
                                                },

                                            },
                                        ],
                                    },
                                    {
                                        name: 'Nombre',
                                        selector: 'NumeroCuenta',
                                        sortable: false,
                                        center: true,
                                        cell: (propss) => <span className="text-center">{propss.NumeroCuenta}</span>,
                                        conditionalCellStyles: [
                                            {
                                                when: row => row.Estatus == 2,
                                                style: {
                                                    textAlign: 'center',
                                                    color: 'red',
                                                    fontWeight: 'bold'
                                                },

                                            },
                                            {
                                                when: row => row.Estatus == 3,
                                                style: {
                                                    textAlign: 'center',
                                                    color: 'green',
                                                    fontWeight: 'bold'
                                                },

                                            },
                                        ],

                                    },
                                    {
                                        name: 'Producto',
                                        selector: 'Producto',
                                        sortable: false,
                                        center: true,
                                        cell: (propss) => <span className="text-center">{propss.Producto}</span>,
                                        conditionalCellStyles: [
                                            {
                                                when: row => row.Estatus == 2,
                                                style: {
                                                    textAlign: 'center',
                                                    color: 'red',
                                                    fontWeight: 'bold'
                                                },

                                            },
                                            {
                                                when: row => row.Estatus == 3,
                                                style: {
                                                    textAlign: 'center',
                                                    color: 'green',
                                                    fontWeight: 'bold'
                                                },

                                            },
                                        ],
                                    },
                                    {
                                        name: 'Eliminar',
                                        sortable: false,
                                        center: true,
                                        selector: 'Eliminar',
                                        cell: (propss) =>
                                            <div className="text-center">
                                                <button data-tip data-for={"btnVer_1" + propss.CuentaBancoID} className="btn btn-outline-default" type={"button"}
                                                    onClick={() => {
                                                        if (propss.Estatus == 3) {
                                                            props.filaEliminadaOffline(propss)
                                                        } else {
                                                            props.filaNoModificada(propss)
                                                        }
                                                    }}>
                                                    <FaUnlink />
                                                    <ReactTooltip id={"btnVer_1" + propss.CuentaBancoID} type="info" effect="solid">
                                                        Desvincular cuenta
                                                    </ReactTooltip>
                                                </button>
                                            </div>,

                                        conditionalCellStyles: [
                                            {
                                                when: row => row.Estatus == 1,
                                                style: {
                                                    textAlign: 'center',
                                                    color: 'orange',
                                                    fontWeight: 'bold'
                                                },

                                            },
                                            {
                                                when: row => row.Estatus == 2,
                                                style: {
                                                    textAlign: 'center',
                                                    color: 'green',
                                                    fontWeight: 'bold'
                                                },

                                            },
                                        ],
                                    }
                                ]
                                }
                            />
                        </div>
                        {/*Finaliza tabla */}
                        {loading && <Spinner />}
                        {!loading &&
                            <div className="text-end">
                                <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={
                                    props.fnCancelar
                                }>
                                    Cancelar
                                </button>
                                <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                    Ok
                                </button>
                            </div>
                        }
                    </div>
                }

                {/*Empieza modal para actualizar */}
                {props.Id &&
                    <div>
                        <CustomFieldText
                            disabled={props.Id === undefined ? false : true}
                            label="Nombre:"
                            name="NombreCaja"
                            placeholder="Agregar Nombre"
                        />
                        <div className="mb-3">
                            <label className="form-label mb-0" htmlFor={"CuentaBancoID"}>Cuentas Banco:</label>
                            <Field name={"CuentaBancoID"} className="form-select"  >
                                {(control: any) => (
                                    <select
                                        className="form-select"
                                        //options={state.optCuentas}                                                                  
                                        value={control.field.value}
                                        onChange={(value: any) => {

                                            control.form.setFieldValue("CuentaBancoID", parseInt(value.target.value))
                                            if (parseInt(value.target.value) != 0) {
                                                let movimiebtoOp = props.OptionsCuentasBanco.find((res: any) => {
                                                    return res.value === parseInt(value.target.value)
                                                })
                                                let movimiento = {
                                                    Estatus: 3,
                                                    NumeroCuenta: movimiebtoOp !== undefined && movimiebtoOp.label,
                                                    Producto: movimiebtoOp !== undefined && movimiebtoOp.producto,
                                                    CuentaBancoID: parseInt(value.target.value),


                                                }
                                                let CuentaBancoID = parseInt(control.form.getFieldProps('CuentaBancoID').value)
                                                props.agregarTipoOperacionLista(movimiento, CuentaBancoID)
                                            }

                                        }}
                                        disabled={false}
                                        id={"CuentaBancoID"}
                                        name={"CuentaBancoID"}
                                    >
                                        <option value="0">{"Selecciona una cuenta"}</option>
                                        {props.OptionsCuentasBanco.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                    </select>
                                )}
                            </Field>
                            <ErrorMessage component="div" name={"CuentaBancoID"} className="text-danger" />
                        </div>
                        <div>
                            <hr />
                            <h4 >
                                Cuentas de banco asignadas:
                            </h4>
                            <hr />
                            <DataTable
                                data={props.initialValues.Cuentas}
                                striped
                                pagination
                                dense
                                noHeader
                                responsive
                                keyField={"tipoMovID"}
                                defaultSortField={"tipoMovID"}
                                columns={[
                                    {
                                        name: 'Id',
                                        selector: 'CuentaBancoID',
                                        sortable: false,
                                        center: true,
                                        conditionalCellStyles: [
                                            {
                                                when: row => row.Estatus == 2,
                                                style: {
                                                    textAlign: 'center',
                                                    color: 'red',
                                                    fontWeight: 'bold'
                                                },

                                            },
                                            {
                                                when: row => row.Estatus == 3,
                                                style: {
                                                    textAlign: 'center',
                                                    color: 'green',
                                                    fontWeight: 'bold'
                                                },

                                            },
                                        ],
                                    },
                                    {
                                        name: 'Nombre',
                                        selector: 'NumeroCuenta',
                                        sortable: false,
                                        center: true,
                                        cell: (propss) => <span className="text-center">{propss.NumeroCuenta}</span>,
                                        conditionalCellStyles: [
                                            {
                                                when: row => row.Estatus == 2,
                                                style: {
                                                    textAlign: 'center',
                                                    color: 'red',
                                                    fontWeight: 'bold'
                                                },

                                            },
                                            {
                                                when: row => row.Estatus == 3,
                                                style: {
                                                    textAlign: 'center',
                                                    color: 'green',
                                                    fontWeight: 'bold'
                                                },

                                            },
                                        ],

                                    },
                                    {
                                        name: 'Producto',
                                        selector: 'Producto',
                                        sortable: false,
                                        center: true,
                                        cell: (propss) => <span className="text-center">{propss.Producto}</span>,
                                        conditionalCellStyles: [
                                            {
                                                when: row => row.Estatus == 2,
                                                style: {
                                                    textAlign: 'center',
                                                    color: 'red',
                                                    fontWeight: 'bold'
                                                },

                                            },
                                            {
                                                when: row => row.Estatus == 3,
                                                style: {
                                                    textAlign: 'center',
                                                    color: 'green',
                                                    fontWeight: 'bold'
                                                },

                                            },
                                        ],
                                    },
                                    {
                                        name: 'Eliminar',
                                        sortable: false,
                                        center: true,
                                        selector: 'Eliminar',
                                        cell: (propss) =>
                                            <div className="text-center">
                                                <button data-tip data-for={"btnVer_1" + propss.CuentaBancoID} className="btn btn-outline-default" type={"button"}
                                                    onClick={() => {
                                                        if (propss.Estatus == 3) {
                                                            props.filaEliminadaOffline(propss)
                                                        } else {
                                                            props.filaNoModificada(propss)
                                                        }
                                                    }}>
                                                    <FaUnlink />
                                                    <ReactTooltip id={"btnVer_1" + propss.CuentaBancoID} type="info" effect="solid">
                                                        Desvincular cuenta
                                                    </ReactTooltip>
                                                </button>
                                            </div>,

                                        conditionalCellStyles: [
                                            {
                                                when: row => row.Estatus == 1,
                                                style: {
                                                    textAlign: 'center',
                                                    color: 'orange',
                                                    fontWeight: 'bold'
                                                },

                                            },
                                            {
                                                when: row => row.Estatus == 2,
                                                style: {
                                                    textAlign: 'center',
                                                    color: 'green',
                                                    fontWeight: 'bold'
                                                },

                                            },
                                        ],
                                    }
                                ]
                                }
                            />
                        </div>
                        {/*Finaliza tabla */}
                        {loading && <Spinner />}
                        {!loading &&
                            <div className="text-end">
                                <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={
                                    props.fnCancelar
                                }>
                                    Cancelar
                                </button>
                                <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                    Ok
                                </button>
                            </div>
                        }
                    </div>
                }
            </Form>

        </Formik >
    )
}

