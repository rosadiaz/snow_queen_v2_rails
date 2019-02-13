const Dom = {
  showNode: (node) => {
    node.classList.remove("hidden");
  },
  hideNode: (node) => {
    node.classList.add("hidden");
  },
}

export default Dom;
