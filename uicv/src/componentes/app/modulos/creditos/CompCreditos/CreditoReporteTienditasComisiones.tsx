import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { Card } from "../../../../global";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import { iUI } from "../../../../../interfaces/ui/iUI";
import FormReporteComisionesTiendita from "./CreditoReporteTienditasComisiones/FormReporteTienditasComisiones";

type CreditoCierreValesDistVencimientoType = {
  oidc: IOidc;
  ui: iUI;
};

function CreditoCierreValesDistVencimiento2(
  props: CreditoCierreValesDistVencimientoType
) {
  return (
    <div>
      <div className="row">
        <div className="col-12">
          <Card Title="Reporte Tienditas Comisiones">
            <Card.Body>
              <Card.Body.Content>
                <FormReporteComisionesTiendita
                  oidc={props.oidc}
                  ui={props.ui}
                />
              </Card.Body.Content>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state: IEstado) => ({
  oidc: state.oidc,
  ui: state.UI,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreditoCierreValesDistVencimiento2);
