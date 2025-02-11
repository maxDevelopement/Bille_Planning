
import { createRouter, createWebHistory } from 'vue-router';
import { checkUserConnexion } from './helpers/checks';
import login from './components/login.vue';
import calendar from './components/calendar/calendar.vue';
import profil from './components/profil.vue';
import agendaProg from './components/agendaProg/agendaProg.vue';
import agendaBenevol from './components/agendaBenevol/agendaBenevol.vue';

const routes = [
    { path: '/', component: login },
    { path: '/calendar', component: calendar },
    { path: '/agendaProg', component: agendaProg },
    { path: '/profil', component: profil },
    { path: '/agendaBenevol', component: agendaBenevol },
]

// création de l'historique de naviguation
const router = createRouter({
  history: createWebHistory(),
  routes : routes
})

router.beforeEach((to, from, next) => {
  const authenticated = checkUserConnexion()
  if(to.path !== '/' && !authenticated) next('/')
  else if(to.path === '/' && authenticated) next('/calendar')
  else next()
})
export default router