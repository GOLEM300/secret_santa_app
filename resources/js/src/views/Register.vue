<script setup>
import store from "../store";
import {useRouter} from "vue-router";
import { ref } from "vue";

const router = useRouter();
const user = {
    name: "",
    email: "",
    password: "",
};
const errors = ref({});

const is_register = ref(false);

function register(ev) {
    ev.preventDefault();
    is_register.value = true;
    store.dispatch("register", user)
        .then(() => {
            router.push({
                name: "SecretSanta",
            });
        })
        .catch(res_errors => {
            if (res_errors.response.status === 422) {
                errors.value = res_errors.response.data.data;
            }
            if (res_errors.response.status === 500) {
                errors.value = res_errors.response.data.data;
            }
            is_register.value = false;
        });
}
</script>

<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card centered-card">
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
                    <div class="card-body">
                        <h5 class="card-title text-center mb-4">Регистрация</h5>
                        <form @submit="register">
                            <div class="mb-3">
                                <label for="email" class="form-label">Email адрес</label>
                                <input type="email" class="form-control" id="email" placeholder="Введите ваш email"
                                       required v-model="user.email">
                            </div>
                            <div class="mb-3">
                                <label for="name" class="form-label">Имя</label>
                                <input type="text" class="form-control" id="name" placeholder="Введите ваше имя"
                                       required v-model="user.name">
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Пароль</label>
                                <input type="password" class="form-control" id="password" placeholder="Введите пароль"
                                       required v-model="user.password">
                            </div>
                            <button type="submit" :disabled="is_register" class="btn btn-primary w-100">Зарегистрироваться</button>
                        </form>
                        <a class="btn btn-primary w-100 mt-3" href="#" @click="$router.push('/auth/login')">Войти</a>
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
