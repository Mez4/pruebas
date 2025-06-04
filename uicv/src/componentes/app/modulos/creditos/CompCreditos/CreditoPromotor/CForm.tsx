import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { ActionSelect, CustomFieldText, CustomFieldText2, CustomSelect2, Spinner } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { Sucursales } from '../../../../../selectores'

type CFormType = {
    oidc: IOidc
    Id?: number,
    ProdID: number,
    initialValues: { creditoPromotorNombre: string, activo: boolean, SucursalID: number },
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
                creditoPromotorNombre: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracter").max(64, "Maximo 64 caracteres")
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
                            toast.success("Se guardó el promotor")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al guardar el promotor")
                        })
                else
                    Funciones.FNUpdate(props.oidc, { ...values, creditoPromotorId: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Se actualizó el promotor")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al actualizar el promotor")
                        })

            }}>
            <Form>
                <CustomFieldText disabled={true} label="Promotor" name="creditoPromotorNombre" placeholder="Nombre del promotor" />
                <Sucursales disabled={loading} IsAction name={'SucursalID'} ProductoID={props.ProdID} valor={props.initialValues.SucursalID} />
                <CustomFieldCheckbox disabled={loading} label="Activo" name="activo" />
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
