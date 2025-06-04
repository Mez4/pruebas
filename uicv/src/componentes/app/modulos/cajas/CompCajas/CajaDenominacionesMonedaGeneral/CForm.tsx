import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { valueContainerCSS } from 'react-select/src/components/containers'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import DataTable from 'react-data-table-component'
import { FaPencilAlt } from 'react-icons/fa'
import { BiBold } from 'react-icons/bi'

type CFormType = {
    Seguridad: IOidc,

    Id?: number,
    initialValues: {
        cajaID: number,
    },

    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    optionsSucursal: { value: number, label: string }[]
    optionsCajas: { value: number, label: string }[]
    DatosTabla: any[]
}

export const CForm = (props: CFormType) => {

    const [loading, setLoading] = React.useState(false)

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                //nombre: Yup.string().required("Campo obligatorio").min(4, "Minimo 4 caracteres").max(64, "Maximo 64 caracteres"),
                //acumulaCuentaId: Yup.number().required("Seleccione la cuenta acumula").moreThan(0, 'Seleccione la cuenta acumula'),
            })}
            onSubmit={(values: any) => {
                setLoading(true)
                // Finish the callback

            }}
        >
            <Form>
                <div>
                    <div>
                        {/* <CustomSelect
                            disabled={false} //props.Id === undefined ? false : true
                            label="Sucursal:"
                            name="bancoID"
                            placeholder="Seleccione..."
                            options={props.optionsSucursal}
                            addDefault={false}
                            isMulti={false}
                        />
                        <CustomSelect
                            disabled={false} //props.Id === undefined ? false : true
                            label="Caja:"
                            name="s"
                            placeholder="Seleccione..."
                            options={props.optionsCajas}
                            addDefault={false}
                            isMulti={false}
                        /> */}
                    </div>
                    <hr />
                    <h4 >
                        Cantidades Monetarias:
                    </h4>
                    <hr />
                    <DataTable
                        data={props.DatosTabla}
                        striped
                        //pagination
                        dense
                        noHeader
                        responsive
                        keyField={"catDenomEfectivoID"}
                        defaultSortField={"catDenomEfectivoID"}
                        columns={[
                            {
                                name: '--',
                                selector: 'realizaArqueo',
                                sortable: true,
                            },
                            {
                                name: 'DENOMINACION',
                                selector: 'claveDenominacion',
                                sortable: true,
                            },
                            {
                                name: 'VALOR MONETARIO',
                                selector: 'valorMonetario',
                                sortable: true,
                                wrap: true
                            },
                            {
                                name: 'CANTIDAD',
                                selector: 'cantidad',
                                sortable: true,
                            },
                            {
                                name: 'TOTAL',
                                selector: 'totalXEfectivo',
                                sortable: true,
                            },
                            {
                                name: '',
                                selector: 'nombreDenom',
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
                        </div>
                    }
                </div>


            </Form>

        </Formik>
    )
}

function setState(arg0: (s: any) => any) {
    throw new Error('Function not implemented.')
}
