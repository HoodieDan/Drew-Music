export default {
  beforeMount(el, binding) {
    let iconClass = `fa fa-${binding.value} float-right text-xl`;

    if (binding.arg === 'full') {
      iconClass = binding.value;
    }

    if (binding.modifiers.right) {
      iconClass += ' float-right ';
    }

    if (binding.modifiers.green) {
      iconClass += ' text-blue-600 ';
    }

    // eslint-disable-next-line no-param-reassign
    el.innerHTML += `<i class="${iconClass}"></i>`;
  },
};
