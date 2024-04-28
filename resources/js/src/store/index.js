import { createStore } from "vuex";
import axios from "axios";
import createPersistedState from "vuex-persistedstate";


const store = createStore({
    plugins: [createPersistedState()],
    state: {
        user: {
            email: '',
            token: sessionStorage.getItem("token"),
            secret_santa_email: ''
        },
        available_users: {
            data: {}
        }
    },
    getters: {
        userEmail (state) {
            return state.user.email;
        },
        getUserSecretSantaEmail (state) {
            return state.user.your_secret_santa_email;
        },
        getUser(state) {
            return state.user;
        }
    },
    actions: {
        register({commit}, user) {
            return axios.post(import.meta.env.VITE_DEV_HOST+'/api/v1/auth/register', user)
                .then(({data}) => {
                    console.log(data.user)
                    commit('setUserEmail', data.email);
                    commit('setToken', data.token);
                    return data;
                });
        },
        login({commit}, user) {
            return axios.post(import.meta.env.VITE_DEV_HOST+'/api/v1/auth/login', user)
                .then(({data}) => {
                    console.log(data.user)
                    commit('setUserEmail', data.email);
                    commit('setToken', data.token);
                    return data;
                });
        },
        logout({commit}) {
            return axios.get(import.meta.env.VITE_DEV_HOST+'/api/v1/auth/logout',{
                headers: {Authorization :`Bearer ${sessionStorage.getItem('TOKEN')}`}
            })
                .then(res => {
                    commit('logout');
                    return res;
                })
        },
        getAllAvailableUsers({commit}) {
            return axios.get(import.meta.env.VITE_DEV_HOST+'/api/v1/secret_santa', {
                headers: {Authorization :`Bearer ${sessionStorage.getItem('TOKEN')}`}
            })
                .then((res) => {
                    commit('setAvailableUsers', res.data.users);
                    return res;
                })
        },
        storeNewSecretSanta({commit}, secret_santa_email) {
            return axios.post(import.meta.env.VITE_DEV_HOST+'/api/v1/secret_santa/store', {'email' : secret_santa_email},{
                headers: {Authorization :`Bearer ${sessionStorage.getItem('TOKEN')}`},
            })
                .then((res) => {
                    commit('setUserSecretSanta', secret_santa_email);
                    return res;
                })
        },
        getUserSecretSanta({commit}) {
            return axios.get(import.meta.env.VITE_DEV_HOST+'/api/v1/secret_santa/secret_santa_email', {
                headers: {Authorization :`Bearer ${sessionStorage.getItem('TOKEN')}`}
            })
                .then((res) => {
                    commit('setUserSecretSanta', res.data.secret_santa_email);
                })
        },
    },
    mutations: {
        logout: (state) => {
            state.user = {
                email: '',
                token: null,
                secret_santa_email: ''
            };
            sessionStorage.removeItem("TOKEN");
        },
        setToken: (state, token) => {
            state.user.token = token;
            sessionStorage.setItem('TOKEN', token);
        },
        setUserSecretSanta: (state, secret_santa_email) => {
            state.user.secret_santa_email = secret_santa_email;
        },
        setUserEmail: (state, email) => {
            state.user.email = email;
        },
        setAvailableUsers: (state, data) => {
            state.available_users.data = data;
        }
    }
});

export default store;
