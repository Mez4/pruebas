import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import DataTable from 'react-data-table-component'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { FaTrash, FaUndo } from 'react-icons/fa'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import * as Funciones from './Funciones'

type CFormType = {
    Seguridad: IOidc,
    Id?: number,
    initialValues: {
        AnalistaID: number,
        SucursalID: number,
        Nombre: string,
        Sucursales: any[],
    },
    options: { value: number, label: string }[]
    optionsAnalistas: { value: number, label: string }[]
    cbActualizar(): any,
    cbGuardar(): any,
    cbAgregarSucursalLocal(item: any): any,
    cbEliminarSucursalLocal(item: any): any,
    cbFilaModificada(item: any): any,
    fnCancelar(): any
}

export const CFormAnalistaSucursal = (props: CFormType) => {
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = React.useState(false)
    const [sucursalEditada, setSucursalEditada] = React.useState(false)
    const [analistaSeleccionado, setAnalistaSeleccionado] = React.useState(false);
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={
                !props.Id ? Yup.object().shape({ AnalistaID: Yup.number().required("Campo obligatorio").moreThan(0, "Campo obligatorio") }) : Yup.object().shape({})
            }
            onSubmit={(values: any, { resetForm }) => {
                if (props.initialValues.Sucursales.length > 0) {
                    if (props.Id) {
                        setLoading(true)
                        // props.initialValues.Sucursales.find(v => v.AnalistaID === 0).AnalistaID = values.AnalistaID;
                        let objeto = {
                            Sucursales: props.initialValues.Sucursales
                        }
                        Funciones.FNActualizarSucursalesAnalistas(props.Seguridad, objeto)
                            .then((respuesta: any) => {
                                setLoading(false)
                                props.fnCancelar()
                                props.cbActualizar()
                                resetForm()
                            })
                            .catch((error: any) => {
                                alert("Error al guardar las sucursales" + JSON.stringify(error))
                                setLoading(false)
                            })
                    } else {
                        setLoading(true)
                        props.initialValues.Sucursales.find(v => v.AnalistaID === 0).AnalistaID = values.AnalistaID;
                        let objeto = {
                            Sucursales: props.initialValues.Sucursales
                        }
                        Funciones.FNGuardarSucursalesAnalistas(props.Seguridad, objeto)
                            .then((respuesta: any) => {
                                setLoading(false)
                                props.fnCancelar()
                                props.cbGuardar()
                                resetForm()
                            })
                            .catch((error: any) => {
                                alert("Error al guardar las sucursales" + JSON.stringify(error))
                                setLoading(false)
                            })
                    }

                } else {
                    MySwal.fire(
                        {
                            icon: 'error',
                            html: <div><br />
                                <h3 className="text-center">Aviso</h3>
                                <div className={`modal-body`}>
                                    <h5 className="text-center">Selecciona al menos una sucursal.</h5>
                                </div>
                            </div>,
                            confirmButtonText: `Continuar`,
                            confirmButtonColor: '#007bff',
                        }
                    );
                }
            }}>
            <Form>
                {!props.Id &&
                    <div className="mb-3" style={analistaSeleccionado ? { pointerEvents: 'none', opacity: '0.4' } : {}}>
                        <label className="form-label mb-0" htmlFor={"AnalistaID"}>Analista:</label>
                        <Field name={"AnalistaID"} className="form-select"  >
                            {(control: any) => (
                                <select
                                    className="form-select"
                                    value={control.field.value}
                                    onChange={(value: any) => {
                                        if (parseInt(value.target.value) > 0) {
                                            let analistaSeleccionado = parseInt(value.target.value)
                                            MySwal.fire(
                                                {
                                                    icon: 'warning',
                                                    html: <div><br />
                                                        <h3 className="text-center">Aviso</h3>
                                                        <div className={`modal-body`}>
                                                            <h5 className="text-center">Una vez seleccionado el analsita no podrá ser modificado hasta terminar el proceso.
                                                            </h5>
                                                        </div>
                                                    </div>,
                                                    allowOutsideClick: false,
                                                    showConfirmButton: true,
                                                    showCancelButton: true,
                                                    cancelButtonText: 'Cancelar',
                                                    confirmButtonText: 'Continuar',
                                                    confirmButtonColor: '#4bba6f',
                                                    cancelButtonColor: '#bd4256'

                                                }
                                            ).then((result) => {
                                                if (result.isConfirmed) {
                                                    control.form.setFieldValue("AnalistaID", analistaSeleccionado)
                                                    setAnalistaSeleccionado(true)
                                                } else {
                                                    control.form.setFieldValue("AnalistaID", 0)
                                                }

                                            });
                                        } else {
                                            control.form.setFieldValue('AnalistaID', 0)
                                        }
                                    }}
                                    disabled={false}
                                    id={"AnalistaID"}
                                    name={"AnalistaID"}
                                ><option value="0">{"Selecciona un analista"}</option>
                                    {props.optionsAnalistas.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                </select>
                            )}
                        </Field>
                        <ErrorMessage component="div" name={"AnalistaID"} className="text-danger" />
                    </div>
                }
                {props.Id &&
                    <CustomFieldText name="Nombre" label="Nombre" placeholder='Selecciona el analista' disabled />
                }
                <div className="mb-3">
                    <label className="form-label mb-0" htmlFor={"SucursalID"}>Sucursal:</label>
                    <Field name={"SucursalID"} className="form-select"  >
                        {(control: any) => (
                            <select
                                className="form-select"
                                value={control.field.value}
                                onChange={(value: any) => {
                                    let a = {
                                        AnalistaID: (props.Id ? props.Id : props.initialValues.AnalistaID),
                                        SucursalID: parseInt(value.target.value),
                                        Nombre: props.options.filter((item: any) => item.value === parseInt(value.target.value))[0].label,
                                        Estatus: 2,
                                    }
                                    if (parseInt(value.target.value) != 0) props.cbAgregarSucursalLocal(a)

                                }}
                                disabled={false}
                                id={"SucursalID"}
                                name={"SucursalID"}
                            ><option value="0">{"Selecciona una sucursal"}</option>
                                {props.options.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                            </select>
                        )}
                    </Field>
                    <ErrorMessage component="div" name={"SucursalID"} className="text-danger" />
                </div>
                <hr />
                <h4 >
                    Sucursales del analista:
                </h4>
                <hr />
                <DataTable
                    data={props.initialValues.Sucursales}
                    striped
                    pagination
                    dense
                    noHeader
                    responsive
                    keyField={"sucursalID"}
                    defaultSortField={"sucursalID"}
                    columns={[
                        {
                            name: 'Id',
                            selector: 'SucursalID',
                            sortable: true,
                            conditionalCellStyles: [
                                {
                                    when: row => row.Estatus === 2,
                                    style: {
                                        color: 'green',
                                    }
                                },
                                {
                                    when: row => row.Estatus === 3,
                                    style: {
                                        color: 'red',
                                    }
                                },
                                {
                                    when: row => row.Estatus === 4,
                                    style: {
                                        color: '#FFBF00',
                                    }
                                }
                            ]
                        },
                        {
                            name: 'Nombre',
                            selector: 'Nombre',
                            sortable: true,
                            conditionalCellStyles: [
                                {
                                    when: row => row.Estatus === 2,
                                    style: {
                                        color: 'green',
                                    }
                                },
                                {
                                    when: row => row.Estatus === 3,
                                    style: {
                                        color: 'red',
                                    }
                                },
                                {
                                    when: row => row.Estatus === 4,
                                    style: {
                                        color: '#FFBF00',
                                    }
                                }
                            ]
                        },
                        {
                            name: 'Acciones',
                            width: '20%',
                            cell: (row: any) => <div><button className="btn btn-danger btn-sm" onClick={() => {
                                props.cbEliminarSucursalLocal(row)
                            }}><FaTrash></FaTrash></button>
                                &nbsp;
                                <button className="btn btn-warning btn-sm" onClick={() => {
                                    props.cbFilaModificada(row)
                                }}><FaUndo /></button></div>,
                            ignoreRowClick: true,
                            allowOverflow: true,
                            button: true,
                        }
                    ]}
                />
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                            Aceptar
                        </button>
                    </div>
                }
            </Form>
        </Formik >
    )
}
