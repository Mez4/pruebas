import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { EstadoPaisNombre: string, Abreviatura: string, EstadoPaisCodigo: string },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(): any
}
export const CForm = (props: CFormType) => {

    //Loading
    const [loading, setLoading] = React.useState(false)

    // Return the compent
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                //EstadoPaisId: Yup.string().required("Campo obligatorio").min(3,"Minimo de caracteres").max(64,"Maximo 64 caracteres"),
            })}
            onSubmit={(values: any) => {
                // Set out fomr to loading state
                setLoading(true)

                //Finish the callback
                if (props.Id === undefined)
                    Funciones.FNAdd(props.oidc, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al guardar Estado " + JSON.stringify(error))
                            setLoading(false)
                        })
                else
                    Funciones.FNUpdate(props.oidc, { ...values, EstadoPaisId: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al guardar Estado " + JSON.stringify(error))
                            setLoading(false)
                        })
            }}
        >
            <Form>
                <CustomFieldText disabled={loading} label="Nombre" name="EstadoPaisNombre" placeholder="Nombre Estado" />
                <CustomFieldText disabled={loading} label="Abreviatura" name="Ebreviatura" placeholder="Abreviatura" />
                <CustomFieldText disabled={loading} label="Codigo" name="EstadoPaisCodigo" placeholder="Codigo" />
                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>Cancelar</button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light" onClick={props.fnCancelar}>Ok</button>
                    </div>
                }
            </Form>
        </Formik>
    )
}

//export default connect(mapStateToProps, mapDispatchToProps)(CForm)
