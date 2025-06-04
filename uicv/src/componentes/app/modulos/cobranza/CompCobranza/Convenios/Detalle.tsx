import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

import * as Funciones from './Funciones'

import moment from 'moment'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle, FaCheckCircle, FaClock, FaBan, FaEye, FaTimesCircle, FaComment, FaListAlt, FaCheckDouble } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'
import ReactTooltip from 'react-tooltip'
import { FormateoDinero, FormateoPorcentaje, FormateoNumero2D } from '../../../../../../global/variables'

import { FiltrarDatos, truncateDecimals, formatDate } from '../../../../../../global/functions'
import { toast } from 'react-toastify'

type DetalleType = {
    oidc: IOidc,
    // fnCancelar(): any,
    DistribuidorDesc: string,
    Params: {
        ConvenioID: number,
        DistribuidorID: number,
        ProductoID: number,
        SucursalID: number,
        PorcPagInt: number,
        PorcBon: number,
        Plazos: number,
        // SaldoActual: number,
        // saldoAtrasado: number,
        // DiasAtraso: number
    }
}

export const ConvenioDetalle = (props: DetalleType) => {
    let isMounted = React.useRef(true)

    const Datos: any[] = []
    const DatosMostrar: any[] = []

    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
    })

    const FNGetDetalle = () => {
        Funciones.getConvenioDetalle(props.oidc, props.Params)
            .then((respuesta: any) => {
                // console.log('detalle: ', respuesta.data)
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta.data }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                // }
            })
    }

    const DetailColumns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Plazo', width: '70px',
                    selector: 'NoPago', sortable: true,
                },
                {
                    name: 'Fecha Vencimiento', width: '110px',
                    selector: 'FechaVencimiento', center: true, sortable: true //, cell: (props) => <span>{formatDate(new Date(props.FechaVencimiento))}</span>
                },
                {
                    name: 'Importe', //width: '150px', 
                    selector: 'Importe', sortable: true, format: row => FormateoDinero.format(row.Importe)
                },
                {
                    name: 'Abono', //width: '150px', 
                    selector: 'Saldo_Dep', sortable: true, format: row => FormateoDinero.format(row.Saldo_Dep)
                },
                {
                    name: 'Saldo', //width: '150px', 
                    selector: 'Saldo_Plazo', sortable: true, format: row => FormateoDinero.format(row.Saldo_Plazo)
                },
                {
                    name: 'Fecha Deposito', width: '110px',
                    selector: 'FechaDeposito', center: true, sortable: true //, cell: (props) => <span>{props.FechaDeposito ? moment(props.FechaDeposito).format('DD/MM/YYYY') : ''}</span>
                },
                { name: 'Dias Atraso', width: '75px', selector: 'DiasAtraso', sortable: true, },
            ]
        return colRet
    }, [])

    React.useEffect(() => {
        FNGetDetalle()
        //FNGetRelaciones()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, DetailColumns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    return (
        <div className="row">
            <div className="col-12">
                <Card Title={`SOCIA: ${props.Params.DistribuidorID} ${props.DistribuidorDesc}`}>
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <DataTable
                                    data={state.DatosMostrar}
                                    striped
                                    // pagination
                                    dense
                                    noHeader
                                    responsive
                                    keyField={"NoPago"}
                                    defaultSortField={"NoPago"}
                                    columns={DetailColumns}
                                    noDataComponent="Convenio sin plan de pagos"
                                // expandableRows
                                // expandOnRowClicked
                                // onRowExpandToggled={(res: any) => {
                                //     HiddenData(res)
                                // }}
                                // expandableRowsComponent={<HiddenData/>}
                                />
                            }
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>
        </div >
    )

}