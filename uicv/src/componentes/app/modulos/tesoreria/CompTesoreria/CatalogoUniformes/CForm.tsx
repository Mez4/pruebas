import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { ActionAsyncSelect, CustomFieldText, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { ErrorMessage, Field } from 'formik'
import { toast } from 'react-toastify'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { FormateoDinero } from '../../../../../../global/variables'
import { FaCheck, FaCircle, FaLock, FaLockOpen, FaMoneyCheckAlt, FaWindowClose } from 'react-icons/fa'
import ReactTooltip from 'react-tooltip'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { CustomFieldImgUpload } from '../../../../../global'
import VerDocumento from '../SolicitudesGastosCajera/VerDocumento'
import { Input } from 'usetheform'


type CFormType = {
    oidc: IOidc
    Id: any,

    initialValues: {
        Estatus: string,
        Descripcion: string,
    },
     fnCancelar(): any,
    // fnVerDoc(): any
    // fnMostrarCargaDeDocumento(): any
    // activador(value?: number): any
    // desactivador(value?: number): any
    // setDocumentoID(item: any): any,
    // setSolicitudGastoID(item: any): any,
    // setSolicitudDetalleID(item: any): any,
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
}
export const CForm = (props: CFormType) => {
    const [loading, setLoading] = React.useState(false)
    const MySwal = withReactContent(Swal)

    // const deshabilitarBoton = (revisado: boolean) => {
    //     if (props.EstatusClave == "DOCS") {
    //         return true
    //     }

    // }

    const Columns: IDataTableColumn[] =
        [
            {
                name: 'DetalleID',
                selector: 'SolicitudDetalleID',
                sortable: false,
                center: true,

            },
            {
                center: true,
                name: 'Clave',
                selector: 'Clave',
                sortable: false,
            },
            {
                center: true,
                name: 'Descripción',
                selector: 'Descripcion',
                sortable: false,
                cell: row => <div className='text-center'>{row.Descripcion}</div>
            },
            {
                center: true,
                name: 'Total',
                selector: 'Total',
                sortable: false,
                cell: props => <div className='text-center'> {FormateoDinero.format(props.Total)} </div>,

            },
            {
                center: true,
                name: 'Estatus',
                selector: 'Cancelado',
                sortable: false,
                cell: (propsss) => {
                    if (!propsss.Revisado) {
                        return <FaCircle color="light-gray" title="Sin revisar" />
                    } else if (propsss.Revisado && propsss.Aceptado) {
                        return <FaCircle color="green" title="Aceptado" />
                    } else if (propsss.Revisado && !propsss.Aceptado) {
                        return <FaCircle color="red" title="Rechazado" />
                    }

                }

            },
        ]


    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
            })}
            onSubmit={(values: any) => {
                setLoading(true)
                if (props.Id === undefined) {
                    setLoading(true)
                let a = {
                    Estatus : values.Estatus,
                    Descripcion: values.Descripcion
                }

                  Funciones.FNAdd(props.oidc, a)
                  .then((respuesta: any) => {
                  props.fnCancelar()
                      props.cbGuardar(respuesta)
                      setLoading(false)
                  })
                  .catch(() => {
                      toast.error("Ocurrió un problema al guardar el elemento.")
                      setLoading(false)
                  })
                    //Funcion de agregar elemento
                }
                else {
                    setLoading(true)
                    let a = {
                        EstatusID: props.Id,
                        Estatus: values.Estatus,
                        Descripcion: values.Descripcion,
                    }
                    Funciones.FNUpdate(props.oidc, a)
                    .then((respuesta: any) => {
                    props.fnCancelar()
                        props.cbActualizar(respuesta)
                        setLoading(false)
                    })
                    .catch(() => {
                        toast.error("Ocurrió un problema al replicar cuenta")
                        setLoading(false)
                    })
                }
            }}>
            <Form>
                <div className="columns is-centered is-mobile is-multiline">
                    <div className="column text-center is-one-full-desktop is-full-tablet is-full-mobile">
                        <div style={{ fontSize: "14px" }}>
                            <span><strong>Id:</strong> <span >{props.Id}</span></span>
                        </div>
                        <div className="column text-center is-one-full-desktop is-full-tablet is-full-mobile">
                            <CustomFieldText disabled={false} label="Estatus" name="Estatus" placeholder="Estatus" />
                        </div> 
                        <div className="column text-center is-one-full-desktop is-full-tablet is-full-mobile">
                            <CustomFieldText disabled={false} label="Descripcion" name="Descripcion" placeholder="Descripcion" />
                        </div>
                    </div>
                </div>

                {loading && <Spinner />}
                {!loading &&
                    <div className="text-end">
                        {<button type="button" className="btn btn-danger waves-effect waves-light" onClick={props.fnCancelar}>
                            Cancelar
                        </button> }
                        <button disabled={false} type="submit" className="ms-2 btn btn-success waves-effect waves-light" >Ok</button>
                    </div>
                }
            </Form>
        </Formik>
    )
            
}