import React, { useState } from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './ConciliaDispersionH2H/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaBan, FaCashRegister, FaListAlt, FaMoneyBill, FaMoneyBillAlt, FaMoneyCheck, FaDollarSign, FaCreditCard } from 'react-icons/fa'

// Custom components
import { Card, DatePickeEnd, DatePickeStart, Spinner } from '../../../../global'
import { BuscarCreditos } from './CreditosDispersionH2H/BuscarCreditos'
// import { CForm } from './CreditoCredito/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { DBConfia_Creditos } from '../../../../../interfaces_db/DBConfia/Creditos';
import DatePicker, { registerLocale } from "react-datepicker"
import * as Yup from 'yup'
import ReactTooltip from 'react-tooltip';
import moment from 'moment'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { DBConfia_STP } from '../../../../../interfaces_db/DBConfia/STP'
import { Form, Formik } from 'formik'
import { FormateoDinero } from '../../../../../global/variables'
import { DispersarTarjeta } from './CreditosDispersionH2H/DispersarTarjeta'

type CatalogosType = {
    oidc: IOidc
}

type EstadoTipo = {
    Datos: DBConfia_STP.IDispersiones_VW[],
    DatosMostrar: DBConfia_STP.IDispersiones_VW[],
    DispersionesSeleccionadas: [],
    CantidadDispersionesSeleccionadas: number,
    Filtro: string,
    Cargando: boolean,
    Error: boolean,
    Detalle: boolean,
    Form:
    {
        Mostrar: boolean,
    },
}

