const Dom = {
  showNode: (node) => {
    if (node && node.classList) {
      node.classList.remove("hidden");
    }
  },
  hideNode: (node) => {
    if (node && node.classlist) {
      node.classList.add("hidden");
    }
  },
}

export default Dom;
