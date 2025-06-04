import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: {
        CodigoPostal: number,
        Asentamiento: string,
        Tipo_asenta: string,
        Municipio: string,
        Estado: string,
        Ciudad: string,
        oficina_postal: string,
        id_estado: number,
        id_oficina_postal: string,
        c_CP: string,
        id_tipo_asentamiento: number,
        id_municipio: number,
        id_asentamiento: number,
        zona: string,
        id_ciudad: number
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    optEdos: { value: number, label: string }[]
    optCities: { value: number, label: string }[]
    optMnpios: { value: number, label: string }[]
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                CodigoPostal: Yup.number().required("Campo obligatorio").moreThan(0, "Campo obligatorio"),
                Asentamiento: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracter").max(250, "Maximo 250 caracteres"),
                Tipo_asenta: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracter").max(250, "Maximo 250 caracteres"),
                id_oficina_postal: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracter").max(250, "Maximo 250 caracteres"),
                id_estado: Yup.number().required("Seleccione el estado").moreThan(0, "Seleccione el estado"),
                id_tipo_asentamiento: Yup.number().required("Campo obligatorio").moreThan(0, "Campo obligatorio"),
                // id_ciudad: Yup.number().required("Seleccione la ciudad").moreThan(0, "Seleccione la ciudad"),
                id_municipio: Yup.number().required("Seleccione el municipio").moreThan(0, "Seleccione el municipio"),
                zona: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracter").max(250, "Maximo 250 caracteres"),
                id_asentamiento: Yup.number().required("Campo obligatorio").moreThan(0, "Campo obligatorio")
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
                            toast.success("Se guardó el asentamiento")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al guardar el asentamiento")
                        })
                else
                    Funciones.FNUpdate(props.oidc, { ...values, AsentamientoID: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Se actualizó el asentamiento")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al actualizar el asentamiento")
                        })

            }}>
            <Form>
                <CustomFieldText disabled={loading} label="Código Postal" name="CodigoPostal" placeholder="Código Postal" />
                <CustomFieldText disabled={loading} label="Asentamiento" name="Asentamiento" placeholder="Descripción asentamiento" />
                <CustomFieldText disabled={loading} label="Tipo asentamiento" name="Tipo_asenta" placeholder="Tipo asentamiento" />
                <CustomFieldText disabled={loading} label="Id tipo asentamiento" name="id_tipo_asentamiento" placeholder="Id tipo asentamiento" />
                <CustomFieldText disabled={loading} label="Oficina Postal" name="id_oficina_postal" placeholder="Oficina Postal que reparte al asentamiento" />
                <CustomFieldText disabled={loading} label="Zona" name="zona" placeholder="Zona en la que se ubica el asentamiento (Urbano/Rural)" />
                <CustomFieldText disabled={loading} label="Id Asentamiento" name="id_asentamiento" placeholder="Identificador único del asentamiento (nivel municipal)" />

                <CustomSelect
                    disabled={loading}
                    label="Estado"
                    name="id_estado"
                    placeholder="Seleccione un estado"
                    options={props.optEdos}
                    addDefault={false}
                    // value = {props.initialValues.estadoPaisId}
                />
                <CustomSelect
                    disabled={loading}
                    label="Ciudad"
                    name="id_ciudad"
                    placeholder="Seleccione una ciudad"
                    options={props.optCities}
                    addDefault={false}
                    // value = {props.initialValues.estadoPaisId}
                />
                <CustomSelect
                    disabled={loading}
                    label="Municipio"
                    name="id_municipio"
                    placeholder="Seleccione un municipio"
                    options={props.optMnpios}
                    addDefault={false}
                    // value = {props.initialValues.estadoPaisId}
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
