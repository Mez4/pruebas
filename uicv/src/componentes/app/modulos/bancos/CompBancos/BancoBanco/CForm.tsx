import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect, CustomFieldImgUpload } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { Nombre: string, Activo: boolean, ArchivoDispersionID: number, Logo: string, file: null, EsBanco: boolean },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    options: { value: number, label: string }[],
    // imgSrc: string | null
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                Nombre: Yup.string().required("Campo obligatorio").min(1, "Minimo 1 caracter").max(150, "Maximo 150 caracteres"),
                ArchivoDispersionID: Yup.number().required("Seleccione el tipo de archivo").moreThan(0, 'Seleccione el tipo de archivo'),
                // file: Yup.mixed().required("Seleccione la imagen del logo")          
            })}
            onSubmit={(values: any) => {

                console.log(values)

                const formData = new FormData()
                formData.append('Nombre', values.Nombre);
                formData.append('ArchivoDispersionID', values.ArchivoDispersionID);
                formData.append('Logo', values.file);
                formData.append('Activo', values.Activo);
                formData.append('EsBanco', values.EsBanco);
                console.log(formData)

                // Set our form to a loading state
                setLoading(true)

                // Finish the callback
                if (props.Id === undefined)
                    Funciones.FNAdd(props.oidc, formData)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            toast.success("Se guardó el banco")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al guardar el banco")
                        })
                else {

                    formData.append('BancoID', props.Id as any);
                    
                    // console.log(formData)

                    Funciones.FNUpdate(props.oidc, formData)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Se actualizó el banco")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al actualizar el banco")
                        })
                }

            }}>
            <Form>
                <CustomFieldText disabled={loading} label="Banco" name="Nombre" placeholder="Nombre del Banco" />
                <CustomFieldCheckbox disabled={loading} label="Activo" name="Activo" />
                <CustomSelect
                    disabled={loading}
                    label="Tipo Archivo Disperción"
                    name="ArchivoDispersionID"
                    placeholder="Seleccione el tipo de archivo"
                    options={props.options}
                    addDefault={false}
                />
                <CustomFieldImgUpload
                    disabled={loading}
                    label="Logo"
                    name="file"
                    imageSrc={'data:image/png;base64,' + props.initialValues.Logo}
                />
                <CustomFieldCheckbox disabled={loading} label="Dispersa" name="EsBanco" />
                {/* <Thumb file={}/> */}
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
