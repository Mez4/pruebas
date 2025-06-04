import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
// import { CustomFieldText, CustomSelect, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { CustomFieldText, Spinner, ActionSelect } from '../../../../../global'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { 
        ProductoMesaAclaracionID: number, 
        MesaAclaracionID: number, 
        ProductoID: number, 
        Activo: boolean },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    options: { value: number, label: string }[],
    options2: { value: number, label: string }[],
    fnGetClientes(): any,
    fnGetClientes2(): any,
    // fnGetClientes2(Nombre: string, callback: any): any,
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
                ProductoID: Yup.number().required("Producto").moreThan(0, 'Debes seleccionar una opcion'),
                MesaAclaracionID: Yup.number().required("NombreMesaAclaracion").moreThan(0, 'Debes seleccionar una opcion'),
            })}
            onSubmit={(values: any, { resetForm }) => {
                setLoading(true)
                console.log(`values`, values)
                if (props.Id === undefined) {
                    let a = {
                        ...values,
                        ProductoMesaAclaracionID: values.ProductoMesaAclaracionID,
                        ProductoID: values.ProductoID,
                        MesaAclaracionID: values.MesaAclaracionID,
                        Producto: values.Producto,
                        NombreMesaAclaracion: values.NoombreMesaAclaracion,
                    }
                    console.log("antes de agregar", a);
                    Funciones.FNAdd(props.oidc, a)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            resetForm()
                            console.log("despues de agregar", a);
                        })
                        .catch((error: any) => {
                            alert("Error al guardar el producto" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
                else {
                    let a = {
                        ...values,
                        ProductoMesaAclaracionID: values.ProductoMesaAclaracionID,
                        Producto: values.ProductoID,
                        MesaAclaracionID: values.MesaAclaracionID,
                    }
                    console.log("antes de actualizar", a);
                    Funciones.FNUpdate(props.oidc, { ...values, ProductoMesaAclaracionID: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            console.log("despues de actualizar", a);
                        })
                        .catch((error: any) => {
                            alert("Error al guardar el producto" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
            }}>
            <Form>
                <div className="column is-full-desktop is-full-mobile">
                    <ActionSelect
                        disabled={loading}
                        label="Producto"
                        name="ProductoID"
                        placeholder="Seleccione una opción"
                        options={props.options2}
                        addDefault={false}
                        valor={props.initialValues.ProductoID}/>
                    </div>
                    <div className="column is-full-desktop is-full-mobile">
                        <ActionSelect
                            disabled={loading}
                            label="Mesa Aclaración"
                            name="MesaAclaracionID"
                            placeholder="Seleccione una opción"
                            options={props.options}
                            addDefault={false}
                            valor={props.initialValues.MesaAclaracionID}/>
                    </div>
                    <CustomFieldCheckbox disabled={loading} label="Activo" name="Activo" />
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