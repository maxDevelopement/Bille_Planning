<template>
    <form id="loginForm" @submit.prevent="handleLoginSubmit">
        <h3>Login</h3>
        <input id="loginInput" type="text" placeholder="Login">
        <input id="passwordInput" type="password" placeholder="Mot de passe">
        <input id="submitInput" type="submit" value="Se connecter">
        <input v-if="isLoginError" type="text" value="Il y a une erreur dans le login ou mot de passe" disabled>
    </form>
</template>
<script>
    import { ref } from 'vue'; 
    import { useRouter, useRoute } from 'vue-router';
    import $ from 'jquery';
    import navbar from './navbar.vue';
    import { loginRequest } from '../helpers/requests.js';
    import { setUserConnexion } from '../helpers/setters.js'

    export default{
        name: 'homepage',
        components: {
            'nav-bar': navbar,
        },
        setup(){ 
            const router = useRouter()
            const route = useRoute() 
            const isLoginError = ref(false) 

            const handleLoginSubmit = async() => {
                const login = $('#loginInput').val()
                const password = $('#passwordInput').val()
                ////console.log("data : ", login, ", ", password)
                const loginReq = await loginRequest({ login: login, password: password })
                ////console.log(loginReq)
                if(loginReq.msg ==='success_login'){
                    ////console.log(loginReq.data)
                    setUserConnexion(loginReq.data)
                    router.push('/calendar')
                }else{
                    isLoginError.value = true                    
                }
            }
            return {
                handleLoginSubmit,
                isLoginError
            }
        },
    }
</script>

<style>

</style>