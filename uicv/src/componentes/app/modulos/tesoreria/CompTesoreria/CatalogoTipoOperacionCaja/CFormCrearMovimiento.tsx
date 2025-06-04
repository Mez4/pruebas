import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from '../../CompTesoreria/CatalogoMovimientosCaja/Funciones'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    Seguridad: IOidc,

    Id?: number,
    initialValues: {
        Id: number,
        CveMovimientoID: String,
        TipoMovimiento: String,
        Cargo: boolean,
        usuario: boolean,
        CorresponsalId: number,
        gastosRubroID: number,
        MovAgrupaID: number,
        AceptaDepositos: boolean,
        AceptaRetiros: boolean,
        AplicaIva: boolean,
        ManejaCuentasdeOrden: boolean,
        AplicaIde: boolean,
        PagaInteres: boolean,
        TasaInteres: number,
        RetieneIsr: boolean,
        MontoApertura: number,
        MontoMaximo: number,
        AplicaComision: boolean,
        MontoComision: number,
        DepositoId: number,
        RetiroId: number,
        ComisionId: number,
        IvaId: number,
        ProductoId: number,
        Activa: boolean
    },

    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,

    options: { value: number, label: string }[],
    optionsMovimiento: { value: number, label: string }[],
    optionsRubro: { value: number, label: string }[],
    optionsCorresponsal: { value: number, label: string }[]
    optionsProducto: { value: number, label: string }[]
}
export const CFormCrearMovimiento = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                CveMovimientoID: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracter").max(4, "Maximo 4 caracteres"),
                TipoMovimiento: Yup.string().required("Campo obligatorio").min(1, "Minimo 4 caracteres").max(64, "Maximo 64 caracteres"),
                MovAgrupaID: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione el movimiento'),
                ProductoId: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione el producto'),
            })}
            onSubmit={(values: any) => {
                setLoading(true)
                if (values.DepositoId === null) {
                    values.DepositoId = 0
                }
                if (values.RetiroId === null) {
                    values.RetiroId = 0
                }
                if (values.ProductoId === null) {
                    values.ProductoId = 0
                }

                if (values.IvaId === null) {
                    values.IvaId = 0
                }

                if (values.ComisionId === null) {
                    values.ComisionId = 0
                }
                // Finish the callback
                let agregarMovimientoCaja: any = {
                    CveMovimientoID: values.CveMovimientoID,
                    TipoMovimiento: values.TipoMovimiento,
                    Cargo: values.Cargo,
                    usuario: values.usuario,
                    CorresponsalId: values.CorresponsalId,
                    gastosRubroID: values.gastosRubroID,
                    AceptaDepositos: values.AceptaDepositos,
                    AceptaRetiros: values.AceptaRetiros,
                    AplicaIva: values.AplicaIva,
                    ManejaCuentasdeOrden: values.ManejaCuentasdeOrden,
                    AplicaIde: values.AplicaIde,
                    PagaInteres: values.PagaInteres,
                    TasaInteres: values.TasaInteres,
                    RetieneIsr: values.RetieneIsr,
                    MontoApertura: values.MontoApertura,
                    MontoMaximo: values.MontoMaximo,
                    AplicaComision: values.AplicaComision,
                    MontoComision: values.MontoComision,
                    DepositoId: values.DepositoId,
                    RetiroId: values.RetiroId,
                    ComisionId: values.ComisionId,
                    IvaId: values.IvaId,
                    Activa: values.Activa,
                    MovAgrupaID: values.MovAgrupaID,
                    ProductoId: parseInt(values.ProductoId)

                }
                values = agregarMovimientoCaja
                Funciones.FNAdd(props.Seguridad, values)
                    .then((respuesta: any) => {
                        setLoading(false)
                        props.fnCancelar()
                        toast.success('El movimiento se agregó correctamente')

                    })
                    .catch((error: any) => {
                        toast.error("Error al guardar el movimiento, verifique los registros")
                        // alert("Error al guardar el movimiento" + JSON.stringify(error))
                        setLoading(false)
                    })


            }}
        >
            <Form>
                <div>
                    <div className="row">
                        <div className="col-6">
                            <CustomFieldText
                                disabled={props.Id === undefined ? false : true}//props.Id=== undefined? false : true
                                label="Clave Tipo Movimiento:"
                                name="CveMovimientoID"
                                placeholder="Agregar Clave Movimiento"
                            />
                        </div>
                        <div className="col-6">
                            <CustomFieldText
                                disabled={props.Id === undefined ? false : true}//props.Id=== undefined? false : true
                                label="Tipo Movimiento:"
                                name="TipoMovimiento"
                                placeholder="Agregar descripcion"
                            />
                        </div>

                    </div>
                    {/*1-----------------------------------------------------------------*/}
                    <div className="row">
                        <div className="col-3">
                            <CustomFieldCheckbox disabled={loading} label="Cargo" name="Cargo" />
                        </div>
                        <div className="col-3">
                            <CustomFieldCheckbox disabled={loading} label="Usuario" name="usuario" />
                        </div>
                        <div className="col-3">
                            <CustomFieldCheckbox disabled={loading} label="Acepta depositos" name="AceptaDepositos" />
                        </div>
                        <div className="col-3">
                            <CustomFieldCheckbox disabled={loading} label="Aplica IVA" name="AplicaIva" />
                        </div>
                    </div>
                    {/*2-----------------------------------------------------------------*/}
                    <div className="row">
                        <div className="col-3">
                            <CustomFieldCheckbox disabled={loading} label="Aplica Ide" name="AplicaIde" />
                        </div>

                        <div className="col-3">
                            <CustomFieldCheckbox disabled={loading} label="Paga Intereses" name="PagaInteres" />

                        </div>
                        <div className="col-3">
                            <CustomFieldCheckbox disabled={loading} label="Retiene Isr" name="RetieneIsr" />

                        </div>
                        <div className="col-3">
                            <CustomFieldCheckbox disabled={loading} label="Aplica Comisión" name="AplicaComision" />
                        </div>
                    </div>
                    {/*-----------------------------------------------------------------*/}
                    <div className="row">
                        <div className="col-3">
                            <CustomFieldCheckbox disabled={loading} label="Acepta Retiros" name="AceptaRetiros" />
                        </div>
                        <div className="col-3">
                            <CustomFieldCheckbox disabled={loading} label="Maneja Cuentas de Orden" name="ManejaCuentasdeOrden" />
                        </div>
                    </div>
                    {/*-----------------------------------------------------------------*/}
                    <div className="row">
                        <div className="col-3">
                            <CustomFieldText
                                disabled={loading}//props.Id=== undefined? false : true
                                label="Tasa de Interes:"
                                name="TasaInteres"
                                placeholder="Agregar tasa de Interes"
                            />
                        </div>
                        <div className="col-3">
                            <CustomFieldText
                                disabled={loading}//props.Id=== undefined? false : true
                                label="Monto de Apertura:"
                                name="MontoApertura"
                                placeholder="Agregar Monto de Apertura"
                            />
                        </div>
                        <div className="col-3">
                            <CustomFieldText
                                disabled={loading}//props.Id=== undefined? false : true
                                label="Monto Maximo:"
                                name="MontoMaximo"
                                placeholder="Agregar Monto Maximo"
                            />
                        </div>
                        <div className="col-3">
                            <CustomFieldText
                                disabled={loading}//props.Id=== undefined? false : true
                                label="Monto de Comisión:"
                                name="MontoComision"
                                placeholder="Agregar Monto Comisión"
                            />
                        </div>
                    </div>
                    {/*-----------------------------------------------------------------*/}
                    <div className="row">
                        <div className="col-3">
                            <CustomSelect
                                disabled={loading}
                                label="Gastos Rubro::"
                                name="gastosRubroID"
                                placeholder="Seleccione..."
                                options={props.optionsRubro}
                                addDefault={false}
                                isMulti={false}
                            />
                        </div>
                        <div className="col-3">
                            <CustomSelect
                                disabled={loading}
                                label="Movimiento Agrupa:"
                                name="MovAgrupaID"
                                placeholder="Seleccione..."
                                options={props.optionsMovimiento}
                                addDefault={false}
                                isMulti={false}
                            />
                        </div>
                        <div className="col-3">
                            <CustomSelect
                                disabled={loading}
                                label="Corresponsal:"
                                name="CorresponsalId"
                                placeholder="Seleccione..."
                                options={props.optionsCorresponsal}
                                addDefault={false}
                                isMulti={false}
                            />
                        </div>
                        <div className="col-3">
                            <CustomSelect
                                disabled={props.Id === undefined ? false : true}
                                label="Producto:"
                                name="ProductoId"
                                placeholder="Seleccione..."
                                options={props.optionsProducto}
                                addDefault={false}
                                isMulti={false}
                            />
                        </div>
                    </div>
                    {/*-----------------------------------------------------------------*/}
                    <div className="row">
                        <div className="col-6">
                            <CustomSelect
                                disabled={loading}
                                label="Retiro:"
                                name="RetiroId"
                                placeholder="Seleccione..."
                                options={props.options}
                                addDefault={false}
                                isMulti={false}
                            />
                        </div>
                        <div className="col-6">
                            <CustomSelect
                                disabled={loading}
                                label="Deposito:"
                                name="DepositoId"
                                placeholder="Seleccione..."
                                options={props.options}
                                addDefault={false}
                                isMulti={false}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <CustomSelect
                                disabled={false}
                                label="Comisión:"
                                name="ComisionId"
                                placeholder="Seleccione..."
                                options={props.options}
                                addDefault={false}
                                isMulti={false}
                            />
                        </div>
                        <div className="col-6">
                            <CustomSelect
                                disabled={loading}
                                label="IVA:"
                                name="IvaId"
                                placeholder="Seleccione..."
                                options={props.options}
                                addDefault={false}
                                isMulti={false}
                            />
                        </div>
                    </div>
                    <CustomFieldCheckbox disabled={loading} label="Activa" name="Activa" />
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
        </Formik>
    )
}
