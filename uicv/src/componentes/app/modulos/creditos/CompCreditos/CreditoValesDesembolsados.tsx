import {
  ActionSelect,
  Card,
  DatePickeEnd,
  DatePickeStart,
  Spinner,
  ImgViewer,
  CustomSelect,
  CustomSelect2,
} from "../../../../global";
import moment from "moment";
import { iUI } from "../../../../../interfaces/ui/iUI";
import { date, string } from "yup";
import { CFormValesDesembolsados } from "./CreditoValesDesembolsados/CFormValesDesembolsados";

import { IEstado } from "../../../../../interfaces/redux/IEstado";
import { connect } from "react-redux";
import { IOidc } from "../../../../../interfaces/oidc/IOidc";
import { useEffect } from "react";

type CatalogosType = {
  oidc: IOidc;
};

// useEffect(() => {

// }, [])

const CreditoValesDesembolsados = (props: CatalogosType) => {
  return (
    <div>
      <div className="row">
        <div className="col-12">
          <Card Title="Vales Desembolsados">
            <Card.Body>
              <Card.Body.Content>
                <div className="row">
                  <div className="col-12">
                    <div className="row">
                      <CFormValesDesembolsados oidc={props.oidc} />
                    </div>
                  </div>
                </div>
              </Card.Body.Content>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state: IEstado) => ({
  oidc: state.oidc,
  ui: state.UI,
});
const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreditoValesDesembolsados);
