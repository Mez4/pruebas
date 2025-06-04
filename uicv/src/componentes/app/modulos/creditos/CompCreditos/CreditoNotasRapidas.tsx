import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { Card } from '../../../../global'
import CForm from './CreditoNotasRapidas/CForm';
import { IOidc } from '../../../../../interfaces/oidc/IOidc';
import { iUI } from '../../../../../interfaces/ui/iUI';
import moment from 'moment'

type CreditoNotasRapidasType = {
    oidc: IOidc,
    ui: iUI,
}


function CreditoNotasRapidas(props: CreditoNotasRapidasType) {
    return (
        <div>
            <div className="row">
                <div className="col-12">
                    <Card Title="Notas Rápidas (221)">
                        <Card.Body>
                            <Card.Body.Content>
                                <CForm
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
                                        creditoPromotorId:0,
                                        ContratoID: 0,
                                        EstatusID: 'A',
                                        DistribuidorNivelID: 0,
                                        FechaInicio: moment().add(-1, 'y').toDate(),
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

export default connect(mapStateToProps, mapDispatchToProps)(CreditoNotasRapidas)
