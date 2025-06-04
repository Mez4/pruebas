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
import { FaCheckSquare, FaCircle, FaPencilAlt, FaRegSquare, FaTrash } from 'react-icons/fa'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ArrayList from '../../../../../global/ArrayList'
import { iUI } from '../../../../../../interfaces/ui/iUI'
type CFormType = {
    Seguridad: IOidc,
    iUI: iUI,
    Id?: number,
    DescripcionCaja: string,
    initialValues: {
        DescripcionCaja: string,
        CajaID: number,
        TiposOperaciones: any[]

    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    agregarTipoOperacionLista(item: any, cajaId: any): any,
    activador(item: any): any
    activador2(item: any): any
    activador3(item: any): any
    modificado(item: any): any
    filaNoModificada(item: any): any
    FnGetCuentasBanco(value: any): any
    abrirModalCaja(): any,
    abrirModalCrearMovimiento(): any,
    optionsCaja: { value: number, label: string, bovedaId: number }[],
    optionsMovimiento: { value: number, label: string, ProductoIDMov: number }[],
    OptionsCuentasBanco: { value: number, label: string, producto: number }[],
}
export const CForm = (props: CFormType) => {
    const MySwal = withReactContent(Swal)

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
            onSubmit={(values: any, { resetForm }) => {
                try {
                    const listaCuentas: string[] = [];
                    var arrList = values.TiposOperaciones.map(({ CuentaBancoId }) => ({ CuentaBancoId }));
                    arrList.forEach(element => {
                        if (element.CuentaBancoId) {
                            listaCuentas.push(element.CuentaBancoId)
                        }
                    });

                    const listaCuentasNuevas: string[] = [];
                    var arrList = values.TiposOperaciones.map(({ CuentaBancoIdNueva }) => ({ CuentaBancoIdNueva }));
                    arrList.forEach(element => {
                        if (element.CuentaBancoIdNueva) {
                            listaCuentasNuevas.push(element.CuentaBancoIdNueva)
                        }
                    });

                    var cuentaBancoRepetida = hasDuplicates(listaCuentasNuevas) ? true : false


                    if (cuentaBancoRepetida) {
                        MySwal.fire(
                            {
                                icon: 'error',
                                html: <div><br />
                                    <h3 className="text-center">Aviso</h3>
                                    <div className={`modal-body`}>
                                        <h5 className="text-center">No se puede asignar la misma cuenta banco a dos o más movimientos de caja. Favor de verificar.</h5>
                                    </div>
                                </div>,
                                confirmButtonText: `Ok`,
                            }
                        );


                    } else {

                        if (props.Id === undefined) {
                            var cuentaSinAsignar = false
                            values.TiposOperaciones.forEach(element => {
                                if (element.CuentaBancoIdNueva == 0 && element.Estatus == 2) {
                                    cuentaSinAsignar = true
                                }
                            });
                            if (!cuentaSinAsignar) {
                                setLoading(true)
                                console.log("datos...", values)
                                let Datos2 = {
                                    CajaID: state.CajaID,
                                    TiposOperaciones: values.TiposOperaciones
                                }
                                Funciones.FNAdd(props.Seguridad, Datos2)
                                    .then((respuesta: any) => {
                                        props.fnCancelar()
                                        props.cbActualizar(respuesta)
                                        toast.success('El movimiento se actualizó correctamente')
                                        resetForm({ values: '' })

                                    }).catch((error: any) => {
                                        toast.error("Error al guardar el movimiento, verifique los registros")
                                        setLoading(false)
                                    })
                            } else {
                                MySwal.fire(
                                    {
                                        icon: 'error',
                                        html: <div><br />
                                            <h3 className="text-center">Aviso</h3>
                                            <div className={`modal-body`}>
                                                <h5 className="text-center">Asigna la cuenta al/los nuevos movimientos.</h5>
                                            </div>
                                        </div>,
                                        confirmButtonText: `Ok`,
                                    }
                                );
                            }
                        } else {
                            //UPDATE
                            console.log("datos...", values)
                            var cuentaSinAsignar = false
                            values.TiposOperaciones.forEach(element => {
                                if (element.CuentaBancoIdNueva == 0 && element.Estatus == 2) {
                                    cuentaSinAsignar = true
                                }
                            });
                            if (!cuentaSinAsignar) {
                                setLoading(true)
                                let Datos = {
                                    CajaID: props.Id,
                                    TiposOperaciones: values.TiposOperaciones
                                }
                                Funciones.FNUpdate(props.Seguridad, Datos)
                                    .then((respuesta: any) => {
                                        props.fnCancelar()
                                        if (respuesta.status == 206) {
                                            toast.error(respuesta.data.data)
                                        }
                                        if (respuesta.status == 200) {
                                            // resetForm({ values: '' })
                                            props.cbActualizar(respuesta.data)
                                            toast.success('El movimiento se actualizó correctamente')
                                        }
                                    }).catch((error: any) => {
                                        toast.error("Error al guardar el movimiento, verifique los registros")
                                        setLoading(false)
                                    })


                            }
                            else {
                                MySwal.fire(
                                    {
                                        icon: 'error',
                                        html: <div><br />
                                            <h3 className="text-center">Aviso</h3>
                                            <div className={`modal-body`}>
                                                <h5 className="text-center">Asigna la cuenta al/los nuevos movimientos.</h5>
                                            </div>
                                        </div>,
                                        confirmButtonText: `Ok`,
                                    }
                                );
                            }

                        }
                    }

                }
                catch (error) {
                    toast.error("Ocurrió un problema al guardar el movimiento, verifica los datos.")
                }

                // Set loading false

            }}

        >
            <Form>
                {/*Empieza modal para agregar */}
                {!props.Id &&
                    <div>
                        <div className="mb-3">
                            <label className="form-label mb-0" htmlFor={"cajaId"}>Caja:</label>
                            <Field name={"cajaId"} className="form-select"  >
                                {(control: any) => (
                                    <select
                                        className="form-select"
                                        //options={state.optCuentas}                                                                  
                                        value={control.field.value}
                                        onChange={(value: any) => {
                                            control.form.setFieldValue("cajaId", parseInt(value.target.value))
                                            setState(s => ({
                                                ...s, CajaID: parseInt(value.target.value)
                                            }
                                            ))
                                            let bovedaCuenta = props.optionsCaja.find((res) => {

                                                return res.value === parseInt(value.target.value)
                                            })

                                            props.FnGetCuentasBanco(props.iUI.Producto?.ProductoID)

                                        }}
                                        disabled={false}
                                        id={"cajaId"}
                                        name={"cajaId"}
                                    >
                                        <option value="0">{"Selecciona una caja"}</option>
                                        {props.optionsCaja.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                    </select>
                                )}
                            </Field>
                            <ErrorMessage component="div" name={"cajaId"} className="text-danger" />
                        </div>
                        <div className="mb-3">
                            <button type="button" className="btn btn-outline btn-secondary waves-effect waves-light" onClick={props.abrirModalCaja} >
                                Agregar caja nueva
                            </button>
                        </div>
                        <div className="mb-3">
                            <label className="form-label mb-0" htmlFor={"tipoOperacionId"}>Tipo Operación:</label>
                            <Field name={"tipoOperacionId"} className="form-select"  >
                                {(control: any) => (
                                    <select
                                        className="form-select"
                                        //options={state.optCuentas}                                                                  
                                        value={control.field.value}
                                        onChange={(value: any) => {

                                            control.form.setFieldValue("tipoOperacionId", parseInt(value.target.value))
                                            if (parseInt(value.target.value) != 0) {
                                                let movimiebtoOp = props.optionsMovimiento.find((res: any) => {
                                                    return res.value === parseInt(value.target.value)
                                                })
                                                let cajaId = parseInt(control.form.getFieldProps('cajaId').value)

                                                let movimiento = {

                                                    CajaTipoOperacionID: 0,
                                                    CuentaBancoIdNueva: 0,
                                                    CajaID: state.CajaID,
                                                    Estatus: 2,
                                                    ProductoIDMov: movimiebtoOp !== undefined && movimiebtoOp.ProductoIDMov,
                                                    Id: parseInt(value.target.value),
                                                    NumeroCuenta: "",
                                                    Activa: true,
                                                    PuedeRecibir: false,
                                                    PuedeSacar: false,
                                                    TipoMovimiento: movimiebtoOp !== undefined && movimiebtoOp.label,

                                                }
                                                props.agregarTipoOperacionLista(movimiento, cajaId)
                                            }

                                        }}
                                        disabled={false}
                                        id={"tipoOperacionId"}
                                        name={"tipoOperacionId"}
                                    >
                                        <option value="0">{"Selecciona un tipo de operación"}</option>
                                        {props.optionsMovimiento.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                    </select>
                                )}
                            </Field>
                            <ErrorMessage component="div" name={"tipoOperacionId"} className="text-danger" />
                        </div>

                        <div>
                            <div className="mb-3">
                                <button type="reset" className="btn btn-outline btn-secondary waves-effect waves-light" onClick={props.abrirModalCrearMovimiento} >
                                    Agregar movimiento nuevo
                                </button>
                            </div>
                            <hr />
                            <h4 >
                                Movimientos Caja:
                            </h4>
                            <hr />
                            <DataTable
                                data={props.initialValues.TiposOperaciones}
                                striped
                                // disabled={props.optionsMovimiento != null && false}
                                pagination
                                dense
                                noHeader
                                responsive
                                keyField={"tipoMovID"}
                                defaultSortField={"tipoMovID"}
                                columns={[
                                    {
                                        name: 'Id',
                                        selector: 'Id',
                                        sortable: false,
                                        center: true,
                                        width:'50px',
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
                                    },
                                    {
                                        name: 'Nombre',
                                        selector: 'TipoMovimiento',
                                        sortable: false,
                                        center: true,
                                        cell: (propss) => <span className="text-center">{propss.TipoMovimiento}</span>,

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
                                    },

                                    {
                                        name: 'Cuenta B. Actual',
                                        selector: 'NumeroCuenta',
                                        sortable: false,
                                        center: true,
                                        cell: (propss) => <span className="text-center">{propss.NumeroCuenta == "" ? "Cuenta no asignada" : propss.NumeroCuenta}</span>,
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
                                    },

                                    {
                                        name: 'Activar/Desactivar',
                                        sortable: false,
                                        center: true,
                                        width: '130px',
                                        cell: (propss) =>
                                            <button className="asstext text-center" type={"button"} >
                                                {
                                                    propss.Activa ?
                                                        <div className="text-center"><FaCheckSquare />  </div> : <FaRegSquare />
                                                }
                                            </button>
                                    },
                                    {
                                        name: 'Puede Recibir $',
                                        sortable: false,
                                        center: true,
                                        width: '130px',
                                        cell: (propss) =>
                                        <button className="asstext" type={"button"} onClick={() => {
                                              
                                            props.activador2(propss)
                                            
                                        }} >
                                            {
                                                propss.PuedeRecibir ?
                                                    <FaCheckSquare /> : <FaRegSquare />
                                            }
                                        </button>,
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
                                    
                                    },
                                    {
                                        name: 'Puede Sacar $',
                                        sortable: false,
                                        center: true,
                                        width: '130px',
                                        cell: (propss) =>
                                        <button className="asstext" type={"button"} onClick={() => {
                                           
                                                props.activador3(propss)
                                            

                                        }} >
                                            {
                                                propss.PuedeSacar ?
                                                    <FaCheckSquare /> : <FaRegSquare />
                                            }
                                        </button>,
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
                                    },
                                    {
                                        name: 'Cuenta B. Nueva',
                                        sortable: false,
                                        center: true,
                                        selector: 'NumeroCuenta',
                                        cell: (propss) => <div className="mb-3">
                                            <Field name={"CuentaBancoIdNueva"} className="form-select"  >
                                                {(control: any) => (
                                                    <select
                                                        className="form-select"
                                                        //options={state.optCuentas}                                                        
                                                        value={propss.CuentaBancoIdNueva !== undefined ? propss.CuentaBancoIdNueva : control.field.value}
                                                        onChange={(value: any) => {
                                                            let producto2 = props.OptionsCuentasBanco.find((res) => {
                                                                return res.value === parseInt(value.target.value)
                                                            })
                                                            propss.CuentaBancoIdNueva = parseInt(value.target.value)
                                                            control.form.setFieldValue("CuentaBancoIdNueva" + propss.Id, parseInt(value.target.value))

                                                            if (propss.Estatus == 0) {
                                                                props.modificado(propss)
                                                            }

                                                        }}

                                                        disabled={propss.TipoMovimiento === "No aplica" ? true : false}
                                                        id={"CuentaBancoIdNueva" + propss.Id}
                                                        name={"CuentaBancoIdNueva" + propss.Id}
                                                    >
                                                        <option value="0">{"Selecciona una Cuenta"}</option>
                                                        {props.OptionsCuentasBanco.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                                    </select>
                                                )}
                                            </Field>
                                            <ErrorMessage component="div" name={"CuentaBancoIdNueva" + propss.Id} className="text-danger" />
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

                                ]}
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
                            name="DescripcionCaja"
                            placeholder="Agregar Nombre"
                        />
                        <div className="mb-3">
                            <label className="form-label mb-0" htmlFor={"tipoOperacionId"}>Tipo Operación:</label>
                            <Field name={"tipoOperacionId"} className="form-select"  >
                                {(control: any) => (
                                    <select
                                        className="form-select"
                                        //options={state.optCuentas}                                                                  
                                        value={control.field.value}
                                        onChange={(value: any) => {

                                            control.form.setFieldValue("tipoOperacionId", parseInt(value.target.value))
                                            if (parseInt(value.target.value) != 0) {
                                                let movimiebtoOp = props.optionsMovimiento.find((res: any) => {
                                                    return res.value === parseInt(value.target.value)
                                                })
                                                let movimiento = {

                                                    CajaTipoOperacionID: 0,
                                                    CuentaBancoIdNueva: 0,
                                                    CajaID: props.Id,
                                                    Estatus: 2,
                                                    ProductoIDMov: movimiebtoOp !== undefined && movimiebtoOp.ProductoIDMov,
                                                    Id: parseInt(value.target.value),
                                                    NumeroCuenta: "",
                                                    Activa: true,
                                                    PuedeRecibir: true,
                                                    PuedeSacar: true,
                                                    TipoMovimiento: movimiebtoOp !== undefined && movimiebtoOp.label,

                                                }
                                                let cajaId = parseInt(control.form.getFieldProps('cajaId').value)
                                                props.agregarTipoOperacionLista(movimiento, cajaId)
                                            }

                                        }}
                                        disabled={false}
                                        id={"tipoOperacionId"}
                                        name={"tipoOperacionId"}
                                    >
                                        <option value="0">{"Selecciona un tipo de operación"}</option>
                                        {props.optionsMovimiento.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                    </select>
                                )}
                            </Field>
                            <ErrorMessage component="div" name={"tipoOperacionId"} className="text-danger" />
                        </div>
                        <div className="mb-3">
                            <button type="reset" className="btn btn-outline btn-secondary waves-effect waves-light" onClick={props.abrirModalCrearMovimiento} >
                                Agregar movimiento nuevo
                            </button>
                        </div>
                        <div>
                            <hr />
                            <h4 >
                                Movimientos Caja:
                            </h4>
                            <hr />
                            <DataTable
                                data={props.initialValues.TiposOperaciones}
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
                                        selector: 'Id',
                                        sortable: false,
                                        center: true,
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
                                    },
                                    {
                                        name: 'Nombre',
                                        selector: 'TipoMovimiento',
                                        sortable: false,
                                        center: true,
                                        cell: (propss) => propss.Estatus == 2 ? <span className="text-center">{propss.TipoMovimiento}</span> : <span className="text-center">{propss.TipoMovimiento}</span>,
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

                                    },

                                    {
                                        name: 'Cuenta B. Actual',
                                        selector: 'NumeroCuenta',
                                        sortable: false,
                                        center: true,
                                        cell: (propss) => <span className="text-center">{propss.NumeroCuenta == "" ? "Cuenta no asignada" : propss.NumeroCuenta}</span>,
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

                                    },
                                    {
                                        name: 'Activar/Desactivar',
                                        sortable: false,
                                        center: true,
                                        cell: (propss) =>
                                            <button className="asstext" type={"button"} onClick={() => {
                                                if (propss.Estatus == 2) {
                                                    return;
                                                } else {
                                                    props.activador(propss)
                                                }

                                            }} >
                                                {
                                                    propss.Activa ?
                                                        <FaCheckSquare /> : <FaRegSquare />
                                                }
                                            </button>,
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


                                    },
                                    {
                                        name: 'Puede Recibir $',
                                        sortable: false,
                                        center: true,
                                        cell: (propss) =>
                                            <button className="asstext" type={"button"} onClick={() => {
                                                if (propss.Estatus == 2) {
                                                    return;
                                                } else {    
                                                props.activador2(propss)
                                                }
                                            }} >
                                                {
                                                    propss.PuedeRecibir ?
                                                        <FaCheckSquare /> : <FaRegSquare />
                                                }
                                            </button>,
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
                                    },
                                    {
                                        name: 'Puede Sacar $',
                                        sortable: false,
                                        center: true,
                                        cell: (propss) =>
                                        <button className="asstext" type={"button"} onClick={() => {
                                            if (propss.Estatus == 2) {
                                                return;
                                            } else {
                                                props.activador3(propss)
                                            }

                                        }} >
                                            {
                                                propss.PuedeSacar ?
                                                    <FaCheckSquare /> : <FaRegSquare />
                                            }
                                        </button>,
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
                                    },
                                    {
                                        name: 'Cuenta B. Nueva',
                                        sortable: false,
                                        center: true,
                                        selector: 'NumeroCuenta',
                                        cell: (propss) => <div className="mb-3">
                                            <Field name={"CuentaBancoIdNueva"} className="form-select">
                                                {(control: any) => (    
                                                    <select
                                                        className="form-select"
                                                        //options={state.optCuentas}                                                        
                                                        value={propss.CuentaBancoIdNueva !== undefined ? propss.CuentaBancoIdNueva : control.field.value}
                                                        onChange={(value: any) => {
                                                            console.log(propss);
                                                            
                                                            propss.CuentaBancoIdNueva = parseInt(value.target.value)
                                                            control.form.setFieldValue("CuentaBancoIdNueva" + propss.Id, parseInt(value.target.value))
                                                            if (propss.Estatus == 0) {
                                                                props.modificado(propss)
                                                            }
                                                        }}
                                                        disabled={propss.TipoMovimiento === "No aplica" ? true : false}
                                                        id={"CuentaBancoIdNueva" + propss.Id}
                                                        name={"CuentaBancoIdNueva" + propss.Id}
                                                    >
                                                        <option value="0">{"Selecciona una Cuenta"}</option>
                                                        {props.OptionsCuentasBanco.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                                    </select>
                                                )}
                                            </Field>
                                            <ErrorMessage component="div" name={"CuentaBancoIdNueva" + propss.Id} className="text-danger" />
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
                                ]}
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

