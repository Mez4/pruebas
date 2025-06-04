import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, CustomSelect, CustomSelect2, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { DBConfia_Sistema } from '../../../../../../interfaces_db/DBConfia/Sistema'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import axios from 'axios'
import { GenerarCabeceraOIDC, GetServerUrl } from '../../../../../../global/variables'
import Pantallas from '../../../../../selectores/Pantallas'

type CFormType = {
    oidc: IOidc,
    Permiso?: DBConfia_Sistema.IPermisos_VW,

    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)
    const InitialValues =
        props.Permiso ? {
            PantallaID: props.Permiso.PantallaID,
            Nombre: props.Permiso.PermisoNombre,
            Descripcion: props.Permiso.PermisoDescripcion,
            Especial: props.Permiso.PermisoEspecial,
            Url: props.Permiso.PermisoRestUrl,
            Metodo: props.Permiso.PermisoRestMetodo
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
                PantallaID: Yup.number().required("Se requiere la pantalla").min(1, "Se requiere la pantalla"),
                Nombre: Yup.string().required("Campo obligatorio").min(3, "Minimo 3 caracter").max(120, "Maximo 120 caracteres"),
                Descripcion: Yup.string().required("Campo obligatorio").min(3, "Minimo 3 caracter").max(255, "Maximo 255 caracteres"),
                Especial: Yup.boolean(),
                Url: Yup.string().required("Campo obligatorio").min(3, "Minimo 3 caracter").max(255, "Maximo 255 caracteres"),
                Metodo: Yup.string().required("Campo obligatorio").min(3, "Campo obligatorio").max(50, "Campo obligatorio")
            })}
            onSubmit={async (values: any) => {

                // Set our form to a loading state
                setLoading(true)

                try {

                    // Finish the callback
                    if (props.Permiso === undefined) {

                        // Agregamos el permiso a la base de datos
                        let dato = (await axios.put(`${GetServerUrl()}Sistema/Permisos`, values, GenerarCabeceraOIDC(props.oidc))).data

                        // Actualizamos
                        props.cbGuardar(dato)

                    }
                    else {

                        // Agregamos el permiso a la base de datos
                        let dato = (await axios.post(`${GetServerUrl()}Sistema/Permisos/${props.Permiso.PermisoID}`, values, GenerarCabeceraOIDC(props.oidc))).data

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
                <Pantallas oidc={props.oidc} disabled={loading} name={"PantallaID"} isSingle={true} />
                <CustomFieldText disabled={loading} label="Nombre" name="Nombre" placeholder="Nombre" />
                <CustomFieldText disabled={loading} label="Descripcion" name="Descripcion" placeholder="Descripcion" />
                <CustomFieldCheckbox disabled={loading} label="P.Especial" name='Especial' />
                <CustomFieldText disabled={loading} label="Url" name="Url" placeholder="Url" />
                <CustomSelect
                    disabled={loading}
                    label="Metodo"
                    name="Metodo"
                    placeholder="Metodo"
                    options={[{ label: "get", value: "get" }, { label: "post", value: "post" }, { label: "put", value: "put" }, { label: "delete", value: "delete" }]}
                    addDefault={true}
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
        </Formik >
    )
}
