import { connect } from "react-redux";
import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { Card } from "../../../../global";
import FormDistPagoVencimiento from "./CreditoDistPagosVencimiento/FormDistPagoVencimiento";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import { iUI } from "../../../../../interfaces/ui/iUI";
import moment from "moment";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

type CreditoDistPagosVencimientoType = {
  oidc: IOidc;
  ui: iUI;
};

const MySwal = withReactContent(Swal);

function CreditoDistPagosVencimiento(props: CreditoDistPagosVencimientoType) {
  return (
    <div>
      <div className="row">
        <div className="col-12">
          <Card Title="Distribución de pagos por vencimiento 1549">
            <Card.Body>
              <Card.Body.Content>
                <FormDistPagoVencimiento oidc={props.oidc} ui={props.ui} />
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

export default connect(mapStateToProps, mapDispatchToProps)(CreditoDistPagosVencimiento);
