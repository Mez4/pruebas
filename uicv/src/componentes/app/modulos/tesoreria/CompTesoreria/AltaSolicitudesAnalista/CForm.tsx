import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import * as Funciones from '../AltaSolicitudesAnalista/Funciones'
import DataTable from 'react-data-table-component'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'


type CFormType = {
    Seguridad: IOidc,
    Id?: number,
    initialValues: {
        solicitudMCID:  number,
        usuario:        string,
        analistaID:     number
 
    },
    options: { value: number, label: string }[]
    //optionsLog: { value: number, label: string }[]
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any
}


export const CForm = (props: CFormType) => {

    const sucursales: any[] = [{ sucursalId: 1, sucursal: "San Miguel", estatus: true }, { sucursalId: 2, sucursal: "San Felipe", estatus: false }]
    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                // personaID: Yup.number().required("Campo obligatorio").moreThan(0, "Campo obligatorio"),
                // usuarioRegistra: Yup.number().required("Seleccione el analista").moreThan(0, "Seleccione el analista"),

            })}
            onSubmit={(values: any) => {

                // Set our form to a loading state
                setLoading(true)

                // Finish the callback
                if (props.Id === 18) {
                    Funciones.FNAdd(props.Seguridad, values)
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbGuardar(respuesta)
                        })
                        .catch((error: any) => {
                            alert("Error al actualizar el analista" + JSON.stringify(error))
                            setLoading(false)
                        })
                }
                else {
                    let actualizarAnalista: any = {
                        solicitudMcID: values.solicitudMCID,
                        usuario:       values.usuario,
                        analistaID:    values.analistaID,
                    }
                    values = actualizarAnalista

                    Funciones.FNUpdate(props.Seguridad, { ...values, solicitudMCID: props.Id as number })
                        .then((respuesta: any) => {
                            setLoading(false)
                            props.cbActualizar(respuesta)
                            toast.error('Actualizado correctamente')
                        })
                        .catch((error: any) => {
                            setLoading(false)
                            toast.error('Error al dactualizar analista')
                            // alert("Error al actualizar la cuenta" + JSON.stringify(error)
                        })
                }
            }}>
            <Form>
                <CustomSelect
                    disabled={loading}
                    label="Analista"
                    name="analistaID"
                    placeholder="Seleccione un analista"
                    options={props.options}
                    addDefault={false}
                    isMulti={false}
                />
                <hr/>
                <h4 >
                    Log Asigna Analistas:
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
                    columns={[
                        {
                            name: 'Id',
                            selector: 'sucursalId',
                            sortable: true,
                        },
                        {
                            name: 'Nombre',
                            selector: 'sucursal',
                            sortable: true,
                        },
                    ]}
                />

                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        <button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                            Ok
                        </button>
                    </div>
                }
            </Form>
        </Formik >
    )
}
