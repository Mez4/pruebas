import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { ActionMultipleSelect, ActionSelect, CustomFieldText, Spinner } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { Nombre: string },
    SucursalesOptions: { value: number, label: string }[],
    UsuariosOptions: { value: number, label: string }[],
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

                // Finish the callback
                Funciones.FNAddGerente(props.oidc, { ...values })
                    .then((respuesta: any) => {
                        setLoading(false)
                        props.cbGuardar(respuesta);
                        toast.success("Se registró el gerente");
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

                <ActionSelect
                    disabled={loading}
                    label="Usuario"
                    name="UsuarioID"
                    placeholder="Seleccione el usuario"
                    options={props.UsuariosOptions}
                    addDefault={false}
                />
                <ActionMultipleSelect
                    disabled={loading}
                    label="Sucursal(es)"
                    name="SucursalesIDs"
                    placeholder="Seleccione la(s) sucursal(es)"
                    options={props.SucursalesOptions}
                    addDefault={false}
                />
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
