<template>
  <div class="loader" v-if="showLoader">
    <half-circle-spinner
      :animation-duration="1000"
      :size="60"
      color="#0747a6"
    />
  </div>
  <div class="container mt-2" v-else>
    <div class="row">
      <div class="col">
        <div class="row">
          <div class="col">
            <h4>Create issue</h4>
          </div>
          <div class="col-1 p-0 mr-1 text-center">
            <i class="fa fa-cogs"></i>
          </div>
        </div>
        <form>
          <div class="form-group">
            <label for="summaryInput">Summary</label>
            <input type="text" class="form-control" id="summaryInput" aria-describedby="summaryInput" placeholder="Enter summary">
          </div>
          <div class="form-group">
            <label for="descriptionTextarea">Description</label>
            <textarea class="form-control" id="descriptionTextarea" rows="6" placeholder="Enter description"></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
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
