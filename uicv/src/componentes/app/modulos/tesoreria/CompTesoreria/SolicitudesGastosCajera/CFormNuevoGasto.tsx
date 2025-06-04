import React, { useRef, TextareaHTMLAttributes } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { ActionAsyncSelect, CustomFieldText, CustomFieldText2, CustomSelect, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { ErrorMessage, Field } from 'formik'
import { toast } from 'react-toastify'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { FormateoDinero } from '../../../../../../global/variables'
import { FaCheck, FaCircle, FaEraser, FaFile, FaLock, FaLockOpen, FaMoneyCheckAlt, FaWindowClose } from 'react-icons/fa'
import ReactTooltip from 'react-tooltip'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Control from 'react-select/src/components/Control'

type CFormType = {
    oidc: IOidc
    Id?: number,
    CajaSeleccionada: number,
    SucursalSeleccionada: number,
    BloquearCuenta: boolean,
    BloquearRegistros: boolean,
    solicitudGuardada: boolean,
    permitirEvidecia: boolean,
    initialValues: {
        CajaID: number,
        CuentaBancoID: number,
        RubroID: number,
        Observaciones: string,
        GeneraGastoSucursal: boolean,
        SucursalID: number,
        Rubros: any[]
    },
    agregarRubro(item: any): any,
    eliminarRubro(item: any): any,
    fnAgregarItem(item: any): any,
    setDocumentoID(item: any): any,
    setSolicitudDetalleID(item: any): any,
    fnCancelar(): any,
    fnHabilitarCargaDeEvidecia(): any,
    fnBloquearRegistros(): any,
    bloquearCta(): any,
    bloquearRegistros(): any,
    setSolicitudGastoID(item: any): any,
    fnMostrarCargaDeDocumento(): any,
    fnMostrarCargaDeDocumento2(): any,
    cbActualizarSolicitudDetalleID(item: any): any,

    fnVerDoc(): any

    OptionsCuentas: { value: number, label: string }[],
    OptionsRubros: { value: number, label: string, clave: string, descripcion: string }[],
    OptionsSucursales: { value: number, label: string }[],

}

export const CFormNuevoGasto = (props: CFormType, propss: any) => {
    const [loading, setLoading] = React.useState(false)
    const MySwal = withReactContent(Swal)
    const refObservaciones = useRef<Text>(null)
    console.log("PROPS RECIBIDOS: ", props)

    const [state, setState] = React.useState({
        GeneraGasto: false,
        Util: false
    })



    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={props.solicitudGuardada ? null : Yup.object().shape({
                CuentaBancoID: Yup.number().required('Seleccione una cuenta').moreThan(0, 'Seleccione una cuenta'),
                Observaciones: Yup.string().required('Ingrese una observación').min(5, 'Ingresa mínimo 5 carácteres').max(500, 'Máximo 500 carácteres'),
                SucursalID: Yup.number().when("GeneraGastoSucursal", { is: !state.GeneraGasto ? true : false, then: Yup.number().required("Seleccione la sucursal").moreThan(0, 'Seleccione la sucursal'), })

            })}
            onSubmit={(values: any, { resetForm }) => {
                console.log("Values", values)
                var cuentaBancoID = values.CuentaBancoID;
                var sucursalID = values.SucursalID;
                var observaciones = values.Observaciones;
                var continuar = false;


                if (values.CuentaBancoID > 0) {
                    if (props.initialValues.Rubros.length > 0) {
                        props.initialValues.Rubros.forEach(element => {
                            if (element.Total > 0) {
                                continuar = true
                            } else {
                                continuar = false
                            }
                        });
                        if (continuar) {
                            let total = 0
                            props.initialValues.Rubros.forEach(element => {
                                total = total + element.Total
                            });
                            let a = {
                                Id: props.Id,
                                CuentaBancoID: cuentaBancoID,
                                MontoSolicitado: total,
                                Rubros: props.initialValues.Rubros,
                                CajaID: props.CajaSeleccionada,
                                GeneraGastoSucursal: state.GeneraGasto,
                                SucursalID: sucursalID,
                                Observaciones: observaciones,
                                OrigenSucursalID: props.SucursalSeleccionada,
                                Util: state.Util
                            }

                            if (!props.BloquearRegistros && !props.permitirEvidecia) {

                                MySwal.fire({
                                    title: '<strong>¿Guardar Solicitud?</strong>',
                                    icon: 'warning',
                                    html:
                                        <div className="text-center">
                                            <br></br>
                                            <p>La solicitud no podra ser modificada. ¿Desea continuar?.</p>
                                        </div>,
                                    showCloseButton: false,
                                    showCancelButton: true,
                                    showConfirmButton: true,
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Aceptar',
                                    cancelButtonText: 'Cancelar',
                                    confirmButtonColor: '#3085d6',
                                    focusConfirm: false,
                                    confirmButtonAriaLabel: 'Aceptar',
                                    cancelButtonAriaLabel: ''
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        setLoading(true)
                                        let timerInterval
                                        MySwal.fire(
                                            {
                                                icon: 'info',
                                                html: <div><br />
                                                    <h3 className="text-center">Aviso</h3>
                                                    <div className={`modal-body`}>
                                                        <h5 className="text-center">Guardando solicitud.</h5>
                                                    </div>
                                                </div>,
                                                timerProgressBar: false,
                                                confirmButtonText: `Ok`,
                                                //disable cancelable
                                                allowOutsideClick: true,
                                                didOpen: () => {
                                                    MySwal.showLoading()
                                                },
                                                willClose: () => {
                                                    clearInterval(timerInterval)
                                                }
                                            }
                                        );



                                        Funciones.FNGuardarSolicitud(props.oidc, a)
                                            .then((respuesta: any) => {
                                                console.log("RESPUESTINHA SIU", respuesta.SolicitudGastoID)
                                                props.fnAgregarItem(respuesta)
                                                props.cbActualizarSolicitudDetalleID(respuesta)
                                                props.setSolicitudGastoID(respuesta.SolicitudGastoID)
                                                props.fnBloquearRegistros();
                                                /*  props.fnHabilitarCargaDeEvidecia(); */


                                                MySwal.fire({
                                                    icon: 'success',
                                                    html: <div><br />
                                                        <h3 className="text-center">Éxito</h3>
                                                        <div className={`modal-body`}>
                                                            <h5 className="text-center">Solicitud guardada correctamente, a continuación adjunta las evidencias necesarias para continuar.</h5>
                                                        </div>
                                                    </div>,
                                                    showCancelButton: false,
                                                    showConfirmButton: true,
                                                    allowOutsideClick: false,
                                                    showCloseButton: false,
                                                    confirmButtonText: 'Aceptar',
                                                    confirmButtonColor: '#3085d6',
                                                })
                                                setLoading(false)
                                                resetForm()

                                            }).catch((error: any) => {
                                                toast.error("Error al guardar el registro, reintente.")
                                                console.log(error)
                                                setLoading(false)
                                            })
                                    }
                                    else {
                                        MySwal.fire({
                                            title: '<strong>Aceptar Solicitud</strong>',
                                            icon: 'info',
                                            html:
                                                <div className="text-center">
                                                    Operación cancelada por el usuario.
                                                </div>,
                                            showCloseButton: false,
                                            showCancelButton: false,
                                            showConfirmButton: true,
                                            focusConfirm: false,
                                            cancelButtonText: 'Cancelar',
                                            confirmButtonText: 'Aceptar',
                                            confirmButtonColor: '#3085d6',
                                            confirmButtonAriaLabel: 'Aceptar',
                                            cancelButtonAriaLabel: ''
                                        });
                                    }
                                })
                            } else {
                                MySwal.fire({
                                    icon: 'error',
                                    html: <div><br />
                                        <h3 className="text-center">Cantidad</h3>
                                        <div className={`modal-body`}>
                                            <h5 className="text-center">Captura alguna cantidad antes de continuar.</h5>
                                        </div>
                                    </div>,
                                    showCancelButton: false,
                                    confirmButtonText: `Ok`,
                                })
                            }
                        }
                        else {
                            MySwal.fire({
                                icon: 'error',
                                html: <div><br />
                                    <h3 className="text-center">Aviso</h3>
                                    <div className={`modal-body`}>
                                        <h5 className="text-center">Selecciona un rubro antes de continuar de continuar.</h5>
                                    </div>
                                </div>,
                                showCancelButton: false,
                                confirmButtonText: `Ok`,
                            })
                        }
                    }


                }

            }}>

            <Form>
                <div style={props.BloquearRegistros ? { pointerEvents: "none", opacity: "0.4" } : {}}>
                    <div className="columns is-centered is-mobile is-multiline">
                        <div className="column text-center is-full-desktop is-full-tablet is-full-mobile">
                            <hr style={{ border: "3px solid #000000" }}></hr>
                        </div>
                        <div className="column text-center  is-full-desktop is-full-tablet is-full-mobile">

                            <div className="mb-3">
                                <label className="form-label mb-0" htmlFor='Observaciones'>Motivo / Observaciones de la Solicitud</label>
                                <Field
                                    type="textarea"
                                    disabled={false}
                                    className="form-control"
                                    rows={3}
                                    id="Observaciones"
                                    name="Observaciones"
                                    placeholder="Observaciones"
                                    multiple={true}
                                // onChangeCapture={e => (console.log(e))} 
                                />
                                <ErrorMessage component="div" name="Observaciones" className="text-danger" />
                            </div>
                        </div>
                        <div className="column text-center is-half-desktop is-half-tablet is-full-mobile">

                            <div className="mb-3">
                                <label style={{ paddingBottom: '13px' }} className="form-label mb-0" htmlFor={"CuentaBancoID"}>Cuenta Bancaria:</label>
                                <div style={props.BloquearCuenta ? { pointerEvents: "none", opacity: "0.4" } : {}} className="mb-3">
                                    <Field name={"CuentaBancoID"} className="form-select"  >
                                        {(control: any) => (
                                            <select
                                                className="form-select"
                                                //options={state.optCuenta}                                                                  
                                                value={control.field.value}
                                                onChange={(value: any) => {
                                                    control.form.setFieldValue("CuentaBancoID", parseInt(value.target.value))
                                                    if (parseInt(value.target.value) > 0) {
                                                        MySwal.fire({
                                                            title: '<strong>Aceptar Solicitud</strong>',
                                                            icon: 'info',
                                                            html:
                                                                <div className="text-center">
                                                                    <br /> Una vez confirmada la cuenta, esta no podra ser cambiada durante la solicitud.
                                                                </div>,
                                                            showCloseButton: false,
                                                            showCancelButton: true,
                                                            showConfirmButton: true,
                                                            focusConfirm: false,
                                                            cancelButtonText: 'Cancelar',
                                                            confirmButtonText: 'Aceptar',
                                                            confirmButtonColor: '#3085d6',
                                                            cancelButtonColor: '#d33',
                                                            confirmButtonAriaLabel: 'Aceptar',
                                                            cancelButtonAriaLabel: '',
                                                        }).then((result) => {
                                                            if (result.isConfirmed) {
                                                                MySwal.close()
                                                                props.bloquearCta()
                                                            }
                                                            else {
                                                                MySwal.fire({
                                                                    title: '<strong>Aceptar Solicitud</strong>',
                                                                    icon: 'info',
                                                                    html:
                                                                        <div className="text-center">
                                                                            Operación cancelada por el usuario.
                                                                        </div>,
                                                                    showCloseButton: false,
                                                                    showCancelButton: false,
                                                                    showConfirmButton: true,
                                                                    focusConfirm: false,
                                                                    cancelButtonText: 'Cancelar',
                                                                    confirmButtonText: 'Aceptar',
                                                                    confirmButtonColor: '#3085d6',
                                                                    confirmButtonAriaLabel: 'Aceptar',
                                                                    cancelButtonAriaLabel: ''
                                                                }).then((result) => {
                                                                    if (result.isConfirmed) {
                                                                        MySwal.close()
                                                                        control.form.setFieldValue("CuentaBancoID", 0)

                                                                    }
                                                                })
                                                            }

                                                        })
                                                    } else {
                                                        control.form.setFieldValue("CuentaBancoID", 0)

                                                    }

                                                }
                                                }
                                                disabled={props.Id === undefined ? false : true}
                                                id={"CuentaBancoID"}
                                                name={"CuentaBancoID"}
                                            >
                                                <option value="0">{"Selecciona una cuenta"}</option>
                                                {props.OptionsCuentas.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                            </select>

                                        )}
                                    </Field>
                                    <ErrorMessage component="div" name={"CuentaBancoID"} className="text-danger" />
                                </div>
                            </div>
                        </div>
                        <div className="column text-center is-half-desktop is-half-tablet is-full-mobile">
                            <div className="mb-3">
                                <label className="form-label mb-0" htmlFor={"RubroID"}>Rubro:</label>
                            </div>
                            <div>
                                <Field name={"RubroID"} className="form-select"  >
                                    {(control: any) => (
                                        <select
                                            className="form-select"
                                            //options={state.optCuenta}                                                                  
                                            value={control.field.value}
                                            onChange={(value: any) => {
                                                control.form.setFieldValue("RubroID", parseInt(value.target.value))
                                                if (parseInt(value.target.value) > 0) {
                                                    //Validar si value.taret.value ya existe en props.Rubros
                                                    let existe = false
                                                    props.initialValues.Rubros.map((rubro, index) => {
                                                        if (rubro.RubroID === parseInt(value.target.value)) {
                                                            existe = true
                                                        }
                                                    })
                                                    if (!existe) {
                                                        let rubroObj = props.OptionsRubros.find((res: any) => {
                                                            return res.value === parseInt(value.target.value)
                                                        })
                                                        let a = {
                                                            RubroID: parseInt(value.target.value),
                                                            Total: 0,
                                                            Clave: rubroObj !== undefined && rubroObj.clave,
                                                            Descripcion: rubroObj !== undefined && rubroObj.descripcion,
                                                            SolicitudDetalleID: 0,
                                                            PermitirEvidencia: 0,
                                                        }
                                                        props.agregarRubro(a)
                                                        props.bloquearCta()


                                                    } else {
                                                        MySwal.fire(
                                                            {
                                                                icon: 'info',
                                                                html: <div><br />
                                                                    <h3 className="text-center">Aviso</h3>
                                                                    <div className={`modal-body`}>
                                                                        <h5 className="text-center">Rubro ya agregado, modifique Total si lo desea.</h5>
                                                                    </div>
                                                                </div>,
                                                                confirmButtonText: `Ok`,
                                                            }
                                                        );
                                                    }




                                                } else {
                                                    control.form.setFieldValue("RubroID", 0)

                                                }

                                            }
                                            }
                                            disabled={props.Id === undefined ? false : true}
                                            id={"RubroID"}
                                            name={"RubroID"}
                                        >
                                            <option value="0">{"Selecciona un rubro"}</option>
                                            {props.OptionsRubros.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                        </select>

                                    )}
                                </Field>
                                <ErrorMessage component="div" name={"RubroID"} className="text-danger" />
                            </div>
                        </div>
                    </div>
                    <div className="column text-center is-full-desktop is-full-tablet is-full-mobile">
                        <hr style={{ border: "3px solid #000000" }}></hr>
                    </div>
                    <div className="column text-center is-full-desktop is-full-tablet is-full-mobile">
                        <span>Habilita si el gasto aplica a otra sucursal distinta a la que opera el usuario:</span>
                    </div>

                    <div className="columns">
                        <div className="column text-center is-half-desktop is-full-tablet is-full-mobile" style={{ paddingLeft: "5%" }}>
                            <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                <br />
                                <label className="form-check-label">Genera gasto a otra sucursal</label>
                                <input
                                    className="form-check-input text-center"
                                    type="checkbox"
                                    checked={state.GeneraGasto}
                                    onChange={e => setState({ ...state, GeneraGasto: e.target.checked })}
                                />
                            </div>
                        </div>

                        <div className="column text-center is-half-desktop is-full-tablet is-full-mobile" style={{ paddingLeft: "25%", paddingTop: "5%" }}>
                            <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                <label className="form-check-label">Útil</label>
                                <input
                                    className="form-check-input text-center"
                                    type="checkbox"
                                    checked={state.Util}
                                    onChange={e => setState({ ...state, Util: e.target.checked })}
                                />
                            </div>
                        </div>
                    </div>


                    <div className="column text-center is-half-desktop is-full-tablet is-full-mobile">
                        <CustomSelect
                            disabled={!state.GeneraGasto}
                            label="Sucursal"
                            name="SucursalID"
                            placeholder="Seleccione una sucursal"
                            options={props.OptionsSucursales}
                            addDefault={false}
                            isMulti={false}
                        />
                    </div>
                    <div className="column text-center is-full-desktop is-full-tablet is-full-mobile">
                        <hr style={{ border: "3px solid #000000" }}></hr>
                    </div>
                </div>


                <div className="column text-center is-full-desktop is-full-tablet is-full-mobile">
                    <h3 className="text-center">Rubros</h3>
                    <DataTable
                        data={props.initialValues.Rubros}
                        striped
                        noDataComponent={<div>No hay rubros agregados</div>}
                        dense
                        noHeader
                        responsive
                        keyField={"SolicitudDetalleID"}
                        defaultSortField={"SolicitudDetalleID"}
                        columns={
                            [
                                {
                                    name: 'Id',
                                    selector: 'RubroID',
                                    sortable: false,
                                    center: true,

                                },
                                {
                                    center: true,
                                    name: 'Clave',
                                    selector: 'Clave',
                                    sortable: false,
                                },
                                {
                                    center: true,
                                    name: 'Descripción',
                                    selector: 'Descripcion',
                                    sortable: false,
                                    cell: (propss) =>
                                        <span className='text-center'>
                                            {propss.Descripcion}
                                        </span>
                                },

                                {
                                    name: 'Total',
                                    selector: 'Total',
                                    sortable: false,
                                    center: true,
                                    cell: (propss) =>
                                        <Field disabled={false} id={"Total" + propss.RubroID} name={"Total" + propss.RubroID}>
                                            {
                                                (control: any) => (
                                                    <input
                                                        type="number"
                                                        step='0'
                                                        min='0'
                                                        placeholder='0'
                                                        className="form-control text-center"
                                                        value={control.field.value}
                                                        defaultValue="0"
                                                        //pattern="\d{1,10}(.\d{1,2})?"
                                                        disabled={props.BloquearRegistros ? true : false}
                                                        onBlur={(value: any) => {
                                                            propss.Total = parseInt(value.target.value)
                                                            if (isNaN(propss.Total)) {
                                                                propss.Total = 0
                                                            }
                                                            if (propss.Total !== undefined) {
                                                                if (propss.totalNuevo !== undefined) {
                                                                    propss.totalAn = propss.totalNuevo
                                                                }
                                                                if (propss.totalAn === undefined) {
                                                                    //   props.calcularTotal(propss)
                                                                    propss.totalAn = propss.Total
                                                                }

                                                                if (parseFloat(propss.totalAn) !== parseFloat(propss.Total)) {
                                                                    propss.totalNuevo = parseFloat(propss.Total)
                                                                    //props.calcularTotal(propss)
                                                                    delete propss.totalAn
                                                                }
                                                            }
                                                        }}
                                                        onChange={(value: any) => {
                                                            control.form.setFieldValue("Total" + propss.RubroID, value.target.value)
                                                            let suma = parseInt(value.target.value)
                                                            console.log(suma)
                                                            propss.Total = suma
                                                        }}
                                                    />
                                                )
                                            }
                                        </Field>
                                },
                                {
                                    center: true,
                                    name: 'Acciones',
                                    selector: 'Acciones',
                                    sortable: true,
                                    width: '15%',
                                    style: { display: 'block;' },
                                    cell: (propss) =>
                                        <div className='text-center' style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                            {<>
                                                <button data-tip data-for="btnVer_1" style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"} onClick={() => {
                                                    props.eliminarRubro(propss)
                                                }}>
                                                    <FaEraser />
                                                    <ReactTooltip id="btnVer_1" type="info" effect="solid">
                                                        Eliminar rubro
                                                    </ReactTooltip>
                                                </button>
                                            </>}
                                        </div>
                                },
                                {
                                    center: true,
                                    name: 'Cargar cotización',
                                    selector: 'PermitirEvidencia',
                                    sortable: false,
                                    cell: propss => <div className='text-center'> {
                                        <button disabled={propss.PermitirEvidencia == 0 ? true : false} data-tip data-for={`btnSD_${propss.Solicitud}`} style={{ width: '100%', textAlign: 'center', paddingTop: '2px', paddingBottom: '2px' }} className="btn btn-primary" type={"button"}
                                            onClick={() => {
                                                console.log("PROPS initial ,", propss)
                                                props.fnMostrarCargaDeDocumento2()
                                                propss.DocumentoID == null ? props.setDocumentoID(propss.DocumentoID) : props.setDocumentoID(0)
                                                props.setSolicitudDetalleID(propss.SolicitudDetalleGasID)
                                            }
                                            }>SUBIR</button>
                                    } </div >,
                                },
                            ]}
                    />
                </div>

                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">

                        <br />
                        <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={
                            props.fnCancelar

                        }>
                            Cerrar
                        </button>
                        <button disabled={props.BloquearRegistros ? true : false} type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                            Guardar</button>
                    </div>
                }
            </Form>
        </Formik >
    )
}