import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { DescripcionDistribuidor } from '../../../../../../global/variables'

type CFormType = {
    oidc: IOidc
    ProductoID: number,
    CondicionesID: number,
    RenglonId?: number,
    initialValues: {
        DistribuidorNivelId: number,
        DistribuidorNivelOrigenID: number,
        Activo: boolean,
        PlazosMinimos: number,
        PlazosMaximos: number,
        ImporteMinimo: number,
        ImporteMaximo: number,
        ImporteMaximo1erCanje: number,
        ImporteMaximo2doCanje: number,
        ImporteMaximo3erCanje: number,
        ImporteMinimo1erCanje: number,
        ImporteMinimo2doCanje: number,
        ImporteMinimo3erCanje: number,
        PorcTasaPlazo: number,
        SeguroPlazo: number,
        PorcIVA: number,
        Cargo: number,
        ManejoCuenta: number,
        PlazosFijos: number,
        PorcTasaMensual: number,
        PorcTasaAnual: number,
        PagoXMilMinimo: number,
        PagoXMilMaximo: number,
        PlazosEspeciales: boolean,
        CapitalCorte: number,
        PorcCreditosActivosMax: number,
        CostoAnualTotal: number,
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    optNiveles: { value: number, label: string }[],
    optNivelesOrigen: { value: number, label: string }[],
    isUpdate: boolean
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                DistribuidorNivelId: Yup.number().required(`Seleccione el Nivel de ${DescripcionDistribuidor(1)}`).moreThan(0, `Seleccione el Nivel de ${DescripcionDistribuidor(1)}`),
                DistribuidorNivelOrigenID: Yup.number().required(`Seleccione el Nivel Origen de ${DescripcionDistribuidor(1)}`).moreThan(0, `Seleccione el Nivel Origen de ${DescripcionDistribuidor(1)}`),
                PlazosMinimos: Yup.number().required("Campo obligatorio").moreThan(0, 'Campo debe se mayor a 0'),
                PlazosMaximos: Yup.number().required("Campo obligatorio").moreThan(0, 'Campo debe se mayor a 0'),
                ImporteMinimo: Yup.number().required("Campo obligatorio").moreThan(0, 'Campo debe se mayor a 0'),
                ImporteMaximo: Yup.number().required("Campo obligatorio").moreThan(0, 'Campo debe se mayor a 0'),
                ImporteMaximo1erCanje: Yup.number().required("Campo obligatorio"),
                ImporteMaximo2doCanje: Yup.number().required("Campo obligatorio"),
                ImporteMaximo3erCanje: Yup.number().required("Campo obligatorio"),
                ImporteMinimo1erCanje: Yup.number(),
                ImporteMinimo2doCanje: Yup.number(),
                ImporteMinimo3erCanje: Yup.number(),
                PorcTasaPlazo: Yup.number().required("Campo obligatorio"),
                SeguroPlazo: Yup.number().required("Campo obligatorio"),
                PorcIVA: Yup.number().required("Campo obligatorio"),
                Cargo: Yup.number().required("Campo obligatorio"),
                ManejoCuenta: Yup.number().required("Campo obligatorio"),
                PlazosFijos: Yup.number().required("Campo obligatorio"),
                PorcTasaMensual: Yup.number().required("Campo obligatorio"),
                PorcTasaAnual: Yup.number().required("Campo obligatorio"),
                PagoXMilMinimo: Yup.number().required("Campo obligatorio"),
                PagoXMilMaximo: Yup.number().required("Campo obligatorio"),
                CapitalCorte: Yup.number().required("Campo obligatorio"),
                PorcCreditosActivosMax: Yup.number().required("Campo obligatorio"),
                CostoAnualTotal: Yup.number(),
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)

                // Finish the callback
                if (props.RenglonId === undefined)
                    Funciones.FNAdd(props.oidc, {
                        ...values,
                        ProductoID: props.ProductoID,
                        CondicionesID: props.CondicionesID
                    })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            toast.success("Se guardó el detalle de la condición")
                        })
                        .catch((error: any) => {
                            if (error.response)
                                toast.error(`Response Error: ${error.response.data}`)
                            else if (error.request)
                                toast.error(`Request ${error}`)
                            else
                                toast.error(`${error}`)
                            setLoading(false)
                        })
                else
                    Funciones.FNUpdate(props.oidc, {
                        ...values,
                        ProductoID: props.ProductoID,
                        CondicionesID: props.CondicionesID,
                        RenglonId: props.RenglonId
                    })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Se actualizó el detalle de la condición")
                        })
                        .catch((error: any) => {
                            if (error.response)
                                toast.error(`Response Error: ${error.response.data}`)
                            else if (error.request)
                                toast.error(`Request ${error}`)
                            else
                                toast.error(`${error}`)
                            setLoading(false)
                        })
            }}>
            <Form>
                <div className="container">
                    {/* <div className="row">
                        <div className="col-6">
                            <CustomSelect
                                disabled={props.isUpdate || loading}
                                label="Producto"
                                name="ProductoID"
                                placeholder="Seleccione el Producto"
                                options={props.optProductos}
                                addDefault={false}
                                isMulti={false}
                            />
                        </div>
                        <div className="col-6">
                            <CustomSelect
                                disabled={props.isUpdate || loading}
                                label="Sucursal"
                                name="SucursalId"
                                placeholder="Seleccione la Sucursal"
                                options={props.optSucursales}
                                addDefault={false}
                                isMulti={false}
                            />
                        </div>
                    </div> */}
                    <div className="row">
                        <div className="col-4">
                           
                                <label className="form-label mb-0" htmlFor="Renglon">Línea</label>
                                <input disabled={true} className="form-control" type="text" id="Renglon" name="Renglon" placeholder={props.RenglonId ? String(props.RenglonId) : 'Línea Nueva'} />
                        </div>
                        <div className="col-4">
                            <CustomSelect
                                disabled={loading || props.RenglonId != undefined}
                                label={`Nivel Origen de ${DescripcionDistribuidor(1)}`}
                                name="DistribuidorNivelOrigenID"
                                placeholder={`Seleccione el Nivel de ${DescripcionDistribuidor(1)}`}
                                options={props.optNivelesOrigen}
                                addDefault={false}
                            />
                        </div>
                        <div className="col-4">
                            <CustomSelect
                                disabled={loading || props.RenglonId != undefined}
                                label={`Nivel de ${DescripcionDistribuidor(1)}`}
                                name="DistribuidorNivelId"
                                placeholder={`Seleccione el Nivel de ${DescripcionDistribuidor(1)}`}
                                options={props.optNiveles}
                                addDefault={false}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4">
                            <CustomFieldText disabled={loading} label="Plazos Mínimos" name="PlazosMinimos" placeholder="Mínimo de Plazos" />
                        </div>
                        <div className="col-4">
                            <CustomFieldText disabled={loading} label="Plazos Máximos" name="PlazosMaximos" placeholder="Máximo de Plazos" />
                        </div>
                        <div className="col-4">
                            <CustomFieldText disabled={loading} label="Porcentaje Tasa plazo" name="PorcTasaPlazo" placeholder="Porcentaje de tasa mensual a aplicar al producto" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4">
                            <CustomFieldText disabled={loading} label="Importe Mínimo" name="ImporteMinimo" placeholder="Importe Mínimo" />
                        </div>
                        <div className="col-4">
                            <CustomFieldText disabled={loading} label="Importe Máximo" name="ImporteMaximo" placeholder="Importe Máximo" />
                        </div>
                        <div className="col-4">
                            <CustomFieldText disabled={loading} label="Seguro" name="SeguroPlazo" placeholder="Importe de protección de saldo por plazo para el producto" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4">
                            <CustomFieldText disabled={loading} label="Importe Máximo 1er Canje" name="ImporteMaximo1erCanje" placeholder="Importe Máximo 1er Canje" />
                        </div>
                        <div className="col-4">
                            <CustomFieldText disabled={loading} label="Importe Máximo 2do Canje" name="ImporteMaximo2doCanje" placeholder="Importe Máximo 2do Canje" />
                        </div>
                        <div className="col-4">
                            <CustomFieldText disabled={loading} label="Importe Máximo 3er Canje" name="ImporteMaximo3erCanje" placeholder="Importe Máximo 3er Canje" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4">
                            <CustomFieldText disabled={loading} label="Importe Mínimo 1er Canje" name="ImporteMinimo1erCanje" placeholder="Importe Mínimo 1er Canje" />
                        </div>
                        <div className="col-4">
                            <CustomFieldText disabled={loading} label="Importe Mínimo 2do Canje" name="ImporteMinimo2doCanje" placeholder="Importe Mínimo 2do Canje" />
                        </div>
                        <div className="col-4">
                            <CustomFieldText disabled={loading} label="Importe Mínimo 3er Canje" name="ImporteMinimo3erCanje" placeholder="Importe Mínimo 3er Canje" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4">
                            <CustomFieldText disabled={loading} label="Porcentaje de IVA " name="PorcIVA" placeholder="Porcentaje de IVA a aplicar a los accesorios del crédito" />
                        </div>
                        <div className="col-4">
                            <CustomFieldText disabled={loading} label="Manejo de Cuenta" name="ManejoCuenta" placeholder="Manejo de Cuenta" />
                        </div>
                        <div className="col-4">
                            <CustomFieldText disabled={loading} label="Plazos Fijos" name="PlazosFijos" placeholder="Número de plazos fijos" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4">
                            <CustomFieldText disabled={loading} label="Cargo" name="Cargo" placeholder="Importe de cargo fijo a cargar al crédito" />
                        </div>
                        <div className="col-4">
                            <CustomFieldText disabled={loading} label="Porcentaje Tasa Mensual" name="PorcTasaMensual" placeholder="Porcentaje Tasa Mensual" />
                        </div>
                        <div className="col-4">
                            <CustomFieldText disabled={loading} label="Porcentaje Tasa Anual" name="PorcTasaAnual" placeholder="Porcentaje Tasa Mensual" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4">
                            <CustomFieldText disabled={loading} label="Capital Corte" name="CapitalCorte" placeholder="Capital Corte" />
                        </div>
                        <div className="col-4">
                            <CustomFieldText disabled={loading} label="Pago por Mil Mínimo" name="PagoXMilMinimo" placeholder="Pago por Mil Mínimo" />
                        </div>
                        <div className="col-4">
                            <CustomFieldText disabled={loading} label="Pago por Mil Máximo" name="PagoXMilMaximo" placeholder="Pago por Mil Máximo" />
                        </div>
                    </div>
                    <div className="row">
                    <div className="col-4">
                            <CustomFieldText disabled={loading} label="Costo Anual Total" name="CostoAnualTotal" placeholder="Costo Anual Total" />
                        </div>
                    <div className="col-4 column is-one-third">
                        <CustomFieldCheckbox disabled={loading} label="Plazos Especiales" name="PlazosEspeciales"/>
                   </div>
                   <div className="col-4 d-flex column is-one-third">   
                            <CustomFieldCheckbox disabled={loading} label="Activa" name="Activo" />
                        </div>
                        </div>
                </div>
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                            Aceptar
                        </button>
                    </div>
                }
            </Form>
        </Formik>
    )
}
