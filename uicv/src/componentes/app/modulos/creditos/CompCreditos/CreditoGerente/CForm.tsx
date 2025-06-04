import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { ActionMultipleSelect, ActionSelect, CustomFieldText, CustomFieldText2, CustomSelect2, Spinner } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { Sucursales } from '../../../../../selectores'

type CFormType = {
    oidc: IOidc
    Id?: number,
    ProdID: number,
    initialValues: { Nombre: string, SucursalesIDs: number[], UsuarioID: number },
    SucursalesOptions: { value: number, label: string }[],
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                Nombre: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracter").max(64, "Maximo 64 caracteres")
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)

                Funciones.FNUpdate(props.oidc, { ...values, ProdID: props.ProdID, UsuarioID: props.initialValues.UsuarioID })
                    .then((respuesta: any) => {
                        setLoading(false)
                        props.cbActualizar(respuesta)
                        toast.success("Se actualizó el gerente")
                    })
                    .catch((error: any) => {
                        console.log(error)
                        setLoading(false)
                        toast.error("Error al actualizar el gerente")
                    })

            }}>
            <Form>
                <CustomFieldText disabled={true} label="Gerente" name="Nombre" placeholder="Nombre del gerente" />
                <ActionMultipleSelect
                    disabled={loading}
                    label="Sucursal(es)"
                    name="SucursalesIDs"
                    placeholder="Seleccione la(s) sucursal(es)"
                    options={props.SucursalesOptions}
                    addDefault={false}
                    valor={props.initialValues.SucursalesIDs}
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
