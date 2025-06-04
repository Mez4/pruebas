import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Spinner, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
//import { valueContainerCSS } from 'react-select/src/components/containers'
import { toast } from 'react-toastify'
import DataTable from 'react-data-table-component'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'

type CFormType = {
    Seguridad: IOidc,

    Id?: number,
    initialValues: {
        bancoID: number,
        nombre: string,
        activo: boolean
    },
    options: { value: number, label: string }[]

    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,


}



export const CForm = (props: CFormType) => {

    const sucursales: any[] = [{ sucursalId: 1, sucursal: "Vales", documento: "IFE", estatus: true }, { sucursalId: 2, sucursal: "Vales", documento: "ACTA", estatus: false }]
    const [loading, setLoading] = React.useState(false)
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                nombre: Yup.string().required("Campo obligatorio").min(4, "Minimo 4 caracteres").max(64, "Maximo 64 caracteres"),
                //acumulaCuentaId: Yup.number().required("Seleccione la cuenta acumula").moreThan(0, 'Seleccione la cuenta acumula'),


            })}
            onSubmit={(values: any) => {

                setLoading(true)


                // Finish the callback
                if (props.Id === undefined) {

                    let agregarBanco: any = {
                        nombre: values.nombre,
                        activo: values.activo,
                    }
                    values = agregarBanco

                    Funciones.FNAdd(props.Seguridad, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)

                        })
                        .catch((error: any) => {
                            alert("Error al guardar la cuenta" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
                else {



                    let actualizarBanco: any = {
                        bancoID: values.bancoID,
                        nombre: values.nombre,
                        activo: values.activo,


                    }
                    values = actualizarBanco


                    Funciones.FNUpdate(props.Seguridad, { ...values, bancoID: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                        })
                        .catch((error: any) => {
                            setLoading(false)
                            toast.error('Error al desactivar el banco, tiene cuentas activas')
                            // alert("Error al actualizar la cuenta" + JSON.stringify(error))

                        })
                }
            }}
        >
            <Form>

                <div>

                    <CustomSelect
                        disabled={loading}
                        label="Producto"
                        name="personaID"
                        placeholder="Seleccione un producto"
                        options={props.options}
                        addDefault={false}
                        isMulti={false}
                    />

                    <CustomFieldCheckbox disabled={loading} label="Documento Requerido" name="activo" />

                    <hr />
                    <h4 >
                        Documentos Requeridos:
                    </h4>
                    <hr />
                    <DataTable
                        data={sucursales}
                        striped
                        pagination
                        dense
                        noHeader
                        responsive
                        keyField={"sucursalID"}
                        defaultSortField={"sucursalID"}
                        selectableRows

                        columns={[
                            {
                                name: 'Id',
                                selector: 'sucursalId',
                                sortable: true,
                            },
                            {
                                name: 'Producto',
                                selector: 'sucursal',
                                sortable: true,
                            },
                            {
                                name: 'Documento',
                                selector: 'documento',
                                sortable: true,
                            },



                        ]}
                    />


                    {loading && <Spinner />}
                    {!loading &&
                        <div className="text-end">
                            <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                                Cancelar
                            </button>
                            <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                Ok
                            </button>
                        </div>
                    }
                </div>


            </Form>

        </Formik>
    )
}