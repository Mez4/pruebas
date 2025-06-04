import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { ActionAsyncSelect, CustomFieldText, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { ErrorMessage, Field } from 'formik'
import { toast } from 'react-toastify'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'


type CFormType = {
    oidc: IOidc
    Id?: number,
    OptSucursales?: { value: number, label: string, producto: string }[],
    OptProductos?: { value: number, label: string, producto: string }[],
    options: { value: number, label: string }[],
    initialValues: {
        RubroGastosID: number,
        Clave: string,
        Descripcion: string,
        Activo: boolean,
        RegistraID: number,
        AfectaUtilidad: boolean,
        GastoCorporativo: boolean,
        Cargo: boolean,

    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(): any
    fnGetClientes(Nombre: string, callback: any): any,

}

export const CForm = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)

    const loadOptionsClientes = (inputText: string, callback: any) => {
        props.fnGetClientes(inputText, callback);
    }

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                Descripcion: Yup.string().required("Campo obligatorio").min(3, "Mínimo 3 caracteres").max(35, "Máximo 35 caracteres"),
                Clave: Yup.string().required("Campo obligatorio").min(3, "Mínimo 3 caracteres").max(35, "Máximo 35 caracteres"),
            })}
            onSubmit={(values: any) => {
                setLoading(true)
                if (props.Id === undefined) {
                    let a = {
                        Activo: values.Activo,
                        AfectaUtilidad: values.AfectaUtilidad,
                        Cargo: values.Cargo,
                        Clave: values.Clave,
                        Descripcion: values.Descripcion,
                        RegistraID: props.oidc.user.UserId,
                        GastoCorporativo: values.GastoCorporativo,
                    }

                    //Guardar rubro
                    Funciones.FNGuardarRubro(props.oidc, a)
                        .then((respuesta: any) => {
                            props.fnCancelar()
                            props.cbGuardar(respuesta)
                            setLoading(false)
                        })
                        .catch(() => {
                            toast.error("Ocurrió un problema al guardar el rubro")
                            setLoading(false)
                        })

                }
                else {
                    setLoading(true)
                    console.log("SSSSSSS")
                    //Actualizar rubro
                    let a = {
                        Activo: values.Activo,
                        AfectaUtilidad: values.AfectaUtilidad,
                        Cargo: values.Cargo,
                        Clave: values.Clave,
                        Descripcion: values.Descripcion,
                        RegistraID: props.oidc.user.UserId,
                        GastoCorporativo: values.GastoCorporativo,
                        RubroGastosID: props.Id
                    }

                    console.log("Objecto a actualizar", a)
                    //Actualizar rubro
                    Funciones.FNActualizarRubro(props.oidc, a)
                        .then((respuesta: any) => {
                            props.fnCancelar()
                            props.cbActualizar(respuesta)
                            setLoading(false)
                        })
                        .catch(() => {
                            toast.error("Ocurrió un problema al actualizar el rubro")
                            setLoading(false)
                        })




                }
            }}>
            <Form>
                <div className="columns is-centered is-mobile is-multiline">
                    <div className="column text-center is-half-desktop is-half-tablet is-full-mobile">
                        <CustomFieldText disabled={loading} label="Clave" name="Clave" placeholder="Clave" />
                    </div>
                    <div className="column text-center is-half-desktop is-half-tablet is-full-mobile">
                        <CustomFieldText disabled={loading} label="Descripcion" name="Descripcion" placeholder="Descripcion" />
                    </div>
                    {/* 
                    <div className="column text-center is-one-third-desktop is-half-tablet is-full-mobile">

                        <ActionAsyncSelect
                            loadOptions={loadOptionsClientes}
                            disabled={false}
                            label="Persona:"
                            name="UsuarioID"
                            placeholder="Buscar persona...."
                            options={props.options}
                            addDefault={false}
                            valor={props.initialValues.RegistraID}
                            noOptionsMessage={'No encontrado'}
                        />

                    </div> */}

                    <div className="column text-center is-one-quarter-desktop is-half-tablet is-full-mobile">
                        <div className='text-center'>
                            <br />
                            <CustomFieldCheckbox disabled={loading} label="Activo" name="Activo" />
                        </div>
                    </div>

                    <div className="column text-center is-one-quarter-desktop is-half-tablet is-full-mobile">
                        <div className='text-center'>
                            <br />
                            <CustomFieldCheckbox disabled={loading} label="Afecta Utilidad" name="AfectaUtilidad" />
                        </div>
                    </div>

                    <div className="column text-center is-one-quarter-desktop is-half-tablet is-full-mobile">
                        <div className='text-center'>
                            <br />
                            <CustomFieldCheckbox disabled={loading} label="Gasto Corporativo" name="GastoCorporativo" />
                        </div>
                    </div>

                    <div className="column text-center is-one-quarter-desktop is-half-tablet is-full-mobile">
                        <div className='text-center'>
                            <br />
                            <CustomFieldCheckbox disabled={loading} label="Cargo" name="Cargo" />
                        </div>
                    </div>
                </div>

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