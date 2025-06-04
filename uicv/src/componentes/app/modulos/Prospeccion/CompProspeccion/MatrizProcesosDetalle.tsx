import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

import * as Funciones from './MatrizProcesosDetalle/Funciones'
import * as FnProcesos from './CatalogoStatusProceso/Funciones'
import * as FnActualizar from './MatrizProcesosDetalle/Funciones'
import { CustomFieldCheckbox } from '../../../../global/CustomFieldCheckbox'
import { CustomFieldText, ActionSelect } from '../../../../global'

// Icons
import { FaCheckCircle, FaMinusCircle, FaPencilAlt, FaPlus, FaRegCheckCircle, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'

import { FiltrarDatos } from '../../../../../global/functions'
import { bool } from 'yup'
import { CForm } from './MatrizProcesosDetalle/CForm'
import { BiCheckbox } from 'react-icons/bi'
import { MdCheckBox } from 'react-icons/md'
import { Field, ErrorMessage, Formik } from 'formik'
import { Form } from 'usetheform'
import { BsAlignCenter } from 'react-icons/bs'
import { toast } from 'react-toastify'


type CatalogosType = {
    oidc: IOidc
}

const MatrizProcesosDetalle = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)
    const DatosDefecto = { MatrizProcesosDetalleID: 0, MatrizProcesosID: 0, StatusProcesoID: 0, CapturaObligatoria: false, Notificacion: false, NotaObligatoria: false, DictamenObligatorio: false }
    const DatoMuestraBC: any = {}
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const DatosMostrar2: any[] = []
    const optProcesos: any[] = []
    const optCapturaObligatoria: any[] = []
    const [state, setState] = React.useState({
        DatoMuestraBC,
        Datos,
        DatosMostrar,
        DatosMostrar2,
        optProcesos,
        optCapturaObligatoria,
        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        }
    })

    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    console.log(respuesta);
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch((error) => {
                console.log("###e", error)
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }

    const FNGetMuestraBC = () => {
        Funciones.FNGetMuestraBC(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    console.log(respuesta);
                    setState(s => ({ ...s, DatoMuestraBC: respuesta }))
                }
            })
            .catch((error) => {
                console.log("###e", error)
                if (isMounted.current === true) {
                    if (error.response)
                        toast.error(`Response Error: ${error.response.data}`)
                    else if (error.request)
                        toast.error(`Request ${error}`)
                    else
                        toast.error(`${error}`)
                    setState(s => ({ ...s, DatoMuestraBC: {} }))
                }
            })
    }

    // const FnGetProcesos = () => {
    //     setState(s => ({ ...s }))
    //     FnProcesos.FNGet(props.oidc)
    //         .then((respuesta: any) => {
    //             var proceso = respuesta.map((valor: any) => {
    //                 var obj = { value: valor.StatusProcesoID, label: valor.Descripcion };
    //                 return obj
    //             });

    //             setState(s => ({ ...s, optProcesos: proceso }))
    //         })
    //         .catch(() => {
    //             setState(s => ({ ...s, optProcesos: [] }))
    //         })
    // }


    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Proceso',
                    selector: 'StatusProcesoID',
                    cell: (props) =>
                        <span>
                            {props.Descripcion}
                        </span>
                },

                {
                    name: 'Captura Obligatoria',
                    selector: 'CapturaObligatoria',
                    center: true,
                    cell: (props) =>
                        <div>
                            {props.StatusProcesoID > 7 ? <FaMinusCircle size={20} color='gray' /> : <div className="form-check form-switch form-switch-md mb-3" dir="ltr"><input type="checkbox" disabled={props.StatusProcesoID > 7} className="form-check-input" defaultChecked={props.StatusProcesoID > 7 ? false : props.CapturaObligatoria} onChange={e => cbCapturaObligatoria(e.target.checked, props.MatrizProcesosDetalleID, props.StatusProcesoID)} /></div>}
                            {/* <input type="checkbox" disabled={props.StatusProcesoID > 7} className="form-check-input" defaultChecked={props.StatusProcesoID > 7 ? false : props.CapturaObligatoria} onChange={e => cbCapturaObligatoria(e.target.checked,props.MatrizProcesosDetalleID,props.StatusProcesoID)}/> */}
                        </div>

                },

                // {
                //     name: 'Notificar Notas Nuevas(Prospección / Mesa)',
                //     selector: 'Notificacion',
                //     center: true,
                //     cell: (props) =>
                //         <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                //             <FaRegCheckCircle size={20} color='green' />
                //             {/* <input disabled type="checkbox" className="form-check-input" defaultChecked={true} onChange={e => cbNotificacion(e.target.checked,props.MatrizProcesosDetalleID,props.StatusProcesoID)}/> */}
                //         </div>
                // },

                // {
                //     name: 'Enviar Nota al rechazar (Mesa)',
                //     selector: 'NotaObligatoria',
                //     center: true,
                //     cell: (props) =>
                //         <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                //             {props.StatusProcesoID < 9 ? <FaMinusCircle size={20} color='gray' /> : <FaRegCheckCircle size={20} color='green' />}
                //             {/* <input disabled type="checkbox" className="form-check-input" defaultChecked={props.StatusProcesoID < 9 ? false : true} onChange={e => cbNotaObligatoria(e.target.checked,props.MatrizProcesosDetalleID,props.StatusProcesoID)}/> */}
                //         </div>
                // },

                // {
                //     name: 'Obligatorio para Activación (Mesa)',
                //     selector: 'DictamenObligatorio',
                //     center: true,
                //     cell: (props) =>
                //         <div>
                //             {props.StatusProcesoID < 8 ? <FaMinusCircle size={20} color='gray' /> : <div className="form-check form-switch form-switch-md mb-3" dir="ltr"><input type="checkbox" disabled={props.StatusProcesoID < 8} className="form-check-input" defaultChecked={props.StatusProcesoID < 8 ? false : props.DictamenObligatorio} onChange={e => cbDictamenObligatorio(e.target.checked, props.MatrizProcesosDetalleID, props.StatusProcesoID)} /></div>}
                //             {/* <input type="checkbox"disabled={props.StatusProcesoID < 8} className="form-check-input" defaultChecked={props.StatusProcesoID < 8 ? false : props.DictamenObligatorio} onChange={e => cbDictamenObligatorio(e.target.checked,props.MatrizProcesosDetalleID,props.StatusProcesoID)}/> */}
                //         </div>
                // },
            ]
        return colRet
    }, [state.Form])

    const Columns2 = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Proceso',
                    selector: 'StatusProcesoID',
                    cell: (props) =>
                        <span>
                            {props.Descripcion}
                        </span>
                },

                // {
                //     name: 'Captura Obligatoria (Prospección)',
                //     selector: 'CapturaObligatoria',
                //     center: true,
                //     cell: (props) =>
                //         <div>
                //             {props.StatusProcesoID > 7 ? <FaMinusCircle size={20} color='gray' /> : <div className="form-check form-switch form-switch-md mb-3" dir="ltr"><input type="checkbox" disabled={props.StatusProcesoID > 7} className="form-check-input" defaultChecked={props.StatusProcesoID > 7 ? false : props.CapturaObligatoria} onChange={e => cbCapturaObligatoria(e.target.checked, props.MatrizProcesosDetalleID, props.StatusProcesoID)} /></div>}
                //             {/* <input type="checkbox" disabled={props.StatusProcesoID > 7} className="form-check-input" defaultChecked={props.StatusProcesoID > 7 ? false : props.CapturaObligatoria} onChange={e => cbCapturaObligatoria(e.target.checked,props.MatrizProcesosDetalleID,props.StatusProcesoID)}/> */}
                //         </div>

                // },

                // {
                //     name: 'Notificar Notas Nuevas(Prospección / Mesa)',
                //     selector: 'Notificacion',
                //     center: true,
                //     cell: (props) =>
                //         <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                //             <FaRegCheckCircle size={20} color='green' />
                //             {/* <input disabled type="checkbox" className="form-check-input" defaultChecked={true} onChange={e => cbNotificacion(e.target.checked,props.MatrizProcesosDetalleID,props.StatusProcesoID)}/> */}
                //         </div>
                // },

                // {
                //     name: 'Enviar Nota al rechazar (Mesa)',
                //     selector: 'NotaObligatoria',
                //     center: true,
                //     cell: (props) =>
                //         <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                //             {props.StatusProcesoID < 9 ? <FaMinusCircle size={20} color='gray' /> : <FaRegCheckCircle size={20} color='green' />}
                //             {/* <input disabled type="checkbox" className="form-check-input" defaultChecked={props.StatusProcesoID < 9 ? false : true} onChange={e => cbNotaObligatoria(e.target.checked,props.MatrizProcesosDetalleID,props.StatusProcesoID)}/> */}
                //         </div>
                // },

                {
                    name: 'Obligatorio para Activación',
                    selector: 'DictamenObligatorio',
                    center: true,
                    cell: (props) =>
                        <div>
                            {props.StatusProcesoID < 8 ? <FaMinusCircle size={20} color='gray' /> : <div className="form-check form-switch form-switch-md mb-3" dir="ltr"><input type="checkbox" disabled={props.StatusProcesoID < 8} className="form-check-input" defaultChecked={props.StatusProcesoID < 8 ? false : props.DictamenObligatorio} onChange={e => cbDictamenObligatorio(e.target.checked, props.MatrizProcesosDetalleID, props.StatusProcesoID)} /></div>}
                            {/* <input type="checkbox"disabled={props.StatusProcesoID < 8} className="form-check-input" defaultChecked={props.StatusProcesoID < 8 ? false : props.DictamenObligatorio} onChange={e => cbDictamenObligatorio(e.target.checked,props.MatrizProcesosDetalleID,props.StatusProcesoID)}/> */}
                        </div>
                },
            ]
        return colRet
    }, [state.Form])

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        FNGetMuestraBC()
        //FnGetProcesos()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    // On use effect
    React.useEffect(() => {
        //setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))

        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos.filter(d => { return d.StatusProcesoID <= 7 }), Columns, state.Filtro) }))
        setState(s => ({ ...s, DatosMostrar2: FiltrarDatos(s.Datos.filter(d => { return d.StatusProcesoID > 9 }), Columns, state.Filtro) }))

        //datosFiltro.filter(d => { return d.producto.ProductoID === state.FiltroProductos })
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: { MatrizProcesosDetalleID: 0, MatrizProcesosID: 0, StatusProcesoID: 0, CapturaObligatoria: false, Notificacion: false, NotaObligatoria: false, DictamenObligatorio: false } } })
    }

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })


    const cbCapturaObligatoria = (CapturaObligatoria: boolean, MatrizProcesosDetalleID: number, StatusProcesoID: number) => {
        Funciones.FNUpdateCapturaObligatoria(props.oidc, { MatrizProcesosDetalleID, CapturaObligatoria, StatusProcesoID })
    }

    const cbNotificacion = (Notificacion: boolean, MatrizProcesosDetalleID: number, StatusProcesoID: number) => {
        Funciones.FNUpdateNotificacion(props.oidc, { MatrizProcesosDetalleID, Notificacion, StatusProcesoID })
    }

    const cbNotaObligatoria = (NotaObligatoria: boolean, MatrizProcesosDetalleID: number, StatusProcesoID: number) => {
        Funciones.FNUpdateNotaObligatoria(props.oidc, { MatrizProcesosDetalleID, NotaObligatoria, StatusProcesoID })
    }


    const cbDictamenObligatorio = (DictamenObligatorio: boolean, MatrizProcesosDetalleID: number, StatusProcesoID: number) => {
        Funciones.FNUpdateDictamenObligatorio(props.oidc, { MatrizProcesosDetalleID, DictamenObligatorio, StatusProcesoID })
    }

    const cbMostrarBuro = () => {
        Funciones.FNUpdateMostrarBuro(props.oidc, {})
    }

    const FnActivarMatriz = () => {
        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNActivarMartriz(props.oidc)
            .then((respuesta: any) => {
                FNGetLocal()
            })
            .catch((error: any) => {
                setState(s => ({ ...s, Cargando: false }))
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
            })
    }


    return (

        <div className="row">
            <div className="col-12">
                <Card Title="Control de Procesos">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div className='row'>
                                    <div className='col-6'>
                                        <Card>
                                            <Card.Body>
                                                <Card.Body.Content>
                                                    <caption style={{ captionSide: 'top' }}><strong>PROSPECCIÓN</strong></caption>
                                                    <DataTable
                                                        noDataComponent={<div style={{ margin: '4em' }}>
                                                            Presiona <button className="btn btn-outline-secondary" type="button" onClick={() => FnActivarMatriz()}><FiRefreshCcw /></button> para Activar la Matriz de Procesos para este Producto
                                                        </div>}
                                                        data={state.DatosMostrar}
                                                        striped
                                                        dense
                                                        noHeader
                                                        responsive
                                                        keyField={"MatrizProcesosDetalleID"}
                                                        defaultSortField={"StatusProcesoID"}
                                                        columns={Columns}
                                                    />
                                                </Card.Body.Content>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                    <div className='col-6'>
                                        <Card>
                                            <Card.Body>
                                                <Card.Body.Content>
                                                    <caption style={{ captionSide: 'top', width: 'max-content' }}><strong>MESA DE CRÉDITO</strong></caption>
                                                    <DataTable
                                                        noDataComponent={<div style={{ margin: '4em' }}>
                                                            Presiona <button className="btn btn-outline-secondary" type="button" onClick={() => FnActivarMatriz()}><FiRefreshCcw /></button> para Activar la Matriz de Procesos para este Producto
                                                        </div>}
                                                        data={state.DatosMostrar2}
                                                        striped
                                                        dense
                                                        noHeader
                                                        responsive
                                                        keyField={"MatrizProcesosDetalleID"}
                                                        defaultSortField={"StatusProcesoID"}
                                                        columns={Columns2}
                                                    />
                                                </Card.Body.Content>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                    <div className='col-6'>
                                        <Card>
                                            <Card.Body>
                                                <Card.Body.Content>
                                                    <caption style={{ captionSide: 'top' }}><strong>MUESTRA</strong></caption>
                                                    <table className='table'>
                                                        <tbody>
                                                            <tr>
                                                                <td style={{ fontSize: '14px', paddingLeft: '16px' }} width={'50%'}>MOSTRAR BURO A PROMOTOR</td>
                                                                <td style={{ textAlign: 'center' }} width={'50%'}>
                                                                    <div className="form-check form-switch form-switch-md mb-3" dir="ltr" style={{ marginLeft: '92px' }}><input type="checkbox" disabled={false} className="form-check-input" defaultChecked={state.DatoMuestraBC.MostrarBuroPromotor} onChange={e => cbMostrarBuro()} /></div>
                                                                </td>
                                                                {/* <td style={{ textAlign: 'center' }} width={'20%'}><FaMinusCircle size={20} color='gray' /></td>
                                                <td style={{ textAlign: 'center' }} width={'20%'}><FaMinusCircle size={20} color='gray' /></td>
                                                <td style={{ textAlign: 'center' }} width={'20%'}><FaMinusCircle size={20} color='gray' /></td> */}
                                                            </tr>
                                                        </tbody>
                                                    </table></Card.Body.Content>
                                            </Card.Body>
                                        </Card>
                                        <ModalWin open={state.Form.Mostrar}>
                                            <ModalWin.Header>
                                                <h5 className={MODAL_TITLE_CLASS}>Matriz Procesos Detalle</h5>
                                            </ModalWin.Header>
                                            <ModalWin.Body>
                                                {<CForm
                                                    oidc={props.oidc}
                                                    optProcesos={state.optProcesos}
                                                    initialValues={state.Form.Datos}
                                                    Id={state.Form.Id}
                                                    cbGuardar={cbAgregar}
                                                    fnCancelar={fnCancelar}
                                                />}
                                            </ModalWin.Body>
                                        </ModalWin>
                                    </div>
                                </div>
                            }
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>
        </div >
    )

}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(MatrizProcesosDetalle);