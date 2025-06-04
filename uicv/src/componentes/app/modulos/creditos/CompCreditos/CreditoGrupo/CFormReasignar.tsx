import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { Sucursales, Distribuidores, Coordinadores, ClasificadorGrupos, Productos } from '../../../../../selectores'
import { iUI } from '../../../../../../interfaces/ui/iUI'

type CFormType = {
    oidc: IOidc,
    ui: iUI,
    Id?: number,
    initialValues: {
        ProductoID: number,
        SucursalID: number,
        CoordinadorID: number,
        Estatus: boolean,
        ClasificadorGrupoID: number
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
}

export const CFormReasignar = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                ProductoID: Yup.number().required("Seleccione el producto").moreThan(0, 'Seleccione el producto'),
                SucursalID: Yup.number().required("Seleccione la sucursal").moreThan(0, 'Seleccione la sucursal'),
                CoordinadorID: Yup.number().required("Seleccione el coordinador").moreThan(0, 'Seleccione el coordinador'),
                ClasificadorGrupoID: Yup.number().required("Seleccione el clasificador de grupo").moreThan(0, 'Seleccione el clasificador de grupo')
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
                            toast.success("Se guardó el Grupo")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al guardar el Grupo")
                        })
                else
                    Funciones.FNUpdate(props.oidc, { ...values, GrupoID: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Se actualizó el Grupo")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al actualizar el Grupo")
                        })

            }}>
            {({ values }) => (
                <Form>
                    <Productos oidc={props.oidc} ui={props.ui} name="ProductoID" valor={props.initialValues.ProductoID} unaLinea disabled={loading || props.Id ? true : false} />
                    <Sucursales name="SucursalID" unaLinea disabled={loading || props.Id ? true : false} valor={values.SucursalID} />
                    <Coordinadores name="CoordinadorID" unaLinea disabled={loading} valor={values.CoordinadorID} />
                    <ClasificadorGrupos oidc={props.oidc} name="ClasificadorGrupoID" unaLinea disabled={loading || props.Id ? true : false} cargar />
                    {/* <CustomFieldText disabled={loading} label="Descripción" name="Descripcion" placeholder="Descripción" /> */}
                    <CustomFieldCheckbox disabled={loading} label="Estatus" name="Estatus" />
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
