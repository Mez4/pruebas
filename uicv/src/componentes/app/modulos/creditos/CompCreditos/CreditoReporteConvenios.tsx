import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { Card } from "../../../../global";
import FormReporteConvenios from "./CreditoReporteConvenios/FormReporteConvenios";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import { iUI } from "../../../../../interfaces/ui/iUI";
import moment from "moment";

type CreditoDistPagosVencimientoType = {
  oidc: IOidc;
  ui: iUI;
};

function CreditoReporteConvenios(props: CreditoDistPagosVencimientoType) {
  return (
    <div>
      <div className="row">
        <div className="col-12">
          <Card Title="Reporte de convenios 1600">
            <Card.Body>
              <Card.Body.Content>
                <FormReporteConvenios oidc={props.oidc} ui={props.ui} />
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
)(CreditoReporteConvenios);
