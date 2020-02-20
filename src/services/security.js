import Oidc from 'oidc-client';
import store from '../vuexStore';
Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.INFO;

var authorityUrl = 'https://localhost:57042';
var someUrl = "https://localhost:8080";

var mgr = new Oidc.UserManager({
  authority: authorityUrl ,
  client_id: 'vuejs_code_client',
  redirect_uri: someUrl + '/#callback',
  response_type: 'code',
  scope: 'openid profile email IdentityServerApi offline_access customProfile',
  post_logout_redirect_uri: someUrl,
  userStore: new Oidc.WebStorageStateStore({ store: window.localStorage }),
  checkSessionInterval: 200,
  automaticSilentRenew: true,
  silent_redirect_uri: someUrl + '/#silent-renew',
  accessTokenExpiringNotificationTime: 10,
  revokeAccessTokenOnSignout: true,
  silentRequestTimeout: 2000
});



mgr.events.addUserLoaded(function (user) {  
  store.commit("authenticationSuccessful");
  store.commit("loadUser", user);
});

mgr.events.addAccessTokenExpiring(function () {
});

mgr.events.addAccessTokenExpired(function () {
  store.commit("authenticationRequired"); 
  store.commit("unloadUser"); 
  //alert('Session expired. Going out!');
  mgr.signoutRedirect().then(function (resp) {
  }).catch(function (err) {
    console.log(err);
  });
});

mgr.events.addSilentRenewError(function () {
  console.error('Silent Renew Error：', arguments);
});

mgr.events.addUserSignedOut(function () {
  store.commit("authenticationRequired"); 
  store.commit("unloadUser"); 
  mgr.signoutRedirect()
  .then()
  .catch(function (err) {
    console.log(err);
  });
});


export default mgr;

