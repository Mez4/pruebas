import React from 'react'
import { Formik, Form, ErrorMessage, Field } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'

import { valueContainerCSS } from 'react-select/src/components/containers'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { valueEventAriaMessage } from 'react-select/src/accessibility'
import DataTable from 'react-data-table-component'
import { FaCircle } from 'react-icons/fa'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { ActionAsyncSelect, ActionAsyncSelectDefault } from '../../../../../global'
import * as ActSelec from '../../../../../global'


type CFormType = {
    Seguridad: IOidc,
    Id?: number
    initialValues: {
        CajaID: number,
        Nombre: String,
        Clave: String,
        Descripcion: String,
        Estatus: boolean,
        UsuarioID: number,
        SucursalID: number,
        CuentaID: number,
        BovedaID: number,
        ResponsableID: number,
        CanalesCobranza: boolean,
        UsuarioIDSeg: number,

    },

    fnGetBovedas(Boveda: number): any,
    fnGetClientes(Nombre: string, callback: any): any,
    fnGetClientes2(Nombre: string, callback: any): any,

    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,

    options: { value: number, label: string }[],
    options2: { value: number, label: string }[],
    options3: { value: number, label: string }[],
    options4: { value: number, label: string }[],
    options5: { value: number, label: string }[],
    options6: { value: number, label: string }[],

}



