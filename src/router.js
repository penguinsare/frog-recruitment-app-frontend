import JobsTable        from './components/JobsTable'
import EditJob          from './components/modals/EditJob.vue'
import SendCandidate    from './components/modals/SendCandidate'
import AddPlacement     from './components/modals/AddPlacement'
import ClientsTable     from './components/ClientsTable'
import EditClient       from './components/modals/EditClient.vue'
import TermsOfBusiness  from './components/TermsOfBusiness.vue'
import CandidatesTable  from './components/CandidatesTable.vue'
import GenerateReport   from './components/modals/GenerateReport.vue'
import EditCandidate    from './components/modals/EditCandidate.vue'
import AddCv            from './components/modals/AddCv.vue'
import UsersTable       from './components/UsersTable.vue'
import AddUser          from './components/modals/AddUser.vue'
import TransferAssets   from './components/modals/TransferAssets.vue'
import ChangeUserPassword from './components/modals/ChangeUserPassword.vue'
import Vue              from 'vue'
import Router           from 'vue-router'
import Callback         from './views/Callback'
import Unauthorized     from './views/Unauthorized'
import StartLogin       from './views/StartLogin'
import Home             from './views/Home.vue'
import store            from './vuexStore'
import mgr              from './services/security.js'

Vue.use(Router)

let router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true, 
        access: ['normal', 'elevated']
      }
    },
    {
      path: '*',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true, 
        access: ['normal', 'elevated']
      }
    },
    {path: '/login',                component: StartLogin,      meta: {requiresAuth: false}},
    {path: '/jobs',                 component: JobsTable,       name: 'jobs',               meta: {requiresAuth: true, access: ['normal', 'elevated']}},
    {path: '/jobs/filtered',        component: JobsTable,       name: 'filtered-jobs',      meta: {requiresAuth: true, access: ['normal', 'elevated']}},
    {path: '/jobs/add',             component: EditJob,         name: 'add-job',            meta: {requiresAuth: true, access: ['normal', 'elevated']}},
    {path: '/jobs/edit',            component: EditJob,         name: 'edit-job',           meta: {requiresAuth: true, access: ['normal', 'elevated']}},
    {path: '/jobs/sendCandidate',   component: SendCandidate,   name: 'send-candidate',     meta: {requiresAuth: true, access: ['normal', 'elevated']}},
    {path: '/jobs/addPlacement',    component: AddPlacement,    name: 'add-placement',      meta: {requiresAuth: true, access: ['normal', 'elevated']}},
    {path: '/jobs/upload-file',     component: AddCv,           name: 'upload-job-file',    meta: {requiresAuth: true, access: ['normal', 'elevated']}},
    {path: '/clients',              component: ClientsTable,    name: 'clients',            meta: {requiresAuth: true, access: ['normal', 'elevated']}},
    {path: '/clients/add',          component: EditClient,      name: 'add-client',         meta: {requiresAuth: true, access: ['normal', 'elevated']}},
    {path: '/clients/edit',         component: EditClient,      name: 'edit-client',        meta: {requiresAuth: true, access: ['normal', 'elevated']}},
    {path: '/clients/upload-file',  component: AddCv,           name: 'upload-client-file', meta: {requiresAuth: true, access: ['normal', 'elevated']}},
    {path: '/candidates',           component: CandidatesTable, name: 'candidates',         meta: {requiresAuth: true, access: ['normal', 'elevated']}},
    {path: '/candidates/add',       component: EditCandidate,   name: 'add-candidate',      meta: {requiresAuth: true, access: ['normal', 'elevated']}},
    {path: '/candidates/edit',      component: EditCandidate,   name: 'edit-candidate',     meta: {requiresAuth: true, access: ['normal', 'elevated']}},
    {path: '/candidates/upload-cv', component: AddCv,           name: 'upload-cv',          meta: {requiresAuth: true, access: ['normal', 'elevated']}},
    {path: '/candidates/generate-report', component: GenerateReport, name: 'generate-report', meta: {requiresAuth: true, access: ['normal', 'elevated']}},
    {path: '/terms-of-business',    component: TermsOfBusiness, name: 'terms-of-business',  meta: {requiresAuth: true, access: ['normal', 'elevated']}},
    {path: '/users',                component: UsersTable,      name: 'users',          meta: {requiresAuth: true, access: ['elevated']}},
    {path: '/users/add',            component: AddUser,         name: 'add-user',       meta: {requiresAuth: true, access: ['elevated']}},
    {path: '/users/edit',           component: AddUser,         name: 'edit-user',       meta: {requiresAuth: true, access: ['elevated']}},
    {path: '/users/transferAssets', component: TransferAssets,  name: 'transfer-assets', meta: {requiresAuth: true, access: ['elevated']}},
    {path: '/users/change-user-password', component: ChangeUserPassword,      name: 'change-user-password',meta: {requiresAuth: true, access: ['elevated']}},
    {
      path: '/callback',
      name: 'callback',
      component: Callback,
      meta: {requiresAuth: false}
    },
    {
      path: '/unauthorized',
      name: 'Unauthorized',
      component: Unauthorized,
      meta: {requiresAuth: false}
    },
  ]
})

export default router;

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth )){
    if (!store.getters.isAuthenticated){
      mgr.signinSilent()
      .then((user) => {
        if (user == null){
          mgr.signinRedirect(to.path)
          .then(() => {
            store.commit("authenticationSuccessful");
            store.commit("loadUser", user);
            if (store.getters.isAuthenticated){
              if (to.meta.access.some((accessItem) => accessItem == store.getters.user.profile.access)){
                next();
              }else{
                next('/');
              }                                  
            }else{
              next('/unauthorized');
            }
          });
        }
        else{
          store.commit("authenticationSuccessful");
          store.commit("loadUser", user);
          if (store.getters.isAuthenticated){
            if (to.meta.access.some((accessItem) => accessItem == store.getters.user.profile.access)){
              next();
            }else{
              next('/');
            }                                  
          }else{
            next('/unauthorized');
          }
        }
      })
      .catch( (err) => {
        console.log(err);
        mgr
        .signinRedirect(to.path)
        .then((user) => {
          if (user != null){
            store.commit("authenticationSuccessful");
            store.commit("loadUser", user);
            if (store.getters.isAuthenticated){
              if (to.meta.access.some((accessItem) => accessItem == store.getters.user.profile.access)){
                next();
              }else{
                next('/');
              }                                  
            }else{
              next('/unauthorized');
            }
          }
          else{
          }
        });
      });
    }
    
    if (store.getters.isAuthenticated && 
        to.meta.access.some((accessItem) => accessItem == store.getters.user.profile.access)){
      next();
    }
  }
  else{
    next();
  }
});