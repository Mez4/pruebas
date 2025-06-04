import React, { useEffect, useState } from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import * as Funciones from './CreditoDetallesRelacion/Funciones'
// Icons
import { FaEye, FaExclamationCircle, FaFileSignature, FaFilter, FaPen, FaPencilAlt, FaPlus, FaFacebookMessenger, FaCheck, FaCheckCircle, FaMobile, FaAd, FaCheckDouble, FaBan, FaDollarSign, FaSearch, FaRegChartBar, FaBarcode, FaBars, FaChartBar, FaLevelDownAlt, FaLevelUpAlt } from 'react-icons/fa'
// Custom components
import { ActionSelect, Card, DatePickeEnd, DatePickeStart, Spinner, ImgViewer, CustomSelect, CustomSelect2 } from '../../../../global'
import moment from 'moment'
import { iUI } from '../../../../../interfaces/ui/iUI'
import { BuscarDetallesRelacion } from './CreditoDetallesRelacion/BuscarDetallesRelacion'


type CatalogosType = {
    oidc: IOidc,
    ui: iUI
}

const CreditoDetallesRelacion = (props: CatalogosType) => {    // Controll our mounted state
    let isMounted = React.useRef(true)
    const [loading, setLoading] = React.useState(false)
    const Datos: any[] = []
    const Datos2: any[] = []
    const Datos3: any[] = []
    const DatosMostrar: any[] = []
    const OptionsUsuario: any[] = []
    const optDia: any[] = []
    const [state, setState] = React.useState({
        DistribuidorID: 0,
        Datos,
        Datos2,
        Datos3,
        DatosMostrar,
        TipoEstatus: [],
        DatosInc: [],
        Filtro: '',
        Cargando: false,
        Error: false,
        Form: {
            src: '',
            Ruta: '',
            DistribuidorID: 0,
            Mostrar: false,
            Id: undefined,
        },
        OptionsUsuario,
        optDia,
    })

    const cbRespuesta = (Datos: any) => {
        console.log("cbRespuesta", Datos)
        setState(s => ({ ...s, Datos: Datos }))

    }

    function formatearFecha(fecha) {
        return moment(fecha).format("DD/MM/YYYY")
    }

    const Columns: IDataTableColumn[] =
        [
            {
                center: true,
                name: 'Id',
                selector: 'DistribuidorID',
                sortable: false
            },
            {
                name: 'Nombre Socia',
                selector: 'PersonaNombre',
                center: true,
                sortable: false,
                minWidth: "300px",
            },
            {
                name: 'Fecha Corte',
                selector: 'fechaCorte',
                sortable: false,
                center: true,
                minWidth: "110px",
                cell: (props) => <span className="text-center">{props.fechaCorte ? formatearFecha(props.fechaCorte) : ''}</span>
            },
            {
                name: 'Id Cliente',
                selector: 'ClienteID',
                center: true,
                sortable: false
            },
            {
                name: 'Mov Cliente',
                selector: 'movCli',
                center: true,
                sortable: false,
            },
            {
                center: true,
                name: 'Nº Corrida',
                selector: 'CreditoID',
                sortable: false,
            },
            {
                center: true,
                name: 'Plazo',
                selector: 'NoPago',
                sortable: false,
            },
            {
                name: 'Saldo Plazo',
                selector: 'saldoCredito',
                sortable: false,
                center: true,
            },
            {
                name: 'Capital',
                selector: 'CapitalPlazo',
                sortable: false,
                center: true,
            },
            {
                name: 'Interés',
                selector: 'InteresPlazo',
                center: true,
                sortable: false,
            },
            {
                name: 'Seguro',
                selector: 'SeguroPlazo',
                sortable: false,
                center: true,
            },
            {
                name: 'Iva',
                selector: 'IvaPlazo',
                sortable: false,
                center: true,
            },

            {
                name: 'Manejo Cuenta',
                selector: 'ManejoCuentaPlazo',
                sortable: false,
                center: true,
            },
            {
                name: 'Prestamo Personal',
                selector: 'PrestamoPersonal',
                sortable: false,
                center: true,
                cell: props => <span className='text-center'>{props.PrestamoPersonal == 0 ? "NO" : "SI"}
                </span>
            },
            {
                name: 'Importe Base Comision',
                selector: 'SaldoComisionPlazo',
                sortable: false,
                center: true,
            },
            {
                name: 'Liquidación Anticipada',
                selector: 'SegundosAnticipado',
                sortable: false,
                center: true,
                cell: props => <span className='text-center'>{(props.SegundosAnticipado > 0) ? "SI" : "NO"}
                </span>
            },
            {
                name: 'Monto Anticipado',
                selector: 'PagosAntes',
                sortable: false,
                center: true,
            },
            {
                name: 'Producto Total Plazo',
                selector: 'ProductoTotalPlazo',
                sortable: false,
                center: true,
            },
            {
                name: 'Saldo Plazo',
                selector: 'saldoPlazo',
                sortable: false,
                center: true,
            },
            {
                name: 'Saldo Último Corte',
                selector: 'SaldoUltimoCorte',
                center: true,
                sortable: false,
            },
            {
                name: 'Importe Abono Relación',
                selector: 'AbonosPlazo',
                center: true,
                sortable: false,
            },
            {
                name: 'Importe Bonificación',
                selector: 'ImporteBonificacion',
                center: true,
                sortable: false,
            },
        ]

    useEffect(() => {
        return () => {
            isMounted.current = false;
        }
    }, [props.oidc])

    React.useEffect(() => {
        return () => {
            isMounted.current = false
        }
    }, [])

    return (
        <React.Fragment>
            <div className="row ">
                <div className="col-12">
                    <Card Title="DETALLES DE RELACIÓN">
                        <Card.Body>
                            <Card.Body.Content>
                                {state.Cargando && <Spinner />}
                                {state.Error && <span>Error al cargar los datos...</span>}
                                {!state.Cargando && !state.Error &&
                                    <div>
                                        <BuscarDetallesRelacion
                                            oidc={props.oidc}
                                            ui={props.ui}
                                            initialValues={
                                                {
                                                    DistribuidorID: 0,
                                                    DiaID: 0,
                                                    MesID: 0,
                                                    AID: 0
                                                }
                                            }
                                            cbRespuesta={cbRespuesta}
                                        />
                                        <DataTable
                                            subHeader
                                            data={state.Datos}
                                            striped
                                            pagination
                                            dense
                                            noHeader
                                            responsive
                                            paginationPerPage={10}
                                            keyField={"DistribuidorID"}
                                            defaultSortField={"DistribuidorID"}
                                            columns={Columns}
                                        />

                                    </div>
                                }
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
            </div >
        </React.Fragment >
    )
}







const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI,
})
const mapDispatchToProps = {
}
export default connect(mapStateToProps, mapDispatchToProps)(CreditoDetallesRelacion);