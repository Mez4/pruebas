import { ActionAsyncSelect, ActionSelect, Spinner } from '../../../../../global'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import * as FnGestoria from "./Funciones"
import * as Funciones from './Funciones'
import { toast } from 'react-toastify'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import React, { Dispatch, SetStateAction } from 'react'

type InitialValues = {
    ResponsableId: number,
    UsuarioID: number,
    TipoUsuarioID: number
}

type CFormType = {
    oidc: IOidc,
    state: {
        optGestores: any[]
    }
    setState: any,
    initialValues: InitialValues,
    dgGuardar(item: any): any,
    cbActualizar(item: any): any,
    fnCancelar(): any,
    optTipos: { value: number; label: string }[],
    Id?: number,
}

export const CForm = ({ state, initialValues, setState, ...props }: CFormType) => {
    const [loading, setLoading] = React.useState(false)

    const loadOptionsClientes = (Nombre: string, callback: any) => {
        FnGestoria.FNGetResponsables(props.oidc, Nombre)
            .then((res: any) => {

                var coordinadores = res.map((valor: any) => {
                    var obj = { value: valor.ResponsableId, label: valor.ResponsableId + ' - ' + valor.ResponsableNombre };
                    return obj
                });
                setState(s => ({ ...s, optGestores: coordinadores }))
                callback(coordinadores)
            })
            .catch(() => {
                setState(s => ({ ...s, Datos: [] }))
                callback([])
            })
    }

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                ResponsableId: Yup.number().required().moreThan(0, 'Seleccione el responsable'),
                TipoUsuarioID: Yup.number().required().moreThan(0, 'Seleccione el Tipo'),
            })}
            onSubmit={(values: InitialValues) => {
                setLoading(true)
                Funciones.FNVincularGestorUsuario(props.oidc, { ResponsableId: values.ResponsableId, UsuarioID: values.UsuarioID, TipoUsuarioID: values.TipoUsuarioID })
                .then((respuesta: any) => {
                setLoading(false)
                    props.dgGuardar(respuesta)
                    toast.success('El usuario se ha vinculado al responsable correctamente')
                })
                .catch((error: any) => {
                    console.log(JSON.stringify(error))
                    setLoading(false)
                    toast.error(`Ha ocurrido un error al el responsable al usuario ${error.response?.data}`)
                })
            }}>
            {({ values }) => (
                <Form>
                    <ActionAsyncSelect
                        loadOptions={loadOptionsClientes}
                        disabled={loading}
                        label="Responsable"
                        name={"ResponsableId"}
                        placeholder="Buscar responsable"
                        options={state.optGestores}
                        addDefault={false}
                        valor={0}
                        noOptionsMessage={'Escriba el nombre del responsable'}
                    // ref={refCliente}
                    />
                     <ActionSelect
                       disabled={false}
                       label="Tipo Usuario"
                       name="TipoUsuarioID"
                       placeholder="Seleccione un Tipo"
                       options={props.optTipos}
                       addDefault={true}
                       valor={0}
                     />
                    {/* <ActionSelect
                        disabled={false}
                        label="Responsable"
                        name="ResponsableId"
                        placeholder={'Seleccione una persona responsable'}
                        options={state.optGestores}
                        addDefault={false}
                        valor={0}
                        accion={(e) => { console.log(e) }}
                    /> */}
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

            )}
        </Formik>
    )
}
