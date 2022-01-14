export const initialValueChangedValidator = (initialValue: any): any => {
  return (control: {value: any}) => {
    if (JSON.stringify(initialValue) !== JSON.stringify(control.value)) {
      return {
        changed: true
      }
    }
    return null;
  }
}
