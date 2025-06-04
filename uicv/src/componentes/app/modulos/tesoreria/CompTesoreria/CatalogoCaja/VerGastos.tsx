import React from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

// Icons
import { FaEye, FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../../global'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../../global/functions'
import { DescripcionDistribuidor } from '../../../../../../global/variables'
import moment from 'moment'
import ReactTooltip from 'react-tooltip'
import VerGastosDetalle from './VerGastosDetalle'

type CatalogosType = {
    oidc: IOidc,
    ProductoID?: number,
    ComisionesID: number,
    CajaID: undefined,
    optNiveles: { value: number, label: string }[]
    Datos: any
    SolicitudGastoID?: undefined
}

const VerGastos = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        DistribuidorNivelID: 0,
        Activo: false,
        DiasMin: 0,
        DiasMax: 0,
        PorcComision: 0,
        PorcComisionReal: 0,
        porcMonedero: 0,
        porcMonederoReal: 0
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
            RenglonId: undefined,
            Id: undefined,
        },
        // ProductoID: props.ProductoID,
        // ComisionesID: props.ComisionesID,
        optNiveles: props.optNiveles,
        isUpdate: false
    })

    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))

        let Datos = {
            CajaID: props.CajaID
        }

        Funciones.FNGetGastos2(props.oidc, Datos)
            .then((respuesta: any) => {
                console.log('respuesta: ', respuesta)
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: false, DatosMostrar: respuesta }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: true, DatosMostrar: [] }))
                // }
            })
    }
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'ID', width: '8%', selector: 'SolicitudGastoID', sortable: false, center: true },
                { name: 'Caja', width: '20%', selector: 'NombreCaja', sortable: false, center: true },
                { name: 'Desc. Gasto', width: '25%', selector: 'Observaciones', sortable: false, center: true },
                {
                    name: 'Fecha Solicitud', width: '20%', selector: 'FechaSolicitud', sortable: false, center: true,
                    cell: row => <span className='text-center'>{row.FechaSolicitud == undefined ? "--" : moment(row.FechaSolicitud).format("DD-MM-YYYY")}</span>
                },
                { name: 'Solicito', width: '18%', selector: 'Solicitante', sortable: false, center: true },
                {
                    name: 'Acciones', width: '10%', sortable: false,
                    center: false,
                    style: { display: 'block;' },

                    cell: (props) =>
                        <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>

                            <button data-tip="true" data-for={`ArqueosEditar${props.SolicitudGastoID}`} style={{ margin: '.15em', width: '15%', height: '40px', padding: '0px', tableLayout: 'fixed', borderCollapse: 'collapse' }} className="btn btn-outline-default" type={"button"} onClick={() => {
                                console.log("CajaID ", props.SolicitudGastoID)
                                setState(s => ({
                                    ...s,
                                    Form: {
                                        ...s.Form, Mostrar: true,
                                        Id: props.SolicitudGastoID
                                    },

                                }))
                                console.log("SOLICITUD DETALLE ID", props.SolicitudGastoID)
                            }


                            }>
                                <FaEye />

                                <ReactTooltip id={`ArqueosEditar${props.SolicitudGastoID}`} type="info" effect="solid">
                                    Ver Detalles
                                </ReactTooltip>
                            </button>,
                        </div >
                },

            ]
        return colRet
    }, [])

    React.useEffect(() => {

        if (isMounted.current === true) {
            FNGetLocal()
        }
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    /*  React.useEffect(() => {
         setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
         // eslint-disable-next-line
     }, [state.Datos, state.Filtro]) */

    /** funcion Callback al agregar un item */

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Ver Gastos">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <br />
                                    <DataTable
                                        subHeader
                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"RenglonId"}
                                        defaultSortField={"RenglonId"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar} large={true} center={true}>
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                            </h5>
                                            <button title='Cerrar' type="button" className="delete" onClick={() => setState(s => ({ ...s, Form: { ...s.Form, Mostrar: false } }))} />
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {state.Form.Mostrar &&
                                                <VerGastosDetalle
                                                    SolicitudGastoID={state.Form.Id}
                                                    ComisionesID={0}
                                                    optNiveles={state.Datos}
                                                    Datos={0}
                                                />
                                            }
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

export default connect(mapStateToProps, mapDispatchToProps)(VerGastos)