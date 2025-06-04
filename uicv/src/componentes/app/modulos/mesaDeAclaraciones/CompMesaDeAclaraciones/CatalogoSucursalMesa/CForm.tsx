import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner, CustomSelect, ActionSelect } from '../../../../../global'
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import * as Funciones from './Funciones'
import { valueContainerCSS } from 'react-select/src/components/containers'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { valueEventAriaMessage } from 'react-select/src/accessibility'
import DataTable from 'react-data-table-component'
import { FaCheckSquare, FaCircle, FaPencilAlt, FaRegSquare, FaTrash, FaTrashAlt, FaUndo } from 'react-icons/fa'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ArrayList from '../../../../../global/ArrayList'
import ReactTooltip from 'react-tooltip'

type CFormType = {
    Seguridad: IOidc,
    Id?: number,
    initialValues: {
        MesaSucursalID: number,
        MesaAclaracionID: number,
        NombreMesaAclaracion: string,
        SucursalesAsignadas: any[],
    },
    cbActualizar(item: any): any,
    cbGuardar(item: any): any,
    fnCancelar(): any,
    activador(item: any): any,
    agregarSucursales(item: any, SucursalID: any): any, //sucursales
    optionsMesa: { value: number, label: string, MesaAclaracionID: number, NombreMesaAclaracion: string }[], //mesas sin sucusales
    optionsSucursal: { value: number, label: string, SucursalID: number, NombreSucursal: string }[],
}
export const CForm = (props: CFormType) => {
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = React.useState(false)
    const DatosProps: any[] = []
    const agregarSucursal = (item: any) => { //vista sucurales sin mesas asignadas
        let a = {
            SucursalID: item.SucursalID,
            NombreSucursal: item.NombreSucursal,
            MesaAclaracionID: props.initialValues.MesaAclaracionID,
            Eliminado: false,
            Nueva: true,
            Existe: false,
        }
        props.agregarSucursales(a, props.initialValues.MesaAclaracionID)
    }
    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                MesaAclaracionID: Yup.number().required("Seleccione la Mesa de Aclaración").moreThan(0, 'Seleccione la Mesa de Aclaración'),
                // NombreSucursal: Yup.string().required("Seleccione la Sucursal"),
                // SucursalID: Yup.number().required("Seleccione la Sucursal").moreThan(0, 'Seleccione la Sucursal'),
            })}
            onSubmit={(values: any ) => {
                try {
                    if (props.Id != undefined) {
                        MySwal.fire({
                            focusCancel: false,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            icon: 'info',
                            html: <div><br />
                                <h3 className="text-center">Confirmación</h3>
                                <div className={`modal-body`}>
                                    <h5 className="text-center">Verifica las Sucursales. <br />
                                    </h5>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="table-responsive">
                                                <table className="table table-striped table-bordered table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th className='text-center'>Id</th>
                                                            <th className='text-center'>Sucursal</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {props.initialValues.SucursalesAsignadas.map((item: any) => {
                                                            return (
                                                                <tr key={item.MesaAclaracionID}>
                                                                    <td className='text-center'>{item.SucursalID} </td>
                                                                    <td className='text-center'>{(item.NombreSucursal)}</td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>,
                            showCloseButton: false,
                            showCancelButton: true,
                            showConfirmButton: true,
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#3085d6',
                            cancelButtonText: 'Cancelar',
                            cancelButtonColor: '#d33',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                setLoading(true)
                                MySwal.fire(
                                    {
                                        icon: 'info',
                                        html: <div><br />
                                            <h3 className="text-center">Actualizando</h3>
                                            <div className={`modal-body`}>
                                                <h5 className="text-center">Espera mientras se procesa la solicitud. <br /> </h5>
                                            </div>
                                        </div>,
                                        timerProgressBar: true,
                                        allowEscapeKey: false,
                                        allowOutsideClick: false,
                                        didOpen: () => {
                                            MySwal.showLoading()
                                        },
                                    }
                                );
                                let a = {
                                    MesaAclaracionID: values.MesaAclaracionID,
                                    MesaSucursalID: 0,
                                    SucursalID: values.SucursalID,
                                    SucursalesAsignadas: values.SucursalesAsignadas,
                                }
                                console.log("DATOS ANTES UPDATE", values)
                                Funciones.FNUpdate(props.Seguridad, a)
                                    .then((respuesta: any) => {
                                        console.log("DATOS DESPUES UPDATE", respuesta)
                                        props.cbActualizar(respuesta.data)
                                        toast.success('Los datos se actualizaron correctamente')
                                        setLoading(false)
                                        MySwal.close()
                                    })
                                    .catch((res: any) => {
                                        setLoading(false)
                                        toast.error("Ocurrió un problema mientras se guardaba, reintente.")
                                        MySwal.close()
                                    })
                            } else {
                                MySwal.fire(
                                    {
                                        icon: 'info',
                                        html: <div><br />
                                            <h3 className="text-center">Aviso</h3>
                                            <div className={`modal-body`}>
                                                <h5 className="text-center">Operación cancelada por el usuario.</h5>
                                            </div>
                                        </div>,
                                        confirmButtonText: `Continuar`,
                                        confirmButtonColor: '#3085d6',
                                    }
                                );
                            }
                        })
                    } else {
                        MySwal.fire({
                            focusCancel: false,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            icon: 'info',
                            html: <div><br />
                                <h3 className="text-center">Confirmación</h3>
                                <div className={`modal-body`}>
                                    <h5 className="text-center">Verifica las Sucursales. <br />
                                    </h5>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="table-responsive">
                                                <table className="table table-striped table-bordered table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th className='text-center'>Id</th>
                                                            <th className='text-center'>Sucursal</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {props.initialValues.SucursalesAsignadas.map((item: any) => {
                                                            return (
                                                                <tr key={item.MesaAclaracionID}>
                                                                    <td className='text-center'>{item.SucursalID} </td>
                                                                    <td className='text-center'>{(item.NombreSucursal)}</td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>,
                            showCloseButton: false,
                            showCancelButton: true,
                            showConfirmButton: true,
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#3085d6',
                            cancelButtonText: 'Cancelar',
                            cancelButtonColor: '#d33',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                setLoading(true)
                                MySwal.fire(
                                    {
                                        icon: 'info',
                                        html: <div><br />
                                            <h3 className="text-center">Guardando</h3>
                                            <div className={`modal-body`}>
                                                <h5 className="text-center">Espera mientras se procesa la solicitud. <br /> </h5>
                                            </div>
                                        </div>,
                                        timerProgressBar: true,
                                        allowEscapeKey: false,
                                        allowOutsideClick: false,
                                        didOpen: () => {
                                            MySwal.showLoading()
                                        },
                                    }
                                );
                                let a = {
                                    MesaAclaracionID: values.MesaAclaracionID,
                                    MesaSucursalID: 0,
                                    SucursalID: values.SucursalID,
                                    SucursalesAsignadas: values.SucursalesAsignadas,
                                }
                                console.log("VALORES A ENVIAR AGREGAR", values)
                                Funciones.FNAdd(props.Seguridad, a)
                                    .then((respuesta: any) => {
                                        console.log("RESPUESTA PETICIÓN ADD", respuesta)
                                        props.cbGuardar(respuesta)
                                        toast.success('Los datos se guardaron correctamente')
                                        setLoading(false)
                                        MySwal.close()
                                    })
                                    .catch((res: any) => {
                                        setLoading(false)
                                        toast.error("Ocurrió un problema mientras se guardaba, reintente.")
                                        MySwal.close()
                                    })
                            } else {
                                MySwal.fire(
                                    {
                                        icon: 'info',
                                        html: <div><br />
                                            <h3 className="text-center">Aviso</h3>
                                            <div className={`modal-body`}>
                                                <h5 className="text-center">Operación cancelada por el usuario.</h5>
                                            </div>
                                        </div>,
                                        confirmButtonText: `Continuar`,
                                        confirmButtonColor: '#3085d6',
                                    }
                                );
                            }
                        })
                    }
                }
                catch (error) {
                    toast.error("Ocurrió un problema al guardar la Mesa de Aclaración, verifica los datos.")
                }
                // Set loading false
            }}
        >
            <Form>
                {/*Empieza modal para agregar */}
                {!props.Id &&
                    <div>
                        <ActionSelect
                            disabled={loading}
                            label="Mesa Aclaración"
                            name="MesaAclaracionID"
                            placeholder="Seleccione una mesa"
                            options={props.optionsMesa}
                            addDefault={false}
                            valor={props.initialValues.MesaAclaracionID}/>
                        <ActionSelect
                            disabled={false}
                            label="Sucursal"
                            name="SucursalID"
                            placeholder="TODOS"
                            options={props.optionsSucursal}
                            addDefault={false}
                            accion2={(value: any) => { agregarSucursal(value) }} />
                        <div>
                            <h5 >
                                Sucursales por asignar:
                            </h5>
                            <DataTable
                                data={props.initialValues.SucursalesAsignadas}
                                striped
                                pagination
                                dense
                                noHeader
                                responsive
                                keyField={"SucursalID"}
                                defaultSortField={"SucursalID"}
                                columns={[
                                    {
                                        name: 'Id',
                                        selector: 'SucursalID',
                                        sortable: false,
                                        center: true,
                                        conditionalCellStyles: [
                                            { when: (row: any) => row.Existe == 1 && row.Nueva,
                                                style: { textAlign: 'center', color: 'black', fontWeight: 'bold', backgroundColor: '#5ccb5f', },
                                            },
                                            { when: (row: any) => row.Existe == 1 && row.Eliminado,
                                                style: { textAlign: 'center', color: 'black', fontWeight: 'bold', backgroundColor: '#ffcdd2', },
                                            },
                                            { when: (row: any) => row.Existe == 0 && row.Nueva,
                                                style: { textAlign: 'center', color: 'black', fontWeight: 'bold', backgroundColor: '#5ccb5f', },
                                            },
                                            { when: (row: any) => row.Existe == 0 && row.Eliminado,
                                                style: { textAlign: 'center', color: 'black', fontWeight: 'bold', backgroundColor: '#ffcdd2', },
                                            },
                                        ],
                                    },
                                    {
                                        name: 'Sucursal',
                                        selector: 'NombreSucursal',
                                        sortable: false,
                                        center: true,
                                        conditionalCellStyles: [
                                            { when: (row: any) => row.Existe == 1 && row.Nueva,
                                                style: { textAlign: 'center', color: 'black', fontWeight: 'bold', backgroundColor: '#5ccb5f', },
                                            },
                                            { when: (row: any) => row.Existe == 1 && row.Eliminado,
                                                style: { textAlign: 'center', color: 'black', fontWeight: 'bold', backgroundColor: '#ffcdd2', },
                                            },
                                            { when: (row: any) => row.Existe == 0 && row.Nueva,
                                                style: { textAlign: 'center', color: 'black', fontWeight: 'bold', backgroundColor: '#5ccb5f', },
                                            },
                                            { when: (row: any) => row.Existe == 0 && row.Eliminado,
                                                style: { textAlign: 'center', color: 'black', fontWeight: 'bold', backgroundColor: '#ffcdd2', },
                                            },
                                        ],
                                    },
                                    {
                                        //Button eliminar
                                        name: 'Eliminar',
                                        selector: 'Eliminar',
                                        sortable: false,
                                        center: true,
                                        conditionalCellStyles: [
                                            { when: (row: any) => row.Existe == 1 && row.Nueva,
                                                style: { textAlign: 'center', color: 'black', fontWeight: 'bold', backgroundColor: '#5ccb5f', },
                                            },
                                            { when: (row: any) => row.Existe == 1 && row.Eliminado,
                                                style: { textAlign: 'center', color: 'black', fontWeight: 'bold', backgroundColor: '#ffcdd2', },
                                            },
                                            { when: (row: any) => row.Existe == 0 && row.Nueva,
                                                style: { textAlign: 'center', color: 'black', fontWeight: 'bold', backgroundColor: '#5ccb5f', },
                                            },
                                            { when: (row: any) => row.Existe == 0 && row.Eliminado,
                                                style: { textAlign: 'center', color: 'black', fontWeight: 'bold', backgroundColor: '#ffcdd2', },
                                            },
                                        ],
                                        cell: (propss) =>
                                            <button data-tip data-for={`NombreCompletoTooltip${propss.SucursalID}`} className="asstext" type={"button"} onClick={() => {
                                                if (propss.Eliminado == 2) {
                                                    return;
                                                } else {
                                                    props.activador(propss)
                                                }
                                            }} >
                                                {
                                                    propss.Eliminado ?
                                                    <FaUndo /> : <FaTrash />
                                                }
                                                <ReactTooltip id={`NombreCompletoTooltip${propss.SucursalID}`}
                                                    type="dark"
                                                    effect="solid"
                                                    clickable
                                                    globalEventOff="click"                                                >
                                                    {propss.Eliminado ? "Deshacer eliminación" : "Eliminar"}
                                                </ReactTooltip>

                                            </button>,
                                    },
                                ]}
                            />
                        </div>
                        {/*Finaliza tabla */}
                        {loading && <Spinner />}
                        {!loading &&
                            <div className="text-end">
                                <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={
                                    props.fnCancelar}>
                                    Cancelar
                                </button>
                                <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">
                                    Ok
                                </button>
                            </div>
                        }
                    </div>
                }
                {/*Empieza modal para actualizar */}
                {props.Id &&
                    <div>
                        <CustomFieldText
                            disabled={props.Id === undefined ? false : true}
                            label="Nombre:"
                            name="NombreMesaAclaracion"
                            placeholder={props.initialValues.NombreMesaAclaracion} />
                        <ActionSelect
                            disabled={false}
                            label="Sucursal"
                            name="SucursalID"
                            placeholder="TODOS"
                            options={props.optionsSucursal}
                            addDefault={false}
                            accion2={(value: any) => { agregarSucursal(value) }} />
                        <div>
                            <h5 >
                                Sucursales asignadas a la mesa:
                            </h5>
                            <DataTable
                                data={props.initialValues.SucursalesAsignadas}
                                striped
                                pagination
                                dense
                                noHeader
                                responsive
                                keyField={"SucursalID"}
                                defaultSortField={"SucursalID"}
                                columns={[
                                    {
                                        name: 'Id',
                                        selector: 'SucursalID',
                                        sortable: false,
                                        center: true,
                                        conditionalCellStyles: [
                                            { when: (row: any) => row.Existe == 1 && row.Nueva,
                                                style: { textAlign: 'center', color: 'black', fontWeight: 'bold', backgroundColor: '#5ccb5f', },
                                            },
                                            { when: (row: any) => row.Existe == 1 && row.Eliminado,
                                                style: { textAlign: 'center', color: 'black', fontWeight: 'bold', backgroundColor: '#ffcdd2', },
                                            },
                                            { when: (row: any) => row.Existe == 0 && row.Nueva,
                                                style: { textAlign: 'center', color: 'black', fontWeight: 'bold', backgroundColor: '#5ccb5f', },
                                            },
                                            { when: (row: any) => row.Existe == 0 && row.Eliminado,
                                                style: { textAlign: 'center', color: 'black', fontWeight: 'bold', backgroundColor: '#ffcdd2', },
                                            },
                                        ],
                                    },
                                    {
                                        name: 'Sucursal',
                                        selector: 'NombreSucursal',
                                        sortable: false,
                                        center: true,
                                        conditionalCellStyles: [
                                            { when: (row: any) => row.Existe == 1 && row.Nueva,
                                                style: { textAlign: 'center', color: 'black', fontWeight: 'bold', backgroundColor: '#5ccb5f', },
                                            },
                                            {  when: (row: any) => row.Existe == 1 && row.Eliminado,
                                                style: { textAlign: 'center', color: 'black', fontWeight: 'bold', backgroundColor: '#ffcdd2', },
                                            },
                                            { when: (row: any) => row.Existe == 0 && row.Nueva,
                                                style: { textAlign: 'center', color: 'black', fontWeight: 'bold', backgroundColor: '#5ccb5f', },
                                            },
                                            { when: (row: any) => row.Existe == 0 && row.Eliminado,
                                                style: { textAlign: 'center', color: 'black', fontWeight: 'bold', backgroundColor: '#ffcdd2', },
                                            },
                                        ],
                                    },
                                    {
                                        //Button eliminar
                                        name: 'Eliminar',
                                        selector: 'Eliminar',
                                        sortable: false,
                                        center: true,
                                        conditionalCellStyles: [
                                            { when: (row: any) => row.Existe == 1 && row.Nueva,
                                                style: { textAlign: 'center', color: 'black', fontWeight: 'bold', backgroundColor: '#5ccb5f', },
                                            },
                                            { when: (row: any) => row.Existe == 1 && row.Eliminado,
                                                style: { textAlign: 'center', color: 'black', fontWeight: 'bold', backgroundColor: '#ffcdd2', },
                                            },
                                            { when: (row: any) => row.Existe == 0 && row.Nueva,
                                                style: { textAlign: 'center', color: 'black', fontWeight: 'bold', backgroundColor: '#5ccb5f', },
                                            },
                                            { when: (row: any) => row.Existe == 0 && row.Eliminado,
                                                style: { textAlign: 'center', color: 'black', fontWeight: 'bold', backgroundColor: '#ffcdd2', },
                                            },
                                        ],
                                        cell: (propss) =>
                                            <button data-tip data-for={`NombreCompletoTooltip${propss.SucursalID}`} className="asstext" type={"button"} onClick={() => {
                                                if (propss.Eliminado == 2) {
                                                    return;
                                                } else {
                                                    console.log("PROPSS CLICK ,", propss)
                                                    props.activador(propss)
                                                }
                                            }} >
                                                {
                                                    propss.Eliminado ?
                                                    <FaUndo /> : <FaTrash />
                                                }
                                                <ReactTooltip id={`NombreCompletoTooltip${propss.SucursalID}`}
                                                    type="dark"
                                                    effect="solid"
                                                    clickable
                                                    globalEventOff="click"                                                >
                                                    {propss.Eliminado ? "Deshacer eliminación" : "Eliminar"}
                                                </ReactTooltip>

                                            </button>,
                                    },
                                ]}
                            />
                        </div>
                        {/*Finaliza tabla */}
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
                }
            </Form>
        </Formik >
    )
}