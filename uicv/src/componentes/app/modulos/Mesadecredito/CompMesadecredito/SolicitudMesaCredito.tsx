import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './SolicitudMesaCredito/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import * as FnProductos from '../../creditos/CompCreditos/CreditoProducto/Funciones'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { ActionSelect, Card, Spinner } from '../../../../global'

import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { CForm } from './SolicitudMesaCredito/CForm'
import { MdRowing } from 'react-icons/md'
import { ErrorMessage, Field } from 'formik'
import DatePicker from "react-datepicker";


import Select from 'react-select'
import { spacing } from 'react-select/src/theme'





type CatalogosType = {
    oidc: IOidc
    
}
const SolicitudMesaCredito = (props: CatalogosType) => {

    // Controll our mounted state
    let isMounted = React.useRef(true)

    // Basic variables
    const DatosDefecto = { 	PersonaID :	0,ProductoID:0	,SucursalID :0,UsuarioRegistraID:'',FechaHoraRegistro:'',FechaHoraResolucion	:''	,EstatusValidacionID:0	,GrupoID:0,CreditoID :0,PersonaRegistraID :		0	 }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optProductos: any[] = []
    
    const [state, setState ] = React.useState({
        Datos,
        DatosMostrar,
        optProductos,
        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined
        },

       
    })
    const [startDate, setStartDate] = React.useState<Date | null>(new Date());
    const [selectedOptions, setSelectedOptions] = React.useState([]);


    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc,selectedOptions,startDate)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }
    const handleChange = (options:any) => {
       // sel_estatus =  options.label;
        console.log(selectedOptions)
        setSelectedOptions(options);
      
        //console.log("Selected Options: ", sel_estatus)
      };

      const handleChangedtp = (options:any) => {
        //setSelectedOptions(options);
       // sel_date =  options;
        setStartDate(options)
       // console.log("Selected dtp: ", sel_date)
      };
  
    const options = [
        { value: '1', label: 'PROSPECTO' },
        { value: '2', label: 'REVISION' },
        { value: '3', label: 'RECHAZADA' },
        { value: '4', label: 'AUTORIZADA' },
        { value: '5', label: 'DV' }
      ]
    function getCssClass(value: string) {
        if (value == "PROSPECTO")
        return "red";
        if(value=="REVISION")
        return "purple";
        if(value=="RECHAZADA")
        return "blue";
        if(value=="AUTORIZADA")
        return "cyan";
        if(value=="DV")
        return "green";
        

      }
    // Define the columns
    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'SolicitudMesaCreditoID', sortable: true, },
                { name: 'Nombre', selector: 'Nombre', sortable: true, },
                { name: 'Producto', selector: 'Producto', sortable: true, },
                { name: 'Sucursal', selector: 'Sucursal', sortable: true, },
                { name: 'UsuarioRegistra', selector: 'UsuarioRegistra', sortable: true, },
                { name: 'Fecha Hora Registro', selector: 'FechaHoraRegistro', sortable: true, },
                { name: 'Fecha Hora Resolucion', selector: 'FechaHoraResolucion', sortable: true, },
                { 
                    name: 'Estatus Validacion', selector: 'EstatusValidacion', sortable: false,  
                    cell: (props) =>
                       
                    <span style={{color: getCssClass(props.EstatusValidacion)}}>
                     {props.EstatusValidacion}
                    </span>
                },
                { name: 'Grupo', selector: 'Grupo', sortable: true, },
                { name: 'Credito', selector: 'CreditoID', sortable: true, },
                { name: 'PersonaRegistra', selector: 'PersonaRegistra' , sortable: true, },
              /*  {
                    name: 'Acciones', sortable: false,
                    cell: (props) =>
                        <button className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...s.Form, Mostrar: true,
                                    Datos: { SolicitudMesaCreditoID : props.SolicitudMesaCreditoID,PersonaID :	props.PersonaID ,ProductoID : props.ProductoID	,SucursalID : props.SucursalID,UsuarioRegistraID :props.UsuarioRegistraID,FechaHoraRegistro : props.FechaHoraRegistro,FechaHoraResolucion : props.FechaHoraResolucion	,EstatusValidacionID : props.EstatusValidacionID,GrupoID : props.GrupoID,CreditoID : props.CreditoID ,PersonaRegistraID : props.PersonaRegistraID
                                    },
                                    Id: props.SolicitudMesaCreditoID
                                }
                            }))
                        }}>
                            <FaPencilAlt />
                        </button>
                }, */
            ]
        return colRet
    }, [])

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
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: {PersonaID :	0,ProductoID:0	,SucursalID :0,UsuarioRegistraID:'',FechaHoraRegistro:'',FechaHoraResolucion	:''	,EstatusValidacionID:0	,GrupoID:0,CreditoID :0,PersonaRegistraID :		0		
    } } })
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.SolicitudMesaCreditoID === item.SolicitudMesaCreditoID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: {PersonaID :	0,ProductoID:0	,SucursalID :0,UsuarioRegistraID:'',FechaHoraRegistro:'',FechaHoraResolucion	:''	,EstatusValidacionID:0	,GrupoID:0,CreditoID :0,PersonaRegistraID :		0	 } } })

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false } })

    
    return (
        
        <div className="row mt-sm0">
            <div className="col-12">
                <Card Title="Solicitudes Mesa Credito">
                   
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                             
                                <div>
                                    <div className="container">
                                            <div className="row">
                                            <div className="col-sm">
                                            <h4>Estatus:</h4>
                                              <Select className="w-50" selected={selectedOptions}   onChange={handleChange}  options={options} />
                                                
                                            </div>
                                            <div className="col-sm">
                                            <h4>Fecha:</h4>
                                            <DatePicker className="form-control"
                                                selected={startDate} 
                                                //onChange={(date: Date | null) => setStartDate(date) } 
                                                onChange={handleChangedtp}
                                                placeholderText="Select a date"
                                            />
                                            </div>
                                            <div className="col-sm">
                                               
                                            </div>
                                            </div>
                                    </div>
                                   
                                    
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar Analista" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
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
                                        keyField={"SolicitudMesaCreditoID"}
                                        defaultSortField={"PersonaID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {state.Form.Id ? "Editar Analista" : "Agregar Analista"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                optProductos={state.optProductos}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                            />
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
export default connect(mapStateToProps, mapDispatchToProps)(SolicitudMesaCredito)
