import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './Funciones'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { FiltrarDatos } from '../../../../../../global/functions'

// Custom components
import { Card, Spinner } from '../../../../../global'
import { FiRefreshCcw} from 'react-icons/fi'
// Icons
import { FaSearch,FaEye } from 'react-icons/fa'
// Link
import { Link, useParams } from 'react-router-dom'
import { Form } from 'formik'



type CatalogosType = {
    oidc: IOidc
    Id?: number,
     ProductoID: number,
}

export const CFormValidaAsignacion = (props: CatalogosType) =>{
    let id_int: number = parseInt(props.ProductoID as unknown as string)

    let isMounted = React.useRef(true)

    const DatosDefecto =  {DistribuidorID: 0, DistribuidorDesc : '',SucursalDesc : '',DiasAtraso : 0 ,ProductoID : 0,Grupo :'',Capital : 0 ,SaldoActual : 0, MesaCobranzaID: 0, idRelMesaCredProd:0}
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

    //obtener datos funcion 
    const FnValidaAsignacion =() =>{
        setState(s => ({...s, Cargando: true}))
        Funciones.FnValidaAsignacion(props.oidc, props.ProductoID)
        .then((respuesta: any) => {
            if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
            }
            console.log(`respuesta`)
            console.log(respuesta)
            console.log(state.Form.Datos.DiasAtraso)
        })
        .catch(() => {
            if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
            }
        })
    }

    
    //crear la estructura de la tabla
    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] = 
        [
            {
                name: 'Id',
                selector: 'DistribuidorID',
                sortable: true,
                width: '7%',
                center: true,
            },
            {
                name: 'Socia',
                selector: 'DistribuidorDesc',
                sortable: true,
                width: '21%',
                center: true,
            },
            {
                name: 'Sucursal',
                selector: 'SucursalDesc',
                sortable: true,
                width: '14%',
                center: true,
            },
            {
                name: 'DiasAtraso',
                selector: 'DiasAtraso',
                sortable: true,
                width: '10%',
                center: true,
            },
            // {
            //     name: 'ProductoID',
            //     selector: 'ProductoID',
            //     sortable: true,
            //     width: '10%',
            //     center: true,
            // },
            {
                name: 'Grupo',
                selector: 'Grupo',
                sortable: true,
                width: '10%',
                center: true,
            },
            {
                name: 'Capital',
                selector: 'Capital',
                sortable: true,
                width: '15%',
                center: true,
            },
            {
                name: 'SaldoActual',
                selector: 'SaldoActual',
                sortable: true,
                width: '15%',
                center: true,
            },
            {
                name: 'Acciones',
                sortable: false,
                center: true,
                width: '7%',
                cell: (props) =>
                    <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                        <React.Fragment>
                            {/* <Link className={`has-text-dark ml-1`} to={`/app/${id_int}/cobranza/Distribuidores/${props.idRelMesaCredProd}`} ><FaEye size={16} /></Link> */}
                            <Link className={`has-text-dark ml-1`} to={`/app/${id_int}/cobranza/Distribuidores/${props.idRelMesaCredProd}`} ><FaEye size={16} /></Link>
                        </React.Fragment>
                    </div>
            },
        ]
        return colRet
    }, [state.Form])   
    
    //use efect inicial
    React.useEffect(() => {
        FnValidaAsignacion()
        // FnRelMesaCredProd()
        return () => {
            isMounted.current = true
        }
        }, [])

        //use efect filtrado
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
    }, [state.Datos, state.Filtro])

return (
    <div className="row"> 
        <div className="col-12">
            <Card>
                <Card.Body>
                    <Card.Body.Content>
                        {state.Cargando && <Spinner />}
                        {state.Error && <span>Error al cargar los datos...</span>}
                        {!state.Cargando && !state.Error && 
                             <div>
                             <DataTable
                                 subHeader
                                 subHeaderComponent= 
                                 {
                                    <div className="row">
                                    <div className="col-sm-12">
                                        <div className="input-group mb-3">
                                            <input type="text" className="form-control" placeholder="Buscar" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                            <span className="input-group-text"><FaSearch /> </span>
                                            <button className="btn btn-outline-secondary" type="button" onClick={() => FnValidaAsignacion()}><FiRefreshCcw /></button>
                                        </div>
                                    </div>
                                </div>
                                 }
                                 data={state.DatosMostrar}
                                 striped
                                //  pagination
                                //  paginationRowsPerPageOptions={[50]}
                                 dense
                                 noHeader
                                 responsive
                                 columns={Columns}
                             />
                         </div>
                        }
                    </Card.Body.Content>
                </Card.Body>
            </Card>
        </div>
    </div>
)
}
const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(CFormValidaAsignacion);

