import axios from '@shared/axios';
const PATH = '/mybl';

export async function createBlTrans(mybl, content) {
    const response = await axios().post(`/trans/createBlTrans`, {mybl, content});
    return response.data;
}

export async function getMyBLTrans(id) {
    const response = await axios().get(`/trans/getMyBLTrans/${id}`);
    
    return response;
}
