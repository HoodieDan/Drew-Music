<template>
  <div class="loader-container">
    <div id="loader">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WaveLoader',
};
</script>

<style scoped>
div.loader-container {
    height: 5rem;
    width: 100%;
}
#loader {
    position:relative;
    background-color: transparent;
    margin: 30px auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

#loader span {
  display: block;
  width: 0.2rem;
  height: 0.3rem;
  background: #0bce5a;
  animation: loader 1.5s ease-in-out infinite;
  margin: 0 2px;
  border-radius: 0.5rem;
}

#loader span:nth-child(2){
    animation-delay: .15s;
}

#loader span:nth-child(3){
    animation-delay: .3s;
}

#loader span:nth-child(4){
    animation-delay: .45s;
}

#loader span:nth-child(5){
    animation-delay: .6s;
}

#loader span:nth-child(6){
    animation-delay: 0.75s;
}

#loader span:nth-child(7){
    animation-delay: 0.9s;
}

#loader span:nth-child(8){
    animation-delay: 1.05s;
}

#loader span:nth-child(9){
    animation-delay: 1.2s;
}

#loader span:nth-child(9){
    animation-delay: 1.35s;
}
#loader span:nth-child(10){
    animation-delay: 1.5s;
}
#loader span:nth-child(11){
    animation-delay: 1.65s;
}
#loader span:nth-child(12){
    animation-delay: 1.8s;
}
#loader span:nth-child(13){
    animation-delay: 1.95s;
}
#loader span:nth-child(14){
    animation-delay: 2.1s;
}
#loader span:nth-child(15){
    animation-delay: 2.25s;
}

@keyframes loader {
    100% { height: 2rem; }
}
</style>
