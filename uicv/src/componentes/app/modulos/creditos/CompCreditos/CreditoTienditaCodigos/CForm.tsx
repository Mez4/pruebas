import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, CustomFieldText2, Spinner } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { Clientes, Distribuidores, Sucursales } from '../../../../../selectores'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { SKU: number, Descuento: number, SucursalID: number, DistribuidorID: number, Motivo: string, ClienteID: number },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    ProductoID: number
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                SKU: Yup.number().required("Ingrese SKU").moreThan(0, "Ingrese SKU"),
                Descuento: Yup.number().required("Ingrese Descuento%").moreThan(0, "Ingrese Descuento%"),
                Motivo: Yup.string().required("Campo obligatorio").min(5, "Minimo 5 caracter").max(150, "Maximo 150 caracteres"),
                SucursalID: Yup.number().required("Seleccione la sucursal").moreThan(0, 'Seleccione la sucursal'),
                // DistribuidorID: Yup.number().required("Seleccione la socia").moreThan(0, 'Seleccione la socia'),
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)

                // Finish the callback
                if (props.Id === undefined)
                    Funciones.FNAdd(props.oidc, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            toast.success("Se guardó el Código")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            if (error.response)
                                toast.error(`Response Error: ${error.response.data}`)
                            else if (error.request)
                                toast.error(`Request ${error}`)
                            else
                                toast.error(`${error}`)
                        })
                else
                    Funciones.FNUpdate(props.oidc, { ...values, CodigoID: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Se actualizó el Código")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al actualizar el Código")
                        })

            }}>
            {({ values }) => (
                <Form>
                    <div className="container">
                        <div className="columns is-desktop is-tablet">
                            <div className="column is-one-third-desktop is-half-tablet is-full-mobile">
                                <Sucursales disabled={loading} name={'SucursalID'} ProductoID={props.ProductoID} valor={values.SucursalID} IsAction />
                            </div>
                            <div className="column is-one-third-desktop is-half-tablet is-full-mobile">
                                <Distribuidores disabled={values.SucursalID <= 0} SucursalID={isNaN(values.SucursalID) ? 0 : values.SucursalID} name={'DistribuidorID'} RequiereSuc />
                            </div>
                            <div className="column is-one-third-desktop is-half-tablet is-full-mobile">
                                <Clientes
                                    disabled={values.DistribuidorID <= 0}
                                    DistribuidorID={values.DistribuidorID}
                                    name={"ClienteID"}
                                    SucursalID={values.SucursalID}
                                />
                            </div>
                        </div>
                        <div className="columns is-desktop is-tablet">
                            <div className="column is-one-two-desktop is-half-tablet is-full-mobile">
                                <CustomFieldText disabled={loading || props.Id != undefined} label="SKU" name="SKU" placeholder="Ingrese SKU" />
                            </div>
                            <div className="column is-one-two-desktop is-half-tablet is-full-mobile">
                                <CustomFieldText disabled={loading} label="Descuento%" name="Descuento" placeholder="Ingrese Descuento%" />
                            </div>
                        </div>
                        <div className="columns is-desktop is-tablet">
                            <div className="column is-full-desktop is-half-tablet is-full-mobile">
                                <CustomFieldText disabled={loading} label="Motivo" name="Motivo" placeholder="Ingrese Motivo" />
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
            )}
        </Formik>
    )
}
