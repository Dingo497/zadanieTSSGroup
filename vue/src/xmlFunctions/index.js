export const functions = {
  getData: (data, find) => {
    let defaultData = data;
      while (data.tagName !== find) {
        data = data.nextElementSibling;
        if(data === null) {
          while (defaultData.tagName !== find) {
            defaultData = defaultData.previousElementSibling ;
          }
          return defaultData.innerHTML;
        }
      }
      return data.innerHTML;
   }
}