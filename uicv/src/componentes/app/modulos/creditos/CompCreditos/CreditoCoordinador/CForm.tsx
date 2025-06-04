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
    initialValues: { Nombre: string, SucursalID: number, ClasificadorID: number },
    SucursalesOptions: { value: number, label: string }[],
    cbChangeSucursal(item: any): any,
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
                Nombre: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracter").max(64, "Maximo 64 caracteres"),
                SucursalID: Yup.number().required("Campo obligatorio"),
                ClasificadorID: Yup.number().required("Campo obligatorio")
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)

                Funciones.FNUpdate(props.oidc, { SucursalID: values.SucursalID, ClasificadorGrupoID: values.ClasificadorID, CoordinadorID: props.Id })
                    .then((respuesta: any) => {
                        setLoading(false)
                        props.cbActualizar(respuesta)
                        toast.success("Se actualizó el coordinador")
                    })
                    .catch((error: any) => {
                        setLoading(false)
                        toast.error("Error al actualizar el coordinador: " + error.response.data)
                    })

            }}>
            <Form>
                <CustomFieldText disabled={true} label="Coordinador" name="Nombre" placeholder="Nombre del coordinador" />
                <Sucursales
                    disabled={loading}
                    label="Sucursal"
                    name="SucursalID"
                    IsAction={true}
                    Permiso={false}
                    onChange={props.cbChangeSucursal}
                    ProductoID={props.ProdID}
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
