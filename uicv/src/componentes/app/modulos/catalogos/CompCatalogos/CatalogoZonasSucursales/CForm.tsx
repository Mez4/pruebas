import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { ActionSelect, CustomFieldText, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { string } from 'yup/lib/locale'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { ZonaID: number, Nombre: string },
    optSucursales: { value: number, label: string }[],
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
            validationSchema={Yup.object().shape({
                Id: Yup.number().required("Campo obligatorio").moreThan(0, 'Seleccione una sucursal'),
            })}
            onSubmit={(values: any, { resetForm }) => {

                // Set our form to a loading state
                setLoading(true)
                console.log(`values`, values)
                //Finish the callback
                Funciones.FNAdd(props.oidc, {...values, ZonaID: props.Id })
                    .then((respuesta: any) => {
                        setLoading(false)
                        props.cbGuardar(respuesta)
                        toast.success("Agregado correctamente")
                        resetForm()
                    })
                    .catch((error: any) => {
                        toast.error("Error al agregar")
                        setLoading(false)
                    })


            }}>

            <Form>
                <ActionSelect
                    disabled={false}
                    label="Sucursal"
                    name="Id"
                    placeholder={'Seleccione la Sucursal'}
                    options={props.optSucursales}
                    addDefault={false}
                    valor={0}
                //accion={props.fnGetDistribuidores}
                />
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