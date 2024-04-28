<script setup>
import store from "../store/index.js";
import router from "../router/index.js";

const user = store.getters.getUser;

console.log(user)

function logout() {
    store.dispatch("logout").then(() => {
        router.push({
            name: "Login",
        });
    });
}
</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container">
            <span class="navbar-brand">Секретный Санта</span>
            <div class="d-flex">
                <a class="btn btn-primary" href="#" @click="logout">Выйти</a>
            </div>
        </div>
    </nav>
</template>

<style scoped lang="css">

</style>
