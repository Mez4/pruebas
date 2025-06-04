import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { valueContainerCSS } from 'react-select/src/components/containers'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { valueEventAriaMessage } from 'react-select/src/accessibility'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import DataTable from 'react-data-table-component'
import { FaCheckSquare, FaRegSquare, FaTrash } from 'react-icons/fa'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ActionAsyncSelect, ActionAsyncSelectDefault } from '../../../../../global'
import { BackHandler } from 'react-native'

type CFormType = {
    Seguridad: IOidc,
    Id?: number,

    initialValues: {
        BovedaID: number,
        Nombre: String,
        Clave: String,
        PersonaID: number,
        //BancoID: number,
        CuentaID: number,
        Activa: boolean,
        SucursalID: number,
        NombreResponsble: string,
        NombreCuentaContable: string

    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    abrirModalBancos(): any,
    FnEliminar(item: any): any,
    agregarCuentaBanco(item: any, bovedaId: any, nombre: any, clave: any, personaId: any, sucursalId: any, cuentaId: any): any,
    eliminarRegistro(item: any): any,
    activarDesactivarConcepto: any
    fnGetClientes(Nombre: string, callback: any): any,

    options: { value: number, label: string, usuarioId: string }[],
    options2: { value: number, label: string }[],
    options3: { value: number, label: string }[],
    OptionsBancosNuevos: { value: number, label: string }[],

}

export const CForm = (props: CFormType) => {
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = React.useState(false)
    const loadOptionsClientes = (inputText: string, callback: any) => {
        props.fnGetClientes(inputText, callback);
    }
    return (
        <Formik
            enableReinitialize
            initialValues={props.initialValues}
            validationSchema={Yup.object().shape({
                Nombre: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracteres").max(64, "Maximo 64 caracteres"),
                Clave: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracteres").max(8, "Maximo 8 caracteres"),
                PersonaID: Yup.number().required("Seleccione el cajero").moreThan(0, 'Seleccione el cajero'),
                CuentaID: Yup.number().required("Seleccione la cuenta").moreThan(0, 'Seleccione la cuenta'),
                SucursalID: Yup.number().required("Seleccione la sucursal").moreThan(0, 'Seleccione la sucursal'),

            })}
            onSubmit={(values: any, { resetForm }) => {
                if (props.Id === undefined) {
                    let agregarTodo: any[] = []
                    let agregarCuentasBanco = {
                        Nombre: values.Nombre,
                        Clave: values.Clave,
                        Activa: values.Activa,
                        CuentaID: values.CuentaID,
                        PersonaID: values.PersonaID,
                        SucursalID: values.SucursalID
                    }
                    values = agregarCuentasBanco
                    setLoading(true)

                    Funciones.FNAdd(props.Seguridad, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            resetForm({ values: '' })
                        })
                        .catch((error: any) => {
                            toast.error("Error al guardar la bóveda.")
                            setLoading(false)
                        })
                }
                else {
                    setLoading(true)

                    let actualizarCuentasBanco = {
                        bovedaId: values.bovedaId,
                        Nombre: values.Nombre,
                        Clave: values.Clave,
                        Activa: values.Activa,
                        // BancoID: values.BancoID,
                        CuentaID: values.CuentaID,
                        PersonaID: values.PersonaID,
                        SucursalID: values.SucursalID
                    }
                    console.log("antes de actualizar", actualizarCuentasBanco);
                    values = actualizarCuentasBanco
                    Funciones.FNUpdate(props.Seguridad, { ...values, bovedaId: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            toast.error("Error al actualizar la bóveda, verifique sus datos")
                            // alert("Error al actualizar la boveda" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
            }}
        >
            <Form>
                {!props.Id &&
                    /*Agregar nuevo
                    --------------------------------------------*/
                    <div>
                        <CustomFieldText
                            disabled={props.Id === undefined ? false : true}
                            label="Nombre:"
                            name="Nombre"
                            placeholder="Agregar Nombre"
                        />
                        <CustomFieldText
                            disabled={false}
                            label="Clave:"
                            name="Clave"
                            placeholder="Agregar Clave"
                        />
                        <div className="mb-3">
                            <ActionAsyncSelectDefault
                                loadOptions={loadOptionsClientes}
                                disabled={props.Id === undefined ? false : true}
                                label="Responsable:"
                                name="PersonaID"
                                placeholder="Buscar responsable...."
                                options={props.options}
                                addDefault={false}
                                valor={props.initialValues.PersonaID}
                                /*accion={cbCliente} */
                                noOptionsMessage={'No encontrado'}
                            />

                        </div>
                        <div className="mb-3">
                            <CustomSelect
                                disabled={props.Id === undefined ? false : true}
                                label="Cuenta Banco:"
                                name="CuentaID"
                                placeholder="Seleccione la cuenta banco..."
                                options={props.options3}
                                addDefault={false}
                                isMulti={false}
                            />
                        </div>

                        <div className="mb-3">
                            <CustomSelect
                                disabled={props.Id === undefined ? false : true}
                                label="Sucursal:"
                                name="SucursalID"
                                placeholder="Selecciona la sucursal..."
                                options={props.options2}
                                addDefault={false}
                                isMulti={false}
                            />
                        </div>

                        <div className="mb-3">
                            <CustomFieldCheckbox disabled={loading} label="Activa" name="Activa" />
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
                }
                {props.Id &&
                    /*actualizar
              --------------------------------------------*/
                    <div>

                        <CustomFieldText
                            disabled={false}
                            label="Nombre:"
                            name="Nombre"
                            placeholder="Agregar Nombre"
                        />
                        <CustomFieldText
                            disabled={false}
                            label="Clave:"
                            name="Clave"
                            placeholder="Agregar Clave"
                        />
                        <div className="mb-3">
                            <CustomSelect
                                disabled={props.Id === undefined ? false : true}
                                label={"Responsable: " + props.initialValues.NombreResponsble}
                                name="PersonaID"
                                placeholder="Seleccione el cajero..."
                                options={props.options}
                                addDefault={false}
                                isMulti={false}
                            />
                        </div>
                        <div className="mb-3">
                            <CustomSelect
                                disabled={props.Id === undefined ? false : true}
                                label={"Cuenta Banco: " + props.initialValues.NombreCuentaContable}
                                name="CuentaID"
                                placeholder="Seleccione la cuenta..."
                                options={props.options3}
                                addDefault={false}
                                isMulti={false}
                            />
                        </div>
                        <CustomSelect
                            disabled={props.Id === undefined ? false : true}
                            label="Sucursal:"
                            name="SucursalID"
                            placeholder="Selecciona la sucursal..."
                            options={props.options2}
                            addDefault={false}
                            isMulti={false}
                        />
                        <div className="mb-3">
                            <CustomFieldCheckbox disabled={loading} label="Activa" name="Activa" />
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
                }
            </Form>
        </Formik>
    )
}



