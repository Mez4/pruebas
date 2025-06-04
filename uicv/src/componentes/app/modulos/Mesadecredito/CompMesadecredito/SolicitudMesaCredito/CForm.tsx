import React from 'react'
import { Formik, Form } from 'formik'
import Yup from '../../../../../../global/yupLocale'
import { ActionSelect, CustomFieldText, Spinner } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    oidc: IOidc
    Id?: number,
    optProductos: { value: number, label: string }[],
    initialValues: { PersonaID :	number,ProductoID:number	,SucursalID :number,UsuarioRegistraID:string,FechaHoraRegistro:string,FechaHoraResolucion	:string	,EstatusValidacionID:number	,GrupoID:number,CreditoID :number,PersonaRegistraID :		number		    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(): any
}
export const CForm = (props: CFormType) => {
   

    // Loading
    const [loading, setLoading] = React.useState(false)

    // Return the component
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            /*validationSchema={Yup.object().shape({
                ViviendaTipo: Yup.string().required().min(3).max(12),
            })}*/
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)

                // Finish the callback
                if (props.Id === undefined)
                    Funciones.FNAdd(props.oidc, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al guardar el Analista" + JSON.stringify(error))
                            setLoading(false)
                        })
                else
                    Funciones.FNUpdate(props.oidc, { ...values, SolicitudMesaCreditoID: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al guardar el Analista" + JSON.stringify(error))
                            setLoading(false)
                        })

            }}>
          
            <Form>
            
                <CustomFieldText disabled={loading} label="Id" name="SolicitudMesaCreditoID" placeholder="SolicitudMesaCreditoID" />
                <CustomFieldText disabled={loading} label="PersonaID" name="PersonaID" placeholder="PersonaID" />
                <CustomFieldText disabled={loading} label="ProductoID" name="ProductoID" placeholder="ProductoID" />
                <CustomFieldText disabled={loading} label="SucursalID" name="SucursalID" placeholder="SucursalID" />
                <CustomFieldText disabled={loading} label="UsuarioRegistraID" name="UsuarioRegistraID" placeholder="UsuarioRegistraID" />
                <CustomFieldText disabled={loading} label="FechaHoraRegistro" name="FechaHoraRegistro" placeholder="FechaHoraRegistro" />
                <CustomFieldText disabled={loading} label="FechaHoraResolucion" name="FechaHoraResolucion" placeholder="FechaHoraResolucion" />
                <CustomFieldText disabled={loading} label="EstatusValidacionID" name="EstatusValidacionID" placeholder="EstatusValidacionID" />
                <CustomFieldText disabled={loading} label="GrupoID" name="GrupoID" placeholder="GrupoID" />
                <CustomFieldText disabled={loading} label="CreditoID" name="CreditoID" placeholder="CreditoID" />
                <CustomFieldText disabled={loading} label="PersonaRegistraID" name="PersonaRegistraID" placeholder="PersonaRegistraID" />

                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Ok</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}
