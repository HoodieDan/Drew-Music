<template>
  <li class="flex justify-between items-center p-3 pl-6 cursor-pointer transition
        duration-300">
    <div>
        <router-link
        :to="{ name: 'song', params: { id: song.docID } }"
        class="font-bold block text-blue-600"
        >
            {{ song.modified_name }}
        </router-link>
        <span class="text-white-500 text-sm">{{ song.display_name }}</span>
    </div>

    <div class="text-blue-600 text-lg">
      <router-link custom
      :to="{ name: 'song', params: { id: song.docID }, hash: '#comments' }"
      v-slot="{ navigate }">
        <span class="comments" @click="navigate" @keydown="nav">
            <i class="fa fa-comments text-blue-600"></i>
            {{ song.comment_count }}
        </span>
      </router-link>
    </div>
  </li>

</template>

<script>
export default {
  name: 'SongItem',
  data() {
    return {
      event: '',
    };
  },
  methods: {
    nav(event) {
      this.event = event.key;
    },
  },
  props: ['song'],
};
</script>

<style>

</style>
