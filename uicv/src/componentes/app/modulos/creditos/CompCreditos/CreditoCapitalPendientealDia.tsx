import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { Card } from "../../../../global";
import FormCapitalPendientealDia from "./CreditoCapitalPendientealDia/FormCapitalPendientealDia";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import { iUI } from "../../../../../interfaces/ui/iUI";
import moment from "moment";
import React from "react";

type CreditoCapitalPendientealDiaType = {
  oidc: IOidc;
  ui: iUI;
};

function CreditoCapitalPendientealDia(
    props: CreditoCapitalPendientealDiaType
) {
  return (
    <div>
      <div className="row">
        <div className="col-12">
          <Card Title="Reporte de Pendientes de Capital al Día">
            <Card.Body>
              <Card.Body.Content>
                <FormCapitalPendientealDia oidc={props.oidc} ui={props.ui} />
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
)(CreditoCapitalPendientealDia);
