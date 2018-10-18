<template>
  <div class="loader" v-show="showLoader">
    <half-circle-spinner
      :animation-duration="1000"
      :size="60"
      color="#0747a6"
    />
  </div>
</template>

<script>
  import { HalfCircleSpinner } from 'epic-spinners'

  export default {
    components: {
        HalfCircleSpinner
    },
    data() {
      return {
          showLoader: true
      }
    },
    mounted() {
        setTimeout(() => {
            this.showLoader = false;

            if (window.hasOwnProperty('Spine') &&
                window.hasOwnProperty('App') &&
                window.App.Browser.check()) {
                console.log('Zammad gefunden!');
            }
        }, 2000);
    }
  }
</script>

<style lang="scss" scoped>
  .loader {
    position: absolute;
    top: 170px;
    right: 170px;
  }

  p {
    font-size: 20px;
  }
</style>
