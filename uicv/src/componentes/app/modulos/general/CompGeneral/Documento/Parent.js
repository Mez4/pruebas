import React from "react";


const Parent = params => {
  return (
    <>
      <button onClick={() => params.setName("i'm from Parent")}>
        from Parent
      </button>
    
    </>
  );
};
export default Parent;
