import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText2, Spinner, CustomFieldDatePicker2 } from '../../../../../global'
import {Distribuidores, TipoCodigoAut, Usuarios } from '../../../../../selectores'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { DescripcionDistribuidor } from '../../../../../../global/variables'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { AutorizacionTipoID: number, Fecha: Date, UsuarioIDUtiliza: string, Referencia: number, Observaciones: string },
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
                AutorizacionTipoID: Yup.number().required("Campo obligatorio").moreThan(0, "Campo obligatorio"),
                Fecha: Yup.date().required("Seleccione la fecha inicial"),
                UsuarioIDUtiliza: Yup.string().required("Campo obligatorio"),
                Referencia: Yup.number().required("Campo obligatorio").moreThan(0, "Campo obligatorio")
            })}
            onSubmit={(values: any) => {    
                
                // Set our form to a loading state
                setLoading(true)

                // Finish the callback
                // if (props.Id === undefined)
                    Funciones.FNAdd(props.oidc, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            toast.success("Se guardó el código")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al guardar el código")
                        })
                // else
                //     Funciones.FNUpdate(props.oidc, { ...values, AutorizacionTipoID: props.Id as number })
                //         .then((respuesta: any) => {
                //             setLoading(false)
                //             props.cbActualizar(respuesta)
                //             toast.success("Se actualizó el código")
                //         })
                //         .catch((error: any) => {
                //             console.log(JSON.stringify(error))
                //             setLoading(false)
                //             toast.error("Error al actualizar el código")
                //         })

            }}>
            <Form>
                <TipoCodigoAut oidc={props.oidc} unaLinea disabled={loading} name={'AutorizacionTipoID'} />
                <Usuarios oidc={props.oidc} unaLinea disabled={loading} name={'UsuarioIDUtiliza'} />
                <CustomFieldDatePicker2 disabled={loading} label={'Fecha de Uso'} name={'Fecha'} placeholder={'dd/mm/yyyy'} />
                <Distribuidores buscar={false} disabled={loading} unaLinea={true} name={'Referencia'} label="Referencia"/>
                <CustomFieldText2 disabled={loading} label="Observaciones" datoType='text' name="Observaciones" placeholder="Observaciones" />
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
