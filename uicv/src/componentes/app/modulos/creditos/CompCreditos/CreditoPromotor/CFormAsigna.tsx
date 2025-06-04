import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { ActionSelect, CustomFieldText, Spinner } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { Sucursales, Usuarios } from '../../../../../selectores'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { creditoPromotorNombre: string, activo: boolean },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
}

export const CFormAsigna = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                UsuarioID: Yup.number().required("Campo obligatorio"),
                SucursalID: Yup.number().required("Campo obligatorio"),
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)

                console.log(values)
                // Finish the callback
                Funciones.FNAddPromotor(props.oidc, { ...values, creditoPromotorId: props.Id as number })
                    .then((respuesta: any) => {
                        setLoading(false)
                        props.cbGuardar(respuesta);
                        toast.success("Se registro el promotor");
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

            }}>
            <Form>
                {/* <Usuarios oidc={props.oidc} unaLinea disabled={loading} name={'UsuarioID'} />
                <Sucursales disabled={loading} IsAction unaLinea name={'SucursalID'} ProductoID={props.Id} valor={0} /> */}
                <Usuarios
                    oidc={props.oidc}
                    IsAction
                    disabled={loading}
                    name={"UsuarioID"}
                />
                <Sucursales disabled={loading} IsAction name={'SucursalID'} ProductoID={props.Id} valor={0} />
                {/* <ActionSelect
                disabled={loading}
                label="Sucursal"
                name="SucursalID"
                placeholder="Seleccione una sucursal"
                options={state.optSucursales}
                addDefault={false}
                valor={0}
                // accion={cbSucursal}
                //ref={refSucursal}
                /> */}
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
