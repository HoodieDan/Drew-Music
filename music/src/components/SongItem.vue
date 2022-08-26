<template>
  <li class="flex justify-between items-center p-3 pl-6 cursor-pointer transition
        duration-300">
    <div>
        <a href="#" class="font-bold block text-blue-600">{{ song.modified_name }}</a>
        <span class="text-white-500 text-sm">{{ song.display_name }}</span>
    </div>

    <div class="text-blue-600 text-lg">
        <span class="comments">
            <i class="fa fa-comments text-blue-600"></i>
            {{ song.comment_count }}
        </span>
    </div>
  </li>
        
</template>

<script>
export default {
    name: 'SongItem',
    data () {
        return {

        }
    },
    props: ['song']
}
</script>

<style>

</style>