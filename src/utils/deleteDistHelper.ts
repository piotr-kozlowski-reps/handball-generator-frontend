const deleteDistHelper = (link: string) => {
  if (link.startsWith("dist")) {
    return link.slice(5);
  }

  return link;
};

export default deleteDistHelper;
