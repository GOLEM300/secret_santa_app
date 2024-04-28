<script setup>
import store from "../store";
import router from "../router/index.js";
import {ref} from "vue";

const user = {
    email: "",
    password: "",
};
const is_login = ref(false);
const error_msg = ref(false);

console.log(user)

function login(ev) {
    ev.preventDefault();
    is_login.value = true;

    store.dispatch("login", user)
        .then(() => {
            router.push({
                name: "SecretSanta",
            });
        })
        .catch((res_errors) => {
            console.log(res_errors)
            error_msg.value = true;
            is_login.value = false;
        });
}
</script>

<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card centered-card">
                    <div v-if="error_msg" class="card error-card">
                        <div class="card-header bg-danger text-white">
                            <button type="button" class="btn-close float-end" @click="error_msg=''"></button>
                        </div>
                        <div class="card-body">
                            <ul class="list-group">
                                <li class="list-group-item list-group-item-danger">Что то не так</li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title text-center mb-4">Вход</h5>
                        <form @submit="login">
                            <div class="mb-3">
                                <label for="email" class="form-label">Email адрес</label>
                                <input type="email" class="form-control" id="email" placeholder="Введите ваш email"
                                       required v-model="user.email">
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Пароль</label>
                                <input type="password" class="form-control" id="password" placeholder="Введите пароль"
                                       required v-model="user.password">
                            </div>
                            <button type="submit" :disabled="is_login" class="btn btn-primary w-100">Войти</button>
                        </form>
                            <a class="btn btn-primary w-100 mt-3" href="#" @click="$router.push('/auth/register')">Зарегистрироваться</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="css">
.centered-card {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
