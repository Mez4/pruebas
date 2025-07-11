import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { Card } from '../../../../global'
import FormCierreValesDist from './CreditosCierreValesDist/FormCierreValesDist';
import { IOidc } from '../../../../../interfaces/oidc/IOidc';
import { iUI } from '../../../../../interfaces/ui/iUI';
import moment from 'moment'

type CreditoCierreValesDistType = {
    oidc: IOidc,
    ui: iUI
}


function CreditoCierreValesDist(props: CreditoCierreValesDistType) {
    return (
        <div>
            <div className="row">
                <div className="col-12">
                    <Card Title="Cierre vales por distribuidor 1506">
                        <Card.Body>
                            <Card.Body.Content>
                                <FormCierreValesDist
                                    oidc={props.oidc}
                                    ui={props.ui}
                                    initialValues={{
                                        DirectorID: 0,
                                        ProductoID: props.ui.Producto?.ProductoID ?? 0,
                                        SucursalID: 0,
                                        ZonaID: 0,
                                        EmpresaID: 0,
                                        DistribuidorID: 0,
                                        CoordinadorID: 0,
                                        creditoPromotorId: 0,
                                        ContratoID: 0,
                                        EstatusID: 'A',
                                        DistribuidorNivelID: 0,
                                        FechaInicio: moment().add(-30, 'd').toDate(),
                                        FechaFin: new Date(),
                                        GrupoID: 0,
                                        Permiso: true,
                                        tipoDias: '1',
                                    }}
                                />
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc,
    ui: state.UI
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CreditoCierreValesDist)