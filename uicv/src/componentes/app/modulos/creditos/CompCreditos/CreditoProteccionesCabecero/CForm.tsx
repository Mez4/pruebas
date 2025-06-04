import React from 'react'
import { IOidc } from "../../../../../../interfaces/oidc/IOidc"
import { Formik, Form } from 'formik'
import { object, number } from '../../../../../../global/idiomaValidacion.bak';
import * as Yup from 'yup'
import * as Funciones from './Funciones'
import { toast } from 'react-toastify';
import { ActionSelect, CustomFieldText, CustomSelect, Spinner } from '../../../../../global';


type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: {
        Descripcion: string
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    isUpdate: boolean
}

export const CForm = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                Descripcion: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracteter").max(250, "Maximo 250 caracteres"),
            })}
            onSubmit={(values: any) => {
                setLoading(true)

                if (props.Id === undefined) 
                    Funciones.FNAdd(props.oidc, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            toast.success("Se guardó cabecero")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al guardar cabecero")
                        })
                    else
                        Funciones.FNUpdate(props.oidc, {
                            ...values,
                            ProteccionCabeceroID: props.Id as number
                        })
                            .then((respuesta: any) => {
                                setLoading(false)
                                props.cbActualizar(respuesta)
                                toast.success("Se actualizó el cabecero")
                            })
                            .catch((error: any) => {
                                console.log(JSON.stringify(error))
                                setLoading(false)
                                toast.error("Error al actualizar cabecero")
                            })
            }}>
            <Form>
                <CustomFieldText 
                    disabled={loading}
                    label='Descripción'
                    name="Descripcion"
                    placeholder='Ingresa Descripción Cabecero'
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