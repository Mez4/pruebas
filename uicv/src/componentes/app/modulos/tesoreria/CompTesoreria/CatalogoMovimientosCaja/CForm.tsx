import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { valueContainerCSS } from 'react-select/src/components/containers'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { idText } from 'typescript'

type CFormType = {
    Seguridad: IOidc,

    Id?: number,
    initialValues: {
        Id: number,
        CveMovimientoID: String,
        TipoMovimiento: String,
        Cargo: boolean,
        MovAgrupaID: number,
        AceptaDepositos: boolean,
        AceptaRetiros: boolean,
        Activa: boolean,
        ManejaEfectivo: boolean
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
export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                CveMovimientoID: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracter").max(4, "Maximo 4 caracteres"),
                TipoMovimiento: Yup.string().required("Campo obligatorio").min(1, "Minimo 4 caracteres").max(64, "Maximo 64 caracteres"),
                MovAgrupaID: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione el movimiento'),
            })}
            onSubmit={(values: any) => {
                //setLoading(true)
                if (props.Id === undefined) {
                    setLoading(true)
                    let agregarMovimientoCaja: any = {
                        CveMovimientoID: values.CveMovimientoID,
                        TipoMovimiento: values.TipoMovimiento,
                        Cargo: values.Cargo,
                        AceptaDepositos: values.AceptaDepositos,
                        AceptaRetiros: values.AceptaRetiros,
                        MovAgrupaID: values.MovAgrupaID,
                        Activa: values.Activa,
                        ManejaEfectivo: values.ManejaEfectivo
                    }
                    values = agregarMovimientoCaja
                    Funciones.FNAdd(props.Seguridad, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                        })
                        .catch((error: any) => {
                            toast.error("Error al guardar el movimiento, verifique los registros")
                            // alert("Error al guardar el movimiento" + JSON.stringify(error))
                            setLoading(false)
                        })

                    console.log("VALORES ", values)
                }
                else {
                    setLoading(true)

                    let actualizarMovimientoCaja: any = {
                        Id: values.Id,
                        CveMovimientoID: values.CveMovimientoID,
                        TipoMovimiento: values.TipoMovimiento,
                        Cargo: values.Cargo,
                        AceptaDepositos: values.AceptaDepositos,
                        AceptaRetiros: values.AceptaRetiros,
                        MovAgrupaID: values.MovAgrupaID,
                        Activa: values.Activa,
                        ManejaEfectivo: values.ManejaEfectivo
                    }
                    values = actualizarMovimientoCaja

                    console.log("VALUES ,", values)
                    Funciones.FNUpdate(props.Seguridad, props.Id, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            toast.error("Error al actualizar los movimientos, verifique los registros")
                            //alert("Error al actualizar el movimiento" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
            }}
        >
            <Form>
                <div className="container">
                    <div className="row columns">
                        <div className="column">
                            <CustomFieldText
                                disabled={loading}//props.Id=== undefined? false : true
                                label="Clave T. Movimiento:"
                                name="CveMovimientoID"
                                placeholder="Agregar Clave Movimiento"
                            />
                        </div>

                        <div className="column">
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
                    </div>
                    <div className='row coluns'>
                        <div className='column'>
                            <CustomFieldText
                                disabled={false}//props.Id=== undefined? false : true
                                label="Descripción:"
                                name="TipoMovimiento"
                                placeholder="Agregar descripcion"
                            />
                        </div>
                    </div>
                    {/*2-----------------------------------------------------------------*/}
                    <div className="row columns is-centered is-mobile is-multiline">
                        <div className="column is-align-items-center is-one-fifth-desktop is-half-tablet is-half-mobile">
                            <CustomFieldCheckbox disabled={props.Id === undefined ? false : true}
                                label="Cargo" name="Cargo" />
                        </div>
                        <div className="column is-align-items-center is-one-fifth-desktop is-half-tablet is-half-mobile">
                            <CustomFieldCheckbox disabled={loading} label="Acepta depósito" name="AceptaDepositos" />
                        </div>
                        <div className="column is-align-items-center is-one-fifth-desktop is-half-tablet is-half-mobile">
                            <CustomFieldCheckbox disabled={loading} label="Acepta Retiros" name="AceptaRetiros" />
                        </div>
                        <div className="column is-align-items-center is-one-fifth-desktop is-half-tablet is-half-mobile">
                            <CustomFieldCheckbox disabled={loading} label="Activa" name="Activa" />
                        </div>
                        <div className="column is-align-items-left is-one-fifth-desktop is-half-tablet is-half-mobile">
                            <CustomFieldCheckbox disabled={loading} label="Maneja Efectivo" name="ManejaEfectivo" />
                        </div>
                    </div>
                    {/*-----------------------------------------------------------------*/}
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
