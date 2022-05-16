<template>
  <div>
    <b-field :type="isValid(nameValidator())">
      <b-input v-model="name" />
    </b-field>
    <b-field :type="isValid(telValidator())">
      <b-input v-model="tel" />
    </b-field>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import {
  nameValidator,
  telValidator,
  emailValidator,
} from "../../js/validator";
export default Vue.extend({
  data() {
    return {
      tel: "",
      name: "",
      email: "",
    };
  },
  computed: {
    telValidator() {
      return telValidator(this.tel);
    },
    nameValidator() {
      return nameValidator(this.name);
    },
    emailValidator() {
      return emailValidator(this.email);
    },
  },
  methods: {
    isValid(bool) {
      return bool ? "is-success" : "is-danger";
    },
  },
});
</script>
