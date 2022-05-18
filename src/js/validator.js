const notValid = " 입력되지 않았거나 올바르지 않습니다.";

let telValidator = (value) => {
  const telRegExp = /^\d{3}-\d{4}-\d{4}$/;
  return telRegExp.test(value);
};

let emailValidator = (value) => {
  const emailRegExp =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  return emailRegExp.test(value);
};

let nameValidator = (value) => {
  const nameRegExp = /^[가-힣]{2,8}$/;
  return nameRegExp.test(value);
};

let roleValidator = (value) => {
  return value != null;
};

let pwValidator = (value) => {
  const pwRegExp =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  return pwRegExp.test(value);
};

let pwCheckValidator = (value1, value2) => {
  return value1 == value2 && value1 != "" && value1 != null;
};

export {
  telValidator,
  nameValidator,
  roleValidator,
  pwValidator,
  pwCheckValidator,
  emailValidator,
};
