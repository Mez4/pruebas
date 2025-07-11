import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { DBConfia_Sistema } from '../../../../../../interfaces_db/DBConfia/Sistema'
import axios from 'axios'
import { GenerarCabeceraOIDC, GetServerUrl } from '../../../../../../global/variables'
import Modulos from '../../../../../selectores/Modulos'

type CFormType = {
    oidc: IOidc,
    Pantalla?: DBConfia_Sistema.IPantallas_VW,

    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)
    const InitialValues =
        props.Pantalla ? {
            ModuloID: props.Pantalla.PantallaID,
            Nombre: props.Pantalla.PantallaNombre,
            Descripcion: props.Pantalla.PantallaDescripcion,
            Ruta: props.Pantalla.PantallaRuta
        } : {
            PantallaID: 0,
            Nombre: '',
            Especial: false,
            Url: '',
            Metodo: 'get'
        }

    return (
        <Formik
            initialValues={InitialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                ModuloID: Yup.number().required("Se requiere la pantalla").min(1, "Se requiere la pantalla"),
                Nombre: Yup.string().required("Campo obligatorio").min(3, "Minimo 3 caracter").max(120, "Maximo 120 caracteres"),
                Descripcion: Yup.string().required("Campo obligatorio").min(3, "Minimo 3 caracter").max(255, "Maximo 255 caracteres"),
                Ruta: Yup.string().required("Campo obligatorio").min(3, "Minimo 3 caracter").max(255, "Maximo 255 caracteres")
            })}
            onSubmit={async (values: any) => {

                // Set our form to a loading state
                setLoading(true)

                try {

                    // Finish the callback
                    if (props.Pantalla === undefined) {

                        // Agregamos el permiso a la base de datos
                        let dato = (await axios.put(`${GetServerUrl()}Sistema/Pantallas`, values, GenerarCabeceraOIDC(props.oidc))).data

                        // Actualizamos
                        props.cbGuardar(dato)

                    }
                    else {

                        // Agregamos el permiso a la base de datos
                        let dato = (await axios.post(`${GetServerUrl()}Sistema/Pantallas/${props.Pantalla?.PantallaID}`, values, GenerarCabeceraOIDC(props.oidc))).data

                        // Actualizamos
                        props.cbActualizar(dato)
                    }

                    // notificacion
                    toast.success("Permiso Ok")
                }
                catch {

                    // notificacion
                    toast.error("Error de ejecución")

                }

                // Cancel the loading
                setLoading(false)
            }}>
            <Form>
                <Modulos oidc={props.oidc} disabled={loading} name={"ModuloID"} isSingle={true} />
                <CustomFieldText disabled={loading} label="Nombre" name="Nombre" placeholder="Nombre" />
                <CustomFieldText disabled={loading} label="Descripcion" name="Descripcion" placeholder="Descripcion" />
                <CustomFieldText disabled={loading} label="Ruta" name="Ruta" placeholder="Ruta" />


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
        </Formik >
    )
}
