import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from '../../CompTesoreria/CatalogoCaja/Funciones'

import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { ActionAsyncSelect, ActionAsyncSelectDefault } from '../../../../../global'


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

    },


    fnGetClientes(Nombre: string, callback: any): any,

    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,

    options: { value: number, label: string }[],
    options2: { value: number, label: string }[],
    options3: { value: number, label: string }[],
    options4: { value: number, label: string }[],
    options5: { value: number, label: string }[],

}



export const CFormCrearCaja = (props: CFormType) => {



    const loadOptionsClientes = (inputText: string, callback: any) => {
        props.fnGetClientes(inputText, callback);
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
                UsuarioID: Yup.number().required("Seleccione el cajero").moreThan(0, 'Seleccione el cajero'),
                SucursalID: Yup.number().required("Seleccione la sucursal").moreThan(0, 'Seleccione la sucursal'),
                BovedaID: Yup.number().required("Seleccione la boveda").moreThan(0, 'Seleccione la boveda'),
                ResponsableID: Yup.number().required("Seleccione el responsable").moreThan(0, 'Seleccione el responsable'),

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
                        PersonaID: values.UsuarioID,
                        BovedaID: values.BovedaID,
                    }
                    values = agregarCaja
                    Funciones.FNAdd(props.Seguridad, values)
                        .then((respuesta: any) => {
                            resetForm({ values: '' })
                            setLoading(false)
                            props.cbGuardar(respuesta)
                        })
                        .catch((error: any) => {
                            if (error.response.status === 406) {
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
                        PersonaID: values.UsuarioID,
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
                    <div className="row">
                        <div className="col-12">
                            <CustomFieldText
                                disabled={loading}
                                label="Nombre:"
                                name="Nombre"
                                placeholder="Agregar Nombre"
                            />
                        </div>

                    </div>
                    <CustomFieldText
                        disabled={loading}
                        label="Descripción:"
                        name="Descripcion"
                        placeholder="Agregar Descripcion"
                    />
                    <div className="row">
                        <div className="col-6">
                            <CustomFieldText
                                disabled={props.Id === undefined ? false : true}
                                label="Clave:"
                                name="Clave"
                                placeholder="Agregar Clave"
                            />
                        </div>
                        <div className="col-6">
                            <CustomSelect
                                disabled={props.Id === undefined ? false : true}
                                label="Sucursal:"
                                name="SucursalID"
                                placeholder="Seleccione..."
                                options={props.options2}
                                addDefault={false}
                                isMulti={false}
                            />
                        </div>

                    </div>

                    <div className="row">
                        <div className="col-6">
                            {/*   <ActionSelect
                                disabled={props.Id === undefined ? false : true}
                                label="Cajero"
                                name="UsuarioID"
                                placeholder="Seleccione el cajero"
                                options={props.options}
                                addDefault={true}
                            /> */}
                            <ActionAsyncSelectDefault
                                loadOptions={loadOptionsClientes}
                                disabled={props.Id === undefined ? false : true}
                                label="Cajero:"
                                name="UsuarioID"
                                placeholder="Buscar cajero...."
                                options={props.options}
                                addDefault={false}
                                valor={props.initialValues.UsuarioID}
                                /*accion={cbCliente} */
                                noOptionsMessage={'No encontrado'}
                            />
                            {/* <CustomSelect
                                disabled={props.Id === undefined ? false : true}
                                label="Cajero:"
                                name="UsuarioID"
                                placeholder="Seleccione..."
                                options={props.options}
                                addDefault={false}
                                isMulti={false}
                            /> */}
                        </div>
                        <div className="col-6">
                            <CustomSelect
                                disabled={props.Id === undefined ? false : true}
                                label="Boveda:"
                                name="BovedaID"
                                placeholder="Seleccione..."
                                options={props.options4}
                                addDefault={false}
                                isMulti={false}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <ActionAsyncSelect
                                loadOptions={loadOptionsClientes}
                                disabled={props.Id === undefined ? false : true}
                                label="Responsable:"
                                name="ResponsableID"
                                placeholder="Buscar responsable...."
                                options={props.options}
                                addDefault={false}
                                valor={props.initialValues.ResponsableID}

                                /* valor={props.initialValues.ClienteId}
                                accion={cbCliente} */
                                noOptionsMessage={'No encontrado'}
                            />
                            {/*   <ActionSelect
                                disabled={props.Id === undefined ? false : true}
                                label="Responsable"
                                name="ResponsableID"
                                placeholder="Seleccione el responsable"
                                options={props.options}
                                addDefault={true}
                            /> */}
                            {/*        <CustomSelect
                                disabled={props.Id === undefined ? false : true}
                                label="Responsable:"
                                name="ResponsableID"
                                placeholder="Seleccione..."
                                options={props.options}
                                addDefault={false}
                                isMulti={false}
                            /> */}
                        </div>

                        <div className="col-6">
                            <br />
                            <CustomFieldCheckbox disabled={loading} label="Estatus" name="Estatus" />

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
