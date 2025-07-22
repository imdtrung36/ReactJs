import { useState } from "react";

function FormTen({onThemTen}){
    const[tenMoi, setTenMoi] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if(tenMoi.trim() !== ''){
            onThemTen(tenMoi);
            setTenMoi('');
        }
    };
    return(
        <form onSubmit={handleSubmit} style={{marginBottom: '20px'}}>
            <input 
                type="text" 
                placeholder="Nhập Tên..."
                value={tenMoi}
                onChange={(e) => setTenMoi(e.target.value)}
                style={{marginRight: '10px'}}
            />
            <button type="submit">Thêm Tên</button>
        </form>
    );
}

export default FormTen;