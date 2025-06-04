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
import { DescripcionDistribuidor, FormateoDinero } from '../../../../../../global/variables'
import moment from 'moment'
import ReactTooltip from 'react-tooltip'

type CatalogosType = {
    oidc: IOidc,
    ProductoID?: number,
    ComisionesID: number,
    SolicitudGastoID: undefined,
    optNiveles: { value: number, label: string }[]
    Datos: any
}

const VerGastosDetalle = (props: CatalogosType) => {
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
        },
        // ProductoID: props.ProductoID,
        // ComisionesID: props.ComisionesID,
        optNiveles: props.optNiveles,
        isUpdate: false
    })

    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))

        let Datos = {
            SolicitudGastoID: props.SolicitudGastoID
        }

        Funciones.FNGetGastos3(props.oidc, Datos)
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

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'ID Detalle', width: '15%', selector: 'SolicitudDetalleID', sortable: false, center: true },
                { name: 'Descripcion', width: '35%', selector: 'Descripcion', sortable: false, center: true },
                {
                    name: 'Total', width: '25%', selector: 'Total', sortable: false, center: true,
                    cell: (props) => <span className="LabelInDTable">{FormateoDinero.format(props.Total)}</span>
                },
                { name: 'ID Gasto', width: '20%', selector: 'SolicitudGastoID', sortable: false, center: true },

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
                <Card Title="Detallos Gastos">
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

export default connect(mapStateToProps, mapDispatchToProps)(VerGastosDetalle)