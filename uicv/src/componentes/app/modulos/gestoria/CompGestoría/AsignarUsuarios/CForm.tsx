import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { ActionAsyncSelect, CustomFieldText, CustomFieldText2, Spinner } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import { Clientes, Distribuidores, Sucursales } from '../../../../../selectores'

type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: { RegionalID: number, ZonalID: number,ZonalNombre: string, GestorID: number,GestorNombre: string},
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    Zonal?: boolean
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)
    const optGestores: any[] = []
    const [state, setState] = React.useState({
         optGestores
    })

     const loadOptionsClientes = (Nombre: string, callback: any) => {
        let Datos = {
            Nombre: Nombre,
            Zonal: props.Zonal
        }
            Funciones.FNGetResponsables(props.oidc, Datos)
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
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                ResponsableId: Yup.number().required("Ingrese Usuario").moreThan(0, "Ingrese Usuario")
            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)
                let Datos = {
                    ZonalID: props.initialValues.ZonalID,
                    Zonal: props.Zonal,
                    ResponsableId: values.ResponsableId,
                    GestorID: props.initialValues.GestorID,
                    Id: props.Id
                }
                // Finish the callback
                console.log(props.Id)
                if (props.Id == undefined)
                {
                    Funciones.FNAdd(props.oidc, Datos)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                            toast.success("Se guardó la Asignación")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            if (error.response)
                                toast.error(`Response Error: ${error.response.data}`)
                            else if (error.request)
                                toast.error(`Request ${error}`)
                            else
                                toast.error(`${error}`)
                        })
                    }
                else
                {
                    Funciones.FNUpdate(props.oidc, Datos)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.success("Se actualizó la Asignación")
                        })
                        .catch((error: any) => {
                            console.log(JSON.stringify(error))
                            setLoading(false)
                            toast.error("Error al actualizar la Asignación")
                        })
                    }

            }}>
            {({ values }) => (
                <Form>
                    <div className="container">
                        <div className="columns is-desktop is-tablet">
                            
                            
                        </div>
                        <div className="columns is-desktop is-tablet">
                            <div className="column is-one-two-desktop is-half-tablet is-full-mobile">
                            <CustomFieldText disabled={true} label={!props.Zonal ? "Gestor" : "Zonal" } name={!props.Zonal ? "GestorNombre" : "ZonalNombre"} placeholder="Ingrese" />
                            </div>
                            <div className="column is-one-two-desktop is-half-tablet is-full-mobile">
                            <ActionAsyncSelect
                                loadOptions={loadOptionsClientes}
                                disabled={loading}
                                label={!props.Zonal ? "Zonal" : "Regional" }
                                name={"ResponsableId"}
                                placeholder="Buscar"
                                options={state.optGestores}
                                addDefault={false}
                                valor={0}
                                noOptionsMessage={'Escriba el nombre del responsable'}
                                // ref={refCliente}
                            />
                            </div>
                        </div>
                    </div>
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
