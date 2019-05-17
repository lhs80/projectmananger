import {validateNull} from '@/utils/validate'

/**
 * 存储localStorage
 */
export const setStore = (params) => {
  const {
    name,
    content
  } = params;
  const obj = {
    dataType: typeof (content),
    content: content,
    datetime: new Date().getTime()
  };
  window.sessionStorage.setItem(name, JSON.stringify(obj))
  // window.localStorage.setItem(name, JSON.stringify(obj))
};
/**
 * 获取localStorage
 */
export const getStore = (params) => {
  const {name} = params;
  let content;
  let obj = window.sessionStorage.getItem(name);
  // let obj = window.localStorage.getItem(name);
  // if (validateNull(obj)) obj = window.localStorage.getItem(name);
  if (validateNull(obj)) obj = window.sessionStorage.getItem(name);
  if (validateNull(obj)) return
  obj = JSON.parse(obj)
  if (obj.dataType === 'string') {
    content = obj.content
  } else if (obj.dataType === 'number') {
    content = Number(obj.content)
  } else if (obj.dataType === 'boolean') {
    content = eval(obj.content)
  } else if (obj.dataType === 'object') {
    content = obj.content
  }
  return content
};
/**
 * 删除localStorage
 */
export const removeStore = params => {
  let {
    name
  } = params;
  // window.localStorage.removeItem(name)
  window.sessionStorage.removeItem(name)
};
