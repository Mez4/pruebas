import React from "react";
import { Input, Collection } from "usetheform";

export function ShopInfo() {
  return (
      <div className="columns">
        <Collection object name="info">
          <div className="column">
            <label className="label is-small">Importe Total $</label>
            <Input
              className="input is-small"
              disabled
              type="text"
              value="0"
              name="totalPrice"
              readOnly
            />
          </div>
          <div className="column">
            <label className="label is-small">Artículos</label>
            <Input
              className="input is-small"
              disabled
              type="text"
              value="0"
              name="totalItems"
              readOnly
            />
          </div>
          <div className="column">
            <label className="label is-small">Cantidad Total</label>
            <Input
              className="input is-small"
              disabled
              type="text"
              value="0"
              name="totalQty"
              readOnly
            />
          </div>
        </Collection>
      </div>
  );
}
