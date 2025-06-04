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

const TiempoPorProceso = (props: CatalogosType) => {
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
        Datos: [],
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
        Funciones.FNGetTiempos(props.oidc)
            .then((respuesta: any) => {
                console.log(respuesta)
                if (isMounted.current === true) {
                   
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta, DatosMostrar: respuesta }))
                    
                }
            })
            .catch((error) => {
                console.log("###e", error)
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }



    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'ID',
                    selector: 'ID',
                    width: '10%',
                    cell: (props) =>
                        <span>
                            {props.ID}
                        </span>
                },

                {
                    name: 'Pantalla Actual',
                    width: '10%',
                    selector: 'Pantalla',
                    cell: (props) =>
                        <span>
                            {props.Pantalla}
                        </span>
                },
                {
                    name: 'Prospecto ID',
                    selector: 'ProspectoID',
                    width: '10%',
                    cell: (props) =>
                        <span>
                            {props.ProspectoID}
                        </span>
                },
                {
                    name: 'Prospecto Nombre',
                    selector: 'Prospecto',
                    cell: (props) =>
                        <span>
                            {props.Prospecto}
                        </span>
                },
                {
                    name: 'Revisión de Buro',
                    selector: 'RevisionTiempo',
                    cell: (props) =>
                        <span>
                            {props.RevisionTiempo == null ? 'SIN TERMINAR' : props.RevisionTiempo}
                        </span>
                },
                {
                    name: 'Verificación y Llamadas',
                    selector: 'LlamadasTiempo',
                    cell: (props) =>
                        <span>
                            {props.LlamadasTiempo == null  ? 'PROCESO NO COMENZADO AUN': props.LlamadasTiempo}
                        </span>
                },
                {
                    name: 'Expediente y Activación',
                    selector: 'ExpedienteTiempo',
                    cell: (props) =>
                        <span>
                            {props.ExpedienteTiempo == null ? 'PROCESO NO COMENZADO AUN': props.ExpedienteTiempo}
                        </span>
                },

               
            ]
        return colRet
    }, [state.Form])


    // Use effect
    React.useEffect(() => {
        FNGetLocal()
        
        
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    // On use effect
    React.useEffect(() => {
        //setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
       

        //datosFiltro.filter(d => { return d.producto.ProductoID === state.FiltroProductos })
        // eslint-disable-next-line
    }, [state.Filtro])

    /** funcion Callback al agregar un item */
   

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })


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

    console.log('res:', state.Datos, state.DatosMostrar);
    return (

        <div className="row">
            <div className="col-12">
                <Card Title="Control de Tiempo">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div className='row'>
                                    <div className='col-12'>
                                        <Card>
                                            <Card.Body>
                                                <Card.Body.Content>
                                                    <strong style={{padding: 0}}>Duración por Proceso de Mesa De Credito (Tiempo que tardó en salir de cada validación)</strong> <br />
                                                    <DataTable
                                                        noDataComponent={<div style={{ margin: '4em' }}>
                                                            Presiona <button className="btn btn-outline-secondary" type="button" onClick={() => FnActivarMatriz()}><FiRefreshCcw /></button> para Activar la Matriz de Procesos para este Producto
                                                        </div>}
                                                        subHeader
                                                        subHeaderComponent=
                                                        {
                                                            <div className="row">
                                                                <div className="col-sm-12">
                                                                    <div className="input-group mb-3" >
                                                                        
                                                                            <input type="text" className="form-control" placeholder="Buscar" value={state.Filtro}
                                                                                onChange={e => {
                                                                                    setState(s => ({ ...s, Filtro: e.target.value, DatosMostrar: FiltrarDatos(s.DatosMostrar, Columns, e.target.value) }))
                                                                                    
                                                                                }}
                                                                                
                                                                            /><span className="input-group-text"><FaSearch /> </span>
                                                                            
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                        data={state.DatosMostrar}
                                                        striped
                                                        dense
                                                        noHeader
                                                        responsive
                                                        keyField={"ID"}
                                                        defaultSortField={"ID"}
                                                        columns={Columns}
                                                    />
                                                </Card.Body.Content>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                   
                                        {/* <ModalWin open={state.Form.Mostrar}>
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
                                        </ModalWin> */}
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
export default connect(mapStateToProps, mapDispatchToProps)(TiempoPorProceso);