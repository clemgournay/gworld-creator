export const FindIndexByPropValue = (arr: Array<any>, key: string, value: any) => {
  let i = 0, found = false;
  while (!found && i < arr.length) {
    const item = arr[i];
    if (item[key] === value) found = true;
    else i++;
  }
  return found ? i : -1;
}

export const FindItemByPropValue = (arr: Array<any>, key: string, value: any) => {
  const index = FindIndexByPropValue(arr, key, value);
  return index >= 0 ? arr[index] : null;
}
