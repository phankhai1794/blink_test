import axios from 'axios';
export async function saveInquiry(data){
    const response = await axios.post(`${process.env.REACT_APP_API}/inquiry`,  data )
    return response.data 
}

export async function loadInquiry(id){
    const response = await axios.get(`${process.env.REACT_APP_API}/inquiry`, { params: {id: id} } )
    return response.data 
}

export async function loadMetadata(){
    const response = await axios.get(`${process.env.REACT_APP_API}/inquiry/metadata`)
    return response.data 
}