import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, CustomSelect, Spinner, ActionSelect } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { ActionAsyncSelect, ActionAsyncSelectDefault } from '../../../../../global'
import { toast } from 'react-toastify'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: {
        AnalistaID: number,
        NombreCompleto: string,
        MesaAclaracionID: number,
        Activo: boolean
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(): any
    options: { value: number, label: string }[],
    fnGetClientes(Nombre: string, callback: any): any,
}

export const CForm = (props: CFormType) => {
    const loadOptionsClientes = (inputText: string, callback: any) => {
        props.fnGetClientes(inputText, callback);
    }
    // Loading
    const [loading, setLoading] = React.useState(false)
    const [encargado, setEncargado] = React.useState("")
    // Return the component

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                AnalistaID: Yup.number().required("Analista").moreThan(0, 'Debes seleccionar un analista'),
            })}
            onSubmit={(values: any, { resetForm }) => {
                setLoading(true)
                if (props.Id === undefined) {
                    let a = {
                        ...values,
                        NombreCompleto: values.NombreCompleto,
                        NombreMesaAclaracion: values.NombreMesaAclaracion,
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
                            toast.error("El usuario ya es analista.")
                            setLoading(false)
                        })
                }
                else {
                    setLoading(true)
                    let a = {
                        ...values,
                        AnalistaID: values.AnalistaID,
                        NombreCompleto: values.NombreCompleto,
                    }
                    console.log("antes de actualizar", a);
                    values = a
                    Funciones.FNUpdate(props.oidc, { ...values, AnalistaID: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al actualizar Analista, verifique sus datos")
                            setLoading(false)
                        })
                }
            }}>
            <Form>
                {!props.Id &&
                    /*Agregar nuevo
                    --------------------------------------------*/
                    <div>
                        <div className="columns is-centered is-mobile is-multiline">
                            <div className="column is-half-desktop is-full-mobile">
                                <div >
                                    <label className="form-label mb-0">Analista</label>
                                    <input
                                        type="text"
                                        disabled={true}
                                        className="form-control"
                                        placeholder={encargado == '' ? "No seleccionado" : ""}
                                        value={encargado} />
                                </div>
                            </div>
                            <div className="column is-half-desktop is-full-mobile">
                                <ActionAsyncSelect
                                    loadOptions={loadOptionsClientes}
                                    disabled={props.Id === undefined ? false : true}
                                    label="Analista: "
                                    name="AnalistaID"
                                    placeholder="Buscar analista..."
                                    options={[]}
                                    addDefault={false}
                                    valor={props.initialValues.AnalistaID}
                                    noOptionsMessage={'No encontrado'}
                                    accion2={(val) => setEncargado(val)} />
                            </div>

                        </div>
                        <CustomFieldCheckbox disabled={loading} label="Activo" name="Activo" />
                        {loading && <Spinner />}
                        {!loading &&
                            <div className="text-end">
                                <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                    Cancelar
                                </button>
                                <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Aceptar</button>
                            </div>
                        }
                    </div>
                }
                {props.Id &&
                    /*Actualizar 
                    --------------------------------------------*/
                    <div>
                        <div className="columns is-centered is-mobile is-multiline">
                            <div className="column is-full-desktop is-full-mobile">
                                <div className="mb-3">
                                    <CustomSelect
                                        disabled={props.Id === undefined ? false : true}
                                        label={"Analista: " + props.initialValues.NombreCompleto}
                                        name="AnalistaID"
                                        placeholder="Seleccione el analista..."
                                        options={props.options}
                                        addDefault={false}
                                        isMulti={false} />
                                </div>
                            </div>

                        </div>
                        <CustomFieldCheckbox disabled={loading} label="Activo" name="Activo" />
                        {loading && <Spinner />}
                        {!loading &&
                            <div className="text-end">
                                <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                    Cancelar
                                </button>
                                <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Aceptar</button>
                            </div>
                        }
                    </div>
                }
            </Form>
        </Formik>
    )
}