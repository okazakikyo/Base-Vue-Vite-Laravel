import API from './API'

export default {
    async getCategories() {
        const response = await API.get('/v1/categories');
        return response;
    },
}
