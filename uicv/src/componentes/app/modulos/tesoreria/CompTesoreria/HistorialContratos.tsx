 
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


 
 type SucursalesType = {
     Seguridad: IOidc
 };


const HistorialContratosSucursales = (props: SucursalesType) => {
    const Datos:any[] = [];
    const DatosMostrar:any[] = []
    const [state, setState ] = useState({
        isLoading          :   true,
        error              :   false,
        habilitar          :   true,
        Datos,
        DatosMostrar,
        Filtro:'',
        Form:
               {   Mostrar : false,
                   Id      : undefined,
               },
})

    useEffect(() => {
        console.log('Funciiono')
        GetInfoRentaHist()
    },[props.Seguridad])

    const GetInfoRentaHist = () => {
        setState(s => ({...s, isLoading:true}));
        Funciones.FNObtenerContratoRentaSucursalHist(props.Seguridad)
            .then( (respuesta:any) => {
                setState(s => ({...s, isLoading:false, error:false, Datos: respuesta}))
                console.log(respuesta)
                            })
            .catch(() => {
                setState(s => ({...s, isLoading:false, error:true, Datos:[]}))
                console.log('No entro')
            })
    };
    

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {name:'Id Contrato', selector:'ContId', sortable:true},
                {name:'Sucursal', selector:'SucId2', sortable:true},
                {name:'Nombre de Sucursal', selector:'NombSuc2', center:true, maxWidth:'100%', sortable:true, cell:(props) => <span >{props.NombSuc2 }</span>},
                {name:'Monto', selector:'Costo', sortable:true},
                {name:'Fecha de inicio', selector: 'FechaIni', sortable:true, cell: (props) => <span>{moment(props.FechaInicio).format('DD/MM/YYYY')}</span>},
                {name:'Fecha de termino', selector:'FechaFin', sortable:true, cell: (props) => <span>{moment(props.FechaFin).format('DD/MM/YYYY')}</span>},
                {
                    name: 'Estatus',
                    selector: 'Estatus',
                    sortable: true,
                    cell: (props) => <span title="Texto flotante">{props.Estatus ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
                },
                {name:'Descripcion', selector:'descripcion', center:true, maxWidth:'100%', sortable:true,  cell:(props) => <span >{props.descripcion}</span>},
                
            ];
            return colRet
    }, 
    []); 

    useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro]);

    return(
        <div className='row'>
        <div className='col-12'>
            <Card Title="Historial de sucursales">
                <Card.Body>
                    <Card.Body.Content>
                    <DataTable
                                    subHeader
                                     subHeaderComponent=
                                     {
                                          <div className="row">
                                          <div className="col-sm-12">
                                                      <div className="input-group mb-3">
                                                      <input type="text" className="form-control" placeholder="Buscar Corresponsal"   />
                                                      <span className="input-group-text"><FaSearch /> </span>
                                                       <button className="btn btn-outline-secondary" type="button" onClick={() => {GetInfoRentaHist()}}><FiRefreshCcw /></button>
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
                                    keyField={"TipoComisionID"}
                                    defaultSortField={"TipoComisionID"}
                                    columns={Columns}
                                />
        
                               
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

export default connect(mapStateToProps, mapDispatchToProps)(HistorialContratosSucursales)