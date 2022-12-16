const convertImageIntoBase64 = async (
  file: File,
  callback: (arg: string | ArrayBuffer | null) => any
) => {
  //TODO: callbackTYpe
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    callback(reader.result);
  };
  reader.onerror = (err) => {
    console.log("reader error: ", err);
  };
};

export default convertImageIntoBase64;
