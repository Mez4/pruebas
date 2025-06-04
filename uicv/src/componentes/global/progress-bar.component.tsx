const ProgressBar = (props: any) => {
    const { bgcolor, completed } = props;
  
    const containerStyles = {
      height: 20,
      width: '100%',
      backgroundColor: "#e0e0de",
      borderRadius: 50,
      margin: 50
    }
  
    const fillerStyles = {
      height: '100%',
      width: `${completed}%`,
      backgroundColor: bgcolor,
      borderRadius: 'inherit',
      TextAlign: 'right',
      transition: 'width 1s ease-in-out'
    }
  
    const labelStyles = {
      padding: 5,
      color: 'white',
      FontWeight: 'bold'
    }
  
    return (
      <div style={containerStyles}>
        <div style={fillerStyles}>
          <span style={labelStyles}
            role="progressbar"
            aria-valuenow={completed}
            aria-valuemin={0}
            aria-valuemax={100}
          >{`${completed}%`}</span>
        </div>
      </div>
    );
  };
  
  export default ProgressBar;