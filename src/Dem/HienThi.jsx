function HienThi({dem}){
    return(
        <div>
            <h1>Số lượng: {dem}</h1>
            {dem === 0 && <p style={{color: 'red'}}>Giảm không được vượt quá 0</p>}
        </div>
    );
}

export default HienThi;