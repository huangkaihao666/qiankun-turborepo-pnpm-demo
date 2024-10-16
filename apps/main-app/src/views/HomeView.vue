<template>
  <div>
    <h1>Home Page</h1>
    <button @click="goToSubApp1">Go to Sub App 1</button>
    <button @click="goToSubApp2">Go to Sub App 2</button>
  </div>
</template>

<script>
export default {
  methods: {
    goToSubApp1() {
      this.$router.push({ name: 'SubApp1' });
    },
    goToSubApp2() {
      this.$router.push({ name: 'SubApp2' });
    },
  },
};
</script>