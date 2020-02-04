<template>
    <div>
        <p>Sign-in in progress</p>
    </div>
</template>

<script>
    export default {
        name: "app",
        data() {
            return {
                prevRoute: null
            }
        },
        async created() {
            try {
                var result = await this.$root.mgr
                .signinRedirectCallback(this.$root.$route.fullPath)
                .then((user) => {
                    if (user != null){
                        this.$router.push({ name: 'home' }); 
                    }
                    else{
                        this.$router.push({ name: 'Unauthorized' });
                    }
                });
            } catch (e) {
            }
        }
    }
</script>