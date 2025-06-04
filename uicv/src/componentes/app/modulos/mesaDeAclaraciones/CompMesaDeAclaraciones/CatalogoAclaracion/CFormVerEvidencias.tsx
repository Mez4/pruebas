import React, { useRef } from 'react'
import { Formik, Form, FieldArray } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, CustomSelect, Spinner, CustomFieldImgUpload } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import { ActionAsyncSelect, ActionAsyncSelectDefault } from '../../../../../global'
import { setDefaultLocale } from 'react-datepicker'
import { CFormAgregarEvidencia } from './CFormAgregarEvidencia'
import { Field, ErrorMessage } from 'formik'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { FaSearch } from 'react-icons/fa'
import { FiRefreshCcw } from 'react-icons/fi'
type CFormType = {
    oidc: IOidc
    Id?: number,
    initialValues: {
        Evidencias: any[],
    },

    fnCancelar(): any,

}
// let isMounted = React.useRef(true)
export const CFormVerEvidencias = (props: CFormType) => {
    const Columns: IDataTableColumn[] =
        [
            { name: 'DocumentoID', selector: 'DocumentoID', sortable: false, center: true },
            {
                name: 'Ruta', selector: 'Ruta', sortable: false, center: true,
                cell: (propss) => <span className="text-center">{propss.Ruta}</span>
            },
        ]
    const [loading, setLoading] = React.useState(false)
    console.log("PROPS RECIBIDOS ,", props)
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
            })}
            onSubmit={(values: any, { resetForm }) => {
                setLoading(true)
            }}>
            <Form>
                <div className="row">
                    sssssjsjjsjsjsjsjs
                    <DataTable
                        subHeader
                        noDataComponent={""}
                        data={props.initialValues.Evidencias}
                        striped
                        pagination
                        dense
                        noHeader
                        responsive
                        keyField={"DocumentoID"}
                        defaultSortField={"DocumentoID"}
                        columns={Columns}
                    />

                </div>

            </Form>
        </Formik>
    )
}