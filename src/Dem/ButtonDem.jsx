function ButtonDem({tang, giam, datLai}){
    return(
        <div>
            <button onClick={giam} style={{marginRight: '10px'}}>Giảm</button>
            <button onClick={tang} style={{marginRight: '10px'}}>Tăng</button>
            <button onClick={datLai}>Đặt Lại</button>
        </div>
    );
}

export default ButtonDem;