const ConciliaDispersionH2H = (props: CatalogosType) => {
    let isMounted = React.useRef(true)

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

    const [state, setState] = React.useState<EstadoTipo>({
        Datos: [],
        DatosMostrar: [],
        DispersionesSeleccionadas: [],
        CantidadDispersionesSeleccionadas: 0,
        Filtro: '',
        Form:
        {
            Mostrar: false,
        },
        Cargando: false,
        Error: false,
        Detalle: false
    })

    const Columns: IDataTableColumn[] =
        [
            {
                name: 'Conciliado',
                selector: 'conciliado',
                wrap: true,
                sortable: false,
                center: true,
                cell: (props) => <span className='text-center'>{props.conciliado ? "Conciliado" : "No conciliado"}</span>,
                conditionalCellStyles: [
                    {
                        when: row => row.conciliado,
                        style: {
                            backgroundColor: '#68bb59',
                            color: 'white',
                        }
                    },
                    {
                        when: row => !row.conciliado,
                        style: {
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                        }
                    }

                ]
            },
            {
                name: 'Clave STP',
                selector: 'idEF',
                wrap: true,
                sortable: false,
                center: true,
                conditionalCellStyles: [
                    {
                        when: row => row.conciliado,
                        style: {
                            backgroundColor: '#68bb59',
                            color: 'white',
                        }
                    },
                    {
                        when: row => !row.conciliado,
                        style: {
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                        }
                    }

                ]
            },
            {
                name: 'Clave Rastreo',
                center: true,
                selector: 'claveRastreo',
                wrap: true,
                sortable: false,
                cell: (propss) => <span className='text-center'>{propss.claveRastreo}</span>,
                conditionalCellStyles: [
                    {
                        when: row => row.conciliado,
                        style: {
                            backgroundColor: '#68bb59',
                            color: 'white',
                        }
                    },
                    {
                        when: row => !row.conciliado,
                        style: {
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                        }
                    }

                ]
            },
            {
                name: 'Nombre Cliente',
                center: true,
                width: '10%',
                selector: 'nombreBeneficiario',
                sortable: false,
                cell: (props) =>
                    <>
                        <span className='text-center' data-tip data-for={`NombreCompletoTooltip${props.CreditoID}`}>{props.nombreBeneficiario}</span>
                        <ReactTooltip id={`NombreCompletoTooltip${props.CreditoID}`}
                            type="dark"
                            effect="solid"
                            clickable
                            globalEventOff="click"
                        >
                            {props.nombreBeneficiario}
                        </ReactTooltip>
                    </>,
                conditionalCellStyles: [
                    {
                        when: row => row.conciliado,
                        style: {
                            backgroundColor: '#68bb59',
                            color: 'white',
                        }
                    },
                    {
                        when: row => !row.conciliado,
                        style: {
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                        }
                    }

                ]
            },
            {
                center: true,
                name: 'Total',
                selector: 'monto',
                sortable: false,
                format: row => FormateoDinero.format(row.monto),
                conditionalCellStyles: [
                    {
                        when: row => row.conciliado,
                        style: {
                            backgroundColor: '#68bb59',
                            color: 'white',
                        }
                    },
                    {
                        when: row => !row.conciliado,
                        style: {
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                        }
                    }

                ]
            },
            {
                center: true, name: 'Cuenta Beneficiario', selector: 'CuentaBeneficiario', sortable: false, cell: (props) => <span className='text-center'>{props.cuentaBeneficiario}</span>, conditionalCellStyles: [
                    {
                        when: row => row.conciliado,
                        style: {
                            backgroundColor: '#68bb59',
                            color: 'white',
                        }
                    },
                    {
                        when: row => !row.conciliado,
                        style: {
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                        }
                    }

                ]
            },
            {
                center: true, name: 'Estatus', selector: 'estado', sortable: false, cell: (props) => <span className='text-center'>{props.estado}</span>, conditionalCellStyles: [
                    {
                        when: row => row.conciliado,
                        style: {
                            backgroundColor: '#68bb59',
                            color: 'white',
                        }
                    },
                    {
                        when: row => !row.conciliado,
                        style: {
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                        }
                    }

                ]
            },
            {
                center: true, name: 'Causa Dev.',
                selector: 'causaDevolucion',
                sortable: false,
                cell: (props) => <span className='text-center'>{props.causaDevolucion != undefined ? props.causaDevolucion : "No aplica"}</span>,
                conditionalCellStyles: [
                    {
                        when: row => row.conciliado,
                        style: {
                            backgroundColor: '#68bb59',
                            color: 'white',
                        }
                    },
                    {
                        when: row => !row.conciliado,
                        style: {
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                        }
                    }

                ]
            },
            {
                center: true, name: 'Fecha Origen', selector: 'FechaRegistro', sortable: false, cell: (props) => <span className='text-center'>{props.fechaOperacion}</span>, conditionalCellStyles: [
                    {
                        when: row => row.conciliado,
                        style: {
                            backgroundColor: '#68bb59',
                            color: 'white',
                        }
                    },
                    {
                        when: row => !row.conciliado,
                        style: {
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                        }
                    }

                ]
            },

        ]

    const FNGetConciliaciones = () => {
        setLoading(true)
        Funciones.FNConciliar(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Datos: respuesta }))
                    setLoading(false)

                }
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Datos: [] }))
                    setLoading(false)
                }
            })
    }


    React.useEffect(() => {
        if (isMounted.current === true) {
            // FNGetLocal()
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

    const [loading, setLoading] = React.useState(false)
    const [startDate, setStartDate] = useState(moment().add(-30, 'd').toDate());
    const [endDate, setEndDate] = useState(moment().toDate());

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Conciliar dispersiones">
                    <Card.Body>
                        <Card.Body.Content>
                            {/*     <div className="columns is-centered is-mobile is-multiline">
                                <div className="column is-one-quarter-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                    <br />
                                    <button disabled={loading} type="button" onClick={() => FNGetConciliaciones()} className="btn btn-primary waves-effect waves-light">
                                        <span className="">Conciliar dia operativo actual &nbsp;</span>&nbsp;<FiRefreshCcw />
                                    </button>

                                </div>
                            </div>
 */}
                            <div className="columns is-centered is-mobile is-multiline">
                                {loading && <Spinner />}
                                {!loading && !state.Error && <DataTable
                                    subHeader
                                    key={"DispersionID"}
                                    paginationComponentOptions={{
                                        noRowsPerPage: false, rowsPerPageText: 'Dispersiones por página',
                                        rangeSeparatorText: 'de',
                                        selectAllRowsItem: false,
                                        selectAllRowsItemText: 'Todos',

                                    }}
                                    noDataComponent={<div style={{ padding: '10% !important' }}>No hay datos</div>}
                                    subHeaderComponent=
                                    {
                                        <div className="columns is-centered is-mobile is-multiline">
                                            <div className="column is-half-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                                <div className="input-group pb-3 mb-10">
                                                    <input type="text" className="form-control" placeholder="Buscar dispersión" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                    <span className="input-group-text"><FaSearch /> </span>
                                                </div>
                                            </div>
                                            <div className="column is-half-desktop is-full-mobile is-full-tablet is-align-items-center ">
                                                <button disabled={loading} type="button" onClick={() => FNGetConciliaciones()} className="btn btn-primary waves-effect waves-light">
                                                    <span className="">Conciliar dia actual &nbsp;</span>&nbsp;<FiRefreshCcw />
                                                </button>
                                            </div>
                                        </div>
                                    }
                                    data={state.DatosMostrar}
                                    striped
                                    pagination
                                    dense
                                    responsive
                                    keyField={"DispersionID"}
                                    defaultSortField={"DispersionID"}


                                    columns={Columns}

                                />}
                                {/*                                 {state.Cargando && <Spinner />}
 */}


                            </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(ConciliaDispersionH2H)
