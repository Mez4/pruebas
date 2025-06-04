import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CodigosAutorizacion/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaBan } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'
import { CForm } from './CodigosAutorizacion/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'

import ReactTooltip from 'react-tooltip';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { toast } from 'react-toastify'

type CatalogosType = {
    oidc: IOidc
}

const CodigosAutorizacion = (props: CatalogosType) => {

    const MySwal = withReactContent(Swal)

    let isMounted = React.useRef(true)
    const DatosDefecto = { 
        AutorizacionTipoID: 0, 
        Fecha: new Date(), 
        UsuarioIDUtiliza: '', 
        Referencia: 0, 
        Observaciones: '' 
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
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
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                // }
            })
    }

    const FNCancelar = (Id: number) => {
        Funciones.FNCancel(props.oidc, {CodigoAutorizacionID: Id})
            .then((respuesta: any) => {
                if(respuesta.res == 1){
                    toast.success(respuesta.msj)
                    cbActualizar(respuesta.Data)
                }
                else
                {
                    toast.warning(respuesta.msj)
                }
            })
            .catch(() => {
                toast.error("Error al cancelar el código, vuelva a intentarlo.")
            })
    } 

    // const cbCancelar = (item: any) => 
    //     setState({ ...state, Datos: state.Datos.filter(( obj ) => { return obj.CreditoID !== item.CreditoID })})

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'CodigoAutorizacionID', sortable: true, },
                { name: 'Tipo Código Autorización', selector: 'AutorizacionTipo', sortable: true, },  
                { name: 'Código', selector: 'CODIGO', sortable: true, },         
                { name: 'Fecha', selector: 'Fecha', sortable: true, },          
                { name: 'Usuario Creó', selector: 'Creo', sortable: true, },  
                { name: 'Usuario Utiliza', selector: 'Utiliza', sortable: true, },  
                { name: 'Cancelado', selector: 'Cancelado', sortable: true, cell: (props) => <span>{props.Cancelado ? "SI" : "No"}</span> },
                { name: 'Utilizado', selector: 'Utilizado', sortable: true, cell: (props) => <span>{props.Utilizado ? "SI" : "No"}</span> },
                { name: 'Referencia', selector: 'Referencia', sortable: true, },
                { name: 'Observaciones', selector: 'Observaciones', sortable: true, },
                {
                    name: 'Acciones', sortable: false,
                    cell: (props) =>
                    <>
                    <button disabled={(props.Cancelado || props.Utilizado) ? true : false} data-tip="true" data-for={`CancelarTooltip${props.CodigoAutorizacionID}`} className="asstext" style={{margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed',borderCollapse: 'collapse'}} type={"button"} onClick={() => {
                        MySwal.fire({
                            title: '<strong>Cancelar Código</strong>',
                            icon: 'question',
                            html:
                              <div className="text-center">
                                Se cancelara el código ¿Desea continuar?      
                              </div>,
                            showCloseButton:  false,
                            showCancelButton: true,
                            showConfirmButton: true,
                            focusConfirm: false,
                            cancelButtonText: 'Cancelar',
                            confirmButtonText: 'Aceptar',
                            confirmButtonAriaLabel: 'Aceptar',
                            cancelButtonAriaLabel: ''
                        }).then((result) => {
                            if (result.isConfirmed) {
                                FNCancelar(props.CodigoAutorizacionID)
                            }
                        })
                    }}>
                        <FaBan />
                    </button>
                    <ReactTooltip id={`CancelarTooltip${props.CodigoAutorizacionID}`}
                        type="info"
                        effect="solid"
                        clickable
                        globalEventOff="click"
                    >
                        Cancelar Código
                    </ReactTooltip>
                    </>
                        // <button className="asstext" type={"button"} onClick={() => {
                        //     setState(s => ({
                        //         ...s,
                        //         Form: {
                        //             ...s.Form, Mostrar: true,
                        //             Datos: { AutorizacionTipoID: props.AutorizacionTipoID, Fecha: props.Fecha, UsuarioIDUtiliza: props.UsuarioIDUtiliza, Referencia: props.Referencia, Observaciones: props.Observaciones },
                        //             Id: props.CodigoAutorizacionID
                        //         }
                        //     }))
                        // }}>
                        //     <FaPencilAlt />
                        // </button>
                },
            ]
        return colRet
    }, [])

    React.useEffect(() => {
        // if (isMounted.current === true) {
            FNGetLocal()
        // }
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) =>
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } })

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.CodigoAutorizacionID === item.CodigoAutorizacionID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } })

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Administrar Códigos de Autorización">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    {/* <div className="text-end">
                                        <button type="button" className="btn btn-secondary btn-sm mb-2"
                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                        >
                                            Agregar
                                        </button>
                                    </div> */}
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar código" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                                        ><FaPlus /></button>
                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"CodigoAutorizacionID"}
                                        defaultSortField={"CodigoAutorizacionID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "Editar Código" : "Agregar Código"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar} />
                                        </ModalWin.Body>
                                    </ModalWin>
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

export default connect(mapStateToProps, mapDispatchToProps)(CodigosAutorizacion)