export const CForm = (props: CFormType) => {
    const loadOptionsClientes = (inputText: string, callback: any) => {
        props.fnGetClientes(inputText, callback);
    }
    const loadOptionsClientes2 = (inputText: string, callback: any) => {
        props.fnGetClientes2(inputText, callback);
    }
    const [loading, setLoading] = React.useState(false)
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                Nombre: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracteres").max(64, "Maximo 64 caracteres"),
                Clave: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracteres").max(8, "Maximo 8 caracteres"),
                Descripcion: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracteres").max(64, "Maximo 64 caracteres"),
                SucursalID: Yup.number().required("Seleccione la sucursal").moreThan(0, 'Seleccione la sucursal'),
                /*                 UsuarioIDSeg: Yup.number().required("Seleccione el cajero").moreThan(0, 'Seleccione el cajero'),
                 */
                /*  BovedaID: Yup.number().required("Seleccione la boveda").moreThan(0, 'Seleccione la boveda'),
                 ResponsableID: Yup.number().required("Seleccione el responsable").moreThan(0, 'Seleccione el responsable'),
  */
            })}
            onSubmit={(values: any, { resetForm }) => {
                setLoading(true)
                // Finish the callback
                if (props.Id === undefined) {

                    let agregarCaja: any = {
                        Nombre: values.Nombre,
                        Clave: values.Clave,
                        Descripcion: values.Descripcion,
                        Estatus: values.Estatus,
                        SucursalID: values.SucursalID,
                        CuentaID: values.CuentaID,
                        UsuarioIDSeg: values.UsuarioIDSeg,
                        BovedaID: values.BovedaID,
                        ResponsableID: values.ResponsableID,
                        CanalesCobranza: values.CanalesCobranza,


                    }
                    values = agregarCaja
                    Funciones.FNAdd(props.Seguridad, values)
                        .then((respuesta: any) => {
                            resetForm({ values: '' })
                            setLoading(false)
                            props.cbGuardar(respuesta)
                        })
                        .catch((error: any) => {
                            if (error.response.status == 406) {
                                toast.warning("Error, boveda no corresponde a la sucursal de la caja")
                            } else {
                                toast.error("Error al guardar la caja")
                                console.log(error)
                            }
                            setLoading(false)
                        })
                }
                else {
                    let actualizarCaja: any = {
                        CajaID: values.CajaID,
                        Nombre: values.Nombre,
                        Clave: values.Clave,
                        Descripcion: values.Descripcion,
                        Estatus: values.Estatus,
                        SucursalID: values.SucursalID,
                        CuentaID: values.CuentaID,
                        PersonaID: values.UsuarioIDSeg,
                        BovedaID: values.BovedaID,
                    }

                    values = actualizarCaja

                    Funciones.FNUpdate(props.Seguridad, { ...values, cajaId: props.Id as number })
                        .then((respuesta: any) => {
                            resetForm({ values: '' })
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            console.log(error.status)
                            alert("Error al actualizar la caja" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
            }}
        >
            <Form>

                <div>
                    <div className="columns is-desktop is-tablet is-multiline">
                        <div className="column is-full-desktop is-full-mobile">
                            <CustomFieldText
                                disabled={loading}
                                label="Nombre:"
                                name="Nombre"
                                placeholder="Agregar Nombre"
                            />
                        </div>
                        <div className="column is-full-desktop is-full-mobile">
                            <CustomFieldText
                                disabled={loading}
                                label="Descripción:"
                                name="Descripcion"
                                placeholder="Agregar Descripcion"
                            />
                        </div>

                        <div className="column is-half-desktop is-half-mobile">
                            <div className="mb-3">
                                <label className="form-label mb-0" htmlFor={"SucursalID"}>Sucursal</label>
                                <Field name={"SucursalID"} className="form-select"  >
                                    {(control: any) => (
                                        <select
                                            className="form-select"
                                            //options={state.optCuentas}                                                                  
                                            value={control.field.value}
                                            onChange={(value: any) => {
                                                control.form.setFieldValue("SucursalID", parseInt(value.target.value))
                                                /*  if (parseInt(value.target.value) !== 0) {
                                                     //aClert(parseInt(value.target.value))
                                                     props.fnGetBovedas(parseInt(value.target.value))
                                                 } else {
                                                     props.fnGetBovedas(parseInt(value.target.value))
                                                     //alert(parseInt(value.target.value))
                                                 } */
                                            }}
                                            disabled={props.Id === undefined ? false : true}
                                            id={"SucursalID"}
                                            name={"SucursalID"}>
                                            <option value="0">{"Selecciona una sucursal"}</option>
                                            {props.options2.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                        </select>

                                    )}
                                </Field>
                                <ErrorMessage component="div" name={"SucursalID"} className="text-danger" />
                            </div>
                        </div>
                        <div className="column is-half-desktop is-full-mobile">
                            <CustomFieldText
                                disabled={props.Id === undefined ? false : true}
                                label="Clave:"
                                name="Clave"
                                placeholder="Agregar Clave"
                            />
                        </div>
                        {/*  <div className="column is-half-desktop is-full-mobile">
                            <ActionAsyncSelect
                                loadOptions={loadOptionsClientes}
                                disabled={props.Id === undefined ? false : true}
                                label="Cajero:"
                                name="UsuarioIDSeg"
                                placeholder="Buscar cajero...."
                                options={props.options}
                                addDefault={false}
                                valor={props.initialValues.UsuarioIDSeg}
                                noOptionsMessage={'No encontrado'}
                            />
                        </div> */}
                        {/*  <div className="column is-half-desktop is-full-mobile">
                            <CustomSelect
                                disabled={props.Id === undefined ? false : true}
                                label="Boveda:"
                                name="BovedaID"
                                placeholder="Seleccione..."
                                options={props.options4}
                                addDefault={false}
                                isMulti={false}

                            />
                        </div> */}

                        {/*   <div className="column is-half-desktop is-full-mobile">
                            <ActionAsyncSelect
                                loadOptions={loadOptionsClientes2}
                                disabled={props.Id === undefined ? false : true}
                                label="Responsable:"
                                name="ResponsableID"
                                placeholder="Buscar responsable...."
                                options={props.options6}
                                addDefault={false}
                                valor={props.initialValues.ResponsableID}
                                noOptionsMessage={'No encontrado'}
                            />
                        </div> */}
                        <div className="column is-full-desktop is-full-mobile">
                            <div className="columns is-desktop is-tablet text-center">
                                <div className=" text-center column is-half-desktop is-full-mobile">
                                    <CustomFieldCheckbox disabled={loading} label="Estatus" name="Estatus" />
                                </div>
                                <div className=" text-center column is-half-desktop is-full-mobile">
                                    <CustomFieldCheckbox disabled={props.Id ? true : false} label="Canales Cobranza" name="CanalesCobranza" />
                                </div>
                            </div>
                        </div>

                    </div>
                    {loading && <Spinner />}
                    {!loading &&
                        <div className="text-end">
                            <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                Cancelar
                            </button>
                            <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                Ok
                            </button>
                        </div>
                    }
                </div>



            </Form>

        </Formik >
    )
}
