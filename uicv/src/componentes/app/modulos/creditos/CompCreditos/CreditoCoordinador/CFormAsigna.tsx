import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { ActionMultipleSelect, ActionSelect, CustomFieldText, Spinner } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { Sucursales } from '../../../../../selectores'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { Nombre: string, SucursalID: number, ClasificadorID: number, PersonaID: number, UsuarioID: number },
    UsuariosOptions: { value: number, label: string }[],
    cbChangeUsuario(item: any): any,
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    cbChangeSucursal(item: any): any,
    fnCancelar(): any,
}

export const CFormAsigna = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            /* validationSchema={Yup.object().shape({
                UsuarioID: Yup.number().required("Campo obligatorio"),
                SucursalID: Yup.number().required("Campo obligatorio"),
            })} */
            onSubmit={(values: any) => {
                // Set our form to a loading state
                setLoading(true)

                // Finish the callback
                Funciones.FNAddCoordinador(props.oidc, { SucursalID: values.SucursalID, ClasificadorID: values.ClasificadorID, PersonaID: values.PersonaID, ProductoID: props.Id })
                    .then((respuesta: any) => {
                        setLoading(false)
                        props.cbGuardar(respuesta);
                        toast.success("Se registró el coordinador");
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
                <ActionSelect
                    disabled={loading}
                    label="Usuario"
                    name="UsuarioID"
                    placeholder="Seleccione el usuario"
                    options={props.UsuariosOptions}
                    addDefault={false}
                    accion={props.cbChangeUsuario}
                />
                <Sucursales
                    disabled={loading}
                    label="Sucursal"
                    name="SucursalID"
                    IsAction={true}
                    Permiso={false}
                    onChange={props.cbChangeSucursal}
                    ProductoID={props.Id}
                    valor={props.initialValues.SucursalID}
                />
                <CustomFieldText disabled={true} label="Clasificador" name="ClasificadorID" placeholder="Clasificador grupo" />
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
