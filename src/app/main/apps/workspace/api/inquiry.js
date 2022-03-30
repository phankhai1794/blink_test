import axios from 'axios';

axios.defaults.headers.common['Authorization'] = `${localStorage.getItem('AUTH_TOKEN')}`

export async function saveInquiry(data) {
    const response = await axios.post(`${process.env.REACT_APP_API}/inquiry`, data)
    return response.data
}

export async function saveComment(data) {
    const response = await axios.post(`${process.env.REACT_APP_API}/inquiry/comment`, data)
    return response.data
}

export async function loadInquiry(id) {
    const response = await axios.get(`${process.env.REACT_APP_API}/inquiry/${id}`)
    return response.data
}

export async function loadMetadata() {
    const response = await axios.get(`${process.env.REACT_APP_API}/inquiry/metadata`)
    return response.data
}

export async function loadComment(id) {
    const response = await axios.get(`${process.env.REACT_APP_API}/inquiry/comment/${id}`)
    return response.data
}

export async function deleteComment(id) {
    const response = await axios.delete(`${process.env.REACT_APP_API}/inquiry/comment/${id}`)
    return response.data
}

export async function editComment(id, content) {
    const response = await axios.patch(`${process.env.REACT_APP_API}/inquiry/comment/${id}`, {content})
    return response.data
}

export async function changeStatus(id, state) {
    const response = await axios.patch(`${process.env.REACT_APP_API}/inquiry/status/${id}`, {state})
    return response.data
}