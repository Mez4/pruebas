 
 import React, { useState, useEffect, useRef } from 'react'
 import { connect } from 'react-redux'
 import { IEstado } from '../../../../../interfaces/redux/IEstado'
 import DataTable, { IDataTableColumn } from 'react-data-table-component'
 import * as Funciones from './TesoreriaRentalocales/Funciones'
 import { toast } from 'react-toastify'
 import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
 import { FaPencilAlt, FaPlus, FaSearch, FaCircle, FaEye } from 'react-icons/fa'
 import { Card, Spinner } from '../../../../global'
 import { FiRefreshCcw } from 'react-icons/fi'
 import { FiltrarDatos } from '../../../../../global/functions'
 import { IOidc } from '../../../../../interfaces/oidc/IOidc'
 import { error } from 'console'
import { colors } from 'react-select/src/theme'
import { CFormSuc } from './TesoreriaRentalocales/CForm'
import { Link, useParams } from 'react-router-dom'
import { Form } from 'usetheform'
import moment from 'moment'
import PDFViewer from '../../../../global/PDFViewer'
import ReactTooltip from 'react-tooltip'
import VerDocRentaLocal from '../CompTesoreria/TesoreriaRentalocales/VerDoc'

 
 type SucursalesType = {
     Seguridad: IOidc
 };

 const SucursalesDetalle = (props: SucursalesType) => {
/*****************************Variables********************************************* */

    let isMounted = useRef(true)
    const Datos:any[] = [];
    const DatosSuc:any[] = []
    const DatosMostrar:any[] = []
    const DatosDefecto  = {
        
        SucursalId          :       0,
        ContratoId          :       0,
        NombreSucursal      :       '',
        Monto               :       0,
        FechaInicio         :       0,
        FechaFin            :       0,
        DiasRest            :       0,
        DetSuc              :       '',
        SubirDoc            :       false,
        documentoLabel      :       0,
        Carga               :       true,
        
        // DatosSuc                    :       [],
                 
    };
    /*****************************Definimos los useState**************************** */
    //const [Carga, setCarga] = useState(false)
    const [MostrarModEdit, setMostrarModEdit] = useState(true)
    const optSucursales: any[] = []
    const [state, setState] = useState({
                                         isLoading          :   true,
                                         error              :   false,
                                         habilitar          :   true,
                                         optSucursales,
                                         Datos,
                                         DatosSuc           :   DatosSuc,
                                         DatosMostrar,
                                         Filtro:'',
                                         Form:
                                                {   Mostrar : false,
                                                    Datos   : DatosDefecto,
                                                    Id      : undefined,
                                                    VerDoc  : false,
                                                    id      : undefined     ||      0 
                                                },
    });

    const cbActualizar = (item : any) => {
        toast.success('La sucursal se actualizó correctamente');
        setState({
            ...state, Datos: state.Datos.map(Dato => Dato.CorresponsalID === item.CorresponsalID ? item : Dato),
            Form: {
                ...state.Form, 
                Mostrar: false, 
                Datos: DatosDefecto
            }
            
        })
        GetInfoDetalleRenta();
       
    }

    const cbGuardar = (item:any) => {
        toast.success('La sucursal se agrego correctamente');
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } });
    }

    const AdvertenciaTermino = (item:any) => {
        // console.log(item)

        var DiasRest = item.map((valor: any) => {
            var obj = { value: valor.DiasRest, label: `${valor.NombreSucursal}` };
            return obj
        });
        // console.log(DiasRest)
        for(let i = 0; i<DiasRest.length;i++){
            if(DiasRest[i].value< 10 && DiasRest[i].value>0){
                toast.warning(`Se aproxima la fecha de termino para la sucursal ${DiasRest[i].label}`);
            }
            else if(DiasRest[i].value < 1){
                toast.error(`Se cancelo el contrato de la sucursal ${DiasRest[i].label}`);

            }
        }
        // setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto } });
    }

    const [Diasrest, setDiasRest] = useState(0);
    /*************************Funcion peticion************************************** */
    
    const FnGetSucursales = () => {
        setState(s => ({...s, isLoading:true}));
        Funciones.FNGet(props.Seguridad)
            .then( (respuesta:any) => {
                 

                var cuentas = respuesta.map((valor: any) => {
                    var obj = { value: valor.SucId2, label: `${valor.NombSuc2}` };
                    return obj
                });
                setState(s => ({...s, isLoading:false, error:false, DatosSuc:cuentas}))

                // setDatosSuc([respuesta])
                // console.log(cuentas)
                // console.log(respuesta)
            })
            .catch(() => {
                setState(s => ({...s, isLoading:false, error:true, DatosSuc:[]}))
                // console.log('No entro 3')
            })
    };
    
    
    const GetInfoDetalleRenta = () => {
        setState(s => ({...s, isLoading:true}));
        Funciones.FNObtenerDetalleRentaSucursal(props.Seguridad)
            .then( (respuesta:any) => {
                setState(s => ({...s, isLoading:false, error:false, Datos: respuesta}))
                
                
                AdvertenciaTermino(respuesta)
                
                console.log(respuesta)
            })
            .catch(() => {
                setState(s => ({...s, isLoading:false, error:true, Datos:[]}))
                // console.log('No entro')
            })
    };

    const fnCancelar = () => setState({...state, Form:{...state.Form,Mostrar:false, VerDoc:false}})

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {name:'Id Contrato', selector:'ContratoId', sortable:true},
                {name:'Sucursal', selector:'SucursalId', sortable:true},
                {name:'Nombre de Sucursal', selector:'NombreSucursal', width: '20%', center:true, sortable:true, cell:(props) => <span style={{width:"max-content"}}>{props.NombreSucursal}</span>},
                {name:'Monto', selector:'Monto', sortable:true},
                {name:'Fecha de inicio', selector: 'FechaInicio',width:'10%', sortable:true, cell: (props) => <span>{moment(props.FechaInicio).format('DD/MM/YYYY')}</span>},
                {name:'Fecha de termino', selector:'FechaFin',width:'10%', sortable:true, cell: (props) => <span>{moment(props.FechaFin).format('DD/MM/YYYY')}</span>},
                {name:'Dias restantes', 
                 selector:'DiasRest', 
                 sortable:true,
                 cell: (props) => <strong>{

                    (+(props.DiasRest)<10 && +(props.DiasRest>0))? 
                    <strong style={{color: "orange", fontSize:"1rem"}}>{props.DiasRest}</strong>
                    : <strong style={{fontSize:"1rem"}}>{+(props.DiasRest)<1 ? 
                        <strong style={{color: "red",width:'50%', fontSize:".9rem"}}>Contrato expirado</strong> 
                        : <strong style={{color: "green", fontSize:"1rem"}}>{props.DiasRest}</strong>}
                        </strong>}
                    </strong>
                },
                {
                    name: 'Estatus',    
                    selector: 'Estatus',
                    sortable: true,
                    cell: (props) => <span title="Texto flotante">{props.Estatus ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
                },
                {name:'Descripcion', selector:'DetSuc', center:true, width:'20%', sortable:true,  cell:(props) => <span style={{width:"max-content"}}>{props.DetSuc}</span>},
                {
                    name: 'Editar', sortable: false,
                    cell: (props) =>
                        <><button className="asstext" type={"button"} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...s.Form,
                                    Mostrar: true,
                                    DatosSuc                :               DatosSuc,
                                    Datos: {
                                        SucursalId          :               props.SucursalId,
                                        ContratoId          :               props.ContratoId,
                                        NombreSucursal      :               props.NombreSucursal,
                                        Colonia             :               props.Colonia,
                                        Calle               :               props.Calle,
                                        Monto               :               props.Monto,
                                        FechaInicio         :               Date.parse(props.FechaInicio),
                                        FechaFin            :               Date.parse(props.FechaFin),
                                        DiasRest            :               props.Diasrest,
                                        DetSuc              :               props.DetSuc,
                                        SubirDoc            :               props.SubirDoc,
                                        documentoLabel      :               props.documentoLabel,
                                        Carga               :               true,
                                        // DatosSuc                :               props.DatosSuc,  
                                        
                                    },
                                    SucursalId              :               props.SucursalId
                                    
                                }
                            })
                            )
                        } }>
                            <FaPencilAlt />
                        </button>

                        {/* <Link  className={`has-text-dark ml-1`} to={''} ><FaEye size={16} /></Link> */}
                       <><button data-tip data-for={`btnCV_${props.ContratoId}`} className="asstext" type={"button"} style={{ margin: '1rem'}} onClick={() => {
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...state.Form, Mostrar: false, VerDoc: true,
                                    Datos: {
                                        SucursalId          :               props.SucursalId,
                                        ContratoId          :               props.ContratoId,
                                        NombreSucursal      :               props.NombreSucursal,
                                        Monto               :               props.Monto,
                                        FechaInicio         :               Date.parse(props.FechaInicio),
                                        FechaFin            :               Date.parse(props.FechaFin),
                                        DiasRest            :               props.Diasrest,
                                        DetSuc              :               props.DetSuc,
                                        SubirDoc            :               props.SubirDoc,
                                        documentoLabel      :               props.documentoLabel,
                                        Carga               :               true,
                                        
                                        // DatosSuc                :               props.DatosSuc,  
                                        
                                    },
                                    id: 0
                                }
                            }))
                        }}>
                            <FaEye size={'1rem'}/>
                        </button>
                        <ReactTooltip id={'SucursalId'} type="info"effect="solid">
                            VER DOCUMENTO {props.NombreSucursal}
                        </ReactTooltip></>
                       
                        </>
 
                },
            
                
            ];
            return colRet
    }, 
    []); 

    /**********************Definimos los useEffect********************************** */
    useEffect(() => {
        FnGetSucursales()
    }, [props.Seguridad])


    useEffect(() => {
        GetInfoDetalleRenta();
       
        return () => {
            isMounted.current = true
        }
    }, [props.Seguridad]);

    useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro]);
    
    return(
        
        <div className='row'>
            <div className='col-12'>
                <Card Title="Descripcion de sucursales">
                    <Card.Body>
                        <Card.Body.Content>
                        <DataTable
                                        subHeader
                                         subHeaderComponent=
                                         {
                                              <div className="row">
                                              <div className="col-sm-12">
                                                          <div className="input-group mb-3">
                                                          <input type="text" className="form-control" placeholder="Buscar Corresponsal"  onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                          <span className="input-group-text"><FaSearch /> </span>
                                                          <button className="btn btn-outline-secondary" type="button"
                                                              onClick={() =>setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined, VerDoc:false, id:0 }  })}
                                                           ><FaPlus /></button>
                                                           <button className="btn btn-outline-secondary" type="button" onClick={() => {GetInfoDetalleRenta(),  FnGetSucursales()}}><FiRefreshCcw /></button>
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
                                        keyField={"ContratoId"}
                                        defaultSortField={"ContratoId"}
                                        columns={Columns}
                                    />
                                        
                                        {state.Form.VerDoc &&<ModalWin open={state.Form.VerDoc} center large>
                                            <ModalWin.Header>
                                                <h5 className={MODAL_TITLE_CLASS}>{state.Form.Datos.NombreSucursal}</h5>
                                                <button type="button" className="delete" onClick={() => {
                                                    fnCancelar()
                                                }} />
                                            </ModalWin.Header>
                                            <ModalWin.Body>
                                                <VerDocRentaLocal ContratoID={state.Form.Datos.ContratoId} fnCancelar={fnCancelar}/>                                            
                                            </ModalWin.Body>
                                            </ModalWin>
                                        }


                                      <ModalWin xlarge={false} scrollable={true} open={state.Form.Mostrar} center={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                Editar informacion de Sucursal 
                                            </h5>
                                        </ModalWin.Header> 
                                         <ModalWin.Body>
                                            <CFormSuc 
                                        Seguridad={props.Seguridad}
                                        InitialValues={state.Form.Datos}
                                        cbActualizar={cbActualizar}
                                        cbGuardar={cbGuardar}
                                        fnCancelar={fnCancelar}
                                        ID={state.Form.Datos.SucursalId} 
                                        DatosSuc={state.DatosSuc}
                                            />
                                        </ModalWin.Body> 
                                     </ModalWin> 
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>
        </div>

    )
}
const mapStateToProps = (state: IEstado) => ({
    Seguridad: state.oidc
})

const mapDispatchToProps = {

}


export default connect(mapStateToProps, mapDispatchToProps)(SucursalesDetalle)