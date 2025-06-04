import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'

import { valueContainerCSS } from 'react-select/src/components/containers'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'

type CFormType = {
    Seguridad: IOidc,
    idEliminar: number,
    Id?: number,
    initialValues: {
        id: number,
        cuenta: string,
        acumulaCuentaId: number,
        nombre: string,
        tipoId: number,
        naturalezaId: number,
        rubroId: number,
        empresaId: number,
        monedaId: number,
        tipoBancoID: number,
        activa: boolean,
        sucursalID: number
    },



    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    FnEliminar(item: any): any,
    modalEliminar: boolean,
    fnCancelar(): any,

    options: { value: number, label: string }[],
    options2: { value: number, label: string }[],
    options3: { value: number, label: string }[],
    options4: { value: number, label: string }[],
    options5: { value: number, label: string }[],
    options6: { value: number, label: string }[],
    options7: { value: number, label: string }[]
    options8: { value: number, label: string }[]

}



export const CForm = (props: CFormType) => {
    const optionSucursales: any[] = []

    const [state, setState] = React.useState({
        optionSucursales,
        sucursal: "",
        sucursalID: 0
    })
    const [loading, setLoading] = React.useState(false)
    console.log("PROPS ,", props.initialValues)
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={
                Yup.object().shape({
                    cuenta: Yup.string().required("Campo obligatorio").min(4, "Minimo 4 caracteres").max(64, "Maximo 64 caracteres"),
                    //acumulaCuentaId: Yup.number().required("Seleccione la cuenta acumula").moreThan(0, 'Seleccione la cuenta acumula'),
                    nombre: Yup.string().required("Campo obligatorio").min(4, "Minimo 4 caracteres").max(64, "Maximo 64 caracteres"),
                    //tipoId: Yup.number().required("Seleccione el tipo de cuenta").moreThan(0, 'Seleccione el tipo de cuenta'),
                    naturalezaId: Yup.number().required("Seleccione la naturaleza").moreThan(0, 'Seleccione la naturaleza'),
                    rubroId: Yup.number().required("Seleccione el rubro").moreThan(0, 'Seleccione la cuenta acumula'),
                    empresaId: Yup.number().required("Seleccione una empresa").moreThan(0, 'Seleccione la empresa'),
                    monedaId: Yup.number().required("Seleccione el tipo de moneda").moreThan(0, 'Seleccione el tipo de moneda'),
                    sucursalID: Yup.number().required("Seleccione la sucursal").moreThan(0, 'Seleccione la sucursal'),
                })}
            onSubmit={(values: any) => {
                setLoading(true)
                if (values.acumulaCuentaId === 0) {
                    values.acumulaCuenta = null
                }
                if (values.tipoBancoID === 0) {
                    values.tipoBancoID = null
                }
                if (values.sucursalID == null) {
                    values.sucursalID = -1
                }
                // Finish the callback
                if (props.Id === undefined) {
                    if (values.acumulaCuenta === null || values.tipoBancoID === null) {
                        if (values.tipoBancoID === null && values.acumulaCuenta === null) {
                            let cuentasContables: any = {
                                Cuenta: values.cuenta,
                                Nombre: values.nombre,
                                AcumulaCuentaID: null,
                                TipoID: values.tipoId,
                                NaturalezaID: values.naturalezaId,
                                RubroID: values.rubroId,
                                EmpresaID: values.empresaId,
                                CatMonedaSatID: values.monedaId,
                                TipoBancoId: null,
                                Activa: values.activa,
                                FechaRegistro: new Date(),
                                SucursalID: values.sucursalID

                            }
                            values = cuentasContables
                        } else if (values.tipoBancoID === null) {
                            let cuentasContables: any = {
                                Cuenta: values.cuenta,
                                Nombre: values.nombre,
                                AcumulaCuentaID: values.acumulaCuentaId,
                                TipoID: values.tipoId,
                                NaturalezaID: values.naturalezaId,
                                RubroID: values.rubroId,
                                EmpresaID: values.empresaId,
                                CatMonedaSatID: values.monedaId,
                                TipoBancoId: null,
                                Activa: values.activa,
                                FechaRegistro: new Date(),
                                SucursalID: values.sucursalID
                            }
                            values = cuentasContables

                        } else if (values.acumulaCuenta === null) {
                            let cuentasContables: any = {
                                Cuenta: values.cuenta,
                                Nombre: values.nombre,
                                AcumulaCuentaID: null,
                                TipoID: values.tipoId,
                                NaturalezaID: values.naturalezaId,
                                RubroID: values.rubroId,
                                EmpresaID: values.empresaId,
                                CatMonedaSatID: values.monedaId,
                                TipoBancoId: values.tipoBancoID,
                                Activa: values.activa,
                                FechaRegistro: new Date(),
                                SucursalID: values.sucursalID
                            }
                            values = cuentasContables
                        }
                    } else {
                        let cuentasContables: any = {
                            Cuenta: values.cuenta,
                            Nombre: values.nombre,
                            AcumulaCuentaID: values.acumulaCuentaId,
                            TipoID: values.tipoId,
                            NaturalezaID: values.naturalezaId,
                            RubroID: values.rubroId,
                            EmpresaID: values.empresaId,
                            CatMonedaSatID: values.monedaId,
                            TipoBancoId: values.tipoBancoID,
                            Activa: values.activa,
                            FechaRegistro: new Date(),
                            SucursalID: values.sucursalID
                        }
                        values = cuentasContables
                    }

                    Funciones.FNAdd(props.Seguridad, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)

                        })
                        .catch((error: any) => {
                            toast.error("Ocurrió, un problema al guardar los datos, verifique e intente nuevamente")
                            setLoading(false)
                        })
                }
                else {

                    if (values.acumulaCuenta === "Seleccione..." || values.acumulaCuenta === null || values.tipoBancoID === "Seleccione..." || values.tipoBancoID === null) {
                        if (values.acumulaCuenta === null && values.tipoBancoID === "Seleccione..." || (values.acumulaCuenta === "Seleccione..." && values.tipoBancoID === null) || (values.acumulaCuenta === undefined && values.tipoBancoID === null)) {
                            let actualizarCuenta: any = {
                                id: values.id,
                                Cuenta: values.cuenta,
                                Nombre: values.nombre,
                                AcumulaCuentaID: null,
                                TipoID: values.tipoId,
                                NaturalezaID: values.naturalezaId,
                                RubroID: values.rubroId,
                                EmpresaID: values.empresaId,
                                CatMonedaSatID: values.monedaId,
                                TipoBancoId: null,
                                Activa: values.activa,
                                FechaRegistro: values.fechaRegistro,
                                SucursalID: values.sucursalID
                            }
                            values = actualizarCuenta
                        } else if (values.acumulaCuenta === "Seleccione..." || values.acumulaCuenta === null || values.acumulaCuenta === 0) {
                            let actualizarCuenta: any = {
                                id: values.id,
                                Cuenta: values.cuenta,
                                Nombre: values.nombre,
                                AcumulaCuentaID: null,
                                TipoID: values.tipoId,
                                NaturalezaID: values.naturalezaId,
                                RubroID: values.rubroId,
                                EmpresaID: values.empresaId,
                                CatMonedaSatID: values.monedaId,
                                TipoBancoId: values.tipoBancoID,
                                Activa: values.activa,
                                FechaRegistro: values.fechaRegistro,
                                SucursalID: values.sucursalID
                            }
                            values = actualizarCuenta
                        } else if (values.tipoBancoID === "Seleccione..." || values.tipoBancoID === null || values.tipoBancoID === 0) {
                            let actualizarCuenta: any = {
                                id: values.id,
                                Cuenta: values.cuenta,
                                Nombre: values.nombre,
                                AcumulaCuentaID: values.acumulaCuentaId,
                                TipoID: values.tipoId,
                                NaturalezaID: values.naturalezaId,
                                RubroID: values.rubroId,
                                EmpresaID: values.empresaId,
                                CatMonedaSatID: values.monedaId,
                                TipoBancoId: null,
                                Activa: values.activa,
                                FechaRegistro: values.fechaRegistro,
                                SucursalID: values.sucursalID
                            }
                            values = actualizarCuenta
                        }

                    } else {
                        let actualizarCuenta: any = {
                            id: values.id,
                            Cuenta: values.cuenta,
                            Nombre: values.nombre,
                            AcumulaCuentaID: values.acumulaCuentaId,
                            TipoID: values.tipoId,
                            NaturalezaID: values.naturalezaId,
                            RubroID: values.rubroId,
                            EmpresaID: values.empresaId,
                            CatMonedaSatID: values.monedaId,
                            TipoBancoId: values.tipoBancoID,
                            Activa: values.activa,
                            FechaRegistro: values.fechaRegistro,
                            SucursalID: values.sucursalID
                        }
                        values = actualizarCuenta

                    }

                    Funciones.FNUpdate(props.Seguridad, { ...values, id: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al actualizar la cuenta" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
            }}
        >
            <Form>
                {props.modalEliminar &&
                    <div>
                        <h4> ¿Estás seguro que deseas eliminar la cuenta?</h4>
                        <br />
                        <br />
                        <br />
                        <div className="text-end">
                            <button type="button" className="ms-2 btn btn-success waves-effect waves-light " onClick={() => { props.FnEliminar(props.idEliminar) }}>Sí</button>
                            <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                }
                {!props.modalEliminar &&
                    <div>

                        <CustomFieldText

                            //isDisable={

                            disabled={props.Id === undefined ? false : true}
                            label="Cuenta:"
                            name="cuenta"
                            placeholder="Agregar Cuenta"
                        />

                        {/* <CustomFieldText

                            //isDisable={

                            disabled={props.Id === undefined ? false : true}
                            label="Nombre:"
                            name="nombre"
                            placeholder="Agregar nombre"
                        /> */}
                        <div className="row">
                            <div className="col-6">
                                <CustomSelect
                                    disabled={props.Id === undefined ? false : true}
                                    label="Acumula a:"
                                    name="acumulaCuentaId"
                                    placeholder="Seleccione..."
                                    options={props.options}
                                    addDefault={false}
                                    isMulti={false}
                                />
                            </div>
                            <div className="col-6">
                                <CustomSelect
                                    disabled={props.Id === undefined ? false : true}
                                    label="Sucursal:"
                                    name="sucursalID"
                                    placeholder="Seleccione..."
                                    options={props.options8}
                                    addDefault={false}
                                    isMulti={false}
                                />
                            </div>
                        </div>
                        <CustomFieldText
                            disabled={loading}
                            label="Nombre:"
                            name="nombre"
                            placeholder="Nombre Cuenta"
                        />

                        <div className="row">
                            <div className="col-4">
                                <CustomSelect
                                    disabled={props.Id === undefined ? false : true}
                                    label="Tipo:"
                                    name="tipoId"
                                    placeholder="Seleccione..."
                                    options={props.options2}
                                    addDefault={false}
                                    isMulti={false}
                                />
                            </div>
                            <div className="col-4">
                                <CustomSelect
                                    disabled={props.Id === undefined ? false : true}
                                    label="Naturaleza:"
                                    name="naturalezaId"
                                    placeholder="Seleccione..."
                                    options={props.options3}
                                    addDefault={false}
                                    isMulti={false}
                                />

                            </div>
                            <div className="col-4">
                                <CustomSelect
                                    disabled={props.Id === undefined ? false : true}
                                    label="Rubro:"
                                    name="rubroId"
                                    placeholder="Seleccione..."
                                    options={props.options4}
                                    addDefault={false}
                                    isMulti={false}
                                />

                            </div>

                        </div>


                        <div className="row">
                            <div className="col-4">

                                <CustomSelect
                                    disabled={props.Id === undefined ? false : true}
                                    label="Empresa:"
                                    name="empresaId"
                                    placeholder="Seleccione..."
                                    options={props.options5}
                                    addDefault={false}
                                    isMulti={false}
                                />
                            </div>
                            <div className="col-4">

                                <CustomSelect
                                    disabled={props.Id === undefined ? false : true}
                                    label="Moneda:"
                                    name="monedaId"
                                    placeholder="Seleccione..."
                                    options={props.options6}
                                    addDefault={false}
                                    isMulti={false}
                                />
                            </div>
                            <div className="col-4">
                                <br />
                                <div className="row">
                                    <div className="col-12">
                                        <CustomFieldCheckbox disabled={loading} label="Activa" name="activa" />
                                    </div>


                                </div>
                                {/*  <CustomSelect
                                    disabled={loading}
                                    label="Tipo Banco:"
                                    name="tipoBancoID"
                                    placeholder="Seleccione..."
                                    options={props.options7}
                                    addDefault={false}
                                    isMulti={false}
                                /> */}

                            </div>

                        </div>

                        <div className="row">
                            <div className="col-4">
                                {/* <div className="row">
                                    <div className="col-12">
                                        <CustomFieldCheckbox disabled={loading} label="Activa" name="activa" />
                                    </div>


                                </div> */}
                            </div>
                            <div className="col-4"></div>
                            <div className="col-4"></div>

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
