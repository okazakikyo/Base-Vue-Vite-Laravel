import API from './API'

export default {
    async login(payload: { email: string; password: string }) {
        const response = await API.post('/v1/login', payload);
        return response;
    },
}
