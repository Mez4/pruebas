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
    ComisionesID: number,
    RenglonId?: number,
    initialValues: {
        DistribuidorNivelID: number,
        DistribuidorNivelIDOrigen: number,
        Activo: boolean,
        DiasMin: number,
        DiasMax: number,
        PorcComision: number,
        PorcComisionReal: number,
        porcMonedero: number,
        porcMonederoReal: number
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
                DistribuidorNivelID: Yup.number().required(`Seleccione el Nivel de ${DescripcionDistribuidor(1)}`).moreThan(0, `Seleccione el Nivel de ${DescripcionDistribuidor(1)}`),
                DistribuidorNivelIDOrigen: Yup.number().required(`Seleccione el Nivel Origen de ${DescripcionDistribuidor(1)}`).moreThan(0, `Seleccione el Nivel Origen de ${DescripcionDistribuidor(1)}`),
                DiasMin: Yup.number().required("Campo obligatorio"),
                DiasMax: Yup.number().required("Campo obligatorio"),
                PorcComision: Yup.number().required("Campo obligatorio"),
                PorcComisionReal: Yup.number().required("Campo obligatorio"),
                porcMonedero: Yup.number().required("Campo obligatorio"),
                porcMonederoReal: Yup.number().required("Campo obligatorio"),
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)

                // Finish the callback
                if (props.RenglonId === undefined)
                    Funciones.FNAdd(props.oidc, {
                        ...values,
                        ProductoID: props.ProductoID,
                        ComisionesID: props.ComisionesID
                    })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            toast.success("Se guardó la comisión")
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
                        ComisionesID: props.ComisionesID,
                        RenglonId: props.RenglonId as number
                    })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Se actualizó la comisión")
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
            <div className="col-2">
                    <label className="form-label mb-0" htmlFor="Renglon">Línea</label>
                    <input disabled={true} className="form-control" type="text" id="Renglon" name="Renglon" placeholder={props.RenglonId ? String(props.RenglonId) : 'Línea Nueva'} />
                </div>
                <br></br>
                <div className="row columns">
                <div className="column">
                <CustomSelect
                    disabled={loading || props.RenglonId != undefined}
                    label={`Nivel Origen`}
                    name="DistribuidorNivelIDOrigen"
                    placeholder={`Seleccione el Nivel de ${DescripcionDistribuidor(1)}`}
                    options={props.optNivelesOrigen}
                    addDefault={false}
                />
                </div>
                <div className="column">
                <CustomSelect
                    disabled={loading || props.RenglonId != undefined}
                    label={`Nivel de ${DescripcionDistribuidor(1)}`}
                    name="DistribuidorNivelID"
                    placeholder={`Seleccione el Nivel de ${DescripcionDistribuidor(1)}`}
                    options={props.optNiveles}
                    addDefault={false}
                />
                </div>
                </div>
                <div className="row columns">
                <div className="column">
                <CustomFieldText disabled={loading} label="Mínimo Días" name="DiasMin" placeholder="Mínimo de Días" />
                </div>
                <div className="column">
                <CustomFieldText disabled={loading} label="Máximo Días" name="DiasMax" placeholder="Máximo de Días" />
                </div>
                </div>
                <div className="row columns">
                <div className="column">
                <CustomFieldText disabled={loading} label="Porcentaje Comisión" name="PorcComision" placeholder="Porcentaje Comisión" />
                </div>
                <div className="column">
                <CustomFieldText disabled={loading} label="Porcentaje Comisión Real" name="PorcComisionReal" placeholder="Porcentaje Comisión Real" />
                </div>
                </div>
                <div className="row columns">
                <div className="column">
                <CustomFieldText disabled={loading} label="Porcentaje Monedero" name="porcMonedero" placeholder="Porcentaje Monedero" />
                </div>
                <div className="column">
                <CustomFieldText disabled={loading} label="Porcentaje Monedero Real" name="porcMonederoReal" placeholder="Porcentaje Monedero Real" />
                </div>
                </div>
                <CustomFieldCheckbox disabled={loading} label="Activa" name="Activo" />
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
                </div>
            </Form>
        </Formik>
    )
}
