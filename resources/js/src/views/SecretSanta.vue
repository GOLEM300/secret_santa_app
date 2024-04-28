<script setup>
import NavBar from "../components/NavBar.vue";
import {computed, ref} from "vue";
import {useStore} from "vuex";


const store = useStore();
const is_store = ref(false);
const errors = ref({});
const user = store.getters.getUser;
const secret_santa_email = ref('');

store.dispatch('getAllAvailableUsers');
store.dispatch('getUserSecretSanta');

const available_users = computed(() => store.state.available_users.data);

function storeNewSecretSanta(ev) {
    ev.preventDefault();
    is_store.value = true;
    store.dispatch("storeNewSecretSanta",secret_santa_email.value)
        .then(() => {
            user.secret_santa_email = secret_santa_email.value;
        })
        .catch((res_errors) => {
            console.log(res_errors,321)
            if (res_errors.response.status === 422) {
                errors.value = res_errors.response.data.errors;
            }
            if (res_errors.response.status === 500) {
                errors.value = res_errors.response.data.errors;
            }
            is_store.value = false;
        });
}
</script>

<template>
    <nav-bar></nav-bar>
    <div v-if=!user.secret_santa_email class="container">
        <div class="row">
            <div class="col-md-6 mx-auto">
                <div v-if="Object.keys(errors).length" class="card error-card">
                    <div class="card-header bg-danger text-white">
                        <button type="button" class="btn-close float-end" @click="errors={}"></button>
                    </div>
                    <div class="card-body" v-for="(error_values) in errors">
                        <ul class="list-group" v-for="error in error_values">
                            <li class="list-group-item list-group-item-danger">{{error}}</li>
                        </ul>
                    </div>
                </div>
                <div class="card centered-card">
                    <div v-if="available_users.length" class="card-body">
                        <form>
                            <div class="input-group input-group-custom">
                                <select class="form-control" v-model="secret_santa_email">
                                    <option v-for="user in available_users" :value="user">{{ user }}</option>
                                </select>
                                <button class="btn btn-primary" :disabled="is_store" @click="storeNewSecretSanta" type="button">Отправить</button>
                            </div>
                        </form>
                    </div>
                    <div v-else class="card text-center centered-card" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">Нет Сант</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="card text-center centered-card" style="width: 18rem;">
        <div class="card-body">
            <p class="card-text">Ты выбрал себе Санту и ему отправлено уведомление в файл laravel.log</p>
            <p class="card-text">Статус: <span class="text-success">успешно выполнено</span></p>
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><strong>Твоя почта:</strong> {{user.email}}</li>
                <li class="list-group-item"><strong>Почта твоего Санты:</strong> {{user.secret_santa_email}}</li>
            </ul>
        </div>
    </div>
</template>

<style scoped lang="css">
/* Дополнительный CSS для размещения карточки посередине и разделения между элементами */
.centered-card {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
