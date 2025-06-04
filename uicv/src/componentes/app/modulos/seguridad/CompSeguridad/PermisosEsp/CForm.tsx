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

import { DBConfia_Seguridad } from '../../../../../../interfaces_db/DBConfia/Seguridad'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import Pantallas from '../../../../../selectores/Pantallas'
import Productos from '../../../../../selectores/Productos'

type CFormType = {
    oidc: IOidc,
    Pantalla?: DBConfia_Sistema.IPantallas_VW,
    Permiso?: DBConfia_Seguridad.IUsuariosPermisosVW
    datosPermiso: any[],


    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)
    console.log("Datos", props.datosPermiso)
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

    const Columns: IDataTableColumn[] =
        [
            {
                name: 'Id',
                selector: 'UsuarioID',
                sortable: false,
                center: true,

            },
            {
                center: true,
                name: 'Clave',
                selector: 'NombreCompleto',
                sortable: false,
            },
        ]


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

                <div className="column text-center is-full-desktop is-full-tablet is-full-mobile">

                    <DataTable
                        data={props.datosPermiso}
                        striped
                        dense
                        noHeader
                        responsive
                        keyField={"SolicitudDetalleID"}
                        defaultSortField={"SolicitudDetalleID"}
                        columns={Columns}
                    />
                </div>
                {/*                 <Modulos oidc={props.oidc} disabled={loading} name={"ModuloID"} isSingle={true} />
 */}
                <Productos oidc={props.oidc} disabled={loading} name={"PantallaID"} isSingle={true} valor={0} />

                <Pantallas oidc={props.oidc} disabled={loading} name={"PantallaID"} isSingle={true} />
                {/*  <CustomFieldText disabled={loading} label="Nombre" name="Nombre" placeholder="Nombre" />
                <CustomFieldText disabled={loading} label="Descripcion" name="Descripcion" placeholder="Descripcion" />
                <CustomFieldText disabled={loading} label="Ruta" name="Ruta" placeholder="Ruta" /> */}


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
