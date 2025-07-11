import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../../global/functions'
import { DescripcionDistribuidor, FormateoDinero } from '../../../../../../global/variables';
import moment from 'moment'
import * as Funciones from './Funciones'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'

type CatalogosType = {
    CuentaBancoID: any
    oidc: IOidc,
    Datos: any
    Head: any,
}

const Movimientos = (props: CatalogosType) => {
    let isMounted = React.useRef(true)

    const MovimientosIDS: [] = props.Head.MovimientosIDS
    const DatosDefecto = {
        cuentaBancoID: 0,
        MovimientosIDS,

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
            Id: undefined,
        },
        CuentaBancoID: props.CuentaBancoID,
    })


    const FNGetMovimi = () => {
        setState(s => ({ ...s, Cargando: true }))
        console.log("ID", state.Form.Id)
        console.log("IDModalC", state.CuentaBancoID)
        let Datos = {
            CuentaBancoID: props.CuentaBancoID
        }
        Funciones.FNGetMovimientos(props.oidc, Datos)
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
    

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'N°', width: '65px', selector: 'MovimientoID', sortable: false },
                { name: 'Sucursal', width: '150px', selector: 'SucursalNombre', sortable: false, 
                    cell: row => <span className='text-center'>{row.SucursalNombre}</span>
                },
                {
                    name: 'Caja', width: '150px', selector: 'CajaNombre', sortable: false,
                    cell: row => <span className='text-center'>{row.CajaNombre}</span> 
                },
                {
                    name: 'Monto', width: '100px', selector: 'Importe', sortable: false, 
                    cell: row => <span className='text-center'>{FormateoDinero.format(row.Importe)}</span>
                },
                {
                    name: 'Tipo Movimiento', width: '160px', selector: 'TipoMovimiento', sortable: false, 
                    cell: row => <span className='text-center'>{row.TipoMovimiento}</span>
                },
                {
                    name: 'Fecha Captura', width: '115px', center: true, selector: 'FechaCaptura', sortable: false,                 
                    cell: row => <span className='text-center'>{moment(row.FechaCaptura).format("DD-MM-YYYY")}</span> 
                },
                {
                    name: 'Descripción', width: '130px', selector: 'Observaciones', sortable: false, 
                    cell: row => <span className='text-center'>{row.Observaciones}</span>
                },
                {
                    name: 'Usuario Registró', width: '160px', selector: 'NombreCompleto', sortable: false, 
                    cell: row => <span className='text-center'>{row.NombreCompleto}</span>
                },
    
                
                ]
        return colRet
    }, [])

    React.useEffect(() => {

        if (isMounted.current === true) {
            FNGetMovimi()
            /*       FNGetProtecciones() */
        }
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

   

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Últimos Movimientos">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <br />
                                    <DataTable
                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"CuentaID"}
                                        defaultSortField={"CuentaID"}
                                        columns={Columns}
                                    />
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

export default connect(mapStateToProps, mapDispatchToProps)(Movimientos)