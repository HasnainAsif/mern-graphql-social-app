const validateRegisterInput = ({
  username,
  email,
  password,
  confirmPassword,
}) => {
  const errors = {};
  if (username.trim() === '') {
    errors.username = 'Username must not be empty';
  }
  if (email.trim() === '') {
    errors.email = 'Email must not be empty';
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-w]*[0-9a-zA-Z].)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address';
    }
  }
  if (password.trim() === '') {
    errors.password = 'Password must not be empty';
  } else if (password !== confirmPassword) {
    errors.password = 'Passwords must match';
  }

  return {
    errors,
    valid: Object.keys(errors).length <= 0,
  };
};

const validateLoginInput = ({ username, password }) => {
  const errors = {};
  if (username.trim() === '') {
    errors.username = 'Username must not be empty';
  }
  if (password.trim() === '') {
    errors.password = 'Password must not be empty';
  }

  return {
    errors,
    valid: Object.keys(errors).length <= 0,
  };
};

const validateBody = ({ body }) => {
  const errors = {};
  if (body.trim() === '') {
    errors.body = 'Body must not be empty';
  }

  return {
    errors,
    valid: Object.keys(errors).length <= 0,
  };
};
// let [moveUp, moveDown] = Array(2).fill(5); // assigning same value to multiple variables
// const [validateCommentInput, validatePostInput] = Array(2).fill(validateBody);

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validatePostInput: validateBody,
  validateCommentInput: validateBody,
};
